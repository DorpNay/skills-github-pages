# aLandi — START HERE

**Live GitHub is mutable truth.** Re-fetch main, PR queue, exact HEAD/checks and deployment before acting.

## Verified baseline — 2026-11-08

- **Current main SHA:** `9033c6ad708a993cba5d1b27442f53651ad71c0f` (`fix(ci/ui): align Pages contract and modal backdrop dismissal (#174)`).
- PR #174 is squash-merged. Exact-main Quality #42430269155, Freshness #42430269156, Provenance #42430269144, Graphify #42430269131 and Pages #42430269181 passed. Public root and `/landing/` were verified on the exact main SHA.
- **Open PR queue:** #175 — `feat(ui): Functions drawer and local Notebook MVP`, branch `feat/functions-drawer-notebook-20261108`, base `9033c6ad708a993cba5d1b27442f53651ad71c0f`, current head `62c159c94c1acc54bcadc7fbe1bd9e66412d1746`; plus #176–#182. PRs #176/#177/#178/#181 are main-based; #179 and #182 both claim UX-040 as child PRs of #175 and overlap; #180 is stacked on #179 at a base behind #179's current HEAD. **Open issue:** #111 only (owner/environment release gates).
- PR #175 changes the static UI, E2E/security sentinels and existing canonical task/architecture docs. It adds a sliding drawer with Agents, Research, Notebook and Skills; Notebook is local-first and separate from Memory. The label-only E2E assertion fix is on current HEAD; latest CI must be rerun after the complete state-sync commit.
- Owner authorizes merging the currently open PR only after complete diff review and all required exact-head checks pass. Merge the expected HEAD only, then verify post-merge main Quality and Pages. Deployment beyond Pages is separate.
- Semantic book conversion, PDF/EPUB/Office parsers, source/license/injection scans, versioned Skill lifecycle and independent Agent runtime remain open under the existing LAUNCH/SF/AB/AW-SK/VERT/DR2 register items.
- UX-040 project-scoped Chats navigation, issue #111, native iPhone Safari/VoiceOver, VPS/Tunnel/Ollama and target-host performance remain separate open/manual gates.
## Canonical navigation and next steps

- Handoff: `OLEDUE.md`; executor contract: `AGENTS.md`; orchestrator: `PROJECT_ORCHESTRATOR_RU.md`.
- Task order: `docs/MASTER_TASK_REGISTRY_RU.md` + append-only `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md`.
- Systems: `docs/ALANDI_SYSTEMS_MAP_RU.md` (18 systems); detailed code map: `docs/ALANDI_ARCHITECTURE_MAP_RU.md`.
- One release gate remains owner-controlled: issue #111 (ruleset/settings, private VPS/Tunnel/Ollama, permissioned RAG corpus, real-device voice, sandbox and deletion/OAuth evidence).
- Continue independent read-only checklist/system/source audits while exact-head CI runs; do not let one pending job block unrelated work.
- Preserve main-side security, cancellation, data recovery and provider isolation. Do not merge, deploy, delete branches or alter owner-only infrastructure without fresh scope-specific authorization.
