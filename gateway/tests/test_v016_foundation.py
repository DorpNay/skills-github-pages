from __future__ import annotations

from pathlib import Path

import pytest
import yaml

from router.policy import Route, calculate_route
from scripts.check_intel_triad import validate_data
from scripts.manifest_state import build_manifest


def test_manifest_state_is_deterministic_and_changes_with_source_content(tmp_path: Path):
    (tmp_path / "docs").mkdir()
    (tmp_path / "gateway").mkdir()
    (tmp_path / "docs" / "design.md").write_text("approved text\n", encoding="utf-8")
    module = tmp_path / "gateway" / "module.py"
    module.write_text("VALUE = 1\n", encoding="utf-8")
    first = build_manifest(tmp_path)
    assert build_manifest(tmp_path)["state_hash"] == first["state_hash"]
    assert first["algorithm"] == "sha256(sorted(path + NUL + file_sha256 + LF))"
    assert [x["path"] for x in first["artifacts"]] == sorted(x["path"] for x in first["artifacts"])
    module.write_text("VALUE = 2\n", encoding="utf-8")
    assert build_manifest(tmp_path)["state_hash"] != first["state_hash"]


def test_manifest_state_includes_root_app_entrypoint(tmp_path: Path):
    app = tmp_path / "index.md"
    app.write_text("app version one\\n", encoding="utf-8")
    first = build_manifest(tmp_path)
    assert "index.md" in {item["path"] for item in first["artifacts"]}
    app.write_text("app version two\\n", encoding="utf-8")
    assert build_manifest(tmp_path)["state_hash"] != first["state_hash"]


def test_manifest_state_excludes_secret_and_generated_paths(tmp_path: Path):
    (tmp_path / "docs").mkdir()
    (tmp_path / "gateway" / "__pycache__").mkdir(parents=True)
    (tmp_path / "docs" / "guide.md").write_text("public", encoding="utf-8")
    (tmp_path / "gateway" / ".env").write_text("API_KEY=do-not-hash", encoding="utf-8")
    (tmp_path / "gateway" / "private.pem").write_text("private key bytes", encoding="utf-8")
    (tmp_path / "gateway" / "__pycache__" / "compiled.pyc").write_bytes(b"generated")
    (tmp_path / "gateway" / ".env.example").write_text("API_KEY=", encoding="utf-8")
    manifest = build_manifest(tmp_path)
    paths = {item["path"] for item in manifest["artifacts"]}
    assert "docs/guide.md" in paths
    assert "gateway/.env.example" in paths
    assert "gateway/.env" not in paths
    assert "gateway/private.pem" not in paths
    assert "gateway/__pycache__/compiled.pyc" not in paths
    assert "do-not-hash" not in str(manifest)


def valid_triad_data():
    return {"schema_version": 1, "artifacts": [{
        "id": "vosk-small-ru", "status": "accepted",
        "verified_url": "https://alphacephei.com/vosk/models",
        "license_exact_artifact": "Apache-2.0",
        "claim_source": "https://alphacephei.com/vosk/models",
    }]}


def test_intel_triad_gate_accepts_a_complete_explicit_record():
    assert validate_data(valid_triad_data()) == []


@pytest.mark.parametrize("field", ["verified_url", "license_exact_artifact", "claim_source"])
def test_intel_triad_gate_rejects_missing_or_placeholder_accepted_fields(field: str):
    data = valid_triad_data()
    data["artifacts"][0][field] = "TBD"
    assert any(field in failure for failure in validate_data(data))


def test_intel_triad_gate_rejects_placeholder_domains_and_non_url_claim_sources():
    data = valid_triad_data()
    data["artifacts"][0]["verified_url"] = "https://model-catalog.test/fake"
    assert any("verified_url" in failure for failure in validate_data(data))
    data = valid_triad_data()
    data["artifacts"][0]["claim_source"] = "Official model website"
    assert any("claim_source" in failure for failure in validate_data(data))


def test_intel_triad_gate_rejects_http_and_empty_registry():
    data = valid_triad_data()
    data["artifacts"][0]["verified_url"] = "http://alphacephei.com/vosk/models"
    assert any("verified_url" in failure for failure in validate_data(data))
    assert any("at least one" in failure for failure in validate_data({"schema_version": 1, "artifacts": []}))


def test_latency_budget_has_consistent_allocations_and_margin():
    root = Path(__file__).resolve().parents[2]
    data = yaml.safe_load((root / "latency" / "budget_v2.yaml").read_text(encoding="utf-8"))
    assert data["status"] == "target_only_unmeasured"
    for key in ("tier0_command_path", "tier1_llm_path"):
        tier = data[key]
        assert sum(tier["breakdown"].values()) == tier["total_p95_limit_ms"]
        assert tier["acceptance_e2e_p95_ms"] == round(tier["total_p95_limit_ms"] * 1.15)
    assert data["slow_escalation"]["included_in_tier1_sla"] is False


def test_router_requires_confirmation_for_destructive_actions_before_shortcuts():
    result = calculate_route(0.999, 10, 10000, "destructive", user_confirmed=False)
    assert result.route is Route.BLOCK_REQUIRE_CONFIRMATION
    assert result.requires_confirmation is True


def test_router_uses_fast_route_only_for_high_confidence_low_risk_requests():
    assert calculate_route(0.96, 400, 900, "low").route is Route.T0_COMMAND_CACHE
    assert calculate_route(0.95, 400, 1800, "low").route is Route.SMALL_LLM
    assert calculate_route(0.99, 500, 1800, "low").route is Route.SMALL_LLM
    assert calculate_route(0.99, 100, 1800, "sensitive").route is Route.SMALL_LLM


def test_router_separates_retrieval_budget_fallback_and_local_only_failure():
    assert calculate_route(0.7, 3000, 100, "normal", requires_facts=True).route is Route.RETRIEVAL_ONLY
    assert calculate_route(0.7, 3000, 1499, "normal").route is Route.ESCALATE_TEXT_FALLBACK
    blocked = calculate_route(0.7, 3000, 2000, "normal", privacy_only=True, local_model_available=False)
    assert blocked.route is Route.BLOCK_NO_LOCAL_MODEL
    assert blocked.local_only is True


def test_large_model_escalation_requires_explicit_opt_in_and_is_outside_tier1_sla():
    args = dict(intent_confidence=0.6, ctx_cost=1200, budget_left_ms=2000, risk_class="normal",
                requires_complex_reasoning=True, large_model_available=True)
    assert calculate_route(**args, allow_slow_escalation=False).route is Route.SMALL_LLM
    allowed = calculate_route(**args, allow_slow_escalation=True)
    assert allowed.route is Route.ESCALATE_LARGE_MODEL
    assert allowed.within_tier1_sla is False and allowed.requires_user_notice is True


def test_low_budget_never_overrides_tier1_fallback_with_large_model():
    result = calculate_route(0.6, 1200, 1499, "normal", requires_complex_reasoning=True,
                             large_model_available=True, allow_slow_escalation=True)
    assert result.route is Route.ESCALATE_TEXT_FALLBACK
    assert result.within_tier1_sla is True


def test_router_rejects_invalid_inputs():
    with pytest.raises(ValueError):
        calculate_route(float("nan"), 1, 1000, "low")
    with pytest.raises(ValueError):
        calculate_route(0.5, -1, 1000, "low")
    with pytest.raises(ValueError):
        calculate_route(0.5, 10, 1000, "unknown-risk")
