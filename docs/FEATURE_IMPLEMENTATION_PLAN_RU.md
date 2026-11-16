# aLandi — план реализации голоса, медиа и агентных функций

**Дата:** 2026-10-27  
**Статус:** план реализации на основе текущей архитектуры и существующих документов; функции, обозначенные как NEXT/PROTOTYPE, не считаются работающими.

## Подтверждённая исходная точка

- Клиент — статический Jekyll/GitHub Pages; gateway — FastAPI, проксирующий запросы к приватной Ollama.
- В текущем UI нет законченного захвата микрофона, ASR/TTS pipeline или специализированных media endpoints.
- В gateway уже есть voice policy/lease prototypes, tool schema/approval primitives, scoped memory/RAG/evidence foundations. Наличие интерфейса или контракта не означает подключённый runtime.
- Ограниченный VPS с 8 GB RAM — не место для одновременного запуска нескольких многогигабайтных моделей.
- Публичный клиент не должен содержать API secrets; медиа и произвольный URL нельзя отправлять в gateway без ограничения размера, типов, времени и SSRF-защиты.

Подробные источники: `docs/MULTIMODAL_MODEL_STACK_RU.md`, `docs/LATENCY_CONTRACT.md`, `docs/CODER_PACKET.md`, `docs/ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md`, `INTEL.md`, `EVALS.md`.

## Порядок реализации

### P1 — безопасные task skills (этот PR)

- `skills/grammar-review.txt`: коррекция грамматики и пунктуации без изменения смысла, языка, кода и цитат.
- `skills/diagram-design.txt`: генерация проверяемого Mermaid-исходника, с явным разделением фактических и запланированных компонентов.
- Использовать существующий on-demand skill loader. Эти skills не должны включаться в fast mode автоматически и не заменяют детерминированный lint/grammar checker или реальный diagram renderer.
- Критерий приёмки: оба файла проходят repository integrity checks; ответы сохраняют исходный смысл и не заявляют, что код диаграммы был отрендерен.

### P2 — аудио-сообщение → текст

1. Добавить отдельный endpoint загрузки аудио, не менять OpenAI-compatible chat endpoint до проверки контракта.
2. Проверять MIME allowlist, фактический формат, максимальную длительность/байты, rate limits, auth, timeout и удалять временные файлы через гарантированный cleanup.
3. Сделать ASR provider interface с тайм-аутом и моделью, выбранной из проверенного artifact manifest.
4. Первые кандидаты из текущего multimodal stack: Qwen3-ASR-0.6B для русского/тайского; сравнить с поддерживаемыми Moonshine checkpoints по языкам. Это кандидаты, не выбранные production модели.
5. В UI добавить явный импорт/запись, состояние загрузки, редактирование транскрипта до отправки и отмену. Не включать запись при загрузке страницы.
6. До merge: тесты MIME spoofing, oversized uploads, cancellation/cleanup, language matrix, WER/CER на размеченном RU/TH/EN наборе и RSS/real-time factor на целевом хосте.

### P3 — естественный голосовой диалог

1. Построить поверх P2: VAD/endpointing, потоковая ASR, TTS, очередь воспроизведения, barge-in/interrupt, cancellation и восстановление после ошибок.
2. Изолировать TTS engine и каждый voice artifact: лицензия движка не доказывает лицензию конкретного голоса/модели.
3. Не публиковать PCM/audio payloads в observability; сохранять только необходимые метаданные с коротким retention.
4. Выбирать provider/device capabilities явно: browser speech APIs как optional fallback, local backend и remote backend — отдельные адаптеры.
5. Acceptance: latency contract в `docs/LATENCY_CONTRACT.md`, p50/p95 на реальном устройстве, false endpoint/barge-in rate, RU/TH/EN quality, мобильный Safari/Chrome и ручная проверка разрешений микрофона. До этого не заявлять «разговор как с человеком» как готовую функцию.

### P4 — генерация и редактирование изображений

1. Разделить операции: понимание/OCR, генерация нового изображения и редактирование исходного изображения.
2. Реализовать отдельный media-job/provider interface; результаты — временные или явно сохраняемые файлы с owner/project scope, размерными лимитами и delete action.
3. Для облачного провайдера — только server-side secret, явное согласие на передачу изображения и понятное уведомление о провайдере/квотах. Для ComfyUI/local backend — opt-in endpoint с auth; никогда не открывать его напрямую в публичный интернет.
4. Каждый model/engine/voice artifact проходит license/provenance manifest и checksum gate.
5. Acceptance: tests for input validation, edit-vs-generate intent, quotas, cancellation, file cleanup, licensing and output provenance.

### P5 — повседневные инструменты и skills

- **Grammar review:** доступный task skill сейчас; детерминированная spell/grammar integration — отдельный opt-in адаптер после проверки offline support, языков и лицензии.
- **Diagrams:** task skill генерирует Mermaid source сейчас; визуальный preview — отдельный renderer, локально/безопасно и без remote fetch в SVG.
- **Research:** skill поиска первичных источников, дедупликации, citations и evidence ledger.
- **Coding:** review/test/browser QA skills поверх существующих typed tools; shell/browser automation только в sandbox и через approval.
- **MCP:** каталог discoverability не является allowlist. Каждый server требует provenance, schema review, least privilege, timeout, quotas, approval для side effects и kill switch.
- **Memory:** одна scoped memory с provenance/conflict handling; не подключать несколько конкурирующих stores только ради количества.
- **Self-improvement:** lessons are candidates; promotion requires golden regression, owner approval, versioning and rollback.

## Release gates

- Feature flags выключены по умолчанию до подтверждения deployment и owner configuration.
- Golden tests, unit/contract/E2E, security fixtures, dependency/license checks и rollback notes.
- Проверять точный PR HEAD и post-merge main SHA; успешная документация/Pages сборка не доказывает работу gateway, ASR/TTS или model runtime.
- Не provision-ить платные API, VPS, storage или модели автоматически.
- Обновлять `docs/PROJECT_STATE.yaml`, `EVALS.md` и `docs/VOLLEY_LOG.md` только по фактически подтверждённым результатам.
