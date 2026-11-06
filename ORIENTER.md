# aLandi — START HERE

This is the short repository entry point. **Live GitHub state is authoritative**; every SHA, PR number and queue below is a dated checkpoint, not a substitute for a fresh read.

## Current checkpoint — 2026-11-06

- **Current main SHA:** `f323b6f339d454dad6e820a4074fa230acc7b6df` — PR #153 orientation/handoff repair is merged.
- **Post-merge main checks:** Quality #42150785825 PASS; GitHub Pages deployment #42150784695 PASS; Project State Freshness #42150785781 PASS; License/Provenance #42150785779 PASS — all on exact main SHA `f323b6f339d454dad6e820a4074fa230acc7b6df`.
- **Automatic publication:** repository `DorpNay/skills-github-pages` publishes to https://dorpnay.github.io/skills-github-pages/ through GitHub Pages after pushes to main. Gateway/VPS deployment is separate.
- **Open PR queue:** #125, #131, #152. **Open issue:** #111. Active owner-authorized promotion PR: #154 (excluded from the queue snapshot while its own Freshness check runs).
- **PR #154:** bounded promotion of the modular aLandi V2 root app shell from PR #131; base is the verified main above. Resolve its mutable HEAD and exact-head checks live. It does not merge PR #131 wholesale.
- **PR #131:** Draft V2 workbench, head `55d2ea792d11587a508d77aa9274f24105dafa79`, base `e78a73b25725bfa63370d9946887cbbacbf51b82`; 1,129 ahead / 20 behind, 76 files, mergeable=false. Selective reconciliation only.
- **PR #152:** Draft voice workstream, head `99a0b530b335e7e19833c4ce66138dcc576a09fa`, base `8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`; 17 ahead / 2 behind, 4 files, dirty. Previous exact-head Quality failed (#42141899337); Graphify passed (#42141899316). Recheck before acting.
- **PR #125:** future-workstream parking; not active unless owner asks.
- **Preserved main protections:** PR #147 cancellation-safe Gateway semaphore; PR #148 untrusted assistant-rendering/Pyodide security boundary; PR #150 browser-storage recovery and atomic rollback.
- **Orientation:** PR #153 merged. ORIENT-001 is complete. ORIENT-002 was exercised in this fresh session: OLEDUE first, then one batched live-state read; the explicit owner request selected PR #154 rather than defaulting to #131.

## Active owner direction

1. Finish exact-head Quality (all four Chromium shards), Jekyll, Integrity, Security, Context, static analysis, Graphify and Dead Code gates for PR #154.
2. If all gates pass, merge only PR #154; then verify the resulting main SHA, automatic Pages deployment, published root app/assets and post-merge Quality/Freshness/Provenance.
3. Keep PR #131 as the V2 workbench; continue selective source audit and promote only separately verified slices. Do not merge or synchronize it wholesale.
4. Inspect Voice PR #152 separately after repairing its stale base and failed Quality.
5. Continue capability delivery and subsystem audit from the canonical task register; keep issue #111 open for owner-controlled VPS/device/runtime gates.

## Fast route

1. On `oledue`: read root OLEDUE.md first, then one batched live GitHub state read.
2. Match the latest explicit owner request to one canonical task register; never infer the active PR from age, size or historical role.
3. Read only task-specific source/tests. Detailed navigation: project-reference/FILE_ORIENTER_RU.md; system state: docs/PROJECT_STATE.yaml; history: docs/VOLLEY_LOG.md.
4. Keep main SHA, PR base/head, code/test HEAD, tested CI SHA and merge SHA distinct.
5. Record material changes in the existing task register/state/log. No duplicate backlog or routine full-stack reread.

## Keeping orientation reliable

- OLEDUE.md is the handoff contract; this file is the short navigation/checkpoint.
- Project State Freshness checks the snapshot, exact live PR/issue IDs and orientation consistency. CI reports drift; it does not rewrite state.
- Checkpoint changes update ORIENTER.md, project-reference/FILE_ORIENTER_RU.md, docs/PROJECT_STATE.yaml, docs/VOLLEY_LOG.md and docs/project-state-snapshot.json together.
- Handoff-contract changes also update OLEDUE.md and AGENTS.md; freshness CI enforces this.
- A merge or PR-head smoke does not prove live VPS, native device or target-hardware behavior.
