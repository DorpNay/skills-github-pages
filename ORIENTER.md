# aLandi — START HERE

**Live GitHub is mutable truth.** This is a compact checkpoint, not a substitute for a fresh read of main, PRs, checks and Pages deployment.

## Current checkpoint — 2026-11-07

- **main:** `c4f23e03f563d03213eb87002863da630fc8b833`.
- **Pages — VERIFIED LIVE:** deployment #42372745873 published that exact main SHA; Quality #42372746360 verified the deployed `alandi-build-revision` equals it.
- **Important boundary:** the live site is still the main version above. The new owner UI corrections in PR #169 are not live until that PR is merged and a new Pages deployment passes the release contract.
- **Active UI task:** existing `UI-PROMO-001`, PR #169, branch `feat/ui-sidebar-81-polish-20261107`, based on current main. It separates aServi from third-party providers/fallback, restructures settings, removes retired Research Studio and the unapproved Functions menu, simplifies sidebar/header controls, neutralizes stop styling and adds an exact-SHA live UI gate. Read the live PR diff and current head/checks before continuing.
- **Do not merge wholesale:** PR #154 is a stale/conflicted V2 shell workbench; use only selectively audited ideas. PR #168 is an older docs checkpoint and must not be treated as current state.
- **Pages warning:** Node 20 / upload-artifact@v4 warning comes from GitHub-managed branch-based Pages publishing. This repo's own artifact action is v7.0.2. The upstream `skills/github-pages` tutorial has no custom deploy workflow to copy. Changing Pages source to GitHub Actions requires a separate Settings change and explicit approval.
- **Remaining goals:** `SRC-001` source evaluation is research-only; `CHAT-001`, `HYGIENE-007` and the rest of the Master Task Registry remain open unless fresh evidence closes them.

## Canonical navigation

1. **Principles and handoff:** `OLEDUE.md`, `AGENTS.md`, `LOOP.md`, `docs/ALANDI_N2O_CORE_RU.md`, `docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md`.
2. **One task inventory:** `docs/MASTER_TASK_REGISTRY_RU.md` + append-only `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md`.
3. **UI acceptance:** `docs/V1_UI_FINALIZATION_RU.md`. Provider/privacy routing: `docs/ALANDI_REQUIREMENTS_REGISTER_RU.md`.
4. **Release and current state:** `docs/LANDING_RELEASE_STRATEGY_RU.md`, `docs/PROJECT_STATE.yaml`, `docs/VOLLEY_LOG.md`.
5. **External-source evidence:** `INTEL.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md`, `docs/TECHNIQUE_REGISTER_RU.md`.

`docs/USER_REQUEST_CHECKLIST.md` is historical provenance. `docs/LANDING_UX_POLISH_BACKLOG_RU.md` is archived; do not use it as a second active backlog. `project-reference/FILE_ORIENTER_RU.md` is a detailed historical path index, not mandatory startup reading.

## Fast route

1. If the owner says `oledue`, read root `OLEDUE.md) first and execute its handoff protocol.
2. Read the current main SHA, open PR base/head/diff and exact-head checks in one batched live-state pass.
3. Route the request to an existing task ID; enrich it rather than creating duplicates.
4. Make one coherent reversible change on the authorized PR branch; preserve unrelated work.
5. Run focused tests, then required exact-head gates. After merge, verify the Pages deployment SHA and the canonical public site content—not just build success.
6. Record material evidence in the existing task/state/log destinations. Report IMPLEMENTED and VERIFIED LIVE separately.
