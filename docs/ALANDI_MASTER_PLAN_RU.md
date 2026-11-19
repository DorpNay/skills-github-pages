# aLandi — единый мастер-план и реестр реализации

**Единственный полный список работ.** Короткий вход — NOW.md. Внешние источники, плагины и инструменты — INTEL.md.
**База консолидации (не текущий HEAD):** 2026-11-18 · DorpNay/skills-github-pages · main 42a63dbd6cea81e97e7a577fce159700186771ac. После этого baseline были созданы последовательные docs commits; следующий SHA всегда проверять live.

> Статусы: SPECIFIED — требование; IMPLEMENTED — артефакт/код присутствует в `main`; PARTIAL — реализована только часть acceptance; VERIFIED — конкретная проверка на указанном SHA/среде; DEFERRED — осознанная отсрочка; RETIRED — отменено владельцем. Старые DONE-галочки находятся только в конце и остаются историческими. Новые задачи закрываются в активной части лишь после коммита в main; VERIFIED дополнительно требует доказательства проверки.

## 0. Исполнительные правила

1. Первый приоритет — корневое веб-приложение на /. Не восстанавливать /landing/: текущий контракт оставляет root app единственной публичной поверхностью.
2. Работать крупными связными пакетами, быстро и без лишних ритуалов ориентирования; внутри — минимальные обратимые изменения.
3. Рабочие документы ровно три: NOW.md, этот мастер-план и INTEL.md. Технические спецификации могут оставаться в docs как источники контракта, но не как конкурирующие списки задач.
4. Никаких фальшивых функций: доступное действие требует реального handler/runtime, разрешения, scope, успеха/ошибки/отмены и честного статуса. Остальное — blueprint/unavailable.
5. Обычный чат — прямой запрос к основной модели без обязательного planner/helper/agent/tool overhead. Quick/Thorough, web breadth/offline, execution topology, task skill, model/provider, memory scope и output format — независимые измерения.
6. Показывать только реальные operational events: этап, модель/агент, tool/source, время, состояние, результат/ошибка/approval/cancel. Не раскрывать hidden chain-of-thought.
7. Роли, skills, загруженные документы и prompt не дают полномочий. Local files, network, shell, repository writes и внешние side effects требуют отдельного scope/approval; arbitrary code execution — только после настоящей sandbox изоляции.
8. Сохранять HTML/CSS/JS + Jekyll/GitHub Pages + существующий FastAPI/Ollama. Новые framework/runtime/dependencies — только при измеримой выгоде, актуальном первоисточнике, проверенных лицензиях и rollback.
9. Не выполнять merge, deploy, force-push, rebase/reset, историю переписывать, удалять пользовательские данные, менять хост/провайдер/секреты или платить без отдельного разрешения. Прямые commits в main разрешены.
10. Work Loop: live orient → inspect minimum surface → acceptance/rollback → implement → focused verification → exact-head/publication checks → update NOW/master/INTEL → concise report.

## 1. Проверенный baseline на момент объединения

- FACT at consolidation start: main HEAD 42a63dbd6cea81e97e7a577fce159700186771ac; open PRs: 0; open issue #111 (owner/live host release gates) and unrelated #186. Docs consolidation advanced main afterward.
- VERIFIED: Graphify run #44297733900 SUCCESS and Pages deploy #44297733956 SUCCESS, both exact HEAD 42a63dbd6cea81e97e7a577fce159700186771ac. Combined status API returned no status records; do not conflate that endpoint with Actions results.
- FACT: latest 15 commits since stale checkpoint 60de827 entered main; include row/menu focus, validation, persistence, i18n and live panel refresh fixes.
- FACT: four Functions panels exist: Agents, Deep Research, Skills, Connectors. Connectors honestly reports unconfigured registry; no live connector is implied.
- FACT: /workspace/ is permissioned browser-local file editing with diff/confirmation/recovery, not AI Coder, shell, test runner, or sandbox.
- FACT: AgentRun is a limited SQLite DAG/prototype with one worker/model slot and serial inference; no general independent swarm or arbitrary tools/filesystem/network. Legacy four-stage same-model pipeline is not independent multi-agent execution.
- FACT: full Notebook/source chat is not implemented; /notebook/ and /research/ were 404 at the last recorded live route inspection. Only aCodingi and aNoteBooki names are explicitly owner-confirmed; do not invent missing studio names.
- FACT: retrieval baseline is SQLite FTS5 + lexical concept graph; full hybrid/vector RAG is not proven. Extraction/RAG flags were documented off by default.
- FACT: Offline Core is specified, not a verified installable/local-inference package. Voice UI/prototypes do not prove working ASR/TTS/audio on a device.
- FACT: VPS, Tunnel, Ollama, production model weights, real provider credentials and native iPhone Safari/VoiceOver are not verified by these repo checks.

## 2. Новая приоритетная последовательность

### P0 — Root app / landing UI finish (сейчас)

- [~] P0.1 Sidebar: IMPLEMENTED compact headings/rows and independent scrolling; mobile Create/primary rows preserve 44px touch targets. Still measure desktop density and approach ~2× reduction without harming readability (commit `3f20322f`).
- [x] P0.2 Создание: Create Project и Create Chat размещены компактными `＋`-действиями прямо в заголовках секций, с локализуемыми accessible names (commit `3f20322f`).
- [~] P0.3 Collapsible Projects: collapse gives the freed height to Chats; expanded list has internal scroll cap. Focus/scroll/selection persistence needs browser acceptance (commit `3f20322f`; E2E added, not run).
- [~] P0.4 Project Settings: FACT — form is already grouped by Context, Profile, Memory, Sources and Data; no rebuild needed. Mobile density, actions, save/cancel/migrations and duplicate audit remain.
- [ ] P0.5 Единая визуальная система: типографика, размеры, spacing, ритм, border/radius, семантические цвета, контраст, hover/pressed/focus/disabled/loading/error/success.
- [~] P0.6 Mobile: primary sidebar navigation and nested project/chat actions already target 44px; this package extends the same minimum to chat/project menus, toolbar, attachment/context/voice choices and attachment removal. Responsive visual acceptance and real-device pass remain open.
- [~] P0.7 Responsive: диапазон 320–1440px, portrait/landscape and root overflow regression added; mobile dialog safe-area padding/internal-scroll rules and 320×568 settings/functions/chat-action geometry test added. Keyboard/VisualViewport and native-device acceptance remain open.
- [~] P0.8 Menus/dialogs: primary Settings/Functions/Project dialogs have focus lifecycle and keyboard/outside-close in code/E2E; toolbar Search/Functions disclosures close on Escape and outside click with focus return. Full dialogs/popovers, scroll containment, background inert and viewport/keyboard edge cases remain; browser tests not run here.
- [~] P0.9 Chat row actions: rename/move/clone/delete/clear/export/import handlers exist; existing E2E covers move dialog, clear, clone, delete-cancel, keyboard and focus. Added a focused rename + selected-chat export regression test; import/export bundle behavior was delivered historically (PR #118). Still run the full browser suite and verify mobile/desktop menu geometry, touch and active-item persistence.
- [~] P0.10 Composer: narrow-phone layout keeps the four utility controls in a first row and draft + send/stop in a usable second row at <=380px. Added 320/360px geometry regression plus nested attachment/context/voice menu and attachment-removal target coverage; browser execution pending. Remaining: empty/populated/long draft, stop/cancel/retry/regenerate and native keyboard reposition.
- [~] P0.11 Forms: project create/edit and aServi required URL/model/key validation, localized errors, `aria-invalid`/`aria-describedby`, first-invalid focus and corrected-error clearing already exist with E2E coverage. Remaining: cross-form required/validation/error/success/busy/disabled/offline matrix, consistent first-invalid focus, safe retry/clear and no false connected states.
- [~] P0.12 Functions IA: four independent panels exist. Research and Agents now separate active runtime / saved blueprint / planned methods; Skills and Connectors still need contract and visual audit.
- [x] P0.13 Deep Research panel: duplicate Quick/Thorough and web breadth removed; real `multi_step_evidence_report` (sequential stages on one model) remains selectable, other methods are a non-interactive planned catalogue. No fake multi-agent independence (commit `8d88296ffc1ef86a7df0ed9368e897bc40e9d425`).
- [~] P0.14 Agents panel: runtime separated from saved role blueprint; read-only catalogue includes specialist profiles, chat-directed subagents, parallel teams, review/debate, coding team, swarm/DAG and custom builder as PLANNED. Actual runtime remains one Gateway worker/concurrency=1; independent subagents/agent library/builder are not implemented (commit `4bd7df01…`).
- [~] P0.15 Live chat status: chat and panel show allowlisted Gateway events and real `occurred_at` timestamps. Full model/tool/source/progress/error/approval/cancel/reconnect semantics still need integration (commit `6f6914f2…`).
- [~] P0.16 RU/EN: new Research/Agent sections and Create actions are localized RU/EN; full pass over validation/empty/error/loading/disabled and all dynamic panels remains.
- [ ] P0.17 Theme/motion/accessibility: light/dark, prefers-reduced-motion и user override, keyboard-only, visible focus, contrast, names/landmarks/live regions.
- [ ] P0.18 Remove deadwood: tracing всех controls, handlers, duplicated state, stale flags и ненужного payload; удалить только после поиска всех consumers, migration/import/export и regression contract.
- [ ] P0.19 Performance: измерить payload/startup/render/network; убирать только доказанные DOM scans, sync work и дублирование, не минифицировать и не добавлять build tooling наугад.
- [ ] P0.20 Final UI acceptance: focused checks per package; в конце визуальная/browser matrix, publication marker/root routes; native iPhone Safari/VoiceOver отдельный ручной gate.

### P0.21 — 30-point landing acceptance matrix (all items remain open until exact evidence)

**Mobile and responsive geometry**

`[~]` means implementation or focused regression exists but browser/device acceptance is still pending; none of these 30 points is fully VERIFIED by the matrix alone.
1. [~] 320 CSS px: root/body overflow and header/composer bounds have Playwright coverage; browser execution pending.
2. [~] 360 CSS px: root/body overflow and header/composer bounds have Playwright coverage; browser execution pending.
3. [~] 390 CSS px: sidebar/nav/menu 44px geometry tests exist; full surface audit pending.
4. [~] 640 CSS px: root overflow sweep covers breakpoint width; all control bounds pending.
5. [~] 768 CSS px: root overflow sweep covers tablet width; visual hierarchy acceptance pending.
6. [~] 1024 CSS px: root overflow sweep covers width; overlap/visual hierarchy acceptance pending.
7. [~] 1280 CSS px: root overflow sweep covers width; detailed alignment acceptance pending.
8. [~] 1440 CSS px: root overflow sweep covers width; typography/measure acceptance pending.
9. [~] Landscape 844×390: Playwright checks root overflow plus header/toolbar/composer left-right bounds, textarea target height and Send visibility; browser execution pending.
10. [~] Composer resize and short-viewport popover tests exist; real OSK/VisualViewport offset simulation and native iOS keyboard remain open.

**Composer and menus**
11. [~] Composer row geometry and 44px control tests exist at 320/360px; browser execution pending.
12. [~] Narrow composer regression asserts >=200px draft width at 320/360px; browser execution pending.
13. [~] Send target geometry is asserted; visible Stop target is now measured at 44×44, while real streaming/abort state remains a separate scenario.
14. [~] Attachment, project/chat, Functions and context/voice menu actions plus attachment removal have Playwright 44px target coverage; width and height are now both measured. Bounded scrolling remains.
15. [~] Request context scope and active-chat project isolation have E2E coverage; touch/scroll acceptance pending.
16. [~] Voice menu copy and 44px action-target regression added; browser execution pending.
17. [~] Escape/outside dismissal closes only the active popover and returns focus to its trigger; Search/Functions disclosures close on Escape and outside click, composer popovers have Escape handling; outside-click focus return added, but the full cross-menu matrix remains unverified.
18. [~] Attachment removal width/height and draft preservation have regression coverage; browser execution pending.

**Sidebar and navigation**
19. [~] Sidebar swipe, overlay and close controls have E2E coverage; browser execution pending.
20. [~] Projects/Chats disclosure and Create touch targets have 44px geometry coverage; browser execution pending.
21. [~] Project/chat row targets have 320/360/390px coverage; browser execution pending.
22. [~] Nested project/chat action entries have 44px width+height coverage; browser execution pending.
23. [~] Long navigation list internal-scroll tests exist; browser execution pending.
24. [~] Projects collapse/Chats height and state preservation have regression coverage; browser execution pending.
25. [~] Menu Escape/outside click does not activate the control underneath and restores focus; toolbar disclosure Escape handling is implemented and a regression test is added, awaiting Chromium.

**Dialogs, forms and accessibility**
26. [~] Settings/Project/Chat focus lifecycle already has tests; added Functions + Chat Action Tab/Shift+Tab wrap, Escape close and invoker restoration regression. Chromium execution pending.
27. [~] Project create/edit tests assert textual RU errors, aria-invalid, aria-describedby→role=alert and first-invalid focus; full EN/browser pass pending.
28. [~] aServi URL/model/key tests assert sequential textual errors, aria-describedby→role=alert and corrected-error clearing; browser execution pending.
29. [~] RU/EN, both themes, contrast and reduced-motion have existing focused tests; full cross-surface matrix pending.
30. [~] Keyboard traversal, accessible names, status/error roles and focus behavior have E2E coverage; screen-reader and native VoiceOver remain manual gates.

- [x] P0.22 Mobile interaction polish: extended 44px minimum hit areas to nested chat/project actions, toolbar choices, attachment/context/voice menus, attachment removal and jump-to-latest; Project Settings inputs/selects also use 44px minimum height. Menu spacing tightened and reduced-motion transitions disabled. Browser execution remains separate.
- [~] P0.23 Project Settings mobile workspace: narrow-screen settings use a safe-area-aware full-height sheet with sticky compact header, reduced group padding, readable 16px fields (avoids iOS focus auto-zoom) and bounded internal scrolling; added 320/390px Playwright geometry/field-size regression. Browser execution pending.


### P0.25 — Root controls, toolbar and form-state consistency (IMPLEMENTED; browser acceptance pending)

- [~] 1. Unified visible keyboard focus for buttons, links, inputs, selects, disclosures and explicit role=button controls.
- [~] 2. Theme-token focus treatment respects light/dark and forced-colors system mode.
- [~] 3. Disabled buttons and aria-disabled controls no longer retain active visual affordances.
- [~] 4. Busy controls expose a progress cursor without inventing a loading indicator.
- [~] 5. aria-invalid fields use semantic danger border and restrained error halo.
- [~] 6. Inline field errors share readable size, spacing and semantic color.
- [~] 7. Disabled form fields use consistent muted surface and cursor.
- [~] 8. Labels and placeholders use theme-aware muted text without changing copy.
- [~] 9. Mode toolbar uses shared surface/border tokens.
- [~] 10. Fast/Thorough pressed state is visually explicit and semantically distinct.
- [~] 11. Toolbar disclosures align content, use bounded scroll and stable scrollbar space.
- [~] 12. Toolbar options have keyboard-focus treatment and predictable minimum row height.
- [~] 13. Composer surface and border align with the shared theme.
- [~] 14. Composer tools have consistent alignment and compact desktop sizing.
- [~] 15. Draft field has theme-aware text, border and placeholder states.
- [~] 16. Send and Stop use distinct primary/destructive semantic treatments.
- [~] 17. Sidebar section and row-menu triggers share the focus language.
- [~] 18. Focus within project/chat rows is visibly discoverable.
- [~] 19. Settings disclosure rows have consistent minimum height and focus containment.
- [~] 20. Toast placement respects mobile safe-area and composer clearance.
- [~] 21. Mobile toolbar controls and menu options preserve 44px targets.
- [~] 22. Mobile composer controls and input preserve 44px targets.
- [~] 23. Mobile sidebar section/menu triggers preserve 44px targets.
- [~] 24. Reduced-motion removes active press translation.
- [~] 25. Forced-colors mode uses system highlight/mark colors for focus and invalid fields.
- [~] 26. 320/360/390px visual regression: root overflow sweep covers 8 widths and now measures toolbar/header/composer bounds; composer row wrapping is separately tested at 320/360px. Browser execution pending.
- [~] 27. 640/768px breakpoint regression: root overflow + toolbar bounds cover both widths; detailed density/label clipping review remains.
- [~] 28. Added explicit Tab-order regression across mode toolbar → composer → sidebar; browser execution pending.
- [~] 29. Existing RU/EN tests cover dynamic research/agent panels, composer validation, provider and project forms; full root status-copy parity remains.
- [ ] 30. Real iOS Safari/VoiceOver and Windows forced-colors manual verification.

### P1 — Страницы aCodingi и aNoteBooki (только оболочка и уже существующее)

- [ ] P1.1 aCodingi — отдельная same-origin workspace page/route; сохранить нынешний /workspace/ функционал и интегрировать в общий shell/project/chat identity.
- [ ] P1.2 aNoteBooki — отдельная Notebook page, не popup; before implementation build current feature-parity map from official Gemini NotebookLM/Notebook references (do not copy closed source); expose only genuinely available source/chat/evidence/studio functions.
- [ ] P1.3 Обе студии — landscape-first workspace. В portrait на телефоне сохранять desktop-like плотную рабочую поверхность с внутренними скроллами/панелями, а не растянутые мобильные карточки; отдельно проверить landscape.
- [ ] P1.4 Общие session/navigation/return-to-chat contracts; не создавать отдельный deployment, вторую БД или параллельный app shell.
- [ ] P1.5 Не выдумывать дополнительные studio names/routes и границы, пока владелец не подтвердит их назначение.
- [ ] P1.6 aCodingi knowledge base: curated starter repositories, reference implementations, code patterns and runnable examples; pin versions and record upstream/source, license, security scan, prerequisites, provenance and compatibility. Index selectively; no indiscriminate huge-repo downloads or untrusted auto-execution.

### P2 — Чат, модели, режимы, память и данные

- [ ] P2.1 Сохранить естественный полноценный прямой чат для разговора, шуток, идей, планирования, анализа, исследования и кода.
- [ ] P2.2 Матрица Quick/Thorough × search normal/more/offline × strategy × profile × model/provider × attachments × project/memory scope; проверить persisted/migration/import/export/request body/precedence.
- [ ] P2.3 Internet/tools по необходимости: решение о поиске, вызовах и подключении skills/tools — только по policy и grant; агентам web access отдельно.
- [ ] P2.4 Model routing и weights: main-only baseline, task-specific helper/specialist evaluation, model residency, hardware budgets, latency/quality/cost and failure route.
- [ ] P2.5 Context engineering: prompt hierarchy, bounded context, token budget, stale state, cancellation, tool-round/deadline, response schema and provider-compatible multimodal content. Add user-facing transparency of actions/evidence/status; never expose private chain-of-thought.
- [ ] P2.6 Memory: global/personal/project/chat/Notebook/research/agent scopes, provenance, user edits, stale facts, retention, deletion, derived data, export, cross-scope leak tests.
- [ ] P2.7 Cache: browser cache, inference prefix/KV reuse, exact response cache; correctness of scopes/invalidation and strict bypass for tools, streams, media, errors, partial and dynamic research.
- [ ] P2.8 After landing, have the provider decision session with owner. No assumption about the desired provider set.
- [ ] P2.9 Third-party providers only in Additional Providers; first-party aServi/server route stays isolated and untouched by provider switch; never transfer keys or silently fall back.
- [ ] P2.10 Optional user export directory: browser permissioned picker, app-owned structured folder creation/export, show access/revoke state; no arbitrary unrestricted filesystem claims.

### P3 — Real Deep Research, Agents, Skills, Connectors

- [ ] P3.1 Deep Research method catalog: focused lookup, multi-source report, compare, literature review, fact-check/source audit, Notebook research and further specialist methods as separate handlers.
- [ ] P3.2 Resumable bounded research workflow: discovery → fetch → gaps → evidence/claim validation → contradiction handling → synthesis/report/export.
- [ ] P3.3 Exact citation lineage to source/page/block/offset/hash; freshness and unsupported-claim checks, no invented citation.
- [ ] P3.4 True AgentRun: actual independent workers/model calls, typed DAG, bounded fan-out/queue/concurrency/backpressure, idempotency/retries/checkpoints/recovery/cancel/deadline.
- [ ] P3.5 Chat-directed subagents: define e.g. 3 specialists with roles, skills, knowledge and explicit permissions; use actual execution, not labels or sequential same-model disguise.
- [ ] P3.6 Agent timeline/status integrated into chat and panel, sourced from real events, timestamps and run journal.
- [ ] P3.7 Tool registry: typed schemas, permission engine, scopes, egress/SSRF, approval tickets, budgets, quotas, audit and secret redaction.
- [ ] P3.8 Agent library/custom agent/team builder/swarm methods, only as capabilities become real and evaluated.
- [ ] P3.9 Skill lifecycle: import/create, manifest, source provenance/licenses, injection/security scanning, tests/evals, approval, version/diff, enable/disable/export/rollback; scripts inert before approval.
- [ ] P3.10 Connectors registry: real GitHub/repository and approved file/cloud connectors, least-privilege OAuth/API scopes, encrypted secret lifecycle, consent/revoke, quotas, error and deletion cleanup.
- [ ] P3.11 Capability/model routing: roles, Skills and models remain separate concerns; a role/Skill never grants permissions.
- [ ] P3.12 aCodingi controlled local workspace: explicit user-selected directory/files, validated paths/symlinks, scoped read/write grants, diff-first edits, sandboxed execution, resource/egress limits, cancel/rollback and audit. Browser File System Access alone is not a general local shell or OS sandbox.

### P4 — Notebook, Source Vault, ingestion and conversions

- [ ] P4.1 Common SourceRecord/BlockRef/ArtifactRecord contract with stable IDs, hashes, offsets, page/time provenance across Notebook, chat, projects, RAG and outputs.
- [ ] P4.2 Notebook: selected-source chat, follow-ups, summaries, comparison, evidence viewer, project attach, selective context transfer and source-specific citation.
- [ ] P4.3 Notebook Studio: reports, podcast, editable presentations, charts/slides, diagrams/infographics/export; claims grounded in exact BlockRefs.
- [ ] P4.4 Podcast pipeline: outline/script/segments/speakers/pronunciation/TTS/transcript/citations/progress/cancel/export.
- [ ] P4.5 Local file source modes (reference/attach/import), user approval, quotas, hash dedup, parsing and deletion lineage.
- [ ] P4.6 Parsers/converters: PDF, DOCX, XLSX, TXT, MD, CSV, JSON, EPUB/books, HTML/web, images/audio/video metadata, OCR scanned pages where license/device gates pass.
- [ ] P4.7 Threat model for archive bombs, path traversal, symlinks, malicious PDF/HTML, injection, SSRF, temp files, resource caps and privacy.
- [ ] P4.8 RAG: FTS5 baseline vs hybrid lexical/vector/rerank by quality/latency/RAM eval; RU/EN/TH corpus and citation correctness.
- [ ] P4.9 Export folders: Chats, Projects, Notebook, Sources, Exports, Backups, with explicit directory access and visible permission revoke.
- [ ] P4.10 Notebook/source import/export, backup, idempotency, conflict resolution, tombstones and recovery.

### P5 — Offline Core and local/server

- [ ] P5.1 Downloadable component manifest with exact size/platform/RAM/CPU/GPU/disk/licenses/checksums/provenance/dependencies before consent.
- [ ] P5.2 Minimal local core, one small model/runtime and local persistence; optional Coder, research, conversion, voice components selected independently.
- [ ] P5.3 Local/server switch preserves chat/project/notebook/source/context/approvals/run state and provenance; no silent upload or remote fallback.
- [ ] P5.4 Offline Coder/research/voice readiness is independently truthful; cached research packs only; web unavailable offline.
- [ ] P5.5 Safe package install/update/pause/resume/checksum/rollback/uninstall; no unapproved downloads.
- [ ] P5.6 Choose IndexedDB/OPFS/SQLite/WASM by measured needs; avoid redundant stores and duplicate model runtimes.

### P6 — Voice and audio (после landing)

- [ ] P6.1 Re-audit all existing VoiceStudio/Whisper/Vosk/Qwen ASR/Piper/Silero VAD/TTS artefacts and runtimes; distinguish downloaded vs installed vs loaded vs verified.
- [ ] P6.2 ASR RU/EN/TH benchmark WER/CER, RTF, first token/response, RAM/PSS, model/weight/license/hash; transcript editable before send.
- [ ] P6.3 TTS licensed high-quality voices, selected text/full message read-aloud, queue/pause/resume/stop/cancel and device validation.
- [ ] P6.4 Voice chat turn-taking, endpointing, VAD, interruption/barge-in, AEC/echo, Bluetooth/mobile lifecycle and recovery; start with feasible measured half-duplex.
- [ ] P6.5 Podcast as Notebook artifact, grounded script, TTS, transcript and source links.
- [ ] P6.6 Audio format/codec/sample rate/duration/hash/voice/model/license/provenance/retention/export contracts.
- [ ] P6.7 Verify upstreams and licenses including user-mentioned VoiceStudio/Whisper and ambiguous “Dessa” reference; do not assume exact project identity.
- [ ] P6.8 aSoundi — separate audio studio shell/route after landing; audio generation, editing, voice and podcast runtime only after source/license audit and corresponding ASR/TTS/pipeline acceptance. Do not pull aSoundi into P0 landing.

### P7 — Provider owner session (строго после landing)

- [ ] P7.1 Ask owner how to finish supported provider set and UX only after landing UI acceptance.
- [ ] P7.2 Verify Additional Providers isolation from first-party aServi and backend/server config.
- [ ] P7.3 Verify official endpoints/CORS/auth/rate limits/error schemas and live catalog per provider using current primary sources.
- [ ] P7.4 Dynamic model catalog with static fallback and per-provider capability compatibility.
- [ ] P7.5 Error matrix 400/401/403/404/429/5xx/timeout/network/CORS/malformed/cancel; no inappropriate retry/fallback.
- [ ] P7.6 Never migrate provider keys, include in export/log or show secrets in diagnostics.

### P8 — Release and owner-only gates

- [ ] P8.1 Run the appropriate focused fast and browser checks at the end of implementation packages; no weakening assertions or safety gates.
- [ ] P8.2 Exact current HEAD CI, Pages publish marker and root routes after each material main package.
- [ ] P8.3 Owner-run VPS/Tunnel/Ollama/OS/hardware/model/DB/readiness/cold-warm latency and RAM/PSS evidence.
- [ ] P8.4 Permissioned RU/EN/TH golden datasets; benchmark main model, agent, RAG, Coder, ASR/TTS and adversarial cases.
- [ ] P8.5 Security/supply chain: main ruleset, action pins, CSP/SRI, secrets, CORS/SSRF, sandbox escape, backup/restore.
- [ ] P8.6 Owner-only credentials, payments, account registration, physical mic tests and host operations remain explicit owner actions.

## 3. Текущий ближайший пакет реализации

- [~] Первый UI пакет: sidebar Create/section headings/space recovery IMPLEMENTED; остаётся довести desktop row density и проверить focus/scroll/selection persistence. Project Settings уже имеют базовую логическую IA; нужна mobile/action acceptance.
- [~] Второй UI пакет: основные dialog focus/keyboard сценарии уже присутствуют; остаток — полный menu/popover sweep, chat-row action completeness, composer geometry/keyboard и все form states.
- [~] Третий UI пакет: Research duplicate controls removed, current method selector/catalogue and Agent topology roadmap IMPLEMENTED; осталось довести Skills/Connectors IA и полную real status-strip semantics. См. P0.12–P0.15.
- [ ] Fourth UI package: RU/EN, mobile 320–1440, typography/spacing/theme/motion/accessibility, browser matrix and dead-control audit.
- [ ] Only after P0 acceptance: aCodingi/aNoteBooki workspace shells, without broadening studio runtime scope. aSoundi comes later after landing.
- [ ] At end of landing: run complete package verification and then owner provider consultation.

## 4. Imported historical registers — open/partial task rows

Ниже сохранены все строки checkbox двух прежних мастер-реестров. Стабильные ID и исходные формулировки оставлены для трассировки. PARTIAL перенесён как открытый пункт с явной пометкой; старые статусы не заменяют актуальную приёмку.

## 4A. Open / partial
### MASTER_TASK_REGISTRY_RU.md — UR — Исторический пользовательский реестр
- [ ] **UR-014** **UR-014** (строка 14; A. База, управление и непрерывность): Проверить все старые регрессии: создание чата, история, экспорт/импорт, отмена, повтор запроса. _(исходный статус: OPEN; строка 55)_
- [ ] **UR-015** **UR-015** (строка 15; A. База, управление и непрерывность): Обновить сведения о реальном состоянии системы: код, контракт, эксперимент, развёрнутая служба, измеренная метрика. _(исходный статус: OPEN; строка 56)_
- [ ] **UR-020** **UR-020** (строка 20; B. Первичное облако aLandi и API-провайдеры): Начальный статус облака — красный/неподтверждённый; зелёный возможен лишь после реального модельного ответа и успешной `/healthz`-проверки при следующем запуске. Живой пользовательский gateway ещё не сконфигурирован. _(исходный статус: PARTIAL; строка 57)_
- [ ] **UR-021** **UR-021** (строка 21; B. Первичное облако aLandi и API-провайдеры): Хранить адрес, модель и ключ aLandi отдельно; не считать наличие ключа доказательством связи. _(исходный статус: PARTIAL; строка 58)_
- [ ] **UR-022** **UR-022** (строка 22; B. Первичное облако aLandi и API-провайдеры): Проверять сохранённое соединение при запуске через health-check, а не доверять вечному старому зелёному статусу. _(исходный статус: PARTIAL; строка 59)_
- [ ] **UR-023** **UR-023** (строка 23; B. Первичное облако aLandi и API-провайдеры): Перенести старые настройки провайдеров в свёрнутый дополнительный раздел. _(исходный статус: PARTIAL; строка 60)_
- [ ] **UR-024** **UR-024** (строка 24; B. Первичное облако aLandi и API-провайдеры): Вынести ключ Tavily в под-раздел инструментов и веб-поиска. _(исходный статус: PARTIAL; строка 61)_
- [ ] **UR-025** **UR-025** (строка 25; B. Первичное облако aLandi и API-провайдеры): Добавить кнопку вставки для ключей провайдера и своего gateway. _(исходный статус: PARTIAL; строка 62)_
- [ ] **UR-026** **UR-026** (строка 26; B. Первичное облако aLandi и API-провайдеры): После явной вставки ключа запускать один ограниченный refresh каталога и тест соединения. _(исходный статус: PARTIAL; строка 63)_
- [ ] **UR-027** **UR-027** (строка 27; B. Первичное облако aLandi и API-провайдеры): Блокировать конкурирующие одновременные тесты подключения. _(исходный статус: PARTIAL; строка 64)_
- [ ] **UR-029** **UR-029** (строка 29; B. Первичное облако aLandi и API-провайдеры): При явной ошибке доступности модели искать не более трёх альтернатив того же провайдера. _(исходный статус: PARTIAL; строка 65)_
- [ ] **UR-030** **UR-030** (строка 30; B. Первичное облако aLandi и API-провайдеры): Не делать retry альтернативных моделей на 401/403, 429, сетевой ошибке или общем сбое API. _(исходный статус: PARTIAL; строка 66)_
- [ ] **UR-031** **UR-031** (строка 31; B. Первичное облако aLandi и API-провайдеры): Принимать корректные текстовые массивы, refusals/tool-calls и варианты совместимого ответа, не путать валидный JSON-envelope с ошибкой формата. _(исходный статус: PARTIAL; строка 67)_
- [ ] **UR-032** **UR-032** (строка 32; B. Первичное облако aLandi и API-провайдеры): Kilo Auto Free доступен как обычный альтернативный провайдер в общем списке: без ключа, только по явному выбору и без скрытого fallback. Официальная документация предупреждает, что промпты могут поступать провайдерам, которые логируют их/используют для улучшения моделей; конфиденциальные данные туда не отправлять. См. `docs/V016_IMPLEMENTATION_CHECKLIST.md` и [официальное предупреждение Kilo](https://kilo.ai/docs/getting-started/using-kilo-for-free). _(исходный статус: PARTIAL; строка 68)_
- [ ] **UR-033** **UR-033** (строка 33; B. Первичное облако aLandi и API-провайдеры): Обновить все модельные ID по официальным динамическим каталогам; статические preset считать только fallback. _(исходный статус: OPEN; строка 69)_
- [ ] **UR-034** **UR-034** (строка 34; B. Первичное облако aLandi и API-провайдеры): Провести E2E-проверку реального пользовательского выбора Kilo и документацию об обработке данных сторонним шлюзом. _(исходный статус: OPEN; строка 70)_
- [ ] **UR-036** **UR-036** (строка 36; B. Первичное облако aLandi и API-провайдеры): Проверить официальные endpoints, CORS, лимиты, схему аутентификации и формат ошибок каждого сохранённого провайдера. _(исходный статус: OPEN; строка 71)_
- [ ] **UR-037** **UR-037** (строка 37; B. Первичное облако aLandi и API-провайдеры): Никогда не переносить ключи из одного провайдера в другой и не экспортировать ключи в settings-profile. _(исходный статус: OPEN; строка 72)_
- [ ] **UR-040** **UR-040** (строка 40; C. Главный экран, визуальная система и язык): Переоформить шапку в бренд aLandi и перенести название активного чата в подпись. _(исходный статус: PARTIAL; строка 73)_
- [ ] **UR-041** **UR-041** (строка 41; C. Главный экран, визуальная система и язык): Добавить пасхалку «a land i → i land AI». _(исходный статус: PARTIAL; строка 74)_
- [ ] **UR-042** **UR-042** (строка 42; C. Главный экран, визуальная система и язык): Добавить реальные цифровые часы и аналоговые стрелки с дискретным обновлением. _(исходный статус: PARTIAL; строка 75)_
- [ ] **UR-043** **UR-043** (строка 43; C. Главный экран, визуальная система и язык): Добавить основной переключатель тёмной/светлой темы на главном экране. _(исходный статус: PARTIAL; строка 76)_
- [ ] **UR-044** **UR-044** (строка 44; C. Главный экран, визуальная система и язык): Добавить RU/EN переключатель и сохранять выбранный язык. _(исходный статус: PARTIAL; строка 77)_
- [ ] **UR-045** **UR-045** (строка 45; C. Главный экран, визуальная система и язык): Обновить шрифтовой fallback без обязательной внешней загрузки; улучшить радиусы и состояния элементов. _(исходный статус: PARTIAL; строка 78)_
- [ ] **UR-046** **UR-046** (строка 46; C. Главный экран, визуальная система и язык): Реализовать центрирование поля ввода в пустом чате и увеличение высоты по мере ввода. _(исходный статус: PARTIAL; строка 79)_
- [ ] **UR-047** **UR-047** (строка 47; C. Главный экран, визуальная система и язык): Перемещать длинный черновик из центрального режима в привычную нижнюю позицию. _(исходный статус: PARTIAL; строка 80)_
- [ ] **UR-048** **UR-048** (строка 48; C. Главный экран, визуальная система и язык): Добавить ограниченное прикрепление текстовых файлов (.txt, .md, .csv, .json, .log) с размерными лимитами. _(исходный статус: PARTIAL; строка 81)_
- [ ] **UR-049** **UR-049** (строка 49; C. Главный экран, визуальная система и язык): Мобильная кнопка голоса, удержание и свайп покрыты успешным PR #21 Chromium E2E. Это только preview: микрофон, ASR, TTS, AEC и аудиотранспорт не подключены. _(исходный статус: PARTIAL; строка 82)_
- [ ] **UR-050** **UR-050** (строка 50; C. Главный экран, визуальная система и язык): Полностью пройти мобильную/настольную проверку размеров и областей касания. _(исходный статус: OPEN; строка 83)_
- [ ] **UR-051** **UR-051** (строка 51; C. Главный экран, визуальная система и язык): Проверить клавиатурную доступность, visible focus, контраст, screen reader и reduced-motion. _(исходный статус: OPEN; строка 84)_
- [ ] **UR-052** **UR-052** (строка 52; C. Главный экран, визуальная система и язык): Перевести все пользовательские надписи, подсказки и ошибки интерфейса; текущий RU/EN перевод неполный. _(исходный статус: OPEN; строка 85)_
- [ ] **UR-053** **UR-053** (строка 53; C. Главный экран, визуальная система и язык): Сокращены ключевые инструкции настроек: cloud/API, ключи, CORS, контекст и веб-поиск. Полный аудит всех подсказок и согласование RU/EN ещё не завершены. _(исходный статус: PARTIAL; строка 86)_
- [ ] **UR-054** **UR-054** (строка 54; C. Главный экран, визуальная система и язык): Провести визуальную регрессию desktop/mobile и проверить, что анимации не мешают длинному вводу. _(исходный статус: OPEN; строка 87)_
- [ ] **UR-057** **UR-057** (строка 57; D. Чаты, проекты, инструкции и память): Project CRUD присутствует в клиенте: создать, переименовать/редактировать, удалить с подтверждением; повторно проверить E2E на текущей ветке. _(исходный статус: PARTIAL; строка 88)_
- [ ] **UR-058** **UR-058** (строка 58; D. Чаты, проекты, инструкции и память): Проектные инструкции редактируются и добавляются в контекст как предпочтения, не как политика безопасности; подтвердить тестами precedence. _(исходный статус: PARTIAL; строка 89)_
- [ ] **UR-059** **UR-059** (строка 59; D. Чаты, проекты, инструкции и память): Текущий чат можно привязать/отвязать от проекта; проектная принадлежность видна в интерфейсе. _(исходный статус: PARTIAL; строка 90)_
- [ ] **UR-060** **UR-060** (строка 60; D. Чаты, проекты, инструкции и память): Есть экспорт/импорт project bundle с чатом, инструкциями и памятью; проверить схему, duplicate IDs, limits, malicious content. _(исходный статус: PARTIAL; строка 91)_
- [ ] **UR-061** **UR-061** (строка 61; D. Чаты, проекты, инструкции и память): Browser-local global/project memory toggles are separate and global context defaults off; UI toggle E2E exists, but a dedicated multi-project prompt-leak test for browser-local global facts remains open. _(исходный статус: PARTIAL; строка 92)_
- [ ] **UR-063** **UR-063** (строка 63; D. Чаты, проекты, инструкции и память): Реализовать authenticated API/индексацию project sources только после согласованного backend contract; не имитировать работающий индекс на пустой заглушке. _(исходный статус: OPEN; строка 94)_
- [ ] **UR-064** **UR-064** (строка 64; D. Чаты, проекты, инструкции и память): RAG retrieval/delete, Evidence Ledger and exact-payload cache isolation tests are present; browser-global memory prompt leakage and a distinct cache project-ID scope contract remain open. Server-memory graph is retired. _(исходный статус: PARTIAL; строка 95)_
- [ ] **UR-065** **UR-065** (строка 65; D. Чаты, проекты, инструкции и память): RAG source deletion is scope-checked and removes chunk/concept/FTS rows; SQLite `secure_delete` plus version-gated FTS5 `secure-delete` regression tests passed on PR #24 HEAD and post-merge main. This still does **not** erase evidence-ledger copies, WAL/journals, backups or browser-local source copies; system-wide crypto-erasure remains open. _(исходный статус: PARTIAL; строка 96)_
- [ ] **UR-066** **UR-066** (строка 66; D. Чаты, проекты, инструкции и память): Проверить экспорт, исправление и удаление пользовательских фактов и связанные derived records. _(исходный статус: OPEN; строка 97)_
- [ ] **UR-067** **UR-067** (строка 67; D. Чаты, проекты, инструкции и память): Реализовать удаление/криптостирание по всем реальным слоям; не обещать SLA ≤60 секунд без измерения. _(исходный статус: OPEN; строка 98)_
- [ ] **UR-071** **UR-071** (строка 71; D. Чаты, проекты, инструкции и память): Полноценный viewer источников/индекса, citation lineage и cross-device project memory остаются задачами последующих фаз. _(исходный статус: OPEN; строка 100)_
- [ ] **UR-074** **UR-074** (строка 74; E. Инструменты, маршрутизация, веб-поиск и отказы): Сохранить ограничение по числу шагов инструментов и исследовательских вызовов; не запускать неограниченный retry loop. _(исходный статус: PARTIAL; строка 101)_
- [ ] **UR-075** **UR-075** (строка 75; E. Инструменты, маршрутизация, веб-поиск и отказы): Сохранить явный opt-in для fallback к другому облачному провайдеру. _(исходный статус: PARTIAL; строка 102)_
- [ ] **UR-076** **UR-076** (строка 76; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить все циклы tool-calls на max rounds, общий deadline, cancellation, bounded concurrency и корректное продолжение assistant/tool messages. _(исходный статус: OPEN; строка 103)_
- [ ] **UR-077** **UR-077** (строка 77; E. Инструменты, маршрутизация, веб-поиск и отказы): При ошибке инструмента пробовать совместимый способ/альтернативный инструмент только в пределах явного policy и бюджета. _(исходный статус: OPEN; строка 104)_
- [ ] **UR-078** **UR-078** (строка 78; E. Инструменты, маршрутизация, веб-поиск и отказы): Показывать правдивую timeline событий: фактический вызов, источник, duration, результат, ошибка; не показывать скрытые рассуждения. _(исходный статус: OPEN; строка 105)_
- [ ] **UR-080** **UR-080** (строка 80; E. Инструменты, маршрутизация, веб-поиск и отказы): Внедрить 12-шаговый Deep Research state machine, повторный поиск при пробелах и проверку утверждений против ссылок. _(исходный статус: OPEN; строка 106)_
- [ ] **UR-081** **UR-081** (строка 81; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить prompt-injection в проектных инструкциях и загруженных документах. _(исходный статус: OPEN; строка 107)_
- [ ] **UR-082** **UR-082** (строка 82; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить SSRF/redirect protections, MIME/size/time limits, безопасную очистку временных файлов и отсутствие секретов в логах. _(исходный статус: OPEN; строка 108)_
- [ ] **UR-083** **UR-083** (строка 83; E. Инструменты, маршрутизация, веб-поиск и отказы): Не кэшировать streaming, tool calls, web research, multimedia, errors или partial outputs. _(исходный статус: OPEN; строка 109)_
- [ ] **UR-084** **UR-084** (строка 84; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить точную инвалидацию exact cache при изменении prompt, project instructions или tool schema. _(исходный статус: OPEN; строка 110)_
- [ ] **UR-085** **UR-085** (строка 85; E. Инструменты, маршрутизация, веб-поиск и отказы): Измерить retry rate, повторные дубликаты, частоту 429/5xx, latency и успешность tool-циклов. _(исходный статус: OPEN; строка 111)_
- [ ] **UR-089** **UR-089** (строка 89; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить CI-гейт триады: точный проверенный URL + лицензия конкретного артефакта + источник технического утверждения. _(исходный статус: OPEN; строка 112)_
- [ ] **UR-090** **UR-090** (строка 90; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Не включать модели/голоса в установщик до проверки точной лицензии, весов, voice artifact и checksums. _(исходный статус: OPEN; строка 113)_
- [ ] **UR-091** **UR-091** (строка 91; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Внедрить ALBF binary framing только вместе с real transport и тестами на усечение, CRC, max payload и cancellation. _(исходный статус: OPEN; строка 114)_
- [ ] **UR-092** **UR-092** (строка 92; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Сделать bake-off ASR/TTS с измерением RTF, first audio, e2e p95 и потребления PSS; не опираться на неподтверждённые цифры. _(исходный статус: OPEN; строка 115)_
- [ ] **UR-093** **UR-093** (строка 93; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Подтвердить native audio capture/processing прежде, чем обещать отсутствие PCM/аудио hotpath в Python. _(исходный статус: OPEN; строка 116)_
- [ ] **UR-095** **UR-095** (строка 95; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить безопасную изоляцию tool workspace; не называть subprocess без sandbox production-изоляцией. _(исходный статус: OPEN; строка 117)_
- [ ] **UR-096** **UR-096** (строка 96; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить scope isolation, no-PII logs, prompt priority stack и fail-safe privacy policy. _(исходный статус: OPEN; строка 118)_
- [ ] **UR-097** **UR-097** (строка 97; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Измерить профиль laptop_8gb_cpu_mvp на целевом 8-GB железе, включая combined LLM+RAG+tools и cold-tier eviction. _(исходный статус: OPEN; строка 119)_
- [ ] **UR-098** **UR-098** (строка 98; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Не заявлять p95 900/2500 ms, regret ≤1.25, PII leak=0 или crypto-erase SLA, пока нет воспроизводимых evals. _(исходный статус: OPEN; строка 120)_
- [ ] **UR-099** **UR-099** (строка 99; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Полностью пересмотреть список зависимостей/отклонённых технологий в V-016 и не вводить CUT/PAT items как production-зависимости. _(исходный статус: OPEN; строка 121)_
- [ ] **UR-100** **UR-100** (строка 100; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить Third-party NOTICE и права распространения каждой включённой библиотеки/модели. _(исходный статус: OPEN; строка 122)_
- [ ] **UR-103** **UR-103** (строка 103; G. Выпуск и финальный аудит): Пройти Jekyll build, quality sentinels, browser Chromium tests, accessibility/interaction tests и provider-specific deterministic E2E. _(исходный статус: OPEN; строка 123)_
- [ ] **UR-104** **UR-104** (строка 104; G. Выпуск и финальный аудит): Проверить без реальных секретов: malformed response, 400/404 model missing, 401/403 auth, 429, 5xx, timeout, CORS, offline and cancelled request. _(исходный статус: OPEN; строка 124)_
- [ ] **UR-105** **UR-105** (строка 105; G. Выпуск и финальный аудит): Проверить, что новая ветка не меняет чужую конфигурацию, историю, секреты или сохранённые настройки молча. _(исходный статус: OPEN; строка 125)_
- [ ] **UR-106** **UR-106** (строка 106; G. Выпуск и финальный аудит): После merge проверить main SHA, успешные workflows и опубликованную GitHub Pages версию. _(исходный статус: OPEN; строка 126)_
- [ ] **UR-107** **UR-107** (строка 107; G. Выпуск и финальный аудит): Перепроверить каждый пункт этого реестра перед итоговым отчётом; явно перечислить незавершённое и неподтверждённое. _(исходный статус: OPEN; строка 127)_
- [ ] **UR-117** **UR-117** (строка 117; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 0–4: gateway/trace, scoped temporal memory, FTS5/evidence/citations и tool safety имеют foundations/prototypes; у каждого остаются отдельные eval-гейты. _(исходный статус: PARTIAL; строка 128)_
- [ ] **UR-118** **UR-118** (строка 118; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 5–6: подключить настоящий voice runtime и native ASR/VAD/TTS только после лицензий и воспроизводимого hardware benchmark. _(исходный статус: OPEN; строка 129)_
- [ ] **UR-119** **UR-119** (строка 119; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 7–8: подключить реальную telemetry timeline, authenticated UI API и cloud integration только после backend contract/security review. _(исходный статус: OPEN; строка 130)_
- [ ] **UR-169** **UR-169** (строка 169; Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты): На каждое изменение статуса дополнить eval-отчёт командой, результатом, sample size, SHA и rollback; обновить PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md и соответствующий отчёт. _(исходный статус: OPEN; строка 131)_
- [ ] **UR-174** **UR-174** (строка 174; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Прогнать python -m compileall -q gateway, python -m pytest -q gateway/tests, python gateway/evals/run_six_layer_eval.py и лицензионный CI gate на текущем состоянии ветки. _(исходный статус: OPEN; строка 132)_
- [ ] **UR-175** **UR-175** (строка 175; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Проверить provenance каждого реально поставляемого артефакта: точный источник, применимая лицензия модели/голоса, SHA-256. TBD/непроверенные hashes не могут отмечаться как ship-enabled. _(исходный статус: OPEN; строка 133)_
- [ ] **UR-176** **UR-176** (строка 176; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Измерить на целевом хосте cold/warm p50/p95/p99, RTF, RAM/PSS, аудиодропы, CER/WER и regression sample counts до любых performance claims. _(исходный статус: OPEN; строка 134)_
- [ ] **UR-177** **UR-177** (строка 177; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Развёртывание VPS, DNS, OAuth secrets и создание billable infrastructure не выполнять без актуального account access/проверенных параметров и отдельного согласованного действия. _(исходный статус: OPEN; строка 135)_
- [ ] **UR-191** **UR-191** (строка 191; Gate перед финальным ответом): Пересверить весь этот To do и таблицу ID с текущим HEAD после завершения всех workflows; подробный аудит четырёх частей манифеста — `docs/V016_IMPLEMENTATION_CHECKLIST.md` (81 пункт, §§0–40). _(исходный статус: OPEN; строка 136)_
- [ ] **UR-192** **UR-192** (строка 192; Gate перед финальным ответом): Указать раздельно: фактически внедрено, проверено CI, подтверждено live, измерено benchmark, осталось prototype/deferred/blocked. _(исходный статус: OPEN; строка 137)_
- [ ] **UR-193** **UR-193** (строка 193; Gate перед финальным ответом): Не объединять PR и не сообщать о публикации до зелёных релевантных workflow и проверки merge result. _(исходный статус: OPEN; строка 138)_
- [ ] **UR-202** **UR-202** (строка 202; I. Следующие продуктовые вертикали): Первый месяц не создавать платные ресурсы автоматически: GitHub Pages + уже имеющееся железо + Ollama локально; free-tier API считать квотируемым и внешним, не гарантированно бесплатным. _(исходный статус: OPEN; строка 140)_
- [ ] **UR-203** **UR-203** (строка 203; I. Следующие продуктовые вертикали): Оценить одну маленькую helper-модель для классификации, извлечения фактов, кратких сводок и чернового ранжирования. Главная модель остаётся для планирования, сложного reasoning и синтеза. Сравнить качество, latency и RAM перед включением. _(исходный статус: OPEN; строка 141)_
- [ ] **UR-204** **UR-204** (строка 204; I. Следующие продуктовые вертикали): Добавить генерацию изображений отдельным модулем после выбора реального backend (локальный ComfyUI/API или явно выбранный внешний провайдер), проверки точной модели/лицензии/VRAM и mock E2E. _(исходный статус: OPEN; строка 142)_
- [ ] **UR-205** **UR-205** (строка 205; I. Следующие продуктовые вертикали): Не добавлять скрытый refusal-фильтр поверх выбранной модели; не обещать «никогда не отказывает»: поведение checkpoint и правила внешнего API не контролируются приложением. _(исходный статус: OPEN; строка 143)_
- [ ] **UR-206** **UR-206** (строка 206; I. Следующие продуктовые вертикали): Перед переходом на платный сервер сравнить baseline с измерениями p50/p95, RAM, качества, устойчивости, квот и месячной стоимости; менять endpoint/model config без смены контракта UI. _(исходный статус: OPEN; строка 144)_
- [ ] **UR-213** **UR-213** (строка 213; Supplement — 2026-10-24 owner quickstart and chat ergonomics): Real voice capture/ASR/TTS, image/video pipelines and complete document ingestion remain separate unimplemented work; see `docs/IMPLEMENTATION_ROADMAP_RU.md` and the original V-016 evidence ledger. _(исходный статус: OPEN; строка 145)_
- [ ] **UR-225** **UR-225** (строка 225; Supplement — 2026-10-24 project navigation and composer): Real device verification: touch long-press/cancel, mobile keyboard focus/viewport reset, screen reader flow, and large file handling. _(исходный статус: OPEN; строка 146)_
- [ ] **UR-226** **UR-226** (строка 226; Supplement — 2026-10-24 project navigation and composer): Implement real file intake pipeline for PDF/DOCX/XLSX/OCR/audio/video metadata before claiming all formats are supported. _(исходный статус: OPEN; строка 147)_
- [ ] **UR-235** **UR-235** (строка 235; Supplement — local helper memory suggestions (2026-10-27)): Live inference, selected/installed VPS model, output quality, RAM and latency remain unverified. _(исходный статус: OPEN; строка 148)_
- [ ] **UR-243** **UR-243** (строка 243; Supplement — reconciliation of the older mobile and interface request (2026-10-27)): Next bounded slice: edge-aware chat-row/popover placement and compact header order/project label/clock polish. Keep these separate from provider/project export-import cleanup and per-chat settings audit. _(исходный статус: PARTIAL; строка 149)_
- [ ] **UR-244** **UR-244** (строка 244; Supplement — reconciliation of the older mobile and interface request (2026-10-27)): Run native iPhone Safari/keyboard/touch verification separately; passing Chromium viewport simulation is not proof of native behavior. _(исходный статус: OPEN; строка 150)_
- [ ] **UR-251** **UR-251** (строка 251; Supplement — autonomous agent orchestration research (2026-10-28)): Reconcile current main and open PRs before code changes; audit actual runtime paths rather than relying on module names. _(исходный статус: OPEN; строка 151)_
- [ ] **UR-252** **UR-252** (строка 252; Supplement — autonomous agent orchestration research (2026-10-28)): Implement task contract/state machine and tests in a bounded PR. _(исходный статус: OPEN; строка 152)_
- [ ] **UR-253** **UR-253** (строка 253; Supplement — autonomous agent orchestration research (2026-10-28)): Select and verify a real sandbox before allowing arbitrary command/code execution. _(исходный статус: OPEN; строка 153)_
- [ ] **UR-254** **UR-254** (строка 254; Supplement — autonomous agent orchestration research (2026-10-28)): Add adversarial/golden evaluations, crash/restart and idempotency tests; measure target-host RAM/latency. _(исходный статус: OPEN; строка 154)_
- [ ] **UR-255** **UR-255** (строка 255; Supplement — autonomous agent orchestration research (2026-10-28)): Update PROJECT_STATE.yaml and EVALS.md only with verified implementation/test evidence. Research/documentation completion does not mean runtime implementation. _(исходный статус: OPEN; строка 155)_
- [ ] **UR-259** **UR-259** (строка 259; Supplement — voice model landing and VPS owner steps (2026-10-28)): After PR #75 exact-head CI passes and the code is merged, deploy that exact code revision to the VPS; GitHub Pages deployment alone does not update the private gateway. _(исходный статус: OPEN; строка 156)_
- [ ] **UR-260** **UR-260** (строка 260; Supplement — voice model landing and VPS owner steps (2026-10-28)): On the VPS, inspect OS/architecture/RAM/disk before installing Python 3.12+, ffmpeg/ffprobe, whisper.cpp, Piper and selected local model artifacts. _(исходный статус: OPEN; строка 157)_
- [ ] **UR-261** **UR-261** (строка 261; Supplement — voice model landing and VPS owner steps (2026-10-28)): Download only upstream-verified, license-reviewed artifacts; record exact source/version/license/SHA-256. For Piper, verify matching `.onnx` + `.onnx.json`; do not auto-download models from user requests. _(исходный статус: OPEN; строка 158)_
- [ ] **UR-262** **UR-262** (строка 262; Supplement — voice model landing and VPS owner steps (2026-10-28)): Configure `/etc/alandi-gateway.env` with `0600` permissions; keep ASR/TTS flags false until binaries, models and authenticated capabilities are checked. Then enable one feature at a time and restart the service. _(исходный статус: OPEN; строка 159)_
- [ ] **UR-263** **UR-263** (строка 263; Supplement — voice model landing and VPS owner steps (2026-10-28)): Validate the real microphone → editable transcript → explicit send → same-chat response → local TTS playback/voice choice/Stop path on the target device; record RAM, latency and speech quality. _(исходный статус: OPEN; строка 160)_
- [ ] **UR-264** **UR-264** (строка 264; Supplement — voice model landing and VPS owner steps (2026-10-28)): Never share secrets or full env files in chat. SSH/VPS access is not available through the current GitHub integration, so server-side installation must be executed by the owner using the runbook. _(исходный статус: OPEN; строка 161)_
- [ ] **UR-271** **UR-271** (строка 271; Supplement — consolidated interface cleanup, 2026-10-30): Native iPhone Safari keyboard, safe-area, touch and accessibility checks remain manual gates. Chromium geometry assertions do not establish native iOS behavior. _(исходный статус: OPEN; строка 162)_
- [ ] **UR-272** **UR-272** (строка 272; Supplement — consolidated interface cleanup, 2026-10-30): Live aLandi gateway, third-party provider credentials, external connectors, independent agent teams and production voice transport are not verified by these UI changes. _(исходный статус: OPEN; строка 163)_
- [ ] **UR-278** **UR-278** (строка 278; Supplement — sidebar hierarchy and preferences, 2026-10-30): Native iPhone Safari keyboard, safe-area, focus, touch and screen-reader behavior remain unverified. Live gateway, provider credentials, connector sync, independent agent teams and voice transport remain separate runtime/infrastructure gates. _(исходный статус: OPEN; строка 164)_
- [ ] **UR-284** **UR-284** (строка 284; Supplement — orthogonal chat settings and Research Studio, 2026-10-30): Native iPhone Safari behavior and live gateway/provider execution remain separate manual/runtime gates. _(исходный статус: OPEN; строка 165)_
- [ ] **UR-290** **UR-290** (строка 290; Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30): Run a real target-host comparison with identical model artifact/digest/license, quantization, context, hardware and repetitions. Record RAM/PSS, cold/warm latency, p50/p95, tokens/s where available and human-rated RU/EN/TH task quality. _(исходный статус: OPEN; строка 166)_
- [ ] **UR-291** **UR-291** (строка 291; Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30): Keep the main model responsible for planning, complex reasoning and synthesis. Evaluate at most one optional helper for bounded extraction/classification/summarization; helper remains off by default and cannot authorize tools or approve side effects. _(исходный статус: OPEN; строка 167)_
- [ ] **UR-302** **UR-302** (строка 302; Supplement — V1 landing and interface finalization, 2026-10-30): Native iPhone Safari, keyboard, safe-area, screen-reader and touch verification remain manual gates. _(исходный статус: OPEN; строка 168)_
- [ ] **UR-303** **UR-303** (строка 303; Supplement — V1 landing and interface finalization, 2026-10-30): Issue #111 remains open for owner-only ruleset, VPS/hardware, live gateway/model, RAG corpus, voice/device and sandbox gates. CI alone cannot close it. _(исходный статус: OPEN; строка 169)_
- [ ] **UR-310** **UR-310** (строка 310; Owner override D-022, 2026-11-08): Final screenshot/accessibility review of the neutral compact contextual stop control; preserve stop while generation is active, but do not use a persistent/floating red button. _(исходный статус: PARTIAL; строка 170)_

### MASTER_TASK_REGISTRY_RU.md — V016 — GEN1 / CRAZE V-016
- [ ] **V016-153** **V016-153** (строка 153; P1 — required next implementation slices): Add a formal safety-first prompt composer (safety/workspace/project/profile/user), with prompt-injection regression tests. _(исходный статус: OPEN; строка 177)_
- [ ] **V016-154** **V016-154** (строка 154; P1 — required next implementation slices): Add a privacy-only/local-only routing policy that blocks remote APIs and makes refusal explicit. _(исходный статус: OPEN; строка 178)_
- [ ] **V016-155** **V016-155** (строка 155; P1 — required next implementation slices): Add route/router error tests for Grok/xAI, Kilo keyless route, 401/403/429/5xx, CORS failures, abort and malformed bodies. _(исходный статус: OPEN; строка 179)_
- [ ] **V016-156** **V016-156** (строка 156; P1 — required next implementation slices): Complete RU/EN translation of settings help, errors, traces, project controls and all interactive labels. _(исходный статус: OPEN; строка 180)_
- [ ] **V016-157** **V016-157** (строка 157; P1 — required next implementation slices): Audit keyboard navigation, contrast, mobile composer movement, safe-area and reduced-motion support. _(исходный статус: OPEN; строка 181)_
- [ ] **V016-160** **V016-160** (строка 160; P2 — V-016 engineering blockers; do not advertise as production): Implement and test deterministic artifact-manifest hashing + complete INTEL triad gate. _(исходный статус: OPEN; строка 182)_
- [ ] **V016-161** **V016-161** (строка 161; P2 — V-016 engineering blockers; do not advertise as production): Implement typed risk-aware router and route-regret evaluation corpus. _(исходный статус: OPEN; строка 183)_
- [ ] **V016-162** **V016-162** (строка 162; P2 — V-016 engineering blockers; do not advertise as production): Implement ALBF binary framing with CRC/truncation/overflow/interrupt tests. _(исходный статус: OPEN; строка 184)_
- [ ] **V016-163** **V016-163** (строка 163; P2 — V-016 engineering blockers; do not advertise as production): Implement native audio capture/inference adapters and measure e2e p50/p95 + PSS on the target 8 GB CPU host. _(исходный статус: OPEN; строка 185)_
- [ ] **V016-164** **V016-164** (строка 164; P2 — V-016 engineering blockers; do not advertise as production): Resolve every model/voice license/hash before packaging any weights. _(исходный статус: OPEN; строка 186)_
- [ ] **V016-165** **V016-165** (строка 165; P2 — V-016 engineering blockers; do not advertise as production): Harden cPocket rollback/TTL/cancellation races; do not enable speculative side-effect tools. _(исходный статус: OPEN; строка 187)_
- [ ] **V016-166** **V016-166** (строка 166; P2 — V-016 engineering blockers; do not advertise as production): Add crypto-erasure semantics and prove logical vs physical deletion guarantees. _(исходный статус: OPEN; строка 188)_
- [ ] **V016-167** **V016-167** (строка 167; P2 — V-016 engineering blockers; do not advertise as production): Add scratch-file offload, secure document ingestion, exact page/offset/hash citations and retrieval benchmarks. _(исходный статус: OPEN; строка 189)_
- [ ] **V016-168** **V016-168** (строка 168; P2 — V-016 engineering blockers; do not advertise as production): Keep CLI/browser runtime blocked until real sandbox/SSRF/approval escape tests pass. _(исходный статус: OPEN; строка 190)_
- [ ] **V016-169** **V016-169** (строка 169; P2 — V-016 engineering blockers; do not advertise as production): Implement 12-state research workflow and claim-to-evidence citation validation. _(исходный статус: OPEN; строка 191)_
- [ ] **V016-170** **V016-170** (строка 170; P2 — V-016 engineering blockers; do not advertise as production): Implement candidate-lessons pipeline with golden tests and rollback; no automatic weight training. _(исходный статус: OPEN; строка 192)_
- [ ] **V016-171** **V016-171** (строка 171; P2 — V-016 engineering blockers; do not advertise as production): Implement optional connectors only after encrypted token storage, scope review, revoke and index cleanup. _(исходный статус: OPEN; строка 193)_
- [ ] **V016-172** **V016-172** (строка 172; P2 — V-016 engineering blockers; do not advertise as production): Keep infrastructure and hardware targets as documentation until the required access and measurement environment exist. _(исходный статус: OPEN; строка 194)_
- [ ] **V016-186** **V016-186** (строка 186; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-AGENT-004 — Small helper model:** design plus synthetic RU/EN/TH response/latency smoke harness (`gateway/evals/run_local_model_benchmark.py`); Gateway Tests passed on PR #123 code head. Target-host quality/RAM/PSS/cold-warm benchmark and model selection remain pending. No general helper/subagent dispatch is wired into runtime. _(исходный статус: PARTIAL; строка 195)_
- [ ] **V016-187** **V016-187** (строка 187; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-IMAGE-001 — Image generation:** no working image-generation UI/runtime exists yet. Select local ComfyUI or explicit external provider, verify exact checkpoint/license/hash/VRAM and add request-to-image E2E before marking implemented. _(исходный статус: OPEN; строка 196)_
- [ ] **V016-188** **V016-188** (строка 188; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-OPS-001 — Free-first month:** no automatic paid resource provisioning. Use existing hardware and optional free-tier APIs with explicit quota/privacy caveats; paid hosting only after benchmark and owner decision. _(исходный статус: OPEN; строка 197)_
- [ ] **V016-189** **V016-189** (строка 189; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-MODEL-001 — Local-model autonomy:** no hidden application-level refusal filter is planned. Actual refusals remain checkpoint/provider-dependent; do not claim guaranteed zero refusals. _(исходный статус: OPEN; строка 198)_
- [ ] **V016-198** **V016-198** (строка 198; Supplement — legacy mobile and interface request, 2026-10-29): Native iPhone Safari, software keyboard, edge-swipe and touchcancel behavior remain unverified. Do not mark complete based only on Chromium. _(исходный статус: OPEN; строка 199)_
- [ ] **V016-206** **V016-206** (строка 206; Supplement — consolidated interface closure, 2026-10-30): Native iPhone Safari keyboard/safe-area/focus and real touch interaction remain unverified. Provider credentials, live gateway, connector OAuth/sync, independent agent processes and full audio transport remain infrastructure/runtime gates rather than UI acceptance claims. _(исходный статус: OPEN; строка 200)_
- [ ] **V016-213** **V016-213** (строка 213; Supplement — sidebar hierarchy and preference synchronization, 2026-10-30): Real iPhone Safari keyboard/touch/accessibility behavior remains unverified; Chromium tests cover DOM order, live status updates and cross-surface preference synchronization only. _(исходный статус: OPEN; строка 201)_
- [ ] **V016-218** **V016-218** (строка 218; Supplement — orthogonal chat settings, 2026-10-30): Exact-head tests must pass for Quick+Expanded, Thorough+Standard, Thorough+Off, RU/EN, per-chat persistence and Research Studio non-mutation before merge. _(исходный статус: OPEN; строка 202)_
- [ ] **V016-219** **V016-219** (строка 219; Supplement — orthogonal chat settings, 2026-10-30): Native iPhone Safari and live gateway/provider behavior remain unverified. _(исходный статус: OPEN; строка 203)_

### MASTER_TASK_REGISTRY_RU.md — LAUNCH — Общий backlog первого запуска
- [ ] **LAUNCH-110** **LAUNCH-110** (строка 110; Автоматические проверки на точном PR HEAD): Integrity: HTML structure, JS parse, immutable Action SHAs. _(исходный статус: OPEN; строка 209)_
- [ ] **LAUNCH-111** **LAUNCH-111** (строка 111; Автоматические проверки на точном PR HEAD): Security: no credentials, safe markdown, safe provider routing and tools. _(исходный статус: OPEN; строка 210)_
- [ ] **LAUNCH-112** **LAUNCH-112** (строка 112; Автоматические проверки на точном PR HEAD): Context: bounded memory/context/tool-loop behavior. _(исходный статус: OPEN; строка 211)_
- [ ] **LAUNCH-113** **LAUNCH-113** (строка 113; Автоматические проверки на точном PR HEAD): Jekyll build: root app and `/landing/` output. _(исходный статус: OPEN; строка 212)_
- [ ] **LAUNCH-114** **LAUNCH-114** (строка 114; Автоматические проверки на точном PR HEAD): Chromium E2E: chat, settings, project, Research Studio, provider state, export/import, landing. _(исходный статус: OPEN; строка 213)_
- [ ] **LAUNCH-115** **LAUNCH-115** (строка 115; Автоматические проверки на точном PR HEAD): Landing responsive sweep: 320, 360, 390, 768, 1024, 1440 CSS px; no horizontal overflow. _(исходный статус: OPEN; строка 214)_
- [ ] **LAUNCH-116** **LAUNCH-116** (строка 116; Автоматические проверки на точном PR HEAD): Landing SEO/link checks: `lang`, title, description, canonical, CTA and relative paths. _(исходный статус: OPEN; строка 215)_
- [ ] **LAUNCH-117** **LAUNCH-117** (строка 117; Автоматические проверки на точном PR HEAD): Reduced-motion behavior: ticker static when OS requests reduced motion; no fake progress. _(исходный статус: OPEN; строка 216)_
- [ ] **LAUNCH-118** **LAUNCH-118** (строка 118; Автоматические проверки на точном PR HEAD): Gateway contract/security tests on PRs that touch gateway. _(исходный статус: OPEN; строка 217)_
- [ ] **LAUNCH-119** **LAUNCH-119** (строка 119; Автоматические проверки на точном PR HEAD): Project State Freshness exact SHA + exact live queue. _(исходный статус: OPEN; строка 218)_
- [ ] **LAUNCH-120** **LAUNCH-120** (строка 120; Автоматические проверки на точном PR HEAD): License/provenance check. _(исходный статус: OPEN; строка 219)_
- [ ] **LAUNCH-121** **LAUNCH-121** (строка 121; Автоматические проверки на точном PR HEAD): Graphify is developer-only artifact; inspect quality and do not ship to runtime. _(исходный статус: OPEN; строка 220)_
- [ ] **LAUNCH-122** **LAUNCH-122** (строка 122; Автоматические проверки на точном PR HEAD): After merge: post-merge Pages deployment and actual published-site smoke. _(исходный статус: OPEN; строка 221)_
- [ ] **LAUNCH-126** **LAUNCH-126** (строка 126; Ручные/owner gates): Native iPhone Safari: keyboard, safe area, focus, VoiceOver, touch, rotation, 320–390 width. _(исходный статус: OPEN; строка 222)_
- [ ] **LAUNCH-127** **LAUNCH-127** (строка 127; Ручные/owner gates): GitHub branch rules and required checks inspected in repository settings. _(исходный статус: OPEN; строка 223)_
- [ ] **LAUNCH-128** **LAUNCH-128** (строка 128; Ручные/owner gates): VPS inventory before any installation or reconfiguration; do not replace existing services blindly. _(исходный статус: OPEN; строка 224)_
- [ ] **LAUNCH-129** **LAUNCH-129** (строка 129; Ручные/owner gates): Ollama model tag, digest, license, disk/RAM/PSS, cold/warm timings and concurrency=1 recorded. _(исходный статус: OPEN; строка 225)_
- [ ] **LAUNCH-130** **LAUNCH-130** (строка 130; Ручные/owner gates): Gateway service listens on loopback; Ollama private on loopback; external origin accessible only through intended HTTPS Tunnel. _(исходный статус: OPEN; строка 226)_
- [ ] **LAUNCH-131** **LAUNCH-131** (строка 131; Ручные/owner gates): Valid/invalid Bearer key, allowlisted model, completion, SSE, cache HIT/BYPASS, timeout and reboot tested. _(исходный статус: OPEN; строка 227)_
- [ ] **LAUNCH-132** **LAUNCH-132** (строка 132; Ручные/owner gates): No prompt, user file/media body, secret or private memory in logs/traces/artifacts by default. _(исходный статус: OPEN; строка 228)_
- [ ] **LAUNCH-133** **LAUNCH-133** (строка 133; Ручные/owner gates): Owner has confirmed whether the first deployment is personal/limited access; never imply public multi-user auth. _(исходный статус: OPEN; строка 229)_
- [ ] **LAUNCH-218** **LAUNCH-218** (строка 218; Порядок после PR #121/#122): Завершить visual screenshot-review, native iPhone Safari, keyboard/safe-area, VoiceOver и touch checks. _(исходный статус: OPEN; строка 231)_
- [ ] **LAUNCH-219** **LAUNCH-219** (строка 219; Порядок после PR #121/#122): Закрыть только оставшиеся polish/security/reliability задачи внутри текущего стека; не добавлять новые продуктовые функции в первый лендинг. _(исходный статус: OPEN; строка 232)_
- [ ] **LAUNCH-220** **LAUNCH-220** (строка 220; Порядок после PR #121/#122): Owner gates issue #111: main ruleset, VPS/Tunnel/Ollama, provider credentials, hardware/model benchmark, RAG corpus, voice/device, sandbox и OAuth. Закрывать только после фактического evidence. _(исходный статус: OPEN; строка 233)_
- [ ] **LAUNCH-221** **LAUNCH-221** (строка 221; Порядок после PR #121/#122): Будущие функции (voice expansion, helper registry, durable multi-agent runtime, Knowledge-to-Skill) оставить в отдельном post-landing backlog; не считать блокером публикации статического лендинга V1. _(исходный статус: OPEN; строка 234)_
- [ ] **LAUNCH-239** **LAUNCH-239** (строка 239; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-13. Editable speech-to-text:** запись с микрофона, локальная транскрипция, редактирование распознанного текста до отправки, RU/EN/TH quality tests. _(исходный статус: OPEN; строка 235)_
- [ ] **LAUNCH-240** **LAUNCH-240** (строка 240; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-14. Conversational voice assistant:** полноценный естественный turn-taking, streaming transcript/response, VAD, barge-in, cancellation, echo cancellation, transcript alignment. Текущий half-duplex prototype — только основа, не завершённая функция. _(исходный статус: OPEN; строка 236)_
- [ ] **LAUNCH-241** **LAUNCH-241** (строка 241; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-15. Read selected text aloud:** выделение произвольного фрагмента ответа/сообщения и озвучивание только выделенного содержимого. PR #152 closed non-merged on 2026-11-07; bounded speech queue + selected-text playback remain unimplemented/unaccepted. Revisit after PR #173 restores main Quality; adapt E2E to explicit aServi connect/provider isolation, verify cancellation/queue limits/device behavior and target-device RU/EN/TH acceptance before promotion. _(исходный статус: OPEN; строка 237)_
- [ ] **LAUNCH-242** **LAUNCH-242** (строка 242; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-16. Read one whole message aloud:** стабильный TTS для целого сообщения, voice choice, mini-player, pause/resume/stop, cleanup and stale-request protection. _(исходный статус: OPEN; строка 238)_
- [ ] **LAUNCH-243** **LAUNCH-243** (строка 243; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-17. Read multiple selected messages aloud:** multi-select messages, ordered playback queue, pause/resume/skip/stop, cancellation and queue state; no parallel Piper jobs. _(исходный статус: OPEN; строка 239)_
- [ ] **LAUNCH-244** **LAUNCH-244** (строка 244; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-18. First-release voice acceptance:** реальные microphone/speaker tests на целевых устройствах; RU/EN/TH; word error rate, first transcript latency, first audio latency, interruption latency, echo, CPU/GPU/RAM, model license and SHA-256. Без этого не обещать «почти человеческий» realtime. _(исходный статус: OPEN; строка 240)_
- [ ] **LAUNCH-247** **LAUNCH-247** (строка 247; P1 — small helper models, GPU inference and agent orchestration): **P1-10. Helper model registry:** специализированные роли (classification, extraction, rerank, summary, memory candidate, skill synthesis), exact model ID/digest/license, capability, context/token budget, timeout, concurrency and eval. _(исходный статус: OPEN; строка 241)_
- [ ] **LAUNCH-248** **LAUNCH-248** (строка 248; P1 — small helper models, GPU inference and agent orchestration): **P1-11. GPU inference profile:** Ollama GPU vs llama.cpp server benchmark; GPU-only inference mode must fail closed if no compatible GPU is detected. CPU still runs OS/API/orchestration; the requirement is no mandatory CPU model inference, not zero CPU usage for the whole host. _(исходный статус: OPEN; строка 242)_
- [ ] **LAUNCH-249** **LAUNCH-249** (строка 249; P1 — small helper models, GPU inference and agent orchestration): **P1-12. High-throughput optional serving:** evaluate vLLM only on compatible accelerator hardware and when continuous batching/throughput materially helps. It is not the default 8-GB/single-model deployment. _(исходный статус: OPEN; строка 243)_
- [ ] **LAUNCH-250** **LAUNCH-250** (строка 250; P1 — small helper models, GPU inference and agent orchestration): **P1-13. Multi-agent runtime:** bounded DAG/fan-out, queue/backpressure, per-agent scope/permissions, deadline, budget, cancellation propagation, idempotency, checkpoints, traces, retries and eval harness. Current four-stage research pipeline is not a swarm. _(исходный статус: OPEN; строка 244)_
- [ ] **LAUNCH-251** **LAUNCH-251** (строка 251; P1 — small helper models, GPU inference and agent orchestration): **P1-14. Mass-agent load test:** establish safe concurrency, VRAM admission, memory residency/eviction, fairness, queue limits and degraded-mode behavior before increasing agent count. _(исходный статус: OPEN; строка 245)_
- [ ] **LAUNCH-254** **LAUNCH-254** (строка 254; P1 — internal notebook / Knowledge-to-Skill): **P1-15. Knowledge-to-Skill pipeline:** authorized books, PDFs, office documents, websites and repo sources → bounded extraction → chapters/sections → source/page provenance → skill generation → injection/license scan → human review → versioned private skill. _(исходный статус: OPEN; строка 246)_
- [ ] **LAUNCH-255** **LAUNCH-255** (строка 255; P1 — internal notebook / Knowledge-to-Skill): **P1-16. Skill lifecycle:** schema validation, scope isolation (personal/project), diff, versioning, rollback, deletion/retention and import/export. _(исходный статус: OPEN; строка 247)_
- [ ] **LAUNCH-256** **LAUNCH-256** (строка 256; P1 — internal notebook / Knowledge-to-Skill): **P1-17. Safe ingestion:** MIME sniffing, archive/path traversal defense, XXE/bomb limits, parser timeout, temp cleanup, invisible Unicode scan, prompt injection scan and no automatic external provider fallback. _(исходный статус: OPEN; строка 248)_
- [ ] **LAUNCH-269** **LAUNCH-269** (строка 269; 8. Остаток landing/app polish из актуального main): Скриншоты и визуальная проверка landing на 320/360/390/768/1024/1440 px; hero, карточки, CTA, spacing, contrast, footer. _(исходный статус: OPEN; строка 249)_
- [ ] **LAUNCH-270** **LAUNCH-270** (строка 270; 8. Остаток landing/app polish из актуального main): Keyboard-only и screen-reader проверка трёх раскрываемых roadmap секций и pause controls. _(исходный статус: OPEN; строка 250)_
- [ ] **LAUNCH-272** **LAUNCH-272** (строка 272; 8. Остаток landing/app polish из актуального main): App screenshot pass desktop/mobile; typography, contrast, spacing, empty/error states, RU/EN, light/dark. _(исходный статус: OPEN; строка 252)_
- [ ] **LAUNCH-273** **LAUNCH-273** (строка 273; 8. Остаток landing/app polish из актуального main): Все composer popovers на краях viewport, коротком viewport, с клавиатурой и nested scroll. _(исходный статус: OPEN; строка 253)_
- [ ] **LAUNCH-274** **LAUNCH-274** (строка 274; 8. Остаток landing/app polish из актуального main): Dialog Escape/focus trap/return/scroll lock/background inert; sticky Settings actions. **Progress 2026-11-08 / PR #174:** Functions panel now receives focus on open, traps Tab/Shift+Tab, closes on Escape/backdrop and restores focus to its trigger; Settings and Functions backdrop dismissal have dedicated E2E coverage. Exact-head CI pending. Remaining: bring Settings/project/trace/message dialogs onto the same tested focus-return/trap contract, verify background inert + body scroll lock, and implement sticky Settings actions. _(исходный статус: PARTIAL; строка 254)_
- [ ] **LAUNCH-275** **LAUNCH-275** (строка 275; 8. Остаток landing/app polish из актуального main): Проверка дублирования chat import/export и project bundle actions. _(исходный статус: OPEN; строка 255)_
- [ ] **LAUNCH-276** **LAUNCH-276** (строка 276; 8. Остаток landing/app polish из актуального main): Long names, large lists, keyboard navigation, 44px touch targets. _(исходный статус: OPEN; строка 256)_
- [ ] **LAUNCH-277** **LAUNCH-277** (строка 277; 8. Остаток landing/app polish из актуального main): Functional menu отражает только реально зарегистрированные skills/agents/connectors and permissions. _(исходный статус: OPEN; строка 257)_
- [ ] **LAUNCH-279** **LAUNCH-279** (строка 279; 8. Остаток landing/app polish из актуального main): Keep Native Popover API/CSS Anchor Positioning progressive enhancement only; preserve JS fallback. _(исходный статус: OPEN; строка 259)_

### MASTER_TASK_REGISTRY_RU.md — V1 — Канонический чек-лист V1 UI
- [ ] **V1-047** **V1-047** (строка 47; 1. Общий UI/UX — [~]): Завершить проход по типографике, контрасту, spacing, пустым состояниям, ошибкам и вторичным действиям. _(исходный статус: PARTIAL; строка 265)_
- [ ] **V1-048** **V1-048** (строка 48; 1. Общий UI/UX — [~]): Пройти финальный визуальный screenshot-review desktop/mobile после всех изменений. _(исходный статус: OPEN; строка 266)_
- [ ] **V1-055** **V1-055** (строка 55; 2. Composer и мобильная клавиатура — [~]): Сохранена настраиваемая top/bottom позиция (PR #119/#121 track), но перепроверить её влияние на мобильные viewport и scroll. _(исходный статус: PARTIAL; строка 267)_
- [ ] **V1-056** **V1-056** (строка 56; 2. Composer и мобильная клавиатура — [~]): Нативно проверить iPhone Safari: клавиатура, safe-area, focus, долгий текст, свайпы от края, ориентация экрана. _(исходный статус: OPEN; строка 268)_
- [ ] **V1-063** **V1-063** (строка 63; 3. Маршруты aLandi и сторонних API — [~]): В PR #121 унаследованный внутренний alandi option остаётся скрытым для миграции/совместимости. Тест должен подтверждать, что он hidden и не попадает в optgroup сторонних API; нельзя требовать его полного отсутствия в HTML. **Актуализация 2026-11-08:** first-party route label/actions — aLandi aServi; `alandi` и `ai_alandi_cloud_*` remain internal compatibility identifiers. PR #169 merged provider isolation and hidden internal option; exact PR Quality passed. PR #171 closed non-merged; no silent fallback remains. Compatibility migration still requires acceptance. _(исходный статус: PARTIAL; строка 269)_
- [ ] **V1-064** **V1-064** (строка 64; 3. Маршруты aLandi и сторонних API — [~]): Проверить RU/EN labels, переключение и миграцию сохранённого маршрута на текущем head. **Progress:** PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`, adds explicit aServi connection action and provider isolation; exact PR Quality #42408172737 passed 113/113. Main Quality #42408500881 exposed two E2E failures; follow-up PR #173 code/test Quality #42408845013 passed 113/113 and Graphify #42408844985 passed. English-label and legacy saved-route migration acceptance remain open. _(исходный статус: OPEN; строка 270)_
- [ ] **V1-071** **V1-071** (строка 71; 4. Подписи, placeholder и inline validation — [~]): Завершить единый язык placeholder/error/help для внешних API, Cloudflare и Tavily; постоянный текст оставлять только там, где он несёт важную privacy/security информацию. _(исходный статус: PARTIAL; строка 271)_
- [ ] **V1-072** **V1-072** (строка 72; 4. Подписи, placeholder и inline validation — [~]): Проверить ошибки invalid URL, неверной модели, пустого ключа, CORS, HTTP 401/5xx и корректность redaction секретов. _(исходный статус: OPEN; строка 272)_
- [ ] **V1-080** **V1-080** (строка 80; 5. System prompt и случайное редактирование — [x]): В итоговом визуальном проходе подтвердить заметность pencil/edit, focus и возврат в readonly. _(исходный статус: OPEN; строка 273)_
- [ ] **V1-086** **V1-086** (строка 86; 6. Инструкции сторонних провайдеров — [~]): Удалить повторяющиеся provider explanations, но оставить короткие честные privacy notices там, где данные уходят внешнему оператору. _(исходный статус: PARTIAL; строка 274)_
- [ ] **V1-087** **V1-087** (строка 87; 6. Инструкции сторонних провайдеров — [~]): Сверить каждую ссылку/инструкцию с актуальным upstream, не выдумывать endpoint или модельный ID. _(исходный статус: OPEN; строка 275)_
- [ ] **V1-093** **V1-093** (строка 93; 7. Tools и Tavily — [~]): Автоматическая проверка/индикатор ключа должна быть подтверждена реальным вызовом, не только непустым полем. _(исходный статус: PARTIAL; строка 276)_
- [ ] **V1-094** **V1-094** (строка 94; 7. Tools и Tavily — [~]): Проверить paste, сохранение, удаление, неверный ключ, публичные fallback источники, privacy copy. _(исходный статус: OPEN; строка 277)_
- [ ] **V1-101** **V1-101** (строка 101; 8. Статус собственного gateway — [~]): В PR #121 убрана постоянная ручная кнопка проверки; поля/лампа должны отражать валидированное соединение. _(исходный статус: PARTIAL; строка 278)_
- [ ] **V1-102** **V1-102** (строка 102; 8. Статус собственного gateway — [~]): Проверить race/stale response, /healthz, model completion, timeout, CORS и очистку ключа на exact head. _(исходный статус: OPEN; строка 279)_
- [ ] **V1-110** **V1-110** (строка 110; 9. Окна и закреплённые действия — [~]): Проверить Escape, focus return, screen reader name, scroll lock и background interaction. _(исходный статус: OPEN; строка 280)_
- [ ] **V1-116** **V1-116** (строка 116; 10. Скроллинг и длинные чаты — [~]): Проверить потоковую генерацию, вложенные скроллы, длинные сообщения/вложения, чат-список и модальные окна. _(исходный статус: PARTIAL; строка 281)_
- [ ] **V1-117** **V1-117** (строка 117; 10. Скроллинг и длинные чаты — [~]): Проверить экран 320px, динамическую клавиатуру и scroll restoration на iOS Safari. _(исходный статус: OPEN; строка 282)_
- [ ] **V1-125** **V1-125** (строка 125; 11. Дополнительные настройки — [x]): Завершить аудит всех secondary controls на дубли/устаревшие toggle. _(исходный статус: OPEN; строка 283)_
- [ ] **V1-133** **V1-133** (строка 133; 12. Тема, язык, анимации — [~]): Проверить полную RU/EN копию, светлую тему модалок, статусов, подсказок и Roadmap. _(исходный статус: OPEN; строка 284)_
- [ ] **V1-139** **V1-139** (строка 139; 13. Каталог моделей и provider state — [~]): Проверить сохранение выбранной модели при refresh, invalid catalog, устаревший fingerprint, auth failure и provider switch. _(исходный статус: PARTIAL; строка 285)_
- [ ] **V1-140** **V1-140** (строка 140; 13. Каталог моделей и provider state — [~]): Live provider smoke остаётся опциональным и требует явного согласия; mock E2E не выдавать за доступность реального аккаунта. _(исходный статус: OPEN; строка 286)_
- [ ] **V1-147** **V1-147** (строка 147; 14. Project settings — [~]): В PR #121 E2E должен подтвердить modal close, persistence, создание и переключение проекта после текущих исправлений. _(исходный статус: PARTIAL; строка 287)_
- [ ] **V1-148** **V1-148** (строка 148; 14. Project settings — [~]): Реальный multi-device sync/source indexing не входит в V1; не изображать его включённым. _(исходный статус: OPEN; строка 288)_
- [ ] **V1-156** **V1-156** (строка 156; 15. Search & Research Studio — [~]): Исследовательский pipeline остаётся четырёхэтапным на одной модели; UI не называть независимой swarm-командой. _(исходный статус: OPEN; строка 291)_
- [ ] **V1-163** **V1-163** (строка 163; 16. Task profiles / skills — [~]): Проверить quiz flow, кастомный профиль, формат результата, переключение чата и сохранение. _(исходный статус: PARTIAL; строка 292)_
- [ ] **V1-164** **V1-164** (строка 164; 16. Task profiles / skills — [~]): Не показывать несуществующие навыки как доступные runtime-пакеты. _(исходный статус: OPEN; строка 293)_
- [ ] **V1-171** **V1-171** (строка 171; 17. Agents / team blueprint — [~]): Внутри соответствующей открытой панели добавлен декоративный маркер 1nv3nt10n 1n PrOc3ss… с пояснением, что это не runtime/фоновой статус. _(исходный статус: PARTIAL; строка 294)_
- [ ] **V1-172** **V1-172** (строка 172; 17. Agents / team blueprint — [~]): Независимые роли, scheduler, policy engine, sandbox, approval и durable recovery — будущая реализация с отдельными tests/evals; не входят в V1. _(исходный статус: OPEN; строка 295)_
- [ ] **V1-178** **V1-178** (строка 178; 18. Финальный release gate — [~]): PR #121 был красным: duplicate settings close selectors, invalid regex in integrity sentinel и один неверный assertion around settings probe. Исправления внесены; повторный exact-head CI нужен. _(исходный статус: PARTIAL; строка 296)_
- [ ] **V1-179** **V1-179** (строка 179; 18. Финальный release gate — [~]): Проверить точный merge SHA, post-merge Pages deploy, опубликованный лендинг и приложение. _(исходный статус: OPEN; строка 297)_
- [ ] **V1-180** **V1-180** (строка 180; 18. Финальный release gate — [~]): Выполнить native iPhone Safari/keyboard/touch test вручную. _(исходный статус: OPEN; строка 298)_
- [ ] **V1-181** **V1-181** (строка 181; 18. Финальный release gate — [~]): Пересверить PR/Issues. Issue #111 остаётся открытым до реальных owner-only gates (ruleset/main governance, VPS, hardware/model, voice/device, licensed data corpus); не закрывать только ради нулевой очереди. _(исходный статус: OPEN; строка 299)_
- [ ] **V1-191** **V1-191** (строка 191; 2. Лендинг — обязательная структура V1): Усилить copy: «бесплатный статический интерфейс» не означает «бесплатный inference», hosted AI endpoint не предоставляется. _(исходный статус: PARTIAL; строка 300)_
- [ ] **V1-192** **V1-192** (строка 192; 2. Лендинг — обязательная структура V1): Добавить открываемый Roadmap с маркером 1nv3nt10n 1n PrOc3ss… только у направлений, которые ещё разрабатываются/планируются. _(исходный статус: PARTIAL; строка 301)_
- [ ] **V1-193** **V1-193** (строка 193; 2. Лендинг — обязательная структура V1): Browser E2E на структуру/CTA, метаданные, отсутствие пустых ссылок, responsive 320/360/390/768/1024/1440px, Roadmap details и reduced-motion есть; добавлен тест pause/resume ticker (commit b213c8a); ожидается exact-head Chromium run. _(исходный статус: PARTIAL; строка 302)_
- [ ] **V1-194** **V1-194** (строка 194; 2. Лендинг — обязательная структура V1): E2E проверяет lang/title/description/canonical/CTA/непустые ссылки; Jekyll build проходит в текущем CI; фактический published Pages path требует успешного exact-head smoke после merge. _(исходный статус: PARTIAL; строка 303)_

### MASTER_TASK_REGISTRY_RU.md — UX — Полировка лендинга
- [ ] **UX-016** **UX-016** (строка 16; Landing / публичная страница): Screenshot review 320/360/390/768/1024/1440 px: hero balance, card rhythm, line lengths, section spacing, contrast, footer and CTA. _(исходный статус: OPEN; строка 309)_
- [ ] **UX-017** **UX-017** (строка 17; Landing / публичная страница): Проверить keyboard-only и screen reader чтение всех трёх раскрываемых roadmap пунктов и pause controls. _(исходный статус: OPEN; строка 310)_
- [ ] **UX-018** **UX-018** (строка 18; Landing / публичная страница): Проверить опубликованный Pages, а не только PR preview/Jekyll build; ссылки и canonical после merge. _(исходный статус: OPEN; строка 311)_
- [ ] **UX-019** **UX-019** (строка 19; Landing / публичная страница): Проверить светлую/тёмную тему? Landing сейчас намеренно самостоятельная тёмная публичная страница; не добавлять переключатель без требования и цельного дизайна. _(исходный статус: OPEN; строка 312)_
- [ ] **UX-023** **UX-023** (строка 23; Корневое приложение — визуальная иерархия): Общий screenshot review desktop/mobile после последнего PR #121. _(исходный статус: PARTIAL; строка 313)_
- [ ] **UX-024** **UX-024** (строка 24; Корневое приложение — визуальная иерархия): Единый проход по typography, contrast, spacing, empty states, inline errors и secondary actions. _(исходный статус: OPEN; строка 314)_
- [ ] **UX-025** **UX-025** (строка 25; Корневое приложение — визуальная иерархия): Полная RU/EN проверка микротекстов, подсказок, статусов, светлой темы модалок и пустых состояний. _(исходный статус: OPEN; строка 315)_
- [ ] **UX-026** **UX-026** (строка 26; Корневое приложение — визуальная иерархия): Проверить pencil/edit state у system prompt и возврат в readonly. _(исходный статус: OPEN; строка 316)_
- [ ] **UX-027** **UX-027** (строка 27; Корневое приложение — визуальная иерархия): Проверить touch targets (проектная цель 44×44 CSS px) и отсутствие конкурирующих controls. _(исходный статус: OPEN; строка 317)_
- [ ] **UX-031** **UX-031** (строка 31; Popovers, menus, dialogs): Проверить все composer popovers у четырёх краёв viewport, короткую высоту, экранную клавиатуру и nested scroll. _(исходный статус: PARTIAL; строка 318)_
- [ ] **UX-032** **UX-032** (строка 32; Popovers, menus, dialogs): Проверить Escape, focus trap/return, accessible names, scroll lock и background inert для всех modal/dialog. _(исходный статус: OPEN; строка 319)_
- [ ] **UX-033** **UX-033** (строка 33; Popovers, menus, dialogs): Sticky Save/Close в Settings при длинном scroll и мобильной клавиатуре — проверить, исправить только при воспроизводимом дефекте. _(исходный статус: OPEN; строка 320)_
- [ ] **UX-034** **UX-034** (строка 34; Popovers, menus, dialogs): Native Popover API / CSS Anchor Positioning рассматривать только как progressive enhancement после support matrix; сохранить существующий JS fallback. Не мигрировать ради моды. _(исходный статус: OPEN; строка 321)_
- [ ] **UX-039** **UX-039** (строка 39; Sidebar, проекты, чаты): Проверить, что общий импорт/экспорт не дублируется в sidebar и project settings; chat actions остаются в chat menu, project bundle — в project settings. _(исходный статус: PARTIAL; строка 322)_
- [ ] **UX-040** **UX-040** (строка 40; Sidebar, проекты, чаты): CORE IMPLEMENTED / VERIFIED на exact main `bc6cee08c3d28fec3a6ac4d61019d958f92ba779`: выбранный проект фильтрует `#chatList`, Back возвращает общий список, persistent New Chat создаёт чат с выбранным `projectId`, навигационный фильтр не меняет активный чат/его принадлежность. Exact Quality #43998698846: 140 built-app Chromium + 1 published-site Chromium passed; Graphify #43998698805 и Pages #43998698607 passed, опубликованный revision exact. Проверены RU/EN project/personal header scope labels и 390px no-overflow/long project name. **PARTIAL** до проверки длинных/пустых/больших списков, keyboard navigation, scroll restoration и native iPhone Safari. _(исходный статус: OPEN; строка 323)_
- [ ] **UX-044** **UX-044** (строка 44; Research / functions / agents): The broad registered-capability/status/permission contract and connector registry remain unimplemented; the owner-directed three-entry Functions subset is delivered in PR #169 (exact PR Quality passed). No fake marketplace. _(исходный статус: OPEN; строка 324)_
- [ ] **UX-045** **UX-045** (строка 45; Research / functions / agents): Развести семантику web search breadth, offline mode и multi-agent orchestration в copy и UI. _(исходный статус: OPEN; строка 325)_
- [ ] **UX-046** **UX-046** (строка 46; Research / functions / agents): В roadmap/agent panels сохранять чёткое различие между blueprint, sequential pipeline и независимым agent runtime. _(исходный статус: OPEN; строка 326)_
- [ ] **UX-049** **UX-049** (строка 49; Мобильность и доступность): Chromium responsive matrix 320/360/390/768/1024/1440 и no-overflow tests. _(исходный статус: PARTIAL; строка 327)_
- [ ] **UX-050** **UX-050** (строка 50; Мобильность и доступность): Native iPhone Safari: visual viewport, клавиатура, safe-area, edge swipe, touchcancel, rotation, scroll restoration. _(исходный статус: OPEN; строка 328)_
- [ ] **UX-051** **UX-051** (строка 51; Мобильность и доступность): VoiceOver: headings, dialogs, menus, status text, message actions, focus visibility. _(исходный статус: OPEN; строка 329)_
- [ ] **UX-052** **UX-052** (строка 52; Мобильность и доступность): Reduced motion: landing ticker, app ticker, transitions and scroll behavior; проверить пользовательскую настройку вместе с OS preference. _(исходный статус: OPEN; строка 330)_
- [ ] **UX-068** **UX-068** (строка 68; 3. Реализованный первый polish patch): Native keyboard/screen-reader confirmation. _(исходный статус: OPEN; строка 331)_

### MASTER_TASK_REGISTRY_RU.md — STACK — Сквозной аудит целостности стека
- [ ] **STACK-031** **STACK-031** (строка 31; A. Снимок и архитектурная карта): A3. Сверить все принятые решения (DECISIONS/ADRs/PROJECT_STATE) с реализованными модулями и флагами. _(исходный статус: OPEN; строка 337)_
- [ ] **STACK-032** **STACK-032** (строка 32; A. Снимок и архитектурная карта): A4. Построить карту модулей, входов/выходов, владельцев данных и межслойных контрактов. _(исходный статус: OPEN; строка 338)_
- [ ] **STACK-033** **STACK-033** (строка 33; A. Снимок и архитектурная карта): A5. Проверить циклы, дублирующие реализации, orphan modules, скрытые/неиспользуемые пути. _(исходный статус: OPEN; строка 339)_
- [ ] **STACK-036** **STACK-036** (строка 36; B. Сквозные взаимодействия): B1. Browser UI → request construction → provider/router → gateway → model/tool → response rendering. _(исходный статус: OPEN; строка 340)_
- [ ] **STACK-037** **STACK-037** (строка 37; B. Сквозные взаимодействия): B2. Identity/session/auth → scopes/permissions → memory/RAG → persistence/deletion. _(исходный статус: OPEN; строка 341)_
- [ ] **STACK-038** **STACK-038** (строка 38; B. Сквозные взаимодействия): B3. Search/research/evidence → citations/provenance → UI state and failure handling. _(исходный статус: OPEN; строка 342)_
- [ ] **STACK-039** **STACK-039** (строка 39; B. Сквозные взаимодействия): B4. Agents/ToolDAG/helper model → budgets, deadlines, cancellation, retries, approvals, idempotency. _(исходный статус: OPEN; строка 343)_
- [ ] **STACK-040** **STACK-040** (строка 40; B. Сквозные взаимодействия): B5. Voice/ASR/TTS/document extraction → child processes, resource bounds, cancellation, cleanup. _(исходный статус: OPEN; строка 344)_
- [ ] **STACK-041** **STACK-041** (строка 41; B. Сквозные взаимодействия): B6. Config/env/feature flags → startup/readiness/liveness → deploy and rollback. _(исходный статус: OPEN; строка 345)_
- [ ] **STACK-042** **STACK-042** (строка 42; B. Сквозные взаимодействия): B7. Browser storage ↔ server persistence, import/export, cross-project/private/shared boundaries. _(исходный статус: OPEN; строка 346)_
- [ ] **STACK-045** **STACK-045** (строка 45; C. Качество и безопасность): C1. Static analysis: Python typing/lint/security; JS syntax/lint/security; shell/YAML/config validation. _(исходный статус: OPEN; строка 347)_
- [ ] **STACK-046** **STACK-046** (строка 46; C. Качество и безопасность): C2. Dependency and supply-chain audit: direct/transitive dependencies, immutable action pins, licenses/provenance. _(исходный статус: OPEN; строка 348)_
- [ ] **STACK-047** **STACK-047** (строка 47; C. Качество и безопасность): C3. Security review: auth, CORS, SSRF, XML/ZIP parsing, path traversal, secrets/logging, prompt/tool injection. _(исходный статус: OPEN; строка 349)_
- [ ] **STACK-048** **STACK-048** (строка 48; C. Качество и безопасность): C4. Reliability: timeouts, cancellation, backpressure, concurrency, retries, partial failure, state recovery. _(исходный статус: OPEN; строка 350)_
- [ ] **STACK-049** **STACK-049** (строка 49; C. Качество и безопасность): C5. Performance/resource: payload sizes, browser work, DB indexes/queries, model memory/latency, process lifecycle. _(исходный статус: OPEN; строка 351)_
- [ ] **STACK-050** **STACK-050** (строка 50; C. Качество и безопасность): C6. Accessibility/i18n/responsive and degraded/offline/error states. _(исходный статус: OPEN; строка 352)_
- [ ] **STACK-051** **STACK-051** (строка 51; C. Качество и безопасность): C7. Test quality: coverage of boundaries and failure paths; detect duplicate, brittle or vacuous assertions. _(исходный статус: OPEN; строка 353)_
- [ ] **STACK-052** **STACK-052** (строка 52; C. Качество и безопасность): C8. Re-run all relevant exact-head checks after any accepted change. _(исходный статус: OPEN; строка 354)_
- [ ] **STACK-055** **STACK-055** (строка 55; D. Независимый второй взгляд и решение): D1. Подготовить независимому субагенту полный стек, решения, invariants, audit questions and output format. _(исходный статус: OPEN; строка 355)_
- [ ] **STACK-056** **STACK-056** (строка 56; D. Независимый второй взгляд и решение): D2. Получить реальный независимый review (если host предоставляет субагента); иначе честно зафиксировать отсутствие отдельного агента. _(исходный статус: OPEN; строка 356)_
- [ ] **STACK-057** **STACK-057** (строка 57; D. Независимый второй взгляд и решение): D3. Сопоставить рекомендации с локальными решениями и воспроизводимыми доказательствами. _(исходный статус: OPEN; строка 357)_
- [ ] **STACK-058** **STACK-058** (строка 58; D. Независимый второй взгляд и решение): D4. Отобрать только улучшения с измеримой пользой и без расширения стека. _(исходный статус: OPEN; строка 358)_
- [ ] **STACK-059** **STACK-059** (строка 59; D. Независимый второй взгляд и решение): D5. Внести минимальные обратимые исправления отдельными slices/PR. _(исходный статус: OPEN; строка 359)_
- [ ] **STACK-060** **STACK-060** (строка 60; D. Независимый второй взгляд и решение): D6. Обновить ориентиры, project state, decision/eval records и volley log после каждого подтверждённого этапа. _(исходный статус: OPEN; строка 360)_

### MASTER_TASK_REGISTRY_RU.md — START — `docs/START_HERE_RU.md`
- [ ] **START-054** **START-054** (строка 54; `docs/START_HERE_RU.md`): Pages deployment успешен, сайт открывается. _(исходный статус: OPEN; строка 371)_
- [ ] **START-055** **START-055** (строка 55; `docs/START_HERE_RU.md`): VPS: Ollama и gateway активны. _(исходный статус: OPEN; строка 372)_
- [ ] **START-056** **START-056** (строка 56; `docs/START_HERE_RU.md`): Gateway доступен только через Tunnel; публичные порты 8000/11434 закрыты. _(исходный статус: OPEN; строка 373)_
- [ ] **START-057** **START-057** (строка 57; `docs/START_HERE_RU.md`): HTTPS hostname отвечает; неправильный API key получает 401. _(исходный статус: OPEN; строка 374)_
- [ ] **START-058** **START-058** (строка 58; `docs/START_HERE_RU.md`): Из чата проходит реальный completion через gateway. _(исходный статус: OPEN; строка 375)_
- [ ] **START-059** **START-059** (строка 59; `docs/START_HERE_RU.md`): Cache MISS → повтор HIT; bypass действительно обходит cache. _(исходный статус: OPEN; строка 376)_
- [ ] **START-060** **START-060** (строка 60; `docs/START_HERE_RU.md`): После перезагрузки VPS gateway и Tunnel запускаются автоматически. _(исходный статус: OPEN; строка 377)_
- [ ] **START-061** **START-061** (строка 61; `docs/START_HERE_RU.md`): Сохранены backup env/config и инструкции rollback (сам секрет — отдельно и защищённо). _(исходный статус: OPEN; строка 378)_

### MASTER_TASK_REGISTRY_RU.md — PRIVACY — `docs/LAUNCH_PRIVACY_REVIEW_RU.md`
- [ ] **PRIVACY-025** **PRIVACY-025** (строка 25; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Оператор: физическое лицо или юридическое лицо, публичное имя/бренд и юридический адрес, если применимо. _(исходный статус: OPEN; строка 385)_
- [ ] **PRIVACY-026** **PRIVACY-026** (строка 26; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Контакт для запросов на доступ/удаление и вопросов приватности (лучше отдельный адрес поддержки; не выдумывать адрес до его создания). _(исходный статус: OPEN; строка 386)_
- [ ] **PRIVACY-027** **PRIVACY-027** (строка 27; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): География оператора, хостинга, предполагаемых пользователей и целевые страны запуска. _(исходный статус: OPEN; строка 387)_
- [ ] **PRIVACY-028** **PRIVACY-028** (строка 28; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Целевая аудитория и минимальный возраст, если применимо. _(исходный статус: OPEN; строка 388)_
- [ ] **PRIVACY-029** **PRIVACY-029** (строка 29; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Будет ли это личный интерфейс одного владельца, ограниченная beta по приглашениям или публичный многопользовательский продукт. _(исходный статус: OPEN; строка 389)_
- [ ] **PRIVACY-030** **PRIVACY-030** (строка 30; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Реальная схема входа и авторизации: сейчас отдельная multi-user auth система не подтверждена. _(исходный статус: OPEN; строка 390)_
- [ ] **PRIVACY-031** **PRIVACY-031** (строка 31; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Точные домены, hosting providers, Tunnel mode/plan и фактически подключённые внешние AI/search providers. _(исходный статус: OPEN; строка 391)_
- [ ] **PRIVACY-032** **PRIVACY-032** (строка 32; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Какие данные собираются: чаты, выбранный контекст, проекты/инструкции, вложения, provider settings, browser storage, server-side cache, diagnostic logs, billing/support messages. _(исходный статус: OPEN; строка 392)_
- [ ] **PRIVACY-033** **PRIVACY-033** (строка 33; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Retention по каждой категории: browser data, server cache, logs, temporary files, backup copies. Если срок неизвестен, сначала измерить/проверить, а не угадывать. _(исходный статус: OPEN; строка 393)_
- [ ] **PRIVACY-034** **PRIVACY-034** (строка 34; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Реальная политика удаления и экспорта: что удаляется сразу, что остаётся в резервных копиях и когда копии ротируются. _(исходный статус: OPEN; строка 394)_
- [ ] **PRIVACY-035** **PRIVACY-035** (строка 35; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Фактическая обработка Cloudflare/GitHub Pages/VPS и внешнего провайдера: metadata/access logs, location/jurisdiction, applicable terms. _(исходный статус: OPEN; строка 395)_
- [ ] **PRIVACY-036** **PRIVACY-036** (строка 36; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Используются ли analytics, cookies beyond essential browser storage, tracking pixels, telemetry или third-party frontend assets. _(исходный статус: OPEN; строка 396)_
- [ ] **PRIVACY-037** **PRIVACY-037** (строка 37; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Как обрабатываются запросы об удалении, security incident, credential compromise и закрытии аккаунта, если появится account system. _(исходный статус: OPEN; строка 397)_
- [ ] **PRIVACY-038** **PRIVACY-038** (строка 38; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Кто отвечает за support и стоимость вычислений; есть ли автоматические биллинговые ограничения/quotas. _(исходный статус: OPEN; строка 398)_

### MASTER_TASK_REGISTRY_RU.md — PRELAUNCH — `docs/PRE_LAUNCH_STACK_RU.md`
- [ ] **PRELAUNCH-070** **PRELAUNCH-070** (строка 70; `docs/PRE_LAUNCH_STACK_RU.md`): Есть доступ к имеющемуся VPS либо подтверждена итоговая цена нового. _(исходный статус: OPEN; строка 405)_
- [ ] **PRELAUNCH-071** **PRELAUNCH-071** (строка 71; `docs/PRE_LAUNCH_STACK_RU.md`): ОС/архитектура совместимы с выбранным runbook. _(исходный статус: OPEN; строка 406)_
- [ ] **PRELAUNCH-072** **PRELAUNCH-072** (строка 72; `docs/PRE_LAUNCH_STACK_RU.md`): Достаточно RAM/диска после учёта уже работающих сервисов и модели. _(исходный статус: OPEN; строка 407)_
- [ ] **PRELAUNCH-073** **PRELAUNCH-073** (строка 73; `docs/PRE_LAUNCH_STACK_RU.md`): Известно, кто имеет SSH/root access и как восстановиться при неудачном обновлении. _(исходный статус: OPEN; строка 408)_
- [ ] **PRELAUNCH-074** **PRELAUNCH-074** (строка 74; `docs/PRE_LAUNCH_STACK_RU.md`): Домен, DNS и план ежемесячных затрат понятны. _(исходный статус: OPEN; строка 409)_
- [ ] **PRELAUNCH-075** **PRELAUNCH-075** (строка 75; `docs/PRE_LAUNCH_STACK_RU.md`): Никакие существующие сервисы не будут удалены/перенастроены без инвентаризации. _(исходный статус: OPEN; строка 410)_
- [ ] **PRELAUNCH-108** **PRELAUNCH-108** (строка 108; `docs/PRE_LAUNCH_STACK_RU.md`): /livez возвращает HTTP 200 без обращения к Ollama. _(исходный статус: OPEN; строка 411)_
- [ ] **PRELAUNCH-109** **PRELAUNCH-109** (строка 109; `docs/PRE_LAUNCH_STACK_RU.md`): /readyz возвращает HTTP 200 при доступной Ollama; `/healthz` — совместимый alias `/readyz`. _(исходный статус: OPEN; строка 412)_
- [ ] **PRELAUNCH-110** **PRELAUNCH-110** (строка 110; `docs/PRE_LAUNCH_STACK_RU.md`): Неавторизованный /v1/models возвращает HTTP 401. _(исходный статус: OPEN; строка 413)_
- [ ] **PRELAUNCH-111** **PRELAUNCH-111** (строка 111; `docs/PRE_LAUNCH_STACK_RU.md`): Авторизованный /v1/models показывает только разрешённую модель. _(исходный статус: OPEN; строка 414)_
- [ ] **PRELAUNCH-112** **PRELAUNCH-112** (строка 112; `docs/PRE_LAUNCH_STACK_RU.md`): Небольшой completion завершается и возвращает модельный ответ. _(исходный статус: OPEN; строка 415)_
- [ ] **PRELAUNCH-113** **PRELAUNCH-113** (строка 113; `docs/PRE_LAUNCH_STACK_RU.md`): Повтор exact-запроса даёт ожидаемый cache HIT, а cache bypass действительно работает. _(исходный статус: OPEN; строка 416)_
- [ ] **PRELAUNCH-114** **PRELAUNCH-114** (строка 114; `docs/PRE_LAUNCH_STACK_RU.md`): Порты 8000 и 11434 слушают только loopback. _(исходный статус: OPEN; строка 417)_
- [ ] **PRELAUNCH-115** **PRELAUNCH-115** (строка 115; `docs/PRE_LAUNCH_STACK_RU.md`): В логах нет API ключа, пользовательского prompt, приватного документа или сырого аудио. _(исходный статус: OPEN; строка 418)_
- [ ] **PRELAUNCH-116** **PRELAUNCH-116** (строка 116; `docs/PRE_LAUNCH_STACK_RU.md`): Права env/config соответствуют инструкции; service перезапускается без ручного shell state. _(исходный статус: OPEN; строка 419)_
- [ ] **PRELAUNCH-138** **PRELAUNCH-138** (строка 138; `docs/PRE_LAUNCH_STACK_RU.md`): Перезапусти gateway и Ollama, проверь health/capabilities после рестарта. _(исходный статус: OPEN; строка 420)_
- [ ] **PRELAUNCH-139** **PRELAUNCH-139** (строка 139; `docs/PRE_LAUNCH_STACK_RU.md`): Перезагрузи VPS в согласованное окно и подтверди автозапуск сервисов/Tunnel. _(исходный статус: OPEN; строка 421)_
- [ ] **PRELAUNCH-140** **PRELAUNCH-140** (строка 140; `docs/PRE_LAUNCH_STACK_RU.md`): Сделай backup конфигураций и необходимой SQLite data; секреты хранить отдельным защищённым способом. _(исходный статус: OPEN; строка 422)_
- [ ] **PRELAUNCH-141** **PRELAUNCH-141** (строка 141; `docs/PRE_LAUNCH_STACK_RU.md`): Проверь restore на безопасной копии, прежде чем считать backup рабочим. _(исходный статус: OPEN; строка 423)_
- [ ] **PRELAUNCH-142** **PRELAUNCH-142** (строка 142; `docs/PRE_LAUNCH_STACK_RU.md`): Подготовь rollback: отключить hostname/tunnel route; вернуть предыдущий env/config; восстановить known-good commit/service unit; проверить health. Не удалять данные, volumes и старые сервисы ради чистоты. _(исходный статус: OPEN; строка 424)_
- [ ] **PRELAUNCH-157** **PRELAUNCH-157** (строка 157; `docs/PRE_LAUNCH_STACK_RU.md`): Все выбранные PR проверены по актуальному HEAD и нужным required checks; после merge повторно проверены main Quality и Pages deployment. _(исходный статус: OPEN; строка 425)_
- [ ] **PRELAUNCH-158** **PRELAUNCH-158** (строка 158; `docs/PRE_LAUNCH_STACK_RU.md`): Лендинг не обещает работающий hosted endpoint, автоматическую синхронизацию, включённый voice/OCR или multi-user SaaS, если это не подтверждено. _(исходный статус: OPEN; строка 426)_
- [ ] **PRELAUNCH-159** **PRELAUNCH-159** (строка 159; `docs/PRE_LAUNCH_STACK_RU.md`): Проверены mobile layout, клавиатура/viewport, навигация, доступность клавиатурой и отсутствие внешних обязательных JS-зависимостей на лендинге. _(исходный статус: OPEN; строка 427)_
- [ ] **PRELAUNCH-160** **PRELAUNCH-160** (строка 160; `docs/PRE_LAUNCH_STACK_RU.md`): Все ссылки и инструкции ведут к актуальным путям; нет несуществующих contact/support обещаний. _(исходный статус: OPEN; строка 428)_
- [ ] **PRELAUNCH-163** **PRELAUNCH-163** (строка 163; `docs/PRE_LAUNCH_STACK_RU.md`): API работает за HTTPS Tunnel; origin ports закрыты; auth/CORS/allowlist/limits проверены. _(исходный статус: OPEN; строка 429)_
- [ ] **PRELAUNCH-164** **PRELAUNCH-164** (строка 164; `docs/PRE_LAUNCH_STACK_RU.md`): Модель не превышает заданный RAM/latency budget под тестом; restart and reboot проверены. _(исходный статус: OPEN; строка 430)_
- [ ] **PRELAUNCH-165** **PRELAUNCH-165** (строка 165; `docs/PRE_LAUNCH_STACK_RU.md`): Секреты не попали в git/history/logs/artifacts. _(исходный статус: OPEN; строка 431)_
- [ ] **PRELAUNCH-166** **PRELAUNCH-166** (строка 166; `docs/PRE_LAUNCH_STACK_RU.md`): Backup восстановлен в тестовой копии; rollback известен. _(исходный статус: OPEN; строка 432)_
- [ ] **PRELAUNCH-167** **PRELAUNCH-167** (строка 167; `docs/PRE_LAUNCH_STACK_RU.md`): Есть владелец расходов, мониторинг диска/RAM и расписание обновлений. _(исходный статус: OPEN; строка 433)_
- [ ] **PRELAUNCH-170** **PRELAUNCH-170** (строка 170; `docs/PRE_LAUNCH_STACK_RU.md`): Определён закрытый круг первых пользователей и путь обратной связи. _(исходный статус: OPEN; строка 434)_
- [ ] **PRELAUNCH-171** **PRELAUNCH-171** (строка 171; `docs/PRE_LAUNCH_STACK_RU.md`): На лендинге раскрыты ограничения и зависимость от пользовательского gateway. _(исходный статус: OPEN; строка 435)_
- [ ] **PRELAUNCH-172** **PRELAUNCH-172** (строка 172; `docs/PRE_LAUNCH_STACK_RU.md`): Подготовлены Terms/Privacy policy только под фактические data flows; не писать «данные никогда не покидают устройство», если может быть выбран внешний provider. _(исходный статус: OPEN; строка 436)_
- [ ] **PRELAUNCH-173** **PRELAUNCH-173** (строка 173; `docs/PRE_LAUNCH_STACK_RU.md`): Для открытого multi-user доступа отдельно спроектированы auth/session, tenant isolation, quotas, abuse controls, cost controls и retention/deletion. До этого не выдавать личный beta за публичный SaaS. _(исходный статус: OPEN; строка 437)_

### MASTER_TASK_REGISTRY_RU.md — VOICEAUDIT — `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`
- [ ] **VOICEAUDIT-031** **VOICEAUDIT-031** (строка 31; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): `GET /v1/capabilities` отражает только реально включённые функции. _(исходный статус: OPEN; строка 444)_
- [ ] **VOICEAUDIT-032** **VOICEAUDIT-032** (строка 32; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Неавторизованные запросы получают 401; тело, длительность и время выполнения ограничены. _(исходный статус: OPEN; строка 445)_
- [ ] **VOICEAUDIT-033** **VOICEAUDIT-033** (строка 33; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Конкурентные ASR/TTS задачи не копятся бесконечной очередью; корректно возвращается 429. _(исходный статус: OPEN; строка 446)_
- [ ] **VOICEAUDIT-034** **VOICEAUDIT-034** (строка 34; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Временные аудиофайлы удаляются при успехе и ошибке; сырой звук не пишется в логи и долговременную память. _(исходный статус: OPEN; строка 447)_
- [ ] **VOICEAUDIT-035** **VOICEAUDIT-035** (строка 35; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверены лицензии и SHA-256 бинарника/моделей/голоса; runtime пути задаются оператором, ничего не скачивается автоматически. _(исходный статус: OPEN; строка 448)_
- [ ] **VOICEAUDIT-038** **VOICEAUDIT-038** (строка 38; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Установлены совместимые `whisper.cpp`, `ffprobe` и локальная ASR-модель. _(исходный статус: OPEN; строка 449)_
- [ ] **VOICEAUDIT-039** **VOICEAUDIT-039** (строка 39; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): На целевом устройстве браузер действительно получает микрофонное разрешение, записывает поддерживаемый MIME/кодек и корректно останавливает треки. _(исходный статус: OPEN; строка 450)_
- [ ] **VOICEAUDIT-040** **VOICEAUDIT-040** (строка 40; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Русская, английская и тайская короткие записи проходят через настоящий endpoint; ошибки формата/пустой записи объясняются пользователю. _(исходный статус: OPEN; строка 451)_
- [ ] **VOICEAUDIT-041** **VOICEAUDIT-041** (строка 41; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Транскрипт вставляется в composer и остаётся редактируемым; автоматической отправки нет. _(исходный статус: OPEN; строка 452)_
- [ ] **VOICEAUDIT-042** **VOICEAUDIT-042** (строка 42; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Измерены время до первой расшифровки, длительность аудио, пиковая RAM и точность на фиксированном небольшом тестовом наборе. _(исходный статус: OPEN; строка 453)_
- [ ] **VOICEAUDIT-045** **VOICEAUDIT-045** (строка 45; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Установлены совместимые Piper runtime и voice model с проверенной лицензией. _(исходный статус: OPEN; строка 454)_
- [ ] **VOICEAUDIT-046** **VOICEAUDIT-046** (строка 46; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Несколько ответов на русском/английском синтезируются в валидный WAV и воспроизводятся на целевом iPhone/браузере. _(исходный статус: OPEN; строка 455)_
- [ ] **VOICEAUDIT-047** **VOICEAUDIT-047** (строка 47; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Stop отменяет запрос и воспроизведение; повторное нажатие не запускает дубликат. _(исходный статус: OPEN; строка 456)_
- [ ] **VOICEAUDIT-048** **VOICEAUDIT-048** (строка 48; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Измерены latency, длительность генерации, размер WAV и RAM. _(исходный статус: OPEN; строка 457)_
- [ ] **VOICEAUDIT-049** **VOICEAUDIT-049** (строка 49; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Синтез отключён при недоступном runtime, без имитации успешного ответа. _(исходный статус: OPEN; строка 458)_
- [ ] **VOICEAUDIT-052** **VOICEAUDIT-052** (строка 52; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Кодовый half-duplex цикл и mock E2E существуют (PR #60); реальная последовательность запись → ASR → редактируемый текст → запрос → TTS → воспроизведение → следующий ход на целевом устройстве не проверена. _(исходный статус: PARTIAL; строка 459)_
- [ ] **VOICEAUDIT-053** **VOICEAUDIT-053** (строка 53; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Нет автоматической отправки до подтверждённого состояния, если режим явно не настроен на это. _(исходный статус: OPEN; строка 460)_
- [ ] **VOICEAUDIT-054** **VOICEAUDIT-054** (строка 54; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Ошибка на любом этапе оставляет пользователя в восстанавливаемом состоянии; нет скрытой повторной записи или позднего воспроизведения. _(исходный статус: OPEN; строка 461)_
- [ ] **VOICEAUDIT-055** **VOICEAUDIT-055** (строка 55; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Отдельно проверены iOS Safari, блокировка/разблокировка экрана, переключение аудиоустройства и прерывание звонком. _(исходный статус: OPEN; строка 462)_
- [ ] **VOICEAUDIT-056** **VOICEAUDIT-056** (строка 56; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Только после измерений решить, нужен ли streaming/VAD/barge-in; не добавлять их как фиктивную настройку. _(исходный статус: OPEN; строка 463)_
- [ ] **VOICEAUDIT-061** **VOICEAUDIT-061** (строка 61; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить `ALANDI_DOCUMENT_EXTRACTION_ENABLED=false` по умолчанию; включать только на намеренно настроенном gateway. _(исходный статус: OPEN; строка 464)_
- [ ] **VOICEAUDIT-062** **VOICEAUDIT-062** (строка 62; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить реальные сигнатуры/MIME, расширения, пределы размера, страниц/листов, ZIP entries, коэффициента сжатия, времени и длины извлечённого текста. _(исходный статус: OPEN; строка 465)_
- [ ] **VOICEAUDIT-063** **VOICEAUDIT-063** (строка 63; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить повреждённые файлы, архивную бомбу, неверное расширение, пустой/сканированный PDF, превышение лимитов и cleanup временных данных. _(исходный статус: OPEN; строка 466)_
- [ ] **VOICEAUDIT-064** **VOICEAUDIT-064** (строка 64; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Сохранить `no-store`; не отправлять документ в стороннего провайдера без явного выбора и применимых настроек согласия/приватности. _(исходный статус: OPEN; строка 467)_
- [ ] **VOICEAUDIT-067** **VOICEAUDIT-067** (строка 67; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): На реальном gateway вложить по одному TXT, PDF с текстовым слоем, DOCX, XLSX, CSV и JSON. _(исходный статус: OPEN; строка 468)_
- [ ] **VOICEAUDIT-068** **VOICEAUDIT-068** (строка 68; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Подтвердить, что извлечённое содержимое действительно включено в prompt активного провайдера, а не просто отображено в UI. _(исходный статус: OPEN; строка 469)_
- [ ] **VOICEAUDIT-069** **VOICEAUDIT-069** (строка 69; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить страницы/листы и происхождение источника; для таблиц не терять заголовки, порядок и значения ячеек. _(исходный статус: OPEN; строка 470)_
- [ ] **VOICEAUDIT-070** **VOICEAUDIT-070** (строка 70; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Недоступный parser или превышение лимита блокирует отправку с понятной ошибкой, а не создаёт впечатление, что модель прочитала файл. _(исходный статус: OPEN; строка 471)_
- [ ] **VOICEAUDIT-071** **VOICEAUDIT-071** (строка 71; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить раздельные сценарии собственного и стороннего провайдера: документ не должен незаметно менять выбранный маршрут. _(исходный статус: OPEN; строка 472)_
- [ ] **VOICEAUDIT-074** **VOICEAUDIT-074** (строка 74; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): OCR для сканированных PDF и изображений — отдельный локальный компонент, лицензия, лимиты и тесты. _(исходный статус: OPEN; строка 473)_
- [ ] **VOICEAUDIT-075** **VOICEAUDIT-075** (строка 75; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Chunking с page/offset/source hash, preview и подтверждением перед индексацией. _(исходный статус: OPEN; строка 474)_
- [ ] **VOICEAUDIT-076** **VOICEAUDIT-076** (строка 76; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Re-index/delete, удаление производных chunks вместе с источником, provenance и тесты scope isolation. _(исходный статус: OPEN; строка 475)_
- [ ] **VOICEAUDIT-077** **VOICEAUDIT-077** (строка 77; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): XLSX: отдельно определить формулы, отображаемые значения, листы и лимиты. _(исходный статус: OPEN; строка 476)_
- [ ] **VOICEAUDIT-078** **VOICEAUDIT-078** (строка 78; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Видео: выборка кадров не равна расшифровке звука; audio track, ASR и синхронизация требуют отдельного pipeline. _(исходный статус: OPEN; строка 477)_
- [ ] **VOICEAUDIT-079** **VOICEAUDIT-079** (строка 79; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Google Drive OAuth/Picker/sync не обещать до завершения UI, encrypted token storage, revoke и проверки удаления индекса. _(исходный статус: OPEN; строка 478)_
- [ ] **VOICEAUDIT-104** **VOICEAUDIT-104** (строка 104; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): **Голосовое сообщение:** UI/code path реализован; пользователь может записать фрагмент, отредактировать расшифровку и отправить вручную. Реальный микрофон/модель на целевом устройстве ещё не проверены. _(исходный статус: PARTIAL; строка 479)_
- [ ] **VOICEAUDIT-105** **VOICEAUDIT-105** (строка 105; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): **Живой разговор (первый этап — half-duplex):** прототип цикла есть, но это не streaming/full-duplex. Проверить реальные ASR/TTS, задержку, отмену, echo и состояние UI на устройстве. _(исходный статус: PARTIAL; строка 480)_
- [ ] **VOICEAUDIT-106** **VOICEAUDIT-106** (строка 106; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Переключение в живой режим не включается само собой; видимые Start/Stop и разрешение микрофона обязательны. Stop прекращает запись, ASR, запрос модели и воспроизведение настолько полно, насколько позволяют используемые API. _(исходный статус: OPEN; строка 481)_
- [ ] **VOICEAUDIT-108** **VOICEAUDIT-108** (строка 108; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Для локального TTS показывать только голоса, чьи файлы и runtime действительно установлены и прошли проверку. Если доступен один голос, не рисовать второй фиктивный вариант. _(исходный статус: OPEN; строка 482)_
- [ ] **VOICEAUDIT-109** **VOICEAUDIT-109** (строка 109; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Голос хранится как предпочтение выбранного режима/чата согласно принятой модели настроек; не передавать это предпочтение внешнему провайдеру, если синтез остаётся локальным. _(исходный статус: OPEN; строка 483)_
- [ ] **VOICEAUDIT-110** **VOICEAUDIT-110** (строка 110; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): При смене языка выбирать совместимый установленный голос либо объяснять, что голос недоступен; не делать тихий fallback на внешний сервис. _(исходный статус: OPEN; строка 484)_
- [ ] **VOICEAUDIT-111** **VOICEAUDIT-111** (строка 111; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Расшифровка и ответ видны текстом, если пользователь не включил отдельный режим аудио-only. Пользователь может исправить распознанный текст до отправки. _(исходный статус: OPEN; строка 485)_

### MASTER_TASK_REGISTRY_RU.md — CHATSET — `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`
- [ ] **CHATSET-106** **CHATSET-106** (строка 106; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Расширенный веб-поиск не увеличивает число раундов/вызовов инструментов. _(исходный статус: OPEN; строка 492)_
- [ ] **CHATSET-107** **CHATSET-107** (строка 107; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Тщательный режим не расширяет число результатов веб-поиска сам по себе. _(исходный статус: OPEN; строка 493)_
- [ ] **CHATSET-108** **CHATSET-108** (строка 108; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Offline не предлагает веб-инструменты даже в тщательном/структурированном режиме. _(исходный статус: OPEN; строка 494)_
- [ ] **CHATSET-109** **CHATSET-109** (строка 109; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Смена профиля не включает веб-поиск и не включает структурированный конвейер. _(исходный статус: OPEN; строка 495)_
- [ ] **CHATSET-110** **CHATSET-110** (строка 110; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Структурированный разбор не называется «командой независимых агентов». _(исходный статус: OPEN; строка 496)_
- [ ] **CHATSET-112** **CHATSET-112** (строка 112; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Настройки сохраняются отдельно для каждого чата; импорт/экспорт не теряет значения. _(исходный статус: OPEN; строка 498)_
- [ ] **CHATSET-113** **CHATSET-113** (строка 113; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Русские и английские подписи и подсказки согласованы. _(исходный статус: OPEN; строка 499)_
- [ ] **CHATSET-114** **CHATSET-114** (строка 114; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): На мобильном экране базовые контролы остаются читаемыми и доступны для касания. _(исходный статус: OPEN; строка 500)_

### MASTER_TASK_REGISTRY_RU.md — GUIDE — `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`
- [ ] **GUIDE-544** **GUIDE-544** (строка 544; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Реальная цена Vultr, промокредит и срок истечения проверены в кабинете. _(исходный статус: OPEN; строка 507)_
- [ ] **GUIDE-545** **GUIDE-545** (строка 545; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Домен подключён к Cloudflare; старые DNS/туннели не сломаны. _(исходный статус: OPEN; строка 508)_
- [ ] **GUIDE-546** **GUIDE-546** (строка 546; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Ollama и gateway работают как службы. _(исходный статус: OPEN; строка 509)_
- [ ] **GUIDE-547** **GUIDE-547** (строка 547; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Ollama не доступна с публичного интерфейса; /v1/models без токена отказывает. _(исходный статус: OPEN; строка 510)_
- [ ] **GUIDE-548** **GUIDE-548** (строка 548; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Из опубликованного сайта запрос проходит через aLandi. _(исходный статус: OPEN; строка 511)_
- [ ] **GUIDE-549** **GUIDE-549** (строка 549; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Межпровайдерный fallback выключен для приватных запросов. _(исходный статус: OPEN; строка 512)_
- [ ] **GUIDE-550** **GUIDE-550** (строка 550; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Прямой JSON-запрос даёт L2 MISS → HIT; bypass header работает. _(исходный статус: OPEN; строка 513)_
- [ ] **GUIDE-551** **GUIDE-551** (строка 551; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Gateway tests, quality sentinels, Jekyll build и Chromium E2E прошли на текущем main SHA. _(исходный статус: OPEN; строка 514)_
- [ ] **GUIDE-552** **GUIDE-552** (строка 552; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Experimental memory/RAG/OAuth/voice flags remain off until their own gates and rollback are reviewed. _(исходный статус: OPEN; строка 515)_
- [ ] **GUIDE-554** **GUIDE-554** (строка 554; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Есть резервная копия env, команда отключения L2 и процедура отката. _(исходный статус: OPEN; строка 517)_
- [ ] **GUIDE-555** **GUIDE-555** (строка 555; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Известно, как остановить/удалить платные ресурсы до истечения кредита. _(исходный статус: OPEN; строка 518)_

### MASTER_TASK_REGISTRY_RU.md — ARCHDBG — `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`
- [ ] **ARCHDBG-016** **ARCHDBG-016** (строка 16; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): A5. Выполнить системную матрицу совместимости: UI ↔ API ↔ runtime ↔ persistence ↔ security ↔ CI/deploy. _(исходный статус: OPEN; строка 525)_
- [ ] **ARCHDBG-017** **ARCHDBG-017** (строка 17; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): A6. Внести только подтверждённые совместимые архитектурные исправления; не добавлять тяжёлые зависимости без измеримого выигрыша. _(исходный статус: OPEN; строка 526)_
- [ ] **ARCHDBG-024** **ARCHDBG-024** (строка 24; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D5. Провести полный статический/графовый аудит UI, gateway, memory, RAG, voice, tools, workflows и dependencies. Graphify inspected: 1,109 nodes / 3,103 edges / 53 communities; no import cycles detected; full manual audit remains. _(исходный статус: PARTIAL; строка 527)_
- [ ] **ARCHDBG-026** **ARCHDBG-026** (строка 26; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D7. Составить verified dead-code/obsolete-file inventory. Удалены только три подтверждённо устаревших scratch-файла после поиска ссылок и обновления `IMPROVEMENT_SELECTION.md`: `temp/3`, `temp/4`, `temp/5`. Содержательные `temp/1` и `temp/2` оставлены как архивные источники. Vulture warning по Protocol parameter — false positive. _(исходный статус: PARTIAL; строка 528)_
- [ ] **ARCHDBG-027** **ARCHDBG-027** (строка 27; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D8. Проверить security: SSRF/redirect, prompt injection, scopes, deletion, approval, tool sandbox, secrets, upload parsers, audio. _(исходный статус: OPEN; строка 529)_
- [ ] **ARCHDBG-028** **ARCHDBG-028** (строка 28; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D9. Проверить runtime contracts, cancellation, timeouts, limits, retries, concurrency и resource bounds. _(исходный статус: OPEN; строка 530)_
- [ ] **ARCHDBG-035** **ARCHDBG-035** (строка 35; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P5. Подготовить голосовой UX: запись/транскрипция и TTS одного сообщения уже есть в коде; диалог сейчас half-duplex; selection-to-speech, multi-message queue, streaming turn detection и реальный barge-in остаются незавершёнными. _(исходный статус: PARTIAL; строка 531)_
- [ ] **ARCHDBG-036** **ARCHDBG-036** (строка 36; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P6. Спроектировать small helper models, GPU-only/accelerated inference и routing без обязательной нагрузки CPU; сохранить CPU fallback только как осознанный режим. Подтверждены варианты Ollama GPU, llama.cpp offload и vLLM; требуется hardware benchmark. _(исходный статус: PARTIAL; строка 532)_
- [ ] **ARCHDBG-037** **ARCHDBG-037** (строка 37; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P7. Спроектировать bounded multi-agent / mass-agent orchestration: DAG, budgets, queue, cancellation, idempotency, permissions, traces, evals и safe-off. Сравнены OpenWOP v2 protocol, LangGraph interrupts/checkpointing and Temporal durable workflows; no runtime chosen. _(исходный статус: PARTIAL; строка 533)_
- [ ] **ARCHDBG-040** **ARCHDBG-040** (строка 40; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P10. Лендинговые claims/CTA/SEO/структура проверены в PR #121; exact-head Chromium и published-site smoke прошли. Post-merge Pages deployment, финальный screenshot-review и native iPhone accessibility ещё не подтверждены. _(исходный статус: PARTIAL; строка 534)_
- [ ] **ARCHDBG-129** **ARCHDBG-129** (строка 129; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Exact PR HEAD: Integrity, Security, Context, Jekyll, Chromium, Gateway, Provenance, Graphify and Dead-code report pass. _(исходный статус: OPEN; строка 535)_
- [ ] **ARCHDBG-130** **ARCHDBG-130** (строка 130; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Post-merge main: deployment workflow passes; public root app and /landing/ smoke verify the exact release. _(исходный статус: OPEN; строка 536)_
- [ ] **ARCHDBG-131** **ARCHDBG-131** (строка 131; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Voice: real microphone/speaker, target language set RU/EN/TH, transcription accuracy, first-audio latency, RTF, interruption latency, echo, cancellation, repeated playback, multi-selection ordering. _(исходный статус: OPEN; строка 537)_
- [ ] **ARCHDBG-132** **ARCHDBG-132** (строка 132; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Model: exact artifact/tag, quantization, license, checksum, device backend, VRAM/RAM/PSS, cold/warm TTFT, tokens/s, p95 and thermal stability. _(исходный статус: OPEN; строка 538)_
- [ ] **ARCHDBG-133** **ARCHDBG-133** (строка 133; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Agent: budget, permission, scope isolation, cancellation, timeout, idempotency, retry and adversarial prompt injection tests. _(исходный статус: OPEN; строка 539)_
- [ ] **ARCHDBG-134** **ARCHDBG-134** (строка 134; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Knowledge-to-skill: parser corpus, malicious documents, injection scanner, provenance/citation correctness, license handling and human approval. _(исходный статус: OPEN; строка 540)_
- [ ] **ARCHDBG-135** **ARCHDBG-135** (строка 135; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Security/privacy: no secrets in browser bundle/logs/cache/CI artifacts; explicit disclosure of provider routing and storage. _(исходный статус: OPEN; строка 541)_
- [ ] **ARCHDBG-136** **ARCHDBG-136** (строка 136; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Owner gates: actual VPS inventory, firewall/loopback, Cloudflare Tunnel, credentials, backup/restore, reboot, iPhone Safari and legal privacy text. _(исходный статус: OPEN; строка 542)_
- [ ] **ARCHDBG-225** **ARCHDBG-225** (строка 225; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): U5. Прогнать exact-current-head Chromium/Quality and published Pages after merge. _(исходный статус: OPEN; строка 543)_
- [ ] **ARCHDBG-226** **ARCHDBG-226** (строка 226; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): U6. Реализовать оставшийся polish в больших вертикальных slices: visual consistency; popover/dialog keyboard/focus; mobile Safari; RU/EN/light-dark; screenshot review. _(исходный статус: OPEN; строка 544)_
- [ ] **ARCHDBG-240** **ARCHDBG-240** (строка 240; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D5 — Graphify and targeted source audit cover current hotspots; full manual subsystem audit remains open. _(исходный статус: PARTIAL; строка 545)_
- [ ] **ARCHDBG-241** **ARCHDBG-241** (строка 241; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D8 — OOXML DTD/external-entity handling fixed and regression-tested in 051308c; broader SSRF, parser isolation and adversarial corpus remain open. _(исходный статус: PARTIAL; строка 546)_
- [ ] **ARCHDBG-244** **ARCHDBG-244** (строка 244; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P5/P6 — candidates/constraints documented; target-device quality, helper registry and GPU-only admission tests remain open. _(исходный статус: PARTIAL; строка 547)_
- [ ] **ARCHDBG-245** **ARCHDBG-245** (строка 245; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P7/P9 — durable workflow options compared; no engine chosen. Current bounded DAG stays baseline. _(исходный статус: PARTIAL; строка 548)_
- [ ] **ARCHDBG-247** **ARCHDBG-247** (строка 247; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): No speech model, voice framework, GPU scheduler, agent engine or document converter integrated in this research pass. _(исходный статус: OPEN; строка 549)_
- [ ] **ARCHDBG-248** **ARCHDBG-248** (строка 248; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): External skills/exercise-toolkit@ebf43bb remains pinned pending behavior review. _(исходный статус: OPEN; строка 550)_
- [ ] **ARCHDBG-258** **ARCHDBG-258** (строка 258; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M6. Сверены основные старые search/functions, landing, local audio/document, provider diagnostics и superstack ветки по именам/compare; текущие PR/документы показывают значительное перекрытие с более поздними merge. Полная файловая экспертиза каждой исторической ветки не проводилась; wholesale merge старых веток не нужен. _(исходный статус: PARTIAL; строка 551)_
- [ ] **ARCHDBG-263** **ARCHDBG-263** (строка 263; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M11. После merge проверить post-merge Pages deployment и опубликованный `/landing/` и root app. _(исходный статус: OPEN; строка 552)_
- [ ] **ARCHDBG-264** **ARCHDBG-264** (строка 264; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M12. Провести ручной visual/screenshot pass и native iPhone Safari/keyboard/safe-area/VoiceOver. _(исходный статус: OPEN; строка 553)_
- [ ] **ARCHDBG-265** **ARCHDBG-265** (строка 265; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M13. На реальном хосте выполнить helper-model benchmark: точные model IDs/digests/licenses, одинаковые RU/EN/TH golden prompts, quantization/context/hardware, p50/p95, cold/warm latency, tokens/s, RAM/PSS и human-rated quality. Пока модель не выбрана и не включена. _(исходный статус: OPEN; строка 554)_
- [ ] **ARCHDBG-266** **ARCHDBG-266** (строка 266; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M14. Продолжить системную матрицу UI ↔ API ↔ runtime ↔ persistence ↔ security ↔ CI/deploy; не объявлять sandbox, independent agents, live voice, OAuth или RAG production-ready без evidence. _(исходный статус: OPEN; строка 555)_
- [ ] **ARCHDBG-283** **ARCHDBG-283** (строка 283; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W2. Reconcile accepted decisions against implementation, flags and runtime wiring. _(исходный статус: OPEN; строка 556)_
- [ ] **ARCHDBG-284** **ARCHDBG-284** (строка 284; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W3. Trace all cross-module data/control flows and trust boundaries. _(исходный статус: OPEN; строка 557)_
- [ ] **ARCHDBG-285** **ARCHDBG-285** (строка 285; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W4. Run additional independent quality/security/static-analysis tools and record exact outputs. _(исходный статус: OPEN; строка 558)_
- [ ] **ARCHDBG-286** **ARCHDBG-286** (строка 286; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W5. Obtain independent subagent review if an actual subagent execution capability is available; otherwise record limitation and use a separately structured adversarial review. _(исходный статус: OPEN; строка 559)_
- [ ] **ARCHDBG-287** **ARCHDBG-287** (строка 287; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W6. Triage findings against accepted architecture; reject stack expansion and speculative changes. _(исходный статус: OPEN; строка 560)_
- [ ] **ARCHDBG-288** **ARCHDBG-288** (строка 288; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W7. Implement only evidence-backed, bounded fixes; test each slice and update all state docs. _(исходный статус: OPEN; строка 561)_
- [ ] **ARCHDBG-289** **ARCHDBG-289** (строка 289; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W8. Re-run exact-head CI and verify final PR/issue/deployment status without overstating live readiness. _(исходный статус: OPEN; строка 562)_

### MASTER_TASK_REGISTRY_RU.md — AGENTPLAT — `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`
- [ ] **AGENTPLAT-404** **AGENTPLAT-404** (строка 404; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Typed AgentProfile, Profession, SkillManifest, Capability, ModelPolicy, BudgetPolicy. _(исходный статус: OPEN; строка 574)_
- [ ] **AGENTPLAT-405** **AGENTPLAT-405** (строка 405; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Registry read-only API + versioned config; никакой динамической загрузки исполняемого кода. _(исходный статус: OPEN; строка 575)_
- [ ] **AGENTPLAT-406** **AGENTPLAT-406** (строка 406; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Перевести 64 роли в валидируемые профили, не создавая 64 процессов. _(исходный статус: OPEN; строка 576)_
- [ ] **AGENTPLAT-407** **AGENTPLAT-407** (строка 407; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): JSON Schema/Pydantic contract tests, license/provenance validation, deterministic registry selection. _(исходный статус: OPEN; строка 577)_
- [ ] **AGENTPLAT-410** **AGENTPLAT-410** (строка 410; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): SQLite schema + append-only events + snapshots + state machine. _(исходный статус: OPEN; строка 578)_
- [ ] **AGENTPLAT-411** **AGENTPLAT-411** (строка 411; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Cancellation, deadlines, budgets, idempotency, restart recovery. _(исходный статус: OPEN; строка 579)_
- [ ] **AGENTPLAT-412** **AGENTPLAT-412** (строка 412; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Failure injection tests на каждом transition. _(исходный статус: OPEN; строка 580)_
- [ ] **AGENTPLAT-413** **AGENTPLAT-413** (строка 413; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): UI timeline read-only; не показывать chain-of-thought. _(исходный статус: OPEN; строка 581)_
- [ ] **AGENTPLAT-416** **AGENTPLAT-416** (строка 416; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Supervisor → bounded specialist tasks. _(исходный статус: OPEN; строка 582)_
- [ ] **AGENTPLAT-417** **AGENTPLAT-417** (строка 417; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Isolated task packet/history; strict capability intersection. _(исходный статус: OPEN; строка 583)_
- [ ] **AGENTPLAT-418** **AGENTPLAT-418** (строка 418; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): fan-out/fan-in для read-only tasks; generation concurrency 1 на 8-GB VPS. _(исходный статус: OPEN; строка 584)_
- [ ] **AGENTPLAT-419** **AGENTPLAT-419** (строка 419; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): независимая проверка результата и корректная агрегация. _(исходный статус: OPEN; строка 585)_
- [ ] **AGENTPLAT-420** **AGENTPLAT-420** (строка 420; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): eval: delegation correctness, no context/permission leakage, cost and latency. _(исходный статус: OPEN; строка 586)_
- [ ] **AGENTPLAT-423** **AGENTPLAT-423** (строка 423; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Run model bake-off на целевом host и golden set. _(исходный статус: OPEN; строка 587)_
- [ ] **AGENTPLAT-424** **AGENTPLAT-424** (строка 424; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Capability-based routing, explicit provider/model allowlist, no silent fallback. _(исходный статус: OPEN; строка 588)_
- [ ] **AGENTPLAT-425** **AGENTPLAT-425** (строка 425; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Только один helper use case за раз; rollback и feature flag off by default. _(исходный статус: OPEN; строка 589)_
- [ ] **AGENTPLAT-426** **AGENTPLAT-426** (строка 426; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Не держать несколько checkpoints resident без измеренной причины. _(исходный статус: OPEN; строка 590)_
- [ ] **AGENTPLAT-429** **AGENTPLAT-429** (строка 429; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Agent Skills-compatible loader and registry. _(исходный статус: OPEN; строка 591)_
- [ ] **AGENTPLAT-430** **AGENTPLAT-430** (строка 430; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Source ingestion, provenance, license checks, injection scanner. _(исходный статус: OPEN; строка 592)_
- [ ] **AGENTPLAT-431** **AGENTPLAT-431** (строка 431; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): eval-generated test questions, human review, skill versioning/rollback. _(исходный статус: OPEN; строка 593)_
- [ ] **AGENTPLAT-432** **AGENTPLAT-432** (строка 432; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): No auto-execution of scripts and no permission inheritance from skill metadata. _(исходный статус: OPEN; строка 594)_
- [ ] **AGENTPLAT-435** **AGENTPLAT-435** (строка 435; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Capability-based tool authorization before each call. _(исходный статус: OPEN; строка 595)_
- [ ] **AGENTPLAT-436** **AGENTPLAT-436** (строка 436; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Scoped credential broker, audit, egress restrictions. _(исходный статус: OPEN; строка 596)_
- [ ] **AGENTPLAT-437** **AGENTPLAT-437** (строка 437; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): gVisor/Firecracker/OpenShell spike; choose only after threat model and host checks. _(исходный статус: OPEN; строка 597)_
- [ ] **AGENTPLAT-438** **AGENTPLAT-438** (строка 438; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Arbitrary code remains disabled until isolation/escape tests pass. _(исходный статус: OPEN; строка 598)_
- [ ] **AGENTPLAT-441** **AGENTPLAT-441** (строка 441; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Goals, org chart, task queue, heartbeats, budgets, pause/resume/terminate. _(исходный статус: OPEN; строка 599)_
- [ ] **AGENTPLAT-442** **AGENTPLAT-442** (строка 442; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): A2A for explicit external-agent connections; MCP for tools; AG-UI for UI events. _(исходный статус: OPEN; строка 600)_
- [ ] **AGENTPLAT-443** **AGENTPLAT-443** (строка 443; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Multi-tenant boundaries, adapter isolation, credential scopes and operator controls. _(исходный статус: OPEN; строка 601)_
- [ ] **AGENTPLAT-444** **AGENTPLAT-444** (строка 444; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Human opt-in for recurring work and clear stop controls. _(исходный статус: OPEN; строка 602)_

### MASTER_TASK_REGISTRY_RU.md — LANDINGBK — `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`
- [ ] **LANDINGBK-033** **LANDINGBK-033** (строка 33; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-001 — зафиксировать baseline размера HTML/CSS/JS, critical rendering, LCP/INP/CLS и загрузки ключевых assets на опубликованном сайте. _(исходный статус: OPEN; строка 637)_
- [ ] **LANDINGBK-034** **LANDINGBK-034** (строка 34; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-002 — аудит доступности: keyboard-only, focus order, dialogs/popovers, screen-reader semantics, reduced motion, contrast and touch targets. _(исходный статус: OPEN; строка 638)_
- [ ] **LANDINGBK-035** **LANDINGBK-035** (строка 35; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-003 — аудит responsive поведения и реального iPhone Safari: visual viewport, keyboard, safe areas, rotation and zoom. _(исходный статус: OPEN; строка 639)_
- [ ] **LANDINGBK-036** **LANDINGBK-036** (строка 36; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-004 — аудит JS lifecycle: event listener cleanup, duplicate handlers, async race conditions, stale state, cancellation and memory leaks. _(исходный статус: OPEN; строка 640)_
- [ ] **LANDINGBK-037** **LANDINGBK-037** (строка 37; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-005 — аудит resilience: offline/slow network, retry/backoff, timeout, abort, provider 4xx/5xx, malformed/partial responses and error recovery. _(исходный статус: OPEN; строка 641)_
- [ ] **LANDINGBK-038** **LANDINGBK-038** (строка 38; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-006 — аудит client storage: migration, quota errors, import/export losslessness, corruption recovery, scoped deletion and backup/restore. _(исходный статус: OPEN; строка 642)_
- [ ] **LANDINGBK-039** **LANDINGBK-039** (строка 39; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-007 — audit security/privacy in current boundaries: CSP/SRI, DOM injection, URL handling, secret exposure, logging, CORS/SSRF and data retention. _(исходный статус: OPEN; строка 643)_
- [ ] **LANDINGBK-040** **LANDINGBK-040** (строка 40; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-008 — SEO/metadata/semantic HTML, canonical URL, social preview, sitemap/robots and crawl behavior without adding a framework. _(исходный статус: OPEN; строка 644)_
- [ ] **LANDINGBK-041** **LANDINGBK-041** (строка 41; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-009 — deterministic Jekyll/Actions build, cache correctness, immutable action pins, lockfile and provenance. _(исходный статус: OPEN; строка 645)_
- [ ] **LANDINGBK-042** **LANDINGBK-042** (строка 42; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-010 — reduce duplicated code/assets and dead paths only when exact reference and regression evidence prove safe removal. _(исходный статус: OPEN; строка 646)_
- [ ] **LANDINGBK-043** **LANDINGBK-043** (строка 43; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-011 — inspect current CSS/JS payload and optimize critical path only if measured; preserve visual behavior. _(исходный статус: OPEN; строка 647)_
- [ ] **LANDINGBK-044** **LANDINGBK-044** (строка 44; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-012 — expand Playwright coverage for critical user flows and failure states; avoid brittle/vacuous assertions. _(исходный статус: OPEN; строка 648)_
- [ ] **LANDINGBK-045** **LANDINGBK-045** (строка 45; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-013 — verify browser compatibility and graceful degradation for current supported browsers. _(исходный статус: OPEN; строка 649)_
- [ ] **LANDINGBK-046** **LANDINGBK-046** (строка 46; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-014 — audit i18n: RU/EN/TH labels, formatting, font fallback, transliteration of user-entered names only where required. _(исходный статус: OPEN; строка 650)_
- [ ] **LANDINGBK-047** **LANDINGBK-047** (строка 47; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-015 — review dependency freshness and security advisories within the existing dependency policy; do not blindly upgrade. _(исходный статус: OPEN; строка 651)_
- [ ] **LANDINGBK-048** **LANDINGBK-048** (строка 48; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-016 — inspect build/release observability and published Pages smoke; do not claim post-merge deploy from PR CI alone. _(исходный статус: OPEN; строка 652)_
- [ ] **LANDINGBK-049** **LANDINGBK-049** (строка 49; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-017 — reconcile historical landing UX requests with current code and master registry; preserve original task IDs and evidence. _(исходный статус: OPEN; строка 653)_
- [ ] **LANDINGBK-050** **LANDINGBK-050** (строка 50; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-018 — test graceful operation when optional gateway/voice/research capabilities are unavailable or disabled. _(исходный статус: OPEN; строка 654)_

### MASTER_TASK_REGISTRY_RU.md — GOV — `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`
- [ ] **GOV-094** **GOV-094** (строка 94; `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`): GOV-003 — apply explicit titles/banners/labels to all existing future/research PRs after reviewing each PR and current labels. _(исходный статус: PARTIAL; строка 661)_
- [ ] **GOV-095** **GOV-095** (строка 95; `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`): GOV-004 — add repository-side merge protection/automation only after checking existing rulesets and obtaining owner approval; labels alone are not a security boundary. _(исходный статус: OPEN; строка 662)_
- [ ] **GOV-096** **GOV-096** (строка 96; `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`): GOV-005 — update master registry and orienters when PR #127 is revised/merged. _(исходный статус: OPEN; строка 663)_

### MASTER_TASK_REGISTRY_RU.md — DR2PLAN — `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`
- [ ] **DR2PLAN-152** **DR2PLAN-152** (строка 152; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-001 — восстановить ранее предоставленные владельцем research links и provenance. _(исходный статус: OPEN; строка 670)_
- [ ] **DR2PLAN-154** **DR2PLAN-154** (строка 154; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-003 — проверить actual search/research UI и Gateway code; разделить implemented/planned. _(исходный статус: OPEN; строка 671)_
- [ ] **DR2PLAN-155** **DR2PLAN-155** (строка 155; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-004 — аудит source ingestion, local storage, index and citation lineage. _(исходный статус: OPEN; строка 672)_
- [ ] **DR2PLAN-156** **DR2PLAN-156** (строка 156; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-005 — проверить browser File System Access, OPFS and IndexedDB на целевых браузерах. _(исходный статус: OPEN; строка 673)_
- [ ] **DR2PLAN-157** **DR2PLAN-157** (строка 157; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-006 — оценить local companion/desktop connectors and threat model. _(исходный статус: OPEN; строка 674)_
- [ ] **DR2PLAN-158** **DR2PLAN-158** (строка 158; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-007 — сравнить notebook/research workspace проекты и source adapters по первоисточникам. _(исходный статус: OPEN; строка 675)_
- [ ] **DR2PLAN-159** **DR2PLAN-159** (строка 159; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-008 — сравнить hybrid lexical/vector retrieval с SQLite FTS5 до добавления vector store. _(исходный статус: OPEN; строка 676)_
- [ ] **DR2PLAN-160** **DR2PLAN-160** (строка 160; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-009 — определить claim/evidence schema and citation-validation golden set. _(исходный статус: OPEN; строка 677)_
- [ ] **DR2PLAN-161** **DR2PLAN-161** (строка 161; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-010 — специфицировать resumable 12-stage Research run: deadline, cancellation, idempotency, bounded concurrency. _(исходный статус: OPEN; строка 678)_
- [ ] **DR2PLAN-162** **DR2PLAN-162** (строка 162; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-011 — RU/EN/TH research golden set, source freshness and contradiction tests. _(исходный статус: OPEN; строка 679)_
- [ ] **DR2PLAN-163** **DR2PLAN-163** (строка 163; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-012 — аудит memory recall, scope isolation, stale facts, conflicts, deletion and long-session capacity. _(исходный статус: OPEN; строка 680)_
- [ ] **DR2PLAN-164** **DR2PLAN-164** (строка 164; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-013 — оценить local memory/index size and performance на target devices; определить практические пределы. _(исходный статус: OPEN; строка 681)_
- [ ] **DR2PLAN-165** **DR2PLAN-165** (строка 165; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-014 — data-flow режимов local-only / mixed / remote-with-consent. _(исходный статус: OPEN; строка 682)_
- [ ] **DR2PLAN-166** **DR2PLAN-166** (строка 166; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-015 — policy matrix: model refusals vs content policy vs platform security vs tool permissions. _(исходный статус: OPEN; строка 683)_
- [ ] **DR2PLAN-167** **DR2PLAN-167** (строка 167; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-016 — false-positive/false-refusal and tool-authorization tests; no hidden adapter censorship. _(исходный статус: OPEN; строка 684)_
- [ ] **DR2PLAN-168** **DR2PLAN-168** (строка 168; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-017 — image-generation candidates: ComfyUI/local GPU vs hosted APIs, licenses, cost, region, privacy. _(исходный статус: OPEN; строка 685)_
- [ ] **DR2PLAN-169** **DR2PLAN-169** (строка 169; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-018 — video-generation candidates and async job APIs; не использовать retired endpoints. _(исходный статус: OPEN; строка 686)_
- [ ] **DR2PLAN-170** **DR2PLAN-170** (строка 170; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-019 — AI coding assistants/agents and isolated coding sandboxes. _(исходный статус: OPEN; строка 687)_
- [ ] **DR2PLAN-171** **DR2PLAN-171** (строка 171; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-020 — source inventory, decisions, risk register and staged implementation roadmap. _(исходный статус: OPEN; строка 688)_
- [ ] **DR2PLAN-172** **DR2PLAN-172** (строка 172; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-021 — подготовить отдельные минимальные implementation PR после owner review; никаких production dependencies в этом PR. _(исходный статус: OPEN; строка 689)_

### MASTER_TASK_REGISTRY_RU.md — DR2EXT — `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`
- [ ] **DR2EXT-147** **DR2EXT-147** (строка 147; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-001 — pin Local Deep Research commit, verify full dependency/license and run architecture comparison. _(исходный статус: OPEN; строка 696)_
- [ ] **DR2EXT-148** **DR2EXT-148** (строка 148; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-002 — verify Khoj AGPL obligations and exact local deployment footprint. _(исходный статус: OPEN; строка 697)_
- [ ] **DR2EXT-149** **DR2EXT-149** (строка 149; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-003 — review Deep Research Web UI license/maintenance and reproduce evidence-follow-up flow. _(исходный статус: OPEN; строка 698)_
- [ ] **DR2EXT-150** **DR2EXT-150** (строка 150; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-004 — browser matrix for File System Access/IndexedDB/OPFS permission persistence, quota and file changes. _(исходный статус: OPEN; строка 699)_
- [ ] **DR2EXT-151** **DR2EXT-151** (строка 151; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-005 — prototype local folder companion threat model; no code until explicit approval. _(исходный статус: OPEN; строка 700)_
- [ ] **DR2EXT-152** **DR2EXT-152** (строка 152; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-006 — compare OpenHands Docker isolation with aLandi's required container/seccomp/Landlock policy and adversarial escape tests. _(исходный статус: OPEN; строка 701)_
- [ ] **DR2EXT-153** **DR2EXT-153** (строка 153; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-007 — compare Letta/Graphiti/OpenViking retrieval against current SQLite/FTS5 on the same labelled corpus. _(исходный статус: OPEN; строка 702)_
- [ ] **DR2EXT-154** **DR2EXT-154** (строка 154; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-008 — verify exact Comfy API deployment/auth/retention behavior and benchmark a local workflow on target GPU. _(исходный статус: OPEN; строка 703)_
- [ ] **DR2EXT-155** **DR2EXT-155** (строка 155; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-009 — verify Runway and Vertex AI availability, pricing, regional access and data retention from owner accounts. _(исходный статус: OPEN; строка 704)_
- [ ] **DR2EXT-156** **DR2EXT-156** (строка 156; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-010 — produce policy matrix and false-refusal/security separation tests. _(исходный статус: OPEN; строка 705)_

### MASTER_TASK_REGISTRY_RU.md — USER125 — branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`
- [ ] **USER125-254** **USER125-254** (строка 254; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Review the architecture and approve/adjust the Phase 1 contracts and registry before any runtime implementation. _(исходный статус: OPEN; строка 712)_
- [ ] **USER125-255** **USER125-255** (строка 255; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Implement a versioned AgentProfile/Profession/Skill/Capability/ModelPolicy contract in a separate bounded PR. _(исходный статус: OPEN; строка 713)_
- [ ] **USER125-256** **USER125-256** (строка 256; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Build durable AgentRun state, isolated subagent task packets, budget/cancellation and restart recovery in subsequent PRs. _(исходный статус: OPEN; строка 714)_
- [ ] **USER125-257** **USER125-257** (строка 257; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Run RU/EN/TH model quality and target-host RAM/latency bake-off before choosing helper models. _(исходный статус: OPEN; строка 715)_
- [ ] **USER125-258** **USER125-258** (строка 258; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Complete threat model and real sandbox/escape tests before enabling arbitrary code or shell tools. _(исходный статус: OPEN; строка 716)_

### MASTER_TASK_REGISTRY_RU.md — USER126 — branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `chore/dependency-currency-audit-20261031`
- [ ] **USER126-328** **USER126-328** (строка 328; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `chore/dependency-currency-audit-20261031`): После cooldown повторно оценить pypdf 6.21.4, pytest 9.2.0, pytest-asyncio 1.4.1 и Graphify 0.9.97. _(исходный статус: OPEN; строка 729)_
- [ ] **USER126-329** **USER126-329** (строка 329; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `chore/dependency-currency-audit-20261031`): Live Cloudflare Tunnel/Ollama, целевой VPS и native iPhone остаются owner/manual gates. _(исходный статус: OPEN; строка 730)_

### MASTER_TASK_REGISTRY_RU.md — B. Новые задачи по указанию владельца (2026-10-31)
- [ ] **CONT-001** **CONT-001**: Единый устойчивый протокол непрерывности: корневой ориентир, мастер-реестр, стабильные ID, обязательное обновление после этапов, восстановление по GitHub и файлам. **Progress:** PR #127 содержит 544 открытые/частичные записи из 20 документов и двух branch-only checklist snapshots (470 unchecked + 74 partial); исходники не изменены. Exact-head Freshness/Quality/Provenance после последнего обновления ещё требуется. _(исходный статус: PARTIAL; строка 734)_
- [ ] **AGENT-001** **AGENT-001**: Исследовать и спроектировать реальную параллельную multi-agent архитектуру: минимум 5 одновременно исполняемых независимых workers поверх главной модели; масштабирование выше 64 и до сотен/тысяч логических workers через очереди, leases, backpressure и распределённые workers. **Progress:** целевая архитектура и acceptance criterion 5+ workers описаны в PR #128; runtime implementation pending. _(исходный статус: PARTIAL; строка 735)_
- [ ] **AGENT-002** **AGENT-002**: Сравнить Agensh (до 1,024 workers), Hive, DeerFlow, Open Multi-Agent, AgentTeams, OpenAI Agents SDK, Swarms, Octos и новые upstream; проверить первичные репозитории, бумаги, лицензии, adoption и ограничения. **Progress:** сравнены Agensh, Hive, DeerFlow, OMA, AgentTeams, Octos и ранее выбранные проекты; дальнейший source/license review pending. _(исходный статус: PARTIAL; строка 736)_
- [ ] **AGENT-003** **AGENT-003**: Расширить профессию/skill/capability registry: 64 роли оставить как один seed-набор, но поддержать динамические профили, пользовательские профессии, composable skills и capability discovery без жёсткого потолка. **Progress:** зафиксировано: 64 роли — seed catalogue, без жёсткого потолка; dynamic profile implementation pending. _(исходный статус: PARTIAL; строка 737)_
- [ ] **AGENT-004** **AGENT-004**: Спроектировать durable AgentRun: persistence, checkpoints, leases, retries, cancellation, approvals, idempotency, isolation, event journal, budgets, tracing, independent verification. **Progress:** durable AgentRun, leases, journal, retries and recovery описаны; implementation pending. _(исходный статус: PARTIAL; строка 738)_
- [ ] **AGENT-005** **AGENT-005**: Проверить параллельную работу разных моделей и главной модели без требования держать отдельный checkpoint на каждого worker; model routing, batching, queue fairness, resource-aware scheduling. **Progress:** разделены logical worker slots и backend inference concurrency; target-host benchmark pending. _(исходный статус: PARTIAL; строка 739)_
- [ ] **VERT-001** **VERT-001**: Проверить VERT-sh/vert, vertd, WASM converters, engine routing, format coverage, local privacy, AGPL/GPL licensing; решить, что переиспользовать как идеи/engines, а не встраивать UI wholesale. **Progress:** VERT/верtd upstream, формат и лицензии проверены; implementation decision pending. _(исходный статус: PARTIAL; строка 740)_
- [ ] **VERT-002** **VERT-002**: Сравнить более лёгкий conversion stack: существующий pypdf/docx/xlsx extraction, Pandoc, LibreOffice headless, FFmpeg, ImageMagick и browser WASM; отдельно user-facing conversion и model-facing normalization. **Progress:** MarkItDown, Docling, Unstructured, Pandoc, LibreOffice, FFmpeg и WASM approaches сравнены; fixture benchmark pending. _(исходный статус: PARTIAL; строка 741)_
- [ ] **VERT-003** **VERT-003**: Сформировать безопасный conversion contract: MIME/signature sniffing, limits, async workers, timeouts, temp cleanup, no-store, provenance, conversion preview, loss warnings, supported pairs and license manifest. **Progress:** typed conversion contract and security gates описаны; implementation pending. _(исходный статус: PARTIAL; строка 742)_
- [ ] **TOK-001** **TOK-001**: Полный аудит generation/output limits, history/context budgets, truncation, stop sequences, finish_reason, provider compatibility, streaming completion and reasoning settings. **Progress:** frontend, Gateway, tool loop, context, cache and import paths audited; remediation pending. _(исходный статус: PARTIAL; строка 743)_
- [ ] **TOK-002** **TOK-002**: Разделить safety/resource bounds на input/file/context/tool orchestration vs искусственные ограничения длины ответа/размышления; не обрезать ответ модели ради внутреннего формата aLandi. **Progress:** подтверждено отсутствие обычного main-answer cap; context/tool orchestration limits and finish_reason issue documented. _(исходный статус: PARTIAL; строка 744)_
- [ ] **TOK-003** **TOK-003**: Разработать provider-aware output handling: не посылать max_tokens/max_completion_tokens/max_output_tokens по умолчанию без нужды; уважать provider/model context; detect length/incomplete; продолжать безопасно только если continuation semantics подтверждены. _(исходный статус: OPEN; строка 745)_
- [ ] **DR-001** **DR-001**: Создать отдельный deep-research PR/ветку: многопроходный поиск, первичные источники, GitHub discovery, adoption signals, papers, issue/release activity, security/licensing, practitioner evidence. **Progress:** отдельная research branch и PR #128 созданы; review/merge pending. _(исходный статус: PARTIAL; строка 746)_
- [ ] **DR-002** **DR-002**: Собрать ранее выбранные источники из temp/1, temp/2, existing research catalogues and user-provided repositories; dedupe and classify by idea, implementation, evidence and adoption. **Progress:** повторно использованы temp/1, temp/2, OPEN_SOURCE_TRIAGE, TECHNIQUE_REGISTER и PR #125 research docs. _(исходный статус: PARTIAL; строка 747)_
- [ ] **DR-003** **DR-003**: Подготовить обновляемый research catalogue и architecture decision matrix, не копируя сторонний код/лицензии и не превращая каждую найденную технологию в зависимость. **Progress:** три документа deep research созданы; расширение каталога и независимый review pending. _(исходный статус: PARTIAL; строка 748)_
- [ ] **DEP-001** **DEP-001**: Согласовать пересекающиеся PR #124 и #126. #124 добавляет uv.lock и Python 3.12/3.13/3.14 matrix, обновляет pypdf до 6.21.4 с узким security cutoff; #126 повторяет dependency pins с pypdf 6.21.2 и меняет Node 22→24. Рекомендованный порядок: сначала принять #124 после exact-head checks, затем rebase/reconcile #126 на новый main и сохранить единый dependency/lockfile truth. _(исходный статус: OPEN; строка 750)_
- [ ] **AGENT-006** **AGENT-006**: Обновить PR #125 blueprint по результатам PR #128 и указанию владельца: 64 профессии — seed, не ceiling; минимум 5 параллельных workers рядом с main model; раздельные logical worker slots и backend-specific inference concurrency. _(исходный статус: OPEN; строка 751)_
- [ ] **TOK-004** **TOK-004**: Реализовать сохранение finish_reason и явное состояние incomplete для length/provider interruption; provider-specific continuation semantics и regression tests. _(исходный статус: OPEN; строка 752)_
- [ ] **TOK-005** **TOK-005**: Реализовать adaptive tool budgets и provider-specific inference pools/queues с main priority, backpressure и cancellation; acceptance — 5 параллельных workers + main request без cross-scope leakage. _(исходный статус: OPEN; строка 753)_
- [ ] **VERT-004** **VERT-004**: Выполнить fixture benchmark current parser vs MarkItDown vs Docling; выбрать одну пользовательскую conversion family для pilot и проверить локальный engine/license/security. _(исходный статус: OPEN; строка 754)_

### MASTER_TASK_REGISTRY_RU.md — F1. Landing V1 — постоянное улучшение текущего стека
- [ ] **LANDING-TRACK-003** **LANDING-TRACK-003**: Снять baseline метрик опубликованного лендинга и выбрать первый минимальный improvement slice. **Progress:** source baseline на PR #131: 26,139 символов HTML, 0 script tags, 0 external stylesheets/images/video/CSS URL assets; published LCP/INP/CLS и реальные network waterfalls пока не измерены. _(исходный статус: PARTIAL; строка 788)_
- [ ] **LANDING-TRACK-004** **LANDING-TRACK-004**: Вести цикл baseline → hypothesis → minimal patch → regression test → exact-head CI → state update на каждом рабочем заходе. **Progress:** PR #131 exact HEAD `b75303070cc06bee993555b979bc0a942466fe51`: Quality run `41120598763` passed all 7 jobs (Chromium: 100 passed; one unrelated Cloudflare provider test was flaky on first attempt but passed on retry; Context/Integrity/Security/Static/Jekyll and published root Pages smoke passed). Graphify `41120598741` passed. Landing-specific post-merge smoke was skipped because PR is not merged; native iPhone Safari/VoiceOver remain unverified. _(исходный статус: PARTIAL; строка 789)_

### MASTER_TASK_REGISTRY_RU.md — F2. Future workstreams — отдельные PR, не для случайного merge
- [ ] **GOVERNANCE-003** **GOVERNANCE-003**: Проставить маркировку на существующих agent/research PR. **Progress:** PR #125 переименован в [FUTURE — DO NOT MERGE] и остаётся Draft; PR #128 переименован в [RESEARCH — HOLD] и переведён в Draft; новый PR #129 создан как Draft. Остальные PR и label availability требуют отдельной проверки. _(исходный статус: PARTIAL; строка 796)_
- [ ] **GOVERNANCE-004** **GOVERNANCE-004**: Проверить repository rulesets/branch protection и только после согласования включить техническое enforcement. _(исходный статус: OPEN; строка 797)_
- [ ] **GOVERNANCE-005** **GOVERNANCE-005**: Синхронизировать ориентиры и этот реестр с PR #127 после подтверждённого merge. _(исходный статус: OPEN; строка 798)_

### MASTER_TASK_REGISTRY_RU.md — F3. Voice 2.0 — research-only
- [ ] **VOICE-004** **VOICE-004**: Собрать provenance-реестр ранее найденных и предоставленных владельцем источников; точное происхождение части исторических ссылок ещё проверить. _(исходный статус: PARTIAL; строка 805)_
- [ ] **VOICE-005** **VOICE-005**: Провести независимый обзор актуальных ASR/STT, TTS, streaming, VAD/AEC, diarization, translation, transliteration, normalization and voice-agent systems. _(исходный статус: OPEN; строка 806)_
- [ ] **VOICE-006** **VOICE-006**: Проверить кодовые, model, voice, phonemizer and dataset licenses plus redistribution restrictions. _(исходный статус: OPEN; строка 807)_
- [ ] **VOICE-007** **VOICE-007**: Сверить текущий код/тесты с полным Voice 2.0 acceptance matrix. _(исходный статус: OPEN; строка 808)_
- [ ] **VOICE-008** **VOICE-008**: Подготовить воспроизводимый RU/EN/TH golden-set benchmark and privacy/consent protocol. _(исходный статус: OPEN; строка 809)_
- [ ] **VOICE-009** **VOICE-009**: Сравнить shortlist на одинаковых данных и target hardware; не менять whisper.cpp/Piper до измеримого выигрыша. _(исходный статус: OPEN; строка 810)_
- [ ] **VOICE-010** **VOICE-010**: Подготовить staged architecture/API plan for future implementation; любые runtime slices требуют отдельного owner approval. _(исходный статус: OPEN; строка 811)_
- [ ] **VOICE-TRACK-010** **VOICE-TRACK-010** — independent security/privacy review and explicit owner approval before runtime changes; no runtime activation or dependency changes before the review gate. _(исходный статус: OPEN; строка 812)_
- [ ] **VOICE-011** **VOICE-011** — map every visible voice/audio control to a real handler, feature flag, runtime and test; label current/partial/planned states. _(исходный статус: OPEN; строка 813)_
- [ ] **VOICE-012** **VOICE-012** — implement selected-text TTS with selection boundaries, safe HTML stripping and cancellation. _(исходный статус: OPEN; строка 814)_
- [ ] **VOICE-013** **VOICE-013** — implement multi-message serial TTS queue with pause/resume/skip/stop and stale-request protection. _(исходный статус: OPEN; строка 815)_
- [ ] **VOICE-014** **VOICE-014** — benchmark true streaming turn-taking, VAD/endpointing, barge-in, echo/AEC and mobile audio lifecycle. _(исходный статус: OPEN; строка 816)_
- [ ] **VOICE-015** **VOICE-015** — research sound-effects/ambience/music generation as a separate adapter family; verify model and output licenses, consent, cost and export. _(исходный статус: OPEN; строка 817)_
- [ ] **VOICE-016** **VOICE-016** — define audio job artifacts: duration, codec, sample rate, source/model, checksum, retention and user export. _(исходный статус: OPEN; строка 818)_
- [ ] **VOICE-017** **VOICE-017** — compare LiveKit and Pipecat against current browser/FastAPI interfaces and target hardware; no migration until measured. _(исходный статус: OPEN; строка 819)_
- [ ] **VOICE-018** **VOICE-018** — add RU/EN/TH golden tests for code-switching, names, numbers, punctuation and noisy mobile recordings. _(исходный статус: OPEN; строка 820)_
- [ ] **AUDIO-GEN-001** **AUDIO-GEN-001** — verify Agent Audio source, releases, security posture and install permissions. _(исходный статус: OPEN; строка 821)_
- [ ] **AUDIO-GEN-002** **AUDIO-GEN-002** — review Stable Audio 3 Medium and T5Gemma terms independently. _(исходный статус: OPEN; строка 822)_
- [ ] **AUDIO-GEN-003** **AUDIO-GEN-003** — measure cold/warm RAM, disk, latency and throughput on actual target hardware. _(исходный статус: OPEN; строка 823)_
- [ ] **AUDIO-GEN-004** **AUDIO-GEN-004** — build a small RU/EN prompt set for sound effects, ambience and music; run blinded listening evaluation. _(исходный статус: OPEN; строка 824)_
- [ ] **AUDIO-GEN-005** **AUDIO-GEN-005** — test generated WAV metadata, clipping, silence, duration, sample rate and reproducibility. _(исходный статус: OPEN; строка 825)_
- [ ] **AUDIO-GEN-006** **AUDIO-GEN-006** — define artifact folder, provenance, user approval and cleanup. _(исходный статус: OPEN; строка 826)_
- [ ] **AUDIO-GEN-007** **AUDIO-GEN-007** — add an audio-generation Skill only after security/license review. _(исходный статус: OPEN; строка 827)_
- [ ] **AUDIO-GEN-008** **AUDIO-GEN-008** — compare at least one smaller model/backend before adopting Stable Audio 3 Medium. _(исходный статус: OPEN; строка 828)_
- [ ] **AUDIO-GEN-009** **AUDIO-GEN-009** — no model download or runtime activation without explicit owner approval. _(исходный статус: OPEN; строка 829)_

### MASTER_TASK_REGISTRY_RU.md — F4. Исторический общий backlog
- [ ] **REGISTRY-002** **REGISTRY-002**: Свести дубли и cross-link исторические пункты с текущим кодом, PR, tests and owner gates. Ничего не удалять до reconciliation. **Progress 2026-11-08:** full inventory audit recorded in section H: master 599 stable IDs (482 open / 95 partial / 22 done); addendum 128 stable IDs (46 open / 60 partial / 22 done). `REGISTRY-002` is the only shared ID between the two files; no duplicate or unnumbered checklist rows remain in either register. Source drift candidates after the first source corrections: USER_REQUEST has 113 open/partial source boxes vs 113 open/partial UR IDs after adding UR-310 for the remaining stop-control accessibility review; V016 is aligned at 27/27 after retiring the server-memory graph item; Landing UX has 24 open/partial boxes; its aServi provider-settings line is the same first-party routing goal as UR-272 and should be cross-linked rather than counted as a second task; V1 has 31 open/partial source boxes vs 37 registry open/partial rows; a text-level spot check found no confirmed status mismatch, while line-number-only mapping is stale and six registry rows are candidate newer owner/acceptance slices; LAUNCH has 46 open source boxes vs 48 canonical registry rows after cross-linking LAUNCH-217/271 → LAUNCH-122 and LAUNCH-278 → LAUNCH-126; the remaining two rows are more granular/cross-cutting acceptance items requiring description-level reconciliation. CHATSET and GUIDE now align after CHATSET-111/GUIDE-553 retirement reconciliation. VOICE2-106…112 → VOICE-004…010; VOICE2-113 → VOICE-TRACK-010; VOICE2EXT-080…087 → VOICE-EXT-001…008; USER126-254…258 → USER125-254…258. Distinct VOICE-011…018 and AUDIO-GEN-001…009 are now individually tracked in master; the Voice source crosswalk is complete. Preserve every source row until content-level mapping is complete. _(исходный статус: OPEN; строка 834)_

### MASTER_TASK_REGISTRY_RU.md — F5. Voice 2.0 — независимый research pass (2026-10-31)
- [ ] **VOICE-EXT-001** **VOICE-EXT-001**: Проверить Qwen3-ASR exact model-card license, inference backend and target-host resource profile. **Progress:** repository code license Apache-2.0 confirmed; exact weights terms and vLLM streaming footprint pending. _(исходный статус: PARTIAL; строка 839)_
- [ ] **VOICE-EXT-002** **VOICE-EXT-002**: Проверить Typhoon 115M exact model/NeMo compatibility, artifact hashes, CC-BY attribution and resource needs. **Progress:** model card reports CC-BY-4.0 weights, Apache-2.0 code, NeMo pinned runtime and H100 benchmark; target-host test pending. _(исходный статус: PARTIAL; строка 840)_
- [ ] **VOICE-EXT-003** **VOICE-EXT-003**: Build Thai code-switch benchmark slice with Latin/Thai entity preservation and raw-vs-normalized transcripts. _(исходный статус: OPEN; строка 841)_
- [ ] **VOICE-EXT-004** **VOICE-EXT-004**: Compare ICU, PyThaiNLP RTGS/thai2rom/TLTK and uroman on consented RU/TH fixtures; no runtime dependency yet. _(исходный статус: OPEN; строка 842)_
- [ ] **VOICE-EXT-005** **VOICE-EXT-005**: Verify uroman license and exact language-specific behavior before redistribution. _(исходный статус: OPEN; строка 843)_
- [ ] **VOICE-EXT-006** **VOICE-EXT-006**: Compare LiveKit vs Pipecat against current FastAPI/browser contracts and operational footprint; no migration. _(исходный статус: OPEN; строка 844)_
- [ ] **VOICE-EXT-007** **VOICE-EXT-007**: Extend voice acceptance matrix to full-duplex interruption, echo, Bluetooth, mobile lifecycle and diarization. _(исходный статус: OPEN; строка 845)_
- [ ] **VOICE-EXT-008** **VOICE-EXT-008**: Review audio/text retention, consent, user correction and privacy threat model. _(исходный статус: OPEN; строка 846)_

### MASTER_TASK_REGISTRY_RU.md — F6. Физическая изоляция future/research PR
- [ ] **GOVERNANCE-008** **GOVERNANCE-008**: Проверить GitHub rulesets/branch protection и запретить автоматический merge holding branch в main без explicit owner approval. _(исходный статус: OPEN; строка 855)_

### MASTER_TASK_REGISTRY_RU.md — F7. Deep Research 2.0 — отдельный workstream
- [ ] **DR2-004A** **DR2-004A**: Проверить текущие research/RAG/memory/local source/media/coding foundations; line-by-line audit and independent research still pending. **Progress:** repository code search + first independent primary-source pass completed; see `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md`. _(исходный статус: PARTIAL; строка 863)_
- [ ] **DR2-005A** **DR2-005A**: Выполнить 21 задачу DR2-001…DR2-021 из Deep Research 2.0 plan. **Progress:** external source pass completed (Local Deep Research, Khoj, Letta, Graphiti, OpenViking, browser file APIs, OpenHands sandbox, Comfy API v2, Runway, Vertex AI Veo); target browser/device and benchmark checks remain pending. _(исходный статус: PARTIAL; строка 864)_
- [ ] **DR2-006A** **DR2-006A**: После owner review подготовить отдельные минимальные implementation PR; не переносить будущие функции напрямую из holding branch. _(исходный статус: OPEN; строка 865)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — A. Functions / Agents menu — PR #131
- [ ] **MENU-001** **MENU-001** — inventory the Functions menu against `index.md`, `assets/css/landing.css` and `tests/e2e/app.spec.mjs`; finish the handler/permission/data-scope/evidence matrix. _(исходный статус: PARTIAL; строка 22)_
- [ ] **MENU-002** **MENU-002** — базовая иерархия уже существует как 4 группы (task workflow, research/sources, create/transform, connections); расширить вложенные категории Agents/Skills/Files/Media/Models/Tasks без дублирования. _(исходный статус: PARTIAL; строка 23)_
- [ ] **MENU-003** **MENU-003** — текущие roadmap items уже показывают non-runtime ticker и пояснение; формализовать единый status model для всех карточек. _(исходный статус: PARTIAL; строка 24)_
- [ ] **MENU-004** **MENU-004** — текущий agent panel уже показывает mode, team blueprint, use cases, 64 roles, orchestration, models/resources and capabilities; добавить Skill binding, data scope, budgets, approvals and outputs по мере появления реальных handlers. _(исходный статус: PARTIAL; строка 25)_
- [ ] **MENU-005** **MENU-005** — сейчас доступны direct response и sequential four-stage workflow; остальные режимы оставить roadmap-only до независимого runtime. _(исходный статус: PARTIAL; строка 26)_
- [ ] **MENU-006** **MENU-006** — текущие chat profile/team blueprint controls существуют; расширенные model/skill/data/permission/resource/history controls требуют реальных backing APIs. _(исходный статус: PARTIAL; строка 27)_
- [ ] **MENU-007** **MENU-007** — `1ИÆИT10И` tickers, pause controls, reduced-motion CSS and non-runtime notes exist; E2E assertions are authored, but exact-head execution is pending. _(исходный статус: PARTIAL; строка 28)_
- [ ] **MENU-008** **MENU-008** — RU/EN labels and Chromium keyboard path now covered: native summary opens on Enter; panel/menu close on Escape and focus returns to summary; modal moves focus to Close and traps Tab/Shift+Tab; close-button accessible name localizes RU/EN; 320px mobile options assert ≥44px hit targets and no horizontal overflow. Duplicate-control inventory: exactly three top-level actions; the Agents link inside Deep Research is intentional contextual navigation to the same panel, not a fourth menu entry. Exact-head Quality is pending; VoiceOver still requires manual iPhone/Safari verification. _(исходный статус: PARTIAL; строка 29)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — B. Skill Factory и Agent Builder — PR #125 / PR #128
- [ ] **SF-001…SF-007** — Skill lifecycle: source ingestion, evidence/provenance, manifest, license/security scans, generated evals, human review, versioning/rollback. _(исходный статус: OPEN; строка 35)_
- [ ] **AB-001…AB-005** — Agent blueprint: role, Skill versions, model policy, capability scopes, data scope, budgets, approvals, dry-run/evals. _(исходный статус: OPEN; строка 36)_
- [ ] **AW-SK-001…AW-SK-005** — threat model и adversarial tests для imported Skills; inert-by-default scripts. _(исходный статус: OPEN; строка 37)_
- [ ] **AW-UI-001…AW-UI-002** — отображать реальные worker states/concurrency отдельно от inference slots. _(исходный статус: OPEN; строка 38)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — C. Компактные модели / SLM — PR #125
- [ ] **SLM-002** **SLM-002** — подготовить одинаковый RU/EN/TH golden set и схемы для каждого узкого сценария. _(исходный статус: OPEN; строка 48)_
- [ ] **SLM-003** **SLM-003** — измерить cold load, RAM/PSS, VRAM, TTFT, p50/p95, tokens/sec, concurrency and cancellation на целевом хосте. _(исходный статус: OPEN; строка 49)_
- [ ] **SLM-004** **SLM-004** — зафиксировать immutable model digest, quantization, tokenizer/template, runtime, code/weights/dataset licenses. _(исходный статус: OPEN; строка 50)_
- [ ] **SLM-005** **SLM-005** — сравнить с main-only baseline и включать не более одного helper model за раз; default remains off until owner approval. _(исходный статус: OPEN; строка 51)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — C. Voice и audio generation — PR #129
- [ ] **AUDIO-UI-001** **AUDIO-UI-001** — разделить ASR, TTS/voice conversation, non-speech audio generation и post-processing. _(исходный статус: OPEN; строка 56)_
- [ ] **AUDIO-UI-002** **AUDIO-UI-002** — preview/accept/reject, artifact provenance, project attach only after explicit approval. _(исходный статус: OPEN; строка 57)_
- [ ] **AUDIO-SKILL-001** **AUDIO-SKILL-001** — описать media-production Skill с cue sheet, sound generation, audition, sync and export. _(исходный статус: OPEN; строка 58)_
- [ ] **AUDIO-SMALL-001** **AUDIO-SMALL-001** — сравнить компактные модели/backends с baseline на target hardware; не принимать parameter count за benchmark. _(исходный статус: OPEN; строка 59)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — D. Deep Research, local files, conversion, video — PR #130
- [ ] **LSV-001…LSV-014** — browser permissions, local Source Vault, consent/storage modes, extraction, deletion lineage, screenshot-to-code, video workflows and archive policy. _(исходный статус: OPEN; строка 65)_
- [ ] **LSV-015** **LSV-015** — capability matrix File System Access across desktop/mobile browsers. _(исходный статус: OPEN; строка 66)_
- [ ] **LSV-016** **LSV-016** — fallback upload/drag-drop for unsupported browsers. _(исходный статус: OPEN; строка 67)_
- [ ] **LSV-017** **LSV-017** — decide if persistent directory watchers require a local companion; no public filesystem endpoint. _(исходный статус: OPEN; строка 68)_
- [ ] **CONV-001** **CONV-001** — compare Docling with existing parser on RU/EN/TH corpus and resource budgets. _(исходный статус: OPEN; строка 69)_
- [ ] **CONV-002** **CONV-002** — validate screenshot-to-code quality with golden screenshots, no-execution review workspace. _(исходный статус: OPEN; строка 70)_
- [ ] **CONV-003** **CONV-003** — define image→OCR/VLM, page→HTML/CSS, audio→transcript, video→frames/transcript workflows and provenance. _(исходный статус: OPEN; строка 71)_
- [ ] **VIDEO-001** **VIDEO-001** — benchmark ComfyUI/Wan candidate only on suitable GPU hardware and with exact model/checkpoint license review. _(исходный статус: OPEN; строка 72)_
- [ ] **ARCHIVE-001** **ARCHIVE-001** — upstream watchlist: exact versions, SHA-256, source/model/dataset licenses, dependencies, storage size and preservation reason. _(исходный статус: OPEN; строка 73)_
- [ ] **ARCHIVE-002** **ARCHIVE-002** — mirror only after explicit approval and only when licenses/terms permit; never commit weights to Git. _(исходный статус: OPEN; строка 74)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — E. Общие acceptance gates
- [ ] **GATE-001** **GATE-001** — capability maturity matrix partially recorded in `docs/ALANDI_SYSTEMS_MAP_RU.md` (18 systems; current/partial/prototype/specified boundaries). Recent correction: aServi, Functions/Deep Research/Skills and AgentRunStore now reflect merged-main maturity. Fine-grained per-capability evidence and full subsystem sweep remain OPEN. _(исходный статус: PARTIAL; строка 80)_
- [ ] **GATE-002** **GATE-002** — threat model for local file access, untrusted documents, archive bombs, prompt injection, path traversal, malicious scripts and generated code. _(исходный статус: OPEN; строка 81)_
- [ ] **GATE-003** **GATE-003** — verify code, model weights, tokenizer, voice, dataset and workflow licenses independently. _(исходный статус: OPEN; строка 82)_
- [ ] **GATE-004** **GATE-004** — record actual disk/RAM/VRAM/latency/quality on target hardware; no extrapolation from model size. _(исходный статус: OPEN; строка 83)_
- [ ] **GATE-005** **GATE-005** — add exact-head tests and update canonical project state after each bounded implementation stage. _(исходный статус: OPEN; строка 84)_
- [ ] **GATE-006** **GATE-006** — require explicit owner approval before model downloads, runtime/dependency changes, external sync, destructive file operations, deployment or merge. _(исходный статус: OPEN; строка 85)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — F. Chromium and responsive follow-up — PR #131
- [ ] **MENU-011** **MENU-011** — Agent panel: сгруппировать пять future capability sections в три native RU/EN disclosures (use cases/roles; orchestration/models/resources; tools/permissions); сохранить 44px hit targets, keyboard Enter/Space и работу ticker pause. Source/test/documentation committed on PR #131; exact-head Quality/Chromium is still unverified. _(исходный статус: PARTIAL; строка 100)_
- [ ] **E2E-UI-001** **E2E-UI-001** — project settings test now opens the actual project settings modal before using the current-chat project selector. _(исходный статус: PARTIAL; строка 104)_
- [ ] **E2E-UI-002** **E2E-UI-002** — chat-row move/Undo test seeds two projects and one chat, avoiding unrelated queued creation toasts; asserts restored project and stable chat ID. _(исходный статус: PARTIAL; строка 105)_
- [ ] **E2E-UI-003** **E2E-UI-003** — memory tests now open the outer Memory disclosure before interacting with nested Memory tools; privacy opt-in assertions remain unchanged. _(исходный статус: PARTIAL; строка 106)_
- [ ] **A11Y-UI-001** **A11Y-UI-001** — scope ticker locators to the first intended ticker where multiple cards exist; retain reduced-motion and explicit pause checks. _(исходный статус: PARTIAL; строка 108)_
- [ ] **MOBILE-001** **MOBILE-001** — restore 44px new-chat target on mobile despite later sidebar overrides. _(исходный статус: PARTIAL; строка 109)_
- [ ] **MOBILE-002** **MOBILE-002** — remove extra 12px composer-footer padding on short mobile viewports while preserving the device safe-area inset. _(исходный статус: PARTIAL; строка 110)_
- [ ] **MOBILE-003** **MOBILE-003** — reduce clock shell to 56px at <=360px to recover header title width without forcing horizontal overflow. _(исходный статус: PARTIAL; строка 111)_
- [ ] **MOBILE-004** **MOBILE-004** — review actual Chromium screenshots at 320/360/390/768/1024/1440px and manually verify iPhone Safari/VoiceOver. _(исходный статус: OPEN; строка 112)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Продолжение владельца — 2026-11-05
- [ ] **VOSK-2026-002** **VOSK-2026-002** — run same-audio RU golden-set comparison against current whisper.cpp baseline; record WER/CER, RTF, cold/warm latency, peak RSS/PSS, CPU and microphone/noise results on target hardware. No model-quality claim before measurement. _(исходный статус: OPEN; строка 128)_
- [ ] **LANDING-V2-2026-001 — OWNER-PRIORITY DELIVERY (2026-11-13).** Replace the previous frozen/post-landing deferral: the owner now requires a fully working local-first aLandi workstation as the priority product outcome. Canonical scope and phased acceptance are recorded in section K below. Reuse/cross-link existing UI-PROMO-001, FUNCTIONS-DETAIL-001/002, MENU-001…011, UR-080/117…119/226/251…264/290…291, V016-163…172/186/189, LAUNCH-239…256/269…279, VOICE-004…018, SLM-001…005, SF/AB/AW, GATE-001…006, AUDIT-002/004/005/008/010, FIX-006/007, EV-AGENT-RUN-STORE-001, VOSK-2026-001/002, and issue #111. Do not create a parallel backlog. Current active implementation work must converge to main; at steady state retain at most one active product/landing PR. _(исходный статус: PARTIAL; строка 129)_
- [ ] **GRAPHIFY-UI-2026-001** **GRAPHIFY-UI-2026-001** — PR #131 static UI Surface bridge now separates exact selectors (0.65 heuristic score) from token-overlap candidates (0.25), distinguishes classList mutations from DOM selection, and removes nearest-previous-function ownership guesses. Graphify pilot passed on code/test HEAD `c79e983a57d6cc2b87a9296a1334e6d6ed5b3479`; final PR Quality #41981955002 was still running at this checkpoint. Static inference is not browser-computed style or AST-level proof. _(исходный статус: PARTIAL; строка 130)_
- [ ] **CLEANUP-2026-001** **CLEANUP-2026-001** — stale PRs #124, #126, #132, #133 and #141 were closed after their replacements landed. PR #127 was closed after replacement PR #146 passed exact-head Freshness/Quality/Provenance and carried the complete registry. Keep #125/#128/#129/#130 as isolated Draft/HOLD research workstreams, #131 as active V2, #134 as prototype HOLD. GitHub connector currently exposes no direct branch-delete action; do not claim those branches are deleted. Recheck unique commits before any future deletion. _(исходный статус: PARTIAL; строка 131)_
- [ ] **OWNER-GATE-2026-001** **OWNER-GATE-2026-001** — keep Issue #111 open for owner-controlled ruleset, live host, deployment, target-hardware, native device and credentials gates. Do not close it merely to clear the queue. _(исходный статус: OPEN; строка 132)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G1. Завершить ранее начатую безопасную очистку Git
- [ ] **HYGIENE-001** **HYGIENE-001** — получить полный live inventory branches, tags, open/closed PRs и default branch; различить merged, superseded, abandoned, active research, backup и protected refs. _(исходный статус: PARTIAL; строка 143)_
- [ ] **HYGIENE-002** **HYGIENE-002** — для каждого кандидата на удаление проверить merged PR / equivalent tree or commit ancestry, unique commits, exact SHA, open PR/issue/release/workflow references и последний полезный код/документы. _(исходный статус: PARTIAL; строка 144)_
- [ ] **HYGIENE-003** **HYGIENE-003** — подготовить reviewable allowlist с доказательствами и отдельный preserve-list; не удалять main, default, active V2, future/research, backup/archive или незавершённые направления. _(исходный статус: PARTIAL; строка 145)_
- [ ] **HYGIENE-004** **HYGIENE-004** — выполнить удаление только подтверждённых merged/superseded refs после проверки доступного безопасного delete API и owner authorization; если инструмент не поддерживает branch deletion, оставить кандидатов нетронутыми и выдать точные команды/список. _(исходный статус: OPEN; строка 146)_
- [ ] **HYGIENE-005** **HYGIENE-005** — после cleanup повторно сверить branch/PR queue, защиту main, unique commits и ссылочную целостность; записать точный результат и rollback feasibility. _(исходный статус: OPEN; строка 147)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G2. Независимый инженерный аудит — роль External Debugger / Architecture Reviewer
- [ ] **AUDIT-001** **AUDIT-001** — зафиксировать audit baseline (main SHA, active PR heads, dependency/lock/workflow versions) и scope; не смешивать состояние main с экспериментальными ветками. _(исходный статус: PARTIAL; строка 151)_
- [ ] **AUDIT-002** **AUDIT-002** — проследить end-to-end продуктовые потоки UI → browser storage → API/gateway → adapters/providers → persistence/search/memory; проверить контракты, state transitions, data scope и graceful failure. _(исходный статус: PARTIAL; строка 152)_
- [ ] **AUDIT-003** **AUDIT-003** — проверить Python backend: async/sync boundaries, cancellation/timeouts, subprocess lifecycle, concurrency/locking, retries/idempotency, validation, resource bounds, typing, error handling и current API/framework idioms. _(исходный статус: PARTIAL; строка 153)_
- [ ] **AUDIT-004** **AUDIT-004** — проверить HTML/CSS/vanilla JS client: module boundaries, event/listener lifecycle, DOM safety/XSS, storage migrations, race/stale responses, accessibility, responsive behavior, browser compatibility и duplicated state. _(исходный статус: PARTIAL; строка 154)_
- [ ] **AUDIT-005** **AUDIT-005** — проверить все integrations/connections: auth and scopes, CORS, provider isolation, secrets/logging, external API contracts, timeouts/rate limits, fallback behavior, failure recovery и tests with mocks. _(исходный статус: PARTIAL; строка 155)_
- [ ] **AUDIT-006** **AUDIT-006** — проверить dependency/lockfile/CI/workflow supply chain: pinned immutable actions, permissions, caches/artifacts, Python/Node matrices, freshness policy, licenses/provenance и reproducibility. _(исходный статус: PARTIAL; строка 156)_
- [ ] **AUDIT-007** **AUDIT-007** — проверить архитектурное единство: canonical source of truth, naming/API/schema compatibility, duplicated implementations, stale docs, contradictory status claims, feature flags и boundaries between V1/V2/research/prototype. _(исходный статус: PARTIAL; строка 157)_
- [ ] **AUDIT-008** **AUDIT-008** — провести security/privacy pass: trust boundaries, prompt injection, local file/archive parsing, path traversal, SSRF, SQL/XSS, authorization, deletion lineage, sensitive data retention and abuse/resource exhaustion. _(исходный статус: PARTIAL; строка 158)_
- [ ] **AUDIT-009** **AUDIT-009** — подготовить независимый report с FACT / HYPOTHESIS / PROPOSAL, severity P0–P3, evidence (path/line/test/SHA), impact, reproduction, confidence, owner decision needed и acceptance gate. Не объявлять «независимого агента» — аудит выполняется текущим исполнителем в отдельной роли. _(исходный статус: PARTIAL; строка 159)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G3. Исполнение подтверждённых улучшений
- [ ] **FIX-001** **FIX-001** — преобразовать подтверждённые audit findings в дедуплицированные задачи этого реестра/существующих канонических workstreams; назначить приоритет, scope, acceptance и rollback. _(исходный статус: PARTIAL; строка 163)_
- [ ] **FIX-002** **FIX-002** — исправлять минимальными вертикальными slices в разрешённых ветках; сначала регрессионный тест, затем patch; не менять больше одной крупной архитектурной переменной за цикл. _(исходный статус: PARTIAL; строка 164)_
- [ ] **FIX-003** **FIX-003** — после каждого slice выполнить focused tests, статические/security checks по затронутой поверхности и полный обязательный exact-HEAD CI перед merge. _(исходный статус: PARTIAL; строка 165)_
- [ ] **FIX-004** **FIX-004** — интегрировать в main только V1-совместимые, проверенные и одобренные изменения; PR #131 и Future/Research/Draft workstreams не вливать целиком. _(исходный статус: PARTIAL; строка 166)_
- [ ] **FIX-005** **FIX-005** — после merge перепроверить post-merge main SHA/checks и обновить существующие canonical state/orientation/log записи; deployment и live-host verification остаются отдельными gates. _(исходный статус: OPEN; строка 167)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G4. Целостность и функциональная приёмка
- [ ] **INTEGRITY-001** **INTEGRITY-001** — проверить связность навигации/документации/реестров и отсутствие потерянных owner requirements; подтвердить ссылки, anchors, IDs, workflow manifests и machine-readable state. _(исходный статус: PARTIAL; строка 171)_
- [ ] **INTEGRITY-002** **INTEGRITY-002** — выполнить regression matrix основных сценариев чата, истории, проектов, импорта/экспорта, настроек, provider routing, tools/research, memory/RAG, voice и document intake с точным разделением mocked CI и live runtime. _(исходный статус: OPEN; строка 172)_
- [ ] **INTEGRITY-003** **INTEGRITY-003** — проверить schema/data compatibility и миграции browser storage / SQLite / API payloads; проверить backward compatibility и failure recovery без повреждения пользовательских данных. _(исходный статус: PARTIAL; строка 173)_
- [ ] **INTEGRITY-004** **INTEGRITY-004** — подтвердить согласованность UI claims, feature flags, backend capabilities, tests, docs и release state; убрать/исправить только доказанные противоречия. _(исходный статус: PARTIAL; строка 174)_
- [ ] **INTEGRITY-005** **INTEGRITY-005** — зафиксировать непроверяемые без owner device/credentials/host условия (iPhone/VoiceOver, VPS/Tunnel/Ollama, OAuth, real providers, target hardware) как OPEN, не подменяя их CI. _(исходный статус: PARTIAL; строка 175)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G6. Follow-up tasks from phase-1 report
- [ ] **FIX-006** **FIX-006** — move Pyodide execution to a dedicated Worker or isolated execution surface; add timeout/termination, memory/output bounds and tests proving no page-origin access. Do not claim complete sandbox before this gate. _(исходный статус: OPEN; строка 195)_
- [ ] **FIX-007** **FIX-007** — design a bounded document-extraction concurrency gate when the feature is enabled; add cancellation, queue saturation and memory-pressure regressions. _(исходный статус: OPEN; строка 196)_
- [ ] **FIX-008** **FIX-008** — browser asset inventory recorded in `docs/REPOSITORY_HYGIENE_RU.md` §15: Tailwind Play CDN is mutable and officially development-only; marked 18.0.14 and DOMPurify 3.4.16 are versioned but lack SRI. Static Tailwind build + local/versioned vendor assets recommended. No guessed hashes or runtime/build changes; implementation and exact-head visual regression remain OPEN. _(исходный статус: PARTIAL; строка 197)_
- [ ] **HYGIENE-006** **HYGIENE-006** — delete only the verified allowlist after an authorized branch-delete API/UI is available; preserve every branch HEAD SHA and recheck open references immediately before deletion. _(исходный статус: OPEN; строка 198)_
- [ ] **AUDIT-010** **AUDIT-010** — finish subsystem review of provider routing, browser storage migrations, voice/audio lifecycle, RAG deletion lineage, V2 candidate slices and native device/runtime behavior. _(исходный статус: OPEN; строка 199)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Browser persistence integrity and follow-up debugger findings — 2026-11-05
- [ ] **AUDIT-FIND-011 — P1 localStorage recovery/data integrity.** Confirmed in `index.md`: project JSON parse/shape failures were silently reduced to an empty list without preserving raw data; partially invalid chat arrays could drop records without backup; `persistChats()` wrote chat list and current ID separately without rollback; create/delete/import project operations could partially persist while showing success. PR #150 branch `fix/browser-storage-recovery-atomicity-20261105` implements raw recovery backups, fail-closed behavior when backup creation fails, direct download of original raw payload, rollback for chat/current and project/chat writes, in-memory rollback, success-state gating, import bounds and four Chromium regressions. **Status: IMPLEMENTED IN PR #150; exact-head Quality (7 jobs), Freshness, Provenance and Graphify PASS. PR remains open/unmerged; owner review/merge decision pending.** _(исходный статус: PARTIAL; строка 206)_
- [ ] **FIX-009 — transactional browser persistence.** Exact-head CI and injected-quota Chromium rollback regressions pass on PR #150 HEAD `0c2cf9f15c9cef6053487e5f01adadcb8917115e`. Before closure, complete manual diff/call-site review and owner merge decision; keep localStorage keys/version compatibility unchanged. _(исходный статус: PARTIAL; строка 207)_
- [ ] **UNVERIFIED** **AUDIT-FIND-012 — P2 conditional FTS5 secure-delete capability.** `MemoryManager` only enables the FTS5 `secure-delete` option on SQLite 3.42.0+; on older SQLite the capability flag is false but logical deletion still proceeds. The capability is not exposed through health/status APIs. Deleted FTS entries may remain in index segments until merge; logical deletion is not forensic erasure. Runtime SQLite version and feature enablement on the target host are **UNVERIFIED**. Reference: https://www.sqlite.org/fts5.html#the_secure_delete_configuration_option. _(исходный статус: OPEN; строка 208)_
- [ ] **FIX-010 — surface FTS5 deletion capability.** Report SQLite runtime version and FTS5 secure-delete capability in a health/diagnostic surface; document the deletion guarantee accurately; test supported and unsupported SQLite versions before enabling MemoryGraph/RAG on a host. _(исходный статус: OPEN; строка 209)_
- [ ] **AUDIT-011 — target-host SQLite/runtime verification.** Verify the actual VPS Python-linked SQLite version, FTS5 availability, feature flags and deletion behavior; do not infer from CI's Python runtime. _(исходный статус: OPEN; строка 210)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — H. Owner priority reset and recurring requirements — 2026-11-07 (append-only)
- [ ] **UI-PROMO-001 — owner UI backlog §§8.1–8.17 and later requirements (P1; IN PROGRESS / PARTIALLY PUBLISHED).** Canonical scope remains `docs/V1_UI_FINALIZATION_RU.md` plus existing MENU/UI/E2E/MOBILE IDs; deduplicate and enrich, do not create another backlog. §8.8 icon-first message actions are merged via PR #157; §8.1 sidebar swipe-to-close is merged via PR #161 at `094e249860b651166d4d1029f175e97a5cea2345`. §8.17 adjustable readability controls are **IMPLEMENTED, MERGED and PUBLISHED** via PR #166 at main SHA `c4f23e03f563d03213eb87002863da630fc8b833`: message font size 14–22 px, line-height 1.4–2.0, and standard/high-contrast color scheme; users access them in the root app's global gear/settings → “Читаемость текста”. Exact PR-head Quality #42368514164 (7/7) and Graphify #42368514210 passed; post-merge Pages #42372745873 and main Quality #42372746360 passed, including 116 Chromium tests and canonical root/landing exact SHA checks. Remaining UI scope stays OPEN. PR #154 remains stale/diverged (base `f323b6f339d454dad6e820a4074fa230acc7b6df`, head `6ca47522d7d6998916b1b01931c217d8b7e76c75`); prior Quality #42349173942 failed 17 E2E + 1 flaky and Freshness #42349173878 failed. **Do not merge #154 as-is or weaken tests.** Reconcile only useful slices against current main, preserving #147/#148/#150; repair real behavior/selector failures and rerun exact-head Quality/Freshness/Provenance/Graphify. #131 remains a selective workbench, never wholesale merge. Native iPhone Safari/VoiceOver/manual visual acceptance remains open. _(исходный статус: PARTIAL; строка 225)_
- [ ] **SRC-001 — grouped external-source research and artifact acquisition (P2).** Continue `INTEL.md` and the existing source-selection method. **Progress (2026-11-07):** reviewed the owner's full named list against official upstream repositories/README/license/docs/release notes; recorded exact branch HEADs, declared code/model licenses, capabilities, security/privacy constraints and triage decisions in `INTEL.md` and `docs/OPEN_SOURCE_TRIAGE_RU.md`. Candidates include two distinct, ambiguous Flint repositories; DashBeam; img2threejs; ArchiveBox; SearXNG; Ponytail; changedetection.io; LocalSend + protocol; MiroFish; Edge-Drop; Craft Anything; Agent Lightning; Datalab Marker/Surya; diagram-design; HarnessRouter; Sound Center; PocketPal AI; and sammyZi/pdf-tools. **No code, model, binary, dataset or Skill was downloaded, installed, copied or activated.** Next: run bounded baseline comparisons for SearXNG, Marker/Surya and changedetection.io only when prioritized; review HarnessRouter contracts separately. For each acquisition: exact upstream revision, source URL, separate code/weight/data license, SHA-256, provenance, target fit and storage policy. Do not bulk-mirror restricted/oversized weights or activate unapproved runtime; require explicit review and owner approval before downloads or adoption. _(исходный статус: PARTIAL; строка 227)_
- [ ] **HYGIENE-007 — verified obsolete-code and branch/PR cleanup (P3).** Identify exact dead/duplicate code through references, dependency/call-site review, tests and architecture evidence; remove only after rollback review. Selectively consolidate useful PR work into #131 or main; preserve backup/orientation/active-scope/evidence-bearing work. No branch/PR/history deletion without explicit owner approval and fresh reference checks. _(исходный статус: OPEN; строка 228)_
- [ ] **CHAT-001 — continuity and failure-resistant checkpointing (P1).** Owner reports recent ChatGPT chats can hang/error, then history becomes inaccessible and the work must be discarded. Mitigate what the repository/workflow can control: compact durable checkpoints containing task ID, branch/HEAD, changed artifacts, exact checks, blockers and next step; avoid repeated context requests, duplicate implementations and oversized handoffs. Do not claim this fixes the ChatGPT client/history failure itself; investigate it as a separate product/client issue only with reproducible evidence. _(исходный статус: OPEN; строка 229)_
- [ ] **OWNER-REQ-001 — task capture invariant.** Before execution, search canonical register for each newly stated owner goal; add a new stable task ID or enrich existing entry. Maintain original goals and relative order even when higher priority work temporarily supersedes them. No silent dropping, duplicate backlog, or status upgrade without evidence. _(исходный статус: OPEN; строка 230)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — I. Owner execution contract — 2026-11-08 (append-only)
- [ ] **MAIN-ONLY-001 — one durable product baseline.** Keep `main` as the only durable product baseline. Use temporary PRs only for bounded exact-head verification and merge promptly after all required gates pass. Audit every open PR; port compatible value; do not merge stale/conflicting/draft/future/V2 work wholesale. Close superseded PRs only after a file-by-file reconciliation and a recorded reason. **Acceptance:** no completed slice remains parked; every remaining open PR has a current owner-approved disposition and explicit next action. _(исходный статус: PARTIAL; строка 245)_
- [ ] **SYSTEMS-MAP-001 — compact system/subsystem inventory.** Maintain `docs/ALANDI_SYSTEMS_MAP_RU.md` as the concise canonical catalog of systems, implementation surfaces, methods and maturity. Cross-link `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for code-level detail. **Acceptance:** each listed system has source paths, current method, maturity and a clear unverified boundary; no second backlog is created. _(исходный статус: PARTIAL; строка 246)_
- [ ] **AGENT-CONTRACT-001 — effective English operating instruction.** Keep `AGENTS.md` short and operational: live orientation, one active slice, exact-head verification, source quality, main-first delivery, durable recording and product invariants. `NOW.md` is the sole first-read checkpoint and owner-request/action journal. **Acceptance:** a fresh session can identify the next safe action from repository state and one checkpoint. _(исходный статус: PARTIAL; строка 247)_
- [ ] **CONTINUITY-001 — step-level durable evidence.** Record every owner prompt verbatim and every material stage in `NOW.md`; update the current checkpoint and next action in that same file. Record branch/PR/HEAD, changed files, check IDs/results, what was not checked, rollback and next step. Do not store chat transcripts or private reasoning. **Acceptance:** no material step needs to be repeated after a new chat. _(исходный статус: PARTIAL; строка 248)_
- [ ] **SRC-002 — recurring thematic source batches.** Continue from the existing `INTEL.md` inventory (310 distinct URL references / 183 GitHub repositories at the 2026-11-08 count). Review 8–15 high-signal sources per thematic batch and occasionally run a cross-cutting sweep. Prefer primary sources; record revision, date, license, evidence, resource fit, decision and limits. Preserve prior research and distinguish source-validated from accepted/implemented. _(исходный статус: PARTIAL; строка 249)_
- [ ] **ARTIFACT-001 — controlled source/model acquisition.** Owner authorizes acquisition of useful tools and model artifacts. For each selected item verify upstream revision, separate code/weights/data/voice license, provenance, SHA-256, size, security, privacy and target hardware. Keep manifests and verification scripts in Git. Do not put weights in the GitHub Pages source tree: Git LFS is unsupported by Pages. Use a model cache/registry or governed GitHub Release asset where legal and within limits. Do not bulk-download unrelated or oversized assets. _(исходный статус: PARTIAL; строка 250)_
- [ ] **PAGES-002 — post-integration release verification.** Preserve the official GitHub-managed main-push Pages path. After every integration verify the Pages deployment and canonical published content against the exact merge SHA; do not add duplicate deployment workflows or claim VPS health from Pages checks. _(исходный статус: PARTIAL; строка 251)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J. Owner directive — orchestration, main-only delivery, systems inventory and source loop (2026-11-08)
- [ ] **ORIENT-004 / MAIN-ONLY-001 — operational handoff and PR completion.** Replace inefficient orchestration with a compact main-first Session Sync Capsule: live main SHA, PR queue (base/head/status/draft), issues, exact-head checks, Pages status; select task from owner intent + canonical register. One active bounded implementation lane. Merge only exact-head green compatible scope; after merge run main integrity/quality and end-to-end Pages checks; close superseded/parking PRs only after preserving value and recording reason. Append compact checkpoint at each material step to VOLLEY_LOG and synchronize orientation/state records only when facts change. No dangling completed PRs. _(исходный статус: PARTIAL; строка 279)_
- [ ] **SYS-MAP-001 — whole-product systems/subsystems/methods inventory.** Use existing docs/ALANDI_SYSTEMS_MAP_RU.md as canonical map (no duplicate catalog); trace every listed subsystem to source files, contracts, tests, maturity and dependencies. Review methods against current primary sources and the existing technique register; promote replacements only with evidence/baseline/rollback. Record gaps and versioned changes. _(исходный статус: PARTIAL; строка 280)_
- [ ] **INSTR-001 — concise English executor contract.** Replace AGENTS.md with the compact owner-focused operating contract: main-only durable baseline; oledue/ORIENTER live sync; one canonical register; sequential bounded delivery; exact-head verification; immediate authorized merge and main/Pages post-check; durable Volley checkpoints; research/license/security/provenance gates; no speculative runtime. _(исходный статус: PARTIAL; строка 282)_
- [ ] **PAGES-LIVE-001 — verify auto-publication.** After each authorized main integration, confirm GitHub-managed Pages deployment on the exact merge SHA and cache-busted public root/asset version. Diagnose/repair existing auto-publish mechanism if broken; do not infer live deployment from build success. _(исходный статус: PARTIAL; строка 283)_
- [ ] **ACQUIRE-001 — governed acquisition.** For useful models/tools/microtechnologies/plugins/skills, assess concrete task fit, source/version, license, checksum, provenance, storage, budget and target hardware. Download into repository only where size, redistribution rights and repository policy permit; model weights must use suitable governed asset storage, not Pages source tree/Git LFS. Pilot before runtime adoption. _(исходный статус: PARTIAL; строка 284)_
- [ ] **FUNCTIONS-DETAIL-002 — owner-directed Functions panel detail.** Preserve three truthful entrypoints (Agents/structured analysis, Deep Research, Skills/task profile) while expanding their details: current runtime behavior vs roadmap; role/workflow, model/resources, tools/permissions; research effort/web orthogonality; skill lifecycle/profile/output. Modal backdrop blur and focus/escape/close lifecycle are explicit acceptance. Integrations remain hidden absent real registry/status/permissions. Research Studio stays retired. _(исходный статус: PARTIAL; строка 285)_
- [ ] **PR-QUEUE-001 — consolidate the live PR queue into main.** Owner's explicit 2026-11-08 instruction: merge every currently open PR after its final exact-head required checks pass. Live queue is currently only PR #174; merge it when green, then verify main Quality and Pages on the exact merge SHA. Closed/stale/HOLD PRs #125/#131/#152/#154/#155/#168/#171/#172 are not to be merged wholesale; selectively preserve compatible unique work and keep their deferred tasks in the canonical register. _(исходный статус: PARTIAL; строка 286)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J.4 AgentRun state persistence prototype — 2026-11-08 (PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`; prototype only)
- [ ] **EV-AGENT-RUN-STORE-001** **EV-AGENT-RUN-STORE-001** — evaluation definition exists; backup/restore, retention, multi-host, recovery semantics and adversarial runtime tests remain OPEN. _(исходный статус: PARTIAL; строка 313)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J.6 Full checklist and supply-chain audit — 2026-11-08
- [ ] **REGISTRY-002 source reconciliation:** candidate source drift is recorded in the main registry section H. Current count deltas after source corrections: USER_REQUEST 113 open/partial vs 112 UR open/partial IDs (+1 candidate); V016 aligned 27/27; Landing UX 24 vs 23 UX open/partial IDs (+1 candidate); V1 30 source open/partial vs 37 registry open/partial; LAUNCH 46 source open vs 51 registry rows; VOICE2 17 source open/partial vs 8 VOICE2 IDs, with overlap against VOICE/VOICEAUDIT/LAUNCH. CHATSET and GUIDE now align after retirement updates. V1/LAUNCH/VOICE still need content-level mapping before status changes. _(исходный статус: OPEN; строка 328)_
- [ ] **ACTION-TRANSITIVE-001** **ACTION-TRANSITIVE-001** — the pinned `skills/exercise-toolkit` reusable workflow revision `ebf43bb96882683e03e667184c6445ed4c8074e6` has 14 nested mutable action references across three workflows. `start-exercise.yml` grants workflow-wide `contents/actions/issues: write`, although only `disable_workflows` needs `actions: write`, `create_exercise` needs `issues: write`, and `update_readme` needs `contents: write`; `finish-exercise` uses contents+issues write in one job; `find-exercise-issue` uses issues read. Local pin checker does not recurse into upstream dependencies. Replace/fork with reviewed local equivalents or pin nested dependencies and reduce permissions before closing #111. _(исходный статус: OPEN; строка 332)_

## 4B. Retired by owner — do not restore
### MASTER_TASK_REGISTRY_RU.md — UR — Исторический пользовательский реестр
- [ ] **UR-062 — RETIRED BY OWNER 2026-11-07** (строка 62; D. Чаты, проекты, инструкции и память): experimental server-memory graph API and opt-in browser bridge removed from UI and gateway. Preserve browser-local memory, conversation delta sync and independent RAG. Existing server DB files are not deleted; live host is unverified. _(исходный статус: RETIRED; строка 93)_
- [ ] **UR-070 — RETIRED BY OWNER 2026-11-07** (строка 70; D. Чаты, проекты, инструкции и память): temporal/conflict/recursive-delete test scope belonged to the removed server-memory graph prototypes; do not recreate that subsystem. _(исходный статус: RETIRED; строка 99)_
- [ ] **UR-201 — RETIRED BY OWNER 2026-11-07** (строка 201; I. Следующие продуктовые вертикали): do not enable retired server-memory graph/global flags; API code removed. Preserve any existing DB file until a separate backup/retention decision. _(исходный статус: RETIRED; строка 139)_

### MASTER_TASK_REGISTRY_RU.md — V016 — GEN1 / CRAZE V-016
- [ ] **V016-152 — RETIRED BY OWNER 2026-11-07** (строка 152; P1 — required next implementation slices): backend server-memory graph removed; its isolation/deletion/global-opt-in test scope is no longer applicable. Keep separate RAG scope/deletion tests. _(исходный статус: RETIRED; строка 176)_

### MASTER_TASK_REGISTRY_RU.md — V1 — Канонический чек-лист V1 UI
- [ ] **V1-154** **V1-154** (строка 154; 15. Research Studio — RETIRED): По прямому указанию владельца Research Studio удалена из интерфейса и приложения; не восстанавливать из старых PR/документации. Исследовательский pipeline как capability чата не удалён. _(исходный статус: RETIRED; строка 289)_
- [ ] **V1-155** **V1-155** (строка 155; 15. Research Studio — RETIRED): UI-проверки модального окна больше не применимы; regression test подтверждает отсутствие удалённого shortcut/modal и отсутствие горизонтального overflow на 390px. _(исходный статус: RETIRED; строка 290)_

### MASTER_TASK_REGISTRY_RU.md — GUIDE — `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`
- [ ] **GUIDE-553 — RETIRED BY OWNER 2026-11-07** (строка 553; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Owner removed the server-memory graph; this auth/scope/cascade-delete gate is obsolete. Do not restore the graph. _(исходный статус: RETIRED; строка 516)_


## 4C. Дополнительные актуальные source checklists (перенесены при консолидации 2026-11-18)

Эти строки появились или обновлялись позднее исторического master registry. Повторяющиеся stable IDs и точные дубликаты исключены; исходные пути и строки сохранены. Source checkbox — историческая отметка и не заменяет текущую проверку.

### Open / partial
### docs/USER_REQUEST_CHECKLIST.md — A. База, управление и непрерывность
- [ ] Проверить все старые регрессии: создание чата, история, экспорт/импорт, отмена, повтор запроса. _(source line 14)_
- [ ] Обновить сведения о реальном состоянии системы: код, контракт, эксперимент, развёрнутая служба, измеренная метрика. _(source line 15)_

### docs/USER_REQUEST_CHECKLIST.md — B. Первичное облако aLandi и API-провайдеры
- [ ] Начальный статус облака — красный/неподтверждённый; зелёный возможен лишь после реального модельного ответа и успешной `/healthz`-проверки при следующем запуске. Живой пользовательский gateway ещё не сконфигурирован. _(source line 20)_
- [ ] Хранить адрес, модель и ключ aLandi отдельно; не считать наличие ключа доказательством связи. _(source line 21)_
- [ ] Проверять сохранённое соединение при запуске через health-check, а не доверять вечному старому зелёному статусу. _(source line 22)_
- [ ] Перенести старые настройки провайдеров в свёрнутый дополнительный раздел. _(source line 23)_
- [ ] Вынести ключ Tavily в под-раздел инструментов и веб-поиска. _(source line 24)_
- [ ] Добавить кнопку вставки для ключей провайдера и своего gateway. _(source line 25)_
- [ ] После явной вставки ключа запускать один ограниченный refresh каталога и тест соединения. _(source line 26)_
- [ ] Блокировать конкурирующие одновременные тесты подключения. _(source line 27)_
- [ ] При явной ошибке доступности модели искать не более трёх альтернатив того же провайдера. _(source line 29)_
- [ ] Не делать retry альтернативных моделей на 401/403, 429, сетевой ошибке или общем сбое API. _(source line 30)_
- [ ] Принимать корректные текстовые массивы, refusals/tool-calls и варианты совместимого ответа, не путать валидный JSON-envelope с ошибкой формата. _(source line 31)_
- [ ] Kilo Auto Free доступен как обычный альтернативный провайдер в общем списке: без ключа, только по явному выбору и без скрытого fallback. Официальная документация предупреждает, что промпты могут поступать провайдерам, которые логируют их/используют для улучшения моделей; конфиденциальные данные туда не отправлять. См. `docs/V016_IMPLEMENTATION_CHECKLIST.md` и [официальное предупреждение Kilo](https://kilo.ai/docs/getting-started/using-kilo-for-free). _(source line 32)_
- [ ] Обновить все модельные ID по официальным динамическим каталогам; статические preset считать только fallback. _(source line 33)_
- [ ] Провести E2E-проверку реального пользовательского выбора Kilo и документацию об обработке данных сторонним шлюзом. _(source line 34)_
- [ ] Проверить официальные endpoints, CORS, лимиты, схему аутентификации и формат ошибок каждого сохранённого провайдера. _(source line 36)_
- [ ] Никогда не переносить ключи из одного провайдера в другой и не экспортировать ключи в settings-profile. _(source line 37)_

### docs/USER_REQUEST_CHECKLIST.md — C. Главный экран, визуальная система и язык
- [ ] Переоформить шапку в бренд aLandi и перенести название активного чата в подпись. _(source line 40)_
- [ ] Добавить пасхалку «a land i → i land AI». _(source line 41)_
- [ ] Добавить реальные цифровые часы и аналоговые стрелки с дискретным обновлением. _(source line 42)_
- [ ] Добавить основной переключатель тёмной/светлой темы на главном экране. _(source line 43)_
- [ ] Добавить RU/EN переключатель и сохранять выбранный язык. _(source line 44)_
- [ ] Обновить шрифтовой fallback без обязательной внешней загрузки; улучшить радиусы и состояния элементов. _(source line 45)_
- [ ] Реализовать центрирование поля ввода в пустом чате и увеличение высоты по мере ввода. _(source line 46)_
- [ ] Перемещать длинный черновик из центрального режима в привычную нижнюю позицию. _(source line 47)_
- [ ] Добавить ограниченное прикрепление текстовых файлов (.txt, .md, .csv, .json, .log) с размерными лимитами. _(source line 48)_
- [ ] Мобильная кнопка голоса, удержание и свайп покрыты успешным PR #21 Chromium E2E. Это только preview: микрофон, ASR, TTS, AEC и аудиотранспорт не подключены. _(source line 49)_
- [ ] Полностью пройти мобильную/настольную проверку размеров и областей касания. _(source line 50)_
- [ ] Проверить клавиатурную доступность, visible focus, контраст, screen reader и reduced-motion. _(source line 51)_
- [ ] Перевести все пользовательские надписи, подсказки и ошибки интерфейса; текущий RU/EN перевод неполный. _(source line 52)_
- [ ] Сокращены ключевые инструкции настроек: cloud/API, ключи, CORS, контекст и веб-поиск. Полный аудит всех подсказок и согласование RU/EN ещё не завершены. _(source line 53)_
- [ ] Провести визуальную регрессию desktop/mobile и проверить, что анимации не мешают длинному вводу. _(source line 54)_

### docs/USER_REQUEST_CHECKLIST.md — D. Чаты, проекты, инструкции и память
- [ ] Project CRUD присутствует в клиенте: создать, переименовать/редактировать, удалить с подтверждением; повторно проверить E2E на текущей ветке. _(source line 57)_
- [ ] Проектные инструкции редактируются и добавляются в контекст как предпочтения, не как политика безопасности; подтвердить тестами precedence. _(source line 58)_
- [ ] Текущий чат можно привязать/отвязать от проекта; проектная принадлежность видна в интерфейсе. _(source line 59)_
- [ ] Есть экспорт/импорт project bundle с чатом, инструкциями и памятью; проверить схему, duplicate IDs, limits, malicious content. _(source line 60)_
- [ ] Browser-local global/project memory имеют отдельные явные toggles; global context по умолчанию выключен. E2E проверяет состояние переключателя, но отдельный multi-project prompt-leak test для browser-local global facts ещё не закрыт. _(source line 61)_
- [ ] Реализовать authenticated API/индексацию project sources только после согласованного backend contract; не имитировать работающий индекс на пустой заглушке. _(source line 63)_
- [ ] Межпроектные проверки: RAG retrieval/delete — `gateway/tests/test_six_layers.py::test_rag_retrieval_preserves_citations_and_isolates_scopes` и `test_rag_scope_bound_ids_allow_same_document_name_without_leak_or_cross_delete`; Evidence Ledger — `gateway/tests/test_coder_packet.py::test_evidence_ledger_stores_scoped_provenance_and_exact_quote`; exact-response cache — `gateway/tests/test_app.py::test_exact_cache_key_separates_project_specific_prompt_context`. Cache key зависит от полного payload, а не от отдельного project-ID ACL; browser-global memory leak test и отдельный cache project-scope contract остаются открытыми. Серверная graph-memory изоляция retired. _(source line 64)_
- [ ] RAG source deletion is scope-checked and removes chunk/concept/FTS rows; SQLite `secure_delete` plus version-gated FTS5 `secure-delete` regression tests passed on PR #24 HEAD and post-merge main. This still does **not** erase evidence-ledger copies, WAL/journals, backups or browser-local source copies; system-wide crypto-erasure remains open. _(source line 65)_
- [ ] Проверить экспорт, исправление и удаление пользовательских фактов и связанные derived records. _(source line 66)_
- [ ] Реализовать удаление/криптостирание по всем реальным слоям; не обещать SLA ≤60 секунд без измерения. _(source line 67)_
- [ ] Полноценный viewer источников/индекса, citation lineage и cross-device project memory остаются задачами последующих фаз. _(source line 71)_

### docs/USER_REQUEST_CHECKLIST.md — E. Инструменты, маршрутизация, веб-поиск и отказы
- [ ] Сохранить ограничение по числу шагов инструментов и исследовательских вызовов; не запускать неограниченный retry loop. _(source line 74)_
- [ ] Сохранить явный opt-in для fallback к другому облачному провайдеру. _(source line 75)_
- [ ] Проверить все циклы tool-calls на max rounds, общий deadline, cancellation, bounded concurrency и корректное продолжение assistant/tool messages. _(source line 76)_
- [ ] При ошибке инструмента пробовать совместимый способ/альтернативный инструмент только в пределах явного policy и бюджета. _(source line 77)_
- [ ] Показывать правдивую timeline событий: фактический вызов, источник, duration, результат, ошибка; не показывать скрытые рассуждения. _(source line 78)_
- [ ] Внедрить 12-шаговый Deep Research state machine, повторный поиск при пробелах и проверку утверждений против ссылок. _(source line 80)_
- [ ] Проверить prompt-injection в проектных инструкциях и загруженных документах. _(source line 81)_
- [ ] Проверить SSRF/redirect protections, MIME/size/time limits, безопасную очистку временных файлов и отсутствие секретов в логах. _(source line 82)_
- [ ] Не кэшировать streaming, tool calls, web research, multimedia, errors или partial outputs. _(source line 83)_
- [ ] Проверить точную инвалидацию exact cache при изменении prompt, project instructions или tool schema. _(source line 84)_
- [ ] Измерить retry rate, повторные дубликаты, частоту 429/5xx, latency и успешность tool-циклов. _(source line 85)_

### docs/USER_REQUEST_CHECKLIST.md — F. V-016: зависимости, аудио, память, бюджеты и лицензии
- [ ] Проверить CI-гейт триады: точный проверенный URL + лицензия конкретного артефакта + источник технического утверждения. _(source line 89)_
- [ ] Не включать модели/голоса в установщик до проверки точной лицензии, весов, voice artifact и checksums. _(source line 90)_
- [ ] Внедрить ALBF binary framing только вместе с real transport и тестами на усечение, CRC, max payload и cancellation. _(source line 91)_
- [ ] Сделать bake-off ASR/TTS с измерением RTF, first audio, e2e p95 и потребления PSS; не опираться на неподтверждённые цифры. _(source line 92)_
- [ ] Подтвердить native audio capture/processing прежде, чем обещать отсутствие PCM/аудио hotpath в Python. _(source line 93)_
- [ ] Проверить безопасную изоляцию tool workspace; не называть subprocess без sandbox production-изоляцией. _(source line 95)_
- [ ] Проверить scope isolation, no-PII logs, prompt priority stack и fail-safe privacy policy. _(source line 96)_
- [ ] Измерить профиль laptop_8gb_cpu_mvp на целевом 8-GB железе, включая combined LLM+RAG+tools и cold-tier eviction. _(source line 97)_
- [ ] Не заявлять p95 900/2500 ms, regret ≤1.25, PII leak=0 или crypto-erase SLA, пока нет воспроизводимых evals. _(source line 98)_
- [ ] Полностью пересмотреть список зависимостей/отклонённых технологий в V-016 и не вводить CUT/PAT items как production-зависимости. _(source line 99)_
- [ ] Проверить Third-party NOTICE и права распространения каждой включённой библиотеки/модели. _(source line 100)_

### docs/USER_REQUEST_CHECKLIST.md — G. Выпуск и финальный аудит
- [ ] Пройти Jekyll build, quality sentinels, browser Chromium tests, accessibility/interaction tests и provider-specific deterministic E2E. _(source line 103)_
- [ ] Проверить без реальных секретов: malformed response, 400/404 model missing, 401/403 auth, 429, 5xx, timeout, CORS, offline and cancelled request. _(source line 104)_
- [ ] Проверить, что новая ветка не меняет чужую конфигурацию, историю, секреты или сохранённые настройки молча. _(source line 105)_
- [ ] После merge проверить main SHA, успешные workflows и опубликованную GitHub Pages версию. _(source line 106)_
- [ ] Перепроверить каждый пункт этого реестра перед итоговым отчётом; явно перечислить незавершённое и неподтверждённое. _(source line 107)_

### docs/USER_REQUEST_CHECKLIST.md — Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8
- [ ] Фазы 0–4: gateway/trace, scoped RAG FTS5/evidence/citations и tool safety имеют foundations/prototypes; experimental server-memory graph/temporal/conflict layer retired by owner 2026-11-07. _(source line 117)_
- [ ] Фазы 5–6: подключить настоящий voice runtime и native ASR/VAD/TTS только после лицензий и воспроизводимого hardware benchmark. _(source line 118)_
- [ ] Фазы 7–8: подключить реальную telemetry timeline, authenticated UI API и cloud integration только после backend contract/security review. _(source line 119)_

### docs/USER_REQUEST_CHECKLIST.md — Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты
- [ ] На каждое изменение статуса дополнить eval-отчёт командой, результатом, sample size, SHA и rollback; обновить PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md и соответствующий отчёт. _(source line 169)_

### docs/USER_REQUEST_CHECKLIST.md — Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates
- [ ] Прогнать python -m compileall -q gateway, python -m pytest -q gateway/tests, python gateway/evals/run_six_layer_eval.py и лицензионный CI gate на текущем состоянии ветки. _(source line 174)_
- [ ] Проверить provenance каждого реально поставляемого артефакта: точный источник, применимая лицензия модели/голоса, SHA-256. TBD/непроверенные hashes не могут отмечаться как ship-enabled. _(source line 175)_
- [ ] Измерить на целевом хосте cold/warm p50/p95/p99, RTF, RAM/PSS, аудиодропы, CER/WER и regression sample counts до любых performance claims. _(source line 176)_
- [ ] Развёртывание VPS, DNS, OAuth secrets и создание billable infrastructure не выполнять без актуального account access/проверенных параметров и отдельного согласованного действия. _(source line 177)_

### docs/USER_REQUEST_CHECKLIST.md — Gate перед финальным ответом
- [ ] Пересверить весь этот To do и таблицу ID с текущим HEAD после завершения всех workflows; подробный аудит четырёх частей манифеста — `docs/V016_IMPLEMENTATION_CHECKLIST.md` (81 пункт, §§0–40). _(source line 191)_
- [ ] Указать раздельно: фактически внедрено, проверено CI, подтверждено live, измерено benchmark, осталось prototype/deferred/blocked. _(source line 192)_
- [ ] Не объединять PR и не сообщать о публикации до зелёных релевантных workflow и проверки merge result. _(source line 193)_

### docs/USER_REQUEST_CHECKLIST.md — I. Следующие продуктовые вертикали
- [ ] Первый месяц не создавать платные ресурсы автоматически: GitHub Pages + уже имеющееся железо + Ollama локально; free-tier API считать квотируемым и внешним, не гарантированно бесплатным. _(source line 202)_
- [ ] Оценить одну маленькую helper-модель для классификации, извлечения фактов, кратких сводок и чернового ранжирования. Главная модель остаётся для планирования, сложного reasoning и синтеза. Сравнить качество, latency и RAM перед включением. _(source line 203)_
- [ ] Добавить генерацию изображений отдельным модулем после выбора реального backend (локальный ComfyUI/API или явно выбранный внешний провайдер), проверки точной модели/лицензии/VRAM и mock E2E. _(source line 204)_
- [ ] Не добавлять скрытый refusal-фильтр поверх выбранной модели; не обещать «никогда не отказывает»: поведение checkpoint и правила внешнего API не контролируются приложением. _(source line 205)_
- [ ] Перед переходом на платный сервер сравнить baseline с измерениями p50/p95, RAM, качества, устойчивости, квот и месячной стоимости; менять endpoint/model config без смены контракта UI. _(source line 206)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 owner quickstart and chat ergonomics
- [ ] Real voice capture/ASR/TTS, image/video pipelines and complete document ingestion remain separate unimplemented work; see `docs/IMPLEMENTATION_ROADMAP_RU.md` and the original V-016 evidence ledger. _(source line 213)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 project navigation and composer
- [ ] Real device verification: touch long-press/cancel, mobile keyboard focus/viewport reset, screen reader flow, and large file handling. _(source line 225)_
- [ ] Implement real file intake pipeline for PDF/DOCX/XLSX/OCR/audio/video metadata before claiming all formats are supported. _(source line 226)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — local helper memory suggestions (2026-10-27)
- [ ] Live inference, selected/installed VPS model, output quality, RAM and latency remain unverified. _(source line 235)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — reconciliation of the older mobile and interface request (2026-10-27)
- [ ] Next bounded slice: edge-aware chat-row/popover placement and compact header order/project label/clock polish. Keep these separate from provider/project export-import cleanup and per-chat settings audit. _(source line 243)_
- [ ] Run native iPhone Safari/keyboard/touch verification separately; passing Chromium viewport simulation is not proof of native behavior. _(source line 244)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — autonomous agent orchestration research (2026-10-28)
- [ ] Reconcile current main and open PRs before code changes; audit actual runtime paths rather than relying on module names. _(source line 251)_
- [ ] Implement task contract/state machine and tests in a bounded PR. _(source line 252)_
- [ ] Select and verify a real sandbox before allowing arbitrary command/code execution. _(source line 253)_
- [ ] Add adversarial/golden evaluations, crash/restart and idempotency tests; measure target-host RAM/latency. _(source line 254)_
- [ ] Update PROJECT_STATE.yaml and EVALS.md only with verified implementation/test evidence. Research/documentation completion does not mean runtime implementation. _(source line 255)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — voice model landing and VPS owner steps (2026-10-28)
- [ ] After PR #75 exact-head CI passes and the code is merged, deploy that exact code revision to the VPS; GitHub Pages deployment alone does not update the private gateway. _(source line 259)_
- [ ] On the VPS, inspect OS/architecture/RAM/disk before installing Python 3.12+, ffmpeg/ffprobe, whisper.cpp, Piper and selected local model artifacts. _(source line 260)_
- [ ] Download only upstream-verified, license-reviewed artifacts; record exact source/version/license/SHA-256. For Piper, verify matching `.onnx` + `.onnx.json`; do not auto-download models from user requests. _(source line 261)_
- [ ] Configure `/etc/alandi-gateway.env` with `0600` permissions; keep ASR/TTS flags false until binaries, models and authenticated capabilities are checked. Then enable one feature at a time and restart the service. _(source line 262)_
- [ ] Validate the real microphone → editable transcript → explicit send → same-chat response → local TTS playback/voice choice/Stop path on the target device; record RAM, latency and speech quality. _(source line 263)_
- [ ] Never share secrets or full env files in chat. SSH/VPS access is not available through the current GitHub integration, so server-side installation must be executed by the owner using the runbook. _(source line 264)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — consolidated interface cleanup, 2026-10-30
- [ ] Native iPhone Safari keyboard, safe-area, touch and accessibility checks remain manual gates. Chromium geometry assertions do not establish native iOS behavior. _(source line 271)_
- [ ] Live aLandi gateway, third-party provider credentials, external connectors, independent agent teams and production voice transport are not verified by these UI changes. _(source line 272)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — sidebar hierarchy and preferences, 2026-10-30
- [ ] Native iPhone Safari keyboard, safe-area, focus, touch and screen-reader behavior remain unverified. Live gateway, provider credentials, connector sync, independent agent teams and voice transport remain separate runtime/infrastructure gates. _(source line 278)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — orthogonal chat settings and Research Studio, 2026-10-30
- [ ] Native iPhone Safari behavior and live gateway/provider execution remain separate manual/runtime gates. _(source line 284)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30
- [ ] Run a real target-host comparison with identical model artifact/digest/license, quantization, context, hardware and repetitions. Record RAM/PSS, cold/warm latency, p50/p95, tokens/s where available and human-rated RU/EN/TH task quality. _(source line 290)_
- [ ] Keep the main model responsible for planning, complex reasoning and synthesis. Evaluate at most one optional helper for bounded extraction/classification/summarization; helper remains off by default and cannot authorize tools or approve side effects. _(source line 291)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — V1 landing and interface finalization, 2026-10-30
- [ ] Native iPhone Safari, keyboard, safe-area, screen-reader and touch verification remain manual gates. _(source line 302)_
- [ ] Issue #111 remains open for owner-only ruleset, VPS/hardware, live gateway/model, RAG corpus, voice/device and sandbox gates. CI alone cannot close it. _(source line 303)_

### docs/USER_REQUEST_CHECKLIST.md — Owner override — 2026-11-07
- [ ] **Stop control styling.** Retain the contextual ability to stop an active generation, using a neutral compact control; final screenshot/accessibility review remains open. _(source line 310)_

### docs/V1_UI_FINALIZATION_RU.md — 1. Общий UI/UX — [~]
- [ ] Завершить проход по типографике, контрасту, spacing, пустым состояниям, ошибкам и вторичным действиям. _(source line 49)_
- [ ] Пройти финальный визуальный screenshot-review desktop/mobile после всех изменений. _(source line 50)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Composer и мобильная клавиатура — [~]
- [ ] Сохранена настраиваемая top/bottom позиция (PR #119/#121 track), но перепроверить её влияние на мобильные viewport и scroll. _(source line 57)_
- [ ] Нативно проверить iPhone Safari: клавиатура, safe-area, focus, долгий текст, свайпы от края, ориентация экрана. _(source line 58)_

### docs/V1_UI_FINALIZATION_RU.md — 3. Маршруты aLandi и сторонних API — [~]
- [ ] В PR #121 унаследованный внутренний alandi option остаётся скрытым для миграции/совместимости. Тест должен подтверждать, что он hidden и не попадает в optgroup сторонних API; нельзя требовать его полного отсутствия в HTML. _(source line 65)_
- [ ] Проверить RU/EN labels, переключение и миграцию сохранённого маршрута на текущем head. _(source line 66)_

### docs/V1_UI_FINALIZATION_RU.md — 4. Подписи, placeholder и inline validation — [~]
- [ ] Завершить единый язык placeholder/error/help для внешних API, Cloudflare и Tavily; постоянный текст оставлять только там, где он несёт важную privacy/security информацию. _(source line 73)_
- [ ] Проверить ошибки invalid URL, неверной модели, пустого ключа, CORS, HTTP 401/5xx и корректность redaction секретов. _(source line 74)_

### docs/V1_UI_FINALIZATION_RU.md — 5. System prompt и случайное редактирование — [x]
- [ ] В итоговом визуальном проходе подтвердить заметность pencil/edit, focus и возврат в readonly. _(source line 82)_

### docs/V1_UI_FINALIZATION_RU.md — 6. Инструкции сторонних провайдеров — [~]
- [ ] Удалить повторяющиеся provider explanations, но оставить короткие честные privacy notices там, где данные уходят внешнему оператору. _(source line 88)_
- [ ] Сверить каждую ссылку/инструкцию с актуальным upstream, не выдумывать endpoint или модельный ID. _(source line 89)_

### docs/V1_UI_FINALIZATION_RU.md — 7. Tools и Tavily — [~]
- [ ] Автоматическая проверка/индикатор ключа должна быть подтверждена реальным вызовом, не только непустым полем. _(source line 95)_
- [ ] Проверить paste, сохранение, удаление, неверный ключ, публичные fallback источники, privacy copy. _(source line 96)_

### docs/V1_UI_FINALIZATION_RU.md — 8. Статус собственного gateway — [~]
- [ ] Проверить race/stale response, /healthz, model completion, timeout, CORS и очистку ключа на exact head. _(source line 103)_

### docs/V1_UI_FINALIZATION_RU.md — 9. Окна и закреплённые действия — [~]
- [ ] Проверить Escape, focus return, screen reader name, scroll lock и background interaction. _(source line 111)_

### docs/V1_UI_FINALIZATION_RU.md — 10. Скроллинг и длинные чаты — [~]
- [ ] Проверить потоковую генерацию, вложенные скроллы, длинные сообщения/вложения, чат-список и модальные окна. _(source line 116)_
- [ ] Проверить экран 320px, динамическую клавиатуру и scroll restoration на iOS Safari. _(source line 117)_

### docs/V1_UI_FINALIZATION_RU.md — 11. Дополнительные настройки — [x]
- [ ] Завершить аудит всех secondary controls на дубли/устаревшие toggle. _(source line 125)_

### docs/V1_UI_FINALIZATION_RU.md — 12. Тема, язык, анимации — [~]
- [ ] Проверить полную RU/EN копию, светлую тему модалок, статусов, подсказок и Roadmap. _(source line 133)_

### docs/V1_UI_FINALIZATION_RU.md — 13. Каталог моделей и provider state — [~]
- [ ] Проверить сохранение выбранной модели при refresh, invalid catalog, устаревший fingerprint, auth failure и provider switch. _(source line 139)_
- [ ] Live provider smoke остаётся опциональным и требует явного согласия; mock E2E не выдавать за доступность реального аккаунта. _(source line 140)_

### docs/V1_UI_FINALIZATION_RU.md — 14. Project settings — [~]
- [ ] В PR #121 E2E должен подтвердить modal close, persistence, создание и переключение проекта после текущих исправлений. _(source line 147)_
- [ ] Реальный multi-device sync/source indexing не входит в V1; не изображать его включённым. _(source line 148)_

### docs/V1_UI_FINALIZATION_RU.md — 18. Финальный release gate — [~]
- [ ] PR #121 был красным: duplicate settings close selectors, invalid regex in integrity sentinel и один неверный assertion around settings probe. Исправления внесены; повторный exact-head CI нужен. _(source line 169)_
- [ ] Выполнить native iPhone Safari/keyboard/touch test вручную. _(source line 171)_
- [ ] Пересверить PR/Issues. Issue #111 остаётся открытым до реальных owner-only gates (ruleset/main governance, VPS, hardware/model, voice/device, licensed data corpus); не закрывать только ради нулевой очереди. _(source line 172)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Лендинг — обязательная структура V1
- [ ] Усилить copy: «бесплатный статический интерфейс» не означает «бесплатный inference», hosted AI endpoint не предоставляется. _(source line 182)_
- [ ] Добавить открываемый Roadmap с маркером 1nv3nt10n 1n PrOc3ss… только у направлений, которые ещё разрабатываются/планируются. _(source line 183)_
- [ ] Browser E2E на структуру/CTA, метаданные, отсутствие пустых ссылок, responsive 320/360/390/768/1024/1440px, Roadmap details и reduced-motion есть; добавлен тест pause/resume ticker (commit b213c8a); ожидается exact-head Chromium run. _(source line 184)_
- [ ] E2E проверяет lang/title/description/canonical/CTA/непустые ссылки; Jekyll build проходит в текущем CI; фактический published Pages path требует успешного exact-head smoke после merge. _(source line 185)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Публичная точка входа и root app
- [ ] Screenshot review 320/360/390/768/1024/1440 px: root header, sidebar, composer, settings/function/project dialogs, line lengths, section rhythm and contrast. _(source line 14)_
- [ ] Native keyboard/screen-reader pass for the public root app; DOM/E2E assertions are not a VoiceOver certification. _(source line 15)_
- [ ] Verify the deployed root revision marker and critical navigation on the actual published Pages URL after the next UI change. _(source line 16)_
- [ ] Keep the dark/light app themes and reduced-motion behavior consistent; do not add a separate landing theme or duplicate route. _(source line 17)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Корневое приложение — визуальная иерархия
- [ ] Общий screenshot review desktop/mobile после последнего PR #121. _(source line 21)_
- [ ] aServi cloud fields now reference their inline error messages with aria-describedby; URL validation, connection progress/status and success copy follow RU/EN. Required URL/model/key errors now appear in field order, focus the first missing field, clear when corrected and localize the checking state; focused RU/EN regressions added. Remaining forms and empty/error states still need a full pass. _(source line 22)_
- [ ] Полная RU/EN проверка микротекстов, подсказок, статусов, светлой темы модалок и пустых состояний; aServi required fields and project create/edit name validation now have localized inline errors and focus recovery. Broader panel/form copy review remains open. _(source line 23)_
- [ ] Проверить pencil/edit state у system prompt и возврат в readonly. _(source line 24)_
- [ ] Проверить touch targets (проектная цель 44×44 CSS px) и отсутствие конкурирующих controls. _(source line 25)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Popovers, menus, dialogs
- [ ] Chat/project action menus and composer popovers now size internal scroll areas to the live visual viewport; composer popovers move focus into the active menu, trap Tab/Shift+Tab and restore the trigger on Escape/scrim dismissal. Focused short-viewport regressions are added. Four-edge placement and real iPhone keyboard still need verification; nested project-choice scrolling now has overscroll containment and E2E coverage. _(source line 29)_
- [ ] Settings, project-create, project-settings and message-viewer dialogs: Escape, focus return and Tab/Shift+Tab containment are implemented; focused E2E coverage exists, execution pending. Other dialog/menu patterns, scroll lock and background inert still need review. _(source line 30)_
- [ ] Проверить короткий viewport, открытую iPhone keyboard и safe-area на реальном Safari. _(source line 32)_
- [ ] Native Popover API / CSS Anchor Positioning рассматривать только как progressive enhancement после support matrix; сохранить существующий JS fallback. Не мигрировать ради моды. _(source line 33)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Sidebar, проекты, чаты
- [ ] Проверить, что общий импорт/экспорт не дублируется в sidebar и project settings; chat actions остаются в chat menu, project bundle — в project settings. _(source line 38)_
- [ ] Project/chat navigation truncates long names within flex rows while retaining the full value in `title`; long project lists scroll internally. `renderChatList()` preserves scroll offset and restores focused controls; when a chat row disappears it moves focus to the current/first remaining chat. Chat-row menu actions that rerender the list return focus to a stable row trigger; keyboard traversal, Escape and outside-click focus restoration are covered. Added 320px no-overflow, 30-project, 40-chat scroll/focus, menu Tab/Shift+Tab/Escape, clone and delete-cancel focus regressions. Native mobile scroll, VoiceOver and full keyboard traversal remain open; Playwright execution is pending. _(source line 39)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Research / functions / agents
- [ ] Release-contract sentinel correction: PR #174 changes the published marker list to require the approved menu and forbid only retired Research Studio, legacy provider selection and removed sidebar controls. _(source line 44)_
- [ ] Web search is opt-in by default: fresh chats and legacy/imported records without an explicit saved preference stay model-only; saved per-chat `normal`/`more` choices are preserved. RU regression added; E2E execution and the broader mode-combination matrix remain open. _(source line 45)_
- [ ] Развести семантику web search breadth, offline mode и multi-agent orchestration в copy и UI. _(source line 46)_
- [ ] В roadmap/agent panels сохранять чёткое различие между blueprint, sequential pipeline и независимым agent runtime. _(source line 48)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Мобильность и доступность
- [ ] Composer placeholder uses `…` at <=340px, `Текст`/`Type` at <=360px, `Текст…`/`Type…` at <=420px, and full localized text above; horizontal padding is 4px only at <=360px. E2E covers 320/340/360/390/420/768 px (execution pending). _(source line 51)_
- [ ] Chromium responsive matrix 320/360/390/768/1024/1440 и no-overflow tests. _(source line 52)_
- [ ] Native iPhone Safari: visual viewport, клавиатура, safe-area, edge swipe, touchcancel, rotation, scroll restoration. _(source line 53)_
- [ ] VoiceOver: headings, dialogs, menus, status text, message actions, focus visibility. _(source line 54)_
- [ ] User `reduced` now disables the infinite prompt-edit pulse and voice-menu entrance animation; OS reduced-motion rules already cover ticker/dots and global timing. Full transitions/scroll and native OS-preference interaction still need manual review. _(source line 55)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — 3. Исторический первый polish patch
- [ ] Native keyboard/screen-reader confirmation. _(source line 71)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Fast regression path (2026-11-17)
- [ ] Added `scripts/check_a11y_surface.py`; a source scan of current `index.md` finds 5 visible form controls with names, 28 buttons with a non-empty name source, and all 8 runtime-localized field IDs in `fieldTexts`. This is a structural heuristic, not WCAG/screen-reader certification; the committed script still needs execution from a real checkout. _(source line 84)_
- [ ] Added a Lightpanda JavaScript/DOM smoke for Functions → Skills and localized accessible names. It is a fast functional candidate, not a visual browser: Lightpanda does not render layout. Its compatibility and timing are **not yet verified on aLandi**. _(source line 85)_
- [ ] Run the fast gate and Lightpanda smoke in a real repository checkout; compare elapsed time and coverage against Chromium on the same commit. _(source line 86)_
- [ ] Keep Chromium as a manual-only check for viewport geometry, CSS reflow, overflow and screenshots; do not infer those properties from DOM-only tests. _(source line 87)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — 5. Change log
- [ ] Provider settings: aLandi aServi is a first-party section, not a third-party provider option; aServi excludes both peer sections, and no silent cross-provider fallback is allowed. PR #169 implements; exact-head CI and live check pending. _(source line 107)_

### docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md — Приоритетный backlog
- [ ] LANDING-001 — зафиксировать baseline размера HTML/CSS/JS, critical rendering, LCP/INP/CLS и загрузки ключевых assets на опубликованном сайте. _(source line 38)_
- [ ] LANDING-002 — аудит доступности: keyboard-only, focus order, dialogs/popovers, screen-reader semantics, reduced motion, contrast and touch targets. _(source line 39)_
- [ ] LANDING-003 — аудит responsive поведения и реального iPhone Safari: visual viewport, keyboard, safe areas, rotation and zoom. _(source line 40)_
- [ ] LANDING-004 — аудит JS lifecycle: event listener cleanup, duplicate handlers, async race conditions, stale state, cancellation and memory leaks. _(source line 41)_
- [ ] LANDING-005 — аудит resilience: offline/slow network, retry/backoff, timeout, abort, provider 4xx/5xx, malformed/partial responses and error recovery. _(source line 42)_
- [ ] LANDING-006 — аудит client storage: migration, quota errors, import/export losslessness, corruption recovery, scoped deletion and backup/restore. _(source line 43)_
- [ ] LANDING-007 — audit security/privacy in current boundaries: CSP/SRI, DOM injection, URL handling, secret exposure, logging, CORS/SSRF and data retention. _(source line 44)_
- [ ] LANDING-008 — SEO/metadata/semantic HTML, canonical URL, social preview, sitemap/robots and crawl behavior without adding a framework. _(source line 45)_
- [ ] LANDING-009 — deterministic Jekyll/Actions build, cache correctness, immutable action pins, lockfile and provenance. _(source line 46)_
- [ ] LANDING-010 — reduce duplicated code/assets and dead paths only when exact reference and regression evidence prove safe removal. _(source line 47)_
- [ ] LANDING-011 — inspect current CSS/JS payload and optimize critical path only if measured; preserve visual behavior. _(source line 48)_
- [ ] LANDING-012 — expand Playwright coverage for critical user flows and failure states; avoid brittle/vacuous assertions. _(source line 49)_
- [ ] LANDING-013 — verify browser compatibility and graceful degradation for current supported browsers. _(source line 50)_
- [ ] LANDING-014 — audit i18n: RU/EN/TH labels, formatting, font fallback, transliteration of user-entered names only where required. _(source line 51)_
- [ ] LANDING-015 — review dependency freshness and security advisories within the existing dependency policy; do not blindly upgrade. _(source line 52)_
- [ ] LANDING-016 — inspect build/release observability and published Pages smoke; do not claim post-merge deploy from PR CI alone. _(source line 53)_
- [ ] LANDING-017 — reconcile historical landing UX requests with current code and master registry; preserve original task IDs and evidence. _(source line 54)_
- [ ] LANDING-018 — test graceful operation when optional gateway/voice/research capabilities are unavailable or disabled. _(source line 55)_

### docs/LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md — 7. Tasks
- [ ] LSV-001 — compare browser File System Access support across target browsers and native mobile. _(source line 116)_
- [ ] LSV-002 — define reference/attachment/local-copy consent and storage state machine. _(source line 117)_
- [ ] LSV-003 — prototype IndexedDB handle persistence and permission revalidation; no background watcher. _(source line 118)_
- [ ] LSV-004 — define local Source Vault schema, quotas, deletion lineage and export. _(source line 119)_
- [ ] LSV-005 — threat model file parsing, archive bombs, path traversal, symlinks and malicious PDFs. _(source line 120)_
- [ ] LSV-006 — evaluate Docling against existing parser on a representative RU/EN/TH corpus. _(source line 121)_
- [ ] LSV-007 — review doc-parse license, dependency tree, maintenance and adapter isolation. _(source line 122)_
- [ ] LSV-008 — evaluate screenshot-to-code in a no-execution sandbox with golden screenshot tests. _(source line 123)_
- [ ] LSV-009 — define video frame sampling, subtitle/transcript and provenance contracts. _(source line 124)_
- [ ] LSV-010 — benchmark ComfyUI/Wan 2.2 5B only on suitable GPU hardware; no target VPS assumption. _(source line 125)_
- [ ] LSV-011 — implement material-to-Skill draft with evidence mapping and human approval. _(source line 126)_
- [ ] LSV-012 — implement Agent blueprint conversion as a separate artifact type. _(source line 127)_
- [ ] LSV-013 — create upstream archive watchlist and preservation policy. _(source line 128)_
- [ ] LSV-014 — no downloads, mirrors, dependencies or runtime activation without owner approval. _(source line 129)_

### docs/AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md — 6. Proposed tasks
- [ ] SF-001 — define versioned SkillManifest and schema aligned with Agent Skills spec. _(source line 92)_
- [ ] SF-002 — source adapter contract and immutable source provenance. _(source line 93)_
- [ ] SF-003 — create-from-material pipeline with evidence span preservation. _(source line 94)_
- [ ] SF-004 — import/export package validator and license inventory. _(source line 95)_
- [ ] SF-005 — prompt-injection/secrets/malicious-script scanner. _(source line 96)_
- [ ] SF-006 — generated eval suite and skill quality rubric. _(source line 97)_
- [ ] SF-007 — human approval, immutable versions and rollback. _(source line 98)_
- [ ] AB-001 — AgentBlueprint schema separated from SkillManifest. _(source line 99)_
- [ ] AB-002 — permission intersection and explicit user approvals. _(source line 100)_
- [ ] AB-003 — UI builder for roles, skills, model policy, data scope and budgets. _(source line 101)_
- [ ] AB-004 — blueprint dry-run/evaluation with no side effects. _(source line 102)_
- [ ] AB-005 — promote blueprint only after runtime, isolation and exact-head tests exist. _(source line 103)_

### docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md — 9. Task ledger
- [ ] DR2-001 — восстановить ранее предоставленные владельцем research links и provenance. _(source line 151)_
- [ ] DR2-003 — проверить actual search/research UI и Gateway code; разделить implemented/planned. _(source line 153)_
- [ ] DR2-004 — аудит source ingestion, local storage, index and citation lineage. _(source line 154)_
- [ ] DR2-005 — проверить browser File System Access, OPFS and IndexedDB на целевых браузерах. _(source line 155)_
- [ ] DR2-006 — оценить local companion/desktop connectors and threat model. _(source line 156)_
- [ ] DR2-007 — сравнить notebook/research workspace проекты и source adapters по первоисточникам. _(source line 157)_
- [ ] DR2-008 — сравнить hybrid lexical/vector retrieval с SQLite FTS5 до добавления vector store. _(source line 158)_
- [ ] DR2-009 — определить claim/evidence schema and citation-validation golden set. _(source line 159)_
- [ ] DR2-010 — специфицировать resumable 12-stage Research run: deadline, cancellation, idempotency, bounded concurrency. _(source line 160)_
- [ ] DR2-011 — RU/EN/TH research golden set, source freshness and contradiction tests. _(source line 161)_
- [ ] DR2-012 — аудит memory recall, scope isolation, stale facts, conflicts, deletion and long-session capacity. _(source line 162)_
- [ ] DR2-013 — оценить local memory/index size and performance на target devices; определить практические пределы. _(source line 163)_
- [ ] DR2-014 — data-flow режимов local-only / mixed / remote-with-consent. _(source line 164)_
- [ ] DR2-015 — policy matrix: model refusals vs content policy vs platform security vs tool permissions. _(source line 165)_
- [ ] DR2-016 — false-positive/false-refusal and tool-authorization tests; no hidden adapter censorship. _(source line 166)_
- [ ] DR2-017 — image-generation candidates: ComfyUI/local GPU vs hosted APIs, licenses, cost, region, privacy. _(source line 167)_
- [ ] DR2-018 — video-generation candidates and async job APIs; не использовать retired endpoints. _(source line 168)_
- [ ] DR2-019 — AI coding assistants/agents and isolated coding sandboxes. _(source line 169)_
- [ ] DR2-020 — source inventory, decisions, risk register and staged implementation roadmap. _(source line 170)_
- [ ] DR2-021 — подготовить отдельные минимальные implementation PR после owner review; никаких production dependencies в этом PR. _(source line 171)_

### docs/VOICE_2_RESEARCH_RU.md — 6. Work plan / task ledger
- [ ] VOICE-TRACK-003 — собрать ранее найденные/предоставленные владельцем источники и пометить provenance; часть исходных scratch/source URLs ещё требует сверки. _(source line 111)_
- [ ] VOICE-TRACK-004 — провести независимый поиск по официальным upstream/papers/model cards/standards в категориях ASR, TTS, real-time audio, diarization, transliteration и multilingual normalization. **Progress:** первый проход выполнен по 6 поисковым направлениям (50 result slots до дедупликации); отдельный первичный-source отчёт создан в [VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md](VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md). Полный sweep и проверка оставшихся лицензий продолжаются. _(source line 112)_
- [ ] VOICE-TRACK-005 — проверить точные лицензии кода, весов, голосов, phonemizers, datasets и redistribution obligations. _(source line 113)_
- [ ] VOICE-TRACK-006 — сверить current code/tests and voice UI against every existing acceptance item; report precise implemented/partial/missing matrix. _(source line 114)_
- [ ] VOICE-TRACK-007 — составить воспроизводимый RU/EN/TH benchmark harness and golden-set governance. _(source line 115)_
- [ ] VOICE-TRACK-008 — сравнить 2–3 лучших кандидата на одинаковом наборе и target hardware; никаких model switches до measured win. _(source line 116)_
- [ ] VOICE-TRACK-009 — подготовить Voice 2.0 architecture/API contracts and phased implementation slices. _(source line 117)_
- [ ] VOICE-TRACK-010 — независимая security/privacy review и explicit owner approval перед runtime changes. _(source line 118)_

### docs/VOICE_2_RESEARCH_RU.md — Task ledger extension
- [ ] **AUDIO-GEN-001…009** — use the detailed task ledger in `LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md`; no download or runtime activation without owner approval. _(source line 156)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P1 — required next implementation slices
- [ ] Add a formal safety-first prompt composer (safety/workspace/project/profile/user), with prompt-injection regression tests. _(source line 153)_
- [ ] Add a privacy-only/local-only routing policy that blocks remote APIs and makes refusal explicit. _(source line 154)_
- [ ] Add route/router error tests for Grok/xAI, Kilo keyless route, 401/403/429/5xx, CORS failures, abort and malformed bodies. _(source line 155)_
- [ ] Complete RU/EN translation of settings help, errors, traces, project controls and all interactive labels. _(source line 156)_
- [ ] Audit keyboard navigation, contrast, mobile composer movement, safe-area and reduced-motion support. _(source line 157)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P2 — V-016 engineering blockers; do not advertise as production
- [ ] Implement and test deterministic artifact-manifest hashing + complete INTEL triad gate. _(source line 160)_
- [ ] Implement typed risk-aware router and route-regret evaluation corpus. _(source line 161)_
- [ ] Implement ALBF binary framing with CRC/truncation/overflow/interrupt tests. _(source line 162)_
- [ ] Implement native audio capture/inference adapters and measure e2e p50/p95 + PSS on the target 8 GB CPU host. _(source line 163)_
- [ ] Resolve every model/voice license/hash before packaging any weights. _(source line 164)_
- [ ] Harden cPocket rollback/TTL/cancellation races; do not enable speculative side-effect tools. _(source line 165)_
- [ ] Add crypto-erasure semantics and prove logical vs physical deletion guarantees. _(source line 166)_
- [ ] Add scratch-file offload, secure document ingestion, exact page/offset/hash citations and retrieval benchmarks. _(source line 167)_
- [ ] Keep CLI/browser runtime blocked until real sandbox/SSRF/approval escape tests pass. _(source line 168)_
- [ ] Implement 12-state research workflow and claim-to-evidence citation validation. _(source line 169)_
- [ ] Implement candidate-lessons pipeline with golden tests and rollback; no automatic weight training. _(source line 170)_
- [ ] Implement optional connectors only after encrypted token storage, scope review, revoke and index cleanup. _(source line 171)_
- [ ] Keep infrastructure and hardware targets as documentation until the required access and measurement environment exist. _(source line 172)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement: product work after the original V-016 checklist (not part of its original 81 items)
- [ ] **AI-AGENT-004 — Small helper model:** design plus synthetic RU/EN/TH response/latency smoke harness (`gateway/evals/run_local_model_benchmark.py`); Gateway Tests passed on PR #123 code head. Target-host quality/RAM/PSS/cold-warm benchmark and model selection remain pending. No general helper/subagent dispatch is wired into runtime. _(source line 186)_
- [ ] **AI-IMAGE-001 — Image generation:** no working image-generation UI/runtime exists yet. Select local ComfyUI or explicit external provider, verify exact checkpoint/license/hash/VRAM and add request-to-image E2E before marking implemented. _(source line 187)_
- [ ] **AI-OPS-001 — Free-first month:** no automatic paid resource provisioning. Use existing hardware and optional free-tier APIs with explicit quota/privacy caveats; paid hosting only after benchmark and owner decision. _(source line 188)_
- [ ] **AI-MODEL-001 — Local-model autonomy:** no hidden application-level refusal filter is planned. Actual refusals remain checkpoint/provider-dependent; do not claim guaranteed zero refusals. _(source line 189)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — legacy mobile and interface request, 2026-10-29
- [ ] Native iPhone Safari, software keyboard, edge-swipe and touchcancel behavior remain unverified. Do not mark complete based only on Chromium. _(source line 198)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — consolidated interface closure, 2026-10-30
- [ ] Native iPhone Safari keyboard/safe-area/focus and real touch interaction remain unverified. Provider credentials, live gateway, connector OAuth/sync, independent agent processes and full audio transport remain infrastructure/runtime gates rather than UI acceptance claims. _(source line 206)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — sidebar hierarchy and preference synchronization, 2026-10-30
- [ ] Real iPhone Safari keyboard/touch/accessibility behavior remains unverified; Chromium tests cover DOM order, live status updates and cross-surface preference synchronization only. _(source line 213)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — orthogonal chat settings, 2026-10-30
- [ ] Exact-head tests must pass for Quick+Expanded, Thorough+Standard, Thorough+Off, RU/EN, per-chat persistence and Research Studio non-mutation before merge. _(source line 218)_
- [ ] Native iPhone Safari and live gateway/provider behavior remain unverified. _(source line 219)_

### Retired by owner
### docs/USER_REQUEST_CHECKLIST.md — D. Чаты, проекты, инструкции и память
- [x] **RETIRED BY OWNER 2026-11-07:** server-memory graph API and browser bridge are removed from the product. Browser-local project notes remain; conversation delta sync and RAG are separate and preserved. Existing server DB files are not deleted by code; live host is unverified. _(source line 62)_
- [x] **RETIRED BY OWNER 2026-11-07:** scoped FTS5 `search_nodes()` belonged to the removed server-memory graph. RAG retains its independent scoped FTS5 store. _(source line 68)_
- [x] **RETIRED BY OWNER 2026-11-07:** temporal/conflict/recursive-delete tests belonged to the removed server-memory graph prototypes; do not rebuild them as a hidden backend memory subsystem. _(source line 70)_

### docs/USER_REQUEST_CHECKLIST.md — I. Следующие продуктовые вертикали
- [x] **RETIRED BY OWNER 2026-11-07:** PR #29's browser-to-server project memory bridge, API actions and settings removed; project notes remain browser-local. _(source line 198)_
- [x] **RETIRED BY OWNER 2026-11-07:** per-chat server-memory toggle and retrieval path removed; do not confuse this with local project notes or conversation delta sync. _(source line 199)_
- [x] **RETIRED BY OWNER 2026-11-07:** do not configure old graph/global-memory flags; API code is removed. Existing server SQLite files/backups remain untouched pending a separate owner decision. _(source line 201)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P1 — required next implementation slices
- [x] RETIRED BY OWNER 2026-11-07: backend server-memory graph and browser bridge removed in PR #169. Its two-project graph isolation/deletion/global-opt-in test scope is obsolete; preserve independent browser-local memory and RAG scope tests. _(source line 152)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement: product work after the original V-016 checklist (not part of its original 81 items)
- [x] **AI-MEM-006 — RETIRED BY OWNER 2026-11-07:** server graph API, feature flags, storage and browser bridge were removed in the current PR #169 implementation. PR #27/#29 and their CI results remain historical evidence only; do not enable or restore this capability. _(source line 184)_
- [x] **AI-MEM-007 — RETIRED BY OWNER 2026-11-07:** per-chat server-memory retrieval gate and UI state removed with the graph bridge. Browser-local project notes remain; conversation delta sync and independent scoped RAG are separate and preserved. _(source line 185)_

## 4E. Launch, privacy, readiness and governance source checklists (reconciled 2026-11-18)

The following source rows were not yet represented by a unique ID/text in the imported registries. They retain source path and line number. Legacy deployment actions remain owner-gated; these rows do not authorize host changes.

### Open / partial
### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — Автоматические проверки на точном PR HEAD
- [ ] Integrity: HTML structure, JS parse, immutable Action SHAs. _(source line 115)_
- [ ] Security: no credentials, safe markdown, safe provider routing and tools. _(source line 116)_
- [ ] Context: bounded memory/context/tool-loop behavior. _(source line 117)_
- [ ] Jekyll build: root app and `/landing/` output. _(source line 118)_
- [ ] Chromium E2E: chat, settings, project, Research Studio, provider state, export/import, landing. _(source line 119)_
- [ ] Landing responsive sweep: 320, 360, 390, 768, 1024, 1440 CSS px; no horizontal overflow. _(source line 120)_
- [ ] Landing SEO/link checks: `lang`, title, description, canonical, CTA and relative paths. _(source line 121)_
- [ ] Reduced-motion behavior: ticker static when OS requests reduced motion; no fake progress. _(source line 122)_
- [ ] Gateway contract/security tests on PRs that touch gateway. _(source line 123)_
- [ ] Project State Freshness exact SHA + exact live queue. _(source line 124)_
- [ ] License/provenance check. _(source line 125)_
- [ ] Graphify is developer-only artifact; inspect quality and do not ship to runtime. _(source line 126)_
- [ ] After merge: post-merge Pages deployment and actual published-site smoke. _(source line 127)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — Ручные/owner gates
- [ ] Native iPhone Safari: keyboard, safe area, focus, VoiceOver, touch, rotation, 320–390 width. _(source line 131)_
- [ ] GitHub branch rules and required checks inspected in repository settings. _(source line 132)_
- [ ] VPS inventory before any installation or reconfiguration; do not replace existing services blindly. _(source line 133)_
- [ ] Ollama model tag, digest, license, disk/RAM/PSS, cold/warm timings and concurrency=1 recorded. _(source line 134)_
- [ ] Gateway service listens on loopback; Ollama private on loopback; external origin accessible only through intended HTTPS Tunnel. _(source line 135)_
- [ ] Valid/invalid Bearer key, allowlisted model, completion, SSE, cache HIT/BYPASS, timeout and reboot tested. _(source line 136)_
- [ ] No prompt, user file/media body, secret or private memory in logs/traces/artifacts by default. _(source line 137)_
- [ ] Owner has confirmed whether the first deployment is personal/limited access; never imply public multi-user auth. _(source line 138)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — Future post-landing requirements — voice (not part of the frozen landing V1)
- [ ] **P0-13. Editable speech-to-text:** запись с микрофона, локальная транскрипция, редактирование распознанного текста до отправки, RU/EN/TH quality tests. _(source line 244)_
- [ ] **P0-14. Conversational voice assistant:** полноценный естественный turn-taking, streaming transcript/response, VAD, barge-in, cancellation, echo cancellation, transcript alignment. Текущий half-duplex prototype — только основа, не завершённая функция. _(source line 245)_
- [ ] **P0-15. Read selected text aloud:** выделение произвольного фрагмента ответа/сообщения и озвучивание только выделенного содержимого. _(source line 246)_
- [ ] **P0-16. Read one whole message aloud:** стабильный TTS для целого сообщения, voice choice, mini-player, pause/resume/stop, cleanup and stale-request protection. _(source line 247)_
- [ ] **P0-17. Read multiple selected messages aloud:** multi-select messages, ordered playback queue, pause/resume/skip/stop, cancellation and queue state; no parallel Piper jobs. _(source line 248)_
- [ ] **P0-18. First-release voice acceptance:** реальные microphone/speaker tests на целевых устройствах; RU/EN/TH; word error rate, first transcript latency, first audio latency, interruption latency, echo, CPU/GPU/RAM, model license and SHA-256. Без этого не обещать «почти человеческий» realtime. _(source line 249)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — P1 — small helper models, GPU inference and agent orchestration
- [ ] **P1-10. Helper model registry:** специализированные роли (classification, extraction, rerank, summary, memory candidate, skill synthesis), exact model ID/digest/license, capability, context/token budget, timeout, concurrency and eval. _(source line 252)_
- [ ] **P1-11. GPU inference profile:** Ollama GPU vs llama.cpp server benchmark; GPU-only inference mode must fail closed if no compatible GPU is detected. CPU still runs OS/API/orchestration; the requirement is no mandatory CPU model inference, not zero CPU usage for the whole host. _(source line 253)_
- [ ] **P1-12. High-throughput optional serving:** evaluate vLLM only on compatible accelerator hardware and when continuous batching/throughput materially helps. It is not the default 8-GB/single-model deployment. _(source line 254)_
- [ ] **P1-13. Multi-agent runtime:** bounded DAG/fan-out, queue/backpressure, per-agent scope/permissions, deadline, budget, cancellation propagation, idempotency, checkpoints, traces, retries and eval harness. Current four-stage research pipeline is not a swarm. _(source line 255)_
- [ ] **P1-14. Mass-agent load test:** establish safe concurrency, VRAM admission, memory residency/eviction, fairness, queue limits and degraded-mode behavior before increasing agent count. _(source line 256)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — P1 — internal notebook / Knowledge-to-Skill
- [ ] **P1-15. Knowledge-to-Skill pipeline:** authorized books, PDFs, office documents, websites and repo sources → bounded extraction → chapters/sections → source/page provenance → skill generation → injection/license scan → human review → versioned private skill. _(source line 259)_
- [ ] **P1-16. Skill lifecycle:** schema validation, scope isolation (personal/project), diff, versioning, rollback, deletion/retention and import/export. _(source line 260)_
- [ ] **P1-17. Safe ingestion:** MIME sniffing, archive/path traversal defense, XXE/bomb limits, parser timeout, temp cleanup, invisible Unicode scan, prompt injection scan and no automatic external provider fallback. _(source line 261)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — 8. Остаток landing/app polish из актуального main
- [ ] Скриншоты и визуальная проверка landing на 320/360/390/768/1024/1440 px; hero, карточки, CTA, spacing, contrast, footer. _(source line 274)_
- [ ] Keyboard-only и screen-reader проверка трёх раскрываемых roadmap секций и pause controls. _(source line 275)_
- [ ] Published Pages smoke после merge; canonical, ссылки и реальный deployment. _(source line 276)_
- [ ] App screenshot pass desktop/mobile; typography, contrast, spacing, empty/error states, RU/EN, light/dark. _(source line 277)_
- [ ] Все composer popovers на краях viewport, коротком viewport, с клавиатурой и nested scroll. _(source line 278)_
- [ ] Dialog Escape/focus trap/return/scroll lock/background inert; sticky Settings actions. _(source line 279)_
- [ ] Проверка дублирования chat import/export и project bundle actions. _(source line 280)_
- [ ] Long names, large lists, keyboard navigation, 44px touch targets. _(source line 281)_
- [ ] Functional menu отражает только реально зарегистрированные skills/agents/connectors and permissions. _(source line 282)_
- [ ] Native iPhone Safari, VoiceOver, safe-area, keyboard, rotation and touch cancellation — owner gate. _(source line 283)_
- [ ] Keep Native Popover API/CSS Anchor Positioning progressive enhancement only; preserve JS fallback. _(source line 284)_

### docs/PRE_LAUNCH_STACK_RU.md — Шаг 3. Подтвердить целевой профиль
- [ ] Есть доступ к имеющемуся VPS либо подтверждена итоговая цена нового. _(source line 70)_
- [ ] ОС/архитектура совместимы с выбранным runbook. _(source line 71)_
- [ ] Достаточно RAM/диска после учёта уже работающих сервисов и модели. _(source line 72)_
- [ ] Известно, кто имеет SSH/root access и как восстановиться при неудачном обновлении. _(source line 73)_
- [ ] Домен, DNS и план ежемесячных затрат понятны. _(source line 74)_
- [ ] Никакие существующие сервисы не будут удалены/перенастроены без инвентаризации. _(source line 75)_

### docs/PRE_LAUNCH_STACK_RU.md — Этап D — обязательные локальные gates
- [ ] /livez возвращает HTTP 200 без обращения к Ollama. _(source line 108)_
- [ ] /readyz возвращает HTTP 200 при доступной Ollama; `/healthz` — совместимый alias `/readyz`. _(source line 109)_
- [ ] Неавторизованный /v1/models возвращает HTTP 401. _(source line 110)_
- [ ] Авторизованный /v1/models показывает только разрешённую модель. _(source line 111)_
- [ ] Небольшой completion завершается и возвращает модельный ответ. _(source line 112)_
- [ ] Повтор exact-запроса даёт ожидаемый cache HIT, а cache bypass действительно работает. _(source line 113)_
- [ ] Порты 8000 и 11434 слушают только loopback. _(source line 114)_
- [ ] В логах нет API ключа, пользовательского prompt, приватного документа или сырого аудио. _(source line 115)_
- [ ] Права env/config соответствуют инструкции; service перезапускается без ручного shell state. _(source line 116)_

### docs/PRE_LAUNCH_STACK_RU.md — Этап G — reboot, backup и rollback
- [ ] Перезапусти gateway и Ollama, проверь health/capabilities после рестарта. _(source line 138)_
- [ ] Перезагрузи VPS в согласованное окно и подтверди автозапуск сервисов/Tunnel. _(source line 139)_
- [ ] Сделай backup конфигураций и необходимой SQLite data; секреты хранить отдельным защищённым способом. _(source line 140)_
- [ ] Проверь restore на безопасной копии, прежде чем считать backup рабочим. _(source line 141)_
- [ ] Подготовь rollback: отключить hostname/tunnel route; вернуть предыдущий env/config; восстановить known-good commit/service unit; проверить health. Не удалять данные, volumes и старые сервисы ради чистоты. _(source line 142)_

### docs/PRE_LAUNCH_STACK_RU.md — Код и сайт
- [ ] Все выбранные PR проверены по актуальному HEAD и нужным required checks; после merge повторно проверены main Quality и Pages deployment. _(source line 157)_
- [ ] Лендинг не обещает работающий hosted endpoint, автоматическую синхронизацию, включённый voice/OCR или multi-user SaaS, если это не подтверждено. _(source line 158)_
- [ ] Проверены mobile layout, клавиатура/viewport, навигация, доступность клавиатурой и отсутствие внешних обязательных JS-зависимостей на лендинге. _(source line 159)_
- [ ] Все ссылки и инструкции ведут к актуальным путям; нет несуществующих contact/support обещаний. _(source line 160)_

### docs/PRE_LAUNCH_STACK_RU.md — Сервер и безопасность
- [ ] API работает за HTTPS Tunnel; origin ports закрыты; auth/CORS/allowlist/limits проверены. _(source line 163)_
- [ ] Модель не превышает заданный RAM/latency budget под тестом; restart and reboot проверены. _(source line 164)_
- [ ] Секреты не попали в git/history/logs/artifacts. _(source line 165)_
- [ ] Backup восстановлен в тестовой копии; rollback известен. _(source line 166)_
- [ ] Есть владелец расходов, мониторинг диска/RAM и расписание обновлений. _(source line 167)_

### docs/PRE_LAUNCH_STACK_RU.md — Продукт и политика
- [ ] Определён закрытый круг первых пользователей и путь обратной связи. _(source line 170)_
- [ ] На лендинге раскрыты ограничения и зависимость от пользовательского gateway. _(source line 171)_
- [ ] Подготовлены Terms/Privacy policy только под фактические data flows; не писать «данные никогда не покидают устройство», если может быть выбран внешний provider. _(source line 172)_
- [ ] Для открытого multi-user доступа отдельно спроектированы auth/session, tenant isolation, quotas, abuse controls, cost controls и retention/deletion. До этого не выдавать личный beta за публичный SaaS. _(source line 173)_

### docs/LAUNCH_PRIVACY_REVIEW_RU.md — 2. Что обязательно подтвердить владельцу перед публичным Privacy Notice
- [ ] Оператор: физическое лицо или юридическое лицо, публичное имя/бренд и юридический адрес, если применимо. _(source line 25)_
- [ ] Контакт для запросов на доступ/удаление и вопросов приватности (лучше отдельный адрес поддержки; не выдумывать адрес до его создания). _(source line 26)_
- [ ] География оператора, хостинга, предполагаемых пользователей и целевые страны запуска. _(source line 27)_
- [ ] Целевая аудитория и минимальный возраст, если применимо. _(source line 28)_
- [ ] Будет ли это личный интерфейс одного владельца, ограниченная beta по приглашениям или публичный многопользовательский продукт. _(source line 29)_
- [ ] Реальная схема входа и авторизации: сейчас отдельная multi-user auth система не подтверждена. _(source line 30)_
- [ ] Точные домены, hosting providers, Tunnel mode/plan и фактически подключённые внешние AI/search providers. _(source line 31)_
- [ ] Какие данные собираются: чаты, выбранный контекст, проекты/инструкции, вложения, provider settings, browser storage, server-side cache, diagnostic logs, billing/support messages. _(source line 32)_
- [ ] Retention по каждой категории: browser data, server cache, logs, temporary files, backup copies. Если срок неизвестен, сначала измерить/проверить, а не угадывать. _(source line 33)_
- [ ] Реальная политика удаления и экспорта: что удаляется сразу, что остаётся в резервных копиях и когда копии ротируются. _(source line 34)_
- [ ] Фактическая обработка Cloudflare/GitHub Pages/VPS и внешнего провайдера: metadata/access logs, location/jurisdiction, applicable terms. _(source line 35)_
- [ ] Используются ли analytics, cookies beyond essential browser storage, tracking pixels, telemetry или third-party frontend assets. _(source line 36)_
- [ ] Как обрабатываются запросы об удалении, security incident, credential compromise и закрытии аккаунта, если появится account system. _(source line 37)_
- [ ] Кто отвечает за support и стоимость вычислений; есть ли автоматические биллинговые ограничения/quotas. _(source line 38)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V0 — Контракт и безопасность
- [ ] `GET /v1/capabilities` отражает только реально включённые функции. _(source line 31)_
- [ ] Неавторизованные запросы получают 401; тело, длительность и время выполнения ограничены. _(source line 32)_
- [ ] Конкурентные ASR/TTS задачи не копятся бесконечной очередью; корректно возвращается 429. _(source line 33)_
- [ ] Временные аудиофайлы удаляются при успехе и ошибке; сырой звук не пишется в логи и долговременную память. _(source line 34)_
- [ ] Проверены лицензии и SHA-256 бинарника/моделей/голоса; runtime пути задаются оператором, ничего не скачивается автоматически. _(source line 35)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V1 — Реальный локальный ASR
- [ ] Установлены совместимые `whisper.cpp`, `ffprobe` и локальная ASR-модель. _(source line 38)_
- [ ] На целевом устройстве браузер действительно получает микрофонное разрешение, записывает поддерживаемый MIME/кодек и корректно останавливает треки. _(source line 39)_
- [ ] Русская, английская и тайская короткие записи проходят через настоящий endpoint; ошибки формата/пустой записи объясняются пользователю. _(source line 40)_
- [ ] Транскрипт вставляется в composer и остаётся редактируемым; автоматической отправки нет. _(source line 41)_
- [ ] Измерены время до первой расшифровки, длительность аудио, пиковая RAM и точность на фиксированном небольшом тестовом наборе. _(source line 42)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V2 — Реальный локальный TTS
- [ ] Установлены совместимые Piper runtime и voice model с проверенной лицензией. _(source line 45)_
- [ ] Несколько ответов на русском/английском синтезируются в валидный WAV и воспроизводятся на целевом iPhone/браузере. _(source line 46)_
- [ ] Stop отменяет запрос и воспроизведение; повторное нажатие не запускает дубликат. _(source line 47)_
- [ ] Измерены latency, длительность генерации, размер WAV и RAM. _(source line 48)_
- [ ] Синтез отключён при недоступном runtime, без имитации успешного ответа. _(source line 49)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V3 — Half-duplex голосовой помощник
- [ ] Кодовый half-duplex цикл и mock E2E существуют (PR #60); реальная последовательность запись → ASR → редактируемый текст → запрос → TTS → воспроизведение → следующий ход на целевом устройстве не проверена. _(source line 52)_
- [ ] Нет автоматической отправки до подтверждённого состояния, если режим явно не настроен на это. _(source line 53)_
- [ ] Ошибка на любом этапе оставляет пользователя в восстанавливаемом состоянии; нет скрытой повторной записи или позднего воспроизведения. _(source line 54)_
- [ ] Отдельно проверены iOS Safari, блокировка/разблокировка экрана, переключение аудиоустройства и прерывание звонком. _(source line 55)_
- [ ] Только после измерений решить, нужен ли streaming/VAD/barge-in; не добавлять их как фиктивную настройку. _(source line 56)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — D0 — Защищённое извлечение
- [ ] Проверить `ALANDI_DOCUMENT_EXTRACTION_ENABLED=false` по умолчанию; включать только на намеренно настроенном gateway. _(source line 61)_
- [ ] Проверить реальные сигнатуры/MIME, расширения, пределы размера, страниц/листов, ZIP entries, коэффициента сжатия, времени и длины извлечённого текста. _(source line 62)_
- [ ] Проверить повреждённые файлы, архивную бомбу, неверное расширение, пустой/сканированный PDF, превышение лимитов и cleanup временных данных. _(source line 63)_
- [ ] Сохранить `no-store`; не отправлять документ в стороннего провайдера без явного выбора и применимых настроек согласия/приватности. _(source line 64)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — D1 — Путь от вложения до ответа модели
- [ ] На реальном gateway вложить по одному TXT, PDF с текстовым слоем, DOCX, XLSX, CSV и JSON. _(source line 67)_
- [ ] Подтвердить, что извлечённое содержимое действительно включено в prompt активного провайдера, а не просто отображено в UI. _(source line 68)_
- [ ] Проверить страницы/листы и происхождение источника; для таблиц не терять заголовки, порядок и значения ячеек. _(source line 69)_
- [ ] Недоступный parser или превышение лимита блокирует отправку с понятной ошибкой, а не создаёт впечатление, что модель прочитала файл. _(source line 70)_
- [ ] Проверить раздельные сценарии собственного и стороннего провайдера: документ не должен незаметно менять выбранный маршрут. _(source line 71)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — D2 — Следующий уровень ingestion (не считать реализованным)
- [ ] OCR для сканированных PDF и изображений — отдельный локальный компонент, лицензия, лимиты и тесты. _(source line 74)_
- [ ] Chunking с page/offset/source hash, preview и подтверждением перед индексацией. _(source line 75)_
- [ ] Re-index/delete, удаление производных chunks вместе с источником, provenance и тесты scope isolation. _(source line 76)_
- [ ] XLSX: отдельно определить формулы, отображаемые значения, листы и лимиты. _(source line 77)_
- [ ] Видео: выборка кадров не равна расшифровке звука; audio track, ASR и синхронизация требуют отдельного pipeline. _(source line 78)_
- [ ] Google Drive OAuth/Picker/sync не обещать до завершения UI, encrypted token storage, revoke и проверки удаления индекса. _(source line 79)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — UX и режимы
- [ ] **Голосовое сообщение:** UI/code path реализован; пользователь может записать фрагмент, отредактировать расшифровку и отправить вручную. Реальный микрофон/модель на целевом устройстве ещё не проверены. _(source line 104)_
- [ ] **Живой разговор (первый этап — half-duplex):** прототип цикла есть, но это не streaming/full-duplex. Проверить реальные ASR/TTS, задержку, отмену, echo и состояние UI на устройстве. _(source line 105)_
- [ ] Переключение в живой режим не включается само собой; видимые Start/Stop и разрешение микрофона обязательны. Stop прекращает запись, ASR, запрос модели и воспроизведение настолько полно, насколько позволяют используемые API. _(source line 106)_
- [ ] Для локального TTS показывать только голоса, чьи файлы и runtime действительно установлены и прошли проверку. Если доступен один голос, не рисовать второй фиктивный вариант. _(source line 108)_
- [ ] Голос хранится как предпочтение выбранного режима/чата согласно принятой модели настроек; не передавать это предпочтение внешнему провайдеру, если синтез остаётся локальным. _(source line 109)_
- [ ] При смене языка выбирать совместимый установленный голос либо объяснять, что голос недоступен; не делать тихий fallback на внешний сервис. _(source line 110)_
- [ ] Расшифровка и ответ видны текстом, если пользователь не включил отдельный режим аудио-only. Пользователь может исправить распознанный текст до отправки. _(source line 111)_

### docs/WORKSTREAM_GOVERNANCE_RU.md — 7. Governance task ledger
- [ ] GOV-003 — apply explicit titles/banners/labels to all existing future/research PRs after reviewing each PR and current labels. _(source line 99)_
- [ ] GOV-004 — add repository-side merge protection/automation only after checking existing rulesets and obtaining owner approval; labels alone are not a security boundary. _(source line 100)_
- [ ] GOV-005 — update master registry and orienters when PR #127 is revised/merged. _(source line 101)_

### docs/START_HERE_RU.md — 5. Проверка «готово»
- [ ] Pages deployment успешен, сайт открывается. _(source line 54)_
- [ ] VPS: Ollama и gateway активны. _(source line 55)_
- [ ] Gateway доступен только через Tunnel; публичные порты 8000/11434 закрыты. _(source line 56)_
- [ ] HTTPS hostname отвечает; неправильный API key получает 401. _(source line 57)_
- [ ] Из чата проходит реальный completion через gateway. _(source line 58)_
- [ ] Cache MISS → повтор HIT; bypass действительно обходит cache. _(source line 59)_
- [ ] После перезагрузки VPS gateway и Tunnel запускаются автоматически. _(source line 60)_
- [ ] Сохранены backup env/config и инструкции rollback (сам секрет — отдельно и защищённо). _(source line 61)_

### Retired


### Historical completed source marks
### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — UX и режимы
- [x] **Выбор установленного голоса:** PR #75 добавил allowlisted список preinstalled Piper voices из authenticated `/v1/capabilities` и UI selector; API валидирует voice ID. Остаются выбор конкретных packs, artifact-specific license/SHA-256, реальный синтез и UX-проверка на устройстве. _(source line 107)_

### docs/WORKSTREAM_GOVERNANCE_RU.md — 7. Governance task ledger
- [x] GOV-001 — define LANDING vs RESEARCH/FUTURE/SPIKE separation. _(source line 97)_
- [x] GOV-002 — define branch/PR naming and merge policy. _(source line 98)_

## 4D. Accepted improvements and requirements carried into the priority plan

Source: docs/ACCEPTED_IMPROVEMENTS.md. Current accepted tracks are represented in P0/P2/P3: AI-AGENT-005 — policy-enforced autonomous orchestration (real capability/permission policy, not a prompt promise); AI-UI-005 — adaptive-minimalist private workspace with owner-controlled changes. AI-MEM-007 — opt-in browser-to-server project memory bridge — is explicitly RETIRED and must not be reintroduced. The source file contains the concise acceptance record; no new permission is granted by that historical decision.

Requirements crosswalk from docs/ALANDI_REQUIREMENTS_REGISTER_RU.md: preserve manual and explicit provider-mode separation; isolate history/context per route; never auto-fallback between providers; keep Personal/Project/Global memory scopes distinct and permissioned; user can refuse/revoke memory access; show provider and route status honestly; avoid claiming a connected/unavailable provider as active. These requirements are consolidated into P2.2–P2.10 and release gates; older conflicting defaults are superseded by later owner overrides.
## 5. Completed archive — читать в последнюю очередь

Следующие строки были отмечены [x] в старых реестрах. Это исторические отметки; не считать их автоматически подтверждёнными на текущем SHA. Не возвращать в работу без нового требования или контр-evidence.

### MASTER_TASK_REGISTRY_RU.md — CHATSET — `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`
- [x] **CHATSET-111** **CHATSET-111** (строка 111; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Research Studio снята владельцем и удалена; прежний контракт модального окна больше не действует. Сами настройки чата остаются отдельными. _(исходный статус: DONE; строка 497)_

### MASTER_TASK_REGISTRY_RU.md — F1. Landing V1 — постоянное улучшение текущего стека
- [x] **LANDING-TRACK-001** **LANDING-TRACK-001**: Зафиксировать направление постоянного поиска улучшений лендинга строго внутри согласованного стека. **Progress:** границы повторно сверены с `docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md` и `docs/TECHNIQUE_REGISTER_RU.md`. _(исходный статус: DONE; строка 786)_
- [x] **LANDING-TRACK-002** **LANDING-TRACK-002**: Создать отдельный bounded backlog улучшений Landing V1. **Artifact:** `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` в PR #129. _(исходный статус: DONE; строка 787)_

### MASTER_TASK_REGISTRY_RU.md — F2. Future workstreams — отдельные PR, не для случайного merge
- [x] **GOVERNANCE-001** **GOVERNANCE-001**: Ввести правила разделения LANDING / RESEARCH / FUTURE / SPIKE. **Artifact:** `docs/WORKSTREAM_GOVERNANCE_RU.md` в PR #129. _(исходный статус: DONE; строка 794)_
- [x] **GOVERNANCE-002** **GOVERNANCE-002**: Зафиксировать naming, HOLD banners, Draft state and owner-approval merge gates. _(исходный статус: DONE; строка 795)_

### MASTER_TASK_REGISTRY_RU.md — F3. Voice 2.0 — research-only
- [x] **VOICE-001** **VOICE-001**: Создать отдельную ветку `research/voice-assistant-transcription-20261031` от актуального main. _(исходный статус: DONE; строка 802)_
- [x] **VOICE-002** **VOICE-002**: Сверить существующие voice implementation plan, Exa synthesis, multimodal stack, latency contract, language matrix, V-016 checklist and current implementation notes. _(исходный статус: DONE; строка 803)_
- [x] **VOICE-003** **VOICE-003**: Зафиксировать последовательность источников: ранее найденные совместно → repository → owner-provided → independent primary sources. _(исходный статус: DONE; строка 804)_

### MASTER_TASK_REGISTRY_RU.md — F4. Исторический общий backlog
- [x] **REGISTRY-001** **REGISTRY-001**: Найти прежний большой список незавершённых задач. **Result:** PR #127 / `docs/MASTER_TASK_REGISTRY_RU.md` — lossless inventory of **544 open/partial rows** across 20 unique checklist documents plus two branch-only snapshots (470 unchecked + 74 partial), including main operational/privacy/voice/architecture lists and active PR #125/#126/#129/#130 task deltas. Duplicates intentionally preserved; no original source was modified. _(исходный статус: DONE; строка 833)_

### MASTER_TASK_REGISTRY_RU.md — F6. Физическая изоляция future/research PR
- [x] **GOVERNANCE-006** **GOVERNANCE-006**: Создать отдельную holding base branch `future-workstreams/parking-base-20261031` от main SHA `e78a73b25725bfa63370d9946887cbbacbf51b82`. _(исходный статус: DONE; строка 853)_
- [x] **GOVERNANCE-007** **GOVERNANCE-007**: Перенаправить PR #125, #128 и #129 на holding branch; все три остаются Draft и помечены в заголовке/body как HOLD / DO NOT MERGE. Их merge не меняет main. _(исходный статус: DONE; строка 854)_

### MASTER_TASK_REGISTRY_RU.md — F7. Deep Research 2.0 — отдельный workstream
- [x] **DR2-001A** **DR2-001A**: Создать самостоятельную ветку `research/deep-research-2.0-20261031` от holding base. _(исходный статус: DONE; строка 860)_
- [x] **DR2-002A** **DR2-002A**: Создать PR #130 Draft / HOLD, отдельно от Agent Studio и Voice. _(исходный статус: DONE; строка 861)_
- [x] **DR2-003A** **DR2-003A**: Зафиксировать baseline: `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` и `docs/DEEP_RESEARCH_2_CURRENT_STATE_AUDIT_RU.md`, `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md`. _(исходный статус: DONE; строка 862)_

### MASTER_TASK_REGISTRY_RU.md — G. Session continuity — single entrypoint
- [x] **ORIENT-001 — SUPERSEDED BY NOW.md (2026-11-15).** Current contract: read only root `NOW.md` lines 1–100 first; append each complete owner request and each material action/checkpoint there; make one batched live GitHub read for main SHA and open queues. No default PR, no parallel handoff, no startup bundle. Historical ORIENT/OLEDUE/FILE_ORIENTER records are on-demand history only. _(исходный статус: DONE; строка 872)_
- [x] **ORIENT-002 — HISTORICAL HANDOFF TEST (2026-11-07).** The previous fresh-session exercise is retained as historical evidence; it does not route current work or authorize resuming PR #154/#131. The latest explicit owner request in NOW.md always wins. This workflow does not claim to repair ChatGPT client loading failures. _(исходный статус: DONE; строка 873)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — A. Functions / Agents menu — PR #131
- [x] **MENU-009** **MENU-009** — supporting UX contract создан; source audit and remaining gaps синхронизированы с canonical UI checklist section 8.28. _(исходный статус: DONE; строка 30)_
- [x] **UI-ICON-001** **UI-ICON-001** — owner UI requirement 8.8: icon-first copy/open/speak message actions with accessible labels/tooltips and 44×44 hit area; retain copy/speak in full-message view, with speak unavailable for user messages. Exact-head Quality #42349078380 passed (Jekyll, Chromium and all Quality sentinels) on implementation/test SHA 350c01513ec6dc147cd5b26e7b8e3bfa17a26d0e; status-only documentation follow-up SHA e41b1f40a0ea121a759bd0080ffc63dd2cde09c6 is awaiting recheck. _(исходный статус: DONE; строка 31)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — C. Компактные модели / SLM — PR #125
- [x] **SLM-001** **SLM-001** — определить task-based bake-off вместо рейтинга по числу параметров; роли: classification/routing, structured extraction, reranking, summarization, memory candidate generation, Skill synthesis. **Artifact:** `docs/AGENT_MODEL_BAKEOFF_RU.md`, раздел “2026-11-02 — Task-based small-model evaluation contract”. _(исходный статус: DONE; строка 47)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — F. Chromium and responsive follow-up — PR #131
- [x] **MENU-010** **MENU-010** — Research Studio is retired entirely by the owner. PR #169 removes the Research Studio surface and entrypoints; exact PR Quality #42408172737 passed 113/113 Chromium. _(исходный статус: DONE; строка 107)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Продолжение владельца — 2026-11-05
- [x] **ORIENT-2026-001 — SUPERSEDED BY NOW.md (2026-11-15).** Historical PR #140 handoff remains evidence only; the single first-read checkpoint is root `NOW.md` lines 1–100, with full owner prompts and append-only step journal. Do not read/recreate Session Sync Capsule, OLEDUE, ORIENTER or FILE_ORIENTER as startup inputs. Detailed product documents are on-demand. _(исходный статус: DONE; строка 121)_
- [x] **BASELINE-2026-001** **BASELINE-2026-001** — preserve original Landing V1 at `9b746f7bbb1a12b482bd6f0a7cefd62b3cb454af` in branch `archive/landing-v1-baseline-9b746f7-20261105`. This is a separate recoverable reference; main remains open to bounded quality improvements. _(исходный статус: DONE; строка 122)_
- [x] **LANDING-V1-2026-001** **LANDING-V1-2026-001** — promote the independent public landing accessibility/responsive slice via PR #139 (merge SHA `2e11849d409a51009693af95ac3ecbf1f057a3fc`). Exact-main Quality, Pages, Freshness, Provenance and Graphify passed on that merge SHA. _(исходный статус: DONE; строка 123)_
- [x] **N2O-2026-001** **N2O-2026-001** — integrate the owner-provided N₂O Core, Knowledge Loop, ChatGPT Sources and Project Instructions documents via PR #142 (merge SHA `c307b7e3940e9051843befd5f77acfeaef66c91d`). Three owner-provided source documents were byte-for-byte matched to the uploaded files. Existing `AGENTS.md` and `LOOP.md` remain shared engineering foundations. _(исходный статус: DONE; строка 124)_
- [x] **SOURCES-2026-001** **SOURCES-2026-001** — refresh upstream architecture inspiration and license/revision triage via PR #144 (merge SHA `99c5d673cf239a1cd86b67aca101a3c0773f3761`). XERJ, Memvid, RAG-Anything, Graphify, Superpowers and durable-execution references are research candidates, not adopted dependencies. _(исходный статус: DONE; строка 125)_
- [x] **VOSK-2026-001** **VOSK-2026-001** — store Vosk Small Russian 0.22 archive in `models/vosk/` via PR #143 (merge SHA `12ce75cdd6e14ae7752643bb20fc5421b177c26e`): 46,236,750 bytes, SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`, metadata, checksum, upstream README and Apache-2.0 license notice. Acquisition workflow is read-only/manual. `ship=false`; no runtime activation. _(исходный статус: DONE; строка 126)_
- [x] **DEP-2026-001** **DEP-2026-001** — consolidate dependency/lock and document-parser improvements from PRs #124/#126 into PR #145 (merge SHA `88d230fc92fef5b884af699345fd010291107693`). Universal `uv.lock`, FastAPI/Uvicorn/pypdf pins, Python 3.12/3.13/3.14 matrix and `asyncio.to_thread` document parsing; all PR-head Quality/Gateway/Graphify/Provenance/Dead Code checks passed. _(исходный статус: DONE; строка 127)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Browser persistence integrity and follow-up debugger findings — 2026-11-05
- [x] **AUDIT-FIND-013 — P1 settings-profile partial-write / false-success.** Fixed on PR #150 code/test HEAD `c1103a74cc0774380b98728fd0e5698c1afb64db`: raw snapshots, reverse-order restore, active-chat rollback and success gating. Two Chromium quota-injection regressions pass. _(исходный статус: DONE; строка 212)_
- [x] **FIX-011 — transactional settings-profile import.** Profile keys and active-chat state are rolled back if any required localStorage write fails; API-key storage is untouched and existing key names/schema are preserved. _(исходный статус: DONE; строка 213)_
- [x] **AUDIT-FIND-014 — P2 fire-and-forget chat-setting persistence.** Fixed on PR #150 exact code/test HEAD `54e4858ed19fb4fa1daaa55444121ff2f8c5f780`: a shared mutation helper snapshots chat fields and raw mirrored storage keys, then rolls back both on any failed write. Search/processing/multi-agent modes, skill preset/goal/output/custom fields and agent-team controls now use the helper. _(исходный статус: DONE; строка 214)_
- [x] **FIX-012 — common chat-setting mutation rollback.** Two Chromium quota-injection regressions exercise mode/mirror rollback and skill/agent configuration UI rollback; existing storage names/schema remain unchanged. _(исходный статус: DONE; строка 215)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — H. Owner priority reset and recurring requirements — 2026-11-07 (append-only)
- [x] **OWN-001 — OLEDUE fast handoff / principles integration (P0).** The normative Core, Knowledge Loop and concise LOOP method are explicitly linked from OLEDUE/AGENTS/orchestrator and now from LOOP itself. Owner task-intake and single-index routing are in main via PR #156. Fresh-session ORIENT-002 was exercised in this session: OLEDUE first, one batched live-state orientation, latest request routed to UI-PROMO-001 / PR #154, exact head/checks inspected. ORIENT-002 is recorded complete in the Master Registry. Keep handoff short; do not add mandatory bulk reads or another backlog. _(исходный статус: DONE; строка 223)_
- [x] **PAGES-001 — GitHub Pages publication truth (P0; VERIFIED on current main, 2026-11-08).** Current `main` is `bf039f887e29137b627b06fc2bb107c2793d6b69`. GitHub-managed Pages deployment #42410162803 completed SUCCESS on this exact SHA. Quality run #42410163178 completed FAILURE overall only because the separate published release-contract sentinel still forbade the owner-approved `functionsMenu`; the Chromium job itself passed the built app, published root, canonical landing content and landing Chromium (8/8) on the exact SHA. PR #174 repairs only that stale contract. Production remains GitHub-managed Pages/Jekyll; no duplicate deploy workflow or custom builder is needed. _(исходный статус: DONE; строка 224)_
- [x] **PLAN-001 — unified orchestrator navigation (P0).** Keep one canonical entrypoint (OLEDUE) pointing to N₂O principles, LOOP, external-source inventory INTEL, roadmap, decisions, state and Master Task Registry. Avoid new parallel backlogs; synchronize project state/orientation only when materially changed. **Implemented:** `PROJECT_ORCHESTRATOR_RU.md` was created and merged in PR #156 at main SHA f6f3896bf3989f9c88e3764f848b84e90b601a65; OLEDUE and AGENTS point to it, with principles core/knowledge loop, INTEL, roadmap, decisions, evals, provenance and one task register. _(исходный статус: DONE; строка 226)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — Owner override — 2026-11-08: Functions menu capability slice (D-022)
- [x] **FUNCTIONS-DETAIL-001 / MENU-002 / MENU-003:** Owner explicitly requests a concise Functions section containing Agents/structured analysis, Deep Research and Skills/task profile. PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2` and exact PR Quality #42408172737 passed 113/113 Chromium. Deep Research selects Thorough processing mode only; web-search breadth stays orthogonal. Agent mode is the current four-stage same-model pipeline, not a swarm. Skills are prompt/profile guidance only and grant no permissions. Integrations/connectors remain hidden until real registry/status/permission contracts exist. Research Studio remains retired. _(исходный статус: DONE; строка 271)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J.6 Full checklist and supply-chain audit — 2026-11-08
- [x] **REGISTRY-003** **REGISTRY-003** — inventory and normalize stable task IDs across the master registry and append-only addendum. As of 2026-11-08: main 599 unique IDs; addendum 128 unique IDs; REGISTRY-002 is the only cross-file shared ID; no duplicate IDs remain within either file and no unnumbered checklist rows remain in this addendum. Source-description reconciliation continues under REGISTRY-002. _(исходный статус: DONE; строка 327)_
- [x] **VOICE-DEDUP-001** **VOICE-DEDUP-001** — completed source crosswalk: VOICE2-106…112 → VOICE-004…010 (VOICE-TRACK-003…009); VOICE2-113 → VOICE-TRACK-010; VOICE2EXT-080…087 → VOICE-EXT-001…008; USER126-254…258 → USER125-254…258. The distinct VOICE-011…018 and AUDIO-GEN-001…009 tasks are now atomized in the master registry; source references are preserved as cross-links, not duplicate tasks. _(исходный статус: DONE; строка 329)_
- [x] **ACTION-PIN-001** **ACTION-PIN-001** — 14 repository workflow files contain 62 direct external references; all 62/62 are full 40-character SHAs. Main Integrity job #128516358240 passed the action-pinning step. _(исходный статус: DONE; строка 331)_

---
Детальные технические документы, схемы и research сохраняются как спецификации/источники. У них нет права менять порядок работ без обновления этого файла. Все новые owner requirements добавляются сюда; никаких параллельных backlog не создавать.

### Дополнительные исторические [x] отметки из актуальных source checklists
### docs/USER_REQUEST_CHECKLIST.md — A. База, управление и непрерывность
- [x] PR #20 с базовыми контрактами памяти, инструментария, происхождения источников и governance объединён; CI прошёл. _(source line 10)_
- [x] Создана ветка для облачной настройки/UX: `feat/alandi-cloud-settings-ux`. _(source line 11)_
- [x] PRs #21–#29 merged with required PR-head gates passing. PR #32 then merged at `31eecce8203073dbc8e0e46b3ac338f64788d59b`; all six PR-head jobs passed, including Chromium regression, integrity/security/context sentinels, Jekyll build and published Pages browser smoke. Added safe structured Markdown fallback when CDN renderer libraries are unavailable. Gateway contract/security tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708`. Live gateway/VPS and separate post-merge deployment remain unverified. _(source line 12)_
- [x] Проведён аудит V-016 §0–40 и начальной инженерной фиксации; создан подробный 81-пунктный ledger в `docs/V016_IMPLEMENTATION_CHECKLIST.md`. Аудит завершён, но многие runtime-функции ещё не реализованы/не подтверждены. _(source line 13)_

### docs/USER_REQUEST_CHECKLIST.md — B. Первичное облако aLandi и API-провайдеры
- [x] Зафиксировано продуктовое правило: aLandi Cloud — единственный главный облачный блок; Kilo остаётся обычным альтернативным провайдером в общем списке, без отдельной главной кнопки. _(source line 18)_
- [x] Собственное облако aLandi — единственная кнопка/главная карточка в верхней части настроек; Kilo и остальные альтернативы расположены только в общем списке сторонних провайдеров. _(source line 19)_
- [x] Проверено: async-проверка не подтверждает другой провайдер/модель/ключ после их смены; legacy-проверка aLandi не перезаписывает отдельно изменённую главную облачную карточку. Deterministic race E2E прошли в PR #22 (HEAD `bd8fdddd…`) и post-merge Quality Sentinel прошёл на main `7fac23ce…`. _(source line 28)_
- [x] All-provider smoke workflow требует явного подтверждения (default false) и поддерживает per-provider model overrides; PR #25 quality/provenance CI passed. Live workflow не запускался из этой сессии; доступность аккаунтов не утверждается. _(source line 35)_

### docs/USER_REQUEST_CHECKLIST.md — D. Чаты, проекты, инструкции и память
- [x] Historical PR #27 Gateway/provenance/Quality/Pages evidence retained. Its server-memory graph API is now retired by owner; do not enable or restore it. _(source line 69)_

### docs/USER_REQUEST_CHECKLIST.md — E. Инструменты, маршрутизация, веб-поиск и отказы
- [x] Ограниченный fallback web_search на открытые источники реализован и прошёл Chromium E2E без Tavily-ключа. Недоступные источники пропускаются; ссылки берутся из реальных ответов. Доступность API всё ещё зависит от CORS/сети. _(source line 79)_

### docs/USER_REQUEST_CHECKLIST.md — F. V-016: зависимости, аудио, память, бюджеты и лицензии
- [x] Детерминированный state hash реализован и проверен CI: сортированные пути и SHA-256 содержимого, исключение типовых секретов/генерируемых каталогов, `index.md` включён. Это не подпись и не доказательство безопасности. _(source line 88)_
- [x] cPocket hardening merged in PR #28; gateway contract/security tests passed on post-merge main `e424d353418cad62981eb269b4082d2925592708`. Cap 128 cleanup registrations per lease; cleanup continues after RuntimeError/CancelledError and rollback is tested for exactly-once behavior. Target-runtime resource/FD soak and live voice integration remain unverified. _(source line 94)_

### docs/USER_REQUEST_CHECKLIST.md — Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8
- [x] Прочитаны разделы 1–8: канонические источники, non-negotiable contracts, текущая архитектура, план фаз 0–8, voice latency, model/license policy, eval/release gates и non-goals. _(source line 115)_
- [x] Зафиксированы ограничения: не выдавать prototype за live, не обещать p95 без измерения, no fake sandbox, no fake citation checks, tool approval/SSRF, scoped deletion, локальный аудиотракт и отсутствие автоматического cloud provisioning. _(source line 116)_

### docs/USER_REQUEST_CHECKLIST.md — Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты
- [x] Сверены все строки реестра accepted improvements с идентификаторами в PROJECT_STATE.yaml; статус каждой строки сохранён отдельно, а не слит в одно «готово». _(source line 167)_
- [x] Различены реализованные модули, prototypes, документационные контракты, deferred items и блокеры. Макет или unit primitive не приравниваются к production runtime. _(source line 168)_

### docs/USER_REQUEST_CHECKLIST.md — Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates
- [x] Проверены eval registry, решения D-001…D-006, bounded engineering loop, source/licensing register, latency contract, infrastructure upgrade и domain setup. _(source line 172)_
- [x] Voice performance, 8-GB profile, OTel exporter, native audio path, real sandbox, full LazyGraphRAG, external approval UI и live VPS обозначены как не подтверждённые/не развёрнутые. _(source line 173)_

### docs/USER_REQUEST_CHECKLIST.md — I. Следующие продуктовые вертикали
- [x] PR #29 head checks passed: Quality/Chromium, provenance and published Pages smoke. Post-merge main Quality/Chromium, provenance and Pages deployment passed at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; gateway contract/security tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708`. _(source line 200)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 owner quickstart and chat ergonomics
- [x] Added owner-first setup sequence: `docs/START_HERE_RU.md`, linked from detailed VPS guide. It distinguishes existing VPS diagnostics from new Vultr setup and gates tunnel/client setup on local health/auth/completion/cache checks. _(source line 209)_
- [x] Added evidence-based subsystem roadmap: `docs/IMPLEMENTATION_ROADMAP_RU.md`, ordered P0 client UX → voice message → live voice → document/RAG → image/video → agent teams → memory/security → provider operations/governance. _(source line 210)_
- [x] PR #33 merged at `05f4c2454c279cc21dcbf08c83ff3c3025838257`; PR #34 merged at `e3463f9b048dfda742b8158faf054c617defda9a`; PR #35 merged at `23add2547a69df877b4baf213957827aa2e8e561`. PR-head run #418 passed context, integrity, security, Jekyll, 48 Chromium E2E tests and published-site browser smoke; separate license/provenance and dead-code gates passed. Post-merge main checkpoint `4fb39df2cb0c23c907fc69b52c1ebf2e05e6024e` also passed Quality workflow #420, 48 Chromium E2E tests, live-site smoke, Pages deployment #122 and provenance gate #159. Real-device keyboard/accessibility remain follow-up. _(source line 211)_
- [x] Replace prompt-based rename/project chooser with accessible in-app dialog/select; Chromium E2E covers rename and moving between projects. [ ] Real-device mobile keyboard open/close, focus, persistence and project delete/move accessibility follow-up. _(source line 212)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 project navigation and composer
- [x] PR #35: Projects at top, collapsed by default; each project expands to its own chat list; top-level Chats is expanded and contains only unassigned/personal chats. Covered by Chromium E2E. _(source line 217)_
- [x] New personal chat from Chats; create a project-scoped chat from that project's expanded group; per-row menu includes rename, clone, move/detach, clear history, delete. Covered by Chromium E2E. _(source line 218)_
- [x] Move global memory controls and project facts under collapsed project settings; persisted project memory scope selects project-only vs project-and-global. Implemented; UI/browser checks pass. _(source line 219)_
- [x] Add composer + chooser for photo/video vs unrestricted multi-file picker. Known text formats and images are processed; video sends sampled frames. Other binary formats are selected but currently shown as unsupported and block sending until a parser/ingestion endpoint is implemented. Chromium E2E passes. _(source line 220)_
- [x] Add ◎ request-context selector for up to five projects. Context is scoped by chat ID, bounded, added to the next request only, and cleared after successful send. Selected project context must not mutate the chat's own project. Chromium E2E passes. _(source line 221)_
- [x] Voice chooser opens after press-and-hold, not a short tap. Long-press and short-tap behavior pass Chromium E2E; real-device touch/cancel still needs verification. Live recording, ASR, TTS and audio transcript remain unimplemented. _(source line 222)_
- [x] aLandi is a dedicated first-party primary-route card; third-party providers stay in advanced settings. Quality sentinel and Chromium E2E pass. _(source line 223)_
- [x] PR #35 was merged at `23add2547a69df877b4baf213957827aa2e8e561`; PR-head run #418 passed all quality gates, 48 Chromium E2E tests and published-site browser smoke. [x] Post-merge main checkpoint `4fb39df2cb0c23c907fc69b52c1ebf2e05e6024e` passed Quality workflow #420, live-site Chromium smoke, Pages deployment #122 and provenance gate #159. _(source line 224)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — local helper memory suggestions (2026-10-27)
- [x] Added a manual, bounded local-model flow to propose compact project-memory facts. PR #69 merged at `4c9096999fbb3e1265150c420b136066c555285b`. _(source line 231)_
- [x] Kept it disabled when `ALANDI_HELPER_MODEL` is blank; only the operator-configured local Ollama tag can be used; the route shares inference concurrency and asks Ollama to unload after the request. _(source line 232)_
- [x] Filtered common secret-like input/output patterns and require an explicit click for every saved candidate. A regression fix handles prefixed names such as `ALANDI_API_KEY`. _(source line 233)_
- [x] Exact PR-head Gateway run #40539476154, Quality/Chromium/published-site smoke #40539476242, and provenance #40539476214 passed. _(source line 234)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — reconciliation of the older mobile and interface request (2026-10-27)
- [x] Compared the full owner message with current `main`, the implementation roadmap, existing browser tests, and visible UI/source identifiers. The audit separates already implemented behavior from partial work and unimplemented interaction design in `docs/LEGACY_UX_REQUEST_AUDIT_RU.md`. _(source line 239)_
- [x] PR #71 (`fix/mobile-composer-docking-20261027`) merged: composer stays at the bottom in empty and populated chats, textarea height follows `visualViewport`, and Chromium viewport regression passes. Native iPhone Safari remains unverified. _(source line 240)_
- [x] PR #114 merged at `25bfe66b5454e45fb5f6cef9dd86ae3c0ef1c5e5`: empty global system prompt by default, obsolete Gemini reset removed, quality sentinel aligned with the opt-in prompt contract, and history budgeting reserves serialization headroom. Exact-head Quality/Chromium/published-site smoke passed. _(source line 241)_
- [x] PR #115 merged at `ed2c4c7ee3a67c7a0cf5b541c1ab6206609dd32c`: composer popover scrim, modal backdrop blur respecting reduced-transparency, inert first outside tap for toolbar/language/chat-row menus; exact-head Chromium and published-site smoke passed. _(source line 242)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — autonomous agent orchestration research (2026-10-28)
- [x] Reviewed additional upstream open-source patterns for orchestration, durable workflows, policy-as-code, sandboxing, agent evaluations, memory, protocols and observability; recorded source links and limitations in `docs/AGENT_ORCHESTRATION_RESEARCH_RU.md`. _(source line 249)_
- [x] Owner-approved design direction recorded in D-016 and AI-AGENT-005: explicit task state machine, least-capability executor, fail-closed policy gate, action-bound approval, independent verifier, durable journal/recovery, bounded retries and eval-gated helper model. _(source line 250)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — voice model landing and VPS owner steps (2026-10-28)
- [x] Added a VPS deployment runbook to `docs/VOICE_IMPLEMENTATION_PLAN_RU.md`: model install, voice/model hash and license review, feature-flag sequencing, private gateway binding, smoke checks, and release acceptance. _(source line 258)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — consolidated interface cleanup, 2026-10-30
- [x] PR #118 merged at `4bde19249b1ac05ccf55c2499a8ee08a27b9a198`: chat export/import actions live in each chat menu; chat import merges rather than replaces existing history, deduplicates IDs, validates settings and bounds imported data. Project bundle import/export remains in project settings. _(source line 269)_
- [x] PR #119 merged: persisted top/bottom composer preference; aLandi Cloud and third-party provider routes share one clear selector; redundant primary-route action and connector hints were removed; the staged research workflow is described truthfully; project-first quick actions and per-project memory scope are persisted. _(source line 270)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — sidebar hierarchy and preferences, 2026-10-30
- [x] PR #120 merged at `2bda22229cba3576628f92c821bb6e1562d8abc5`: memory controls have their own first sidebar section; project/chat navigation and status lines follow; Research Studio is below chats; theme/language controls are pinned at the sidebar bottom and language is synchronized with Settings. _(source line 277)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — orthogonal chat settings and Research Studio, 2026-10-30
- [x] PR #121 merged at `f4d880f`: separates work effort from web-search scope; clarifies the structured workflow and task-profile permissions; removes duplicated Research Studio selectors and makes Studio use active chat settings without mutating them; localizes the settings summary, removes the duplicate Research entry point and raises primary mobile hit areas to 44px. _(source line 282)_
- [x] Exact-head Chromium/Quality on PR #121 passed the orthogonal-settings, per-chat, RU/EN and Research Studio non-mutation coverage. _(source line 283)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30
- [x] Recovered a bounded synthetic local-model smoke harness: `gateway/evals/run_local_model_benchmark.py` plus `gateway/tests/test_local_model_benchmark.py`. Gateway Tests passed on the exact PR #123 code head. It uses fixed RU/EN/TH prompts, bounded requests/time/response size, environment-only API key and refuses redirects; target-host evaluation remains pending. _(source line 289)_
- [x] Chronological branch audit: current provider separation supersedes the legacy `self-hosted/free-cloud` selector; legacy project tools are deferred pending current permission/scope/approval contracts; the 64-role architecture document already exists in main and describes logical roles, not separate model processes. _(source line 292)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — V1 landing and interface finalization, 2026-10-30
- [x] Created the dedicated living release checklist: [V1_UI_FINALIZATION_RU.md](V1_UI_FINALIZATION_RU.md). It preserves the owner's 18 UI directions, adds landing-specific gates, states the V1/free-static-UI boundary and distinguishes implementation from verification. _(source line 296)_
- [x] Audited current ChatGPT/OpenAI UI patterns and official Apple, W3C, GOV.UK, NN/G and MDN accessibility/design guidance; recorded what is adopted and what is deliberately not copied in the V1 checklist. _(source line 297)_
- [x] Landing copy now distinguishes a free static interface from inference/API/hosting cost; public hosted AI endpoint is not provided by GitHub Pages. _(source line 298)_
- [x] Added staged roadmap disclosures; the "1nv3nt10n 1n PrOc3ss…" ticker is decorative, appears only for unfinished directions, is hidden from assistive technology and respects reduced-motion. _(source line 299)_
- [x] PR #121 merged: duplicate settings close action removed; integrity provider-group assertion uses deterministic parsing; Research Studio E2E excludes the expected provider connectivity probe from user-send count. _(source line 300)_
- [x] Landing and in-app roadmap E2E coverage passed on PR #121 exact head. Post-merge Pages deployment and public root + /landing/ exact-SHA Chromium checks passed on PR #173 merge SHA `bf039f887e29137b627b06fc2bb107c2793d6b69`; the remaining PR #174 failure is a stale release-contract sentinel, not a site failure. _(source line 301)_

### docs/USER_REQUEST_CHECKLIST.md — Owner override — 2026-11-07
- [x] **Research Studio retired.** PR #169 removed the complete product surface; post-merge public root/landing Chromium verified the absence on exact main SHA. Do not restore it. _(source line 307)_
- [x] **Owner override D-022 (2026-11-08) supersedes the previous menu prohibition:** restore only three truthful Functions entries — Agents/structured analysis, Deep Research, and Skills/task profile. PR #169 implements the menu and post-merge public Chromium verified it. Integrations/connectors remain absent until real capability registry/status/permission contracts exist. PR #174 corrects the stale release-contract assertion. _(source line 308)_
- [x] **First-party routing is separate.** aLandi aServi is a dedicated settings section, never a third-party provider option. PR #169 implements the exclusivity rule; PR #173 and post-merge public Chromium checks passed. No silent auto-fallback between aServi and external providers. _(source line 309)_

### docs/V1_UI_FINALIZATION_RU.md — 1. Общий UI/UX — [~]
- [x] Сохранить индивидуальный визуальный язык aLandi и не переписывать интерфейс на новый framework. _(source line 46)_
- [x] Развести память, проекты, чаты и настройки в отдельные зоны sidebar (PR #120). _(source line 47)_
- [x] Свести частые параметры запроса к короткой сводке и независимым настройкам (PR #121, ожидает финальной проверки). _(source line 48)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Composer и мобильная клавиатура — [~]
- [x] Composer остаётся нижним flex-элементом и не центрируется фиксированным позиционированием (PR #71). _(source line 55)_
- [x] Chromium E2E покрывает новый чат и resize viewport. _(source line 56)_

### docs/V1_UI_FINALIZATION_RU.md — 3. Маршруты aLandi и сторонних API — [~]
- [x] Собственная карточка «Мой сервер» отделена от списка внешних провайдеров. _(source line 63)_
- [x] Внешний picker сгруппирован; Kilo — обычный альтернативный провайдер. _(source line 64)_

### docs/V1_UI_FINALIZATION_RU.md — 4. Подписи, placeholder и inline validation — [~]
- [x] URL/модель/ключ собственного сервера представлены компактными полями с placeholder. _(source line 71)_
- [x] Ошибки трёх серверных полей имеют отдельные элементы. _(source line 72)_

### docs/V1_UI_FINALIZATION_RU.md — 5. System prompt и случайное редактирование — [x]
- [x] Глобальный пользовательский prompt пуст по умолчанию; legacy built-in prompt мигрирует в пустое значение (PR #114). _(source line 79)_
- [x] Сохранён явный режим редактирования; prompt не подменяет системные правила приложения. _(source line 80)_
- [x] Старый restore Gemini defaults удалён. _(source line 81)_

### docs/V1_UI_FINALIZATION_RU.md — 6. Инструкции сторонних провайдеров — [~]
- [x] Обычный провайдерный поток общий; Kilo не выделен в отдельную особую настройку. _(source line 87)_

### docs/V1_UI_FINALIZATION_RU.md — 7. Tools и Tavily — [~]
- [x] Ключ Tavily находится в свёрнутом разделе инструментов/веб-поиска, отдельно от ключей провайдеров. _(source line 94)_

### docs/V1_UI_FINALIZATION_RU.md — 8. Статус собственного gateway — [~]
- [x] Проверка требует реального model completion и health-check; изменение параметров сбрасывает connected state. _(source line 101)_
- [x] Автопроверка ограничена debounce/single-flight и не должна принимать HTTP 200 с proxy text за успех.- [~] В PR #121 убрана постоянная ручная кнопка проверки; поля/лампа должны отражать валидированное соединение. _(source line 102)_

### docs/V1_UI_FINALIZATION_RU.md — 9. Окна и закреплённые действия — [~]
- [x] Основные settings/project/research/function окна имеют отдельные закрытия. _(source line 108)_
- [x] Дублирующий data-action="close-settings" в header удалён; exact-head Chromium/Quality PR #121 passed. _(source line 109)_
- [x] Settings header с Save/X и нижние actions закреплены через sticky positioning; exact-head Chromium/Quality PR #121 passed. Короткий viewport, открытая iPhone keyboard и safe-area остаются ручной проверкой. _(source line 110)_

### docs/V1_UI_FINALIZATION_RU.md — 10. Скроллинг и длинные чаты — [~]
- [x] Есть jump-to-latest, full message viewer и popover scrim/outside-tap behavior (PR #115 + предшествующие UI slices). _(source line 115)_

### docs/V1_UI_FINALIZATION_RU.md — 11. Дополнительные настройки — [x]
- [x] Редкие параметры свёрнуты в «Дополнительные настройки». _(source line 122)_
- [x] Язык, motion, composer position и провайдеры сгруппированы отдельно от основной server card. _(source line 123)_
- [x] Отдельные настройки функций и проекта открываются контекстными модалками. _(source line 124)_

### docs/V1_UI_FINALIZATION_RU.md — 12. Тема, язык, анимации — [~]
- [x] Базовые theme/language state синхронизируются между header/sidebar/settings (PR #120/#121). _(source line 130)_
- [x] Есть reduced-motion стили для существующих анимаций. _(source line 131)_
- [x] Landing roadmap ticker запускается только в раскрытом пункте и поддерживает явную паузу/возобновление; [x] prefers-reduced-motion оставляет читаемый статичный текст. App ticker и пользовательский motion=off/reduced требуют exact-head проверки. _(source line 132)_

### docs/V1_UI_FINALIZATION_RU.md — 13. Каталог моделей и provider state — [~]
- [x] Каталоги могут обновляться и фильтровать text model choices; credentials разнесены по provider. _(source line 138)_

### docs/V1_UI_FINALIZATION_RU.md — 14. Project settings — [~]
- [x] Создание/редактирование проекта вынесено в отдельное окно; настройки memory scope сохраняются. _(source line 145)_
- [x] Проект, чаты и проектная память имеют разграниченные browser-local scopes. _(source line 146)_

### docs/V1_UI_FINALIZATION_RU.md — 18. Финальный release gate — [~]
- [x] Основной код имеет Quality sentinels, Jekyll, Chromium E2E, published-site smoke и отдельные gateway/provenance workflows. _(source line 168)_
- [x] PR #173 merge SHA `bf039f887e29137b627b06fc2bb107c2793d6b69`, Pages #42410162803 и публичные root + /landing/ exact-SHA Chromium checks подтверждены. [ ] Исправить stale release-contract sentinel в PR #174 и повторно проверить после merge. _(source line 170)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Лендинг — обязательная структура V1
- [x] Отдельный permalink /landing/; корневой URL приложения не заменяется. _(source line 178)_
- [x] Hero с CTA на рабочую среду и runbook. _(source line 179)_
- [x] Карточки возможностей и отдельная схема browser → tunnel → gateway → Ollama. _(source line 180)_
- [x] Статусы voice/docs/self-hosted и multi-user boundaries не выдаются за готовые. _(source line 181)_

### docs/V1_UI_FINALIZATION_RU.md — 8.8 Иконки действий сообщений
- [x] Реализован icon-first вариант для copy/open/speak с aria-label/title и 44×44 CSS px touch targets; в полном просмотре добавлены copy/speak actions, а для пользовательского сообщения озвучивание скрывается. Exact-head Quality #42349078380 passed (Chromium + Jekyll + sentinels) on code/test SHA 350c01513ec6dc147cd5b26e7b8e3bfa17a26d0e; this SHA is the pre-status-update implementation checkpoint. _(source line 372)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Публичная точка входа и root app
- [x] Контракт маршрутизации обновлён: единственная публичная продуктовая поверхность — root app; `/landing/` и `/assets/css/landing.css` возвращают 404. Не восстанавливать отдельный статический лендинг без нового решения владельца. _(source line 12)_
- [x] Pages build + deploy завершились успешно на main SHA `0f1b3cfdef9a25198c6435a64f886db4f6fbd510` (run `44016571123`); live metadata with cache bypass reports the same `alandi-build-revision`, and `/landing/` returns HTTP 404. _(source line 13)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Корневое приложение — визуальная иерархия
- [x] PR #117/#120: header hierarchy, project label, clock polish, sidebar grouping, memory/project statuses, synchronized theme/language. _(source line 20)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Popovers, menus, dialogs
- [x] PR #117: chat-row menu placement viewport-safe; PR #115: scrim и inert first outside tap. _(source line 28)_
- [x] Settings Save/Close остаются sticky; добавлены начальный focus на Close, Tab/Shift+Tab trap, Escape close и возврат фокуса к открывшему control (runtime E2E добавлен, запуск ещё pending). _(source line 31)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Sidebar, проекты, чаты
- [x] PR #120: порядок памяти → проекты → чаты и компактные статусы. _(source line 36)_
- [x] PR #118/#119: chat import/export и project-first actions. _(source line 37)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Research / functions / agents
- [x] Owner override 2026-11-08 (D-022): Research Studio remains retired; PR #169 removed the modal, wiring and entrypoints. Post-merge public root/landing Chromium verified the absence on exact main SHA. _(source line 42)_
- [x] Functions menu: D-022 owner override supersedes the original three-entry subset. Four entries are present (Agents, Deep Research, Skills, Connectors); the Connectors panel truthfully reports that no registry is configured and does not claim to query live status, scopes or actions. A real registry/permission contract remains a separate implementation gate. _(source line 43)_
- [x] Connectors empty state now explicitly says that no registry is configured and no connection status, permissions or actions are queried; removed decorative ticker that could imply integration progress. RU/EN regression added; execution pending. _(source line 47)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — 3. Исторический первый polish patch
- [x] Добавлен checkbox Pause control на каждый из трёх landing roadmap ticker. _(source line 67)_
- [x] Pause toggles animation state using CSS only; no new JavaScript or runtime dependency. _(source line 68)_
- [x] Added Playwright test for pause/resume and retained reduced-motion test. _(source line 69)_
- [x] Exact-head Chromium/Quality passed on PR #121, including landing pause/resume and reduced-motion regression coverage. _(source line 70)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Fast regression path (2026-11-17)
- [x] Quality workflow is manual-only; expensive static analysis, full Chromium and live Pages release verification are opt-in. The GitHub Pages publishing mechanism is unchanged. _(source line 82)_
- [x] Added a dependency-free local gate: `bash scripts/fast-check.sh` (integrity, security, context, immutable-action parser, state-freshness unit tests, source accessibility check, syntax and diff checks). _(source line 83)_

### docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md — 9. Task ledger
- [x] DR2-002 — инвентаризировать repository research, memory, local-source and multimodal docs. _(source line 152)_

### docs/VOICE_2_RESEARCH_RU.md — 6. Work plan / task ledger
- [x] VOICE-TRACK-001 — создать изолированную research-ветку от main. _(source line 109)_
- [x] VOICE-TRACK-002 — перечитать существующие voice plans, research synthesis, language matrix, latency contract and implementation checklist. _(source line 110)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P0 — post-merge verification through PR #29; live gateway remains a separate manual gate
- [x] Confirmed merged PR #21 contains UI, project, quality-sentinel and E2E test updates. _(source line 141)_
- [x] All Independent Quality Sentinels passed on PR head `acce1d7ce5ac6eb37251fe5d899a392150b82e9e`. _(source line 142)_
- [x] Chromium E2E passed, including cloud-primary route, keyless web search, project scope/export/deletion and mobile voice swipe. _(source line 143)_
- [x] Reviewed the changed-file diff and added regression coverage for auth, route, scope and recovery paths. _(source line 144)_
- [x] PR #21 description records Kilo as an explicit alternate and project support as browser-local. _(source line 145)_
- [x] Merged only after PR-head quality, Chromium E2E, Lite Gateway and provenance gates passed. _(source line 146)_
- [x] PR #28 merged; gateway contract/security tests, provenance, quality and Pages checks passed on post-merge main `e424d353418cad62981eb269b4082d2925592708`. _(source line 147)_
- [x] PR #29 merged at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; PR-head and post-merge Quality/Chromium, provenance and Pages browser smoke passed; Pages deployment succeeded. _(source line 148)_
- [x] Memory bridge merge state and all available workflow results reconciled. No live gateway/VPS, real provider smoke or target-hardware result is claimed. _(source line 149)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — legacy mobile and interface request, 2026-10-29
- [x] PR #71: stable bottom composer for empty/populated chats and visualViewport-aware textarea; native iPhone Safari remains a separate manual gate. _(source line 194)_
- [x] PR #114: optional global user system prompt empty by default; obsolete Gemini reset removed; legacy default migrates to empty; context history budget reserves serialization/provider overhead. _(source line 195)_
- [x] PR #115: dim/blur scrim for attachment/context/voice popovers; modal backdrop blur respects reduced-transparency; first outside tap closes composer popover or toolbar/language/chat-row menu without activating underlying controls. Exact-head Chromium and published-site smoke passed. _(source line 196)_
- [x] PR #120 merged at `2bda22229cba3576628f92c821bb6e1562d8abc5`: dedicated memory section, ordered project/chat navigation, live status lines, Research Studio placement and synchronized sidebar theme/language preferences. _(source line 197)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — consolidated interface closure, 2026-10-30
- [x] PR #118 merged: chat-scoped import/export, merge-with-existing-history behavior, ID collision handling, validation and size/count bounds; exact-head quality and browser gates passed. _(source line 203)_
- [x] PR #119 merged: UX-21–UX-25 delivered, including persisted composer position, clear provider route grouping, request-context boundaries, truthful staged-workflow wording, project-first actions and persisted project memory scope. _(source line 204)_
- [x] PR #120 merged: sidebar hierarchy, memory status, Research Studio placement and synchronized theme/language controls delivered. _(source line 205)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — sidebar hierarchy and preference synchronization, 2026-10-30
- [x] PR #120 merged: UX-26 and UX-27 delivered with dedicated memory controls, live status lines, Research Studio placement and synchronized theme/language preferences. _(source line 212)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — orthogonal chat settings, 2026-10-30
- [x] PR #121 merged at `f4d880f`: effort controls only execution budget; web-search scope controls only availability/result breadth; structured workflow and task profile are separate; Research Studio uses current chat settings without mutation; exact-head Chromium/Quality passed. Native iPhone/VoiceOver remains manual. _(source line 217)_

## 6. Архив реализованных пакетов — 2026-11-18 (append-only)

Этот раздел — хвостовой журнал уже попавших в `main` изменений. Не читать его при обычном ориентировании; новые завершённые пакеты добавлять только сюда. Наличие записи IMPLEMENTED не означает прохождение неисполненного E2E или проверку live runtime.

### P0 UI — sidebar, Research, Agents and operational timeline

- **IMPLEMENTED — Sidebar structure (commit `3f20322f0fd1be539644fd84d798cfbaff3f133e`).** Create Project/Chat actions moved into their own section headings; collapsed Projects returns available space to Chats; desktop row density and mobile 44px touch targets adjusted. Residual density and state-persistence acceptance remains active at P0.1/P0.3.
- **IMPLEMENTED — Deep Research panel (commit `8d88296ffc1ef86a7df0ed9368e897bc40e9d425`).** Duplicate Quick/Thorough and web-breadth controls removed; one real sequential evidence-report workflow selectable per chat; future research methods are listed without fake launch controls.
- **IMPLEMENTED — Agents panel IA (commit `4bd7df011b2c21dc64d3d233caba89848fce6a03`).** Honest saved-role blueprint labels and a planned-only topology catalogue. Independent agents/subagents/swarm are not yet implemented.
- **IMPLEMENTED — AgentRun timeline timestamps (commit `6f6914f2dd3fd506df10d8ba08a55a04dc893a35`).** Chat and Functions timelines use allowlisted Gateway event types and actual `occurred_at` timestamps; no model chain-of-thought or raw event payload is exposed.
- **VERIFIED — exact-HEAD Pages and Graphify only:** commit `3f20322f`: Pages #643 SUCCESS / Graphify #1414 SUCCESS; `8d88296f`: #644 / #1415 SUCCESS; `4bd7df01`: #645 / #1416 SUCCESS; `6f6914f2`: #646 / #1417 SUCCESS.
- **NOT RUN:** the updated Chromium E2E and quality-sentinel suites were committed but not executed during this work session. No Gateway live runtime, private VPS/Tunnel/Ollama, iPhone Safari/VoiceOver, audio hardware or model-weight installation was checked.
- **IMPLEMENTED — Chat row action cleanup and coverage (this commit).** Removed an unreachable project-source sync call after `return` in `createChatRow`; added a Playwright regression covering rename persistence, active-chat preservation and single-chat export payload. Existing tests cover move/clear/clone/delete-cancel and keyboard traversal. The new browser test is committed but not yet run.
- **IMPLEMENTED — narrow mobile composer (commit `39730108fee5f99f7cca012381ba2baee206687b`).** At viewport widths <=380px, composer utility controls occupy a compact first row and the draft input shares a second row with send/stop; 44px touch targets remain. Added Playwright geometry regression for 320/360px; test execution remains pending.
- **VERIFIED — exact-HEAD Pages + Graphify:** both succeeded on `39730108fee5f99f7cca012381ba2baee206687b` (Pages run #44444338963; Graphify run #44444339995). This does not verify Chromium E2E or native iPhone behavior.
- **Next:** continue P0 composer edge cases, forms and validation; then complete menu/dialog, responsive, density, RU/EN, theme/motion, accessibility and dead-control acceptance. Keep P1 studio shells and P7 provider decisions behind the landing gate.
- **IMPLEMENTED — mobile navigation touch targets (this commit).** Project/chat selection and row-action controls are now 44×44px at <=640px; a Playwright regression creates a project and measures project/chat selection + action targets at 390px, including sidebar horizontal-overflow guard. Browser execution is pending.
- **NOT RUN — browser acceptance:** the new mobile navigation regression and existing composer 320/360px geometry regression have not yet run in Chromium; no native iPhone Safari/VoiceOver check was performed.
- **IMPLEMENTED — shared keyboard focus ring (this commit).** Native disclosure summaries, links and role=button controls now use the same 2px Tiffany focus indicator as buttons/inputs/selects; added a keyboard-modality regression for the Functions menu summary.
- **EXPANDED — mobile navigation regression.** The 44×44px checks now cover 320, 360 and 390 CSS px instead of one viewport; project/chat selection and action controls plus sidebar horizontal overflow are measured at every width. Browser execution remains pending.
- **IMPLEMENTED — complete primary sidebar touch target pass (this commit).** At <=640px, Projects/Chats toggles, Create actions, unassigned-chat filter, Memory disclosure, project/chat selection and row-action controls use at least 44px height/width as applicable. Expanded the 320/360/390px regression to measure the full primary navigation set. Browser execution remains pending.
- **VERIFIED — exact-HEAD Pages + Graphify:** commit `cc1e9c376955ced48c9c4b7891c4fa3d880a64ab`; Pages build/deploy #44446119751 SUCCESS; Graphify #44446120302 SUCCESS. Cache-busted public Pages metadata reports the same build revision.
- **NOT RUN — browser/device acceptance:** Chromium E2E (including the new 320/360/390px sidebar, narrow composer and keyboard focus tests) was not executed; native iPhone Safari/VoiceOver was not checked. Pages + Graphify do not substitute for those gates.
- **IMPLEMENTED — nested mobile action targets (this commit).** At <=640px chat-row menu entries, toolbar choices, attachment/context/voice choices and attachment removal use 44px minimum touch targets. Added a Playwright regression that opens these menus, measures every visible action and checks attachment removal.
- **IMPLEMENTED — responsive root viewport sweep (this commit).** Added a document/body/header/composer horizontal-overflow regression for 320, 360, 390, 640, 768, 1024, 1280 and 1440 CSS px. It is a browser test, not a native device test.
- **SPECIFIED — 30-point landing acceptance matrix.** Thirty explicit responsive, composer, navigation, dialog, form, localization and accessibility gates now live under P0.21. None is considered VERIFIED until executed with recorded environment and exact SHA.
- **NOT RUN — browser/device acceptance:** the new nested-menu and viewport sweep tests, along with earlier 320/360/390px regressions, have not yet run in Chromium; no native iPhone Safari/VoiceOver check was performed.

- **IMPLEMENTED — toolbar disclosure Escape behavior (this commit).** Search, Functions and Language toolbar disclosures now share one Escape close path and restore focus to their own summary. Added Playwright coverage for Search/Functions Escape and first outside click not activating the underlying processing-mode control. Browser execution pending.

- **IMPLEMENTED — landscape mobile acceptance (this commit).** Added an 844×390 Playwright regression for document/body overflow, composer viewport bounds, textarea minimum height and Send reachability. Browser execution remains pending.

- **IMPLEMENTED — form error association assertions (this commit).** Project create/edit and aServi URL/model/key Playwright tests now verify aria-describedby points to the inline error and the error is announced with role=alert, in addition to aria-invalid, text and focus. Browser execution pending.

- **VERIFIED — exact-HEAD Pages + Graphify:** `82fb7608c5dc9bc8bb048280b0952769d26595a1`; Pages build/deploy #44448092746 SUCCESS; Graphify #44448093330 SUCCESS. Chromium E2E was not part of these runs.
- **IMPLEMENTED — toolbar Escape behavior:** Search/Functions disclosures close on Escape and restore focus to their own summary; outside click closes without activating the underlying processing-mode control. Playwright regression added; execution pending.
- **IMPLEMENTED — accessible form error associations:** project create/edit and aServi URL/model/key regressions assert `aria-describedby` points to the inline `role=alert` error, plus `aria-invalid` and first-invalid focus. Execution pending.
- **IMPLEMENTED — landscape mobile regression:** 844×390 test measures document/body overflow, composer bounds, textarea height and Send reachability. Execution pending.
- **BROWSER TOOL LIMITATION:** TinyFish run `9b55917e-a96d-4849-be99-c213a82a95c4` explicitly reported static DOM only and could not set viewport, execute JavaScript or call `getBoundingClientRect`. Its `alandi-build-revision NOT_FOUND` claim is not treated as a site defect: the source has the revision marker and the Jekyll quality sentinel checks the generated artifact. Use Playwright for actual geometry.
- **PARTIAL KEYBOARD OBSERVATION:** TinyFish run `60646830-6785-4667-a831-37b1ac003db2` observed sidebar and Settings Escape closure/focus return; project actions, Functions outside click, Voice menu and Create Project validation were not reached. Existing Playwright tests cover several of those paths; no browser pass is claimed.

- **IMPLEMENTED — stronger geometry assertions (this commit).** Nested menu/action acceptance measures both width and height; the eight-width responsive sweep checks left/right bounds for header and composer, and the 844×390 landscape test checks header/toolbar/composer edges rather than width alone. Browser execution pending.

- **IMPLEMENTED — toolbar outside-click focus return (this commit).** Focus target is selected from the active toolbar disclosure; requestAnimationFrame restores focus only while the trigger remains connected and outside inert content. Removed stale Language disclosure selector because the current UI uses a language select.

- **VERIFIED — exact-HEAD Pages + Graphify:** `fef43b55237c1106c02880914bc6a81681cfe0f4`; Pages build/deploy #44448700108 SUCCESS; Graphify #44448701548 SUCCESS. Chromium E2E not run.

- **IMPLEMENTED — Project Settings mobile sheet acceptance (this commit).** Added 320/390px Playwright checks for full-height bounds, zero radius, sticky header, internal scrolling, 16px/44px fields, 44px disclosures and no horizontal overflow. CSS implementation landed in `e3c7a850`; browser execution pending.
- **IMPLEMENTED — attachment popover dismissal acceptance (this commit).** Added Escape and outside-click checks for scrim/aria-expanded/focus return while preserving the unsent draft. Browser execution pending.

- **IMPLEMENTED — mobile modal safe-area sizing (this commit).** Project Create, Settings, Message Viewer, Chat Action, Functions and Trace surfaces now share safe-area-aware viewport padding and max-height; Chat Action has bounded internal scrolling. Added 320×568 geometry/scroll regression for Settings, Functions and Chat Action. Browser execution pending.

- **IMPLEMENTED — sticky mobile panel headers (this commit).** Functions and Trace panel headers remain visible while their long content scrolls; the short-viewport dialog regression asserts the Functions header is sticky. Browser execution pending.

- **IMPLEMENTED — Functions/Chat Action modal focus regression (this commit).** Playwright now exercises Tab/Shift+Tab wrapping, Escape closure and return focus to each invoking control for both dialogs. Browser execution pending.

- **IMPLEMENTED — 30-point acceptance status reconciliation (this commit).** Items with code/test coverage are marked PARTIAL `[~]`; all 30 remain open until Chromium/native-device evidence. The matrix explicitly distinguishes Playwright emulation from real mobile OSK/VoiceOver.

- **IMPLEMENTED — remaining 42px touch-target exceptions (this commit).** Jump-to-latest and Project Settings inputs/selects now meet the 44px internal baseline; their E2E geometry assertions enforce the target. Browser execution pending.

- **IMPLEMENTED — visible Stop target regression (this commit).** The root control test now temporarily exposes the Stop control and asserts its 44×44 mobile target; this verifies styling/geometry, not the live streaming/abort transition.

- **IMPLEMENTED — iOS-safe Project Settings typography (this commit).** Removed a misleading 14px declaration; the shared <=640px `!important` form rule keeps editable controls at 16px. Playwright asserts computed 16px and 44px minimum height at 320/390px.

- **IMPLEMENTED — root keyboard and toolbar bounds regression (this commit).** Responsive sweep measures toolbar edges at all eight widths; root focus/44px coverage includes modeDeep, Functions and execution-mode toggle; added a real Tab-order walk across toolbar → composer → sidebar. Browser execution pending.

- **VERIFIED — exact-HEAD Pages + Graphify:** `b72d134fcc4b5de2dc123ac919cea3d51a9ea72d`; Pages build/deploy #44450998348 SUCCESS; Graphify #44450998692 SUCCESS. Playwright E2E was not run; Quality Sentinels requires manual workflow_dispatch, which is not exposed by the current GitHub connector.
