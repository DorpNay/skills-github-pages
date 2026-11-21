"""Compare stdlib JSON with optional orjson without changing the gateway default.

Run: python gateway/evals/serialization_benchmark.py --iterations 2000
This is a microbenchmark, not evidence of end-to-end latency improvement.
"""
from __future__ import annotations

import argparse
import json
import platform
import statistics
import sys
import time
from typing import Any


def percentile(values: list[float], quantile: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    return round(ordered[min(len(ordered) - 1, int((len(ordered) - 1) * quantile))], 3)


def samples_for(iterations: int, payload: Any) -> dict[str, Any]:
    encoded_std = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    try:
        import orjson
    except ImportError:
        orjson = None

    results: dict[str, Any] = {
        "payload_bytes_stdlib": len(encoded_std),
        "stdlib": {},
        "orjson": None,
    }

    def run(fn, expected: bytes) -> dict[str, Any]:
        durations = []
        for _ in range(iterations):
            started = time.perf_counter_ns()
            encoded = fn(payload)
            durations.append((time.perf_counter_ns() - started) / 1_000_000)
            if encoded != expected:
                raise RuntimeError("serializer semantic mismatch: serialized bytes differ")
        return {
            "p50_ms": percentile(durations, 0.50),
            "p95_ms": percentile(durations, 0.95),
            "mean_ms": round(statistics.fmean(durations), 4),
            "iterations": iterations,
            "output_bytes": len(expected),
        }

    results["stdlib"] = run(lambda item: json.dumps(item, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
                            encoded_std)
    if orjson is not None:
        # orjson's UTF-8 output should equal this compact stdlib JSON for this benchmark's payload.
        encoded_orjson = orjson.dumps(payload, option=orjson.OPT_NON_STR_KEYS)
        if encoded_orjson != encoded_std:
            # Report byte-parity mismatch; do not compare performance as if the wire format were identical.
            results["orjson"] = {"available": True, "semantic_parity": False,
                                 "stdlib_bytes": len(encoded_std), "orjson_bytes": len(encoded_orjson)}
        else:
            results["orjson"] = {"available": True, "semantic_parity": True,
                                 **run(lambda item: orjson.dumps(item), encoded_std)}
    return results


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--iterations", type=int, default=2000)
    args = parser.parse_args()
    if not 20 <= args.iterations <= 1_000_000:
        parser.error("--iterations must be between 20 and 1000000")
    payloads = {
        "small_response": {"id": "chatcmpl-benchmark", "choices": [{"message": {"role": "assistant", "content": "ok"}}]},
        "medium_messages": {"messages": [{"role": "user", "content": "aLandi serialization benchmark " * 32} for _ in range(12)]},
        "unicode_russian": {"text": "Проверка UTF-8: привет, мир; цитаты, память, контекст. " * 20},
    }
    report = {
        "benchmark": "json-serialization-microbenchmark",
        "python": sys.version,
        "platform": platform.platform(),
        "iterations_per_payload": args.iterations,
        "note": "Microbenchmark only; run on target hardware. Does not authorize a default serializer change.",
        "payloads": {name: samples_for(args.iterations, payload) for name, payload in payloads.items()},
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
