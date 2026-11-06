# aLandi — локальная генерация аудио и Media Skills

**Дата:** 2026-11-02  
**Workstream:** PR #129 Voice 2.0, research-only / Draft / HOLD.

## 1. Разделить четыре разных задачи

1. **Speech output:** TTS, voice design/cloning, pronunciation, streaming.
2. **Speech input:** ASR, VAD, diarization, timestamps.
3. **Non-speech audio generation:** sound effects, ambience, music beds.
4. **Audio post-processing:** trim, normalize, denoise, format conversion, subtitles/sync.

Это разные модели, лицензии, UI controls и критерии качества. Наличие Piper TTS не означает генерацию звуковых эффектов или музыки.

## 2. Кандидат Agent Audio

[ AIEGOBOT/agent-audio ](https://github.com/AIEGOBOT/agent-audio) — отдельный local MCP server + Agent Skill для генерации WAV на компьютере, описывает Stable Audio 3 Medium и самостоятельный runtime.

Первичная оценка README (2026-11-02):
- early preview; короткие sound-effect generation демонстрировались, автоматическая интеграция в игровые/видеопроекты ещё требует E2E;
- Windows CPU path: модельные файлы около 7.36 GB; проект рекомендует 32-GB-class RAM и 25 GB+ disk как planning guidance, не гарантированный минимум;
- Apple Silicon path: сообщается о 6.88 GB MLX files и тесте на 24-GiB Mac;
- Linux CPU model inference не подтверждён автором в описанном CI; не считать поддерживаемым только по model-free CI;
- исходный код MIT, но Stable Audio 3 Medium weights — отдельная Stability AI Community License; T5Gemma components имеют отдельные Gemma terms.

**Вывод:** сохранить как экспериментальный кандидат для non-speech audio. Не скачивать автоматически и не включать в default. Проверить лицензию весов, целевой host, memory peak, speed, WAV integrity, audio quality и интеграцию с реальным проектом.

## 3. UX для генерации звука

Functions → Media → Audio:
- Generate sound effect / ambience / music bed;
- source text prompt и duration;
- выбранный local backend/model;
- license and disk/RAM preflight;
- preview, accept/reject, regenerate;
- output path/artifact provenance;
- attach to project/video/game only after explicit approval.

В отдельной зоне — TTS/ASR/voice conversation. Не смешивать переключатели речи и генерации музыки.

## 4. Media Skill

Skill package может описывать pipeline:
`brief → shot/scene map → audio cue sheet → generate candidates → audition → trim/normalize → sync → export`

Но Skill не должен автоматически скачивать weights, принимать model terms, менять проектные файлы или загружать материалы в облако.

## 5. Tasks

- [ ] AUDIO-GEN-001 — verify Agent Audio source, releases, security posture and install permissions.
- [ ] AUDIO-GEN-002 — review Stable Audio 3 Medium and T5Gemma terms independently.
- [ ] AUDIO-GEN-003 — measure cold/warm RAM, disk, latency and throughput on actual target hardware.
- [ ] AUDIO-GEN-004 — build small RU/EN prompt set for sound effects, ambience and music; blinded listening evaluation.
- [ ] AUDIO-GEN-005 — test generated WAV metadata, clipping, silence, duration, sample rate and reproducibility.
- [ ] AUDIO-GEN-006 — define artifact folder, provenance, user approval and cleanup.
- [ ] AUDIO-GEN-007 — add audio-generation skill only after security/license review.
- [ ] AUDIO-GEN-008 — compare at least one smaller model/backend before adopting Stable Audio 3 Medium.
- [ ] AUDIO-GEN-009 — no model download or runtime activation without explicit owner approval.

## Sources

- [Agent Audio repository](https://github.com/AIEGOBOT/agent-audio)
- [Stability AI Community License](https://stability.ai/license)
- [ComfyUI](https://github.com/Comfy-Org/ComfyUI) — optional workflow orchestration reference, GPL-3.0 application code; model licenses remain separate.
- [Open-source TTS/ASR catalog](https://openvoiceindex.com/) — discovery only, not license authority.

**Status:** research only. No model was downloaded, no inference benchmark was run, no runtime/default changed.
