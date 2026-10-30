# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Current working checkpoint — 2026-10-30

- **Current main SHA:** 2bda22229cba3576628f92c821bb6e1562d8abc5 — PR #120 aligned sidebar hierarchy, project/memory navigation and synchronized theme/language preferences. Its merge commit reports Chromium, published Pages smoke, Jekyll, integrity, security, context and Graphify checks passed; a separate combined-status query returned no status entries for this merge SHA, so do not invent run IDs.
- **Active UI branch:** feat/chat-settings-orthogonal-controls-20261030, tracked by the only open PR #121. Scope: orthogonal effort/search settings, Research Studio mode-only flow, separate private server card, project modal, mobile hit areas, free/static landing copy and staged future roadmap.
- **Latest changes on the PR branch:** repaired duplicate Settings close action, replaced a malformed regex-based provider group sentinel with deterministic string extraction, corrected the Research Studio E2E probe counter, added the living V1 UI release checklist, landing roadmap and reduced-motion coverage. These changes are not merged or deployed.
- **Latest exact-head Actions at the last check:** PR workflow run #40991938982 was pending on the then-current branch head. A documentation/test commit advances the head; consult the live PR checks before treating any run as final.
- **Open PR queue:** PR #121 only. Exact marker: open PRs (1): #121.
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
