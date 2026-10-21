"""Read-only Linux process RSS/peak-RSS sampling from procfs.

This reports current process RSS (VmRSS) and high-water-mark RSS (VmHWM) when procfs is
available. It intentionally avoids subprocess execution and never signals/unloads processes.
Aggregate RSS can over-count shared pages and is not identical to host-wide available RAM.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any


def _read_status(status_path: Path) -> dict[str, int] | None:
    try:
        lines = status_path.read_text(encoding="ascii", errors="ignore").splitlines()
    except (OSError, PermissionError):
        return None
    values: dict[str, int] = {}
    for line in lines:
        key, sep, raw = line.partition(":")
        if not sep or key not in {"VmRSS", "VmHWM"}:
            continue
        parts = raw.strip().split()
        if not parts or (len(parts) > 1 and parts[1].lower() != "kb"):
            continue
        try:
            amount = int(parts[0])
        except ValueError:
            continue
        if amount >= 0:
            values[key] = amount * 1024
    if "VmRSS" not in values and "VmHWM" not in values:
        return None
    return values


def collect_host_metrics(proc_root: str | Path = "/proc", gateway_pid: int | None = None,
                         ollama_comm: str = "ollama") -> dict[str, Any]:
    """Return best-effort process metrics; missing permissions/OS support yield unavailable fields."""
    root = Path(proc_root)
    current_pid = gateway_pid if gateway_pid is not None else os.getpid()
    gateway_status = _read_status(root / str(current_pid) / "status")
    ollama_processes: list[dict[str, Any]] = []
    try:
        candidates = list(root.iterdir())
    except (OSError, PermissionError):
        candidates = []

    for entry in candidates:
        if not entry.name.isdigit() or int(entry.name) == current_pid:
            continue
        try:
            comm = (entry / "comm").read_text(encoding="ascii", errors="ignore").strip()
        except (OSError, PermissionError):
            continue
        if comm != ollama_comm:
            continue
        sample = _read_status(entry / "status")
        if sample is None:
            continue
        ollama_processes.append({
            "rss_bytes": sample.get("VmRSS"),
            "rss_mb": round(sample["VmRSS"] / 1_048_576, 1) if "VmRSS" in sample else None,
            "peak_rss_bytes": sample.get("VmHWM"),
            "peak_rss_mb": round(sample["VmHWM"] / 1_048_576, 1) if "VmHWM" in sample else None,
        })

    rss_values = [item["rss_bytes"] for item in ollama_processes if item["rss_bytes"] is not None]
    peak_values = [item["peak_rss_bytes"] for item in ollama_processes if item["peak_rss_bytes"] is not None]
    return {
        "source": "linux_procfs",
        "available": gateway_status is not None or bool(ollama_processes),
        "gateway_process": {
            "rss_bytes": gateway_status.get("VmRSS") if gateway_status else None,
            "rss_mb": round(gateway_status["VmRSS"] / 1_048_576, 1)
            if gateway_status and "VmRSS" in gateway_status else None,
            "peak_rss_bytes": gateway_status.get("VmHWM") if gateway_status else None,
            "peak_rss_mb": round(gateway_status["VmHWM"] / 1_048_576, 1)
            if gateway_status and "VmHWM" in gateway_status else None,
        },
        "ollama_process_count": len(ollama_processes),
        "ollama_processes": ollama_processes,
        "ollama_rss_sum_mb": round(sum(rss_values) / 1_048_576, 1) if rss_values else None,
        "ollama_peak_rss_sum_mb": round(sum(peak_values) / 1_048_576, 1) if peak_values else None,
        "notes": [
            "Values may be unavailable if procfs is disabled or access is restricted.",
            "Summed RSS can double-count shared pages across processes.",
            "This is process RSS, not total available host memory and not KV-cache-only usage.",
            "No process termination or model eviction is ever performed.",
        ],
    }
