# aLandi Evaluation Registry (EVALS.md)

**Updated:** 2026-10-23  
**Rule:** metrics from synthetic fixtures are smoke checks, not product benchmarks. No number without a report, sample count and hardware/artifact information may be described as verified.

## Existing reproducible commands

~~~bash
python -m pip install -r gateway/requirements-dev.txt
python -m compileall -q gateway
python -m pytest -q gateway/tests
python gateway/evals/run_six_layer_eval.py
python gateway/evals/serialization_benchmark.py --iterations 100
python scripts/check_project_metadata.py
python scripts/check_license_manifest.py
~~~

The prior gateway baseline passed 37 tests and the deterministic six-layer smoke eval on the PR #19 head. The coder-packet test suite, offline eval, and manifest checker must be judged from the latest Actions run attached to the current implementation PR; do not copy results from the older baseline into this release report.

## Eval registry

| Eval ID | Scope | Current fixture / command | Acceptance | Status |
|---|---|---|---|---|
| EV-VOICE-001 | Native voice core | Future tests/voice/test_native_hotpath_contract.py | No PCM in public event payload; native backend reports bounded metadata | not yet an actual native runtime |
| EV-CPOCKET-001 | Transactional leases | gateway/tests/test_coder_packet.py | Bounded cleanup registrations; cleanup continues after RuntimeError/CancelledError; concurrent rollback runs handlers exactly once; TTL/commit/caller-cancel semantics remain covered | PR #28 current-head CI pending; live voice runtime absent |
| EV-VOICE-002 | Latency contracts | docs/LATENCY_CONTRACT.md | p50/p95 and false cut from actual 8GB CPU host, >=100 labelled utterances initially | unmeasured |
| EV-SPEC-001 | Speculative voice | Fake read-only adapters in gateway/tests/test_coder_packet.py | No playback before final transcript; mismatch rolls back; zero write-tool calls | CI pending |
| EV-LANG-001 | RU/EN ASR/TTS | evals/voice/language_matrix_v2.yaml | Per-language CER/WER, license/hash and memory report | candidate-only |
| EV-VOICE-004 | Barge-in/self-echo | policy fixture tests; future acoustic corpus | Measured false interruption, self-echo suppression and interruption latency | no native AEC |
| EV-HW-001 | 8GB profile | infra/hardware_profiles.yaml | PSS, system memory, RTF, cold/warm p95 | hardware not available |
| EV-CODE-001 | Dead code | .github/workflows/dead-code-check.yml | Vulture report reviewed manually; no automatic source deletion | report only |
| EV-CODE-002 | Serialization | gateway/evals/serialization_benchmark.py | semantic parity and median/p95 JSON serialization time for realistic payloads | benchmark file pending |
| EV-CODE-003 | uv | pyproject.toml + reviewed uv.lock | uv sync --locked reproducible on CI and target host | lockfile pending registry access |
| EV-OBS-001 | Trace context | gateway/tests/test_app.py | malformed incoming trace ID not echoed; response always has validated ID; context reset | CI pending |
| EV-OBS-002 | OpenTelemetry | observability/otel_config.py | exporter off by default, no remote endpoint without explicit policy | optional follow-up |
| EV-MEM-001 | Graph schema | gateway/tests/test_coder_packet.py | every node has provenance; sqlite foreign keys and permissions; scoped queries | CI pending |
| EV-MEM-002 | Temporal memory | gateway/tests/test_coder_packet.py | UTC offset required; valid-time interval semantics correct | CI pending |
| EV-MEM-003 | Memory scope | gateway/tests/test_coder_packet.py | cross-project read/edge/delete denied | CI pending |
| EV-MEM-004 | Conflicts | gateway/tests/test_coder_packet.py | contradictory items become disputed; no automatic winner | graph prototype; broader conflict eval pending |
| EV-MEM-005 | Scoped memory FTS5 retrieval | gateway/memory/manager.py + gateway/tests/test_coder_packet.py | exact-scope retrieval; confirmed-only default; bounded terms; deletion propagation; legacy index rebuild; capability-gated FTS5 secure-delete | PR #26 merged; PR-head Gateway, provenance and full quality/Pages smoke passed |
| EV-MEM-006 | Authenticated structured-memory API | gateway/app.py + gateway/memory/manager.py + gateway/tests/test_app.py | feature flag off by default; candidate-only create; confirmed-only search; audit-backed review; exact scope isolation; relation/delete propagation; global double opt-in | PR #27 merged at 653febb; post-merge Gateway/provenance/quality/Pages passed; activation still requires gateway config |
| EV-MEM-007 | Browser-to-server project memory bridge | index.md + tests/e2e/app.spec.mjs + /v1/memory/graph/* | no auto-migration; candidate-first upload; per-chat opt-in; only confirmed facts; both project and server toggles required; exact project scope | PR #29 implementation added; current-head Chromium/quality/gateway/provenance/Pages CI pending |
| EV-RAG-003 | Citations | gateway/tests/test_coder_packet.py | quote equals source[start:end], source SHA matches, malformed offsets rejected | CI pending |
| EV-RAG-004 | Evidence ledger | gateway/tests/test_coder_packet.py | scope isolation, source/page/offset/hash retained | CI pending |
| EV-TOOLS-002 | JSON Schema | gateway/tests/test_coder_packet.py | rejects invalid types, unknown keys, remote refs and oversized bodies | CI pending |
| EV-TOOLS-001 | Read-only DAG | gateway/tests/test_coder_packet.py | cycles fail; read-only work bounded; mutation requires ticket | CI pending |
| EV-SEC-001 | SSRF | gateway/tests/test_coder_packet.py | private/loopback/link-local/metadata IP and mixed DNS answer set rejected | CI pending |
| EV-SEC-002 | Approval gates | gateway/tests/test_coder_packet.py | action/scope/actor/expiry bound; single use; mismatch fails closed | CI pending |
| EV-LICENSE-001 | License governance | scripts/check_license_manifest.py | shipped artifact has SPDX/license source and 64-char hash; blocked/unverified never ships | CI pending |
| EV-STATE-001 | Source-state fingerprint | scripts/manifest_state.py + gateway/tests/test_v016_foundation.py | deterministic sorted SHA-256; main index.md included; secret/generated paths excluded | PR #21 CI passed; not a signature |
| EV-INTEL-001 | Provenance triad | scripts/check_intel_triad.py + intel/RECON.yaml | accepted rows require explicit HTTPS source/claim URLs, exact-artifact license field and non-placeholder metadata | CI passed; offline completeness only, no live license/URL verification |
| EV-ROUTER-001 | Risk-aware local routing | router/policy.py + gateway/tests/test_v016_foundation.py | destructive action requires confirmation; low budget and slow escalation obey policy; invalid input rejected | tests passed; typed prototype not runtime-integrated |
| EV-SEARCH-001 | Keyless web-search fallback | tests/e2e/app.spec.mjs + index.md | no Tavily key triggers bounded open-source search; citations come from actual source responses; tool budget remains bounded | PR #21 Chromium E2E passed; public sources remain CORS-dependent |
| EV-RAG-001 | Retrieval quality | gateway/evals/run_six_layer_eval.py | synthetic fixtures only; real golden set >=50 queries before product claims | not a product benchmark |
| EV-PROVIDER-001 | Configured provider live smoke | .github/workflows/provider-smoke-all.yml + scripts/provider-smoke-all.mjs | Live probes require an explicit true input; false/missing confirmation never reaches provider endpoints; secret values are not logged; unavailable secrets are skipped; configured failures fail the run | PR #25 quality/provenance CI passed on its head; live smoke was not dispatched from this session; live access unverified |
| EV-RAG-005 | Scope-safe source deletion | gateway/rag/lazy_graph_rag.py + gateway/tests/test_six_layers.py | reject invalid global-scope pairings; deleted document disappears from retrieval; SQLite secure-delete on and FTS5 secure-delete enabled only when SQLite >=3.42.0 | PR #24 HEAD and post-merge main CI passed; does not prove a whole-system crypto-erase guarantee |

## Reporting rules

The serialization microbenchmark only checks execution and data-format parity in CI; it does not authorize orjson as the gateway default. Project metadata parsing is enforced by the License and Artifact Provenance workflow.

Every JSON/Markdown report includes run ID, Git SHA, timestamp, Python/OS version, hardware profile, model tags and artifact SHA256 where applicable, feature flags, sample count and p50/p95. Raw prompt, transcript, token, secret or document text must not be logged; use case IDs and aggregate metrics. For voice, keep clean/noisy conditions and languages separate and report cold/warm model states independently.

## Release gates

- No critical security issue; no sandbox escape or PII leak in security tests.
- Zero false Tier0 shortcuts for commands that are not on exact allowlist.
- No speculative write-tool attempts.
- Citation mismatch means reject evidence, never auto-correct offset based on guess.
- Every model/voice with ship=true must have verified checksum, upstream URL, artifact-specific license, distribution/commercial permission and required attribution.
- Hard latency gates may run only on a verified self-hosted reference runner; other CI reports UNVERIFIED.

| EV-AGENT-004 | Small helper-model dispatch | DECISIONS.md + docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md | compare one 0.8B–2B helper for extraction/classification/compression with main-model-only baseline; measure quality, latency and peak RAM | design only; no helper model wired into runtime |
| EV-IMAGE-001 | Image generation request-to-image | docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md | exact backend/checkpoint/license/hash/VRAM; prompt submission, completion polling and returned image assertion | not implemented; no working image-generation UI/runtime |
| EV-OPS-001 | Free-first resource guard | DECISIONS.md + docs/USER_REQUEST_CHECKLIST.md | no paid resources provisioned automatically; free API quotas and external data processing disclosed; paid transition requires benchmark and owner decision | accepted operating policy; no billing/provisioning integration |
| EV-MODEL-001 | Local-model autonomy and refusal behavior | DECISIONS.md | no hidden app-level refusal filter; measure chosen checkpoint behavior; external provider policy remains provider-controlled | policy only; zero-refusal behavior is not guaranteed |
