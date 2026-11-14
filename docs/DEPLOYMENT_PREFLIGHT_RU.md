# Deployment preflight aLandi: безопасный baseline перед VPS

Этот preflight — **проверка файлов репозитория**, а не live-проверка сервера. Он проверяет `gateway/alandi-gateway.service` и `gateway/.env.example`; он не читает `/etc/alandi-gateway.env`, не подключается к VPS и не проверяет Tunnel, DNS, установленный Ollama, Piper/whisper.cpp или реальные модели.

## Запуск

Из корня репозитория:

```bash
python scripts/check_deploy_preflight.py
python -m pytest -q gateway/tests/test_deploy_preflight.py
```

Проверка должна оставаться частью Gateway CI. Она намеренно требует:
- Uvicorn только на `127.0.0.1:8000`, один worker, отдельного пользователя и закрытые права на env-файл;
- systemd hardening (`NoNewPrivileges`, `PrivateTmp`, `ProtectSystem=strict`, ограниченный `ReadWritePaths`);
- loopback Ollama на `127.0.0.1:11434`, точный HTTPS CORS allowlist без `*`;
- только placeholder API key в `.env.example`, без настоящих секретов;
- ограниченный список моделей и один concurrent request;
- все экспериментальные flags выключены и helper model пустая;
- OAuth encryption key и client secret пусты в example.

## Перед фактическим деплоем

1. Создать резервную копию реального env-файла вне Git и убедиться, что доступ к нему ограничен владельцем службы.
2. Проверить реальный systemd unit и bind address на VPS; не публиковать порт Ollama.
3. Проверить HTTPS Tunnel и CORS с опубликованного сайта, auth/no-token отказ и health/readiness.
4. Включать только одну experimental capability за раз, после тестов, проверки лицензии/SHA-256 артефактов и явного rollback.
5. Пройти smoke test, записать SHA приложения, версии runtime/model, latency/RAM и откат.

**Важно:** зелёный preflight не доказывает, что production-файлы совпадают с шаблоном или что сервис работает на VPS. Не вставляйте реальные ключи в чат, issue или CI-логи.


## GitHub App connector preflight (optional)

Если владелец отдельно включает read-only GitHub App для Coder, проверьте до рестарта:

- GitHub App имеет только Repository permissions: **Contents: read-only**, **Metadata: read-only**; никаких write, Actions, Issues, Pull requests или Administration permissions.
- App установлен только на один owner/account и выбранные репозитории, перечисленные в `GITHUB_APP_ALLOWED_REPOSITORIES`.
- `GITHUB_APP_PRIVATE_KEY` хранится только в `/etc/alandi-gateway.env` с правами 600; PEM line breaks передаются как literal `\\n`. Не помещайте ключ в Git, browser storage, CI variables или логи.
- `GITHUB_APP_ENABLED=false` остаётся baseline до проверки статуса и read-only поведения. Для полного отключения удалите App installation на GitHub; API revoke endpoint отзывает только текущий installation token.
