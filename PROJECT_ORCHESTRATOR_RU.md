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

1. **Baseline:** main `bf039f887e29137b627b06fc2bb107c2793d6b69`, PR #173 merged. No open PRs; issue #111 remains the sole owner-controlled release-gate issue.
2. **Pages / Quality:** deployment #42410162803 PASS exact SHA. Quality #42410163178 passed build, Context, Static Analysis, Security, Integrity and Chromium; Chromium confirmed the live root revision, canonical landing content and landing Chromium 8/8. Separate release-contract job #128517290166 failed because it still forbids the owner-approved `functionsMenu`; the UI menu must remain Agents / Deep Research / Skills. Fix the CI contract, not the product.
3. **Current bounded branch:** `fix/pages-functions-contract-and-state-20261108` from exact main; correct required/forbidden published markers and synchronize live checkpoint records. Do not merge this follow-up without separate owner authorization.
4. **Issue #111:** open and owner-controlled. Remaining gates include main ruleset/settings, private VPS/Tunnel/Ollama evidence, permissioned RU/EN/TH RAG corpus, real device/voice evaluation, sandbox and deletion/OAuth controls.
5. **Preserved backlog:** closed non-merged #125/#131/#152/#154/#155/#168/#171/#172 are not active PRs; retain their unimplemented goals in the single registry. Continue the 18-system trace audit, UI requirements, source batches and remaining registry work.
6. **Method:** one active writer, parallel independent read-only discovery/checks. Do not wait idle on one workflow; do not transfer check results across SHAs. VPS/Tunnel/Ollama, native iPhone/VoiceOver and target hardware remain unverified.

### Functions / Agents / Deep Research / Skills canonical specifications
- `docs/AGENT_FUNCTIONS_MENU_INFORMATION_ARCHITECTURE_RU.md` — current PR #169 UI snapshot plus future menu/agent IA; current three actions vs roadmap is explicit.
- `docs/AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md` — typed worker task contract and inert Skill safety boundary.
- `docs/AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md` — Skill Factory / Agent Builder lifecycle, SPECIFIED only.
- `docs/DEEP_RESEARCH_2_CURRENT_STATE_AUDIT_RU.md` — historical code audit plus 2026-11-08 owner-directed current delta.
- `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` — research scope, evidence, acceptance and deferred runtime contract.


### Preserved research/spec snapshots from PR #131 and #125 (2026-11-08)
- Agent/runtime: `docs/DEEP_AGENT_WORKFORCE_RESEARCH_2026-10-31_RU.md`, `docs/AGENT_MODEL_BAKEOFF_RU.md`, `docs/AGENT_ORCHESTRATION_RESEARCH_RU.md`, `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` (SPECIFIED/FUTURE, not independent runtime).
- Deep Research: `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md`, `docs/DEEP_RESEARCH_2_CURRENT_STATE_AUDIT_RU.md`, `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` (current menu boundary vs 2.0 roadmap is explicit).
- Source/media/voice: `docs/SOURCE_SELECTION_AND_AUTONOMY_METHOD_RU.md`, `docs/LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md`, `docs/VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md`, `docs/LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md`, `docs/VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md`, `docs/VOICE_2_RESEARCH_RU.md`, `docs/VOICE_IMPLEMENTATION_PLAN_RU.md`.
- Budget/governance/hygiene snapshots: `docs/OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md`, `docs/WORKSTREAM_GOVERNANCE_RU.md`, `docs/REPOSITORY_HYGIENE_RU.md`, `docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md`, `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md`. Historical backlog snapshots are not canonical active queues; current owner tasks remain in MASTER_TASK_REGISTRY.
- Candidate URL intake from these snapshots is indexed once in `INTEL.md` (103 new refs; recheck pending). The 88-ref PR #125 catalog was not duplicated.
