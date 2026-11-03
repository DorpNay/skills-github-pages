# aLandi — ФАЙЛ-ОРИЕНТИР ДЛЯ ПРОДОЛЖЕНИЯ РАБОТЫ

## Текущая контрольная точка — 2026-11-03, визуальная приёмка V2

- Main V1: `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`; не менять.
- PR #131, branch `feat/landing-v1-accessibility-responsive-20261031`. На начало аудита HEAD `fd9eee63d781ca2fc8c276edafb79d97f6810c56`; base/merge-base `e78a73b25725bfa63370d9946887cbbacbf51b82`; 989 ahead / 4 behind; mergeable=false. После docs-only checkpoint commits HEAD нужно получить заново из GitHub.
- Последний доказанно зелёный app/test SHA: `6d57e2b7130a75db3b7a1aadfbac9c0b0d2734b0`. Quality #41540703827: 4/4 Chromium shards + обязательные sentinels passed; Graphify #41540704000 passed. Published Pages smoke skipped. Это не проверка более позднего E2E capture source.
- Шрифт кнопок перепроверен: итоговый CSS rule применяет один stack к `body,button,input,textarea,select`; responsive test сравнивает computed family на 320/360/390/768/1024/1440 px. Доказательство Quality #41540703827 относится к SHA 6d57e2b; ОС выбирает доступный font fallback.
- Добавлен Playwright тест, который должен сохранить визуальные состояния sidebar/memory, Functions, Agent categories/Team Blueprint, Skills/library, aServi/providers/Additional Settings. Test source на `fd9eee63d781ca2fc8c276edafb79d97f6810c56`; syntax PASS, browser run NOT RUN. Старый 8-image artifact — только shell/sidebar.
- 8.1–8.17: 8.5 [x]; остальные в implementation ledger [~], поскольку автоматическая часть не заменяет real iPhone Safari, VoiceOver, keyboard-only, full component WCAG и реальные API/провайдер gates. Project Sources CRUD остаётся заблокирован до scoped source-list API.
- Vercel project для репозитория не найден; Pages публикует stable V1. Не использовать Pages target для V2 preview. Новые скриншоты получать из CI Chromium artifact.
- Гигиена: 127 refs, 10 открытых PR, issue #111. Пять behind-only branch candidates и их HEAD SHA записаны в `docs/REPOSITORY_HYGIENE_RU.md`; удаление недоступно в connector. Подтверждённых бесхозных файлов нет; GitHub Skills exercise scaffold требует проверки template state/history.
- Короткий task selector добавлен в OLEDUE и включён в AGENTS fast-entry protocol. Master Registry (544 lossless open/partial records; deduplication ещё не завершена) остаётся на PR #127.
- NEXT: получить exact-head Chromium/Quality и полный набор снимков; провести review открытых экранов; затем закрывать один конкретный оставшийся gate.

## Навигация и владение записями

См. `ORIENTER.md` → **Record ownership**. Здесь хранится подробная карта файлов и одна текущая контрольная точка; старые checkpoints ниже — только история. При расхождении live GitHub и сохранённых SHA всегда доверять live GitHub.

## Исторические контрольные точки


## Историческая контрольная точка — 2026-11-02, Landing V2 taxonomy slice

- PR #131 открыт, не объединён; ветка `feat/landing-v1-accessibility-responsive-20261031`; docs checkpoint `5e7faea91bb3b88384b75f68f6f5ac8ae313b3d8`, source/test HEAD `79790a018234b0f141f7ee902430165f6471a920`. Main остаётся V1; merge/rebase/sync/deploy не выполнялись.
- Additional Settings regrouped into three purpose disclosures. Function menu groups task workflow and connections. Structured-workflow configuration is divided into execution mode and blueprint parameters. RU/EN labels and E2E tests added.
- Graphify run `41389386456` passed on exact source/test HEAD. Quality #1398 / run `41389870537` pending, jobs not yet available; no Chromium pass claim. Previous Quality #1359 result applies only to its prior checkpoint.
- V2 live preview not configured: Pages target serves main V1; Vercel connected context/project search returned no available team/project. No new repo or deployment without owner approval.
- Next: verify Quality/Chromium, fix regressions, gather real screenshots and continue native iPhone/VoiceOver/WCAG review.

## Историческая контрольная точка — 2026-11-02, Quality #1252 green

- PR #131 открыт и не объединён; branch `feat/landing-v1-accessibility-responsive-20261031`; code HEAD `f3151472e285c7d31d46809f52337202eb15e6b3`; documentation HEAD `63f429ccf16fe7648519ebb3ecc02b9f8949ad53`. Сравнение: 653 commits ahead / 4 behind main; rebase/main synchronization без разрешения запрещены.
- Quality #1250 на code HEAD прошёл после расширения E2E для 8.13. Quality #1252 / run `41365833770` на docs HEAD прошёл: 4/4 Chrome shards и все sentinels зелёные. Provenance #976 / run `41365833791` также success.
- 8.13: queued project-context handoff сохраняется в tab-scoped sessionStorage как chat/project IDs; восстанавливается после reload для активного и другого target chat; после первого успешного запроса потребляется. E2E проверяет отсутствие нового чата, смены project membership и повторной инъекции.
- Supply chain: 13 workflow files и 33 direct refs; 33/33 закреплены полными 40-character SHAs на main и PR branch. Однако вложенные action refs внутри pinned `skills/exercise-toolkit` reusable workflows остаются mutable tags; это отдельный открытый follow-up. Live branch ruleset не проверен.
- CI автоматически запускается от push/pull_request; workflow вручную запускать не требуется.
- Второй репозиторий по просьбе владельца пока не создавать. Единственный Pages target V1 не трогать; deployment не выполнялся.
- Upstream triage: SGLang/Qwen3-Next (4×H100/H200; 80B total/3B active — не SLM), LightAgent, llm-apipool (cross-provider fallback не подходит), BentoML, GPTQModel, LLM Compressor и Plexor RCT. Ничего не установлено и не загружено.
- Native iPhone Safari, VoiceOver, full composited WCAG contrast и screenshot review остаются отдельными gates.
- Не удалять branches/files, не merge/rebase/deploy. Следующий шаг — продолжать UI scope 8.1–8.17 в PR #131 и не ждать CI без параллельной работы.


## Историческая контрольная точка — 2026-11-02, Quality #1251 green

- PR #131 открыт и не объединён; branch `feat/landing-v1-accessibility-responsive-20261031`; code HEAD `f3151472e285c7d31d46809f52337202eb15e6b3`; documentation HEAD `61f1ae1dbac08da6c0a873bc5b72926cecb83bee`. Сравнение: 653 commits ahead / 4 behind main; rebase/main synchronization без разрешения запрещены.
- Quality #1250 / run `41364775725` на code HEAD прошёл после расширения E2E для 8.13. Quality #1251 / run `41365456706` на docs HEAD прошёл: 4/4 Chrome shards и все sentinels зелёные. Provenance #975 / run `41365456760` также success.
- 8.13: queued project-context handoff сохраняется в tab-scoped sessionStorage как chat/project IDs; восстанавливается после reload для активного и другого target chat; после первого успешного запроса потребляется. E2E проверяет отсутствие нового чата, смены project membership и повторной инъекции.
- Supply chain: 13 workflow files, 33 внешних Action/reusable-workflow refs; 33/33 закреплены полными 40-character SHAs и на main, и на PR branch. Live branch ruleset этим не подтверждается.
- CI автоматически запускается от push/pull_request; workflow вручную запускать не требуется.
- Второй репозиторий по просьбе владельца пока не создавать. Единственный Pages target V1 не трогать; deployment не выполнялся.
- Upstream triage: SGLang/Qwen3-Next (4×H100/H200; 80B total/3B active — не SLM), LightAgent, llm-apipool (cross-provider fallback не подходит), BentoML, GPTQModel, LLM Compressor и Plexor RCT. Ничего не установлено и не загружено.
- Native iPhone Safari, VoiceOver, full composited WCAG contrast и screenshot review остаются отдельными gates.
- Не удалять branches/files, не merge/rebase/deploy. Следующий шаг — продолжать UI scope 8.1–8.17 в PR #131 и не ждать CI без параллельной работы.


## Историческая контрольная точка — 2026-11-02, Quality #1250 green

- PR #131 открыт и не объединён; branch `feat/landing-v1-accessibility-responsive-20261031`; exact HEAD `f3151472e285c7d31d46809f52337202eb15e6b3`. Main остаётся V1 baseline. Сравнение: 653 commits ahead / 4 behind main; не выполнять rebase/main synchronization без разрешения.
- Quality #1250 / run `41364775725`: exact-head push run завершился success за 207s. Все четыре real Chrome shards passed; preflight, static analysis, Integrity, Security, Context и Jekyll — success. Published-site smoke skipped; публикация/preview не проверялись.
- 8.13: queued project-context handoff сохраняется в tab-scoped sessionStorage как ID чата и проектов; восстанавливается после reload и для активного, и для другого target chat; после первого успешного запроса потребляется. Playwright проверяет отсутствие нового чата, смены project membership и повторной инъекции контекста.
- CI автоматически запускается от push/pull_request; workflow вручную запускать не требуется.
- Второй репозиторий по просьбе владельца пока не создавать. Единственный Pages target V1 не трогать; deployment не выполнялся.
- Обновлён upstream triage: SGLang/Qwen3-Next (4×H100/H200, 80B total/3B active — не SLM), LightAgent, llm-apipool (cross-provider fallback не подходит), BentoML, GPTQModel, LLM Compressor и Plexor RCT. Ничего не установлено и не загружено.
- Native iPhone Safari, VoiceOver, full composited WCAG contrast и визуальный screenshot review остаются отдельными gates.
- Не удалять branches/files, не merge/rebase/deploy. Текущий следующий шаг — продолжать UI scope 8.1–8.17 в PR #131 и не ждать CI без параллельной работы.


## Историческая контрольная точка — 2026-11-02, Quality #1234 green

- PR #131 открыт, не объединён; branch feat/landing-v1-accessibility-responsive-20261031; code HEAD на момент проверки 9a23d58313da6379cb112b617daedeaa6d38f605. Main остаётся V1 baseline. Не выполнять merge, rebase или main synchronization без отдельного разрешения.
- Quality #1234 / run 41363212486: exact-head push run завершился success за 105s. Четыре real Chrome shards прошли по 32 теста каждый: 128 passed, 0 failed. Preflight, static analysis, Integrity, Security, Context и Jekyll — success. Published-site smoke — skipped; публикация/preview не проверялись.
- Quality #1233 выявил transient high-contrast E2E failure: #uiTextContrast был hidden на selectOption. На следующем exact-head run #1234 тест прошёл без source change; наблюдать за flakiness.
- CI использует Playwright 1.56.1 и runner-provided stable Google Chrome через channel=chrome; локально остаётся Playwright Chromium. Нет apt-get browser dependencies и скачивания браузера в CI.
- Baseline Quality #1197 = 1863s, но это timeout с неполным прогоном. Нельзя объявлять speedup до сопоставимого completed baseline и одинакового набора тестов.
- V2 preview: один GitHub Pages target в этом repository. PR deployment в него заменит V1; ничего не публиковать туда. Отдельный Pages URL требует второго Pages site/repository или отдельного host. Preview пока не развёрнут.
- Hygiene: branch inventory snapshot = 126 refs; не-head открытого PR не означает orphan. Delete-ref action отсутствует; ветки/файлы не удалялись. Сохранять уникальные commits и закрытые unmerged workstreams.
- 60 owner-provided source repositories зафиксированы в docs/OPEN_SOURCE_TRIAGE_RU.md; это reference-only, никаких framework/runtime/model/dependencies не импортировано.
- Canonical backlog: docs/V1_UI_FINALIZATION_RU.md section 8.0; mandatory 8.1–8.17 остаются release scope. Implementation evidence: docs/LANDING_UI_V2_IMPLEMENTATION_RU.md. Полный CI и проектный контекст — ORIENTER.md и docs/PROJECT_STATE.yaml.
- Обновлены checkpoints: ORIENTER.md, docs/PROJECT_STATE.yaml, docs/VOLLEY_LOG.md, docs/REPOSITORY_HYGIENE_RU.md. Последующие изменения state сверять с live PR metadata, не копировать исторические SHAs.
- Next: продолжать bounded UI slices, upstream research и branch ancestry audit; подготовить отдельный preview target и workflow без доступа к production Pages. Native iPhone Safari, VoiceOver, full component-level WCAG и live runtime остаются отдельными gates.

> Исторические разделы ниже сохраняют контекст; live refs и результаты перепроверять перед каждым действием.

> Исторические разделы ниже сохраняют контекст; live refs и результаты перепроверять перед каждым действием.


> **Первым делом:** прочитай корневой `ORIENTER.md` как короткую точку входа, затем этот подробный индекс, `docs/PROJECT_STATE.yaml` и последнюю запись `docs/VOLLEY_LOG.md`. После этого открывай только файлы, относящиеся к текущей задаче. Этот индекс — навигация, а не доказательство того, что feature включена или развёрнута.

## Текущая контрольная точка — 2026-10-30

- Текущий main: `fd4f0a105183feb23e0f4e4697446235de9ffe9a` — PR #121 и PR #122 merged.
- PR #121 merged: `f4d880f9648989f4fe48ddd2284220b3606c3b86`, exact head `e3c30173c40c4bd45bd2f49b23e0a3f33bdfb97b`. Exact-head workflow groups passed: Gateway, Quality (Chromium/Jekyll/published-site smoke, Context/Security/Integrity), Freshness, Provenance, Graphify, Dead Code.
- PR #122 merged: `fd4f0a105183feb23e0f4e4697446235de9ffe9a`, exact head `94d871dbf76a5364ebb3c61d86cc763affa5eaa1`. Gateway, Quality (Chromium/Jekyll/published-site smoke, Context/Security/Integrity), Graphify and Dead Code passed.
- Очередь для freshness-сравнения (текущий PR исключается): **open PRs (0): ; open issues (1): #111**. Активный PR #123 — reconciliation документации и helper benchmark; exact head `fb6f6b6f4036cfc54d5e4dc35a6e0105a9272222` прошёл все шесть workflow groups, PR готов к merge. После merge очередь PR должна стать нулевой. Issue #111 — единственный owner/live-host gate; не закрывать без фактических VPS, hardware, credentials, ruleset, corpus, voice, sandbox и OAuth evidence.
- Первый бесплатный лендинг V1 зафиксирован. После PR #121 **не добавлять новые продуктовые возможности и runtime-компоненты**. Разрешены только UX polish, надёжность, безопасность, доступность, производительность, тесты и документация внутри существующего HTML/CSS/JS + Jekyll/GitHub Pages и FastAPI/Ollama стека.
- Основные источники: `docs/V1_UI_FINALIZATION_RU.md`, `docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md`, `docs/LANDING_UX_POLISH_BACKLOG_RU.md`, `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`, `docs/PROJECT_STATE.yaml`.
- Малые модели: в main есть ручной memory-helper opt-in через операторский `ALANDI_HELPER_MODEL`; general-purpose subagent routing не реализован. 64 роли — логические контракты, не отдельные процессы. Синтетический benchmark не заменяет human-rated и target-host evaluation.
- Не подтверждено: post-merge Pages deployment на точном merge SHA; native iPhone Safari/VoiceOver; live VPS/Tunnel/Ollama и provider credentials; target-host model RAM/latency/quality; production voice, RAG golden set, OAuth/Drive и CLI sandbox.

## Историческая контрольная точка — 2026-10-28

- **Last main action:** docs: preserve engineering and runtime readiness audits.
- **Baseline main SHA на историческом срезе:** `337e38690af8f22a712c6442192c5ea62d354c3d` (2026-10-28T05:36:59Z; documentation-only; parent `91557e4eab1b122341bed578cdf4775ff867007f`).
- **Последний функциональный checkpoint:** `91557e4eab1b122341bed578cdf4775ff867007f`; на main уже находятся PR #77 (RRF), #76 (Graphify workflow) и #72 (search/functions UX).
- **Точные проверки main:** Quality Sentinels #40639031308 и Pages deployment #40639030224 прошли на `337e38690af8f22a712c6442192c5ea62d354c3d`. На code-identical parent `91557e4eab1b122341bed578cdf4775ff867007f` прошли Gateway #40637941350, Quality #40637941308, Graphify #40637941303 и Pages #40637941951.
- **GitHub API snapshot от 2026-10-29:** open PRs (9): #78, #80, #81, #82, #83, #84, #85, #86, #87; open issues (14): #88, #89, #90, #91, #92, #96, #97, #98, #99, #100, #101, #102, #103, #104.
- **PR #78:** остаётся открытым; его base SHA — `91557e4eab1b122341bed578cdf4775ff867007f`, поэтому он отстаёт от актуального main на документационный коммит `337e38690af8f22a712c6442192c5ea62d354c3d`. Не считать его изменения влитым состоянием и не закрывать/сливать без проверки конфликтов и exact-head gates.
- **Runtime boundary:** GitHub Pages и указанные CI run-ы подтверждены; live VPS/gateway, установленные model/voice artifacts, реальное микрофонное воспроизведение и performance на целевом хосте не подтверждены.
- **Проверка актуальности:** `scripts/check_project_state_freshness.py`; ежедневный workflow `.github/workflows/project-state-freshness.yml`. Точный SHA и точные ID очереди сверяются с GitHub API; проверяемый PR исключается только из собственного сравнения. При любом ином изменении очередь/ориентир должны быть согласованно обновлены.

## 1. Быстрый маршрут

0. **Короткая точка входа:** корневой `ORIENTER.md`.
1. **Текущий статус и флаги:** `docs/PROJECT_STATE.yaml`.
2. **Архитектура и границы:** `docs/ALANDI_MASTER_CONTEXT_RU.md`.
3. **Что пользователь просил и что осталось:** `docs/USER_REQUEST_CHECKLIST.md` и живой V1 release gate `docs/V1_UI_FINALIZATION_RU.md`.
4. **Порядок внедрения:** `docs/IMPLEMENTATION_ROADMAP_RU.md`, `docs/CODER_PACKET.md`.
5. **Решения / eval / цикл:** корневые `DECISIONS.md`, `EVALS.md`, `LOOP.md`, `INTEL.md`, `IMPROVEMENT_SELECTION.md`.
6. **Поиск и исследования:** `docs/SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md`.
7. **Карта модулей:** `docs/ALANDI_ARCHITECTURE_MAP_RU.md` — кураторская схема, не автоматически извлечённый Graphify graph.
8. **Лицензии и происхождение:** `infra/license/provenance_manifest.yaml`; не подключать runtime/model/voice без отдельной проверки лицензии и SHA-256.
9. **Основной клиент:** `index.md` (большой единый HTML/JS файл). Перед правками найди точные функции/якоря, не делай широких замен без проверки единственности.
10. **Backend/API:** `gateway/app.py`; тесты в `gateway/tests/`; зависимости в `gateway/requirements*.txt`.
11. **Память:** `gateway/memory/{manager.py,schema.sql,delta_sync.py,scope.py,conflict.py,temporal.py}`; браузерное хранение и экспорт — `index.md` около `safeSet`, `downloadRecoveryBackup`, `exportChats`, `exportProjectBundle`.
12. **Голос и вложения:** `gateway/voice/`, `gateway/tests/test_audio_*.py`, `tests/e2e/audio-transcription.spec.mjs`, `tests/e2e/document-attachments.spec.mjs`.
13. **Реальные browser checks:** `tests/e2e/`, workflow Quality Sentinels; отдельная GitHub Pages публикация не означает, что VPS gateway обновлён.

## 2. Исторические milestones реализации (не current queue/status)

- PR #45: local document extraction + authenticated capabilities — merged; server flag off by default, actual VPS configuration unverified.
- PR #48: non-queueing local audio concurrency — merged.
- PR #50: UI routes PDF/DOCX/XLSX only through configured local gateway — merged, CI reportedly passed.
- PR #51: stop cancels in-flight TTS and prevents stale playback — merged.
- PR #53: attached-audio transcription through local ASR — merged.
- PR #60: local half-duplex voice dialogue prototype — merged; CI mocks media/model calls; target hardware/audio quality unverified.
- PR #61: mobile message viewer/copy fallback/jump-to-latest — merged at `529b1d0b86aef58c2b84663a44e78677a31ce9b1`; exact-head Quality (6 jobs) and provenance passed.
- PR #62: open-source triage docs — merged at `f689cbe17a2996ebd4cd2ca9fcb71d60102a6c25`; triage decisions are not runtime installs.
- PR #63: root orienter + AGENTS first-read protocol — merged at `623f1865ee4021debade9000bbecf6004c6b4cfa`; main has since advanced with docs-only commit `b91aab316c224588baea99fbb9b966b8865de0a6`.
- Open PRs at index creation: #52 document attachment integration (branch `feat/document-attachment-ui-v3`), #37 mobile chat ergonomics, #36 project-memory scope regression tests. Check live PR status before assuming any remain open.
- Local whisper.cpp ASR and Piper TTS + mini-player are code-level features, **not enabled/deployed by default**. Verify models, binary paths, flags, and target hardware before saying audio works on the user's server.
- Search & Research Studio exists; SearXNG adapter is optional/configured-server-only, not an independently deployed search cluster.
- Browser/local memory and conversation delta sync are separate stores. The former server-memory graph HTTP API and browser bridge were removed in PR #131; the MemoryManager module/schema remain internal to Graphify/code-evidence only. No project memory is synced to gateway.

## 3. Folder taxonomy

`docs/` contains project documentation and planning; `gateway/evals/` contains evaluation instructions/scripts; `infra/license/` and `infra/*.yaml` contain runtime/deployment configuration and provenance; `skills/` contains prompt/skill assets loaded by the app; `tests/` and `gateway/tests/` are executable verification assets. Do **not** move these into a generic archive folder without updating imports, CI paths, Pages links and relative Markdown links.

Root engineering records (`DECISIONS.md`, `EVALS.md`, `IMPROVEMENT_SELECTION.md`, `INTEL.md`, `LOOP.md`, `PROVIDER_SETUP.md`) are reference documentation, not runtime modules, but CI and docs link to them. Keep compatibility paths if relocating them. This index is the single recommended entry point; preserve current paths until a link-aware migration can be tested.

## 4. Memory: known architecture boundary

- Browser chat history is stored through `localStorage`; application notes also use IndexedDB. Browser quota/eviction and clearing site data can cause loss. A localStorage fallback/backup is not a separate durable backup medium.
- The gateway retains one opt-in conversation delta-sync API (`ALANDI_MEMORY_SYNC_ENABLED=false`). The scoped memory graph HTTP API and ALANDI_MEMORY_GRAPH_ENABLED / ALANDI_GLOBAL_MEMORY_ENABLED settings were removed in PR #131. Internal MemoryManager remains for Graphify only; it is not a gateway product API.
- Graph facts require source provenance, scope and status; newly uploaded facts are candidates, not automatically trusted facts. Prompt use is opt-in and should remain scope-restricted.
- OAuth vault/Google OAuth routes exist as groundwork; real credentials, Drive Picker/UI, file import and sync are not configured. Do not promise Google Drive synchronization.
- Do not store raw long audio, recordings or full files in the compact “memory” graph. Preserve original conversation/attachment as an immutable source, then store a short, source-linked summary/transcript plus hash and offsets. Never overwrite the only source with a summary.
- Compression can reduce archival size, but is not a substitute for retention, integrity hashes, version history, backups and restore tests. Encrypted data cannot be compressed efficiently; compress before encryption. Never silently discard history when limits are reached.

## 5. Working protocol

- Verify current branch/HEAD, PR diff and user changes first.
- Make small reversible changes, feature-flagged where appropriate.
- Run relevant gateway tests plus security/context/integrity/Jekyll/Chromium and provenance checks; report exact evidence.
- Update `docs/PROJECT_STATE.yaml` and `docs/VOLLEY_LOG.md` after a meaningful milestone.
- Never equate code merged, CI passed, Pages deployed and VPS configured; these are separate statuses.


## Historical checkpoint — root orienter and queue cleanup (2026-10-27)

- Root `AGENTS.md` теперь явно направляет агента сначала к этому orienter и state file.
- PR #63 merged at `623f1865ee4021debade9000bbecf6004c6b4cfa`; its checks: Quality Sentinels, Chromium, published Pages smoke and provenance all passed.
- Live queue checked after merge: 0 open PRs, 0 open issues. This is a snapshot; always refresh before edits.
- Graphify is not installed/run: the previous execution container could not resolve github.com. The next real implementation step is a network-enabled isolated pilot, not claiming graph integration.

## Historical checkpoint — open-source triage (2026-10-27)

- Решения по дополнительному списку внесены в docs/OPEN_SOURCE_TRIAGE_RU.md; техники и способы применения — в docs/TECHNIQUE_REGISTER_RU.md.
- Состояние и продолжение записаны в docs/PROJECT_STATE.yaml; журнал этапов — в docs/VOLLEY_LOG.md.
- Ветка документации: docs/source-triage-and-next-steps-20261027. Это документационный этап, не runtime-интеграция.
- Следующий этап: (1) запустить Graphify в сетевой изолированной рабочей копии и сравнить результат с обычным чтением репозитория; (2) перенести только выбранные идеи из закрытого PR #37 небольшими PR с exact-head tests; (3) проверить актуальную очередь GitHub; (4) продолжать только измеримые, безопасные реализации.
- Не считать Graphify установленным/запущенным: в этом checkpoint изучен upstream README и задокументирован пилот, но локальный запуск ещё не подтверждён.

- Ограничение текущего окружения: `git clone https://github.com/...` не удался из-за DNS (`Could not resolve host: github.com`); не утверждать, что Graphify был установлен или запускался.


## Historical checkpoint — root orienter rollout

- Текущая ветка документации: `docs/root-orienter-checkpoint-20261027`; корневой `AGENTS.md` дополнен протоколом первого чтения, ведения чекпоинтов и отдельной границей Graphify vs memory graph.
- На main в момент старта: `623f1865ee4021debade9000bbecf6004c6b4cfa`; PR/Issues очередь была пустой.
- Следующий шаг после merge этого docs PR: Graphify pilot в среде с сетевым доступом и локальной копией репозитория. Если текущая среда не позволяет checkout/install, зафиксировать blocker и перейти к доступным безопасным улучшениям, не выдавая пилот за выполненный.


## Historical checkpoint — reconcile current main and evidence ledgers (2026-10-27)

- **Current main at start of this stage:** `b91aab316c224588baea99fbb9b966b8865de0a6`.
- **Queue:** live GitHub API returned 0 open PRs and 0 open issues.
- **Exact-main workflows:** Provenance run #40522824071 passed; Pages build/deployment run #40522822481 passed; Quality Sentinels run #40522824202 was still in progress when checked. Do not report all gates green until that run completes.
- **Documentation drift found:** `EVALS.md` still said the mobile message tools were pending despite PR #61 being merged and its exact-head Quality/Chromium + provenance passing; roadmap still labelled the PR #61 slice “validation pending”. These statuses are being reconciled in a small docs-only change.
- **Graphify:** still not run. Prior container clone failed due DNS resolution of github.com; GitHub API reading is not a local checkout and does not satisfy the pilot. Do not claim graph integration.
- **Next action:** wait/check Quality run #40522824202; then run Graphify only if a network-enabled isolated execution workspace is available. Meanwhile inspect product modules and only implement changes whose source, tests, and rollback can be verified.


## Historical checkpoint — PR #65 merged; architecture map and Graphify research (2026-10-27)

- PR #65 merged into main at `3887b408988e0476251736a8e7a3e3374eb2ce58`; exact PR-head checks 7/7 passed (integrity, security, context, Jekyll, Chromium, published-site smoke, provenance).
- PR #66 merged into main at `1faf60164b9a0f82eb5e0c56b143ba90499be4a5`; exact PR-head Quality checks and provenance passed; post-merge Pages and provenance passed. Post-merge Quality run #40530196483 was still in progress at last poll.
- Post-merge Quality run #40527418639 completed successfully: 6/6 jobs, including Chromium and published-site smoke.
- GitHub API tree: 140 tracked files across static UI, FastAPI gateway, memory, RAG/evidence, security, tools, voice, browser E2E and quality/provenance scripts. Local checkout remains blocked by DNS.
- Graphify upstream rechecked via Exa: Apache-2.0, package `graphifyy`, Python >=3.10, local tree-sitter code extraction; docs/media semantic pass may use a model; dependency footprint is substantial. Official code-only commands now documented in the architecture map (`extract --code-only --no-gitignore` in a tracked staging copy, `cluster-only --no-label`, `export html`, `query`).
- `docs/ALANDI_ARCHITECTURE_MAP_RU.md` adds a curated module map, routes, tests and a bounded Graphify pilot plan. `.graphifyignore` is added as a precautionary exclusion list; its interpretation by Graphify remains unverified until the pilot. The staging-copy approach prevents indexing untracked local secrets, and `--no-gitignore` preserves the SQL schema ignored by the repository's `*.sql` rule. It is not a generated dependency graph.
- Graphify is **not run**: `git clone https://github.com/DorpNay/skills-github-pages.git /tmp/alandirepo` failed with `Could not resolve host: github.com`. No CLI install or graph generation claimed.
- Next: confirm exact-main Quality/Pages/Provenance; inspect official code-only workflow and ignore semantics; run isolated pilot only in a network-enabled workspace; meanwhile choose a bounded product change supported by current source/tests.


## Historical checkpoint — PR #66 merged (2026-10-27)

- Merge SHA: `1faf60164b9a0f82eb5e0c56b143ba90499be4a5`.
- Added curated architecture map `docs/ALANDI_ARCHITECTURE_MAP_RU.md`, README link, source-triage/technique updates, and `.graphifyignore` exclusions. This is not a generated AST graph.
- PR-head Quality run #40529576448 passed all 6 jobs, and provenance #40529576476 passed. Post-merge Pages run #40530195904 and provenance #40530196480 passed. Post-merge Quality #40530196483 завершился success (6/6 jobs).
- GitHub API queue after PR #66 and again after PR #67: 0 open PRs and 0 open Issues at the respective checks.
- Post-merge Quality #40530196483, Pages #40530195904 and provenance #40530196480 all completed successfully.
- Local Graphify still cannot run in this execution container because DNS resolution for github.com fails. A read-only GitHub Actions pilot workflow is now being prepared to run code-only Graphify in an ephemeral staging copy, with no model calls and no runtime dependency.
- Next action: inspect the Graphify pilot workflow's PR-head CI and its artifact/logs; record actual coverage, runtime, memory and query usefulness before deciding whether a generated graph should be retained. Do not add Graphify to runtime.


## Historical checkpoint — Graphify code-only CI pilot added (2026-10-27)

- Current base before this PR: `82beb7fcddbe9a1438e811693c76bc731d3a5de3`; PR #67 is merged. Post-merge Quality run #40531356851, Pages run #40531354887 and provenance run #40531357120 all passed.
- New workflow: `.github/workflows/graphify-pilot.yml`. It runs on a narrowly filtered PR, on main when the workflow is added/changed, or manually via `workflow_dispatch`.
- First PR-head pilot run #40532798178 succeeded but exposed quality problems: 1,717 nodes/2,877 edges/140 communities, with 539 nodes from `docs/PROJECT_STATE.yaml`, 460 from workflow YAML, a missing SQL grammar, no `index.md` JS and a broad query over budget.
- Refined run #40534094060 succeeded after installing `graphifyy[sql]==0.9.96`, excluding YAML/YML/TOML from the disposable corpus, extracting inline JS from `index.md` into `index-inline.js` with original line count preserved, and narrowing queries: 940 nodes, 2,637 edges, 44 communities, 59 source files with nodes; 209 nodes from UI JS and 14 from `gateway/memory/schema.sql`. Three queries returned 134, 50 and 59 nodes.
- The refined ten-query run #40534892152 succeeded: all ten queries found graph neighborhoods (10–151 nodes each); examples: UI Research Studio 55, request parsing 50, RAG retrieval 52, audio 31 each, evidence provenance 10. The 700-token budget is approximate; evidence-provenance output (10 nodes/9 edges) still reported ~762 tokens. This demonstrates useful source navigation, though community labels remain generic because `--no-label` avoids model calls. Artifact #12747755798, SHA-256 `e16c01df143a3380bfd66be523ec709d2dc85bf35fd4d8e5133a64922a841b22`, is retained for 7 days. Generated graph remains artifact-only, not a runtime dependency.
- License/version discrepancy: release tag `v0.9.96` LICENSE and PyPI metadata identify Apache-2.0, while default-branch `pyproject.toml` appeared to show older `0.1.14`/MIT metadata. The workflow pins the published package release; do not assume every upstream ref has identical provenance.


## Historical checkpoint — local helper-memory suggestions vertical slice (2026-10-27)

- Current main baseline before PR #69 sync: `9aa36465158c27c49ff647a6ce349b46a6e1151e`; PR #69 is open. PR #70 is independent and must be reviewed separately.
- The helper uses an operator-configured local Ollama model, blank/disabled by default. Request is manual, bounded and authenticated; suggestions remain text candidates and are saved one at a time only after explicit user choice.
- Found and fixed a server filter gap: `\bAPI_KEY` did not match a prefixed environment variable such as `ALANDI_API_KEY`. New regex accepts underscore/hyphen prefixes, and the regression test now checks both input facts and returned candidates.
- Lite Gateway Tests run #40538692632 passed on earlier code SHA `c12391cbbbd2fb917035919c29ee900af477ec83`. Exact-head Quality, Chromium, Pages smoke and provenance must pass again on the post-sync head before merge.
- No live inference or target-VPS model/resource claim is made. Keep `ALANDI_HELPER_MODEL` blank until the owner chooses and installs an exact local model tag.


## Historical checkpoint — mobile composer docking (2026-10-27)

- Base main: `4c9096999fbb3e1265150c420b136066c555285b`; active PR #71, branch `fix/mobile-composer-docking-20261027`.
- Current source centered `#composerFooter` on an empty chat via `body.composer-centered` and hid the empty-chat welcome message. That makes keyboard/visual-viewport stability the first priority rather than changing layout speculatively elsewhere.
- PR #71 removes the fixed centered state, keeps the composer in the bottom flex layout, resizes the textarea against `visualViewport.height`, recomputes on viewport resize, and increases the bottom safe touch inset.
- E2E covers visibility in a new chat and viewport shrink/restore. Exact-head CI is pending; native iOS Safari behavior is not proven by Playwright.
- Full legacy request audit: `docs/LEGACY_UX_REQUEST_AUDIT_RU.md`. Already-present features include per-message copy/viewer and jump-to-latest (PR #61), web-driven attachment-type menu and per-chat row actions (PR #35); do not rewrite them wholesale. Outstanding larger verticals are function/search dropdowns, overlay/focus/outside-click contracts, provider/settings simplification, and persisting/resetting modes per chat.


## Historical checkpoint — PR #75 local TTS voice selection merged (2026-10-28)

- PR #75 (feat/configurable-local-tts-voices-20261028) merged by squash at 4296a8decc12710fafb0a1a4e9644cd8f00b2dfa; reviewed head was 006d5d564b6afd4606a604baab0cf1f78e745565.
- Exact PR-head checks succeeded: Gateway #40633704413; Quality #40633704436 (6/6, including Chromium and published Pages smoke); provenance #40633704435; dead-code audit #40633704411. These are PR-head results, not post-merge main evidence.
- Added operator-configured Piper voice allowlist, authenticated capabilities listing only installed .onnx + .onnx.json pairs, server-side voice-ID validation, mini-player voice selector and mock E2E coverage.
- ASR/TTS flags remain off by default. No model is auto-downloaded. docs/VOICE_IMPLEMENTATION_PLAN_RU.md contains owner-run VPS instructions for binary/model installation, SHA-256 and license review, private loopback binding, staged flag activation, smoke tests, metrics and rollback.
- Remaining ship gates: exact artifact hashes and individual model/voice/phonemizer license review; compatible binaries and models installed on the real VPS; current post-merge main CI; real microphone and device playback; measured latency/RAM/quality. No local test, live VPS, or physical-device validation is claimed.
- Next: verify current main SHA and post-merge checks, inspect remaining voice TODO/model provenance, then prepare the owner’s first-run checklist without enabling flags or fetching models automatically.

## Historical checkpoint — first-request runbook reconciliation (2026-10-28)

- Updated docs/START_HERE_RU.md to provide the ordered path from account/VPS/Tunnel setup to first authenticated text completion, then local PDF/DOCX/XLSX extraction, then three separate voice scenarios: record-to-editable-transcript, same-chat half-duplex dialogue, and per-message TTS mini-player/voice selection.
- Corrected stale quickstart text that incorrectly labelled PDF/DOCX/XLSX extraction unsupported. Extraction still requires the server flag ALANDI_DOCUMENT_EXTRACTION_ENABLED=true, a configured private gateway, supported format and size within configured limits; it remains off by default.
- Updated docs/PROJECT_STATE.yaml and docs/VOLLEY_LOG.md with exact PR-head evidence and remaining gates.
- Follow-up verification corrected the earlier limitation: direct GitHub Actions API lookup for exact main SHA `4fc342b468e370c792f1e87e77a20fda4de6bbaa` confirms Quality run `40634598755` and Pages deployment `40634598517` both succeeded.
- No VPS/server/device was accessed; no model weights downloaded; no voice/document flags were enabled. Model/voice/phonemizer licenses and SHA-256 remain mandatory per-artifact ship gates.


## 6. Контроль Graphify и актуального CI — 2026-10-28

- Graphify подтверждён не только по exit code: run [#40534892152](https://github.com/DorpNay/skills-github-pages/actions/runs/40534892152) собрал 940 узлов / 2637 рёбер из 59 source files; 10/10 целевых запросов вернули соседства графа. Артефакты сохраняются на 7 дней и не коммитятся в репозиторий.
- Graphify остаётся dev-only навигацией, не runtime-зависимостью и не доказательством корректности. Важные запросы: UI send path, gateway auth/provider, scoped memory, RAG, ASR/TTS, document extraction и evidence provenance.
- Ветка `ci/graphify-regular-architecture-checks-20261028` расширяет triggers на исходники и добавляет еженедельный drift-check; не считать изменение принятым до прохождения Graphify, Quality/Chromium, Pages smoke и provenance.
- PR #72: в E2E обнаружены два устаревших assertion (маршрут проверял `skill` вместо `selectedSkill`; текст «Коннекторы» проверялся с несовпадающим регистром). Оба исправлены на head `407a42ca16dfd69bee91620ae8deed098d229226`; повторный Chromium gate выполняется.
- PR #70: не объединять текущую ветку вслепую — GitHub сообщает `mergeable=false`, exact-head CI не подтверждён. Перенести RRF как отдельный change на актуальный main, сохранить scope/provenance и прогнать RAG unit + synthetic eval.
- PR #74 — черновик, основан на устаревшем base; сохранить полезный аудит готовности голоса/документов, но не мерджить старую ветку без повторного review.

## Текущий дополнительный аудит — 2026-10-30

- Основной трек: `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md` — полный список трёх ролей, выполненные шаги, findings, release plan и следующие действия.
- PR #121 branch на момент последней сверки: `68c41ac64e81402c040314abb1a6778bfce521fc`; main base `2bda22229cba3576628f92c821bb6e1562d8abc5`; 154 commits ahead / 0 behind. Ветка PR #121 содержит также documentation-only checkpoints после functional fix.
- Gateway import regression fix на code SHA `f9d5afaae983675d2c616e3fbc70942840d314e5` проверен: Lite Gateway Tests #483 success (150 passed).
- Freshness #83, Provenance #554, Dead Code #389 passed на code SHA. Quality #916 отменён при обновлении ветки; Integrity, Security, Context и Jekyll jobs успели пройти, Chromium и published smoke не завершились. Graphify #262 отменён после генерации artifact; сам artifact просмотрен, но workflow не помечен green.
- Graphify: 1,109 nodes / 3,103 edges / 53 communities; no import cycles detected. Dead-code report: один false-positive по параметру Protocol; файлов не удалять.
- Голос: текущая реализация — editable ASR, single-message local Piper TTS и half-duplex voice loop. Selection-to-speech, multi-message queue, streaming turn-taking и native AEC/barge-in не реализованы/не доказаны.
- Новые кандидаты: `virgiliojr94/book-to-skill` для Knowledge-to-Skill; `moonshine-ai/moonshine` для streaming voice (проверить RU/TH); llama.cpp/vLLM как GPU-serving benchmarks. Не добавлять без artifact/license/hardware eval.
- Ни один VPS, Tunnel, GPU host или физическое устройство не проверялись; ни один файл не удалён.

## Дополнительные требования владельца — 2026-10-30 (продолжение)
- Голос теперь является P0 deliverable первого функционального релиза: editable ASR; естественный streaming dialogue; interruption/barge-in; TTS выделенного текста, целого сообщения и очереди выбранных сообщений; реальные RU/EN/TH device tests. См. P0-13…P0-18 в docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md.
- Helper models/GPU/agent orchestration и Knowledge-to-Skill зарегистрированы как P1-10…P1-17 в том же backlog.
- Moonshine Voice перспективен для streaming STT/agent loop, но listed STT languages currently exclude RU/TH; no replacement for Whisper until language-specific model and license checks.
- OpenWOP v2, LangGraph and Temporal are orchestration research candidates; none is integrated. Existing ToolDAG remains a bounded prototype.
- Не удалять файлы на основании одного Vulture report: единственное предупреждение оказалось false positive в Protocol signature.


## Дополнительные требования владельца — 2026-10-30 (продолжение)
- Голос является P0 deliverable первого функционального релиза: editable ASR; естественный streaming dialogue; interruption/barge-in; TTS выделенного текста, целого сообщения и очереди выбранных сообщений; реальные RU/EN/TH device tests. См. P0-13…P0-18 в docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md.
- Helper models/GPU/agent orchestration и Knowledge-to-Skill зарегистрированы как P1-10…P1-17 в том же backlog.
- Moonshine Voice перспективен для streaming STT/agent loop, но listed STT languages currently exclude RU/TH; no replacement for Whisper until language-specific model and license checks.
- OpenWOP v2, LangGraph and Temporal are orchestration research candidates; none is integrated. Existing ToolDAG remains a bounded prototype.
- Не удалять файлы на основании одного Vulture report: единственное предупреждение оказалось false positive в Protocol signature.

## Debugger fix — audio subprocess cancellation (2026-10-30)
- Confirmed bug: ASR ffprobe/ffmpeg/whisper.cpp and Piper TTS child processes were killed on timeout but not on request cancellation.
- Fixed by `await_local_process()` in gateway/app.py; regression tests added to gateway/tests/test_audio_concurrency.py. Commits: `77b2691` and `363bb5c`.
- Equivalent local Python smoke: timeout and cancellation both killed/reaped the child (return code -9). This does not replace repository Gateway CI.
- Existing Gateway #483 passed 150 tests before this new fix. Current code needs Gateway CI; the connected GitHub actions interface cannot dispatch a new workflow on the new commit.

### UX polish — latest checkpoint
- Read `docs/LANDING_UX_POLISH_BACKLOG_RU.md` for all remaining landing/app presentation work.
- Landing ticker pause controls implemented in `f42c42d`; Playwright regression in `b213c8a`; exact-head CI pending. No JS/runtime dependency added.
- Full tracker also linked from `docs/V1_UI_FINALIZATION_RU.md`; update PROJECT_STATE, VOLLEY_LOG and ORIENTER after each major slice.


## Verified scratch cleanup — 2026-10-30
- Removed `temp/3`, `temp/4`, `temp/5` after checking references and updating IMPROVEMENT_SELECTION.md. Retained `temp/1` and `temp/2` as historical research. No production source files removed.
- Deletion commits and rationale: docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md and docs/PROJECT_STATE.yaml.


## Синхронизация PR #121 с последним main — 2026-10-30
- Main commit e6404d510229fa64a7bb375995d76dcba55de623 является documentation-only: добавлен docs/LANDING_UX_POLISH_BACKLOG_RU.md с оставшимися landing/app screenshot, accessibility, interaction and post-merge checks.
- PR #121 синхронизирован двухродительским merge commit 2c1e6bd811546a87f0ac86bc5e550dd9a31aeb13; compare 194 ahead / 0 behind; GitHub reports mergeable=true, mergeable_state=unstable (CI gates incomplete).
- Последний функциональный кодовый commit для audio cancellation fix: 363bb5c46c6a0fcad55bb5d243289e065ee6450a. Новый Gateway CI всё ещё требуется.


## Latest PR checkpoint — 2026-10-30
- Project state and machine snapshot refreshed at commit a22e01e9d36d67e86b1bbf37b119dcc66cb9ada3; current main is e6404d510229fa64a7bb375995d76dcba55de623. The main commit is documentation-only.
- PR #121 contains main via merge commit 2c1e6bd811546a87f0ac86bc5e550dd9a31aeb13. Last inspected compare was 200 ahead / 0 behind; query live before acting because each docs/code checkpoint advances the head.
- Gateway CI is required for audio process cancellation fix 363bb5c; previous Gateway #483 passed before that fix. Current exact-head Quality/Chromium/Pages not green.


## Landing voice scope — 2026-10-30
- Landing capability card and roadmap now enumerate editable STT, conversational voice/interruption, selected-text TTS, whole-message TTS and multi-message playback queue as first functional update requirements.
- Existing ASR/Piper/half-duplex code is distinguished from unfinished streaming/AEC/barge-in/queue/device acceptance. Playwright assertions added; current exact-head CI pending.
- ASR candidates Nemotron 3.5 Streaming 0.6B, Qwen3-ASR-0.6B and Parakeet RNNT 1.1B recorded in PROJECT_STATE and the three-role audit tracker. Whisper remains baseline until benchmark.

## Exa research + exact-head CI checkpoint — 2026-10-30
- Full synthesis: docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md.
- Security fix 051308c: reject DTD/entity declarations in OOXML; remove seven shadowed tests; Gateway CI 156 passed (one upstream AnyIO warning).
- Node24 direct Action pins commit 48874eab: 13 workflow files updated; exact-head CI all green including Chromium and published Pages smoke.
- External exercise toolkit remains pinned because newer upstream changes behavior; separate compatibility review required.
- Remaining: full subsystem audit, hardware voice evaluation, realtime audio, helper registry, durable AgentRun contract and Knowledge-to-Skill prototype.


## Полный аудит целостности стека — стартовый checkpoint 2026-10-30
- Полный исходный snapshot, замороженная граница стека, checklist A1–D6 и handoff brief субагенту: `docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md`.
- Проверенный исходный PR #123 HEAD: `f6e67db5a7e39abc5f9351aae5ccadefc58e865e`; base main: `fd4f0a105183feb23e0f4e4697446235de9ffe9a`; open, mergeable=true. Предыдущая проверка exact-head: 6/6 workflow groups passed. После любого нового коммита эти результаты не переносятся автоматически.
- Единственный открытый issue #111 — owner/live-host evidence. Не закрывать по CI.
- Сначала снимок/ориентиры, затем системная карта, сквозные взаимодействия, качество/безопасность, независимый review и только потом минимальные исправления. Архитектуру не расширять.


## Landing V2 — live continuation checkpoint (2026-11-02)

- Canonical scope remains PR #131 only, branch `feat/landing-v1-accessibility-responsive-20261031`; live source/test checkpoint for the 8.25 connectivity slice: `6489f5a9b6d2d3e8c68b2bad993f7b85a4521cbd`.
- Added an accessible RU/EN composer warning for the browser's offline signal, explicitly not API health; reconnect asks for manual retry only. Drafts now flush on hidden-tab `visibilitychange` and `pagehide`.
- E2E tests cover offline → online without automatic request replay and immediate draft persistence on tab hide. Source syntax and CSS brace checks passed; browser tests are authored but not yet executed.
- Exact-head Quality #1405 (`41390877580`) pending; Graphify #437 (`41390877512`) queued. No exact-head browser pass is claimed.
- PR #131 remains open/unmerged, mergeable=false. Main, production Pages and PR #132 are untouched; no rebase, merge or deployment. Attachments remain intentionally non-persistent.


## Landing V2 — Undo slice (2026-11-02)

- Source/test checkpoint: `ba709ac95c8896581133dfcce02234281f75fd90` on PR #131.
- Added bounded Undo for a chat's project move through the existing toast. The inverse operation validates the chat's current assignment and the original project's existence before restoring; conflicts never overwrite later user changes.
- Added an accessible 44px toast action and Playwright regression. V8 syntax and CSS brace checks passed; Chromium test remains unexecuted.
- This does not yet provide persistent command history or Undo for rename/project deletion/settings. Exact-head Quality still needs a fresh completed run.


## Landing V2 — Undo entry-point coverage (2026-11-02)

- Latest source/test checkpoint: `f35f542070a261ddfe075d2cc0ee7281c0fdbe8b`.
- Undo for chat project moves is now covered through both the current-chat project selector and the chat-row context menu. The test confirms the original project assignment and chat identity are restored.
- V8 syntax check passed; Chromium tests remain authored, not executed. Exact-head Quality must be checked after the final documentation push.


## Landing V2 — chat-delete Undo (2026-11-02)

- Latest source/test checkpoint: `6f2863094434cd75c8794c348117cc8ea597f271`.
- Chat deletion now offers immediate Undo through the existing last-closed-chat recovery slot, but only if that snapshot was saved and still belongs to the same chat. A newer deletion safely expires the older action.
- Added Playwright regression; existing seven-day reload recovery remains unchanged. V8 syntax check passed; Chromium run pending.


## Landing V2 — chat-rename Undo (2026-11-02)

- Latest source/test checkpoint: `f7e74f41b608cded7030d1185c9b747b3190e78a`.
- Chat-title rename now has bounded Undo; the prior title is restored only if no later rename has changed it. Added Playwright regression for both UI and persisted state.
- Syntax parsing passed; Chromium execution pending. Undo scope remains local chat move/delete/rename, not project cascade or settings.


## Landing V2 — keyboard focus after Undo (2026-11-02)

- Latest source/test checkpoint: `45275d5ad854ccfdd73f3b24231c197eeac38c82`.
- Undo now returns keyboard focus to the affected visible chat row, with composer fallback. Added an Enter-key Playwright regression for rename Undo and focus restoration.
- V8 syntax parsing passed; Chromium execution remains pending.


## Landing V2 — Quality Integrity repair (2026-11-02)

- Quality #1431 identified the missing `#uiTheme` control; `app.js` still required it during settings initialization. Restored it in the existing advanced appearance disclosure and added RU/EN option labels.
- Added Playwright coverage for theme selection, persistence and synchronization with the header toggle. Source/test HEAD: `74de58706b28d55f405c238b916651c26281098d`; syntax check passed; exact-head Quality pending.
