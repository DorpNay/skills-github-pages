"""Contracts for a future native voice core; no microphone/models are initialized here."""
from __future__ import annotations

import re
from dataclasses import dataclass
from enum import StrEnum
from typing import Any, AsyncIterator, Protocol


class VoiceEventType(StrEnum):
    SPEECH_STARTED = "speech_started"
    LAST_VOICED_FRAME = "last_voiced_frame"
    ENDPOINT_CONFIRMED = "endpoint_confirmed"
    ASR_PARTIAL = "asr_partial"
    ASR_FINAL = "asr_final"
    TTS_FIRST_AUDIO = "tts_first_audio"
    INTERRUPT_DETECTED = "interrupt_detected"
    ERROR = "error"


_ALLOWED_PAYLOAD_FIELDS = frozenset({
    "confidence", "text", "language", "duration_ms", "sample_rate",
    "channels", "error_code", "model_tag", "is_final",
})
_CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


@dataclass(frozen=True)
class VoiceEvent:
    type: VoiceEventType
    ts_ns: int
    payload: dict[str, str | int | float | bool]

    @classmethod
    def create(cls, event_type: VoiceEventType, ts_ns: int,
               payload: dict[str, Any] | None = None) -> "VoiceEvent":
        if isinstance(ts_ns, bool) or not isinstance(ts_ns, int) or ts_ns <= 0:
            raise ValueError("ts_ns must be a positive monotonic timestamp in nanoseconds")
        safe: dict[str, str | int | float | bool] = {}
        for key, value in (payload or {}).items():
            if key not in _ALLOWED_PAYLOAD_FIELDS:
                continue
            if isinstance(value, bool) or isinstance(value, (int, float)):
                safe[key] = value
            elif isinstance(value, str) and len(value) <= 2048 and not _CONTROL.search(value):
                safe[key] = value
        if "confidence" in safe and not 0 <= float(safe["confidence"]) <= 1:
            raise ValueError("confidence must be between 0 and 1")
        return cls(type=event_type, ts_ns=ts_ns, payload=safe)


class NativeVoiceCore(Protocol):
    """A Rust/PyO3 or native ONNX adapter publishes metadata events, not PCM buffers."""

    async def events(self) -> AsyncIterator[VoiceEvent]:
        """Yield bounded public events. Raw PCM must remain inside the native audio subsystem."""
        ...
