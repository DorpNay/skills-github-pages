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

- AgentRun disabled by default (`ALANDI_AGENT_RUNS_ENABLED=false`); one worker and one model slot.
- Safe strategies: `single`, `team_review` and `coder_review`. Team Review uses independent researcher/reviewer DAG roots followed by coordinator synthesis. Coder Review is a sequential Coder-draft → Reviewer-check → Coordinator chain.
- SQLite persists task records and same-run dependencies. Task inputs/outputs use Fernet payloads keyed by task ID.
- Team Review and Coder Review model calls are sequential through one worker/model slot; logical roles are not independent OS processes. Contexts are task-scoped; same-model review is not independent evidence.
- Agents UI uses authenticated capability/profile/run/status/events/cancel APIs; safe allowlist, per-chat persistence, General pin, explicit `strategy_id`, actual task states/dependencies. No implicit chat history/files/credentials.
- Profiles are logical prompts, not processes. Tools/shell/filesystem/network disabled. Current Coder Review drafts only from user-supplied text; it does not read a repository, edit files, run commands or tests. A true local Coder workspace/sandbox is not implemented.
- Qwen3.5-2B and Bonsai staged, not target-installed; PTQ1_0 requires PrismML llama.cpp, not Ollama.
- Exa/Firecrawl/TinyFish are assistant-side tools, not aLandi product dependencies.

## 7. Multi-agent implementation sequence and acceptance

1. Model catalog — IMPLEMENTED; allowlist intersects live Ollama catalog, fail closed.
2. Task-scoped payloads — IMPLEMENTED; Fernet references keyed by task ID.
3. Dependency DAG — IMPLEMENTED; same-run typed edges, cycle/self/cross-run rejection, idempotency and ready-task scheduling.
4. Worker lifecycle — IMPLEMENTED PROTOTYPE; one worker/model slot, sequential inference.
5. Coordinator/specialists — IMPLEMENTED PROTOTYPE; `team_review` has independent researcher/reviewer task contexts and coordinator fan-in; `coder_review` has a durable Coder → Reviewer → Coordinator dependency chain. All inference serial; same model is not independent evidence.
6. Agents UI — IMPLEMENTED / VERIFIED; safe `single`/`team_review`/`coder_review` allowlist, per-chat persistence, General pin, explicit strategy_id, task-state/dependency rendering and clear no-execution Coder copy. Quality #43827521092 passed 135 built-app Chromium + 1 live-site test; Graphify #43827521090 and Pages #43827520134 passed; public contract exact.
7. Reliability/evaluation — OPEN; expand failure-injection across sequential DAG restarts, lease expiry, cancellation races, output expiry, RU/EN/TH golden tasks and target-host resource benchmarks. Human approval/resume is deferred until a real side-effecting tool exists.
8. Coder workspace — DEFERRED; current Coder Review is text-only. Selected-file read, structured patch, user review and a real sandbox are prerequisites before command execution.
9. Browser/tool workers — DEFERRED; isolated runtime, SSRF/DNS protections, approvals and resource budgets.
10. Offline/local-server route switching — SPECIFIED only; no local runtime package or cross-route state handoff is implemented.

Acceptance: deterministic, race, scope/security, timeout/cancel/restart tests; RU/EN/TH evals; resource budgets; exact-head CI; feature-off default and rollback.



### Additional small-model candidate — 2026-11-16

The pinned 430 MB PTQ1_0 file for the same 1.88B ternary model is being staged through a checksum-verifying Actions workflow. It requires a PrismML llama.cpp fork; it is not an Ollama model and is not available to AgentRun yet. A generic aLandi-owned OpenAI-compatible local runtime adapter, exclusive model-slot policy, and RU/EN/TH/resource eval are prerequisites. No host install or live inference is claimed.
