#!/usr/bin/env python3
"""Validate project-state, hardware, ONNX and voice-matrix YAML schemas at a basic structural level."""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    ROOT / "docs/PROJECT_STATE.yaml": dict,
    ROOT / "infra/hardware_profiles.yaml": dict,
    ROOT / "infra/onnx/runtime_config.yaml": dict,
    ROOT / "evals/voice/language_matrix_v2.yaml": dict,
}
SHA256 = re.compile(r"^[0-9a-fA-F]{64}$")


def read_yaml(path: Path, expected_type: type) -> Any:
    try:
        value = yaml.safe_load(path.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        raise ValueError(f"{path.relative_to(ROOT)}: cannot parse YAML ({type(exc).__name__})") from exc
    if not isinstance(value, expected_type):
        raise ValueError(f"{path.relative_to(ROOT)}: unexpected top-level YAML shape")
    return value


def main() -> int:
    loaded: dict[Path, Any] = {}
    errors: list[str] = []
    for path, expected in FILES.items():
        try:
            loaded[path] = read_yaml(path, expected)
        except ValueError as exc:
            errors.append(str(exc))

    state = loaded.get(ROOT / "docs/PROJECT_STATE.yaml")
    if state is not None:
        project = state.get("project_state")
        improvements = state.get("improvements")
        if not isinstance(project, dict) or project.get("version") != 4:
            errors.append("PROJECT_STATE.yaml: project_state.version must equal 4")
        if not isinstance(improvements, dict) or not improvements:
            errors.append("PROJECT_STATE.yaml: improvements must be a non-empty mapping")
        elif any(not isinstance(key, str) or not isinstance(item, dict) or not item.get("status")
                 for key, item in improvements.items()):
            errors.append("PROJECT_STATE.yaml: every improvement requires an ID and status")
        deployment = project.get("deployment", {}) if isinstance(project, dict) else {}
        if deployment.get("gateway_vps") != "not verified by this change; do not claim deployed":
            errors.append("PROJECT_STATE.yaml: VPS status must remain explicitly unverified for this packet")

    hardware = loaded.get(ROOT / "infra/hardware_profiles.yaml")
    if hardware is not None:
        profiles = hardware.get("profiles")
        if not isinstance(profiles, list) or not profiles:
            errors.append("hardware_profiles.yaml: profiles must be a non-empty list")
        elif any(not isinstance(p, dict) or not p.get("id") or not p.get("status") for p in profiles):
            errors.append("hardware_profiles.yaml: every profile requires id and status")
        elif len({p["id"] for p in profiles}) != len(profiles):
            errors.append("hardware_profiles.yaml: profile IDs must be unique")

    runtime = loaded.get(ROOT / "infra/onnx/runtime_config.yaml")
    if runtime is not None:
        if not isinstance(runtime.get("status"), str) or "not_runtime_enabled" not in runtime["status"]:
            errors.append("runtime_config.yaml: runtime status must say it is not enabled")
        safety = runtime.get("safety")
        if not isinstance(safety, dict) or safety.get("cloud_fallback") is not False or safety.get("raw_pcm_in_public_event_payload") is not False:
            errors.append("runtime_config.yaml: local-first and no-raw-PCM safety defaults must be false")

    matrix = loaded.get(ROOT / "evals/voice/language_matrix_v2.yaml")
    if matrix is not None:
        languages = matrix.get("languages")
        if matrix.get("schema_version") != 2 or not isinstance(languages, dict) or not {"ru", "en"}.issubset(languages):
            errors.append("language_matrix_v2.yaml: requires schema_version=2 and RU/EN entries")
        policy = matrix.get("default_policy")
        if not isinstance(policy, dict) or policy.get("cloud_fallback") is not False or policy.get("ship_only_with_artifact_sha256") is not True:
            errors.append("language_matrix_v2.yaml: cloud fallback must be off and shipping requires artifact hashes")
        if isinstance(languages, dict):
            for language, config in languages.items():
                if not isinstance(config, dict):
                    errors.append(f"language_matrix_v2.yaml: {language} entry must be a mapping")
                    continue
                for group in ("asr_candidates", "tts_candidates"):
                    candidates = config.get(group, [])
                    if not isinstance(candidates, list):
                        errors.append(f"language_matrix_v2.yaml: {language}.{group} must be a list")
                        continue
                    for candidate in candidates:
                        if not isinstance(candidate, dict) or not candidate.get("id") or not candidate.get("status"):
                            errors.append(f"language_matrix_v2.yaml: malformed {language}.{group} candidate")
                            continue
                        digest = candidate.get("sha256")
                        if digest is not None and (not isinstance(digest, str) or not SHA256.fullmatch(digest)):
                            errors.append(f"language_matrix_v2.yaml: invalid hash for {candidate['id']}")

    if errors:
        print("PROJECT METADATA FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"PROJECT METADATA OK: {len(loaded)} YAML files parsed and required safety fields verified")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
