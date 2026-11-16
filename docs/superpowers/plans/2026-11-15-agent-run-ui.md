# AgentRun Browser UI Integration Plan

> **Status 2026-11-16:** IMPLEMENTED / VERIFIED PROTOTYPE on main `0d34aa1c70bb68e57a3856ba20d8b5f966c65038`. Host feature remains disabled by default.

Browser client calls Gateway capabilities, profile/strategy catalogue, create-run, status/events and cancel APIs. It offers safe `single`, `team_review` and `coder_review`; persists per-chat choice; submits explicit prompt, opaque scope and `strategy_id`; pins fixed teams to General; renders server task states/dependency labels. No implicit chat history, files, tools or credentials.

## Constraints
- Do not enable `ALANDI_AGENT_RUNS_ENABLED` or change host secrets/services/VPS.
- One worker/model slot; calls sequential; roles are not OS processes.
- Tools/filesystem/shell/network disabled; no parallel swarm claim.
- Coder Review is a text-only Coder draft → Reviewer check → Coordinator synthesis chain. It does not read/write files or execute commands/tests.
- Only allowlisted installed models; staged artifacts unavailable until installed.
- Untrusted event text rendered with `textContent`.

## Delivered
- [x] Capability/feature-flag gating; fail closed on invalid data.
- [x] Safe strategy allowlist; per-chat persistence; General coordinator pin.
- [x] Explicit prompt/scope/`strategy_id`/idempotency key.
- [x] Bounded status/events polling; output/state rendering; authenticated cancel.
- [x] Real task roles, states and dependency labels from run snapshots.
- [x] Team Review fan-out/fan-in: researcher and reviewer independent, then coordinator.
- [x] Coder Review sequential dependency chain: Coder draft → Reviewer reads draft → Coordinator synthesizes.
- [x] Context budgets reserve space for truncation markers and section labels.
- [x] Chromium E2E for safe filtering, per-chat choice, General profile and Coder Review strategy selection.

## Exact-head verification
- [x] Gateway #43826933347: 279 tests passed on backend commit `40d343a114cdefbdf8bc2574754fd55d7e0f700d`; current head only adds the E2E assertion after that backend commit.
- [x] Quality #43827521092: 7/7 jobs, 135 built-app Chromium tests + 1 live-site test, published contract exact `0d34aa1c70bb68e57a3856ba20d8b5f966c65038`.
- [x] Graphify #43827521090: 2,519 nodes / 5,868 edges / 90 source files; includes inline client, AgentRun store and worker. 700-token query truncation noted.
- [x] Pages #43827520134: successful; public root serves exact main SHA `0d34aa1c70bb68e57a3856ba20d8b5f966c65038`.
- [ ] Freshness/Provenance on this documentation refresh.
- [ ] Target-host Ollama, hardware, real inference, backup/restore and production enablement.

## Remaining gates
- [ ] Crash/restart, lease-expiry, cancellation-race and failure-injection across the new sequential DAG.
- [ ] RU/EN/TH golden-task evaluation and host RAM/latency.
- [ ] Bounded Coder workspace and separately tested sandbox before shell.
- [ ] Human approval/resume before any side-effecting tool is exposed.
- [ ] Concurrency above 1 only after host/resource evidence.

**Rollback:** keep AgentRun disabled (`ALANDI_AGENT_RUNS_ENABLED=false`).
