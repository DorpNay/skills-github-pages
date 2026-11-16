"""Scoped SQLite evidence ledger with exact quote hashes, idempotent writes and scoped deletion."""
from __future__ import annotations

import hashlib
import json
import math
import os
import re
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


class EvidenceLedgerConflictError(EvidenceLedgerError):
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
                CREATE INDEX IF NOT EXISTS idx_evidence_identity
                    ON evidence_records(scope, scope_id, source_id, source_sha256, chunk_id, start_offset, end_offset);
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
        if not isinstance(source_id, str) or not source_id or len(source_id) > 160:
            raise EvidenceLedgerError("source_id must be non-empty text of at most 160 characters")
        parsed = urlsplit(source_uri) if isinstance(source_uri, str) else None
        if parsed is None or parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
            raise EvidenceLedgerError("source_uri must be a clean HTTPS citation URL")
        if isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
            raise EvidenceLedgerError("confidence must be between 0 and 1")
        if metadata is None:
            metadata = {}
        if not isinstance(metadata, dict):
            raise EvidenceLedgerError("metadata must be a bounded JSON object")
        try:
            metadata_json = json.dumps(metadata, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
            if len(metadata_json.encode("utf-8")) > 16_384:
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
            db.execute("BEGIN IMMEDIATE")
            existing = db.execute("""SELECT evidence_id FROM evidence_records
                WHERE scope=? AND scope_id=? AND source_id=? AND source_uri=? AND source_sha256=?
                  AND chunk_id=? AND start_offset=? AND end_offset=? AND claim_text IS ?
                ORDER BY recorded_at DESC, evidence_id LIMIT 1""",
                (scope, scope_id, source_id, source_uri, citation.source_sha256, chunk_id,
                 start_offset, end_offset, claim_text)).fetchone()
            if existing:
                db.commit()
                return str(existing["evidence_id"])
            db.execute("""INSERT INTO evidence_records
                (evidence_id, scope, scope_id, evidence_kind, source_id, source_uri, source_sha256, chunk_id,
                 page_number, section, start_offset, end_offset, quote_text, claim_text, confidence, recorded_at, metadata_json)
                VALUES (?, ?, ?, 'source_quote', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (evidence_id, scope, scope_id, source_id, source_uri, citation.source_sha256, chunk_id, page_number,
                 section, start_offset, end_offset, citation.text_snippet, claim_text, float(confidence),
                 int(time.time()), metadata_json))
            db.commit()
        return evidence_id


    @staticmethod
    def _validate_record_scope(scope: str, scope_id: str) -> None:
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
            raise EvidenceLedgerError("invalid evidence scope")
        if (scope == "global") != (scope_id == "global"):
            raise EvidenceLedgerError("global scope must use scope_id='global'; other scopes cannot")

    @staticmethod
    def _validate_record_metadata(metadata: dict[str, Any] | None) -> dict[str, Any]:
        if metadata is None:
            metadata = {}
        if not isinstance(metadata, dict):
            raise EvidenceLedgerError("metadata must be a bounded JSON object")
        try:
            encoded = json.dumps(metadata, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
        except (TypeError, ValueError) as exc:
            raise EvidenceLedgerError("metadata must be a bounded JSON object") from exc
        if len(encoded.encode("utf-8")) > 16_384:
            raise EvidenceLedgerError("metadata must be a bounded JSON object")
        return metadata

    @staticmethod
    def _validate_record_confidence(confidence: float) -> float:
        if isinstance(confidence, bool) or not isinstance(confidence, (int, float)):
            raise EvidenceLedgerError("confidence must be a finite number between 0 and 1")
        try:
            value = float(confidence)
        except (OverflowError, TypeError, ValueError) as exc:
            raise EvidenceLedgerError("confidence must be a finite number between 0 and 1") from exc
        if not math.isfinite(value) or not 0 <= value <= 1:
            raise EvidenceLedgerError("confidence must be a finite number between 0 and 1")
        return value

    @staticmethod
    def _validate_record_ids(values: list[str], *, minimum: int = 1, maximum: int = 20, label: str = "evidence_ids") -> list[str]:
        if not isinstance(values, list) or not minimum <= len(values) <= maximum:
            raise EvidenceLedgerError(f"{label} must contain between {minimum} and {maximum} IDs")
        if any(not isinstance(value, str) or not value or len(value) > 64 for value in values) or len(set(values)) != len(values):
            raise EvidenceLedgerError(f"{label} must contain unique non-empty IDs of at most 64 characters")
        return list(values)

    @staticmethod
    def _load_source_quotes(db: sqlite3.Connection, *, scope: str, scope_id: str,
                            evidence_ids: list[str]) -> list[sqlite3.Row]:
        placeholders = ",".join("?" for _ in evidence_ids)
        rows = db.execute(
            f"SELECT * FROM evidence_records WHERE scope=? AND scope_id=? AND evidence_kind='source_quote' AND evidence_id IN ({placeholders})",
            (scope, scope_id, *evidence_ids),
        ).fetchall()
        by_id = {str(row["evidence_id"]): row for row in rows}
        if len(by_id) != len(evidence_ids):
            raise EvidenceLedgerError("all evidence_ids must reference source quotes in the requested scope")
        return [by_id[evidence_id] for evidence_id in evidence_ids]

    def add_claim_assessment(self, *, scope: str, scope_id: str, claim_id: str, claim_text: str,
                             assessment: str, confidence: float, evidence_ids: list[str],
                             relations: dict[str, str], rationale: str, reviewer_mode: str,
                             run_id: str, reviewer_model: str | None = None,
                             metadata: dict[str, Any] | None = None) -> str:
        self._validate_record_scope(scope, scope_id)
        if not isinstance(claim_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", claim_id):
            raise EvidenceLedgerError("claim_id must be a stable identifier of at most 64 characters")
        if not isinstance(claim_text, str) or not claim_text.strip() or len(claim_text) > 8000:
            raise EvidenceLedgerError("claim_text must be non-empty text of at most 8000 characters")
        allowed_assessments = {"supported", "contradicted", "mixed", "insufficient", "unverified"}
        if assessment not in allowed_assessments:
            raise EvidenceLedgerError("assessment must be supported, contradicted, mixed, insufficient or unverified")
        confidence = self._validate_record_confidence(confidence)
        evidence_ids = self._validate_record_ids(evidence_ids)
        allowed_relations = {"supports", "contradicts", "qualifies", "context"}
        if not isinstance(relations, dict) or set(relations) != set(evidence_ids) or any(value not in allowed_relations for value in relations.values()):
            raise EvidenceLedgerError("relations must map every evidence_id to supports, contradicts, qualifies or context")
        relation_values = set(relations.values())
        if assessment == "supported" and not relation_values.intersection({"supports", "qualifies"}):
            raise EvidenceLedgerError("supported claims require supporting or qualifying evidence")
        if assessment == "contradicted" and "contradicts" not in relation_values:
            raise EvidenceLedgerError("contradicted claims require contradicting evidence")
        if assessment == "mixed" and not (relation_values.intersection({"supports", "qualifies"}) and "contradicts" in relation_values):
            raise EvidenceLedgerError("mixed claims require both supporting and contradicting evidence")
        if assessment in {"insufficient", "unverified"} and not relation_values.intersection({"context", "qualifies"}):
            raise EvidenceLedgerError("insufficient or unverified claims require contextual evidence")
        if not isinstance(rationale, str) or len(rationale) > 4000:
            raise EvidenceLedgerError("rationale must be text of at most 4000 characters")
        if reviewer_mode != "same-model":
            raise EvidenceLedgerError("reviewer_mode must be same-model until an independent reviewer is implemented")
        if not isinstance(run_id, str) or not run_id or len(run_id) > 160:
            raise EvidenceLedgerError("run_id must be non-empty text of at most 160 characters")
        if reviewer_model is not None and (not isinstance(reviewer_model, str) or len(reviewer_model) > 160):
            raise EvidenceLedgerError("reviewer_model must be text of at most 160 characters")
        metadata = self._validate_record_metadata(metadata)
        record = {
            "record_schema": 1, "claim_id": claim_id, "assessment": assessment,
            "evidence_ids": evidence_ids, "relations": relations, "rationale": rationale,
            "reviewer_mode": reviewer_mode, "reviewer_model": reviewer_model, "run_id": run_id,
            "metadata": metadata,
        }
        metadata_json = json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
        identity = json.dumps({"scope": scope, "scope_id": scope_id, "claim_text": claim_text,
                               "confidence": confidence, "record": record},
                              ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
        evidence_id = "clm_" + hashlib.sha256(identity.encode("utf-8")).hexdigest()[:60]
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            existing = db.execute("SELECT evidence_id FROM evidence_records WHERE evidence_id=? AND scope=? AND scope_id=?",
                                   (evidence_id, scope, scope_id)).fetchone()
            if existing:
                db.commit()
                return str(existing["evidence_id"])
            duplicate_rows = db.execute("""SELECT evidence_id, claim_text, metadata_json FROM evidence_records
                WHERE scope=? AND scope_id=? AND evidence_kind='claim'""", (scope, scope_id)).fetchall()
            for duplicate in duplicate_rows:
                duplicate_record = json.loads(duplicate["metadata_json"])
                if duplicate_record.get("run_id") == run_id and duplicate_record.get("claim_id") == claim_id:
                    raise EvidenceLedgerError("claim_id already exists in this scope and research run")
            source = self._load_source_quotes(db, scope=scope, scope_id=scope_id, evidence_ids=evidence_ids)[0]
            db.execute("""INSERT INTO evidence_records
                (evidence_id, scope, scope_id, evidence_kind, source_id, source_uri, source_sha256, chunk_id,
                 page_number, section, start_offset, end_offset, quote_text, claim_text, confidence, recorded_at, metadata_json)
                VALUES (?, ?, ?, 'claim', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (evidence_id, scope, scope_id, source["source_id"], source["source_uri"], source["source_sha256"],
                 source["chunk_id"], source["page_number"], source["section"], source["start_offset"],
                 source["end_offset"], source["quote_text"], claim_text, confidence, int(time.time()), metadata_json))
            db.commit()
        return evidence_id

    def add_contradiction_record(self, *, scope: str, scope_id: str, contradiction_id: str,
                                 claims: list[dict[str, str]], evidence_ids: list[str], kind: str,
                                 explanation: str, status: str, confidence: float,
                                 reviewer_mode: str, run_id: str, reviewer_model: str | None = None,
                                 metadata: dict[str, Any] | None = None) -> str:
        self._validate_record_scope(scope, scope_id)
        if not isinstance(contradiction_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", contradiction_id):
            raise EvidenceLedgerError("contradiction_id must be a stable identifier of at most 64 characters")
        if not isinstance(claims, list) or not 2 <= len(claims) <= 10:
            raise EvidenceLedgerError("claims must contain between 2 and 10 claim records")
        normalized_claims = []
        for item in claims:
            if not isinstance(item, dict) or set(item) != {"claim_id", "text"}:
                raise EvidenceLedgerError("each contradiction claim must contain only claim_id and text")
            if not isinstance(item["claim_id"], str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", item["claim_id"]):
                raise EvidenceLedgerError("invalid contradiction claim_id")
            if not isinstance(item["text"], str) or not item["text"].strip() or len(item["text"]) > 8000:
                raise EvidenceLedgerError("contradiction claim text must be non-empty and bounded")
            normalized_claims.append({"claim_id": item["claim_id"], "text": item["text"]})
        claim_ids = [item["claim_id"] for item in normalized_claims]
        if len(set(claim_ids)) != len(claim_ids):
            raise EvidenceLedgerError("contradiction claim_ids must be unique")
        evidence_ids = self._validate_record_ids(evidence_ids, minimum=2)
        allowed_kinds = {"direct", "partial", "temporal", "scope", "methodological"}
        if kind not in allowed_kinds:
            raise EvidenceLedgerError("kind must be direct, partial, temporal, scope or methodological")
        if not isinstance(explanation, str) or not explanation.strip() or len(explanation) > 4000:
            raise EvidenceLedgerError("explanation must be non-empty text of at most 4000 characters")
        if status not in {"open", "resolved", "accepted", "dismissed"}:
            raise EvidenceLedgerError("status must be open, resolved, accepted or dismissed")
        confidence = self._validate_record_confidence(confidence)
        if reviewer_mode != "same-model":
            raise EvidenceLedgerError("reviewer_mode must be same-model until an independent reviewer is implemented")
        if not isinstance(run_id, str) or not run_id or len(run_id) > 160:
            raise EvidenceLedgerError("run_id must be non-empty text of at most 160 characters")
        if reviewer_model is not None and (not isinstance(reviewer_model, str) or len(reviewer_model) > 160):
            raise EvidenceLedgerError("reviewer_model must be text of at most 160 characters")
        metadata = self._validate_record_metadata(metadata)
        record = {
            "record_schema": 1, "contradiction_id": contradiction_id,
            "claims": normalized_claims, "claim_ids": claim_ids, "evidence_ids": evidence_ids,
            "kind": kind, "explanation": explanation, "status": status,
            "reviewer_mode": reviewer_mode, "reviewer_model": reviewer_model, "run_id": run_id,
            "metadata": metadata,
        }
        metadata_json = json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
        claim_text = " ↔ ".join(item["text"] for item in normalized_claims)[:8000]
        identity = json.dumps({"scope": scope, "scope_id": scope_id, "claim_text": claim_text,
                               "confidence": confidence, "record": record},
                              ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
        evidence_id = "con_" + hashlib.sha256(identity.encode("utf-8")).hexdigest()[:60]
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            existing = db.execute("SELECT evidence_id FROM evidence_records WHERE evidence_id=? AND scope=? AND scope_id=?",
                                   (evidence_id, scope, scope_id)).fetchone()
            if existing:
                db.commit()
                return str(existing["evidence_id"])
            claim_rows = db.execute("""SELECT claim_text, metadata_json FROM evidence_records
                WHERE scope=? AND scope_id=? AND evidence_kind='claim'""", (scope, scope_id)).fetchall()
            available_claims = {}
            for row in claim_rows:
                try:
                    claim_record = json.loads(row["metadata_json"])
                except (TypeError, json.JSONDecodeError):
                    continue
                if claim_record.get("run_id") == run_id and isinstance(claim_record.get("claim_id"), str):
                    available_claims[claim_record["claim_id"]] = {
                        "text": row["claim_text"],
                        "evidence_ids": claim_record.get("evidence_ids", []),
                    }
            linked_evidence_ids = set()
            for item in normalized_claims:
                saved_claim = available_claims.get(item["claim_id"])
                if not saved_claim or saved_claim["text"] != item["text"]:
                    raise EvidenceLedgerError("contradiction claims must match existing claim records in the same scope and research run")
                linked_evidence_ids.update(saved_claim["evidence_ids"])
            if not set(evidence_ids).issubset(linked_evidence_ids):
                raise EvidenceLedgerError("contradiction evidence must be linked to its referenced claims")
            source = self._load_source_quotes(db, scope=scope, scope_id=scope_id, evidence_ids=evidence_ids)[0]
            db.execute("""INSERT INTO evidence_records
                (evidence_id, scope, scope_id, evidence_kind, source_id, source_uri, source_sha256, chunk_id,
                 page_number, section, start_offset, end_offset, quote_text, claim_text, confidence, recorded_at, metadata_json)
                VALUES (?, ?, ?, 'contradiction', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (evidence_id, scope, scope_id, source["source_id"], source["source_uri"], source["source_sha256"],
                 source["chunk_id"], source["page_number"], source["section"], source["start_offset"],
                 source["end_offset"], source["quote_text"], claim_text, confidence, int(time.time()), metadata_json))
            db.commit()
        return evidence_id

    def list_evidence(self, *, scope: str, scope_id: str, limit: int = 100) -> list[dict[str, Any]]:
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
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

    def delete_evidence(self, *, evidence_id: str, scope: str, scope_id: str) -> bool:
        if not isinstance(evidence_id, str) or not evidence_id or len(evidence_id) > 64:
            raise EvidenceLedgerError("invalid evidence ID")
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
            raise EvidenceLedgerError("invalid evidence scope")
        if (scope == "global") != (scope_id == "global"):
            raise EvidenceLedgerError("invalid global scope ID")
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT evidence_kind, metadata_json FROM evidence_records WHERE evidence_id=? AND scope=? AND scope_id=?",
                             (evidence_id, scope, scope_id)).fetchone()
            if row is None:
                db.commit()
                return False
            record = json.loads(row["metadata_json"])
            if row["evidence_kind"] == "source_quote":
                derived_rows = db.execute("""SELECT metadata_json FROM evidence_records
                    WHERE scope=? AND scope_id=? AND evidence_kind IN ('claim', 'contradiction')""",
                    (scope, scope_id)).fetchall()
                for derived in derived_rows:
                    linked = json.loads(derived["metadata_json"]).get("evidence_ids", [])
                    if evidence_id in linked:
                        raise EvidenceLedgerConflictError("source quote is referenced by a claim or contradiction record")
            if row["evidence_kind"] == "claim":
                claim_id = record.get("claim_id")
                contradiction_rows = db.execute("""SELECT metadata_json FROM evidence_records
                    WHERE scope=? AND scope_id=? AND evidence_kind='contradiction'""",
                    (scope, scope_id)).fetchall()
                for contradiction in contradiction_rows:
                    if claim_id in json.loads(contradiction["metadata_json"]).get("claim_ids", []):
                        raise EvidenceLedgerConflictError("claim is referenced by a contradiction record")
            cursor = db.execute(
                "DELETE FROM evidence_records WHERE evidence_id=? AND scope=? AND scope_id=?",
                (evidence_id, scope, scope_id),
            )
            db.commit()
        return cursor.rowcount == 1

