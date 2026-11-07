# aLandi — START HERE

**Live GitHub is mutable truth.** Re-fetch main, PR queue, exact HEAD/checks and deployment before acting.

## Verified baseline
- **Current main SHA:** `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`.
- PR #169 merged by squash; GitHub Pages build/deploy #42408492764 SUCCESS on exact SHA, artifact #13588178210 SHA-256 `cf02ff975f0813ee37cfa0a5aa8de7d562852500a964da85c1a387f5fa539748`.
- Main Freshness #42408493553 PASS; Gateway #42408493562 PASS (Python 3.12/13/14); Graphify #42408493571 PASS; Provenance #42408493536 PASS.
- Main Quality #42408500881 FAIL: 111 passed / 2 failed. The failures are stale E2E expectations around mutually exclusive settings and aServi connection-probe count; public root/landing exact-SHA smoke was skipped.

## Active bounded PR
- **PR #173** · `fix/aservi-connect-probe-e2e-20261108` · base `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2` · code/test HEAD `b614954ada5f86f8221a270ecd3d251283aa0642`.
- Fixes: opening Additional Settings closes Legacy Provider Settings; explicit aServi connection cancels pending scheduled probe; E2E expects one connect probe + one user completion.
- Exact code/test Quality #42408845013 PASS (113/113 Chromium; published baseline smoke PASS, main-release contract skipped on PR), Graphify #42408844985 PASS. Canonical state/task-register sync is included in this PR; exact final-head Freshness/Quality recheck pending.
- **Open PR queue:** #173. Issue #111 remains owner-controlled. PRs #125/#131/#152/#154/#155/#168/#171/#172 are closed non-merged; preserve remaining goals and research in the canonical registry.
- **Not merged / not fully live-verified.** Owner approval is required for PR #173; after merge, run main Quality and Pages public root + `/landing/` exact merge SHA.

## Canonical navigation and next steps
- Handoff: `OLEDUE.md`; English executor contract: `AGENTS.md`; navigation index: `PROJECT_ORCHESTRATOR_RU.md`.
- Systems inventory: `docs/ALANDI_SYSTEMS_MAP_RU.md` (18 systems); detailed code map: `docs/ALANDI_ARCHITECTURE_MAP_RU.md`.
- One task registry: `docs/MASTER_TASK_REGISTRY_RU.md` + existing addendum. Durable step log: `docs/VOLLEY_LOG.md`. State: `docs/PROJECT_STATE.yaml` and `docs/project-state-snapshot.json`.
- Source catalog: `INTEL.md` (310 distinct URLs / 183 GitHub repositories; not all reviewed); continue thematic 8–15-source batches and cross-cutting sweeps.
1. Refresh exact-head Quality/Chromium, Provenance, Graphify, Gateway, Dead Code and Freshness on the final state/log commit; inspect failures, never weaken assertions.
2. If all required checks pass, merge PR #169 with expected SHA; immediately verify main integrity/quality and Pages deployment + cache-busted root/`/landing/` on exact merge SHA.
3. Audit #155/#154/#152/#131/#125 selectively, close each only after value/disposition is recorded; preserve issue #111 owner gates.
4. Continue system-by-system implementation/method review and source research. Native iPhone Safari/VoiceOver, VPS/Tunnel/Ollama and hardware remain unverified.
