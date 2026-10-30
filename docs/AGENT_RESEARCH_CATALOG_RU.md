# aLandi — каталог исследований и источников по AI Agents

**Дата среза:** 2026-10-30.  
**Назначение:** аннотированный каталог первичных спецификаций, upstream-проектов, исследовательских коллекций и ранее найденных источников-вдохновителей. Это не список зависимостей, которые нужно установить.  
**Метод:** 73 targeted searches по семи workstream-группам; до 435 candidate result slots запрошено у поисковой системы (не число уникальных источников). Приоритет — официальные docs/specs, upstream README/release/model cards; marketing claims и vendor benchmarks помечаются как таковые.

## 1. Ключевой вывод

Для aLandi не существует одного фреймворка, который лучше всех решает одновременно orchestration, durable execution, model routing, memory, tool security, sandbox, skill lifecycle, workforce management и UI. Лучшее решение — взять узкие идеи из зрелых систем, сохранить собственный API/runtime и внедрять компоненты по одному с eval и rollback.

## 2. Ранее найденные и переданные источники-вдохновители

| Источник | Что изучить/перенести | Применимость и ограничения |
|---|---|---|
| [Book-to-Skill](https://github.com/virgiliojr94/book-to-skill) | Превращение книг/документов в процедурные skills; главы и on-demand references; provenance; multilingual chapter detection; extraction cleanup; prompt-injection scan. Проверенный release v1.3.0 датирован 2026-07-30; upstream repo указывает MIT. | Сильный design reference для Knowledge-to-Skill. Не встраивать CLI целиком: сначала проверить latest tag/commit, зависимости, threat model и совместимость. Не считать его output автоматически безопасным. |
| [Anything-to-Skill](https://github.com/asale-ai/anything-to-skill) | Четыре операции build/audit/eval/refresh; двухпроходное чтение; source links; аудит размера/триггеров навыка; dry-run; проверка SHA256 бинарного релиза. Upstream указывает Apache-2.0. | Очень полезен для skill lifecycle. Build требует Anthropic API key; CLI на Rust/Node launcher не соответствует текущему минимальному backend без отдельного обоснования. Заимствовать workflow, не dependency. |
| [Agent Skills specification](https://agentskills.io/specification) | Открытая структура skill directory: SKILL.md, optional scripts/references/assets; YAML frontmatter; progressive disclosure. | Канонический формат навыка. `allowed-tools` помечен experimental и не заменяет server-side authorization. |
| [Awesome Harness Engineering](https://github.com/ai-boost/awesome-harness-engineering) | Систематизация agent loop, context, planning, tools, MCP, permissions, memory, orchestration, verification, observability, sandbox. | Отличный discovery index, не normative spec. Upstream README помечает license как Other; проверять лицензию на содержимое/подресурсы до копирования. |
| [Awesome Agentic Patterns](https://github.com/nibzard/awesome-agentic-patterns) | Pattern-first каталог: orchestration, subagent spawning, memory, feedback, reliability, security, collaboration. | Использовать как карту паттернов, не как доказательство их production readiness. Repo указывает Apache-2.0; отдельные ссылки проверять независимо. |
| [Awesome Agents](https://github.com/kyrolabs/awesome-agents) | Discovery framework, eval, research, memory, browser, coding, automation и agent products. | Широкий список для поиска кандидатов; активность, license и security проверять по каждому upstream. |

## 3. Orchestration frameworks и agent SDKs

| Проект / источник | Подтверждённая сильная сторона | Что взять / caveat |
|---|---|---|
| [LangGraph docs](https://docs.langchain.com/oss/python/langgraph/overview) и [checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) | Низкоуровневый graph runtime; deterministic + agentic nodes; persistence, interrupts, human-in-loop, checkpoint recovery, parallel supersteps. | Главный кандидат для сравнительного prototype orchestration. Не добавлять как зависимость до проверки SQLite persistence, migration, runtime footprint, license/dependency, model adapters. |
| [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) и [orchestration guide](https://developers.openai.com/api/docs/guides/agents/orchestration) | Минимальные primitives: Agent, tools, handoffs, agent-as-tool, guardrails, sessions, human approvals, tracing, sandbox agents. Официальный guide прямо различает ownership handoff и specialist-as-tool. | Заимствовать agent-as-tool как default и handoff только при смене владельца. Provider portability и sandbox adapters проверить отдельно. |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) | Python/.NET; graph workflows sequential/concurrent/handoff/group collaboration; checkpointing, streaming, human-in-loop, OpenTelemetry. | Сильный benchmark candidate для typed workflows. Большая интеграционная поверхность; .NET не нужен текущему stack. |
| [Google ADK](https://google.github.io/adk-docs/) / [google/adk-python](https://github.com/google/adk-python) | Agent hierarchies, Sequential/Parallel/Loop workflows, fan-out/fan-in, Task API, MCP/OpenAPI tools, tool confirmation, evaluation. | Заимствовать workflow primitives и hierarchy. Проверить provider-neutrality, dependencies и runtime cost. |
| [PydanticAI multi-agent](https://pydantic.dev/docs/ai/guides/multi-agent-applications) | Пять уровней сложности; SubAgents; isolated message histories; usage propagation; usage/token/cost/request/tool limits; typed outputs. | Особенно полезен для contracts, child-context isolation и budgets. Не нужен отдельный framework, чтобы перенести эти контракты в текущий Python. |
| [Hugging Face smolagents](https://huggingface.co/docs/smolagents/examples/multiagents) | Manager + managed agents; JSON tool-calling vs CodeAgent; named/description workers; executor abstraction. | Лёгкая master-worker модель. CodeAgent опасен без реальной sandbox; не давать subprocess/shell доступ на host. |
| [CrewAI](https://docs.crewai.com/en/index) | Crews (role-based collaboration), Flows (event-driven control), sequential/hierarchical processes, guardrails, task outputs. | Источник профессий и организационных процессов. Не путать роль/crew с независимой моделью; не разрешать unrestricted delegation. |
| [AgentScope](https://github.com/agentscope-ai/agentscope) | Agent service, leader-worker, message bus, toolkits, MCP, skills, memory, multi-session service, scheduling and sandbox adapters. | Очень широкий функциональный reference. Продуктовый service и dependencies могут дублировать gateway aLandi; изучать по модульным паттернам. |
| [CAMEL-AI](https://github.com/camel-ai/camel) | Multi-agent societies, role-playing, simulation, dynamic collaboration, research at scale. | Вдохновение для swarm research и simulations. «Millions of agents» — проектная/исследовательская capability, не реалистичная цель VPS. |
| [MetaGPT](https://github.com/FoundationAgents/MetaGPT) | Software-company metaphor, roles, SOP, PRD/design/tasks/code/test pipeline. | Полезен для инженерных team templates. Не копировать фиксированный длинный workflow в каждый запрос. |
| [AutoGen → Microsoft Agent Framework migration](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/) | Microsoft описывает Agent Framework как эволюцию AutoGen/Semantic Kernel; graph Workflow, checkpoint/resume, отличия от Teams. | Для новых Microsoft-oriented прототипов сравнивать MAF, не начинать новый стек на старых AutoGen API без конкретной причины. |
| [AG2](https://github.com/ag2ai/ag2) | Продолжение линии multi-agent conversation patterns. | Сравнительный источник, не default dependency; group chat может раздувать токены и ухудшать остановку/аудит. |

## 4. Agent workforce, persistent assistants и execution workspaces

| Проект | Что интересного | Ограничение для aLandi |
|---|---|---|
| [Paperclip](https://github.com/paperclipai/paperclip) | Org chart, роли и reporting lines, goals, task/issue system, heartbeat queue, adapters, budgets, approvals, pause/resume/terminate, run history, skill studio, evals. MIT repo; Node.js + React control plane. | Один из лучших источников workforce/control-plane UX. Переносить сущности и governance, не заменять FastAPI/SQLite на второй control plane. Учесть, что spend enforcement зависит от корректности provider usage reporting. |
| [OpenClaw subagents](https://docs.openclaw.ai/subagents), [multi-agent routing](https://docs.openclaw.ai/concepts/multi-agent/), [security](https://docs.openclaw.ai/security/) | Background child runs, isolated sessions, nested depth, announce chain, per-agent workspace/skills/model/auth profiles, allowlists and sandbox controls. | Отличный lifecycle/session reference. Security docs прямо предупреждают: один gateway — одна trust boundary; не считать его hostile multi-tenant boundary. |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent) | Skill discovery, persistent memory, session search, subagents/parallel work, cron, multiple terminal backends, adapters. | Хороший inspiration for learning loop and toolsets. Self-improving skills должны быть candidate → eval → review → version, не auto-promotion. |
| [OpenHands SDK](https://docs.openhands.dev/sdk/arch/overview) и [Docker sandbox](https://docs.openhands.dev/openhands/usage/sandboxes/docker) | Agent/workspace separation, DockerWorkspace, remote execution, multiple isolated containers, event streaming. | Полезно для coding-agent workspace. Не монтировать весь host filesystem; container setup не отменяет network/credential policies. |
| [Magentic-One paper](https://arxiv.org/html/2411.04468) / [Microsoft Research project](https://aka.ms/magentic-one) | Orchestrator with separate task ledger (facts/plan) and progress ledger (worker assignments/status); specialized WebSurfer, FileSurfer, Coder and ComputerTerminal; stall detection, reset and replanning. | Очень близкий образец bounded generalist team. Заимствовать ledgers, explicit progress and recovery, not unrestricted shell/browser permissions; paper results are benchmark-specific. |
| [Browser Use](https://github.com/browser-use/browser-use) | MIT Python browser-agent framework, Playwright/CDP integration, custom actions, structured outputs and session APIs. | Candidate Browser Worker adapter. Distinguish local open-source runtime from hosted Browser Use Cloud; do not send private browser context to hosted service without owner approval. |
| [Langfuse tracing](https://langfuse.com/docs/observability/get-started) | OpenTelemetry-compatible LLM tracing with agent/tool/chain/retriever/guardrail/evaluator observations, token/cost and scoring. | Reference for run timelines and trace UX. Keep local/self-hosted or OTEL-only by default; prompt/tool payloads can contain secrets and private data. |
| [MCP-Scan](https://invariantlabs-ai.github.io/docs/mcp-scan/) / [upstream](https://github.com/invariantlabs-ai/mcp-scan) | Discovers MCP configs/servers/skills; detects tool poisoning, indirect prompt injection, cross-origin escalation, rug-pull changes and sensitive-data flows; optional proxy enforcement. | Strong security-review candidate for MCP registry. Some scanner modes share tool names/descriptions with Invariant's hosted API; privacy and data-flow review required before use. License/runtime fit must be checked separately. |
| [garak](https://docs.garak.ai/garak/) | LLM vulnerability scanner with probes/detectors for prompt injection, jailbreaks, encoding attacks and other model failure modes. | Use as adversarial model/agent evaluation reference; probes are not a proof of safety, and hosted model scans may require external API keys. |
| [Open Policy Agent](https://openpolicyagent.org/docs) / [Cedar](https://docs.cedarpolicy.com/) | Declarative policy-as-code; OPA/Rego is general-purpose policy evaluation, Cedar focuses on authorization decisions over principal/action/resource/context. | Keep current fail-closed policy code first. Benchmark only if policy complexity grows; adding a policy engine does not replace correct enforcement points or capability modeling. |
| [RuFlo](https://github.com/ruvnet/ruflo) | Swarm topologies (hierarchical/mesh/adaptive), agent federation, MCP tool surface, background workers, memory and self-learning concepts. | Большая часть capability claims — upstream project claims; license/status and exact package composition need separate audit. It targets Claude Code/Codex-style harness integration; do not import its 300+ tool surface or account-level hooks into aLandi. |
| [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) | MIT-licensed multi-agent interactive classroom; teacher/peer roles, director loop, lesson generation pipeline, durable sessions with resume/steer, replayable events, SKILL.md workbench integration. | Strong reference for a future Teaching Cell and multimodal output. Its Node.js + PostgreSQL + pnpm architecture is not a dependency recommendation for aLandi. |
| [Utopia OS](https://github.com/0xUrsanomics/utopia-os) | Structured persona handoffs, depth limits, memory isolation, tenant spawning, session-bootstrap recovery and active-handoff survival block. | Useful patterns for crash/context-compaction recovery and tenant boundaries. Verify upstream license, threat model and actual implementation before any code reuse. |
| [PinchTab](https://github.com/pinchtab/pinchtab) | MIT-licensed local-first browser control plane; small Go binary, HTTP API, token-efficient DOM extraction, isolated multi-instance browser profiles; loopback default. | Interesting future Browser Worker adapter. Browser profiles contain credentials/cookies: keep them isolated, do not expose the service remotely without auth/TLS/egress policy; not a current runtime dependency. |
| [RunMaestro/Maestro](https://github.com/RunMaestro/Maestro) | Desktop command center for parallel coding-agent sessions, isolated Git worktrees, spec-driven playbooks, group moderation, cross-agent consultation and remote monitoring. | AGPL-3.0; use as UX/workflow inspiration only unless license review explicitly approves reuse. Worktrees and independent session state are useful patterns for a future Build Cell. |
| [josstei/maestro-orchestrate](https://github.com/josstei/maestro-orchestrate) | Cross-harness specialist definitions, Express vs multi-phase workflow, session persistence and separate review/security/accessibility entrypoints. | Smaller community project; license and maintenance evidence were not confirmed in this review. Treat as prompt/workflow inspiration, not a trusted package. |
| [OpenClaw skills and channels](https://docs.openclaw.ai/concepts/features) | Tool/skill/plugin ecosystem, channels, browser automation, cron and heartbeat. | Изучать по capability separation и opt-in. Канальные плагины не должны автоматически давать cross-channel messaging. |

## 5. Стандарты и interoperability

| Стандарт | Назначение | Правильное применение |
|---|---|---|
| [Agent Skills](https://agentskills.io/specification) | Portable skill package format. | Библиотека навыков aLandi и обмен между coding/assistant tools. |
| [MCP](https://modelcontextprotocol.io/specification/2026-07-28) | JSON-RPC protocol для tools/resources/prompts, client features, authorization и notifications. | Tool/resource adapters; каждый MCP server — untrusted integration until reviewed. |
| [A2A](https://a2a-protocol.org/latest/specification/) | Remote agent cards, messages, tasks, artifacts, streaming, push notifications. | Межсистемное делегирование независимому внешнему агенту; не нужен для внутренних вызовов в одном gateway. |
| [OpenWOP v2](https://openwop.dev/spec/v2/) / [upstream](https://github.com/openwop/openwop) | Young wire-level workflow protocol proposal: LLM/tool/human/sub-workflow nodes, AgentRef, typed events, durable suspend/resume, replay and conformance suite. Upstream declares Apache-2.0. | Preserve because it was flagged in earlier aLandi notes. It is very new (upstream repo currently has minimal adoption evidence); treat as experimental protocol candidate, not a standard or runtime dependency. Compare its contracts with internal AgentRun before adoption. |
| [ACP](https://agentclientprotocol.com/protocol/v2/overview) | Agent ↔ client/IDE sessions, permissions, updates, cancel/resume. | Возможный adapter к coding agents/IDE, не общий agent-to-agent protocol. |
| [AG-UI](https://docs.ag-ui.com/spec/1.0) | Typed event stream agent ↔ frontend; lifecycle, tool calls, state, subagent events. | UI activity timeline and streaming; сначала сопоставить с текущим SSE/API contract. |
| [OpenTelemetry GenAI conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) | Semantic spans for agent/workflow/model/tool operations. | Единая трассировка с минимизацией секретов и чувствительных prompt bodies. |

## 6. Durable execution, memory, security and evaluation

| Источник | Сильная сторона | Применимость |
|---|---|---|
| [Temporal Durable AI](https://docs.temporal.io/ai) | Durable workflows, multi-day approval waits, heartbeats, cancellation, saga and idempotent activity design. | Reference для долгих runs. Сначала SQLite event journal; Temporal только если доказана необходимость distributed workers. |
| [Restate actions](https://docs.restate.dev/foundations/actions) | Journaled durable steps, persistent state, signals/awakeables/workflow promises, retries and deduplication. | Сильная альтернатива для durable async agents; отдельный server/runtime cost. |
| [DBOS](https://docs.dbos.dev/architecture) | Durable execution based on application database. | Исследовать как близкий к SQLite/Postgres подход; verify current integration/operational fit. |
| [Hatchet durable tasks](https://docs.hatchet.run/v1/durable-tasks) | Checkpointed task execution, child task spawning, event/sleep waits, replay, retries, concurrency/rate limits and eviction of waiting workers. | Strong durable workflow comparison. Replay requires deterministic code between checkpoints; side effects belong in idempotent child tasks. Adds a service/worker model, so compare against SQLite first. |
| [Graphiti](https://github.com/getzep/graphiti) | Temporal context graph, validity windows, provenance, incremental update, hybrid retrieval. | Идеи для temporal memory; не добавлять Neo4j/graph DB без memory eval. |
| [Letta](https://docs.letta.com/) | Agent-managed memory blocks and persistent agent state. | Reference для editable memory, но enforce scopes/ownership outside LLM. |
| [Mem0](https://docs.mem0.ai/) | LLM-managed fact extraction/update and optional graph memory. | Сравнить с existing scoped SQLite; beware fact overwrite and missing provenance if configured poorly. |
| [OWASP Agentic Top 10 2026](https://genai.owasp.org/download/52117/) | Threat taxonomy: prompt injection, tool misuse, identity/privilege abuse, supply chain, code execution, memory poisoning, inter-agent trust, cascading failures. | Baseline для threat model и red-team suites. Документ dated December 2025 / version 2026. |
| [gVisor security model](https://gvisor.dev/docs/architecture_guide/security/) | User-space application kernel, reduced host syscall surface, OCI runtime. | Sandbox candidate; still requires filesystem/network policy and escape testing. |
| [Firecracker jailer](https://github.com/firecracker-microvm/firecracker/blob/master/docs/jailer.md) | microVM isolation, chroot, namespaces, cgroups, seccomp/resource limits. | Strong isolation candidate; KVM and operational complexity on VPS must be verified. |
| [NVIDIA OpenShell](https://github.com/NVIDIA/OpenShell) and [policy schema](https://docs.nvidia.com/openshell/how-it-works/policies/schema) | Apache-2.0 runtime; isolated sandboxes, kernel-level file/process/network enforcement, credential proxy and policy advisor/prover for reviewing access changes. Upstream reports stable 0.1.x cadence. | Strong sandbox spike candidate. Requires Linux/macOS Apple Silicon/experimental WSL2 plus Docker/Podman/host virtualization; validate exact VPS kernel, CPU-only fit, privilege boundary and operations before adoption. |
| [Inspect AI](https://inspect.aisi.org.uk/) | Tasks/agents/scaffolds/sandboxes evaluation architecture. | Reference for reproducible agent eval, not necessarily dependency. |
| [Promptfoo eval guides](https://www.promptfoo.dev/docs/guides/) | Agent/skill tests, structured outputs, coding agents, sandboxed code eval, judge calibration. | Useful for regression/eval design; keep deterministic golden tests primary. |
| [Berkeley Function-Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) | Tool/function calling benchmark, including BFCL versions. | Compare tool-call correctness; not substitute for aLandi's actual tools/languages. |
| [τ-bench](https://github.com/sierra-research/tau-bench) | Stateful tool-use tasks and policy adherence. | Useful benchmark inspiration for realistic multi-turn tool workflows. |
| [SWE-bench](https://www.swebench.com/) | Real repository issue resolution benchmark. | Coding agent quality reference; target-host and repo-specific eval still needed. |
| [GAIA](https://huggingface.co/gaia-benchmark) | General assistant multi-step tool/research tasks. | Broad capability reference; use with RU/EN/TH custom tasks. |

## 7. Research collections and pattern discovery

- [Awesome Agentic Patterns](https://agentic-patterns.com/) — filter patterns by orchestration, control, memory, learning, reliability, security, tools and collaboration.
- [Awesome Harness Engineering](https://github.com/ai-boost/awesome-harness-engineering) — context, tool design, planning, permissions, evals, sandboxes and observability.
- [Awesome Agents](https://github.com/kyrolabs/awesome-agents) — broad map of frameworks, products, research and tools.

## 8. Синтез: что реально следует взять

| Подсистема aLandi | Лучшие идеи | Не брать |
|---|---|---|
| Agent runtime | LangGraph checkpoint concepts + ADK/MAF workflow patterns + existing ToolDAG | 3 competing runtimes |
| Delegation | OpenAI agent-as-tool + PydanticAI SubAgents + OpenClaw isolated child sessions | free-form shared transcript |
| Teams/professions | existing 64 roles + CrewAI/MetaGPT SOP + AgentScope message contracts | permanent one-model-per-role |
| Workforce control | Paperclip goals/org chart/budgets/approvals/run ledger | duplicate Node/React control plane |
| Skills | Agent Skills format + book-to-skill extraction + anything-to-skill audit/eval/refresh | unreviewed dynamic code |
| Interoperability | MCP for tools, A2A for remote agents, AG-UI for frontend | use one protocol for all layers |
| Durability | SQLite journal first; compare Temporal/Restate/DBOS later | distributed infrastructure before need |
| Memory | existing scoped store + Graphiti temporal/provenance ideas + Letta editable blocks | unscoped shared agent memory |
| Security | OWASP threat model + gVisor/Firecracker/OpenShell candidates + deterministic policy | trusting model output or prompt-only safety |
| Evaluation | Inspect/Promptfoo/BFCL/τ-bench/SWE-bench + custom RU/EN/TH golden set | model-card scores as deployment proof |

## 9. Неопределённости и maintenance caveats

1. Upstream repositories evolve rapidly. Before dependency adoption re-check exact tag/commit, release activity, license file, security advisories, Python support, transitive dependencies and model/runtime compatibility.
2. A2A/MCP/AG-UI/ACP versions evolve; pin protocol versions and test backward compatibility.
3. Vendor-published model benchmarks are not independent evaluations. Re-run on same hardware, prompt set, quantization, context and repetitions.
4. "Open weights" is not synonymous with OSI open-source; review the exact model license and derivative/base-model terms.
5. A container is not a complete sandbox; assess network, filesystem, privilege, secrets, kernel and host boundary.
6. The catalog is a curated shortlist, not exhaustive inventory of every agent project. Discovery directories should be revisited after each architecture milestone, not copied wholesale.

## 10. Source hierarchy

When claims conflict, use this order: normative protocol/specification → official docs for exact version → upstream code/release/security advisories → original paper/benchmark methodology → independent analysis → community list/marketing page. Keep source date and exact commit/tag with any future implementation decision.
