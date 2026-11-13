# aLandi — START HERE

**Live GitHub is mutable truth.** Re-fetch main, PR queue, exact HEAD/checks and deployment before acting.

## Verified baseline — 2026-11-13

- **Current main SHA:** `fc0fd26b099088f419c5391e5e23b692bab9e50f` (checkpoint parent for this atomic state-refresh correction). The resulting commit will be the new live main HEAD; fetch it on resume.
- Open PR queue: 0. **Open issue:** #111 only (owner/environment release gates).
- PR #185 model/runtime artifact pack merged at `f1fc73783a46bf38014acd0a8019914d5a3f14d4`; PR #184 Browser Local Coder workspace merged at `f7cc9a4b878d995d46a6df7cb4af9d5e60d16e00`; PR #176 research ported at `e79e70db61255755c26ebb4a0ceaad55688b0a4c`. #175/#178/#179/#180/#182 closed with dispositions; branches retained.
- Model artifacts: external run #43417527347 (6,054,440,341 bytes) and Ollama run #43417305393 (7,728,830,475 bytes), total 13,783,270,816 bytes; expire 2026-12-13. Downloaded and SHA-verified in Actions, not installed. Main uncensored primary checkpoint owner-supplied and excluded.
- Exact previous main checks: Quality #43419102024 PASS and Freshness #43419101988 PASS on `3c57595e6032a9b69553e23848fbaddd1fa7973e`. Quality #43420046546 is running on this parent; Freshness #43420047399 failed because ORIENTER contained the prior SHA. This correction restores the exact marker; rerun Freshness on resulting main SHA.
- Runtime boundary: target host OS/architecture, disk, RAM/VRAM, Ollama service, Piper/Whisper/OCR install, model template, API smoke tests and RU/EN/TH quality remain unverified. Browser Local is implemented; sandboxed CLI and real Connector registry remain open.

## Current owner priority

- Primary programme: `LANDING-V2-2026-001`, canonical scope in `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` section K.
- This 2026-11-13 owner directive supersedes the older “post-landing / deferred” status for full agents, connectors, local coding, voice, full RAG, parsers/converters and observability.
- Required Functions panels: **Deep Research, Agents, Skills, Connectors** — each must open independently and contain only real, tested capabilities.
- Mandatory outcomes also include a secure local-file coding workspace, actual agent runtime with live states, installed Whisper/ASR + TTS/VAD, full RAG, document/book/web scanners and converters, tested mode combinations, lean conditional helper-model routing, cache/observability/N₂O in main, and a detailed owner runbook.
- Primary candidate is source-pinned, not production-selected: HauhauCS Qwen3.5-4B-Uncensored Q4_K_M. Its main checkpoint is excluded for owner upload. Auxiliary artifacts are now downloaded and SHA-verified in GitHub Actions; target-host installation, template/license review, RAM and same-host RU/EN/TH/API tests remain pending.

## Next execution order

1. Download the verified Actions artifacts to governed storage before 2026-12-13; inspect the actual target host (OS/architecture, free disk, RAM/VRAM, CPU/GPU) before installing anything.
2. Continue on main with the owner UI and four independent Functions panels: Deep Research, Agents, Skills, Connectors. Use retained old branches only as source material; no PR is open.
3. Build the API/provider/library/database inventory required by section K.2; keep current installed vs optional dependencies explicit and avoid speculative installs.
4. Implement the genuine AgentRun runtime and sandboxed Coder execution only after threat model, permissions, cancellation, quotas and escape tests.
5. Complete full RAG, safe ingestion/OCR/converters, connectors, installed RU/EN/TH voice, mode matrix, efficiency, cache, observability and N₂O in bounded tested main commits.
6. Complete P7 owner runbook and real-host end-to-end verification. Keep issue #111 open until owner/environment gates are evidenced.

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


## API/runtime inventory checkpoint — 2026-11-13

- Provider registry, 19 gateway routes, Python/optional model dependencies, Ollama API surface and SQLite decision are summarized in `docs/ALANDI_SYSTEMS_MAP_RU.md`.
- Runtime/install status is machine-readable in `models/runtime-stack.lock.json`: artifacts verified, target installation not started.
- Next: obtain target host facts; then implement four Functions panels and a real Connector registry on main. Do not reopen stale PR branches.
