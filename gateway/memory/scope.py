"""Memory-scope validation shared by graph and retrieval layers."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

MemoryScope = Literal["conversation", "project", "global"]


class ScopeError(ValueError):
    pass


@dataclass(frozen=True)
class ScopeRef:
    kind: MemoryScope
    scope_id: str

    @classmethod
    def parse(cls, kind: object, scope_id: object) -> "ScopeRef":
        if not isinstance(kind, str) or kind not in {"conversation", "project", "global"}:
            raise ScopeError("scope must be conversation, project, or global")
        if not isinstance(scope_id, str) or not scope_id or len(scope_id) > 160:
            raise ScopeError("scope_id must be a non-empty string of at most 160 characters")
        if any(ord(char) < 32 for char in scope_id):
            raise ScopeError("scope_id cannot contain control characters")
        if kind == "global" and scope_id != "global":
            raise ScopeError("global scope must use scope_id='global'")
        if kind != "global" and scope_id == "global":
            raise ScopeError("non-global scope cannot use the reserved global ID")
        return cls(kind=kind, scope_id=scope_id)
