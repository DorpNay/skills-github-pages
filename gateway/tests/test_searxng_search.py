import json

import httpx
from fastapi.testclient import TestClient

from gateway.app import Settings, create_app, validate_fixed_service_base_url

API_KEY = "s" * 64


def config(**overrides):
    values = dict(
        api_key=API_KEY,
        ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",),
        cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False,
    )
    values.update(overrides)
    return Settings(**values)


def app_client(settings, handler):
    return TestClient(create_app(settings, transport=httpx.MockTransport(handler)))


def test_searxng_is_disabled_by_default_and_requires_authentication():
    def handler(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": []})
        return httpx.Response(200, json={"results": []})

    with app_client(config(), handler) as client:
        assert client.get("/v1/search/web", params={"q": "safe search"}).status_code == 401
        response = client.get("/v1/search/web", params={"q": "safe search"},
                              headers={"Authorization": f"Bearer {API_KEY}"})
        assert response.status_code == 503
        assert response.headers["cache-control"] == "no-store"


def test_searxng_normalizes_deduplicates_and_rejects_non_https_results():
    requested = []

    def handler(request):
        requested.append(request)
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": []})
        assert request.url == httpx.URL(
            "http://searxng.internal:8080/search?q=zero+trust&format=json&categories=general&safesearch=1"
        )
        return httpx.Response(200, json={"results": [
            {"title": "First result", "url": "https://docs.example.test/guide", "content": "Evidence A",
             "engines": ["engine-a", "engine-b"], "publishedDate": "2026-10-01"},
            {"title": "Duplicate", "url": "https://docs.example.test/guide", "content": "duplicate"},
            {"title": "Insecure", "url": "http://insecure.example.test/page", "content": "must not pass"},
            {"title": "Credential URL", "url": "https://user:pass@example.test/private", "content": "must not pass"},
            {"title": "Second result", "url": "https://research.example.test/paper", "content": "Evidence B"},
        ]})

    cfg = config(searxng_enabled=True, searxng_base_url="http://searxng.internal:8080",
                 searxng_max_results=3)
    with app_client(cfg, handler) as client:
        response = client.get("/v1/search/web", params={"q": "zero trust", "limit": 3},
                              headers={"Authorization": f"Bearer {API_KEY}"})
    assert response.status_code == 200, response.text
    assert response.headers["cache-control"] == "no-store"
    payload = response.json()
    assert payload["provider"] == "searxng"
    assert payload["count"] == 2
    assert payload["results"][0] == {
        "title": "First result",
        "url": "https://docs.example.test/guide",
        "snippet": "Evidence A",
        "engines": ["engine-a", "engine-b"],
        "published_at": "2026-10-01",
    }
    assert all(item["url"].startswith("https://") for item in payload["results"])
    assert len([item for item in requested if item.url.path == "/search"]) == 1


def test_searxng_query_and_result_limit_are_bounded():
    def handler(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": []})
        raise AssertionError("invalid request must not reach SearXNG")

    cfg = config(searxng_enabled=True, searxng_base_url="http://searxng.internal:8080",
                 searxng_max_results=4)
    auth = {"Authorization": f"Bearer {API_KEY}"}
    with app_client(cfg, handler) as client:
        assert client.get("/v1/search/web", params={"q": "   "}, headers=auth).status_code == 400
        assert client.get("/v1/search/web", params={"q": "x" * 301}, headers=auth).status_code == 400
        assert client.get("/v1/search/web", params={"q": "bounded", "limit": 5}, headers=auth).status_code == 400
        assert client.get("/v1/search/web", params={"q": "bounded", "limit": 0}, headers=auth).status_code == 400


def test_fixed_service_url_rejects_credentials_query_and_fragments():
    assert validate_fixed_service_base_url("http://searxng.internal:8080/", "S") == "http://searxng.internal:8080"
    for value in (
        "http://user:pass@searxng.internal:8080",
        "http://searxng.internal:8080/?q=untrusted",
        "https://searxng.internal/#fragment",
        "file:///etc/passwd",
    ):
        try:
            validate_fixed_service_base_url(value, "S")
        except ValueError:
            pass
        else:
            raise AssertionError(f"Expected fixed service URL to be rejected: {value}")


def test_searxng_environment_flag_requires_fixed_base_url(monkeypatch):
    monkeypatch.setenv("ALANDI_SEARXNG_ENABLED", "true")
    monkeypatch.delenv("ALANDI_SEARXNG_BASE_URL", raising=False)
    try:
        Settings.from_env()
    except ValueError as exc:
        assert "ALANDI_SEARXNG_BASE_URL" in str(exc)
    else:
        raise AssertionError("Enabling SearXNG without a fixed base URL must fail closed")
