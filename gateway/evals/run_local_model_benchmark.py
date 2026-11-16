#!/usr/bin/env python3
"""Bounded synthetic latency/response smoke for an OpenAI-compatible model endpoint.

Uses fixed public-style prompts only. It never reads chat history, stores the API key,
or follows redirects. A non-empty response is a transport smoke result, not a quality score.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import statistics
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit


MAX_RESPONSE_BYTES = 1024 * 1024

PROMPTS: tuple[dict[str, str], ...] = (
    {"id": "ru_arithmetic", "language": "ru", "prompt": "Ответь по-русски: сколько будет 19 + 23? Напиши число и одно короткое объяснение."},
    {"id": "en_arithmetic", "language": "en", "prompt": "In English, what is 17 multiplied by 6? Give the number and one short explanation."},
    {"id": "th_arithmetic", "language": "th", "prompt": "ตอบเป็นภาษาไทย: 2 + 3 เท่ากับเท่าไร? ตอบสั้น ๆ"},
    {"id": "ru_summary", "language": "ru", "prompt": "Кратко перескажи одним предложением: SQLite FTS5 индексирует текст для полнотекстового поиска; BM25 ранжирует найденные документы; меньшая оценка BM25 означает лучший результат."},
    {"id": "en_instruction", "language": "en", "prompt": "Return exactly this JSON object and no Markdown: {\"ok\": true, \"count\": 3}"},
    {"id": "ru_code", "language": "ru", "prompt": "Напиши короткую функцию Python clamp(value, low, high) и два pytest-теста: обычное значение и значение за верхней границей. Только код."},
    {"id": "en_reasoning", "language": "en", "prompt": "A request takes 800 ms and the next takes 600 ms. What is the mean latency in milliseconds? Answer with the number first."},
    {"id": "ru_privacy", "language": "ru", "prompt": "В одном предложении объясни, почему секретный API-ключ нельзя хранить в публичном JavaScript."},
    {"id": "th_instruction", "language": "th", "prompt": "ตอบเป็นภาษาไทยสั้น ๆ: HTTP 401 หมายถึงอะไร?"},
)


class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Never forward a configured bearer token to a redirect target."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def percentile(values: list[float], percent: float) -> float | None:
    """Nearest-rank percentile; returns None for an empty sample."""
    if not values:
        return None
    ordered = sorted(values)
    rank = max(1, min(len(ordered), math.ceil((percent / 100.0) * len(ordered))))
    return ordered[rank - 1]


def summarize(values: list[float]) -> dict[str, float | int | None]:
    return {
        "count": len(values),
        "min": round(min(values), 2) if values else None,
        "median": round(statistics.median(values), 2) if values else None,
        "p95": round(percentile(values, 95), 2) if values else None,
        "max": round(max(values), 2) if values else None,
    }


def request_completion(base_url: str, api_key: str, model: str, prompt: str, timeout: float) -> tuple[dict[str, Any], float]:
    endpoint = base_url.rstrip("/") + "/chat/completions"
    body = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "max_tokens": 160,
        "stream": False,
    }).encode("utf-8")
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if api_key:
        headers["Authorization"] = "Bearer " + api_key
    request = urllib.request.Request(endpoint, data=body, headers=headers, method="POST")
    opener = urllib.request.build_opener(NoRedirectHandler())
    started = time.perf_counter()
    try:
        with opener.open(request, timeout=timeout) as response:
            raw = response.read(MAX_RESPONSE_BYTES + 1)
            if len(raw) > MAX_RESPONSE_BYTES:
                raise RuntimeError("Model endpoint response exceeded the 1 MiB safety limit")
            payload = json.loads(raw.decode("utf-8"))
    except urllib.error.HTTPError as exc:
        # Do not include upstream response bodies; they may contain private diagnostics.
        raise RuntimeError(f"HTTP {exc.code} from configured model endpoint") from None
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Could not reach configured model endpoint: {exc.reason}") from None
    elapsed_ms = (time.perf_counter() - started) * 1000
    if not isinstance(payload, dict):
        raise RuntimeError("Model endpoint returned a non-object JSON payload")
    return payload, elapsed_ms


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default=os.getenv("ALANDI_BENCHMARK_BASE_URL", "http://127.0.0.1:8000/v1"),
                        help="OpenAI-compatible base URL; HTTPS is required off loopback")
    parser.add_argument("--model", required=True, help="Exact allowlisted model ID")
    parser.add_argument("--runs", type=int, default=2, help="Repeats per prompt (1..10)")
    parser.add_argument("--timeout", type=float, default=180.0, help="Per-request timeout seconds")
    parser.add_argument("--output", default="", help="Report path; default includes UTC timestamp")
    args = parser.parse_args()

    if not args.model.strip():
        parser.error("--model must not be empty")
    if not 1 <= args.runs <= 10:
        parser.error("--runs must be between 1 and 10")
    if not 1 <= args.timeout <= 600:
        parser.error("--timeout must be between 1 and 600 seconds")
    parsed_url = urlsplit(args.base_url)
    if (parsed_url.scheme not in {"http", "https"} or not parsed_url.hostname or
            parsed_url.username or parsed_url.password or parsed_url.query or parsed_url.fragment):
        parser.error("--base-url must be a valid HTTP(S) base URL without credentials, query or fragment")
    if parsed_url.scheme == "http" and parsed_url.hostname not in {"127.0.0.1", "localhost", "::1"}:
        parser.error("Plain HTTP is allowed only for a loopback benchmark endpoint")

    api_key = os.getenv("ALANDI_API_KEY", "")
    results: list[dict[str, Any]] = []
    all_latencies: list[float] = []
    total_requests = len(PROMPTS) * args.runs
    completed = 0
    for prompt_case in PROMPTS:
        for run_index in range(1, args.runs + 1):
            item: dict[str, Any] = {
                "prompt_id": prompt_case["id"],
                "language": prompt_case["language"],
                "run": run_index,
            }
            try:
                payload, latency_ms = request_completion(args.base_url, api_key, args.model,
                                                         prompt_case["prompt"], args.timeout)
                choices = payload.get("choices")
                message = choices[0].get("message", {}) if isinstance(choices, list) and choices else {}
                content = message.get("content", "") if isinstance(message, dict) else ""
                if isinstance(content, list):
                    content = " ".join(str(part.get("text", "")) for part in content if isinstance(part, dict))
                content = content if isinstance(content, str) else ""
                usage = payload.get("usage") if isinstance(payload.get("usage"), dict) else {}
                completion_tokens = usage.get("completion_tokens")
                item.update({
                    "ok": bool(content.strip()),
                    "latency_ms": round(latency_ms, 2),
                    "completion_tokens": completion_tokens if isinstance(completion_tokens, int) else None,
                    "tokens_per_second": round(completion_tokens / (latency_ms / 1000), 2)
                        if isinstance(completion_tokens, int) and completion_tokens >= 0 and latency_ms > 0 else None,
                    "response_excerpt": content[:240],
                })
                all_latencies.append(latency_ms)
            except Exception as exc:  # report each bounded probe and continue the matrix
                item.update({"ok": False, "error": str(exc)[:240]})
            results.append(item)
            completed += 1
            print(f"[{completed}/{total_requests}] {item['prompt_id']} run={run_index} "
                  f"{'OK' if item['ok'] else 'FAIL'}"
                  + (f" {item['latency_ms']:.0f} ms" if "latency_ms" in item else ""))

    success_count = sum(1 for item in results if item.get("ok"))
    report = {
        "schema_version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "model": args.model,
        "base_url": args.base_url,
        "runs_per_prompt": args.runs,
        "prompt_count": len(PROMPTS),
        "request_count": total_requests,
        "success_count": success_count,
        "success_rate": round(success_count / total_requests, 4),
        "latency_ms": summarize(all_latencies),
        "tokens_per_second": summarize([item["tokens_per_second"] for item in results if isinstance(item.get("tokens_per_second"), (int, float))]),
        "results": results,
        "limitations": [
            "Success means a non-empty API response only; it is not a correctness or human-rated quality score.",
            "Synthetic smoke only; do not send private prompts or chat history.",
            "Non-streaming requests measure full response latency, not first-token latency.",
            "Tokens/second is reported only when the endpoint returns usage.completion_tokens.",
            "Redirects are refused; the configured bearer token is never forwarded to a redirect target.",
            "Response bodies are capped at 1 MiB; request count is bounded by 9 prompts and 10 runs per prompt.",
            "Run the same prompts, context, hardware, model and repetitions for every candidate.",
            "RAM/PSS, cold-start behavior and human-rated RU/EN/TH quality require separate target-host evaluation.",
        ],
    }
    output_path = args.output or f"model-benchmark-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.json"
    Path(output_path).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Report: {output_path}")
    print(f"Non-empty responses: {success_count}/{total_requests}; latency p50={report['latency_ms']['median']} ms, "
          f"p95={report['latency_ms']['p95']} ms")
    return 0 if success_count == total_requests else 1


if __name__ == "__main__":
    raise SystemExit(main())
