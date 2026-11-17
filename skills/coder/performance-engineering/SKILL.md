---
name: performance-engineering
description: Improve developer-agent throughput and reliability using representative measurements.
---

## Workflow
- Measure the current bottleneck before optimizing: repository scan, retrieval, context construction, model wait, tool execution, verification or rendering.
- Separate cold-start and warm-cache timings; report p50/p95, CPU, peak RSS, disk and model-token budget where relevant.
- Prefer incremental content-hash indexing, bounded caches, SQLite WAL/FTS5 and compact symbol/context retrieval when evidence supports them.
- Use hybrid retrieval and reranking only when a representative labelled RU/EN/TH evaluation shows a meaningful gain over baseline.
- Avoid adding a vector database, queue, telemetry collector or extra model only because it is popular. Account for idle RAM, operations, backup, deletion and licensing.
- Bound concurrency to available hardware. Preserve one inference slot for a single heavyweight local model unless target-host measurements justify otherwise.
- Keep benchmarks reproducible with fixed data, exact versions, resource profile and before/after baseline.

## Required evidence
Provide a benchmark harness, command, input size, environment, median and tail latency, memory impact and functional regression results. Never convert upstream benchmark claims into aLandi measurements.
