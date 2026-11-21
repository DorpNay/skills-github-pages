"""Encrypted input/output payload storage for the AgentRun lifecycle journal.

Run/task records contain opaque references only. This vault stores bounded user goals and
agent outputs as authenticated ciphertext in the same private SQLite file; it never logs
plaintext. The encryption key is supplied by the operator and must remain stable while
retained runs need to be read.
"""
from __future__ import annotations

import hashlib
import os
import re
import sqlite3
import time
from contextlib import closing
from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken


class AgentPayloadError(ValueError):
    """Base error for invalid, expired, or unavailable AgentRun payloads."""


class AgentPayloadConflict(AgentPayloadError):
    """An existing payload reference was reused with different plaintext."""


class AgentPayloadExpired(AgentPayloadError):
    """The encrypted payload has passed the configured retention period."""


class AgentPayloadVault:
    """File-backed Fernet vault for bounded AgentRun input and output payloads."""

    _RUN_ID = re.compile(r"^[A-Fa-f0-9-]{16,128}$")
    _KINDS = frozenset({"input", "output"})

    def __init__(
        self,
        path: str | Path,
        encryption_key: str,
        *,
        retention_seconds: int = 604_800,
        max_payload_bytes: int = 262_144,
    ) -> None:
        if not isinstance(encryption_key, str) or not encryption_key:
            raise AgentPayloadError("AgentRun encryption key is required")
        try:
            self._cipher = Fernet(encryption_key.encode("ascii"))
        except (ValueError, UnicodeEncodeError) as exc:
            raise AgentPayloadError("AgentRun encryption key must be a valid Fernet key") from exc
        if isinstance(retention_seconds, bool) or not isinstance(retention_seconds, int) or not 60 <= retention_seconds <= 31_536_000:
            raise AgentPayloadError("retention_seconds must be between 60 and 31536000")
        if isinstance(max_payload_bytes, bool) or not isinstance(max_payload_bytes, int) or not 1024 <= max_payload_bytes <= 2_097_152:
            raise AgentPayloadError("max_payload_bytes must be between 1024 and 2097152")
        self.path = str(path)
        if self.path == ":memory:":
            raise AgentPayloadError("AgentPayloadVault requires file-backed SQLite storage")
        self.retention_seconds = retention_seconds
        self.max_payload_bytes = max_payload_bytes

    @staticmethod
    def _identity(run_id: object, kind: object) -> tuple[str, str]:
        if not isinstance(run_id, str) or not AgentPayloadVault._RUN_ID.fullmatch(run_id):
            raise AgentPayloadError("run_id must be an opaque bounded identifier")
        if not isinstance(kind, str) or kind not in AgentPayloadVault._KINDS:
            raise AgentPayloadError("payload kind must be input or output")
        return run_id, kind

    def _connect(self) -> sqlite3.Connection:
        db = sqlite3.connect(self.path, timeout=5.0)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA busy_timeout=5000")
        db.execute("PRAGMA secure_delete=ON")
        return db

    def initialize(self) -> None:
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as db:
            db.execute(
                """CREATE TABLE IF NOT EXISTS agent_run_payloads (
                    run_id TEXT NOT NULL,
                    payload_kind TEXT NOT NULL CHECK(payload_kind IN ('input','output')),
                    ciphertext BLOB NOT NULL,
                    payload_sha256 TEXT NOT NULL,
                    created_at REAL NOT NULL,
                    PRIMARY KEY(run_id,payload_kind)
                )"""
            )
            db.execute(
                "CREATE INDEX IF NOT EXISTS idx_agent_payload_expiry ON agent_run_payloads(created_at)"
            )
            db.commit()
        os.chmod(self.path, 0o600)
        self.prune_expired()

    def put(self, *, run_id: str, kind: str, plaintext: str, now: float | None = None) -> None:
        run_id, kind = self._identity(run_id, kind)
        if not isinstance(plaintext, str) or not plaintext.strip():
            raise AgentPayloadError("payload must be non-empty text")
        raw = plaintext.encode("utf-8")
        if len(raw) > self.max_payload_bytes:
            raise AgentPayloadError("payload exceeds the configured byte limit")
        digest = hashlib.sha256(raw).hexdigest()
        encrypted = self._cipher.encrypt(raw)
        timestamp = time.time() if now is None else float(now)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            prior = db.execute(
                "SELECT payload_sha256 FROM agent_run_payloads WHERE run_id=? AND payload_kind=?",
                (run_id, kind),
            ).fetchone()
            if prior is not None:
                if prior["payload_sha256"] != digest:
                    db.rollback()
                    raise AgentPayloadConflict("payload reference already contains different content")
                db.commit()
                return
            db.execute(
                """INSERT INTO agent_run_payloads
                   (run_id,payload_kind,ciphertext,payload_sha256,created_at)
                   VALUES (?,?,?,?,?)""",
                (run_id, kind, encrypted, digest, timestamp),
            )
            db.commit()

    def get(self, *, run_id: str, kind: str, now: float | None = None) -> str:
        run_id, kind = self._identity(run_id, kind)
        timestamp = time.time() if now is None else float(now)
        with closing(self._connect()) as db:
            row = db.execute(
                """SELECT ciphertext,payload_sha256,created_at
                   FROM agent_run_payloads WHERE run_id=? AND payload_kind=?""",
                (run_id, kind),
            ).fetchone()
            if row is None:
                raise AgentPayloadError("payload not found")
            if timestamp - float(row["created_at"]) > self.retention_seconds:
                db.execute(
                    "DELETE FROM agent_run_payloads WHERE run_id=? AND payload_kind=?",
                    (run_id, kind),
                )
                db.commit()
                raise AgentPayloadExpired("payload has expired")
        try:
            raw = self._cipher.decrypt(bytes(row["ciphertext"]), ttl=self.retention_seconds)
            if hashlib.sha256(raw).hexdigest() != row["payload_sha256"]:
                raise AgentPayloadError("payload integrity check failed")
            return raw.decode("utf-8")
        except (InvalidToken, UnicodeDecodeError) as exc:
            raise AgentPayloadError("payload cannot be decrypted or authenticated") from exc

    def delete_run(self, *, run_id: str) -> None:
        if not isinstance(run_id, str) or not self._RUN_ID.fullmatch(run_id):
            raise AgentPayloadError("run_id must be an opaque bounded identifier")
        with closing(self._connect()) as db:
            db.execute("DELETE FROM agent_run_payloads WHERE run_id=?", (run_id,))
            db.commit()

    def prune_expired(self, *, now: float | None = None) -> int:
        timestamp = time.time() if now is None else float(now)
        cutoff = timestamp - self.retention_seconds
        with closing(self._connect()) as db:
            cursor = db.execute("DELETE FROM agent_run_payloads WHERE created_at<?", (cutoff,))
            db.commit()
            return int(cursor.rowcount)
