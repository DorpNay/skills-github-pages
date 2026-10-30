# Voice 2.0 — первичный независимый обзор upstream и стандартов

**Дата:** 2026-10-31  
**Статус:** exploratory evidence; никаких компонентов не выбрано для production.  
**Метод:** 6 Exa search workstreams, 50 returned result slots before deduplication; official repositories, model cards, documentation and original papers fetched for high-signal candidates. This is a first pass, not an exhaustive census. Vendor/model-card claims are not aLandi benchmarks.

## 1. ASR: RU / EN / TH

| Candidate | Primary-source evidence | Important limits | aLandi disposition |
|---|---|---|---|
| [Qwen3-ASR 0.6B / 1.7B](https://github.com/QwenLM/Qwen3-ASR) | Upstream lists Russian and Thai among 30 languages, plus 22 Chinese dialects; unified offline/streaming model family. 0.6B is smaller candidate. Code repository has Apache-2.0 license. | README says streaming is currently available only with vLLM backend; streaming mode does not return timestamps and cannot batch. Exact model-weight terms must be checked on the selected Hugging Face revision independently from code license. 0.6B is not automatically light enough for 8GB alongside Ollama. | High-priority comparative candidate, not a default replacement. Test separately on RU/EN/TH and verify inference path/weights/license. |
| [Nemotron 3.5 ASR Streaming 0.6B](https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b) | 40 language-locales; Russian is transcription-ready; Thai is explicitly adaptation-ready, not production-ready out of the box. Cache-aware FastConformer-RNNT; configurable 80–1120ms chunks. | Model use governed by OpenMDW-1.1. Thai requires adaptation and measured quality; 600M model resource use must be benchmarked. | Candidate for RU and optional future Thai fine-tuning, not a ready RU/TH solution. |
| [Typhoon ASR Streaming 115M](https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m) and [research repo](https://github.com/warit-s/typhoon-asr-streaming) | True cache-aware streaming Thai ASR; 115M; model card reports 19.4% CER on TVSpeech at 1040ms lookahead and H100 RTF 0.020. Code Apache-2.0; this model weights CC-BY-4.0. | Results are author benchmarks on named datasets/hardware. Requires NVIDIA NeMo with a pinned commit in the reference stack. Heavy Thai-English code-switching is a known limitation; English words may be forced into Thai script. | High-priority Thai-specific baseline for a controlled benchmark; likely separate ASR adapter/runtime, not a direct whisper.cpp drop-in. |
| [sherpa-onnx streaming T-One Russian](https://github.com/k2-fsa/sherpa-onnx/blob/master/docs/source/onnx/pretrained_models/online-ctc/t-one-ctc-models.rst) | Existing model listing describes a small streaming Russian ONNX model (~138MB artifact in example). | Model is old/specific (8kHz example), exact model provenance/license and quality need revalidation. No Thai coverage established here. | Include as a low-resource Russian baseline only if license and current model quality check out. |

### Key finding

Do not ask one ASR model to solve three language profiles by marketing claim. A practical architecture may keep a multilingual baseline plus optional language-specific streaming adapters. The adapter contract should expose language, partial/final text, timestamps where available, confidence/diagnostics, cancellation and readiness. Language-specific normalization must be separate from acoustic decoding.

## 2. Thai ASR exposes a text-normalization problem

The [Typhoon ASR Real-time paper](https://arxiv.org/html/2601.13044) explains that Thai has no whitespace word boundaries and that number readings/repetition markers create multiple valid surface forms. It explicitly documents normalization and benchmark annotation conventions as important to model quality.

The newer [Typhoon ASR Streaming project](https://github.com/warit-s/typhoon-asr-streaming) adds decode-time phrase boosting and n-gram shallow fusion for vocabulary control. Its paper and README report a Thai-English code-switch limitation: some English words are mapped phonetically into Thai characters rather than preserved in Latin script.

**Design implication:** Voice 2.0 needs a typed post-ASR text-normalization layer with explicit policies:
- preserve original raw transcript alongside normalized/display text;
- preserve digits, dates, proper nouns, acronyms and code-switched segments;
- keep ASR text normalization, transliteration and translation as separate operations;
- never silently romanize a user's text or translate it to improve readability;
- record the chosen normalization policy and allow user correction.

## 3. Transliteration / romanization

| Source | Confirmed capability | Limitation / licensing | Recommended role |
|---|---|---|---|
| [Unicode ICU transforms](https://unicode-org.github.io/icu/userguide/transforms/general/) | Script transforms include Latin ↔ Thai and Latin ↔ Cyrillic; optional language-specific transforms/fallback. Guidelines describe completeness, pronounceability and reversibility. | Generic script mapping may not follow a specific language's pronunciation; some mappings are intentionally reversible but case or edge cases can differ. ICU uses Unicode-3.0 license. | First candidate for generic script transformation and consistent rules across JS/Python adapters; evaluate exact transform IDs and output before use. |
| [Unicode CLDR transliteration guidelines](https://cldr.unicode.org/index/cldr-spec/transliteration-guidelines) | Defines script-, language- and script-language-specific transforms and explains reversible vs lossy transliteration. | Transliteration term is broad; do not assume every mapping is reversible. | Normative design reference for API semantics and tests. |
| [PyThaiNLP romanize](https://pythainlp.org/dev-docs/api/transliterate.html) | Thai-specific romanization engines: RTGS/Royin, neural thai2rom, ONNX option, TLTK, lookup. Apache-2.0 project license. | Different engines yield different outputs for the same word. RTGS is official but omits tone and vowel-length distinctions; engine/data/model dependencies must be reviewed separately. | Candidate for Thai romanization UX, not general-purpose transliteration. |
| [uroman](https://github.com/isi-nlp/uroman) | Context-aware universal romanizer, optional language code, supports many scripts and has improved Thai support; supports edge/lattice output with offsets/alternatives. | Not fully reversible; project license was not conclusively established in this pass and must be verified before any use. | Research-only candidate for cross-script search matching and comparison; do not use as user-visible canonical spelling. |
| [Unidecode](https://pypi.org/project/Unidecode/) | Context-free ASCII approximation for many Unicode characters. | GPL; explicitly not language-specific; quality degrades for scripts distant from Latin. | Not recommended for user-facing Thai/Cyrillic romanization. |

### Important semantic distinction

- **Transliteration:** script-to-script representation, ideally with a named standard and known reversibility properties.
- **Romanization:** transliteration into Latin script.
- **Transcription:** representing pronunciation; often lossy and context-dependent.
- **Translation:** preserving meaning across languages, not scripts.
- **Normalization:** canonicalizing orthographic variants (numbers, punctuation, spacing, repetitions, casing) under a declared policy.

These must be distinct operations and API names. Store the source text; do not overwrite it with a lossy transform.

### Thai-specific note

RTGS is an official Thai-to-Latin transcription system, not a phonetic or fully reversible transliteration. PyThaiNLP examples show that RTGS, neural thai2rom and TLTK can produce different romanizations for the same Thai input. The UI must let the user choose the intended convention (official/map-friendly, learner pronunciation, or machine/search normalization) rather than presenting one output as universally correct.

## 4. Voice-agent orchestration and full duplex

| Project / paper | Evidence | Cost / fit | Decision |
|---|---|---|---|
| [LiveKit Agents](https://github.com/livekit/agents) | Active realtime framework; WebRTC ecosystem, server-side job scheduling/dispatch, semantic turn detection, STT/LLM/TTS composition, MCP and built-in tests. Repository activity observed through 2026-10-28. | Requires media/session infrastructure and operational surface beyond static Pages + current gateway. | Keep as architecture/reference candidate; no migration. |
| [Pipecat](https://github.com/pipecat-ai/pipecat) | BSD-2-Clause voice/multimodal framework; composable streaming pipelines, WebRTC/WebSocket transports, modular STT/LLM/TTS, multi-agent handoff/fan-out. | Additional Python runtime/dependencies and transport/session complexity. | Compare against current adapter orchestration only if measured gaps justify it. |
| [NemotronLabs VoiceChat 11B](https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B), [paper](https://arxiv.org/pdf/2609.21967.pdf) | Open full-duplex speech-to-speech with streaming perception, assistant audio, incremental transcript and structured tool-call channel; model card reports ~450ms turn-taking. | 11B model; research reports H100 80GB environment; model governed by OpenMDW-1.1. Vendor/research metrics are not aLandi measurements. | Architecture inspiration only; not viable on the current planned 8GB CPU VPS. |
| [Typhoon ASR streaming server](https://github.com/warit-s/typhoon-asr-streaming) | Includes OpenAI Realtime-style WebSocket ASR server and LiveKit STT adapter. | NeMo stack and GPU-focused reference setup. | Potential adapter/transport pattern; do not adopt whole stack. |

A full-duplex model is not equivalent to a cascaded pipeline with VAD. Acceptance must explicitly measure interruption stop latency, false barge-ins, missed interruptions, backchannels, overlap, endpoint delay, audio drops and post-interruption response quality.

## 5. Research implications and current shortlist

1. Keep whisper.cpp + Piper as the current local baseline.
2. Benchmark Qwen3-ASR 0.6B as a multilingual RU/TH candidate, but account for its vLLM-only streaming path and 0.6B resource profile.
3. Benchmark Typhoon ASR Streaming 115M as a Thai-specialized streaming candidate; explicitly test code-switching and transcript normalization.
4. Keep Nemotron 3.5 as a RU-ready / Thai-adaptation candidate; do not label Thai as supported for production without adaptation.
5. Evaluate ICU + PyThaiNLP for transliteration/romanization as a separate text-processing capability, not part of the ASR model.
6. Keep Pipecat and LiveKit as reference architectures only; no runtime framework adoption.
7. Treat 11B full-duplex systems as high-end research, not the current host deployment plan.

## 6. Follow-up tasks

- [ ] VOICE-EXT-001 — verify Qwen3-ASR exact model-card license and inference resource profile on target host.
- [ ] VOICE-EXT-002 — verify Typhoon 115M exact model/NeMo compatibility, artifact hashes, CC-BY attribution and resource needs.
- [ ] VOICE-EXT-003 — build Thai code-switch benchmark slice with Latin/Thai entity preservation and normalized-vs-raw transcripts.
- [ ] VOICE-EXT-004 — prototype offline comparison of ICU, PyThaiNLP RTGS/thai2rom/TLTK and uroman on consented RU/TH fixtures; do not add runtime dependency yet.
- [ ] VOICE-EXT-005 — verify uroman license and exact language-specific behavior before any redistribution.
- [ ] VOICE-EXT-006 — compare LiveKit vs Pipecat against the existing FastAPI/browser contracts and operational footprint, no migration.
- [ ] VOICE-EXT-007 — extend voice acceptance matrix to full-duplex interruptions, echo, Bluetooth, mobile lifecycle and speaker diarization.
- [ ] VOICE-EXT-008 — review audio/text retention, consent, user correction and privacy threat model.

## Sources reviewed in this pass

- Qwen3-ASR repository and model card: https://github.com/QwenLM/Qwen3-ASR ; https://huggingface.co/Qwen/Qwen3-ASR-0.6B
- Nemotron 3.5 ASR model card: https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b
- Typhoon streaming repository/model card/paper: https://github.com/warit-s/typhoon-asr-streaming ; https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m ; https://arxiv.org/html/2601.13044
- ICU transforms and license: https://unicode-org.github.io/icu/userguide/transforms/general/ ; https://github.com/unicode-org/icu/blob/main/LICENSE
- Unicode CLDR transliteration guidance: https://cldr.unicode.org/index/cldr-spec/transliteration-guidelines
- PyThaiNLP API and license: https://pythainlp.org/dev-docs/api/transliterate.html ; https://github.com/PyThaiNLP/pythainlp/blob/dev/LICENSE
- uroman and Unidecode: https://github.com/isi-nlp/uroman ; https://pypi.org/project/Unidecode/
- LiveKit and Pipecat: https://github.com/livekit/agents ; https://github.com/pipecat-ai/pipecat
- NemotronLabs VoiceChat: https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B ; https://arxiv.org/pdf/2609.21967.pdf

**Caveat:** exact license status for Qwen model weights and uroman remains open; this report confirms only the Qwen repository code Apache-2.0 and PyThaiNLP project Apache-2.0. No model was downloaded or executed; no aLandi benchmark was run.
