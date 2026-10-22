"""Conservative endpoint confirmation logic; thresholds are configurable hypotheses, not guarantees."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class EndpointSignal:
    last_voiced_ts_ms: int
    now_ms: int
    vad_prob: float
    asr_partial: str
    asr_confidence: float
    grammar_complete: bool
    command_slot_ready: bool


@dataclass(frozen=True)
class EndpointConfig:
    min_hangover_ms: int = 350
    ultra_min_hangover_ms: int = 220
    max_hangover_ms: int = 1200
    asr_conf_min: float = 0.94
    asr_conf_high: float = 0.985
    vad_speech_threshold: float = 0.55

    def validate(self) -> None:
        if not 0 <= self.ultra_min_hangover_ms <= self.min_hangover_ms < self.max_hangover_ms:
            raise ValueError("require 0 <= ultra_min <= min_hangover < max_hangover")
        if not 0 <= self.asr_conf_min <= self.asr_conf_high <= 1:
            raise ValueError("ASR thresholds must satisfy 0 <= min <= high <= 1")
        if not 0 <= self.vad_speech_threshold <= 1:
            raise ValueError("VAD threshold must be between 0 and 1")


def endpoint_confirmed(signal: EndpointSignal, config: EndpointConfig = EndpointConfig()) -> bool:
    config.validate()
    ints = (signal.last_voiced_ts_ms, signal.now_ms)
    if any(isinstance(value, bool) or not isinstance(value, int) or value < 0 for value in ints):
        return False
    if signal.now_ms < signal.last_voiced_ts_ms:
        return False
    if not 0 <= signal.vad_prob <= 1 or not 0 <= signal.asr_confidence <= 1:
        return False
    if not isinstance(signal.asr_partial, str) or not signal.asr_partial.strip():
        return False
    silence_ms = signal.now_ms - signal.last_voiced_ts_ms

    # Long-silence fallback still requires non-empty transcript and a previously observed utterance.
    if silence_ms >= config.max_hangover_ms:
        return True
    if (silence_ms >= config.min_hangover_ms and
            signal.asr_confidence >= config.asr_conf_min and
            signal.grammar_complete and signal.command_slot_ready):
        return True
    if (silence_ms >= config.ultra_min_hangover_ms and
            signal.asr_confidence >= config.asr_conf_high and
            signal.command_slot_ready and
            signal.vad_prob < config.vad_speech_threshold):
        return True
    return False
