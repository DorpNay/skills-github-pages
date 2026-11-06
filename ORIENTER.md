# aLandi — START HERE

**Live GitHub state is authoritative.** This file is a short map and dated checkpoint, not a substitute for a fresh live read. Do not treat old SHAs, PR numbers or counts as current without verification.

## Current checkpoint — 2026-11-06

- **Current main SHA:** `f323b6f339d454dad6e820a4074fa230acc7b6df` — `fix(orientation): make OLEDUE owner-driven and live-state verified`. This is a documentation/handoff commit.
- **Last functional main checkpoint:** `a8afee45bb22654b220bffda857ab10c24641ef1` — PR #150 browser-storage recovery and atomic rollback.
- **Preserved main protections:** PR #147 cancellation-safe Gateway semaphore; PR #148 untrusted assistant rendering and restricted Pyodide globals; PR #150 browser-storage recovery/fail-closed writes/atomic rollback.
- **PR #153:** merged at current main SHA `f323b6f...`; exact code/test SHA `5665e60ebdbb704f9fa95cadba610984ca1da60b` passed full Quality (4/4 Chromium, published-Pages smoke and required sentinels); docs-only Freshness/Provenance/Dead Code follow-up checks passed. ORIENT-002 fresh-session test remains open.
- **Open PR queue:** #125, #131, #152, #154. **Current documentation PR:** #155 (excluded from its own Freshness queue comparison). **Open issue:** #111. The complete live queue at inspection is #125/#131/#152/#154/#155.
- **PR #154:** active modular shell promotion candidate, base current main, mergeable at the last read. Current head at the time of inspection was `796b5d54a7acb94b3d993dd4a662f721e9e2c902`; Freshness failed because the shared checkpoint snapshot was stale, Provenance/Graphify/Dead Code passed, Quality was still running. Recheck live before action. After PR #155 is promoted, refresh the checkpoint against the new main SHA and rerun PR #154 Freshness; do not assume this documentation branch's passing Freshness transfers to another PR.
- **PR #152:** separate Draft voice workstream, stale base and mergeable=false at the last read; current head at that time `b802f7a152eadbbbb65a2e1c8013f42617aa62ce`. Do not merge into shell work without a concrete dependency and separate review.
- **PR #131:** large Draft V2 workbench, diverged/mergeable=false; selective reconciliation only, never wholesale merge.
- **PR #125:** future-workstream parking; inactive unless explicitly selected by the owner.
- **PR #155:** this documentation workstream — unified roadmap v2.0 and synchronized engineering orientation/control plane. Its mutable head and exact checks must be read live.

**Main post-merge checks:** current-main Quality/Gateway/Pages/Provenance run IDs have not been retrieved for SHA `f323b6f...`. PR-head checks are not post-merge verification.

## Active owner direction

1. Complete the owner-requested roadmap and orientation/control-plane refinement in PR #155.
2. Verify Freshness/Quality/Provenance on the final exact PR #155 HEAD; preserve any failure as a blocker rather than weakening the gate.
3. After owner-controlled promotion, perform ORIENT-002 fresh-session handoff test using only OLEDUE + one batched live-state read.
4. Continue PR #154 against its current live HEAD and exact checks as a separate shell workstream.
5. Inspect PR #152 independently; keep #131 selective and #125 parked. Keep issue #111 owner-controlled.

## Document roles — one control plane, no duplicate backlog

| Source | Owns |
|---|---|
| `OLEDUE.md` | owner-triggered handoff, authority hierarchy, live-state sync, task routing and exact-evidence protocol |
| `ORIENTER.md` | this short entry point, current checkpoint and route map |
| `docs/PROJECT_STATE.yaml` | structured system flags, maturity, blockers and next task |
| `docs/project-state-snapshot.json` | machine-readable main/queue checkpoint for Freshness CI |
| `AGENTS.md` | executor invariants, project architecture/security and work protocol |
| `docs/IMPLEMENTATION_ROADMAP_RU.md` | ordered strategy: 20 steps / P0–P3 and cross-cutting AI engineering controls |
| `docs/MASTER_TASK_REGISTRY_RU.md` + owner addendum | single lossless task inventory and stable task IDs |
| `docs/VOLLEY_LOG.md` | append-only material stage/evidence/decision history |
| `LOOP.md` + N₂O Core/Knowledge Loop | execution method and promotion of reusable verified knowledge |
| `DECISIONS.md` / `EVALS.md` / `INTEL.md` | architecture decisions / evaluation evidence / upstream intelligence |

**Authority:** owner goals/permissions and safety rules take precedence; GitHub live state is authoritative for mutable repo facts; canonical docs explain intent; memory and old conversation summaries are aids only.

## Fast route

1. For an `oledue` trigger, read root `OLEDUE.md` first. Otherwise start here.
2. Build one batched live GitHub Session Sync Capsule: main SHA/subject/date, open PR metadata, open issue IDs, and exact-head checks for the task-matched PR.
3. Route from the latest explicit owner request; otherwise validated current owner task in `docs/PROJECT_STATE.yaml`; otherwise the next eligible task in the one Master Task Registry. **Never default to a PR.**
4. Read one task register and only relevant source/tests. Use `project-reference/FILE_ORIENTER_RU.md` for path discovery; state/history/evals/decisions only when relevant.
5. Before the first material edit, record baseline/branch/base/head/checks/risks in `docs/VOLLEY_LOG.md`. Record each material stage, then update canonical state only when facts change.
6. Keep main/base/head/code/tested/merge/deployment SHAs separate. A check is green only for the exact final HEAD.
7. Report WHERE / WHAT / CHECKS / OPEN / NEXT. No merge/deploy/protected action without explicit owner approval.

## Checkpoint and freshness discipline

- `scripts/check_project_state_freshness.py` compares the snapshot with exact live main SHA and open PR/issue IDs, then validates the synchronized orientation documents. It detects drift; it does not repair or rewrite state.
- A checkpoint refresh updates `OLEDUE.md`, `AGENTS.md`, `ORIENTER.md`, `project-reference/FILE_ORIENTER_RU.md`, `docs/PROJECT_STATE.yaml`, `docs/VOLLEY_LOG.md` and `docs/project-state-snapshot.json` together.
- The snapshot PR queue excludes the PR currently running its own Freshness check. The human checkpoint must still identify that active PR separately.
- Keep mutable PR heads out of long-lived state; resolve them from GitHub live. Pin tested SHAs and workflow IDs only in the evidence record that describes that run.
- A merge or PR-head smoke does not prove live deployment, VPS, native device, physical audio or target-hardware behavior.

## Detailed navigation

See `project-reference/FILE_ORIENTER_RU.md` for paths and subsystem map. It is an on-demand index, not mandatory startup reading. The canonical task sequence is in `docs/IMPLEMENTATION_ROADMAP_RU.md`; the lossless task inventory is in `docs/MASTER_TASK_REGISTRY_RU.md`.
