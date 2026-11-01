# aLandi Intelligence / Source Register (INTEL.md)

**Review date:** 2026-10-22. Recheck upstream releases and model cards before shipping an artifact.

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
