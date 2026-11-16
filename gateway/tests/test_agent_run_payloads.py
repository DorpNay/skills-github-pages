from __future__ import annotations

import sqlite3

import pytest
from cryptography.fernet import Fernet

from gateway.agent_runtime.payloads import (
    AgentPayloadConflict,
    AgentPayloadError,
    AgentPayloadExpired,
    AgentPayloadVault,
)


def make_vault(path, *, retention_seconds=600, max_payload_bytes=4096):
    vault = AgentPayloadVault(
        path, Fernet.generate_key().decode("ascii"),
        retention_seconds=retention_seconds, max_payload_bytes=max_payload_bytes,
    )
    vault.initialize()
    return vault


def test_payload_vault_round_trips_encrypted_input_and_output(tmp_path):
    path = tmp_path / "agent-runs.sqlite3"
    vault = make_vault(path)
    run_id = "0123456789abcdef0123456789abcdef"
    goal = "Составь безопасный план изменения."
    result = "План готов."

    vault.put(run_id=run_id, kind="input", plaintext=goal, now=100)
    vault.put(run_id=run_id, kind="output", plaintext=result, now=101)

    assert vault.get(run_id=run_id, kind="input", now=102) == goal
    assert vault.get(run_id=run_id, kind="output", now=102) == result
    raw_db = path.read_bytes()
    assert goal.encode("utf-8") not in raw_db
    assert result.encode("utf-8") not in raw_db


def test_payload_vault_is_idempotent_and_rejects_content_reuse(tmp_path):
    vault = make_vault(tmp_path / "agent-runs.sqlite3")
    run_id = "1123456789abcdef0123456789abcdef"
    vault.put(run_id=run_id, kind="input", plaintext="same", now=10)
    vault.put(run_id=run_id, kind="input", plaintext="same", now=11)
    with pytest.raises(AgentPayloadConflict):
        vault.put(run_id=run_id, kind="input", plaintext="different", now=12)


def test_payload_vault_rejects_tampering_and_bad_keys(tmp_path):
    path = tmp_path / "tamper.sqlite3"
    vault = make_vault(path)
    run_id = "2123456789abcdef0123456789abcdef"
    vault.put(run_id=run_id, kind="input", plaintext="private prompt", now=100)
    with sqlite3.connect(path) as db:
        db.execute(
            "UPDATE agent_run_payloads SET ciphertext=? WHERE run_id=? AND payload_kind='input'",
            (b"tampered", run_id),
        )
    with pytest.raises(AgentPayloadError, match="cannot be decrypted"):
        vault.get(run_id=run_id, kind="input", now=101)
    with pytest.raises(AgentPayloadError, match="valid Fernet"):
        AgentPayloadVault(tmp_path / "bad.sqlite3", "not-a-fernet-key")


def test_payload_vault_expiry_and_pruning(tmp_path):
    vault = make_vault(tmp_path / "expiry.sqlite3", retention_seconds=60)
    run_id = "3123456789abcdef0123456789abcdef"
    vault.put(run_id=run_id, kind="input", plaintext="private prompt", now=100)
    with pytest.raises(AgentPayloadExpired):
        vault.get(run_id=run_id, kind="input", now=161)
    vault.put(run_id=run_id, kind="output", plaintext="private result", now=100)
    assert vault.prune_expired(now=161) == 1


def test_payload_vault_bounds_payloads_and_identifiers(tmp_path):
    vault = make_vault(tmp_path / "limits.sqlite3", max_payload_bytes=1024)
    with pytest.raises(AgentPayloadError, match="byte limit"):
        vault.put(
            run_id="4123456789abcdef0123456789abcdef",
            kind="input", plaintext="x" * 1025, now=100,
        )
    with pytest.raises(AgentPayloadError, match="identifier"):
        vault.put(run_id="bad/id", kind="input", plaintext="ok", now=100)
    with pytest.raises(AgentPayloadError, match="kind"):
        vault.put(
            run_id="5123456789abcdef0123456789abcdef",
            kind="secret", plaintext="ok", now=100,
        )
