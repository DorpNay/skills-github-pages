#!/usr/bin/env python3
"""Validate pinned model/runtime and sandbox artifact inventory without downloading or installing."""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SHA256 = re.compile(r"^[0-9a-f]{64}$")


def fail(message: str) -> None:
    raise ValueError(message)


def require(condition: bool, message: str) -> None:
    if not condition:
        fail(message)


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"{path.relative_to(ROOT)}: cannot parse JSON ({type(exc).__name__})")
    require(isinstance(value, dict), f"{path.relative_to(ROOT)}: top-level object required")
    return value


def digest(value: Any, label: str) -> None:
    require(isinstance(value, str) and SHA256.fullmatch(value) is not None, f"{label}: invalid SHA-256")


def expiry(value: Any, label: str) -> None:
    require(isinstance(value, str), f"{label}: expiry timestamp required")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        fail(f"{label}: invalid ISO-8601 expiry")
    require(parsed.tzinfo is not None, f"{label}: expiry must include timezone")
    require(parsed > datetime.now(timezone.utc), f"{label}: artifact is expired")


def artifact(record: dict[str, Any], label: str, *, inner_hash: bool = False) -> int:
    require(isinstance(record.get("id"), int) and record["id"] > 0, f"{label}: artifact ID missing")
    require(isinstance(record.get("name"), str) and record["name"], f"{label}: artifact name missing")
    require(isinstance(record.get("size_bytes"), int) and record["size_bytes"] > 0, f"{label}: invalid size")
    digest(record.get("artifact_sha256"), f"{label}.artifact_sha256")
    if inner_hash:
        digest(record.get("sha256"), f"{label}.sha256")
    return record["size_bytes"]


def main() -> int:
    try:
        lock = read_json(ROOT / "models/runtime-stack.lock.json")
        require(lock.get("schema_version") == 1, "runtime-stack.lock.json: schema_version must be 1")
        require(lock.get("status") == "ARTIFACTS_VERIFIED_NOT_INSTALLED", "runtime lock must not imply installed runtimes")
        acquisition = lock.get("acquisition")
        require(isinstance(acquisition, dict), "runtime lock: acquisition object required")
        require(acquisition.get("state") == "VERIFIED_DOWNLOADED_NOT_INSTALLED", "acquisition state must remain downloaded/not installed")
        require(acquisition.get("target_installation") == "NOT_STARTED_HOST_PLATFORM_NOT_VERIFIED", "target host must remain explicitly unverified")

        seen_ids: set[int] = set()
        external = acquisition.get("external_cache")
        require(isinstance(external, dict), "external_cache metadata missing")
        require(isinstance(external.get("artifact_id"), int), "external_cache artifact ID missing")
        seen_ids.add(external["artifact_id"])
        require(isinstance(external.get("artifact_name"), str) and external["artifact_name"], "external_cache artifact name missing")
        require(isinstance(external.get("artifact_bytes"), int) and external["artifact_bytes"] > 0, "external_cache size invalid")
        digest(external.get("artifact_sha256"), "external_cache.archive_sha256")
        expiry(external.get("expires_on"), "external_cache")

        ollama = acquisition.get("ollama_registry")
        require(isinstance(ollama, dict) and isinstance(ollama.get("artifacts"), list), "ollama_registry artifacts missing")
        require(len(ollama["artifacts"]) == 5, "ollama_registry must contain four packages and one lock")
        ollama_bytes = 0
        for index, record in enumerate(ollama["artifacts"]):
            ollama_bytes += artifact(record, f"ollama_registry[{index}]", inner_hash=True)
            require(record["id"] not in seen_ids, "duplicate Actions artifact ID")
            seen_ids.add(record["id"])
        require(ollama_bytes == ollama.get("artifact_bytes"), "ollama_registry artifact_bytes mismatch")
        require(ollama.get("package_count") == 4, "ollama_registry package_count must be four")
        expiry(ollama.get("expires_on"), "ollama_registry")

        python_cache = acquisition.get("python_runtime_cache")
        require(isinstance(python_cache, dict) and isinstance(python_cache.get("artifacts"), list), "python_runtime_cache artifacts missing")
        require(python_cache.get("target") == "Ubuntu 24.04 x86_64", "python runtime cache target mismatch")
        require(python_cache.get("offline_sync_verified") is True and python_cache.get("pip_check_verified") is True, "python cache offline checks not verified")
        python_bytes = 0
        for index, record in enumerate(python_cache["artifacts"]):
            python_bytes += artifact(record, f"python_runtime_cache[{index}]")
            require(record["id"] not in seen_ids, "duplicate Actions artifact ID")
            seen_ids.add(record["id"])
        require(python_bytes == python_cache.get("artifact_bytes"), "python_runtime_cache artifact_bytes mismatch")
        expiry(python_cache.get("expires_on"), "python_runtime_cache")

        bonsai = acquisition.get("bonsai_helper")
        require(isinstance(bonsai, dict), "bonsai_helper metadata missing")
        require(bonsai.get("install_state") == "DOWNLOADED_VERIFIED_NOT_INSTALLED", "Bonsai helper must remain uninstalled")
        digest(bonsai.get("artifact_sha256"), "bonsai_helper.archive_sha256")
        digest(bonsai.get("model_file_sha256"), "bonsai_helper.model_file_sha256")
        require(isinstance(bonsai.get("artifact_id"), int) and bonsai["artifact_id"] not in seen_ids, "Bonsai artifact ID invalid/duplicate")
        seen_ids.add(bonsai["artifact_id"])
        require(isinstance(bonsai.get("artifact_bytes"), int) and bonsai["artifact_bytes"] > 0, "Bonsai artifact size invalid")
        expiry(bonsai.get("expires_on"), "bonsai_helper")

        openshell = acquisition.get("openshell_runtime")
        require(isinstance(openshell, dict), "openshell_runtime metadata missing")
        require(openshell.get("install_state") == "CANDIDATE_NOT_INSTALLED", "OpenShell must remain candidate/not installed")
        require(openshell.get("target") == "Ubuntu 24.04 x86_64", "OpenShell target mismatch")
        digest(openshell.get("artifact_sha256"), "openshell_runtime.archive_sha256")
        require(isinstance(openshell.get("artifact_id"), int) and openshell["artifact_id"] not in seen_ids, "OpenShell artifact ID invalid/duplicate")
        seen_ids.add(openshell["artifact_id"])
        require(isinstance(openshell.get("artifact_bytes"), int) and openshell["artifact_bytes"] > 0, "OpenShell artifact size invalid")
        expiry(openshell.get("expires_on"), "openshell_runtime")

        expected_total = external["artifact_bytes"] + ollama_bytes + python_bytes + bonsai["artifact_bytes"] + openshell["artifact_bytes"]
        require(acquisition.get("total_all_artifact_bytes") == expected_total, "total_all_artifact_bytes mismatch")

        bonsai_manifest = read_json(ROOT / "models/manifest-prismml-bonsai.json")
        source = bonsai_manifest.get("source", {})
        runtime = bonsai_manifest.get("runtime", {})
        require(source.get("sha256") == bonsai.get("model_file_sha256"), "Bonsai source hash differs from acquisition lock")
        require(source.get("license") == "Apache-2.0", "Bonsai license mismatch")
        require(runtime.get("install_enabled") is False and runtime.get("ollama_compatible") is False, "Bonsai must remain disabled and not Ollama-compatible")

        try:
            import yaml
            sandbox = yaml.safe_load((ROOT / "infra/sandbox/openshell-v0.1.8-manifest.yaml").read_text(encoding="utf-8"))
        except Exception as exc:  # parser/environment failure is a hard gate
            fail(f"OpenShell manifest cannot be parsed ({type(exc).__name__})")
        require(isinstance(sandbox, dict), "OpenShell manifest top-level mapping required")
        require(sandbox.get("status") == "CANDIDATE_NOT_INSTALLED", "OpenShell manifest must remain candidate/not installed")
        require(sandbox.get("license") == "Apache-2.0", "OpenShell license mismatch")
        require(sandbox.get("artifact_policy", {}).get("install_before_host_preflight") is False, "OpenShell install must wait for host preflight")
        assets = sandbox.get("assets")
        require(isinstance(assets, list) and len(assets) >= 5, "OpenShell asset list incomplete")
        for index, item in enumerate(assets):
            digest(item.get("sha256"), f"openshell.assets[{index}].sha256")
            require(isinstance(item.get("bytes"), int) and item["bytes"] > 0, f"openshell.assets[{index}].bytes invalid")

    except ValueError as exc:
        print(f"MODEL RUNTIME INVENTORY FAILED: {exc}")
        return 1
    print(f"MODEL RUNTIME INVENTORY OK: {len(seen_ids)} unique, unexpired staging artifacts; no target runtime enabled")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
