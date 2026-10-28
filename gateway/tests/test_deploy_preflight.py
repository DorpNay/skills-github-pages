from __future__ import annotations

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "check_deploy_preflight.py"
spec = importlib.util.spec_from_file_location("deploy_preflight", SCRIPT)
assert spec is not None and spec.loader is not None
preflight = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preflight)

SERVICE = (ROOT / "gateway" / "alandi-gateway.service").read_text(encoding="utf-8")
ENV = (ROOT / "gateway" / ".env.example").read_text(encoding="utf-8")


def test_repository_deployment_baseline_is_safe() -> None:
    assert preflight.validate_files(SERVICE, ENV) == []


def test_public_gateway_bind_is_rejected() -> None:
    unsafe = SERVICE.replace("--host 127.0.0.1", "--host 0.0.0.0")
    assert any("127.0.0.1" in error for error in preflight.validate_files(unsafe, ENV))


def test_experimental_flags_must_stay_off() -> None:
    unsafe = ENV.replace("ALANDI_RAG_ENABLED=false", "ALANDI_RAG_ENABLED=true")
    assert any("ALANDI_RAG_ENABLED" in error for error in preflight.validate_files(SERVICE, unsafe))


def test_wildcard_cors_is_rejected() -> None:
    unsafe = ENV.replace("ALANDI_CORS_ORIGINS=https://dorpnay.github.io", "ALANDI_CORS_ORIGINS=*")
    assert any("wildcard" in error for error in preflight.validate_files(SERVICE, unsafe))


def test_real_api_key_in_example_is_rejected() -> None:
    unsafe = ENV.replace(
        "ALANDI_API_KEY=replace-with-a-new-random-64-character-hex-secret",
        "ALANDI_API_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    )
    assert any("placeholder" in error for error in preflight.validate_files(SERVICE, unsafe))


def test_systemd_hardening_is_required() -> None:
    unsafe = SERVICE.replace("NoNewPrivileges=true", "NoNewPrivileges=false")
    assert any("NoNewPrivileges=true" in error for error in preflight.validate_files(unsafe, ENV))

def test_paths_or_credentials_in_origins_are_rejected() -> None:
    unsafe = ENV.replace("ALANDI_CORS_ORIGINS=https://dorpnay.github.io", "ALANDI_CORS_ORIGINS=https://dorpnay.github.io/path")
    assert any("explicit HTTPS origin" in error for error in preflight.validate_files(SERVICE, unsafe))


def test_ollama_url_with_path_is_rejected() -> None:
    unsafe = ENV.replace("OLLAMA_BASE_URL=http://127.0.0.1:11434", "OLLAMA_BASE_URL=http://127.0.0.1:11434/admin")
    assert any("loopback listener" in error for error in preflight.validate_files(SERVICE, unsafe))
