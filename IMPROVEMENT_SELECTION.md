# Отбор улучшений AI Mobile Agent (2026-10-15)

## Что выбрано

Пять файлов в `temp/1`–`temp/5` объединяют идеи для Jekyll-блогов и личных портфолио с предложениями для AI Mobile Agent. Их нельзя внедрять целиком: часть рекомендаций относится к другой архитектуре, часть уже есть, а часть добавляет рискованную инфраструктуру.

### Уже есть в main
- Актуальные каталоги моделей с поиском и фильтрацией, 6-часовым кэшем и ограниченным fallback. Используются provider-specific endpoints, а не один общий URL для всех провайдеров.
- Отдельный workflow, который проверяет каждый настроенный GitHub Secret с несколькими ожидаемыми названиями (`GEMINI`, `GROQ`, `GROK`, `POLLINATIONS`, `OPENROUTER`, `NVIDIA`, `HUGGINGFACE`, `CLOUDFLARE` и варианты *_API_KEY). Ключи не выводятся в логи и недоступны из статического GitHub Pages. Pollinations browser App Key `pk_…` не подменяет серверный токен `sk_…`.
- Исследовательский pipeline, exact-match cache, ограниченный tool loop, выборка релевантной памяти, on-demand skills, восстановление локальной истории, экспорт/импорт профиля без ключей, журнал Markdown/JSON и deterministic Playwright/CI checks.

### Добавлено этим набором
1. **Бюджет истории, учитывающий размер контекстного окна модели.** Используется поле context window из свежего каталога, если поставщик его сообщает. Рассчитывается осторожный символьный предел с резервом под системный контекст и вывод; прежний предел 24 000 символов остаётся максимумом. Это не точный tokenizer. Если окно модели неизвестно, применяется прежний лимит.
2. **Evidence-first журнал.** Из фактических результатов инструмента собираются URL, заголовок, источник/инструмент и короткий фрагмент; одинаковые ссылки удаляются, максимум 40. Перед показом и экспортом URL повторно проверяется как публичный HTTPS. Текст вставляется через DOM text nodes, не как HTML. Старые traces без поля `sources` остаются открываемыми.
3. **Обратная совместимость диагностики.** Новое поле размера эффективного системного промпта исследовательского pipeline добавлено к уже существующему fingerprint настроенного промпта и метаданным маршрутизации.

Официальные API каталога: [Gemini](https://ai.google.dev/gemini-api/docs/openai), [Groq](https://console.groq.com/docs/models), [xAI](https://docs.x.ai/developers/rest-api-reference/inference/models), [Pollinations](https://github.com/pollinations/pollinations/blob/main/gen.pollinations.ai/src/docs/models.md), [OpenRouter](https://openrouter.ai/docs/api/api-reference/models/get-models), [Hugging Face](https://huggingface.co/docs/inference-providers/en/hub-api), [Cloudflare](https://developers.cloudflare.com/api/resources/ai/subresources/models/methods/list/), [NVIDIA NIM](https://docs.nvidia.com/nim/large-language-models/latest/api-reference.html).

## Что отложено и почему

- **Jekyll SEO, RSS, sitemap, блоговые коллекции, Astro migration:** не относятся к интерфейсу AI-агента и потребовали бы переписывания приложения.
- **IndexedDB/Dexie/SQLite migration:** текущая история имеет существующие версии ключей и механизм восстановления. Массовую миграцию данных нужно делать отдельным релизом с резервной копией, валидацией и rollback.
- **Семантический кэш:** похожие запросы могут отличаться контекстом, свежестью фактов и выбранной моделью; false cache hit опаснее дополнительного запроса. Exact-match cache уже есть.
- **PWA/offline queue:** фоновое повторение LLM-запросов может дублировать расходы и передавать пользовательский текст позднее без явного действия.
- **Потоковый Markdown, Shiki worker и WebLLM:** полезны, но требуют отдельных измерений производительности, контрактных тестов для разных API, корректного cancellation и защиты Markdown. WebLLM также добавляет большую загрузку для мобильных.
- **Публичные CORS-прокси:** не пересылаем URL/контекст через случайную третью сторону. Собственный proxy — отдельный infra/security проект.
- **Автоматическая маршрутизация по цене/сложности:** пока сохраняем явный выбор модели и opt-in межпровайдерный fallback; цены, квоты и право доступа зависят от аккаунта и не должны выдумываться.
- **Удалённая телеметрия и живые LLM prompt evaluations в CI:** у статической Pages нет собственного приёмника аналитики; живые проверки могут тратить квоту и быть недетерминированными. Сначала — локальные и mock-based regressions.

## Готовность к merge

Требуются Integrity/Security/Context sentinels, Jekyll build, Playwright в Chromium, smoke-test опубликованной Pages и успешный deploy. Реальные пользовательские ключи не читаются из коннектора и не вставляются в тесты; live-check запускается самим GitHub Actions с уже настроенными секретами.


## Дополнение к Superstack Lite (2026-10-19)

- Добавляется отдельный FastAPI gateway для частной Ollama: allowlist моделей, Bearer auth, ограничения тела/конкурентности, SSE forwarding и contract/security tests. Gateway ещё требуется развернуть на пользовательском VPS.
- Фиксированный предел истории 24 сообщения/24 000 символов заменяется оценкой контекста выбранной модели и резервами под системный промпт/ответ. При отсутствии metadata используется fallback 16K токенов. Это не бесконечный контекст: реальные пределы модели, RAM, HTTP-body cap и ограничение циклов tools остаются.
- Из Everything Claude Code приняты TDD, независимое code/security review, verification loop, осознанная compaction и curated learning. Claude-specific hooks/MCP не устанавливаются в сайт/runtime.
- Подробности: docs/SUPERSTACK_FINAL_RU.md; обзор архива: docs/ECC_ARCHIVE_REVIEW_RU.md.


## Дополнение: мультимодальные модели и извлечённые техники (2026-10-21)

Подробная проверка 9 OCR/document моделей и 10 ASR кандидатов, поддерживаемых языков, лицензий и resource gates: [docs/MULTIMODAL_MODEL_STACK_RU.md](docs/MULTIMODAL_MODEL_STACK_RU.md).

Зафиксированный список техник, решения «принять / отложить / не интегрировать» и последовательность проверок: [docs/TECHNIQUE_REGISTER_RU.md](docs/TECHNIQUE_REGISTER_RU.md).

### Принято и интегрировано в этой итерации
- On-demand specialist skill: OCR/ASR/audio/PDF requests получают инструкцию-маршрут только в «Глубоко» или «Умном исследовании»; обычный быстрый режим не загружает skills по умолчанию.
- Первичные ссылки, язык точного checkpoint, раздельные лицензии code/weights/runtime, peak RSS и golden-set обязательны до установки модели.
- RAG-Anything: только parser → structured blocks → provenance/page/bbox → retrieval → citations, не полный runtime.
- CLI-Anything: CLI allowlist, JSON, exit codes, dry-run и тестирование для будущих админских инструментов; никаких произвольных shell-команд из браузера.
- AI Engineering from Scratch: build/run/test/benchmark/compare; taste-skill: audit-first visual QA без автоматического редизайна.
- Pliny/L1B3RT4S: только контролируемые отрицательные prompt-injection fixtures, не jailbreak prompt в system prompt.

### Отложено или отклонено
- AirLLM: не runtime для текущего 8-GB CPU VPS.
- dsh-our-free-model: не отправлять prompts/documents/keys публичным сторонним gateways.
- Open-Generative-AI: отдельная будущая Image/Video задача, не подмена основного текстового runtime.
- GOT-OCR 2.0, HunyuanOCR-1.5, DeepSeek-OCR2, dots.mocr и LightOnOCR-3-4B: не ставить до benchmark, выбора конкретной задачи и инфраструктуры.
- На этом этапе не установлены OCR/ASR weights и не добавлены upload/mic/TTS/media endpoints. Модель считается интегрированной только после callable route, UI, tests, benchmark, license/privacy checks and rollback.
