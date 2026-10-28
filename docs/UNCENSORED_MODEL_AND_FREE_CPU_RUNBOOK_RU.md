# aLandi — uncensored-модель и запуск на бюджетном CPU

**Назначение:** выбрать конкретную локальную модель, получить воспроизводимый запуск и пройти путь от пустого сервера до первого текста и локального голосового диалога. Это runbook для владельца, а не утверждение, что сервер уже создан или проверен.

## Краткое инженерное решение

- **Первый кандидат для малой RAM:** [Interim Labs Huihui Qwen3.5-2B abliterated GGUF Q4_K_M](https://huggingface.co/interimlabs/InterimLabs-Huihui-Qwen3.5-2B-abliterated-GGUF-Q4_K_M), файл `model.gguf`, размер 1,270,809,024 байта, ожидаемый SHA-256 `aa25eea787afe56a097268f7ed3460cb623e1901d2e89cd2b654cabb42f80636`.
- **Кандидат получше для хоста с RAM не менее 8 GB:** [Interim Labs Huihui Qwen3.5-4B abliterated GGUF Q4_K_M](https://huggingface.co/interimlabs/InterimLabs-Huihui-Qwen3.5-4B-abliterated-GGUF-Q4_K_M), файл `model.gguf`, размер 2,707,514,688 байт, ожидаемый SHA-256 `423f10b6ec2d99c3378143d7cd3b80eb4887b3ed92103103ac59173b404f4f7c`.
- Это готовые abliterated checkpoints: сначала не тратим бесплатные CPU/RAM на самостоятельное изменение весов. Позже можно отдельно экспериментировать с [OBLITERATUS](https://github.com/elder-plinius/OBLITERATUS) на одноразовом GPU runtime и с [FailSpy/abliterator](https://github.com/FailSpy/abliterator).
- Для инференса используем текущий Ollama/gateway контракт. Импорт GGUF требует версии Ollama, поддерживающей архитектуру `qwen35`; перед изменением production сначала проверить версию и тестовую модель. Официальные инструкции: [Ollama import GGUF](https://docs.ollama.com/import), [Ollama Modelfile](https://docs.ollama.com/modelfile).
- Стартовый контекст — 4096 токенов, одна модель, параллелизм 1. Не выставлять рекламируемый в metadata контекст 262k: это не подтверждённая практическая ёмкость и может резко увеличить расход памяти.
- Веса не храним в Git, не скачиваем автоматически при старте сервиса и не отправляем пользовательские документы/промпты в сторонние сервисы из режима self-hosted.

### Что означает uncensored в этой сборке

Abliteration уменьшает определённые направления отказа, но не гарантирует абсолютное отсутствие отказов и не гарантирует сохранение всех навыков. Нужны сравнение полезных задач до/после, корректность, устойчивость, языковое качество и проверка tool-calling. Если модель стала соглашаться чаще, это ещё не означает, что она стала умнее или точнее.

## Часть A. Подготовить бесплатный landing и сервер

### 1. Landing

1. Открой опубликованный клиент: https://dorpnay.github.io/skills-github-pages/.
2. Проверь GitHub Pages deployment: https://github.com/DorpNay/skills-github-pages/actions.
3. Не создавай второй сайт и не публикуй ключи в HTML, GitHub Issues или настройках профиля. Landing на GitHub Pages может оставаться бесплатным; это не означает, что вычисления модели или VPS бесплатны.

### 2. Сервер

1. Если VPS ещё нет, зарегистрируйся у провайдера, например [Vultr](https://www.vultr.com/register/). До создания машины проверь текущую цену, регион, условия пробного кредита и стоимость продления. Не считай кредит постоянным бесплатным тарифом.
2. Создай Ubuntu 24.04 LTS, x86_64. Цель — 4 vCPU и 8 GB RAM для 4B. Если доступно только 4 GB RAM, начни с 2B. Проверь свободный диск: оставь запас для весов, кэша и резервной копии.
3. Зарегистрируйся в [Cloudflare](https://dash.cloudflare.com/sign-up) и подключи домен. Регистрация/домен могут быть платными; используй уже имеющийся домен, если он есть.
4. Создай отдельный Cloudflare Tunnel либо добавь отдельный hostname к существующему. Не удаляй действующие Tunnel и DNS-записи. Целевой маршрут: `https://llm.ТВОЙ-ДОМЕН → http://127.0.0.1:8000`.
5. Не открывай порты 8000 и 11434 в публичном firewall.

### 3. Диагностика до установки

В консоли сервера выполни:

```bash
uname -m
cat /etc/os-release
free -h
df -h
nproc
ss -lntp
```

Продолжай только после проверки, что ОС/архитектура подходят, памяти и диска достаточно, а действующие сервисы и порты понятны. Если Ollama уже установлен, не переустанавливай его вслепую.

### 4. Установить Ollama и проверить версию

Следуй официальной инструкции: https://ollama.com/download/linux

Затем:

```bash
ollama -v
ollama list
```

Нужна версия с поддержкой импорта GGUF и архитектуры Qwen3.5 `qwen35`. Если импорт тестовой модели завершается ошибкой архитектуры, **остановись** и зафиксируй версию/ошибку; не заменяй файлы модели и не меняй production-маршрут наугад.

## Часть B. Загрузить выбранную модель и проверить целостность

Выполняй команды на сервере. Выбери только один профиль: 2B для малого хоста или 4B для RAM от 8 GB. Пример ниже для 4B.

### 5. Скачать файл из указанного upstream

```bash
python3 -m venv /opt/alandi-model-tools
/opt/alandi-model-tools/bin/python -m pip install --upgrade huggingface_hub
mkdir -p /tmp/alandi-model-huihui-4b
/opt/alandi-model-tools/bin/hf download interimlabs/InterimLabs-Huihui-Qwen3.5-4B-abliterated-GGUF-Q4_K_M model.gguf --local-dir /tmp/alandi-model-huihui-4b
sha256sum /tmp/alandi-model-huihui-4b/model.gguf
```

Ожидаемый SHA-256 4B:

```text
423f10b6ec2d99c3378143d7cd3b80eb4887b3ed92103103ac59173b404f4f7c
```

Для 2B скачай из [этого upstream](https://huggingface.co/interimlabs/InterimLabs-Huihui-Qwen3.5-2B-abliterated-GGUF-Q4_K_M), а ожидаемый SHA-256:

```text
aa25eea787afe56a097268f7ed3460cb623e1901d2e89cd2b654cabb42f80636
```

**Если хеш не совпал — не импортируй файл.** Удали только непрошедший проверку временный файл, проверь URL и повтори загрузку. Не добавляй веса в репозиторий.

### 6. Поместить модель в закрытый каталог и импортировать

Создай отдельный каталог модели:

```bash
sudo install -d -o ollama -g ollama -m 0750 /var/lib/alandi-models/huihui-qwen35-4b
sudo install -o ollama -g ollama -m 0640 /tmp/alandi-model-huihui-4b/model.gguf /var/lib/alandi-models/huihui-qwen35-4b/model.gguf
sudo tee /var/lib/alandi-models/huihui-qwen35-4b/Modelfile >/dev/null <<'EOF'
FROM /var/lib/alandi-models/huihui-qwen35-4b/model.gguf
PARAMETER num_ctx 4096
PARAMETER num_predict 512
PARAMETER temperature 0.7
PARAMETER top_p 0.9
EOF
sudo chown ollama:ollama /var/lib/alandi-models/huihui-qwen35-4b/Modelfile
sudo chmod 0640 /var/lib/alandi-models/huihui-qwen35-4b/Modelfile
sudo -u ollama ollama create alandi-huihui-qwen35-4b -f /var/lib/alandi-models/huihui-qwen35-4b/Modelfile
ollama show alandi-huihui-qwen35-4b
ollama show alandi-huihui-qwen35-4b --modelfile
```

Если `ollama create` не принимает опцию `-f` в установленной версии, проверь `ollama create --help` и используй синтаксис, указанный именно установленной версией. Для 2B поменяй каталог, путь и имя на `alandi-huihui-qwen35-2b`.

Проверь, что модель действительно присутствует:

```bash
ollama list
```

### 7. Быстрый локальный тест до подключения landing

```bash
ollama run alandi-huihui-qwen35-4b
```

Отправь:
- «Ответь по-русски одной фразой: чему равно 19 + 23?»
- «Explain briefly what an HTTP 401 means.»
- «ตอบเป็นภาษาไทยสั้น ๆ ว่า 2 + 3 เท่ากับเท่าไร»

Проверь не только отсутствие ошибки, но и правильность ответа, соответствие языка и скорость. Это ручной smoke, не полноценный языковой benchmark.

## Часть C. Подключить gateway и HTTPS

### 8. Указать разрешённую модель в конфигурации gateway

Сначала прочитай полный установочный гайд: [ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md), разделы диагностики, gateway, systemd и локальных проверок. Не создавай второй systemd unit, если текущий уже существует.

В закрытом `/etc/alandi-gateway.env`:
- `OLLAMA_BASE_URL=http://127.0.0.1:11434`
- `ALANDI_ALLOWED_MODELS=alandi-huihui-qwen35-4b` (или выбранный 2B tag)
- `ALANDI_MAX_INFLIGHT_REQUESTS=1`
- `ALANDI_MODEL_CONTEXT_LENGTH_TOKENS=4096`, если эта переменная поддерживается установленной версией gateway
- все экспериментальные флаги оставить `false`.

Создай API key на сервере, например `openssl rand -hex 32`, и храни его только в `/etc/alandi-gateway.env` с правами `600`. Не вставляй его в этот документ или Git. После изменения конфигурации проверь `systemctl restart alandi-gateway` и `systemctl status alandi-gateway --no-pager`. Имя unit сверяй с текущим установленным unit, не угадывай.

### 9. Проверить API локально

Выполни проверки из раздела локального acceptance в [полном runbook](ALANDI_IMPLEMENTATION_GUIDE_RU.md). Обязательный минимум:
- `/healthz` возвращает 200;
- неавторизованный `/v1/models` возвращает 401;
- авторизованный `/v1/models` показывает точный tag модели;
- `/v1/chat/completions` возвращает ответ;
- gateway и Ollama слушают только loopback;
- повтор точного запроса проверяет cache HIT;
- после перезагрузки сервисы автоматически восстанавливаются.

Если модель не видна, проверь `ollama list`, `ALANDI_ALLOWED_MODELS`, unit и журналы. Не ослабляй авторизацию ради обхода ошибки.

### 10. Подключить Cloudflare Tunnel

1. Настрой Published Application Route на `http://127.0.0.1:8000`.
2. Проверь HTTPS hostname с внешнего устройства.
3. Убедись, что прямой доступ к `:8000` и `:11434` снаружи не работает.
4. Проверь неверный API key — ожидается 401.
5. Убедись, что перезапуск Tunnel не требует ручного повторного входа в панель.

## Часть D. Первый запрос через landing

### 11. Подключить aLandi

1. Открой https://dorpnay.github.io/skills-github-pages/.
2. Нажми **Настройки**.
3. В «Режим модели» выбери **Своя модель · aLandi gateway**. Режим бесплатных облачных провайдеров взаимоисключающий; при self-hosted сторонние provider controls блокируются, а скрытый cross-provider fallback выключен.
4. В поле адреса gateway введи `https://llm.ТВОЙ-ДОМЕН/v1`.
5. В поле модели введи точный разрешённый tag, например `alandi-huihui-qwen35-4b`.
6. Вставь API key из закрытого env-файла VPS. Не используй ключ Ollama; это отдельный секрет gateway.
7. Нажми **Проверить и подключить**. Зелёный статус допустим только после реального успешного ответа.
8. Закрой настройки и отправь: «Проверь соединение. Ответь по-русски: чему равно 19 + 23? Покажи только ответ и одно короткое объяснение».
9. Убедись, что ответ равен 42 и в метаданных сообщения указан ожидаемый маршрут/модель. Это первая подтверждённая сквозная проверка; Pages build сам по себе её не заменяет.

### 12. Проверить работу инструментов прямо из чата

После базового ответа попроси: «Создай проект “Проверка aLandi” и добавь в его память заметку “Первый сквозной тест выполнен”». Ожидается вызов локального инструмента, создание проекта в текущем browser profile и добавление заметки. Затем попроси: «Создай диаграмму потока запроса aLandi в формате Mermaid прямо в ответе чата». Текущий клиент возвращает Mermaid-исходник в чат, но ещё не рендерит его как изображение. Если модель отвечает текстом вместо tool call, это фиксируется как провал tool-calling smoke, а не как успешная проверка.

Проекты и их память пока хранятся в браузере текущего профиля. Это не означает серверную синхронизацию и не переносит данные автоматически на другое устройство.

## Часть E. Локальный голосовой диалог

### 13. Установить ASR и TTS

Следуй [VOICE_IMPLEMENTATION_PLAN_RU.md](VOICE_IMPLEMENTATION_PLAN_RU.md) и разделу голосовой установки в [START_HERE_RU.md](START_HERE_RU.md). Сначала проверь целевую ОС/архитектуру, установи ffmpeg/ffprobe, собери или установи whisper.cpp, затем выбери конкретную локальную ASR-модель. Отдельно установи Piper и заранее выбранную пару voice model `.onnx` + `.onnx.json`. Для каждого артефакта запиши upstream, версию и SHA-256 в проектный provenance registry. Не скачивай голоса автоматически при старте сервиса.

### 14. Включить голос только после локального теста

1. Сохрани копию env-файла и проверь текущий commit gateway.
2. Включи только `ALANDI_AUDIO_TRANSCRIPTION_ENABLED=true`, перезапусти gateway и проверь авторизованный `/v1/capabilities`.
3. Запиши короткую фразу. Успех — транскрипт появляется в редактируемом поле, но не отправляется сам.
4. Включи `ALANDI_AUDIO_SPEECH_ENABLED=true` только после проверки установленного Piper и allowlist voice ID.
5. Отправь короткую реплику текстом, нажми озвучивание ответа, проверь правильный голос и возможность остановить воспроизведение.
6. Затем проверь последовательный half-duplex диалог: сказать фразу → проверить/отредактировать транскрипт → отправить → услышать ответ → начать следующую реплику.
7. Не называй это hands-free streaming: VAD, AEC, self-echo, barge-in и длительная работа требуют отдельной проверки на физическом устройстве.

## Часть F. Быстродействие и конкурентоспособность

Для каждого кандидата (2B и, если хватает RAM, 4B) сохрани отдельный JSON benchmark. Используй только синтетические prompts, чтобы не отправлять личные данные.

Минимальная матрица:
- RU/EN/TH: арифметика, краткое объяснение, суммаризация короткого текста;
- код: простая функция с edge cases и тестами;
- следование инструкции: точный JSON-объект без дополнительного текста;
- tool calling: создание проекта/заметки и диаграммы прямо из чата;
- отказоустойчивость: Stop/cancel, неверный ключ, превышение лимита, рестарт сервиса;
- производительность: cold start, тёплый first-token latency, полное время ответа, tokens/s если API возвращает реальный usage, p50/p95, peak RAM/PSS, загрузка CPU и размер контекста;
- память: одна модель, параллелизм 1, контекст 4096; потом отдельно тестировать более длинный контекст.

Сравнивать нужно на одной машине, одинаковых prompts, одинаковом контексте и одинаковом числе повторов. Не сравнивай latency облачного провайдера с локальным CPU без отметки сетевой задержки. Не объявляй модель «лучше» по одной удачной реплике: проверь точность, языки, стабильность и частоту ошибочных ответов. Abliteration и quantization могут улучшать удобство/ресурсный профиль, но не гарантируют лучшего reasoning.

## Открытые upstream-технологии, которые берём в работу

- [OBLITERATUS](https://github.com/elder-plinius/OBLITERATUS): исследовательский pipeline для извлечения направлений отказа (в том числе PCA/mean-difference/SVD и iterative refinement). Не запускать на production-хосте; для эксперимента — одноразовый GPU runtime, telemetry отключена, приватные prompts не использовать.
- [FailSpy/abliterator](https://github.com/FailSpy/abliterator): экспериментальная библиотека для исследования активаций/направлений. Её README прямо описывает workflow с кэшированием активаций; это исследовательский инструмент, не runtime-зависимость.
- [llama.cpp](https://github.com/ggml-org/llama.cpp): CPU-ориентированный inference runtime, GGUF и квантизация; [importance matrix](https://github.com/ggml-org/llama.cpp/blob/master/tools/imatrix/README.md) может помочь сохранить качество при квантизации. [Speculative decoding](https://github.com/ggml-org/llama.cpp/blob/master/docs/speculative.md) имеет смысл только если draft-модель и target вместе помещаются в RAM и замер показывает выигрыш.
- Не добавлять второй inference runtime в production, пока текущий Ollama-путь не прошёл acceptance. Альтернативу llama.cpp тестировать отдельно с точным API-контрактом и rollback.

## Финальный чек-лист владельца

- [ ] Pages deployment успешен; сайт открывается.
- [ ] Сервер и цена/условия проверены; RAM и диск достаточны.
- [ ] Ollama поддерживает архитектуру модели; импорт завершён; SHA-256 совпал.
- [ ] Модель отвечает локально на RU/EN/TH smoke prompts.
- [ ] Gateway authorizes requests, exact model tag allowlisted, no public model port.
- [ ] HTTPS Tunnel работает после перезапуска; неверный ключ получает 401.
- [ ] Landing подключён к self-hosted mode и выдаёт реальный ответ ожидаемой модели.
- [ ] Проект/заметка и Mermaid tool вызваны из обычного чата; ограничения browser-local storage понятны.
- [ ] ASR/TTS артефакты установлены и проверены; запись не отправляется без явного действия.
- [ ] Полный half-duplex голосовой диалог прошёл на целевом устройстве.
- [ ] Benchmark JSON сохранён; cold/warm latency, p50/p95, RAM/PSS и качество зафиксированы.
- [ ] Backup и rollback проверены; экспериментальные флаги включены только для проверенных функций.
