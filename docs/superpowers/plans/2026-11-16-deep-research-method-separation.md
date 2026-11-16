# Plan 2 — Deep Research method separation from AgentRun

**Status:** APPROVED BY OWNER — implementation follows Plan 1 on 2026-11-16  
**Implementation:** IMPLEMENTED / VERIFIED on exact main `6117ceb6d3360bc0b47ef3179d73536f854cebf4` (2026-11-17). Quality #43970945532 passed 7/7 jobs: 139 built-app Chromium tests + 1 published-site Chromium smoke; Pages #43970944970 succeeded; Graphify #43970945690 passed; fresh public root revision matched.

**Owner request:** OR-2026-11-16-011  
**Base:** `67ea5ba97e21f527d1eaff28cfddef274d2e98d7`  
**Spec:** K.6.4/K.6.15; K.5; D-024.

## Goal

Separate execution mode, Deep Research method and effort level. “Thorough” must not be duplicated as a Deep Research method; Deep Research must offer distinct methods rather than a duplicate agent toggle.

## Verified baseline

- Chat state stores `multiAgentEnabled`; `agentModeControl` is labelled “Использовать структурированный разбор”.
- For complex requests, `runMultiAgentResearch` runs planner → researcher (web search) → same-model critic → synthesizer and records ResearchTrace sources, claims and contradictions.
- The critic is the same selected model route, not an independent reviewer. This is an evidence workflow, not an independent agent swarm.
- AgentRun has its own `agentRuntimeStrategy` and explicit prompt. It must not be controlled by the legacy boolean.
- `agentTeamSize`/scenario/custom-role fields are blueprint-oriented and must not imply 1–50 actual workers.

## Architecture

- Keep AgentRun in the Agents surface and the Direct/AgentRun composer mode from Plan 1.
- Keep Deep Research separate with a method selector. Initially expose only `multi_step_evidence_report` (the existing four-stage pipeline) as AVAILABLE.
- Focused source search, comparative research, literature review, fact-check/source audit and Notebook synthesis remain candidates until each has a capability contract, source policy, eval set and runtime.
- Keep fast/thorough as an effort budget, orthogonal to both execution mode and research method.
- Migrate legacy `multiAgentEnabled=true` to `deepResearchMethod='multi_step_evidence_report'`; false/missing maps to `none`. Retain the old field read-only through the rollback window.
- Preserve ResearchTrace, source IDs, claim/contradiction validation and web-search permissions. Never silently downgrade a selected method.
- Hide or label blueprint-only team controls as non-executable; retain saved values for compatibility.

## Tasks

1. Add versioned `deepResearchMethod: none|multi_step_evidence_report` and deterministic migration for old chats. New chats default to `none`; messages, titles, ResearchTrace and other settings remain unchanged.
2. Replace `agentModeControl` with a Deep Research method selector in the Research panel. Keep AgentRun strategies in Agents; keep effort level outside both method selectors.
3. Dispatch `multi_step_evidence_report` to the existing evidence pipeline; `executionMode='agent'` dispatches only to AgentRun. No double execution.
4. Preserve planner/researcher/critic/synthesizer, search policy, ResearchTrace, evidence IDs and error handling. Label same-model criticism honestly.
5. Add migration and E2E tests for old true/false chats, new defaults, method selection, no double dispatch, ResearchTrace parity and AgentRun isolation.
6. Run exact-head Quality/Chromium, Freshness, Provenance, Pages and published-root verification.

## Acceptance and rollback

- Agents and Deep Research have distinct, non-duplicated controls.
- Direct chat, AgentRun and Deep Research dispatch to exactly one intended path.
- Existing evidence research remains available with ResearchTrace parity.
- Old chat preferences migrate without losing data; old field remains readable for rollback.
- Fast/thorough remains an effort level, not a method.
- Unimplemented methods and blueprint-only controls are not presented as runnable capabilities.

Rollback: restore old checkbox mapping from the retained legacy field; keep ResearchTrace schema unchanged.

## Review focus

Legacy chat migration, user expectations around the old toggle, ResearchTrace parity, search permission, same-model critic labeling, double-dispatch prevention, unavailable methods and preservation of saved team blueprint data.

## Owner-approved catalog boundary — OR-012 / K.6.17

Only `multi_step_evidence_report` is executable at the start of this plan. The Research panel may describe the target method catalog but must keep comparative research, literature review, fact-check/source audit and Notebook synthesis disabled until their method-specific handlers, source policies and golden-set evaluations exist. Effort level, web scope and AgentRun strategy remain separate controls.
