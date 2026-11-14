"""Offline tests for AgentRun's durable model execution and encrypted payloads."""
import asyncio
import json

import httpx
import pytest
from cryptography.fernet import Fernet

from gateway.agent_runtime.payloads import AgentPayloadError, AgentPayloadVault
from gateway.agent_runtime.store import AgentRunError, AgentRunStore
from gateway.agent_runtime.worker import AgentRunWorker


MODEL = "qwen3.5:4b"
KEY = Fernet.generate_key().decode("ascii")


def make_worker(tmp_path, handler, **overrides):
    db_path = tmp_path / "agent-runs.sqlite3"
    store = AgentRunStore(db_path)
    store.initialize()
    vault = AgentPayloadVault(
        db_path,
        encryption_key=KEY,
        retention_seconds=3600,
        max_payload_bytes=256_000,
    )
    vault.initialize()
    client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    options = dict(
        ollama_base_url="http://ollama.test:11434",
        allowed_models=(MODEL,),
        inference_semaphore=asyncio.Semaphore(1),
        context_tokens=4096,
        timeout_seconds=2,
        max_prompt_chars=2000,
        max_output_tokens=128,
        max_output_bytes=4096,
        max_pending_runs=8,
        poll_interval_seconds=0.02,
        lease_seconds=2,
        max_attempts=2,
    )
    options.update(overrides)
    worker = AgentRunWorker(store, vault, client, **options)
    return db_path, store, vault, client, worker


async def wait_for_state(worker, run_id, expected, tries=200):
    snapshot = worker.snapshot(run_id)
    for _ in range(tries):
        if snapshot["run"]["state"] in expected:
            return snapshot
        await asyncio.sleep(0.01)
        snapshot = worker.snapshot(run_id)
    return snapshot


def test_worker_invokes_only_allowlisted_local_model_and_encrypts_payloads(tmp_path):
    calls = []

    async def handler(request):
        calls.append((request.url.path, json.loads(request.content)))
        return httpx.Response(200, json={
            "message": {
                "role": "assistant",
                "content": "Durable agent answer.",
                "thinking": "must not be exposed",
            },
            "done": True,
            "eval_count": 13,
        })

    async def scenario():
        db_path, store, vault, client, worker = make_worker(tmp_path, handler)
        await worker.start()
        run = worker.submit(
            prompt="PRIVATE OWNER PROMPT",
            idempotency_key="durable-worker-1",
            scope_kind="project",
            scope_id="alpha",
            profile_id="coder",
        )
        snapshot = await wait_for_state(worker, run["run_id"], {"succeeded", "failed"})
        await worker.stop()
        await client.aclose()

        assert snapshot["run"]["state"] == "succeeded"
        assert snapshot["output"] == "Durable agent answer."
        assert snapshot["output_available"] is True
        assert snapshot["tasks"][0]["state"] == "succeeded"
        assert len(calls) == 1
        path, body = calls[0]
        assert path == "/api/chat"
        assert body["model"] == MODEL
        assert body["stream"] is False
        assert "tools" not in body
        assert body["options"] == {"temperature": 0, "num_ctx": 4096, "num_predict": 128}
        assert body["messages"][1]["content"] == "PRIVATE OWNER PROMPT"
        assert "no tools" in body["messages"][0]["content"].lower()
        assert json.loads(vault.get(run_id=run["run_id"], kind="input"))["prompt"] == "PRIVATE OWNER PROMPT"
        assert json.loads(vault.get(run_id=run["run_id"], kind="output"))["text"] == "Durable agent answer."
        raw_db = db_path.read_bytes()
        assert b"PRIVATE OWNER PROMPT" not in raw_db
        assert b"Durable agent answer." not in raw_db
        assert b"must not be exposed" not in raw_db

    asyncio.run(scenario())


def test_worker_recovers_expired_lease_after_restart_without_losing_encrypted_input(tmp_path):
    calls = []
    first_started = asyncio.Event()

    async def first_handler(_request):
        first_started.set()
        await asyncio.Event().wait()
        return httpx.Response(200, json={})

    async def success_handler(_request):
        calls.append("recovered")
        return httpx.Response(200, json={
            "message": {"role": "assistant", "content": "Recovered result."},
            "done": True,
            "eval_count": 5,
        })

    async def scenario():
        db_path, store, vault, client1, worker1 = make_worker(tmp_path, first_handler, lease_seconds=1)
        await worker1.start()
        run = worker1.submit(
            prompt="resume after restart",
            idempotency_key="restart-worker-1",
            scope_kind="conversation",
            scope_id="chat-1",
        )
        await asyncio.wait_for(first_started.wait(), timeout=1)
        await worker1.stop()
        await client1.aclose()
        assert store.get_run(run["run_id"])["state"] == "running"
        await asyncio.sleep(1.1)

        client2 = httpx.AsyncClient(transport=httpx.MockTransport(success_handler))
        worker2 = AgentRunWorker(
            store, vault, client2,
            ollama_base_url="http://ollama.test:11434",
            allowed_models=(MODEL,),
            inference_semaphore=asyncio.Semaphore(1),
            context_tokens=4096,
            timeout_seconds=2,
            max_prompt_chars=2000,
            max_output_tokens=128,
            max_output_bytes=4096,
            max_pending_runs=8,
            poll_interval_seconds=0.02,
            lease_seconds=2,
            max_attempts=2,
        )
        await worker2.start()
        snapshot = await wait_for_state(worker2, run["run_id"], {"succeeded", "failed"})
        await worker2.stop()
        await client2.aclose()
        assert snapshot["run"]["state"] == "succeeded"
        assert snapshot["output"] == "Recovered result."
        assert calls == ["recovered"]

    asyncio.run(scenario())


def test_worker_cancellation_fences_task_and_deletes_encrypted_payloads(tmp_path):
    started = asyncio.Event()

    async def handler(_request):
        started.set()
        await asyncio.Event().wait()

    async def scenario():
        db_path, store, vault, client, worker = make_worker(tmp_path, handler)
        await worker.start()
        run = worker.submit(
            prompt="cancel and purge", idempotency_key="cancel-worker-1",
            scope_kind="project", scope_id="alpha",
        )
        await asyncio.wait_for(started.wait(), timeout=1)
        cancelled = worker.cancel(run["run_id"])
        snapshot = worker.snapshot(run["run_id"])
        await worker.stop()
        await client.aclose()

        assert cancelled["state"] == "cancelled"
        assert snapshot["run"]["state"] == "cancelled"
        assert store.list_tasks(run_id=run["run_id"])[0]["state"] == "cancelled"
        with pytest.raises(AgentPayloadError):
            vault.get(run_id=run["run_id"], kind="input")
        with pytest.raises(AgentPayloadError):
            vault.get(run_id=run["run_id"], kind="output")

    asyncio.run(scenario())


def test_worker_rejects_unapproved_model_and_unknown_profile_before_persisting(tmp_path):
    calls = 0

    async def handler(_request):
        nonlocal calls
        calls += 1
        return httpx.Response(200, json={})

    async def scenario():
        _db, _store, _vault, client, worker = make_worker(tmp_path, handler)
        await worker.start()
        with pytest.raises(AgentRunError, match="allowlist"):
            worker.submit(
                prompt="safe", idempotency_key="model-policy-1",
                scope_kind="project", scope_id="alpha", model_id="remote-model",
            )
        with pytest.raises(AgentRunError, match="unknown agent profile"):
            worker.submit(
                prompt="safe", idempotency_key="profile-policy-1",
                scope_kind="project", scope_id="alpha", profile_id="pretend-agent",
            )
        await worker.stop()
        await client.aclose()
        assert calls == 0

    asyncio.run(scenario())
