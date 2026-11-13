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


## Verified acquisition batch — GitHub Actions run 43393099472

https://github.com/DorpNay/skills-github-pages/actions/runs/43393099472

**Result:** workflow succeeded on commit c194b410ef2fc3f3181117f33e35b78a896c8594. Nine artifact ZIPs were uploaded (eight model/support groups plus the acquisition lock). The total model/support bytes are 6,453,112,704 (about 6.01 GiB). All downloaded files passed upstream SHA-256/SHA-1 checks where supplied; locally calculated hashes are in the acquisition lock and sidecars.

| Artifact | Exact file bytes | SHA-256 |
|---|---:|---|
| Qwen3-Embedding-0.6B | 1,191,586,416 | 0437e45c94563b09e13cb7a64478fc406947a93cb34a7e05870fc8dcd48e23fd |
| Qwen3-Reranker-0.6B | 1,191,588,280 | 27cd75a405b9c1b46b59abfd88aaa209e6fed2a1972cde9b70e7659537c5e65b |
| Qwen3-ASR-0.6B BF16 | 1,876,091,704 | 79d6cbd4c98c7bbffe9db2edac07f56cd6637d0d5944b27f6c2b8353840323ea |
| sherpa-onnx Qwen3-ASR-0.6B INT8 archive | 878,702,423 | 393f8a14e2f5fb96746aaab342997a40641001fbd5bf9592a080a8329178ee96 |
| Qwen3.5 vision projector | 675,568,768 | a1e32e86ea99aa7a56f3dcfe7e63c1d0be9439d31fd07087099f15bc0fda0f22 |
| Whisper large-v3-turbo Q5_0 | 574,041,195 | 394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2 |
| Silero VAD ONNX | 2,327,524 | 1a153a22f4509e292a94e67d6f9b85e8deb25b4988682b7e174c65279d8788e3 |
| Piper ru_RU-dmitri-medium ONNX | 63,201,294 | f073356ebc4bd0f80c5af58df2953a5988bd5bdab1eb38635ce960b071fbefcb |
| Piper voice config JSON | 4,824 | 667ef3117bc642c2892dff7690d8bdc8ca4228aeaa783b2dc1416df632855e0d |
| Piper voice model card | 276 | 56440cd6a7f0789669f53989b1c0ea244e335c2533fdb1fa8bac60e57205908e |

The model bytes are in separate GitHub Actions artifacts with 30-day retention. The lock artifact is alandi-model-artifacts-lock-43393099472.

### Download to the private server

On the server, authenticate GitHub CLI with repository read access (actions:read) and run:

~~~bash
gh auth login
bash scripts/download_model_artifacts_from_github.sh 43393099472 /srv/alandi/models/imports/43393099472
~~~

The helper downloads every artifact for the run and verifies each payload against artifacts-lock.json and artifact-metadata.json. Keep this import directory private (0700); do not move weights into the Git checkout. The helper requires gh and Python 3.10+.

### Main Qwen server route — runtime compatibility is not yet approved

The pinned Hugging Face main file remains owner-server-only (2,707,513,696 bytes, Q4_K_M); its separate BF16 vision projector is in the verified artifact batch above. Official Ollama documentation currently documents importing a single GGUF via a Modelfile FROM /path/to/file.gguf; it does not document a separate mmproj directive. Therefore, do not assume that importing the two files through a normal Modelfile preserves vision support.

A third-party Ollama registry mirror is listed for runtime comparison: dzgg/Qwen3.5-Uncensored-HauhauCS-Aggressive:4b. Registry metadata reports Qwen3.5 architecture, Q4_K_M, 4.54B parameters, 256K context, and vision/tools/thinking capabilities; its model layer is 3,376,217,632 bytes with SHA-256 464c1dda6a052d909b11d20c31bcb21060e969e334716ba8ed7abf64ca1be10f. Its registry manifest digest prefix is dd3be4e31ad3. This is a third-party mirror with no independent byte-level mapping to the pinned Hugging Face files, so it is NOT approved for production just because it is pullable.

For a transparent direct-HF path, test a current pinned llama.cpp server with the main GGUF and --mmproj projector, then verify its OpenAI-compatible /v1/chat/completions interface against the gateway's configured model adapter. Test Ollama import separately. Keep the existing Ollama path until the alternative passes exact API, tool-call, vision and security tests.

### Runtime API contracts gathered

- **Embedding:** SentenceTransformer("Qwen/Qwen3-Embedding-0.6B"); use encode_query() and encode_document(), 1024 dimensions (or a deliberately chosen MRL dimension), and a consistent instruction/template. Model card requires Transformers >=4.51.0 for Qwen3 architecture.
- **Reranking:** CrossEncoder("Qwen/Qwen3-Reranker-0.6B"), predict([(query, document), ...]) or rank(query, documents). Scores are raw logits by default; do not interpret them as calibrated probabilities. Use it only on a bounded candidate set after lexical/vector retrieval.
- **ASR:** sherpa-onnx Qwen3-ASR INT8 archive includes conv_frontend.onnx, encoder.int8.onnx, decoder.int8.onnx, and tokenizer files (vocab.json, merges.txt, tokenizer_config.json). The model config also references tokens.txt, max_total_len=512, and max_new_tokens=128. Inspect archive metadata before extraction; the downloader rejects path traversal, links, device files, duplicate names and oversized expansion.
- **VAD:** Silero VAD ONNX can run through ONNX Runtime CPU. VAD is a separate segmentation stage, not a transcript model.
- **TTS:** Piper CLI is the small Russian baseline. Its engine code is GPL-3.0-or-later; the selected voice repository declares MIT, and the model card lists CC0 training data. Thai synthesis is a separate candidate and must not silently fall back to Russian or English.
- **RAG routing:** embed on ingestion and query, retrieve lexical + vector candidates, fuse deterministically (RRF), then optionally rerank the top bounded set. Never load or call embedding/reranker models on ordinary chat requests that do not need retrieval.

### Current maturity boundary

**DOWNLOADED / HASH-VERIFIED:** non-primary artifact batch above. **NOT INSTALLED:** no gateway or VPS model runtime has been changed. **NOT BENCHMARKED:** no latency, RSS/PSS, WER/CER, retrieval or output-quality claim is made. **NOT PRODUCTION-SELECTED:** all checkpoints remain evaluation candidates until the matching EVALS gates pass.
