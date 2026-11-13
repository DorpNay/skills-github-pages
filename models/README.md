# aLandi model artifact registry

Model weights are deliberately excluded from the Git tree and Git LFS. This directory stores only manifests and metadata. Acquired weights live in GitHub Actions artifacts for a short staging window and are copied by the owner to a private model store.

## Manifests

- `manifest.json`: main, retrieval, ASR, VAD, Whisper comparison and Russian Piper voice artifacts.
- `manifest-thai-tts.json`: Thai F5-TTS evaluation-only checkpoint, vocabulary and Vocos vocoder.

## Acquisition and verification

- Main model artifact workflow: run 43393099472 (30-day artifact retention).
- Thai TTS workflow: run 43393859216 (30-day artifact retention).
- The primary uncensored Qwen3.5 model is owner-server-only and is intentionally not downloaded by either workflow.
- Download all non-primary artifacts on the target server with `bash scripts/download_model_artifacts_from_github.sh RUN_ID DESTINATION`.
- The helper uses GitHub CLI authentication and verifies every artifact against the embedded SHA-256/SHA-1 lock and per-file metadata.
- Never commit model weights, runtime binaries, API tokens or user voice samples to this repository.

## Promotion rule

Downloaded does not mean installed, loaded, evaluated or production-approved. Promotion requires artifact-specific license review, immutable provenance, actual target-host memory/latency measurements, RU/EN/TH quality tests, and a recorded EVALS result. A model's weights license does not automatically cover its training data, code, voice, or dependencies.
