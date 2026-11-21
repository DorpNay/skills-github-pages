"""Privacy-preserving trace context primitives for aLandi.

Trace IDs identify an operation, never its user content. This module deliberately keeps
prompts, transcripts, tool arguments, URLs with query strings, and tokens out of event data.
"""
from __future__ import annotations

import re
import time
import uuid
from contextvars import ContextVar, Token
from dataclasses import dataclass
from typing import Any, Mapping

_TRACE_ID = re.compile(r"^[0-9a-f]{32}$")
_TRACEPARENT = re.compile(r"^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$")
_current_trace_id: ContextVar[str | None] = ContextVar("alandi_trace_id", default=None)

# Only low-cardinality, non-sensitive attributes may be put on trace events.
_ALLOWED_ATTRIBUTE_KEYS = frozenset({
    "component", "operation", "outcome", "http_method", "http_status",
    "route", "model_tag", "duration_ms", "bytes_in", "bytes_out",
    "intent", "tier", "language", "error_code",
})
_SECRET_KEY_PARTS = ("token", "secret", "password", "authorization", "prompt", "transcript", "content", "query")


def _is_zero_hex(value: str) -> bool:
    return not value or set(value) == {"0"}


def normalize_trace_id(value: str | None) -> str | None:
    """Validate a trace ID. UUID hyphens are allowed; zero IDs and malformed input are not."""
    if not isinstance(value, str):
        return None
    normalized = value.strip().lower().replace("-", "")
    if not _TRACE_ID.fullmatch(normalized) or _is_zero_hex(normalized):
        return None
    return normalized


def trace_id_from_traceparent(value: str | None) -> str | None:
    if not isinstance(value, str):
        return None
    match = _TRACEPARENT.fullmatch(value.strip().lower())
    if not match:
        return None
    version, trace_id, parent_id, flags = match.group(0).split("-")
    if version == "ff" or _is_zero_hex(parent_id) or _is_zero_hex(trace_id):
        return None
    return normalize_trace_id(trace_id)


def new_trace_id() -> str:
    return uuid.uuid4().hex


def get_trace_id() -> str | None:
    return _current_trace_id.get()


def bind_trace_id(value: str | None = None) -> tuple[str, Token[str | None]]:
    trace_id = normalize_trace_id(value) or new_trace_id()
    return trace_id, _current_trace_id.set(trace_id)


def reset_trace_id(token: Token[str | None]) -> None:
    _current_trace_id.reset(token)


@dataclass(frozen=True)
class TraceEvent:
    trace_id: str
    event: str
    component: str
    timestamp_ns: int
    attributes: Mapping[str, str | int | float | bool]


def make_trace_event(event: str, component: str, attributes: Mapping[str, Any] | None = None) -> TraceEvent | None:
    """Create a metadata-only event, dropping unsafe/high-cardinality attributes."""
    trace_id = get_trace_id()
    if trace_id is None:
        return None
    safe: dict[str, str | int | float | bool] = {}
    for key, value in (attributes or {}).items():
        if not isinstance(key, str) or key not in _ALLOWED_ATTRIBUTE_KEYS:
            continue
        key_lower = key.lower()
        if any(secret_part in key_lower for secret_part in _SECRET_KEY_PARTS):
            continue
        if isinstance(value, bool) or isinstance(value, (int, float)):
            safe[key] = value
        elif isinstance(value, str) and len(value) <= 128 and not any(ord(char) < 32 for char in value):
            safe[key] = value
    return TraceEvent(
        trace_id=trace_id,
        event=event[:64],
        component=component[:64],
        timestamp_ns=time.time_ns(),
        attributes=safe,
    )


class TraceContextMiddleware:
    """ASGI middleware that accepts valid incoming trace IDs and always returns one."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            await self.app(scope, receive, send)
            return

        # ASGI headers are bytes/bytes; decode both sides before string-key lookup.
        headers = {
            key.decode("latin-1").lower(): value.decode("latin-1")
            for key, value in scope.get("headers", [])
        }
        supplied = normalize_trace_id(headers.get("x-ai-trace-id"))
        if supplied is None:
            supplied = trace_id_from_traceparent(headers.get("traceparent"))
        trace_id = supplied or new_trace_id()
        token = _current_trace_id.set(trace_id)
        scope.setdefault("state", {})["trace_id"] = trace_id

        async def send_with_trace(message):
            if message.get("type") == "http.response.start":
                response_headers = list(message.get("headers", []))
                response_headers = [
                    (name, value) for name, value in response_headers
                    if name.lower() != b"x-ai-trace-id"
                ]
                response_headers.append((b"x-ai-trace-id", trace_id.encode("ascii")))
                message["headers"] = response_headers
            await send(message)

        try:
            await self.app(scope, receive, send_with_trace)
        finally:
            _current_trace_id.reset(token)
