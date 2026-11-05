# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use `OLEDUE.md` for the compact handoff, `docs/MASTER_TASK_REGISTRY_RU.md` plus its append-only owner addendum for task order, and the detailed navigation index / machine state / chronological log only when needed.

## Current working checkpoint — 2026-11-05, consolidated main

- **Current main SHA:** `88d230fc92fef5b884af699345fd010291107693`. Original Landing V1 baseline is recoverable at `archive/landing-v1-baseline-9b746f7-20261105` → `9b746f7bbb1a12b482bd6f0a7cefd62b3cb454af`.
- **Owner policy:** main remains Landing 1.0 with bounded accessibility, reliability, security, performance and maintainability improvements. PR #131 is the substantial Landing 2.0 workbench; never merge it wholesale.
- **Merged and preserved:** PR #139 public Landing V1 accessibility/responsive slice (`2e11849d409a51009693af95ac3ecbf1f057a3fc)); PR #140 compact OLEDUE Session Sync Capsule (`fe43d7fbd04dd4da7b557a3dd3f6c7f3ef6a924b`); PR #142 N₂O owner documents (`c307b7e3940e9051843befd5f77acfeaef66c91d`); PR #144 source/license/inspiration audit (`99c5d673cf239a1cd86b67aca101a3c0773f3761`); PR #143 Vosk model artifact in `models/vosk/` (`12ce75cdd6e14ae7752643bb20fc5421b177c26e`); PR #145 Python lock/dependency and event-loop parsing improvements (`88d230fc92fef5b884af699345fd010291107693`).
- **Current-main exact checks:** Gateway #41982069320 PASS; Provenance #41982069399 PASS; Graphify #41982069425 PASS. Quality #41982069618 is pending and Pages deployment #41982069239 is in progress on exact main SHA `88d230fc92fef5b884af699345fd010291107693`. Do not claim post-merge Quality/Pages until those finish.
- **PR #145 exact-head evidence:** Quality #41981377808, Gateway #41981377700 (Python 3.12/3.13/3.14), Graphify #41981377789, Provenance #41981377775 and Dead Code #41981377752 all passed before merge.
- **Vosk artifact:** `models/vosk/vosk-model-small-ru-0.22.zip`, 46,236,750 bytes, SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`; metadata, checksum, upstream README and Apache-2.0 license notice are stored beside it. Acquisition workflow is read-only/manual. `ship=false`; no runtime activation or target-hardware evaluation.
- **PR #131:** current HEAD `02fb4e8986b35f55a8a3b5308704b631dfbcce80`; base `e78a73b25725bfa63370d9946887cbbacbf51b82`; compare is diverged, 1,101 ahead / 14 behind, 57 files, `mergeable=false`. Graphify pilot passed on code/test HEAD `c79e983a57d6cc2b87a9296a1334e6d6ed5b3479` (#41981885581); final Quality #41981955002 is still running. Keep V2 isolated; do not merge wholesale or rewrite/sync branch history.
- **PR #134:** Draft/HOLD. Existing review #5779912938 found raw goal persistence, denylist-only metadata, missing parent-run terminal fencing and unused terminal-state constant. Require explicit goal retention/classification, allowlisted metadata, atomic terminal fencing and race tests before any API/runtime integration.
- **Open PR queue:** #125, #127, #128, #129, #130, #131, #134 (7; PR #146 excluded from its own freshness comparison). **Open issue:** #111 (owner-controlled ruleset, live-host, deployment and device gates).
- **Superseded PRs closed:** #124/#126 → #145; #133 → #142; #141 → #143; #132 backup → active #131 plus preserved V1 baseline. Their branches are not yet deleted; the available GitHub connector has no direct branch-delete action. Recheck unique commits before deletion.
- **Next:** finish current-main Quality/Pages; verify PR #131 final Quality; merge the master task registry/state reconciliation only after its exact-head gates; continue independent V2 candidate audit and same-audio Vosk evaluation.

## Fast orientation

1. Read `OLEDUE.md` for the handoff contract; for ordinary tasks, this checkpoint is the short entry point.
2. Batch live GitHub reads once: current main SHA, open PR/issue IDs, selected PR base/head/diff and exact-HEAD checks.
3. Select one canonical task register and continue from its latest verified checkpoint.
4. Open `project-reference/FILE_ORIENTER_RU.md`, `docs/PROJECT_STATE.yaml` and `docs/VOLLEY_LOG.md` only when navigation, system-wide state or historical evidence is needed. They are reference sources, not a mandatory startup checklist.
5. Read only task-relevant source/tests. Use `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for module boundaries and the implementation guide before VPS operations.

## Keeping orientation current

- The `Project State Freshness` workflow checks this baseline and exact open PR/issue IDs on PR updates and daily.
- The current PR is excluded from its own open-PR comparison; no other queue difference is ignored.
- If the main SHA or queue changes, reconcile the snapshot, this file, the detailed orienter, `docs/PROJECT_STATE.yaml`, and `docs/VOLLEY_LOG.md` together. CI reports drift; it does not silently rewrite or commit state.
- Do not reread the full orientation stack on every turn. Refresh only the affected checkpoint and consult deeper records on demand; a single live-state batch supersedes repeated polling.
- After every material stage, record exact files/decisions, SHA/PR, tests actually run, risks, rollback, and next action. Never claim a green CI change is deployed on a live host.

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
