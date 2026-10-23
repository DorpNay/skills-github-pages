
import asyncio
import sqlite3
import time
from pathlib import Path

import pytest

from gateway.memory.manager import MemoryGraphError, MemoryManager
from gateway.rag.citations import CitationManager
from gateway.rag.evidence_ledger import EvidenceLedger, EvidenceLedgerError
from gateway.security.approval_gates import ApprovalError, ApprovalRegistry
from gateway.security.ssrf_protection import SSRFRejected, validate_resolved_destination
from gateway.tools.dag_engine import DAGError, RegisteredTool, ToolDAG, ToolNode
from gateway.tools.validator import ToolContract, ToolValidationError, validate_arguments
from gateway.voice.barge_in import BargeInSignal, should_interrupt
from gateway.voice.cpocket import TransactionalCPocket
from gateway.voice.endpoint_heuristic import EndpointConfig, EndpointSignal, endpoint_confirmed
from gateway.voice.native_core_interface import VoiceEvent, VoiceEventType
from gateway.voice.speculative_transaction import (
    ReadOnlyIntent, SpeculativeResponse, SpeculativeVoiceTransaction,
)
from gateway.voice.tier_router import VoiceTierRouter


def test_memory_graph_requires_provenance_and_isolates_scopes(tmp_path):
    manager = MemoryManager(tmp_path / "memory.sqlite3")
    manager.initialize()
    with pytest.raises(MemoryGraphError):
        manager.add_fact("orphan fact", scope="project", scope_id="alpha",
                         source_kind="message", source_id="")
    a = manager.add_fact("alpha project fact", scope="project", scope_id="alpha",
                         source_kind="message", source_id="message-1", node_id="node-alpha",
                         source_text="The original evidence source.")
    b = manager.add_fact("beta project fact", scope="project", scope_id="beta",
                         source_kind="message", source_id="message-2", node_id="node-beta")
    assert a.source_sha256
    assert manager.list_nodes(scope="project", scope_id="alpha", statuses=("candidate",))[0].id == "node-alpha"
    assert manager.list_nodes(scope="project", scope_id="alpha", statuses=("candidate",))[0].content != b.content
    with pytest.raises(MemoryGraphError):
        manager.get_node("node-beta", scope="project", scope_id="alpha")
    with pytest.raises(MemoryGraphError):
        manager.add_fact("bad global", scope="global", scope_id="alpha",
                         source_kind="message", source_id="message-x")


def test_memory_graph_temporal_conflicts_supersedes_and_delete_propagation(tmp_path):
    manager = MemoryManager(tmp_path / "graph.sqlite3")
    manager.initialize()
    old = manager.add_fact("The deadline is Friday.", scope="project", scope_id="alpha",
        source_kind="message", source_id="m1", status="confirmed",
        valid_from="2026-01-01T00:00:00Z", valid_until="2026-12-01T00:00:00Z", node_id="old")
    new = manager.add_fact("The deadline is Monday.", scope="project", scope_id="alpha",
        source_kind="user_edit", source_id="edit-1", status="candidate", node_id="new")
    manager.relate("old", "new", scope="project", scope_id="alpha",
        relation_type="CONTRADICTS", evidence_source_kind="user_edit", evidence_source_id="edit-1")
    assert manager.get_node("old", scope="project", scope_id="alpha").status == "disputed"
    assert manager.get_node("new", scope="project", scope_id="alpha").status == "disputed"
    manager.supersede("old", "new", scope="project", scope_id="alpha",
        evidence_source_kind="user_edit", evidence_source_id="edit-2")
    assert manager.get_node("old", scope="project", scope_id="alpha").status == "superseded"

    base = manager.add_fact("Root source", scope="project", scope_id="alpha",
        source_kind="document", source_id="doc-1", node_id="root")
    derived = manager.add_fact("Derived summary", scope="project", scope_id="alpha",
        source_kind="tool_result", source_id="summary-1", node_id="derived")
    manager.relate("root", "derived", scope="project", scope_id="alpha",
        relation_type="DERIVED_FROM", evidence_source_kind="document", evidence_source_id="doc-1")
    deleted = manager.delete_with_propagation("root", scope="project", scope_id="alpha")
    assert set(deleted) == {"root", "derived"}
    with pytest.raises(MemoryGraphError):
        manager.get_node("derived", scope="project", scope_id="alpha")

def test_memory_fts_search_is_scope_safe_and_defaults_to_confirmed_nodes(tmp_path):
    manager = MemoryManager(tmp_path / "memory-search.sqlite3")
    manager.initialize()
    alpha = manager.add_fact(
        "Orchid deployment cache boundary", scope="project", scope_id="alpha",
        source_kind="message", source_id="alpha-1", status="confirmed", node_id="alpha-confirmed")
    beta = manager.add_fact(
        "Orchid deployment cache boundary", scope="project", scope_id="beta",
        source_kind="message", source_id="beta-1", status="confirmed", node_id="beta-confirmed")
    candidate = manager.add_fact(
        "Orchid deployment candidate note", scope="project", scope_id="alpha",
        source_kind="message", source_id="alpha-2", status="candidate", node_id="alpha-candidate")

    alpha_results = manager.search_nodes("Orchid deployment", scope="project", scope_id="alpha")
    assert [node.id for node in alpha_results] == [alpha.id]
    beta_results = manager.search_nodes("Orchid deployment", scope="project", scope_id="beta")
    assert [node.id for node in beta_results] == [beta.id]
    candidate_results = manager.search_nodes(
        "candidate note", scope="project", scope_id="alpha", statuses=("candidate",))
    assert [node.id for node in candidate_results] == [candidate.id]
    assert manager.search_nodes("x", scope="project", scope_id="alpha") == []
    # User text resembling FTS syntax is tokenized, never passed through as operators.
    manager.search_nodes('" OR * MATCH', scope="project", scope_id="alpha")
    with pytest.raises(MemoryGraphError, match="4000 characters"):
        manager.search_nodes("z" * 4001, scope="project", scope_id="alpha")


def test_memory_fts_index_tracks_delete_propagation_without_cross_scope_leaks(tmp_path):
    manager = MemoryManager(tmp_path / "memory-delete-search.sqlite3")
    manager.initialize()
    root = manager.add_fact(
        "Cobalt deletiontoken original evidence", scope="project", scope_id="alpha",
        source_kind="document", source_id="source-1", status="confirmed", node_id="delete-root")
    derived = manager.add_fact(
        "Cobalt deletiontoken derived summary", scope="project", scope_id="alpha",
        source_kind="tool_result", source_id="summary-1", status="confirmed", node_id="delete-derived")
    retained = manager.add_fact(
        "Cobalt deletiontoken independent fact", scope="project", scope_id="alpha",
        source_kind="message", source_id="message-1", status="confirmed", node_id="delete-retained")
    beta = manager.add_fact(
        "Cobalt deletiontoken beta project", scope="project", scope_id="beta",
        source_kind="message", source_id="message-2", status="confirmed", node_id="delete-beta")
    manager.relate("delete-root", "delete-derived", scope="project", scope_id="alpha",
        relation_type="DERIVED_FROM", evidence_source_kind="document", evidence_source_id="source-1")

    assert {node.id for node in manager.search_nodes("deletiontoken", scope="project", scope_id="alpha")} == {
        root.id, derived.id, retained.id
    }
    assert {node.id for node in manager.search_nodes("deletiontoken", scope="project", scope_id="beta")} == {beta.id}
    assert set(manager.delete_with_propagation("delete-root", scope="project", scope_id="alpha")) == {
        "delete-root", "delete-derived"
    }
    assert {node.id for node in manager.search_nodes("deletiontoken", scope="project", scope_id="alpha")} == {retained.id}
    assert {node.id for node in manager.search_nodes("deletiontoken", scope="project", scope_id="beta")} == {beta.id}


def test_memory_fts_migration_backfills_existing_rows_and_enables_secure_delete(tmp_path):
    manager = MemoryManager(tmp_path / "memory-fts-migration.sqlite3")
    manager.initialize()
    # Simulate an older graph database that contains rows but no FTS table or triggers.
    db = manager._connect()
    try:
        db.execute("DROP TRIGGER trg_memory_nodes_fts_insert")
        db.execute("DROP TRIGGER trg_memory_nodes_fts_delete")
        db.execute("DROP TRIGGER trg_memory_nodes_fts_update")
        db.execute("DROP TABLE fts_memory")
        db.commit()
    finally:
        db.close()
    legacy = manager.add_fact(
        "LegacyIndexBackfill phrase remains searchable", scope="project", scope_id="legacy",
        source_kind="message", source_id="old-row", status="confirmed", node_id="legacy-index-row")
    manager.initialize()
    assert [node.id for node in manager.search_nodes(
        "LegacyIndexBackfill", scope="project", scope_id="legacy")] == [legacy.id]

    db = manager._connect()
    try:
        assert db.execute("PRAGMA secure_delete").fetchone()[0] == 1
        if sqlite3.sqlite_version_info >= (3, 42, 0):
            row = db.execute("SELECT v FROM fts_memory_config WHERE k='secure-delete'").fetchone()
            assert row is not None and str(row["v"]) == "1"
            assert manager.fts5_secure_delete_enabled is True
        else:
            assert manager.fts5_secure_delete_enabled is False
    finally:
        db.close()

def test_memory_temporal_window_rejects_naive_and_invalid_intervals():
    from gateway.memory.temporal import TemporalError, is_valid_at, validate_validity_window
    with pytest.raises(TemporalError):
        validate_validity_window("2026-01-01T00:00:00", None)
    with pytest.raises(TemporalError):
        validate_validity_window("2026-02-01T00:00:00Z", "2026-01-01T00:00:00Z")
    assert is_valid_at("2026-01-01T00:00:00Z", "2026-02-01T00:00:00Z", "2026-01-15T00:00:00Z")
    assert not is_valid_at("2026-01-01T00:00:00Z", "2026-02-01T00:00:00Z", "2026-02-01T00:00:00Z")


def test_ssrf_policy_rejects_private_addresses_and_only_accepts_public_https():
    safe = validate_resolved_destination("https://docs.example.test/manual", ["8.8.8.8", "1.1.1.1"])
    assert safe.hostname == "docs.example.test"
    assert set(safe.resolved_public_ips) == {"8.8.8.8", "1.1.1.1"}
    assert safe.canonical_url == "https://docs.example.test/manual"
    for url, ips in [
        ("http://example.com/", ["8.8.8.8"]),
        ("https://127.0.0.1/", []),
        ("https://example.com/", ["8.8.8.8", "169.254.169.254"]),
        ("https://user:password@example.com/", ["8.8.8.8"]),
        ("https://example.com/?token=secret", ["8.8.8.8"]),
    ]:
        with pytest.raises(SSRFRejected):
            validate_resolved_destination(url, ips)
    with pytest.raises(SSRFRejected):
        validate_resolved_destination("https://docs.example.test/", ["8.8.8.8"],
                                      allowed_hosts={"allowed.example.test"})


def test_approval_tickets_are_action_scoped_expiring_and_one_time():
    registry = ApprovalRegistry()
    args = {"path": "/workspace/report.txt", "operation": "delete"}
    ticket = registry.issue_after_human_confirmation(action="delete_file", arguments=args,
        scope="project:alpha", actor_id="authenticated-user", ttl_seconds=30)
    assert not registry.consume(ticket, action="delete_file", arguments={**args, "path": "/other"},
                                scope="project:alpha", actor_id="authenticated-user")
    # A mismatched attempt burns the ticket rather than allowing replay after argument mutation.
    assert not registry.consume(ticket, action="delete_file", arguments=args,
                                scope="project:alpha", actor_id="authenticated-user")
    ticket2 = registry.issue_after_human_confirmation(action="delete_file", arguments=args,
        scope="project:alpha", actor_id="authenticated-user", ttl_seconds=30)
    assert not registry.consume(ticket2, action="delete_file", arguments=args,
                               scope="project:alpha", actor_id="another-user")
    assert not registry.consume(ticket2, action="delete_file", arguments=args,
                               scope="project:alpha", actor_id="authenticated-user")
    with pytest.raises(ApprovalError):
        registry.issue_after_human_confirmation(action="x", arguments={}, scope="global", actor_id="")


def test_json_schema_validator_enforces_types_limits_and_local_refs():
    schema = {"type": "object", "properties": {
        "count": {"type": "integer", "minimum": 1},
        "label": {"$ref": "#/$defs/label"}
    }, "required": ["count", "label"], "additionalProperties": False,
        "$defs": {"label": {"type": "string", "maxLength": 24}}}
    contract = ToolContract("example", schema, read_only=True)
    assert validate_arguments(contract, {"count": 2, "label": "ok"}) == {"count": 2, "label": "ok"}
    with pytest.raises(ToolValidationError):
        validate_arguments(contract, {"count": "two", "label": "bad"})
    with pytest.raises(ToolValidationError):
        validate_arguments(contract, {"count": 2, "label": "ok", "shell": "rm -rf"})
    with pytest.raises(ToolValidationError):
        validate_arguments(ToolContract("remote", {"type": "object", "$ref": "https://attacker.test/schema"}, True), {})


@pytest.mark.asyncio
async def test_tool_dag_runs_readonly_dependencies_and_requires_human_approval_for_mutation():
    registry = ApprovalRegistry()
    events = []
    async def read(args, dependencies):
        await asyncio.sleep(0)
        events.append(("read", args["name"]))
        return {"value": args["name"]}
    async def write(args, dependencies):
        events.append(("write", args["destination"]))
        return "written"
    tools = {
        "read": RegisteredTool(ToolContract("read", {"type": "object", "properties": {
            "name": {"type": "string"}}, "required": ["name"], "additionalProperties": False}, read_only=True), read),
        "write": RegisteredTool(ToolContract("write", {"type": "object", "properties": {
            "destination": {"type": "string"}}, "required": ["destination"], "additionalProperties": False},
            read_only=False, requires_approval=True), write),
    }
    dag = ToolDAG(tools, max_parallel_readers=2)
    nodes = [
        ToolNode("a", "read", {"name": "A"}),
        ToolNode("b", "read", {"name": "B"}),
        ToolNode("c", "write", {"destination": "report"}, dependencies=("a", "b")),
    ]
    with pytest.raises(DAGError):
        await dag.execute(nodes, scope="project:alpha")
    ticket = registry.issue_after_human_confirmation(action="write", arguments={"destination": "report"},
        scope="project:alpha", actor_id="user", ttl_seconds=30)
    result = await dag.execute(nodes, scope="project:alpha", approvals={"c": ticket},
                               approval_registry=registry, actor_id="user")
    assert result["a"] == {"value": "A"} and result["b"] == {"value": "B"}
    assert result["c"] == "written"
    assert events[-1] == ("write", "report")
    with pytest.raises(DAGError):
        dag._plan([ToolNode("cycle-a", "read", {"name": "a"}, ("cycle-b",)),
                   ToolNode("cycle-b", "read", {"name": "b"}, ("cycle-a",))])


def test_exact_citations_reject_changed_source_or_wrong_offsets(tmp_path):
    manager = CitationManager()
    source = "A trustworthy source says the answer is 42."
    start = source.index("the answer")
    citation = manager.create(document_id="doc", chunk_id="chunk", source_uri="https://example.test/doc",
        source_text=source, start_offset=start, end_offset=start + len("the answer is 42"), page_number=3,
        section="Results")
    assert citation.text_snippet == "the answer is 42"
    assert manager.validate(citation, source_text=source)
    assert not manager.validate(citation, source_text=source + " altered")
    with pytest.raises(ValueError):
        manager.create(document_id="doc", chunk_id="chunk", source_uri="https://example.test/doc",
            source_text=source, start_offset=2, end_offset=1)


def test_evidence_ledger_stores_scoped_provenance_and_exact_quote(tmp_path):
    path = tmp_path / "evidence.sqlite3"
    ledger = EvidenceLedger(path)
    ledger.initialize()
    text = "Gateway requests return a trace ID."
    start = text.index("return a trace ID")
    evidence_id = ledger.add_quote(scope="project", scope_id="alpha", source_id="doc-1",
        source_uri="https://example.test/gateway", source_text=text, chunk_id="chunk-1",
        start_offset=start, end_offset=len(text), page_number=5, claim_text="The gateway returns trace IDs.")
    record = ledger.list_evidence(scope="project", scope_id="alpha")[0]
    assert record["evidence_id"] == evidence_id
    assert record["quote_text"] == "return a trace ID."
    assert record["page_number"] == 5
    assert ledger.list_evidence(scope="project", scope_id="other") == []
    assert path.stat().st_mode & 0o077 == 0
    with pytest.raises(EvidenceLedgerError):
        ledger.add_quote(scope="global", scope_id="wrong", source_id="doc-2",
            source_uri="https://example.test/source", source_text=text, chunk_id="c",
            start_offset=0, end_offset=3)


@pytest.mark.asyncio
async def test_cpocket_rollback_runs_cleanups_once_in_reverse_order():
    cpocket = TransactionalCPocket()
    lease = await cpocket.acquire_lease("unit-test", ttl_ms=2000)
    cleaned = []
    lease.add_cleanup(lambda: cleaned.append("first"))
    lease.add_cleanup(lambda: cleaned.append("second"))
    assert await cpocket.rollback(lease.branch_id, "barge_in")
    assert cleaned == ["second", "first"]
    assert not await cpocket.rollback(lease.branch_id, "retry")
    assert lease.closed and not lease.committed
    with pytest.raises(RuntimeError):
        lease.add_cleanup(lambda: None)


@pytest.mark.asyncio
async def test_cpocket_commit_cancels_ttl_and_ttl_expiry_rolls_back():
    cpocket = TransactionalCPocket()
    committed = await cpocket.acquire_lease("committed", ttl_ms=100)
    cleanup = []
    committed.add_cleanup(lambda: cleanup.append(True))
    assert await cpocket.commit(committed.branch_id)
    await asyncio.sleep(0.14)
    assert cleanup == [] and committed.committed

    expiring = await cpocket.acquire_lease("expiring", ttl_ms=60)
    expiring.add_cleanup(lambda: cleanup.append("expired"))
    await asyncio.sleep(0.12)
    assert cleanup == ["expired"] and expiring.state == "rolled_back"


class _FakeRouter:
    async def classify_readonly(self, transcript):
        return ReadOnlyIntent("answer_read_only")

class _FakeResponder:
    async def speculate_readonly(self, intent):
        return SpeculativeResponse("The answer is 42.")

class _FakeTTS:
    def __init__(self):
        self.discarded = []
        self.played = []
        self.continued = []
    async def synthesize_prefix(self, text, *, max_duration_ms, destination):
        assert destination == "buffer_only" and 0 <= max_duration_ms <= 500
        return {"prefix_for": text}
    async def discard_buffer(self, buffer):
        self.discarded.append(buffer)
    async def play_buffered_prefix(self, buffer):
        self.played.append(buffer)
    async def continue_streaming(self, text):
        self.continued.append(text)


@pytest.mark.asyncio
async def test_speculative_voice_never_plays_before_final_transcript_and_rolls_back_mismatch():
    cpocket = TransactionalCPocket()
    tts = _FakeTTS()
    transaction = SpeculativeVoiceTransaction(_FakeRouter(), _FakeResponder(), tts, cpocket)
    branch = await transaction.on_asr_stable_partial("tell me the answer")
    assert not tts.played
    accepted = await transaction.on_endpoint_confirmed("tell me the answer now", branch)
    assert accepted and branch.committed
    assert len(tts.played) == 1 and tts.continued == ["The answer is 42."]

    mismatch = await transaction.on_asr_stable_partial("delete project")
    rejected = await transaction.on_endpoint_confirmed("delete another project", mismatch)
    assert not rejected and mismatch.rolled_back
    assert mismatch.tts_prefix_buffer in tts.discarded
    assert len(tts.played) == 1


def test_voice_tier_endpoint_bargein_and_native_event_contracts():
    router = VoiceTierRouter()
    assert router.route("СТОП!", 0.99).tier == "tier0"
    assert router.route("delete all files", 0.999).tier == "tier1"
    assert router.route("stop", 0.5).tier == "tier1"

    config = EndpointConfig()
    signal = EndpointSignal(100, 500, 0.1, "stop", 0.97, True, True)
    assert endpoint_confirmed(signal, config)
    assert not endpoint_confirmed(EndpointSignal(100, 200, 0.1, "", 0.99, True, True), config)
    assert not endpoint_confirmed(EndpointSignal(400, 200, 0.1, "hello", 0.99, True, True), config)
    # A stale timestamp cannot override a currently speech-like VAD frame.
    assert not endpoint_confirmed(EndpointSignal(100, 1600, 0.99, "still speaking", 0.99, True, True), config)

    assert should_interrupt(BargeInSignal(0.95, 0.1, 0.9, True))
    assert not should_interrupt(BargeInSignal(0.96, 0.99, 0.2, True))
    event = VoiceEvent.create(VoiceEventType.ASR_PARTIAL, time.monotonic_ns(), {
        "text": "hello", "confidence": 0.98, "pcm_bytes": b"raw audio"
    })
    assert event.payload == {"text": "hello", "confidence": 0.98}


def test_trace_event_schema_is_metadata_only_and_rejects_arbitrary_content():
    import json
    from jsonschema import Draft202012Validator

    schema_path = Path(__file__).parents[2] / "observability" / "events.schema.json"
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema)
    event = {
        "trace_id": "0123456789abcdef0123456789abcdef",
        "event": "request_finished",
        "component": "gateway",
        "timestamp_ns": time.time_ns(),
        "attributes": {"http_status": 200, "duration_ms": 18.5, "outcome": "ok"}
    }
    assert validator.is_valid(event)
    unsafe = {**event, "attributes": {"prompt": "this must never be recorded"}}
    assert not validator.is_valid(unsafe)
    unsafe_top_level = {**event, "transcript": "private transcript"}
    assert not validator.is_valid(unsafe_top_level)


def test_otel_is_disabled_by_default_and_remote_endpoint_requires_explicit_https_opt_in(monkeypatch):
    from observability.otel_config import (
        OTelConfigurationError, initialize_otel_from_env, validate_endpoint,
    )

    monkeypatch.delenv("ALANDI_OTEL_ENABLED", raising=False)
    monkeypatch.delenv("ALANDI_OTEL_ALLOW_REMOTE", raising=False)
    assert initialize_otel_from_env().reason == "disabled_by_default"
    assert validate_endpoint("http://127.0.0.1:4318/v1/traces") == "http://127.0.0.1:4318/v1/traces"
    with pytest.raises(OTelConfigurationError):
        validate_endpoint("http://collector.example.test/v1/traces")
    with pytest.raises(OTelConfigurationError):
        validate_endpoint("https://user:password@collector.example.test/v1/traces", allow_remote=True)
    with pytest.raises(OTelConfigurationError):
        validate_endpoint("https://collector.example.test/v1/traces", allow_remote=False)
    assert validate_endpoint("https://collector.example.test/v1/traces", allow_remote=True).startswith("https://")


def test_license_manifest_checker_fails_closed_for_ship_true_without_hash(tmp_path, monkeypatch):
    import importlib.util
    import yaml

    script_path = Path(__file__).parents[2] / "scripts" / "check_license_manifest.py"
    spec = importlib.util.spec_from_file_location("alandi_license_check", script_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    payload = {
        "schema_version": 1,
        "artifacts": [{
            "id": "unsafe-model", "kind": "tts_voice_weights", "upstream": "https://example.test/model",
            "source_version": "v1", "license_spdx": "MIT", "commercial_use": "allowed",
            "sha256": None, "ship": True, "status": "approved"
        }]
    }
    manifest = tmp_path / "provenance_manifest.yaml"
    manifest.write_text(yaml.safe_dump(payload), encoding="utf-8")
    monkeypatch.setattr(module, "MANIFEST", manifest)
    assert module.main() == 1


@pytest.mark.asyncio
async def test_cpocket_cleanup_completes_when_rollback_caller_is_cancelled():
    cpocket = TransactionalCPocket()
    lease = await cpocket.acquire_lease("cancelled-cleanup", ttl_ms=2000)
    started = asyncio.Event()
    finished = asyncio.Event()

    async def cleanup():
        started.set()
        await asyncio.sleep(0.05)
        finished.set()

    lease.add_cleanup(cleanup)
    task = asyncio.create_task(cpocket.rollback(lease.branch_id, "caller_cancelled"))
    await started.wait()
    task.cancel()
    with pytest.raises(asyncio.CancelledError):
        await task
    assert finished.is_set()
    assert lease.state == "rolled_back"
    assert lease.branch_id not in cpocket.leases


@pytest.mark.asyncio
async def test_speculative_tts_playback_failure_discards_committed_prefix():
    class FailingTTS(_FakeTTS):
        async def play_buffered_prefix(self, buffer):
            raise RuntimeError("speaker unavailable")

    cpocket = TransactionalCPocket()
    tts = FailingTTS()
    transaction = SpeculativeVoiceTransaction(_FakeRouter(), _FakeResponder(), tts, cpocket)
    branch = await transaction.on_asr_stable_partial("tell me the answer")
    with pytest.raises(RuntimeError):
        await transaction.on_endpoint_confirmed("tell me the answer now", branch)
    assert not branch.committed and branch.rolled_back
    assert branch.tts_prefix_buffer in tts.discarded
    assert branch.branch_id not in cpocket.leases
