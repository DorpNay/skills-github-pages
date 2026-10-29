# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Verified repository checkpoint — 2026-10-29

- Last main action: feat(landing): reconcile launch page and first-stack runbook.
- **Baseline main SHA:** `375bcc10efe7b3a0e3e999b6504face1974a7cce` (commit date 2026-10-29T15:03:41Z; PR #108 merge).
- **Recent functional milestones:** PR #107 private/shared memory reconciliation merged at `2b2ecec5310aa25c695cfd8cb8198f2bb329cb51`; RAG golden-set evaluator core is present from `ef6e9b490ff964a8f77abdcd40a8448ab1c57d3d`; PR #108 added the standalone landing/runbook and mobile viewport regression coverage.
- **Exact-head checks:** this review did not verify current-main Quality/Gateway/Graphify/Pages/provenance workflow conclusions. PR #108's recorded description still said exact-head checks were pending before merge; do not infer green CI or a successful Pages deployment from the merge alone.
- **Live queue checked via GitHub API:** 1 open PR (#78) and 14 open issues (#88, #89, #90, #91, #92, #96, #97, #98, #99, #100, #101, #102, #103, #104). Recheck live before acting.
- **Priority:** reconcile PR #78's docs against current main; its old checkpoint/CI claims must not be carried forward as current evidence.
- **Runtime boundary:** VPS/gateway, model installation, microphone/device playback and target-host performance remain unverified.


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
