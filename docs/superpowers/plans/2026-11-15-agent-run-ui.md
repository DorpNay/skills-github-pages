# AgentRun Browser UI Integration Plan

> For implementers: use superpowers:executing-plans task-by-task. Checkboxes track work.

**Goal:** Make the Agents panel a real, capability-gated client for the existing authenticated single-worker AgentRun API without presenting blueprint settings as independent agents.

**Architecture:** The static browser client calls the existing Gateway capability, profiles, create-run, status/events and cancel endpoints using the already configured aLandi Gateway URL and bearer key. It sends only the explicit task prompt plus opaque chat/project scope; it does not silently attach chat history, files, tools or credentials. The UI shows the one-worker/no-tools/no-filesystem/no-network boundary and remains disabled when the host feature flag is off.

**Tech Stack:** Existing HTML/CSS/vanilla JavaScript client, FastAPI Gateway, existing SQLite/encrypted AgentRun worker, Playwright Chromium E2E.

**Spec:** docs/AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md; owner acceptance docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md §K.6.3.

## Global Constraints

- Do not enable ALANDI_AGENT_RUNS_ENABLED or change host secrets, encryption keys, services or VPS configuration.
- Worker concurrency is exactly 1; profiles are general, coder, reviewer and researcher.
- Tools, filesystem, shell and network remain disabled; no independent subagents or swarm claim.
- Use configured allowlisted local models and bounded prompts only.
- Never send full chat transcript or project files implicitly.
- Never expose chain-of-thought, raw credentials, arbitrary event HTML or secret-bearing errors.
- Add no dependencies and do not select/download the owner-supplied primary model.

## Review Focus

- Gateway unconfigured or feature flag disabled: clear disabled state, no runnable control.
- Missing/invalid profile or model catalog: fail closed, do not fabricate choices.
- Network timeout, HTTP 401/403/429/503 and malformed JSON: preserve input and show bounded actionable error.
- Cancellation: call authenticated DELETE and report server-confirmed state.
- Current chat/project scope: send opaque scope metadata only; never serialize conversation history.
- Event text: render as textContent, never HTML.

---

### Task 1: Capability-gated Agents panel

Files: index.md; tests/e2e/app.spec.mjs.

- [ ] Add a disabled-state Chromium test with mocked /capabilities and agent_runs.enabled=false.
- [ ] Verify RED: #agentRuntimeStatus is absent on the unchanged UI.
- [ ] Add profile/model/prompt controls and explicit one-worker capability disclosure.
- [ ] Fetch capabilities and profiles only when Agents opens; fail closed when disabled or malformed.
- [ ] Verify GREEN: disabled state has no enabled Start button and existing blueprint settings remain chat-scoped.

### Task 2: Run, observe and cancel

Files: index.md; tests/e2e/app.spec.mjs.

- [ ] Add E2E coverage for POST payload, scope, selected profile/model, event polling, final output and cancellation.
- [x] Implement POST with unique Idempotency-Key and explicit prompt only.
- [x] Poll status/events with bounded timeouts; render real transitions and output with textContent.
- [x] Implement DELETE cancellation and retain server-confirmed status.
- [ ] Verify enabled flow and failure cases with mocked Gateway responses.

### Task 3: Record maturity and exact-head verification

Files: docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md; docs/AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md; NOW.md; docs/PROJECT_STATE.yaml; docs/project-state-snapshot.json; docs/VOLLEY_LOG.md.

- [ ] Update K.5 only after UI acceptance tests pass; independent multi-agent, tools and sandbox remain deferred.
- [ ] Run exact-main Quality/Chromium, Freshness, Provenance, Graphify and Pages.
- [ ] Verify public root metadata matches exact main SHA.
- [ ] Record host/runtime limits and owner-only prerequisites; do not claim VPS activation.
