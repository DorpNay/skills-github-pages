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
