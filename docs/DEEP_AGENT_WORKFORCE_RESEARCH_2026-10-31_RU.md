> **Historical research snapshot — PR #131 / 2026-10-31; imported 2026-11-08.** Main baseline is now `c4f23e03f563d03213eb87002863da630fc8b833`. This file preserves source-derived findings and requirements; it does not assert current runtime implementation. The canonical active task register is `docs/MASTER_TASK_REGISTRY_RU.md` plus its existing addendum. Current source admission/review status is tracked in `INTEL.md`.

---

# aLandi — Deep Research: масштабируемая агентная платформа

**Срез:** 2026-10-31  
**Статус:** исследование и архитектурное предложение; runtime не менялся, ни один сторонний framework не принят как зависимость.  
**Требование владельца:** минимум пять реально параллельных независимых workers, работающих одновременно с главной моделью; отсутствие потолка в 64 профессии; возможность масштабировать логические задачи/agents до сотен и тысяч при наличии инфраструктуры.

## 1. Executive decision

**Не ограничивать aLandi 64 профессиями и не путать количество профилей, логических workers, одновременно выполняемых задач и параллельных LLM-инференсов.**

Целевой контракт:
- Главная модель остаётся владельцем диалога, постановки цели и финального ответа.
- Параллельно с ней могут работать **не менее пяти независимых worker AgentRuns** с отдельными контекстами, задачами, компетенциями и проверяемыми результатами.
- Для remote providers допускается не менее пяти одновременных worker inference calls плюс запрос главной модели — при наличии квоты/доступности провайдера.
- Для одного локального Ollama/GPU backend физическая параллельность определяется измерениями памяти и runtime. Нельзя без проверки поднимать локальную inference concurrency с 1 до 6 на VPS с 8 GB RAM. В этом случае worker tasks всё равно могут исполняться параллельно: сетевой поиск, чтение, парсинг, ожидание и независимые операции идут одновременно, а inference распределяется по backend-specific очереди.
- Масштаб до 100/1 024/тысяч означает прежде всего **логические задачи и короткоживущие workers через queue/lease**, а не обязательное наличие такого же числа загруженных моделей или процессов.

Первый рекомендуемый runtime — **собственный лёгкий control plane поверх существующих FastAPI, SQLite, ToolDAG и approval primitives**. Заимствовать отдельные идеи из Agensh, Hive, DeerFlow, OMA, AgentTeams и Octos. Не устанавливать их все и не заменять существующий стек новым продуктом.

## 2. Что уже было исследовано в aLandi — исходная база не потеряна

Новый проход начат не с нуля. Проверены:

1. `temp/2` — прежний большой список AI Mobile Agent v10+: smolagents/ReAct, Mobile-Agent-E hierarchy, Agent Skills/Hermes/OpenClaw, progressive disclosure, token-aware context, durable outbox, indexed tool selection. В самом документе отмечено, что прежний research flow был **manager-prompt + 1–2 последовательных шага, не настоящие multi-agent workers**.
2. `temp/1` — прежняя инженерная база по UI/SPA/CI/performance; сохранена как исторический источник, не переносится автоматически.
3. `docs/OPEN_SOURCE_TRIAGE_RU.md` — предыдущий triage проектов и пользователя, включая LangGraph, DBOS, Temporal, Agent Skills, MCP/A2A/AG-UI, OpenShell, PinchTab, OpenHands, Paperclip, RuFlo и др.
4. `docs/TECHNIQUE_REGISTER_RU.md` — принятые/отложенные решения и правило «идея ≠ установленная зависимость».
5. PR #125 и его файлы `AGENT_RESEARCH_CATALOG_RU.md`, `AGENT_PLATFORM_BLUEPRINT_RU.md`, `AGENT_MODEL_BAKEOFF_RU.md` — первый системный проход по агентным frameworks, skills, durable state, security и моделям. В частности, он уже описал 64 роли, профили, team templates, AgentRun и security gates. Этот research PR остаётся Draft; его исходные файлы не считаются merged в main.
6. Новый проход ниже расширяет предыдущую работу реальными новыми upstream за последние месяцы и исправляет слишком узкую трактовку concurrency.

## 3. Новые проекты с наиболее полезными архитектурными решениями

| Проект | Подтверждённая upstream идея | Что взять | Почему не копировать целиком |
|---|---|---|---|
| [Microsoft Agensh](https://github.com/microsoft/Agensh), [paper arXiv:2609.26781](https://arxiv.org/abs/2609.26781) | Самоорганизованная команда до 1 024 agents: workers находят/захватывают задачи, обмениваются находками, проверяют и асинхронно объединяют прогресс. В paper сообщается рост среднего test-pass 19.31% → 28.78% при 1→128 agents на пяти ProgramBench tasks; для Pandoc 33.89% → 55.06% при 1→1 024. Репозиторий MIT; опубликован 24.10.2026, 29.10 добавлена поддержка Codex/Claude Code/Pi/Copilot harnesses. | Claim/lease задачи, общий workspace, независимые проверки, асинхронный merge результатов, отсутствие обязательного центрального диспетчера для каждой микрозадачи. | Это research/benchmark result, не доказательство 1 024 одновременных LLM на малом VPS. Репозиторий использует Docker, Gitea, Mattermost, shared context и отдельную инфраструктуру. Эксперименты имели шестичасовой бюджет и мощные модели. |
| [Hive](https://github.com/aden-hive/hive) | Production-oriented agent colony: long-lived queen, динамический fan-out workers, playbooks/skills, общий SQLite tracker, проверка результатов и resume; активно развивается, Apache-2.0. | Queen сначала сама изучает задачу и создаёт reusable playbook; worker pool исполняет независимые jobs; общий tracker — источник состояния, не окно контекста; worker result проходит проверку. | Это отдельный Python/Node workspace, dashboard, tools и модели. Перенести patterns, не подключать второй UI/control plane. |
| [DeerFlow 2.0](https://github.com/bytedance/deer-flow) | Long-horizon SuperAgent harness: subagents, skills, memory, sandbox, tools, message gateway, scheduled tasks, document shelf, archive/replay. MIT. | Long-running task state, subagent isolation, sandbox boundaries, skill discovery, archive/replay, explicit current-task notes. | Большой стек и интеграционная поверхность. Использовать как reference и тестовый benchmark, а не переписывать aLandi под DeerFlow. |
| [Open Multi-Agent (OMA)](https://github.com/open-multi-agent/open-multi-agent) | Self-hosted TypeScript runtime; runTeam планирует задачу; durable approvals, verifiable run journal, governance checks; MIT; локальные и hosted models. | Approval pause/resume после restart, append-only journal, offline verification, отдельная проверка governance conclusion после успешного run. | TypeScript runtime дублирует Python gateway; заимствовать contracts/tests, не заводить второй runtime без измеримого выигрыша. |
| [AgentTeams](https://github.com/agentscope-ai/AgentTeams) | Manager–Workers, разные agent runtimes в одном Matrix room, MinIO shared file system, Higress AI gateway, task history, checkpoints, human intervention; Apache-2.0. Release v1.2.5 (16.10.2026). | Multi-runtime adapters, общая файловая область, worker lifecycle, visible task history и human intervention. | Требует Matrix/Element, MinIO, gateway и container orchestration; избыточно для первого aLandi deployment. |
| [Octos](https://github.com/octos-org/octos) | Embeddable Rust agent kernel с отделённым OUP protocol boundary; отдельные crates для agent execution, memory, LLM routing, plugins, workflows/swarm; native bindings. | Отделить Agent Kernel/API от UI; единый task/event protocol для браузера, CLI и будущих clients; модульные contracts. | Быстро меняющийся ранний проект; проверить release maturity, security, API stability и лицензию конкретного commit до code reuse. Не добавлять Rust kernel только ради моды. |

**Ключевой вывод:** самый интересный новый сдвиг — от «оркестратор раздаёт всем агентам полный prompt» к shared task board + claims/leases + короткие evidence artifacts + независимые worker sessions. Это уменьшает дублирование контекста и позволяет масштабировать число логических исполнителей.

## 4. Сравнение топологий — одна схема не подходит для всех задач

| Топология | Сильная сторона | Где использовать |
|---|---|---|
| Supervisor → parallel workers → synthesizer | Предсказуемое владение целью и финальным ответом | Default для aLandi; 5+ worker slots |
| Blackboard / shared task board | Workers независимо claim-ят задачи и публикуют результаты | Большие исследования, массовый анализ, сотни логических задач |
| Hierarchical swarm | Разделение доменов: координатор → менеджер направления → исполнители | Сложные проекты, где один уровень декомпозиции недостаточен |
| DAG / fan-out-fan-in | Явные зависимости и воспроизводимый порядок | Build/test, ingestion, data analysis |
| Agent-as-tool | Специалист возвращает ограниченный результат главной модели | Узкие роли, где handoff не нужен |
| Handoff | Передача ownership другому агенту | Диалоговые сценарии с реальной сменой ответственного |
| Debate / consensus | Независимые аргументы и альтернативы | Только для спорных/высокорисковых решений; не default |
| Event-driven queue / heartbeat | Долгие, возобновляемые и proactive задачи | После durable state, approvals и user-visible controls |

Нельзя превращать все запросы в рой. Fast/simple задача может завершаться одной моделью. Но сложная задача должна иметь возможность поднять минимум пять параллельных workers без переписывания архитектуры.

## 5. Новая целевая архитектура aLandi

```text
User
  |
  v
Main Model / Conversation Owner
  |  goal, plan, synthesis, final answer
  v
Agent Supervisor + Policy Gate
  |
  +---- Durable Task Queue / AgentRun Journal
  |          |
  |          +---- Worker 1: Research
  |          +---- Worker 2: Source Verification
  |          +---- Worker 3: Engineering / Data
  |          +---- Worker 4: Independent Critic
  |          +---- Worker 5: Specialist / Multimodal
  |          |
  |          +---- dynamically claimed tasks (N logical workers)
  |
  +---- Shared Blackboard: typed artifacts, citations, status, hashes
  |
  +---- Model Router / Provider-specific concurrency pools
  |
  +---- Capability Tool Gateway / scoped credentials / approvals
  |
  +---- Independent Verifier -> Main Model -> User
```

### 5.1 Concurrency — две разные квоты

Не вводить один общий параметр «max agents». Разделить:

- `active_worker_slots`: число параллельно живых AgentRuns, target default **5**, с динамическим ростом по задаче и ресурсам.
- `inference_concurrency[backend]`: допустимые параллельные генерации отдельно для каждого model/provider backend.
- `queued_tasks`: число логических задач в очереди; может быть сотни/тысячи при bounded physical workers.
- `tool_concurrency[tool]`: отдельный лимит сетевых/файловых/браузерных операций.
- `memory_budget`, `token_budget`, `deadline`, `cost_budget`: per-run и per-task.
- Main interactive request имеет приоритет над фоновыми worker requests, но workers не уничтожаются без причины; scheduler умеет pause/yield/resume.

Для remote provider pool целевой acceptance: пять worker calls могут работать одновременно с main request, если provider quota разрешает. Для локального Ollama pool — concurrency только после измерения RSS/VRAM/KV cache. Один локальный checkpoint не надо копировать в RAM пять раз; один model service может обслуживать requests по очереди или batching, если backend это поддерживает.

### 5.2 AgentRun contract

Каждый run — durable объект, не временная переменная в prompt:
- immutable `run_id`, `parent_run_id`, `task_id`, `agent_profile_id`, `skill_versions`;
- state: queued → claimed → running → waiting_tool/approval → paused → completed/failed/cancelled/expired;
- append-only events + snapshots/checkpoints;
- lease owner, lease expiry, heartbeat, attempt number;
- input/output artifact refs, citations, provenance, checksums;
- model/provider, token/cost/latency usage, deadlines and budgets;
- allowed capabilities, credential scope, risk level, approval record;
- idempotency key, retry policy, failure reason, verifier result;
- explicit cancel/pause/resume and crash recovery.

Начальный persistence можно реализовать на SQLite (WAL, append-only event table, transactional claim/lease, snapshots). Не добавлять Redis/Postgres/Temporal просто ради архитектурной диаграммы. При доказанной потребности в нескольких hosts/worker replicas сравнить DBOS/Temporal/Restate и миграционный путь.

### 5.3 Профессии и навыки без искусственного потолка

64 существующие роли сохранить как seed catalog, но:
- не фиксировать schema/array length в 64;
- поддержать user-defined profiles, aliases, domain packs и динамическую композицию;
- разделить Profession (что агент умеет), Skill (как выполнить процедуру), Capability (какие действия разрешены), Tool (конкретный API), ModelPolicy (чем генерировать);
- skill format — Agent Skills: `SKILL.md` + optional references/scripts/assets; progressive disclosure;
- динамически формировать team из minimal necessary roles;
- каждый profile имеет version, source, license, trust state, evals, model preference, language, allowed tools, resource profile and rollback.
- пользователь может создать собственную профессию, объединить skills и импортировать reviewed skill pack.
- model output не может расширять capabilities, менять policy или выдавать себе credentials.

### 5.4 Протоколы — каждый для своего слоя

- **Agent Skills** — переносимый формат навыков.
- **MCP** — tools/resources/prompts; каждый server untrusted до проверки.
- **A2A** — явное делегирование независимому внешнему агенту.
- **AG-UI** — UI event stream для run/task/tool/subagent status.
- **ACP** — agent ↔ IDE/client session, не общий internal swarm protocol.
- Внутренний AgentRun API должен оставаться typed и provider-neutral; не делать MCP/A2A обязательными для внутренних вызовов в одном процессе.

## 6. Что именно взять у новых проектов

1. **Agensh:** task claims, peer progress, shared workspace, asynchronous merge, self-organized collaboration. Не переносить всю Gitea/Mattermost/Docker инфраструктуру.
2. **Hive:** queen learns first, creates a reusable playbook, workers update a queryable tracker, result validation before final answer. Это самый близкий практический pattern для пользовательского «сделай большую работу».
3. **OMA:** durable approvals, offline-verifiable run journal, governance floor. Применить к side-effectful tools and pause/resume.
4. **DeerFlow:** long-horizon subagent workspace, skill and memory lifecycle, sandbox-first thinking.
5. **AgentTeams:** manager/worker adapter boundary, cross-runtime workers, visible human intervention.
6. **Octos:** separate kernel/protocol/UI; рассматривать как architecture comparison, не dependency.
7. **OpenAI Agents SDK / PydanticAI / LangGraph / Google ADK / Microsoft Agent Framework** из предыдущего каталога оставить в comparison matrix: взять agent-as-tool vs handoff, typed outputs, checkpoints, parallel supersteps, usage propagation и tracing, но не устанавливать всё сразу.

## 7. Рекомендуемые этапы реализации

| Phase | Результат | Acceptance |
|---|---|---|
| 0 — Research (этот PR) | Сравнение новых upstream и целевой архитектуры | Первичные источники, лицензии, риски и decision matrix |
| 1 — Contracts | AgentProfile, SkillManifest, Capability, AgentTask, AgentRun, BudgetPolicy | Schema/property tests, stable IDs, deny-by-default |
| 2 — Durable scheduler | SQLite queue, claims/leases, event log, snapshots, retries, cancellation | Crash/restart, duplicate claims, expired lease, idempotency, recovery tests |
| 3 — 5 parallel workers | Supervisor запускает минимум 5 независимых AgentRuns параллельно с main conversation | Integration test с 5 workers + main, независимые histories, no cross-scope leakage, deterministic stop |
| 4 — Backend pools | Remote-provider concurrency + local resource-aware queue | Provider quota tests; target-host RAM/VRAM/p95; main priority; backpressure |
| 5 — Dynamic workforce | Dynamic roles, skill composition, hierarchical teams, hundreds/thousands logical tasks | Load tests with virtual workers, bounded physical workers, fairness and memory ceiling |
| 6 — Security and external agents | Sandbox, credential broker, approvals, A2A, audit | Prompt injection, peer spoofing, sandbox escape, credential isolation |
| 7 — Learning and ecosystem | Skill build/audit/eval/refresh, optional marketplace | Human review, provenance, signed manifests, rollback; no autonomous production mutation |

### 7.1 Обязательные evals

- Baseline main-only vs main + 1/5/10/50 logical workers.
- At least 5 worker tasks active concurrently while the main conversation remains responsive.
- Compare one model shared by workers vs multiple providers vs small specialist models.
- Measure completion quality, source/citation correctness, latency p50/p95, total tokens, cost, peak RSS/PSS/VRAM, queue delay and cancellation latency.
- Failure injection: worker crash, timeout, duplicate claim, expired lease, provider 429, restart, malformed tool result, stale artifact.
- Security: task prompt injection, poisoned shared artifact, peer identity spoofing, tool escalation, project memory leak.
- Evaluate RU/EN/TH and mixed-language prompts.
- The swarm must improve quality/latency or capability on tasks where it is invoked; more agents are not an automatic quality win.

## 8. Риски и жёсткие правила

- Не обещать 1 024 параллельных model generations на 8-GB VPS.
- Не создавать один постоянный процесс/модель на каждую профессию.
- Не давать worker-ам полный разговор, global memory или все credentials.
- Не разрешать peer agent менять чужой task status без lease ownership.
- Не позволять skill metadata выдавать permissions.
- Не включать shell/browser/desktop execution до sandbox and credential isolation.
- Не допускать бесконечных debate loops: budget, deadline, stop conditions, verifier.
- Не продвигать self-modified skills в production без review, eval and rollback.
- Не подключать новый framework как runtime dependency, пока spike не докажет измеримый выигрыш против существующих primitives.

## 9. Source links и первичные материалы

- [Agensh repository](https://github.com/microsoft/Agensh) · [Agensh paper](https://arxiv.org/abs/2609.26781) · [reproduction guide](https://github.com/microsoft/Agensh/blob/main/REPRODUCE.md)
- [Hive](https://github.com/aden-hive/hive) · [Hive Apache-2.0 license](https://github.com/aden-hive/hive/blob/main/LICENSE)
- [DeerFlow 2.0](https://github.com/bytedance/deer-flow) · [MIT license](https://github.com/bytedance/deer-flow/blob/main/LICENSE)
- [Open Multi-Agent](https://github.com/open-multi-agent/open-multi-agent)
- [AgentTeams](https://github.com/agentscope-ai/AgentTeams)
- [Octos](https://github.com/octos-org/octos)
- [Agent Skills spec](https://agentskills.io/specification)
- [MCP spec](https://modelcontextprotocol.io/specification)
- [A2A spec](https://a2a-protocol.org/latest/specification/)
- [AG-UI spec](https://docs.ag-ui.com/)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [LangGraph docs](https://docs.langchain.com/oss/python/langgraph/overview)
- [DBOS Durable Execution](https://docs.dbos.dev/)

## 10. Итоговая рекомендация

Сделать aLandi не «чатом с 64 персонажами», а **multi-agent operating layer**: main model + минимум пять параллельных workers + dynamic task queue + durable run state + extensible professions/skills + provider-specific inference pools + independent verification. На малом VPS логические workers масштабируются независимо от локальных inference slots; для реальной параллельной генерации использовать разрешённые remote pools или измеренный local serving runtime. Это даёт путь к тысячам логических задач без тысячи постоянно работающих процессов.


## 2026-11-02 — Agent capability catalogue and UI contract

### User-facing taxonomy

The Functions → Agents panel should be a capability catalogue, not a list of pretend-running agents. It must distinguish three states on every row:

1. **Available now** — implemented, wired to a real handler, permissioned and covered by tests.
2. **Blueprint only** — editable/saved design data that does not start execution.
3. **In design** — roadmap item with no action control; show the aLandi `1ИÆИT10И` ticker and a plain-language limitation.

Recommended sections, in this order:

- **Use cases:** research/source verification; software planning/review; data analysis; product/due diligence; document and knowledge processing.
- **Execution modes:** direct single-model response; current sequential four-stage workflow; future bounded fan-out/fan-in; future hierarchical delegation; future event-driven/durable tasks.
- **Professions and roles:** the existing 64-role seed catalogue grouped into orchestration, research/evidence, engineering/QA, knowledge/skills, multimodal processing and operations. Sixty-four is not a hard cap and does not mean 64 running processes.
- **Team blueprint:** scenario, role mix, task goal, output contract and budget. Values currently stored in chat settings are configuration notes only.
- **Models and resources:** main model, optional helper role, exact model ID/digest/license, context/output limits, RAM/VRAM, concurrency and measured language coverage.
- **Tools and permissions:** explicit read/write/network/memory/execute scopes, approval policy and audit trail. Role or skill names never grant capabilities.
- **Run controls and outputs:** queue, progress, pause/resume/cancel, approvals, artifact list, errors, retry and final verification. Never expose hidden chain-of-thought.

### Agent task packet and lifecycle

Every independently scheduled worker should receive a typed packet with: run/task/parent IDs; objective; bounded input references; allowed capabilities; model policy; deadline; token/tool/output budgets; expected schema; cancellation signal; idempotency key; and evaluation contract. It must not inherit the whole chat history or unrestricted project access by default.

Suggested durable states: `queued → planning → ready → running → waiting_approval / paused → verifying → succeeded | failed | cancelled | timed_out`. Persist append-only events and periodic snapshots. Recovery must resume from a verified checkpoint, not replay non-idempotent side effects.

### Concurrency rule

Keep logical worker concurrency separate from inference concurrency. The owner requirement for at least five independent workers alongside the main model must be met by independent task execution and state; it does not authorize loading five model checkpoints into an 8-GB host. Use bounded queues, main-request priority, backpressure, fairness and an explicit inference semaphore. GPU-only profiles fail closed when a compatible GPU or VRAM budget is unavailable.

### Skills boundary

Use the Agent Skills directory format as a separate future loader; preserve the existing `skills/*.txt` prompt-profile contract. A skill may describe procedures and suggest tools but must never grant filesystem/network/shell permissions or auto-execute scripts. Import requires provenance, license, injection scan, schema validation, generated eval questions and human approval. See the official [Agent Skills specification](https://agentskills.io/specification).

### Interoperability

Keep protocol layers distinct: [MCP](https://modelcontextprotocol.io/specification) exposes tools/context; [A2A 1.0.0](https://a2a-protocol.org/latest/specification/) coordinates independent agents and long-running tasks; [AG-UI 1.0](https://docs.ag-ui.com/spec/1.0) streams typed user-facing events. Do not implement all three at once or adopt a second orchestration runtime before a measured contract need.


## 12. Owner-provided source review — 2026-11-03

**Evidence addendum:** source triage and proposed runtime specification are recorded below in this canonical research document. This pass is reference research; no runtime, dependency, model, permission or UI execution capability changed.

Highest-value patterns for aLandi:
- Worktrunk: worktree isolation and lifecycle for concurrent coding agents.
- Goose: UI-independent agent loop + typed extension/tool contract.
- ECC: portable skills/rules/hooks/evals with thin harness adapters.
- SWE-agent: compact predictable Agent-Computer Interface and reproducible task evaluation.
- dsh-our-free-model: model availability/capability discovery, effort normalization, fallback semantics and usage telemetry (not an agent orchestrator).
- Scrapling: optional research extraction/browser adapter behind SSRF/domain/rate/terms policy.
- Colibri: local MoE inference candidate; benchmark disk-stream latency and RAM before route adoption.
- Nanochat: training/evaluation learning reference; not an immediate runtime.
- GPT Pilot/Plandex/Roo Code: incremental plan → scoped implementation/delegation → diff review → human approval patterns.
- Xiryn: isolated per-agent computer concept, but maturity/security/supply-chain review required before experiment.
- Tabby: code-specialist helper candidate, not supervisor.

Unresolved owner source identities: Agent-desktop and Grill-me require exact canonical URLs. ECC interpreted provisionally as affaan-m/ECC (Everything Claude Code); Taby provisionally normalized to TabbyML/Tabby. “TensorFlow” is not a specific runtime choice; investigate LiteRT only with benchmark. Full owner-provided 60-source list was not re-reviewed in this addendum.

**Next bounded action:** choose first offline-first AgentRun slice and approve source identities. Keep current multi-agent runtime as SPECIFIED/HOLD until schema, state machine, threat model, eval and permissions are reviewed.

### 12.1 Source-level disposition

| Source | Pattern worth borrowing | aLandi disposition |
|---|---|---|
| [dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model) | Live model availability/capability discovery, multi-wire adapters, effort/budget normalization, fallback classification, telemetry, signed update/rollback. | Reference, not install; not an orchestrator. Never silently route private user content through “free” provider. |
| [Worktrunk](https://github.com/max-sixty/worktrunk) | Git worktree lifecycle, hooks, status/CI aggregation, unique ports/build cache for concurrent coding agents. | High priority harness pattern: one worktree per coder, integration stage, no automatic merge/delete in owner repo. |
| [Scrapling](https://github.com/D4Vinci/Scrapling) | Adaptive parser and MCP browser sessions/snapshots/actions/network capture. | Optional research adapter behind allowlist, SSRF/redirect/rate/terms controls. Stealth/CAPTCHA bypass not default. |
| [Colibri](https://github.com/JustVugg/colibri) | Pure-C MoE inference, disk-stream experts, resource planning, compatible gateway. | Local model runtime candidate only; benchmark disk latency/RAM and throughput before route. Not agent framework. |
| [Nanochat](https://github.com/karpathy/nanochat) | Minimal training pipeline covering tokenizer/pretrain/finetune/eval/inference. | Learning/eval reference, not immediate worker runtime. Training requires data/GPU; first benchmark available compact models. |
| Agent-desktop | Exact upstream not identified. | Unresolved; no adoption or capability claim before canonical URL. |
| [TensorFlow](https://github.com/tensorflow/tensorflow) | ML framework; LiteRT/TFLite possible deployment path on supported devices. | No core dependency. Research only if device/model benchmark proves gain. |
| Grill-me | Canonical project/skill URL not identified; interactive requirements interrogation is only a hypothesis. | Unresolved; request exact URL. |
| [Xiryn](https://github.com/SouravBeraAkaSpeed/xiryn) | Isolated Linux desktop per Docker agent, user model keys, agent handoffs. | Architecture reference only; audit maturity, Docker privilege, vault, retention and setup supply chain. |
| [Goose](https://github.com/block/goose) | UI-independent agent loop and typed MCP extensions; concurrent instances. | High priority adapter pattern; enforce aLandi capabilities/approval centrally. |
| [Tabby](https://github.com/TabbyML/tabby) | Self-hosted code assistant/completion and code Q&A. | Optional specialist, not supervisor. “Taby” tentatively normalized to Tabby. |
| [GPT Pilot](https://github.com/Pythagora-io/gpt-pilot) | Stepwise spec/architecture/implementation/review/debug with human feedback. | Borrow workflow, not role-play; distinct agent only if separate session actually executes. |
| [Plandex](https://github.com/plandex-ai/plandex) | Plan-first task breakdown and reviewable diffs. | Borrow diff proposal/approval/rollback; verify exact release before implementation. |
| [SWE-agent](https://github.com/SWE-agent/SWE-agent) | Purpose-designed Agent-Computer Interface and repeatable issue/test eval. | High priority compact read/search/patch/test tool surface and benchmark reference. |
| [Roo Code](https://github.com/RooCodeInc/Roo-Code) | Architect/Code/Debug/Ask modes and orchestrator delegation. | Modes are policy profiles, not rights. Verify context isolation in target release. |
| [ECC](https://github.com/affaan-m/ECC) | Portable skills/rules/hooks/memory/planning/security/evals with harness adapters. | High priority: canonical shared assets + thin harness adapters + deterministic hooks and evals. ECC exact identity remains provisional. |

“60 sources” remains a reference catalog; this pass does not claim a complete re-review. ECC likely means Everything Claude Code; Taby likely means TabbyML. TensorFlow is too broad to select a runtime. Agent-desktop and Grill-me need exact links.

### 12.2 Proposed durable AgentRun architecture (SPECIFIED)

```text
User/UI → Gateway AgentRun API (durable run + event stream)
        → Supervisor (main model: goal/decomposition/policy/synthesis)
        → SQLite task board (atomic claim/lease/dependencies/idempotency)
        → bounded worker pool (isolated contexts; model routes per task)
        → independent validator (schema + evidence + deterministic tests)
        → scoped artifact/provenance store → supervisor synthesis
```

Durable contracts:
- AgentRun: owner, chat/project scope, goal, policy snapshot, state, deadline, budgets, cancellation, result refs.
- Task: parent/dependencies, typed source refs, output schema, lease owner/expiry, idempotency, attempts/state.
- WorkerProfile: role, model policy, skill IDs+hashes, tool/data scopes, budgets and eval.
- ModelRoute: provider/model ID, capability/availability, context/output budgets, privacy class, latency/cost and concurrency.
- ToolCall: typed args, run/task, effective scope, approval, result/error, redacted audit.
- Artifact: hash, MIME, provenance, scope, validator result, retention.
- RunEvent: append-only lifecycle journal; do not persist hidden chain-of-thought.

**Logical worker concurrency is distinct from model inference concurrency.** Queue workers against measured provider/runtime slots; a local Ollama concurrency=1 must not be represented as six parallel generations.

Small model route candidates: classification, query expansion, source relevance, structured extraction/schema repair, short summary/deduplication, bounded code/test/review. Each route must pass golden-set quality, schema validity, hallucination/omission, RU/EN, injection resistance, latency, peak RAM/VRAM, tokens and cost. No silent fallback to another data processor; “free” is not a privacy guarantee. Prefer deterministic code for exact transformations.

### 12.3 Safeguards and implementation sequence

- Capability intersection: effective = task_request ∩ worker_profile ∩ user_grant ∩ environment_policy.
- Read-only default; write/execute/network grants separate; external side effects require approval.
- Source IDs/offsets/hashes rather than broad chat/project context. Website/tool/Skill content is untrusted and cannot alter system policy.
- Lease expiry, idempotency and checkpoints; categorized bounded retries; no blind side-effect retry.
- Enforce per-task/run token, tool, time, bytes, concurrency and money budgets at dispatch/execution.
- Pause/resume/cancel propagate; user sees lifecycle and evidence, not hidden reasoning.
- Code workers get isolated worktrees/sandboxes; conflicts are explicit and merge is separate.
- Typed result + evidence; validator may reject/requeue/escalate.

Recommended increments:
1. SPECIFIED schemas/state machine/threat model/capability matrix/evals.
2. **PROTOTYPE IMPLEMENTED:** file-backed SQLite lifecycle store in `gateway/agent_runtime/store.py`; offline tests in `gateway/tests/test_agent_run_store.py`. Run/task idempotency, state revision, atomic claim, expiring lease token fencing, bounded retries/recovery, cancellation, metadata-only event journal and a safe task payload/result persistence contract are covered. Persisted task data is limited to bounded scalar metadata plus bounded string reference lists keyed by `*_refs`, `*_ids`, or `*_keys`; raw-content/sensitive keys, nested objects and arbitrary arrays fail closed. Exact-head Gateway CI on `f1ebb86f9afdc4bc7a96d87c1eed394eef89a28c`: **206 passed, 2 warnings**; Quality Sentinels: **98 Chromium tests + 1 published-site smoke passed**, with Freshness, Graphify, Dead Code, Provenance, Jekyll, Integrity, Security, Context and Ruff/static analysis green. Production API/runtime integration remains absent.
3. Real single-worker vertical slice: actual provider session + narrow tool + artifact + deterministic validator.
4. Real 2–3 concurrent independent sessions; prove separate contexts/run IDs and race/retry/cancel behavior.
5. Small-model bakeoff; route only measurable wins.
6. UI states after durable API, permissions and tests exist.
7. Scale ≥5 remote workers after load/eval/sandbox gates; 100+ logical tasks via queue; never infer 1k model processes.
8. Thin harness adapters for aLandi/Hermes/Goose/ECC; canonical contracts stay harness-neutral.

Acceptance: at least three genuinely concurrent sessions (later ≥5), distinct IDs/contexts, no cross-scope access, restart recovery, no silent write collisions, cancellation/approval prevents side effects, schema/evidence validation, budget enforcement, independent reviewer catches seeded defects. Measure completion/pass, verifier rejection, duplicate work, wall time, token/cost, RAM/VRAM, queue time, retries and human intervention against a single-model baseline on identical golden tasks. No claimed gain without repeatable comparison.

### 12.4 Cross-workstream integration

- PR #125 Agent Studio: profiles/roles/model bakeoff; reuse, do not duplicate.
- PR #128 Agent Workforce: primary home for durable AgentRun/task lease/capability/eval contracts.
- PR #129 Voice: future scoped audio artifacts.
- PR #130 Deep Research: worker evidence references/provenance.
- PR #131 Landing UI 2.0: existing sequential four-stage one-model pipeline and local Blueprint remain non-runtime. Expose execution only after API, permission and test gates.
