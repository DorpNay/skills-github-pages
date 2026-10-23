# V-016 / aLandi — implementation checklist and evidence ledger

**Purpose:** one auditable checklist for the 8-section engineering fixation document and all four parts of the V-Final manifesto (sections 0–40), plus the current UI/provider work.  
**Reviewed:** 2026-10-23  
**Branch:** `feat/alandi-cloud-settings-ux` · **PR:** [#21](https://github.com/DorpNay/skills-github-pages/pull/21)  
**Rule:** a checked/audited requirement is not automatically a delivered feature. Statuses below refer to code and tests, not to a design proposal.

## Status key

- **DONE / regression-backed** — implementation exists and a test/assertion covers it; still needs the current complete CI run to finish.
- **IMPLEMENTED / E2E pending** — frontend code exists; the test for this branch is running or not yet confirmed on the final head.
- **PARTIAL** — only the explicitly stated subset exists.
- **PROTOTYPE** — bounded code/contract exists but is not production wired.
- **SPEC ONLY** — design/contract/backlog only.
- **BLOCKED** — do not expose or claim as production until the stated condition is met.
- **REJECTED** — explicitly excluded by project decisions.

## A. Current product/UI implementation checklist

| ID | Requirement | Status / evidence | Remaining gate |
|---|---|---|---|
| UX-01 | Main settings banner is for the user's own aLandi cloud only; no built-in or guessed gateway URL; green only after an actual successful model completion | **IMPLEMENTED / E2E pending** — `#cloudSettingsCard`, `connectAlandiCloud()`, `isUsableProbeResponse()`, initial `disconnected` state, 12-second timeout | No user's live gateway URL/credentials were supplied; real-world green status must remain unverified until user configures the gateway |
| UX-02 | Legacy provider API keys, endpoint/model settings and Tavily are in separate collapsible advanced/search sections | **IMPLEMENTED** — `#legacyProviderSettings`, `#searchToolsSettings` | Verify final Chromium tests |
| UX-03 | Kilo is one alternate entry in the ordinary provider list, not a primary-cloud action or silent fallback | **DONE in source** — `kilo` option and `kilo-auto/free` preset in the common provider configuration; no Kilo action in `#cloudSettingsCard` | Kilo is an explicit external route. Its official docs warn that Auto Free may forward prompts to providers that log/use them for improvement; never use for confidential data ([Kilo Auto Free](https://kilo.ai/docs/getting-started/using-kilo-for-free), [models and providers](https://kilo.ai/docs/gateway/models-and-providers)) |
| UX-04 | Provider connection is single-flight; no stale “connected” indicator after provider/model/key changes | **IMPLEMENTED** — shared `isTestingProviderConnection` lock, state invalidation and bounded probes | Current E2E run must finish green |
| UX-05 | Model-specific failure may try another model from the same provider; 401/403/429/network/transient failures are not treated as model-picking signals | **IMPLEMENTED** — only classified model errors allow the bounded same-provider path | Expand provider-specific contract cases over time |
| UX-06 | Provider models refresh after a deliberate API-key paste; “Paste” is explicit and has a clipboard fallback message | **IMPLEMENTED / regression-backed** — paste helpers and bounded catalog+probe flow | Confirm current Chromium run |
| UX-07 | Grok/xAI connection check accepts common successful completion envelopes rather than treating arbitrary text as model confirmation | **IMPLEMENTED** — completion-envelope parser and actual output probe | Current provider test secrets are not available for live xAI probing; mocks are not live proof |
| UX-08 | Missing aLandi gateway is an actionable error instead of falling into the old Gemini URL | **IMPLEMENTED** — provider-scoped base URL/model defaults and preflight validation | Verify behavior against current CI |
| UX-09 | Cross-provider fallback is opt-in; selecting aLandi never silently forwards its private prompt to another provider | **IMPLEMENTED** in router policy and settings copy | Privacy-only policy is not a complete separate runtime subsystem yet |
| UX-10 | Tavily key is under search-tools settings and pasteable; no-key public search remains available | **IMPLEMENTED** — search tools UI plus Wikipedia/Stack Exchange/GitHub/HN/arXiv/Wayback paths | CORS can still make some public APIs fail; a protected proxy is needed for provider endpoints that disallow browser access |
| UX-11 | aLandi wordmark, concealed “a land i → i land AI” puzzle, analog/digital local clock with snapping hands, home theme toggle | **IMPLEMENTED** in header/clock handlers and styles | Check visual behavior on mobile and reduced-motion settings |
| UX-12 | RU/EN interface switch from the main screen | **PARTIAL** — core labels, placeholders, theme, settings and key messages are translated | Not every legacy help sentence, trace label, provider diagnostic and dynamic assistant-facing message has complete translation coverage |
| UX-13 | Modern font stack supports Latin and Cyrillic without relying on a remote font download | **DONE in source** — native system UI stack with Segoe/Noto Sans/Roboto/Arial fallbacks | Confirm on Windows, Linux and mobile browsers; do not ship font assets without license/provenance |
| UX-14 | New-chat composer is centered; its textarea grows within bounds and transitions toward the bottom after the chat begins/large text appears | **IMPLEMENTED** — `composer-centered`, `composer-bottom-transition`, bounded auto-resize | Validate touch keyboards, landscape and reduced motion in Chromium/mobile tests |
| UX-15 | Text attachment, filename/type/size limits, embedded prompt-injection warning and bounded content size | **PARTIAL** — only .txt/.md/.csv/.json/.log, 128 KiB and 25,000 chars | Not a general document uploader; no PDF/DOCX/XLSX/audio/video ingestion pipeline |
| UX-16 | Hold/click/swipe voice chooser offers intuitive live conversation and voice-message directions | **UI preview only** — gesture/menu works, explicitly says “soon/not connected” | No mic capture, ASR, TTS, audio transport, AEC or playback runtime is connected; keep this status honest |
| UX-17 | Projects: create, rename/edit instructions, link/move/detach a chat, opt-in project memory, add/delete project facts, export/import a JSON project bundle | **IMPLEMENTED / E2E pending** — browser-local project registry and chat `projectId` | LocalStorage is not encrypted or multi-user storage; no project source index, goals, history/audit API or server-backed sync |
| UX-18 | Memory scope: project facts are inserted only when this chat belongs to the project and the chat-level toggle is on; global memory requires an explicit opt-in | **IMPLEMENTED in prompt assembly** — `chat.projectMemoryEnabled`, `STORAGE.globalMemoryEnabled` | E2E boundary assertions must pass; the separate SQLite memory graph is not yet the frontend storage backend |
| UX-19 | Project deletion removes its linked chats while preserving other projects; imports are capped and normalized | **IMPLEMENTED / E2E pending** | The browser test added to this PR must confirm deletion/export/import behavior |
| UX-20 | Instructions inside the app become shorter and clearer without hiding privacy/model constraints | **PARTIAL** — provider help and default system prompt are compacted; key/privacy caveats remain visible | Audit all legacy microcopy and translation keys after the main E2E pass |

## B. 81-item audit of the fixation document and four-part manifesto

The following items cover the initial fixation document plus manifesto sections 0–40. Statuses are about this repository, not about intended future architecture.

| # | Manifest requirement | Current status / proof point | Action needed / acceptance gate |
|---:|---|---|---|
| 1 | Reconciled state hash from sorted artifact paths + individual SHA-256 values (`AI-STATE-001b`) | **SPEC ONLY / needs confirmation** | Implement `manifest_state.py`; test ignored paths and deterministic output across machines |
| 2 | INTEL triad: verified upstream URL + exact artifact license + evidence/claim source | **PARTIAL** — provenance manifest and CI prototype exist | CI must reject every `accepted` artifact without all required fields; no placeholder/TBD hashes treated as shippable |
| 3 | LOOP, DECISIONS, EVALS and ownership/reversal cost for every decision | **SPEC / governance docs present** | Run a completeness sweep across all four registers; missing metric/baseline means no production claim |
| 4 | Tier0/Tier1 latency budgets with margin and correct p95 aggregation | **SPEC ONLY / unmeasured** — `docs/LATENCY_CONTRACT.md` explicitly says targets are not benchmark results | Add `latency/budget_v2.yaml`, capture end-to-end distributions on target hardware; do not sum stage p95s as if they were e2e p95 |
| 5 | Router inputs: intent confidence, context cost, budget remaining and risk class | **PARTIAL** — existing frontend has fast/deep routing and bounded tools; no fully validated four-input gateway policy | Add typed policy module and tests for destructive actions, privacy and escalation outside Tier1 SLA |
| 6 | Route regret ratio ≤1.25 backed by oracle-labelled tasks | **SPEC ONLY** | Build labelled set (~200 cases in manifest), measure regret ratio and enforce kill criteria |
| 7 | ALBF v1 binary audio frames (magic/version/type/flags/stream/seq/timestamp/length/CRC) and 256 KiB cap | **BLOCKED / not in live voice path** | Implement parser/writer with fragmentation, truncation, bad CRC, overflow and interrupt tests; never base64-encode live audio frames |
| 8 | Cloudflare Tunnel/R2 signed artifact manifests as delivery plane | **SPEC ONLY / no infra deployed** | Keep separate from user voice hotpath; provisioning needs account/domain credentials and a verified signed manifest |
| 9 | Native Rust/PyO3/ONNX audio capture/inference; Python receives bounded metadata, not raw PCM | **BLOCKED** — `native_core_interface.py` is an interface only | Native adapter, model hash/license and reproducible target-hardware tests are required |
| 10 | Voice engines: Vosk RU, Moonshine EN, optional Parakeet cold tier; Piper/Kokoro TTS | **CONDITIONAL / not shipped** | Verify exact artifact/weight/voice licenses and hashes; no automatic install or commercial-use claim without voice-specific approval |
| 11 | p95 budgets, RTF, PSS measurement and heavyweight model eviction | **PARTIAL contract only** — hardware profile is target-only; no 8 GB reference benchmark | Add benchmark runner, PSS sampling and model lifecycle tests on 4-core/8 GB host |
| 12 | Caveman-style concise output as measured perceived-latency optimisation | **SPEC / no measured feature** | A/B against baseline for answer completeness and TTS duration; never remove factual/legal safety detail |
| 13 | Local-first privacy and no silent cloud ASR/TTS fallback | **POLICY / partially enforced in UI routing** | Add explicit privacy-only/local-only router guard that fails closed, test offline/network failure and verify no external calls |
| 14 | Context OS: lexical + dense retrieval, RRF, optional reranking behind measured threshold | **PARTIAL** — FTS5/lexical graph baseline exists; full hybrid dense flow is not established | Measure Recall@k/lift and CPU p95 before adding embeddings/reranker |
| 15 | Typed memory graph, provenance, valid-time/recorded-time and conflict/supersede edges | **PROTOTYPE** — SQLite schema, scope, temporal and conflict modules exist | Wire into application APIs; validate conflict preservation and bitemporal queries |
| 16 | Protected decisions/safety memory is never automatically expired or blindly summarized | **POLICY / partial** | Persist protected type enforcement in deletion/compaction code; tests must prove it |
| 17 | SQLCipher/OS keyring and crypto-erasure SLA ≤60 seconds | **BLOCKED for frontend memory; backend primitives incomplete** | Implement a tested key-management policy, hard-delete workflow, secure-delete/vacuum or key rotation, and distinguish logical deletion from physical erasure |
| 18 | cPocket transactional resource leases; idempotent rollback on timeout/cancel/barge-in | **PROTOTYPE** — `gateway/voice/cpocket.py` | Lock/TTL/cancellation race tests; prove all handles/tasks cleaned, including cleanup exceptions |
| 19 | Read-only speculative branch with acceptance-rate/net-speedup kill thresholds | **PROTOTYPE** — buffered transaction interface | Add controlled baseline/acceptance benchmarks; no speculative write tool may run and no audio is played before final compatible ASR |
| 20 | Two-tier intent router and barge-in/self-echo handling | **POLICY prototype only** | Implement native VAD/AEC integration; a policy helper is not an acoustic echo canceller |
| 21 | Dynamic 64-role catalog / progressive disclosure, not 64 independent model processes | **PARTIAL** — roles documented; task skills exist | Add structured role registry, bounded selection/budget/stop conditions; don't market sequential prompts as independent agents |
| 22 | Read-only DAG orchestration, typed tools, cancellation, timeout and failure propagation | **PROTOTYPE** — bounded DAG and validator modules exist, no default tools registered | Add topological/cycle/missing-dependency tests and integrate only after approval/permissions are enforced |
| 23 | Real CLI/browser sandbox (container/user namespaces/seccomp/Landlock, isolated profile, allowlist) | **BLOCKED** — explicitly no production sandbox | Never expose `subprocess.run` as a sandbox; require adversarial escape tests and isolated browser profile before enabling |
| 24 | Browser harness policy-before-code, allowlisted origins, credential broker, confirmation before side effects | **SPEC ONLY** | Implement separate-origin credential broker and browser isolation; never use a user's normal browser profile/cookies |
| 25 | Cold-tier Vision/Video/Audio workers and model lifecycle on 8 GB | **SPEC / not shipped** | Implement single-worker eviction, bounded input, timeouts/cancellation, model hash/license checks and memory tests |
| 26 | Observability trace IDs, event schema, honest timeline; optional OTel and simple forecasting | **PARTIAL** — `trace_context.py` integrated; event schema exists; OTel disabled/not wired; timeline UI deferred | Only expose actual tool events/timings/errors. Do not show hidden reasoning or invented events |
| 27 | Impeccable visual lint (including notice/attribution) as a CI gate | **NOT IMPLEMENTED as required gate** | Verify upstream and license; add NOTICE and run against local preview only after dependable setup |
| 28 | Technology CUT decisions: no unsafe avatar/licensing, n8n MCP fair-code, GPU-only DeepInfer, fake repos, non-commercial TimesFM v3, etc. | **DOCUMENTED decisions** | Keep the “cut” ledger and add a CI check for accidental package/feature reintroduction where feasible |
| 29 | Exact cache layering: UI state separate from exact server cache and per-session runtime KV cache | **PARTIAL / current cache contracts exist** | Explicitly audit every cache boundary; never cache errors, partial streams, tool calls or dynamic web research |
| 30 | Exact-match SHA-256 key includes prompts, params, model and endpoint; prompt/tool schema changes invalidate entries | **PARTIAL** — exact cache key and dynamic-cache bypass exist | Add explicit versioned system prompt/project instruction/tool-schema invalidation tests |
| 31 | No silent provider fallback, no error masking, privacy-only blocks external routing | **PARTIAL / substantially implemented** — fallback is opt-in; errors propagate; model-only retry is bounded | Add a first-class privacy-only policy and tests showing 401/429/500 never appear as success |
| 32 | Fixed instruction priority stack: safety > workspace > project > profile > current user | **PARTIAL** — project instructions are framed as user preferences under existing system prompt | Implement a formal prompt composer with explicit layers and adversarial injection tests |
| 33 | Deep Research as cancellable 12-step finite-state machine with gap search, conflict report and citation validation | **PARTIAL** — multi-stage researcher/critic/synthesis and a truthful trace exist | Implement explicit states/transitions/cancellation and re-search-on-critical-gap semantics |
| 34 | Citation validator removes unsupported claims and preserves conflicting sources | **PARTIAL / prototypes exist** — source URL/evidence trace and citation primitives | Bind claims to source hashes/offsets and test that invalid citations are removed, not merely URL-shaped |
| 35 | Learning loop: atomic candidate lesson → golden regression → approval → versioned skill/policy → rollback; no auto-weight training | **SPEC / governance only** | Implement candidate lesson store, regression runner and promotion/rollback with human review |
| 36 | Scratch-file offload for tool/model output >8,000 chars and bounded subagent summaries | **NOT IMPLEMENTED** | Add temp artifacts with scope/TTL/cleanup and a bounded `read_file_chunk` API; enforce summary schema and token limit |
| 37 | Qwen hybrid attention positioning, if using such a model architecture | **CONDITIONAL / no verified Qwen-specific pipeline** | Implement only after model architecture is confirmed; do not claim general “first/last token” positioning is sufficient without eval |
| 38 | Multilingual OCR benchmark (RU/EN/Thai where supported), tables, financial values, injection documents, page+bbox provenance | **NOT IMPLEMENTED** | Create versioned corpus, CER/WER/exact numeric match/table/order/citation/injection metrics and select only by measured results |
| 39 | Final DoD: cross-project isolation, deletion propagation, privacy, honest timeline, hard RAM cap, provenance UI | **PARTIAL** — project isolation is being added to E2E; other maturity gates remain open | Every item needs a concrete automated test/measurement, not a sentence in docs |
| 40 | Project CRUD, project instructions, chat move/detach, project bundle import/export, memory toggles | **IMPLEMENTED in static client / E2E pending** | Current E2E test must prove isolation and deletion; server-backed sources/audit history/user profile remain undone |
| 41 | Complete document intake: MIME/size/timeout validation, text/tables/formulas/images, provenance-preserving chunks and index | **PARTIAL** — bounded plain-text attachment only; backend RAG primitives exist | Secure ingest API, parser adapters, metadata/provenance, source UI, reindex/delete flow required |
| 42 | Google Drive OAuth + PKCE, minimum read-only scopes, encrypted tokens, Picker, sync/revoke and cleanup | **PARTIAL backend contract/primitive only** | Add Picker and authenticated source UI; prove token encryption, revocation and index deletion; no refresh tokens in browser storage |
| 43 | Memory graph node/edge vocabulary, candidate→confirmed/disputed/superseded/rejected lifecycle and review | **PROTOTYPE** — schema/temporal/conflict primitives exist | Wire extraction and user review/edit/export; no hidden chain-of-thought in memory |
| 44 | Eight mandatory memory tests: cross-project, empty working memory, global opt-in, conflict, expiration, deletion propagation, private sources, document injection | **PARTIAL** — new frontend cross-project E2E is added; full graph test matrix not complete | Add/run named unit tests against backend graph and indexes |
| 45 | All 64 roles mapped to 8+11+9+12+9+10+5 categories; fast/deep/complex workflow budgets | **DOCUMENTED catalog** | Add route-selection evals, max_steps/deadline/cancel/stop condition tests, and independent completion verification |
| 46 | Broad test groups: app regression, project/memory, RAG/documents, agent execution, safety and performance | **PARTIAL** — existing Playwright, gateway and quality CI exist | Add golden sets, adversarial security suite, property tests, soak/PSS and repeatable metrics |
| 47 | P0 source of truth/baseline, screenshots, golden sets and retention policy | **PARTIAL** — governance files and current Pages baseline exist; target gateway/hardware baseline missing | Record screenshots, baseline hashes, golden corpus hashes and retention decisions |
| 48 | P1 project & profile personalization | **PARTIAL** — project instructions/scope implemented; complete user profile/preferences and source list not implemented | Add profile fields and source list with tests without bloating the system prompt |
| 49 | P2 structured memory graph production wiring | **PROTOTYPE** | Move frontend project memory to an authenticated backend only with a migration/backup strategy; add deletion propagation |
| 50 | P3 RAG, exact citations, evidence ledger, benchmarks | **PARTIAL** — FTS5 + lexical graph/evidence primitives exist | API exposure, upload/parse pipeline, source links with page/offset/hash, benchmark before dense embeddings |
| 51 | P4 bounded router/agent timeline/verification/metrics | **PARTIAL** — direct vs deep/research decisions and trace exist | Enforce global tool budget and risk policy; timeline needs factual tool events, no guessed model-thought states |
| 52 | P5 learning loop & rollback | **SPEC ONLY** | Candidate lessons and policies require golden-set evaluation, human review, versioning and rollback |
| 53 | P6 browser & coding lab | **BLOCKED** | Real sandbox, isolated worktree/browser and explicit side-effect approval are prerequisites |
| 54 | P7 OCR/ASR/image/video/TTS workers | **BLOCKED/CONDITIONAL** | Every worker requires exact artifact/license/hash, memory limits, eval report and actual pipeline tests |
| 55 | P8 external connectors | **PARTIAL** — OAuth foundations exist; Drive UI/Picker and other connector sync incomplete | Add connectors one by one only when authorization, disconnect and deletion propagation are covered |
| 56 | Technology registry: accept/reject by evidence, avoid adding popular dependencies without bake-off | **PARTIAL / documented** in INTEL and accepted-improvements registry | Add verified URL, exact license, claim source, benchmark and rollback for each new artifact |
| 57 | Dynamic skills and progressive disclosure, preserve current design | **PARTIAL** — task skill loader and compact UI are present | Structured role/skill registry and budget-aware ranking need golden-set tests |
| 58 | Gateway base path, auth/CORS/body/context/concurrency/cache/SSE error semantics | **IMPLEMENTED at source/prototype level** — `gateway/app.py` is present | Current VPS is not verified. Keep live deployment distinct from source-level tests |
| 59 | Image generation and video pipeline (distinct retrieval/generation/renderer stages) | **NOT IMPLEMENTED as a complete product pipeline** | Do not imply chat attachments equal image/video generation; design tool schemas, limits and licenses |
| 60 | ASR/audio safety: no remote audio leakage, bounded frames/queues, injection defense and cancellation | **POLICY ONLY / no live audio pipeline** | Apply at native capture and transport layers; test real frames, buffer overrun and privacy conditions |
| 61 | Eval multiplication: baseline cache, shadow mode, canary, speculative evaluation, property-based tests | **PARTIAL / most advanced eval modes absent** | Prioritize deterministic tests and measured bake-off; no experiment is accepted without a baseline |
| 62 | INTEL navigation/session bootstrap and RAG-technique map | **DOCUMENTED in source-of-truth files** | Keep onboarding path short and verify links; do not equate the map with implemented algorithms |
| 63 | Three-layer agent memory (working/project/global/procedural/evidence) | **PARTIAL** — frontend project/global opt-ins and backend graph prototypes exist | Procedural/evidence stores and server-side isolation not yet fully wired end-to-end |
| 64 | Context engineering: compress, retrieve, offload, isolate; preserve evidence links | **PARTIAL** — relevance-ranked memory and model-aware history truncation exist | Scratch-file offload and bounded subagent-return contract remain missing |
| 65 | MCP, multi-agent RAG, database choices and integrations | **SPEC / pattern-level** | Do not add an MCP service/connector unless schema, permission and license review passes |
| 66 | OCR candidate list and exact multilingual comparison, rather than popularity-based selection | **SPEC ONLY** | Candidate list is not approval; benchmark first, record hashes/licences for each model |
| 67 | ASR/TTS candidate list, voice licensing matrix and model lifecycle | **CONDITIONAL** — `language_matrix_v2.yaml` candidate statuses; no voice shipped | Exact voice/model card, hash, distribution/commercial rights and target runtime benchmark required |
| 68 | Full SSRF controls: every DNS answer, loopback/private/link-local/metadata range and safe redirect | **PARTIAL helper only** — no arbitrary public-fetch endpoint is authorized | Verify DNS rebinding resistance and pin resolved IP through connect/TLS; tests must cover IPv4/IPv6 and redirects |
| 69 | OAuth PKCE state/verifier, server-side refresh token encryption, revoke | **PARTIAL backend primitive** | Validate real provider callback lifecycle and token-at-rest implementation; no secrets in localStorage/logs |
| 70 | MIME allowlist, archive depth, cleanup and extraction/time limits | **PARTIAL** — plain-text attachment has an extension/size guard | Validate MIME/content signatures in server ingestion before adding binary formats |
| 71 | LOOP WIP limits, kill rules, Eureka clause, stuck protocol and anti-patterns | **SPEC / governance** | Enforce WIP in the work log and stop experiments with no baseline/evidence; record reversal cost |
| 72 | Definition of Done by maturity: Core, Memory/Projects, Knowledge, Agent Teams, Multimodal, Transparency | **NOT YET MET for complete product** | Keep maturity levels separately scored; don't let project UI completion imply gateway/voice/RAG is production-ready |
| 73 | Method: audit → hypothesis → probe → minimal patch → independent review → tests/benchmark → CI/E2E → merge → post-merge verification | **ACTIVE workflow** | Current PR #21 must finish E2E and pass fresh CI before merge; then verify published Pages |
| 74 | 20-item final checklist in manifesto §39, including WIP/kill/eval multiplier/technology registry | **AUDITED; most items remain partially satisfied** | Treat each check as a separate acceptance gate, not a general “all good” checkbox |
| 75 | UI lint, multilingual typography and accessibility | **PARTIAL** — system-font fallbacks, focus states, reduced-motion controls exist | Impeccable lint not installed; run contrast/keyboard/mobile/RTL where applicable before calling design complete |
| 76 | Exact route telemetry and factual research trace (not chain-of-thought) | **PARTIAL** — per-attempt route trace and research trace are in the client | Event schema/API-wide timeline and source provenance still need integration; don't display imagined stages |
| 77 | License gates for engine, model weights, voices, phonemizer, corpora and notices | **PARTIAL** — provenance manifest/gate prototype | No ship without exact file hash and artifact-specific license; model-family license alone is insufficient |
| 78 | Target hardware profile `laptop_8gb_cpu_mvp` and optional ARM 24 GB upgrade | **SPEC ONLY / unmeasured**; upgrade doc says no VM created | Keep 8 GB CPU-only as target profile; no VM/DNS change without credentials/approval |
| 79 | Manifest, latency, router, binary frames, hard-delete and Impeccable gates from the initial v8 execution plan | **NOT COMPLETE** — these are not proven live simply because later contracts mention them | Track each path and required test/measurement in the source-of-truth; implement in ordered phases |
| 80 | API-provider catalog, real connection diagnosis, explicit key/paste controls and public web tools | **IMPLEMENTED / regression-backed**, with live-provider secrets unavailable in CI | Run live probe for each configured provider in a controlled session; preserve provider-specific errors and avoid model-specific fake success |
| 81 | Merge, deployment, post-merge browser check and updated project state/volley log | **PENDING** | Merge only after current Actions finish green; then verify the exact main SHA and published URL, update this ledger, PROJECT_STATE, ACCEPTED_IMPROVEMENTS and VOLLEY_LOG |

## C. Current execution To Do — ordered and checked each session

### P0 — finish the current PR safely
- [ ] Confirm latest PR head includes UI, project, quality-sentinel and E2E test updates.
- [ ] Get all Independent Quality Sentinels jobs green on that exact head.
- [ ] Get Chromium E2E green, including the new project scope/export/deletion cases.
- [ ] Review changed-file diff for accidental auth, key, route or scope regressions.
- [ ] Update PR #21 description to state that Kilo is only an ordinary alternate provider and that project support is browser-local.
- [ ] Merge only if the complete current run is green and mergeable.
- [ ] Verify main SHA and deployed GitHub Pages output after merge; do not claim the gateway is live.

### P1 — required next implementation slices
- [ ] Add automated two-project isolation, deletion propagation, global opt-in and export/import tests against the backend memory graph.
- [ ] Add a formal safety-first prompt composer (safety/workspace/project/profile/user), with prompt-injection regression tests.
- [ ] Add a privacy-only/local-only routing policy that blocks remote APIs and makes refusal explicit.
- [ ] Add route/router error tests for Grok/xAI, Kilo keyless route, 401/403/429/5xx, CORS failures, abort and malformed bodies.
- [ ] Complete RU/EN translation of settings help, errors, traces, project controls and all interactive labels.
- [ ] Audit keyboard navigation, contrast, mobile composer movement, safe-area and reduced-motion support.

### P2 — V-016 engineering blockers; do not advertise as production
- [ ] Implement and test deterministic artifact-manifest hashing + complete INTEL triad gate.
- [ ] Implement typed risk-aware router and route-regret evaluation corpus.
- [ ] Implement ALBF binary framing with CRC/truncation/overflow/interrupt tests.
- [ ] Implement native audio capture/inference adapters and measure e2e p50/p95 + PSS on the target 8 GB CPU host.
- [ ] Resolve every model/voice license/hash before packaging any weights.
- [ ] Harden cPocket rollback/TTL/cancellation races; do not enable speculative side-effect tools.
- [ ] Add crypto-erasure semantics and prove logical vs physical deletion guarantees.
- [ ] Add scratch-file offload, secure document ingestion, exact page/offset/hash citations and retrieval benchmarks.
- [ ] Keep CLI/browser runtime blocked until real sandbox/SSRF/approval escape tests pass.
- [ ] Implement 12-state research workflow and claim-to-evidence citation validation.
- [ ] Implement candidate-lessons pipeline with golden tests and rollback; no automatic weight training.
- [ ] Implement optional connectors only after encrypted token storage, scope review, revoke and index cleanup.
- [ ] Keep infrastructure and hardware targets as documentation until the required access and measurement environment exist.

## D. Merge and deployment truth

- Static UI features in this checklist may be shipped through GitHub Pages; that does **not** deploy a gateway, native runtime, model, audio backend or database service.
- Kilo Auto Free is a free external route, not a private/local route. The current upstream model mapping can change server-side; the user must choose it explicitly and must not send confidential data. Official docs: [Kilo Gateway API](https://kilo.ai/docs/gateway/api-reference), [Auto Free data handling and limits](https://kilo.ai/docs/gateway/models-and-providers).
- Current browser/CI mocks prove integration behavior only. Live provider/gateway success must be established by a real request to the user's configured endpoint.
- Latency, OCR/ASR/TTS quality, memory usage and sandbox safety remain **unmeasured/not proven** until their named target-specific reports and adversarial tests exist.
