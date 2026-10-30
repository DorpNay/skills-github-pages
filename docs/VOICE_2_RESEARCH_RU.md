# aLandi Voice 2.0 — исследовательский реестр и архитектурная подготовка

**Дата начала:** 2026-10-31  
**Статус:** research-only; никаких runtime changes, dependencies, flags или deployment changes.  
**Назначение:** подготовить будущую Voice 2.0, не расширяя и не дестабилизируя текущий лендинг и согласованный runtime stack.

## Правило исследования — обязательный порядок источников

Источники изучаются и фиксируются в следующем порядке. Переход к следующему слою не заменяет предыдущие:

1. **Материалы, ранее найденные совместно с владельцем:** исходные материалы и пользовательские списки в `temp/1`, `temp/2`; прежние обсуждения и переданные владельцем ссылки/проекты. Исторические scratch-файлы не считать автоматически актуальными — перепроверять исходные claims и upstream.
2. **Материалы самого репозитория:** `docs/VOICE_IMPLEMENTATION_PLAN_RU.md`, `docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md`, `docs/MULTIMODAL_MODEL_STACK_RU.md`, `docs/LATENCY_CONTRACT.md`, `evals/voice/language_matrix_v2.yaml`, `docs/V016_IMPLEMENTATION_CHECKLIST.md`, voice-related code/tests and project state.
3. **Источники, ранее предоставленные владельцем:** переносить в реестр с точным URL, исходной ролью и датой проверки; отделять собственно пользовательские источники от проектов, которые нашлись в ходе прежнего исследования.
4. **Независимые источники:** официальные upstream repositories, model cards, papers, standards, licensing texts, security advisories и воспроизводимые benchmark suites. Для каждого утверждения сохранять первоисточник, дату, exact model/runtime version, license и ограничения.

Каждый источник получает provenance tag: `OWNER_PRIOR`, `REPO_EXISTING`, `OWNER_SUPPLIED`, `INDEPENDENT_PRIMARY` или `COMMUNITY_SECONDARY`. Нельзя смешивать vendor claims и собственные результаты aLandi.

## 1. Текущее подтверждённое состояние

По `docs/VOICE_IMPLEMENTATION_PLAN_RU.md` и связанным тестам:

- Browser UI имеет путь голосового сообщения с редактируемой транскрипцией и локальный half-duplex диалог.
- Browser capture использует MediaRecorder; orchestration — ASR → выбранный chat gateway → TTS.
- Gateway предоставляет авторизованные `POST /v1/audio/transcriptions`, `POST /v1/audio/speech` и `GET /v1/capabilities`.
- ASR baseline — whisper.cpp; TTS baseline — Piper. Доступные Piper voices allowlisted и операторски установлены; автозагрузка voice packs запрещена.
- Voice flags остаются выключенными по умолчанию. Наличие кода/тестов не доказывает, что функции включены на VPS или проверены на реальном устройстве.
- Gateway tests и E2E покрывают контракты и mock flow, но не реальное RU/EN/TH качество, акустику, задержку и аппаратные ограничения.
- Требования и открытые пробелы включают streaming turn-taking, barge-in, AEC/echo handling, VAD/endpointing, выбранный текст и очередь сообщений, real-device RU/EN/TH acceptance.

**Граница доказательств:** implemented ≠ enabled ≠ CI-tested ≠ target-device-tested ≠ production-verified.

## 2. Область Voice 2.0

| Направление | Что исследовать | Обязательные критерии |
|---|---|---|
| ASR / STT | offline, streaming, partial/final hypotheses, timestamps, punctuation, language ID | RU/EN/TH WER/CER, RTF, TTFT, partial latency, RAM/VRAM, model license |
| TTS | local voices, streaming chunks, expressive/prosody control, voice selection | naturalness, intelligibility, first-audio latency, cancellation, voice/model license |
| Real-time conversation | full/half duplex, turn-taking, endpointing, barge-in, interruption | stop latency, false interruption, missed turn, overlap, recovery |
| Audio front end | VAD, AEC, noise suppression, AGC, resampling, device lifecycle | echo, noisy-room quality, Bluetooth/headset/mobile behavior |
| Speaker processing | diarization, speaker labels, enrollment/verification only if explicitly needed | consent, error rates, privacy and storage policy |
| Language transforms | translation, transliteration, script conversion, normalization, code-switching | direction-specific quality; preserve names, numbers, entities and formatting |
| Voice assistant UX | push-to-talk, wake word, editable transcript, read selection/message, multi-message queue | accessibility, keyboard/touch, focus, interruption, offline/error states |
| Runtime integration | local adapters, WebSocket/media transport, queueing, cancellation, gateway auth | preserve current gateway/provider contracts and resource limits |
| Privacy/security | local processing, retention, deletion, logs, permissions, prompt/audio injection | fail-closed defaults, no hidden cloud fallback, explicit consent |

Transliteration is not translation. Keep separate contracts and tests for transliteration, translation, transcription, normalization and text-to-speech.

## 3. Already researched candidates — baseline, not adoption

| Candidate | Existing evidence / intended role | Status and blockers |
|---|---|---|
| whisper.cpp | Current local ASR baseline | Keep until reproducible RU/EN/TH benchmark demonstrates a replacement win |
| Piper | Current local TTS baseline | Keep; exact voice artifacts and licenses must be recorded separately |
| Qwen3-ASR-0.6B | Existing multimodal-stack research; RU/TH candidate, offline/streaming claims | Verify exact checkpoint, runtime, license, stream semantics and target-host quality |
| Moonshine | Existing streaming/on-device candidate | Language coverage must be checked per exact model; not a universal RU/TH replacement |
| Nemotron 3.5 ASR Streaming 0.6B | Existing research: RU transcription-ready, TH adaptation-ready | Model terms OpenMDW-1.1; Thai requires adaptation and evaluation |
| Typhoon ASR Streaming 115M | Thai-specialized candidate | Separate runtime/model compatibility and CC-BY-4.0 obligations |
| VibeVoice ASR Streaming 1.5B | Existing research includes Russian and speaker-attributed streaming | Thai not listed in current research; chunk/lookahead latency |
| NeMo-Speech.cpp | Optional speech runtime with streaming/offline ASR and WebSocket routes | Apache-2.0 code; model licenses separate; optional runtime only |
| VoxCPM2 | RU/TH TTS research candidate | 2B, GPU-heavy; author benchmark is not aLandi measurement |
| Pipecat / LiveKit Agents | Media transport/session orchestration candidates | No migration selected; compare operational footprint and gateway fit |
| Silero VAD | VAD candidate | VAD is not AEC; test false cuts/missed endpoints |
| voicebench / EoT Bench / TurnBench | Evaluation references | Verify language coverage, dataset terms and reproducibility before reuse |

Sources and details are already recorded in:
- [Voice implementation plan](VOICE_IMPLEMENTATION_PLAN_RU.md)
- [Exa research synthesis](EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md)
- [Multimodal model stack](MULTIMODAL_MODEL_STACK_RU.md)
- [Voice latency contract](LATENCY_CONTRACT.md)
- [Voice language/model matrix](../evals/voice/language_matrix_v2.yaml)

No candidate is selected for production by this table.

## 4. Required benchmark design

Build one consented, versioned, locally stored golden set with speaker/device/noise metadata and separate train/dev/test partitions. Never put private recordings in public CI or third-party benchmark services.

Minimum axes:
- Languages: Russian, English, Thai; include code-switching only as a separately labelled slice.
- Conditions: quiet, room noise, far-field, headset, mobile mic, Bluetooth where available.
- Speakers: diverse accents and speaking rates, with explicit consent and deletion path.
- Text: names, addresses, dates, numbers, punctuation, mixed scripts, domain terms.
- ASR: WER and CER, language-specific normalization policy, partial latency, finalization delay, RTF, p50/p95/p99, memory.
- TTS: intelligibility/naturalness ratings, pronunciation, first audible sample, chunk gaps, cancellation and peak memory.
- Conversation: endpoint delay, false-cut/missed-endpoint rates, barge-in detection and audio stop latency, self-echo, overlap and turn recovery.
- Transliteration: round-trip and entity preservation; measure separately from semantic translation.
- Runtime: cold/warm startup, CPU/GPU, RSS/PSS/VRAM, thermal behavior, concurrent sessions, cancellation cleanup.

Use the definitions in `docs/LATENCY_CONTRACT.md`. Its proposed numeric targets are goals, not measured outcomes. Never discard cold-start samples or relabel latency metrics to make a candidate appear faster.

## 5. Architecture principles for future integration

1. Keep the browser static and current FastAPI gateway as the public/private boundary; do not expose ASR/TTS model servers directly to the browser.
2. Keep adapters typed and replaceable: capture → preprocessing → ASR partial/final → transcript editing → chat turn → streaming TTS → playback/cancel.
3. Preserve authorization, capability discovery and allowlists. Never accept arbitrary model paths or voice IDs.
4. Audio buffers, session count, queue length, wall-clock duration and child processes must be bounded.
5. Cancellation propagates end-to-end: browser Stop → gateway request → subprocess/model stream → playback; kill/reap child processes and suppress late audio.
6. Audio and transcripts are sensitive user content: no ordinary logs, hidden memory writes or external fallback; define retention/deletion before enabling.
7. Every model, voice, phonemizer, runtime and dataset gets independent version/hash/license provenance.
8. Add new runtime/dependencies only after a measured gap and a separate owner-approved implementation PR. This research PR itself remains documentation-only.

## 6. Work plan / task ledger

- [x] VOICE-TRACK-001 — создать изолированную research-ветку от main.
- [x] VOICE-TRACK-002 — перечитать существующие voice plans, research synthesis, language matrix, latency contract and implementation checklist.
- [~] VOICE-TRACK-003 — собрать ранее найденные/предоставленные владельцем источники и пометить provenance; часть исходных scratch/source URLs ещё требует сверки.
- [ ] VOICE-TRACK-004 — провести независимый поиск по официальным upstream/papers/model cards/standards в категориях ASR, TTS, real-time audio, diarization, transliteration и multilingual normalization.
- [ ] VOICE-TRACK-005 — проверить точные лицензии кода, весов, голосов, phonemizers, datasets и redistribution obligations.
- [ ] VOICE-TRACK-006 — сверить current code/tests and voice UI against every existing acceptance item; report precise implemented/partial/missing matrix.
- [ ] VOICE-TRACK-007 — составить воспроизводимый RU/EN/TH benchmark harness and golden-set governance.
- [ ] VOICE-TRACK-008 — сравнить 2–3 лучших кандидата на одинаковом наборе и target hardware; никаких model switches до measured win.
- [ ] VOICE-TRACK-009 — подготовить Voice 2.0 architecture/API contracts and phased implementation slices.
- [ ] VOICE-TRACK-010 — независимая security/privacy review и explicit owner approval перед runtime changes.

## 7. Explicit non-goals

- Не включать voice flags и не менять production defaults.
- Не скачивать модели/голоса на VPS и не выполнять live-host операции.
- Не добавлять Pipecat, LiveKit, NeMo, новые ASR/TTS engines или новые runtime dependencies в текущую сборку.
- Не менять лендинг и его UX ради демонстрации ещё не реализованной Voice 2.0.
- Не выдавать результаты авторских benchmarks за результаты aLandi.
- Не хранить аудио/транскрипты в обычной памяти, логах или публичных fixtures.
