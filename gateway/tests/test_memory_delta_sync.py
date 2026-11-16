"""Regression tests for SQLite-backed conversation delta memory."""
from gateway.memory.delta_sync import DeltaMemoryStore


def test_in_memory_store_persists_across_short_lived_connections():
    store = DeltaMemoryStore(":memory:")
    try:
        store.initialize()

        result = store.sync_delta(
            "chat-1",
            0,
            [{"op": "add", "path": "/facts/-", "value": "persist in this store"}],
        )

        state = store.get_state("chat-1")
        assert result["revision"] == 1
        assert state["revision"] == 1
        assert state["state"]["facts"] == ["persist in this store"]
        assert store.delete_state("chat-1") is True
        assert store.get_state("chat-1")["revision"] == 0
    finally:
        store.close()


def test_in_memory_stores_are_isolated_from_each_other():
    first = DeltaMemoryStore(":memory:")
    second = DeltaMemoryStore(":memory:")
    try:
        first.initialize()
        second.initialize()
        first.sync_delta(
            "chat-1",
            0,
            [{"op": "add", "path": "/facts/-", "value": "private to first"}],
        )

        assert first.get_state("chat-1")["state"]["facts"] == ["private to first"]
        assert second.get_state("chat-1")["state"]["facts"] == []
        assert second.get_state("chat-1")["revision"] == 0
    finally:
        first.close()
        second.close()
