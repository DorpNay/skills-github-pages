# aLandi Superstack — исторический архитектурный baseline (2026-10-19)

> **Статус документа (проверено 2026-10-28):** исторический архитектурный baseline от 2026-10-19, не актуальная инструкция развёртывания и не доказательство того, что стек установлен или проверен на VPS. Для последовательного запуска владельца используй [docs/START_HERE_RU.md](START_HERE_RU.md) и [docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md). Перед выполнением команд перепроверь актуальный main, upstream installer, systemd template, модель, её лицензию и SHA-256. Не запускай удалённый shell installer вслепую и не скрывай ошибки создания пользователя через `|| true`. Ни один feature flag или модель не активируется автоматически.


## 1. Выбранный стек

### Superlite: рабочее ядро
- Сохраняем текущий мобильный статический сайт GitHub Pages; не переписываем большой index.md на React.
- Небольшой FastAPI gateway; Ollama; одна модель в RAM; API через Cloudflare Tunnel/Access.
- Официальная qwen3.5:4b — стартовый baseline, контекст 4096, один параллельный инференс.
- Gateway слушает только 127.0.0.1:8000, Ollama — только 127.0.0.1:11434. Публично публикуется только API hostname.
- Не устанавливаем пока Dify, Postgres, Redis, Qdrant или отдельный embeddings-сервис.

### Superstack: добавляется модулями после замеров
1. Research runtime: LangGraph — один выбранный оркестратор после стабилизации шлюза. Не поддерживаем несколько runtime одновременно.
2. Evidence ledger: URL, заголовок, короткая выдержка, время/инструмент получения, dedup, claim → evidence. История и память объясняют задачу, но не заменяют источники.
3. Память: состояние текущего run, история чата, устойчивые факты/решения и процедурные skills раздельно. Хранить только отобранные полезные факты; не сохранять всю переписку автоматически или скрытые рассуждения.
4. Знания: сначала SQLite FTS5; Docling — офлайн-импорт PDF/Office; FastEmbed + sqlite-vec — опционально после evaluation retrieval на русском и английском.
5. Research workflow: classify → plan → retrieve/fetch → extract evidence → check gaps/contradictions → critique → answer with citations → validate URLs. Сетевые запросы можно ограниченно распараллеливать, генерацию на 8 GB — сначала последовательно.
6. Browser-Lab: начать с существующего безопасного fetch/search; позднее отдельный Playwright/Browser Use runtime с SSRF/private-IP/local-file deny policy.
7. Coding-Lab: отдельный CodingRunner в одноразовом sandbox/worktree, тесты, diff review, approval перед merge; обычному чату не выдавать shell.
8. Promptfoo, Ragas, DSPy/GEPA — offline golden-eval; не запускать лишнего оценщика на каждом пользовательском запросе.

## 2. Дополнительные кандидаты, но не ставить все сразу

| Проект | Предназначение | Решение |
|---|---|---|
| Promptfoo | regression/security evaluation промптов и моделей | добавить в тестовый контур |
| PydanticAI | типизированные контракты агентов | испытать для research-node output |
| Kitaru | durable execution/checkpoints | сравнить с LangGraph checkpointing, не применять два runtime |
| research-os | append-only evidence claims и gates | взять идеи, сравнить реализацию отдельно |
| SearXNG | свой search aggregation endpoint | только если публичные источники не дают достаточного качества |
| Crawl4AI | извлечение страниц / crawling | отдельный изолированный Browser-Lab |
| Graphiti + Kuzu | графовая память | отложить до доказанной потребности в сущностях/связях |
| llama-swap | запуск нескольких локальных model runtimes | только при появлении нескольких моделей |
| LLMLingua-2 | сжатие длинного контекста | измерить потери на golden-set прежде интеграции |
| OpenHands SDK | программирующий агент | только в отдельном sandbox/worktree |

## 3. Что взяли из Everything Claude Code ZIP

Загруженный архив содержит 113 записей и 349 126 байт распакованного содержимого: agents, commands, contexts, hooks, MCP configs, rules, scripts, skills, TDD/review/eval/verification и memory/compaction helpers. Это конфигурационный harness для Claude Code/совместимых сред, не готовый inference server. В ZIP отсутствует сам LICENSE-файл, хотя README показывает MIT badge; большие фрагменты кода не копируем, пока не сверена лицензия конкретной исходной версии.

Принимаем идеи:
- plan → test → implementation → independent review → verify → сохранить только проверенные lessons;
- тест писать до исправления; API contract tests + Playwright E2E;
- security review обязателен для авторизации, секретов, web fetch, tool arguments, HTML rendering;
- компактировать/суммировать контекст на границах этапов;
- progressive disclosure: включать skill только при необходимости;
- continuous learning генерирует кандидатов в правила, но не включает их без проверки человеком и тестами.

Не копируем целиком Claude-specific hooks/transcript paths, все skills/MCP, project-specific инструкции для Synapse/Rust, автоматическое сохранение полных transcript-ов, внешнюю телеметрию с содержимым prompts или безусловную цель 80% coverage. Dетерминированные sentinels и текущие Playwright tests aLandi остаются; добавляется gateway test-suite.

## 4. Длинные сообщения и контекст

Произвольный предел 24 сообщения/24 000 символов заменяется оценкой по context_length выбранной модели с резервом для system prompt и generation. При отсутствии контекстных метаданных применяется fallback 16K tokens. Это приблизительная оценка, не общий tokenizer; реальный лимит модели/RAM, ограничение HTTP тела и bounded tool-loop сохраняются. Большие документы нужно импортировать в RAG/артефакты, а не делать prompt бесконечным. ALANDI_MODEL_CONTEXT_LENGTH_TOKENS должен совпадать с Ollama context length. Начинать с 4096; 8192 пробовать после замеров.

## 5. Пошаговый запуск свежего Ubuntu VPS

### Шаг 1 — подготовить сервер
Обновить ОС, создать отдельного системного пользователя, включить вход по SSH-ключу, закрыть лишние входящие порты. На VPS с 8 GB RAM не держать несколько моделей одновременно.

### Шаг 2 — установить Ollama и baseline
~~~bash
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable --now ollama
ollama pull qwen3.5:4b
ollama list
curl -fsS http://127.0.0.1:11434/api/tags
ollama run qwen3.5:4b "Ответь одним словом: работает?"
~~~

В настройках службы Ollama задайте OLLAMA_CONTEXT_LENGTH=4096 и OLLAMA_NUM_PARALLEL=1; перезапустите службу и замерьте пиковую RAM/latency. Если 4B не помещается или слишком медленна, сравните 2B — не ставьте больше сервисов.

### Шаг 3 — поставить gateway
~~~bash
sudo apt-get update
sudo apt-get install -y git python3 python3-venv python3-pip
sudo useradd --system --create-home --home-dir /opt/alandi alandi || true
sudo mkdir -p /opt/alandi
sudo chown -R alandi:alandi /opt/alandi
sudo -u alandi git clone https://github.com/DorpNay/skills-github-pages.git /opt/alandi/skills-github-pages
cd /opt/alandi/skills-github-pages
sudo -u alandi python3 -m venv /opt/alandi/venv
sudo -u alandi /opt/alandi/venv/bin/pip install -r gateway/requirements.txt
openssl rand -hex 32
~~~

Создайте /etc/alandi-gateway.env вручную, права 600; владелец root. Минимальная конфигурация:

~~~dotenv
ALANDI_API_KEY=<случайный hex-секрет длиной 64 символа>
OLLAMA_BASE_URL=http://127.0.0.1:11434
ALANDI_ALLOWED_MODELS=qwen3.5:4b
ALANDI_CORS_ORIGINS=https://dorpnay.github.io
ALANDI_MAX_BODY_BYTES=8388608
ALANDI_UPSTREAM_TIMEOUT_SECONDS=300
ALANDI_MAX_INFLIGHT_REQUESTS=1
ALANDI_MODEL_CONTEXT_LENGTH_TOKENS=4096
~~~

Не сохраняйте настоящий секрет в репозитории, HTML или GitHub Actions logs.

### Шаг 4 — тестировать локальный endpoint
~~~bash
cd /opt/alandi/skills-github-pages/gateway
set -a; . /etc/alandi-gateway.env; set +a
/opt/alandi/venv/bin/uvicorn app:app --host 127.0.0.1 --port 8000 --workers 1
~~~

Во втором терминале проверьте:
~~~bash
curl -fsS http://127.0.0.1:8000/healthz
curl -fsS http://127.0.0.1:8000/v1/models -H "Authorization: Bearer $ALANDI_API_KEY"
curl -fsS http://127.0.0.1:8000/v1/chat/completions \
  -H "Authorization: Bearer $ALANDI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"qwen3.5:4b","messages":[{"role":"user","content":"Ответь одним словом: работает?"}],"stream":false}'
~~~

### Шаг 5 — systemd и туннель
Файл gateway/alandi-gateway.service — пример; скорректируйте пользователя, пути и права под конкретный VPS. Установите unit в /etc/systemd/system/alandi-gateway.service, затем выполните systemctl daemon-reload и systemctl enable --now alandi-gateway. Настройте Cloudflare Tunnel origin http://127.0.0.1:8000 и Access/rate limits. Не публикуйте порты 11434/8000 и не коммитьте tunnel credentials.

### Шаг 6 — соединить сайт
В AI Mobile Agent: «Свой API», Base URL = https://<ваш-hostname>/v1, Model = qwen3.5:4b, API Key = ALANDI_API_KEY. Для приватных локальных prompts отключить cross-provider fallback, иначе данные могут уйти в другой сохранённый provider. Хранение gateway key в localStorage подходит только для личного прототипа; не используйте это как публичную multi-user auth.

### Шаг 7 — тесты до merge
~~~bash
python -m pip install -r gateway/requirements-dev.txt
python -m compileall -q gateway
python -m pytest -q gateway/tests
node scripts/quality-agents.mjs integrity
node scripts/quality-agents.mjs security
node scripts/quality-agents.mjs context
~~~

Дополнительно должны пройти Jekyll build, Playwright E2E и live-site smoke в GitHub Actions. Эта инструкция сама по себе не подтверждает, что реальный VPS, DNS и Cloudflare Tunnel уже работают.

## 6. Очерёдность после Lite
1. Baseline скорость/RAM/качество.
2. Сравнение official Qwen с конкретными uncensored/Heretic checkpoint-ами по golden-set.
3. SQLite FTS5 и evidence ledger; Docling для offline import.
4. LangGraph research runner с checkpoints и bounded fan-out.
5. FastEmbed/sqlite-vec/Ragas/Promptfoo/DSPy — лабораторные тесты, внедрять только после измеренного выигрыша.
6. Отдельные Browser-Lab и Coding-Lab.
7. На мощном сервере — durable memory store, дополнительные модели и concurrency.

Готовность определяется успешными воспроизводимыми тестами и deployment smoke, а не только наличием файлов или branch.


## 9. Основная инструкция развёртывания aLandi

Полная кликабельная инструкция — [docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md). Она охватывает регистрацию и финансовые ограничения Vultr, домен и Cloudflare Tunnel, Ollama на закрытом localhost, системную службу aLandi gateway, env-файл и секрет, настройку UI, проверки L0/L1/L2, мониторинг и откат.

Руководствоваться нужно именно ею для реального запуска. Отдельная документация OCR/ASR в [MULTIMODAL_MODEL_STACK_RU.md](MULTIMODAL_MODEL_STACK_RU.md) является факультативным исследовательским справочником; голосовой интерфейс и media endpoints не входят в текущую базовую инсталляцию.

## 10. Статус доказанной готовности

GitHub Pages build, quality sentinels, gateway unit tests и Chromium E2E должны пройти в Actions для текущего commit. Успешная сборка сайта не доказывает, что конкретный Vultr VPS и Cloudflare DNS/Tunnel уже настроены: это отдельно проверяется по чек-листу установки.