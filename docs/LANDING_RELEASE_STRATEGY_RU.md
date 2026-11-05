# Landing V1 stability and V2 promotion plan

**Created:** 2026-11-04  
**Owner direction:** keep the public main branch as the stable, observable Landing 1.0 baseline while allowing carefully selected quality improvements; develop the substantial Landing 2.0 package in PR #131 and promote only independently verified slices.  
**Status:** SPECIFIED — execution order is binding; individual promotions require evidence and an explicit recorded decision.

## Product and branch policy

- `main` is the stable Landing 1.0 line. It is not frozen against improvements to orientation, documentation, accessibility, reliability, performance, security, maintainability or owner convenience when those changes preserve the V1 product boundary.
- Landing 1.0 means the currently approved product surface and behavior, not a ban on local modernization. Do not silently introduce V2 product scope, new runtime capabilities, paid services, new dependencies or infrastructure changes into V1.
- PR #131 is the primary Landing 2.0 development workbench. Do not merge the PR wholesale. Extract coherent, independently useful slices; decide each slice on its own merits.
- Preserve the ability to reproduce the V1 baseline before substantial promotion: record the exact main SHA and create a durable Git reference (tag or archival branch) only after verifying the desired baseline and checking repository naming conventions. Do not create the reference prematurely or rewrite history.
- Prefer a small number of coherent promotion batches over a proliferation of tiny PRs. A batch may contain several related, separately gated improvements. Keep owner review, exact-head CI and rollback clear.
- Research branches remain isolated until their work is either accepted into the V2 workbench, promoted as a verified V1-compatible slice, or explicitly rejected/deferred.
- Repository cleanup is a final evidence-based phase, not a reason to delete useful history or unresolved work.

## Execution order

### 1. Establish the stable V1 baseline and repair orientation

**Goal:** make main a trustworthy starting point for every future session and let the owner observe safe improvements on GitHub Pages.

Tasks:
1. Reconcile root `AGENTS.md`, `OLEDUE.md`, `ORIENTER.md`, `project-reference/FILE_ORIENTER_RU.md`, `docs/PROJECT_STATE.yaml`, `docs/VOLLEY_LOG.md` and relevant source indexes against live GitHub state.
2. Ensure the OLEDUE handoff trigger and fast task selector agree; make main's entrypoint identify the current owner-authorized workstream and this promotion plan.
3. Keep a single canonical task registry for Landing V1/V2 promotion. Do not create a duplicate backlog if an existing canonical register can be extended.
4. Correct stale SHAs, PR queue, issue queue, test evidence and claims. Distinguish code HEAD, tested HEAD and merged SHA.
5. Record current V1 main SHA and later preserve it as a recoverable baseline reference.
6. Verify Jekyll build, real Chromium E2E, published Pages smoke, Freshness, Provenance, Integrity, Security, Context and Graphify as applicable on the exact documentation/orientation PR HEAD.

**Acceptance:** a new session can recover the correct branch, task and verified checkpoint from main; all orientation references agree; exact-head checks pass.  
**Maturity:** SPECIFIED until implemented and checked.

### 2. Audit PR #131 and build a promotion candidate register

**Goal:** find the small set of V2 work that is already complete, internally coherent and safe/useful on the V1 line.

For each candidate, record:
- stable capability/change ID and user-visible outcome;
- exact files and code path;
- current implementation state (IMPLEMENTED / PROTOTYPE / SPECIFIED / DEFERRED);
- deterministic tests and exact tested commit SHA;
- dependency, runtime, data migration and compatibility impact;
- security/privacy/accessibility/performance implications;
- V1 scope compatibility and whether the change is useful without the rest of V2;
- rollback path and measurable acceptance criteria;
- decision: PROMOTE, KEEP IN V2, NEEDS WORK, DEFER or REJECT.

**Promotion gate (all required):**
1. The change is bounded and independently useful.
2. It preserves the V1 product boundary and current user-data contracts.
3. It has no hidden dependency on unfinished V2 architecture or another unmerged branch.
4. Tests cover the behavior and important failure paths; test assertions alone are not a pass.
5. Exact-head Quality/Chromium and applicable Gateway/Jekyll/Integrity/Security/Context/Freshness/Provenance checks pass.
6. Accessibility and responsive behavior are checked at the relevant breakpoints; device-only claims remain explicitly unverified until tested on a real device.
7. A rollback/revert is straightforward and no irreversible migration is required.
8. The candidate is documented in this register with evidence and a reasoned decision.

**Do not promote:** roadmap-only cards, mock controls, speculative runtime, unfinished agent orchestration, unsupported source CRUD, experimental server-memory graph functionality, unverified model integrations, or UI that implies a capability not implemented.

### 3. Promote accepted V1-compatible improvements to main

**Goal:** improve the live V1 site incrementally without absorbing the whole V2 branch.

- Group accepted candidates into coherent promotion batches.
- Preserve existing contracts and avoid broad refactors.
- Run exact-head checks for each batch; inspect the final diff and published Pages result.
- Update the candidate register with merged SHA, test run IDs and residual limits.
- Keep V2-only work in PR #131.
- Do not merge PR #131 as a whole as a shortcut.

**Acceptance:** every promoted slice has a traceable decision, exact-head verification, merge SHA and rollback route; the public site reflects only accepted changes.

### 4. Preserve V1 baseline and consolidate development topology

**Goal:** leave a simple, understandable repository structure after the V1 promotion tranche.

- Record the chosen stable V1 baseline SHA and create a recoverable tag or archival branch after verification.
- Keep `main` as the current improved V1 line.
- Keep PR #131 as the single primary Landing 2.0 integration workbench.
- Keep only genuinely independent research workstreams as separate branches/PRs; otherwise consolidate their findings into #131 or the canonical research register.
- Audit every open PR and branch by ancestry, unique commits, linked issue, owner intent and reusable evidence before closing or deleting anything.
- Never delete a diverged branch, draft/hold research, or a branch with unique work merely because it is old.
- Preserve only the small number of useful humanitarian/administrative PRs the owner wants to retain; merge or close others only after their content and purpose are reconciled.

**Acceptance:** main, #131 and the explicitly retained research/humanitarian PRs have distinct purposes; no unique work is lost.

### 5. Acquire and package approved technologies, open-source code and small models

**Timing:** begin the artifact-acquisition phase only after the V2-to-V1 promotion tranche has been decided and merged, as requested by the owner. Research and license triage may continue earlier; downloads and vendoring wait for this gate.

For each selected artifact:
1. Identify the exact upstream repository, release/commit and canonical model card.
2. Verify code license and model/weights/dataset/voice license separately; check commercial-use terms, attribution, redistribution and NOTICE requirements.
3. Record immutable source URL, revision, SHA-256, size, format, architecture, language coverage, runtime, dependencies, hardware/RAM/CPU/GPU needs and known limitations.
4. Compare against the current baseline using the same fixtures and target hardware. No adoption based on leaderboard claims alone.
5. Decide whether to vendor, download at setup time, or fetch onto the future server. Do not commit large binaries by default; repository size, Git history, Git LFS, licensing and reproducible setup must be considered.
6. If vendoring is justified, include license notices, artifact manifest, verification script, tests, version pin and rollback/removal procedure.
7. Keep models disabled until quality, resource, security and product acceptance gates pass. A model file in the repository is not an enabled capability.

Initial research leads already present in `INTEL.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md` and `docs/TECHNIQUE_REGISTER_RU.md` include Harness², ECC, Agent Skills, Moonshine, Silero VAD, Vosk, llama.cpp, ONNX and document extraction candidates. Re-audit their current upstream state before any adoption. Treat user-supplied external repositories as first-class research seeds; extract specific implementation patterns rather than importing entire applications.

### 6. Repository, PR, branch and issue hygiene

**Goal:** leave no orphaned work, duplicate backlog or misleading open issue, while preserving valuable research.

- Reconcile each open PR with its actual current branch HEAD, base, diff, CI and linked issue.
- Merge only accepted work; close obsolete or superseded PRs with a concise reason and preserve reusable findings in the canonical destination.
- Delete branches only after proving their unique commits are merged or safely archived, checking references and recording the recoverable SHA.
- Keep owner/environment release gates open while they remain real blockers. In particular, issue #111 must not be closed until its owner-only deployment, hardware, security and evaluation evidence is actually supplied.
- Every remaining issue must have an owner, a concrete next action and a reason to remain open. Close only completed, obsolete or explicitly superseded issues; do not close issues merely to reach zero.
- Re-run branch/PR/issue inventory after cleanup and update orientation/state records.

**Acceptance:** every remaining branch, PR and issue has a documented purpose; no unique changes or unresolved owner gates are lost.

## Current live baseline (verified 2026-11-05)

- `main` HEAD: `2e11849d409a51009693af95ac3ecbf1f057a3fc` (PR #139 squash-merged). Original V1 baseline before code promotion: `9b746f7bbb1a12b482bd6f0a7cefd62b3cb454af`.
- PR #139 exact-head gates: Quality #41966180071, Freshness #41966180096, Provenance #41966180157 and Graphify #41966180042 PASS on exact PR HEAD `d76be1d59ed832fa638e419b542151dba277c143`. Post-merge main Quality #41967234442, Pages deployment #41967233832, Freshness #41967234558, Provenance #41967234535 and Graphify #41967234708 all PASS on exact merge SHA.
- Production delivery: the CSS asset at `https://dorpnay.github.io/skills-github-pages/assets/css/landing.css` and published `/landing/` HTML were fetched successfully; this does not replace native device review.
- PR #131 is open, branch `feat/landing-v1-accessibility-responsive-20261031`, HEAD `597536924ce37b17f8832aa36ea5b928f5584230`, base `e78a73b25725bfa63370d9946887cbbacbf51b82`. Current main compare is diverged 1,094 ahead / 9 behind, 57 changed files, mergeable=false. Earlier Quality #41787658241 and Provenance #41787658226 passed on that head; exact current Freshness/Graphify are not established and published Pages smoke was skipped. Do not merge whole PR or sync without separate owner approval.
- Open PRs at this checkpoint: #124–#134 (11). Open issue #111 is the owner/environment release gate; keep it open until evidence is complete.
- PR #139 decision: **PROMOTE / IMPLEMENTED / VERIFIED** — three-file public Landing V1 accessibility/responsive slice merged; native iPhone/VoiceOver remains unverified.
- PR #131 Graphify UI Surface bridge: **NEEDS WORK** as candidate; inferred DOM/CSS/JS relationships and approximate JS owner mapping require explicit confidence/ambiguity handling and stronger tests before the graph is treated as authoritative.
- PR #134 AgentRun lifecycle store: isolated SQLite prototype, exact-head review #5779912938 COMMENT. Raw goal persistence, denylist-only metadata and terminal run/task fencing gaps remain; keep Draft/HOLD until those gates are resolved. No API, auth or worker integration.
- **Artifact acquisition:** owner authorized downloads on 2026-11-05. First artifact `vosk-model-small-ru-0.22.zip` was downloaded through GitHub Actions run #41968439622 (artifact #13389210196), size 46,236,750 bytes, SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`; runner and independent local ZIP integrity/path checks passed. Apache-2.0 per official catalog. It remains evaluation-only (`ship=false`): no runtime install, target hardware eval or RU golden-set bake-off. Draft PR #141 adds the reproducible acquisition workflow. Qwen3-ASR-0.6B RU/TH (Apache-2.0, 1.88 GB BF16) remains research-only and not downloaded.
- Exact-main Quality, Pages, Provenance, Freshness and Graphify prove the merge SHA only; they do not validate PR #131 or target hardware.

## First promotion candidates to inspect

These are audit targets, not pre-approved promotions:

1. OLEDUE/orientation and project-state reconciliation — documentation/coordination, low product risk; check for duplication and freshness.
2. Accessibility and responsive interaction fixes — inspect actual UI diff and test coverage; preserve only independently useful changes.
3. Navigation/history, modal lifecycle, focus restoration and keyboard behavior — inspect for existing main equivalents before deciding.
4. Toast/operation status behavior — promote only if the behavior is complete, tested and not dependent on V2 operation IDs/state infrastructure.
5. Context handoff and project/chat scope — high sensitivity; require explicit scope tests and exact-head regression.
6. Agent/Skills/Research menus and roadmap disclosures — likely V2 product surface; do not promote roadmap-only UI into V1 without a deliberate product decision.
7. Gateway/model/runtime changes — evaluate separately; do not bundle with UI promotion.

## Decision log

| Candidate | Evidence / exact HEAD | Decision | Rationale / next gate |
|---|---|---|---|
| OLEDUE/orientation and release-plan docs | PR #138 head `2462a783`; Quality #41797778925, Freshness #41797779149, Provenance #41797779027 passed; merged at `a7915291` | IMPLEMENTED / CI VERIFIED | Main orientation now points to the V1/V2 plan; fresh-session behavioral handoff test remains separate.
| PR #131 wholesale merge | Current live compare: 57 files; 1,094 ahead / 9 behind; mergeable=false. Exact HEAD `597536924ce37b17f8832aa36ea5b928f5584230`; Quality #41787658241 and Provenance #41787658226 passed on this SHA, but exact-head Freshness/Graphify absent. | REJECT AS A MERGE UNIT | Extract bounded candidates only; do not sync or merge the whole branch without separate owner approval. |
| Public Landing V1 candidate / PR #139 | Exact PR HEAD `d76be1d59ed832fa638e419b542151dba277c143`: Quality #41966180071, Freshness #41966180096, Provenance #41966180157 and Graphify #41966180042 PASS. Squash-merged at `2e11849d409a51009693af95ac3ecbf1f057a3fc`; exact-main Quality #41967234442, Pages #41967233832, Freshness #41967234558, Provenance #41967234535 and Graphify #41967234708 PASS; production CSS/landing HTML fetched. | IMPLEMENTED / MERGED / VERIFIED | Native iPhone/VoiceOver and physical-device review remain unverified. |

### Follow-up review — PR #134 AgentRun prototype (2026-11-05)

PR #134 exact HEAD `519973c793a1c998b43c60dedfe55a02b74a26a9` received COMMENT review #5779912938. Findings: raw `goal` text is persisted; denylist-only metadata allows arbitrary short strings in innocuous keys; terminal run transitions can leave active task leases unfenced; `TERMINAL_RUN_STATES` is unused. Keep Draft/HOLD before API/runtime integration; require goal classification/retention, allowlisted metadata schemas, atomic terminal-task fencing and race regressions. No routes, auth, workers or deployment added.

## Change record

| Date | Branch / PR | Change | Verification |
|---|---|---|---|
| 2026-11-04 | Documentation plan branch from `9b746f7` | Initial owner-directed execution order and promotion gates | Pending exact-head CI |


## Initial PR #131 source audit — 2026-11-04

**Audit basis:** live PR #131 compare and current branch source at reported HEAD `597536924ce37b17f8832aa36ea5b928f5584230`; implementation ledger, canonical §8.0 checklist, source files and Playwright tests were inspected. This is a bounded first pass, not a full line-by-line security or UX sign-off.

### Current exact-head evidence for PR #131

- Quality run `41787658241` PASS on exact HEAD `597536924ce37b17f8832aa36ea5b928f5584230`: 4/4 real Chromium shards, Jekyll, Integrity, Security, Context and static analysis passed. Published GitHub Pages smoke was skipped by the workflow condition.
- Provenance run `41787658226` PASS on the same exact HEAD.
- No Freshness or Graphify run was found for that exact SHA in the live Actions lookup.
- Native iPhone Safari, VoiceOver, physical keyboard/long-press and full component-level contrast review are not covered by these CI results.
- Therefore this is strong desktop-browser and provenance evidence, but not a full release acceptance result. Do not transfer older Quality #1359/#1250 evidence from earlier SHAs as proof for this current HEAD.

### Candidate classification

| Workstream | Observed evidence | Initial decision | Remaining gate |
|---|---|---|---|
| 8.1–8.11 and 8.14–8.17: responsive/accessibility/navigation/control consistency | Implementation ledger records source and regression work; current Quality #41787658241 passed all 4 Chromium shards and Jekyll. Checklist still marks these items [~]; visual/manual/device checks remain. | **KEEP IN V2; V1-compatible in principle.** Do not promote as one block while the UI refactor is entangled. | Extract a bounded patch with no unfinished dependency; exact-head visual, accessibility and regression review. |
| Public Landing page accessibility/responsive slice | `landing/index.html`, `assets/css/landing.css`, `tests/e2e/landing.spec.mjs`; five original E2E tests preserved, three accessibility/responsive tests added, plus CSS HTTP 200 / `text/css` and browser stylesheet-load assertions. Exact PR #139 HEAD `167b58feab4b2d6eda85dfb4cb99eaab12e8e11a`: Quality #41804378602 (Chromium and Jekyll), Freshness #41804378584, Provenance #41804378496 and Graphify #41804378533 all PASS. | **VERIFIED ON EXACT PR #139 HEAD; READY FOR OWNER MERGE DECISION.** Functional scope is a bounded public-site improvement independent of root AI client and Gateway; V1 product boundary is preserved. | Owner authorization is required before merge. After authorized merge, verify the exact merge SHA, Pages deployment and actual production-baseurl CSS HTTP 200/text-css. Native-device visual/assistive-technology checks remain unverified. Do not include root `index.md`, Gateway or broader app refactor. |
| 8.12: retire experimental server-memory graph UI/API | Main still exposes `/v1/memory/graph/*` routes and global-memory configuration. PR #131 removes routes/flags/UI and adds a test asserting retired endpoints return 404; ordinary local/private/shared/project memory and delta sync/RAG are intended to remain. | **DO NOT PROMOTE AS A V1 REMOVAL.** Main's `DECISIONS.md`, `docs/ACCEPTED_IMPROVEMENTS.md`, `docs/USER_REQUEST_CHECKLIST.md`, `README.md` and Gateway runbook record this as a previously accepted, deliberately opt-in capability. Removing it is a product-scope reversal, not a quality-only improvement. | If retirement is ever reconsidered, first obtain an explicit owner decision; inventory live host flags and existing graph SQLite data; define export/backup/migration and client compatibility; then use a separate deprecation/removal proposal and full Gateway tests. |
| 8.13: explicit project-context handoff to an existing chat | Current E2E test verifies selected existing chat, no chat creation/membership mutation/current-chat movement, sessionStorage restore across reload, one-shot consumption and absence of project instructions/memory on the next request. The current exact-head Quality run passed all four Chromium shards. | **KEEP IN V2 for now.** Implemented and desktop-browser verified, but it adds a new context-transfer capability with privacy/scope implications outside the frozen V1 baseline. | Keep explicit opt-in, session-only scope and one-shot behavior; perform a focused privacy review and request a separate V1 product decision before promotion. |
| 8.19 notifications / operation state | Ledger documents an accessible FIFO toast and persistent acknowledged errors, but durable operation IDs, pending-to-result updates and inline recovery remain open. | **KEEP IN V2; partial implementation only.** | Finish operation lifecycle contract and failure/recovery tests; no fake progress. |
| Functions / Agents / Skills / Research menu | Code has real configuration groups plus several roadmap-only disclosures; the UI explicitly says independent worker processes, shared Skill loader and several runtimes do not exist. | **KEEP IN V2. Do not promote roadmap-only cards or fake launch controls.** | Promote only after a real capability contract and runtime exists, if ever. |
| Root client extraction (`index.md` → `assets/js/app.js` + `assets/css/app.css`) | Large structural refactor: root page changes from 5,228 to 597 lines; new JS asset is 5,348 lines and CSS asset 743 lines. It also changes behavior, naming, providers, settings and tests. | **KEEP IN V2; not a standalone V1 promotion.** | Complete structural/behavioral diff audit, verify asset loading/baseurl, regression and performance; split pure extraction from behavioral changes if promotion is later justified. |
| Graphify UI surface enrichment | New `scripts/graphify_ui_surface.py` and tests link CSS/DOM/JS selector relationships; workflow changes are in the PR. | **TOOLING CANDIDATE; NOT YET ACCEPTED.** | Exact-head Graphify workflow/artifact review, source coverage and false-positive assessment; keep dev-only, never a runtime dependency. |
| Repository hygiene and open-source reference docs | `docs/REPOSITORY_HYGIENE_RU.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md` and `docs/TECHNIQUE_REGISTER_RU.md` are expanded on #131. Some inventory snapshots date from Nov 2 and are stale relative to current queue. | **DOCUMENTATION CANDIDATES AFTER REVALIDATION.** | Refresh live branch/PR/issue/ruleset facts; re-check external links, upstream revisions and license claims; avoid duplicating the new promotion plan. |

### First decisions

1. **First V1 code candidate is promoted:** isolated public Landing page accessibility/responsive slice PR #139 squash-merged at `2e11849d409a51009693af95ac3ecbf1f057a3fc`; exact PR-head and exact-main Quality/Freshness/Provenance/Graphify plus Pages deployment passed, and production CSS/HTML were fetched. Native iPhone/VoiceOver review remains open.
2. **No whole-PR merge.** The root UI refactor and feature additions are coupled across 57 changed files.
3. **Do not promote 8.12's removal.** It conflicts with accepted main behavior and owner checklist; keep the opt-in feature intact unless the owner explicitly chooses retirement.
4. **Keep 8.13 and all new agent/menu/runtime capabilities in V2 for now.** Their implementation/test status is not permission to widen V1 scope.
5. **Treat the root app's accessibility/navigation improvements as candidates, not accepted releases.** Desktop Chromium success is not native-device acceptance; the ledger's [~] statuses remain open.
6. **Re-audit the docs-only candidates and research sources before promotion.** Their existence on #131 does not make their inventory or external claims current.




The first-pass upstream research findings are recorded in [INTEL.md — External-source first-pass](../INTEL.md#external-source-first-pass--2026-11-04). **Artifact acquisition update (2026-11-05):** Vosk small RU weights were downloaded and hash/ZIP-verified (SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`, 46,236,750 bytes, Apache-2.0 per official catalog); they remain evaluation-only with `ship=false`. No model runtime was installed or activated.
| 2026-11-05 | PR #139 `feat/v1-public-landing-a11y-20261104` | Verify the isolated V1-compatible public landing improvement; three functional files plus six orientation/state files | Exact HEAD `167b58feab4b2d6eda85dfb4cb99eaab12e8e11a`: Quality #41804378602, Freshness #41804378584, Provenance #41804378496 and Graphify #41804378533 PASS. Not merged; owner authorization and post-merge Pages checks remain pending. |
