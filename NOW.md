# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-25 · **Репозиторий:** `DorpNay/skills-github-pages` · **Ветка:** `main`
**Последняя live-контрольная точка при записи:** `5b89051749b01be776868d75ecfea46371ac9ee1` (parent `dec5e1c3fbfa8df3d8b3ca164655defe0f8821c4`).

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
- **Цель:** довести все применимые срезы и задания P0–P8 до реальной реализации; начинать с Landing/P0, затем P1–P5 core, затем P6 voice/audio и P7 provider review, после — P8 release. Не заменять существующие P0.1–P0.34/P1–P8 новыми общими задачами.
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

## Live state — проверено 2026-11-25
- **main:** `5b89051749b01be776868d75ecfea46371ac9ee1`; последний commit добавил resumable checksum-verified model artifact downloads и symlink-path safety.
- **Открытые PR:** #195 (provider diagnostics + полный Chromium gate; head `4a2718e305bf1f57dee38d867d07511d63ac1e9c`, 15 commits ahead / 1 behind live main, Quality run failed); #187 (старый provider-diagnostics PR, base `484c3b9b4570e110f8bc4584bab322c80c37803c`, не mergeable на последней проверке). Ни один не считать готовым к merge.
- **Открытые issues:** #111 — release/owner environment gates; #186 — сторонняя GitHub Skills exercise, не продуктовая задача.
- **main Actions:** шесть опубликованных workflow runs на точном HEAD завершились success: Pages build/deploy, Graphify, Python Gateway/runtime caches and artifact provenance/acquisition. Это не подтверждает full Chromium, native device или live VPS/Tunnel.
- **Chromium:** full run PR #195 на его exact head завершился **201 passed / 58 failed (26.8 min)**. В числе failures — устаревший Notebook route selector, RU expectation для HTTP 401, locator collision, Research selector и другие runtime/timeouts. Не переносить PR целиком; синхронизировать тесты с актуальным UX и исправить подтверждённые регрессии.
- **Branch protection:** rulesets endpoint вернул пустой список, classic branch-protection endpoint — 403 для интеграции. Настроенные required checks/review на `main` не подтверждены.
- **Agent Relay:** live agents, launch targets и shared sessions не обнаружены. BrowserAct CLI в предыдущем срезе не установился из-за DNS; не повторять тот же install без изменения условий.
- **Не проверено:** текущая live Pages версия после HEAD, полная Chromium suite на main, iOS Safari/VoiceOver, Windows forced-colors, настоящая VPS/Tunnel/Ollama/model загрузка, реальный server-only network-denied сценарий.

## Ближайшее действие
Завершить P0 acceptance: разобрать точные Chromium failures на актуальном main, синхронизировать устаревшие E2E с shared-mode UI, исправить причинные runtime дефекты, а затем получить полный exact-main Chromium pass. Не менять Pages auto-publish workflow.
