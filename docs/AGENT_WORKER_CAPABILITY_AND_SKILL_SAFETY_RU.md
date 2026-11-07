# aLandi — capability contract для workers и безопасность Skills

**Дата обновления:** 2026-11-08  
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
