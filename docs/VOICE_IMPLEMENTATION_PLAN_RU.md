# aLandi — план реализации голосового помощника

**Срез:** 2026-10-28. Документ сводит уже существующие решения проекта; ссылки на upstream и записи в реестре кандидатов не означают, что runtime установлен или включён.

## Что уже есть в репозитории

- `index.md`: два UI-пути — голосовое сообщение с редактируемой транскрипцией и локальный half-duplex диалог; микрофон использует браузерный `MediaRecorder`, затем последовательность ASR → выбранный chat gateway → TTS.
- `gateway/app.py`: авторизованные локальные endpoints `POST /v1/audio/transcriptions` (whisper.cpp CLI), `POST /v1/audio/speech` (Piper CLI), `GET /v1/capabilities`; оба voice-флага выключены по умолчанию. ASR нормализуется через ffprobe/ffmpeg; временные файлы очищаются.
- `gateway/tests/test_audio_transcription.py`, `gateway/tests/test_audio_speech.py`, `tests/e2e/audio-transcription.spec.mjs`: покрывают контракт и пользовательский путь с fake subprocess/mock MediaRecorder/mock HTTP, но не качество настоящих моделей и не реальное оборудование.
- `evals/voice/language_matrix_v2.yaml`: кандидаты и лицензионные блокеры по языкам; SHA-256 весов/голосов пока не зафиксированы.
- `docs/MULTIMODAL_MODEL_STACK_RU.md`: рекомендует исследовать Qwen3-ASR-0.6B для RU/TH, Moonshine streaming для поддерживаемых языков и отдельно проверять каждый TTS voice. Это кандидаты, не автоматическая замена существующего whisper.cpp.
- `docs/LATENCY_CONTRACT.md`: определяет измерения first audible audio, endpoint delay, p50/p95, RTF и peak PSS; численные цели — ещё не результаты.
- `docs/V016_IMPLEMENTATION_CHECKLIST.md`: native audio frames, VAD/AEC, barge-in, voice lifecycle и language/license matrix остаются prototype/blocked/conditional.

## Upstream: что заимствовать

| Компонент | Источник из существующего реестра | Решение для aLandi |
|---|---|---|
| Базовый мультиязычный ASR | [whisper.cpp](https://github.com/ggerganov/whisper.cpp) | Оставить текущий локальный adapter для первого работающего цикла; он уже имеет bounded CLI contract. |
| Альтернативный RU/TH ASR | [Qwen3-ASR](https://github.com/QwenLM/Qwen3-ASR) | Benchmark позже против whisper.cpp по CER/WER, RTF, latency и RAM; не интегрировать до проверки точного checkpoint/hash/license. |
| Потоковый ASR на подходящих языках | [Moonshine](https://github.com/moonshine-ai/moonshine) | Отдельный эксперимент для streaming и браузерного/on-device пути; сначала подтвердить язык, размер WASM/runtime и лицензию конкретных voice assets. |
| Английский streaming | [ASR4ALL-S](https://huggingface.co/futo-org/asr4all-s) | Только английский; лицензия имеет специальные условия, не считать универсальным/коммерчески свободным. |
| TTS | [Piper](https://github.com/OHF-Voice/piper1-gpl) | Текущий локальный adapter сохраняется. Разрешать только предварительно установленные голоса; лицензия движка не заменяет проверку конкретной voice model. |
| VAD | [Silero VAD](https://github.com/snakers4/silero-vad) | Кандидат следующего этапа для определения конца реплики; не называть VAD эхоподавлением. |
| RU ASR fallback | [Vosk models](https://alphacephei.com/vosk/models) | Кандидат для сравнительного теста, не дополнительная зависимость первого релиза. |

## Реализация по этапам

1. **V1 — безопасный half-duplex:** закрепить выбор установленного TTS voice, список отдавать только через авторизованный `/v1/capabilities`; сервер принимает только allowlisted ID и проверяет наличие `.onnx` + `.onnx.json`. Не скачивать голоса автоматически и не отправлять аудио внешнему ASR.
2. **V1 acceptance:** gateway unit tests для выбора/отклонения голоса; E2E с двумя mock voice options; затем полный Gateway + Quality/Chromium/provenance CI.
3. **Реальный runtime:** оператор отдельно устанавливает whisper.cpp, ffprobe/ffmpeg, Piper и конкретные голосовые файлы; фиксирует версии, SHA-256 и лицензии. После этого включаются флаги на сервере и выполняются тесты с реальным микрофоном на целевом браузере.
4. **V2 — разговор в реальном времени:** потоковый ASR, VAD/end-of-turn, потоковый TTS и отмена/перебивание. До включения нужны аудиобуферы с лимитами, измерение self-echo/AEC, проверка гарнитуры/Bluetooth, lifecycle мобильного браузера и нагрузочные замеры.
5. **Выбор ASR:** только после baseline замеров сравнивать whisper.cpp, Qwen3-ASR, Moonshine или Vosk. Для каждого языка отдельно фиксировать WER/CER, холодный/тёплый запуск, RTF, p50/p95 и peak PSS. На 8 GB RAM не загружать несколько тяжёлых моделей одновременно.

## Критерии безопасности

- Голос и документы не включаются автоматически; нет скрытого fallback на стороннего провайдера.
- В API наружу возвращаются только ID/labels реально найденных локальных голосов; paths, secrets и содержимое файлов не выдаются.
- Неизвестный voice ID отклоняется, а не трактуется как путь.
- Аудио, транскрипт и временные файлы не попадают в обычные логи/долговременную память; Stop отменяет запрос и исключает позднее воспроизведение.
- Лицензия движка, модельных весов, voice pack и phonemizer проверяется отдельно. Пока exact SHA-256 и license review отсутствуют, соответствующий артефакт не считается готовым к поставке.

## Связанные исходники проекта

- `evals/voice/language_matrix_v2.yaml`
- `docs/MULTIMODAL_MODEL_STACK_RU.md`
- `docs/LATENCY_CONTRACT.md`
- `docs/TECHNOLOGY_AUDIT_2026-10-21_RU.md`
- `docs/V016_IMPLEMENTATION_CHECKLIST.md`
- `docs/CODER_PACKET.md`
- `gateway/README_RU.md`
