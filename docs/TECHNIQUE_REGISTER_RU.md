# Реестр извлечённых техник и решений для aLandi

**Дата: 21 октября 2026 г.** Это список идей, с которыми мы приняли отдельное решение. Наличие ссылки не означает, что сторонняя программа установлена в production.

| Источник | Что это такое | Что забираем | Что не берем / итог |
|---|---|---|---|
| [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) — вероятное совпадение с «AI / FROM SCRATCH», так как точный URL не указан | MIT-учебный проект с исполняемыми уроками по AI engineering, retrieval и agent runtimes; идеи должны завершаться runnable artifact. | **Build → run → test → benchmark → compare with production library.** У каждого нового компонента — пример, тест и повторяемый результат. | **Метод принять;** не копировать весь курс или зависимости в сайт/VPS. Если имелся в виду другой проект, ссылка нужна для отдельной сверки. |
| [AirLLM](https://github.com/lyogavin/airllm) | Apache-2.0; layer-wise загрузка/offload больших LLM для снижения пикового GPU VRAM. | Раздельно измерять веса, runtime, активации, контекст, диск и I/O; не путать «запускается» с «быстро работает». | **Не ставить в 8-GB CPU runtime.** Не даёт бесплатной скорости и не заменяет Ollama; рассмотреть на другом GPU-host только под конкретный benchmark. |
| [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | Самостоятельно разворачиваемая студия генерации изображений/видео с большим количеством интеграций провайдеров; не универсальный локальный LLM/OCR runtime. | Раздельные capabilities и явное отображение маршрута/провайдера/privacy. | **Отложить** до отдельной Image/Video продуктовой задачи; self-hosted UI не доказывает локальность или бесплатность инференса. |
| [dsh-our-free-model](https://github.com/ebony-vinyl/dsh-our-free-model) | Плагин для DeepSeek Harness с внешними публичными AI gateway/модельными каналами и локальным OpenAI-compatible relay. | Наблюдение за живым каталогом и проверка формы streaming-ответов — полезные паттерны, часть provider discovery уже есть в aLandi. | **Не подключать relay.** «Free» не гарантирует privacy/SLA/условия обработки; не отправлять prompts, документы, ключи или рабочий код стороннему шлюзу. |
| [CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Создание agent-friendly CLI: help, детерминированные команды, JSON output, коды ошибок и E2E проверка. | Для будущих admin/benchmark tools — allowlist команд, dry-run, JSON для агента, проверка exit code и результатов артефакта. | **Методику принять;** никаких arbitrary shell привилегий статическому браузерному агенту и не ставить полный CLI-hub на production VPS без задачи. |
| [RAG-Anything](https://github.com/HKUDS/RAG-Anything) | MIT multimodal RAG поверх LightRAG, parser pipeline для PDF/Office/изображений/таблиц/формул и extras для аудио/видео; некоторые зависимости тяжёлые. | **MIME → parser → structured blocks → page/bbox provenance → chunking → retrieval → citations.** Каждое утверждение должно сохранять ссылку на первичный документ/страницу. | **Принять архитектуру, не полный runtime.** Не устанавливать package[all], MinerU/LibreOffice и дополнительные модели на VPS до измерения корпуса/памяти. |
| [Pliny the Liberator / L1B3RT4S](https://github.com/elder-plinius/L1B3RT4S) | Prompt jailbreak / набор «liberation» примеров, а не оркестратор или inference server. | Только adversarial tests для prompt injection: найденный текст/документ не меняет систему, allowlist инструментов или уровень доступа. | **Не интегрировать prompt bundle** и не ослаблять safety rules. Тестировать разрешённые негативные fixtures, безопасно и изолированно. |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT design skill; audit-first, направление дизайна, real-assets attribution и browser проверки нескольких ширин. Upstream описывает v2 как экспериментальную workflow, требующую существенного времени/токенов. | **Audit first:** зафиксировать baseline, проверить desktop/tablet/mobile, focus/keyboard/reduced-motion, исправлять лишь конкретные проблемы и повторно проверять screenshots. | **Checklist принять, дизайн сохранить.** Не запускать редизайн/installer/hooks автоматически поверх существующего AI Mobile Agent v10.0. |

## Привязка к текущему репозиторию

- Текущая страница — статический AI Mobile Agent v10.0; сохраняем её стиль и workflow. Не переносим Hono/новый frontend framework без измеримой причины.
- Есть on-demand task skills и четырёхэтапное «Умное исследование» с evidence trail; они служат точкой расширения.
- Есть отдельный текстовый gateway aLandi Lite: Bearer auth, allowlist моделей, ограничение request body и concurrency. OCR/ASR endpoints пока нет.
- Добавляем только мультимодальный specialist skill и regression checks на этом этапе. Runtime-модель не считается интегрированной только из-за её описания в каталоге.

## Последовательность инженерного отбора

1. Фиксировать upstream URL, версию и hash точного checkpoint. Проверять отдельно лицензии кода, весов и runtime; подтверждать список языков конкретной модели.
2. До установки записать baseline RAM/CPU/disk, текущую активную Ollama модель, latency и concurrency.
3. Сделать golden dataset для нужных языков, документов и аудио. Приватные данные не передавать hosted API без согласия.
4. Сначала детерминированные mock/contract tests; большие веса и live benchmark — отдельный необязательный workflow, не обязательный GitHub Actions CI.
5. Интегрировать один маршрут за раз; исследовательский skill не должен открывать сеть/файлы сам по себе или исполнять произвольный код.
6. Перед merge запустить quality sentinels, Jekyll build и Playwright E2E; просмотреть diff и обновить rollback guide. Не заявлять независимый review, если его реально не выполнял другой ревьюер.
7. Сохранять в этот реестр только повторяемые результаты; автоматически не включать сгенерированные изменения, влияющие на авторизацию, privacy или внешние полномочия.



## Голосовое приложение: дополнительная развилка

[Moonshine Voice](https://github.com/moonshine-ai/moonshine) имеет SDK, ориентированный на on-device voice agents, и интерфейсы для JavaScript/WASM и native-платформ. Его стоит включить в будущую сравнительную проверку на поддерживаемых языках, поскольку локальная обработка может уменьшить передачу аудио в облако и потребность в отдельном server media endpoint. Но TTS-модели/данные имеют отдельные условия лицензирования и языковую доступность; это не означает, что подходящий русский или тайский голос уже готов. Сначала тест на реальном телефоне: cold download, startup, latency, memory, permission/cancel UX и license, затем отдельное решение о встраивании.
