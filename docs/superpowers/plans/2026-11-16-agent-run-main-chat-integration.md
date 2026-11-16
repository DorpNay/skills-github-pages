# Plan 1 — AgentRun main-chat integration and live status

**Status:** Task 1 IMPLEMENTED; exact-head verification partial; Tasks 2–4 remain NEXT  
**Owner request:** OR-2026-11-16-011  
**Base:** `67ea5ba97e21f527d1eaff28cfddef274d2e98d7`  
**Spec:** D-024; K.6.2, K.6.3, K.6.16; K.5 row 4.

## Goal

Allow an explicit chat turn to run through the existing AgentRun runtime, transfer bounded current-chat context safely, return the result to that chat, and show a compact collapsible live status surface. Direct chat remains the default.

## Verified baseline

- Main chat uses `multiAgentEnabled` to call `runMultiAgentResearch`: planner → researcher with web search → same-model critic → synthesizer; it records ResearchTrace sources, claims and contradictions.
- AgentRun is a separate explicit-prompt UI. Its POST sends prompt + conversation scope + profile/model/strategy, not chat history, project instructions, memory or attachments.
- FastAPI accepts prompt-only payloads; worker input is encrypted with the existing Fernet vault. Strategies are `single`, `team_review`, `coder_review`.
- Durable SQLite events and a 500 ms observer exist, but the observer renders only inside the Agents modal.
- Runtime is feature-off by default, one worker/model slot, sequential inference, no tools/web/shell/filesystem/network.

## Architecture

1. Keep the existing FastAPI + SQLite + Fernet runtime from D-024. No LangGraph, Temporal, Dify, Redis, new queue or competing orchestrator.
2. Add per-chat `executionMode: direct|agent`; missing/unknown values default to `direct`. Keep `agentRuntimeStrategy` as the selected AgentRun strategy.
3. AgentRun is available only when Gateway capability is enabled and the model is installed/allowlisted. No silent fallback to direct chat.
4. Add a versioned, bounded context packet containing recent chat messages and only the instructions, project/memory scopes and text attachments already enabled/selected in the current chat. Each source carries a packet-local ID, kind, scope, inclusion reason and text.
5. Source/chat/project IDs are provenance, not authorization. The browser includes only data already present in the authorized current-chat context; the backend validates schema, allowed roles/source kinds, item counts and total size, encrypts the packet and includes its canonical digest in idempotency.
6. Render packet sources as delimited untrusted reference material. No raw files, arbitrary paths, image payloads, credentials, hidden reasoning or source instructions. Unsupported images/providers fail closed and preserve the draft.
7. Store active run ID per chat. One observer owns each run, uses the durable event cursor and snapshot, deduplicates events, and restores state when returning to the chat.
8. Reuse the 500 ms poller first. Consider SSE/fetch streaming only after a measured latency/load benefit and preserve auth, replay, cancellation and fallback.
9. Status summary remains visible while collapsed during an active run; expanded view shows safe task/event states. Server state—not animation—determines status. Stop calls DELETE and waits for server-confirmed cancellation.

## Tasks

### 1. Context contract and encrypted worker integration

**Files:** add `gateway/agent_runtime/context.py`, `gateway/tests/test_agent_run_context.py`; update `gateway/agent_runtime/worker.py`, `gateway/app.py`, `gateway/tests/test_agent_run_worker.py`, `gateway/tests/test_app.py`.

- Strict schema version, allowed message roles/source kinds/scopes, bounded strings/counts and total rendered prompt.
- Extend `AgentRunWorker.submit(..., context_packet=None)`; prompt-only payloads remain compatible.
- Canonical prompt+context hash controls idempotency; same key with changed context returns 409.
- Encrypt prompt and context together; specialist/coordinator stages receive the same bounded context.
- Never store raw context in SQLite metadata/events/logs.

**Tests:** malformed/unknown schema, unsafe role, unknown source kind, over-limit content, raw binary/image rejection, untrusted-source delimiters, encryption at rest, context-aware idempotency, legacy prompt-only compatibility, all strategies receive context.

### 2. Main-chat routing

**Files:** `index.md`, `tests/e2e/app.spec.mjs`, focused API/worker tests.

- New chats default to direct. Add one compact Direct/AgentRun composer control; keep strategy selection in the existing Agents panel.
- Build context from the active chat's existing, explicitly enabled sources; project/chat IDs alone never grant read access.
- Require the aLandi Gateway, enabled AgentRun capability and installed allowlisted model. Images/non-local providers fail closed; no silent provider switch.
- Append output to the same chat with run/strategy attribution and safe source references.
- Preserve the user's prompt and draft on network, validation, cancellation or budget errors.
- Leave `multiAgentEnabled`/Deep Research behavior unchanged in this plan; Plan 2 owns that migration.

### 3. Chat-anchored status surface

**Files:** `index.md`, `tests/e2e/app.spec.mjs`.

- Extract one run-scoped observer shared by Agents modal and chat; no duplicate pollers.
- Persist active run ID per chat and restore snapshot on return.
- Collapsed one-line state near chat/composer; expanded bounded task/event list.
- `aria-expanded`, visible focus, keyboard operation, polite status announcements, event deduplication, mobile layout and reduced-motion support.
- Stop uses server cancellation; stale polls cannot overwrite confirmed terminal state.
- Never render hidden reasoning, raw prompts, secrets, encrypted payloads or untrusted source text.

### 4. Verification

- Unit/API/worker tests for context bounds, scope separation, encryption, idempotency, failures and legacy payloads.
- Chromium E2E for direct default, explicit AgentRun, source inclusion/exclusion, result return, unsupported-image failure, retry, cancellation, navigation/reconnect, duplicate events, mobile/keyboard/reduced motion.
- Exact-head Gateway, Quality/Chromium, Freshness, Provenance, Pages and published-root revision.
- Feature remains off by default; no host activation/model download/new dependency.

## Acceptance and rollback

1. New chats remain direct unless the user selects AgentRun.
2. Explicit AgentRun sends the bounded current-chat context once; idempotency covers prompt and context.
3. Unselected project/memory/attachment content is excluded; unsupported inputs fail closed.
4. Result returns to the originating chat and is attributable to the run/strategy.
5. Status reflects durable server state, survives navigation/reconnect and does not invent progress.
6. Cancellation reconciles with server state; no stale poll overwrites it.
7. Tests and exact-head CI pass. Keep feature off until host-owner activation.

Rollback: hide/disable the composer control and keep `ALANDI_AGENT_RUNS_ENABLED=false`; preserve existing run records/chat metadata. Do not remove legacy fields.

## Review focus

Prompt/source injection, private/global/project memory scope, cross-chat status leakage, event replay, idempotency, cancellation races, stale polling, model allowlist changes, image inputs, XSS, screen-reader announcement spam and feature-off behavior.

## Owner-approved ecosystem boundary — OR-012 / K.6.17

This plan implements Phase A only. Keep interfaces compatible with a future versioned Agent Library and multi-model registry: strategy/profile IDs remain stable and capability-checked; context packets can later include approved Skill/source references; status events are reusable by Research and Skill jobs. Do not implement synthetic swarms, arbitrary browser/database/file tools, autonomous weight training or parallel multi-model execution as part of this first slice. Those require separate K.6.17 phases, policy and eval gates.


## Execution record — 2026-11-16

- **Task 1 implementation:** `gateway/agent_runtime/context.py` strict v1 packet; worker/API accepts explicit bounded packet, encrypts prompt+packet in Fernet, and fingerprints prompt+packet+profile+model+strategy for idempotent replay/conflict. Added validator, worker and API tests. Code SHA `f3608cd3253eeb5fb04a9960a620e3c0985956ba`.
- **Evidence:** Gateway #43914028219 PASS on Python 3.12/13/14; Graphify #43914028152 PASS; Pages #43914027020 SUCCESS. Quality #43914028299 had Security/Jekyll/Ruff/Integrity/Context pass; Chromium was still running at checkpoint. Exact state-child Freshness/Provenance/Quality/Pages remain pending.
- **Not yet implemented:** browser-side context builder from current chat, Direct/AgentRun composer routing, return of AgentRun output into originating chat, chat-scoped active-run restore, shared collapsible status window. Direct chat remains the default and AgentRun host flag remains false.
- **Research boundary:** OWASP requires tool authorization outside the model; packet delimiters are not a security boundary. Packet inclusion is data-only and grants no permissions. See INTEL.md OR-013 and TECHNIQUE_REGISTER_RU.md OR-013.
