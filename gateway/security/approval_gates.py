"""Bounded one-time approvals bound to a canonical action, arguments and scope.

This is a policy primitive, not a public endpoint or an execution sandbox. Only an authenticated
human-confirmation handler may issue tickets; model output must never call issue() or mint consent.
"""
from __future__ import annotations

import hashlib
import json
import secrets
import threading
import time
from dataclasses import dataclass


class ApprovalError(ValueError):
    pass


def canonical_action_digest(action: str, arguments: dict, scope: str) -> str:
    if not isinstance(action, str) or not action or len(action) > 128:
        raise ApprovalError("invalid action")
    if not isinstance(scope, str) or not scope or len(scope) > 160:
        raise ApprovalError("invalid scope")
    if not isinstance(arguments, dict):
        raise ApprovalError("action arguments must be a JSON object")
    try:
        body = json.dumps({"action": action, "arguments": arguments, "scope": scope},
                          ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
    except (TypeError, ValueError) as exc:
        raise ApprovalError("action arguments must be bounded JSON data") from exc
    if len(body.encode("utf-8")) > 64_000:
        raise ApprovalError("approval payload exceeds 64 KiB")
    return hashlib.sha256(body.encode("utf-8")).hexdigest()


@dataclass(frozen=True)
class _Approval:
    digest: str
    actor_id: str
    expires_at: float


class ApprovalRegistry:
    def __init__(self, *, max_ttl_seconds: int = 300, max_entries: int = 1024):
        if not 10 <= max_ttl_seconds <= 900 or not 1 <= max_entries <= 100_000:
            raise ValueError("invalid approval registry limits")
        self.max_ttl_seconds = max_ttl_seconds
        self.max_entries = max_entries
        self._records: dict[str, _Approval] = {}
        self._lock = threading.Lock()

    def issue_after_human_confirmation(self, *, action: str, arguments: dict, scope: str,
                                       actor_id: str, ttl_seconds: int = 120) -> str:
        """Call only after an authenticated user explicitly approved the exact action."""
        if not isinstance(actor_id, str) or not actor_id or len(actor_id) > 160:
            raise ApprovalError("authenticated human actor_id is required")
        if isinstance(ttl_seconds, bool) or not isinstance(ttl_seconds, int) or not 10 <= ttl_seconds <= self.max_ttl_seconds:
            raise ApprovalError("approval TTL is outside policy")
        digest = canonical_action_digest(action, arguments, scope)
        now = time.monotonic()
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode("ascii")).hexdigest()
        with self._lock:
            self._records = {key: value for key, value in self._records.items() if value.expires_at > now}
            if len(self._records) >= self.max_entries:
                raise ApprovalError("approval registry is full")
            self._records[token_hash] = _Approval(digest, actor_id, now + ttl_seconds)
        return token

    def consume(self, token: str, *, action: str, arguments: dict, scope: str,
                actor_id: str | None = None) -> bool:
        """Atomically consume matching ticket; any mismatch invalidates this attempt."""
        if (not isinstance(token, str) or not 32 <= len(token) <= 256
                or not token.isascii() or not all(char.isalnum() or char in "-_" for char in token)):
            return False
        token_hash = hashlib.sha256(token.encode("ascii")).hexdigest()
        try:
            expected = canonical_action_digest(action, arguments, scope)
        except ApprovalError:
            return False
        now = time.monotonic()
        with self._lock:
            record = self._records.pop(token_hash, None)
        if record is None or record.expires_at <= now or record.digest != expected:
            return False
        # An approval ticket is bound to the authenticated human who issued it.
        # Missing identity must fail closed exactly like an identity mismatch.
        if not isinstance(actor_id, str) or not actor_id or len(actor_id) > 160:
            return False
        return secrets.compare_digest(actor_id.encode('utf-8'), record.actor_id.encode('utf-8'))
