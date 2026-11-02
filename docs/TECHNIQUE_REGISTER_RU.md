# Реестр проектов, техник и инженерных решений aLandi

**Срез источников: октябрь 2026 г.** Этот документ отвечает на практический вопрос: что именно мы переносим в текущий aLandi, что оставляем справочником, а что сознательно не ставим. Ссылка на проект не означает его установки.

## Базовый принцип

Рабочая архитектура остаётся: статический AI Mobile Agent / GitHub Pages → авторизованный aLandi Lite Gateway → Ollama → одна активная модель на VPS с 8 GB RAM. Инструкции развёртывания находятся в [ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md). UI и существующий код не переписываются на новый framework без измеримого основания.

## Реестр решений

| Проект | Что это | Что заимствуем / решение |
|---|---|---|
| [Harness²](https://github.com/google-research/harness2) | Исследовательский harness с циклом Propose–Probe–Compose и проверкой гипотез. | **Заимствовать bounded loop:** сначала сформулировать гипотезу/план, выполнить небольшой probe, проверить результат, затем compose. Не запускать полноценный benchmark harness и его executor на production VPS; сетевые полномочия и sandbox настройки проверять строго. |
| [Claudex Loop](https://github.com/chaseai-yt/claudex-loop) | Workflow для структурированного планирования, реализации, review и проверки. Ты писал «cloudex-loop»; ближайший проверенный проект с таким названием — Claudex Loop. Если подразумевался другой URL, его надо сверить отдельно. | **Взять как процесс, не как runtime:** каждый значимый patch должен включать goal → probe → минимальный diff → независимую проверку → тесты → отчёт. |
| [Everything Claude Code / ECC](https://github.com/affaan-m/ECC) | Набор coding-agent skills, rules, hooks, TDD/review/evaluation и compaction patterns. | **Избирательно применять TDD, security review, context compaction и verified learning.** Не устанавливать весь Claude-specific hook/MCP комплект в браузерный сайт или VPS; не переносить чужие project-specific инструкции без аудита. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Набор prompt/practices вокруг простых изменений и отказа от лишней сложности. | **Принять YAGNI и минимальные диффы:** не добавлять framework/service без подтверждённой нужды; всегда указывать, какое измерение или тест улучшает изменение. |
| [Agent Skills specification](https://agentskills.io/specification) | Формат для навыков с кратким описанием и раскрываемыми по требованию инструкциями. | **Применять progressive disclosure.** Сейчас сайт имеет собственные on-demand assets в папке skills и загружает их только в Deep / Research; сохранить текущий контракт и regression tests. Не менять расширения/формат всех навыков массово без выгоды для загрузчика. |
| [Hono](https://github.com/honojs/hono) | Лёгкий TypeScript web framework для нескольких JavaScript runtime. | **Не переносить backend на Hono:** текущий FastAPI gateway уже реализован, покрыт контрактными тестами и работает совместно с Ollama. Переписывание добавит риск и не даст доказанного выигрыша на 8 GB. |
| [Public APIs каталог](https://github.com/public-apis/public-apis) и [public-api сервер](https://github.com/davemachado/public-api) | Два разных проекта с похожими именами: первый — каталог открытых API, второй — служба для каталога. | **Только справочник разработчика.** Не добавлять как обязательный runtime или зависимости inference. Уточнять точный upstream, когда пользователь называет просто «Public API». |
| [Free Programming Books](https://github.com/EbookFoundation/free-programming-books) | Каталог бесплатных учебников/курсов программирования. | **Оставить источником обучения**, не скачивать целый каталог на сервер и не подмешивать книги к системному prompt. |
| [Developer Roadmap](https://github.com/kamranahmedse/developer-roadmap) / [roadmap.sh](https://roadmap.sh) | Учебные дорожные карты по разработке и технологиям. | **Использовать для плана освоения**, не runtime-компонент приложения. |
| [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) | Отдельная multi-agent interactive classroom платформа. Код в upstream помечен MIT, но проект требует свежий Node/pnpm, PostgreSQL и provider credentials/long-running app. | **Не устанавливать на базовый VPS:** дублирует существующий продуктовый интерфейс, добавляет БД и сервисы, требует отдельного сценария «виртуальный класс». Вернуться только при явной потребности. |
| [Every App](https://github.com/every-app/every-app) | Платформа для персональных приложений на инфраструктуре Cloudflare, а не кэш Ollama. | **Не подключать в текущем runtime.** Изучать, если появится отдельная задача быстро строить изолированные персональные приложения; не путать с Cloudflare Tunnel. |
| [Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Установка/набор capability adapters для доступа к research-площадкам и интернет-источникам; часть каналов зависит от аккаунтов/cookies и может ломаться. | **Не запускать installer по умолчанию.** Добавлять только отдельный source adapter с ясным allowlist, проверкой URL/SSRF и отдельными секретами. Текущие поиск/evidence trail сохраняются. |
| [Trail-Code](https://github.com/trailhq/Trail-Code) | Инструменты контекста кодовой базы/графа и долговременных project learnings. Это не модель и не кэш ответов LLM. | **Dev-only эксперимент**, если реальная навигация по коду станет бутылочным горлышком. Не ставить как постоянный server service; не принимать его findings автоматически в правила безопасности. |
| [Cactus Needle](https://github.com/cactus-compute/needle) | Маленькая модель/инструментарий для ограниченных structured extraction/tool-call задач, не универсальная code LLM. | **Только необязательный benchmark** для локального extraction/tool routing. Проверить точный артефакт/лицензию, language support и telemetry; upstream предусматривает opt-out через NEEDLE_TELEMETRY=0 и DO_NOT_TRACK=1. Не заменяет Qwen3.5 основной диалог. |
| [AirLLM](https://github.com/lyogavin/airllm) | Layer-wise/offload inference, в основном интересен экономией GPU VRAM за счёт дискового ввода-вывода. | **Не считать магическим способом ускорить большие модели на CPU.** Не ставить в текущий 8-GB runtime; только отдельное измерение на GPU host при конкретной задаче. |
| [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | Студия генерации изображений/видео с множеством подключаемых провайдеров. Это не единый локальный LLM runtime. | **Отложить до отдельного Image/Video feature.** Явно различать локальное исполнение и стороннюю генерацию; проверять лицензию моделей и условия API. |
| [dsh-our-free-model](https://github.com/ebony-vinyl/dsh-our-free-model) | Плагин DeepSeek Harness с публичными внешними gateway/модельными каналами и локальным relay. | **Не подключать внешние бесплатные каналы к приватным данным.** «Free» не гарантирует приватность, SLA или неизменность условий upstream. Заимствовать только приёмы актуализации каталогов/обнаружения ошибок провайдера. |
| [CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Метод разработки agent-friendly CLI с help, JSON output, понятными exit codes и тестированием end-to-end. | **Применить к будущим административным/benchmark CLI:** фиксированный allowlist команд, валидируемые аргументы, dry-run, JSON и exit status. Не выдавать обычному браузерному агенту shell-доступ. |
| [RAG-Anything](https://github.com/HKUDS/RAG-Anything) | Multimodal RAG, который раскладывает документы на текст/таблицы/формулы/картинки и сохраняет связи содержимого. Полная установка может требовать тяжёлые парсеры и системные зависимости. | **Принять архитектуру parser → структурные фрагменты → provenance page/bbox → retrieval → citations.** Полный runtime не ставить на 8 GB до benchmark реального корпуса и памяти. |
| [Pliny / L1B3RT4S](https://github.com/elder-plinius/L1B3RT4S) | Prompt-jailbreak / «liberation» примеры; это не runtime и не безопасная агентная система. | **Не включать jailbreak-тексты в system prompt/skills.** Можно держать безопасные отрицательные prompt-injection тесты, доказывающие, что документы не меняют правила инструментов/авторизации. |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Frontend design skill: сначала осмотреть существующий продукт, задать art direction, проверить реальные изображения/атрибуцию и браузерные screenshots. | **Взять только audit-first QA:** не редизайнить страницу, если это не требование; проверить desktop/mobile, keyboard/focus, reduced motion, затем исправить 1–3 конкретных дефекта. |
| [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | Учебный инженерный курс с исполняемыми задачами и retrieval/agent упражнениями. Это наиболее вероятный upstream для упоминания «AI / FROM SCRATCH», но имя в исходном запросе было неоднозначным. | **Build → run → test → benchmark → compare.** Сохранять runnable artifact и измеряемый результат, не переносить весь учебный runtime в проект. |
| [Moonshine Voice](https://github.com/moonshine-ai/moonshine) | On-device speech toolkit, отдельный от текущей задачи aLandi gateway. | **Не часть текущего плана развёртывания.** Рассматривать позднее только если пользователь отдельно запросит голосовой интерфейс и есть точная модель/лицензия для нужного языка. |

## Уже сделано в aLandi

- Сохраняется текущий статический AI Mobile Agent и его режимы; новый framework не внедряется.
- Существующие on-demand skills и evidence trail остаются частью приложения.
- В правильном репозитории реализуется preset aLandi Self-hosted Gateway без скрытого fallback на Gemini при пустом custom Base URL.
- Добавляется точный SQLite L2 cache: 900 секунд TTL, ограничение размера/количества, ключ с hash-scope credentials, только завершённый plain text с явной низкой temperature; stream, tools, multimodal/structured content, ошибки/partial outputs и динамические Research stages обходят его.
- Добавляются тесты и deployment guide. Наличие в реестре не означает, что внешние модели/сервисы были установлены или что VPS уже настроен.

## Очерёдность внедрения

1. Проверить версию и развернуть базовый gateway/Ollama, не трогая рабочие существующие маршруты.
2. Проверить auth, CORS, allowlist, body/timeouts, cancellation и ресурсный baseline.
3. Проверить L0 / L1 / L2 как разные механизмы и запустить miss-hit-bypass тесты.
4. Измерить один основной model tag на собственном golden set.
5. И только после подтверждённой необходимости планировать OCR/RAG, дополнительные runtime или графовую память.


## Дополнение 2026-10-21: память-граф и bounded agent teams

- [64 роли, память, проекты, документы и RAG](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md)
- [Аудит OpenMAIC, Paperclip, HyperFrames, RuFlo, Coucou, OpenShell, Impeccable, DBX, Grok Register, Jev Ultrafast, Utopia, FreeDomain, witr, PinchTab и Vert](TECHNOLOGY_AUDIT_2026-10-21_RU.md)
- Взяты принципы: bounded fan-out, role/task registry, budgets, approval/review gates, eval-gated learning, temporal facts, indexed browser actions, deterministic video rendering и provenance-aware RAG.
- Полные сторонние runtime не добавляются в базовый 8-GB stack. Vert не интегрируется без точного upstream; Grok Register отклонён по причине массовой регистрации и обхода anti-abuse.


## Дополнительный аудит источников (2026-10-27)

Построчные решения по списку пользователя находятся в [OPEN_SOURCE_TRIAGE_RU.md](OPEN_SOURCE_TRIAGE_RU.md). Основные технические выводы:

- **Graphify — пилот для разработки:** построить локальный graph/report и проверить, сокращает ли он время поиска связей в клиенте, gateway, memory, tests и конфигурации; generated output не добавлять в runtime до измерения пользы.
- **GitIngest — инструмент контекстного снимка:** полезен для ограниченного текстового обзора репозитория; не передавать secrets/private source без проверки обработки данных.
- **GitMCP — инструмент чтения upstream:** подключать адрес конкретного репозитория, а не generic endpoint по умолчанию; MCP results не считать доверенными инструкциями.
- **GitReverse — пропустить для навигации:** синтетический prompt не даёт проверяемого dependency graph.
- **DevOps-каталоги, Compose/Kubernetes examples, public APIs и MCP server lists — справочники, не runtime-зависимости.** Шаблоны переносить по одному после license/security review и тестов.
- **Модели, neuron steering, аудиоразделение, semantic cache и disk-backed state — эксперименты.** Не менять активную модель или автоматическое поведение без golden eval, ресурсных замеров целевого хоста и rollback.
- Точные upstream для неоднозначных имён и концептуальных строк отмечены как «уточнить» в triage; не угадывать по похожему имени.


## Graphify — решение после повторного чтения upstream (2026-10-27)

- Назначение: dev-only code navigation/cross-file graph; не runtime feature.
- Основание: upstream README/quickstart/pyproject.toml; Apache-2.0, package `graphifyy`, CLI `graphify`, Python >=3.10; local tree-sitter parsing for code; semantic pass for docs/media may use a model.
- Риски: substantial dependency footprint, fast-moving release, model usage for docs/media, stale generated output. Pin version and exclude secrets/build output.
- Решение: **pilot verified, dev-only**. Main run `40637941303` built a code-only graph with 988 nodes, 2780 edges and 60 source files (224 inline UI JS nodes, 14 SQL schema nodes, 23 RAG module nodes); ten focused queries returned graph neighborhoods. PR #76 added source-change and weekly triggers. Artifacts expire after seven days and are not committed or loaded at runtime. Limits: some query output truncates at 700 tokens, nine Playwright E2E files yielded no symbols, and community labels are generic. See `docs/ALANDI_ARCHITECTURE_MAP_RU.md` and `project-reference/FILE_ORIENTER_RU.md`.


## Graphify CSS/DOM bridge — PR #131 pilot (2026-11-02)

- Проблема подтверждена артефактом Graphify 0.9.96: `--code-only` пропускает HTML/Markdown/CSS; path filters только запускают workflow и не означают извлечение этих форматов.
- Добавлен CI-only мост `scripts/graphify_ui_surface.py`: `tinycss2==1.4.0` разбирает CSS, стандартный `HTMLParser` собирает DOM id/class, ограниченные статические шаблоны находят JS references через `# Реестр проектов, техник и инженерных решений aLandi

**Срез источников: октябрь 2026 г.** Этот документ отвечает на практический вопрос: что именно мы переносим в текущий aLandi, что оставляем справочником, а что сознательно не ставим. Ссылка на проект не означает его установки.

## Базовый принцип

Рабочая архитектура остаётся: статический AI Mobile Agent / GitHub Pages → авторизованный aLandi Lite Gateway → Ollama → одна активная модель на VPS с 8 GB RAM. Инструкции развёртывания находятся в [ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md). UI и существующий код не переписываются на новый framework без измеримого основания.

## Реестр решений

| Проект | Что это | Что заимствуем / решение |
|---|---|---|
| [Harness²](https://github.com/google-research/harness2) | Исследовательский harness с циклом Propose–Probe–Compose и проверкой гипотез. | **Заимствовать bounded loop:** сначала сформулировать гипотезу/план, выполнить небольшой probe, проверить результат, затем compose. Не запускать полноценный benchmark harness и его executor на production VPS; сетевые полномочия и sandbox настройки проверять строго. |
| [Claudex Loop](https://github.com/chaseai-yt/claudex-loop) | Workflow для структурированного планирования, реализации, review и проверки. Ты писал «cloudex-loop»; ближайший проверенный проект с таким названием — Claudex Loop. Если подразумевался другой URL, его надо сверить отдельно. | **Взять как процесс, не как runtime:** каждый значимый patch должен включать goal → probe → минимальный diff → независимую проверку → тесты → отчёт. |
| [Everything Claude Code / ECC](https://github.com/affaan-m/ECC) | Набор coding-agent skills, rules, hooks, TDD/review/evaluation и compaction patterns. | **Избирательно применять TDD, security review, context compaction и verified learning.** Не устанавливать весь Claude-specific hook/MCP комплект в браузерный сайт или VPS; не переносить чужие project-specific инструкции без аудита. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Набор prompt/practices вокруг простых изменений и отказа от лишней сложности. | **Принять YAGNI и минимальные диффы:** не добавлять framework/service без подтверждённой нужды; всегда указывать, какое измерение или тест улучшает изменение. |
| [Agent Skills specification](https://agentskills.io/specification) | Формат для навыков с кратким описанием и раскрываемыми по требованию инструкциями. | **Применять progressive disclosure.** Сейчас сайт имеет собственные on-demand assets в папке skills и загружает их только в Deep / Research; сохранить текущий контракт и regression tests. Не менять расширения/формат всех навыков массово без выгоды для загрузчика. |
| [Hono](https://github.com/honojs/hono) | Лёгкий TypeScript web framework для нескольких JavaScript runtime. | **Не переносить backend на Hono:** текущий FastAPI gateway уже реализован, покрыт контрактными тестами и работает совместно с Ollama. Переписывание добавит риск и не даст доказанного выигрыша на 8 GB. |
| [Public APIs каталог](https://github.com/public-apis/public-apis) и [public-api сервер](https://github.com/davemachado/public-api) | Два разных проекта с похожими именами: первый — каталог открытых API, второй — служба для каталога. | **Только справочник разработчика.** Не добавлять как обязательный runtime или зависимости inference. Уточнять точный upstream, когда пользователь называет просто «Public API». |
| [Free Programming Books](https://github.com/EbookFoundation/free-programming-books) | Каталог бесплатных учебников/курсов программирования. | **Оставить источником обучения**, не скачивать целый каталог на сервер и не подмешивать книги к системному prompt. |
| [Developer Roadmap](https://github.com/kamranahmedse/developer-roadmap) / [roadmap.sh](https://roadmap.sh) | Учебные дорожные карты по разработке и технологиям. | **Использовать для плана освоения**, не runtime-компонент приложения. |
| [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) | Отдельная multi-agent interactive classroom платформа. Код в upstream помечен MIT, но проект требует свежий Node/pnpm, PostgreSQL и provider credentials/long-running app. | **Не устанавливать на базовый VPS:** дублирует существующий продуктовый интерфейс, добавляет БД и сервисы, требует отдельного сценария «виртуальный класс». Вернуться только при явной потребности. |
| [Every App](https://github.com/every-app/every-app) | Платформа для персональных приложений на инфраструктуре Cloudflare, а не кэш Ollama. | **Не подключать в текущем runtime.** Изучать, если появится отдельная задача быстро строить изолированные персональные приложения; не путать с Cloudflare Tunnel. |
| [Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Установка/набор capability adapters для доступа к research-площадкам и интернет-источникам; часть каналов зависит от аккаунтов/cookies и может ломаться. | **Не запускать installer по умолчанию.** Добавлять только отдельный source adapter с ясным allowlist, проверкой URL/SSRF и отдельными секретами. Текущие поиск/evidence trail сохраняются. |
| [Trail-Code](https://github.com/trailhq/Trail-Code) | Инструменты контекста кодовой базы/графа и долговременных project learnings. Это не модель и не кэш ответов LLM. | **Dev-only эксперимент**, если реальная навигация по коду станет бутылочным горлышком. Не ставить как постоянный server service; не принимать его findings автоматически в правила безопасности. |
| [Cactus Needle](https://github.com/cactus-compute/needle) | Маленькая модель/инструментарий для ограниченных structured extraction/tool-call задач, не универсальная code LLM. | **Только необязательный benchmark** для локального extraction/tool routing. Проверить точный артефакт/лицензию, language support и telemetry; upstream предусматривает opt-out через NEEDLE_TELEMETRY=0 и DO_NOT_TRACK=1. Не заменяет Qwen3.5 основной диалог. |
| [AirLLM](https://github.com/lyogavin/airllm) | Layer-wise/offload inference, в основном интересен экономией GPU VRAM за счёт дискового ввода-вывода. | **Не считать магическим способом ускорить большие модели на CPU.** Не ставить в текущий 8-GB runtime; только отдельное измерение на GPU host при конкретной задаче. |
| [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | Студия генерации изображений/видео с множеством подключаемых провайдеров. Это не единый локальный LLM runtime. | **Отложить до отдельного Image/Video feature.** Явно различать локальное исполнение и стороннюю генерацию; проверять лицензию моделей и условия API. |
| [dsh-our-free-model](https://github.com/ebony-vinyl/dsh-our-free-model) | Плагин DeepSeek Harness с публичными внешними gateway/модельными каналами и локальным relay. | **Не подключать внешние бесплатные каналы к приватным данным.** «Free» не гарантирует приватность, SLA или неизменность условий upstream. Заимствовать только приёмы актуализации каталогов/обнаружения ошибок провайдера. |
| [CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Метод разработки agent-friendly CLI с help, JSON output, понятными exit codes и тестированием end-to-end. | **Применить к будущим административным/benchmark CLI:** фиксированный allowlist команд, валидируемые аргументы, dry-run, JSON и exit status. Не выдавать обычному браузерному агенту shell-доступ. |
| [RAG-Anything](https://github.com/HKUDS/RAG-Anything) | Multimodal RAG, который раскладывает документы на текст/таблицы/формулы/картинки и сохраняет связи содержимого. Полная установка может требовать тяжёлые парсеры и системные зависимости. | **Принять архитектуру parser → структурные фрагменты → provenance page/bbox → retrieval → citations.** Полный runtime не ставить на 8 GB до benchmark реального корпуса и памяти. |
| [Pliny / L1B3RT4S](https://github.com/elder-plinius/L1B3RT4S) | Prompt-jailbreak / «liberation» примеры; это не runtime и не безопасная агентная система. | **Не включать jailbreak-тексты в system prompt/skills.** Можно держать безопасные отрицательные prompt-injection тесты, доказывающие, что документы не меняют правила инструментов/авторизации. |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Frontend design skill: сначала осмотреть существующий продукт, задать art direction, проверить реальные изображения/атрибуцию и браузерные screenshots. | **Взять только audit-first QA:** не редизайнить страницу, если это не требование; проверить desktop/mobile, keyboard/focus, reduced motion, затем исправить 1–3 конкретных дефекта. |
| [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | Учебный инженерный курс с исполняемыми задачами и retrieval/agent упражнениями. Это наиболее вероятный upstream для упоминания «AI / FROM SCRATCH», но имя в исходном запросе было неоднозначным. | **Build → run → test → benchmark → compare.** Сохранять runnable artifact и измеряемый результат, не переносить весь учебный runtime в проект. |
| [Moonshine Voice](https://github.com/moonshine-ai/moonshine) | On-device speech toolkit, отдельный от текущей задачи aLandi gateway. | **Не часть текущего плана развёртывания.** Рассматривать позднее только если пользователь отдельно запросит голосовой интерфейс и есть точная модель/лицензия для нужного языка. |

## Уже сделано в aLandi

- Сохраняется текущий статический AI Mobile Agent и его режимы; новый framework не внедряется.
- Существующие on-demand skills и evidence trail остаются частью приложения.
- В правильном репозитории реализуется preset aLandi Self-hosted Gateway без скрытого fallback на Gemini при пустом custom Base URL.
- Добавляется точный SQLite L2 cache: 900 секунд TTL, ограничение размера/количества, ключ с hash-scope credentials, только завершённый plain text с явной низкой temperature; stream, tools, multimodal/structured content, ошибки/partial outputs и динамические Research stages обходят его.
- Добавляются тесты и deployment guide. Наличие в реестре не означает, что внешние модели/сервисы были установлены или что VPS уже настроен.

## Очерёдность внедрения

1. Проверить версию и развернуть базовый gateway/Ollama, не трогая рабочие существующие маршруты.
2. Проверить auth, CORS, allowlist, body/timeouts, cancellation и ресурсный baseline.
3. Проверить L0 / L1 / L2 как разные механизмы и запустить miss-hit-bypass тесты.
4. Измерить один основной model tag на собственном golden set.
5. И только после подтверждённой необходимости планировать OCR/RAG, дополнительные runtime или графовую память.


## Дополнение 2026-10-21: память-граф и bounded agent teams

- [64 роли, память, проекты, документы и RAG](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md)
- [Аудит OpenMAIC, Paperclip, HyperFrames, RuFlo, Coucou, OpenShell, Impeccable, DBX, Grok Register, Jev Ultrafast, Utopia, FreeDomain, witr, PinchTab и Vert](TECHNOLOGY_AUDIT_2026-10-21_RU.md)
- Взяты принципы: bounded fan-out, role/task registry, budgets, approval/review gates, eval-gated learning, temporal facts, indexed browser actions, deterministic video rendering и provenance-aware RAG.
- Полные сторонние runtime не добавляются в базовый 8-GB stack. Vert не интегрируется без точного upstream; Grok Register отклонён по причине массовой регистрации и обхода anti-abuse.


## Дополнительный аудит источников (2026-10-27)

Построчные решения по списку пользователя находятся в [OPEN_SOURCE_TRIAGE_RU.md](OPEN_SOURCE_TRIAGE_RU.md). Основные технические выводы:

- **Graphify — пилот для разработки:** построить локальный graph/report и проверить, сокращает ли он время поиска связей в клиенте, gateway, memory, tests и конфигурации; generated output не добавлять в runtime до измерения пользы.
- **GitIngest — инструмент контекстного снимка:** полезен для ограниченного текстового обзора репозитория; не передавать secrets/private source без проверки обработки данных.
- **GitMCP — инструмент чтения upstream:** подключать адрес конкретного репозитория, а не generic endpoint по умолчанию; MCP results не считать доверенными инструкциями.
- **GitReverse — пропустить для навигации:** синтетический prompt не даёт проверяемого dependency graph.
- **DevOps-каталоги, Compose/Kubernetes examples, public APIs и MCP server lists — справочники, не runtime-зависимости.** Шаблоны переносить по одному после license/security review и тестов.
- **Модели, neuron steering, аудиоразделение, semantic cache и disk-backed state — эксперименты.** Не менять активную модель или автоматическое поведение без golden eval, ресурсных замеров целевого хоста и rollback.
- Точные upstream для неоднозначных имён и концептуальных строк отмечены как «уточнить» в triage; не угадывать по похожему имени.


## Graphify — решение после повторного чтения upstream (2026-10-27)

- Назначение: dev-only code navigation/cross-file graph; не runtime feature.
- Основание: upstream README/quickstart/pyproject.toml; Apache-2.0, package `graphifyy`, CLI `graphify`, Python >=3.10; local tree-sitter parsing for code; semantic pass for docs/media may use a model.
- Риски: substantial dependency footprint, fast-moving release, model usage for docs/media, stale generated output. Pin version and exclude secrets/build output.
- Решение: **pilot verified, dev-only**. Main run `40637941303` built a code-only graph with 988 nodes, 2780 edges and 60 source files (224 inline UI JS nodes, 14 SQL schema nodes, 23 RAG module nodes); ten focused queries returned graph neighborhoods. PR #76 added source-change and weekly triggers. Artifacts expire after seven days and are not committed or loaded at runtime. Limits: some query output truncates at 700 tokens, nine Playwright E2E files yielded no symbols, and community labels are generic. See `docs/ALANDI_ARCHITECTURE_MAP_RU.md` and `project-reference/FILE_ORIENTER_RU.md`.


, `getElementById`, `querySelector(All)`, `getElementsByClassName` и `classList`. Мост добавляет CSS/DOM/JS selector nodes и evidence-labelled links в Graphify `graph.json` после clustering; исходный Graphify AST остаётся нетронутым.
- Exact source/test HEAD `8f4a0a532639586f557c85156ede41810d4cc79b`, Graphify run #41415488412 passed: 3,198 nodes / 8,559 edges / 61 communities (60 AST communities + UI Surface); 77 source files. Из UI bridge: 776 CSS selector occurrences / 732 unique nodes; 536 DOM selectors; 780 JS reference occurrences / 717 unique nodes; 184 CSS↔DOM selector-name matches; 306 JS→CSS matches. 351 DOM selector names lack a CSS-name match and 43 CSS selector names lack a static DOM-name match; these are review candidates, not automatic defects (dynamic DOM/classes and conditional styles are possible).
- Provenance: source containment is `EXTRACTED`; name-based CSS→DOM and JS→CSS/DOM relationships are `INFERRED`. A match is not proof of computed browser styling or runtime execution. Browser screenshots/Playwright remain the visual-behavior evidence.
- Tests: `tests/test_graphify_ui_surface.py` runs in the Graphify workflow; `tinycss2` is installed only in ephemeral CI. No app runtime, VPS, production dependency, model call, new service or persistent graph store. Artifacts remain seven-day, artifact-only.
- Astria (MIT, Rust/Tree-sitter, CSS registry) was reviewed as a related independent graph builder, not adopted: it is not a Graphify plugin or schema-compatible drop-in. Its CSS `rule_set` configuration appears mismatched with the Tree-sitter CSS grammar's `selectors` field; runtime extraction on aLandi was not established. Keep as a research candidate, not an asserted upstream defect.
- `tinycss2==1.4.0` is BSD-3-Clause (confirmed against PyPI/upstream metadata); it is installed only inside ephemeral Graphify CI, not in Gateway/frontend dependencies. Quality #41416369361 passed on exact documentation HEAD `d4ceaf84e945ddee0401ec615416ebaba5361c98`: four Chromium shards, 147 passed; Ruff/static analysis, Jekyll, Integrity, Security and Context passed; published-site smoke skipped. Graphify #41416369353 and provenance #41416369253 also passed on that exact docs HEAD.

## Local helper model for project-memory compression — prototype

- A small model is used only after a manual click to propose durable project-memory candidates; it does not plan tasks, change active chat model or automatically alter memory.
- The browser cannot choose a model. ALANDI_HELPER_MODEL is an exact operator-configured Ollama tag and blank by default.
- Boundaries: max 80 source facts, per-fact 600 chars, combined input 512–8000 chars, at most 12 candidates of 240 chars, timeout 1–180 s, same inference semaphore, keep_alive=0, no-store response, secret-like input/output filtering.
- Each candidate is rendered via textContent and saved only by explicit user action after rechecking the active project and duplicates.
- Status: merged in PR #69 at `4c9096999fbb3e1265150c420b136066c555285b`; exact-head Gateway/Quality/Chromium/published-site/provenance passed. Live helper model inference remains unverified; the endpoint stays disabled unless the operator configures an exact local Ollama tag.

## Synthetic local-model smoke harness — engineering tool, not model selection (2026-10-30)

- Recovered as `gateway/evals/run_local_model_benchmark.py` with tests in `gateway/tests/test_local_model_benchmark.py`.
- Fixed RU/EN/TH prompts; request count, timeout and response size are bounded; API key is read only from `ALANDI_API_KEY`; redirects are refused to prevent forwarding a bearer token; plain HTTP is restricted to loopback.
- Success means only a non-empty API response. This is not a correctness score, model-quality benchmark, RAM/PSS measurement or first-token benchmark. Gateway Tests passed on the exact PR #123 code head; target-host execution remains a separate gate.
- No helper model is selected or wired by this tool. The main model remains responsible for planning, complex reasoning and synthesis; an optional small helper may only perform bounded tasks after shared RU/EN/TH evaluation and resource measurements.

## Reciprocal Rank Fusion for scoped RAG — merged baseline (2026-10-28)

- PR #77 merged at `91557e4eab1b122341bed578cdf4775ff867007f`; combines FTS5/BM25 and lexical-concept graph candidate rankings using RRF with `k=60` and deterministic tie-breaks.
- No schema/API/dependency change; source/page provenance and scope filtering remain intact; `ALANDI_RAG_ENABLED=false` stays the default.
- The score is only for ordering, not confidence/probability. Automated tests passed on exact PR head; no production-quality improvement is claimed until a labelled >=50-query golden set compares Recall@5, MRR/nDCG, citation correctness, latency and peak RSS.
- Full criteria: `docs/RAG_RRF_EVALUATION_RU.md`, `EVALS.md` EV-RAG-RRF-001, `DECISIONS.md` D-018.


## Повторный аудит рекомендаций владельца — 2026-11-02

Это источники для выборочного переноса инженерных приёмов. Ни один сторонний runtime, framework, plugin или model checkpoint не устанавливается этим аудитом.

| Источник | Проверенное назначение и полезный приём | Решение для aLandi |
|---|---|---|
| [Hermes Agent v0.22.2](https://github.com/NousResearch/hermes-agent/releases) — Threshold v0.22.0 | Универсальный agent runtime с единым loop/tool registry, профилями, plugin catalog, SQLite session state, on-demand tool search, stable release channels и layered security. Security guide описывает authorization, dangerous-command approval, file-write safety, container isolation, MCP credential filtering, prompt-injection scanning, cross-session isolation и input validation. | **Reference only.** Взять deny-by-default для unattended опасных действий, per-action approval, явные session boundaries, progressive tool discovery, проверенные release channels и plugin provenance. Не переносить автономный shell/browser runtime, desktop stack или каталог plugins в статический клиент/FastAPI gateway. |
| [Everything Claude Code (ECC)](https://github.com/affaan-m/ECC) 2.2.3 | MIT-набор с 71 специализированным агентом, 314 skills, hooks, rules, TDD/review, context controls, continuous learning и AgentShield. | **Процессные паттерны выборочно.** Использовать planner → TDD → implementation → fresh-context review → exact verification; security scan и learning только с evidence/confidence. Не устанавливать глобальные hooks/агентов и не переносить их полномочия в проект. Упоминание agent.sys отдельно не идентифицировано — нужен точный URL, если это не ECC. |
| [screenshot-to-code](https://github.com/abi/screenshot-to-code) | MIT; screenshot/mockup/video → HTML/CSS/Tailwind/React/Vue и другие варианты; React/Vite frontend, FastAPI backend, vision models, optional Chromium preview. | **Использовать как метод визуального reverse-spec:** скриншот → измеряемая структура/spacing/type → небольшой HTML/CSS diff → реальный browser screenshot compare. Генерированный код не принимать без проверки semantics, accessibility, responsive behavior, asset provenance и security. Не добавлять отдельный генератор в runtime. |
| [scroll-craft](https://github.com/nateherkai/scroll-craft) | MIT skill для scroll-driven сайтов: разные page grammars, depth/scroll interaction, реальные assets, browser walkthrough, composited contrast, dead-scroll и video-decode checks. | **Только дизайн/QA reference.** Заимствовать review фактических scroll states, per-line contrast и reduced-motion/fallback review. Не добавлять тяжёлый scroll/video эффект без product requirement, performance budget и touch/keyboard fallback. |
| [ThinkRail](https://github.com/JetBrains/thinkrail) | JetBrains incubator, Apache-2.0; host вокруг pi, isolated git worktrees, living specs, typed host/UI contract, approval-aware MCP/extensions, parallel sessions и PR/CI review surface. | **Сильный workflow reference, не runtime dependency.** Изучить isolation by worktree, typed versioned protocol, task-level durable specs и approval for non-read-only MCP. Нашу GitHub branch/PR authority модель не ослаблять; не добавлять второй orchestrator. |
| [DeepTutor](https://github.com/HKUDS/DeepTutor) v1.7.1 | Apache-2.0 learning workspace: tutoring, research, quiz/mastery, inspectable multi-layer memory, source-linked knowledge, modular installation, recoverable chat and agent partners. | **Feature-specific reference.** Заимствовать inspectable evidence-linked learning state, bounded memory, recoverable sessions и modular capability setup, если будет отдельный tutoring/learning сценарий. Не ставить Next.js/Postgres/agent harness в текущий static + FastAPI stack. |
| [Hallmark](https://github.com/nutlope/hallmark) v2 | MIT design skill; preflight reads real project/design tokens/assets, builds hero first, tests eight widths in browser, runs anti-generic-design linter and fresh-context review. | **Применить audit-first к landing review:** сначала прочитать существующие tokens/assets, проверить реальный продукт, собрать screenshots, затем исправлять конкретные дефекты. Не переписывать текущую систему дизайна и не применять destructive redesign без отдельного scope. |
| [qybaihe/bla](https://github.com/qybaihe/bla) | MIT defensive counter-reverse-engineering toolkit: format-native canaries/decoys/resource exhaustion and inspection detection. Сам upstream требует применять только к собственным/разрешённым артефактам и проверять runtime equivalence. | **Не применять к aLandi и не запускать на чужих артефактах.** Анти-анализ/decoy/resource-exhaustion противоречит прозрачности, воспроизводимости, отладке и provenance. Можно использовать только как threat-model input для понимания extraction risks; не как защиту секретов. |
| [Qwenputer](https://github.com/divagr18/qwenputer) | Эксперимент: компилирует CHIP-8/RISC-V CPU в дополнительные слои Qwen3.5; код MIT, опубликованные веса указаны как Apache-2.0. Вычисления выполняются внутри forward pass; это не обычный tool executor и не desktop computer-use agent. | **Research only.** Интересен как эксперимент точного вычисления внутри модели, но не заменяет sandbox/tools, не даёт общего browser/OS control и требует отдельной модели/ресурсов. Не подходит как runtime для текущего VPS 8 GB. |
| [Orbit](https://github.com/constellation-works/orbit) / [Orbit Agents](https://github.com/mukiwu/orbit-agents) | Название неоднозначно. Первый — MIT local-first coding-agent task runtime с worktree sandbox, file locks, plan→execute→review, approval gates и audit log. Второй — MIT desktop scheduler для запуска coding agents по расписанию. | **Не выбирать без уточнения точного продукта.** Для инженерного процесса полезнее первый: durable task + isolated worktree + lock + review + audit. Scheduler не нужен, пока нет отдельной unattended automation задачи. |
| agent.sys | Точное имя/URL не подтверждено. ECC (affaan-m/ECC) имеет собственную систему agents/skills/hooks, но это не доказывает существование отдельного agent.sys. | **Не угадывать и не устанавливать.** Нужен canonical URL, если имелся в виду отдельный проект. |

### Сводное решение

- Самые применимые сейчас техники: exact-head test gates, fresh-context review, on-demand skills/tools, isolated worktrees, approval-aware side effects, screenshot-based visual comparison и browser-based accessibility/contrast checks.
- Эти техники усиливают существующий процесс, но не оправдывают миграцию на React/Next.js, новый agent runtime, второй orchestration layer или новые server dependencies.
- Следующий кодовый slice остаётся заблокирован P0 exact-head Quality/Chromium на текущем PR HEAD; исследовательские находки не должны отвлекать от исправления и закрытия текущих UI acceptance gates.


## Повторная проверка версий и применимость к Landing 2.0 — 2026-11-02

### Harness²: уточнение статуса и безопасный перенос

[Google Research Harness²](https://github.com/google-research/harness2) — отдельный исследовательский framework recursive agent harnessing, а не тестовый runner для веб-сайта. На момент проверки main обновлялся 2026-10-14; в GitHub видно три коммита, semver release/tag не обнаружен. README описывает восемь editable components: system prompt, guardrails, memory, tool guidance, subagents, skills, scripts и plugins.

Цикл Propose–Probe–Compose:

1. Зафиксировать гипотезу и baseline execution.
2. Предложить одно invariant-изменение и, если нужно, одно domain-specific изменение.
3. Выполнить probes на той же задаче и при сопоставимых model/environment settings.
4. Сравнить траекторию, deliverable и diff; принять только подтверждённые изменения либо оставить baseline.
5. Сохранить evidence record и переносить в будущие итерации только уроки, подтверждённые сравнением.

**Ограничения:** paper прямо указывает на stochasticity/shared model bias и то, что execution contrast не доказывает correctness. README предупреждает, что executor network access unrestricted, а Codex запускается с sandbox disabled; для benchmark evaluation нужно ограничить сеть. Полный Harness² runtime/benchmark на VPS или в production CI не запускать.

**Решение для aLandi:** использовать только bounded engineering loop. Для каждого UI patch — hypothesis → deterministic baseline → one small probe → exact Playwright/CI evidence → keep/revert → evidence-backed note. LLM review может быть дополнительным мнением, но не заменяет assertions, security gates, WCAG measurement или human visual review.

### Обновлённые upstream versions

| Проект | Проверенная версия/состояние | Практический вывод |
|---|---|---|
| [Hermes Agent](https://github.com/NousResearch/hermes-agent/releases) | v0.22.5, 2026-10-22; Threshold v0.22.0 от 2026-10-13 | Runtime и delegated/plugin surfaces продолжают быстро меняться. Заимствовать consent, session isolation, deny-by-default и plugin boundaries; не ставить runtime. |
| [Everything Claude Code](https://github.com/affaan-m/ECC/releases) | v2.2.3, 2026-10-01 | Релиз фокусируется на naming и надежности публикации; линейка 2.2 добавляет harness targets, supply-chain hardening и release artifact checks. Заимствовать pinned artifacts/checksum/release verification и fresh-context review. |
| [Hallmark](https://github.com/nutlope/hallmark) | v2.0.0 | Preflight, floor/reflex/finish gates, hero-first, eight-width browser lint, preservation of links/fields/handlers on redesign. Для aLandi: не терять wiring и сохранять визуальные доказательства. |
| [scroll-craft](https://github.com/nateherkai/scroll-craft) | v0.3.0 | Реальные scroll-state walkthroughs, composited per-line contrast, dead-scroll и media fallback checks. Применять только к фактическим scroll/animation surfaces. |
| [DeepTutor](https://github.com/HKUDS/DeepTutor) | v1.7.0 GitHub release (2026-10-28); container registry уже показывает 1.7.1 | Модульная установка и learning workspace интересны как отдельный продуктовый reference; не импортировать стек в текущий клиент. |
| [Orbit Agents](https://github.com/mukiwu/orbit-agents) | README указывает desktop scheduler, Electron/React/SQLite/node-cron | Это локальный cron scheduler, а не task worktree orchestrator. Полезен для будущего explicit scheduled work, но не нужен Landing 2.0. |
| [Orbit](https://github.com/constellation-works/orbit) | Отдельный local-first coding-agent task runtime | Durable task records, sandboxed worktrees, file locks, gated delivery и audit log — процессные reference patterns; не добавлять второй orchestrator. |

### Что уже перенесено в проект

- В `tests/e2e/app.spec.mjs` добавлен визуальный evidence test: шесть viewport widths + mobile/desktop sidebar-open screenshots как Playwright attachments (commit `2869ff3c5edcdc366a22d56972a903f47a14dcb6`). Это не pixel-diff baseline и не замена ручного review.
- В `scripts/quality-agents.mjs` исправлены два over-escaped regex в Jekyll build sentinel (commit `3e6af80aecda329a6f63d5196d67d3c6abc23ec1`). Ошибка была найдена в старом Quality run #41351093423 на SHA `11ffc0bbbe01a068490ca32dd1ea4029517a3120`; exact-head rerun обязателен.
- Не добавлены зависимости, agent runtimes, hosted services, frontend frameworks или production automation.



## Cross-session coding-agent handoff — source-validated pattern (2026-11-02)

**Maturity:** SOURCE-VALIDATED; applied as a bounded repository-documentation pilot. Not yet PROVEN across repeated aLandi chat resumptions.

### Primary-source findings

- [OpenAI Codex compaction prompt](https://github.com/openai/codex/blob/main/codex-rs/prompts/templates/compact/prompt.md) defines a compact handoff around current progress/key decisions, context/constraints/preferences, remaining work and critical references.
- [OpenAI Codex AGENTS.md loader](https://github.com/openai/codex/blob/main/codex-rs/core/src/agents_md.rs) discovers project instructions from the repository root down to the working directory and keeps project scope bounded; nested instructions are assembled in path order.
- [OpenHands conversation persistence](https://docs.openhands.dev/sdk/guides/convo-persistence) restores a conversation by stable ID and persistence directory; persisted state includes event history, agent configuration, execution state, tool outputs, workspace context and activated skills. This is runtime persistence, not a Markdown handoff.
- [Claude Code hooks](https://code.claude.com/docs/en/hooks) expose lifecycle events such as `SessionStart` and `PreCompact`, enabling automatic capture/restore when the host supports those hooks. ChatGPT Projects do not thereby gain those hooks.
- [cc-memory](https://github.com/skymanbp/cc-memory) describes a forced-read progress handoff and reconcile-on-write rather than blind append-only memory. Its SQLite/hooks/MCP architecture is not required for a repository-backed ChatGPT workflow.

### Decision applied to aLandi

Keep the portable, repository-backed design rather than importing another agent runtime:

1. `OLEDUE.md` is the stable trigger/entrypoint and live-state verification protocol.
2. `docs/VOLLEY_LOG.md` remains the chronological evidence trail; reuse its latest actionable checkpoint rather than creating a second handoff database.
3. `ORIENTER.md` and `docs/PROJECT_STATE.yaml` remain concise navigation/state projections, not substitutes for live GitHub reads.
4. A useful checkpoint explicitly records goal/acceptance, done, in-flight/blocked, exact repo/branch/PR/HEAD/base, relevant files/commits, exact checks and tested SHA, decisions/constraints, and one next action.
5. A checkpoint whose recorded HEAD differs from live GitHub is stale; reconstruct from the current PR, commits, diff, tests and CI before acting.

### Limits and evaluation

- No transcripts, private reasoning, secrets or raw user prompts are persisted.
- No hook system, SQLite store, background worker, runtime dependency or new service is introduced.
- The current pilot has not yet demonstrated fewer repeated reads or faster first-useful-change across multiple chats.
- Review after three real `oledue` resumptions: note repeated context requests, stale checkpoint corrections, duplicate work, first-turn useful output and missed constraints. Promote beyond SOURCE-VALIDATED only if evidence shows a repeatable improvement.

