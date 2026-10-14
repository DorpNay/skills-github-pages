# Настройка провайдеров AI Mobile Agent

Эта инструкция относится к опубликованной странице GitHub Pages. Все провайдеры используют собственный ключ. Не вставляйте реальные ключи в issue/PR и не присылайте их в чат.

## Pollinations.ai — браузерное подключение через OAuth PKCE

1. Откройте [Pollinations API docs](https://gen.pollinations.ai/docs) и страницу [App Keys](https://enter.pollinations.ai/keys).
2. Создайте **App Key**. В приложение нужно вставить публичный ключ с префиксом `pk_`; не вставляйте сюда секретный `sk_` ключ.
3. В App Key настройте Redirect URI в точности:
   `https://dorpnay.github.io/skills-github-pages/`
   Схема HTTPS и завершающий слэш важны: URI должен в точности совпадать с зарегистрированным значением.
4. В AI Mobile Agent откройте настройки → выберите **Pollinations.ai** → вставьте App Key → нажмите «Сохранить», если меняли другие настройки → нажмите «Подключить аккаунт Pollinations · PKCE».
5. Подтвердите доступ на странице Pollinations. Запрос ограничивает разрешение текстовыми моделями (`models=text`), бюджетом 5 Pollen и сроком 7 дней; проверьте эти значения на странице согласия. После возврата на сайт временный access token хранится только в `sessionStorage` текущей вкладки; он не сохраняется в `localStorage`, не включается в URL и не пишется в журнал. Нажмите «Проверить соединение и модель».

Если авторизация не завершается, проверьте точное совпадение Redirect URI в App Key и URL сайта. У Pollinations разные публичные API-модели и доступность/расход Pollen; это не гарантированно бесплатный источник вычислений. Встроенный smoke-test в GitHub Actions предназначен для серверного ключа `sk_`, который задаётся только как секрет `POLLINATIONS_API_KEY`, а не для App Key `pk_`.

Официальные инструкции: [Pollinations API](https://gen.pollinations.ai/docs), [OAuth PKCE / Connect User Wallets](https://gen.pollinations.ai/docs).

## Hugging Face Inference Providers

1. Создайте токен в [Hugging Face Token Settings](https://huggingface.co/settings/tokens).
2. Выберите fine-grained token и включите разрешение **Make calls to Inference Providers**.
3. В настройках приложения выберите **Hugging Face Inference Providers**, вставьте токен и сохраните.
4. По умолчанию выбирается `openai/gpt-oss-120b:fastest`; альтернативы берутся из актуальных моделей HF. Суффиксы `:fastest` и `:cheapest` управляют выбором провайдера маршрутизатором HF.
5. Нажмите «Проверить соединение и модель». Ошибки 401/403 обычно означают неправильный токен/разрешение или ограниченный доступ; 402/429 могут быть связаны с биллингом/лимитами; 404 может указывать на недоступную модель или неверный ID.

Endpoint: `https://router.huggingface.co/v1/chat/completions` (в поле Base URL используется `https://router.huggingface.co/v1`).

Официальная документация: [Inference Providers](https://huggingface.co/docs/inference-providers/en/index), [API Tokens](https://huggingface.co/settings/tokens).

## Groq Cloud

1. Создайте API key на [Groq Console](https://console.groq.com/keys).
2. Выберите **Groq**, вставьте ключ и сохраните.
3. По умолчанию используется `openai/gpt-oss-120b`; доступны альтернативы `qwen/qwen3.8-27b` и `openai/gpt-oss-20b`.

Не выбирайте старые ID `llama3-8b-8192` и `mixtral-8x7b-32768`: они были выведены из актуального списка моделей. Бесплатный/разработческий доступ, лимиты и цены зависят от действующих правил аккаунта — высокая скорость не означает неограниченный бесплатный доступ.

Официальные страницы: [Models](https://console.groq.com/docs/models), [Deprecations](https://console.groq.com/docs/deprecations), [Rate limits](https://console.groq.com/docs/rate-limits).

## xAI / Grok

1. Создайте ключ в [xAI Console](https://console.x.ai/).
2. Выберите **xAI · Grok**, вставьте ключ и сохраните.
3. Base URL: `https://api.x.ai/v1`; модель по умолчанию — `grok-4.7`.

xAI и Groq — разные провайдеры. Ключ Groq не работает в endpoint xAI и наоборот.

Официальная документация: [xAI API Reference](https://docs.x.ai/developers/rest-api-reference/inference).

## Cloudflare Workers AI

1. В Cloudflare Dashboard найдите свой **Account ID**.
2. Создайте API Token с разрешением Workers AI Read для нужного аккаунта (сужайте доступ до минимально необходимого).
3. В настройках приложения выберите **Cloudflare Workers AI**, заполните поле Account ID (ровно 32 шестнадцатеричных символа), вставьте API Token и сохраните.
4. Приложение собирает Base URL автоматически:
   `https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/ai/v1`
5. Модель по умолчанию — `@cf/openai/gpt-oss-120b`; также доступны `@cf/openai/gpt-oss-20b` и `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.

Эта интеграция использует OpenAI-совместимый Chat Completions endpoint. Не используйте путь `/ai/run/<model>` как Base URL: это отдельный нативный REST формат, не совместимый с текущим общим request body приложения. Workers AI может тарифицироваться согласно вашему плану и использованию.

Официальные страницы: [OpenAI-compatible endpoints](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/), [GPT-OSS 120B](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/), [Workers AI models](https://developers.cloudflare.com/workers-ai/models/).

## GitHub Actions: безопасная проверка ключей

После слияния добавьте необходимые значения в **GitHub → Settings → Secrets and variables → Actions**. Доступные имена:

| Провайдер | Actions Secret |
|---|---|
| Gemini | `GEMINI_API_KEY` |
| Groq | `GROQ_API_KEY` |
| xAI | `XAI_API_KEY` |
| Pollinations (серверный короткий smoke-test) | `POLLINATIONS_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |
| NVIDIA NIM | `NVIDIA_API_KEY` |
| Hugging Face | `HF_TOKEN` |
| Cloudflare | `CLOUDFLARE_API_TOKEN` и `CLOUDFLARE_ACCOUNT_ID` |

Затем откройте **Actions → Provider smoke test → Run workflow**, выберите провайдера и, при необходимости, переопределите модель. Smoke-test отправляет один короткий запрос, не печатает ключ и возвращает провайдера, модель, HTTP-статус и время. Для Cloudflare Account ID также задаётся как секрет Actions, чтобы не прописывать его в workflow.

Ключи из Actions Secrets доступны этому отдельному workflow на стороне GitHub Actions; они **не становятся доступны самому сайту GitHub Pages или GitHub-коннектору ChatGPT**. Значения секретов не нужно присылать в разговор.

## Ограничения браузерного приложения

- Ключи большинства провайдеров, которые вводятся в настройках, хранятся в `localStorage` этого браузера. Любой скрипт, исполняемый в контексте страницы, может попытаться прочитать их; для более сильной изоляции нужен серверный proxy/backend.
- OAuth-секрет Pollinations — исключение: временный access token лежит в `sessionStorage` вкладки и истекает; при закрытии вкладки сессию может потребоваться подключить снова.
- Кнопка «Оффлайн» выключает веб-инструменты, но не делает облачные LLM локальными: вызов любого облачного провайдера всё равно требует интернет.
- Провайдерный тест отправляет короткий реальный запрос к выбранной модели. Он расходует небольшой объём квоты/биллинга; используйте его осознанно.
