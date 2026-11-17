# aLandi Intelligence / Source Register (INTEL.md)

**Review date:** 2026-11-16. Recheck upstream releases and model cards before shipping an artifact.

## Landing 2.0: source-first Notebook, Offline Core and Skill Factory — reviewed 2026-11-17

These sources were checked for architecture direction only. They do not establish aLandi implementation, device compatibility, or production readiness.

- **Groundcast** — https://github.com/rohanhong/groundcast (MIT; repository snapshot checked 2026-11-17). A small local-first reference for turning selected study materials into podcast sessions: fixed typed pipeline, claim verification against source chunks, local TTS, transcript links to page/slide/time. Its README says LLM calls leave the device to the configured provider; therefore it is a design reference, not proof of fully offline generation or a dependency recommendation. Evaluate maintenance, security, resource use and licensing before adoption.
- **web.dev — Client-side AI performance** — https://web.dev/articles/client-side-ai-performance (checked 2026-11-17). Device feasibility cannot be reliably guaranteed before download; feature-detect WebGPU, account for large model assets, warn before downloads, cache deliberately and handle interrupted transfers. Supports a staged compatibility check and explicit install flow in Offline Core; it does not justify claiming all phones can run local models.
- **WebLLM — Local Inference** — https://webllm.io/docs/guides/local-inference/ (checked 2026-11-17). Documents WebGPU inference, OPFS model caching and worker execution; SharedArrayBuffer worker mode requires appropriate COOP/COEP headers. Treat browser runtime compatibility and headers as a deployment gate, not a universal browser guarantee.
- **Agent Skills specification** — https://agentskills.io/specification (checked 2026-11-17). Defines a portable skill directory with required SKILL.md YAML frontmatter and optional scripts/references/assets; allowed-tools is experimental and client support varies. aLandi Factory must add its own provenance, security scanning, eval, immutable version and approval gates; a Skill manifest is not a runtime permission grant.

**Disposition:** retain these as upstream candidates in the Landing 2.0 architecture. Do not install dependencies, download weights, ship voices, activate network access, or grant tools based on this research alone. Check exact releases, model/voice/data licences, hashes, hardware and RU/EN/TH evals before selecting artifacts.

## Browser automation: fast DOM coverage vs visual fidelity

- [Lightpanda official documentation](https://lightpanda.io/docs/quickstart/): Lightpanda is a JavaScript-capable headless browser with CDP/Playwright/Puppeteer compatibility. Its API/Web-platform coverage is still partial; it deliberately does not perform graphical rendering.
- [Lightpanda 1.0 WebDriver benchmark (2026-10-06)](https://lightpanda.io/blog/posts/speed-up-your-selenium-tests): the upstream benchmark reports 43/66 Selenium documentation tests passing; on the 43 tests passing in both engines, Lightpanda was 2.6x faster sequentially and 4.4x faster with eight parallel workers, with lower memory use. These are upstream measurements, not aLandi measurements.
- **aLandi disposition:** use Lightpanda as the fast JavaScript/DOM interaction smoke candidate; do not use it to claim CSS layout, viewport geometry, screenshot, touch-target, overflow or real-device coverage. Keep the existing Chromium suite as an opt-in visual/layout regression tool, not a per-commit gate. No browser package is part of the shipped app runtime.
- **Acceptance before promotion:** run the same bounded aLandi interaction cases in Lightpanda and Chromium, compare pass/fail coverage and wall-clock time on the same runner, document unsupported APIs, and retain Chromium for assertions that require actual layout. A faster engine is not an equivalent replacement when it omits rendering.

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


## Sidebar, disclosure and contextual action patterns — reviewed 2026-11-15

This review is scoped to the aLandi Projects/Chats sidebar and project-row actions; it is not a full revalidation of the external URL inventory.

- **Apple Human Interface Guidelines — Sidebars:** a sidebar navigates between app areas or top-level collections such as folders/playlists; it consumes substantial vertical and horizontal space, so choose a compact alternative when space is limited. Adaptation: retain Projects and Chats as clear top-level collections and keep the sidebar hide/show affordance available. https://developer.apple.com/design/human-interface-guidelines/sidebars
- **W3C WAI-ARIA Authoring Practices — Disclosure:** the canonical APG pattern uses a button, exposes aria-expanded, optionally aria-controls, and supports Enter/Space. aLandi currently uses native details/summary for row action disclosure; if this is replaced with custom disclosure markup, implement the full APG button contract. Do not turn the project list into an ARIA tree/menu without implementing that interaction contract. https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- **GitHub Primer — ActionMenu:** an action menu is a trigger plus an overlay containing action-list items; it can be opened from a button/icon button or a contextual list-item action. Adaptation: reuse the existing fixed-position chat action-list overlay for project rows; retain normal button semantics and Escape/outside dismissal. https://primer.style/product/components/action-menu/
- **Microsoft Fluent 2 — Drawer:** reserve modal overlays for focused tasks; avoid stacking multiple modal drawers and use a lighter popover for brief contextual information/actions. Adaptation: project row actions stay in an anchored non-modal overlay; editing remains the existing single project dialog. https://fluent2.microsoft.design/components/web/react/core/drawer/usage
- **Singapore Government Design System — Sidebar:** documents optional upper/lower slots around the main navigation, collapsible/persistent/overlay variants, active-item state, and overlay behavior below 768px; below 512px its example hides the scrim and uses a full-width sidebar. Adaptation: preserve a distinct scrollable navigation region and the fixed create-chat action; do not claim a custom tree keyboard model. https://designsystem.tech.gov.sg/components/sidebar

**Implementation boundary:** these are interaction-pattern references, not a mandate to import React libraries. aLandi remains the existing HTML/CSS/JavaScript client. No third-party UI dependency was added.


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


## 2026-11-13 — model, voice and OCR artifact group recheck

**Source groups revisited for this workstream:** local inference/model cards; embeddings and rerankers; ASR/VAD/TTS and per-voice license lineage; CPU OCR language data; model-format security and GitHub artifact storage limits. Canonical grouped intake remains INTEL.md plus the targeted inventories in docs/AGENT_MODEL_BAKEOFF_RU.md, docs/MULTIMODAL_MODEL_STACK_RU.md, docs/VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md and docs/ALANDI_N2O_CHATGPT_SOURCES_RU.md.

### Main model and security

- [HauhauCS Qwen3.5-4B Uncensored](https://huggingface.co/HauhauCS/Qwen3.5-4B-Uncensored-HauhauCS-Aggressive), revision c09cdbcdb1fefad6d335809d445621b5f5ba0c6e: Q4_K_M is 2,707,513,696 bytes; HF LFS SHA-256 79e28ecacf84e75b6056cf4059636d435aa9eb67795780f7b7dbc7d32a962741; model card metadata says Apache-2.0. This is the current owner-preferred primary candidate; owner supplies the main checkpoint to the server, so the repository downloader excludes it. The 675,568,768-byte BF16 vision projector is separately pinned.
- The author's 465-case / zero-refusal statement is an author-reported result, not independent evidence or an aLandi evaluation.
- [Palo Alto PAIT-GGUF-100 definition](https://insights-db.paloaltonetworks.com/knowledge-base/deserialization-threats/PAIT-GGUF-100): informational detection that a GGUF includes a Jinja chat template; the documented check did not find known sandbox-escape patterns. This is distinct from PAIT-GGUF-101, which flags arbitrary code execution patterns. Review the template against official Qwen3.5 base and use a trusted override where required. Do not mislabel PAIT-GGUF-100 as proof of malware or as a clean bill of health.

### Conditional RAG models

- [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) is Apache-2.0; its full HF model.safetensors is 1,191,586,416 bytes (SHA-256 0437e45c94563b09e13cb7a64478fc406947a93cb34a7e05870fc8dcd48e23fd) and is retained as provenance only. **Runtime choice:** [Ollama qwen3-embedding:0.6b-q8_0](https://ollama.com/library/qwen3-embedding:0.6b-q8_0), approx 639 MB, digest prefix ac6da0dfba84; use native /api/embed only during RAG.
- [Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B), revision e61197ed45024b0ed8a2d74b80b4d909f1255473: Apache-2.0; model.safetensors 1,191,588,280 bytes; SHA-256 27cd75a405b9c1b46b59abfd88aaa209e6fed2a1972cde9b70e7659537c5e65b.
- **Decision:** both are conditional RAG workers only. Do not route ordinary chat through either model. Embedding and reranking are separate eval gates; one resident helper at a time on the 8-GB profile.

### ASR, VAD and TTS

- [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B), revision 5eb144179a02acc5e5ba31e748d22b0cf3e303b0: Apache-2.0; 1,876,091,704-byte weights; SHA-256 79d6cbd4c98c7bbffe9db2edac07f56cd6637d0d5944b27f6c2b8353840323ea; upstream lists 52 languages/dialects including Russian and Thai. Keep as an ASR challenger; existing gateway adapter is whisper.cpp.
- [Whisper large-v3-turbo Q5_0](https://huggingface.co/ggerganov/whisper.cpp/blob/98aa99a0a9db05ae2342309f5096248665f7cba3/ggml-large-v3-turbo-q5_0.bin): 574,041,195 bytes; SHA-256 394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2. This is the pinned baseline for the existing CLI integration.
- [Silero VAD](https://github.com/snakers4/silero-vad/tree/066409f3d9db45a30d21dfcbf9147826ffdd7052): 16k OP15 ONNX 1,289,603 bytes; MIT; exact upstream Git blob SHA-1 pinned in the manifest.
- [Piper v1.8.0](https://github.com/OHF-Voice/piper1-gpl/releases/tag/v1.8.0) is GPL-3.0-or-later. Release adds Thai phonemization via TLTK, not a Thai voice checkpoint.
- [Piper voice licensing guide](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/LICENSING.md) requires walking each voice's dataset and fine-tune base chain. Current dmitri medium (voice repo revision 2f358b6a560e3a913ebf509b2f3344f20b367f94) uses CC0 direct data and hifi_tts_92 CC-BY-4.0 base. Current joe medium uses CC0 direct data and rdh CC0 base. The old 2023 Lessac-derived dmitri/lessac chain is research-only; do not substitute.
- [F5-TTS-THAI](https://huggingface.co/VIZINTZOR/F5-TTS-THAI) has CC-BY-4.0 card metadata, but its [F5 base checkpoint](https://huggingface.co/SWivid/F5-TTS) is CC-BY-NC-4.0. **Decision:** defer Thai voice download/production pending derivative-rights clarification. The existence of Piper's Thai phonemizer does not establish a licensed Thai voice.

### OCR and document intake

- [Tesseract tessdata_fast](https://github.com/tesseract-ocr/tessdata_fast/tree/87416418657359cb625c412a48b6e1d6d41c29bd): Apache-2.0; CPU-first integer LSTM language data at exact pinned commit: English 4,113,088 bytes, Russian 3,861,738 bytes, Thai 1,072,600 bytes. Use LSTM OEM 1. This is an OCR fallback, not layout/table/document understanding.
- Retain the existing Docling / GLM-OCR / PaddleOCR-VL comparison plan for complex documents; do not install a large VLM on the 8-GB VPS without same-host RAM/latency measurements and exact weight licensing.

### Acquisition outcome and policy

- models/artifacts.manifest.json and scripts/download_model_artifacts.py now pin selected revisions, artifact sizes and SHA-256/Git blob SHA-1. Expected exact external-cache payload is 6,033,970,026 bytes; the Ollama base-model and embedding references add about 3,939,000,000 bytes in Ollama's own model store. Both exclude the owner-supplied main Q4 checkpoint and tokenizer/config overhead.
- Actual downloads did **not** complete in this engineering container: outbound DNS returned Temporary failure in name resolution. The downloader is prepared for a network-enabled workstation/server. No artifact is marked installed or runtime-verified.
- Keep all weights outside the GitHub Pages source repository and Git LFS. Preserve code, manifest, licenses, model cards, hashes and acquisition script in Git. This follows the existing model/binary acquisition policy; no bulk model corpus in the repository.
- Existing runtime boundary remains: Ollama is the intended main inference server; gateway ASR/TTS routes exist but require separate binaries/weights; RAG is still FTS5/lexical baseline; embedding/reranker/OCR adapters are not yet implemented; target VPS/Tunnel/Ollama remain UNVERIFIED.


- [Official Ollama Qwen3.5-4B reference](https://ollama.com/library/qwen3.5:4b): Q4_K_M, about 3.3 GB, registry digest prefix d8b0f5e9760c. This is the matched base comparator for the owner-preferred uncensored Qwen3.5-4B candidate; acquire through ollama pull and verify the local digest prefix.


- [Ollama Qwen3 embedding Q8_0](https://ollama.com/library/qwen3-embedding:0.6b-q8_0): approx 639 MB, registry digest prefix ac6da0dfba84. Chosen over duplicating the full 1.19-GB HF safetensors artifact; use Ollama's native /api/embed only on RAG paths.


## 2026-11-14 — ASR upstream clarification and challenger review

- **OpenAI Whisper naming:** the official model catalogue lists large-v3 and large-v3-turbo; there is no separate official model named “Whisper 3”. The current aLandi artifact remains the pinned large-v3-turbo Q5_0 baseline. Sources: https://github.com/openai/whisper/blob/main/whisper/__init__.py and https://github.com/openai/whisper/blob/main/CHANGELOG.md.
- **Runtime:** https://github.com/ggml-org/whisper.cpp/releases lists v1.9.5 (2026-10-06) as latest stable in this review. Keep the existing pinned runtime until a newer stable release is checked against the build/API contract.
- **Challenger:** https://github.com/QwenLM/Qwen3-ASR documents Qwen3-ASR-0.6B and 1.7B for 52 languages/dialects, plus ForcedAligner-0.6B; native Transformers support and torch.compile were announced 2026-06-26. Existing 0.6B artifact remains staged. The 1.7B model is a research candidate only; do not download or install before target-host resource fit and same-audio RU/EN/TH evaluation.
- **Decision:** retain whisper.cpp + large-v3-turbo as baseline; evaluate Qwen3-ASR on the identical permissioned golden set. Compare WER/CER, language detection, timestamps, RTF, cold/warm latency, peak RSS/PSS, cancellation and license/provenance. No migration based on model age or parameter count alone.


## 2026-11-14 — Coder sandbox upstream recheck

- **Selected candidate:** OpenShell v0.1.8 (2026-11-10), Apache-2.0. Tag commit `f3d976590d3eb1379690a2abaf0f0e26c21d487d` has a GitHub-verified signature. Official release assets expose SHA-256 digests; the x86_64 Ubuntu package and its gateway/sandbox/supervisor/driver/prover components can be staged without installing them. Sources: https://github.com/NVIDIA/OpenShell/releases/tag/v0.1.8 and https://github.com/NVIDIA/OpenShell.
- **Why this candidate:** policy-enforced filesystem, network and process boundaries plus endpoint-bound credential brokering and an audit trail. Keep arbitrary shell disabled until host compatibility, policy review and escape/isolation tests pass.
- **Upgrade caveats:** v0.1.8 rejects filesystem policy paths traversing symlinks inside writable workspaces; static provider credentials require explicit placement metadata for non-Authorization destinations; Python SDK moved to ai-openshell/sdk-python. Review these before authoring policies.
- **Alternatives:** gVisor remains the OCI application-kernel isolation option (https://gvisor.dev/docs/); OpenHands v1.38.0 is current upstream, but its no-sandbox mode runs the agent directly on the host with full filesystem access (https://github.com/OpenHands/OpenHands/releases/tag/v1.38.0 and https://github.com/OpenHands/OpenHands).
- **Decision:** stage only the pinned Ubuntu 24.04 x86_64 OpenShell v0.1.8 assets as a temporary Actions artifact, SHA-256 verify every asset, and do not install until actual target OS/architecture, container/VM support, kernel, disk and RAM are measured. No Git LFS or multi-GB binaries in the Pages source tree.


## 2026-11-14 — dependency refresh decision

- pypdf 7.1.0 has a GitHub-verified signed release tag (2026-11-13) and includes the 7.0.1 image-buffer-size security fix. The project makes a narrow pypdf-only freshness-cutoff exception through 2026-11-14, retains the global seven-day cooldown, and maps LimitReachedError to HTTP 413.
- pytest 9.2.0 and pytest-asyncio 1.4.1.post1 are selected after call-site/API review. pytest-asyncio 1.5.0 and FastAPI 0.162.7 remain in the seven-day cooldown; Pydantic 2.14.3 is expected to resolve in the regenerated lock. Exact Python matrix is pending.


## 2026-11-14 — exact lock generation result

CI generated the 142,587-byte universal uv.lock on Python 3.13. It pins FastAPI 0.162.0, Pydantic 2.14.1, pypdf 7.1.0, pytest 9.2.0 and pytest-asyncio 1.4.1.post1. Gateway: 245/245 tests on Python 3.12/13/14; six-layer offline evaluation PASS. The pinned Python runtime-cache workflow still needs to pass after this exact lock is committed. The pytest-asyncio default fixture loop scope is now explicitly function-scoped.


## 2026-11-15 — LANDING-V2-2026-001 upstream freshness recheck

Release/tag recheck on 2026-11-15; this is not proof of target-host installation.

| Component | Current pin | Latest official stable | Decision |
|---|---|---|---|
| whisper.cpp | v1.9.5 | [v1.9.5](https://github.com/ggml-org/whisper.cpp/releases/tag/v1.9.5), 2026-10-06 | Keep stable pin. Upstream HEAD `5922450fbce1ed9d1648babd0d5ac4520055b436` (2026-11-13) is an untagged CMake/Windows fix, not a new release. OpenAI model names remain large-v3 / large-v3-turbo; no separate official “Whisper 3”. |
| Piper | v1.8.0 | [v1.8.0](https://github.com/OHF-Voice/piper1-gpl/releases/tag/v1.8.0), 2026-09-04 | Current; keep per-voice license-chain review. Thai phonemizer does not grant a Thai voice checkpoint. |
| Tesseract | 5.5.4 | [5.5.4](https://github.com/tesseract-ocr/tesseract/releases/tag/5.5.4), 2026-10-28 | Current; OCR remains uninstalled/unwired on target. |
| Ollama | v0.40.16 | [v0.40.16](https://github.com/ollama/ollama/releases/tag/v0.40.16), 2026-11-09 | Current pinned Linux AMD64 artifact; target install pending. |
| OpenShell | v0.1.8 | [v0.1.8](https://github.com/NVIDIA/OpenShell/releases/tag/v0.1.8), 2026-11-10 | Current. Six Ubuntu 24.04 x86_64 assets verified in Actions #43616944431; artifact #14122692509 (207,414,886 bytes), not installed. |
| FastAPI | 0.162.0 | [0.163.0](https://github.com/fastapi/fastapi/releases/tag/0.163.0), 2026-11-14 | Newer but within the repository seven-day cooldown; do not upgrade before 2026-11-21. Then regenerate lock and run Gateway/API matrix. |
| Pydantic | 2.14.1 in uv.lock | [v2.14.3](https://github.com/pydantic/pydantic/releases/tag/v2.14.3), 2026-11-05 | Eligible upgrade candidate; regenerate uv.lock and run Gateway + document fixtures before promotion. |
| pypdf | 7.1.0 | [7.1.0](https://github.com/py-pdf/pypdf/releases/tag/7.1.0), 2026-11-13 | Already current and pinned; retain narrow freshness exception and HTTP 413 mapping. |

**ASR decision:** retain whisper.cpp + large-v3-turbo as stable baseline. Qwen3-ASR-0.6B is staged as a challenger; do not replace Whisper or download 1.7B until same-audio RU/EN/TH WER/CER, RTF, cold/warm latency, peak RSS/PSS, cancellation and target-host resource tests are run. The owner-supplied primary checkpoint remains excluded from automated downloads.

**Artifact state:** external cache #43553056846 (6,054,444,756 bytes), Ollama packages #43418126506 (7,728,830,482 bytes), Python cache #43553056865 (80,105,944 bytes), and OpenShell #43616944431 (207,414,886 bytes) are verified temporary Actions artifacts, not installed on the target VPS. Check expiry before owner-host installation.


## 2026-11-15 — OR-008 targeted source review: same-origin studios and agent orchestration

**Scope and freshness.** The source register contains 450 distinct URL strings across 528 occurrences. Its full inventory snapshot is dated 2026-11-04. This entry records a targeted 2026-11-15 recheck of sources relevant to OR-007/008; it does not claim all 450 sources were freshly revalidated. No dependency, model, custom domain, DNS record or deployment target was installed or changed.

### Same-origin Pages routes versus custom subdomains

Rechecked primary sources:
- GitHub Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub Pages custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- MDN same-origin policy: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
- MDN Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN IndexedDB API: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN Broadcast Channel API: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API

**Finding:** a path such as `/notebook/` or `/research/` on the existing GitHub Pages host remains the same origin as the root application; the path does not change the origin tuple. Same-origin pages can use the same origin-scoped localStorage/IndexedDB and BroadcastChannel. A custom subdomain changes the host and therefore the origin; browser storage is isolated and API authentication, CORS and explicit synchronization become necessary. GitHub Pages custom domains require owner-controlled DNS configuration and domain setup.

**Recommendation (PROPOSAL, not implementation):** keep one Pages publication and add separately navigable same-origin paths only when each studio has a defined purpose and shared-data contract. Reuse the existing project/chat/document identity and a single versioned data layer; do not duplicate localStorage schemas or copy the application bundle into independent systems. Candidate shared identifiers: `projectId`, `chatId`, `workspaceId`, `documentId`, plus schema version. Use IndexedDB or the existing canonical persistence layer for larger artifacts; BroadcastChannel may notify open tabs of updates. Keep the root chat app as the primary surface. Defer custom subdomains until a verified owner domain, DNS control and a concrete cross-origin API/sync need exist.

### Agent orchestration and durable approvals

Rechecked versioned primary sources:
- OpenAI Agents Python v0.24.0 — multi-agent patterns: https://github.com/openai/openai-agents-python/blob/v0.24.0/docs/multi_agent.md
- OpenAI Agents Python v0.24.0 — run results and resumable state: https://github.com/openai/openai-agents-python/blob/v0.24.0/docs/results.md
- OpenAI Agents Python v0.24.0 — human-in-the-loop approvals: https://github.com/openai/openai-agents-python/blob/v0.24.0/docs/human_in_the_loop.md
- LangGraph — checkpointers: https://docs.langchain.com/oss/python/langgraph/checkpointers

**Finding:** OpenAI Agents SDK distinguishes manager-owned specialist calls (`Agent.as_tool()`) from handoffs that transfer control to a specialist. The former fits bounded research/code/critic subtasks where one manager owns the final answer; handoffs fit workflows where the specialist should own the rest of the turn. SDK RunState can serialize paused runs and resume after approvals/rejections, including nested agent-tool interruptions. LangGraph checkpointers provide thread-scoped durable graph state and resume semantics.

**Recommendation (PROPOSAL, not dependency selection):** inspect aLandi's existing AgentRun worker, persistence, idempotency, approvals and tracing before choosing an orchestration library. Prefer one manager plus on-demand bounded specialists; invoke them only when the router identifies a need. Keep explicit per-run budgets, step limits, source/tool allowlists, structured outputs and resumable state. Do not install OpenAI Agents SDK or LangGraph until a compatibility/license/dependency/performance comparison shows a gap the existing runtime cannot fill. Avoid a second parallel persistence/checkpoint system.

### Next targeted source passes

1. Audit current AgentRun and gateway contracts before selecting orchestration dependencies.
2. Recheck Deep Research methods and evidence/citation workflows against current official and maintained implementations.
3. Recheck local-first retrieval, SQLite FTS, document ingestion/conversion, file sandboxing and offline model packaging before downloading anything.
4. Recheck Notebook/studio UI patterns and accessibility before implementing same-origin routes.

**Status:** source review recorded; same-origin studio routes remain SPECIFIED/PROPOSED; no SDK, model, package, custom domain or DNS changes made.


## UI interaction patterns — targeted primary-source review, 2026-11-15

This pass rechecked official design-system and accessibility guidance against the existing vanilla HTML/CSS/JavaScript client. The purpose is to reuse mature interaction contracts, not import a React component stack.

### Primary sources checked

- Apple Human Interface Guidelines — [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars): sidebars are for top-level areas/collections; disclosure grouping controls vertical density; hiding the sidebar can give the content more room.
- Apple Human Interface Guidelines — [Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls): keep frequent/essential controls visible and disclose advanced details only when relevant; disclosure direction must match expanded/collapsed state and labels must describe what is hidden.
- W3C WAI-ARIA Authoring Practices — [Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): use a real button; Enter/Space toggles it; aria-expanded reflects visible state and aria-controls identifies the controlled region.
- W3C WCAG 2.2 — [2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): a focused component must remain at least partially visible; sticky headers and non-modal overlays are common failure sources.
- GitHub Primer — [ActionMenu](https://primer.style/product/components/action-menu/) and [guidelines](https://primer.style/product/components/action-menu/guidelines/): compose quick actions from a trigger, ActionList and overlay; use section titles/dividers for hierarchy; avoid form inputs inside action menus; do not mix icon/no-icon rows arbitrarily.
- Microsoft Fluent 2 — [Drawer usage](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): distinguish inline and overlay drawers; modal overlays should block background interaction; avoid stacking multiple overlay drawers; prefer a popover/tooltip for short contextual information and a dialog for confirmation.
- Singapore Government Design System — [Sidebar](https://designsystem.tech.gov.sg/components/sidebar): fixed upper/lower slots around a scrollable navigation region; active states, collapse variants, scrim behavior and normal tab order; keyboard navigation should remain predictable.

### Primary-source recheck — 2026-11-16

- Apple HIG — [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) and [Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls.md): keep primary/high-frequency controls visible; use clearly labelled disclosure for secondary actions; the indicator must reflect expanded/collapsed state.
- W3C APG — [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) and [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/): Enter/Space toggle disclosure; expose popup state and controlled region; opening an action menu moves focus into it and Escape returns focus to the trigger. Do not apply `role="menu"` to ordinary navigation unless the complete menu keyboard model is implemented.
- W3C WCAG 2.2 — [2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): keyboard focus must not be entirely hidden by author-created content; sticky headers and non-modal overlays are common risks.
- GitHub Primer — [ActionMenu](https://primer.style/product/components/action-menu/) / [Action menu guidance](https://primer.github.io/design/components/action-menu/): clear trigger and concise text labels; focus enters the first item; arrow keys navigate; Escape, Tab/Shift+Tab and outside click dismiss; focus returns to trigger; minimum target is 24×24 CSS px.
- Microsoft Fluent 2 — [Drawer usage](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): use inline/overlay drawers for supplemental content, but prefer popovers for short contextual actions and dialogs for confirmation; avoid stacking modal surfaces.
- Singapore Government Design System — [Sidenav](https://www.designsystem.tech.gov.sg/components/sidenav): keep hierarchy shallow, group related links under expandable parents, expose active/expanded states and preserve predictable keyboard order; do not leave focusable descendants inside visually collapsed sections.

### aLandi application

- Keep Projects and Chats as equal-sized sibling panels. Projects starts collapsed; its create action stays visible. Chats starts expanded; the create-chat action stays above the independently scrollable list.
- Filtering by project changes only the visible Chats list. It must not switch the active chat or mutate chat ownership. The explicit back action restores all chats.
- The project label in the chat header is derived from the active chat, not from the currently selected navigation filter. Selecting a chat in a project updates the label; changing the filter alone does not.
- Context menus remain overlays anchored to their trigger, collision-aware and bounded by the visual viewport. Keep focus visible and preserve the first outside tap as dismissal rather than activating an underlying control.
- Retain the existing vanilla implementation and CSS tokens. Supabase/shadcn examples are useful as structural references (sticky header/content/footer, group action slots), not as a reason to add React, Radix or another runtime dependency.

### Evidence and limits

The live TinyFish audit confirmed persistent project-create and new-chat rows, non-shifting context overlays, absence of noisy chat status dots and the mobile off-canvas sidebar. Its report that no back navigation or project header existed is not supported by source: chatScopeBackButton, renderChatList(), activeProjectTitle and renderActiveChat() already implement those behaviors. The audit did not select a project chat to test the header. Existing Chromium tests already assert the back flow and equal panel heights; this pass adds a direct regression for filter-only semantics and the active-chat project label. The audit's statement that both sections are expanded by default also conflicts with source: Projects has aria-expanded=false and a hidden list; Chats has aria-expanded=true.

**Decision:** adopt interaction semantics and layout constraints only; no component package, dependency, remote UI service or external code was added. Source checks are not a full-market audit and do not establish native iOS/VoiceOver behavior.

## Deep Research 2.0 — targeted primary-source review, 2026-11-15

### Primary sources checked

- Exa Search API: https://docs.exa.ai/reference/search — one request can discover relevant results and optionally return content/highlights; responses expose title, URL, published date, author, text/highlights and cost fields.
- Exa Contents API: https://docs.exa.ai/reference/get-contents — fetches page contents, summaries and metadata for explicit URLs; cached content can fall back to live crawling.
- Firecrawl Search API: https://docs.firecrawl.dev/api-reference/endpoint/search — combines search and scraping; full Markdown can be requested through scrape options; supports site/filetype and research-category filters.
- Firecrawl Scrape API: https://docs.firecrawl.dev/api-reference/endpoint/scrape — extracts a single page; dynamic browser interactions are a separate Interact endpoint, not implicit in basic scraping.
- LangChain Deep Agents — Subagents: https://docs.langchain.com/oss/python/deepagents/subagents — subagents isolate context and specialized instructions; synchronous subagents block the supervisor; avoid delegation for simple tasks when overhead exceeds benefit.
- LangGraph Persistence: https://docs.langchain.com/oss/python/langgraph/persistence — checkpointers persist thread-scoped run state; stores hold cross-thread application data; in-memory savers do not survive process restarts.
- FastAPI Background Tasks: https://fastapi.tiangolo.com/tutorial/background-tasks/ and Lifespan: https://fastapi.tiangolo.com/advanced/events/ — BackgroundTasks run after the response but are not a durable queue; lifespan is the correct lifecycle boundary for shared workers/resources.
- Context7 FastAPI docs were queried for lifespan and long-running task guidance; no framework-version upgrade or dependency was made.

### Findings and decision

- Current browser research uses a four-stage same-model pipeline and stores the trace in localStorage; this is a structured workflow, not independent multi-agent research.
- gateway/rag/evidence_ledger.py hashes source text, stores exact Unicode offsets/quote snippets and scopes evidence to conversation/project/global. Authenticated POST/GET/DELETE quote routes are wired; the current backend slice adds typed claim/contradiction records and authenticated write routes. Research Trace UI integration is still pending.
- rag_enabled is false by default. Evidence persistence must be explicit and user-triggered; a configured remote Gateway must never receive excerpts silently.
- Exa and Firecrawl are complementary adapters (search/metadata vs extraction/interaction), not reasons to add multiple overlapping search libraries. API keys, cost accounting, remote-processing consent and rate limits belong in Gateway configuration.
- Do not use FastAPI BackgroundTasks for resumable research. Reuse existing persistent AgentRun/SQLite patterns or a clearly bounded research-specific state store; do not create a second checkpoint system without demonstrated need.
- A hash and exact quote span prove capture integrity, not semantic entailment between a claim and the source. Claim-to-citation support, contradictions and confidence require separate structured records and validation.

Decision: reuse the existing SQLite EvidenceLedger, add authenticated scoped API operations and explicit trace persistence first. Defer LangGraph/Deep Agents SDK adoption pending measured need, compatibility/license review and an adapter comparison. No dependency, paid service, model or host setting changed.


## Deep Research 2.0 — provider and evidence-contract revalidation (2026-11-16)

- The official Exa Search and Contents references and Firecrawl Search and Scrape references are already present in this register; the existing inventory contains 490 unique URLs. No duplicate source rows or new URL inventory were needed.
- Exa remains the discovery/metadata adapter candidate; its Contents API is a separate explicit-URL extraction step. Firecrawl Search can combine discovery with scraping, while Scrape is a single-page extraction operation; browser interaction is a distinct endpoint.
- These APIs are complementary, not a reason to add overlapping search libraries. Runtime adapters, provider credentials, per-provider budgets, remote-processing consent, rate limits, timeouts, retries and provenance are not implemented by this evidence-ledger backend change.
- No provider keys were read, no paid provider requests were made, and no provider was marked configured or live. The Research Trace critic remains same-model until a separate verifier runtime is implemented.
- UI design sources (Apple HIG, W3C APG/WCAG, GitHub Primer, Microsoft Fluent and Singapore Government Design System) remain in the existing source inventory; no new UI dependency was adopted.



## Owner-directed agent, model and tooling source review — 2026-11-16

**Inventory method:** the pre-sweep file contained 568 HTTP(S) occurrences and 478 distinct URLs after trimming trailing Markdown punctuation. This pass added 29 distinct primary-source references, bringing the normalized unique count to 507. An earlier note reported 490; that figure is not reproducible with this parser and is treated as a stale overcount. Existing inventory was searched by agent orchestration, small models, memory, RL, browser automation and UI themes; this is a focused thematic review, not a claim that all 507 pages were freshly fetched.

### Research tools available to the assistant

- Exa Search / Contents: https://docs.exa.ai/reference/search and https://docs.exa.ai/reference/get-contents
- Firecrawl Search / Scrape: https://docs.firecrawl.dev/api-reference/endpoint/search and https://docs.firecrawl.dev/api-reference/endpoint/scrape
- Both tool families returned successful results in this session. No provider keys were read, no paid request was made, and no Exa/Firecrawl runtime dependency was added to aLandi. They are research tools here; product adapters remain a separate, explicit implementation task.

### Small models and local inference

- PrismML Bonsai 2: https://github.com/PrismML-Eng/Bonsai-demo ; model card: https://huggingface.co/prism-ml/Ternary-Bonsai-2-2B-gguf ; format/runtime docs: https://docs.prismml.com/download/formats ; model catalogue: https://docs.prismml.com/download/models
  - The 1.88B language model is derived from Qwen3.5-2B and declares Apache-2.0. The 429,183,456-byte PTQ1_0 file is a packing of this same 1.88B model, not a separate smaller-parameter model. Other packings: PQ2_0 ~0.52 GB and Q2_0 ~0.55 GB; optional Q8 vision projector ~0.36 GB.
  - Official README recommends PQ2_0 as the default packing, PTQ1_0 where file size is the priority, and Q2_0 for stock upstream llama.cpp b11556+. PTQ1_0/PQ2_0 require the PrismML llama.cpp fork; this is not Ollama-compatible. Model revision a6032a5089ac27e96be3a80c7b42d1ad0bd89887; PTQ1_0 SHA-256 36061ad406df8a4903a6db005be350c50fabfaf717f9ef0acf4b76adcd9929fa. The 430 MB text artifact does not include the optional vision projector. A 262K context headline is not a usable 8-GB host budget.
  - **Disposition: CANDIDATE / ARTIFACT ACQUISITION WORKFLOW ADDED; NOT INSTALLED.** The workflow stages the pinned PTQ1_0 file as a GitHub Actions artifact only. First prove a generic local OpenAI-compatible runtime adapter, exact artifact digest, cold/warm RSS, KV memory, TTFT, p50/p95, tokens/sec, cancellation, RU/EN/TH quality and regression versus the current Ollama baseline. Do not make it the default or load it beside another model.
- Cactus Needle 2: https://huggingface.co/Cactus-Compute/needle2 ; engine/package source: https://github.com/cactus-compute/needle ; v2 lifecycle report: https://github.com/cactus-compute/needle/issues/130
  - The model card describes a 45M tool-calling/extraction model in a 14 MB binary and roughly 28 MB session RAM, with schema-constrained JSON, confidence gating, top-five tool retrieval and a 256-token sliding window. Its public card does not establish RU/EN/TH quality; Russian and Thai remain unverified.
  - A v2.0.4 issue documents deterministic crashes when a second session is initialized in the same process on macOS arm64 and Linux x86_64; the report also records tool-schema size sensitivity. **Disposition: DEFER for production.** Keep as a possible isolated English/tool-call benchmark only after the exact shipped engine passes repeated-init, long-session, schema-size and concurrency tests.
- ghost-infer: https://github.com/affifuddin-hazam/ghost-infer
  - Apache-2.0 Rust GGUF runtime with an OpenAI-compatible streaming/tool-call API, speculative decoding and GPU offload. Upstream benchmarks use a consumer NVIDIA GPU (including an 8 GB RTX 2060 SUPER) paired with 24 GB system RAM; the installer is Windows-focused. Figures are upstream claims, not aLandi measurements.
  - **Disposition: RESEARCH ONLY.** Current target facts are an 8-GB VPS and no verified GPU/host memory fit; do not replace the Ollama-first baseline without a same-hardware benchmark.
- Needle, Bonsai and ghost-infer are separate model/runtime options; do not conflate weights, tokenizer/template, engine, quantization and API compatibility.

### Agent orchestration, coding and operations

- OpenAI GitHub organization: https://github.com/openai
  - Agents SDK Python: https://github.com/openai/openai-agents-python (MIT). Study manager-owned specialist calls versus handoffs, guardrails, human approval, sessions, tracing and resumable run state. **Reuse concepts; do not add the SDK until an exact gap in current AgentRun is demonstrated.**
  - Codex: https://github.com/openai/codex (Apache-2.0). A local terminal coding agent; use as a harness/workspace benchmark for repository scoping, tool execution, review and event lifecycle, not as a drop-in backend or permission grant.
  - Cookbook: https://github.com/openai/openai-cookbook ; agent improvement loop turns real traces and human/model feedback into repeatable evals and then proposes harness changes. Reuse the evidence → eval → improvement cycle.
  - Evals: https://github.com/openai/evals ; study dataset/graded-eval patterns, but preserve aLandi's deterministic local tests and RU/EN/TH golden sets.
  - The closest official chat/HITL demo found is https://github.com/openai/openai-support-agent-demo (MIT, Next.js, Responses API, File Search and suggested actions for human review). The exact name chat-demo did not resolve to one canonical OpenAI repository; do not silently treat this demo as the intended exact project. No Next.js migration is proposed.
- Stakpak: https://github.com/stakpak/agent ; Warden design: https://stakpak.gitbook.io/docs/how-it-works/warden-guardrails
  - Apache-2.0 DevOps agent with isolated subagents, asynchronous task/progress handling, network policy enforcement and secret substitution before model exposure.
  - **Disposition: PATTERN SOURCE.** Reuse deterministic network/tool policy, secret redaction/substitution, per-worker tool scopes, resumable task state and reversible file operations. Do not install its 24/7 DevOps runtime into aLandi.
- Cloudroom: https://github.com/davidondrej/cloudroom ; cloud-thread architecture: https://www.cloudroom.dev/docs/cloud-threads
  - Apache-2.0 Rust core; one Linux sandbox and Git branch per thread, persistent event history, queued turns and resume. Its docs conflict: the cloud-threads page says the agent has full admin rights inside the sandbox, while the README security section says agents run as a separate Linux user without admin rights. Both describe no approval prompts. Treat its permission boundary as UNVERIFIED until code audit; do not copy its no-approval default.
  - **Disposition: PATTERN SOURCE ONLY.** Per-thread isolation and event persistence are useful; no assumption that 1,000-agent scale fits an 8-GB VPS.
- Kiri candidates: https://github.com/LeeCheneler/kiri and https://github.com/Yeshwanthyk/kiri
  - These are two distinct projects: a MIT local-first workspace with user-set allow/ask/off permissions, worker delegation and YAML workflows; and a keyboard-first local agent control plane. Both are useful UX/workflow references, not one verified interchangeable dependency.
- Obscura: https://github.com/h4ckf0r0day/obscura ; MCP contract: https://github.com/h4ckf0r0day/obscura/blob/main/docs/Use-the-MCP-server.md
  - Apache-2.0 Rust/V8 headless browser with CDP and MCP. Private/internal IP navigation is blocked by default with DNS checks; non-loopback HTTP MCP requires a bearer token, allowed origins and bounded requests/connections.
  - **Disposition: DEFERRED BROWSER ADAPTER CANDIDATE.** If adopted, run as an isolated browser worker with URL policy, DNS/IP revalidation, per-run state and no ambient host credentials. It is not installed.
- Existing aLandi architecture remains authoritative: use the current AgentRun/SQLite state and typed worker capability contracts. The manager owns the task/result; specialists receive minimal typed task packets and isolated context. Effective permissions remain the intersection of requested scope, agent profile, owner grant and environment policy. No role/Skill expands permissions. Do not add a second orchestrator or persistence engine.

### Memory, RL and policy divergence

- Memorilla: https://github.com/snap-stanford/memorilla ; paper: https://arxiv.org/html/2610.21375v1
  - Apache-2.0 research implementation that learns query-conditioned latent memory tokens for a frozen model. The README specifies Linux/CUDA/Python 3.11 and H100 80-GB training/evaluation examples; TextWorld memory training uses GRPO. Dataset licenses remain separate.
  - **Disposition: RESEARCH CANDIDATE / NOT A VPS INSTALL.** Study its compression/evaluation idea against existing SQLite FTS5/RAG and current MemoryManager; no replacement or model training on the 8-GB host.
- KL divergence: https://github.com/openai/spinningup ; https://spinningup.openai.com/en/latest/algorithms/trpo.html
  - A mathematical measure/constraint on policy distribution change, not a deployable module. Useful in model fine-tuning/evaluation to detect policy drift; not a new runtime subsystem.
- Critic-free RL: https://arxiv.org/html/2605.08666 ; literature index: https://github.com/smiles724/Awesome-LLM-RLVR
  - The cited paper studies token-level effects in critic-free RL such as GRPO and proposes query-preserved and reward-balanced batching interventions. This is a model-training method, not an inference-time agent reviewer. Do not confuse it with the current same-model research critic, which is explicitly not independent.
  - **Disposition: RESEARCH ONLY.** No RL training pipeline or dependency is justified on the current target hardware. If later explored, require licensed data, reproducible baseline, held-out evals and KL/policy-drift monitoring.

### Interface source

- React Bits: https://github.com/DavidHDev/react-bits ; license: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
  - Large animated React component collection. Its current license is MIT plus Commons Clause restrictions: do not sell, sublicense or redistribute the components themselves, including ported versions.
  - **Disposition: VISUAL REFERENCE ONLY.** Borrow interaction inspiration and implement original aLandi-native HTML/CSS/JS; do not copy/port its components or add React/Radix/Tailwind runtime dependencies.

### Explicit deferral

- VoxCPM2 is **DEFERRED** per owner instruction; do not spend this pass on voice/audio model integration.

### Consolidated decision

No external runtime, UI framework, model, agent platform or new package was installed in this documentation pass. Exa and Firecrawl were used as assistant-side research tools. Adopt only evidence-backed patterns into aLandi's own contracts: coordinator-owned bounded workers, isolated context, typed scopes, deterministic guardrails, explicit approvals, durable event state, source-grounded research, local-first data and measurable small-model routing. Keep all capabilities disabled or unavailable until their runtime and exact-head acceptance gates pass.


## 2026-11-16 — AgentRun implementation and upstream source refresh

**Baseline:** main `0d34aa1c70bb68e57a3856ba20d8b5f966c65038`. SQLite persists same-run dependencies; task-ID Fernet payloads; dependency-ready scheduling; coordinator synthesis. UI exposes safe `single`/`team_review`/`coder_review`, per-chat choice, General coordinator pin, explicit `strategy_id`, and actual task states/dependency labels. Coder Review is a sequential text-only draft → review → coordinator chain; no filesystem, shell, tools or tests. Quality #43827521092 passed 7/7 incl. 135 built-app Chromium + 1 live-site test and published contract; Graphify #43827521090 and Pages #43827520134 passed; public revision exact. Gateway unchanged; #43797179042 on backend parent 680ab022 (Python 3.12/13/14).

**Exa primary-source review, 2026-11-16:**
- [OpenAI orchestration](https://developers.openai.com/api/docs/guides/agents/orchestration), [running agents](https://developers.openai.com/api/docs/guides/agents/running-agents): handoffs transfer ownership; agents-as-tools retain manager ownership; narrow specialists and one state-continuation method. Adopt manager-owned synthesis, not SDK runtime.
- [Deep Agents subagents](https://docs.langchain.com/oss/python/deepagents/subagents), [async subagents](https://docs.langchain.com/oss/python/deepagents/async-subagents): isolated context reduces supervisor bloat; sync blocks; async needs lifecycle, steering/cancel and Agent Protocol server. Adopt isolated packets; no runtime import.
- [Temporal Activities](https://docs.temporal.io/activity-execution), [Workflows](https://docs.temporal.io/workflows): durable lifecycle, replay, timeouts/retries; I/O in Activities. Adopt idempotency/failure-injection patterns; defer separate service.
- [Microsoft workflows](https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/), [edges](https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/edges), [checkpoints](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints): typed edges, fan-in barriers, superstep checkpoints; distributed durability requires Durable Task infrastructure. Adopt dependency/fan-in semantics only.

**Limits/disposition:** one worker/model slot, serial inference, roles not OS processes, feature off, no tools/shell/filesystem/network, no Coder sandbox or target-host inference. Keep FastAPI + SQLite + Fernet; no competing orchestrator. Next: plugin strategy and source mapping, then continue the existing K.5 15-point order. Local Coder sandbox and human approval/resume remain deferred.




## 2026-11-16 — Plugin strategy and recent sandbox/agent-runtime research

**Status:** PROPOSED usage map; no plugin OAuth, new product integration, dependency, model download or hosting migration was authorized or applied.

### Primary working set
| Plugin/tool | Best role in aLandi work | Boundary |
|---|---|---|
| GitHub | Canonical repository, branch/HEAD, issues, commits, CI and docs | Always authoritative for project state; no raw history rewrite or unapproved protected action |
| Exa | Broad discovery and primary-source research | Search first; do not duplicate the same query across multiple search plugins |
| Firecrawl | Deep page extraction, crawling and structured content after discovery | Use when page content/links must be inspected; not a second broad search engine by default |
| Context7 | Version-specific library/framework/API documentation before a dependency or API change | Not a replacement for repository code/tests or official release notes |
| TinyFish | Browser navigation and multi-step public-site workflows when Playwright cannot cover the flow | Prefer Playwright for deterministic local/public-site regression; do not expose private authenticated data |
| Coder value tools | `make_design_tokens` and `check_color_contrast` for future design-token and WCAG review | These are design/accessibility utilities, not an on-device coding runtime or shell |
| Base44 | Isolated UI/product prototype only when it answers a specific design question | Base44 app inventory returned no existing aLandi app; no app was created and no migration is proposed |

### Conditional/reference-only tools
- **Cloudflare:** continue the existing Tunnel/edge role. Cloudflare Agents SDK/Workers/Durable Objects is a possible alternative architecture, not an addition to the current FastAPI + SQLite + Ollama runtime; adopting it would duplicate state and deployment surfaces.
- **Vercel:** Workflow/Agent and Sandbox documentation are useful comparative references. Vercel Sandbox is a hosted Firecracker environment, not offline on-device execution. Do not migrate the static Pages client or create a second orchestrator.
- **Twilio:** ConversationRelay/Voice are cloud telephony and speech-channel options. They do not provide offline local ASR/TTS and Twilio Conversation Memory is not aLandi Memory. Consider only for an explicitly requested phone channel.
- **Floot / Hercules / Coder build link / Base44:** overlapping app builders; choose one for a separately scoped prototype, never create parallel versions of the canonical aLandi product.
- **Railway / Render / Hostinger:** hosting/provisioning alternatives only; current GitHub Pages + Cloudflare Tunnel + FastAPI/Ollama architecture remains the baseline.
- **OpenAI Platform:** API-key lifecycle only on explicit request; never store or expose keys in repository/docs.
- **Automations:** scheduled external monitoring/check-ins only when requested; not an AgentRun runtime or product memory.
- **Plugin Management:** OAuth/connectors and scopes only after an explicit product integration decision.
- **Context_dev / Keenable:** fallback search/page extraction; avoid running them in parallel with Exa/Firecrawl for the same evidence set.

### Recent primary-source review (2026-05-16 → 2026-11-16)
- [OpenAI Agents orchestration](https://developers.openai.com/api/docs/guides/agents/orchestration) and [sandbox agents](https://developers.openai.com/api/docs/guides/agents/sandboxes): retain manager-owned delegation and explicit separation of agent harness from compute/sandbox. Do not import the SDK runtime merely to reproduce the concepts.
- [LangGraph checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) and [interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts): checkpoint/resume and human interrupts are relevant patterns; current aLandi state remains in SQLite, with approval/resume deferred until an actual side-effecting tool needs it.
- [Temporal workflows](https://docs.temporal.io/workflows) and [activity execution](https://docs.temporal.io/activity-execution): use durable/idempotent activity and retry semantics as design references; do not add a second workflow service now.
- [Microsoft Agent Framework workflows](https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/) and [checkpoints](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints): typed edges and fan-in are useful references; no framework dependency added.
- [OpenSandbox 1.2.0 release](https://github.com/opensandbox-group/OpenSandbox/releases/tag/release-1.2.0), published 2026-10-27, Apache-2.0: local Docker and Kubernetes deployment, Firecracker fast sandboxes, auto-pause/wake-on-access and Credential Vault. Candidate for a future isolated Coder adapter, not selected: heavier service footprint and the release notes identify an umbrella-release signing/provenance gap. Do not treat it as a mobile/browser-local runtime.
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) and [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/): hosted sandbox and Workers/Durable Objects alternatives; useful comparisons, not selected for the current local-first architecture.
- [Twilio ConversationRelay](https://www.twilio.com/docs/voice/conversationrelay): cloud voice/telephony, not offline speech or personal Memory.

**Disposition:** keep the working set small and complementary: GitHub → Exa → Firecrawl/Context7 as needed → TinyFish or Playwright for browser verification → Coder contrast/tokens for UX. Use other builders/hosting/voice platforms only for a concrete isolated need. No connector was authorized or connected by this research.

## 2026-11-16 — Deep Research provenance and runtime tracing standards

**Primary sources checked via Exa/Firecrawl:**
- [W3C PROV-O](https://www.w3.org/TR/prov-o/) and [PROV-DM](https://www.w3.org/TR/prov-dm/): provenance is expressed through Entities, Activities and Agents, with relations such as `used`, `wasGeneratedBy`, `wasDerivedFrom` and `wasAssociatedWith`. Candidate mapping for aLandi: a research run is an Activity; model/provider/tool is an Agent; source page, captured quote, claim, contradiction and final report are Entities. Claims and contradictions derive from explicitly linked evidence records. This is a conceptual mapping, not a recommendation to migrate SQLite records into RDF.
- [OpenTelemetry trace concepts](https://opentelemetry.io/docs/concepts/signals/traces/) and [Trace API](https://opentelemetry.io/docs/specs/otel/trace/api/): spans model bounded operations; parent/child spans describe synchronous stages; events record retries/checkpoints; span links model fan-in from separate retrieval/tool work. Use a root research span with stage and tool-call spans when observability is implemented.
- [W3C Trace Context](https://www.w3.org/TR/trace-context/): `traceparent`/`tracestate` support cross-service correlation. If future provider adapters propagate context, validate external headers and never treat trace context as authentication or durable identity.

**Disposition for aLandi:** keep durable `run_id`, checkpoints, dependencies, attempts and cancellation state in SQLite. Use telemetry `trace_id`/`span_id` only for observability correlation; telemetry is not a recovery database. Add spans/events when the K.1.13 observability work and real provider adapters are implemented. No RDF, OpenTelemetry SDK/exporter, or new runtime dependency was installed.

## 2026-11-16 — Complete owner plugin/tool map and usage policy

**Scope:** the owner's full requested set is mapped below. Availability refers to the current assistant-side tool/skill surface, not to aLandi runtime integration. No OAuth, app creation, hosting change, paid provisioning, deployment or secret handling was performed.

| Owner-listed tool | Current assistant-side surface / best use | Boundary and disposition |
|---|---|---|
| Code | No distinct @Code tool namespace or skill surfaced in the active tool registry for this session. | Do not claim availability or invent a connector. Use repository-aware GitHub tools and local code inspection. Recheck if the owner enables a distinct Code app later. |
| Coder | Build-link service available; Coder value tools reported unavailable in the service check. | Build link opens a separate hosted builder and does not edit this canonical repo. Not used for aLandi implementation; not a local Coder sandbox. |
| Context.dev | Web search/scrape/crawl/answers, brand/styleguide retrieval and monitors are available. | Use for website/design-reference extraction, structured page research and monitored changes; avoid duplicate queries already covered by Exa/Firecrawl. |
| Cloudflare | Docs/search/execute and account identity tools are available. | Existing Tunnel/edge remains baseline. Use docs and current account state when an edge/API task requires it; do not add Workers, Durable Objects or Agents SDK as a competing runtime without a specific decision. |
| Exa | Web search and page fetch are available and were used for recent multi-angle discovery. | Primary broad discovery/research tool; verify important claims against primary pages and current repo evidence. |
| Superpowers | Process skills are available and were invoked for brainstorming, planning, TDD, execution and verification workflow. | Engineering method only; not an aLandi runtime or subagent executor. No separate subagent dispatch capability was available in this session. |
| TinyFish | Browser workflow tools are available. | Use for read-only public-site workflows and live interactions not covered by deterministic Playwright. Never expose owner credentials or private browser data. |
| Base44 | App builder, sandbox/code tools and app inventory are available; prior inventory check found no existing aLandi app. | Use only for a disposable design spike or separately authorized prototype. Do not fork the canonical product or move GitHub Pages code/data into Base44 by default. |
| BrowserAct | BrowserAct skill exists, but the CLI is not installed (browser-act --version → command not found); uv 0.10.0 is present. | No install was performed. Use Playwright for deterministic tests and TinyFish for live browser work; install BrowserAct only after explicit approval if a concrete gap remains. |
| Railway | Project/service/deployment/log/metrics/automation APIs are available. | Hosting and background automation alternative; no migration or resource creation. Not the current Pages/FastAPI/Ollama baseline. |
| Render | Service, database, workflow, logs and deployment APIs are available. | Hosting/database alternative; no resource creation or migration. Do not create a parallel backend. |
| Floot | Project/file/database/preview/build/publish tools are available. | Full app builder overlaps Base44/Hercules/Coder; use only for a bounded prototype if needed, never a second canonical app. |
| Keenable | Web search and page-content fetch are available. | Fallback discovery/extraction when Exa or Firecrawl cannot access a source; avoid parallel duplicate searches. |
| Hercules | App builder and agent/app APIs are available. | Alternative app-builder surface; no app creation or agent runtime adoption. |
| Hostinger Connector / Hostinger | The Hostinger search/execute/multi-execute API surface and related skills are available; these two names resolve to the same underlying connector family here. | Use for read-only account/host audit or explicit Hostinger work only. No VPS/domain/DNS changes or provisioning. |
| Firecrawl | Search, scrape, map/crawl, developer research, document parsing and agent tools are available and were used for targeted research. | Use after discovery for deep extraction, code/docs lookup and ingestion research. Bound credits and avoid unnecessary autonomous crawls. |
| Vercel | Documentation, project/deployment, workflow, agent and sandbox tools/skills are available. | Use as comparative reference or a task-specific existing Vercel resource. Vercel Sandbox is hosted, not offline on-device; no project/runtime migration. |

### Complementary workflow (avoid duplicate tool calls)

1. **Canonical engineering truth:** GitHub repository, exact main SHA, tests and Actions.
2. **Broad discovery:** Exa.
3. **Deep page/code/document extraction:** Firecrawl; use Context.dev for page/brand/styleguide or structured web extraction where it adds a distinct field.
4. **Fallback:** Keenable only when the primary search/fetch route has a material access or coverage gap.
5. **Browser verification:** Playwright for deterministic app regression; TinyFish for live public-site workflows; BrowserAct only when installed and justified.
6. **Engineering process:** Superpowers; use Coder only for an isolated builder link/prototype or when its value tools become available.
7. **Platform/hosting references:** Cloudflare, Vercel, Railway, Render and Hostinger are not interchangeable runtime dependencies. Base44, Floot, Hercules and Coder are overlapping builders. Choose one only for a separately scoped need; do not provision parallel products.

### Recent source review (2026-05-16 → 2026-11-16)

- [Agent 4: Teamwork and Collaboration for Vibe-Coding, ACM CAIS '26](https://dl.acm.org/doi/full/10.1145/3786335.3813211), published 2026-05-26: planning agent decomposes a request into a dependency DAG; task agents work on isolated application-state forks; intra-task subagents can share a workspace; validation combines type checks, replayable regression tests and code review. This is a Replit platform paper, not a drop-in runtime for aLandi.
- [Aegis OS preprint](https://arxiv.org/html/2611.08516v1), 2026-10-22: proposes transactional copy-on-write workspaces, OS sandbox boundaries, scoped egress/credentials and human approval at workspace commit rather than every mutation. It is a preprint with author-reported results, not an independently established production guarantee; candidate patterns only.
- [Microsoft Agent Framework Durable Extension](https://learn.microsoft.com/en-us/agent-framework/hosting/durable-extension): describes persisted sessions, checkpointed workflows, crash recovery, pause/resume and self-hosted workers. Useful comparison; adopting it would add its durable-task infrastructure and is not justified before extending the existing SQLite contract.
- [Material Design 3 — Designing/Structure](https://m3.material.io/foundations/designing/structure): emphasizes clear hierarchy, task-focused navigation, top/bottom placement for important actions, semantic reading order and landmarks. Apply as design guidance, not as wholesale visual cloning.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/): normative accessibility baseline for focus, target size, contrast, keyboard and predictable interaction. Keep WCAG CSS-pixel criteria distinct from Apple points and Android dp recommendations.

**Disposition:** retain a small complementary assistant-side toolchain; keep the existing aLandi stack and GitHub Pages source of truth. Product connectors and hosting/runtime migrations require a separate explicit architecture decision, credentials/scopes, data-flow threat model, budget and contract tests.

### Mobile Safari form-focus zoom diagnosis — 2026-11-16

- **FACT:** index.md sets viewport width=device-width, initial-scale=1, viewport-fit=cover. Multiple text controls use Tailwind text-sm (14 CSS px), including project creation, API keys, model search and project/server settings.
- **HYPOTHESIS (strong):** iPhone Safari automatically zooms focused form controls when computed font-size is below 16 CSS px. This plausibly explains the owner's reported page zoom on text entry/select. It is not yet verified on a physical device.
- **PROPOSAL:** apply a mobile-only minimum 16px font-size to input/select/textarea controls, preserving pinch-to-zoom and accessible user scaling. Do not add maximum-scale=1 or user-scalable=no as a workaround.
- References: [WebKit — New Interaction Behaviors in iOS 10](https://webkit.org/blog/7367/new-interaction-behaviors-in-ios-10/); [CSS-Tricks — 16px or Larger Text Prevents iOS Form Zoom](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/); [iOS WebKit auto-zoom technical analysis](https://nahidmahamud.com/disable-auto-zoom-in-input-text-tag-safari-on-iphone/).
- **Acceptance:** test text, URL, password, search and select controls on real iPhone Safari, verify no focus zoom, keyboard visibility, voice controls and preserved pinch zoom.



### AgentRun live status and event transport review — 2026-11-16

**Official protocol/runtime references**
- [OpenAI Agents SDK — Streaming](https://openai.github.io/openai-agents-python/streaming/): `Runner.run_streamed()` exposes typed run events; the event iterator must be fully drained before treating a run as complete because persistence/approval/history post-processing may continue after visible output. Cancellation and interruption are explicit lifecycle outcomes. Pattern adopted: distinguish user-visible token output from run completion and reconcile terminal state from the runtime.
- [OpenAI API — Agents events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events): events are the real-time update channel; persisted items are the durable history. Pattern adopted: live activity and saved conversation history are separate projections.
- [AG-UI — Events](https://docs.ag-ui.com/concepts/events): run lifecycle events, step events, activity snapshots/deltas and subagent lifecycle events give the frontend structured status without conflating it with assistant text. [AG-UI — Subagents](https://docs.ag-ui.com/concepts/subagents): attribution identifies which child produced an event; it is not a permission grant. Pattern adopted: explicit typed status/task activity and attribution, with no raw chain-of-thought in the user-facing panel.
- [Temporal — Understanding Event History](https://docs.temporal.io/evaluate/understanding-temporal): a durable ordered event history enables replay/recovery after worker failure. Pattern adopted conceptually: event cursor + persisted run state + snapshot reconciliation; do not adopt Temporal service for the current single-host SQLite deployment.
- [Dify Agent Run Store](https://github.com/langgenius/dify/blob/d90f9759d2f251223d90dd500a6603fd320df905/dify-agent/src/dify_agent/storage/redis_run_store.py) and [Dify run routes](https://github.com/langgenius/dify/blob/d90f9759d2f251223d90dd500a6603fd320df905/dify-agent/src/dify_agent/server/routes/runs.py): request digests/idempotency, event cursor replay, retention and explicit run status. Pattern adopted: event log and status endpoint remain independently readable; reconnect must re-authorize. Do not add Redis or copy Dify's scheduler.

**aLandi source comparison**
- Current AgentRun already persists run/task events in SQLite and exposes authenticated status + cursor-based event endpoints. The browser observer polls events and snapshot every 500 ms, but only while the Agents modal owns the UI.
- No second orchestration engine, Redis/Temporal dependency or separate agent runtime is justified. Keep SQLite/DAG/lease/payload vault as the current base; optimize transport only after measuring the current polling cost/latency.
- For the requested status UX, show a collapsed chat-anchored summary with truthful state text; expand to a bounded activity/task list. Use the existing event cursor and server snapshot to recover after navigation/reconnect. Deduplicate by event ID; don't announce unchanged poll snapshots.
- Never expose hidden reasoning, prompts, secrets, encrypted payloads or source text in activity status. Color/animation is secondary to server-reported state; respect reduced motion and keyboard/screen-reader semantics.
- Full acceptance and maturity boundary: `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` §K.6.16. No new dependency or runtime adopted.


## 2026-11-16 — Agent context contracts, multi-model registry, local tool boundaries and RU/EN/TH translation review

**Status: SOURCE-VALIDATED / architecture patterns only.** Reviewed upstream specifications and live plugin search/extraction. No runtime, dependency, model artifact, account, or connector was installed.

### Agent and Skill contracts
- [Agent Skills specification](https://agentskills.io/specification) defines a portable Skill as a directory with required `SKILL.md` YAML frontmatter (`name`, `description`) plus optional `scripts/`, `references/`, `assets/`, license and compatibility metadata. Its `allowed-tools` field is explicitly experimental; therefore it is metadata for display/validation, **not a permission grant**.
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) / [Agent streaming](https://openai.github.io/openai-agents-python/streaming/): retain a typed run lifecycle distinct from assistant text; visible output can precede completion of the entire run/event iterator. Use events for activity, persisted state for recovery and explicit cancelled/failed/interrupted outcomes.
- [AG-UI Events](https://docs.ag-ui.com/concepts/events) and [Subagents](https://docs.ag-ui.com/concepts/subagents): model run/step/activity/subagent events as typed status projections; attribution says which worker emitted an event, not whether it has permission to read a source.
- Disposition: keep aLandi Agent Library, Skill Library, Memory, Research Evidence and Model Registry as distinct stores. A manifest declares role/model/skills/data scopes/output contract; an independent policy broker computes effective grants. Imported Skill packages are inert until reviewed. No Agents SDK or AG-UI dependency added.

### Multi-model registry and hardware-aware scheduling
- [Ollama `GET /api/ps`](https://docs.ollama.com/api/ps) exposes loaded model name/digest/size, quantization details, expiry, VRAM bytes and context length. [`POST /api/show`](https://docs.ollama.com/api-reference/show-model-details) exposes license text, parameters, capabilities, model details and model_info.
- [Ollama FAQ](https://docs.ollama.com/faq) documents multiple concurrently loaded models only when memory allows; otherwise requests queue and idle models can be unloaded. It documents `OLLAMA_MAX_LOADED_MODELS`, `OLLAMA_NUM_PARALLEL`, `OLLAMA_MAX_QUEUE`, and the fact that parallel requests multiply context-memory needs.
- Disposition: registry should use exact local digest and `/api/show` metadata, plus measured task quality, latency, RAM/VRAM, model load/unload time and language coverage. Select a task model by capability + budget, return an explicit no-fit outcome and show any user-authorized fallback. Do not infer capacity from model count. Current gateway remains one worker/model slot and sequential; no concurrency change without target-host measurements.

### Browser, Coder and external tool boundaries
- [Cloudflare Browser Run — Browser Agent](https://developers.cloudflare.com/agents/examples/browser-agent/) shows CDP-backed browsing and page inspection; [Playwright session management](https://developers.cloudflare.com/browser-run/playwright/) supports one-time or reusable browser sessions; [Browser Run Guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/) binds hostname allowlists to a session and notes that omitted guardrails leave HTTP(S) unrestricted.
- [Vercel Sandbox Firewall](https://vercel.com/docs/sandbox/concepts/firewall) exposes explicit deny-all and domain allowlist policies; [Vercel Queues Python SDK](https://vercel.com/docs/queues/python-sdk) is a managed queue API, not a reason to replace the existing SQLite lifecycle.
- Disposition: borrow the security shape only: per-run isolated browser session, explicit hostname policy, no ambient secrets, read/write separation, path confinement, approval ticket bound to exact args, audit, timeout and cancellation. The user's selected-file Workspace remains the basis for local Coder; execution requires a separate sandbox. No Browser Run, Vercel Sandbox or managed queue integrated.

### Offline translation and grammar — RU / EN / TH
- [Argos Translate](https://github.com/argosopentech/argos-translate) is an MIT offline translation library; it loads separate `.argosmodel` packages and can pivot through an intermediate language when no direct pair is installed. Pivoting may reduce quality.
- The live [Argos package index](https://github.com/argosopentech/argospm-index/blob/main/index.json) lists package version 1.9 directions `en→ru`, `ru→en`, `en→th`, `th→en`. The index provides version/link but not package SHA or per-weight license. **Candidate discovery only:** do not ship these artifacts until each exact package has a verified digest, provenance and redistribution terms.
- [Helsinki-NLP OPUS-MT-train](https://github.com/Helsinki-NLP/Opus-MT-train) states its released pre-trained models are CC-BY 4.0. [Helsinki-NLP OPUS-MT Thai→English card](https://huggingface.co/Helsinki-NLP/opus-mt-th-en) identifies translation direction, preprocessing and its 2020 Tatoeba test benchmark. A current mainstream `en→th` Helsinki card was not found in the source check; don't assume pair symmetry or substitute the community Argos package without its own license/hash check.
- [LanguageTool supported languages](https://dev.languagetool.org/languages) lists English and Russian rule coverage (the checked page is version 6.6 dated 2025-03-27) but no Thai. [Embedded HTTP server](https://dev.languagetool.org/http-server.html) runs locally; the upstream documentation explicitly says the local embedded server lacks AI-based rules available in the cloud. Core repo is LGPL-2.1-or-later.
- [PyThaiNLP](https://github.com/PyThaiNLP/pythainlp) is Apache-2.0 code; its README distinguishes CC0/CC-BY-4.0 for its data/models. It provides Thai segmentation, POS and text/spelling utilities, but this evidence does not establish full Thai grammar correction.
- Disposition: plausible modular candidates are Argos EN↔RU/TH pending exact package audit, LanguageTool offline for EN/RU, and PyThaiNLP for Thai segmentation/spelling. Thai contextual grammar remains open research/evaluation, not an implemented or selected capability. Keep original text immutable until acceptance, preserve code/citations/formatting, and make cloud fallback opt-in.

### Assistant-side plugin role map — not aLandi runtime permissions
- **GitHub** is canonical repository change/CI evidence; **Exa** broad semantic discovery and primary-source search; **Firecrawl** developer docs, scraping and structured extraction; **Context.dev** live search/page extraction. Use source freshness and provenance, not the number of hits, as the quality signal.
- **Superpowers** supplies the working process: plan, failing test first, minimal patch, focused verification and a separate review pass.
- **Coder** supplies a separate build-link workflow for creating apps/sites; it is not a direct repository coding agent. Do not substitute it for GitHub code changes.
- **Cloudflare** docs are relevant for Browser Run/Guardrails and future Tunnel/Workers/Queues decisions; **Vercel** docs for sandbox firewall, durable execution and AI SDK patterns. Treat them as references unless the owner separately authorizes an actual provider integration.
- **Base44/Floot/Hercules** are app-builder surfaces; **Railway/Render/Hostinger** hosting surfaces; **TinyFish/BrowserAct** browser automation; **Plugin Management** connection discovery. They should not be parallelized into competing builders/hosts. No account access/OAuth/connector setup is authorized by this research.
- No plugin result is itself a runtime tool grant. Any future live integration requires connector credentials, scoped typed contract, owner approval, audit and exact evals.

### Next implementation disposition
1. Plan 1 remains first: strict bounded context packet + encrypted worker handoff + context-aware idempotency, then chat UI and K.6.16 live status.
2. Plan 2 follows: migrate the legacy four-stage pipeline into the separate `multi_step_evidence_report` Deep Research method with ResearchTrace parity.
3. Agent Library / multi-model router / Skills catalog / tool adapters / Translator / grammar / offline package proceed as subsequent K.5 phases. Do not install artifacts or turn speculative catalog entries into enabled features without exact provenance and evals.


## 2026-11-16 — OR-013 continuation: bounded AgentRun context, prompt-injection boundary and idempotent retries

**Status: SOURCE-VALIDATED.** Exa reviewed 9 targeted searches (64 result slots) and fetched official OWASP, OpenAI Agents SDK, AG-UI, Pydantic/FastAPI, IETF draft and Stripe pages. Search hits were filtered; these are design constraints, not claims of upstream dependency adoption.

- [OWASP LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html): user messages, retrieved files, web pages, tool outputs and conversation history are all untrusted channels. Delimiters/labels help model interpretation but are not an enforcement boundary. Validate tool arguments and authorize against the caller in execution code outside the model; least privilege and action-specific approval remain mandatory.
- [OWASP RAG Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html): preserve provenance and approved-document digests in a separately protected manifest; enforce source access at retrieval time, bound context size/chunk count, isolate tenants, fail closed and retain audit lineage. A hash proves integrity against a baseline, not content safety.
- [OpenAI Agents SDK Sessions](https://openai.github.io/openai-agents-python/sessions/): sessions retrieve stored history before a run and persist new items after it; `session_input_callback` can filter/reorder old history without re-persisting it as new input. Its docs warn SQLiteSession trusts the database and session ID is not authentication/authorization. aLandi borrows bounded selection, not the SDK or session storage.
- [OpenAI Agents SDK Context](https://openai.github.io/openai-agents-python/context/): local application context is not sent to the model; shared policy inputs can gate tool visibility, but execution code must still authorize operations and validate arguments. Persisted run state should not contain secrets.
- [AG-UI Events](https://docs.ag-ui.com/concepts/events): run lifecycle has explicit start and terminal success/error; activity state can use snapshot/delta updates and subagent attribution. Use durable aLandi events as recovery truth and UI activity as a projection; don't expose hidden reasoning or fabricate progress.
- [IETF HTTPAPI Idempotency-Key draft](https://ietf-wg-httpapi.github.io/idempotency/draft-ietf-httpapi-idempotency-key-header.html): a key must not be reused with a different request; optional request fingerprints detect mismatched retries. Same key + same fingerprint is replay; same key + different fingerprint is a conflict; concurrent duplicate behavior is distinct from completed replay.
- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests): idempotency is intended for retry after connection loss; parameter mismatch under a reused key is rejected. Key lifecycle/retention must be documented.
- [Pydantic strict models](https://pydantic.dev/docs/validation/latest/api/pydantic/config/) and [FastAPI body fields](https://fastapi.tiangolo.com/tutorial/body-fields/): explicit strict type validation, forbid unknown fields and bound text lengths. Current aLandi gateway uses explicit hand validation for the AgentRun body to avoid changing broader request model contracts.

### OR-013 implementation boundary
- AgentRun context is a versioned, bounded packet of explicit user/assistant history and typed selected-source excerpts. Preserve opaque IDs, source kind, scope and inclusion reason; never accept system/developer/tool roles or arbitrary nested metadata.
- Store packet only in existing Fernet payload vault; do not place raw text in SQLite run/task metadata or event rows.
- Reuse existing SQLite idempotency contract: same key and same request returns the original run; same key with changed prompt/context/model/strategy conflicts.
- Context text is still untrusted and grants no resource access. Keep AgentRun feature-off and direct chat default.
- Main chat context construction, source picker authorization, event status overlay and UI integration remain subsequent slices. No automatic transcript, whole-project file, arbitrary URL or memory ingestion.

## 2026-11-17 — AgentRun chat status projection and non-blocking observation

**Status: SOURCE-VALIDATED / IMPLEMENTED PARTIAL.** Rechecked the [AG-UI event model](https://docs.ag-ui.com/concepts/events) via Exa/Firecrawl/Context.dev as a reference for typed lifecycle/activity projection. The implementation deliberately retains aLandi's authenticated SQLite event journal and existing snapshot/events endpoints; AG-UI is not installed as a runtime dependency and no transport migration is justified by measured latency/load evidence.

- Keep durable run/task state and monotonic event IDs as recovery truth; the browser status surface is only a projection. Reconcile the current snapshot with replayed events and deduplicate by event ID.
- Render an allowlist of user-safe event labels only. Do not surface event metadata, raw prompts, encrypted payloads, hidden reasoning or untrusted source text.
- Keep one observer per run. Main-chat submission returns after server acceptance; the observer continues in the background so chat input is not held for the full run duration. Reload recovery reattaches to the existing run ID.
- Elapsed time is derived only from the server's run `created_at`; it is not a completion estimate or progress percentage. Cancellation is retryable after an unconfirmed response and only a server-confirmed terminal state is shown as cancelled.
- UI controls use the existing 44px mobile target contract and a polite status region that changes only when the state text changes. Future actions are not fabricated; they will appear only when the runtime emits typed, permission-aware operational events.
- No AG-UI SDK, SSE transport, second event store, extra worker, new permissions or model dependency added.

## 2026-11-17 — Owner architecture 2.0 review: primary-source verification and disposition

**Status: SOURCE-VALIDATED / CANDIDATE REVIEW ONLY.** Evaluated OR-003 against official upstream pages and current aLandi contracts. No hosting migration, runtime, dependency, model replacement or permission change is accepted here.

### Infrastructure and origin
- [Cloudflare Pages — custom headers](https://developers.cloudflare.com/pages/configuration/headers/): `_headers` applies to static asset responses, not responses generated by Pages Functions. Headers for Function/API responses must be attached in the Function response. This corrects the blanket claim that Pages cannot set COOP/COEP.
- [Cloudflare Pages — redirects and proxying](https://developers.cloudflare.com/pages/configuration/redirects/): `_redirects` supports 200 proxy rewrites only for relative URLs on the same site; it cannot proxy an external hostname. Rules do not apply to requests served by Pages Functions. A same-origin API design therefore needs a concrete Function/Worker route and tests; it is not established merely by adding a Tunnel hostname.
- **Disposition:** retain GitHub Pages/Jekyll browser client → Cloudflare Tunnel → FastAPI gateway → private loopback Ollama in AGENTS.md. Vite/Cloudflare Pages migration and same-origin API proxy are deferred until a requirement, route/auth/CORS design, parity tests and rollback plan exist.

### Retrieval and multilingual indexing
- [SQLite FTS5](https://www.sqlite.org/fts5.html) documents that trigram full-text queries with fewer than three Unicode characters do not match rows. Any experiment needs a short-query fallback.
- Trigram indexing alone does not provide Thai word segmentation or Russian morphology. Preserve current FTS5/lexical baseline until a permission-scoped RU/EN/TH golden set compares ranking/recall, citation correctness, short-query behavior, latency and RSS. sqlite-vec, embeddings and reranking remain candidates.
- Reuse existing RRF/lexical patterns before adding a reranker; a CPU reranker requires a measured relevance gap and a same-corpus baseline win.

### Model and voice checks
- [Qwen3.5-4B official model repository](https://huggingface.co/Qwen/Qwen3.5-4B): current card identifies Apache-2.0, image-text-to-text and Transformers/Safetensors artifacts. This does not establish compatibility with the current Ollama/GGUF runtime, target RAM/latency or chat-only quality. Keep it a candidate until exact runtime compatibility, digest, license and RU/EN/TH task evals are recorded.
- [PrismML-Eng Bonsai demo](https://github.com/PrismML-Eng/Bonsai-demo) documents upstream llama.cpp support for Bonsai 2 Q2_0 from release b11556 onward; PQ2_0 and PTQ1_0 remain fork-specific in the reviewed notes. Pin checkpoint format and inference backend together; existing staged artifact is not target installation.
- [whisper.cpp releases](https://github.com/ggml-org/whisper.cpp/releases): official v1.9.5 exists (2026-10-06) and is described as a maintenance release updating ggml to v0.26.0. This confirms the named version, not ARM real-time performance or a reason to replace the current ASR baseline.
- [Piper releases](https://github.com/OHF-Voice/piper1-gpl/releases): v1.8.0 is marked Latest. It adds a Thai TLTK phonemizer and documents limitations in the placeholder espeak-ng Thai phonemizer. Phonemizer support does not prove an approved/licensed Thai voice model exists; exact voice license, checksum and target-device tests remain mandatory.

### Architectural simplification proposals — deferred pending code/eval evidence
- Keep distinct cache contracts: browser cache, inference prefix/KV reuse and bounded exact-response cache; preserve bypass rules for tools, research, streaming, multimodal, partial and failed responses.
- Do not merge or delete provider/model/agent/skill registries until live schemas, ownership and consumers are mapped. A model catalog grants no capability or permission.
- Do not remove job leases/fencing/idempotency based only on a single-node assumption; inspect SQLite task lifecycle and verify cancellation, retry, stale-worker and restart behavior before simplifying.
- Keep Whisper/Vosk and Qwen3-ASR as comparative candidates until a same-corpus RU/EN/TH WER/CER/RTF/privacy evaluation selects a baseline.
- Pyodide, bubblewrap, MCP, sqlite-vec/OPFS, llama-server, cloud model fallback and a new router each require capability, security, compatibility, resource and rollback gates.
- systemd credentials/Unix sockets are future owner-runbook candidates; they do not authorize host installation, credential handling or VPS deployment.
- The chat → RAG → voice vertical slice is a useful product-value lens, but existing owner-approved Plan 1/2 and K.5 remain authoritative. No parallel backlog is created.


## 2026-11-17 — Landing 2.0 Product Architecture 2.0 external research

- TinyFish deep research run `01a1e8c8-4101-7a4a-90d4-dfe5da530fae`, completed 2026-11-17, 47 sources across source-grounded Notebook/RAG, Studio audio/slides/charts, local file storage, Coder sandbox, Offline Core, PEFT/LoRA, Skill Factory and catalog IA. [Full cited report](https://agent.tinyfish.ai/research/01a1e8c8-4101-7a4a-90d4-dfe5da530fae). Freshness: latest dated source 2026-10-31; 27 dated, 20 undated; none in requested recent window. Design input, not current-version proof.
- Source-grounded workflow references: [Mozilla document-to-podcast](https://mozilla-ai.github.io/document-to-podcast/step-by-step-guide/), [Podcastfy](https://github.com/souzatharsis/podcastfy), [Open Notebook](https://github.com/lfnovo/open-notebook), [NotebookLM-Lite](https://github.com/LRriver/NotebookLM-Lite), [SourceLens](https://github.com/msmahdinejad/SourceLens). Borrow selected-source chat, evidence and studio patterns; do not adopt whole stacks or treat upstream claims as aLandi evidence.
- Parsing/local storage: [Docling](https://github.com/docling-project/docling), [MinerU](https://github.com/opendatalab/mineru), [MDN OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system), [MDN quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria), [MDN File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API). Existing parser remains baseline; model licences separate.
- Offline/training: [Transformers.js](https://huggingface.co/docs/transformers.js/index), [WebLLM](https://github.com/mlc-ai/web-llm), [PEFT](https://huggingface.co/docs/peft/index), [Unsloth](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide). Browser WebGPU is not proof of tested offline capability; weights/data/tokenizer licences separate.
- Render/eval/skills: [PptxGenJS](https://gitbrent.github.io/PptxGenJS/), [python-pptx](https://python-pptx.readthedocs.io/), [Ragas](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/), [Agent Skills spec](https://agentskills.io/specification), [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/). Candidates only; pin versions and verify licence before adoption.
- Reuse existing aLandi IndexedDB, Gateway FTS5, Evidence Ledger, AgentRun and Coder Workspace. No dependencies, model weights, paid services or runtime were installed. Research-reported benchmark deltas, eviction timing and skill vulnerability percentages are not adopted as project facts without independent verification.
