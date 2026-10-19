import json
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
                  model_context_length_tokens=4096)
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
