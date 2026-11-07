# aLandi — START HERE

**Live GitHub is mutable truth.** This is a concise checkpoint, not a substitute for a fresh batched live-state read.

## Current checkpoint — 2026-11-07

- **Current main SHA:** `69645ff357067f3656aa77cc67336ff423c26944` (live `main` branch read).
- **Pages VERIFIED LIVE:** GitHub-managed `pages build and deployment` run #42362476364 SUCCESS on this exact SHA. Quality #42362476858 SUCCESS, all 7 jobs; its Chromium job checked the published root, client version, and `/landing/`.
- **Production Jekyll path:** Pages run #42362476364 is GitHub-managed `dynamic/pages/pages-build-deployment`; its build job pulled `ghcr.io/actions/jekyll-build-pages:v1.0.13`, `Build with Jekyll` and `Deploy to GitHub Pages` both PASS. Upstream latest release remains v1.0.13 (2024-08-06); the Quality sentinel pins commit `44a6e6beabd48582f863aeeb6cb2151cc1716697`. No custom workflow replacement or action upgrade is indicated.
- **PR #166 §8.17:** open, base `69645ff...`, current head `858960744d4fae879ed936dd0b17ddd58cf1d8b6`. Exact heads `7c065c1`, `a79cb6b`, `dddc613` and `97fa73c` failed the same dark/high semantic-role test for different fixture/timing reasons; no production CSS override is being retained. Diagnostics showed that descendant transitions must be forced to start before the wait and the live cloud-status node can be changed by async connection refresh. Current test forces descendant style reads, waits 180ms, and uses an isolated `.cloud-status-copy[data-state=checking]` fixture. Graphify #42368174266 PASS; Quality #42368174315 IN_PROGRESS. Do not merge until root cause is fixed and exact-head gates pass.
- **Open PR queue:** #125, #131, #152, #154, #155, #166. **Open issue:** #111.
- **Owner priority:** finish §8.17 with strict contrast assertions; after owner-authorized merge, verify a fresh Pages deployment and live version. Keep other workstreams and registry goals intact.


## Fast route

1. On `oledue`, read root OLEDUE.md first; then one batched live GitHub state read.
2. Route the latest explicit owner request to one existing registry ID; enrich rather than duplicate. Never default to a PR.
3. Open only task-specific source/tests; detailed paths: project-reference/FILE_ORIENTER_RU.md; state: docs/PROJECT_STATE.yaml; evidence: docs/VOLLEY_LOG.md.
4. Keep main/base/head/code/tested/check/deployment/merge SHAs distinct.
5. Execute one bounded safe slice in the same turn; update only material canonical state and report exact checks and OPEN limits.
