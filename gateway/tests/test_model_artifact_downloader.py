from __future__ import annotations

import hashlib
import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "download_model_artifacts.py"
SPEC = importlib.util.spec_from_file_location("download_model_artifacts", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def test_git_blob_hash_matches_git_object_format(tmp_path: Path) -> None:
    payload = b"alandi model artifact fixture"
    target = tmp_path / "fixture.bin"
    target.write_bytes(payload)
    sha256, git_sha1 = MODULE.hashes(target, len(payload))
    expected_git = hashlib.sha1(f"blob {len(payload)}\0".encode() + payload).hexdigest()
    assert git_sha1 == expected_git
    assert sha256 == hashlib.sha256(payload).hexdigest()


def test_verify_file_checks_size_and_hash(tmp_path: Path) -> None:
    payload = b"verified"
    target = tmp_path / "artifact.bin"
    target.write_bytes(payload)
    expected = {
        "size_bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
        "git_blob_sha1": hashlib.sha1(f"blob {len(payload)}\0".encode() + payload).hexdigest(),
    }
    assert MODULE.verify_file(target, expected)[0] is True
    assert MODULE.verify_file(target, {**expected, "size_bytes": len(payload) + 1})[0] is False


def test_safe_relative_path_rejects_traversal() -> None:
    for value in ("../escape", "/absolute", "nested/../../escape"):
        try:
            MODULE.safe_relative_path(value)
        except ValueError:
            continue
        raise AssertionError(f"Unsafe path was accepted: {value}")


def test_destination_stays_inside_package_root(tmp_path: Path) -> None:
    target = MODULE.destination(tmp_path, "qwen3_embedding_06b", "model.safetensors")
    assert target == (tmp_path / "qwen3_embedding_06b" / "model.safetensors").resolve()


def test_manifest_pins_downloadable_artifacts_and_excludes_primary_model() -> None:
    manifest = MODULE.load_manifest()
    packages = manifest["packages"]
    ids = [package["id"] for package in packages]
    assert len(ids) == len(set(ids))
    main = next(package for package in packages if package["id"] == "qwen35_uncensored_main")
    assert main["download"] is False
    downloadable = [package for package in packages if package.get("download")]
    total = sum(item.get("size_bytes", 0) for package in downloadable for item in package.get("files", []))
    assert total == manifest["expected_download_bytes"]
    for package in downloadable:
        for item in package.get("files", []):
            assert item.get("size_bytes", 0) > 0
            assert item.get("sha256") or item.get("git_blob_sha1")
