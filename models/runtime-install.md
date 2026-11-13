# aLandi runtime acquisition and installation guide

Status: SPECIFIED, not installed. This guide assumes a provisional Linux x86_64 host; verify the actual OS, architecture, RAM, disk and GPU before using platform-specific artifacts.

## 0. Resource preflight

Recommended starting disk headroom is at least 20 GB. The pinned external-cache artifacts total 6,033,970,026 bytes, plus about 3,939,000,000 bytes for Ollama's official Qwen3.5 base and Qwen3 embedding models. Add the owner-supplied uncensored main checkpoint (2,707,513,696 bytes), tokenizer/config overhead, Ollama blobs, build dependencies and logs. Do not run downloads if the host lacks free space.

The reference profile is 8 GB RAM, one resident LLM, 4K context and concurrency 1. This is a starting hypothesis, not a benchmark. Do not keep ASR, reranker, embeddings and TTS resident simultaneously without exact-host RSS/PSS measurements.

## 1. Acquire pinned artifacts

From a network-enabled workstation/server:

    python -m pip install "huggingface_hub>=0.34,<2"
    python scripts/download_model_artifacts.py --dry-run
    python scripts/download_model_artifacts.py --skip-ollama
    python scripts/download_model_artifacts.py --verify-only --skip-ollama

This downloads the Ollama runtime archive, Piper wheel, Qwen vision projector, Qwen reranker and ASR weights, Whisper model, VAD, Piper RU/EN voices and Tesseract RU/EN/TH data. The main uncensored Qwen Q4_K_M checkpoint is deliberately excluded for owner upload. The full HF Qwen3 embedding checkpoint is provenance-only; the smaller official Ollama Q8_0 model is selected instead.

All cache files remain outside Git. SHA256SUMS.local is generated for every downloaded package; the pinned primary files are checked against SHA-256 or upstream Git blob SHA-1 plus exact size.

## 2. Install Ollama only after host verification

Pinned runtime: Ollama v0.40.16, commit d63b702609c4300a2ca07be2bdb0adb9834725e5. Linux AMD64 archive SHA-256 is recorded in models/artifacts.manifest.json. Verify architecture and the archive checksum before extracting it according to the official Ollama installation instructions. The acquisition script does not extract, install, enable a service or change systemd.

After Ollama is installed and the local service is reachable, pull the matched base model and embedding model:

    ollama pull qwen3.5:4b
    ollama pull qwen3-embedding:0.6b-q8_0
    ollama list

The downloader verifies digest prefixes d8b0f5e9760c and ac6da0dfba84. Keep the official base reference and uncensored candidate unloaded sequentially during evaluation.

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
