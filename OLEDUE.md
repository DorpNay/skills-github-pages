# aLandi — OLEDUE

**Trigger:** owner writes `oledue` (alone or with a task).
**Purpose:** recover the real task and exact repository state, then continue work in the same turn. GitHub live state is authoritative.

## Handoff protocol

1. Read this file first. Do not start from chat memory, an old SHA, a remembered branch, or a previous PR number.
2. Build one **Session Sync Capsule** in one batched live read: current `main` SHA/subject/date; all open PR IDs/titles/draft/base/head refs and SHAs/mergeability; open issue IDs/titles; and exact-head check-runs/statuses for the task-matched PR. Keep main SHA, PR base SHA, PR head SHA, code/test SHA, tested CI SHA and merge SHA distinct. Do not enumerate every branch unless branch hygiene is the task.
3. Route the task: latest explicit owner request in this conversation first; otherwise the current owner task in canonical project state after live validation; otherwise the next incomplete task in the single canonical register with no unresolved prerequisite. Match a PR only when its scope matches that task. Draft/HOLD/parking PRs are not active unless explicitly requested. If a task-matched PR is merged and its exact acceptance gates passed, treat that slice as complete, advance to the next clause or next incomplete register item, and do not reselect the closed PR; record completion in the next canonical state update. If no matching branch exists, create a small branch from verified current main. **Do not default to any PR.** PR #131 is not a permanent default merely because it was once the Landing 2.0 workbench.
4. Read one canonical task register and only relevant source/tests/evidence. Open ORIENTER.md only to resolve routing conflicts; use project-reference/FILE_ORIENTER_RU.md for path discovery; docs/PROJECT_STATE.yaml for system flags; docs/VOLLEY_LOG.md only for history/decisions.
5. Execute the next safe bounded action in the same turn. For multi-direction work, keep one active implementation slice and preserve the rest in the existing register. Batch independent reads; sequence dependent writes.
6. Verify the final diff and exact current HEAD. Never call a check green unless its tested SHA equals the reported SHA. A green or mergeable PR does not itself authorize merge.
7. Report WHERE branch/PR/HEAD, WHAT, CHECKS exact commands/run IDs/SHA, OPEN limits, and one NEXT action.

## Canonical routing

- Whole-project task order: docs/MASTER_TASK_REGISTRY_RU.md + append-only docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md. One logical register; no parallel backlog.
- Landing V1/V2: docs/LANDING_RELEASE_STRATEGY_RU.md + docs/V1_UI_FINALIZATION_RU.md. PR #131 is a selective integration workbench, not a wholesale merge instruction.
- Voice: Voice tasks in the master registry/addendum; inspect current code and exact-head evidence before adopting a voice branch.
- Research/source intake: INTEL.md → docs/OPEN_SOURCE_TRIAGE_RU.md → docs/TECHNIQUE_REGISTER_RU.md; verify primary source, exact version, license, provenance and target fit.
- Whole-project release gates: docs/PROJECT_STATE.yaml and owner-controlled issue #111.
- VPS/runtime operations: docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md and the owner-approved runbook. Deployment is separate from merge.

## Authority and safety

Merge, deployment, rebase/main synchronization, force-push, destructive changes, secrets/permissions and consequential external actions require explicit owner authorization for the relevant scope. Previously granted authorization applies only while PR, diff and risk remain within that scope; material scope changes require renewed review. Never discard main-side security, cancellation, storage recovery or user-data protections to make a merge clean.
