# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Current working checkpoint — 2026-10-31

- **Current main SHA:** `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`; main remains the stable Landing V1.0 baseline.
- **PR #131 — aLandi Landing UI v2.0:** open, unmerged; branch `feat/landing-v1-accessibility-responsive-20261031`; latest UI code commit `4c5c583d08d242308b9019417cb0c90bcaf264d3`; later commits in this checkpoint only refresh continuity docs. It is the sole branch for subsequent Landing V2 interface work. Do not merge or deploy without explicit owner approval.
- **PR #127 — continuity/master task registry:** open, unmerged; central registry `docs/MASTER_TASK_REGISTRY_RU.md` consolidates 276 open/partial items across six source registers; duplicates remain until reconciliation.
- **Research tracks:** PR #128 Agent Workforce 2.0, #129 Voice 2.0 and #130 Deep Research 2.0 remain isolated Draft/HOLD workstreams on `future-workstreams/parking-base-20261031`; do not merge into main. PR #125 Agent Studio blueprint and #124/#126 dependency overlap require reconciliation before further action.
- **V1 freeze:** no new product capabilities or runtime components in the stable landing. Improve only inside the approved HTML/CSS/JavaScript + Jekyll/GitHub Pages and existing FastAPI gateway stack.
- **Canonical UI checklist:** `docs/V1_UI_FINALIZATION_RU.md`; priority Landing V2 requirements are sections 8.1–8.17. Implementation status and evidence are tracked separately in `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md`.
- **Not verified:** exact-head Chromium/Playwright CI for PR #131, native iPhone Safari/VoiceOver, live VPS/Tunnel/Ollama/provider credentials, target-host model quality/RAM/latency, real voice runtime, production RAG corpus, OAuth/Drive and arbitrary-code sandbox.
- **At the latest PR #131 UI code commit:** 72 commits ahead / 4 behind current main; later commits only refresh continuity docs; merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`. Exact-head workflow-run and combined-status queries returned no entries. Do not report tests as passing.


## First-read order

1. **`project-reference/FILE_ORIENTER_RU.md`** — current checkpoint, repository map, last verified stage, blockers and next action.
2. **`docs/PROJECT_STATE.yaml`** — feature/runtime status, flags, verification evidence and unresolved risks.
3. **`docs/VOLLEY_LOG.md`** — chronological stage log; read the newest entry first.
4. **Live GitHub main, PRs, Issues and exact-head checks** — stored SHAs and queue counts are snapshots, never live truth.
5. Read only source, tests, architecture and operational docs relevant to the task. Use `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for module boundaries and the implementation guide before VPS operations.

## Keeping orientation current

- The `Project State Freshness` workflow checks this baseline and exact open PR/issue IDs on PR updates and daily.
- The current PR is excluded from its own open-PR comparison; no other queue difference is ignored.
- If the main SHA or queue changes, reconcile the snapshot, this file, the detailed orienter, `docs/PROJECT_STATE.yaml`, and `docs/VOLLEY_LOG.md` together. CI reports drift; it does not silently rewrite or commit state.
- After every meaningful stage, record exact files/decisions, SHA/PR, tests actually run, risks, rollback, and next action. Never claim a green CI change is deployed on a live host.

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

### Landing UI V2.0 — continuation 2026-10-31
- Sole V2 UI workstream: PR #131, branch feat/landing-v1-accessibility-responsive-20261031. Keep PR unmerged until owner explicitly requests; V1 remains in main.
- Latest confirmed code/test checkpoint before continuity-doc commits: b12038e8ee58aba77191daa29de4a232536179f2.
- Implemented slices include project-filtered chat navigation, memory-panel refinements, explicit project-context behavior, Cloud/provider/additional-settings grouping, shared control tokens, theme/language controls, touch ergonomics and user-adjustable readability.
- Removed stale client dispatch for the retired experimental server-memory feature; do not delete backend routes until ownership/dependency audit proves they are exclusive to that feature.
- Project Sources currently displays a truthful unavailable-state explanation because gateway does not expose a source-list API. No fake controls.
- E2E assertions were added/updated, but no CI run/status is present for the latest exact head. Do not report tests as passing. Next: inspect exact-head PR checks/workflows, run Chromium + Quality and update this checkpoint.

### Landing UI V2.0 — exact checkpoint refresh 2026-10-31
- Latest verified PR #131 branch head: dfaeee97692fd65384ddc070b2b09d99875c5877; 49 ahead / 4 behind main; merge base e78a73b25725bfa63370d9946887cbbacbf51b82.
- PR body and V2 implementation ledger refreshed to show partial implementation, remaining work and absence of exact-head CI/E2E results.
- Continue in PR #131 only. No merge/deployment without explicit owner approval; main remains V1.


### Landing UI V2.0 — readability refinement 2026-10-31
- Text readability settings now include a live preview affected by the selected scale/contrast and a reset-to-default action. E2E coverage added for both; tests remain unexecuted pending CI/runtime access.
- Current code/test head at checkpoint: 934f5f30189f8615ece8be64474da272809a53e4; 55 ahead / 4 behind main.
- PR #131 remains isolated and unmerged; main stays V1.

### Landing UI V2.0 — latest head reconciliation 2026-10-31
- PR #131 branch head at checkpoint: 5289c2d17f1cd9d69ff1857c82942798367e1a62; 60 ahead / 4 behind main.
- Exact-head status/workflow-run queries empty; no E2E success claimed. PR body, V2 ledger and Volley log reconciled. Continue only in PR #131; no merge.

### Landing UI V2.0 — explicit project creation correction (2026-10-31)
- PR #131 now separates project creation from full project settings; full settings remain behind the per-project gear.
- Creating a project no longer reassigns the currently open chat or rewrites chat history. The active chat-list filter remains anchored to the current chat; a project chat is created only through the explicit project-row action.
- Project-create back control uses a 44×44px hit area and icon-first label.
- Latest confirmed head: `4c5c583d08d242308b9019417cb0c90bcaf264d3`; 72 ahead / 4 behind main. Exact-head CI/status queries empty; Playwright remains unexecuted.
- Continue in PR #131 only; no merge or deployment.
