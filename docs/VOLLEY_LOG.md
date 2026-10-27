# aLandi Engineering Volley Log

| Volley | Date | Scope | Result | Gate |
| V-2026-10-27-CODE-HYGIENE-001 | 2026-10-27 | Vulture candidate review: remove unused `ValidationError` import; retain `max_duration_ms` because it is part of the injected TTS protocol contract | Minimal hygiene patch proposed in PR; test/CI verification pending | Do not delete protocol parameters based on static unused-argument reports alone |
| V-2026-10-21 | 2026-10-21 | Gateway foundations: memory delta, RAG baseline, OAuth vault, RSS metrics | Merged in PR #18; RAG identity isolation/legacy migration merged in PR #19 | Contract tests and offline smoke eval passed |
| V-CODER-PACKET-FOUNDATIONS | 2026-10-22 | Trace IDs, provenance-first temporal memory, voice contracts, bounded tool DAG, JSON Schema, SSRF/approval primitives, citations/evidence ledger, hardware/license/latency docs | Contract foundations merged; runtime remains prototype-only until separately deployed | Do not enable voice/tool/OAuth/RAG flags or claim live deployment |
| V-2026-10-23-CLOUD-UI-PROJECTS | 2026-10-23 | Primary aLandi cloud card, provider recovery, project CRUD/instructions/browser-local memory/export, theme/language/clock/composer/text attachments and voice preview | PR #21 merged at `97793ddfc00b1d364e9109ecd3efabe927a1f08a`; PR-head Chromium/quality/gateway/provenance/Pages checks passed | Live aLandi gateway unconfigured; project data remains browser-local; voice is preview-only; latency unmeasured |
| V-2026-10-23-ALANDI-V016-SEARCH | 2026-10-23 | Source fingerprint, offline provenance checks, target-only latency budget, typed router prototype, bounded keyless search and UI regression tests | PR #21 merged; E2E and Pages passed | Fingerprint is not attestation; router is not runtime-integrated; public-source CORS remains a constraint |
| V-2026-10-23-PROVIDER-RACE | 2026-10-23 | PR #22 prevents stale provider/model/base URL/key probe results from overwriting active settings; three deterministic race tests | Merged at `7fac23ce3e50e0bcb1169e312a3d692484b95808`; PR-head quality/Chromium passed | Mock E2E is not live-provider proof |
| V-2026-10-23-POST-MERGE-STATE | 2026-10-23 | PR #23 reconciles source-of-truth, To Do, EVALS and V-016 after the UI merge | Merged at `36e9a6441989e8c2d3b7f813a86479d620365e49`; PR-head quality and Pages smoke passed | Reconcile again after subsequent merges |
| V-2026-10-23-RAG-SCOPE-DELETE | 2026-10-23 | PR #24 validates RAG scope pairing and version-gates SQLite/FTS5 secure-delete | Merged at `0ae1ed1892380562d148574abc2d2cd64e5abe9d`; gateway/provenance/quality/Chromium/Pages passed | Does not erase evidence copies, WAL/backups or browser storage; no crypto-erasure SLA |
| V-2026-10-23-PROVIDER-SMOKE-CONSENT | 2026-10-23 | PR #25 requires explicit live-smoke consent (default false) and supports per-provider model override variables | Merged at `9006c7ed8737174e73c615504eb80362f4673949`; quality, Chromium, Pages smoke and provenance passed | Live provider smoke was not dispatched; no account availability claim |
| V-2026-10-23-MEMORY-FTS5-SEARCH | 2026-10-23 | PR #26 adds bounded scope-filtered FTS5 search, confirmed-only default, delete triggers, legacy backfill and capability-gated secure-delete | Merged at `cbc5e19b14c5d464782108b4f0534faac88290c2`; Gateway/provenance/quality/Chromium/Pages passed | Module-level retrieval only; not whole-system crypto-erasure |
| V-2026-10-23-MEMORY-GRAPH-API | 2026-10-23 | PR #27 adds authenticated feature-flagged single-owner graph API for candidate creation, search/list, explicit review, relations/supersede and scoped delete | Merged at `653febb01e2f9887dfec8116bf81f26f39e5077a`; post-merge Gateway/provenance/full quality/Pages passed | API not connected to browser localStorage; double opt-in for global scope; no multi-user ACL |
| V-2026-10-23-CPOCKET-RUNBOOK | 2026-10-23 | cPocket bounds cleanup registration and continues after cleanup RuntimeError/CancelledError; from-zero guide documents memory API, current model/fallback behaviour and experiment limits | PR #28 merged at e424d353; Gateway, Quality Sentinels, provenance and Pages passed on post-merge main | No live audio runtime, target-host FD soak or gateway/VPS deploy is claimed |

| V-2026-10-23-MEMORY-BROWSER-BRIDGE | 2026-10-23 | Browser UI manually transfers local project facts as server candidates, reviews/deletes graph facts, and retrieves confirmed server facts only with two per-chat opt-ins | PR #29 merged at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; PR-head and post-merge Quality/Chromium, provenance and Pages checks passed; Gateway tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708` | No live gateway activation; graph flag remains off by default; global memory remains disabled; no automatic migration |

## Required fields for future entries

- Git SHA and PR link
- Exact files/architectural changes
- Test command and result, with sample count
- Benchmarked hardware/model artifact hashes (if relevant)
- Accepted/rejected assumptions and remaining blockers
- Rollback method
- Whether the change is merely merged, or has been activated and verified on the target runtime

