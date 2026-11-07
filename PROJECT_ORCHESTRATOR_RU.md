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
- **UI requirements and acceptance:** [docs/V1_UI_FINALIZATION_RU.md](docs/V1_UI_FINALIZATION_RU.md) — the only active UI acceptance checklist.
- **Provider/privacy routing requirements:** [docs/ALANDI_REQUIREMENTS_REGISTER_RU.md](docs/ALANDI_REQUIREMENTS_REGISTER_RU.md) — aServi isolation, third-party fallback and memory boundaries.
- **Historical broad owner request:** [docs/USER_REQUEST_CHECKLIST.md](docs/USER_REQUEST_CHECKLIST.md); later owner supersessions are recorded at its end.
- **Current release sequencing:** [docs/LANDING_RELEASE_STRATEGY_RU.md](docs/LANDING_RELEASE_STRATEGY_RU.md) and [docs/IMPLEMENTATION_ROADMAP_RU.md](docs/IMPLEMENTATION_ROADMAP_RU.md).
- **Archived UX snapshot:** [docs/LANDING_UX_POLISH_BACKLOG_RU.md](docs/LANDING_UX_POLISH_BACKLOG_RU.md) is historical only; do not treat it as an active backlog or create duplicate tasks.
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

1. **Single intake / no duplicate lists:** keep `MASTER_TASK_REGISTRY_RU.md` and its append-only addendum as the only task inventory. `V1_UI_FINALIZATION_RU.md` is the UI acceptance list; `ALANDI_REQUIREMENTS_REGISTER_RU.md` owns provider/privacy routing. `USER_REQUEST_CHECKLIST.md` is historical provenance. `LANDING_UX_POLISH_BACKLOG_RU.md` is archived.
2. **Pages — VERIFIED LIVE:** main `c4f23e03f563d03213eb87002863da630fc8b833` was published by GitHub Pages deployment #42372745873; Quality #42372746360 verified the deployed revision equals that exact SHA. The Node 20 warning is from GitHub-managed Pages upload-artifact@v4; repository workflows already use upload-artifact@v7.0.2. The upstream skills/github-pages tutorial has no custom deploy workflow to copy. Do not switch Pages source to Actions without a separate owner-approved settings change.
3. **UI-PROMO-001 — ACTIVE, PR #169:** branch `feat/ui-sidebar-81-polish-20261107`, base main `c4f23e03...`. This single coherent batch separates aServi from third-party providers and fallback, restructures settings, removes the retired Research Studio and unapproved Functions menu, simplifies the sidebar/header, neutralizes the stop action and replaces the no-op live smoke with an exact-SHA UI contract gate. It is IMPLEMENTED IN BRANCH only until exact-head CI passes. The owner's explicit request to publish the corrected UI authorizes release of this bounded PR after all gates pass; it does not authorize changing repository Pages settings or wholesale-merging other PRs.
4. **PR #154:** stale V2 shell workbench with conflicts against current main and previously failing Chromium coverage. Use only for selective, audited ideas; never merge wholesale.
5. **PR #168:** earlier docs-only checkpoint is stale relative to the current PR queue; current canonical corrections are being recorded with PR #169.
6. **Research Studio / Functions menu:** Research Studio is retired; the visible Agents / Skills / Integrations menu was not owner-approved. Do not reintroduce either without a new explicit request.
7. **SRC-001:** owner source sweep is documented in `INTEL.md` and `docs/OPEN_SOURCE_TRIAGE_RU.md`; research only, no bulk download/install/runtime adoption. Continue bounded baseline evaluations after the UI release.
8. Preserve remaining tasks `CHAT-001`, `HYGIENE-007` and the rest of the existing registry. Priority changes do not delete lower-priority goals.
