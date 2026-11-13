# aLandi — карта систем и подсистем

**Срез:** 2026-11-13. **Статус:** main checkpoint parent `3c57595e6032a9b69553e23848fbaddd1fa7973e`; PR #184/#185 merged, open PRs = 0, owner issue #111 remains. Main Quality #43419102024 and Project State Freshness #43419101988 passed on this exact SHA. Model/runtime artifacts (13,783,270,816 bytes uploaded) are SHA-verified in GitHub Actions but not installed on VPS. Last site-affecting Pages SHA remains `6a366125720453193c82a7385f8c088224a5928e`; no public root/landing files changed in this stack slice. **Назначение:** короткая карта продукта, границ и методов реализации; не backlog и не доказательство VPS/runtime deployment.

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
| 2 | **Chat, projects and browser persistence** | `index.md`, browser storage helpers, Playwright E2E | Browser-local chat/project state; transactional writes, backup/restore, fail-closed persistence, quota-injection tests; keep existing storage keys/schema | IMPLEMENTED |
| 3 | **Personal / shared / project memory** | `index.md`, local memory helpers, project settings | Personal memory stays browser-local; shared memory requires explicit opt-in; project memory stays scoped to the selected project; helper suggestions require user selection before saving | IMPLEMENTED / scoped |
| 4 | **Conversation delta sync** | `gateway/memory/delta_sync.py`, `gateway/app.py` | Versioned bounded patches, revision/conflict checks and explicit deletion; separate from local notes and RAG | IMPLEMENTED |
| 5 | **aServi and provider routing** | `index.md`, provider registry, `tests/e2e/alandi-provider.spec.mjs` | First-party aServi is distinct from third-party providers; manual route choice; no silent cross-provider fallback. Registry: Gemini, Groq, xAI, Pollinations, Cloudflare Workers AI, OpenRouter, NVIDIA NIM, Hugging Face, Kilo and custom OpenAI-compatible API | IMPLEMENTED baseline; four-panel Functions expansion remains OPEN |
| 6 | **Chat orchestration and Agents** | `index.md`, gateway chat route, `gateway/agent_runtime/store.py` | Direct one-model chat and bounded four-stage pipeline; AgentRunStore persists state/events only and is not an independent agent scheduler/runtime | IMPLEMENTED chat baseline / PROTOTYPE AgentRunStore |
| 7 | **Skills and task profiles** | `skills/`, on-demand loader, `index.md` | Progressive disclosure; profiles change task instructions only and do not grant tools, credentials or data access | IMPLEMENTED |
| 8 | **Search and external sources** | `index.md`, `gateway/app.py`, adapters, `INTEL.md` | Search adapters are separate from evidence/citation validation; retrieved content is untrusted data, never an instruction source | IMPLEMENTED / adapter-dependent |
| 9 | **Research traces and evidence** | `index.md`, `gateway/rag/evidence_ledger.py`, `gateway/rag/citations.py` | Traceable source IDs, bounded context, provenance-aware citations and explicit abstention when evidence is insufficient | IMPLEMENTED / eval coverage bounded |
| 10 | **RAG and document retrieval** | `gateway/rag/lazy_graph_rag.py`, `gateway/memory/scope.py`, RAG tests | SQLite FTS5 + lexical concept graph; Qwen3 embedding package acquired but `/api/embed` adapter is not implemented; not full dense/multimodal RAG | IMPLEMENTED lexical baseline / embedding SPECIFIED |
| 11 | **Document and file ingestion** | `POST /v1/documents/extract`, `gateway/tests/test_document_extraction.py` | Bounded native extraction; GLM-OCR model and Tesseract language data acquired, but OCR workers/binary are not installed or wired; scanned PDFs remain unsupported by current endpoint | IMPLEMENTED / bounded; OCR DEFERRED |
| 12 | **Voice and audio** | `gateway/voice/`, `POST /v1/audio/transcriptions`, `POST /v1/audio/speech`, audio E2E | Whisper/Qwen3-ASR models, Silero VAD model and Piper RU/EN voices acquired; Whisper CLI, ONNX Runtime and Piper package are not installed; flags remain off; no approved Thai Piper voice | IMPLEMENTED adapters / runtime NOT INSTALLED |
| 13 | **Gateway and security boundary** | `gateway/app.py`, `gateway/security/`, gateway tests | FastAPI; bearer auth, CORS allowlist, SSRF/redirect validation, body/time limits, bounded concurrency, cancellation-safe resource release | IMPLEMENTED; VPS runtime unverified |
| 14 | **Local model serving** | `models/runtime-stack.lock.json`, `models/runtime-install.md`, Ollama config | Linux AMD64 Ollama archive and four auxiliary registry packages acquired; owner-supplied uncensored main checkpoint excluded; target host/platform and runtime not verified | ARTIFACTS VERIFIED / NOT INSTALLED |
| 15 | **Cache and runtime observability** | browser cache, gateway SQLite cache, host/runtime metrics | Keep browser L0, model-prefix/KV reuse and gateway L2 exact-response cache distinct; cache only eligible completed text; bypass dynamic, streaming, tool, multimodal and error paths | IMPLEMENTED / feature-flag dependent |
| 16 | **Quality and release pipeline** | `.github/workflows/`, `scripts/`, Playwright, pytest | Main Quality #43419102024 and Freshness #43419101988 passed on checkpoint SHA `3c57595`; PR queue empty; no site deployment implied by docs/runtime commits | IMPLEMENTED |
| 17 | **Engineering navigation and knowledge** | `OLEDUE.md`, `ORIENTER.md`, `AGENTS.md`, `docs/PROJECT_STATE.yaml`, `docs/VOLLEY_LOG.md` | Atomic main-only checkpoint, exact SHA/checks, one task registry, one systems map and append-only evidence log; `oledue` resumes from last checkpoint without broad rescan | IMPLEMENTED / continuously maintained |
| 18 | **Upstream research and acquisition** | `INTEL.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md`, `docs/TECHNIQUE_REGISTER_RU.md` | Thematic batches; verify upstream revision, license, provenance, security, resource fit and measurable advantage before adoption | RESEARCH / selective pilots |

| 19 | **Coder Browser Local workspace** | `workspace/`, Browser Local provider and E2E | User-selected file/folder access, bounded read/write, diff review, explicit write approval and local recovery; no arbitrary shell or sandboxed execution | IMPLEMENTED v1 (PR #184) |
| 20 | **AgentRun state store** | `gateway/agent_runtime/store.py`, `gateway/tests/test_agent_run_store.py` | SQLite run/task state, events, leases/fencing and cancellation primitives; no scheduler, model calls, capability grant or API runtime | PROTOTYPE |
| 21 | **Model/runtime artifact acquisition** | `models/artifacts.manifest.json`, `models/manifest-ollama-registry.json`, acquisition workflows | 10 external-cache packages + four Ollama model packages acquired and verified in Actions (13.78 GB); owner main checkpoint excluded; 30-day retention | VERIFIED DOWNLOADED / NOT INSTALLED |
| 22 | **API/provider and dependency inventory** | `index.md`, `gateway/app.py`, `pyproject.toml`, `uv.lock`, `models/runtime-stack.lock.json` | OpenAI-compatible provider registry, 19 authenticated gateway routes, pinned Python/runtime libraries and explicit optional adapters; no speculative installs | IMPLEMENTED inventory / integrations conditional |
| 23 | **Connector registry and actions** | Functions Connectors surface / OAuth routes | OAuthVault encrypts provider tokens and binds single-use PKCE state to the provider; Google Drive OAuth remains groundwork without Picker/actions; GitHub App repository connector is not implemented or registered; keep truthful empty state | SECURITY FOUNDATION IMPLEMENTED / CONNECTOR NOT IMPLEMENTED |

## 2. Non-negotiable boundaries

- **Release truth:** `main` is the only durable product baseline. Current owner instruction is main-only delivery; open PR queue is zero. Retained closed branches are source references, not active workstreams.
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
- Keep manifests, downloader scripts, hashes and provenance in the repository. **Do not place model weights in the GitHub Pages source tree.** Current Actions artifacts expire 2026-12-13; download to governed storage before expiry and verify SHA-256 before loading. The owner-supplied primary checkpoint remains separate.
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


## Functions detail crosswalk — historical owner snapshot (2026-11-08)

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


## 6. Current API, model, dependency and storage inventory — 2026-11-13

### External provider APIs (client-side OpenAI-compatible adapters)

| Provider | Base URL | Key/config source | Status |
|---|---|---|---|
| Google AI Studio / Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` | User-managed API key | Available in provider registry |
| Groq | `https://api.groq.com/openai/v1` | User-managed API key | Available |
| xAI / Grok | `https://api.x.ai/v1` | User-managed API key | Available |
| Pollinations.ai | `https://gen.pollinations.ai/v1` | User-managed API key | Available |
| Cloudflare Workers AI | Account-scoped OpenAI-compatible endpoint | Account ID + user-managed token | Available |
| OpenRouter | `https://openrouter.ai/api/v1` | User-managed API key | Available |
| NVIDIA NIM | `https://integrate.api.nvidia.com/v1` | User-managed API key | Available |
| Hugging Face Inference Providers | `https://router.huggingface.co/v1` | User-managed token | Available |
| Kilo AI Gateway | `https://api.kilo.ai/api/gateway` | User-managed key | Available |
| Custom | User-supplied OpenAI-compatible base URL | User-managed key | Available |
| aServi | Owner's private gateway URL + Bearer key | Local browser settings; gateway secret stays server-side | First-party route, separate from third parties |

Keys are not committed to source. Provider selection is manual; private aServi requests must not silently fall back to another provider. The current registry does not contain an Anthropic-native adapter.

### FastAPI gateway routes (current source contract)

- Health/readiness: `GET /livez`, `GET /readyz`, `GET /healthz`.
- Capability/model catalog: `GET /v1/capabilities`, `GET /v1/models`.
- Chat: `POST /v1/chat/completions`.
- Cache/runtime admin: `GET /admin/cache/stats`, `GET /admin/runtime`.
- Conversation delta: `GET/DELETE /v1/memory/state/{conversation_id}`, `POST /v1/memory/delta`.
- Project helper: `POST /v1/helpers/project-memory-suggestions` (conditional; helper model unset by default).
- RAG: `POST /v1/rag/ingest`, `POST /v1/rag/retrieve`, `DELETE /v1/rag/documents/{document_id}`.
- Search/documents: `GET /v1/search/web`, `POST /v1/documents/extract`.
- Voice: `POST /v1/audio/transcriptions`, `POST /v1/audio/speech`.

Gateway baseline: Python 3.12+, FastAPI 0.162.0, httpx 0.28.1, Uvicorn 0.54.0, cryptography 50.0.2, jsonschema 4.26.0, pypdf 6.21.4; dev group pytest 9.1.1, pytest-asyncio 1.4.0, PyYAML 6.0.3 and vulture 2.16. `uv.lock` pins the transitive dependency graph. Static GitHub Pages UI has no Node `package.json` dependency graph.

### Model/runtime and optional libraries

| Capability | Acquired artifacts | Still required before use |
|---|---|---|
| Local model serving | Ollama 0.40.16 Linux AMD64 archive; official Qwen3.5-4B base comparator, Qwen3.5-2B helper, Qwen3 Embedding Q8_0, GLM-OCR Q8_0 | Confirm target platform/resources; install runtime; owner supplies uncensored primary checkpoint separately |
| ASR | Whisper large-v3-turbo Q5_0; Qwen3-ASR-0.6B | Build pinned whisper.cpp 1.9.5 CLI + FFmpeg/ffprobe; isolated Qwen ASR env: qwen-asr 0.0.6, Transformers 4.57.6, Accelerate 1.12.0, Nagisa 0.2.11, SoyNLP 0.0.493 |
| VAD | Silero VAD 16 kHz ONNX model | Pin/install ONNX Runtime CPU after host architecture check |
| TTS | Piper 1.8.0 Linux x86_64 wheel + RU Dmitri Medium and EN Joe Medium voices | Install wheel/voices; review GPL-3.0-or-later runtime and voice-specific licenses; no approved Thai voice |
| OCR | GLM-OCR model; Tesseract fast RU/EN/TH language data | Ollama GLM OCR integration and scanned-PDF tests; Tesseract 5.5.4 binary is not included; PP-DocLayoutV3 is not included |
| Reranking | Qwen3-Reranker-0.6B weights | Isolated Transformers 4.57.6 + CPU PyTorch worker only if nDCG/MRR improves |
| PDF/document parsing | pypdf 6.21.4; pypdfium2 5.14.0; Pillow 11.3.0 | Keep bounded parser; no universal office/book parser is claimed |

### Storage and deployment decisions

- Current server-side data: SQLite (FTS5 RAG, exact-response cache, AgentRunStore prototype); browser-side data: IndexedDB/localStorage.
- PostgreSQL, Redis and Qdrant are **not selected**. Add only after dataset/concurrency/latency measurements demonstrate SQLite/FTS5 is insufficient.
- Ollama binds to loopback; FastAPI uses systemd on loopback; Cloudflare Tunnel is target-only until live host evidence exists. No VPS, Tunnel, model runtime or database migration is claimed deployed.
- Downloaded Actions artifacts total 13,783,270,816 bytes and expire 2026-12-13. They are not installed on a target host. The owner-supplied uncensored primary checkpoint is excluded.
