from __future__ import annotations

import hashlib
import io
import json
import tarfile
from pathlib import Path

import pytest

from scripts import download_model_artifacts as acquirer


class FakeResponse:
    def __init__(self, payload: bytes):
        self.payload = payload
        self.offset = 0
        self.headers = {"Content-Length": str(len(payload))}

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def geturl(self):
        return "https://huggingface.co/test/revision/model.bin"

    def read(self, size=-1):
        if size < 0:
            size = len(self.payload) - self.offset
        chunk = self.payload[self.offset:self.offset + size]
        self.offset += len(chunk)
        return chunk


class FakeOpener:
    def __init__(self, response):
        self.response = response

    def open(self, request, timeout):
        assert timeout == 30
        return self.response


def test_safe_id_rejects_path_traversal_and_accepts_manifest_ids():
    assert acquirer.safe_id("qwen3_asr_06b") == "qwen3_asr_06b"
    with pytest.raises(acquirer.DownloadError):
        acquirer.safe_id("../outside")


def test_download_pins_hash_and_writes_provenance_sidecar(tmp_path, monkeypatch):
    payload = b"synthetic model bytes"
    digest = hashlib.sha256(payload).hexdigest()
    item = {
        "id": "test_model",
        "role": "embedding",
        "acquisition": "artifact",
        "source_url": "https://huggingface.co/test/revision/model.bin",
        "filename": "model.bin",
        "max_bytes": 1024,
        "size_bytes": len(payload),
        "sha256": digest,
        "repository": "test/model",
        "revision": "a" * 40,
        "license": "Apache-2.0",
    }
    monkeypatch.setattr(acquirer, "validate_url", lambda url: None)
    monkeypatch.setattr(
        acquirer.urllib.request, "build_opener",
        lambda handler: FakeOpener(FakeResponse(payload)),
    )

    result = acquirer.download_one(item, tmp_path, 30)

    target_dir = tmp_path / "test_model"
    assert result["status"] == "downloaded-and-verified"
    assert result["sha256"] == digest
    assert (target_dir / "model.bin").read_bytes() == payload
    sidecar = json.loads((target_dir / "artifact-metadata.json").read_text(encoding="utf-8"))
    assert sidecar["revision"] == "a" * 40
    assert sidecar["sha256"] == digest
    assert sidecar["size_bytes"] == len(payload)


def test_download_rejects_bad_hash_and_removes_partial_file(tmp_path, monkeypatch):
    payload = b"not the pinned artifact"
    item = {
        "id": "bad_hash",
        "source_url": "https://huggingface.co/test/revision/model.bin",
        "filename": "model.bin",
        "max_bytes": 1024,
        "size_bytes": len(payload),
        "sha256": "0" * 64,
    }
    monkeypatch.setattr(acquirer, "validate_url", lambda url: None)
    monkeypatch.setattr(
        acquirer.urllib.request, "build_opener",
        lambda handler: FakeOpener(FakeResponse(payload)),
    )

    with pytest.raises(acquirer.DownloadError, match="SHA-256 mismatch"):
        acquirer.download_one(item, tmp_path, 30)

    assert not (tmp_path / "bad_hash" / "model.bin").exists()
    assert not list((tmp_path / "bad_hash").glob("*.part"))


def test_existing_artifact_is_rehashed_before_reuse(tmp_path, monkeypatch):
    payload = b"cached pinned artifact"
    digest = hashlib.sha256(payload).hexdigest()
    target_dir = tmp_path / "cached_model"
    target_dir.mkdir()
    (target_dir / "model.bin").write_bytes(payload)
    item = {
        "id": "cached_model",
        "source_url": "https://huggingface.co/test/revision/model.bin",
        "filename": "model.bin",
        "max_bytes": 1024,
        "size_bytes": len(payload),
        "sha256": digest,
    }
    monkeypatch.setattr(acquirer, "validate_url", lambda url: None)

    result = acquirer.download_one(item, tmp_path, 30)

    assert result["status"] == "reused-verified"
    assert result["sha256"] == digest


def test_tar_archive_validation_rejects_traversal_and_links(tmp_path):
    safe_path = tmp_path / "safe.tar.bz2"
    with tarfile.open(safe_path, "w:bz2") as archive:
        info = tarfile.TarInfo("model/encoder.onnx")
        info.size = 3
        archive.addfile(info, io.BytesIO(b"onn"))
    acquirer.validate_archive(safe_path, "safe")

    unsafe_path = tmp_path / "unsafe.tar.bz2"
    with tarfile.open(unsafe_path, "w:bz2") as archive:
        info = tarfile.TarInfo("../escape.txt")
        info.size = 1
        archive.addfile(info, io.BytesIO(b"x"))
    with pytest.raises(acquirer.DownloadError, match="unsafe archive path"):
        acquirer.validate_archive(unsafe_path, "unsafe")


def test_verifier_accepts_exact_artifact_lock_and_sidecar(tmp_path):
    from scripts import verify_model_artifacts as verifier

    payload = b"verified model fixture"
    sha256 = hashlib.sha256(payload).hexdigest()
    sha1 = hashlib.sha1(payload).hexdigest()
    artifact_dir = tmp_path / "artifact-123" / "fixture_model"
    artifact_dir.mkdir(parents=True)
    (artifact_dir / "weights.bin").write_bytes(payload)
    sidecar = {
        "id": "fixture_model",
        "filename": "weights.bin",
        "size_bytes": len(payload),
        "sha256": sha256,
        "sha1": sha1,
    }
    (artifact_dir / "artifact-metadata.json").write_text(json.dumps(sidecar), encoding="utf-8")
    lock_path = tmp_path / "artifact-123" / "artifacts-lock.json"
    lock_path.write_text(json.dumps({
        "schema_version": 1,
        "results": [{
            "id": "fixture_model",
            "status": "downloaded-and-verified",
            "size_bytes": len(payload),
            "sha256": sha256,
            "sha1": sha1,
        }],
    }), encoding="utf-8")

    assert verifier.verify(tmp_path, lock_path)[0].startswith("fixture_model: ")


def test_verifier_rejects_checksum_mismatch(tmp_path):
    from scripts import verify_model_artifacts as verifier

    artifact_dir = tmp_path / "artifact-123" / "fixture_model"
    artifact_dir.mkdir(parents=True)
    (artifact_dir / "weights.bin").write_bytes(b"tampered")
    (artifact_dir / "artifact-metadata.json").write_text(json.dumps({
        "id": "fixture_model",
        "filename": "weights.bin",
        "size_bytes": 8,
        "sha256": "0" * 64,
        "sha1": "0" * 40,
    }), encoding="utf-8")
    lock_path = tmp_path / "artifact-123" / "artifacts-lock.json"
    lock_path.write_text(json.dumps({
        "schema_version": 1,
        "results": [{
            "id": "fixture_model",
            "status": "downloaded-and-verified",
            "size_bytes": 8,
            "sha256": "0" * 64,
            "sha1": "0" * 40,
        }],
    }), encoding="utf-8")

    with pytest.raises(ValueError, match="SHA-256 mismatch"):
        verifier.verify(tmp_path, lock_path)
