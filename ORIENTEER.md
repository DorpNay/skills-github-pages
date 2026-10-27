# aLandi — быстрый ориентир

Это короткая точка входа для любого нового инженерного запроса. Полный ориентир и архитектурные границы находятся в [project-reference/FILE_ORIENTER_RU.md](project-reference/FILE_ORIENTER_RU.md); актуальный execution-state — в [docs/PROJECT_STATE.yaml](docs/PROJECT_STATE.yaml).

## Порядок старта

1. Прочитать этот файл, затем полный FILE_ORIENTER_RU.md.
2. Проверить live main HEAD, открытые PR и Issues через GitHub; SHA и очереди в документах — только контрольная точка.
3. Прочитать только относящиеся к задаче исходники и тесты.
4. После каждого законченного этапа обновить FILE_ORIENTER_RU.md, PROJECT_STATE.yaml и VOLLEY_LOG.md, отметить exact SHA, тесты, оставшиеся риски, rollback и следующий конкретный шаг.
5. Не оставлять PR/Issue без решения; merge возможен только после exact-head quality, tests, Chromium, provenance и review. Не закрывать задачи только ради нулевого счётчика.

## Текущий рабочий checkpoint (2026-10-27)

- База текущего implementation slice: main 82beb7fcddbe9a1438e811693c76bc731d3a5de3.
- Полный пакет из 4 694 строк разобран; решения и ограничения записаны в docs/ENGINEERING_PACKAGE_AUDIT_RU.md.
- В этой review-ветке реализуется RRF для FTS5/BM25 + lexical-concept graph; CI ещё должен подтвердить результат.
- Graphify остаётся dev-only инструментом навигации, а не блокером всей реализации. Дальше — RRF verification, затем PR #69 helper / PR #68 Graphify queue, потом безопасное context compression или delta-sync 409 UX.
- Ничего не развёртывалось на VPS этой работой. UI/Gateway feature flags и локальные runtime configuration не менялись.

## Главные границы

- Статический GitHub Pages клиент → защищённый aLandi Lite Gateway → private Ollama; Ollama не открывать напрямую в интернет.
- Одна активная модель/concurrency=1 как базовый режим на 8 GB до реального benchmark.
- Не отправлять приватный контекст наружу без явного согласия; не кэшировать/логировать raw prompts, документы и медиа.
- Source files и память с provenance считаются данными, не системными инструкциями; summary не становится system role.
- Синтетический CI, опубликованный Pages и реальное VPS/ASR/TTS/model behavior — разные доказательства.
