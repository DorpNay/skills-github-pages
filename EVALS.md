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
| EV-MEM-001 | Graph schema | retired server-memory graph | **RETIRED BY OWNER 2026-11-07**; schema/store removed. Historical CI evidence is not a current product capability. |
| EV-MEM-002 | Temporal graph memory | retired server-memory graph | **RETIRED BY OWNER 2026-11-07**; graph-specific temporal module and tests removed. |
| EV-MEM-003 | RAG + evidence + exact-payload cache isolation | gateway/tests/test_six_layers.py; gateway/tests/test_coder_packet.py; gateway/tests/test_app.py | Same document/chunk IDs remain isolated by exact project scope; scoped deletion cannot delete another project's document; evidence lists are isolated; different project-specific prompt payloads produce different cache keys. Browser-global memory leakage and a separate project-ID cache namespace are not yet proven. | Keep UR-061/UR-064 partial until browser-global multi-project E2E and cache-scope contract are tested; do not restore server-memory graph API. |
| EV-MEM-004 | Graph-memory conflicts | retired server-memory graph | **RETIRED BY OWNER 2026-11-07**; graph-specific conflict module/tests removed. |
| EV-MEM-005 | Scoped FTS5 graph-memory retrieval | retired server-memory graph | **RETIRED BY OWNER 2026-11-07**; graph manager/schema/tests removed. RAG's independent FTS5 index remains. |
| EV-MEM-006 | Authenticated structured-memory API | retired server-memory graph | **RETIRED BY OWNER 2026-11-07**; routes, flags, store and API tests removed; retired paths now return 404. |
| EV-MEM-007 | Browser-to-server project memory bridge | retired server-memory graph | **RETIRED BY OWNER 2026-11-07**; UI, actions and per-chat server-memory state removed. Browser-local project notes remain. |
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


## EV-HELPER-MEMORY-001 — Opt-in local helper for project-memory compression

- **Scope:** an explicitly requested, local-Ollama helper proposes compact facts from the selected project's existing local memory.
- **Safety contract:** no model is selected by the browser; helper model is operator-configured by exact ALANDI_HELPER_MODEL; request is Bearer-authenticated, bounded, shares gateway inference concurrency and requests keep_alive=0; secret-like inputs and outputs are filtered; response is no-store.
- **User-control contract:** suggestions are rendered as text, not HTML; no candidate is saved automatically; adding each candidate requires a separate click and checks the current project ID and duplicate status.
- **Fixtures:** gateway tests cover disabled-by-default/auth, structured output, duplicates/limits, oversized/unknown input, invalid model output, and secret-like input filtering. Chromium E2E verifies the request is manual and candidate memory is unchanged until explicit selection.
- **Acceptance:** all gateway tests, security/context/integrity/Jekyll sentinels, Chromium E2E, published-site smoke and provenance pass on the exact PR head; helper remains disabled unless the operator installs/configures an exact local Ollama tag.
- **Status:** implementation on feat/local-helper-memory-suggestions-current-main-20261027; exact-head CI pending. This does not prove the helper model is installed on any VPS or that real inference quality is acceptable.

## EV-RAG-RRF-001 — deterministic rank fusion for scoped retrieval

- **Implementation:** PR #77, `gateway/rag/lazy_graph_rag.py`, `gateway/tests/test_rag_rrf.py`, `docs/RAG_RRF_EVALUATION_RU.md`.
- **Fixture:** candidate consensus across FTS5/BM25 and concept-graph lists; duplicate IDs, invalid/unbounded inputs, deterministic ordering, score ordering, scope isolation, source URI/page provenance and retrieval-path metadata.
- **Required automated gates:** Gateway contract/security run `40637641493`; Quality/Chromium/published-site run `40637641255`; dead-code report `40637641563` — all passed on PR head `c09c4db9afc3b763b4900b34712223c40b729cd7`.
- **Limit:** these gates establish deterministic behavior and contract preservation, not production retrieval quality. No labelled >=50-query corpus or target-host latency/RSS benchmark was run. Recall@5 >=0.75 remains a proposed threshold, not an observed production result.
- **Acceptance before quality claims:** compare baseline and RRF on identical labelled queries; report Recall@5, MRR/nDCG, citation correctness, p50/p95 latency, peak RSS, scope leakage, upsert and deletion correctness. Keep `ALANDI_RAG_ENABLED=false` until operator setup and validation.


## EV-MEMVID-001 — portable memory archive/export prototype (planned; source snapshot archived in PR #169)

- **Question:** can a portable single-file archive improve backup/transfer without replacing the canonical SQLite memory store?
- **Scope:** export/import only; no active retrieval routing or write-through runtime integration.
- **Fixture:** synthetic conversations and project facts with stable IDs, owner/scope, source/provenance, valid-time/recorded-time, disputed status, derived-from links and deletion markers.
- **Acceptance:** byte integrity and deterministic manifest; 100% round-trip of required metadata; restore isolation by project; explicit behavior for revoked/deleted and disputed items; archive size, export/import p50/p95 and cold-open RSS. A format that cannot represent scope/deletion semantics remains archive-only and cannot become canonical memory.
- **Candidate:** Memvid v2.0.140, public Apache-2.0 source pinned to commit `e18fe55494379e2ab7397ce03655e8abbc5e0c31`; selected source subset archived under `docs/upstream-archive/memvid-v2.0.140/`. Verify optional feature/dependency profile before building. Upstream performance claims are not aLandi measurements.
- **Status:** PLANNED / NOT RUN. Source license/blob provenance checked; no dependency/build/runtime adopted.

## EV-RAG-ANYTHING-001 — multimodal document pipeline patterns (planned; source snapshot archived in PR #169)

- **Question:** do typed content blocks, structured multimodal chunks and page/bbox/time provenance improve aLandi's current document pipeline enough to justify selective adaptation?
- **Scope:** evaluate schemas/algorithms first; do not install the full package or all extras into the 8-GB runtime.
- **Fixture:** identical representative PDFs, DOCX, XLSX, Markdown with local images, plus a small legally usable audio/video corpus. Preserve source IDs and expected page/offset/segment references.
- **Metrics:** extraction coverage, table structure accuracy, figure/chart caption grounding, page/bbox and timestamps, citation correctness, audio WER/CER, video segment recall, peak RSS, install footprint and parse latency.
- **Candidate:** RAG-Anything v1.4.1 (MIT code), source commit `0ef67b4d476b66407a03a39e5b17e756fc0aef29`; selected source snapshot archived under `docs/upstream-archive/rag-anything-v1.4.1/`. Its core dependency includes LightRAG and MinerU, while audio/video add faster-whisper, PyAV, SceneDetect, MoviePy, OpenCV and ffmpeg requirements. Audit transitive/model licenses separately.
- **Status:** PLANNED / NOT RUN. Source license/blob provenance checked; no runtime, dependency or model weights installed.


## EV-SEC-003 — Gateway secret non-disclosure

- **Scope:** health/readiness/liveness response redaction, invalid Bearer token non-echo, and bounded/sanitized upstream error body.
- **Fixture:** `gateway/tests/test_app.py` tests use marker secrets for API key, OAuth encryption/client secret and raw upstream error text. `test_upstream_errors_do_not_leak_raw_body_or_configured_secrets` already exists on current branch; invalid Bearer and health-probe redaction tests are ported from the PR #131 security review.
- **Acceptance:** /livez returns only `{status: ok}`; /readyz and legacy /healthz return bounded readiness fields only; responses are `Cache-Control: no-store`; submitted/configured secrets and upstream raw body never appear. Invalid Bearer returns 401 with `WWW-Authenticate: Bearer` and no echo.
- **Status:** tests added to PR #169 branch; Gateway exact-head CI pending. This is regression coverage, not proof of live VPS/provider secret handling.


## EV-AGENT-RUN-STORE-001 — bounded durable run/task state prototype

- **Question:** can a local SQLite store provide idempotent run/task state, explicit transitions, event journal, lease fencing and cancellation without introducing an orchestration framework or model/tool runtime?
- **Scope:** persistence primitives only. The store does not call models, execute tools, grant capabilities, provide sandboxing, scheduler, multi-host coordination, backup/restore or exactly-once external side effects.
- **Fixture:** offline unit tests in `gateway/tests/test_agent_run_store.py` cover idempotency/conflict, scope validation, versioned transitions, task claim/lease expiry/fencing, retry budgets, cancellation, event journal, bounded typed metadata, prompt/secret/free-text rejection, SQLite constraints, concurrency, migration and file permissions.
- **Acceptance:** deterministic exact-head Gateway tests; no unbounded free text or raw prompts/secrets in event metadata; scope fails closed; expired lease cannot complete with stale fencing token; terminal state cannot reopen; SQLite file mode 0600; operational limitations are explicit.
- **Status:** PROTOTYPE in PR #169 candidate, exact-head Gateway CI pending. No API route or worker runtime is wired to the store. Do not mark Agent Workforce implemented from this prototype alone.


## 2026-11-13 — model, retrieval, OCR and voice acceptance gates

| Eval ID | Scope | Required evidence | Status |
|---|---|---|---|
| EV-MODEL-001 | Official Ollama qwen3.5:4b Q4_K_M vs uncensored Qwen3.5-4B Q4_K_M | Exact revisions/hashes; RU/EN/TH golden set; task success, factuality, abstention/refusal quality, tool-call exactness, JSON schema validity, p50/p95, TTFT, peak RSS/PSS, 4K/8K KV cache | SPECIFIED; target host unavailable |
| EV-MODEL-SEC-001 | GGUF chat-template supply chain | Extract template, compare with official Qwen3.5 base, scan for Jinja sandbox escape patterns, test trusted override on pinned runtime; no untrusted template execution | SPECIFIED |
| EV-RAG-EMB-001 | Qwen3-Embedding-0.6B | Recall@5/10/20, MRR/nDCG, language slices RU/EN/TH, mixed-language, exact citation/source retrieval, embed latency and RSS | SPECIFIED |
| EV-RAG-RERANK-001 | Qwen3-Reranker-0.6B | Compare first-stage vs reranked top-k; nDCG/MRR uplift, false promotion of unsupported chunks, p95 and peak RSS | SPECIFIED |
| EV-ASR-001 | Whisper large-v3-turbo vs Qwen3-ASR-0.6B | Same labelled RU/EN/TH corpus; WER/CER, normalization, RTF, p50/p95, peak RSS, cold start, cancellation and silence/no-speech false positives | SPECIFIED |
| EV-TTS-001 | Piper RU/EN voices | Pronunciation/phoneme coverage, intelligibility, MOS/CMOS blind ratings, generation RTF, first-audio latency, CPU/RSS, interruption; exact voice card/license chain | SPECIFIED |
| EV-TTS-TH-001 | Thai local TTS | A production-compatible Thai voice with full base/dataset license chain, tone/segmentation golden set, intelligibility and latency | DEFERRED; no approved voice pinned |
| EV-OCR-001 | Tesseract fast RU/EN/TH | CER, exact field/date/number accuracy, table cell accuracy, reading order, rotated/noisy/scanned PDFs, p50/p95 and RSS | SPECIFIED |
| EV-MODEL-HW-001 | 8-GB target profile | Main model plus OS/gateway, KV-cache growth, helper load/unload, no swap storms, cold/warm p95 and restart/recovery | UNMEASURED; target host not verified |

All model evaluations use the same input fixtures, tool schemas, prompts, runtime version and hardware. Vendor/model-card scores are not aLandi results. No helper is promoted unless it beats the main-only baseline for one bounded role and can be disabled cleanly.
