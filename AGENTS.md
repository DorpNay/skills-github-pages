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
