import json
import os
import tempfile
from typing import AsyncIterator

import httpx
from fastapi.testclient import TestClient

from gateway.app import Settings, create_app

API_KEY = "a" * 64
MODEL = "qwen3.5:4b"


def settings(**overrides):
    values = dict(api_key=API_KEY, ollama_base_url="http://ollama.test:11434",
                  allowed_models=(MODEL,), cors_origins=("https://dorpnay.github.io", "http://localhost:4000"),
                  max_body_bytes=4096, upstream_timeout_seconds=30.0, max_inflight_requests=2,
                  model_context_length_tokens=4096, cache_enabled=False)
    values.update(overrides)
    return Settings(**values)


class AsyncBytes(httpx.AsyncByteStream):
    def __init__(self, content: bytes): self.content = content
    async def __aiter__(self) -> AsyncIterator[bytes]: yield self.content
    async def aclose(self) -> None: return None


def transport(handler=None):
    def default(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": [{"name": MODEL}, {"name": "not-allowed"}]})
        if request.url.path == "/v1/chat/completions":
            payload = json.loads(request.content)
            if payload.get("stream"):
                return httpx.Response(200, headers={"content-type": "text/event-stream"},
                                      stream=AsyncBytes(b'data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n'))
            return httpx.Response(200, json={"model": MODEL, "choices": [{"message": {"role": "assistant", "content": "ok"}}]})
        return httpx.Response(404, json={})
    return httpx.MockTransport(handler or default)


def client_for(config=None, handler=None):
    return TestClient(create_app(config or settings(), transport=transport(handler)))


def test_health_has_no_secret():
    with client_for() as client:
        response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "ollama": "reachable", "auth_configured": True}
    assert API_KEY not in response.text


def test_models_require_auth_and_return_only_allowlisted_installed_model():
    with client_for() as client:
        assert client.get("/v1/models").status_code == 401
        response = client.get("/v1/models", headers={"Authorization": f"Bearer {API_KEY}"})
    assert response.status_code == 200
    assert [x["id"] for x in response.json()["data"]] == [MODEL]
    assert response.json()["data"][0]["context_length"] == 4096


def test_chat_forwards_tools_and_openai_body():
    with client_for() as client:
        response = client.post("/v1/chat/completions", headers={"Authorization": f"Bearer {API_KEY}"},
          json={"model": MODEL, "messages": [{"role": "user", "content": "say ok"}],
                "tools": [{"type": "function", "function": {"name": "noop", "parameters": {"type": "object"}}}]})
    assert response.status_code == 200
    assert response.json()["choices"][0]["message"]["content"] == "ok"


def test_streaming_keeps_sse_payload():
    with client_for() as client:
        response = client.post("/v1/chat/completions", headers={"Authorization": f"Bearer {API_KEY}"},
          json={"model": MODEL, "messages": [{"role": "user", "content": "say ok"}], "stream": True})
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")
    assert "data: [DONE]" in response.text


def test_unknown_model_is_rejected_before_upstream_call():
    calls = []
    def handler(request):
        calls.append(request.url.path)
        return httpx.Response(200, json={"models": []})
    with client_for(handler=handler) as client:
        response = client.post("/v1/chat/completions", headers={"Authorization": f"Bearer {API_KEY}"},
          json={"model": "not-allowed", "messages": [{"role": "user", "content": "hi"}]})
    assert response.status_code == 400 and not calls


def test_missing_or_wrong_auth_rejected():
    with client_for() as client:
        missing = client.post("/v1/chat/completions", json={"model": MODEL, "messages": [{"role": "user", "content": "hi"}]})
        wrong = client.post("/v1/chat/completions", headers={"Authorization": "Bearer wrong"},
          json={"model": MODEL, "messages": [{"role": "user", "content": "hi"}]})
    assert missing.status_code == 401 and wrong.status_code == 401


def test_body_limit_and_invalid_json_are_rejected():
    with client_for() as client:
        oversized = client.post("/v1/chat/completions", headers={"Authorization": f"Bearer {API_KEY}"},
          content=json.dumps({"model": MODEL, "messages": [{"role": "user", "content": "x" * 5000}]}))
        invalid = client.post("/v1/chat/completions", headers={"Authorization": f"Bearer {API_KEY}"}, content="{")
    assert oversized.status_code == 413 and invalid.status_code == 400


def test_invalid_message_role_is_rejected():
    with client_for() as client:
        response = client.post("/v1/chat/completions", headers={"Authorization": f"Bearer {API_KEY}"},
          json={"model": MODEL, "messages": [{"role": "godmode", "content": "hi"}]})
    assert response.status_code == 400


def test_cors_allows_only_configured_origin():
    with client_for() as client:
        good = client.options("/v1/chat/completions", headers={"Origin": "https://dorpnay.github.io",
          "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "authorization,content-type"})
        bad = client.options("/v1/chat/completions", headers={"Origin": "https://evil.example",
          "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "authorization,content-type"})
    assert good.headers.get("access-control-allow-origin") == "https://dorpnay.github.io"
    assert "access-control-allow-origin" not in bad.headers


def test_short_secret_disables_protected_routes():
    with client_for(settings(api_key="short")) as client:
        assert client.get("/v1/models").status_code == 503


def test_upstream_errors_do_not_leak_raw_body():
    def handler(request): return httpx.Response(500, json={"debug": "internal path and secrets"})
    with client_for(handler=handler) as client:
        response = client.post("/v1/chat/completions", headers={"Authorization": f"Bearer {API_KEY}"},
          json={"model": MODEL, "messages": [{"role": "user", "content": "hi"}]})
    assert response.status_code == 502
    assert "internal path" not in response.text


def test_exact_cache_miss_then_hit_and_stats_require_auth():
    with tempfile.TemporaryDirectory() as directory:
        config = settings(cache_enabled=True, cache_path=os.path.join(directory, "cache.sqlite3"))
        calls = []
        def handler(request):
            if request.url.path == "/api/tags":
                return httpx.Response(200, json={"models": [{"name": MODEL}]})
            if request.url.path == "/v1/chat/completions":
                calls.append(1)
                return httpx.Response(200, json={
                    "id": "cache-check", "model": MODEL,
                    "choices": [{"index": 0, "message": {"role": "assistant", "content": "exact-cache-answer"},
                                 "finish_reason": "stop"}],
                })
            return httpx.Response(404, json={})
        with client_for(config=config, handler=handler) as client:
            assert client.get("/admin/cache/stats").status_code == 401
            headers = {"Authorization": f"Bearer {API_KEY}"}
            payload = {"model": MODEL, "messages": [{"role": "user", "content": "Repeat this exactly"}],
                       "temperature": 0, "stream": False}
            first = client.post("/v1/chat/completions", headers=headers, json=payload)
            second = client.post("/v1/chat/completions", headers=headers, json=payload)
            stats = client.get("/admin/cache/stats", headers=headers)
        assert first.status_code == second.status_code == 200
        assert first.headers["x-ai-cache"] == "MISS"
        assert second.headers["x-ai-cache"] == "HIT"
        assert second.json()["choices"][0]["message"]["content"] == "exact-cache-answer"
        assert len(calls) == 1
        assert stats.status_code == 200
        assert stats.json()["entries"] == 1
        assert stats.json()["response_bytes"] > 0


def test_cache_bypasses_missing_temperature_tools_and_explicit_header():
    with tempfile.TemporaryDirectory() as directory:
        config = settings(cache_enabled=True, cache_path=os.path.join(directory, "cache.sqlite3"))
        calls = []
        def handler(request):
            if request.url.path == "/api/tags":
                return httpx.Response(200, json={"models": [{"name": MODEL}]})
            calls.append(1)
            return httpx.Response(200, json={
                "model": MODEL, "choices": [{"message": {"role": "assistant", "content": "live"},
                                              "finish_reason": "stop"}],
            })
        with client_for(config=config, handler=handler) as client:
            headers = {"Authorization": f"Bearer {API_KEY}"}
            base = {"model": MODEL, "messages": [{"role": "user", "content": "no cache"}]}
            no_temperature = client.post("/v1/chat/completions", headers=headers, json=base)
            no_temperature_again = client.post("/v1/chat/completions", headers=headers, json=base)
            explicit_bypass = client.post("/v1/chat/completions",
                headers={**headers, "X-AI-Cache-Bypass": "1"},
                json={**base, "temperature": 0})
            has_tools = client.post("/v1/chat/completions", headers=headers,
                json={**base, "temperature": 0, "tools": [{"type": "function"}]})
        assert no_temperature.headers["x-ai-cache"] == "BYPASS"
        assert no_temperature_again.headers["x-ai-cache"] == "BYPASS"
        assert explicit_bypass.headers["x-ai-cache"] == "BYPASS"
        assert has_tools.headers["x-ai-cache"] == "BYPASS"
        assert len(calls) == 4


def test_truncated_response_is_never_cached():
    with tempfile.TemporaryDirectory() as directory:
        config = settings(cache_enabled=True, cache_path=os.path.join(directory, "cache.sqlite3"))
        calls = []
        def handler(request):
            if request.url.path == "/api/tags":
                return httpx.Response(200, json={"models": [{"name": MODEL}]})
            calls.append(1)
            return httpx.Response(200, json={
                "model": MODEL, "choices": [{"message": {"role": "assistant", "content": "partial"},
                                              "finish_reason": "length"}],
            })
        with client_for(config=config, handler=handler) as client:
            headers = {"Authorization": f"Bearer {API_KEY}"}
            payload = {"model": MODEL, "messages": [{"role": "user", "content": "truncated"}],
                       "temperature": 0}
            first = client.post("/v1/chat/completions", headers=headers, json=payload)
            second = client.post("/v1/chat/completions", headers=headers, json=payload)
        assert first.headers["x-ai-cache"] == "MISS"
        assert second.headers["x-ai-cache"] == "MISS"
        assert len(calls) == 2


def test_cors_allows_trace_propagation_headers_for_configured_frontend():
    client = TestClient(create_app(settings(), transport=transport()))
    response = client.options(
        "/healthz",
        headers={
            "Origin": "https://dorpnay.github.io",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "x-ai-trace-id,traceparent",
        },
    )
    assert response.status_code == 200
    allowed = response.headers["access-control-allow-headers"].lower()
    assert "x-ai-trace-id" in allowed
    assert "traceparent" in allowed


def test_trace_context_header_is_validated_generated_and_exposed():
    client = TestClient(create_app(settings(), transport=transport()))
    with client:
        generated = client.get("/healthz")
        generated_id = generated.headers["x-ai-trace-id"]
        assert len(generated_id) == 32
        assert generated_id != "0" * 32

        propagated = client.get("/healthz", headers={"X-AI-Trace-ID": "0123456789abcdef0123456789abcdef"})
        assert propagated.headers["x-ai-trace-id"] == "0123456789abcdef0123456789abcdef"

        # Malformed external IDs must not be trusted or echoed.
        malformed = client.get("/healthz", headers={"X-AI-Trace-ID": "not-a-trace-id"})
        assert malformed.headers["x-ai-trace-id"] != "not-a-trace-id"
        assert len(malformed.headers["x-ai-trace-id"]) == 32


def test_trace_context_accepts_valid_w3c_traceparent_and_drops_sensitive_attributes():
    from observability.trace_context import (
        bind_trace_id, get_trace_id, make_trace_event, reset_trace_id, trace_id_from_traceparent
    )

    trace_id = "0123456789abcdef0123456789abcdef"
    header = f"00-{trace_id}-0123456789abcdef-01"
    assert trace_id_from_traceparent(header) == trace_id
    assert trace_id_from_traceparent("00-" + "0" * 32 + "-0123456789abcdef-01") is None

    bound, token = bind_trace_id(trace_id)
    try:
        assert get_trace_id() == bound
        event = make_trace_event("request_complete", "gateway", {
            "http_method": "GET", "http_status": 200, "component": "gateway",
            "prompt": "private text", "request_body": "secret", "outcome": "ok",
        })
        assert event is not None and event.trace_id == trace_id
        assert event.attributes == {"http_method": "GET", "http_status": 200,
                                    "component": "gateway", "outcome": "ok"}
    finally:
        reset_trace_id(token)
