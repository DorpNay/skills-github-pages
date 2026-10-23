"""Two-tier voice command routing; tier selection does not execute actions."""
from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import Literal

VoiceTier = Literal["tier0", "tier1"]


def normalize_transcript(text: str) -> str:
    value = unicodedata.normalize("NFKC", text).casefold().strip()
    value = "".join(ch if ch.isalnum() else " " for ch in value)
    return " ".join(value.split())


# Only harmless turn/player controls. OS actions, purchases, communication and file writes are
# never Tier0, even if an ASR confidence score is high.
_TIER0_COMMANDS = {
    "stop": "stop_speaking",
    "cancel": "cancel_current_turn",
    "отмена": "cancel_current_turn",
    "хватит": "stop_speaking",
    "стоп": "stop_speaking",
    "повтори": "repeat_last_response",
    "repeat": "repeat_last_response",
}


@dataclass(frozen=True)
class TierDecision:
    tier: VoiceTier
    command: str | None
    confidence: float
    requires_confirmation: bool
    reason: str


class VoiceTierRouter:
    def __init__(self, *, tier0_confidence_min: float = 0.94, max_tier0_chars: int = 48):
        if not 0.5 <= tier0_confidence_min <= 1.0:
            raise ValueError("tier0_confidence_min must be between 0.5 and 1")
        self.tier0_confidence_min = tier0_confidence_min
        self.max_tier0_chars = max_tier0_chars

    def route(self, transcript: str, asr_confidence: float) -> TierDecision:
        if not isinstance(transcript, str) or isinstance(asr_confidence, bool) or not isinstance(asr_confidence, (int, float)) or not 0 <= asr_confidence <= 1:
            return TierDecision("tier1", None, 0.0, True, "invalid_asr_result")
        normalized = normalize_transcript(transcript)
        if normalized and len(transcript) <= self.max_tier0_chars and normalized in _TIER0_COMMANDS and asr_confidence >= self.tier0_confidence_min:
            return TierDecision("tier0", _TIER0_COMMANDS[normalized], float(asr_confidence), False, "exact_safe_command")
        return TierDecision("tier1", None, float(asr_confidence), True, "agent_or_confirmation_required")
