# aLandi — целевая агентная платформа: архитектурный blueprint

**Статус:** исследовательская рекомендация; не является реализацией и не разрешает включать новые runtime-функции.  
**Срез репозитория:** main `e78a73b25725bfa63370d9946887cbbacbf51b82` (PR #123 merged).  
**Связанные материалы:** [исследовательский каталог](AGENT_RESEARCH_CATALOG_RU.md), [матрица моделей](AGENT_MODEL_BAKEOFF_RU.md), [существующий каталог 64 ролей](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md), [исследование оркестрации](AGENT_ORCHESTRATION_RESEARCH_RU.md).

## 1. Краткий вердикт

Строить не «зоопарк автономных ботов», а **управляемую агентную операционную систему aLandi**:

1. Один главный оркестратор отвечает за цель, план, бюджет, делегирование, остановку и итоговый ответ.
2. Специалисты — ограниченные исполнители с узкой профессией, навыками, схемой входа/выхода и минимальным набором разрешений.
3. Субагенты создаются на время конкретной задачи, получают изолированный task packet и возвращают структурированный результат/артефакты. Их полномочия никогда не шире полномочий родителя.
4. «Толпа» — это временная команда из ограниченного числа задач и специалистов, а не постоянно загруженные копии моделей и не бесконтрольный group chat.
5. Оркестрация остаётся детерминированной там, где это возможно: DAG/state machine управляет шагами, LLM предлагает план и выбирает специалиста только внутри разрешённого каталога.
6. Роли, навыки, инструменты, модели, память и разрешения — отдельные сущности. Ни роль, ни skill, ни текст модели сами по себе не выдают доступ.
7. Сначала использовать существующие FastAPI, SQLite, Ollama/provider adapters, ToolDAG, validator и approval primitives. Не добавлять новый orchestration framework или базу данных до сравнительного прототипа и eval gate.

**Рекомендуемая комбинация:** собственный тонкий runtime и policy boundary aLandi + идеи LangGraph/Google ADK/Microsoft Agent Framework для графового управления + OpenAI Agents SDK/PydanticAI для delegation contracts + CrewAI/AgentScope/CAMEL как источники командных паттернов + Paperclip/OpenClaw/Hermes как источники workforce UX и lifecycle + Agent Skills/MCP/A2A как совместимые стандарты. Это заимствование проверенных идей, не предложение установить все перечисленные проекты.

## 2. Что реально существует в aLandi на текущем main

| Компонент | Подтверждённое состояние | Чего это НЕ доказывает |
|---|---|---|
| 64 профессии | Каталог логических ролей в `docs/ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md` | Нет 64 процессов или 64 независимых LLM-агентов |
| Multi-agent UI option | `multiAgentEnabled` включает четырёхэтапный pipeline planner → researcher → critic → synthesizer после complexity gate; этапы вызывают выбранную модель | Это не независимая команда моделей и не динамические субагенты |
| ToolDAG | `gateway/tools/dag_engine.py`: bounded DAG до 32 nodes, read-only fan-out до 4, tool timeout, side effects последовательно | Нет долговечного AgentRun, agent-to-agent messaging, resume после рестарта или LLM worker pool |
| Tool validation | `gateway/tools/validator.py`: JSON Schema Draft 2020-12, bounded JSON arguments, локальные refs | Schema validation не является authorization и не sandbox |
| Approval | `gateway/security/approval_gates.py`: in-memory one-time ticket, exact action/args/scope/actor binding, TTL | Нет полного UI/endpoint/workflow и долговременного audit log; approval не изолирует код |
| Helper model | Есть opt-in memory helper и синтетический benchmark transport/latency | General model router и helper/subagent dispatch не реализованы; качество на целевом VPS не измерено |
| Memory/RAG | Есть отдельные memory/RAG прототипы и scope contracts | Нельзя считать, что все агенты имеют безопасную общую память или production graph RAG |
| Sandbox | Вопрос arbitrary code/shell остаётся release gate | Нельзя запускать произвольный код агента на host или называть обычный container полноценной защитой |

**Нормативная граница:** существующий D-016 требует bounded orchestration, policy enforcement, approval, independent verification, durable state, cancellation/recovery и запрет произвольного кода до настоящей sandbox-изоляции. Этот blueprint конкретизирует D-016, но не отменяет V1 freeze и owner-only gates.

## 3. Словарь: не смешивать сущности

- **Модель** — вычислительный backend/checkpoint, генерирующий вывод.
- **Агент** — runtime-экземпляр поведения: инструкции, профиль, модельная политика, инструменты, память, бюджет, жизненный цикл.
- **Профессия/роль** — повторно используемый контракт ответственности (например, Researcher, Security Auditor, QA Engineer); сама по себе не отдельный процесс.
- **Навык (skill)** — переносимая процедурная инструкция/knowledge package, которую агент может загрузить по требованию.
- **Инструмент (tool)** — детерминированная функция с типизированными аргументами и серверной политикой доступа.
- **Субагент** — дочерний запуск с собственным task context, ограниченным бюджетом и subset capabilities.
- **Команда/crew** — набор агентов/задач с общей целью, планом и критериями приёмки.
- **Рой/swarm** — временная управляемая топология команды; не синоним параллельного group chat.
- **Оркестратор** — владелец run state и правил делегирования.
- **Workflow/DAG** — исполняемая структура шагов и зависимостей; может содержать LLM-узлы, но не обязательно является multi-agent.
- **MCP** — протокол доступа к tools/resources/prompts, не протокол управления командами агентов.
- **A2A** — протокол задач и сообщений между отдельными агентными системами.
- **ACP** — интерфейсный протокол coding-agent ↔ IDE/client, не универсальный swarm protocol.
- **AG-UI** — поток типизированных событий агент ↔ пользовательский интерфейс.

## 4. Целевая архитектура

```text
User / aLandi UI
      |
      v
FastAPI Gateway + Auth + Request Policy
      |
      v
AgentRun Service  <----> SQLite journal / task state / artifacts
      |
      +--> Orchestrator (deterministic state machine + bounded LLM planner)
      |       |
      |       +--> Agent/Profession Registry
      |       +--> Skill Registry + provenance + eval status
      |       +--> Model Router / Model Registry
      |       +--> Budget & Deadline Controller
      |       +--> Team Scheduler (fan-out / fan-in / handoff)
      |
      +--> Specialist Workers (ephemeral task contexts)
      |       +--> Research / Evidence
      |       +--> Engineering / Coding
      |       +--> Security / Compliance
      |       +--> QA / Verification
      |       +--> Memory / Knowledge
      |       +--> Data / Multimodal / Education
      |
      +--> Tool Gateway --> deterministic policy --> validated tool --> isolated executor
      |
      +--> Evidence & Artifact Store / scoped Memory
      |
      +--> Trace / Eval / Audit / Human Approval
```

### 4.1 AgentRun lifecycle

Рекомендуемая конечная state machine:

`CREATED → VALIDATING → PLANNING → QUEUED → RUNNING → VERIFYING → SUCCEEDED`

Дополнительные состояния: `WAITING_FOR_INPUT`, `WAITING_FOR_APPROVAL`, `RETRY_WAIT`, `CANCEL_REQUESTED`, `CANCELLED`, `FAILED`, `BUDGET_EXHAUSTED`, `NEEDS_HUMAN`.

Терминальные статусы не должны молча переходить обратно в RUNNING. Возобновление — отдельное событие с сохранённым checkpoint и проверкой прав. Каждый переход фиксируется с actor, timestamp, cause, correlation ID и schema version.

### 4.2 Task packet для субагента

Дочернему исполнителю передаётся только необходимое:

- `task_id`, `parent_run_id`, `agent_profile_id`, версия профиля;
- одна цель и ограниченный scope;
- входные данные и ссылки на evidence/artifacts, а не вся история родителя;
- ограничения, запреты и доверительные метки входов;
- разрешённые capability IDs (пересечение с полномочиями родителя);
- строгая JSON/Pydantic output schema;
- deadline, max steps, token/cost budget, max tool calls;
- критерии приёмки и правило эскалации к человеку.

Результат субагента: `status`, краткий вывод, структурированные данные, evidence refs, artifact refs, uncertainty, unresolved questions, usage, ошибки и проверка контракта. Не передавать и не сохранять chain-of-thought.

### 4.3 Agent profile / профессия

Версионируемый профиль должен включать:

| Поле | Назначение |
|---|---|
| `id, version, name, description` | Стабильная идентичность и версионирование |
| `profession_id` | Роль из каталога 64 профессий |
| `mission, responsibilities, exclusions` | Что делает и что не делает |
| `skills[]` | Разрешённые версии навыков |
| `model_policy` | Требуемые capability tags, provider/model allowlist, fallback |
| `input_schema, output_schema` | Контракт входа и результата |
| `capabilities[]` | Серверные разрешения на конкретные tools/resources |
| `memory_scope` | none/task/chat/project/user — только по policy |
| `budget_policy` | steps, tokens, time, calls, fan-out, cost |
| `risk_tier` | read-only / reversible-write / sensitive / privileged |
| `approval_policy` | Когда обязательно подтверждение человека |
| `eval_suite, release_status` | Какие проверки пройдены и можно ли запускать |

Модель не может расширить `capabilities`, изменить policy или добавить себя в registry.

## 5. Профессии и команды: сохранить 64 роли, но упорядочить

Существующий каталог 64 ролей — основа, его не надо заменять очередным набором случайных персонажей. Для удобства discovery и управления предлагается 10 профессиональных гильдий:

1. **Управление и планирование:** orchestrator, decomposer, task planner, model dispatcher, budget planner, completion checker.
2. **Исследование и доказательства:** web researcher, source reader, link verifier, deduplicator, claim extractor, fact checker, contradiction resolver, freshness analyst, comparator, bibliographer, knowledge archivist.
3. **Инструменты и интеграции:** intent classifier, tool router, argument validator, API/integration specialist, workflow engineer.
4. **Безопасность и доверие:** prompt-injection defender, SSRF reviewer, permission auditor, red team, privacy auditor, license auditor.
5. **Разработка и архитектура:** implementer, code reviewer, architecture reviewer, contract reviewer, performance reviewer, resilience reviewer, documentation engineer.
6. **QA и верификация:** test designer, test executor, regression analyst, UI/accessibility/mobile auditors, citation verifier, acceptance verifier.
7. **Память и знания:** memory curator, fact extractor, entity resolver, graph builder, conflict resolver, TTL manager, context compressor, memory retriever, project curator.
8. **Документы и мультимодальность:** document importer, PDF/table parser, OCR, ASR, image/video/audio specialist, RAG planner, indexer.
9. **Аналитика и обучение:** data analyst, tutor, flashcard/quiz creator, feedback analyst, learning evaluator.
10. **Операции и контроль качества:** run monitor, trace analyst, incident responder, cost analyst, release manager.

Точный состав и названия остаются в [каталоге 64 ролей](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md); гильдии — организационная группировка, а не дополнительные 64 роли. Одну задачу получает минимальное число нужных ролей. Для типовых задач полезны готовые team templates:

| Команда | Состав | Применение |
|---|---|---|
| Research Cell | Orchestrator + 2–4 Researcher/Source Verifier + Synthesizer | Сложное исследование с независимыми источниками |
| Build Cell | Planner + Implementer + Independent Reviewer + Test Engineer | Изолированная инженерная задача |
| Security Cell | Threat Modeler + Red Team + Remediator + Verifier | Проверка угроз и регрессий |
| Knowledge Cell | Importer + Extractor + Librarian + Eval Reviewer | Книга/документы → skill/knowledge |
| Data Cell | Analyst + Calculator/Tool Worker + Independent Checker | Расчёты и анализ |
| Multimodal Cell | Router + OCR/ASR/Vision Worker + Evidence Reviewer | Файлы, изображения, аудио/видео |
| Teaching Cell | Tutor + Exercise Designer + Evaluator | Персональное обучение |

## 6. Топологии оркестрации и правила выбора

| Паттерн | Где полезен | Правило для aLandi |
|---|---|---|
| Sequential pipeline | Этапы с жёсткой зависимостью | По умолчанию для простых задач |
| Supervisor → workers | Главный агент сохраняет владение итогом | Основная multi-agent топология |
| Fan-out / fan-in | Независимые источники/подзадачи | Ограничить fan-out, дедуплицировать и синтезировать |
| Agent-as-tool | Специалист возвращает результат менеджеру | Предпочтительно для bounded specialists |
| Handoff | Следующий агент становится владельцем диалога | Только когда действительно меняется conversational ownership |
| Hierarchical delegation | Сложная задача требует декомпозиции в подзадачи | Глубина максимум 2 на начальном этапе |
| Blackboard / shared artifacts | Команде нужен общий evidence state | Делить ссылки и typed artifacts, не полный сырой transcript |
| Critic / adversarial review | Высокий риск, проверка спорного результата | Один независимый critic; не бесконечная дискуссия |
| Debate / group chat | Симуляции, исследование позиций | Не default: дорого, трудно оценивать и контролировать |
| Event-driven / heartbeat | Долгие задачи и расписания | Только после durable state, budgets, pause/stop и user opt-in |
| Swarm / dynamic worker pool | Много независимых задач с ограниченными результатами | Позже; только через очередь и общий лимит ресурсов |

**Главное правило:** добавлять специалиста только если меняются компетенция, контекст, инструменты, риск или критерии проверки. Деление одной задачи на пять почти одинаковых промптов обычно добавляет задержку и цену, а не интеллект.

### 6.1 Начальные пределы (проектные defaults для будущего eval, не runtime config)

- Fast/simple: 0–1 дополнительная роль.
- Research: 2–5 логических workers.
- Сложный coding/security: 3–7 ролей с независимым review.
- Максимальная глубина вложенного делегирования: 2.
- На 8-GB VPS: одна локальная генерация за раз; параллелить только безопасный I/O и независимые детерминированные операции.
- Начальный read-only I/O fan-out: не выше существующего ToolDAG лимита 4.
- Каждый run/task имеет deadline, max steps, token/cost cap, max tool calls, cancellation и stop condition.
- Эти числа пересматриваются только по target-host измерениям; это не обещание, что текущий код их реализует.

## 7. Skills: профессиональные навыки как отдельный слой

Использовать открытый формат Agent Skills: каталог с `SKILL.md`, опциональными `scripts/`, `references/`, `assets/`. Применять progressive disclosure: короткий metadata/description при discovery, основная инструкция при активации, справочные материалы — по необходимости.

Для aLandi skill registry должен дополнительно хранить:

- immutable `skill_id`, semver, author/source, license и compatibility;
- URL/commit/hash исходников и дату извлечения;
- язык, профессию/категорию, capability requirements;
- trust state: quarantined → reviewed → evaluated → approved → deprecated/revoked;
- prompt-injection / secret / executable-content scan results;
- golden eval suite, результаты, ограничения, известные failure modes;
- зависимости, размер и примерную стоимость контекста;
- changelog, reviewer и rollback version.

**Skill не выдаёт доступ.** Поле `allowed-tools` из стандарта — метаданные/experimental hint, а не замена серверному policy engine. Скрипты навыка не исполняются автоматически; внешние skills не загружаются в активный runtime без проверки лицензии, provenance, содержимого, зависимостей и разрешений.

### 7.1 Knowledge-to-Skill pipeline

Взять лучшее из Book-to-Skill и Anything-to-Skill, но сделать собственный контролируемый pipeline:

1. Источник: PDF/EPUB/DOCX/сайт/repository/набор документов.
2. Проверить права на обработку, лицензию, источник, размер и тип.
3. Извлечь текст/структуру с page/heading/offset provenance; убрать повторяющиеся headers/footers и невидимые управляющие символы.
4. Сегментировать по главам/темам, а не только по длине чанка.
5. Сформировать framework/decision rules/anti-patterns/examples, а не переписать книгу в summary.
6. Сохранить citations/источники и неопределённость; не изобретать содержание, которого нет в источнике.
7. Сканировать prompt injection, secret leakage, небезопасные frontmatter и исполняемые payloads.
8. Сгенерировать `SKILL.md` и references.
9. Создать вопросы из исходника и проверить skill на них; сравнить с baseline/source.
10. Провести человеческий review, версионировать, опубликовать в библиотеке навыков.
11. Обновлять через diff/refresh; не менять активную версию без eval и rollback.

Навык не должен автоматически становиться агентом. Создание агента — отдельная операция с явной профессией, моделью, capabilities, памятью и budgets.

## 8. Модели: много специализаций без множества постоянно загруженных весов

Нужен **Model Registry + capability-based router**, а не одна модель на каждую профессию.

### 8.1 Уровни маршрутизации

- **T0 deterministic:** обычный код, JSON Schema, regex/FTS, расчёты, policy checks, dedup по hash — без LLM.
- **T1 tiny specialist:** intent/language classification, extraction, compact structured routing, constrained tool selection — только после domain eval.
- **T2 small worker:** bounded summaries, document extraction, narrow research subtask, simple code review; отдельный запрос к модели, не отдельный постоянно работающий daemon.
- **T3 main reasoning:** сложная декомпозиция, синтез, неоднозначность, независимая проверка.
- **T4 external/cloud:** только выбранный пользователем/оператором provider с ясным disclosure и политикой данных; без silent fallback.

Router выбирает по capabilities, языку, input modality, tool-call reliability, context need, quality tier, latency, memory budget, license allowlist и user/provider preference. Нельзя маршрутизировать по одному числу параметров или benchmark score.

### 8.2 Практическая политика для 8 GB

- Один основной локальный checkpoint и один активный inference worker — исходный режим.
- Helper checkpoint тестировать отдельно, по очереди или с выгрузкой/перезагрузкой; не предполагать, что два 3B checkpoint комфортно живут одновременно.
- Контекст ограничивать по фактической задаче: 128K/262K в model card не означает, что 8 GB RAM способны обслужить такой контекст.
- Сравнивать GGUF/квантизации на одинаковом golden set; отдельно измерять peak RSS/PSS, KV cache, cold start, TTFT, tokens/s, p95.
- Сначала T0 оптимизация, затем tiny classifier/extractor, затем более крупный helper только если измеренное качество оправдывает RAM и задержку.
- Никакая модель не должна решать, можно ли ей выполнить опасное действие: policy enforcement детерминированный.

Кандидаты и оговорки — в [матрице моделей](AGENT_MODEL_BAKEOFF_RU.md). До eval не выбирать победителя и не скачивать модели на live host.

## 9. Инструменты, протоколы и исполнение

### 9.1 Tool Gateway

Все tools вызываются через один server-side gateway. Каждая запись инструмента содержит name/version, JSON Schema, read/write classification, required capabilities, risk tier, timeout, rate/size limits, idempotency behavior, audit metadata и тесты.

Перед исполнением: authenticate actor → resolve agent identity → intersect delegated capabilities → check scope/policy → validate arguments → check approval if required → execute in correct isolation boundary → redact output → persist audit event → verify result.

Дочерний агент не наследует credentials родителя. Для внешних API использовать scoped token broker/connection references, не вставлять секреты в prompt.

### 9.2 Протоколы

- **MCP:** внешний/внутренний tool & resource adapter; серверы должны проходить allowlist, schema validation, auth review и supply-chain review.
- **A2A:** только для реального взаимодействия с независимыми удалёнными агентами; Agent Card, task lifecycle, artifacts и authentication.
- **OpenWOP v2:** ранее отмеченный экспериментальный wire protocol для durable multi-agent workflows; сохранить в сравнительном реестре, но не считать зрелым стандартом и не внедрять без conformance/security review.
- **ACP:** потенциальный adapter к coding agents/IDE, не заменяет внутренний task bus.
- **AG-UI:** возможный стандарт для событий frontend: agent lifecycle, tool events, subagent status, artifacts, interrupt/resume.
- Внутренний task contract должен оставаться собственным и стабильным; не привязывать всё приложение к протоколу одного vendor.

### 9.3 Sandbox

До появления и проверки sandbox — запрет на arbitrary shell/code и browser automation с произвольными credentials. На кандидаты для отдельного sandbox spike вынести gVisor, Firecracker microVM и OpenShell; сравнить isolation boundary, network egress, filesystem policy, privilege drop, kernel/KVM prerequisites, resource limits, startup latency и обслуживание. Обычный Docker container, permission dialog или subprocess timeout сами по себе не доказывают изоляцию от host.

## 10. Память, общий контекст и доказательства

Разделить:

1. **Task scratchpad:** краткоживущий контекст одной задачи.
2. **Agent session:** состояние конкретного запуска/диалога.
3. **Shared team board:** typed task states, artifacts и evidence refs.
4. **Conversation memory:** область конкретного чата.
5. **Project memory:** только по project scope и настройкам.
6. **User memory:** только при явном разрешении и правилах продукта.
7. **Procedural skills:** версионируемые инструкции, не пользовательские факты.
8. **Evidence store:** URL, hash, дата, фрагмент, page/section, provenance.

Не делиться всей историей между workers. По умолчанию child получает только task packet и нужные evidence refs. Любой факт памяти имеет scope, provenance, timestamps, confidence, status и sensitivity. Противоречия сохраняются, а не перезаписываются молча. Не сохранять chain-of-thought.

## 11. Durable execution и восстановление

Первый этап — SQLite в рамках существующего gateway, без второго orchestration server:

- таблицы `agent_runs`, `agent_tasks`, `agent_events`, `agent_artifacts`, `agent_approvals`, `agent_profiles`, `agent_skill_versions`, `agent_usage`;
- append-only event journal и schema versioning;
- snapshots/checkpoints на границах задач;
- lease/claim с ограниченным TTL для queued tasks;
- idempotency key на внешние side effects;
- transactional outbox или явная reconciliation state для side effects;
- cancellation token, deadline propagation, bounded retry with jitter;
- не повторять side effect вслепую после timeout/неясного результата;
- запускать один worker process в текущей VPS архитектуре.

SQLite не превращается автоматически в distributed queue. Если появятся несколько независимых worker hosts или длительные distributed workflows — провести отдельный bake-off Temporal/Restate/DBOS/Hatchet и storage migration decision. LangGraph может быть кандидатом для stateful graph runtime, но его checkpointer и persistence должны быть проверены на наших schema/security requirements.

## 12. Наблюдаемость и оценка

Для каждого run фиксировать: run/task/parent IDs, profile/skill/model/provider versions, prompt/template hash (не содержимое секретов), tool IDs, state transitions, retries, approvals, duration, TTFT, tokens, estimated/actual cost, peak memory when available, output schema validity, eval result и termination reason.

OpenTelemetry-compatible trace tree: workflow → agent → task → model call → tool call. Пользовательский интерфейс показывает понятный activity timeline и результат, а не скрытые рассуждения.

Eval должен проверять не только текстовый ответ:
- task success / acceptance criteria;
- tool selection precision/recall и invalid arguments;
- unauthorized action rate (обязательно 0);
- subagent delegation correctness и context leakage;
- citation precision / claim support;
- recovery after injected failures;
- cancellation/timeout latency;
- cost, TTFT, p50/p95, peak RSS, token use;
- Russian/English/Thai language and mixed-language robustness;
- prompt injection, memory poisoning, malicious MCP, agent identity/privilege abuse.

Собственный RU/EN/TH golden set обязателен. Vendor model cards и публичные benchmarks — shortlist evidence, не proof of production performance.

## 13. Безопасность: non-negotiable invariants

1. Agent identity отделена от human identity; каждый запуск имеет actor, parent, scope и audit trail.
2. Child capabilities = строгая подмножина полномочий родителя и пользователя; никакого privilege escalation.
3. Model output, retrieved docs, skill text, web results и peer-agent messages — untrusted input.
4. Prompt injection не может менять policy, tool allowlist, model registry или approval state.
5. Human approval привязан к exact canonical action + args + scope + actor + expiry; изменение любого поля требует нового согласия.
6. Отдельная policy проверка происходит перед каждым tool call, а не один раз при старте агента.
7. Secrets выдаются только в executor через scoped broker; никогда не возвращаются в LLM context/logs.
8. Network egress, DNS/SSRF, file paths, uploads, output size, tool rate и token budget ограничены.
9. Destructive/write actions требуют approval; высокорисковые действия — human review даже после успешной валидации.
10. Sandboxing — отдельная граница безопасности с negative tests; отсутствие sandbox = функция выключена.
11. Agent-to-agent сообщения не являются доверенными только потому, что пришли от другого агента.
12. Skill installation, tool server updates и model changes проходят supply-chain/license/hash checks.

Threat baseline: OWASP Top 10 for Agentic Applications 2026 (ASI01–ASI10), особенно prompt injection, tool misuse, identity/privilege abuse, supply chain, unexpected code execution, memory/context poisoning, insecure inter-agent communication, cascading failures и human-agent trust.

## 14. Что взять у проектов и что не переносить

| Источник | Переносимая идея | Не переносить автоматически |
|---|---|---|
| LangGraph | stateful graph, checkpoint, interrupt/resume, deterministic + agentic nodes | всю экосистему и облачные сервисы |
| OpenAI Agents SDK | agent-as-tool vs handoff, narrow specialist contracts, tracing/guardrails | привязку к одному provider |
| PydanticAI | typed outputs, usage propagation, isolated subagent history, limits | дополнительный runtime до доказательства необходимости |
| Google ADK / Microsoft Agent Framework | workflow nodes, fan-out/fan-in, loops, checkpoint, typed orchestration | весь framework при замороженном стеке |
| CrewAI | профессии, tasks, hierarchical manager, Flows vs Crews | свободную автономную delegation по умолчанию |
| smolagents | manager/managed worker, lightweight worker profiles | CodeAgent на host без sandbox |
| AgentScope / CAMEL | message bus, team patterns, agent societies, simulation | неограниченный peer chat / millions-agent claims |
| Magentic-One | separate task/progress ledgers, explicit worker assignment, stall detection and replanning | copying its entire tool surface or treating benchmark performance as production proof |
| Browser Use / PinchTab | dedicated browser worker, DOM-first extraction, isolated profiles, loopback browser control plane | cloud browser by default or browser credentials shared across agent profiles |
| Langfuse / OpenTelemetry | trace tree, tool/agent spans, token/cost/latency, scoring | external trace export with raw prompts/secrets |
| MCP-Scan | scan tool descriptions, skills and MCP traffic for poisoning/rug-pull patterns | trusting a scanner as authorization or sending private tool metadata to hosted APIs without review |
| Paperclip | org chart, goals, budgets, tasks, approvals, run ledger, human board | Node/React control plane как новый stack |
| OpenClaw / Hermes | isolated sessions, subagents, skill allowlists, scheduling, adapters, memory | небезопасное доверие к одному shared gateway или автоматическое self-modification |
| OpenHands | workspace adapters и изолированные execution environments | доступ к host filesystem |
| Book-to-Skill / Anything-to-Skill | extraction, chapter structure, audit/eval/refresh, provenance | автоматическую публикацию без проверки |
| Agent Skills / MCP / A2A | открытые форматы и interoperability | путать discovery metadata с permission enforcement |

## 14.1 Полная карта возможностей агентной платформы

Это карта направлений, которые можно постепенно включать в aLandi. Она не означает, что перечисленные возможности уже работают.

| Направление | Возможности зрелой платформы | Состояние aLandi / следующий шаг |
|---|---|---|
| Agent workforce | Профессии, профили, команды, оргструктура, цели, отчётность, динамическое назначение исполнителей | Есть 64 логические роли; сделать versioned registry и team templates |
| Subagents & swarms | Дочерние run, hierarchical delegation, bounded fan-out, supervisor, mesh/blackboard, debate/consensus, agent-to-agent messages | Нет общего dispatcher и durable AgentRun; начать с supervisor-worker и fan-out/fan-in |
| Planning & reasoning | ReAct, plan-and-execute, task ledger, progress ledger, reflection, critic, verifier, replanning, stop/stall detection | Есть четыре последовательные стадии и bounded DAG; добавить typed task/progress ledgers и recovery |
| Tools & integrations | Native tools, MCP servers, OpenAPI, databases, messaging, connectors, API actions, tool discovery and version pinning | Есть validator/DAG/approval primitives; унифицировать через capability-based Tool Gateway |
| Digital workspace | Browser, computer use, files, terminal, code editor, isolated git worktrees, remote workspace, desktop automation | Browser/terminal automation не включать до sandbox и credential isolation; PinchTab/Browser Use/OpenHands — кандидаты |
| Knowledge & skills | Agent Skills, skill discovery, book/document/repo-to-skill, skill chaining, skill testing, private/shared catalogs, versioning/rollback | Есть skill assets и Knowledge-to-Skill research; нужен provenance + injection scan + eval + human review |
| Memory & context | Working, episodic, semantic, procedural and temporal memory; scoped shared board; compaction; retrieval; conflict resolution | Есть scoped memory/RAG primitives; shared team board и durable agent memory не реализованы |
| Model intelligence | Capability routing, small specialist models, ensemble, fallback, model selection by language/modality/cost/quality, embeddings/reranking | Есть opt-in memory helper and benchmark harness; general router and target-host bake-off pending |
| Multimodal | Vision, OCR, documents/tables, audio/ASR/TTS, live voice, video understanding, diagrams, multimodal artifacts | Частичные document/ASR/TTS prototypes; target device/runtime quality unverified |
| Long-running work | Background tasks, schedules/cron, heartbeat, event triggers, watch/monitor, pause/resume, cancellation, notifications | Durable scheduler and trigger registry not implemented; add only after durable AgentRun and owner opt-in |
| Learning & adaptation | Skill suggestions, trajectory review, error analysis, prompt/skill updates, SFT/LoRA/distillation/RL pipelines | No automatic self-modification. Candidate changes must pass offline eval, review, versioning and rollback |
| Collaboration | Shared artifacts, evidence board, team discussion, external agent federation, human + agent task handoff | Internal typed artifact references first; A2A only for independent remote agents |
| Governance & trust | Agent identity, tenant isolation, RBAC/capabilities, scoped credentials, approvals, budgets, audit, policy diffs, kill switch | D-016 direction and approval primitive exist; durable enforcement and sandbox tests are pending |
| Observability & quality | Live run timeline, traces, token/cost budgets, quality scores, eval datasets, red-team, incident replay | Eval design exists; add run/task/tool traces with payload redaction |
| Agent ecosystem | Versioned agent/skill marketplace, signed manifests, compatibility checks, install/uninstall/revoke, trust ratings | No marketplace. Start with private local registry; public sharing only after supply-chain gates |

### Advanced capabilities — только после базовой надёжности

- **Dynamic team formation:** оркестратор выбирает минимальную команду по роли/навыкам/бюджету; не создавать агентов без причины.
- **Hierarchical swarms:** ограниченное дерево координатор → менеджер направления → исполнитель, с максимальной глубиной и fan-out.
- **Peer review / consensus:** независимые оценки с разными evidence paths; consensus не должен заменять проверку фактов или человека для рискованных действий.
- **Agent federation:** внешний агент получает ограниченное A2A task, а не credentials или память всей системы.
- **Proactive agents:** heartbeat, календарь, мониторинг и события; пользователь должен видеть расписание, лимит, паузу и выключатель.
- **Self-improving skills:** агент может предложить skill diff, но promotion происходит только после тестов, человеческого review и rollback-ready release.
- **Model adaptation:** LoRA/SFT/distillation/RL и trajectory learning — отдельные offline ML pipelines с лицензиями и dataset governance; не online self-training на приватных разговорах.
- **Agent simulation:** synthetic teams и adversarial scenarios для eval; не путать симуляцию с реальными пользователями/системами.

## 15. План реализации — отдельные малые PR после утверждения

### Phase 0 — завершено в этом исследовательском PR
- [x] Проверить main, PR/issue queue, существующий код и проектные решения.
- [x] Свести прошлый orchestration research и 64-role catalogue.
- [x] Исследовать frameworks, standards, agent workforce systems, skills, memory, evals, sandbox и small models.
- [x] Подготовить архитектурный blueprint, source catalog и model bake-off plan.
- [x] Runtime не менялся; новые возможности не объявлять реализованными.

### Phase 1 — contracts & registry (первый implementation PR)
- [ ] Typed AgentProfile, Profession, SkillManifest, Capability, ModelPolicy, BudgetPolicy.
- [ ] Registry read-only API + versioned config; никакой динамической загрузки исполняемого кода.
- [ ] Перевести 64 роли в валидируемые профили, не создавая 64 процессов.
- [ ] JSON Schema/Pydantic contract tests, license/provenance validation, deterministic registry selection.

### Phase 2 — durable AgentRun (второй PR)
- [ ] SQLite schema + append-only events + snapshots + state machine.
- [ ] Cancellation, deadlines, budgets, idempotency, restart recovery.
- [ ] Failure injection tests на каждом transition.
- [ ] UI timeline read-only; не показывать chain-of-thought.

### Phase 3 — true subagents (третий PR)
- [ ] Supervisor → bounded specialist tasks.
- [ ] Isolated task packet/history; strict capability intersection.
- [ ] fan-out/fan-in для read-only tasks; generation concurrency 1 на 8-GB VPS.
- [ ] независимая проверка результата и корректная агрегация.
- [ ] eval: delegation correctness, no context/permission leakage, cost and latency.

### Phase 4 — model routing and compact specialists (отдельный PR)
- [ ] Run model bake-off на целевом host и golden set.
- [ ] Capability-based routing, explicit provider/model allowlist, no silent fallback.
- [ ] Только один helper use case за раз; rollback и feature flag off by default.
- [ ] Не держать несколько checkpoints resident без измеренной причины.

### Phase 5 — skills and Knowledge-to-Skill (отдельный PR)
- [ ] Agent Skills-compatible loader and registry.
- [ ] Source ingestion, provenance, license checks, injection scanner.
- [ ] eval-generated test questions, human review, skill versioning/rollback.
- [ ] No auto-execution of scripts and no permission inheritance from skill metadata.

### Phase 6 — tool gateway and sandbox (отдельные security PRs)
- [ ] Capability-based tool authorization before each call.
- [ ] Scoped credential broker, audit, egress restrictions.
- [ ] gVisor/Firecracker/OpenShell spike; choose only after threat model and host checks.
- [ ] Arbitrary code remains disabled until isolation/escape tests pass.

### Phase 7 — workforce / schedules / external agents (позже)
- [ ] Goals, org chart, task queue, heartbeats, budgets, pause/resume/terminate.
- [ ] A2A for explicit external-agent connections; MCP for tools; AG-UI for UI events.
- [ ] Multi-tenant boundaries, adapter isolation, credential scopes and operator controls.
- [ ] Human opt-in for recurring work and clear stop controls.

## 16. Acceptance gates

Никакая фаза не принимается только по unit tests. Минимальный набор:

- contract/schema tests; state-machine/property tests; deterministic policy tests;
- integration tests with real SQLite and process restart;
- concurrent fan-out tests and resource caps;
- idempotency/duplicate/replay/failure-injection tests;
- cancellation and approval mismatch/expiry/replay tests;
- red-team fixtures for prompt injection, malicious skills, tool output, peer-agent spoofing, memory poisoning and privilege escalation;
- sandbox escape/isolation/effect tests before code execution;
- eval RU/EN/TH against main-model-only baseline;
- model quality/latency/RSS/TTFT/token/cost benchmark on actual target hardware;
- Chromium E2E for task timeline, stop, pause, approval, error and resume;
- exact-head CI + provenance + dependency/license review;
- owner live-host gate before enabling any production capability.

## 17. Открытые вопросы, не блокирующие blueprint

1. Какие ресурсы фактически доступны на целевом VPS (RAM, CPU, GPU/VRAM, disk, KVM availability) — определить измерением до model/sandbox decisions.
2. Какие внешние agents/providers владелец захочет подключать — оставить adapter-based, не фиксировать vendor заранее.
3. Какие skills могут быть публичными/общими, а какие private/project-scoped — default private, публикация только после явного review.

## 18. Итог

Для aLandi наиболее сильная комбинация — не 10 framework dependencies, а **собственный bounded control plane + стандартные skill/tool/agent protocols + компактные specialist models по результатам benchmark + durable task state + strict security policy**. Это позволит вырасти от четырёх стадий одного model pipeline к настоящим субагентам и временным командам, не ломая V1 и не превращая 8-GB VPS в неуправляемую ферму моделей.
