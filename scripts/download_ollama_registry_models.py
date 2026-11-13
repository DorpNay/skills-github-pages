#!/usr/bin/env python3
"""Acquire SHA-pinned official Ollama registry model packages without committing weights."""
from __future__ import annotations

import argparse
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
from typing import Any

MAX_MANIFEST_BYTES = 2 * 1024 * 1024
READ_CHUNK = 1024 * 1024
ALLOWED_INITIAL_HOSTS = {"registry.ollama.ai"}
ALLOWED_REDIRECT_HOSTS = {"dd20bb891979d25aebc8bec07b2b3bbc.r2.cloudflarestorage.com"}
MEDIA_FILES = {
    "application/vnd.ollama.image.model": ("model", "model.gguf"),
    "application/vnd.ollama.image.projector": ("projector", "mmproj.gguf"),
    "application/vnd.ollama.image.template": ("template", "template.txt"),
    "application/vnd.ollama.image.license": ("license", "LICENSE"),
    "application/vnd.ollama.image.params": ("params", "params.json"),
}


class DownloadError(RuntimeError):
    pass


def validate_url(url: str) -> None:
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise DownloadError("registry URL must be HTTPS without embedded credentials")
    host = parsed.hostname.lower()
    if host not in ALLOWED_INITIAL_HOSTS and host not in ALLOWED_REDIRECT_HOSTS:
        raise DownloadError("registry redirect host is not on the pinned allowlist: " + host)


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        validate_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def opener():
    return urllib.request.build_opener(SafeRedirectHandler())


def digests(path: Path) -> tuple[str, str, int]:
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


def safe_component(value: str, label: str) -> str:
    if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,100}", value):
        raise DownloadError("unsafe " + label)
    if PurePosixPath(value).name != value or value in {".", ".."}:
        raise DownloadError("unsafe " + label)
    return value


def fetch_manifest(model: dict[str, Any], timeout: int) -> tuple[bytes, dict[str, Any], str]:
    url = model["registry_manifest_url"]
    expected_url = "https://registry.ollama.ai/v2/" + model["namespace"] + "/" + model["model"] + "/manifests/" + model["tag"]
    if url != expected_url:
        raise DownloadError("registry manifest URL does not match the pinned namespace/model/tag")
    validate_url(url)
    request = urllib.request.Request(url, headers={
        "User-Agent": "aLandi-ollama-registry-acquirer/1.0",
        "Accept": "application/vnd.docker.distribution.manifest.v2+json",
    })
    with opener().open(request, timeout=timeout) as response:
        validate_url(response.geturl())
        declared = response.headers.get("Content-Length")
        if declared and int(declared) > MAX_MANIFEST_BYTES:
            raise DownloadError("registry manifest exceeds 2 MiB")
        raw = response.read(MAX_MANIFEST_BYTES + 1)
        if len(raw) > MAX_MANIFEST_BYTES:
            raise DownloadError("registry manifest exceeds 2 MiB")
    digest = hashlib.sha256(raw).hexdigest()
    if not digest.startswith(model["manifest_digest_prefix"]):
        raise DownloadError("registry manifest digest prefix mismatch for " + model["id"])
    manifest = json.loads(raw)
    if manifest.get("schemaVersion") != 2:
        raise DownloadError("unsupported Ollama registry manifest schema")
    if manifest.get("mediaType") != "application/vnd.docker.distribution.manifest.v2+json":
        raise DownloadError("unexpected Ollama registry manifest media type")
    return raw, manifest, digest


def download_blob(namespace: str, model_name: str, digest: str, expected_size: int,
                  target: Path, timeout: int) -> tuple[str, str, int]:
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", digest):
        raise DownloadError("invalid OCI blob digest")
    if not 0 < expected_size <= 4 * 1024**3:
        raise DownloadError("OCI blob size is outside the 4 GiB bound")
    url = "https://registry.ollama.ai/v2/" + namespace + "/" + model_name + "/blobs/" + digest
    validate_url(url)
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=".ollama.", suffix=".part", dir=target.parent)
    os.close(fd)
    temp = Path(temp_name)
    try:
        request = urllib.request.Request(url, headers={
            "User-Agent": "aLandi-ollama-registry-acquirer/1.0",
            "Accept": "application/octet-stream",
        })
        with opener().open(request, timeout=timeout) as response, temp.open("wb") as out:
            validate_url(response.geturl())
            declared = response.headers.get("Content-Length")
            if declared and int(declared) != expected_size:
                raise DownloadError("registry blob Content-Length mismatch")
            total = 0
            while True:
                chunk = response.read(READ_CHUNK)
                if not chunk:
                    break
                total += len(chunk)
                if total > expected_size:
                    raise DownloadError("registry blob exceeded pinned size")
                out.write(chunk)
            out.flush()
            os.fsync(out.fileno())
        sha256, sha1, size = digests(temp)
        expected_hash = digest.split(":", 1)[1]
        if size != expected_size or sha256 != expected_hash:
            raise DownloadError("registry blob size or SHA-256 mismatch")
        os.replace(temp, target)
        return sha256, sha1, size
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise DownloadError(type(exc).__name__ + ": " + str(exc)) from None
    finally:
        temp.unlink(missing_ok=True)


def write_file_record(model_id: str, layer_name: str, target: Path, source_url: str,
                      sha256: str, sha1: str, size: int, digest: str,
                      media_type: str) -> dict[str, Any]:
    sidecar = {
        "schema_version": 1,
        "id": model_id + "_" + layer_name,
        "model_id": model_id,
        "layer": layer_name,
        "filename": target.name,
        "source_url": source_url,
        "oci_digest": digest,
        "media_type": media_type,
        "size_bytes": size,
        "sha256": sha256,
        "sha1": sha1,
        "status": "downloaded-and-verified",
        "acquired_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    (target.parent / "artifact-metadata.json").write_text(
        json.dumps(sidecar, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return {
        "id": sidecar["id"], "status": sidecar["status"],
        "size_bytes": size, "sha256": sha256, "sha1": sha1,
    }


def acquire_model(model: dict[str, Any], output_root: Path, timeout: int) -> list[dict[str, Any]]:
    model_id = safe_component(model["id"], "model id")
    namespace = safe_component(model["namespace"], "namespace")
    model_name = safe_component(model["model"], "model name")
    tag = safe_component(model["tag"], "tag")
    raw, registry_manifest, manifest_sha = fetch_manifest(model, timeout)

    config_expected = model["config"]
    config_desc = registry_manifest.get("config", {})
    if (config_desc.get("digest") != config_expected["digest"]
            or config_desc.get("size") != config_expected["size_bytes"]
            or config_desc.get("mediaType") != config_expected["media_type"]):
        raise DownloadError(model_id + ": registry config descriptor differs from pinned manifest")

    expected_layers = {entry["media_type"]: entry for entry in model["layers"]}
    actual_layers = registry_manifest.get("layers", [])
    if not isinstance(actual_layers, list) or len(actual_layers) != len(expected_layers):
        raise DownloadError(model_id + ": registry layer count differs from pinned manifest")
    for desc in actual_layers:
        expected = expected_layers.get(desc.get("mediaType"))
        if expected is None or desc.get("digest") != expected["digest"] or desc.get("size") != expected["size_bytes"]:
            raise DownloadError(model_id + ": registry layer descriptor differs from pinned manifest")

    descriptors = [("config", config_expected)] + [
        (MEDIA_FILES[item["media_type"]][0], item) for item in model["layers"]
    ]
    total_expected = config_expected["size_bytes"] + sum(x["size_bytes"] for x in model["layers"])
    if total_expected != model["total_bytes"]:
        raise DownloadError(model_id + ": local manifest total byte count is inconsistent")

    package_dir = output_root / model_id
    package_dir.mkdir(parents=True, exist_ok=True)
    manifest_dir = package_dir / "manifest"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    manifest_file = manifest_dir / "manifest.json"
    manifest_file.write_bytes(raw)
    manifest_sha1 = hashlib.sha1(raw).hexdigest()
    results = [write_file_record(
        model_id, "registry_manifest", manifest_file, model["registry_manifest_url"],
        manifest_sha, manifest_sha1, len(raw), "sha256:" + manifest_sha,
        "application/vnd.docker.distribution.manifest.v2+json",
    )]

    files = {"registry_manifest": str(manifest_file.relative_to(package_dir))}
    for layer_name, expected in descriptors:
        if layer_name == "config":
            filename = config_expected["filename"]
            media_type = config_expected["media_type"]
        else:
            media_type = expected["media_type"]
            filename = MEDIA_FILES[media_type][1]
        target = package_dir / layer_name / safe_component(filename, "layer filename")
        sha256, sha1, size = download_blob(
            namespace, model_name, expected["digest"], expected["size_bytes"], target, timeout
        )
        blob_url = "https://registry.ollama.ai/v2/" + namespace + "/" + model_name + "/blobs/" + expected["digest"]
        results.append(write_file_record(
            model_id, layer_name, target, blob_url, sha256, sha1, size,
            expected["digest"], media_type,
        ))
        files[layer_name] = str(target.relative_to(package_dir))

    package_metadata = {
        "schema_version": 1,
        "id": model_id,
        "model": model_name,
        "namespace": namespace,
        "tag": tag,
        "source_url": model["source_url"],
        "registry_manifest_url": model["registry_manifest_url"],
        "registry_manifest_digest": "sha256:" + manifest_sha,
        "registry_manifest_digest_prefix": model["manifest_digest_prefix"],
        "architecture": model.get("architecture"),
        "parameters": model.get("parameters"),
        "quantization": model.get("quantization"),
        "context_tokens": model.get("context_tokens"),
        "capabilities": model.get("capabilities", []),
        "license": model.get("license"),
        "total_bytes": total_expected,
        "files": files,
        "acquired_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "notes": model.get("notes"),
    }
    metadata_dir = package_dir / "metadata"
    metadata_dir.mkdir(parents=True, exist_ok=True)
    metadata_file = metadata_dir / "package-metadata.json"
    metadata_file.write_text(json.dumps(package_metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    meta_sha, meta_sha1, meta_size = digests(metadata_file)
    results.append(write_file_record(
        model_id, "package_metadata", metadata_file, model["registry_manifest_url"],
        meta_sha, meta_sha1, meta_size, "sha256:" + meta_sha, "application/json",
    ))
    print(model_id + ": " + str(total_expected) + " bytes; registry manifest sha256:" + manifest_sha)
    for result in results:
        print("  " + result["id"] + ": " + str(result["size_bytes"]) + " bytes sha256:" + result["sha256"])
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", default="models/manifest-ollama-registry.json")
    parser.add_argument("--output-dir", default="artifacts")
    parser.add_argument("--timeout", type=int, default=900)
    parser.add_argument("--only", action="append", default=[])
    args = parser.parse_args()
    if not 10 <= args.timeout <= 3600:
        parser.error("--timeout must be between 10 and 3600 seconds")

    raw = Path(args.manifest).read_bytes()
    if len(raw) > MAX_MANIFEST_BYTES:
        raise SystemExit("local registry manifest exceeds 2 MiB")
    manifest = json.loads(raw)
    if manifest.get("schema_version") != 1 or not isinstance(manifest.get("models"), list):
        raise SystemExit("unsupported local registry manifest")
    models = manifest["models"]
    if args.only:
        wanted = set(args.only)
        known = {item["id"] for item in models}
        if wanted - known:
            parser.error("unknown model id(s): " + ", ".join(sorted(wanted - known)))
        models = [item for item in models if item["id"] in wanted]

    output_root = Path(args.output_dir).resolve()
    output_root.mkdir(parents=True, exist_ok=True)
    results, failures = [], []
    for model in models:
        try:
            results.extend(acquire_model(model, output_root, args.timeout))
        except Exception as exc:
            failures.append(model["id"] + ": " + str(exc))
            print("FAILED " + model["id"] + ": " + str(exc), file=sys.stderr)
    lock = {
        "schema_version": 1,
        "manifest_updated": manifest.get("updated"),
        "results": sorted(results, key=lambda row: row["id"]),
        "failures": sorted(failures),
    }
    (output_root / "artifacts-lock.json").write_text(json.dumps(lock, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
