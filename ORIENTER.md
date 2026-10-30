# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Current working checkpoint — 2026-10-31

- **Current main SHA:** `e78a73b25725bfa63370d9946887cbbacbf51b82` — PR #123 merged. This is the last verified repository baseline in this checkpoint; re-read live GitHub before acting.
- **PR #123:** merged at `e78a73b25725bfa63370d9946887cbbacbf51b82`; exact PR head `fb6f6b6f4036cfc54d5e4dc35a6e0105a9272222`; six workflow groups passed on exact head (Gateway, Quality/Chromium/Jekyll/published-site smoke, Freshness, Provenance, Graphify and Dead Code).
- **Open PR queue (excluding this orientation PR #127):** #124 dependency refresh; #125 Agent Studio 2.0 `[FUTURE — DO NOT MERGE]`; #126 code-currency/dependency audit; #128 Agent Workforce 2.0 `[RESEARCH — HOLD]`; #129 Voice 2.0 `[RESEARCH — HOLD]`; #130 Deep Research 2.0 `[RESEARCH — HOLD]`. #127 is this documentation/continuity PR. #125/#128/#129/#130 target `future-workstreams/parking-base-20261031`, never `main`. #124/#126 are independent review PRs; do not merge without owner approval. **Open issue:** #111 owner/live-host release gate.
- **Master task registry:** `docs/MASTER_TASK_REGISTRY_RU.md` — canonical lossless inventory of **280 open/partial rows** from six historical sources (223 unchecked + 57 partial) plus new owner-directed tasks. Duplicate rows are intentionally preserved until cross-source reconciliation; 280 is not a unique-requirement count.
- **Continuity protocol:** every new chat starts here, then detailed orienter, master registry, machine state and latest volley. Verify current main SHA, open PR/issue IDs and exact PR heads from GitHub. Keep all work as a numbered list with stable task IDs; mark complete only with evidence. Update all five freshness records together after a state-changing milestone.
- **Agent platform:** PR #125 is a research/design draft, not a runtime implementation. Its 64 roles are logical profiles, not a cap and not 64 model processes. Owner now explicitly wants at least five concurrently running independent workers alongside the main model, with a design that can scale to hundreds/thousands of logical tasks/workers using queues, leases, backpressure and resource-aware scheduling.
- **VERT/conversion:** PR #128 assessed VERT (AGPL-3.0) and vertd (GPL-3.0), plus MarkItDown, Docling, Unstructured, Pandoc, LibreOffice and FFmpeg. Keep VERT as UX/WASM reference; use separate user-facing conversion and model-facing normalization adapters.
- **Output limits:** PR #128 audited the live request paths. No fixed output-token/character cap was found on ordinary main-model requests; however normal mode allows one tool call, Deep allows 8 total, multi-agent research is sequential, local Gateway concurrency defaults to one, history can be pruned, and finish_reason=length is not surfaced by the UI. See `docs/OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md` in PR #128. Never truncate model answers to fit UI formats.
- **Execution priority:** (1) finish and verify the single master registry in `docs/MASTER_TASK_REGISTRY_RU.md`; (2) improve Landing V1 only within the already selected HTML/CSS/JS + Jekyll stack and existing FastAPI/Ollama integration. No framework/runtime/dependency expansion.
- **Release boundary:** first free static V1 remains frozen for feature expansion; future agent/conversion/research work belongs in separately reviewed future-phase PRs. Live VPS/Ollama, target-host performance, native iPhone, real voice, production RAG, OAuth and sandbox acceptance remain separate owner/environment gates.

## First-read order

1. **`project-reference/FILE_ORIENTER_RU.md`** — current checkpoint, repository map, last verified stage, blockers and next action.
2. **`docs/MASTER_TASK_REGISTRY_RU.md`** — lossless task inventory with stable IDs; reconcile duplicates only after mapping evidence.
3. **`docs/PROJECT_STATE.yaml`** — feature/runtime status, flags, verification evidence and unresolved risks.
4. **`docs/VOLLEY_LOG.md`** — chronological stage log; read the newest entry first.
5. **Live GitHub main, PRs, Issues and exact-head checks** — stored SHAs and queue counts are snapshots, never live truth.
6. Read only source, tests, architecture and operational docs relevant to the task. Use `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for module boundaries and the implementation guide before VPS operations.


## Keeping orientation current

- The `Project State Freshness` workflow checks this baseline and exact open PR/issue IDs on PR updates and daily.
- The current PR is excluded from its own open-PR comparison; no other queue difference is ignored.
- If the main SHA or queue changes, reconcile the snapshot, this file, the detailed orienter, `docs/PROJECT_STATE.yaml`, and `docs/VOLLEY_LOG.md` together. CI reports drift; it does not silently rewrite or commit state.
- After every meaningful stage, record exact files/decisions, SHA/PR, tests actually run, risks, rollback, and next action. Never claim a green CI change is deployed on a live host.
- Every task must have a stable ID in the master registry or a canonical source checklist. Report the task list first, then update each item as it is completed; retain partial/unverified status until evidence exists.
- Never overwrite the historical source checklists during migration. Reconcile duplicate rows by linking IDs; preserve original source text and line provenance.

## Three-role audit — post-merge checkpoint

- PR #121 and PR #122 are merged; exact-head CI evidence is recorded above and in the detailed tracker.
- The old Gateway liveness/readiness branch is now integrated through PR #122; no remaining PR branch should be merged wholesale without a current-main comparison.
- Legacy helper/model branches were inspected. The separate `self-hosted/free-cloud` selector is superseded by the single provider-route architecture. Workspace project tools remain deferred pending permission/scope/approval review.
- Next work is V1 polish and verification inside the frozen stack, plus target-host model/helper evaluation and the owner-only release gates in issue #111.

### Owner addendum — voice, helpers, GPU and multi-agent (2026-10-30)
- Added P0 voice requirements P0-13…P0-18 and P1 helper/GPU/orchestration/Knowledge-to-Skill requirements P1-10…P1-17 in docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md.
- Voice scope gap: editable local ASR, one-message Piper TTS and half-duplex dialogue exist; selected-text TTS, multi-message queue, true streaming turn-taking and native AEC/barge-in remain to implement/verify.
- Moonshine Voice is strong for live streaming but currently listed STT locales do not include RU or TH; TTS includes RU, not TH. Keep Whisper for RU/TH; evaluate Moonshine only for supported locales with exact model license review.
- Agent orchestration candidates: OpenWOP v2 protocol, LangGraph checkpoint/interrupt, Temporal durable workflows. OpenWOP is not production-proven; no runtime adopted.
- Small helper candidates: Qwen3.5-0.8B for narrow low-risk classification/extraction; Granite-4.2-3B for tool-call experiments. Both require RU/EN/TH eval; no automatic model selection.
- Next: continue module/security audit and complete Chromium checks; see detailed tracker.

### Confirmed audio process cleanup fix — 2026-10-30
- Debugger found that ASR ffprobe/ffmpeg/whisper.cpp and Piper TTS child processes were terminated on timeout but not on request cancellation.
- Fixed with shared `await_local_process()` in gateway/app.py; cancellation/timeout now kills and reaps the child. Added regression tests in gateway/tests/test_audio_concurrency.py.
- Functional code commits: `77b2691` (helper) and `363bb5c` (tests). Equivalent local subprocess smoke passed for both cancellation and timeout (child return codes -9). This is not the repository Gateway test run.
- The audio subprocess cancellation/timeout fix and regression tests are included in merged PR #121; exact-head Gateway Tests passed. Live audio runtime and target-device behavior remain unverified.
- Next: get Gateway tests running on `363bb5c`, then continue audio/document/security audit.

### Landing/app UX polish continuation — 2026-10-30
- Full remaining visual/interaction requirements consolidated in `docs/LANDING_UX_POLISH_BACKLOG_RU.md`; read it after `docs/V1_UI_FINALIZATION_RU.md`.
- Found existing landing roadmap ticker (3 roadmap cards, CSS animation only on open, reduced-motion fallback); did not duplicate it.
- Improved accessibility: each ticker now has a visible CSS-only pause/resume checkbox, complying with WCAG 2.2 SC 2.2.2 pause requirement for prolonged auto-moving content. Landing E2E pause/resume test added.
- Code commits `f42c42d51eb624b4d2e9fe638ddebffc3b7ab8db` and `b213c8a5d50c93af675693986fe22c3bd4d5499d` were included in merged PR #121; exact-head Chromium/Quality passed.
- Next: continue visual consistency/screenshot review, modal/popover focus, and native mobile verification without adding V1 scope.


### Verified scratch cleanup — 2026-10-30
- Removed only `temp/3`, `temp/4`, `temp/5` after searching repository references and updating IMPROVEMENT_SELECTION.md. These were an obsolete planning conversation, simulated brainstorm with stale claims, and unrelated generic Jekyll portfolio plan.
- Retained `temp/1` and `temp/2` as historical research sources; no production source file was removed. Detailed evidence and commit SHAs are in docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md and docs/PROJECT_STATE.yaml.


### Main synchronization — 2026-10-30
- Main advanced by documentation-only commit `e6404d510229fa64a7bb375995d76dcba55de623`, adding `docs/LANDING_UX_POLISH_BACKLOG_RU.md` (remaining screenshot, accessibility, interaction and release checks).
- Synced PR #121 with a two-parent merge commit `2c1e6bd811546a87f0ac86bc5e550dd9a31aeb13`; GitHub compare is 194 ahead / 0 behind and PR mergeable=true, mergeable_state=unstable (checks not complete).
- Current main UI polish backlog must be included in the overall release plan; do not merge until exact-head CI and the required manual gates are satisfied.


### Landing voice scope — 2026-10-30
- Landing now explicitly lists editable speech transcription, conversational voice with interruption, selected-text TTS, whole-message TTS and sequential multi-message playback queue as first functional update scope.
- Copy is careful: current local ASR/Piper/half-duplex prototype exists; streaming, AEC, barge-in, multi-message queue and device quality remain unfinished acceptance gates. No shipped claim.
- Playwright assertions were added in tests/e2e/landing.spec.mjs; exact-head CI remains pending.
- New ASR research: Nemotron 3.5 ASR Streaming 0.6B (RU production-ready tier, TH adaptation tier), Qwen3-ASR-0.6B (RU/TH listed), Parakeet RNNT 1.1B (RU/TH, NVIDIA Community Model License). Keep whisper.cpp baseline until golden-set benchmark and license review.

### Exa research + verified build — 2026-10-30
- Synthesis: docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md (45 searches, up to 360 result slots; primary sources fetched).
- XML DTD/entity handling fixed; duplicate extraction tests removed; Gateway 156 passed (one upstream Starlette/AnyIO warning). Code 051308c.
- Direct GitHub Actions migrated to immutable verified Node24 pins in 48874eab. Gateway, Chromium, published Pages smoke, Jekyll, Integrity, Security, Context, Graphify, Dead Code, Provenance and Freshness passed on exact SHA.
- Voice candidates/limits: Nemotron 3.5 (RU-ready / TH adaptation; OpenMDW-1.1); Typhoon Thai (CC-BY-4.0); VibeVoice RU/no TH; VoxCPM2 RU/TH (Apache-2.0, VRAM-heavy); NeMo-Speech.cpp Apache-2.0 code; VoiceChat 11B requires 80GB VRAM/CUDA. No model/runtime adopted.
- Pending: full manual audit, real target hardware RU/EN/TH evaluation, streaming voice, helper registry, durable orchestration, Knowledge-to-Skill and owner-host gates.
- External exercise-toolkit remains pinned because newer upstream changes workflow behavior.


### Полный аудит целостности стека — 2026-10-30
- Исходный snapshot и полный staged checklist: `docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md`.
- Аудит начат на PR #123 branch HEAD `f6e67db5a7e39abc5f9351aae5ccadefc58e865e`, base main `fd4f0a105183feb23e0f4e4697446235de9ffe9a`; PR открыт, mergeable=true. На snapshot HEAD было подтверждено 6/6 workflow groups; после новых коммитов exact-head CI требуется заново.
- Issue #111 остаётся единственным owner/environment gate. Post-merge Pages и live VPS/Ollama не подтверждены.
- Стек заморожен: HTML/CSS/vanilla JS + Jekyll/GitHub Pages + существующий FastAPI/Python/Ollama + SQLite/FTS5 + существующие ToolDAG/voice/document adapters и GitHub Actions. Никаких новых runtime компонентов.
- Ведём чек-лист по каждому подтверждённому шагу; не объявлять независимый subagent review состоявшимся, пока отдельный агент реально не выполнит работу.
