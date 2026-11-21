## 0.1 Download the latest verified Actions artifacts (2026-11-21)

The refreshed acquisition and provenance workflows passed on source HEAD `014b5340`. These commands download verified staging artifacts; they do not install or enable services. Use an authenticated owner workstation or the verified target host:

    gh run download 44900155001 -R DorpNay/skills-github-pages -n alandi-external-model-cache-44900155001
    gh run download 44900155025 -R DorpNay/skills-github-pages -n alandi-qwen35-base-4b-44900155025
    gh run download 44900155025 -R DorpNay/skills-github-pages -n alandi-qwen35-helper-2b-44900155025
    gh run download 44900155025 -R DorpNay/skills-github-pages -n alandi-qwen3-embedding-06b-q8-0-44900155025
    gh run download 44900155025 -R DorpNay/skills-github-pages -n alandi-glm-ocr-q8-0-44900155025
    gh run download 44900155025 -R DorpNay/skills-github-pages -n alandi-ollama-helper-lock-44900155025
    gh run download 44900155036 -R DorpNay/skills-github-pages -n alandi-bonsai2-ptq1-0-44900155036
    gh run download 44900155047 -R DorpNay/skills-github-pages -n openshell-v0.1.8-ubuntu24.04-x86_64
    gh run download 44900155000 -R DorpNay/skills-github-pages -n alandi-python-runtime-cache-Linux-X64-py3.12-014b5340b26e06c30a0df8fbcef5301c5dab4d23
    gh run download 44900155000 -R DorpNay/skills-github-pages -n alandi-python-runtime-cache-Linux-X64-py3.13-014b5340b26e06c30a0df8fbcef5301c5dab4d23
    gh run download 44900155000 -R DorpNay/skills-github-pages -n alandi-python-runtime-cache-Linux-X64-py3.14-014b5340b26e06c30a0df8fbcef5301c5dab4d23

**Expiry:** OpenShell artifact expires **2026-12-05 11:39:58 UTC**. External model cache, Ollama packages, Bonsai helper and Python caches expire **2026-12-21** (see exact timestamps/digests in `models/runtime-stack.lock.json`). Preserve OpenShell first. GitHub's artifact `digest` is the archive SHA-256; each package also carries its own file checksum manifest. Keep the downloaded ZIPs and extracted folders until the owner has copied and re-verified them in durable storage.

The external cache contains 10 auxiliary packages; Ollama run contains four model packages plus its lock; Bonsai is a separate Apache-2.0 1.88B PTQ1_0 candidate requiring a PrismML llama.cpp fork (not Ollama compatible); OpenShell is a candidate sandbox runtime, not installed. Python cache artifacts are Ubuntu 24.04 x86_64 only. None of these artifacts is a target-host installation.

## 1. Acquire pinned artifacts

From a network-enabled workstation/server:

    python -m pip install "huggingface_hub>=0.34,<2"
    python scripts/download_model_artifacts.py --dry-run
    python scripts/download_model_artifacts.py --skip-ollama
    python scripts/download_model_artifacts.py --verify-only --skip-ollama

The GitHub Actions artifact above is already downloaded and verified; use the `gh run download` commands in §0.1 instead of re-running network acquisition when staging it on the target host.

This downloads the Ollama runtime archive, Piper wheel, Qwen vision projector, Qwen reranker and ASR weights, Whisper model, VAD, Piper RU/EN voices and Tesseract RU/EN/TH data. The full HF Qwen3 embedding weights are not downloaded; the official Ollama Q8_0 model is the runtime selection. The main uncensored Qwen Q4_K_M checkpoint is deliberately excluded for owner upload. The full HF Qwen3 embedding checkpoint is provenance-only; the smaller official Ollama Q8_0 model is selected instead.

All cache files remain outside Git. SHA256SUMS.local is generated for every downloaded package; the pinned primary files are checked against SHA-256 or upstream Git blob SHA-1 plus exact size. Main-branch Actions also stage the same acquisition set as temporary downloadable artifacts (30-day retention); verify run completion and artifact SHA manifests before copying to the target host.

## 2. Install Ollama only after host verification

Pinned runtime: Ollama v0.40.16, commit d63b702609c4300a2ca07be2bdb0adb9834725e5. Linux AMD64 archive SHA-256 is recorded in models/artifacts.manifest.json. Verify architecture and the archive checksum before extracting it according to the official Ollama installation instructions. The acquisition script does not extract, install, enable a service or change systemd.

After Ollama is installed and the local service is reachable, extract the four verified Ollama registry packages from the Actions artifact (or acquire them with `scripts/download_ollama_registry_models.py`). Install the exact package directories into the configured Ollama model store using the offline installer:

    export OLLAMA_MODELS="${OLLAMA_MODELS:-$HOME/.ollama/models}"
    python scripts/install_ollama_registry_model.py --package-dir ~/.cache/alandi/ollama-packages/qwen35_base_4b --models-dir "$OLLAMA_MODELS"
    python scripts/install_ollama_registry_model.py --package-dir ~/.cache/alandi/ollama-packages/qwen35_helper_2b_q4km --models-dir "$OLLAMA_MODELS"
    python scripts/install_ollama_registry_model.py --package-dir ~/.cache/alandi/ollama-packages/qwen3_embedding_06b_q8_0 --models-dir "$OLLAMA_MODELS"
    python scripts/install_ollama_registry_model.py --package-dir ~/.cache/alandi/ollama-packages/glm_ocr_q8_0 --models-dir "$OLLAMA_MODELS"
    ollama show qwen3.5:4b
    ollama show qwen3.5:2b-q4_K_M
    ollama show qwen3-embedding:0.6b-q8_0
    ollama show glm-ocr:q8_0

The installer verifies the raw registry manifest, each blob SHA-256 and exact size, refuses symlinks and conflicting existing tags, and does not restart the service. The official Qwen3.5-4B base reference, 2B helper, embedding and GLM-OCR are auxiliary evaluation packages. Keep model loading sequentially on the 8-GB reference profile.

The owner supplies the uncensored Qwen3.5-4B Q4_K_M checkpoint directly to the server. Review its embedded chat template against the official Qwen3.5 template before creating an Ollama model tag. Do not import it with an unreviewed template.

## 3. Whisper.cpp ASR baseline

Pinned source: ggml-org/whisper.cpp v1.9.5, commit d1be6fde11ac6e0407606b4e42fe72d34add8037. Build the CPU release from source using CMake and a C/C++ toolchain. Install FFmpeg and ffprobe. Use the downloaded ggml-large-v3-turbo-q5_0.bin model with whisper-cli. Keep the existing gateway route disabled until the binary/model path and input limits are verified.

## 4. Piper TTS

Pinned package: piper-tts 1.8.0, GPL-3.0-or-later. Linux x86_64 wheel SHA-256 is recorded in the manifest. Install only after architecture and ABI confirmation, preferably in an isolated venv. Preserve both voice MODEL_CARD files and license chain.

Voice IDs:
- ru_RU-dmitri-medium — current retrained voice; CC0 direct dataset, hifi_tts_92 CC-BY-4.0 base.
- en_US-joe-medium — CC0 direct dataset and rdh base.
- Thai — no approved official voice pinned. Piper 1.8.0 provides TLTK phonemization support, not a trained Thai voice.

Do not substitute the old Lessac-derived dmitri checkpoint. Do not use F5-TTS-THAI in a commercial deployment until derivative rights are clarified.

## 5. Qwen3-ASR challenger

Use a separate Python 3.12 venv and models/requirements-qwen-asr.txt. Official package qwen-asr==0.0.6 pins Transformers 4.57.6, Accelerate 1.12.0, Nagisa 0.2.11 and SoyNLP 0.0.493. The optional vLLM backend is GPU-only for this profile and is not part of the CPU-first install. Point the package at the already downloaded local Qwen3-ASR-0.6B directory; do not let it silently download a different revision.

Keep this as a challenger until it beats Whisper on the same RU/EN/TH labelled audio set for WER/CER, RTF, p50/p95, memory and cancellation.

## 6. Reranker and OCR

- Qwen3-Reranker-0.6B is downloaded as a pinned HF snapshot. Run it in a separate, on-demand Python worker using Transformers 4.57.6 and a target-platform-compatible CPU PyTorch build. Pin the PyTorch wheel after OS/architecture confirmation. Do not load it on ordinary chat.
- Tesseract runtime minimum is 5.5.4 (release fixes 17 security advisories). Install from a trusted OS package source or build the pinned commit 7e548e6eff172f38f97664afe7f7ce40db36c8d6. Use the pinned tessdata_fast eng/rus/tha files and LSTM OEM 1.
- Scanned-PDF OCR is not implemented merely by installing Tesseract. The gateway document pipeline needs a bounded page-render/OCR adapter and E2E tests first.

## 7. API wiring contract

| Function | Existing API | Runtime target | State |
|---|---|---|---|
| Main chat | POST /v1/chat/completions | Gateway -> Ollama /v1/chat/completions | Existing route; target host unverified |
| Embeddings | Existing /v1/rag/ingest and /v1/rag/retrieve | Ollama POST /api/embed | Adapter not implemented; only RAG path |
| Reranking | Existing /v1/rag/retrieve | Internal Qwen3-Reranker worker | Not implemented |
| ASR | POST /v1/audio/transcriptions | whisper-cli | Route exists; binary/model not installed |
| TTS | POST /v1/audio/speech | Piper | Route exists; wheel/voices not installed |
| VAD | Voice session internal | Silero ONNX Runtime | Not integrated |
| OCR | POST /v1/documents/extract | Tesseract worker | Basic text extraction only; OCR not integrated |

Ordinary chat must remain one direct main-model call. No embedding, reranker, ASR, OCR or helper-model calls are allowed unless the user invokes the corresponding feature or a document/voice workflow requires it. Model tool access is never a permission grant; use existing approval gates.

## 8. Storage and rollback

Keep SQLite FTS5 as the current retrieval baseline and browser IndexedDB/localStorage for client state. Do not add PostgreSQL, Redis or Qdrant until scale/concurrency measurements justify them. Keep the original FTS5 retrieval path as a feature-flagged fallback when vector embedding or reranking is disabled. Store model revisions, local checksums, runtime versions, peak memory and eval reports with the release record.

No server installation, systemd change, tunnel, API key, model flag or public deployment is performed by this PR.


## Pinned gateway API dependencies

The gateway dependency source of truth is the root `pyproject.toml` + `uv.lock` (resolved transitive versions and hashes). On the target host, after confirming CPython 3.12+ and Linux architecture, install pinned runtime dependencies with the repository's pinned uv version:

    python3.12 -m pip install uv==0.13.6
    uv sync --locked --no-dev --no-install-project

This installs from the lock; it is not an offline wheelhouse. If the target host has no outbound package access, stage a platform-matched uv cache/wheelhouse separately before installation. Optional Qwen-ASR/PyTorch and OS packages are not part of the gateway lock.


## Offline Python gateway dependency cache

The repository now builds a platform- and Python-minor-specific cache from the committed `uv.lock`. Workflow: `.github/workflows/python-runtime-cache.yml`. It builds on Ubuntu 24.04 x86_64 for CPython 3.12, 3.13 and 3.14; performs an online locked sync, then proves a clean second environment can sync with `--offline`; and uploads the uv cache plus the pinned uv bootstrap wheel, lockfile, manifest and SHA256SUMS. It intentionally contains **runtime dependencies only** (no dev group, model weights or OS packages).

On an internet-connected admin workstation with GitHub CLI authenticated:

    gh run list --workflow python-runtime-cache.yml --branch main --limit 10
    gh run download <RUN_ID> --name alandi-python-runtime-cache-Linux-X64-py3.12-<COMMIT_SHA>
    sha256sum -c SHA256SUMS

Choose the artifact matching the target's CPython minor version. The current artifact target is Ubuntu 24.04 x86_64; do not install it on another OS/architecture without a compatibility check. From the repository root on the target host (replace `3.12` with the selected minor version):

    python3.12 -m ensurepip --upgrade
    python3.12 -m pip install --no-index --find-links uv-bootstrap uv==0.13.6
    sudo mkdir -p /opt/alandi
    sudo tar -xzf uv-cache.tar.gz -C /opt/alandi
    UV_CACHE_DIR=/opt/alandi/alandi-uv-cache UV_PROJECT_ENVIRONMENT=/opt/alandi/venv uv sync --locked --no-dev --no-install-project --offline
    /opt/alandi/venv/bin/python -m pip check

The offline sync is deliberately network-disabled and fails closed if the artifact does not match the lock/platform or lacks a required distribution. Keep the extracted cache until the service is installed and smoke-tested. This cache does not install Ollama, Piper, Whisper, Tesseract binaries, GPU drivers, system packages or optional Qwen-ASR/PyTorch dependencies; those remain separate, host-specific installation steps. Artifacts expire after 30 days; rerun the workflow if needed.


## Historical verified acquisition artifacts — 2026-11-14 (superseded by §0.1)

These are SHA-verified GitHub Actions staging artifacts, not installed runtimes and not Git-tracked model weights. Model binaries must not be committed to the GitHub Pages source tree or Git LFS.

- External model/runtime cache: workflow 43420046411, artifact 14033946209, 6,054,442,377 bytes, archive SHA-256 a43f068a9e54df4e022c95e29eb1c1618b40a8fc5391166f7e6f1a6a0d6a8682; expires 2026-12-13 11:50:13 UTC.
- Ollama package run: workflow 43418126506, four model artifacts plus helper lock, 7,728,830,482 bytes; earliest model artifact expiry 2026-12-13 11:36:20 UTC. Per-artifact SHA-256 values are in models/runtime-stack.lock.json.
- Python gateway cache: workflow 43423610986, CPython 3.12/3.13/3.14, 80,097,141 compressed bytes; Ubuntu 24.04 x86_64 only; offline sync and pip-check passed; expires 2026-12-13 12:15:31 UTC.

On an authenticated owner workstation or the verified target host:

    gh run download 43420046411 --name alandi-external-model-cache-43420046411
    gh run download 43418126506
    gh run download 43423610986

Verify extracted package inventories before use:

    find . -name SHA256SUMS.local -print0 | while IFS= read -r -d '' f; do (cd "$(dirname "$f")" && sha256sum -c "$(basename "$f")"); done

Choose the Python cache artifact matching the target CPython minor and use it only on Ubuntu 24.04 x86_64. The owner-supplied uncensored Qwen3.5-4B primary checkpoint is excluded from the external cache and must be supplied separately with its pinned SHA. The official Qwen3.5-4B base comparator is present in the Ollama artifact but is not an approved production selection. Do not install any model until the owner confirms the model lane and the actual host's disk/RAM/VRAM fit.

**Retention:** Actions artifacts expire on 2026-12-13. Before expiry, move only required, licensed artifacts to an owner-controlled durable store or the verified target host. Do not place binaries in the Pages source tree.


## Latest verified acquisition snapshot — 2026-11-21

- External cache: run 44900155001, artifact 14705393467, 6,054,444,756 bytes, archive SHA-256 `3afd6a15e74e464dace632ad5e95017ecb9733764ceb77acbd07444889c1174d`.
- Ollama packages + lock: run 44900155025, artifact IDs 14705752335 / 14705687482 / 14706026419 / 14705427202 / 14706070685, 7,728,830,478 bytes total; archive SHA-256 values in `models/runtime-stack.lock.json`.
- Bonsai helper: run 44900155036, artifact 14705039504, 429,196,247 bytes; model-file SHA-256 `36061ad406df8a4903a6db005be350c50fabfaf717f9ef0acf4b76adcd9929fa`.
- OpenShell: run 44900155047, artifact 14705468031, 207,414,886 bytes; archive SHA-256 `203adb51a68048a6b5300177465a6ac2963fb60def0703475925708ea4bf82d0`; expires Dec 5.
- Python runtime caches: run 44900155000, artifact IDs 14705647626 / 14706030523 / 14706095765, 80,159,558 bytes total; offline sync and `pip check` passed for CPython 3.12/3.13/3.14 on Ubuntu 24.04 x86_64.

All artifact acquisitions and the License/Artifact Provenance Gate passed. These are staged, downloadable artifacts only. Target OS/hardware preflight, installation, model loading, sandbox execution and aServi integration remain unverified.
