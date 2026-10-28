# aLandi — голосовой первый запуск (VPS Ubuntu 24.04, x86_64)

**Цель:** после базовой установки gateway выполнить один отдельный сценарий установки голоса, затем пройти короткий acceptance test. Этот документ не утверждает, что VPS уже настроен. Модельные файлы скачиваются на VPS, не в Git и не в GitHub Pages.

## Ожидаемый результат

- Браузер записывает короткую реплику через MediaRecorder.
- Локальный whisper.cpp переводит запись в редактируемый текст. Текст не отправляется модели автоматически.
- Пользователь явно отправляет текст в aLandi gateway/Ollama.
- Piper озвучивает ответ по нажатию кнопки.
- Все три этапа локальны на VPS/gateway; нет автоматического внешнего ASR fallback.
- /v1/capabilities сообщает реальные доступные функции и только те Piper-голоса, для которых есть пара .onnx + .onnx.json.

Это **half-duplex**, не полноценный realtime duplex: потоковый ASR, VAD, AEC и прерывание речи (barge-in) не считаются реализованными лишь потому, что есть UI или policy-прототип.

## Модели: стартовый комплект и расширение

| Роль | Начальный выбор | Почему / ограничение |
|---|---|---|
| Основная беседа | `qwen3.5:4b` | Базовая локальная модель проекта; проверить точный тег через `ollama list`. |
| Быстрые/малые задачи | `qwen3.5:0.8b` или `qwen3.5:2b` | Кандидаты для короткой классификации, извлечения полей и маршрутизации; качество на задачах aLandi пока не измерено. |
| ASR | whisper.cpp `ggml-small.bin` | Мультиязычный начальный baseline; модель около 488 MB, SHA-256 upstream: `1be3a9b2063867b937e64e2ec7483364a79917e157fa98c5d94b5c1fffea987b`. |
| TTS | Piper + явно выбранный voice pack | Установить только голос с подходящим языком и разрешительной лицензией; лицензия движка не заменяет проверку конкретного голоса. |
| ASR challenger | Qwen3-ASR-0.6B | Отдельный эксперимент для RU/TH и других поддерживаемых языков; не добавлять в первый запуск, пока не измерены RAM, latency и WER/CER. |

**Важно для VPS 8 GB:** не загружать основную LLM, helper LLM и Qwen ASR одновременно. Ollama concurrency остаётся 1. Наличие нескольких тегов в каталоге не означает, что все модели должны быть resident в RAM. Для первой работающей системы установите только основной Qwen и локальные ASR/TTS. Малую LLM можно скачать отдельно и подключать как helper после измерения памяти; текущий `ALANDI_HELPER_MODEL` — вспомогательный механизм, а не автоматически работающий агент.

## 1. Предварительные условия

Сначала пройди [основную установку](ALANDI_IMPLEMENTATION_GUIDE_RU.md) до момента, когда gateway работает локально на `127.0.0.1:8000`, Ollama — на `127.0.0.1:11434`, а авторизованный `/v1/chat/completions` возвращает ответ. Не открывай эти порты наружу.

Перед установкой проверь архитектуру, свободный диск и текущие сервисы:

```bash
uname -m
. /etc/os-release && echo "$PRETTY_NAME"
free -h
df -h /var/lib
systemctl status alandi-gateway --no-pager || true
ollama list
```

Дальнейшие команды рассчитаны на Ubuntu 24.04 x86_64. На другой ОС/архитектуре остановись и адаптируй установку, не запускай вслепую.

## 2. Системные зависимости и whisper.cpp

```bash
sudo apt-get update
sudo apt-get install -y build-essential cmake git curl ca-certificates ffmpeg
command -v ffmpeg
command -v ffprobe
```

Собери официальный [whisper.cpp](https://github.com/ggml-org/whisper.cpp) из исходников в отдельном каталоге, следуя upstream README/build instructions. Не устанавливай случайные бинарники из сторонних зеркал. Перед обновлением зафиксируй использованный tag/commit:

```bash
sudo install -d -o "$USER" -g "$USER" /opt/alandi/src /var/lib/alandi-models/whisper
cd /opt/alandi/src
git clone https://github.com/ggml-org/whisper.cpp.git
cd whisper.cpp
git checkout v1.9.5
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release -j2
find build -type f -name 'whisper-cli' -perm -111
```

Если upstream tag недоступен, **остановись и проверь releases**, не заменяй его молча на плавающий `master`. Установи полученный CLI в стабильный путь, соответствующий фактическому результату сборки, например `/usr/local/bin/whisper-cli`; проверь `whisper-cli --help`.

Скачай модель из официального репозитория Hugging Face и проверь SHA-256:

```bash
sudo curl --fail --location --retry 3 \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin \
  -o /var/lib/alandi-models/whisper/ggml-small.bin
echo '1be3a9b2063867b937e64e2ec7483364a79917e157fa98c5d94b5c1fffea987b  /var/lib/alandi-models/whisper/ggml-small.bin' | sha256sum -c -
sudo chown -R alandi:alandi /var/lib/alandi-models/whisper
sudo chmod 0750 /var/lib/alandi-models/whisper
sudo chmod 0640 /var/lib/alandi-models/whisper/ggml-small.bin
```

Если checksum не совпал — не включай ASR. Upstream model card и source: [whisper.cpp ggml-small.bin](https://huggingface.co/ggerganov/whisper.cpp/blob/main/ggml-small.bin).

## 3. Piper TTS и голос

Установи Piper в то же Python virtualenv, которым пользуется gateway, либо в отдельный venv с явно указанным бинарным путём. Не ставь пакет в системный Python:

```bash
sudo -u alandi /opt/alandi/venv/bin/python -m pip install 'piper-tts==1.8.0'
sudo -u alandi mkdir -p /var/lib/alandi-models/piper
sudo -u alandi /opt/alandi/venv/bin/python -m piper.download_voices --help
```

Доступные имена голосов и download syntax проверяй по [официальной инструкции Piper](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/CLI.md). Для первого запуска выбери **один** голос нужного языка из официального каталога; скачай его в `/var/lib/alandi-models/piper`. Для каждого voice pack открой его MODEL_CARD и сохрани имя/версию, URL, лицензию и SHA-256 обеих файлов в локальном инвентаре. Не выбирай голос только по имени: некоторые голосовые данные имеют отдельные ограничения.

Минимальная проверка файлов (замени `VOICE_ID` на точный идентификатор установленного голоса):

```bash
test -s /var/lib/alandi-models/piper/VOICE_ID.onnx
test -s /var/lib/alandi-models/piper/VOICE_ID.onnx.json
sudo -u alandi /opt/alandi/venv/bin/python -m piper --help
```

Проверь реальный синтез до изменения gateway env. Если голос требует отдельного языкового extra (например, Thai phonemizer), установи его только после проверки официальной документации и зависимости; не считай каждый Piper voice совместимым с любым языком.

## 4. Включение голоса в gateway

Сделай резервную копию env-файла. Не вставляй секреты в командную историю, git или этот документ:

```bash
sudo cp -a /etc/alandi-gateway.env "/etc/alandi-gateway.env.backup-$(date +%Y%m%d-%H%M%S)"
sudoedit /etc/alandi-gateway.env
```

Проверь/установи значения с учётом **фактических** путей и voice ID:

```dotenv
ALANDI_AUDIO_TRANSCRIPTION_ENABLED=true
ALANDI_AUDIO_TRANSCRIPTION_BINARY=/usr/local/bin/whisper-cli
ALANDI_AUDIO_TRANSCRIPTION_MODEL=/var/lib/alandi-models/whisper/ggml-small.bin
ALANDI_AUDIO_TRANSCRIPTION_FFPROBE_BINARY=/usr/bin/ffprobe
ALANDI_AUDIO_TRANSCRIPTION_FFMPEG_BINARY=/usr/bin/ffmpeg
ALANDI_AUDIO_SPEECH_ENABLED=true
ALANDI_AUDIO_SPEECH_BINARY=/opt/alandi/venv/bin/python
ALANDI_AUDIO_SPEECH_MODEL=VOICE_ID
ALANDI_AUDIO_SPEECH_VOICES=VOICE_ID=Default
ALANDI_AUDIO_SPEECH_DATA_DIR=/var/lib/alandi-models/piper
```

Не копируй literal `VOICE_ID`; подставь точный ID. Убедись, что оба файла принадлежат `alandi` и доступны на чтение пользователю службы. Если путь к whisper CLI отличается, укажи реальный путь из сборки. Env-файл должен оставаться с правами `600`.

Затем:

```bash
sudo systemctl restart alandi-gateway
sudo systemctl --no-pager --full status alandi-gateway
sudo journalctl -u alandi-gateway -n 100 --no-pager
```

При ошибке запуска верни резервный env и перезапусти службу. Не открывай порты в firewall в качестве обходного решения.

## 5. Проверка end-to-end

Сначала с VPS проверь авторизованный `GET /v1/capabilities` с Bearer key, не печатая сам ключ в общий лог. Ожидается:

- `audio.transcription=true`;
- `audio.speech=true`;
- `audio.speech_voices` содержит выбранный ID;
- `/healthz` возвращает 200;
- `/v1/models` без ключа возвращает 401, с ключом — разрешённый каталог;
- текстовый completion возвращает ответ.

Дальше открой актуальный опубликованный сайт по HTTPS на телефоне:

1. В настройках выбери собственный aLandi gateway, его `https://HOST/v1`, точный ID установленной Ollama-модели и API key.
2. Разреши микрофон для HTTPS сайта.
3. Запиши фразу на русском (затем отдельно проверь Thai/English, если они нужны). Убедись, что текст появился в редактируемом поле; он не должен автоматически отправляться.
4. Исправь распознанный текст и отправь его вручную. Проверь ответ в том же чате.
5. Нажми озвучивание на сообщении. Должен появиться слышимый звук; Stop должен остановить воспроизведение.
6. Перезагрузи страницу и повтори тест, чтобы исключить состояние, случайно оставшееся в памяти вкладки.

Если capability показывает true, но запрос падает, проверь логи gateway и права на файлы; не переключайся на внешний ASR/TTS без отдельного согласия. Сохрани фактические latency: запись/ASR, первый текстовый токен/полный ответ, синтез TTS, peak RAM и число одновременных процессов.

## 6. Малые модели для агентских задач — после первого голосового прохода

Официальный каталог Ollama указывает варианты `qwen3.5:0.8b`, `qwen3.5:2b` и `qwen3.5:4b`; реальные размеры зависят от тега и сборки. Добавлять модели можно так:

```bash
ollama pull qwen3.5:0.8b
ollama pull qwen3.5:2b
ollama list
```

Скачивание само по себе не создаёт маршрутизацию. До подключения маленькой модели к агентским задачам нужно определить узкие схемы вывода (JSON Schema), лимиты токенов/таймаутов, fallback и тестовый набор. Не направляй на маленькую модель приватные данные, если scope/политика ещё не проверены. Не обещай параллельных независимых агентов: существующий gateway сериализует inference, а несколько фаз могут использовать одну и ту же модель.

Qwen3-ASR-0.6B — challenger, не первый обязательный компонент: официальный модельный стек описывает поддержку русского и тайского, но runtime/latency/quality и память на целевом VPS необходимо измерить отдельно. См. [Qwen3-ASR documentation](https://huggingface.co/docs/transformers/en/model_doc/qwen3_asr).

## Что ещё не будет готово после этого шага

Этот setup включает существующие локальные ASR/TTS adapters, но сам по себе не реализует streaming ASR, VAD, acoustic echo cancellation, barge-in, непрерывный duplex, speaker diarization или гарантированную низкую задержку. Это отдельные задачи с измерениями и тестами. Google Drive OAuth, cross-device memory sync и автономное исполнение tools также не включаются этим руководством.

## Upstream источники

- whisper.cpp README/build: https://github.com/ggml-org/whisper.cpp
- whisper.cpp model file + SHA-256: https://huggingface.co/ggerganov/whisper.cpp/blob/main/ggml-small.bin
- Piper install/CLI/voice downloads: https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/CLI.md
- Piper releases and language-specific phonemizer notes: https://github.com/OHF-Voice/piper1-gpl/releases
- Ollama Qwen 3.5 catalogue: https://ollama.com/library/qwen3.5
- Qwen3-ASR: https://github.com/QwenLM/Qwen3-ASR
