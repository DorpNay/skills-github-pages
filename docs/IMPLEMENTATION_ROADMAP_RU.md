# aLandi — инженерная дорожная карта и критерии готовности

**Срез:** 24 октября 2026. Это execution plan, не обещание, что все функции уже доступны. Источники: [PROJECT_STATE](PROJECT_STATE.yaml), [V-016 ledger](V016_IMPLEMENTATION_CHECKLIST.md), [Coder Packet](CODER_PACKET.md), [Superstack](SUPERSTACK_FINAL_RU.md), [multimodal stack](MULTIMODAL_MODEL_STACK_RU.md), [memory/knowledge](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md), [accepted improvements](ACCEPTED_IMPROVEMENTS.md), [evaluations](../EVALS.md).

## Правило выпуска

Каждый этап проходит: **код → regression/E2E → security/resource checks → PR → merge → post-merge Pages/CI → PROJECT_STATE update**. UI preview, mock API и CI не считаются live gateway, live ASR/TTS или измерением на 8 GB VPS. Не активировать cloud flags и не загружать модели/ключи без явного owner setup.

## Очерёдность

### P0 — клиентская эргономика и восстановление (PR #33 merged)

**PR #33:** [chat row actions + composer](https://github.com/DorpNay/skills-github-pages/pull/33). Merge commit `05f4c2454c279cc21dcbf08c83ff3c3025838257`. PR-head run #374 passed context, integrity, security, Jekyll, Chromium E2E and published Pages browser smoke. Post-merge run #377 is pending.
- Chat row: menu ⋯ right → Rename / Clone / Move-to-project / Extract / Delete; deletion confirm.
- Glass menu: blur/saturation, contrast, fallback without transparency; reduced-motion/transparency.
- Composer: mobile 16px; no disabling browser zoom. Real-device keyboard open/close, landscape, focus and screen-reader checks remain open.
- Follow-up: replace native prompt for rename/project selection with an accessible in-app dialog/select; test project move/detach, localStorage persistence, mobile viewport and all RU/EN labels.
**Gate:** PR-head checks passed. Remaining release gate is post-merge Pages workflow plus real-device accessibility/mobile review.

### P1 — real voice message (самый короткий полезный вертикальный срез)

1. UI states: permission → recording → pause/stop → preview → discard/send; duration/size cap; clear mic denial and unsupported-browser state.
2. Capture: browser MediaRecorder only after explicit click/tap permission. Store temporary Blob in memory; revoke object URL and release mic tracks on stop/cancel/page exit.
3. Transcription: define one backend audio contract and choose a licensed model after language/device benchmark. Keep raw audio local unless user chooses cloud. Transcript editable before sending; preserve timestamps/confidence where available.
4. Send: audio file upload endpoint must validate MIME, size, duration, timeout and auth; server temp storage TTL; never log audio; deletion/cleanup tests.
5. Add tests for permission denied, cancel, empty clip, oversized clip, upload failure, transcript correction and no duplicate send.
**Gate:** real browser microphone E2E on supported browser, RU + EN + Thai eval, license/hash manifest, measured latency/RTF/RAM on target hardware. No “voice message ready” until endpoint and real device test exist.

### P2 — live voice dialogue

- Reuse the voice-message capture/transcription path; add streaming ASR events, VAD, TTS playback queue, interruption/barge-in, turn state and device routing.
- Start with one ASR and one TTS candidate; no model zoo. Candidate ASR: Qwen3-ASR (RU/EN/Thai) or Vosk/Moonshine after license + hardware evaluation. TTS exact voice licensing must pass; no default Piper/Silero commercial assumption.
- Voice pipeline: capture → VAD → ASR partial/final → turn router → gateway/model → text/audio response → playback; add cancellation and echo handling.
- **Gate:** audio quality corpus, cold/warm RTF, p50/p95 TTFA and turn latency, PSS/RAM, no runaway model/queue, interruption tests, artifact hashes/license. Target numbers in LATENCY_CONTRACT are budgets until measured.

### P3 — files, knowledge and RAG

- Replace current text-only attachment with upload staging and explicit supported-type picker.
- Ingest pipeline: MIME sniff + size/page/time limits → parser → text/table/image extraction → chunk with page/offset/source hash → preview → confirm index.
- Stage 1: TXT/MD/CSV/JSON/LOG; then PDF and DOCX; XLSX tables/formulas; images OCR; audio transcription; video keyframes/transcript only after worker contract.
- Backend: SQLite FTS5 first; precise citations to file/page/offset/hash; scoped project/global retrieval; source list, reindex, delete, export and deletion propagation.
- Dense embeddings/reranker only if Russian/English evaluation shows measurable Recall@k lift and acceptable CPU/RAM.
**Gate:** adversarial file/parser tests, zip-bomb/oversize/timeout, prompt injection treated as data, citations verified against source, project isolation, deletion/backup/WAL cleanup.

### P4 — image and video generation / understanding

- Separate **image understanding/OCR**, **image generation**, **video understanding**, and **video generation** interfaces; don't treat attachments as generation.
- **Image:** OpenAI's current API guide documents Image API generations/edits and image_generation in Responses API. This is a separate API from our OpenAI-compatible chat completion; implement a server-side adapter/proxy, never put provider secret keys in public Pages/localStorage. Org verification may be required. Reference: [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation).
- **Video:** OpenAI Sora 2 and Videos API were shut down on **2026-09-24**; OpenAI says there is no one-to-one replacement API. Do not implement against the retired endpoint. Current API candidates discovered in official docs: [Runway Gen-4.5](https://docs.dev.runwayml.com/guides/using-the-api/) (async tasks, text/image-to-video), [Luma Ray 3.2](https://docs.agents.lumalabs.ai/guides/videos/) (video generate/edit/reframe), and [Google Veo 3.1 on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation) (long-running operation; requires Google Cloud project/permissions/billing). Choose one after account access, price, region, data terms and output quality are compared; don't code all three.
- 8 GB CPU VPS is gateway/text target, not assumed image/video inference host. External generation is explicit opt-in; local ComfyUI requires separate measured GPU/host.
- Video understanding MVP: upload → validate → extract bounded frames/audio → summarize with timestamps → cite source. Generation remains separate asynchronous job: submit → poll/webhook → download → retention/delete.
**Gate:** one end-to-end task per modality, account/key setup, cost/limits, safety policy, artifact provenance, delete controls and real provider runtime.

### P5 — agent teams and research

- Implement lightweight role profiles, not dozens of concurrently loaded models. Default: orchestrator + 1–3 roles for ordinary tasks; 3–7 for research only within token/time/tool budgets.
- Research flow: classify → bounded plan → retrieve/fetch → extract claims/evidence → dedupe → contradiction/gap check → critic → cited answer → URL validation.
- Use DAG with explicit dependencies, bounded fanout, timeout/cancel, idempotency, retry only transient/tool-specific; each subagent returns schema: answer, evidence refs, uncertainty, unresolved gaps, resource usage.
- Keep context isolated per project; share only scoped evidence IDs and bounded summaries. Offload >8k-character tool output to TTL scratch artifact; no hidden chain-of-thought or arbitrary shell.
- LangGraph is the selected orchestration candidate in Superstack; don't add competing frameworks until one adapter and eval gate passes.
**Gate:** golden tasks, claim citation coverage, source diversity, route regret, tool error/retry budget, total tokens/latency, cancellation, project leakage and injection tests.

### P6 — memory, personalization and security

- Formal prompt composer: safety → workspace → project → profile → current user; project instructions are preferences, never higher-priority policy.
- Memory lifecycle: candidate → review/confirmed/disputed/superseded/rejected; scope conversation/project/global; provenance and expiry; user review/edit/export/delete.
- Server graph remains opt-in until authenticated UI, migration/backup, cross-project tests and full deletion propagation are proven.
- Browser/CLI tools remain disabled until isolated worktree/container, origin allowlist, credential broker, user approval, seccomp/Landlock and adversarial escape tests exist. subprocess.run alone is not a sandbox.
- OAuth connectors: PKCE, least scopes, encrypted server token storage, revoke and source-index cleanup; no refresh tokens in localStorage.
**Gate:** threat model, injection/SSRF, permissions, audit trail, cross-scope isolation, rollback and destructive confirmation.

### P7 — provider/model reliability and operations

- Model catalog freshness and real provider probe per configured provider; provider-specific API/response contracts; exact errors retained.
- Bounded same-provider model fallback only for classified model-not-available errors; never fallback on auth, quota, network or generic server failure. Cross-provider fallback explicit opt-in.
- Gateway: auth, CORS exact origin, body/context limits, concurrency=1 initially, timeout, exact cache key invalidation, SSE error semantics, request IDs and safe metrics.
- Deployment: VPS baseline, Ollama private bind, gateway loopback, Tunnel only public route, restart/backup/rollback, cache stats.
**Gate:** unit/contract tests, live probe only with owner's explicit configured key, gateway integration tests, reboot test, secret scan and hardware report.

### P8 — learning and release governance

- “Self-improvement” is versioned proposals/skills/evals; no self-modifying production code or autonomous merges.
- Every improvement gets baseline, hypothesis, golden/adversarial cases, rollback, resource budget and acceptance threshold.
- Update EVALS + PROJECT_STATE + accepted improvements on every merge. Promote only if reproducible improvement and no regression in safety, latency, context, privacy or resource limits.

## Что владельцу делать после merge client UI

1. Open [START_HERE_RU.md](START_HERE_RU.md).
2. Complete the detailed setup guide section 2→11 on your own VPS (or first run its baseline checks on existing host).
3. Send only non-secret outputs: OS, RAM/disk, service active/inactive, health HTTP code, model ID, cache MISS/HIT, Tunnel Healthy.
4. Do not send API keys, Tunnel tokens, env files, OAuth tokens or private logs.
5. We can then activate the gateway and verify a real completion; until then, local/provider/runtime statuses remain **unverified**.
