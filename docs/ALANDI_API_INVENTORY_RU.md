# aLandi — API, endpoint and capability inventory

**Source baseline:** repository main snapshot 6a366125720453193c82a7385f8c088224a5928e. This is a code inventory, not a claim that the VPS, public tunnel, credentials or optional services are live. Model artifact additions in the feature branch are identified separately below.

## 1. Gateway API — implemented routes

All protected routes use the gateway's ALANDI_API_KEY authorization. The service is intended to bind to loopback; the planned public access path is a Cloudflare Tunnel, not a public Ollama or gateway listener.

| Method | Route | Contract / current behavior | Maturity |
|---|---|---|---|
| GET | /livez | Process liveness only | Implemented |
| GET | /readyz | Probes the configured local Ollama API, including /api/tags | Implemented; depends on Ollama |
| GET | /healthz | Compatibility health response backed by readiness | Implemented |
| GET | /v1/capabilities | Reports enabled gateway capabilities and configured voice/model surfaces | Implemented |
| GET | /v1/models | Lists allowed Ollama model tags and local availability | Implemented |
| POST | /v1/chat/completions | OpenAI-compatible chat request/response; supports SSE streaming; gateway calls Ollama /v1/chat/completions | Implemented |
| GET | /admin/runtime | Reads Ollama process/model state via /api/ps and runtime metadata | Implemented |
| GET | /admin/cache/stats | Response-cache counters and cache configuration | Implemented |
| GET | /v1/memory/state/{conversation_id} | Reads bounded project/conversation delta state; not a general server-memory graph | Implemented, feature-flagged |
| POST | /v1/memory/delta | Stores a bounded state delta | Implemented, feature-flagged |
| DELETE | /v1/memory/state/{conversation_id} | Deletes scoped conversation state | Implemented, feature-flagged |
| POST | /v1/helpers/project-memory-suggestions | Optional helper-model suggestions; does not directly mutate memory | Implemented, helper disabled unless explicitly configured |
| POST | /v1/rag/ingest | Ingests text/document chunks into SQLite FTS5 and lexical graph structures | Implemented, feature-flagged; no vector embeddings |
| DELETE | /v1/rag/documents/{document_id} | Deletes a scoped RAG document and related lexical records | Implemented, feature-flagged |
| POST | /v1/rag/retrieve | Retrieves scoped lexical/FTS5 evidence with source metadata | Implemented, feature-flagged |
| GET | /v1/search/web | Uses configured SearXNG adapter and bounded public-source fallback | Implemented; live public-source coverage depends on provider/CORS |
| POST | /v1/documents/extract | Raw document body plus filename metadata; extracts supported text/office formats | Implemented, feature-flagged; no OCR |
| POST | /v1/audio/transcriptions | Raw audio body, language/content metadata; invokes configured whisper.cpp CLI + ffmpeg/ffprobe | Implemented, feature-flagged; offline transcription, not a streaming ASR server |
| POST | /v1/audio/speech | JSON text + configured voice ID; invokes Piper and returns generated audio | Implemented, feature-flagged; not a streaming TTS endpoint |

### Google OAuth / connector groundwork

| Method | Route | Contract / current behavior |
|---|---|---|
| POST | /oauth/google/initiate | Requires ALANDI_API_KEY; starts one-time PKCE transaction and returns Google authorization URL |
| GET | /oauth/google/callback | OAuth redirect callback; consumes one-time state/verifier, exchanges code, validates requested scope and stores encrypted token |
| GET | /oauth/google/status | Requires ALANDI_API_KEY; returns connection status, approved scopes and expiry metadata only |
| POST | /oauth/google/refresh | Requires ALANDI_API_KEY; refreshes stored Google token |
| POST | /oauth/google/revoke | Requires ALANDI_API_KEY; revokes provider token and deletes local token after successful provider response |

Current requested scope is Google Drive file-level access (drive.file). This is OAuth token storage and lifecycle groundwork only. No Google Drive list/read/write/search/download API route exists yet; do not call this a working Drive connector.

## 2. Current upstream/runtime API contracts

### Ollama — current gateway backend

- Base URL is configured by OLLAMA_BASE_URL and validated to the local loopback listener on port 11434.
- Readiness/model discovery uses GET /api/tags.
- Runtime state uses GET /api/ps.
- Optional helper suggestions use POST /api/chat.
- Main generation uses POST /v1/chat/completions and SSE streaming.
- ALANDI_ALLOWED_MODELS is an exact allowlist; default is qwen3.5:4b. ALANDI_HELPER_MODEL is empty by default.
- This is an Ollama-specific adapter, not a generic OpenAI-compatible provider abstraction.

### Important llama.cpp compatibility boundary

llama.cpp server exposes an OpenAI-compatible /v1/chat/completions endpoint and supports a separate mmproj file for multimodal GGUF inference. However the current gateway is not interchangeable by changing OLLAMA_BASE_URL: configuration rejects non-11434 ports and readiness/model/admin/helper paths call Ollama-specific /api/tags, /api/ps and /api/chat routes. A future llama.cpp backend needs an explicit provider adapter and health/model/runtime mapping; do not point the current Ollama config at port 8080 and expect it to work.

Official references:
- Ollama import: https://docs.ollama.com/import
- Ollama API: https://docs.ollama.com/api
- llama.cpp multimodal: https://github.com/ggml-org/llama.cpp/blob/5676f71a3c2a1b6e4e13f37a18c0ef3b7b16a9df/docs/multimodal.md
- llama.cpp server: https://github.com/ggml-org/llama.cpp/tree/master/examples/server

### Newly acquired model APIs — not yet integrated

| Capability | Candidate / API | Current state |
|---|---|---|
| Embeddings | SentenceTransformers Qwen3-Embedding-0.6B; encode_query() / encode_document(); 1024 dimensions | Weights acquired; no gateway /v1/embeddings endpoint or RAG adapter |
| Reranking | SentenceTransformers CrossEncoder Qwen3-Reranker-0.6B; predict() / rank() | Weights acquired; no reranking endpoint; invoke only on bounded top-k after retrieval |
| ASR | sherpa-onnx Qwen3-ASR INT8 and raw Qwen3-ASR BF16; offline/streaming recognizer APIs | Weights acquired; current /v1/audio/transcriptions still invokes whisper.cpp only |
| VAD | Silero VAD ONNX through ONNX Runtime CPU | ONNX acquired; no VAD adapter in gateway |
| Russian TTS | Piper CLI with ru_RU-dmitri-medium voice | Voice/config acquired; existing speech route supports Piper when enabled |
| Thai TTS | F5TTS(model="F5TTS_Base", ckpt_file=..., vocab_file=..., vocoder_local_path=..., device="cpu"); infer(ref_file, ref_text, gen_text, ...) | Evaluation-only weights acquired; no gateway adapter; training dataset rights unresolved |
| OCR | No selected OCR model/runtime in current gateway | No OCR endpoint |
| Vision | Qwen3.5 GGUF + mmproj | Vision companion acquired; no model is loaded and gateway image payload support must be verified end-to-end |

## 3. Configuration surface — names only, never commit values

Core:
- ALANDI_API_KEY
- ALANDI_CORS_ORIGINS
- OLLAMA_BASE_URL
- ALANDI_ALLOWED_MODELS
- ALANDI_UPSTREAM_TIMEOUT_SECONDS
- ALANDI_MAX_BODY_BYTES
- ALANDI_MAX_INFLIGHT_REQUESTS
- ALANDI_MODEL_CONTEXT_LENGTH_TOKENS
- ALANDI_MODEL_SIZE_ADVISORY_MB or ALANDI_RUNTIME_MEMORY_BUDGET_MB

Conditional helper and routing:
- ALANDI_HELPER_MODEL
- ALANDI_HELPER_TIMEOUT_SECONDS
- ALANDI_HELPER_MAX_INPUT_CHARS
- ALANDI_FAST_ROUTING_ENABLED

Cache:
- ALANDI_CACHE_ENABLED
- ALANDI_CACHE_PATH
- ALANDI_CACHE_TTL_SECONDS
- ALANDI_CACHE_MAX_ENTRIES
- ALANDI_CACHE_MAX_RESPONSE_BYTES

Memory/RAG:
- ALANDI_MEMORY_SYNC_ENABLED
- ALANDI_MEMORY_PATH
- ALANDI_MEMORY_MAX_STATE_BYTES
- ALANDI_RAG_ENABLED
- ALANDI_RAG_PATH
- ALANDI_RAG_MAX_CHUNK_CHARS

Search:
- ALANDI_SEARXNG_ENABLED
- ALANDI_SEARXNG_BASE_URL
- ALANDI_SEARXNG_MAX_RESULTS

Document extraction:
- ALANDI_DOCUMENT_EXTRACTION_ENABLED
- ALANDI_DOCUMENT_EXTRACTION_MAX_BYTES
- ALANDI_DOCUMENT_EXTRACTION_MAX_CHARS

Voice:
- ALANDI_AUDIO_TRANSCRIPTION_ENABLED
- ALANDI_AUDIO_TRANSCRIPTION_BINARY
- ALANDI_AUDIO_TRANSCRIPTION_MODEL
- ALANDI_AUDIO_TRANSCRIPTION_FFPROBE_BINARY
- ALANDI_AUDIO_TRANSCRIPTION_FFMPEG_BINARY
- ALANDI_AUDIO_TRANSCRIPTION_MAX_BYTES
- ALANDI_AUDIO_TRANSCRIPTION_TIMEOUT_SECONDS
- ALANDI_AUDIO_SPEECH_ENABLED
- ALANDI_AUDIO_SPEECH_BINARY
- ALANDI_AUDIO_SPEECH_MODEL
- ALANDI_AUDIO_SPEECH_DATA_DIR
- ALANDI_AUDIO_SPEECH_VOICES
- ALANDI_AUDIO_SPEECH_TIMEOUT_SECONDS

Google OAuth:
- OAUTH_ENCRYPTION_KEY
- OAUTH_TOKEN_VAULT_PATH
- GOOGLE_DRIVE_CLIENT_ID
- GOOGLE_DRIVE_CLIENT_SECRET
- GOOGLE_DRIVE_REDIRECT_URI
- OAUTH_SUCCESS_REDIRECT

Defaults are intentionally conservative: helper, fast routing, memory sync, RAG, SearXNG, document extraction, transcription and speech features are off unless explicitly configured. The cache is on by default; max in-flight requests defaults to one; model context defaults to 4096 tokens. Never copy secret values into this inventory.

## 4. Missing product APIs — do not represent these as implemented

1. Agent runtime API: no durable queue/worker/lease/heartbeat/cancel/retry/sandbox execution surface. AgentRunStore is storage groundwork, not a running agent service.
2. Skills lifecycle API: no backend install/update/execute/permission-management endpoint. The frontend skill registry is not a server-side plugin runtime.
3. Connector data APIs: Google OAuth PKCE/vault only; no Drive data operations and no general connector execution plane.
4. Deep Research orchestration API: search and RAG primitives exist, but no dedicated multi-source research job API with durable runs, citations/evidence ledger and resumable stages.
5. Vector RAG API: no embeddings ingestion/query route, vector index, rank fusion or reranker adapter.
6. OCR/document pipeline: no OCR, page/layout extraction, image-region citations or conversion worker.
7. Multilingual voice runtime: no Qwen/sherpa ASR endpoint, no VAD integration, no Thai TTS endpoint, no duplex WebSocket/RTC session.
8. Model provider abstraction: current gateway is Ollama-specific. No generic OpenAI-compatible backend contract or provider health adapter.
9. Local coding execution API: Browser Local Workspace is browser filesystem access with confirmation/recovery; it is not a remote shell, sandbox, repository executor or autonomous coding agent.

## 5. Efficient target architecture

- Ordinary text request: browser → authenticated gateway → one main Qwen model. No mandatory planner/helper/RAG call.
- Research request: bounded web search + scoped RAG → source/evidence capture → main-model synthesis. Helper only when a measured narrow task justifies it.
- RAG request: embed at ingest/query → FTS5 + vector retrieval → deterministic RRF → optional top-k reranker. Keep FTS5 fallback and scope isolation.
- Voice request: VAD → selected ASR → text through the same main-model path; TTS runs only after response. Load ASR/TTS sequentially when RAM is constrained.
- Tool/action request: model proposes structured call → capability registry + scope/schema/budget checks → approval gate when required → executor → audited result. Model text never authorizes itself.
- Connector request: provider OAuth token vault → connector adapter with narrow scopes → explicit permission and audit; OAuth alone is not a connector.

## 6. Verification boundary

The endpoint inventory is derived from source code. It does not prove a public gateway is deployed, a VPS is reachable, credentials exist, Ollama is running, voice binaries are installed, external APIs are configured, or any newly acquired model has been loaded. Use /livez and /readyz on the actual host and run the matching EVALS gates before promoting a capability.
