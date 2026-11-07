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

**Current owner execution order (live-verified 2026-11-08):** PR #173 is merged at main `bf039f887e29137b627b06fc2bb107c2793d6b69`; PR #174 is the only open PR (this bounded follow-up); issue #111 is the sole open issue. Pages deployment #42410162803 passed on the exact merge SHA. Main Quality #42410163178 passed its build/context/static/security/integrity/Chromium jobs: built-app Chromium, live root revision, canonical landing content and landing Chromium (8/8) all passed. The separate published release-contract job #128517290166 failed on a stale forbidden marker that rejects the owner-approved Functions menu. Fix the sentinel to require Agents/Deep Research/Skills and continue forbidding Research Studio, legacy provider selection and removed sidebar controls. A follow-up branch `fix/pages-functions-contract-and-state-20261108` is based on exact main; its merge/deployment requires separate authorization. Preserve issue #111 owner/environment gates, all deferred goals from closed PRs, and the remaining system/source/UI checklists. VPS/Tunnel/Ollama, target hardware and native iPhone/VoiceOver remain unverified.

## Owner override — 2026-11-08: main-only delivery, complete systems map and durable continuity

- `main` is the only durable product baseline. PRs are temporary exact-head gates; once all required checks pass, merge promptly, verify main and Pages on exact merge SHA, and close the completed PR. Do not leave completed PRs open.
- Audit every PR by live base/head/diff/dependencies/checks. Selectively preserve compatible unique work; do not merge stale/conflicting/failed/HOLD/V2 scope wholesale. #168/#171/#172 are closed after reconciled dispositions recorded in their PR bodies and VOLLEY_LOG.
- Canonical compact system inventory: `docs/ALANDI_SYSTEMS_MAP_RU.md` (18 systems); detailed map `docs/ALANDI_ARCHITECTURE_MAP_RU.md`; one task registry/addendum and one evidence log.
- Record each material step in `docs/VOLLEY_LOG.md` with exact SHAs/run IDs, changed paths, evidence, limits, rollback and next step. Synchronize OLEDUE/ORIENTER/PROJECT_STATE/snapshot when state changes; a fresh session resumes from the last checkpoint without repeating work.
- Source inventory `INTEL.md`: 310 distinct URLs / 183 GitHub repositories; inventory is not proof all sources are reviewed. Continue 8–15 source thematic batches plus occasional cross-cutting sweeps.
- Owner-authorized acquisition is governed: pin upstream commit/version, verify license and provenance, exact file/blob checksums, target/storage fit, evaluation and rollback. Selected Memvid v2.0.140 and RAG-Anything v1.4.1 source snapshots are archived under `docs/upstream-archive/` for reference only; exact per-file Git blob SHA-1s match pinned upstream. Whole-snapshot SHA-256 is still OPEN; `ship=false`; no runtime/model/dependency installed. Model weights stay out of Pages source tree/Git LFS.
- GitHub Pages release gate: main commit → official deployment → exact public root/`/landing/` content verification with cache busting. Build success is not live deployment; Pages does not prove VPS/Tunnel/Ollama.
- **Execution:** finish the bounded published UI contract sentinel correction and live checkpoint synchronization on `fix/pages-functions-contract-and-state-20261108`; run exact-head CI. Do not remove the owner-approved Functions menu to satisfy a stale check. After separate owner authorization for this follow-up merge, verify main Quality and Pages exact-SHA root + `/landing/`. Continue issue #111 owner gates, the 18-system trace audit, remaining UI requirements, the 607-row / 607-ID master registry, 97-row / 88-distinct-ID addendum and 57 unnumbered open checkbox rows, thematic INTEL batches and outstanding runtime/device evaluations.