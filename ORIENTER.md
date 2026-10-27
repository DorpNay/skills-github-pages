# aLandi — START HERE

This is the short entry point for an assistant or engineer. The detailed, maintained navigation index remains `project-reference/FILE_ORIENTER_RU.md`; do not duplicate its full state here.

## First-read order

1. **`project-reference/FILE_ORIENTER_RU.md`** — current checkpoint, repository map, last verified stage, blockers and next action.
2. **`docs/PROJECT_STATE.yaml`** — feature/runtime status, flags, verification evidence and unresolved risks.
3. **`docs/VOLLEY_LOG.md`** — chronological stage log; check the newest entry first.
4. Verify live GitHub `main`, open PRs, Issues and exact-head checks. Stored SHAs and queue counts are historical checkpoints, never live truth.
5. Read only the source, tests, architecture and operational docs relevant to the current task. Use `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for module boundaries; use the implementation guide before any VPS operation.

## After every meaningful stage

Update the detailed orienter, `docs/PROJECT_STATE.yaml`, and `docs/VOLLEY_LOG.md` with:
- exact files/decisions and current SHA/PR;
- tests actually run and their results;
- blockers, risks and rollback;
- the next concrete action, so work can resume after interruption.

Do not claim that a merged or green CI change is deployed on a live host. Do not add experimental graph/model tools to runtime without measured benefit. Preserve user data and existing behavior; no destructive operation or queue-clearing action without a verified reason.
