# aLandi — START HERE

**Live GitHub is mutable truth.** Re-fetch main, PR queue, exact HEAD/checks and deployment before acting.

## Verified baseline
- **Current main SHA:** `c4f23e03f563d03213eb87002863da630fc8b833`.
- Pages deployment #42372745873 SUCCESS; exact-main Quality #42372746360 SUCCESS (116 app Chromium, root smoke 1/1, landing 8/8 and canonical build-SHA checks); Graphify #42372746441 PASS. Public root and `/landing/` were checked. VPS/Tunnel/Ollama are not covered.

## Active bounded PR
- **PR #169** · `feat/ui-sidebar-81-polish-20261107` · base `c4f23e03f563d03213eb87002863da630fc8b833`.
- Latest code/test checkpoint `df3a95f43820c747c97e94b8dd353b9f18a17359`; re-fetch HEAD after this handoff update.
- Scope: first-party aServi vs third-party provider isolation/no silent fallback; Agents/structured analysis (four-stage same-model pipeline), Deep Research (Thorough/tool budget), Skills/task profile (instructions only); modal blur/clean-close; Research Studio retired; placeholder connectors absent; compact English AGENTS; 18-system map; source-backed orchestration method.
- **Acquisition added:** curated Memvid v2.0.140 Apache-2.0 (22-file source/license subset, upstream commit `e18fe55494379e2ab7397ce03655e8abbc5e0c31`) and RAG-Anything v1.4.1 MIT (18 selected source files plus license, upstream commit `0ef67b4d476b66407a03a39e5b17e756fc0aef29`). All selected source file Git blob SHA-1s match pinned upstream; Memvid per-file SHA-256s are recorded but not recomputed. Both are incomplete research snapshots, `ship=false`, no runtime/dependency/weights installed; whole archive SHA-256 remains OPEN.
- Exact-head run set on `df3a95f...`: Freshness #42402738727 PASS; Provenance #42402738722 FAIL duplicate RAG artifact ID (fixed in final state tree); Graphify #42402738721 IN_PROGRESS; Gateway #42402738753 IN_PROGRESS; Dead Code #42402738804 IN_PROGRESS; Quality #42402738730 QUEUED. All must be refreshed on final exact HEAD.
- **Not merged / not published.**

## PR queue and dispositions
- Open: #125, #131, #152, #154, #155, #169. Open issue #111 remains owner-controlled.
- Closed reconciled: #172 (old Research Studio blur target superseded; Functions modal blur preserved), #171 (older Functions-absent direction superseded by newest owner request; provider ideas preserved), #168 (state sync superseded by fresh #169 snapshot). PR bodies and VOLLEY_LOG record why.
- #125 FUTURE/HOLD; #131 large V2 workbench; #152 draft voice; #154 stale/diverged V2 shell; #155 draft roadmap/source archives. Selective file/source audit only; no wholesale merge.

## Canonical navigation and next steps
- Handoff: `OLEDUE.md`; English executor contract: `AGENTS.md`; navigation index: `PROJECT_ORCHESTRATOR_RU.md`.
- Systems inventory: `docs/ALANDI_SYSTEMS_MAP_RU.md` (18 systems); detailed code map: `docs/ALANDI_ARCHITECTURE_MAP_RU.md`.
- One task registry: `docs/MASTER_TASK_REGISTRY_RU.md` + existing addendum. Durable step log: `docs/VOLLEY_LOG.md`. State: `docs/PROJECT_STATE.yaml` and `docs/project-state-snapshot.json`.
- Source catalog: `INTEL.md` (310 distinct URLs / 183 GitHub repositories; not all reviewed); continue thematic 8–15-source batches and cross-cutting sweeps.
1. Refresh exact-head Quality/Chromium, Provenance, Graphify, Gateway, Dead Code and Freshness on the final state/log commit; inspect failures, never weaken assertions.
2. If all required checks pass, merge PR #169 with expected SHA; immediately verify main integrity/quality and Pages deployment + cache-busted root/`/landing/` on exact merge SHA.
3. Audit #155/#154/#152/#131/#125 selectively, close each only after value/disposition is recorded; preserve issue #111 owner gates.
4. Continue system-by-system implementation/method review and source research. Native iPhone Safari/VoiceOver, VPS/Tunnel/Ollama and hardware remain unverified.
