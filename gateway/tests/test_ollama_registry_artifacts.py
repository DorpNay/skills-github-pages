from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pytest

from scripts import download_ollama_registry_models as registry
from scripts import install_ollama_registry_model as installer


def test_registry_url_allowlist_and_safe_components():
    registry.validate_url("https://registry.ollama.ai/v2/library/qwen3.5/manifests/4b")
    registry.validate_url("https://dd20bb891979d25aebc8bec07b2b3bbc.r2.cloudflarestorage.com/blob")
    with pytest.raises(registry.DownloadError):
        registry.validate_url("https://attacker.example/model")
    assert registry.safe_component("2b-q4_K_M", "tag") == "2b-q4_K_M"
    with pytest.raises(registry.DownloadError):
        registry.safe_component("../escape", "tag")


def test_acquire_model_records_registry_manifest_and_all_layer_hashes(tmp_path, monkeypatch):
    config_bytes = b'{"model":"fixture"}'
    model_bytes = b"fixture model layer"
    config_sha = hashlib.sha256(config_bytes).hexdigest()
    model_sha = hashlib.sha256(model_bytes).hexdigest()
    manifest = {
        "schemaVersion": 2,
        "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
        "config": {
            "mediaType": "application/vnd.docker.container.image.v1+json",
            "digest": "sha256:" + config_sha,
            "size": len(config_bytes),
        },
        "layers": [{
            "mediaType": "application/vnd.ollama.image.model",
            "digest": "sha256:" + model_sha,
            "size": len(model_bytes),
        }],
    }
    raw_manifest = json.dumps(manifest, separators=(",", ":")).encode()
    model = {
        "id": "fixture_qwen",
        "model": "qwen3.5",
        "namespace": "library",
        "tag": "4b",
        "registry_manifest_url": "https://registry.ollama.ai/v2/library/qwen3.5/manifests/4b",
        "manifest_digest_prefix": "a" * 12,
        "total_bytes": len(config_bytes) + len(model_bytes),
        "config": {
            "media_type": "application/vnd.docker.container.image.v1+json",
            "digest": "sha256:" + config_sha,
            "size_bytes": len(config_bytes),
            "filename": "config.json",
        },
        "layers": [{
            "media_type": "application/vnd.ollama.image.model",
            "digest": "sha256:" + model_sha,
            "size_bytes": len(model_bytes),
            "filename": "model.gguf",
        }],
        "source_url": "https://ollama.com/library/qwen3.5:4b",
        "license": "Apache-2.0",
    }
    raw_sha = hashlib.sha256(raw_manifest).hexdigest()
    model["manifest_sha256"] = raw_sha
    monkeypatch.setattr(
        registry, "fetch_manifest",
        lambda _model, _timeout: (raw_manifest, manifest, raw_sha),
    )

    def fake_download(_namespace, _model, digest, _size, target, _timeout):
        payload = config_bytes if digest == "sha256:" + config_sha else model_bytes
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(payload)
        return hashlib.sha256(payload).hexdigest(), hashlib.sha1(payload).hexdigest(), len(payload)

    monkeypatch.setattr(registry, "download_blob", fake_download)
    results = registry.acquire_model(model, tmp_path, 30)

    package = tmp_path / "fixture_qwen"
    metadata = json.loads((package / "metadata" / "package-metadata.json").read_text())
    assert metadata["files"]["registry_manifest"] == "manifest/manifest.json"
    assert (package / metadata["files"]["config"]).read_bytes() == config_bytes
    assert (package / metadata["files"]["model"]).read_bytes() == model_bytes
    assert len(results) == 4
    assert all(item["status"] == "downloaded-and-verified" for item in results)


def make_fixture_package(root: Path, *, tamper_model: bool = False) -> tuple[Path, Path, bytes, bytes]:
    package = root / "fixture_qwen"
    (package / "manifest").mkdir(parents=True)
    (package / "config").mkdir()
    (package / "model").mkdir()
    (package / "metadata").mkdir()
    config_bytes = b'{"fixture":true}'
    model_bytes = b"fixture gguf bytes"
    config_sha = hashlib.sha256(config_bytes).hexdigest()
    model_sha = hashlib.sha256(model_bytes).hexdigest()
    manifest = {
        "schemaVersion": 2,
        "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
        "config": {
            "mediaType": "application/vnd.docker.container.image.v1+json",
            "digest": "sha256:" + config_sha,
            "size": len(config_bytes),
        },
        "layers": [{
            "mediaType": "application/vnd.ollama.image.model",
            "digest": "sha256:" + model_sha,
            "size": len(model_bytes),
        }],
    }
    raw = json.dumps(manifest, separators=(",", ":")).encode()
    (package / "manifest" / "manifest.json").write_bytes(raw)
    (package / "config" / "config.json").write_bytes(config_bytes)
    (package / "model" / "model.gguf").write_bytes(b"tampered" if tamper_model else model_bytes)
    metadata = {
        "schema_version": 1,
        "id": "fixture_qwen",
        "model": "qwen3.5",
        "namespace": "library",
        "tag": "4b",
        "registry_manifest_digest": "sha256:" + hashlib.sha256(raw).hexdigest(),
        "files": {
            "registry_manifest": "manifest/manifest.json",
            "config": "config/config.json",
            "model": "model/model.gguf",
        },
    }
    (package / "metadata" / "package-metadata.json").write_text(json.dumps(metadata))
    return package, manifest, config_bytes, model_bytes


def test_offline_installer_populates_ollama_blob_store_and_manifest(tmp_path):
    package, manifest, config_bytes, model_bytes = make_fixture_package(tmp_path)
    models_dir = tmp_path / "ollama-models"

    tag = installer.install(package, models_dir)

    assert tag == "qwen3.5:4b"
    config_digest = manifest["config"]["digest"].split(":", 1)[1]
    model_digest = manifest["layers"][0]["digest"].split(":", 1)[1]
    assert (models_dir / "blobs" / ("sha256-" + config_digest)).read_bytes() == config_bytes
    assert (models_dir / "blobs" / ("sha256-" + model_digest)).read_bytes() == model_bytes
    installed_manifest = models_dir / "manifests" / "registry.ollama.ai" / "library" / "qwen3.5" / "4b"
    assert json.loads(installed_manifest.read_text()) == manifest


def test_offline_installer_rejects_tampered_model_blob(tmp_path):
    package, _, _, _ = make_fixture_package(tmp_path, tamper_model=True)
    with pytest.raises(installer.InstallError, match="SHA-256 or size verification"):
        installer.install(package, tmp_path / "ollama-models")


def test_fetch_manifest_checks_raw_sha256_and_registry_url(monkeypatch):
    raw = json.dumps({
        "schemaVersion": 2,
        "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
        "config": {"mediaType": "application/vnd.docker.container.image.v1+json", "digest": "sha256:" + "1" * 64, "size": 1},
        "layers": [],
    }, separators=(",", ":")).encode()
    expected = hashlib.sha256(raw).hexdigest()

    class FakeResponse:
        headers = {"Content-Length": str(len(raw))}
        def __enter__(self): return self
        def __exit__(self, *_args): return False
        def geturl(self): return "https://registry.ollama.ai/v2/library/qwen3.5/manifests/4b"
        def read(self, _limit): return raw

    class FakeOpener:
        def open(self, _request, timeout): return FakeResponse()

    monkeypatch.setattr(registry, "opener", lambda: FakeOpener())
    model = {
        "id": "fixture_qwen",
        "namespace": "library",
        "model": "qwen3.5",
        "tag": "4b",
        "registry_manifest_url": "https://registry.ollama.ai/v2/library/qwen3.5/manifests/4b",
        "manifest_sha256": expected,
    }
    _, parsed, digest = registry.fetch_manifest(model, 10)
    assert parsed["schemaVersion"] == 2
    assert digest == expected

    model["manifest_sha256"] = "0" * 64
    with pytest.raises(registry.DownloadError, match="manifest SHA-256 mismatch"):
        registry.fetch_manifest(model, 10)


def test_download_and_verification_shell_helper_has_valid_bash_syntax():
    import subprocess

    root = Path(__file__).resolve().parents[2]
    script = root / "scripts" / "download_model_artifacts_from_github.sh"
    subprocess.run(["bash", "-n", str(script)], check=True)
