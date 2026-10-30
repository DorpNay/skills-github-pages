# aLandi: полная пошаговая установка и запуск на VPS 8 GB RAM

**Срез проверки:** 24 октября 2026 г.  
**Назначение:** запустить существующий AI Mobile Agent через свой aLandi gateway и Ollama на VPS, настроить точный кэш и проверить цепочку от браузера до модели. Это не руководство по голосовому чату.
**Сначала:** [короткая инструкция владельцу — START_HERE_RU.md](START_HERE_RU.md). Она задаёт порядок действий; этот документ содержит команды и полные технические детали.



## 0.1. Проверка сборки клиента (24.10.2026)

PR #32 с безопасным резервным Markdown-рендерером объединён в `main` (merge commit `31eecce8203073dbc8e0e46b3ac338f64788d59b`). В PR-head workflow #359 прошли все шесть job: context sentinel, Chromium E2E, integrity, security, Jekyll build и опубликованный Pages browser smoke. Это подтверждает клиентскую CI-сборку и браузерную проверку, но **не подтверждает запуск FastAPI gateway, доступность VPS/Ollama, live-провайдеров или реальный deployment gateway**. Перед настройкой сервера владелец должен открыть Actions и проверить актуальный Pages deployment.

## 0. Архитектура и границы

~~~text
AI Mobile Agent / GitHub Pages
  ├─ текущие чат, история, память, skills, Fast / Deep / Research
  └─ IndexedDB exact cache (L0)
              │ HTTPS + Bearer key
              ▼
Cloudflare Tunnel → постоянный hostname
              │ приватный маршрут на VPS
              ▼
aLandi Lite Gateway (FastAPI, 127.0.0.1:8000)
  ├─ auth, allowlist, CORS, body cap, timeout, concurrency=1
  └─ SQLite exact-response cache (L2)
              │ http://127.0.0.1:11434
              ▼
Ollama → одна активная модель → VPS 8 GB RAM
  └─ внутреннее переиспользование модельного префикса/KV (L1)
~~~

Это базовая архитектура для уже существующего приложения: статический UI остаётся на GitHub Pages, весами модели и серверными секретами управляет VPS, gateway обеспечивает единый API. Внешнему миру доступен только HTTPS hostname туннеля. Ollama и gateway не должны слушать публичный интерфейс. PR #29 добавил и CI проверил ручной мост браузерной project memory к server memory graph: загрузка candidate выполняется только по действию владельца, а retrieval ограничен подтверждёнными фактами точного project scope и двумя per-chat opt-in. Сам graph API и мост выключены до настройки и включения gateway flags; живой сервер не проверен.

**В первом проходе не ставим Dify, PostgreSQL, Redis/Valkey, Qdrant/Weaviate, embedding-сервис и несколько агентных runtime.** В AI Mobile Agent уже есть история, память, skills, поиск и многоэтапное исследование. Dify — отдельный необязательный модуль, если позже понадобится самостоятельная визуальная платформа workflow/RAG. Его минимальные требования не гарантируют, что сама платформа и локальная модель стабильно поместятся в 8 GB RAM. Если Dify уже используется, не удаляй контейнеры/базу и не меняй сетевые настройки без аудита зависимостей.

## 1. Аккаунты и финансовые условия

### 1.1 GitHub и Pages

1. Войди в свой существующий аккаунт GitHub.
2. Открой [репозиторий DorpNay/skills-github-pages](https://github.com/DorpNay/skills-github-pages) → Actions.
3. Убедись, что Pages deployment и quality checks зелёные.
4. Открой [действующий AI Mobile Agent](https://dorpnay.github.io/skills-github-pages/). Не создавай вторую копию сайта.
5. Точный origin для CORS — **https://dorpnay.github.io**: без пути /skills-github-pages/ и без завершающего слеша.

GitHub Pages — статический хостинг: он не запускает FastAPI/Ollama и не скрывает секреты, вшитые в публичный исходник. Не записывай server API key, Tunnel token или приватные credentials в index.md, README и публичные workflow. См. [официальное описание GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

### 1.2 Vultr: регистрация и проверка оплаты

Если у тебя уже есть рабочий VPS, используй его после проверки текущих сервисов — новый экземпляр не нужен.

Если VPS/аккаунта ещё нет:

1. Открой [официальную регистрацию Vultr](https://www.vultr.com/register/).
2. Создай аккаунт, подтверди email и выполни проверки, которые показывает кабинет.
3. Открой Billing / Credits / Promotional Code и проверь реально начисленный кредит, покрываемые услуги и срок действия.
4. Не считай коды FLY300VULTR или другие найденные в сети действующими, пока кабинет не подтвердил кредит именно для твоего аккаунта. Не обещай себе бесплатный месяц или отсутствие списаний: промокредит может истечь, цена зависит от тарифа/региона/налогов. Сохрани дату окончания и поставь напоминание. [Официальная документация по биллингу](https://docs.vultr.com/support/platform/billing/faq).
5. Перед Deploy посмотри итоговую стоимость, способ оплаты, налоги и стоимость после промо.
6. Для нового экземпляра цель — Ubuntu 24.04 LTS x64, примерно 4 vCPU / 8 GB RAM и NVMe-диск. Конкретный диск/тариф зависит от региона, поэтому подтверди доступную конфигурацию на странице заказа. Не повышай тариф ради расходования кредита.

### 1.3 Домен и Cloudflare

Для постоянного API-адреса нужен собственный домен, подключённый к Cloudflare. Tunnel не выдаёт зарегистрированный домен навсегда бесплатно; Quick Tunnel — временный hostname, а не постоянная production-точка. [Tunnel guide](https://developers.cloudflare.com/tunnel/get-started/) · [Quick Tunnel limitations](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

1. Если домен у тебя есть, проверь, где управляется DNS, и не ломай существующие записи.
2. Если домена нет, зарегистрируй его у выбранного регистратора. Проверь цену продления, а не только цену первого года.
3. Войди или создай аккаунт [Cloudflare](https://dash.cloudflare.com/sign-up).
4. Добавь домен в Cloudflare, если он ещё не добавлен. У регистратора укажи nameservers, которые покажет Cloudflare; дождись активной DNS-зоны.
5. Включи MFA для Cloudflare, если доступно.
6. Открой Networking → Tunnels. Если Tunnel уже обслуживает Dify или другой сайт, не удаляй его и не заменяй имеющийся маршрут. Можно добавить отдельный hostname или создать ещё один Tunnel.

### 1.4 Требуются ли другие AI-аккаунты?

Для локальной Ollama не нужны ключи Google Gemini, OpenRouter или других облачных поставщиков. ALANDI_API_KEY будет сгенерирован на VPS. Затраты — стоимость самого VPS, если на него не распространяется подтверждённый промокредит. Облачные провайдеры необязательны: регистрация в них нужна только для внешнего маршрута. Актуальные ключи и OAuth PKCE описаны в [PROVIDER_SETUP.md](../PROVIDER_SETUP.md). All-provider live-smoke требует явного подтверждения; реальные запросы расходуют квоту и отправляют короткий prompt внешнему сервису.

Tavily Search — необязательный дополнительный поисковый API: [Tavily](https://tavily.com/). Регистрируйся там только если нужен этот конкретный search provider; текущий интерфейс уже умеет обращаться к открытым источникам и без Tavily. Его ключ вводи только в локальные настройки браузера, не в репозиторий.

## 2. Проверить VPS перед изменениями

Открой экземпляр Vultr → Console / View Console. На начальном этапе можно работать через веб-консоль провайдера.

~~~bash
whoami
cat /etc/os-release
free -h
df -h
ss -lntp
systemctl is-active ollama || true
ollama list 2>/dev/null || true
systemctl --no-pager --full status cloudflared 2>/dev/null || true
systemctl --no-pager --full status alandi-gateway 2>/dev/null || true
~~~

Запиши baseline (без секретов). Если на сервере уже работает Dify, другой gateway или Tunnel, выясни их зависимости до изменения Ollama/firewall.

~~~bash
apt-get update
apt-get install -y ca-certificates curl git openssl nano sudo ufw python3 python3-venv python3-pip
~~~

### Firewall

Cloudflare Tunnel использует исходящее соединение, поэтому публичные входящие порты 8000 и 11434 не требуются.

Если входишь по SSH, до включения UFW проверь текущий порт и разреши его. Для стандартного OpenSSH на 22:

~~~bash
ss -lntp | grep -E ':(22|2222)[[:space:]]' || true
ufw status numbered
ufw allow OpenSSH
ufw default deny incoming
ufw default allow outgoing
ufw status verbose
ufw enable
~~~

Если SSH-порт нестандартный, разреши точный порт до включения firewall. Оставь веб-консоль открытой, пока не убедишься, что доступ сохраняется. Не добавляй ненужные входящие правила, если работаешь только через консоль провайдера. Не открывай 8000 или 11434 в UFW/Vultr Firewall.

## 3. Установить и закрыть Ollama

Если Ollama уже обслуживает существующий Dify/контейнер, сначала сохрани текущий systemd override и проверь, откуда контейнер подключается. Для новой установки возьми установщик с [официальной страницы Ollama](https://ollama.com/download/linux):

~~~bash
curl -fsSL https://ollama.com/install.sh -o /root/install-ollama.sh
less /root/install-ollama.sh
~~~

Проверь загруженный скрипт, затем:

~~~bash
sh /root/install-ollama.sh
systemctl enable --now ollama
systemctl --no-pager --full status ollama
ollama --version
~~~

### 3.1 Контекст и параллелизм

Начни с одного inference worker и контекста 4096. Ollama указывает, что расход памяти зависит в том числе от контекста и параллельных запросов; увеличивай значения только по измерениям. [Официальный FAQ Ollama](https://docs.ollama.com/faq).

Для **новой установки без существующего Docker-клиента Ollama**:

~~~bash
mkdir -p /etc/systemd/system/ollama.service.d
nano /etc/systemd/system/ollama.service.d/override.conf
~~~

Вставь:

~~~ini
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
Environment="OLLAMA_CONTEXT_LENGTH=4096"
Environment="OLLAMA_NUM_PARALLEL=1"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_MAX_QUEUE=4"
Environment="OLLAMA_KEEP_ALIVE=5m"
~~~

Если на этом сервере уже работает Docker-контейнер, который подключается к Ollama через Docker bridge, **не меняй bind вслепую**: loopback может нарушить существующее подключение контейнера. Сначала зафиксируй действующую сеть и спроектируй приватный маршрут для обоих клиентов; не решай это открытием Ollama на 0.0.0.0. Не включай OLLAMA_ORIGINS=*.

Применить свежую конфигурацию:

~~~bash
systemctl daemon-reload
systemctl restart ollama
systemctl --no-pager --full status ollama
ss -lntp | grep 11434
~~~

Для fresh/local варианта ожидается 127.0.0.1:11434. Если появляется 0.0.0.0 или публичный адрес, сначала исправь bind.

### 3.2 Одна модель на старте

Проверь [официальную библиотеку Qwen3.5](https://ollama.com/library/qwen3.5). Базовый тег текущего проекта — qwen3.5:4b. Это стартовый кандидат для 8 GB RAM, а не обещание одинаковой скорости на каждом CPU.

~~~bash
ollama pull qwen3.5:4b
ollama list
ollama show qwen3.5:4b
ollama run qwen3.5:4b "Ответь по-русски одним предложением: Ollama работает?"
ollama ps
free -h
~~~

Сохрани точный тег из ollama list. Если он отличается, синхронизируй ALANDI_ALLOWED_MODELS и модель в UI. Если 4B не проходит memory/latency тест, измерь меньшую модель на тех же задачах. Не загружай несколько моделей без необходимости.

## 4. Установить aLandi Lite Gateway

Используй правильный репозиторий **DorpNay/skills-github-pages**, а не ошибочно использованный ранее DorpNay/myAI.

### 4.1 Пользователь, checkout и venv

Для новой установки:

~~~bash
useradd --system --create-home --home-dir /opt/alandi --shell /usr/sbin/nologin alandi
install -d -o alandi -g alandi -m 0750 /opt/alandi
sudo -u alandi git clone https://github.com/DorpNay/skills-github-pages.git /opt/alandi/skills-github-pages
sudo -u alandi python3 -m venv /opt/alandi/venv
sudo -u alandi /opt/alandi/venv/bin/pip install --upgrade pip
sudo -u alandi /opt/alandi/venv/bin/pip install -r /opt/alandi/skills-github-pages/gateway/requirements.txt
install -d -o alandi -g alandi -m 0750 /var/lib/alandi-gateway
~~~

Если пользователь уже существует, не повторяй блок вслепую:

~~~bash
getent passwd alandi
ls -ld /opt/alandi /opt/alandi/skills-github-pages /opt/alandi/venv /var/lib/alandi-gateway 2>/dev/null || true
~~~

Если репозиторий уже checkout, проверь git status --short, текущую ветку и локальные изменения. Не используй git reset --hard.

### 4.2 Секрет и переменные окружения

~~~bash
openssl rand -hex 32
install -o root -g root -m 0600 /dev/null /etc/alandi-gateway.env
nano /etc/alandi-gateway.env
~~~

Сгенерируй случайный 64-символьный hex-секрет; вставь его как ALANDI_API_KEY. Не пересылай его в чат или GitHub. Добавь в env-файл:

~~~dotenv
ALANDI_API_KEY=ВСТАВЬ_СЮДА_64_СИМВОЛЬНЫЙ_HEX_СЕКРЕТ
OLLAMA_BASE_URL=http://127.0.0.1:11434
ALANDI_ALLOWED_MODELS=qwen3.5:4b
ALANDI_CORS_ORIGINS=https://dorpnay.github.io
ALANDI_MAX_BODY_BYTES=8388608
ALANDI_UPSTREAM_TIMEOUT_SECONDS=300
ALANDI_MAX_INFLIGHT_REQUESTS=1
ALANDI_MODEL_CONTEXT_LENGTH_TOKENS=4096
ALANDI_CACHE_ENABLED=true
ALANDI_CACHE_PATH=/var/lib/alandi-gateway/response-cache.sqlite3
ALANDI_CACHE_TTL_SECONDS=900
ALANDI_CACHE_MAX_ENTRIES=1000
ALANDI_CACHE_MAX_RESPONSE_BYTES=1000000
# Experimental capabilities stay disabled during initial bring-up.
ALANDI_FAST_ROUTING_ENABLED=false
ALANDI_MEMORY_SYNC_ENABLED=false
ALANDI_MEMORY_GRAPH_ENABLED=false
ALANDI_GLOBAL_MEMORY_ENABLED=false
ALANDI_RAG_ENABLED=false
OAUTH_ENABLED=false
~~~

CORS должен быть ровно origin сайта, без пути и без wildcard. Права env-файла:

~~~bash
stat -c '%a %U:%G %n' /etc/alandi-gateway.env
~~~

Ожидается 600 root:root. Реальные ключи не помещаются в исходники и не коммитятся.

### 4.3 systemd-служба

~~~bash
install -o root -g root -m 0644 \
  /opt/alandi/skills-github-pages/gateway/alandi-gateway.service \
  /etc/systemd/system/alandi-gateway.service
systemctl daemon-reload
systemctl enable --now alandi-gateway
systemctl --no-pager --full status alandi-gateway
journalctl -u alandi-gateway -n 80 --no-pager
~~~

Служба должна слушать 127.0.0.1:8000, не внешний интерфейс. SQLite-кэш использует /var/lib/alandi-gateway, доступный пользователю alandi. Если служба не запускается, проверь права, venv, env-файл, точный тег модели и логи; не исправляй проблему открытием порта.

## 5. Проверить локальный API до туннеля

### 5.1 Health и авторизация

~~~bash
curl -i http://127.0.0.1:8000/livez
curl -i http://127.0.0.1:8000/readyz
curl -i http://127.0.0.1:8000/healthz   # совместимый alias /readyz
curl -i http://127.0.0.1:8000/v1/models
~~~

`/livez` подтверждает только, что процесс FastAPI отвечает, и не обращается к Ollama. `/readyz` выполняет короткий read-only `GET /api/tags` к Ollama и возвращает 503, если upstream недоступен; старый `/healthz` оставлен alias readiness для обратной совместимости. Вызов `/v1/models` без токена обязан получить HTTP 401.

Авторизованный каталог:

~~~bash
set -a
. /etc/alandi-gateway.env
set +a
curl --fail-with-body http://127.0.0.1:8000/v1/models \
  -H "Authorization: Bearer $ALANDI_API_KEY"
~~~

В списке должен быть только разрешённый тег. Если нет — сравни ALANDI_ALLOWED_MODELS с ollama list.

### 5.2 Обычный completion и L2 cache

~~~bash
curl -i http://127.0.0.1:8000/v1/chat/completions \
  -H "Authorization: Bearer $ALANDI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "model":"qwen3.5:4b",
    "messages":[{"role":"user","content":"Ответь одним словом: работает?"}],
    "temperature":0,
    "stream":false
  }'
~~~

Ожидается HTTP 200 и завершённый текстовый ответ. Первый одинаковый запрос при finish_reason=stop должен вернуть X-AI-Cache: MISS. Повтори тот же JSON без изменения — ожидается HIT.

Проверь принудительный обход:

~~~bash
curl -i http://127.0.0.1:8000/v1/chat/completions \
  -H "Authorization: Bearer $ALANDI_API_KEY" \
  -H 'Content-Type: application/json' \
  -H 'X-AI-Cache-Bypass: 1' \
  -d '{
    "model":"qwen3.5:4b",
    "messages":[{"role":"user","content":"Ответь одним словом: работает?"}],
    "temperature":0,
    "stream":false
  }'
~~~

Ожидается BYPASS. Кэшируются только нормальные текстовые ответы с явным temperature 0–0.2 и finish_reason=stop. Stream/SSE, tools, structured/multimodal content, запросы без temperature, ошибки и частичные ответы обходят L2.

### 5.3 Статистика и сетевой bind

~~~bash
curl --fail-with-body http://127.0.0.1:8000/admin/cache/stats \
  -H "Authorization: Bearer $ALANDI_API_KEY"
ss -lntp | grep -E ':(8000|11434)[[:space:]]'
free -h
ollama ps
systemctl is-active ollama
systemctl is-active alandi-gateway
~~~

Статистика требует Bearer key и показывает агрегаты, не содержимое ответов. На fresh loopback-конфигурации оба порта слушают только 127.0.0.1.

## 6. Постоянный Cloudflare Tunnel

После успешной локальной проверки:

1. В Cloudflare Dashboard открой Networking → Tunnels.
2. Сначала проверь существующие Tunnel. Если им пользуется другой сервис, не удаляй его; добавь отдельный hostname или создай новый Tunnel.
3. При создании нового выбери cloudflared и Linux, затем архитектуру VPS. Используй команду установки бинарника, которую Cloudflare показывает именно для твоей архитектуры; не копируй пакет для ARM на x86_64 или наоборот.
4. После установки создай службу Tunnel. Чтобы не записать секрет в shell history, запусти shell с выключенной историей и введи токен через скрытый prompt:

~~~bash
set +o history
read -rsp 'Cloudflare Tunnel token: ' CF_TUNNEL_TOKEN; echo
cloudflared service install "$CF_TUNNEL_TOKEN"
unset CF_TUNNEL_TOKEN
set -o history
systemctl enable --now cloudflared
systemctl --no-pager --full status cloudflared
~~~

Выполняй это только для нового connector. Если cloudflared уже работает как служба, не устанавливай второй экземпляр — добавь новый hostname к существующему Tunnel. Сам token храни как пароль.
5. Предпочтительно запускать cloudflared нативно на той же машине. Если connector в Docker, localhost указывает внутрь контейнера — не копируй этот origin без проектирования приватной связки.
5. Добавь Published application route. Domain — подключённый домен, subdomain — например llm. Service URL — http://127.0.0.1:8000, если connector нативный на том же VPS.
6. Сохрани маршрут и дождись статуса Healthy. Затем проверь route реальным авторизованным API-запросом.
7. Не используй Quick Tunnel как постоянный endpoint: URL временный, SSE не поддерживается. Не публикуй порты 8000/11434.

Итоговый hostname может выглядеть как https://llm.example.com. Не меняй DNS приложения GitHub Pages и действующий hostname Dify.

## 7. Подключить AI Mobile Agent

Открой [AI Mobile Agent](https://dorpnay.github.io/skills-github-pages/) в своём доверенном браузере:

1. Нажми Настройки.
2. Выбери провайдера **aLandi Self-hosted Gateway**.
3. Base URL — HTTPS hostname туннеля с суффиксом /v1, например https://llm.example.com/v1.
4. Model — точный тег из Ollama и /v1/models, например qwen3.5:4b.
5. API Key — значение ALANDI_API_KEY из закрытого env-файла, не имя переменной.
6. Сохрани настройки, обнови каталог и проверь соединение, если доступен соответствующий control.
7. Для первого теста выключи поиск, отправь короткое сообщение и убедись, что ответ пришёл от aLandi Self-hosted Gateway.
8. Оставь межпровайдерный fallback выключенным, иначе приватный prompt потенциально может уйти к другому сохранённому cloud provider.
9. Потом проверь поиск и только после него длинный Research.

**Ограничение браузерного ключа:** ключ gateway хранится в localStorage браузера. Это конфигурация для личного использования на доверенном устройстве, а не безопасный общий секрет для всех посетителей публичного сайта. Не передавай ключ другим людям и не используй его на чужом компьютере. Для multi-user сервиса нужен отдельный identity-aware backend/session слой и индивидуальные квоты; одной общей bearer-строки внутри SPA недостаточно. Tunnel token в браузер не вставляется.

## 8. Как устроены уровни кэша

| Уровень | Назначение | Расположение |
|---|---|---|
| L0 | Точный повтор завершённого ответа без сетевого запроса | IndexedDB браузера, TTL 15 минут |
| L1 | Внутреннее повторное использование model prefix/KV | Ollama/runtime, RAM |
| L2 | Точный кэш полного завершённого ответа | SQLite на VPS, TTL 900 секунд |
| Semantic cache | Похожие, но не идентичные запросы | Не включён |

L2 ограничен 1000 записями и 1 MB на ответ. Динамические search/research/tool steps, stream, structured/multimodal content и ответы без явной низкой temperature обходят кэш. Ответ сохраняется только при finish_reason=stop. Ключ строится из нормализованного запроса/маршрута и hash-scope credential; исходный prompt не логируется. Но сам готовый текст ответа может быть чувствительным, поэтому каталог закрыт правами и gateway не предназначен для неограниченного общего доступа.

Проверяй L2 прямым curl: второй запрос в UI может быть пойман локальным L0 раньше, что нормально. Redis/Valkey и семантический кэш не добавляются до измерения false-hit rate, свежести и изоляции пользователей.

## 9. Мониторинг, обновление и откат

Мониторинг:

~~~bash
systemctl is-active ollama
systemctl is-active alandi-gateway
systemctl --no-pager --full status cloudflared
free -h
df -h
ollama ps
ss -lntp | grep -E ':(8000|11434)[[:space:]]'
journalctl -u alandi-gateway -n 60 --no-pager
journalctl -u ollama -n 60 --no-pager
curl -fsS http://127.0.0.1:8000/livez
curl -fsS http://127.0.0.1:8000/readyz
~~~

Перед обновлением проверь git status --short и текущую ветку:

~~~bash
cd /opt/alandi/skills-github-pages
git status --short
git branch --show-current
~~~

Для управляемой production-копии без локальных изменений:

~~~bash
git switch main
git pull --ff-only origin main
/opt/alandi/venv/bin/pip install -r /opt/alandi/skills-github-pages/gateway/requirements.txt
systemctl restart alandi-gateway
systemctl --no-pager --full status alandi-gateway
~~~

Не используй git reset --hard как универсальное исправление. Перед обновлением сохрани закрытую резервную копию env-файла. SQLite cache обычно можно заполнить заново; если сохраняешь его, учитывай WAL и используй SQLite backup API/утилиту либо останови gateway перед согласованным копированием.

Если проблема только в L2, задай ALANDI_CACHE_ENABLED=false в /etc/alandi-gateway.env и перезапусти gateway. Это отключит server cache, но не удалит Ollama weights и историю браузера.

Если latency/RAM плохие, сначала уменьши контекст/длину ответа и проверь активную модель. Не исправляй OOM установкой ещё трёх сервисов. Если прекращаешь платный VPS, выгрузи нужные данные, удали платный instance в панели провайдера и проверь, какие ресурсы дальше тарифицируются.

## 9.1. Проверка обновлённой версии и экспериментальных прототипов

Новые модули из [CODER_PACKET.md](CODER_PACKET.md) добавляют основу трассировки, scoped memory graph, FTS5-поиска, цитат, voice orchestration и tool contracts. PR #27 добавил authenticated memory-graph API, а PR #29 интегрировал с ним opt-in UI мост браузерной памяти: ручная передача фактов как candidate, list/review/delete и retrieval только confirmed-фактов точного проекта при двух per-chat opt-in. Chromium mock E2E и текущие post-merge Quality/Chromium/provenance/Pages checks прошли; gateway tests passed on unchanged base SHA e424d35. API и bridge остаются выключенными до реальной настройки. Микрофон/ASR/TTS/AEC, production CLI sandbox, подключённое исполнение tool DAG и Google Drive Picker UI пока не готовы. Все необязательные flags остаются выключенными.

После merge, из корня проверенной копии репозитория, сначала выполни локальную проверку:

~~~bash
cd /opt/alandi/skills-github-pages
git status --short
git rev-parse --short HEAD
python -m compileall -q gateway observability
python -m pytest -q gateway/tests
python gateway/evals/run_six_layer_eval.py
python scripts/check_license_manifest.py
~~~

Если любой шаг не проходит — gateway не обновляй; сохрани вывод без секретов и открой issue/PR.

Перед изменением systemd unit убедись, что запуск из каталога gateway сохраняет доступ к корню репозитория для trace middleware. Для локального теста в директории gateway используется:

~~~bash
cd /opt/alandi/skills-github-pages/gateway
PYTHONPATH=/opt/alandi/skills-github-pages /opt/alandi/venv/bin/uvicorn app:app --host 127.0.0.1 --port 8000 --workers 1
~~~

Для systemd unit укажи эквивалентный `Environment=PYTHONPATH=/opt/alandi/skills-github-pages` и проверяй статус до переключения трафика. Не копируй секреты в shell history или логи.

После установленного релиза проверяй `/livez`, `/readyz`, `/v1/models` и один обычный чат с Bearer auth; `/healthz` остаётся совместимым alias readiness. Не устанавливай сразу native voice dependencies и не скачивай голосовые модели: manifest пока содержит кандидатов с `ship=false`, hashes не записаны. Никакие voice/OTel/CLI feature flags не включай без целевых eval и отдельного rollback.

## 9.2. Опциональный API структурированной памяти

По умолчанию оставь `ALANDI_MEMORY_GRAPH_ENABLED=false`: это правильный режим для первого запуска. Backend graph API не является хранилищем браузерной памяти проектов — та по-прежнему локальная в браузере.

Если отдельно тестируешь graph API с одного доверенного компьютера:

1. Сделай закрытую резервную копию `/var/lib/alandi-gateway` и `/etc/alandi-gateway.env`.
2. В `/etc/alandi-gateway.env` выставь `ALANDI_MEMORY_GRAPH_ENABLED=true`; БД по умолчанию — `/var/lib/alandi-gateway/memory-graph.sqlite3`.
3. Оставь `ALANDI_GLOBAL_MEMORY_ENABLED=false`, если глобальная память не нужна. Перезапусти службу и проверь `systemctl status alandi-gateway`.
4. Все `/v1/memory/graph/*` routes требуют `Authorization: Bearer <ALANDI_API_KEY>`; ответы используют `Cache-Control: no-store`, body ограничен, неизвестные поля отклоняются.
5. `POST /v1/memory/graph/nodes` принимает `content`, `scope`, `scope_id`, `source_kind`, `source_id` и необязательные provenance/temporal поля. Созданный факт всегда `candidate`; нельзя передать `status=confirmed` при создании.
6. Только `/v1/memory/graph/nodes/{id}/review` может поставить `confirmed` или `rejected`; review пишет audit entry с reason code. `POST /v1/memory/graph/search` по умолчанию ищет только confirmed узлы; всегда передавай `scope` и `scope_id`.
7. `POST /v1/memory/graph/relations` создаёт отношения только внутри одного scope. `SUPERSEDES` использует `old_node_id` и `new_node_id`. `DELETE /v1/memory/graph/nodes/{id}?scope=project&scope_id=...` удаляет узел и `DERIVED_FROM` descendants в этой же области.
8. Global scope требует двойного opt-in: серверный `ALANDI_GLOBAL_MEMORY_ENABLED=true` и `global_opt_in=true` в каждом запросе.

Это single-owner прототип, не multi-user ACL: не раздавай один Bearer key другим пользователям. До подключения к UI нужны per-user identity/ACL, migration/backup strategy и сквозное удаление из evidence/cache/source stores. SQLite/FTS5 secure-delete не гарантирует очистку WAL, backups, browser storage и других БД и не является crypto-erasure SLA. Чтобы выключить эксперимент, выставь оба graph-флага в `false` и перезапусти службу.

## 10. Диагностика

| Симптом | Что проверить |
|---|---|
| HTTPS hostname не открывается | Tunnel status, DNS, hostname, service URL; затем local health |
| CORS в браузере | ALANDI_CORS_ORIGINS ровно https://dorpnay.github.io; проверка OPTIONS и allow headers Authorization / Content-Type / X-AI-Cache-Bypass |
| HTTP 401 | Совпадает ли ключ браузера и ALANDI_API_KEY из env, не обрезался ли он |
| HTTP 503 на старте | Корректный длинный ключ, права env, venv, владелец каталога кэша и systemd journal |
| HTTP 502 / unavailable model | Ollama active, точный тег, OLLAMA_BASE_URL и ALANDI_ALLOWED_MODELS |
| HTTP 429 | Gateway busy: один inference slot, вероятно длинный запрос; не повышай concurrency без memory benchmark |
| BYPASS вместо HIT | Ожидаемо для search/research/tools/SSE/structured content и отсутствующего temperature |
| Повтор снова MISS | Ответ не завершён stop, payload не идентичен, L2 выключен или у службы нет прав в /var/lib/alandi-gateway |
| OOM/зависание | free -h, ollama ps, systemd logs; уменьши context/output; оставь concurrency=1 |
| UI выглядит старым | Проверь Pages deployment workflow, правильный репозиторий и затем hard reload |

## 10.5. Связать проектную память браузера с gateway (опционально)

1. В `/etc/alandi-gateway.env` включи `ALANDI_MEMORY_GRAPH_ENABLED=true`; оставь `ALANDI_GLOBAL_MEMORY_ENABLED=false`. Перезапусти службу и проверь `/livez` и `/readyz`.
2. CORS allowlist gateway должен содержать `https://dorpnay.github.io`. Не открывай Ollama и порт gateway напрямую в интернет.
3. В настройках сайта подключи собственный gateway: Base URL с окончанием `/v1`, точный model ID и bearer key. Серверная память использует именно aLandi gateway/key, не ключ текущего стороннего провайдера.
4. Боковое меню → нужный проект → «Серверная память» → «Обновить список». При 503 проверь feature flag и журнал службы; при CORS-ошибке — origin и URL.
5. «Передать локальные факты» отправляет факты вручную. Они создаются как `candidate`, а не становятся автоматически достоверными. Подтверди только проверенное; отклоняй устаревшее.
6. Для включения в конкретный чат поставь обе галочки: «Использовать память выбранного проекта» и «Разрешить подтверждённые факты серверной памяти». Без любой из них серверный поиск не выполняется. Global memory для этого не требуется.
7. Удаление серверного факта — отдельное действие и удаляет связанные производные узлы. Удаление локального проекта само по себе не стирает серверную память.

**Граница:** это single-owner gateway, не multi-user ACL. Автоматической миграции нет. Если API недоступен, приложение продолжает без серверной памяти и показывает статус.

## 10.6. Бесплатный первый месяц, маленькие модели и генерация изображений

### Бесплатный этап без скрытых расходов

- GitHub Pages остаётся бесплатным статическим интерфейсом. Для локального inference используй уже имеющийся компьютер и [Ollama](https://ollama.com/download); отдельный постоянно работающий VPS не является гарантированно бесплатным.
- Бесплатные API и free tiers — опциональны: у них есть квоты, возможные ограничения и внешняя обработка запросов. Это не эквивалент локальной модели и не резервный маршрут, который можно включать незаметно.
- На первом месяце не создаём платные ресурсы автоматически. Gateway можно держать на своём компьютере и подключать удалённо через отдельный HTTPS-туннель, понимая, что компьютер должен быть включён. Не выставляй Ollama напрямую в интернет.
- Не скачивай сразу много весов. Начни с одной основной модели, зафиксируй точный тег/артефакт и измерь latency, качество и максимальную память.

### Модельная команда: основной агент + один маленький помощник

Официальный [каталог Qwen3.5 в Ollama](https://ollama.com/library/qwen3.5) перечисляет варианты 0.8B, 2B и 4B, а также семейство с мультимодальными возможностями. Это кандидаты для измерений, а не обещание, что любой вариант хорошо заработает на конкретном железе.

1. **Главная модель** — план, сложное рассуждение, решение конфликтов и итоговый ответ.
2. **Маленький помощник** — ограниченные операции: классификация задачи, извлечение фактов из текста, краткое сжатие истории, черновой rerank и проверка структуры JSON.
3. **Не запускать всё параллельно по умолчанию.** На машине с 8 GB RAM сначала выполняй этапы последовательно; не держи две модели в памяти одновременно без замера. Ollama API позволяет задавать `keep_alive`, но фактический расход RAM и выгрузку нужно проверять на целевом устройстве: [официальная API-документация](https://docs.ollama.com/api).
4. Помощник не получает самостоятельных прав на внешние действия. Он возвращает ограниченный результат по схеме; главная модель проверяет его и решает, использовать ли его. Любой новый маршрут включается только после eval-сравнения с режимом «одна модель».

### Генерация изображений — отдельная будущая интеграция

Сейчас в браузерном приложении нет законченного image-generation flow. Один из кандидатов для локального исполнения — [ComfyUI](https://github.com/comfyanonymous/ComfyUI): его серверный API принимает workflow через `POST /prompt`, возвращает `prompt_id`, а историю/изображение можно получать через соответствующие маршруты [официальной документации ComfyUI](https://github.com/Comfy-Org/docs/blob/main/development/comfyui-server/comms_routes.mdx).

Перед реализацией нужно выбрать конкретный checkpoint и формат, проверить лицензию и источник именно этого артефакта, checksum, потребность в VRAM/диске и воспроизводимый тест «запрос → завершённый workflow → возвращённое изображение». Не подключать сторонние custom nodes автоматически. Не обещать, что модель никогда не откажет: приложение может не добавлять собственный скрытый отказной фильтр, но поведение модели и условия внешнего сервиса всё равно различаются.

### Переход после месяца

Перед платным VPS сравни baseline на личном компьютере и целевой сервер на одинаковом наборе задач: p50/p95 latency, peak RAM/VRAM, качество, устойчивость, размер весов, квоты и предполагаемая месячная стоимость. Только затем выбирай GPU/VRAM и переносить модели. Интерфейс должен продолжить работать через тот же OpenAI-compatible gateway URL; никаких платных ресурсов без отдельного решения владельца.

## 11. Чек-лист готовности

- [ ] Реальная цена Vultr, промокредит и срок истечения проверены в кабинете.
- [ ] Домен подключён к Cloudflare; старые DNS/туннели не сломаны.
- [ ] Ollama и gateway работают как службы.
- [ ] Ollama не доступна с публичного интерфейса; /v1/models без токена отказывает.
- [ ] Из опубликованного сайта запрос проходит через aLandi.
- [ ] Межпровайдерный fallback выключен для приватных запросов.
- [ ] Прямой JSON-запрос даёт L2 MISS → HIT; bypass header работает.
- [ ] Gateway tests, quality sentinels, Jekyll build и Chromium E2E прошли на текущем main SHA.
- [ ] Experimental memory/RAG/OAuth/voice flags remain off until their own gates and rollback are reviewed.
- [ ] Если graph API включался для теста, проверены Bearer auth, candidate-first review, scope isolation, cascade delete и double opt-in global scope.
- [ ] Есть резервная копия env, команда отключения L2 и процедура отката.
- [ ] Известно, как остановить/удалить платные ресурсы до истечения кредита.

## Официальные ссылки

- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Vultr registration](https://www.vultr.com/register/) · [billing/credits](https://docs.vultr.com/support/platform/billing/faq)
- [Ollama Linux install](https://ollama.com/download/linux) · [memory/context FAQ](https://docs.ollama.com/faq) · [Qwen3.5 models](https://ollama.com/library/qwen3.5)
- [Cloudflare account](https://dash.cloudflare.com/sign-up) · [Tunnel](https://developers.cloudflare.com/tunnel/get-started/) · [Quick Tunnel limitations](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
- [Dify self-hosted prerequisites](https://docs.dify.ai/en/getting-started/install-self-hosted/docker-compose) — только если принято отдельное решение внедрять Dify.
- [PROVIDER_SETUP.md — ключи и OAuth](../PROVIDER_SETUP.md): облачные провайдеры необязательны, live-smoke требует явного подтверждения.
- [Google AI Studio API keys](https://aistudio.google.com/apikey) · [Groq API keys](https://console.groq.com/keys) · [OpenRouter keys](https://openrouter.ai/keys) · [NVIDIA NIM](https://build.nvidia.com/) · [Hugging Face tokens](https://huggingface.co/settings/tokens) · [Pollinations App Keys/OAuth](https://enter.pollinations.ai/keys).
- [Google server-side OAuth](https://developers.google.com/identity/protocols/oauth2/web-server) — optional; requires client credentials and exact HTTPS callback; Drive Picker UI is not implemented.
