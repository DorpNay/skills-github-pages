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
    assert router.response_for({"model": "local:test", "temperature": 0, "messages": [{"role": "user", "content": "привет"}]}) is not None
    assert router.response_for({"model": "local:test", "temperature": 0.7, "messages": [{"role": "user", "content": "привет"}]}) is None
    assert router.response_for({"model": "local:test", "max_tokens": 1, "messages": [{"role": "user", "content": "привет"}]}) is None
    assert router.response_for({"model": "local:test", "n": 2, "messages": [{"role": "user", "content": "привет"}]}) is None
    assert router.response_for({"model": "local:test", "stop": ["!"], "messages": [{"role": "user", "content": "привет"}]}) is None
    assert router.response_for({"model": "local:test", "messages": [{"role": "user", "content": "привет"}, {"role": "assistant", "content": "да"} , {"role": "user", "content": "спасибо"}]}) is None


def test_router_does_not_claim_keyword_hints_are_verified():
    decision = IntentRouter().classify("найди официальную документацию")
    assert decision.intent == "tool_call"
    assert decision.requires_verification
    assert decision.confidence < 0.85
    assert normalize_text("Что такое RAG?") == "что такое rag"


def test_runtime_inventory_never_claims_to_measure_or_evict_kv_cache():
    result = analyze_runtime({"models": [{"name": "qwen:4b", "size": 2 * 1024**3, "size_vram": 0}]}, 6144)
    assert result["reported_model_size_total_mb"] == 2048.0
    assert result["kv_cache_usage_mb"] is None
    assert result["kv_cache_api_supported"] is False
    assert result["automatic_eviction_performed"] is False
    assert "qwen:4b" in result["reported_loaded_models"][0]["name"]


def test_runtime_budget_advises_without_automatic_unload():
    result = analyze_runtime({"models": [{"model": "large", "size": 7 * 1024**3}]}, 6144)
    assert result["reported_model_size_over_advisory_budget"]
    assert result["automatic_eviction_performed"] is False


def test_json_delta_roundtrip_and_size_reduction_for_small_scalar_change():
    # A small delta beats sending a large unchanged state, but array replacement may not.
    old = {"facts": [{"id": "f1", "text": "Python"}], "decisions": [], "questions": [],
           "notes": [], "summary": "established context " * 120}
    new = {**old, "summary": "short updated summary"}
    patch = compute_patch(old, new)
    assert apply_patch(old, patch) == new
    assert len(json.dumps(patch)) < len(json.dumps(new))


def test_json_delta_appends_new_memory_items_without_resending_existing_array():
    old = {"facts": [{"id": f"fact-{index}", "text": "A saved project decision with provenance."} for index in range(100)],
           "decisions": [], "questions": [], "notes": [], "summary": "stable"}
    new = {**old, "facts": [*old["facts"], {"id": "fact-100", "text": "One new memory fact."}]}
    patch = compute_patch(old, new)
    assert patch == [{"op": "add", "path": "/facts/-", "value": {"id": "fact-100", "text": "One new memory fact."}}]
    assert apply_patch(old, patch) == new
    assert len(json.dumps(patch, separators=(",", ":"))) < len(json.dumps(new, separators=(",", ":"))) / 10


def test_json_delta_removes_array_suffix_in_reverse_order():
    old = {"facts": [{"id": "one"}, {"id": "two"}, {"id": "three"}], "decisions": [], "questions": [], "notes": [], "summary": ""}
    new = {**old, "facts": [{"id": "one"}]}
    patch = compute_patch(old, new)
    assert patch == [{"op": "remove", "path": "/facts/2"}, {"op": "remove", "path": "/facts/1"}]
    assert apply_patch(old, patch) == new


def test_json_delta_roundtrip_when_arrays_change_even_if_delta_is_larger():
    old = {"facts": [{"id": "f1", "text": "Python"}], "decisions": [], "questions": [], "notes": [], "summary": ""}
    new = {"facts": [{"id": "f1", "text": "Python"}, {"id": "f2", "text": "Use SQLite"}],
           "decisions": [{"id": "d1", "text": "Bounded concurrency"}], "questions": [], "notes": [], "summary": ""}
    patch = compute_patch(old, new)
    assert apply_patch(old, patch) == new


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
    with pytest.raises(DeltaSyncError):
        apply_patch(state, [{"op": "add", "path": "/facts/01", "value": "leading zero index"}])
    with pytest.raises(DeltaSyncError):
        apply_patch(state, [{"op": "remove", "path": "/facts/0", "value": "unexpected"}])


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
    assert rag.delete_document("doc-a", scope="project", scope_id="wrong-scope") is False
    assert rag.delete_document("doc-a", scope="project", scope_id="alandi") is True
    assert rag.retrieve("SQLite memory writes", scope="project", scope_id="alandi") == []


def test_rag_scope_bound_ids_allow_same_document_name_without_leak_or_cross_delete(tmp_path):
    rag = LazyGraphRAG(tmp_path / "rag.sqlite3")
    rag.initialize()
    rag.ingest_document("shared-doc", "https://example.test/alandi", [
        {"chunk_id": "shared-chunk", "content": "Ollama architecture secret alpha project."}
    ], scope="project", scope_id="alandi")
    rag.ingest_document("shared-doc", "https://example.test/other", [
        {"chunk_id": "shared-chunk", "content": "Ollama architecture secret beta project."}
    ], scope="project", scope_id="other-project")

    alpha = rag.retrieve("Ollama architecture secret alpha", scope="project", scope_id="alandi")
    beta = rag.retrieve("Ollama architecture secret beta", scope="project", scope_id="other-project")
    assert alpha and all(item["source_uri"] == "https://example.test/alandi" for item in alpha)
    assert beta and all(item["source_uri"] == "https://example.test/other" for item in beta)
    assert rag.delete_document("shared-doc", scope="project", scope_id="alandi") is True
    assert rag.retrieve("Ollama architecture secret alpha", scope="project", scope_id="alandi") == []
    assert rag.retrieve("Ollama architecture secret beta", scope="project", scope_id="other-project")


def test_rag_migrates_legacy_global_ids_without_losing_citations_or_chunks(tmp_path):
    path = tmp_path / "legacy-rag.sqlite3"
    db = sqlite3.connect(path)
    db.execute("PRAGMA foreign_keys=ON")
    db.executescript("""
        CREATE TABLE rag_documents (
            document_id TEXT PRIMARY KEY, scope TEXT NOT NULL, scope_id TEXT NOT NULL,
            source_uri TEXT NOT NULL, created_at INTEGER NOT NULL
        );
        CREATE TABLE rag_chunks (
            chunk_id TEXT PRIMARY KEY,
            document_id TEXT NOT NULL REFERENCES rag_documents(document_id) ON DELETE CASCADE,
            scope TEXT NOT NULL, scope_id TEXT NOT NULL, source_uri TEXT NOT NULL,
            page_number INTEGER, content TEXT NOT NULL, created_at INTEGER NOT NULL
        );
        CREATE VIRTUAL TABLE rag_fts USING fts5(chunk_id UNINDEXED, content, tokenize='unicode61');
        CREATE TABLE rag_chunk_concepts (
            chunk_id TEXT NOT NULL REFERENCES rag_chunks(chunk_id) ON DELETE CASCADE,
            concept TEXT NOT NULL, PRIMARY KEY(chunk_id, concept)
        );
        CREATE INDEX idx_rag_chunk_scope ON rag_chunks(scope, scope_id, document_id);
        CREATE INDEX idx_rag_concepts ON rag_chunk_concepts(concept, chunk_id);
    """)
    now = int(time.time())
    db.execute("INSERT INTO rag_documents VALUES (?, ?, ?, ?, ?)",
               ("legacy-doc", "project", "alandi", "https://example.test/legacy", now))
    db.execute("INSERT INTO rag_chunks VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
               ("legacy-chunk", "legacy-doc", "project", "alandi", "https://example.test/legacy", 4,
                "Legacy migration preserves SQLite architecture source citation.", now))
    db.execute("INSERT INTO rag_fts VALUES (?, ?)",
               ("legacy-chunk", "Legacy migration preserves SQLite architecture source citation."))
    db.execute("INSERT INTO rag_chunk_concepts VALUES (?, ?)", ("legacy-chunk", "architecture"))
    db.commit()
    db.close()

    rag = LazyGraphRAG(path)
    rag.initialize()
    legacy = rag.retrieve("SQLite architecture", scope="project", scope_id="alandi")
    assert legacy and legacy[0]["chunk_id"] == "legacy-chunk"
    assert legacy[0]["document_id"] == "legacy-doc"
    assert legacy[0]["page_number"] == 4

    # The same caller-facing identifiers can now safely exist in a different project.
    rag.ingest_document("legacy-doc", "https://example.test/new-project", [
        {"chunk_id": "legacy-chunk", "content": "Another project stores unrelated bounded search records."}
    ], scope="project", scope_id="other-project")
    assert rag.retrieve("SQLite architecture", scope="project", scope_id="alandi")
    assert rag.retrieve("unrelated bounded search", scope="project", scope_id="other-project")
    assert rag.delete_document("legacy-doc", scope="project", scope_id="other-project")
    assert rag.retrieve("SQLite architecture", scope="project", scope_id="alandi")


def test_rag_rejects_unsafe_citation_schemes_and_embedded_credentials(tmp_path):
    rag = LazyGraphRAG(tmp_path / "rag.sqlite3")
    rag.initialize()
    chunks = [{"content": "sample safe chunk"}]
    for uri in ("javascript:alert(1)", "http://example.test/", "https://user:pass@example.test/"):
        with pytest.raises(ValueError):
            rag.ingest_document("unsafe", uri, chunks, scope="project", scope_id="alandi")


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
        inventory = client.get("/admin/runtime", headers=auth).json()
        assert inventory["kv_cache_usage_mb"] is None
        assert inventory["host_process_memory"]["source"] == "linux_procfs"
        assert inventory["host_process_memory"]["ollama_process_count"] == 0


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
        assert routed.headers["x-ai-route"] == "exact_template"
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
        deleted_doc = client.delete("/v1/rag/documents/doc-1", params={"scope": "project", "scope_id": "alandi"}, headers=auth)
        assert deleted_doc.status_code == 200 and deleted_doc.json()["status"] == "deleted"
        assert client.post("/v1/rag/retrieve", headers=auth, json={
            "query": "gateway concurrency", "scope": "project", "scope_id": "alandi", "top_k": 3
        }).json()["chunks"] == []

        deleted_memory = client.delete("/v1/memory/state/chat-1", headers=auth)
        assert deleted_memory.status_code == 200 and deleted_memory.json()["status"] == "deleted"
        assert client.get("/v1/memory/state/chat-1", headers=auth).json()["revision"] == 0


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


def test_google_oauth_rejects_broader_scope_and_attempts_revoke(tmp_path):
    from urllib.parse import parse_qs, urlsplit
    from fastapi.testclient import TestClient
    import httpx
    from gateway.app import Settings, create_app

    key = "r" * 64
    revoked = []
    def handler(request):
        if request.url.path == "/token":
            return httpx.Response(200, json={"access_token": "too-broad-access",
                                             "refresh_token": "too-broad-refresh", "expires_in": 3600,
                                             "scope": "https://www.googleapis.com/auth/drive.readonly"})
        if request.url.path == "/revoke":
            revoked.append(True)
            return httpx.Response(200, text="")
        return httpx.Response(404, json={})

    config = Settings(
        api_key=key, ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",), cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False, oauth_enabled=True, oauth_path=str(tmp_path / "oauth.sqlite3"),
        oauth_encryption_key=OAuthVault.generate_key(), google_oauth_client_id="client-id",
        google_oauth_client_secret="client-secret",
        google_oauth_redirect_uri="https://gateway.example.test/oauth/google/callback",
        oauth_success_redirect="https://dorpnay.github.io/skills-github-pages/"
    )
    with TestClient(create_app(config, transport=httpx.MockTransport(handler))) as client:
        auth = {"Authorization": f"Bearer {key}"}
        start = client.post("/oauth/google/initiate", headers=auth)
        state = parse_qs(urlsplit(start.json()["auth_url"]).query)["state"][0]
        response = client.get("/oauth/google/callback", params={"code": "code", "state": state}, follow_redirects=False)
        assert response.status_code == 303
        assert "drive=error" in response.headers["location"]
        assert client.get("/oauth/google/status", headers=auth).json()["connected"] is False
        assert revoked == [True]


def test_host_process_metrics_parse_procfs_without_signaling_processes(tmp_path):
    from gateway.host_metrics import collect_host_metrics

    (tmp_path / "100").mkdir()
    (tmp_path / "100" / "status").write_text(
        "Name:\tpython\nVmRSS:\t10240 kB\nVmHWM:\t20480 kB\n", encoding="ascii"
    )
    (tmp_path / "200").mkdir()
    (tmp_path / "200" / "comm").write_text("ollama\n", encoding="ascii")
    (tmp_path / "200" / "status").write_text(
        "Name:\tollama\nVmRSS:\t1048576 kB\nVmHWM:\t2097152 kB\n", encoding="ascii"
    )
    result = collect_host_metrics(tmp_path, gateway_pid=100)
    assert result["gateway_process"]["rss_mb"] == 10.0
    assert result["gateway_process"]["peak_rss_mb"] == 20.0
    assert result["ollama_process_count"] == 1
    assert result["ollama_rss_sum_mb"] == 1024.0
    assert result["ollama_peak_rss_sum_mb"] == 2048.0
    assert result["notes"]
