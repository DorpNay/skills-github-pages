#!/usr/bin/env python3
"""Deterministic source-state fingerprint. Not a signature or safety proof."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATHS = (
    ".github", "docs", "evals", "gateway", "infra", "intel",
    "latency", "observability", "router", "scripts",
)
ROOT_FILES = (
    ".gitignore", "_config.yml", "AGENTS.md", "DECISIONS.md", "EVALS.md",
    "IMPROVEMENT_SELECTION.md", "INTEL.md", "LICENSE", "LOOP.md", "index.md",
    "PROVIDER_SETUP.md", "README.md", "pyproject.toml",
)
IGNORED_DIRS = {
    ".git", ".hg", ".svn", ".venv", "venv", "env", "node_modules",
    "__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache", ".next",
    ".nuxt", "dist", "build", "target", "coverage", "playwright-report",
    "test-results", ".cache",
}
SECRET_SUFFIXES = (".pem", ".key", ".p12", ".pfx", ".p7b", ".p7c", ".keystore", ".token", ".secret")
SECRET_NAMES = {"credentials.json", "secrets.json", "service-account.json", "id_rsa", "id_ed25519"}
SAFE_ENV_TEMPLATES = {".env.example", ".env.sample", ".env.template"}


def is_ignored(relative_path: Path) -> bool:
    if any(part in IGNORED_DIRS for part in relative_path.parts):
        return True
    name = relative_path.name.lower()
    if name == ".env" or (name.startswith(".env.") and name not in SAFE_ENV_TEMPLATES):
        return True
    if name in SECRET_NAMES or name.endswith(SECRET_SUFFIXES):
        return True
    return name.endswith((".env.local", ".env.production", ".env.development"))


def selected_files(root: Path) -> list[Path]:
    root = root.resolve()
    candidates: dict[str, Path] = {}
    for relative in (*ROOT_FILES, *SOURCE_PATHS):
        candidate = root / relative
        if not candidate.exists() or candidate.is_symlink():
            continue
        if candidate.is_file():
            rel = candidate.relative_to(root)
            if not is_ignored(rel):
                candidates[rel.as_posix()] = candidate
            continue
        if not candidate.is_dir():
            continue
        for child in candidate.rglob("*"):
            if child.is_symlink() or not child.is_file():
                continue
            rel = child.relative_to(root)
            if not is_ignored(rel):
                candidates[rel.as_posix()] = child
    return [candidates[name] for name in sorted(candidates)]


def build_manifest(root: Path = ROOT) -> dict[str, Any]:
    root = root.resolve()
    artifacts: list[dict[str, Any]] = []
    for path in selected_files(root):
        relative = path.relative_to(root).as_posix()
        try:
            content = path.read_bytes()
        except OSError as exc:
            raise RuntimeError(f"Cannot read source artifact {relative}: {type(exc).__name__}") from None
        artifacts.append({"path": relative, "sha256": hashlib.sha256(content).hexdigest(),
                          "size_bytes": len(content)})
    if not artifacts:
        raise RuntimeError("No source artifacts found; refusing to create an empty state hash")
    canonical = "".join(item["path"] + "\0" + item["sha256"] + "\n" for item in artifacts).encode()
    return {
        "schema": "alandi-artifact-state", "schema_version": 1,
        "algorithm": "sha256(sorted(path + NUL + file_sha256 + LF))",
        "state_hash": hashlib.sha256(canonical).hexdigest(),
        "artifact_count": len(artifacts), "artifacts": artifacts,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--json", action="store_true", help="print full manifest instead of fingerprint")
    args = parser.parse_args()
    try:
        result = build_manifest(args.root)
    except (OSError, RuntimeError) as exc:
        print(f"ERROR: {exc}")
        return 1
    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        print(f"state_hash={result['state_hash']}")
        print(f"artifact_count={result['artifact_count']}")
        print(f"algorithm={result['algorithm']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
