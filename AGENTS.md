# Agent engineering rules for aLandi

## Source of truth
- Work in DorpNay/skills-github-pages unless a task explicitly names another repo.
- The product is the existing static AI Mobile Agent. Preserve its existing state/history/research/tool contracts.
- Follow docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md for VPS operations. The previous Dify-first note is not an install checklist for the base deployment.

## Architecture and budget
- Base path: GitHub Pages UI → HTTPS Cloudflare Tunnel → FastAPI aLandi gateway → private Ollama.
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


## OLEDUE handoff trigger (2026-11-04)

- When the owner sends the single word `oledue` (alone or with a task), read root `OLEDUE.md` first and execute its handoff protocol before asking questions or summarizing history.
- Build one Session Sync Capsule from a single batched live GitHub read; keep PR HEAD, code/test HEAD and tested CI SHA distinct. Do not reread all orientation documents by default; load detailed state/history only when the selected task needs it. Avoid repeated polling and stale-SHA pass claims.
- Keep the first response work-oriented: verify live repository state, recover the exact stopping point and continue one bounded safe slice. A green CI is not merge authorization.

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
- Do not commit generated graph artifacts or add runtime dependencies unless measured benefit is clear.
- GitIngest = text snapshot; GitMCP = MCP access to a specific upstream; GitReverse = synthetic repository prompt. These are not interchangeable.
