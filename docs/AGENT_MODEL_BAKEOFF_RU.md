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

**Updated test order (not production selection):** (1) Qwen3.5-0.8B for tiny classification/extraction only; (2) Qwen3.5-2B and MiniCPM5-2B for bounded tool-use bake-off; (3) Phi-4-mini-instruct for RU/TH specialist tasks; (4) Granite 4.2-3B and SmolLM3-3B as comparison controls with language caveats; (5) FunctionGemma-270M and Cactus Needle as task-specific ultra-small action/extraction experiments. Gemma 4 E2B is a multimodal workstation candidate, not the default 8-GB VPS choice because total weights are 5.1B parameters. Vendor scores are shortlist signals only; no production winner until same-hardware RU/EN/TH eval and memory measurements pass.
