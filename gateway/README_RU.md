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
    uvicorn app:app --host 127.0.0.1 --port 8000 --workers 1

В другом терминале проверьте /healthz и POST /v1/chat/completions через curl. Никогда не коммитьте реальный .env.

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
