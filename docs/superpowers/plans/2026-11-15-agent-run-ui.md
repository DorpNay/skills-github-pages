# AgentRun Browser UI Integration Plan

> Status 2026-11-16: IMPLEMENTED / VERIFIED PROTOTYPE on main 377818c. Host feature remains disabled by default.

Browser client calls Gateway capabilities, profile/strategy catalogue, create-run, status/events and cancel APIs. It offers only `single`/`team_review`; persists per-chat choice; submits explicit prompt, opaque scope and `strategy_id`; pins Team Review to General; renders server task states/dependency labels. No implicit chat history, files, tools or credentials.

## Constraints
- Do not enable `ALANDI_AGENT_RUNS_ENABLED` or change host secrets/services/VPS.
- One worker/model slot; calls sequential; roles are not OS processes.
- Tools/filesystem/shell/network disabled; no parallel swarm claim.
- Only allowlisted installed models; staged artifacts unavailable until installed.
- Untrusted event text rendered with `textContent`.

## Delivered
- [x] Capability/feature-flag gating; fail closed on invalid data.
- [x] Safe strategy allowlist; per-chat persistence; General coordinator pin.
- [x] Explicit prompt/scope/`strategy_id`/idempotency key.
- [x] Bounded status/events polling; output/state rendering; authenticated cancel.
- [x] Real task roles, states and dependency labels from run snapshots.
- [x] Chromium E2E for safe filtering, per-chat choice, General profile and three-task Team Review.

## Exact-head verification
- [x] Quality #43804109317: 7/7 jobs, 134 Chromium tests and published contract.
- [x] Graphify #43804109318; Pages #43804108675.
- [x] Uncached public root revision exactly 377818c.
- [x] Gateway #43797179042 on unchanged backend parent 680ab022, Python 3.12/13/14.
- [ ] Freshness/Provenance on documentation refresh.
- [ ] Target-host Ollama, hardware, real inference, backup/restore and production enablement.

## Remaining gates
- [ ] Crash/restart, lease-expiry, cancellation-race and failure-injection.
- [ ] RU/EN/TH golden-task evaluation and host RAM/latency.
- [ ] Bounded Coder workspace and separately tested sandbox before shell.
- [ ] Concurrency above 1 only after host/resource evidence.

**Rollback:** keep AgentRun disabled (`ALANDI_AGENT_RUNS_ENABLED=false`).

