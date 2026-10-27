"""Small authenticated OpenAI-compatible gateway for a private Ollama instance.

This service never executes tools, fetches arbitrary URLs, or stores prompt contents.
"""
from __future__ import annotations
import asyncio
import hashlib
import io
import json
import logging
import os
import posixpath
import re
import secrets
import sqlite3
import tempfile
import time
import zipfile
import xml.etree.ElementTree as ET
from contextlib import asynccontextmanager, closing
from dataclasses import asdict, dataclass
from functools import wraps
from typing import Any, AsyncIterator, Mapping
from urllib.parse import urlsplit

import httpx
from pypdf import PdfReader
from fastapi import FastAPI, Header, HTTPException, Query, Request
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


def validate_fixed_service_base_url(value: str, name: str) -> str:
    """Validate a fixed operator-configured service URL; callers must never accept it per request."""
    if not isinstance(value, str) or not value or len(value) > 2048 or any(ord(char) < 32 for char in value):
        raise ValueError(f"{name} must be a bounded fixed HTTP(S) URL")
    parsed = urlsplit(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc or parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise ValueError(f"{name} must be a fixed HTTP(S) base URL without credentials, query or fragment")
    try:
        parsed.port
    except ValueError as exc:
        raise ValueError(f"{name} has an invalid port") from exc
    return value.rstrip("/")


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
    memory_graph_enabled: bool = False
    memory_graph_path: str = "/var/lib/alandi-gateway/memory-graph.sqlite3"
    global_memory_enabled: bool = False
    rag_enabled: bool = False
    rag_path: str = "/var/lib/alandi-gateway/rag.sqlite3"
    rag_max_chunk_chars: int = 20_000
    # Optional fixed SearXNG service; disabled until the operator deploys and verifies it.
    searxng_enabled: bool = False
    searxng_base_url: str = ""
    searxng_max_results: int = 5
    # Optional local whisper.cpp CLI; no remote ASR provider is contacted.
    audio_transcription_enabled: bool = False
    audio_transcription_binary: str = ""
    audio_transcription_model: str = ""
    audio_transcription_ffprobe_binary: str = "/usr/bin/ffprobe"
    audio_transcription_ffmpeg_binary: str = "/usr/bin/ffmpeg"
    audio_transcription_max_bytes: int = 15 * 1024 * 1024
    audio_transcription_timeout_seconds: int = 120
    # Optional local Piper TTS CLI; model and voice are installed by the operator.
    audio_speech_enabled: bool = False
    audio_speech_binary: str = ""
    audio_speech_model: str = ""
    audio_speech_data_dir: str = ""
    audio_speech_timeout_seconds: int = 60
    # Local bounded document extraction; no file persistence or remote parser.
    document_extraction_enabled: bool = False
    document_extraction_max_bytes: int = 8 * 1024 * 1024
    document_extraction_max_chars: int = 80_000
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
        searxng_enabled = bool_env("ALANDI_SEARXNG_ENABLED", False)
        searxng_base_url = os.getenv("ALANDI_SEARXNG_BASE_URL", "").strip()
        if searxng_base_url:
            searxng_base_url = validate_fixed_service_base_url(searxng_base_url, "ALANDI_SEARXNG_BASE_URL")
        if searxng_enabled and not searxng_base_url:
            raise ValueError("ALANDI_SEARXNG_ENABLED requires ALANDI_SEARXNG_BASE_URL")
        audio_transcription_enabled = bool_env("ALANDI_AUDIO_TRANSCRIPTION_ENABLED", False)
        audio_transcription_binary = os.getenv("ALANDI_AUDIO_TRANSCRIPTION_BINARY", "").strip()
        audio_transcription_model = os.getenv("ALANDI_AUDIO_TRANSCRIPTION_MODEL", "").strip()
        audio_transcription_ffprobe_binary = os.getenv("ALANDI_AUDIO_TRANSCRIPTION_FFPROBE_BINARY", "/usr/bin/ffprobe").strip()
        audio_transcription_ffmpeg_binary = os.getenv("ALANDI_AUDIO_TRANSCRIPTION_FFMPEG_BINARY", "/usr/bin/ffmpeg").strip()
        if audio_transcription_enabled and not (audio_transcription_binary and audio_transcription_model and audio_transcription_ffprobe_binary and audio_transcription_ffmpeg_binary):
            raise ValueError("ALANDI_AUDIO_TRANSCRIPTION_ENABLED requires local ASR, ffprobe, ffmpeg and model paths")
        audio_speech_enabled = bool_env("ALANDI_AUDIO_SPEECH_ENABLED", False)
        audio_speech_binary = os.getenv("ALANDI_AUDIO_SPEECH_BINARY", "").strip()
        audio_speech_model = os.getenv("ALANDI_AUDIO_SPEECH_MODEL", "").strip()
        audio_speech_data_dir = os.getenv("ALANDI_AUDIO_SPEECH_DATA_DIR", "").strip()
        if audio_speech_enabled and not (audio_speech_binary and audio_speech_model and audio_speech_data_dir):
            raise ValueError("ALANDI_AUDIO_SPEECH_ENABLED requires Python executable, Piper voice name and data directory")
        if audio_speech_model and (os.path.basename(audio_speech_model) != audio_speech_model or not all(char.isalnum() or char in "._-" for char in audio_speech_model)):
            raise ValueError("ALANDI_AUDIO_SPEECH_MODEL must be a voice name, not a path")
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
            memory_graph_enabled=bool_env("ALANDI_MEMORY_GRAPH_ENABLED", False),
            memory_graph_path=os.getenv("ALANDI_MEMORY_GRAPH_PATH", "/var/lib/alandi-gateway/memory-graph.sqlite3").strip() or "/var/lib/alandi-gateway/memory-graph.sqlite3",
            global_memory_enabled=bool_env("ALANDI_GLOBAL_MEMORY_ENABLED", False),
            rag_enabled=bool_env("ALANDI_RAG_ENABLED", False),
            rag_path=os.getenv("ALANDI_RAG_PATH", "/var/lib/alandi-gateway/rag.sqlite3").strip() or "/var/lib/alandi-gateway/rag.sqlite3",
            rag_max_chunk_chars=int_env("ALANDI_RAG_MAX_CHUNK_CHARS", 20_000, 100),
            searxng_enabled=searxng_enabled,
            searxng_base_url=searxng_base_url,
            searxng_max_results=int_env("ALANDI_SEARXNG_MAX_RESULTS", 5, 1),
            audio_transcription_enabled=audio_transcription_enabled,
            audio_transcription_binary=audio_transcription_binary,
            audio_transcription_model=audio_transcription_model,
            audio_transcription_ffprobe_binary=audio_transcription_ffprobe_binary,
            audio_transcription_ffmpeg_binary=audio_transcription_ffmpeg_binary,
            audio_transcription_max_bytes=int_env("ALANDI_AUDIO_TRANSCRIPTION_MAX_BYTES", 15 * 1024 * 1024, 1024),
            audio_transcription_timeout_seconds=int_env("ALANDI_AUDIO_TRANSCRIPTION_TIMEOUT_SECONDS", 120, 1),
            audio_speech_enabled=audio_speech_enabled,
            audio_speech_binary=audio_speech_binary,
            audio_speech_model=audio_speech_model,
            audio_speech_data_dir=audio_speech_data_dir,
            audio_speech_timeout_seconds=int_env("ALANDI_AUDIO_SPEECH_TIMEOUT_SECONDS", 60, 1),
            document_extraction_enabled=bool_env("ALANDI_DOCUMENT_EXTRACTION_ENABLED", False),
            document_extraction_max_bytes=int_env("ALANDI_DOCUMENT_EXTRACTION_MAX_BYTES", 8 * 1024 * 1024, 1024),
            document_extraction_max_chars=int_env("ALANDI_DOCUMENT_EXTRACTION_MAX_CHARS", 80_000, 1000),
            model_size_advisory_mb=int_env(model_size_budget_env, 6144, 256),
            oauth_enabled=oauth_enabled,
            oauth_path=os.getenv("OAUTH_TOKEN_VAULT_PATH", "/var/lib/alandi-gateway/oauth.sqlite3").strip() or "/var/lib/alandi-gateway/oauth.sqlite3",
            oauth_encryption_key=oauth_encryption_key,
            google_oauth_client_id=google_oauth_client_id,
            google_oauth_client_secret=google_oauth_client_secret,
            google_oauth_redirect_uri=google_oauth_redirect_uri,
            oauth_success_redirect=oauth_success_redirect,
        )


def local_audio_limited(settings: Settings):
    """Serialize expensive local audio jobs and reject excess work without queueing."""
    def decorate(endpoint):
        @wraps(endpoint)
        async def wrapped(request: Request, *args, **kwargs):
            authorize(settings, kwargs.get("authorization"))
            # Share the gateway-wide slot with Ollama to avoid overlapping model memory peaks.
            semaphore = request.app.state.semaphore
            if semaphore.locked():
                raise HTTPException(429, "Another local audio job is already running")
            async with semaphore:
                return await endpoint(request, *args, **kwargs)
        return wrapped
    return decorate


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



DOCUMENT_TEXT_EXTENSIONS = {".txt", ".md", ".csv", ".json"}
DOCUMENT_ARCHIVE_EXTENSIONS = {".docx", ".xlsx"}
DOCUMENT_ALLOWED_EXTENSIONS = DOCUMENT_TEXT_EXTENSIONS | DOCUMENT_ARCHIVE_EXTENSIONS | {".pdf"}
DOCUMENT_MAX_ARCHIVE_ENTRIES = 500
DOCUMENT_MAX_EXPANDED_BYTES = 20 * 1024 * 1024


def _bounded_zip_entries(data: bytes) -> tuple[zipfile.ZipFile, dict[str, zipfile.ZipInfo]]:
    try:
        archive = zipfile.ZipFile(io.BytesIO(data))
        entries = archive.infolist()
    except (zipfile.BadZipFile, OSError, ValueError):
        raise HTTPException(400, "Document archive is invalid") from None
    if len(entries) > DOCUMENT_MAX_ARCHIVE_ENTRIES:
        archive.close()
        raise HTTPException(413, "Document archive has too many entries")
    total = 0
    indexed: dict[str, zipfile.ZipInfo] = {}
    for entry in entries:
        name = entry.filename
        if name.startswith("/") or "\\" in name or any(part == ".." for part in name.split("/")):
            archive.close()
            raise HTTPException(400, "Document archive contains an unsafe path")
        if entry.flag_bits & 0x1:
            archive.close()
            raise HTTPException(400, "Encrypted document archives are not supported")
        total += entry.file_size
        if total > DOCUMENT_MAX_EXPANDED_BYTES:
            archive.close()
            raise HTTPException(413, "Expanded document archive exceeds the permitted size")
        if entry.file_size > 1024 * 1024 and entry.file_size > max(entry.compress_size, 1) * 200:
            archive.close()
            raise HTTPException(413, "Document archive compression ratio is too high")
        indexed[name] = entry
    return archive, indexed


def _xml_from_archive(archive: zipfile.ZipFile, entries: dict[str, zipfile.ZipInfo], name: str) -> ET.Element:
    entry = entries.get(name)
    if entry is None or entry.file_size > DOCUMENT_MAX_EXPANDED_BYTES:
        raise HTTPException(400, "Document is missing a required XML part")
    try:
        with archive.open(entry) as stream:
            return ET.fromstring(stream.read(DOCUMENT_MAX_EXPANDED_BYTES + 1))
    except (ET.ParseError, OSError, RuntimeError, ValueError):
        raise HTTPException(400, "Document XML is invalid") from None


def _extract_docx(data: bytes) -> str:
    archive, entries = _bounded_zip_entries(data)
    try:
        if "[Content_Types].xml" not in entries or "word/document.xml" not in entries:
            raise HTTPException(400, "DOCX package is missing required parts")
        root = _xml_from_archive(archive, entries, "word/document.xml")
        texts = []
        for paragraph in root.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
            value = "".join(node.text or "" for node in paragraph.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"))
            if value:
                texts.append(value)
        return "\n".join(texts)
    finally:
        archive.close()


def _extract_xlsx(data: bytes) -> str:
    archive, entries = _bounded_zip_entries(data)
    try:
        if "[Content_Types].xml" not in entries or "xl/workbook.xml" not in entries or "xl/_rels/workbook.xml.rels" not in entries:
            raise HTTPException(400, "XLSX package is missing required parts")
        workbook = _xml_from_archive(archive, entries, "xl/workbook.xml")
        relationships = _xml_from_archive(archive, entries, "xl/_rels/workbook.xml.rels")
        rel_ns = "{http://schemas.openxmlformats.org/package/2006/relationships}"
        rel_targets = {node.attrib.get("Id"): node.attrib.get("Target", "") for node in relationships.iter(rel_ns + "Relationship")}
        sheets_ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
        document_ns = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
        shared: list[str] = []
        if "xl/sharedStrings.xml" in entries:
            shared_root = _xml_from_archive(archive, entries, "xl/sharedStrings.xml")
            shared = ["".join(node.text or "" for node in item.iter(sheets_ns + "t")) for item in shared_root.iter(sheets_ns + "si")]
        output: list[str] = []
        sheets = list(workbook.iter(sheets_ns + "sheet"))
        if not sheets:
            raise HTTPException(400, "XLSX workbook contains no sheets")
        for sheet in sheets[:20]:
            rel_id = sheet.attrib.get(document_ns + "id", "")
            target = rel_targets.get(rel_id, "")
            if not target or target.startswith("/") or "\\" in target:
                raise HTTPException(400, "XLSX workbook contains an unsafe worksheet reference")
            path = posixpath.normpath(posixpath.join("xl", target))
            if not path.startswith("xl/") or path not in entries:
                raise HTTPException(400, "XLSX worksheet reference is invalid")
            root = _xml_from_archive(archive, entries, path)
            output.append("[Sheet: " + sheet.attrib.get("name", "Sheet") + "]")
            for row in root.iter(sheets_ns + "row"):
                values = []
                for cell in row.findall(sheets_ns + "c"):
                    cell_type = cell.attrib.get("t", "")
                    value_node = cell.find(sheets_ns + "v")
                    value = value_node.text if value_node is not None and value_node.text is not None else ""
                    if cell_type == "s":
                        try:
                            value = shared[int(value)]
                        except (ValueError, IndexError):
                            raise HTTPException(400, "XLSX shared-string reference is invalid") from None
                    elif cell_type == "inlineStr":
                        inline = cell.find(sheets_ns + "is")
                        value = "".join(node.text or "" for node in inline.iter(sheets_ns + "t")) if inline is not None else ""
                    if value:
                        values.append(f"{cell.attrib.get('r', '')}={value}")
                if values:
                    output.append(" | ".join(values))
        return "\n".join(output)
    finally:
        archive.close()


def extract_local_document(filename: str, data: bytes, max_chars: int) -> tuple[str, str]:
    extension = os.path.splitext(filename)[1].lower()
    if extension not in DOCUMENT_ALLOWED_EXTENSIONS:
        raise HTTPException(415, "Supported formats: PDF, DOCX, XLSX, TXT, MD, CSV and JSON")
    if not data:
        raise HTTPException(400, "Document body is empty")
    if extension in DOCUMENT_TEXT_EXTENSIONS:
        if data.startswith((b"\\xff\\xfe", b"\\xfe\\xff")):
            raise HTTPException(415, "Only UTF-8 text documents are supported")
        try:
            text = data.decode("utf-8-sig", errors="strict")
        except UnicodeDecodeError:
            raise HTTPException(415, "Text document must be UTF-8 encoded") from None
        parser = "local-utf8"
    elif extension == ".pdf":
        if not data.startswith(b"%PDF-"):
            raise HTTPException(400, "PDF signature is invalid")
        try:
            reader = PdfReader(io.BytesIO(data), strict=False)
            if reader.is_encrypted:
                raise HTTPException(415, "Encrypted PDFs are not supported")
            if len(reader.pages) > 40:
                raise HTTPException(413, "PDF exceeds the 40-page extraction limit")
            parts = []
            for page in reader.pages:
                parts.append(page.extract_text() or "")
                if sum(len(part) for part in parts) > max_chars:
                    break
            text = "\n\n".join(parts)
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(400, "PDF could not be parsed") from None
        parser = "local-pypdf"
    elif extension == ".docx":
        if not data.startswith(b"PK"):
            raise HTTPException(400, "DOCX archive signature is invalid")
        text = _extract_docx(data)
        parser = "local-docx-xml"
    else:
        if not data.startswith(b"PK"):
            raise HTTPException(400, "XLSX archive signature is invalid")
        text = _extract_xlsx(data)
        parser = "local-xlsx-xml"
    text = text.replace("\x00", "").strip()
    if not text:
        raise HTTPException(422, "No extractable text was found; scanned PDFs need a separate local OCR runtime")
    if len(text) > max_chars:
        text = text[:max_chars]
    return text, parser

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
        app.state.memory_graph_store = None
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
        if config.memory_graph_enabled:
            try:
                from .memory.manager import MemoryManager
            except ImportError:  # supports "uvicorn app:app" from the gateway directory
                from memory.manager import MemoryManager
            app.state.memory_graph_store = MemoryManager(config.memory_graph_path)
            app.state.memory_graph_store.initialize()
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
                       allow_headers=["Authorization", "Content-Type", "Accept", "Cache-Control", "X-AI-Cache-Bypass", "X-AI-Trace-ID", "traceparent"],
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

    def memory_graph_store_or_503(request: Request):
        store = request.app.state.memory_graph_store
        if store is None:
            raise HTTPException(503, "Structured memory graph is disabled")
        return store

    def validate_memory_graph_scope(store, scope: object, scope_id: object, global_opt_in: object = False):
        if type(global_opt_in) is not bool:
            raise HTTPException(400, "global_opt_in must be a boolean")
        try:
            ref = store._scope(scope, scope_id)
        except ValueError as exc:
            raise HTTPException(400, str(exc)) from None
        if ref.kind == "global":
            if not config.global_memory_enabled or global_opt_in is not True:
                raise HTTPException(403, "Global memory requires ALANDI_GLOBAL_MEMORY_ENABLED and explicit global_opt_in=true")
        elif global_opt_in is True:
            raise HTTPException(400, "global_opt_in is only valid for global scope")
        return ref

    async def read_memory_graph_payload(request: Request) -> dict[str, Any]:
        body = await read_limited_body(request, min(config.max_body_bytes, 64 * 1024))
        try:
            payload = json.loads(body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise HTTPException(400, "Request body must be valid UTF-8 JSON") from None
        if not isinstance(payload, dict):
            raise HTTPException(400, "Request body must be a JSON object")
        return payload

    @app.get("/v1/memory/graph/nodes")
    async def memory_graph_list_nodes(request: Request, scope: str, scope_id: str,
                                      statuses: str = "confirmed", limit: int = 100,
                                      node_type: str | None = None, valid_at: str | None = None,
                                      recorded_at: str | None = None, global_opt_in: bool = False,
                                      authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = memory_graph_store_or_503(request)
        ref = validate_memory_graph_scope(store, scope, scope_id, global_opt_in)
        if not isinstance(statuses, str) or len(statuses) > 180:
            raise HTTPException(400, "statuses must be a bounded comma-separated list")
        selected_statuses = () if statuses == "all" else tuple(part.strip() for part in statuses.split(",") if part.strip())
        if statuses != "all" and (not selected_statuses or len(selected_statuses) > 5):
            raise HTTPException(400, "statuses must name 1 to 5 statuses or 'all'")
        try:
            nodes = store.list_nodes(scope=ref.kind, scope_id=ref.scope_id, statuses=selected_statuses,
                                     node_type=node_type, limit=limit, valid_at=valid_at, recorded_at=recorded_at)
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory graph list failed")
            raise HTTPException(503, "Memory graph is unavailable") from None
        return JSONResponse({"scope": ref.kind, "scope_id": ref.scope_id,
                             "nodes": [asdict(node) for node in nodes], "count": len(nodes)},
                            headers={"Cache-Control": "no-store"})

    @app.post("/v1/memory/graph/nodes")
    async def memory_graph_add_node(request: Request,
                                    authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = memory_graph_store_or_503(request)
        payload = await read_memory_graph_payload(request)
        required = {"content", "scope", "scope_id", "source_kind", "source_id"}
        allowed = required | {"node_type", "confidence", "sensitivity", "valid_from", "valid_until",
                             "source_uri", "source_text", "metadata", "global_opt_in"}
        if required - set(payload) or set(payload) - allowed:
            raise HTTPException(400, "Expected content, scope, scope_id, source_kind and source_id; unknown fields are rejected")
        ref = validate_memory_graph_scope(store, payload["scope"], payload["scope_id"],
                                         payload.get("global_opt_in", False))
        try:
            # New external facts always start as candidates; only the review endpoint can confirm/reject.
            node = store.add_fact(payload["content"], scope=ref.kind, scope_id=ref.scope_id,
                                  source_kind=payload["source_kind"], source_id=payload["source_id"],
                                  node_type=payload.get("node_type", "FACT"),
                                  confidence=payload.get("confidence", 0.5),
                                  sensitivity=payload.get("sensitivity", "normal"),
                                  valid_from=payload.get("valid_from"), valid_until=payload.get("valid_until"),
                                  source_uri=payload.get("source_uri"), source_text=payload.get("source_text"),
                                  metadata=payload.get("metadata"))
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory graph node create failed")
            raise HTTPException(503, "Memory graph is unavailable") from None
        return JSONResponse({"node": asdict(node)}, status_code=201, headers={"Cache-Control": "no-store"})

    @app.post("/v1/memory/graph/search")
    async def memory_graph_search(request: Request,
                                  authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = memory_graph_store_or_503(request)
        payload = await read_memory_graph_payload(request)
        allowed = {"query", "scope", "scope_id", "statuses", "node_type", "limit",
                   "valid_at", "recorded_at", "global_opt_in"}
        if not {"query", "scope", "scope_id"}.issubset(payload) or set(payload) - allowed:
            raise HTTPException(400, "Expected query, scope, scope_id and only documented optional fields")
        ref = validate_memory_graph_scope(store, payload["scope"], payload["scope_id"],
                                         payload.get("global_opt_in", False))
        statuses = payload.get("statuses", ["confirmed"])
        if not isinstance(statuses, list) or not 1 <= len(statuses) <= 5 or any(not isinstance(s, str) for s in statuses):
            raise HTTPException(400, "statuses must be a list of 1 to 5 status strings")
        node_type = payload.get("node_type")
        if node_type is not None and (not isinstance(node_type, str) or len(node_type) > 48):
            raise HTTPException(400, "node_type must be a string of at most 48 characters")
        try:
            nodes = store.search_nodes(payload["query"], scope=ref.kind, scope_id=ref.scope_id,
                                       statuses=tuple(statuses), node_type=node_type,
                                       limit=payload.get("limit", 10), valid_at=payload.get("valid_at"),
                                       recorded_at=payload.get("recorded_at"))
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory graph search failed")
            raise HTTPException(503, "Memory graph is unavailable") from None
        return JSONResponse({"scope": ref.kind, "scope_id": ref.scope_id,
                             "nodes": [asdict(node) for node in nodes], "count": len(nodes)},
                            headers={"Cache-Control": "no-store"})

    @app.post("/v1/memory/graph/nodes/{node_id}/review")
    async def memory_graph_review_node(node_id: str, request: Request,
                                       authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = memory_graph_store_or_503(request)
        payload = await read_memory_graph_payload(request)
        required = {"scope", "scope_id", "status", "reason_code"}
        allowed = required | {"global_opt_in"}
        if required - set(payload) or set(payload) - allowed:
            raise HTTPException(400, "Expected scope, scope_id, status and reason_code only")
        ref = validate_memory_graph_scope(store, payload["scope"], payload["scope_id"],
                                         payload.get("global_opt_in", False))
        try:
            node = store.review_node(node_id, scope=ref.kind, scope_id=ref.scope_id,
                                    status=payload["status"], reason_code=payload["reason_code"])
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory graph review failed")
            raise HTTPException(503, "Memory graph is unavailable") from None
        return JSONResponse({"node": asdict(node)}, headers={"Cache-Control": "no-store"})

    @app.post("/v1/memory/graph/relations")
    async def memory_graph_relate(request: Request,
                                  authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = memory_graph_store_or_503(request)
        payload = await read_memory_graph_payload(request)
        required = {"scope", "scope_id", "relation_type", "evidence_source_kind", "evidence_source_id"}
        allowed = required | {"source_id", "target_id", "old_node_id", "new_node_id", "confidence", "global_opt_in"}
        if required - set(payload) or set(payload) - allowed:
            raise HTTPException(400, "Expected scope, scope_id, relation_type and relation provenance; unknown fields are rejected")
        ref = validate_memory_graph_scope(store, payload["scope"], payload["scope_id"],
                                         payload.get("global_opt_in", False))
        relation_type = payload["relation_type"]
        try:
            if relation_type == "SUPERSEDES":
                if not {"old_node_id", "new_node_id"}.issubset(payload) or {"source_id", "target_id"} & set(payload):
                    raise HTTPException(400, "SUPERSEDES requires old_node_id and new_node_id")
                store.supersede(payload["old_node_id"], payload["new_node_id"], scope=ref.kind, scope_id=ref.scope_id,
                                evidence_source_kind=payload["evidence_source_kind"],
                                evidence_source_id=payload["evidence_source_id"])
            else:
                if not {"source_id", "target_id"}.issubset(payload) or {"old_node_id", "new_node_id"} & set(payload):
                    raise HTTPException(400, "This relation requires source_id and target_id")
                store.relate(payload["source_id"], payload["target_id"], scope=ref.kind, scope_id=ref.scope_id,
                             relation_type=relation_type, evidence_source_kind=payload["evidence_source_kind"],
                             evidence_source_id=payload["evidence_source_id"], confidence=payload.get("confidence", 1.0))
        except HTTPException:
            raise
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory graph relation create failed")
            raise HTTPException(503, "Memory graph is unavailable") from None
        return JSONResponse({"status": "relation_created"}, headers={"Cache-Control": "no-store"})

    @app.delete("/v1/memory/graph/nodes/{node_id}")
    async def memory_graph_delete_node(node_id: str, request: Request, scope: str, scope_id: str,
                                       global_opt_in: bool = False,
                                       authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        store = memory_graph_store_or_503(request)
        ref = validate_memory_graph_scope(store, scope, scope_id, global_opt_in)
        try:
            deleted = store.delete_with_propagation(node_id, scope=ref.kind, scope_id=ref.scope_id)
        except (ValueError, TypeError) as exc:
            raise HTTPException(400, str(exc)) from None
        except sqlite3.Error:
            logger.warning("Memory graph delete failed")
            raise HTTPException(503, "Memory graph is unavailable") from None
        if not deleted:
            raise HTTPException(404, "Memory node not found in the requested scope")
        return JSONResponse({"deleted_node_ids": deleted}, headers={"Cache-Control": "no-store"})

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

    @app.get("/v1/search/web")
    async def search_web(request: Request, q: str, limit: int = 5,
                         authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        if not config.searxng_enabled or not config.searxng_base_url:
            raise HTTPException(503, "SearXNG search is disabled")
        query = q.strip()
        if not query or len(query) > 300 or any(ord(char) < 32 for char in query):
            raise HTTPException(400, "q must contain 1 to 300 printable characters")
        if limit < 1 or limit > config.searxng_max_results:
            raise HTTPException(400, f"limit must be between 1 and {config.searxng_max_results}")
        try:
            async with request.app.state.client.stream(
                "GET", config.searxng_base_url + "/search",
                params={"q": query, "format": "json", "categories": "general", "safesearch": 1},
                headers={"Accept": "application/json"}, timeout=8.0, follow_redirects=False,
            ) as response:
                if response.status_code != 200:
                    logger.warning("Configured SearXNG returned HTTP %s", response.status_code)
                    raise HTTPException(502, "SearXNG returned an unsuccessful response")
                declared_length = response.headers.get("content-length", "")
                if declared_length.isdigit() and int(declared_length) > 1_000_000:
                    raise HTTPException(502, "SearXNG response exceeds 1 MB")
                body = bytearray()
                async for chunk in response.aiter_bytes():
                    body.extend(chunk)
                    if len(body) > 1_000_000:
                        raise HTTPException(502, "SearXNG response exceeds 1 MB")
        except httpx.TimeoutException:
            raise HTTPException(504, "SearXNG search timed out") from None
        except httpx.RequestError:
            logger.warning("Configured SearXNG request failed")
            raise HTTPException(502, "SearXNG search is unavailable") from None
        try:
            payload = json.loads(body)
        except (ValueError, UnicodeDecodeError):
            raise HTTPException(502, "SearXNG returned invalid JSON") from None
        raw_results = payload.get("results") if isinstance(payload, dict) else None
        if not isinstance(raw_results, list):
            raise HTTPException(502, "SearXNG response has no results array")
        results: list[dict[str, Any]] = []
        seen_urls: set[str] = set()
        for item in raw_results:
            if not isinstance(item, dict):
                continue
            raw_url = item.get("url")
            if not isinstance(raw_url, str) or len(raw_url) > 4096:
                continue
            parsed_url = urlsplit(raw_url)
            if parsed_url.scheme.lower() != "https" or not parsed_url.hostname or parsed_url.username or parsed_url.password:
                continue
            canonical_url = raw_url.strip()
            if canonical_url in seen_urls:
                continue
            seen_urls.add(canonical_url)
            engines = item.get("engines", [])
            if not isinstance(engines, list):
                engines = []
            results.append({
                "title": str(item.get("title") or "Untitled result").strip()[:300],
                "url": canonical_url,
                "snippet": str(item.get("content") or "").strip()[:1200],
                "engines": [str(engine)[:80] for engine in engines[:8] if isinstance(engine, str)],
                "published_at": str(item.get("publishedDate") or "")[:80] or None,
            })
            if len(results) >= limit:
                break
        return JSONResponse({"provider": "searxng", "query": query, "results": results, "count": len(results)},
                            headers={"Cache-Control": "no-store"})


    @app.post("/v1/documents/extract")
    async def extract_document(request: Request, filename: str = Query(min_length=1, max_length=255),
                               authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        if not config.document_extraction_enabled:
            raise HTTPException(503, "Local document extraction is disabled")
        if filename != os.path.basename(filename) or any(ord(char) < 32 for char in filename):
            raise HTTPException(400, "filename must be a plain file name")
        data = await read_limited_body(request, config.document_extraction_max_bytes)
        text, parser = extract_local_document(filename, data, config.document_extraction_max_chars)
        return JSONResponse({"filename": filename, "text": text, "parser": parser, "characters": len(text)},
                            headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})

    @app.post("/v1/audio/transcriptions")
    @local_audio_limited(config)
    async def transcribe_audio(request: Request, lang: str = "auto",
                               authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        if not config.audio_transcription_enabled:
            raise HTTPException(503, "Local audio transcription is disabled")
        if lang not in {"auto", "ru", "en", "th"}:
            raise HTTPException(400, "lang must be auto, ru, en or th")
        media_type = request.headers.get("content-type", "").split(";", 1)[0].strip().lower()
        suffix_by_type = {
            "audio/webm": ".webm", "audio/ogg": ".ogg", "audio/wav": ".wav",
            "audio/x-wav": ".wav", "audio/mpeg": ".mp3", "audio/mp4": ".m4a",
            "audio/aac": ".aac",
        }
        suffix = suffix_by_type.get(media_type)
        if not suffix:
            raise HTTPException(415, "Unsupported audio type; use WebM, Ogg, WAV, MP3, MP4/M4A or AAC")
        audio = await read_limited_body(request, config.audio_transcription_max_bytes)
        if not audio:
            raise HTTPException(400, "Audio body is empty")
        if not os.path.isfile(config.audio_transcription_binary) or not os.access(config.audio_transcription_binary, os.X_OK):
            raise HTTPException(503, "Configured local ASR executable is unavailable")
        if not os.path.isfile(config.audio_transcription_model):
            raise HTTPException(503, "Configured local ASR model file is unavailable")
        if not os.path.isfile(config.audio_transcription_ffprobe_binary) or not os.access(config.audio_transcription_ffprobe_binary, os.X_OK):
            raise HTTPException(503, "Configured local ffprobe executable is unavailable")
        if not os.path.isfile(config.audio_transcription_ffmpeg_binary) or not os.access(config.audio_transcription_ffmpeg_binary, os.X_OK):
            raise HTTPException(503, "Configured local ffmpeg executable is unavailable")
        with tempfile.TemporaryDirectory(prefix="alandi-asr-") as temp_dir:
            input_path = os.path.join(temp_dir, "audio" + suffix)
            normalized_path = os.path.join(temp_dir, "normalized.wav")
            output_prefix = os.path.join(temp_dir, "transcript")
            try:
                with open(input_path, "wb") as audio_file:
                    audio_file.write(audio)
                probe = await asyncio.create_subprocess_exec(
                    config.audio_transcription_ffprobe_binary, "-v", "error",
                    "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", input_path,
                    stdin=asyncio.subprocess.DEVNULL, stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.DEVNULL,
                )
                try:
                    probe_stdout, _ = await asyncio.wait_for(probe.communicate(), timeout=5)
                except asyncio.TimeoutError:
                    probe.kill()
                    await probe.wait()
                    raise HTTPException(504, "Audio validation timed out") from None
                if probe.returncode != 0 or len(probe_stdout) > 64:
                    raise HTTPException(400, "Audio container could not be validated")
                try:
                    duration_seconds = float(probe_stdout.strip())
                except ValueError:
                    raise HTTPException(400, "Audio duration is missing or invalid") from None
                if not 0 < duration_seconds <= 120:
                    raise HTTPException(413, "Audio duration must be between 0 and 120 seconds")
                converter = await asyncio.create_subprocess_exec(
                    config.audio_transcription_ffmpeg_binary, "-nostdin", "-v", "error", "-y",
                    "-i", input_path, "-map", "0:a:0", "-t", "120", "-vn", "-ac", "1", "-ar", "16000",
                    "-c:a", "pcm_s16le", "-f", "wav", normalized_path,
                    stdin=asyncio.subprocess.DEVNULL, stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL,
                )
                try:
                    await asyncio.wait_for(converter.wait(), timeout=10)
                except asyncio.TimeoutError:
                    converter.kill()
                    await converter.wait()
                    raise HTTPException(504, "Audio normalization timed out") from None
                if converter.returncode != 0 or not os.path.isfile(normalized_path):
                    raise HTTPException(400, "Audio could not be normalized to PCM WAV")
                try:
                    normalized_size = os.path.getsize(normalized_path)
                except OSError:
                    raise HTTPException(400, "Normalized audio is unavailable") from None
                if normalized_size < 44 or normalized_size > 4_000_000:
                    raise HTTPException(413, "Normalized audio is outside the permitted size")
                process = await asyncio.create_subprocess_exec(
                    config.audio_transcription_binary,
                    "-m", config.audio_transcription_model,
                    "-f", normalized_path,
                    "-l", lang,
                    "-otxt", "-of", output_prefix, "-nt",
                    stdin=asyncio.subprocess.DEVNULL,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL,
                )
                try:
                    await asyncio.wait_for(process.wait(), timeout=config.audio_transcription_timeout_seconds)
                except asyncio.TimeoutError:
                    process.kill()
                    await process.wait()
                    raise HTTPException(504, "Local transcription timed out") from None
                if process.returncode != 0:
                    raise HTTPException(502, "Local ASR process failed; check the local runtime configuration")
                transcript_path = output_prefix + ".txt"
                try:
                    with open(transcript_path, "r", encoding="utf-8") as transcript_file:
                        transcript = transcript_file.read(100_001).strip()
                except OSError:
                    raise HTTPException(502, "Local ASR did not produce a transcript") from None
                if len(transcript) > 100_000:
                    raise HTTPException(502, "Transcript exceeds the output limit")
                return JSONResponse({"text": transcript, "language": lang, "provider": "local-whisper.cpp"},
                                    headers={"Cache-Control": "no-store"})
            except OSError:
                raise HTTPException(503, "Could not start the configured local ASR executable") from None

    @app.post("/v1/audio/speech")
    @local_audio_limited(config)
    async def synthesize_speech(request: Request,
                                authorization: str | None = Header(default=None)) -> Response:
        authorize(config, authorization)
        if not config.audio_speech_enabled:
            raise HTTPException(503, "Local text-to-speech is disabled")
        body = await read_limited_body(request, 24 * 1024)
        try:
            payload = json.loads(body)
        except (ValueError, UnicodeDecodeError):
            raise HTTPException(400, "JSON body is invalid") from None
        if not isinstance(payload, dict) or not isinstance(payload.get("text"), str):
            raise HTTPException(400, "text must be a string")
        text = payload["text"].strip()
        if not text or len(text) > 5000 or any(ord(char) < 32 and char not in "\n\r\t" for char in text):
            raise HTTPException(400, "text must contain 1 to 5000 printable characters")
        if not os.path.isfile(config.audio_speech_binary) or not os.access(config.audio_speech_binary, os.X_OK):
            raise HTTPException(503, "Configured local TTS executable is unavailable")
        if not config.audio_speech_data_dir or not os.path.isdir(config.audio_speech_data_dir):
            raise HTTPException(503, "Configured local TTS voice directory is unavailable")
        voice_path = os.path.join(config.audio_speech_data_dir, config.audio_speech_model + ".onnx")
        if not os.path.isfile(voice_path) or not os.path.isfile(voice_path + ".json"):
            raise HTTPException(503, "Configured local TTS voice model or config is unavailable")
        with tempfile.TemporaryDirectory(prefix="alandi-tts-") as temp_dir:
            input_path = os.path.join(temp_dir, "input.txt")
            output_path = os.path.join(temp_dir, "speech.wav")
            try:
                with open(input_path, "x", encoding="utf-8") as text_file:
                    os.chmod(input_path, 0o600)
                    text_file.write(text)
                process = await asyncio.create_subprocess_exec(
                    config.audio_speech_binary, "-m", "piper",
                    "-m", config.audio_speech_model,
                    "--data-dir", config.audio_speech_data_dir,
                    "-f", output_path, "--input-file", input_path,
                    stdin=asyncio.subprocess.DEVNULL,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL,
                )
                try:
                    await asyncio.wait_for(process.wait(), timeout=config.audio_speech_timeout_seconds)
                except asyncio.TimeoutError:
                    process.kill()
                    await process.wait()
                    raise HTTPException(504, "Local speech synthesis timed out") from None
                if process.returncode != 0:
                    raise HTTPException(502, "Local TTS process failed; check the local runtime configuration")
                try:
                    with open(output_path, "rb") as audio_file:
                        audio = audio_file.read(25 * 1024 * 1024 + 1)
                except OSError:
                    raise HTTPException(502, "Local TTS did not produce an audio file") from None
                if len(audio) > 25 * 1024 * 1024:
                    raise HTTPException(502, "Generated audio exceeds the output limit")
                if len(audio) < 44 or audio[:4] != b"RIFF" or audio[8:12] != b"WAVE":
                    raise HTTPException(502, "Local TTS output is not a valid WAV file")
                return Response(content=audio, media_type="audio/wav",
                                headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})
            except OSError:
                raise HTTPException(503, "Could not start the configured local TTS executable") from None

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
