#!/usr/bin/env python3
"""Install a verified Ollama registry package into an explicit Ollama models directory."""
from __future__ import annotations
import argparse
import hashlib
import json
import os
import re
import shutil
import tempfile
from pathlib import Path, PurePosixPath


class InstallError(RuntimeError):
    pass


def sha256_file(path: Path) -> tuple[str, int]:
    digest, size = hashlib.sha256(), 0
    with path.open("rb") as stream:
        while chunk := stream.read(1024 * 1024):
            size += len(chunk)
            digest.update(chunk)
    return digest.hexdigest(), size


def safe_relative(root: Path, relative: str) -> Path:
    path = PurePosixPath(relative)
    if path.is_absolute() or ".." in path.parts or not path.parts:
        raise InstallError("unsafe package-relative path")
    candidate = root.joinpath(*path.parts)
    if candidate.is_symlink() or not candidate.is_file():
        raise InstallError("package file is missing or a symlink: " + relative)
    resolved = candidate.resolve(strict=True)
    if root not in resolved.parents:
        raise InstallError("package file escapes package directory")
    return resolved


def copy_blob(source: Path, target: Path, expected_digest: str, expected_size: int) -> None:
    if not expected_digest.startswith("sha256:"):
        raise InstallError("unsupported blob digest")
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", expected_digest):
        raise InstallError("invalid SHA-256 digest")
    expected_hash = expected_digest.split(":", 1)[1]
    actual_hash, actual_size = sha256_file(source)
    if actual_hash != expected_hash or actual_size != expected_size:
        raise InstallError("source blob failed SHA-256 or size verification: " + source.name)
    target.parent.mkdir(parents=True, exist_ok=True, mode=0o750)
    if target.is_symlink():
        raise InstallError("existing Ollama blob path is a symlink: " + target.name)
    if target.exists():
        if not target.is_file():
            raise InstallError("existing Ollama blob path is not a file: " + target.name)
        existing_hash, existing_size = sha256_file(target)
        if existing_hash != expected_hash or existing_size != expected_size:
            raise InstallError("existing Ollama blob conflicts with expected digest: " + target.name)
        return
    fd, temp_name = tempfile.mkstemp(prefix=".alandi-ollama-", dir=target.parent)
    os.close(fd)
    temp = Path(temp_name)
    try:
        shutil.copyfile(source, temp)
        copied_hash, copied_size = sha256_file(temp)
        if copied_hash != expected_hash or copied_size != expected_size:
            raise InstallError("copied Ollama blob failed verification")
        os.chmod(temp, 0o640)
        os.replace(temp, target)
    finally:
        temp.unlink(missing_ok=True)


def install(package_dir: Path, models_dir: Path) -> str:
    package_root = package_dir.resolve(strict=True)
    if package_root.is_symlink() or not package_root.is_dir():
        raise InstallError("package directory must be a real directory")
    metadata_path = safe_relative(package_root, "metadata/package-metadata.json")
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    if metadata.get("schema_version") != 1:
        raise InstallError("unsupported package metadata schema")

    manifest_relative = metadata.get("files", {}).get("registry_manifest")
    if not manifest_relative:
        raise InstallError("package metadata does not reference the raw registry manifest")
    raw_manifest_path = safe_relative(package_root, manifest_relative)
    raw_manifest = raw_manifest_path.read_bytes()
    manifest_hash = hashlib.sha256(raw_manifest).hexdigest()
    expected_manifest = metadata.get("registry_manifest_digest", "")
    if expected_manifest != "sha256:" + manifest_hash:
        raise InstallError("registry manifest SHA-256 mismatch")
    manifest = json.loads(raw_manifest)
    if manifest.get("schemaVersion") != 2:
        raise InstallError("unsupported Ollama registry manifest")

    namespace = metadata.get("namespace")
    model = metadata.get("model")
    tag = metadata.get("tag")
    for value in (namespace, model, tag):
        if not isinstance(value, str) or not value or "/" in value or "\\" in value or ".." in value:
            raise InstallError("unsafe model namespace/name/tag")
    files = metadata.get("files", {})
    config = manifest.get("config", {})
    config_path = safe_relative(package_root, files.get("config", ""))
    copy_blob(
        config_path,
        models_dir / "blobs" / ("sha256-" + config["digest"].split(":", 1)[1]),
        config["digest"],
        config["size"],
    )

    layers = manifest.get("layers", [])
    if not isinstance(layers, list) or not layers:
        raise InstallError("registry manifest has no layers")
    for descriptor in layers:
        media_type = descriptor.get("mediaType")
        mapping = {
            "application/vnd.ollama.image.model": "model",
            "application/vnd.ollama.image.projector": "projector",
            "application/vnd.ollama.image.template": "template",
            "application/vnd.ollama.image.license": "license",
            "application/vnd.ollama.image.params": "params",
        }
        layer_name = mapping.get(media_type)
        if not layer_name or layer_name not in files:
            raise InstallError("unexpected or missing Ollama layer media type")
        source = safe_relative(package_root, files[layer_name])
        digest = descriptor.get("digest")
        size = descriptor.get("size")
        if not isinstance(size, int) or size < 0:
            raise InstallError("invalid layer size")
        copy_blob(
            source,
            models_dir / "blobs" / ("sha256-" + digest.split(":", 1)[1]),
            digest,
            size,
        )

    manifest_target = models_dir / "manifests" / "registry.ollama.ai" / namespace / model / tag
    manifest_target.parent.mkdir(parents=True, exist_ok=True, mode=0o750)
    if manifest_target.is_symlink():
        raise InstallError("existing Ollama manifest path is a symlink")
    if manifest_target.exists():
        if not manifest_target.is_file():
            raise InstallError("existing Ollama manifest path is not a file")
        existing = manifest_target.read_bytes()
        if hashlib.sha256(existing).hexdigest() != manifest_hash:
            raise InstallError("existing Ollama tag points to a different manifest; refusing to overwrite")
    else:
        fd, temp_name = tempfile.mkstemp(prefix=".alandi-manifest-", dir=manifest_target.parent)
        os.close(fd)
        temp = Path(temp_name)
        try:
            temp.write_bytes(raw_manifest)
            os.chmod(temp, 0o640)
            os.replace(temp, manifest_target)
        finally:
            temp.unlink(missing_ok=True)
    return model + ":" + tag


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package-dir", required=True, type=Path)
    parser.add_argument("--models-dir", required=True, type=Path,
                        help="exact directory configured by Ollama's OLLAMA_MODELS")
    args = parser.parse_args()
    args.models_dir.mkdir(parents=True, exist_ok=True, mode=0o750)
    model_tag = install(args.package_dir, args.models_dir)
    print("Installed verified Ollama package metadata for " + model_tag)
    print("Next: run 'ollama show " + model_tag + "' and a read-only smoke test.")
    print("This script does not restart Ollama, change service ownership, or run model inference.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
