# aLandi model artifact cache

Model binaries are not stored in this GitHub Pages source repository or Git LFS. Exact external-cache payload is 6,033,970,026 bytes; the two Ollama model references add about 3,939,000,000 bytes. Total is about 9.97 GB before tokenizer/config overhead, excluding the owner-supplied main model. The canonical inventory is models/artifacts.manifest.json; runtime versions are in models/runtime-stack.lock.json; the step-by-step install guide is models/runtime-install.md; downloads go to ~/.cache/alandi/models by default.

## Acquire and verify

    python -m pip install "huggingface_hub>=0.34,<2"
    python scripts/download_model_artifacts.py --dry-run
    python scripts/download_model_artifacts.py --skip-ollama
    python scripts/download_model_artifacts.py --verify-only --skip-ollama

After installing Ollama v0.40.16 from the pinned archive, run the default command to pull and verify the two Ollama model tags:

    python scripts/download_model_artifacts.py

The default run also pulls the official Qwen3.5-4B base reference (about 3.3 GB) and Qwen3-Embedding-0.6B Q8_0 (about 639 MB) into the configured Ollama model store and verifies their registry digest prefixes. The external cache also includes the pinned Ollama v0.40.16 Linux AMD64 archive and Piper 1.8.0 wheel; these are downloaded, not installed. Use --skip-ollama only when Ollama is not installed on this host; run the pull on the same host used for the base-vs-uncensored evaluation.

Use --root /path/to/cache to choose another location or --package PACKAGE_ID to acquire one package. Use --skip-ollama for the first acquisition pass before Ollama is installed; it still downloads the Ollama runtime archive and other files. The primary uncensored Qwen3.5-4B Q4_K_M checkpoint is intentionally download:false: the owner supplies that file directly to the server. Its vision projector and all selected auxiliary artifacts are separate downloads. The full HF embedding weights are pinned for provenance but not downloaded; the smaller official Ollama Q8_0 model is the runtime choice.

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
