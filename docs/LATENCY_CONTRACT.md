# aLandi Voice Latency Contract

**Status:** accepted as a measurement contract; target numbers are not benchmark results. No live voice pipeline currently exists.

## Definitions

- **Wake-to-first-audio:** from the end of the wake-word audio window (not the start of speech) to first audible TTS sample.
- **PTT-release-to-first-audio:** from user release of push-to-talk to first audible TTS sample. Also report post-endpoint processing time separately.
- **Speech-endpoint-to-first-audio:** from the final confirmed speech frame to first audible TTS sample. This isolates ASR finalization/routing/inference/TTS from endpointing delay.
- **Natural-turn perceived latency:** from acoustic end of a natural utterance to first audible response, with interruption/restarts counted in the original request's total duration.
- **First text token** is not the same as first audible audio. TTFT alone does not satisfy a voice latency contract.
- **Endpoint delay:** acoustic last voiced frame to endpoint confirmation. Report false-cut and missed-endpoint rates alongside latency.

All timestamps use a monotonic clock on the same host. Perceived latency includes queueing, model warm/cold state, final ASR, response generation, TTS first chunk, and playback buffer. Do not subtract perceived endpoint delay from an already mixed metric.

## Proposed targets

| Mode | p50 target | p95 target | Status |
|---|---:|---:|---|
| Push-to-talk, release → audible audio | 180 ms | 250 ms | stretch target; unmeasured |
| Wake-word, detected wake → audible audio | 300 ms | 400 ms | MVP target; unmeasured |
| Wake-word stretch | 250 ms | 350 ms | research goal; not a guarantee |
| Natural turn, endpoint → audible audio | 400 ms | 550 ms | target; unmeasured |
| Post-endpoint processing | — | 250 ms for PTT, 180 ms stretch WW, 300 ms Natural | target; unmeasured |

The proposed numbers may not be achievable with a cold ASR/TTS/model load on an 8 GB CPU host. If a benchmark misses the targets, report it; do not relabel the metric or silently drop cold-start samples.

## Hard measurement constraints

- Reference profile: x86_64 Linux, 8 GB RAM, CPU-only, recorded CPU model, core count, kernel, Python/runtime versions, governor and temperature if available.
- Minimum 100 labelled utterances/mode/language for an initial report; final release target at least 500 across clean/noisy conditions with real device recordings collected with consent.
- Report cold-start and warm steady-state separately, plus p50/p90/p95/p99, sample count and confidence intervals or bootstrap intervals.
- Report endpoint false-cut rate, missed-endpoint rate, audio drop rate, real-time factor for ASR and TTS, time to final transcript, first text token, first TTS chunk and first audible sample.
- Audio capture buffers, input/output sample rates, channel count, resampling and echo-cancellation configuration must be recorded.
- PSS is measured from a process-aware memory tool on the actual host; do not infer PSS from model file size, RSS sum or Ollama /api/ps.
- CI fake-adapter tests validate orchestration, not latency. A self-hosted reference runner is needed for numeric gates.

## Kill criteria

- Wake-word perceived p95 over 550 ms in two consecutive properly controlled reports: disable speculative early synthesis and profile ASR/TTS/cold loading before switching models.
- Tier0 false-cut rate above 1.5%: disable predictive endpointing and return to conservative hangover.
- Audio drops over 0.1%, cleanup failures, unbounded lease counts or speculative write attempts: stop the experiment immediately.
- Hot voice core peak PSS over 1.2 GB or total system peak over 6.5 GB on the 8 GB host: stop loading concurrent voice/model assets; reduce concurrent residency/context before further optimization.
- Any model/voice license uncertainty: don't ship that artifact.

## Required report

reports/voice/<date>-<git-sha>.json plus a human-readable Markdown summary with hardware, artifacts/checksums, benchmark command, exact thresholds and whether the run is VALID or UNVERIFIED. Never store transcripts or raw audio unless explicitly required by the evaluation protocol and consented; use case IDs by default.
