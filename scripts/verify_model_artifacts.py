#!/usr/bin/env python3
"""Verify extracted aLandi model artifacts against their acquisition lock."""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path


def digest(path: Path) -> tuple[str, str, int]:
    sha256, sha1, size = hashlib.sha256(), hashlib.sha1(), 0
    with path.open("rb") as stream:
        while chunk := stream.read(1024 * 1024):
            size += len(chunk)
            sha256.update(chunk)
            sha1.update(chunk)
    return sha256.hexdigest(), sha1.hexdigest(), size


def verify(root: Path, lock_path: Path) -> list[str]:
    root = root.resolve(strict=True)
    lock = json.loads(lock_path.read_text(encoding="utf-8"))
    if lock.get("schema_version") != 1 or not isinstance(lock.get("results"), list):
        raise ValueError("unsupported artifact lock schema")
    sidecars = {}
    for path in root.rglob("artifact-metadata.json"):
        if path.is_symlink():
            raise ValueError(f"symlink sidecar is not allowed: {path}")
        metadata = json.loads(path.read_text(encoding="utf-8"))
        artifact_id = metadata.get("id")
        if not isinstance(artifact_id, str) or artifact_id in sidecars:
            raise ValueError(f"missing or duplicate artifact id in {path}")
        sidecars[artifact_id] = (path.parent, metadata)

    verified = []
    for record in lock["results"]:
        artifact_id = record["id"]
        if record.get("status") not in {"downloaded-and-verified", "reused-verified"}:
            raise ValueError(f"{artifact_id}: lock status is not verified")
        if artifact_id not in sidecars:
            raise ValueError(f"{artifact_id}: metadata sidecar is missing")
        directory, metadata = sidecars[artifact_id]
        filename = metadata.get("filename")
        if not isinstance(filename, str) or Path(filename).name != filename:
            raise ValueError(f"{artifact_id}: unsafe filename in metadata")
        file_path = directory / filename
        if file_path.is_symlink() or not file_path.is_file():
            raise ValueError(f"{artifact_id}: artifact file missing or is a symlink")
        resolved = file_path.resolve(strict=True)
        if root not in resolved.parents:
            raise ValueError(f"{artifact_id}: artifact escapes destination root")
        sha256, sha1, size = digest(file_path)
        if size != record["size_bytes"] or size != metadata["size_bytes"]:
            raise ValueError(f"{artifact_id}: byte length mismatch")
        if sha256 != record["sha256"] or sha256 != metadata["sha256"]:
            raise ValueError(f"{artifact_id}: SHA-256 mismatch")
        if sha1 != record["sha1"] or sha1 != metadata["sha1"]:
            raise ValueError(f"{artifact_id}: SHA-1 mismatch")
        verified.append(f"{artifact_id}: {size} bytes SHA-256 {sha256}")
    return verified


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path, help="directory created by gh run download")
    parser.add_argument("--lock", type=Path, help="lock JSON path; auto-detected when omitted")
    args = parser.parse_args()
    if args.lock is None:
        candidates = list(args.root.rglob("artifacts-lock.json"))
        if len(candidates) != 1:
            parser.error(f"expected one artifacts-lock.json, found {len(candidates)}")
        lock_path = candidates[0]
    else:
        lock_path = args.lock
    for line in verify(args.root, lock_path):
        print(f"VERIFIED {line}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
