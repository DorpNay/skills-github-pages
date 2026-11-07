# aLandi — Project Orchestrator

**Purpose:** one compact navigation index for the owner's principles, source catalogs, goals, plans, decisions, and current repository-state records. It is an index, not a second backlog or a replacement for live GitHub evidence.

## Normative principles and execution method

- **aLandi principles / N₂O constitution:** [docs/ALANDI_N2O_CORE_RU.md](docs/ALANDI_N2O_CORE_RU.md) — authority, evidence, safety, capability contracts, status semantics, and quality.
- **Knowledge cycle:** [docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md](docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md) — capture, verify, evaluate, promote/revise/defer/reject.
- **Concise engineering loop:** [LOOP.md](LOOP.md) — execute, verify, record, rollback, handoff.
- **Executor rules:** [AGENTS.md](AGENTS.md).
- **Owner handoff / authority / routing:** [OLEDUE.md](OLEDUE.md).

## Single inventory of owner goals

- **Master task registry:** [docs/MASTER_TASK_REGISTRY_RU.md](docs/MASTER_TASK_REGISTRY_RU.md) — lossless historical inventory with stable IDs.
- **Append-only owner/capability additions:** [docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md](docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md).
- **UI requirements and acceptance:** [docs/V1_UI_FINALIZATION_RU.md](docs/V1_UI_FINALIZATION_RU.md), especially owner corrections §§8.1–8.17 and subsequent sections.
- **Current release sequencing:** [docs/LANDING_RELEASE_STRATEGY_RU.md](docs/LANDING_RELEASE_STRATEGY_RU.md) and [docs/IMPLEMENTATION_ROADMAP_RU.md](docs/IMPLEMENTATION_ROADMAP_RU.md).
- **Release gates:** owner-controlled [Issue #111](https://github.com/DorpNay/skills-github-pages/issues/111).

## External-source catalogs and adoption evidence

- **Full source inventory:** [INTEL.md](INTEL.md) (stable EXT IDs, upstream/provenance and evidence).
- **Source triage / license and adoption boundaries:** [docs/OPEN_SOURCE_TRIAGE_RU.md](docs/OPEN_SOURCE_TRIAGE_RU.md).
- **Technique and reusable-method register:** [docs/TECHNIQUE_REGISTER_RU.md](docs/TECHNIQUE_REGISTER_RU.md).
- **Evaluation contracts:** [EVALS.md](EVALS.md).
- **Architecture decisions:** [DECISIONS.md](DECISIONS.md).
- **Artifact/license provenance:** [infra/license/provenance_manifest.yaml](infra/license/provenance_manifest.yaml).

External research records do not mean code/model weights were downloaded, licensed for redistribution, adopted, or enabled. Preserve only owner-approved artifacts with exact upstream revision, applicable code/weight/data license, SHA-256, provenance and storage policy.

## Live state and navigation

- **Current mutable truth:** GitHub main/PR/issues/workflow/deployment APIs, checked fresh at task start.
- **Short checkpoint:** [ORIENTER.md](ORIENTER.md).
- **Detailed path index:** [project-reference/FILE_ORIENTER_RU.md](project-reference/FILE_ORIENTER_RU.md).
- **Structured state:** [docs/PROJECT_STATE.yaml](docs/PROJECT_STATE.yaml).
- **Machine checkpoint:** [docs/project-state-snapshot.json](docs/project-state-snapshot.json).
- **Stage evidence / decisions:** [docs/VOLLEY_LOG.md](docs/VOLLEY_LOG.md).
- **GitHub Pages publication evidence:** check exact main SHA's Pages deployment and the public URL with a cache-busting query; build/CI success alone is not deployment proof.

## Owner goal intake (mandatory, lightweight)

For every newly stated owner goal:
1. Search the existing Master Task Registry and UI checklist for the requirement or overlap.
2. If an ID exists, enrich it with the new constraint/detail; otherwise append one stable task ID to the existing addendum.
3. Preserve lower-priority goals and their status when execution order changes. Never silently drop a request or create a parallel backlog.
4. Begin one safe bounded implementation/check in the same work cycle whenever possible. Record exact SHA, checks, limits and next step.
5. Update only the canonical records whose material facts changed. Keep the checkpoint compact to reduce repeated work and handoff burden.

## Current owner priority override — 2026-11-07

1. OLEDUE and principle/task-intake contract — captured in PR #156.
2. Pages live publication — verified on main SHA d4a2fac093abff4a7d14c4826ec7445250dd5278: Pages deployment #42204178239 passed and cache-busted public root returned AI Mobile Agent v10.0; stale unparameterized web cache returned v9.0. PR #156 adds root-title live regression check.
3. Promote owner UI §§8.1–8.17 and later interface/menu/panel/function/minimization requirements by coherent, accessible, exact-head-tested slices. PR #131 is a workbench, not a whole-branch merge.
4. Continue external-source groups, artifact acquisition after license/provenance review, bounded cleanup/optimization, and all remaining registry items without erasure or duplicate tracking.
