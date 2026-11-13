#!/usr/bin/env python3
"""Download and verify pinned aLandi model artifacts outside the Git repository."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

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


def required_free_bytes(payload_bytes: int) -> int:
    """Return payload size plus a bounded disk-safety margin."""
    if payload_bytes <= 0:
        return 0
    return payload_bytes + max(64 * 1024 * 1024, payload_bytes // 20)


def resolve_cache_root(value: Path) -> Path:
    root = value.expanduser().resolve()
    repository = REPO_ROOT.resolve()
    if root == repository or repository in root.parents:
        raise ValueError("Model artifacts must stay outside the Git repository")
    return root


def write_sha256sums(package_root: Path) -> Path:
    lines: list[str] = []
    for path in sorted(package_root.rglob("*")):
        if (
            not path.is_file()
            or ".cache" in path.relative_to(package_root).parts
            or path.name == "SHA256SUMS.local"
        ):
            continue
        sha256, _ = hashes(path, path.stat().st_size)
        lines.append(f"{sha256}  {path.relative_to(package_root).as_posix()}")
    sums = package_root / "SHA256SUMS.local"
    sums.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    return sums


def hashes(path: Path, size: int) -> tuple[str, str]:
    sha256 = hashlib.sha256()
    git_sha1 = hashlib.sha1(usedforsecurity=False)
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


class GitHubRedirectHandler(urllib.request.HTTPRedirectHandler):
    allowed_hosts = {
        "github.com",
        "raw.githubusercontent.com",
        "release-assets.githubusercontent.com",
        "objects.githubusercontent.com",
    }

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        target = urlsplit(newurl)
        if target.scheme != "https" or target.hostname not in self.allowed_hosts:
            raise ValueError(f"Unexpected GitHub artifact redirect target: {newurl!r}")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def download_url(url: str, target: Path, expected_size: int | None) -> None:
    initial = urlsplit(url)
    if initial.scheme != "https" or initial.hostname not in {"github.com", "raw.githubusercontent.com"}:
        raise ValueError(f"Unexpected GitHub artifact source URL: {url!r}")
    target.parent.mkdir(parents=True, exist_ok=True)
    partial = target.with_name(target.name + ".partial")
    request = urllib.request.Request(url, headers={"User-Agent": "aLandi-model-artifact-fetcher/1.0"})
    try:
        opener = urllib.request.build_opener(GitHubRedirectHandler())
        with opener.open(request, timeout=90) as response, partial.open("wb") as output:
            final = urlsplit(response.geturl())
            allowed_final_hosts = {
                "github.com",
                "raw.githubusercontent.com",
                "release-assets.githubusercontent.com",
                "objects.githubusercontent.com",
            }
            if final.scheme != "https" or final.hostname not in allowed_final_hosts:
                raise ValueError(f"Unexpected GitHub artifact redirect host: {final.hostname}")
            total = 0
            while True:
                block = response.read(1024 * 1024)
                if not block:
                    break
                total += len(block)
                if expected_size is not None and total > expected_size:
                    raise ValueError("Artifact download exceeded its pinned size")
                output.write(block)
        if expected_size is not None and partial.stat().st_size != expected_size:
            raise ValueError(f"Downloaded size mismatch for {target.name}: expected {expected_size}, got {partial.stat().st_size}")
        partial.replace(target)
    except Exception:
        partial.unlink(missing_ok=True)
        raise

def ollama_digest_matches(output: str, package: dict[str, Any]) -> tuple[bool, str]:
    expected_name = package["model_tag"]
    expected_digest = package["expected_digest_prefix"].lower()
    for line in output.splitlines()[1:]:
        columns = line.split()
        if len(columns) >= 2 and columns[0] == expected_name:
            actual = columns[1].lower()
            if actual.startswith(expected_digest):
                return True, f"tag={expected_name} digest={actual}"
            return False, f"tag={expected_name} digest mismatch: expected prefix {expected_digest}, got {actual}"
    return False, f"model tag {expected_name} not present in ollama list"


def verify_ollama_package(package: dict[str, Any]) -> tuple[bool, str]:
    try:
        result = subprocess.run(["ollama", "list"], check=True, capture_output=True, text=True)
    except FileNotFoundError:
        return False, "Ollama CLI not found"
    except subprocess.CalledProcessError as exc:
        return False, f"ollama list failed with exit code {exc.returncode}"
    return ollama_digest_matches(result.stdout, package)


def verify_package(root: Path, package: dict[str, Any]) -> list[str]:
    problems: list[str] = []
    for item in package.get("files", []):
        target = destination(root, package["id"], item["path"])
        ok, detail = verify_file(target, item)
        print(f"{'OK' if ok else 'MISSING/INVALID'} {package['id']}/{item['path']}: {detail}")
        if not ok:
            problems.append(f"{package['id']}/{item['path']}: {detail}")
    for relative in package.get("required_paths", []):
        target = destination(root, package["id"], relative)
        if not target.is_file():
            detail = "missing required support file"
            print(f"MISSING/INVALID {package['id']}/{relative}: {detail}")
            problems.append(f"{package['id']}/{relative}: {detail}")
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT, help="Artifact cache outside the source repository")
    parser.add_argument("--package", action="append", default=[], help="Package ID to process; may be repeated")
    parser.add_argument("--dry-run", action="store_true", help="List planned downloads and expected binary bytes")
    parser.add_argument("--verify-only", action="store_true", help="Verify already downloaded files without network access")
    parser.add_argument("--skip-ollama", action="store_true", help="Skip the official Ollama reference model pull")
    args = parser.parse_args()

    manifest = load_manifest()
    packages = [package for package in manifest["packages"] if package.get("download")]
    if args.skip_ollama:
        packages = [package for package in packages if package["source"] != "ollama_cli"]
    if args.package:
        selected = set(args.package)
        all_packages = {package["id"]: package for package in manifest["packages"]}
        unknown = selected - set(all_packages)
        if unknown:
            parser.error(f"Unknown package IDs: {', '.join(sorted(unknown))}")
        disabled = [package_id for package_id in selected if not all_packages[package_id].get("download")]
        if disabled:
            parser.error(f"These packages are intentionally not downloadable: {', '.join(sorted(disabled))}")
        if args.skip_ollama and any(all_packages[package_id]["source"] == "ollama_cli" for package_id in selected):
            parser.error("--skip-ollama conflicts with the selected Ollama package")
        packages = [package for package in packages if package["id"] in selected]

    try:
        cache_root = resolve_cache_root(args.root)
    except ValueError as exc:
        parser.error(str(exc))

    exact_cache_bytes = sum(
        item.get("size_bytes", 0)
        for package in packages if package["source"] != "ollama_cli"
        for item in package.get("files", [])
    )
    ollama_estimate = sum(
        package.get("estimated_size_bytes", 0)
        for package in packages if package["source"] == "ollama_cli"
    )
    print(
        f"Packages: {len(packages)}; exact external-cache payload bytes: {exact_cache_bytes}; "
        f"additional Ollama model estimate: {ollama_estimate}; cache: {cache_root}"
    )
    if args.dry_run:
        for package in packages:
            print(f"- {package['id']} [{package['source']}]")
        return 0

    cache_root.mkdir(parents=True, exist_ok=True)
    if not args.verify_only and exact_cache_bytes:
        required = required_free_bytes(exact_cache_bytes)
        free = shutil.disk_usage(cache_root).free
        if free < required:
            print(
                f"Insufficient free disk for external-cache artifacts: need at least {required} bytes "
                f"including safety margin; available {free}. Choose a larger external cache with --root.",
                file=sys.stderr,
            )
            return 2
    if ollama_estimate and not args.verify_only:
        print(
            f"NOTE: ensure the Ollama server's model store has at least "
            f"{ollama_estimate + 256 * 1024 * 1024} free bytes; ollama pull stores outside --root."
        )

    failures: list[str] = []
    for package in packages:
        source = package["source"]
        if source == "ollama_cli":
            if args.verify_only:
                ok, detail = verify_ollama_package(package)
            else:
                try:
                    subprocess.run(["ollama", "pull", package["model_tag"]], check=True)
                    ok, detail = verify_ollama_package(package)
                except FileNotFoundError:
                    ok, detail = False, "Ollama CLI not found; install Ollama or use --skip-ollama"
                except subprocess.CalledProcessError as exc:
                    ok, detail = False, f"ollama pull failed with exit code {exc.returncode}"
            print(f"{'OK' if ok else 'MISSING/INVALID'} {package['id']}: {detail}")
            if not ok:
                failures.append(f"{package['id']}: {detail}")
            continue

        if args.verify_only:
            package_problems = verify_package(cache_root, package)
            failures.extend(package_problems)
            if not package_problems:
                write_sha256sums(cache_root / package["id"])
            continue

        package_root = cache_root / package["id"]
        if source == "huggingface":
            try:
                from huggingface_hub import snapshot_download
            except ImportError:
                print(
                    "Install downloader dependency first: python -m pip install 'huggingface_hub>=0.34,<2'",
                    file=sys.stderr,
                )
                return 2
            try:
                snapshot_download(
                    repo_id=package["repo_id"],
                    revision=package["revision"],
                    local_dir=str(package_root),
                    allow_patterns=package.get("allow_patterns", []),
                    max_workers=2,
                )
            except Exception as exc:
                failures.append(f"{package['id']}: Hugging Face download failed: {exc}")
                print(f"FAIL {failures[-1]}", file=sys.stderr)
                continue
        elif source == "github_raw":
            for item in package.get("files", []):
                target = destination(cache_root, package["id"], item["path"])
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

        package_problems = verify_package(cache_root, package)
        failures.extend(package_problems)
        if not package_problems:
            sums = write_sha256sums(package_root)
            print(f"SHA-256 inventory written: {sums}")

    if failures:
        print("\nArtifact acquisition incomplete:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1
    print("All selected artifacts verified.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
