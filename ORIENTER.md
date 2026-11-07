# aLandi — START HERE

**Live GitHub is mutable truth.** This is a concise checkpoint, not a substitute for a fresh batched live-state read.

## Current checkpoint — 2026-11-07

- **Current main SHA:** `daad47da0c5ec07c6200d6d38bf6bb33c2290860` — `docs(state): refresh exact main and owner UI/Pages checkpoint`.
- **Last functional checkpoint:** `a8afee45bb22654b220bffda857ab10c24641ef1`; preserve #147 cancellation-safe Gateway, #148 rendering/Pyodide boundary, #150 storage recovery/atomic rollback.
- **Pages VERIFIED LIVE:** deployment #42350650890 and Quality #42350651114 passed on exact main; Quality includes deployed-root assertion, public root Chromium smoke and /landing/ smoke. Freshness #42350651042 and Provenance #42350651035 passed.
- **UI §8.8 VERIFIED / MERGED:** PR #157; exact-head Quality #42349368043 and Graphify #42349368086 passed. Remaining §§8.1–8.17 and later menus/panels/functions/minimization are still open.
- **Open PR queue:** #125, #131, #152, #154, #155, #161 (for this PR freshness snapshot, exclude PR #160 itself). **Open issue:** #111.
- **#154:** head `6ca47522d7d6998916b1b01931c217d8b7e76c75`, stale base f323b6f, dirty. Quality #42349173942 FAILED 17 E2E + 1 flaky (22 passed), including #150 storage recovery, voice/document, multimodal and privacy-memory cases; Freshness #42349173878 FAILED. Provenance #42349173871, Graphify #42349173908, Dead Code #42349173914 PASSED. Do not merge as-is or weaken tests.
- **#161:** bounded §8.1 horizontal sidebar swipe slice from current main; exact-head checks are running.
- **Owner sequence:** OLEDUE/N₂O/task-intake verified; Pages reverified; remaining UI via bounded exact-head-tested slices; all other registry goals remain preserved.

## Fast route

1. On `oledue`, read root OLEDUE.md first; then one batched live GitHub state read.
2. Route the latest explicit owner request to one existing registry ID; enrich rather than duplicate. Never default to a PR.
3. Open only task-specific source/tests; detailed paths: project-reference/FILE_ORIENTER_RU.md; state: docs/PROJECT_STATE.yaml; evidence: docs/VOLLEY_LOG.md.
4. Keep main/base/head/code/tested/check/deployment/merge SHAs distinct.
5. Execute one bounded safe slice in the same turn; update only material canonical state and report exact checks and OPEN limits.
