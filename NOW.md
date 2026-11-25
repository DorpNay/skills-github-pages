# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-25 · **Репозиторий:** `DorpNay/skills-github-pages` · **Ветка:** `main`
**Последний полностью проверенный application-code baseline:** `191b2dac602273a2c3c4a2d80fbd722acadf6cd1`. Поверх него выполнен документационный/Jekyll metadata commit `a5423012a4f499531e66607c1103078ae735192f`; при старте следующей задачи заново получить текущий live `main` SHA.

## Старт новой задачи
1. Прочитать только root `NOW.md`, строки 1–100.
2. Одним пакетом получить live `main` SHA, открытые PR/issues и Actions/checks **на этом SHA**.
3. По задаче открыть нужный раздел `docs/ALANDI_MASTER_PLAN_RU.md` и профильные источники из `INTEL.md`.
4. Читать только связанные исходники/тесты. Не восстанавливать legacy orienter bundles и не создавать параллельные очереди.

## Три канонических рабочих документа
- **NOW.md** — компактный первый вход, приоритет, live checkpoint и ближайшее действие.
- **docs/ALANDI_MASTER_PLAN_RU.md** — полный список всех требований, P0–P8, acceptance, незакрытых задач и истории.
- **INTEL.md** — внешний source map, версии/лицензии/provenance и подключённые assistant-side инструменты.
GitHub `main` — источник истины. Project Sources и Project Instructions синхронизируются вручную.

## Зафиксированная директива владельца — 2026-11-25
- **Цель:** довести все применимые срезы и задания P0–P8 до реальной реализации; начинать с Landing/P0, затем P1–P5 core, затем P6 voice/audio и P7 provider review, после — P8 release. Не заменять существующие P0.1–P0.35/P1–P8 новыми общими задачами.
- **Main-first:** работать в `main` связными, но небольшими обратимыми commits; до каждого write проверять точный HEAD/parent и использовать expected-SHA guard. Не создавать лишние PR/ветки. Существующие PR/ветки сначала сверять и переносить только доказанно полезные минимальные изменения; не merge/close/delete/force-push/rebase/reset без отдельного основания и разрешения.
- **Pages — неприкосновенно:** не менять workflow автоматической Pages-публикации, её триггеры, build/deploy, настройки публикации и не инициировать ручной deploy. Тестовые workflow допустимы только отдельно и без побочного изменения автопостинга.
- **Upstream reuse override:** допускается перенести целую зрелую систему/подсистему, если это быстрее и эффективнее, чем переписывание, и она встраивается без нарушения контрактов. До переноса проверить лицензию всего дерева/транзитивных компонентов/weights, security advisories, актуальный commit/release, runtime/API, изоляцию/permissions, данные и retention, размер/ресурсы, offline fit, миграцию, поддержку, тесты/eval и rollback. Чётко различать code copy, адаптацию и заимствование принципа. Не тащить framework/runtime только ради визуального сходства.
- **Исследование по каждому P0–P8:** использовать актуальные официальные primary sources, upstream repositories/releases, versioned docs, security advisories и реальные tool/plugin/skill contracts. Сравнивать не только feature list, но и стоимость, ограничения, лицензии, reliability, privacy, cancellation/recovery и переносимость. Записывать результат и disposition в существующий `INTEL.md`.
- **Артефакты и кэш:** скачивать/собирать зависимости, небольшие модели, runtime и fixtures только с зафиксированным URL/version/SHA-256/size/license/provenance; проверять распаковку и offline closure. В публичный репозиторий помещать только redistributable, size-bounded файлы; не раскрывать материалы в Pages output. Непубличные/тяжёлые артефакты — в проверяемый artifact/cache с инструкцией владельцу. **Самую большую основную модель не скачивать.** Не коммитить секреты, приватные данные и артефакты с неизвестными правами.
- **Параллельность:** параллелить независимые source reviews, read-only inspections и тестовые/eval-пакеты; сериализовать изменения одного файла и Git ref. Реальных Relay workers сейчас не обнаружено — не заявлять агентную параллельную работу без доступного target и readiness.
- **Закрытие:** SPECIFIED ≠ IMPLEMENTED ≠ VERIFIED ≠ AVAILABLE LIVE. Задание закрывается только после кода/артефакта, нужных failure/cancel/security tests и точной проверки. VPS, секреты, платежи, DNS/Tunnel, настоящий микрофон/устройство и production deployment — отдельные owner gates; не имитировать PASS.

## Очерёдность P0–P8
- **P0:** root landing, navigation, RU/EN, controls, forms/dialogs, responsive, keyboard/screen-reader/accessibility, lifecycle/security feedback.
- **P1:** общая оболочка aLandi / aNoteBooki / aCodingi; реальные Notebook/Studio и изолированные Coding Projects.
- **P2:** direct-chat baseline, контекст/память, policy routing моделей/специалистов и continuity.
- **P3:** Deep Research, Agents, Skills, connectors, durable runs, approvals, sandbox и отдельные bootstrap/training flows.
- **P4:** Source Vault, safe ingestion, converter graph, evidence lineage и resumable artifact jobs.
- **P5:** installable Offline Core, local/server parity, pinned artifacts, rollback и server-only acceptance.
- **P6:** voice/audio: ASR, VAD, TTS, capture, jobs и лицензии весов.
- **P7:** provider selection, data policy, privacy/retention, quotas, reliability — только после owner decision.
- **P8:** release/host/security/infrastructure gates; owner-only части остаются отдельными блокерами.

## Live state — проверено 2026-11-25 (main docs snapshot)

- **FACT — application-code baseline:** `191b2dac602273a2c3c4a2d80fbd722acadf6cd1`. Это SHA с последней полной Quality Sentinels проверкой; следующий commit `a5423012a4f499531e66607c1103078ae735192f` меняет только документацию и Jekyll title/description.
- **FACT — PR queue:** #195 (head `4a2718e305bf1f57dee38d867d07511d63ac1e9c`) и #187 (head `c951585d5a411a0099a229c074cb5d8ed1168fff`). Не merge/close/переносить вслепую; проверять diff, exact-head checks и переносить только узкие подтверждённые исправления.
- **FACT — issue queue:** #111 (owner/live-host/release gates) и #186 (постороннее упражнение GitHub Skills). Не закрывать для очистки списка.
- **FACT — exact-code Quality Sentinels:** run [45553470306](https://github.com/DorpNay/skills-github-pages/actions/runs/45553470306) на `191b2dac602273a2c3c4a2d80fbd722acadf6cd1` — Jekyll, Security, Integrity, Context и required root app boot/interaction smoke **PASS**; Real Chromium **FAIL: 45 tests failed, 213 passed, 1 flaky** (22.8m); Lightpanda, independent static analysis и Published Pages release contract — **SKIPPED**. Ошибки затрагивают provider/catalog, voice, AgentRun, mobile touch/menu, sidebar/projects/chats, storage rollback, keyboard/focus, locale и reduced-motion; причины требуют отдельного triage.
- **FACT — docs/Jekyll commit:** run [45593553349](https://github.com/DorpNay/skills-github-pages/actions/runs/45593553349) на `a5423012a4f499531e66607c1103078ae735192f` — Pages build, deploy и report-build-status **SUCCESS**. Этот docs-only commit не заменяет неуспешную полную Chromium проверку на application-code baseline.
- **FACT — Pages policy and metadata:** Jekyll title/description обновлены. GitHub repository About description всё ещё содержит starter boilerplate: “Exercise: Create a site or blog from your GitHub repositories with GitHub Pages”. Доступные GitHub actions не предоставляют редактирование repo description; owner action: вручную заменить на “An offline-first AI workspace project focused on private local/server execution and optional online tools.” До коммерческого SaaS использования повторно проверить GitHub Pages policy.
- **FACT — governance:** live branch API показывает `protected=false`, без required checks/review protection. Это остаётся owner/settings gate issue #111; настройки репозитория не менялись.
- **FACT — Pages workflow:** штатная автопубликация не редактировалась и была запущена обычным push; ручной deploy не выполнялся. Published browser/revision contract на code baseline был skipped.
- **OPEN:** full Chromium на application-code baseline не проходит; iOS Safari/VoiceOver/Windows forced-colors и real VPS/Ollama/server-only offline acceptance не проверены; Relay worker readiness не подтверждена.

## Ближайшее действие
Начать с разбора и исправления Chromium failures на последнем application-code baseline; добиться exact-head full-browser acceptance, затем выполнить bounded P0.35 mode/header/palette slice. После этого P1 Coding + P3 orchestration + P5 Offline Core. PR #195/#187 — read-only review и перенос только доказанных отдельных исправлений, без merge/close. Pages auto-publish workflow не менять.
