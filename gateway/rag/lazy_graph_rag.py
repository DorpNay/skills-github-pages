"""Low-footprint SQLite FTS5 + lexical-concept graph retrieval baseline.

This is graph-assisted local retrieval inspired by LazyGraphRAG's staged/cost-aware
approach, not a reimplementation of Microsoft's full LazyGraphRAG algorithm. It uses no
LLM or embedding model during indexing; evidence snippets retain source and page metadata.
"""
from __future__ import annotations

import hashlib
import json
import re
import sqlite3
import time
from contextlib import closing
from pathlib import Path
from typing import Any

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
    # Each token is quoted, and any quotes are doubled, so query text cannot alter FTS syntax.
    return " OR ".join('"' + token.replace('"', '""') + '"' for token in tokens)


class LazyGraphRAG:
    def __init__(self, path: str | Path, *, max_chunk_chars: int = 20_000):
        self.path = str(path)
        self.max_chunk_chars = max_chunk_chars

    def _connect(self) -> sqlite3.Connection:
        db = sqlite3.connect(self.path, timeout=5.0)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA busy_timeout=5000")
        return db

    def initialize(self) -> None:
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS rag_documents (
                    document_id TEXT PRIMARY KEY,
                    scope TEXT NOT NULL,
                    scope_id TEXT NOT NULL,
                    source_uri TEXT NOT NULL,
                    created_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS rag_chunks (
                    chunk_id TEXT PRIMARY KEY,
                    document_id TEXT NOT NULL REFERENCES rag_documents(document_id) ON DELETE CASCADE,
                    scope TEXT NOT NULL,
                    scope_id TEXT NOT NULL,
                    source_uri TEXT NOT NULL,
                    page_number INTEGER,
                    content TEXT NOT NULL,
                    created_at INTEGER NOT NULL
                );
                CREATE VIRTUAL TABLE IF NOT EXISTS rag_fts USING fts5(
                    chunk_id UNINDEXED, content, tokenize='unicode61'
                );
                CREATE TABLE IF NOT EXISTS rag_chunk_concepts (
                    chunk_id TEXT NOT NULL REFERENCES rag_chunks(chunk_id) ON DELETE CASCADE,
                    concept TEXT NOT NULL,
                    PRIMARY KEY(chunk_id, concept)
                );
                CREATE INDEX IF NOT EXISTS idx_rag_chunk_scope
                    ON rag_chunks(scope, scope_id, document_id);
                CREATE INDEX IF NOT EXISTS idx_rag_concepts
                    ON rag_chunk_concepts(concept, chunk_id);
            """)
            db.commit()

    def ingest_document(self, document_id: str, source_uri: str, chunks: list[dict[str, Any]], *,
                        scope: str, scope_id: str) -> int:
        if not document_id or len(document_id) > 160 or not source_uri or len(source_uri) > 2048:
            raise ValueError("document_id and source_uri must be present and bounded")
        if scope not in {"conversation", "project", "global"} or not scope_id or len(scope_id) > 160:
            raise ValueError("Invalid RAG scope")
        if not isinstance(chunks, list) or len(chunks) > 10_000:
            raise ValueError("chunks must be a bounded list")
        now = int(time.time())
        with closing(self._connect()) as db:
            db.execute("PRAGMA foreign_keys=ON")
            db.execute("BEGIN IMMEDIATE")
            # Re-ingestion is replace-by-document, including the FTS rows.
            prior = db.execute("SELECT chunk_id FROM rag_chunks WHERE document_id=?", (document_id,)).fetchall()
            for item in prior:
                db.execute("DELETE FROM rag_fts WHERE chunk_id=?", (item["chunk_id"],))
            db.execute("DELETE FROM rag_chunk_concepts WHERE chunk_id IN (SELECT chunk_id FROM rag_chunks WHERE document_id=?)", (document_id,))
            db.execute("DELETE FROM rag_chunks WHERE document_id=?", (document_id,))
            db.execute("""INSERT INTO rag_documents(document_id, scope, scope_id, source_uri, created_at)
                          VALUES (?, ?, ?, ?, ?) ON CONFLICT(document_id) DO UPDATE SET scope=excluded.scope,
                          scope_id=excluded.scope_id, source_uri=excluded.source_uri, created_at=excluded.created_at""",
                       (document_id, scope, scope_id, source_uri, now))
            inserted = 0
            for index, item in enumerate(chunks):
                if not isinstance(item, dict) or not isinstance(item.get("content"), str):
                    raise ValueError("Each chunk needs textual content")
                content = item["content"]
                if not content.strip() or len(content) > self.max_chunk_chars:
                    raise ValueError("Chunk content must be non-empty and below size limit")
                page = item.get("page_number")
                if page is not None and (isinstance(page, bool) or not isinstance(page, int) or page < 1):
                    raise ValueError("page_number must be a positive integer")
                chunk_id = str(item.get("chunk_id") or hashlib.sha256(
                    f"{document_id}:{index}:{content}".encode("utf-8")).hexdigest()[:32])
                db.execute("""INSERT INTO rag_chunks(chunk_id, document_id, scope, scope_id, source_uri,
                              page_number, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                           (chunk_id, document_id, scope, scope_id, source_uri, page, content, now))
                db.execute("INSERT INTO rag_fts(chunk_id, content) VALUES (?, ?)", (chunk_id, content))
                db.executemany("INSERT INTO rag_chunk_concepts(chunk_id, concept) VALUES (?, ?)",
                               [(chunk_id, concept) for concept in concepts(content)])
                inserted += 1
            db.commit()
            return inserted

    def retrieve(self, query: str, *, scope: str, scope_id: str, top_k: int = 5,
                 candidate_limit: int = 20) -> list[dict[str, Any]]:
        if scope not in {"conversation", "project", "global"} or not scope_id or len(scope_id) > 160:
            raise ValueError("Invalid RAG scope")
        if not 1 <= top_k <= 20 or not top_k <= candidate_limit <= 100:
            raise ValueError("Invalid retrieval limits")
        fts_query = safe_fts_query(query)
        if not fts_query:
            return []
        with closing(self._connect()) as db:
            try:
                lexical = db.execute("""
                    SELECT c.*, bm25(rag_fts) AS bm25_score
                    FROM rag_fts JOIN rag_chunks c ON c.chunk_id=rag_fts.chunk_id
                    WHERE rag_fts MATCH ? AND c.scope=? AND c.scope_id=?
                    ORDER BY bm25_score ASC LIMIT ?
                """, (fts_query, scope, scope_id, candidate_limit)).fetchall()
            except sqlite3.OperationalError:
                return []
            results: dict[str, dict[str, Any]] = {}
            for position, row in enumerate(lexical):
                results[row["chunk_id"]] = {
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
                    JOIN rag_chunks c ON c.chunk_id=ce.chunk_id
                    WHERE ce.concept IN ({placeholders}) AND c.scope=? AND c.scope_id=?
                    GROUP BY c.chunk_id
                    ORDER BY shared_concepts DESC LIMIT ?
                """, (*query_concepts, scope, scope_id, candidate_limit)).fetchall()
                for row in graph_rows:
                    record = results.get(row["chunk_id"])
                    graph_score = min(0.7, 0.15 * int(row["shared_concepts"]))
                    if record is None:
                        record = {
                            "chunk_id": row["chunk_id"], "document_id": row["document_id"],
                            "content": row["content"], "source_uri": row["source_uri"],
                            "page_number": row["page_number"], "scope": row["scope"], "scope_id": row["scope_id"],
                            "score": graph_score, "retrieval_path": [],
                        }
                        results[row["chunk_id"]] = record
                    else:
                        record["score"] = min(1.7, record["score"] + graph_score)
                    record["retrieval_path"].append("concept_graph")
            return sorted(results.values(), key=lambda item: (-item["score"], item["chunk_id"]))[:top_k]
