# aLandi model artifact cache

Model binaries are not stored in this GitHub Pages source repository or Git LFS. The pinned acquisition set is 6,033,970,026 bytes of external-cache artifacts plus 7,728,793,651 bytes across four official Ollama model packages: about 13.76 GB before tokenizer/config overhead. The owner-supplied uncensored primary Qwen3.5-4B checkpoint (2,707,513,696 bytes) is deliberately excluded. The canonical inventory is models/artifacts.manifest.json; runtime versions are in models/runtime-stack.lock.json; the step-by-step install guide is models/runtime-install.md; downloads go to ~/.cache/alandi/models by default.

## Acquire and verify

    python -m pip install "huggingface_hub>=0.34,<2"
    python scripts/download_model_artifacts.py --dry-run
    python scripts/download_model_artifacts.py --skip-ollama
    python scripts/download_model_artifacts.py --verify-only --skip-ollama

The main-branch GitHub Actions workflows acquire the complete pinned auxiliary set outside Git: all enabled Hugging Face/raw-GitHub artifacts, plus four official Ollama registry packages (Qwen3.5-4B base comparator, Qwen3.5-2B helper, Qwen3 embedding and GLM-OCR). They upload checksum-verified packages as temporary Actions artifacts. The owner-supplied uncensored primary checkpoint is the only model intentionally excluded. The Ollama runtime archive and Piper wheel are downloaded, not installed. Verify target OS/architecture before installing either.

For a network-enabled host, use `python scripts/download_ollama_registry_models.py --manifest models/manifest-ollama-registry.json --output-dir ~/.cache/alandi/ollama-packages --timeout 900` to acquire the four pinned registry packages. Install each verified package only after target-host review with `python scripts/install_ollama_registry_model.py --package-dir <package-dir> --models-dir <OLLAMA_MODELS>`. The primary uncensored Qwen3.5-4B Q4_K_M checkpoint remains owner-supplied; its vision projector is acquired separately. The full HF embedding weights are pinned for provenance but not downloaded; the smaller official Ollama Q8_0 model is the runtime choice.

The downloader pins immutable upstream revisions, verifies exact file sizes and SHA-256 for Hugging Face LFS objects, and verifies Git blob SHA-1 + size for raw GitHub artifacts. It does not execute downloaded files. Keep the accompanying model cards and voice provenance metadata.

## Artifact acquisition state

- Manifest is SPECIFIED and source-pinned.
- No model binary is present in this source tree.
- The current engineering container has no outbound DNS/network route; acquisition attempts failed with Temporary failure in name resolution. Run the downloader from a network-enabled workstation or the target host.
- A successful download is not an installed runtime. Record runtime version, target-host memory/latency and eval results separately before enabling flags.

## Storage and runtime policy

- Main model stays resident only if target RAM headroom is measured.
- Embedding, reranker, ASR, OCR and TTS workers are conditional; do not load them on every chat request.
- On an 8-GB profile, schedule heavy workers sequentially and unload/evict between jobs unless real measurements prove safe concurrency.
- Never use an unreviewed model template or a model whose license/provenance is unresolved.
