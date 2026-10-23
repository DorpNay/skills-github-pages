# aLandi Engineering Volley Log

| Volley | Date | Scope | Result | Gate |
|---|---|---|---|---|
| V-2026-10-21 | 2026-10-21 | Gateway foundations: exact router, memory delta, RAG baseline, OAuth vault, RSS metrics | Merged in PR #18; RAG identity isolation/legacy migration merged in PR #19 | Contract tests and offline smoke eval passed |
| V-CODER-PACKET-FOUNDATIONS | 2026-10-22 | Trace IDs, provenance-first temporal memory, voice contracts, bounded tool DAG, JSON Schema, SSRF/approval primitives, exact citations/evidence ledger, hardware/license/latency docs and CI gates | Check current PR and Actions for merge status; runtime remains prototype-only until separately deployed | Do not enable voice/tool/OAuth/RAG flags or claim live deployment |
| V-2026-10-23-CLOUD-UI-PROJECTS | 2026-10-23 | aLandi-only primary cloud card; provider health/probe reliability; Kilo in the alternate list only; project CRUD/instructions/scoped memory/bundle I/O; home clock/theme/language; adaptive composer; text attachment and honest voice preview; V-016 81-item audit | PR #21 open; review detailed implementation ledger and user To do | Latest-head quality/E2E and merge/deployment verification still required |
| V-2026-10-23-ALANDI-V016-SEARCH | 2026-10-23 | Implementation checkpoint `103e773b529b9273ae0dc3549c948d1c18d6a6bc` in PR #21: source-state fingerprint includes `index.md`; stricter offline INTEL URL/claim checks; target-only latency budget; typed local risk-router prototype; bounded keyless web-search fallback; project deletion/cloud-primary route E2E; mobile voice swipe; concise settings copy | Code and deterministic fixtures added; latest-head Chromium/Actions pending | No merge until current head is green; fingerprint is not attestation, provenance is not live license verification, router is not runtime-integrated, voice runtime is preview-only, and latency remains unmeasured |

## Required fields for future entries

- Git SHA and PR link
- Exact files/architectural changes
- Test command and result, with sample count
- Benchmarked hardware/model artifact hashes (if relevant)
- Accepted/rejected assumptions and remaining blockers
- Rollback method
- Whether the change is merely merged, or has been activated and verified on the target runtime
