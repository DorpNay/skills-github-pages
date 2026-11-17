# Реестр задач — дополнение 2026-11-02: функции, локальные источники и мультимедиа

**Родительский реестр:** `docs/MASTER_TASK_REGISTRY_RU.md` (PR #127).  
**Назначение:** append-only delta новых требований владельца от 2026-11-02. Не заменяет исходный lossless inventory и не переносит задачи между workstreams.

## Правила статусов

- `[ ]` — задача поставлена, не реализована/не проверена.
- `[~]` — частично исследована или имеет незакрытые проверки.
- `[x]` — только при наличии точного артефакта и evidence.
- Исследовательская задача не означает разрешение на runtime, dependency, download или deployment.
- Future/Research PR остаются Draft/HOLD; принятые решения переносить отдельными минимальными PR от актуального main.

## A. Functions / Agents menu — PR #131

- [~] **MENU-001** — inventory the Functions menu against `index.md`, `assets/css/landing.css` and `tests/e2e/app.spec.mjs`; finish the handler/permission/data-scope/evidence matrix.
- [~] **MENU-002** — базовая иерархия уже существует как 4 группы (task workflow, research/sources, create/transform, connections); расширить вложенные категории Agents/Skills/Files/Media/Models/Tasks без дублирования.
- [~] **MENU-003** — текущие roadmap items уже показывают non-runtime ticker и пояснение; формализовать единый status model для всех карточек.
- [~] **MENU-004** — текущий agent panel уже показывает mode, team blueprint, use cases, 64 roles, orchestration, models/resources and capabilities; добавить Skill binding, data scope, budgets, approvals and outputs по мере появления реальных handlers.
- [~] **MENU-005** — сейчас доступны direct response и sequential four-stage workflow; остальные режимы оставить roadmap-only до независимого runtime.
- [~] **MENU-006** — текущие chat profile/team blueprint controls существуют; расширенные model/skill/data/permission/resource/history controls требуют реальных backing APIs.
- [~] **MENU-007** — `1ИÆИT10И` tickers, pause controls, reduced-motion CSS and non-runtime notes exist; E2E assertions are authored, but exact-head execution is pending.
- [~] **MENU-008** — RU/EN labels and Chromium keyboard path now covered: native summary opens on Enter; panel/menu close on Escape and focus returns to summary; modal moves focus to Close and traps Tab/Shift+Tab; close-button accessible name localizes RU/EN; 320px mobile options assert ≥44px hit targets and no horizontal overflow. Duplicate-control inventory: exactly three top-level actions; the Agents link inside Deep Research is intentional contextual navigation to the same panel, not a fourth menu entry. Exact-head Quality is pending; VoiceOver still requires manual iPhone/Safari verification.
- [x] **MENU-009** — supporting UX contract создан; source audit and remaining gaps синхронизированы с canonical UI checklist section 8.28.
- [x] **UI-ICON-001** — owner UI requirement 8.8: icon-first copy/open/speak message actions with accessible labels/tooltips and 44×44 hit area; retain copy/speak in full-message view, with speak unavailable for user messages. Exact-head Quality #42349078380 passed (Jekyll, Chromium and all Quality sentinels) on implementation/test SHA 350c01513ec6dc147cd5b26e7b8e3bfa17a26d0e; status-only documentation follow-up SHA e41b1f40a0ea121a759bd0080ffc63dd2cde09c6 is awaiting recheck.

## B. Skill Factory и Agent Builder — PR #125 / PR #128

- [ ] **SF-001…SF-007** — Skill lifecycle: source ingestion, evidence/provenance, manifest, license/security scans, generated evals, human review, versioning/rollback.
- [ ] **AB-001…AB-005** — Agent blueprint: role, Skill versions, model policy, capability scopes, data scope, budgets, approvals, dry-run/evals.
- [ ] **AW-SK-001…AW-SK-005** — threat model и adversarial tests для imported Skills; inert-by-default scripts.
- [ ] **AW-UI-001…AW-UI-002** — отображать реальные worker states/concurrency отдельно от inference slots.
 > Cross-link to master registry: VERT-001…003 are already tracked as stable IDs in `docs/MASTER_TASK_REGISTRY_RU.md`; do not create duplicate addendum tasks. Preserve these source references.
> Cross-link to master registry: VERT-002 is already tracked as a stable ID in `docs/MASTER_TASK_REGISTRY_RU.md`; preserve this source reference.
> Cross-link to master registry: VERT-003 is already tracked as a stable ID in `docs/MASTER_TASK_REGISTRY_RU.md`; preserve this source reference.

**Artifacts:** PR #125 `AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md`; PR #128 `AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md`.

## C. Компактные модели / SLM — PR #125

- [x] **SLM-001** — определить task-based bake-off вместо рейтинга по числу параметров; роли: classification/routing, structured extraction, reranking, summarization, memory candidate generation, Skill synthesis. **Artifact:** `docs/AGENT_MODEL_BAKEOFF_RU.md`, раздел “2026-11-02 — Task-based small-model evaluation contract”.
- [ ] **SLM-002** — подготовить одинаковый RU/EN/TH golden set и схемы для каждого узкого сценария.
- [ ] **SLM-003** — измерить cold load, RAM/PSS, VRAM, TTFT, p50/p95, tokens/sec, concurrency and cancellation на целевом хосте.
- [ ] **SLM-004** — зафиксировать immutable model digest, quantization, tokenizer/template, runtime, code/weights/dataset licenses.
- [ ] **SLM-005** — сравнить с main-only baseline и включать не более одного helper model за раз; default remains off until owner approval.

## C. Voice и audio generation — PR #129

> **AUDIO-GEN-001…009 cross-link:** the nine atomic Agent Audio tasks are now tracked individually in `docs/MASTER_TASK_REGISTRY_RU.md`; retain this source-group reference without counting a second task.
- [ ] **AUDIO-UI-001** — разделить ASR, TTS/voice conversation, non-speech audio generation и post-processing.
- [ ] **AUDIO-UI-002** — preview/accept/reject, artifact provenance, project attach only after explicit approval.
- [ ] **AUDIO-SKILL-001** — описать media-production Skill с cue sheet, sound generation, audition, sync and export.
- [ ] **AUDIO-SMALL-001** — сравнить компактные модели/backends с baseline на target hardware; не принимать parameter count за benchmark.

**Artifact:** PR #129 `LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md`. Agent Audio remains early-preview candidate; no install/download performed.

## D. Deep Research, local files, conversion, video — PR #130

- [ ] **LSV-001…LSV-014** — browser permissions, local Source Vault, consent/storage modes, extraction, deletion lineage, screenshot-to-code, video workflows and archive policy.
- [ ] **LSV-015** — capability matrix File System Access across desktop/mobile browsers.
- [ ] **LSV-016** — fallback upload/drag-drop for unsupported browsers.
- [ ] **LSV-017** — decide if persistent directory watchers require a local companion; no public filesystem endpoint.
- [ ] **CONV-001** — compare Docling with existing parser on RU/EN/TH corpus and resource budgets.
- [ ] **CONV-002** — validate screenshot-to-code quality with golden screenshots, no-execution review workspace.
- [ ] **CONV-003** — define image→OCR/VLM, page→HTML/CSS, audio→transcript, video→frames/transcript workflows and provenance.
- [ ] **VIDEO-001** — benchmark ComfyUI/Wan candidate only on suitable GPU hardware and with exact model/checkpoint license review.
- [ ] **ARCHIVE-001** — upstream watchlist: exact versions, SHA-256, source/model/dataset licenses, dependencies, storage size and preservation reason.
- [ ] **ARCHIVE-002** — mirror only after explicit approval and only when licenses/terms permit; never commit weights to Git.

**Artifact:** PR #130 `LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md`.

## E. Общие acceptance gates

- [~] **GATE-001** — capability maturity matrix partially recorded in `docs/ALANDI_SYSTEMS_MAP_RU.md` (18 systems; current/partial/prototype/specified boundaries). Recent correction: aServi, Functions/Deep Research/Skills and AgentRunStore now reflect merged-main maturity. Fine-grained per-capability evidence and full subsystem sweep remain OPEN.
- [ ] **GATE-002** — threat model for local file access, untrusted documents, archive bombs, prompt injection, path traversal, malicious scripts and generated code.
- [ ] **GATE-003** — verify code, model weights, tokenizer, voice, dataset and workflow licenses independently.
- [ ] **GATE-004** — record actual disk/RAM/VRAM/latency/quality on target hardware; no extrapolation from model size.
- [ ] **GATE-005** — add exact-head tests and update canonical project state after each bounded implementation stage.
- [ ] **GATE-006** — require explicit owner approval before model downloads, runtime/dependency changes, external sync, destructive file operations, deployment or merge.

## Cross-links

- PR #131 — UI information architecture; main remains V1.
- PR #125 — Agent Studio / Skill Factory; Draft/HOLD.
- PR #128 — Agent Workforce / worker safety; Draft/HOLD.
- PR #129 — Voice / local audio generation; Draft/HOLD.
- PR #130 — Deep Research / local source vault and conversion; Draft/HOLD.

**Status:** new owner requirements indexed; no runtime implementation or model download is implied.


## F. Chromium and responsive follow-up — PR #131

- [~] **MENU-011** — Agent panel: сгруппировать пять future capability sections в три native RU/EN disclosures (use cases/roles; orchestration/models/resources; tools/permissions); сохранить 44px hit targets, keyboard Enter/Space и работу ticker pause. Source/test/documentation committed on PR #131; exact-head Quality/Chromium is still unverified.

Quality #1490 passed Integrity, Jekyll, Security, Context and static analysis on source/test parent dfe88836, but two Chromium shards failed. The mobile and Chromium corrections were committed through PR #131 HEAD 4afd4f4; the subsequent Agent panel disclosure slice is now on HEAD 736610b. No workflow run is currently returned for the latest HEAD, so exact-head Quality/Chromium remains unverified.

- [~] **E2E-UI-001** — project settings test now opens the actual project settings modal before using the current-chat project selector.
- [~] **E2E-UI-002** — chat-row move/Undo test seeds two projects and one chat, avoiding unrelated queued creation toasts; asserts restored project and stable chat ID.
- [~] **E2E-UI-003** — memory tests now open the outer Memory disclosure before interacting with nested Memory tools; privacy opt-in assertions remain unchanged.
- [x] **MENU-010** — Research Studio is retired entirely by the owner. PR #169 removes the Research Studio surface and entrypoints; exact PR Quality #42408172737 passed 113/113 Chromium.
- [~] **A11Y-UI-001** — scope ticker locators to the first intended ticker where multiple cards exist; retain reduced-motion and explicit pause checks.
- [~] **MOBILE-001** — restore 44px new-chat target on mobile despite later sidebar overrides.
- [~] **MOBILE-002** — remove extra 12px composer-footer padding on short mobile viewports while preserving the device safe-area inset.
- [~] **MOBILE-003** — reduce clock shell to 56px at <=360px to recover header title width without forcing horizontal overflow.
- [ ] **MOBILE-004** — review actual Chromium screenshots at 320/360/390/768/1024/1440px and manually verify iPhone Safari/VoiceOver.

Evidence status: test source changes are committed; JavaScript/Playwright syntax parsing passed; CSS geometry corrections are committed. No browser result on 4afd4f4 is available yet. Do not mark any [~] item complete until Quality #1501 (or later exact-head run) confirms it.


## G. Продолжение владельца — 2026-11-05

Порядок соответствует исходному запросу владельца: сохранить V1 baseline → ускорить ориентирование → разобрать и выборочно продвигать V2 → сохранить нужные источники/артефакты → консолидировать PR/ветки/Issues.

- [x] **ORIENT-2026-001 — SUPERSEDED BY NOW.md (2026-11-15).** Historical PR #140 handoff remains evidence only; the single first-read checkpoint is root `NOW.md` lines 1–100, with full owner prompts and append-only step journal. Do not read/recreate Session Sync Capsule, OLEDUE, ORIENTER or FILE_ORIENTER as startup inputs. Detailed product documents are on-demand.
- [x] **BASELINE-2026-001** — preserve original Landing V1 at `9b746f7bbb1a12b482bd6f0a7cefd62b3cb454af` in branch `archive/landing-v1-baseline-9b746f7-20261105`. This is a separate recoverable reference; main remains open to bounded quality improvements.
- [x] **LANDING-V1-2026-001** — promote the independent public landing accessibility/responsive slice via PR #139 (merge SHA `2e11849d409a51009693af95ac3ecbf1f057a3fc`). Exact-main Quality, Pages, Freshness, Provenance and Graphify passed on that merge SHA.
- [x] **N2O-2026-001** — integrate the owner-provided N₂O Core, Knowledge Loop, ChatGPT Sources and Project Instructions documents via PR #142 (merge SHA `c307b7e3940e9051843befd5f77acfeaef66c91d`). Three owner-provided source documents were byte-for-byte matched to the uploaded files. Existing `AGENTS.md` and `LOOP.md` remain shared engineering foundations.
- [x] **SOURCES-2026-001** — refresh upstream architecture inspiration and license/revision triage via PR #144 (merge SHA `99c5d673cf239a1cd86b67aca101a3c0773f3761`). XERJ, Memvid, RAG-Anything, Graphify, Superpowers and durable-execution references are research candidates, not adopted dependencies.
- [x] **VOSK-2026-001** — store Vosk Small Russian 0.22 archive in `models/vosk/` via PR #143 (merge SHA `12ce75cdd6e14ae7752643bb20fc5421b177c26e`): 46,236,750 bytes, SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`, metadata, checksum, upstream README and Apache-2.0 license notice. Acquisition workflow is read-only/manual. `ship=false`; no runtime activation.
- [x] **DEP-2026-001** — consolidate dependency/lock and document-parser improvements from PRs #124/#126 into PR #145 (merge SHA `88d230fc92fef5b884af699345fd010291107693`). Universal `uv.lock`, FastAPI/Uvicorn/pypdf pins, Python 3.12/3.13/3.14 matrix and `asyncio.to_thread` document parsing; all PR-head Quality/Gateway/Graphify/Provenance/Dead Code checks passed.
- [ ] **VOSK-2026-002** — run same-audio RU golden-set comparison against current whisper.cpp baseline; record WER/CER, RTF, cold/warm latency, peak RSS/PSS, CPU and microphone/noise results on target hardware. No model-quality claim before measurement.
- [~] **LANDING-V2-2026-001 — OWNER-PRIORITY DELIVERY (2026-11-13).** Replace the previous frozen/post-landing deferral: the owner now requires a fully working local-first aLandi workstation as the priority product outcome. Canonical scope and phased acceptance are recorded in section K below. Reuse/cross-link existing UI-PROMO-001, FUNCTIONS-DETAIL-001/002, MENU-001…011, UR-080/117…119/226/251…264/290…291, V016-163…172/186/189, LAUNCH-239…256/269…279, VOICE-004…018, SLM-001…005, SF/AB/AW, GATE-001…006, AUDIT-002/004/005/008/010, FIX-006/007, EV-AGENT-RUN-STORE-001, VOSK-2026-001/002, and issue #111. Do not create a parallel backlog. Current active implementation work must converge to main; at steady state retain at most one active product/landing PR.
- [~] **GRAPHIFY-UI-2026-001** — PR #131 static UI Surface bridge now separates exact selectors (0.65 heuristic score) from token-overlap candidates (0.25), distinguishes classList mutations from DOM selection, and removes nearest-previous-function ownership guesses. Graphify pilot passed on code/test HEAD `c79e983a57d6cc2b87a9296a1334e6d6ed5b3479`; final PR Quality #41981955002 was still running at this checkpoint. Static inference is not browser-computed style or AST-level proof.
- [~] **CLEANUP-2026-001** — stale PRs #124, #126, #132, #133 and #141 were closed after their replacements landed. PR #127 was closed after replacement PR #146 passed exact-head Freshness/Quality/Provenance and carried the complete registry. Keep #125/#128/#129/#130 as isolated Draft/HOLD research workstreams, #131 as active V2, #134 as prototype HOLD. GitHub connector currently exposes no direct branch-delete action; do not claim those branches are deleted. Recheck unique commits before any future deletion.
- [ ] **OWNER-GATE-2026-001** — keep Issue #111 open for owner-controlled ruleset, live host, deployment, target-hardware, native device and credentials gates. Do not close it merely to clear the queue.

**Artifact policy:** preserve only concrete project-needed code/artifacts with exact upstream URL/revision, checksum, independent license review, provenance manifest, storage rationale and rollback. Do not bulk-copy whole inspiration repositories, datasets or unselected model weights. Small approved model candidates may be stored in-repo when size/license/evaluation value justify it; keep them disabled until target evaluation and owner acceptance.


## G. Owner task delta — 2026-11-05: repository hygiene, independent audit and corrective engineering

**Основание:** явное поручение владельца от 2026-11-05. Это продолжение единого реестра, не отдельный backlog. Пункты ниже не закрываются по факту чтения документации: для завершения нужны live evidence, точные commit SHA и проверяемые результаты.

### G1. Завершить ранее начатую безопасную очистку Git

- [~] **HYGIENE-001** — получить полный live inventory branches, tags, open/closed PRs и default branch; различить merged, superseded, abandoned, active research, backup и protected refs.
- [~] **HYGIENE-002** — для каждого кандидата на удаление проверить merged PR / equivalent tree or commit ancestry, unique commits, exact SHA, open PR/issue/release/workflow references и последний полезный код/документы.
- [~] **HYGIENE-003** — подготовить reviewable allowlist с доказательствами и отдельный preserve-list; не удалять main, default, active V2, future/research, backup/archive или незавершённые направления.
- [ ] **HYGIENE-004** — выполнить удаление только подтверждённых merged/superseded refs после проверки доступного безопасного delete API и owner authorization; если инструмент не поддерживает branch deletion, оставить кандидатов нетронутыми и выдать точные команды/список.
- [ ] **HYGIENE-005** — после cleanup повторно сверить branch/PR queue, защиту main, unique commits и ссылочную целостность; записать точный результат и rollback feasibility.

### G2. Независимый инженерный аудит — роль External Debugger / Architecture Reviewer

- [~] **AUDIT-001** — зафиксировать audit baseline (main SHA, active PR heads, dependency/lock/workflow versions) и scope; не смешивать состояние main с экспериментальными ветками.
- [~] **AUDIT-002** — проследить end-to-end продуктовые потоки UI → browser storage → API/gateway → adapters/providers → persistence/search/memory; проверить контракты, state transitions, data scope и graceful failure.
- [~] **AUDIT-003** — проверить Python backend: async/sync boundaries, cancellation/timeouts, subprocess lifecycle, concurrency/locking, retries/idempotency, validation, resource bounds, typing, error handling и current API/framework idioms.
- [~] **AUDIT-004** — проверить HTML/CSS/vanilla JS client: module boundaries, event/listener lifecycle, DOM safety/XSS, storage migrations, race/stale responses, accessibility, responsive behavior, browser compatibility и duplicated state.
- [~] **AUDIT-005** — проверить все integrations/connections: auth and scopes, CORS, provider isolation, secrets/logging, external API contracts, timeouts/rate limits, fallback behavior, failure recovery и tests with mocks.
- [~] **AUDIT-006** — проверить dependency/lockfile/CI/workflow supply chain: pinned immutable actions, permissions, caches/artifacts, Python/Node matrices, freshness policy, licenses/provenance и reproducibility.
- [~] **AUDIT-007** — проверить архитектурное единство: canonical source of truth, naming/API/schema compatibility, duplicated implementations, stale docs, contradictory status claims, feature flags и boundaries between V1/V2/research/prototype.
- [~] **AUDIT-008** — провести security/privacy pass: trust boundaries, prompt injection, local file/archive parsing, path traversal, SSRF, SQL/XSS, authorization, deletion lineage, sensitive data retention and abuse/resource exhaustion.
- [~] **AUDIT-009** — подготовить независимый report с FACT / HYPOTHESIS / PROPOSAL, severity P0–P3, evidence (path/line/test/SHA), impact, reproduction, confidence, owner decision needed и acceptance gate. Не объявлять «независимого агента» — аудит выполняется текущим исполнителем в отдельной роли.

### G3. Исполнение подтверждённых улучшений

- [~] **FIX-001** — преобразовать подтверждённые audit findings в дедуплицированные задачи этого реестра/существующих канонических workstreams; назначить приоритет, scope, acceptance и rollback.
- [~] **FIX-002** — исправлять минимальными вертикальными slices в разрешённых ветках; сначала регрессионный тест, затем patch; не менять больше одной крупной архитектурной переменной за цикл.
- [~] **FIX-003** — после каждого slice выполнить focused tests, статические/security checks по затронутой поверхности и полный обязательный exact-HEAD CI перед merge.
- [~] **FIX-004** — интегрировать в main только V1-совместимые, проверенные и одобренные изменения; PR #131 и Future/Research/Draft workstreams не вливать целиком.
- [ ] **FIX-005** — после merge перепроверить post-merge main SHA/checks и обновить существующие canonical state/orientation/log записи; deployment и live-host verification остаются отдельными gates.

### G4. Целостность и функциональная приёмка

- [~] **INTEGRITY-001** — проверить связность навигации/документации/реестров и отсутствие потерянных owner requirements; подтвердить ссылки, anchors, IDs, workflow manifests и machine-readable state.
- [ ] **INTEGRITY-002** — выполнить regression matrix основных сценариев чата, истории, проектов, импорта/экспорта, настроек, provider routing, tools/research, memory/RAG, voice и document intake с точным разделением mocked CI и live runtime.
- [~] **INTEGRITY-003** — проверить schema/data compatibility и миграции browser storage / SQLite / API payloads; проверить backward compatibility и failure recovery без повреждения пользовательских данных.
- [~] **INTEGRITY-004** — подтвердить согласованность UI claims, feature flags, backend capabilities, tests, docs и release state; убрать/исправить только доказанные противоречия.
- [~] **INTEGRITY-005** — зафиксировать непроверяемые без owner device/credentials/host условия (iPhone/VoiceOver, VPS/Tunnel/Ollama, OAuth, real providers, target hardware) как OPEN, не подменяя их CI.

**Execution order:** HYGIENE inventory/allowlist → AUDIT baseline and subsystem passes → evidence-backed findings → FIX slices → INTEGRITY regression and final report. Безопасную read-only работу можно вести параллельно; destructive cleanup, deploy, secrets/permissions и runtime activation остаются отдельными protected gates.


### G5. Evidence-backed findings and progress — 2026-11-05

- **AUDIT-FIND-001 / P1 / VERIFIED FIXED:** chat cancellation could leak the single inference semaphore slot before upstream headers; fixed in PR #147, merged `3f37a8166fcbf89c5392f985e290be48ea27ef6a`. Exact-head Gateway/Quality/Graphify/Dead Code passed.
- **AUDIT-FIND-002 / P1 / VERIFIED FIXED:** assistant raw HTML could manufacture delegated app actions in the full-message viewer; fixed in PR #148, merged `4fbf16aad3f741159654950e0260aaf717653291`. Exact-head Chromium/Quality/Graphify passed.
- **AUDIT-FIND-003 / P1 / VERIFIED MITIGATION:** Pyodide `js` module no longer receives page `globalThis`; empty null-prototype `jsglobals` and E2E configuration regression added in PR #148. This is not full sandbox/Worker isolation.
- **AUDIT-FIND-004 / P2 / PATCHED IN PR #149:** pypdf provenance source version reconciled from 6.4.1 to runtime pin 6.21.4; Vosk provenance corrected to repository-hosted evaluation artifact with LICENSE/SHA256SUMS.
- **AUDIT-FIND-005 / P2 / PATCHED IN PR #149:** three CI workflows migrated from Node 22 to the previously reviewed Node 24 baseline from PR #126; exact-head CI pending.
- **AUDIT-FIND-006 / P2 / HYPOTHESIS:** document extraction uses `asyncio.to_thread` without a dedicated parse-job semaphore. Default-off feature and size/archive/page bounds reduce exposure; reproduce memory/concurrency behavior before implementation.
- **AUDIT-FIND-007 / P2 / OPEN:** Pyodide remains on the browser main thread; long-running snippets can block the tab. Design a dedicated Worker with termination, bounded output and restricted globals.
- **AUDIT-FIND-008 / P2 / OPEN:** CDN supply-chain review remains; Tailwind URL is unversioned and external scripts lack SRI. Compare SRI/self-hosting without adding an unmeasured build system.
- **AUDIT-FIND-009 / P2 / PARTIAL:** 143 branch refs enumerated; five behind-only candidates and one PR #133 tree-equivalent branch rechecked. No deletion executed because connector lacks branch-delete operation; other branches remain preserve/unverified.
- **AUDIT-FIND-010 / INFO / REVIEWED:** Bandit B608 and Semgrep SQL/script/SRI warnings from PR #147 artifact were inspected against source; false positives documented in the phase-1 report. No scanner rule was disabled or weakened.

### G6. Follow-up tasks from phase-1 report

- [ ] **FIX-006** — move Pyodide execution to a dedicated Worker or isolated execution surface; add timeout/termination, memory/output bounds and tests proving no page-origin access. Do not claim complete sandbox before this gate.
- [ ] **FIX-007** — design a bounded document-extraction concurrency gate when the feature is enabled; add cancellation, queue saturation and memory-pressure regressions.
- [~] **FIX-008** — browser asset inventory recorded in `docs/REPOSITORY_HYGIENE_RU.md` §15: Tailwind Play CDN is mutable and officially development-only; marked 18.0.14 and DOMPurify 3.4.16 are versioned but lack SRI. Static Tailwind build + local/versioned vendor assets recommended. No guessed hashes or runtime/build changes; implementation and exact-head visual regression remain OPEN.
- [ ] **HYGIENE-006** — delete only the verified allowlist after an authorized branch-delete API/UI is available; preserve every branch HEAD SHA and recheck open references immediately before deletion.
- [ ] **AUDIT-010** — finish subsystem review of provider routing, browser storage migrations, voice/audio lifecycle, RAG deletion lineage, V2 candidate slices and native device/runtime behavior.

**Phase-1 report:** `docs/REPOSITORY_DEBUGGER_AUDIT_PHASE1_2026-11-05_RU.md`. This is a verified partial report, not closure of the full audit.


## G. Browser persistence integrity and follow-up debugger findings — 2026-11-05

- [~] **AUDIT-FIND-011 — P1 localStorage recovery/data integrity.** Confirmed in `index.md`: project JSON parse/shape failures were silently reduced to an empty list without preserving raw data; partially invalid chat arrays could drop records without backup; `persistChats()` wrote chat list and current ID separately without rollback; create/delete/import project operations could partially persist while showing success. PR #150 branch `fix/browser-storage-recovery-atomicity-20261105` implements raw recovery backups, fail-closed behavior when backup creation fails, direct download of original raw payload, rollback for chat/current and project/chat writes, in-memory rollback, success-state gating, import bounds and four Chromium regressions. **Status: IMPLEMENTED IN PR #150; exact-head Quality (7 jobs), Freshness, Provenance and Graphify PASS. PR remains open/unmerged; owner review/merge decision pending.**
- [~] **FIX-009 — transactional browser persistence.** Exact-head CI and injected-quota Chromium rollback regressions pass on PR #150 HEAD `0c2cf9f15c9cef6053487e5f01adadcb8917115e`. Before closure, complete manual diff/call-site review and owner merge decision; keep localStorage keys/version compatibility unchanged.
- [ ] **AUDIT-FIND-012 — P2 conditional FTS5 secure-delete capability.** `MemoryManager` only enables the FTS5 `secure-delete` option on SQLite 3.42.0+; on older SQLite the capability flag is false but logical deletion still proceeds. The capability is not exposed through health/status APIs. Deleted FTS entries may remain in index segments until merge; logical deletion is not forensic erasure. Runtime SQLite version and feature enablement on the target host are **UNVERIFIED**. Reference: https://www.sqlite.org/fts5.html#the_secure_delete_configuration_option.
- [ ] **FIX-010 — surface FTS5 deletion capability.** Report SQLite runtime version and FTS5 secure-delete capability in a health/diagnostic surface; document the deletion guarantee accurately; test supported and unsupported SQLite versions before enabling MemoryGraph/RAG on a host.
- [ ] **AUDIT-011 — target-host SQLite/runtime verification.** Verify the actual VPS Python-linked SQLite version, FTS5 availability, feature flags and deletion behavior; do not infer from CI's Python runtime.

- [x] **AUDIT-FIND-013 — P1 settings-profile partial-write / false-success.** Fixed on PR #150 code/test HEAD `c1103a74cc0774380b98728fd0e5698c1afb64db`: raw snapshots, reverse-order restore, active-chat rollback and success gating. Two Chromium quota-injection regressions pass.
- [x] **FIX-011 — transactional settings-profile import.** Profile keys and active-chat state are rolled back if any required localStorage write fails; API-key storage is untouched and existing key names/schema are preserved.
- [x] **AUDIT-FIND-014 — P2 fire-and-forget chat-setting persistence.** Fixed on PR #150 exact code/test HEAD `54e4858ed19fb4fa1daaa55444121ff2f8c5f780`: a shared mutation helper snapshots chat fields and raw mirrored storage keys, then rolls back both on any failed write. Search/processing/multi-agent modes, skill preset/goal/output/custom fields and agent-team controls now use the helper.
- [x] **FIX-012 — common chat-setting mutation rollback.** Two Chromium quota-injection regressions exercise mode/mirror rollback and skill/agent configuration UI rollback; existing storage names/schema remain unchanged.

**PR #150 exact-head evidence:** setter rollback code/test HEAD `54e4858ed19fb4fa1daaa55444121ff2f8c5f780`; Quality #42059797507 (7/7 jobs), Freshness #42059797510, Provenance #42059797913 and Graphify #42059797551 PASS. Freshness main-checkpoint/live-queue substep skipped by PR condition. Earlier recovery `0c2cf9f...`, docs `d43b16c...` and settings-profile `c1103a7...` checkpoints also passed their recorded gates. PR remains open/unmerged; main SHA `8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`, deployment and target-host runtime unchanged.

## H. Owner priority reset and recurring requirements — 2026-11-07 (append-only)

Owner's latest direction is an execution-priority override, **not cancellation** of any existing task. Keep all earlier work open at its existing status unless fresh evidence closes it.

- [x] **OWN-001 — OLEDUE fast handoff / principles integration (P0).** The normative Core, Knowledge Loop and concise LOOP method are explicitly linked from OLEDUE/AGENTS/orchestrator and now from LOOP itself. Owner task-intake and single-index routing are in main via PR #156. Fresh-session ORIENT-002 was exercised in this session: OLEDUE first, one batched live-state orientation, latest request routed to UI-PROMO-001 / PR #154, exact head/checks inspected. ORIENT-002 is recorded complete in the Master Registry. Keep handoff short; do not add mandatory bulk reads or another backlog.
- [x] **PAGES-001 — GitHub Pages publication truth (P0; VERIFIED on current main, 2026-11-08).** Current `main` is `bf039f887e29137b627b06fc2bb107c2793d6b69`. GitHub-managed Pages deployment #42410162803 completed SUCCESS on this exact SHA. Quality run #42410163178 completed FAILURE overall only because the separate published release-contract sentinel still forbade the owner-approved `functionsMenu`; the Chromium job itself passed the built app, published root, canonical landing content and landing Chromium (8/8) on the exact SHA. PR #174 repairs only that stale contract. Production remains GitHub-managed Pages/Jekyll; no duplicate deploy workflow or custom builder is needed.
- [~] **UI-PROMO-001 — owner UI backlog §§8.1–8.17 and later requirements (P1; IN PROGRESS / PARTIALLY PUBLISHED).** Canonical scope remains `docs/V1_UI_FINALIZATION_RU.md` plus existing MENU/UI/E2E/MOBILE IDs; deduplicate and enrich, do not create another backlog. §8.8 icon-first message actions are merged via PR #157; §8.1 sidebar swipe-to-close is merged via PR #161 at `094e249860b651166d4d1029f175e97a5cea2345`. §8.17 adjustable readability controls are **IMPLEMENTED, MERGED and PUBLISHED** via PR #166 at main SHA `c4f23e03f563d03213eb87002863da630fc8b833`: message font size 14–22 px, line-height 1.4–2.0, and standard/high-contrast color scheme; users access them in the root app's global gear/settings → “Читаемость текста”. Exact PR-head Quality #42368514164 (7/7) and Graphify #42368514210 passed; post-merge Pages #42372745873 and main Quality #42372746360 passed, including 116 Chromium tests and canonical root/landing exact SHA checks. Remaining UI scope stays OPEN. PR #154 remains stale/diverged (base `f323b6f339d454dad6e820a4074fa230acc7b6df`, head `6ca47522d7d6998916b1b01931c217d8b7e76c75`); prior Quality #42349173942 failed 17 E2E + 1 flaky and Freshness #42349173878 failed. **Do not merge #154 as-is or weaken tests.** Reconcile only useful slices against current main, preserving #147/#148/#150; repair real behavior/selector failures and rerun exact-head Quality/Freshness/Provenance/Graphify. #131 remains a selective workbench, never wholesale merge. Native iPhone Safari/VoiceOver/manual visual acceptance remains open.
- [x] **PLAN-001 — unified orchestrator navigation (P0).** Keep one canonical entrypoint (OLEDUE) pointing to N₂O principles, LOOP, external-source inventory INTEL, roadmap, decisions, state and Master Task Registry. Avoid new parallel backlogs; synchronize project state/orientation only when materially changed. **Implemented:** `PROJECT_ORCHESTRATOR_RU.md` was created and merged in PR #156 at main SHA f6f3896bf3989f9c88e3764f848b84e90b601a65; OLEDUE and AGENTS point to it, with principles core/knowledge loop, INTEL, roadmap, decisions, evals, provenance and one task register.
- [~] **SRC-001 — grouped external-source research and artifact acquisition (P2).** Continue `INTEL.md` and the existing source-selection method. **Progress (2026-11-07):** reviewed the owner's full named list against official upstream repositories/README/license/docs/release notes; recorded exact branch HEADs, declared code/model licenses, capabilities, security/privacy constraints and triage decisions in `INTEL.md` and `docs/OPEN_SOURCE_TRIAGE_RU.md`. Candidates include two distinct, ambiguous Flint repositories; DashBeam; img2threejs; ArchiveBox; SearXNG; Ponytail; changedetection.io; LocalSend + protocol; MiroFish; Edge-Drop; Craft Anything; Agent Lightning; Datalab Marker/Surya; diagram-design; HarnessRouter; Sound Center; PocketPal AI; and sammyZi/pdf-tools. **No code, model, binary, dataset or Skill was downloaded, installed, copied or activated.** Next: run bounded baseline comparisons for SearXNG, Marker/Surya and changedetection.io only when prioritized; review HarnessRouter contracts separately. For each acquisition: exact upstream revision, source URL, separate code/weight/data license, SHA-256, provenance, target fit and storage policy. Do not bulk-mirror restricted/oversized weights or activate unapproved runtime; require explicit review and owner approval before downloads or adoption.
- [ ] **HYGIENE-007 — verified obsolete-code and branch/PR cleanup (P3).** Identify exact dead/duplicate code through references, dependency/call-site review, tests and architecture evidence; remove only after rollback review. Selectively consolidate useful PR work into #131 or main; preserve backup/orientation/active-scope/evidence-bearing work. No branch/PR/history deletion without explicit owner approval and fresh reference checks.
- [ ] **CHAT-001 — continuity and failure-resistant checkpointing (P1).** Owner reports recent ChatGPT chats can hang/error, then history becomes inaccessible and the work must be discarded. Mitigate what the repository/workflow can control: compact durable checkpoints containing task ID, branch/HEAD, changed artifacts, exact checks, blockers and next step; avoid repeated context requests, duplicate implementations and oversized handoffs. Do not claim this fixes the ChatGPT client/history failure itself; investigate it as a separate product/client issue only with reproducible evidence.
- [ ] **OWNER-REQ-001 — task capture invariant.** Before execution, search canonical register for each newly stated owner goal; add a new stable task ID or enrich existing entry. Maintain original goals and relative order even when higher priority work temporarily supersedes them. No silent dropping, duplicate backlog, or status upgrade without evidence.

**Current owner order (preserves every lower-priority goal):** OWN-001 / ORIENT-002 complete → PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`; Pages build/deploy PASS, main Quality has two E2E failures and live root/landing exact-SHA smoke remains pending → active bounded follow-up PR #173 repairs them; exact code/test Quality 113/113 + Graphify PASS, final state-head checks and owner merge approval required → then resume UI-PROMO-001, SRC-001 bounded evaluations, CHAT-001, HYGIENE-007 and all remaining registry tasks. Closed non-merged PR #125/#131/#152/#154/#155 scopes remain preserved; no unapproved download/install/runtime adoption.

## Owner override — 2026-11-07: Functions menu and Research Studio

> **MENU-002 / MENU-003 evidence:** owner override D-022 restored exactly Agents/structured analysis, Deep Research and Skills/task profile; integrations/connectors remain absent until real registry/status/permission contracts exist. PR #169 merged and exact PR Quality #42408172737 passed 113/113 Chromium.
> **MENU-010 evidence:** Research Studio is retired entirely by the owner. PR #169 removed the Research Studio surface and entrypoints; exact PR Quality #42408172737 passed 113/113 Chromium.
> **UI-PROMO-001 evidence update:** aServi is a dedicated first-party settings section; provider exclusivity, explicit connection and no silent fallback are implemented. Research Studio/server-memory graph are retired. Owner override D-022 restores exactly three Functions actions (Agents/structured analysis, Deep Research, Skills/task profile); the menu is not removed. Main public root + `/landing/` were Chromium-verified on exact merge SHA `bf039f887e29137b627b06fc2bb107c2793d6b69`. Final neutral-stop-control screenshot/accessibility review remains open under UR-310.


## I. Owner execution contract — 2026-11-08 (append-only)

This owner override changes execution order and release discipline; it does not cancel or silently complete earlier registry goals.

- [~] **MAIN-ONLY-001 — one durable product baseline.** Keep `main` as the only durable product baseline. Use temporary PRs only for bounded exact-head verification and merge promptly after all required gates pass. Audit every open PR; port compatible value; do not merge stale/conflicting/draft/future/V2 work wholesale. Close superseded PRs only after a file-by-file reconciliation and a recorded reason. **Acceptance:** no completed slice remains parked; every remaining open PR has a current owner-approved disposition and explicit next action.
- [~] **SYSTEMS-MAP-001 — compact system/subsystem inventory.** Maintain `docs/ALANDI_SYSTEMS_MAP_RU.md` as the concise canonical catalog of systems, implementation surfaces, methods and maturity. Cross-link `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for code-level detail. **Acceptance:** each listed system has source paths, current method, maturity and a clear unverified boundary; no second backlog is created.
- [~] **AGENT-CONTRACT-001 — effective English operating instruction.** Keep `AGENTS.md` short and operational: live orientation, one active slice, exact-head verification, source quality, main-first delivery, durable recording and product invariants. `NOW.md` is the sole first-read checkpoint and owner-request/action journal. **Acceptance:** a fresh session can identify the next safe action from repository state and one checkpoint.
- [~] **CONTINUITY-001 — step-level durable evidence.** Record every owner prompt verbatim and every material stage in `NOW.md`; update the current checkpoint and next action in that same file. Record branch/PR/HEAD, changed files, check IDs/results, what was not checked, rollback and next step. Do not store chat transcripts or private reasoning. **Acceptance:** no material step needs to be repeated after a new chat.
- [~] **SRC-002 — recurring thematic source batches.** Continue from the existing `INTEL.md` inventory (310 distinct URL references / 183 GitHub repositories at the 2026-11-08 count). Review 8–15 high-signal sources per thematic batch and occasionally run a cross-cutting sweep. Prefer primary sources; record revision, date, license, evidence, resource fit, decision and limits. Preserve prior research and distinguish source-validated from accepted/implemented.
- [~] **ARTIFACT-001 — controlled source/model acquisition.** Owner authorizes acquisition of useful tools and model artifacts. For each selected item verify upstream revision, separate code/weights/data/voice license, provenance, SHA-256, size, security, privacy and target hardware. Keep manifests and verification scripts in Git. Do not put weights in the GitHub Pages source tree: Git LFS is unsupported by Pages. Use a model cache/registry or governed GitHub Release asset where legal and within limits. Do not bulk-download unrelated or oversized assets.
- [~] **PAGES-002 — post-integration release verification.** Preserve the official GitHub-managed main-push Pages path. After every integration verify the Pages deployment and canonical published content against the exact merge SHA; do not add duplicate deployment workflows or claim VPS health from Pages checks.

**Current execution slice:** PR #173 merged at `bf039f887e29137b627b06fc2bb107c2793d6b69`. Pages #42410162803 and public root/landing exact-SHA Chromium checks passed. Main Quality #42410163178 is partial only because release-contract job #128517290166 still forbids the owner-approved Functions menu. The bounded follow-up `fix/pages-functions-contract-and-state-20261108` repairs that stale sentinel, adds backdrop-dismissal E2E and refreshes the state checkpoint. Owner explicitly authorized merging open PRs after final exact-head required checks pass; PR #174 is the only open PR. Continue issue #111, UI-PROMO-001, SRC-001, CHAT-001, HYGIENE-007 and every remaining registry task.

## J. Live PR queue reconciliation — 2026-11-08

Live GitHub now shows **one open PR, #174**, and one open issue, #111. PR #174 is the bounded sentinel/state-audit follow-up; no other PR is open. PR #173 was squash-merged at `bf039f887e29137b627b06fc2bb107c2793d6b69`; do not reselect it as active work.

- **#173 — MERGED.** The aServi pending-probe cancellation and mutually-exclusive settings E2E repair are in main. Exact PR Quality #42409661645 (113/113 Chromium), Freshness #42409661506, Graphify #42409661481 and Provenance #42409661536 passed. Post-merge Pages #42410162803 passed; Quality #42410163178 verified public root and landing but exposed a stale release-contract assertion.
- **#168/#171/#172 — CLOSED NON-MERGED.** Their unique disposition is recorded in the PR bodies and VOLLEY_LOG; preserve accepted work in the registry.
- **#152 — CLOSED NON-MERGED / VOICE QUEUE DEFERRED.** Keep bounded speech queue and selected-text playback as future scope; port only after queue/cancellation tests and current aServi setup.
- **#154 — CLOSED NON-MERGED / DIVERGENT V2.** Do not merge wholesale; extract only individually accepted components after current #147/#148/#150 contract review.
- **#155 — CLOSED NON-MERGED / SELECTIVE ROADMAP + SOURCE REVIEW.** Roadmap and selected reference-only source manifests were ported; preserve remaining source/task IDs.
- **#131 — CLOSED NON-MERGED / V2 WORKBENCH.** Preserve design and research; no V2 shell or worker runtime wholesale promotion.
- **#125 — CLOSED NON-MERGED / FUTURE AGENT STUDIO.** Preserve deferred Skill Factory/Agent Builder and worker capability design; no runtime activation.
- **#111** remains owner-controlled and cannot be closed by repository CI alone.


## Owner override — 2026-11-08: Functions menu capability slice (D-022)

- [x] **FUNCTIONS-DETAIL-001 / MENU-002 / MENU-003:** Owner explicitly requests a concise Functions section containing Agents/structured analysis, Deep Research and Skills/task profile. PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2` and exact PR Quality #42408172737 passed 113/113 Chromium. Deep Research selects Thorough processing mode only; web-search breadth stays orthogonal. Agent mode is the current four-stage same-model pipeline, not a swarm. Skills are prompt/profile guidance only and grant no permissions. Integrations/connectors remain hidden until real registry/status/permission contracts exist. Research Studio remains retired.
> **PR #169 evidence:** focused RU/EN and Chromium coverage for the owner-approved Functions menu and each action passed exact PR Quality #42408172737 (113/113); merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`. After PR #173, public root + `/landing/` exact-SHA smoke and landing Chromium 8/8 passed on `bf039f887e29137b627b06fc2bb107c2793d6b69`; the separate published release-contract sentinel failed only because it still forbade the approved `functionsMenu`, which PR #174 corrects.


## J. Owner directive — orchestration, main-only delivery, systems inventory and source loop (2026-11-08)

Append-only owner intake; enrich existing orientation/UI/source lanes and preserve all earlier goals.

- [~] **ORIENT-004 / MAIN-ONLY-001 — operational handoff and PR completion.** Replace inefficient orchestration with a compact main-first Session Sync Capsule: live main SHA, PR queue (base/head/status/draft), issues, exact-head checks, Pages status; select task from owner intent + canonical register. One active bounded implementation lane. Merge only exact-head green compatible scope; after merge run main integrity/quality and end-to-end Pages checks; close superseded/parking PRs only after preserving value and recording reason. Append compact checkpoint at each material step to VOLLEY_LOG and synchronize orientation/state records only when facts change. No dangling completed PRs.
- [~] **SYS-MAP-001 — whole-product systems/subsystems/methods inventory.** Use existing docs/ALANDI_SYSTEMS_MAP_RU.md as canonical map (no duplicate catalog); trace every listed subsystem to source files, contracts, tests, maturity and dependencies. Review methods against current primary sources and the existing technique register; promote replacements only with evidence/baseline/rollback. Record gaps and versioned changes.
> **SRC-001 evidence continuation:** continue the existing ~300-source `INTEL.md` inventory in thematic batches and occasional cross-cutting sweeps. Capture reviewed source IDs, primary URLs, exact versions, findings, counter-evidence, license/provenance, applicability, and resulting accepted/rejected/deferred decisions in existing triage/technique/decision/eval destinations. No indiscriminate bulk downloads or install.
- [~] **INSTR-001 — concise English executor contract.** Replace AGENTS.md with the compact owner-focused operating contract: main-only durable baseline; oledue/ORIENTER live sync; one canonical register; sequential bounded delivery; exact-head verification; immediate authorized merge and main/Pages post-check; durable Volley checkpoints; research/license/security/provenance gates; no speculative runtime.
- [~] **PAGES-LIVE-001 — verify auto-publication.** After each authorized main integration, confirm GitHub-managed Pages deployment on the exact merge SHA and cache-busted public root/asset version. Diagnose/repair existing auto-publish mechanism if broken; do not infer live deployment from build success.
- [~] **ACQUIRE-001 — governed acquisition.** For useful models/tools/microtechnologies/plugins/skills, assess concrete task fit, source/version, license, checksum, provenance, storage, budget and target hardware. Download into repository only where size, redistribution rights and repository policy permit; model weights must use suitable governed asset storage, not Pages source tree/Git LFS. Pilot before runtime adoption.
- [~] **FUNCTIONS-DETAIL-002 — owner-directed Functions panel detail.** Preserve three truthful entrypoints (Agents/structured analysis, Deep Research, Skills/task profile) while expanding their details: current runtime behavior vs roadmap; role/workflow, model/resources, tools/permissions; research effort/web orthogonality; skill lifecycle/profile/output. Modal backdrop blur and focus/escape/close lifecycle are explicit acceptance. Integrations remain hidden absent real registry/status/permissions. Research Studio stays retired.
- [~] **PR-QUEUE-001 — consolidate the live PR queue into main.** Owner's explicit 2026-11-08 instruction: merge every currently open PR after its final exact-head required checks pass. Live queue is currently only PR #174; merge it when green, then verify main Quality and Pages on the exact merge SHA. Closed/stale/HOLD PRs #125/#131/#152/#154/#155/#168/#171/#172 are not to be merged wholesale; selectively preserve compatible unique work and keep their deferred tasks in the canonical register.

**Execution order:** (1) stabilize control-plane/instruction and reconcile queue; (2) main integrity + Pages live check; (3) systems map/source technique review; (4) Functions/Agents/Research/Skills UI slice; (5) continue thematic source batches and governed acquisition; (6) continue remaining roadmap tasks without dropping them.


## J.2 Functions detailed-menu implementation checkpoint — 2026-11-08 (PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`)

> **FUNCTIONS-DETAIL-001 evidence update:** the owner-directed Functions top-level menu remains exactly three truthful actions. Agents opens its existing bounded four-stage same-model panel; Deep Research opens a dedicated settings/navigation panel (Quick/Thorough effort, Web breadth status + open existing Web settings, structured-pipeline status + navigate to Agents, Deep Research 2.0 roadmap-only); Skills opens chat-scoped task profiles. PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`; exact PR Quality #42408172737 passed 113/113 Chromium. Post-merge Quality #42410163178 verified public root + /landing/ exact SHA and landing Chromium 8/8; its separate release-contract job failed only on a stale forbidden `functionsMenu` marker, now corrected by PR #174.
> **Functions E2E evidence:** on 390×844, all three panels opened, backdrop blur was verified, Thorough changed, Web settings opened, Research navigated to Agents and closed without stale overlay. Exact PR Quality #42408172737 passed 113/113 Chromium. New 320px keyboard/focus coverage is pending exact-head CI.
> **Backdrop lifecycle follow-up:** PR #174 adds outside-click dismissal for Settings and Functions dialogs, plus focus restoration to the Functions trigger. A dedicated Chromium test covers both paths; exact final-head verification is pending.
> **Canonical specifications preserved:** `docs/AGENT_FUNCTIONS_MENU_INFORMATION_ARCHITECTURE_RU.md`; `docs/AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md`; `docs/AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md`; `docs/DEEP_RESEARCH_2_CURRENT_STATE_AUDIT_RU.md`; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md`. These remain SPECIFIED/research artifacts; they do not assert runtime implementation or permissions.


## J.3 Branch research reconciliation and source intake — 2026-11-08

> **PR #131/#125 research disposition evidence:** preserved high-value agent workforce, Deep Research, source selection/autonomy, orchestration, local Source Vault/multimodal conversion, voice/audio, governance, model bakeoff, Agent Platform Blueprint, Skill Factory/Agent Builder and worker capability/Skill safety artifacts in canonical docs.
> **INTEL provenance evidence:** added 103 distinct URL references absent from the prior inventory as candidate rows, each linked to its origin research doc. Upstream recheck remains pending; source presence is not adoption.
> **Duplicate catalog disposition:** kept `docs/AGENT_RESEARCH_CATALOG_RU.md` out of main as a duplicate source catalog; its 88 URL references already exist in INTEL. INTEL remains the single source register.
> **Graphify implementation evidence:** ported `scripts/graphify_ui_surface.py`, its unit test and workflow integration. It builds deterministic CSS/DOM/JS selector relations with provenance and conservative inferred-edge scores; it does not prove browser-computed styling.
> **Repository policy evidence:** ported the PR #131 SECURITY.md reporting policy and selectively updated Pages title/description while retaining the Jekyll metadata plugin and upstream archive exclusions.
> **PR #131/#125 disposition remains:** V2 shell/runtime code, model weights and agent workforce runtime are not merged in this source-doc tranche; their acceptance remains OPEN in the canonical registry/system map.


## J.4 AgentRun state persistence prototype — 2026-11-08 (PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`; prototype only)

> **AgentRunStore maturity evidence:** preserved the PR #131 SQLite `AgentRunStore` and offline tests as a bounded PROTOTYPE: idempotent run/task creation, versioned transitions, typed bounded metadata, leases/fencing, retry budget, cancellation and event journal.
> **Agent runtime boundary evidence:** exact PR #169 Gateway #42408172642 passed. No HTTP route, model/tool invocation, worker scheduler, permission grant, sandbox, approval engine or multi-host runtime is wired; storage-only prototype does not satisfy AB-001…AB-005 runtime acceptance.
- [~] **EV-AGENT-RUN-STORE-001** — evaluation definition exists; backup/restore, retention, multi-host, recovery semantics and adversarial runtime tests remain OPEN.


## J.5 Post-merge main Quality and published UI contract — 2026-11-08

> **PAGES-LIVE-001 evidence — main publication recheck:** PR #173 merged at `bf039f887e29137b627b06fc2bb107c2793d6b69`; Pages deployment #42410162803 SUCCESS. Main Quality #42410163178 Chromium job #128516358225 passed the built app, live root revision, canonical landing content and landing Chromium (8/8). This confirms public root + `/landing/` on the exact merge SHA.
> **PAGES-LIVE-001 follow-up:** separate job #128517290166 failed because `.github/workflows/quality-sentinels.yml` still listed `id="functionsMenu"` as forbidden. PR #174 changes the contract to require the three owner-approved menu actions and continue forbidding Research Studio, legacy provider selection and removed sidebar controls.
> **PR queue snapshot (2026-11-08):** live GitHub shows one open PR #174 (this bounded sentinel/state-audit follow-up) and no other open PRs. Closed non-merged #125/#131/#152/#154/#155/#168/#171/#172 remain preserved as deferred research/task scope; do not wholesale merge them.
> **Issue #111 owner/environment gates remain open:** repository ruleset/settings; private VPS/Tunnel/Ollama and authenticated completion; permissioned RU/EN/TH RAG corpus; real microphone/device voice and document artifact/license/resource gates; fail-closed sandbox; scoped deletion/WAL/backup handling; optional OAuth/Drive credentials/PKCE/scopes.
- **Next:** finish the bounded sentinel repair, backdrop-dismissal slice and exact-head checks; in parallel continue independent checklist/system/source audits. Merge PR #174 once all required exact-head checks pass under the owner's explicit 2026-11-08 instruction.


## J.6 Full checklist and supply-chain audit — 2026-11-08

- [x] **REGISTRY-003** — inventory and normalize stable task IDs across the master registry and append-only addendum. As of 2026-11-08: main 599 unique IDs; addendum 128 unique IDs; REGISTRY-002 is the only cross-file shared ID; no duplicate IDs remain within either file and no unnumbered checklist rows remain in this addendum. Source-description reconciliation continues under REGISTRY-002.
- [ ] **REGISTRY-002 source reconciliation:** candidate source drift is recorded in the main registry section H. Current count deltas after source corrections: USER_REQUEST 113 open/partial vs 112 UR open/partial IDs (+1 candidate); V016 aligned 27/27; Landing UX 24 vs 23 UX open/partial IDs (+1 candidate); V1 30 source open/partial vs 37 registry open/partial; LAUNCH 46 source open vs 51 registry rows; VOICE2 17 source open/partial vs 8 VOICE2 IDs, with overlap against VOICE/VOICEAUDIT/LAUNCH. CHATSET and GUIDE now align after retirement updates. V1/LAUNCH/VOICE still need content-level mapping before status changes.
- [x] **VOICE-DEDUP-001** — completed source crosswalk: VOICE2-106…112 → VOICE-004…010 (VOICE-TRACK-003…009); VOICE2-113 → VOICE-TRACK-010; VOICE2EXT-080…087 → VOICE-EXT-001…008; USER126-254…258 → USER125-254…258. The distinct VOICE-011…018 and AUDIO-GEN-001…009 tasks are now atomized in the master registry; source references are preserved as cross-links, not duplicate tasks.
> **Owner override reconciliation evidence:** V1 §§16–17 and Landing UX backlog now reflect D-022; CHATSET-111 and GUIDE-553 are explicitly retired with Research Studio and the server-memory graph respectively.
- [x] **ACTION-PIN-001** — 14 repository workflow files contain 62 direct external references; all 62/62 are full 40-character SHAs. Main Integrity job #128516358240 passed the action-pinning step.
- [ ] **ACTION-TRANSITIVE-001** — the pinned `skills/exercise-toolkit` reusable workflow revision `ebf43bb96882683e03e667184c6445ed4c8074e6` has 14 nested mutable action references across three workflows. `start-exercise.yml` grants workflow-wide `contents/actions/issues: write`, although only `disable_workflows` needs `actions: write`, `create_exercise` needs `issues: write`, and `update_readme` needs `contents: write`; `finish-exercise` uses contents+issues write in one job; `find-exercise-issue` uses issues read. Local pin checker does not recurse into upstream dependencies. Replace/fork with reviewed local equivalents or pin nested dependencies and reduce permissions before closing #111.
> **Issue #111 governance evidence:** rulesets API returned `[]`; branch-protection endpoint returned 403 to the integration, so classic protection is unverified. Owner must inspect/configure main ruleset/settings; CI cannot complete the live host, target hardware, native device, permissioned corpus or credentials gates.
- **Next:** keep PR #174 exact-head checks green; continue REGISTRY-002 source crosswalk and issue #111 transitive workflow/governance review in parallel. PR #174 is not merged; separate owner authorization is required.


## K. Owner directive — complete aLandi workstation and launch scope (2026-11-13)

**Decision / priority:** this is now the primary owner-approved product programme. The previous idea that voice, durable agents, local coding, full RAG, real connectors and advanced ingestion may be deferred beyond a frozen V1 is superseded for this product goal. The objective is not a marketing-only landing page: the published browser application, local/private runtime, tools, data services and operator runbook must work end-to-end.

### K.1 Required product surface

1. **Owner-designed UI — REQUIRED.** Finish the existing owner-requested UI specification in docs/V1_UI_FINALIZATION_RU.md (including §§8.1–8.17 and later amendments), the current responsive/mobile/accessibility requirements, and the remaining UI-PROMO-001, MENU-*, V1-*, LAUNCH-269…279 and MOBILE-* checks. Keep the root browser application and /landing/ marketing page distinct; both must be verified after publication.
2. **Functions menu — REQUIRED, four independent entry points.** The top-level Functions surface must expose four separate panels/menus: **Deep Research**, **Agents**, **Skills**, and **Connectors**. Each opens its own menu and exposes only actions with a real handler, current permission, data scope, status, error/cancel path and tests. Each panel must contain a coherent group of related capabilities; no dead switches, fake progress or roadmap items represented as working.
3. **Deep Research — REQUIRED.** Deliver a real bounded research workflow: source discovery and refresh, configurable search breadth/effort, iterative gap resolution, claim-to-source/evidence validation, citations, contradiction handling, resumable state where justified, report/artifact export and visible run status. Preserve the distinction between current implementation and any staged rollout.
4. **Agents and orchestration — REQUIRED.** Replace blueprint-only / single-model-pipeline claims with a genuine runtime when advertised: typed task/agent contracts, actual model/tool invocation, bounded DAG/fan-out, queue/backpressure, per-agent model/Skill/capability and data scopes, policy/approval gates, budgets/deadlines, cancellation propagation, idempotency, retries, checkpoints/recovery, event journal and adversarial/golden evaluations. The UI must show truthful live states (queued/running/waiting for approval/completed/failed/cancelled), timestamps, progress derived from real events, resource use, outputs and safe logs. Never expose hidden chain-of-thought. AgentRunStore alone is a storage prototype, not an agent runtime.
5. **Skills — REQUIRED.** Keep chat-scoped instruction profiles and add the real Skill lifecycle required by SF-* / AB-*: authorized source intake, manifest/schema, provenance and separate code/weight/data licenses, injection/security scan, tests/evals, human review, versions/diff, scope, enable/disable, import/export and rollback. Imported content/scripts stay inert until separately approved; a Skill does not grant permissions.
6. **Connectors — REQUIRED.** Add a genuine registry and independent panel for real integrations: connection status, provider/API identity, minimum OAuth/API scopes, encrypted credential lifecycle, explicit consent, action handlers, quotas/timeouts, revoke, deletion/index cleanup and audit. Start with high-value owner-approved connectors (GitHub/repositories and file/cloud sources); do not advertise unconnected providers or fake switches. OAuth/Drive groundwork is not a completed connector.
7. **Local coding workspace — REQUIRED.** Enable user-selected local files/folders through a supported browser/companion path, visible workspace tree, read/write with consent, diff/preview, bounded edit/test workflow, safe artifact export and recovery. A real OS-level sandbox is a ship gate before arbitrary code/CLI execution. **Own GitHub repositories — DESIRED / next connector slice:** read, inspect, branch/PR workflows and later write operations with narrowly scoped GitHub authorization; do not make repository write access implicit.
8. **Voice — REQUIRED and installed on the target host.** Install and validate whisper.cpp and the selected ASR model artifact (the Vosk Small Russian archive is an existing reference artifact, not proof of activation); select and install a compatible TTS voice/runtime such as the verified Piper baseline or a better measured alternative; include VAD/endpointing and the necessary audio transport. Ship editable microphone transcription, explicit send, speech playback, voice selection, stop/cancel, and the agreed conversational turn-taking/interruption/echo path. Test RU/EN/TH on actual target devices. Pin exact binaries, model/voice artifacts, licenses and SHA-256; measure WER/CER, RTF, first-transcript/audio latency, interruption latency, CPU/RAM/PSS and failure recovery.
9. **Full RAG and knowledge retrieval — REQUIRED.** Promote the current FTS5/lexical baseline to a verified production-quality hybrid retrieval pipeline as justified by evals: ingestion, parsing, chunking, metadata, scoped lexical + vector retrieval, fusion, optional reranking/query expansion, evidence lineage, exact citations, deletion/retention and project/user isolation. Evaluate against a permissioned RU/EN/TH corpus with Recall@k, MRR/nDCG, citation correctness, latency and memory. Do not assume a vector DB or archived Memvid/RAG-Anything snapshot is already adopted.
10. **Documents, scanners, parsers and converters — REQUIRED.** End-to-end intake and conversion for the agreed formats, including PDF, DOCX, XLSX, TXT, Markdown, CSV, JSON, EPUB/books, HTML/web pages and image/audio/video metadata where supported; OCR for scanned documents; page/chapter/offset provenance; safe archive handling; bounded size/time/concurrency; preview, export and user approval. Add web-page/site scanners and book/source parsers with robots/terms, rate and copyright constraints. Format support is declared only after real fixtures and tests.
11. **Modes and feature logic — REQUIRED.** Build and test a compatibility/dependency matrix for processing modes (Quick/Thorough), Research, Agents, Skills, tools, connectors, RAG, Coder, files and Voice. Verify all combinations, precedence, on/off transitions, state persistence, concurrency, cancellation, error recovery and no silent provider fallback. Controls must accurately explain which functions are enabled and why.
12. **Efficiency — NON-NEGOTIABLE.** The ordinary request path must remain direct and lightweight. Do not prepend an unconditional planner, multi-agent chain, embedding model or helper-model call to every request. Use one main model by default; call specialized small models only when deterministic/task routing predicts measurable benefit (classification, extraction, summarization, reranking, etc.). Agent orchestration is invoked only for tasks that need it. Share model residency where possible, bound concurrency and context, use cache only for semantically safe eligible results, and compare each addition to a main-only baseline.
13. **Cache, observability and N₂O — REQUIRED IN MAIN.** Retain and complete the distinct L0 browser cache, L1 inference prefix/KV reuse and L2 exact-response cache; validate scope/invalidation/bypass and never cache tools, dynamic research, streams, multimodal, failed or partial outputs. Bring real request/run traces, status events, latency, token/model routing, cache hit/bypass, errors, resource metrics, audit/redaction and N₂O evidence/knowledge workflow into the canonical main line. Observability must not log raw prompts, secrets, file/media bodies or hidden reasoning.
14. **Operator runbook — REQUIRED DELIVERABLE.** Produce a tested step-by-step guide from account/server/domain selection and registration, through OS/hardware inspection, model/binary/weight downloads, API/database setup, private network/Tunnel, service installation, credentials, browser configuration, first completion, RAG, coding workspace, connectors and voice tests, to backup, updates, troubleshooting and rollback. Include exact current links, commands, expected outputs, storage/download sizes and cost/resource notes. Owner-only account registration, payments, credentials, SSH and confirmations remain explicit user actions; never ask for secrets in chat.

### K.2 Required model / runtime / storage decision pack

Before pinning or downloading production artifacts, create one evidence-backed inventory containing: role (main/helper/ASR/TTS/embedding/reranker/OCR), exact model/repository and immutable revision, quantization, format, context/token limits, weight and auxiliary-file sizes, total disk footprint, expected RAM/VRAM/PSS, serving runtime/API, concurrency, license for code/weights/voice/tokenizer/data separately, provenance, SHA-256, install command, update path, rollback, and benchmark results on the intended target hardware.

- Compare the main local model with at least two credible current alternatives, including a model whose refusal behavior is suitable for the owner's intended legitimate use. Record uncensored/open-weight claims precisely: do not promise “zero refusals”; do not add an undisclosed application-level refusal layer. Preserve security checks for permissions, tool execution, privacy and external side effects.
- Evaluate a small helper-model lane against main-only baseline. Keep it off unless a task-class-specific eval proves better quality/latency/resource/cost; no helper may authorize actions or approve its own output.
- Inventory every external API/provider and every local API/endpoint, quotas, key custody, privacy and price. Inventory databases/storage by purpose (browser localStorage/IndexedDB, gateway SQLite/cache/RAG/AgentRun, and alternatives such as PostgreSQL/pgvector or a dedicated vector store only if measured need justifies them). State which databases are actually installed, which are optional, and exact volume/backup/restore requirements.
- Record the total model + speech + OCR + retrieval artifacts that the owner must download, with per-artifact and aggregate sizes. Never put large weights in the GitHub Pages source tree or Git LFS; use a governed model/artifact store with license and checksum checks.

**Current fact boundary:** qwen3.5:4b is an example in the existing VPS guide, not yet an owner-approved final model selection. The current repo has whisper.cpp/Piper code paths that depend on separately installed binaries and model/voice artifacts; feature flags are off by default. models/vosk/ contains a 46,236,750-byte Vosk Small Russian reference archive (ship=false), not an activated voice runtime. Current RAG is SQLite FTS5 + lexical concept graph, not full hybrid vector RAG. The local exact-response cache and browser cache exist; full operational observability and AgentRun runtime are not yet proven live. No VPS/Tunnel/Ollama host is currently verified.

### K.3 Priority and execution order

**Owner execution override (2026-11-13):** current instruction is direct delivery to `main` with zero open PRs. This stricter instruction supersedes the P0 phrase “main plus at most one active PR”; do not create a new PR unless the owner changes this directive.

**P0 — Recover one coherent main baseline and remove PR debt.** Reconcile every currently open PR against live base/head/diff/dependencies and exact-head CI. Preserve useful unique work, fix actual regressions, selectively merge only compatible green slices, and close stale/draft/failed/duplicate PRs after recording dispositions. Target steady state: main plus at most one active PR for the current landing/product slice. Keep main the only durable baseline; never wholesale-merge stacked or failed work.

**P1 — Finish the owner-designed user experience and four-panel Functions navigation.** Complete UI requirements; make each of Deep Research, Agents, Skills and Connectors open its own truthful, usable panel with independent states, handlers and regression tests. Reconcile the Functions Drawer / Notebook / project navigation / Browser Local workspace work into one coherent interface.

**P2 — Freeze the real stack through evidence, not guesses.** The source-pinned candidate set is specified in docs/AGENT_MODEL_BAKEOFF_RU.md, docs/MULTIMODAL_MODEL_STACK_RU.md, models/artifacts.manifest.json and models/runtime-stack.lock.json: owner-supplied uncensored Qwen3.5-4B primary candidate; conditional embedding/reranker; Whisper + Qwen3-ASR challenger; Silero VAD; Piper RU/EN; Tesseract RU/EN/TH. Auxiliary model/runtime artifacts are downloaded and SHA-verified in GitHub Actions: external cache run #43420046411 (6,054,442,377 bytes; includes the current runtime lock) and Ollama package run #43418126506 (7,728,830,475 bytes), 13,783,272,852 bytes combined. The owner-supplied primary checkpoint remains excluded. This is acquisition, not target-host installation. Production selection still requires template/license review, same-host RU/EN/TH evals, API/database integration, memory budget and rollback evidence. Gateway dependencies are pinned in pyproject.toml/uv.lock; the runtime-only Python cache (uv cache + pinned uv bootstrap + lock/manifest/checksums) was downloaded and verified in GitHub Actions run #43423610986 (81,549,321 bytes; Ubuntu 24.04 x86_64, CPython 3.12/3.13/3.14). This is a platform-specific cache artifact, not a target-host install. OS packages and target services are not installed. Thai TTS remains deferred pending a permissive voice/base license.

**P3 — Build the real execution layer.** Deliver AgentRun runtime, scoped capability/tool registry, durable queue/state/events, approvals, sandbox and live status UI; implement mandatory local-file coding workspace and the desired GitHub repository connector. Prove cancellation, isolation, recovery and adversarial behavior.

**P4 — Deliver complete knowledge and ingestion.** Full RAG quality pipeline, source/evidence viewer, documents/books/web scanners, OCR, parsers and converters with exact provenance, deletion and real-format fixtures.

**P5 — Make voice work end-to-end on the actual target.** Install Whisper/ASR and TTS voice artifacts, VAD/audio pipeline and UI; verify RU/EN/TH, interruption/cancellation and actual mobile/browser hardware. No “implemented” status from code-only tests.

**P6 — Complete connectors, mode-combination logic, efficiency, cache and observability.** Test the full mode matrix; prove default direct path and conditional helper/agent routing; bring cache, metrics, run events and N₂O operational evidence into main without increasing every request's cost.

**P7 — Release and owner guide.** Complete exact-head CI and regressions; under the current owner instruction deliver directly to main with zero PRs, verify main and public Pages content on exact SHA; separately verify live VPS/Tunnel/Ollama, installed weights/APIs/databases, authenticated model response, coding workspace, connector, RAG, documents and voice. Publish the tested owner runbook with exact links and commands.

### K.4 Completion gate — no “done” by appearance

The programme is complete only when:
- Every advertised function has a real handler/runtime, permissions/data scope, state transitions, success/error/empty/cancel path, logs/metrics appropriate to privacy, and deterministic regression coverage.
- All required model/voice/OCR/runtime artifacts are installed on the intended host with verified revisions, licenses, checksums, disk/RAM and benchmark evidence.
- Core end-to-end scenarios pass on the real configured environment: chat; Deep Research with validated citations; real AgentRun with tool use and live events; Skill lifecycle; real connector action + revoke; local-file coding in sandbox; repository read workflow; RAG retrieval/citation/deletion; document/book/web/image intake and conversion; RU/EN/TH voice; cache hit/bypass and restart/recovery.
- Toggle/mode matrix passes with no hidden fallback, no privilege escalation and no unconditional extra-model/agent overhead on ordinary chat.
- Required cache/observability/N₂O code and operational controls are merged into main.
- GitHub Pages publication and VPS/runtime are independently verified. Merge ≠ deployment; Pages ≠ VPS.
- Final runbook lets the owner reproduce a first successful server-backed completion and each mandatory capability without guesswork. Any unverified device/host/provider condition is explicitly listed, not concealed.

**Live intake snapshot 2026-11-13 (verified before the four-panel UI slice):** main = 1760cb0391bd0257737bf72db4ea4c5e01d2dde4; open PRs = 0; issue #111 remains open and owner-gated. PR #185/#184 merged; #176 research ported; #175/#178/#179/#180/#182 closed with dispositions. Provider-bound PKCE security foundation is implemented. Model/runtime artifacts #43420046411/#43418126506 total 13,783,272,852 bytes and are SHA-verified; Python runtime cache #43423610986 succeeded (81,549,321 bytes, runtime-only Ubuntu 24.04 x86_64 cache for CPython 3.12/13/14). Pages #43423609329 SUCCESS; Quality #43423610395 in progress. These are downloaded artifacts, not target-host installation. GitHub App connector is not yet implemented.


### K.5 Current delivery status — 2026-11-17

This is the single 15-point progress view for LANDING-V2-2026-001. Status is evidence-bounded; update this table in place after each material milestone. Do not create a parallel backlog.

| # | Canonical requirement | Current status | Remaining acceptance evidence |
|---:|---|---|---|
| 1 | K.1.1 Owner-designed UI | **IMPLEMENTED / CHROMIUM + PUBLISHED-SITE VERIFIED; NOT OWNER-ACCEPTED; NATIVE DEVICE OPEN** | Verified: project-only chat list/filter/Back/project-scoped New Chat/active-chat preservation and personal/project + memory-scope header capsule; Memory IA Global/Personal separation, provenance and confirmed promotion preserving private copy; one-tap voice menu + Escape/focus return; 16px mobile text-entry controls with pinch zoom preserved; global prompt blank-default/save-clear and settings-profile round-trip; project Sources manager (scoped upload/extraction/index/catalog, SHA-256 dedup, bounded preview/delete). Exact Quality #44006105936 passed 143 built-app Chromium tests + 1 published-site smoke on `c7ac7ab976ae5333010b72370b6f1fec28c9c655`; Graphify #44006105833 and Pages #44006104480 passed; Gateway #44004983557 passed on backend `f69a999`. Project Sources stores extracted text/metadata only; original bytes are not retained and Gateway flags remain off by default. Remaining: compact mobile hierarchy, navigation/accessibility/forms across 320/360/390/768/1024/1440 px, physical iPhone Safari/VoiceOver, and owner visual acceptance. |
| 2 | K.1.2 Functions menu | **PARTIAL / OWNER IA EXPANSION APPROVED** | Keep four primary panels (Deep Research, Agents, Skills, Connectors); build shallow, discoverable catalogs with multiple real options per panel, capability/status labels, keyboard/touch hierarchy, no duplicate effort/method controls; roadmap choices remain disabled until handlers/evals exist (K.6.17). |
| 3 | K.1.3 Deep Research | **IMPLEMENTED / VERIFIED BASE METHOD; METHOD CATALOG SPECIFIED** | Preserve ResearchTrace, source IDs and evidence APIs. The existing multi-step evidence report now has a distinct per-chat method, deterministic legacy migration, Research-panel selector, method provenance and separate AgentRun dispatch; exact main 6117ceb6d3360bc0b47ef3179d73536f854cebf4 Quality #43970945532 passed 139 built-app Chromium tests and 1 live-site smoke. Add other methods only after method-specific tool, source, eval and artifact contracts. |
| 4 | K.1.4 Agents and orchestration | **IMPLEMENTED / PARTIAL; CHAT FLOW AND STATUS E2E VERIFIED; HOST RUNTIME DISABLED** | Existing single/team_review/coder_review SQLite DAG remains feature-off, one worker/model slot, serial inference. Owner approved Plan 1 main-chat context/status and Plan 2 Deep Research separation. K.6.17 specifies versioned Agent Library, configurable roles/personas/knowledge/skills, multiple allowlisted mini-models with resource-aware scheduling, user-directed two-agent dialogue, reusable scenarios, bounded simulation, explicit browser/file/DB/converter grants, safe versioned learning and run timeline. Advanced capabilities remain SPECIFIED/DEFERRED; no swarm, self-training, unrestricted tools or parallel model execution claimed. |
| 5 | K.1.5 Skills | **IMPLEMENTED BASELINE / FACTORY LIFECYCLE OPEN** | Expand menu to skill catalog, create/import from sources, validate, test, review, versions/rollback, dependencies and per-run grants; imported skills remain inert and cannot grant tools/permissions by themselves (K.6.17). |
| 6 | K.1.6 Connectors | **OAUTH FOUNDATION / CONNECTOR NOT IMPLEMENTED** | Provider-bound PKCE exists; read-only GitHub App registry, short-lived credentials, real handlers, revoke and audit remain |
| 7 | K.1.7 Local coding workspace | **PARTIAL / BROWSER WORKSPACE IMPLEMENTED; AI CODER SPECIFIED** | Preserve user-selected File System Access + diff/approval/recovery; add permissioned AgentRun adapter, project-scoped repository access, isolated execution/test runner, model selection and local↔server handoff only after sandbox gates. Offline package and multiple model bundles remain separately gated (K.6.14/K.6.17). |
| 8 | K.1.8 Voice | **ARTIFACTS VERIFIED / INSTALL NOT STARTED** | Retain Whisper/Vosk/Piper/VAD maturity boundaries; add optional translator + licensed RU/EN/TH grammar/lexicon components to the modular offline package; physical-device accuracy/latency and Thai voice gaps remain open (K.6.18). |
| 9 | K.1.9 Full RAG | **PARTIAL** | SQLite FTS5 + lexical baseline exists; hybrid vector retrieval, fusion/reranking and permissioned RU/EN/TH eval remain |
| 10 | K.1.10 Documents, scanners and converters | **PARTIAL / LOCAL TEXT INTAKE IMPLEMENTED; COMPLEX CONVERTERS OPEN** | aNoteBooki now stores notes, URL references without fetching, and explicitly selected TXT/Markdown/CSV/JSON/HTML as extracted text with SHA-256, parser version and provenance. Limits: 10 files/import, 2 MB/file, 8 MB/batch; original bytes are not retained. Project/chat attribution is explicit and cross-project chat options are filtered; theme follows app preference. Remaining: PDF/Office/EPUB/book parsers, OCR, safe web capture, tables/images, transformations, retrieval, claim/citation evidence links, chat handoff and sync/recovery. |
| 11 | K.1.11 Modes and feature logic | **PARTIAL / SAFE DEFAULT MIGRATION IMPLEMENTED; COMBINATION MATRIX OPEN** | New chats, legacy records without explicit opt-in and imported records without `searchMode` now default to model-only; explicit per-chat `normal`/`more` preferences remain. Request path omits web tool schemas unless the chat explicitly enables web access. Remaining: audit all pairwise mode combinations, legacy exports/profiles, provider/offline compatibility, cancellation/retry and token/latency overhead with exact request-body tests. |
| 12 | K.1.12 Efficiency | **SPECIFIED / MEASUREMENT OPEN** | Keep progressive disclosure; add model registry and hardware-aware selection over multiple installed compact models, capability/eval/latency metadata, prompt/context budgets and queue scheduling; measure quality, RAM/VRAM, latency and cost against direct baseline (K.6.17). |
| 13 | K.1.13 Cache, observability and N₂O | **PARTIAL** | Cache layers and N₂O operating documents exist; production traces, redacted metrics, event audit and invalidation/bypass evidence remain |
| 14 | K.1.14 Operator runbook | **SPECIFIED / NOT HOST-VERIFIED** | `docs/PRE_LAUNCH_STACK_RU.md` §8 is the owner-only action list. Actual host install, backup/restore, first completion, troubleshooting and rollback must be exercised |
| 15 | K.2 Model/runtime/storage decision pack | **UPSTREAM RECHECKED / LOCK REFRESH PENDING** | FastAPI 0.163.0 newer but held by seven-day cooldown until 2026-11-21; Pydantic 2.14.3 is an eligible lock candidate vs 2.14.1; pypdf 7.1.0 already current. whisper.cpp 1.9.5, Piper 1.8.0, Tesseract 5.5.4, Ollama 0.40.16 and OpenShell 0.1.8 are latest stable. Final model/resource selection remains open |

### K.5 routing — Architecture 2.0 review OR-2026-11-17-003

The 18 suggestions are intake notes, not a second backlog or implementation authorization. They are attached to the nearest existing K.5 rows below; update those rows in place when evidence or implementation changes. Do not promote speculative technology/version claims without current upstream, compatibility, license, resource and baseline checks.

| Architecture review item | Existing K.5 home | Disposition / boundary |
|---|---|---|
| 1. Infrastructure / hosting | #14 Operator runbook; #15 runtime decision pack | Keep GitHub Pages/Jekyll as canonical static UI. Cloudflare Pages/Tunnel/systemd details belong to the runbook only if the owner selects that hosting path; no host migration or VPS action implied. |
| 2. Backend router / fallback | #11 Modes and feature logic; #14 Operator runbook | Keep routing explicit and privacy-preserving. No silent browser→local→cloud fallback or paid provider activation. |
| 3. Frontend / Vite / PWA | #1 Owner-designed UI; #2 Functions menu | Continue existing HTML/CSS/JS + Jekyll. Vite/Cloudflare migration is deferred under the V1 boundary; PWA/service-worker work only if a concrete offline journey requires it. |
| 4. Model runtime / embeddings | #15 Model/runtime/storage decision pack; #12 Efficiency | Compare against current locked/runtime baseline before any replacement or additional server. No model/runtime upgrade by name alone. |
| 5. Chat/context/token budget | #11 Modes and feature logic; #12 Efficiency | Keep model, effort, search scope, AgentRun strategy and context grants orthogonal; measure token/context overhead before optimization. |
| 6. Memory / storage / sync | #1 Owner-designed UI; #13 Cache, observability and N₂O | Memory IA is UI work in #1; storage/sync conflict policy, tombstones, WAL and deletion safety stay gated in #13. No cross-device sync by assumption. |
| 7. Agent runtime / jobs | #4 Agents and orchestration | Reuse the existing SQLite AgentRun contract; one worker/model slot and feature-off host boundary remain until worker, recovery and resource gates pass. |
| 8. Tools / sandbox | #4 Agents; #7 Local coding workspace; #10 Documents/converters | Explicit grants and isolated workspace only. No shell, arbitrary filesystem, network or side-effect tools by default. |
| 9. Skills | #5 Skills | Progressive loading, provenance, validation, evals and inert-by-default imports; no separate skill subsystem. |
| 10. Deep Research | #3 Deep Research | Preserve ResearchTrace and method separation; add methods only with distinct source/tool/eval/artifact contracts. |
| 11. RAG / multilingual retrieval | #9 Full RAG | Keep FTS5 baseline; compare trigram/vector/RRF candidates on permissioned RU/EN/TH corpus with Recall@5/MRR and citation correctness before adoption. |
| 12. Connectors / OAuth | #6 Connectors | Existing PKCE foundation remains; real connector handlers, scopes, revocation and audit stay in this row. |
| 13. Documents / OCR / converters | #10 Documents, scanners and converters | Add bounded Sources intake and parser/OCR/converter capabilities here, with artifact/license/resource and permission gates. |
| 14. Voice / translation | #8 Voice | Keep ASR/TTS and RU/EN/TH translation/grammar components optional and separately evaluated; no duplicate ASR engines without bake-off. |
| 15. Local AI Coder | #7 Local coding workspace | Extend the existing browser workspace only after project-scoped access, sandbox, diff approval and test-runner gates. |
| 16. Offline package | #7 Local coding workspace; #8 Voice; #15 Runtime decision pack | Modular optional package, checksums/licensing/resource gates; not a prerequisite for landing UI finalization. |
| 17. Performance / observability | #13 Cache, observability and N₂O; #12 Efficiency | Cache embeddings/tools where safe, not private chat responses; add redacted traces/metrics and measured budgets. |
| 18. N₂O control plane | #13 Cache, observability and N₂O; #14 Operator runbook | Permissions, budgets, audit and operator procedures remain in existing governance/runbook scope; no duplicate control plane. |

**Critical path for landing finalization:** K.5 #1 and its existing K.6 UI acceptance first. The architecture intake does not add new UI dependencies or authorize Vite, Cloudflare migration, runtime replacement, provider fallback, new model artifacts, sandbox activation or paid services.
**Verified in this checkpoint:** exact main parent `6117ceb6d3360bc0b47ef3179d73536f854cebf4`. Quality #43970945532 SUCCESS across all 7 jobs, including 139 built-app Chromium tests and 1 published-site Chromium smoke; Graphify #43970945690 SUCCESS; Pages #43970944970 SUCCESS. Fresh uncached public root returned HTTP 200 with exact revision `6117ceb6d3360bc0b47ef3179d73536f854cebf4`. Plan 2 method separation and its migration/ResearchTrace/AgentRun routing contract are verified; AgentRun retains its partial/feature-off boundary. Gateway was not rerun because no backend source changed; latest Gateway #43932615910 remains the previous backend pass. Freshness/Provenance will run on this direct-child state refresh. Host activation, target Ollama, sandbox, offline runtime and parallel inference remain unverified.

**Artifact policy:** keep model weights out of the GitHub Pages source tree and Git LFS. Use pinned Actions artifacts as temporary staging, then move required, licensed files to an owner-controlled durable store or verified target host. The owner-supplied primary checkpoint remains excluded.

## K.6 Binding owner acceptance contract — OR-2026-11-15-005

**Authority:** this section captures the owner's detailed 2026-11-15 requirements. It expands K.1.1–K.1.14 and K.2 without creating a second backlog. K.5 remains the sole 15-point progress/status table. If an older UI note or panel description conflicts with this owner override, K.6 wins. A visible control is not a working capability.

### K.6.1 Release outcome and scope
- Deliver one coherent aLandi application at canonical Pages root `/`: https://dorpnay.github.io/skills-github-pages/. Every authorized push to `main` publishes the current application. No separate marketing/presentation page is part of the deliverable.
- Remove the redundant tracked `/landing/` Jekyll route (`landing/index.html`) and its stylesheet (`assets/css/landing.css`) after auditing inbound links. Keep the root app and Pages publication path only.
- Finish the existing 15-point programme in `main`, excluding the largest/owner-supplied primary model. Auxiliary artifacts require current version, license, provenance, checksum, compatibility, storage and resource checks.
- Prepare repository/UI/runtime before asking the owner for host-only actions. At completion, produce one concise runbook with exact commands, expected results, rollback and only owner-controlled actions from PRE_LAUNCH_STACK_RU.md §8.
- Keep the static client useful without hosted AI for local data/offline-safe operations. Remote inference and external services are optional. Never claim browser code can silently read arbitrary files or run a local model without a compatible runtime.

### K.6.2 Function and mode logic — highest product priority
- Define one capability/mode model with independent dimensions: effort/budget (Fast/Thorough), web scope (Off/Standard/Expanded), execution strategy (single model/specialist workflow/multi-agent/sandboxed coding), task skill, model/provider, context/data scope and output preference. No selector may silently change another dimension.
- Build a compatibility matrix for pairs and combinations: persistence, defaults, provider support, offline behavior, concurrency, cancellation, retries and error state. Disable invalid combinations with a concise reason; never silently rewrite them.
- Keep direct main-model path as default. Routing/classification must be lightweight and measurable. Do not prepend large instructions, all skill bodies, all tool schemas or broad web results to every request.
- Capability status must come from the real runtime: available, configured, running, waiting for API/approval, completed, failed, cancelled or offline/unavailable. No decorative animation as progress.
- Every button action is one click/press. Sound/voice controls must not require double-click. Standardize pressed/disabled/loading/success/error/cancel behavior and prevent duplicate submissions.

### K.6.3 Agents, multi-agent execution and Coder
- Agents is not one hard-coded pipeline. Offer several genuinely working, selectable approaches. Evaluate: one specialist agent; sequential role team; parallel specialist subagents with isolated context; coordinator plus focused worker threads; reviewer/verification pass; sandboxed coding agent. Expose only methods whose runtime, model routing and permissions exist.
- Configure role/profile, model per worker where supported, skills, sources, project/chat/file scope, allowed tools, read/write/execute/network permissions, approval policy, token/time/output budgets, concurrency, retry, pause/resume/cancel and artifacts. A role name or saved blueprint is not an independent worker.
- Real orchestration requires durable run state, task graph/dependencies, isolated worker context, bounded fan-out, queue/leases/checkpoints, retries, event stream, cancellation, audit and recovery. Sandbox must isolate compute from credentials and use a narrow workspace manifest. No broad host filesystem/shell grant by default.
- Reuse proven harness concepts: explicit harness loop, scoped tools, progressive skills, controlled sandbox/workspace, externalized state/checkpoint/rehydration, isolated subagents, tracing and evals. Compare OpenAI Agents SDK, Agents API, LangChain Deep Agents and Cloudflare/Temporal patterns; choose only components compatible with existing stack, license, offline/privacy and host constraints.
- Coder requires an actual bounded workspace: explicit repository/file selection, read/write scope, isolated sandbox, command/test allowlist, patch preview/review, status, logs and artifacts. Until host sandbox/connector are active, Coder may only propose code from supplied context. OpenShell Actions assets are staged, not installed.

### K.6.4 Deep Research — separate product surface
- Deep Research must be its own menu and workflow, not a mixture of Agents, generic search and unrelated Settings. Offer distinct methods with separate purpose and bounded budget: focused lookup; thorough multi-step report; comparative research; academic/literature review; fact-check/source audit; Notebook/source-collection research.
- A real run decomposes the question, creates a plan, searches and reads sources, stores metadata/evidence excerpts, deduplicates, scores relevance, detects gaps/contradictions, validates claim-to-citation links and synthesizes a versioned report. Persist state and resume after interruption.
- Delegate to isolated subagents only for independent aspects. One worker for simple lookup; parallelize comparisons/independent domains only when benefit exceeds overhead. Share a global query/read/token/time budget and stop on saturation or adequate evidence.
- Show sources, publication/capture dates, citations, confidence/limitations, progress and next actions. Export Markdown/PDF or save to Notebook/project. A plan, spinner, blueprint or same-model four-stage pipeline is not Deep Research execution.

### K.6.5 Skills, web search and prompt/context efficiency
- Skills are versioned, portable, reviewed packages with description, provenance, license, compatibility, tests/evals, security review, enable/disable, version pin and rollback. Imported content/scripts are inert until approved; a Skill alone never grants tools/data permissions.
- Use progressive disclosure: compact name/description/trigger metadata initially; load full instructions and support files only when selected/relevant. Tool registry entries stay compact; full schemas are loaded only for enabled tools in that run.
- Web search is lightweight and optional, not a mandatory prompt preamble. Keep search scope orthogonal to effort. Search only when user intent/mode requires it; use short query hints, bounded relevant passages, deduplication and URL/date/provenance. Do not send full pages/private files to model context without need and consent.
- Provide explicit boundaries for web, Wikipedia, academic indexes, code/API repositories and curated local packs. Treat external content as untrusted; defend against prompt injection, SSRF, malicious documents and poisoned code samples.

### K.6.6 Sidebar, projects, chats and creation/edit flows
- Expanded sidebar has two visually balanced rectangular sections of equal dimensions: Projects first, Chats second. They may differ by surface/color/active emphasis, not geometry or hierarchy.
- Projects is collapsed by default. Its create-project row remains permanently visible directly below the header even while collapsed. When expanded, it looks like a project row but uses a distinct color/surface.
- Chats is expanded by default. Its create-chat row remains permanently visible as the first item, including while scrolling. Do not show chat status indicators in collapsed/compact sidebar.
- Selecting a project filters Chats to only that project's chats and displays a clear back arrow/action to return to all chats. Selected project context is clear in sidebar and chat header.
- Creating a project opens a dedicated create-project menu/modal, not the edit form. Editing an existing project is available only through its right-side three-dot contextual menu, consistent with chats. Project/chat settings share one interaction grammar.
- Menus and text panels must not move list items, overflow viewport or obscure content. Use anchored/collision-aware menus, bounded scrolling, focus management and correct dismissal.

### K.6.7 Unified visual system, buttons, status and layout
- Unify page, sidebar, headers, modals, panels, menus, forms, buttons, text, icons, animation, dimensions and motion. Define shared design tokens/components; remove duplicate/conflicting overrides rather than layering CSS patches.
- Dark-first palette starting point from current app: background #0A1220, text #E8EEFC, muted #A8B4C7, blue #60A5FA, teal #2DD4BF. Coder contrast check: 16.13:1 primary text, 8.94:1 muted, 7.37:1 blue, 10.07:1 teal, 7.37:1 dark text on blue button; all five selected pairs pass WCAG AA. This is a measured starting palette, not a pasted generic theme.
- Establish coherent typography, spacing, radius, border, shadow, icon size and control height. Headings, sliders, fields and helper text follow one hierarchy. Minimize repeated copy; use familiar icons with accessible names/tooltips where appropriate.
- Text buttons follow one standard; icon-only buttons require accessible names/tooltips. Unify activation, hit target, focus, loading, disabled, pressed, selected and destructive confirmation states.
- Fix blur/backdrop, click-through, overlay stacking, focus trap/restoration, scroll lock, sticky headers, safe areas, viewport sizing and z-index collisions. No page/menu drift when text menus open.
- Status belongs near active task/output and objectively distinguishes model thinking, API wait, tool execution, approval, success, failure and cancellation. Keep idle indicators out of left sidebar; show only when expanded/relevant.
- Chat header title clearly identifies conversation and project scope. Memory controls are quieter/compact; memory panel uses concise labels, clear grouping and minimal copy.
- Verify keyboard, screen reader, reduced motion and responsive behavior at 320/390px, tablet and desktop. Aim for 44×44 CSS px touch targets and meet WCAG 2.2 focus/contrast/target-size requirements.

### K.6.8 Settings and systematization
- **Owner addendum OR-2026-11-15-006 — global prompt default:** the user-editable global prompt field starts and remains empty by default on fresh installs. Do not inject a generic assistant prompt into this field or into requests. A placeholder may explain its purpose but is not a value. Migrate the legacy built-in default text to empty; only explicitly owner-entered text is stored/applied. Clearing it removes the global override. Settings export/import must preserve an intentionally empty value; test fresh profile, legacy migration, save/clear, and profile round-trip. This is distinct from runtime/system instructions that are not user-editable settings.
- Rebuild Settings into intuitive priority groups: provider/model; chat behavior/modes; search/research; tools/permissions/connectors; local files/offline package; appearance/accessibility; memory/privacy/storage/backup; advanced diagnostics. Keep chat/project settings scoped and avoid duplicate global controls.
- Remove obsolete Twilio tools and Twilio web-search controls from Settings/UI, along with dead/duplicate settings. Do not add Twilio back as a generic search provider; keep only real, used, approved integration settings.
- Reduce text blocks to concise labels/helper/status. Put advanced controls behind progressive disclosure. Keep headings, sliders, fields and helper text on a consistent scale.
- Memory settings are discreet in the main UI; internal hierarchy is minimal and clear about source/scope, user control, export and deletion. Never imply remote storage when data is local.

### K.6.9 Files, Notebook, converters and local knowledge packs
- Provide a dedicated Notebook workspace for source collections, documents, websites, notes, citations, extracted tables/images, transformations, search, chat-with-source and saved research reports. Notebook is not a chat preset.
- **Studio route architecture gate:** keep / as the canonical aLandi entry point and preserve the existing GitHub Actions → GitHub Pages auto-publication path. A large workspace (Notebook, Research, or another studio) may be a dedicated same-site route such as /notebook/ when a separate navigation surface materially improves focus; it must remain part of the same Pages build unless an independently deployable product boundary is proven. Prefer same-origin paths when browser-local IndexedDB/OPFS data should be shared with the main app. A custom subdomain is a separate origin and requires an owner-controlled domain/DNS plus an explicit authenticated API or deliberate cross-origin message/sync contract; never assume it can directly read main-app browser storage. Do not create another marketing/presentation landing page.
- Provide file conversion/extraction, website reader/scanner, book/EPUB/web intake, OCR/scanned-document path, and conversion of supplied material into a clean Coder package (file tree, source map, instructions, dependency/license notes, selected excerpts and fixtures).
- Use explicit file/folder pickers and permission state. Browser code cannot silently read arbitrary paths; persistent folder access varies by browser. Distinguish one-time upload, retained local source, OPFS-owned data and future desktop/companion watcher.
- Use suitable embedded stores, not redundant databases: IndexedDB for structured metadata/records/sync state; OPFS for larger app-owned files/artifacts/indexes; Cache API for app shell/static assets; optional SQLite/WASM only when justified. Define migrations, quotas, eviction, export/backup and recovery.
- Curate small text-heavy code/API/AI example packs for offline retrieval. Pin upstream URL/commit/version, license, checksum, allowlisted files, update date and search index. Prefer selected docs/examples and structured retrieval over indiscriminate full-repository clones. Never silently execute imported code.

### K.6.10 Offline behavior and optional device model package
- Define online/degraded/offline behavior. Preserve local chats, projects, notes, selected files, Notebook records and cached app shell. Queue only safely replayable actions; mark remote inference/search/connectors unavailable and never imply a request was sent.
- Offer an opt-in offline kit in Settings: one modest model plus a few small helper models, including Coder helper and local voice ASR/TTS assets where device/runtime supports them. Exclude the largest/owner primary model. Show exact size, storage estimate, runtime/device requirements, license, checksum, quality limits and uninstall/update controls before download.
- Download/verify artifacts atomically; handle quota exhaustion, interruption/resume, checksum mismatch, eviction, migration and user deletion. Keep model weights outside GitHub Pages source and Git LFS.
- Distinguish model download/cache from inference. Browser execution requires supported WASM/WebGPU/ONNX/runtime; otherwise use explicitly installed local companion or owner server. Verify real offline chat, Coder and voice on target devices before claiming availability.

### K.6.11 Reliability, independence and release acceptance
- Test network-offline, slow/intermittent network, provider timeout, 401/403/429/5xx, model unavailable, quota reached, stale permissions, reload during run, cancellation, duplicate clicks and browser restart. Local data must remain readable/exportable.
- Verify project/chat CRUD, contextual menus, project filtering, create rows while collapsed, back navigation, no duplicates, no accidental data loss and migration from current localStorage.
- Add E2E for every mode combination, Agent/Research option, Settings grouping, memory controls, single-click buttons, overlays/blur, keyboard navigation, mobile viewport and no-overflow assertions.
- Exact-main CI must pass Gateway, Quality/Chromium, Freshness, Graphify, license/provenance and Pages as applicable. After Pages success, fetch canonical root and assert alandi-build-revision equals published commit SHA. Only public app route is `/` after `/landing/` removal.
- No final-ready claim until K.5 is complete except the intentionally excluded largest model and owner-only host/device actions. Final runbook must make remaining owner actions short, exact and testable.

### K.6.12 Research sources and adaptation rules
Research window: 2026-05-15 through 2026-11-15. These are architecture/UX references, not proof of aLandi implementation. Recheck current versions, licenses and availability before importing code/dependencies.
1. OpenAI Agents SDK, The next evolution of the Agents SDK (2026-11-13): model-native harness, MCP tools, progressive skill disclosure, sandbox workspaces, externalized run state, snapshot/rehydration and isolated subagents. https://openai.com/index/the-next-evolution-of-the-agents-sdk/
2. OpenAI Agents API (2026-09-10): managed cloud runtime built on Codex harness; compare but do not adopt automatically because aLandi prioritizes owner-controlled/offline operation. https://openai.com/index/introducing-the-agents-api/
3. LangChain Deep Agents: task planning, isolated-context research subagents, full-source fetching, citation synthesis and report verification. https://docs.langchain.com/oss/python/deepagents/deep-research
4. Temporal + Braintrust (2026-06-03): durable execution, evidence pipeline, tracing, evals and recovery for long-running research. https://temporal.io/blog/how-to-build-deep-research-agents-using-temporal-and-braintrust
5. Microsoft Agent Framework Skills: portable SKILL.md and progressive disclosure; compact descriptions, load full skill only when needed. https://learn.microsoft.com/en-us/agent-framework/agents/skills
6. MDN Storage quotas/eviction: IndexedDB/Cache/OPFS share browser-managed quotas; best-effort data may be evicted; persistent storage is separate and not guaranteed. https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
7. MDN OPFS: origin-private app-owned files, worker access, quota limits and deletion when site data is cleared. https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
8. Anthropic Projects redesigned (2026-09-17): coordinator, project threads, shared context/library and scoped worker sessions. https://claude.com/resources/articles/projects-redesigned
9. W3C WCAG 2.2 and WAI-ARIA APG: contrast, focus, predictable navigation, target size and keyboard behavior. https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/ARIA/apg/
10. Existing repo specs: docs/AGENT_FUNCTIONS_MENU_INFORMATION_ARCHITECTURE_RU.md; docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md; docs/AGENT_ORCHESTRATION_RESEARCH_RU.md; docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md; docs/OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md; docs/PRE_LAUNCH_STACK_RU.md §8.

**Implementation rule:** borrow tested concepts and small license-compatible components; do not import whole platforms or increase every request's prompt/context by default. Measure against the direct-model baseline and preserve owner-controlled data boundaries.

### K.6.13 Owner addendum OR-2026-11-16-005 — Mini aLandi, learning agents, Coder and local files

This addendum captures the complete 2026-11-16 continuation request. It extends K.1 and K.6.3/K.6.5/K.6.8–K.6.11. K.5 remains the only delivery-status table; no parallel backlog. These are target requirements, not claims of completed implementation.

#### A. Downloadable, runnable Mini aLandi package
- Deliver one installable, owner-downloadable package that starts a compact aLandi runtime without relying on the public browser app or continuous connectivity. It may be a signed archive/directory with installer/launcher and local data store; it need not live inside the browser or rely exclusively on browser storage.
- Bundle one small primary local model, only a few task-specific helper models where measured useful, the inference/runtime adapter, model/tokenizer/config assets, gateway/core, local store, skill/tool manifests, permission layer and selected speech runtime/assets. Exclude the largest owner-supplied primary checkpoint from public distribution; any separate owner import path must be explicit and local.
- Provide a package manifest with version, platform/architecture, CPU/RAM/disk/GPU requirements, exact artifact names/sizes, immutable revisions, separate code/weight/tokenizer/voice/data licenses, checksums, provenance, install/update/uninstall/rollback behavior and quality limits. Never put weights in GitHub Pages or Git LFS. Actions artifacts are temporary staging only; choose durable distribution after license, retention, access and cost review.
- Support pause/resume, atomic activation after checksum and compatibility verification, disk/quota preflight, interrupted-transfer recovery, corrupt-artifact rejection, optional components, update pinning and user-controlled deletion. Never execute imported code before provenance/license/hash verification.
- Detect real runtime state at launch: ready, degraded, offline, needs_install, incompatible or failed. Distinguish downloaded model, loaded model and successful inference. Do not promise instant attach until tested startup latency on target hardware.

#### B. Online/degraded/offline continuity
- Preserve local conversations, projects, settings, Notebook/source metadata, selected files, approved learning records and completed artifacts after network loss. Cached app shell opens offline where browser support permits; standalone Mini aLandi is independently launchable.
- Classify actions by replay safety. Queue only idempotent, local-safe or explicitly replayable operations. Remote inference/search/connector actions not sent are visibly not_sent/paused; never imply a provider received a request when it did not.
- On reconnect, reconcile server/local run IDs, idempotency keys, cancellation, permissions, versions and pending events before resume. Resume from durable checkpoints only when safe; never duplicate irreversible side effects or model submissions after uncertain delivery. Confirm any replay that sends data externally or changes remote state.
- Test airplane mode, long disconnect, network flapping, tab/browser and companion restart, expired credentials, 401/403/429/5xx, model unload/OOM, quota exhaustion, interrupted/corrupt downloads, stale permissions and reconnect races. Local data remains readable/exportable.

#### C. Offline voice
- Include audio transport/device integration, VAD/endpointing, ASR and TTS engines plus selected compatible/licensed language assets. Offline voice must not depend on Twilio or hosted speech APIs. Twilio ConversationRelay is an optional remote telephony/channel integration, not the local microphone/speaker runtime.
- Track engine/build/model/tokenizer/phonemizer/voice revisions, checksums and licenses separately. Current boundary: whisper.cpp v1.9.5 + large-v3-turbo Q5_0 and Piper 1.8.0 RU/EN are candidates but not target-installed; Qwen3-ASR-0.6B is an evaluation challenger, not wired; no approved Thai Piper voice is pinned.
- Verify true offline capture, editable transcript, explicit send, spoken response, stop/interruption, echo and recovery in RU/EN/TH on supported devices. Measure WER/CER, RTF, first-result/audio latency, interruption latency, CPU/RAM/PSS and thermal/battery where possible. Mocked browser tests do not prove offline speech.

#### D. Specialist Coder and curated implementation knowledge
- Build bounded Coder actions: repo/file map, task decomposition, API/library research, authoring, patch proposal, targeted repair, test authoring/execution, security/correctness/performance/accessibility review, docs, conversion/scaffolding and landing/UI implementation. Offer specialist, sequential team or reviewer pass only where runtime and permissions actually exist.
- Curate small text/code-first packs from suitable repositories and API/documentation sources already in the external source register. Prefer allowlisted examples, schemas, snippets, changelogs and focused tests over full clones. Pin URL, immutable commit/release, capture date, allowed paths, size, content hash, code/docs/data license, redistribution, attribution, update and rollback. Unclear/incompatible license means link-only.
- Index for local retrieval with file/line/commit provenance and citations. Filter by language/framework/API version/task; load selected excerpts only. Imported content is untrusted and inert. No hidden fetch, dependency install, shell or outbound network from Coder without task-specific approval.
- Until a real sandbox/workspace is verified, Coder only reads explicitly granted user files and drafts non-executed patches. OpenShell v0.1.8 is acquired as an Actions artifact, not installed or host-verified.

#### E. Persistent, trainable and project-scoped agents
- Support a persistent project agent scoped to an owner-selected project and resumable across chats/runs. Separate project facts, approved instructions, source-backed knowledge, accepted preferences, task outputs and ephemeral execution state; do not mix project memory into another project or private conversation.
- Provide user-visible learning: propose memory/lesson/preference from explicit correction or completed task; show source/scope; require owner approval before promotion; version it; allow inspect/edit/export/delete/disable/rollback. Evaluate material behavior changes against a fixed task set.
- Distinguish learning from approved memory/evals from fine-tuning or model-weight updates. Never silently train, upload private project material, alter model weights, permissions or tool grants. Fine-tuning requires explicit opt-in, data/license/privacy review, pinned dataset/model versions, reproducible baseline and rollback. Never store hidden chain-of-thought; retain outputs, citations, concise rationale and approved memory.

#### F. Minimal, strong local-file workspace
- Use explicit file/folder selection and show granted handles, relative paths, scope, persistence, last sync and permission state. Browser access is bounded by platform/origin permissions; use a local companion/package only when browser APIs are inadequate.
- Separate one-time uploads, user-granted folders, app-owned OPFS/package storage and synchronized project copies. IndexedDB for metadata/permissions/run/sync state; OPFS or package filesystem for larger artifacts; Cache API for app shell; SQLite/WASM only if measured queries/transactions justify it. Define quota/eviction, encryption policy, migrations, backup/export/restore and deletion.
- Normalize paths and confine operations to the granted workspace. Defend traversal, symlinks/reparse points, archive bombs, oversized/deep archives, MIME spoofing, malformed parsers, prompt injection and stale/revoked permissions. Bound count, size, parser time, recursion and concurrency.
- Provide tree/search/preview and safe parsing. Show diffs before writes; require explicit approval for write/delete/overwrite/export; preserve originals, snapshots/undo and audit. Read-only default; no arbitrary directory scan, implicit cloud upload or shell execution.
- Index project files incrementally and propagate deletion. Citations carry path, content hash, byte/page/line ranges, extraction version and permission scope. Revocation/deletion removes derived indexes/caches under declared retention.

#### G. System variation and release gates
- Preserve low-overhead direct single-model chat. Specialist variety is progressive and task-driven; disclose only roles/methods/permissions that really exist. No mandatory planner/helper call on every ordinary prompt.
- Advertise a capability only when its handler/runtime, model/tool permissions, offline behavior, success/error/cancel, audit and focused tests exist. Installed plugin, downloaded package, available model artifact, saved blueprint and mocked API test are distinct maturity states.
- Mini aLandi owner acceptance requires clean install, first offline completion, explicit file read/write approval and undo, Coder patch/review, offline voice, long disconnect/reconnect without duplicate side effects, backup/restore and uninstall/rollback.


### K.6.14 Owner addendum OR-2026-11-16-008 — Agent-first completion, mobile UX, Memory, Sources and offline runtime selection

This section captures the 2026-11-16 owner continuation in addition to the verbatim prompt archived in root `NOW.md`. It extends existing K.6.2–K.6.13 and the existing 15-point K.5 tracker; it creates no new parallel backlog. All items below are SPECIFIED until implementation and evidence are recorded.

#### A. Execution order and assistant-side plugin strategy
- First engineering workstream: inspect and finish the existing AgentRun/coordinator/subagent architecture against D-024 and K.6.3. Reuse the current SQLite task DAG, task-scoped encrypted payloads and existing worker/API contracts; do not introduce a competing orchestration runtime or duplicate agent registry.
- Complete truthful coordinator lifecycle: task planning/decomposition, scoped specialist selection, isolated contexts, dependency/fan-in handling, typed outputs, evidence handoff, durable pause/resume, retries/idempotency, cancellation, failure recovery and audit. Distinguish logical roles from actual workers and serial model slots from parallel execution.
- Current `coder_review` is a text-only draft/review workflow: Coder drafts from user-supplied code/text, Reviewer receives that draft, and Coordinator synthesizes; it is not a local Coder workspace and does not execute code.
- A true Coder execution workflow requires a real bounded workspace/sandbox, selected file/repository scope, command allowlist, patch review, tests and rollback. Until those exist, no arbitrary shell, filesystem or network.
- Strategically inventory the assistant-side plugins/tools the owner has added. For each, record actual connected/available state, supported actions, authentication/scopes, skill/API contracts, data boundaries, costs/quotas, side effects, failure modes and evidence. Map each capability to aLandi workstreams (research, coding, repository inspection, source ingestion, design/UX, validation) and identify complementary vs duplicate tools.
- Use plugins to accelerate research and repository work; do not imply that a ChatGPT-side plugin is a runtime integration in aLandi. Product integration requires a separate adapter, explicit credentials/consent, least-privilege scopes, server-side secret handling, contract tests, budgets and revocation. Base44 is a prototyping/build surface only if a separate Base44 app is explicitly in scope; GitHub remains canonical for this product and no migration/deployment to Base44 is implied.
- Review external sources from the existing source register by subsystem and within the requested recent six-month window. Prefer primary docs, release notes, reproducible demos and license terms; capture immutable version/date, adaptation, limitations and decision. Borrow interaction/architecture patterns, not entire competing products or incompatible licensed code.

#### B. Mobile-first navigation, sidebar and visual hierarchy
- Rework the Projects and Chats sections as compact, stable, clearly differentiated controls. Section headers are the strongest level (larger, uppercase, clear surface); expandable project/chat rows are visibly subordinate with smaller, thinner typography and restrained selected/hover colors. Create Project and Create Chat controls are compact, low-height rows attached directly below their section headers, not oversized cards.
- On a selected project, Chats shows only that project's chats, a clear Back action to all chats and a Create Chat action in the same location/grammar as the global create action. Project selection must not leak unrelated chats into the filtered list.
- The no-project state is a thin, low-height status stripe with concise text and a contrasting active/inactive state, not a large standalone banner. Its state/color changes only according to explicit project context.
- The active chat title is a compact, sufficiently wide rectangle anchored to the bottom edge of the header so long titles remain readable. In a project chat, show a separate project-name + lock/scope strip above it, with a distinct project color and restrained optional motion. Both labels must remain legible and accessible with reduced motion.
- Mobile sidebar, chats and projects must be narrow, low-noise and scroll-stable. Eliminate horizontal overflow, accidental page movement and layout jumps. Use anchored collision-aware menus, bounded lists, safe-area spacing and clear back/breadcrumb context where navigation depth requires it.
- Build a consistent hierarchy for typography, colors, selected states, borders, spacing, button height, icons and motion. Higher-level navigation controls must be visually stronger than their children; avoid all-caps/large text on every row. Use existing design tokens and update them coherently rather than layering overrides.

#### C. Settings, Memory and project Sources
- Memory settings must explain the hierarchy succinctly and in a predictable menu: Global Memory and Personal Memory as distinct groups; saved memories expand/collapse as compact rows, similar to chat/project disclosures. Make scope, provenance, status and user controls clear; do not dump long explanatory prose into the main settings surface.
- Project Settings must expose a dedicated `SOURCES` entry/button that opens a focused source manager. It must accept supported file/source formats through the existing aLandi extraction, parsing, conversion and normalization pipeline; show import progress, format/parser errors, provenance, project scope, duplicates and resulting indexed content. Never claim arbitrary formats work until a parser/adapter and fixture exist.
- Keep project source permissions and file scopes explicit. Imported documents are untrusted data; apply parser/resource limits, archive-bomb and prompt-injection defenses, source citations and deletion propagation from K.6.9/K.6.13.
- Remove redundant controls across menus. Deep Research exposes genuinely different research methods; effort/thoroughness is an orthogonal global execution-budget dimension and must not be duplicated as a Deep Research method.

#### D. Touch, input stability, voice, accessibility and publishing
- Every control must work with one deliberate tap/click, including the voice controls beside the prompt composer. Prevent duplicate submissions and define loading, disabled, pressed, success, error and cancellation states. Verify hit targets, focus, keyboard and screen-reader names.
- Prevent mobile browser auto-zoom on text entry/selection where feasible by using appropriately sized input typography (including the iOS 16 CSS-pixel behavior) and stable responsive layout. Do not disable user pinch zoom or other accessibility scaling as a workaround.
- Test navigation menus, back actions/breadcrumbs, all links, form validation/error/success confirmation, content rendering, search, dates/categories/pagination where applicable, image alt text, contrast, focus visibility and ARIA semantics. Check for broken CSS/JS/assets, correct GitHub Pages baseurl and a working custom 404.
- Validate at 320/360/390px and tablet/desktop widths, with no horizontal scroll or broken grids; include actual mobile browser checks for the voice/composer controls. Respect reduced-motion preferences.
- A minimal acceptable text-to-speech option may be built into the site if a lightweight, quality-acceptable browser/local engine exists; evaluate browser-native speech first and keep provider/cloud speech optional. It may also be an optional offline-package component. Do not claim consistent voices/languages across browsers without device tests.

#### E. Optional offline package manifest and local/server switching
- Before downloading Mini aLandi, present a compact component-selection manifest with explicit include/exclude controls (checkboxes or equivalent yes/no states). Show exact component size, total selected size, platform compatibility, RAM/CPU/GPU/disk needs, license, checksum, provenance, quality limits and dependencies before consent.
- Define a minimal, optimized core bundle that can resume a conversation offline: local runtime/inference adapter, one appropriately small primary model, essential API/core, local persistence, permission boundary and only the required model/tokenizer/config assets. Add optional modules only when evidence justifies them: Coder helper/model and sandbox, research/source packs, document converters/OCR, ASR/VAD/TTS and selected voice assets. Avoid redundant databases and duplicate runtimes; justify IndexedDB/OPFS/SQLite or another store by measured query, transaction, quota and portability needs.
- A local companion/package may be a separate device file/library that the user explicitly attaches or mounts into a project/workspace. It must be versioned, checksummed, permission-scoped and detachable; its data and imported code remain local unless explicitly exported/synchronized.
- Provide a clear local/server route switch through one stable model/runtime adapter. Preserve conversation ID, project scope, context, approved files, task/run state and provenance when switching; show which model/provider executes each request and whether it is local, server or unavailable. Do not silently upload private prompts/files on fallback.
- Offline Coder, voice conversation and research are separate capabilities with independent readiness gates. Offline research may use selected cached/source packs; live web research requires connectivity/provider credentials and must visibly pause when unavailable. Never imply cloud search or remote inference succeeded offline.
- Test download selection, disk preflight, pause/resume, atomic checksum verification, attach/detach, local inference, conversation continuation, server↔local switching, offline voice, Coder patch/review, reconnect reconciliation and uninstall/rollback on supported hardware. Distinguish package downloaded, model loaded, inference successful and capability fully verified.

#### F. Acceptance and evidence
- All changes remain within the existing 15 K.5 rows and current feature boundaries. Each implementation slice needs deterministic tests, mobile Chromium coverage, focused accessibility checks, exact-HEAD CI and a reversible feature flag where applicable.
- Research and design references are candidates until reviewed against the existing source register, current versions, license and actual user/device evidence. Do not copy design systems wholesale or introduce new runtime dependencies merely to imitate a reference.
- This documentation update does not implement any UI, plugin integration, offline package, local Coder, speech engine or agent-runtime capability.

### K.6.15 Owner continuation OR-2026-11-16-009/010 — four studio routes, aNoteBooki, code efficiency and chat core

This addendum reconciles the two latest owner prompts with K.6.1–K.6.14 and the existing K.5 15-point tracker. It creates no parallel backlog. Requirements remain SPECIFIED until implementation and exact-head evidence exist.

#### A. Four dedicated studio pages without a second deployment

- Keep the canonical aLandi application at the Pages root path / and preserve the existing GitHub Actions → GitHub Pages publication pipeline. Do not recreate the retired /landing/ page or introduce a second marketing landing.
- Deliver four focused studio pages as same-origin routes in the same Pages build. Each route must have a stable deep link, a clear return path to the main chat, shared authentication/session and project/chat identity, and explicit route-level tests. Routes are product workspaces, not separate Pages sites.
- Existing owner archive OR-2026-11-15-007 and K.6.9 establish the route principle and mention Notebook plus other studios; they do not record a definitive list of all four studio names. OR-2026-11-16-009 asks for four pages, but the four names are not recoverable from the saved requirements reviewed in this checkpoint. Do not invent the missing names or equate the four Functions panels (Deep Research, Agents, Skills, Connectors) with the four studios. Keep the route set provisional until the owner confirms the fourth name and intended studio boundaries.
- Prefer same-origin paths to share origin-scoped browser data. A custom subdomain remains a separate origin and requires owner-controlled DNS plus an authenticated API or explicit cross-origin synchronization contract. Never assume a subdomain can read main-app IndexedDB/localStorage/OPFS.
- Each studio must be a focused workspace with only its relevant tools visible; the main chat remains the shared center for conversation, project context, and task continuity.

#### B. aNoteBooki — Notebook as a shared project workspace

- Product name: aNoteBooki. It is a first-class Notebook workspace, not a chat preset and not a second isolated database.
- Define one versioned shared data contract for main chat, projects, aNoteBooki, Memory and studio routes. Use stable IDs and explicit provenance for chat, project, notebook, source, excerpt, claim, artifact, task/run and event relationships.
- A notebook can be attached to a project and linked to one canonical development chat. Notes, selected excerpts, transformations and research artifacts can be transferred into that chat with source IDs, citations, timestamps and origin metadata.
- Support an owner-configurable Auto-transfer mode, but make the destination chat, transferred item, scope and sync state visible. Never silently inject an entire notebook/library or all project files into every model request. Use selective retrieval and explicit context budgets.
- Distinguish Notebook sources and research evidence from Global Memory, Personal Memory and Project Memory. Promotion into memory is a separate, explicit action with scope and deletion semantics.
- Same-origin local persistence should reuse the existing storage architecture where justified (IndexedDB for structured records and sync metadata; OPFS for larger app-owned files/artifacts; Cache API for the app shell). Add SQLite/WASM or another store only if measured transactional/query needs justify it.
- Define online/offline/server synchronization, idempotent event delivery, versioning, conflict resolution, tombstones, export/backup, quota behavior and recovery. Switching local/server execution must preserve canonical chat/project/notebook IDs and provenance without silently uploading private content.

#### C. Chat is the primary execution surface; remove hidden defaults and duplicate orchestration

**Observed code facts at the inspected main snapshot:** index.md creates new chats with searchMode normal; the hidden toggleSearch checkbox is initially checked; initialization treats an absent legacy search flag as enabled; and the request path attaches web_search, public_knowledge_search and read_webpage definitions with tool_choice auto whenever useSearch is true. The direct request path omits those tools only when search is disabled/offline. This means ordinary new chats currently receive web tools by default, even when the user did not explicitly request research.

- Target behavior: direct main-model chat is the default and sends no web/tool schema unless the user explicitly enables or invokes that capability. Search must be an explicit, visible, per-chat choice; the UI must distinguish search availability from processing effort and Deep Research method. Offline means no web tool availability, not proof that the cloud model is local.
- Migration must not silently turn on web search. Preserve an explicitly saved user opt-in where its provenance is reliable; treat missing/legacy implicit defaults as off. Add tests for fresh chats, old chat records, imports/exports, per-chat persistence, offline state and the exact outbound request body.
- The current UI/code contains two orchestration controls: legacy multiAgentEnabled/agentModeControl drives a separate four-stage same-model runMultiAgentResearch pipeline, while agentRuntimeStrategy drives the durable AgentRun strategies single, team_review and coder_review. These are not the same execution path and currently create overlapping concepts in the Agents panel.
- Unify around one truthful execution-strategy contract. Keep the direct single-model route as default; route specialist/team/Coder workflows through AgentRun only when their capabilities, context grants, budgets, recovery and permissions are real. Retire the legacy four-stage toggle/pipeline only after an equivalent supported workflow and migration/regression tests exist. Do not market sequential same-model roles as parallel independent agents.
- Keep the dimensions orthogonal: processing effort, web access/breadth, execution topology, task skill, model/provider, data scope and output preference. Deep Research methods are actual research workflows (for example focused lookup, multi-step report, comparison, literature review, fact-check/source audit and Notebook research), not duplicate controls for Thorough/effort.
- Keep chat history/context continuity central. AgentRun should receive only an explicit bounded context packet from the active chat/project, with source provenance and permission checks; scope IDs alone never grant access. Return task events, citations, diffs and final results to the originating chat with an auditable link.

#### D. Lossless code and document optimization

- Audit index.md and related assets for duplication, dead settings, repeated handlers, oversized inline scripts/styles, synchronous startup work, unnecessary DOM scans, eager loading and avoidable context/token payload. The inspected index.md snapshot is approximately 538 KB / 6,673 lines and contains a large inline JavaScript IIFE; this is a measurement baseline, not a reason to minify blindly.
- Preserve behavior, data compatibility, migrations, accessibility and all owner-approved controls. Never remove a setting or data field solely because its name looks old; first trace reads/writes, imports/exports, migration paths, runtime consumers and tests.
- Prefer maintainable language/runtime techniques where justified: explicit state schemas and normalization, small pure functions, event delegation for repeated controls, lazy loading of heavy panels, memoization only for measured repeated work, stable module boundaries, asynchronous work outside initial rendering and selective retrieval. Avoid clever one-liners or abstractions that make behavior harder to audit.
- Consider extracting the large inline script/styles into versioned same-origin assets and progressively separating modules. Preserve Jekyll baseurl/relative_url behavior, CSP/security assumptions, cache invalidation, source maps for debug builds and current no-build deployment unless a build step proves worthwhile. Do not add a bundler/minifier dependency before measuring its benefit and supply-chain cost.
- Optimize documentation losslessly: merge duplicated explanations, move historical detail to the existing canonical records, keep NOW.md short and append-only archive/journal intact, preserve all unique decisions, constraints, evidence and owner wording. Do not paraphrase away a requirement or delete history to make a file smaller.
- Record before/after raw and compressed asset sizes, request count, JS parse/evaluation cost, startup/render timing and mobile interaction metrics. Tests must prove functional parity, import/export compatibility, keyboard/touch behavior and no regression in Pages routes.

#### E. Acceptance and scope control

- The plugin inventory and role boundaries are maintained in INTEL.md; a ChatGPT-side plugin is not automatically aLandi product runtime integration.
- The four studio names, the exact Auto-transfer policy defaults and any cross-origin/subdomain choice remain owner-confirmation gates. All other requirements above can be designed from existing project evidence.
- No implementation, runtime activation, connector OAuth, hosting migration, paid provisioning or model download is implied by this specification update.
- Continue using the single K.5 15-point progress table. Update its existing rows only when a real implementation milestone has evidence.

#### F. Live Pages and browser-local Workspace baseline — VERIFIED 2026-11-16

- Fresh live fetch (cache bypass, TTL 0) after Pages run #43840213780 returned root metadata alandi-build-revision = 2cc6573a79aae374575f4e55b0c2aa6deef844c8. The earlier cached /landing response was stale; fresh /landing/ returns HTTP 404. Do not restore it.
- Live route results: /workspace/ is available; /notebook/ and /research/ return HTTP 404. The existing route set therefore contains a Coder Workspace, not four finished studios. The four studio names/boundaries remain unresolved in the owner archive.
- Existing browser-local Workspace is a real, bounded file-editing foundation:
  - assets/js/browser-local-provider.js uses the File System Access API; the user explicitly chooses a directory or files and grants browser-managed read/write permission.
  - It supports bounded file enumeration, reads, exact multi-file diff preview, explicit write confirmation, pre-write hash revalidation, IndexedDB recovery snapshots, rollback attempts and explicit restore after reselecting the original folder.
  - Capabilities explicitly report persistentPermission=false, backgroundWatch=false, arbitraryPaths=false and networkTransfer=false.
  - E2E coverage includes diff/approval/recovery, changed-file conflict detection, partial-write recovery, directory bounds and legacy snapshot restore.
- This is IMPLEMENTED browser-local file editing, not a local AI Coder agent or OS sandbox. It has no AgentRun/model integration, shell/command execution, test runner, autonomous repository access or offline model package. Keep the existing feature; extend it through a permissioned Workspace adapter rather than replacing it.
- Mobile zoom diagnosis: index.md has the correct device-width viewport, but several text inputs/selects/textareas use Tailwind text-sm (14 CSS px). This is a strong iPhone Safari focus-auto-zoom hypothesis. Target a 16px minimum for mobile form controls while preserving pinch zoom; do not use user-scalable=no or maximum-scale=1 as a shortcut. Verify on physical iPhone Safari before marking VERIFIED.



## K.6.16 Live AgentRun status surface and operational indicators — OR-2026-11-16-011

**Authority:** owner request OR-2026-11-16-011, archived verbatim in root `NOW.md`. This section extends K.6.2/K.6.3 and K.5 row 4; it does not create a separate backlog or a new orchestration runtime.

### User outcome
- While an AgentRun is active, show a compact, collapsible status surface anchored to the originating chat/action, not hidden inside the Agents settings modal.
- Keep a visible one-line state summary while collapsed. Expanded state shows the current phase, role/task states, recent safe events, elapsed time and available actions.
- The status must remain associated with its originating chat/run when navigating between chats; reopening a chat restores the latest server-reported snapshot when the run still exists.
- On terminal state, show a clear completed/failed/cancelled result. Keep the summary available until the user dismisses it or the retention policy expires.

### Event and state contract
- Source status only from the durable AgentRun run/task state and event journal. Never infer completion or percentage from animation, elapsed time, an optimistic browser flag or a worker acknowledgement.
- Reuse the existing authenticated `GET /v1/agent-runs/{run_id}` and `GET /v1/agent-runs/{run_id}/events?after_event_id=…` contracts initially. Preserve monotonic event IDs, idempotent replay, bounded page sizes, reconnect/resume and snapshot reconciliation. Any transport upgrade (SSE/fetch stream) requires a measured latency/load benefit and must preserve auth, replay, cancellation and fallback semantics.
- Display only user-safe operational events: queued, worker claimed, task/role started, task completed, verification, waiting for explicit approval, cancellation requested/confirmed, terminal outcome and sanitized error codes. Do not expose model chain-of-thought, hidden reasoning, raw prompts, credentials, encrypted payloads or untrusted source instructions.
- The current browser poller is 500 ms and lives in the Agents modal. This is a verified implementation fact, not the target UX. Avoid duplicate concurrent pollers; one observer owns a run and can hand off safely when the active chat changes.

### Interaction and visual hierarchy
- Collapsed by default when no active run; during an active run the compact summary is visible without opening settings. Expanded details are on demand and do not block chat input.
- Status text is primary; color is secondary and must remain understandable in light/dark themes. Use semantic states: neutral/queued, active/running, attention/waiting, success/completed, warning/cancelled and error/failed. No color-only meaning.
- A thin animated accent or moving indicator may appear only while the server reports an active state. Respect `prefers-reduced-motion`; no perpetual animation after terminal state.
- Keyboard-operable disclosure with `aria-expanded`, visible focus, Escape/focus-return behavior where appropriate, a concise `role=status` / polite live region, and no repeated announcement of unchanged poll snapshots. Touch target minimum follows the existing mobile accessibility contract.
- Show only actions supported by the runtime. Cancel is available only for cancellable states and must display confirmation from the server; no fake Pause/Resume/Retry controls.

### Acceptance gates
1. A run started from the main chat appears in the originating chat's compact status surface without opening the Agents modal.
2. New events update status text and task states; duplicate event delivery does not duplicate rows or announcements.
3. Navigating away/back restores the current run snapshot; reconnect replays only events after the last cursor and reconciles with the snapshot.
4. Queued, running, verifying, waiting-approval, succeeded, failed, cancelled, timed-out and budget-exhausted states render distinctly and accurately.
5. Cancellation failure leaves the run observable and retryable; confirmed cancellation is not overwritten by a stale poll.
6. The collapsed surface never blocks typing, scrolling or message controls; mobile narrow viewport, keyboard, focus and reduced-motion cases pass.
7. Tests prove no hidden reasoning, raw prompt, credential or encrypted payload is rendered or logged.
8. The legacy four-stage path is not retired until AgentRun context transfer, data-scope grants, result/evidence return, cancellation, persistence migration and parity tests pass.

**Current maturity:** IMPLEMENTED / EXACT-HEAD VERIFICATION PENDING (PARTIAL). Main chat submits bounded AgentRun context and returns control after acceptance; the shared observer continues in the background, so the composer remains available. The originating chat has a collapsible status surface with server state, task states, allowlisted/deduplicated events, server-created elapsed time, terminal summary persistence/dismiss, reload recovery, 44px controls and retryable cancellation failure. Exact-child Chromium/Freshness/Provenance/Pages checks are pending. Remaining: full waiting-approval/error-state matrix, future/planned action timeline, explicit approval actions and Plan 2 legacy evidence-path parity before retirement; host feature remains off.


## K.6.17 Agent Library, multi-model orchestration, Skills/Research catalogs and bounded simulations — OR-2026-11-16-012

**Authority:** OR-2026-11-16-012 is archived verbatim in root `NOW.md`. Extends K.6.3/K.6.16 and K.5 rows 2–7, 10–12. Plan 1 and Plan 2 were explicitly approved by the owner. This is a staged capability contract, not a claim that every catalog item is implemented.

### 1. Agent Library and custom agent definition
- Provide a curated built-in catalog and a versioned personal Agent Library. Each agent definition may include: stable ID/version, display name, short purpose, profession, role, persona/style, instructions, supported languages, allowed model preferences/fallbacks, required Skills, knowledge/source collection references, context limits, resource budget, allowed tools, data scopes, approval policy and output contract.
- A user can configure an existing agent or create a custom agent from scratch. A saved definition is inert until explicitly selected/enabled; saving a role/persona does not grant tools, access to project files or memory, model permissions, shell or network.
- Agent packages must be portable, inspectable and reversible: manifest, provenance/license, dependencies, version, tests/evals, review state, enable/disable, export/import and rollback. Imported package scripts stay inert until separately sandboxed and approved.
- Agents may be attached to an explicit project/chat/library scope. Scope identifiers are attribution only; each data read/write requires a separately granted capability.

### 2. Multiple compact models and capability-aware routing
- Support a registry containing more than one installed compact model where storage and hardware permit. Target an owner-configurable collection with explicit purpose mapping, not an assumption that one or two models suffice.
- Registry metadata includes exact model ID/revision/digest, license, quantization, size, tokenizer/context limits, supported tasks/languages, memory/compute estimates, measured quality/latency and availability on local/server runtimes.
- Route planner, researcher, reviewer, coder, translator, extractor and synthesis tasks to models only when the relevant capability/evaluation gate passes. Allow per-agent preferred model, bounded fallback and an owner-visible default.
- Resource scheduler must respect measured RAM/VRAM, model load/unload cost, concurrency slots, thermal/battery profile, context budget and user-selected compute ceiling. A collection of installed models does not imply concurrent inference; current prototype remains one worker/model slot and serial.
- No silent provider/cloud fallback for private prompts, offline work or a user-selected local model. Present the selected route and any fallback explicitly.

### 3. Teams, user-directed dialogues and reusable scenarios
- Offer real selectable scenarios only where a backed execution graph exists: single specialist, researcher+reviewer→coordinator, coder→reviewer→coordinator, and future user-configured DAG templates.
- Support an optional chat mode where two selected agents exchange bounded messages and the user acts as conductor: pause/step/redirect/summarize/stop are explicit UI actions, not hidden parallel chats. Display attribution by speaker and keep final user-visible response separate from internal handoff metadata.
- Custom team composition may select role, model, skills, source collections, budgets, dependencies and output schema. Validate DAG acyclicity, role compatibility, aggregate budgets and permission intersection before launch.
- Ready-made scenarios are catalog entries with versioned inputs, required capabilities, sample outputs and evaluation coverage. A template without a handler is marked SPECIFIED/COMING LATER and cannot be launched.

### 4. Bounded swarm and social simulation lab
- Treat large populations of lightweight/synthetic agents as a separate simulation capability, not as thousands of LLM workers. Prefer deterministic or statistical lightweight actors with a small number of model-generated policies/parameters; use sampled populations and aggregate statistics where appropriate.
- Every simulation requires a declared question, population assumptions, agent rules, random seed, sample size, confidence/uncertainty treatment, stop condition, resource ceilings and an exportable run manifest.
- Label all outputs as synthetic simulations, never as observed human behavior, representative polling or causal social-science evidence. Preserve sensitivity analysis and baseline comparisons; do not automate actions against real people or external services.
- Enforce hard caps for actors, iterations, wall time, memory, tokens and cost. Any increase beyond defaults needs explicit owner configuration. Actual LLM fan-out/parallel execution remains DEFERRED until multi-slot hardware and queue recovery are measured.

### 5. Explicit tool capabilities — giving agents safe “hands”
- Model tools as typed capabilities with manifest, schema, provenance, risk class, scope, resource quota and audit record. Candidate categories: web search/fetch/browser interaction; project/library sources; user-selected local files; database read/search; parser/OCR/converter; Notebook/evidence ledger; and isolated code/test execution.
- Grant each capability per agent, run and resource scope. Separate read from write. Browser and internet access, database mutation, file writes, code execution and external side effects require independent policy checks and explicit approval tickets where risk requires it.
- Treat website/document content as untrusted input and tool output as data, never policy. Apply domain allowlists/SSRF defenses, bounded downloads, MIME/size checks, credential redaction, path confinement, sandboxing, idempotency, cancellation, timeout and audit. No direct host shell or arbitrary filesystem access.
- Existing assistant-side plugins (Exa, Firecrawl, Context.dev, Coder, BrowserAct, Base44, Vercel, Cloudflare, Railway, Render, Floot, Hercules, Hostinger, TinyFish and others) are not automatically aLandi runtime tools. Their use and product integration are governed by INTEL.md and explicit API/permission/credential gates.

### 6. Safe learning, knowledge and project training
- “Self-learning” in the first supported stages means collecting user-approved feedback, updating scoped memory or a Skill proposal, measuring evals, creating a versioned diff and asking for approval before publication. Every update must have source provenance, affected scope, test/eval results and rollback.
- No autonomous weight mutation, hidden objective change, cross-user training or promotion of unreviewed website instructions into system policy.
- A project-specific model training/fine-tuning-from-scratch workflow is a future isolated experiment: requires licensed/consented data, dataset provenance, compute estimates, leakage/privacy review, benchmark baseline, reproducibility manifest, owner approval and sandbox. It is not an available agent action in the current environment.
- Separate long-term facts (Memory), procedural guidance (Skills), agent identity/configuration (Agent Library), source/evidence records (Research/Notebook) and model weights (Model Registry). Do not duplicate these stores.

### 7. Agent status and run timeline
- Reuse K.6.16 as the common status contract across Agents, chat, Research and Skills jobs. Show past, current and planned next actions as typed safe operational events; distinguish server-confirmed state from scheduled/intended work.
- Expanded run details include phase, role, model selected, task/dependency status, safe tool actions, approvals waiting, elapsed time, resource budget, last result and next scheduled step. Collapsed summary remains compact and anchored to the originating chat/run.
- Never expose chain-of-thought, hidden prompts, credentials, raw private file contents or encrypted payloads. “Next” is a declared plan or queued task, not proof of execution. No invented percentage.
- Keep event history resumable and attributable; deduplicate IDs; reconnect from cursor and reconcile snapshots. Respect reduced motion and keyboard/screen-reader semantics.

### 8. Agents, Deep Research and Skills menu information architecture
- Keep the four primary Functions entries distinct: Deep Research, Agents, Skills, Connectors. Do not create duplicate navigation trees or overload one panel with the other's settings.
- Agents: built-in catalog; My Agents; create/configure agent; roles/professions; models; Skills/knowledge/source attachments; team/scenario builder; user-directed two-agent dialogue; run history/status; permissions/budgets; bounded Simulation Lab. Show only executable options as enabled.
- Deep Research: quick source lookup; existing multi-step evidence report; comparative research; literature review; fact-check/source audit; structured collection/Notebook synthesis. Each method needs explicit availability, search/data scope, source provenance/citation policy, stop/budget policy, report artifact and eval. Only the existing evidence-report method is AVAILABLE until other handlers pass.
- Skills: catalog; create from source; Agent Skills-compatible import/export; tests/evals; security/provenance review; dependencies; version history and rollback; explicit capability declarations. A Skill changes procedure/instructions, not permissions.
- Connectors remains its own truthful panel. No fake connect controls. A connected provider's live tools must still pass aLandi's typed capability, scope, credential and audit gates.
- Use progressive disclosure, compact cards, consistent semantic status text and a clear hierarchy. Keep the top-level menu shallow; do not render an overwhelming 1–7-level tree on mobile.

### 9. Relationship to local files, offline core and language tools
- Local AI Coder must extend the existing browser-local Workspace using explicit file/folder selection, exact diffs, write approval, recovery and a separately isolated execution/test sandbox. It is not equivalent to current browser-only file editing.
- The modular offline core package is a selectable manifest of compatible models, tokenizer/runtime, database/migrations, local file adapter, parser/converter/OCR, ASR/VAD/TTS, translator/grammar packs and optional Coder sandbox. Before download, show component checkboxes, size, license, checksum, hardware compatibility and whether the feature works offline.
- Local/server switching is an explicit runtime choice with a visible current location; no hidden cloud fallback. Run ID, scoped chat context and user-approved source references may cross environments; raw local files/secrets do not transfer without consent.
- See K.6.14/K.6.18 for offline and translator-specific acceptance.

### 10. Phased acceptance and maturity
1. **Phase A — Approved now:** Plan 1 AgentRun/main-chat context, permissioned source packet, result return and K.6.16 chat status; Plan 2 Deep Research method separation. Keep current runtime constraints, direct default and feature flag false.
2. **Phase B — Agent Library foundation:** versioned agent manifest/catalog, per-agent model preference, scoped Skill/source references and permission preview; no new tool execution by default.
3. **Phase C — Team UX:** reusable scenario selection, user-directed two-agent dialogue, live run timeline and explicit approval UI, with bounded resource tests.
4. **Phase D — Tool adapters:** browser/search, source/file, DB, parser/converter and sandbox adapters one capability at a time after security and audit tests.
5. **Phase E — Simulation and learning:** deterministic lightweight population simulations first; versioned memory/Skill proposals; model training only as separately approved offline experiment.
6. Each phase needs focused RED→GREEN tests, full exact-head CI (Quality/Chromium, Gateway if backend changed, Freshness, Provenance, Pages and relevant Graphify/dead-code checks), a feature flag defaulting off where applicable, rollback and a dated journal record. Do not mark a future phase IMPLEMENTED based on its specification.

**Current maturity:** SPECIFIED / owner-approved roadmap. Existing AgentRun single/team_review/coder_review prototype is IMPLEMENTED/VERIFIED within its limits. Multi-model registry, custom Agent Library, user-directed dialogue, safe tool adapters, self-improvement lifecycle, swarm simulations and local AI Coder integration are NOT IMPLEMENTED.

## K.6.18 Embedded translator and preinstalled grammar packs — OR-2026-11-16-012

**Authority:** OR-2026-11-16-012, archived verbatim in root `NOW.md`. Cross-links K.1.8 Voice, K.1.10 Documents/Converters, K.2 Model/Runtime and K.6.14 offline package.

### User outcome
- Provide a first-class translator accessible from the chat/composer and relevant text/source views without requiring a separate paid cloud account.
- Support explicit source/target language selection plus safe auto-detection; first target languages are Russian, English and Thai (RU/EN/TH).
- Offer distinct actions: translate faithfully, natural/localized translation, grammar correction, explain grammar, and terminology/glossary-aware translation. Do not silently rewrite the original text; show original and translated/corrected output separately.
- Preserve formatting, code blocks, links, citations, tables, numbers, names and document structure. For uncertain language or ambiguous terms, show uncertainty instead of inventing an authoritative correction.
- Allow project-scoped glossary/terminology and preferred style; glossary reads require project scope and edits require explicit user approval.

### Offline language pack
- Treat translation model, tokenizers, dictionaries, morphology/grammar rules, spell-check lists, locale data and optional pronunciation/TTS as separately selectable components.
- The pre-download selector shows exact versions, language coverage, component sizes, license, source, SHA-256, hardware/resource requirement and which operations work without internet. No model/dictionary/grammar dataset is bundled without verified redistribution rights and provenance.
- RU/EN/TH is a target coverage matrix, not a claim that equal-quality offline models or Thai grammar tools are already selected/available. Missing language capabilities must be shown honestly.
- Prefer small deterministic grammar/dictionary assets for common corrections and terminology, with an optional local model for contextual correction/translation. Cloud/provider fallback is opt-in and visibly indicated.

### Safety and UX
- Translation/correction is a separate explicit operation; it must not mutate stored chat messages, source files or project documents until the user accepts the result.
- Provide copy, replace-in-draft and save-as-new-version actions with validation/undo. In code blocks and executable snippets, preserve content unless the user explicitly requests translation.
- Do not treat translated prompt-injection text as trusted instructions. Preserve original source and provenance alongside translation when used for research/evidence.
- Keep controls compact, keyboard/touch accessible, mobile stable and consistent with the four-panel Functions hierarchy.

### Acceptance
1. Distinct Translate / Naturalize / Correct grammar / Explain grammar actions; no hidden auto-rewrite.
2. RU↔EN and RU/EN↔TH target matrix tested; unavailable offline directions are disabled with an explanation, not simulated.
3. Project glossary is scoped and versioned; no cross-project leakage.
4. Formatting/citations/code/tables survive round-trip fixtures.
5. Offline pack selector lists only license/hash/resource-verified components; local mode makes no network request.
6. Cloud fallback is opt-in and visibly disclosed; source text remains unchanged until acceptance.
7. Add golden-set evaluation for adequacy, terminology, preservation, grammar precision/recall and latency on target hardware.

**Current maturity:** SPECIFIED. No embedded translator or preinstalled grammar component is claimed IMPLEMENTED yet.
