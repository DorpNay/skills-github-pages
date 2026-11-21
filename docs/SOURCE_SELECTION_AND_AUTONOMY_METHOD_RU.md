> **Historical research/spec snapshot — imported 2026-11-08.** Main baseline is `c4f23e03f563d03213eb87002863da630fc8b833`. Preserve original findings/source context; runtime implementation is not inferred. Canonical active task register: `docs/MASTER_TASK_REGISTRY_RU.md` plus its addendum. Source intake/review status: `INTEL.md`.
> **Current boundary:** Use this as a source-admission and autonomy method. The current canonical source register is INTEL.md; candidate intake is not adoption. Owner-directed policy: main-only, one active writer/PR, exact-head CI, merge immediately after all required gates pass, and record every material step in VOLLEY_LOG.

---

# aLandi — методика отбора источников, автономности и интеграции функций

**Status:** SPECIFIED; workflow and acceptance contract, not implementation proof.  
**Date:** 2026-11-06  
**Canonical task register:** docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md, section H (SRC/AUT/UI/DELIVERY).

## Objective

Convert a portfolio of 200+ owner-requested sources into a traceable capability roadmap and aLandi implementations that are useful, secure, resource-fit, integrated into the site and testable offline. Avoid one-off demos, duplicate subsystems, vague source notes and unverified “implemented” claims.

## Single source register

Baseline: INTEL.md on main blob SHA 6c1d96604ccb068eb086f83831f08e6c8c0b024c originally contained 257 consolidated-table URLs plus 18 narrative-only URLs (275 source records). The 2026-11-06 review adds stable IDs EXT-001–EXT-275 and two canonical alias-resolution targets (277 distinct URL strings in the updated file), and records 228 preliminary repo/model/site roots (143 GitHub repos, 16 Hugging Face models, 69 other host roots). These are not a confirmed count of unique projects; host roots can group unrelated pages.

Each source record must retain the owner's original mention and include:
- stable source ID; exact canonical URL and repository/project identity; aliases and ambiguity flag;
- source provenance (owner list, Project source, repo document, prior audit); category and capability tags;
- exact revision/tag/commit and date reviewed; relevant official docs/API links;
- license and notices for code, dependencies, model weights, tokenizer, datasets, voices and generated artifacts separately;
- disposition: ACCEPT-DEEP-DIVE / RESERVE / CLARIFY / DEFER / REJECT / DUPLICATE / REFERENCE-ONLY;
- score and rubric evidence; capability gap and aLandi task links;
- smallest integration seam, artifact requirements and acquisition decision;
- maturity/evidence level, network behavior, telemetry, security/privacy/resource risks;
- next action, responsible workstream, acceptance criteria and rollback.

Do not infer that two similar names are the same project. Resolve canonical identity from upstream; if uncertain, record CLARIFY and preserve the exact user-provided spelling. Deduplicate records by canonical upstream, cross-link aliases and do not erase provenance.

## Three-pass selection funnel

### Pass 0 — normalize and resolve (all sources)

1. Capture all source names from owner lists, attachments, Project materials and canonical source indexes.
2. Resolve official repository/site, aliases, forks, renamed/deleted projects and exact identity.
3. Normalize category tags (orchestration, memory/RAG, inference, ASR/TTS, media, conversion, UI/UX, agent skills, evals, dev tooling, security, autonomy).
4. Identify duplicates and existing aLandi equivalents; preserve unresolved entries rather than guessing.

### Pass 1 — fast screening (all resolved sources)

Inspect only sufficient high-signal primary material: README/official docs, license files, release/version and maintenance, architecture, dependency/build footprint, interfaces, model/artifact requirements, test/eval evidence, data/network behavior. Record concise facts and one disposition.

Score 0–5 with evidence for each implementable candidate identity (not for every URL alias). Normative standards, protocol specifications, research papers, benchmark suites, catalogues and design guides that are retained only as references receive REFERENCE-ONLY with score N/A; score the implementation candidate separately. Multiple URLs resolving to one upstream share one candidate score while preserving each URL's provenance and alias mapping.

Score 0–5 with evidence for each:

| Criterion | Weight | 5 means |
|---|---:|---|
| Capability gap / relevance | 25 | Closes a documented high-priority aLandi gap |
| Expected useful functionality | 20 | Meaningful user capability, not a novelty or duplicate |
| Offline/autonomy fit | 15 | Works local-first; outbound dependencies are explicit and avoidable |
| Integration fit | 15 | Reuses accepted stack/contracts with a small reversible seam |
| Maturity / test evidence | 10 | Maintained, clear APIs, reproducible tests/evals |
| License / provenance clarity | 10 | Compatible, clear and independently verifiable artifacts |
| Target hardware/resource fit | 5 | Fits measured host budgets or has a viable profile |

Weighted score = sum(score / 5 × weight), maximum 100. Thresholds: **≥75 deep-dive shortlist; 60–74 reserve/clarify; <60 defer** unless owner marks a critical need. These are queue thresholds, not adoption decisions. Ensure coverage across critical capability categories; rank alone must not starve a category.

### Hard gates (non-compensatory)

A high score cannot compensate for:
- unknown/incompatible license or terms for code/model/data that aLandi would redistribute or run;
- provenance/checksum/revision absent for a preserved artifact;
- security/privacy risk without a mitigatable design;
- undeclared outbound traffic, telemetry, data upload or remote execution for a local-only feature;
- incompatible architecture, hardware/resource limits or maintenance burden without a bounded plan;
- no meaningful user capability or redundant system with no measured benefit.

Such cases become CLARIFY, DEFER or REJECT with a reason. Study/reference-only can still be retained when useful; it is not runtime adoption.

### Pass 2 — deep technical audit (shortlist and critical-gap candidates)

Read exact upstream architecture/API/source/tests and release history. Produce a dossier:
1. What it does, does not do, and what aLandi gap it closes.
2. Exact upstream revision; relevant APIs/protocols; license/notice and maintenance.
3. Code vs model/data/tokenizer/voice license and provenance matrix.
4. Dependency/build graph, binary/artifact size, install/update method, checksum.
5. Local/offline behavior, network endpoints, telemetry, auth, data handling.
6. Security boundaries, threat model, untrusted input, execution/sandbox and failure paths.
7. Quality benchmark/evals, reproduce the smallest valuable test, compare against aLandi baseline.
8. Hardware RAM/PSS/VRAM, disk, cold start, TTFT, p50/p95, throughput/concurrency and cancellation where applicable.
9. Integration seam, adapter/API contracts, data schema, migration and rollback.
10. Site IA: navigation location, configuration/control surfaces, permissions, budgets, status, outputs, accessibility and RU/EN behavior.
11. Decision: adopt a bounded slice / pilot / reference-only / defer / reject; explicit owner approval gates.

External upstream benchmark claims are hypotheses until reproduced on aLandi golden set/target hardware. Code license alone does not clear model weights or datasets.

## From candidate to durable feature

A feature advances through explicit maturity:
- SOURCE-TRIAGED — normalized and quick screened;
- DEEP-REVIEWED — dossier and hard gates evidence complete;
- SPECIFIED — interface, security, offline/network contract, UI placement and acceptance defined;
- PILOT — narrow prototype isolated, testable and reversible;
- IMPLEMENTED — real functionality and controls in aLandi code;
- VERIFIED — exact-HEAD checks/evals pass, resource/network behavior recorded;
- ACCEPTED — owner approves promotion;
- DEPLOYED — separately verified on actual deployment target.

Do not collapse these states. A UI card, document, build or CI pass alone is not proof of end-to-end runtime capability.

Each implementation is a vertical slice: real backing behavior + existing site navigation placement + settings/permission/data scope + progress and cancellation + errors/retry/rollback + responsive keyboard accessible UI + tests + docs + provenance. Remove or label nonfunctional controls; do not leave disconnected “future feature” surfaces.

## Autonomy and outbound network assurance

Define two planes:
- **Product runtime:** browser app, gateway, local inference, local storage/RAG/conversion/tools.
- **Build/test acquisition:** GitHub runners, OS packages, Node/Python package registry, Playwright browser/system dependencies, published-site smoke and source/model downloads.

A build runner fetching Ubuntu system libraries or Playwright Chromium is **build/test traffic**, not proof that the deployed aLandi product calls those endpoints. Conversely, product traffic to CDN fonts/scripts, telemetry, provider APIs, OAuth, remote research or model downloads must be identified separately.

For every outbound request record: feature; origin/domain; call site; trigger; payload/data class; required/optional; user control/approval; timeout/limit; offline behavior; test; allowlist/exception. Local-only features default to deny unexpected egress.

Required tests:
- browser request interception and network log with default-deny unexpected domains for local-only feature scenarios;
- local static app and local gateway acceptance with internet disconnected after artifacts are installed;
- positive allowlist tests for explicitly online functions (external research, selected provider/API, OAuth, update/download) with consent and payload minimization;
- graceful failure for blocked endpoints, missing model/assets and cache miss;
- source/artifact hashes and reproducible build/runtime manifest.

## Chromium CI: current baseline and improvement target

The inspected main workflow .github/workflows/quality-sentinels.yml uses runs-on: ubuntu-latest; installs pinned Playwright Test @playwright/test 1.64.1; then executes npx playwright install --with-deps chromium. This downloads browser and OS-level dependencies in the GitHub-hosted runner. The same job also intentionally requests the published GitHub Pages site for smoke testing on PR/main events.

Preliminary static scan of main index.md at SHA 67c3f001b5c7d6e8f64c0977e176523ce6a0566c also found external script references for Tailwind, marked and DOMPurify, plus lazy Pyodide loading from cdn.jsdelivr.net; several direct provider/research endpoints exist behind selected online features. Static reference presence does not establish whether a request happens on every startup, what data leaves, or whether the path can be disabled. These require Playwright network trace and function-by-function audit. This is not automatically an app-runtime egress defect. It is, however, a repeatable CI bootstrap dependency and potentially slow/costly. Playwright official guidance recommends a Docker image or installation of dependencies, and explicitly cautions that browser caching is generally not worthwhile under Linux because OS dependencies are not cacheable. Official Playwright CI docs (https://playwright.dev/docs/ci) say browser-binary caching is not recommended by default because restore time is comparable to download time and Linux OS dependencies are not cacheable; they recommend using a Docker image or installing dependencies. Browser docs (https://playwright.dev/docs/browsers) also note the browser binaries are version-coupled to Playwright and support hermetic install paths. Evaluate (do not change blindly):
- pinned Playwright Docker image with matching version and preinstalled Chromium + Linux libs, pinned by digest;
- only consider browser-cache as a measured fallback keyed to exact Playwright version, while OS dependencies remain separately provisioned;
- pinned self-hosted runner only if secrets/isolation/maintenance are acceptable;
- separate online published-site smoke from offline built-app tests;
- keep workflow actions immutable SHA-pinned and retain reproducible versions.

Acceptance: fresh runner or documented local runner can execute deterministic browser checks; offline app tests do not require external product requests; cache misses fail clearly; CI bootstrap network requirements and product network requirements are separately documented. Static scan is an initial evidence snapshot at main SHA 8e7d4aafe4b9580e9f8978c6f888e35f3fa99242 (index.md blob 67c3f001b5c7d6e8f64c0977e176523ce6a0566c); browser-level outbound audit remains OPEN.

## Artifact acquisition policy

Acquire broadly only after decision and gates:
- download complete source for an accepted upstream when source inspection, reproducible build or local patching is actually needed and license permits;
- preserve selected model/tokenizer/voice/data artifacts only when golden-eval value, hardware fit, storage and license support it;
- keep source snapshots and binaries outside app runtime path unless selected; avoid embedding huge model weights in Git;
- retain exact revision, SHA-256, upstream URL, license/notice, size, acquisition date, dependencies, intended use, update and rollback;
- no auto-install/activation, telemetry opt-in, external sync or deployment solely because an artifact was downloaded.

“Collect everything” is implemented as exhaustive **inventory and provenance**, not blind bulk-download. This keeps the project autonomous without importing unknown, oversized, incompatible or legally unclear software.

## Source and feature review cadence

1. Census and Pass 0 across entire portfolio.
2. Fast Pass 1 batches grouped by capability; maintain category coverage and no duplicate reviews.
3. Deep dive a small batch (e.g. 5–10 sources) selected by weighted score and active project gaps.
4. For every accepted source, open/update existing task IDs first; produce dossier/eval and implement a bounded vertical slice when authorized.
5. Reconcile triage → INTEL → technique/decision → master task register; do not create parallel lists.
6. Verify exact HEAD, test failure modes and network boundary; update maturity, state and next action.
7. Repeat, keeping the current PR/UI work and owner-controlled release gates in parallel without mixing unrelated code scopes.

## Immediate work order

1. Complete source census and normalization of the full >200 owner portfolio.
2. Establish fast-screen score and capability/category map; identify top priorities + critical missing coverage.
3. Audit local/offline network traffic in existing aLandi code and CI, beginning with Chromium/Playwright bootstrap and CDN/telemetry review.
4. Select the first 5–10 deep dives based on source score and documented gaps.
5. Start with a capability that has a high gap score, a small adapter seam, offline-ready artifacts and an integrated site surface; complete it to VERIFIED before expanding.


## 2026-11-06 — portfolio review result

**SOURCE-TRIAGED (Pass 0 + Pass 1):** 275 source records reconciled from INTEL.md (257 original inventory entries plus 18 previously prose-only references). Stable IDs EXT-001–EXT-275 are assigned in the register; two canonical alias-resolution targets bring the updated document to 277 distinct URL strings. Preliminary grouping gives 228 repository/model/site roots: 143 GitHub repo roots, 16 Hugging Face model roots and 69 other host roots. These roots are not a unique-project count. 274 textual/source pages were inspected; one binary Vosk archive was checked against the official catalogue but not downloaded or hashed.

**Identity corrections recorded:** Piper voice-list path; stale sherpa T-one documentation path; Magentic-One shortlink; moved OpenTelemetry GenAI semantic-conventions repo; Invariant Labs MCP-Scan current Snyk Agent Scan upstream. License verification includes T-one code + converted model Apache-2.0, GigaAM model MIT, OpenViking AGPL-3.0, Claudex Loop LICENSE MIT with third-party notices, and separate model/voice terms for ASR/TTS.

**Pass 2:** prioritized candidate dossiers reviewed for document conversion (MarkItDown, Docling), voice (Qwen3-ASR, GigaAM, T-one, Typhoon, Vosk, VibeASR), durable execution (PydanticAI, LangGraph, Temporal), sandboxing (gVisor, OpenShell, Firecracker), protocols/UI (MCP, AG-UI, Agent Skills, A2A/ACP), and developer workflow (Graphify, CLI-Anything). Weighted screening vectors and dispositions are recorded in INTEL.md. This is not runtime adoption or target-host verification.

**Highest-value next pilots:** (1) isolated local document conversion: MarkItDown first, Docling as the richer comparison; (2) CPU ASR benchmark against the existing whisper.cpp baseline using Qwen3-ASR, GigaAM and T-one, with a separate Thai lane; (3) host compatibility check before selecting a sandbox. Keep AgentRun's SQLite store until crash/recovery tests and measured demand justify an execution-engine change.

**Still OPEN:** target-host CPU/RAM/latency benchmarks; exact pinned commits for each candidate at acquisition time; model/voice artifact SHA-256 and redistribution checks; Vosk archive hash; sandbox host compatibility; per-feature UI/network controls; complete source-to-task cross-linking. No source review alone authorizes a download, install, merge or deployment.
