"""Typed relation and lifecycle contracts for graph-memory conflict handling."""
from __future__ import annotations

from typing import Literal

RelationType = Literal["MENTIONS", "SUPPORTS", "CONTRADICTS", "SUPERSEDES", "DERIVED_FROM"]
MemoryStatus = Literal["candidate", "confirmed", "disputed", "superseded", "rejected"]
MEMORY_STATUSES = frozenset({"candidate", "confirmed", "disputed", "superseded", "rejected"})
RELATION_TYPES = frozenset({"MENTIONS", "SUPPORTS", "CONTRADICTS", "SUPERSEDES", "DERIVED_FROM"})


class ConflictError(ValueError):
    pass


def validate_status(value: object) -> MemoryStatus:
    if value not in MEMORY_STATUSES:
        raise ConflictError("invalid memory lifecycle status")
    return value  # type: ignore[return-value]


def validate_relation(value: object) -> RelationType:
    if value not in RELATION_TYPES:
        raise ConflictError("invalid memory relation type")
    return value  # type: ignore[return-value]


def next_status_for_contradiction(current: MemoryStatus, *, auto_resolve: bool = False) -> MemoryStatus:
    """Contradictions are evidence, not an instruction to silently pick a winner."""
    if current == "superseded" or current == "rejected":
        return current
    if auto_resolve:
        raise ConflictError("automatic conflict resolution is disabled; require explicit reviewed evidence")
    return "disputed"
