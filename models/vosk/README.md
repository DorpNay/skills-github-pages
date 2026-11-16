# Vosk Small Russian 0.22

**Purpose:** offline Russian ASR evaluation candidate for aLandi. This archive is stored for reproducible evaluation; it is not installed or enabled by the application.

- Upstream catalog: https://alphacephei.com/vosk/models
- Upstream archive: https://alphacephei.com/vosk/models/vosk-model-small-ru-0.22.zip
- Model ID: `vosk-model-small-ru-0.22`
- Catalog license: Apache-2.0 (model license is tracked separately from the Vosk API/code license).
- Expected archive size: 46,236,750 bytes
- Expected archive SHA-256: `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`
- Upstream model README reports WER 22.71 (audiobooks), 11.79 (Golos crowd), 21.34 (Golos far-field), 29.89 (Sova devices), and 31.97 (YouTube). These are upstream figures, not aLandi measurements.

## Integrity and use

The acquisition workflow pins size and SHA-256, rejects unsafe ZIP paths/symlinks, bounds archive members and expansion, and checks ZIP CRC. `SHA256SUMS` and `metadata.json` are generated alongside the archive.

The model remains **evaluation-only / ship=false**. Before runtime use, compare against the current whisper.cpp baseline on the same permissioned RU fixtures and target hardware. Record WER/CER, RTF, cold/warm latency, peak RSS/PSS, CPU usage, and real microphone/noise performance. Keep the model disabled until quality, resource, security, licensing and product acceptance gates pass.

Do not infer model quality from the upstream WER table alone. Do not assume this model supports Thai or multilingual recognition.
