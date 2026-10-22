#!/usr/bin/env python3
"""Validate artifact provenance manifest; never downloads models or guesses licenses."""
from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

import yaml

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "infra" / "license" / "provenance_manifest.yaml"
REQUIRED = {"id", "kind", "upstream", "source_version", "license_spdx",
            "commercial_use", "sha256", "ship", "status"}
SHA256 = re.compile(r"^[0-9a-fA-F]{64}$")
BLOCKED_WORDS = ("blocked", "unknown", "tbd", "unreviewed", "needs_review", "pending")


def main() -> int:
    try:
        data = yaml.safe_load(MANIFEST.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        print(f"ERROR: cannot read license manifest: {type(exc).__name__}")
        return 1
    if not isinstance(data, dict) or data.get("schema_version") != 1 or not isinstance(data.get("artifacts"), list):
        print("ERROR: manifest must have schema_version=1 and an artifacts list")
        return 1
    failures: list[str] = []
    seen: set[str] = set()
    for index, artifact in enumerate(data["artifacts"]):
        label = f"artifact[{index}]"
        if not isinstance(artifact, dict):
            failures.append(f"{label}: expected object")
            continue
        missing = REQUIRED - set(artifact)
        if missing:
            failures.append(f"{label}: missing keys {sorted(missing)}")
            continue
        artifact_id = artifact["id"]
        if not isinstance(artifact_id, str) or not artifact_id or artifact_id in seen:
            failures.append(f"{label}: id must be unique and non-empty")
            continue
        seen.add(artifact_id)
        parsed = urlsplit(artifact["upstream"]) if isinstance(artifact["upstream"], str) else None
        if parsed is None or parsed.scheme != "https" or not parsed.hostname:
            failures.append(f"{artifact_id}: upstream must be HTTPS")
        for key in ("kind", "source_version", "license_spdx", "commercial_use", "status"):
            if not isinstance(artifact[key], str) or not artifact[key].strip():
                failures.append(f"{artifact_id}: {key} must be non-empty")
        checksum = artifact["sha256"]
        if checksum is not None and (not isinstance(checksum, str) or not SHA256.fullmatch(checksum)):
            failures.append(f"{artifact_id}: sha256 must be null or 64 hexadecimal characters")
        if not isinstance(artifact["ship"], bool):
            failures.append(f"{artifact_id}: ship must be boolean")
            continue
        if artifact["ship"]:
            if not isinstance(checksum, str) or not SHA256.fullmatch(checksum):
                failures.append(f"{artifact_id}: ship=true requires verified sha256")
            combined = " ".join(str(artifact.get(key, "")) for key in ("license_spdx", "commercial_use", "status")).lower()
            if any(word in combined for word in BLOCKED_WORDS) or "tbd" in combined:
                failures.append(f"{artifact_id}: blocked/unknown license cannot ship")
    if failures:
        print("LICENSE MANIFEST FAILED")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print(f"LICENSE MANIFEST OK: {len(data['artifacts'])} artifacts; no blocked or unhashed artifacts marked ship=true")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
