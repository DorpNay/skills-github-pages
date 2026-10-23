#!/usr/bin/env python3
"""Fail closed when an accepted INTEL record lacks source, exact license, or claim evidence."""
from __future__ import annotations

import argparse
import ipaddress
from pathlib import Path
from urllib.parse import urlsplit

import yaml

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FILE = ROOT / "intel" / "RECON.yaml"
REQUIRED_TRIAD = ("verified_url", "license_exact_artifact", "claim_source")
BLOCKED_MARKERS = ("tbd", "todo", "unknown", "pending", "placeholder", "not verified", "unreviewed", "to be confirmed", "n/a")


def _blocked(value: str) -> bool:
    normalized = value.strip().lower()
    return not normalized or any(marker in normalized for marker in BLOCKED_MARKERS)


def _https_url(value: str) -> bool:
    """Check URL shape and reject obvious placeholders/private IPs without network access."""
    try:
        parsed = urlsplit(value.strip())
        host = (parsed.hostname or "").lower().rstrip(".")
        if (parsed.scheme != "https" or not host or not parsed.path.startswith(("/", ""))
                or parsed.username or parsed.password
                or host in {"example.com", "example.org", "example.net", "localhost"}
                or host.endswith((".test", ".invalid", ".example", ".localhost", ".local"))):
            return False
        try:
            address = ipaddress.ip_address(host)
        except ValueError:
            address = None
        if address is not None and not address.is_global:
            return False
        return "." in host or address is not None
    except ValueError:
        return False


def validate_data(data: object) -> list[str]:
    """Validate completeness without network calls or guessed provenance."""
    failures: list[str] = []
    if not isinstance(data, dict):
        return ["top level must be a YAML object"]
    if data.get("schema_version") != 1:
        failures.append("schema_version must be 1")
    records = data.get("artifacts")
    if not isinstance(records, list):
        return failures + ["artifacts must be a list"]
    seen: set[str] = set()
    accepted_count = 0
    for index, record in enumerate(records):
        label = f"artifacts[{index}]"
        if not isinstance(record, dict):
            failures.append(f"{label}: expected an object")
            continue
        artifact_id = record.get("id")
        if not isinstance(artifact_id, str) or not artifact_id.strip():
            failures.append(f"{label}: id must be a non-empty string")
        elif artifact_id in seen:
            failures.append(f"{label}: duplicate id {artifact_id!r}")
        else:
            seen.add(artifact_id)
        if record.get("status") != "accepted":
            continue
        accepted_count += 1
        for field in REQUIRED_TRIAD:
            value = record.get(field)
            if not isinstance(value, str) or _blocked(value):
                failures.append(f"{label} ({artifact_id}): accepted item lacks valid {field}")
                continue
            if field == "verified_url" and not _https_url(value):
                failures.append(f"{label} ({artifact_id}): verified_url must be an absolute HTTPS URL")
            if field == "claim_source" and not _https_url(value):
                failures.append(f"{label} ({artifact_id}): claim_source must be an absolute public HTTPS URL")
        license_value = record.get("license_exact_artifact")
        if isinstance(license_value, str) and any(
            marker in license_value.lower() for marker in ("per-voice verify", "license varies")
        ):
            failures.append(f"{label} ({artifact_id}): license must identify this exact artifact, not a family")
    if accepted_count == 0:
        failures.append("at least one explicitly accepted record is required; an empty gate proves nothing")
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", type=Path, default=DEFAULT_FILE)
    args = parser.parse_args()
    try:
        data = yaml.safe_load(args.file.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        print(f"ERROR: cannot read INTEL triad file: {type(exc).__name__}")
        return 1
    failures = validate_data(data)
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        print(f"INTEL triad gate: {len(failures)} failure(s)")
        return 1
    accepted = sum(1 for item in data["artifacts"] if isinstance(item, dict) and item.get("status") == "accepted")
    print(f"PASS: INTEL triad is complete for {accepted} accepted artifact(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
