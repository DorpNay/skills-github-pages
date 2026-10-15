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
