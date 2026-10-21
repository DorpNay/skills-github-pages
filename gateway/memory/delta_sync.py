"""Versioned, bounded conversation-memory deltas using a safe JSON Patch subset.

This implements add/remove/replace/test. Root replacement, arbitrary paths, move/copy, stale
base revisions and oversized states are rejected. Data is scoped to a conversation ID;
profile/global/project memory are deliberately separate future scopes.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import sqlite3
import time
from contextlib import closing
from pathlib import Path
from typing import Any

ALLOWED_ROOTS = frozenset({"facts", "decisions", "questions", "notes", "summary"})
DEFAULT_STATE: dict[str, Any] = {"facts": [], "decisions": [], "questions": [], "notes": [], "summary": ""}
_CONVERSATION_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")


class DeltaSyncError(ValueError):
    pass


class RevisionConflict(DeltaSyncError):
    pass


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def json_bytes(value: Any) -> bytes:
    return canonical_json(value).encode("utf-8")


def state_digest(state: Any) -> str:
    return hashlib.sha256(json_bytes(state)).hexdigest()


def _escape_pointer(value: str) -> str:
    return value.replace("~", "~0").replace("/", "~1")


def _array_index(segment: str) -> int:
    """Parse RFC 6902 array index syntax; JSON arrays do not allow leading zeroes."""
    if not re.fullmatch(r"0|[1-9][0-9]*", segment):
        raise DeltaSyncError("Invalid JSON Patch array index")
    return int(segment)


def _split_pointer(path: object) -> list[str]:
    if not isinstance(path, str) or not path.startswith("/") or path == "/":
        raise DeltaSyncError("Patch path must address a field below an allowed memory root")
    parts = path[1:].split("/")
    decoded: list[str] = []
    for part in parts:
        # RFC 6901 escaping only permits ~0 and ~1.
        if re.search(r"~(?![01])", part):
            raise DeltaSyncError("Malformed JSON Pointer escape")
        decoded.append(part.replace("~1", "/").replace("~0", "~"))
    if not decoded or decoded[0] not in ALLOWED_ROOTS:
        raise DeltaSyncError("Patch path is outside the allowed conversation-memory roots")
    if any(part in {"__proto__", "constructor", "prototype"} for part in decoded):
        raise DeltaSyncError("Reserved object key is not allowed")
    return decoded


def compute_patch(old: Any, new: Any, path: str = "") -> list[dict[str, Any]]:
    """Create a deterministic patch; append/truncate arrays compactly, replace other edits."""
    if type(old) is not type(new):
        if not path:
            raise DeltaSyncError("Root state type cannot be changed")
        return [{"op": "replace", "path": path, "value": new}]
    if isinstance(old, list):
        common = 0
        max_common = min(len(old), len(new))
        while common < max_common and old[common] == new[common]:
            common += 1
        # Memory collections are append-heavy. Express a pure suffix append with /-,
        # and a pure suffix removal from highest index downward. Other edits replace
        # the array as a single operation to keep diff complexity and semantics bounded.
        if common == len(old) and len(new) > len(old):
            if not path:
                raise DeltaSyncError("Root state cannot be an array")
            return [{"op": "add", "path": f"{path}/-", "value": item} for item in new[common:]]
        if common == len(new) and len(old) > len(new):
            if not path:
                raise DeltaSyncError("Root state cannot be an array")
            return [{"op": "remove", "path": f"{path}/{index}"} for index in range(len(old) - 1, len(new) - 1, -1)]
        if old != new:
            if not path:
                raise DeltaSyncError("Root state cannot be replaced")
            return [{"op": "replace", "path": path, "value": new}]
        return []
    if isinstance(old, dict):
        patch: list[dict[str, Any]] = []
        for key in sorted(old.keys() - new.keys()):
            child = f"{path}/{_escape_pointer(str(key))}"
            if not path:
                child = f"/{_escape_pointer(str(key))}"
            patch.append({"op": "remove", "path": child})
        for key in sorted(new.keys() - old.keys()):
            child = f"{path}/{_escape_pointer(str(key))}"
            if not path:
                child = f"/{_escape_pointer(str(key))}"
            patch.append({"op": "add", "path": child, "value": new[key]})
        for key in sorted(old.keys() & new.keys()):
            child = f"{path}/{_escape_pointer(str(key))}" if path else f"/{_escape_pointer(str(key))}"
            patch.extend(compute_patch(old[key], new[key], child))
        return patch
    if old != new:
        if not path:
            raise DeltaSyncError("Root state cannot be replaced")
        return [{"op": "replace", "path": path, "value": new}]
    return []


def validate_state(state: object, max_bytes: int) -> dict[str, Any]:
    if not isinstance(state, dict) or set(state) - ALLOWED_ROOTS:
        raise DeltaSyncError("Memory state must be an object containing only allowed roots")
    if len(json_bytes(state)) > max_bytes:
        raise DeltaSyncError("Memory state exceeds configured byte limit")
    for key in ("facts", "decisions", "questions", "notes"):
        if key in state and not isinstance(state[key], list):
            raise DeltaSyncError(f"Memory root {key} must be an array")
    if "summary" in state and not isinstance(state["summary"], str):
        raise DeltaSyncError("Memory root summary must be a string")
    # Return an independent JSON-compatible object.
    return json.loads(canonical_json(state))


def apply_patch(state: dict[str, Any], patch: object, *, max_bytes: int = 512_000, max_operations: int = 256) -> dict[str, Any]:
    state = validate_state(state, max_bytes)
    if not isinstance(patch, list) or len(patch) > max_operations:
        raise DeltaSyncError("Patch must be a bounded array of operations")
    for operation in patch:
        if not isinstance(operation, dict):
            raise DeltaSyncError("Invalid patch operation shape")
        op = operation.get("op")
        expected_keys = {
            "add": {"op", "path", "value"},
            "remove": {"op", "path"},
            "replace": {"op", "path", "value"},
            "test": {"op", "path", "value"},
        }
        if op not in expected_keys or set(operation) != expected_keys[op]:
            raise DeltaSyncError("Invalid or unsupported patch operation shape")
        parts = _split_pointer(operation.get("path"))
        if op in {"add", "replace", "test"} and "value" not in operation:
            raise DeltaSyncError("Patch operation requires value")
        if op in {"remove", "replace", "test"} and "value" not in operation and op != "remove":
            raise DeltaSyncError("Patch operation value missing")

        parent: Any = state
        for segment in parts[:-1]:
            if isinstance(parent, dict) and segment in parent:
                parent = parent[segment]
            elif isinstance(parent, list):
                index = _array_index(segment)
                if index >= len(parent):
                    raise DeltaSyncError("Patch parent array index out of range")
                parent = parent[index]
            else:
                raise DeltaSyncError("Patch parent path does not exist")
        leaf = parts[-1]
        exists = (isinstance(parent, dict) and leaf in parent) or (
            isinstance(parent, list) and leaf.isdigit() and int(leaf) < len(parent)
        )
        if isinstance(parent, dict):
            if op == "test":
                if not exists or parent[leaf] != operation["value"]:
                    raise RevisionConflict("JSON Patch test operation failed")
            elif op == "add":
                parent[leaf] = operation["value"]
            elif op == "replace":
                if not exists:
                    raise DeltaSyncError("Cannot replace a missing key")
                parent[leaf] = operation["value"]
            elif op == "remove":
                if not exists:
                    raise DeltaSyncError("Cannot remove a missing key")
                del parent[leaf]
        elif isinstance(parent, list):
            if leaf == "-" and op == "add":
                parent.append(operation["value"])
            elif re.fullmatch(r"0|[1-9][0-9]*", leaf):
                index = _array_index(leaf)
                if op == "add":
                    if index > len(parent):
                        raise DeltaSyncError("Array add index out of range")
                    parent.insert(index, operation["value"])
                elif not exists:
                    raise DeltaSyncError("Array index out of range")
                elif op == "test":
                    if parent[index] != operation["value"]:
                        raise RevisionConflict("JSON Patch test operation failed")
                elif op == "replace":
                    parent[index] = operation["value"]
                elif op == "remove":
                    del parent[index]
            else:
                raise DeltaSyncError("Invalid array index")
        else:
            raise DeltaSyncError("Patch parent is not a container")
        state = validate_state(state, max_bytes)
    return state


class DeltaMemoryStore:
    def __init__(self, path: str | Path, *, max_state_bytes: int = 512_000, max_patch_bytes: int = 128_000):
        self.path = str(path)
        self.max_state_bytes = max_state_bytes
        self.max_patch_bytes = max_patch_bytes

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.path, timeout=5.0)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA busy_timeout=5000")
        return connection

    def initialize(self) -> None:
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS memory_states (
                    conversation_id TEXT PRIMARY KEY,
                    revision INTEGER NOT NULL,
                    state_json TEXT NOT NULL,
                    updated_at INTEGER NOT NULL,
                    state_sha256 TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS memory_deltas (
                    id INTEGER PRIMARY KEY,
                    conversation_id TEXT NOT NULL,
                    base_revision INTEGER NOT NULL,
                    revision INTEGER NOT NULL,
                    patch_json TEXT NOT NULL,
                    patch_bytes INTEGER NOT NULL,
                    created_at INTEGER NOT NULL,
                    UNIQUE(conversation_id, revision)
                );
                CREATE INDEX IF NOT EXISTS idx_memory_deltas_conversation
                    ON memory_deltas(conversation_id, revision);
            """)
            db.commit()
        if self.path != ":memory:":
            os.chmod(self.path, 0o600)

    @staticmethod
    def _check_conversation_id(conversation_id: str) -> None:
        if not isinstance(conversation_id, str) or not _CONVERSATION_ID.fullmatch(conversation_id):
            raise DeltaSyncError("Invalid conversation_id")

    def get_state(self, conversation_id: str) -> dict[str, Any]:
        self._check_conversation_id(conversation_id)
        with closing(self._connect()) as db:
            row = db.execute("SELECT revision, state_json, state_sha256 FROM memory_states WHERE conversation_id=?",
                             (conversation_id,)).fetchone()
        if row is None:
            default_state = json.loads(canonical_json(DEFAULT_STATE))
            return {"conversation_id": conversation_id, "revision": 0,
                    "state": default_state, "state_sha256": state_digest(default_state)}
        return {"conversation_id": conversation_id, "revision": int(row["revision"]),
                "state": json.loads(row["state_json"]), "state_sha256": row["state_sha256"]}

    def sync_delta(self, conversation_id: str, base_revision: int, patch: object) -> dict[str, Any]:
        self._check_conversation_id(conversation_id)
        if isinstance(base_revision, bool) or not isinstance(base_revision, int) or base_revision < 0:
            raise DeltaSyncError("base_revision must be a non-negative integer")
        patch_text = canonical_json(patch)
        patch_size = len(patch_text.encode("utf-8"))
        if patch_size > self.max_patch_bytes:
            raise DeltaSyncError("Patch exceeds configured byte limit")
        now = int(time.time())
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("SELECT revision, state_json FROM memory_states WHERE conversation_id=?",
                             (conversation_id,)).fetchone()
            if row is None:
                current_revision, current = 0, dict(DEFAULT_STATE)
            else:
                current_revision, current = int(row["revision"]), json.loads(row["state_json"])
            if current_revision != base_revision:
                db.rollback()
                raise RevisionConflict(f"Stale base revision: expected {current_revision}, got {base_revision}")
            updated = apply_patch(current, patch, max_bytes=self.max_state_bytes)
            updated_text = canonical_json(updated)
            revision = current_revision + 1
            digest = state_digest(updated)
            db.execute("""INSERT INTO memory_states(conversation_id, revision, state_json, updated_at, state_sha256)
                          VALUES (?, ?, ?, ?, ?)
                          ON CONFLICT(conversation_id) DO UPDATE SET revision=excluded.revision,
                          state_json=excluded.state_json, updated_at=excluded.updated_at,
                          state_sha256=excluded.state_sha256""",
                       (conversation_id, revision, updated_text, now, digest))
            db.execute("""INSERT INTO memory_deltas(conversation_id, base_revision, revision,
                          patch_json, patch_bytes, created_at) VALUES (?, ?, ?, ?, ?, ?)""",
                       (conversation_id, current_revision, revision, patch_text, patch_size, now))
            db.commit()
        return {"conversation_id": conversation_id, "revision": revision, "state_sha256": digest,
                "patch_bytes": patch_size, "state_bytes": len(updated_text.encode("utf-8"))}

    def delete_state(self, conversation_id: str) -> bool:
        """Delete one conversation's current state and its delta history."""
        self._check_conversation_id(conversation_id)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            existed = db.execute("SELECT 1 FROM memory_states WHERE conversation_id=?", (conversation_id,)).fetchone() is not None
            db.execute("DELETE FROM memory_deltas WHERE conversation_id=?", (conversation_id,))
            db.execute("DELETE FROM memory_states WHERE conversation_id=?", (conversation_id,))
            db.commit()
        return existed

    def compute_delta(self, conversation_id: str, new_state: object) -> dict[str, Any]:
        current = self.get_state(conversation_id)
        validated = validate_state(new_state, self.max_state_bytes)
        patch = compute_patch(current["state"], validated)
        return {"conversation_id": conversation_id, "base_revision": current["revision"],
                "patch": patch, "base_sha256": current["state_sha256"],
                "estimated_state_bytes": len(json_bytes(validated)),
                "patch_bytes": len(json_bytes(patch)),
                "estimated_bytes_saved": max(0, len(json_bytes(validated)) - len(json_bytes(patch)))}
