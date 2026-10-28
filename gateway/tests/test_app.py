import json
import os
import tempfile
from typing import AsyncIterator

import httpx
from fastapi.testclient import TestClient

from gateway.app import Settings, create_app, validate_origin

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
                    "  Keep server memory opt-in.  ",
                    "x" * 241,
                ]
            })}})
        return httpx.Response(404, json={})

    config = settings(helper_model="qwen3.5:0.8b", helper_max_input_chars=6000)
    with client_for(config, handler) as client:
        response = client.post(
            "/v1/helpers/project-memory-suggestions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={"facts": ["The project uses a local gateway.", "Keep server memory opt-in."]},
        )

    assert response.status_code == 200, response.text
    assert response.headers["cache-control"] == "no-store"
    assert response.json()["candidates"] == [
        "The project uses a local gateway.", "Keep server memory opt-in."
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


def test_memory_graph_api_is_disabled_by_default_and_requires_bearer_auth(tmp_path):
    config = settings(memory_graph_path=str(tmp_path / "graph.sqlite3"))
    with client_for(config) as client:
        assert client.get("/v1/memory/graph/nodes", params={"scope": "project", "scope_id": "alpha"}).status_code == 401
        response = client.get("/v1/memory/graph/nodes", params={"scope": "project", "scope_id": "alpha"},
                              headers={"Authorization": f"Bearer {API_KEY}"})
        assert response.status_code == 503


def test_memory_graph_api_creates_candidates_requires_review_and_filters_scope(tmp_path):
    config = settings(memory_graph_enabled=True, memory_graph_path=str(tmp_path / "graph.sqlite3"))
    auth = {"Authorization": f"Bearer {API_KEY}"}
    with client_for(config) as client:
        created = client.post("/v1/memory/graph/nodes", headers=auth, json={
            "content": "Orchid deployment uses a private cache", "scope": "project", "scope_id": "alpha",
            "source_kind": "message", "source_id": "msg-alpha-1",
            "source_text": "Original private source is not stored in the graph."
        })
        assert created.status_code == 201
        node = created.json()["node"]
        assert node["status"] == "candidate" and node["source_sha256"]
        assert "Original private source" not in created.text
        assert created.headers["cache-control"] == "no-store"
        assert client.get("/v1/memory/graph/nodes", params={"scope": "project", "scope_id": "alpha"},
                          headers=auth).json()["nodes"] == []
        search_body = {"query": "Orchid private cache", "scope": "project", "scope_id": "alpha"}
        assert client.post("/v1/memory/graph/search", headers=auth, json=search_body).json()["count"] == 0
        reviewed = client.post(f"/v1/memory/graph/nodes/{node['id']}/review", headers=auth, json={
            "scope": "project", "scope_id": "alpha", "status": "confirmed", "reason_code": "user_confirmed"
        })
        assert reviewed.status_code == 200 and reviewed.json()["node"]["status"] == "confirmed"
        assert client.post("/v1/memory/graph/search", headers=auth, json=search_body).json()["count"] == 1
        other = client.post("/v1/memory/graph/nodes", headers=auth, json={
            "content": "Orchid deployment uses a public cache", "scope": "project", "scope_id": "beta",
            "source_kind": "message", "source_id": "msg-beta-1", "status": "confirmed"
        })
        assert other.status_code == 400  # Client cannot bypass review by setting status on create.
        assert client.post("/v1/memory/graph/nodes", headers=auth, json={
            "content": "Orchid deployment uses a public cache", "scope": "project", "scope_id": "beta",
            "source_kind": "message", "source_id": "msg-beta-2"
        }).status_code == 201
        beta = client.get("/v1/memory/graph/nodes", params={"scope": "project", "scope_id": "beta", "statuses": "all"},
                          headers=auth).json()["nodes"]
        assert len(beta) == 1 and beta[0]["status"] == "candidate"
        assert client.post("/v1/memory/graph/search", headers=auth, json=search_body).json()["nodes"][0]["scope_id"] == "alpha"


def test_memory_graph_api_relation_delete_and_review_transitions_are_scope_safe(tmp_path):
    config = settings(memory_graph_enabled=True, memory_graph_path=str(tmp_path / "graph.sqlite3"))
    auth = {"Authorization": f"Bearer {API_KEY}"}
    with client_for(config) as client:
        def add(content, scope_id, source_id):
            response = client.post("/v1/memory/graph/nodes", headers=auth, json={
                "content": content, "scope": "project", "scope_id": scope_id,
                "source_kind": "message", "source_id": source_id
            })
            assert response.status_code == 201, response.text
            return response.json()["node"]["id"]
        root = add("Amber source root evidence", "alpha", "doc-alpha-root")
        derived = add("Amber derived summary", "alpha", "doc-alpha-derived")
        beta = add("Amber beta remains separate", "beta", "doc-beta")
        relation = client.post("/v1/memory/graph/relations", headers=auth, json={
            "scope": "project", "scope_id": "alpha", "source_id": root, "target_id": derived,
            "relation_type": "DERIVED_FROM", "evidence_source_kind": "document", "evidence_source_id": "doc-alpha-root"
        })
        assert relation.status_code == 200
        wrong_scope = client.post("/v1/memory/graph/relations", headers=auth, json={
            "scope": "project", "scope_id": "alpha", "source_id": root, "target_id": beta,
            "relation_type": "SUPPORTS", "evidence_source_kind": "message", "evidence_source_id": "wrong-scope"
        })
        assert wrong_scope.status_code == 400
        deleted = client.delete(f"/v1/memory/graph/nodes/{root}", headers=auth,
                                params={"scope": "project", "scope_id": "alpha"})
        assert deleted.status_code == 200 and set(deleted.json()["deleted_node_ids"]) == {root, derived}
        remaining = client.get("/v1/memory/graph/nodes", params={"scope": "project", "scope_id": "beta", "statuses": "all"},
                               headers=auth).json()["nodes"]
        assert [item["id"] for item in remaining] == [beta]
        with client:
            assert client.post(f"/v1/memory/graph/nodes/{beta}/review", headers=auth, json={
                "scope": "project", "scope_id": "beta", "status": "superseded", "reason_code": "bad"
            }).status_code == 400


def test_memory_graph_global_scope_requires_server_flag_and_per_request_opt_in(tmp_path):
    path = str(tmp_path / "graph.sqlite3")
    auth = {"Authorization": f"Bearer {API_KEY}"}
    with client_for(settings(memory_graph_enabled=True, memory_graph_path=path, global_memory_enabled=False)) as client:
        blocked = client.post("/v1/memory/graph/nodes", headers=auth, json={
            "content": "global note", "scope": "global", "scope_id": "global",
            "source_kind": "user_edit", "source_id": "owner-edit", "global_opt_in": True
        })
        assert blocked.status_code == 403
    with client_for(settings(memory_graph_enabled=True, memory_graph_path=path, global_memory_enabled=True)) as client:
        no_consent = client.post("/v1/memory/graph/nodes", headers=auth, json={
            "content": "global note", "scope": "global", "scope_id": "global",
            "source_kind": "user_edit", "source_id": "owner-edit"
        })
        assert no_consent.status_code == 403
        created = client.post("/v1/memory/graph/nodes", headers=auth, json={
            "content": "global note", "scope": "global", "scope_id": "global",
            "source_kind": "user_edit", "source_id": "owner-edit", "global_opt_in": True
        })
        assert created.status_code == 201
        assert client.post("/v1/memory/graph/search", headers=auth, json={
            "query": "global note", "scope": "global", "scope_id": "global", "global_opt_in": True
        }).status_code == 200


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


def test_validate_origin_canonicalizes_host_case_and_default_ports():
    assert validate_origin("HTTPS://DorpNay.GitHub.io:443/") == "https://dorpnay.github.io"
    assert validate_origin("http://LOCALHOST:80") == "http://localhost"
    assert validate_origin("https://[2001:DB8::1]:8443") == "https://[2001:db8::1]:8443"


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
