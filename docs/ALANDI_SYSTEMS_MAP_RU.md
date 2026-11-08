# aLandi — карта систем и подсистем

**Срез:** 2026-11-08. **Статус:** live main `9033c6ad708a993cba5d1b27442f53651ad71c0f` после merge PR #174. Exact-main Quality #42430269155, Freshness #42430269156, Provenance #42430269144, Graphify #42430269131 и Pages #42430269181 прошли; public root + `/landing/` exact-SHA проверены. PR #175 — единственный открытый owner-authorized кандидат на Functions drawer + локальный Notebook; его exact-head gates должны быть перепроверены live. Server-memory graph retirement остаётся в main. **Назначение:** короткая карта продукта, границ и методов реализации; не backlog и не доказательство VPS/runtime deployment.

## 0. Топология

```text
Browser / static GitHub Pages UI
  ├─ chats, projects, local memory, skills, research UX
  ├─ aServi route (first-party) ── HTTPS ──┐
  └─ third-party provider route (manual)   │ no silent cross-provider fallback
                                           ▼
                              Cloudflare Tunnel (target; live unverified)
                                           ▼
                              FastAPI aLandi Lite Gateway
                                ├─ auth / CORS / limits / lifecycle
                                ├─ chat / model / capability APIs
                                ├─ search / documents / audio
                                ├─ RAG / evidence / citations
                                └─ conversation delta sync
                                           ▼
                              Ollama on private loopback
                                └─ one active model, concurrency 1
```

GitHub Pages is the public client release surface. The Tunnel, VPS, Ollama runtime, model availability and host backups must be verified independently; a green Pages build does not prove them.

## 1. Systems inventory

| # | System / subsystem | Main implementation surface | Method / contract | Maturity |
|---:|---|---|---|---|
| 1 | **Client shell and UI** | `index.md`, `landing/`, static assets | Static HTML/CSS/JS + Jekyll; semantic controls, progressive disclosure, responsive layout, keyboard/focus and reduced-motion checks | IMPLEMENTED |
| 2 | **Chat, projects, Notebook and browser persistence** | `index.md`, browser storage helpers, IndexedDB v3, Playwright E2E | Browser-local chat/project state plus a distinct local Notebook store; personal/project Notebook scope, notes/source refs and bounded TXT/Markdown import; Notebook is not chat Memory and is not uploaded automatically | IMPLEMENTED IN PR #175 CANDIDATE / NOT MERGED; existing chat/project persistence remains IMPLEMENTED |
| 3 | **Personal / shared / project memory** | `index.md`, local memory helpers, project settings | Personal memory stays browser-local; shared memory requires explicit opt-in; project memory stays scoped to the selected project; helper suggestions require user selection before saving | IMPLEMENTED / scoped |
| 4 | **Conversation delta sync** | `gateway/memory/delta_sync.py`, `gateway/app.py` | Versioned bounded patches, revision/conflict checks and explicit deletion; separate from local notes and RAG | IMPLEMENTED |
| 5 | **aServi and provider routing** | `index.md`, provider helpers, `tests/e2e/alandi-provider.spec.mjs` | First-party aServi is distinct from third-party providers; manual route choice; no silent cross-provider fallback; legacy `alandi` and `ai_alandi_cloud_*` identifiers remain compatibility-only | IMPLEMENTED on main `9033c6ad708a993cba5d1b27442f53651ad71c0f`; PR #174 release-contract/backdrop fixes merged, and exact-main Quality/Freshness/Provenance/Graphify/Pages plus public root/landing checks passed. PR #175 adds the Functions drawer/Notebook candidate and is not merged |
| 6 | **Chat orchestration** | `index.md`, gateway chat route, context-budget tests | Direct tool loop or bounded planner → researcher → critic → synthesizer pipeline on the selected model; Quick/Thorough controls tool budget; this is not a fleet of independently routed model agents | IMPLEMENTED |
| 7 | **Skills and task profiles** | `skills/`, on-demand loader, `index.md` | Progressive disclosure; profiles change task instructions only and do not grant tools, credentials or data access | IMPLEMENTED |
| 8 | **Search and external sources** | `index.md`, `gateway/app.py`, adapters, `INTEL.md` | Search adapters are separate from evidence/citation validation; retrieved content is untrusted data, never an instruction source | IMPLEMENTED / adapter-dependent |
| 9 | **Research traces and evidence** | `index.md`, `gateway/rag/evidence_ledger.py`, `gateway/rag/citations.py` | Traceable source IDs, bounded context, provenance-aware citations and explicit abstention when evidence is insufficient | IMPLEMENTED / eval coverage bounded |
| 10 | **RAG and document retrieval** | `gateway/rag/lazy_graph_rag.py`, `gateway/memory/scope.py`, RAG tests | Scoped ingestion/retrieval, lexical/FTS retrieval and evidence lineage; retain RRF where measured; parser → structured chunks → provenance → retrieval → citations | IMPLEMENTED baseline; not a claim of full multimodal RAG |
| 11 | **Document and file ingestion** | `POST /v1/documents/extract`, `gateway/tests/test_document_extraction.py` | Bounded extraction, size/time limits, MIME validation and source metadata; support is format-specific, not universal | IMPLEMENTED / bounded |
| 12 | **Voice and audio** | `gateway/voice/`, `POST /v1/audio/transcriptions`, `POST /v1/audio/speech`, audio E2E | Separate ASR, VAD and TTS adapters; subprocess timeout/cancellation and cleanup; measure language quality and latency on target hardware before model promotion | IMPLEMENTED / model availability dependent |
| 13 | **Gateway and security boundary** | `gateway/app.py`, `gateway/security/`, gateway tests | FastAPI; bearer auth, CORS allowlist, SSRF/redirect validation, body/time limits, bounded concurrency, cancellation-safe resource release | IMPLEMENTED; VPS runtime unverified |
| 14 | **Local model serving** | Ollama deployment guide, `gateway/` configuration | Private loopback only; no public port 11434; one active model and concurrency 1 on the initial 8-GB VPS profile | SPECIFIED; live host unverified |
| 15 | **Cache and runtime observability** | browser cache, gateway SQLite cache, host/runtime metrics | Keep browser L0, model-prefix/KV reuse and gateway L2 exact-response cache distinct; cache only eligible completed text; bypass dynamic, streaming, tool, multimodal and error paths | IMPLEMENTED / feature-flag dependent |
| 16 | **Quality and release pipeline** | `.github/workflows/`, `scripts/`, Playwright, pytest | Exact-HEAD Gateway, Chromium, Jekyll, Freshness, Provenance, Graphify and Dead Code checks; after merge verify main Pages deployment and canonical public content against merge SHA | IMPLEMENTED |
| 17 | **Engineering navigation and knowledge** | `OLEDUE.md`, `ORIENTER.md`, `AGENTS.md`, `PROJECT_ORCHESTRATOR_RU.md`, `LOOP.md`, N₂O docs | One handoff entrypoint, one task register, one systems map, append-only evidence log; live GitHub state outranks snapshots | IMPLEMENTED / continuously maintained |
| 18 | **Upstream research and acquisition** | `INTEL.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md`, `docs/TECHNIQUE_REGISTER_RU.md` | Thematic batches; verify upstream revision, license, provenance, security, resource fit and measurable advantage before adoption | RESEARCH / selective pilots |

## 2. Non-negotiable boundaries

- **Release truth:** `main` is the only durable product baseline. PRs are temporary verification/integration vehicles and should be merged promptly after all exact-head gates pass. Do not leave a completed slice parked in a PR.
- **Safe integration:** never merge a stale, draft, future, conflicting or failed PR wholesale. Port useful, compatible slices; preserve historical evidence; close only after its content is reconciled and the reason is recorded.
- **Provider privacy:** aServi and third-party provider modes remain distinct. No silent cross-provider fallback. Never put secrets in prompts, source files or public logs.
- **Memory boundaries:** keep browser-local personal memory, explicit shared-memory opt-in, project memory, conversation delta sync and RAG. The retired server-memory graph is not to be restored. Do not delete existing VPS DB/WAL/backups automatically.
- **Runtime security:** gateway and Ollama bind privately; port 11434 is never public. No arbitrary shell/tool execution without explicit allowlist, validation, least privilege and approval.
- **Evidence:** ACCEPTED ≠ IMPLEMENTED ≠ VERIFIED. A PR green check is not a merge; merge is not a Pages deployment; Pages is not proof of VPS/runtime.
- **Resource discipline:** do not add a database, queue, agent framework, model server or large dependency to the 8-GB stack without a measured need and rollback.

## 3. Execution sequence

`CLASSIFY → ORIENT → INSPECT → PLAN → CHANGE → VERIFY → RECORD → REPORT`

1. Read root `OLEDUE.md` first on `oledue`; otherwise start at `ORIENTER.md`.
2. Batch one live GitHub sync: main SHA, open PRs/issues, selected PR base/head/diff and exact-head checks; separately inspect Pages deployment.
3. Route to one task ID in the existing Master Task Registry. Read the system map and only the relevant code/tests/docs.
4. For non-trivial work, state acceptance criteria, risks and rollback before editing. Parallelize independent reads; sequence writes.
5. Make the smallest reversible change. Add or update a failing regression before weakening no existing guard.
6. Verify the exact current HEAD. Re-fetch the SHA after the last write; never transfer a green result to a newer SHA.
7. Record every material stage in `docs/VOLLEY_LOG.md`; update state/orientation/task register when facts or next action change. Preserve exact SHA, check IDs, outcome, limits and next step.
8. Report WHERE / WHAT / CHECKS / OPEN / NEXT. Do not claim unobserved host or device behavior.

## 4. Source and model acquisition

- Continue reviewing the existing ~300-source INTEL inventory in small thematic batches; include occasional cross-cutting exploration when it may change the architecture.
- Prefer official docs, source code, model cards, licenses, release notes and reproducible benchmarks. Record date, exact revision, license, limitations and project-fit.
- No bulk installs. A candidate becomes a dependency only after a disposable pilot, baseline comparison, resource/security review and owner-visible decision.
- Keep manifests, downloader scripts, hashes and provenance in the repository. **Do not place model weights in the GitHub Pages source tree:** Git LFS is not supported by Pages. Use a suitable model registry/cache or a separately governed GitHub Release asset when size and license allow; verify SHA-256 before loading.
- Never copy code, weights, datasets or voices without checking the separate license and redistribution terms.

## 5. Canonical knowledge homes

- Principles: `docs/ALANDI_N2O_CORE_RU.md`
- Knowledge promotion: `docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md`
- Execution method: `LOOP.md`
- Systems map: `docs/ALANDI_SYSTEMS_MAP_RU.md`
- Detailed architecture: `docs/ALANDI_ARCHITECTURE_MAP_RU.md`
- External evidence: `INTEL.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md`
- Techniques: `docs/TECHNIQUE_REGISTER_RU.md`
- Decisions/evaluations: `DECISIONS.md`, `EVALS.md`
- One task inventory: `docs/MASTER_TASK_REGISTRY_RU.md` + existing addendum
- Live checkpoint / event evidence: `ORIENTER.md`, `docs/PROJECT_STATE.yaml`, `docs/VOLLEY_LOG.md`


### 2026-11-08 source snapshot admission note

- Memvid v2.0.140 and RAG-Anything v1.4.1 selected source snapshots are archived under `docs/upstream-archive/` for reference/evaluation only. They are not part of aLandi's runtime dependency graph; archive presence does not upgrade any memory/RAG system maturity. Per-source licenses, pinned upstream commit and per-file Git blob evidence are recorded in the manifests/provenance.


## Functions detail crosswalk — owner-directed 2026-11-08

| Surface/system | Current truthful boundary | Maturity/evidence | Canonical detail |
|---|---|---|---|
| Agents / structured analysis | Four sequential stages on one selected model; saved team blueprint is not independent workers | Current UI/pipeline baseline; latest detailed panel change is PR #169 candidate, exact-head Quality pending | `index.md`; Functions IA; worker capability contract |
| Deep Research settings | PR #169 merged: dedicated Functions panel exposes Quick/Thorough, Web breadth and pipeline status/navigation; Research Studio is retired. Public root/landing Chromium passed after PR #173 merge | IMPLEMENTED on main `bf039f887e29137b627b06fc2bb107c2793d6b69` | Functions IA; Deep Research current-state audit/plan |
| Deep Research 2.0 engine | Durable/resumable research, evidence ledger, citation validation, contradiction analysis, source refresh, report artifacts | SPECIFIED / DEFERRED; not current runtime | `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` |
| Skills / task profile | Chat-scoped presets/custom instructions; adds task guidance only, no tools/permissions/data scope | IMPLEMENTED on main; profile changes instructions only and does not grant tools, permissions or data scope | Functions IA; Skill Factory spec |
| Skill Factory / Agent Builder | source-to-Skill lifecycle, package manifest/provenance/evals and agent blueprint | SPECIFIED / FUTURE; no runtime grant or execution | `docs/AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md`; worker capability contract |
| Integrations | No external connectors currently registered/connected; no fake switches | Unavailable until real registry, status, permission and action handler exist | Functions IA |

**Guard:** this crosswalk does not upgrade any system maturity from archived upstream source code. Source snapshots under docs/upstream-archive remain research-only, ship=false.


## Repository-orientation / Graphify bridge — 2026-11-08

| Technique | Role | Maturity/evidence | Guard |
|---|---|---|---|
| Graphify code-only architecture pilot | Deterministic AST/source graph, focused queries and coverage artifacts | Existing CI workflow; source-only, no model calls | Generated graph is evidence for navigation, not runtime truth or full behavioral coverage |
| Graphify UI Surface bridge | CSS/DOM/JS selector relationships with file/line provenance, stable IDs and confidence scores | Implemented in PR #169 candidate; `scripts/graphify_ui_surface.py`, unittest and pinned tinycss2 CI integration; exact workflow run pending | Inferred selector edges are candidate links, not computed-style assertions; browser E2E remains authoritative |
| Durable orientation contract | OLEDUE → ORIENTER → PROJECT_STATE/snapshot → VOLLEY_LOG; one active writer and parallel read-only discovery | SPECIFIED/maintained in canonical docs; exact freshness sentinel gates queue/sha consistency | Live GitHub is truth; every material change records exact SHA/checks and next step |


| AgentRun state store | Local SQLite persistence for run/task state, events, leases/fencing and cancellation | PROTOTYPE on main; implementation and offline tests are present. Runtime/Gateway integration remains absent | `gateway/agent_runtime/store.py`, `gateway/tests/test_agent_run_store.py`, EV-AGENT-RUN-STORE-001 | No model/tool calls, scheduler, capability grant, sandbox, multi-host coordination or API runtime; storage primitive only |
