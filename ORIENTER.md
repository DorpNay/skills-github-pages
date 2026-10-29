# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Verified repository checkpoint — 2026-10-29

- **Last main action:** docs: preserve engineering and runtime readiness audits.
- **Baseline main SHA:** `337e38690af8f22a712c6442192c5ea62d354c3d` (commit dated 2026-10-28; documentation-only follow-up).
- **Last functional-code checkpoint:** `91557e4eab1b122341bed578cdf4775ff867007f` — parent of the latest documentation-only main commit. PR #77 RRF fusion, PR #76 Graphify workflow, and PR #72 search/functions UX are already on main.
- **Checks:** main SHA 337e386 passed Quality Sentinels run [#40639031308](https://github.com/DorpNay/skills-github-pages/actions/runs/40639031308) and Pages deployment [#40639030224](https://github.com/DorpNay/skills-github-pages/actions/runs/40639030224). The code parent passed Gateway [#40637941350](https://github.com/DorpNay/skills-github-pages/actions/runs/40637941350), Quality [#40637941308](https://github.com/DorpNay/skills-github-pages/actions/runs/40637941308), Graphify [#40637941303](https://github.com/DorpNay/skills-github-pages/actions/runs/40637941303), and Pages [#40637941951](https://github.com/DorpNay/skills-github-pages/actions/runs/40637941951).
- **Live queue at this checkpoint:** 9 open PRs (#78, #80, #81, #82, #83, #84, #85, #86, #87) and 14 open issues (#88–#92 and #96–#104). Exact IDs are recorded in `docs/project-state-snapshot.json`; verify them live before acting.
- **Important open work:** PR #78 is still open and its base SHA is the older functional checkpoint `91557e4eab1b122341bed578cdf4775ff867007f`; its docs are not yet integrated into current main.
- **Runtime boundary:** GitHub Pages and listed CI gates are verified; live VPS/gateway, installed model/voice artifacts, microphone/device playback, and target-host performance remain unverified.

## First-read order

1. **`project-reference/FILE_ORIENTER_RU.md`** — current checkpoint, repository map, last verified stage, blockers and next action.
2. **`docs/PROJECT_STATE.yaml`** — feature/runtime status, flags, verification evidence and unresolved risks.
3. **`docs/VOLLEY_LOG.md`** — chronological stage log; read the newest entry first.
4. **Live GitHub main, PRs, Issues and exact-head checks** — stored SHAs and queue counts are snapshots, never live truth.
5. Read only source, tests, architecture and operational docs relevant to the task. Use `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for module boundaries and the implementation guide before VPS operations.

## Keeping orientation current

- The `Project State Freshness` workflow checks this baseline and exact open PR/issue IDs on PR updates and daily.
- The current PR is excluded from its own open-PR comparison; no other queue difference is ignored.
- If the main SHA or queue changes, reconcile the snapshot, this file, the detailed orienter, `docs/PROJECT_STATE.yaml`, and `docs/VOLLEY_LOG.md` together. CI reports drift; it does not silently rewrite or commit state.
- After every meaningful stage, record exact files/decisions, SHA/PR, tests actually run, risks, rollback, and next action. Never claim a green CI change is deployed on a live host.
