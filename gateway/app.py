"""Small authenticated OpenAI-compatible gateway for a private Ollama instance.

This service never executes tools, fetches arbitrary URLs, or stores prompt contents.
"""
from __future__ import annotations
import asyncio
import hashlib
import json
import logging
import os
import secrets
import sqlite3
import time
from contextlib import asynccontextmanager, closing
from dataclasses import dataclass
from typing import Any, AsyncIterator, Mapping
from urllib.parse import urlsplit

import httpx
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, StreamingResponse

logger = logging.getLogger("alandi.gateway")


def int_env(name: str, default: int, minimum: int = 1) -> int:
    try:
        value = int(os.getenv(name, str(default)))
    except ValueError as exc:
        raise ValueError(f"{name} must be an integer") from exc
    if value < minimum:
        raise ValueError(f"{name} must be >= {minimum}")
    return value


def bool_env(name: str, default: bool = False) -> bool:
    value = os.getenv(name, "true" if default else "false").strip().lower()
    if value in {"1", "true", "yes", "on"}:
        return True
    if value in {"0", "false", "no", "off"}:
        return False
    raise ValueError(f"{name} must be a boolean (true/false)")


def validate_origin(value: str) -> str:
    parsed = urlsplit(value)
    if parsed.scheme not in {"https", "http"} or not parsed.netloc:
        raise ValueError(f"Invalid CORS origin: {value!r}")
    if parsed.path not in {"", "/"} or parsed.query or parsed.fragment or parsed.username or parsed.password or value == "*":
        raise ValueError("CORS entries must be explicit origins without paths or credentials")
    return f"{parsed.scheme}://{parsed.netloc}"


@dataclass(frozen=True)
class Settings:
    api_key: str
    ollama_base_url: str
    allowed_models: tuple[str, ...]
    cors_origins: tuple[str, ...]
    max_body_bytes: int = 8 * 1024 * 1024
    upstream_timeout_seconds: float = 300.0
    max_inflight_requests: int = 1
    model_context_length_tokens: int = 4096
    cache_enabled: bool = True
    cache_path: str = "/var/lib/alandi-gateway/response-cache.sqlite3"
    cache_ttl_seconds: int = 900
    cache_max_entries: int = 1000
    cache_max_response_bytes: int = 1_000_000
    # New capabilities are opt-in until enabled and evaluated on the target VPS.
    fast_routing_enabled: bool = False
    memory_sync_enabled: bool = False
    memory_path: str = "/var/lib/alandi-gateway/memory.sqlite3"
    memory_max_state_bytes: int = 512_000
    rag_enabled: bool = False
    rag_path: str = "/var/lib/alandi-gateway/rag.sqlite3"
    rag_max_chunk_chars: int = 20_000
    model_size_advisory_mb: int = 6144
    oauth_enabled: bool = False
    oauth_path: str = "/var/lib/alandi-gateway/oauth.sqlite3"
    oauth_encryption_key: str = ""
    google_oauth_client_id: str = ""
    google_oauth_client_secret: str = ""
    google_oauth_redirect_uri: str = ""
    oauth_success_redirect: str = "https://dorpnay.github.io/skills-github-pages/"

    @classmethod
    def from_env(cls) -> "Settings":
        base = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").strip().rstrip("/")
        parsed = urlsplit(base)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc or parsed.query or parsed.fragment or parsed.username or parsed.password:
            raise ValueError("OLLAMA_BASE_URL must be a fixed HTTP(S) base URL without credentials, query, or fragment")
        models = tuple(item.strip() for item in os.getenv("ALANDI_ALLOWED_MODELS", "qwen3.5:4b").split(",") if item.strip())
        if not models or len(set(models)) != len(models):
            raise ValueError("ALANDI_ALLOWED_MODELS must contain unique model tags")
        origins = tuple(validate_origin(item.strip()) for item in os.getenv(
            "ALANDI_CORS_ORIGINS", "https://dorpnay.github.io"
        ).split(",") if item.strip())
        try:
            timeout = float(os.getenv("ALANDI_UPSTREAM_TIMEOUT_SECONDS", "300"))
        except ValueError as exc:
            raise ValueError("ALANDI_UPSTREAM_TIMEOUT_SECONDS must be a number") from exc
        if timeout < 1:
            raise ValueError("ALANDI_UPSTREAM_TIMEOUT_SECONDS must be >= 1")
        model_size_budget_env = (
            "ALANDI_MODEL_SIZE_ADVISORY_MB"
            if "ALANDI_MODEL_SIZE_ADVISORY_MB" in os.environ
            else "ALANDI_RUNTIME_MEMORY_BUDGET_MB"
        )
        oauth_enabled = bool_env("OAUTH_ENABLED", False)
        oauth_encryption_key = os.getenv("OAUTH_ENCRYPTION_KEY", "").strip()
        google_oauth_client_id = os.getenv("GOOGLE_DRIVE_CLIENT_ID", "").strip()
        google_oauth_client_secret = os.getenv("GOOGLE_DRIVE_CLIENT_SECRET", "").strip()
        google_oauth_redirect_uri = os.getenv("GOOGLE_DRIVE_REDIRECT_URI", "").strip()
        oauth_success_redirect = os.getenv(
            "OAUTH_SUCCESS_REDIRECT", "https://dorpnay.github.io/skills-github-pages/"
        ).strip()
        if oauth_enabled:
            if not all((oauth_encryption_key, google_oauth_client_id, google_oauth_client_secret,
                        google_oauth_redirect_uri, oauth_success_redirect)):
                raise ValueError("OAUTH_ENABLED requires encryption key, Google client ID/secret, callback URI and success redirect")
            callback = urlsplit(google_oauth_redirect_uri)
            success = urlsplit(oauth_success_redirect)
            if callback.scheme != "https" or not callback.netloc or callback.username or callback.password or callback.query or callback.fragment:
                raise ValueError("GOOGLE_DRIVE_REDIRECT_URI must be a fixed HTTPS URL without credentials, query or fragment")
            if success.scheme != "https" or not success.netloc or success.username or success.password or success.query or success.fragment:
                raise ValueError("OAUTH_SUCCESS_REDIRECT must be a fixed HTTPS URL without credentials, query or fragment")
            success_origin = f"{success.scheme}://{success.netloc}"
            if success_origin not in origins:
                raise ValueError("OAUTH_SUCCESS_REDIRECT origin must be present in ALANDI_CORS_ORIGINS")
        return cls(
            api_key=os.getenv("ALANDI_API_KEY", "").strip(),
            ollama_base_url=base,
            allowed_models=models,
            cors_origins=origins,
            max_body_bytes=int_env("ALANDI_MAX_BODY_BYTES", 8 * 1024 * 1024),
            upstream_timeout_seconds=timeout,
            max_inflight_requests=int_env("ALANDI_MAX_INFLIGHT_REQUESTS", 1),
            model_context_length_tokens=int_env("ALANDI_MODEL_CONTEXT_LENGTH_TOKENS", 4096, 256),
            cache_enabled=os.getenv("ALANDI_CACHE_ENABLED", "true").strip().lower() not in {"0", "false", "no", "off"},
            cache_path=os.getenv("ALANDI_CACHE_PATH", "/var/lib/alandi-gateway/response-cache.sqlite3").strip() or "/var/lib/alandi-gateway/response-cache.sqlite3",
            cache_ttl_seconds=int_env("ALANDI_CACHE_TTL_SECONDS", 900),
            cache_max_entries=int_env("ALANDI_CACHE_MAX_ENTRIES", 1000),
            cache_max_response_bytes=int_env("ALANDI_CACHE_MAX_RESPONSE_BYTES", 1_000_000, 1024),
            fast_routing_enabled=bool_env("ALANDI_FAST_ROUTING_ENABLED", False),
            memory_sync_enabled=bool_env("ALANDI_MEMORY_SYNC_ENABLED", False),
            memory_path=os.getenv("ALANDI_MEMORY_PATH", "/var/lib/alandi-gateway/memory.sqlite3").strip() or "/var/lib/alandi-gateway/memory.sqlite3",
            memory_max_state_bytes=int_env("ALANDI_MEMORY_MAX_STATE_BYTES", 512_000, 1024),
            rag_enabled=bool_env("ALANDI_RAG_ENABLED", False),
            rag_path=os.getenv("ALANDI_RAG_PATH", "/var/lib/alandi-gateway/rag.sqlite3").strip() or "/var/lib/alandi-gateway/rag.sqlite3",
            rag_max_chunk_chars=int_env("ALANDI_RAG_MAX_CHUNK_CHARS", 20_000, 100),
            model_size_advisory_mb=int_env(model_size_budget_env, 6144, 256),
            oauth_enabled=oauth_enabled,
            oauth_path=os.getenv("OAUTH_TOKEN_VAULT_PATH", "/var/lib/alandi-gateway/oauth.sqlite3").strip() or "/var/lib/alandi-gateway/oauth.sqlite3",
            oauth_encryption_key=oauth_encryption_key,
            google_oauth_client_id=google_oauth_client_id,
            google_oauth_client_secret=google_oauth_client_secret,
            google_oauth_redirect_uri=google_oauth_redirect_uri,
            oauth_success_redirect=oauth_success_redirect,
        )


def authorize(settings: Settings, authorization: str | None) -> None:
    if len(settings.api_key) < 32:
        raise HTTPException(503, "Gateway authentication is not configured safely")
    scheme, separator, token = (authorization or "").partition(" ")
    if not separator or scheme.lower() != "bearer" or not secrets.compare_digest(token.encode("utf-8"), settings.api_key.encode("utf-8")):
        raise HTTPException(401, "Invalid or missing bearer token", headers={"WWW-Authenticate": "Bearer"})


async def read_limited_body(request: Request, limit: int) -> bytes:
    length = request.headers.get("content-length")
    if length:
        try:
            if int(length) > limit:
                raise HTTPException(413, f"Request body exceeds {limit} bytes")
        except ValueError:
            raise HTTPException(400, "Invalid Content-Length header") from None
    parts: list[bytes] = []
    size = 0
    async for part in request.stream():
        size += len(part)
        if size > limit:
            raise HTTPException(413, f"Request body exceeds {limit} bytes")
        parts.append(part)
    return b"".join(parts)


def validate_payload(payload: object, allowed: tuple[str, ...]) -> tuple[dict, bool]:
    if not isinstance(payload, dict):
        raise HTTPException(400, "JSON body must be an object")
    model = payload.get("model")
    if not isinstance(model, str) or not model.strip() or model not in allowed:
        raise HTTPException(400, "Model tag is missing or not allow-listed")
    messages = payload.get("messages")
    if not isinstance(messages, list) or not messages:
        raise HTTPException(400, "messages must be a non-empty array")
    roles = {"system", "developer", "user", "assistant", "tool"}
    for i, message in enumerate(messages):
        if not isinstance(message, dict) or message.get("role") not in roles:
            raise HTTPException(400, f"messages[{i}] has an invalid role or shape")
        if "content" not in message and "tool_calls" not in message:
            raise HTTPException(400, f"messages[{i}] requires content or tool_calls")
    stream = payload.get("stream", False)
    if not isinstance(stream, bool):
        raise HTTPException(400, "stream must be a boolean")
    return payload, stream


def upstream_error(status: int) -> JSONResponse:
    if status == 404:
        message = "Local model endpoint or model not found; verify Ollama and the exact model tag."
    elif status == 400:
        message = "Ollama rejected the request; check model compatibility and parameters."
    else:
        message = f"Local model backend returned HTTP {status}; inspect service logs."
    return JSONResponse(status_code=502 if status >= 500 else status,
                         content={"error": {"message": message, "type": "upstream_error"}})




def connect_cache_db(settings: Settings) -> sqlite3.Connection:
    """Open the local exact-response cache; no prompts are logged or stored as keys."""
    directory = os.path.dirname(settings.cache_path)
    if directory:
        os.makedirs(directory, mode=0o750, exist_ok=True)
    db = sqlite3.connect(settings.cache_path, timeout=5)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA synchronous=NORMAL")
    db.execute("PRAGMA busy_timeout=5000")
    db.execute(
        """CREATE TABLE IF NOT EXISTS response_cache (
             cache_key TEXT PRIMARY KEY,
             response_json TEXT NOT NULL,
             created_at INTEGER NOT NULL,
             expires_at INTEGER NOT NULL,
             response_bytes INTEGER NOT NULL
           )"""
    )
    db.execute("CREATE INDEX IF NOT EXISTS idx_response_cache_expiry ON response_cache(expires_at)")
    db.commit()
    return db


def is_cacheable(payload: object) -> bool:
    """Allow only complete, ordinary text requests with explicit conservative temperature."""
    if not isinstance(payload, dict):
        return False
    if payload.get("stream") is True or payload.get("tools") or payload.get("functions"):
        return False
    if payload.get("tool_choice") not in (None, "none") or payload.get("function_call") not in (None, "none"):
        return False
    temperature = payload.get("temperature")
    if isinstance(temperature, bool) or not isinstance(temperature, (int, float)) or not 0 <= temperature <= 0.2:
        return False
    messages = payload.get("messages")
    if not isinstance(messages, list) or not messages:
        return False
    for message in messages:
        if not isinstance(message, dict) or message.get("role") == "tool":
            return False
        if message.get("tool_calls") or message.get("function_call"):
            return False
        if not isinstance(message.get("content"), str):
            return False
    return True


def should_bypass_cache(
    settings: Settings,
    payload: object,
    *,
    method: str,
    path: str,
    headers: Mapping[str, str],
) -> bool:
    if not settings.cache_enabled or method.upper() != "POST" or path.strip("/") != "chat/completions":
        return True
    if not is_cacheable(payload):
        return True
    normalized = {str(key).lower(): str(value) for key, value in headers.items()}
    if normalized.get("x-ai-cache-bypass", "").strip().lower() in {"1", "true", "yes", "on"}:
        return True
    directives = {
        item.strip().lower().split("=", 1)[0]
        for item in normalized.get("cache-control", "").split(",")
        if item.strip()
    }
    return bool({"no-cache", "no-store"} & directives)


def canonical_cache_key(settings: Settings, payload: dict, *, method: str, path: str, query: str = "") -> str:
    envelope = {
        "schema": "alandi-exact-cache-v1",
        "key_scope": hashlib.sha256(settings.api_key.encode("utf-8")).hexdigest(),
        "method": method.upper(),
        "path": path.strip("/"),
        "query": query,
        "payload": payload,
    }
    serialized = json.dumps(envelope, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def cache_get(settings: Settings, key: str) -> dict[str, Any] | None:
    if not settings.cache_enabled:
        return None
    try:
        now = int(time.time())
        with closing(connect_cache_db(settings)) as db:
            row = db.execute(
                "SELECT response_json FROM response_cache WHERE cache_key=? AND expires_at>?",
                (key, now),
            ).fetchone()
            db.execute("DELETE FROM response_cache WHERE expires_at<=?", (now,))
            db.commit()
        if not row:
            return None
        parsed = json.loads(row[0])
        return parsed if isinstance(parsed, dict) else None
    except (OSError, sqlite3.Error, ValueError, TypeError):
        logger.warning("Exact response cache read failed; proceeding without cache")
        return None


def response_is_complete_text(value: object) -> bool:
    if not isinstance(value, dict):
        return False
    choices = value.get("choices")
    if not isinstance(choices, list) or not choices or not isinstance(choices[0], dict):
        return False
    choice = choices[0]
    message = choice.get("message")
    return (
        choice.get("finish_reason") == "stop"
        and isinstance(message, dict)
        and isinstance(message.get("content"), str)
        and not message.get("tool_calls")
        and not message.get("function_call")
    )


def cache_put(settings: Settings, key: str, value: dict[str, Any]) -> None:
    if not settings.cache_enabled or not response_is_complete_text(value):
        return
    try:
        serialized = json.dumps(value, separators=(",", ":"), ensure_ascii=False)
        byte_count = len(serialized.encode("utf-8"))
        if byte_count > settings.cache_max_response_bytes:
            return
        now = int(time.time())
        with closing(connect_cache_db(settings)) as db:
            db.execute(
                """INSERT OR REPLACE INTO response_cache
                   (cache_key,response_json,created_at,expires_at,response_bytes)
                   VALUES (?,?,?,?,?)""",
                (key, serialized, now, now + settings.cache_ttl_seconds, byte_count),
            )
            db.execute("DELETE FROM response_cache WHERE expires_at<=?", (now,))
            db.execute(
                """DELETE FROM response_cache WHERE cache_key IN (
                     SELECT cache_key FROM response_cache
                     ORDER BY created_at DESC LIMIT -1 OFFSET ?
                   )""",
                (settings.cache_max_entries,),
            )
            db.commit()
    except (OSError, sqlite3.Error, ValueError, TypeError):
        logger.warning("Exact response cache write failed; response will still be returned")


def cache_statistics(settings: Settings) -> dict[str, int | bool]:
    if not settings.cache_enabled:
        return {"enabled": False, "entries": 0, "response_bytes": 0, "ttl_seconds": settings.cache_ttl_seconds}
    now = int(time.time())
    try:
        with closing(connect_cache_db(settings)) as db:
            db.execute("DELETE FROM response_cache WHERE expires_at<=?", (now,))
            count, size = db.execute(
                "SELECT COUNT(*), COALESCE(SUM(response_bytes),0) FROM response_cache"
            ).fetchone()
            db.commit()
        return {"enabled": True, "entries": int(count), "response_bytes": int(size),
                "ttl_seconds": settings.cache_ttl_seconds}
    except (OSError, sqlite3.Error):
        logger.warning("Exact response cache statistics unavailable")
        return {"enabled": True, "entries": 0, "response_bytes": 0,
                "ttl_seconds": settings.cache_ttl_seconds}


def create_app(settings: Settings | None = None, transport: httpx.AsyncBaseTransport | None = None) -> FastAPI:
    config = settings or Settings.from_env()
    timeout = httpx.Timeout(connect=min(10.0, config.upstream_timeout_seconds),
                            read=config.upstream_timeout_seconds, write=30.0, pool=10.0)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        if config.cache_enabled:
            with closing(connect_cache_db(config)):
                pass
        app.state.client = httpx.AsyncClient(timeout=timeout, transport=transport)
        app.state.semaphore = asyncio.Semaphore(config.max_inflight_requests)
        app.state.delta_store = None
        app.state.rag_store = None
        app.state.oauth_vault = None
        if config.oauth_enabled:
            try:
                from .security.oauth_vault import OAuthVault
            except ImportError:  # supports "uvicorn app:app" from the gateway directory
                from security.oauth_vault import OAuthVault
            app.state.oauth_vault = OAuthVault(config.oauth_path, config.oauth_encryption_key)
            app.state.oauth_vault.initialize()
        if config.memory_sync_enabled:
            try:
                from .memory.delta_sync import DeltaMemoryStore
            except ImportError:  # supports "uvicorn app:app" from the gateway directory
                from memory.delta_sync import DeltaMemoryStore
            app.state.delta_store = DeltaMemoryStore(
                config.memory_path, max_state_bytes=config.memory_max_state_bytes
            )
            app.state.delta_store.initialize()
        if config.rag_enabled:
            try:
                from .rag.lazy_graph_rag import LazyGraphRAG
            except ImportError:  # supports "uvicorn app:app" from the gateway directory
                from rag.lazy_graph_rag import LazyGraphRAG
            app.state.rag_store = LazyGraphRAG(
                config.rag_path, max_chunk_chars=config.rag_max_chunk_chars
            )
            app.state.rag_store.initialize()
        yield
        await app.state.client.aclose()

    app = FastAPI(title="aLandi Lite Gateway", version="0.1.0",
                  docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan)
    app.state.settings = config
    try:
        from ..observability.trace_context import TraceContextMiddleware
    except ImportError:
        try:
            from observability.trace_context import TraceContextMiddleware
        except ImportError:
            TraceContextMiddleware = None
    if TraceContextMiddleware is not None:
        app.add_middleware(TraceContextMiddleware)
    app.add_middleware(CORSMiddleware, allow_origins=list(config.cors_origins),
                       allow_credentials=False, allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
                       allow_headers=["Authorization", "Content-Type", "Accept", "Cache-Control", "X-AI-Cache-Bypass"],
                       expose_headers=["X-AI-Cache", "X-AI-Route", "X-AI-Trace-ID"], max_age=600)

    @app.get("/healthz")
    async def healthz(request: Request) -> JSONResponse:
        try:
            response = await request.app.state.client.get(f"{config.ollama_base_url}/api/tags", timeout=2.0)
            response.raise_for_status()
        except (httpx.HTTPError, asyncio.TimeoutError):
            return JSONResponse(status_code=503, content={"status": "degraded", "ollama": "unreachable",
                                                          "auth_configured": len(config.api_key) >= 32})
        return JSONResponse(content={"status": "ok", "ollama": "reachable",
                                      "auth_configured": len(config.api_key) >= 32})

    @app.get("/v1/models")
    async def models(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        try:
            response = await request.app.state.client.get(f"{config.ollama_base_url}/api/tags")
            response.raise_for_status()
            payload = response.json()
        except (httpx.HTTPError, ValueError):
            logger.warning("Model catalog request failed; response body omitted")
            raise HTTPException(503, "Local model catalog is unavailable") from None
        raw_models = payload.get("models", []) if isinstance(payload, dict) else []
        found = {item.get("name") or item.get("model") for item in raw_models if isinstance(item, dict)}
        return JSONResponse(content={"object": "list", "data": [
            {"id": model, "object": "model", "created": 0, "owned_by": "alandi",
             "context_length": config.model_context_length_tokens}
            for model in config.allowed_models if model in found
        ]})

    @app.get("/admin/cache/stats")
    async def cache_stats(authorization: str | None = Header(default=None)) -> dict[str, int | bool]:
        authorize(config, authorization)
        return {**cache_statistics(config), "max_entries": config.cache_max_entries,
                "max_response_bytes": config.cache_max_response_bytes}

    @app.get("/admin/runtime")
    async def runtime_inventory(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        """Show Ollama's loaded-model inventory without pretending it exposes KV usage."""
        authorize(config, authorization)
        try:
            response = await request.app.state.client.get(f"{config.ollama_base_url}/api/ps", timeout=3.0)
            response.raise_for_status()
            try:
                from .kv_budget import analyze_runtime
            except ImportError:
                from kv_budget import analyze_runtime
            result = analyze_runtime(response.json(), config.model_size_advisory_mb)
            try:
                from .host_metrics import collect_host_metrics
            except ImportError:  # supports "uvicorn app:app" from the gateway directory
                from host_metrics import collect_host_metrics
            result["host_process_memory"] = await asyncio.to_thread(collect_host_metrics)
        except (httpx.HTTPError, asyncio.TimeoutError, ValueError):
            logger.warning("Ollama runtime inventory failed; upstream body omitted")
            raise HTTPException(503, "Local runtime inventory is unavailable") from None
        return JSONResponse(result, headers={"Cache-Control": "no-store"})

    @app.get("/v1/memory/state/{conversation_id}")
    async def memory_state(conversation_id: str, request: Request,
                           authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = request.app.state.delta_store
        if store is None:
            raise HTTPException(503, "Conversation memory sync is disabled")
        try:
            result = store.get_state(conversation_id)
        except ValueError as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory state read failed")
            raise HTTPException(503, "Conversation memory store is unavailable") from None
        return JSONResponse(result, headers={"Cache-Control": "no-store"})

    @app.delete("/v1/memory/state/{conversation_id}")
    async def delete_memory_state(conversation_id: str, request: Request,
                                  authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = request.app.state.delta_store
        if store is None:
            raise HTTPException(503, "Conversation memory sync is disabled")
        try:
            existed = store.delete_state(conversation_id)
        except ValueError as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory state deletion failed")
            raise HTTPException(503, "Conversation memory store is unavailable") from None
        return JSONResponse({"status": "deleted" if existed else "not_found"},
                            headers={"Cache-Control": "no-store"})

    @app.post("/v1/memory/delta")
    async def memory_delta(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = request.app.state.delta_store
        if store is None:
            raise HTTPException(503, "Conversation memory sync is disabled")
        body = await read_limited_body(request, min(config.max_body_bytes, config.memory_max_state_bytes))
        try:
            payload = json.loads(body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise HTTPException(400, "Request body must be valid UTF-8 JSON") from None
        if not isinstance(payload, dict) or set(payload) != {"conversation_id", "base_revision", "patch"}:
            raise HTTPException(400, "Expected conversation_id, base_revision, and patch")
        try:
            result = store.sync_delta(payload["conversation_id"], payload["base_revision"], payload["patch"])
        except ValueError as exc:
            try:
                from .memory.delta_sync import RevisionConflict
            except ImportError:
                from memory.delta_sync import RevisionConflict
            if isinstance(exc, RevisionConflict):
                raise HTTPException(409, "Memory revision conflict; fetch current state and reconcile") from None
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory delta write failed")
            raise HTTPException(503, "Conversation memory store is unavailable") from None
        return JSONResponse(result, headers={"Cache-Control": "no-store"})

    @app.post("/v1/rag/ingest")
    async def rag_ingest(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = request.app.state.rag_store
        if store is None:
            raise HTTPException(503, "RAG ingestion is disabled")
        body = await read_limited_body(request, config.max_body_bytes)
        try:
            payload = json.loads(body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise HTTPException(400, "Request body must be valid UTF-8 JSON") from None
        if not isinstance(payload, dict) or set(payload) != {"document_id", "source_uri", "chunks", "scope", "scope_id"}:
            raise HTTPException(400, "Expected document_id, source_uri, chunks, scope, and scope_id")
        try:
            inserted = store.ingest_document(payload["document_id"], payload["source_uri"], payload["chunks"],
                                             scope=payload["scope"], scope_id=payload["scope_id"])
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("RAG document ingest failed")
            raise HTTPException(503, "RAG index is unavailable") from None
        return JSONResponse({"status": "indexed", "chunks": inserted},
                            headers={"Cache-Control": "no-store"})

    @app.delete("/v1/rag/documents/{document_id}")
    async def rag_delete_document(document_id: str, request: Request, scope: str, scope_id: str,
                                  authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = request.app.state.rag_store
        if store is None:
            raise HTTPException(503, "RAG index is disabled")
        try:
            deleted = store.delete_document(document_id, scope=scope, scope_id=scope_id)
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("RAG source deletion failed")
            raise HTTPException(503, "RAG index is unavailable") from None
        return JSONResponse({"status": "deleted" if deleted else "not_found"},
                            headers={"Cache-Control": "no-store"})

    @app.post("/v1/rag/retrieve")
    async def rag_retrieve(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = request.app.state.rag_store
        if store is None:
            raise HTTPException(503, "RAG retrieval is disabled")
        body = await read_limited_body(request, min(config.max_body_bytes, 64 * 1024))
        try:
            payload = json.loads(body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise HTTPException(400, "Request body must be valid UTF-8 JSON") from None
        if not isinstance(payload, dict) or set(payload) - {"query", "scope", "scope_id", "top_k"}:
            raise HTTPException(400, "Unexpected RAG query fields")
        if not isinstance(payload.get("query"), str) or len(payload["query"]) > 8_000:
            raise HTTPException(400, "query must be a string of at most 8000 characters")
        started = time.perf_counter()
        try:
            chunks = store.retrieve(payload["query"], scope=payload.get("scope"),
                                    scope_id=payload.get("scope_id"), top_k=payload.get("top_k", 5))
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("RAG retrieval failed")
            raise HTTPException(503, "RAG index is unavailable") from None
        return JSONResponse({"chunks": chunks, "retrieval_latency_ms": round((time.perf_counter() - started) * 1000, 2),
                             "algorithm": "sqlite_fts5_plus_lexical_concept_graph"},
                            headers={"Cache-Control": "no-store"})

    @app.post("/v1/chat/completions")
    async def completions(request: Request, authorization: str | None = Header(default=None)) -> Response:
        authorize(config, authorization)
        body = await read_limited_body(request, config.max_body_bytes)
        try:
            payload, stream = validate_payload(json.loads(body), config.allowed_models)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise HTTPException(400, "Request body must be valid UTF-8 JSON") from None

        # Very narrow deterministic fast path. General questions always use the main model;
        # no small-model confidence score is treated as evidence of factual correctness.
        if config.fast_routing_enabled:
            try:
                from .routing import IntentRouter
            except ImportError:  # supports "uvicorn app:app" from the gateway directory
                from routing import IntentRouter
            routed = IntentRouter().response_for(payload)
            if routed is not None:
                return JSONResponse(routed, headers={
                    "Cache-Control": "no-store", "X-AI-Cache": "BYPASS", "X-AI-Route": "exact_template"
                })

        cache_key: str | None = None
        if not should_bypass_cache(config, payload, method=request.method,
                                   path="chat/completions", headers=request.headers):
            cache_key = canonical_cache_key(config, payload, method=request.method,
                                            path="chat/completions", query=request.url.query)
            cached = cache_get(config, cache_key)
            if cached is not None:
                return JSONResponse(cached, headers={"Cache-Control": "no-store", "X-AI-Cache": "HIT"})

        semaphore: asyncio.Semaphore = request.app.state.semaphore
        try:
            await asyncio.wait_for(semaphore.acquire(), timeout=0.05)
        except asyncio.TimeoutError:
            return JSONResponse(status_code=429, content={"error": {"message": "Gateway busy; retry shortly.",
                                                                    "type": "rate_limit_error"}},
                                headers={"Retry-After": "3"})
        client: httpx.AsyncClient = request.app.state.client
        try:
            upstream = await client.send(client.build_request(
                "POST", f"{config.ollama_base_url}/v1/chat/completions",
                content=json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
                headers={"Content-Type": "application/json", "Accept": "text/event-stream" if stream else "application/json"},
            ), stream=True)
        except (httpx.HTTPError, asyncio.TimeoutError):
            semaphore.release()
            logger.warning("Ollama chat request failed before response; request body omitted")
            return JSONResponse(status_code=502, content={"error": {"message": "Local model backend is unavailable.",
                                                                    "type": "upstream_error"}})
        if upstream.status_code >= 400:
            status = upstream.status_code
            await upstream.aclose()
            semaphore.release()
            logger.warning("Ollama rejected chat request with HTTP %s", status)
            error_response = upstream_error(status)
            error_response.headers["X-AI-Cache"] = "BYPASS"
            error_response.headers["Cache-Control"] = "no-store"
            return error_response
        if stream:
            async def forward_stream():
                try:
                    async for chunk in upstream.aiter_bytes():
                        yield chunk
                except httpx.HTTPError:
                    logger.warning("Ollama stream interrupted; request body omitted")
                    yield b'data: {"error":{"message":"Local model stream interrupted","type":"upstream_error"}}\n\n'
                finally:
                    await upstream.aclose()
                    semaphore.release()
            return StreamingResponse(forward_stream(), status_code=upstream.status_code,
                                     media_type="text/event-stream",
                                     headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no",
                                              "X-AI-Cache": "BYPASS"})
        try:
            response_body = await upstream.aread()
            cache_label = "MISS" if cache_key else "BYPASS"
            if cache_key and "application/json" in upstream.headers.get("content-type", "").lower():
                try:
                    parsed_response = json.loads(response_body)
                    if response_is_complete_text(parsed_response):
                        cache_put(config, cache_key, parsed_response)
                except (json.JSONDecodeError, UnicodeDecodeError, TypeError):
                    pass
            return Response(content=response_body, status_code=upstream.status_code,
                            media_type="application/json",
                            headers={"Cache-Control": "no-store", "X-AI-Cache": cache_label})
        except httpx.HTTPError:
            logger.warning("Ollama response body failed; request body omitted")
            return JSONResponse(status_code=502, content={"error": {"message": "Local response could not be read.",
                                                                    "type": "upstream_error"}},
                                headers={"Cache-Control": "no-store", "X-AI-Cache": "BYPASS"})
        finally:
            await upstream.aclose()
            semaphore.release()

    try:
        from .security.google_oauth import build_google_oauth_router
    except ImportError:  # supports "uvicorn app:app" from the gateway directory
        from security.google_oauth import build_google_oauth_router
    app.include_router(build_google_oauth_router(config, authorize))

    return app


app = create_app()
