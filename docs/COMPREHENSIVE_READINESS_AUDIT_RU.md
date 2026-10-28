# aLandi — комплексный аудит готовности и незакрытых работ

**Срез:** 2026-10-28. Это проверка центральных реестров и активных PR, а не заявление об исчерпывающем аудите каждой строки репозитория.

## Итог

- На проверенных точных SHA зелёные CI-гейты у PR #78 (сверка документации), #80 (RAG golden-set evaluator), #81 (deployment preflight). Gateway, Quality/Chromium, provenance, Pages smoke и Graphify завершились успешно. Перед интеграцией нужно ещё раз проверить текущий head и post-merge CI.
- На момент среза main остаётся на SHA 337e38690af8f22a712c6442192c5ea62d354c3d; все три PR открыты. Этот аудит не объединяет их автоматически.
- CI не доказывает готовность production: частный VPS, реальные модели/голоса, физические устройства и live-провайдеры не проверены.
- Новые веса моделей сейчас не добавлять в Git. Пока нет модели, одновременно подтверждённой для целевых языков, лицензии, runtime и целевого железа. Скачивание должно быть ручным, вне репозитория, с checksum/provenance.

## Приоритетные незакрытые работы

| Приоритет | Область | Подтверждено | Что осталось |
|---|---|---|---|
| P0 | Интеграция | #78, #80, #81 прошли проверенные exact-head checks | Интегрировать в согласованном порядке; после каждого merge проверить новый main SHA, post-merge CI и Pages deployment. |
| P0 | Gateway / VPS | PR #81 проверяет repository templates: loopback, systemd hardening, placeholder key, HTTPS CORS allowlist, bounded limits, experimental flags off | Применить runbook на реальном VPS; проверить firewall/Tunnel, health/auth, restart/reboot, журналы и rollback. Preflight не подключается к live host. |
| P0 | ASR/TTS | Адаптеры и выбор только allowlisted Piper voices есть; feature flags выключены | Выбрать точные артефакты; проверить отдельные лицензии runtime/весов/голоса/phonemizer, SHA-256, совместимость; затем измерить RU/EN/Thai quality, cold/warm latency, RTF и PSS/RAM на целевом устройстве. |
| P1 | RAG | FTS5/BM25 + concept graph + RRF, scope filters, provenance и scoped deletion; PR #80 добавляет evaluator | Собрать минимум 50 разрешённых, обезличенных, вручную размеченных запросов. Сравнить baseline и candidate на одном корпусе: Recall@5, MRR, nDCG@5, source/citation correctness, latency и scope leakage. Синтетический smoke не доказывает улучшение. |
| P1 | End-to-end | Chromium mocks, gateway contract/security tests и Pages smoke зелёные | Live gateway/provider smoke с явным согласием владельца; документы, timeout/retry/cancel, draft recovery, attachments, memory и cross-project isolation в совокупности. Не помещать секреты в отчёты. |
| P1 | Mobile / accessibility | Основные web сценарии покрыты Chromium | Реальные iOS Safari и Android Chrome: клавиатура/viewport, long-press/cancel, file handoff, microphone permissions, screen reader, focus order и reduced motion. Desktop E2E не заменяет устройство. |
| P1 | Документы / мультимодальность | Локальное извлечение поддерживаемых PDF/DOCX/XLSX/TXT/MD/CSV/JSON за feature flag | Проверить реальные разрешённые файлы и лимиты. Scanned PDF без OCR остаётся ограничением. Не обещать поддержку формата только потому, что его можно выбрать в file picker. |
| P1 | Memory / sync | Scoped memory graph и ручной opt-in bridge описаны и покрыты частью тестов | Live gateway activation не подтверждена. Следующий bounded этап: delta-sync conflict/recovery, duplicate upload, revision conflict, rollback, delete propagation, clear-history и cross-project denial. Не заводить второй независимый memory lifecycle. |
| P2 | Native voice / V-016 | Есть prototype interfaces и browser half-duplex flow | Native audio hot path, VAD/AEC, barge-in/self-echo, cancellation, resource soak и false-interruption corpus остаются acceptance gates. Не объявлять hands-free dialogue готовым. |
| P2 | Tools / agents | В планах есть budgets, approvals и verification | CLI sandbox заблокирован до настоящей изоляции и escape-тестов. MCP/agent roles не заменяют sandbox/approval. Начать с read-only adapters и deterministic baseline. |
| P2 | Perf / dependencies | Есть latency contract и serialization benchmark source | Сам benchmark, semantic parity, median/p95, memory и license ещё требуют проверки; uv.lock/locked reproducibility остаются pending. Не скачивать модели и не запускать тяжёлые live benchmarks автоматически в CI. |
| P2 | Реестры | Есть PROJECT_STATE, VOLLEY_LOG, EVALS, roadmaps и audit-документы | После интеграции #78/#80/#81 сверить stale statuses. Пример: наличие serialization benchmark файла не означает, что его измерения выполнены; различать «код существует» и «результат измерен». |

## Модели: что сейчас не скачивать

- **ASR4ALL-S (~28.1M параметров):** в исследовании указан как английский кандидат с FUTO ethical-use license; не подходит как универсальная RU/TH модель.
- **Moonshine Tiny (~34M):** лёгкий streaming кандидат для поддерживаемых языков, но текущие документы не подтверждают конкретный RU/TH checkpoint или подходящий TTS voice. Лицензии ASR, TTS и grapheme-to-phoneme assets проверяются отдельно.
- **Qwen3-ASR-0.6B:** исследовательский кандидат для RU/TH, не установленный и не измеренный runtime. Не ставить до оценки памяти/latency на целевом хосте.
- **Piper:** текущий TTS adapter; нужен конкретный voice pack с проверенными лицензией и hash. Наличие движка не означает наличие голосовой модели.
- Не загружать Nemotron/NIM, OCR/VLM или дополнительные модели ради «полноты стека». Выбирать по реальному сценарию, языку, лицензии, hardware, privacy, latency и стоимости.

## Безопасная инструкция по загрузке модели

1. Выбрать один сценарий и одну модель; зафиксировать официальный upstream, точный model/voice ID, версию, язык, лицензию весов и runtime, размер файлов и целевое устройство.
2. Загружать **вне Git** в закрытый каталог, например /var/lib/alandi-models/family, с правами владельца сервиса. Не добавлять .onnx, .gguf, checkpoints, API keys или пользовательские аудиофайлы в репозиторий.
3. Проверить SHA-256 по доверенному upstream release/manifest. Если upstream не публикует checksum, получить файл только из официального источника, записать собственный SHA-256 и отметить: он подтверждает неизменность после получения, но не подлинность upstream.
4. Для Piper хранить согласованную пару .onnx + .onnx.json; отдельно проверить лицензию каждой модели и phonemizer. Не разрешать произвольные пути из UI.
5. Настроить абсолютные пути на private gateway. Feature flags оставить false до завершения проверки. Не скачивать модели по пользовательскому запросу и не делать pull при старте сервиса.
6. Пройти unit/contract/E2E, затем live test на тестовом материале с согласием; измерить cold/warm latency, RTF, peak PSS/RAM, качество языка, остановку и rollback. Не логировать аудио, транскрипты и секреты.
7. Записать commit SHA, OS/CPU/RAM, runtime/model versions, upstream, license, SHA-256, flags, команды и метрики в отчёт reports/voice/<date>-<git-sha>.json плюс Markdown. Статус пометить VALID или UNVERIFIED. До этого модель не считать готовой к поставке.

## Источники истины для продолжения

- docs/PROJECT_STATE.yaml — технический state и следующий шаг по трекам.
- docs/VOLLEY_LOG.md — инженерная история и evidence.
- EVALS.md — критерии качества и release gates.
- docs/IMPLEMENTATION_ROADMAP_RU.md и docs/FEATURE_IMPLEMENTATION_PLAN_RU.md — приоритеты.
- docs/VOICE_IMPLEMENTATION_PLAN_RU.md, docs/MULTIMODAL_MODEL_STACK_RU.md и docs/LATENCY_CONTRACT.md — модели и измерения.
- docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md, docs/ENGINEERING_PACKAGE_AUDIT_RU.md, docs/V016_IMPLEMENTATION_CHECKLIST.md — live acceptance и ограничения.
- project-reference/FILE_ORIENTER_RU.md и ORIENTER.md — восстановление контекста после перерыва.

## Следующие действия

1. Проверить актуальные head и интегрировать зелёные #78, #80, #81 в согласованном порядке; после каждого проверить новый main SHA и post-merge workflows.
2. Сверить EVALS/PROJECT_STATE/roadmaps после интеграции.
3. Запустить RAG evaluator на первом реальном permissioned golden set; не подменять его synthetic fixture.
4. Выполнить deployment preflight на VPS и затем live gateway/device acceptance.
5. Только после выбора сценария вручную установить один model/voice artifact; не добавлять веса в Git.


## Сверка с исходными принципами aLandi

В мастер-контексте перечислены **7 основных принципов**; V-016 — отдельный 81-пунктный ledger требований по разделам 0–40. Не подменяем один список другим и не ставим галочку по факту существования файла.

| Принцип мастер-контекста | Что подтверждается исходниками | Что ещё не доказано / следующий gate |
|---|---|---|
| 1. Работающий вертикальный сценарий важнее swarm | Клиент → authenticated gateway → allowlisted model; роли описаны как логические профили, а не отдельные процессы | Сквозной live-сценарий на реальном gateway/provider не подтверждён; проверить timeout/cancel/retry, attachment, history recovery и ошибки совместно |
| 2. Малые модели получают короткие наблюдения и типизированные действия | Ограниченные схемы tool DAG/validator и bounded helper-memory suggestions существуют | Production executor намеренно не включён; CLI/browser sandbox остаётся BLOCKED до реальной изоляции и escape-тестов |
| 3. Минимальный diff, YAGNI, стек не переписывается без измеримой пользы | Статический GitHub Pages клиент + небольшой FastAPI gateway + Ollama + SQLite; Redis/vector DB/второй orchestrator не обязательны | Не мигрировать на uv/orjson/vector DB без воспроизводимого benchmark, semantic parity и проверки лицензий |
| 4. Provenance обязателен, источники и tool outputs — недоверенные данные | Есть provenance manifest, source hashes/offset validation, scoped RAG deletion и evaluator | Parser-offset parity и citation correctness на реальных документах нужно отдельно измерить; synthetic fixture не считается продуктовым evidence |
| 5. Самообучение только после golden eval, approval и rollback | Автоматическое самообучение не включено; evaluator #80 задаёт метрики и требования к labelled set | Нужны ≥50 permissioned/de-identified human-labelled queries, baseline/candidate сравнение, approval и rollback; две synthetic queries недостаточны |
| 6. RAM, latency, cost, privacy и licenses — ограничения первого класса | Один активный model / concurrency 1 как безопасный профиль; model/voice hashes и отдельные лицензии обязательны | Нет подтверждённого полного target-host benchmark; не заявлять RTF/p95/RAM или RU/EN/TH качество без отчёта на целевом железе |
| 7. Не сохранять секреты или скрытые рассуждения | Gateway описан как не сохраняющий prompt contents; trace schema ограничивает атрибуты; helper suggestions требуют ручного сохранения | Перепроверить логи/ошибки/экспорты и клиентские backup paths в live-сценарии; не прикладывать реальные ключи, аудио или транскрипты к issue/artifact |

### Дополнительные дефекты, найденные при свежем статическом просмотре

- **PR #83 — SQLite in-memory delta store:** подтверждён дефект жизненного цикла :memory: — короткоживущие соединения не видели схему друг друга. Добавлен per-instance shared-memory URI, keeper connection и два регрессионных теста на persistence/isolation. Это dev/test correctness fix; persistent-file production path не меняется.
- **PR #84 — CORS origin canonicalization:** прежняя проверка принимала hostname в смешанном регистре и malformed/out-of-range port без нормализации; это могло привести к silently broken CORS или ошибочной конфигурации. Добавлена нормализация hostname/default ports/IPv6 и тесты негативных портов. Allowlist не расширен.
- Для обоих PR требуется дождаться всех обязательных checks на **текущем exact head**. До этого это proposed fixes, не merged/main functionality.
- Из-за недоступности DNS в рабочем контейнере git clone и локальный запуск pytest не удались; это ограничение окружения, а не успешный тест. CI — единственный доступный execution evidence в этой сессии.
