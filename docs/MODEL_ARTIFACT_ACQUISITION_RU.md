# aLandi — pinned model artifact acquisition

**Status:** manifest, downloader and artifact workflow implemented; the first acquisition job is triggered by a push to this feature branch. No model is installed or activated by this workflow.

## Operating rules

- The canonical code repository and GitHub Pages site never contain large model weights. No Git LFS.
- The primary Qwen3.5 uncensored Q4_K_M weight is **owner-server-only**. The workflow deliberately skips it; the owner transfers this pinned file directly to the private server.
- All other selected helper, retrieval, speech and vision-companion artifacts are downloaded by a bounded GitHub Actions job and published as separate 30-day workflow artifacts. This gives a transfer point without adding binaries to Git history.
- Every model is tied to an upstream repository and immutable revision where available. The downloader enforces HTTPS, an upstream host allowlist, safe filenames, byte limits, optional exact byte lengths, and upstream-published SHA-256 or SHA-1. It computes SHA-256 and SHA-1 locally and writes a sidecar for every artifact.
- If an upstream SHA-256 is not available, a pinned revision + exact size is checked and the first acquired SHA-256 is recorded. This is a locally recorded digest, not a claim that upstream published it.
- Downloaded models are untrusted data. Do not execute model-supplied templates or load model files into a privileged service before reviewing provenance, chat templates, runtime version and security findings.

## Model decisions — initial acquisition set

| Role | Pinned artifact | Size | License evidence | Current decision |
|---|---|---:|---|---|
| Main chat / coding / tool-use | [HauhauCS Qwen3.5-4B Uncensored Aggressive Q4_K_M](https://huggingface.co/HauhauCS/Qwen3.5-4B-Uncensored-HauhauCS-Aggressive/tree/c09cdbcdb1fefad6d335809d445621b5f5ba0c6e) | 2,707,513,696 B (~2.52 GiB) | Apache-2.0 declared by derivative repository; preserve base-model lineage and derivative provenance | **Preferred main candidate, not production-selected.** Author's “0/465 refusals” is self-reported, not independently reproduced. Do not silently add an application refusal layer; keep tool permissions, approvals and policy gates independent. |
| Main vision companion | Same repository, BF16 mmproj | 675,568,768 B (~644 MiB) | Same repository card declaration | Acquire as a separate artifact; confirm compatibility with Q4 main before image/video input. |
| Embedding | [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B/tree/97b0c614be4d77ee51c0cef4e5f07c00f9eb65b3) | 1,191,586,416 B | Apache-2.0 | Primary multilingual embedding candidate; RU/EN/TH retrieval quality must be evaluated locally. |
| Reranker | [Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B/tree/e61197ed45024b0ed8a2d74b80b4d909f1255473) | 1,191,588,280 B | Apache-2.0 | Conditional second-stage reranker only; never call it on every ordinary chat request. |
| ASR | [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B/tree/5eb144179a02acc5e5ba31e748d22b0cf3e303b0) | 1,876,091,704 B | Apache-2.0 declared by model card | First multilingual RU/TH/EN ASR candidate. Upstream Python streaming path uses vLLM; do not assume it is a whisper.cpp drop-in or Ollama model. |
| VAD | [Silero VAD](https://github.com/snakers4/silero-vad/tree/066409f3d9db45a30d21dfcbf9147826ffdd7052) ONNX | 2,327,524 B | MIT | Small CPU VAD candidate; actual SHA-256 is calculated at acquisition because upstream digest was not confirmed in this pass. |
| ASR challenger | [whisper.cpp large-v3-turbo Q5_0](https://huggingface.co/ggerganov/whisper.cpp) | ~547 MiB per upstream card | MIT | Comparison model, not simultaneous resident runtime. Upstream publishes SHA-1; downloader checks it and records SHA-256. |
| Russian TTS | [Piper dmitri medium voice](https://huggingface.co/rhasspy/piper-voices/tree/375a0fe641dea077c2a47b4e9a056d6da521eed3/ru/ru_RU/dmitri/medium) | 63.2 MB model + config/card | MIT repository card; voice training dataset CC0 in the model card | Russian voice candidate. Piper runtime code is GPL-3.0-or-later and must be tracked separately. No Thai voice is listed in this pinned voice set. |

**Estimated non-primary acquisition batch:** approximately 5.6 GB before sidecars and transfer overhead. This is an artifact/evaluation batch, not a production server memory requirement. The workflow uploads files separately with 30-day retention.

## Reproducible commands

From repository root:

~~~bash
python scripts/download_model_artifacts.py --manifest models/manifest.json --output-dir /tmp/alandi-model-artifacts --workers 3
python -m compileall -q scripts
python scripts/download_model_artifacts.py --manifest models/manifest.json --output-dir /tmp/alandi-model-artifacts --only qwen3_asr_06b
~~~

The workflow runs the same downloader and uploads each model separately. See .github/workflows/acquire-model-artifacts.yml.

## Model safety and compatibility

The uncensored Qwen GGUF includes a Jinja tokenizer.chat_template. The model scanner's PAIT-GGUF-100 label is informational when no sandbox escape patterns are detected; it means a template is present and is a code-bearing attack surface, not that the model has been proven malicious. Review the exact template against the upstream Qwen base template, run a current patched llama.cpp/Ollama build, and do not allow untrusted model templates to execute outside a sandbox.

The model's “uncensored” behavior is a model behavior choice, not an authorization system. Tool calls must continue through the aLandi capability registry, scope checks, schema validation, approvals, budgets and audit trail. Do not allow model outputs to authorize their own actions.

## What is not yet verified

- No artifact acquisition job has completed in this commit; GitHub Actions must be checked at the exact commit.
- No weights are installed, loaded or benchmarked on the actual VPS.
- No model is production-selected. The Qwen main candidate still needs comparison with the official base checkpoint and at least two credible alternatives using the same RU/EN/TH, coding, JSON and tool-call golden sets.
- Embedding and reranking adapters are not yet integrated with gateway RAG.
- Qwen3-ASR runtime integration, Piper CLI install, audio transport, endpointing and mobile-device quality are not yet verified.
- The 8-GB host profile is not sufficient evidence of model fit; measure host RSS/PSS, cold/warm latency, context/KV memory and concurrency before activating multiple models.

## Next implementation slices

1. Retrieve the exact Actions artifacts and transfer the approved non-primary files into a governed model store; never copy weights into Git.
2. Add the ASR runtime adapter and test RU/EN/TH on the existing language matrix.
3. Integrate embedding + RRF + conditional reranking with a golden retrieval set; keep reranking off until it improves measured metrics.
4. Compare main Qwen against the official base Qwen3.5 and at least two current alternatives; pin the winning exact artifact and runtime.
5. Extend the operator runbook with final download paths, exact sizes, checksums, service configuration and rollback.
