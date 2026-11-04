# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Current working checkpoint — 2026-11-04, main checks + first archive verified

- **Current main SHA:** `9796067d9c6044fa96e1437a2ceac14574d1c1af`; last functional checkpoint `e78a73b25725bfa63370d9946887cbbacbf51b82`. PR #135 squash-merged as docs-only.
- **Open PR queue:** #124, #125, #126, #127, #128, #129, #130, #131, #132, #133, #134 (11). **Open issues:** #111 only. Live GitHub overrides this snapshot.
- **OLEDUE is in main:** root `OLEDUE.md` is a compact one-word handoff routing to the live owner-authorized workstream/PR; default PR #131 while Landing V2 is active.
- **External source index:** `INTEL.md` contains 257 deduplicated URLs from 11 curated catalogs with provenance. PR #136 proposes the first offline archive: unchanged W3C WAI WCAG 2.2 change guide, pinned upstream commit/blob, SHA-256/size and W3C Document License 2023 notice. It is not merged yet.
- **Main post-merge checks:** Quality Sentinels #41778101742, Freshness #41778101746, Provenance #41778101735 and Pages deployment #41778101349 all passed on exact main SHA 9796067; no separate live-site browser smoke claimed.
- **PR #136 exact archive gates:** on head `ac9ab53586b576abd18eb785635a632c2ae4b757`, Quality #41780155673 PASS, Freshness #41780155743 PASS, Provenance #41780155581 PASS. Raw Markdown was excluded from Jekyll Pages output after a prior Liquid-include failure; archive source itself remains unchanged. Subsequent state/log updates are docs-only; exact current PR HEAD must be rechecked.
- **PR #131:** Landing V2 remains open/unmerged/owner-controlled, mergeable=false. Code/test SHA dda1de91 Quality #41778037465 PASS (4/4 Chromium; Pages smoke skipped), Graphify #41777679201 PASS; Settings overflow fixed and screenshots reviewed. Seven overlap files manually reconciled with current main without rebase/sync.
- **NEXT:** exact-head check PR #136 after latest docs refresh; continue PR #131 merge prep and remaining mandatory UI gates. No merge/deploy without explicit owner approval.

## Current working checkpoint — 2026-11-04, PR #136 merged; archive and Jekyll verified

- **Current main SHA:** `d35812af1746ccf7268b582edf45019619431e7b`; last functional checkpoint `e78a73b25725bfa63370d9946887cbbacbf51b82`. PR #136 squash-merged; its changes are documentation/archive plus Jekyll configuration only.
- **Open PR queue:** #124, #125, #126, #127, #128, #129, #130, #131, #132, #133, #134 (11). **Open issues:** #111 only. Live GitHub overrides this snapshot.
- **OLEDUE:** root `OLEDUE.md` is in main and routes the one-word handoff to the live owner-authorized workstream; PR #131 remains the default while Landing V2 is active.
- **External sources/archive:** `INTEL.md` contains 257 deduplicated URLs from 11 curated catalogs. The unchanged W3C WAI WCAG 2.2 guide, attribution/license notice and manifest are now in `docs/upstream-archive/`; `_config.yml` excludes the raw archive from Pages rendering.
- **PR #136 exact-head gates:** Quality #41783917001 PASS (Jekyll build and real Chromium browser regression jobs included), Freshness #41783917215 PASS, Provenance #41783916918 PASS on head `01566e03239daf90271da3891cff8b6b3e6b0330`. Squash merge: `d35812af1746ccf7268b582edf45019619431e7b`. No separate post-merge main Pages deployment or live-site smoke is claimed.
- **PR #131:** open/unmerged/owner-controlled; HEAD `fc01177283de472724ff92ea6507b5b8eb87ccf2`, base/merge-base `e78a73b25725bfa63370d9946887cbbacbf51b82`; compare reports 6 commits behind and diverged; GitHub says mergeable=false. No PR workflow runs or commit statuses surfaced for this exact HEAD. Older green runs are historical only. No rebase, main sync, merge or deployment performed.
- **NEXT:** continue bounded PR #131 implementation and exact-head verification; complete native iPhone Safari, VoiceOver/keyboard-only, full component contrast and remaining interaction gates. Any branch synchronization/rebase remains a separate owner-approved action.

## Current working checkpoint — 2026-11-04, PR #136 merged; main and UI gates verified

- **Current main SHA:** `d35812af1746ccf7268b582edf45019619431e7b`; last functional checkpoint `e78a73b25725bfa63370d9946887cbbacbf51b82`. PR #136 squash-merged; its changes are documentation/archive plus Jekyll configuration only.
- **Post-merge exact-main checks:** Quality #41784349212 PASS (Jekyll and published-site Chromium smoke included); Freshness #41784349315 PASS; Provenance #41784349268 PASS; Pages deployment #41784349032 PASS on `d35812af1746ccf7268b582edf45019619431e7b`.
- **OLEDUE:** root `OLEDUE.md` is in main and routes the one-word handoff to the live owner-authorized workstream; PR #131 remains the default while Landing V2 is active.
- **External sources/archive:** `INTEL.md` contains 257 deduplicated URLs from 11 curated catalogs. The unchanged W3C WAI WCAG 2.2 guide, attribution/license notice and manifest are in `docs/upstream-archive/`; `_config.yml` excludes the raw archive from Pages rendering.
- **PR #136 exact-head gates:** Quality #41783917001 PASS (Jekyll and real Chromium), Freshness #41783917215 PASS, Provenance #41783916918 PASS on head `01566e03239daf90271da3891cff8b6b3e6b0330`; merged at `d35812af1746ccf7268b582edf45019619431e7b`.
- **Open PR queue:** #124, #125, #126, #127, #128, #129, #130, #131, #132, #133, #134 (11). **Open issues:** #111 only. Live GitHub overrides this snapshot.
- **PR #131:** open/unmerged/owner-controlled; current HEAD `920dff5b27e548214c86e36ba50856026ccecb34`, base/merge-base `e78a73b25725bfa63370d9946887cbbacbf51b82`; compare reports 1069 ahead / 6 behind and diverged; GitHub says mergeable=false. Code/test HEAD `fc01177283de472724ff92ea6507b5b8eb87ccf2` passed Quality #41784481921 (4/4 Chromium, Jekyll, Integrity, Security, Context; Pages smoke skipped) and Graphify #41784481966. Current HEAD `920dff5b27e548214c86e36ba50856026ccecb34` includes later docs/config changes; no exact-head run is surfaced for it.
- **NEXT:** continue bounded PR #131 implementation and exact-head verification; finish native iPhone Safari, VoiceOver/keyboard-only, full component contrast and remaining interaction gates. Any branch synchronization/rebase remains a separate owner-approved action.

## First-read order

0. **`OLEDUE.md`** — when the owner writes `oledue`, route automatically to the live active owner-authorized PR/branch; do not ask for branch or PR clarification. Read the handoff protocol first.
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
