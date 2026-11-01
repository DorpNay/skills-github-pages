"""Append-only-per-evidence SQLite ledger scoped to conversation/project/global records."""
from __future__ import annotations

import json
import os
import sqlite3
import time
import uuid
from contextlib import closing
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from .citations import CitationError, CitationManager


class EvidenceLedgerError(ValueError):
    pass


class EvidenceLedger:
    def __init__(self, path: str | Path):
        self.path = str(path)
        self.citations = CitationManager()

    def _connect(self) -> sqlite3.Connection:
        db = sqlite3.connect(self.path, timeout=5.0)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA busy_timeout=5000")
        db.execute("PRAGMA foreign_keys=ON")
        return db

    def initialize(self) -> None:
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS evidence_records (
                    evidence_id TEXT PRIMARY KEY,
                    scope TEXT NOT NULL CHECK (scope IN ('conversation', 'project', 'global')),
                    scope_id TEXT NOT NULL,
                    evidence_kind TEXT NOT NULL CHECK (evidence_kind IN ('source_quote', 'claim', 'tool_result', 'contradiction')),
                    source_id TEXT NOT NULL,
                    source_uri TEXT NOT NULL,
                    source_sha256 TEXT NOT NULL,
                    chunk_id TEXT NOT NULL,
                    page_number INTEGER,
                    section TEXT,
                    start_offset INTEGER NOT NULL,
                    end_offset INTEGER NOT NULL,
                    quote_text TEXT NOT NULL,
                    claim_text TEXT,
                    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
                    recorded_at INTEGER NOT NULL,
                    metadata_json TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_evidence_scope_time
                    ON evidence_records(scope, scope_id, recorded_at DESC);
                CREATE INDEX IF NOT EXISTS idx_evidence_source
                    ON evidence_records(scope, scope_id, source_id, source_sha256);
            """)
            db.commit()
        if self.path != ":memory:":
            os.chmod(self.path, 0o600)

    def add_quote(self, *, scope: str, scope_id: str, source_id: str, source_uri: str,
                  source_text: str, chunk_id: str, start_offset: int, end_offset: int,
                  page_number: int | None = None, section: str | None = None,
                  claim_text: str | None = None, confidence: float = 1.0,
                  metadata: dict[str, Any] | None = None) -> str:
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
            raise EvidenceLedgerError("invalid evidence scope")
        if (scope == "global") != (scope_id == "global"):
            raise EvidenceLedgerError("global scope must use scope_id='global'; other scopes cannot")
        if not isinstance(source_id, str) or not source_id or len(source_id) > 256:
            raise EvidenceLedgerError("source_id is required")
        parsed = urlsplit(source_uri) if isinstance(source_uri, str) else None
        if parsed is None or parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
            raise EvidenceLedgerError("source_uri must be a clean HTTPS citation URL")
        if isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
            raise EvidenceLedgerError("confidence must be between 0 and 1")
        metadata = metadata or {}
        try:
            metadata_json = json.dumps(metadata, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
            if not isinstance(metadata, dict) or len(metadata_json.encode("utf-8")) > 16_384:
                raise EvidenceLedgerError("metadata must be a bounded JSON object")
            citation = self.citations.create(document_id=source_id, chunk_id=chunk_id, source_uri=source_uri,
                source_text=source_text, start_offset=start_offset, end_offset=end_offset,
                page_number=page_number, section=section)
        except (CitationError, TypeError, ValueError) as exc:
            raise EvidenceLedgerError(str(exc)) from exc
        if claim_text is not None and (not isinstance(claim_text, str) or len(claim_text) > 8000):
            raise EvidenceLedgerError("claim_text must be bounded text")
        evidence_id = uuid.uuid4().hex
        with closing(self._connect()) as db:
            db.execute("""INSERT INTO evidence_records
                (evidence_id, scope, scope_id, evidence_kind, source_id, source_uri, source_sha256, chunk_id,
                 page_number, section, start_offset, end_offset, quote_text, claim_text, confidence, recorded_at, metadata_json)
                VALUES (?, ?, ?, 'source_quote', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (evidence_id, scope, scope_id, source_id, source_uri, citation.source_sha256, chunk_id, page_number,
                 section, start_offset, end_offset, citation.text_snippet, claim_text, float(confidence),
                 int(time.time()), metadata_json))
            db.commit()
        return evidence_id

    def list_evidence(self, *, scope: str, scope_id: str, limit: int = 100) -> list[dict[str, Any]]:
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id:
            raise EvidenceLedgerError("invalid evidence scope")
        if (scope == "global") != (scope_id == "global"):
            raise EvidenceLedgerError("invalid global scope ID")
        if isinstance(limit, bool) or not isinstance(limit, int) or not 1 <= limit <= 500:
            raise EvidenceLedgerError("limit must be between 1 and 500")
        with closing(self._connect()) as db:
            rows = db.execute("""SELECT * FROM evidence_records WHERE scope=? AND scope_id=?
                ORDER BY recorded_at DESC, evidence_id LIMIT ?""", (scope, scope_id, limit)).fetchall()
        records = []
        for row in rows:
            item = dict(row)
            item["metadata"] = json.loads(item.pop("metadata_json"))
            records.append(item)
        return records
