# aLandi — START HERE

**Live GitHub is mutable truth.** Re-fetch main, PR queue, exact HEAD/checks and deployment before acting.

## Verified baseline — 2026-11-13

- **Current main SHA:** `9033c6ad708a993cba5d1b27442f53651ad71c0f` — fix(ci/ui): align Pages contract and modal backdrop dismissal (#174), committed 2026-11-08.
- **Open PR queue:** 8 — #175, #176, #177, #178, #179, #180, #181, #182. **Open issue:** #111 (owner/environment release gates).
- Main Quality run #42430269155 and Pages deployment #42430269181 passed on the exact main SHA; Provenance #42430269144 passed. Graphify #42629163792 passed. Scheduled Freshness #43247857963 failed because its stored queue snapshot is stale (live PRs #175–#182).
- Exact-head PR evidence: #181 visible checks passed; #176/#177/#178 visible Chromium/Jekyll/security/integrity/context checks passed; #175 Chromium failed on Notebook/project isolation timeout; #179 Chromium and Freshness failed on project-scope timeout and stale snapshot; #182 Chromium failed on personal/project selection; #180 Integrity failed and Chromium was cancelled. Re-fetch all checks before any integration decision.
- The eight PRs are not eight independent main-ready changes: #179/#182 are stacked on older #175 state; #180 is stacked on older #179 state. #175 is the main-based UI/Notebook workbench; #177 is a main-based Browser Local workspace candidate; #178 is landing content; #176 is a docs audit; #181 is action-pinning security.
- Public Pages is current on main SHA above. VPS/Tunnel/Ollama, installed model weights, target-host hardware, native iPhone/VoiceOver, real connector credentials and voice-device quality remain unverified.

## Current owner priority

- Primary programme: `LANDING-V2-2026-001`, canonical scope in `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` section K.
- This 2026-11-13 owner directive supersedes the older “post-landing / deferred” status for full agents, connectors, local coding, voice, full RAG, parsers/converters and observability.
- Required Functions panels: **Deep Research, Agents, Skills, Connectors** — each must open independently and contain only real, tested capabilities.
- Mandatory outcomes also include a secure local-file coding workspace, actual agent runtime with live states, installed Whisper/ASR + TTS/VAD, full RAG, document/book/web scanners and converters, tested mode combinations, lean conditional helper-model routing, cache/observability/N₂O in main, and a detailed owner runbook.
- Do not call a model “selected” until the exact model/revision, quantization, license, weight size, RAM/VRAM, serving API, alternatives and target-hardware benchmark are recorded. `qwen3.5:4b` is currently an example in the runbook, not a final owner decision.

## Next execution order

1. Reconcile the eight open PRs against exact base/head/diff/dependencies/checks. Keep main as the only durable baseline; target main plus at most one active landing/product PR. Merge only compatible exact-head green slices; close other PRs only after preserving useful work and recording a disposition.
2. Finish the owner-designed UI and four-panel Functions surface, folding compatible #175/#177/#178 work into one coherent tested slice.
3. Research/freeze the actual model, helper, speech, OCR/parser, retrieval, API, database and download/size plan against the 8-GB reference profile and actual target hardware.
4. Build the real AgentRun/tool/sandbox layer and mandatory local coding workspace; then complete full RAG, ingestion/converters, connectors and installed voice pipeline in bounded, evaluated slices.
5. Finish mode/feature compatibility, efficiency, cache, observability and N₂O; merge to main and verify exact-SHA Pages and private runtime separately.
6. Deliver the tested owner setup manual from account/server registration to successful server-backed use. Keep issue #111 open until owner/environment evidence exists.

## Canonical navigation

- Handoff: `OLEDUE.md`; executor contract: `AGENTS.md`; orchestrator: `PROJECT_ORCHESTRATOR_RU.md`.
- Task order: `docs/MASTER_TASK_REGISTRY_RU.md` + append-only `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md`.
- Systems: `docs/ALANDI_SYSTEMS_MAP_RU.md`; detailed code map: `docs/ALANDI_ARCHITECTURE_MAP_RU.md`.
- Release gates: issue #111. VPS/Tunnel/Ollama and actual provider/device/credential conditions are not proven by Pages CI.
