from __future__ import annotations

import hashlib
import importlib.util
import subprocess
import sys
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


def test_download_cli_dry_run_is_offline_and_succeeds() -> None:
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--dry-run"],
        check=False,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr
    assert "6033970026" in result.stdout
    assert "qwen35_uncensored_main" not in result.stdout
    assert "qwen35_4b_base_reference" in result.stdout
    assert "qwen3_embedding_06b_ollama" in result.stdout
    assert "qwen3_embedding_06b [" not in result.stdout


def test_cache_root_rejects_repository_paths(tmp_path: Path) -> None:
    try:
        MODULE.resolve_cache_root(MODULE.REPO_ROOT / "models" / "cache")
    except ValueError as exc:
        assert "outside the Git repository" in str(exc)
    else:
        raise AssertionError("Repository-local model cache was accepted")


def test_sha256_inventory_covers_downloaded_files(tmp_path: Path) -> None:
    package = tmp_path / "package"
    package.mkdir()
    payload = b"model sidecar fixture"
    (package / "weights.bin").write_bytes(payload)
    sums = MODULE.write_sha256sums(package)
    assert sums.read_text(encoding="utf-8") == f"{hashlib.sha256(payload).hexdigest()}  weights.bin\n"


def test_disabled_primary_package_is_not_in_download_plan() -> None:
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--dry-run", "--package", "qwen35_uncensored_main"],
        check=False,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 2
    assert "intentionally not downloadable" in result.stderr


def test_ollama_reference_digest_prefix_is_checked() -> None:
    package = {
        "model_tag": "qwen3.5:4b",
        "expected_digest_prefix": "d8b0f5e9760c",
    }
    output = "NAME ID SIZE MODIFIED\nqwen3.5:4b d8b0f5e9760c 3.3 GB 2 weeks ago\n"
    assert MODULE.ollama_digest_matches(output, package)[0] is True
    bad = "NAME ID SIZE MODIFIED\nqwen3.5:4b 000000000000 3.3 GB 2 weeks ago\n"
    assert MODULE.ollama_digest_matches(bad, package)[0] is False


def test_verify_package_checks_required_support_files(tmp_path: Path) -> None:
    package_root = tmp_path / "support_package"
    package_root.mkdir()
    (package_root / "config.json").write_text("{}", encoding="utf-8")
    package = {"id": "support_package", "files": [], "required_paths": ["config.json"]}
    assert MODULE.verify_package(tmp_path, package) == []
    (package_root / "config.json").unlink()
    assert MODULE.verify_package(tmp_path, package)


def test_disk_preflight_reserves_minimum_and_scaled_margin() -> None:
    assert MODULE.required_free_bytes(0) == 0
    assert MODULE.required_free_bytes(1) == 1 + 64 * 1024 * 1024
    payload = 2_000_000_000
    assert MODULE.required_free_bytes(payload) == payload + payload // 20

class _FakeArtifactResponse:
    def __init__(self, body: bytes, *, status: int, headers: dict[str, str] | None = None,
                 fail_after_body: bool = False) -> None:
        self.body = body
        self.status = status
        self.headers = headers or {}
        self.fail_after_body = fail_after_body
        self.read_count = 0

    def __enter__(self):
        return self

    def __exit__(self, *_args) -> None:
        return None

    def geturl(self) -> str:
        return "https://raw.githubusercontent.com/example/artifact.bin"

    def getcode(self) -> int:
        return self.status

    def read(self, _size: int = -1) -> bytes:
        if self.fail_after_body and self.read_count:
            raise OSError("simulated interrupted transfer")
        self.read_count += 1
        body, self.body = self.body, b""
        return body


class _FakeArtifactOpener:
    def __init__(self, response: _FakeArtifactResponse) -> None:
        self.response = response
        self.request = None

    def open(self, request, timeout: int):
        assert timeout == 90
        self.request = request
        return self.response


def _install_fake_artifact_response(monkeypatch, response: _FakeArtifactResponse) -> _FakeArtifactOpener:
    opener = _FakeArtifactOpener(response)
    monkeypatch.setattr(MODULE.urllib.request, "build_opener", lambda *_args: opener)
    return opener


def test_download_url_resumes_valid_partial_and_promotes_after_hash_verification(tmp_path: Path, monkeypatch) -> None:
    payload = b"prefix-suffix"
    target = tmp_path / "artifact.bin"
    target.with_name(target.name + ".partial").write_bytes(b"prefix")
    response = _FakeArtifactResponse(
        b"-suffix", status=206, headers={"Content-Range": f"bytes 6-12/{len(payload)}"}
    )
    opener = _install_fake_artifact_response(monkeypatch, response)

    MODULE.download_url(
        "https://raw.githubusercontent.com/example/artifact.bin",
        target,
        len(payload),
        hashlib.sha256(payload).hexdigest(),
    )

    assert opener.request is not None
    assert opener.request.get_header("Range") == "bytes=6-"
    assert target.read_bytes() == payload
    assert not target.with_name(target.name + ".partial").exists()


def test_download_url_restarts_when_server_ignores_range(tmp_path: Path, monkeypatch) -> None:
    payload = b"complete"
    target = tmp_path / "artifact.bin"
    target.with_name(target.name + ".partial").write_bytes(b"stale")
    response = _FakeArtifactResponse(payload, status=200)
    opener = _install_fake_artifact_response(monkeypatch, response)

    MODULE.download_url(
        "https://raw.githubusercontent.com/example/artifact.bin",
        target,
        len(payload),
        hashlib.sha256(payload).hexdigest(),
    )

    assert opener.request is not None
    assert opener.request.get_header("Range") == "bytes=5-"
    assert target.read_bytes() == payload


def test_download_url_preserves_partial_after_interruption_and_resumes_again(tmp_path: Path, monkeypatch) -> None:
    payload = b"prefixchunk!"
    target = tmp_path / "artifact.bin"
    partial = target.with_name(target.name + ".partial")
    partial.write_bytes(b"prefix")
    interrupted = _FakeArtifactResponse(
        b"chunk", status=206, headers={"Content-Range": f"bytes 6-11/{len(payload)}"},
        fail_after_body=True,
    )
    _install_fake_artifact_response(monkeypatch, interrupted)
    try:
        MODULE.download_url(
            "https://raw.githubusercontent.com/example/artifact.bin",
            target,
            len(payload),
            hashlib.sha256(payload).hexdigest(),
        )
    except OSError as exc:
        assert "interrupted" in str(exc)
    else:
        raise AssertionError("Interrupted transfer unexpectedly succeeded")
    assert partial.read_bytes() == b"prefixchunk"

    resumed = _FakeArtifactResponse(
        b"!", status=206, headers={"Content-Range": f"bytes 11-11/{len(payload)}"}
    )
    _install_fake_artifact_response(monkeypatch, resumed)
    MODULE.download_url(
        "https://raw.githubusercontent.com/example/artifact.bin",
        target,
        len(payload),
        hashlib.sha256(payload).hexdigest(),
    )
    assert target.read_bytes() == payload
    assert not partial.exists()


def test_download_url_rejects_mismatched_content_range_without_appending(tmp_path: Path, monkeypatch) -> None:
    target = tmp_path / "artifact.bin"
    partial = target.with_name(target.name + ".partial")
    partial.write_bytes(b"prefix")
    response = _FakeArtifactResponse(
        b"suffix", status=206, headers={"Content-Range": "bytes 5-10/11"}
    )
    _install_fake_artifact_response(monkeypatch, response)

    try:
        MODULE.download_url(
            "https://raw.githubusercontent.com/example/artifact.bin", target, 11
        )
    except ValueError as exc:
        assert "does not match the partial file" in str(exc)
    else:
        raise AssertionError("Mismatched Content-Range was accepted")
    assert partial.read_bytes() == b"prefix"
    assert not target.exists()


def test_download_url_rejects_bad_hash_before_atomic_promotion(tmp_path: Path, monkeypatch) -> None:
    target = tmp_path / "artifact.bin"
    response = _FakeArtifactResponse(b"complete", status=200)
    _install_fake_artifact_response(monkeypatch, response)

    try:
        MODULE.download_url(
            "https://raw.githubusercontent.com/example/artifact.bin",
            target,
            8,
            hashlib.sha256(b"not-complete").hexdigest(),
        )
    except ValueError as exc:
        assert "SHA-256 mismatch" in str(exc)
    else:
        raise AssertionError("Bad SHA-256 was accepted")
    assert not target.exists()
    assert not target.with_name(target.name + ".partial").exists()


def test_download_url_promotes_only_a_complete_verified_416_partial(tmp_path: Path, monkeypatch) -> None:
    payload = b"complete"
    target = tmp_path / "artifact.bin"
    target.with_name(target.name + ".partial").write_bytes(payload)
    response = _FakeArtifactResponse(
        b"", status=416, headers={"Content-Range": f"bytes */{len(payload)}"}
    )
    opener = _install_fake_artifact_response(monkeypatch, response)

    MODULE.download_url(
        "https://raw.githubusercontent.com/example/artifact.bin",
        target,
        len(payload),
        hashlib.sha256(payload).hexdigest(),
    )

    assert opener.request is not None
    assert opener.request.get_header("Range") == f"bytes={len(payload)}-"
    assert target.read_bytes() == payload

def test_download_url_rejects_symlinked_partial_path(tmp_path: Path, monkeypatch) -> None:
    target = tmp_path / "artifact.bin"
    outside = tmp_path / "outside.bin"
    outside.write_bytes(b"do-not-touch")
    target.with_name(target.name + ".partial").symlink_to(outside)
    response = _FakeArtifactResponse(b"replacement", status=200)
    _install_fake_artifact_response(monkeypatch, response)

    try:
        MODULE.download_url(
            "https://raw.githubusercontent.com/example/artifact.bin", target, 11
        )
    except ValueError as exc:
        assert "Unsafe partial artifact path" in str(exc)
    else:
        raise AssertionError("Symlinked partial path was accepted")
    assert outside.read_bytes() == b"do-not-touch"
    assert not target.exists()

