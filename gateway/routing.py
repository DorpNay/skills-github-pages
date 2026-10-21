"""Bounded, deterministic routing primitives for aLandi.

This is intentionally not a general-purpose semantic classifier. The first production
candidate only short-circuits exact, low-risk social utterances. Embedding-backed
classification remains injectable and must be evaluated before it can route actions.
"""
from __future__ import annotations

import re
import time
import unicodedata
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class RouteDecision:
    intent: str
    confidence: float
    requires_verification: bool
    rationale: str


# Explicit allowlist, not substring matches: "спасибо, а теперь переведи..." must not
# be swallowed by a greeting template.
_TEMPLATES: dict[str, dict[str, str]] = {
    "greeting": {
        "привет": "Привет! Чем могу помочь?",
        "здравствуй": "Здравствуй! Чем могу помочь?",
        "здравствуйте": "Здравствуйте! Чем могу помочь?",
        "доброе утро": "Доброе утро! Чем могу помочь?",
        "добрый день": "Добрый день! Чем могу помочь?",
        "добрый вечер": "Добрый вечер! Чем могу помочь?",
        "hello": "Hello! How can I help?",
        "hi": "Hi! How can I help?",
        "hey": "Hey! How can I help?",
    },
    "gratitude": {
        "спасибо": "Пожалуйста!",
        "большое спасибо": "Всегда пожалуйста!",
        "благодарю": "Пожалуйста!",
        "thank you": "You're welcome!",
        "thanks": "You're welcome!",
        "thx": "You're welcome!",
    },
    "farewell": {
        "пока": "Пока! Обращайся, когда понадобится помощь.",
        "до свидания": "До свидания!",
        "хорошего дня": "И тебе хорошего дня!",
        "goodbye": "Goodbye!",
        "bye": "Bye! Take care.",
        "see you": "See you!",
    },
}

_TOOLS_MARKERS = (
    "найди", "найти", "посчитай", "посчитать", "вычисли", "вычислить",
    "поищи", "ищи в интернете", "search for", "look up", "calculate",
    "compute", "open the url",
)
_RESEARCH_MARKERS = (
    "исследуй", "исследовать", "подробно изучи", "сравни источники",
    "проанализируй", "проведи аудит", "research", "investigate",
    "compare sources", "deep dive", "audit",
)


def normalize_text(value: str) -> str:
    """Normalize case and punctuation while preserving letters from all scripts."""
    value = unicodedata.normalize("NFKC", value).casefold().strip()
    value = "".join(char if char.isalnum() else " " for char in value)
    return " ".join(value.split())


class IntentRouter:
    """Low-cost routing baseline with conservative short-circuit semantics."""

    def classify(self, message: str) -> RouteDecision:
        normalized = normalize_text(message)
        if normalized in {phrase for group in _TEMPLATES.values() for phrase in group}:
            intent = next(name for name, templates in _TEMPLATES.items() if normalized in templates)
            return RouteDecision(intent, 1.0, False, "exact_low_risk_template")
        lowered = normalized
        if any(marker in lowered for marker in _TOOLS_MARKERS):
            return RouteDecision("tool_call", 0.60, True, "keyword_hint_only")
        if any(marker in lowered for marker in _RESEARCH_MARKERS):
            return RouteDecision("research", 0.65, True, "keyword_hint_only")
        return RouteDecision("general", 0.0, True, "default_to_main_model")

    def response_for(self, payload: dict[str, Any]) -> dict[str, Any] | None:
        """Return an OpenAI-compatible response only for an isolated exact template.

        We do not short-circuit streams, tool calls, structured output, multi-turn context,
        non-text messages, or any utterance that is not an exact allowlisted phrase.
        """
        if payload.get("stream") is True or payload.get("tools") or payload.get("tool_choice"):
            return None
        if payload.get("response_format") or payload.get("functions"):
            return None
        messages = payload.get("messages")
        if not isinstance(messages, list):
            return None
        conversational = [m for m in messages if isinstance(m, dict) and m.get("role") != "system"]
        if len(conversational) != 1 or not isinstance(conversational[0], dict):
            return None
        user_message = conversational[0]
        if user_message.get("role") != "user" or not isinstance(user_message.get("content"), str):
            return None
        text = user_message["content"]
        if not text or len(text) > 80:
            return None
        normalized = normalize_text(text)
        for intent, templates in _TEMPLATES.items():
            response_text = templates.get(normalized)
            if response_text is not None:
                return {
                    "id": f"chatcmpl-alandi-template-{int(time.time() * 1000)}",
                    "object": "chat.completion",
                    "created": int(time.time()),
                    "model": str(payload.get("model", "alandi-template")),
                    "choices": [{
                        "index": 0,
                        "message": {"role": "assistant", "content": response_text},
                        "finish_reason": "stop",
                    }],
                }
        return None
