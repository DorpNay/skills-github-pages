# aLandi — OLEDUE

**Trigger:** owner writes `oledue` (alone or with a task).
**Goal:** resume the real active work without asking which branch or PR.

1. Read this file, then root `ORIENTER.md`, `project-reference/FILE_ORIENTER_RU.md`, `docs/PROJECT_STATE.yaml`, and the newest `docs/VOLLEY_LOG.md` entry.
2. Check live GitHub: main SHA, open owner-authorized PRs, active task/PR, branch HEAD/base, latest diff and exact-HEAD checks. Repository notes are snapshots, not live truth.
3. Route automatically:
   - Follow the latest explicit owner task/workstream when one exists.
   - Otherwise continue the active Landing UI 2.0 work in PR #131.
   - If the active PR changed or is closed/merged, choose the current owner-authorized successor from live GitHub and its canonical task list.
   - Never assume main is the implementation branch merely because this file is read from main.
4. Recover the latest verified checkpoint and next action from the canonical checklist, implementation ledger and VOLLEY_LOG. Distinguish implemented, verified and unrun work.
5. Do the next safe, bounded action in the same turn. Update the existing canonical task list first when a new task or result appears; then update evidence/log/orientation as materially needed.
6. Report branch, PR, HEAD, what changed, exact checks, open limits and one next action. Do not ask the owner to repeat context.

**Owner approval required:** merge, deployment, rebase/main synchronization, force-push, destructive changes, secrets/permissions or consequential external actions. A green CI is not merge authorization.

**Canonical records:** `docs/V1_UI_FINALIZATION_RU.md` (Landing scope); `docs/MASTER_TASK_REGISTRY_RU.md` (whole-project inventory, where present); `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md` (implementation evidence); `docs/VOLLEY_LOG.md` (continuation checkpoint). Do not create duplicate backlogs.
