# aLandi — аудит open-source-кандидатов

Дата среза: 2026-10-27  
Статус: первичный triage по списку пользователя; **не означает, что перечисленные проекты установлены или интегрированы в runtime**.

## Решение по архитектуре

Не переносить целые приложения без измеримой необходимости. Сохранять текущую архитектуру: статический UI → собственный gateway → изолированный model runtime; проектная память и RAG — с явным scope, provenance и выключенными по умолчанию экспериментами. Внешние документы и результаты инструментов считать недоверенными. Новые модели и инструменты включать через feature flag, allowlist, подтверждение владельца и тесты.

## Полный первичный проход

Формат: **название | решение | что взять или почему отказаться**.

1. Open Notebook | источник решения | Заимствовать workflow исследований: коллекции источников, заметки и Q&A с ссылками; не встраивать вторую самостоятельную платформу.
2. no AI slop | источник решения | Взять редакторские критерии против повторов, шаблонных вступлений и пустых выводов; не использовать как фильтр фактов.
3. I Have ADHD | внедрить принцип | Короткие действия, следующий шаг, ограниченные списки и видимый прогресс — в инструкциях агентам и ответах; без медицинских выводов.
4. Bruno | использовать в разработке | Git-версионируемые API-коллекции полезны для ручной проверки gateway; не добавлять в runtime.
5. heretic | пропустить как runtime | Abliteration не улучшает архитектуру; требует отдельного аудита модели, датасета, лицензии и safety eval.
6. Open Interpreter | источник решения | Взять sandbox, ограничение workspace, permissions и явное одобрение команд; не давать gateway произвольный shell.
7. SpiderFoot | пропустить сейчас | OSINT расширяет поверхность сбора персональных данных и сетевых запросов; вне ядра ассистента.
8. Scrapy | опциональный адаптер | Для разрешённого извлечения публичных страниц — только отдельный worker с allowlist доменов, лимитами и SSRF-защитой.
9. LocalAI | альтернативный backend | Сохранить как кандидат за единым provider interface; не заменять Ollama без сравнительных тестов.
10. yt-dlp | опциональный импортёр | Позже — явный импорт медиа с проверкой прав, ограничением размера и запретом автозапуска.
11. Metasploit Framework | пропустить | Эксплуатационный фреймворк не нужен в обычном ассистенте; не включать offensive actions по умолчанию.
12. nmap | пропустить из ядра | Сканирование сети — отдельный opt-in инструмент только для собственных/разрешённых хостов.
13. ComfyUI (повтор) | адаптер позже | Внешний backend генерации изображений через локальный API; сначала контракт media jobs, квоты и очистка файлов.
14. OpenClaw | источник решения | Изучать orchestration; не переносить runtime без аудита permissions, изоляции и цепочки поставки.
15. edge0 | кандидат локального этапа | SSD-offload MoE перспективен при ограниченной RAM; нужен benchmark на целевом железе, заявленные цифры не гарантия.
16. bitnet.cpp | кандидат локального этапа | Изучить низкобитный CPU inference; проверить совместимость модели, качество и скорость на реальном устройстве.
17. manimGX | уточнить | Точное upstream-имя и репозиторий не установлены; не внедрять по одному названию.
18. DeerFlow 2.0 | источник решения | Исследовать исследовательские workflow; не импортировать большой агентный стек без сравнения с bounded DAG.
19. ollaya | уточнить / пропустить | Вероятная опечатка или неоднозначный проект; не считать его Ollama без подтверждения.
20. EmbeddingGemma2 | кандидат модели | Рассмотреть локальные embeddings после проверки точного model card, лицензии, размера и retrieval eval.
21. LibreTranslate | опциональный сервис | Локальный перевод может снизить отправку текста наружу; нужен отдельный адаптер и RU/EN eval.
22. SearXNG | приоритетный источник интеграции | Самостоятельный метапоиск подходит приватному web-search gateway; нужны таймауты, ограничение запросов и очистка результатов.
23. self-evolution | источник принципа, не автопилот | Предлагать улучшения через eval, diff, approval и rollback; автономное изменение production отклонить.
24. agent bridge | источник решения | Нужен стабильный typed bridge между UI, gateway и инструментами; внедрять после идентификации upstream/API.
25. llmtrim | экспериментальный кандидат | Проверить context compression на golden set; принять только при сохранении фактов, цитат и качества.
26. The Agency | источник skills | Брать узкие проверенные роли/инструкции; не клонировать набор промптов как архитектуру.
27. gstack | workflow reference | Заимствовать этапы review/test/browser QA по одному skill с тестами.
28. awesome-opus5-5-videos | каталог ресурсов | Сохранить как необязательную ссылку для обучения; не runtime-зависимость.
29. Syncthing | кандидат синхронизации | Для переносимой локальной памяти подходит file sync; позже нужны конфликт-резолвинг, шифрование и backup/restore тест.
30. Cloudflare Code Mode | кандидат tool adapter | Изучить typed API/tool access; исполнять только в изоляции с ограниченными capabilities.
31. MiniMind | учебный источник | Использовать для экспериментов с малыми моделями, не production dependency без benchmark.
32. onenMaic | уточнить | Точное имя/репозиторий не подтверждены.
33. OpenCloud | кандидат файловой интеграции | Сравнить с local-first подходом; не добавлять второй files backend без конкретного сценария.
34. OpenAI agent manage/mover | уточнить | Название не идентифицирует однозначный upstream.
35. Can I Vibecode | ресурс/каталог | Полезен для обучения/discovery, не архитектурная зависимость.
36. Vitrine | уточнить | Имя неоднозначно; upstream не идентифицирован.
37. anmolkapil/plexo | исследовать отдельно | Нужны подтверждённые назначение, лицензия, активность и конкретный выигрыш.
38. concou | уточнить | Точное upstream-имя не установлено.
39. system-prompts-and-models-of-ai-tools | справочник | Использовать как исследовательский материал; не копировать чужие промпты без проверки лицензии и безопасности.
40. Official MCP Registry | приоритетный discovery | Использовать для поиска MCP-серверов; отдельно проверять издателя, permissions, лицензии, зависимости и schema. Registry не равен allowlist доверия.
41. AppFlowy | внешний продукт/интеграция | Рассматривать как экспорт/knowledge connector; не встраивать его workspace в UI aLandi.
42. foooc b us | уточнить | Неоднозначная строка, проект не идентифицирован.
43. Colibry | уточнить | Имя неоднозначно; нужна точная ссылка.
44. AirLLM | экспериментальный backend | Проверить memory-saving inference на подходящем checkpoint/устройстве; не обещать любую большую модель на малой RAM.
45. skilspectator | уточнить | Точный upstream не подтверждён; возможно опечатка.
46. slee-persis/GVS5H | исследовать отдельно | Польза, лицензия и API не подтверждены в этом проходе; исходники не копировать до аудита.
47. DeepInfer | уточнить | Название неоднозначно без URL.
48. Muse Code | источник решений | Проверять идеи coding agent на задачах и тестах; не добавлять второй runtime без доказанного преимущества.
49. Understand Anything | источник решения | Полезны карта кодовой базы и связи; начать с лёгкого индекса с provenance, не держать второй тяжёлый индексатор постоянно.
50. agent memory | исследовать категорию | Сравнить Mem0/Hindsight/Graphiti с существующей SQLite/FTS5 scoped memory; не подключать несколько конкурирующих stores.
51. scientific agent skills | приоритетный пакет навыков | Добавлять узкие навыки поиска литературы, проверки доказательств и воспроизводимых вычислений с цитированием.
52. diagram design | skill/reference | Заимствовать правила читаемых диаграмм и проверять рендеринг; не добавлять runtime-зависимость.
53. OpenViking | memory/context candidate | Сравнить retrieval и provenance с текущей памятью; не мигрировать без eval и export/restore теста.
54. grill-me | skill-кандидат | Режим уточняющих вопросов для проектирования включать по запросу, не превращать каждый диалог в опрос.
55. TimesFM | специализированная модель | Подходит для временных рядов, не общего чата; отдельный optional skill/backend.
56. Ruflo | источник решения | Изучить координацию агентов; предпочесть bounded DAG и явные бюджеты вместо бесконтрольного swarm.
57. MiniCPM-V apps | мультимодальный кандидат | Проверить локальный vision/OCR на реальных данных и целевом железе; не загружать автоматически.
58. Voice Studio | уточнить | Название неоднозначно; voice runtime требует собственного контрактного и privacy-аудита.
59. Orca | уточнить | Несколько проектов/моделей с таким именем; нужен точный upstream.
60. Headroom | уточнить | Неясно, какой именно проект имеется в виду.
61. CLI-Anything | источник решения | Полезны узкие CLI-адаптеры; запускать в sandbox с allowlist и approval.
62. Open WebUI | reference/опциональный UI | Benchmark UX и MCP-поддержки; не сливать второй UI в текущий статический клиент.
63. Handy | уточнить | Имя неоднозначно; нужна ссылка.
64. Meetily | опциональный импортёр | Потенциально полезны локальные транскрипты встреч; opt-in с согласием участников и явным хранением.
65. Vain | уточнить | Точный upstream не установлен.
66. OpenCode | workflow/reference | Заимствовать provider-agnostic coding workflow; не запускать второй агент в фоне без необходимости.
67. Open Notebook (повтор) | объединено с №1 | Дубликат, повторная интеграция не нужна.
68. Dyad | внешний инструмент разработки | Опция для локального vibecoding, не часть runtime aLandi.
69. AgenticSeek | reference | Изучить локальный агентный workflow; browser/OS-control требует sandbox и approval.
70. Duix Avatar | опциональная мультимодальность | Аватар не усиливает базовый интеллект; отложить до рабочего voice/media pipeline и проверки лицензий.
71. theAlgorithms/python | учебный источник | Ссылаться на алгоритмы для обучения; проверять лицензию/provenance перед копированием.
72. ML-for-beginners | учебный источник | Использовать в учебных маршрутах, не в runtime.
73. homemade-machine-learning | учебный источник | Примеры для обучения; не production dependency.
74. machine-learning-interview | учебный источник | Библиотека обучения при необходимости; не влияет на ядро.
75. deep-learning-papers-reading-roadmap | research resource | Сохранить как последовательный маршрут чтения статей.
76. tensorflow-examples | учебный источник | Не внедрять в runtime; использовать, если конкретная задача требует TensorFlow.
77. PyTorch/tutorials | учебный источник | Для воспроизводимых экспериментов, не runtime.
78. llama-course | учебный источник | Для обучения по LLM, не зависимость продукта.
79. generative-ai-for-beginners | учебный источник | Учебный ресурс, не часть продукта.
80. awesome-ChatGPT-prompts | справочник с низким приоритетом | Не переносить коллекцию массово; каждую инструкцию проверять по задаче, лицензии и eval.
81. 500-AI-ML-DL-CV-NLP-Projects-with-code | каталог примеров | Discovery only; лицензии и код проверять у каждого отдельного проекта.
82. awesome-machine-learning | каталог | Использовать для поиска, не добавлять зависимости только за наличие в списке.
83. Papers with Code | research discovery | Статьи/реализации полезны, но результаты сверять с первоисточниками.
84. Caveman | skill-кандидат | Рассмотреть краткий режим как переключаемый стиль, не глобальное сокращение инженерных ответов.
85. Graphify | кандидат индексации | Проверить выигрыш над текущими индексами на offline eval по кодовой базе.
86. Browser Harness | кандидат тестирования | Полезны реальные browser smoke tests; внешнюю навигацию ограничивать доменами.
87. Claude Video | уточнить | Не интегрировать без точной ссылки, API и лицензии.
88. Open Design | reference/skill | Заимствовать правила дизайн-системы и доступности; не заменять UI вслепую.
89. Codebird | уточнить | Имя неоднозначно; нужен точный upstream.
90. Impeccable | skill-кандидат | Дизайн-review checklist — если подтверждены лицензия и формат skill; автоматическую правку не считать доказанным улучшением.
91. Design Extract | кандидат tooling | Изучить извлечение дизайн-токенов с проверкой источника, прав и точности.
92. n8n MCP | интеграция через границу | Внешний workflow connector при конкретном сценарии; auth, scopes, approval и аудит обязательны.

## Конкретные улучшения для ядра

1. **Единый upstream registry**: canonical URL, license, дата проверки, статус, риск, разрешения, benchmark и rollback для каждого кандидата.
2. **Skill-first**: ADHD-friendly output, no-slop review, grill-me, scientific research и diagram design — маленькие versioned skills, а не новые сервисы.
3. **Tool gateway**: web/CLI/browser/MCP проходят typed schema, least privilege, allowlist, timeouts, budgets, approval и audit; никакого shell из browser UI.
4. **Портативная память**: source of truth — экспортируемые Markdown/JSON/SQLite; индексы пересоздаваемы; project scope и provenance обязательны; sync — opt-in с конфликтами.
5. **Provider abstraction**: Ollama остаётся текущим путём; LocalAI/edge0/bitnet.cpp/AirLLM — кандидаты benchmark, а не обязательные параллельные сервисы.
6. **Импорт медиа/документов**: Scrapy/yt-dlp/Meetily/OCR — opt-in jobs с лимитами, проверкой прав, очисткой и запретом исполнения содержимого.
7. **Evaluation gate**: golden-set regression, security fixtures, license/provenance check, resource budget, feature flag off by default и rollback.
8. **Не интегрировать сейчас**: Metasploit, SpiderFoot, nmap, автоматическое self-evolution, бесконтрольный swarm, второй UI и несколько конкурирующих memory stores.

## Границы уверенности

- Для однозначных имён использованы первичные README/официальные источники там, где они были найдены.
- «Уточнить» — не отрицательная оценка, а отсутствие однозначной идентификации.
- «Источник решения» не означает копирование исходников.
- Этот документ не устанавливает пакеты и не доказывает live-поведение.
- До переноса кода проверить лицензию upstream, зависимостей и модели.


## Проход по дополнительному списку пользователя — 2026-10-27

Формат журнала: **[Название] | [статус] | [конкретный вывод]**. Статусы отражают решение по текущей архитектуре, а не рейтинг проекта. «Пилот» означает сначала проверить локально/в CI; «уточнить» — не найден однозначный upstream или не хватает данных для безопасного решения.

- [Graphify](https://github.com/Graphify-Labs/graphify) | пилот | Построить локальный граф кода/документации и оценить пользу для ориентирования; не включать графогенератор в runtime.
- [GitIngest](https://github.com/coderamp-labs/gitingest) | использовать по запросу | Получать ограниченный текстовый слепок публичного репозитория; не отправлять приватные данные/секреты в hosted-сервис.
- [GitMCP](https://github.com/idosal/git-mcp) | использовать по запросу | Читать документы и код конкретного upstream через MCP; результаты считать недоверенными и проверять по исходному репозиторию.
- [GitReverse](https://github.com/filiksyos/gitreverse) | пропустить для навигации | Генерирует синтетический prompt, но не заменяет граф зависимостей и проверяемую навигацию по коду.
- [DrawDB](https://github.com/drawdb-io/drawdb) | источник решения | Использовать для ER-диаграмм при реальной задаче схемы; не добавлять отдельный runtime в aLandi.
- [slvDev/esp32-ai](https://github.com/slvDev/esp32-ai) | пропустить для aLandi runtime | MIT-проект запускает 28,9M-параметрическую story-модель на ESP32-S3, но авторы прямо указывают, что она не умеет отвечать на вопросы/следовать инструкциям; интересен только как edge-computing reference.
- [xtool-org/xtool](https://github.com/xtool-org/xtool) | пропустить для текущего runtime | Инструмент сборки/деплоя iOS-приложений через SwiftPM на Linux/Windows/macOS; полезен только если появится отдельная нативная iOS-разработка.
- [Zagitta/gpu-unlock](https://github.com/Zagitta/gpu-unlock) | пропустить | Kernel module меняет режимы выдачи FP/BF16-инструкций на NVIDIA RTX 30; это рискованная низкоуровневая модификация GPU, не улучшение кода/архитектуры aLandi.
- [ps5lm] | уточнить | Не найден однозначный upstream; не подключать неидентифицированный инструмент.
- [PentAGI](https://github.com/vxcontrol/pentagi) | пропустить из ядра | Автономный агентный стек требует отдельного аудита полномочий и инфраструктуры; не переносить runtime.
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | источник решения | Сравнивать bounded task execution и human approval; не добавлять второй оркестратор без eval.
- [Strix](https://github.com/usestrix/strix) | исследовать отдельно | Security testing допустим только в разрешённом тестовом контуре; не давать агенту произвольное сканирование/эксплуатацию.
- [Turnitout-Humanizer](https://github.com/AhmadHassan-BTed/Turnitout-Humanizer) | пропустить | Проект прямо позиционируется как средство обхода AI/plagiarism detectors; не интегрировать обход академических проверок и не переносить его правила.
- [decomwtf] | уточнить | Не найден однозначный upstream; нужна точная ссылка или описание.
- [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | отложить | Возможен knowledge/export connector, но второй workspace не оправдан без конкретного сценария и плана синхронизации.
- [Minimo (video)] | уточнить | Неясно, какой именно видеопроект имеется в виду; нужен URL, лицензия и use case.
- [experiential] | уточнить | Слишком общее название для однозначной идентификации.
- [Perplexia] | уточнить | Неоднозначные продукты с похожим названием; требуется канонический URL.
- [Hugging Bay] | уточнить | Возможно опечатка или неофициальный ресурс; не приравнивать автоматически к Hugging Face.
- [angkorgit] | уточнить | Не удалось однозначно установить upstream по названию; нужна ссылка.
- [DevOps Exercises](https://github.com/bregman-arie/devops-exercises) | справочник | Использовать как учебный каталог и чек-листы; не добавлять в runtime.
- [Awesome Compose](https://github.com/docker/awesome-compose) | справочник | Выбирать отдельные проверенные Compose-примеры для разработки; не копировать весь каталог в deployment.
- [Starter Workflows](https://github.com/actions/starter-workflows) | использовать выборочно | Брать шаблоны GitHub Actions только после проверки permissions, pinning actions и минимальных прав.
- [Terraform Samples] | уточнить | Название не указывает однозначный репозиторий; до URL не переносить инфраструктурный код.
- [Kubernetes Examples](https://github.com/kubernetes/examples) | справочник | Брать отдельные примеры только при реальном переходе на Kubernetes; не вводить кластер для малого VPS.
- [Real DevOps Projects] | уточнить | Не найден однозначный upstream по общему названию.
- [Google Online Boutique](https://github.com/GoogleCloudPlatform/microservices-demo) | отложить | Полезен как тестовый пример распределённой системы, но чрезмерен для обычного aLandi deployment.
- [Alertmanager](https://github.com/prometheus/alertmanager) | использовать при настройке мониторинга | Рассмотреть для маршрутизации реальных Prometheus alerts, только если появится полноценный мониторинг и on-call сценарий.
- [Argo CD](https://github.com/argoproj/argo-cd) | отложить | GitOps полезен при наличии Kubernetes; не вводить Kubernetes/Argo CD ради одного приложения на VPS.
- [Minikube](https://github.com/kubernetes/minikube) | dev-only | Подходит для локального обучения и smoke-тестов Kubernetes, не production runtime.
- [SPECTRALAYERS PRO] | пропустить из open-source внедрения | Это коммерческий продукт, не исходный код для интеграции; не включать proprietary GUI/software в aLandi runtime.
- [UVR5 / Ultimate Vocal Remover GUI](https://github.com/Anjok07/ultimatevocalremovergui) | кандидат на отдельный аудио-пилот | Может помочь с разделением источников аудио, но сначала проверить лицензии каждого используемого model weight, размер, GPU/VRAM и качество на целевых записях.
- [GLM-5.3-Flash] | отложить | Поддержка заявлена в xLLM для специализированных ускорителей, но это не подтверждает совместимость с текущим Ollama/8-GB VPS и не заменяет отдельную проверку model card, лицензии весов, формата и benchmark.
- [memvid](https://github.com/memvid/memvid) | эксперимент | Проверить компактную мультимодальную архивную память на тестовом корпусе; не заменять source-linked records без теста целостности, поиска и восстановления.
- [obra/superpowers](https://github.com/obra/superpowers) | источник процесса | MIT-набор навыков coding-agent с TDD, планированием и review; заимствовать процесс по одному, не подключать весь набор автоматически и не давать ему права вне текущего repo workflow.
- [opendroid] | уточнить | Имя неоднозначно; нужен канонический URL и threat model.
- [kev] | уточнить | Не найден однозначный upstream/назначение по одному имени.
- [Kev-4B](https://benchlm.ai/compare/glm-5-3-flash-vs-kev-4b) | пропустить как основную чат-модель | Найден model card/benchmark reference для небольшой decision-модели, но публичная сравнимая benchmark-строка с GLM отсутствует; не считать универсальной диалоговой моделью.
- [paperthin] | уточнить | Не найден однозначный проект; не внедрять по названию.
- [Apache2.0 instant wake up - aws infinity] | уточнить | Похоже на концепцию/публикацию, а не подтверждённый артефакт; нужен исходный URL и воспроизводимые замеры.
- [STATELESS COROUTINE SLICES FLUSH TO DISK ZERO RAM WASTED] | экспериментальная гипотеза | Проверить bounded disk-backed state и crash recovery; абсолютное «zero RAM» технически неверно и не является критерием приёмки.
- [Steering neurons L14 N8949 +1 / L13 N7956 -1 for Qwen 3.5 4B] | отложить | Не применять steering без точного checkpoint, происхождения/лицензии, воспроизводимого метода и safety/quality eval.
- [harness learning research] | источник принципа | Принять цикл гипотеза → ограниченный probe → измерение → решение; самообучение не меняет production без review и rollback.
- [semantic cache] | пилот | Исследовать после exact-cache baseline; обязательны scope/model/prompt version keys, privacy, TTL и eval ложных совпадений.
- [sana] | уточнить | Название неоднозначно между моделями/проектами; нужен точный URL/model card.
- [agent-usage-guard] | исследовать отдельно | Лимиты/учёт использования потенциально полезны, но нужен точный upstream и сравнение с текущими gateway budgets.
- [xerj-org/xerj](https://github.com/xerj-org/xerj) | кандидат на отдельный retrieval-пилот | Локальный Rust search/MCP server с BM25/vector/hybrid search потенциально полезен для поиска по коду и документам, но сначала сравнить с Graphify и текущим FTS5/RAG; не добавлять второй поисковый runtime без eval и замера ресурсов.
- [Harper](https://github.com/Automattic/harper) | кандидат dev-tool для английского | Официальный README описывает offline grammar checker, но текущая поддержка только английского; не подходит для русской грамматики без будущего языкового backend, не менять текст без подтверждения/undo.
- [vane] | уточнить | Название неоднозначно; нужен канонический URL.
- [dessa] | уточнить | Не удалось идентифицировать однозначный upstream по названию.
- [Cloudflare R2] | кандидат хранения | Рассматривать для object storage с шифрованием, lifecycle и тестом восстановления; R2 сам по себе не является backup-политикой.
- [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) | справочник | Использовать для discovery бесплатных сервисов; проверять актуальные лимиты, privacy и условия.
- [public-apis/public-apis](https://github.com/public-apis/public-apis) | справочник | Каталог полезен для discovery, но не allowlist; каждый endpoint требует проверки auth, privacy, CORS и стабильности.
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | справочник | Использовать для поиска MCP-инструментов; проверять владельца, разрешения, цепочку поставки и изоляцию.
- [NaiboWang/EasySpider](https://github.com/NaiboWang/EasySpider) | отдельный browser-automation пилот | Может пригодиться для UI-задач; запускать в изолированной сессии с allowlist доменов, лимитами и подтверждением внешних действий.
- [slee-persis/GVS5H](https://github.com/slee-persis/GVS5H) | уточнить перед исследованием | Репозиторий идентифицирован по URL из списка, но назначение, лицензия и полезный API не подтверждены; не переносить код до аудита.
- [Open Notebook](https://github.com/lfnovo/open-notebook) | источник решения | Взять workflow коллекций источников, заметок и Q&A с citations; не встраивать вторую самостоятельную платформу.
- [Bruno](https://github.com/usebruno/bruno) | dev-only | Git-версионируемые API-коллекции полезны для ручной проверки gateway; не добавлять в пользовательский runtime.
- [Hugging Face Transformers](https://github.com/huggingface/transformers) | справочник/benchmark tooling | Использовать для проверки model cards, совместимости и локальных экспериментов; не тянуть библиотеку в production gateway без конкретной задачи.
- [Cloudflare R2 / GitMCP / GitIngest / GitReverse] | разделять по назначению | R2 — object storage; GitMCP — удалённый MCP-доступ к upstream; GitIngest — текстовый snapshot; GitReverse — синтетический prompt; технологии не взаимозаменяемы.

### Уточнения после дополнительной проверки upstream (2026-10-27)

- [xerj-org/xerj](https://github.com/xerj-org/xerj) найден как локальный search/MCP engine (Apache-2.0); это потенциальный альтернативный retrieval pilot, не готовая зависимость.
- [Automattic/harper](https://github.com/Automattic/harper) — Apache-2.0, offline и English-only; для русской грамматики сейчас не подходит.
- [Turnitout-Humanizer](https://github.com/AhmadHassan-BTed/Turnitout-Humanizer) прямо заявляет evasion of plagiarism/AI detectors; исключить из проекта.
- [Zagitta/gpu-unlock](https://github.com/Zagitta/gpu-unlock) — kernel module для изменения FP/BF16 issue rate RTX 30; исключить из aLandi, не запускать на сервере.
- [slvDev/esp32-ai](https://github.com/slvDev/esp32-ai) и [xtool-org/xtool](https://github.com/xtool-org/xtool) идентифицированы, но не дают прямой пользы текущему web/gateway runtime.
- GLM-5.3-Flash упоминается в xLLM deployment news, но это не подтверждает подходящий model artifact/license/runtime для нашего host; отложить.

### Следующие действия после первичного triage

1. Graphify: upstream изучен, но локальный запуск заблокирован отсутствием сетевого доступа в рабочем контейнере (git clone завершился DNS error); повторить пилот в среде с репозиторием и Python/uv.
2. PR #37 закрыт без merge: ветка отстала от main, Chromium и HTML/JavaScript integrity checks упали, Pages smoke был skipped. Не потерять полезные идеи из PR: composer positioning/safe-area, per-chat search/research settings, voice-menu tap/backdrop и Tavily depth; перепроверить и переносить по одному на актуальную базу.
3. Issue #1 закрыт с reason not_planned и пояснением: это исторический GitHub Skills exercise, не дефект aLandi; закрытие не утверждает, что tutorial завершён.
4. Для строк «уточнить» запросить точный URL только если пользователь ожидает дальнейшее исследование конкретного кандидата; до этого не внедрять.
5. Для runtime-кандидата требовать лицензию, происхождение, resource budget, feature flag, regression/eval и rollback.


## Повторная проверка Graphify upstream — 2026-10-27

- Прочитаны [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), [quickstart](https://docs.graphify.com/quickstart) и [pyproject.toml](https://github.com/Graphify-Labs/graphify/blob/v8/pyproject.toml) через Exa.
- Подтверждено upstream: Apache-2.0; пакет `graphifyy`, CLI `graphify`, Python >=3.10; code parsing через локальный tree-sitter AST; semantic extraction docs/media может использовать модель; dependency footprint заметный.
- Решение: disposable dev environment, pinned version, `graphify extract . --code-only --timing`, `graphify cluster-only . --no-label`, `graphify export html`, `graphify query`; проверка exclusions, ресурсные замеры и сравнение на реальных навигационных вопросах. Не ставить в gateway и не использовать hosted Cloud для пользовательских данных.
- Исполнение **BLOCKED**: локальный `git clone` завершился DNS-ошибкой `Could not resolve host: github.com`; CLI не установлен и граф не создан.
- Промежуточный артефакт `docs/ALANDI_ARCHITECTURE_MAP_RU.md` — кураторская схема, не подмена AST graph.


## Рекомендации владельца: повторная проверка upstream — 2026-11-02

### Подтверждённые источники

- [Hermes Agent](https://github.com/NousResearch/hermes-agent/releases), v0.22.2 (Threshold v0.22.0): изучены release notes и официальный security guide. Ценные идеи: опасные команды требуют подтверждения; unattended/cron по умолчанию deny; отдельная file-write safety, container isolation, MCP credential filtering, prompt-injection scan, cross-session isolation и allowlisted working directories. **Решение:** security pattern reference only; не переносить полный autonomous runtime.
- [Everything Claude Code / ECC](https://github.com/affaan-m/ECC), v2.2.3: README/AGENTS описывают 71 agents, 314 skills, TDD, review, hooks, context controls и AgentShield; MIT. **Решение:** применять только TDD/fresh-context review/security scan/evidence-backed learning. Не устанавливать весь комплект и не давать hook-ам широкие filesystem/GitHub permissions.
- [screenshot-to-code](https://github.com/abi/screenshot-to-code): MIT; React/Vite + FastAPI, screenshot/video-to-code, optional Chromium preview. **Решение:** использовать screenshots как визуальную спецификацию и сравнивать фактический browser output; не доверять generated markup без accessibility/security review.
- [scroll-craft](https://github.com/nateherkai/scroll-craft): MIT skill для immersive scroll websites; browser checks включают dead scroll, composited contrast и decode/fallback. **Решение:** только для проверки scroll states/contrast; сложные scroll-driven animations не переносить автоматически.
- [ThinkRail](https://github.com/JetBrains/thinkrail): JetBrains incubator, Apache-2.0; pi host, isolated worktrees, living specs, typed host/UI protocol, MCP approval and PR/CI workflow. **Решение:** заимствовать worktree isolation, durable specs и typed contracts как design patterns; не добавлять второй orchestrator.
- [DeepTutor](https://github.com/HKUDS/DeepTutor): Apache-2.0; v1.7.1 release 2026-11-01; learning workspace с tutoring/research/mastery, inspectable memory, citations и recoverable sessions. **Решение:** оставить отдельным продуктовым reference для будущего learning сценария; не внедрять его web stack в текущий клиент.
- [Hallmark](https://github.com/nutlope/hallmark): MIT design skill; preflight, реальные assets/tokens, hero-first, browser lint на восьми ширинах и fresh-context review. **Решение:** использовать audit-first и screenshot review, не делать полный redesign.
- [qybaihe/bla](https://github.com/qybaihe/bla): MIT defensive anti-reverse-engineering tool. Его подход включает canaries/decoys и resource exhaustion, а upstream ограничивает использование собственными/разрешёнными artifacts и требует runtime-equivalence verification. **Решение:** не запускать на aLandi или сторонних binaries; не применять deception/anti-analysis к нашему продукту. Только threat-model reference.
- [Qwenputer](https://github.com/divagr18/qwenputer): экспериментальный RISC-V/CHIP-8 computer compiled into Qwen3.5 model layers; code MIT, model weights Apache-2.0 по README. **Решение:** research only; это не computer-use agent и не внешний sandbox/tool runtime. Ресурсный профиль не соответствует текущему 8-GB VPS.
- [Orbit / Orbit Agents](https://github.com/constellation-works/orbit) и [mukiwu/orbit-agents](https://github.com/mukiwu/orbit-agents): два разных проекта под похожим именем. Первый — MIT local-first coding task runner с isolated worktrees, file locks, approval gates и audit log; второй — MIT scheduler desktop agents. **Решение:** предпочтителен первый как process reference, но exact owner intent требует URL.
 
### Не разрешённые неоднозначности

- agent.sys не удалось однозначно связать с отдельным upstream. ECC — подтверждённый проект affaan-m/ECC, но не доказательство отдельного agent.sys.
- Orbit AI Agents не уникальный project identifier. До уточнения не устанавливать и не добавлять dependency.
- Названия, которые не разрешены по canonical URL, не считаются проверенными upstream.

### Практический shortlist для текущего PR #131

1. **Verification workflow:** ECC TDD + fresh-context review; Hermes deny-by-default approvals; Orbit isolated worktrees/locks/audit as process concepts.
2. **Landing/UI review:** screenshot-to-code as visual-spec method; Hallmark preflight + hero-first + 8-width browser lint; scroll-craft composited contrast/dead-scroll checks.
3. **No runtime adoption:** DeepTutor, Qwenputer, Hermes desktop/gateway, BLA and Orbit task runtime remain external references, not dependencies.
4. **Project constraints:** preserve static HTML/CSS/JS + Jekyll + FastAPI; no framework/runtime migration, no new service and no global agent hooks without measured need and owner approval.


## Версионная и идентификационная перепроверка — 2026-11-02

- **Harness²** — исследовательский recursive harness, не обычный browser test framework. Current main последний раз обновлялся 2026-10-14; три коммита, semver release не обнаружен. Его Propose–Probe–Compose цикл принят как bounded engineering method; benchmark executor не запускать в production из-за unrestricted network и отключённой Codex sandbox по умолчанию.
- **Hermes Agent**: актуальная проверенная стабильная версия v0.22.5 от 2026-10-22; v0.22.0 — Threshold release от 2026-10-13. Для aLandi релевантны consent, session boundaries, deny-by-default, plugin provenance; runtime не устанавливать.
- **ECC**: последняя проверенная release v2.2.3 от 2026-10-01. Практическая ценность — TDD/review discipline и проверка опубликованного artifact после release; в текущий продукт не добавлять.
- **Hallmark v2**: floor gates (contrast/focus/reduced motion/no invented facts/mobile layout), preflight, hero-first, eight-width browser review, before/kept wiring checks. Заимствовать визуальный audit, не его дизайн-систему.
- **scroll-craft 0.3.0**: реальный browser walkthrough scroll positions, dead-scroll, composited contrast per line и video fallback. Применять только где эти состояния реально существуют.
- **screenshot-to-code**: AI screenshot/video-to-code service с React/Vite/FastAPI и API-key requirements. Не внедрять; использовать screenshots как visual spec и evidence.
- **DeepTutor**: GitHub release v1.7.0 (2026-10-28), при этом container registry уже показывает 1.7.1. Модульные installation profiles и inspectable learning state — только будущий learning-scenario reference.
- **Orbit names:** `mukiwu/orbit-agents` — local desktop scheduler (Electron, React, SQLite, node-cron; cron schedule, run-now, logs/status, notifications). `constellation-works/orbit` — другой проект: local-first coding-agent task runtime с sandboxed worktrees, file locks, approvals, task IDs и audit log. Оба MIT; в текущем Landing 2.0 ни один не нужен.
- **Qwenputer** — экспериментальный RISC-V CPU внутри Qwen3.5 model layers, не tool plugin, sandbox или computer-use agent. **BLA** — defensive reverse-engineering countermeasure с canaries/decoys/resource exhaustion; не применять к aLandi из-за конфликта с прозрачностью и reproducibility.
- `agent.sys` остаётся неоднозначным названием без canonical URL. Не угадывать.

### Решение для текущего PR #131

Переносим только: bounded baseline/probe/compare/evidence loop; visual screenshot attachments; preservation of existing links/fields/handlers; isolated worktree and approval concepts. Не переносим новые runtimes, design framework, task scheduler, model checkpoints или anti-analysis obfuscation.


## Owner-provided shortlist: 60 repositories for aLandi Landing V2.0 — 2026-11-02

This is a relevance triage against the live PR #131 architecture, not an endorsement or a license/security audit of every upstream. The supplied repositories are research references; no source code, model weights, package, workflow runner or service is imported by this pass.

### Priority decisions

| Group | Relevant references | Decision for PR #131 |
|---|---|---|
| Directory UI patterns | `coolchange-ai/toolso-ai-open`, `MkThingsHQ/mkdirs`, `nolly-studio/cult-directory-template`, `AbdulBasit313/nextjs-directory-site-starter`, `ArshdeepGrover/ai-tools-manager` | Visual/IA reference only. The active product is a static Jekyll landing + browser client, not a Next.js directory. Do not introduce React/Next/Supabase or a second catalog runtime. |
| Multi-model chat UX | `LibreChat`, `LobeChat`, `HuggingFace/chat-ui`, `Open WebUI`, `AnythingLLM` | Study interaction patterns selectively (provider clarity, conversation organization, attachment provenance, responsive panels). Do not copy their server/auth/plugin architecture into the browser client. Provider isolation and existing local-first contracts take precedence. |
| Workflow / generative UI | `Dify`, `n8n`, `OpenIntelligentUI`, `full-stack-ai-agent-template`, `Chatwoot` | No runtime adoption in the landing PR. They solve workflow orchestration, embedded generative UI or support operations; none is a prerequisite for completing the current UI acceptance contract. |
| Catalog/data lists | `awesome-llm-apps`, `awesome-llm-services`, `Awesome-AITools`, `awesome-ai-tools`, `every-chatgpt-gui` | Discovery inputs only. Any future catalog needs provenance, deduplication, freshness, moderation and license metadata; do not bulk-import an unreviewed list into production UI. |
| Inference engines | `vllm`, `sglang`, `llama.cpp`, `KTransformers`, `FastChat` | Outside PR #131. Consider only in a separate target-host benchmark against the existing Ollama path, with exact model, hardware, RAM, throughput, latency, quality and operational-cost evidence. No inference backend is selected here. |
| Quantization | `AutoAWQ`, `GPTQModel`, `gptq-gguf-toolkit`, `llm-awq`, `llm-compressor`, `ReQAT`, `Awesome-LLM-Quantization` | Research/benchmark only. Quantization is checkpoint-, architecture- and hardware-dependent; no weights or quantization recipe should be chosen from repository popularity alone. |
| Multi-agent frameworks | `AgentScope`, `AutoGen`, `CrewAI`, `MetaGPT`, `LightAgent`, `EvoAgentX`, `Qwen Code`, `MobileAgent` | No adoption in this UI PR. Existing staged research is not an independent multi-agent runtime. Any later agent execution needs bounded DAGs, explicit tool permissions, budgets, audit traces, cancellation and reproducible evals. |
| SLM routing / ensembles | `awesome-llm-routing-cascading`, `BentoML`, `plexor-slm-frontdoor-rct`, `awesome-local-llm`, `SLMs-Survey`, `grove`, `Awesome-LLM-Ensemble` | No automatic router or ensemble added. First establish RU/EN/TH evaluation, privacy/provider-isolation policy, routing observability and a measured quality/cost win. Do not let an SLM silently reroute private prompts across providers. |
| MLOps / long-horizon agents | `HuggingFace Optimum`, `SGLang benchmarks`, `Awesome-Long-Horizon-Agents` | Dev-only reference. Reuse benchmark discipline and plan/execute/verify patterns where measurable; do not add MLOps runtime to GitHub Pages. |

### Implementation order derived from this triage

1. **P0 — correctness and acceptance:** finish inherited UI + mandatory 8.1–8.17; get the writable Pages test server and all four real Chromium shards green on an exact HEAD. Keep native iPhone Safari, VoiceOver and WCAG contrast as independent gates.
2. **P1 — interaction reliability:** complete the existing modal/history contract (8.18) and operation lifecycle (8.19) using the current UI stack. The new persistent-error acknowledgement slice is partial 8.19, not completion.
3. **P1 — recovery and organization:** draft recovery with IndexedDB and explicit network retry (8.25), then local title search/pinning/sorting (8.21). Preserve chat/project scopes and never auto-resend.
4. **P2 — reversible local actions:** bounded Undo (8.20); file registry only after a real scoped source API (8.23); optional adaptive inspector after responsive constraints are measured (8.22).
5. **Separate backend workstream:** evaluate Qwen/SLM, vLLM/SGLang/llama.cpp, quantization and agent orchestration only on a specified target host and golden RU/EN/TH workload. They do not belong in the static landing UI PR.

### Explicit non-adoption

- No Next.js/React/Supabase migration, no new frontend framework, no new UI package.
- No Dify/n8n/agent swarm, no extra inference gateway, no model weights, no automatic SLM router and no ensemble.
- No provider fallback that crosses an isolation boundary, no unreviewed bulk import of AI tool catalogs.
- Revisit a candidate only when a concrete acceptance gap, measured bottleneck and compatible integration contract are identified. Before importing code, verify the exact upstream revision, license, maintenance/security posture, transitive dependencies, browser support and rollback path.

## Проверка выбранных upstream — 2026-11-02, второй проход

**Метод:** 4 целевых поисковых workstream × 8 результатов = 32 просмотренных результата до дедупликации. Приоритет — canonical GitHub README/LICENSE, официальная документация и собственные страницы проектов. Это выборочная проверка наиболее релевантных кандидатов из 60, а не аудит всех 60 репозиториев. SHA ниже относятся к прочитанным файлам, не к зафиксированным зависимостям.

### 1. Directory / discovery UX

- [coolchange-ai/toolso-ai-open](https://github.com/coolchange-ai/toolso-ai-open), README blob 96b1c1d68e7ea38482e47fc97931fca6a3c395e6: Apache-2.0; Next.js 16, React 19, TypeScript, PostgreSQL/Drizzle, Better Auth, Cloudflare R2, admin review, multilingual content. Важная идея — разделять submission, automated enrichment и human approval; не переносить его full-stack auth/database.
- [MkThingsHQ/mkdirs](https://github.com/MkThingsHQ/mkdirs): Apache-2.0; Next.js/React, Sanity CMS, Auth.js, Stripe, Resend, user submissions and curated directory. Полезны taxonomy (categories/collections/tags) и moderation states; CMS, платежи и backend не нужны статическому лендингу.
- [Toolso.AI editorial methodology](https://toolso.ai/blog/how-we-evaluate-ai-tools): полезная схема evidence labels — researched vs hands-on; trace each material claim to its source/date; pricing, rights/privacy and availability must be qualified; withdraw ratings when evidence expires. Это опубликованная методология самого каталога, не подтверждение качества конкретных листингов.
- [Toolso.AI about](https://toolso.ai/about): заявлены dual taxonomy (scenario + technology), daily availability monitoring, editorial approval and explicit promoted-content labels. Для будущего каталога aLandi принять принцип прозрачного provenance/status; не копировать каталожную базу без лицензии/актуальности.
- **Решение:** визуальные паттерны taxonomy/filter chips/card density можно исследовать отдельно. Никаких Next.js/React/DB/Auth/CMS/payment dependencies в PR #131.

### 2. Multi-provider chat UX

- [Open WebUI](https://github.com/open-webui/open-webui): официальный README подтверждает multi-provider / local model workspace, но в этой выборке не завершена отдельная проверка полной license/security/deployment matrix. Рассматривать как UX reference, не как license-cleared dependency.
- LibreChat не удалось надёжно разрешить через переданный namespace в GitHub Contents API; не фиксировать выводы по одноимённому проекту без canonical URL.
- Текущий upstream lobehub/lobehub позиционирует себя как agent operations/team scheduling product, а не считать его автоматически прежним LobeChat UI. Не смешивать продукты с похожим брендом.
- **Решение:** извлекать только provider identity, model catalog clarity, conversation organization, attachment provenance и responsive workspace patterns. Не переносить auth, plugin execution, backend, database или provider fallback logic. Существующие provider isolation и browser-local scopes остаются главнее.

### 3. Inference engines

- [vLLM](https://github.com/vllm-project/vllm): LICENSE blob 261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64 — Apache-2.0. Это отдельный high-throughput serving runtime, а не frontend dependency.
- [SGLang](https://github.com/sgl-project/sglang): LICENSE blob 9c422689c8f5c317c7c65153b1209349ec57007e — Apache-2.0. Сопоставлять с vLLM на одном model/checkpoint, hardware, quantization, concurrency and prompt corpus.
- [llama.cpp](https://github.com/ggml-org/llama.cpp): LICENSE blob e7dca554bcb802f98408383a864404e3aa4eacca — MIT. CPU/Metal/CUDA deployment profile и GGUF workflow — отдельный критерий от GPU server throughput.
- **Решение:** ни один engine не выбран и не внедрён. Для проекта нужен отдельный target-host benchmark на реальном железе; сравнивать TTFT, TPOT, P50/P95 latency, throughput, peak RAM/VRAM, cold start, context length, concurrent requests, RU/EN/TH quality, operational cost и recovery. Не переносить claims из README в performance decisions.

### 4. Quantization / serving / SLM routing

- [GPTQModel](https://github.com/ModelCloud/GPTQModel): LICENSE blob 375b95f6e9e72ce847b494bb9e4021526be2d2f3 — Apache-2.0. README описывает GPTQ/AWQ support и широкую hardware/kernel matrix, но совместимость проверять для конкретного checkpoint, architecture, Transformers/runtime versions и evaluation set.
- [llm-compressor](https://github.com/vllm-project/llm-compressor): LICENSE blob 261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64 — Apache-2.0; supports weight/activation/KV-cache quantization and compressed-tensors output for vLLM. Candidate для controlled benchmark, не для импорта в UI repository.
- [AutoAWQ](https://github.com/casper-hansen/AutoAWQ): upstream прямо объявляет проект deprecated/unmaintained. Не выбирать для новых работ; проверять GPTQModel или llm-compressor и точную compatibility matrix. AWQ algorithm не равен AutoAWQ package.
- [BentoML](https://github.com/bentoml/BentoML): LICENSE blob 231bcb00f2e3fc427b6e701bc421da36c597a0f9 — Apache-2.0. Это general-purpose Python model serving/deployment layer (API packaging, Docker, batching, parallelism, Kubernetes), а не лёгкий SLM router. Не добавлять второй serving layer без измеренной проблемы.
- [SLM front-door routing study](https://ar5iv.labs.arxiv.org/html/2604.02367): Exa выдача описывает harmonized 60-case benchmark и synthetic-traffic experiment; в ней ни одна tested arm не достигает заранее установленного combined threshold 0.85 accuracy + P95 ≤2s. Вывод ограничен конкретным taxonomy, моделями, hardware и synthetic traffic; нельзя переносить цифры на aLandi. Low-cost classification ещё не доказывает downstream task quality или безопасную маршрутизацию приватного контекста.
- **Решение:** AutoAWQ исключить; GPTQModel/llm-compressor оставить в benchmark shortlist; BentoML — только если понадобится упаковать отдельный inference service; автоматическую маршрутизацию не включать до golden RU/EN/TH eval, confidence calibration, abstain/fallback policy, provider isolation, audit traces и доказанного quality/cost win.

### Обязательные критерии следующего исследования

1. Pin exact upstream commit/release; не опираться только на README.
2. Проверить LICENSE, model-weight license отдельно от code license, security advisories, recent maintenance, dependency footprint and supported Python/CUDA/ROCm/Metal versions.
3. Для runtime-кандидата зафиксировать hardware, model SHA, quantization recipe, corpus, prompt set, concurrency and resource limits.
4. Для UI-pattern candidate подтвердить конкретные selectors/states and keyboard/mobile behavior в browser; не копировать screenshots без реализации/лицензии assets.
5. Любое внедрение — отдельный scoped PR, feature flag, tests, rollback and provenance record.

**Итог второго прохода:** полезные паттерны найдены; runtime adoption = 0; package additions = 0; model downloads = 0. Следующий шаг — отдельно разобрать SGLang/vLLM benchmark protocols, local quantization constraints и неразрешённые owner-provided repository names.

## Upstream follow-up — serving, SLM routing and agent runtimes (2026-11-02)

### Serving engines and Qwen3-Next

- [vLLM V1 guide](https://docs.vllm.ai/en/latest/usage/v1_guide/) documents a reworked unified scheduler/KV-cache manager, chunked prefill by default where possible, prefix caching and broad model/hardware support. The separate [quantization matrix](https://docs.vllm.ai/en/stable/features/quantization/) makes clear that a format name is not a hardware guarantee: AWQ/GPTQ/FP8/INT4/quantized KV support varies by GPU generation and backend.
- [SGLang Qwen3-Next guide](https://github.com/sgl-project/sglang/blob/main/docs/basic_usage/qwen3.md) explicitly supports Qwen3-Next-80B-A3B-Instruct and Thinking. Its documented launch example targets **4×H100/H200**. Qwen3-Next-80B-A3B is an 80B-total-parameter MoE with 3B active parameters; it is not a small front-door SLM. The SGLang guide also describes MambaRadixCache tradeoffs: `no_buffer` disables overlap scheduling for compatibility, while `extra_buffer` uses two additional Mamba spaces per request to enable overlap/speculative decoding.
- Decision: SGLang + Qwen3-Next is a valid high-end downstream inference candidate where the GPU budget exists, not a lightweight local router for an unknown/single-GPU host. Hardware must be measured before any adoption. No Qwen3-Next weights were downloaded.

### LightAgent and API pool

- [LightAgent](https://github.com/wanxingai/LightAgent) v0.11.0 is an Apache-2.0 agent framework, not a model server or a thin router. It adds opt-in durable LightDAG execution, SQLite-backed run state, leases/fencing, verification gates and approval/security-context controls. Its [provider guide](https://github.com/wanxingai/LightAgent/blob/main/docs/model_providers.md) explicitly demonstrates vLLM, llama.cpp and Ollama OpenAI-compatible endpoints; no explicit SGLang + Qwen3-Next integration recipe was found. A compatible SGLang endpoint may fit the generic OpenAI-style client contract, but that exact combination remains unvalidated.
- [llm-apipool](https://github.com/GFardad/llm-apipool) is MIT-licensed and provides a 40+ provider/key-pool proxy with round-robin key rotation, rate-limit cooldown and automatic fallback tiers. Those defaults conflict with aLandi's explicit provider/privacy isolation and the rule against silent cross-provider fallback. Do not adopt as a gateway; its key-pool/routing pattern is reference-only.
- [BentoVLLM](https://github.com/bentoml/BentoVLLM) is an Apache-2.0 example of packaging vLLM behind BentoML's service layer. The sample 8B path recommends at least 16GB VRAM and adds a second serving/deployment layer. BentoML remains useful only if a measured need appears for model packaging, custom service lifecycle or deployment orchestration; it is not required in front of the existing FastAPI gateway.

### Re-evaluation of the Plexor SLM-routing study

- [Repository](https://github.com/micoverde/plexor-slm-frontdoor-rct), [v2 experiment protocol](https://github.com/micoverde/plexor-slm-frontdoor-rct/blob/main/docs/EXPERIMENT_PROTOCOL.md), [pilot significance JSON](https://raw.githubusercontent.com/micoverde/plexor-slm-frontdoor-rct/main/data/pilot_benchmark/significance_report.json), [pilot environment manifest](https://raw.githubusercontent.com/micoverde/plexor-slm-frontdoor-rct/main/data/pilot_benchmark/environment_manifest.json), and [paper source](https://github.com/micoverde/plexor-slm-frontdoor-rct/blob/main/paper/main.tex) were cross-read.
- The repository README still describes the earlier 60-case Phi-3.5-mini vs Qwen2.5-1.5B pilot (accuracy 0.517 vs 0.200). Its pilot environment manifest leaves hardware, CUDA, driver, Torch, Transformers, MLflow and git SHA as `unknown`, so the README's “hardware-controlled” description is not independently reproducible from that manifest.
- The v2 protocol states a planned N=400/arm RCT and marks Study 2 pending; the paper abstract says the same 60 unique prompts are repeated and effective accuracy sample size is 60 per arm, with Qwen2.5-3B at 0.783, DeepSeek-V3 at 0.830 but P95 2,295 ms. Neither reaches the pre-registered joint viability threshold of accuracy ≥0.85 and P95 ≤2,000 ms. Treat the paper's results as author-reported synthetic/offline evidence, not an independent production RCT or transferable aLandi benchmark.
- Decision: no automatic SLM front-door routing until aLandi has its own locked RU/EN/TH corpus, repeated/paired evaluation, calibrated confidence, abstain path, provider-isolation tests, measured end-to-end quality and latency, and reproducible hardware/runtime manifests.

### Quantization and runtime compatibility

- [GPTQModel](https://github.com/modelcloud/gptqmodel) currently declares Apache-2.0 in its raw LICENSE. Its integration matrix lists vLLM and SGLang, but SGLang loading is narrower than the headline suggests: GPTQ formats `GPTQ`, `GPTQ_V2`, `MARLIN`, and AWQ formats `GEMM`/ `MARLIN` are documented. Do not infer every GPTQModel quantization method/format works on every runtime.
- [LLM Compressor algorithm guide](https://docs.vllm.ai/projects/llm-compressor/en/latest/steps/choosing-algo/) distinguishes RTN, GPTQ/AWQ, SmoothQuant, REAP, SparseGPT and FP8 KV-cache quantization. [SGLang quantization docs](https://docs.sglang.ai/advanced_features/quantization.html) recommend offline pre-quantized weights for GPTQ/AWQ and require post-quantization quality validation. The [vLLM compatibility table](https://docs.vllm.ai/en/stable/features/quantization/) is hardware-specific. GPTQModel and LLM Compressor code are Apache-2.0; model-weight licenses remain separate.
- AutoAWQ remains excluded from new work. AWQ is an algorithm; AutoAWQ is a separate package and must not be conflated with maintained integrations.

**Conclusion:** the stack combinations remain architectural hypotheses, not a ready-to-deploy bundle. Keep the aLandi static UI → existing FastAPI gateway → selected inference runtime boundary. No package, agent runtime, router, quantization tool, model or deployment was added by this research.
