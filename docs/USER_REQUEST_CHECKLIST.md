# aLandi — постоянный реестр запроса и Definition of Done

Этот файл — рабочая контрольная точка для пользовательского запроса от 2026-10-23 и инженерного манифеста GEN1 / CRAZE V-016. Он намеренно различает **код написан**, **CI прошёл**, **реальная инфраструктура доступна** и **производительность измерена**.

Статусы: `[x]` подтверждено тестом/проверкой; `[~]` реализовано в текущей ветке, ожидает CI или проверки поведения; `[ ]` не реализовано либо не подтверждено. Нельзя переводить функцию в `[x]` лишь потому, что добавлена разметка или документ.

## A. База, управление и непрерывность
- [x] PR #20 с базовыми контрактами памяти, инструментария, происхождения источников и governance объединён; CI прошёл.
- [x] Создана ветка для облачной настройки/UX: `feat/alandi-cloud-settings-ux`.
- [x] PRs #21–#29 merged with required PR-head gates passing. PR #32 then merged at `31eecce8203073dbc8e0e46b3ac338f64788d59b`; all six PR-head jobs passed, including Chromium regression, integrity/security/context sentinels, Jekyll build and published Pages browser smoke. Added safe structured Markdown fallback when CDN renderer libraries are unavailable. Gateway contract/security tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708`. Live gateway/VPS and separate post-merge deployment remain unverified.
- [x] Проведён аудит V-016 §0–40 и начальной инженерной фиксации; создан подробный 81-пунктный ledger в `docs/V016_IMPLEMENTATION_CHECKLIST.md`. Аудит завершён, но многие runtime-функции ещё не реализованы/не подтверждены.
- [ ] Проверить все старые регрессии: создание чата, история, экспорт/импорт, отмена, повтор запроса.
- [ ] Обновить сведения о реальном состоянии системы: код, контракт, эксперимент, развёрнутая служба, измеренная метрика.

## B. Первичное облако aLandi и API-провайдеры
- [x] Зафиксировано продуктовое правило: aLandi Cloud — единственный главный облачный блок; Kilo остаётся обычным альтернативным провайдером в общем списке, без отдельной главной кнопки.
- [x] Собственное облако aLandi — единственная кнопка/главная карточка в верхней части настроек; Kilo и остальные альтернативы расположены только в общем списке сторонних провайдеров.
- [~] Начальный статус облака — красный/неподтверждённый; зелёный возможен лишь после реального модельного ответа и успешной `/healthz`-проверки при следующем запуске. Живой пользовательский gateway ещё не сконфигурирован.
- [~] Хранить адрес, модель и ключ aLandi отдельно; не считать наличие ключа доказательством связи.
- [~] Проверять сохранённое соединение при запуске через health-check, а не доверять вечному старому зелёному статусу.
- [~] Перенести старые настройки провайдеров в свёрнутый дополнительный раздел.
- [~] Вынести ключ Tavily в под-раздел инструментов и веб-поиска.
- [~] Добавить кнопку вставки для ключей провайдера и своего gateway.
- [~] После явной вставки ключа запускать один ограниченный refresh каталога и тест соединения.
- [~] Блокировать конкурирующие одновременные тесты подключения.
- [x] Проверено: async-проверка не подтверждает другой провайдер/модель/ключ после их смены; legacy-проверка aLandi не перезаписывает отдельно изменённую главную облачную карточку. Deterministic race E2E прошли в PR #22 (HEAD `bd8fdddd…`) и post-merge Quality Sentinel прошёл на main `7fac23ce…`.
- [~] При явной ошибке доступности модели искать не более трёх альтернатив того же провайдера.
- [~] Не делать retry альтернативных моделей на 401/403, 429, сетевой ошибке или общем сбое API.
- [~] Принимать корректные текстовые массивы, refusals/tool-calls и варианты совместимого ответа, не путать валидный JSON-envelope с ошибкой формата.
- [~] Kilo Auto Free доступен как обычный альтернативный провайдер в общем списке: без ключа, только по явному выбору и без скрытого fallback. Официальная документация предупреждает, что промпты могут поступать провайдерам, которые логируют их/используют для улучшения моделей; конфиденциальные данные туда не отправлять. См. `docs/V016_IMPLEMENTATION_CHECKLIST.md` и [официальное предупреждение Kilo](https://kilo.ai/docs/getting-started/using-kilo-for-free).
- [ ] Обновить все модельные ID по официальным динамическим каталогам; статические preset считать только fallback.
- [ ] Провести E2E-проверку реального пользовательского выбора Kilo и документацию об обработке данных сторонним шлюзом.
- [x] All-provider smoke workflow требует явного подтверждения (default false) и поддерживает per-provider model overrides; PR #25 quality/provenance CI passed. Live workflow не запускался из этой сессии; доступность аккаунтов не утверждается.
- [ ] Проверить официальные endpoints, CORS, лимиты, схему аутентификации и формат ошибок каждого сохранённого провайдера.
- [ ] Никогда не переносить ключи из одного провайдера в другой и не экспортировать ключи в settings-profile.

## C. Главный экран, визуальная система и язык
- [~] Переоформить шапку в бренд aLandi и перенести название активного чата в подпись.
- [~] Добавить пасхалку «a land i → i land AI».
- [~] Добавить реальные цифровые часы и аналоговые стрелки с дискретным обновлением.
- [~] Добавить основной переключатель тёмной/светлой темы на главном экране.
- [~] Добавить RU/EN переключатель и сохранять выбранный язык.
- [~] Обновить шрифтовой fallback без обязательной внешней загрузки; улучшить радиусы и состояния элементов.
- [~] Реализовать центрирование поля ввода в пустом чате и увеличение высоты по мере ввода.
- [~] Перемещать длинный черновик из центрального режима в привычную нижнюю позицию.
- [~] Добавить ограниченное прикрепление текстовых файлов (.txt, .md, .csv, .json, .log) с размерными лимитами.
- [~] Мобильная кнопка голоса, удержание и свайп покрыты успешным PR #21 Chromium E2E. Это только preview: микрофон, ASR, TTS, AEC и аудиотранспорт не подключены.
- [ ] Полностью пройти мобильную/настольную проверку размеров и областей касания.
- [ ] Проверить клавиатурную доступность, visible focus, контраст, screen reader и reduced-motion.
- [ ] Перевести все пользовательские надписи, подсказки и ошибки интерфейса; текущий RU/EN перевод неполный.
- [~] Сокращены ключевые инструкции настроек: cloud/API, ключи, CORS, контекст и веб-поиск. Полный аудит всех подсказок и согласование RU/EN ещё не завершены.
- [ ] Провести визуальную регрессию desktop/mobile и проверить, что анимации не мешают длинному вводу.

## D. Чаты, проекты, инструкции и память
- [~] Project CRUD присутствует в клиенте: создать, переименовать/редактировать, удалить с подтверждением; повторно проверить E2E на текущей ветке.
- [~] Проектные инструкции редактируются и добавляются в контекст как предпочтения, не как политика безопасности; подтвердить тестами precedence.
- [~] Текущий чат можно привязать/отвязать от проекта; проектная принадлежность видна в интерфейсе.
- [~] Есть экспорт/импорт project bundle с чатом, инструкциями и памятью; проверить схему, duplicate IDs, limits, malicious content.
- [~] Global memory и project memory имеют отдельные явные toggles; default выключен; подтвердить, что global facts не утекут в другой project scope.
- [~] Server memory graph API and opt-in browser bridge are implemented and CI-verified. Browser projects remain local-first; only a manual upload sends facts as server-side candidates, and only confirmed facts in the exact project scope can be retrieved when both per-chat toggles are enabled. Multi-device project sync and live gateway activation remain unverified.
- [ ] Реализовать authenticated API/индексацию project sources только после согласованного backend contract; не имитировать работающий индекс на пустой заглушке.
- [ ] Добавить/проверить тест cross-project leak на серверной памяти, RAG, evidence, cache и deletion — где соответствующие слои существуют.
- [~] RAG source deletion is scope-checked and removes chunk/concept/FTS rows; SQLite `secure_delete` plus version-gated FTS5 `secure-delete` regression tests passed on PR #24 HEAD and post-merge main. This still does **not** erase evidence-ledger copies, WAL/journals, backups or browser-local source copies; system-wide crypto-erasure remains open.
- [ ] Проверить экспорт, исправление и удаление пользовательских фактов и связанные derived records.
- [ ] Реализовать удаление/криптостирание по всем реальным слоям; не обещать SLA ≤60 секунд без измерения.
- [x] Scoped memory FTS5 `search_nodes()` is merged and passed Gateway/provenance/full quality/Chromium/Pages PR-head checks. The index is scope-filtered; terms are bounded/literal; confirmed-only is default; deletes propagate and legacy index is backfilled. PR #27 adds opt-in authenticated routes, but the static UI still uses browser-local memory.
- [x] PR #27 merged with Gateway, provenance and full Quality/Chromium/published Pages CI green on HEAD `e961a67d…`. Memory graph API remains feature-flagged, single-owner and not wired to browser UI.
- [ ] Протестировать valid_from, valid_until, recorded_at, конфликты, supersede и scoped recursive delete в gateway memory prototypes.
- [ ] Полноценный viewer источников/индекса, citation lineage и cross-device project memory остаются задачами последующих фаз.

## E. Инструменты, маршрутизация, веб-поиск и отказы
- [~] Сохранить ограничение по числу шагов инструментов и исследовательских вызовов; не запускать неограниченный retry loop.
- [~] Сохранить явный opt-in для fallback к другому облачному провайдеру.
- [ ] Проверить все циклы tool-calls на max rounds, общий deadline, cancellation, bounded concurrency и корректное продолжение assistant/tool messages.
- [ ] При ошибке инструмента пробовать совместимый способ/альтернативный инструмент только в пределах явного policy и бюджета.
- [ ] Показывать правдивую timeline событий: фактический вызов, источник, duration, результат, ошибка; не показывать скрытые рассуждения.
- [x] Ограниченный fallback web_search на открытые источники реализован и прошёл Chromium E2E без Tavily-ключа. Недоступные источники пропускаются; ссылки берутся из реальных ответов. Доступность API всё ещё зависит от CORS/сети.
- [ ] Внедрить 12-шаговый Deep Research state machine, повторный поиск при пробелах и проверку утверждений против ссылок.
- [ ] Проверить prompt-injection в проектных инструкциях и загруженных документах.
- [ ] Проверить SSRF/redirect protections, MIME/size/time limits, безопасную очистку временных файлов и отсутствие секретов в логах.
- [ ] Не кэшировать streaming, tool calls, web research, multimedia, errors или partial outputs.
- [ ] Проверить точную инвалидацию exact cache при изменении prompt, project instructions или tool schema.
- [ ] Измерить retry rate, повторные дубликаты, частоту 429/5xx, latency и успешность tool-циклов.

## F. V-016: зависимости, аудио, память, бюджеты и лицензии
- [x] Детерминированный state hash реализован и проверен CI: сортированные пути и SHA-256 содержимого, исключение типовых секретов/генерируемых каталогов, `index.md` включён. Это не подпись и не доказательство безопасности.
- [ ] Проверить CI-гейт триады: точный проверенный URL + лицензия конкретного артефакта + источник технического утверждения.
- [ ] Не включать модели/голоса в установщик до проверки точной лицензии, весов, voice artifact и checksums.
- [ ] Внедрить ALBF binary framing только вместе с real transport и тестами на усечение, CRC, max payload и cancellation.
- [ ] Сделать bake-off ASR/TTS с измерением RTF, first audio, e2e p95 и потребления PSS; не опираться на неподтверждённые цифры.
- [ ] Подтвердить native audio capture/processing прежде, чем обещать отсутствие PCM/аудио hotpath в Python.
- [x] cPocket hardening merged in PR #28; gateway contract/security tests passed on post-merge main `e424d353418cad62981eb269b4082d2925592708`. Cap 128 cleanup registrations per lease; cleanup continues after RuntimeError/CancelledError and rollback is tested for exactly-once behavior. Target-runtime resource/FD soak and live voice integration remain unverified.
- [ ] Проверить безопасную изоляцию tool workspace; не называть subprocess без sandbox production-изоляцией.
- [ ] Проверить scope isolation, no-PII logs, prompt priority stack и fail-safe privacy policy.
- [ ] Измерить профиль laptop_8gb_cpu_mvp на целевом 8-GB железе, включая combined LLM+RAG+tools и cold-tier eviction.
- [ ] Не заявлять p95 900/2500 ms, regret ≤1.25, PII leak=0 или crypto-erase SLA, пока нет воспроизводимых evals.
- [ ] Полностью пересмотреть список зависимостей/отклонённых технологий в V-016 и не вводить CUT/PAT items как production-зависимости.
- [ ] Проверить Third-party NOTICE и права распространения каждой включённой библиотеки/модели.

## G. Выпуск и финальный аудит
- [ ] Пройти Jekyll build, quality sentinels, browser Chromium tests, accessibility/interaction tests и provider-specific deterministic E2E.
- [ ] Проверить без реальных секретов: malformed response, 400/404 model missing, 401/403 auth, 429, 5xx, timeout, CORS, offline and cancelled request.
- [ ] Проверить, что новая ветка не меняет чужую конфигурацию, историю, секреты или сохранённые настройки молча.
- [ ] После merge проверить main SHA, успешные workflows и опубликованную GitHub Pages версию.
- [ ] Перепроверить каждый пункт этого реестра перед итоговым отчётом; явно перечислить незавершённое и неподтверждённое.


## H. Четырёхчастный аудит манифеста — без потерянных пунктов

Этот раздел связывает пользовательский To do с четырьмя наборами источников, перечисленными в CODER_PACKET.md. Статусы ниже — статус кода/контракта, не подтверждение production deployment.

### Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8
- [x] Прочитаны разделы 1–8: канонические источники, non-negotiable contracts, текущая архитектура, план фаз 0–8, voice latency, model/license policy, eval/release gates и non-goals.
- [x] Зафиксированы ограничения: не выдавать prototype за live, не обещать p95 без измерения, no fake sandbox, no fake citation checks, tool approval/SSRF, scoped deletion, локальный аудиотракт и отсутствие автоматического cloud provisioning.
- [~] Фазы 0–4: gateway/trace, scoped temporal memory, FTS5/evidence/citations и tool safety имеют foundations/prototypes; у каждого остаются отдельные eval-гейты.
- [ ] Фазы 5–6: подключить настоящий voice runtime и native ASR/VAD/TTS только после лицензий и воспроизводимого hardware benchmark.
- [ ] Фазы 7–8: подключить реальную telemetry timeline, authenticated UI API и cloud integration только после backend contract/security review.

### Part II — PROJECT_STATE.yaml: каждый принятый ID, отклонения и блокеры
| ID | Текущее состояние из PROJECT_STATE.yaml | Артефакт | Eval gate |
|---|---|---|---|
| **AI-VOICE-001** | conditional_interface_only | gateway/voice/native_core_interface.py | EV-VOICE-001; benchmark pending |
| **AI-VOICE-002** | prototype | gateway/voice/cpocket.py | EV-CPOCKET-001 |
| **AI-VOICE-003** | target_unmeasured | docs/LATENCY_CONTRACT.md | EV-VOICE-002 |
| **AI-VOICE-004** | read_only_prototype | gateway/voice/speculative_transaction.py | EV-SPEC-001 |
| **AI-VOICE-005** | candidate_license_review_pending | evals/voice/language_matrix_v2.yaml | EV-LANG-001 |
| **AI-VOICE-006** | decision_module_not_live | gateway/voice/tier_router.py | EV-VOICE-003 |
| **AI-VOICE-007** | policy_only_no_native_aec | gateway/voice/barge_in.py | EV-VOICE-004 |
| **AI-VOICE-008** | proposed_experiment | gateway/voice/endpoint_heuristic.py | EV-ENDPOINT-001 |
| **AI-INFRA-001** | optional_manual_path_no_vm_created | docs/INFRASTRUCTURE_UPGRADE.md | EV-INFRA-001 |
| **AI-INFRA-002** | manual_instructions_no_dns_changed | docs/DOMAIN_SETUP.md | EV-INFRA-002 |
| **AI-INFRA-003** | target_profile_unmeasured | infra/hardware_profiles.yaml | EV-HW-001 |
| **AI-CODE-001** | report_only | .github/workflows/dead-code-check.yml | EV-CODE-001 |
| **AI-CODE-002** | deferred_until_benchmark | gateway/evals/serialization_benchmark.py | EV-CODE-002 |
| **AI-CODE-003** | deferred_until_uv_lock_review | pyproject.toml | EV-CODE-003 |
| **AI-OBS-001** | prototype_integrated_in_gateway | observability/trace_context.py | EV-OBS-001 |
| **AI-OBS-002** | optional_disabled | observability/otel_config.py | EV-OBS-002 |
| **AI-OBS-003** | event_schema_only_ui_deferred | observability/events.schema.json | EV-UI-001 |
| **AI-MEM-001** | sqlite_prototype | gateway/memory/schema.sql | EV-MEM-001 |
| **AI-MEM-002** | bitemporal_primitives_not_in_frontend | gateway/memory/temporal.py | EV-MEM-002 |
| **AI-MEM-003** | scoped_manager_prototype | gateway/memory/scope.py | EV-MEM-003 |
| **AI-MEM-004** | explicit_conflicts_no_auto_winner | gateway/memory/conflict.py | EV-MEM-004 |
| **AI-MEM-005** | scoped_fts5_memory_search_prototype_merged_not_ui_wired | gateway/memory/manager.py; gateway/memory/schema.sql | EV-MEM-005 |
| **AI-MEM-006** | authenticated_single_owner_graph_api_and_manual_candidate_first_browser_bridge_ci_passed_live_activation_pending | gateway/app.py; gateway/memory/manager.py; index.md; tests/e2e/app.spec.mjs | EV-MEM-006 |
| **AI-RAG-001** | fts5_lexical_graph_not_full_lazygraphrag | gateway/rag/lazy_graph_rag.py | EV-RAG-001 |
| **AI-RAG-002** | conditional_not_installed | gateway/rag/rag_anything.py | EV-RAG-002 |
| **AI-RAG-003** | citation_hash_offset_primitives | gateway/rag/citations.py | EV-RAG-003 |
| **AI-RAG-004** | local_evidence_ledger_not_api_exposed | gateway/rag/evidence_ledger.py | EV-RAG-004 |
| **AI-TOOLS-001** | blocked_no_container_sandbox | sandbox/cli_sandbox.py | EV-SANDBOX-001 |
| **AI-TOOLS-002** | bounded_dag_prototype_no_default_tools | gateway/tools/dag_engine.py | EV-TOOLS-001 |
| **AI-TOOLS-003** | schema_validation_prototype | gateway/tools/validator.py | EV-TOOLS-002 |
| **AI-TOOLS-004** | ssrf_policy_helper_only | gateway/security/ssrf_protection.py | EV-SEC-001 |
| **AI-TOOLS-005** | approval_ticket_primitive_no_ui | gateway/security/approval_gates.py | EV-SEC-002 |
| **AI-LICENSE-001** | manifest_and_ci_gate_prototype_no_voice_shipped | infra/license/provenance_manifest.yaml | EV-LICENSE-001 |
| **AI-UI-001** | browser_project_prototype_e2e_pending | index.md; docs/V016_IMPLEMENTATION_CHECKLIST.md | EV-UI-002 |
| **AI-UI-002** | manual_candidate_first_project_memory_bridge_e2e_passed_gateway_opt_in_live_unverified | index.md; gateway/app.py; tests/e2e/app.spec.mjs | EV-UI-003 |
| **AI-UI-003** | partial_bilingual_theme_clock_composer_voice_preview_e2e_pending | index.md | EV-UI-004 |
| **AI-AGENT-001** | logical_roles_not_process_swarm | docs/ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md | EV-AGENT-001 |
| **AI-AGENT-002** | limited_existing_routing | gateway/tools/dag_engine.py | EV-AGENT-002 |
| **AI-AGENT-003** | bounded_dag_prototype | gateway/tools/dag_engine.py | EV-AGENT-003 |
| **AI-LEARN-001** | governance_only_no_self_modification | LOOP.md | EV-LEARN-001 |
| **AI-LEARN-002** | versioned_skill_rollback_deferred | LOOP.md | EV-LEARN-002 |

### Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты
- [x] Сверены все строки реестра accepted improvements с идентификаторами в PROJECT_STATE.yaml; статус каждой строки сохранён отдельно, а не слит в одно «готово».
- [x] Различены реализованные модули, prototypes, документационные контракты, deferred items и блокеры. Макет или unit primitive не приравниваются к production runtime.
- [ ] На каждое изменение статуса дополнить eval-отчёт командой, результатом, sample size, SHA и rollback; обновить PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md и соответствующий отчёт.

### Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates
- [x] Проверены eval registry, решения D-001…D-006, bounded engineering loop, source/licensing register, latency contract, infrastructure upgrade и domain setup.
- [x] Voice performance, 8-GB profile, OTel exporter, native audio path, real sandbox, full LazyGraphRAG, external approval UI и live VPS обозначены как не подтверждённые/не развёрнутые.
- [ ] Прогнать python -m compileall -q gateway, python -m pytest -q gateway/tests, python gateway/evals/run_six_layer_eval.py и лицензионный CI gate на текущем состоянии ветки.
- [ ] Проверить provenance каждого реально поставляемого артефакта: точный источник, применимая лицензия модели/голоса, SHA-256. TBD/непроверенные hashes не могут отмечаться как ship-enabled.
- [ ] Измерить на целевом хосте cold/warm p50/p95/p99, RTF, RAM/PSS, аудиодропы, CER/WER и regression sample counts до любых performance claims.
- [ ] Развёртывание VPS, DNS, OAuth secrets и создание billable infrastructure не выполнять без актуального account access/проверенных параметров и отдельного согласованного действия.

### Rejected and blocked inventory — retained, not silently dropped
| ID | Решение / условие возврата | Причина |
|---|---|---|
| **AI-CUT-001** — Universal wake-word latency guarantee | Отклонено в текущей итерации | Requires measured target hardware and cannot be promised from a paper design. |
| **AI-CUT-002** — Silero TTS as commercial default | Отклонено в текущей итерации | Most models in the upstream repository are non-commercial; exact exceptions must be individually verified. |
| **AI-CUT-003** — Pure Python raw PCM hotpath | Отклонено в текущей итерации | Raw audio should remain in native capture/inference subsystem; Python consumes bounded events. |
| **AI-CUT-004** — Cloud ASR/TTS fallback | Отклонено в текущей итерации | Violates the default local-first voice privacy contract. |
| **BLK-RU-TTS-COMMERCIAL** | Заблокировано | Exact Russian voice model card, artifact checksum and license approval required. |
| **BLK-NATIVE-BENCH** | Заблокировано | No native audio backend or reference 8GB hardware measurement. |
| **BLK-CLI-SANDBOX** | Заблокировано | No tested container/seccomp/Landlock implementation or escape test evidence. |

### Gate перед финальным ответом
- [ ] Пересверить весь этот To do и таблицу ID с текущим HEAD после завершения всех workflows; подробный аудит четырёх частей манифеста — `docs/V016_IMPLEMENTATION_CHECKLIST.md` (81 пункт, §§0–40).
- [ ] Указать раздельно: фактически внедрено, проверено CI, подтверждено live, измерено benchmark, осталось prototype/deferred/blocked.
- [ ] Не объединять PR и не сообщать о публикации до зелёных релевантных workflow и проверки merge result.


## I. Следующие продуктовые вертикали

- [x] Связать браузерные проекты с серверным memory graph без автоматической миграции: ручная передача локальных фактов как candidate, ручное подтверждение/отклонение/удаление, scope по ID проекта. PR #29 merged; PR-head and post-merge Chromium/Quality checks passed.
- [x] Добавить per-chat opt-in серверной памяти; retrieval только confirmed и только при одновременно включённой памяти проекта и серверной памяти. Chromium mock E2E passed on PR #29 head and merged main.
- [x] PR #29 head checks passed: Quality/Chromium, provenance and published Pages smoke. Post-merge main Quality/Chromium, provenance and Pages deployment passed at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; gateway contract/security tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708`.
- [ ] На целевом gateway включить ALANDI_MEMORY_GRAPH_ENABLED=true только после резервной копии и smoke-test; ALANDI_GLOBAL_MEMORY_ENABLED оставить false.
- [ ] Первый месяц не создавать платные ресурсы автоматически: GitHub Pages + уже имеющееся железо + Ollama локально; free-tier API считать квотируемым и внешним, не гарантированно бесплатным.
- [ ] Оценить одну маленькую helper-модель для классификации, извлечения фактов, кратких сводок и чернового ранжирования. Главная модель остаётся для планирования, сложного reasoning и синтеза. Сравнить качество, latency и RAM перед включением.
- [ ] Добавить генерацию изображений отдельным модулем после выбора реального backend (локальный ComfyUI/API или явно выбранный внешний провайдер), проверки точной модели/лицензии/VRAM и mock E2E.
- [ ] Не добавлять скрытый refusal-фильтр поверх выбранной модели; не обещать «никогда не отказывает»: поведение checkpoint и правила внешнего API не контролируются приложением.
- [ ] Перед переходом на платный сервер сравнить baseline с измерениями p50/p95, RAM, качества, устойчивости, квот и месячной стоимости; менять endpoint/model config без смены контракта UI.

## Supplement — 2026-10-24 owner quickstart and chat ergonomics
- [x] Added owner-first setup sequence: `docs/START_HERE_RU.md`, linked from detailed VPS guide. It distinguishes existing VPS diagnostics from new Vultr setup and gates tunnel/client setup on local health/auth/completion/cache checks.
- [x] Added evidence-based subsystem roadmap: `docs/IMPLEMENTATION_ROADMAP_RU.md`, ordered P0 client UX → voice message → live voice → document/RAG → image/video → agent teams → memory/security → provider operations/governance.
- [x] PR #33 merged at `05f4c2454c279cc21dcbf08c83ff3c3025838257`; PR #34 merged at `e3463f9b048dfda742b8158faf054c617defda9a`; PR #35 merged at `23add2547a69df877b4baf213957827aa2e8e561`. PR-head run #418 passed context, integrity, security, Jekyll, 48 Chromium E2E tests and published-site browser smoke; separate license/provenance and dead-code gates passed. Post-merge main checkpoint `4fb39df2cb0c23c907fc69b52c1ebf2e05e6024e` also passed Quality workflow #420, 48 Chromium E2E tests, live-site smoke, Pages deployment #122 and provenance gate #159. Real-device keyboard/accessibility remain follow-up.
- [x] Replace prompt-based rename/project chooser with accessible in-app dialog/select; Chromium E2E covers rename and moving between projects. [ ] Real-device mobile keyboard open/close, focus, persistence and project delete/move accessibility follow-up.
- [ ] Real voice capture/ASR/TTS, image/video pipelines and complete document ingestion remain separate unimplemented work; see `docs/IMPLEMENTATION_ROADMAP_RU.md` and the original V-016 evidence ledger.

## Supplement — 2026-10-24 project navigation and composer

- [x] PR #35: Projects at top, collapsed by default; each project expands to its own chat list; top-level Chats is expanded and contains only unassigned/personal chats. Covered by Chromium E2E.
- [x] New personal chat from Chats; create a project-scoped chat from that project's expanded group; per-row menu includes rename, clone, move/detach, clear history, delete. Covered by Chromium E2E.
- [x] Move global memory controls and project facts under collapsed project settings; persisted project memory scope selects project-only vs project-and-global. Implemented; UI/browser checks pass.
- [x] Add composer + chooser for photo/video vs unrestricted multi-file picker. Known text formats and images are processed; video sends sampled frames. Other binary formats are selected but currently shown as unsupported and block sending until a parser/ingestion endpoint is implemented. Chromium E2E passes.
- [x] Add ◎ request-context selector for up to five projects. Context is scoped by chat ID, bounded, added to the next request only, and cleared after successful send. Selected project context must not mutate the chat's own project. Chromium E2E passes.
- [x] Voice chooser opens after press-and-hold, not a short tap. Long-press and short-tap behavior pass Chromium E2E; real-device touch/cancel still needs verification. Live recording, ASR, TTS and audio transcript remain unimplemented.
- [x] aLandi is a dedicated first-party primary-route card; third-party providers stay in advanced settings. Quality sentinel and Chromium E2E pass.
- [x] PR #35 was merged at `23add2547a69df877b4baf213957827aa2e8e561`; PR-head run #418 passed all quality gates, 48 Chromium E2E tests and published-site browser smoke. [x] Post-merge main checkpoint `4fb39df2cb0c23c907fc69b52c1ebf2e05e6024e` passed Quality workflow #420, live-site Chromium smoke, Pages deployment #122 and provenance gate #159.
- [ ] Real device verification: touch long-press/cancel, mobile keyboard focus/viewport reset, screen reader flow, and large file handling.
- [ ] Implement real file intake pipeline for PDF/DOCX/XLSX/OCR/audio/video metadata before claiming all formats are supported.


## Supplement — local helper memory suggestions (2026-10-27)

- [x] Added a manual, bounded local-model flow to propose compact project-memory facts. PR #69 merged at `4c9096999fbb3e1265150c420b136066c555285b`.
- [x] Kept it disabled when `ALANDI_HELPER_MODEL` is blank; only the operator-configured local Ollama tag can be used; the route shares inference concurrency and asks Ollama to unload after the request.
- [x] Filtered common secret-like input/output patterns and require an explicit click for every saved candidate. A regression fix handles prefixed names such as `ALANDI_API_KEY`.
- [x] Exact PR-head Gateway run #40539476154, Quality/Chromium/published-site smoke #40539476242, and provenance #40539476214 passed.
- [ ] Live inference, selected/installed VPS model, output quality, RAM and latency remain unverified.

## Supplement — reconciliation of the older mobile and interface request (2026-10-27)

- [x] Compared the full owner message with current `main`, the implementation roadmap, existing browser tests, and visible UI/source identifiers. The audit separates already implemented behavior from partial work and unimplemented interaction design in `docs/LEGACY_UX_REQUEST_AUDIT_RU.md`.
- [~] PR #71 (`fix/mobile-composer-docking-20261027`) removes the centered fixed composer state, keeps the input docked at the bottom in empty and populated chats, syncs text-area height to `visualViewport`, and adds a mobile viewport regression test. Exact-head CI and merge are pending.
- [ ] After PR #71, continue in bounded PRs: (1) focus/overlay/popover behavior and chat menu placement; (2) one-line web-search and function-selection menus; (3) provider/settings cleanup; (4) header, clock and list visual polish; (5) per-chat mode persistence and default reset, only after the state model is confirmed.
- [ ] Run native iPhone Safari/keyboard/touch verification separately; passing Chromium viewport simulation is not proof of native behavior.


## Supplement — autonomous agent orchestration research (2026-10-28)

- [x] Reviewed additional upstream open-source patterns for orchestration, durable workflows, policy-as-code, sandboxing, agent evaluations, memory, protocols and observability; recorded source links and limitations in `docs/AGENT_ORCHESTRATION_RESEARCH_RU.md`.
- [x] Owner-approved design direction recorded in D-015 and AI-AGENT-005: explicit task state machine, least-capability executor, fail-closed policy gate, action-bound approval, independent verifier, durable journal/recovery, bounded retries and eval-gated helper model.
- [ ] Reconcile current main and open PRs before code changes; audit actual runtime paths rather than relying on module names.
- [ ] Implement task contract/state machine and tests in a bounded PR.
- [ ] Select and verify a real sandbox before allowing arbitrary command/code execution.
- [ ] Add adversarial/golden evaluations, crash/restart and idempotency tests; measure target-host RAM/latency.
- [ ] Update PROJECT_STATE.yaml and EVALS.md only with verified implementation/test evidence. Research/documentation completion does not mean runtime implementation.
## Supplement — voice model landing and VPS owner steps (2026-10-28)

- [x] Added a VPS deployment runbook to `docs/VOICE_IMPLEMENTATION_PLAN_RU.md`: model install, voice/model hash and license review, feature-flag sequencing, private gateway binding, smoke checks, and release acceptance.
- [ ] After PR #75 exact-head CI passes and the code is merged, deploy that exact code revision to the VPS; GitHub Pages deployment alone does not update the private gateway.
- [ ] On the VPS, inspect OS/architecture/RAM/disk before installing Python 3.12+, ffmpeg/ffprobe, whisper.cpp, Piper and selected local model artifacts.
- [ ] Download only upstream-verified, license-reviewed artifacts; record exact source/version/license/SHA-256. For Piper, verify matching `.onnx` + `.onnx.json`; do not auto-download models from user requests.
- [ ] Configure `/etc/alandi-gateway.env` with `0600` permissions; keep ASR/TTS flags false until binaries, models and authenticated capabilities are checked. Then enable one feature at a time and restart the service.
- [ ] Validate the real microphone → editable transcript → explicit send → same-chat response → local TTS playback/voice choice/Stop path on the target device; record RAM, latency and speech quality.
- [ ] Never share secrets or full env files in chat. SSH/VPS access is not available through the current GitHub integration, so server-side installation must be executed by the owner using the runbook.


## Q. Последний запрос владельца — интеграция интерфейса, инструменты и uncensored-модель (2026-10-28)

- [x] Добавить явные взаимоисключающие режимы `self-hosted` и `free-cloud`; aLandi остаётся first-party маршрутом, а не видимым сторонним провайдером.
- [x] При self-hosted режиме блокировать внешние provider fields и отключать cross-provider fallback; при выборе внешнего провайдера явно переключать режим.
- [x] Добавить «Дополнительные настройки» с положением composer сверху/снизу; ограничить высоту textarea и дать ей расти вниз при верхнем положении.
- [x] Добавить в обычный чат ограниченные инструменты project_list/project_create/project_add_note и diagram_create; web tools остаются отдельными и не требуются для локальных действий.
- [~] Tool writes сохраняются в browser-local project scope. Нужны exact-head E2E, проверка модели с реальным tool calling и дальнейшие тесты на отсутствие cross-project access; это не серверная синхронизация.
- [~] Mermaid source можно запросить в чате, без открытия Studio; текущий клиент ещё не рендерит Mermaid в визуальную диаграмму.
- [x] Выбрать конкретные abliterated GGUF-кандидаты 2B Q4_K_M (1.27 GB) и 4B Q4_K_M (2.71 GB), зафиксировать expected SHA-256 и owner install runbook; не коммитить веса.
- [x] Добавить синтетический latency/correctness smoke harness `gateway/evals/run_local_model_benchmark.py` и тесты статистики.
- [ ] Прогнать точные Gateway/Quality/Chromium/provenance проверки на текущем PR head.
- [ ] На реальном бесплатном/доступном хосте подтвердить RAM, модельный импорт, RU/EN/TH, tool calling, p50/p95, tokens/s, peak RSS/PSS, reboot и rollback. Free Pages не означает бесплатные model inference ресурсы.
- [ ] Выполнить голосовой сценарий на физическом устройстве: mic → editable transcript → explicit send → same-chat answer → local TTS → Stop. VAD/AEC/barge-in и hands-free остаются отдельными acceptance gates.
- [ ] Проверить нативный iOS Safari и Android Chrome; Playwright не заменяет физическую клавиатуру, микрофон, Bluetooth и screen reader.
