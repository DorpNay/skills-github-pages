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
