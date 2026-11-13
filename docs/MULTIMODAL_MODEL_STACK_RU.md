# Мультимодальный стек aLandi / AI Mobile Agent

**Срез первоисточников: 21 октября 2026 г.** Это инженерная оценка для нашего проекта, а не универсальный рейтинг моделей. Все benchmark-цифры ниже — заявления авторов; датасеты, устройства и процедуры отличаются, поэтому они не дают прямого общего рейтинга.

## Решение

**Acquisition checkpoint (2026-11-05):** the lightweight RU-only `vosk-model-small-ru-0.22` baseline is downloaded and hash-verified (`961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`, 46,236,750 bytes, Apache-2.0 per Vosk catalog). ZIP CRC and path safety checks passed. It is **not installed or benchmarked**. Keep Qwen3-ASR-0.6B as the primary multilingual RU/TH candidate; Vosk is a compact Russian baseline for the eventual same-audio bake-off, not a product/runtime decision.

Не скачивать и не запускать все модели на одном сервере. Текущий продукт — статический сайт GitHub Pages AI Mobile Agent v10.0, skills по требованию и небольшой FastAPI gateway к частной Ollama. Плановый VPS имеет 8 GB RAM, а gateway ограничивает параллелизм. В текущих UI и gateway нет готовых media upload/ASR/OCR endpoints или TTS.

- **Обычный OCR:** PP-OCRv6 Tiny/Medium — первый лёгкий кандидат, но только для языков из опубликованного перечня (китайские письменности, английский, японский и преимущественно латинские языки). Не считать русский и тайский поддержанными автоматически.
- **Сложные PDF, таблицы, формулы и формы:** сравнить GLM-OCR и PaddleOCR-VL-1.6 на одном тестовом наборе. Для многоязычного layout добавить Surya 2 после проверки лицензии весов. Выбрать одного победителя.
- **Мультиязычная речь, в том числе русский и тайский:** первым тестировать Qwen3-ASR-0.6B. Upstream перечисляет 30 языков и 22 китайских диалекта, включая русский, тайский и вьетнамский, с offline/streaming режимами. Это кандидат, не гарантия real-time на CPU VPS.
- **Низкая задержка на определённых языках:** Moonshine Tiny/Small; ASR4ALL-S для английского; ZIPFORMER VI для вьетнамского; Canary 180M для английского, немецкого, французского и испанского.
- **Сложные схемы и графики:** dots.mocr и LightOnOCR-3-4B — отдельные испытания на более мощном хосте. Вариант 4B не помещается в 8 GB RAM в обычной BF16-конфигурации: только веса приблизительно требуют объём, равный всей физической памяти.
- **RAG:** заимствовать из RAG-Anything модель обработки «формат → структурные блоки → происхождение страницы/области → retrieval → цитата», но не устанавливать полный стек зависимостей в production.
- **UI:** добавить специализированный skill, который загружается только в «Глубоко» / «Умное исследование» при мультимодальном запросе. Это не значит, что голосовой интерфейс или OCR endpoint уже реализованы. Дизайн сайта не переделывать.

## 1. OCR / понимание документов

| Модель | Что подтверждает первоисточник | Лицензия и ограничения | Решение |
|---|---|---|---|
| [PP-OCRv6 Tiny / Medium](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md) | Семейство 1.5M–34.5M параметров; Tiny для edge/IoT, Medium для серверных сценариев. Авторы заявляют 49 языков для Tiny и 50 для Small/Medium; список состоит в основном из латинских языков плюс китайский, английский и японский. | Внутренние benchmark-данные PaddlePaddle не являются независимым сравнением с другими наборами. Для релиза фиксировать версию весов, runtime и их лицензии. Не заявлять русский/тайский без точного подтверждения в модели. | **Первый лёгкий OCR** для подходящих письменностей; для русского/тайского — отдельный fallback и тест. |
| [GOT-OCR 2.0](https://github.com/Ucas-HaoranWei/GOT-OCR2.0) | Около 580M параметров; сцены и документы, формулы, таблицы, графики и форматированный вывод. | Официальные инструкции используют CUDA 11.8, PyTorch 2.0.1 и FlashAttention; есть community CPU/llama.cpp варианты. Code/data licensing разделены — проверить конкретные веса. | **Не первый выбор** для CPU-first VPS; оставить как baseline для отдельного сравнительного теста. |
| [Surya 2](https://github.com/datalab-to/surya) | Около 650M параметров; OCR, layout, reading order, таблицы. Авторы публикуют внутренний benchmark для 91 языка, включая русский. Скорость 5 страниц/с относится к RTX 5090, не к CPU VPS. | Код Apache-2.0, но веса под модифицированной AI Pubs Open Rail-M лицензией с коммерческими ограничениями. Inference требует vLLM GPU или llama.cpp для CPU/Apple Silicon. | **Сильный многоязычный challenger**, но сначала юридическая проверка весов, языковой набор и реальная RSS/latency. |
| [GLM-OCR](https://github.com/zai-org/glm-ocr) | VLM около 0.9B; layout, сложные таблицы/формулы, печати и извлечение полей. Поддерживает Ollama/vLLM/SGLang. Upstream заявляет 94.62 на OmniDocBench v1.5. | GitHub отмечает Apache-2.0; отдельно проверить checkpoint и PP-DocLayout-V3/runtime. Поддержка Ollama не обещает приемлемую CPU-задержку на нашем хосте. | **Кандидат №1 для сложного документа** за счёт пути интеграции с Ollama; сначала benchmark. |
| [PaddleOCR-VL-1.6](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6) | Около 0.9B; документный парсер для текста, формул и таблиц. Выпуск — 28 мая 2026; авторы заявляют 96.33% на OmniDocBench v1.6. | Быстрые официальные пути часто GPU/vLLM-ориентированы; CPU backend существует, но его необходимо проверять отдельно. Benchmark v1.6 нельзя напрямую сравнивать с OmniDocBench v1.5 GLM-OCR. Зафиксировать лицензию выбранного веса и extras. | **Кандидат №2**. Сравнить с GLM-OCR на тех же данных; оставить только одного в production. |
| [HunyuanOCR-1.5](https://github.com/Tencent-Hunyuan/HunyuanOCR) | Релиз в июле 2026; document parsing, spotting, извлечение данных, перевод текста с изображения; объявлены DFlash speculative decoding и llama.cpp/PC deployment. | GitHub указывает Other/Tencent Hunyuan Community terms — не эквивалент MIT/Apache. Не использовать до проверки условий точных весов. | **Эксперимент третьей очереди**, только если GLM/Paddle не справляются с конкретной задачей. |
| [dots.ocr → dots.mocr](https://github.com/studio-dots-ai/dots.ocr), [веса dots.mocr](https://huggingface.co/dots-studio/dots.mocr) | dots.ocr — около 1.7B. 19 марта 2026 г. авторы переименовали dots.ocr-1.5 в **dots.mocr**. Акцент на многоязычном layout, экранах и преобразовании графиков/диаграмм в SVG. | Репозиторий помечен MIT; проверить точный checkpoint и зависимости. Большие benchmark-результаты upstream — не доказательство хорошей CPU-производительности. | **Отложить** для GPU/мощного хоста; не держать постоянно на 8 GB. |
| [DeepSeek-OCR / DeepSeek-OCR2](https://github.com/deepseek-ai/DeepSeek-OCR) | Репозиторий сообщает выпуск DeepSeek-OCR2 в январе 2026 г.; исходная версия исследует OCR и optical compression. Примеры рассчитаны на CUDA/PyTorch/vLLM; Transformers путь использует trust_remote_code. | Код репозитория помечен MIT, но закрепить конкретную версию весов и runtime. trust_remote_code — отдельная граница доверия. | **Не основной production-кандидат**; только отдельное исследование на изолированном окружении, не копировать старые CUDA-команды вслепую. |
| [LightOnOCR-3-4B](https://huggingface.co/lightonai/LightOnOCR-3-4B) | Семейство LightOnOCR-3 опубликовано в октябре 2026; варианты 0.8B/1B/4B. 4B обрабатывает текст, layout/boxes, изображения и данные диаграмм. | Карточка указывает Apache-2.0. Для 4B в BF16 только веса требуют примерно 8 GB, без runtime, промежуточных буферов и контекста. | **Не ставить на 8-GB VPS**. Меньшие варианты 0.8B/1B можно отдельно оценить. |

### OCR: как принимать решение

На одном и том же локальном наборе проверить CER/WER, exact match цифр/дат, точность полей и ячеек таблиц, объединения ячеек, порядок чтения, русский/английский/тайский, диакритики, смешанные языки, перспективу/поворот/шум, p50/p95 задержки, cold start, peak RSS и диск. Для моделей использовать одно и то же железо, версии и исходники; не сравнивать неподходящие benchmark-версии как единую таблицу лидеров.

Рекомендуемый порядок: PP-OCRv6 на подходящих языках → сравнение GLM-OCR vs PaddleOCR-VL-1.6 → Surya после license review → остальные только для подтверждённой потребности в схемах/специфичной локальной модели.

## 2. ASR / голос

ASR превращает речь в текст, но не озвучивает ответ. Полный голосовой режим отдельно потребует TTS, захвата микрофона, VAD, аудиочанков, отмены и корректировки распознанного текста.

| Модель | Возможности | Лицензия / ограничения | Решение |
|---|---|---|---|
| [ASR4ALL-S](https://huggingface.co/futo-org/asr4all-s) | 28.1M параметров (22.8M акустическая часть + 5.3M PCEC), streaming, VAD и пунктуация/регистровая нормализация; CPU/edge. | **Только английский.** FUTO ethical-use license со специфичными ограничениями, не стандартная MIT/Apache. RTFx зависит от CPU, backend и выбранного latency tier. | Лёгкий английский streaming candidate. Не подходит как общий русский/тайский ASR. |
| [Moonshine Tiny / Small / Medium](https://github.com/moonshine-ai/moonshine) | Текущие streaming ASR-модели около 34M / 123M / 245M параметров; низкая задержка, состояние переиспользуется между аудиочанками. Moonshine Voice toolkit также предлагает on-device voice agent SDK для JavaScript/WASM, desktop/mobile и Python. | Большинство актуальных streaming ASR моделей MIT; отдельные legacy non-streaming модели некоторых языков — Community License. TTS и grapheme-to-phoneme assets лицензируются отдельно по своим README, поэтому MIT для ASR нельзя автоматически переносить на каждый голос. Таблица не подтверждает RU/TH streaming checkpoint или TTS voice. | Сравнивать Tiny для поддерживаемого языка. Отдельно оценить Moonshine Voice JS/WASM как on-device ASR/TTS путь после проверки exact-language, лицензии каждого голоса, download size и мобильной производительности. Не обещать русский/тайский без точного checkpoint/voice. |
| [ZIPFORMER VI / sherpa-onnx](https://github.com/k2-fsa/sherpa/blob/master/docs/source/onnx/pretrained_models/offline-transducer/zipformer-transducer-models.rst) | Zipformer VI 30M int8 — компактный checkpoint для вьетнамского; upstream описывает ONNX/offline транскрибацию. | Вьетнамский — целевой язык, не универсальная модель. Проверить лицензию весов отдельно от runtime sherpa-onnx. | Узкая хорошая альтернатива для Vietnamese; сравнить с Qwen3-ASR. |
| [ASR4ALL-L](https://huggingface.co/futo-org/asr4all-l) | 96.8M параметров (91.5M + 5.3M PCEC); streaming, latency tiers, VAD. | Только английский, та же FUTO лицензия. Больше модель не означает автоматически ниже задержку. | Benchmark после S, если результат качества оправдывает footprint. |
| [Distil-Whisper](https://github.com/huggingface/distil-whisper) | distil-small.en около 166M параметров; эффективная English транскрибация. Upstream заявляет ускорение и близость к Whisper Large V3 в собственных тестах. | MIT, но этот Distil-Whisper — **English-only** и не является полноценным streaming API. Для многоязычия upstream рекомендует другой checkpoint (Whisper Turbo), который надо отдельно исследовать. | English batch fallback, не основной live voice для RU/TH. |
| [Canary 180M Flash](https://huggingface.co/nvidia/canary-180m-flash) | 182M; ASR EN/DE/FR/ES, перевод между английским и тремя другими, timestamps. | CC-BY-4.0, соблюдать attribution. Карточка ориентируется на аудио короче ~40 секунд; длинные записи требуют chunking. | Специализированный кандидат на этих 4 языках/перевод, не универсальный ASR. |
| [Qwen3-ASR-0.6B](https://github.com/QwenLM/Qwen3-ASR) | Apache-2.0; upstream перечисляет 30 языков и 22 китайских диалекта, в том числе **русский, тайский и вьетнамский**. Поддерживает offline/streaming, language ID и длинные записи. | CPU real-time factor, latency первой гипотезы и peak RSS на нашем VPS не известны до теста. Не запускать одновременно с тяжёлым LLM без измерения памяти. | **Главный многоязычный ASR-кандидат.** Проверить на реальном аудио нужных языков с concurrency=1. |
| [NVIDIA Nemotron Streaming ASR](https://build.nvidia.com/nvidia/nemotron-asr-streaming/modelcard) | Есть английская версия Nemotron 3 ASR 0.6B и Nemotron 3.5 с заявленной поддержкой 40 language-locales и автоматическим определением языка; streaming использует cache-aware FastConformer-RNNT. | Слой условий отличается: API Trial Terms, NIM container Software License и OpenMDW License v1.1 для модели. Hosted API может передавать аудио третьей стороне. Нужно сверить конкретные локали, среду и правила обработки данных. | Кандидат для подходящего GPU/NIM/managed endpoint, не постоянно resident CPU-worker на 8 GB. |

### ASR: критерии отбора

WER/CER считать отдельно по каждому языку; отдельно проверять имена, цифры, акценты и шум. Замерять latency первой гипотезы, RTF, VAD false positives/negatives, длительные записи, отмену, peak RSS и cold start. RTF < 1 необходим для реального времени, но сам по себе его не гарантирует.

Если нужен русский/тайский: начать с Qwen3-ASR-0.6B. Только английский low-latency: ASR4ALL-S и Moonshine Tiny; затем ASR4ALL-L и Distil-Whisper, если нужен batch. Вьетнамский: ZIPFORMER VI против Qwen3-ASR. EN/DE/FR/ES и перевод: Canary. Nemotron — отдельная инфраструктурная ветка.

**Отдельный voice candidate:** Moonshine Voice toolkit заявляет on-device real-time voice interfaces со STT/TTS и JavaScript/WASM. Это может дать наиболее приватный путь для поддерживаемых языков без отправки аудио на наш VPS. Перед включением в GitHub Pages проверь конкретные языки, лицензию каждого TTS voice/data asset, размер первичной загрузки, совместимость WASM/ONNX и peak memory на целевом мобильном браузере. Не обещай русский или тайский TTS без соответствующего артефакта и benchmark. Для RU/TH ASR начальным кандидатом остаётся Qwen3-ASR-0.6B; TTS выбирается отдельно.

## 3. Как будет выглядеть интеграция

1. Существующий AI Mobile Agent v10.0 и текущий gateway не переписывать. Медиа не передавать как обычный текстовый chat completion.
2. До любого UI-кода выбрать модель и пройти benchmark/лицензионный gate. Не скачивать многогигабайтные веса в обязательный CI.
3. Добавлять отдельный Media API с Bearer auth, MIME allowlist, размером/длительностью, timeout, bounded concurrency, отменой и очисткой временных файлов. Не увеличивать публичную поверхность Ollama.
4. Загружать не более одной тяжёлой модели по требованию. Измерить peak RSS совместно с основным chat flow. На 8 GB не предполагать, что OCR, ASR и LLM могут быть одновременно в памяти.
5. После OCR/ASR показывать распознанный текст для ручной коррекции и явного подтверждения перед отправкой в чат. Сохранять provenance: файл, страница/область и модель.
6. Не логировать содержимое файла, не сохранять raw media/transcript в localStorage/экспорте/кэше по умолчанию. Для hosted inference явно предупреждать пользователя о передаче данных.
7. Для RAG: MIME parser → структурные фрагменты → provenance → retrieval → citations. Ошибочный OCR остаётся ненадёжным источником, а инструкции внутри документов всегда считаются недоверенными данными.

## Приёмка до production

Для каждого checkpoint закрепить hash/version, лицензии code/weights/runtime, список языков и среду. Обязательны golden-set tests, memory/latency results, auth/size/timeout/cancel/cleanup tests, UI regression tests, проверка лицензии и rollback. До выполнения всех пунктов кандидат не считается внедрённым.

## Первичные ссылки

- PP-OCRv6: https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md
- GOT-OCR 2.0: https://github.com/Ucas-HaoranWei/GOT-OCR2.0
- Surya 2: https://github.com/datalab-to/surya
- GLM-OCR: https://github.com/zai-org/glm-ocr
- PaddleOCR-VL-1.6: https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6
- HunyuanOCR-1.5: https://github.com/Tencent-Hunyuan/HunyuanOCR
- dots.mocr: https://github.com/studio-dots-ai/dots.ocr and https://huggingface.co/dots-studio/dots.mocr
- DeepSeek-OCR/OCR2: https://github.com/deepseek-ai/DeepSeek-OCR
- LightOnOCR-3-4B: https://huggingface.co/lightonai/LightOnOCR-3-4B
- ASR4ALL-S: https://huggingface.co/futo-org/asr4all-s
- ASR4ALL-L: https://huggingface.co/futo-org/asr4all-l
- Moonshine: https://github.com/moonshine-ai/moonshine
- ZIPFORMER VI: https://github.com/k2-fsa/sherpa/blob/master/docs/source/onnx/pretrained_models/offline-transducer/zipformer-transducer-models.rst
- Distil-Whisper: https://github.com/huggingface/distil-whisper
- Canary 180M: https://huggingface.co/nvidia/canary-180m-flash
- Qwen3-ASR: https://github.com/QwenLM/Qwen3-ASR
- Nemotron Streaming ASR: https://build.nvidia.com/nvidia/nemotron-asr-streaming/modelcard


## 2026-11-13 — pinned CPU-first OCR / ASR / TTS artifact set

**Status: SPECIFIED and source-pinned; downloads and target-host runtime remain unverified.** The full inventory and checksums are in models/artifacts.manifest.json; the downloader writes to an external cache, never to the Pages source tree. The official Ollama Qwen3 embedding Q8_0 tag is pulled into Ollama's own model store.

### OCR baseline for RU / EN / TH

Use Tesseract 5 with the official tessdata_fast LSTM language files:

- eng.traineddata — 4,113,088 bytes
- rus.traineddata — 3,861,738 bytes
- tha.traineddata — 1,072,600 bytes

Pinned upstream commit: tesseract-ocr/tessdata_fast@87416418657359cb625c412a48b6e1d6d41c29bd; Apache-2.0. Use LSTM OEM 1. This is a CPU OCR fallback, not a layout-aware document understanding system. Test tables, page order, columns, handwriting, scans, Thai segmentation and mixed-language pages separately. Upgrade to tessdata_best only if measured accuracy justifies its larger/slower weights.

### ASR

- Required existing-path baseline: whisper.cpp large-v3-turbo Q5_0, 574,041,195 bytes, SHA-256 394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2. Runtime and model remain separate installations.
- Challenger: Qwen3-ASR-0.6B, 1,876,091,704 bytes, Apache-2.0, upstream card lists 52 languages/dialects including Russian and Thai. Benchmark it against Whisper; it is not currently connected to the gateway.
- Silero VAD 16k OP15 ONNX, 1,289,603 bytes, MIT, is the small voice-activity component. It does not replace ASR.

Do not run both ASR checkpoints concurrently on the 8-GB reference profile without a measured memory budget.

### TTS

Pin Piper engine v1.8.0 (GPL-3.0-or-later). Its voice licensing guide requires following each voice's training chain:

- RU dmitri medium at voice repo revision 2f358b6a560e3a913ebf509b2f3344f20b367f94: direct voice dataset CC0, fine-tuned from hifi_tts_92 (CC-BY-4.0). Keep attribution and MODEL_CARD.
- EN joe medium at the same revision: direct dataset CC0, fine-tuned from rdh base (CC0).
- Do not substitute the old 2023 Lessac-derived dmitri artifact: its Lessac corpus license is research-only.
- Piper 1.8.0 adds Thai phonemization through TLTK; this is phonemizer support, not a Thai voice model. No Thai voice in the current official catalog was confirmed.
- F5-TTS-THAI is deferred: its own card says CC-BY-4.0, but its base checkpoint SWivid/F5-TTS is CC-BY-NC-4.0. Do not ship or use commercially without written rights clarification.

### API boundary

Existing gateway routes are /v1/audio/transcriptions (whisper.cpp CLI), /v1/audio/speech (Piper CLI), and /v1/documents/extract (bounded text extraction). /v1/rag/ingest and /v1/rag/retrieve already exist. Embedding/reranking and scanned-page OCR workers are not yet implemented; the proposed internal /v1/embeddings, /v1/rerank and OCR adapter must remain conditional and must not add model calls to ordinary chat.

The selected embedding runtime is Ollama qwen3-embedding:0.6b-q8_0 (about 639 MB; digest prefix ac6da0dfba84), using native /api/embed only during RAG. The full 1.19-GB HF safetensors reference is not downloaded to avoid duplicate weights.

The current container has no outbound DNS/network route, so pinned downloads were not acquired in this pass. The downloader and manifest are ready for a network-enabled host. Downloaded ≠ installed ≠ integrated ≠ verified.


### Matched main-model baseline

The official Ollama qwen3.5:4b Q4_K_M reference is also acquired for comparison (registry digest prefix d8b0f5e9760c; about 3.3 GB; Apache-2.0). The downloader uses Ollama CLI and verifies the installed tag before reporting success. Keep it unloaded while evaluating the uncensored candidate; no concurrent residency is assumed.


### Runtime pins and installation boundary

The runtime lock is models/runtime-stack.lock.json; the owner sequence is models/runtime-install.md. Current pins: Ollama v0.40.16 (Linux AMD64 archive), whisper.cpp v1.9.5 (whisper-cli built from pinned source), Piper 1.8.0 (GPL wheel), Qwen ASR package qwen-asr 0.0.6, and Tesseract 5.5.4. Platform-specific Ollama/Piper artifacts are provisional Linux x86_64 downloads; do not install until the target host architecture is verified. None is installed in this environment.
