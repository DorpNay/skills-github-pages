# Настройка провайдеров AI Mobile Agent

Инструкция к приложению GitHub Pages: <https://dorpnay.github.io/skills-github-pages/>.

**Не присылайте реальные API-ключи в чат, issue или pull request.** Большинство ключей, введённых в настройки приложения, хранится в локальном хранилище браузера. Для более сильной защиты секретов нужен серверный прокси.

## Pollinations.ai — подключение браузера через OAuth PKCE

1. Откройте [официальную документацию Pollinations](https://gen.pollinations.ai/docs) и страницу [App Keys](https://enter.pollinations.ai/keys).
2. Создайте **App Key**. В поле приложения вставляется публичный ключ с префиксом `pk_`. Не вставляйте вместо него секретный `sk_` ключ.
3. В настройках App Key зарегистрируйте Redirect URI **в точности**:
   `https://dorpnay.github.io/skills-github-pages/`
   Схема HTTPS и завершающий слэш имеют значение. Redirect URI должен совпасть с адресом, на который вернётся пользователь после согласия.
4. В AI Mobile Agent откройте настройки → выберите **Pollinations.ai** → вставьте App Key → нажмите **«Подключить аккаунт Pollinations · PKCE»**. Этот шаг сохраняет App Key и начинает OAuth.
5. Подтвердите доступ в Pollinations и дождитесь возврата в приложение. После этого временный access token будет храниться только в `sessionStorage` текущей вкладки. В `localStorage`, URL и журнал он не записывается.
6. Нажмите **«Проверить соединение и модель»**. Если тест прошёл, лампа загорится зелёным; теперь можно отправлять сообщения.

Приложение просит доступ только к текстовым моделям (`models=text`), с бюджетом **5 Pollen** и сроком **7 дней**. Проверьте значения на экране согласия. Pollinations расходует Pollen согласно модели, бюджету и вашему аккаунту; не следует считать его безлимитным бесплатным API.

Если OAuth не завершается, проверьте точное совпадение Redirect URI в App Key. Ключ с префиксом `pk_` используется как `client_id`; временный `sk_` токен выдаётся только после согласия. После закрытия вкладки сессию может понадобиться подключить заново.

Для серверного smoke-test в GitHub Actions используется отдельный секрет `POLLINATIONS_API_KEY` со значением `sk_…`. Не используйте этот секретный ключ в браузерном поле.

Официальные инструкции: [API docs](https://gen.pollinations.ai/docs), [OAuth/Connect User Wallets](https://github.com/pollinations/pollinations/blob/main/BRING_YOUR_OWN_POLLEN.md).

## Hugging Face Inference Providers

1. Создайте токен в [Hugging Face Token Settings](https://huggingface.co/settings/tokens).
2. Выберите **fine-grained token** и включите право **Make calls to Inference Providers**.
3. В настройках приложения выберите **Hugging Face Inference Providers**, вставьте токен и сохраните настройки.
4. По умолчанию выбирается `openai/gpt-oss-120b:fastest`. Также доступны модели `deepseek-ai/DeepSeek-R1:fastest` и `openai/gpt-oss-120b:cheapest`. Правило `:fastest` выбирает наиболее быстрый доступный маршрут, а `:cheapest` — наиболее экономичный на стороне HF.
5. Нажмите **«Проверить соединение и модель»**.

Base URL: `https://router.huggingface.co/v1`. Полный запрос идёт на `/chat/completions`.

Типовые ошибки: 401/403 — токен, его разрешения или доступ к аккаунту; 402/429 — оплата, квота или лимит; 404 — неверный/недоступный ID модели. Цена и доступность могут отличаться у разных провайдеров HF.

Официальная документация: [Inference Providers](https://huggingface.co/docs/inference-providers/en/index), [Token settings](https://huggingface.co/settings/tokens).

## Groq Cloud

1. Создайте API key в [Groq Console](https://console.groq.com/keys).
2. В настройках выберите **Groq**, вставьте ключ и сохраните.
3. Начальная модель — `openai/gpt-oss-120b`; альтернативы — `qwen/qwen3.8-27b` и `openai/gpt-oss-20b`.

Предложенные старые ID `llama3-8b-8192` и `mixtral-8x7b-32768` не включены в актуальный список приложения: они относятся к прежнему каталогу Groq и не подходят как надёжный default для новой интеграции. Бесплатный доступ и скорость зависят от текущих лимитов аккаунта; высокая скорость не означает неограниченный бесплатный доступ.

Официальные страницы: [Models](https://console.groq.com/docs/models), [Deprecations](https://console.groq.com/docs/deprecations), [Rate limits](https://console.groq.com/docs/rate-limits).

## xAI / Grok

1. Создайте ключ в [xAI Console](https://console.x.ai/).
2. Выберите **xAI · Grok**, вставьте ключ и сохраните.
3. Base URL: `https://api.x.ai/v1`; модель по умолчанию — `grok-4.7`.

**xAI и Groq — разные провайдеры.** Ключ Groq не работает в API xAI, и наоборот.

Официальная документация: [xAI API Reference](https://docs.x.ai/developers/rest-api-reference/inference).

## Cloudflare Workers AI

1. В Cloudflare Dashboard найдите **Account ID** нужного аккаунта.
2. Рекомендуемый путь: на странице **Workers AI** выберите **Use REST API → Create a Workers AI API Token** и сохраните созданный токен. Если создаёте токен вручную, Cloudflare указывает разрешения уровня аккаунта **Workers AI Read** и **Workers AI Edit**. Не путайте их с разрешениями AI Gateway — это другой продукт.
3. В AI Mobile Agent выберите **Cloudflare Workers AI** и заполните поле Account ID — ровно 32 шестнадцатеричных символа.
4. Вставьте API Token в поле API Key и сохраните. Приложение само сформирует Base URL:
   `https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/ai/v1`
5. Нажмите **«Проверить соединение и модель»**. Модель по умолчанию — `@cf/openai/gpt-oss-120b`; доступны также `@cf/openai/gpt-oss-20b` и `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.

Интеграция использует OpenAI-совместимый endpoint `/ai/v1/chat/completions`. Путь `/ai/run/<model_name>`, приведённый в вопросе, — отдельный нативный REST API с другим форматом тела запроса. Для текущего общего маршрутизатора выбран совместимый API; не добавляйте `/chat/completions` в Base URL вручную.

Использование Workers AI может расходовать лимиты/платные единицы Cloudflare — бесплатность не гарантируется.

Официальная документация: [OpenAI-compatible endpoints](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/), [GPT-OSS 120B](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/), [Models](https://developers.cloudflare.com/workers-ai/models/).

## Безопасная проверка через GitHub Actions

Если хотите проверить реальные ключи без отправки их в чат, добавьте нужные значения в **GitHub → Settings → Secrets and variables → Actions**.

| Провайдер | Имя секрета в Actions |
|---|---|
| Gemini | `GEMINI_API_KEY` |
| Groq | `GROQ_API_KEY` |
| xAI | `XAI_API_KEY` |
| Pollinations (серверный smoke-test, нужен `sk_…`) | `POLLINATIONS_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |
| NVIDIA NIM | `NVIDIA_API_KEY` |
| Hugging Face | `HF_TOKEN` |
| Cloudflare | `CLOUDFLARE_API_TOKEN` и `CLOUDFLARE_ACCOUNT_ID` |

Затем откройте **Actions → Provider smoke test → Run workflow**, выберите провайдера и при необходимости задайте точный ID модели. Workflow отправляет один короткий запрос, а в журнал выводит только провайдера, модель, HTTP-статус и длительность; ключи скрываются и не печатаются.

Значения в Actions Secrets доступны самому отдельному workflow при запуске, но **не становятся видимыми сайту GitHub Pages или GitHub-коннектору ChatGPT**. Я не могу напрямую прочитать секреты из репозитория; могу подготовить тест, который использует их на стороне GitHub Actions.

## Что означает статус лампы и «Оффлайн»

- **Серая** лампа — ключ не введён.
- **Янтарная** — ключ задан, но проверка ещё не прошла.
- **Зелёная** — короткий реальный запрос к выбранной модели успешно ответил.
- **Красная** — проверка завершилась ошибкой. Точный HTTP-код виден рядом с индикатором.
- Кнопка **«Оффлайн»** выключает веб-поиск и внешние источники. Она не отключает интернет для облачной модели: любой удалённый API всё равно требует сеть.

Большинство обычных ключей приложения хранится в `localStorage` текущего браузера; это не серверное хранилище секретов. Любой скрипт, работающий в контексте страницы, теоретически может их прочитать. Для более сильной защиты нужен серверный proxy/backend. Pollinations OAuth access token хранится только в `sessionStorage` текущей вкладки и истекает.
