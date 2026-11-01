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
