# aLandi — PROJECT ORCHESTRATOR / единый каталог проекта

**Назначение:** одна навигационная точка для принципов aLandi, правил работы, архитектуры, внешних источников, исследований, планов, задумок, оценок, задач и сохранённых артефактов. Этот файл отвечает на вопрос **«где находится нужное знание?»**, а не копирует сами знания и не заменяет профильные документы.

**Статус:** индекс-навигация. Источники и проектные решения имеют собственные канонические документы; живой статус GitHub всегда перепроверяется через GitHub API.

**Как пользоваться:** сначала выбери раздел по теме → открой указанный canonical source → проверь его maturity/status и связанные evidence → перед изменением проверь текущий Master Task Registry. Для handoff следуй OLEDUE.

---

## 0. Карта истины и полномочий

| Уровень | Что является владельцем информации | Что не следует подменять |
|---|---|---|
| Owner + safety | Явная цель владельца, разрешённый scope, безопасность и privacy | Инициатива агента не является разрешением |
| Live repository facts | GitHub: current main, refs, PRs, issues, diffs, exact-head checks | Старые SHA, чат и снимок документа |
| Handoff / execution rules | `OLEDUE.md`, `AGENTS.md`, `LOOP.md` | Не являются live status GitHub |
| Short orientation | `ORIENTER.md` | Не является backlog или полной архитектурной спецификацией |
| Project state | `docs/PROJECT_STATE.yaml` + `docs/project-state-snapshot.json` | Не доказывают runtime, deployment или device readiness |
| Strategy / task order | `docs/IMPLEMENTATION_ROADMAP_RU.md` | Не является списком всех исходных требований |
| Single task inventory | `docs/MASTER_TASK_REGISTRY_RU.md` + append-only owner addendum | Не создавать parallel backlog |
| External source inventory | `INTEL.md` + профильные triage/technique/research docs | Наличие URL не означает approval или verified current facts |
| Decisions / evaluations | `DECISIONS.md` / `EVALS.md` | Кандидат или benchmark proposal не равен внедрённой функции |
| Stage history | `docs/VOLLEY_LOG.md` | Не хранить transcript или скрытые reasoning traces |

**При конфликте:** safety и owner authority → latest explicit owner request → GitHub live facts → canonical decisions/contracts/state → memory/chat summaries.

## 1. Принципы aLandi, N₂O и поведение исполнителя

| Тема | Канонический источник | Для чего обращаться |
|---|---|---|
| Миссия, базовая архитектура, границы продукта | [ALANDI_MASTER_CONTEXT_RU.md](docs/ALANDI_MASTER_CONTEXT_RU.md) | Цели aLandi, UI/gateway/runtime, зрелость и архитектурная картина |
| Требования и пользовательские принципы | [ALANDI_REQUIREMENTS_REGISTER_RU.md](docs/ALANDI_REQUIREMENTS_REGISTER_RU.md), [USER_REQUEST_CHECKLIST.md](docs/USER_REQUEST_CHECKLIST.md) | Проверка исходных owner requirements; historical IDs и acceptance |
| Проектные инструкции ChatGPT | [ALANDI_CHATGPT_PROJECT_INSTRUCTIONS_RU.md](docs/ALANDI_CHATGPT_PROJECT_INSTRUCTIONS_RU.md), [AGENTS.md](AGENTS.md) | Правила исполнителя, инженерная дисциплина, безопасность |
| Handoff и полномочия | [OLEDUE.md](OLEDUE.md) | Триггер `oledue`, Session Sync Capsule, выбор задачи/PR, approval gates |
| Быстрая навигация | [ORIENTER.md](ORIENTER.md) | Короткая точка входа и live-checkpoint |
| Engineering loop | [LOOP.md](LOOP.md) | Observe → Hypothesize → Gate → Implement → Verify → Decide → Learn |
| N₂O Core | [ALANDI_N2O_CORE_RU.md](docs/ALANDI_N2O_CORE_RU.md) | Правила накопления и применения знаний |
| N₂O Knowledge Loop | [ALANDI_N2O_KNOWLEDGE_LOOP_RU.md](docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md) | Как проверенное знание становится кандидатом на reusable knowledge |
| ChatGPT Sources | [ALANDI_N2O_CHATGPT_SOURCES_RU.md](docs/ALANDI_N2O_CHATGPT_SOURCES_RU.md) | Контракт источников/контекста для ChatGPT |
| Security / privacy boundaries | [SECURITY.md](SECURITY.md), [PRIVACY_MEMORY_BOUNDARIES_RU.md](docs/PRIVACY_MEMORY_BOUNDARIES_RU.md), [LAUNCH_PRIVACY_REVIEW_RU.md](docs/LAUNCH_PRIVACY_REVIEW_RU.md) | Trust boundaries, data scope, privacy and retention |
| Accepted improvements | [ACCEPTED_IMPROVEMENTS.md](docs/ACCEPTED_IMPROVEMENTS.md) | Ранее принятые улучшения; повторно проверять статус и evidence |
| Decision authority | [DECISIONS.md](DECISIONS.md) | Принятые/отклонённые архитектурные решения и rationale |

**Правило:** N₂O — governance/knowledge loop, а не новая продуктовая memory database. Browser history, gateway Memory/RAG и N₂O records — разные контуры.

## 2. Roadmap, task registry и текущие workstreams

| Источник | Роль |
|---|---|
| [IMPLEMENTATION_ROADMAP_RU.md](docs/IMPLEMENTATION_ROADMAP_RU.md) | Основная последовательность исполнения: 20 шагов / P0–P3 и engineering gates |
| [MASTER_TASK_REGISTRY_RU.md](docs/MASTER_TASK_REGISTRY_RU.md) | Единственный lossless inventory всех owner tasks и стабильных IDs |
| [MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md](docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md) | Append-only delta новых owner requirements, specialist tasks и детальные acceptance |
| [VOLLEY_LOG.md](docs/VOLLEY_LOG.md) | Stage-zero baselines, существенные этапы, точные SHAs, checks, blockers, decisions |
| [PROJECT_STATE.yaml](docs/PROJECT_STATE.yaml) | Structured state, flags, maturity, active task and next action |
| [project-state-snapshot.json](docs/project-state-snapshot.json) | Machine-readable main/queue checkpoint for Project State Freshness |
| [IMPLEMENTATION_GUIDE](docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md) | VPS/runtime operational source and runbook |
| [V1_UI_FINALIZATION_RU.md](docs/V1_UI_FINALIZATION_RU.md) | V1 acceptance and user-facing UI gate |
| [LANDING_RELEASE_STRATEGY_RU.md](docs/LANDING_RELEASE_STRATEGY_RU.md) | V1/V2 promotion strategy |
| [CODER_PACKET.md](docs/CODER_PACKET.md) | Detailed coding/implementation handoff packet |
| [FEATURE_IMPLEMENTATION_PLAN_RU.md](docs/FEATURE_IMPLEMENTATION_PLAN_RU.md) | Feature implementation sequencing |
| [ALANDI_ARCHITECTURE_MAP_RU.md](docs/ALANDI_ARCHITECTURE_MAP_RU.md) | Curated architecture map; not a generated code graph |
| [FILE_ORIENTER_RU.md](project-reference/FILE_ORIENTER_RU.md) | Detailed source-code/path navigation by subsystem |

### 2.1 Specialist plans, blueprints and idea collections

These remain in their domain documents; this index connects them without merging their contents into a new mega-plan.

| Area | Canonical documents |
|---|---|
| Whole-stack audit / debugger / cleanup | [ARCHITECTURE_DEBUGGER_PLANNER](docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md), [WHOLE_STACK_INTEGRITY_AUDIT](docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md), [REPOSITORY_DEBUGGER_AUDIT_PHASE1](docs/REPOSITORY_DEBUGGER_AUDIT_PHASE1_2026-11-05_RU.md), [COMPREHENSIVE_READINESS_AUDIT](docs/COMPREHENSIVE_READINESS_AUDIT_RU.md), [ENGINEERING_PACKAGE_AUDIT](docs/ENGINEERING_PACKAGE_AUDIT_RU.md) |
| Agent / orchestration / Skills | [AGENT_ORCHESTRATION_RESEARCH](docs/AGENT_ORCHESTRATION_RESEARCH_RU.md), [SUPERSTACK_FINAL](docs/SUPERSTACK_FINAL_RU.md), [ECC_ARCHIVE_REVIEW](docs/ECC_ARCHIVE_REVIEW_RU.md) |
| Voice / audio | [VOICE_IMPLEMENTATION_PLAN](docs/VOICE_IMPLEMENTATION_PLAN_RU.md), [VOICE_DOCUMENT_READINESS_AUDIT](docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md) |
| Models / multimodal | [MULTIMODAL_MODEL_STACK](docs/MULTIMODAL_MODEL_STACK_RU.md), `models/`, `gateway/evals/run_local_model_benchmark.py` |
| Memory / RAG | [ALANDI_AGENT_MEMORY_KNOWLEDGE](docs/ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md), [RAG_RRF_EVALUATION](docs/RAG_RRF_EVALUATION_RU.md), [EVALS.md](EVALS.md) |
| Research / source-to-feature | [SEARCH_RESEARCH_FEATURE_EXTRACTION](docs/SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md), [EXA_RESEARCH_SYNTHESIS](docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md) |
| UI / landing / UX | [LANDING_UX_POLISH_BACKLOG](docs/LANDING_UX_POLISH_BACKLOG_RU.md), [CHAT_SETTINGS_INFORMATION_ARCHITECTURE](docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md), [LEGACY_UX_REQUEST_AUDIT](docs/LEGACY_UX_REQUEST_AUDIT_RU.md) |
| Launch / operations | [FIRST_FREE_LAUNCH_BACKLOG](docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md), [PRE_LAUNCH_STACK](docs/PRE_LAUNCH_STACK_RU.md), [DEPLOYMENT_PREFLIGHT](docs/DEPLOYMENT_PREFLIGHT_RU.md), [INFRASTRUCTURE_UPGRADE](docs/INFRASTRUCTURE_UPGRADE.md), [DOMAIN_SETUP](docs/DOMAIN_SETUP.md) |
| General engineering / technique | [SIX_LAYER_ENGINEERING](docs/SIX_LAYER_ENGINEERING_RU.md), [TECH_STACK_VERSION_AUDIT](docs/TECH_STACK_VERSION_AUDIT_2026-10-31_RU.md), [CODE_CURRENCY_AUDIT](docs/CODE_CURRENCY_AUDIT_2026-10-31_RU.md), [LATENCY_CONTRACT](docs/LATENCY_CONTRACT.md) |
| Historical and handoff snapshots | [CHAT_HANDOFF](docs/CHAT_HANDOFF_ALANDI_RU.md), [CONTINUATION_HANDOFF](docs/CONTINUATION_HANDOFF_RU.md), [START_HERE](docs/START_HERE_RU.md) — helpful context, not live task/PR truth |

**Maturity rule:** a document can describe current, partial, prototype, research-only, deferred or rejected work. Read its status and evidence; don't infer implementation from its title.

## 3. External sources, projects, models, techniques and standards

### 3.1 The main external-source entry point

- [INTEL.md](INTEL.md) — primary external source register and consolidated navigation inventory. Its 2026-11-04 snapshot deduplicates **257 distinct URLs** from the curated catalogs below. This is URL coverage, not proof that all 257 sources were revalidated on that date or are currently suitable.
- [OPEN_SOURCE_TRIAGE_RU.md](docs/OPEN_SOURCE_TRIAGE_RU.md) — source-by-source technical fit, what to borrow, defer or reject.
- [TECHNIQUE_REGISTER_RU.md](docs/TECHNIQUE_REGISTER_RU.md) — concrete techniques/patterns and decisions on how they could be applied to aLandi.
- [EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md](docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md) — external research synthesis.
- [SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md](docs/SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md) — translate source findings into feature candidates and implementation opportunities.
- [MULTIMODAL_MODEL_STACK_RU.md](docs/MULTIMODAL_MODEL_STACK_RU.md) — multimodal models and stack candidates.
- [ALANDI_N2O_CHATGPT_SOURCES_RU.md](docs/ALANDI_N2O_CHATGPT_SOURCES_RU.md) — source-use and context principles.

**Проверенный batch 2026-11-06 (CANDIDATE / NOT ADOPTED):**
- **XERJ:** public source v1.0.0-rc.101 / 83c9f0d... — Apache-2.0; exact release binary is built from a private tree with three proprietary query crates. Its 408,024,623-byte model bundle has no verified redistribution terms. Do not archive rc.101 binary/weights; public-source retrieval bake-off only.
- **Memvid:** v2.0.140 / e18fe554... — Apache-2.0; evaluate a portable export/archive capsule, not a SQLite replacement.
- **RAG-Anything:** v1.4.1 / 0ef67b4... — MIT code, but MinerU/LightRAG and optional audio/video dependency/model terms require separate review. Borrow patterns only; no full install.
- Exact revisions, repository sizes, dependency findings and eval gates are in docs/OPEN_SOURCE_TRIAGE_RU.md, INTEL.md, docs/TECHNIQUE_REGISTER_RU.md and EVALS.md.


### 3.2 Research workstreams that are not automatically adopted

- PR #125 — Agent Studio / Skill Factory research, FUTURE/HOLD.
- PR #131 — V2 workbench; selective integration only.
- PR #152 — voice workstream; independent Draft.
- PR #154 — modular shell promotion candidate; inspect exact live head/checks.
- PR #155 — roadmap and orientation documentation workstream.
- Issue #111 — owner-controlled live deployment/release gates.

These IDs are a checkpoint only. Always fetch live PR/issue states before selecting or acting on a workstream. Historical PR research may contain useful candidates, but source branch snapshots are not automatically canonical main content.

### 3.3 How a source becomes an aLandi capability

1. **DISCOVERED:** exact upstream URL and specific item identified.
2. **TRIAGED:** purpose, maintenance, version/revision, code/model/data license, security, dependencies, resource fit and alternatives reviewed.
3. **CANDIDATE:** a specific technique or artifact has a proposed use and acceptance hypothesis.
4. **VERIFIED:** source evidence and aLandi baseline comparison confirm applicability.
5. **ACCEPTED:** an architecture decision and owner authorization permit a bounded adoption.
6. **ARCHIVED:** exact usable code snapshot and/or model artifact is preserved in the repository when redistribution and storage allow, with provenance manifest, LICENSE/NOTICE, SHA-256 and metadata.
7. **INTEGRATED:** code is connected to the product behind the relevant contracts/flags and tests.
8. **VERIFIED LIVE:** target hardware/provider/device confirms actual availability and behavior.

A link, benchmark report, downloaded archive, PR merge or CI pass alone does not advance every maturity stage.

### 3.4 Artifact preservation policy

**Default preference:** selected/adopted source code and model artifacts should be stored in this repository, not only linked externally, whenever the applicable license permits redistribution and GitHub/repository storage constraints are satisfied.

Required artifact record:
- exact upstream URL, immutable commit/tag/release or model revision;
- source-code license and model/weights/tokenizer/dataset/voice license independently;
- SPDX expression where applicable, NOTICE/attribution and model card;
- SHA-256 for downloaded files and deterministic source snapshot manifest;
- artifact size, acquisition date, dependencies/runtime, storage rationale and security notes;
- entry in `infra/license/provenance_manifest.yaml` and the relevant eval/task record;
- state such as archive-only / eval-only / runtime-approved / shipped.

Do not bulk-download all 257 catalog URLs, entire inspiration repositories, unrelated datasets or every model variant. The acquisition target is **selected useful artifacts**, not the entire watchlist. If redistribution is prohibited or storage limits are exceeded, record the exact blocker and present an owner decision rather than silently replacing the repository archive with an external link. Archived model weights remain disabled until model bake-off, target resource testing, security/privacy review and release approval.

**Existing artifact example:** `models/vosk/vosk-model-small-ru-0.22.zip` has repository-side README/license/checksum/metadata. Its presence does not prove target hardware quality or runtime activation.

## 4. Evaluation, quality, architecture and evidence

| Source | Role |
|---|---|
| [EVALS.md](EVALS.md) | Canonical eval registry, reproducible commands, datasets, metrics and release gates |
| [DECISIONS.md](DECISIONS.md) | Accepted/rejected architecture decisions with problem, evidence, alternatives and rollback |
| [IMPROVEMENT_SELECTION.md](IMPROVEMENT_SELECTION.md) | Select improvements by impact/risk and evidence |
| [INTEL.md](INTEL.md) | External evidence and upstream facts |
| [TECHNIQUE_REGISTER_RU.md](docs/TECHNIQUE_REGISTER_RU.md) | Candidate techniques and project-specific adoption guidance |
| [provenance_manifest.yaml](infra/license/provenance_manifest.yaml) | Source/license/digest provenance for model/code/voice artifacts |
| `gateway/evals/` | Executable eval harnesses, fixtures and model/retrieval benchmarks |
| `tests/`, `gateway/tests/` | Contract, regression, security and product tests |
| `scripts/` and `.github/workflows/` | Static checks, freshness/provenance gates and automation |

**Evidence labels:** FACT / HYPOTHESIS / PROPOSAL / SPECIFIED / IMPLEMENTED / VERIFIED. For product maturity use VERIFIED, IMPLEMENTED, PROTOTYPE, SPECIFIED, EXPERIMENTAL, DEFERRED, REJECTED, DEPRECATED. Keep code status, source confidence, CI evidence and live availability separate.

## 5. Task intake: record first, deduplicate, then implement

This applies to **every new owner request**, not only large engineering requests.

1. Extract each distinct outcome/constraint/acceptance requirement from the request.
2. Search `docs/MASTER_TASK_REGISTRY_RU.md`, its owner addendum and relevant specialist checklist. Search by meaning/synonyms, not only identical wording.
3. If a task already exists, extend the same stable ID with the new requirement, acceptance, priority, dependency or evidence. Do not create a near-duplicate.
4. If no task exists, create a new stable ID in the one logical registry **before** implementation, new files, artifact downloads or cleanup.
5. Record a stage-zero baseline in `docs/VOLLEY_LOG.md` before the first material change: main/branch/base/head, live PR/issue state, exact checks, risks, acceptance and rollback.
6. Record significant milestones, blockers, exact-tested SHA, run IDs and next action. Update `PROJECT_STATE.yaml`/ORIENTER/snapshot only when their represented state materially changes.

**Large initiatives:** keep one durable outcome statement and a few major milestones. Implement each milestone as a bounded, reversible vertical slice with evidence. Preserve the overall goal across sessions; don't turn it into hundreds of disconnected micro-tasks. Keep one primary implementation WIP while batching independent read-only research.

## 6. Cleanup and optimization: evidence before deletion

Use `CLEANUP-2026-002` and `AUDIT-010` in the Master Registry owner addendum.

- Create a candidate inventory first; don't immediately delete files because a scanner labels them unused.
- Trace imports/exports, dynamic imports, HTML/Jekyll includes, JS selectors and listeners, CSS selectors, workflow references, scripts, test fixtures, runtime flags, docs links and generated assets.
- Check reflection/framework registration and history where static reachability is insufficient.
- Require at least two independent evidence paths for non-trivial deletion candidates; add focused tests or reference checks where possible.
- Remove in small batches with exact diff review, test/build/CI, user-data and backward-compatibility checks, and rollback.
- Optimize only against reproducible baseline and representative workloads. Change one major variable per experiment; retain changes only when performance improves without quality, security, accessibility or reliability regression.
- Never auto-delete via dead-code tools/Graphify. Never use cleanup to hide an incomplete capability or remove an owner requirement.

## 7. Fast task routing

| Owner asks about… | Open first |
|---|---|
| What should be done next? | `OLEDUE.md` → `docs/PROJECT_STATE.yaml` → roadmap → Master Registry |
| Principles, architecture or how aLandi should behave | Section 1 above; then the named canonical source |
| External projects, models, code, methods or standards | `INTEL.md` → Open Source Triage → Technique Register → relevant research doc |
| Plans, proposals or old ideas | Section 2.1; check maturity/status and active PR |
| Model/code download or preservation | Section 3.4 → owner addendum ARCHIVE tasks → provenance manifest |
| Remove dead code or optimize | Section 6 → AUDIT/CLEANUP task IDs → exact source/tests |
| Test quality or measure a model | `EVALS.md` → `gateway/evals/` → target-hardware gates |
| Find implementation path | `project-reference/FILE_ORIENTER_RU.md` |

## 8. Maintenance rules for this orchestrator

- Add a new link/category here only after its canonical destination exists and the task is registered.
- When a plan moves, merges or is rejected, update the corresponding row and preserve the historical source/provenance where useful.
- Do not copy a source catalog or backlog into this file; link it.
- External-source snapshots must show capture/review date and known gaps. Revalidate fast-changing model/OSS/API claims against official upstream before acquisition or shipping.
- Keep this file short enough to navigate. New knowledge belongs in its canonical specialist file; this document only indexes it.
- PR/branch/issue status is mutable; use live GitHub state rather than treating this index as current queue authority.

---

**Related task IDs:** `ORCH-001`, `INTAKE-001`, `SOURCES-2026-002`, `CLEANUP-2026-002`, `ARCHIVE-001/002`, `AUDIT-010`.
