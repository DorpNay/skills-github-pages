import hashlib
import json
import sqlite3
import time

import pytest
from cryptography.fernet import Fernet

from gateway.kv_budget import analyze_runtime
from gateway.memory.delta_sync import (
    DeltaMemoryStore, DeltaSyncError, RevisionConflict, apply_patch, compute_patch,
)
from gateway.rag.lazy_graph_rag import LazyGraphRAG
from gateway.routing import IntentRouter, normalize_text
from gateway.security.oauth_vault import OAuthVault, OAuthVaultError


def test_router_short_circuits_only_exact_low_risk_templates():
    router = IntentRouter()
    decision = router.classify(" ПРИВЕТ!!! ")
    assert decision.intent == "greeting"
    assert decision.confidence == 1.0
    assert not decision.requires_verification
    assert router.response_for({"model": "local:test", "messages": [{"role": "user", "content": "привет"}]})["choices"][0]["message"]["content"]
    assert router.response_for({"model": "local:test", "messages": [{"role": "user", "content": "спасибо, переведи это"}]}) is None
    assert router.response_for({"model": "local:test", "stream": True, "messages": [{"role": "user", "content": "привет"}]}) is None
    assert router.response_for({"model": "local:test", "tools": [{"type": "function"}], "messages": [{"role": "user", "content": "привет"}]}) is None
    assert router.response_for({"model": "local:test", "messages": [{"role": "user", "content": "привет"}, {"role": "assistant", "content": "да"} , {"role": "user", "content": "спасибо"}]}) is None


def test_router_does_not_claim_keyword_hints_are_verified():
    decision = IntentRouter().classify("найди официальную документацию")
    assert decision.intent == "tool_call"
    assert decision.requires_verification
    assert decision.confidence < 0.85
    assert normalize_text("Что такое RAG?") == "что такое rag"


def test_runtime_inventory_never_claims_to_measure_or_evict_kv_cache():
    result = analyze_runtime({"models": [{"name": "qwen:4b", "size": 2 * 1024**3, "size_vram": 0}]}, 6144)
    assert result["resident_model_mb_reported_by_ollama"] == 2048.0
    assert result["kv_cache_usage_mb"] is None
    assert result["kv_cache_api_supported"] is False
    assert result["automatic_eviction_performed"] is False
    assert "qwen:4b" in result["reported_loaded_models"][0]["name"]


def test_runtime_budget_advises_without_automatic_unload():
    result = analyze_runtime({"models": [{"model": "large", "size": 7 * 1024**3}]}, 6144)
    assert result["resident_model_footprint_over_budget"]
    assert result["automatic_eviction_performed"] is False


def test_json_delta_roundtrip_and_size_reduction():
    old = {"facts": [{"id": "f1", "text": "Python"}], "decisions": [], "questions": [], "notes": [], "summary": ""}
    new = {"facts": [{"id": "f1", "text": "Python"}, {"id": "f2", "text": "Use SQLite"}],
           "decisions": [{"id": "d1", "text": "Bounded concurrency"}], "questions": [], "notes": [], "summary": ""}
    patch = compute_patch(old, new)
    assert apply_patch(old, patch) == new
    assert len(json.dumps(patch)) < len(json.dumps(new))


def test_patch_rejects_root_and_out_of_scope_mutations():
    state = {"facts": [], "decisions": [], "questions": [], "notes": [], "summary": ""}
    with pytest.raises(DeltaSyncError):
        apply_patch(state, [{"op": "replace", "path": "", "value": {}}])
    with pytest.raises(DeltaSyncError):
        apply_patch(state, [{"op": "add", "path": "/profile/email", "value": "private"}])
    with pytest.raises(DeltaSyncError):
        apply_patch(state, [{"op": "copy", "from": "/facts", "path": "/notes"}])
    with pytest.raises(DeltaSyncError):
        apply_patch(state, [{"op": "add", "path": "/facts/~2", "value": "bad escape"}])


def test_delta_store_revision_is_atomic_and_rejects_replay(tmp_path):
    store = DeltaMemoryStore(tmp_path / "memory.sqlite3")
    store.initialize()
    initial = store.get_state("chat-1")
    assert initial["revision"] == 0
    patch = [{"op": "add", "path": "/facts/-", "value": {"id": "1", "text": "fact"}}]
    result = store.sync_delta("chat-1", 0, patch)
    assert result["revision"] == 1
    assert store.get_state("chat-1")["state"]["facts"][0]["id"] == "1"
    with pytest.raises(RevisionConflict):
        store.sync_delta("chat-1", 0, patch)
    with pytest.raises(DeltaSyncError):
        store.sync_delta("../other", 0, patch)
    assert store.get_state("chat-1")["revision"] == 1


def test_rag_retrieval_preserves_citations_and_isolates_scopes(tmp_path):
    rag = LazyGraphRAG(tmp_path / "rag.sqlite3")
    rag.initialize()
    inserted = rag.ingest_document(
        "doc-a", "https://example.test/architecture", [
            {"chunk_id": "chunk-1", "content": "SQLite WAL mode helps concurrent memory writes.", "page_number": 2},
            {"chunk_id": "chunk-2", "content": "The gateway uses bounded concurrency and SQLite memory writes.", "page_number": 3},
        ], scope="project", scope_id="alandi"
    )
    rag.ingest_document(
        "doc-b", "https://example.test/other", [
            {"chunk_id": "secret-1", "content": "SQLite memory writes for a different private project.", "page_number": 1},
        ], scope="project", scope_id="other-project"
    )
    assert inserted == 2
    results = rag.retrieve("SQLite memory writes", scope="project", scope_id="alandi", top_k=5)
    assert results
    assert all(item["scope_id"] == "alandi" for item in results)
    assert all(item["source_uri"].startswith("https://example.test/architecture") for item in results)
    assert all(item["page_number"] in {2, 3} for item in results)
    assert any("fts5" in item["retrieval_path"] for item in results)
    assert rag.retrieve("SQLite memory writes", scope="project", scope_id="no-such-project") == []


def test_rag_fts_query_cannot_inject_search_operators():
    from gateway.rag.lazy_graph_rag import safe_fts_query
    expression = safe_fts_query('" OR * MATCH NEAR')
    assert expression
    assert "MATCH" not in expression
    assert "NEAR" not in expression


def test_oauth_vault_encrypts_tokens_and_consumes_pkce_state_once(tmp_path):
    key = OAuthVault.generate_key()
    path = tmp_path / "oauth.sqlite3"
    vault = OAuthVault(path, key)
    vault.initialize()
    transaction = vault.begin_pkce()
    verifier = vault.consume_pkce(transaction["state"])
    assert len(verifier) >= 43
    with pytest.raises(OAuthVaultError):
        vault.consume_pkce(transaction["state"])
    vault.save_tokens("google_drive", access_token="access-secret-example",
                      refresh_token="refresh-secret-example", expires_in=3600,
                      scopes=["https://www.googleapis.com/auth/drive.file"])
    raw_db = path.read_bytes()
    assert b"access-secret-example" not in raw_db
    assert b"refresh-secret-example" not in raw_db
    loaded = vault.load_tokens("google_drive")
    assert loaded["access_token"] == "access-secret-example"
    assert loaded["refresh_token"] == "refresh-secret-example"
    vault.delete_tokens("google_drive")
    assert vault.load_tokens("google_drive") is None


def test_oauth_vault_fails_closed_for_invalid_key(tmp_path):
    with pytest.raises(OAuthVaultError):
        OAuthVault(tmp_path / "oauth.sqlite3", "not-a-fernet-key")



def test_gateway_routes_feature_flags_and_memory_api_are_opt_in(tmp_path):
    from fastapi.testclient import TestClient
    import httpx
    from gateway.app import Settings, create_app

    key = "z" * 64
    config = Settings(api_key=key, ollama_base_url="http://ollama.test:11434",
                      allowed_models=("qwen3.5:4b",), cors_origins=("https://dorpnay.github.io",),
                      cache_enabled=False)
    def handler(request):
        if request.url.path == "/api/ps":
            return httpx.Response(200, json={"models": []})
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": [{"name": "qwen3.5:4b"}]})
        if request.url.path == "/v1/chat/completions":
            return httpx.Response(200, json={"model": "qwen3.5:4b", "choices": [{"message": {"role": "assistant", "content": "upstream"}}]})
        return httpx.Response(404, json={})
    with TestClient(create_app(config, transport=httpx.MockTransport(handler))) as client:
        auth = {"Authorization": f"Bearer {key}"}
        assert client.get("/v1/memory/state/chat-1", headers=auth).status_code == 503
        assert client.post("/v1/rag/retrieve", headers=auth, json={"query": "hello", "scope": "project", "scope_id": "x"}).status_code == 503
        assert client.get("/admin/runtime", headers=auth).json()["kv_cache_usage_mb"] is None


def test_gateway_opt_in_memory_rag_and_exact_template_router(tmp_path):
    from fastapi.testclient import TestClient
    import httpx
    from gateway.app import Settings, create_app

    key = "y" * 64
    config = Settings(api_key=key, ollama_base_url="http://ollama.test:11434",
                      allowed_models=("qwen3.5:4b",), cors_origins=("https://dorpnay.github.io",),
                      cache_enabled=False, fast_routing_enabled=True, memory_sync_enabled=True,
                      memory_path=str(tmp_path / "memory.sqlite3"), rag_enabled=True,
                      rag_path=str(tmp_path / "rag.sqlite3"))
    def handler(request):
        if request.url.path == "/api/ps":
            return httpx.Response(200, json={"models": []})
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": [{"name": "qwen3.5:4b"}]})
        if request.url.path == "/v1/chat/completions":
            return httpx.Response(200, json={"model": "qwen3.5:4b", "choices": [{"message": {"role": "assistant", "content": "upstream"}}]})
        return httpx.Response(404, json={})
    with TestClient(create_app(config, transport=httpx.MockTransport(handler))) as client:
        auth = {"Authorization": f"Bearer {key}"}
        routed = client.post("/v1/chat/completions", headers=auth,
            json={"model": "qwen3.5:4b", "messages": [{"role": "user", "content": "привет"}]})
        assert routed.status_code == 200
        assert routed.headers["x-alandi-route"] == "exact_template"
        assert "upstream" not in routed.text

        state = client.get("/v1/memory/state/chat-1", headers=auth)
        assert state.status_code == 200 and state.json()["revision"] == 0
        delta = client.post("/v1/memory/delta", headers=auth, json={
            "conversation_id": "chat-1", "base_revision": 0,
            "patch": [{"op": "add", "path": "/facts/-", "value": {"id": "f1", "text": "aLandi"}}]
        })
        assert delta.status_code == 200 and delta.json()["revision"] == 1
        stale = client.post("/v1/memory/delta", headers=auth, json={
            "conversation_id": "chat-1", "base_revision": 0,
            "patch": [{"op": "add", "path": "/facts/-", "value": {"id": "f2", "text": "stale"}}]
        })
        assert stale.status_code == 409
        indexed = client.post("/v1/rag/ingest", headers=auth, json={
            "document_id": "doc-1", "source_uri": "https://example.test/page",
            "scope": "project", "scope_id": "alandi",
            "chunks": [{"chunk_id": "c1", "content": "aLandi gateway uses bounded concurrency", "page_number": 1}]
        })
        assert indexed.status_code == 200 and indexed.json()["chunks"] == 1
        retrieval = client.post("/v1/rag/retrieve", headers=auth, json={
            "query": "gateway concurrency", "scope": "project", "scope_id": "alandi", "top_k": 3
        })
        assert retrieval.status_code == 200
        assert retrieval.json()["chunks"][0]["source_uri"] == "https://example.test/page"


def test_google_oauth_pkce_flow_keeps_tokens_server_side_and_refresh_token(tmp_path):
    from urllib.parse import parse_qs, urlsplit
    from fastapi.testclient import TestClient
    import httpx
    from gateway.app import Settings, create_app

    key = "o" * 64
    vault_key = OAuthVault.generate_key()
    calls = []
    def handler(request):
        calls.append((request.url.path, request.content.decode("utf-8", errors="ignore")))
        if request.url.path == "/token":
            form = dict(__import__("urllib.parse", fromlist=["parse_qsl"]).parse_qsl(request.content.decode()))
            if form.get("grant_type") == "authorization_code":
                return httpx.Response(200, json={"access_token": "access-secret", "refresh_token": "refresh-secret",
                                                 "expires_in": 3600, "scope": "https://www.googleapis.com/auth/drive.file"})
            if form.get("grant_type") == "refresh_token":
                return httpx.Response(200, json={"access_token": "access-secret-rotated", "expires_in": 3600})
        if request.url.path == "/revoke":
            return httpx.Response(200, text="")
        return httpx.Response(404, json={})

    config = Settings(
        api_key=key, ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",), cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False, oauth_enabled=True, oauth_path=str(tmp_path / "oauth.sqlite3"),
        oauth_encryption_key=vault_key, google_oauth_client_id="client-id",
        google_oauth_client_secret="client-secret",
        google_oauth_redirect_uri="https://gateway.example.test/oauth/google/callback",
        oauth_success_redirect="https://dorpnay.github.io/skills-github-pages/"
    )
    with TestClient(create_app(config, transport=httpx.MockTransport(handler))) as client:
        auth = {"Authorization": f"Bearer {key}"}
        assert client.get("/oauth/google/status", headers=auth).json()["connected"] is False
        start = client.post("/oauth/google/initiate", headers=auth)
        assert start.status_code == 200
        auth_url = urlsplit(start.json()["auth_url"])
        params = parse_qs(auth_url.query)
        assert auth_url.netloc == "accounts.google.com"
        assert params["code_challenge_method"] == ["S256"]
        assert params["scope"] == ["https://www.googleapis.com/auth/drive.file"]
        state = params["state"][0]

        callback = client.get("/oauth/google/callback", params={"code": "fake-code", "state": state}, follow_redirects=False)
        assert callback.status_code == 303
        assert "drive=connected" in callback.headers["location"]
        assert "access-secret" not in callback.headers["location"]
        connected = client.get("/oauth/google/status", headers=auth).json()
        assert connected["connected"] is True and connected["has_refresh_token"] is True
        assert "access_token" not in connected and "refresh_token" not in connected

        refresh = client.post("/oauth/google/refresh", headers=auth)
        assert refresh.status_code == 200 and refresh.json()["has_refresh_token"] is True
        assert client.post("/oauth/google/revoke", headers=auth).json()["status"] == "revoked"
        assert client.get("/oauth/google/status", headers=auth).json()["connected"] is False



def test_google_oauth_routes_are_disabled_without_server_configuration():
    from fastapi.testclient import TestClient
    import httpx
    from gateway.app import Settings, create_app

    key = "p" * 64
    config = Settings(api_key=key, ollama_base_url="http://ollama.test:11434",
                      allowed_models=("qwen3.5:4b",), cors_origins=("https://dorpnay.github.io",),
                      cache_enabled=False)
    with TestClient(create_app(config, transport=httpx.MockTransport(lambda request: httpx.Response(404)))) as client:
        assert client.post("/oauth/google/initiate", headers={"Authorization": f"Bearer {key}"}).status_code == 503
