# aLandi — комплексный аудит готовности и незакрытых работ

**Срез:** 2026-10-28. Это проверка центральных реестров и активных PR, а не заявление об исчерпывающем аудите каждой строки репозитория.

## Итог

- На проверенных точных SHA зелёные CI-гейты у PR #78 (сверка документации), #80 (RAG golden-set evaluator), #81 (deployment preflight). Gateway, Quality/Chromium, provenance, Pages smoke и Graphify завершились успешно. Перед интеграцией нужно ещё раз проверить текущий head и post-merge CI.
- На момент проверки main остаётся на SHA 337e38690af8f22a712c6442192c5ea62d354c3d; #78/#80/#81 открыты. В ходе свежего аудита дополнительно открыты #82 (audit/stack), #83 (memory fix) и #84 (URL/CORS config). Этот аудит не объединяет PR автоматически.
- CI не доказывает готовность production: частный VPS, реальные модели/голоса, физические устройства и live-провайдеры не проверены.
- Новые веса моделей сейчас не добавлять в Git. Пока нет модели, одновременно подтверждённой для целевых языков, лицензии, runtime и целевого железа. Скачивание должно быть ручным, вне репозитория, с checksum/provenance.

## Зафиксированная reference-сборка (решение на текущем этапе)

Это выбранная целевая сборка для первого надёжного релиза. Она сохраняет существующие контракты и не превращает экспериментальные кандидаты в обязательные зависимости.

| Слой | Выбранная основа | Зафиксированное правило |
|---|---|---|
| Клиент | Текущий статический Jekyll/HTML/JS на GitHub Pages | Не мигрировать на новый frontend framework без измеримого выигрыша; сохранять доступность и существующие E2E-контракты. |
| API gateway | Текущий FastAPI + Pydantic + HTTPX | Единственная точка доступа к модели и локальным инструментам; API key обязателен, CORS — точный allowlist, внешние порты модели не публиковать. |
| Деплой | Ubuntu 24.04 LTS, x86_64, целевой профиль 4 vCPU / 8 GB RAM; systemd + Cloudflare Tunnel | Это целевой профиль, не подтверждённый купленный/настроенный сервер. Gateway и Ollama слушают loopback; входящий доступ — через HTTPS Tunnel. |
| Основная LLM | Одна модель Ollama `qwen3.5:4b`, контекст 4096, concurrency 1 | Не держать несколько LLM одновременно в памяти. Реальный p95, RSS и качество должны быть измерены на целевом хосте. |
| Retrieval | SQLite FTS5/BM25 + lexical concept graph + RRF + source provenance | Сохранить как детерминированный baseline. Не добавлять векторную БД и не заявлять рост релевантности без golden set. |
| Embeddings — challenger, не runtime | [IBM Granite Embedding 97M Multilingual R2](https://huggingface.co/ibm-granite/granite-embedding-97m-multilingual-r2) | Компактный кандидат: 97M параметров, 384 измерения; upstream явно включает русский и тайский в список усиленной языковой поддержки. Сначала сравнить на одном корпусе с FTS5/RRF; скачивать только если тест показывает измеримый выигрыш. |
| ASR | Существующий адаптер `whisper.cpp`; первый benchmark-кандидат — multilingual `small` | Не менять API-контракт. Сравнить RU/EN/TH на разрешённом тестовом наборе, включая WER/CER, cold/warm p95, RTF и память. Не запускать одновременно с основной LLM при дефиците RAM. |
| ASR challenger | [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx), модель под конкретный язык | Исследовательская альтернатива для локальных RU/TH-моделей. Не подключать сторонний HTTP-сервер автоматически и не разрешать авто-загрузку весов при старте. |
| TTS | Существующий Piper adapter и серверный voice allowlist | Голос доступен только если установлен точный voice pair и он включён в allowlist. При отсутствии подходящего голоса — текстовый fallback, не скрытый cloud fallback. |
| Документы | Текущий локальный extraction pipeline и `pypdf` для PDF text layer | Сначала извлекать существующий текстовый слой; сканированные PDF явно отмечать как неподдержанные, пока OCR не включён и не проверен. |
| OCR — отдельный opt-in | [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) с `eng`, `rus`, `tha` language data | Добавлять только после теста реальных разрешённых сканов. Сохранять page/block provenance; не отправлять документы во внешний сервис. |
| Memory | SQLite: conversation delta sync отдельно от scoped memory graph | Не объединять их схемы. Revision conflict → явная ошибка/восстановление; удаление и очистка истории должны распространяться на все копии до включения sync. |
| Agent tools | Текущий bounded DAG, schema validation, approval primitives | Первый production набор — read-only и детерминированные действия. Shell/CLI остаётся заблокированным до проверенной изоляции и escape tests. |
| Observability | Проверенный trace ID + безопасные структурированные события; OTel exporter выключен | Не писать секреты, аудио, транскрипты или полные пользовательские документы в логи. |
| CI/reproducibility | Gateway tests, Quality/Chromium, Pages smoke, provenance, Graphify artifact-only | Все результаты привязывать к точному SHA. Graphify остаётся dev-only; не добавлять его в runtime. |

### Почему сейчас не включаем дополнительные сервисы

- Не добавляем вторую memory-платформу (Mem0/Graphiti/OpenViking/Syncthing) до сравнительных тестов export/restore, scope isolation, conflict recovery и deletion propagation.
- Не добавляем отдельный поисковый сервер, векторную БД, OCR/VLM или агентный runtime только ради полноты списка. Для каждого нужен конкретный провал baseline и воспроизводимый тест.
- Не встраиваем [phonex](https://github.com/ekhodzitsky/phonex) в production: это полезный исследовательский wrapper над Sherpa-ONNX, но его первый запуск может автоматически скачивать модели, что не подходит текущему правилу контролируемой установки. Изучаем underlying runtime/модели отдельно.
- Не кладём веса и бинарники в Git и не загружаем их при запуске сервиса. Для каждого реально выбранного артефакта фиксируются upstream, версия, SHA-256 и отдельная запись в `infra/license/provenance_manifest.yaml`.

### P0: управление веткой

GitHub API на текущем срезе показывает, что `main` не защищён и required status checks не заданы. Это отдельный риск даже при зелёном CI. До регулярных релизов владелец репозитория должен включить protection/ruleset для `main`: запрет прямого push, обязательные проверки точного PR head, запрет force-push и удаления ветки. Это изменение настроек репозитория, а не кодовый PR; текущая интеграция не должна считаться защищённой, пока настройка не подтверждена.

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

1. Проверить актуальные head и интегрировать #78, #80, #81 в согласованном порядке только после актуальных обязательных checks; затем отдельно проверить #83/#84 на exact-head CI. После каждого merge проверить новый main SHA и post-merge workflows.
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
- **PR #84 — URL configuration normalization:** прежняя CORS-проверка принимала hostname в смешанном регистре и malformed/out-of-range port без нормализации; OAuth success-redirect сравнивался с allowlist в ненормализованном виде; Ollama URL не проверял port при startup. Добавлены canonical CORS origins (hostname/default ports/IPv6), нормализация OAuth origin, общая fixed-URL validation для Ollama и regression tests. Allowlist не расширен.
- PR #83 exact head `9aad4c0525d48e9ea1b6060d512ef433d55ef431`: Gateway `40658662933`, Quality `40658662903`, Graphify `40658662879` и dead-code `40658662842` — все success.
- PR #84 exact head `426743b3e6a8771d9dd5910076b4d3ea5621f957`: Gateway `40659456831`, Quality `40659456803`, Graphify `40659456777` и dead-code `40659456793` — все success.
- Оба PR всё ещё открыты и не изменили main. PR #82 — текущая документационная ветка; её последняя ревизия требует отдельной проверки перед merge.
- Из-за недоступности DNS в рабочем контейнере git clone и локальный запуск pytest не удались; это ограничение окружения, а не успешный тест. CI — единственный доступный execution evidence в этой сессии.


## Рекомендуемая сборка по текущим доказательствам

Это не максимальное число компонентов, а минимальная согласованная сборка с возможностью расширения только после измерений.

| Слой | Конкретный выбор сейчас | Почему / условие расширения |
|---|---|---|
| Клиент | Существующий статический GitHub Pages/Jekyll + HTML/CSS/JS; сохранить совместимость skills/*.txt | Мобильный интерфейс уже существует; React-переписывание не даёт доказанной пользы и повышает регрессионный риск |
| API gateway | FastAPI + httpx; bearer auth, model allowlist, body/time limits, bounded concurrency, explicit CORS, loopback-only | Одна точка контроля доступа и лимитов; не выставлять Ollama наружу |
| Публикация API | Cloudflare Tunnel + Access/rate limits; gateway 127.0.0.1:8000, Ollama 127.0.0.1:11434 | Конкретный Tunnel/Access остаётся owner-configured и должен быть проверен live; не считать шаблон preflight доказательством реальной сети |
| Инференс | Ollama, один активный model, concurrency=1, context=4096 как стартовый режим; qwen3.5:4b — кандидат baseline, не подтверждённая оптимальная модель | Утвердить окончательно только после cold/warm latency, peak RAM/PSS, quality и rollback на целевом VPS |
| Основные данные | SQLite для response cache, delta sync, scoped memory и FTS5; раздельные схемы/scopes, provenance и revision checks | Не добавлять Postgres/Redis/vector DB, пока объём/конкурентность/benchmark не покажут ограничение SQLite |
| Retrieval/RAG | FTS5/BM25 + lexical concept graph + RRF, точный scope и source provenance | Удерживать как baseline; менять ранжирование только после ≥50 реальных разрешённых и обезличенных запросов и метрик retrieval/citation |
| Документы | Локальное извлечение поддерживаемых PDF/DOCX/XLSX и текстовых форматов за feature flag | Сканированный PDF без OCR остаётся неподдержанным; Docling/OCR добавить только для конкретной потребности и после тестов лицензии/ресурсов |
| Голос | Существующие локальные whisper.cpp ASR/Piper TTS adapters; только allowlisted paths/voices; flags off | Не заявлять hands-free: native audio hot path, VAD/AEC, echo cancellation и target-device tests не подтверждены |
| Инструменты | JSON Schema validator + read-only bounded DAG; явные approval contracts | Никакого произвольного shell/browser execution до отдельного sandbox, изоляции профиля и adversarial escape tests |
| Наблюдаемость | Trace ID + ограниченная schema событий; локальные безопасные логи без prompts/transcripts/secrets | OpenTelemetry остаётся optional/disabled до решения о privacy и exporter; не отправлять пользовательские данные внешнему collector |
| Проверки | pytest gateway suite + Playwright/Chromium + quality sentinels + provenance + Graphify artifact-only | Утверждать изменение только по exact-head checks; затем post-merge main/Pages. Живой VPS и физические устройства — отдельные gates |
| Зависимости | Текущие pinned requirements; uv migration только после генерации/ревью lockfile | Не вводить uv.lock как фиктивный; не добавлять orjson без semantic-parity/performance/license report |
| Модели/веса | Не хранить бинарные веса в Git; ручная установка вне репозитория, фиксированный upstream/version/license/SHA-256 | Ни один ASR/TTS artifact не готов к поставке без отдельной лицензии engine/weights/voice/phonemizer и target benchmark |

### Документальная ловушка: старый «окончательный» stack guide

Документ docs/SUPERSTACK_FINAL_RU.md датирован 2026-10-19 и содержит команды установки и модельный baseline, которые нельзя трактовать как актуальное подтверждение состояния. Его статус обновлён до исторического архитектурного baseline; текущий owner path — docs/START_HERE_RU.md и docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md. Перед выполнением команд нужно проверить актуальный main, upstream installer, systemd template, model tag и лицензии. В частности, не запускать удалённый shell installer вслепую и не скрывать ошибки создания пользователя через `|| true`.


## Интеграционный риск, найденный при сравнении PR

- PR #78 и #80 **пересекаются по пяти общим файлам**: EVALS.md, docs/IMPLEMENTATION_ROADMAP_RU.md, docs/PROJECT_STATE.yaml, docs/VOLLEY_LOG.md и project-reference/FILE_ORIENTER_RU.md. Безопасный порядок: сначала #78, затем перенести/ребейзнуть содержательные изменения #80 на обновлённый main и проверить golden-evaluator changes заново. Не перезаписывать shared ledgers целиком из старой ветки.
- #81 изолирован в workflow/preflight/runbook; #83 — в delta sync/test; #84 — в gateway config/tests. Эти PR можно рассматривать отдельно после точных проверок, но их базовый SHA всё равно должен быть актуален к моменту merge.
- Обнаружено расхождение состояния: main/base SHA, возвращённый GitHub для открытых PR, — `337e38690af8f22a712c6442192c5ea62d354c3d`, тогда как текст текущего `docs/PROJECT_STATE.yaml` заявляет `4fc342b...` как main. Это именно stale status в документации, не основание угадывать SHA; PR #78 предназначен для такой сверки.
- Перед merge каждого PR проверять: актуальный head SHA, обязательные checks, changed-file overlap и mergeability; после merge — новый main SHA, post-merge Quality/Pages/provenance. Ни один старый зелёный run не заменяет эти проверки.
