# aLandi — START HERE

**Live GitHub is mutable truth.** This is a concise checkpoint, not a substitute for a fresh batched live-state read.

## Current checkpoint — 2026-11-07

- **Current main SHA:** `69645ff357067f3656aa77cc67336ff423c26944` (live `main` branch read).
- **Pages VERIFIED LIVE:** GitHub-managed `pages build and deployment` run #42362476364 SUCCESS on this exact SHA. Quality #42362476858 SUCCESS, all 7 jobs; its Chromium job checked the published root, client version, and `/landing/`.
- **Production Jekyll path:** Pages run #42362476364 is GitHub-managed `dynamic/pages/pages-build-deployment`; its build job pulled `ghcr.io/actions/jekyll-build-pages:v1.0.13`, `Build with Jekyll` and `Deploy to GitHub Pages` both PASS. No custom workflow replacement is indicated. The separate Quality Jekyll sentinel pins `actions/jekyll-build-pages` at `44a6e6beabd48582f863aeeb6cb2151cc1716697`.
- **PR #166 §8.17:** open, base `69645ff...`, current diagnostic head `571a68dec8f68ecfa62e7ef05f75f32c21b342de`. Exact heads `7c065c1`, `a79cb6b` and `dddc613` each failed the same dark/high disabled/link semantic-role assertion (115 passed, 1 failed); the first CSS specificity patch did not change computed colors. Current head adds diagnostic capture of selector matches and inherited/computed color values; Quality #42367459092 and Graphify #42367459077 were IN_PROGRESS. Do not merge until root cause is fixed and exact-head gates pass.
- **Open PR queue:** #125, #131, #152, #154, #155, #166. **Open issue:** #111.
- **Owner priority:** finish §8.17 with strict contrast assertions; after owner-authorized merge, verify a fresh Pages deployment and live version. Keep other workstreams and registry goals intact.


## Fast route

1. On `oledue`, read root OLEDUE.md first; then one batched live GitHub state read.
2. Route the latest explicit owner request to one existing registry ID; enrich rather than duplicate. Never default to a PR.
3. Open only task-specific source/tests; detailed paths: project-reference/FILE_ORIENTER_RU.md; state: docs/PROJECT_STATE.yaml; evidence: docs/VOLLEY_LOG.md.
4. Keep main/base/head/code/tested/check/deployment/merge SHAs distinct.
5. Execute one bounded safe slice in the same turn; update only material canonical state and report exact checks and OPEN limits.
