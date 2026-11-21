"""Typed local-first routing policy aligned with the V-016 contract.

This module selects a route; it does not execute tools, infer consent, or perform
provider fallback. Network-capable adapters must independently enforce privacy.
"""
from __future__ import annotations

import math
from dataclasses import dataclass
from enum import Enum


class RiskClass(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    SENSITIVE = "sensitive"
    DESTRUCTIVE = "destructive"


class Route(str, Enum):
    BLOCK_REQUIRE_CONFIRMATION = "BLOCK_REQUIRE_CONFIRMATION"
    BLOCK_NO_LOCAL_MODEL = "BLOCK_NO_LOCAL_MODEL"
    T0_COMMAND_CACHE = "T0_COMMAND_CACHE"
    RETRIEVAL_ONLY = "RETRIEVAL_ONLY"
    ESCALATE_TEXT_FALLBACK = "ESCALATE_TEXT_FALLBACK"
    ESCALATE_LARGE_MODEL = "ESCALATE_LARGE_MODEL"
    SMALL_LLM = "SMALL_LLM"


@dataclass(frozen=True)
class RouteDecision:
    route: Route
    rationale: str
    requires_confirmation: bool = False
    requires_user_notice: bool = False
    within_tier1_sla: bool = True
    local_only: bool = True


def calculate_route(
    intent_confidence: float,
    ctx_cost: int,
    budget_left_ms: int,
    risk_class: str | RiskClass,
    *,
    user_confirmed: bool = False,
    requires_facts: bool = False,
    requires_complex_reasoning: bool = False,
    privacy_only: bool = False,
    local_model_available: bool = True,
    large_model_available: bool = False,
    allow_slow_escalation: bool = False,
) -> RouteDecision:
    """Choose a bounded local route from confidence, context cost, budget and risk.

    ctx_cost is a non-negative integer estimate. Slow model escalation is outside
    Tier1 SLA and requires explicit opt-in. This function never returns cloud routes.
    """
    if isinstance(intent_confidence, bool) or not isinstance(intent_confidence, (float, int)):
        raise ValueError("intent_confidence must be a number between 0 and 1")
    confidence = float(intent_confidence)
    if not math.isfinite(confidence) or not 0.0 <= confidence <= 1.0:
        raise ValueError("intent_confidence must be finite and between 0 and 1")
    if isinstance(ctx_cost, bool) or not isinstance(ctx_cost, int) or ctx_cost < 0:
        raise ValueError("ctx_cost must be a non-negative integer")
    if isinstance(budget_left_ms, bool) or not isinstance(budget_left_ms, int) or budget_left_ms < 0:
        raise ValueError("budget_left_ms must be a non-negative integer")
    try:
        risk = risk_class if isinstance(risk_class, RiskClass) else RiskClass(risk_class)
    except (ValueError, TypeError):
        raise ValueError("risk_class must be low, normal, sensitive, or destructive") from None

    if risk is RiskClass.DESTRUCTIVE and not user_confirmed:
        return RouteDecision(
            Route.BLOCK_REQUIRE_CONFIRMATION,
            "Destructive actions are blocked until the user explicitly confirms them.",
            requires_confirmation=True,
        )
    if (
        confidence > 0.95 and ctx_cost < 500 and budget_left_ms > 800
        and risk in {RiskClass.LOW, RiskClass.NORMAL}
        and not requires_complex_reasoning and not requires_facts
    ):
        return RouteDecision(Route.T0_COMMAND_CACHE,
                             "High-confidence, low-context, low-risk request fits the exact fast path.")
    if requires_facts and not requires_complex_reasoning:
        return RouteDecision(Route.RETRIEVAL_ONLY,
                             "Factual retrieval is required; complex reasoning is not.")
    if budget_left_ms < 1500:
        return RouteDecision(
            Route.ESCALATE_TEXT_FALLBACK,
            "Insufficient budget remains for normal Tier1 generation; do not silently load a slow model.",
            requires_user_notice=True,
        )
    if requires_complex_reasoning and large_model_available and allow_slow_escalation:
        return RouteDecision(
            Route.ESCALATE_LARGE_MODEL,
            "A larger local model was explicitly allowed; expect about 5 seconds, outside Tier1 SLA.",
            requires_user_notice=True, within_tier1_sla=False,
        )
    if not local_model_available:
        reason = (
            "Privacy-only mode is fail-closed because no local model is available."
            if privacy_only else
            "No local model is available; this policy never silently falls back to a remote provider."
        )
        return RouteDecision(Route.BLOCK_NO_LOCAL_MODEL, reason)
    return RouteDecision(Route.SMALL_LLM, "Use the bounded small local model for the remaining request.")
