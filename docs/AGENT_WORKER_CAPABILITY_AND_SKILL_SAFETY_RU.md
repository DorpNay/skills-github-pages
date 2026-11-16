# aLandi — capability contract для workers и безопасность Skills

**Дата обновления:** 2026-11-16  
**Статус:** SPECIFIED / research-only; contract preserved from PR #128/#131. This document does not claim independent worker runtime is implemented.

## 1. Worker capability model

Каждый worker получает минимальный typed task packet:
- run/task/parent IDs и idempotency key;
- objective, bounded input references и expected output schema;
- model policy, deadline, token/tool/output budgets;
- explicit read/write/network/memory/execute scopes;
- approval requirements, cancellation signal и evaluation contract.

Никакой worker не наследует всю историю чата, все файлы проекта или полномочия supervisor по умолчанию.

Capability intersection:
`effective = task_request ∩ agent_profile ∩ user_grant ∩ environment_policy`

Пустое пересечение означает отказ, а не попытку fallback.

## 2. Skill execution boundary

Skill — инструкция/ресурсы, не credential и не policy grant. Imported skill:
- сохраняется как inert package;
- проходит provenance, license, prompt-injection, secret, path traversal и executable-content review;
- не исполняет scripts при import/preview;
- получает отдельное разрешение на каждый tool capability;
- pin-ится по version/hash;
- проходит regression eval после изменения.

## 3. Skill-to-worker binding

Agent blueprint может ссылаться на Skill IDs, но runtime выдаёт worker только:
- конкретную версию skill;
- минимальные source excerpts;
- разрешённые tool descriptions;
- ограниченный task contract.

Skill instructions не могут расширить allowlist, отключить approval, изменить output budget или запросить скрытые credentials.

## 4. Observable UI states

| Состояние | UI |
|---|---|
| Blueprint only | можно редактировать/сохранить; запуск отсутствует |
| Queued | run ID, очередь и отмена |
| Running | bounded progress/events, без chain-of-thought |
| Waiting approval | действие, причина, scope, последствия, approve/deny |
| Verifying | независимый validator и evidence |
| Succeeded/failed/cancelled/timed out | итог, артефакты, причины, retry policy |

Нельзя визуально показывать 64 roles как 64 активных процесса. Отдельно отображаются logical profiles, scheduled workers, inference slots и фактическая concurrency.

## 5. Дополнительные задачи

- [ ] AW-SK-001 — threat model для skill package import.
- [ ] AW-SK-002 — scanner fixtures: prompt injection, credential exfiltration, path traversal, shell payload, symlink escape.
- [ ] AW-SK-003 — prove capability intersection at every tool call.
- [ ] AW-SK-004 — pinned skill version/hash in durable AgentRun record.
- [ ] AW-SK-005 — evals for malicious/ambiguous skill instructions.
- [ ] AW-UI-001 — worker state and capability explanation in Agent Functions menu.
- [ ] AW-UI-002 — show actual worker concurrency separately from model inference slots.
- [ ] AW-REC-001 — retry/resume must use idempotency and verified checkpoints.

## References

- [Agent Skills specification](https://agentskills.io/specification)
- [MCP specification](https://modelcontextprotocol.io/specification)
- [A2A specification](https://a2a-protocol.org/latest/specification/)
- [OpenHands sandbox model](https://github.com/All-Hands-AI/OpenHands)

**Status:** research/specification only. No worker runtime or tool permissions were changed.


## 6. Current runtime reality — verified 2026-11-16

- AgentRun is disabled by default (ALANDI_AGENT_RUNS_ENABLED=false). When enabled, the current Gateway starts one background worker with concurrency 1.
- The worker claims and completes one model-completion task per run. The task store has durable run/task records, leases and fencing, but the current worker does not execute a dependency DAG or independent specialist processes.
- The encrypted payload vault is keyed by run ID and payload kind, not by task ID. It is not yet safe for concurrent task-specific input/output payloads.
- Profiles (general, researcher, coder, reviewer) are logical prompt/capability profiles, not four processes. All currently have independent_process=false, tools=false, filesystem=false and network=false. Coder is a constrained code-review/patch-planning profile, not a shell or filesystem executor.
- Model selection is restricted by ALANDI_ALLOWED_MODELS. The Qwen3.5-2B Q4_K_M artifact is already staged and SHA-verified in GitHub Actions (artifact 14032317541, 1,945,791,476 bytes, expires 2026-12-13); it is not installed on the target host. The default allowlist now includes qwen3.5:2b-q4_K_M, but the API exposes it only when Ollama /api/tags confirms it is installed. Main 4B remains first/default.
- Exa and Firecrawl are assistant-side research tools; they are not product runtime dependencies. No model, sandbox, browser runtime or agent platform was installed in this pass.

## 7. Multi-agent implementation sequence and acceptance

1. **Installed model catalog (bounded slice):** intersect configured allowlist with live Ollama /api/tags for both /v1/models and /v1/agent-runs/profiles. Fail closed if the catalog is unavailable. Test that a staged-but-uninstalled 2B model is not selectable.
2. **Task-scoped payloads:** add encrypted input/output references keyed by task ID; verify cross-task and cross-run isolation, size limits and retention before allowing multiple tasks per run.
3. **Dependency DAG:** typed depends_on edges, cycle rejection, atomic ready-task claim, terminal dependency handling, idempotency and bounded retries. Coordinator synthesis becomes runnable only after required specialists complete.
4. **Worker lifecycle:** distinct worker IDs, leases/fencing, heartbeat, cancellation, crash recovery and durable events. Begin with sequential specialists and one shared inference slot; do not claim parallel inference. Add a bounded worker pool only after memory/latency measurements.
5. **Coordinator and specialists:** coordinator owns objective and final result; each specialist receives a minimal typed task packet and isolated context. Support specialist-as-tool and explicit handoff as separate strategies. Independent verification must use deterministic checks or a genuinely independent verifier.
6. **Coder workspace:** no shell or broad filesystem access. First implement read-only selected-file context and structured patch output; preview the exact patch hash, validate paths and apply only after owner approval. Command execution requires a separately installed and tested sandbox with a command allowlist and rollback.
7. **Browser worker:** optional isolated runtime with strict URL/SSRF policy, DNS/IP revalidation, no ambient credentials and per-run resource limits. Do not expose a browser worker as available until live negative security tests pass.

Acceptance gates: deterministic unit/contract tests; concurrency and race tests; cross-scope/secret-exfiltration/path-traversal tests; timeout/cancellation/restart/lease-expiry tests; RU/EN/TH golden tasks; resource budgets; exact-head CI; feature flags off by default; tested rollback. The current safe rollback is to keep AgentRun disabled and omit unverified models from the live catalog.
