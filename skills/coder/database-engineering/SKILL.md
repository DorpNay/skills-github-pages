---
name: database-engineering
description: Design safe, efficient data access and migrations with privacy, bounded workload and rollback.
---

## Workflow
- Identify the existing database, transaction model, schema owner, backup process and retention/deletion semantics before adding another database.
- Default to parameterized queries, least-privilege credentials, tenant/project scope in every read/write, bounded result sizes and explicit query timeouts.
- Prefer the smallest suitable store. Use SQLite WAL/FTS5 for embedded local workloads when concurrency, backup and locking requirements fit; use a server database only when measured multi-user or operational requirements justify it.
- Add indexes from observed query plans and representative data, not guesswork. Avoid N+1 reads and unbounded scans; report query plans and p50/p95 latency.
- Write migrations as forward-only, idempotent, transaction-aware steps with preconditions, integrity checks and a documented rollback/restore path. Never drop or rewrite user data to make tests pass.
- Separate read, write, schema migration and administrative permissions. Default agent access is read-only; mutation requires explicit owner approval bound to the exact operation and scope.
- Protect sensitive fields at rest and in transit; avoid secrets or personal data in logs, prompts, fixtures and telemetry. Enforce retention and scoped deletion, including dependent evidence/indexes.
- Test isolation across users/projects, transaction rollback, concurrent writes, locking, migration from the previous schema, backup restore and deletion.

## Required evidence
Report schema delta, migration sequence, access scopes, index/query-plan evidence, backup/restore and data-loss risks. A passing unit test does not prove migration safety on production data.
