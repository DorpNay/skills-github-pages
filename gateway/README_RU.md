# aLandi Lite Gateway

Минимальный аутентифицированный шлюз между статическим сайтом и частной Ollama. Он не исполняет tools, не читает произвольные URL, не сохраняет prompts и не включает агентный runtime.

## Возможности

- GET /healthz, GET /v1/models и POST /v1/chat/completions; JSON и SSE streaming.
- Bearer auth, allowlist модели, CORS allowlist, проверка messages, лимит тела по умолчанию 8 MiB и bounded concurrency.
- Метаданные context_length в /v1/models; значение обязано совпадать с контекстом, реально настроенным для Ollama.
- Prompts не пишутся в логи; upstream errors не раскрывают raw body.

## Локальная проверка

Требуется Python 3.12+, Ollama и модель, загруженная под точным тегом.

    python -m venv .venv
    . .venv/bin/activate
    python -m pip install -r gateway/requirements-dev.txt
    python -m pytest -q gateway/tests
    python -m compileall -q gateway
    ollama pull qwen3.5:4b
    cd gateway
    cp .env.example .env
    openssl rand -hex 32
    set -a; . ./.env; set +a
    PYTHONPATH=.. uvicorn app:app --host 127.0.0.1 --port 8000 --workers 1

В другом терминале проверьте /healthz и POST /v1/chat/completions через curl. Никогда не коммитьте реальный .env.

## Полный пакет прототипов и тестов

- Контракты voice, memory graph, scoped evidence, tools, SSRF и approvals перечислены в `../docs/CODER_PACKET.md`.
- Реальные тесты: `python -m pytest -q gateway/tests`; deterministic prior smoke eval: `python gateway/evals/run_six_layer_eval.py`.
- License ship gate: из корня репозитория `python scripts/check_license_manifest.py`. Vulture формирует report only — код автоматически не удаляется.
- `gateway/voice/*` содержит интерфейсы/policy prototypes. Микрофон, ASR/TTS, AEC, native ONNX/Rust runtime и voice latency benchmark не подключены.
- `observability/otel_config.py` требует явного вызова и optional OTel packages; никакой exporter не запускается сам по себе.
- Feature flags по умолчанию выключены. Merge не означает, что gateway уже развернут на VPS.

## VPS

Ожидаемая раскладка — код в /opt/alandi/skills-github-pages, virtualenv в /opt/alandi/venv, секреты в /etc/alandi-gateway.env с правами 600, FastAPI только на 127.0.0.1:8000 и Ollama только на 127.0.0.1:11434. Файл alandi-gateway.service — пример: адаптируйте пользователя, пути и права под свой сервер. Не публикуйте 11434/8000 прямо в интернете. Публикуйте только API через Cloudflare Tunnel/Access и настройте rate-limit.

## Подключение сайта

В AI Mobile Agent выберите «Свой API»:

- Base URL: https://<ваш-hostname>/v1
- Model: qwen3.5:4b
- API Key: значение ALANDI_API_KEY, введённое в локальные настройки браузера

Выключите cross-provider fallback для приватных запросов: иначе запрос может уйти другому сохранённому поставщику. Ключ в static-site localStorage подходит только для личного прототипа; не раздавайте его и не считайте такую схему multi-user авторизацией.

На VPS с 8 GB RAM начните с OLLAMA_CONTEXT_LENGTH=4096 и OLLAMA_NUM_PARALLEL=1. Повышайте только после замеров. У Ollama OpenAI-compatible API есть ограничения; не полагайтесь на tool_choice без проверки выбранной модели/runtime. HTTP body cap и контекст модели конечны.


## Точный кэш ответов

- SQLite-кэш хранится на диске VPS в /var/lib/alandi-gateway/response-cache.sqlite3; сохраняется только готовый JSON-ответ. Исходный запрос не лежит в базе как ключ: используется SHA-256 хеш полного запроса и отдельный hash-scope ключа.
- По умолчанию TTL 900 секунд, максимум 1000 записей и 1 MB на ответ. Кэшируются только полные plain-text ответы finish_reason=stop для запросов с явно заданным temperature от 0 до 0.2.
- Stream/SSE, tools, tool roles, мультимодальный/структурированный контент, пропущенный temperature, ошибки и частичные ответы обходят кэш. Для принудительного обхода передайте X-AI-Cache-Bypass: 1 или Cache-Control: no-cache.
- Ответы содержат X-AI-Cache: HIT|MISS|BYPASS; CORS открывает этот заголовок странице https://dorpnay.github.io. GET /admin/cache/stats требует тот же Bearer key и возвращает только статистику.
- Это кэш для личного gateway, не multi-user системы. Он хранит текстовые ответы, которые могут содержать приватные сведения. Ограничьте права каталога и доступ к VPS. Для отключения задайте ALANDI_CACHE_ENABLED=false и перезапустите службу.


## Экспериментальные bounded-функции (по умолчанию выключены)

- `ALANDI_FAST_ROUTING_ENABLED=false`: `gateway/routing.py` умеет отвечать шаблоном только на точную короткую фразу из allowlist; сложные запросы отправляются в main model.
- `ALANDI_MEMORY_SYNC_ENABLED=false`: `GET /v1/memory/state/{conversation_id}` и `POST /v1/memory/delta` используют versioned bounded JSON Patch; append-only изменения коллекций используют компактное `add /-`, stale revision возвращает 409. Пока scope — отдельная беседа, не multi-user хранилище.
- `ALANDI_MEMORY_GRAPH_ENABLED=false`: authenticated API для scope-filtered graph: `GET/POST /v1/memory/graph/nodes`, `POST /v1/memory/graph/search`, `POST /v1/memory/graph/relations`, `POST /v1/memory/graph/nodes/{id}/review`, `DELETE /v1/memory/graph/nodes/{id}`. Новые факты всегда начинаются с `candidate`; только отдельная review-команда ставит `confirmed` или `rejected`. Все маршруты требуют Bearer auth и `Cache-Control: no-store`. Это single-owner gateway, не multi-user ACL.
- `ALANDI_GLOBAL_MEMORY_ENABLED=false`: дополнительный предохранитель. Global-scope операции требуют одновременно server flag и `global_opt_in=true` в запросе. Для project/conversation scope этот флаг передавать нельзя.
- `ALANDI_RAG_ENABLED=false`: `POST /v1/rag/ingest` и `POST /v1/rag/retrieve` реализуют SQLite FTS5 + lexical concept graph с source URI/page metadata. Это baseline, не полный Microsoft LazyGraphRAG.
- `ALANDI_SEARXNG_ENABLED=false`: optional `GET /v1/search/web?q=...&limit=...` uses only the operator-configured fixed `ALANDI_SEARXNG_BASE_URL`; Bearer auth, 300-character query limit, bounded results/response, no redirects, HTTPS-only result links and `Cache-Control: no-store`. SearXNG is not installed or enabled by this repository change; configure it only after deploying and validating a private instance.
- `ALANDI_AUDIO_TRANSCRIPTION_ENABLED=false`: `POST /v1/audio/transcriptions?lang=auto|ru|en|th` принимает raw audio body, требует Bearer auth, ограничивает размер, длительность (через локальный `ffprobe`) и время, хранит файл только во временном каталоге и вызывает настроенный локальный `whisper.cpp` CLI через argv без shell. Нужны заранее установленные `whisper-cli` и совместимая локальная модель; endpoint выключен по умолчанию, ничего не скачивает и не обращается к внешнему ASR. Проверяйте лицензию и размер модели отдельно.
- `GET /admin/runtime` (Bearer auth) показывает поля инвентаря моделей из `/api/ps` и best-effort current/peak RSS самого gateway и процессов Ollama через read-only Linux procfs (`gateway/host_metrics.py`). Поля `size`/`size_vram` — не KV-cache usage; права на procfs могут отсутствовать, тогда метрики возвращаются как null. Никакого автоматического выселения нет.
- `OAUTH_ENABLED=false`: backend Google OAuth Code+PKCE routes `/oauth/google/initiate`, `/oauth/google/callback`, `/oauth/google/status`, `/oauth/google/refresh`, `/oauth/google/revoke`. `gateway/security/oauth_vault.py` encrypts tokens with Fernet; callback never returns tokens. Real Google credentials and exact HTTPS callback still need configuration; Google Picker/file import UI isn't implemented. `OAUTH_ENCRYPTION_KEY` must be generated once and stored outside Git, separately from the DB.

Все экспериментальные флаги остаются `false` по умолчанию. Граф памяти может быть включён отдельно только после проверки этого API и резервного копирования его SQLite-файла; глобальная память требует двойного opt-in. Перед включением любого флага прогоните `python -m pytest -q gateway/tests` и изучите [шесть инженерных пластов](../docs/SIX_LAYER_ENGINEERING_RU.md) и [журнал решений](../DECISIONS.md). Не включайте одновременно несколько новых функций во время экспериментального сравнения. Все результаты в README — реализованный код локально, а не доказательство развертывания на VPS.
