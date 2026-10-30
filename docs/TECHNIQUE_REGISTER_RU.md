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


## Local helper model for project-memory compression — prototype

- A small model is used only after a manual click to propose durable project-memory candidates; it does not plan tasks, change active chat model or automatically alter memory.
- The browser cannot choose a model. ALANDI_HELPER_MODEL is an exact operator-configured Ollama tag and blank by default.
- Boundaries: max 80 source facts, per-fact 600 chars, combined input 512–8000 chars, at most 12 candidates of 240 chars, timeout 1–180 s, same inference semaphore, keep_alive=0, no-store response, secret-like input/output filtering.
- Each candidate is rendered via textContent and saved only by explicit user action after rechecking the active project and duplicates.
- Status: merged in PR #69 at `4c9096999fbb3e1265150c420b136066c555285b`; exact-head Gateway/Quality/Chromium/published-site/provenance passed. Live helper model inference remains unverified; the endpoint stays disabled unless the operator configures an exact local Ollama tag.

## Reciprocal Rank Fusion for scoped RAG — merged baseline (2026-10-28)

- PR #77 merged at `91557e4eab1b122341bed578cdf4775ff867007f`; combines FTS5/BM25 and lexical-concept graph candidate rankings using RRF with `k=60` and deterministic tie-breaks.
- No schema/API/dependency change; source/page provenance and scope filtering remain intact; `ALANDI_RAG_ENABLED=false` stays the default.
- The score is only for ordering, not confidence/probability. Automated tests passed on exact PR head; no production-quality improvement is claimed until a labelled >=50-query golden set compares Recall@5, MRR/nDCG, citation correctness, latency and peak RSS.
- Full criteria: `docs/RAG_RRF_EVALUATION_RU.md`, `EVALS.md` EV-RAG-RRF-001, `DECISIONS.md` D-018.
