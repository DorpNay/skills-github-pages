"""Offline lifecycle and recovery tests for the experimental AgentRun store."""
import pytest

from gateway.agent_runtime.store import (
    AgentRunError,
    AgentRunStore,
    IdempotencyConflict,
    InvalidTransition,
    LeaseError,
)


def make_running(store, *, now=100.0, key="run-request-1"):
    run = store.create_run(idempotency_key=key, scope_kind="project", scope_id="alpha",
                           goal_ref="task:investigate-bounded", metadata={"origin": "test-runner"}, now=now)
    return store.transition_run(run_id=run["run_id"], expected_state="queued",
                                new_state="running", event_type="run_started", now=now + 1)


def test_create_run_is_idempotent_and_conflicts_on_changed_request(tmp_path):
    store = AgentRunStore(tmp_path / "agent-runs.sqlite3")
    store.initialize()
    first = store.create_run(idempotency_key="request-1", scope_kind="project", scope_id="alpha",
                             goal_ref="task:same-goal", metadata={"source_count": 1}, now=10)
    replay = store.create_run(idempotency_key="request-1", scope_kind="project", scope_id="alpha",
                              goal_ref="task:same-goal", metadata={"source_count": 1}, now=20)
    assert replay["run_id"] == first["run_id"]
    assert replay["state"] == "queued"
    with pytest.raises(IdempotencyConflict):
        store.create_run(idempotency_key="request-1", scope_kind="project", scope_id="alpha",
                         goal_ref="task:different-goal", metadata={"source_count": 1}, now=30)


@pytest.mark.parametrize(("scope_kind", "scope_id"), [
    ("unknown", "alpha"), ("global", "alpha"), ("project", "global"), ("project", ""),
])
def test_run_scope_validation_fails_closed(tmp_path, scope_kind, scope_id):
    store = AgentRunStore(tmp_path / "scope.sqlite3")
    store.initialize()
    with pytest.raises(AgentRunError):
        store.create_run(idempotency_key="scope-test", scope_kind=scope_kind,
                         scope_id=scope_id, goal_ref="task:scope-test", now=1)


def test_run_transition_is_versioned_and_rejects_stale_or_terminal_changes(tmp_path):
    store = AgentRunStore(tmp_path / "transition.sqlite3")
    store.initialize()
    run = store.create_run(idempotency_key="transition-1", scope_kind="conversation",
                           scope_id="chat-1", goal_ref="task:lifecycle", now=1)
    started = store.transition_run(run_id=run["run_id"], expected_state="queued",
                                   new_state="running", event_type="run_started", now=2)
    assert started["revision"] == 1
    with pytest.raises(InvalidTransition):
        store.transition_run(run_id=run["run_id"], expected_state="queued",
                             new_state="running", event_type="stale", now=3)
    finished = store.transition_run(run_id=run["run_id"], expected_state="running",
                                    new_state="verifying", event_type="verification_started", now=4)
    succeeded = store.transition_run(run_id=run["run_id"], expected_state="verifying",
                                     new_state="succeeded", event_type="verification_passed", now=5)
    assert finished["revision"] == 2
    assert succeeded["state"] == "succeeded"
    with pytest.raises(InvalidTransition):
        store.transition_run(run_id=run["run_id"], expected_state="succeeded",
                             new_state="running", event_type="reopen", now=6)


def test_task_enqueue_is_idempotent_and_payload_mismatch_conflicts(tmp_path):
    store = AgentRunStore(tmp_path / "tasks.sqlite3")
    store.initialize()
    run = make_running(store)
    first = store.enqueue_task(run_id=run["run_id"], task_key="research-1",
                               idempotency_key="task-idem-1", payload={"source_refs": ["s1"]}, now=103)
    replay = store.enqueue_task(run_id=run["run_id"], task_key="research-1",
                                idempotency_key="task-idem-1", payload={"source_refs": ["s1"]}, now=104)
    assert replay["task_id"] == first["task_id"]
    with pytest.raises(IdempotencyConflict):
        store.enqueue_task(run_id=run["run_id"], task_key="research-1",
                           idempotency_key="task-idem-1", payload={"source_refs": ["s2"]}, now=105)


def test_claim_complete_task_and_event_journal(tmp_path):
    store = AgentRunStore(tmp_path / "claim.sqlite3")
    store.initialize()
    run = make_running(store)
    task = store.enqueue_task(run_id=run["run_id"], task_key="extract",
                              idempotency_key="extract-1", payload={"source_ref": "source:doc-1"}, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker-a", lease_seconds=10, now=104)
    assert claim is not None
    assert claim.task_id == task["task_id"]
    assert claim.attempt == 1
    completed = store.complete_task(claim=claim, result={"claim_count": 2}, now=105)
    assert completed["state"] == "succeeded"
    assert completed["result"] == {"claim_count": 2}
    assert store.claim_task(run_id=run["run_id"], worker_id="worker-b", now=106) is None
    events = store.list_events(run_id=run["run_id"], limit=20)
    assert [event["event_type"] for event in events] == [
        "run_created", "run_started", "task_enqueued", "task_claimed", "task_completed"
    ]
    assert events[-1]["to_state"] == "succeeded"


def test_expired_lease_requeues_and_fences_old_worker_token(tmp_path):
    store = AgentRunStore(tmp_path / "lease-recovery.sqlite3")
    store.initialize()
    run = make_running(store)
    task = store.enqueue_task(run_id=run["run_id"], task_key="recover",
                              idempotency_key="recover-1", payload={"operation": "small-unit"},
                              max_attempts=3, now=103)
    old_claim = store.claim_task(run_id=run["run_id"], worker_id="worker-old",
                                lease_seconds=5, now=104)
    assert old_claim is not None
    new_claim = store.claim_task(run_id=run["run_id"], worker_id="worker-new",
                                lease_seconds=5, now=110)
    assert new_claim is not None
    assert new_claim.task_id == task["task_id"]
    assert new_claim.attempt == 2
    with pytest.raises(LeaseError):
        store.complete_task(claim=old_claim, result={"status": "succeeded"}, now=111)
    assert store.complete_task(claim=new_claim, result={"status": "succeeded"}, now=112)["state"] == "succeeded"
    event_types = [event["event_type"] for event in store.list_events(run_id=run["run_id"])]
    assert "task_lease_expired" in event_types


def test_expired_lease_exhausts_retry_budget(tmp_path):
    store = AgentRunStore(tmp_path / "lease-budget.sqlite3")
    store.initialize()
    run = make_running(store)
    task = store.enqueue_task(run_id=run["run_id"], task_key="limited",
                              idempotency_key="limited-1", payload={}, max_attempts=1, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker-a",
                             lease_seconds=2, now=104)
    assert claim is not None
    assert store.claim_task(run_id=run["run_id"], worker_id="worker-b", now=107) is None
    assert store.get_task(task["task_id"])["state"] == "failed"
    with pytest.raises(LeaseError):
        store.complete_task(claim=claim, result={"status": "succeeded"}, now=108)


def test_retryable_failure_requeues_only_with_remaining_attempts(tmp_path):
    store = AgentRunStore(tmp_path / "retry.sqlite3")
    store.initialize()
    run = make_running(store)
    task = store.enqueue_task(run_id=run["run_id"], task_key="retry",
                              idempotency_key="retry-1", payload={}, max_attempts=2, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker-a", now=104)
    assert claim is not None
    assert store.fail_task(claim=claim, error_code="transient", retryable=True, now=105)["state"] == "queued"
    next_claim = store.claim_task(run_id=run["run_id"], worker_id="worker-b", now=106)
    assert next_claim is not None and next_claim.attempt == 2
    assert store.fail_task(claim=next_claim, error_code="transient", retryable=True, now=107)["state"] == "failed"
    assert store.claim_task(run_id=run["run_id"], worker_id="worker-c", now=108) is None
    assert store.get_task(task["task_id"])["error_code"] == "transient"


def test_cancel_run_cancels_queued_and_leased_tasks_and_fences_claim(tmp_path):
    store = AgentRunStore(tmp_path / "cancel.sqlite3")
    store.initialize()
    run = make_running(store)
    leased = store.enqueue_task(run_id=run["run_id"], task_key="leased",
                                idempotency_key="leased-1", payload={}, now=103)
    queued = store.enqueue_task(run_id=run["run_id"], task_key="queued",
                                idempotency_key="queued-1", payload={}, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker-a", now=104)
    assert claim is not None and claim.task_id == leased["task_id"]
    cancelled = store.cancel_run(run_id=run["run_id"], now=105)
    assert cancelled["state"] == "cancelled"
    assert store.get_task(leased["task_id"])["state"] == "cancelled"
    assert store.get_task(queued["task_id"])["state"] == "cancelled"
    with pytest.raises(LeaseError):
        store.complete_task(claim=claim, result={"status": "succeeded"}, now=106)
    assert store.cancel_run(run_id=run["run_id"], now=107)["state"] == "cancelled"


def test_event_cursor_limit_and_metadata_bounds(tmp_path):
    store = AgentRunStore(tmp_path / "events.sqlite3")
    store.initialize()
    run = store.create_run(idempotency_key="event-1", scope_kind="global",
                           scope_id="global", goal_ref="task:journal", now=1)
    all_events = store.list_events(run_id=run["run_id"], limit=10)
    assert len(all_events) == 1
    assert store.list_events(run_id=run["run_id"], after_event_id=all_events[0]["event_id"]) == []
    with pytest.raises(AgentRunError):
        store.transition_run(run_id=run["run_id"], expected_state="queued", new_state="running",
                             event_type="metadata_test", metadata={"oversized": "x" * 5000}, now=2)
    assert store.get_run(run["run_id"])["state"] == "queued"


def test_file_backing_is_required_for_durable_store(tmp_path):
    with pytest.raises(AgentRunError, match="file-backed"):
        AgentRunStore(":memory:")
    store = AgentRunStore(tmp_path / "permissions.sqlite3")
    store.initialize()
    assert (tmp_path / "permissions.sqlite3").stat().st_mode & 0o777 == 0o600


def test_concurrent_workers_atomically_claim_a_single_task(tmp_path):
    from concurrent.futures import ThreadPoolExecutor

    store = AgentRunStore(tmp_path / "concurrent-claim.sqlite3")
    store.initialize()
    run = make_running(store)
    task = store.enqueue_task(run_id=run["run_id"], task_key="only-task",
                              idempotency_key="only-task-1", payload={}, now=103)

    def claim(worker_id):
        return store.claim_task(run_id=run["run_id"], worker_id=worker_id,
                                lease_seconds=20, now=104)

    with ThreadPoolExecutor(max_workers=2) as pool:
        claims = list(pool.map(claim, ("worker-a", "worker-b")))
    actual = [item for item in claims if item is not None]
    assert len(actual) == 1
    assert actual[0].task_id == task["task_id"]
    assert store.get_task(task["task_id"])["state"] == "leased"


@pytest.mark.parametrize("metadata", [
    {"prompt": "raw prompt text"},
    {"lease_token": "worker secret"},
    {"nested": {"text": "raw source"}},
    {"values": ["unbounded nested data"]},
    [],
])
def test_run_metadata_rejects_raw_content_and_non_scalar_values(tmp_path, metadata):
    store = AgentRunStore(tmp_path / "safe-metadata.sqlite3")
    store.initialize()
    with pytest.raises(AgentRunError):
        store.create_run(idempotency_key="unsafe-meta", scope_kind="project",
                         scope_id="alpha", goal_ref="task:metadata-policy", metadata=metadata, now=1)


@pytest.mark.parametrize("metadata", [
    {"transcript": "raw transcript"},
    {"api_key": "credential"},
    {"source_text": "raw document text"},
    {"worker": {"nested": "object"}},
])
def test_event_metadata_rejects_sensitive_or_nested_fields(tmp_path, metadata):
    store = AgentRunStore(tmp_path / "safe-events.sqlite3")
    store.initialize()
    run = store.create_run(idempotency_key="event-safe", scope_kind="project",
                           scope_id="alpha", goal_ref="task:event-metadata", now=1)
    with pytest.raises(AgentRunError):
        store.transition_run(run_id=run["run_id"], expected_state="queued",
                            new_state="running", event_type="unsafe_metadata",
                            metadata=metadata, now=2)
    assert store.get_run(run["run_id"])["state"] == "queued"


def test_unhashable_scope_and_state_inputs_fail_closed(tmp_path):
    store = AgentRunStore(tmp_path / "input-validation.sqlite3")
    store.initialize()
    with pytest.raises(AgentRunError, match="scope_kind"):
        store.create_run(idempotency_key="bad-scope", scope_kind=[], scope_id="alpha", goal_ref="task:x", now=1)
    run = store.create_run(idempotency_key="state-input", scope_kind="project",
                           scope_id="alpha", goal_ref="task:state-validation", now=1)
    with pytest.raises(InvalidTransition, match="unknown run state"):
        store.transition_run(run_id=run["run_id"], expected_state="queued",
                            new_state=[], event_type="bad_state", now=2)
    with pytest.raises(AgentRunError, match="run_id"):
        store.transition_run(run_id=[], expected_state="queued", new_state="running",
                            event_type="bad_id", now=2)


@pytest.mark.parametrize("payload", [
    {"prompt": "inline source text"},
    {"tool_arguments": {"path": "/etc/passwd"}},
    {"document_text": "raw document"},
    {"nested": {"source": "raw"}},
    {"content": "raw content"},
    {"refs": ["ok", "x" * 257]},
])
def test_task_payload_rejects_raw_content_and_unbounded_shapes(tmp_path, payload):
    store = AgentRunStore(tmp_path / "safe-payload.sqlite3")
    store.initialize()
    run = make_running(store, key="safe-payload")
    with pytest.raises(AgentRunError):
        store.enqueue_task(run_id=run["run_id"], task_key="unsafe",
                           idempotency_key="unsafe-payload", payload=payload, now=103)


@pytest.mark.parametrize("result", [
    {"transcript": "raw model output"},
    {"tool_result": {"stdout": "sensitive output"}},
    {"message": "raw answer"},
    {"nested": {"claims": 2}},
])
def test_task_result_rejects_raw_content_and_nested_shapes(tmp_path, result):
    store = AgentRunStore(tmp_path / "safe-result.sqlite3")
    store.initialize()
    run = make_running(store, key="safe-result")
    task = store.enqueue_task(run_id=run["run_id"], task_key="result",
                              idempotency_key="safe-result-task", payload={"source_refs": ["s1"]}, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker", now=104)
    assert claim is not None and claim.task_id == task["task_id"]
    with pytest.raises(AgentRunError):
        store.complete_task(claim=claim, result=result, now=105)
    # Rejected results do not complete or release the lease.
    assert store.get_task(task["task_id"])["state"] == "leased"


def test_task_payload_and_result_allow_bounded_reference_metadata(tmp_path):
    store = AgentRunStore(tmp_path / "safe-reference-data.sqlite3")
    store.initialize()
    run = make_running(store, key="safe-reference-data")
    task = store.enqueue_task(run_id=run["run_id"], task_key="refs",
                              idempotency_key="refs-task",
                              payload={"source_refs": ["artifact:doc-1"], "priority": 2}, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker", now=104)
    assert claim is not None and claim.task_id == task["task_id"]
    completed = store.complete_task(claim=claim, result={"claim_count": 2, "evidence_refs": ["artifact:ev-1"]}, now=105)
    assert completed["result"] == {"claim_count": 2, "evidence_refs": ["artifact:ev-1"]}


def test_goal_is_stored_only_as_an_opaque_reference(tmp_path):
    store = AgentRunStore(tmp_path / "goal-reference.sqlite3")
    store.initialize()
    run = store.create_run(idempotency_key="goal-ref-1", scope_kind="project",
                           scope_id="alpha", goal_ref="task:review-001", now=1)
    assert run["goal_ref"] == "task:review-001"
    assert "goal" not in run
    with pytest.raises(AgentRunError, match="opaque identifier/reference"):
        store.create_run(idempotency_key="goal-ref-2", scope_kind="project",
                         scope_id="alpha", goal_ref="Please review this private prompt", now=2)


def test_legacy_schema_with_raw_goal_column_fails_closed(tmp_path):
    import sqlite3

    path = tmp_path / "legacy-goal.sqlite3"
    with sqlite3.connect(path) as db:
        db.execute("CREATE TABLE agent_runs (run_id TEXT PRIMARY KEY, goal TEXT NOT NULL)")
    store = AgentRunStore(path)
    with pytest.raises(AgentRunError, match="legacy AgentRun schema stores raw goal text"):
        store.initialize()


@pytest.mark.parametrize("metadata", [
    {"note": "summarize the user's private prompt"},
    {"context": "raw conversation fragment"},
    {"description": "PII copied from a document"},
])
def test_run_metadata_rejects_innocuous_free_text_keys(tmp_path, metadata):
    store = AgentRunStore(tmp_path / "metadata-allowlist.sqlite3")
    store.initialize()
    with pytest.raises(AgentRunError, match="unapproved metadata field"):
        store.create_run(idempotency_key="metadata-allowlist", scope_kind="project",
                         scope_id="alpha", goal_ref="task:metadata-allowlist",
                         metadata=metadata, now=1)


@pytest.mark.parametrize("payload", [
    {"note": "raw task prompt"},
    {"context": "copied source passage"},
    {"description": "user email and phone"},
])
def test_task_payload_rejects_innocuous_free_text_keys(tmp_path, payload):
    store = AgentRunStore(tmp_path / "payload-allowlist.sqlite3")
    store.initialize()
    run = make_running(store, key="payload-allowlist")
    with pytest.raises(AgentRunError, match="unapproved field"):
        store.enqueue_task(run_id=run["run_id"], task_key="task",
                           idempotency_key="payload-allowlist", payload=payload, now=103)


def test_terminal_transition_fences_queued_and_leased_tasks(tmp_path):
    store = AgentRunStore(tmp_path / "terminal-fence.sqlite3")
    store.initialize()
    run = make_running(store, key="terminal-fence")
    leased = store.enqueue_task(run_id=run["run_id"], task_key="a-leased",
                                idempotency_key="terminal-leased", payload={}, now=103)
    queued = store.enqueue_task(run_id=run["run_id"], task_key="z-queued",
                                idempotency_key="terminal-queued", payload={}, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker-a", now=104)
    assert claim is not None and claim.task_id == leased["task_id"]

    failed = store.transition_run(run_id=run["run_id"], expected_state="running",
                                  new_state="failed", event_type="run_failed", now=105)
    assert failed["state"] == "failed"
    assert store.get_task(leased["task_id"])["state"] == "cancelled"
    assert store.get_task(queued["task_id"])["state"] == "cancelled"
    with pytest.raises(LeaseError):
        store.complete_task(claim=claim, result={"status": "succeeded"}, now=106)


def test_success_transition_rejects_any_queued_or_leased_tasks(tmp_path):
    store = AgentRunStore(tmp_path / "success-fence.sqlite3")
    store.initialize()
    run = make_running(store, key="success-fence")
    store.enqueue_task(run_id=run["run_id"], task_key="unfinished",
                       idempotency_key="success-unfinished", payload={}, now=103)
    with pytest.raises(InvalidTransition, match="pause/verification transitions require an empty active task queue"):
        store.transition_run(run_id=run["run_id"], expected_state="running",
                             new_state="verifying", event_type="verification_started", now=104)
    assert store.get_run(run["run_id"])["state"] == "running"


def test_task_completion_rejects_inconsistent_terminal_parent_state(tmp_path):
    import sqlite3

    store = AgentRunStore(tmp_path / "parent-state-fence.sqlite3")
    store.initialize()
    run = make_running(store, key="parent-state-fence")
    task = store.enqueue_task(run_id=run["run_id"], task_key="worker-task",
                              idempotency_key="parent-state-task", payload={}, now=103)
    claim = store.claim_task(run_id=run["run_id"], worker_id="worker-a", now=104)
    assert claim is not None and claim.task_id == task["task_id"]
    with sqlite3.connect(store.path) as db:
        db.execute("UPDATE agent_runs SET state='failed' WHERE run_id=?", (run["run_id"],))
    with pytest.raises(LeaseError, match="parent run is not running"):
        store.complete_task(claim=claim, result={"status": "succeeded"}, now=105)


def test_run_cannot_skip_verification_to_succeed_with_open_tasks(tmp_path):
    store = AgentRunStore(tmp_path / "success-terminal-fence.sqlite3")
    store.initialize()
    run = make_running(store, key="success-terminal-fence")
    task = store.enqueue_task(run_id=run["run_id"], task_key="unfinished",
                              idempotency_key="success-terminal-task", payload={}, now=103)
    with pytest.raises(InvalidTransition, match="run state transition is not allowed"):
        store.transition_run(run_id=run["run_id"], expected_state="running",
                             new_state="succeeded", event_type="verification_passed", now=104)
    assert store.get_run(run["run_id"])["state"] == "running"
    assert store.get_task(task["task_id"])["state"] == "queued"


def test_per_run_task_limit_is_atomic_and_idempotent_replay_still_works(tmp_path):
    store = AgentRunStore(tmp_path / "task-cap.sqlite3", max_tasks_per_run=1)
    store.initialize()
    run = make_running(store, key="task-cap")
    first = store.enqueue_task(run_id=run["run_id"], task_key="one",
                               idempotency_key="task-cap-one", payload={}, now=103)
    replay = store.enqueue_task(run_id=run["run_id"], task_key="one",
                                idempotency_key="task-cap-one", payload={}, now=104)
    assert replay["task_id"] == first["task_id"]
    with pytest.raises(AgentRunError, match="task limit reached"):
        store.enqueue_task(run_id=run["run_id"], task_key="two",
                           idempotency_key="task-cap-two", payload={}, now=105)
    assert len(store.list_events(run_id=run["run_id"], limit=20)) == 3


def test_per_run_event_limit_rolls_back_lifecycle_transition(tmp_path):
    store = AgentRunStore(tmp_path / "event-cap.sqlite3", max_tasks_per_run=1,
                          max_events_per_run=5)
    store.initialize()
    run = store.create_run(idempotency_key="event-cap", scope_kind="project",
                           scope_id="alpha", goal_ref="task:event-cap", now=1)
    run = store.transition_run(run_id=run["run_id"], expected_state="queued",
                               new_state="running", event_type="run_started", now=2)
    task = store.enqueue_task(run_id=run["run_id"], task_key="pending",
                              idempotency_key="event-cap-task", payload={}, now=3)
    # Ordinary task events stop at the non-reserved budget and roll back the claim.
    with pytest.raises(AgentRunError, match="terminal-fence capacity is reserved"):
        store.claim_task(run_id=run["run_id"], worker_id="worker", now=4)
    assert store.get_task(task["task_id"])["state"] == "queued"
    # Terminal transitions may consume the reserved task-cancellation + run event slots.
    failed = store.transition_run(run_id=run["run_id"], expected_state="running",
                                  new_state="failed", event_type="run_failed", now=5)
    assert failed["state"] == "failed"
    assert store.get_task(task["task_id"])["state"] == "cancelled"
    assert len(store.list_events(run_id=run["run_id"], limit=10)) == 5


@pytest.mark.parametrize(("kwargs", "message"), [
    ({"max_tasks_per_run": 0}, "max_tasks_per_run"),
    ({"max_tasks_per_run": True}, "max_tasks_per_run"),
    ({"max_events_per_run": 0}, "max_events_per_run"),
    ({"max_events_per_run": 501}, "max_events_per_run"),
    ({"max_events_per_run": 100001}, "max_events_per_run"),
])
def test_per_run_limits_are_validated(tmp_path, kwargs, message):
    with pytest.raises(AgentRunError, match=message):
        AgentRunStore(tmp_path / "invalid-limits.sqlite3", **kwargs)
