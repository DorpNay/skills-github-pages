"""Barge-in decision policy; acoustic echo cancellation remains a native adapter responsibility."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BargeInSignal:
    user_speech_probability: float
    playback_echo_similarity: float
    aec_residual_probability: float
    playback_active: bool


@dataclass(frozen=True)
class BargeInConfig:
    speech_min: float = 0.82
    echo_similarity_max: float = 0.72
    residual_min: float = 0.78


def should_interrupt(signal: BargeInSignal, config: BargeInConfig = BargeInConfig()) -> bool:
    values = (signal.user_speech_probability, signal.playback_echo_similarity, signal.aec_residual_probability)
    if any(not 0 <= value <= 1 for value in values):
        return False
    # During playback, require both strong residual speech and low correlation with our own output.
    if signal.playback_active:
        return (signal.user_speech_probability >= config.speech_min and
                signal.aec_residual_probability >= config.residual_min and
                signal.playback_echo_similarity <= config.echo_similarity_max)
    return signal.user_speech_probability >= config.speech_min
