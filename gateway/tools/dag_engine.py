"""Bounded DAG planning for registered tools; mutations require a one-time approval ticket."""
from __future__ import annotations

import asyncio
import inspect
from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Mapping

from gateway.security.approval_gates import ApprovalRegistry
from gateway.tools.validator import ToolContract, ToolValidationError, validate_arguments


class DAGError(ValueError):
    pass


@dataclass(frozen=True)
class ToolNode:
    id: str
    tool_name: str
    arguments: dict[str, Any]
    dependencies: tuple[str, ...] = ()


@dataclass(frozen=True)
class RegisteredTool:
    contract: ToolContract
    handler: Callable[[dict[str, Any], Mapping[str, Any]], Awaitable[Any]]


class ToolDAG:
    def __init__(self, tools: Mapping[str, RegisteredTool], *, max_nodes: int = 32,
                 max_parallel_readers: int = 4, per_tool_timeout_seconds: float = 10.0):
        if not 1 <= max_nodes <= 256 or not 1 <= max_parallel_readers <= 32:
            raise ValueError("invalid DAG limits")
        if not 0.1 <= per_tool_timeout_seconds <= 120:
            raise ValueError("invalid per-tool timeout")
        self.tools = dict(tools)
        self.max_nodes = max_nodes
        self.max_parallel_readers = max_parallel_readers
        self.per_tool_timeout_seconds = per_tool_timeout_seconds

    def _plan(self, nodes: list[ToolNode]) -> list[list[ToolNode]]:
        if not isinstance(nodes, list) or not nodes or len(nodes) > self.max_nodes:
            raise DAGError("DAG must contain a bounded non-empty list of nodes")
        by_id: dict[str, ToolNode] = {}
        for node in nodes:
            if (not isinstance(node, ToolNode) or not isinstance(node.id, str) or
                    not node.id or len(node.id) > 128 or node.id in by_id):
                raise DAGError("node IDs must be unique, non-empty and bounded")
            if not isinstance(node.tool_name, str) or node.tool_name not in self.tools:
                raise DAGError("node references an unknown tool")
            if not isinstance(node.arguments, dict):
                raise DAGError("node arguments must be an object")
            if not isinstance(node.dependencies, (tuple, list)) or any(
                not isinstance(dep, str) or not dep for dep in node.dependencies
            ):
                raise DAGError("node dependencies must be a sequence of node IDs")
            by_id[node.id] = node
        for node in nodes:
            if len(set(node.dependencies)) != len(node.dependencies):
                raise DAGError("duplicate node dependency")
            if node.id in node.dependencies or any(dep not in by_id for dep in node.dependencies):
                raise DAGError("self or missing dependency")
        remaining = set(by_id)
        completed: set[str] = set()
        levels: list[list[ToolNode]] = []
        while remaining:
            ready = sorted((by_id[node_id] for node_id in remaining
                            if set(by_id[node_id].dependencies).issubset(completed)), key=lambda node: node.id)
            if not ready:
                raise DAGError("dependency graph contains a cycle")
            levels.append(ready)
            completed.update(node.id for node in ready)
            remaining.difference_update(node.id for node in ready)
        # Validate all schemas before executing any work.
        for node in nodes:
            try:
                validate_arguments(self.tools[node.tool_name].contract, node.arguments)
            except ToolValidationError as exc:
                raise DAGError(f"invalid arguments for node {node.id}") from exc
        return levels

    async def execute(self, nodes: list[ToolNode], *, scope: str,
                      approvals: Mapping[str, str] | None = None,
                      approval_registry: ApprovalRegistry | None = None,
                      actor_id: str | None = None) -> dict[str, Any]:
        levels = self._plan(nodes)
        results: dict[str, Any] = {}
        reader_semaphore = asyncio.Semaphore(self.max_parallel_readers)
        tickets = approvals or {}

        async def run(node: ToolNode) -> Any:
            registered = self.tools[node.tool_name]
            contract = registered.contract
            args = validate_arguments(contract, node.arguments)
            if not contract.read_only:
                token = tickets.get(node.id)
                if approval_registry is None or not token or not approval_registry.consume(
                    token, action=node.tool_name, arguments=args, scope=scope, actor_id=actor_id
                ):
                    raise DAGError(f"side-effect tool node {node.id} lacks a valid one-time approval")
            dependencies = {dep_id: results[dep_id] for dep_id in node.dependencies}
            async def invoke():
                returned = registered.handler(args, dependencies)
                if not inspect.isawaitable(returned):
                    raise DAGError("registered tool handler must be async")
                return await returned
            if contract.read_only:
                async with reader_semaphore:
                    return await asyncio.wait_for(invoke(), timeout=self.per_tool_timeout_seconds)
            # Side effects execute sequentially in deterministic topological order.
            return await asyncio.wait_for(invoke(), timeout=self.per_tool_timeout_seconds)

        for level in levels:
            readers = [node for node in level if self.tools[node.tool_name].contract.read_only]
            mutators = [node for node in level if not self.tools[node.tool_name].contract.read_only]
            if readers:
                outputs = await asyncio.gather(*(run(node) for node in readers), return_exceptions=True)
                failures = [output for output in outputs if isinstance(output, BaseException)]
                if failures:
                    raise DAGError("one or more read-only tool nodes failed") from failures[0]
                results.update({node.id: output for node, output in zip(readers, outputs)})
            for node in mutators:
                results[node.id] = await run(node)
        return results
