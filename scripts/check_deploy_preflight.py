#!/usr/bin/env python3
"""Validate the repository's safe deployment baseline without reading live secrets.

This checks only gateway/alandi-gateway.service and gateway/.env.example. It does
not inspect /etc/alandi-gateway.env, a VPS, running services, DNS, or a tunnel.
"""
from __future__ import annotations

import re
import shlex
import sys
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
EXPERIMENTAL_FLAGS = (
    "ALANDI_FAST_ROUTING_ENABLED",
    "ALANDI_MEMORY_SYNC_ENABLED",
    "ALANDI_MEMORY_GRAPH_ENABLED",
    "ALANDI_GLOBAL_MEMORY_ENABLED",
    "ALANDI_RAG_ENABLED",
    "ALANDI_SEARXNG_ENABLED",
    "ALANDI_DOCUMENT_EXTRACTION_ENABLED",
    "ALANDI_AUDIO_TRANSCRIPTION_ENABLED",
    "ALANDI_AUDIO_SPEECH_ENABLED",
    "OAUTH_ENABLED",
)


def parse_env_template(text: str) -> tuple[dict[str, str], list[str]]:
    values: dict[str, str] = {}
    errors: list[str] = []
    for number, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            errors.append(f".env.example:{number}: expected KEY=VALUE")
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if not re.fullmatch(r"[A-Z][A-Z0-9_]*", key):
            errors.append(f".env.example:{number}: invalid environment key")
            continue
        if key in values:
            errors.append(f".env.example:{number}: duplicate environment key {key}")
            continue
        values[key] = value.strip()
    return values, errors


def parse_systemd_service(text: str) -> tuple[dict[str, list[str]], list[str]]:
    sections: dict[str, list[str]] = {}
    current = ""
    errors: list[str] = []
    for number, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("[") and line.endswith("]"):
            current = line[1:-1]
            sections.setdefault(current, [])
            continue
        if "=" not in line or not current:
            errors.append(f"service:{number}: malformed directive")
            continue
        sections[current].append(line)
    return sections, errors


def validate_files(service_text: str, env_text: str) -> list[str]:
    env, errors = parse_env_template(env_text)
    sections, service_errors = parse_systemd_service(service_text)
    errors.extend(service_errors)
    service = sections.get("Service", [])
    for required in (
        "User=alandi",
        "Group=alandi",
        "EnvironmentFile=/etc/alandi-gateway.env",
        "UMask=0077",
        "NoNewPrivileges=true",
        "PrivateTmp=true",
        "ProtectHome=true",
        "ProtectSystem=strict",
        "ReadWritePaths=/var/lib/alandi-gateway",
        "ProtectKernelTunables=true",
        "ProtectKernelModules=true",
        "ProtectControlGroups=true",
        "RestrictSUIDSGID=true",
        "LockPersonality=true",
        "RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6",
        "Restart=on-failure",
        "TimeoutStopSec=15",
    ):
        if required not in service:
            errors.append(f"systemd [Service] must retain {required}")
    exec_starts = [item for item in service if item.startswith("ExecStart=")]
    if len(exec_starts) != 1:
        errors.append("systemd [Service] must have exactly one ExecStart")
    else:
        command = exec_starts[0].split("=", 1)[1]
        try:
            argv = shlex.split(command)
        except ValueError:
            errors.append("systemd ExecStart must use valid shell-style quoting")
            argv = []

        # Require one unambiguous value for each network/process option. Merely
        # searching for a safe substring misses duplicate options such as
        # "--host 127.0.0.1 --host ::" where the later value may win.
        for option, expected in (("--host", "127.0.0.1"), ("--port", "8000"), ("--workers", "1")):
            positions = [index for index, token in enumerate(argv) if token == option]
            if len(positions) != 1 or positions[0] + 1 >= len(argv) or argv[positions[0] + 1] != expected:
                errors.append(f"ExecStart must set {option} exactly once to {expected}")

    if env.get("ALANDI_API_KEY") != "replace-with-a-new-random-64-character-hex-secret":
        errors.append(".env.example must contain only the API-key placeholder, never a real key")
    ollama = urlsplit(env.get("OLLAMA_BASE_URL", ""))
    if (ollama.scheme != "http" or ollama.hostname not in {"127.0.0.1", "localhost", "::1"} or
            ollama.port != 11434 or ollama.path not in {"", "/"} or ollama.query or ollama.fragment or
            ollama.username is not None or ollama.password is not None):
        errors.append("OLLAMA_BASE_URL must target the local loopback listener on port 11434")
    cors = [origin.strip() for origin in env.get("ALANDI_CORS_ORIGINS", "").split(",") if origin.strip()]
    if not cors or "*" in cors:
        errors.append("ALANDI_CORS_ORIGINS must be a non-empty exact-origin allowlist, not wildcard")
    elif any(
        urlsplit(origin).scheme != "https" or not urlsplit(origin).hostname or
        urlsplit(origin).path not in {"", "/"} or urlsplit(origin).query or urlsplit(origin).fragment or
        urlsplit(origin).username is not None or urlsplit(origin).password is not None
        for origin in cors
    ):
        errors.append("every CORS origin in the deployment template must be an explicit HTTPS origin")
    if not env.get("ALANDI_ALLOWED_MODELS", "").strip():
        errors.append("ALANDI_ALLOWED_MODELS must not be empty")
    if env.get("ALANDI_MAX_INFLIGHT_REQUESTS") != "1":
        errors.append("baseline must keep ALANDI_MAX_INFLIGHT_REQUESTS=1")
    for name in EXPERIMENTAL_FLAGS:
        if env.get(name, "").lower() != "false":
            errors.append(f"{name} must remain false in the safe example configuration")
    if env.get("ALANDI_HELPER_MODEL", ""):
        errors.append("ALANDI_HELPER_MODEL must remain blank in the safe example configuration")
    if env.get("OAUTH_ENCRYPTION_KEY", "") or env.get("GOOGLE_DRIVE_CLIENT_SECRET", ""):
        errors.append("OAuth encryption key and client secret must remain blank in the safe example configuration")
    return errors


def main() -> int:
    service_path = ROOT / "gateway" / "alandi-gateway.service"
    env_path = ROOT / "gateway" / ".env.example"
    errors = validate_files(
        service_path.read_text(encoding="utf-8"),
        env_path.read_text(encoding="utf-8"),
    )
    if errors:
        print("Deployment preflight FAILED (repository templates only):")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Deployment preflight OK: loopback-only service, hardened systemd baseline, placeholder secrets, exact HTTPS CORS, experimental flags off.")
    print("Scope: repository templates only; live VPS environment/service/tunnel and installed models were not inspected.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
