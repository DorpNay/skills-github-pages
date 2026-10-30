# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Current working checkpoint — 2026-10-30

- **Current main SHA:** 2bda22229cba3576628f92c821bb6e1562d8abc5 — PR #120 aligned sidebar hierarchy, project/memory navigation and synchronized theme/language preferences. Its merge commit reports Chromium, published Pages smoke, Jekyll, integrity, security, context and Graphify checks passed; a separate combined-status query returned no status entries for this merge SHA, so do not invent run IDs.
- **Active UI branch:** feat/chat-settings-orthogonal-controls-20261030, tracked by the only open PR #121. Scope: orthogonal effort/search settings, Research Studio mode-only flow, separate private server card, project modal, mobile hit areas, free/static landing copy and staged future roadmap.
- **Latest functional PR code head:** 6cbd915ee77dfafaba1de9867858b6633bed55fb. The current PR head may be newer because the checkpoint/orientation documents are being refreshed separately.
- **Latest verification:** check-run set on commit 44ea54ef2118de2eda88e2fa615e8e05e4b8f8e9 found one integrity assertion that expected older fallback-copy wording; the UI copy itself states that request text/context may be sent to another service. The sentinel now checks the actual wording. Project State Freshness also failed because the orienter/snapshot files were stale. A fresh exact-head run is required; do not treat the previous run as green.
- **Open PR queue:** PR #121 is the only active PR and is excluded from its own comparison. Exact marker: open PRs (0): .
- **Open issue queue:** issue #111 only. Exact marker: open issues (1): #111. It remains the consolidated owner/live-host release gate; do not close it just to clear the queue.
- **V1 UI source of truth:** docs/V1_UI_FINALIZATION_RU.md. The broader request history remains in docs/USER_REQUEST_CHECKLIST.md; whole-stack/deployment readiness remains in docs/PRE_LAUNCH_STACK_RU.md and issue #111.
- **Product boundary:** free static GitHub Pages UI ≠ free hosted inference. No hosted model endpoint is supplied. The first gateway remains a personal/limited setup; live VPS/Tunnel/Ollama, credentials, hardware, native iPhone Safari, voice/device, OAuth and real RAG corpus are not verified.
- **No deployment claim:** a PR branch or green CI does not imply the live landing/application or private gateway was deployed.

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

## Additional three-role audit — 2026-10-30

- **Canonical tracker:** `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`. Read it after this short orienter; it contains the full user task checklist, per-step completion markers, verified findings, research decisions and next actions.
- **Current PR HEAD at audit start:** `b09c1365e9d5f434b69ebb60bb285c7574051172`; main base `2bda22229cba3576628f92c821bb6e1562d8abc5`; compare reports 144 ahead / 0 behind.
- **Confirmed failure fixed in branch:** Gateway CI failed because `gateway/tests/test_coder_packet.py` used `canonical_action_digest` without importing it. Added the missing import in commit `f9d5afaae983675d2c616e3fbc70942840d314e5`. Re-run status is pending.
- **Exact-head evidence before fix:** Project State Freshness, Provenance, Dead Code Audit and Graphify passed; Lite Gateway Tests failed; Independent Quality Sentinels were still in progress. Do not mark all checks green until the post-fix SHA has completed every required workflow.
- **Research decisions:** book-to-skill upstream `virgiliojr94/book-to-skill` (MIT tool; source-book copyright remains separate) is a strong pattern for internal Knowledge-to-Skill. Graphify remains dev-only. Keep whisper.cpp/Piper baseline; benchmark LiveKit/Pipecat only as optional realtime voice runtime. Benchmark llama.cpp GPU offload against current Ollama before any migration.
- **Next:** inspect latest PR SHA and CI, then audit request/provider lifecycle, memory/RAG scopes, DAG/tools/security, voice, document extraction and landing. No file deletions until static + dynamic reference checks and rollback/CI roles are reviewed.

### Audit update — 2026-10-30
- Gateway test import fix is verified: Lite Gateway Tests run #483 passed after commit `f9d5afaae983675d2c616e3fbc70942840d314e5`.
- Graphify artifact #12956306584 inspected: 1,109 nodes / 3,103 edges / 53 communities; no import cycles detected. The Graphify workflow itself was cancelled during later branch updates, so only the artifact inspection is recorded as done.
- Dead-code report #389 contains one Vulture false positive: `BufferedTTS.synthesize_prefix(max_duration_ms)` is a protocol contract parameter. No deletions are authorized by this report.
- Voice capability gap: current UI has editable local transcription, one-message Piper playback and a half-duplex voice loop; selection-to-speech, multi-message queue, real-time streaming and native AEC/barge-in remain to implement/verify. See the detailed audit tracker.
- Current next: finish Quality/Chromium rerun; continue targeted module audit; update state after each verified stage.


### Owner addendum — voice, helpers, GPU and multi-agent (2026-10-30)
- Added P0 voice requirements P0-13…P0-18 and P1 helper/GPU/orchestration/Knowledge-to-Skill requirements P1-10…P1-17 in docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md.
- Voice scope gap: editable local ASR, one-message Piper TTS and half-duplex dialogue exist; selected-text TTS, multi-message queue, true streaming turn-taking and native AEC/barge-in remain to implement/verify.
- Moonshine Voice is strong for live streaming but currently listed STT locales do not include RU or TH; TTS includes RU, not TH. Keep Whisper for RU/TH; evaluate Moonshine only for supported locales with exact model license review.
- Agent orchestration candidates: OpenWOP v2 protocol, LangGraph checkpoint/interrupt, Temporal durable workflows. OpenWOP is not production-proven; no runtime adopted.
- Small helper candidates: Qwen3.5-0.8B for narrow low-risk classification/extraction; Granite-4.2-3B for tool-call experiments. Both require RU/EN/TH eval; no automatic model selection.
- Next: continue module/security audit and complete Chromium checks; see detailed tracker.