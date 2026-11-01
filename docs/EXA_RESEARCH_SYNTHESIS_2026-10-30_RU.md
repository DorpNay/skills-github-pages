# Exa research synthesis — aLandi architecture and first functional update

Date: 2026-10-30. Coverage: 45 targeted research queries and up to 360 requested result slots; primary repositories, model cards, specs and vendor documentation fetched for high-signal candidates. This is a decision-oriented review, not an exhaustive census.

## Decisions
1. Keep whisper.cpp + Piper as the working baseline; no replacement before measured RU/EN/TH quality wins.
2. Prototype NVIDIA NeMo-Speech.cpp as an optional speech runtime. Code is Apache-2.0, based on ggml, with streaming/offline ASR, WebSocket transcription, VAD/endpointing, diarization, TTS and optional full-duplex VoiceChat. Model licences are separate.
3. Language coverage is uneven: Nemotron 3.5 ASR is RU transcription-ready but TH adaptation-ready; Typhoon is Thai-specialized; VibeVoice covers RU but not TH.
4. Keep bounded ToolDAG and Ollama. No new agent framework or GPU scheduler without a demonstrated gap.
5. Build Knowledge-to-Skill against the Agent Skills spec; book-to-skill is a design reference, not a blind dependency.
6. OOXML DTD handling and duplicate tests are fixed; direct Actions pins migrated to Node24.

## ASR candidates
| Candidate | Confirmed scope | Constraint |
|---|---|---|
| [Nemotron 3.5 ASR 0.6B](https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b) | Cache-aware streaming RNNT; 40 locale metadata; RU transcription-ready, TH adaptation-ready; configurable 80–1120ms chunks. | Model terms OpenMDW-1.1. TH is not ready until adapted and benchmarked. |
| [Typhoon ASR Streaming 115M](https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m) | Thai-specialized cache-aware streaming FastConformer-RNNT; CC-BY-4.0. | Separate NeMo/PyTorch path, not a built-in NeMo-Speech.cpp model. Author reports 16.4% CER at its 3200ms TVSpeech setting; not an aLandi result. |
| [VibeVoice ASR Streaming 1.5B](https://huggingface.co/microsoft/VibeVoice-ASR-Streaming-1.5B) | Ten listed languages including RU; speaker-attributed streaming; MIT model card. | TH not listed; ~2.93s chunks plus ~0.53s lookahead. |
| [whisper.cpp](https://github.com/ggml-org/whisper.cpp) | Existing local baseline. | Keep until measured win on identical RU/EN/TH clips, WER/CER, partial latency, RTF, memory and thermal tests. |

Use explicit language selection first; add language ID only if measured reliable. Adapters expose partial/final transcript, language, timestamps, cancellation and readiness.

## TTS / realtime conversation
- [VoxCPM2](https://huggingface.co/openbmb/VoxCPM2): 2B, Apache-2.0, 30 languages including RU/TH, 48kHz, streaming. Model card reports ~0.30 RTF and ~8GB peak VRAM on RTX 4090 standard PyTorch; optimized Nano-VLLM reports ~0.13. Optional GPU TTS candidate, not Piper replacement before benchmark.
- [MagpieTTS 357M](https://huggingface.co/nvidia/magpie_tts_multilingual_357m): NVIDIA Open Model License; 12 languages but excludes RU and TH.
- [NemotronLabs VoiceChat 11B](https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B): full duplex, turn-taking, barge-in and tool calling; OpenMDW-1.1. Deployment needs NVIDIA GPU with at least 80GB VRAM, x86_64 Linux and CUDA. Extreme optional tier, not a default workstation.
- [Pipecat](https://github.com/pipecat-ai/pipecat) is transport-flexible; [LiveKit Agents](https://github.com/livekit/agents) has integrated WebRTC/session infrastructure. No migration selected.
- [voicebench](https://pypi.org/project/voicebench/) (Apache-2.0) measures TTFA, barge-in stop time, false barge-ins, overlap, stalls and WER. [EoT Bench](https://github.com/livekit/eot-bench) has 14 languages but not RU/TH. [TurnBench](https://github.com/SesameAILabs/turnbench) datasets have separate terms; do not reuse non-commercial audio without permission.

Required aLandi evaluation: owned/consented RU/EN/TH clips; WER/CER; partial latency; endpointing; TTFA; interruption stop latency; false interruption; echo; CPU/GPU/VRAM/RAM; p50/p95; thermals; exact model SHA/licence.

## NeMo-Speech.cpp assessment
[Official runtime](https://github.com/NVIDIA/NeMo-Speech.cpp) is Apache-2.0 code based on ggml. It documents authenticated /v1 routes when an API key is configured, realtime transcription WebSocket and full-duplex VoiceChat WebSocket. Health/readiness routes are intentionally unauthenticated. One model loads per capability per process. Standard ASR/TTS builds have CPU/accelerator backends; VoiceChat is a separate CUDA build/model tier. Put behind the aLandi gateway; never expose directly to the public browser. Model licence review stays separate from code licence.

## GPU and helper models
Keep Ollama baseline; it already schedules residency and memory. Benchmark [llama.cpp server](https://github.com/ggml-org/llama.cpp) for GGUF/GPU offload, slots and continuous batching. Use vLLM only if compatible hardware and concurrency justify its footprint. Define helper roles, exact artifact/licence, capabilities, scopes, deadlines, token/concurrency budgets and golden evals; Qwen3.5-0.8B / Granite-4.2-3B remain candidates, not production selections.
GPU-only means the model fits fully in VRAM; if device/backend is insufficient or unknown, fail closed. Gateway, OS, network and I/O still use CPU; partial offload is not GPU-only.

## Orchestration / Knowledge-to-Skill
Keep ToolDAG. Define durable AgentRun state/events, idempotency, deadlines, budgets, cancellation, backpressure, permissions, approvals, recovery and audit before framework choice. [LangGraph](https://docs.langchain.com/oss/python/langgraph/graph-api) may rerun interrupted nodes from the start, so side effects must be idempotent. [DBOS](https://docs.dbos.dev/architecture) uses PostgreSQL; [Temporal](https://docs.temporal.io/ai) adds service/workers for distributed long-running tasks. No engine selected.
Follow [Agent Skills](https://agentskills.io/) folder contract: required SKILL.md plus optional scripts/references/assets; allowed-tools is metadata, not a sandbox. [book-to-skill v1.3.0](https://github.com/virgiliojr94/book-to-skill/releases/tag/v1.3.0) is MIT code and a useful reference. Build a private pipeline: source/license → bounded extraction → page/section offsets + hash → evidence synthesis → injection/secret/path scan → schema validation → human review → version/diff/rollback/delete. No generated scripts or permissions auto-activate. Cloud model use requires disclosure; copyrighted-book derivatives remain private unless rights permit.

## Security and ingestion
OWASP guidance: allowlist and sniff file type; cap file/archive expansion; reject unsafe paths, DTD/external entities; bound parser time/memory. The prior OOXML parser did not explicitly reject DTD. Fixed by a TreeBuilder that rejects doctype(), enforces actual expanded XML size and maps prohibited XML to HTTP 400. Seven duplicate test definitions were removed; internal-entity and external-DTD regressions added. Parser worker isolation and a wider adversarial corpus remain open.

## Node24 CI
GitHub removed Node20 from Actions runners on 2026-09-23 ([official notice](https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/)). Direct pins migrated in commit 48874eab1cdce698b2dcfd681413d2cd45e27b38 across 13 workflow files:
- checkout v7.0.1 — 3d3c42e5aac5ba805825da76410c181273ba90b1
- setup-python v7.1.0 — 6d4fd22b20465ccc0f7354476588e8df7c9ca0e0
- setup-node v7.1.0 — 949feb2413d6458794dcd2491c4babbbce0c15c1
- upload-artifact v7.0.2 — cf430e030ddbb5b0abf93d22962f4752f3646cd9
- add-and-commit v11.1.1 — cc9c08ba6c8df3b93a8f2db63e89b98368ae2ae8
- action-text-variables v4.0.1 — d277ce34621ab00a53db0517d18304a7032453c5
- action-keyphrase-checker v2.0.0 — 4771c016e1a66082db6bff148136b82689f7bd84

These are immutable pins to verified commits; required input names were checked. External skills/exercise-toolkit@ebf43bb remains pinned because newer upstream changes issue/README/image and finish behavior. Review separately before upgrade; Node20 warnings may remain when those reusable workflows run.

## Verification and next gates
- XML hardening/test dedup: 051308c3a8ff95369ddd784503771f6387bc70d9; Gateway CI 156 passed, one upstream Starlette/AnyIO deprecation warning.
- Node24 update: 48874eab1cdce698b2dcfd681413d2cd45e27b38.
- On 48874eab: Gateway, Quality (Jekyll, Context, Integrity, Security, Chromium, published Pages smoke), Graphify, Dead Code, Provenance and Freshness all passed.
- Pending: full manual architecture/security review; real hardware RU/EN/TH voice benchmark; streaming voice; helper registry; durable orchestration decision; Knowledge-to-Skill implementation; owner-host gates.

**Adoption status:** research recorded; no speech model, full-duplex framework, GPU scheduler, orchestration engine or converter added to production.
