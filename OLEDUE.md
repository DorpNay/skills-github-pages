# aLandi — OLEDUE

**Trigger:** owner writes `oledue` (alone or with a task).
**Goal:** resume the real active work without asking which branch or PR.

1. Read this file first. Do not automatically reread every orientation document.
2. Build one **Session Sync Capsule** from a single batched live GitHub read: current `main` SHA; open PR and issue IDs; selected active PR base, head branch, exact HEAD, mergeability and changed-file list; workflow/check results for that exact HEAD and, when relevant, current main. Keep PR HEAD, code/test HEAD and tested CI SHA distinct.
3. Route without asking the owner to repeat context:
   - latest explicit owner task takes priority;
   - continue its current owner-authorized branch/PR and canonical task list;
   - if that work is closed/merged, choose its live successor;
   - otherwise default to Landing 2.0 in PR #131;
   - never assume `main` is the implementation branch.
4. Read **one canonical task register** for the selected workstream, then only the source, tests and evidence needed for the next action. Open `ORIENTER.md` only if the route/checkpoint conflicts; open `FILE_ORIENTER_RU.md` for path discovery; open `PROJECT_STATE.yaml` for system-wide flags/status; open `VOLLEY_LOG.md` only when history or a prior decision is needed.
5. Perform the next safe bounded action in the same turn. Update the existing task register first; update state/log/orientation only when a material checkpoint or reusable fact changes.
6. Report branch, PR, HEAD, changes, exact checks, open limits and one next action. Do not ask the owner to repeat context.

## Fast task selector

- **Latest explicit owner task:** continue that workstream and its canonical task list; it takes precedence over defaults.
- **Landing UI 2.0:** PR #131; scope/checklist in `docs/V1_UI_FINALIZATION_RU.md` §8.0; implementation evidence in `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md`.
- **Whole-project state and release gates:** `docs/PROJECT_STATE.yaml` and owner-controlled issue #111; do not infer production readiness from UI or CI.
- **Open-source/model research:** `INTEL.md` → `docs/OPEN_SOURCE_TRIAGE_RU.md` → `docs/TECHNIQUE_REGISTER_RU.md`; verify exact source, version, license and target-hardware fit before adoption.
- **VPS/runtime operations:** `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md` plus the owner-approved runbook; deployment remains a separate explicit action.

**Owner approval required:** merge, deployment, rebase/main synchronization, force-push, destructive changes, secrets/permissions or consequential external actions. A green CI is not merge authorization.

**Canonical records:** `docs/V1_UI_FINALIZATION_RU.md` (Landing scope); `docs/MASTER_TASK_REGISTRY_RU.md` (whole-project inventory, where present); `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md` (implementation evidence); `docs/VOLLEY_LOG.md` (continuation checkpoint). Do not create duplicate backlogs.
