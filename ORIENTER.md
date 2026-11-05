# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Current working checkpoint — 2026-11-05, PR #139 merged; exact-main gates passed

- **Current main SHA:** `2e11849d409a51009693af95ac3ecbf1f057a3fc` (PR #139 squash-merged). Original V1 baseline: `9b746f7bbb1a12b482bd6f0a7cefd62b3cb454af`.
- **Post-merge exact-main checks:** Quality #41967234442 PASS; Pages deployment #41967233832 PASS; Freshness #41967234558 PASS; Provenance #41967234535 PASS; Graphify #41967234708 PASS — all on exact main SHA `2e11849d409a51009693af95ac3ecbf1f057a3fc`.
- **Production CSS:** fetched `https://dorpnay.github.io/skills-github-pages/assets/css/landing.css` successfully and confirmed content is the new landing stylesheet; published `/landing/` page also fetched. This is HTTP source verification through web fetch, not a native device review.
- **Owner policy:** main remains stable Landing 1.0 with bounded quality improvements; PR #131 remains the Landing 2.0 workbench and must not be merged wholesale.
- **Open PR queue:** #124, #125, #126, #127, #128, #129, #130, #131, #132, #133, #134, #141 (12; PR #140 is excluded from its own comparison). **Open issue:** #111 (owner/runtime release gates). Queue was rechecked live after PR #139 merge.
- **Current documentation/orientation work:** PR #140, branch `docs/post-pr139-state-artifact-triage-20261105`, based on main `2e11849d409a51009693af95ac3ecbf1f057a3fc`. It now contains the compact OLEDUE Session Sync Capsule protocol and post-PR #139 state/artifact reconciliation. Read the live PR for its current HEAD, mergeability and exact-head checks; earlier checkpoint `76dac2388223f813995a8748b67ef829dfeceed7` passed Quality #41969343106, Freshness #41969342970 and Provenance #41969343169.
- **PR #131:** HEAD `597536924ce37b17f8832aa36ea5b928f5584230`; base `e78a73b25725bfa63370d9946887cbbacbf51b82`; compare with current main is diverged, 1,094 ahead / 9 behind, 57 changed files, `mergeable=false`. Existing Quality #41787658241 and Provenance #41787658226 only establish earlier exact-head checks; no Freshness/Graphify on current branch SHA. Keep open, no wholesale merge or sync.
- **PR #131 Functions/Agents menu audit:** PR #131 Functions/Agents/Skills/Research menu source and E2E were inspected at exact HEAD `597536924ce37b17f8832aa36ea5b928f5584230`. Markup has four menu groups (task workflow, research/sources, create/transform, connections), two real function-panel entries for Agents/Skills plus connector status, and five roadmap-only cards with read-only Details. Agent panel has two real config groups (sequential structured workflow and local Team Blueprint) and four native disclosures for future roles/profiles, orchestration/models/resources, permissions, tasks/history; copy explicitly states one selected model executes the four-stage pipeline and no independent agents/queue/AgentRun UI exists. Exact-head Quality #41787658241 passed 4/4 Chromium shards and Jekyll; Provenance #41787658226 passed. Published Pages smoke was skipped; exact-head Freshness/Graphify absent; native iPhone/VoiceOver/physical keyboard/visual acceptance remain open. Decision: UI-integrity verified on desktop Chromium, but KEEP V2; do not promote roadmap cards or fake launch controls into V1.
- **PR #134 AgentRun prototype audit:** PR #134 exact HEAD `519973c793a1c998b43c60dedfe55a02b74a26a9` reviewed (COMMENT review #5779912938, no code changes): the store persists raw `goal` text (up to 8,000 chars); denylist-only metadata filters still permit arbitrary short strings in innocuous keys; terminal run transitions can leave leased tasks valid because `_owned_lease()` does not check parent run state; `TERMINAL_RUN_STATES` is unused. Keep PR #134 Draft/HOLD; before API/runtime integration require explicit goal retention/classification, allowlisted metadata, atomic terminal task fencing and race tests. No routes/auth/workers/deployment requested or added.
- **PR #131 candidate audit:** Graphify UI Surface bridge is a possible dev-only improvement, but inferred selector/function-owner edges and limited ambiguity/error tests prevent calling the graph relationships fully reliable. Keep SPECIFIED/NEEDS WORK; test confidence before integrating.
- **Artifact acquisition permission:** owner explicitly authorized downloads on 2026-11-05. **Artifact acquisition VERIFIED:** Vosk `vosk-model-small-ru-0.22.zip` acquired via GitHub Actions run #41968439622, artifact ID `13389210196`. Size `46,236,750` bytes; SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`. Official Vosk URL succeeded; immutable HF mirror revision `e7ac2109d134b5f2404ba95389b2fb51916d4cab` is fallback. ZIP CRC, path traversal, symlink, member-count and expansion-bound validation passed on runner and CRC/path safety were independently repeated after transfer. License Apache-2.0 per official Vosk catalog. Local copy available at `/mnt/data/vosk-model-small-ru-0.22.zip`; metadata/sidecars created. `ship=false`; no runtime install, target hardware eval or RU golden-set bake-off yet.
- **Acquisition workflow PR:** #141 (Draft) adds the pinned, reproducible one-model download/hash/ZIP-validation workflow; no merge or runtime wiring.
- **NEXT:** (1) verify the final exact HEAD of PR #140 after the compact-orientation edits; if all required gates pass, request the owner's merge decision; (2) continue the PR #131 candidate audit without wholesale sync/merge; (3) evaluate the acquired Vosk artifact only after the checksum/license manifest is rechecked; keep native iPhone/VoiceOver, target-host model eval and issue #111 gates open.

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
