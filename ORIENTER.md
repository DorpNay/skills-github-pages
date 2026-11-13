# aLandi — START HERE

**Live GitHub is mutable truth.** Re-fetch main, PR queue, exact HEAD/checks and deployment before acting.

## Verified baseline — 2026-11-13

- **Current main SHA:** `6a366125720453193c82a7385f8c088224a5928e` — fix(security): detect block-scalar action references (#181), committed 2026-11-13.
- **Open PR queue:** 8 — #175, #176, #178, #179, #180, #182, #184, #185. **Open issue:** #111 (owner/environment release gates).
- Main Quality run #43387599840 and Pages deployment #43387599298 passed on exact main SHA; Graphify #43387599792 passed. PR #181 is merged. Freshness must be rechecked against the new live queue (#175, #176, #178, #179, #180, #182, #184, #185).
- Exact-head PR evidence: #181 visible checks passed; #176/#177/#178 visible Chromium/Jekyll/security/integrity/context checks passed; #175 Chromium failed on Notebook/project isolation timeout; #179 Chromium and Freshness failed on project-scope timeout and stale snapshot; #182 Chromium failed on personal/project selection; #180 Integrity failed and Chromium was cancelled. Re-fetch all checks before any integration decision.
- The eight PRs are not eight independent main-ready changes: #179/#182 are stacked on older #175 state; #180 is stacked on older #179 state. #175 is the main-based UI/Notebook workbench; #184 is the Browser Local workspace recovery guard; #178 is landing content; #176 is a docs audit; #185 is a docs/infra model-artifact pack.
- Public Pages is current on main SHA above. VPS/Tunnel/Ollama, installed model weights, target-host hardware, native iPhone/VoiceOver, real connector credentials and voice-device quality remain unverified.

## Current owner priority

- Primary programme: `LANDING-V2-2026-001`, canonical scope in `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` section K.
- This 2026-11-13 owner directive supersedes the older “post-landing / deferred” status for full agents, connectors, local coding, voice, full RAG, parsers/converters and observability.
- Required Functions panels: **Deep Research, Agents, Skills, Connectors** — each must open independently and contain only real, tested capabilities.
- Mandatory outcomes also include a secure local-file coding workspace, actual agent runtime with live states, installed Whisper/ASR + TTS/VAD, full RAG, document/book/web scanners and converters, tested mode combinations, lean conditional helper-model routing, cache/observability/N₂O in main, and a detailed owner runbook.
- Primary candidate is now source-pinned (not production-verified): HauhauCS Qwen3.5-4B-Uncensored Q4_K_M. Main checkpoint is excluded from repository downloads for owner upload; auxiliary artifact manifest is in models/artifacts.manifest.json. Download/host evaluation remain pending. Do not mark production-selected until template/license review and same-host RU/EN/TH benchmark, RAM and API tests pass.

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


## Model stack acquisition checkpoint — 2026-11-13

- PR #185: docs/infra model-artifact pack, current exact HEAD must be fetched live from PR #185; base 6a366125720453193c82a7385f8c088224a5928e. Last verified PR #185 HEAD 90b6810b772a4f41450ee2f71f1fea78610ae70a passed all required gates; the final handoff-state refresh changes HEAD and requires one final exact-head run. No merge requested.
- Primary candidate: HauhauCS Qwen3.5-4B-Uncensored Q4_K_M, 2,707,513,696 bytes, SHA-256 pinned; intentionally excluded from the downloader for owner upload.
- External-cache payload pinned at 6,033,970,026 exact bytes before tokenizer/config overhead; includes Ollama v0.40.16 runtime archive, Piper 1.8.0 wheel, Qwen vision projector, reranker/ASR, Whisper, Silero VAD, Piper RU/EN voices and Tesseract RU/EN/TH. Ollama model store adds about 3,939,000,000 bytes for official Qwen3.5 base + Qwen3 embedding; total about 9.973 GB. Main uncensored checkpoint remains owner-supplied.
- Actual downloads are blocked in this execution environment by outbound DNS failure. The downloader and runtime lock are ready for a network-enabled workstation/server. See models/runtime-stack.lock.json and models/runtime-install.md. No artifact is claimed downloaded, installed or runtime-verified.
- Thai TTS is deferred: Piper 1.8.0 provides Thai phonemization but no official Thai voice; F5-TTS-THAI's base checkpoint is non-commercial.
