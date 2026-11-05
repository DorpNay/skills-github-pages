# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use `OLEDUE.md` for the compact handoff, `docs/MASTER_TASK_REGISTRY_RU.md` plus its append-only owner addendum for task order, and the detailed navigation index / machine state / chronological log only when needed.

## Current working checkpoint — 2026-11-05, after PR #149

- **Current main SHA:** `8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`. PR #149 is a state/configuration refresh child of the prior functional checkpoint `4fbf16aad3f741159654950e0260aaf717653291`.
- **Last functional checkpoint:** `4fbf16aad3f741159654950e0260aaf717653291` (PR #148). The main changes in PR #149 are state/docs and CI/provenance alignment.
- **Merged and preserved:** PR #146 canonical task register (`21162e858d769c23ee4907264305f792148a7fbf`); PR #147 cancellation-safe Gateway semaphore release (`3f37a8166fcbf89c5392f985e290be48ea27ef6a`); PR #148 inert assistant raw HTML, read-only message viewer and restricted Pyodide JS globals (`4fbf16aad3f741159654950e0260aaf717653291`); PR #149 state/toolchain/provenance refresh (`8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`).
- **PR #149 exact-head gates:** Quality run #42001310270 (7 jobs), Project State Freshness #42001309687, License and Artifact Provenance #42001309703, Graphify #42001311323 — all PASS. These are PR-head checks; post-merge main workflow IDs were not retrieved.
- **Current engineering slice — PR #150 branch `fix/browser-storage-recovery-atomicity-20261105`, exact HEAD `0c2cf9f15c9cef6053487e5f01adadcb8917115e`:** project storage recovery backup; partial-corruption preservation for chats; fail-closed writes if backup cannot be created; rollback of partial chat/project writes; import/create/delete transaction gates; no false success toast; four deterministic Chromium regression tests; 50,000-message import cap. Exact-head Quality #42011984158 (7 jobs), Project State Freshness #42011984534, Provenance #42011984243 and Graphify #42011984203 all PASS. PR remains open and unmerged; main is unchanged.
- **New conditional privacy finding:** FTS5 secure-delete requires SQLite 3.42.0+; the MemoryManager property records capability but is not exposed in health status. On older SQLite, logical deletion can leave FTS segment entries until merge. Feature/runtime/target-host status remains unverified; do not claim forensic deletion.
- **PR #131:** HEAD `02fb4e8986b35f55a8a3b5308704b631dfbcce80`; compare to current main remains 1,101 ahead / 17 behind, 57 files, `mergeable=false`. Keep V2 isolated; no wholesale merge.
- **PR #134:** Draft/HOLD at HEAD `519973c793a1c998b43c60dedfe55a02b74a26a9`; review #5779912938 remediation gate remains.
- **Open PR queue:** #125, #128, #129, #130, #131, #134 (6). **Open issue:** #111 (owner-controlled ruleset, live-host, deployment and device gates).
- **Branch hygiene:** 145 refs now (143 at initial inventory + merged PR #149 branch + active PR #150 branch). Five behind-only candidates and one PR #133 tree-equivalent branch rechecked; no deletion executed because connector has no branch-delete operation.
- **Next:** review PR #150 exact-head diff and recovery/rollback failure paths; keep the owner merge decision separate. Then expose FTS5 secure-delete capability and verify target SQLite version, continue provider/storage/voice/document/RAG audit, bounded Pyodide Worker design and branch ancestry review. Keep #111 open.

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
