"""Durable AgentRun executor with bounded specialist DAGs and encrypted task payloads."""
from __future__ import annotations

import asyncio
import hashlib
import json
import re
import time
from collections import OrderedDict
from typing import Any

import httpx

try:
    from .context import ContextPacketError, normalize_context_packet, render_context_packet
    from .payloads import AgentPayloadError, AgentPayloadVault
    from .skills import load_coder_skill_bundle
    from .store import AgentRunError, AgentRunStore, TERMINAL_RUN_STATES
except ImportError:  # supports "uvicorn app:app" from the gateway directory
    from agent_runtime.context import ContextPacketError, normalize_context_packet, render_context_packet
    from agent_runtime.payloads import AgentPayloadError, AgentPayloadVault
    from agent_runtime.skills import load_coder_skill_bundle
    from agent_runtime.store import AgentRunError, AgentRunStore, TERMINAL_RUN_STATES


PROFILE_PROMPTS = {
    "general": (
        "You are aLandi General, a bounded task assistant. Work only with the request "
        "and supplied context. You have no tools, web access, filesystem, shell or "
        "external integrations. Never claim to have used them. Give a concise final "
        "answer. Do not reveal private reasoning or hidden chain-of-thought."
    ),
    "coder": (
        "You are aLandi Coder, a code-design specialist. Work only with code and context "
        "supplied in the task. You have no tools and no web access, no filesystem access, no shell "
        "access or external integrations. Never claim to have used them. You cannot inspect or modify repositories, "
        "execute shell commands, run tests or access files. Provide proposed code or a precise "
        "patch plan, and state what has not been executed. Do not reveal private reasoning."
    ),
    "reviewer": (
        "You are aLandi Reviewer. Review only the supplied material. Separate verified "
        "facts from assumptions, identify concrete risks and propose minimal corrections. "
        "You cannot access external sources or run tests. Do not reveal private reasoning."
    ),
    "researcher": (
        "You are aLandi Research Analyst. Analyze only supplied sources and context. You "
        "have no web/search tools; never invent citations or imply external research. "
        "Identify evidence gaps explicitly. Do not reveal private reasoning."
    ),
}
PROFILE_LABELS = {
    "general": "General",
    "coder": "Coder",
    "reviewer": "Reviewer",
    "researcher": "Research analyst",
}


class AgentRunBusy(AgentRunError):
    """The durable queue has reached its admission limit."""


class AgentRunUnavailable(AgentRunError):
    """The worker has not started or is stopping."""


class AgentRunWorker:
    """One real local-model worker; task state and payloads survive process restarts."""

    def __init__(
        self,
        store: AgentRunStore,
        payload_vault: AgentPayloadVault,
        client: httpx.AsyncClient,
        *,
        ollama_base_url: str,
        allowed_models: tuple[str, ...],
        inference_semaphore: asyncio.Semaphore,
        context_tokens: int = 4096,
        timeout_seconds: float = 120.0,
        max_prompt_chars: int = 12_000,
        max_output_tokens: int = 768,
        max_output_bytes: int = 65_536,
        max_pending_runs: int = 16,
        poll_interval_seconds: float = 0.5,
        lease_seconds: int = 180,
        max_attempts: int = 2,
    ):
        if not 1 <= max_pending_runs <= 256:
            raise ValueError("max_pending_runs must be between 1 and 256")
        if not 0.05 <= poll_interval_seconds <= 10:
            raise ValueError("poll_interval_seconds must be between 0.05 and 10")
        if not 1 <= lease_seconds <= 3600:
            raise ValueError("lease_seconds must be between 1 and 3600")
        if not 1 <= max_attempts <= 3:
            raise ValueError("max_attempts must be between 1 and 3")
        self.store = store
        self.payload_vault = payload_vault
        self.client = client
        self.ollama_base_url = ollama_base_url.rstrip("/")
        self.allowed_models = tuple(allowed_models)
        self.inference_semaphore = inference_semaphore
        self.context_tokens = context_tokens
        self.timeout_seconds = timeout_seconds
        self.max_prompt_chars = max_prompt_chars
        self.max_output_tokens = max_output_tokens
        self.max_output_bytes = max_output_bytes
        self.max_pending_runs = max_pending_runs
        self.poll_interval_seconds = poll_interval_seconds
        self.lease_seconds = lease_seconds
        self.max_attempts = max_attempts
        self.worker_id = "alandi-agent-worker-0"
        self._runner: asyncio.Task | None = None
        self._active: dict[str, asyncio.Task] = {}
        self._known_idempotency: OrderedDict[str, str] = OrderedDict()
        self._stopping = False
        self._wake = asyncio.Event()

    @staticmethod
    def profiles() -> list[dict[str, Any]]:
        return [
            {"id": profile_id, "label": PROFILE_LABELS[profile_id], "status": "configured",
             "tools": [], "filesystem": False, "network": False, "independent_process": False}
            for profile_id in PROFILE_PROMPTS
        ]

    @staticmethod
    def strategies() -> list[dict[str, Any]]:
        return [
            {"id": "single", "label": "Один специалист", "status": "available",
             "task_count": 1, "execution_mode": "single", "model_concurrency": 1,
             "parallel_inference": False, "tools": [], "filesystem": False, "network": False},
            {"id": "team_review", "label": "Команда: аналитик + ревьюер + координатор",
             "status": "available", "task_count": 3, "roles": ["researcher", "reviewer", "general"],
             "execution_mode": "fan_out_fan_in", "context_isolation": "per_task",
             "model_concurrency": 1, "parallel_inference": False,
             "tools": [], "filesystem": False, "network": False},
            {"id": "coder_review", "label": "Coder: черновик + проверка (без запуска)",
             "status": "available", "task_count": 3, "roles": ["coder", "reviewer", "general"],
             "execution_mode": "sequential_review", "context_isolation": "per_task",
             "model_concurrency": 1, "parallel_inference": False,
             "tools": [], "filesystem": False, "network": False},
        ]

    async def start(self) -> None:
        if self._runner is not None and not self._runner.done():
            return
        self._stopping = False
        self.payload_vault.prune_expired()
        self._runner = asyncio.create_task(self._serve(), name="alandi-agent-run-worker")

    def submit(
        self, *, prompt: str, idempotency_key: str, scope_kind: str, scope_id: str,
        profile_id: str = "general", model_id: str | None = None, strategy_id: str = "single",
        context_packet: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        if self._stopping or self._runner is None or self._runner.done():
            raise AgentRunUnavailable("AgentRun worker is unavailable")
        if not isinstance(prompt, str) or not prompt.strip():
            raise AgentRunError("prompt must be non-empty text")
        prompt = prompt.strip()
        if len(prompt) > self.max_prompt_chars:
            raise AgentRunError("prompt exceeds the configured size limit")
        if not isinstance(strategy_id, str) or strategy_id not in {"single", "team_review", "coder_review"}:
            raise AgentRunError("unknown AgentRun strategy")
        if not isinstance(profile_id, str) or profile_id not in PROFILE_PROMPTS:
            raise AgentRunError("unknown agent profile")
        if strategy_id in {"team_review", "coder_review"} and profile_id != "general":
            raise AgentRunError("team_review and coder_review use fixed specialist roles; profile_id must be general")
        try:
            normalized_context = normalize_context_packet(context_packet, max_chars=self.max_prompt_chars) if context_packet is not None else None
        except ContextPacketError as exc:
            raise AgentRunError(str(exc)) from None
        model_prompt = prompt + ("\n\n" + render_context_packet(normalized_context) if normalized_context is not None else "")
        if len(model_prompt) > self.max_prompt_chars:
            raise AgentRunError("prompt and selected context exceed the configured combined size limit")
        selected_model = model_id or (self.allowed_models[0] if self.allowed_models else "")
        if selected_model not in self.allowed_models:
            raise AgentRunError("model is not in the configured allowlist")
        if not isinstance(idempotency_key, str) or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}", idempotency_key):
            raise AgentRunError("a bounded Idempotency-Key is required")
        team_inputs: dict[str, str] = {}
        if strategy_id == "team_review":
            team_inputs = {
                "researcher": self._team_specialist_prompt(model_prompt,
                    "independent research analyst: structure the problem, identify relevant facts and unknowns from the supplied task only, and state evidence limits."),
                "reviewer": self._team_specialist_prompt(model_prompt,
                    "independent reviewer: challenge assumptions, identify risks, edge cases, counterarguments and missing information without seeing another specialist's work."),
            }
        request_descriptor = {"prompt": prompt, "context_packet": normalized_context, "profile_id": profile_id, "model_id": selected_model, "strategy_id": strategy_id}
        request_hash = hashlib.sha256(json.dumps(request_descriptor, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()
        stage = profile_id if strategy_id == "single" else f"{strategy_id}:{profile_id}"
        run_args = {
            "idempotency_key": idempotency_key, "scope_kind": scope_kind, "scope_id": scope_id,
            "goal_ref": f"request-sha256:{request_hash}",
            "metadata": {"origin": "agent_api", "model_id": selected_model, "stage": stage},
        }
        if idempotency_key not in self._known_idempotency:
            pending = self.store.list_runnable_runs(limit=self.max_pending_runs + 1)
            if len(pending) >= self.max_pending_runs:
                raise AgentRunBusy("AgentRun queue is full; retry after an active run completes")
        run = self.store.create_run(**run_args)
        self._remember_key(idempotency_key, run["run_id"])
        if run["state"] in TERMINAL_RUN_STATES or run["state"] == "needs_human":
            return run
        run_id = run["run_id"]
        try:
            input_record = {"prompt": prompt}
            if normalized_context is not None:
                input_record["context_packet"] = normalized_context
            self.payload_vault.put(run_id=run_id, kind="input",
                plaintext=json.dumps(input_record, ensure_ascii=False, separators=(",", ":")))
            if strategy_id == "single":
                tasks = self.store.list_tasks(run_id=run_id)
                if not tasks:
                    self.store.enqueue_task(run_id=run_id, task_key="model-completion",
                        idempotency_key=f"{idempotency_key}:model-completion",
                        payload={"task_type": "model_completion", "model_id": selected_model,
                                 "worker_profile_id": profile_id, "max_output_tokens": self.max_output_tokens},
                        max_attempts=self.max_attempts)
                elif len(tasks) != 1 or tasks[0]["task_key"] != "model-completion":
                    raise AgentRunError("single strategy does not match the existing task graph")
            elif strategy_id == "team_review":
                root_tasks: dict[str, dict[str, Any]] = {}
                for task_key, specialist_profile in (("researcher", "researcher"), ("reviewer", "reviewer")):
                    task = self.store.enqueue_task(run_id=run_id, task_key=task_key,
                        idempotency_key=hashlib.sha256(f"{idempotency_key}:{task_key}".encode()).hexdigest(),
                        payload={"task_type": "specialist_completion", "model_id": selected_model,
                                 "worker_profile_id": specialist_profile, "max_output_tokens": self.max_output_tokens},
                        max_attempts=self.max_attempts)
                    self.payload_vault.put(run_id=task["task_id"], kind="input",
                        plaintext=json.dumps({"prompt": team_inputs[task_key]}, ensure_ascii=False, separators=(",", ":")))
                    root_tasks[task_key] = task
                self.store.enqueue_task(run_id=run_id, task_key="synthesis",
                    idempotency_key=hashlib.sha256(f"{idempotency_key}:synthesis".encode()).hexdigest(),
                    payload={"task_type": "team_synthesis", "model_id": selected_model,
                             "worker_profile_id": "general", "max_output_tokens": self.max_output_tokens},
                    max_attempts=self.max_attempts,
                    depends_on=[root_tasks["researcher"]["task_id"], root_tasks["reviewer"]["task_id"]])
            else:
                coder = self.store.enqueue_task(run_id=run_id, task_key="coder",
                    idempotency_key=hashlib.sha256(f"{idempotency_key}:coder".encode()).hexdigest(),
                    payload={"task_type": "specialist_completion", "model_id": selected_model,
                             "worker_profile_id": "coder", "max_output_tokens": self.max_output_tokens},
                    max_attempts=self.max_attempts)
                coder_prompt = self._team_specialist_prompt(
                    model_prompt,
                    "code drafting specialist: propose a minimal patch or implementation from the code and context supplied in the task. Do not claim repository access, file changes, command execution or tests; clearly state what remains unexecuted.",
                )
                self.payload_vault.put(run_id=coder["task_id"], kind="input",
                    plaintext=json.dumps({"prompt": coder_prompt}, ensure_ascii=False, separators=(",", ":")))
                reviewer = self.store.enqueue_task(run_id=run_id, task_key="reviewer",
                    idempotency_key=hashlib.sha256(f"{idempotency_key}:reviewer".encode()).hexdigest(),
                    payload={"task_type": "dependent_review", "model_id": selected_model,
                             "worker_profile_id": "reviewer", "max_output_tokens": self.max_output_tokens},
                    max_attempts=self.max_attempts, depends_on=[coder["task_id"]])
                self.store.enqueue_task(run_id=run_id, task_key="synthesis",
                    idempotency_key=hashlib.sha256(f"{idempotency_key}:synthesis".encode()).hexdigest(),
                    payload={"task_type": "coder_synthesis", "model_id": selected_model,
                             "worker_profile_id": "general", "max_output_tokens": self.max_output_tokens},
                    max_attempts=self.max_attempts,
                    depends_on=[coder["task_id"], reviewer["task_id"]])
        except Exception as exc:
            try:
                current = self.store.get_run(run_id)
                if current["state"] in {"queued", "running"}:
                    self.store.transition_run(run_id=run_id, expected_state=current["state"],
                        new_state="failed", event_type="run_failed", metadata={"reason_code": "payload_enqueue_failed"})
                self.payload_vault.delete_run(run_id=run_id)
                for task in self.store.list_tasks(run_id=run_id):
                    self.payload_vault.delete_run(run_id=task["task_id"])
            except Exception:
                pass
            raise AgentRunError("AgentRun could not persist encrypted inputs or the dependency graph") from exc
        self._wake.set()
        return self.store.get_run(run_id)

    def _remember_key(self, key: str, run_id: str) -> None:
        self._known_idempotency[key] = run_id
        self._known_idempotency.move_to_end(key)
        while len(self._known_idempotency) > 512:
            self._known_idempotency.popitem(last=False)

    async def _serve(self) -> None:
        while not self._stopping:
            found_work = False
            try:
                runs = self.store.list_runnable_runs(limit=100)
                for run in runs:
                    if self._stopping:
                        break
                    run_id = run["run_id"]
                    if run_id in self._active:
                        continue
                    task = asyncio.create_task(self._process_run(run_id), name=f"agent-run-{run_id}")
                    self._active[run_id] = task
                    try:
                        claimed = await task
                        found_work = found_work or claimed
                    except asyncio.CancelledError:
                        if self._stopping:
                            raise
                    finally:
                        self._active.pop(run_id, None)
                    if found_work:
                        break
            except asyncio.CancelledError:
                raise
            except Exception:
                await asyncio.sleep(self.poll_interval_seconds)
                continue
            if not found_work:
                self._wake.clear()
                try:
                    await asyncio.wait_for(self._wake.wait(), timeout=self.poll_interval_seconds)
                except asyncio.TimeoutError:
                    pass

    async def _process_run(self, run_id: str) -> bool:
        run = self.store.get_run(run_id)
        if run["state"] in TERMINAL_RUN_STATES or run["state"] == "needs_human":
            return False
        tasks = self.store.list_tasks(run_id=run_id)
        if not tasks:
            return False
        if run["state"] == "queued":
            self.store.transition_run(run_id=run_id, expected_state="queued", new_state="running",
                event_type="run_started", metadata={"stage": "model_execution"})
        claim = self.store.claim_task(run_id=run_id, worker_id=self.worker_id, lease_seconds=self.lease_seconds)
        if claim is None:
            tasks = self.store.list_tasks(run_id=run_id)
            failed_task = next((item for item in tasks if item["state"] == "failed"), None)
            if failed_task is not None:
                self._finalize_failed(run_id, failed_task)
                return True
            if tasks and all(item["state"] == "succeeded" for item in tasks):
                stage = str(run.get("metadata", {}).get("stage", ""))
                if stage.startswith(("team_review:", "coder_review:")):
                    synthesis = next((item for item in tasks if item["task_key"] == "synthesis"), None)
                    final_output = self._read_output(synthesis["task_id"]) if synthesis is not None else None
                    if final_output is None:
                        self._transition_needs_human(run_id, "team_output_unavailable")
                        return True
                    self._persist_run_output(run_id, final_output)
                elif self._read_output(run_id) is None:
                    self._transition_needs_human(run_id, "output_unavailable")
                    return True
                self._finalize_success(run_id)
                return True
            return False
        task = self.store.get_task(claim.task_id)
        payload = self._json_object(task.get("payload", task.get("payload_json")))
        task_type = payload.get("task_type", "model_completion")
        if task_type not in {"model_completion", "specialist_completion", "dependent_review", "team_synthesis", "coder_synthesis"}:
            self._fail_claim(run_id, claim, "worker_policy_rejected", retryable=False)
            return True
        model_id = payload.get("model_id", "")
        profile_id = payload.get("worker_profile_id", "general")
        if model_id not in self.allowed_models or profile_id not in PROFILE_PROMPTS:
            self._fail_claim(run_id, claim, "worker_policy_rejected", retryable=False)
            return True
        payload_owner = run_id if task_type == "model_completion" else claim.task_id
        started = time.monotonic()
        try:
            saved_output = self._read_output(payload_owner)
            if saved_output is None:
                prompt = self._build_task_prompt(run_id=run_id, task=task, task_type=task_type)
                output_record = await self._generate(prompt=prompt, model_id=model_id, profile_id=profile_id, started=started)
                serialized = json.dumps(output_record, ensure_ascii=False, separators=(",", ":"))
                try:
                    self.payload_vault.put(run_id=payload_owner, kind="output", plaintext=serialized)
                except AgentPayloadError:
                    saved_output = self._read_output(payload_owner)
                    if saved_output is None:
                        raise
                    output_record = saved_output
            else:
                output_record = saved_output
            if task_type in {"team_synthesis", "coder_synthesis"}:
                self._persist_run_output(run_id, output_record)
            output_text = output_record["text"]
            self.store.complete_task(claim=claim, result={
                "status": "succeeded", "output_bytes": len(output_text.encode("utf-8")),
                "token_count": output_record.get("token_count", 0), "duration_ms": output_record.get("duration_ms", 0),
                "stage": profile_id, "worker_id": self.worker_id})
            return True
        except asyncio.CancelledError:
            raise
        except AgentPayloadError:
            self._fail_claim(run_id, claim, "payload_unavailable", retryable=False)
            self._transition_needs_human(run_id, "payload_unavailable")
            return True
        except asyncio.TimeoutError:
            self._fail_claim(run_id, claim, "model_queue_timeout", retryable=True)
            return True
        except httpx.TimeoutException:
            self._fail_claim(run_id, claim, "model_timeout", retryable=True)
            return True
        except httpx.HTTPStatusError as exc:
            retryable = exc.response.status_code == 429 or exc.response.status_code >= 500
            code = "model_not_found" if exc.response.status_code == 404 else "model_http_error"
            self._fail_claim(run_id, claim, code, retryable=retryable)
            return True
        except httpx.HTTPError:
            self._fail_claim(run_id, claim, "model_unavailable", retryable=True)
            return True
        except (ValueError, TypeError, KeyError):
            self._fail_claim(run_id, claim, "invalid_model_response", retryable=False)
            return True
        except Exception:
            self._fail_claim(run_id, claim, "agent_execution_error", retryable=False)
            return True

    @staticmethod
    def _json_object(value: Any) -> dict[str, Any]:
        if isinstance(value, str):
            value = json.loads(value)
        return value if isinstance(value, dict) else {}

    def _read_output(self, payload_ref: str) -> dict[str, Any] | None:
        try:
            raw = self.payload_vault.get(run_id=payload_ref, kind="output")
        except AgentPayloadError:
            return None
        record = self._json_object(raw)
        text = record.get("text")
        if not isinstance(text, str) or not text.strip():
            raise AgentPayloadError("saved output payload has an invalid shape")
        if len(text.encode("utf-8")) > self.max_output_bytes:
            raise AgentPayloadError("saved output payload exceeds the size limit")
        return record

    def _read_input(self, payload_ref: str) -> str:
        try:
            raw = self.payload_vault.get(run_id=payload_ref, kind="input")
        except AgentPayloadError as exc:
            raise AgentPayloadError("encrypted input payload is unavailable") from exc
        record = self._json_object(raw)
        if set(record) - {"prompt", "context_packet"}:
            raise AgentPayloadError("input payload contains unsupported fields")
        prompt = record.get("prompt")
        if not isinstance(prompt, str) or not prompt.strip():
            raise AgentPayloadError("input payload has an invalid shape")
        if len(prompt) > self.max_prompt_chars:
            raise AgentPayloadError("input payload exceeds the configured prompt limit")
        packet = record.get("context_packet")
        if packet is not None:
            try:
                packet = normalize_context_packet(packet, max_chars=self.max_prompt_chars)
            except ContextPacketError as exc:
                raise AgentPayloadError("saved context packet is invalid") from exc
            prompt += "\n\n" + render_context_packet(packet)
        if len(prompt) > self.max_prompt_chars:
            raise AgentPayloadError("input payload and selected context exceed the configured prompt limit")
        return prompt

    def _team_specialist_prompt(self, prompt: str, assignment: str) -> str:
        combined = (
            "User task:\n" + prompt + f"\n\nAssignment: {assignment}\n"
            "Use only the supplied task. Do not assume another specialist's findings. "
            "Do not claim web access, tools, filesystem access or execution. "
            "Return concise findings, uncertainties and concrete risks."
        )
        if len(combined) > self.max_prompt_chars:
            raise AgentRunError("team_review prompt is too long for isolated specialist instructions; shorten it or use single")
        return combined

    def _build_task_prompt(self, *, run_id: str, task: dict[str, Any], task_type: str) -> str:
        if task_type == "model_completion":
            return self._read_input(run_id)
        if task_type == "specialist_completion":
            return self._read_input(task["task_id"])
        goal = self._read_input(run_id)
        dependency_ids = self.store.list_task_dependencies(task_id=task["task_id"])
        if task_type == "dependent_review":
            if len(dependency_ids) != 1:
                raise AgentPayloadError("dependent review requires exactly one completed draft")
            dependency = self.store.get_task(dependency_ids[0])
            output = self._read_output(dependency_ids[0])
            if dependency["state"] != "succeeded" or output is None or dependency["task_key"] != "coder":
                raise AgentPayloadError("the required Coder draft is unavailable")
            prefix = "Original user task:\n" + goal + "\n\nCoder draft to review:\n"
            suffix = (
                "\n\nReviewer assignment: inspect the proposed patch for correctness, security, "
                "compatibility, edge cases and missing tests. Do not execute code or claim tests ran. "
                "Return concrete findings and any blocking issues."
            )
            available = self.max_prompt_chars - len(prefix) - len(suffix)
            if available < 256:
                raise AgentPayloadError("review context budget is too small")
            report = output["text"]
            truncation_marker = "\n[Coder draft truncated to the configured review context budget]"
            if len(report) > available:
                report = report[:max(0, available - len(truncation_marker))] + truncation_marker
            prompt = prefix + report + suffix
            if len(prompt) > self.max_prompt_chars:
                raise AgentPayloadError("review prompt exceeds the configured context limit")
            self.payload_vault.put(run_id=task["task_id"], kind="input",
                plaintext=json.dumps({"prompt": prompt}, ensure_ascii=False, separators=(",", ":")))
            return prompt
        if task_type not in {"team_synthesis", "coder_synthesis"}:
            raise AgentRunError("unsupported AgentRun task type")
        if len(dependency_ids) != 2:
            raise AgentPayloadError("synthesis requires exactly two completed specialist reports")
        reports = []
        for dependency_id in dependency_ids:
            dependency = self.store.get_task(dependency_id)
            output = self._read_output(dependency_id)
            if dependency["state"] != "succeeded" or output is None:
                raise AgentPayloadError("a required specialist report is unavailable")
            reports.append((dependency["task_key"], output["text"]))
        if task_type == "coder_synthesis":
            if {key for key, _ in reports} != {"coder", "reviewer"}:
                raise AgentPayloadError("Coder synthesis requires the Coder draft and reviewer report")
            prefix = "Original user task:\n" + goal + "\n\nCoder draft and reviewer assessment (separate task contexts):\n"
            suffix = (
                "\n\nCoordinator assignment: deliver the useful proposed patch and its review findings. "
                "Preserve blocking issues and evidence gaps. State clearly that no repository, shell or "
                "test execution occurred; do not claim the patch was applied or verified."
            )
        else:
            if {key for key, _ in reports} != {"researcher", "reviewer"}:
                raise AgentPayloadError("team synthesis requires researcher and reviewer reports")
            prefix = "Original user task:\n" + goal + "\n\nIndependent specialist reports (separate task contexts):\n"
            suffix = (
                "\n\nCoordinator assignment: synthesize a useful answer to the original task. "
                "Preserve meaningful disagreement, label assumptions and evidence gaps, and do not "
                "invent citations or claim verification that did not occur."
            )
        section_headers = [f"\n[{task_key}]\n" for task_key, _ in reports]
        available = self.max_prompt_chars - len(prefix) - len(suffix) - sum(map(len, section_headers))
        if available < 256 * len(reports):
            raise AgentPayloadError("team synthesis context budget is too small for the supplied task")
        per_report = available // len(reports)
        sections = []
        for (task_key, report), section_header in zip(reports, section_headers):
            truncation_marker = "\n[report truncated to the configured synthesis context budget]"
            clipped = report
            if len(report) > per_report:
                clipped = report[:max(0, per_report - len(truncation_marker))] + truncation_marker
            sections.append(section_header + clipped)
        prompt = prefix + "".join(sections) + suffix
        if len(prompt) > self.max_prompt_chars:
            raise AgentPayloadError("team synthesis prompt exceeds the configured context limit")
        self.payload_vault.put(run_id=task["task_id"], kind="input",
            plaintext=json.dumps({"prompt": prompt}, ensure_ascii=False, separators=(",", ":")))
        return prompt

    def _persist_run_output(self, run_id: str, output_record: dict[str, Any]) -> None:
        serialized = json.dumps(output_record, ensure_ascii=False, separators=(",", ":"))
        try:
            self.payload_vault.put(run_id=run_id, kind="output", plaintext=serialized)
        except AgentPayloadError:
            saved = self._read_output(run_id)
            if saved is None or saved.get("text") != output_record.get("text"):
                raise

    async def _generate(
        self, *, prompt: str, model_id: str, profile_id: str, started: float
    ) -> dict[str, Any]:
        request_body = {
            "model": model_id,
            "messages": [
                {"role": "system", "content": (
                    PROFILE_PROMPTS[profile_id]
                    + ("\n\n" + load_coder_skill_bundle() if profile_id == "coder" else "")
                )},
                {"role": "user", "content": prompt},
            ],
            "stream": False,
            "think": False,
            "keep_alive": "5m",
            "options": {
                "temperature": 0,
                "num_ctx": self.context_tokens,
                "num_predict": self.max_output_tokens,
            },
        }
        acquired = False
        try:
            remaining = max(0.05, self.timeout_seconds - (time.monotonic() - started))
            await asyncio.wait_for(self.inference_semaphore.acquire(), timeout=remaining)
            acquired = True
            remaining = max(0.05, self.timeout_seconds - (time.monotonic() - started))
            response = await self.client.post(
                f"{self.ollama_base_url}/api/chat", json=request_body, timeout=remaining
            )
            response.raise_for_status()
        finally:
            if acquired:
                self.inference_semaphore.release()

        payload = response.json()
        message = payload.get("message") if isinstance(payload, dict) else None
        if not isinstance(message, dict) or message.get("role") != "assistant":
            raise AgentRunError("invalid model response")
        if message.get("tool_calls"):
            raise AgentRunError("tool calls are disabled for this worker")
        output = message.get("content")
        if not isinstance(output, str) or not output.strip():
            raise AgentRunError("model returned empty output")
        output = output.strip()
        if len(output.encode("utf-8")) > self.max_output_bytes:
            raise AgentRunError("model output exceeds the configured size limit")
        token_count = payload.get("eval_count", 0)
        if isinstance(token_count, bool) or not isinstance(token_count, int) or not 0 <= token_count <= 10_000_000:
            token_count = 0
        duration_ms = min(10_000_000, max(0, int((time.monotonic() - started) * 1000)))
        return {
            "text": output,
            "model_id": model_id,
            "profile_id": profile_id,
            "token_count": token_count,
            "duration_ms": duration_ms,
        }

    def _fail_claim(self, run_id: str, claim: Any, error_code: str, *, retryable: bool) -> None:
        try:
            self.store.fail_task(claim=claim, error_code=error_code, retryable=retryable)
            task = self.store.get_task(claim.task_id)
            if task["state"] == "failed":
                current = self.store.get_run(run_id)
                if current["state"] in {"queued", "running", "verifying"}:
                    self.store.transition_run(
                        run_id=run_id, expected_state=current["state"], new_state="failed",
                        event_type="run_failed",
                        metadata={"reason_code": error_code, "retryable": False},
                    )
        except AgentRunError:
            pass

    def _transition_needs_human(self, run_id: str, reason_code: str) -> None:
        try:
            current = self.store.get_run(run_id)
            if current["state"] in {"queued", "running", "verifying"}:
                self.store.transition_run(
                    run_id=run_id, expected_state=current["state"], new_state="needs_human",
                    event_type="run_needs_human", metadata={"reason_code": reason_code},
                )
        except AgentRunError:
            pass

    def _finalize_success(self, run_id: str) -> None:
        current = self.store.get_run(run_id)
        if current["state"] == "queued":
            self.store.transition_run(
                run_id=run_id, expected_state="queued", new_state="running",
                event_type="run_started", metadata={"stage": "recovery"},
            )
            current = self.store.get_run(run_id)
        if current["state"] == "running":
            self.store.transition_run(
                run_id=run_id, expected_state="running", new_state="verifying",
                event_type="verification_started", metadata={"stage": "encrypted_output"},
            )
            current = self.store.get_run(run_id)
        if current["state"] == "verifying":
            self.store.transition_run(
                run_id=run_id, expected_state="verifying", new_state="succeeded",
                event_type="run_succeeded", metadata={"passed": True},
            )

    def _finalize_failed(self, run_id: str, task: dict[str, Any]) -> None:
        current = self.store.get_run(run_id)
        if current["state"] in {"queued", "running", "verifying"}:
            self.store.transition_run(
                run_id=run_id, expected_state=current["state"], new_state="failed",
                event_type="run_failed",
                metadata={"reason_code": task.get("error_code") or "task_failed", "retryable": False},
            )

    def cancel(self, run_id: str) -> dict[str, Any]:
        current = self.store.get_run(run_id)
        if current["state"] in TERMINAL_RUN_STATES:
            return current
        tasks = self.store.list_tasks(run_id=run_id)
        cancelled = self.store.cancel_run(run_id=run_id)
        self.payload_vault.delete_run(run_id=run_id)
        for task in tasks:
            self.payload_vault.delete_run(run_id=task["task_id"])
        active = self._active.get(run_id)
        if active is not None:
            active.cancel()
        self._wake.set()
        return cancelled

    def snapshot(self, run_id: str, *, after_event_id: int | None = None,
                 after_event_seq: int | None = None, limit: int = 100) -> dict[str, Any]:
        run = self.store.get_run(run_id)
        tasks = self.store.list_tasks(run_id=run_id)
        events = self.store.list_events(run_id=run_id, after_event_id=after_event_id,
                                        after_event_seq=after_event_seq, limit=limit)
        output = None
        output_available = False
        output_expired = False
        if run["state"] == "succeeded":
            try:
                record = self._read_output(run_id)
                if record is not None:
                    output = record["text"]
                    output_available = True
            except AgentPayloadError:
                output_expired = True
        return {
            "run": run,
            "tasks": tasks,
            "events": events,
            "last_event_seq": run["last_event_seq"],
            "output": output,
            "output_available": output_available,
            "output_expired": output_expired,
            "queue_depth": len(self.store.list_runnable_runs(limit=self.max_pending_runs + 1)),
            "active_runs": len(self._active),
            "retention_seconds": self.payload_vault.retention_seconds,
        }

    async def stop(self) -> None:
        self._stopping = True
        for task in list(self._active.values()):
            task.cancel()
        if self._runner is not None:
            self._runner.cancel()
            await asyncio.gather(self._runner, return_exceptions=True)
            self._runner = None
