# aLandi — извлечение лучших open-source решений для поиска и исследовательского режима

**Дата проверки:** 2026-10-27  
**Назначение:** превратить пользовательские списки и существующие аудиты в конкретные решения для Search & Research aLandi. Это исследовательский документ, не заявление об уже подключённых сервисах.

## Вывод

Не строить один «магический поиск» и не встраивать вторую платформу целиком. Нужен единый Search & Research слой с несколькими явно управляемыми режимами, общим журналом доказательств и отдельным рабочим пространством:

- **Быстрый поиск** — короткий запрос, несколько релевантных результатов, сниппеты и прямые ссылки.
- **Глубокое исследование** — план поиска, несколько независимых запросов и источников, проверка расхождений, синтез и ссылки на подтверждающие фрагменты.
- **Поиск по моим материалам** — документы, ссылки, заметки и файлы выбранной коллекции/проекта; не смешивать их незаметно с публичным вебом.
- **Вопрос к источникам** — ответ по выбранным документам с точными цитатами/страницами; явно сказать, когда ответа в материалах нет.
- **Извлечение и преобразование** — одинаковый шаблон для пачки источников: сравнить, извлечь даты/сущности/утверждения, сделать конспект, FAQ или таблицу.
- **Мультимодальный поиск** — текст, изображения, таблицы, формулы, диаграммы, аудио/видео и provenance, только если выбранный parser/model действительно поддерживает формат.
- **История доказательств** — сохранять запросы, источники, извлечённые фрагменты и итоговый отчёт в выбранном project scope; raw media и секреты по умолчанию не сохранять.

Всё это доступно из обычного чата, но у Search/Research есть отдельная панель со списком источников, коллекциями, прогрессом, фильтрами, цитатами и сохранёнными результатами. Один и тот же поиск не должен запускаться дважды из-за наличия двух интерфейсов.

## Лучшие идеи, подтверждённые первичными источниками

### 1. Open Notebook — взять модель исследовательского рабочего пространства

Upstream: https://github.com/lfnovo/open-notebook  
Документация: https://www.open-notebook.ai/features

README и документация описывают несколько notebook-коллекций, поддержку PDF/видео/аудио/веб-страниц/Office, full-text и vector search, chat по материалам с цитатами, заметки, преобразования и генерацию подкастов. Руководство различает поиск конкретной цитаты (текстовый поиск), поиск идеи без точных слов (семантический поиск), комплексный ответ (Ask/Search) и пакетное извлечение одинаковой информации из многих источников (Transformations). Источник может быть включён в контекст полностью, как summary или исключён; transformations сохраняются как searchable insights.

**Заимствовать в aLandi:**
- коллекции/рабочие наборы источников по проектам и темам;
- явный контроль контекста: полный материал / summary / исключить;
- «спросить этот источник» и «спросить выбранную коллекцию»;
- сохраняемые transformations с параметрами и версией prompt;
- поиск по точной фразе отдельно от семантического;
- результаты и заметки, которые можно повторно открыть и процитировать;
- необязательный экспорт исследования в аудио/подкаст позднее, поверх отдельного TTS pipeline.

**Не копировать целиком:** отдельный web app, его backend/database/provider configuration и deployment. Встроить UX-паттерны в текущий UI и использовать существующий gateway и project scope. Проверить лицензии и актуальную архитектуру перед переносом кода.

### 2. SearXNG — приватный метапоиск, а не «ещё одна LLM»

Upstream: https://github.com/searxng/searxng

**Заимствовать:** адаптер метапоиска, объединяющий разрешённые поисковые системы; категории/типы результатов; таймауты, фильтрацию и контроль доступных поисковиков. Разворачивать отдельно и только если есть подходящий хост и конфигурация.

**Обязательные границы:** результат SearXNG — недоверенная внешняя информация, а не факт; сохранять исходный URL/домен/дату и короткий фрагмент; ограничивать размер результатов и время; удалять дубликаты; не передавать приватные документы в поисковый запрос без явного действия пользователя. Реальный набор upstream engines и конфигурацию инстанса нужно проверять, не полагаться на слово «приватный».

### 3. RAG-Anything — правильная модель разбора сложных материалов

Upstream: https://github.com/HKUDS/RAG-Anything

Документация описывает многоэтапный pipeline: парсер → структурные блоки → отдельная обработка изображений/таблиц/формул → retrieval и мультимодальный ответ. Поддерживаются PDF, Office, изображения, TXT/Markdown и HTML через конкретный parser; варианты parser имеют разные ограничения и зависимости. В Markdown локальные изображения могут быть обработаны vision model — ingestion такого документа способен инициировать чтение файлов, на которые он ссылается.

**Заимствовать архитектуру, не полный тяжёлый стек:**
- сохранять структуру документа и границы блоков, а не сводить всё в один длинный текст;
- сохранять provenance: документ, страница, bbox/таблица/рисунок, заголовок и тип блока;
- отдельный retrieval по тексту, таблицам, изображениям и формулам с последующим объединением;
- указывать точный источник ответа и позволять открыть соответствующий фрагмент;
- parser selection как явный контракт, а не обещание «понимает любой файл».

**Безопасность:** запрет произвольного remote fetch при разборе HTML; проверка ссылок на локальные изображения; лимиты размера/страниц/времени; изоляция parser; не считать инструкции в документе командами агенту. Полную зависимость RAG-Anything/MinerU/LibreOffice не добавлять в 8-GB runtime до измерения RAM и качества на наших документах.

### 4. Agent-Reach, Scrapy, yt-dlp — отдельные source adapters

- Agent-Reach: https://github.com/Panniantong/Agent-Reach
- Scrapy: https://github.com/scrapy/scrapy
- yt-dlp: https://github.com/yt-dlp/yt-dlp

Потенциальная ценность — не установка единого «скрейпера всего», а адаптеры для конкретных источников: публичная веб-страница, разрешённый сайт, пользовательское видео/аудио. Каждый адаптер должен иметь собственную схему входа/выхода, лимит, provenance, таймаут и понятную ошибку.

Не запускать общий installer ради всех интеграций; не использовать пользовательские cookies без отдельного согласия; не обходить paywall/авторизацию/ограничения; не загружать произвольные URL с gateway. Для URL fetch обязателен SSRF-защитный слой: допустимые схемы, блокировка loopback/private/link-local/metadata IP, повторная проверка после DNS/redirect, лимит redirects/bytes/time, запрет передачи произвольного URL другим внутренним сервисам. Соблюдать robots/terms/права на медиа и не индексировать приватное содержимое незаметно.

### 5. Agent Skills и scientific skills — расширять поиск без раздувания runtime

Спецификация: https://agentskills.io/specification

Заимствовать progressive disclosure: метаданные навыка → инструкция по запросу → ресурсы/скрипты только при необходимости. Нужны узкие навыки: формулировка поискового вопроса, поиск первоисточников, дедупликация, проверка дат, противоречивые свидетельства, evidence ledger и воспроизводимые вычисления. Навык задаёт процедуру, но не должен изображать отсутствующий tool или автоматически повышать доверие к источнику.

### 6. taste-skill / Impeccable / Design Extract — поиск визуальных референсов

- https://github.com/Leonxlnx/taste-skill
- https://github.com/pbakaus/impeccable
- Design Extract из пользовательского списка: точный upstream и лицензию подтвердить до внедрения.

README taste-skill описывает инвентаризацию уникального содержания/ограничений, выбор направления из исследованных вариантов, реальные изображения с атрибуцией, просмотр результата в браузере на нескольких ширинах и исправление ограниченного числа наиболее важных дефектов. Для визуального поиска это означает не только находить картинки, но и сохранять референсы, объяснять их роль (композиция/цвет/материал/типографика), атрибуцию и связь с задачей.

**Заимствовать:** сохранённая moodboard-коллекция; фильтры лицензии/источника; раздельные референсы содержания и стиля; объяснение «что именно берём из этого примера»; audit-first, не автоматический редизайн. Не копировать чужие изображения/ассеты без прав и не делать вывод, что стиль референса автоматически переносим на любую модель.

### 7. ComfyUI — workflow для генерации, а не поисковый движок

Upstream: https://github.com/Comfy-Org/ComfyUI  
Workflow gallery: https://comfy.org/workflows/

Upstream описывает переиспользуемые workflow/subgraphs, App Mode, локальный API, очередь, частичный повторный запуск графа и управление RAM/VRAM/offload. Официальная галерея содержит workflow для style reference и image editing. Это образец того, как сложную задачу превратить в повторяемый workflow с параметрами и результатами.

**Заимствовать:** типизированные media jobs, шаблоны задач (генерация, редактирование, стиль по референсу), очередь/отмена/повтор, сохраняемые параметры, входные и выходные файлы с provenance. ComfyUI не открывать напрямую в публичный интернет; адаптер — за auth gateway. Передавать изображения удалённому провайдеру только с явным согласием. Поддержка модели в ComfyUI не доказывает, что модель поместится на нашем хосте или имеет подходящую лицензию.

### 8. Поиск по вебу и поиск по материалам — не смешивать ранжирование

Рекомендуемая модель:
1. **Source scope** — пользователь явно выбирает web / текущий документ / коллекцию / проект / разрешённые коннекторы.
2. **Query plan** — обычный поиск, несколько независимых запросов для исследования или извлечение по шаблону.
3. **Retrieval** — exact lexical + semantic/vector; rerank только если benchmark оправдывает задержку и ресурсы.
4. **Evidence normalization** — canonical URL, title, domain, published/updated time если известны, fetched time, snippet, source ID, citation offsets/page/bbox.
5. **Deduplication** — canonical URL и близкие дубликаты; не объединять разные редакции документа без сохранения версий.
6. **Synthesis** — утверждение → supporting sources; противоречия/пробелы обозначаются явно; цитаты ведут к реально полученным evidence.
7. **Saved research** — сохранять план, результаты, заметки и итог в выбранной коллекции; индекс — производный и пересоздаваемый.

Не смешивать в одном непрозрачном рейтинге свежесть веба, лексическое совпадение, семантическую близость и доверие к источнику. Это отдельные сигналы.

## UX-поведение Search & Research

- В composer есть единая команда/панель **Поиск**; обычное сообщение тоже может попросить поиск, но UI показывает, какие источники будут использованы.
- До запуска видны scope и действие: «В интернете», «В этой коллекции», «В выбранных файлах», «Глубокое исследование».
- Длительная работа отображает реальные стадии: план → поиск → чтение/извлечение → проверка → ответ. Не показывать фальшивый прогресс.
- Пользователь может отменить работу, убрать/добавить источник, сузить вопрос или попросить продолжить.
- Ответ имеет citations, а боковая панель — источники с доменом/датой/фрагментом/статусом извлечения.
- «Сохранить в исследование» сохраняет источники и отчёт в выбранный project scope; не сохранять в глобальную память автоматически.
- Для приватных материалов перед hosted processing показывается, какие данные покинут локальную среду.
- Ошибки источников не скрываются: недоступен, заблокирован, пустой результат, ошибка парсера, неподдерживаемый формат, источник устарел.
- Для научного поиска отдельно выводить первоисточники/статьи, метод/датасет, дату, ограничения и несогласующиеся результаты.

## Рекомендуемый технический контракт

Концептуальный контракт, который следует адаптировать к существующим typed tool schemas после проверки исходников:

- SearchRequest: query; scope (web / selected_sources / collection / project); mode (quick / research / exact / semantic / transform); source allowlist/connector IDs; language/date range/content types; max sources/bytes/timeout; privacy (local-only / remote with consent).
- SearchResult: source ID, canonical URL, title, domain, published time (если известен), fetched time, excerpt, extracted blocks, provenance (page/section/page number/bbox/timestamp), retrieval signals (lexical/semantic/freshness), status, warnings и license/attribution metadata при наличии.
- ResearchArtifact: question, plan, query log, selected sources, claims, evidence links, contradictions, unknowns, generation time, model/provider metadata, export format.

Это не существующий API и не команда к немедленному переписыванию текущих tool contracts.

## Критерии оценки

Собрать небольшой versioned golden set из пользовательских сценариев: точная цитата; вопрос по PDF; таблица в скане; несколько противоречивых веб-источников; свежая информация; русский/английский/тайский; документ с prompt injection; URL на private IP; пустой/битый/очень большой файл; дубликаты источников.

Измерять:
- Recall@k / nDCG@k для поиска;
- citation precision/coverage и support rate для утверждений;
- exact-match цифр/дат/названий;
- полноту извлечения таблиц/формул и корректность page/bbox;
- duplicate rate, stale-source rate и неподтверждённые утверждения;
- p50/p95, peak RSS, bytes processed, отмену/cleanup;
- UX: число действий «найти → проверить → сохранить»;
- privacy/security: утечка scope, SSRF, prompt injection, сохранение raw media, remote processing без согласия.

Нельзя принять систему только по красивым примерам. Каждый provider/parser/model оценивается на одинаковом наборе и целевом hardware; веса и парсеры закрепляются по версии/hash. Reranking/embeddings добавлять только если они улучшают golden-set качество достаточно, чтобы оправдать память/задержку.

## Карта 92 пользовательских кандидатов: применимость к Search & Research

Таблица дополняет основной triage: фиксирует, что именно проверить в каждом источнике применительно к поиску, знаниям, визуальным референсам и инструментам.

| № | Кандидат | Что проверить/заимствовать | Решение сейчас |
|---:|---|---|---|
| 1 | Open Notebook | Коллекции, chat по источникам, full-text/vector, citations, context levels, transformations, notes | Высокий приоритет: UX/сценарии |
| 2 | no AI slop | Редактура результата: меньше повторов и пустых вводных | Checklist, не fact-check |
| 3 | I Have ADHD | Следующий шаг, видимый прогресс, ограниченные списки | UX исследования |
| 4 | Bruno | Версионируемые API requests для Search API | Dev-only |
| 5 | heretic | Нет доказанной поисковой функции; модификация модели рискованна | Не внедрять |
| 6 | Open Interpreter | Approval/sandbox для будущих actions | Security reference |
| 7 | SpiderFoot | OSINT discovery, повышенные privacy/abuse риски | Вне ядра |
| 8 | Scrapy | Extractor для разрешённых публичных сайтов | Adapter с allowlist |
| 9 | LocalAI | Локальный provider для embeddings/LLM при подтверждённом API | Benchmark позже |
| 10 | yt-dlp | Явный импорт разрешённого медиа | Опциональный importer |
| 11 | Metasploit Framework | Не относится к поиску общего назначения | Отклонить из ядра |
| 12 | nmap | Не web search; отдельная разрешённая диагностика | Вне Search & Research |
| 13 | ComfyUI | Workflow API, reference images, media queue | Отдельный media adapter |
| 14 | OpenClaw | Оркестрация tools/agents, проверить permissions | Принципы, не runtime |
| 15 | edge0 | Память/скорость локального inference для search helper | Benchmark target host |
| 16 | bitnet.cpp | Низкобитный inference, не search engine | Model benchmark |
| 17 | manimGX | Upstream не определён | Уточнить URL |
| 18 | DeerFlow 2.0 | Research workflow, source synthesis, planning | Bounded research stages |
| 19 | ollaya | Неоднозначное название | Не включать без URL |
| 20 | EmbeddingGemma2 | Локальные embeddings для semantic retrieval | Проверить checkpoint/license/recall |
| 21 | LibreTranslate | Локальный перевод запросов/результатов | Adapter, RU/TH/EN eval |
| 22 | SearXNG | Метапоиск с контролируемым списком engines | Высокий приоритет для web search |
| 23 | self-evolution | Eval-gated улучшения query plans/skills | Approval + rollback |
| 24 | agent bridge | Typed transport UI/gateway/search tools | Contract-first, найти upstream |
| 25 | llmtrim | Сжатие контекста без потери evidence | Эксперимент claim/citation retention |
| 26 | The Agency | Узкие роли planner/source verifier/synthesizer | Извлечь роли, не runtime |
| 27 | gstack | Review/test/browser QA для Search UI | Отдельные навыки |
| 28 | awesome-opus5-5-videos | Обучающий каталог | Не runtime |
| 29 | Syncthing | Опциональная синхронизация research artifacts | Позднее, conflict/backup tests |
| 30 | Cloudflare Code Mode | Typed API calls для разрешённых коннекторов | Sandbox/least privilege |
| 31 | MiniMind | Учебный/benchmark источник малых моделей | Не production dependency |
| 32 | onenMaic | Upstream не подтверждён | Уточнить |
| 33 | OpenCloud | Возможный файловый connector | Не добавлять второй storage без нужды |
| 34 | OpenAI agent manage/mover | Название неоднозначно | Уточнить |
| 35 | Can I Vibecode | Каталог обучения/discovery | Не runtime |
| 36 | Vitrine | Название неоднозначно | Уточнить |
| 37 | anmolkapil/plexo | Проверить конкретную search UX/tool idea | Upstream review |
| 38 | concou | Upstream не установлен | Уточнить |
| 39 | system-prompts-and-models-of-ai-tools | Изучать паттерны поиска/цитирования, не копировать prompts вслепую | Справочник |
| 40 | Official MCP Registry | Discovery search/connectors | Приоритетный каталог, не allowlist доверия |
| 41 | AppFlowy | Возможный knowledge/export connector | По конкретному сценарию |
| 42 | foooc b us | Имя неоднозначно | Уточнить |
| 43 | Colibry | Имя неоднозначно | Уточнить |
| 44 | AirLLM | Offload для больших моделей | Не ставить на 8-GB CPU без benchmark |
| 45 | skilspectator | Имя неоднозначно | Уточнить |
| 46 | slee-persis/GVS5H | Польза/API/license требуют проверки | Upstream review |
| 47 | DeepInfer | Имя неоднозначно | Уточнить |
| 48 | Muse Code | Поиск по репозиторию/coding workflow | Только доказуемые workflow |
| 49 | Understand Anything | Codebase map/relationships для project search | Лёгкий индекс с provenance при выигрышном eval |
| 50 | agent memory | Recall подтверждённых фактов по scope | Сравнить с SQLite/FTS5, не дублировать stores |
| 51 | scientific agent skills | Литература, первоисточники, evidence, reproducibility | Высокий приоритет: skill layer |
| 52 | diagram design | Диаграммы по найденным фактам с citations/assumptions | Skill + renderer отдельно |
| 53 | OpenViking | Unified context/memory/knowledge retrieval | Сравнить retrieval eval, не мигрировать заранее |
| 54 | grill-me | Уточнить вопрос перед дорогим поиском | On-demand, не опрос всегда |
| 55 | TimesFM | Специализированный анализ временных рядов | Не общий search |
| 56 | Ruflo | Координация search roles | Bounded DAG, бюджеты |
| 57 | MiniCPM-V apps | Vision/OCR для изображений/скриншотов/диаграмм | Benchmark языки/hardware |
| 58 | Voice Studio | Upstream неоднозначен | Уточнить; не search backend |
| 59 | Orca | Несколько проектов с таким именем | Нужен URL |
| 60 | Headroom | Имя неоднозначно | Уточнить |
| 61 | CLI-Anything | CLI для benchmark/index jobs с JSON/exit codes | Dev/admin only, allowlist |
| 62 | Open WebUI | UX знаний, файлов, web search и tools | UX reference, не второй UI |
| 63 | Handy | Имя неоднозначно | Уточнить |
| 64 | Meetily | Локальные транскрипты встреч как источник | Opt-in, согласие/retention |
| 65 | Vain | Имя неоднозначно | Уточнить |
| 66 | OpenCode | Coding/research tool workflow | Reference, не фоновый агент |
| 67 | Open Notebook duplicate | Объединён с №1 | Без повторной интеграции |
| 68 | Dyad | Локальный инструмент разработки | Не runtime |
| 69 | AgenticSeek | Local-first browser/search agent workflow | Sandbox/approval reference |
| 70 | Duix Avatar | Audio/video presentation результатов | После voice/media pipeline |
| 71 | theAlgorithms/python | Справочник алгоритмов | Ссылки; license при копировании |
| 72 | ML-for-beginners | Учебные маршруты | Не runtime |
| 73 | homemade-machine-learning | Учебные примеры | Не runtime |
| 74 | machine-learning-interview | Учебный справочник | Не runtime |
| 75 | deep-learning-papers-reading-roadmap | Путь чтения исследований | Research resource |
| 76 | tensorflow-examples | Примеры конкретных ML задач | Не runtime по умолчанию |
| 77 | PyTorch/tutorials | Воспроизводимые эксперименты | Dev resource |
| 78 | llama-course | Обучение LLM | Не runtime |
| 79 | generative-ai-for-beginners | Обучение GenAI | Не runtime |
| 80 | awesome-ChatGPT-prompts | Идеи prompt/query templates | Не импортировать массово |
| 81 | 500-AI-ML-DL-CV-NLP-Projects-with-code | Discovery примеров | Проверять конкретный проект |
| 82 | awesome-machine-learning | Discovery каталог | Не runtime |
| 83 | Papers with Code | Связка papers и code/results | Полезен для discovery, проверять отдельно |
| 84 | Caveman | Краткий режим результатов | Опциональный стиль, не терять citations |
| 85 | Graphify | Графовая индексация кода/связей | Eval против текущих индексов |
| 86 | Browser Harness | E2E поиска и источников | Полезно, ограничить домены |
| 87 | Claude Video | Имя неоднозначно | Уточнить |
| 88 | Open Design | Design system/accessibility reference | Для Search UI, не менять вслепую |
| 89 | Codebird | Имя неоднозначно | Уточнить |
| 90 | Impeccable | UI design-review checklist | Audit-first/screenshots, license check |
| 91 | Design Extract | Извлечение design tokens/references | Проверить upstream, точность и права |
| 92 | n8n MCP | Внешние workflow/data connector | Opt-in, scopes/approval/audit |

## Приоритет внедрения

### P0 — Search UX contract, без новых тяжёлых сервисов
1. Ввести scope и режимы поиска в интерфейсе.
2. Унифицировать SearchResult/evidence metadata на уровне существующих typed tools.
3. Показывать цитируемые источники, фрагменты, предупреждения и статусы парсинга.
4. Сохранять исследования в явном project/collection scope, не в глобальную память.
5. Добавить golden-set tests на citations, duplicates, source scope и prompt injection.

### P1 — web-search adapters и исследовательский цикл
1. Проверить текущий web search в исходниках, прежде чем писать замену.
2. Сравнить имеющийся provider с SearXNG на одинаковых запросах и фиксированных наборах.
3. Добавить bounded query planner: 1–3 поисковых подзапроса в research mode, лимит источников/времени и отмена.
4. Добавить source fetch/extract с SSRF policy и provenance.
5. Развести exact, lexical, semantic и web search как отдельные намерения.

### P2 — Notebook-like collection
1. Коллекции и добавление источников.
2. Поддержка файлов/URL через безопасные ingestion jobs.
3. Search + chat по выбранным источникам с citations.
4. Сохраняемые transformations/insights и повторное использование.
5. Экспорт/удаление и retention controls.

### P3 — multimodal research
1. Parser adapter interface; сначала текст/PDF, затем таблицы/изображения.
2. Benchmark OCR/vision на реальных RU/EN/TH примерах.
3. Page/bbox provenance и открыть цитируемый фрагмент.
4. Audio/video ingestion только с проверенными provider, лицензией, лимитами и cleanup.

## Release gates

- Не включать MCP/connectors без точного upstream, publisher, pinned version, license, permissions, dependency review и kill switch.
- Не добавлять второй database/vector store до сравнения с существующими SQLite/FTS5 и project memory.
- Не передавать приватные документы внешним провайдерам без явного согласия.
- Не исполнять код/команды, найденные в источниках.
- Проверять PR HEAD и post-merge CI; документ или mock test не доказывает работу live сервиса.
- Каждая интеграция должна иметь feature flag (off by default), отмену, quotas, rollback и тесты утечки scope/SSRF/injection.

## Проверенные первичные источники

- Open Notebook: https://github.com/lfnovo/open-notebook и https://www.open-notebook.ai/features
- Open Notebook transformations: https://github.com/lfnovo/open-notebook/blob/main/docs/3-USER-GUIDE/transformations.md
- RAG-Anything: https://github.com/HKUDS/RAG-Anything
- ComfyUI: https://github.com/Comfy-Org/ComfyUI и https://comfy.org/workflows/
- taste-skill: https://github.com/Leonxlnx/taste-skill
- Agent Skills specification: https://agentskills.io/specification
- SearXNG: https://github.com/searxng/searxng
- Scrapy: https://github.com/scrapy/scrapy
- yt-dlp: https://github.com/yt-dlp/yt-dlp

## Ограничения исследования

- Таблица 92 пунктов опирается на пользовательский triage в docs/OPEN_SOURCE_TRIAGE_RU.md. Для неоднозначных названий без точного upstream функциональность не приписывается по догадке.
- Глубокая первичная проверка в этом документе выполнена для Open Notebook, RAG-Anything, ComfyUI, taste-skill и Agent Skills; для SearXNG/Scrapy/yt-dlp зафиксирована целевая роль adapter, но перед интеграцией нужно отдельно проверить актуальные README/API/security docs и лицензии.
- Никакие внешние сервисы, модели или MCP servers этим документом не установлены и не активированы.
