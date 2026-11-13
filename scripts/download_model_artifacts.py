#!/usr/bin/env python3
"""Download and verify pinned aLandi model artifacts outside the Git repository."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / "models" / "artifacts.manifest.json"
DEFAULT_ROOT = Path(os.environ.get("ALANDI_MODEL_CACHE", "~/.cache/alandi/models")).expanduser()


def load_manifest() -> dict[str, Any]:
    data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if data.get("schema_version") != 1 or not isinstance(data.get("packages"), list):
        raise ValueError("Unsupported model artifact manifest schema")
    return data


def safe_relative_path(value: str) -> Path:
    path = Path(value)
    if path.is_absolute() or not value or any(part in {"", ".", ".."} for part in path.parts):
        raise ValueError(f"Unsafe artifact path: {value!r}")
    return path


def destination(root: Path, package_id: str, relative: str) -> Path:
    package = safe_relative_path(package_id)
    rel = safe_relative_path(relative)
    base = (root / package).resolve()
    target = (base / rel).resolve()
    if not target.is_relative_to(base):
        raise ValueError(f"Artifact path escapes package directory: {relative!r}")
    return target


def hashes(path: Path, size: int) -> tuple[str, str]:
    sha256 = hashlib.sha256()
    git_sha1 = hashlib.sha1()
    git_sha1.update(f"blob {size}\0".encode("ascii"))
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            sha256.update(block)
            git_sha1.update(block)
    return sha256.hexdigest(), git_sha1.hexdigest()


def verify_file(path: Path, item: dict[str, Any]) -> tuple[bool, str]:
    if not path.is_file():
        return False, "missing"
    expected_size = item.get("size_bytes")
    actual_size = path.stat().st_size
    if expected_size is not None and actual_size != expected_size:
        return False, f"size mismatch: expected {expected_size}, got {actual_size}"
    sha256, git_sha1 = hashes(path, actual_size)
    expected_sha256 = item.get("sha256")
    if expected_sha256 and sha256.lower() != expected_sha256.lower():
        return False, f"SHA-256 mismatch: expected {expected_sha256}, got {sha256}"
    expected_git_sha1 = item.get("git_blob_sha1")
    if expected_git_sha1 and git_sha1.lower() != expected_git_sha1.lower():
        return False, f"Git blob SHA-1 mismatch: expected {expected_git_sha1}, got {git_sha1}"
    return True, f"verified size={actual_size} sha256={sha256}"


def download_url(url: str, target: Path, expected_size: int | None) -> None:
    if not url.startswith("https://"):
        raise ValueError(f"Only HTTPS artifact URLs are allowed: {url!r}")
    target.parent.mkdir(parents=True, exist_ok=True)
    partial = target.with_name(target.name + ".partial")
    request = urllib.request.Request(url, headers={"User-Agent": "aLandi-model-artifact-fetcher/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response, partial.open("wb") as output:
        final_url = response.geturl()
        final = urlsplit(final_url)
        if final.scheme != "https" or not final.hostname:
            raise ValueError("Artifact redirect downgraded transport")
        if final.hostname != "raw.githubusercontent.com" and not final.hostname.endswith(".githubusercontent.com"):
            raise ValueError(f"Unexpected GitHub artifact redirect host: {final.hostname}")
        while True:
            block = response.read(1024 * 1024)
            if not block:
                break
            output.write(block)
    if expected_size is not None and partial.stat().st_size != expected_size:
        raise ValueError(f"Downloaded size mismatch for {target.name}: expected {expected_size}, got {partial.stat().st_size}")
    partial.replace(target)


def verify_package(root: Path, package: dict[str, Any]) -> list[str]:
    problems: list[str] = []
    for item in package.get("files", []):
        target = destination(root, package["id"], item["path"])
        ok, detail = verify_file(target, item)
        print(f"{'OK' if ok else 'MISSING/INVALID'} {package['id']}/{item['path']}: {detail}")
        if not ok:
            problems.append(f"{package['id']}/{item['path']}: {detail}")
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT, help="Artifact cache outside the source repository")
    parser.add_argument("--package", action="append", default=[], help="Package ID to process; may be repeated")
    parser.add_argument("--dry-run", action="store_true", help="List planned downloads and expected binary bytes")
    parser.add_argument("--verify-only", action="store_true", help="Verify already downloaded files without network access")
    args = parser.parse_args()

    manifest = load_manifest()
    packages = [p for p in manifest["packages"] if p.get("download")]
    if args.package:
        selected = set(args.package)
        unknown = selected - {p["id"] for p in manifest["packages"]}
        if unknown:
            parser.error(f"Unknown package IDs: {', '.join(sorted(unknown))}")
        packages = [p for p in packages if p["id"] in selected]

    expected = sum(item.get("size_bytes", 0) for package in packages for item in package.get("files", []))
    print(f"Packages: {len(packages)}; primary binary bytes: {expected}; cache: {args.root}")
    if args.dry_run:
        for package in packages:
            print(f"- {package['id']} [{package['source']}]")
        return 0

    args.root.mkdir(parents=True, exist_ok=True)
    failures: list[str] = []
    for package in packages:
        if args.verify_only:
            failures.extend(verify_package(args.root, package))
            continue
        package_root = args.root / package["id"]
        source = package["source"]
        if source == "huggingface":
            try:
                from huggingface_hub import snapshot_download
            except ImportError:
                print("Install downloader dependency first: python -m pip install 'huggingface_hub>=0.34,<2'", file=sys.stderr)
                return 2
            try:
                snapshot_download(
                    repo_id=package["repo_id"],
                    revision=package["revision"],
                    local_dir=str(package_root),
                    allow_patterns=package.get("allow_patterns", []),
                    max_workers=4,
                )
            except Exception as exc:  # upstream/network errors are surfaced, never silently skipped
                failures.append(f"{package['id']}: Hugging Face download failed: {exc}")
                print(f"FAIL {failures[-1]}", file=sys.stderr)
                continue
        elif source == "github_raw":
            for item in package.get("files", []):
                target = destination(args.root, package["id"], item["path"])
                ok, _ = verify_file(target, item)
                if ok:
                    continue
                try:
                    download_url(item["url"], target, item.get("size_bytes"))
                except Exception as exc:
                    failures.append(f"{package['id']}/{item['path']}: download failed: {exc}")
                    print(f"FAIL {failures[-1]}", file=sys.stderr)
        else:
            failures.append(f"{package['id']}: unsupported source {source!r}")
            continue
        failures.extend(verify_package(args.root, package))

    if failures:
        print("\nArtifact acquisition incomplete:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1
    print("All selected artifacts verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
