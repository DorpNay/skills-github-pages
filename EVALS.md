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
| EV-CPOCKET-001 | Transactional leases | gateway/tests/test_coder_packet.py | Bounded cleanup registrations; cleanup continues after RuntimeError/CancelledError; concurrent rollback runs handlers exactly once; TTL/commit/caller-cancel semantics remain covered | PR #28 merged; Gateway contract/security tests passed on post-merge main e424d353; live voice runtime and target-host FD/task soak absent |
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
| EV-MEM-007 | Browser-to-server project memory bridge | index.md + tests/e2e/app.spec.mjs + /v1/memory/graph/* | no auto-migration; candidate-first upload; per-chat opt-in; only confirmed facts; both project and server toggles required; exact project scope | PR #29 merged at 55248f8; PR-head and post-merge Chromium/Quality/provenance/Pages smoke passed; gateway tests passed on unchanged base e424d35; live gateway activation unverified |
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


## EV-STORAGE-001 — Browser storage quota guidance

- **Scope:** quota estimate, warning thresholds, and non-blocking behavior in the browser client.
- **Fixture:** Chromium E2E tests in `tests/e2e/app.spec.mjs` mock `navigator.storage.estimate()` at 80% and 96%, and simulate estimator rejection.
- **Acceptance:** 80% usage shows preventive export guidance; 95% or higher shows urgent guidance; rejected/unsupported estimates do not block startup or persistence; existing save-failure behavior continues to preserve the previously valid state.
- **Status:** merged via PR #56 at `31ea7fd3b56a80f93f8d667d843cf743918ff23f`; Quality run #40490650505 passed all jobs including Chromium E2E and published-site smoke, Provenance run #40490650488 passed. This is not proof of a full-profile backup or successful restore.

## EV-PROJECT-SCOPE-001 — Project memory and clear-history isolation

- **Scope:** project settings target the explicitly selected project, persist after reload, and clear-history operations do not change project association or clear other chats.
- **Fixture:** three deterministic Chromium E2E tests in `tests/e2e/app.spec.mjs`.
- **Acceptance:** changing one project's memory scope does not change another or the active chat's project; clearing history leaves the selected chat/project in place; clearing a non-active chat leaves the active chat, history, and both project associations unchanged.
- **Status:** regression tests ported from legacy PR #36 onto current main; exact-head Quality/Chromium validation pending. No production application code changes.


## EV-LOCAL-VOICE-DIALOGUE-001 — Browser half-duplex local voice dialogue

- **Scope:** voice menu preconditions, per-turn recording, authenticated local ASR, configured chat-provider response, local TTS playback, and restart of listening only after playback.
- **Fixture:** deterministic Chromium E2E with a mocked `MediaRecorder`, mocked ASR/TTS gateway responses, and a mocked configured chat provider. No real microphone or speech model is exercised in CI.
- **Acceptance:** selecting voice dialogue closes the menu and gives explicit gateway setup guidance when configuration is missing; an enabled flow transcribes the recording, submits the user message through the selected provider, plays the assistant reply through the configured local TTS route, then records the next turn; route/chat/draft preconditions stop or prevent the session rather than silently sending stale context.
- **Status:** merged via PR #60 at `65cdae7a895d58b9f4371e99f64402bdcfe7513d`; Quality #40492599339 passed all six jobs, including Chromium and published-site smoke, and Provenance #40492599312 passed. This does not prove real hardware or model quality. Target hardware, real ASR/TTS quality, RU/EN/Thai accuracy, latency, echo, and Piper voice-model license remain unverified.


## EV-MOBILE-MESSAGE-TOOLS-001 — Full message access and resilient mobile controls

- **Scope:** readable/selectable message view for user and assistant messages, copy fallback when `navigator.clipboard.writeText()` rejects, and a jump-to-latest control that only appears when the chat is sufficiently far from its bottom.
- **Fixture:** Chromium E2E uses a 390×844 viewport, a long mocked assistant reply, forced clipboard permission rejection, and asserts user/assistant viewer content, fallback copy feedback, and scroll-to-bottom behavior.
- **Acceptance:** both message roles have copy and full-view actions; assistant speech control remains available; user content is rendered as text in the viewer; copy does not fail solely because Clipboard API permission was rejected if the selection fallback succeeds; jump control appears away from bottom and hides after returning to the latest message.
- **Status:** merged in PR #61 at `529b1d0b86aef58c2b84663a44e78677a31ce9b1`; exact-head Quality workflow #40495106752 passed all six jobs including Chromium and published-site smoke, and provenance run #40495106735 passed. Native iOS Safari/real-device behavior remains unverified.


## EV-RAG-006 — Reciprocal rank fusion for low-footprint hybrid retrieval

- Scope: fuse the independently ranked SQLite FTS5/BM25 and lexical-concept-graph candidate lists in LazyGraphRAG with reciprocal rank fusion (default rank constant 60).
- Safety contract: no new dependency, LLM call, embedding model, schema migration or feature-flag change; original scope filters, source/page fields, document IDs and delete behavior remain unchanged.
- Deterministic tests: consensus candidates rank above single-list-only candidates when scores tie as designed; duplicate IDs count once per list; malformed inputs/constants reject; retrieval order is stable; scope and source/page metadata remain present.
- Acceptance: gateway test suite, existing six-layer offline RAG smoke (synthetic Recall@5 must remain >= 0.75; citations/source metadata preserved), Quality Sentinels, Chromium, Jekyll and provenance pass on exact PR head.
- Status: proposed implementation in feat/rag-rrf-orienter-audit-20261027; CI and before/after evaluation pending. The fused score is only a ranking score, not calibrated confidence. No real-corpus Recall@5/citation accuracy claim until an owner-reviewed golden set is run.
