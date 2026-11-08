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

1. **Verified baseline:** main `9033c6ad708a993cba5d1b27442f53651ad71c0f`; PR #174 is merged. Exact-main Quality #42430269155, Freshness #42430269156, Provenance #42430269144, Graphify #42430269131 and Pages #42430269181 passed; public root and `/landing/` match this exact SHA.
2. **Current candidate:** PR #175, branch `feat/functions-drawer-notebook-20261108`, based on exact main. It is the only open PR; issue #111 remains the sole owner-controlled environment/release gate. Re-fetch exact HEAD and its current checks before every decision.
3. **Scope:** sliding Functions drawer with Agents / Research / Notebook / Skills; local-first Notebook with personal/project separation, notes and URL references, bounded rights-confirmed TXT/Markdown import, search/sort/export, and inert Skill/Agent draft outputs. Existing Agents/Research/Skills handlers are reused; the four-stage same-model pipeline, Research settings/navigation and chat-scoped task profiles keep their truthful boundaries.
4. **Not implemented by this candidate:** semantic book-to-Skill conversion, general PDF/EPUB/Office/web/repository extraction, source-span evidence/claim validation, parser/signature/archive/XXE hardening, Skill schema/evals/version/rollback, `.ipynb` interoperability, code-cell execution, independent Agent workers, connectors and new permissions. Preserve LAUNCH-254…256, SF/AB/AW-SK/VERT and DR2 tasks as partial/open.
5. **Source/evidence:** current Notebook decisions are grounded in JupyterLite storage, nbformat, Pyodide Worker, Agent Skills, OWASP prompt-injection and W3C/WCAG primary sources; INTEL and TECHNIQUE_REGISTER record their limitations and aLandi disposition. No JupyterLite, converter, runtime or dependency was installed.
6. **Merge/release:** owner authorization covers currently open PRs only after complete diff review and all required checks pass on the exact current HEAD. Merge expected HEAD only; then verify main Quality and Pages/root/`landing` on the exact merge SHA. VPS deployment remains separate.
7. **Preserved goals:** UX-040 project-scoped Chats navigation, broader UX-044…046 capability/permission contract, remaining Notebook/Skill/Agent/Research work, native iPhone/VoiceOver, issue #111 and target-host runtime remain open. Keep one Master Task Registry and one systems map; do not duplicate backlogs.
8. **Method:** one active writer, parallel read-only discovery, sequential dependent writes, exact-SHA tests, no weakening of tests/security. VPS/Tunnel/Ollama, native device and target-host performance remain unverified.
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
