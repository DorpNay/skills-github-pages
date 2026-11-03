"""Durable, offline-first AgentRun/task lifecycle store.

This module persists orchestration state only. It does not call models, execute tools,
grant capabilities, or provide a sandbox. Event details must contain bounded metadata,
never prompts, secrets, transcripts, or raw tool arguments/results.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import secrets
import sqlite3
import time
import uuid
from contextlib import closing
from dataclasses import dataclass
from pathlib import Path
from typing import Any


class AgentRunError(ValueError):
    """Base error for invalid or unavailable AgentRun lifecycle operations."""


class IdempotencyConflict(AgentRunError):
    """An idempotency key was reused for a different request."""


class InvalidTransition(AgentRunError):
    """The requested lifecycle transition is not allowed."""


class LeaseError(AgentRunError):
    """A task claim is invalid, expired, or no longer owned by the caller."""


RUN_STATES = frozenset({
    "queued", "running", "waiting_approval", "verifying", "succeeded",
    "failed", "cancelled", "budget_exhausted", "needs_human",
})
TERMINAL_RUN_STATES = frozenset({"succeeded", "failed", "cancelled", "budget_exhausted"})
TASK_STATES = frozenset({"queued", "leased", "succeeded", "failed", "cancelled"})

RUN_TRANSITIONS = {
    "queued": {"running", "waiting_approval", "cancelled", "failed", "budget_exhausted"},
    "running": {"waiting_approval", "verifying", "failed", "cancelled", "budget_exhausted", "needs_human"},
    "waiting_approval": {"running", "cancelled", "failed", "needs_human"},
    "verifying": {"succeeded", "failed", "needs_human", "cancelled"},
    "needs_human": {"running", "failed", "cancelled"},
    "succeeded": set(), "failed": set(), "cancelled": set(), "budget_exhausted": set(),
}


def _canonical_json(value: Any, *, max_bytes: int, field: str) -> str:
    try:
        encoded = json.dumps(value, ensure_ascii=False, sort_keys=True,
                             separators=(",", ":"), allow_nan=False)
    except (TypeError, ValueError) as exc:
        raise AgentRunError(f"{field} must be finite JSON-compatible data") from exc
    if len(encoded.encode("utf-8")) > max_bytes:
        raise AgentRunError(f"{field} exceeds the configured size limit")
    return encoded


def _safe_metadata_json(value: object, *, max_bytes: int, field: str) -> str:
    """Serialize metadata-only scalars; reject fields that could carry raw content/secrets."""
    if value is None:
        value = {}
    if not isinstance(value, dict):
        raise AgentRunError(f"{field} must be an object")
    blocked_key = re.compile(
        r"prompt|transcript|secret|credential|authorization|access[_-]?token|"
        r"lease[_-]?token|api[_-]?key|arguments?|payload|result|content|"
        r"document|reasoning|source[_-]?text|raw[_-]?text|body",
        re.IGNORECASE,
    )
    for key, item in value.items():
        if not isinstance(key, str) or not key.strip() or len(key) > 64:
            raise AgentRunError(f"{field} keys must be bounded non-empty strings")
        if blocked_key.search(key):
            raise AgentRunError(f"{field} cannot contain sensitive or raw-content fields")
        if isinstance(item, str):
            if len(item) > 256 or any(ord(char) < 32 for char in item):
                raise AgentRunError(f"{field} string values must be bounded metadata")
        elif item is not None and type(item) not in {bool, int, float}:
            raise AgentRunError(f"{field} values must be scalar metadata")
    return _canonical_json(value, max_bytes=max_bytes, field=field)


def _bounded_text(value: object, *, field: str, max_chars: int, allow_empty: bool = False) -> str:
    if not isinstance(value, str) or len(value) > max_chars or (not allow_empty and not value.strip()):
        raise AgentRunError(f"{field} must be bounded non-empty text")
    if any(ord(char) < 32 and char not in "\n\t\r" for char in value):
        raise AgentRunError(f"{field} contains control characters")
    return value


@dataclass(frozen=True)
class TaskClaim:
    task_id: str
    run_id: str
    task_key: str
    worker_id: str
    lease_token: str
    lease_expires_at: float
    attempt: int
    payload: dict[str, Any]


class AgentRunStore:
    """SQLite durable lifecycle journal with atomic task claims and lease fencing."""

    def __init__(self, path: str | Path, *, busy_timeout_ms: int = 5000):
        self.path = str(path)
        if self.path == ":memory:":
            raise AgentRunError("AgentRunStore requires file-backed SQLite for durable state")
        if isinstance(busy_timeout_ms, bool) or not isinstance(busy_timeout_ms, int) or not 100 <= busy_timeout_ms <= 30_000:
            raise AgentRunError("busy_timeout_ms must be between 100 and 30000")

        self.busy_timeout_ms = busy_timeout_ms

    def _connect(self) -> sqlite3.Connection:
        db = sqlite3.connect(self.path, timeout=self.busy_timeout_ms / 1000)
        db.row_factory = sqlite3.Row
        db.execute(f"PRAGMA busy_timeout={self.busy_timeout_ms}")
        db.execute("PRAGMA foreign_keys=ON")
        db.execute("PRAGMA secure_delete=ON")
        return db

    def initialize(self) -> None:
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS agent_runs (
                    run_id TEXT PRIMARY KEY,
                    idempotency_key TEXT NOT NULL UNIQUE,
                    request_sha256 TEXT NOT NULL,
                    scope_kind TEXT NOT NULL CHECK(scope_kind IN ('conversation','project','global')),
                    scope_id TEXT NOT NULL,
                    goal TEXT NOT NULL,
                    metadata_json TEXT NOT NULL,
                    state TEXT NOT NULL CHECK(state IN
                      ('queued','running','waiting_approval','verifying','succeeded','failed',
                       'cancelled','budget_exhausted','needs_human')),
                    revision INTEGER NOT NULL DEFAULT 0 CHECK(revision >= 0),
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_agent_runs_state_created
                    ON agent_runs(state, created_at);
                CREATE TABLE IF NOT EXISTS agent_tasks (
                    task_id TEXT PRIMARY KEY,
                    run_id TEXT NOT NULL REFERENCES agent_runs(run_id) ON DELETE CASCADE,
                    task_key TEXT NOT NULL,
                    idempotency_key TEXT NOT NULL,
                    payload_sha256 TEXT NOT NULL,
                    payload_json TEXT NOT NULL,
                    state TEXT NOT NULL CHECK(state IN ('queued','leased','succeeded','failed','cancelled')),
                    worker_id TEXT,
                    lease_token_sha256 TEXT,
                    lease_expires_at REAL,
                    attempt INTEGER NOT NULL DEFAULT 0 CHECK(attempt >= 0),
                    max_attempts INTEGER NOT NULL CHECK(max_attempts BETWEEN 1 AND 10),
                    result_json TEXT,
                    error_code TEXT,
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL,
                    UNIQUE(run_id, task_key),
                    UNIQUE(run_id, idempotency_key)
                );
                CREATE INDEX IF NOT EXISTS idx_agent_tasks_claim
                    ON agent_tasks(run_id, state, created_at);
                CREATE TABLE IF NOT EXISTS agent_run_events (
                    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    run_id TEXT NOT NULL REFERENCES agent_runs(run_id) ON DELETE CASCADE,
                    task_id TEXT REFERENCES agent_tasks(task_id) ON DELETE CASCADE,
                    event_type TEXT NOT NULL,
                    from_state TEXT,
                    to_state TEXT,
                    metadata_json TEXT NOT NULL,
                    occurred_at REAL NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_agent_events_run
                    ON agent_run_events(run_id, event_id);
            """)
            db.commit()
        if self.path != ":memory:":
            os.chmod(self.path, 0o600)

    @staticmethod
    def _scope(scope_kind: object, scope_id: object) -> tuple[str, str]:
        if not isinstance(scope_kind, str) or scope_kind not in {"conversation", "project", "global"}:
            raise AgentRunError("invalid scope_kind")
        if not isinstance(scope_id, str) or not scope_id.strip() or len(scope_id) > 160:
            raise AgentRunError("scope_id must be bounded non-empty text")
        if (scope_kind == "global") != (scope_id == "global"):
            raise AgentRunError("global scope must use scope_id='global'")
        return str(scope_kind), scope_id

    @staticmethod
    def _event(db: sqlite3.Connection, *, run_id: str, task_id: str | None,
               event_type: str, from_state: str | None, to_state: str | None,
               metadata: dict[str, Any] | None, now: float) -> None:
        if not isinstance(event_type, str) or not event_type or len(event_type) > 64:
            raise AgentRunError("event_type must be bounded non-empty text")
        meta = _safe_metadata_json(metadata, max_bytes=4096, field="event metadata")
        db.execute("""INSERT INTO agent_run_events
            (run_id, task_id, event_type, from_state, to_state, metadata_json, occurred_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (run_id, task_id, event_type, from_state, to_state, meta, now))

    def create_run(self, *, idempotency_key: str, scope_kind: str, scope_id: str,
                   goal: str, metadata: dict[str, Any] | None = None,
                   now: float | None = None) -> dict[str, Any]:
        idem = _bounded_text(idempotency_key, field="idempotency_key", max_chars=200)
        kind, sid = self._scope(scope_kind, scope_id)
        checked_goal = _bounded_text(goal, field="goal", max_chars=8000)
        meta = {} if metadata is None else metadata
        meta_json = _safe_metadata_json(meta, max_bytes=16_384, field="run metadata")
        request_json = _canonical_json(
            {"scope_kind": kind, "scope_id": sid, "goal": checked_goal, "metadata": meta},
            max_bytes=24_576, field="run request")
        request_hash = hashlib.sha256(request_json.encode("utf-8")).hexdigest()
        run_id = uuid.uuid4().hex
        timestamp = time.time() if now is None else float(now)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            prior = db.execute("SELECT * FROM agent_runs WHERE idempotency_key=?", (idem,)).fetchone()
            if prior is not None:
                if prior["request_sha256"] != request_hash:
                    db.rollback()
                    raise IdempotencyConflict("idempotency key already belongs to a different run request")
                db.commit()
                return self._run_dict(prior)
            db.execute("""INSERT INTO agent_runs
                (run_id,idempotency_key,request_sha256,scope_kind,scope_id,goal,metadata_json,
                 state,revision,created_at,updated_at)
                VALUES (?,?,?,?,?,?,?,'queued',0,?,?)""",
                (run_id, idem, request_hash, kind, sid, checked_goal, meta_json, timestamp, timestamp))
            self._event(db, run_id=run_id, task_id=None, event_type="run_created",
                        from_state=None, to_state="queued", metadata={}, now=timestamp)
            db.commit()
        return self.get_run(run_id)

    @staticmethod
    def _run_dict(row: sqlite3.Row) -> dict[str, Any]:
        item = dict(row)
        item["metadata"] = json.loads(item.pop("metadata_json"))
        item.pop("request_sha256", None)
        return item

    def get_run(self, run_id: str) -> dict[str, Any]:
        _bounded_text(run_id, field="run_id", max_chars=128)
        with closing(self._connect()) as db:
            row = db.execute("SELECT * FROM agent_runs WHERE run_id=?", (run_id,)).fetchone()
        if row is None:
            raise AgentRunError("run not found")
        return self._run_dict(row)

    def transition_run(self, *, run_id: str, expected_state: str, new_state: str,
                       event_type: str, metadata: dict[str, Any] | None = None,
                       now: float | None = None) -> dict[str, Any]:
        _bounded_text(run_id, field="run_id", max_chars=128)
        if (not isinstance(expected_state, str) or not isinstance(new_state, str)
                or expected_state not in RUN_STATES or new_state not in RUN_STATES):
            raise InvalidTransition("unknown run state")
        if new_state not in RUN_TRANSITIONS[expected_state]:
            raise InvalidTransition("run state transition is not allowed")
        timestamp = time.time() if now is None else float(now)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT state,revision FROM agent_runs WHERE run_id=?", (run_id,)).fetchone()
            if row is None:
                db.rollback()
                raise AgentRunError("run not found")
            if row["state"] != expected_state:
                db.rollback()
                raise InvalidTransition("run state changed; expected state does not match")
            revision = int(row["revision"])
            updated = db.execute("""UPDATE agent_runs
                SET state=?,revision=revision+1,updated_at=?
                WHERE run_id=? AND state=? AND revision=?""",
                (new_state, timestamp, run_id, expected_state, revision))
            if updated.rowcount != 1:
                db.rollback()
                raise InvalidTransition("run state changed concurrently")
            self._event(db, run_id=run_id, task_id=None, event_type=event_type,
                        from_state=expected_state, to_state=new_state, metadata=metadata, now=timestamp)
            db.commit()
        return self.get_run(run_id)

    def enqueue_task(self, *, run_id: str, task_key: str, idempotency_key: str,
                     payload: dict[str, Any], max_attempts: int = 3,
                     now: float | None = None) -> dict[str, Any]:
        _bounded_text(run_id, field="run_id", max_chars=128)
        key = _bounded_text(task_key, field="task_key", max_chars=128)
        idem = _bounded_text(idempotency_key, field="task idempotency_key", max_chars=200)
        if not isinstance(payload, dict):
            raise AgentRunError("task payload must be an object")
        payload_json = _canonical_json(payload, max_bytes=32_000, field="task payload")
        payload_hash = hashlib.sha256(payload_json.encode("utf-8")).hexdigest()
        if isinstance(max_attempts, bool) or not isinstance(max_attempts, int) or not 1 <= max_attempts <= 10:
            raise AgentRunError("max_attempts must be between 1 and 10")
        timestamp = time.time() if now is None else float(now)
        task_id = uuid.uuid4().hex
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            run = db.execute("SELECT state FROM agent_runs WHERE run_id=?", (run_id,)).fetchone()
            if run is None:
                db.rollback()
                raise AgentRunError("run not found")
            if run["state"] not in {"queued", "running"}:
                db.rollback()
                raise InvalidTransition("tasks can only be added to queued or running runs")
            prior = db.execute("""SELECT * FROM agent_tasks WHERE run_id=?
                AND (task_key=? OR idempotency_key=?)""", (run_id, key, idem)).fetchone()
            if prior is not None:
                if prior["task_key"] != key or prior["idempotency_key"] != idem or prior["payload_sha256"] != payload_hash:
                    db.rollback()
                    raise IdempotencyConflict("task key/idempotency key belongs to a different task")
                db.commit()
                return self._task_dict(prior)
            db.execute("""INSERT INTO agent_tasks
                (task_id,run_id,task_key,idempotency_key,payload_sha256,payload_json,state,
                 attempt,max_attempts,created_at,updated_at)
                VALUES (?,?,?,?,?,?,'queued',0,?,?,?)""",
                (task_id, run_id, key, idem, payload_hash, payload_json, max_attempts, timestamp, timestamp))
            self._event(db, run_id=run_id, task_id=task_id, event_type="task_enqueued",
                        from_state=None, to_state="queued", metadata={"task_key": key}, now=timestamp)
            db.commit()
        return self.get_task(task_id)

    @staticmethod
    def _task_dict(row: sqlite3.Row) -> dict[str, Any]:
        item = dict(row)
        item["payload"] = json.loads(item.pop("payload_json"))
        item["result"] = json.loads(item.pop("result_json")) if item.get("result_json") is not None else None
        item.pop("payload_sha256", None)
        item.pop("lease_token_sha256", None)
        return item

    def get_task(self, task_id: str) -> dict[str, Any]:
        _bounded_text(task_id, field="task_id", max_chars=128)
        with closing(self._connect()) as db:
            row = db.execute("SELECT * FROM agent_tasks WHERE task_id=?", (task_id,)).fetchone()
        if row is None:
            raise AgentRunError("task not found")
        return self._task_dict(row)

    def claim_task(self, *, run_id: str, worker_id: str, lease_seconds: int = 30,
                   now: float | None = None) -> TaskClaim | None:
        _bounded_text(run_id, field="run_id", max_chars=128)
        worker = _bounded_text(worker_id, field="worker_id", max_chars=128)
        if isinstance(lease_seconds, bool) or not isinstance(lease_seconds, int) or not 1 <= lease_seconds <= 3600:
            raise AgentRunError("lease_seconds must be between 1 and 3600")
        timestamp = time.time() if now is None else float(now)
        expires = timestamp + lease_seconds
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            run = db.execute("SELECT state FROM agent_runs WHERE run_id=?", (run_id,)).fetchone()
            if run is None:
                db.rollback()
                raise AgentRunError("run not found")
            if run["state"] != "running":
                db.rollback()
                raise InvalidTransition("tasks can only be claimed by running AgentRuns")
            # Expired leases are fenced and returned to the queue, unless their retry budget is spent.
            expired = db.execute("""SELECT task_id,attempt,max_attempts FROM agent_tasks
                WHERE run_id=? AND state='leased' AND lease_expires_at<=?""", (run_id, timestamp)).fetchall()
            for row in expired:
                next_state = "queued" if row["attempt"] < row["max_attempts"] else "failed"
                db.execute("""UPDATE agent_tasks SET state=?,worker_id=NULL,lease_token_sha256=NULL,
                    lease_expires_at=NULL,error_code='lease_expired',updated_at=?
                    WHERE task_id=? AND state='leased'""", (next_state, timestamp, row["task_id"]))
                self._event(db, run_id=run_id, task_id=row["task_id"], event_type="task_lease_expired",
                            from_state="leased", to_state=next_state, metadata={}, now=timestamp)
            task = db.execute("""SELECT * FROM agent_tasks WHERE run_id=? AND state='queued'
                AND attempt < max_attempts ORDER BY created_at,task_key,task_id LIMIT 1""", (run_id,)).fetchone()
            if task is None:
                db.commit()
                return None
            token = secrets.token_urlsafe(32)
            token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
            attempt = int(task["attempt"]) + 1
            db.execute("""UPDATE agent_tasks SET state='leased',worker_id=?,lease_token_sha256=?,
                lease_expires_at=?,attempt=?,updated_at=? WHERE task_id=? AND state='queued'""",
                (worker, token_hash, expires, attempt, timestamp, task["task_id"]))
            self._event(db, run_id=run_id, task_id=task["task_id"], event_type="task_claimed",
                        from_state="queued", to_state="leased", metadata={"worker_id": worker, "attempt": attempt},
                        now=timestamp)
            db.commit()
            return TaskClaim(task_id=task["task_id"], run_id=run_id, task_key=task["task_key"],
                worker_id=worker, lease_token=token, lease_expires_at=expires, attempt=attempt,
                payload=json.loads(task["payload_json"]))

    def _owned_lease(self, db: sqlite3.Connection, claim: TaskClaim, timestamp: float) -> sqlite3.Row:
        token_hash = hashlib.sha256(claim.lease_token.encode("utf-8")).hexdigest()
        row = db.execute("SELECT * FROM agent_tasks WHERE task_id=?", (claim.task_id,)).fetchone()
        if (row is None or row["run_id"] != claim.run_id or row["state"] != "leased"
                or row["worker_id"] != claim.worker_id or row["lease_token_sha256"] != token_hash
                or row["lease_expires_at"] is None or float(row["lease_expires_at"]) <= timestamp):
            raise LeaseError("task lease is expired or no longer owned by this worker")
        return row

    def complete_task(self, *, claim: TaskClaim, result: dict[str, Any],
                      now: float | None = None) -> dict[str, Any]:
        if not isinstance(result, dict):
            raise AgentRunError("task result must be an object")
        result_json = _canonical_json(result, max_bytes=32_000, field="task result")
        timestamp = time.time() if now is None else float(now)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = self._owned_lease(db, claim, timestamp)
            db.execute("""UPDATE agent_tasks SET state='succeeded',result_json=?,worker_id=NULL,
                lease_token_sha256=NULL,lease_expires_at=NULL,error_code=NULL,updated_at=?
                WHERE task_id=? AND state='leased'""", (result_json, timestamp, claim.task_id))
            self._event(db, run_id=claim.run_id, task_id=claim.task_id, event_type="task_completed",
                        from_state="leased", to_state="succeeded", metadata={"attempt": row["attempt"]},
                        now=timestamp)
            db.commit()
        return self.get_task(claim.task_id)

    def fail_task(self, *, claim: TaskClaim, error_code: str, retryable: bool = False,
                  now: float | None = None) -> dict[str, Any]:
        code = _bounded_text(error_code, field="error_code", max_chars=96)
        if not isinstance(retryable, bool):
            raise AgentRunError("retryable must be boolean")
        timestamp = time.time() if now is None else float(now)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = self._owned_lease(db, claim, timestamp)
            next_state = "queued" if retryable and int(row["attempt"]) < int(row["max_attempts"]) else "failed"
            db.execute("""UPDATE agent_tasks SET state=?,worker_id=NULL,lease_token_sha256=NULL,
                lease_expires_at=NULL,error_code=?,updated_at=? WHERE task_id=? AND state='leased'""",
                (next_state, code, timestamp, claim.task_id))
            self._event(db, run_id=claim.run_id, task_id=claim.task_id, event_type="task_failed",
                        from_state="leased", to_state=next_state,
                        metadata={"error_code": code, "retryable": retryable, "attempt": row["attempt"]},
                        now=timestamp)
            db.commit()
        return self.get_task(claim.task_id)

    def cancel_run(self, *, run_id: str, now: float | None = None) -> dict[str, Any]:
        _bounded_text(run_id, field="run_id", max_chars=128)
        timestamp = time.time() if now is None else float(now)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            run = db.execute("SELECT state,revision FROM agent_runs WHERE run_id=?", (run_id,)).fetchone()
            if run is None:
                db.rollback()
                raise AgentRunError("run not found")
            current = run["state"]
            if current == "cancelled":
                db.commit()
                return self.get_run(run_id)
            if "cancelled" not in RUN_TRANSITIONS[current]:
                db.rollback()
                raise InvalidTransition("run cannot be cancelled from its current state")
            db.execute("""UPDATE agent_runs SET state='cancelled',revision=revision+1,updated_at=?
                WHERE run_id=? AND state=? AND revision=?""",
                (timestamp, run_id, current, run["revision"]))
            tasks = db.execute("""SELECT task_id,state FROM agent_tasks WHERE run_id=?
                AND state IN ('queued','leased')""", (run_id,)).fetchall()
            for task in tasks:
                db.execute("""UPDATE agent_tasks SET state='cancelled',worker_id=NULL,
                    lease_token_sha256=NULL,lease_expires_at=NULL,error_code='run_cancelled',updated_at=?
                    WHERE task_id=?""", (timestamp, task["task_id"]))
                self._event(db, run_id=run_id, task_id=task["task_id"], event_type="task_cancelled",
                            from_state=task["state"], to_state="cancelled", metadata={}, now=timestamp)
            self._event(db, run_id=run_id, task_id=None, event_type="run_cancelled",
                        from_state=current, to_state="cancelled", metadata={}, now=timestamp)
            db.commit()
        return self.get_run(run_id)

    def list_events(self, *, run_id: str, after_event_id: int = 0, limit: int = 100) -> list[dict[str, Any]]:
        if isinstance(after_event_id, bool) or not isinstance(after_event_id, int) or after_event_id < 0:
            raise AgentRunError("after_event_id must be a non-negative integer")
        if isinstance(limit, bool) or not isinstance(limit, int) or not 1 <= limit <= 500:
            raise AgentRunError("limit must be between 1 and 500")
        self.get_run(run_id)  # Scope existence before event retrieval.
        with closing(self._connect()) as db:
            rows = db.execute("""SELECT * FROM agent_run_events WHERE run_id=? AND event_id>?
                ORDER BY event_id LIMIT ?""", (run_id, after_event_id, limit)).fetchall()
        return [{**dict(row), "metadata": json.loads(row["metadata_json"])} for row in rows]
