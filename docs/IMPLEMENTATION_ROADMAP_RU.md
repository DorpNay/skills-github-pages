# aLandi — инженерная дорожная карта и критерии готовности

**Срез:** 24 октября 2026. Это execution plan, не обещание, что все функции уже доступны. Источники: [PROJECT_STATE](PROJECT_STATE.yaml), [V-016 ledger](V016_IMPLEMENTATION_CHECKLIST.md), [Coder Packet](CODER_PACKET.md), [Superstack](SUPERSTACK_FINAL_RU.md), [multimodal stack](MULTIMODAL_MODEL_STACK_RU.md), [memory/knowledge](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md), [accepted improvements](ACCEPTED_IMPROVEMENTS.md), [evaluations](../EVALS.md).

## Правило выпуска

Каждый этап проходит: **код → regression/E2E → security/resource checks → PR → merge → post-merge Pages/CI → PROJECT_STATE update**. UI preview, mock API и CI не считаются live gateway, live ASR/TTS или измерением на 8 GB VPS. Не активировать cloud flags и не загружать модели/ключи без явного owner setup.

## Очерёдность

### P0 — sidebar, composer и контекст запроса (PR #35 merged; main CI and Pages deployment green)

**PR #35:** [Improve project sidebar, composer attachments, and request-scoped context](https://github.com/DorpNay/skills-github-pages/pull/35), branch feat/sidebar-composer-context-ergonomics-20261024. Ранее объединённые PR #33/#34 дают правое меню чата и доступный dialog для Rename/Move; PR #35 добавляет:
- Projects вверху, свернутый список проектов; под каждым проектом — только его чаты. Верхний Chats раскрыт и содержит только личные/непривязанные чаты.
- Создание личного чата из Chats и чата в проекте из меню самого проекта. Clear history находится в меню каждой строки вместе с Rename/Clone/Move/Delete.
- Память и инструкции в настройках проекта; режим project-only или project-and-global хранится на уровне проекта. Общая память по-прежнему требует отдельного opt-in.
- Две кнопки composer: + → «Фото или видео» / «Файл любого формата», ◎ → выбор до пяти проектов только для следующего запроса.
- Выбор контекста и вложения изолированы по ID текущего чата; контекст добавляется только к следующему запросу и очищается после успешной отправки.
- Голосовое меню открывается удержанием; обычный короткий тап не открывает его. Реальная запись/ASR/TTS этим изменением не добавляется.
- aLandi выделен в отдельную карточку основного маршрута; провайдерный список оставлен для внешних сервисов.

**Ограничения:** unrestricted file input — это только доступ к системному file picker. Читаемый текст прикладывается в текстовом виде; изображения отправляются как multimodal image_url; видео отправляет до трёх уменьшенных кадров (общий предел восемь кадров/изображений). Прочие бинарные форматы пока распознаются как неподдержанные и не отправляются. Нет ingestion PDF/DOCX/XLSX, OCR, audio transcription, live voice, video generation pipeline либо подключённых коннекторов/ручного skill picker.

**Gate (24 октября 2026):** PR-head run #418 passed context, integrity, security, Jekyll, all 48 Chromium E2E tests and published-site browser smoke; license/provenance and dead-code gates also passed. PR #35 merged into `main` at `23add2547a69df877b4baf213957827aa2e8e561`. Post-merge main Quality workflow #420 passed all five sentinels and all 48 Chromium E2E tests plus the live-site smoke; GitHub Pages deployment run #122 and provenance run #159 also succeeded for main checkpoint `4fb39df2cb0c23c907fc69b52c1ebf2e05e6024e`. The later status-only docs commit does not change app code. Real iOS/Android checks remain open: touch long-press/cancel, keyboard/viewport, screen reader and file handoff.

### P1 — real voice message (active implementation branch)

**Branch `feat/local-audio-transcription-v1` — pending CI/review, not merged or deployed.** Current slice adds:
- Browser MediaRecorder capture after explicit permission; cancel/stop, 120-second UI cap, 15 MiB cap, mic-track cleanup and clear permission/browser errors.
- Authenticated `POST /v1/audio/transcriptions?lang=auto|ru|en|th` with bounded raw audio body, allowlisted audio MIME types, local ffprobe duration check (max 120 seconds), timeout and temporary-file cleanup.
- Local-only `whisper.cpp` CLI adapter using argv (no shell), configured executable/model paths, no remote ASR request and no audio logging; disabled by default.
- Editable transcript inserted into the current composer; it is not automatically sent and raw audio is not saved to chat history.
- Authenticated `POST /v1/audio/speech` with local Piper CLI, bounded text/time/output and WAV validation; generated audio is returned to the browser without server-side retention. This is a local TTS adapter, not live voice dialogue.
- Assistant messages now expose copy/read-aloud actions and a native HTML audio mini-player. The player calls only the configured aLandi gateway; it does not use browser/cloud speech APIs.
- Contract tests and deterministic browser tests use mocked local runtimes, MediaRecorder and gateway responses.

**Still required before calling the feature ready:** run PR CI; test real supported browsers/devices and actual local whisper.cpp + model; measure RU/EN/Thai quality, cold/warm latency, RTF and RSS on the target host; verify binary/model provenance and licenses. The current browser test does not prove microphone hardware or model accuracy.

Next P1 work: add pause/resume and audio preview if useful, improve upload-failure recovery, add backend tests for over-duration/over-size/timeouts, and keep the endpoint off until local binaries/model are installed and evaluated. No external ASR API is used.

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
