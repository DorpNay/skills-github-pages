# aLandi Intelligence / Source Register (INTEL.md)

**Review date:** 2026-11-06. Recheck upstream releases and model cards before shipping an artifact.

## Voice and model licensing

- Moonshine upstream license terms: https://github.com/moonshine-ai/moonshine/blob/main/LICENSE
  - Upstream states English models and streaming models default to MIT. Certain legacy non-streaming non-English models are exceptions; the list in upstream LICENSE is exhaustive. TTS/G2P assets have separate terms. Record the exact artifact SHA before use.
- Vosk API source: https://github.com/alphacep/vosk-api (Apache-2.0 code).
- Vosk model catalogue: https://alphacephei.com/vosk/models
  - The catalogue lists vosk-model-small-ru-0.22 as Apache 2.0 and approximately 45 MB. The downloaded archive checksum still has to be verified and stored in the manifest.
- Silero VAD: https://github.com/snakers4/silero-vad and https://github.com/snakers4/silero-vad/blob/master/LICENSE
  - Upstream code is MIT. Record the exact ONNX model hash separately.
- Silero TTS/model collection: https://github.com/snakers4/silero-models and https://github.com/snakers4/silero-models/wiki/Licensing-and-Tiers
  - The upstream licensing wiki describes its Community Edition STT models as non-commercial and Enterprise as separately licensed. Do not infer one universal SPDX identifier for every Silero artifact or assume the VAD license extends to TTS; confirm the exact selected model and model card/terms with the rights holder before use.
- Current Piper engine: https://github.com/OHF-Voice/piper1-gpl and https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/VOICES.md
  - Current package metadata identifies the engine as GPL-3.0-or-later. Each voice has a separate MODEL_CARD and may be more restrictive. The archived rhasspy/piper MIT license does not prove the current engine or any voice has MIT terms.
- ONNX standard: https://github.com/onnx/onnx (Apache-2.0). Runtime and model artifact licenses are tracked separately from the ONNX format.
- PyO3 native bridge: https://github.com/PyO3/pyo3 (dual MIT/Apache-2.0).

## Tool and security contracts

- JSON Schema validator, version/license: https://pypi.org/project/jsonschema/ (MIT; current pinned dependency is 4.26.0 in gateway requirements).
- OAuth security BCP: https://www.rfc-editor.org/rfc/rfc9700.html
- Google OAuth web-server flow: https://developers.google.com/identity/protocols/oauth2/web-server
- JSON Patch: https://www.rfc-editor.org/rfc/rfc6902.html
- Microsoft LazyGraphRAG: https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/
  - Current retrieval implementation remains SQLite FTS5 + lexical concept graph. It is not a claim of complete LazyGraphRAG parity.
- SSRF guidance: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
  - DNS results must all be checked and the connection must pin a validated address; a one-time URL string check alone is insufficient.

## Observability and package tooling

- OpenTelemetry Python official docs: https://opentelemetry.io/docs/languages/python/instrumentation/
  - Traces/metrics are stable; logs support is still described as development in the docs. Keep exporter disabled by default and use local collector unless privacy/security explicitly approves a remote endpoint.
- Vulture project: https://github.com/jendrikseipp/vulture and https://pypi.org/project/vulture/
  - Static analysis can produce false positives for framework callbacks and dynamic use; publish a report, do not automatically delete.
- orjson: https://github.com/ijl/orjson and https://pypi.org/project/orjson/
  - Current license expression includes MPL-2.0 AND (Apache-2.0 OR MIT). A serialization speed claim needs representative benchmark data, and licensing must be included in provenance.
- uv: https://docs.astral.sh/uv/ and https://github.com/astral-sh/uv
  - The project does not yet commit a generated uv.lock. CI must not migrate to uv sync --locked until the lock has been generated with registry access and reviewed.
- OCI shape/product details and availability: https://www.oracle.com/cloud/compute/ and https://www.oracle.com/cloud/free/
  - Availability, free-tier quotas, regional capacity and pricing must be rechecked in the account/region. This repo did not provision a VM.
- DigitalPlat Dev / FreeDomain terms: https://www.digitalplat.org/
  - Treat free-domain eligibility, renewal, ownership and DNS options as subject to current provider terms; this project did not register or modify a domain.

## Decision rule

License declarations are not inherited across engine/model/voice/data. Every distributable artifact records upstream URL, exact version, license/SPDX identifier, SHA-256, commercial/redistribution state, attribution obligations and approval. Missing data means not shipped.

## Media generation API status — reviewed 2026-10-24

- OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources: https://developers.openai.com/api/docs/guides/image-generation and https://developers.openai.com/api/docs/guides/tools-image-generation.
- OpenAI Sora 2 / Videos API: official current API pages state the models and Videos API were shut down on 2026-09-24 and no one-to-one replacement API is available. Do not implement the retired endpoint. Source: https://developers.openai.com/api/docs/guides/video-generation.
- Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source: https://docs.dev.runwayml.com/api/ and https://docs.dev.runwayml.com/guides/using-the-api/.
- Luma Agents API: current docs describe Ray 3.2 video generation/edit/reframe. Source: https://docs.agents.lumalabs.ai/guides/videos/.
- Google Vertex AI Veo: official API reference lists Veo 3.1 models and long-running video generation; needs Google Cloud project, IAM and billing/storage setup. Source: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation.
- Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder, https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia, https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API.
- Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport.

These are source checks, not provider-account tests. No provider was called, no billable media job was submitted, and no key/account access was verified.

## File picker and long-press behavior — reviewed 2026-10-24

- MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept.
- MDN documents pointer lifecycle events including pointerdown, pointerup, and pointercancel. Long-press UIs should clear timers on cancel and keep targets large enough for touch. Source: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events.
- aLandi PR #35 therefore keeps the native file chooser unrestricted but validates content type/size after selection; the application currently extracts selected text, images and a few video frames. PDF/Office/binary parsers are not implemented yet; such files are explicitly rejected rather than being silently sent as names or untrusted blobs.
- These docs are platform reference checks. Browser E2E uses mocked API endpoints; no real provider or private gateway is called.


## Consolidated external source inventory (snapshot: 2026-11-06)

This is the single navigational inventory for external upstreams referenced by the curated project source lists. The original catalogs remain the evidence/context records; this table records source URLs and provenance. A link is **not** an adoption, license approval, verified current state, or download authorization. Alias resolution and canonical identity notes are recorded in the portfolio review below. Recheck upstream version, exact artifact/model/voice license, checksum, redistribution terms and relevance before obtaining or shipping files.

**Catalog coverage:** `INTEL.md`; `docs/OPEN_SOURCE_TRIAGE_RU.md`; `docs/TECHNIQUE_REGISTER_RU.md`; `docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md`; `docs/MULTIMODAL_MODEL_STACK_RU.md`; research catalogs in PR #125 (Agent Studio), #128 (Agent Workforce/VERT), #129 (Voice 2.0), #130 (Deep Research 2.0), plus open-source feature extraction and multimodal research branches. Source docs are not merged into main by this register.

**Snapshot extraction:** 275 source records (EXT-001–EXT-275) across INTEL.md. The original consolidated table contains 257; 18 additional references were previously present only in INTEL prose and are now captured in the supplemental table below. Two canonical URL targets are also recorded for alias resolution, so the document contains 277 distinct URL strings. These are URL/resource references, not a count of unique upstream projects. A preliminary grouping yields 228 repo/model/site roots (143 GitHub repository roots, 16 Hugging Face model roots, 69 other host roots); host-level grouping can contain multiple unrelated resources and must not be read as a unique-project count.

| ID | Source / resource | URL as cited | Found in |
|---|---|---|---|
| EXT-001 | - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder> | INTEL.md |
| EXT-002 | - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia> | INTEL.md |
| EXT-003 | - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API> | INTEL.md |
| EXT-004 | - Current Piper engine:  and | <https://github.com/OHF-Voice/piper1-gpl> | INTEL.md |
| EXT-005 | - Current Piper engine:  and | <https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/VOICES.md> | INTEL.md |
| EXT-006 | - DigitalPlat Dev / FreeDomain terms: | <https://www.digitalplat.org/> | INTEL.md |
| EXT-007 | - Google OAuth web-server flow: | <https://developers.google.com/identity/protocols/oauth2/web-server> | INTEL.md |
| EXT-008 | - Google Vertex AI Veo: official API reference lists Veo 3.1 models and long-running video generation; needs Google Cloud project, IAM and billing/storage setup. Source: | <https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation> | INTEL.md |
| EXT-009 | - JSON Patch: | <https://www.rfc-editor.org/rfc/rfc6902.html> | INTEL.md |
| EXT-010 | - JSON Schema validator, version/license:  (MIT; current pinned dependency is 4.26.0 in gateway requirements). | <https://pypi.org/project/jsonschema/> | INTEL.md |
| EXT-011 | - Luma Agents API: current docs describe Ray 3.2 video generation/edit/reframe. Source: | <https://docs.agents.lumalabs.ai/guides/videos/> | INTEL.md |
| EXT-012 | - MDN documents pointer lifecycle events including pointerdown, pointerup, and pointercancel. Long-press UIs should clear timers on cancel and keep targets large enough for touch. Source: | <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events> | INTEL.md |
| EXT-013 | - MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file> | INTEL.md |
| EXT-014 | - MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept> | INTEL.md |
| EXT-015 | - Microsoft LazyGraphRAG: | <https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/> | INTEL.md |
| EXT-016 | - Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport> | INTEL.md |
| EXT-017 | - Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport> | INTEL.md |
| EXT-018 | - Moonshine upstream license terms: | <https://github.com/moonshine-ai/moonshine/blob/main/LICENSE> | INTEL.md |
| EXT-019 | - OAuth security BCP: | <https://www.rfc-editor.org/rfc/rfc9700.html> | INTEL.md |
| EXT-020 | - OCI shape/product details and availability:  and | <https://www.oracle.com/cloud/compute/> | INTEL.md |
| EXT-021 | - OCI shape/product details and availability:  and | <https://www.oracle.com/cloud/free/> | INTEL.md |
| EXT-022 | - ONNX standard:  (Apache-2.0). Runtime and model artifact licenses are tracked separately from the ONNX format. | <https://github.com/onnx/onnx> | INTEL.md |
| EXT-023 | - OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources:  and | <https://developers.openai.com/api/docs/guides/image-generation> | INTEL.md |
| EXT-024 | - OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources:  and | <https://developers.openai.com/api/docs/guides/tools-image-generation> | INTEL.md |
| EXT-025 | - OpenAI Sora 2 / Videos API: official current API pages state the models and Videos API were shut down on 2026-09-24 and no one-to-one replacement API is available. Do not implement the retired endpoint. Source: | <https://developers.openai.com/api/docs/guides/video-generation> | INTEL.md |
| EXT-026 | - OpenTelemetry Python official docs: | <https://opentelemetry.io/docs/languages/python/instrumentation/> | INTEL.md |
| EXT-027 | - orjson:  and | <https://github.com/ijl/orjson> | INTEL.md |
| EXT-028 | - orjson:  and | <https://pypi.org/project/orjson/> | INTEL.md |
| EXT-029 | - PyO3 native bridge:  (dual MIT/Apache-2.0). | <https://github.com/PyO3/pyo3> | INTEL.md |
| EXT-030 | - Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source:  and | <https://docs.dev.runwayml.com/api/> | INTEL.md |
| EXT-031 | - Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source:  and | <https://docs.dev.runwayml.com/guides/using-the-api/> | INTEL.md |
| EXT-032 | - Silero TTS/model collection:  and | <https://github.com/snakers4/silero-models> | INTEL.md |
| EXT-033 | - Silero TTS/model collection:  and | <https://github.com/snakers4/silero-models/wiki/Licensing-and-Tiers> | INTEL.md |
| EXT-034 | - Silero VAD:  and | <https://github.com/snakers4/silero-vad> | INTEL.md |
| EXT-035 | - Silero VAD:  and | <https://github.com/snakers4/silero-vad/blob/master/LICENSE> | INTEL.md |
| EXT-036 | - SSRF guidance: | <https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html> | INTEL.md |
| EXT-037 | - uv:  and | <https://docs.astral.sh/uv/> | INTEL.md |
| EXT-038 | - uv:  and | <https://github.com/astral-sh/uv> | INTEL.md |
| EXT-039 | - Vosk API source:  (Apache-2.0 code). | <https://github.com/alphacep/vosk-api> | INTEL.md |
| EXT-040 | - Vosk model catalogue: | <https://alphacephei.com/vosk/models> | INTEL.md |
| EXT-041 | - Vulture project:  and | <https://github.com/jendrikseipp/vulture> | INTEL.md |
| EXT-042 | - Vulture project:  and | <https://pypi.org/project/vulture/> | INTEL.md |
| EXT-043 | A2A | <https://a2a-protocol.org/latest/specification/> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| EXT-044 | ACP | <https://agentclientprotocol.com/protocol/v2/overview> | PR #125 · Agent Studio research |
| EXT-045 | AG-UI | <https://docs.ag-ui.com/spec/1.0> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| EXT-046 | AG-UI spec | <https://docs.ag-ui.com/> | PR #128 · Agent Workforce research |
| EXT-047 | AG2 | <https://github.com/ag2ai/ag2> | PR #125 · Agent Studio research |
| EXT-048 | Agent Skills | <https://agentskills.io/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-049 | Agent Skills specification | <https://agentskills.io/specification> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| EXT-050 | Agent-Reach | <https://github.com/Panniantong/Agent-Reach> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-051 | AgentScope | <https://github.com/agentscope-ai/agentscope> | PR #125 · Agent Studio research |
| EXT-052 | AgentTeams | <https://github.com/agentscope-ai/AgentTeams> | PR #128 · Agent Workforce research |
| EXT-053 | AI Engineering from Scratch | <https://github.com/rohitg00/ai-engineering-from-scratch> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-054 | AirLLM | <https://github.com/lyogavin/airllm> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-055 | Alertmanager | <https://github.com/prometheus/alertmanager> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-056 | Anything-to-Skill | <https://github.com/asale-ai/anything-to-skill> | PR #125 · Agent Studio research |
| EXT-057 | AppFlowy | <https://github.com/AppFlowy-IO/AppFlowy> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-058 | Argo CD | <https://github.com/argoproj/argo-cd> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-059 | ASR4ALL-L | <https://huggingface.co/futo-org/asr4all-l> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-060 | ASR4ALL-S | <https://huggingface.co/futo-org/asr4all-s> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-061 | AutoGen → Microsoft Agent Framework migration | <https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/> | PR #125 · Agent Studio research |
| EXT-062 | AutoGPT | <https://github.com/Significant-Gravitas/AutoGPT> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-063 | Awesome Agentic Patterns | <https://github.com/nibzard/awesome-agentic-patterns> | PR #125 · Agent Studio research |
| EXT-064 | Awesome Agentic Patterns | <https://agentic-patterns.com/> | PR #125 · Agent Studio research |
| EXT-065 | Awesome Agents | <https://github.com/kyrolabs/awesome-agents> | PR #125 · Agent Studio research |
| EXT-066 | Awesome Compose | <https://github.com/docker/awesome-compose> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-067 | Awesome Harness Engineering | <https://github.com/ai-boost/awesome-harness-engineering> | PR #125 · Agent Studio research |
| EXT-068 | Berkeley Function-Calling Leaderboard | <https://gorilla.cs.berkeley.edu/leaderboard.html> | PR #125 · Agent Studio research |
| EXT-069 | Book-to-Skill | <https://github.com/virgiliojr94/book-to-skill> | PR #125 · Agent Studio research |
| EXT-070 | book-to-skill v1.3.0 | <https://github.com/virgiliojr94/book-to-skill/releases/tag/v1.3.0> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-071 | Browser Use | <https://github.com/browser-use/browser-use> | PR #125 · Agent Studio research |
| EXT-072 | Bruno | <https://github.com/usebruno/bruno> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-073 | Cactus Needle | <https://github.com/cactus-compute/needle> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-074 | CAMEL-AI | <https://github.com/camel-ai/camel> | PR #125 · Agent Studio research |
| EXT-075 | Canary 180M Flash | <https://huggingface.co/nvidia/canary-180m-flash> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-076 | Cedar | <https://docs.cedarpolicy.com/> | PR #125 · Agent Studio research |
| EXT-077 | checkpointers | <https://docs.langchain.com/oss/python/langgraph/checkpointers> | PR #125 · Agent Studio research |
| EXT-078 | Claudex Loop | <https://github.com/chaseai-yt/claudex-loop> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-079 | CLI-Anything | <https://github.com/HKUDS/CLI-Anything> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-080 | Colibri | <https://github.com/JustVugg/colibri> | PR #128 · Agent Workforce research |
| EXT-081 | Comfy API v2 | <https://docs.comfy.org/api-reference/v2/overview> | PR #130 · Deep Research research |
| EXT-082 | Coucou | <https://github.com/Louis-CFM/coucou> | PR #125 · Agent Studio research |
| EXT-083 | CrewAI | <https://docs.crewai.com/en/index> | PR #125 · Agent Studio research |
| EXT-084 | DBOS | <https://docs.dbos.dev/architecture> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #125 · Agent Studio research |
| EXT-085 | DBOS Durable Execution | <https://docs.dbos.dev/> | PR #128 · Agent Workforce research |
| EXT-086 | DBX | <https://github.com/t8y2/dbx> | PR #125 · Agent Studio research |
| EXT-087 | DeepSeek-OCR / DeepSeek-OCR2 | <https://github.com/deepseek-ai/DeepSeek-OCR> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-088 | DeerFlow 2.0 | <https://github.com/bytedance/deer-flow> | PR #128 · Agent Workforce research |
| EXT-089 | Developer Roadmap | <https://github.com/kamranahmedse/developer-roadmap> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-090 | DevOps Exercises | <https://github.com/bregman-arie/devops-exercises> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-091 | Distil-Whisper | <https://github.com/huggingface/distil-whisper> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-092 | Docker sandbox | <https://docs.openhands.dev/openhands/usage/sandboxes/docker> | PR #125 · Agent Studio research |
| EXT-093 | Docling supported formats | <https://docling-project.github.io/docling/usage/supported_formats/> | PR #130 · Deep Research research |
| EXT-094 | dots.ocr → dots.mocr | <https://github.com/studio-dots-ai/dots.ocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-095 | DrawDB | <https://github.com/drawdb-io/drawdb> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-096 | dsh-our-free-model | <https://github.com/ebony-vinyl/dsh-our-free-model> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-097 | dsh-our-free-model | <https://github.com/Ebony-Vinyl/dsh-our-free-model> | PR #128 · Agent Workforce research |
| EXT-098 | EoT Bench | <https://github.com/livekit/eot-bench> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-099 | Every App | <https://github.com/every-app/every-app> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-100 | Everything Claude Code / ECC | <https://github.com/affaan-m/ECC> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| EXT-101 | File System Access API draft | <https://wicg.github.io/file-system-access/> | PR #130 · Deep Research research |
| EXT-102 | Firecracker jailer | <https://github.com/firecracker-microvm/firecracker/blob/master/docs/jailer.md> | PR #125 · Agent Studio research |
| EXT-103 | Free Programming Books | <https://github.com/EbookFoundation/free-programming-books> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-104 | GAIA | <https://huggingface.co/gaia-benchmark> | PR #125 · Agent Studio research |
| EXT-105 | garak | <https://docs.garak.ai/garak/> | PR #125 · Agent Studio research |
| EXT-106 | GitIngest | <https://github.com/coderamp-labs/gitingest> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-107 | GitMCP | <https://github.com/idosal/git-mcp> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-108 | GitReverse | <https://github.com/filiksyos/gitreverse> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-109 | GLM-OCR | <https://github.com/zai-org/glm-ocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-110 | Google ADK | <https://google.github.io/adk-docs/> | PR #125 · Agent Studio research |
| EXT-111 | Google Online Boutique | <https://github.com/GoogleCloudPlatform/microservices-demo> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-112 | google/adk-python | <https://github.com/google/adk-python> | PR #125 · Agent Studio research |
| EXT-113 | Goose | <https://github.com/block/goose> | PR #128 · Agent Workforce research |
| EXT-114 | GOT-OCR 2.0 | <https://github.com/Ucas-HaoranWei/GOT-OCR2.0> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-115 | GPT Pilot | <https://github.com/Pythagora-io/gpt-pilot> | PR #128 · Agent Workforce research |
| EXT-116 | Graphify | <https://github.com/Graphify-Labs/graphify> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-117 | Graphiti | <https://github.com/getzep/graphiti> | PR #125 · Agent Studio research |
| EXT-118 | Grok Register | <https://github.com/AaronL725/grok-register> | PR #125 · Agent Studio research |
| EXT-119 | gVisor security model | <https://gvisor.dev/docs/architecture_guide/security/> | PR #125 · Agent Studio research |
| EXT-120 | Harness² | <https://github.com/google-research/harness2> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-121 | Harper | <https://github.com/Automattic/harper> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-122 | Hatchet durable tasks | <https://docs.hatchet.run/v1/durable-tasks> | PR #125 · Agent Studio research |
| EXT-123 | Hermes Agent | <https://github.com/NousResearch/hermes-agent> | PR #125 · Agent Studio research |
| EXT-124 | Hive | <https://github.com/aden-hive/hive> | PR #128 · Agent Workforce research |
| EXT-125 | Hive Apache-2.0 license | <https://github.com/aden-hive/hive/blob/main/LICENSE> | PR #128 · Agent Workforce research |
| EXT-126 | Hono | <https://github.com/honojs/hono> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-127 | Hugging Face smolagents | <https://huggingface.co/docs/smolagents/examples/multiagents> | PR #125 · Agent Studio research |
| EXT-128 | Hugging Face Transformers | <https://github.com/huggingface/transformers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-129 | HunyuanOCR-1.5 | <https://github.com/Tencent-Hunyuan/HunyuanOCR> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-130 | HyperFrames | <https://github.com/heygen-com/hyperframes> | PR #125 · Agent Studio research |
| EXT-131 | Impeccable | <https://github.com/pbakaus/impeccable> | PR #125 · Agent Studio research |
| EXT-132 | Inspect AI | <https://inspect.aisi.org.uk/> | PR #125 · Agent Studio research |
| EXT-133 | Jev Ultrafast | <https://github.com/browser-use/jev-ultrafast> | PR #125 · Agent Studio research |
| EXT-134 | josstei/maestro-orchestrate | <https://github.com/josstei/maestro-orchestrate> | PR #125 · Agent Studio research |
| EXT-135 | Kev-4B | <https://benchlm.ai/compare/glm-5-3-flash-vs-kev-4b> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-136 | Kubernetes Examples | <https://github.com/kubernetes/examples> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-137 | Langfuse tracing | <https://langfuse.com/docs/observability/get-started> | PR #125 · Agent Studio research |
| EXT-138 | LangGraph | <https://docs.langchain.com/oss/python/langgraph/graph-api> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-139 | LangGraph docs | <https://docs.langchain.com/oss/python/langgraph/overview> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| EXT-140 | Letta | <https://docs.letta.com/> | PR #125 · Agent Studio research |
| EXT-141 | LightOnOCR-3-4B | <https://huggingface.co/lightonai/LightOnOCR-3-4B> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-142 | LiveKit Agent speech/audio | <https://docs.livekit.io/agents/multimodality/audio/> | PR #129 · Voice research; PR #130 · Deep Research research |
| EXT-143 | LiveKit Agents | <https://github.com/livekit/agents> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| EXT-144 | LiveKit turn handling | <https://docs.livekit.io/agents/logic/turns/> | PR #129 · Voice research; PR #130 · Deep Research research |
| EXT-145 | llama.cpp server | <https://github.com/ggml-org/llama.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-146 | Magentic-One paper | <https://arxiv.org/html/2411.04468> | PR #125 · Agent Studio research |
| EXT-147 | MagpieTTS 357M | <https://huggingface.co/nvidia/magpie_tts_multilingual_357m> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-148 | MarkItDown | <https://github.com/microsoft/markitdown> | PR #130 · Deep Research research |
| EXT-149 | MCP | <https://modelcontextprotocol.io/specification/2026-07-28> | PR #125 · Agent Studio research |
| EXT-150 | MCP specification | <https://modelcontextprotocol.io/specification> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| EXT-151 | MCP-Scan | <https://invariantlabs-ai.github.io/docs/mcp-scan/> | PR #125 · Agent Studio research |
| EXT-152 | MDN OPFS | <https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system> | PR #130 · Deep Research research |
| EXT-153 | Mem0 | <https://docs.mem0.ai/> | PR #125 · Agent Studio research |
| EXT-154 | memvid | <https://github.com/memvid/memvid> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-155 | MetaGPT | <https://github.com/FoundationAgents/MetaGPT> | PR #125 · Agent Studio research |
| EXT-156 | Microsoft Agensh | <https://github.com/microsoft/Agensh> | PR #128 · Agent Workforce research |
| EXT-157 | Microsoft Agent Framework | <https://github.com/microsoft/agent-framework> | PR #125 · Agent Studio research |
| EXT-158 | Microsoft Research project | <https://aka.ms/magentic-one> | PR #125 · Agent Studio research |
| EXT-159 | Minikube | <https://github.com/kubernetes/minikube> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-160 | MIT license | <https://github.com/bytedance/deer-flow/blob/main/LICENSE> | PR #128 · Agent Workforce research |
| EXT-161 | Moonshine Voice | <https://github.com/moonshine-ai/moonshine> | docs/TECHNIQUE_REGISTER_RU.md; docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-162 | multi-agent routing | <https://docs.openclaw.ai/concepts/multi-agent/> | PR #125 · Agent Studio research |
| EXT-163 | NaiboWang/EasySpider | <https://github.com/NaiboWang/EasySpider> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-164 | Nanochat | <https://github.com/karpathy/nanochat> | PR #128 · Agent Workforce research |
| EXT-165 | Nemotron 3.5 ASR 0.6B | <https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| EXT-166 | NemotronLabs VoiceChat 11B | <https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| EXT-167 | NVIDIA Nemotron Streaming ASR | <https://build.nvidia.com/nvidia/nemotron-asr-streaming/modelcard> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-168 | NVIDIA OpenShell | <https://github.com/NVIDIA/OpenShell> | PR #125 · Agent Studio research |
| EXT-169 | obra/superpowers | <https://github.com/obra/superpowers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-170 | Octos | <https://github.com/octos-org/octos> | PR #128 · Agent Workforce research |
| EXT-171 | official notice | <https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-172 | Official runtime | <https://github.com/NVIDIA/NeMo-Speech.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-173 | Open Multi-Agent (OMA) | <https://github.com/open-multi-agent/open-multi-agent> | PR #128 · Agent Workforce research |
| EXT-174 | Open Notebook | <https://github.com/lfnovo/open-notebook> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-175 | Open Policy Agent | <https://openpolicyagent.org/docs> | PR #125 · Agent Studio research |
| EXT-176 | Open-Generative-AI | <https://github.com/Anil-matcha/Open-Generative-AI> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-177 | OpenAI Agents SDK | <https://openai.github.io/openai-agents-python/> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| EXT-178 | OpenClaw skills and channels | <https://docs.openclaw.ai/concepts/features> | PR #125 · Agent Studio research |
| EXT-179 | OpenClaw subagents | <https://docs.openclaw.ai/subagents> | PR #125 · Agent Studio research |
| EXT-180 | OpenHands SDK | <https://docs.openhands.dev/sdk/arch/overview> | PR #125 · Agent Studio research |
| EXT-181 | OpenMAIC | <https://github.com/THU-MAIC/OpenMAIC> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-182 | OpenTelemetry GenAI conventions | <https://opentelemetry.io/docs/specs/semconv/gen-ai/> | PR #125 · Agent Studio research |
| EXT-183 | OpenWOP v2 | <https://openwop.dev/spec/v2/> | PR #125 · Agent Studio research |
| EXT-184 | orchestration guide | <https://developers.openai.com/api/docs/guides/agents/orchestration> | PR #125 · Agent Studio research |
| EXT-185 | OWASP Agentic Top 10 2026 | <https://genai.owasp.org/download/52117/> | PR #125 · Agent Studio research |
| EXT-186 | PaddleOCR-VL-1.6 | <https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-187 | paper | <https://arxiv.org/pdf/2609.21967.pdf> | PR #129 · Voice research |
| EXT-188 | paper arXiv:2609.26781 | <https://arxiv.org/abs/2609.26781> | PR #128 · Agent Workforce research |
| EXT-189 | Paperclip | <https://github.com/paperclipai/paperclip> | PR #125 · Agent Studio research |
| EXT-190 | PentAGI | <https://github.com/vxcontrol/pentagi> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-191 | PinchTab | <https://github.com/pinchtab/pinchtab> | PR #125 · Agent Studio research |
| EXT-192 | Pipecat | <https://github.com/pipecat-ai/pipecat> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| EXT-193 | Pipecat documentation | <https://docs.pipecat.ai/> | PR #129 · Voice research; PR #130 · Deep Research research |
| EXT-194 | Plandex | <https://github.com/plandex-ai/plandex> | PR #128 · Agent Workforce research |
| EXT-195 | Pliny / L1B3RT4S | <https://github.com/elder-plinius/L1B3RT4S> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-196 | policy schema | <https://docs.nvidia.com/openshell/how-it-works/policies/schema> | PR #125 · Agent Studio research |
| EXT-197 | Ponytail | <https://github.com/DietrichGebert/ponytail> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-198 | PP-OCRv6 Tiny / Medium | <https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-199 | Promptfoo eval guides | <https://www.promptfoo.dev/docs/guides/> | PR #125 · Agent Studio research |
| EXT-200 | public-api сервер | <https://github.com/davemachado/public-api> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-201 | public-apis/public-apis | <https://github.com/public-apis/public-apis> | docs/OPEN_SOURCE_TRIAGE_RU.md; docs/TECHNIQUE_REGISTER_RU.md |
| EXT-202 | punkpeye/awesome-mcp-servers | <https://github.com/punkpeye/awesome-mcp-servers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-203 | PydanticAI multi-agent | <https://pydantic.dev/docs/ai/guides/multi-agent-applications> | PR #125 · Agent Studio research |
| EXT-204 | pyproject.toml | <https://github.com/Graphify-Labs/graphify/blob/v8/pyproject.toml> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-205 | PyThaiNLP romanize | <https://pythainlp.org/dev-docs/api/transliterate.html> | PR #129 · Voice research |
| EXT-206 | quickstart | <https://docs.graphify.com/quickstart> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-207 | Qwen3-ASR-0.6B | <https://github.com/QwenLM/Qwen3-ASR> | docs/MULTIMODAL_MODEL_STACK_RU.md; PR #129 · Voice research; Multimodal stack research branch |
| EXT-208 | RAG-Anything | <https://github.com/HKUDS/RAG-Anything> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| EXT-209 | reproduction guide | <https://github.com/microsoft/Agensh/blob/main/REPRODUCE.md> | PR #128 · Agent Workforce research |
| EXT-210 | research repo | <https://github.com/warit-s/typhoon-asr-streaming> | PR #129 · Voice research |
| EXT-211 | Restate actions | <https://docs.restate.dev/foundations/actions> | PR #125 · Agent Studio research |
| EXT-212 | ripienaar/free-for-dev | <https://github.com/ripienaar/free-for-dev> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-213 | roadmap.sh | <https://roadmap.sh> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-214 | Roo Code | <https://github.com/RooCodeInc/Roo-Code> | PR #128 · Agent Workforce research |
| EXT-215 | RuFlo | <https://github.com/ruvnet/ruflo> | PR #125 · Agent Studio research |
| EXT-216 | RunMaestro/Maestro | <https://github.com/RunMaestro/Maestro> | PR #125 · Agent Studio research |
| EXT-217 | Scrapling | <https://github.com/D4Vinci/Scrapling> | PR #128 · Agent Workforce research |
| EXT-218 | screenshot-to-code | <https://github.com/abi/screenshot-to-code> | PR #130 · Deep Research research |
| EXT-219 | security | <https://docs.openclaw.ai/security/> | PR #125 · Agent Studio research |
| EXT-220 | sherpa-onnx streaming T-One Russian | <https://github.com/k2-fsa/sherpa-onnx/blob/master/docs/source/onnx/pretrained_models/online-ctc/t-one-ctc-models.rst> | PR #129 · Voice research |
| EXT-221 | slee-persis/GVS5H | <https://github.com/slee-persis/GVS5H> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-222 | slvDev/esp32-ai | <https://github.com/slvDev/esp32-ai> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-223 | Starter Workflows | <https://github.com/actions/starter-workflows> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-224 | Strix | <https://github.com/usestrix/strix> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-225 | Surya 2 | <https://github.com/datalab-to/surya> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-226 | SWE-agent | <https://github.com/SWE-agent/SWE-agent> | PR #128 · Agent Workforce research |
| EXT-227 | SWE-bench | <https://www.swebench.com/> | PR #125 · Agent Studio research |
| EXT-228 | Tabby | <https://github.com/TabbyML/tabby> | PR #128 · Agent Workforce research |
| EXT-229 | taste-skill | <https://github.com/Leonxlnx/taste-skill> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-230 | Temporal | <https://docs.temporal.io/ai> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #125 · Agent Studio research |
| EXT-231 | TensorFlow | <https://github.com/tensorflow/tensorflow> | PR #128 · Agent Workforce research |
| EXT-232 | Trail-Code | <https://github.com/trailhq/Trail-Code> | docs/TECHNIQUE_REGISTER_RU.md |
| EXT-233 | TurnBench | <https://github.com/SesameAILabs/turnbench> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-234 | Turnitout-Humanizer | <https://github.com/AhmadHassan-BTed/Turnitout-Humanizer> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-235 | Typhoon ASR Real-time paper | <https://arxiv.org/html/2601.13044> | PR #129 · Voice research |
| EXT-236 | Typhoon ASR Streaming 115M | <https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| EXT-237 | Unicode CLDR transliteration guidelines | <https://cldr.unicode.org/index/cldr-spec/transliteration-guidelines> | PR #129 · Voice research |
| EXT-238 | Unicode ICU transforms | <https://unicode-org.github.io/icu/userguide/transforms/general/> | PR #129 · Voice research |
| EXT-239 | Unidecode | <https://pypi.org/project/Unidecode/> | PR #129 · Voice research |
| EXT-240 | upstream | <https://github.com/invariantlabs-ai/mcp-scan> | PR #125 · Agent Studio research |
| EXT-241 | upstream | <https://github.com/openwop/openwop> | PR #125 · Agent Studio research |
| EXT-242 | uroman | <https://github.com/isi-nlp/uroman> | PR #129 · Voice research |
| EXT-243 | Utopia OS | <https://github.com/0xUrsanomics/utopia-os> | PR #125 · Agent Studio research |
| EXT-244 | UVR5 / Ultimate Vocal Remover GUI | <https://github.com/Anjok07/ultimatevocalremovergui> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-245 | VibeVoice ASR Streaming 1.5B | <https://huggingface.co/microsoft/VibeVoice-ASR-Streaming-1.5B> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-246 | voicebench | <https://pypi.org/project/voicebench/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-247 | VoxCPM2 | <https://huggingface.co/openbmb/VoxCPM2> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-248 | whisper.cpp | <https://github.com/ggml-org/whisper.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| EXT-249 | witr | <https://github.com/pranshuparmar/witr> | PR #125 · Agent Studio research |
| EXT-250 | Worktrunk | <https://github.com/max-sixty/worktrunk> | PR #128 · Agent Workforce research |
| EXT-251 | xerj-org/xerj | <https://github.com/xerj-org/xerj> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-252 | Xiryn | <https://github.com/SouravBeraAkaSpeed/xiryn> | PR #128 · Agent Workforce research |
| EXT-253 | xtool-org/xtool | <https://github.com/xtool-org/xtool> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-254 | Zagitta/gpu-unlock | <https://github.com/Zagitta/gpu-unlock> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| EXT-255 | ZIPFORMER VI / sherpa-onnx | <https://github.com/k2-fsa/sherpa/blob/master/docs/source/onnx/pretrained_models/offline-transducer/zipformer-transducer-models.rst> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| EXT-256 | τ-bench | <https://github.com/sierra-research/tau-bench> | PR #125 · Agent Studio research |
| EXT-257 | веса dots.mocr | <https://huggingface.co/dots-studio/dots.mocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |


### Supplemental references previously present only in INTEL prose (18)

| ID | Source / resource | URL as cited | Found in |
|---|---|---|---|
| EXT-258 | W3C WAI — What's New in WCAG 2.2 | <https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/> | INTEL.md · offline archive |
| EXT-259 | Microsoft BitNet | <https://github.com/microsoft/BitNet> | INTEL.md · CPU inference research |
| EXT-260 | Microsoft VibeASR.cpp | <https://github.com/microsoft/VibeASR.cpp> | INTEL.md · CPU ASR research |
| EXT-261 | VibeVoice-ASR-BitNet model card | <https://huggingface.co/microsoft/VibeVoice-ASR-BitNet> | INTEL.md · CPU ASR research |
| EXT-262 | Edge0 | <https://github.com/Edge0-AI/Edge0> | INTEL.md · local inference research |
| EXT-263 | OpenViking | <https://github.com/volcengine/OpenViking> | INTEL.md · memory/context research |
| EXT-264 | ECC agent-harness-construction skill | <https://github.com/affaan-m/ECC/blob/main/skills/agent-harness-construction/SKILL.md> | INTEL.md · engineering workflow research |
| EXT-265 | T-one upstream repository | <https://github.com/voicekit-team/T-one> | INTEL.md · Russian ASR research |
| EXT-266 | sherpa-onnx T-one CTC model page | <https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-ctc/t-one-ctc-models.html> | INTEL.md · Russian ASR research |
| EXT-267 | Qwen3-ASR-0.6B model card | <https://huggingface.co/Qwen/Qwen3-ASR-0.6B> | INTEL.md · multilingual ASR research |
| EXT-268 | GigaAM upstream repository | <https://github.com/salute-developers/GigaAM> | INTEL.md · Russian ASR research |
| EXT-269 | GigaAM Multilingual sherpa-onnx export (third-party) | <https://huggingface.co/fussraider/GigaAM-Multilingual-sherpa-onnx-ctc> | INTEL.md · Russian ASR research |
| EXT-270 | Vosk small Russian 0.22 archive | <https://alphacephei.com/vosk/models/vosk-model-small-ru-0.22.zip> | INTEL.md · artifact acquisition checkpoint |
| EXT-271 | Temporal LangGraph durable-execution plugin | <https://temporal.io/blog/temporal-langgraph-plugin-durable-execution> | INTEL.md · durable execution research |
| EXT-272 | Pydantic AI durable-execution docs | <https://pydantic.dev/docs/ai/durable-execution/> | INTEL.md · durable execution research |
| EXT-273 | Apple Human Interface Guidelines | <https://developer.apple.com/design/human-interface-guidelines/> | INTEL.md · mobile UI/accessibility |
| EXT-274 | WCAG 2.2 Recommendation | <https://www.w3.org/TR/WCAG22/> | INTEL.md · mobile UI/accessibility |
| EXT-275 | GOV.UK Design System — error message | <https://design-system.service.gov.uk/components/error-message/> | INTEL.md · mobile UI/accessibility |

**Download/archive gate:** only retain artifacts that serve a concrete future project task and whose exact upstream artifact, version/commit, license/terms, SHA-256, size and redistribution permissions are recorded. Prefer source snapshots or documentation for stable reference; do not bulk-download repositories, datasets, model weights, voice assets or user data by default. Store approved items in a clearly scoped archive with a manifest and review date; keep credentials and proprietary material out.


## Offline archive entries (provenance-checked)

| Artifact | Original source | Pinned upstream | License / attribution | Local archive | SHA-256 | Size |
|---|---|---|---|---|---|---:|
| W3C WAI — What's New in WCAG 2.2 | https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ | `w3c/wai-website` commit `321da62bab5c43fe44bd6f76decd547fcf76fee9`; source blob `91ba79fbf918aa1ab14202dc5b4030a1b3087d19` | W3C Document License 2023; Copyright © 2023 World Wide Web Consortium. See `docs/upstream-archive/README.md`. Copy is unchanged; no W3C endorsement implied. | `docs/upstream-archive/w3c-wai-wcag22-new-in-22.md` | `d837a780c59ad261aaad05c31a86e195c00e71794f5b8921e01a74ba105d47a6` | 25472 B |

This is the first archived artifact: selected for the active Landing UI V2.0 accessibility acceptance work. Continue adding items only after confirming a concrete future task, exact source/version, license and redistribution conditions, and reproducible hash. Do not bulk-mirror repositories, model weights, voice assets or datasets.

## External-source first-pass — 2026-11-04

Research only; no source code or model weights downloaded. These findings refine the later artifact-acquisition queue. Upstream pages and licenses must be rechecked at the exact revision selected for adoption.

| Source | High-value pattern / current evidence | Decision for aLandi |
|---|---|---|
| [Microsoft BitNet](https://github.com/microsoft/BitNet) + [VibeASR.cpp](https://github.com/microsoft/VibeASR.cpp) + [VibeVoice-ASR-BitNet model card](https://huggingface.co/microsoft/VibeVoice-ASR-BitNet) | CPU-first low-bit inference. The quantized ASR artifact is reported at 1.58 GB, RTF < 1 with 3+ CPU threads on x86 AVX2 / ARM NEON, and MIT code/model licensing. Its currently listed language set includes English, Chinese, French, Italian, Korean, Portuguese and Vietnamese — **not Russian or Thai**. | **High-priority benchmark candidate, not an RU/TH replacement.** Consider as an optional English/other-language helper or as an engineering pattern for CPU quantization. Require exact artifact digest, target-CPU test, peak RAM, WER and concurrency comparison before download/adoption. |
| [Moonshine](https://github.com/moonshine-ai/moonshine) | On-device streaming ASR with small models and a microcontroller-oriented pipeline. Current published STT languages do not include Russian or Thai. STT license defaults to MIT with enumerated legacy non-commercial exceptions; TTS/G2P assets have separate terms. | **Keep as a voice architecture reference, not the current RU/TH transcription candidate.** Tiny VAD / keyword ideas may be worth a separate microcontroller/device evaluation. |
| [Edge0](https://github.com/Edge0-AI/Edge0) | SSD expert offload, look-ahead prerouter and recover-LoRA are interesting memory/throughput techniques. Current documented runtime is MLX on Apple Silicon; CUDA is roadmap, not current support. The 8B/35B model tiers require about 4.2/23 GB disk; reported active memory is about 1.0/2.9 GB under short-context benchmarks. Project metadata says Apache-2.0 and Alpha. | **Research-only. Not suitable for the current Linux/Ollama VPS path today.** Revisit only if a supported Linux/CUDA backend appears or there is a separate Apple-Silicon local-runtime target. |
| [OpenViking](https://github.com/volcengine/OpenViking) | Strong context-engineering ideas: one inspectable virtual filesystem for resources/memories/skills; scoped directory retrieval; L0 abstract → L1 overview → L2 details; visible retrieval traces. | **Borrow concepts, not code.** Main project is AGPL-3.0 (some subcomponents have separate licenses); avoid importing code or a new service into the current SQLite/FTS5 architecture without an explicit license and migration decision. |
| [Open Notebook](https://github.com/lfnovo/open-notebook) | Useful research data model: notebooks → scoped sources → notes/transformations, with citations and multi-provider/local model choice. Code is MIT. Its full application uses Python/FastAPI + Next.js/React + SurrealDB; the sample Docker Compose publishes UI/API interfaces broadly and documents no password by default. | **Borrow the research workflow and information model, not the application stack or deployment recipe.** Map the idea to existing project/source boundaries and explicit API contracts. |
| [Agent Skills specification](https://agentskills.io/specification) | Portable `SKILL.md` directories with YAML metadata and optional `scripts/`, `references/`, `assets/`; progressive disclosure loads metadata first, instructions on activation, and resources on demand. `allowed-tools` is explicitly experimental. | **Adopt as a format/validation reference.** Keep permission enforcement in aLandi's own runtime; never treat Skill metadata or prompt text as an authorization boundary. |
| [Harness²](https://github.com/google-research/harness2) | Recursive Propose–Probe–Compose loop; compare behavior on the same task and retain only evidence-backed harness changes. Upstream warns that its executor network access is unrestricted and sandbox is disabled by default. | **Adopt the bounded experiment pattern only.** Never run its executor/sandbox configuration as-is against project credentials or production. |
| [ECC agent-harness-construction skill](https://github.com/affaan-m/ECC/blob/main/skills/agent-harness-construction/SKILL.md) | Useful capability design checklist: action-space quality, observation quality, recovery quality, context budgets; typed/narrow tools; deterministic outputs; safe retry and stop conditions. | **Convert into local capability-contract/evaluation checks**, not wholesale plugin installation. |

### External research next actions

1. Add immutable commit/release IDs and license/NOTICE references for the shortlisted candidates.
2. Check RU/EN/TH model language coverage and task-specific golden sets before any ASR/embedding/model download.
3. Compare CPU candidates against the current model/runtime baseline on the actual target hardware; record peak RAM, disk, cold/warm latency and throughput.
4. For research UX, map the Open Notebook source/notes workflow to existing project scopes before considering any new API or storage engine.
5. For memory/context, prototype only the L0/L1/L2 progressive retrieval concept over existing stores; do not introduce OpenViking's AGPL code or a competing memory service.


## Voice / ASR model shortlist — RU / TH — 2026-11-04

This is a research shortlist, not an adoption decision. Model weights are not downloaded. Code, model weights, training data and conversion artifacts have separate provenance and must be checked independently.

| Candidate | Grounded facts | Fit / caveat | Next evaluation |
|---|---|---|---|
| [T-one](https://github.com/voicekit-team/T-one) + [sherpa-onnx T-One CTC conversion](https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-ctc/t-one-ctc-models.html) | Russian streaming CTC, 71M parameters, 300 ms chunks; original repo declares Apache-2.0 for code and models. sherpa-onnx exposes a CPU T-One CTC recognizer with one thread; converted model package is about 144 MB and expects 8 kHz audio. Upstream benchmarks specialize in telephony. | **Best current RU low-footprint candidate for telephony**, not a general multilingual dictation model. Original repo recommends at least 4 CPU cores / 8 GB RAM for smooth pipeline use. The converted package contains its own small LICENSE file that must be inspected before redistribution. | Pin upstream commit and model revision; inspect both licenses; benchmark on RU telephony + ordinary speech; compare WER, RTF, peak RSS and chunk latency on target CPU. |
| [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B) + [Qwen3-ASR runtime](https://github.com/QwenLM/Qwen3-ASR) | Apache-2.0 model and code; 1.88 GB weight file; 30 languages plus 22 Chinese dialects, including Russian and Thai; offline and streaming inference. | **Best single-model RU/TH coverage candidate.** Official streaming inference currently requires the vLLM backend; Transformers backend is the simpler offline path. Published examples are GPU-oriented; CPU-only memory/latency on an 8 GB host is not established. | Test Transformers CPU first; measure peak RSS, RTF, concurrency and long-audio behavior. Treat vLLM streaming as a separate GPU path. |
| [Typhoon ASR Streaming 115M](https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m) | 115M FastConformer-Transducer, Thai streaming, 462 MB model file, CC-BY-4.0; cache-aware chunking and 80–1040 ms latency options. Published RTF 0.020 is on H100; usage requires NeMo streaming support and example maps to CUDA. | **Strong Thai-specialist candidate for GPU evaluation**, not proven as a CPU-only VPS fit. CC-BY attribution obligations apply; review upstream and base-model chain. | Benchmark on target hardware before choosing; compare CER/latency on Thai conversational speech and code-switching. |
| [Vosk small Russian](https://alphacephei.com/vosk/models) | 45 MB, Apache-2.0, about 300 MB runtime memory for the small-model class; published WER varies by dataset (e.g. 22.71 audiobook / 31.97 YouTube for small-ru-0.22). | **Very small offline fallback / baseline**, but quality is materially lower than larger Russian candidates on some sets. | Use as a low-resource baseline; compare exact same golden clips and latency. |
| [VibeVoice-ASR-BitNet](https://huggingface.co/microsoft/VibeVoice-ASR-BitNet) | MIT; 1.58 GB quantized artifact; listed languages include English, Chinese, French, Italian, Korean, Portuguese and Vietnamese. | **Not RU/TH capable according to the current published language list.** Do not select for the primary Russian/Thai path. | Keep only as a CPU-quantization engineering reference or optional non-RU/TH experiment. |
| [Moonshine](https://github.com/moonshine-ai/moonshine) | Streaming/on-device ASR family with small and micro models; current published STT language list does not include Russian or Thai. License exceptions apply to some legacy non-English STT models; TTS/G2P licensing is separate. | **Architecture reference, not primary RU/TH candidate.** | Recheck the exact selected model's license and language list before any experiment. |

### Required ASR evaluation contract

- Use one fixed, consented golden set per language and task: Russian telephony, Russian general dictation, Thai conversational speech, Thai code-switching, noisy/mobile audio.
- Report WER for word-spaced languages and CER where appropriate; do not compare metrics from different corpora as if they were directly comparable.
- Measure cold-start load time, model disk size, peak process RSS, CPU utilization, real-time factor, first-partial latency, finalization latency, and concurrency under the actual gateway workload.
- Verify sample rate, chunking, VAD, punctuation, timestamps and text normalization separately from acoustic recognition quality.
- Keep raw audio local and ephemeral by default; do not add audio retention or send it to external inference without explicit product consent and a documented privacy boundary.
- Prefer the smallest model that meets the measured quality threshold; use task/language routing only when it improves the same golden set without excessive operational complexity.


| [GigaAM Multilingual](https://github.com/salute-developers/GigaAM) + [sherpa-onnx CTC export reference](https://huggingface.co/fussraider/GigaAM-Multilingual-sherpa-onnx-ctc) | Upstream MIT; 220M CTC model can be exported to ONNX and dynamically quantized. A published sherpa-onnx conversion provides a 225 MB int8 CPU artifact and reports informal RTF ≈0.06 on an Apple CPU with 4 threads. Fine-tuned ASR languages are Russian, English, Kazakh, Kyrgyz and Uzbek; the 70+ pretraining languages must not be mistaken for 70+ ASR output languages. Output is lowercase/without punctuation and the CTC path has no hotword/contextual biasing. | **High-priority RU/EN CPU candidate**, complementary to telephony-specialist T-one; not Thai. The third-party ONNX pack is not the upstream release, so reproduce or audit its export, pin the exact source model revision and inspect the conversion artifact license/provenance. | Run the official exporter or independently verify the third-party export; compare 220M int8 against T-one, Vosk and Qwen on the same RU/EN golden set; measure RTF/RSS on target x86 VPS. |


## Artifact acquisition checkpoint — 2026-11-05 (owner authorized downloads)

### Initial small Russian ASR candidate — Vosk

- Upstream model catalog: https://alphacephei.com/vosk/models
- Canonical official archive attempt: https://alphacephei.com/vosk/models/vosk-model-small-ru-0.22.zip
- Catalog identifies `vosk-model-small-ru-0.22` as a lightweight mobile/Raspberry Pi model, approx. 45 MB, Apache-2.0. Catalog-reported benchmark figures vary by dataset (WER: 22.71 audiobook, 31.97 YouTube, 29.89 Sova devices, 11.79 Golos crowd); use these only as upstream-reported context, not aLandi eval.
- **Acquisition state: DOWNLOADED / HASH VERIFIED / EVAL PENDING.** GitHub Actions run #41968439622, artifact #13389210196 obtained the exact archive from the official URL. Size 46,236,750 bytes; SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`. ZIP CRC, path traversal, symlink, member-count and expansion bounds passed in the runner; after transfer, SHA-256 was independently recomputed and matched, ZIP CRC/path safety checks were repeated. Provenance sidecar and SHA256SUMS are available alongside the archive. After transfer, the inner model ZIP was independently extracted in the working environment: 14 files / 91,289,240 bytes; all paths were checked for traversal/absolute paths/symlinks and ZIP CRC passed. This is a working-copy extraction, not a repository-hosted model or runtime install. License Apache-2.0 per official catalog. `ship=false`; no runtime install, target-host or RU golden-set evaluation.
- Next: run bounded RU golden-set comparison against the current whisper.cpp baseline; measure WER/CER, RTF, RAM/PSS and latency on target hardware. Keep the artifact isolated until quality, resource and product acceptance.

### Follow-up multilingual ASR candidate — Qwen3-ASR-0.6B

- Official model card: https://huggingface.co/Qwen/Qwen3-ASR-0.6B
- Official project: https://github.com/QwenLM/Qwen3-ASR
- Apache-2.0; model card lists Russian (ru) and Thai (th) support, offline/streaming inference. HF page reports the BF16 model weight file at 1.88 GB with SHA-256 `79d6cbd4c98c7bbffe9db2edac07f56cd6637d0d5944b27f6c2b8353840323ea` for that specific `model.safetensors` file; the complete model repository consists of multiple files and needs a pinned revision + per-file manifest.
- **State: RESEARCH ONLY / NOT DOWNLOADED.** Hardware RAM/latency and RU/TH quality must be benchmarked before adoption. Do not confuse model card language coverage with project acceptance.



## Modern architecture/source sweep — 2026-11-05

This is a source-and-pattern review, not an adoption decision. Upstream refs are immutable commit snapshots inspected on 2026-11-05; recheck before vendoring or runtime use.

### Agent execution, durability and approvals

- **Temporal / LangGraph durable execution:** [Temporal LangGraph plugin (2026-07-16)](https://temporal.io/blog/temporal-langgraph-plugin-durable-execution), [Temporal AI docs](https://docs.temporal.io/ai), [LangGraph checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers), [Pydantic AI durable execution](https://pydantic.dev/docs/ai/durable-execution/). Key distinction: a checkpoint persists state; durable execution also journals/replays work, handles retries and waits for approval without holding a worker. LangGraph uses `thread_id`, pending writes and explicit durability modes; resume/replay semantics must be selected intentionally. Pydantic AI documents multiple engines and explicitly limits an agent to one durable engine.
- **aLandi decision:** keep durable execution as a future architecture option, not a new dependency now. For AgentRun (#134), retain explicit parent/child lifecycle, idempotency, terminal fencing, approval binding and recovery tests before selecting an engine. Temporal adds operational infrastructure; on the current single 8-GB host, justify it with measured long-running workflow demand.

### Local-first retrieval and memory

- **XERJ:** [repository](https://github.com/xerj-org/xerj), Apache-2.0, inspected `main` commit `83c9f0d123bac010a25ca2cf02ff093b08ee68ce`. One Rust binary offers BM25, vector and hybrid search, code definition lookup, MCP and Elasticsearch-compatible APIs. The README cites a controlled 2.7x output-token reduction at equal 16/16 solve rate; treat this as upstream-reported until independently reproduced. Security warning: `--insecure` disables TLS and API-key auth; keep the default loopback boundary and never expose an unauthenticated index service.
- **Memvid:** [repository](https://github.com/memvid/memvid), Apache-2.0, inspected `main` commit `e6bd9f7b9c38cd8d5370fa0fc936ac1dcd751813`. Single-file portable memory, append-only immutable frames, checksums, versioning and time-travel. Its benchmark claims are upstream/vendor claims, not aLandi measurements. Candidate for an isolated export/archive or portable capsule experiment, not a replacement for current SQLite/FTS5 without integrity, deletion, conflict and retrieval evals.
- **RAG-Anything:** [repository](https://github.com/HKUDS/RAG-Anything), MIT, inspected `main` commit `2cd2b3329c470ccb53923f8a6d320596b34e56c5`. Useful pipeline pattern: parser → typed text/table/image/equation fragments → cross-modal relations/provenance → hybrid retrieval and citations. Full MinerU/LightRAG/VLM dependency stack is not justified on the current small host until real corpus quality, memory and latency are measured.
- **Graphify:** [repository](https://github.com/Graphify-Labs/graphify), Apache-2.0, inspected `v8` commit `59b5ab1151e031fb42e39cfc9a50bf96f2d57ae0`. Current upstream emphasizes deterministic tree-sitter code parsing, queryable graph and explicit `EXTRACTED` versus `INFERRED` edge provenance. Reuse this evidence distinction in our dev-only Graphify reports; do not add Graphify Cloud or a runtime graph database.
- **aLandi decision:** first benchmark XERJ against existing SQLite FTS5 + Graphify on a fixed local corpus and query set. Compare Recall@5, MRR, nDCG, citation correctness, cold/warm latency, RSS, index size and operational surface. Keep Memvid/RAG-Anything as separate experiments; no second retrieval runtime by default.

### Engineering workflow and product UX

- **Superpowers:** [repository](https://github.com/obra/superpowers), MIT, inspected `main` commit `22f0b463e7a5e579904dd6211a520321035526f7`. Useful process ideas: clarify intent, get owner approval on a concise spec, create a bounded implementation plan, true red/green TDD, independent review and fix-forward. Adopt the process selectively; do not install its full plugin set or grant subagents broad permissions.
- **Mobile chat/accessibility references:** retain the existing [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [GOV.UK error-message pattern](https://design-system.service.gov.uk/components/error-message/) and Playwright real-browser approach already recorded in the V1 checklist. High-value test states include streaming while scrolled away from bottom, failed/stopped/denied outcomes, keyboard-only composer, modal focus return, reduced motion, forced colors and narrow viewport/virtual keyboard.
- **aLandi decision:** no wholesale UX clone. Use these as acceptance/test patterns for independently scoped Landing V1 improvements and as V2 research inputs.

### Provenance boundary

- Repository SHAs above identify the inspected source snapshots, not a vendored dependency or approved release pin.
- MIT/Apache-2.0 repo license does not automatically cover every model weight, dataset, voice, optional parser or third-party artifact. Audit those separately and preserve NOTICE/attribution before copying code.
- No upstream source code, model weights or executable binary was copied by this research sweep.


## Full source portfolio review — 2026-11-06

### Census and resolution

- **275 source records** are now represented in this register: 257 original consolidated-table entries plus 18 references previously present only in INTEL narrative. Stable IDs are EXT-001–EXT-275. Two canonical alias-resolution targets are additionally linked in the review notes; the full file therefore contains 277 distinct URL strings.
- Preliminary canonical grouping: **228 roots** — 143 GitHub repository roots, 16 Hugging Face model roots, and 69 other host roots. This is a navigation/deduplication aid, not a unique-project count; non-GitHub host roots may contain unrelated standards, papers, APIs and documentation.
- **274 text/source pages were inspected** across repositories, READMEs, official docs and model cards. The remaining URL is the binary Vosk small-RU archive: it was not downloaded in this review; the official Vosk catalogue identifies the artifact as about 45 MB and Apache-2.0. Its archive SHA-256 remains unverified.
- The inventory is a source census, not an adoption list. Standards, papers, benchmarks, catalogues and design guides are retained as REFERENCE-ONLY; scores below apply to implementable candidates or reusable technical components.

### Identity, alias and license corrections

- **Piper voice list:** the earlier path omitted `blob/main`; the canonical file path is `https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/VOICES.md`. Engine GPL-3.0-or-later and per-voice model-card terms remain separate.
- **T-one:** the old sherpa-onnx source-file URL is stale; use `https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-ctc/t-one-ctc-models.html`. The upstream repository's GitHub metadata says `Other`, but its checked LICENSE file and the converted model package LICENSE are Apache-2.0. The Russian CTC model is 71M parameters, about 138 MB, expects 8 kHz mono audio, and is specialized for telephony. Upstream pipeline guidance asks for at least four CPU cores and 8 GB RAM, so it is not assumed to fit alongside other services on an 8-GB host.
- **Magentic-One:** `aka.ms/magentic-one` resolves to Microsoft's 2024 research paper/project. The paper's experiments used AutoGen 0.4 and GPT-4o as the default multimodal model; treat the orchestration pattern as research, not a local-first drop-in.
- **OpenTelemetry GenAI semantic conventions:** the definitions moved from the core semantic-conventions repo to `https://github.com/open-telemetry/semantic-conventions-genai`. The new repo is Apache-2.0 but had no official releases at review time; do not pin an unreleased schema as a stable contract.
- **Invariant Labs MCP-Scan:** the current upstream is `https://github.com/snyk/agent-scan` (Apache-2.0). Its README warns that scanning MCP configs executes configured stdio commands and connects to configured remote URLs. CLI output is explicitly experimental. Do not run it against untrusted configs or wire its output into CI without a disposable sandbox, explicit consent and a reviewed local-only/telemetry posture.
- **Claudex Loop:** the GitHub metadata classification is `Other`, while the checked LICENSE file is MIT. The repo also contains adapted skills and third-party notices; review those notices before copying individual skill files.
- **OpenViking:** the current repository LICENSE is AGPL-3.0. Keep architectural concepts only; do not import its code or deploy a network service without an explicit license decision.
- **Agent Skills:** the specification is a file/metadata convention, not an authorization or sandbox boundary. `allowed-tools` metadata must never substitute for Gateway-side capability checks.

### Candidate score matrix

Vectors are ordered **G/F/O/I/M/L/H**: capability-gap relevance / useful functionality / offline fit / integration fit / maturity and test evidence / license clarity / target-hardware fit. Each component is 0–5; total uses the documented weights and is a screening score, not a benchmark. A hard gate can override a high total.

| Candidate | G/F/O/I/M/L/H | Score | Disposition and evidence |
|---|---:|---:|---|
| Agent Skills specification | 5/5/5/5/5/5/5 | 100 | REFERENCE-ONLY; use format conventions, never as an auth boundary |
| MarkItDown | 5/4/5/5/5/5/5 | 96 | DEEP-DIVE; MIT, local conversion; upstream warns it performs I/O with current-process privileges |
| AG-UI 1.0 | 5/5/4/5/4/5/5 | 95 | DEEP-DIVE; protocol reference for UI streaming, not runtime adoption |
| MCP specification | 5/5/4/4/5/5/5 | 94 | DEEP-DIVE; tool protocol reference; security policy remains Gateway-owned |
| ICU transforms | 4/4/5/5/5/5/5 | 91 | DEEP-DIVE; deterministic Unicode/script normalization component |
| PydanticAI durable execution | 5/4/4/5/4/5/4 | 90 | DEEP-DIVE; adapter/backend patterns; no new engine selected |
| GigaAM Multilingual 220M | 5/4/5/4/4/5/4 | 90 | DEEP-DIVE; MIT, strong published Russian results; ASR card lists RU/EN/KK/KY/UZ, not Thai |
| Docling | 5/4/5/4/4/5/3 | 89 | DEEP-DIVE; MIT code and local execution; model licenses are separate |
| Qwen3-ASR-0.6B | 5/4/5/4/4/5/3 | 89 | DEEP-DIVE; RU/TH coverage and about 1.88 GB weights; streaming path uses vLLM; target-CPU performance unverified |
| Graphify | 4/4/5/5/4/5/5 | 89 | ALREADY IN STACK as a developer-only workflow; do not create a second runtime graph system |
| LangGraph checkpointers | 5/4/4/4/4/5/4 | 87 | DEEP-DIVE; checkpoint/replay patterns; side effects still need idempotency |
| PyThaiNLP | 4/4/5/4/4/5/5 | 86 | DEEP-DIVE; Thai tokenization/romanization, not speech recognition |
| gVisor | 5/4/5/3/4/5/3 | 86 | DEEP-DIVE; sandbox candidate; target-kernel and runtime compatibility remain open |
| Vosk small-RU 0.22 | 4/3/5/5/4/5/5 | 85 | BASELINE candidate; Apache-2.0, about 45 MB; archive hash and target-quality comparison remain open |
| NVIDIA OpenShell | 5/4/4/4/3/5/3 | 84 | DEEP-DIVE; Apache-2.0 policy-enforced sandbox; supported host/runtime matrix must match the target |
| CLI-Anything | 3/4/5/4/4/5/4 | 80 | DEEP-DIVE; structured CLI contracts only; not a grant for arbitrary shell access |
| T-one | 4/3/5/4/3/5/4 | 79 | DEEP-DIVE; Russian telephony specialist; CPU/RAM budget is tight on the current host |
| Firecracker | 4/4/4/2/5/5/1 | 75 | RESERVE; strong isolation but KVM and operational footprint are unverified |
| Snyk Agent Scan | 4/4/4/4/3/2/4 | 74 | RESERVE; scanner may execute MCP commands/network requests; output is experimental |
| Typhoon ASR Streaming 115M | 4/4/4/3/3/4/2 | 73 | RESERVE; Thai-focused, CC-BY-4.0, NeMo dependency and H100-centric evidence; no CPU proof |
| VibeASR BitNet | 2/3/5/3/3/5/5 | 67 | DEFER; MIT and CPU-focused, but the model card lists EN/ZH/FR/IT/KO/PT/VI, not RU or TH |
| Edge0 | 2/4/5/1/2/5/2 | 60 | DEFER; current Python runtime is MLX on Apple Silicon; CUDA is roadmap, not Linux-x86 support |
| OpenViking | 3/4/4/2/3/0/2 | 57 | DEFER; AGPL-3.0 is a hard gate for code reuse/network deployment |
| Agent Reach | 3/4/1/2/3/2/2 | 52 | REJECT/DEFER; account cookies/sessions, remote scraping and proxy/ToS exposure are not acceptable defaults |
| ASR4ALL | 1/3/5/2/3/1/5 | 51 | REJECT for RU/TH; model card says English-only and weights use FUTO Restricted Use terms |
| GPT Pilot | 2/3/2/2/1/1/2 | 40 | REJECT; upstream security/supply-chain incident makes it unsuitable for import |
| Open-Generative-AI | 1/3/0/2/3/3/2 | 37 | REJECT; hosted MuAPI dependency and remote data path conflict with local-first requirements |
| Grok Register | 0/0/0/0/0/0/0 | 0 | REJECT; bulk account registration/credential automation is outside project scope |
| Turnitout Humanizer | 0/0/0/0/0/0/0 | 0 | REJECT; detector-evasion/plagiarism workflow is not an acceptable product capability |
| Sora API | 0/0/0/0/0/0/0 | 0 | REJECT; API is retired |

### Cross-category findings and decisions

- **ASR:** Qwen3-ASR-0.6B is the broadest current RU/TH candidate; GigaAM Multilingual is a stronger low-footprint Russian candidate but does not list Thai ASR; T-one is a Russian telephony specialist; Vosk small-RU is a tiny legacy baseline. Typhoon is Thai-focused but its evidence is NeMo/H100-centric. VibeASR BitNet is fast on CPU in Microsoft's own AMD EPYC benchmark, but its model-card language list excludes RU and TH. Do not select by model-card language count alone; benchmark on one RU/EN/TH golden set with WER/CER, RTF, peak RSS, cold start and chunk latency.
- **ASR license separation:** Qwen model/checkpoint, GigaAM weights, T-one conversion artifact, Typhoon weights, Nemotron OpenMDW-1.1, Piper engine/voices and Silero models have separate terms. Code license does not clear model/voice/data rights.
- **Document conversion:** MarkItDown is the lightest first pilot, but use only `convert_local()` or a bounded stream for local inputs; never pass untrusted paths/URIs to permissive `convert()`. Enforce path allowlists and block loopback/link-local/metadata destinations; run in a restricted worker. Docling is the richer local/air-gapped parser for scanned PDFs and Office formats, but use slim extras and audit every selected model license/resource footprint.
- **Durability:** keep the existing AgentRun SQLite prototype as the baseline. PydanticAI, LangGraph, Temporal, DBOS and Restate are architecture comparisons, not a reason to replace the store. Temporal's LangGraph plugin was Public Preview at review time and adds a separate operational service.
- **Sandboxing:** gVisor, OpenShell and Firecracker remain candidates only after the actual VPS kernel, privileges, cgroups, container runtime and KVM availability are verified. Docker isolation alone is not a sufficient security claim.
- **Protocols and UI:** A2A, ACP, AG-UI and MCP are protocol references. WCAG 2.2, Apple HIG and GOV.UK error-message guidance are UI acceptance references. None is a substitute for product permissions, capability checks or keyboard/accessibility tests.
- **Skills and developer tools:** use Agent Skills, ECC, Superpowers, Impeccable and CLI-Anything as reviewed patterns; do not import broad plugin suites, execute third-party skills or grant them credentials by default. Graphify remains developer-only.
- **No new runtime dependency or model was installed/downloaded during this portfolio pass.** The Vosk archive's acquisition/hash state remains the separate checkpoint above. No external source has been promoted to IMPLEMENTED or VERIFIED by this review alone.
