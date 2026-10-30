"""Scoped SQLite memory graph with provenance, bitemporal facts and explicit conflicts.

This module is opt-in groundwork. It does not decide that extracted facts are true:
new facts default to candidate, each node requires provenance, and contradictions stay disputed.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import sqlite3
import time
import uuid
from contextlib import closing
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from .conflict import ConflictError, next_status_for_contradiction, validate_relation, validate_status
from .scope import ScopeError, ScopeRef
from .temporal import TemporalError, normalize_timestamp, validate_validity_window


@dataclass(frozen=True)
class MemoryNode:
    id: str
    node_type: str
    content: str
    scope: str
    scope_id: str
    source_kind: str
    source_id: str
    confidence: float
    status: str
    sensitivity: str
    recorded_at: str
    valid_from: str | None
    valid_until: str | None
    source_uri: str | None = None
    source_sha256: str | None = None
    metadata: dict[str, Any] | None = None


class MemoryGraphError(ValueError):
    pass


def _now() -> str:
    return normalize_timestamp(time.strftime("%Y-%m-%dT%H:%M:%S+00:00", time.gmtime())) or ""


def _canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


class MemoryManager:
    def __init__(self, path: str | Path, *, max_metadata_bytes: int = 16_384):
        self.path = str(path)
        self.max_metadata_bytes = max_metadata_bytes
        self.fts5_secure_delete_enabled = False

    def _connect(self) -> sqlite3.Connection:
        db = sqlite3.connect(self.path, timeout=5.0)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA busy_timeout=5000")
        db.execute("PRAGMA foreign_keys=ON")
        # Defense in depth for ordinary b-tree pages; this is not crypto-erasure.
        db.execute("PRAGMA secure_delete=ON")
        return db

    @staticmethod
    def _configure_fts5_secure_delete(db: sqlite3.Connection) -> bool:
        """Enable FTS5 secure-delete only on SQLite versions that support it (>=3.42.0)."""
        if sqlite3.sqlite_version_info < (3, 42, 0):
            return False
        try:
            db.execute("INSERT INTO fts_memory(fts_memory, rank) VALUES ('secure-delete', 1)")
            row = db.execute("SELECT v FROM fts_memory_config WHERE k='secure-delete'").fetchone()
        except sqlite3.Error:
            return False
        return row is not None and str(row["v"]) == "1"

    def initialize(self) -> None:
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        schema = Path(__file__).with_name("schema.sql").read_text(encoding="utf-8")
        with closing(self._connect()) as db:
            index_exists = db.execute(
                "SELECT 1 FROM sqlite_master WHERE type='table' AND name='fts_memory'"
            ).fetchone() is not None
            db.executescript(schema)
            # Backfill rows from legacy databases only when the index is first created.
            if not index_exists:
                db.execute("INSERT INTO fts_memory(fts_memory) VALUES ('rebuild')")
            self.fts5_secure_delete_enabled = self._configure_fts5_secure_delete(db)
            db.commit()
        if self.path != ":memory:":
            os.chmod(self.path, 0o600)

    @staticmethod
    def _scope(scope: object, scope_id: object) -> ScopeRef:
        try:
            return ScopeRef.parse(scope, scope_id)
        except ScopeError as exc:
            raise MemoryGraphError(str(exc)) from exc

    def add_fact(self, content: str, *, scope: str, scope_id: str,
                 source_kind: str, source_id: str, node_type: str = "FACT",
                 status: str = "candidate", confidence: float = 0.5,
                 sensitivity: str = "normal", valid_from: str | None = None,
                 valid_until: str | None = None, source_uri: str | None = None,
                 source_text: str | None = None, metadata: dict[str, Any] | None = None,
                 node_id: str | None = None) -> MemoryNode:
        ref = self._scope(scope, scope_id)
        if not isinstance(content, str) or not content.strip() or len(content) > 20_000:
            raise MemoryGraphError("content must be a non-empty string of at most 20000 characters")
        if not isinstance(node_type, str) or not node_type or len(node_type) > 48:
            raise MemoryGraphError("invalid node_type")
        if source_kind not in {"message", "document", "tool_result", "user_edit", "system_event"}:
            raise MemoryGraphError("invalid source_kind")
        if not isinstance(source_id, str) or not source_id or len(source_id) > 256:
            raise MemoryGraphError("source_id is required for provenance")
        if isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
            raise MemoryGraphError("confidence must be between 0 and 1")
        if sensitivity not in {"normal", "private", "confidential"}:
            raise MemoryGraphError("invalid sensitivity")
        try:
            checked_status = validate_status(status)
            start, end = validate_validity_window(valid_from, valid_until)
        except (ConflictError, TemporalError) as exc:
            raise MemoryGraphError(str(exc)) from exc
        if source_uri is not None:
            parsed_source = urlsplit(source_uri) if isinstance(source_uri, str) else None
            if (parsed_source is None or len(source_uri) > 2048 or parsed_source.scheme != "https"
                    or not parsed_source.hostname or parsed_source.username or parsed_source.password
                    or any(ord(char) < 32 for char in source_uri)):
                raise MemoryGraphError("source_uri must be safe HTTPS without embedded credentials")
        if source_text is not None and (not isinstance(source_text, str) or len(source_text) > 5_000_000):
            raise MemoryGraphError("source_text must be bounded text when provided")
        source_hash = hashlib.sha256(source_text.encode("utf-8")).hexdigest() if source_text is not None else None
        if metadata is None:
            metadata = {}
        if not isinstance(metadata, dict):
            raise MemoryGraphError("metadata must be a bounded JSON object")
        try:
            metadata_text = _canonical_json(metadata)
        except (TypeError, ValueError) as exc:
            raise MemoryGraphError("metadata must contain finite JSON-compatible values") from exc
        if len(metadata_text.encode("utf-8")) > self.max_metadata_bytes:
            raise MemoryGraphError("metadata must be a bounded JSON object")
        now = _now()
        identifier = node_id or uuid.uuid4().hex
        if not isinstance(identifier, str) or not identifier or len(identifier) > 128:
            raise MemoryGraphError("invalid node_id")
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            db.execute("""INSERT INTO memory_nodes
                (id, node_type, content, scope, scope_id, source_kind, source_id, source_uri, source_sha256,
                 created_at, recorded_at, valid_from, valid_until, confidence, status, sensitivity, metadata_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (identifier, node_type, content, ref.kind, ref.scope_id, source_kind, source_id, source_uri,
                 source_hash, now, now, start, end, float(confidence), checked_status, sensitivity,
                 _canonical_json(metadata)))
            db.execute("""INSERT INTO memory_audit
                (scope, scope_id, node_id, action, occurred_at, actor_kind, actor_id, reason_code)
                VALUES (?, ?, ?, 'node_created', ?, 'system', 'memory_manager', 'fact_candidate')""",
                (ref.kind, ref.scope_id, identifier, now))
            db.commit()
        return self.get_node(identifier, scope=ref.kind, scope_id=ref.scope_id)

    def _to_node(self, row: sqlite3.Row) -> MemoryNode:
        return MemoryNode(
            id=row["id"], node_type=row["node_type"], content=row["content"],
            scope=row["scope"], scope_id=row["scope_id"], source_kind=row["source_kind"],
            source_id=row["source_id"], confidence=float(row["confidence"]), status=row["status"],
            sensitivity=row["sensitivity"], recorded_at=row["recorded_at"],
            valid_from=row["valid_from"], valid_until=row["valid_until"], source_uri=row["source_uri"],
            source_sha256=row["source_sha256"], metadata=json.loads(row["metadata_json"]),
        )

    def get_node(self, node_id: str, *, scope: str, scope_id: str) -> MemoryNode:
        ref = self._scope(scope, scope_id)
        with closing(self._connect()) as db:
            row = db.execute("SELECT * FROM memory_nodes WHERE id=? AND scope=? AND scope_id=?",
                             (node_id, ref.kind, ref.scope_id)).fetchone()
        if row is None:
            raise MemoryGraphError("memory node not found in the requested scope")
        return self._to_node(row)

    def list_nodes(self, *, scope: str, scope_id: str, statuses: tuple[str, ...] = ("confirmed",),
                   node_type: str | None = None, limit: int = 100,
                   valid_at: str | None = None, recorded_at: str | None = None) -> list[MemoryNode]:
        ref = self._scope(scope, scope_id)
        if not 1 <= limit <= 500:
            raise MemoryGraphError("limit must be between 1 and 500")
        for status in statuses:
            validate_status(status)
        clauses = ["scope = ?", "scope_id = ?"]
        args: list[Any] = [ref.kind, ref.scope_id]
        if statuses:
            clauses.append("status IN (" + ",".join("?" for _ in statuses) + ")")
            args.extend(statuses)
        if node_type:
            clauses.append("node_type = ?")
            args.append(node_type)
        if valid_at:
            at = normalize_timestamp(valid_at, field_name="valid_at")
            clauses.extend(["(valid_from IS NULL OR valid_from <= ?)", "(valid_until IS NULL OR ? < valid_until)"])
            args.extend([at, at])
        if recorded_at:
            at = normalize_timestamp(recorded_at, field_name="recorded_at")
            clauses.append("recorded_at <= ?")
            args.append(at)
        # nosemgrep: python.sqlalchemy.security.sqlalchemy-execute-raw-query.sqlalchemy-execute-raw-query
        sql = "SELECT * FROM memory_nodes WHERE " + " AND ".join(clauses) + " ORDER BY recorded_at DESC, id LIMIT ?"  # nosec B608 -- SQL fragments are fixed; values are bound separately.
        args.append(limit)
        with closing(self._connect()) as db:
            rows = db.execute(sql, args).fetchall()
        return [self._to_node(row) for row in rows]

    def search_nodes(self, query: str, *, scope: str, scope_id: str,
                     statuses: tuple[str, ...] = ("confirmed",), node_type: str | None = None,
                     limit: int = 10, valid_at: str | None = None,
                     recorded_at: str | None = None) -> list[MemoryNode]:
        """Scope-filtered lexical search. Prototype only; not wired to the UI/API."""
        ref = self._scope(scope, scope_id)
        if not isinstance(query, str) or len(query) > 4_000:
            raise MemoryGraphError("query must be text of at most 4000 characters")
        if isinstance(limit, bool) or not isinstance(limit, int) or not 1 <= limit <= 100:
            raise MemoryGraphError("limit must be between 1 and 100")
        for status in statuses:
            try:
                validate_status(status)
            except ConflictError as exc:
                raise MemoryGraphError(str(exc)) from exc
        seen: set[str] = set()
        terms: list[str] = []
        for raw_term in re.findall(r"[\w'-]{2,}", query, flags=re.UNICODE):
            term = raw_term[:128]
            folded = term.casefold()
            if folded not in seen:
                seen.add(folded)
                terms.append(term)
            if len(terms) >= 24:
                break
        if not terms:
            return []
        # Quote each bounded token; only this method generates the OR operators.
        match_query = " OR ".join('"' + term.replace('"', '""') + '"' for term in terms)
        clauses = ["n.scope = ?", "n.scope_id = ?"]
        args: list[Any] = [match_query, ref.kind, ref.scope_id]
        if statuses:
            clauses.append("n.status IN (" + ",".join("?" for _ in statuses) + ")")
            args.extend(statuses)
        if node_type:
            clauses.append("n.node_type = ?")
            args.append(node_type)
        if valid_at:
            at = normalize_timestamp(valid_at, field_name="valid_at")
            clauses.extend(["(n.valid_from IS NULL OR n.valid_from <= ?)",
                            "(n.valid_until IS NULL OR ? < n.valid_until)"])
            args.extend([at, at])
        if recorded_at:
            at = normalize_timestamp(recorded_at, field_name="recorded_at")
            clauses.append("n.recorded_at <= ?")
            args.append(at)
        # nosemgrep: python.sqlalchemy.security.sqlalchemy-execute-raw-query.sqlalchemy-execute-raw-query
        sql = ("SELECT n.* FROM fts_memory JOIN memory_nodes AS n "
               "ON n.rowid = fts_memory.rowid WHERE fts_memory MATCH ? AND "
               + " AND ".join(clauses)
               + " ORDER BY bm25(fts_memory), n.recorded_at DESC, n.id LIMIT ?")  # nosec B608 -- all user terms and filters are bound parameters.
        args.append(limit)
        with closing(self._connect()) as db:
            rows = db.execute(sql, args).fetchall()
        return [self._to_node(row) for row in rows]

    def relate(self, source_id: str, target_id: str, *, scope: str, scope_id: str,
               relation_type: str, evidence_source_kind: str, evidence_source_id: str,
               confidence: float = 1.0) -> None:
        ref = self._scope(scope, scope_id)
        try:
            relation = validate_relation(relation_type)
        except ConflictError as exc:
            raise MemoryGraphError(str(exc)) from exc
        if source_id == target_id:
            raise MemoryGraphError("self-relations are not allowed")
        if not isinstance(evidence_source_id, str) or not evidence_source_id:
            raise MemoryGraphError("relation provenance is required")
        if evidence_source_kind not in {"message", "document", "tool_result", "user_edit", "system_event"}:
            raise MemoryGraphError("invalid relation evidence_source_kind")
        if isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
            raise MemoryGraphError("relation confidence must be between 0 and 1")
        now = _now()
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            rows = db.execute("SELECT id FROM memory_nodes WHERE id IN (?, ?) AND scope=? AND scope_id=?",
                              (source_id, target_id, ref.kind, ref.scope_id)).fetchall()
            if len({row["id"] for row in rows}) != 2:
                db.rollback()
                raise MemoryGraphError("both nodes must exist in the requested scope")
            db.execute("""INSERT INTO memory_edges
                (source_node, target_node, scope, scope_id, relation_type, confidence, created_at,
                 evidence_source_kind, evidence_source_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (source_id, target_id, ref.kind, ref.scope_id, relation, float(confidence), now,
                 evidence_source_kind, evidence_source_id))
            if relation == "CONTRADICTS":
                row = db.execute("SELECT status FROM memory_nodes WHERE id=?", (source_id,)).fetchone()
                status = next_status_for_contradiction(row["status"])
                if status != row["status"]:
                    db.execute("UPDATE memory_nodes SET status=? WHERE id=?", (status, source_id))
                row = db.execute("SELECT status FROM memory_nodes WHERE id=?", (target_id,)).fetchone()
                status = next_status_for_contradiction(row["status"])
                if status != row["status"]:
                    db.execute("UPDATE memory_nodes SET status=? WHERE id=?", (status, target_id))
            db.commit()

    def supersede(self, old_node_id: str, new_node_id: str, *, scope: str, scope_id: str,
                  evidence_source_kind: str, evidence_source_id: str) -> None:
        ref = self._scope(scope, scope_id)
        if evidence_source_kind not in {"message", "document", "tool_result", "user_edit", "system_event"} or not isinstance(evidence_source_id, str) or not evidence_source_id:
            raise MemoryGraphError("supersede relation provenance is required")
        now = _now()
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            rows = db.execute("SELECT id FROM memory_nodes WHERE id IN (?, ?) AND scope=? AND scope_id=?",
                              (old_node_id, new_node_id, ref.kind, ref.scope_id)).fetchall()
            if old_node_id == new_node_id or len({row["id"] for row in rows}) != 2:
                db.rollback()
                raise MemoryGraphError("old/new node IDs must be distinct nodes in the same scope")
            db.execute("UPDATE memory_nodes SET status='superseded', superseded_at=? WHERE id=?",
                       (now, old_node_id))
            db.execute("""INSERT INTO memory_edges
                (source_node, target_node, scope, scope_id, relation_type, confidence, created_at,
                 evidence_source_kind, evidence_source_id)
                VALUES (?, ?, ?, ?, 'SUPERSEDES', 1, ?, ?, ?)""",
                (new_node_id, old_node_id, ref.kind, ref.scope_id, now, evidence_source_kind, evidence_source_id))
            db.commit()

    def review_node(self, node_id: str, *, scope: str, scope_id: str,
                    status: str, reason_code: str) -> MemoryNode:
        """Apply an explicit owner review; there is no automatic candidate promotion."""
        ref = self._scope(scope, scope_id)
        if not isinstance(node_id, str) or not node_id or len(node_id) > 128:
            raise MemoryGraphError("invalid node_id")
        if status not in {"confirmed", "rejected"}:
            raise MemoryGraphError("review status must be confirmed or rejected")
        if not isinstance(reason_code, str) or not re.fullmatch(r"[a-z][a-z0-9_]{0,63}", reason_code):
            raise MemoryGraphError("reason_code must be a short lowercase audit code")
        now = _now()
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT status FROM memory_nodes WHERE id=? AND scope=? AND scope_id=?",
                             (node_id, ref.kind, ref.scope_id)).fetchone()
            if row is None:
                db.rollback()
                raise MemoryGraphError("memory node not found in the requested scope")
            if row["status"] in {"superseded", "rejected"}:
                db.rollback()
                raise MemoryGraphError("superseded or rejected nodes cannot be reviewed again")
            db.execute("UPDATE memory_nodes SET status=? WHERE id=? AND scope=? AND scope_id=?",
                       (status, node_id, ref.kind, ref.scope_id))
            db.execute("""INSERT INTO memory_audit
                (scope, scope_id, node_id, action, occurred_at, actor_kind, actor_id, reason_code)
                VALUES (?, ?, ?, 'node_reviewed', ?, 'user', 'gateway_owner', ?)""",
                (ref.kind, ref.scope_id, node_id, now, reason_code))
            db.commit()
        return self.get_node(node_id, scope=ref.kind, scope_id=ref.scope_id)

    def delete_with_propagation(self, node_id: str, *, scope: str, scope_id: str) -> list[str]:
        """Delete a node and its DERIVED_FROM descendants, bounded to one scope/transaction."""
        ref = self._scope(scope, scope_id)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT id FROM memory_nodes WHERE id=? AND scope=? AND scope_id=?",
                             (node_id, ref.kind, ref.scope_id)).fetchone()
            if row is None:
                db.rollback()
                return []
            rows = db.execute("""WITH RECURSIVE derived(id) AS (
                    SELECT target_node FROM memory_edges
                    WHERE source_node=? AND relation_type='DERIVED_FROM' AND scope=? AND scope_id=?
                    UNION
                    SELECT e.target_node FROM memory_edges e JOIN derived d ON e.source_node=d.id
                    WHERE e.relation_type='DERIVED_FROM' AND e.scope=? AND e.scope_id=?
                ) SELECT DISTINCT id FROM derived""",
                (node_id, ref.kind, ref.scope_id, ref.kind, ref.scope_id)).fetchall()
            identifiers = [row["id"] for row in rows if row["id"] != node_id] + [node_id]
            placeholders = ",".join("?" for _ in identifiers)
            # nosemgrep: python.sqlalchemy.security.sqlalchemy-execute-raw-query.sqlalchemy-execute-raw-query
            db.execute("DELETE FROM memory_nodes WHERE id IN (" + placeholders + ") AND scope=? AND scope_id=?",  # nosec B608 -- placeholders are generated as '?' only; values are bound.
                       (*identifiers, ref.kind, ref.scope_id))
            db.execute("""INSERT INTO memory_audit
                (scope, scope_id, node_id, action, occurred_at, actor_kind, actor_id, reason_code)
                VALUES (?, ?, ?, 'node_deleted', ?, 'system', 'memory_manager', 'user_requested')""",
                (ref.kind, ref.scope_id, node_id, _now()))
            db.commit()
        return identifiers
