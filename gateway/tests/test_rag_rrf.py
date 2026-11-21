from __future__ import annotations

import pytest

from gateway.rag.lazy_graph_rag import LazyGraphRAG, reciprocal_rank_fusion


def test_rrf_prefers_candidates_consistently_ranked_by_both_retrievers() -> None:
    scores = reciprocal_rank_fusion([
        ["lexical-only", "shared", "lexical-tail"],
        ["shared", "graph-only"],
    ])

    assert scores["shared"] > scores["lexical-only"]
    assert scores["shared"] > scores["graph-only"]
    assert scores["lexical-only"] > scores["lexical-tail"]


def test_rrf_counts_a_candidate_once_per_ranking_and_is_deterministic() -> None:
    rankings = [["same", "same", "lexical"], ["same", "graph"]]
    first = reciprocal_rank_fusion(rankings)
    second = reciprocal_rank_fusion(rankings)

    assert first == second
    assert first["same"] == pytest.approx((1 / 61) + (1 / 61))
    assert first["lexical"] == pytest.approx(1 / 62)
    assert first["graph"] == pytest.approx(1 / 62)


@pytest.mark.parametrize("rank_constant", [0, -1, True, 1.5])
def test_rrf_rejects_invalid_rank_constant(rank_constant: object) -> None:
    with pytest.raises(ValueError):
        reciprocal_rank_fusion([["candidate"]], rank_constant=rank_constant)  # type: ignore[arg-type]


def test_rrf_rejects_unbounded_or_invalid_rankings() -> None:
    with pytest.raises(ValueError):
        reciprocal_rank_fusion([["candidate"], "not-a-ranking"])  # type: ignore[list-item]
    with pytest.raises(ValueError):
        reciprocal_rank_fusion([[""]])


def test_document_catalog_is_scope_bound_and_returns_metadata_and_chunk_count(tmp_path) -> None:
    rag = LazyGraphRAG(tmp_path / "rag.sqlite3")
    rag.initialize()
    metadata = {
        "original_name": "project-notes.md",
        "mime_type": "text/markdown",
        "size_bytes": 1024,
        "sha256": "a" * 64,
        "parser": "markdown-text",
        "character_count": 52,
        "source_type": "file",
        "preview": "Project source metadata and retrieval scope.",
    }
    rag.ingest_document(
        "doc-a", "https://sources.example.test/project-notes.md",
        [{"chunk_id": "a-1", "content": "Project source metadata and retrieval scope."},
         {"chunk_id": "a-2", "content": "A second indexed chunk for the same source."}],
        scope="project", scope_id="project-a", metadata=metadata,
    )
    rag.ingest_document(
        "doc-b", "https://sources.example.test/private.md",
        [{"chunk_id": "b-1", "content": "A source belonging to another project."}],
        scope="project", scope_id="project-b",
    )

    documents = rag.list_documents(scope="project", scope_id="project-a")
    assert len(documents) == 1
    assert documents[0]["document_id"] == "doc-a"
    assert documents[0]["chunk_count"] == 2
    assert documents[0]["metadata"] == metadata
    assert documents[0]["metadata"]["preview"].startswith("Project source")
    assert rag.list_documents(scope="project", scope_id="project-b")[0]["document_id"] == "doc-b"
    assert rag.list_documents(scope="project", scope_id="missing") == []
    assert rag.delete_document("doc-a", scope="project", scope_id="project-a")
    assert rag.list_documents(scope="project", scope_id="project-a") == []


def test_document_metadata_rejects_unknown_fields_and_invalid_hash(tmp_path) -> None:
    rag = LazyGraphRAG(tmp_path / "rag.sqlite3")
    rag.initialize()
    chunks = [{"chunk_id": "c1", "content": "A bounded source chunk."}]
    with pytest.raises(ValueError, match="unsupported fields"):
        rag.ingest_document("doc-a", "https://sources.example.test/a", chunks,
                            scope="project", scope_id="project-a", metadata={"raw_text": "not allowed"})
    with pytest.raises(ValueError, match="sha256"):
        rag.ingest_document("doc-b", "https://sources.example.test/b", chunks,
                            scope="project", scope_id="project-a", metadata={"sha256": "not-a-hash"})
    with pytest.raises(ValueError, match="preview"):
        rag.ingest_document("doc-c", "https://sources.example.test/a", chunks,
                            scope="project", scope_id="project-a", metadata={"preview": "x" * 1201})


def test_v2_rag_database_adds_source_metadata_column_without_losing_documents(tmp_path) -> None:
    import sqlite3

    path = tmp_path / "rag-v2.sqlite3"
    with sqlite3.connect(path) as db:
        db.execute("""CREATE TABLE rag_documents (
            document_key TEXT PRIMARY KEY, document_id TEXT NOT NULL, scope TEXT NOT NULL,
            scope_id TEXT NOT NULL, source_uri TEXT NOT NULL, created_at INTEGER NOT NULL,
            UNIQUE(scope, scope_id, document_id)
        )""")
        db.execute("""INSERT INTO rag_documents VALUES
            ('key-a', 'doc-a', 'project', 'project-a', 'https://sources.example.test/a', 123)""")
    rag = LazyGraphRAG(path)
    rag.initialize()
    with sqlite3.connect(path) as db:
        columns = {row[1] for row in db.execute("PRAGMA table_info(rag_documents)")}
        version = db.execute("PRAGMA user_version").fetchone()[0]
    assert "metadata_json" in columns
    assert version == 3
    assert rag.list_documents(scope="project", scope_id="project-a")[0]["metadata"] == {}


def test_retrieval_uses_rrf_without_losing_scope_or_source_metadata(tmp_path) -> None:
    rag = LazyGraphRAG(tmp_path / "rag.sqlite3")
    rag.initialize()
    rag.ingest_document(
        "doc-a",
        "https://example.test/a",
        [{"chunk_id": "a-1", "content": "SQLite WAL helps memory writes and concurrency.", "page_number": 2}],
        scope="project",
        scope_id="alandi",
    )
    rag.ingest_document(
        "doc-b",
        "https://example.test/b",
        [{"chunk_id": "b-1", "content": "The gateway uses SQLite memory writes for project records.", "page_number": 7}],
        scope="project",
        scope_id="alandi",
    )
    rag.ingest_document(
        "private",
        "https://example.test/private",
        [{"chunk_id": "private-1", "content": "SQLite WAL memory writes for another project.", "page_number": 9}],
        scope="project",
        scope_id="different-project",
    )

    results = rag.retrieve("SQLite WAL memory writes", scope="project", scope_id="alandi", top_k=5)

    assert len(results) == 2
    assert [result["score"] for result in results] == sorted(
        (result["score"] for result in results), reverse=True
    )
    assert all(0 < result["score"] <= 2 / 61 for result in results)
    assert all(result["scope_id"] == "alandi" for result in results)
    assert {result["source_uri"] for result in results} == {"https://example.test/a", "https://example.test/b"}
    assert all(isinstance(result["page_number"], int) for result in results)
    assert all("fts5" in result["retrieval_path"] for result in results)
    assert all("concept_graph" in result["retrieval_path"] for result in results)
