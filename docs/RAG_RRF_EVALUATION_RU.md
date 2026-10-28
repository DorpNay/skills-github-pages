# RAG retrieval ranking: RRF change and acceptance

**Date:** 2026-10-28  
**Scope:** bounded change in `gateway/rag/lazy_graph_rag.py`; no API, schema, dependency, or feature-flag change.  
**State:** candidate implementation; do not claim retrieval-quality improvement until exact-head tests and a labelled corpus evaluation pass.

## Why change the ranker

The current retrieval combines FTS5/BM25 candidates and lexical-concept overlap candidates whose raw scores have different scales. Adding those values makes the resulting score dependent on arbitrary scaling. Reciprocal Rank Fusion (RRF) uses candidate rank positions instead:

`RRF(d) = Σ 1 / (k + rank_i(d))`

The implementation uses the conventional `k=60` starting point from the original RRF paper, deduplicates an item within each input ranking, and bounds ranking count and length. The resulting value is a **ranking score, not confidence or probability**. Source URI, page number, scope filtering, document identity, and deletion behavior must remain unchanged.

Reference: Cormack, Clarke & Büttcher, *Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods* (SIGIR 2009), https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf. RRF is a baseline hypothesis, not a guarantee that every dataset improves.

## Determinism and safety

- FTS5 ties use stable secondary ordering by document and chunk IDs.
- Concept-graph ties use stable secondary ordering by document and chunk IDs.
- Duplicate candidate IDs within a single ranking contribute only once.
- Invalid or unbounded input rankings are rejected.
- Existing scope-bound IDs and source/page provenance are retained.
- The existing `ALANDI_RAG_ENABLED=false` default is unchanged.
- Rollback: revert this change; if a deployment-specific issue requires an immediate operational stop, keep the RAG feature flag disabled.

## Verification matrix

| Gate | What it proves | Status in this change |
| --- | --- | --- |
| RRF unit tests | Consensus ordering, duplicate behavior, deterministic output, input bounds | Required on exact PR head |
| Retrieval contract test | Scope isolation, source URI/page metadata, retrieval path and descending rank score | Required on exact PR head |
| Existing six-layer synthetic evaluation | Regression smoke for FTS/concept fixtures, deletion and related backend contracts | Required on exact PR head |
| Labelled golden set (at least 50 queries) | Comparative Recall@5, MRR/nDCG and citation correctness | Not available; no quality-improvement claim |
| Live corpus / target host | Actual relevance, p50/p95 latency, peak RSS and index size | Not run; requires approved corpus and target runtime |

The project’s Recall@5 threshold is a proposed acceptance target, not an observed production result. Record baseline and candidate metrics on the same queries and corpus before promoting RRF as a quality improvement. Also test repeated ingestion, source deletion, invalid scope, and cross-project isolation.

## Decision

Proceed only if exact-head CI passes and no scope/provenance/deletion regression appears. Keep RAG disabled until the operator explicitly configures and validates the local gateway. Do not add embeddings, a reranker, or another framework in this slice; first measure whether RRF changes ranking on a labelled dataset.
