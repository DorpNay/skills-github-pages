"""Small authenticated OpenAI-compatible gateway for a private Ollama instance.

This service never executes tools, fetches arbitrary URLs, or stores prompt contents.
"""
from __future__ import annotations
import asyncio
import json
import logging
import os
import secrets
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import AsyncIterator
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
        return cls(
            api_key=os.getenv("ALANDI_API_KEY", "").strip(),
            ollama_base_url=base,
            allowed_models=models,
            cors_origins=origins,
            max_body_bytes=int_env("ALANDI_MAX_BODY_BYTES", 8 * 1024 * 1024),
            upstream_timeout_seconds=timeout,
            max_inflight_requests=int_env("ALANDI_MAX_INFLIGHT_REQUESTS", 1),
            model_context_length_tokens=int_env("ALANDI_MODEL_CONTEXT_LENGTH_TOKENS", 4096, 256),
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


def create_app(settings: Settings | None = None, transport: httpx.AsyncBaseTransport | None = None) -> FastAPI:
    config = settings or Settings.from_env()
    timeout = httpx.Timeout(connect=min(10.0, config.upstream_timeout_seconds),
                            read=config.upstream_timeout_seconds, write=30.0, pool=10.0)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        app.state.client = httpx.AsyncClient(timeout=timeout, transport=transport)
        app.state.semaphore = asyncio.Semaphore(config.max_inflight_requests)
        yield
        await app.state.client.aclose()

    app = FastAPI(title="aLandi Lite Gateway", version="0.1.0",
                  docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan)
    app.state.settings = config
    app.add_middleware(CORSMiddleware, allow_origins=list(config.cors_origins),
                       allow_credentials=False, allow_methods=["GET", "POST", "OPTIONS"],
                       allow_headers=["Authorization", "Content-Type", "Accept"], max_age=600)

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

    @app.post("/v1/chat/completions")
    async def completions(request: Request, authorization: str | None = Header(default=None)) -> Response:
        authorize(config, authorization)
        body = await read_limited_body(request, config.max_body_bytes)
        try:
            payload, stream = validate_payload(json.loads(body), config.allowed_models)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise HTTPException(400, "Request body must be valid UTF-8 JSON") from None

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
            return upstream_error(status)
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
                                     headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
        try:
            response_body = await upstream.aread()
            return Response(content=response_body, status_code=upstream.status_code,
                            media_type="application/json")
        except httpx.HTTPError:
            logger.warning("Ollama response body failed; request body omitted")
            return JSONResponse(status_code=502, content={"error": {"message": "Local response could not be read.",
                                                                    "type": "upstream_error"}})
        finally:
            await upstream.aclose()
            semaphore.release()

    return app


app = create_app()
