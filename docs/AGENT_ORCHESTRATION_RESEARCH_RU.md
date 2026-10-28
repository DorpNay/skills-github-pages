# aLandi — ресерч по автономной оркестрации агентов

**Дата обзора:** 2026-10-28  
**Статус:** исследовательская записка и инженерное предложение; это не свидетельство реализации.

## Вывод

Рекомендуется собственный небольшой orchestration runtime поверх текущего gateway, а не немедленная замена всего стека одним агентным фреймворком. Наиболее полезные идеи: durable execution и восстановление (Restate/Temporal/Hatchet/DBOS), явные графы и checkpoints (LangGraph), декларативная авторизация (OPA/Cedar), настоящая изоляция (gVisor/Firecracker), adversarial evals (promptfoo/garak/Inspect), трассировка (OpenTelemetry), роли и явные flows (CrewAI/Microsoft Agent Framework), временной граф памяти (Graphiti) и протоколы взаимодействия (MCP/A2A).

Ни один фреймворк сам по себе не обеспечивает безопасную автономность. LLM планирует и предлагает; детерминированный код определяет права; sandbox ограничивает физические возможности; независимые проверки определяют, принят ли результат.

## Дополнительные open-source источники и переносимые идеи

| Источник | Что изучить и перенести | Применение в aLandi / ограничение |
|---|---|---|
| [Microsoft Agent Framework / Semantic Kernel](https://github.com/microsoft/semantic-kernel) (MIT) | Sequential, concurrent, handoff и group orchestration patterns | Описать типы узлов и переходов в DAG. Некоторые orchestration APIs могут быть экспериментальными; не добавлять SDK без прототипа |
| [CrewAI](https://github.com/crewAIInc/crewAI) (MIT) | Разделение автономных crews и детерминированных flows, typed outputs, human input | Принцип «flow управляет, агенты решают». Ролевые промпты не являются границей безопасности |
| [Hatchet](https://github.com/hatchet-dev/hatchet) (MIT) | Durable background tasks, очереди, retries, concurrency/rate limits, наблюдаемость | Сравнить с bounded scheduler; дополнительный сервис и Postgres требуют обоснования |
| [Restate](https://github.com/restatedev/restate) | Журналируемое durable execution, восстановление после crash, durable promises/timers | Стабильные ID, checkpoint каждой стадии и восстановление. Для внешних эффектов всё равно нужны idempotency/reconciliation |
| [DBOS Transact](https://github.com/dbos-inc/dbos-transact) | Durable workflows с checkpoints в Postgres | Альтернатива для устойчивых задач, если Postgres оправдан; не вводить БД только ради паттерна |
| [Open Policy Agent](https://github.com/open-policy-agent/OPA) (Apache-2.0) | Policy-as-code: отдельное allow/deny решение с контекстом ресурса и операции | Проверять principal, action, resource, scope, risk и approval status. Fail-closed |
| [Cedar](https://github.com/cedar-policy/cedar) | Типизированные RBAC/ABAC policies и проверка политик по схеме | Альтернатива OPA для authorization; выбрать один движок, не поддерживать оба без причины |
| [gVisor](https://github.com/google/gvisor) | Дополнительная граница изоляции контейнеров через userspace application kernel | Изолированный worker для недоверенных инструментов; ограничивать данные и тестировать escape/изоляцию |
| [Firecracker](https://github.com/firecracker-microvm/firecracker) (Apache-2.0) | Минимальные microVM с аппаратной границей виртуализации | Сильнее изоляция для недоверенного кода, если доступны KVM и эксплуатационный бюджет; egress фильтруется отдельно |
| [promptfoo](https://github.com/promptfoo/promptfoo) (MIT) | Повторяемые evals, сравнение моделей, red teaming, CI gates | Golden set для выбора инструментов, prompt injection, ложных одобрений; evals не доказывают безопасность |
| [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai) | Структура eval: задачи, solvers, scorers, tool-use и multi-turn tests | Независимая оценка оркестратора/helper-модели на собственных сценариях |
| [garak](https://github.com/NVIDIA/garak) | Автоматические probes для jailbreak, injection, утечек и других сбоев LLM | Adversarial набор для моделей и границ tools; дополнить end-to-end тестами gateway |
| [Graphiti](https://github.com/getzep/graphiti) (Apache-2.0) | Временной граф контекста и фактов | В перспективе память причин решений и версий навыков. Storage, tenancy и access control придётся обеспечивать самостоятельно |
| [Mem0](https://github.com/mem0ai/mem0) (Apache-2.0) | Разделение памяти по уровням и API извлечения/обновления | Сравнить memory lifecycle с существующей scoped SQLite memory; не включать cloud path по умолчанию |
| [A2A](https://github.com/a2aproject/A2A) (Apache-2.0) | Обмен задачами между независимыми агентами через capabilities и асинхронные статусы | Внешний интерфейс для другого процесса/сервиса; не нужен для внутренних ролей одного процесса |
| [MCP Registry / specification](https://github.com/modelcontextprotocol/registry) · [spec](https://modelcontextprotocol.io/specification) | Стандартизированное обнаружение и подключение tool servers | Каталог версий, schemas и capabilities. MCP не является sandbox или системой одобрения |
| [OpenTelemetry GenAI conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) | Стандартизированные traces/metrics для моделей и инструментов | Сквозной trace: task → plan → model → tool → approval → verifier. Не экспортировать prompts/secrets без политики |
| [NATS JetStream](https://github.com/nats-io/nats-server) | Durable event streams и acknowledgements | Рассматривать при реальном распределении workers; для небольшого deployment может быть лишним сервисом |
| [PydanticAI](https://github.com/pydantic/pydantic-ai) | Типизированные контракты, dependency injection, deferred tool approval | Референс для schema-first контрактов; type validation не заменяет authorization |

Числа stars намеренно не используются как критерий выбора: они изменяются и не доказывают безопасность. Перед внедрением зафиксировать конкретный tag/commit, лицензию, provenance и транзитивные зависимости каждого артефакта. Ссылки — upstream источники; это не заявление, что весь код каждого проекта прошёл аудит.

## Целевая архитектура

1. **Task contract:** task ID, цель, scope, входы/источники, acceptance criteria, deadline, бюджет времени/токенов/попыток, capabilities и risk tier.
2. **Orchestrator:** конечный автомат или DAG с версионированным состоянием, ограниченным делегированием, checkpoints и восстановлением.
3. **Policy engine:** детерминированный allow/deny перед каждым действием. LLM не может выдавать себе права или менять политику.
4. **Executor:** изолированный worker с минимальными правами, отдельной FS, лимитами CPU/RAM/time и сетевым egress allowlist; secrets недоступны по умолчанию.
5. **Approval gate:** одноразовое одобрение привязано к хешу операции и аргументов, scope, actor и expiry. Изменение аргументов инвалидирует ticket.
6. **Verifier:** отдельная проверка результата по критериям, тестам и артефактам. Самоотчёт исполнителя не является доказательством.
7. **Durable event log:** append-only события, snapshots, idempotency keys и исход каждого tool call. После crash проверять, завершилась ли внешняя операция.
8. **Observability:** трассировка, метрики и audit events; secrets и избыточные prompts исключаются.
9. **Fail-safe:** при неизвестной capability, ошибке policy, недоступном approval, превышении бюджета или непроверяемом побочном эффекте — остановить действие, не обходить gate.
10. **Autonomy:** автономность означает работу без постоянного оператора внутри заранее заданной области, а не неограниченные полномочия.

## Минимальный протокол задачи

- Основной путь: PROPOSED → VALIDATED → RUNNABLE → RUNNING → VERIFYING → SUCCEEDED.
- Дополнительные статусы: AWAITING_APPROVAL, REJECTED, FAILED, CANCELLED, BUDGET_EXHAUSTED, NEEDS_HUMAN.
- Каждый переход валидируется кодом и записывается в журнал.
- Повтор допустим только для retryable ошибок, с backoff и лимитом.
- Внешний side effect требует idempotency key или reconcile-процедуры; иначе автоматический повтор запрещён.
- Verifier возвращает PASS, FAIL или INCONCLUSIVE со ссылками на evidence; INCONCLUSIVE не считается успехом.

## План внедрения

**Phase 0 — аудит:** проверить актуальную ветку и реальные пути от запроса до инструмента. Наличие модуля не доказывает наличие подключённого runtime.

**Phase 1 — bounded orchestration:** формализовать schema/state machine; подключить существующие DAG, validator, routing, approval primitives и trace context. Не запускать дополнительные модели по умолчанию.

**Phase 2 — policy и sandbox:** добавить policy adapter и настоящий изолированный worker. До доказанной изоляции произвольное исполнение shell/кода остаётся заблокированным.

**Phase 3 — durable execution:** журнал, snapshots, idempotency/reconciliation, bounded retries, cancellation и resume. Сравнить лёгкую реализацию с Restate/Temporal/Hatchet на целевом профиле.

**Phase 4 — verifier и evals:** golden set на RU/EN (и TH, если нужен), тесты injection, ложных разрешений, scope leakage, зависаний, дублированных эффектов и crash/restart.

**Phase 5 — local helper:** одна отключаемая модель для узкой роли. Сравнить с deterministic baseline/main model по confusion matrix, false-approval rate, latency, peak RSS и качеству. Helper не подтверждает собственные полномочия.

## Минимальные acceptance criteria

- Все tool calls проходят schema validation и policy gate; неизвестные tools/capabilities отклоняются.
- Ошибки policy/approval работают fail-closed.
- Нет автоматических повторов неидемпотентного side effect без reconciliation.
- Approval ticket недействителен после изменения операции/аргументов/scope или истечения срока.
- Crash/restart восстанавливает состояние без повторения подтверждённых эффектов в тестовых сценариях.
- Отсутствующие доказательства и INCONCLUSIVE не принимаются как PASS.
- Adversarial suite проверяет injection из user input, retrieved docs, tool output и agent messages.
- Без helper-модели основной путь остаётся работоспособным.
- Feature flags выключены по умолчанию до review/evals.
- Никаких заявлений о production safety без sandbox escape tests и проверки на целевом хосте.

## Связь с текущим состоянием aLandi

Доступный PROJECT_STATE.yaml описывает bounded DAG prototype, schema validator prototype, approval ticket primitive без UI, SSRF helper и заблокированный CLI sandbox (AI-TOOLS-001..005). Агентные роли указаны как логические, helper dispatch не подключён к runtime (AI-AGENT-001..004). Эти статусы необходимо сверить с актуальной веткой и тестами перед реализацией.

Этот документ — исследование и proposal. Реализация не входит в его scope; в реестрах сохранять различие между proposed, accepted-for-implementation, implemented и verified.
