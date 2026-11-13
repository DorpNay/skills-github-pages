# aLandi Intelligence / Source Register (INTEL.md)

**Review date:** 2026-11-13. Recheck upstream releases and model cards before shipping an artifact. Recheck upstream releases and model cards before shipping an artifact.

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
- Current Piper engine: https://github.com/OHF-Voice/piper1-gpl and https://github.com/OHF-Voice/piper1-gpl/docs/VOICES.md
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


## Consolidated external source inventory (snapshot: 2026-11-04)

This is the single navigational inventory for external upstreams referenced by the curated project source lists. The original catalogs remain the evidence/context records; this table deduplicates exact URLs and records where each reference was found. A link is **not** an adoption, license approval, verified current state, or download authorization. Recheck upstream version, exact artifact/model/voice license, checksum, redistribution terms and relevance before obtaining or shipping files.

**Catalog coverage:** `INTEL.md`; `docs/OPEN_SOURCE_TRIAGE_RU.md`; `docs/TECHNIQUE_REGISTER_RU.md`; `docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md`; `docs/MULTIMODAL_MODEL_STACK_RU.md`; research catalogs in PR #125 (Agent Studio), #128 (Agent Workforce/VERT), #129 (Voice 2.0), #130 (Deep Research 2.0), plus open-source feature extraction and multimodal research branches. Source docs are not merged into main by this register.

**Snapshot extraction:** 257 distinct URLs, deduplicated from curated Markdown links and raw URLs in INTEL; provenance column records catalog(s). This is a link inventory, not a claim that every referenced upstream has been independently revalidated today.

| Source / resource | Canonical URL | Found in |
|---|---|---|
| - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder> | INTEL.md |
| - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia> | INTEL.md |
| - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API> | INTEL.md |
| - Current Piper engine:  and | <https://github.com/OHF-Voice/piper1-gpl> | INTEL.md |
| - Current Piper engine:  and | <https://github.com/OHF-Voice/piper1-gpl/docs/VOICES.md> | INTEL.md |
| - DigitalPlat Dev / FreeDomain terms: | <https://www.digitalplat.org/> | INTEL.md |
| - Google OAuth web-server flow: | <https://developers.google.com/identity/protocols/oauth2/web-server> | INTEL.md |
| - Google Vertex AI Veo: official API reference lists Veo 3.1 models and long-running video generation; needs Google Cloud project, IAM and billing/storage setup. Source: | <https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation> | INTEL.md |
| - JSON Patch: | <https://www.rfc-editor.org/rfc/rfc6902.html> | INTEL.md |
| - JSON Schema validator, version/license:  (MIT; current pinned dependency is 4.26.0 in gateway requirements). | <https://pypi.org/project/jsonschema/> | INTEL.md |
| - Luma Agents API: current docs describe Ray 3.2 video generation/edit/reframe. Source: | <https://docs.agents.lumalabs.ai/guides/videos/> | INTEL.md |
| - MDN documents pointer lifecycle events including pointerdown, pointerup, and pointercancel. Long-press UIs should clear timers on cancel and keep targets large enough for touch. Source: | <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events> | INTEL.md |
| - MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file> | INTEL.md |
| - MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept> | INTEL.md |
| - Microsoft LazyGraphRAG: | <https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/> | INTEL.md |
| - Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport> | INTEL.md |
| - Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport> | INTEL.md |
| - Moonshine upstream license terms: | <https://github.com/moonshine-ai/moonshine/blob/main/LICENSE> | INTEL.md |
| - OAuth security BCP: | <https://www.rfc-editor.org/rfc/rfc9700.html> | INTEL.md |
| - OCI shape/product details and availability:  and | <https://www.oracle.com/cloud/compute/> | INTEL.md |
| - OCI shape/product details and availability:  and | <https://www.oracle.com/cloud/free/> | INTEL.md |
| - ONNX standard:  (Apache-2.0). Runtime and model artifact licenses are tracked separately from the ONNX format. | <https://github.com/onnx/onnx> | INTEL.md |
| - OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources:  and | <https://developers.openai.com/api/docs/guides/image-generation> | INTEL.md |
| - OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources:  and | <https://developers.openai.com/api/docs/guides/tools-image-generation> | INTEL.md |
| - OpenAI Sora 2 / Videos API: official current API pages state the models and Videos API were shut down on 2026-09-24 and no one-to-one replacement API is available. Do not implement the retired endpoint. Source: | <https://developers.openai.com/api/docs/guides/video-generation> | INTEL.md |
| - OpenTelemetry Python official docs: | <https://opentelemetry.io/docs/languages/python/instrumentation/> | INTEL.md |
| - orjson:  and | <https://github.com/ijl/orjson> | INTEL.md |
| - orjson:  and | <https://pypi.org/project/orjson/> | INTEL.md |
| - PyO3 native bridge:  (dual MIT/Apache-2.0). | <https://github.com/PyO3/pyo3> | INTEL.md |
| - Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source:  and | <https://docs.dev.runwayml.com/api/> | INTEL.md |
| - Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source:  and | <https://docs.dev.runwayml.com/guides/using-the-api/> | INTEL.md |
| - Silero TTS/model collection:  and | <https://github.com/snakers4/silero-models> | INTEL.md |
| - Silero TTS/model collection:  and | <https://github.com/snakers4/silero-models/wiki/Licensing-and-Tiers> | INTEL.md |
| - Silero VAD:  and | <https://github.com/snakers4/silero-vad> | INTEL.md |
| - Silero VAD:  and | <https://github.com/snakers4/silero-vad/blob/master/LICENSE> | INTEL.md |
| - SSRF guidance: | <https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html> | INTEL.md |
| - uv:  and | <https://docs.astral.sh/uv/> | INTEL.md |
| - uv:  and | <https://github.com/astral-sh/uv> | INTEL.md |
| - Vosk API source:  (Apache-2.0 code). | <https://github.com/alphacep/vosk-api> | INTEL.md |
| - Vosk model catalogue: | <https://alphacephei.com/vosk/models> | INTEL.md |
| - Vulture project:  and | <https://github.com/jendrikseipp/vulture> | INTEL.md |
| - Vulture project:  and | <https://pypi.org/project/vulture/> | INTEL.md |
| A2A | <https://a2a-protocol.org/latest/specification/> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| ACP | <https://agentclientprotocol.com/protocol/v2/overview> | PR #125 · Agent Studio research |
| AG-UI | <https://docs.ag-ui.com/spec/1.0> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| AG-UI spec | <https://docs.ag-ui.com/> | PR #128 · Agent Workforce research |
| AG2 | <https://github.com/ag2ai/ag2> | PR #125 · Agent Studio research |
| Agent Skills | <https://agentskills.io/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Agent Skills specification | <https://agentskills.io/specification> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| Agent-Reach | <https://github.com/Panniantong/Agent-Reach> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| AgentScope | <https://github.com/agentscope-ai/agentscope> | PR #125 · Agent Studio research |
| AgentTeams | <https://github.com/agentscope-ai/AgentTeams> | PR #128 · Agent Workforce research |
| AI Engineering from Scratch | <https://github.com/rohitg00/ai-engineering-from-scratch> | docs/TECHNIQUE_REGISTER_RU.md |
| AirLLM | <https://github.com/lyogavin/airllm> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| Alertmanager | <https://github.com/prometheus/alertmanager> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Anything-to-Skill | <https://github.com/asale-ai/anything-to-skill> | PR #125 · Agent Studio research |
| AppFlowy | <https://github.com/AppFlowy-IO/AppFlowy> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Argo CD | <https://github.com/argoproj/argo-cd> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| ASR4ALL-L | <https://huggingface.co/futo-org/asr4all-l> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| ASR4ALL-S | <https://huggingface.co/futo-org/asr4all-s> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| AutoGen → Microsoft Agent Framework migration | <https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/> | PR #125 · Agent Studio research |
| AutoGPT | <https://github.com/Significant-Gravitas/AutoGPT> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Awesome Agentic Patterns | <https://github.com/nibzard/awesome-agentic-patterns> | PR #125 · Agent Studio research |
| Awesome Agentic Patterns | <https://agentic-patterns.com/> | PR #125 · Agent Studio research |
| Awesome Agents | <https://github.com/kyrolabs/awesome-agents> | PR #125 · Agent Studio research |
| Awesome Compose | <https://github.com/docker/awesome-compose> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Awesome Harness Engineering | <https://github.com/ai-boost/awesome-harness-engineering> | PR #125 · Agent Studio research |
| Berkeley Function-Calling Leaderboard | <https://gorilla.cs.berkeley.edu/leaderboard.html> | PR #125 · Agent Studio research |
| Book-to-Skill | <https://github.com/virgiliojr94/book-to-skill> | PR #125 · Agent Studio research |
| book-to-skill v1.3.0 | <https://github.com/virgiliojr94/book-to-skill/releases/tag/v1.3.0> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Browser Use | <https://github.com/browser-use/browser-use> | PR #125 · Agent Studio research |
| Bruno | <https://github.com/usebruno/bruno> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Cactus Needle | <https://github.com/cactus-compute/needle> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| CAMEL-AI | <https://github.com/camel-ai/camel> | PR #125 · Agent Studio research |
| Canary 180M Flash | <https://huggingface.co/nvidia/canary-180m-flash> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Cedar | <https://docs.cedarpolicy.com/> | PR #125 · Agent Studio research |
| checkpointers | <https://docs.langchain.com/oss/python/langgraph/checkpointers> | PR #125 · Agent Studio research |
| Claudex Loop | <https://github.com/chaseai-yt/claudex-loop> | docs/TECHNIQUE_REGISTER_RU.md |
| CLI-Anything | <https://github.com/HKUDS/CLI-Anything> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| Colibri | <https://github.com/JustVugg/colibri> | PR #128 · Agent Workforce research |
| Comfy API v2 | <https://docs.comfy.org/api-reference/v2/overview> | PR #130 · Deep Research research |
| Coucou | <https://github.com/Louis-CFM/coucou> | PR #125 · Agent Studio research |
| CrewAI | <https://docs.crewai.com/en/index> | PR #125 · Agent Studio research |
| DBOS | <https://docs.dbos.dev/architecture> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #125 · Agent Studio research |
| DBOS Durable Execution | <https://docs.dbos.dev/> | PR #128 · Agent Workforce research |
| DBX | <https://github.com/t8y2/dbx> | PR #125 · Agent Studio research |
| DeepSeek-OCR / DeepSeek-OCR2 | <https://github.com/deepseek-ai/DeepSeek-OCR> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| DeerFlow 2.0 | <https://github.com/bytedance/deer-flow> | PR #128 · Agent Workforce research |
| Developer Roadmap | <https://github.com/kamranahmedse/developer-roadmap> | docs/TECHNIQUE_REGISTER_RU.md |
| DevOps Exercises | <https://github.com/bregman-arie/devops-exercises> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Distil-Whisper | <https://github.com/huggingface/distil-whisper> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Docker sandbox | <https://docs.openhands.dev/openhands/usage/sandboxes/docker> | PR #125 · Agent Studio research |
| Docling supported formats | <https://docling-project.github.io/docling/usage/supported_formats/> | PR #130 · Deep Research research |
| dots.ocr → dots.mocr | <https://github.com/studio-dots-ai/dots.ocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| DrawDB | <https://github.com/drawdb-io/drawdb> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| dsh-our-free-model | <https://github.com/ebony-vinyl/dsh-our-free-model> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| dsh-our-free-model | <https://github.com/Ebony-Vinyl/dsh-our-free-model> | PR #128 · Agent Workforce research |
| EoT Bench | <https://github.com/livekit/eot-bench> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Every App | <https://github.com/every-app/every-app> | docs/TECHNIQUE_REGISTER_RU.md |
| Everything Claude Code / ECC | <https://github.com/affaan-m/ECC> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| File System Access API draft | <https://wicg.github.io/file-system-access/> | PR #130 · Deep Research research |
| Firecracker jailer | <https://github.com/firecracker-microvm/firecracker/blob/master/docs/jailer.md> | PR #125 · Agent Studio research |
| Free Programming Books | <https://github.com/EbookFoundation/free-programming-books> | docs/TECHNIQUE_REGISTER_RU.md |
| GAIA | <https://huggingface.co/gaia-benchmark> | PR #125 · Agent Studio research |
| garak | <https://docs.garak.ai/garak/> | PR #125 · Agent Studio research |
| GitIngest | <https://github.com/coderamp-labs/gitingest> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| GitMCP | <https://github.com/idosal/git-mcp> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| GitReverse | <https://github.com/filiksyos/gitreverse> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| GLM-OCR | <https://github.com/zai-org/glm-ocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Google ADK | <https://google.github.io/adk-docs/> | PR #125 · Agent Studio research |
| Google Online Boutique | <https://github.com/GoogleCloudPlatform/microservices-demo> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| google/adk-python | <https://github.com/google/adk-python> | PR #125 · Agent Studio research |
| Goose | <https://github.com/block/goose> | PR #128 · Agent Workforce research |
| GOT-OCR 2.0 | <https://github.com/Ucas-HaoranWei/GOT-OCR2.0> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| GPT Pilot | <https://github.com/Pythagora-io/gpt-pilot> | PR #128 · Agent Workforce research |
| Graphify | <https://github.com/Graphify-Labs/graphify> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Graphiti | <https://github.com/getzep/graphiti> | PR #125 · Agent Studio research |
| Grok Register | <https://github.com/AaronL725/grok-register> | PR #125 · Agent Studio research |
| gVisor security model | <https://gvisor.dev/docs/architecture_guide/security/> | PR #125 · Agent Studio research |
| Harness² | <https://github.com/google-research/harness2> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| Harper | <https://github.com/Automattic/harper> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Hatchet durable tasks | <https://docs.hatchet.run/v1/durable-tasks> | PR #125 · Agent Studio research |
| Hermes Agent | <https://github.com/NousResearch/hermes-agent> | PR #125 · Agent Studio research |
| Hive | <https://github.com/aden-hive/hive> | PR #128 · Agent Workforce research |
| Hive Apache-2.0 license | <https://github.com/aden-hive/hive/blob/main/LICENSE> | PR #128 · Agent Workforce research |
| Hono | <https://github.com/honojs/hono> | docs/TECHNIQUE_REGISTER_RU.md |
| Hugging Face smolagents | <https://huggingface.co/docs/smolagents/examples/multiagents> | PR #125 · Agent Studio research |
| Hugging Face Transformers | <https://github.com/huggingface/transformers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| HunyuanOCR-1.5 | <https://github.com/Tencent-Hunyuan/HunyuanOCR> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| HyperFrames | <https://github.com/heygen-com/hyperframes> | PR #125 · Agent Studio research |
| Impeccable | <https://github.com/pbakaus/impeccable> | PR #125 · Agent Studio research |
| Inspect AI | <https://inspect.aisi.org.uk/> | PR #125 · Agent Studio research |
| Jev Ultrafast | <https://github.com/browser-use/jev-ultrafast> | PR #125 · Agent Studio research |
| josstei/maestro-orchestrate | <https://github.com/josstei/maestro-orchestrate> | PR #125 · Agent Studio research |
| Kev-4B | <https://benchlm.ai/compare/glm-5-3-flash-vs-kev-4b> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Kubernetes Examples | <https://github.com/kubernetes/examples> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Langfuse tracing | <https://langfuse.com/docs/observability/get-started> | PR #125 · Agent Studio research |
| LangGraph | <https://docs.langchain.com/oss/python/langgraph/graph-api> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| LangGraph docs | <https://docs.langchain.com/oss/python/langgraph/overview> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| Letta | <https://docs.letta.com/> | PR #125 · Agent Studio research |
| LightOnOCR-3-4B | <https://huggingface.co/lightonai/LightOnOCR-3-4B> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| LiveKit Agent speech/audio | <https://docs.livekit.io/agents/multimodality/audio/> | PR #129 · Voice research; PR #130 · Deep Research research |
| LiveKit Agents | <https://github.com/livekit/agents> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| LiveKit turn handling | <https://docs.livekit.io/agents/logic/turns/> | PR #129 · Voice research; PR #130 · Deep Research research |
| llama.cpp server | <https://github.com/ggml-org/llama.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Magentic-One paper | <https://arxiv.org/html/2411.04468> | PR #125 · Agent Studio research |
| MagpieTTS 357M | <https://huggingface.co/nvidia/magpie_tts_multilingual_357m> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| MarkItDown | <https://github.com/microsoft/markitdown> | PR #130 · Deep Research research |
| MCP | <https://modelcontextprotocol.io/specification/2026-07-28> | PR #125 · Agent Studio research |
| MCP specification | <https://modelcontextprotocol.io/specification> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| MCP-Scan | <https://invariantlabs-ai.github.io/docs/mcp-scan/> | PR #125 · Agent Studio research |
| MDN OPFS | <https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system> | PR #130 · Deep Research research |
| Mem0 | <https://docs.mem0.ai/> | PR #125 · Agent Studio research |
| memvid | <https://github.com/memvid/memvid> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| MetaGPT | <https://github.com/FoundationAgents/MetaGPT> | PR #125 · Agent Studio research |
| Microsoft Agensh | <https://github.com/microsoft/Agensh> | PR #128 · Agent Workforce research |
| Microsoft Agent Framework | <https://github.com/microsoft/agent-framework> | PR #125 · Agent Studio research |
| Microsoft Research project | <https://aka.ms/magentic-one> | PR #125 · Agent Studio research |
| Minikube | <https://github.com/kubernetes/minikube> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| MIT license | <https://github.com/bytedance/deer-flow/blob/main/LICENSE> | PR #128 · Agent Workforce research |
| Moonshine Voice | <https://github.com/moonshine-ai/moonshine> | docs/TECHNIQUE_REGISTER_RU.md; docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| multi-agent routing | <https://docs.openclaw.ai/concepts/multi-agent/> | PR #125 · Agent Studio research |
| NaiboWang/EasySpider | <https://github.com/NaiboWang/EasySpider> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Nanochat | <https://github.com/karpathy/nanochat> | PR #128 · Agent Workforce research |
| Nemotron 3.5 ASR 0.6B | <https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| NemotronLabs VoiceChat 11B | <https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| NVIDIA Nemotron Streaming ASR | <https://build.nvidia.com/nvidia/nemotron-asr-streaming/modelcard> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| NVIDIA OpenShell | <https://github.com/NVIDIA/OpenShell> | PR #125 · Agent Studio research |
| obra/superpowers | <https://github.com/obra/superpowers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Octos | <https://github.com/octos-org/octos> | PR #128 · Agent Workforce research |
| official notice | <https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Official runtime | <https://github.com/NVIDIA/NeMo-Speech.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Open Multi-Agent (OMA) | <https://github.com/open-multi-agent/open-multi-agent> | PR #128 · Agent Workforce research |
| Open Notebook | <https://github.com/lfnovo/open-notebook> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Open Policy Agent | <https://openpolicyagent.org/docs> | PR #125 · Agent Studio research |
| Open-Generative-AI | <https://github.com/Anil-matcha/Open-Generative-AI> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| OpenAI Agents SDK | <https://openai.github.io/openai-agents-python/> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| OpenClaw skills and channels | <https://docs.openclaw.ai/concepts/features> | PR #125 · Agent Studio research |
| OpenClaw subagents | <https://docs.openclaw.ai/subagents> | PR #125 · Agent Studio research |
| OpenHands SDK | <https://docs.openhands.dev/sdk/arch/overview> | PR #125 · Agent Studio research |
| OpenMAIC | <https://github.com/THU-MAIC/OpenMAIC> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| OpenTelemetry GenAI conventions | <https://opentelemetry.io/docs/specs/semconv/gen-ai/> | PR #125 · Agent Studio research |
| OpenWOP v2 | <https://openwop.dev/spec/v2/> | PR #125 · Agent Studio research |
| orchestration guide | <https://developers.openai.com/api/docs/guides/agents/orchestration> | PR #125 · Agent Studio research |
| OWASP Agentic Top 10 2026 | <https://genai.owasp.org/download/52117/> | PR #125 · Agent Studio research |
| PaddleOCR-VL-1.6 | <https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| paper | <https://arxiv.org/pdf/2609.21967.pdf> | PR #129 · Voice research |
| paper arXiv:2609.26781 | <https://arxiv.org/abs/2609.26781> | PR #128 · Agent Workforce research |
| Paperclip | <https://github.com/paperclipai/paperclip> | PR #125 · Agent Studio research |
| PentAGI | <https://github.com/vxcontrol/pentagi> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| PinchTab | <https://github.com/pinchtab/pinchtab> | PR #125 · Agent Studio research |
| Pipecat | <https://github.com/pipecat-ai/pipecat> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| Pipecat documentation | <https://docs.pipecat.ai/> | PR #129 · Voice research; PR #130 · Deep Research research |
| Plandex | <https://github.com/plandex-ai/plandex> | PR #128 · Agent Workforce research |
| Pliny / L1B3RT4S | <https://github.com/elder-plinius/L1B3RT4S> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| policy schema | <https://docs.nvidia.com/openshell/how-it-works/policies/schema> | PR #125 · Agent Studio research |
| Ponytail | <https://github.com/DietrichGebert/ponytail> | docs/TECHNIQUE_REGISTER_RU.md |
| PP-OCRv6 Tiny / Medium | <https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Promptfoo eval guides | <https://www.promptfoo.dev/docs/guides/> | PR #125 · Agent Studio research |
| public-api сервер | <https://github.com/davemachado/public-api> | docs/TECHNIQUE_REGISTER_RU.md |
| public-apis/public-apis | <https://github.com/public-apis/public-apis> | docs/OPEN_SOURCE_TRIAGE_RU.md; docs/TECHNIQUE_REGISTER_RU.md |
| punkpeye/awesome-mcp-servers | <https://github.com/punkpeye/awesome-mcp-servers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| PydanticAI multi-agent | <https://pydantic.dev/docs/ai/guides/multi-agent-applications> | PR #125 · Agent Studio research |
| pyproject.toml | <https://github.com/Graphify-Labs/graphify/blob/v8/pyproject.toml> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| PyThaiNLP romanize | <https://pythainlp.org/dev-docs/api/transliterate.html> | PR #129 · Voice research |
| quickstart | <https://docs.graphify.com/quickstart> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Qwen3-ASR-0.6B | <https://github.com/QwenLM/Qwen3-ASR> | docs/MULTIMODAL_MODEL_STACK_RU.md; PR #129 · Voice research; Multimodal stack research branch |
| RAG-Anything | <https://github.com/HKUDS/RAG-Anything> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| reproduction guide | <https://github.com/microsoft/Agensh/blob/main/REPRODUCE.md> | PR #128 · Agent Workforce research |
| research repo | <https://github.com/warit-s/typhoon-asr-streaming> | PR #129 · Voice research |
| Restate actions | <https://docs.restate.dev/foundations/actions> | PR #125 · Agent Studio research |
| ripienaar/free-for-dev | <https://github.com/ripienaar/free-for-dev> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| roadmap.sh | <https://roadmap.sh> | docs/TECHNIQUE_REGISTER_RU.md |
| Roo Code | <https://github.com/RooCodeInc/Roo-Code> | PR #128 · Agent Workforce research |
| RuFlo | <https://github.com/ruvnet/ruflo> | PR #125 · Agent Studio research |
| RunMaestro/Maestro | <https://github.com/RunMaestro/Maestro> | PR #125 · Agent Studio research |
| Scrapling | <https://github.com/D4Vinci/Scrapling> | PR #128 · Agent Workforce research |
| screenshot-to-code | <https://github.com/abi/screenshot-to-code> | PR #130 · Deep Research research |
| security | <https://docs.openclaw.ai/security/> | PR #125 · Agent Studio research |
| sherpa-onnx streaming T-One Russian | <https://github.com/k2-fsa/sherpa-onnx/blob/master/docs/source/onnx/pretrained_models/online-ctc/t-one-ctc-models.rst> | PR #129 · Voice research |
| slee-persis/GVS5H | <https://github.com/slee-persis/GVS5H> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| slvDev/esp32-ai | <https://github.com/slvDev/esp32-ai> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Starter Workflows | <https://github.com/actions/starter-workflows> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Strix | <https://github.com/usestrix/strix> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Surya 2 | <https://github.com/datalab-to/surya> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| SWE-agent | <https://github.com/SWE-agent/SWE-agent> | PR #128 · Agent Workforce research |
| SWE-bench | <https://www.swebench.com/> | PR #125 · Agent Studio research |
| Tabby | <https://github.com/TabbyML/tabby> | PR #128 · Agent Workforce research |
| taste-skill | <https://github.com/Leonxlnx/taste-skill> | docs/TECHNIQUE_REGISTER_RU.md |
| Temporal | <https://docs.temporal.io/ai> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #125 · Agent Studio research |
| TensorFlow | <https://github.com/tensorflow/tensorflow> | PR #128 · Agent Workforce research |
| Trail-Code | <https://github.com/trailhq/Trail-Code> | docs/TECHNIQUE_REGISTER_RU.md |
| TurnBench | <https://github.com/SesameAILabs/turnbench> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Turnitout-Humanizer | <https://github.com/AhmadHassan-BTed/Turnitout-Humanizer> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Typhoon ASR Real-time paper | <https://arxiv.org/html/2601.13044> | PR #129 · Voice research |
| Typhoon ASR Streaming 115M | <https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| Unicode CLDR transliteration guidelines | <https://cldr.unicode.org/index/cldr-spec/transliteration-guidelines> | PR #129 · Voice research |
| Unicode ICU transforms | <https://unicode-org.github.io/icu/userguide/transforms/general/> | PR #129 · Voice research |
| Unidecode | <https://pypi.org/project/Unidecode/> | PR #129 · Voice research |
| upstream | <https://github.com/invariantlabs-ai/mcp-scan> | PR #125 · Agent Studio research |
| upstream | <https://github.com/openwop/openwop> | PR #125 · Agent Studio research |
| uroman | <https://github.com/isi-nlp/uroman> | PR #129 · Voice research |
| Utopia OS | <https://github.com/0xUrsanomics/utopia-os> | PR #125 · Agent Studio research |
| UVR5 / Ultimate Vocal Remover GUI | <https://github.com/Anjok07/ultimatevocalremovergui> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| VibeVoice ASR Streaming 1.5B | <https://huggingface.co/microsoft/VibeVoice-ASR-Streaming-1.5B> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| voicebench | <https://pypi.org/project/voicebench/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| VoxCPM2 | <https://huggingface.co/openbmb/VoxCPM2> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| whisper.cpp | <https://github.com/ggml-org/whisper.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| witr | <https://github.com/pranshuparmar/witr> | PR #125 · Agent Studio research |
| Worktrunk | <https://github.com/max-sixty/worktrunk> | PR #128 · Agent Workforce research |
| xerj-org/xerj | <https://github.com/xerj-org/xerj> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Xiryn | <https://github.com/SouravBeraAkaSpeed/xiryn> | PR #128 · Agent Workforce research |
| xtool-org/xtool | <https://github.com/xtool-org/xtool> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Zagitta/gpu-unlock | <https://github.com/Zagitta/gpu-unlock> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| ZIPFORMER VI / sherpa-onnx | <https://github.com/k2-fsa/sherpa/blob/master/docs/source/onnx/pretrained_models/offline-transducer/zipformer-transducer-models.rst> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| τ-bench | <https://github.com/sierra-research/tau-bench> | PR #125 · Agent Studio research |
| веса dots.mocr | <https://huggingface.co/dots-studio/dots.mocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |

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

## Owner-provided upstream sweep — 2026-11-07 (research only)

This pass covers the owner-supplied names. Revisions below are exact upstream branch HEADs fetched on 2026-11-07; project descriptions and license statements were checked against upstream README/license/docs or release pages. This is source validation, **not an adoption, install, download, code copy, or runtime approval**.

| Candidate / exact upstream revision | Declared code license / scope | Verified capability and relevant caveat |
|---|---|---|
| [JustVugg/flint](https://github.com/JustVugg/flint) — `610f68a53374a64046de9f46e7dcd3ae758a4778` | Apache-2.0 | Python 3.11+, Linux/WSL, standard-library core. Reversible code/JSON/text compression, focused source reads, source-version-bound edits and decision memory. Upstream demo reports one 12-record JSON example (1,226→499 bytes), not a general token-saving guarantee. |
| [airene/flint](https://github.com/airene/flint) — `e883c88997dc7c626fa45331aa1a86de7ad65d62` | MIT | Different project with the same name: local-first Developer + read-only Reviewer workspace using Codex/Claude CLI, Vue/TypeScript/Bun, SQLite and WebSockets. Human approves review feedback before it returns to the exact Developer session. **“Flint” identity remains ambiguous; do not silently choose one.** |
| [DashBeam](https://github.com/tonyantony300/dashbeam) — `b41eddb16b226667de6f8dd7f1326a0ce6bf5e7d` | AGPL-3.0 | Cross-platform P2P file transfer built on Iroh/QUIC/TLS 1.3, BLAKE3 blobs, pairing and optional self-hosted relays. Latest release inspected: v0.7.2; it fixes an `iroh-blobs` push-permission issue by updating to 0.103.1. Do not evaluate older affected dependency versions as a baseline. |
| [img2threejs](https://github.com/img2threejs/img2threejs) — `0c0c49bc168e648dbaf9c8c080474de0b3a941b6` | Apache-2.0 | Agent workflow reconstructs a reference object as procedural Three.js/TypeScript geometry, not photogrammetry or downloaded mesh assets; staged quality checks and animation-ready hierarchy. Useful only for a future image→3D creation path. |
| [ArchiveBox](https://github.com/ArchiveBox/ArchiveBox) — `ee80665df21054102cd6d6fa9f524f7924c1abef` (`dev`) | MIT | Self-hosted web preservation to HTML/PDF/PNG/TXT/JSON/WARC/SQLite, CLI and APIs; Django/Python, SQLite/filesystem and multiple extractors including Chromium/yt-dlp. Security docs warn that cookies, session state and secret URL tokens can be captured; archived JavaScript is untrusted. Private archives require strict access controls and safe replay configuration. |
| [SearXNG](https://github.com/searxng/searxng) — `ac11e14c5edf995d4d2f066bfb885a614f52a978` | AGPL-3.0-or-later | Self-hosted privacy-oriented metasearch across external engines. Official deployment docs require configuration, secret key and operational controls; limiter and image proxy are recommended. Outbound engine traffic, rate limits and public-instance abuse remain operator concerns. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) — `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846` | MIT | Coding-agent Skill/ruleset emphasizing minimal necessary code while retaining tests, security, error handling and accessibility. Upstream benchmark figures are author-reported; not independently reproduced. Existing aLandi minimal-diff rules already overlap substantially. |
| [changedetection.io](https://github.com/dgtlmoon/changedetection.io) — `09619ffddb40300e6c09374a4f6aa9af8bab0c3d` | Apache-2.0 | Self-hosted URL/page change monitoring with scheduled fetchers, Chromium for JS pages, selectors/filters and notifications/webhooks; can use local or remote LLMs for change summaries. Treat monitored URLs and browser fetches as SSRF/untrusted-network inputs; enforce allowlists, DNS/IP checks, egress and resource budgets before any integration. |
| [LocalSend](https://github.com/localsend/localsend) — `92e133aa43869e94d394fd04fa70c50a0f796a64` | Apache-2.0 | Cross-platform nearby file/message transfer over LAN without cloud. REST/HTTPS, multicast discovery, certificate fingerprints and PIN support. App does not auto-update; protocol v2.2 is separately documented at [localsend/protocol](https://github.com/localsend/protocol) (`62bd3406ec80d62f2ed46269cdc06c4dcc391083`). Protocol's browser reverse-download path uses plain HTTP because browsers reject self-signed certificates; do not expose it as a trusted browser integration. |
| [MiroFish](https://github.com/666ghj/MiroFish) — `7657031ac01184afe2cb220f5ee3545573b5e843` | AGPL-3.0 | Multi-agent social simulation with graph/memory construction, environment setup, simulation and reports. Its own FAQ says it must not be equated with a scientifically calibrated classical agent-based model; outputs are scenarios, not validated forecasts. Latest branch commit inspected is 2026-10-01, older than most candidates in this sweep. |
| [Edge-Drop](https://github.com/Deepender25/Edge-Drop) — `31ac86cfabed483960ef985e671074500df779f2` | Apache-2.0 | Windows 10/11 Electron clipboard shelf with hover activation and native drag/drop for text, links, images and files. Desktop-only OS integration; not a browser feature or cross-device transfer protocol. |
| [Craft Anything](https://github.com/storytold/craft-anything) — `f672d50f0103983ca8149d80a5103f12e91b888c` | MIT OR Apache-2.0 (dual) | Early-alpha Rust reverse-engineering/inspection + agent rebuild/check workflow; CLI/MCP and a large tool surface. Claude Code builder path is reported working; other agent adapters are not all live-verified. High-risk inspection/decompilation and generated-code execution require isolated workspaces, explicit approval and legal review. |
| [Microsoft Agent Lightning](https://github.com/microsoft/agent-lightning) — `bc3a9e80417d731744040df5d37117f9cc48005f` | MIT | Agentic RL/training framework with Trainer (verl/vLLM), API Gateway and rollout controller, including Kubernetes Jobs. Training infrastructure, GPU and dataset/reward evaluation are distinct from aLandi's inference runtime; not a fit for the current small VPS baseline. |
| [Datalab Marker](https://github.com/datalab-to/marker) — `71dd5fd7e51ab24f8624b6ba2fcb6014b4e40ed4`; [Surya](https://github.com/datalab-to/surya) — `9d5aadfebb07939755c24e8a80d0e61b3be80895` | Code Apache-2.0; Marker/Surya model weights have separate modified AI Pubs OpenRAIL-M terms | Marker parses PDF/image/PPTX/DOCX/XLSX/HTML/EPUB to Markdown/JSON/HTML and can use OCR/VLM on CPU/GPU/MPS; Surya supplies OCR/layout/table models. Datalab's hosted API is a separate service and terms/data-retention contract. **Do not infer commercial rights for weights from the code license.** Compare against current parser on the same corpus and target hardware before adoption. |
| [diagram-design](https://github.com/cathrynlavery/diagram-design) — `e57eda6102a19444538ebd611d39534fad65b663` | MIT | Agent Skill creates self-contained HTML+SVG diagrams (45 types) and brand tokens. Output is publishable but not a native editable diagram source; README itself recommends Mermaid for diagrams that need frequent Git diffs. Review `PRIVACY.md` and network behavior before installing the Skill. |
| [HarnessRouter](https://github.com/HarnessRouter/harnessrouter) — `46d2cc2167ea257f8c4c99eada5297af300b01ab` | Community Edition Apache-2.0; Starter Kits have separate terms | Unified Harness Protocol / Responses-compatible interface for external agent CLIs: sessions, streaming, files/artifacts, cancellation and structured failures. The harness CLIs retain their own licenses and are installed separately. Promising architecture reference, but requires security review of process isolation, credentials, permissions, idempotency and resource limits before any pilot. |
| [Sound Center](https://github.com/Azare77/sound_center) — `f3b465a42d12c2d702d7110838be5d8d1377dd96` | GPL-3.0-or-later | Flutter local music/podcast player with downloads, background playback and MPRIS; Android/Linux focus. It is a player, not an audio-generation engine. GPL obligations make code reuse a separate legal decision. |
| [PocketPal AI](https://github.com/a-ghorbani/pocketpal-ai) — `34f561bf8cdcf63b85ecaa58a535541bd07dd3ff` | MIT app code; each model/voice asset has its own terms | Mobile on-device LLM app with llama.cpp/GGUF, Whisper input and on-device TTS engines, offline operation and hardware acceleration. Good mobile architecture/evaluation reference; model weights, voices and optional hosted/search features need separate license/privacy review. |
| [sammyZi/pdf-tools](https://github.com/sammyZi/pdf-tools) — `6a48d60ccbbaca4dd18840b9d85f00d44b51f311` | MIT app code; third-party libraries/models retain their own terms | Android-only PDF scanner/editor with 24 tools, on-device OCR and optional Drive sync. Third-party notices list Apache-2.0 libraries plus Google ML Kit terms; DocAligner model is separately identified. Reference for mobile PDF UX, not a browser runtime dependency. |

### Triage outcome

- **Keep as research references:** all entries above. No source was downloaded, installed, copied or enabled.
- **Highest-value next evaluations:** SearXNG adapter security/quality against the current search path; Marker/Surya against the current document parser; changedetection.io as a bounded upstream-watch service; HarnessRouter only as a future harness-contract comparison; LocalSend only if a native companion is approved.
- **Do not promote by popularity or upstream claims:** MiroFish forecasts, Ponytail/img2threejs/Marker benchmark claims, and repo star counts are not aLandi eval evidence.
- **License gates:** AGPL (DashBeam, SearXNG, MiroFish), GPL (Sound Center), separate model-weight terms (Datalab/Surya, PocketPal) and third-party CLI terms (HarnessRouter) need explicit legal/provenance decisions before code or artifact reuse.
- **No automatic installation:** Skills and repos are untrusted inputs. Inspect scripts/hooks/network access, dependency manifests, permissions and licenses first; use pinned commits and isolated pilots.

### GitHub Pages / Jekyll production baseline — 2026-11-07

- GitHub's latest release for [actions/jekyll-build-pages](https://github.com/actions/jekyll-build-pages/releases) is still **v1.0.13** (published 2024-08-06); tag `v1` resolves to commit `44a6e6beabd48582f863aeeb6cb2151cc1716697`. No newer upstream release was found on 2026-11-07.
- Production main deployment #42362476364 is the GitHub-managed dynamic workflow `dynamic/pages/pages-build-deployment`, not a repository-authored deploy workflow. Its jobs explicitly pulled `ghcr.io/actions/jekyll-build-pages:v1.0.13`, passed **Build with Jekyll**, uploaded the artifact and passed **Deploy to GitHub Pages** on main `69645ff357067f3656aa77cc67336ff423c26944`.
- The separate [actions/deploy-pages](https://github.com/actions/deploy-pages/releases) latest release is v5.0.1 (2026-09-01), but this repository's current production path is GitHub-managed dynamic Pages; do not add a parallel deploy workflow or replace the working path without evidence.
- Live cache-busting fetch returned **AI Mobile Agent v10.0** for both root and `/landing/`. The current main `index.md` blob `227223d78bb3be1d07422767a29a5ec3fd8df42a` does **not** contain `ai_ui_readability_v1` or `readingFontSize`; PR #166 current branch blob `8f36175b9b906d835c1aeea89bf3a516157d0388` contains both. Therefore Pages is publishing current main correctly, but the specific §8.17 change is not on main because PR #166 is still open.


## 2026-11-08 — orchestration, retrieval, local inference, voice and artifact-hosting sweep

**Inventory baseline:** this file contains 296 distinct URL references and 175 distinct GitHub repository URLs at this snapshot. These are references, not 296 validated products. Results below were reviewed as candidates against primary docs/repositories and the aLandi target profile.

### Durable agent execution and approvals

- [Conductor durable execution semantics](https://conductor-oss.github.io/conductor/architecture/durable-execution.html): persists workflow definitions, state, task executions and queues; task delivery is at-least-once. A side effect can run twice after a worker crash, so workers need idempotency or redelivery detection. **Decision:** adopt the engineering patterns (idempotency keys, explicit retries/timeouts, bounded budgets, durable approval checkpoints and recovery drills); do not add Conductor/Temporal as another runtime to the initial 8-GB stack.
- [Temporal LangGraph plugin announcement](https://temporal.io/blog/temporal-langgraph-plugin-durable-execution), 2026-07-16: public-preview integration runs graph nodes as durable activities and supports durable human interrupts. **Decision:** source-validated; not a current dependency. Revisit only if aLandi has long-running workflows that cannot be safely resumed by its existing gateway lifecycle.
- **Scope:** aLandi's current four-stage planner → researcher → critic → synthesizer pipeline remains bounded and uses the selected model. This research does not authorize an independent multi-agent fleet or a new orchestration database.

### Code navigation and repository harness

- [Graphify](https://github.com/Graphify-Labs/graphify) remains the existing dev-only code-navigation pilot. [CodeGraph](https://github.com/optave/ops-codegraph-tool/) was verified at upstream HEAD `580aaa97e9e87fa65b4560f91113904fe75291bd`; its LICENSE is Apache-2.0 (`8b8a2fece4804db74af7474d6664a28964b0cab7`). Its README describes a local SQLite/tree-sitter graph, 34 MCP tools, architecture rules/CI gate, incremental indexing and optional local embeddings; it claims zero network calls/telemetry for the local path. Those are upstream claims, not yet independently verified. **Decision:** promote CodeGraph to PILOT CANDIDATE, not replacement. Compare 10 real aLandi navigation tasks against Graphify and direct grep/source reading; measure correct entry-point recall, call-site precision, false edges, index time, peak RAM, incremental update time and reproducibility. Do not install until the disposable pilot is ready. For critical edits, graph output remains a navigation hint; verify source and callers directly.
- [AI-native repository architecture](https://www.vikramrao.me/architecture/ai-native-repository), 2026-10-05, and [GitLab AI-assisted development playbook](https://handbook.gitlab.com/handbook/engineering/workflow/ai-assisted-development/): practitioner guidance favors one behavioral instruction file, a task-routing index, bounded read-only discovery, restricted implementation scope and deterministic CI validators. **Decision:** incorporate these principles in `AGENTS.md` and the existing orchestrator; do not copy a separate multi-agent harness or create a second backlog.

### RAG and document processing

- [Docling technical report](https://arxiv.org/html/2408.09869v4): MIT-licensed structured document representation supports text, tables, pictures, hierarchy, page and bounding-box provenance. The report's older x86 CPU benchmark measured 0.79 s/page median and 16.3 s/page p95; OCR averaged 13 s/page in that setup. A separate [Docling 2.148.0 performance measurement](https://docling.org/performance/) (2026-11-06, one 9-page PDF on 4 vCPUs / 15 GB RAM) reports 6.6 s/page default, 1.8 s/page with OCR disabled, and ~15 s/page for scanned input. These are different datasets/configurations, not directly comparable. **Decision:** retain parser → structured elements → provenance → retrieval → citations as the design pattern; gate OCR by document type and budget; benchmark a representative aLandi corpus before choosing an ingestion worker.
- [RAG-Anything failure-mode guide](https://github.com/HKUDS/RAG-Anything/blob/main/docs/multimodal_rag_failure_modes.md): useful failure probes include merged/flattened tables, retrieval biased toward surrounding text instead of images/tables, and confusing slow OCR with a hang. **Decision:** add these as evaluation cases when multimodal ingestion is next changed; do not install the full framework.
- Keep the existing scoped RAG, evidence ledger, citations and retrieval evaluation. A multimodal parser is not proof of multimodal retrieval quality; probe each modality independently.

### Local inference and speech

- [llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/HEAD/tools/server/README.md): OpenAI-compatible APIs, parallel decoding, continuous batching, speculative decoding, CPU/GPU offload and quantized KV cache are supported. **Decision:** retain Ollama for the current runtime; benchmark llama.cpp only if a measured bottleneck (memory, concurrency, throughput or API capability) justifies a controlled alternative.
- [Qwen3-ASR upstream](https://github.com/QwenLM/Qwen3-ASR) supports 0.6B/1.7B models and 52 languages/dialects including Russian and Thai; the [official Hugging Face 0.6B model card](https://huggingface.co/Qwen/Qwen3-ASR-0.6B) declares Apache-2.0 and lists 1.88 GB unquantized weights. The upstream Python streaming example uses vLLM; [sherpa-onnx Qwen3-ASR docs](https://k2-fsa.github.io/sherpa/onnx/qwen3-asr/index.html) separately provide an int8 0.6B export and CPU/mobile streaming paths. **Decision:** high-priority ASR candidate for a bounded RU/TH benchmark, not installed or selected yet. Pin the exact sherpa artifact/revision/hash; measure peak RSS, RTF, p50/p95 latency, WER/CER and cancellation before promotion.
- [Moonshine available models](https://moonshine-voice.readthedocs.io/en/latest/models/available-models/): current streaming MIT models cover several languages, but the current table does not include Russian or Thai; older non-streaming non-English models can carry the Community License. **Decision:** not the default RU/TH candidate; check each exact model/license separately.
- [OpenVoiceStream](https://github.com/Seeed-Solution/openvoicestream) was verified at upstream HEAD `151b156dee2eb67f710df8347d1b4ddb449f2787`; LICENSE is MIT (`5d684641646a1cc872cd9a9f040a37b77ec618bc`). Its README is hardware-first (Jetson, Rockchip, Hailo, Raspberry Pi), with per-accelerator quantization and target-specific runtimes. **Decision:** useful edge-voice reference if a dedicated device is selected; not a generic 8-GB x86 VPS stack and not installed.

### Model and binary acquisition policy — hard platform constraint

- [GitHub repository limits](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits): regular Git objects above 100 MiB are blocked; GitHub recommends Git LFS for large binaries and keeping repository health manageable.
- [Git LFS documentation](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage): Git LFS stores pointer files, not the model bytes, and **Git LFS cannot be used with GitHub Pages sites**.
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits): Pages source repositories are recommended at ≤1 GB and published sites are limited to 1 GB.
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases): each release asset must be under 2 GiB.
- **Decision:** keep code, manifests, downloader/verification scripts, licenses and SHA-256 provenance in the repository. Store weights in a dedicated model cache/registry or a governed Release asset when per-file size and redistribution rights allow. Never put weights into the Pages-published tree or commit an unbounded model corpus. User authorization to acquire useful artifacts does not waive license, size, security or target-hardware checks.

- **Existing source snapshots:** selected RAG-Anything v1.4.1 and Memvid v2.0.140 source files already exist under `docs/upstream-archive/` on main. Their archived `raganything/parser.py` and `src/types/manifest.rs` Git blob SHA-1 values exactly match the official upstream tags. PR #169 adds the exact upstream MIT / Apache-2.0 LICENSE files and `UPSTREAM-MANIFEST.yaml` records (tag, full commit SHA, package license, archive scope and verified file hashes). These snapshots are research/reference only, not runtime dependencies. `.graphifyignore` now excludes them from the first-party architecture graph.

**Batch outcome:** techniques accepted for bounded use: idempotent side effects, durable checkpoints/approval records where needed, modality-specific RAG probes, source/page/bbox provenance, exact model artifact pinning and measured model evaluation. Framework/runtime replacements remain DEFERRED pending a concrete baseline failure.


## Source review — repository orchestration and durable handoff (2026-11-08)

**Research batch:** owner-requested cross-cutting sweep across agent execution, repository orientation, CI/release controls and security. Findings are source-derived; product adoption below is a separate aLandi proposal.

### Primary / practitioner references

- [OpenAI Agents SDK — Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents): explicit runner loop, select one state continuation strategy per conversation, await stream completion, resume paused approval from state rather than treating it as a new turn, distinguish expected pauses from runtime/validation failure.
- [OpenAI Agents SDK — Multi-agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/): manager-as-tools vs handoff are distinct ownership contracts; use structured outputs/code routing for deterministic control where appropriate; invest in specialized tasks, monitoring and evals.
- [Temporal — LangGraph plugin durable execution (2026-07-16)](https://temporal.io/blog/temporal-langgraph-plugin-durable-execution) and [Temporal AI durable orchestration](https://docs.temporal.io/ai): checkpointing state is not itself durable execution; recovery requires an execution journal/runner, retries, durable waits/approval and trace propagation. Temporal is vendor documentation; infrastructure cost/operational fit must be evaluated, not assumed.
- [LangGraph — workflows and agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents) and [checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers): explicit graph/checkpoint boundaries aid inspection and resume, but replayed nodes and side effects need idempotency and intentional durability modes.
- [GitLab AI-assisted development playbook](https://handbook.gitlab.com/handbook/engineering/workflow/ai-assisted-development/): tests and structural constraints should persist in CI/repository rather than prompt-only; use characterization tests before refactors; root instructions route to canonical detail.
- [GitHub — Beyond code generation: agentic engineering (2026-11-06)](https://github.blog/ai-and-ml/github-copilot/beyond-code-generation-a-developers-guide-to-agentic-engineering/): agree requirements/acceptance first, break into bounded issue/task work, plan/review before implementation.
- [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) and [Graphify architecture docs](https://docs.graphify.com/concepts/architecture): code-only AST extraction can be deterministic/local, while semantic docs/media indexing may call a model; extracted vs inferred edges should be distinguished. Graph output is a navigation aid, not proof or complete static analysis.
- [GitHub — required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks): required checks must match latest SHA; earlier SHA success does not satisfy current HEAD.
- [GitHub — merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue): queue checks run on the combined latest-base commit and need merge_group event support. Useful if concurrent PR throughput increases; not a reason to add a queue without validating repo settings/workflow triggers.
- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site): Pages Actions publication has build → artifact → deployment steps; verify actual deployment/public content separately from CI build.
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) and [NIST AI RMF / GenAI profile](https://www.nist.gov/itl/ai-risk-management-framework): risk framework references for agency, data disclosure, injection, supply chain and governance; use as threat/eval coverage, not as runtime permission engine.

### Reusable findings and aLandi fit

1. **One writer, bounded slice; parallelize read-only discovery.** Shared repo writes and sequential dependent updates otherwise cause PR proliferation, stale snapshots and conflicting checkpoints.
2. **External durable state is the recovery contract.** Persist task ID, current main/base/head/tested SHA, exact run IDs/results, diff summary, blocker, rollback and next action in GitHub canonical records; never depend on chat memory.
3. **One canonical task inventory + one systems map + one navigation index.** Root instructions stay concise and route to deeper source files; do not clone the backlog into agent memories.
4. **Tests/CI encode invariants.** Owner rules like no dangling completed PR, exact-head gating, provider exclusivity, Pages live-SHA verification and permission boundaries should be executable checks where feasible, not prompt-only wishes.
5. **Checkpointing vs durable execution is a distinct architectural decision.** Current bounded same-model pipeline/AgentRun prototype does not yet require Temporal/LangGraph runtime. Adopt a durable engine only after measured long-running recovery/approval demand, failure-injection evals, idempotency contract and target-host budget justify operations.
6. **Graphify supports navigation, not authority.** Read the graph/report plus source/test call sites; label inferred links; account for parser gaps, excluded test files and token-budget truncation. Never mark feature implemented from graph output.
7. **Merge discipline:** exact current-head required checks, compatibility/diff review, guarded merge, post-merge main checks and Pages deployment/content check; completed PR is closed immediately. Draft/HOLD/future work remains parked only by explicit scope/owner decision and durable recorded disposition.
8. **Source and artifact admission:** source exact revision, code/model/data licenses separately, integrity hash, provenance, maintenance, security, resource fit, isolated pilot and rollback. No mass model downloads and no weights in Pages source tree/Git LFS.

**Adoption status:** operating-method proposal applied to the PR #169 English AGENTS contract and append-only owner task register; not yet merged/verified on main. No orchestration engine, model, plugin, or dependency was installed/adopted in this research batch.


### Artifact acquisition checkpoint — pinned source snapshots (2026-11-08)

Owner-authorized, license/provenance-gated source import in PR #169: Memvid v2.0.140 curated 22-file subset under Apache-2.0 (upstream commit e18fe55494379e2ab7397ce03655e8abbc5e0c31) and RAG-Anything v1.4.1 selected 18 source files plus exact MIT license (upstream commit 0ef67b4d476b66407a03a39e5b17e756fc0aef29). Each selected source file Git blob SHA-1 was matched to its pinned upstream commit; Memvid upstream per-file SHA-256 values retained but not recomputed. The snapshots are incomplete research references, not buildable mirrors; transitive libraries/models/datasets are separately licensed. `ship=false`, no runtime dependency/model installed, no deployment. Whole selected archive SHA-256 remains OPEN.


## PR #131 / #125 source intake — 2026-11-08 (candidate batch; not yet current-version reviewed)

The following 103 distinct URL references were absent from the existing INTEL register and were found in the preserved research/spec snapshots from PR #131 and PR #125. They are retained for source-by-source thematic review; source presence is not endorsement/adoption. See the linked canonical research documents under `docs/`. Review in 8–15 source batches, record exact version/license/provenance and baseline comparisons before adoption.

| URL | Origin research document | Review status |
|---|---|---|
| `https://ai.google.dev/gemini-api/docs/veo` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://ai.google.dev/gemma/docs/core/model_card_3` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://developer.chrome.com/docs/capabilities/web-apis/file-system-access` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md, LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-text` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.comfy.org/api-reference/v2/jobs/job-status-the-polling-workhorse` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.comfy.org/api-reference/v2/jobs/request-cancellation` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.comfy.org/api-reference/v2/jobs/submit-a-workflow-for-execution` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.dev.runwayml.com/llms.txt` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reference/managing-and-standardizing-pull-requests` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.letta.com/v1-sdk/memory/archival-memory/index.md` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.letta.com/v1-sdk/memory/memory-blocks/index.md` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.livekit.io/agents/logic/turns/vad/` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.mistral.ai/models/ministral-3-3b-25-12` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.ollama.com/api/tags` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openhands.dev/openhands/usage/sandboxes/overview` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openhands.dev/openhands/usage/sandboxes/process` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openviking.ai/en/getting-started/02-quickstart` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://fastapi.tiangolo.com/reference/security/` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://ffmpeg.org/` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/a2aproject/A2A` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/AIEGOBOT/agent-audio` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/AnotiaWang/deep-research-web-ui` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/cedar-policy/cedar` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Comfy-Org/ComfyUI` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md, LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Comfy-Org/workflow_templates` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/crewAIInc/crewAI` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/dbos-inc/dbos-transact` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/docling-project/docling` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md, VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/docling-project/docling/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/app.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/routing.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/tests/test_app.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/tests/test_document_extraction.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/index.md` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/tests/e2e/document-attachments.spec.mjs` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/issues/111` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/firecracker-microvm/firecracker` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/ggerganov/whisper.cpp` | VOICE_IMPLEMENTATION_PLAN_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/google/gvisor` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/hatchet-dev/hatchet` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/jgm/pandoc` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/khoj-ai/khoj` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/langchain-ai/open_deep_research` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/LearningCircuit/local-deep-research` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/letta-ai/letta` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/mem0ai/mem0` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/microsoft/markitdown/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/microsoft/semantic-kernel` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/modelcontextprotocol/registry` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/nats-io/nats-server` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/NVIDIA/garak` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/open-policy-agent/OPA` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/promptfoo/promptfoo` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/pydantic/pydantic-ai` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/PyThaiNLP/pythainlp/blob/dev/LICENSE` | VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/restatedev/restate` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/samsgates/doc-parse` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/UKGovernmentBEIS/inspect_ai` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/unicode-org/icu/blob/main/LICENSE` | VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Unstructured-IO/unstructured` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/docs/FAQ.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/docs/GETTING_STARTED.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/docs/VIDEO_CONVERSION.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/README.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/vertd` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/vertd/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Wan-Video/Wan2.2` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/google/functiongemma-270m-it` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/google/gemma-4-E2B-it` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/google/gemma-4-E4B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/HuggingFaceTB/SmolLM3-3B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/ibm-granite/granite-3.3-2b-instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/ibm-granite/granite-4.2-3b` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/microsoft/Phi-4-mini-instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/openbmb/MiniCPM5-2B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3-0.6B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3-1.7B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3.5-0.8B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3.5-2B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3.5-4B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/tiiuae/Falcon-H1-1.5B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://microsoft.github.io/graphrag/query/overview/` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://openvoiceindex.com/` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md | prior research snapshot; current upstream recheck pending |
| `https://playwright.dev/docs/browsers` | SOURCE_SELECTION_AND_AUTONOMY_METHOD_RU.md | prior research snapshot; current upstream recheck pending |
| `https://playwright.dev/docs/ci` | SOURCE_SELECTION_AND_AUTONOMY_METHOD_RU.md | prior research snapshot; current upstream recheck pending |
| `https://stability.ai/license` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md | prior research snapshot; current upstream recheck pending |
| `https://web.dev/articles/storage-for-the-web` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://www.libreoffice.org/` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |


## 2026-11-13 — model, retrieval, ASR/VAD and TTS source refresh

This pass revisited sources by the active workstream rather than doing an undirected bulk import.

### Main local inference and model provenance

- Qwen3.5-4B base card: https://huggingface.co/Qwen/Qwen3.5-4B — Apache-2.0 model family, multimodal architecture and long context. The 262K model context is not a practical default on the planned 8 GB RAM host.
- Uncensored derivative: https://huggingface.co/HauhauCS/Qwen3.5-4B-Uncensored-HauhauCS-Aggressive/tree/c09cdbcdb1fefad6d335809d445621b5f5ba0c6e — pinned Q4_K_M file is 2,707,513,696 bytes; upstream LFS SHA-256 79e28ecacf84e75b6056cf4059636d435aa9eb67795780f7b7dbc7d32a962741. The “0/465 refusals” statement is the author's self-reported test, not an independent benchmark. Keep the derivative and base provenance separate.
- Main vision companion is a separate 675,568,768-byte BF16 GGUF, SHA-256 a1e32e86ea99aa7a56f3dcfe7e63c1d0be9439d31fd07087099f15bc0fda0f22.
- Ollama official import docs: https://docs.ollama.com/import — Modelfile import is documented for a single GGUF or a split GGUF set; no official separate mmproj directive was found in this pass. A third-party Ollama registry mirror advertises Qwen3.5-4B vision/tools/thinking, but its mapping to the pinned HF files is unverified. Do not treat a community mirror as the authoritative source.
- llama.cpp multimodal docs: https://github.com/ggml-org/llama.cpp/blob/5676f71a3c2a1b6e4e13f37a18c0ef3b7b16a9df/docs/multimodal.md — direct HF main GGUF + mmproj is the transparent fallback to test. Confirm the gateway can point at its OpenAI-compatible server before selecting this runtime.

### Retrieval models and API

- Qwen3-Embedding-0.6B: https://huggingface.co/Qwen/Qwen3-Embedding-0.6B/tree/97b0c614be4d77ee51c0cef4e5f07c00f9eb65b3 — Apache-2.0, 32K context, 1024 dimensions, multilingual claim 100+ languages. Exact weights acquired and SHA-256 verified: 0437e45c94563b09e13cb7a64478fc406947a93cb34a7e05870fc8dcd48e23fd.
- Qwen3-Reranker-0.6B: https://huggingface.co/Qwen/Qwen3-Reranker-0.6B/tree/e61197ed45024b0ed8a2d74b80b4d909f1255473 — Apache-2.0, 32K, 100+ languages. Official card documents SentenceTransformers CrossEncoder.predict() and rank(); raw logits are not calibrated probabilities. Exact weights acquired and SHA-256 verified: 27cd75a405b9c1b46b59abfd88aaa209e6fed2a1972cde9b70e7659537c5e65b.
- Sentence Transformers docs: https://sbert.net/docs/quickstart.html — use encode_query()/encode_document(), consistent task instructions and normalize only when the retrieval metric requires it. Keep the embedding model on ingestion/query retrieval paths, not ordinary chat.

### ASR and VAD

- Qwen3-ASR-0.6B: https://huggingface.co/Qwen/Qwen3-ASR-0.6B/tree/5eb144179a02acc5e5ba31e748d22b0cf3e303b0 — Apache-2.0, model card lists Russian, Thai, English and further languages/dialects. BF16 checkpoint acquired: 1,876,091,704 bytes, SHA-256 79d6cbd4c98c7bbffe9db2edac07f56cd6637d0d5944b27f6c2b8353840323ea.
- sherpa-onnx Qwen3-ASR INT8 release: https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models — 878,702,423-byte archive, SHA-256 393f8a14e2f5fb96746aaab342997a40641001fbd5bf9592a080a8329178ee96. Archive contains conv frontend, INT8 encoder/decoder and tokenizer assets; it is the CPU deployment challenger, not yet integrated.
- sherpa-onnx model configuration docs: https://github.com/k2-fsa/sherpa-onnx/blob/master/sherpa-onnx/c-api/docs/offline-asr.dox — Qwen3-ASR config fields include conv_frontend, encoder, decoder, tokenizer, tokens, max_total_len and max_new_tokens. Do not confuse the C API config with an implemented gateway adapter.
- Silero VAD: https://github.com/snakers4/silero-vad/tree/066409f3d9db45a30d21dfcbf9147826ffdd7052 — MIT; pinned ONNX 2,327,524 bytes, locally computed SHA-256 1a153a22f4509e292a94e67d6f9b85e8deb25b4988682b7e174c65279d8788e3.
- Whisper.cpp model: https://huggingface.co/ggerganov/whisper.cpp — large-v3-turbo Q5_0; upstream SHA-1 e050f7970618a659205450ad97eb95a18d69c9ee verified; local SHA-256 394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2. Use as a same-audio challenger, not a second always-resident ASR.

### TTS and voice licensing

- Piper runtime: https://github.com/OHF-Voice/piper1-gpl — GPL-3.0-or-later engine code. Selected Russian voice: https://huggingface.co/rhasspy/piper-voices/tree/375a0fe641dea077c2a47b4e9a056d6da521eed3/ru/ru_RU/dmitri/medium — repository card declares MIT; its voice card says the training dataset is CC0. The ONNX voice is 63,201,294 bytes, SHA-256 f073356ebc4bd0f80c5af58df2953a5988bd5bdab1eb38635ce960b071fbefcb.
- Thai F5-TTS V1: https://huggingface.co/VIZINTZOR/F5-TTS-THAI — model card declares CC-BY-4.0; VYNCX code repository is MIT. The acquired 500k FP16 checkpoint is 674,367,818 bytes, SHA-256 e66bca8f0380775089969250fb5b3b2cda197a4fc6ada355fed6f5c44edd1e47. The model card references Common Voice and Porjai data; the Porjai source license is not clear enough for commercial/redistribution approval. Evaluation-only.
- Vocos 24 kHz vocoder: https://huggingface.co/charactr/vocos-mel-24khz — MIT, acquired with weight SHA-256 97ec976ad1fd67a33ab2682d29c0ac7df85234fae875aefcc5fb215681a91b2a.
- Excluded from production: https://github.com/biodatlab/thonburian-tts weights are CC-BY-NC-SA 4.0; https://huggingface.co/facebook/mms-tts-tha is CC-BY-NC 4.0. The newer F5-TTS-TH-V2 repository has no license metadata in its model API response and was not acquired.
- Keep F5-TTS in an isolated environment: its Torch/Torchaudio and legacy NumPy/Pydantic constraints must not alter the gateway environment. Supply reference transcript explicitly to avoid loading an extra ASR pipeline.

### Acquisition evidence and limits

- Main non-primary batch: GitHub Actions run 43393099472 succeeded; 6,453,112,704 bytes across nine artifacts/lock; per-file sidecars and lock contain exact SHA-256/SHA-1.
- Thai TTS batch: run 43393859216 succeeded; 728,750,351 bytes across four artifacts/lock.
- Large weights are Actions artifacts with 30-day retention, not committed to Git or Git LFS. Main Qwen weights remain owner-server-only.
- No model is installed, loaded, or production-approved. No target-host RAM, p95 latency, WER/CER, TTS MOS, or retrieval metric has been measured.


### Official Ollama Qwen base/helper acquisition

- Official base package: https://ollama.com/library/qwen3.5:4b — 4.21B parameters, Q4_K_M, vision/tools/thinking; model layer 2,648,593,216 bytes SHA-256 a9d0a3e1d8c91732a3812becd31f8d4a8ff57414903f226306069f0437e2ac50; projector 675,569,120 bytes SHA-256 e56a899b1540860385465756dd308c84417410b94dbc1c380adffd20a921ca60.
- Official helper candidate: https://ollama.com/library/qwen3.5:2b-q4_K_M — 1.88B parameters, Q4_K_M, vision/tools/thinking; model layer 1,274,396,992 bytes SHA-256 20cb277f0967ace47b0b5d5658e5e494a88937f7378b74b5a266496400938f4c; projector 671,372,768 bytes SHA-256 5ddf560e34046fd958b2576324f2a9b57d70f297afe6526958d60a23f3bfc20b.
- Official registry model manifests and all blobs were downloaded and verified in Actions run 43395625203. The 4B raw manifest SHA-256 is d8b0f5e9760cd1682034f292d7ef72ec46f432149be0df7574bf2d6e92e38c04; 2B raw manifest SHA-256 is 1e2d21a4f03ab9e4a9c1976a4b7e88f21de61d65f2c5485d8fde8942be73f1e7.
- These packages are the official Apache-2.0 base and helper comparison artifacts. They are not the uncensored main model. On the 8 GB host, the 2B helper is conditional and should be loaded only after evicting the main model unless measured PSS proves concurrent residency safe.
- The owner-server-only uncensored Ollama mirror is https://ollama.com/dzgg/Qwen3.5-Uncensored-HauhauCS-Aggressive:4b. It is third-party; verify model template, license and model blob hash after pull. The mirror is not byte-identical by evidence to the pinned HF derivative + mmproj.
