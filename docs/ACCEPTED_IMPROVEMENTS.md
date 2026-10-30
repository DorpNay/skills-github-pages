# Accepted improvements register

Canonical machine-readable details live in PROJECT_STATE.yaml. Statuses below reflect code on the implementation branch, not deployment.

| ID | Subsystem | Decision / artifact | Status |
|---|---|---|---|
| AI-VOICE-001 | Native ONNX/Rust hotpath | gateway/voice/native_core_interface.py | **Conditional** — interface only; native runtime and target benchmark missing |
| AI-VOICE-002 | Transactional cPocket | gateway/voice/cpocket.py | **Prototype / hardening patch** — bounded cleanup callbacks and failure-resilient rollback; Gateway contract/security tests passed on post-merge main e424d353; no connected voice runtime or target-host FD/task soak |
| AI-VOICE-003 | PT/WW/Natural latency | docs/LATENCY_CONTRACT.md | **Accepted contract** — numbers unmeasured |
| AI-VOICE-004 | Read-only speculative voice | gateway/voice/speculative_transaction.py | **Prototype** — buffered adapters only |
| AI-VOICE-005 | RU/EN license-safe matrix | evals/voice/language_matrix_v2.yaml | **Conditional** — artifact hashes pending |
| AI-VOICE-006 | Two-tier voice | gateway/voice/tier_router.py | **Prototype** — not connected to microphone UI |
| AI-VOICE-007 | Barge-in/self-echo decision | gateway/voice/barge_in.py | **Policy helper** — no actual AEC |
| AI-INFRA-001 | Oracle ARM 24 GB | docs/INFRASTRUCTURE_UPGRADE.md | Optional manual path; no VM provisioned |
| AI-INFRA-002 | FreeDomain/custom domain | docs/DOMAIN_SETUP.md | Manual instructions; no DNS changed |
| AI-INFRA-003 | Laptop 8 GB CPU profile | infra/hardware_profiles.yaml | Target only; no benchmark |
| AI-CODE-001 | Vulture dead-code detection | .github/workflows/dead-code-check.yml | **Report-only**; no automatic deletion |
| AI-CODE-002 | orjson serialization | gateway/evals/serialization_benchmark.py | Deferred until parity/perf/license benchmark |
| AI-CODE-003 | uv package manager | pyproject.toml | Deferred until reviewed uv.lock can be generated and committed |
| AI-OBS-001 | Unified trace ID | observability/trace_context.py | Prototype integrated with gateway |
| AI-OBS-002 | OpenTelemetry | observability/otel_config.py | Optional config helper; disabled by default and not called from gateway startup |
| AI-OBS-003 | Agent timeline | observability/events.schema.json | Schema first; UI deferred |
| AI-MEM-001 | SQLite graph/provenance | gateway/memory/schema.sql | Prototype; opt-in storage module |
| AI-MEM-002 | Bitemporal memory | gateway/memory/temporal.py | Timestamp semantics and graph fields; not yet used by frontend |
| AI-MEM-003 | Scope isolation | gateway/memory/scope.py | Prototype; no public graph API |
| AI-MEM-004 | Conflict/supersede | gateway/memory/conflict.py | Explicit relations; no automatic winner selection |
| AI-MEM-005 | Scoped FTS5 memory retrieval | gateway/memory/manager.py + gateway/tests/test_coder_packet.py | Prototype only; exact-scope filters, confirmed-only defaults, bounded terms and indexed deletion |
| AI-MEM-006 | Authenticated structured-memory graph API | gateway/app.py + gateway/tests/test_app.py + index.md + tests/e2e/app.spec.mjs | Feature-flagged authenticated single-owner endpoints plus CI-verified manual candidate-first browser bridge; global scope has two opt-ins; live gateway activation pending |
| AI-RAG-001 | Low-cost graph-assisted RAG | gateway/rag/lazy_graph_rag.py | FTS5+lexical baseline, not full LazyGraphRAG |
| AI-RAG-002 | RAG-Anything multimodal | Future gateway/rag/rag_anything.py | Conditional; not installed |
| AI-RAG-003 | Exact citations | gateway/rag/citations.py | Offset/hash validation; parser offsets pending |
| AI-RAG-004 | Evidence ledger | gateway/rag/evidence_ledger.py | Prototype; not exposed to public API |
| AI-RAG-005 | Scope-safe source deletion | gateway/rag/lazy_graph_rag.py + gateway/tests/test_six_layers.py | Scope pairing validation and version-gated SQLite/FTS5 secure-delete options; no system-wide crypto-erasure claim |
| AI-TOOLS-001 | Layered CLI sandbox | Future sandbox/cli_sandbox.py | Blocked until real container/isolation and escape tests |
| AI-TOOLS-002 | Read-only tool DAG | gateway/tools/dag_engine.py | Prototype; no tools registered by default |
| AI-TOOLS-003 | JSON Schema validation | gateway/tools/validator.py | Implemented module; not a public tool API |
| AI-TOOLS-004 | SSRF controls | gateway/security/ssrf_protection.py | Validation primitive only; no arbitrary fetch endpoint |
| AI-TOOLS-005 | Approval gates | gateway/security/approval_gates.py | One-time scoped ticket; no approval UI/endpoint |
| AI-LICENSE-001 | Model provenance CI gate | infra/license/provenance_manifest.yaml | Proposed gate; no audio model shipped |
| AI-UI-001 | Projects + scoped project memory UI | index.md + tests/e2e/app.spec.mjs | **Partial prototype** — browser-local CRUD, instructions, chat attach/detach, scoped memory opt-in and JSON bundle import/export; Chromium E2E passed; source indexing/backend sync deferred |
| AI-UI-002 | Authenticated memory/source viewer | index.md + gateway/app.py + tests/e2e/app.spec.mjs | Manual opt-in bridge integrated; candidate-first upload, exact project scope and confirmed-only prompt retrieval covered by Chromium mock E2E; live gateway activation pending |
| AI-UI-003 | Home UX, bilingual controls, clock/theme and adaptive composer | index.md | **Partial** — Chromium E2E passed for core controls; voice menu remains preview-only; full translation/accessibility/mobile matrix still pending |
| AI-PROVIDER-001 | Cloud-first settings and provider recovery | index.md + tests/e2e/app.spec.mjs | **Frontend implementation** — real completion probe, stale-state invalidation, single-flight probe, paste-triggered model catalog check and bounded same-provider model fallback; PR #21 full Chromium E2E passed |
| AI-PROVIDER-002 | Explicit live provider smoke consent | .github/workflows/provider-smoke-all.yml + scripts/provider-smoke-all.mjs | Live smoke requires explicit confirmation (default false), supports per-provider model overrides, and is not considered a live account test until manually dispatched with consent; PR #25 quality/provenance CI passed |
| AI-PROJECT-001 | Project CRUD, scope isolation and project bundle I/O | index.md + tests/e2e/app.spec.mjs | **Frontend implementation** — browser-local CRUD plus manual opt-in bridge to scoped server memory; no automatic migration; live gateway and multi-device sync unverified |
| AI-STATE-001b | Deterministic source-state fingerprint | scripts/manifest_state.py + gateway/tests/test_v016_foundation.py | **Prototype implemented** — sorted path/content hashes; index.md included; not a signature |
| AI-INTEL-001 | Artifact provenance triad | scripts/check_intel_triad.py + intel/RECON.yaml | **Offline gate prototype** — rejects placeholders; no live URL/license/hash verification |
| AI-LATENCY-001 | Tier0/Tier1 latency budget | latency/budget_v2.yaml | **Target only** — allocations and 15% margin documented; no target-hardware benchmark |
| AI-ROUTER-001 | Risk-aware route policy | router/policy.py + gateway/tests/test_v016_foundation.py | **Typed prototype** — not connected to live request path; route regret not measured |
| AI-SEARCH-001 | Keyless web-search recovery | index.md + tests/e2e/app.spec.mjs | **Prototype implemented** — bounded open-source fallback when Tavily is absent/unavailable; PR #21 Chromium E2E passed; public sources remain CORS-dependent |
| AI-AGENT-001/002/003 | 64 logical roles, task routing, budgets | Master context + bounded DAG | Logical contracts; no 64-process swarm |
| AI-LEARN-001/002 | Eval-gated learning, skill rollback | LOOP.md | Governance protocol; self-modification not implemented |

## Rules

1. Accepted means accepted for implementation direction, not proof of production readiness.
2. No model/voice ships on a family-level license assertion; each artifact needs model/voice card, checksum, upstream URL and distribution rights.
3. No latency/quality number is a pass until a reproducible measured report exists.
4. Each implementation updates PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md and the relevant report.


## AI-MEM-007 — Opt-in browser-to-server project memory bridge

- **Status:** merged in PR #29 at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; PR-head and post-merge Quality/Chromium/provenance/Pages checks passed. Gateway tests passed on unchanged base e424d353; live gateway activation remains unverified.
- **Scope:** manual upload of local project facts as candidates; review candidates; inspect/delete server nodes; retrieve only confirmed nodes under the active project ID.
- **Activation:** gateway flag `ALANDI_MEMORY_GRAPH_ENABLED=true`, Pages origin in CORS, configured aLandi gateway URL/key. Global memory stays off.
- **Prompt inclusion:** both project-memory and server-project-memory toggles must be on for the current chat. Retrieval is bounded to six facts and degrades to local-only context if the graph API is unavailable.
- **Not included:** automatic migration, global/profile memory, live gateway verification, multi-user ACL, or server cleanup on local project deletion.


## AI-AGENT-005 — Policy-enforced autonomous orchestration

- **Status:** accepted for implementation planning; no claim of runtime implementation.
- **Scope:** task contract/state machine; bounded delegation; deterministic fail-closed policy; least-capability executor; approval bound to exact operation; independent verifier; durable journal/checkpoints; idempotency/reconciliation; bounded retries, cancellation and recovery.
- **Role separation:** planner proposes, policy authorizes, executor acts, verifier validates evidence. LLM agents cannot grant permissions or approve their own side effects.
- **Security:** arbitrary command/code execution remains blocked until a real sandbox and escape/isolation tests are verified. MCP, a confirmation prompt or a second model is not a sandbox.
- **Research:** `docs/AGENT_ORCHESTRATION_RESEARCH_RU.md` compares upstream patterns from Microsoft Agent Framework/Semantic Kernel, CrewAI, Hatchet, Restate, DBOS, OPA, Cedar, gVisor, Firecracker, promptfoo, Inspect, garak, Graphiti, Mem0, A2A, MCP, OpenTelemetry, NATS and PydanticAI.
- **Acceptance/evidence:** schema and policy gate for every tool call; unknown capability denied; approval invalidated by operation/argument/scope change or expiry; no blind retry of non-idempotent effects; crash/restart and injection tests; verifier rejects missing evidence; helper model off leaves core path operational.
- **Remaining:** current-head code audit, design of task schema and state transitions, sandbox selection, golden eval set and measured target-host profile.

## AI-UI-005 — Adaptive-minimalist private workspace and owner-controlled merge

- **Status:** accepted target design; runtime not implemented by this record.
- **Interface:** calm minimal default, growing warmth/continuity from relevant context, advanced tools discoverable without nagging or burdening basic users; adaptation remains predictable and user-controllable.
- **Personal workspace:** dedicated owner-only chat with persistent context and task continuity; privacy must be enforced by technical access controls and reviewed against a threat model.
- **Autonomous work:** bounded authorized work may continue while the owner is away; return a reviewable PR with rationale, test evidence, limitations and rollback plan. Only the owner decides whether to merge into `main`.
- **Acceptance:** validate basic/advanced discoverability, context continuity, access isolation, bounded execution, evidence-bearing PRs and the explicit merge-approval gate. Do not mark implemented without verified tests and deployment evidence.
- **Decision record:** `DECISIONS.md`, D-017.
