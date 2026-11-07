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

## Systems map and execution contract

- **Compact product inventory:** [docs/ALANDI_SYSTEMS_MAP_RU.md](docs/ALANDI_SYSTEMS_MAP_RU.md) — 18 systems, boundaries, implementation methods and maturity.
- **Detailed code map:** [docs/ALANDI_ARCHITECTURE_MAP_RU.md](docs/ALANDI_ARCHITECTURE_MAP_RU.md).
- **Execution roadmap:** [docs/IMPLEMENTATION_ROADMAP_RU.md](docs/IMPLEMENTATION_ROADMAP_RU.md) — 20 gated steps, four phases and preserved product capability goals.
- **Agent operating contract:** [AGENTS.md](AGENTS.md), English and intentionally short.
- `main` is the only durable product baseline. PRs are temporary; finish one bounded slice, pass exact-head gates, merge promptly, then verify the resulting Pages SHA. Future/failed/conflicting work is reconciled selectively, never merged wholesale.

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

## Current owner priority override — 2026-11-08

1. **Baseline and completion discipline:** main `c4f23e03f563d03213eb87002863da630fc8b833` is the sole durable product baseline and is VERIFIED LIVE by Pages #42372745873, Quality #42372746360 and Graphify #42372746441. PRs are temporary bounded verification lanes; exact-head green → merge promptly → exact-main checks → Pages public content check → record/close. No completed PR left open.
2. **Active slice — PR #169:** owner-authorized aServi/third-party separation, provider settings exclusivity, and the detailed truthful Functions surface: Agents/structured analysis (existing four-stage single-model pipeline), Deep Research (Thorough mode / tool budget), Skills/task profile (instructions only). Functions modal blur and clean-close are tested. Research Studio remains retired; placeholder Connectors are hidden. Quality is the remaining gate on the current head; re-fetch all checks after final state writes. Do not claim merged/published before merge SHA and Pages verification.
3. **Reconciled PRs:** #172 closed (old Research Studio backdrop target superseded; Functions blur acceptance retained in #169); #171 closed (older Functions-absent override conflicts with latest owner scope; compatible aServi ideas retained); #168 closed (state/orientation checkpoint superseded by fresher #169). Each PR body records disposition; VOLLEY_LOG carries evidence.
4. **Remaining open queue:** #125 FUTURE/HOLD, #131 large V2 workbench, #152 draft voice, #154 stale/diverged V2 shell, #155 draft roadmap/archive, plus active #169. Audit each by file/source/unique diff; selective port only, no wholesale merge. Issue #111 remains owner-controlled.
5. **Systems audit:** `docs/ALANDI_SYSTEMS_MAP_RU.md` is the 18-system inventory with boundaries/methods/maturity; trace each row to code contracts/tests/decisions and review for newer techniques. Do not upgrade status based on docs/Graphify alone.
6. **Source research cadence:** `INTEL.md` snapshot 310 distinct URL refs / 183 GitHub repositories; this is inventory, not all-reviewed status. Continue 8–15 source thematic batches and occasional cross-cutting sweeps. The 2026-11-08 orchestration/repository-navigation batch is recorded in INTEL and TECHNIQUE_REGISTER; it favors single-writer bounded work, parallel read-only research, external durable checkpoints, executable CI invariants and graph-aided navigation. No runtime framework/model/dependency installed from that batch.
7. **Owner goals preserved:** systems catalog validation, source review, license/provenance-gated acquisition, GitHub Pages auto-publication verification, compact English executor instruction, durable checkpoints and all existing lower-priority tasks remain in the canonical registry. Native iPhone/VoiceOver, VPS/Tunnel/Ollama, target hardware and credentialed provider runtime remain unverified.
