"""Transactional resource leases for cancellable speculative voice work."""
from __future__ import annotations

import asyncio
import inspect
import time
import uuid
from dataclasses import dataclass, field
from typing import Any, Callable


MAX_CLEANUP_ACTIONS = 128


@dataclass
class ResourceLease:
    branch_id: str
    kind: str
    ttl_ms: int
    created_monotonic: float = field(default_factory=time.monotonic)
    state: str = "active"
    cleanup_errors: list[str] = field(default_factory=list)
    _cleaners: list[tuple[Callable[..., Any], tuple[Any, ...], dict[str, Any]]] = field(default_factory=list)

    @property
    def closed(self) -> bool:
        return self.state != "active"

    @property
    def committed(self) -> bool:
        return self.state == "committed"

    @property
    def expires_monotonic(self) -> float:
        return self.created_monotonic + self.ttl_ms / 1000

    def add_cleanup(self, fn: Callable[..., Any], *args: Any, **kwargs: Any) -> None:
        if self.closed:
            raise RuntimeError("cannot register cleanup on a closed lease")
        if not callable(fn):
            raise TypeError("cleanup must be callable")
        if len(self._cleaners) >= MAX_CLEANUP_ACTIONS:
            raise RuntimeError("lease cleanup registration limit reached")
        self._cleaners.append((fn, args, kwargs))


class TransactionalCPocket:
    """Owns leases, TTL tasks and exactly-once rollback; never commits tool side effects."""

    def __init__(self) -> None:
        self.leases: dict[str, ResourceLease] = {}
        self._lock = asyncio.Lock()
        self._ttl_tasks: dict[str, asyncio.Task[None]] = {}

    async def acquire_lease(self, kind: str, ttl_ms: int = 5000) -> ResourceLease:
        if not isinstance(kind, str) or not kind or len(kind) > 64:
            raise ValueError("kind must be a non-empty short string")
        if isinstance(ttl_ms, bool) or not isinstance(ttl_ms, int) or not 50 <= ttl_ms <= 60_000:
            raise ValueError("ttl_ms must be between 50 and 60000")
        lease = ResourceLease(branch_id=uuid.uuid4().hex, kind=kind, ttl_ms=ttl_ms)
        async with self._lock:
            self.leases[lease.branch_id] = lease
            self._ttl_tasks[lease.branch_id] = asyncio.create_task(self._monitor_ttl(lease.branch_id, ttl_ms))
        return lease

    async def _monitor_ttl(self, branch_id: str, ttl_ms: int) -> None:
        try:
            await asyncio.sleep(ttl_ms / 1000)
            await self.rollback(branch_id, reason="ttl_expired")
        except asyncio.CancelledError:
            raise

    async def _run_cleanups(self, lease: ResourceLease,
                            cleaners: list[tuple[Callable[..., Any], tuple[Any, ...], dict[str, Any]]]) -> None:
        for fn, args, kwargs in cleaners:
            try:
                result = fn(*args, **kwargs)
                if inspect.isawaitable(result):
                    await result
            except asyncio.CancelledError:
                # A cleanup handler can itself raise CancelledError. Record only the
                # type and continue so one bad handler cannot strand later resources.
                lease.cleanup_errors.append("CancelledError")
            except Exception as exc:
                # Never retain exception messages: they may include paths or user data.
                lease.cleanup_errors.append(type(exc).__name__)

    async def _finish(self, branch_id: str, *, commit: bool, reason: str) -> bool:
        async with self._lock:
            lease = self.leases.pop(branch_id, None)
            task = self._ttl_tasks.pop(branch_id, None)
            if lease is None or lease.closed:
                return False
            lease.state = "committed" if commit else "rolled_back"
            cleaners = list(reversed(lease._cleaners))
            lease._cleaners.clear()
            current = asyncio.current_task()
            if task is not None and task is not current and not task.done():
                task.cancel()

        if not commit:
            # Shield cleanup from cancellation of the caller. The lease is already closed,
            # so a cancelled rollback must not strand resources without a retry path.
            cleanup_task = asyncio.create_task(self._run_cleanups(lease, cleaners))
            try:
                await asyncio.shield(cleanup_task)
            except asyncio.CancelledError:
                try:
                    await asyncio.shield(cleanup_task)
                finally:
                    raise
        return True

    async def commit(self, branch_id: str) -> bool:
        return await self._finish(branch_id, commit=True, reason="committed")

    async def rollback(self, branch_id: str, reason: str) -> bool:
        # Reason is intentionally not logged here; callers may safely use a finite reason code.
        if not isinstance(reason, str) or not reason or len(reason) > 64:
            raise ValueError("reason must be a short finite reason code")
        return await self._finish(branch_id, commit=False, reason=reason)

    async def cancel_all(self, reason: str = "barge_in") -> int:
        if not isinstance(reason, str) or not reason or len(reason) > 64:
            raise ValueError("reason must be a short finite reason code")
        async with self._lock:
            branch_ids = list(self.leases)
        results = await asyncio.gather(*(self.rollback(branch_id, reason) for branch_id in branch_ids))
        return sum(results)
