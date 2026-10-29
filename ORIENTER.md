# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Verified repository checkpoint — 2026-10-29

- **Current main SHA:** `c848212832b44a7f4c8ae08cf090de590a47cc89` — documentation-only reconciliation merge (PR #109); post-merge CI on this exact SHA is not yet independently verified.
- **Latest functional baseline:** `375bcc10efe7b3a0e3e999b6504face1974a7cce` — landing/first-stack runbook and mobile viewport fix. Earlier functional milestones include private/shared memory UI (`2b2ecec5310aa25c695cfd8cb8198f2bb329cb51`) and the offline RAG evaluator core (`ef6e9b490ff964a8f77abdcd40a8448ab1c57d3d`).
- **Merged and verified on exact PR heads:** #84 CORS canonicalization, #81 deployment repository preflight, #83 in-memory SQLite delta persistence, #82 readiness/model policy audit, #106 RAG evaluator core, #107 private/shared memory UI, and #108 launch page/runbook.
- **Latest PR-head CI:** PR #108 Quality Sentinels run [#40896977015](https://github.com/DorpNay/skills-github-pages/actions/runs/40896977015) and Graphify run [#40896977071](https://github.com/DorpNay/skills-github-pages/actions/runs/40896977071) succeeded, including Chromium and published-site smoke. This is not proof of a live VPS deployment.
- **Open PR queue at this checkpoint:** none; PR #109 has merged. Verify the live queue before acting.
- **Open issue queue:** only #111 remains; it tracks owner/live-host release gates. Research-only issues #88–#92 and #96–#104 were closed after their findings and unresolved actions were transferred to #111.
- **Runtime boundary:** GitHub Pages browser smoke is verified; live VPS/gateway, Ollama model performance, voice artifacts/device playback, OAuth credentials and target-host measurements remain unverified.

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
