## Current working checkpoint — 2026-11-02, per-chat draft recovery implemented

- **Main:** stable V1 baseline. PR #131 remains the sole V2 implementation branch and remains open/unmerged. No merge, rebase, main synchronization or production deployment.
- **PR #131:** `feat/landing-v1-accessibility-responsive-20261031`; source/test checkpoint for 8.21: `dc3762b436d2bdc54d6607bc65d09529602a1687`; documentation synchronization was last observed at `c7409e86030496cabd2e4bfd88f5bb68e92a66a3` (700 ahead / 4 behind `main`). Preserve the four base-side commits. No rebase/sync without owner approval.
- **Mandatory UI 8.1–8.17:** remains the release workstream; inherited pre-section-8 items are mapped once into these requirements in the owner checklist. Do not treat older sections 1–7 as a parallel backlog. Native iPhone Safari, VoiceOver and full WCAG component audit remain open manual gates.
- **New proposals 8.18–8.27:** separate optional V2.0 workstream; 8.19 has a bounded accessible-notification slice; 8.21 now has local name search, persistent pinning, activity/creation-date sorting and an active-chat position lock in source, with a focused Playwright regression authored but exact-head execution pending; 8.25 has per-chat text-draft recovery; 8.1/8.26 sidebar gesture cancellation is explicit in source (`050f25ef41942b2f522607cc117d15af2b373043`) and Playwright coverage (`0a76e63df790977cd6ed0540233528e3102a7d9a`).
- **Landing V2.0:** optional proposal 8.25 has a first bounded slice: local text-only drafts keyed by existing chat ID, per-chat isolation, reload restoration, explicit-submit clearing and no auto-send. Limit: 100 chat entries; text is not silently truncated, and browser quota failures are surfaced. Attachments remain in memory and are not persisted.
- **Verification:** Playwright regressions authored for per-chat draft recovery, sidebar touchcancel/pointercancel, and chat pinning/date sorting. The last exact-head workflow-run lookup and combined status on docs checkpoint `c7409e86030496cabd2e4bfd88f5bb68e92a66a3` returned no records; no test pass is claimed. Recheck after this orientation commit.
- **Existing gates:** Quality #1250 passed on code HEAD `f3151472e285c7d31d46809f52337202eb15e6b3`; Quality #1252 and Provenance #976 passed on documentation HEAD `63f429ccf16fe7648519ebb3ecc02b9f8949ad53`. Those results predate this draft change and do not verify it.
- **Architecture:** static HTML/CSS/vanilla JS + Jekyll/GitHub Pages and existing FastAPI gateway only. No new runtime/dependency/route/provider. Preserve local-first data, project/chat isolation, secret redaction and explicit consent.
- **Next:** verify 8.21 pinning/date-sort E2E and the draft/sidebar regressions on exact HEAD; continue the remaining mandatory UI 8.1–8.17 with code/test evidence, then optional proposals 8.18–8.27. Keep screenshot/iPhone Safari/VoiceOver/WCAG gates visible. No merge/deploy.


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


### Landing UI V2.0 — memory hierarchy and accordion persistence (2026-10-31)
- Reordered memory settings to show shared-memory records first, personal-memory records second, and the private-memory context opt-in checkbox last. Corrected the Russian shared-memory help label.
- Sidebar close continues to collapse only the memory settings/help disclosures; added E2E assertions that the project list, “Без проекта” group and Chats disclosure retain their state.
- UI code commit `a541932307c764e56f81b795b940785839128338`; E2E update commit `64cfa3abfd1750751951cf1715502e7ca3409ce4`.
- JavaScript syntax parsing passed; Playwright/Chromium has not been executed and no passing CI result is claimed.


### Landing UI V2.0 — project-to-chat context handoff (2026-10-31)
- Added a project-settings action that lists existing chats and queues the selected project's context for the chosen chat's next request. It does not create a chat or alter chat/project membership; it respects the five-project request-context cap and consumes the handoff on successful send.
- Found and corrected a malformed `querySelector` for the handoff button that otherwise left the button disabled and could break `renderProjectUI()`.
- Added E2E coverage for handing off to a non-current chat, unchanged current chat/count/membership, and one-shot context consumption. Syntax parsing passed; browser E2E and exact-head CI remain unexecuted.
- UI fix commit `c3855c28317c5b481d59b463e4d4cb985d992dcd`; E2E commits `ccb76ea689ddb0ad6ef8d580dee06148aab6f94f` and `24004fe48e506a7d1a7e03b1538f3faed209381b`.

### Landing UI V2.0 — navigation, modal and readability follow-up (2026-10-31)
- PR #131 remains the sole V2 UI workstream; V1 in main is untouched. No merge or deployment.
- Implemented browser Back/Escape navigation for nested project filters and modal dialogs; modal focus trapping/return and scroll lock now share one lifecycle.
- Project settings can explicitly hand off context to an existing chat for its next request. The handoff does not create a chat or change project membership; it remains session-only until sent.
- Expanded message view keeps copy/speech actions with accessible names; speech is hidden for user messages. Status/toast states are semantic and restrained; high-contrast text covers secondary, disabled, link, error and status content in both themes.
- Added Playwright coverage for Back navigation, modal repetition, handoff, message viewer controls, status states and contrast tokens. Exact-head Chromium/CI has not run; do not claim these tests passed.
- Next: obtain exact-head Quality/Chromium results, fix any regressions, then complete native iPhone Safari/VoiceOver/long-press review.

### Landing UI V2.0 — browser Forward restoration (2026-10-31)
- Browser history now stores nested project-filter and modal entries. Back closes/restores the previous level; Forward reopens the saved filter/modal; Escape uses the same stack.
- Added Playwright assertions for Forward after project-filter and project-settings Back. E2E/Chromium has not been run on the exact head.
- Keep PR #131 open and unmerged. Next: exact-head Quality/Chromium and native iPhone Safari/VoiceOver review.


### Landing UI V2.0 — aServi terminology checkpoint (2026-11-01)
- Renamed primary self-hosted server route action identifiers and JavaScript handlers to aServi terminology; updated app markup, Playwright selectors and static Quality Sentinels assertions.
- Updated the settings group/card label to `aLandi aServi`; Cloudflare remains unchanged as a separate provider/infrastructure brand.
- Preserved legacy `ai_alandi_cloud_*` localStorage keys deliberately for existing installations; they are compatibility identifiers, not user-facing product names.
- No merge/deployment. Verify exact-head Quality/Chromium after the source batch.


### Landing UI V2.0 continuation — 2026-11-01
- Active work remains PR #131 on `feat/landing-v1-accessibility-responsive-20261031`; latest code/test checkpoint: `d65102ed5a9ba3c30586d8a52efbd5603a009e23`; latest PR branch head before this state update: `5bfc48ada9ccecf5df2beb160bae7042d2481ac6` (subsequent commits are documentation-only).
- aLandi Cloud route naming was replaced with aLandi aServi across the UI, DOM actions, JS handlers, tests and active docs. Legacy `ai_alandi_cloud_*` localStorage keys are intentionally retained as compatibility keys. `aLandi aCloudi` is only a future storage name; Cloudflare remains unchanged.
- Extracted 48.1 KB app CSS and 10.4 KB landing CSS to cacheable assets; app HTML reduced 109.3→61.3 KB, landing HTML 26.1→15.8 KB. Marked and DOMPurify now load in ordered `defer` before app.js.
- Prior Quality #1126 (SHA `7cdf35d`) remains the last observed Chromium failure (101 pass/18 fail); corrected fixtures and selectors are committed but exact-head rerun is not available through current tool actions. Latest observed provenance pass predates current head.
- No branch/file cleanup performed: PR #132 is an active continuity backup and PRs #125–130 include explicit future/hold workstreams. No merge, rebase, force-push or deployment.
- Next: finish source audit and arrange exact-head Quality/Chromium; inspect current diagnostics before marking 8.1–8.17 complete. Native iOS Safari/VoiceOver and measured WCAG remain manual.

- Current main comparison: PR branch is 415 commits ahead / 4 behind (merge base `e78a73b`); all four main-side commits touch only `docs/V1_UI_FINALIZATION_RU.md`, overlapping the V2 unified backlog edits. No code-file conflict was identified. Keep the PR open; do not rebase or merge without owner approval.

### Final source checkpoint — 2026-11-01
- UI source/test checkpoint: `d65102ed5a9ba3c30586d8a52efbd5603a009e23`; documentation-only follow-up through branch head `24e22d780c4a8311d5ea28ed96bbd78302e25414`.
- Latest compare at that checkpoint: 430 commits ahead / 4 behind main; the only main-side changed file is the shared `docs/V1_UI_FINALIZATION_RU.md`. No code-file conflict identified; no merge/rebase performed.
- Exact-head Quality/Chromium remains pending; last observed Chromium result is stale run #1126 (101 passed, 18 failed). No passing browser run is claimed.


### Current continuation checkpoint — 2026-11-02

- PR #131 remains the sole Landing V2 implementation branch, open and unmerged. Live PR head at this checkpoint: `ec7625c98a36f1d54a190da695391244e5eecdd3`; compare against `main`: 486 ahead / 4 behind, merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`. Four base-side commits overlap only the shared UI finalization checklist; do not rebase, merge, or overwrite that document automatically.
- App identity cleanup: root Jekyll title and browser title now say `aLandi — личная AI-среда`; the app has a concise description and declares both `dark light` color schemes. Quality Sentinel and E2E assertions are added; browser execution is still pending.
- Code/test checkpoint: `b6b4cd612e288f0ad2c0e23419a562b06b491ef5`. V8 syntax parsing passed for `assets/js/app.js`, `tests/e2e/app.spec.mjs`, and `scripts/quality-agents.mjs` (imports/shebang adapted for the parser); CSS brace balance is zero. These are source checks, not a Playwright/Quality run.
- Current PR head has no pull-request workflow runs visible. Last observed Chromium run #1126 is stale evidence (101 passed / 18 failed) on an older SHA. Do not treat it as current.
- The aServi rename remains consistent in active V2 UI/docs. Only the legacy `ai_alandi_cloud_*` localStorage keys remain, intentionally, for backwards compatibility. Cloudflare is unchanged; `aLandi aCloudi` remains reserved for a separate future storage product.
- Repository hygiene is scheduled for the next major-slice boundary and governed by [docs/REPOSITORY_HYGIENE_RU.md](docs/REPOSITORY_HYGIENE_RU.md): inventory branches against open/closed PRs and ancestry, review workflows/artifacts/dependencies/docs and repository security settings, then perform only evidence-backed cleanup. No branch/file deletion, rebase, force-push, merge or deployment has been performed.
- Next: finish the source/documentation reconciliation, refresh the parallel documentation safety copy in PR #132, then run exact-head Quality/Chromium and diagnose only confirmed failures. Native iOS Safari/VoiceOver and full component-level WCAG review remain manual gates.


### GitHub repository hygiene — первичная инвентаризация 2026-11-02
- API перечислил 126 веток и 9 открытых PR (#124–#132); 117 веток вне head открытых PR требуют индивидуальной проверки PR/issue/ancestry/reference. Ни одна ветка не удалялась.
- Rulesets: 0; classic protection `main` не удалось проверить (403), поэтому статус неизвестен. Автоудаление веток после merge выключено.
- CODEOWNERS, SECURITY.md и Dependabot config не найдены в стандартных местах; фактические security alerts/settings не проверены.
- На PR #131 HEAD на момент аудита Provenance #41336870473 прошёл; exact-head Quality/Chromium отсутствует. Quality #1126 (101 passed / 18 failed) относится к старому SHA.
- Подробности и безопасный план: `docs/REPOSITORY_HYGIENE_RU.md`. Удалений, изменений настроек, merge/rebase/force-push или deployment не выполнялось.


### CSS source cleanup — 2026-11-02

- Removed 504 bytes of CSS declarations that were overridden by later theme-token rules; effective font, focus, theme surface, settings shadow and backdrop behavior are preserved.
- CSS brace balance is zero. No browser visual verification is claimed; include this change in the next exact-head Quality/Chromium run.



### Latest PR #131 source/docs snapshot — 2026-11-02
- PR #131 HEAD at this checkpoint: 77fdee629c2ef47e35fdd2d39d39070c89de53b6; compare to main: 499 ahead / 4 behind; merge base e78a73b25725bfa63370d9946887cbbacbf51b82.
- Latest code/source checkpoint: 9679ed4d7974849f3fd02dcf8465384c8c59a9df. The CSS cascade cleanup removed 504 bytes of overridden declarations; metadata and test contracts remain as previously recorded.
- Exact-head Quality/Chromium workflow lookup returns no runs. Browser behavior is still unverified; do not treat old #1126 output as current.
- The independent PR #132 backup now carries the implementation ledger, aServi terminology reconciliation and repository-hygiene runbook.


### aServi compatibility guard — 2026-11-02
- The source now documents why ASERVI_STORAGE intentionally retains ai_alandi_cloud_* keys. They are persistence contracts, not UI naming; do not rename them without a migration plan.



### UI scope and Graphify continuation — 2026-11-02

- Owner scope is the integrated UI queue: applicable unfinished requirements from sections 1–7 plus 8.1–8.17, tracked once in section 8.0. Old V1 checkboxes are historical; completed/obsolete items must not be reopened.
- Canonical requirements: `docs/V1_UI_FINALIZATION_RU.md`; concise mirror: `docs/LANDING_UX_POLISH_BACKLOG_RU.md`; technical evidence: `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md`.
- Latest UI source checkpoint and PR #131 head: `fed3137bae2355629a976515719f498940ad8601` (accessible notification queue slice).
- Graphify Code-Only Pilot now watches extracted app JS/CSS and landing HTML. Its run/artifact is not yet confirmed; do not use stale graph metrics as current architecture evidence.
- PR #131 remains open/unmerged and reports dirty/diverged against main. Do not rebase or merge until the four base-side commits and conflicts are inspected. No deployment.
- Next: execute focused Playwright and exact-head Quality/Chromium for the notification slice; continue inherited UI + 8.1–8.17 acceptance, then implement durable operation states/IDs. PR #131 only; no PR #132 edits.


### Repository hygiene inventory — 2026-11-02
- Inventory snapshot: 126 branches; 9 open PRs (#124–132); 100 closed PRs inspected. All 19 closed-but-unmerged PR branches reviewed have ahead > 0 and are preserved.
- Five no-PR branches are confirmed behind-only with no exact-name code/PR references: feat/alandi-helper-model-routing; feat/rag-rrf-engineering-audit-rebased-20261027; fix/provider-model-catalogs-v2; fix/pyodide-setup; fix/theme-persistence-e2e-isolation. They are recorded as deletion candidates in docs/REPOSITORY_HYGIENE_RU.md.
- future-workstreams/parking-base-20261031 is intentionally reserved and retained. Other no-PR branches with ahead > 0 are retained for separate triage.
- No branch/file deletion performed: GitHub integration has no branch-delete action; no confirmed unused file was found. SECURITY.md added in both PR branches; main still lacks it until merge. CODEOWNERS deferred pending an independent reviewer; Dependabot config deferred while PR #124 adds uv.lock. Repo security settings are not readable through current integration and remain owner-manual checks.


### Notification queue implementation — 2026-11-02
- Latest PR #131 HEAD must be read from live PR metadata; source checkpoint for the notification slice: `fed3137bae2355629a976515719f498940ad8601`.
- Extended the existing toast with FIFO queueing, duplicate suppression, urgency-based durations, pause on hover/focus/hidden tab, and status/alert live-region semantics. Added Playwright assertions for sequential success/error notifications.
- This is a partial 8.19 presentation/accessibility slice; durable operation state/IDs, pending-to-result updates, persistent errors and inline recovery actions remain unimplemented.
- Exact-head workflow/status lookup returned no PR workflow runs or commit statuses. Browser tests were not executed; no pass is claimed.
