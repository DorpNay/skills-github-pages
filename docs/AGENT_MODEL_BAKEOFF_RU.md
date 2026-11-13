> **Historical research/spec snapshot — PR #125; imported 2026-11-08.** Main baseline is `c4f23e03f563d03213eb87002863da630fc8b833`. Preserve source context; no runtime implementation is inferred. Canonical active task register: `docs/MASTER_TASK_REGISTRY_RU.md` plus addendum; source review status in `INTEL.md`.
> **Current boundary:** Historical model shortlist/evaluation plan. Benchmark figures are upstream claims or prior research, not aLandi measurements. Auxiliary model/runtime weights were downloaded and hash-verified in GitHub Actions on 2026-11-13 (runs #43417527347 and #43417305393); they are not installed on the target host. The owner-supplied primary checkpoint remains excluded. Source/license/hash and hardware/storage fit still require target-host review.

---

# aLandi — small-model и agent-model bake-off

**Статус:** кандидаты для eval; ни один checkpoint не выбран для production.  
**Дата:** 2026-10-31 (повторная проверка первичных model cards).  
**Базовые ограничения:** существующий VPS-профиль около 8 GB RAM, Ollama-first inference, одна локальная генерация за раз; точные CPU/GPU/VRAM параметры целевого хоста в этом документе не подтверждены.

## 1. Принцип

Нужно сравнивать не «самую умную маленькую модель», а **модель для конкретного контракта агента**: классификация, extraction, structured output, tool selection, critic, coding, multimodal parsing или диалог. Один checkpoint может быть хорошим классификатором и плохим planner. Нельзя назначать отдельную модель каждой из 64 профессий.

Три базовых маршрута:

- T0 — детерминированный код, schema validation, search/FTS, расчёты и policy.
- T1/T2 — компактная модель на bounded specialist tasks, запускаемая по требованию.
- T3 — основная модель или разрешённый пользователем внешний provider для сложной декомпозиции и синтеза.

На старте держать в RAM один checkpoint; helper-model benchmark выполнять поочерёдно, а не загружать все веса одновременно.

## 2. Кандидаты из первичных model cards

| Модель | Размер / факты из model card | Возможные роли | Важные оговорки |
|---|---|---|---|
| [Qwen3.5-0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B) | 0.8B; Apache-2.0; vision-language; 262K native context. Model card прямо позиционирует checkpoint для prototyping, task-specific fine-tuning и research. Vendor-reported BFCL-V4 25.3 / τ-bench 11.6. | Tiny extraction, language/intent classification, narrow routing, low-risk structured helper. | **Не ставить первым tool-using subagent:** собственные agent benchmarks card слабее 2B версии. Большой context не означает пригодность 262K на 8 GB. Проверить RU/EN/TH, JSON exactness и Ollama support. |
| [Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B) | 2B; Apache-2.0; vision-language; 262K native context. Vendor-reported BFCL-V4 43.6 / τ-bench 48.8 (same Qwen3.5 model-card table). | First stronger Qwen-family candidate for bounded tool-selection and structured subagent experiments. | Card также указывает intended use prototype/task-specific/research. Benchmarks are vendor-reported; test RU/EN/TH, exact tool schemas, runtime support and 8-GB RSS/KV cache. |
| [Qwen3.5-4B](https://huggingface.co/Qwen/Qwen3.5-4B) | 4B; Apache-2.0; vision-language; 262K native context, extensible to 1.01M. Vendor-reported BFCL-V4 50.3 / τ-bench 79.9 / VITA-Bench 22.0 / DeepPlanning 17.6. | Strongest current Qwen3.5 compact candidate for planner/tool-use experiments if target RAM permits; compare as primary local model against 2B. | 4B checkpoint may be tight on 8-GB host after OS, gateway and KV cache; never use 262K context by default. Scores are upstream-reported; test actual RU/EN/TH, exact schemas and local runtime. |
| [Gemma 4 E2B-it](https://huggingface.co/google/gemma-4-E2B-it) / [E4B](https://huggingface.co/google/gemma-4-E4B) | Apache-2.0 по model card. E2B: 2.3B effective, **5.1B total с embeddings**; E4B: 4.5B effective, **8B total**. 128K context; native function calling; image/audio input на E2B/E4B; 35+ out-of-box languages по card. | Multimodal worker, document/image understanding, tool-use specialist на workstation/устройстве с достаточной RAM. | E2B по total weights может быть слишком тяжёлой для VPS 8 GB после учёта OS, gateway и KV cache; E4B не рассматривать для этого профиля. 140+ pretraining languages ≠ гарантированное качество RU/EN/TH. Проверить quant/runtime и modality eval. |
| [Granite 4.2-3B](https://huggingface.co/ibm-granite/granite-4.2-3b) | 3B; Apache-2.0; 128K native (long-context extension заявлен до 512K); tool calling with reasoning; release date 2026-08-25 по card. | Structured tool caller, coding/reasoning worker, agentic workflow experiments. | В model card перечисленные tested languages не включают Russian или Thai. Vendor quality claims надо проверить; 3B + KV cache может быть тяжёлым для 8 GB. |
| [MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B) | Dense 2B Transformer; Apache-2.0; model card tags EN/ZH; upstream публикует BFCL/τ-bench/GAIA и coding-agent comparisons. | Tool-use, structured task worker, code/data assistant. | Параметры/бенчмарки — upstream claims; проверить точный context/runtime/quantization, RU/TH и output stability. Не переносить vendor score напрямую на aLandi. |
| [Phi-4-mini-instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct) | 3.8B; 128K; model card включает function-calling format; languages list includes Russian and Thai. | RU/TH capable candidate for structured helper, critic, code/reasoning worker. | Более тяжёлый dense checkpoint; model card признаёт ограничение фактических знаний и рекомендует retrieval augmentation. Проверить exact license metadata и runtime. |
| [SmolLM3-3B](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) | 3B; Apache-2.0; 64K trained context, up to 128K with YaRN; dual reasoning; tool calling. Model card metadata lists RU, but its prose explicitly names six native languages and does not include RU/TH. | Compact extraction/reasoning/tool-call experiment where language eval passes. | Не считать RU официально подтверждённым native-language support только по metadata tag; TH не заявлен. Проверить exact checkpoint, template, quantization and Ollama compatibility. |
| [FunctionGemma-270M-it](https://huggingface.co/google/functiongemma-270m-it) | 270M; 32K; text-only function calling; built on Gemma 3 270M; designed to be fine-tuned for task-specific function calling, not a general dialogue model. | Ultra-small constrained router/action classifier after fine-tuning. | Not a general assistant; task-specific fine-tuning is expected for best accuracy. Review Gemma license terms; never let it authorize or execute tools. |
| [DeepSeek-R1-Distill-Qwen-1.5B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B) | 1.5B; model/weights MIT according to upstream README; distilled from Qwen2.5-Math-1.5B with DeepSeek-R1 data. | Reasoning/critic experiment, constrained analysis. | Not selected as tool caller; test output schema, latency and verbosity. Base model license lineage still documented by upstream; keep provenance. |
| [Falcon-H1-1.5B-Instruct](https://huggingface.co/tiiuae/Falcon-H1-1.5B-Instruct) | 1.5B hybrid Transformer + Mamba; model card includes Russian in language list; uses Falcon-LLM License. | Multilingual compact worker experiment. | License is not Apache/MIT; inspect Falcon terms and commercial thresholds before use. Tool-call reliability not established by this source. |
| [LFM2.5-1.2B-Instruct](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct) | 1.2B family candidate; upstream license contains a commercial-use threshold tied to annual revenue (USD 10M) and specific terms. | Efficient edge/small-worker experiment if license fits. | Do not treat as permissive Apache/MIT; full license and derivative conditions must be reviewed. Tool-use and RU/TH quality require separate evidence. |

| [Qwen3-0.6B](https://huggingface.co/Qwen/Qwen3-0.6B) / [Qwen3-1.7B](https://huggingface.co/Qwen/Qwen3-1.7B) | 0.6B / 1.7B; Apache-2.0; 32K context; upstream claims 100+ languages and recommends Qwen-Agent for tool calling. | Tiny multilingual classifier/extractor baseline and compact tool-use worker. | Older generation than Qwen3.5; test actual RU/EN/TH and structured tool calls. Qwen-Agent templates/parsers are separate runtime components. |
| [Llama 3.2 1B / 3B Instruct](https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md) | 1B / 3B; Meta Llama 3.2 Community License; multilingual text models; official languages include Thai; quantized lightweight versions have 8K context; supports custom function calling in prompt. | Thai-capable baseline for intent/extraction and low-resource dialogue. | Not Apache/MIT; Russian is not in the official supported-language list. Lightweight variants do not include built-in hosted tools. Review Community License and AUP. |
| [Gemma 3 1B IT](https://ai.google.dev/gemma/docs/core/model_card_3) | 1B; Gemma license terms; 32K context; text + image input; training corpus covers 140+ languages. | Tiny vision/document worker and multilingual baseline. | Older than Gemma 4; do not infer native RU/TH quality from broad pretraining language count. |
| [Ministral 3 3B](https://docs.mistral.ai/models/ministral-3-3b-25-12) | 3B; Apache-2.0; 256K context; text/image input; structured outputs and function calling; edge deployment positioning. | Compact multimodal tool-use candidate. | Vendor docs rate speed higher than performance; 256K context is not a practical 8-GB target. Test local runtime and RU/TH. |
| [SmolLM2-1.7B-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct) | 1.7B; Apache-2.0; compact on-device family. | Lightweight English extraction/classification baseline. | Model card lists English; RU/TH are not supported-language claims. Older baseline, not default worker. |
| [Granite-3.3-2B-Instruct](https://huggingface.co/ibm-granite/granite-3.3-2b-instruct) | 2B; Apache-2.0; 128K context; upstream lists extraction, classification, retrieval, multilingual dialogue and function-calling tasks. | Compact structured extraction, RAG and tool-call baseline. | Language coverage is not a substitute for RU/TH task tests; older family member vs Granite 4.2. |
| [Qwen2.5-Coder-1.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct) | 1.54B; Apache-2.0; 32K context; code-specialized instruction model. | Coding subagent for narrow code explanation, patch suggestions and code review. | Coding model is not a safe execution environment and is not automatically a reliable tool caller. Verify repo-level task quality. |

### Дополнительные candidates to discover/verify before the bake-off

- Gemma 4 E2B/E4B quantized variants — on-device multimodal path.
- Granite smaller family variants — if tool use and license prove suitable.
- LFM2.5 2.6B and other small MoE models — measure active vs total parameters and resident memory, do not assume low active parameter count means low memory footprint.
- Dedicated embedding/reranker models — separate retrieval evaluation; they are not chat agents.
- Dedicated OCR/ASR/TTS checkpoints — separate modality workers and licensing/provenance records; do not overload an LLM with tasks that deterministic/specialized models handle better.

## 2.1 Ultra-small action models: not general-purpose agents

| Candidate | Upstream facts | Possible aLandi role | Gate / limitation |
|---|---|---|---|
| [FunctionGemma-270M-it](https://huggingface.co/google/functiongemma-270m-it) | 270M; Gemma terms; function-call focused; model card describes task-specific fine-tuning rather than general chat. | Constrained intent-to-action or function routing after fine-tuning on aLandi's tool schemas. | Never authorize or execute. Require per-tool exact-match, abstention and malicious-input eval; check current Gemma terms. |
| [Cactus Needle](https://github.com/cactus-compute/needle) | Upstream describes a tiny 121M-class model family, compact 8–29 MB model binaries, constrained tool calls, structured extraction and embeddings; Apache-2.0 is stated for the project code. | Benchmark as a local deterministic-shape action selector / extractor, not as a conversational agent. | Exact checkpoint/weights license, telemetry behavior, runtime, RU/EN/TH quality and model hashes must be reviewed separately. The upstream's own benchmarks are not aLandi results. |

## 3. First experiment matrix

Run on the exact target host once hardware access is available. Keep main model as control and compare no-helper vs one-helper at a time.

| Eval group | Representative tasks | Metrics / acceptance |
|---|---|---|
| Intent / routing | 100 RU/EN/TH tasks across simple, research, coding, multimodal, risky intents | Macro-F1; false-negative high-risk routing; latency; abstention |
| Structured extraction | JSON facts, dates, entities, schema-constrained outputs | Exact match, schema-valid rate, field-level precision/recall |
| Tool selection | Read-only tools, dependent tools, malformed/ambiguous request | BFCL-inspired tool-call exactness; invalid/unauthorized attempts must be denied by policy |
| Research worker | Multi-source evidence packets, claim extraction, source freshness | Citation precision, claim support rate, contradiction detection, hallucinated URL count |
| Critic/verifier | Detect planted factual/code defects | Recall of seeded defects, false-positive rate, calibrated INCONCLUSIVE |
| Coding worker | Small bounded fixes in fixture repositories | Unit/E2E pass, diff correctness, regression rate; no arbitrary host execution |
| Memory helper | Candidate facts, conflicts, scope and sensitivity | Fact precision, provenance completeness, cross-scope leakage = 0 |
| Multimodal | RU/EN/TH document/image/audio fixtures | Task accuracy by modality, peak RSS, latency; OCR/ASR metrics separately |

### Required workload profile

- At least 100 golden examples per high-impact task family where feasible.
- Three languages: Russian, English, Thai; include mixed-language and transliteration cases.
- Identical prompts, tools, schema, context, temperature, quantization and hardware for comparisons.
- At least 3 repeated runs for stochastic tasks; report median/p95 and variance.
- Human-rated quality with blinded A/B review for tasks that lack deterministic ground truth.
- Separate vendor-reported benchmark scores from aLandi measurements.

## 4. Runtime and memory measurements

Capture per candidate:

- exact repository/model ID, immutable revision/commit, file hashes and license;
- quantization format and bits, tokenizer/chat template, tool parser and runtime versions;
- model load time, cold start, peak RSS/PSS, resident memory after warmup, KV cache growth at 1K/4K/8K context;
- TTFT, tokens/sec, p50/p95 full completion latency;
- schema validity, tool-call exactness, RU/EN/TH quality, refusal/abstention quality;
- context size and actual token usage;
- CPU load, GPU utilization/VRAM where available, thermal throttling;
- behavior under concurrent web I/O while local generation is active;
- cancellation, timeout and restart behavior.

Do not use model-card maximum context as default. Begin with the smallest context that passes golden tasks (e.g. 4K/8K experimental buckets), then increase only if measured quality requires it. Do not infer 8-GB feasibility from parameter count alone.

## 5. Routing proposal

1. Keep deterministic T0 for schema, permissions, arithmetic, source hash, cache and task state.
2. Try Qwen3.5-0.8B and FunctionGemma only for narrow extraction/routing/tool-call experiments.
3. Compare Gemma 4 E2B/E4B, MiniCPM5-2B, Granite 4.2-3B, Phi-4-mini and SmolLM3 only against the actual RU/EN/TH benchmark and target-host memory.
4. Test DeepSeek R1 Distill and Falcon-H1 as specialist alternatives only if reasoning/multilingual tasks show a measured gap.
5. Select one helper model for one use case; do not introduce model zoo or dynamic routing until it beats main-only on quality/latency/cost and can be disabled cleanly.
6. Every model route has explicit allowlist and no silent provider fallback. The policy layer, not the model, decides whether a tool action is authorized.

## 6. Decision gate

A candidate is accepted only if all are true:

- license and base-model lineage are approved and recorded;
- exact immutable checkpoint and hashes are pinned;
- RU/EN/TH task metrics meet or exceed the main-only baseline for its target task, or a documented trade-off is accepted;
- no increase in unauthorized tool execution (must remain zero);
- target-host peak memory and p95 latency fit the declared budget with headroom;
- failure/cancellation/timeout behavior is bounded;
- rollback to main-only route is tested;
- feature flag is off by default until owner approves live activation.

**Updated test order (not production selection):** (1) Qwen3.5-4B vs 2B as the main compact tool-use bake-off; promote 4B only if measured peak RSS/PSS leaves safe headroom on the actual host; (2) MiniCPM5-2B as an independent architecture comparison; (3) Qwen3.5-0.8B for tiny classification/extraction only; (4) Phi-4-mini-instruct for RU/TH specialist tasks; (5) Granite 4.2-3B and SmolLM3-3B as comparison controls with language caveats; (6) FunctionGemma-270M and Cactus Needle as task-specific ultra-small action/extraction experiments. Gemma 4 E2B is a multimodal workstation candidate, not the default 8-GB VPS choice because total weights are 5.1B parameters. Vendor scores are shortlist signals only; no production winner until same-hardware RU/EN/TH eval and memory measurements pass.


## 2026-11-02 — Task-based small-model evaluation contract

Do not select helper models by parameter count or leaderboard rank. Evaluate one narrow role at a time against a golden set with identical prompts, schemas, context and hardware.

| Role | Required measurements |
|---|---|
| Classification / routing | macro-F1, confusion matrix, calibration, false escalation |
| Structured extraction | field-level precision/recall, JSON/schema validity, provenance retention |
| Reranking | Recall@k, MRR/nDCG, citation/source correctness |
| Summarization | factual consistency, omission rate, source attribution, human rating |
| Memory candidate generation | false-positive rate, duplicate/conflict detection, scope leakage |
| Skill synthesis | executable instruction validity, injection resistance, held-out task success |

Record exact model ID, immutable digest, code and weight licenses, quantization, context length, runtime version, prompt/schema version, RU/EN/TH scores, p50/p95 latency, TTFT, RAM/PSS, VRAM, cold load, concurrency and failure rate. No helper is promoted until it improves one role without degrading the main model or exhausting the target device. Keep only one optional helper resident unless measurements justify otherwise.


## 2026-11-13 — owner-directed primary model and artifact pinning

**Decision status: SPECIFIED candidate, not production VERIFIED.** The owner's preference for an uncensored Qwen main model is reflected in the primary candidate. This does not bypass artifact review, model evaluation, or the independent permission/approval layer.

### Primary chat model candidate

| Field | Pinned value |
|---|---|
| Model | HauhauCS/Qwen3.5-4B-Uncensored-HauhauCS-Aggressive |
| Revision | c09cdbcdb1fefad6d335809d445621b5f5ba0c6e |
| File | Qwen3.5-4B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf |
| Size | 2,707,513,696 bytes |
| SHA-256 | 79e28ecacf84e75b6056cf4059636d435aa9eb67795780f7b7dbc7d32a962741 |
| License | Apache-2.0 metadata; base Qwen3.5-4B is Apache-2.0 |
| Runtime target | Ollama first; llama.cpp comparison only if compatibility or measured performance requires it |

The main Q4_K_M checkpoint is deliberately excluded from the repository downloader: the owner will upload this primary model directly to the server. The separate BF16 vision projector is pinned at 675,568,768 bytes with SHA-256 a1e32e86ea99aa7a56f3dcfe7e63c1d0be9439d31fd07087099f15bc0fda0f22 and is included in the auxiliary artifact acquisition pack.

The model author reports zero refusals on 465 cases. This is an author claim, not an independent aLandi result. Treat this as a less-refusal candidate, not as proof of broad quality or a reason to remove application permissions. The GGUF scanner reports PAIT-GGUF-100: an informational finding that the file contains a Jinja chat template; it did not report known sandbox-escape patterns. Review the template against the official Qwen3.5 base template and use a trusted, reviewed template override if required before loading it. Keep Ollama/llama.cpp current and never let a model template execute arbitrary host code.

### Selected conditional helper and modality artifacts

| Role | Pinned artifact | Size | License | Activation policy |
|---|---|---:|---|---|
| Embeddings | Official Ollama qwen3-embedding:0.6b-q8_0, digest prefix ac6da0dfba84 | about 639 MB | Apache-2.0 | RAG ingest/query only |
| Reranker | Qwen3-Reranker-0.6B, revision e61197ed45024b0ed8a2d74b80b4d909f1255473 | 1,191,588,280 bytes | Apache-2.0 | After first-stage retrieval only, if eval improves |
| ASR baseline | whisper.cpp large-v3-turbo Q5_0, revision 98aa99a0a9db05ae2342309f5096248665f7cba3 | 574,041,195 bytes | MIT conversion/runtime; retain upstream model notices | Existing whisper.cpp gateway path |
| ASR challenger | Qwen3-ASR-0.6B, revision 5eb144179a02acc5e5ba31e748d22b0cf3e303b0 | 1,876,091,704 bytes | Apache-2.0 | Separate RU/TH/EN eval; not wired into gateway yet |
| VAD | Silero VAD 16k OP15 ONNX, commit 066409f3d9db45a30d21dfcbf9147826ffdd7052 | 1,289,603 bytes | MIT | Voice sessions only |
| TTS RU | Piper dmitri medium, retrained voice revision 2f358b6a560e3a913ebf509b2f3344f20b367f94 | 63,221,984 bytes | CC0 dataset + CC-BY-4.0 hifi_tts_92 base | Piper 1.8.0 engine |
| TTS EN | Piper joe medium, same voice revision | 63,221,984 bytes | CC0 dataset + CC0 rdh base | Piper 1.8.0 engine |
| OCR RU/EN/TH | Tesseract tessdata_fast at commit 87416418657359cb625c412a48b6e1d6d41c29bd | 9,047,426 bytes total | Apache-2.0 | CPU OCR fallback, LSTM OEM 1 |

Piper engine is GPL-3.0-or-later and must be reviewed separately from voice licenses. The old 2023 dmitri model was Lessac-derived and research-only; the pinned current dmitri voice is retrained from hifi_tts_92. The current English joe voice is retrained from the rdh base. Preserve each MODEL_CARD.

Piper v1.8.0 adds a Thai phonemizer using TLTK, but the current official Piper voice catalog does not publish a Thai voice. F5-TTS-THAI's card metadata says CC-BY-4.0, while its upstream F5 base checkpoints are CC-BY-NC-4.0; derivative rights remain unresolved. Therefore Thai TTS is DEFERRED, not silently treated as production-ready.

### API and routing contract

- Main chat: existing FastAPI gateway /v1/chat/completions → loopback Ollama /v1/chat/completions. Ordinary chat must remain a direct single-model call.
- ASR: existing POST /v1/audio/transcriptions → local whisper.cpp CLI, with bounded input/timeouts. Qwen3-ASR is an alternative adapter proposal, not current implementation.
- TTS: existing POST /v1/audio/speech → local Piper CLI and explicitly allowlisted voice IDs.
- VAD: internal voice-session component; no separate public endpoint required.
- RAG: existing /v1/rag/ingest and /v1/rag/retrieve. Embedding and reranker workers are proposed internal adapters; /v1/embeddings and /v1/rerank are not currently implemented.
- OCR: extend the bounded document pipeline or add an internal OCR worker. No new public OCR endpoint is claimed implemented.
- Existing /v1/documents/extract remains basic text extraction; Tesseract language data alone does not make scanned-PDF OCR or book scanning implemented.

### Acquisition and memory budget

The manifest at models/artifacts.manifest.json pins 6,033,970,026 exact bytes for external-cache artifacts (includes the vision projector, Ollama runtime archive and Piper wheel; excludes the main Q4 model; tokenizer/config files add overhead) plus approximately 3,939,000,000 bytes for the two Ollama model-store references (Qwen3.5 base and Qwen3 embedding). Binaries are kept outside Git in ~/.cache/alandi/models. This is intentional: GitHub Pages and Git LFS are not the model registry.

The current engineering container could not resolve external DNS; actual downloads did not complete. The downloader is implemented and verifies SHA-256 or upstream Git blob SHA-1 plus size. Run it from a network-enabled workstation/server, then record downloaded hashes and installation status. Do not claim downloaded or installed yet.

On the reference 8-GB VPS, do not keep the embedding, reranker, ASR, OCR and TTS models resident alongside the main model by assumption. Queue heavy work and load/evict sequentially; start at 4K context and concurrency 1. Promote a different residency/concurrency policy only after peak RSS/PSS, KV-cache growth, cold start, p50/p95 and task quality are measured on the exact host.

### Next model gate

1. Acquire and verify the pinned artifacts outside Git.
2. Review the uncensored GGUF chat template and base-model lineage.
3. Run the same RU/EN/TH golden sets for base Qwen3.5-4B vs uncensored Qwen3.5-4B; measure useful compliance, factuality, refusal/abstention, tool-call exactness, JSON validity, latency and memory.
4. Evaluate embedding Recall@k, MRR/nDCG and citation support; evaluate reranker only after first-stage retrieval.
5. Compare Whisper and Qwen3-ASR on identical labelled audio; evaluate WER/CER, RTF, p50/p95, peak RSS and cancellation.
6. Evaluate Tesseract RU/EN/TH on scanned and born-digital fixtures; report CER, exact fields/tables, reading order and latency.
7. Keep all new model flags off until exact-host evidence and owner release approval.


The full Hugging Face Qwen3-Embedding-0.6B safetensors file (1,191,586,416 bytes) remains pinned for provenance but is not downloaded; the Ollama Q8_0 artifact avoids duplicate full weights and uses the native /api/embed route.

### Matched base-model reference

For an apples-to-apples comparison, acquire the official Ollama Qwen3.5-4B Q4_K_M reference in addition to the owner-supplied uncensored checkpoint:

- Tag: qwen3.5:4b
- Registry digest prefix: d8b0f5e9760c
- Displayed package size: about 3.3 GB (model plus vision projector)
- License: Apache-2.0
- Acquisition: the artifact downloader runs ollama pull qwen3.5:4b and verifies the digest prefix from ollama list.
- Residency: keep the official and uncensored variants in the Ollama model store, but load/evaluate them sequentially on the 8-GB profile.

This reference is a benchmark comparator, not the production default. The uncensored model remains the owner-preferred primary candidate pending same-prompt RU/EN/TH evaluation.


### Runtime version pins

- Ollama v0.40.16, commit d63b702609c4300a2ca07be2bdb0adb9834725e5; Linux AMD64 archive SHA-256 in the artifact manifest.
- whisper.cpp v1.9.5, commit d1be6fde11ac6e0407606b4e42fe72d34add8037; build whisper-cli from source.
- Piper 1.8.0, commit 639388b6317fc4731e91d53da42aea68fd4166ff; GPL-3.0-or-later Linux x86_64 wheel pinned.
- Qwen ASR Python package qwen-asr==0.0.6; official dependencies pin Transformers 4.57.6, Accelerate 1.12.0, Nagisa 0.2.11 and SoyNLP 0.0.493; optional vLLM 0.14.0 is GPU-only and excluded from the CPU-first baseline.
- Tesseract 5.5.4, commit 7e548e6eff172f38f97664afe7f7ce40db36c8d6; release fixes 17 security advisories.
- Exact API boundaries, runtime install status and current SQLite/IndexedDB storage policy are recorded in models/runtime-stack.lock.json.
