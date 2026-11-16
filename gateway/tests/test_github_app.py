from __future__ import annotations

import base64
import json
from datetime import datetime, timedelta, timezone

import httpx
import pytest
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from fastapi.testclient import TestClient

from gateway.app import Settings, create_app

API_KEY = "a" * 64
REPOSITORY = "DorpNay/skills-github-pages"
INSTALLATION_TOKEN = "ghs_12345.eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0In0"


def _private_key() -> tuple[str, rsa.RSAPrivateKey]:
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    pem = key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    ).decode("utf-8")
    return pem, key


def _settings(private_key: str, **overrides) -> Settings:
    values = dict(
        api_key=API_KEY,
        ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",),
        cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False,
        github_app_enabled=True,
        github_app_id="12345",
        github_app_installation_id="67890",
        github_app_private_key=private_key,
        github_app_allowed_repositories=(REPOSITORY,),
    )
    values.update(overrides)
    return Settings(**values)


def _verify_app_jwt(request: httpx.Request, key: rsa.RSAPrivateKey) -> None:
    token = request.headers["Authorization"].removeprefix("Bearer ")
    header, payload, signature = token.split(".")
    def decode(value: str) -> bytes:
        return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))
    header_data = json.loads(decode(header))
    payload_data = json.loads(decode(payload))
    assert header_data == {"alg": "RS256", "typ": "JWT"}
    assert payload_data["iss"] == "12345"
    assert payload_data["exp"] - payload_data["iat"] == 600
    key.public_key().verify(
        decode(signature),
        f"{header}.{payload}".encode("ascii"),
        padding.PKCS1v15(),
        hashes.SHA256(),
    )


def test_github_app_connector_is_scoped_read_only_and_reuses_short_lived_token():
    private_key, key = _private_key()
    calls: list[tuple[str, str]] = []
    token_mints = 0

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal token_mints
        assert request.url.host == "api.github.com"
        calls.append((request.method, request.url.path))
        if request.url.path == "/app/installations/67890/access_tokens":
            token_mints += 1
            _verify_app_jwt(request, key)
            assert json.loads(request.content) == {
                "repositories": ["skills-github-pages"],
                "permissions": {"contents": "read", "metadata": "read"},
            }
            return httpx.Response(201, json={
                "token": INSTALLATION_TOKEN,
                "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
                "permissions": {"contents": "read"},
                "repositories": [{"full_name": REPOSITORY}],
            })
        if request.url.path == "/installation/repositories":
            assert request.headers["Authorization"] == f"Bearer {INSTALLATION_TOKEN}"
            return httpx.Response(200, json={"repositories": [{
                "full_name": REPOSITORY, "private": True, "default_branch": "main",
            }]})
        if request.url.path == f"/repos/{REPOSITORY}/contents":
            return httpx.Response(200, json=[
                {"name": "README.md", "path": "README.md", "type": "file", "size": 5},
                {"name": "gateway", "path": "gateway", "type": "dir", "size": 0},
            ])
        if request.url.path == f"/repos/{REPOSITORY}/commits/main":
            return httpx.Response(200, json={"commit": {"tree": {"sha": "a" * 40}}})
        if request.url.path == f"/repos/{REPOSITORY}/git/trees/{'a' * 40}":
            return httpx.Response(200, json={"truncated": False, "tree": [
                {"path": "README.md", "type": "blob", "size": 5},
                {"path": "gateway", "type": "tree"},
            ]})
        if request.url.path == f"/repos/{REPOSITORY}/contents/README.md":
            return httpx.Response(200, json={
                "type": "file", "path": "README.md", "size": 5,
                "encoding": "base64", "content": base64.b64encode(b"hello").decode("ascii"),
            })
        if request.method == "DELETE" and request.url.path == "/installation/token":
            assert request.headers["Authorization"] == f"Bearer {INSTALLATION_TOKEN}"
            return httpx.Response(204)
        return httpx.Response(404, json={"message": "not found"})

    with TestClient(create_app(_settings(private_key), transport=httpx.MockTransport(handler))) as client:
        headers = {"Authorization": f"Bearer {API_KEY}"}
        status = client.get("/v1/connectors/github/status", headers=headers)
        assert status.status_code == 200, status.text
        assert status.json()["connected"] is True
        assert status.json()["permissions"] == ["contents:read", "metadata:read"]
        assert INSTALLATION_TOKEN not in status.text

        directory = client.get(
            "/v1/connectors/github/repositories/DorpNay/skills-github-pages/contents",
            headers=headers,
        )
        assert directory.status_code == 200, directory.text
        assert directory.json()["kind"] == "directory"
        assert [item["name"] for item in directory.json()["entries"]] == ["README.md", "gateway"]

        tree = client.get(
            "/v1/connectors/github/repositories/DorpNay/skills-github-pages/tree?ref=main",
            headers=headers,
        )
        assert tree.status_code == 200, tree.text
        assert [item["path"] for item in tree.json()["entries"]] == ["README.md", "gateway"]

        content = client.get(
            "/v1/connectors/github/repositories/DorpNay/skills-github-pages/contents",
            params={"path": "README.md", "ref": "main"},
            headers=headers,
        )
        assert content.status_code == 200, content.text
        assert content.json()["content"] == "hello"
        assert content.headers["cache-control"] == "no-store"

        revoked = client.post("/v1/connectors/github/revoke-token", headers=headers)
        assert revoked.status_code == 200, revoked.text
        assert revoked.json()["token_revoked"] is True
        assert revoked.json()["installation_uninstall_required"] is True

    assert token_mints == 1
    assert all(method in {"GET", "POST", "DELETE"} for method, _ in calls)


def test_github_app_connector_rejects_unlisted_repositories_and_traversal():
    private_key, _ = _private_key()
    calls = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(request.url.path)
        return httpx.Response(404, json={})

    with TestClient(create_app(_settings(private_key), transport=httpx.MockTransport(handler))) as client:
        headers = {"Authorization": f"Bearer {API_KEY}"}
        unlisted = client.get(
            "/v1/connectors/github/repositories/other/private-repo/contents",
            headers=headers,
        )
        traversal = client.get(
            "/v1/connectors/github/repositories/DorpNay/skills-github-pages/contents",
            params={"path": "../secrets"},
            headers=headers,
        )
    assert unlisted.status_code == 403
    assert traversal.status_code == 400
    assert calls == []


def test_github_app_connector_rejects_write_permissions_and_reports_degraded_status():
    private_key, _ = _private_key()

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/app/installations/67890/access_tokens":
            return httpx.Response(201, json={
                "token": INSTALLATION_TOKEN,
                "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
                "permissions": {"contents": "write", "metadata": "read"},
                "repositories": [{"full_name": REPOSITORY}],
            })
        return httpx.Response(404, json={})

    with TestClient(create_app(_settings(private_key), transport=httpx.MockTransport(handler))) as client:
        response = client.get(
            "/v1/connectors/github/status",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
    assert response.status_code == 200
    assert response.json()["connected"] is False
    assert response.json()["state"] == "permission_denied"


def test_github_app_status_is_explicitly_not_configured_by_default():
    config = Settings(
        api_key=API_KEY,
        ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",),
        cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False,
    )
    with TestClient(create_app(config, transport=httpx.MockTransport(lambda request: httpx.Response(404)))) as client:
        assert client.get("/v1/connectors/github/status").status_code == 401
        response = client.get(
            "/v1/connectors/github/status",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
    assert response.status_code == 200
    assert response.json() == {
        "provider": "github_app", "configured": False, "connected": False,
        "state": "not_configured", "permissions": [], "repositories": [],
    }


def test_github_app_environment_requires_private_key_and_single_owner(monkeypatch):
    private_key, _ = _private_key()
    monkeypatch.setenv("GITHUB_APP_ENABLED", "true")
    monkeypatch.setenv("GITHUB_APP_ID", "12345")
    monkeypatch.setenv("GITHUB_APP_INSTALLATION_ID", "67890")
    monkeypatch.setenv("GITHUB_APP_PRIVATE_KEY", private_key.replace("\n", "\\n"))
    monkeypatch.setenv("GITHUB_APP_ALLOWED_REPOSITORIES", REPOSITORY)
    config = Settings.from_env()
    assert config.github_app_enabled is True
    assert config.github_app_allowed_repositories == (REPOSITORY,)
    assert private_key not in repr(config)

    monkeypatch.setenv("GITHUB_APP_ALLOWED_REPOSITORIES", "DorpNay/one,OtherOrg/two")
    with pytest.raises(ValueError, match="one GitHub account"):
        Settings.from_env()
