# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Landing V2 continuity checkpoint — 2026-11-01

- **PR #131** (`feat/landing-v1-accessibility-responsive-20261031`) is the active Landing V2 implementation branch; latest head: `d822cb623b2a72642921654a04e6c9d988091834`. PR remains open and unmerged.
- V1 on `main` remains the stable baseline. V2 source changes and implementation statuses are not part of main until the owner explicitly authorizes merging PR #131.
- Owner control: do not merge, close, retarget, force-update, synchronize with main, or deploy PR #131 without the owner's explicit command.
- Canonical V2 requirements: `docs/V1_UI_FINALIZATION_RU.md`, sections 8.1–8.17. Unified remaining queue: section 8.0. Implementation/evidence ledger: `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md` on PR #131.
- **Verified for unchanged Gateway code:** Actions run #640 passed compileall, manifest/INTEL, `pytest gateway/tests`, deploy preflight and six-layer offline evaluation on `6f7fde485b2b13aecc50523b20785e0ac615d2ad`; no `gateway/**` files changed after that tested commit through the current PR head.
- **Verified only for main/V1 on backup PR #132:** Quality run #1114 passed all jobs; Chromium log reports 98 passed and published-site smoke 1 passed. Freshness #258 passed 16 deterministic tests and exact queue check (main `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`, 8 PRs excluding #132, issue #111). Provenance #798 passed. These runs do **not** validate Landing V2 code in PR #131.
- **Still pending for PR #131:** an actual exact-head Quality/Chromium result and its own published-site smoke status. The current SHA lookup returns no PR-triggered runs for its latest head; a documentation commit was added to request normal PR CI, but no run is visible yet.
- Live compare: PR #131 is **203 commits ahead / 4 behind** `main`, merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`; GitHub reports `mergeable=false`. The four main-side commits touch the canonical UI checklist. No branch sync/rebase/merge has been performed.
- Other open workstreams: #130 Deep Research, #129 Voice, #128 Agent Workforce, and #125 Agent Studio are research/HOLD branches based on `future-workstreams/parking-base-20261031`; #127 is the continuity/master registry; #126 dependency audit (draft); #124 Python/dependency lock. Keep these isolated; do not merge holding branches wholesale into main.
- Separate draft PR #132 (`docs/landing-v2-continuity-backup-20261101`) stores this continuity state outside the implementation branch. It is documentation-only, open and unmerged.
- Next: obtain exact PR #131 Quality/Chromium evidence without synchronizing its branch to main; then inspect only confirmed failures. Manual iPhone Safari/VoiceOver, measured WCAG contrast and visual acceptance remain P1.

## Current working checkpoint — 2026-11-01

- **Current main SHA:** `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1` — documentation-only commit marking owner requirements 8.1–8.17 as V2.0 priorities. Last functional main checkpoint remains `fd4f0a105183feb23e0f4e4697446235de9ffe9a`. V1 remains the stable main baseline; V2 implementation is not merged.
- **Open PR queue:** #124, #125, #126, #127, #128, #129, #130, #131. This snapshot is for draft backup PR #132 and excludes only #132 from its own comparison. PR #131 is Landing V2 implementation, open/unmerged and owner-controlled; PR #132 is a documentation-only continuity backup, draft/open/unmerged.
- **Open issues:** #111 only; it remains the consolidated owner/live-host release gate.
- **PR #131:** branch `feat/landing-v1-accessibility-responsive-20261031`; V2 requirements 8.1–8.17; current implementation ledger and consolidated UI backlog are on that branch. Do not merge, close, retarget, force-update or deploy without the owner's explicit command.
- **Gateway evidence for PR #131:** Actions run #640 passed compileall, manifest/INTEL, `pytest gateway/tests`, deploy preflight and six-layer offline evaluation on `6f7fde485b2b13aecc50523b20785e0ac615d2ad`; no `gateway/**` changes followed through the audited PR head. Exact-head Quality/Chromium remains unverified.
- **PR #131 branch health:** 199 commits ahead / 4 behind main at the latest audit; GitHub reports `mergeable=false`. Four main-side commits modify only `docs/V1_UI_FINALIZATION_RU.md`; compare content before any synchronization. No sync/rebase/merge has been performed.
- **Manual gates still open:** native iPhone Safari/VoiceOver, measured WCAG contrast ratios, visual screenshot review, and live VPS/Tunnel/Ollama/provider verification.
- **Freshness snapshot:** `docs/project-state-snapshot.json` records main `0a1f764f...`, open PRs #124–#131, and open issue #111. This draft PR #132 is excluded from its own PR queue comparison.

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


### PR #131 continuity refresh — 2026-11-02

- Live PR #131 head: `5b9aa7abcc70fc1fa6f3c0fba402e025cb44c772`; branch `feat/landing-v1-accessibility-responsive-20261031`; compare `main...branch`: 476 ahead / 4 behind, merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`. Four main-side commits overlap only the shared UI finalization checklist; no automatic sync/rebase was performed.
- Latest UI code/test checkpoint: `b6b4cd612e288f0ad2c0e23419a562b06b491ef5`. Root app title and Jekyll metadata now consistently identify aLandi; the app advertises both dark and light color schemes. Deterministic sentinel/E2E assertions were added.
- V8 syntax parsing passed for app.js, the E2E module and Quality Sentinel (module imports/shebang adapted); CSS brace balance is zero. No Quality/Chromium run exists on the current PR #131 head; previous Chromium #1126 remains stale (101 passed / 18 failed).
- aLandi aServi is the current UI/product terminology. Legacy `ai_alandi_cloud_*` localStorage keys remain solely for compatibility; Cloudflare remains a separate infrastructure/provider brand; aLandi aCloudi is reserved for a future information-storage product.
- Repository hygiene is queued for the next major-slice boundary and documented in docs/REPOSITORY_HYGIENE_RU.md. Branch/file cleanup requires PR/issue/ancestry/reference review first; no deletion, force update, merge, rebase or deployment has occurred.
- PR #132 remains a draft documentation-only safety copy. Its checks do not validate V2 application code in PR #131.
