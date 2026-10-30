# aLandi — MASTER TASK REGISTRY

**Created:** 2026-10-31  
**Purpose:** единый инвентарь незавершённых работ из исторического запроса, V-016, backlog запуска/V1 и аудита целостности стека.  
**Rule:** исходные чек-листы остаются нетронутыми и сохраняют историческую роль. Этот реестр зеркалирует все открытые checkbox-пункты со стабильными ID; задачи нельзя молча удалять или объявлять выполненными.

## Статусы

- `[ ]` ожидает выполнения или доказательства.
- `[~]` частично реализовано либо требует проверки.
- Выполнение подтверждается только реализацией и соответствующими тестами/свидетельствами.
- ID образуется из префикса источника и исходного номера строки. ID сохраняется при уточнении формулировки.
- Источники пересекаются. Первая миграция намеренно без потерь; **дедупликация и cross-linking ещё не выполнены**. Сумма ниже — число записей, не уникальных требований.

## Снимок миграции

| Источник | Открытых записей | Ожидают | Частичные | Канонический источник |
|---|---:|---:|---:|---|
| Исторический пользовательский реестр | 115 | 81 | 34 | [`docs/USER_REQUEST_CHECKLIST.md`](../docs/USER_REQUEST_CHECKLIST.md) |
| GEN1 / CRAZE V-016 | 28 | 27 | 1 | [`docs/V016_IMPLEMENTATION_CHECKLIST.md`](../docs/V016_IMPLEMENTATION_CHECKLIST.md) |
| Общий backlog первого запуска | 46 | 46 | 0 | [`docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md`](../docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md) |
| Канонический чек-лист V1 UI | 39 | 21 | 18 | [`docs/V1_UI_FINALIZATION_RU.md`](../docs/V1_UI_FINALIZATION_RU.md) |
| Полировка лендинга | 23 | 19 | 4 | [`docs/LANDING_UX_POLISH_BACKLOG_RU.md`](../docs/LANDING_UX_POLISH_BACKLOG_RU.md) |
| Сквозной аудит целостности стека | 24 | 24 | 0 | [`docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md`](../docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md) |
| **Итого до дедупликации** | **275** | **218** | **57** | |

## A. Перенесённые исторические задачи

### UR — Исторический пользовательский реестр

Источник: [`docs/USER_REQUEST_CHECKLIST.md`](../docs/USER_REQUEST_CHECKLIST.md)

- [ ] **UR-014** (строка 14; A. База, управление и непрерывность): Проверить все старые регрессии: создание чата, история, экспорт/импорт, отмена, повтор запроса.
- [ ] **UR-015** (строка 15; A. База, управление и непрерывность): Обновить сведения о реальном состоянии системы: код, контракт, эксперимент, развёрнутая служба, измеренная метрика.
- [~] **UR-020** (строка 20; B. Первичное облако aLandi и API-провайдеры): Начальный статус облака — красный/неподтверждённый; зелёный возможен лишь после реального модельного ответа и успешной `/healthz`-проверки при следующем запуске. Живой пользовательский gateway ещё не сконфигурирован.
- [~] **UR-021** (строка 21; B. Первичное облако aLandi и API-провайдеры): Хранить адрес, модель и ключ aLandi отдельно; не считать наличие ключа доказательством связи.
- [~] **UR-022** (строка 22; B. Первичное облако aLandi и API-провайдеры): Проверять сохранённое соединение при запуске через health-check, а не доверять вечному старому зелёному статусу.
- [~] **UR-023** (строка 23; B. Первичное облако aLandi и API-провайдеры): Перенести старые настройки провайдеров в свёрнутый дополнительный раздел.
- [~] **UR-024** (строка 24; B. Первичное облако aLandi и API-провайдеры): Вынести ключ Tavily в под-раздел инструментов и веб-поиска.
- [~] **UR-025** (строка 25; B. Первичное облако aLandi и API-провайдеры): Добавить кнопку вставки для ключей провайдера и своего gateway.
- [~] **UR-026** (строка 26; B. Первичное облако aLandi и API-провайдеры): После явной вставки ключа запускать один ограниченный refresh каталога и тест соединения.
- [~] **UR-027** (строка 27; B. Первичное облако aLandi и API-провайдеры): Блокировать конкурирующие одновременные тесты подключения.
- [~] **UR-029** (строка 29; B. Первичное облако aLandi и API-провайдеры): При явной ошибке доступности модели искать не более трёх альтернатив того же провайдера.
- [~] **UR-030** (строка 30; B. Первичное облако aLandi и API-провайдеры): Не делать retry альтернативных моделей на 401/403, 429, сетевой ошибке или общем сбое API.
- [~] **UR-031** (строка 31; B. Первичное облако aLandi и API-провайдеры): Принимать корректные текстовые массивы, refusals/tool-calls и варианты совместимого ответа, не путать валидный JSON-envelope с ошибкой формата.
- [~] **UR-032** (строка 32; B. Первичное облако aLandi и API-провайдеры): Kilo Auto Free доступен как обычный альтернативный провайдер в общем списке: без ключа, только по явному выбору и без скрытого fallback. Официальная документация предупреждает, что промпты могут поступать провайдерам, которые логируют их/используют для улучшения моделей; конфиденциальные данные туда не отправлять. См. `docs/V016_IMPLEMENTATION_CHECKLIST.md` и [официальное предупреждение Kilo](https://kilo.ai/docs/getting-started/using-kilo-for-free).
- [ ] **UR-033** (строка 33; B. Первичное облако aLandi и API-провайдеры): Обновить все модельные ID по официальным динамическим каталогам; статические preset считать только fallback.
- [ ] **UR-034** (строка 34; B. Первичное облако aLandi и API-провайдеры): Провести E2E-проверку реального пользовательского выбора Kilo и документацию об обработке данных сторонним шлюзом.
- [ ] **UR-036** (строка 36; B. Первичное облако aLandi и API-провайдеры): Проверить официальные endpoints, CORS, лимиты, схему аутентификации и формат ошибок каждого сохранённого провайдера.
- [ ] **UR-037** (строка 37; B. Первичное облако aLandi и API-провайдеры): Никогда не переносить ключи из одного провайдера в другой и не экспортировать ключи в settings-profile.
- [~] **UR-040** (строка 40; C. Главный экран, визуальная система и язык): Переоформить шапку в бренд aLandi и перенести название активного чата в подпись.
- [~] **UR-041** (строка 41; C. Главный экран, визуальная система и язык): Добавить пасхалку «a land i → i land AI».
- [~] **UR-042** (строка 42; C. Главный экран, визуальная система и язык): Добавить реальные цифровые часы и аналоговые стрелки с дискретным обновлением.
- [~] **UR-043** (строка 43; C. Главный экран, визуальная система и язык): Добавить основной переключатель тёмной/светлой темы на главном экране.
- [~] **UR-044** (строка 44; C. Главный экран, визуальная система и язык): Добавить RU/EN переключатель и сохранять выбранный язык.
- [~] **UR-045** (строка 45; C. Главный экран, визуальная система и язык): Обновить шрифтовой fallback без обязательной внешней загрузки; улучшить радиусы и состояния элементов.
- [~] **UR-046** (строка 46; C. Главный экран, визуальная система и язык): Реализовать центрирование поля ввода в пустом чате и увеличение высоты по мере ввода.
- [~] **UR-047** (строка 47; C. Главный экран, визуальная система и язык): Перемещать длинный черновик из центрального режима в привычную нижнюю позицию.
- [~] **UR-048** (строка 48; C. Главный экран, визуальная система и язык): Добавить ограниченное прикрепление текстовых файлов (.txt, .md, .csv, .json, .log) с размерными лимитами.
- [~] **UR-049** (строка 49; C. Главный экран, визуальная система и язык): Мобильная кнопка голоса, удержание и свайп покрыты успешным PR #21 Chromium E2E. Это только preview: микрофон, ASR, TTS, AEC и аудиотранспорт не подключены.
- [ ] **UR-050** (строка 50; C. Главный экран, визуальная система и язык): Полностью пройти мобильную/настольную проверку размеров и областей касания.
- [ ] **UR-051** (строка 51; C. Главный экран, визуальная система и язык): Проверить клавиатурную доступность, visible focus, контраст, screen reader и reduced-motion.
- [ ] **UR-052** (строка 52; C. Главный экран, визуальная система и язык): Перевести все пользовательские надписи, подсказки и ошибки интерфейса; текущий RU/EN перевод неполный.
- [~] **UR-053** (строка 53; C. Главный экран, визуальная система и язык): Сокращены ключевые инструкции настроек: cloud/API, ключи, CORS, контекст и веб-поиск. Полный аудит всех подсказок и согласование RU/EN ещё не завершены.
- [ ] **UR-054** (строка 54; C. Главный экран, визуальная система и язык): Провести визуальную регрессию desktop/mobile и проверить, что анимации не мешают длинному вводу.
- [~] **UR-057** (строка 57; D. Чаты, проекты, инструкции и память): Project CRUD присутствует в клиенте: создать, переименовать/редактировать, удалить с подтверждением; повторно проверить E2E на текущей ветке.
- [~] **UR-058** (строка 58; D. Чаты, проекты, инструкции и память): Проектные инструкции редактируются и добавляются в контекст как предпочтения, не как политика безопасности; подтвердить тестами precedence.
- [~] **UR-059** (строка 59; D. Чаты, проекты, инструкции и память): Текущий чат можно привязать/отвязать от проекта; проектная принадлежность видна в интерфейсе.
- [~] **UR-060** (строка 60; D. Чаты, проекты, инструкции и память): Есть экспорт/импорт project bundle с чатом, инструкциями и памятью; проверить схему, duplicate IDs, limits, malicious content.
- [~] **UR-061** (строка 61; D. Чаты, проекты, инструкции и память): Global memory и project memory имеют отдельные явные toggles; default выключен; подтвердить, что global facts не утекут в другой project scope.
- [~] **UR-062** (строка 62; D. Чаты, проекты, инструкции и память): Server memory graph API and opt-in browser bridge are implemented and CI-verified. Browser projects remain local-first; only a manual upload sends facts as server-side candidates, and only confirmed facts in the exact project scope can be retrieved when both per-chat toggles are enabled. Multi-device project sync and live gateway activation remain unverified.
- [ ] **UR-063** (строка 63; D. Чаты, проекты, инструкции и память): Реализовать authenticated API/индексацию project sources только после согласованного backend contract; не имитировать работающий индекс на пустой заглушке.
- [ ] **UR-064** (строка 64; D. Чаты, проекты, инструкции и память): Добавить/проверить тест cross-project leak на серверной памяти, RAG, evidence, cache и deletion — где соответствующие слои существуют.
- [~] **UR-065** (строка 65; D. Чаты, проекты, инструкции и память): RAG source deletion is scope-checked and removes chunk/concept/FTS rows; SQLite `secure_delete` plus version-gated FTS5 `secure-delete` regression tests passed on PR #24 HEAD and post-merge main. This still does **not** erase evidence-ledger copies, WAL/journals, backups or browser-local source copies; system-wide crypto-erasure remains open.
- [ ] **UR-066** (строка 66; D. Чаты, проекты, инструкции и память): Проверить экспорт, исправление и удаление пользовательских фактов и связанные derived records.
- [ ] **UR-067** (строка 67; D. Чаты, проекты, инструкции и память): Реализовать удаление/криптостирание по всем реальным слоям; не обещать SLA ≤60 секунд без измерения.
- [ ] **UR-070** (строка 70; D. Чаты, проекты, инструкции и память): Протестировать valid_from, valid_until, recorded_at, конфликты, supersede и scoped recursive delete в gateway memory prototypes.
- [ ] **UR-071** (строка 71; D. Чаты, проекты, инструкции и память): Полноценный viewer источников/индекса, citation lineage и cross-device project memory остаются задачами последующих фаз.
- [~] **UR-074** (строка 74; E. Инструменты, маршрутизация, веб-поиск и отказы): Сохранить ограничение по числу шагов инструментов и исследовательских вызовов; не запускать неограниченный retry loop.
- [~] **UR-075** (строка 75; E. Инструменты, маршрутизация, веб-поиск и отказы): Сохранить явный opt-in для fallback к другому облачному провайдеру.
- [ ] **UR-076** (строка 76; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить все циклы tool-calls на max rounds, общий deadline, cancellation, bounded concurrency и корректное продолжение assistant/tool messages.
- [ ] **UR-077** (строка 77; E. Инструменты, маршрутизация, веб-поиск и отказы): При ошибке инструмента пробовать совместимый способ/альтернативный инструмент только в пределах явного policy и бюджета.
- [ ] **UR-078** (строка 78; E. Инструменты, маршрутизация, веб-поиск и отказы): Показывать правдивую timeline событий: фактический вызов, источник, duration, результат, ошибка; не показывать скрытые рассуждения.
- [ ] **UR-080** (строка 80; E. Инструменты, маршрутизация, веб-поиск и отказы): Внедрить 12-шаговый Deep Research state machine, повторный поиск при пробелах и проверку утверждений против ссылок.
- [ ] **UR-081** (строка 81; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить prompt-injection в проектных инструкциях и загруженных документах.
- [ ] **UR-082** (строка 82; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить SSRF/redirect protections, MIME/size/time limits, безопасную очистку временных файлов и отсутствие секретов в логах.
- [ ] **UR-083** (строка 83; E. Инструменты, маршрутизация, веб-поиск и отказы): Не кэшировать streaming, tool calls, web research, multimedia, errors или partial outputs.
- [ ] **UR-084** (строка 84; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить точную инвалидацию exact cache при изменении prompt, project instructions или tool schema.
- [ ] **UR-085** (строка 85; E. Инструменты, маршрутизация, веб-поиск и отказы): Измерить retry rate, повторные дубликаты, частоту 429/5xx, latency и успешность tool-циклов.
- [ ] **UR-089** (строка 89; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить CI-гейт триады: точный проверенный URL + лицензия конкретного артефакта + источник технического утверждения.
- [ ] **UR-090** (строка 90; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Не включать модели/голоса в установщик до проверки точной лицензии, весов, voice artifact и checksums.
- [ ] **UR-091** (строка 91; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Внедрить ALBF binary framing только вместе с real transport и тестами на усечение, CRC, max payload и cancellation.
- [ ] **UR-092** (строка 92; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Сделать bake-off ASR/TTS с измерением RTF, first audio, e2e p95 и потребления PSS; не опираться на неподтверждённые цифры.
- [ ] **UR-093** (строка 93; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Подтвердить native audio capture/processing прежде, чем обещать отсутствие PCM/аудио hotpath в Python.
- [ ] **UR-095** (строка 95; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить безопасную изоляцию tool workspace; не называть subprocess без sandbox production-изоляцией.
- [ ] **UR-096** (строка 96; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить scope isolation, no-PII logs, prompt priority stack и fail-safe privacy policy.
- [ ] **UR-097** (строка 97; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Измерить профиль laptop_8gb_cpu_mvp на целевом 8-GB железе, включая combined LLM+RAG+tools и cold-tier eviction.
- [ ] **UR-098** (строка 98; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Не заявлять p95 900/2500 ms, regret ≤1.25, PII leak=0 или crypto-erase SLA, пока нет воспроизводимых evals.
- [ ] **UR-099** (строка 99; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Полностью пересмотреть список зависимостей/отклонённых технологий в V-016 и не вводить CUT/PAT items как production-зависимости.
- [ ] **UR-100** (строка 100; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить Third-party NOTICE и права распространения каждой включённой библиотеки/модели.
- [ ] **UR-103** (строка 103; G. Выпуск и финальный аудит): Пройти Jekyll build, quality sentinels, browser Chromium tests, accessibility/interaction tests и provider-specific deterministic E2E.
- [ ] **UR-104** (строка 104; G. Выпуск и финальный аудит): Проверить без реальных секретов: malformed response, 400/404 model missing, 401/403 auth, 429, 5xx, timeout, CORS, offline and cancelled request.
- [ ] **UR-105** (строка 105; G. Выпуск и финальный аудит): Проверить, что новая ветка не меняет чужую конфигурацию, историю, секреты или сохранённые настройки молча.
- [ ] **UR-106** (строка 106; G. Выпуск и финальный аудит): После merge проверить main SHA, успешные workflows и опубликованную GitHub Pages версию.
- [ ] **UR-107** (строка 107; G. Выпуск и финальный аудит): Перепроверить каждый пункт этого реестра перед итоговым отчётом; явно перечислить незавершённое и неподтверждённое.
- [~] **UR-117** (строка 117; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 0–4: gateway/trace, scoped temporal memory, FTS5/evidence/citations и tool safety имеют foundations/prototypes; у каждого остаются отдельные eval-гейты.
- [ ] **UR-118** (строка 118; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 5–6: подключить настоящий voice runtime и native ASR/VAD/TTS только после лицензий и воспроизводимого hardware benchmark.
- [ ] **UR-119** (строка 119; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 7–8: подключить реальную telemetry timeline, authenticated UI API и cloud integration только после backend contract/security review.
- [ ] **UR-169** (строка 169; Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты): На каждое изменение статуса дополнить eval-отчёт командой, результатом, sample size, SHA и rollback; обновить PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md и соответствующий отчёт.
- [ ] **UR-174** (строка 174; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Прогнать python -m compileall -q gateway, python -m pytest -q gateway/tests, python gateway/evals/run_six_layer_eval.py и лицензионный CI gate на текущем состоянии ветки.
- [ ] **UR-175** (строка 175; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Проверить provenance каждого реально поставляемого артефакта: точный источник, применимая лицензия модели/голоса, SHA-256. TBD/непроверенные hashes не могут отмечаться как ship-enabled.
- [ ] **UR-176** (строка 176; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Измерить на целевом хосте cold/warm p50/p95/p99, RTF, RAM/PSS, аудиодропы, CER/WER и regression sample counts до любых performance claims.
- [ ] **UR-177** (строка 177; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Развёртывание VPS, DNS, OAuth secrets и создание billable infrastructure не выполнять без актуального account access/проверенных параметров и отдельного согласованного действия.
- [ ] **UR-191** (строка 191; Gate перед финальным ответом): Пересверить весь этот To do и таблицу ID с текущим HEAD после завершения всех workflows; подробный аудит четырёх частей манифеста — `docs/V016_IMPLEMENTATION_CHECKLIST.md` (81 пункт, §§0–40).
- [ ] **UR-192** (строка 192; Gate перед финальным ответом): Указать раздельно: фактически внедрено, проверено CI, подтверждено live, измерено benchmark, осталось prototype/deferred/blocked.
- [ ] **UR-193** (строка 193; Gate перед финальным ответом): Не объединять PR и не сообщать о публикации до зелёных релевантных workflow и проверки merge result.
- [ ] **UR-201** (строка 201; I. Следующие продуктовые вертикали): На целевом gateway включить ALANDI_MEMORY_GRAPH_ENABLED=true только после резервной копии и smoke-test; ALANDI_GLOBAL_MEMORY_ENABLED оставить false.
- [ ] **UR-202** (строка 202; I. Следующие продуктовые вертикали): Первый месяц не создавать платные ресурсы автоматически: GitHub Pages + уже имеющееся железо + Ollama локально; free-tier API считать квотируемым и внешним, не гарантированно бесплатным.
- [ ] **UR-203** (строка 203; I. Следующие продуктовые вертикали): Оценить одну маленькую helper-модель для классификации, извлечения фактов, кратких сводок и чернового ранжирования. Главная модель остаётся для планирования, сложного reasoning и синтеза. Сравнить качество, latency и RAM перед включением.
- [ ] **UR-204** (строка 204; I. Следующие продуктовые вертикали): Добавить генерацию изображений отдельным модулем после выбора реального backend (локальный ComfyUI/API или явно выбранный внешний провайдер), проверки точной модели/лицензии/VRAM и mock E2E.
- [ ] **UR-205** (строка 205; I. Следующие продуктовые вертикали): Не добавлять скрытый refusal-фильтр поверх выбранной модели; не обещать «никогда не отказывает»: поведение checkpoint и правила внешнего API не контролируются приложением.
- [ ] **UR-206** (строка 206; I. Следующие продуктовые вертикали): Перед переходом на платный сервер сравнить baseline с измерениями p50/p95, RAM, качества, устойчивости, квот и месячной стоимости; менять endpoint/model config без смены контракта UI.
- [ ] **UR-213** (строка 213; Supplement — 2026-10-24 owner quickstart and chat ergonomics): Real voice capture/ASR/TTS, image/video pipelines and complete document ingestion remain separate unimplemented work; see `docs/IMPLEMENTATION_ROADMAP_RU.md` and the original V-016 evidence ledger.
- [ ] **UR-225** (строка 225; Supplement — 2026-10-24 project navigation and composer): Real device verification: touch long-press/cancel, mobile keyboard focus/viewport reset, screen reader flow, and large file handling.
- [ ] **UR-226** (строка 226; Supplement — 2026-10-24 project navigation and composer): Implement real file intake pipeline for PDF/DOCX/XLSX/OCR/audio/video metadata before claiming all formats are supported.
- [ ] **UR-235** (строка 235; Supplement — local helper memory suggestions (2026-10-27)): Live inference, selected/installed VPS model, output quality, RAM and latency remain unverified.
- [~] **UR-243** (строка 243; Supplement — reconciliation of the older mobile and interface request (2026-10-27)): Next bounded slice: edge-aware chat-row/popover placement and compact header order/project label/clock polish. Keep these separate from provider/project export-import cleanup and per-chat settings audit.
- [ ] **UR-244** (строка 244; Supplement — reconciliation of the older mobile and interface request (2026-10-27)): Run native iPhone Safari/keyboard/touch verification separately; passing Chromium viewport simulation is not proof of native behavior.
- [ ] **UR-251** (строка 251; Supplement — autonomous agent orchestration research (2026-10-28)): Reconcile current main and open PRs before code changes; audit actual runtime paths rather than relying on module names.
- [ ] **UR-252** (строка 252; Supplement — autonomous agent orchestration research (2026-10-28)): Implement task contract/state machine and tests in a bounded PR.
- [ ] **UR-253** (строка 253; Supplement — autonomous agent orchestration research (2026-10-28)): Select and verify a real sandbox before allowing arbitrary command/code execution.
- [ ] **UR-254** (строка 254; Supplement — autonomous agent orchestration research (2026-10-28)): Add adversarial/golden evaluations, crash/restart and idempotency tests; measure target-host RAM/latency.
- [ ] **UR-255** (строка 255; Supplement — autonomous agent orchestration research (2026-10-28)): Update PROJECT_STATE.yaml and EVALS.md only with verified implementation/test evidence. Research/documentation completion does not mean runtime implementation.
- [ ] **UR-259** (строка 259; Supplement — voice model landing and VPS owner steps (2026-10-28)): After PR #75 exact-head CI passes and the code is merged, deploy that exact code revision to the VPS; GitHub Pages deployment alone does not update the private gateway.
- [ ] **UR-260** (строка 260; Supplement — voice model landing and VPS owner steps (2026-10-28)): On the VPS, inspect OS/architecture/RAM/disk before installing Python 3.12+, ffmpeg/ffprobe, whisper.cpp, Piper and selected local model artifacts.
- [ ] **UR-261** (строка 261; Supplement — voice model landing and VPS owner steps (2026-10-28)): Download only upstream-verified, license-reviewed artifacts; record exact source/version/license/SHA-256. For Piper, verify matching `.onnx` + `.onnx.json`; do not auto-download models from user requests.
- [ ] **UR-262** (строка 262; Supplement — voice model landing and VPS owner steps (2026-10-28)): Configure `/etc/alandi-gateway.env` with `0600` permissions; keep ASR/TTS flags false until binaries, models and authenticated capabilities are checked. Then enable one feature at a time and restart the service.
- [ ] **UR-263** (строка 263; Supplement — voice model landing and VPS owner steps (2026-10-28)): Validate the real microphone → editable transcript → explicit send → same-chat response → local TTS playback/voice choice/Stop path on the target device; record RAM, latency and speech quality.
- [ ] **UR-264** (строка 264; Supplement — voice model landing and VPS owner steps (2026-10-28)): Never share secrets or full env files in chat. SSH/VPS access is not available through the current GitHub integration, so server-side installation must be executed by the owner using the runbook.
- [ ] **UR-271** (строка 271; Supplement — consolidated interface cleanup, 2026-10-30): Native iPhone Safari keyboard, safe-area, touch and accessibility checks remain manual gates. Chromium geometry assertions do not establish native iOS behavior.
- [ ] **UR-272** (строка 272; Supplement — consolidated interface cleanup, 2026-10-30): Live aLandi gateway, third-party provider credentials, external connectors, independent agent teams and production voice transport are not verified by these UI changes.
- [ ] **UR-278** (строка 278; Supplement — sidebar hierarchy and preferences, 2026-10-30): Native iPhone Safari keyboard, safe-area, focus, touch and screen-reader behavior remain unverified. Live gateway, provider credentials, connector sync, independent agent teams and voice transport remain separate runtime/infrastructure gates.
- [ ] **UR-284** (строка 284; Supplement — orthogonal chat settings and Research Studio, 2026-10-30): Native iPhone Safari behavior and live gateway/provider execution remain separate manual/runtime gates.
- [ ] **UR-290** (строка 290; Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30): Run a real target-host comparison with identical model artifact/digest/license, quantization, context, hardware and repetitions. Record RAM/PSS, cold/warm latency, p50/p95, tokens/s where available and human-rated RU/EN/TH task quality.
- [ ] **UR-291** (строка 291; Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30): Keep the main model responsible for planning, complex reasoning and synthesis. Evaluate at most one optional helper for bounded extraction/classification/summarization; helper remains off by default and cannot authorize tools or approve side effects.
- [ ] **UR-302** (строка 302; Supplement — V1 landing and interface finalization, 2026-10-30): Native iPhone Safari, keyboard, safe-area, screen-reader and touch verification remain manual gates.
- [ ] **UR-303** (строка 303; Supplement — V1 landing and interface finalization, 2026-10-30): Issue #111 remains open for owner-only ruleset, VPS/hardware, live gateway/model, RAG corpus, voice/device and sandbox gates. CI alone cannot close it.

### V016 — GEN1 / CRAZE V-016

Источник: [`docs/V016_IMPLEMENTATION_CHECKLIST.md`](../docs/V016_IMPLEMENTATION_CHECKLIST.md)

- [ ] **V016-152** (строка 152; P1 — required next implementation slices): Add automated two-project isolation, deletion propagation, global opt-in and export/import tests against the backend memory graph.
- [ ] **V016-153** (строка 153; P1 — required next implementation slices): Add a formal safety-first prompt composer (safety/workspace/project/profile/user), with prompt-injection regression tests.
- [ ] **V016-154** (строка 154; P1 — required next implementation slices): Add a privacy-only/local-only routing policy that blocks remote APIs and makes refusal explicit.
- [ ] **V016-155** (строка 155; P1 — required next implementation slices): Add route/router error tests for Grok/xAI, Kilo keyless route, 401/403/429/5xx, CORS failures, abort and malformed bodies.
- [ ] **V016-156** (строка 156; P1 — required next implementation slices): Complete RU/EN translation of settings help, errors, traces, project controls and all interactive labels.
- [ ] **V016-157** (строка 157; P1 — required next implementation slices): Audit keyboard navigation, contrast, mobile composer movement, safe-area and reduced-motion support.
- [ ] **V016-160** (строка 160; P2 — V-016 engineering blockers; do not advertise as production): Implement and test deterministic artifact-manifest hashing + complete INTEL triad gate.
- [ ] **V016-161** (строка 161; P2 — V-016 engineering blockers; do not advertise as production): Implement typed risk-aware router and route-regret evaluation corpus.
- [ ] **V016-162** (строка 162; P2 — V-016 engineering blockers; do not advertise as production): Implement ALBF binary framing with CRC/truncation/overflow/interrupt tests.
- [ ] **V016-163** (строка 163; P2 — V-016 engineering blockers; do not advertise as production): Implement native audio capture/inference adapters and measure e2e p50/p95 + PSS on the target 8 GB CPU host.
- [ ] **V016-164** (строка 164; P2 — V-016 engineering blockers; do not advertise as production): Resolve every model/voice license/hash before packaging any weights.
- [ ] **V016-165** (строка 165; P2 — V-016 engineering blockers; do not advertise as production): Harden cPocket rollback/TTL/cancellation races; do not enable speculative side-effect tools.
- [ ] **V016-166** (строка 166; P2 — V-016 engineering blockers; do not advertise as production): Add crypto-erasure semantics and prove logical vs physical deletion guarantees.
- [ ] **V016-167** (строка 167; P2 — V-016 engineering blockers; do not advertise as production): Add scratch-file offload, secure document ingestion, exact page/offset/hash citations and retrieval benchmarks.
- [ ] **V016-168** (строка 168; P2 — V-016 engineering blockers; do not advertise as production): Keep CLI/browser runtime blocked until real sandbox/SSRF/approval escape tests pass.
- [ ] **V016-169** (строка 169; P2 — V-016 engineering blockers; do not advertise as production): Implement 12-state research workflow and claim-to-evidence citation validation.
- [ ] **V016-170** (строка 170; P2 — V-016 engineering blockers; do not advertise as production): Implement candidate-lessons pipeline with golden tests and rollback; no automatic weight training.
- [ ] **V016-171** (строка 171; P2 — V-016 engineering blockers; do not advertise as production): Implement optional connectors only after encrypted token storage, scope review, revoke and index cleanup.
- [ ] **V016-172** (строка 172; P2 — V-016 engineering blockers; do not advertise as production): Keep infrastructure and hardware targets as documentation until the required access and measurement environment exist.
- [~] **V016-186** (строка 186; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-AGENT-004 — Small helper model:** design plus synthetic RU/EN/TH response/latency smoke harness (`gateway/evals/run_local_model_benchmark.py`); Gateway Tests passed on PR #123 code head. Target-host quality/RAM/PSS/cold-warm benchmark and model selection remain pending. No general helper/subagent dispatch is wired into runtime.
- [ ] **V016-187** (строка 187; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-IMAGE-001 — Image generation:** no working image-generation UI/runtime exists yet. Select local ComfyUI or explicit external provider, verify exact checkpoint/license/hash/VRAM and add request-to-image E2E before marking implemented.
- [ ] **V016-188** (строка 188; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-OPS-001 — Free-first month:** no automatic paid resource provisioning. Use existing hardware and optional free-tier APIs with explicit quota/privacy caveats; paid hosting only after benchmark and owner decision.
- [ ] **V016-189** (строка 189; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-MODEL-001 — Local-model autonomy:** no hidden application-level refusal filter is planned. Actual refusals remain checkpoint/provider-dependent; do not claim guaranteed zero refusals.
- [ ] **V016-198** (строка 198; Supplement — legacy mobile and interface request, 2026-10-29): Native iPhone Safari, software keyboard, edge-swipe and touchcancel behavior remain unverified. Do not mark complete based only on Chromium.
- [ ] **V016-206** (строка 206; Supplement — consolidated interface closure, 2026-10-30): Native iPhone Safari keyboard/safe-area/focus and real touch interaction remain unverified. Provider credentials, live gateway, connector OAuth/sync, independent agent processes and full audio transport remain infrastructure/runtime gates rather than UI acceptance claims.
- [ ] **V016-213** (строка 213; Supplement — sidebar hierarchy and preference synchronization, 2026-10-30): Real iPhone Safari keyboard/touch/accessibility behavior remains unverified; Chromium tests cover DOM order, live status updates and cross-surface preference synchronization only.
- [ ] **V016-218** (строка 218; Supplement — orthogonal chat settings, 2026-10-30): Exact-head tests must pass for Quick+Expanded, Thorough+Standard, Thorough+Off, RU/EN, per-chat persistence and Research Studio non-mutation before merge.
- [ ] **V016-219** (строка 219; Supplement — orthogonal chat settings, 2026-10-30): Native iPhone Safari and live gateway/provider behavior remain unverified.

### LAUNCH — Общий backlog первого запуска

Источник: [`docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md`](../docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md)

- [ ] **LAUNCH-110** (строка 110; Автоматические проверки на точном PR HEAD): Integrity: HTML structure, JS parse, immutable Action SHAs.
- [ ] **LAUNCH-111** (строка 111; Автоматические проверки на точном PR HEAD): Security: no credentials, safe markdown, safe provider routing and tools.
- [ ] **LAUNCH-112** (строка 112; Автоматические проверки на точном PR HEAD): Context: bounded memory/context/tool-loop behavior.
- [ ] **LAUNCH-113** (строка 113; Автоматические проверки на точном PR HEAD): Jekyll build: root app and `/landing/` output.
- [ ] **LAUNCH-114** (строка 114; Автоматические проверки на точном PR HEAD): Chromium E2E: chat, settings, project, Research Studio, provider state, export/import, landing.
- [ ] **LAUNCH-115** (строка 115; Автоматические проверки на точном PR HEAD): Landing responsive sweep: 320, 360, 390, 768, 1024, 1440 CSS px; no horizontal overflow.
- [ ] **LAUNCH-116** (строка 116; Автоматические проверки на точном PR HEAD): Landing SEO/link checks: `lang`, title, description, canonical, CTA and relative paths.
- [ ] **LAUNCH-117** (строка 117; Автоматические проверки на точном PR HEAD): Reduced-motion behavior: ticker static when OS requests reduced motion; no fake progress.
- [ ] **LAUNCH-118** (строка 118; Автоматические проверки на точном PR HEAD): Gateway contract/security tests on PRs that touch gateway.
- [ ] **LAUNCH-119** (строка 119; Автоматические проверки на точном PR HEAD): Project State Freshness exact SHA + exact live queue.
- [ ] **LAUNCH-120** (строка 120; Автоматические проверки на точном PR HEAD): License/provenance check.
- [ ] **LAUNCH-121** (строка 121; Автоматические проверки на точном PR HEAD): Graphify is developer-only artifact; inspect quality and do not ship to runtime.
- [ ] **LAUNCH-122** (строка 122; Автоматические проверки на точном PR HEAD): After merge: post-merge Pages deployment and actual published-site smoke.
- [ ] **LAUNCH-126** (строка 126; Ручные/owner gates): Native iPhone Safari: keyboard, safe area, focus, VoiceOver, touch, rotation, 320–390 width.
- [ ] **LAUNCH-127** (строка 127; Ручные/owner gates): GitHub branch rules and required checks inspected in repository settings.
- [ ] **LAUNCH-128** (строка 128; Ручные/owner gates): VPS inventory before any installation or reconfiguration; do not replace existing services blindly.
- [ ] **LAUNCH-129** (строка 129; Ручные/owner gates): Ollama model tag, digest, license, disk/RAM/PSS, cold/warm timings and concurrency=1 recorded.
- [ ] **LAUNCH-130** (строка 130; Ручные/owner gates): Gateway service listens on loopback; Ollama private on loopback; external origin accessible only through intended HTTPS Tunnel.
- [ ] **LAUNCH-131** (строка 131; Ручные/owner gates): Valid/invalid Bearer key, allowlisted model, completion, SSE, cache HIT/BYPASS, timeout and reboot tested.
- [ ] **LAUNCH-132** (строка 132; Ручные/owner gates): No prompt, user file/media body, secret or private memory in logs/traces/artifacts by default.
- [ ] **LAUNCH-133** (строка 133; Ручные/owner gates): Owner has confirmed whether the first deployment is personal/limited access; never imply public multi-user auth.
- [ ] **LAUNCH-239** (строка 239; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-13. Editable speech-to-text:** запись с микрофона, локальная транскрипция, редактирование распознанного текста до отправки, RU/EN/TH quality tests.
- [ ] **LAUNCH-240** (строка 240; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-14. Conversational voice assistant:** полноценный естественный turn-taking, streaming transcript/response, VAD, barge-in, cancellation, echo cancellation, transcript alignment. Текущий half-duplex prototype — только основа, не завершённая функция.
- [ ] **LAUNCH-241** (строка 241; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-15. Read selected text aloud:** выделение произвольного фрагмента ответа/сообщения и озвучивание только выделенного содержимого.
- [ ] **LAUNCH-242** (строка 242; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-16. Read one whole message aloud:** стабильный TTS для целого сообщения, voice choice, mini-player, pause/resume/stop, cleanup and stale-request protection.
- [ ] **LAUNCH-243** (строка 243; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-17. Read multiple selected messages aloud:** multi-select messages, ordered playback queue, pause/resume/skip/stop, cancellation and queue state; no parallel Piper jobs.
- [ ] **LAUNCH-244** (строка 244; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-18. First-release voice acceptance:** реальные microphone/speaker tests на целевых устройствах; RU/EN/TH; word error rate, first transcript latency, first audio latency, interruption latency, echo, CPU/GPU/RAM, model license and SHA-256. Без этого не обещать «почти человеческий» realtime.
- [ ] **LAUNCH-247** (строка 247; P1 — small helper models, GPU inference and agent orchestration): **P1-10. Helper model registry:** специализированные роли (classification, extraction, rerank, summary, memory candidate, skill synthesis), exact model ID/digest/license, capability, context/token budget, timeout, concurrency and eval.
- [ ] **LAUNCH-248** (строка 248; P1 — small helper models, GPU inference and agent orchestration): **P1-11. GPU inference profile:** Ollama GPU vs llama.cpp server benchmark; GPU-only inference mode must fail closed if no compatible GPU is detected. CPU still runs OS/API/orchestration; the requirement is no mandatory CPU model inference, not zero CPU usage for the whole host.
- [ ] **LAUNCH-249** (строка 249; P1 — small helper models, GPU inference and agent orchestration): **P1-12. High-throughput optional serving:** evaluate vLLM only on compatible accelerator hardware and when continuous batching/throughput materially helps. It is not the default 8-GB/single-model deployment.
- [ ] **LAUNCH-250** (строка 250; P1 — small helper models, GPU inference and agent orchestration): **P1-13. Multi-agent runtime:** bounded DAG/fan-out, queue/backpressure, per-agent scope/permissions, deadline, budget, cancellation propagation, idempotency, checkpoints, traces, retries and eval harness. Current four-stage research pipeline is not a swarm.
- [ ] **LAUNCH-251** (строка 251; P1 — small helper models, GPU inference and agent orchestration): **P1-14. Mass-agent load test:** establish safe concurrency, VRAM admission, memory residency/eviction, fairness, queue limits and degraded-mode behavior before increasing agent count.
- [ ] **LAUNCH-254** (строка 254; P1 — internal notebook / Knowledge-to-Skill): **P1-15. Knowledge-to-Skill pipeline:** authorized books, PDFs, office documents, websites and repo sources → bounded extraction → chapters/sections → source/page provenance → skill generation → injection/license scan → human review → versioned private skill.
- [ ] **LAUNCH-255** (строка 255; P1 — internal notebook / Knowledge-to-Skill): **P1-16. Skill lifecycle:** schema validation, scope isolation (personal/project), diff, versioning, rollback, deletion/retention and import/export.
- [ ] **LAUNCH-256** (строка 256; P1 — internal notebook / Knowledge-to-Skill): **P1-17. Safe ingestion:** MIME sniffing, archive/path traversal defense, XXE/bomb limits, parser timeout, temp cleanup, invisible Unicode scan, prompt injection scan and no automatic external provider fallback.
- [ ] **LAUNCH-269** (строка 269; 8. Остаток landing/app polish из актуального main): Скриншоты и визуальная проверка landing на 320/360/390/768/1024/1440 px; hero, карточки, CTA, spacing, contrast, footer.
- [ ] **LAUNCH-270** (строка 270; 8. Остаток landing/app polish из актуального main): Keyboard-only и screen-reader проверка трёх раскрываемых roadmap секций и pause controls.
- [ ] **LAUNCH-271** (строка 271; 8. Остаток landing/app polish из актуального main): Published Pages smoke после merge; canonical, ссылки и реальный deployment.
- [ ] **LAUNCH-272** (строка 272; 8. Остаток landing/app polish из актуального main): App screenshot pass desktop/mobile; typography, contrast, spacing, empty/error states, RU/EN, light/dark.
- [ ] **LAUNCH-273** (строка 273; 8. Остаток landing/app polish из актуального main): Все composer popovers на краях viewport, коротком viewport, с клавиатурой и nested scroll.
- [ ] **LAUNCH-274** (строка 274; 8. Остаток landing/app polish из актуального main): Dialog Escape/focus trap/return/scroll lock/background inert; sticky Settings actions.
- [ ] **LAUNCH-275** (строка 275; 8. Остаток landing/app polish из актуального main): Проверка дублирования chat import/export и project bundle actions.
- [ ] **LAUNCH-276** (строка 276; 8. Остаток landing/app polish из актуального main): Long names, large lists, keyboard navigation, 44px touch targets.
- [ ] **LAUNCH-277** (строка 277; 8. Остаток landing/app polish из актуального main): Functional menu отражает только реально зарегистрированные skills/agents/connectors and permissions.
- [ ] **LAUNCH-278** (строка 278; 8. Остаток landing/app polish из актуального main): Native iPhone Safari, VoiceOver, safe-area, keyboard, rotation and touch cancellation — owner gate.
- [ ] **LAUNCH-279** (строка 279; 8. Остаток landing/app polish из актуального main): Keep Native Popover API/CSS Anchor Positioning progressive enhancement only; preserve JS fallback.

### V1 — Канонический чек-лист V1 UI

Источник: [`docs/V1_UI_FINALIZATION_RU.md`](../docs/V1_UI_FINALIZATION_RU.md)

- [~] **V1-047** (строка 47; 1. Общий UI/UX — [~]): Завершить проход по типографике, контрасту, spacing, пустым состояниям, ошибкам и вторичным действиям.
- [ ] **V1-048** (строка 48; 1. Общий UI/UX — [~]): Пройти финальный визуальный screenshot-review desktop/mobile после всех изменений.
- [~] **V1-055** (строка 55; 2. Composer и мобильная клавиатура — [~]): Сохранена настраиваемая top/bottom позиция (PR #119/#121 track), но перепроверить её влияние на мобильные viewport и scroll.
- [ ] **V1-056** (строка 56; 2. Composer и мобильная клавиатура — [~]): Нативно проверить iPhone Safari: клавиатура, safe-area, focus, долгий текст, свайпы от края, ориентация экрана.
- [~] **V1-063** (строка 63; 3. Маршруты aLandi и сторонних API — [~]): В PR #121 унаследованный внутренний alandi option остаётся скрытым для миграции/совместимости. Тест должен подтверждать, что он hidden и не попадает в optgroup сторонних API; нельзя требовать его полного отсутствия в HTML.
- [ ] **V1-064** (строка 64; 3. Маршруты aLandi и сторонних API — [~]): Проверить RU/EN labels, переключение и миграцию сохранённого маршрута на текущем head.
- [~] **V1-071** (строка 71; 4. Подписи, placeholder и inline validation — [~]): Завершить единый язык placeholder/error/help для внешних API, Cloudflare и Tavily; постоянный текст оставлять только там, где он несёт важную privacy/security информацию.
- [ ] **V1-072** (строка 72; 4. Подписи, placeholder и inline validation — [~]): Проверить ошибки invalid URL, неверной модели, пустого ключа, CORS, HTTP 401/5xx и корректность redaction секретов.
- [ ] **V1-080** (строка 80; 5. System prompt и случайное редактирование — [x]): В итоговом визуальном проходе подтвердить заметность pencil/edit, focus и возврат в readonly.
- [~] **V1-086** (строка 86; 6. Инструкции сторонних провайдеров — [~]): Удалить повторяющиеся provider explanations, но оставить короткие честные privacy notices там, где данные уходят внешнему оператору.
- [ ] **V1-087** (строка 87; 6. Инструкции сторонних провайдеров — [~]): Сверить каждую ссылку/инструкцию с актуальным upstream, не выдумывать endpoint или модельный ID.
- [~] **V1-093** (строка 93; 7. Tools и Tavily — [~]): Автоматическая проверка/индикатор ключа должна быть подтверждена реальным вызовом, не только непустым полем.
- [ ] **V1-094** (строка 94; 7. Tools и Tavily — [~]): Проверить paste, сохранение, удаление, неверный ключ, публичные fallback источники, privacy copy.
- [~] **V1-101** (строка 101; 8. Статус собственного gateway — [~]): В PR #121 убрана постоянная ручная кнопка проверки; поля/лампа должны отражать валидированное соединение.
- [ ] **V1-102** (строка 102; 8. Статус собственного gateway — [~]): Проверить race/stale response, /healthz, model completion, timeout, CORS и очистку ключа на exact head.
- [ ] **V1-110** (строка 110; 9. Окна и закреплённые действия — [~]): Проверить Escape, focus return, screen reader name, scroll lock и background interaction.
- [~] **V1-116** (строка 116; 10. Скроллинг и длинные чаты — [~]): Проверить потоковую генерацию, вложенные скроллы, длинные сообщения/вложения, чат-список и модальные окна.
- [ ] **V1-117** (строка 117; 10. Скроллинг и длинные чаты — [~]): Проверить экран 320px, динамическую клавиатуру и scroll restoration на iOS Safari.
- [ ] **V1-125** (строка 125; 11. Дополнительные настройки — [x]): Завершить аудит всех secondary controls на дубли/устаревшие toggle.
- [ ] **V1-133** (строка 133; 12. Тема, язык, анимации — [~]): Проверить полную RU/EN копию, светлую тему модалок, статусов, подсказок и Roadmap.
- [~] **V1-139** (строка 139; 13. Каталог моделей и provider state — [~]): Проверить сохранение выбранной модели при refresh, invalid catalog, устаревший fingerprint, auth failure и provider switch.
- [ ] **V1-140** (строка 140; 13. Каталог моделей и provider state — [~]): Live provider smoke остаётся опциональным и требует явного согласия; mock E2E не выдавать за доступность реального аккаунта.
- [~] **V1-147** (строка 147; 14. Project settings — [~]): В PR #121 E2E должен подтвердить modal close, persistence, создание и переключение проекта после текущих исправлений.
- [ ] **V1-148** (строка 148; 14. Project settings — [~]): Реальный multi-device sync/source indexing не входит в V1; не изображать его включённым.
- [~] **V1-154** (строка 154; 15. Search & Research Studio — [~]): PR #121 удалил дублирующие prompt/depth/web selectors и показывает текущие настройки чата. Исправлена проверка E2E, которая считала первичную provider connectivity probe отправкой пользовательского сообщения; exact-head run ещё требуется.
- [ ] **V1-155** (строка 155; 15. Search & Research Studio — [~]): Проверить на 390×844, клавиатуре, RU/EN, Escape, сохранение draft и отсутствие автоматической отправки.
- [ ] **V1-156** (строка 156; 15. Search & Research Studio — [~]): Исследовательский pipeline остаётся четырёхэтапным на одной модели; UI не называть независимой swarm-командой.
- [~] **V1-163** (строка 163; 16. Task profiles / skills — [~]): Проверить quiz flow, кастомный профиль, формат результата, переключение чата и сохранение.
- [ ] **V1-164** (строка 164; 16. Task profiles / skills — [~]): Не показывать несуществующие навыки как доступные runtime-пакеты.
- [~] **V1-171** (строка 171; 17. Agents / team blueprint — [~]): Внутри соответствующей открытой панели добавлен декоративный маркер 1nv3nt10n 1n PrOc3ss… с пояснением, что это не runtime/фоновой статус.
- [ ] **V1-172** (строка 172; 17. Agents / team blueprint — [~]): Независимые роли, scheduler, policy engine, sandbox, approval и durable recovery — будущая реализация с отдельными tests/evals; не входят в V1.
- [~] **V1-178** (строка 178; 18. Финальный release gate — [~]): PR #121 был красным: duplicate settings close selectors, invalid regex in integrity sentinel и один неверный assertion around settings probe. Исправления внесены; повторный exact-head CI нужен.
- [ ] **V1-179** (строка 179; 18. Финальный release gate — [~]): Проверить точный merge SHA, post-merge Pages deploy, опубликованный лендинг и приложение.
- [ ] **V1-180** (строка 180; 18. Финальный release gate — [~]): Выполнить native iPhone Safari/keyboard/touch test вручную.
- [ ] **V1-181** (строка 181; 18. Финальный release gate — [~]): Пересверить PR/Issues. Issue #111 остаётся открытым до реальных owner-only gates (ruleset/main governance, VPS, hardware/model, voice/device, licensed data corpus); не закрывать только ради нулевой очереди.
- [~] **V1-191** (строка 191; 2. Лендинг — обязательная структура V1): Усилить copy: «бесплатный статический интерфейс» не означает «бесплатный inference», hosted AI endpoint не предоставляется.
- [~] **V1-192** (строка 192; 2. Лендинг — обязательная структура V1): Добавить открываемый Roadmap с маркером 1nv3nt10n 1n PrOc3ss… только у направлений, которые ещё разрабатываются/планируются.
- [~] **V1-193** (строка 193; 2. Лендинг — обязательная структура V1): Browser E2E на структуру/CTA, метаданные, отсутствие пустых ссылок, responsive 320/360/390/768/1024/1440px, Roadmap details и reduced-motion есть; добавлен тест pause/resume ticker (commit b213c8a); ожидается exact-head Chromium run.
- [~] **V1-194** (строка 194; 2. Лендинг — обязательная структура V1): E2E проверяет lang/title/description/canonical/CTA/непустые ссылки; Jekyll build проходит в текущем CI; фактический published Pages path требует успешного exact-head smoke после merge.

### UX — Полировка лендинга

Источник: [`docs/LANDING_UX_POLISH_BACKLOG_RU.md`](../docs/LANDING_UX_POLISH_BACKLOG_RU.md)

- [ ] **UX-016** (строка 16; Landing / публичная страница): Screenshot review 320/360/390/768/1024/1440 px: hero balance, card rhythm, line lengths, section spacing, contrast, footer and CTA.
- [ ] **UX-017** (строка 17; Landing / публичная страница): Проверить keyboard-only и screen reader чтение всех трёх раскрываемых roadmap пунктов и pause controls.
- [ ] **UX-018** (строка 18; Landing / публичная страница): Проверить опубликованный Pages, а не только PR preview/Jekyll build; ссылки и canonical после merge.
- [ ] **UX-019** (строка 19; Landing / публичная страница): Проверить светлую/тёмную тему? Landing сейчас намеренно самостоятельная тёмная публичная страница; не добавлять переключатель без требования и цельного дизайна.
- [~] **UX-023** (строка 23; Корневое приложение — визуальная иерархия): Общий screenshot review desktop/mobile после последнего PR #121.
- [ ] **UX-024** (строка 24; Корневое приложение — визуальная иерархия): Единый проход по typography, contrast, spacing, empty states, inline errors и secondary actions.
- [ ] **UX-025** (строка 25; Корневое приложение — визуальная иерархия): Полная RU/EN проверка микротекстов, подсказок, статусов, светлой темы модалок и пустых состояний.
- [ ] **UX-026** (строка 26; Корневое приложение — визуальная иерархия): Проверить pencil/edit state у system prompt и возврат в readonly.
- [ ] **UX-027** (строка 27; Корневое приложение — визуальная иерархия): Проверить touch targets (проектная цель 44×44 CSS px) и отсутствие конкурирующих controls.
- [~] **UX-031** (строка 31; Popovers, menus, dialogs): Проверить все composer popovers у четырёх краёв viewport, короткую высоту, экранную клавиатуру и nested scroll.
- [ ] **UX-032** (строка 32; Popovers, menus, dialogs): Проверить Escape, focus trap/return, accessible names, scroll lock и background inert для всех modal/dialog.
- [ ] **UX-033** (строка 33; Popovers, menus, dialogs): Sticky Save/Close в Settings при длинном scroll и мобильной клавиатуре — проверить, исправить только при воспроизводимом дефекте.
- [ ] **UX-034** (строка 34; Popovers, menus, dialogs): Native Popover API / CSS Anchor Positioning рассматривать только как progressive enhancement после support matrix; сохранить существующий JS fallback. Не мигрировать ради моды.
- [~] **UX-039** (строка 39; Sidebar, проекты, чаты): Проверить, что общий импорт/экспорт не дублируется в sidebar и project settings; chat actions остаются в chat menu, project bundle — в project settings.
- [ ] **UX-040** (строка 40; Sidebar, проекты, чаты): Длинные названия проектов/чатов, пустые списки, большое количество проектов/чатов, keyboard navigation и mobile scroll.
- [ ] **UX-044** (строка 44; Research / functions / agents): Функциональное меню «Исследование / Агенты / Навыки / Коннекторы» должно показывать только реально зарегистрированные сущности, статусы и permissions. Не рисовать fake marketplace.
- [ ] **UX-045** (строка 45; Research / functions / agents): Развести семантику web search breadth, offline mode и multi-agent orchestration в copy и UI.
- [ ] **UX-046** (строка 46; Research / functions / agents): В roadmap/agent panels сохранять чёткое различие между blueprint, sequential pipeline и независимым agent runtime.
- [~] **UX-049** (строка 49; Мобильность и доступность): Chromium responsive matrix 320/360/390/768/1024/1440 и no-overflow tests.
- [ ] **UX-050** (строка 50; Мобильность и доступность): Native iPhone Safari: visual viewport, клавиатура, safe-area, edge swipe, touchcancel, rotation, scroll restoration.
- [ ] **UX-051** (строка 51; Мобильность и доступность): VoiceOver: headings, dialogs, menus, status text, message actions, focus visibility.
- [ ] **UX-052** (строка 52; Мобильность и доступность): Reduced motion: landing ticker, app ticker, transitions and scroll behavior; проверить пользовательскую настройку вместе с OS preference.
- [ ] **UX-068** (строка 68; 3. Реализованный первый polish patch): Native keyboard/screen-reader confirmation.

### STACK — Сквозной аудит целостности стека

Источник: [`docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md`](../docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md)

- [ ] **STACK-031** (строка 31; A. Снимок и архитектурная карта): A3. Сверить все принятые решения (DECISIONS/ADRs/PROJECT_STATE) с реализованными модулями и флагами.
- [ ] **STACK-032** (строка 32; A. Снимок и архитектурная карта): A4. Построить карту модулей, входов/выходов, владельцев данных и межслойных контрактов.
- [ ] **STACK-033** (строка 33; A. Снимок и архитектурная карта): A5. Проверить циклы, дублирующие реализации, orphan modules, скрытые/неиспользуемые пути.
- [ ] **STACK-036** (строка 36; B. Сквозные взаимодействия): B1. Browser UI → request construction → provider/router → gateway → model/tool → response rendering.
- [ ] **STACK-037** (строка 37; B. Сквозные взаимодействия): B2. Identity/session/auth → scopes/permissions → memory/RAG → persistence/deletion.
- [ ] **STACK-038** (строка 38; B. Сквозные взаимодействия): B3. Search/research/evidence → citations/provenance → UI state and failure handling.
- [ ] **STACK-039** (строка 39; B. Сквозные взаимодействия): B4. Agents/ToolDAG/helper model → budgets, deadlines, cancellation, retries, approvals, idempotency.
- [ ] **STACK-040** (строка 40; B. Сквозные взаимодействия): B5. Voice/ASR/TTS/document extraction → child processes, resource bounds, cancellation, cleanup.
- [ ] **STACK-041** (строка 41; B. Сквозные взаимодействия): B6. Config/env/feature flags → startup/readiness/liveness → deploy and rollback.
- [ ] **STACK-042** (строка 42; B. Сквозные взаимодействия): B7. Browser storage ↔ server persistence, import/export, cross-project/private/shared boundaries.
- [ ] **STACK-045** (строка 45; C. Качество и безопасность): C1. Static analysis: Python typing/lint/security; JS syntax/lint/security; shell/YAML/config validation.
- [ ] **STACK-046** (строка 46; C. Качество и безопасность): C2. Dependency and supply-chain audit: direct/transitive dependencies, immutable action pins, licenses/provenance.
- [ ] **STACK-047** (строка 47; C. Качество и безопасность): C3. Security review: auth, CORS, SSRF, XML/ZIP parsing, path traversal, secrets/logging, prompt/tool injection.
- [ ] **STACK-048** (строка 48; C. Качество и безопасность): C4. Reliability: timeouts, cancellation, backpressure, concurrency, retries, partial failure, state recovery.
- [ ] **STACK-049** (строка 49; C. Качество и безопасность): C5. Performance/resource: payload sizes, browser work, DB indexes/queries, model memory/latency, process lifecycle.
- [ ] **STACK-050** (строка 50; C. Качество и безопасность): C6. Accessibility/i18n/responsive and degraded/offline/error states.
- [ ] **STACK-051** (строка 51; C. Качество и безопасность): C7. Test quality: coverage of boundaries and failure paths; detect duplicate, brittle or vacuous assertions.
- [ ] **STACK-052** (строка 52; C. Качество и безопасность): C8. Re-run all relevant exact-head checks after any accepted change.
- [ ] **STACK-055** (строка 55; D. Независимый второй взгляд и решение): D1. Подготовить независимому субагенту полный стек, решения, invariants, audit questions and output format.
- [ ] **STACK-056** (строка 56; D. Независимый второй взгляд и решение): D2. Получить реальный независимый review (если host предоставляет субагента); иначе честно зафиксировать отсутствие отдельного агента.
- [ ] **STACK-057** (строка 57; D. Независимый второй взгляд и решение): D3. Сопоставить рекомендации с локальными решениями и воспроизводимыми доказательствами.
- [ ] **STACK-058** (строка 58; D. Независимый второй взгляд и решение): D4. Отобрать только улучшения с измеримой пользой и без расширения стека.
- [ ] **STACK-059** (строка 59; D. Независимый второй взгляд и решение): D5. Внести минимальные обратимые исправления отдельными slices/PR.
- [ ] **STACK-060** (строка 60; D. Независимый второй взгляд и решение): D6. Обновить ориентиры, project state, decision/eval records и volley log после каждого подтверждённого этапа.

## B. Новые задачи по указанию владельца (2026-10-31)

- [ ] **CONT-001**: Единый устойчивый протокол непрерывности: корневой ориентир, мастер-реестр, стабильные ID, обязательное обновление после этапов, восстановление по GitHub и файлам.
- [ ] **AGENT-001**: Исследовать и спроектировать реальную параллельную multi-agent архитектуру: минимум 5 одновременно исполняемых независимых workers поверх главной модели; масштабирование выше 64 и до сотен/тысяч логических workers через очереди, leases, backpressure и распределённые workers.
- [ ] **AGENT-002**: Сравнить Agensh (до 1,024 workers), Hive, DeerFlow, Open Multi-Agent, AgentTeams, OpenAI Agents SDK, Swarms, Octos и новые upstream; проверить первичные репозитории, бумаги, лицензии, adoption и ограничения.
- [ ] **AGENT-003**: Расширить профессию/skill/capability registry: 64 роли оставить как один seed-набор, но поддержать динамические профили, пользовательские профессии, composable skills и capability discovery без жёсткого потолка.
- [ ] **AGENT-004**: Спроектировать durable AgentRun: persistence, checkpoints, leases, retries, cancellation, approvals, idempotency, isolation, event journal, budgets, tracing, independent verification.
- [ ] **AGENT-005**: Проверить параллельную работу разных моделей и главной модели без требования держать отдельный checkpoint на каждого worker; model routing, batching, queue fairness, resource-aware scheduling.
- [ ] **VERT-001**: Проверить VERT-sh/vert, vertd, WASM converters, engine routing, format coverage, local privacy, AGPL/GPL licensing; решить, что переиспользовать как идеи/engines, а не встраивать UI wholesale.
- [ ] **VERT-002**: Сравнить более лёгкий conversion stack: существующий pypdf/docx/xlsx extraction, Pandoc, LibreOffice headless, FFmpeg, ImageMagick и browser WASM; отдельно user-facing conversion и model-facing normalization.
- [ ] **VERT-003**: Сформировать безопасный conversion contract: MIME/signature sniffing, limits, async workers, timeouts, temp cleanup, no-store, provenance, conversion preview, loss warnings, supported pairs and license manifest.
- [ ] **TOK-001**: Полный аудит generation/output limits, history/context budgets, truncation, stop sequences, finish_reason, provider compatibility, streaming completion and reasoning settings.
- [ ] **TOK-002**: Разделить safety/resource bounds на input/file/context/tool orchestration vs искусственные ограничения длины ответа/размышления; не обрезать ответ модели ради внутреннего формата aLandi.
- [ ] **TOK-003**: Разработать provider-aware output handling: не посылать max_tokens/max_completion_tokens/max_output_tokens по умолчанию без нужды; уважать provider/model context; detect length/incomplete; продолжать безопасно только если continuation semantics подтверждены.
- [ ] **DR-001**: Создать отдельный deep-research PR/ветку: многопроходный поиск, первичные источники, GitHub discovery, adoption signals, papers, issue/release activity, security/licensing, practitioner evidence.
- [ ] **DR-002**: Собрать ранее выбранные источники из temp/1, temp/2, existing research catalogues and user-provided repositories; dedupe and classify by idea, implementation, evidence and adoption.
- [ ] **DR-003**: Подготовить обновляемый research catalogue и architecture decision matrix, не копируя сторонний код/лицензии и не превращая каждую найденную технологию в зависимость.

## C. Очерёдность выполнения

1. **CONT-001** — закрепить постоянный протокол ориентирования и реестр.
2. **AGENT-001…AGENT-005** — исследование, архитектура и reviewable design агентной платформы; runtime не внедрять до проверки и отдельного принятия Phase 1.
3. **VERT-001…VERT-003** — архитектура конвертации и лицензии.
4. **TOK-001…TOK-003** — проверить реальные пути генерации, отличить output truncation от bounded tool orchestration и подготовить безопасные исправления.
5. **DR-001…DR-003** — отдельный глубокий research workstream и каталог доказательств.
6. Сопоставить дубликаты старых задач с текущей реализацией, PR, тестами и owner-only gates.

## D. Состояние репозитория на момент миграции (GitHub, 2026-10-31)

- Базовый main: `e78a73b25725bfa63370d9946887cbbacbf51b82` (merge PR #123).
- Открытые PR: #124 (dependency lock/matrix), #125 (agent-platform research/design, Draft), #126 (code-currency/dependency audit, Draft).
- Открытый Issue: #111 (owner/live-host release gate).
- Ни один PR не считается merged, пока GitHub не показывает merge commit в актуальном default branch.
- При каждом рабочем заходе SHA и очередь перепроверяются в GitHub; этот снимок — историческая точка, не live truth.

## E. Следующее действие

Обновить корневой `ORIENTER.md`, чтобы он ссылался на этот реестр; синхронизировать подробный ориентир и machine-readable state/snapshot в continuity PR. Затем расширить исследование агентной платформы в PR #125; VERT/conversion и output-limit audit вести отдельными проверяемыми срезами.
