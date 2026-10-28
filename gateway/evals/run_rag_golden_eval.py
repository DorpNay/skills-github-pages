"""Evaluate scoped SQLite FTS5 + concept-graph RAG against a labelled JSON dataset.

Run from the repository root:
    python gateway/evals/run_rag_golden_eval.py path/to/golden-set.json
The evaluator is offline and deterministic apart from measured wall-clock latency. It never
calls a model or network. Latency and metrics on synthetic fixtures are not production claims.
"""
from __future__ import annotations

import argparse
import json
import math
import statistics
import sys
import tempfile
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from gateway.rag.lazy_graph_rag import LazyGraphRAG

MAX_DATASET_BYTES = 10 * 1024 * 1024
MAX_DOCUMENTS = 500
MAX_QUERIES = 1000
MAX_TOTAL_CHUNKS = 10_000
MAX_QUERY_CHARS = 2_000


class DatasetError(ValueError):
    """Raised when a golden dataset is malformed or exceeds safe limits."""


def _object(value: object, where: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise DatasetError(f"{where} must be an object")
    return value


def _nonempty(value: object, where: str, limit: int) -> str:
    if not isinstance(value, str) or not value.strip() or len(value) > limit:
        raise DatasetError(f"{where} must be a non-empty string of at most {limit} characters")
    return value.strip()


def load_dataset(path: str | Path) -> dict[str, Any]:
    source = Path(path)
    try:
        if source.stat().st_size > MAX_DATASET_BYTES:
            raise DatasetError(f"Dataset exceeds {MAX_DATASET_BYTES} bytes")
        raw = source.read_text(encoding="utf-8")
        dataset = json.loads(raw)
    except DatasetError:
        raise
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise DatasetError(f"Cannot read dataset as UTF-8 JSON: {exc}") from exc

    dataset = _object(dataset, "dataset")
    if dataset.get("schema_version") != 1:
        raise DatasetError("schema_version must be 1")
    documents = dataset.get("documents")
    queries = dataset.get("queries")
    if not isinstance(documents, list) or not 1 <= len(documents) <= MAX_DOCUMENTS:
        raise DatasetError(f"documents must contain 1..{MAX_DOCUMENTS} entries")
    if not isinstance(queries, list) or not 1 <= len(queries) <= MAX_QUERIES:
        raise DatasetError(f"queries must contain 1..{MAX_QUERIES} entries")

    seen_documents: set[tuple[str, str, str]] = set()
    available_chunks: set[tuple[str, str, str, str]] = set()
    total_chunks = 0
    for index, raw_doc in enumerate(documents):
        doc = _object(raw_doc, f"documents[{index}]")
        document_id = _nonempty(doc.get("document_id"), f"documents[{index}].document_id", 160)
        source_uri = _nonempty(doc.get("source_uri"), f"documents[{index}].source_uri", 2048)
        scope = _nonempty(doc.get("scope", "project"), f"documents[{index}].scope", 32)
        scope_id = _nonempty(doc.get("scope_id", "golden-set"), f"documents[{index}].scope_id", 160)
        document_key = (scope, scope_id, document_id)
        if document_key in seen_documents:
            raise DatasetError(f"duplicate document in scope: {document_id}")
        seen_documents.add(document_key)
        chunks = doc.get("chunks")
        if not isinstance(chunks, list) or not chunks:
            raise DatasetError(f"documents[{index}].chunks must be a non-empty list")
        total_chunks += len(chunks)
        if total_chunks > MAX_TOTAL_CHUNKS:
            raise DatasetError(f"Dataset exceeds {MAX_TOTAL_CHUNKS} chunks")
        seen_chunk_ids: set[str] = set()
        for chunk_index, raw_chunk in enumerate(chunks):
            chunk = _object(raw_chunk, f"documents[{index}].chunks[{chunk_index}]")
            chunk_id = _nonempty(chunk.get("chunk_id"), "chunk_id", 160)
            _nonempty(chunk.get("content"), "chunk content", 20_000)
            if chunk_id in seen_chunk_ids:
                raise DatasetError(f"duplicate chunk_id {chunk_id!r} in document {document_id!r}")
            seen_chunk_ids.add(chunk_id)
            page = chunk.get("page_number")
            if page is not None and (isinstance(page, bool) or not isinstance(page, int) or page < 1):
                raise DatasetError("page_number must be a positive integer when provided")
            available_chunks.add((scope, scope_id, document_id, chunk_id))

    seen_query_ids: set[str] = set()
    for index, raw_query in enumerate(queries):
        query = _object(raw_query, f"queries[{index}]")
        query_id = _nonempty(query.get("id"), f"queries[{index}].id", 160)
        if query_id in seen_query_ids:
            raise DatasetError(f"duplicate query id: {query_id}")
        seen_query_ids.add(query_id)
        _nonempty(query.get("query"), f"queries[{index}].query", MAX_QUERY_CHARS)
        scope = _nonempty(query.get("scope", "project"), "query scope", 32)
        scope_id = _nonempty(query.get("scope_id", "golden-set"), "query scope_id", 160)
        relevant = query.get("relevant_chunks")
        if not isinstance(relevant, list) or not relevant:
            raise DatasetError(f"query {query_id!r} needs at least one relevant_chunks entry")
        seen_relevant: set[tuple[str, str]] = set()
        for item_index, raw_item in enumerate(relevant):
            item = _object(raw_item, f"queries[{index}].relevant_chunks[{item_index}]")
            document_id = _nonempty(item.get("document_id"), "relevant document_id", 160)
            chunk_id = _nonempty(item.get("chunk_id"), "relevant chunk_id", 160)
            key = (document_id, chunk_id)
            if key in seen_relevant:
                raise DatasetError(f"query {query_id!r} repeats a relevant chunk")
            seen_relevant.add(key)
            if (scope, scope_id, document_id, chunk_id) not in available_chunks:
                raise DatasetError(
                    f"query {query_id!r} marks a missing or out-of-scope chunk as relevant: "
                    f"{document_id}/{chunk_id}"
                )
    return dataset


def _percentile_ms(values: list[float], percentile: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    # Nearest-rank percentile; stable for small golden sets.
    index = max(0, math.ceil(percentile * len(ordered)) - 1)
    return round(ordered[index], 3)


def _ndcg(retrieved: list[tuple[str, str]], relevant: set[tuple[str, str]], k: int) -> float:
    dcg = sum(1.0 / math.log2(rank + 1) for rank, item in enumerate(retrieved[:k], start=1) if item in relevant)
    ideal_hits = min(len(relevant), k)
    idcg = sum(1.0 / math.log2(rank + 1) for rank in range(1, ideal_hits + 1))
    return dcg / idcg if idcg else 0.0


def evaluate_dataset(dataset: dict[str, Any], *, top_k: int = 5) -> dict[str, Any]:
    if isinstance(top_k, bool) or not isinstance(top_k, int) or not 1 <= top_k <= 20:
        raise ValueError("top_k must be an integer between 1 and 20")

    recalls: list[float] = []
    reciprocal_ranks: list[float] = []
    ndcgs: list[float] = []
    source_precisions: list[float] = []
    provenance_completeness: list[float] = []
    latencies: list[float] = []
    query_reports: list[dict[str, Any]] = []

    with tempfile.TemporaryDirectory(prefix="alandi-rag-golden-") as directory:
        rag = LazyGraphRAG(Path(directory) / "rag.sqlite3")
        rag.initialize()
        for document in dataset["documents"]:
            rag.ingest_document(
                document["document_id"],
                document["source_uri"],
                document["chunks"],
                scope=document.get("scope", "project"),
                scope_id=document.get("scope_id", "golden-set"),
            )

        for query in dataset["queries"]:
            scope = query.get("scope", "project")
            scope_id = query.get("scope_id", "golden-set")
            relevant = {
                (item["document_id"], item["chunk_id"])
                for item in query["relevant_chunks"]
            }
            relevant_sources = {
                document["source_uri"]
                for document in dataset["documents"]
                if document.get("scope", "project") == scope
                and document.get("scope_id", "golden-set") == scope_id
                and any(item["document_id"] == document["document_id"] for item in query["relevant_chunks"])
            }
            start = time.perf_counter()
            results = rag.retrieve(query["query"], scope=scope, scope_id=scope_id, top_k=top_k)
            elapsed_ms = (time.perf_counter() - start) * 1000
            latencies.append(elapsed_ms)

            ranked = [(item["document_id"], item["chunk_id"]) for item in results]
            hits = [index for index, item in enumerate(ranked, start=1) if item in relevant]
            recall = len(set(ranked) & relevant) / len(relevant)
            rr = 1.0 / hits[0] if hits else 0.0
            ndcg = _ndcg(ranked, relevant, top_k)
            source_precision = (
                sum(item.get("source_uri") in relevant_sources for item in results) / top_k
            )
            provenance = (
                sum(
                    bool(item.get("source_uri"))
                    and item.get("source_uri", "").startswith("https://")
                    and isinstance(item.get("chunk_id"), str)
                    and bool(item.get("chunk_id"))
                    for item in results
                ) / len(results)
                if results else 0.0
            )
            recalls.append(recall)
            reciprocal_ranks.append(rr)
            ndcgs.append(ndcg)
            source_precisions.append(source_precision)
            provenance_completeness.append(provenance)
            query_reports.append({
                "id": query["id"],
                "relevant_count": len(relevant),
                "retrieved_count": len(results),
                "relevant_hits": len(set(ranked) & relevant),
                "reciprocal_rank": round(rr, 6),
                "recall_at_k": round(recall, 6),
                "ndcg_at_k": round(ndcg, 6),
                "latency_ms": round(elapsed_ms, 3),
                "retrieved": [
                    {
                        "document_id": item["document_id"],
                        "chunk_id": item["chunk_id"],
                        "source_uri": item["source_uri"],
                        "page_number": item["page_number"],
                        "retrieval_path": item["retrieval_path"],
                    }
                    for item in results
                ],
            })

    count = len(dataset["queries"])
    return {
        "schema_version": 1,
        "evaluator": "alandI-rag-golden-set-v1",
        "dataset_query_count": count,
        "document_count": len(dataset["documents"]),
        "chunk_count": sum(len(doc["chunks"]) for doc in dataset["documents"]),
        "top_k": top_k,
        "metrics": {
            f"recall_at_{top_k}": round(statistics.fmean(recalls), 6),
            "mrr": round(statistics.fmean(reciprocal_ranks), 6),
            f"ndcg_at_{top_k}": round(statistics.fmean(ndcgs), 6),
            f"relevant_source_precision_at_{top_k}": round(statistics.fmean(source_precisions), 6),
            "provenance_completeness_at_k": round(statistics.fmean(provenance_completeness), 6),
            "latency_p50_ms": _percentile_ms(latencies, 0.50),
            "latency_p95_ms": _percentile_ms(latencies, 0.95),
        },
        "limitations": [
            "Metrics describe only this labelled dataset and this runtime; they are not general production guarantees.",
            "Latency includes local SQLite retrieval only, excludes ingestion, model generation, network and end-to-end UI time.",
            "No LLM judge is used; relevance labels must be reviewed by a human.",
            "Use at least 50 representative, permissioned queries and report baseline-vs-candidate deltas before claiming an improvement.",
        ],
        "queries": query_reports,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("dataset", help="Path to a labelled JSON dataset (schema_version=1)")
    parser.add_argument("--top-k", type=int, default=5, help="Retrieval cutoff (1..20; default: 5)")
    parser.add_argument("--output", help="Optional path to write the JSON report")
    parser.add_argument(
        "--min-recall-at-k", type=float,
        help="Optional acceptance threshold in [0, 1]; exit 2 if the mean recall misses it",
    )
    args = parser.parse_args(argv)
    if args.min_recall_at_k is not None and not 0 <= args.min_recall_at_k <= 1:
        parser.error("--min-recall-at-k must be between 0 and 1")
    try:
        dataset = load_dataset(args.dataset)
        report = evaluate_dataset(dataset, top_k=args.top_k)
    except (DatasetError, ValueError) as exc:
        parser.error(str(exc))
    serialized = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        Path(args.output).write_text(serialized, encoding="utf-8")
    print(serialized, end="")
    if args.min_recall_at_k is not None and report["metrics"][f"recall_at_{args.top_k}"] < args.min_recall_at_k:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
