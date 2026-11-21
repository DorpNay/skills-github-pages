# Deep Research 2.0 — проверенный baseline репозитория

**Историческая база аудита:** main SHA e78a73b25725bfa63370d9946887cbbacbf51b82 (2026-10-31), repository docs + targeted GitHub code search.  
**Ограничение:** исходный audit — code-navigation, не полный line-by-line runtime review и не live VPS check. Current owner-directed delta is appended below; do not treat the historical SHA as current implementation truth.

## 1. Deep Research / Search

### Уже присутствует
- Search & Research design: quick web search, deep research, search-my-materials, source allowlist, language/date/content filters, privacy modes, source metadata, provenance, claims/evidence/contradictions and ResearchArtifact.
- Web search route exists in Gateway as optional SearXNG adapter; disabled by default and operator-configured. Gateway README documents auth, bounded query/results, HTTPS result links, no redirects and no-store.
- RAG routes exist: POST /v1/rag/ingest, POST /v1/rag/retrieve and source deletion. Current implementation is SQLite FTS5 + lexical concept graph, not dense vector RAG and not full Microsoft LazyGraphRAG.
- Evidence ledger and citation modules exist; source URI, offsets/hash and scope are expected to bind evidence to the source.
- Existing research UI setting includes processingMode/searchMode/multiAgentEnabled. The multi-agent flag is a bounded four-stage planner/researcher/critic/final pipeline, not independent parallel workers.

### Not confirmed / open
- The 12-stage Deep Research state machine remains an open owner checklist item.
- Search query log, evidence validation, source refresh, contradiction handling, resumable runs and exact claim-to-citation validation need full current-code/test audit.
- RAG and memory APIs are feature-flagged; Gateway README reports ALANDI_RAG_ENABLED=false and ALANDI_SEARXNG_ENABLED=false by default.
- The repository has no proof of live SearXNG, VPS, provider credentials or deployed research service.

## 2. Image and video

- No POST /v1/images/generations route was found by targeted repository search.
- Current docs explicitly state there is no complete image-generation UI/runtime flow.
- ComfyUI is documented as a future local adapter; no production ComfyUI service/workflow is selected or deployed.
- Existing attachment handling and video-frame sampling are not image/video generation.
- Roadmap separates image understanding/OCR, image generation, video understanding and video generation.
- The existing 8GB CPU VPS is a gateway/text target, not an assumed media inference host.
- Existing roadmap's external candidates need a fresh availability/pricing/region/terms review before coding.

**Status:** image/video generation = not implemented as a complete product flow; design/candidate research exists.

## 3. AI coding

- Existing design specifies planner → implementer → independent reviewer → tests.
- Muse Code, OpenCode, Dyad and other repositories appear as candidates/references in research material.
- No production arbitrary-code execution runtime is enabled.
- CODER_PACKET explicitly says subprocess.run is not a sandbox and requires container/user namespaces, filesystem/network restrictions, seccomp/Landlock and escape tests before arbitrary CLI.
- ACCEPTED_IMPROVEMENTS marks layered CLI sandbox blocked until real container/isolation and escape tests.
- Tool DAG is bounded prototype; no tools are registered by default per the architecture map.

**Status:** coding workflow and policy foundations exist; autonomous code execution is intentionally blocked pending a real sandbox. Do not bypass this gate.

## 4. Memory and local knowledge

### Confirmed foundations
- Browser client uses localStorage safe writes/recovery backup and IndexedDB for some data; chat/project export paths exist.
- Gateway has conversation delta sync prototype with revision/checksum handling.
- SQLite memory graph has scopes, provenance, temporal fields, candidate/confirmed/disputed/superseded/rejected statuses and FTS5 search.
- Authenticated memory graph API is feature-flagged and single-owner; browser bridge allows manual project-local candidate upload/review.
- RAG SQLite FTS5 and source deletion/scope checks have tests.

### Explicit gaps
- No proof of a single complete local source vault covering all project files and derived artifacts.
- No background local folder watcher or always-on file indexing was found.
- Full cross-device sync, automatic bidirectional Drive sync and robust conflict resolution remain unverified.
- Physical erasure across evidence copies, WAL/journals, backups and browser copies is not proven.
- Browser source handles and OPFS are proposed in the retention audit, not a verified end-to-end feature.
- USER_REQUEST_CHECKLIST still has open items for authenticated project-source indexing, cross-project leak tests, fact correction/deletion and system-wide crypto-erasure.

**Status:** memory is a set of useful foundations and prototypes, not yet a proven complete memory system. Sufficiency must be evaluated against recall, scope, deletion, long-session and recovery golden sets.

## 5. Sources on device

- Current app can accept user-selected files; that does not equal a persistent folder connector.
- Browser FileSystemHandle/OPFS/IndexedDB are proposed approaches in the memory retention audit; they are not confirmed as implemented source sync.
- Static GitHub Pages cannot silently read arbitrary paths or continuously watch directories.
- A local companion/desktop runtime is the likely route for persistent, user-granted folder indexing; this requires a separate threat model and PR.
- Local-only mode must be verified with outbound-network instrumentation, not inferred from UI labels.

**Status:** partial local file handling exists; persistent local project-source connector remains future work.

## 6. Uncensored model / policy

- USER_REQUEST_CHECKLIST explicitly says: do not add a hidden refusal filter over the selected model; also do not promise that it will never refuse, because checkpoint behavior and external API rules are outside app control. This is an open checklist item, not proof of implementation.
- ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md defines priority as safety/system → workspace policy → project instructions → user preferences → current message, and says user instructions do not disable safety or elevate tool permissions.
- CODER_PACKET and tool approval contracts require fail-closed permissions, exact operation/scope/expiry approvals and no fake sandbox.
- No single end-to-end policy matrix proving all providers/adapters behave consistently was found in this targeted search.

**Status:** requirement and security foundations exist; unified refusal-vs-security policy audit remains open. Do not claim that selecting an uncensored local model automatically disables every platform-level refusal or safeguard.

## 7. Files reviewed / paths searched

- docs/SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md
- docs/IMPLEMENTATION_ROADMAP_RU.md
- docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md
- docs/MULTIMODAL_MODEL_STACK_RU.md
- docs/VOICE_IMPLEMENTATION_PLAN_RU.md
- docs/ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md
- project-reference/MEMORY_RETENTION_AND_SYNC_AUDIT_RU.md
- docs/USER_REQUEST_CHECKLIST.md
- docs/V016_IMPLEMENTATION_CHECKLIST.md
- docs/CODER_PACKET.md
- docs/ACCEPTED_IMPROVEMENTS.md
- gateway/app.py, gateway/rag/lazy_graph_rag.py, gateway/memory/manager.py
- gateway/README_RU.md, docs/ALANDI_ARCHITECTURE_MAP_RU.md, DECISIONS.md

## 8. Immediate next work

1. Line-by-line inspect actual research UI, routing, state persistence, source adapters, evidence ledger and tests.
2. Audit local memory and project source paths, including storage quotas, restore, deletion and scope isolation.
3. Build a 50+ query RU/EN/TH golden set with exact source evidence and adversarial prompt injection.
4. Evaluate local file connector approaches and privacy guarantees before choosing browser-only vs companion.
5. Audit image/video generation providers and AI coding systems separately; no new runtime dependencies until account/hardware/license/benchmark gates pass.
6. Define and test model refusal vs platform authorization policy.
7. Implement no production change from this research branch; prepare future minimal PR proposals only.

**Conclusion:** foundations exist, but Deep Research 2.0, persistent local source connectors, full memory reliability, image/video generation and safe autonomous coding are not complete product capabilities today.


## 2026-11-02 — Local-source and conversion boundary

- Chat file picker is available, and selected attachments can be processed through the existing bounded document path. This is not a persistent source library or permissioned folder connector.
- Project source listing/CRUD is still not exposed by the gateway. Existing RAG ingest/retrieve/delete routes do not provide a user-facing source registry or complete lineage viewer.
- Browser File System Access requires explicit user interaction and permission; persisted handles require permission revalidation. A remembered display path alone cannot grant access.
- OPFS is origin-private storage for derived cache/index files, not a user-visible folder. It is quota-bound and cleared with site data.
- Cross-device sync and continuous folder watching require a separate companion or explicit sync path; neither is implemented.
- Universal conversion, screenshot-to-code, Knowledge-to-Skill, image generation and video generation are not complete user-facing flows.
- Detailed target design and task IDs LSV-001…LSV-014: `docs/LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md`.


## 2026-11-08 — owner-directed current delta (main c4f23e0 / PR #169 branch)

- Main remains `c4f23e03f563d03213eb87002863da630fc8b833`; current UI implementation candidate is PR #169 (code/test checkpoint `08a73a7594695b8a74fa88d90db07832a8373665`, not merged).
- Functions menu now has three current actions: Agents/structured analysis, Deep Research settings panel, Skills/task profile. Research Studio is retired. The Deep Research panel reports Quick/Thorough, current Web search breadth and pipeline state; it navigates to existing controls rather than implementing an independent research runtime.
- **Not verified/implemented by this delta:** the 12-stage Deep Research 2.0 state machine, durable/resumable run storage, source refresh, evidence ledger enforcement, contradiction resolution, exact claim-to-citation checks, independent parallel workers and production source connectors. These remain SPECIFIED/DEFERRED pending code/tests/evals.
- Existing Gateway/RAG/memory notes in the historical audit remain subject to fresh exact-main code/test audit. PR #169 E2E was authored; exact-head Quality/Chromium outcome must be checked before marking the menu VERIFIED.

## 2026-11-15 — Evidence Ledger vertical slice implemented

**IMPLEMENTED (exact-head checks pending on this commit):**

- Gateway initializes the existing SQLite EvidenceLedger only when RAG is enabled; the default remains disabled.
- Authenticated API: POST /v1/rag/evidence writes scoped source quotes; GET lists records within an explicit scope; DELETE removes only a record in the matching scope. Responses are no-store; body/source/metadata sizes are bounded.
- Evidence writes store the source SHA-256 and exact Unicode quote offsets, not the full page body. Duplicate retries with the same scope/source/hash/chunk/span/claim return the same evidence ID under a SQLite write transaction.
- Research Trace schema v3 records the conversation ID and capture timestamp. The trace modal exposes an explicit Save to Gateway action; it sends only bounded excerpts (max 360 characters), no full page, and only after the user clicks. URLs with query strings are skipped by the save path. Save status and evidence IDs remain in the local trace.
- Evidence is conversation-scoped by default, not silently promoted to project scope. The user-configured Gateway must advertise RAG and EvidenceLedger capability. RAG remains disabled by default.

**VERIFIED BY TEST CONTRACT (pending exact-head CI):** authenticated writes, exact quote/hash, Unicode offsets, deduplication, scope isolation, scoped deletion, disabled capability, and no automatic upload.

**NOT IMPLEMENTED YET:** semantic claim-to-citation entailment, contradiction ledger and resolution, durable/resumable research-run state, independent multi-provider search/fetch adapters, budget/cost accounting across providers, and Notebook/report export. Exact quote integrity is not semantic support verification.


## 8. Claim and contradiction persistence — 2026-11-16

**Backend maturity:** IMPLEMENTED / VERIFIED on parent e4b791076d19e312265eee301c417cc257f3fc48: typed claim/contradiction EvidenceLedger records and authenticated routes pass Gateway CI across Python 3.12/13/14. The import-scope defect in d806d19 was corrected in e4b791; Quality/Chromium and all state/provenance/publication gates passed there.

- Reuses the existing `evidence_records` table; no new table or migration.
- Adds typed `claim` and `contradiction` records with deterministic idempotent IDs.
- Enforces same-scope source-quote references, claim-ID uniqueness within a research run, exact claim-text matching and contradiction evidence restricted to the claims' linked source quotes.
- Enforces `reviewer_mode=same-model`; this is not independent verification and model confidence is not calibrated.
- Prevents deleting source quotes or claims while derived records reference them.
- New authenticated Gateway routes remain behind the existing RAG-enabled gate; RAG remains disabled by default.

**Research Trace schema v4 (IMPLEMENTED IN CURRENT CHILD / CI PENDING):** the researcher source excerpts are collected before the critic stage and supplied as untrusted data with stable per-trace source IDs. The critic is explicitly identified as the same selected model route, not an independent reviewer. It is asked for bounded JSON claims/contradictions; the client parser validates IDs against captured sources, relation/assessment compatibility, contradiction claim membership and evidence linkage, and renders only validated fields using textContent. Invalid JSON yields no structured records; the original critique text remains in the trace. This is model-generated review, not calibrated or independent verification.
**Research Trace browser Save — IMPLEMENTED / VERIFIED on code commit `dc2e26500197d8ca68e21c1e0b3e03a3f61a9e8e`:** explicit click first persists bounded source excerpts, maps each source ID to the returned evidence_id, then persists only claims whose referenced excerpts were saved, then contradictions only when all referenced claims and excerpts were saved. The local trace stores source/claim/contradiction record IDs and counts; partial failures are surfaced and retry uses deterministic record identities. E2E covers two sources, two claims and one temporal contradiction, including the no-write-before-click boundary. Quality #43810404022 passed all 7 jobs including 134 Chromium tests and published-site contract; Freshness #43810404041, Provenance #43810403933 and Pages #43810403266 passed; public revision exact.

**Still open:** durable/resumable research-run state; real independent Exa/Firecrawl runtime adapters; provider budget/cost accounting; Notebook/report export. The same-model critic is not an independent reviewer, and exact quote integrity is not semantic entailment.

