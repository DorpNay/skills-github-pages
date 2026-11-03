# Agent engineering rules for aLandi

## Source of truth
- Work in DorpNay/skills-github-pages unless a task explicitly names another repo.
- The product is the existing static aLandi browser client (historically referred to as AI Mobile Agent). Preserve its existing state/history/research/tool contracts.
- Follow docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md for VPS operations. The previous Dify-first note is not an install checklist for the base deployment.

## Architecture and budget
- Base path: GitHub Pages UI → HTTPS Cloudflare Tunnel → FastAPI gateway → private Ollama; the first-party server route in the UI is named aLandi aServi.
- Keep gateway and Ollama on loopback for a new host; never publish port 11434. On a host with existing Docker/Dify clients, inspect the established network before changing bind.
- Use aLandi aServi for the first-party server route in UI, DOM actions, docs and tests. Do not reintroduce the old product label aLandi Cloud. Preserve legacy ai_alandi_cloud_* localStorage keys as compatibility identifiers unless an explicit migration is designed; aLandi aCloudi is reserved for a future information-storage product. Cloudflare remains the infrastructure/provider name.
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


## OLEDUE handoff trigger (2026-11-02)

- When the owner sends the single word `oledue`, read root `OLEDUE.md` first and execute its handoff protocol before asking questions or summarizing history. It is the compact entrypoint for resuming the active owner-authorized task.
- Build one Session Sync Capsule (SSC) from a batched live GitHub read; keep PR HEAD, code/test HEAD and tested CI SHA distinct. Follow OLEDUE's bounded Actions lookup: no repeated polling loops, no stale-SHA pass claims.
- Keep the first response work-oriented: verify live repository state, recover the exact stopping point, and continue a bounded safe slice. Avoid progress-only turns and repeated context requests.

## Fast entry point / first-read protocol (2026-10-27)

Before any aLandi task:
1. Read root `ORIENTER.md` first for the short entry path, then `project-reference/FILE_ORIENTER_RU.md` for the detailed canonical navigation index.
2. Read `docs/PROJECT_STATE.yaml` and verify live GitHub `main`, open PRs and issues; stored SHAs and queue counts are checkpoints, not live truth.
3. Read only the task-relevant source files, tests, and applicable architecture/security docs.
4. After each meaningful stage, update the detailed orienter checkpoint, `docs/PROJECT_STATE.yaml`, and `docs/VOLLEY_LOG.md`; record what was verified, exact SHA/PR, test evidence, blockers, rollback and next action.
5. Never leave a PR/issue untriaged. Merge only when current-head checks pass and change is safe; close stale/failed PRs with a clear reason and preserve useful ideas as small follow-up tasks. Do not close issues merely to clear the queue.

## Graph/navigation tools
- Code/dependency graph is distinct from the product's experimental memory graph.
- Graphify is a dev-only navigation tool, not a runtime dependency. The pinned code-only workflow runs on relevant source/architecture changes and weekly. Latest main run `40637941303` built 988 nodes / 2780 edges across 60 source files (224 inline UI JS nodes, 14 SQL schema nodes, 23 RAG-module nodes); ten focused queries returned neighborhoods. Inspect the artifact/report and record coverage/limits on each use: some results truncate at the 700-token budget, nine Playwright E2E files yielded no symbols, and community labels are generic. Artifacts expire after seven days and are not committed.
- Do not commit generated graph artifacts or add runtime dependencies unless measured benefit is clear.
- GitIngest = text snapshot; GitMCP = MCP access to a specific upstream; GitReverse = synthetic repository prompt. These are not interchangeable.


- Graphify workflow path filters watch `assets/js/**/*.js`, `assets/css/**/*.css` and `landing/**/*.html`, but trigger coverage is not parser coverage. The 2026-11-02 PR #131 code-only artifact (#41411404736) included `assets/js/app.js`, gateway code and 11 E2E specs, but omitted `index.md`, CSS and landing HTML; six code files yielded no symbols. Inspect HTML/CSS directly and use Chromium screenshots/DOM tests for visual conclusions. Check each artifact manifest; Graphify is a dev-only navigation hint, not state or proof.
