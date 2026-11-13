#!/usr/bin/env python3
"""Download bounded, revision-pinned aLandi model artifacts outside Git."""
from __future__ import annotations
import argparse
import concurrent.futures
import hashlib
import json
import os
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path, PurePosixPath

MAX_MANIFEST_BYTES = 2_000_000
READ_CHUNK = 1024 * 1024
ALLOWED_INITIAL_HOSTS = {"huggingface.co", "raw.githubusercontent.com"}
ALLOWED_REDIRECT_SUFFIXES = (".huggingface.co", ".hf.co", ".githubusercontent.com")


class DownloadError(RuntimeError):
    pass


def validate_url(url: str) -> None:
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise DownloadError("artifact URL must be HTTPS without embedded credentials")
    host = parsed.hostname.lower()
    if host not in ALLOWED_INITIAL_HOSTS and not host.endswith(ALLOWED_REDIRECT_SUFFIXES):
        raise DownloadError(f"unapproved download host: {host}")


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        validate_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def digest_file(path: Path) -> tuple[str, str, int]:
    sha256, sha1, size = hashlib.sha256(), hashlib.sha1(), 0
    with path.open("rb") as stream:
        while True:
            chunk = stream.read(READ_CHUNK)
            if not chunk:
                break
            size += len(chunk)
            sha256.update(chunk)
            sha1.update(chunk)
    return sha256.hexdigest(), sha1.hexdigest(), size


def safe_id(value: str) -> str:
    if not isinstance(value, str) or not re.fullmatch(r"[a-z0-9][a-z0-9_-]{0,80}", value):
        raise DownloadError(f"unsafe artifact id: {value!r}")
    return value


def write_sidecar(item, target_dir, target, sha256, sha1, size, status):
    metadata = {
        "schema_version": 1, "id": item["id"], "role": item.get("role"),
        "repository": item.get("repository"), "revision": item.get("revision"),
        "source_url": item.get("source_url"), "filename": target.name,
        "size_bytes": size, "sha256": sha256, "sha1": sha1,
        "upstream_expected_sha256": item.get("sha256"),
        "upstream_expected_sha1": item.get("expected_sha1"),
        "license": item.get("license"), "format": item.get("format"),
        "status": status, "acquired_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "notes": item.get("notes"),
    }
    (target_dir / "artifact-metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return {"id": item["id"], "status": status, "size_bytes": size, "sha256": sha256, "sha1": sha1}


def download_one(item, output_root, timeout):
    artifact_id = safe_id(item["id"])
    if item.get("acquisition") == "owner-server-only":
        return {"id": artifact_id, "status": "skipped-owner-server-only"}
    url = item["source_url"]
    validate_url(url)
    filename = item["filename"]
    if not isinstance(filename, str) or PurePosixPath(filename).name != filename or filename in {"", ".", ".."}:
        raise DownloadError(f"{artifact_id}: filename must be one safe path component")
    max_bytes = int(item.get("max_bytes", 0))
    if max_bytes <= 0 or max_bytes > 20 * 1024**3:
        raise DownloadError(f"{artifact_id}: invalid max_bytes")
    expected_size = item.get("size_bytes")
    if expected_size is not None and (not isinstance(expected_size, int) or expected_size <= 0 or expected_size > max_bytes):
        raise DownloadError(f"{artifact_id}: invalid expected size")

    target_dir = output_root / artifact_id
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / filename
    if target.exists():
        sha256, sha1, size = digest_file(target)
        if size > max_bytes or (expected_size is not None and size != expected_size):
            raise DownloadError(f"{artifact_id}: existing file size mismatch")
        if item.get("sha256") and sha256.lower() != item["sha256"].lower():
            raise DownloadError(f"{artifact_id}: existing SHA-256 mismatch")
        if item.get("expected_sha1") and sha1.lower() != item["expected_sha1"].lower():
            raise DownloadError(f"{artifact_id}: existing SHA-1 mismatch")
        return write_sidecar(item, target_dir, target, sha256, sha1, size, "reused-verified")

    fd, temp_name = tempfile.mkstemp(prefix=f".{artifact_id}.", suffix=".part", dir=target_dir)
    os.close(fd)
    temp_path = Path(temp_name)
    try:
        request = urllib.request.Request(url, headers={
            "User-Agent": "aLandi-model-artifact-acquirer/1.0",
            "Accept": "application/octet-stream",
        })
        opener = urllib.request.build_opener(SafeRedirectHandler())
        with opener.open(request, timeout=timeout) as response, temp_path.open("wb") as out:
            validate_url(response.geturl())
            declared = response.headers.get("Content-Length")
            if declared and int(declared) > max_bytes:
                raise DownloadError(f"{artifact_id}: Content-Length exceeds max_bytes")
            total = 0
            while True:
                chunk = response.read(READ_CHUNK)
                if not chunk:
                    break
                total += len(chunk)
                if total > max_bytes:
                    raise DownloadError(f"{artifact_id}: streamed size exceeds max_bytes")
                out.write(chunk)
            out.flush()
            os.fsync(out.fileno())
        sha256, sha1, size = digest_file(temp_path)
        if size == 0:
            raise DownloadError(f"{artifact_id}: empty response")
        if expected_size is not None and size != expected_size:
            raise DownloadError(f"{artifact_id}: expected {expected_size} bytes, received {size}")
        if item.get("sha256") and sha256.lower() != item["sha256"].lower():
            raise DownloadError(f"{artifact_id}: SHA-256 mismatch")
        if item.get("expected_sha1") and sha1.lower() != item["expected_sha1"].lower():
            raise DownloadError(f"{artifact_id}: SHA-1 mismatch")
        os.replace(temp_path, target)
        return write_sidecar(item, target_dir, target, sha256, sha1, size, "downloaded-and-verified")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise DownloadError(f"{artifact_id}: {type(exc).__name__}: {exc}") from None
    finally:
        temp_path.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", default="models/manifest.json")
    parser.add_argument("--output-dir", default="artifacts")
    parser.add_argument("--workers", type=int, default=3)
    parser.add_argument("--timeout", type=int, default=600)
    parser.add_argument("--only", action="append", default=[])
    args = parser.parse_args()
    if not 1 <= args.workers <= 4:
        parser.error("--workers must be between 1 and 4")
    if not 10 <= args.timeout <= 3600:
        parser.error("--timeout must be between 10 and 3600 seconds")

    raw = Path(args.manifest).read_bytes()
    if len(raw) > MAX_MANIFEST_BYTES:
        raise SystemExit("manifest exceeds 2 MB safety bound")
    manifest = json.loads(raw)
    if manifest.get("schema_version") != 1 or not isinstance(manifest.get("artifacts"), list):
        raise SystemExit("unsupported or malformed manifest")
    items = manifest["artifacts"]
    if args.only:
        wanted, known = set(args.only), {item["id"] for item in items}
        if wanted - known:
            parser.error("unknown artifact id(s): " + ", ".join(sorted(wanted - known)))
        items = [item for item in items if item["id"] in wanted]

    output_root = Path(args.output_dir).resolve()
    output_root.mkdir(parents=True, exist_ok=True)
    downloadable = [item for item in items if item.get("acquisition") != "owner-server-only"]
    results, failures = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(download_one, item, output_root, args.timeout): item["id"] for item in downloadable}
        for future in concurrent.futures.as_completed(futures):
            artifact_id = futures[future]
            try:
                result = future.result()
                results.append(result)
                print(f"{result['status']}: {artifact_id} ({result.get('size_bytes', 0)} bytes; SHA-256 {result.get('sha256', 'n/a')})")
            except Exception as exc:
                failures.append(f"{artifact_id}: {exc}")
                print(f"FAILED: {artifact_id}: {exc}", file=sys.stderr)
    lock = {
        "schema_version": 1, "manifest_updated": manifest.get("updated"),
        "results": sorted(results, key=lambda row: row["id"]), "failures": sorted(failures),
    }
    (output_root / "artifacts-lock.json").write_text(
        json.dumps(lock, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
