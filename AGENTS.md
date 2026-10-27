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


## Fast entry point / first-read protocol (2026-10-27)

Before any aLandi task:
1. Read root `ORIENTEER.md` first; it is the short launch pointer for fast orientation, not a duplicate source of truth.
2. Read `project-reference/FILE_ORIENTER_RU.md` and `docs/PROJECT_STATE.yaml`; verify live GitHub `main`, open PRs and issues because stored SHAs and queue counts are checkpoints, not live truth.
3. Read only the task-relevant source files, tests, and applicable architecture/security docs.
4. After each meaningful stage, update the orienter checkpoint, `docs/PROJECT_STATE.yaml`, and `docs/VOLLEY_LOG.md`; record what was verified, exact SHA/PR, test evidence, blockers, rollback and next action.
5. Never leave a PR/issue untriaged. Merge only when current-head checks pass and change is safe; close stale/failed PRs with a clear reason and preserve useful ideas as small follow-up tasks. Do not close issues merely to clear the queue.

## Graph/navigation tools
- Code/dependency graph is distinct from the product's experimental memory graph.
- Graphify is a dev-only pilot, not a runtime dependency. It has not run in the prior checkpoint because the execution container could not resolve github.com. Retry only in a network-enabled isolated checkout; record command, version, generated files, languages/coverage, limitations, and whether the graph materially improves navigation.
- Do not commit generated graph artifacts or add runtime dependencies unless measured benefit is clear.
- GitIngest = text snapshot; GitMCP = MCP access to a specific upstream; GitReverse = synthetic repository prompt. These are not interchangeable.
