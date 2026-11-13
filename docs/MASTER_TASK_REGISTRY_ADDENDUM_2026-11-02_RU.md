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

- [x] **ORIENT-2026-001** — сохранить короткий Session Sync Capsule handoff. PR #140 merged at `fe43d7fbd04dd4da7b557a3dd3f6c7f3ef6a924b`; Quality, Freshness and Provenance passed on exact PR HEAD; main-level Freshness/Quality/Provenance also passed on the merge SHA. Routine flow is one batched live GitHub read + one task register; detailed docs on demand. **Still open:** observe a fresh independent `oledue` session and measure the handoff.
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
- [~] **AGENT-CONTRACT-001 — effective English operating instruction.** Keep `AGENTS.md` short and operational: live orientation, one active slice, exact-head verification, source quality, main-first delivery, durable recording and product invariants. `OLEDUE.md` remains the first-read handoff protocol. **Acceptance:** a fresh session can identify the next safe action from repository state and one checkpoint.
- [~] **CONTINUITY-001 — step-level durable evidence.** Record every material stage in `docs/VOLLEY_LOG.md`; refresh `ORIENTER.md` and `docs/PROJECT_STATE.yaml` whenever state or next action changes. Record branch/PR/HEAD, changed files, check IDs/results, what was not checked, rollback and next step. Do not store chat transcripts or private reasoning. **Acceptance:** no material step needs to be repeated after a new chat.
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

Before promoting production artifacts, maintain one evidence-backed inventory containing: role (main/helper/ASR/TTS/embedding/reranker/OCR), exact model/repository and immutable revision, quantization, format, context/token limits, weight and auxiliary-file sizes, total disk footprint, expected RAM/VRAM/PSS, serving runtime/API, concurrency, license for code/weights/voice/tokenizer/data separately, provenance, SHA-256, install command, update path, rollback, and benchmark results on the intended target hardware.

- Compare the main local model with at least two credible current alternatives, including a model whose refusal behavior is suitable for the owner's intended legitimate use. Record uncensored/open-weight claims precisely: do not promise “zero refusals”; do not add an undisclosed application-level refusal layer. Preserve security checks for permissions, tool execution, privacy and external side effects.
- Evaluate a small helper-model lane against main-only baseline. Keep it off unless a task-class-specific eval proves better quality/latency/resource/cost; no helper may authorize actions or approve its own output.
- Inventory every external API/provider and every local API/endpoint, quotas, key custody, privacy and price. Inventory databases/storage by purpose (browser localStorage/IndexedDB, gateway SQLite/cache/RAG/AgentRun, and alternatives such as PostgreSQL/pgvector or a dedicated vector store only if measured need justifies them). State which databases are actually installed, which are optional, and exact volume/backup/restore requirements.
- Record the total model + speech + OCR + retrieval artifacts that the owner must download, with per-artifact and aggregate sizes. Never put large weights in the GitHub Pages source tree or Git LFS; use a governed model/artifact store with license and checksum checks.

**Current fact boundary:** Qwen3.5-4B Uncensored Aggressive is the preferred bake-off candidate, not a production-approved final model selection. The current repo has whisper.cpp/Piper code paths that depend on separately installed binaries and model/voice artifacts; feature flags are off by default. models/vosk/ contains a 46,236,750-byte Vosk Small Russian reference archive (ship=false), not an activated voice runtime. Current RAG is SQLite FTS5 + lexical concept graph, not full hybrid vector RAG. The local exact-response cache and browser cache exist; full operational observability and AgentRun runtime are not yet proven live. No VPS/Tunnel/Ollama host is currently verified.


**Acquisition progress 2026-11-13 — IMPLEMENTED / ARTIFACTS VERIFIED, PRODUCTION NOT APPROVED**

- Main-model candidate pinned: HauhauCS Qwen3.5-4B Uncensored Aggressive Q4_K_M, 2,707,513,696 bytes. It is explicitly owner-server-only; no primary model weight was downloaded into Git or Actions artifacts.
- Main/helper acquisition run 43393099472 succeeded and staged 6,453,112,704 bytes: Qwen3 Embedding 0.6B, Qwen3 Reranker 0.6B, Qwen3-ASR BF16, sherpa-onnx Qwen3-ASR INT8, Silero VAD, Whisper large-v3-turbo Q5_0, Piper Russian voice/config/card and Qwen vision projector.
- Thai TTS run 43393859216 succeeded and staged 728,750,351 bytes: F5-TTS-THAI V1 500k FP16, vocabulary, model card, MIT code license and Vocos 24 kHz vocoder. Weight card says CC-BY-4.0, but underlying Porjai data rights are unclear; keep evaluation-only.
- Every acquired file has SHA-256/SHA-1, exact byte length and a provenance sidecar in its lock artifact. Git tree remains weight-free; Actions artifacts retain for 30 days.
- Embedding and reranker are candidates for FTS5 + vector + RRF; reranker only runs on a bounded top-k when measured benefit justifies it. ASR INT8 is the CPU challenger; no runtime adapter exists yet.
- No weights are installed or loaded on a VPS. No WER/CER, retrieval, TTS, latency or RAM result is claimed. Main model selection and serving runtime remain subject to exact-host evaluation.
- Detailed source groups, APIs, artifact links and commands: docs/MODEL_ARTIFACT_ACQUISITION_RU.md; manifests: models/manifest.json and models/manifest-thai-tts.json.

### K.3 Priority and execution order

**P0 — Recover one coherent main baseline and remove PR debt.** Reconcile every currently open PR against live base/head/diff/dependencies and exact-head CI. Preserve useful unique work, fix actual regressions, selectively merge only compatible green slices, and close stale/draft/failed/duplicate PRs after recording dispositions. Target steady state: main plus at most one active PR for the current landing/product slice. Keep main the only durable baseline; never wholesale-merge stacked or failed work.

**P1 — Finish the owner-designed user experience and four-panel Functions navigation.** Complete UI requirements; make each of Deep Research, Agents, Skills and Connectors open its own truthful, usable panel with independent states, handlers and regression tests. Reconcile the Functions Drawer / Notebook / project navigation / Browser Local workspace work into one coherent interface.

**P2 — Freeze the real stack through evidence, not guesses.** Research and compare local main-model candidates (including an uncensored/open-weight option appropriate to legitimate use), helper models, ASR/TTS/VAD/AEC, OCR/parser/converter, embedding/reranker and web-source tools. Produce the model/API/database inventory, license/provenance, exact downloads/weights/sizes, target-hardware budget and baseline benchmarks before production pinning.

**P3 — Build the real execution layer.** Deliver AgentRun runtime, scoped capability/tool registry, durable queue/state/events, approvals, sandbox and live status UI; implement mandatory local-file coding workspace and the desired GitHub repository connector. Prove cancellation, isolation, recovery and adversarial behavior.

**P4 — Deliver complete knowledge and ingestion.** Full RAG quality pipeline, source/evidence viewer, documents/books/web scanners, OCR, parsers and converters with exact provenance, deletion and real-format fixtures.

**P5 — Make voice work end-to-end on the actual target.** Install Whisper/ASR and TTS voice artifacts, VAD/audio pipeline and UI; verify RU/EN/TH, interruption/cancellation and actual mobile/browser hardware. No “implemented” status from code-only tests.

**P6 — Complete connectors, mode-combination logic, efficiency, cache and observability.** Test the full mode matrix; prove default direct path and conditional helper/agent routing; bring cache, metrics, run events and N₂O operational evidence into main without increasing every request's cost.

**P7 — Release and owner guide.** Complete exact-head CI and regressions; merge the final compatible slice(s), verify post-merge main and public Pages content on exact SHA; separately verify live VPS/Tunnel/Ollama, installed weights/APIs/databases, authenticated model response, coding workspace, connector, RAG, documents and voice. Publish the tested owner runbook with exact links and commands.

### K.4 Completion gate — no “done” by appearance

The programme is complete only when:
- Every advertised function has a real handler/runtime, permissions/data scope, state transitions, success/error/empty/cancel path, logs/metrics appropriate to privacy, and deterministic regression coverage.
- All required model/voice/OCR/runtime artifacts are installed on the intended host with verified revisions, licenses, checksums, disk/RAM and benchmark evidence.
- Core end-to-end scenarios pass on the real configured environment: chat; Deep Research with validated citations; real AgentRun with tool use and live events; Skill lifecycle; real connector action + revoke; local-file coding in sandbox; repository read workflow; RAG retrieval/citation/deletion; document/book/web/image intake and conversion; RU/EN/TH voice; cache hit/bypass and restart/recovery.
- Toggle/mode matrix passes with no hidden fallback, no privilege escalation and no unconditional extra-model/agent overhead on ordinary chat.
- Required cache/observability/N₂O code and operational controls are merged into main.
- GitHub Pages publication and VPS/runtime are independently verified. Merge ≠ deployment; Pages ≠ VPS.
- Final runbook lets the owner reproduce a first successful server-backed completion and each mandatory capability without guesswork. Any unverified device/host/provider condition is explicitly listed, not concealed.

**Live intake snapshot 2026-11-13:** main = 9033c6ad708a993cba5d1b27442f53651ad71c0f; 8 open PRs (#175–#182 with #173/#174 already merged); issue #111 remains open. Exact-head visible checks: #181 passed its visible required checks; #176/#177/#178 passed their visible Chromium/Jekyll/security/integrity/context checks; #175 Chromium failed (Notebook/project isolation timeout); #179 Chromium and Freshness failed (project-scope timeout and stale queue snapshot); #182 Chromium failed (personal/project selection assertion); #180 Integrity failed and Chromium was cancelled. Main scheduled Freshness #43247857963 failed because the live open-PR queue differs from the saved checkpoint. Re-fetch every head/check before any integration decision.
