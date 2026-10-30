# Deep Research 2.0 — проверенный baseline репозитория

**База:** main SHA e78a73b25725bfa63370d9946887cbbacbf51b82.  
**Проверка:** 2026-10-31, repository docs + targeted GitHub code search.  
**Ограничение:** это code-navigation audit, не полный line-by-line runtime review и не проверка live VPS.

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
