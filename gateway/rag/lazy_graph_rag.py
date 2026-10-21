"""Low-footprint SQLite FTS5 + lexical-concept graph retrieval baseline.

This is a small retrieval baseline inspired by staged/cost-aware GraphRAG ideas, not a
reimplementation of Microsoft's full LazyGraphRAG algorithm. No LLM or embedding model is
loaded; chunks preserve source/page provenance, and all document/chunk IDs are scope-bound.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import sqlite3
import time
from contextlib import closing
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

_WORD = re.compile(r"[^\w'-]+", re.UNICODE)
_STOP = frozenset("""
a an the and or but to of in on at for with from by as is are was were be been being it
this that these those i you he she they we my your our their not no do does did can could
what why how when where which who please tell about into over under again then than
и а но в во на к ко от до по за из у о об от для при с со без как что это эта этот эти
тот те я ты вы мы он она они мне меня тебе вам наш ваш их не да нет ли же бы то или
как где когда зачем почему пожалуйста расскажи скажи найти найди исследуй
""".split())


def terms(text: str) -> list[str]:
    return [word for word in _WORD.sub(" ", text.casefold()).split()
            if len(word) >= 3 and word not in _STOP and not word.isdigit()]


def concepts(text: str, limit: int = 24) -> list[str]:
    counts: dict[str, int] = {}
    for word in terms(text):
        counts[word] = counts.get(word, 0) + 1
    return [word for word, _ in sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:limit]]


def safe_fts_query(query: str) -> str:
    tokens = terms(query)[:24]
    if not tokens:
        return ""
    return " OR ".join('"' + token.replace('"', '""') + '"' for token in tokens)


def _stable_key(*parts: str) -> str:
    payload = json.dumps(parts, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


class LazyGraphRAG:
    def __init__(self, path: str | Path, *, max_chunk_chars: int = 20_000):
        self.path = str(path)
        self.max_chunk_chars = max_chunk_chars

    def _connect(self) -> sqlite3.Connection:
        db = sqlite3.connect(self.path, timeout=5.0)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA busy_timeout=5000")
        return db

    @staticmethod
    def _document_key(document_id: str, scope: str, scope_id: str) -> str:
        return _stable_key("document", scope, scope_id, document_id)

    @staticmethod
    def _chunk_key(document_key: str, chunk_id: str) -> str:
        return _stable_key("chunk", document_key, chunk_id)

    @staticmethod
    def _create_schema(db: sqlite3.Connection) -> None:
        statements = [
            """CREATE TABLE IF NOT EXISTS rag_documents (
                document_key TEXT PRIMARY KEY,
                document_id TEXT NOT NULL,
                scope TEXT NOT NULL,
                scope_id TEXT NOT NULL,
                source_uri TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                UNIQUE(scope, scope_id, document_id)
            )""",
            """CREATE TABLE IF NOT EXISTS rag_chunks (
                chunk_key TEXT PRIMARY KEY,
                chunk_id TEXT NOT NULL,
                document_key TEXT NOT NULL REFERENCES rag_documents(document_key) ON DELETE CASCADE,
                document_id TEXT NOT NULL,
                scope TEXT NOT NULL,
                scope_id TEXT NOT NULL,
                source_uri TEXT NOT NULL,
                page_number INTEGER,
                content TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                UNIQUE(scope, scope_id, document_id, chunk_id)
            )""",
            """CREATE VIRTUAL TABLE IF NOT EXISTS rag_fts USING fts5(
                chunk_key UNINDEXED, content, tokenize='unicode61'
            )""",
            """CREATE TABLE IF NOT EXISTS rag_chunk_concepts (
                chunk_key TEXT NOT NULL REFERENCES rag_chunks(chunk_key) ON DELETE CASCADE,
                concept TEXT NOT NULL,
                PRIMARY KEY(chunk_key, concept)
            )""",
            """CREATE INDEX IF NOT EXISTS idx_rag_chunk_scope
                ON rag_chunks(scope, scope_id, document_id)""",
            """CREATE INDEX IF NOT EXISTS idx_rag_concepts
                ON rag_chunk_concepts(concept, chunk_key)""",
        ]
        for statement in statements:
            db.execute(statement)

    def _migrate_v1(self, db: sqlite3.Connection) -> None:
        """Migrate the earlier global-ID prototype without discarding indexed content."""
        db.execute("PRAGMA foreign_keys=OFF")
        db.execute("BEGIN IMMEDIATE")
        db.execute("DROP INDEX IF EXISTS idx_rag_chunk_scope")
        db.execute("DROP INDEX IF EXISTS idx_rag_concepts")
        db.execute("ALTER TABLE rag_chunk_concepts RENAME TO rag_chunk_concepts_v1")
        db.execute("ALTER TABLE rag_chunks RENAME TO rag_chunks_v1")
        db.execute("ALTER TABLE rag_documents RENAME TO rag_documents_v1")
        # FTS is derived from chunk content, so rebuild it instead of copying its internals.
        db.execute("DROP TABLE IF EXISTS rag_fts")
        self._create_schema(db)

        document_keys: dict[tuple[str, str, str], str] = {}
        for row in db.execute("SELECT * FROM rag_documents_v1").fetchall():
            key = self._document_key(row["document_id"], row["scope"], row["scope_id"])
            document_keys[(row["scope"], row["scope_id"], row["document_id"])] = key
            db.execute("""INSERT INTO rag_documents(document_key, document_id, scope, scope_id, source_uri, created_at)
                           VALUES (?, ?, ?, ?, ?, ?)""",
                       (key, row["document_id"], row["scope"], row["scope_id"], row["source_uri"], row["created_at"]))

        old_to_new_chunk: dict[str, str] = {}
        for row in db.execute("SELECT * FROM rag_chunks_v1").fetchall():
            document_key = document_keys[(row["scope"], row["scope_id"], row["document_id"])]
            chunk_key = self._chunk_key(document_key, row["chunk_id"])
            old_to_new_chunk[row["chunk_id"]] = chunk_key
            db.execute("""INSERT INTO rag_chunks(chunk_key, chunk_id, document_key, document_id, scope, scope_id,
                           source_uri, page_number, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                       (chunk_key, row["chunk_id"], document_key, row["document_id"], row["scope"],
                        row["scope_id"], row["source_uri"], row["page_number"], row["content"], row["created_at"]))
            db.execute("INSERT INTO rag_fts(chunk_key, content) VALUES (?, ?)", (chunk_key, row["content"]))

        for row in db.execute("SELECT * FROM rag_chunk_concepts_v1").fetchall():
            chunk_key = old_to_new_chunk.get(row["chunk_id"])
            if chunk_key:
                db.execute("INSERT OR IGNORE INTO rag_chunk_concepts(chunk_key, concept) VALUES (?, ?)",
                           (chunk_key, row["concept"]))

        db.execute("DROP TABLE rag_chunk_concepts_v1")
        db.execute("DROP TABLE rag_chunks_v1")
        db.execute("DROP TABLE rag_documents_v1")
        db.execute("PRAGMA user_version=2")
        db.commit()
        db.execute("PRAGMA foreign_keys=ON")

    def initialize(self) -> None:
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as db:
            db.execute("PRAGMA foreign_keys=ON")
            tables = {row[0] for row in db.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()}
            if "rag_documents" in tables:
                columns = {row["name"] for row in db.execute("PRAGMA table_info(rag_documents)").fetchall()}
                if "document_key" not in columns:
                    self._migrate_v1(db)
                else:
                    self._create_schema(db)
                    db.execute("PRAGMA user_version=2")
                    db.commit()
            else:
                self._create_schema(db)
                db.execute("PRAGMA user_version=2")
                db.commit()
        if self.path != ":memory:":
            os.chmod(self.path, 0o600)

    def ingest_document(self, document_id: str, source_uri: str, chunks: list[dict[str, Any]], *,
                        scope: str, scope_id: str) -> int:
        if not isinstance(document_id, str) or not document_id or len(document_id) > 160:
            raise ValueError("document_id must be present and bounded")
        if not isinstance(source_uri, str) or not source_uri or len(source_uri) > 2048:
            raise ValueError("source_uri must be present and bounded")
        parsed_source = urlsplit(source_uri)
        if (parsed_source.scheme != "https" or not parsed_source.hostname or
                parsed_source.username or parsed_source.password or
                any(ord(char) < 32 for char in source_uri)):
            raise ValueError("source_uri must be a safe HTTPS URL without embedded credentials or control characters")
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
            raise ValueError("Invalid RAG scope")
        if not isinstance(chunks, list) or len(chunks) > 10_000:
            raise ValueError("chunks must be a bounded list")

        prepared: list[tuple[str, str, int | None, str]] = []
        seen_chunk_ids: set[str] = set()
        for index, item in enumerate(chunks):
            if not isinstance(item, dict) or not isinstance(item.get("content"), str):
                raise ValueError("Each chunk needs textual content")
            text = item["content"]
            if not text.strip() or len(text) > self.max_chunk_chars:
                raise ValueError("Chunk content must be non-empty and below size limit")
            page = item.get("page_number")
            if page is not None and (isinstance(page, bool) or not isinstance(page, int) or page < 1):
                raise ValueError("page_number must be a positive integer")
            supplied_id = item.get("chunk_id")
            chunk_id = supplied_id if isinstance(supplied_id, str) and supplied_id else hashlib.sha256(
                f"{document_id}:{index}:{text}".encode("utf-8")).hexdigest()[:32]
            if len(chunk_id) > 160 or chunk_id in seen_chunk_ids:
                raise ValueError("Chunk IDs must be unique within a document and at most 160 characters")
            seen_chunk_ids.add(chunk_id)
            prepared.append((chunk_id, text, page, text))

        now = int(time.time())
        document_key = self._document_key(document_id, scope, scope_id)
        with closing(self._connect()) as db:
            db.execute("PRAGMA foreign_keys=ON")
            db.execute("BEGIN IMMEDIATE")
            prior = db.execute("SELECT chunk_key FROM rag_chunks WHERE document_key=?", (document_key,)).fetchall()
            for item in prior:
                db.execute("DELETE FROM rag_fts WHERE chunk_key=?", (item["chunk_key"],))
            db.execute("DELETE FROM rag_chunk_concepts WHERE chunk_key IN (SELECT chunk_key FROM rag_chunks WHERE document_key=?)",
                       (document_key,))
            db.execute("DELETE FROM rag_chunks WHERE document_key=?", (document_key,))
            db.execute("""INSERT INTO rag_documents(document_key, document_id, scope, scope_id, source_uri, created_at)
                          VALUES (?, ?, ?, ?, ?, ?)
                          ON CONFLICT(scope, scope_id, document_id) DO UPDATE SET
                          source_uri=excluded.source_uri, created_at=excluded.created_at""",
                       (document_key, document_id, scope, scope_id, source_uri, now))
            inserted = 0
            for chunk_id, content, page, _ in prepared:
                chunk_key = self._chunk_key(document_key, chunk_id)
                db.execute("""INSERT INTO rag_chunks(chunk_key, chunk_id, document_key, document_id, scope, scope_id,
                              source_uri, page_number, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                           (chunk_key, chunk_id, document_key, document_id, scope, scope_id, source_uri, page, content, now))
                db.execute("INSERT INTO rag_fts(chunk_key, content) VALUES (?, ?)", (chunk_key, content))
                db.executemany("INSERT INTO rag_chunk_concepts(chunk_key, concept) VALUES (?, ?)",
                               [(chunk_key, concept) for concept in concepts(content)])
                inserted += 1
            db.commit()
            return inserted

    def delete_document(self, document_id: str, *, scope: str, scope_id: str) -> bool:
        if not isinstance(document_id, str) or not document_id or len(document_id) > 160:
            raise ValueError("Invalid document_id")
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
            raise ValueError("Invalid RAG scope")
        document_key = self._document_key(document_id, scope, scope_id)
        with closing(self._connect()) as db:
            db.execute("PRAGMA foreign_keys=ON")
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT 1 FROM rag_documents WHERE document_key=?", (document_key,)).fetchone()
            if row is None:
                db.rollback()
                return False
            chunk_rows = db.execute("SELECT chunk_key FROM rag_chunks WHERE document_key=?", (document_key,)).fetchall()
            for chunk in chunk_rows:
                db.execute("DELETE FROM rag_fts WHERE chunk_key=?", (chunk["chunk_key"],))
            db.execute("DELETE FROM rag_chunk_concepts WHERE chunk_key IN (SELECT chunk_key FROM rag_chunks WHERE document_key=?)",
                       (document_key,))
            db.execute("DELETE FROM rag_chunks WHERE document_key=?", (document_key,))
            db.execute("DELETE FROM rag_documents WHERE document_key=?", (document_key,))
            db.commit()
        return True

    def retrieve(self, query: str, *, scope: str, scope_id: str, top_k: int = 5,
                 candidate_limit: int = 20) -> list[dict[str, Any]]:
        if scope not in {"conversation", "project", "global"} or not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
            raise ValueError("Invalid RAG scope")
        if (isinstance(top_k, bool) or not isinstance(top_k, int) or
                isinstance(candidate_limit, bool) or not isinstance(candidate_limit, int) or
                not 1 <= top_k <= 20 or not top_k <= candidate_limit <= 100):
            raise ValueError("Invalid retrieval limits")
        fts_query = safe_fts_query(query)
        if not fts_query:
            return []
        with closing(self._connect()) as db:
            try:
                lexical = db.execute("""
                    SELECT c.*, bm25(rag_fts) AS bm25_score
                    FROM rag_fts JOIN rag_chunks c ON c.chunk_key=rag_fts.chunk_key
                    WHERE rag_fts MATCH ? AND c.scope=? AND c.scope_id=?
                    ORDER BY bm25_score ASC LIMIT ?
                """, (fts_query, scope, scope_id, candidate_limit)).fetchall()
            except sqlite3.OperationalError:
                return []
            results: dict[str, dict[str, Any]] = {}
            for position, row in enumerate(lexical):
                results[row["chunk_key"]] = {
                    "chunk_id": row["chunk_id"], "document_id": row["document_id"],
                    "content": row["content"], "source_uri": row["source_uri"],
                    "page_number": row["page_number"], "scope": row["scope"], "scope_id": row["scope_id"],
                    "score": 1.0 / (position + 1), "retrieval_path": ["fts5"],
                }

            query_concepts = concepts(query, limit=12)
            if query_concepts:
                placeholders = ",".join("?" for _ in query_concepts)
                graph_rows = db.execute(f"""
                    SELECT c.*, COUNT(DISTINCT ce.concept) AS shared_concepts
                    FROM rag_chunk_concepts ce
                    JOIN rag_chunks c ON c.chunk_key=ce.chunk_key
                    WHERE ce.concept IN ({placeholders}) AND c.scope=? AND c.scope_id=?
                    GROUP BY c.chunk_key
                    ORDER BY shared_concepts DESC LIMIT ?
                """, (*query_concepts, scope, scope_id, candidate_limit)).fetchall()
                for row in graph_rows:
                    record = results.get(row["chunk_key"])
                    graph_score = min(0.7, 0.15 * int(row["shared_concepts"]))
                    if record is None:
                        record = {
                            "chunk_id": row["chunk_id"], "document_id": row["document_id"],
                            "content": row["content"], "source_uri": row["source_uri"],
                            "page_number": row["page_number"], "scope": row["scope"], "scope_id": row["scope_id"],
                            "score": graph_score, "retrieval_path": [],
                        }
                        results[row["chunk_key"]] = record
                    else:
                        record["score"] = min(1.7, record["score"] + graph_score)
                    record["retrieval_path"].append("concept_graph")
            return sorted(results.values(), key=lambda item: (-item["score"], item["document_id"], item["chunk_id"]))[:top_k]
