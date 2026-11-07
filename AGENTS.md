# Agent engineering rules for aLandi

## Source of truth
- Work in DorpNay/skills-github-pages unless a task explicitly names another repo.
- The product is the existing static AI Mobile Agent. Preserve its existing state/history/research/tool contracts.
- Follow docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md for VPS operations. The previous Dify-first note is not an install checklist for the base deployment.

## Architecture and budget
- Base path: GitHub Pages UI → HTTPS Cloudflare Tunnel → FastAPI aLandi gateway → private Ollama.
- The first-party server route in the UI is named **aLandi aServi**. Use this name in UI copy, DOM actions, docs and tests; do not reintroduce the old product label **aLandi Cloud**.
- Preserve existing `ai_alandi_cloud_*` localStorage keys as compatibility identifiers until an explicit, tested migration is designed. The internal provider value `alandi` may remain hidden for saved-state compatibility; it is not a third-party provider. `aLandi aCloudi` is reserved for a future information-storage product. Cloudflare remains the infrastructure/provider name.
- Keep gateway and Ollama on loopback for a new host; never publish port 11434. On a host with existing Docker/Dify clients, inspect the established network before changing bind.
- Start with one model and concurrency=1 on the 8-GB VPS. Dify, Redis/Valkey, vector databases and secondary workers are optional modules gated by a measured need.
- L0 browser cache, L1 inference prefix/KV reuse and L2 exact response cache are distinct. Do not claim that one is another.

## Secrets and API safety
- Never commit real API keys, Tunnel tokens, billing data or user prompts.
- CORS must contain exact web origins; CORS is not authentication.
- A shared browser Bearer key is personal-use only; do not advertise it as multi-user auth.
- Exact response cache is bounded and only for complete plain-text low-temperature completions. Bypass tools, dynamic research, streamed, multimodal/structured, missing-temperature, failed, cancelled and partial requests.
- Never cache or log raw user file/media contents by default. Do not give the browser arbitrary shell or model administration tools.

## Change protocol
- Read current implementation and tests before editing; apply a minimal patch.
- Add deterministic contract tests before enabling a new behavior. Use mocks in CI, not multi-GB model downloads or live paid APIs.
- Run gateway tests, quality sentinels, Jekyll build and Chromium E2E. Inspect the diff and fix regressions before merge.
- Record what was actually tested. A green GitHub Pages deployment is not proof that a live VPS/Tunnel was deployed.
- Update user-facing runbook and troubleshooting alongside operational code.
- No git reset --hard; do not overwrite unknown user changes.
- When refreshing a live main/queue checkpoint, update OLEDUE.md, AGENTS.md, docs/project-state-snapshot.json, ORIENTER.md, project-reference/FILE_ORIENTER_RU.md, docs/PROJECT_STATE.yaml and docs/VOLLEY_LOG.md together; keep exact SHA and queue IDs aligned.


## OLEDUE handoff trigger

- When the owner sends `oledue` (alone or with a task), read root `OLEDUE.md` first and execute its handoff protocol before asking questions or summarizing history.
- Build one batched live GitHub Session Sync Capsule. Never select a PR from chat memory or a hard-coded fallback; the latest explicit owner task and live repository state determine the workstream.
- Treat PR/base/head/tested SHAs separately. Draft/HOLD PRs are not active unless explicitly requested. A branch is not the source of truth merely because it was used previously.
- Continue one bounded safe slice in the same turn; consult detailed navigation/state/history only when the selected task requires them.
- Keep the first response work-oriented and report exact branch, PR, HEAD, checks and blockers.

## Fast entry point / first-read protocol (2026-10-27)

Before any aLandi task:
1. If the owner sends `oledue`, read root `OLEDUE.md` first and execute its compact handoff; otherwise read the short checkpoint at the top of root `ORIENTER.md`.
2. Make one batched live read of `main` SHA, open PR/issue IDs and the selected PR's base/head/diff/checks. Stored SHAs and queue counts are not live truth.
3. Choose one canonical work lane/task ID from the OLEDUE Fast task selector; read its task register and only the relevant source/tests.
4. Open `project-reference/FILE_ORIENTER_RU.md` for navigation, `docs/PROJECT_STATE.yaml` for system-wide state, and `docs/VOLLEY_LOG.md` for history only when needed; do not make these mandatory bulk reads for routine continuation.
5. After a material stage, update the existing task register and only the state/orientation/log records whose facts changed. Record exact SHA/PR, checks, blockers, rollback and next action.
6. Never leave a PR/issue untriaged. Merge only with explicit owner authorization and passing current-head checks; close stale/failed PRs with a clear reason and preserve useful ideas as small follow-up tasks. Do not close issues merely to clear the queue.

## Graph/navigation tools
- Code/dependency graph is distinct from the product's experimental memory graph.
- Graphify is a dev-only navigation tool, not a runtime dependency. The pinned code-only workflow runs on relevant source/architecture changes and weekly. Latest main run `40637941303` built 988 nodes / 2780 edges across 60 source files (224 inline UI JS nodes, 14 SQL schema nodes, 23 RAG-module nodes); ten focused queries returned neighborhoods. Inspect the artifact/report and record coverage/limits on each use: some results truncate at the 700-token budget, nine Playwright E2E files yielded no symbols, and community labels are generic. Artifacts expire after seven days and are not committed.
- Graphify path coverage includes extracted UI assets: `.github/workflows/graphify-pilot.yml` watches `assets/js/**/*.js`, `assets/css/**/*.css` and `landing/**/*.html` for PR and main-push events. Verify the artifact manifest includes the current app runtime and styles before using its graph for architecture conclusions; an untriggered or partial graph is not current evidence.
- Do not commit generated graph artifacts or add runtime dependencies unless measured benefit is clear.
- GitIngest = text snapshot; GitMCP = MCP access to a specific upstream; GitReverse = synthetic repository prompt. These are not interchangeable.


## Owner goal capture and aLandi principles (2026-11-07)

- Before implementing each newly stated owner goal, search the single canonical Master Task Registry and the existing UI checklist for an equivalent ID; enrich the existing item if it matches, otherwise append a stable ID to the existing addendum. Never silently drop, duplicate or mark a request complete without evidence.
- Preserve all previously recorded goals and their status when the owner changes priority order. Priority override changes sequencing, not scope cancellation.
- Normative aLandi principles and evidence rules: docs/ALANDI_N2O_CORE_RU.md. Knowledge promotion: docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md. Concise work cycle: LOOP.md.
- Use PROJECT_ORCHESTRATOR_RU.md as the navigation index for principles, external source catalog, plans, decisions and task register; it is an index, not a parallel backlog.
- Favor a safe, bounded implementation or verification in the same turn; keep handoff/checkpoint concise and update only canonical records whose material state changed.
- Current owner UI progress: checklist §8.8 icon-first message actions (UI-ICON-001) is merged in PR #157 and exact-head Quality/Graphify passed. The wider §§8.1–8.17 and later menu/panel/function/minimization backlog remains open; reconcile PR #154 against current main selectively and preserve #147/#148/#150 plus the Pages live-version guard. Do not weaken storage/privacy/security E2E assertions to obtain a green run.
