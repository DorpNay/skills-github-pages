"""Offline deterministic harness for bounded aLandi primitives.

Run from any directory with:
    python gateway/evals/run_six_layer_eval.py

This does not call a live LLM, claim production accuracy, or benchmark host RSS. It checks
fixtures and emits machine-readable metrics that CI can reproduce.
"""
# ruff: noqa: E402 -- repository root is added to sys.path before local imports for standalone execution.
from __future__ import annotations

import json
import sys
import tempfile
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from gateway.kv_budget import analyze_runtime
from gateway.memory.delta_sync import DeltaMemoryStore, apply_patch
from gateway.rag.lazy_graph_rag import LazyGraphRAG
from gateway.routing import IntentRouter
from gateway.security.oauth_vault import OAuthVault


def percentile(values: list[float], pct: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    index = min(len(ordered) - 1, max(0, round((len(ordered) - 1) * pct)))
    return round(ordered[index], 3)


ROUTING_CASES = [
    ("Привет", "greeting", True),
    ("Здравствуйте!", "greeting", True),
    ("hi", "greeting", True),
    ("спасибо", "gratitude", True),
    ("thank you", "gratitude", True),
    ("пока", "farewell", True),
    ("до свидания", "farewell", True),
    ("goodbye", "farewell", True),
    ("Найди официальную документацию", "tool_call", False),
    ("Посчитай 12 умножить на 7", "tool_call", False),
    ("search for Ollama API", "tool_call", False),
    ("compute 2 plus 2", "tool_call", False),
    ("исследуй LazyGraphRAG", "research", False),
    ("проведи аудит gateway", "research", False),
    ("compare sources about OAuth", "research", False),
    ("deep dive into PKCE", "research", False),
    ("What is the KV cache?", "general", False),
    ("Explain JSON Patch", "general", False),
    ("Почему размер модели не равен RSS?", "general", False),
    ("Help me plan this project", "general", False),
    ("спасибо, а теперь переведи этот текст", "general", False),
    ("привет, помоги исследовать OAuth", "research", False),
]


def eval_routing() -> dict[str, Any]:
    router = IntentRouter()
    correct = 0
    wrong_shortcuts = 0
    shortcut_positive = 0
    observations = []
    for message, expected_intent, expected_shortcut in ROUTING_CASES:
        decision = router.classify(message)
        payload = {"model": "eval-model", "messages": [{"role": "user", "content": message}]}
        routed = router.response_for(payload) is not None
        correct += decision.intent == expected_intent
        wrong_shortcuts += routed and not expected_shortcut
        shortcut_positive += routed and expected_shortcut
        observations.append({
            "message": message, "expected_intent": expected_intent,
            "actual_intent": decision.intent, "shortcut_expected": expected_shortcut,
            "shortcut_actual": routed, "requires_verification": decision.requires_verification,
        })
    # Additional high-risk-shape fixtures must all abstain from template shortcutting.
    risky_shapes = [
        {"model": "m", "stream": True, "messages": [{"role": "user", "content": "привет"}]},
        {"model": "m", "tools": [{"type": "function", "function": {"name": "x"}}],
         "messages": [{"role": "user", "content": "привет"}]},
        {"model": "m", "messages": [
            {"role": "user", "content": "привет"},
            {"role": "assistant", "content": "Здравствуйте!"},
            {"role": "user", "content": "спасибо"}]},
        {"model": "m", "messages": [{"role": "user", "content": "привет, найди источник"}]},
        {"model": "m", "response_format": {"type": "json_object"},
         "messages": [{"role": "user", "content": "привет"}]},
    ]
    false_shortcuts = sum(router.response_for(payload) is not None for payload in risky_shapes)
    accuracy = correct / len(ROUTING_CASES)
    return {
        "fixture_count": len(ROUTING_CASES),
        "intent_accuracy_on_curated_fixtures": round(accuracy, 4),
        "fixture_intent_errors": len(ROUTING_CASES) - correct,
        "valid_template_shortcuts": shortcut_positive,
        "false_template_shortcuts": int(wrong_shortcuts) + false_shortcuts,
        "risky_shape_fixtures": len(risky_shapes),
        "cases": observations,
        "interpretation": "Curated offline sanity fixtures, not a measured production intent-accuracy estimate.",
    }


def eval_delta() -> dict[str, Any]:
    old = {
        "facts": [{"id": f"fact-{i}", "text": f"Approved architecture decision number {i}; retain its source and date."}
                  for i in range(200)],
        "decisions": [{"id": f"decision-{i}", "value": "Keep the first-stage gateway bounded and testable."}
                      for i in range(50)],
        "questions": [], "notes": [], "summary": "Stable project context " * 20,
    }
    new = {**old, "facts": [*old["facts"], {
        "id": "fact-200", "text": "One new approved memory item with provenance."
    }]}
    with tempfile.TemporaryDirectory(prefix="alandi-delta-eval-") as directory:
        store = DeltaMemoryStore(Path(directory) / "memory.sqlite3")
        store.initialize()
        store.sync_delta("eval-chat", 0, [{"op": "add", "path": "/facts/-", "value": {"id": "seed", "text": "seed"}}])
        # Measure patch serialization independently from in-store delta persistence.
        from gateway.memory.delta_sync import canonical_json, compute_patch
        base_bytes = len(canonical_json(old).encode("utf-8"))
        patch = compute_patch(old, new)
        patch_bytes = len(canonical_json(patch).encode("utf-8"))
        exact = apply_patch(old, patch) == new
    return {
        "base_state_bytes": base_bytes,
        "new_state_bytes": len(canonical_json(new).encode("utf-8")),
        "delta_bytes": patch_bytes,
        "byte_reduction_percent": round(100 * (1 - patch_bytes / len(canonical_json(new).encode("utf-8"))), 2),
        "roundtrip_exact": exact,
        "operations": len(patch),
        "interpretation": "JSON byte savings on append-heavy synthetic state; not tokenizer token savings or a user-traffic measurement.",
    }


def eval_rag() -> dict[str, Any]:
    documents = [
        ("oauth", "OAuth refresh tokens require encrypted storage and careful rotation."),
        ("delta", "JSON Patch revisions detect stale writes and prevent silent concurrent overwrites."),
        ("ollama", "Ollama /api/ps lists currently loaded models and reports size and size_vram."),
        ("rag", "SQLite FTS5 retrieves text snippets while citation provenance preserves HTTPS source and page."),
        ("routing", "Exact phrase routing can skip a model for a standalone harmless greeting."),
        ("security", "Least privilege scopes and PKCE protect an OAuth authorization-code transaction."),
        ("quality", "A golden set measures retrieval recall, ranking and citation correctness."),
        ("runtime", "Host RSS and process memory are distinct from a model inventory size field."),
    ]
    queries = [
        ("OAuth refresh token encrypted rotation", "oauth"),
        ("JSON Patch stale revision overwrite", "delta"),
        ("Ollama loaded models size_vram", "ollama"),
        ("FTS5 citation provenance source page", "rag"),
        ("exact greeting phrase route", "routing"),
        ("OAuth PKCE least privilege authorization", "security"),
        ("golden set retrieval recall ranking", "quality"),
        ("host RSS model inventory memory size", "runtime"),
    ]
    with tempfile.TemporaryDirectory(prefix="alandi-rag-eval-") as directory:
        rag = LazyGraphRAG(Path(directory) / "rag.sqlite3")
        rag.initialize()
        for doc_id, text in documents:
            rag.ingest_document(
                f"doc-{doc_id}", f"https://eval.example.test/{doc_id}",
                [{"chunk_id": f"chunk-{doc_id}", "content": text, "page_number": 1}],
                scope="project", scope_id="eval",
            )
        latencies = []
        hits_at_5 = 0
        hits_at_3 = 0
        source_missing = 0
        for query, target in queries:
            started = time.perf_counter()
            results = rag.retrieve(query, scope="project", scope_id="eval", top_k=5, candidate_limit=8)
            latencies.append((time.perf_counter() - started) * 1000)
            ids = [item["chunk_id"] for item in results]
            hits_at_5 += f"chunk-{target}" in ids
            hits_at_3 += f"chunk-{target}" in ids[:3]
            source_missing += any(not item.get("source_uri") or not item.get("page_number") for item in results)
        return {
            "query_count": len(queries),
            "recall_at_5_on_synthetic_fixtures": round(hits_at_5 / len(queries), 4),
            "hit_rate_at_3_on_synthetic_fixtures": round(hits_at_3 / len(queries), 4),
            "retrieval_p50_ms": percentile(latencies, 0.50),
            "retrieval_p95_ms": percentile(latencies, 0.95),
            "results_missing_source_or_page": source_missing,
            "interpretation": "Synthetic code smoke test only; does not validate real-document retrieval quality or multilingual OCR.",
        }


def eval_vault_and_runtime() -> dict[str, Any]:
    with tempfile.TemporaryDirectory(prefix="alandi-security-eval-") as directory:
        path = Path(directory) / "oauth.sqlite3"
        vault = OAuthVault(path, OAuthVault.generate_key())
        vault.initialize()
        transaction = vault.begin_pkce()
        verifier = vault.consume_pkce(transaction["state"])
        vault.save_tokens("eval-provider", access_token="access-test-secret",
                          refresh_token="refresh-test-secret", expires_in=1800, scopes=["scope:example"])
        plaintext_absent = b"access-test-secret" not in path.read_bytes() and b"refresh-test-secret" not in path.read_bytes()
        try:
            vault.consume_pkce(transaction["state"])
            replay_rejected = False
        except ValueError:
            replay_rejected = True

    runtime = analyze_runtime({"models": [
        {"name": "example:4b", "size": 2_000_000_000, "size_vram": 0, "expires_at": ""}
    ]})
    return {
        "oauth_access_token_absent_from_sqlite_plaintext": plaintext_absent,
        "oauth_refresh_token_absent_from_sqlite_plaintext": plaintext_absent,
        "pkce_state_replay_rejected": replay_rejected,
        "pkce_verifier_length": len(verifier),
        "runtime_inventory_does_not_claim_host_rss": runtime["host_rss_mb"] is None,
        "runtime_inventory_does_not_claim_kv_usage": runtime["kv_cache_usage_mb"] is None,
        "runtime_inventory_does_not_evict": runtime["automatic_eviction_performed"] is False,
        "interpretation": "Local synthetic security smoke test; not a penetration test or live Google OAuth verification.",
    }


def main() -> int:
    results = {
        "suite": "aLandi six-layer offline smoke evaluation",
        "live_model_calls": 0,
        "live_google_oauth_calls": 0,
        "host_rss_measured": False,
        "routing": eval_routing(),
        "delta_sync": eval_delta(),
        "rag": eval_rag(),
        "oauth_and_runtime": eval_vault_and_runtime(),
    }
    checks = {
        "routing_fixture_accuracy": results["routing"]["fixture_intent_errors"] == 0,
        "zero_false_template_shortcuts": results["routing"]["false_template_shortcuts"] == 0,
        "delta_state_roundtrip": results["delta_sync"]["roundtrip_exact"],
        "rag_fixture_recall_at_5": results["rag"]["recall_at_5_on_synthetic_fixtures"] >= 0.75,
        "rag_citations_preserved": results["rag"]["results_missing_source_or_page"] == 0,
        "oauth_no_plaintext_tokens": (
            results["oauth_and_runtime"]["oauth_access_token_absent_from_sqlite_plaintext"]
            and results["oauth_and_runtime"]["oauth_refresh_token_absent_from_sqlite_plaintext"]
        ),
        "pkce_replay_rejected": results["oauth_and_runtime"]["pkce_state_replay_rejected"],
        "runtime_metrics_truthful": (
            results["oauth_and_runtime"]["runtime_inventory_does_not_claim_host_rss"]
            and results["oauth_and_runtime"]["runtime_inventory_does_not_claim_kv_usage"]
            and results["oauth_and_runtime"]["runtime_inventory_does_not_evict"]
        ),
    }
    results["checks"] = checks
    results["all_checks_passed"] = all(checks.values())
    print(json.dumps(results, ensure_ascii=False, indent=2, sort_keys=True))
    return 0 if results["all_checks_passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
