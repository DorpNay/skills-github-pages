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

1. **Baseline:** main `c4f23e03f563d03213eb87002863da630fc8b833` VERIFIED LIVE by Pages #42372745873, Quality #42372746360, Graphify #42372746441. Main is sole durable baseline; PRs are temporary exact-head delivery gates.
2. **Active PR #169:** aServi/provider isolation; Functions surface (Agents/structured analysis, Deep Research via Thorough, Skills/task profile); modal blur/clean close; Research Studio retired; placeholder Connectors hidden. Latest code/test head `df3a95f43820c747c97e94b8dd353b9f18a17359`. Exact Freshness passed; Provenance failed due duplicate RAG archive artifact ID, now corrected in this state tree; Graphify/Gateway/Dead Code in progress, Quality queued. Re-fetch all final exact-head checks. No merge/deploy claim.
3. **Governed acquisition:** selected Memvid v2.0.140 (Apache-2.0, upstream e18fe55494379e2ab7397ce03655e8abbc5e0c31) and RAG-Anything v1.4.1 (MIT, upstream 0ef67b4d476b66407a03a39e5b17e756fc0aef29) source subsets archived under docs/upstream-archive for research only. Source Git blob SHA-1s matched exact upstream commits; Memvid per-file SHA-256s preserved from upstream manifest, not recomputed. Both incomplete, ship=false; whole archive SHA-256 uncomputed; no dependencies/models/runtime installed.
4. **Reconciled closed PRs:** #172 (Research Studio blur target superseded, Functions modal blur preserved), #171 (old Functions-absent override superseded), #168 (stale state checkpoint superseded). Bodies and Volley records preserve disposition.
5. **Open queue:** #125 FUTURE/HOLD, #131 V2 workbench, #152 draft voice, #154 divergent V2 shell, #155 draft roadmap/archive, #169 active. Selective source/file audit only; issue #111 owner-controlled.
6. **Systems and research:** 18-system map remains canonical; trace each row to code/contracts/tests/maturity. INTEL snapshot 310 distinct URLs / 183 GitHub repositories is inventory, not all-reviewed status. Continue 8–15 source thematic batches and cross-cutting sweeps. Current orchestration method: one active writer/bounded slice, parallel read-only discovery, external durable checkpoints, executable CI invariants, exact SHA gates.
7. **Completion:** final PR #169 exact-head green → merge expected SHA → verify main integrity/Quality/Graphify/Freshness/Provenance and Pages deployment/public root + /landing/ → update state → audit #155/#154/#152/#131/#125 selectively → continue every remaining registry goal. Native iPhone/VoiceOver, VPS/Tunnel/Ollama and target hardware remain open.
