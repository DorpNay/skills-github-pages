"""Ollama loaded-model inventory; not a host RSS or KV-cache monitor.

Ollama /api/ps lists loaded models and reports size and size_vram. It does not expose
per-conversation KV-cache usage or an eviction API for individual chats. A host-level
monitor must sample the actual gateway/Ollama process RSS separately.
"""
from __future__ import annotations

from typing import Any


def analyze_runtime(payload: object, advisory_model_size_budget_mb: int = 6144) -> dict[str, Any]:
    if isinstance(advisory_model_size_budget_mb, bool) or not isinstance(advisory_model_size_budget_mb, int) or advisory_model_size_budget_mb < 256:
        raise ValueError("advisory_model_size_budget_mb must be an integer >= 256")
    if not isinstance(payload, dict) or not isinstance(payload.get("models"), list):
        raise ValueError("Ollama /api/ps response must contain a models list")

    models: list[dict[str, Any]] = []
    total_size_bytes = 0
    total_vram_bytes = 0
    for item in payload["models"]:
        if not isinstance(item, dict):
            continue
        size = item.get("size")
        if not isinstance(size, int) or isinstance(size, bool) or size < 0:
            size = None
        vram_size = item.get("size_vram")
        if not isinstance(vram_size, int) or isinstance(vram_size, bool) or vram_size < 0:
            vram_size = None
        if size is not None:
            total_size_bytes += size
        if vram_size is not None:
            total_vram_bytes += vram_size
        models.append({
            "name": str(item.get("name") or item.get("model") or "unknown")[:160],
            "reported_size_bytes": size,
            "reported_size_mb": round(size / (1024 * 1024), 1) if size is not None else None,
            "reported_size_vram_bytes": vram_size,
            "reported_size_vram_mb": round(vram_size / (1024 * 1024), 1) if vram_size is not None else None,
            "expires_at": str(item.get("expires_at", ""))[:80],
        })

    total_size_mb = round(total_size_bytes / (1024 * 1024), 1)
    total_vram_mb = round(total_vram_bytes / (1024 * 1024), 1)
    return {
        "reported_loaded_models": models,
        "reported_model_size_total_bytes": total_size_bytes,
        "reported_model_size_total_mb": total_size_mb,
        "reported_vram_size_total_bytes": total_vram_bytes,
        "reported_vram_size_total_mb": total_vram_mb,
        "advisory_model_size_budget_mb": advisory_model_size_budget_mb,
        "reported_model_size_over_advisory_budget": total_size_bytes > advisory_model_size_budget_mb * 1024 * 1024,
        "host_rss_mb": None,
        "kv_cache_usage_mb": None,
        "kv_cache_api_supported": False,
        "automatic_eviction_performed": False,
        "note": (
            "These are Ollama /api/ps model inventory fields, not host RSS or per-conversation KV usage. "
            "Measure process RSS with the host service manager/OS; keep context and concurrency bounded. "
            "Never infer that a model-size sum is available system RAM."
        ),
    }
