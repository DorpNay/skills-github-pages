# Accepted improvements register

Canonical machine-readable details live in PROJECT_STATE.yaml. Statuses below reflect code on the implementation branch, not deployment.

| ID | Subsystem | Decision / artifact | Status |
|---|---|---|---|
| AI-VOICE-001 | Native ONNX/Rust hotpath | gateway/voice/native_core_interface.py | **Conditional** — interface only; native runtime and target benchmark missing |
| AI-VOICE-002 | Transactional cPocket | gateway/voice/cpocket.py | **Prototype** — cleanup/TTL invariants under test |
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
| AI-RAG-001 | Low-cost graph-assisted RAG | gateway/rag/lazy_graph_rag.py | FTS5+lexical baseline, not full LazyGraphRAG |
| AI-RAG-002 | RAG-Anything multimodal | Future gateway/rag/rag_anything.py | Conditional; not installed |
| AI-RAG-003 | Exact citations | gateway/rag/citations.py | Offset/hash validation; parser offsets pending |
| AI-RAG-004 | Evidence ledger | gateway/rag/evidence_ledger.py | Prototype; not exposed to public API |
| AI-TOOLS-001 | Layered CLI sandbox | Future sandbox/cli_sandbox.py | Blocked until real container/isolation and escape tests |
| AI-TOOLS-002 | Read-only tool DAG | gateway/tools/dag_engine.py | Prototype; no tools registered by default |
| AI-TOOLS-003 | JSON Schema validation | gateway/tools/validator.py | Implemented module; not a public tool API |
| AI-TOOLS-004 | SSRF controls | gateway/security/ssrf_protection.py | Validation primitive only; no arbitrary fetch endpoint |
| AI-TOOLS-005 | Approval gates | gateway/security/approval_gates.py | One-time scoped ticket; no approval UI/endpoint |
| AI-LICENSE-001 | Model provenance CI gate | infra/license/provenance_manifest.yaml | Proposed gate; no audio model shipped |
| AI-UI-001 | Projects + scoped project memory UI | index.md + tests/e2e/app.spec.mjs | **Partial prototype** — browser-local CRUD, instructions, chat attach/detach, scoped memory opt-in and JSON bundle import/export; latest E2E pending; source indexing/backend sync deferred |
| AI-UI-002 | Authenticated memory/source viewer | Gateway contracts + frontend placeholders | Deferred until authenticated scoped memory/source API is implemented and tested |
| AI-UI-003 | Home UX, bilingual controls, clock/theme and adaptive composer | index.md | **Partial** — controls implemented; voice menu is preview-only without a voice runtime; translation/accessibility/mobile coverage still pending |
| AI-PROVIDER-001 | Cloud-first settings and provider recovery | index.md + tests/e2e/app.spec.mjs | **Frontend implementation** — real completion probe, stale-state invalidation, single-flight probe, paste-triggered model catalog check and bounded same-provider model fallback; latest full E2E pending |
| AI-PROJECT-001 | Project CRUD, scope isolation and project bundle I/O | index.md + tests/e2e/app.spec.mjs | **Frontend implementation** — localStorage prototype only; server-side project/memory isolation and deletion propagation are not yet implemented |
| AI-AGENT-001/002/003 | 64 logical roles, task routing, budgets | Master context + bounded DAG | Logical contracts; no 64-process swarm |
| AI-LEARN-001/002 | Eval-gated learning, skill rollback | LOOP.md | Governance protocol; self-modification not implemented |

## Rules

1. Accepted means accepted for implementation direction, not proof of production readiness.
2. No model/voice ships on a family-level license assertion; each artifact needs model/voice card, checksum, upstream URL and distribution rights.
3. No latency/quality number is a pass until a reproducible measured report exists.
4. Each implementation updates PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md and the relevant report.
