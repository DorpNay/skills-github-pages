# aLandi model artifact cache

Model binaries are not stored in this GitHub Pages source repository or Git LFS. The canonical inventory is models/artifacts.manifest.json; downloads go to ~/.cache/alandi/models by default.

## Acquire and verify

    python -m pip install "huggingface_hub>=0.34,<2"
    python scripts/download_model_artifacts.py --dry-run
    python scripts/download_model_artifacts.py
    python scripts/download_model_artifacts.py --verify-only

Use --root /path/to/cache to choose another location or --package PACKAGE_ID to acquire one package. The primary uncensored Qwen3.5-4B Q4_K_M checkpoint is intentionally download:false: the owner supplies that file directly to the server. Its vision projector and all selected auxiliary artifacts are separate downloads.

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
