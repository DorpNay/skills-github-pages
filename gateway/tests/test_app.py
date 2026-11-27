import asyncio
import hashlib
import json
import os
import tempfile
import time
from typing import AsyncIterator

import httpx
from cryptography.fernet import Fernet
import pytest
from starlette.requests import Request
from fastapi.testclient import TestClient

from gateway.app import Settings, canonical_cache_key, create_app, validate_origin

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


def test_helper_model_route_is_disabled_by_default_and_requires_bearer_auth():
    payload = {"facts": ["The project uses a local gateway."]}
    with client_for(settings()) as client:
        assert client.post("/v1/helpers/project-memory-suggestions", json=payload).status_code == 401
        response = client.post(
            "/v1/helpers/project-memory-suggestions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json=payload,
        )
    assert response.status_code == 503
    assert "ALANDI_HELPER_MODEL" in response.json()["detail"]
    assert response.headers["cache-control"] == "no-store"


def test_helper_model_returns_bounded_deduplicated_candidates_and_unloads_model():
    calls = []

    def handler(request):
        if request.url.path == "/api/chat":
            body = json.loads(request.content)
            calls.append(body)
            return httpx.Response(200, json={"message": {"content": json.dumps({
                "candidates": [
                    "The project uses a local gateway.",
                    "The project uses a local gateway.",
                    "  Keep project notes local-first.  ",
                    "x" * 241,
                ]
            })}})
        return httpx.Response(404, json={})

    config = settings(helper_model="qwen3.5:0.8b", helper_max_input_chars=6000)
    with client_for(config, handler) as client:
        response = client.post(
            "/v1/helpers/project-memory-suggestions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"facts": ["The project uses a local gateway.", "Keep project notes local-first."]},
        )

    assert response.status_code == 200, response.text
    assert response.headers["cache-control"] == "no-store"
    assert response.json()["candidates"] == [
        "The project uses a local gateway.", "Keep project notes local-first."
    ]
    assert response.json()["source_fact_count"] == 2
    assert len(calls) == 1
    sent = calls[0]
    assert sent["model"] == "qwen3.5:0.8b"
    assert sent["stream"] is False
    assert sent["keep_alive"] == 0
    assert sent["options"] == {"temperature": 0, "num_ctx": 4096, "num_predict": 512}
    assert sent["format"]["properties"]["candidates"]["maxItems"] == 12
    assert sent["messages"][1]["content"].find("The project uses a local gateway.") >= 0


def test_helper_model_route_rejects_oversized_or_unknown_input_without_inference():
    upstream_calls = 0

    def handler(request):
        nonlocal upstream_calls
        if request.url.path == "/api/chat":
            upstream_calls += 1
        return httpx.Response(404, json={})

    config = settings(helper_model="qwen3.5:0.8b", helper_max_input_chars=512)
    with client_for(config, handler) as client:
        headers = {"Authorization": f"Bearer {API_KEY}"}
        assert client.post("/v1/helpers/project-memory-suggestions", headers=headers,
                           json={"facts": ["ok"], "model": "other-model"}).status_code == 400
        too_long = client.post("/v1/helpers/project-memory-suggestions", headers=headers,
                               json={"facts": ["x" * 600]})
        assert too_long.status_code == 413
        assert client.post("/v1/helpers/project-memory-suggestions", headers=headers,
                           json={"facts": ["   "]}).status_code == 400
    assert upstream_calls == 0


def test_helper_model_route_rejects_invalid_model_output():
    def handler(request):
        if request.url.path == "/api/chat":
            return httpx.Response(200, json={"message": {"content": "not-json"}})
        return httpx.Response(404, json={})

    with client_for(settings(helper_model="qwen3.5:0.8b"), handler) as client:
        response = client.post(
            "/v1/helpers/project-memory-suggestions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"facts": ["Keep the helper read-only."]},
        )
    assert response.status_code == 502
    assert "no memory was changed" in response.json()["detail"]

def test_helper_model_excludes_secret_like_facts_before_local_inference():
    calls = []

    def handler(request):
        if request.url.path == "/api/chat":
            calls.append(json.loads(request.content))
            return httpx.Response(200, json={"message": {"content": json.dumps({"candidates": ["A safe project fact.", "ALANDI_API_KEY=output-secret-value-12345"]})}})
        return httpx.Response(404, json={})

    config = settings(helper_model="qwen3.5:0.8b", helper_max_input_chars=6000)
    with client_for(config, handler) as client:
        response = client.post(
            "/v1/helpers/project-memory-suggestions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"facts": ["ALANDI_API_KEY=super-secret-value-123456", "The project uses a local gateway."]},
        )

    assert response.status_code == 200, response.text
    assert response.json()["skipped_secret_like_count"] == 1
    assert response.json()["source_fact_count"] == 1
    assert response.json()["candidates"] == ["A safe project fact."]
    assert len(calls) == 1
    sent = json.dumps(calls[0])
    assert "super-secret-value-123456" not in sent
    assert "The project uses a local gateway." in sent


def test_helper_model_rejects_all_secret_like_facts_without_inference():
    calls = 0

    def handler(request):
        nonlocal calls
        if request.url.path == "/api/chat":
            calls += 1
        return httpx.Response(404, json={})

    config = settings(helper_model="qwen3.5:0.8b", helper_max_input_chars=6000)
    with client_for(config, handler) as client:
        response = client.post(
            "/v1/helpers/project-memory-suggestions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"facts": ["password=very-secret-value-123456"]},
        )
    assert response.status_code == 400
    assert calls == 0


def test_retired_server_memory_graph_routes_are_not_registered():
    auth = {"Authorization": f"Bearer {API_KEY}"}
    with client_for(settings()) as client:
        route_methods = {
            (route.path, method)
            for route in client.app.routes
            for method in getattr(route, "methods", set())
        }
        assert ("/v1/memory/state/{conversation_id}", "GET") in route_methods
        assert ("/v1/memory/state/{conversation_id}", "DELETE") in route_methods
        assert not any(path.startswith("/v1/memory/graph") for path, _ in route_methods)
        assert client.get("/v1/memory/graph/nodes", params={"scope": "project", "scope_id": "alpha"}).status_code == 404
        assert client.post("/v1/memory/graph/nodes", headers=auth, json={}).status_code == 404
        assert client.post("/v1/memory/graph/search", headers=auth, json={}).status_code == 404
        assert client.post("/v1/memory/graph/relations", headers=auth, json={}).status_code == 404
        assert client.post("/v1/memory/graph/nodes/example/review", headers=auth, json={}).status_code == 404
        assert client.delete("/v1/memory/graph/nodes/example", headers=auth,
                             params={"scope": "project", "scope_id": "alpha"}).status_code == 404


def test_health_has_no_secret():
    with client_for() as client:
        response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "ollama": "reachable", "auth_configured": True}
    assert API_KEY not in response.text


def test_livez_is_process_only_and_does_not_probe_ollama():
    calls = []

    def handler(request):
        calls.append(request.url.path)
        return httpx.Response(503)

    with client_for(handler=handler) as client:
        response = client.get("/livez")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert response.headers["cache-control"] == "no-store"
    assert calls == []


def test_readyz_reports_unreachable_ollama_without_secret():
    def handler(request):
        if request.url.path == "/api/tags":
            return httpx.Response(503)
        return httpx.Response(404)

    with client_for(handler=handler) as client:
        response = client.get("/readyz")

    assert response.status_code == 503
    assert response.json() == {
        "status": "degraded", "ollama": "unreachable", "auth_configured": True
    }
    assert response.headers["cache-control"] == "no-store"
    assert API_KEY not in response.text


def test_healthz_remains_a_compatible_alias_for_readyz():
    with client_for() as client:
        ready = client.get("/readyz")
        legacy = client.get("/healthz")

    assert ready.status_code == legacy.status_code == 200
    assert ready.json() == legacy.json()
    assert legacy.headers["cache-control"] == "no-store"


def test_readyz_converts_upstream_timeout_to_503_without_secret():
    def handler(request):
        raise httpx.ReadTimeout("upstream timed out")

    with client_for(handler=handler) as client:
        response = client.get("/readyz")

    assert response.status_code == 503
    assert response.json()["status"] == "degraded"
    assert response.json()["ollama"] == "unreachable"
    assert API_KEY not in response.text


def test_healthz_preserves_503_readiness_behavior_when_ollama_is_down():
    def handler(request):
        return httpx.Response(503)

    with client_for(handler=handler) as client:
        response = client.get("/healthz")

    assert response.status_code == 503
    assert response.json()["status"] == "degraded"
    assert response.json()["ollama"] == "unreachable"
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


def test_settings_rejects_invalid_ollama_base_url_port(monkeypatch):
    monkeypatch.setenv("OLLAMA_BASE_URL", "http://127.0.0.1:99999")
    try:
        Settings.from_env()
    except ValueError as exc:
        assert "OLLAMA_BASE_URL" in str(exc)
    else:
        raise AssertionError("Invalid Ollama port should fail during configuration")


def test_settings_rejects_non_loopback_ollama_base_url(monkeypatch):
    for value in (
        "http://ollama.example:11434",
        "https://127.0.0.1:11434",
        "http://0.0.0.0:11434",
        "http://127.0.0.1:11435",
        "http://127.0.0.1:11434/extra",
    ):
        monkeypatch.setenv("OLLAMA_BASE_URL", value)
        try:
            Settings.from_env()
        except ValueError as exc:
            assert "loopback" in str(exc)
        else:
            raise AssertionError(f"Non-loopback Ollama URL accepted: {value}")


def test_settings_accepts_local_loopback_ollama_base_url(monkeypatch):
    monkeypatch.setenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    assert Settings.from_env().ollama_base_url == "http://127.0.0.1:11434"


def test_validate_origin_canonicalizes_host_case_and_default_ports():
    assert validate_origin("HTTPS://DorpNay.GitHub.io:443/") == "https://dorpnay.github.io"
    assert validate_origin("http://LOCALHOST:80") == "http://localhost"
    assert validate_origin("https://[2001:DB8::1]:8443") == "https://[2001:db8::1]:8443"


def test_oauth_redirect_origin_matches_canonicalized_cors_allowlist(monkeypatch):
    monkeypatch.setenv("OAUTH_ENABLED", "true")
    monkeypatch.setenv("OAUTH_ENCRYPTION_KEY", "test-encryption-key")
    monkeypatch.setenv("GOOGLE_DRIVE_CLIENT_ID", "test-client")
    monkeypatch.setenv("GOOGLE_DRIVE_CLIENT_SECRET", "test-secret")
    monkeypatch.setenv("GOOGLE_DRIVE_REDIRECT_URI", "https://example.com/oauth/callback")
    monkeypatch.setenv("OAUTH_SUCCESS_REDIRECT", "https://DORPNAY.GitHub.io:443/return")
    monkeypatch.setenv("ALANDI_CORS_ORIGINS", "https://dorpnay.github.io")

    config = Settings.from_env()
    assert config.cors_origins == ("https://dorpnay.github.io",)
    assert config.oauth_success_redirect == "https://DORPNAY.GitHub.io:443/return"


def test_validate_origin_rejects_invalid_ports():
    for origin in ("https://example.com:99999", "https://example.com:not-a-port"):
        try:
            validate_origin(origin)
        except ValueError:
            pass
        else:
            raise AssertionError(f"Invalid CORS origin accepted: {origin}")


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


def test_exact_cache_key_separates_project_specific_prompt_context():
    config = settings(cache_enabled=True)
    alpha = {"model": MODEL, "temperature": 0, "messages": [
        {"role": "system", "content": "Project Alpha private instruction."},
        {"role": "user", "content": "Summarize this project."},
    ]}
    beta = {"model": MODEL, "temperature": 0, "messages": [
        {"role": "system", "content": "Project Beta private instruction."},
        {"role": "user", "content": "Summarize this project."},
    ]}
    alpha_key = canonical_cache_key(config, alpha, method="POST", path="/v1/chat/completions")
    assert alpha_key == canonical_cache_key(config, alpha, method="POST", path="/v1/chat/completions")
    assert alpha_key != canonical_cache_key(config, beta, method="POST", path="/v1/chat/completions")


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


@pytest.mark.asyncio
async def test_chat_cancellation_before_upstream_response_releases_gateway_slot():
    class BlockingTransport(httpx.AsyncBaseTransport):
        def __init__(self):
            self.started = asyncio.Event()

        async def handle_async_request(self, request):
            self.started.set()
            await asyncio.Event().wait()
            raise AssertionError("cancelled transport unexpectedly returned")

    upstream = BlockingTransport()
    app = create_app(settings(max_inflight_requests=1), transport=upstream)
    endpoint = next(
        route.endpoint for route in app.routes
        if getattr(route, "path", None) == "/v1/chat/completions"
    )
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": "hello"}],
        "stream": False,
    }).encode("utf-8")
    received = False

    async def receive():
        nonlocal received
        if not received:
            received = True
            return {"type": "http.request", "body": body, "more_body": False}
        await asyncio.Event().wait()

    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": "POST",
        "scheme": "http",
        "path": "/v1/chat/completions",
        "raw_path": b"/v1/chat/completions",
        "query_string": b"",
        "root_path": "",
        "headers": [
            (b"content-type", b"application/json"),
            (b"content-length", str(len(body)).encode("ascii")),
        ],
        "server": ("test", 80),
        "client": ("test", 12345),
        "app": app,
    }

    async with app.router.lifespan_context(app):
        request = Request(scope, receive)
        task = asyncio.create_task(endpoint(request, authorization=f"Bearer {API_KEY}"))
        await asyncio.wait_for(upstream.started.wait(), timeout=1)
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task

        assert not app.state.semaphore.locked()
        await asyncio.wait_for(app.state.semaphore.acquire(), timeout=0.1)
        app.state.semaphore.release()


def test_invalid_bearer_token_is_never_echoed_in_api_error():
    submitted_secret = "client-submitted-secret-marker-987654321"
    with client_for() as client:
        response = client.get(
            "/v1/models",
            headers={"Authorization": f"Bearer {submitted_secret}"},
        )

    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    assert submitted_secret not in response.text
    assert API_KEY not in response.text


def test_health_probes_never_expose_configured_secrets():
    oauth_encryption_secret = "oauth-encryption-secret-marker-123"
    google_client_secret = "google-client-secret-marker-456"
    config = settings(
        oauth_encryption_key=oauth_encryption_secret,
        google_oauth_client_secret=google_client_secret,
    )
    with client_for(config) as client:
        live = client.get("/livez")
        ready = client.get("/readyz")
        legacy = client.get("/healthz")

    assert live.status_code == 200
    assert live.json() == {"status": "ok"}
    assert ready.status_code == legacy.status_code == 200
    assert ready.json() == legacy.json() == {
        "status": "ok", "ollama": "reachable", "auth_configured": True
    }
    for response in (live, ready, legacy):
        assert response.headers["cache-control"] == "no-store"
        for secret in (API_KEY, oauth_encryption_secret, google_client_secret):
            assert secret not in response.text
        assert "api_key" not in response.text.lower()
        assert "client_secret" not in response.text.lower()



def test_agent_run_api_is_off_by_default_and_requires_authentication():
    with client_for(settings()) as client:
        assert client.get("/v1/agent-runs/profiles").status_code == 401
        response = client.get(
            "/v1/agent-runs/profiles",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
    assert response.status_code == 503


def test_agent_run_profiles_expose_only_installed_allowlisted_models(tmp_path):
    helper_model = "qwen3.5:2b-q4_K_M"

    def handler(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": [
                {"name": MODEL},
                {"name": "not-allowlisted:latest"},
            ]})
        return httpx.Response(404, json={})

    config = settings(
        agent_runs_enabled=True,
        agent_runs_path=str(tmp_path / "agent-runs.sqlite3"),
        agent_runs_encryption_key=Fernet.generate_key().decode("ascii"),
        agent_runs_retention_seconds=3600,
        agent_runs_max_payload_bytes=256_000,
        agent_runs_max_prompt_chars=2000,
        agent_runs_max_output_tokens=128,
        agent_runs_max_output_bytes=4096,
        agent_runs_max_pending_runs=4,
        agent_runs_poll_interval_seconds=0.05,
        allowed_models=(MODEL, helper_model),
    )
    with client_for(config, handler) as client:
        response = client.get(
            "/v1/agent-runs/profiles",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
    assert response.status_code == 200
    assert response.json()["models"] == [MODEL]
    assert helper_model not in response.json()["models"]


def test_agent_run_profiles_fail_closed_when_ollama_model_catalog_is_unavailable(tmp_path):
    def handler(request):
        return httpx.Response(503, json={})

    config = settings(
        agent_runs_enabled=True,
        agent_runs_path=str(tmp_path / "agent-runs.sqlite3"),
        agent_runs_encryption_key=Fernet.generate_key().decode("ascii"),
        agent_runs_retention_seconds=3600,
        agent_runs_max_payload_bytes=256_000,
        agent_runs_max_prompt_chars=2000,
        agent_runs_max_output_tokens=128,
        agent_runs_max_output_bytes=4096,
        agent_runs_max_pending_runs=4,
        agent_runs_poll_interval_seconds=0.05,
    )
    with client_for(config, handler) as client:
        response = client.get(
            "/v1/agent-runs/profiles",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
    assert response.status_code == 503
    assert response.json()["detail"] == "Local model catalog is unavailable"


def test_agent_run_api_executes_durable_model_worker_and_returns_status(tmp_path):
    calls = []

    async def handler(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": [{"name": MODEL}]})
        if request.url.path != "/api/chat":
            return httpx.Response(404, json={})
        body = json.loads(request.content)
        calls.append(body)
        return httpx.Response(200, json={
            "message": {"role": "assistant", "content": "Persistent answer."},
            "done": True,
            "eval_count": 9,
        })

    config = settings(
        agent_runs_enabled=True,
        agent_runs_path=str(tmp_path / "agent-runs.sqlite3"),
        agent_runs_encryption_key=Fernet.generate_key().decode("ascii"),
        agent_runs_retention_seconds=3600,
        agent_runs_max_payload_bytes=256_000,
        agent_runs_max_prompt_chars=2000,
        agent_runs_max_output_tokens=128,
        agent_runs_max_output_bytes=4096,
        agent_runs_max_pending_runs=4,
        agent_runs_poll_interval_seconds=0.05,
    )
    headers = {"Authorization": f"Bearer {API_KEY}", "Idempotency-Key": "api-agent-1"}
    with client_for(config, handler) as client:
        profiles = client.get("/v1/agent-runs/profiles", headers=headers)
        assert profiles.status_code == 200
        assert profiles.json()["worker_concurrency"] == 1
        assert profiles.json()["models"] == [MODEL]
        assert profiles.json()["tools_enabled"] is False
        created = client.post(
            "/v1/agent-runs",
            headers=headers,
            json={
                "prompt": "Review the supplied patch.",
                "scope_kind": "project",
                "scope_id": "alpha",
                "profile_id": "reviewer",
            },
        )
        assert created.status_code == 202, created.text
        run_id = created.json()["run"]["run_id"]
        for _ in range(200):
            snapshot = client.get(f"/v1/agent-runs/{run_id}", headers=headers).json()
            if snapshot["run"]["state"] in {"succeeded", "failed"}:
                break
            time.sleep(0.01)
        assert snapshot["run"]["state"] == "succeeded"
        assert snapshot["output"] == "Persistent answer."
        assert snapshot["output_available"] is True
        events = client.get(f"/v1/agent-runs/{run_id}/events", headers=headers)
        assert events.status_code == 200
        assert events.json()["state"] == "succeeded"
        event_rows = events.json()["events"]
        assert [event["event_seq"] for event in event_rows] == sorted(event["event_seq"] for event in event_rows)
        assert events.json()["last_event_seq"] == snapshot["run"]["last_event_seq"]
        assert events.json()["next_after_event_seq"] == event_rows[-1]["event_seq"]
        resumed = client.get(f"/v1/agent-runs/{run_id}/events?after_event_seq=1", headers=headers)
        assert resumed.status_code == 200
        assert all(event["event_seq"] > 1 for event in resumed.json()["events"])
        legacy = client.get(f"/v1/agent-runs/{run_id}/events?after_event_id=1", headers=headers)
        assert legacy.status_code == 200
        assert all(event["event_id"] > 1 for event in legacy.json()["events"])
        ambiguous = client.get(f"/v1/agent-runs/{run_id}/events?after_event_id=1&after_event_seq=1", headers=headers)
        assert ambiguous.status_code == 400
        assert len(calls) == 1
        assert calls[0]["model"] == MODEL
        assert calls[0]["stream"] is False
        assert "tools" not in calls[0]

    raw_db = (tmp_path / "agent-runs.sqlite3").read_bytes()
    assert b"Review the supplied patch." not in raw_db
    assert b"Persistent answer." not in raw_db


def _research_evidence_payload():
    source_text = "Context before 🌱. The exact evidence sentence. Context after."
    quote = "The exact evidence sentence."
    start = source_text.index(quote)
    return {
        "scope": "conversation",
        "scope_id": "chat-evidence-1",
        "source_id": "trace-evidence-1-S1",
        "source_uri": "https://example.test/research-evidence",
        "source_text": source_text,
        "chunk_id": "S1",
        "start_offset": start,
        "end_offset": start + len(quote),
        "section": "Evidence fixture",
        "claim_text": "A claim explicitly linked to the captured quote.",
        "confidence": 0.75,
        "metadata": {"capture_kind": "tool_excerpt", "trace_id": "trace-evidence-1"},
    }


def test_rag_evidence_api_records_exact_quote_deduplicates_and_isolates_scope(tmp_path):
    config = settings(rag_enabled=True, rag_path=str(tmp_path / "rag.sqlite3"))
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = _research_evidence_payload()
    with client_for(config) as client:
        assert client.post("/v1/rag/evidence", json=payload).status_code == 401
        first = client.post("/v1/rag/evidence", headers=headers, json=payload)
        second = client.post("/v1/rag/evidence", headers=headers, json=payload)
        listing = client.get("/v1/rag/evidence", headers=headers,
                             params={"scope": "conversation", "scope_id": "chat-evidence-1"})
        isolated = client.get("/v1/rag/evidence", headers=headers,
                              params={"scope": "conversation", "scope_id": "another-chat"})
    assert first.status_code == second.status_code == 201
    assert first.json()["evidence_id"] == second.json()["evidence_id"]
    assert listing.status_code == isolated.status_code == 200
    records = listing.json()["evidence"]
    assert len(records) == 1
    assert records[0]["quote_text"] == "The exact evidence sentence."
    assert records[0]["source_sha256"] == hashlib.sha256(payload["source_text"].encode("utf-8")).hexdigest()
    assert records[0]["claim_text"] == payload["claim_text"]
    assert records[0]["metadata"] == payload["metadata"]
    assert isolated.json()["evidence"] == []



def test_rag_claim_and_contradiction_apis_are_scoped_idempotent_and_protect_sources(tmp_path):
    config = settings(rag_enabled=True, rag_path=str(tmp_path / "rag.sqlite3"))
    headers = {"Authorization": f"Bearer {API_KEY}"}
    first_source = _research_evidence_payload()
    second_source = {**first_source, "source_id": "trace-evidence-1-S2",
                     "source_uri": "https://example.test/research-evidence-2", "chunk_id": "S2"}
    with client_for(config) as client:
        assert client.post("/v1/rag/evidence/claims", json={}).status_code == 401
        source_a = client.post("/v1/rag/evidence", headers=headers, json=first_source)
        source_b = client.post("/v1/rag/evidence", headers=headers, json=second_source)
        evidence_a, evidence_b = source_a.json()["evidence_id"], source_b.json()["evidence_id"]
        common = {"scope": "conversation", "scope_id": "chat-evidence-1", "confidence": 0.9,
                  "reviewer_mode": "same-model", "reviewer_model": "test-model", "run_id": "trace-evidence-1"}
        claim_a_payload = {**common, "claim_id": "C1", "claim_text": "Source A reports 2025.",
            "assessment": "supported", "evidence_ids": [evidence_a], "relations": {evidence_a: "supports"},
            "rationale": "The exact excerpt supports the claim."}
        claim_b_payload = {**common, "claim_id": "C2", "claim_text": "Source B reports 2026.",
            "assessment": "supported", "evidence_ids": [evidence_b], "relations": {evidence_b: "supports"},
            "rationale": "The exact excerpt supports the claim."}
        claim_a = client.post("/v1/rag/evidence/claims", headers=headers, json=claim_a_payload)
        claim_a_repeat = client.post("/v1/rag/evidence/claims", headers=headers, json=claim_a_payload)
        claim_b = client.post("/v1/rag/evidence/claims", headers=headers, json=claim_b_payload)
        contradiction_payload = {**common, "contradiction_id": "X1",
            "claims": [{"claim_id": "C1", "text": claim_a_payload["claim_text"]},
                       {"claim_id": "C2", "text": claim_b_payload["claim_text"]}],
            "evidence_ids": [evidence_a, evidence_b], "kind": "temporal",
            "explanation": "The sources report different years."}
        contradiction = client.post("/v1/rag/evidence/contradictions", headers=headers, json=contradiction_payload)
        contradiction_repeat = client.post("/v1/rag/evidence/contradictions", headers=headers, json=contradiction_payload)
        wrong_scope = client.post("/v1/rag/evidence/claims", headers=headers,
            json={**claim_a_payload, "scope_id": "another-chat"})
        unknown_claim = client.post("/v1/rag/evidence/contradictions", headers=headers,
            json={**contradiction_payload, "claims": [{"claim_id": "C1", "text": "A."},
                                                       {"claim_id": "C99", "text": "Unknown."}]})
        listing = client.get("/v1/rag/evidence", headers=headers,
            params={"scope": "conversation", "scope_id": "chat-evidence-1"})
        blocked_delete = client.delete(f"/v1/rag/evidence/{evidence_a}", headers=headers,
            params={"scope": "conversation", "scope_id": "chat-evidence-1"})
    assert source_a.status_code == source_b.status_code == 201
    assert claim_a.status_code == claim_a_repeat.status_code == claim_b.status_code == 201
    assert claim_a.json()["evidence_id"] == claim_a_repeat.json()["evidence_id"]
    assert contradiction.status_code == contradiction_repeat.status_code == 201
    assert contradiction.json()["evidence_id"] == contradiction_repeat.json()["evidence_id"]
    assert wrong_scope.status_code == unknown_claim.status_code == 400
    assert blocked_delete.status_code == 409
    records = listing.json()["evidence"]
    assert {item["evidence_kind"] for item in records} == {"source_quote", "claim", "contradiction"}
    assert len(records) == 5



def test_rag_evidence_api_rejects_query_urls_and_invalid_spans(tmp_path):
    config = settings(rag_enabled=True, rag_path=str(tmp_path / "rag.sqlite3"))
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = _research_evidence_payload()
    with client_for(config) as client:
        query_url = client.post("/v1/rag/evidence", headers=headers,
            json={**payload, "source_uri": "https://example.test/research-evidence?token=must-not-echo"})
        invalid_span = client.post("/v1/rag/evidence", headers=headers,
            json={**payload, "start_offset": 0, "end_offset": len(payload["source_text"]) + 1})
    assert query_url.status_code == 400
    assert "must-not-echo" not in query_url.text
    assert invalid_span.status_code == 400


def test_rag_evidence_api_deletes_only_within_the_requested_scope(tmp_path):
    config = settings(rag_enabled=True, rag_path=str(tmp_path / "rag.sqlite3"))
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = _research_evidence_payload()
    with client_for(config) as client:
        created = client.post("/v1/rag/evidence", headers=headers, json=payload)
        evidence_id = created.json()["evidence_id"]
        wrong_scope = client.delete(f"/v1/rag/evidence/{evidence_id}", headers=headers,
            params={"scope": "conversation", "scope_id": "another-chat"})
        still_present = client.get("/v1/rag/evidence", headers=headers,
            params={"scope": "conversation", "scope_id": "chat-evidence-1"})
        deleted = client.delete(f"/v1/rag/evidence/{evidence_id}", headers=headers,
            params={"scope": "conversation", "scope_id": "chat-evidence-1"})
        absent = client.get("/v1/rag/evidence", headers=headers,
            params={"scope": "conversation", "scope_id": "chat-evidence-1"})
    assert created.status_code == 201
    assert wrong_scope.status_code == 404
    assert len(still_present.json()["evidence"]) == 1
    assert deleted.status_code == 200
    assert deleted.json()["status"] == "deleted"
    assert absent.json()["evidence"] == []


def test_rag_evidence_capability_is_explicit_and_disabled_by_default(tmp_path):
    enabled = settings(rag_enabled=True, rag_path=str(tmp_path / "rag.sqlite3"))
    headers = {"Authorization": f"Bearer {API_KEY}"}
    with client_for(enabled) as client:
        capabilities = client.get("/v1/capabilities", headers=headers)
    with client_for(settings()) as client:
        disabled = client.get("/v1/capabilities", headers=headers)
        unavailable = client.get("/v1/rag/evidence", headers=headers,
            params={"scope": "conversation", "scope_id": "chat-evidence-1"})
    assert capabilities.status_code == disabled.status_code == 200
    assert capabilities.json()["rag"] == {"enabled": True, "evidence_ledger": True}
    assert disabled.json()["rag"] == {"enabled": False, "evidence_ledger": False}
    assert unavailable.status_code == 503




def test_agent_run_api_exposes_and_executes_team_review_strategy(tmp_path):
    calls = []
    async def handler(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": [{"name": MODEL}]})
        if request.url.path != "/api/chat":
            return httpx.Response(404, json={})
        body = json.loads(request.content)
        calls.append(body)
        user = body["messages"][1]["content"]
        answer = (
            "RESEARCH REPORT: facts." if "Assignment: independent research analyst" in user else
            "REVIEW REPORT: risks." if "Assignment: independent reviewer" in user else
            "API TEAM ANSWER."
        )
        return httpx.Response(200, json={
            "message": {"role": "assistant", "content": answer}, "done": True, "eval_count": 7,
        })

    config = settings(
        agent_runs_enabled=True, agent_runs_path=str(tmp_path / "agent-runs.sqlite3"),
        agent_runs_encryption_key=Fernet.generate_key().decode("ascii"),
        agent_runs_retention_seconds=3600, agent_runs_max_payload_bytes=256_000,
        agent_runs_max_prompt_chars=2000, agent_runs_max_output_tokens=128,
        agent_runs_max_output_bytes=4096, agent_runs_max_pending_runs=4,
        agent_runs_poll_interval_seconds=0.05,
    )
    headers = {"Authorization": f"Bearer {API_KEY}", "Idempotency-Key": "api-team-review-1"}
    with client_for(config, handler) as client:
        profiles = client.get("/v1/agent-runs/profiles", headers=headers)
        assert profiles.status_code == 200
        assert profiles.json()["worker_concurrency"] == 1
        strategies = {item["id"]: item for item in profiles.json()["strategies"]}
        assert strategies["team_review"]["task_count"] == 3
        assert strategies["team_review"]["parallel_inference"] is False
        assert strategies["team_review"]["tools"] == []
        created = client.post("/v1/agent-runs", headers=headers, json={
            "prompt": "PRIVATE API TEAM TASK", "scope_kind": "project", "scope_id": "alpha",
            "profile_id": "general", "strategy_id": "team_review",
        })
        assert created.status_code == 202, created.text
        run_id = created.json()["run"]["run_id"]
        for _ in range(300):
            snapshot = client.get(f"/v1/agent-runs/{run_id}", headers=headers).json()
            if snapshot["run"]["state"] in {"succeeded", "failed"}:
                break
            time.sleep(0.01)
        assert snapshot["run"]["state"] == "succeeded"
        assert snapshot["output"] == "API TEAM ANSWER."
        assert [task["task_key"] for task in snapshot["tasks"]] == ["researcher", "reviewer", "synthesis"]
        assert len(calls) == 3
        invalid = client.post("/v1/agent-runs",
            headers={**headers, "Idempotency-Key": "api-team-invalid-1"},
            json={"prompt": "must not run", "scope_kind": "project", "scope_id": "alpha",
                  "strategy_id": "pretend-50-agents"})
        assert invalid.status_code == 400
    raw_db = (tmp_path / "agent-runs.sqlite3").read_bytes()
    assert b"PRIVATE API TEAM TASK" not in raw_db
    assert b"API TEAM ANSWER." not in raw_db


def test_agent_run_api_accepts_bounded_context_and_rejects_unknown_fields(tmp_path):
    calls = []
    async def handler(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": [{"name": MODEL}]})
        calls.append(json.loads(request.content))
        return httpx.Response(200, json={"message": {"role": "assistant", "content": "Context API answer."}, "done": True, "eval_count": 6})
    config = settings(agent_runs_enabled=True, agent_runs_path=str(tmp_path / "agent-runs.sqlite3"),
        agent_runs_encryption_key=Fernet.generate_key().decode("ascii"), agent_runs_retention_seconds=3600,
        agent_runs_max_payload_bytes=256_000, agent_runs_max_prompt_chars=2000,
        agent_runs_max_output_tokens=128, agent_runs_max_output_bytes=4096,
        agent_runs_max_pending_runs=4, agent_runs_poll_interval_seconds=0.05)
    headers = {"Authorization": f"Bearer {API_KEY}", "Idempotency-Key": "api-context-1"}
    packet = {"version": 1,
        "messages": [{"id": "history-1", "role": "user", "content": "Keep this context."}],
        "sources": [{"id": "attachment-1", "kind": "attachment_text", "scope": "chat",
            "inclusion_reason": "attached_by_user", "content": "Selected file evidence."}]}
    with client_for(config, handler) as client:
        body = {"prompt": "Review context.", "scope_kind": "conversation",
            "scope_id": "chat-context-api", "context_packet": packet}
        created = client.post("/v1/agent-runs", headers=headers, json=body)
        assert created.status_code == 202, created.text
        run_id = created.json()["run"]["run_id"]
        for _ in range(200):
            snapshot = client.get(f"/v1/agent-runs/{run_id}", headers=headers).json()
            if snapshot["run"]["state"] in {"succeeded", "failed"}:
                break
            time.sleep(0.01)
        assert snapshot["run"]["state"] == "succeeded"
        assert len(calls) == 1
        assert "Keep this context." in calls[0]["messages"][1]["content"]
        assert "Selected file evidence." in calls[0]["messages"][1]["content"]
        replay = client.post("/v1/agent-runs", headers=headers, json=body)
        assert replay.status_code == 202
        assert replay.json()["run"]["run_id"] == run_id
        changed = {**packet, "sources": [{**packet["sources"][0], "content": "Changed evidence."}]}
        conflict = client.post("/v1/agent-runs", headers=headers, json={**body, "context_packet": changed})
        assert conflict.status_code == 409
        invalid = client.post("/v1/agent-runs", headers={**headers, "Idempotency-Key": "api-context-extra-1"},
            json={**body, "unexpected": "must not be ignored"})
        assert invalid.status_code == 400
    raw_db = (tmp_path / "agent-runs.sqlite3").read_bytes()
    assert b"Selected file evidence." not in raw_db
    assert b"Keep this context." not in raw_db
