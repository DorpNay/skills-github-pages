"""Validate tool arguments before dispatch; this module never executes a tool."""
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker
from jsonschema.exceptions import SchemaError, ValidationError


class ToolValidationError(ValueError):
    pass


@dataclass(frozen=True)
class ToolContract:
    name: str
    schema: dict[str, Any]
    read_only: bool
    requires_approval: bool = False
    max_argument_bytes: int = 64_000


def _walk_schema(value: Any, *, depth: int = 0) -> None:
    if depth > 32:
        raise ToolValidationError("schema nesting exceeds the configured maximum")
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"$dynamicRef", "$recursiveRef"}:
                raise ToolValidationError("dynamic/recursive remote-capable schema references are not supported")
            if key == "$ref" and isinstance(child, str) and not child.startswith("#/"):
                raise ToolValidationError("only local JSON Schema references are permitted")
            _walk_schema(child, depth=depth + 1)
    elif isinstance(value, list):
        for child in value:
            _walk_schema(child, depth=depth + 1)


def validate_arguments(contract: ToolContract, arguments: object) -> dict[str, Any]:
    if not isinstance(contract.name, str) or not contract.name or len(contract.name) > 128:
        raise ToolValidationError("invalid tool contract name")
    if not isinstance(contract.schema, dict):
        raise ToolValidationError("tool schema must be an object")
    _walk_schema(contract.schema)
    try:
        Draft202012Validator.check_schema(contract.schema)
    except SchemaError as exc:
        raise ToolValidationError("registered tool schema is invalid") from exc
    if not isinstance(arguments, dict):
        raise ToolValidationError("tool arguments must be a JSON object")
    try:
        encoded = json.dumps(arguments, ensure_ascii=False, separators=(",", ":"), allow_nan=False).encode("utf-8")
    except (TypeError, ValueError) as exc:
        raise ToolValidationError("tool arguments must be valid JSON data") from exc
    if len(encoded) > contract.max_argument_bytes:
        raise ToolValidationError("tool arguments exceed the configured size limit")
    validator = Draft202012Validator(contract.schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(arguments), key=lambda error: (list(error.absolute_path), error.message))
    if errors:
        # Never interpolate values or whole invalid arguments into error strings.
        first = errors[0]
        location = "/".join(str(part) for part in list(first.absolute_path)[:8])
        raise ToolValidationError(f"arguments failed schema validation at {location or '<root>'}")
    # Round-trip into a detached JSON value before passing data to any executor.
    return json.loads(encoded)
