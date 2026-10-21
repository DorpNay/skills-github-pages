"""Ollama resident-model inventory and conservative memory budget advice.

Ollama's documented /api/ps reports loaded models and their resident sizes; it does not
expose a per-conversation KV-cache inventory or an API to evict a conversation's KV state.
This module deliberately never labels model size as KV usage and never attempts unsafe
automatic eviction.
"""
from __future__ import annotations

from typing import Any


def analyze_runtime(payload: object, budget_mb: int = 6144) -> dict[str, Any]:
    if budget_mb < 256:
        raise ValueError("budget_mb must be >= 256")
    if not isinstance(payload, dict) or not isinstance(payload.get("models", []), list):
        raise ValueError("Ollama /api/ps response must contain a models list")

    models: list[dict[str, Any]] = []
    total_bytes = 0
    for item in payload.get("models", []):
        if not isinstance(item, dict):
            continue
        size = item.get("size")
        if not isinstance(size, (int, float)) or isinstance(size, bool) or size < 0:
            size = 0
        size_bytes = int(size)
        total_bytes += size_bytes
        models.append({
            "name": str(item.get("name") or item.get("model") or "unknown")[:160],
            "resident_size_bytes": size_bytes,
            "resident_size_mb": round(size_bytes / (1024 * 1024), 1),
            "size_vram_bytes": int(item.get("size_vram", 0))
            if isinstance(item.get("size_vram", 0), (int, float)) and item.get("size_vram", 0) >= 0 else 0,
            "expires_at": str(item.get("expires_at", ""))[:80],
        })

    total_mb = round(total_bytes / (1024 * 1024), 1)
    over_budget = total_bytes > budget_mb * 1024 * 1024
    return {
        "reported_loaded_models": models,
        "resident_model_bytes_reported_by_ollama": total_bytes,
        "resident_model_mb_reported_by_ollama": total_mb,
        "configured_budget_mb": budget_mb,
        "resident_model_footprint_over_budget": over_budget,
        "kv_cache_usage_mb": None,
        "kv_cache_api_supported": False,
        "automatic_eviction_performed": False,
        "recommendation": (
            "Resident model footprint is over the configured advisory budget. Check active requests, reduce context/"
            "parallelism, or unload an inactive model with the documented Ollama controls after operator review."
            if over_budget else
            "No automatic eviction recommended. Keep concurrency/context bounded and measure process RSS separately."
        ),
    }
