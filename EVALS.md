# aLandi Evaluation Registry (EVALS.md)

**Updated:** 2026-10-22  
**Rule:** metrics from synthetic fixtures are smoke checks, not product benchmarks. No number without a report, sample count and hardware/artifact information may be described as verified.

## Existing reproducible commands

~~~bash
python -m pip install -r gateway/requirements-dev.txt
python -m compileall -q gateway
python -m pytest -q gateway/tests
python gateway/evals/run_six_layer_eval.py
python scripts/check_license_manifest.py
~~~

The prior gateway baseline passed 37 tests and the deterministic six-layer smoke eval on the PR #19 head. The coder-packet test suite, offline eval, and manifest checker must be judged from the latest Actions run attached to the current implementation PR; do not copy results from the older baseline into this release report.

## Eval registry

| Eval ID | Scope | Current fixture / command | Acceptance | Status |
|---|---|---|---|---|
| EV-VOICE-001 | Native voice core | Future tests/voice/test_native_hotpath_contract.py | No PCM in public event payload; native backend reports bounded metadata | not yet an actual native runtime |
| EV-CPOCKET-001 | Transactional leases | gateway/tests/test_coder_packet.py | Cleanup exactly once; TTL/barg-in rollback; committed branches do not rollback | CI pending |
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
| EV-MEM-004 | Conflicts | gateway/tests/test_coder_packet.py | contradictory items become disputed; no automatic winner | CI pending |
| EV-RAG-003 | Citations | gateway/tests/test_coder_packet.py | quote equals source[start:end], source SHA matches, malformed offsets rejected | CI pending |
| EV-RAG-004 | Evidence ledger | gateway/tests/test_coder_packet.py | scope isolation, source/page/offset/hash retained | CI pending |
| EV-TOOLS-002 | JSON Schema | gateway/tests/test_coder_packet.py | rejects invalid types, unknown keys, remote refs and oversized bodies | CI pending |
| EV-TOOLS-001 | Read-only DAG | gateway/tests/test_coder_packet.py | cycles fail; read-only work bounded; mutation requires ticket | CI pending |
| EV-SEC-001 | SSRF | gateway/tests/test_coder_packet.py | private/loopback/link-local/metadata IP and mixed DNS answer set rejected | CI pending |
| EV-SEC-002 | Approval gates | gateway/tests/test_coder_packet.py | action/scope/actor/expiry bound; single use; mismatch fails closed | CI pending |
| EV-LICENSE-001 | License governance | scripts/check_license_manifest.py | shipped artifact has SPDX/license source and 64-char hash; blocked/unverified never ships | CI pending |
| EV-RAG-001 | Retrieval quality | gateway/evals/run_six_layer_eval.py | synthetic fixtures only; real golden set >=50 queries before product claims | not a product benchmark |

## Reporting rules

Every JSON/Markdown report includes run ID, Git SHA, timestamp, Python/OS version, hardware profile, model tags and artifact SHA256 where applicable, feature flags, sample count and p50/p95. Raw prompt, transcript, token, secret or document text must not be logged; use case IDs and aggregate metrics. For voice, keep clean/noisy conditions and languages separate and report cold/warm model states independently.

## Release gates

- No critical security issue; no sandbox escape or PII leak in security tests.
- Zero false Tier0 shortcuts for commands that are not on exact allowlist.
- No speculative write-tool attempts.
- Citation mismatch means reject evidence, never auto-correct offset based on guess.
- Every model/voice with ship=true must have verified checksum, upstream URL, artifact-specific license, distribution/commercial permission and required attribution.
- Hard latency gates may run only on a verified self-hosted reference runner; other CI reports UNVERIFIED.
