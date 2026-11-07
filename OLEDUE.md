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

- Whole-project principles/source/plan navigation: PROJECT_ORCHESTRATOR_RU.md (index only; not a second backlog). Normative principles: docs/ALANDI_N2O_CORE_RU.md; knowledge cycle: docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md; concise method: LOOP.md.\n- Whole-project task order: docs/MASTER_TASK_REGISTRY_RU.md + append-only docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md. One logical register; no parallel backlog. For every owner goal, search existing IDs and enrich before adding.
- Landing V1/V2: docs/LANDING_RELEASE_STRATEGY_RU.md + docs/V1_UI_FINALIZATION_RU.md. PR #131 is a selective integration workbench, not a wholesale merge instruction.
- Voice: Voice tasks in the master registry/addendum; inspect current code and exact-head evidence before adopting a voice branch.
- Research/source intake: INTEL.md → docs/OPEN_SOURCE_TRIAGE_RU.md → docs/TECHNIQUE_REGISTER_RU.md; verify primary source, exact version, license, provenance and target fit.
- Whole-project release gates: docs/PROJECT_STATE.yaml and owner-controlled issue #111.
- VPS/runtime operations: docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md and the owner-approved runbook. Deployment is separate from merge.

## Authority and safety

Merge, deployment, rebase/main synchronization, force-push, destructive changes, secrets/permissions and consequential external actions require explicit owner authorization for the relevant scope. Previously granted authorization applies only while PR, diff and risk remain within that scope; material scope changes require renewed review. Never discard main-side security, cancellation, storage recovery or user-data protections to make a merge clean.

## Owner priorities and continuity contract (2026-11-07)

**Normative principles:** consult `docs/ALANDI_N2O_CORE_RU.md` (owner-approved aLandi principles) and `docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md` before substantive work; `LOOP.md` is the concise execution method. GitHub is canonical; Project Sources/chat context are manually synced aids.

**Owner's repeated requirements — carry forward, do not lose or silently close:**
- First record each new request in the existing Master Task Registry; search for overlap and enrich the existing ID rather than duplicating it. Preserve lower-priority goals while temporarily superseding their execution order.
- Keep a single orchestrator/roadmap pointer that locates principles, external-source inventory, decisions, plans and task registry. No parallel backlogs.
- For each safe, bounded change, favor progress in the same turn and concise evidence reports; do not inflate orientation/handoff into a ritual or block implementation on repeated documentation-only cycles.
- UI: actively promote the owner's existing UI work from `docs/V1_UI_FINALIZATION_RU.md`, especially §§8.1–8.17 and subsequent interface/menu/panel/function/minimize requirements, as coherent tested slices. No wholesale PR #131 merge; preserve main protections and mark runtime claims honestly.
- GitHub Pages: verify publication end-to-end (main commit → Actions → Pages deployment → actual public URL/content). If it is not publishing, diagnose the current workflow/settings and repair the existing mechanism; only if the mechanism is irrecoverable, study and selectively reproduce the exact upstream publishing workflow from the original source repository, with provenance. Do not claim deploy from CI build alone.
- Continue approved grouped external-source review from `INTEL.md`; acquire code/models/artifacts only with version, license, checksum, provenance and owner-approved storage policy.
- Carefully remove verified obsolete code/HTML/CSS/docs and optimize only after call-site/dependency/test review; preserve rollback and user data.
- Keep useful PR work consolidated into the V2 workbench or main by selective slices; retain only backup, orientation, active-scope and evidence-bearing branches/PRs. Never delete history/branches without explicit approval and live reference checks.
- Recurring conversation failure concern: reduce oversized/duplicative handoffs, capture durable checkpoints and the next exact action in canonical docs, avoid needless chat repetition. This is a workflow mitigation, not a claim to fix ChatGPT client history/loading failures.

**Current owner execution order (overrides stale checkpoint ordering):** (1) OLEDUE principles/task-intake/orchestrator contract is implemented and merged via PR #156; fresh-session ORIENT-002 acceptance remains OPEN. (2) GitHub Pages v10.0 is VERIFIED LIVE on main SHA `d83eea8ef1552b19e2f7220cbe2c3f0e9c91049c` (deployment #42349853247, cache-busting public fetch). Root-title guard regex fix merged in PR #158; exact-main Quality #42349853526 is still IN_PROGRESS at this checkpoint. Keep the GitHub-managed publishing mechanism; no duplicate deploy workflow. (3) UI §8.8 icon-first message actions are IMPLEMENTED, exact-head Quality/Graphify passed, and merged via PR #157 at SHA `40540f6d75a90877ff9cbec5bbfacb48ee6f775c`; continue §§8.1–8.17 and subsequent menus/panels/functions/minimization through selective, exact-head-tested slices. PR #154 modular shell needs current-main reconciliation and remaining E2E/storage failure-path review; do not wholesale merge #131. (4) preserve and resume every remaining registry goal. See PROJECT_ORCHESTRATOR_RU.md, the single Master Task Registry and `docs/IMPLEMENTATION_ROADMAP_RU.md`.
