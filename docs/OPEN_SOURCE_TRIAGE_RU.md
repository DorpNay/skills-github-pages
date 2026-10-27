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
- Решение: disposable dev environment, code-only/local run, pinned version, проверка exclusions, ресурсные замеры и сравнение на реальных навигационных вопросах; не ставить в gateway и не использовать hosted Cloud для пользовательских данных.
- Исполнение **BLOCKED**: локальный `git clone` завершился DNS-ошибкой `Could not resolve host: github.com`; CLI не установлен и граф не создан.
- Промежуточный артефакт `docs/ALANDI_ARCHITECTURE_MAP_RU.md` — кураторская схема, не подмена AST graph.
