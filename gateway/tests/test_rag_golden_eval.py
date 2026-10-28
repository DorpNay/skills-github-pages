from __future__ import annotations

import json
from pathlib import Path

import pytest

from gateway.evals.run_rag_golden_eval import DatasetError, evaluate_dataset, load_dataset


FIXTURE = Path(__file__).parents[1] / "evals" / "fixtures" / "rag_golden_smoke.json"


def test_smoke_fixture_has_reproducible_retrieval_and_provenance_metrics() -> None:
    report = evaluate_dataset(load_dataset(FIXTURE), top_k=3)

    assert report["dataset_query_count"] == 2
    assert report["document_count"] == 3
    assert report["chunk_count"] == 3
    assert 0 <= report["metrics"]["recall_at_3"] <= 1
    assert 0 <= report["metrics"]["mrr"] <= 1
    assert 0 <= report["metrics"]["ndcg_at_3"] <= 1
    assert report["metrics"]["provenance_completeness_at_k"] == 1
    assert report["metrics"]["latency_p50_ms"] is not None
    assert report["metrics"]["latency_p95_ms"] >= report["metrics"]["latency_p50_ms"]
    assert all(
        item["scope_id"] if "scope_id" in item else True
        for query in report["queries"] for item in query["retrieved"]
    )


def test_retrieval_eval_does_not_leak_chunks_across_project_scopes() -> None:
    dataset = {
        "schema_version": 1,
        "documents": [
            {
                "document_id": "public-doc",
                "source_uri": "https://example.test/public",
                "scope": "project",
                "scope_id": "alpha",
                "chunks": [{"chunk_id": "alpha-1", "content": "OAuth refresh tokens need encrypted storage."}],
            },
            {
                "document_id": "private-doc",
                "source_uri": "https://example.test/private",
                "scope": "project",
                "scope_id": "beta",
                "chunks": [{"chunk_id": "beta-1", "content": "OAuth refresh tokens need encrypted storage."}],
            },
        ],
        "queries": [{
            "id": "alpha-query",
            "query": "OAuth refresh tokens encrypted storage",
            "scope": "project",
            "scope_id": "alpha",
            "relevant_chunks": [{"document_id": "public-doc", "chunk_id": "alpha-1"}],
        }],
    }

    report = evaluate_dataset(dataset, top_k=5)
    retrieved = report["queries"][0]["retrieved"]
    assert retrieved
    assert {item["document_id"] for item in retrieved} == {"public-doc"}
    assert all(item["source_uri"] == "https://example.test/public" for item in retrieved)


def test_dataset_rejects_gold_labels_outside_the_query_scope(tmp_path: Path) -> None:
    dataset = {
        "schema_version": 1,
        "documents": [{
            "document_id": "private-doc",
            "source_uri": "https://example.test/private",
            "scope": "project",
            "scope_id": "beta",
            "chunks": [{"chunk_id": "private-1", "content": "OAuth refresh tokens need encrypted storage."}],
        }],
        "queries": [{
            "id": "alpha-query",
            "query": "OAuth refresh tokens",
            "scope": "project",
            "scope_id": "alpha",
            "relevant_chunks": [{"document_id": "private-doc", "chunk_id": "private-1"}],
        }],
    }
    path = tmp_path / "invalid.json"
    path.write_text(json.dumps(dataset), encoding="utf-8")

    with pytest.raises(DatasetError, match="missing or out-of-scope"):
        load_dataset(path)


def test_dataset_rejects_duplicate_ids_and_empty_relevance(tmp_path: Path) -> None:
    dataset = json.loads(FIXTURE.read_text(encoding="utf-8"))
    dataset["queries"][1]["id"] = dataset["queries"][0]["id"]
    path = tmp_path / "duplicate.json"
    path.write_text(json.dumps(dataset), encoding="utf-8")
    with pytest.raises(DatasetError, match="duplicate query id"):
        load_dataset(path)

    dataset = json.loads(FIXTURE.read_text(encoding="utf-8"))
    dataset["queries"][0]["relevant_chunks"] = []
    path.write_text(json.dumps(dataset), encoding="utf-8")
    with pytest.raises(DatasetError, match="at least one relevant_chunks"):
        load_dataset(path)


def test_top_k_validation_rejects_boolean_and_out_of_range_values() -> None:
    dataset = load_dataset(FIXTURE)
    for value in (True, 0, 21, 1.5):
        with pytest.raises(ValueError, match="top_k"):
            evaluate_dataset(dataset, top_k=value)  # type: ignore[arg-type]
