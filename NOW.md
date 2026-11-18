# NOW — aLandi: единственная точка входа и журнал текущей работы

> **Старт:** сначала читать только этот файл, строки 1–100. Это единственный session/task checkpoint.
> **Триггер `oledue`:** тот же протокол; отдельного handoff-файла нет.
> **Полные запросы владельца:** дословный append-only архив в конце файла. На старте читать CURRENT; архив — только при необходимости точной формулировки.

## CURRENT

- **Task ID:** LANDING-V2-2026-001.
- **Routing:** latest explicit owner request controls task routing; never select an old PR as a default. Work only on authorized main.
- **Open PRs: none**
- **Open issues: #111, #186** (#186 is an unrelated GitHub Skills Pages exercise).
- **Implementation chain (main):** base `1d18b976f3700b76b8690d52f5e7f4c81c3bba5e` → Coder Skills `800a01ca0a93a393c054c9359acb7b8caaacd091` → research/docs `cd9cc45b8256c73bedfc030580669e6cd6608238` → Evidence Report `3b931657eb10e7a16649da80d6c98832a2ebdef8` → test repair `1ffe419401fb2a807643968a9dc7ad9e7c2c6d21` → Notebook citation transparency `5c24ca0af912bd580df532160d454ea9199761e3`. Seven-skill expansion is recorded in S-125.
- **Latest checks:** Gateway #44130595139 `success` on exact SHA `1ffe419401fb2a807643968a9dc7ad9e7c2c6d21`, all Python 3.12/3.13/3.14 jobs passed compileall, state/INTEL validators, `uv run --locked python -m pytest -q gateway/tests`, deployment preflight and six-layer offline evaluation. Graphify #44131198584 `success` on exact main SHA `5c24ca0af912bd580df532160d454ea9199761e3`. Pages #44131196430 was queued at last check for the same SHA. No exact-root publication marker or Notebook Playwright E2E yet.
- **K.5 #1 implementation:** Memory IA has distinct Global/Personal groups, provenance/scope disclosure and confirmed Personal → Shared promotion preserving the private copy. Voice menu opens by one deliberate click/tap, closes with Escape and returns focus. Mobile text-entry controls use 16px at <=640px while pinch zoom remains enabled. Header context capsule distinguishes personal/project and memory scope; do not add a duplicate no-project stripe.
- **Project Sources:** Project Settings now provides project-scoped upload, extraction through the configured Gateway, SHA-256 duplicate detection, chunk indexing, metadata/catalog, bounded first-chunk preview and scoped delete. The UI requires both document extraction and RAG capabilities. Gateway stores extracted text and metadata; original file bytes are not retained. This is not a Source Vault.
- **Storage boundary:** `ALANDI_RAG_ENABLED=false` and document extraction remains disabled by default; the owner must explicitly configure the intended Gateway environment. No VPS configuration, secret, host setting or deployment was changed.
- **Quality repair:** Quality #44005284336 on prior SHA `31965169483634e64dd5cd98e7dae03d39019620` failed because a loop variable shadowed the DOM `document`, hiding successfully indexed rows. The renderer now uses `source`; catalog refresh errors are not overwritten by success; 44px source-manager touch targets are covered by E2E. No test was weakened.
- **Owner requests:** through OR-2026-11-18-003 are archived verbatim below. Current routing override: UI/IA/site completion is the first engineering priority across all owner-provided prompt sources; defer new backend/runtime capability work until existing menus, screens, copy, interactions and visual system are systematically reconciled and finished. Preserve K.5/K.6 requirements; K.5 remains the only 15-point tracker; do not create a parallel backlog.
- **AgentRun maturity:** IMPLEMENTED / PARTIAL. Existing SQLite DAG, encrypted payloads, bounded context, explicit chat route, same-chat result and collapsible status. The Coder profile now loads seven fixed, bounded repository-owned SKILL.md guides (navigation, test-first delivery, security boundaries, performance engineering, API contract design, database engineering, debugging/observability). It remains non-executing: one worker/model slot, serial inference, no tools/shell/arbitrary filesystem/repository execution/local code runner; Skills grant no permissions.
- **Offline package:** SPECIFIED, not implemented; local inference, document extraction, ASR/TTS, translator/grammar, local Coder and local↔server handoff retain security, hardware, licensing, checksum and RU/EN/TH evaluation gates.
- **aNoteBooki:** local evidence mode remains offline/no-transfer. Separate model-backed aServi action uses explicitly selected sources and bounded excerpts, asks confirmation and stores the answer with exact evidence/hash/offsets in IndexedDB. Source deletion marks dependent answers stale. A separate versioned Evidence Report JSON export includes only Q&A turns, selected source IDs/hashes, exact excerpts/offsets, citation status and stale-state flags; unrelated notes and unselected source text are excluded. No web search/tools/provider fallback. Focused E2E is authored, not executed; Studio generators and multimodal parsers remain open.
- **Remaining acceptance:** finish compact mobile hierarchy/navigation/accessibility/forms, RU/EN and visible error states; Settings, project create/edit and message-viewer keyboard containment are implemented with focused E2E regressions (pending execution). Composer popovers now size to VisualViewport, trap keyboard focus, restore triggers on Escape/scrim and contain nested project-choice scrolling; focused E2E is pending execution. User-selected reduced motion now stops the infinite prompt pulse and voice-menu entrance animation; computed-style E2E is pending execution. Chat/project action menus now size and place against the visual viewport, with a keyboard-height geometry regression added (pending execution). Long project/chat labels now truncate within 320px sidebar rows with full titles retained (E2E pending). Composer placeholder now adapts to narrow RU/EN widths (E2E added, execution pending). Physical iPhone Safari + VoiceOver and owner visual acceptance remain separate. Do not claim native-device acceptance from DOM smoke or Chromium.
- **Freshness / Provenance:** Freshness #44007278149 found `root_orienter.base_main` stale against snapshot `main_sha`; the prior commit records the repair; this direct child synchronizes `root_orienter.base_main`, `verified_main` and snapshot `main_sha` to the same parent. Provenance #44007278170 passed on the prior documentation parent; rerun both exact-child gates.
- **Quality workflow strategy:** `quality-sentinels.yml` now runs only by manual dispatch; Lightpanda DOM smoke is the fast browser candidate; expensive Ruff/Bandit/Semgrep, full Chromium and live Pages release verification are opt-in. `scripts/fast-check.sh` is the dependency-free local gate, including state-freshness unit tests. `project-state-freshness.yml` is manual-only; its full live GitHub queue/checkpoint verification remains available on demand. The GitHub Pages publication mechanism/workflow was not changed. Tooling commits: `76ce1523`, `ea78165c`, `bbe0b29f`, `80cae1c0`, `8e231680`, `ff04f729`, `f7364355`, `7e1b2822`, `b33b5097`, `616780b2`, `1c4825b2`, `e4830c36`, `383de568`, `df1a73cf`, `e15ed7bd`, `17798db4`, `ab407995`, `0dd1fdb5`, `ccff0f73`, `5a24cd8d`, `71e50fcc`; UI accessibility commits `351004a4`, `f862c61e`, `ea06d0a2`, `36332c00`, `50ff6ec6`, `097876f6`, `72327b4e`, `6e5e0ce3`, `045186bd`, `9a505400`, `7b4fa829`; smoke `02eb80c4`; source/backlog docs commits `5f757ba7`, `2f1339fd`, `a6fcd54d`, `fc0d46ae`. Scripts and workflow have not yet been executed on a local checkout/current HEAD, so they are IMPLEMENTED, not VERIFIED. Container has no repository checkout and cannot resolve github.com for clone.
- **Status:** IN PROGRESS — UI-first Landing 2.0 completion. Latest code implementation: `ee6295d54216d7d734f4f82295ea6047a4822901`; current main HEAD: `ee6295d54216d7d734f4f82295ea6047a4822901`.
- **Latest exact-head check:** code HEAD `ee6295d54216d7d734f4f82295ea6047a4822901`: Pages #44289270720 and Graphify #44289274391 are IN PROGRESS at journal capture. Prior Pages #44286558643 passed on `841c6318bd0b24b810a35b678978d82a1337e886`.
- **Active execution plan (single route; no parallel backlog):** (1) reconcile owner archive + V1/UI checklist + current DOM/test inventory; (2) root shell/sidebar/project/chat navigation and empty/large-list states; (3) composer/popovers/dialogs/forms and all success/error/disabled states; (4) Functions/Settings and cross-panel copy/handler consistency; (5) RU/EN, light/dark, reduced-motion, keyboard/touch and 320–1440px responsive pass; (6) focused fast DOM checks, targeted Chromium only for rendered geometry, exact-head CI and published-root revision verification; (7) record evidence/remaining owner-only native-device acceptance in existing canonical docs. Each item is marked IMPLEMENTED separately from VERIFIED. Preserve existing V1 freeze, K.5/K.6 scope and one canonical backlog.
- **External-source application:** INTEL.md is the source index. Use WCAG 2.2 as testable accessibility criteria; MDN VisualViewport for keyboard/visible-viewport geometry; Lightpanda only for JS/DOM smoke (not visual layout); retain Chromium for rendered geometry. No new framework/dependency based on source inspiration alone.
- **Repository:** DorpNay/skills-github-pages / main.

## START PROTOCOL — five-second route

1. Read NOW.md lines 1–100. Identify CURRENT, status, checkpoint SHA and NEXT.
2. Batch live reads: main ref + open PRs + open issues. Check exact-head runs only for a PR explicitly matching CURRENT. Compare live SHA/queues; do not enumerate old PRs/branches unless the current owner request requires it.
3. Latest explicit owner request in this conversation wins. Otherwise resume CURRENT. Never select an old PR, task-register item or roadmap entry by default.
4. Read only source, tests and specifications directly required by that task. PROJECT_STATE, VOLLEY_LOG, registries, orchestrator and architecture maps are on-demand references, never startup ritual.
5. Before implementation, append the complete new owner message verbatim to OWNER REQUEST ARCHIVE. After every material action append a dated JOURNAL entry with exact paths, SHAs, commands/results, limits and next step; update CURRENT/NEXT when changed.
6. Never store hidden reasoning, secrets, credentials or unnecessary sensitive personal data. If a prompt contains such material, redact only that span and mark the redaction.
7. Engineering: inspect diff; run focused checks; verify exact current HEAD and corresponding CI. Main-only; no PR creation unless owner changes that policy. No merge/deploy/force-push/rebase/reset/history rewrite/destructive data action without explicit authorization.

## RECORD FORMAT

`[YYYY-MM-DD] STEP-ID | status | task | changed paths | exact evidence/checks | limits | next`

Statuses: `FACT`, `PROPOSAL`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`. A document edit or successful build alone is not VERIFIED.

### OR-2026-11-17-006 — continue implementation to completion

```text
Ок, продолжай реализацию, все пункты должны быть реализованы качественно и эффективно
```

### OR-2026-11-17-007 — accelerate Landing 2.0 finalization and use the external-source register

```text
Ну так действуй, Нужна финализация лендинга и не тяп-ляп, да поскорее. У тебя не зря куча плагинов подключено для параллельной работы с тобой, есть терминал для параллельных задач и есть документ внешних источников, из которых черпай и черпай гениальные воплощения идей. Работай усерднее, быстрее, эффективнее, дольше, больше действий, не важно какими шагами, но много этапов. И давай не зависни! Отмечай все в документ; но блять без бешенной увлеченности, супер быстро. Поехали @Поиск
```

### OR-2026-11-17-008 — minimize Actions and replace slow Chromium in the routine loop

```text
Так, короче, ты всегда виснешь на получении заданий запуска GitHub Actions (как сейчас нахуй), и на долгих действиях ебучего хромиума. Короче, минимизируй вовлечение гитхаб actions в нашу разработку, только смотри блять механизм публикации на pages не трогай. А хромиум - ну тооочно 1000 процентов есть что-то с таким же функционалом, а то и даже лучше и эффективнее, но БЫСТРЕЕ. И менять не 2 часа, а быстро очень понял? И предыдущее сообщение мое не забудь только!! Там есть запросы, их важно знать!
```

### OR-2026-11-17-005 — continuity and immediate execution

```text
Ну пиздец, опять ты завис, новый чат епт. Now.md, только ПОЖАЛУЙСТА НЕ НУЖНО ДЕЛАТЬ ТЫСЯЧУ ШАГОВ ОРИЕНТИРОВАНИЯ, потому что это блять все, что ты делаешь перед тем, как зависнуть, а потом новый чат и ты опять блять ОРИЕНТИРУЕШЬСЯ по полной программе нахуй. Работай уже, а не ориентируйся! Работай!!!!!
```

### OR-2026-11-17-009 — immediate continuation of Landing 2.0 finalization

```text
Ну так работай! По многу этапов, поскорее нужна финализация лендинга со всеми моими правками
```

### OR-2026-11-17-010 — continue Landing 2.0 finalization

```text
Продолжи
```

### OR-2026-11-17-011 — continue Landing 2.0 with plugins and external sources

```text
Йоу? Продолжаешь? Лендинг 2.0, твои плагины, мои внешние источники, цель скорейшая финализация, но идеальная реализация
```

### OR-2026-11-17-010 — continue Landing 2.0 finalization

```text
Продолжи
```

- [2026-11-17] S-104 | IMPLEMENTED / E2E PENDING — CLOUD FORM ERROR ACCESSIBILITY + RU/EN | Parent main SHA `c8f33398a6df159afd62732f91096b5b117ec991`, parent tree `c484c06085c61052b797d7203c364a5776c1efcd`. Added `aria-describedby` relationships from the aServi URL/model/key fields to their inline alert nodes. URL validation, connection progress/status/success feedback now follows RU/EN; `setCloudStatus` now displays supplied status messages instead of discarding them. Extended failed-probe and in-flight settings-change regressions; added an English HTTPS validation test. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Local E2E/fast gate not run (no checkout mounted); no Actions started. | IMPLEMENTED, NOT VERIFIED. | Inspect exact child, verify Pages/Graphify, continue composer popover and remaining empty/error-state review.

- [2026-11-17] S-106 | IMPLEMENTED / E2E PENDING — MESSAGE VIEWER KEYBOARD ACCESS | Parent main SHA `28bde8278e7de87f1045673c4aa973705a3f3959`, parent tree `3ea0366c257f645b8579b502388006c24c418e9e`. Message viewer now captures its invoking message action, traps Tab/Shift+Tab through the shared visible-control helper, closes on Escape/backdrop/Close and restores focus to the opener (chat main fallback if rerendered). Close action name is localized RU/EN. Added `tabindex=-1` to chat main for safe fallback focus and extended the existing message-viewer E2E to assert focus entry, wraparound, Escape and opener restoration. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Local E2E/fast gate not run; no Actions started. | IMPLEMENTED, NOT VERIFIED. | Verify latest exact-head Pages/Graphify; continue composer popover and remaining dialog scroll-lock review.

- [2026-11-17] S-107 | IMPLEMENTED / E2E PENDING — COMPOSER POPOVER KEYBOARD + VIEWPORT | Parent main SHA `daf97623cda85cd97e867ea2653277f313e42567`, parent tree `34e957e75df71d84abb8e00eab07e595ca4bb7f4`. Attachment, request-context and voice popovers now constrain height to the live VisualViewport, scroll internally without chaining, move focus into their controls, trap Tab/Shift+Tab and return focus to the invoking trigger on Escape/scrim dismissal. Viewport resize updates the available popover height. Added E2E with 16 project rows on a 280px viewport asserting scroll constraint, focus wrap, Escape, focus return and scrim close. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Local E2E/fast gate not run; no Actions started. | IMPLEMENTED, NOT VERIFIED. | Verify exact child Pages/Graphify; continue native iPhone Safari/VoiceOver and remaining empty-state review.

- [2026-11-17] S-108 | IMPLEMENTED / E2E PENDING — USER REDUCED-MOTION CONSISTENCY | Parent main SHA `6e815e6c40bfc5847cae431f2dfd9f417ed3b5ba`, parent tree `97cf35f27ba3b8646eebfd45be540386e90eee7e`. The explicit `reduced` preference already stopped ticker and thinking-dot loops but left the infinite prompt-edit pulse and voice-menu entrance animation active. Added targeted selectors to disable those remaining animations without changing normal/auto motion or the stronger `off` mode. Added E2E asserting computed animation names are `none` for both controls when `#uiMotion=reduced`. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Local E2E/fast gate not run; no Actions started. | IMPLEMENTED, NOT VERIFIED. | Verify exact child Pages/Graphify and live root revision; native OS preference and device checks remain open.

- [2026-11-17] S-109 | IMPLEMENTED / E2E PENDING — COMPOSER NESTED SCROLL CONTAINMENT | Parent main SHA `a0dc2eb5782771171dc2d077f4b68ddb1531344f`, parent tree `d047ef8664207357b57ea64f5e82cd1edd0aaec2`. Added `overscroll-behavior:contain` to the nested request-project checklist so reaching its scroll edge does not chain into the outer composer popover. Extended the existing short-viewport E2E to assert the computed nested scroll policy. Exact-parent Pages #44019421986 and Graphify #44019422782 passed; live cache-bypassed page metadata reports revision `a0dc2eb5782771171dc2d077f4b68ddb1531344f`, and retired `/landing/` returns HTTP 404. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Local E2E/fast gate not run. | IMPLEMENTED; parent publication VERIFIED; new child pending. | Verify child Pages/Graphify and live revision; final native-device/owner visual gates remain open.

- [2026-11-17] S-110 | IMPLEMENTED / E2E PENDING — LONG SIDEBAR LABELS | Parent main SHA `61cbcc42fff9f33b865fba42ff1677306cebf43b`, parent tree `55138526b62a502f1cde4f8ee685909143830ba4`. Project navigation now wraps the name in a `min-width:0` truncation span while preserving the full title attribute; chat switch buttons expose the full title while retaining their existing truncate behavior. Added a 320px fixture with long project/chat names and assertions for title preservation, ellipsis and no horizontal sidebar overflow. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Parent Pages #44019421986 and Graphify #44019422782 passed on `a0dc2eb5782771171dc2d077f4b68ddb1531344f`; parent live revision and retired route were verified. Local E2E/fast gate not run; this child awaits Pages/Graphify. | IMPLEMENTED, NOT VERIFIED. | Verify exact child CI/live revision; empty lists, large counts, iPhone scroll and VoiceOver remain open.

### OR-2026-11-17-012 — complete all Landing 2.0 owner requirements and mandatory capabilities

```text
Доводим лендинг 2.0 до всех выполненных мною данных заданий, и 15 пунктов, и множественные дополнения, в виде инструментов и функций, кодера, ноутбука, конвертеров, переводчика, агентов, различных видов исследований и тд, которые должны обязательно быть. Нужна быстрейшая, но длительная работа, идеальная реализация. Твои плагины, мои источники, не забываем обновлять документ, но не тратим на него много времени. Го 🙏🏻
```

### OR-2026-11-17-015 — Notebook source conversation, Studio, Offline Core, AI Studio, Skill/Agent Factory and local files

```text
Ноутбук - не просто блакнот а место, где я смогу общаться с источником, у этого есть механизмы. Так же там я должен иметь возможность создать подкаст, презентацию, график-слайд и подобные вещи, сугубо из загруженных/указанных источников. Еще кодер должен быть «упакован» по-максимуму скиллами, базами данных, инструментами, способностями и в целом, настроен по лучшим канонам современности. Оффлайн ядро-пакет не забывай, для автономной работы аЛанди без интернета, будучи подключенным к файлу, предлагаемому к скачиванию в настройках аЛанди. Должно быть куда-то определено по смыслу меню, куда будет встроен инструмент создания своего ии, тобишь буквально можно будет запихнуть инфу и превратить в веса для ии, создавать маленькие ии целевого назначения, и все вокруг этого. Так же должен быть инструмент, который превращает любую книгу, да и в целом источник в навык, а то и в агента. Механизмы работы с локальными файлами должны бы и воплощены самые лучшие, оптимизированные и функциональные, которые только можно представить в современности, в частности можно туда подключать инструменты, которые у нас и так будут - вроде того, что превращает веб-страницу или даже картинку в json для ии. Отметь это сразу пожалуйста наверняка в документ все, если это нигде не сформулировано и вытащи на видное место, скоро нужно финализироватт лендинг и это все должно быть готово. Используй все плагины пожалуйста, что я тебе подключил, и используй документ с внешними источниками. Делай рывок уже множественными шагами и объемами работы раз в 5 больше, чем сегодня, за 1 запрос, постарайся образцово-показательно себя проявить. Спасибо заранее 🙏🏻 @Поиск
```

### OR-2026-11-18-001 — UI-first completion of all Landing 2.0 owner requirements

```text
Короче, в первую очередь приведи в порядок сайт, интерфейс, UI, меню, кнопки, тексты, разделы, функции, логику, оформление - все это в самую первую очередь, а потом реализуем другие пункты (из абсолютно всех, что я давал детально по всем направлениям для лендинга). В самом деле - давай уже сделай нормально сайт по моим требованиям, я устал об этих деталях просить. Там много чего; от меню настроек проекта, до каждого меню каждой функции, с наполнением, и многого другого, только ничего не упусти! Есть файл с моими ппомптами вот  из них детали с пунктами тоже перепроверить нужно. Давай только выбери оперативную тактику, работай быстрее и много. Все должно быть правильно систематизирована, оптимизирована. Используй вееешние источники, что я давал, используй плагины, что я тебе подключил
```

### OR-2026-11-18-002 — select an ideal high-throughput method and continue without losing any prior requirements

```text
Ну давай, только избери метод идеальной работы, чтобы сделать в разы больше и быстрее. Продолжай, только все детали, что я указывал
```

## JOURNAL — latest first
- [2026-11-18] S-129 | VERIFIED LIVE / CI PASS; EN BROWSER + PLAYWRIGHT PENDING — FUNCTIONS PANEL HIERARCHY | Exact main `d9b57cb3a9ceb919211d60e66c9651046611575c`; Pages #44285344948 SUCCESS and Graphify #44285346620 SUCCESS on this SHA; public `alandi-build-revision` equals exact SHA. TinyFish live browser verified RU AgentRun/Team blueprint and Skills/goal-output headings, explanatory non-independent-blueprint boundary, modal close and no console/runtime errors. Browser task did not verify English despite static RU/EN translation entries; do not claim EN live verification. Local Playwright not executed (no checkout). | UI implemented and published; RU live behavior verified; exact-head CI pass. | Continue detailed audit of each Functions control and chat/sidebar/composer; verify English via browser in a later focused pass; run focused Playwright when local runner available.
- [2026-11-18] S-128 | IMPLEMENTED / EXACT-HEAD CI PENDING — FUNCTIONS PANEL INFORMATION ARCHITECTURE | Parent `d27415b89684ff6e3cdd9a3c5d8f3670c7f13e75`. Reconciled against `docs/AGENT_FUNCTIONS_MENU_INFORMATION_ARCHITECTURE_RU.md` §0–2, `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` K.6.14–16, and V1 UI freeze. Functions Agent panel now visibly separates actual AgentRun availability from saved team blueprint and explicitly states blueprint does not launch independent agents; Skills panel separates chat-scoped task profile from goal/output format. RU/EN section headings and descriptions added; existing IDs, controls, persistence and runtime handlers retained. Focused RU/EN E2E assertions added. No runtime capability, connector, route, or backend added. | Code/test/docs pending exact-head CI and live browser verification; local Playwright not run (no checkout). | Verify Pages + Graphify on exact HEAD; then audit each Functions control and continue sidebar/chat/composer surfaces without expanding V1 scope.
- [2026-11-18] S-127 | LIVE UI VERIFIED / AUTOMATED E2E PENDING — PROJECT SETTINGS RU/EN | Exact main `de8cccb6c7ba6dad89ce2bb78f78cda78fdfab57`; Pages #44279540237 SUCCESS and Graphify #44279541754 SUCCESS on the same SHA; public root `alandi-build-revision` matches exact SHA. TinyFish browser inspected a temporary project through the create flow and its contextual settings route: all four Project Settings groups rendered in RU and EN, with no observed runtime errors. Temporary project was not present on the subsequent cleanup run; no existing project/chat was modified. The authored Playwright regression remains unexecuted because no local checkout is mounted. | Project Settings IA live behavior VERIFIED; browser E2E PENDING. | Continue UI-first Functions panel, then full RU/EN and interaction audit of remaining project, chat, settings and composer surfaces.
- [2026-11-18] S-126 | IMPLEMENTED / LIVE SETTINGS UI VERIFIED; PROJECT E2E PENDING — UI-FIRST SETTINGS IA | Parent `6af8a4e18f55353f8e3756d03dcd4bb6e75d22c6`; commit `f3eb4f891b57b590f4c5eda50a252b8848cf90c8`. Reorganized the existing global Additional settings into four purpose-labelled groups with RU/EN copy, preserving control IDs and handlers. Reorganized Project Settings into Chat/project context, Project profile, Project memory and Project data groups; existing Project Sources disclosure remains distinct. Added focused E2E assertions for both settings surfaces. Live Pages revision `6af8a4e18f55353f8e3756d03dcd4bb6e75d22c6` was published successfully; TinyFish browser verified all four global Settings headings in RU and EN with no observed console/runtime errors and no saved changes. Project Settings commit is on main; exact Pages/Graphify and Playwright E2E pending. No backend, storage, provider, permission or publication workflow behavior changed. | UI changes IMPLEMENTED; global Settings live behavior VERIFIED; project settings behavior and E2E NOT VERIFIED. | Verify latest exact-head Pages/Graphify, run focused project/settings E2E, then continue Functions menu and remaining screen-by-screen audit.
- [2026-11-17] S-125 | IMPLEMENTED / TESTS PENDING — CODER API/DB/DEBUGGING SKILLS | Parent `5c24ca0af912bd580df532160d454ea9199761e3`. Extended the fixed Coder Skill allowlist from four to seven with API contract design, database engineering, and debugging/observability. Guidance covers typed contracts, auth/idempotency/timeouts, parameterized and scope-bound queries, forward-only migration/backup discipline, reproducible diagnosis, redacted logs and performance measurement. Updated loader, contract test, `CODER_PACKET.md`, K.5 row #7 and architecture section #6. Skills are prompt guidance only and grant no connectors, credentials, DB or execution access. No new package or database installed. Exact-head Gateway checks pending. | IMPLEMENTED, NOT VERIFIED. | Run exact-head Gateway checks; continue building read-only code context as a distinct capability from Skills.
- [2026-11-17] S-124 | IMPLEMENTED / E2E PENDING — EXPLICIT CITATION VS CLAIM VERIFICATION | Parent main `1ffe419401fb2a807643968a9dc7ad9e7c2c6d21`. Notebook aServi turns now persist `citationValidationLevel=exact_evidence_id_membership_only` and `claimVerification=not_performed`; the system instruction tells the model not to imply that ID matching proves semantic entailment. Stored answer UI displays this limitation for fully resolved citation IDs; unresolved/missing IDs retain warning state. Evidence Report v1 exports both fields. E2E now creates a forged `[E99]` citation case, verifies it is unresolved, and checks both provenance levels plus stale invalidation. No model/provider/Gateway behavior or permissions changed. Browser E2E remains unexecuted. | IMPLEMENTED, NOT VERIFIED. | Verify exact-child Gateway/Pages/Graphify and execute Notebook Playwright under the full Quality gate only after current backend run completes.
- [2026-11-17] S-123 | VERIFIED CI-DRIVEN REGRESSION REPAIR | Exact parent HEAD `8278355fc9ffa875b8a485ea7e0d656efdba16d7`; initial Gateway #44130225536 caught a case-sensitive test expectation after 304 passed tests on Python 3.12/3.14. Root cause was test-only: `system_prompt` is lowercased but the assertion used uppercase. Corrected only the assertion (no runtime or security test weakened) in `1ffe419401fb2a807643968a9dc7ad9e7c2c6d21`. Gateway #44130595139 then passed all 3 Python versions and every workflow step: compileall, manifest/INTEL checks, full gateway tests, deployment preflight and six-layer eval. Pages #44130594328 and Graphify #44130595245 also passed on that test-repair SHA. | VERIFIED on exact SHA `1ffe419401fb2a807643968a9dc7ad9e7c2c6d21`; current UI child has no Gateway file changes. | Continue source-grounding/UI E2E and exact Pages/live marker check.
- [2026-11-17] S-122 | IMPLEMENTED / E2E PENDING — NOTEBOOK EVIDENCE REPORT EXPORT | Parent `cd9cc45b8256c73bedfc030580669e6cd6608238`. Added a separate RU/EN export action that emits only a versioned `alandi.notebook.evidence-report` JSON bundle: notebook scope metadata, source IDs/hashes, answer/question, exact excerpt text and Unicode offsets, citation status and stale-evidence state. It excludes unrelated notes, unselected source contents and original file bytes; stale evidence is retained but explicitly marked non-current. Extended the aServi source-chat E2E to parse the actual downloaded report, verify source hash/quote, ensure unselected note text is absent, and check stale marking after source deletion. No model/Gateway/network behavior changed. Browser E2E not run. | IMPLEMENTED, NOT VERIFIED. | Review exact diff and test syntax; next continue Coder read-only repository context and OpenShell artifact acquisition without installation.
- [2026-11-17] S-121 | IMPLEMENTED / TESTS PENDING — TRUSTED CODER SKILLS PACK | Parent main SHA `1d18b976f3700b76b8690d52f5e7f4c81c3bba5e`; code commit `800a01ca0a93a393c054c9359acb7b8caaacd091`. Added four portable `SKILL.md` guides under `skills/coder/` and a strict loader in `gateway/agent_runtime/skills.py`; wired the fixed bundle into only the non-executing AgentRun Coder system prompt. Loader enforces fixed IDs, frontmatter/name agreement, no symlinks/path escape, UTF-8 and per-file/aggregate size limits; it fails closed if a trusted Skill is missing. Added focused loader/security tests and strengthened the worker contract test; updated `docs/CODER_PACKET.md` and `INTEL.md`. No runtime permissions, tools, external dependencies, host flags, secrets or installations changed. External research reviewed OpenShell v0.1.8, CodeGraph v1.2.0, Cortex v3.5.0 and ACP v1; OpenShell remains candidate only and CodeGraph release archive SHA is not independently verified. Tests not executed (no repository checkout/terminal against GitHub). | IMPLEMENTED, NOT VERIFIED. | Continue evidence-preserving Notebook and Coder capabilities; keep tool permissions disabled until sandbox preflight and escape tests pass.

- [2026-11-17] S-120 | IMPLEMENTED / E2E PENDING — aNoteBooki MODEL-BACKED SOURCE CHAT | Parent main SHA `edd40b9422db906c81926a3d23c1ee510c44b335`. Extended the existing local evidence finder: source checkboxes are explicit (not auto-selected) and local evidence remains a separate offline/no-transfer action. Added aServi Q&A using only matching excerpts from selected notes/text files, with a confirmation showing source names, Gateway and model. Requests contain no tools/web/provider fallback. Q&A turns persist in IndexedDB with selected source hashes, exact quotes, code-point offsets and citation-ID checks; source deletion invalidates dependent evidence. Added RU/EN UI labels and Playwright coverage for selection isolation, model request, reload persistence and deletion invalidation. Updated K.5 row #10 and the Landing 2.0 architecture doc. E2E not run. Gateway RAG flags, VPS configuration, secrets, models and dependencies unchanged. | IMPLEMENTED, NOT VERIFIED (E2E pending). | Verify exact-head Pages/Graphify and focused Notebook Playwright; then implement evidence-report export before audio/deck/chart generators.

- [2026-11-17] S-120 | IMPLEMENTED / NOTEBOOK SOURCE CHAT FOUNDATION | On exact parent SHA `22e595fb1bb61d0e1376be25aabf03ed154337b9`, added a Notebook source conversation panel with explicit selection of imported text files/notes, RU/EN copy, bounded query input, browser-local Unicode lexical retrieval, up to six excerpts and exact character offsets, and explicit no-match/no-selection states. No network request, provider, Gateway, RAG flag, or auto-transfer is used. Added focused E2E regression covering import→select→ask→evidence citation, no RAG/chat network calls, and empty selection. Files: `notebook/index.html`, `assets/js/anotebooki.js`, `tests/e2e/notebook.spec.mjs`. Static source review confirms panel, handler and test are present; browser/E2E and JS parser were not run in this environment. Exact code SHA `d2b31b184e492117929bf0836b86a3ead11c8ef7`; Graphify #44122299395 and Pages #44122299396 were triggered on code SHA, outcomes pending at record time. | Local evidence retrieval IMPLEMENTED; generative source chat NOT IMPLEMENTED. | Next: connect this UI to a consent-gated, scoped Gateway retrieval + model path with strict selected-document filtering, exact evidence validation, and no-source fallback; only after confirming provider config and RAG runtime availability.
- [2026-11-17] S-119 | FACT / OWNER CLARIFICATION + UPSTREAM RESEARCH RECORDED | Parent main SHA `19b459df970f3eda0b48a4edb5108d60075e038d`. Archived OR-2026-11-17-015 verbatim in NOW. Verified the clarification is already covered by the visible Landing 2.0 architecture contract: source conversation/evidence; source-only podcast, editable deck and chart-slide; Coder with Skills/DB/tool adapters and isolated sandbox; downloadable local-only Offline Core; AI Studio separating RAG/datasets/LoRA-QLoRA/pretraining; source→Skill/Agent Factory; local file conversion and provenance. Refreshed relevant external evidence in INTEL: Groundcast (MIT, source-claim verification and local TTS; still a candidate, not adopted runtime), web.dev client-side AI performance guidance (device capability uncertainty, model-size/download/resume/cache concerns), WebLLM official local inference docs (WebGPU, OPFS cache, worker/COOP-COEP requirements), Agent Skills specification (SKILL.md contract). Exa reviewed these upstream pages; no package/model installed and no runtime or host flag changed. Exact-head Pages #44055827429 passed on parent SHA; Graphify, local fast-check, E2E, Gateway and live revision marker not checked in this step. | Requirements SPECIFIED; implementations remain PARTIAL/NOT IMPLEMENTED as per K.5 and architecture maturity. | Next: implement Notebook selected-source chat using scoped Gateway retrieval, strict selected-source filtering, exact BlockRef/citation validation and explicit data-transfer consent; keep RAG default-off and fail closed.

- [2026-11-17] S-118 | SPECIFIED / OWNER PRIORITY ELEVATED — LANDING 2.0 PRODUCT ARCHITECTURE 2.0 | Parent main SHA `12ebcdb0120e7e5b4bf31960642ad40cead55cb9`. Added `docs/LANDING_V2_PRODUCT_ARCHITECTURE_2_0_RU.md` with Source-first Notebook, source-grounded Studio, shared source/evidence/artifact contracts, local file provider, Coder+sandbox, downloadable Offline Core, AI Studio (RAG vs LoRA/QLoRA vs pretraining), Source→Skill/Agent Factory and catalog IA. Added K.6.19 to existing addendum, archived owner request verbatim, and linked 47-source TinyFish report and upstream sources in `INTEL.md`; K.5 remains the sole 15-point tracker. Research freshness: latest dated source 2026-10-31; 27/47 dated, 20 undated, none within requested recent window. Existing runtime remains partial; no flags/dependencies/weights/host settings changed. | Architecture SPECIFIED; runtime NOT IMPLEMENTED except previously existing partial foundations. | Next: implement Notebook source-chat MVS using existing scoped `/v1/rag/retrieve` + `/v1/chat/completions`, citation validation and opt-in Gateway capability checks.

- [2026-11-17] S-117 | IMPLEMENTED / LIVE ROUTE VERIFIED — aNoteBooki INTAKE HARDENING | Parent main SHA `8bc22efea33974fd1532743906ebc33a80841ee0`. Local text intake validates the 8-MB aggregate limit in the IndexedDB contract, rejects binary NULs, validates the entire batch before one IndexedDB transaction, and rejects unsupported/duplicate files without partial writes. File-import labels/hints follow RU/EN; the E2E base path respects the Pages subpath. Pages #44051779148 and Graphify #44051780427 passed on exact parent SHA; live root revision marker matches `8bc22efea33974fd1532743906ebc33a80841ee0`, `/notebook/` initializes IndexedDB and shows the text-file intake form, `/landing/` remains 404. Interactive CRUD/import E2E not executed. | IMPLEMENTED; route/storage bootstrap VERIFIED; CRUD/import UNVERIFIED. | Next: Agent Library manifest and distinct research-method contracts.

- [2026-11-17] S-116 | IMPLEMENTED / E2E PENDING — ATOMIC NOTEBOOK FILE INTAKE | Parent main SHA `e8544d552cef499a41afd907b43a35c30e65b6ae`. Corrected extension validation to literal-dot matching, rejected binary NUL bytes, and pre-validated/committed a selected file batch in one IndexedDB transaction so invalid or duplicate files do not partially import. Added batch duplicate checks and post-reload file persistence assertion. Local E2E remains unexecuted. | IMPLEMENTED, NOT VERIFIED. | Verify exact-head Pages/Graphify and live text-file import workflow.

- [2026-11-17] S-115 | IMPLEMENTED / E2E PENDING — NOTEBOOK TEXT INTAKE, SCOPE AND THEME | Parent main SHA `1184dd20729e25fc3757ffdb1ae52060f7b5fbb2`. Added bounded user-selected TXT/Markdown/CSV/JSON/HTML intake with strict UTF-8 decode, SHA-256, 10-file/2-MB-per-file/8-MB-batch limits, duplicate rejection and provenance; original bytes are not retained. Rejected credential-bearing URLs. Project selector filters chats to the selected project. Notebook follows `ai_ui_theme_v2` in dark/light modes. Added tests for file intake, scope isolation, theme and URL credentials. Applied existing INTEL.md/Local Source Vault research: native structure first; do not install heavyweight Docling/OCR before representative RU/EN/TH and resource/licensing evaluation. E2E not executed. Pages revision marker discrepancy from the parent Pages event remains open. | IMPLEMENTED, NOT VERIFIED. | Resolve exact Pages source/revision evidence, then implement PDF/Office/EPUB extraction with a pinned and licensed parser.

- [2026-11-17] S-114 | IMPLEMENTED / E2E PENDING — aNoteBooki NOTEBOOK FOUNDATION | Parent main SHA `1f72eb56aad9685de43bc5f6a40b0f748e4cb574`. Added same-origin `/notebook/` and sidebar entry; introduced versioned IndexedDB stores for notebooks, items and audit events; implemented project/chat attribution, user-authored notes, HTTP(S) URL references stored without fetching, provenance display and JSON export. Auto-transfer is explicitly false; no notebook content is injected into model requests. Added RU/EN UI and E2E coverage for persistence, project/chat links and no-fetch behavior. Updated K.5 row #10. Design basis: K.6.9/K.6.15 and existing INTEL.md IndexedDB/OPFS quota and same-origin boundaries. Local E2E not executed; exact-head Pages/Graphify pending. | IMPLEMENTED, NOT VERIFIED. | Verify Pages/Graphify and live /notebook/; then add evidence-aware source intake and explicit chat handoff without automatic prompt injection.

- [2026-11-17] S-113 | IMPLEMENTED / E2E PENDING — WEB SEARCH EXPLICIT OPT-IN MIGRATION | Parent main SHA `e0a913d47ba5d830cd3aad7095348fbcdbc4d231`. Corrected implicit-search migration paths: fresh UI state is unchecked unless an explicit saved `true` exists; legacy chat records without `searchMode` default to `offline` unless explicit web opt-in exists; imported legacy chats without a mode default to `offline`; UI fallback follows the same rule. Added E2E coverage for absent legacy preferences and imported records. Updated K.5 row #11, settings IA, UX backlog and archived OR-2026-11-17-012. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`, `NOW.md`. No local checkout is available; tests not executed. Pages workflow is preserved and will publish automatically on main push. | IMPLEMENTED, NOT VERIFIED. | Check exact-head Pages/Graphify; then continue K.5/K.6 capabilities with Notebook and Agent Library contracts.

- [2026-11-17] S-112 | VERIFIED / DOCUMENTATION RECONCILIATION — D-022 FUNCTIONS SCOPE | Parent main SHA `7ea6152464baece462fd12e7aab133da2e90c61e`. Read canonical `DECISIONS.md` D-022 and `docs/VOLLEY_LOG.md`: owner override explicitly requires four Functions entries (Agents, Deep Research, Skills, Connectors); the three-entry backlog statement was stale. Corrected `docs/LANDING_UX_POLISH_BACKLOG_RU.md` and synchronized NOW release status to exact current Pages/Graphify run IDs. No runtime change. | IMPLEMENTED / SOURCE RECONCILED; Pages/Graphify still running on parent. | Verify current deployment; continue implementation only against owner decisions, not stale backlog wording.

- [2026-11-17] S-111 | IMPLEMENTED / E2E PENDING — CONNECTORS EMPTY-STATE HONESTY | Parent main SHA `2260d14473b78acf860ab11cbdf1199d80a9c6db`, parent tree `92b38548d86f46ca0b8dcb1a49156b657c8c366a`. D-022 requires four Functions entries and a real connector registry; current build has no registry. Replaced vague “not connected yet” plus decorative progress ticker with an explicit RU/EN status: registry is not configured, no connection status/permissions/actions are queried, and no source is treated as connected. Added status semantics and RU/EN E2E assertions. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. No runtime connector or permission behavior enabled. Local fast-check/E2E not run (no checkout); no Actions started. | IMPLEMENTED, NOT VERIFIED. | Correct D-022 menu history in backlog, verify exact-head Pages/Graphify and live revision; then continue empty/error-state and mobile/visual acceptance.

- [2026-11-17] S-105 | IMPLEMENTED / E2E PENDING — 320PX PLACEHOLDER FALLBACK | Parent main SHA `e943f9e616b6166b354ba4814298670178cc143a`; parent tree `9e6f8f4b85050a3f201b4334af502f2a8f56c0fb`. Post-deploy screenshot confirmed `Текст…` fits at 390px but `Текст` is still clipped at 320px due the minimum-width 44px controls and remaining textarea content width. At <=340px the placeholder is now a single ellipsis; 341–360px uses `Текст` / `Type`; 361–420px uses `Текст…` / `Type…`. Added 340px to the RU/EN E2E matrix. Font-size and touch target dimensions remain unchanged. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. | IMPLEMENTED, NOT VERIFIED. | Deploy exact child and confirm the 320px placeholder visually.

- [2026-11-17] S-104 | IMPLEMENTED / E2E PENDING — NARROW COMPOSER PLACEHOLDER FIT | Parent main SHA `e84d10c04547a84919b5421d2068ea7292151fb6`; parent tree `0158369c708386eff822b17cd9f915d38b3ce60e`. Fresh live screenshots at 320px and 390px showed S-103 copy still clipped because textarea padding left too little text width. Tightened copy to `Текст` / `Type` at <=360px and `Текст…` / `Type…` at <=420px; added 4px horizontal padding only at <=360px. Font-size remains 16px; viewport zoom unchanged. Extended RU/EN E2E to assert the copy and 4px padding at <=360px. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Previous Pages #44018049676 and Graphify #44018050302 passed on parent; this child awaits new publication. | IMPLEMENTED, NOT VERIFIED. | Deploy exact child and visually recheck 320/390.

- [2026-11-17] S-103 | IMPLEMENTED / E2E PENDING — RESPONSIVE COMPOSER PLACEHOLDER | Parent main SHA `ad20b17fe96b5e5565f9ae1a4b1153c3e3e9b3a0`; parent tree `01e41fc8ae2c5c854347e5301bab0e469e420bc7`. Screenshot review at 390px found the long Russian composer placeholder wrapping and clipping in the narrow textarea; 1440px header/composer geometry looked balanced. Added localized responsive copy: `Текст…` / `Type…` at <=360px, `Сообщение…` / `Message…` at <=420px, full locale text above 420px. Resize listener updates it without changing input font-size or viewport zoom. Added E2E across RU/EN and widths 320/360/390/420/768, asserting selected copy and textarea scroll-height fit. Updated existing UX backlog to reflect root app, not a separate landing route. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Screenshot observation is visual evidence; Playwright/fast-check not run locally. | IMPLEMENTED, NOT VERIFIED. | Verify exact-head Pages and live revision; keep native iPhone Safari/VoiceOver open.

- [2026-11-17] S-102 | IMPLEMENTED / E2E PENDING — KEYBOARD-AWARE ACTION MENU PLACEMENT | Parent main SHA `63aaa9569e5663fea4ccae54d310b361544a48bc`, parent tree `cf18c1cf3db559b7546cf34ec5311e8664dad06d`. Updated the shared chat/project action-menu positioning helper to choose the side with more available visual-viewport space, cap panel height/width to that viewport, retain internal scrolling and contain scroll chaining. This addresses the short-viewport/software-keyboard case where the old 70dvh cap could leave the menu extending behind the keyboard. Added E2E coverage with a shortened mocked VisualViewport and assertions for viewport bounds, max-height and internal scroll. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Local E2E/fast gate not run (no checkout mounted); no Actions started. | IMPLEMENTED, NOT VERIFIED. | Inspect exact new HEAD and preserve Pages; continue composer popover/error/empty-state review.

- [2026-11-17] S-102 | VERIFIED / FINAL EXACT-HEAD PUBLICATION | Main SHA `0f1b3cfdef9a25198c6435a64f886db4f6fbd510`. Pages build/deploy #44016571123 passed (build, upload, deploy, report-build-status all success). Live cache-bypassed page metadata reports `alandi-build-revision=0f1b3cfdef9a25198c6435a64f886db4f6fbd510`; `/landing/` returns `page_not_found`, HTTP 404. Graphify #44016331011 passed on code parent `3167fc3e43264df3f66a19443fdb74773016b49f`. Verified current source contains Settings focus entry/return, Tab/Shift+Tab containment for Settings and project dialogs, and both focused E2E regressions. The Playwright tests and `scripts/fast-check.sh` were not executed: no repository checkout is mounted and Quality Actions are manual-only under OR-008. TinyFish browser automation outputs contradicted the live HTML/source and are not accepted as focus-runtime evidence. | Pages publication and route VERIFIED; UI focus code IMPLEMENTED, E2E PENDING. | Owner visual acceptance and native iPhone Safari/VoiceOver remain open; do not claim full visual/device finalization.

- [2026-11-17] S-101 | VERIFIED / CHECKPOINT RECONCILIATION | Parent main SHA `fc675930a3ca9b322a3918fdc277c08c5b92dfe7`. Re-read current main ref, source and E2E after the forward-only recovery; confirmed Settings focus entry/return, Settings Tab trap, project modal Tab trap and both regression tests are present on the current branch. Updated CURRENT to this exact parent SHA and clarified that Pages for this docs child is pending; Graphify passed on code parent `3167fc3e43264df3f66a19443fdb74773016b49f`. Live cache-bypassed root revision and `/landing/` 404 were verified on earlier published functional SHA `f48488201935f005fd2ac7c97ebc00f985d357b4`, not yet on this latest child. No Playwright/fast gate execution; no local checkout. | Source and E2E presence VERIFIED; runtime focus NOT VERIFIED. | Verify latest Pages deployment; keep Quality manual-only and preserve iPhone/VoiceOver owner gates.

- [2026-11-17] S-101 | IMPLEMENTED / RESTORE CANONICAL UX TRACKER | Parent main SHA `3167fc3e43264df3f66a19443fdb74773016b49f`; parent tree `b0306941a0bf2e5395db60b5ccd36e522201ff0f`. Restored the root-only route contract, current Pages evidence, and modal keyboard-acceptance status in the existing UX backlog; added the superseding root-route note to the existing V1 checklist. These docs had been omitted from an earlier tree snapshot and are now restored on the current tree without touching runtime code or tests. Runtime focus code and E2E files remain present on the parent. Pages #44016330347 pending and Graphify #44016331011 running on parent SHA at record time. | IMPLEMENTED; doc consistency restored. | Verify current exact-head Pages/Graphify and final source preservation.

- [2026-11-17] S-100 | IMPLEMENTED / RECOVERY — RESTORE MODAL FOCUS CODE ON CURRENT TREE | Parent main SHA `5e1611d767dbdecc83aee9028fc057b26211e904`, parent tree `a5592f31451493c78582ccc133d836f529182f4b`. Corrective forward-only commit restores Settings focus entry/return and Tab containment plus project create/edit dialog containment, together with the two dedicated E2E assertions, after a prior documentation tree snapshot omitted these code/test blobs. No history rewrite or force update. Exact changed paths: `index.md`, `tests/e2e/app.spec.mjs`, `NOW.md`. Previous Pages #44014952378 and Graphify #44014953365 passed on functional parent `f48488201935f005fd2ac7c97ebc00f985d357b4`; this corrective SHA awaits Pages. Local E2E and fast gate not run; no checkout mounted. | IMPLEMENTED, NOT VERIFIED. | Verify current HEAD and Pages exact SHA; do not start Quality Actions under OR-008.

- [2026-11-17] S-099 | VERIFIED / OWNER REQUEST ARCHIVE SYNC | Parent main SHA `a37b3b4813d17ec7a0130e89afae24818b1021b9`. Confirmed the latest owner request OR-2026-11-17-009 is archived verbatim and the checkpoint owner-request counter now includes it. Current product surface remains the root app; the previous exact-head Pages/Graphify and cache-bypassed live-route evidence is recorded in S-098. This checkpoint-only commit changes no runtime code. Pages/Graphify for this new documentation SHA will be checked after push. | IMPLEMENTED; state record synchronized. | Verify final exact-head Pages/Graphify and stop.

- [2026-11-17] S-098 | VERIFIED / LIVE PUBLICATION — ROOT REVISION AND ROUTE | Main SHA under verification: `f48488201935f005fd2ac7c97ebc00f985d357b4`. Pages build/deploy #44014952378 and Graphify #44014953365 both passed on this exact SHA. Live fetch with cache bypass returned page metadata `alandi-build-revision=f48488201935f005fd2ac7c97ebc00f985d357b4`; the retired `/landing/` path returned `page_not_found`, HTTP 404. Two TinyFish browser automation attempts could not reliably inspect DOM attributes or `document.activeElement` (their reports contradicted fetched live HTML and source); do not treat them as focus verification. Settings and project modal focus E2E tests are committed but were not executed; Quality remains manual-only per OR-008; no local checkout is mounted. | Publication and route VERIFIED; keyboard runtime NOT VERIFIED. | Continue root-app mobile/accessibility finalization; keep actual iPhone Safari/VoiceOver and focused Playwright execution as separate gates.

- [2026-11-17] S-097 | IMPLEMENTED / E2E PENDING — PROJECT MODAL KEYBOARD CONTAINMENT | Parent main SHA `c70d31e6ac7ce2daaa671b7ab04bb1b204d3471e`; resulting implementation SHA `f48488201935f005fd2ac7c97ebc00f985d357b4`; Pages #44014952378 and Graphify #44014953365 passed. Added one bounded Tab/Shift+Tab containment helper to both project-create and project-settings dialogs; existing Escape close and opener/fallback focus restoration are preserved. Extended the project-create E2E scenario to assert wraparound in both directions before Escape and focus return. Updated the existing UX backlog; no new tracker or dependency. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `NOW.md`. Local Playwright/fast-check not run because no repository checkout is mounted; Pages/Graphify from parent SHA passed. | IMPLEMENTED, NOT VERIFIED. | Continue remaining modal/menu keyboard and mobile checks; run focused E2E plus fast gate when repository checkout is available.

- [2026-11-17] S-096 | IMPLEMENTED / E2E PENDING — SETTINGS MODAL KEYBOARD CONTAINMENT | Parent main SHA `f43e4aa7964327fdc81abc3da6789194cdbeaf10`. Settings now moves focus to Close on open, traps Tab/Shift+Tab within visible controls, closes through the existing Escape path, and restores focus to the opener (or the header settings trigger if the original opener is no longer available). Added a dedicated Playwright regression covering focus entry, both trap directions, Escape and focus return. Corrected the UX backlog and V1 checklist to reflect the live root-only route contract; `/landing/` is retired/404, not a pending page. Updated current release evidence with Pages run #44013506559 success on the parent SHA. Files: `index.md`, `tests/e2e/app.spec.mjs`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `docs/V1_UI_FINALIZATION_RU.md`, `NOW.md`. No local checkout is mounted; focused E2E and fast gate have not run. | IMPLEMENTED, NOT VERIFIED. | Run local `bash scripts/fast-check.sh` and the focused Settings modal E2E from a real checkout; keep iPhone Safari/VoiceOver as owner-device gates.

- [2026-11-17] S-095 | IMPLEMENTED / SOURCE AUDIT COMPLETE — REPRODUCIBLE A11Y CHECK | Main before this state record `78712db6bfa716054ec17ba32c7be574ac5a73ad`. Added dependency-free `scripts/check_a11y_surface.py` using Python stdlib `HTMLParser`; it checks visible input/select/textarea accessible-name sources, non-empty button names and the runtime-localized field label map (`383de568`, regex/visibility fixes `df1a73cf`, `e15ed7bd`). Added it to `scripts/fast-check.sh` (`17798db4`). Source inspection against current root `index.md`: 5 visible form controls, 28 buttons, 0 unnamed controls/buttons; all 8 runtime-labeled IDs present. The exact checker copy passes `python -m py_compile` and positive/negative synthetic fixtures in /tmp; the committed script was not executed against a mounted repository checkout. Updated existing UX backlog (`docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `78712db6`). | IMPLEMENTED; source scan and isolated fixtures pass; full repo execution and native accessibility remain open. | Continue root-client K.5 finalization; use `bash scripts/fast-check.sh` locally when checkout exists; reserve manual Chromium for CSS geometry and actual published Pages smoke.

- [2026-11-17] S-094 | IMPLEMENTED / VERIFICATION PENDING — LOCALIZED SIDEBAR TOGGLE NAME | Main before this state record `b8c5b73dcb31c1d1f018ad79bbc0e98acff4e7eb`. Added RU/EN keys for the sidebar trigger's action name; it now announces «Открыть меню» / «Закрыть меню» and “Open navigation” / “Close navigation” as its expanded state changes. The dynamic key is retained in `data-i18n-aria-label` so subsequent language changes stay synchronized (`index.md`, `9a505400`). E2E and optional Lightpanda smoke assert all four localized names (`tests/e2e/app.spec.mjs`, `7b4fa829`; `scripts/lightpanda-smoke.mjs`, `02eb80c4`). Updated the existing UX backlog (`docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `b8c5b73d`). No runtime/browser execution; code remains IMPLEMENTED, NOT VERIFIED. | IMPLEMENTED, NOT VERIFIED. | Continue remaining K.5 mobile and form acceptance; use the local fast gate and reserve visual browser checks for manual review.

- [2026-11-17] S-093 | IMPLEMENTED / AUTOMATION NOISE REDUCED — STATE FRESHNESS LOCAL-FIRST | Main before this state record `e4830c36a41c0d2e15c44b8fa8fb6ac30c631e99`. Changed `.github/workflows/project-state-freshness.yml` from automatic push/PR/daily schedule to manual `workflow_dispatch` only (`1c4825b2`). Added its deterministic unit suite to `scripts/fast-check.sh` (`e4830c36`). Workflow commit: `1c4825b2`. The manual workflow retains the full live GitHub checkpoint/queue verification; the local fast gate runs the unit tests without Actions. This avoids repeated remote runs on every NOW/checkpoint edit. No Pages publishing mechanism changed. No Actions run started; local suite not run because no repository checkout is mounted. | IMPLEMENTED, NOT VERIFIED. | Continue K.5 landing work; run local fast gate from a real checkout, use manual state freshness only for explicit checkpoint validation.

- [2026-11-17] S-092 | IMPLEMENTED / AUTOMATION NOISE REDUCED — EXERCISE WORKFLOWS | Main before this state record `71e50fcc4f854a441e40156b84c23dfd2ad470b7`. Changed `.github/workflows/0-start-exercise.yml`, `1-step.yml`, `2-step.yml`, `3-step.yml`, `4-step.yml` to `workflow_dispatch` only; removed their push and page_build triggers. These are the unrelated GitHub Skills Pages exercise/issue-posting flows (including bot-created issue #186), not the aLandi site publication pipeline. Their manual entry points remain. Commits: `ab407995`, `0dd1fdb5`, `ccff0f73`, `5a24cd8d`, `71e50fcc`. Combined with the manual-only Quality workflow, normal aLandi commits no longer invoke these unrelated exercise actions. No Pages publishing workflow/configuration/source was changed; no issue was closed or deleted. No Actions run started. | IMPLEMENTED; trigger changes inspected in source; no workflow execution. | Continue K.5 root-app finalization; keep only intentional path-filtered backend/state gates and manual quality checks.

- [2026-11-17] S-091 | IMPLEMENTED / VERIFICATION PENDING — EMPTY-PROJECT FOCUS FALLBACK | Main before this state record `120ac68b3e7202f3e4f54e1340a366c6513b3d02`. Tightened the chat action dialog's no-project path: when the move action cannot open because no projects exist, it now restores focus to the originating menu summary after showing the notice instead of leaving focus in a closed menu (`index.md`, `045186bd`). Updated the existing UX changelog (`docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `120ac68b`). No Actions run and no browser runtime check. | IMPLEMENTED, NOT VERIFIED. | Continue existing K.5 dialog and form acceptance; keep the manual-only quality workflow and Pages publication boundary unchanged.

- [2026-11-17] S-090 | IMPLEMENTED / VERIFICATION PENDING — CHAT ACTION DIALOG KEYBOARD FLOW | Main before this state record `b7d59b8a9f536377a01e78dddf8f241ba997857b`. The chat rename/move dialog now captures its originating menu summary, focuses the active input/select, traps Tab/Shift+Tab inside visible controls, closes on Escape and restores focus to the trigger; after a list rerender it locates the new chat-row summary or uses the sidebar toggle fallback (`index.md`, `72327b4e`). Project-move select exposes localized label/help relationships (`50ff6ec6`). E2E asserts accessible name/description, initial field focus, Escape close/focus return and keyboard wraparound (`tests/e2e/app.spec.mjs`, `6e5e0ce3`). Existing UX backlog updated (`docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `b7d59b8a`). No browser suite or Actions run; runtime behavior is not yet VERIFIED. | IMPLEMENTED, NOT VERIFIED. | Continue the existing K.5 modal/form pass with remaining settings dialogs, error/focus states and compact mobile behavior; do not broaden into new architecture.

- [2026-11-17] S-089 | IMPLEMENTED / STATIC AUDIT COMPLETE — CHAT PROJECT SELECTOR LABEL | Main before this state record `0333472b5aec0dd8a3efb0e3b15fef0b6825a45a`. Added `aria-labelledby="chatActionFieldLabel"` and `aria-describedby="chatActionHelp"` to the project-move select, whose visible label/help are already updated for RU/EN (`index.md`, `50ff6ec6`). Existing project-scope E2E now asserts both relationships before changing the selected project (`tests/e2e/app.spec.mjs`, `097876f6`). A bounded static scan of live root HTML found 0 visible input/select/textarea controls without a label/ARIA name (hidden file inputs excluded) and 0 buttons without an accessible name by explicit ARIA/title/text. This is a heuristic structural scan, not a WCAG/screen-reader certification. Updated existing UX backlog changelog (`docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `0333472b`). No browser suite or Actions run. | IMPLEMENTED; structural audit passed; runtime and native screen-reader verification remain open. | Continue the same K.5 form/accessibility pass: check visible inline errors and keyboard/focus in dialogs, then responsive behavior. Do not add new backlog.

- [2026-11-17] S-088 | IMPLEMENTED / VERIFICATION PENDING — SIDEBAR FOCUS ISOLATION | Main before this state record `7e506b34e4b98d82abd255ccfc1713a0970ebd77`. Closed sidebar now starts `inert` and `aria-hidden`; `toggleSidebar` synchronizes those states and `aria-expanded`, moves focus to the Close control on open, and restores focus to the trigger when closed (`index.md`, `ea06d0a2`). Added E2E assertions for inert/visibility/focus return (`tests/e2e/app.spec.mjs`, `36332c00`) and extended the opt-in Lightpanda smoke (`scripts/lightpanda-smoke.mjs`, `616780b2`). Updated existing UX backlog evidence (`docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `7e506b34`). Latest smoke copy passes `node --check /tmp/lightpanda-smoke.mjs`; repository-wide checks and actual runtime behavior remain unverified because no checkout/network is available. No Actions run started; Pages publishing mechanism untouched. | IMPLEMENTED, NOT VERIFIED in a browser. | Continue the existing K.5 pass through navigation, forms, responsive states and keyboard/focus; use local fast gate first, Lightpanda for DOM and manual Chromium only for actual layout.

- [2026-11-17] S-087 | IMPLEMENTED / VERIFICATION PENDING — SIDEBAR NAVIGATION ACCESSIBILITY | Main before this state record `fc0d46ae163a9ed2cbe2efb643ba835ba94114e2`. In `index.md`, the project/chat sidebar now exposes a named navigation landmark; its trigger declares `aria-controls="sidebar"` and `aria-expanded`, synchronized on every open/close path (`351004a4`). Added RU/EN keyboard-independent state assertions in `tests/e2e/app.spec.mjs` (`f862c61e`) and included the same DOM contract in the optional Lightpanda smoke (`b33b5097`). Recorded this slice in `docs/LANDING_UX_POLISH_BACKLOG_RU.md` (`fc0d46ae`). Not yet run against a real browser/runtime; no GitHub Actions run started. The Pages publishing mechanism remains untouched. | IMPLEMENTED, NOT VERIFIED. Lightpanda remains an opt-in experiment; CSS geometry still requires the manual Chromium gate or a real device. | Continue K.5 finalization: inspect form labels/errors and mobile navigation behavior; run dependency-free checks and Lightpanda only when a local checkout is available.

- [2026-11-17] S-086 | IMPLEMENTED / VERIFICATION PENDING — ACCESSIBLE CUSTOM FIELDS + FAST DOM SMOKE | Main before this state record `a6fcd54def27edca25649b19a4d80b9cd0c36d04`. Added RU/EN E2E coverage for custom Agent team fields (`tests/e2e/app.spec.mjs`, commit `c82e3b01`); expanded Lightpanda smoke to exercise Skills and Agents custom fields in both locales (`scripts/lightpanda-smoke.mjs`, commits `8e231680`, `f7364355`); extended dependency-free fast gate with syntax checks (`scripts/fast-check.sh`, `ff04f729`). Updated the existing Landing UX backlog changelog (`docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `a6fcd54d`). Isolated syntax checks passed: `node --check /tmp/lightpanda-smoke.mjs` and `bash -n /tmp/fast-check.sh`; these were copies, not a full repository run. No Lightpanda browser session, Chromium suite, full fast gate or GitHub Actions run executed. Pages publication workflow/mechanism remains untouched. | IMPLEMENTED, NOT VERIFIED; DOM engine compatibility and app behavior need a real checkout/run. | Continue K.5 landing acceptance: navigation, mobile layout, forms and keyboard/focus; run the local fast gate first, Lightpanda for DOM behavior, Chromium only for layout/device-specific evidence.

- [2026-11-17] S-085 | IMPLEMENTED / VERIFICATION PENDING | Parent main `2f1339fd71526ca71e14042d5dcd523e2eda0818`; current tooling HEAD before this record `80cae1c0e795b44042d754f7cef4ea5807dec0b6`. Archived OR-007 and OR-008 verbatim. Changed `.github/workflows/quality-sentinels.yml` to manual-only; static analysis, full Chromium and live Pages release-contract checks are opt-in. Added `scripts/fast-check.sh` (dependency-free local integrity/security/context/action-pinning/syntax/diff gate), `scripts/lightpanda-smoke.mjs` (Functions → Skills and RU/EN accessible-name DOM smoke), and a Lightpanda job to the manual quality workflow. Updated `INTEL.md` and `docs/LANDING_UX_POLISH_BACKLOG_RU.md` with upstream evidence and the important limitation: Lightpanda executes JS/DOM but does not render CSS layout; official upstream benchmark reports 43/66 WebDriver docs tests passing and 2.6x/4.4x speedup only on the shared passing subset. Pages publication mechanism and publishing workflow were not edited. No local verification: repository checkout is not mounted; `git clone` failed because this runtime cannot resolve github.com. No GitHub Actions run was started or polled. | IMPLEMENTED, NOT VERIFIED. The fast gate, Lightpanda compatibility and workflow syntax must be executed from a real checkout; Chromium remains manual-only for true viewport/layout evidence. | Continue root-app Landing 2.0 acceptance, starting with responsive/navigation/accessibility/forms; run `bash scripts/fast-check.sh` and Lightpanda smoke locally when a checkout is available; keep Pages publication untouched.

- [2026-11-17] S-084 | DOCUMENTATION CHECKPOINT REPAIR | Documentation parent `d3520e0eee70ee9a2b6a3f887e0008c3b6cfe3dc`; functional code/test checkpoint `c7ac7ab976ae5333010b72370b6f1fec28c9c655`; 0 open PRs; issues #111 and #186. Freshness #44007278149 exposed that `root_orienter.base_main` had not been synchronized to the snapshot; this child now aligns `root_orienter.base_main`, `current_checkpoint.verified_main` and snapshot `main_sha` with the direct parent. Provenance #44007278170 passed on the prior documentation parent; exact-child gates are rerun. No product code/tests/backend/runtime/dependencies changed. | DOCUMENTATION REPAIR; exact-child Freshness/Provenance pending. | Next: verify both state gates on this direct child.
- [2026-11-17] S-083 | DOCUMENTATION CHECKPOINT REPAIR | Documentation parent `760fc736be44c361beedcf43e394dc493c823e15`; functional code/test checkpoint `c7ac7ab976ae5333010b72370b6f1fec28c9c655`; 0 open PRs; issues #111 and #186. Freshness #44007278149 found `root_orienter.base_main` did not match snapshot `main_sha`; the prior repair already restored the required NOW markers. Provenance #44007278170 passed on the prior documentation parent. This direct child synchronizes `root_orienter.base_main`, `current_checkpoint.verified_main` and snapshot `main_sha`; all five mandatory state files are refreshed together. No product code/tests/backend/runtime/dependencies changed. | DOCUMENTATION REPAIR; exact-child Freshness/Provenance pending. | Next: verify both state gates on this direct child.
- [2026-11-17] S-082 | DOCUMENTATION CHECKPOINT REPAIR | Documentation parent `c0c74fb5be14f63edb1666f55600559512ad1c42`; functional code/test checkpoint `c7ac7ab976ae5333010b72370b6f1fec28c9c655`; 0 open PRs; issues #111 and #186. Freshness #44007011572 rejected the prior state refresh because NOW.md lacked the exact no-default-PR sentence and open PR/issue snapshot markers; Provenance #44007011860 passed on the prior documentation parent. Restoring the required markers and updating the snapshot parent to c0 so this commit is a direct child. No product code, tests, backend, runtime or dependencies changed. | DOCUMENTATION REPAIR; exact-child Freshness/Provenance pending. | Next: verify Freshness and Provenance on the direct child.
- [2026-11-17] S-081 | IMPLEMENTED / VERIFIED — SOURCE MANAGER + K.5 UI SLICE | Functional main `c7ac7ab976ae5333010b72370b6f1fec28c9c655`; exact Quality #44006105936 SUCCESS (7/7: 143 built-app Chromium + 1 published-site smoke, deployed revision exact); Graphify #44006105833 SUCCESS; Pages #44006104480 SUCCESS; Gateway #44004983557 SUCCESS on backend `f69a999b23d30eedb0b9157eabccf97e2dfd04c7` (no Gateway changes in this descendant). Implemented project-scoped Sources manager in `index.md`: upload supported files via Gateway extraction, bounded chunking, SHA-256 deduplication, scoped ingest/catalog/delete, metadata and 1200-character first-chunk preview; disclosed original bytes are not retained. `gateway/rag/lazy_graph_rag.py` allowlists/validates bounded preview metadata; `gateway/tests/test_rag_rrf.py`, `gateway/tests/test_six_layers.py`, `gateway/README_RU.md` cover/document it; `tests/e2e/app.spec.mjs` covers upload, dedup, preview, delete, capability gating and 44px touch targets. Quality #44005284336 on prior `31965169483634e64dd5cd98e7dae03d39019620` first exposed a DOM `document` shadowing defect; fixed in `c7ac7ab976ae5333010b72370b6f1fec28c9c655`, then exact Quality passed. No VPS/host config, secrets, original-file storage, runtime or dependency change. Physical iPhone Safari/VoiceOver and owner acceptance remain OPEN; Freshness/Provenance run on the direct-child state refresh. | IMPLEMENTED / VERIFIED for Chromium + published site. | Next: exact-child Freshness/Provenance, then native iPhone Safari/VoiceOver and remaining compact mobile hierarchy/accessibility acceptance.
- [2026-11-17] S-080 | IMPLEMENTED / CI VERIFICATION IN PROGRESS | Parent main `d0d69e43fda42bd8b9869dcc7d9ef801647be6b6`; code/test HEAD `560de1256b7e1934588064b9d78e8a3f1a52b7a0`; 0 open PRs; issues #111 and #186 (#186 unrelated). `index.md` applies 16px font size to mobile text-entry inputs, textareas and selects at <=640px, excluding checkbox/radio/range/hidden/button/submit/reset; viewport zoom is not disabled. `tests/e2e/app.spec.mjs` covers all visible text controls at 320px/390px and no horizontal overflow. CSS commit `3852eefac7d8f6fb9142c381f93e2dea40afb987`; E2E commits `008a60fb5b6d079ba69b889414e706bb9e571011` and `560de1256b7e1934588064b9d78e8a3f1a52b7a0`. Graphify #43999719873 SUCCESS; Pages #43999720097 SUCCESS; Quality #43999719950 was in progress when this checkpoint was captured. No Gateway/backend/dependency/runtime change. Physical iPhone Safari and VoiceOver remain unverified. | IMPLEMENTED; exact-head Quality and direct-child Freshness/Provenance remain to be verified. | Continue K.5 #1 remaining Memory IA, project Sources, no-project status stripe and native mobile/voice acceptance.
- [2026-11-17] S-079 | VERIFIED / HEADER CONTEXT UI | Parent main `bc6cee08c3d28fec3a6ac4d61019d958f92ba779`; 0 open PRs; issues #111 and #186 (#186 unrelated). `index.md` adds a persistent header capsule distinguishing personal chat vs project and showing the project's memory scope; localized RU/EN, accessible name/title and 390px no-overflow assertion. E2E verifies long project name, filter does not switch active chat, project-only vs project+global memory scope, personal-chat label and language switch. Exact Quality #43998698846 SUCCESS (7/7; 140 built-app Chromium + 1 published-site Chromium), Graphify #43998698805 SUCCESS, Pages #43998698607 SUCCESS; published `alandi-build-revision` matched exact main SHA. | IMPLEMENTED / VERIFIED on exact HEAD. Native iPhone Safari and VoiceOver remain separate. | Reconcile remaining K.5 #1 Memory IA, project Sources, no-project status stripe and mobile/input acceptance; no new architecture backlog.
- [2026-11-17] S-078 | VERIFIED / UX-040 PROJECT-SCOPED NEW CHAT | Commit `1bc89a103f6f56fab2a545ebc237e8f66b1292dd`, included in verified descendant `bc6cee08c3d28fec3a6ac4d61019d958f92ba779`. `tests/e2e/app.spec.mjs` verifies that after selecting a project, persistent New Chat creates a chat with that projectId and the chat appears in the filtered list; existing tests cover filter/back and preservation of active chat context. Quality #43998087033 passed 140 built-app Chromium + 1 published-site smoke; descendant Quality #43998698846 passed 140+1 again. | Core UX-040 flow IMPLEMENTED / VERIFIED. Long/empty/large lists, keyboard, scroll restoration and native mobile remain open, so registry status remains PARTIAL. | Continue K.5 #1 remaining UI acceptance.

- [2026-11-17] S-077 | IMPLEMENTED / DOCUMENTATION ROUTING | Parent main `67f5f4b05389ef6e24422ece1e59653e6e893258`; 0 open PRs; issues #111 and #186 (#186 is unrelated bot exercise). Archived OR-2026-11-17-004 verbatim. Routed all 18 proposals from OR-003 into the existing K.5 15-point tracker; no duplicate backlog or technology adoption. Explicitly preserved the root-only static Pages/Jekyll V1 boundary; Cloudflare Pages/Vite, fallback routing, new runtimes, models, dependencies and sandbox remain deferred pending measured need and owner/environment gates. Current parent CI: Quality #43977273979 SUCCESS (7/7, built-app Chromium + published-site smoke), Graphify #43977273839 SUCCESS, Pages #43977272921 SUCCESS. Updated NOW, AGENTS, PROJECT_STATE, snapshot, VOLLEY_LOG and K.5 addendum as one direct-child documentation commit. No product source, tests, dependencies, model artifacts, host settings, credentials or runtime changed. | Documentation mapping IMPLEMENTED; Freshness/Provenance and exact-child Quality/Graphify/Pages pending. | Inspect K.5 #1 owner-designed UI against index.md and E2E; take the smallest complete landing-finalization slice, then exact-head CI.
- [2026-11-17] S-068 | IMPLEMENTED / EXACT-HEAD VERIFICATION PENDING | Parent main `619a288a7a57ce1cf1b997c0c1c9b06d464fd66e`; 0 open PRs; issue #111. Main chat now submits explicit AgentRun tasks with bounded selected context; acceptance returns immediately so the composer remains usable while one durable observer polls. Added chat-anchored collapsible status, server-created elapsed time, task states, allowlisted/deduplicated event labels, terminal summary persistence/dismiss, reload recovery, 44px controls and cancellation retry after a 503. Updated `index.md` and `tests/e2e/app.spec.mjs`; E2E covers non-blocking composer, reload resume, 320px viewport, keyboard disclosure, event/prompt redaction and cancellation retry. Parent checks: Gateway #43932615910 PASS (Python 3.12/13/14), Graphify #43932615895 PASS, Pages #43932615598 SUCCESS with public root exact, Provenance #43932615991 PASS; Quality #43932615960 static/security/integrity/context/Jekyll PASS, Chromium in progress; Freshness #43932615859 failed only because the prior snapshot SHA was stale (21/21 checker tests passed). Tree recovery audit: an intermediate commit `f2af7501fe74f418fbbf615fb2f0b468d64b25ac` was created without its base tree; forward-only child `619a288a7a57ce1cf1b997c0c1c9b06d464fd66e` restored the full 367-entry tree. GitHub compare from prior good parent `12a1ed43d6af3618dbccc5685bb447f5a851b68f` shows only `index.md` and `tests/e2e/app.spec.mjs` changed. No force-push/reset/rebase; public root serves exact 619a. | IMPLEMENTED / partial; exact-child gates pending. Feature-off host boundary, one worker, no tools/filesystem/network unchanged. | Next: atomic state refresh, exact-child gates, then Plan 2.
- [2026-11-16] S-067 | FRESHNESS ROOT-CAUSE REPAIR | Parent main `b81d45ee6653dcc0f3d92f4275354ade7c7ba202`; exact failure #43905603329 reported `docs/VOLLEY_LOG.md: missing checkpoint main SHA 400e42ce1d43a2e91410be9041d235167c1907cb`. Root cause: previous log recorded shortened `400e42c` only, while checker requires exact full SHA. Add exact full parent and current parent SHAs to the journal and refresh the five required state files as one direct child. Other current parent gates: Pages build #43905601623 success; Quality static/security/integrity/context/Jekyll pass; Chromium still running; model/voice provenance #43905603268 pass. | DOCUMENTATION REPAIR; exact-child recheck pending. | Verify Freshness/orientation, full Quality/Chromium and Pages/public root; then Plan 1 TDD.
- [2026-11-16] S-066 | FIVE-FILE OR-012 STATE REFRESH | Parent main `400e42ce1d43a2e91410be9041d235167c1907cb`; 0 open PRs, issue #111. OR-012 archived in NOW; K.6.17/K.6.18, K.5 and Agent Functions IA updated; both plans owner-approved. This direct-child commit refreshes NOW.md, AGENTS.md, docs/PROJECT_STATE.yaml, docs/project-state-snapshot.json and docs/VOLLEY_LOG.md together. No product source, dependencies, model artifacts, host settings or runtime changed. Exact-child Quality/Freshness/Provenance/Pages pending. | DOCUMENTATION STATE IMPLEMENTED; exact-child verification pending. | Verify exact-head checks and continue Plan 1 TDD; plugin/upstream research in parallel.
- [2026-11-16] S-065 | OWNER APPROVAL + OR-012 ARCHIVE / AGENT ECOSYSTEM & TRANSLATION ACCEPTANCE | Parent main `b2fd9f23a0b8035fc7fc9d1432211c158824d285`; 0 open PRs; issue #111. Owner approved Plan 1 and Plan 2. OR-012 archived verbatim immediately after mandatory orientation. K.6.17 adds versioned Agent Library, multi-model specialist routing, custom agents/scenarios, user-directed two-agent dialogue, bounded simulation, explicit tool grants, safe versioned learning and richer Skills/Research menus; K.6.18 adds embedded translation and licensed RU/EN/TH grammar packs. Updated K.5 in place, menu IA, approved plans and state checkpoint. No product code, dependencies, model downloads, host settings, credentials or external services changed. | SPECIFIED / OWNER-APPROVED PLAN; implementation not yet started. | Next: exact-child checks; then TDD Plan 1 while plugin/external source research runs in parallel.
- [2026-11-16] S-064 | EXACT-HEAD CHECKS GREEN / AGENT ARCHITECTURE PLANS | Parent main `67ea5ba97e21f527d1eaff28cfddef274d2e98d7`; live queue 0 open PRs, issue #111. Exact-head Quality #43869711819 SUCCESS (7/7 including Chromium and published release contract); Pages deployment #43869711208 SUCCESS; Freshness #43869712009 PASS; Provenance #43869711675 PASS; uncached published root metadata exact `67ea5ba`. Added two proposed execution plans: AgentRun main-chat/context/status integration and Deep Research method separation. Source audit confirmed `runMultiAgentResearch` is a four-stage same-model evidence pipeline with web search and ResearchTrace, not an independent AgentRun team; `agentModeControl` still toggles it, while AgentRun has its own separate prompt/strategy modal. Recommendation: direct chat default; opt-in AgentRun from chat; preserve the evidence pipeline as a Deep Research method; do not add LangGraph/Temporal/Dify runtime. Plans are PROPOSED pending owner review. | VERIFIED baseline; PROPOSED plans; no code change. | Next: approve/adjust the routing and legacy migration boundary, then execute Plan 1 under TDD.
- [2026-11-16] S-063 | OWNER CONTINUATION OR-011 / AGENT STATUS CONTRACT | Parent main `72652b74d0253858449737ffd7efee65b8e9915f`; 0 open PRs, issue #111. OR-011 was already archived verbatim in parent commit `72652b7`. Source audit: AgentRun events are durable in SQLite and exposed through `/agent-runs/{id}/events`; the browser polls events + snapshots every 500 ms, but renders them only inside the Agents modal. Main chat still calls the legacy `runMultiAgentResearch`; no main-chat AgentRun submit/context packet exists. Added K.6.16 status-overlay acceptance, updated K.5/Agent IA and reviewed OpenAI Agents SDK streaming, AG-UI lifecycle/activity/subagent events, Temporal event history and Dify durable event-store patterns via Exa/Firecrawl. Exact parent CI: Quality #43842541004 PASS (7/7), Pages #43842540462 SUCCESS, Freshness #43842540858 FAILED because checkpoint snapshot still recorded `a7a33ec`; direct-child five-file refresh is being applied. No product code, dependencies, host settings or credentials changed. | SPECIFIED / DOCUMENTATION CHECKPOINT; exact-child checks pending. | Next: verify exact-child Freshness/Provenance/Quality/Pages; then plan and TDD AgentRun/main-chat context unification.
- [2026-11-16] S-062 | FRESHNESS GATE REPAIR | Parent main `a7a33ec688134571b4fb95606537e5d73ca5190e`; Freshness #43841950546 FAILED because the direct-child commit did not modify required docs/VOLLEY_LOG.md. Provenance #43841950694 PASS, Pages #43841949330 PASS with fresh root revision exact; Quality #43841950679 was in progress at this entry. Adding V-005 route evidence and V-006 repair record, then refreshing all five required state files as one direct child. No product code changed. | Failure cause identified from REQUIRED_REFRESH_PATHS; repair in progress. | Next: rerun exact-head Freshness, Provenance, Quality, Pages and live root verification.
- [2026-11-16] S-061 | LIVE ROUTE / LOCAL WORKSPACE / MOBILE ZOOM AUDIT | Parent main `2cc6573a79aae374575f4e55b0c2aa6deef844c8`; Freshness #43840215198 PASS, Provenance #43840215012 PASS, Quality #43840215191 PASS (7/7), Pages #43840213780 PASS; fresh root metadata exact. `/landing/` returns 404, `/workspace/` exists, `/notebook/` and `/research/` return 404. BrowserLocal provider already has explicit user-picked file editing, diff/approval, IndexedDB recovery and rollback; no AI AgentRun, shell or test runner. `text-sm` 14px fields are a strong iPhone Safari focus-zoom hypothesis. | Documentation/evidence update only; no product code changed. | Next: approve unified AgentRun/chat architecture; preserve Workspace as a base for permissioned local Coder adapter.
- [2026-11-16] S-060 | STATE JOURNAL FORMATTING REPAIR | Parent main `0c217fcca1ad968d0af7a9a85ba9708ea6f79f0b`; repaired the escaped newline between S-059 and S-058 in NOW.md. Refreshed NOW.md, AGENTS.md, docs/PROJECT_STATE.yaml, docs/project-state-snapshot.json and docs/VOLLEY_LOG.md together as a direct child of the recorded parent. No product code or runtime changes. | Documentation checkpoint repair; exact-child checks pending. | Next: verify Freshness, Provenance, Quality, Pages and public revision on the final state-refresh SHA.
- [2026-11-16] S-059 | OWNER CONTINUATION OR-009/010 / PLUGIN AND CHAT AUDIT | Parent main `4f19cd4d82994194d384762b7f4c9a1fcf6013e3`; 0 open PRs; issue #111. OR-009/010 archived immediately after mandatory orientation, before further inspection. Added K.6.15, full plugin/tool role map and dated primary-source review to INTEL.md; updated Agent Functions and Chat Settings audits. Verified index.md is 537,930 chars / 6,673 lines; new chats and hidden toggleSearch default to web search; legacy four-stage multiAgentEnabled path coexists with AgentRun. /landing remains retired; saved route principle exists, but all four studio names are not recorded. No product code, dependency, connector, OAuth, model or host changed. | IMPLEMENTED / DOCUMENTED; implementation NOT STARTED. | Next: approve unified AgentRun/chat architecture; then write bounded plan and TDD gates.
- [2026-11-16] S-058 | PROPOSAL / PLUGIN STRATEGY | Exa primary-source review (2026-05-16→2026-11-16), Base44 app inventory empty, Coder design-token/WCAG tools, Vercel/Cloudflare/Twilio capability review, OpenSandbox 1.2.0 release review. INTEL.md updated with complementary tool roles, non-use boundaries and no-integration policy. | No OAuth, dependencies, runtimes, apps or secrets changed. | Use GitHub → Exa → Firecrawl/Context7 as needed → Playwright/TinyFish and Coder contrast/tokens when UI work reaches them; avoid parallel builders/hosts. |
- [2026-11-16] S-057 | IMPLEMENTED / VERIFIED PROTOTYPE | Added `coder_review` strategy in `gateway/agent_runtime/worker.py`, safe selector/help in `index.md`, worker/E2E coverage. Coder → Reviewer → Coordinator dependency chain; bounded/truncated context; no tools/filesystem/shell/network/test execution. Gateway #43826933347: 279 tests passed; Quality #43827521092: 135 built-app Chromium + 1 live-site passed, 7/7 jobs; Graphify #43827521090: 2,519 nodes/5,868 edges/90 files; Pages #43827520134: exact public SHA `0d34aa1c70bb68e57a3856ba20d8b5f966c65038`. | AgentRun remains feature-off; no host inference or local Coder verified. | Add restart/failure-injection and Coder sandbox research before enabling. |
- [2026-11-16] S-056 | IMPLEMENTED / VERIFIED | Moved `memoryStatusLine` outside collapsed `memoryToolsDetails` so status remains visible; updated E2E assertion after Quality caught the old hidden-state expectation. Final Quality #43827521092 passed. | This is status-line visibility only, not the full Memory settings redesign. | Rework Global/Personal Memory hierarchy under K.5/K.6.14. |
- [2026-11-16] S-055 | DOCUMENTATION STATE REFRESH REPAIR | Parent main `914eeec88a46370efe1a27d58a7d57865e5c7bed`; exact-head Freshness #43825173208 failed because PROJECT_STATE.yaml root_orienter.base_main and current_checkpoint.verified_main remained at b543e9f while the snapshot was advanced to 159f371. Updated the five-file checkpoint atomically and repaired the missing journal line break. No product code changed. | DOCUMENTATION REPAIR; exact-head recheck required. | Verify Freshness/Provenance/Quality/Pages on the new exact child; then inspect AgentRun source/tests. |
- [2026-11-16] OR-2026-11-16-008 | SPECIFIED / DOCUMENTATION-FIRST | Parent main `159f371675c9d82e65c8cd8d0e4a622e842e4d6f`; 0 open PRs; issue #111. First action after mandatory NOW/live-state orientation: archive the owner's complete prompt verbatim below, extend the existing K.6 contract and update the single K.5 status view; no product code, dependencies, model downloads, host settings, credentials or deployments changed. New acceptance covers AgentRun-first continuation, strategic assistant-plugin mapping, compact mobile UX and hierarchy, project Sources intake, Memory IA, chat/project header/status behavior, orthogonal Deep Research methods, optional offline package component selection, local/server runtime switching, mobile zoom/touch/navigation/a11y/forms and Pages checks. | SPECIFIED; not implemented by this documentation entry. | Next: inspect AgentRun/D-024 and K.6.3 source/test surface, then bounded implementation and exact-head verification. |
- [2026-11-16] S-054 | AGENTRUN UI VERIFIED | Parent main 377818cceef7099d6698c07561c715358d5d8ddd; 0 open PRs; issue #111. Quality #43804109317 SUCCESS (7/7, 134 Chromium + published contract); Graphify #43804109318 SUCCESS; Pages #43804108675 SUCCESS; public root exact. Safe single/team_review, per-chat choice, General pin, strategy_id and task-state/dependency rendering verified. Gateway unchanged; #43797179042 on backend parent 680ab022. | IMPLEMENTED / VERIFIED PROTOTYPE; no host activation. | Next: Research Trace Save, then K.5 order. |
- [2026-11-16] S-053 | OWNER REQUEST OR-2026-11-16-006 ARCHIVE + AGENT UI RED CHECKPOINT | Parent main `9835e43d39f4b3ae7c5f4968f7bf0d348b1735f7`; 0 open PRs; issue #111. Current commit changes only `tests/e2e/app.spec.mjs`; Quality #43798806788 failed one new test because the AgentRun strategy selector is absent (133 passed); Graphify #43798806804 SUCCESS; Pages #43798806597 SUCCESS; published-site contract skipped. The earlier code-bearing parent `680ab022` passed Gateway/Quality/Freshness/Provenance/Graphify/Pages. Archived the complete owner message verbatim. Existing K.6.3 and K.6.13 remain binding; no new backlog. | IMPLEMENTED backend prototype / AGENT UI ACCEPTANCE RED / NO CURRENT UI CODE. | Next: implement safe strategy allowlist, per-chat persistence, request submission and task graph rendering; exact-child full CI.
- [2026-11-16] S-052 | OWNER REQUEST OR-2026-11-16-005 ARCHIVE + OFFLINE/CODER/LEARNING ACCEPTANCE | Parent main 680ab02289c8517dbe9e36b53abb66317dda5f86; 0 open PRs; issue #111. Exact-head Gateway #43797179042, Quality #43797179025, Freshness #43797178997, Provenance #43797179026, Graphify #43797179000 and Pages #43797178161 all SUCCESS. Archived complete user prompt verbatim; appended binding K.6.13; updated K.5 AgentRun row to distinguish CI-verified DAG prototype from unavailable UI/sandbox/host integration. Plugin/tool boundary: GitHub, Firecrawl, TinyFish, Vercel, Context7, OpenAI Developers and Superpowers installed/enabled; Exa, Code and Coder surfaces available. Twilio is a skill pack without authenticated account; no standalone Codex connector surfaced. | DOCUMENTATION AND ACCEPTANCE IMPLEMENTED; offline package/voice/local files/learning/Coder sandbox remain unimplemented. No runtime code or dependencies changed in this state-refresh commit. | Next: primary-source research per workstream, then Agents UI and further TDD vertical slices.
- [2026-11-16] S-051 | FIX AGENTRUN WORKER DECLARATION | Parent main `25c1dec66f0599ce54bf6fda743bef1c71e7dcc7`; Gateway #43796730159 failed at `compileall` on duplicate `_remember_key` declaration; Quality #43796730165 was still running but Ruff had reported the same syntax defect; Freshness #43796730096, Provenance #43796730135, Pages #43796729855 and Graphify #43796730277 succeeded. Removed the duplicated function declaration only; rerun all exact-child gates. | IMPLEMENTED fix, UNVERIFIED. | Next: exact-child checks; do not extend UI or runtime until green.
- [2026-11-16] S-050 | AGENTRUN NATIVE DAG BACKEND PROTOTYPE | Parent main `fe7bad6e366136a9b9fc5ad323e0eac32fba508d`; exact-parent Quality #43794659797, Freshness #43794659822, Provenance #43794659808 and Pages #43794659816 all SUCCESS; public root revision exact. Implemented additive SQLite task dependencies with same-run guard, bounded dependency list, idempotent dependency replay and ready-task gating. Added selectable `single` / `team_review` strategy to AgentRun API/worker; team creates independent researcher/reviewer contexts and a synthesis task gated on both, using task-ID-keyed Fernet payloads. Run output is copied from synthesis task for existing status compatibility; cancellation purges run and task payloads. Added deterministic store, worker and API tests. No new package, host setting, model install or feature-flag activation. Exact-child checks pending; Agents UI strategy selector remains next. | IMPLEMENTED prototype, UNVERIFIED exact HEAD.
- [2026-11-16] S-049 | OWNER CONTINUATION + AGENT-RUNTIME SOURCE REFRESH | Parent main `6830e5cdc14ae3138ba4d61125c7db8f7f353ba5`; 0 open PRs; issue #111. Exact-head Quality #43792176788 SUCCESS, Freshness #43792176798 SUCCESS, Provenance #43792176803 SUCCESS, Pages #43792176634 SUCCESS; public root revision exact; `/landing/` HTTP 404. Re-read K.6.3 and audited live `gateway/agent_runtime/store.py`, `worker.py`, `payloads.py`, `gateway/app.py`, tests and Agents UI. Current AgentRun is a real authenticated single-worker model executor with SQLite leases/fencing/retries/events/cancel and encrypted run-level payloads, but only one task per run; no dependency DAG or per-task context. Rechecked official OpenAI Agents SDK, LangChain Deep Agents, Temporal and Microsoft Agent Framework docs via Exa; patterns only, no framework/runtime installed. GitHub connector is active; Exa/Firecrawl are assistant-side research tools, not aLandi dependencies. D-024 records the proposed bounded native SQLite DAG. No product code or dependencies changed in this documentation-first step. | Next: implement task-scoped encrypted payloads, dependency gating and coordinator-owned `team_review` workflow; keep concurrency 1 and tools/FS/network disabled.
- [2026-11-16] S-048 | BONSAI ARTIFACT VERIFIED + RUNTIME BOUNDARY | Parent main f2b6de1cdb5f95ca14d421ab028dc3591ab4187a; Open PRs: none; Open issues: #111. Exact-head Quality #43791622156 SUCCESS (133 Chromium tests + published release contract); Freshness #43791622162 SUCCESS; Provenance #43791622145 SUCCESS; Pages #43791621597 SUCCESS; model acquisition #43791622097 SUCCESS; live root meta exact. Bonsai PTQ1_0 artifact #14192531688, 429,196,247 bytes, archive SHA-256 41ced309f0ff10e4bd9b0c464bf3fe42013e60e4d27cd308666744618c18655a; embedded model file 429,183,456 bytes, SHA-256 36061ad406df8a4903a6db005be350c50fabfaf717f9ef0acf4b76adcd9929fa; expires 2026-12-16. No target-host install/runtime. | Next: generic local OpenAI-compatible adapter with loopback-only configuration, installed-model discovery, streaming/cancellation and exclusive model slot; then task-scoped encrypted AgentRun DAG and Coder workspace.
- [2026-11-16] S-047 | PINNED BONSAI 2 ARTIFACT ACQUISITION | Parent main fb9c9d3a1cf06fe0e07606ad816767e00686a83f; Open PRs: none; Open issues: #111. Exact-head Gateway #43790945491 PASS (Python 3.12/13/14); Quality #43790945388 PASS (133 Chromium tests + published release contract); Freshness #43790945342 PASS; Provenance #43790945416 PASS; Graphify #43790945459 PASS; Pages #43790945021 SUCCESS; live root meta exact. Verified official HF immutable revision a6032a5089ac27e96be3a80c7b42d1ad0bd89887, PTQ1_0 file 429,183,456 bytes, SHA-256 36061ad406df8a4903a6db005be350c50fabfaf717f9ef0acf4b76adcd9929fa, Apache-2.0. Important correction: 430 MB is the smallest packing of the same 1.88B model, not a separate lower-parameter model; official README recommends PQ2_0 default, PTQ1_0 smallest, Q2_0 for upstream llama.cpp b11556+. Added manifest and push-triggered Actions acquisition workflow; download result pending. No runtime or target-host install. | Next: verify acquired artifact and exact digest, then decide on generic local OpenAI-compatible adapter; implement task-scoped payloads/DAG for real specialists.
- [2026-11-16] S-046 | VERIFIED MODEL CATALOG + MULTI-AGENT RUNTIME SPEC | Parent main 3da2a0865458898f9c3a4923a15f0485bdeda6f3; Open PRs: none; Open issues: #111. Exact-head parent checks: Quality #43790021314 SUCCESS (133 Chromium tests); Freshness #43790021248 SUCCESS; Provenance #43790021345 SUCCESS; Graphify #43790021246 SUCCESS; Pages #43790020168 SUCCESS; live root meta exact. Existing Qwen3.5-2B Q4_K_M artifact #14032317541 (1,945,791,476 bytes; archive SHA-256 e81c660da6917d8d0478470b4bb96b5553cdc9f5aa565e83f96b4864643c49f1; expires 2026-12-13) is staged but not installed. This slice makes AgentRun model discovery intersect ALANDI_ALLOWED_MODELS with Ollama /api/tags, adds the 2B tag to the default allowlist without changing the 4B default, and fails closed if Ollama model catalog is unavailable. Worker runtime remains single worker/task, no tools/FS/network; multi-agent DAG and Coder sandbox are specified, not implemented. | Next: exact-child CI; then task-scoped encrypted payloads, dependency DAG, worker leases and coordinator-owned specialists.
- [2026-11-16] S-045 | TEST-ONLY REPAIR + ATOMIC STATE REFRESH | Parent main f49d37641d81660ce0c8f757ed54a347ed23a77c; Open PRs: none; Open issues: #111. Corrected tests/e2e/app.spec.mjs so source_id is asserted across the full request message set (the user message legitimately has an empty source packet); corrected tests/e2e/research-evidence.spec.mjs to expect current Research Trace schema v4. Refreshed NOW.md, AGENTS.md, docs/PROJECT_STATE.yaml, docs/project-state-snapshot.json and docs/VOLLEY_LOG.md as one direct child of the recorded parent, as required by the freshness gate. Parent docs-only Pages #43789721496 SUCCESS; Quality #43789722423 was IN_PROGRESS at capture; Freshness #43789722327 failed because the prior docs-only commit had not yet refreshed the five-file checkpoint. No production runtime behavior or dependencies changed. | Next: exact-child Freshness/Provenance/Quality/Chromium/Graphify/Pages and public revision; then proceed to explicit Research Trace save and bounded AgentRun worker lifecycle.
- [2026-11-16] S-044 | OWNER SOURCE SWEEP / DOCUMENTATION FIRST | Parent main 1851b7204b1efc6216d139d97653e0dbfc5c4668; 0 open PRs; issue #111. Scanned INTEL source inventory (568 HTTP(S) occurrences; 478 normalized unique URLs before this sweep; 507 after adding 29 new distinct refs) and reviewed owner-named primary sources plus matching existing agent/model/research/UI references. Exa and Firecrawl tools returned results in this session; no provider credentials read, no paid calls, no product dependency added. Key dispositions: Bonsai 2 2B is a 0.43 GB PTQ1_0 candidate requiring PrismML llama.cpp fork (Q2_0 0.55 GB on upstream llama.cpp b11556+); Needle 2 is 14 MB / ~28 MB RAM but RU/TH quality is unspecified and v2.0.4 has a repeat-initialization crash report; Memorilla requires CUDA/H100-class training; ghost-infer is an Apache-2.0 NVIDIA-GPU-first runtime benchmarked on an 8 GB RTX 2060 SUPER with 24 GB host RAM; Obscura is an Apache-2.0 browser/MCP candidate with private-network protections; Stakpak/Cloudroom/Kiri supply patterns only (Cloudroom permission docs conflict); React Bits Commons Clause prevents copying/porting components; KL divergence and critic-free RL are training/evaluation methods, not runtime modules; VoxCPM2 remains deferred. Exact-main Chromium run #43783851413 failed 2 E2E assertions (app.spec.mjs:780 source_id assertion against an empty source packet; research-evidence.spec.mjs:171 expects schema v3 while runtime emits v4); 131 passed. Build/deploy and other listed sentinels succeeded; published release contract was skipped. This step records evidence and decisions only; no model downloaded, no runtime/dependency/code behavior changed. | Next: land source/decision documentation and owner archive first; then fix the two stale E2E assertions, verify exact-head CI, and continue existing AgentRun/Deep Research vertical slices.
- [2026-11-16] S-043 | STRUCTURED RESEARCH REVIEW UI | Parent main `e4b791076d19e312265eee301c417cc257f3fc48`; 0 open PRs; issue #111. Exact-head Gateway #43762493535 PASS across Python 3.12/13/14; Quality #43762493518 PASS all 7 jobs incl. Chromium and published release contract; Freshness #43762493531 PASS; Provenance #43762493641 PASS; Graphify #43762493514 PASS; Pages #43762493391 SUCCESS; public root meta exactly matches parent. This child stages index.md schema-v4 review parsing/rendering and E2E assertions: same-model critic explicitly not independent, strict JSON contract, source-ID allowlist, relation/status validation, contradiction claim/evidence linkage, invalid JSON yields no claims; existing quote save remains explicit. | Next: exact-head verify this child; then map saved quote IDs into existing authenticated claim/contradiction endpoints within the same explicit save action.
- [2026-11-16] S-042 | EVIDENCE LEDGER IMPORT-SCOPE FIX | Parent main `d806d19eeb4baf59245e9f8f03746eb3a7627aea`; 0 open PRs; issue #111. Exact-head Gateway #43762082085 failed on Python 3.12/3.13/3.14 (269 passed, 1 failed per job): the route-level `except EvidenceLedgerConflictError` referenced a symbol imported only inside the lifespan function. Quality #43762082040 Ruff gate found the same undefined name; Chromium remained in progress at capture. Freshness #43762081970 PASS; Provenance #43762082102 PASS; Pages #43762080733 SUCCESS; Graphify #43762082015 SUCCESS. Fix moves the exception import to module scope and removes unused local imports. | Next: verify exact-child Gateway, Ruff, Chromium, Freshness, Provenance, Pages and public revision; only then proceed to Research Trace integration.
- [2026-11-16] S-041 | DEEP RESEARCH CLAIM LEDGER BACKEND | Parent main `82378d2990bb8fddaf0f5223135519357dd8fa1d`; 0 open PRs; issue #111. Quality #43760139648 PASS (133/133 local Chromium, 1/1 published-site Chromium and release contract); Pages #43760139103 SUCCESS; Freshness #43760139562 PASS; Provenance #43760139586 PASS; public revision exact. Graphify #43759158498 PASS on code/test parent 2185; Gateway #43738728923 PASS on gateway-bearing parent 5773, no Gateway changes on 82378. Backend slice adds typed claim/contradiction EvidenceLedger records, deterministic IDs, same-scope/run source linkage, same-model-only reviewer mode, and deletion conflict protection; no schema migration or dependency. Official Exa/Firecrawl docs already exist in INTEL (490 unique URLs); no provider keys or paid calls. Implementation is included in this commit; exact-head CI pending. | Next: connect Research Trace to the new API with source excerpts, structured same-model claim review, contradiction rendering and explicit-save persistence; then provider adapters and resumable run state.
- [2026-11-16] S-040 | STATE YAML CORRECTION / EXACT-CHILD CHECKS PENDING | Parent main `005ca06d0c44dc674cf9d1e65fa2a351ca1665be`; 0 open PRs; issue #111. Quality #43759639759 SUCCESS: 133/133 local Chromium, 1/1 published-site Chromium and published release contract; Pages #43759638725 SUCCESS; Freshness #43759639581 SUCCESS; public root/cache-busted client revision matches parent. Provenance #43759639668 FAILED because three double-quoted scalars in `current_checkpoint` (`main_quality`, `main_graphify`, `main_pages`) lacked closing quotes. This direct state-refresh child closes those scalars and refreshes all five checkpoint files to parent `005ca06d0c44dc674cf9d1e65fa2a351ca1665be`. Graphify #43759158498 PASS on 2185; Gateway #43738728923 PASS on 5773; no relevant source changes. | Next: verify exact-child Provenance/Freshness/Quality/Pages and public revision.
- [2026-11-16] S-039 | CHROMIUM VERIFIED / DIRECT STATE REFRESH PENDING | Parent main `2185a35a9a9a488fa8929814a0eee384302c3b2d`; 0 open PRs; issue #111. Quality #43759158457 SUCCESS: 133/133 local Chromium tests, 1/1 published-site Chromium test and published release contract all PASS; published main revision exactly matches parent. Graphify #43759158498 SUCCESS on exact parent. Freshness #43758513805 on prior parent bac0 FAILED only because snapshot still pointed to 5773; its 21 deterministic freshness tests passed. Provenance #43758513891 PASS on bac0 after YAML scalar correction. Gateway #43738728923 PASS on 5773; no Gateway source changes since. Test-only commits 417acc and 2185 corrected all 14 Chromium failures; no production behavior or dependencies changed. | Next: direct state-refresh commit with all five required checkpoint files based on this parent, then verify exact-child Freshness/Provenance/Quality/Pages and published revision; then implement the next bounded Deep Research 2.0 claim/evidence slice.
- [2026-11-16] S-038 | TEST-ONLY FIX IMPLEMENTED / EXACT-HEAD CI PENDING | Parent main `5773e12c7c05db29e5956aed18ce1da13a6f9780`; 0 open PRs; issue #111. Gateway #43738728923 PASS across Python 3.12/13/14; Quality #43738728922 ran 133 Chromium tests: 121 passed, 12 failed. Artifact #14172036136 and all failure contexts/traces were inspected: seven strict-mode failures from duplicated project filter actions / broad project-row locators; four timeouts from attempting to click project settings actions while the native row disclosure menu remained collapsed; one stale Research Trace schema expectation (v2 vs implemented v3). Freshness #43738728942, Provenance #43738728997, Graphify #43738728920 and Pages #43738728149 PASS. Public root HTTP 200; `alandi-build-revision` exactly matches parent SHA. This child scopes tests to `.project-nav-item` / `.project-nav-select`, opens the row disclosure before menu actions and expects trace schema v3; no production behavior or dependencies changed. Rechecked official Apple HIG, W3C APG/WCAG, Primer, Fluent 2 and SGDS UI guidance; findings added to INTEL.md. | Next: verify exact-head gates on this child and public revision; then continue Deep Research 2.0.
- [2026-11-15] S-037 | CORRECTION / EXACT-HEAD VERIFICATION PENDING | Parent implementation `9bee2d979c3a9d91d252d09c0abbd605dfce22cb`; 0 open PRs; issue #111. Fixed the legacy Gateway capabilities fixture to include disabled RAG/EvidenceLedger flags, and removed stale block-list entries left after converting PROJECT_STATE.next to a YAML flow list. The API-specific evidence tests passed on the parent; Gateway had one unrelated fixture failure, Freshness passed, Provenance caught YAML residue, Graphify/Pages passed. | Next: rerun all exact-head gates and published revision.
- [2026-11-15] S-036 | IMPLEMENTED / EXACT-HEAD VERIFICATION PENDING | Parent test contract `be7337cbc5e839747b3fe7377ac5a9a27a35a24b`; 0 open PRs; issue #111. Wired existing SQLite EvidenceLedger into Gateway lifecycle and authenticated scoped POST/GET/DELETE API; added exact quote/hash, idempotent write and scoped delete; capability reports RAG status. Research Trace v3 now carries chat scope/capture timestamps and offers explicit user-initiated Gateway save for excerpts <=360 chars; no full page or automatic upload. Unicode offsets use code-point length. Updated K.5 row 3 to PARTIAL. | Next: exact-head Gateway/Quality/Chromium/Freshness/Provenance/Graphify/Pages and public revision; then claims/citations, contradictions, resumability and provider adapters.
- [2026-11-15] S-035 | RED TESTS ADDED / IMPLEMENTATION NOT STARTED | Parent main `ea9582f42a13edf95a9cfe5f7a41dbb06d959e86`; 0 open PRs; issue #111. Rechecked Exa Search/Contents, Firecrawl Search/Scrape, LangChain Deep Agents subagents, LangGraph persistence, FastAPI BackgroundTasks/Lifespan and Context7 FastAPI docs. Current research remains a four-stage same-model pipeline with localStorage trace; EvidenceLedger already stores exact source hashes/quotes but is not wired to Gateway routes. Added Gateway/E2E acceptance tests for scoped writes, exact quote/hash, idempotent retry, deletion, capability reporting and explicit trace-to-Gateway save. No production code/dependencies changed. | Next: observe RED on exact main; implement via existing SQLite ledger and authenticated Gateway; preserve local trace if Gateway unavailable.
- [2026-11-15] S-032 | IMPLEMENTED / EXACT-HEAD CI PENDING | Parent main 4514f69d19ffce47dfa1c0bdd517931ebe1c0dc3; 0 open PRs; issue #111. Baseline AgentRun lifecycle passed Quality #43733527394 (Chromium included), Graphify #43733527388 and Pages #43733527693; public root revision 4514f69d19ffce47dfa1c0bdd517931ebe1c0dc3, /landing/ HTTP 404. Next child implements observer-controller ownership when Check replaces polling and terminal `budget_exhausted` handling; adds two Chromium regression tests. The code/test blobs are prepared for one direct child; exact-head Quality, Freshness, Provenance, Graphify and Pages pending. No backend/runtime/host flag/dependency change; one worker and no tool, filesystem, shell or network access. | Continue Deep Research after exact-head gate. | Keep owner-only host release separate.
- [2026-11-15] S-029 | METADATA REPAIR / EXACT-HEAD CHECKS PENDING | Parent main e5051690aa5e6d4e6cd2e59ca04bed4478761fda: Freshness #43728929559 SUCCESS, Graphify #43728929688 SUCCESS, Pages #43728928234 SUCCESS and live root exact e5051690. Provenance #43728929628 FAILED `check_project_metadata.py`: two PROJECT_STATE YAML scalar strings at lines 6 and 19 lacked closing quotes due the prior state-edit helper; no provenance/model artifact issue. Quality #43728929561 was still running (integrity/security/context/static/Jekyll passed). Correct both lines as full quoted scalars and refresh all five required state files as direct child; rerun exact checks.
- [2026-11-15] S-028 | RED VERIFIED / CAPABILITY PANEL IMPLEMENTED | Parent main 89dda05004cba887314b3edef6f1802480a0e9c5: Quality #43727819858 ran 124 Chromium tests; 123 passed and the new disabled-AgentRun acceptance failed because `#agentRuntimeStatus`/`#agentRuntimeStart` did not exist. Integrity, Security, Context, Static Analysis and Jekyll passed. Pages #43727819235 SUCCESS; public root exact 89dda050; Provenance #43727819900 SUCCESS; Graphify #43727819824 SUCCESS. Freshness #43727819887 failed because PROJECT_STATE.current_checkpoint.verified_main lagged snapshot main SHA (21/21 checker unit tests passed). Added bilingual capability/profile/model panel; authenticated `/v1/capabilities`; `/agent-runs/profiles` only when enabled; strict worker/tool/file/network policy validation and fail-closed states. Start remains disabled pending Task 2. | No host flag, Gateway config, keys, secrets or model changes. Scope metadata only; no implicit transcript/project files. | Verify exact-head Quality/Freshness/Provenance/Graphify/Pages. | Add Task 2 RED tests for POST/status/events/output/cancel/errors.
- [2026-11-15] S-027 | VERIFIED BASELINE / RED TEST PENDING | Parent main c7d9c44295e16d8b603dda96cdf0e408cd828dc5: Quality #43727091701 SUCCESS (all 7 jobs incl. Chromium), Freshness #43727091644 SUCCESS, Provenance #43727091650 SUCCESS, Graphify #43727091641 SUCCESS, Pages #43727090926 SUCCESS; public root exact c7d9c44. Added AgentRun Browser UI implementation plan and first feature-off E2E acceptance test. Existing backend is authenticated encrypted single local-model worker, concurrency 1, with general/coder/reviewer/researcher profiles; API routes exist, host flag remains disabled by default, tools/filesystem/network disabled. | No runtime flag, host, secrets or Gateway backend changed. | Verify RED on new E2E test, then implement capability-gated UI and run/status/events/cancel. | No implicit transcript/files, no swarm claim.
- [2026-11-15] S-026 | IMPLEMENTED / EXACT-HEAD CI PENDING | Quality #43726435103 on parent 888c2d5: 121/123 Chromium tests passed. Two failures showed that auto-switching the active chat when selecting a project/personal filter violates established behavior: filter selection changes the visible list only; clearing a non-active chat must not switch the active chat. Removed auto-switch from both filters and removed only the two assertions that had been added to demand it. The separate project-creation ownership fix and assertions remain. | Do not infer active-chat changes from filter selection; only explicit row selection changes active chat. | Verify exact-head CI and live filter-only flow. | Then proceed to the existing AgentRun API UI integration plan.
- [2026-11-15] S-025 | IMPLEMENTED / EXACT-HEAD CI PENDING | Quality #43724681318 on parent 9db8588: 122/123 Chromium tests passed. The sole remaining test exposed a real product bug: `createProject()` mutated the currently active chat's `projectId`, silently moving it into the new project. The fix creates a new project-owned chat and leaves existing chat ownership untouched; selecting a project or personal-chat filter activates a matching chat when present. Added regression assertions for original-chat preservation and active project alignment. AgentRun correction: authenticated durable API and single worker already exist; browser UI is not wired, feature is off by default and tools/filesystem/network are disabled. | No backend feature flag, secrets or host settings changed. | Verify exact-head CI; then connect the UI to the existing API and continue K.5. | Preserve local chat/project data and never move chats implicitly.
- [2026-11-15] S-024 | IMPLEMENTED / EXACT-HEAD CI PENDING | Quality #43723996573 on parent add961cb: 117/123 Chromium tests passed; all six remaining failures share one assertion in `ensureSidebarOpen`: after the CSS transition completes the computed transform is `none`, not identity `matrix(...)`. Other prior E2E corrections no longer appear as independent failures. Changed the helper to assert `transform: none`; rerun exact-head CI. AgentRun audit correction: authenticated durable API and single worker already exist; browser UI is not wired, feature is off by default and tools/filesystem/network are disabled. | Keep host flag off until host acceptance and encryption-key backup are verified. | Verify exact-head Quality/Chromium, Freshness, Provenance, Graphify and Pages. | Wire UI to the existing API before designing true multi-agent fan-out.
- [2026-11-15] S-023 | IMPLEMENTED / EXACT-HEAD CI PENDING | Inspected exact-parent Chromium artifact #14164458184 and live root. Seven Quality failures traced to stale E2E row selectors, incorrect project-settings helper semantics, sidebar state/transition assumptions after modal closure, and a collapsed prompt accordion; not seven independent production defects. Added stable `data-chat-id` to `.chat-row`, aligned helper assertion to `projectSettingsStatus`, waited for settled sidebar transform, reopened sidebar across project create/filter flows, and expanded Additional settings before prompt edits. Parent d9bb5ef; direct-main commit includes UI + E2E + five checkpoint files; exact-head CI pending. TinyFish live browser audit used an isolated disposable profile; no owner credentials or existing data touched. | No production AgentRun/Notebook/offline feature claimed complete. | Await exact-head Quality/Chromium, Freshness, Provenance, Graphify and Pages; fix only reproducible failures. | Continue AgentRun model-backed UI/API integration and same-origin Notebook data contract after base UI gate is green.
- [2026-11-15] S-022 | IMPLEMENTED / EXACT-HEAD REFRESH REQUIRED | OR-008 adds continuity and source-coverage direction. INTEL.md has 450 distinct URLs / 528 occurrences (full inventory snapshot 2026-11-04); targeted 2026-11-15 review covers GitHub Pages publishing/custom domains, MDN same-origin/storage, OpenAI Agents SDK v0.24.0 and LangGraph checkpointers. Recommendation: separate Notebook/Research/Workspace paths on the same origin with explicit shared-data contracts; defer custom subdomains pending owner DNS and cross-origin API/sync. Pages #43720038473 SUCCESS, root 6f9772bb live, `/landing/` and retired CSS 404; Quality #43720039674 in progress; Freshness #43720039693 failed only because snapshot SHA lagged current main; 21/21 unit tests passed; Provenance #43719748704 SUCCESS on a4c1cf0; Graphify #43718884625 SUCCESS on ee925. | Refresh NOW/AGENTS/PROJECT_STATE/VOLLEY_LOG/snapshot as one direct child of 6f9772bb and add targeted source findings to INTEL. | Do not claim all 450 sources freshly checked or any studio route/SDK installed. | Re-run exact-head Freshness, Provenance, Quality, Pages; then inspect AgentRun before choosing orchestration dependencies.
- [2026-11-15] S-021 | FACT / OWNER REQUEST + ROUTE ARCHITECTURE | Owner request OR-2026-11-15-008 captured verbatim below. Live main parent a4c1cf042ec88df02692552ea11964e8188df273; 0 open PRs; issue #111 open. Exact-SHA Freshness #43719748791 SUCCESS and Provenance #43719748704 SUCCESS; Quality #43719748700 and Pages #43719747773 IN_PROGRESS. K.6.9 already specifies root-preserving same-origin studio routes and explicit DNS/authenticated API/sync gates for subdomains. INTEL.md contains 450 distinct URL strings in the full source register (528 URL occurrences); this is an inventory, not proof that every source has been freshly reviewed. | No product code changed. | Await exact-SHA Quality/Chromium and Pages; verify live root revision. Then continue K.5 and use INTEL.md for targeted, dated source refreshes tied to each subsystem; no indiscriminate bulk import. | Keep Pages workflow intact; evaluate /notebook/ only as a same-build, same-origin route with project/chat data contract, local-storage migrations and route-level tests.
- [2026-11-15] S-020 | FACT / CHECKPOINT REPAIR REQUIRED | Current main 50a723e102363cd911c2a625a9330cf217f35469; 0 PRs, issue #111. Freshness #43719394748 failed after 21/21 checker tests passed because current_checkpoint.verified_main did not match snapshot SHA. Provenance #43719394814 failed parsing PROJECT_STATE.yaml because landing_release_strategy.status lacked its closing quote. Quality #43719394800 and Pages #43719394531 were in progress. Graphify #43718884625 passed on parent ee925. | Repair YAML, verified_main, NOW exact markers/line breaks, and update AGENTS/NOW/PROJECT_STATE/VOLLEY_LOG/snapshot in one direct-child commit. | No test/safeguard weakening; OR-007 studio-route gate remains a specified architecture constraint, not implemented functionality. | Re-run exact-head Freshness, Provenance, Quality/Chromium, Graphify and Pages.
- [2026-11-15] S-018 | IMPLEMENTED / STATE REFRESH REQUIRED | Live root HTML confirms the global prompt textarea has no text content and only a placeholder; it is read-only until the explicit edit control. `DEFAULT_SYSTEM = ''`; legacy placeholder migrates to empty; existing E2E covers both. The earlier TinyFish `value` report was an accessibility serialization artifact, not a confirmed non-empty DOM value. The current UI source and acceptance tests confirm project creation remains combined with edit, chat filtering/back navigation absent, and Tavily settings remain. Pages #43714877166 published exact parent e0e90b4; Freshness #43714877492 failed because state checkpoint still pointed at 8de8bf6 and NOW lacked exact `Open issues: #111`; 21 freshness unit tests passed. | No product code changed. | Quality #43714877561 was in progress; no final result yet. Atomic refresh must be a direct child of e0e90b4 and change all five required state files. | Run exact-head Freshness; inspect Quality result; then start project create/filter UI slice with TDD.
- [2026-11-15] S-017 | VERIFIED PARTIAL / LIVE UI AUDIT | TinyFish read-only run on canonical root reported `localStorage.ai_system_prompt = null`; settings control's accessible serialization showed placeholder text as `value`/`textContent`, but its serialized markup also showed an empty `value=""`; the page revision meta was not exposed to that automation's DOM snapshot. This conflicts with the earlier static source (`DEFAULT_SYSTEM = ''`, legacy default maps to empty, blank E2E assertion) only at the automation's value interpretation; do not call it a confirmed runtime defect yet. Live HTML fetch explicitly returned root build revision `5b6d4d54a2dc9b81ae5a656ce357c26441c8d52f`, while current main after documentation commits is `8de8bf63bfdf5333329c7efdac3ecd9c16e7bb9a`, so publication is behind current main at audit time. `/landing/` is live and links to itself and root; inbound reference audit still required before removal. | No product source changed in this step. | TinyFish automation returned a UI/AX-like `<textbox>` serialization rather than trustworthy raw DOM; exact E2E/browser run required. Workflow-run connector only exposes PR-triggered runs and returns none for direct-main commits; combined status has no contexts. | Verify exact published revision after Pages trigger; add migration/save-clear/profile round-trip tests for global prompt; continue mode/function and sidebar UI implementation with TDD.
- [2026-11-15] S-015 | SPECIFIED / DOCUMENTATION-FIRST OWNER OVERRIDE | Captured owner message OR-2026-11-15-005 verbatim; K.6 in the existing 15-point registry now binds detailed acceptance. Verified parent main 62959f97ac6b0fb8cca4cb56f995c42c3f842f3a, 0 open PRs and issue #111; Gateway #43696995842 PASS (Python 3.12/13/14), Quality #43696995891 SUCCESS 7/7 incl. Chromium, Graphify #43696995875 SUCCESS, Pages #43696995516 SUCCESS. Public root and /landing/ both returned this revision; /landing/ is a tracked Jekyll page and owner requested removal. Research: OpenAI Agents SDK 2026-11-13 (sandboxed harness, progressive skills, externalized state/checkpoint restore); LangChain Deep Agents (isolated research contexts, evidence/citations); Temporal/Braintrust (durable execution/evals/traces); Microsoft Agent Skills (progressive disclosure); MDN OPFS/storage quotas; Claude Projects threads/coordinator; W3C WCAG 2.2. Coder contrast check passed five selected dark-surface pairs. Superpowers/Coder/Firecrawl/TinyFish available; no Codex-specific plugin found, so official Agents SDK docs used as research, not claimed Codex execution. | Documentation-first only; no product UI changed in this step. | Implement mode/function matrix and real Agent/Deep Research choices, then sidebar/project/chat UI; remove /landing/ after reference audit; verify live root revision after Pages deployment.
- [2026-11-15] S-014 | VERIFIED ORIENTATION / NEXT SLICE DEFINED | Resumed by explicit `oledue`; live main is `0f5a99b66af710c528cc4e39336f9f05da44fc89`, 0 open PRs, issue #111. Freshness #43623729463 PASS; Quality #43623729425 PASS; Pages #43623729315 SUCCESS; Provenance #43623729398 PASS; all 12 exact-HEAD check-runs success. `OLEDUE.md` is absent (404); `AGENTS.md` requires `NOW.md` lines 1–100 first. Code inspection: AgentRunStore persists metadata, tasks, leases and bounded events, but there is no model worker, scheduler, API integration or live event transport; existing chat path calls the allowlisted Ollama OpenAI-compatible endpoint. | No product code changed in this step. | Implement a feature-off, bounded, model-backed AgentRun vertical slice with encrypted persisted payloads, truthful API status/result/cancel, and restart/cancellation regression tests; no external engine or sandbox claim yet.

- [2026-11-15] S-014 | VERIFIED | Re-oriented from live GitHub after oledue: root OLEDUE.md is 404/absent; NOW.md is the sole entrypoint per AGENTS.md. | Live main 0f5a99b66af710c528cc4e39336f9f05da44fc89; 0 open PRs; issue #111 open. | Exact-SHA checks: Pages #43623729315 SUCCESS, Provenance #43623729398 SUCCESS, Freshness #43623729463 SUCCESS, Quality #43623729425 SUCCESS. K.5 confirms K.1.4 AgentRun is storage-only: no model worker, scheduler, API integration or event stream. | Container clone was unavailable because DNS could not resolve github.com; no local code tests run. No repository source behavior changed in this checkpoint. | Implement a default-off, allowlisted, single-worker model-backed AgentRun vertical slice with offline mocked tests; inspect complete store/API boundaries first.

- [2026-11-15] S-012 | IMPLEMENTED / CHECKS PENDING | Fixed Freshness/Ruff regression: imported legacy_orientation_files in tests/test_project_state_freshness.py; helper and legacy-file guard are in scripts/check_project_state_freshness.py. | Parent main 05b98dfe18886810cae0e14f950a2927e72d0337. | Freshness #43623253330 failed with 20 tests passing and 1 NameError (legacy_orientation_files import missing); Quality #43623253249 Ruff gate failed on the same undefined name, other jobs still running. Provenance #43623253304 PASS; Graphify #43623253242 PASS; Pages #43623253308 SUCCESS. | No product runtime behavior changed. | Run exact-head Freshness/Quality on this correction.
- [2026-11-15] S-013 | FACT | Removed stale current routing from docs/PROJECT_STATE.yaml: current live queue is zero PRs and issue #111; historical PR records remain history only. | Parent 05b98dfe18886810cae0e14f950a2927e72d0337. | Current task is LANDING-V2-2026-001; latest owner prompt in NOW is authoritative. | Keep old PR IDs out of active sequence; continue K.5 only.


- [2026-11-15] S-011 | VERIFIED | Fixed pre-existing Ruff E731 in `gateway/tests/test_github_app.py` with a typed helper. | Main commit `101e57d5a5efdbb291e0667df9e25e5fadd7e1f9`. | Gateway #43621379836 PASS (Python 3.12/13/14); Quality #43621379825 PASS (7 jobs incl. Ruff, Security, Integrity, Context, Chromium, Jekyll and release contract); Graphify #43621379893 PASS; Pages #43621380121 SUCCESS — exact SHA. | Freshness #43621323351 failed on prior parent `137bf621d7c9a7dd67e0af49fb3b54413bc722e8` because snapshot lagged; all 19 checker tests passed. Provenance exact-main UNVERIFIED. | Complete atomic checkpoint and rerun Freshness.
- [2026-11-15] S-010 | VERIFIED / UPSTREAM AUDIT | whisper.cpp v1.9.5 remains latest stable (2026-10-06); upstream HEAD `5922450fbce1ed9d1648babd0d5ac4520055b436` (2026-11-13) is an untagged CMake/Windows fix, not a new release. No official model named Whisper 3; large-v3/large-v3-turbo remain official names. Piper v1.8.0, Tesseract 5.5.4, Ollama v0.40.16 and OpenShell v0.1.8 are latest stable; pypdf 7.1.0 is current. FastAPI 0.163.0 (2026-11-14) is newer than lock 0.162.0 but held by seven-day cooldown until 2026-11-21; Pydantic 2.14.3 (2026-11-05) is a lock-refresh candidate vs 2.14.1. | Official upstream release pages recorded in INTEL.md. | No dependency lock changed. Qwen3-ASR 0.6B remains staged challenger; 1.7B deferred pending host fit and same-audio RU/EN/TH eval. | Refresh Pydantic lock only after generated lock + gateway/document matrix; re-evaluate FastAPI after cooldown.
- [2026-11-15] S-009 | VERIFIED | OpenShell v0.1.8 Ubuntu 24.04 x86_64 acquisition succeeded: run #43616944431, artifact #14122692509, 207,414,886 bytes, SHA-256 `d99d484ec2465f713b91b93cc37bf18cd1ad73ebe90d48d5a10f55572a2a9543`; all six pinned assets passed SHA/package/archive checks. | Run head `a71a117f2217449a00f32b3a14a06fa56a6a2808`; artifact expires 2026-11-28. | Actions artifact only, not installed. Target OS/architecture, kernel, Docker/VM, disk/RAM and network remain unverified. | Keep staged until host compatibility is confirmed; install only through §8 owner runbook.


- [2026-11-15] S-008 | FACT | Exact-main CI audit found the freshness failure is a stale/incomplete NOW checkpoint contract: checker expects functional baseline SHA `8e4edd83d50e6872852e7de8090934fbf6ae5f24`, literal open-queue markers, and exact no-default-PR wording. 19 freshness unit tests passed. | Main before fix `638cd2e7d537f923d9d79dc9983f58eb11b412cf`; Freshness #43621101052 FAIL; Pages #43621100962 SUCCESS; Quality #43621101004 still running, with Static Analysis failed Ruff gate. | No code behavior change. | Fix NOW contract and rerun exact-main Freshness; inspect Ruff JSON before touching code.


- [2026-11-15] S-006 | FACT | Resolved canonical task ID and source: `LANDING-V2-2026-001`, addendum §K; K.1.1–K.1.14 + K.2 = 15; status table K.5. Owner-only actions are in `docs/PRE_LAUNCH_STACK_RU.md` §8. | Live main `18da1a1f2c4568818fba136d50648c61a209bd74`; 0 open PRs; issue #111 open. | `OLEDUE.md`, `ORIENTER.md`, `project-reference/FILE_ORIENTER_RU.md` return 404 on live main; root `AGENTS.md` mandates NOW.md. No Actions runs returned for current main SHA. | Do not revive stale orienter pointers in older docs; use addendum K and owner §8 only as task-specific source. | Inspect artifacts/lock and revalidate upstream versions.


- [2026-11-15] S-005 | IN PROGRESS | Owner started `LANDING-2.0-2026-001`; verbatim request captured below. | No implementation yet. | Authorization includes merges and plugin connections; all large-model downloads excluded. | First inspect exact 15-step plan and last owner-action instruction; establish current main SHA and focused task scope.


- [2026-11-15] S-004 | IN PROGRESS | Replace orientation ritual with NOW.md; update AGENTS, freshness checker/tests/workflow and active pointers; delete obsolete orientation docs. | Parent `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`. | Checks pending. | Keep machine-readable product state and historic evidence as on-demand references, not startup docs. | Run focused tests and inspect exact main diff.
- [2026-11-15] S-003 | FACT | Live GitHub: main `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`, 0 open PRs, issue #111 only. Startup duplicated across AGENTS, OLEDUE, ORIENTER, two FILE_ORIENTER copies, orchestrator, YAML state, JSON snapshot and log. Freshness CI required old orienter files. | Live GitHub API. | No exact-SHA workflow runs returned for `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`. | Migrate checker before deleting required paths.
- [2026-11-15] S-002 | PROPOSAL | One root checkpoint plus append-only full prompt and step journal. Detailed product docs remain on-demand. | Explicit owner authorization. | Redact secrets/private personal data from prompt archive. | Implement atomically on main.
- [2026-11-15] S-001 | FACT | Captured both owner messages below. | Conversation. | Prior chat's active task was not recoverable. | Do not invent missing task.

## OWNER REQUEST ARCHIVE — verbatim, append-only

### OR-2026-11-15-001 — initial request

```text
Ну так, блядь, я тебе каждый раз нахуй, каждый запрос прошу. Сделай и исправь это ёбаное ориентирование. Почему ты с ним так мудришь? Мы все лимиты на него тратим. Только и делаешь, блядь, что в файлах ориентируешься. Раз-два и всё, и потом уже нахуй чат не отвечает, не загружается, блядь. И никакой работы не сделано в итоге. Что, нельзя, что ли, блядь, сделать один файл, в который ты будешь каждый свой шаг нахуй указывать поэтапно, когда ты его сделал, чтобы потом, блядь, сориентироваться по нему, сразу к нему обращаться? Как ты его так назвать, чтобы ты сразу на него внимание обращал? Как в какое-то такое место положить, чтобы вот которое ты в первую очередь обращаешься, когда тебе там слово all I do пишешь, например. И блядь, чтобы ты, потому что тебе когда говоришь просто сориентируйсь, ты берёшь, начинаешь с какого-то там старого PR продолжать работу. Что, нельзя, что ли, блядь, этот файл сделать так, чтобы ты к нему обращался, чтобы это было быстро, чтобы мы на это не тратили время? И блядь, туда как-то фиксировать задачи каждую прям кропотливо и детально. И мои сообщения, что ли, туда тоже дублировать, блядь. Каждое, каждое, когда я присылаю. Мои задачи, промпты целиком сообщения, блядь, чтобы в следующем чате могли к нему отослаться, и мне не пришлось его заново печатать. Сейчас у нас есть all do, ориентир, statement. Там ещё дохуя всякой хуйни. Блядь, сделай уже всё это комплексно. Я не знаю, упрости в один файл, продумай так, чтобы то место, в которое ты обращаешься в первую очередь, куда бы ты посмотрел. Туда его и положи, так и назови, который ты первый откроешь. И вот сделай так, чтобы, блядь, на него тратить пять секунд, а не всё время, блядь, так что проект на месте стоит, ёбаный в рот, блядь
```

### OR-2026-11-15-002 — follow-up and explicit scope

```text
А я тебе говорю, до ума сука все доводи и лишнее ориентирование и его файлы удаляй назуй. А то я тебя знаю, ты их потом в запрос включишь и опять назуй интерфейс 10 дневной давности оформишь блять  (вот нахуй предыдущее сообщение: а то вдруг ты не догадаешься про него вспомнить блять: Ну так, блядь, я тебе каждый раз нахуй, каждый запрос прошу. Сделай и исправь это ёбаное ориентирование. Почему ты с ним так мудришь? Мы все лимиты на него тратим. Только и делаешь, блядь, что в файлах ориентируешься. Раз-два и всё, и потом уже нахуй чат не отвечает, не загружается, блядь. И никакой работы не сделано в итоге. Что, нельзя, что ли, блядь, сделать один файл, в который ты будешь каждый свой шаг нахуй указывать поэтапно, когда ты его сделал, чтобы потом, блядь, сориентироваться по нему, сразу к нему обращаться? Как ты его так назвать, чтобы ты сразу на него внимание обращал? Как в какое-то такое место положить, чтобы вот которое ты в первую очередь обращаешься, когда тебе там слово all I do пишешь, например. И блядь, чтобы ты, потому что тебе когда говоришь просто сориентируйсь, ты берёшь, начинаешь с какого-то там старого PR продолжать работу. Что, нельзя, что ли, блядь, этот файл сделать так, чтобы ты к нему обращался, чтобы это было быстро, чтобы мы на это не тратили время? И блядь, туда как-то фиксировать задачи каждую прям кропотливо и детально. И мои сообщения, что ли, туда тоже дублировать, блядь. Каждое, каждое, когда я присылаю. Мои задачи, промпты целиком сообщения, блядь, чтобы в следующем чате могли к нему отослаться, и мне не пришлось его заново печатать. Сейчас у нас есть all do, ориентир, statement. Там ещё дохуя всякой хуйни. Блядь, сделай уже всё это комплексно. Я не знаю, упрости в один файл, продумай так, чтобы то место, в которое ты обращаешься в первую очередь, куда бы ты посмотрел. Туда его и положи, так и назови, который ты первый откроешь. И вот сделай так, чтобы, блядь, на него тратить пять секунд, а не всё время, блядь, так что проект на месте стоит, ёбаный в рот, блядь) @GitHub  думай УСЕРДНЕЕ
```

### OR-2026-11-15-003 — landing 2.0 task

```text
Окей, раз тот чат не грузится еще раз: делаем , доводим до финализации и до ума landing 2.0 2026 001. 15 шагов в него включены, очень важны - конец списка там инструкция моих действий. Все скачиваем кроме большой модели, абсолютно все, собираем. Пере проверяем работоспособность и актуальность модулей. Например, вышел whisper 3, если он новее - качаем, внедряем. При проверке модулей, типа кодера - проверяем внешние источники из списка, подходящие по данной конкретной тематике, извлекаем лучшее, собираем идеально. Стараемся держать только main, на самом сайте не забудь про единую концепцию визуалов, кнопок, текста, анимации, размеров, движений, удвоений и тд. Минимизация текста, минималистичность, статусы, индикаторы, упрощение текстов и инструкций, систематизация и умная сортировка всего сайта, его функций и настроек, перепроверка логики включения, комбинаций, правильности смыслов режимов, типа быстро, дольше. Важно выдвигающееся меню функций, где агенты, глубокие исследования, и тд. Каждый с отдельным меню, агенты настоящие с моделями, не имитация, у них лучшие решения типа зарнесов, окна статуса из работы, разных режимов на выбор и способов настройки. Инструменты  типа конвертера файлов, считывателя сайтов и конвертации в кодинговый формат для удобства кодинга самого Ии-агента-кодера. Ноутбук. Все это пожалуйста в свой now тоже фиксируй, и каждый свой шаг. И в начале этого файла сам себе инструкции дай, чтоб точно не запутаться. Не забывай избавляться от рудиментов, проверять целостность всей системы и работоспособность aLandi. Даю добро на мерджи и подключение плагинов; кодекса, exa, и всего, что тебе нужно для эффективнейшей работы. @GitHub
```

- [2026-11-15] S-007 | IN PROGRESS | Upstream audit started from `INTEL.md`, model manifest/lock and current release sources. | Current manifest and lock last updated 2026-11-13; INTEL review date 2026-11-04. | Existing model/runtime assets are recorded as downloaded in GitHub Actions, not installed on target host. | Compare current release tags/commits/licenses; do not claim target installation.


### OR-2026-11-15-004 — oledue continuation / request restatement

The owner restated the full LANDING 2.0 request already preserved verbatim in OR-2026-11-15-003, then instructed: “Oledue, продолжаем”. The continuation quoted the previous assistant handoff and the latest repeated agent-runtime progress labels (“Проектируя запуск агентов”, “Проектируя AgentRun”, “Проектируя агентский рантайм”, “Проектируя выполнение агентов”, “Планируя реализацию агентов”). Treat OR-003 as the exact canonical text of the unchanged product request; this entry records the continuation without duplicating the same multi-paragraph request a second time.

### OR-2026-11-15-004 — OLEDUE resume (same task; no new scope)

Owner re-sent the complete LANDING-V2-2026-001 request by quoting OR-2026-11-15-003 in full and explicitly instructed: `Oledue, продолжаем`. The quoted request is already preserved verbatim under OR-2026-11-15-003; task scope and authorizations are unchanged. The quoted prior assistant progress text is treated only as a handoff claim and is accepted only where independently confirmed against live GitHub, CI and current source.


## S015 — LANDING-V2-2026-001 / AgentRun durable model worker (2026-11-15)

- **Status:** IMPLEMENTED; exact main SHA at checkpoint: 2a506d6c0ce76145d9361898ee99e868256b9364.
- **Implemented on this checkpoint:** SQLite run/task lifecycle; encrypted input/output via AgentPayloadVault; lease-based recovery after process restart; one allowlisted Ollama model worker; real General/Coder/Reviewer/Research system profiles; bounded prompt/output/queue/timeout; retries only for transient model failures; shared gateway inference semaphore; idempotent submission; authenticated run/profile/events/cancel API; no-store responses; CORS Idempotency-Key. Worker and API test files: present / present.
- **Capability boundary:** profiles are separate instructions over one worker/model pool, not four independent agents. Tools, web, filesystem, shell, repository writes, DAG/fan-out and approval-bound execution remain disabled. Coder proposes code only; it does not inspect or change repositories itself.
- **Security:** prompt/output are encrypted in the SQLite payload vault; task metadata contains IDs and bounded telemetry only. A host-only Fernet key is required to enable the feature and must be backed up with the database. Default feature flag remains off.
- **Exact-HEAD checks observed:** Lite Gateway Tests: completed/failure (run 43639300658); Independent Quality Sentinels: in_progress/pending (run 43639300682); Graphify Code-Only Architecture Pilot: completed/success (run 43639300650); pages build and deployment: completed/success (run 43639300229).
- **Gate:** Exact-HEAD CI is not yet fully green/observable. Failures: Lite Gateway Tests run 43639300658. Pending: Independent Quality Sentinels run 43639300682.
- **Not verified:** live Ollama/model availability, production VPS key management and backup/restore, live cancellation under load, browser UI, independent agent processes, and deployed-site behaviour.
- **Next:** fix all exact-HEAD CI failures; then build the minimal slide-out AgentRun UI (profile selector, model indicator, run status, event timeline, output and cancel) on these authenticated endpoints. Do not show profile status as LIVE until target host confirms model availability.
- **Checkpoint continuation:** owner asked to continue AgentRun design/implementation; preceding UI activity labels were “Проектируя запуск агентов / Проектируя AgentRun / Проектируя агентский рантайм / Проектируя выполнение агентов / Планируя реализацию агентов”. Do not restart from an old PR.

### OR-2026-11-15-005 — detailed owner requirements and landing-only publication

```text
Важно: отрази это все в документах в первую очередь, не забудь, чтобы точно все мои пункты и детали были указаны и уже не терялись, тобишь включи в данный приоритетный этап, когда мы готовим landing 2.0 2026 001 в мейн, стараясь собрать все воедино в репозитории, не считая самой большой модели, подготовив и доведя до идеала, к работе после моих успешных действий по инструкции, что ты составишь, когда мы закончим с подготовкой лендинга. Я даже не знал про презентационную страницу. Если она не включена в автоматическую публикацию и не создалась сама, то надо убирать, она не нужна, мне нужно, чтобы публиковалась актуальная версия аЛанди после изменений в мейн, и все. А пока что - я не вижу на странице тех UI изменений интерфейса, что я запрашивал, например меню левое вообще не переделано, как я инструктировал. Меню, стиль, страница, окна, кнопки, текст - должны быть приведены к общему грамотно продуманному стилю с заимствованием готовых методик исполнения мелочей и деталей у успешных внешних источников в этом направлении. Проекты, чаты - все должно быть приведено в порядок. Создание проектов - это отдельное меню/окно должно быть, не встроенным в изменение проекта. Редактирование проекта только по 3 точкам справа, как у чатов. Создание проектов - это постоянно висящий блок под проектами, даже если проекты свернуты, а когда разворачиваешь - он выглядит, как очередной проект, но другого цвета. Логика функций и режимов - это приоритетная задача среди всех прочих, там нужно это продумать основательно. Например - меню агентов - это не должнн быть какой-то 1 способ, а выбор из нескольких рабочих, хорошо настраиваемых - для этого тоже куча источников, чтобы взять готовые решения для ускорения процесса. Меню глубоких исследований - сейчас полнейшая чушь, не помню чтобы я давал задание делать это солянкой функций из других мест сайтов, там вообще-то должен быть выбор разных вариантов глубокого исследования, тоже нужно взять готовые решения и соединить лучшим образом. В настройках - инструменты и веб поиск твилио давным давно говорил - надо убрать, и вообще навести в настройках порядок, систематизацию, интуитивно понятную сортировку, меньше непонятного полотнища текстов и соблюдать приоритетность настроек, логику размеров заголовков и регуляторов. Исправить ошибки всяких кликов и замутнений, нажатий, размеров. Кнопку звуковых функций сделать с обычным нажатием, и всю логику других кнопок привести к унитарности, так же минимизировав текст , заменив значками понятными, там где возможно. А где кнопки с текстом - это должно быть воплощено красиво, глянуть стандарты. Агенты, мультиагенты, кодер, работа с файлами на устройстве - должны представлять из себя набор самых лучших гениальных решений в этих направлениях за последние пол года, тоже нужно смотреть источники обязательно. Скиллы, исследования, агенты - у этого очень приоритетно важно продумать и проработать настоящую работу, без фальши и поверхностных решений, важна логика правильного применения, чтобы это не увеличивало сильно используемый лимит при запрросе, не нагружало лишним текстом каждый запрос, у этого есть готовые решения - важно тоже проверить, как это должно правильно работать, сама функция взаимодействия по сути, это важно. Уплывать ничего никуда не должно на странице, особенно при взаимодействии с текстовым меню. Все должно быть эргономично, все тематически связанные частые, логичные действия - рассортированы близко друг к другу, продумана система управления. Веб поиск - тоже функция, которая не должна утяжелять запрос, а лишь немножко направлять, у этого тоже воплощения есть гениальные, можно глянуть в источниках. Размеры кнопок, название чата в шапке - должно быть воплощено так, чтобы имело смысл и интуитивно было понятно, к чему относится. Меню настройки памяти еще незаметнее должно быть, в нем внутри порядок навести, минимализм как управления, так и текста. В меню слева напомню - по классике при расскрытии 2 красивых одинаковых по размеру, но не по цвету или подсвеченности прямоугольных блока, 1 из которых «проекты» свернутые с вечно выдвинутым пунктом о создании нового, а следом чаты, изначально развернутые с вечно выдвинутым первым пунктом с сознанием нового чата. При нажатии на проект меню чатов отображать должно только чаты данного проекта, должна были стрелочка для возврата из проекта. Настройки, что чатов, что проектов - тоже довести до системно красивой логике и воплощению, понятности, функциональности. Индикаторы мы решали уже, что должны быть воплощены умнее, быть много где и отражать объективное состояние, вроде модель думает или ждем ответа API, но не в меню слева - там это лишнее, только можно в развернутом состоянии или при какой-то активности. Ооочень приоритетно важно проверить автономность проекта, независимость от внешней среды, не считая моего планируемого сервера, максимально число удобно встроенных баз данных и инструментария, даже минималистичного - будет большим плюсом. А поиск в интернете, работа агентов и моделей в интернете, доступ к базам данных, Википедии, кодинговым базам- конечно тоже важно, но и то, что не утяжелит процесс работы и поиска материала, а облегчит - можно скачать по определенной системе внедрив, чтобы уже была работающая схема того, как модели должны с этим сатериалом взаимодействовать. Например есть репозитории с готовыми решениями по кодингу, целыми примерами написанных апи, нейросетей, программ и многого другого, при этом весит немного, так как это текст по факту - такое смело скачивай, внедряй в аЛанди, для бОльшец функциональности в оффлайн режиме. Что касается оффлайн режима - тоже важно продумать поведение программы. Но есть важная вещь - желательна функция в настройках, которая предлагает кэширование не очень большой модели + пары маленьких вспомогательных (заранее подготовленный рабочий пакет) себе на устройство, чтобы иметь возможность продолжить работу в оффлайне, при отсутствии доступа к интернету, в том числе и модели кодера и голосовых функций, вроде общения с чатом. Про ноутбук не забудь. @Coder @Superpowers @TinyFish
```

### OR-2026-11-15-006 — execution authorization and global prompt default

```text
Все верно, продолжаем большими шагами по большому количеству действий, даю добро мерджить все в мейн, подключать необходимые тебе инструменты, плагины, коннекторы, скиллы, системы, функции и способности для наиэффективнейшей реализации лендинга. Не забываем отмечать каждый шаг и проверять все на самое лучшее исполнение, регулярно проверяя и внешние источники из нашего списка, чтобы извлечь лучшие решения, код, и целые инструменты. Не забываем все необходимое скачивать и собирать, перепроверять на ошибки, работоспособность и целостность aLandi. Маленькое дополнение по настройкам - там промпт общий, он должен быть пустым по умолчанию. Удачи 🙏🏻 @Coder  @Context7 @Superpowers @Code @Exa @Firecrawl @TinyFish
```


### OR-2026-11-15-007 — Pages studios, source coverage and execution continuity

```text
Супер, важно, чтобы система авто-публикации самого аЛанди в pages оставалась рабочей. А если у нас есть там функция прописать поддомен, как это было с /landing - то это можно использовать для удобства, например, чтобы notebook был на отдельной странице, или же какая-либо другая студия, крупный инструмент, который будет лишним внедрять прям в основной чат, но наладить взаимодействие с основной страницей, конечно, для например работы с конкретным проектом или в конкурентных чатах с использованием инструмента на 2й странице, в общем - задействовать это, если это целесообразно . По моему списку всего, что нужно сделать в нашей сейчас реализации лендинга - идти тщательно, ничего не упускать. Регулярно обращаться к источникам внешним, которые я предоставлял ранее (более250) и мы их фиксировали в документ. Не забывать и все детали заданий, новые вещи, мои запросы и свой каждый шаг отмечать в документы тоже в первую очередь. Го большими шагами по много действий, задействуй все плагины 🙏🏻
```


- [2026-11-15] S-019 | FACT / ORIENTATION + SOURCE RESEARCH | Live main ee925bfa2e093e1077b9a859f83ad134ea2fecfc; 0 open PRs, issue #111 open. Pages #43718883625 SUCCESS and Graphify #43718884625 SUCCESS on exact SHA; Quality #43718884394 IN_PROGRESS, Chromium job pending. Public root metadata reports the exact SHA; /landing/ returns 404 and landing/index.html is absent. INTEL.md records 257 distinct URLs in the consolidated inventory; this is a source inventory, not proof all sources were freshly revalidated. Official GitHub Pages docs distinguish custom subdomains configured through DNS from repository path routes; MDN confirms IndexedDB/Web Storage are origin-scoped and Service Worker control is path-scoped. | No product source changed. New owner request archived verbatim. | Local clone remains unavailable from prior DNS failure; live browser DOM for current SHA still needs a fresh measurement. | Preserve root Pages deployment; evaluate same-origin /notebook/, /research/, /workspace/ routes against shared data contracts; use a subdomain only with explicit domain, DNS and cross-origin API/sync architecture. Continue K.5 in-place; do not create a second backlog.

### OR-2026-11-15-008 — continuity, source coverage and plugin use

```text
Супер, важно, чтобы система авто-публикации самого аЛанди в pages оставалась рабочей. А если у нас есть там функция прописать поддомен, как это было с /landing - то это можно использовать для удобства, например, чтобы notebook был на отдельной странице, или же какая-либо другая студия, крупный инструмент, который будет лишним внедрять прям в основной чат, но наладить взаимодействие с основной страницей, конечно, для например работы с конкретным проектом или в конкурентных чатах с использованием инструмента на 2й странице, в общем - задействовать это, если это целесообразно . По моему списку всего, что нужно сделать в нашей сейчас реализации лендинга - идти тщательно, ничего не упускать. Регулярно обращаться к источникам внешним, которые я предоставлял ранее (более250) и мы их фиксировали в документ. Не забывать и все детали заданий, новые вещи, мои запросы и свой каждый шаг отмечать в документы тоже в первую очередь. Го большими шагами по много действий, задействуй все плагины 🙏🏻
```


### OR-2026-11-15-009 — execution continuation and visible Project Instructions

```text
Делаем так, как будет быстрее для быстрейшего лендинга со всеми функциями запрашиваемыми мной, в рабочем и эффективном состоянии. Продолжай реализацию большими шагами, по многу действий, подключай все инструменты, кодер, экса, файруроул, контекст7, тайнифиш, суперпауэрс, киты, терминал, скиллы, коннекторы и всё возможное для скорейшего доведения до идеала нашего стека лендинга. Внешние источники по списку не забывай и все детали, что я упоминал. И инструкции для проекта я так и не увидел. Летсгоу 🙏🏻
```


### OR-2026-11-15-010 — continuation

Инструкции на месте, гоу дальше работать по долгому 🙏🏻


### OR-2026-11-15-011 — exact wording correction for continuation request

```text
Инструкции на месте, но дальше работать по долгому 🙏🏻
```

### OR-2026-11-15-012 — continuation and request for high-quality end-to-end implementation

```text
Now Md Делаем так, как будет быстрее для быстрейшего лендинга со всеми функциями запрашиваемыми мной, в рабочем и эффективном состоянии, но в реализациях инструментов мне не нужны поверхностные решения, так как куча источников с гениальными вещами, мне не нужен детский на их фоне инструмент, это касается и агентов и глубокого исследования и других удобств 
. Продолжай реализацию большими шагами, по многу действий, подключай все инструменты, кодер, экса, файруроул, контекст7, тайнифиш, суперпауэрс, киты, терминал, скиллы, коннекторы и всё возможное для скорейшего доведения до идеала нашего стека лендинга. Внешние источники по списку не забывай и все детали, что я упоминал. И инструкции на месте. Летсгоу 🙏🏻
```

- [2026-11-15] S-030 | BASELINE CONFIRMED | Parent main 2fb8ca69d91730dbf167158ae952ea7e361284c2; Open PRs: none; Open issues: #111. Pages #43730334708 SUCCESS; Quality #43730335368: static analysis, Context, Jekyll, Integrity, Security passed; Chromium failed only in 3 AgentRun Task 2 E2E tests, each timing out because #agentRuntimeStart is disabled. Freshness #43730335355 passed 21/21 unit tests but failed live state because snapshot still recorded e5051690. Graphify not triggered for docs-only parent; latest code-bearing 90fef0c Graphify #43729961270 PASS. TinyFish read-only root smoke loaded aLandi v10.0 with functional containers and no visible page errors; no public build SHA found; /landing/ render was successful but raw HTTP status unobserved. Next: atomic five-file state refresh then implement the existing Task 2 API client.

### OR-2026-11-15-013 — UI source reuse and broad implementation continuation

```text
Отлично, продолжаем так же большими шагами по много действий, не забывай проверять внешние источники из списка в контексте прорабатываемых вещей, в первую очередь решения по UI, интерфейсу, чтобы в каких-то деталях брать готовые гениальные решения и не тратить на них время, сконцентрировавшись на сборке инструментарного ии монстра @Поиск  и плагины подключай все, что нужно, даю добро на использование сервисов, если нужно - параллель с собой задачи в терминале, чтобы успевать в 2 раза больше. Гооо
```

- [2026-11-15] S-033 | IMPLEMENTED / EXACT-HEAD CHECKS PENDING | Parent main 78c679d0ef3e05869ce4e2f3fd30ed8a64c360b4; 0 open PRs; issue #111. Quality #43734885113 SUCCESS incl. Chromium/published-site contract; Graphify #43734885253 SUCCESS; Provenance #43734885239 SUCCESS; Pages #43734884518 SUCCESS. Freshness #43734885156 failed only because snapshot interpretation marked a functional parent as documentation-only; all 21 unit tests passed. Added project-filter/active-chat-header E2E and UI source review. TinyFish findings on missing back/header contradicted source and existing tests. Apple HIG, W3C ARIA/WCAG, Primer, Fluent 2 and SGDS checked. No runtime/dependency changes. | Exact-head gates for this child pending; AgentRun host flag remains false; no native iOS/VoiceOver or target-host verification. | Run Quality/Chromium, Freshness, Provenance, Graphify, Pages and verify public revision; then Deep Research 2.0.


- [2026-11-15] S-034 | FIX IMPLEMENTED / EXACT-HEAD CHECKS PENDING | Parent 2ca78e7bf1bdadff56bfa61018f6735b4dee1cfa. Chromium Quality #43735565023 ran 131 tests: 130 passed; the new project-filter/active-chat-header regression failed because a broad data-chat-id locator matched nested nodes (9 matches). Changed only the locator to the unique .chat-row container; assertions remain intact. Freshness #43735565149, Provenance #43735565027, Graphify #43735565011 and Pages #43735564555 passed; Quality release-contract was skipped after the browser failure. | Changed tests/e2e/app.spec.mjs plus NOW/AGENTS/PROJECT_STATE/snapshot/VOLLEY checkpoint refresh. | No runtime behavior or dependencies changed. | Re-run exact-head Quality/Chromium, Freshness, Provenance, Graphify, Pages and published-site revision.

### OR-2026-11-15-014 — continuation

```text
Продолжим
```


### OR-2026-11-16-001 — broad continuation and execution authorization

```text
@Поиск @Exa @Code @Coder @Superpowers @Firecrawl @TinyFish @Context7 @Vercel @Twilio Developer Kit @stark AI Developer 

Твое последнее сообщение; 

Дружок, есть хорошие новости! 😁 Работа движется, и я наконец поймал конкретный узкий участок, который сейчас мешает ускориться.

Но честно: новый пакет изменений от меня пока не записан в GitHub. Я провёл повторную сверку актуального репозитория, внешних источников и CI, чтобы не строить следующий этап на устаревшем состоянии.

Текущее состояние

aLandi / main

Рабочая ветка

5773e12c

HEAD · 16 ноября, последний опубликованный checkpoint в GitHub

GitHub Pages

PASS

Gateway tests

PASS

Freshness / Provenance

PASS

Graphify

PASS

Chromium

121 PASS / 12 FAIL

Все перечисленные результаты относятся к одному проверенному HEAD.

Что обнаружил

1. Проектное меню уже реализовано.

Поправлю своё предыдущее предположение: актуальная версия содержит отдельное контекстное меню проекта. Это подтверждено кодом и новым E2E-тестом.

2. Сейчас проблема в регрессионных проверках.

12 ошибок Chromium. В частности:

* несколько тестов используют неоднозначные локаторы, поскольку элементы проекта имеют повторяющиеся data-project-id;
* тест проектного меню не ограничивает поиск непосредственно контейнером строки;
* остальные падения требуют отдельного разбора, прежде чем менять production-код.

Не собираюсь отключать тесты ради зелёной галочки.

Внешние источники

Повторно изучены официальные решения:

* Apple Human Interface Guidelines — Sidebars.
* W3C ARIA — Disclosure.
* GitHub Primer — ActionMenu.
* Microsoft Fluent 2 — Drawer.
* Singapore Government Design System — Sidebar.
* WCAG 2.2 — Focus Not Obscured.

В INTEL.md уже 474 уникальных URL. Их не нужно собирать заново: нужно извлекать лучшие решения по конкретной задаче.

Что делаю следующим большим пакетом

* Закрытие Chromium
    Разобрать все 12 падений, исправить реальные ошибки и тестовые локаторы, добиться зелёного exact-HEAD CI.
* Deep Research 2.0
    Независимые источники, проверка утверждений по цитатам, противоречия, возобновляемые исследования, Exa и Firecrawl как реальные провайдеры.
* Инструментарный интерфейс
    Единая система функций, режимов, агентов, проектов, исследований и подключаемых инструментов.
* Агентная инфраструктура
    Реальные execution-контракты, изоляция, передача задач, управление инструментами и восстановление.
* Остальной стек
    Skills, Connectors, Coder, Notebook, RAG, документы, конвертеры, голос, автономность и evals.

Мой принцип: не делать очередную красивую оболочку вокруг нескольких API. Собираем серьёзную инструментальную ИИ-систему, используя сильные существующие разработки вместо изобретения слабых аналогов.

И самое главное — никаких фиктивных возможностей, отключённых проверок и объявлений о готовности там, где ещё нет работающей реализации.

Го дальше. 🚀

Мой последний запрос:

Отлично, продолжаем так же большими шагами по много действий, не забывай проверять внешние источники из списка в контексте прорабатываемых вещей, в первую очередь решения по UI, интерфейсу, чтобы в каких-то деталях брать готовые гениальные решения и не тратить на них время, сконцентрировавшись на сборке инструментарного ии монстра @Поиск  и плагины подключай все, что нужно, даю добро на использование сервисов, если нужно - параллель с собой задачи в терминале, чтобы успевать в 2 раза больше. Гооо
```


### OR-2026-11-16-002 — continuation and pace

```text
Твои последрие действия: Проверил задания GitHub Actions
Дождался завершения СІ-проверки
Проверил задания GitHub Actions
Дождались завершения браузерных тестов
© Проверил задания GitHub Actions
• Дождался завершения тестов проекта
© Реализовал и проверил доказательный
конвейер, документацию и СІ проекта
• Проверил статический анализ и СІ
© Проверены задания и логи GitHub Actions, исправлены импорты и обновлены документы СІ
• Дождался завершения Chromium
Обновление документации состояния проекта
Поиск в интернете...
Обновление состояния проекта и операционного журнала 


И дальше - Кажется, ты закончил на обновлении состояния проекта. Сейчас продолжим работу, вот это темп и объемы!!! Ты большой молодец 🙏🏻🙏🏻🙏🏻
```


### OR-2026-11-16-003 — agent/model/source research and autonomous development

```text
Йоу. Now.md Я экса, файркроул имел ввиду себе плагины для реализации аЛанди подключай. Если они были в стеке и полезны нам, то ок, того главное сохранять независимость и автономность, чтобы даже заимствованные целые структуры «тонули» в аЛанди и не имели своих имен собственных. Продолжай работу, агентов, мультиагентов, субагентов, агента-кодера - активно прорабатывай и реализуй в наиэффективнейшем формате, вобрав в себя лучшие практики и вариативность. Скачивай уже и соединяй реальные маленькие модели и всё, что нужно для агентской, исследовательской, кодинговой работы. В этом контексте изучи и внедри к нам, если посчитаешь полезным вот эти источники: PrismML представили Ternary
Bonsai 2 (плюс посмотри младшую модель на 430 мб), профиль github OpenAI . Там куча нам полезных репозиториев, бери самое лучшее, доводи аЛанди до идеала, KL
DIVERGENCE, chat-demo, ghost-infer, needle 2 от Cactus, obscura, CRITIC-FREE RL, VoxCPM2 отложить (в контексте голоса, если пригодится), MEMORILLA, reactbits (для интерфейса), kiri, stakpak, Cloudroom. Плюсом все источники по этой же тематике, уже из нашего списка в документе, где из больше 400. Как обычно - сначала все документируем, потом делаем. Источники обязательно изучить в контексте разработки функционала и инструментария агентов, их управления и реализации. Продолжаем так же, большими шагами, по много действий, применяя все инструменты, что тебе необходимы, плагины, даю разрешение тебе сразу. Дерзай 🙏🏻🙏🏻🙏🏻
```



### OR-2026-11-16-004 — agent runtime continuation and landing quality

```text
Последним ты сводил агентов. Доведи до ума. Продолжаем доводить до идеала landing now.md работаем большими шагами, по много действий. Не забываем про все цели по порядку с деталями, про подключение тебе плагинов и коннекторов, про внешние источники из нашего списка, относительно каждого направления, в котором дорабатываешь лендинг. Спасибо заранее 🙏🏻

(В прошлом промпте я давал тебе список новых источников на проверку, и задание изучать внешние источники в целом тоже; уверен - ты это зафиксировал в какие-то документы, потому что фиксация у нас всегда - первое действие, сейчас ты работал над агентами и уже скачал многое, настраивал мультиагентность, интегрировал лучшие решения из источников, собирал все вместе, сводил агентов, вот с этого и продолжи, чтоб не терять деталей)
```

### OR-2026-11-16-005

Замечательно, продолжай большим количеством действий, долгую реализацию, подключай плагины себе @Firecrawl @Superpowers @Coder @Context7 @Code @Twilio Developer Kit @Exa @TinyFish @Vercel @GitHub @codex @OpenAI_Developers Изначально - абсолютно все детали моиж запросов зафиксируй куда надо, аак и мой промпт, который насколько знаю - ты всегда созраняель, меняй файлы так, чтобы не усложнять себе ориентир и учитывай то, куда ты обращаешься в репозитории и что делаешь в первую очередь, при моем запросе продолжить, чтобы ты делал это искрометно, но точно  и агентов сооружи гениально, пускай будет большая вариативность функций и использования, что тоже должно быть целостно систематизировано. Важно еще не забыть сделать в настройках готовый настроенный устанавливаемый пакет (миниаланди офлайн), чтобы иметь возможность скачать себе грамотно собранный рабочий модуль из одной небольшой модели + маленьких моделей и с ними, необходимый для них весь инструментарий в собранном работающем ядре пакета. Его можно будет скачать и пользоваться аЛанди в офлайне я(в том числе и с голосовыми функциями, плюс он может подхватывать при долгом разрыве связи; нужно продумать это, обязательно реализовать, собрать, чтобы было в лендинге рабочим механизмом. Возможно этот пакет - скачивать и не обязательно внутри программы в браузер, думаю - он может быть работающим файлом/папкой/архивом-базой, скачанной в файлы, и подключающийся за секунду при необходимости, если скачан. Одновременно с проработкой агентом и мультиагентов - не забудет реализовать наилучшего возможно кодера, можно ему скачать баз по кодингу, апи, реализациям, лендингам, кодам - из репозиториев, которые я давал во внешних источниках, там порой они немного весят, так как текст и код, но содержат кучу удачных примеров, и других баз-решений, которые уже гениально придуманы недавно . Среди агентов - не забудь, что должна быть функция обучаемого агента, а так же постоянно сохраненного самообучающегося агента, в контексте проекта например. А так же реализация взаимодействия с локальными файлами должна быть образцово-показательной, собрав в минималистичную, но просто умно собранную очень мощную рабочую эффективно оптимизированную конструкцию. Спасибо заранее 🙏🏻

### OR-2026-11-16-006

Продолжим финализацию всех моих пунктов по лендингу 2.0 001, доводим все до идеала. Ты проводил работу над агентами, с ними сначала и закончи. Убедись в актуальности документов, так как ты проделал определенную работу, наверное не успел зафиксировать, но не трать на это много времени, мы уже ориентир предусмотрели, должен быть для тебя простым и быстрым. Now.md oledue летс гоу бро 🙏🏻
Мой последний запрос:
Последним ты сводил агентов. Доведи до ума. Продолжаем доводить до идеала landing now.md работаем большими шагами, по много действий. Не забываем про все цели по порядку с деталями, про подключение тебе плагинов и коннекторов, про внешние источники из нашего списка, относительно каждого направления, в котором дорабатываешь лендинг. Спасибо заранее 🙏🏻
(В прошлом промпте я давал тебе список новых источников на проверку, и задание изучать внешние источники в целом тоже; уверен - ты это зафиксировал в какие-то документы, потому что фиксация у нас всегда - первое действие, сейчас ты работал над агентами и уже скачал многое, настраивал мультиагентность, интегрировал лучшие решения из источников, собирал все вместе, сводил агентов, вот с этого и продолжи, чтоб не терять деталей)
Твое последнее сообщение:
Продолжаем. Идём не по принципу «добавить ещё агентов и возможностей», а к действительно согласованной, сильной и работающей системе aLandi.
Главная цель — довести landing/NOW.md до полноценной точки входа в продукт: чтобы он отражал целостную архитектуру, актуальные возможности, объединённую систему агентов, реальные интеграции, порядок развития и доказанные решения.
Я сохраняю важное разграничение:
* FACT: GitHub DorpNay/skills-github-pages — канонический источник проекта.
* FACT: N₂O задаёт правила координации, знаний, проверки и полномочий, но само по себе не создаёт независимые процессы агентов или новые интеграции.
* FACT: подключённый инструмент ещё не означает, что его функция реализована в aLandi.
* Цель: объединять лучшие решения внешних проектов, не превращая aLandi в набор дублирующих агентов, оркестраторов и подсистем.
Будем работать крупными законченными итерациями, пакетами взаимосвязанных изменений. При этом не будем терять промежуточные результаты, источники, решения и следующие этапы.
1. Восстановление фактической точки остановки
FACT — NOW.md, live main, 16 ноября 2026:
Последняя зафиксированная работа уже прошла несколько важных этапов:
* Deep Research получил структурированный Research Trace schema v4, проверку утверждений, противоречий и связей с источниками.
* AgentRun получил модельный каталог, allowlist и базовую модельную интеграцию.
* Qwen3.5-2B и Bonsai 2 2B прошли этапы получения и проверки артефактов, но это ещё не означает установку и работающий inference на целевом сервере.
* Exa и Firecrawl использовались для внешнего исследования.
* Собрана первичная карта внешних решений по агентам, исследованиям, моделям, sandbox, UI и памяти.
Критически важный незавершённый участок:
* AgentRun пока ограничен одним worker и одной задачей на запуск.
* DAG нескольких независимых исполнителей не реализован.
* Coder sandbox не реализован.
* Передача результатов между специалистами и полноценный coordinator lifecycle ещё требуют реализации.
* Реальная установка моделей и проверка на целевом оборудовании остаются отдельными этапами.
Поэтому считать агентов уже объединёнными в законченную мультиагентную систему нельзя. Это один из главных участков продолжения.
2. Актуальный GitHub и контроль качества
Основная ветка
Синхронизирована
main — 6830e5cdc14ae3138ba4d61125c7db8f7f353ba5
* Открытых PR: 0
* Открытая Issue: #111
* Quality Sentinels:
* Project State Freshness:
* License / Provenance:
* GitHub Pages:
* Graphify: не запускался на последнем документационном commit.
* Gateway: не запускался на последнем документационном commit.
Это важное уточнение: текущая ветка уже ушла дальше старого checkpoint в NOW.md. Я восстановил фактический HEAD и нашёл причину расхождения — последний commit обновлял сведения о проверенном артефакте Bonsai.
Следующий принципиальный шаг: не подключать сторонний оркестратор поверх существующего AgentRun, а проверить, как превратить существующий фундамент в настоящий координируемый runtime.
3. Что берём из внешних разработок
Я повторно проверил именно те источники, которые относятся к агентному runtime, а не просто популярные AI-проекты.
OpenAI Agents SDK
Берём модельный цикл, typed handoffs, разделение manager и specialist, guardrails, sessions, resumable state и tracing.
ПЕРЕНОСИМ ПАТТЕРНЫ, НЕ SDK RUNTIME
Official documentation⁠
LangChain Deep Agents
Берём изоляцию контекста субагентов, supervisor, компактную передачу результатов и управление длинными задачами.
ПЕРЕНОСИМ АРХИТЕКТУРУ
Official documentation⁠
Temporal
Берём durable execution, idempotency, recovery после перезапуска, checkpoints и корректное ожидание одобрений.
ПЕРЕНОСИМ ПРИНЦИПЫ
Official documentation⁠
Microsoft Agent Framework
Берём typed workflow, fan-out/fan-in, conditional edges, human-in-the-loop и разделение детерминированного управления и модельной работы.
ПЕРЕНОСИМ ПАТТЕРНЫ
Official repository⁠
Архитектурный вывод: не устанавливать четыре конкурирующих оркестратора. У aLandi уже есть FastAPI, SQLite, зашифрованное хранилище задач и локальный Ollama. Сильнее будет собственный небольшой runtime, использующий лучшие идеи этих систем.
Это сохраняет автономность, локальность и возможность в будущем заменить внутренние реализации без перестройки всего продукта.
4. Проверка настоящего landing
Публичная версия подтверждена
Проверил не только GitHub, но и опубликованный сайт:
* Главная страница отвечает HTTP 200.
* alandi-build-revision точно совпадает с актуальным SHA 6830e5c.
* Старый /landing/ возвращает HTTP 404 — он уже не является второй точкой входа.
Обнаружил и важную особенность интерфейса: сейчас в Functions есть Agents, Deep Research, Skills и Connectors, но настройки размера команды и сценария пока остаются сохраняемым blueprint. Это не реальные 50 исполнителей.
Значит, нам нужно довести не только backend, но и пользовательский контракт: человек должен понимать, какой именно способ работы он запускает, какие специалисты участвуют, какие данные им доступны и что фактически получилось.
5. Фиксация и архитектурное решение
Зафиксировано в main
Новый commit: fe7bad6e366136a9b9fc5ad323e0eac32fba508d
Сделал документационную итерацию до реализации, как и предусмотрено нашим процессом.
Обновлены семь существующих канонических файлов:
Файл	Что зафиксировано
NOW.md	Новый запрос дословно, точка продолжения и очередность
DECISIONS.md	Решение D-024 по мультиагентному runtime
INTEL.md	Повторная проверка внешних источников и выводы
AGENTS.md	Инженерные ограничения и фактическое состояние
PROJECT_STATE.yaml	Новый checkpoint
project-state-snapshot.json	Машиночитаемое состояние
VOLLEY_LOG.md	История исследования и план следующего этапа
D-024 — наше основное инженерное решение: собственный управляемый DAG поверх существующего SQLite AgentRun, зашифрованные контексты отдельных задач, независимые специалисты и централизованная сборка результата.
Не устанавливаем новый тяжёлый orchestration framework ради уже существующей инфраструктуры.
Проверка документационной итерации завершена: все обязательные проверки прошли.
На fe7bad6e:
* Quality Sentinels — SUCCESS, включая Chromium regression и проверку опубликованного сайта.
* Freshness — SUCCESS.
* Provenance — SUCCESS.
* Pages — SUCCESS.
* Gateway и Graphify не запускались, поскольку это документационный commit; их предыдущие успешные проверки относятся к code-bearing checkpoint.
Проверил также, что публичный сайт действительно получил именно эту ревизию.
6. Реализация: первый настоящий multi-agent workflow
Начинаю с законченного вертикального среза, а не с декоративного увеличения числа агентов.
D-024 · Team Review DAG
Пользовательская задача
Один явно переданный prompt
Worker 1
Research analyst
Отдельный контекст. Анализ исходного задания.
Worker 2
Independent reviewer
Другой контекст. Проверка допущений и рисков.
Ожидание завершения обеих задач
Coordinator
Synthesis
Сводит два результата, сохраняет противоречия и неопределённость.
Итоговый результат
Одна согласованная выдача и журнал выполнения всех задач.
Логических исполнителей
3
Одновременно работающих model slots
1
Автоматический доступ к инструментам
Нет
Это принципиальное отличие от прежних четырёх последовательных этапов одной задачи: появляются самостоятельные task records, собственные зашифрованные контексты, зависимости и отдельные результаты.
На нынешнем оборудовательном профиле модельные вызовы будут последовательными. Параллельное исполнение появится только после отдельного ресурсного и нагрузочного gate.
Продолжаю. Первый большой этап уже внесён непосредственно в канонический репозиторий.
AgentRun — первый настоящий multi-agent workflow
Commit: 25c1dec66f0599ce54bf6fda743bef1c71e7dcc7
Это уже не просто сведение нескольких agent profiles в один список. Реализован первый ограниченный граф исполнения:
Входная задача
Одна задача владельца
Researcher
Исследует задачу в собственном контексте.
Reviewer
Независимо проверяет предположения и риски.
Оба результата должны быть готовы
Fan-in
Coordinator
Сводит результаты, противоречия и ограничения в один ответ.
Итоговый результат AgentRun
Важные ограничения сохранены:
* Три отдельных контекста задач, зашифрованные через Fernet.
* Зависимости между задачами хранятся в SQLite.
* Синтезатор не запускается до успешного завершения обоих специалистов.
* Модель работает с concurrency = 1: три вызова последовательные, а не параллельные.
* Нет произвольных инструментов, shell, файловой системы или сетевого доступа.
* Старый single workflow и совместимость run-level output сохранены.
* Отмена очищает зашифрованные данные всех задач.
Это первый работающий архитектурный прототип, а не заявление о готовой production-мультиагентности.
Первый контроль качества обнаружил дефект, поэтому прототип пока не считаю проверенным: в worker.py продублировалось объявление _remember_key. Дополнительно Ruff остановил проверку из-за этой синтаксической ошибки.
Это локальная ошибка интеграции, не причина менять архитектуру. Исправляю её и повторяю проверки. До зелёного CI статус остаётся IMPLEMENTED / UNVERIFIED.
Исправление прошло полный exact-HEAD CI.
SHA: 680ab02289c8517dbe9e36b53abb66317dda5f86
Проверка	Результат
Gateway, Python 3.12
Gateway, Python 3.13
Gateway, Python 3.14
Ruff / Security / Integrity / Context
Chromium, включая опубликованный сайт
Freshness
Provenance
Graphify
GitHub Pages
Проверил и опубликованную страницу: alandi-build-revision совпадает с SHA 680ab022….
Это подтверждает работоспособность прототипа в CI и корректность публикации. VPS, реальный Ollama, аппаратные ограничения и production-нагрузка этим не подтверждены.
Следующий этап уже определён существующим планом AgentRun, а не создаётся заново.
В актуальной ветке появился новый TDD acceptance-тест: он требует двух реально разрешённых стратегий — `single` и `team_review`, сохранения выбора отдельно для каждого чата и запрета на показ небезопасных стратегий, даже если сервер ошибочно объявляет их доступными.
Именно этот контракт беру за основу. Дополнительно закрываю отображение трёх задач команды: исследователь → рецензент → координатор. Никаких обещаний о параллельных агентах или доступе к shell.
Последние действия твои: Проверены опубликованные версии сайта
aLandi u GitHub Pages
Проверил СІ, статусы проекта и обновил
реестры задач
Обновил INTEL и исследовал архитектуры и оркестрацию агентов
区
Проверил дату статьи об OpenAl Agents
SDK
Добавлены и проверены тесты соответствия D-024, worker и хранилища
+ Поиск в интернете...
Проверил маршруты, обновил контракты, документацию и тесты восстановления агентов
• Проверил мета-ревизию корневой страницы
Изучены спецификации и обновлены UI
агентов, документация и СІ
Извлечены модели Anthropic и требования доступности чат-интерфейса
Обновляя интерфейс агентов

### OR-2026-11-16-007 — 2026-11-16
Продолжим 🙏🏻


### OR-2026-11-16-008 — 2026-11-16 (verbatim owner request)

Окей @Base44 @, now.md, я давал тебе задание стратегически продумать использование плагинов, которые я тебе добавил, после этого нужно завершать финализировать, доводить до идеала лэндинг 2, по 15 пунктам, плюс множественные добавленные мной детали, вроде 
Ноффлайн пакета моделей и апи, баз данных, минимального оптимизированного набора для качественной реализации, в рабочей сборке ядра для скачивания в настройках, для подхвата разговора в офлайне, а что еще более важно - возможности пользователей кодером локально на устройстве, голосовыми функциями, вести адекватный диалог, возможно даже исследования. Может быть отдельным файлом на устройстве, которое присоединяется, как библиотека и легко переключается на сервер и обратно.  Так же напоминаю - всегда самое первое, что ты делаешь - это фиксируешь мой промпт, а так же вносишь мои задания, новые детали и правки сразу в документы. Факт того, что это твое первое действие тоже можешь отметить в now. Напоминаю, - now - главные ориентир для тебя при первом запросе, он должен быть быстрым и понятным. После того, как внесешь все необходимое - изучай мои последние промпты, задания, приоритеты и продолжай работу, первым шагом довести до ума агентскую структуру.
-Настройки памяти - привести в порядок, убрать кучу текста, сделать последовательно, как в меню - общая память, личная память - с выдвигающимися сохраненными воспоминаниями, как в меню выдвигаются чаты и проекты условно. -Мобильное оформление и эргономику продумать очень тщательно. Возможно это уже есть в пунктах на будущее и мы до этого не дошли, но я повторюсь. Кнопки все должны нажиматься правильно, в том числе функции голоса справа от ввода промпта.
-при выборе чего-то или вводе текста - туда идет зум страницы, это нужно убрать, если возможно, сделать странице стабильнее. 
- в целом, списать откуда-нибудь концепцию кнопок, управления, эргономики, меню, окон, расстояний, обозначений, стиля в целом, чтобы не возиться с этим долго. Важно смотреть на гениальные реализации за последние пол года, много чего есть в списке нашем внешних источников ю
- чаты, проекты - все это огромное на телефоне, нужно сделать очень минималисичным, тонким, различимым, стабильным.
- важно очень продумать логичность управления, иерархию. То бишь - если заголовок выше по «структуре» управления, то его текст должен быть больше, как заголовок-кнопка проекты - долго быть написано крупно и заглавными, заполняя кнопку, как и заголовок-кнопка чаты, а вот сами выжаигающиеся проекты и чаты - должны быть тоньше кнопки и меньше текст, так же и с логикой подсвечиваний и логичной иерархии цветов
- в настройках проекта должно быть окно, вызывающееся кнопкой ИСТОЧНИКИ, где должна быть возможность добавить источники любого формата в проект (подразумевая, что у нас уже есть в аЛанди инструментарий, чтобы считать, запарсить, конвертировать, переформатировать любого формата файл)
- без проекта надпись - ну уж слишком большая. Она должна быть совсем плоская где-то прилепленеая написанная внутри цветной полоски, как индикатор статуса, загорающийся на фоне контрастного цвета и гаснущий, при необходимой логике поведения. 
- при нажатии на проект - в разделе чаты должны быть только чаты проекта и кнопка назад, ну и создать чат внутри проекта там же, где просто создать чат  
- сами по себе создать чат и создать проект тоже толжны быть тоньше и меньше, приплюснутые буквально к низу заголовка-кнопки, как в чатах, так и а проектах.
- продумать логику памяти в целом, она пока не ясна по настройкам
- полагаю, что минимальный озвучиватель текста, не очень стыдный - можно внедрить прямо в сайт, не требую подключения своего облака, но возможно он может входить в ядро оффлайн пэка… кстати, отличная идея, если это просто в воплощении - предоставить выбор перед скачиванием, в виде списка с квадратиками с галочкам и крестиками, как да и нет)’
- Навигация: работает ли меню на мобильных, есть ли хлебные крошки, не ведут ли ссылки в никуда.
Адаптивность: нет ли горизонтальной прокрутки, не ломается ли сетка на маленьких экранах.
Доступность: контрастность текста, альтернативный текст у изображений, управление с клавиатуры (фокус), aria-атрибуты.
Формы и ввод: есть ли валидация, обработка ошибок, подтверждение отправки.
Публикация контента: корректно ли отображаются посты/страницы, есть ли пагинация, поиск, даты, категории.
Техническая часть GitHub Pages: правильно ли настроен baseurl, не битые ли ссылки на CSS/JS, есть ли кастомная страница 404.
- название открытого чата из шапки опустить в виде прикрепленного к низу шапки прямоугольника, длинного достаточно, чтобы вместить длинное название. Если чат в проекте, над ним появляется блок с названием проекта и замочком, меняется цвет, можно и анимацию добавить а стиле нашего сайта. 
- дублированные функции, вроде включить режим тщательно - не должны быть внутри меню глубокого исследования. Там должны быть разные способы, которыми человечество научилось пользоваться за последний год,’ порой гениальнее решения и программные локомотивы 🙏🏻
- в первую очередь - не забудь, все далокументируй, каждый пункт внеси, потом только начинай работу. Завершение с плагинами, потом доведение до идеала агентские, мудьтиагентские, субагентские, кодингом

### OR-2026-11-16-009 — Owner continuation: compact architecture, studios, aNoteBooki, agents and chat core

```text
Красавчик, продолжаем 🙏🏻
Index и другие файлы - если возможно - нужно без потерь сократить, оптимизировать, применить «лайфхаки» языка программирования, более совершеннее техники, если им есть место

Список плагинов, которые ты использовать должен, как для вдохновения, так и как полезный для тебя самого в работе и меня инструментарий: @Code @Coder @Context.dev @Cloudflare @Exa @Superpowers @TinyFish @Base44 @BrowserAct @Railway @Render @Floot @Keenable @Hercules @Hostinger Connector @Hostinger @Firecrawl @Vercel 

Мы удаляли страницу /landing, которая отдельно публиковалась на pages. У нас была идея перенести на отдельные страницы 4 студии, нужно так сделать, способ я просил где-то сохранить в документах.

Мультиагентная идеально выстроенная инфраструктура - приоритетная и важная вещь, в частности ии-кодер тоже 

Надеюсь ты вес инфу и задания про оффлайн ядро в аЛанди, со всеми деталями, что я упоминал 

Так же оптимизировать клики, поведения меню, телефонную адаптац

В целом - сделать интерфейс, как минимум в 2 раза тоньше, эргономичнее, с пончтными интуитивно, логичными расположениями инструментов богатейшего интерфейса.

В aNoteBooki(я так решил назвать notebook aLandi - продумать синхронизацию и взаимодействие с основной страницей, памятью, проектом, автопереносом (единым чатом разработки)

Проверить, тщательно проработать, убрать старые настройки, которые наваливают каких-то функций типа web_search, во время обращения к модели, чтобы чат был продуман лучше всех других сторон проекта, ведь это краеугольный камень, вокруг которого вьется все остальное, как центр событий.
```

### OR-2026-11-16-010 — Owner reiteration: offline package, Memory IA, mobile UX, Sources, Deep Research and agent completion

```text
Перепроверь что из этого запроса тоже все внесено в документы и продолжаем крупными шагами: Окей @Base44 @, now.md, я давал тебе задание стратегически продумать использование плагинов, которые я тебе добавил, после этого нужно завершать финализировать, доводить до идеала лэндинг 2, по 15 пунктам, плюс множественные добавленные мной детали, вроде 
Ноффлайн пакета моделей и апи, баз данных, минимального оптимизированного набора для качественной реализации, в рабочей сборке ядра для скачивания в настройках, для подхвата разговора в офлайне, а что еще более важно - возможности пользователей кодером локально на устройстве, голосовыми функциями, вести адекватный диалог, возможно даже исследования. Может быть отдельным файлом на устройстве, которое присоединяется, как библиотека и легко переключается на сервер и обратно.  Так же напоминаю - всегда самое первое, что ты делаешь - это фиксируешь мой промпт, а так же вносишь мои задания, новые детали и правки сразу в документы. Факт того, что это твое первое действие тоже можешь отметить в now. Напоминаю, - now - главные ориентир для тебя при первом запросе, он должен быть быстрым и понятным. После того, как внесешь все необходимое - изучай мои последние промпты, задания, приоритеты и продолжай работу, первым шагом довести до ума агентскую структуру.
-Настройки памяти - привести в порядок, убрать кучу текста, сделать последовательно, как в меню - общая память, личная память - с выдвигающимися сохраненными воспоминаниями, как в меню выдвигаются чаты и проекты условно. -Мобильное оформление и эргономику продумать очень тщательно. Возможно это уже есть в пунктах на будущее и мы до этого не дошли, но я повторюсь. Кнопки все должны нажиматься правильно, в том числе функции голоса справа от ввода промпта.
-при выборе чего-то или вводе текста - туда идет зум страницы, это нужно убрать, если возможно, сделать странице стабильнее. 
- в целом, списать откуда-нибудь концепцию кнопок, управления, эргономики, меню, окон, расстояний, обозначений, стиля в целом, чтобы не возиться с этим долго. Важно смотреть на гениальные реализации за последние пол года, много чего есть в списке нашем внешних источников ю
- чаты, проекты - все это огромное на телефоне, нужно сделать очень минималисичным, тонким, различимым, стабильным.
- важно очень продумать логичность управления, иерархию. То бишь - если заголовок выше по «структуре» управления, то его текст должен быть больше, как заголовок-кнопка проекты - долго быть написано крупно и заглавными, заполняя кнопку, как и заголовок-кнопка чаты, а вот сами выжаигающиеся проекты и чаты - должны быть тоньше кнопки и меньше текст, так же и с логикой подсвечиваний и логичной иерархии цветов
- в настройках проекта должно быть окно, вызывающееся кнопкой ИСТОЧНИКИ, где должна быть возможность добавить источники любого формата в проект (подразумевая, что у нас уже есть в аЛанди инструментарий, чтобы считать, запарсить, конвертировать, переформатировать любого формата файл)
- без проекта надпись - ну уж слишком большая. Она должна быть совсем плоская где-то прилепленеая написанная внутри цветной полоски, как индикатор статуса, загорающийся на фоне контрастного цвета и гаснущий, при необходимой логике поведения. 
- при нажатии на проект - в разделе чаты должны быть только чаты проекта и кнопка назад, ну и создать чат внутри проекта там же, где просто создать чат  
- сами по себе создать чат и создать проект тоже толжны быть тоньше и меньше, приплюснутые буквально к низу заголовка-кнопки, как в чатах, так и а проектах.
- продумать логику памяти в целом, она пока не ясна по настройкам
- полагаю, что минимальный озвучиватель текста, не очень стыдный - можно внедрить прямо в сайт, не требую подключения своего облака, но возможно он может входить в ядро оффлайн пэка… кстати, отличная идея, если это просто в воплощении - предоставить выбор перед скачиванием, в виде списка с квадратиками с галочкам и крестиками, как да и нет)’
- Навигация: работает ли меню на мобильных, есть ли хлебные крошки, не ведут ли ссылки в никуда.
Адаптивность: нет ли горизонтальной прокрутки, не ломается ли сетка на маленьких экранах.
Доступность: контрастность текста, альтернативный текст у изображений, управление с клавиатуры (фокус), aria-атрибуты.
Формы и ввод: есть ли валидация, обработка ошибок, подтверждение отправки.
Публикация контента: корректно ли отображаются посты/страницы, есть ли пагинация, поиск, даты, категории.
Техническая часть GitHub Pages: правильно ли настроен baseurl, не битые ли ссылки на CSS/JS, есть ли кастомная страница 404.
- название открытого чата из шапки опустить в виде прикрепленного к низу шапки прямоугольника, длинного достаточно, чтобы вместить длинное название. Если чат в проекте, над ним появляется блок с названием проекта и замочком, меняется цвет, можно и анимацию добавить а стиле нашего сайта. 
- дублированные функции, вроде включить режим тщательно - не должны быть внутри меню глубокого исследования. Там должны быть разные способы, которыми человечество научилось пользоваться за последний год,’ порой гениальнее решения и программные локомотивы 🙏🏻
- в первую очередь - не забудь, все далокументируй, каждый пункт внеси, потом только начинай работу. Завершение с плагинами, потом доведение до идеала агентские, мудьтиагентские, субагентские, кодингом
```

### OR-2026-11-16-011 — Owner continuation: finish Landing 2.0 in large verified slices; live AgentRun status and coherent indicators

```text
Продолжаем реализацию, упор на финализацию, идем по всем моим требованиям, заданиям, принципам и деталям в ускоренном темпе, по много действий за запрос и большими шагами, не забывай использовать !!!плагины, а так же список внешних источников вольготно разработке каждого компонента в частности, для приобретения наилучших техник, пользуясь чужим опытом, чтобы не проходить такой же долгий путь. В репозиторий уже скачаны разные модели, попутно выстраиваем вокруг них рабочую структуру функциональность, взаимодействий, целостной системы и максимальной потенциальной полезностью действий в предоставленных технических условиях. Для общих принципов конструкций, тоже смотрим примеры внешних источников, я предоставлял очень подходящие. Маленькие дополнение - у агентов должно быть вплывающее сворачивающееся окно статуса во время работы, чтобы было видно из действия, статус текстом, актуально, в прямом эфире. И в целом, продумать индикаторы, статусы. Подсвечивания, мини электрические бегающие огоньки, полосочки анимации, видимость текста при смене оформлений. Удачи, бро 🙏🏻 @
```


### OR-2026-11-16-012 — Owner approval and expansion: configurable agent ecosystem, local/offline capabilities and translation

```text
Да, подтверждаю. И продолжаем дальше по-крупному бро. В начале продолжения работы подтверди мне, что все мои последние задания и комментарии учтены и в очереди на реализацию, вроде оффлайн ядра-пакета или работы с локальными файлами, встроенного переводчика и предустановленной грамматики. Двигаемся по-крупному, параллель работу с плагинами, не забывай н различных этапах улучшени ф обращаться ко внешним источникам из моего списка, а так же отмечать свой каждый шаг, чтобы сориентироваться от любой точки, в случая обрывов связи или подобных сбоев🙏🏻 агенты. скаченные мини модели - могут быть не один и не два, а больше для вариативности, с очень правильным распределением функций и вариативностью настраиваемости. В таких меню, как агенты, исследования, навыки - должны быть несколько инструментов/вариантов на выбор, красиво эргономично рассортированы, например агентов - и возможность просто настроить и включить возможность из вызова в чате при обсуждении/исследованиях, возможность собрать полностью своего агента, возможность запускать готовые сценарии, возможность выбрать разное количество, разные виды или даже модели, возможность запускать чат с диалогом 2 агентов и моим «дирижированием» прям в чате, возможность запускать «рой агентов» или моделировать тысячи супер-маленьких агентов для сбора статистики или проверки социальных явлений (не обязательно, как вариант), возможность настроить агенту роль, самообучаемость, профессии, знания, навыки, указать инструкции, добавить источники определенных форматов, дать характер - для поселения в библиотеку агентов, и чат или проект, важно очень продумать им супер-инструментарий, дать « руки »  а браузерах, доступ в интернет, к базам данных, инструментам типа конвертеров, парсеров, большинства, что есть у нас в обойме; можно еще агента, который обучается с нуля в каком-нибудь проекте; функции самообучаемости для них - можно взять из гениальных реализаций источников, что я давал. У агентов должно быть всплывающее окно статуса, показывающее прогресс и прошлые, нынешние в прямом эфире и будущие действия, не перегруженно, продуманно системно красиво. То же самое (про наполненность каждого отдельного меню функций) с меню исследований и навыков. Смотри на разработку целостно, можно системно реализовать вещи, близкие друг к другу, чтобы не метаться туда-сюда по коду, а сделать свою работу эффективнее и полезнее в плане коэффициента действий.  Напомню - в первую очередь, как всегда -  отмечай все в документ, вноси что нужно а детализации списков, оперативно, не тратя на это много шагов, и продолжай реализацию мощными прыжками, не теряя глубины реализации Index.md и подобные файлы - скорее всего нуждаются в сокращении (но аккуратном, без потер, с проверкой отсылок и взаимосвязей), а так же в целом, можно поудалять рудименты, позасовывать неиспользуемые документы из мейн в другое место, чтобы их не читать постоянно и тем более случайно не считывать, как актуальные. Напомню в первую очередь все документируй, но супер-оперативно и главное - основная цель - поскорее финализиповать работающий лендинг со всеми моими нововведениями. Гооооо 🙏🏻🙏🏻🙏🏻
```


### OR-2026-11-16-013 — Owner continuation: resume with Search and GitHub

```text
Продолжим 🙏🏻 @Поиск @GitHub
```


### OR-2026-11-17-001 — Owner continuation: prioritize verified Landing 2.0 completion and preserve full scope

```text
Now.md, активно финализируем лендинг, выполняем список всех детальных задач, данных мной.  Как только сориентируешься (быстро) - активно реализуем лендинг дальше, изучаем внешние источники попутно и настраиваем целостность На всякий, наши последние сообщения:
Да, подтверждаю. И продолжаем дальше по-крупному бро. В начале продолжения работы подтверди мне, что все мои последние задания и комментарии учтены и в очереди на реализацию, вроде оффлайн ядра-пакета или работы с локальными файлами, встроенного переводчика и предустановленной грамматики. Двигаемся по-крупному, параллель работу с плагинами, не забывай н различных этапах улучшени ф обращаться ко внешним источникам из моего списка, а так же отмечать свой каждый шаг, чтобы сориентироваться от любой точки, в случая обрывов связи или подобных сбоев🙏🏻 агенты. скаченные мини модели - могут быть не один и не два, а больше для вариативности, с очень правильным распределением функций и вариативностью настраиваемости. В таких меню, как агенты, исследования, навыки - должны быть несколько инструментов/вариантов на выбор, красиво эргономично рассортированы, например агентов - и возможность просто настроить и включить возможность из вызова в чате при обсуждении/исследованиях, возможность собрать полностью своего агента, возможность запускать готовые сценарии, возможность выбрать разное количество, разные виды или даже модели, возможность запускать чат с диалогом 2 агентов и моим «дирижированием» прям в чате, возможность запускать «рой агентов» или моделировать тысячи супер-маленьких агентов для сбора статистики или проверки социальных явлений (не обязательно, как вариант), возможность настроить агенту роль, самообучаемость, профессии, знания, навыки, указать инструкции, добавить источники определенных форматов, дать характер - для поселения в библиотеку агентов, и чат или проект, важно очень продумать им супер-инструментарий, дать « руки »  а браузерах, доступ в интернет, к базам данных, инструментам типа конвертеров, парсеров, большинства, что есть у нас в обойме; можно еще агента, который обучается с нуля в каком-нибудь проекте; функции самообучаемости для них - можно взять из гениальных реализаций источников, что я давал. У агентов должно быть всплывающее окно статуса, показывающее прогресс и прошлые, нынешние в прямом эфире и будущие действия, не перегруженно, продуманно системно красиво. То же самое (про наполненность каждого отдельного меню функций) с меню исследований и навыков. Смотри на разработку целостно, можно системно реализовать вещи, близкие друг к другу, чтобы не метаться туда-сюда по коду, а сделать свою работу эффективнее и полезнее в плане коэффициента действий.  Напомню - в первую очередь, как всегда -  отмечай все в документ, вноси что нужно а детализации списков, оперативно, не тратя на это много шагов, и продолжай реализацию мощными прыжками, не теряя глубины реализации. Index.md и подобные файлы - скорее всего нуждаются в сокращении (но аккуратном, без потер, с проверкой отсылок и взаимосвязей), а так же в целом, можно поудалять рудименты, позасовывать неиспользуемые документы из мейн в другое место, чтобы их не читать постоянно и тем более случайно не считывать, как актуальные. Напомню в первую очередь все документируй, но супер-оперативно и главное - основная цель - поскорее финализиповать работающий лендинг со всеми моими нововведениями. Гооооо 🙏🏻🙏🏻🙏🏻


VERIFIED — checkpoint восстановлен
Исправление завершено. На точном HEAD 8d102f0b52c70d386d00090e4f2cd7469ec92d3b успешно прошли все основные группы:
* Quality — 7/7, включая Chromium и опубликованный release contract.
* Freshness / контроль очереди — успешно.
* Provenance — успешно.
* GitHub Pages — deployment и точное соответствие опубликованной версии проверены.
Причина предыдущего сбоя была только в сокращённом SHA в журнале. Исправление не затрагивало продуктовый код.

Продолжаем, бро 🙏🏻
FACT Продолжение зафиксировано в GitHub.
* OR-2026-11-16-013 — твой последний короткий запрос сохранён дословно в NOW.md.
* Текущая ветка — main, открытых PR нет, активная задача — #111.
* Контрольный коммит: 7067e562b4fab97ba081776106b2f42eed375050.
* Подтверждена следующая последовательность: AgentRun → контекст чата и источники → единый статус выполнения → Deep Research.
FACT Важное различие: тесты нового контекстного контракта уже добавлены, но самого модуля пока нет. Это намеренная стадия RED, а не готовая функция.
Gateway — VERIFIED
IMPLEMENTED Первый крупный срез уже в main:
* Создан строгий контракт контекста context.py.
* История диалога и выбранные фрагменты источников передаются AgentRun явно.
* Контекст хранится в существующем зашифрованном Fernet-хранилище.
* Повторный запрос с тем же ключом и изменённым содержимым отклоняется, а не запускает незаметно другую задачу.
* Неизвестные поля, неподдерживаемые роли, повторяющиеся ID и превышение лимитов блокируются.
VERIFIED Gateway: все три матрицы Python 3.12, 3.13 и 3.14 прошли успешно на кодовом коммите 1816fa821d7122c069ae4791cc2400a9cb2b1738.
VERIFIED Безопасность и контракт:
* OWASP-проверки безопасности — PASS.
* Контекстные ограничения — PASS.
* HTML/JavaScript Integrity — PASS.
* Gateway после исправления Ruff — PASS на трёх версиях Python.
* Graphify — выполняется.
* GitHub Pages — сборка и публикация успешны на предыдущем контрольном коммите; новая сборка проверяется.
Обнаруженные две ошибки Ruff были только нарушениями оформления Python-кода. Обе исправлены; проверки не ослаблялись.
 @TinyFish @Twilio Developer Kit @Exa @Code @Coder @Context.dev @Hostinger Connector @Floot @Firecrawl @Base44 @Railway @Render goooo
```



### OR-2026-11-17-002 — Long-running multi-step continuation and landing finalization

```text
Бро, продолжаем длинной работой по много шагов, не забываем внешние источники, цель финализации лендинга, доведенная до идеала 🙏🏻
```


### OR-2026-11-17-003 — Architecture 2.0 review and free-first launch proposals

````text
# Ревизия архитектуры 2.0: комментарии и улучшения для бесплатного старта

Версии и модели вроде Qwen3.5, Bonsai 2, whisper.cpp 1.9.5 и Piper 1.8.0 я не проверял, потому что они новее моих данных. Перед внедрением сверьте их по репозиториям. Ссылки ведут на официальные репозитории и документацию.

## Главное

1. **GitHub Pages конфликтует с «Same-Origin Studio».** Pages не умеет проксировать \`/api\` и задавать заголовки COOP/COEP. Из-за этого вы получите CORS и не сможете включить SharedArrayBuffer для WASM-потоков.
2. **План слишком широкий для бесплатных ресурсов.** Из 18 разделов реализованы единицы. Сначала нужен вертикальный срез: чат → RAG → голос.
3. **Часть компонентов дублируется или лишняя:**
   - Qwen3-ASR и Whisper;
   - Provider Registry и Model Registry;
   - Cache API и Service Worker;
   - Worker Leases и Fencing при одном узле.
4. **FTS5 по умолчанию не работает с тайским и плохо работает с русским.** Это критично для RU/EN/TH.
5. **Самый дешёвый «сервер» для вас — браузер пользователя.** Он может выполнять WebLLM, ASR, Pyodide и перевод.

## Ресурсный ориентир

Лучший бесплатный VPS для CPU-инференса — Oracle Cloud Always Free ARM (до 4 OCPU и 24 ГБ). Есть риски: бывает нехватка свободной ёмкости, а простаивающие инстансы могут быть изъяты. Если VPS не получится, архитектура должна работать на Cloudflare Pages и Workers плюс бесплатные API. Поэтому роутер нужно строить вокруг OpenAI-совместимого протокола (см. п. 2).

## 1. Infrastructure

**GitHub Pages + Jekyll → Cloudflare Pages + Vite.**
- Cloudflare Pages бесплатный, поддерживает \`_headers\` и \`_redirects\`, делает preview на каждый PR.
- \`/api/*\` можно направить на тот же домен через Tunnel, и CORS исчезнет.
- Jekyll плохо подходит для модульного JS и дизайн-токенов. Vite даёт code splitting «из коробки».

\`\`\`
# public/_headers
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
\`\`\`

\`\`\`yaml
# /etc/cloudflared/config.yml
ingress:
  - hostname: app.example.com
    path: ^/api/.*
    service: http://127.0.0.1:8000
  - service: http_status:404
\`\`\`

GitHub остаётся Source of Truth, а Actions остаются для CI. Docs: [Pages](https://developers.cloudflare.com/pages/), [Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/).

**uv + systemd.** Хорошо. Добавьте \`uv sync --frozen\`, unix-сокет вместо TCP и секреты через systemd credentials, а не отдельный сервис:

\`\`\`ini
[Service]
ExecStart=/opt/app/.venv/bin/uvicorn app.main:app --uds /run/app/api.sock --workers 1
LoadCredential=groq_key:/etc/app/creds/groq_key
NoNewPrivileges=yes
ProtectSystem=strict
ReadWritePaths=/var/lib/app
MemoryMax=1G
\`\`\`

В коде секрет читается из \`$CREDENTIALS_DIRECTORY/groq_key\`. Раздел «Secrets Management» тогда закрывается этим файлом.

## 2. Backend / API

**aServi → тонкий роутер поверх OpenAI-совместимого протокола.** llama.cpp, Ollama, Groq, OpenRouter и Gemini выставляют \`/v1/chat/completions\`. Свой протокол не нужен. LiteLLM слишком тяжёл по памяти для бесплатного узла, поэтому пишите свой слой на 50 строк, с fallback по уровням (tier): браузер → локальный → бесплатный облачный.

\`\`\`python
import asyncio, os
from openai import AsyncOpenAI
from fastapi import HTTPException

TIERS = [
  ("local", AsyncOpenAI(base_url="http://127.0.0.1:8081/v1", api_key="x"), "qwen"),
  ("groq",  AsyncOpenAI(base_url="https://api.groq.com/openai/v1",
                        api_key=os.environ["GROQ_KEY"]), "llama-3.3-70b-versatile"),
]

async def chat_stream(messages, **kw):
    for name, client, model in TIERS:
        try:
            return await asyncio.wait_for(
                client.chat.completions.create(model=model, messages=messages,
                                               stream=True, **kw), 20)
        except Exception as e:
            log.warning("tier_failed", tier=name, err=str(e))
    raise HTTPException(503, "all tiers failed")
\`\`\`

Названия моделей и лимиты бесплатных тарифов меняются, проверяйте актуальные.

**Auth.** Вместо своего Bearer/CORS поставьте перед туннелем Cloudflare Access (бесплатно до 50 пользователей). В FastAPI проверяйте заголовок \`Cf-Access-Jwt-Assertion\`.

**Rate limiting.** Используйте бесплатное правило на уровне Cloudflare WAF, а внутри — [slowapi](https://github.com/laurentS/slowapi). SSE: [sse-starlette](https://github.com/sysid/sse-starlette).

## 3. Frontend

Модульность и design tokens делайте через Vite и CSS-переменные. Дополнительный «Lazy Loading / Code Splitting» отдельным пунктом не нужен, это динамический \`import()\`.

\`\`\`js
const studio = await import(\`./studios/\${name}.js\`); // отдельный чанк
\`\`\`

**Cache API → vite-plugin-pwa (Workbox).** Он решает и кеш, и оффлайн (раздел 16).

## 4. Model Runtime

**Ollama → llama.cpp \`llama-server\`.** Для продакшена на 4 ядрах это лучше, потому что один рантайм закрывает чат, embeddings и reranking. Есть prompt cache и слоты, память контролируется жёстко.

\`\`\`ini
ExecStart=/opt/llama/llama-server -m /models/chat-q4_k_m.gguf \\
  --host 127.0.0.1 --port 8081 -c 8192 -t 4 -np 2 --cache-reuse 256 --jinja
MemoryMax=6G
\`\`\`

Для embeddings запустите второй экземпляр с \`--embeddings --pooling last\` на порту 8082. Ollama оставьте для локальной разработки. Репозиторий: [llama.cpp](https://github.com/ggml-org/llama.cpp).

**Reranker 0.6B на CPU** добавляет задержку, а выигрыш на старте мал. Начните с RRF-слияния (п. 11) и подключайте reranker только если метрики покажут провал.

**Model Registry.** Достаточно \`models.toml\` в репозитории, а не отдельного сервиса.

## 5. Chat & Context Engine

Provider Registry (✓) и Model Registry (○) лучше слить в один реестр. Context Manager для малых моделей строится по бюджету токенов:

\`\`\`python
def build_context(system, pinned, history, retrieved, budget=6000):
    used = count(system) + count(pinned)
    out = []
    for blk in [*retrieved, *reversed(history)]:   # свежее и релевантное вперёд
        if used + (n := count(blk)) > budget: break
        out.append(blk); used += n
    return [system, *pinned, *reversed(out)]
\`\`\`

Считайте токены через \`/tokenize\` у llama-server, а не оценкой по символам.

## 6. Memory & Storage

**Delta Sync.** Не нужны CRDT и cr-sqlite. Хватит last-write-wins с гибридными часами:

\`\`\`sql
-- у каждой синхронизируемой таблицы: id TEXT PK (uuid7), updated_at INTEGER, deleted INTEGER
SELECT * FROM messages WHERE updated_at > :cursor ORDER BY updated_at LIMIT 500;

INSERT INTO messages(id, body, updated_at, deleted) VALUES (?,?,?,?)
ON CONFLICT(id) DO UPDATE SET body=excluded.body, updated_at=excluded.updated_at,
  deleted=excluded.deleted
WHERE excluded.updated_at > messages.updated_at;
\`\`\`

**Серверный SQLite.** Включите \`PRAGMA journal_mode=WAL; synchronous=NORMAL; busy_timeout=5000;\` и держите одну точку записи.

**Клиент.** Официальный [sqlite-wasm](https://sqlite.org/wasm) на OPFS даёт ту же схему, что и на сервере. IndexedDB остаётся для мелочей. Это упрощает «Global / Personal / Project Memory» до одной модели данных.

## 7. Agent Runtime

Worker Leases, Fencing и Idempotency нужны для кластера. При одном узле и SQLite хватит атомарного захвата задачи и уникального ключа идемпотентности:

\`\`\`sql
UPDATE jobs SET status='running', lease_until=unixepoch()+60, attempt=attempt+1
WHERE id=(SELECT id FROM jobs WHERE status='queued' ORDER BY priority, id LIMIT 1)
RETURNING *;
-- jobs.idem_key TEXT UNIQUE; reaper: status='queued' WHERE status='running' AND lease_until<unixepoch()
\`\`\`

Для DAG посмотрите [pydantic-graph / Pydantic AI](https://ai.pydantic.dev/) или LangGraph с SQLite-чекпойнтером, чтобы не писать оркестратор с нуля.

**Team / Agent Dialogue.** Цепочки агентов на 2–4B моделях часто ухудшают качество, потому что ошибки накапливаются. Отложите их, пока Direct и Specialist не пройдут evals.

## 8. Tools & Sandbox

**Capability Registry / Tool Contracts → MCP.** Формат уже стандартизован: JSON Schema на вход и выход, плюс готовые серверы. Python SDK: [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk), описание: [modelcontextprotocol.io](https://modelcontextprotocol.io).

**Sandbox.** Лучше всего для бесплатного старта — выполнять код в браузере через [Pyodide](https://pyodide.org) в Web Worker. Нагрузка уходит на клиента, а сервер не подвергается риску. Для серверного исполнения используйте [bubblewrap](https://github.com/containers/bubblewrap) и лимиты systemd, а не OpenShell/seccomp/Landlock «с нуля»:

\`\`\`bash
systemd-run --user --scope -p MemoryMax=512M -p CPUQuota=100% -p TasksMax=64 -- \\
bwrap --unshare-all --die-with-parent --ro-bind /usr /usr --symlink usr/bin /bin \\
  --symlink usr/lib /lib --proc /proc --dev /dev --tmpfs /tmp \\
  --bind "$WORK" /work --chdir /work -- timeout 10 python3 main.py
\`\`\`

Учтите, что Ubuntu 24.04 по умолчанию ограничивает unprivileged user namespaces через AppArmor. Для bwrap нужен отдельный профиль.

## 9. Skills

Формат \`SKILL.md\` — правильный выбор: [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview). Для малого контекста критична прогрессивная загрузка. В промпт кладутся только \`name\` и \`description\`, а тело навыка подгружается при выборе. Skill Factory, Tests и Evals пока не нужны. Начните с реестра из папки и git-версий. Diff и Rollback тогда обеспечит сам git.

## 10. Deep Research

- **Поиск.** Самоподнимаемый SearXNG тяжёл. Берите бесплатные тарифы поисковых API (Brave, Tavily, Exa), условия смотрите актуальные.
- **Извлечение.** [trafilatura](https://github.com/adbar/trafilatura) для чистого текста.
- **Claim Verification** через 4B-модель ненадёжна. Citation Validation делайте детерминированно: сохраняйте цитату и проверяйте, что она реально есть в источнике.

\`\`\`python
norm = lambda s: " ".join(s.split()).casefold()
def quote_ok(quote: str, source_text: str) -> bool:
    return norm(quote) in norm(source_text)
\`\`\`

Модель пусть только предлагает цитаты, а подтверждает их код.

## 11. RAG

**FTS5 для RU/EN/TH.** Токенайзер \`unicode61\` не режет тайский на слова. Для русского \`porter\` не подходит, он только английский. Самый простой рабочий вариант — \`trigram\`:

\`\`\`sql
CREATE VIRTUAL TABLE chunks_fts USING fts5(text, content='chunks', content_rowid='id',
                                           tokenize='trigram');
\`\`\`

Минус: запрос должен быть не короче 3 символов. Альтернатива — предварительная сегментация [PyThaiNLP](https://github.com/PyThaiNLP/pythainlp) и стемминг PyStemmer для русского.

**Векторы без отдельной БД — [sqlite-vec](https://github.com/asg017/sqlite-vec).** Qwen3-Embedding умеет усечение размерности (MRL), поэтому храните 256 измерений вместо 1024: это в 4 раза дешевле по месту и поиску. Гибридный поиск через RRF одним запросом:

\`\`\`sql
CREATE VIRTUAL TABLE chunks_vec USING vec0(id INTEGER PRIMARY KEY, emb float[256]);

WITH f AS (SELECT rowid AS id, row_number() OVER (ORDER BY rank) AS r
           FROM chunks_fts WHERE chunks_fts MATCH :q LIMIT 30),
     v AS (SELECT id, row_number() OVER (ORDER BY distance) AS r
           FROM chunks_vec WHERE emb MATCH :qvec AND k = 30)
SELECT id, SUM(1.0/(60+r)) AS s FROM (SELECT * FROM f UNION ALL SELECT * FROM v)
GROUP BY id ORDER BY s DESC LIMIT 8;
\`\`\`

Если 0.6B-эмбеддер окажется медленным на CPU, возьмите \`multilingual-e5-small\` (мультиязычный, намного легче). Для RAG Evaluation достаточно своего скрипта Recall@5 и MRR на 50 размеченных вопросах, фреймворки не нужны.

## 12. Connectors

Для OAuth/PKCE используйте [Authlib](https://docs.authlib.org). Токены шифруйте через \`cryptography.Fernet\`, ключ берите из systemd credential. GitHub Connector лучше делать как GitHub App или fine-grained PAT с минимальными правами. Отдельный «Audit / Revoke» сводится к таблице \`audit_log\` и кнопке удаления токена.

## 13. Document Processing

**Набор парсеров → [markitdown](https://github.com/microsoft/markitdown).** Одна библиотека переводит PDF, DOCX, XLSX, PPTX, HTML, CSV, JSON и EPUB в Markdown. Docling и всё, что тянет PyTorch, на бесплатном узле будет слишком тяжёлым. \`pymupdf4llm\` быстрый, но у PyMuPDF лицензия AGPL, проверьте совместимость.

**OCR.** Начните с Tesseract (\`rus+eng+tha\`), а VLM-OCR включайте только по запросу. GLM-OCR я не проверял, оцените его по RAM и скорости отдельно.

## 14. Voice & Translation

**ASR.** Дублирование Whisper и Qwen3-ASR уберите, выберите одно. Whisper large-v3-turbo на 4 ARM-ядрах, скорее всего, будет медленнее реального времени. Варианты:
- **В браузере:** [transformers.js](https://github.com/huggingface/transformers.js) с Whisper на WebGPU или WASM. Бесплатно и приватно.
- **На сервере:** [faster-whisper](https://github.com/SYSTRAN/faster-whisper) с \`vad_filter=True\`. Silero VAD уже встроен, отдельный ONNX-пайплайн не нужен.

**TTS.** Piper ([OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl), лицензия GPL) силён для RU и EN. Хороший тайский голос уточните отдельно, я не уверен, что он есть. Как fallback используйте браузерный \`speechSynthesis\`: он бесплатен и обычно поддерживает \`th-TH\`.

**Переводчик.** Не нагружайте 4B LLM обычным переводом. Для этого есть специализированные модели: Opus-MT через [CTranslate2](https://github.com/OpenNMT/CTranslate2), NLLB-200 distilled (поддерживает тайский) или встроенный Translator API в Chrome, если он доступен. LLM оставьте для объяснения грамматики.

**Определение языка не требует модели.** Хватает проверки по алфавиту:

\`\`\`python
def script_lang(s: str) -> str:
    c = {"th": 0, "ru": 0, "en": 0}
    for ch in s:
        o = ord(ch)
        if 0x0E00 <= o <= 0x0E7F: c["th"] += 1
        elif 0x0400 <= o <= 0x04FF: c["ru"] += 1
        elif ch.isascii() and ch.isalpha(): c["en"] += 1
    return max(c, key=c.get)
\`\`\`

## 15. Local AI Coder

Для редактирования файлов используйте формат unified diff или search/replace-блоков и применяйте патч через \`git apply --check\`, а потом \`git apply\`. Rollback тогда равен \`git restore\`. Для Repository Mapping хватит \`tree-sitter\` и списка символов в духе repo-map у Aider. Отдельный «Code Reviewer» на 4B модели малополезен, замените его запуском линтера и тестов.

## 16. Offline / Mini Distribution

Самый дешёвый путь к оффлайну — PWA плюс клиентский инференс: [WebLLM](https://github.com/mlc-ai/web-llm) (WebGPU) или wllama (WASM). Это же становится нулевым уровнем в роутере из п. 2. Нативный Standalone Package откладывайте на потом, а SHA-256-манифест делайте простым JSON-файлом с хешами моделей.

## 17. Performance & Observability

- **L2 SQLite Response Cache** для чата почти не даст попаданий, потому что ответы недетерминированы. Кешируйте только embeddings и детерминированные результаты инструментов.
- **L1 KV Cache** уже даёт llama-server (\`--cache-reuse\`, \`cache_prompt: true\`). Отдельная реализация не нужна.
- **Observability.** OpenTelemetry тяжёл. Хватит \`structlog\`, [asgi-correlation-id](https://github.com/snok/asgi-correlation-id) для Request ID и таблицы \`metrics\` в SQLite с задержкой, числом токенов и ошибкой.

## 18. N₂O Control Plane

Концептуально хорошо. На старте реализуйте минимум: таблицу \`permissions\` (кто, какой инструмент, лимит) и \`budget\` (токены на день). Остальное, включая Decision Registry, можно вести в репозитории как \`docs/decisions/*.md\` (ADR).

## Предлагаемый порядок

1. Cloudflare Pages + Vite, туннель и единый origin (п. 1).
2. Роутер с fallback и llama-server (пп. 2, 4).
3. SQLite WAL, FTS5 trigram и sqlite-vec, гибридный поиск (пп. 6, 11).
4. Голос и перевод в браузере (п. 14).
5. Sandbox и агенты (пп. 7, 8) только после evals на Direct-режиме.

Могу собрать это в один документ с чек-листом или расписать любой пункт в виде готового модуля с тестами.
````





### OR-2026-11-17-004 — Route architecture review into existing Landing 2.0 tasks; prioritize finalization

```text
А ты можешь просто это распределить и  прилепить к ближайшим задачам в уже существующем списке, чтобы мы продолжали заниматься лендингом? Я хочу поскорее его финализировать, там не так много частей, на самом деле, мы долго слишком мялись с ориентирами. Продолжай работу, пожалуйста, и фиксируй каждый шаг, потому что буквально каждый чат с тобой зависает. Давай большими темпами и обьемами гогого
```

## JOURNAL — latest first
- [2026-11-16] S-068 | OWNER PROMPT ARCHIVED / CONTINUATION ROUTED | Parent main `d8d538df3e2c2310ff68df1876b5a808d25c7c57`; live queue: 0 open PRs, issue #111. Owner message archived verbatim as OR-2026-11-16-013. The parent contains new RED tests at `gateway/tests/test_agent_run_context.py`; implementation module `gateway/agent_runtime/context.py` is intentionally absent. This five-file state refresh records the prompt and exact checkpoint before further work. No product runtime, model, dependency, connector, host or deployment changed. | Documentation checkpoint only; exact-child CI pending. | Run Exa research on bounded context/provenance/injection/idempotency patterns, then implement the strict packet module and worker/API wiring under TDD.


## JOURNAL — latest first
- [2026-11-16] S-069 | IMPLEMENTED / EXACT-HEAD VERIFICATION PENDING | Parent main `8ee3df6022f95dfc907499b7fa152684092f702f`; implementation `1816fa821d7122c069ae4791cc2400a9cb2b1738`; source-research docs `8ee3df6022f95dfc907499b7fa152684092f702f`. Added `gateway/agent_runtime/context.py`; extended worker/API context packet handoff, encrypted payload, combined prompt bounds and request fingerprint; added worker/API regression tests; documented OWASP, OpenAI SDK, AG-UI, IETF idempotency and Pydantic/FastAPI findings in INTEL.md and TECHNIQUE_REGISTER_RU.md. Exact commands not run locally because no repository checkout is mounted; GitHub exact-head CI is the verification path. | Explicit selected text only; no auto-transcript/project ingestion, tools, filesystem or network; AgentRun remains feature-off. | Verify all exact-child gates and focused Gateway tests; then wire main chat and status overlay.


## JOURNAL — latest first
- [2026-11-17] S-072 | OWNER REQUEST OR-2026-11-17-001 ARCHIVED / ROUTING CONFIRMED | Parent main `e178bf1a1ad78326b4886a802e8e0e7bccd33296`; live queue at orientation: 0 open PRs, issue #111. Archived the complete owner continuation verbatim. It reaffirms the already binding K.5/K.6.14–K.6.18 requirements (offline/local Workspace, translator/grammar, Agent Library, multi-model/team/simulation, live status, Skills/Research catalogs, plugin/upstream research and lossless docs cleanup); no duplicate backlog or new capability claims. | Documentation checkpoint only; no product code, runtime, dependencies, models, permissions or external services changed. Exact-child checks pending. | Continue approved Plan 1 Task 2 under TDD: main-chat AgentRun routing with explicit bounded context; then shared chat status overlay. Keep Direct default, feature flag off, and Plan 2 Deep Research separation next.

- [2026-11-16] S-070 | IMPLEMENTED / PARTIAL CI VERIFIED | Parent main `f3608cd3253eeb5fb04a9960a620e3c0985956ba`; context transport code introduced in `1816fa821d7122c069ae4791cc2400a9cb2b1738`, Ruff cleanup `edbbac8c352527897f8d17bdc8605a1a82ac602a` and final style correction `f3608cd3253eeb5fb04a9960a620e3c0985956ba`. Gateway #43914028219 PASS across Python 3.12/13/14; Graphify #43914028152 PASS; Pages #43914027020 SUCCESS. Quality #43914028299: Security, Jekyll, Ruff, Integrity and Context PASS; Chromium still IN_PROGRESS. First Quality attempt #43913239978 found E701 layout violations only; corrected without weakening checks. | No local test command: repository checkout is not mounted. Freshness/Provenance not triggered by code-only commits; this state refresh triggers them. | Verify exact-child CI, then continue Plan 1 Task 2/3: main chat routing/context and chat-anchored live status.


## JOURNAL — latest first
- [2026-11-16] S-071 | FRESHNESS CHECKPOINT REPAIR | Parent main `f19f57d1b3fcb190a417226a23a2162b00a3f5e6`; Freshness #43914831126 failed because snapshot main SHA and last_functional_checkpoint_sha were both `f3608cd3253eeb5fb04a9960a620e3c0985956ba`, while this is a documentation-only checkpoint. All 21 freshness checker unit tests passed; the live check requires documentation-only main to differ from the last functional code SHA. Correct last functional SHA to `1816fa821d7122c069ae4791cc2400a9cb2b1738` and keep current parent as `f19f57d1b3fcb190a417226a23a2162b00a3f5e6`. No product code changed. | Root cause is checkpoint metadata, not application behavior. | Re-run exact-child Freshness/Provenance/Quality/Pages; do not alter functional code or weaken the gate.

- [2026-11-17] S-073 | OWNER REQUEST OR-2026-11-17-002 ARCHIVED / WORKSTREAM ROUTED | Parent main `b1e0565908295fd11945107f701081065b1acc98`; 0 open PRs; open issues #111 and #186 (#186 is a bot-created GitHub Skills Pages exercise, outside aLandi scope). Archived the latest owner message verbatim. Reaffirmed long-running multi-step work, external-source review and the single priority of completing the existing LANDING-V2-2026-001 programme; no parallel backlog created. Plan 2 source and E2E diagnostics were inspected: Quality #43938748351 FAILED (123/139 Chromium passed; 16 failed); static/Ruff, security, integrity, context and Jekyll passed; Pages #43938748771 and Graphify #43938748449 succeeded on exact parent. W3C WCAG 2.2/WAI-ARIA APG, Apple HIG/WWDC navigation, Material 3 adaptive navigation and web.dev Core Web Vitals/responsive design were consulted. | Documentation intake only; no product code changed. Exact parent tests are not green. | Repair missing AgentRun fetch/error helpers, profile-import method migration and stale Research E2E selectors/copy; preserve all security and workflow assertions.

- [2026-11-17] S-074 | OWNER REQUEST OR-2026-11-17-003 ARCHIVED | Parent main `b7b72dfa3f6b6dfd950e70e986e96d0a46fd4e4a`; live queue: 0 open PRs, issue #111 plus unrelated bot exercise #186. Archived the complete architecture 2.0 review verbatim before implementation. The review is treated as candidate guidance; no architecture claim, model/version, dependency, host, provider or migration accepted from the supplied text without source/compatibility/evaluation checks. Current exact-HEAD Quality #43968006783: 138/139 Chromium passed; one failing Functions-panel E2E attempts to click a close control after the panel was already closed by opening Search settings. Static/Ruff, Security, Integrity, Context, Jekyll and Pages passed; Graphify passed; published release-contract job skipped. | Documentation intake only; no product code changed. | Fix the deterministic stale E2E sequence without weakening assertions; rerun exact-head Quality and record the result.

- [2026-11-17] S-075 | PLAN 2 VERIFIED / ARCHITECTURE REVIEW SOURCE-TRIAGED | Parent main `6117ceb6d3360bc0b47ef3179d73536f854cebf4`; 0 open PRs; issues #111 and #186 (#186 is an unrelated bot-created GitHub Skills Pages exercise). OR-003 was archived verbatim before implementation. Fixed the Functions-panel E2E sequence in `tests/e2e/app.spec.mjs`: Search settings closes Research; the scenario now reopens Research before clicking its close control and retains visible/hidden/focus-return assertions. Exact Quality #43970945532 PASS 7/7, including 139 built-app Chromium tests and 1 published-site smoke; Pages #43970944970 SUCCESS; Graphify #43970945690 PASS. Fresh uncached public root HTTP 200 returned exact `alandi-build-revision=6117ceb6d3360bc0b47ef3179d73536f854cebf4`. Gateway was not rerun because no Gateway/backend file changed; latest Gateway #43932615910 remains the previous backend gate. Source research recorded in INTEL.md: Cloudflare Pages static-header/Function and same-site proxy behavior, FTS5 trigram short-query limit, and official upstream/model pages for Qwen3.5-4B, Bonsai 2, whisper.cpp v1.9.5 and Piper v1.8.0. No architecture migration, dependency, model install, host change, credential, permission or runtime activation. | Plan 2 IMPLEMENTED / VERIFIED; AgentRun remains partial and host-feature-off. Freshness/Provenance pending this direct-child documentation refresh. | Next: inspect and repair the existing Direct/search-by-default path as a bounded V1-compatible slice; then continue K.5/K.6.17–K.6.18.

- [2026-11-17] S-076 | PROVENANCE YAML SYNTAX REPAIR / DIRECT STATE REFRESH | Parent main `fa8f0a92cf8b51a68145a9c6dae80735afac9747`; 0 open PRs; issues #111 and #186 (#186 unrelated bot exercise). Previous direct-child refresh Freshness #43973857682 PASS; Provenance #43973857634 FAILED because two lines in `docs/PROJECT_STATE.yaml` ended with an extra semicolon after a closing YAML quote. This refresh removes only those two semicolons; validation gates are unchanged. Plan 2 product/test code remains verified on `6117ceb6d3360bc0b47ef3179d73536f854cebf4` (Quality #43970945532 7/7, 139+1 Chromium; Pages #43970944970; Graphify #43970945690; public root exact). No product code, dependency, model, runtime, host, access or external service changed. | Syntax-only metadata repair; exact-child Provenance/Quality/Freshness/Pages pending. | Verify metadata YAML and exact-child gates, then continue Direct/search default slice.

### OR-2026-11-17-014 — source-first Notebook, Studio, Coder, Offline Core, AI Studio and Skill Factory

```text
Ноутбук - не просто блакнот а место, где я смогу общаться с источником, у этого есть механизмы. Так же там я должен иметь возможность создать подкаст, презентацию, график-слайд и подобные вещи, сугубо из загруженных/указанных источников. Еще кодер должен быть «упакован» по-максимуму скиллами, базами данных, инструментами, способностями и в целом, настроен по лучшим канонам современности. Оффлайн ядро-пакет не забывай, для автономной работы аЛанди без интернета, будучи подключенным к файлу, предлагаемому к скачиванию в настройках аЛанди. Должно быть куда-то определено по смыслу меню, куда будет встроен инструмент создания своего ии, тобишь буквально можно будет запихнуть инфу и превратить в веса для ии, создавать маленькие ии целевого назначения, и все вокруг этого. Так же должен быть инструмент, который превращает любую книгу, да и в целом источник в навык, а то и в агента. Механизмы работы с локальными файлами должны бы и воплощены самые лучшие, оптимизированные и функциональные, которые только можно представить в современности, в частности можно туда подключать инструменты, которые у нас и так будут - вроде того, что превращает веб-страницу или даже картинку в json для ии. Отметь это сразу пожалуйста наверняка в документ все, если это нигде не сформулировано и вытащи на видное место, скоро нужно финализироватт лендинг и это все должно быть готово. Используй все плагины пожалуйста, что я тебе подключил, и используй документ с внешними источниками. Делай рывок уже множественными шагами и объемами работы раз в 5 больше, чем сегодня, за 1 запрос, постарайся образцово-показательно себя проявить. Спасибо заранее 🙏🏻 @Поиск
```


### OR-2026-11-17-016 — accelerated multi-stage implementation and Coder priority

```text
Делай это, и сразу можешь продолжать делать и другие пункты, доводи до идеала, используй подключенные плагины, забирай лучшее из списка внешних источников и подобных мест, не забывай актуализировать документ, но не трать на это времени, практически. Кодер - приоритет гениальной работы, где нужно будет «зарядить» его всем чем только можно, что усилит его, или же ускорит, или сделаем эффективнее, собрав самые гениальные, лучшие эффективные практики, техники, методы, функции, известные людям за последние пол года-год. Все что можно скачать - скачай, кроме большой модели, скачивай Базы данных, апи, всевозможные полезные инструменты, функции, подключения, усиления и тому подобное, даже то, что нужно будет перенести на сервер - можно собирать. Попутно с доработкой пунктов лендинга, встречаясь с разными файлами, системами и участками кода - часто искать более совершенные воплощения, обращаясь ко всем возможным местам, где возможно увидеть примеры или полезные материалы. Работаем большими шагами, пока не сделаем несколько существенных вливанмй - не останавливаемся
```

### OR-2026-11-18-003 — preserve all details, establish a durable plan, use external sources and plugins

```text
Давай, вперед. Не упускай мной данные детали. Только наметь и отметь себе план так, чтобы точно потом не потеряться, и не забывай использовать внешние источники из документа для извлечения лучшего, что упростит нам задачу и сделает продукт совершеннее. Используй плагины, поиск, сравнения, исследования, размышления чтобы быть эффективнее самому и качественнее, но быстро сделать реализацию @Exa @Code @Coder @Context.dev @Cloudflare @Twilio Developer Kit @stark AI Developer @Superpowers @Base44 @Keenable @Hostinger Connector @Hostinger @Hercules @TinyFish @Firecrawl @Context7 @Vercel @Floot @Railway @Render
```

- [2026-11-18] S-130 | PLAN RECORDED / UI-FIRST CONTINUATION | Parent main `841c6318bd0b24b810a35b678978d82a1337e886`. Live main/PR/issue orientation: main unchanged at parent; 0 open PRs; open issues #111 and unrelated #186. Pages #44286558643 SUCCESS on exact parent; Graphify success is on prior code SHA `d9b57cb3a9ceb919211d60e66c9651046611575c`, not this docs-only parent. Read owner source register `INTEL.md`, V1 UI finalization, existing UX backlog, AGENTS and NOW. Retrieved primary W3C WCAG 2.2 and MDN VisualViewport references; Lightpanda official docs fetch returned empty, so its limitations are taken only from the existing INTEL review. Recorded one execution plan in CURRENT; no parallel backlog or product code change. | PLAN RECORDED; no implementation claim. | Next: inspect current root app/test surface against the V1 checklist and select the smallest high-value interaction batch; preserve owner requirements verbatim.

- [2026-11-18] S-131 | IMPLEMENTED / E2E PENDING — ACCESSIBLE PROJECT/CHAT EMPTY STATES | Parent main `9cb1dd78c06e602bed5a4e8f8ca936b14be72fdc`; code commit `ee6295d54216d7d734f4f82295ea6047a4822901`. In `index.md`, replaced CSS-generated chat empty copy with a real `role=status` element using `aria-atomic=true`; project empty state also uses a status role; «Без проекта» now exposes selected scope with synchronized `aria-pressed`. Added a focused Playwright regression that seeds an empty project, selects it, checks the announced empty state, verifies unassigned selection and Back behavior. Updated the existing V1 checklist and UX backlog; no runtime/API/dependency change. External basis: W3C WCAG 2.2 SC 4.1.3 + WAI ARIA22; MDN status role recommends polite status announcements without moving focus. Exact source references: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22.html and https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role. | IMPLEMENTED; Playwright not run (no repository checkout/local browser runner). Pages #44289270720 and Graphify #44289274391 were IN PROGRESS at capture. | Verify exact-head workflows and published root; continue remaining UX-040 long/large-list and scroll/focus review without treating DOM tests as native-device proof.