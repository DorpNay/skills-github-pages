# aLandi — START HERE

**Live GitHub is mutable truth.** This is the durable handoff checkpoint; always re-fetch main, PR heads, checks and deployment before acting.

## Current checkpoint — 2026-11-08 (live main)

- **Current main SHA:** `c4f23e03f563d03213eb87002863da630fc8b833`.
- **Pages VERIFIED LIVE on that exact main SHA:** GitHub-managed deployment #42372745873 SUCCESS; exact-main Quality #42372746360 SUCCESS; Graphify #42372746441 PASS. Canonical root and `/landing/` were checked against the build revision. This says nothing about VPS/Tunnel/Ollama.
- **Active integration slice — PR #169:** branch `feat/ui-sidebar-81-polish-20261107`; base `c4f23e03f563d03213eb87002863da630fc8b833`; current head must be resolved live from GitHub. Last recorded implementation/orientation checkpoint before this handoff refresh: `2069fb6ac60ac251f3550a5ca533eae2c6fe6b9a`; 50 changed files, open and mergeable. Implements explicit aServi connect action, provider-mode isolation, sidebar/retired UI cleanup, server-memory graph removal, updated E2E, English `AGENTS.md`, systems map, architecture map, orchestrator and source/technique updates. **Not merged or published.**
- **Checks on exact head `2069fb6`:** Gateway #42397143658 pending; Graphify #42397143674 pending; Dead Code #42397143660 in progress; Provenance #42397143679 in progress; Quality #42397143681 pending; Freshness #42397143662 queued. Earlier Quality #42396442500 passed all jobs including Chromium on intermediate head `5d31f2d4e70df7a4ee5b54d058ff6fa27cba00e5`; that result does not transfer to newer heads.
- **Open PR queue:** #125, #131, #152, #154, #155, #168, #171. **Open issue:** #111.
- **PR disposition audit:** #125 explicitly FUTURE / DO NOT MERGE and targets a parking branch; #131 is a 1,129-commit V2 workbench, stale and not for wholesale merge; #152 is a draft voice queue/selected-text feature based on old main; #154 is a stale, divergent V2 shell and previously failed Chromium; #155 is a draft roadmap plus third-party source archives, stale base; #168 and #171 overlap PR #169 by filename but their file contents differ, so unique changes still require file-by-file reconciliation. Do not merge any independently until the audit is complete.
- **Systems and research:** `docs/ALANDI_SYSTEMS_MAP_RU.md` is the compact system catalog; `docs/ALANDI_ARCHITECTURE_MAP_RU.md` is the detailed code map; `AGENTS.md` is the concise English operating contract. `INTEL.md` contains 311 distinct URL references and 183 distinct GitHub repositories. New research is triage/candidate evidence only; no model weights or third-party runtime was downloaded or installed.
- **Owner execution policy:** `main` is the only durable product baseline. PRs are temporary exact-head verification/integration vehicles; merge promptly only after all required checks pass. Port compatible work selectively; never merge stale/future/failed V2 branches wholesale. Record each material stage in `docs/VOLLEY_LOG.md`.

## Next safe actions

1. Re-check the live PR #169 HEAD and all six exact-head gates. Inspect Chromium failure artifacts if Quality fails; do not weaken assertions.
2. If and only if all required gates pass, update PR #169 description to its exact live HEAD and merge with the expected SHA.
3. Verify post-merge main SHA, GitHub Pages deployment, canonical root and `/landing/` against that exact merge SHA.
4. Refresh `ORIENTER.md`, `docs/PROJECT_STATE.yaml`, `docs/project-state-snapshot.json` and `docs/VOLLEY_LOG.md` on the new main checkpoint.
5. Reconcile #168/#171 file-by-file, then audit #152/#154/#155/#131/#125; port only approved useful deltas and close superseded PRs with recorded reasons. Keep #111 owner-controlled.
6. Continue one subsystem audit at a time and 8–15-source thematic research batches; occasionally run cross-cutting sweeps.

## Fast route

- On `oledue`, read root `OLEDUE.md` first and follow its handoff protocol.
- Read `AGENTS.md` and this checkpoint; use `PROJECT_ORCHESTRATOR_RU.md` as the single navigation index.
- Find/enrich one existing task ID in `docs/MASTER_TASK_REGISTRY_RU.md` + its addendum.
- Read `docs/ALANDI_SYSTEMS_MAP_RU.md`, then only the relevant code, tests, decisions and sources.
- Keep main/base/head/tested/merge/deployed SHAs distinct. Exact checks apply only to the exact tested SHA.
- Open limits: VPS, Tunnel, Ollama, credentials, target-host model performance, native iPhone Safari and VoiceOver remain unverified.
