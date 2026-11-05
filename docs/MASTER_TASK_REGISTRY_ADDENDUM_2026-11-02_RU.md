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

- [~] MENU-001 — инвентаризация первично выполнена по `index.md`, `assets/js/app.js`, `assets/css/app.css` и E2E; полную матрицу handler/permission/data scope/evidence завершить.
- [~] MENU-002 — базовая иерархия уже существует как 4 группы (task workflow, research/sources, create/transform, connections); расширить вложенные категории Agents/Skills/Files/Media/Models/Tasks без дублирования.
- [~] MENU-003 — текущие roadmap items уже показывают non-runtime ticker и пояснение; формализовать единый status model для всех карточек.
- [~] MENU-004 — текущий agent panel уже показывает mode, team blueprint, use cases, 64 roles, orchestration, models/resources and capabilities; добавить Skill binding, data scope, budgets, approvals and outputs по мере появления реальных handlers.
- [~] MENU-005 — сейчас доступны direct response и sequential four-stage workflow; остальные режимы оставить roadmap-only до независимого runtime.
- [~] MENU-006 — текущие chat profile/team blueprint controls существуют; расширенные model/skill/data/permission/resource/history controls требуют реальных backing APIs.
- [~] MENU-007 — `1ИÆИT10И` tickers, pause controls, reduced-motion CSS and non-runtime notes exist; E2E assertions are authored, but exact-head execution is pending.
- [ ] MENU-008 — завершить mobile/keyboard/VoiceOver and duplicate-control review; RU/EN menu labels and initial Playwright assertions already exist.
- [x] MENU-009 — supporting UX contract создан; source audit and remaining gaps синхронизированы с canonical UI checklist section 8.28.

## B. Skill Factory и Agent Builder — PR #125 / PR #128

- [ ] SF-001…SF-007 — Skill lifecycle: source ingestion, evidence/provenance, manifest, license/security scans, generated evals, human review, versioning/rollback.
- [ ] AB-001…AB-005 — Agent blueprint: role, Skill versions, model policy, capability scopes, data scope, budgets, approvals, dry-run/evals.
- [ ] AW-SK-001…AW-SK-005 — threat model и adversarial tests для imported Skills; inert-by-default scripts.
- [ ] AW-UI-001…AW-UI-002 — отображать реальные worker states/concurrency отдельно от inference slots.
- [ ] VERT-001 — универсальный pipeline «материал → Skill draft / Agent blueprint / Task template»; три типа артефактов не смешивать.
- [ ] VERT-002 — source spans/evidence сохранять на всех этапах преобразования.
- [ ] VERT-003 — не выполнять scripts и не наследовать права из Skill/Agent metadata.

**Artifacts:** PR #125 `AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md`; PR #128 `AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md`.

## C. Компактные модели / SLM — PR #125

- [x] SLM-001 — определить task-based bake-off вместо рейтинга по числу параметров; роли: classification/routing, structured extraction, reranking, summarization, memory candidate generation, Skill synthesis. **Artifact:** `docs/AGENT_MODEL_BAKEOFF_RU.md`, раздел “2026-11-02 — Task-based small-model evaluation contract”.
- [ ] SLM-002 — подготовить одинаковый RU/EN/TH golden set и схемы для каждого узкого сценария.
- [ ] SLM-003 — измерить cold load, RAM/PSS, VRAM, TTFT, p50/p95, tokens/sec, concurrency and cancellation на целевом хосте.
- [ ] SLM-004 — зафиксировать immutable model digest, quantization, tokenizer/template, runtime, code/weights/dataset licenses.
- [ ] SLM-005 — сравнить с main-only baseline и включать не более одного helper model за раз; default remains off until owner approval.

## C. Voice и audio generation — PR #129

- [ ] AUDIO-GEN-001…009 — исследовать Agent Audio; проверить модельные terms, hardware, WAV quality, latency, integration and security.
- [ ] AUDIO-UI-001 — разделить ASR, TTS/voice conversation, non-speech audio generation и post-processing.
- [ ] AUDIO-UI-002 — preview/accept/reject, artifact provenance, project attach only after explicit approval.
- [ ] AUDIO-SKILL-001 — описать media-production Skill с cue sheet, sound generation, audition, sync and export.
- [ ] AUDIO-SMALL-001 — сравнить компактные модели/backends с baseline на target hardware; не принимать parameter count за benchmark.

**Artifact:** PR #129 `LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md`. Agent Audio remains early-preview candidate; no install/download performed.

## D. Deep Research, local files, conversion, video — PR #130

- [ ] LSV-001…LSV-014 — browser permissions, local Source Vault, consent/storage modes, extraction, deletion lineage, screenshot-to-code, video workflows and archive policy.
- [ ] LSV-015 — capability matrix File System Access across desktop/mobile browsers.
- [ ] LSV-016 — fallback upload/drag-drop for unsupported browsers.
- [ ] LSV-017 — decide if persistent directory watchers require a local companion; no public filesystem endpoint.
- [ ] CONV-001 — compare Docling with existing parser on RU/EN/TH corpus and resource budgets.
- [ ] CONV-002 — validate screenshot-to-code quality with golden screenshots, no-execution review workspace.
- [ ] CONV-003 — define image→OCR/VLM, page→HTML/CSS, audio→transcript, video→frames/transcript workflows and provenance.
- [ ] VIDEO-001 — benchmark ComfyUI/Wan candidate only on suitable GPU hardware and with exact model/checkpoint license review.
- [ ] ARCHIVE-001 — upstream watchlist: exact versions, SHA-256, source/model/dataset licenses, dependencies, storage size and preservation reason.
- [ ] ARCHIVE-002 — mirror only after explicit approval and only when licenses/terms permit; never commit weights to Git.

**Artifact:** PR #130 `LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md`.

## E. Общие acceptance gates

- [ ] GATE-001 — classify each capability as current / partial / blueprint / not implemented using source code and tests.
- [ ] GATE-002 — threat model for local file access, untrusted documents, archive bombs, prompt injection, path traversal, malicious scripts and generated code.
- [ ] GATE-003 — verify code, model weights, tokenizer, voice, dataset and workflow licenses independently.
- [ ] GATE-004 — record actual disk/RAM/VRAM/latency/quality on target hardware; no extrapolation from model size.
- [ ] GATE-005 — add exact-head tests and update canonical project state after each bounded implementation stage.
- [ ] GATE-006 — require explicit owner approval before model downloads, runtime/dependency changes, external sync, destructive file operations, deployment or merge.

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
- [~] **MENU-010** — update roadmap test to five cards, including Deep Research 2.0; require Research Studio to remain outside Functions and inside Thorough controls.
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
- [~] **LANDING-V2-2026-001** — continue substantial Landing 2.0 work only in PR #131; no wholesale merge. Current PR HEAD is tracked live. Promote only independent, V1-compatible slices after exact-head tests, failure-path review, accessibility and rollback evidence.
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
- [ ] **FIX-008** — pin or self-host third-party browser assets and add SRI where supported; document the CDN trust boundary.
- [ ] **HYGIENE-006** — delete only the verified allowlist after an authorized branch-delete API/UI is available; preserve every branch HEAD SHA and recheck open references immediately before deletion.
- [ ] **AUDIT-010** — finish subsystem review of provider routing, browser storage migrations, voice/audio lifecycle, RAG deletion lineage, V2 candidate slices and native device/runtime behavior.

**Phase-1 report:** `docs/REPOSITORY_DEBUGGER_AUDIT_PHASE1_2026-11-05_RU.md`. This is a verified partial report, not closure of the full audit.


## G. Browser persistence integrity and follow-up debugger findings — 2026-11-05

- [~] **AUDIT-FIND-011 — P1 localStorage recovery/data integrity.** Confirmed in `index.md`: project JSON parse/shape failures were silently reduced to an empty list without preserving raw data; partially invalid chat arrays could drop records without backup; `persistChats()` wrote chat list and current ID separately without rollback; create/delete/import project operations could partially persist while showing success. PR #150 branch `fix/browser-storage-recovery-atomicity-20261105` implements raw recovery backups, fail-closed behavior when backup creation fails, direct download of original raw payload, rollback for chat/current and project/chat writes, in-memory rollback, success-state gating, import bounds and four Chromium regressions. **Status: IMPLEMENTED IN PR #150; exact-head verification pending.**
- [~] **FIX-009 — transactional browser persistence.** Complete PR #150 gates and review all call sites for false-success UI; keep localStorage keys/version compatibility unchanged. Rollback must be verified under injected quota failures.
- [ ] **AUDIT-FIND-012 — P2 conditional FTS5 secure-delete capability.** `MemoryManager` only enables the FTS5 `secure-delete` option on SQLite 3.42.0+; on older SQLite the capability flag is false but logical deletion still proceeds. The capability is not exposed through health/status APIs. Deleted FTS entries may remain in index segments until merge; logical deletion is not forensic erasure. Runtime SQLite version and feature enablement on the target host are **UNVERIFIED**. Reference: https://www.sqlite.org/fts5.html#the_secure_delete_configuration_option.
- [ ] **FIX-010 — surface FTS5 deletion capability.** Report SQLite runtime version and FTS5 secure-delete capability in a health/diagnostic surface; document the deletion guarantee accurately; test supported and unsupported SQLite versions before enabling MemoryGraph/RAG on a host.
- [ ] **AUDIT-011 — target-host SQLite/runtime verification.** Verify the actual VPS Python-linked SQLite version, FTS5 availability, feature flags and deletion behavior; do not infer from CI's Python runtime.

**PR #149 completion evidence:** merged at `8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`; exact-head Quality #42001310270 (7 jobs), Freshness #42001309687, Provenance #42001309703 and Graphify #42001311323 all PASS. PR #150 remains in review.
