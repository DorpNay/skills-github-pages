# aLandi — START HERE

This is the short entry point for an assistant or engineer. Use the detailed navigation index at `project-reference/FILE_ORIENTER_RU.md`, the machine-readable state at `docs/PROJECT_STATE.yaml`, and the chronological log at `docs/VOLLEY_LOG.md`.

## Verified repository checkpoint — 2026-10-29

- **Current main SHA:** `80597f61c000d691e95d67893edea60e75da1033` — PR #113 pinned GitHub Actions to immutable SHAs; post-merge Quality Sentinels #40915070855 and Pages deployment #40915070655 succeeded on this exact SHA.
- **Latest functional UI baseline:** `ed2c4c7ee3a67c7a0cf5b541c1ab6206609dd32c` — modal scrims and inert outside-tap behavior (PR #115). PR #114 added an empty-by-default user system prompt and context-budget headroom; PR #71 stabilized mobile composer docking.
- **Merged and verified on exact PR heads:** #113 immutable GitHub Actions pins; #115 modal scrims/outside-tap UX; #114 prompt default/context budgeting; #71 mobile composer; #84 CORS canonicalization; #81 deployment preflight; #83 SQLite delta; #82 readiness audit; #106 RAG evaluator; #107 private/shared memory; #108 launch page/runbook.
- **Latest main CI:** Quality Sentinels [#40915070855](https://github.com/DorpNay/skills-github-pages/actions/runs/40915070855), Pages deployment [#40915070655](https://github.com/DorpNay/skills-github-pages/actions/runs/40915070655), Gateway Tests [#40915070886](https://github.com/DorpNay/skills-github-pages/actions/runs/40915070886), provenance [#40915070933](https://github.com/DorpNay/skills-github-pages/actions/runs/40915070933) and Graphify [#40915070939](https://github.com/DorpNay/skills-github-pages/actions/runs/40915070939) succeeded on exact main SHA. This is not proof of a live VPS deployment.
- **Open PR queue:** none at the state-refresh baseline; verify the live queue before acting.
- **Open issue queue:** only #111 remains; it tracks owner/live-host release gates. Research-only issues #88–#92 and #96–#104 were closed after transferring unresolved actions to #111.
- **Runtime boundary:** GitHub Pages browser smoke is verified; live VPS/gateway, Ollama model performance, voice artifacts/device playback, OAuth credentials and target-host measurements remain unverified.

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
