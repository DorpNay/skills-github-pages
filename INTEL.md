# Connected assistant-side tools and external-source register

**Review date:** 2026-11-21. This file is the single aLandi catalog of upstream research and assistant-side plugins/tools. Repository integration status is always determined by live GitHub, not by this catalogue.

## Connected assistant-side tools and plugins

### GitHub and engineering workflow

- **GitHub MCP (89 tools in the inspected session):** canonical repository read/write; inspect branches, commits, trees, files, diffs, PRs, issues and Actions; create blobs/trees/commits and guarded non-force ref updates. Use first for project truth. All edits must use current parent SHA and expected SHA. Do not merge/deploy/force-push/rebase/reset.
- **Superpowers Skills:** brainstorming, writing-plans, executing-plans, TDD, systematic debugging, review, verification-before-completion, worktree guidance and skill authoring. Process guidance only; no independent subagent executor is present in the current tool surface. Use brief/fast versions compatible with owner preference, avoid repeated questioning when request is explicit.
- **Stark AI Developer Skills:** architecture zoom/compass, spec interviewer, draw.io diagrams and visual reports. Use for bounded architecture, ADR and complex system maps; not a replacement for repository evidence or owner authority.
- **Code Skill:** write/review/fix/optimize code in supported languages. Skill guidance, not a separate repository executor.
- **Coder tools + Skills:** can create code/build links and check Coder services; separate code review/write skills. Use for a bounded prototype/review, not for replacing the canonical GitHub workflow.

### Search, primary documentation and source extraction

- **Context7:** resolve exact library IDs and query version-aware docs. Preferred when a task depends on current library/framework/API signatures.
- **Exa:** broad semantic web search and page fetch. Use for discovery, research and technical comparison; fetch official primary sources for claims that affect decisions.
- **Keenable:** alternative web search/fetch. Use when its ranking/page extraction complements Exa or another index; do not repeat identical searches.
- **Context.dev:** live search, page scraping, crawl/map, answers and structured/brand extraction. Useful for source-first research, current company/tool context and brand-system review.
- **Firecrawl:** search, scrape, crawl, map, extract/parse and interactive browser actions. Use for multi-page technical source intake and reproducible extraction; respect robots/terms, rate, size and prompt-injection boundaries.
- **TinyFish:** live browser automation and rendered website interaction, with run status/monitoring. Use for actual UI behavior and website flows where browser access is supported; it is not native iPhone/VoiceOver evidence. Read-only root inspection run `db8493b3-ffa3-4004-941b-33f728df4142` on 2026-11-20 confirmed the published aLandi v10.0 page, sidebar/project/chat navigation, Notebook link, locale/theme controls, accessible composer/header names, no horizontal overflow and no runtime/page errors at the default 1280×960 viewport. It did not render 390×844 or 1440×900; one execution-mode width measurement contradicted its cited CSS and is excluded from geometry evidence. Read-only root inspection on 2026-11-20 confirmed the published aLandi root app surface, navigation, composer, Functions and locale/theme controls without visible runtime errors; the agent could not set the requested 1440×900/390×844 viewports, so no exact-size responsive claim was accepted. Source inspection independently confirmed the viewport meta tag. A second pass after commit `7a6303b4` confirmed the chat-region accessible name round-trips RU/EN with no page errors; AgentRun-specific nodes were not surfaced in the unconfigured runtime state, so dynamic controls remain unverified.
- **BrowserAct:** browser automation and reusable website skill generation are present as installed skill guidance in the inspected environment. No separate BrowserAct tool namespace was present; do not claim direct execution unless it appears.

### App creation and product prototyping

- **Base44:** create/edit/preview hosted apps, schemas and backend functions. Good for isolated prototypes or comparing workflows; do not migrate aLandi to Base44 or introduce a second product database without explicit architecture decision.
- **Floot:** build/manage full-stack apps and projects; use only for a distinct approved product or throwaway prototype.
- **Hercules:** app/thread/agent management and hosted app creation. Useful for evaluating agent-product patterns, not aLandi production runtime.
- **OpenAI Platform:** encrypted API-key creation/setup workflows. Never reveal, paste into chat, commit or log credentials. Account/key changes require owner action.

### Hosting, infrastructure and platform documentation

- **Cloudflare:** docs/search and account/API operations. Useful for Tunnel, DNS, security/network configuration; read-only research is preferred. Do not change zones, tunnels, DNS or access policies without explicit approval.
- **Hostinger Connector:** search/execute Hostinger account operations, hosting/domain/DNS/VPS support. No account/server changes without owner approval and runbook/rollback.
- **Railway:** project, services, deployment, database, volumes, domains, variables and operations. Research the current setup only; no provision/deploy/config change without explicit approval.
- **Render:** services, workers, workflows, databases, deployments and metrics. Do not create or change infrastructure for aLandi without owner direction.
- **Vercel:** extensive deployment, function, storage, AI SDK/gateway, agent and workflow docs/tools. Relevant as reference or separately approved environment; current aLandi canonical host remains GitHub Pages + existing gateway.

### Specialized developer and communication skills

- **Twilio Developer Kit:** many skills for voice, messaging, ConversationRelay, Conversation Intelligence, memory and compliance. In the inspected tool inventory there was no Twilio execution namespace; skills are guidance only. Consider only if the owner chooses Twilio as a voice/messaging provider after Landing; never assume it is the chosen speech stack.
- **Plugin Management:** search plugin catalogue, inspect dependencies/permissions and propose installs. Connection/installation requires explicit owner action.
- **Automations:** create reminders, monitoring and recurring tasks when explicitly requested/accepted. Not a background coding agent and cannot promise later delivery of code.
- **Files / Skills / user settings:** ChatGPT-side context/file and skill utilities, not aLandi product connectors or runtime permissions.

## Plugin-selection protocol

1. Start from the requirement and missing capability, not from the plugin name. Check whether a current aLandi implementation already covers it.
2. Choose the minimum tool set: GitHub for repository truth; Context7 for APIs; one search engine for discovery; one page extraction/browser tool when needed.
3. Distinguish installed plugin, available skill, executable tool namespace, connected external account, deployed runtime and product integration. These are six different states.
4. Verify official current upstream, exact repository/release, maintenance, security advisories, license of code plus models/weights/voices/datasets/assets, hashes and supported platforms.
5. Extract reusable design/implementation ideas; rename and adapt them to aLandi boundaries. Do not copy logos, product copy, assets or whole systems without license review.
6. No dependency, download, account connection, paid operation, deployment, credential use or server change solely because a plugin suggests it.
7. Record source, exact version, finding, applicability, risk, decision and evidence here. CANDIDATE is not ACCEPTED; ACCEPTED is not IMPLEMENTED.

## Owner correction and focused upstream review — 2026-11-21

The active product contract is one root application with three shared-frame modes. Notebook and Coder are not separate primitive pages. Their source/agent/coding workflows below are adopted as design patterns only; existing aLandi storage, gateway, EvidenceLedger, AgentRun and permission boundaries remain the system of record. The source register currently contains **662 unique URL strings / 936 URL occurrences** (literal URL inventory count); relevance is selected per task rather than treating all entries as automatically applicable.

### Source-grounded Notebook mode

- [Open Notebook repository](https://github.com/lfnovo/open-notebook) and its [interface overview](https://github.com/lfnovo/open-notebook/blob/main/docs/3-USER-GUIDE/interface-overview.md): multi-notebook organization, source/note/chat columns, selectable context per source, saved sessions, source citations, transformations and podcast workflows. **Adopt patterns, not the full stack/UI:** retain aLandi's single shared app frame and chat position; implement notebook/source selection as a bounded context contract and artifact jobs as a separate output lifecycle.
- [Mozilla document-to-podcast](https://mozilla-ai.github.io/document-to-podcast/step-by-step-guide/) and [Podcastfy](https://github.com/souzatharsis/podcastfy): candidate reference flows for script/segment/speaker/audio/transcript pipelines. Do not claim podcast availability until local TTS runtime, voice license, render, transcript and export tests pass.
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/), [python-pptx](https://python-pptx.readthedocs.io/) and [ECharts](https://echarts.apache.org/en/index.html): candidate presentation/chart artifact libraries. Choose only one fit-for-purpose implementation after browser/server build, offline packaging and license review; do not add all three.
- [Ragas metrics](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/): candidate retrieval/answer evaluation vocabulary; citation correctness and cross-scope leak tests must remain aLandi-specific.

### Agent orchestration and coding workspace

- [OpenAI Agents SDK — running agents](https://openai.github.io/openai-agents-python/running_agents/), [handoffs](https://openai.github.io/openai-agents-python/handoffs/), [sessions](https://openai.github.io/openai-agents-python/sessions/) and [tracing](https://openai.github.io/openai-agents-python/tracing/): manager-owned specialist calls versus control handoff, client-managed per-session history, serialized resumable RunState/approval and typed run traces. **Patterns only:** do not mix SDK-managed session persistence with aLandi's SQLite history or introduce server-managed OpenAI Conversations into the private local route. Preserve provider-neutral chat state and aLandi's existing AgentRun contracts.
- [LangGraph checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) and [interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts): durable thread-scoped checkpoints, fault-tolerant continuation, human interrupts and explicit resume. **Pattern only:** reuse existing SQLite AgentRun/Event/Evidence persistence unless measured requirements demonstrate a gap; do not add a second checkpoint store.
- [OpenHands releases](https://github.com/All-Hands-AI/OpenHands/releases) and [sandbox overview](https://docs.openhands.dev/openhands/usage/sandboxes/overview): latest checked upstream release v1.43.0 (2026-11-20); Docker sandbox is recommended, process mode is explicitly unsafe, and mounted read-write workspace contents are mutable by the agent. Treat as a reference/candidate, not an aLandi dependency. Recheck the upstream organisation/repository, current release and license at adoption time.
- **aLandi coding decision:** one coder-project record maps to one explicit workspace root and bounded execution environment. Browser File System Access grants are not shell isolation. Before enabling shell/test tools require a real container/VM boundary, read-only default, scoped mounts, egress restrictions, resource limits, approval, diff/rollback and escape tests.

### Agent bootstrapping vs model-weight training

- [Hugging Face TRL SFTTrainer](https://huggingface.co/docs/trl/sft_trainer) and [DPOTrainer](https://huggingface.co/docs/trl/en/dpo_trainer): SFT uses supervised examples; DPO requires chosen/rejected preference data. Dataset schema, chat template and split must be explicit.
- [Hugging Face PEFT LoRA](https://huggingface.co/docs/peft/main/en/package_reference/lora) and [PEFT model merge API](https://huggingface.co/docs/peft/package_reference/peft_model): LoRA freezes the base and trains low-rank updates; QLoRA-style setups may target all linear layers; adapter save/merge/unload semantics and compatibility need tests.
- [Axolotl v0.21.1 release](https://github.com/axolotl-ai-cloud/axolotl/releases/tag/v0.21.1), 2026-10-27: source-validated update includes checkpoint/LoRA, eval and tool-calling SFT changes plus dependency/security updates. The release also warns that some checkpoint formats are not backwards resumable; pin exact trainer/container and test checkpoint rollback.
- [LLaMA-Factory releases](https://github.com/hiyouga/LLaMA-Factory/releases): retain as candidate only; search evidence returned older release entries rather than a reliable current release, so no version pin/adoption decision is made here.
- [Unsloth fine-tuning guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide): candidate low-memory training path; current model, GPU/backend and license compatibility still require exact verification before use.
- **Critical separation:** agent bootstrap creates a versioned profile from instructions, tool/data grants, selected knowledge and an eval suite; it does not alter weights. Model training is a distinct opt-in job with base checkpoint immutability, lawful/licensed datasets, preflighted hardware, SFT/LoRA/QLoRA/preference stages, held-out task evals, adapter manifest and rollback. Raw private chat history is not training data by default.
- **Hardware boundary:** the planned 8-GB VPS target is not a training workstation. Training framework references are optional owner workstation/GPU packages; never offer training as runnable on the VPS without preflight evidence.

### Current design decisions

- Direct chat remains the default. Automatic specialist routing is bounded and policy-driven; user can bypass it. Chat/project stores versioned agent/team configuration and approved context references, not hidden reasoning.
- aNoteBooki replaces the Projects navigation surface with notebook collections and artifact actions while preserving the central chat/composer; the active notebook's selected sources are the only notebook context.
- aCodingi replaces general navigation with coding project/tools views, retains the same chat position, and opens a project-specific isolated workspace. The existing /workspace/ editor is not an execution sandbox.
- Model/artifact adapters must be tied to exact local weights, hashes, licenses, runtime compatibility and measured quality/resources. Downloaded GitHub Actions artifacts are temporary staging, not installed host models.


## 2026-11-21 — Owner reaffirmation: shared-frame modes through P5

**Binding source-use rule:** the consolidated external catalogue (approximately 500 owner-supplied/upstream entries across this file and migrated catalogues) is the candidate pool, not a shopping list. For every implementation packet, map its needs to the best relevant entries, re-check official current documentation/releases/advisories and exact licences, and record chosen/rejected/deferred sources with version, evidence, integration boundary and rollback. Reuse connected assistant-side plugins/tools for research and engineering only when their actual contracts fit. Assistant-side access does not grant aLandi runtime permission, and a connector being installed here does not mean it is deployed in the product.

**Notebook shared-frame design candidates:** retain a single root frame and same-origin state; source-grounded chat should use stable SourceRecord/BlockRef hashes and offsets, explicit include/exclude/reference-only selection, citation/evidence lineage and local/server persistence. Notebook sidebar replaces Projects with collections; the adjacent action region lists real Studio jobs (report, podcast, slides, chart, diagram, video presentation, quiz/cards). Keep chat/composer geometry unchanged. Use local-first IndexedDB/OPFS only with quota/conflict handling; use server SQLite for durable host storage. Re-check official MDN/WHATWG, W3C/ARIA and relevant parser/conversion upstreams per exact format. Media tools are enabled only with an actual local/approved runtime.

**Coding shared-frame design candidates:** same frame with restrained burgundy/red/black theme; normal chat position becomes the coding agent conversation/status surface. Coding Project is a typed subtype in existing Projects and owns an isolated workspace root, sandbox, chat, files, run/event log, grants and rollback. Candidate references already catalogued: OpenHands SDK, Agent Client Protocol, gVisor, Firecracker, OpenShell (candidate only), Git worktree patterns, language servers and test runners. Browser File System Access is not a sandbox. Require per-project isolation, least privilege, no network by default, egress allowlist, resource/deadline limits, diff-first writes, approvals, cancellation, audit and escape tests before execution is enabled.

**Agents / Research / learning:** prefer durable task state, replayable events, bounded context and explicit approvals (existing AgentRun/SQLite patterns; Hatchet/Restate/DBOS references as candidates). Agent catalogues are capability contracts, not role-name toggles. Direct chat remains default; specialist calls are policy-routed and persisted as versioned chat/project profiles. Agent bootstrap is profile/Skill construction plus evals, not weight mutation. Separate model training candidates: Hugging Face TRL + PEFT, Axolotl, Unsloth and LLaMA-Factory only after current compatibility, maintenance, hardware, base-model and dataset-license checks. Compare SFT, LoRA/QLoRA, preference optimisation and full fine-tuning by evidence; keep production base immutable and rollback adapters/checkpoints.

**Offline Core / model use:** inventory the exact already-acquired artifacts before assigning roles. Distinguish downloaded, hash-verified, staged, installed, loaded and evaluated. Keep inference concurrency/resource budget explicit; do not load multiple resident models on the 8-GB baseline without measured headroom. Server-only acceptance must work with network disabled except the separately permitted search tool. Public Pages remains a free static client; no mandatory CDN/provider/cloud DB in the offline path. Main model deployment and Cloudflare production changes remain owner-controlled.

**Package traceability acceptance:** every P1–P5 implementation slice records (1) selected official sources and exact versions, (2) licence/security review, (3) code/runtime boundary, (4) deterministic tests/evals, (5) measured resource cost, (6) failure/rollback and (7) deferred alternatives. No bulk adoption of the catalogue.

## External source register

### Landing UI finish — authoritative design and test references (reviewed 2026-11-20)
- **Research trace export failure hardening (2026-11-20):** Markdown/JSON download failures and local-link copy/storage failures now use bounded RU/EN feedback; raw browser exceptions and trace contents are not rendered. Regression fault-injects object-URL creation failure. Existing Playwright guidance and WCAG status-message references remain the design basis.
- **Browser connectivity feedback (2026-11-20):** MDN explicitly cautions that navigator.onLine is heuristic and must not be used to infer whether a specific site is reachable. aLandi therefore uses it only for a localized browser-network hint and never changes web-search/provider routing based on the signal. Primary source: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine (also https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event and https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event).
- **Toast/status implementation note (2026-11-20):** the shared root toast distinguishes polite success status from assertive error alerts and sets atomic announcements. This applies the existing W3C WCAG 2.2 SC 4.1.3 Status Messages and ARIA22 references below; it does not establish screen-reader/browser conformance by itself.
- **Current root UI slice (2026-11-20):** chat/project fallback-copy fixes retain the existing HTML/JS interaction model and use the already catalogued WCAG 2.2 and WAI-ARIA APG references as design constraints. No UI framework, runtime dependency, provider, or external asset was added; this slice introduces no new upstream claim requiring another URL. Trace export and modal localization follow the existing Playwright web-first assertion guidance and preserve the existing JSON export contract; no new external dependency or upstream behavior was introduced.


These references are inspiration and acceptance guidance, not dependencies or proof of aLandi conformance:

- **W3C — WCAG 2.2:** https://www.w3.org/TR/WCAG22/ — focus not obscured, keyboard order, target size and focus appearance criteria. Apply AA requirements as the baseline; 44×44 CSS px remains a deliberate aLandi touch-target policy, not a claim that WCAG AA universally requires 44px.
- **W3C WAI — ARIA Authoring Practices Guide:** https://www.w3.org/WAI/ARIA/apg/ and https://www.w3.org/WAI/ARIA/apg/patterns/ — use documented dialog, disclosure, menu-button and keyboard interaction patterns; do not add ARIA roles without implementing their keyboard/state contracts.
- **USWDS — Form component:** https://designsystem.digital.gov/components/form/ — semantic fieldsets/legends, DOM order matching visual order, aligned validation and explanatory disabled states.
- **GOV.UK Design System — Validation pattern:** https://design-system.service.gov.uk/patterns/validation/ — preserve entered values, focus an error summary or first invalid field, and pair summary-level guidance with field-level messages.
- **GitHub Primer — Forms:** https://primer.style/product/ui-patterns/forms/ — concise persistent labels, submit-time validation, aria-invalid, aria-describedby, first-invalid focus and non-redundant helper text.
- **Material Design 3 — Accessibility / flow:** https://m3.material.io/foundations/designing/flow — keep natural DOM tab order, define initial focus for dialogs and return focus to the invoker after close.
- **Microsoft Playwright — Assertions:** https://playwright.dev/docs/test-assertions and https://playwright.dev/docs/aria-snapshots — prefer auto-retrying role/name/focus/visibility assertions and ARIA snapshots for deterministic browser acceptance.

**Use in aLandi:** borrow patterns, not visual branding or framework dependencies. Keep current HTML/CSS/JS + Jekyll architecture. Convert applicable requirements into focused Playwright assertions and manual native-device gates; no external system's benchmark or compliance claim transfers automatically.

- **W3C WAI-ARIA APG — Dialog (Modal) Pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — modal focus stays inside; Tab/Shift+Tab wrap; Escape closes; focus returns to invoker unless workflow requires a logical next target; role=dialog, aria-modal and visible accessible name are required. Do not claim modal semantics unless the background is actually inert.
- **USWDS — Modal accessibility tests:** https://designsystem.digital.gov/components/modal/accessibility-tests/ — manual acceptance includes portrait/landscape visibility, keyboard dismissal, focus containment/return, and 400% zoom/reflow. Component-level claims still require tests in the aLandi context.
- **CMS Design System — Error validation:** https://design.cms.gov/patterns/Forms/error-validation/ — validation-on-submit, error summary plus inline field messages, aria-describedby association, preserve entered values and keep submit available; use concise corrective instructions.
- **W3C WCAG 2.2 — SC 3.3.1 Error Identification:** https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html — automatically detected input errors must identify the affected item and describe the error in text.
- **Playwright v1.64.1 — Assertions / expect.poll:** https://playwright.dev/docs/test-assertions and https://playwright.dev/docs/test-assertions#expectpoll — use auto-retrying web-first locator assertions and expect.poll for asynchronous state; avoid fixed sleeps. Context7 resolved the official `/microsoft/playwright/v1.64.1` documentation for assertion patterns.
- **MDN — IDBTransaction:** https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction — IndexedDB reads/writes run in transactions; transaction `error`/`abort` and `error` property describe failed outcomes. Treat transaction failure distinctly from an empty read result.
- **MDN — Using IndexedDB:** https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB — unhandled request errors bubble to the transaction and can abort/roll back the transaction; inspect transaction outcome when reporting persistence.
- **W3C WCAG 2.1 — SC 4.1.3 Status Messages:** https://www.w3.org/WAI/WCAG21/Understanding/status-messages and **WAI-ARIA 1.2 — status role:** https://www.w3.org/TR/wai-aria/#status — announce advisory updates without moving focus; `role="status"` provides a polite live-region semantic.

Repository research is retained below. Treat upstream facts as date-bounded; recheck exact releases and licenses before implementation. Sources are categorized by purpose and disposition; not every item is intended for adoption.

### Priority upstream reference groups

- Agent orchestration, execution durability and policy: Microsoft Agent Framework / Semantic Kernel; CrewAI; Hatchet; Restate; DBOS; PydanticAI; Open Policy Agent; Cedar; NATS JetStream; A2A; MCP Registry/specification; OpenTelemetry GenAI conventions.
- Agent evaluation and security: promptfoo; Inspect AI; garak; adversarial prompt-injection, approval, cancellation and recovery corpora.
- Sandboxing and coding workspaces: NVIDIA OpenShell (candidate only, not installed); gVisor; Firecracker; OpenHands SDK; Agent Client Protocol; browser File System Access API; CodeGraph (dev-only candidate with artifact-checksum caveat).
- Notebook, sources and podcast: Groundcast (MIT reference workflow; provider calls may leave device); local-first notebook/research products; exact SourceRecord/BlockRef evidence chain; browser OPFS/IndexedDB and local file permissions.
- Local inference and Offline Core: WebLLM/WebGPU/OPFS, web.dev client-side AI performance. Device feasibility requires compatibility check and explicit large download; worker/header requirements are environment-specific.
- Voice: whisper.cpp, Qwen3-ASR, Vosk, Moonshine, Silero VAD/TTS, Piper, ONNX and candidates listed in voice research docs. Exact code, weights, voice and dataset license must each be checked separately.
- OCR/document ingestion: Tesseract, PaddleOCR, Surya, GLM-OCR, HunyuanOCR, GOT-OCR, dots.ocr, DeepSeek-OCR, LightOnOCR, Docling and existing parsers. Select by RU/EN/TH fixture accuracy, resources, safety and license.
- Web/document research: Firecrawl, Context.dev, browser retrieval, Crawl4AI/SearXNG and source registries are candidate adapters, not default runtime additions.
- UI/accessibility/performance: W3C WCAG 2.2, MDN/WHATWG/ARIA, web.dev and browser support tables. Treat browser API features as progressive enhancements with current fallback.
- Knowledge/memory/RAG: current FTS5 baseline, RRF, LazyGraphRAG, Graphiti, Mem0, RAG-Anything and related sources. Keep retired server-memory graph retired; do not equate a knowledge graph proposal with implementation.
- Engineering process: Harness², Claudex Loop, Everything Claude Code, Ponytail, Agent Skills spec. Borrow bounded workflows, progressive disclosure, TDD and validation; avoid wholesale installation.

### Source trust and adoption rules

- Prefer official specification/repository/release docs and model cards. Secondary reviews and benchmark claims are leads only.
- An upstream benchmark is not an aLandi benchmark. Measure against identical fixtures and target hardware before adoption.
- Verify code license, weight/model license, tokenizer, voice, dataset and asset rights independently.
- Downloaded + hashed does not mean installed; installed does not mean loaded; loaded does not mean verified end-to-end.
- Keep all owner-supplied or private-source provenance distinct from independent public research.
- The original INTEL material follows this section as historical/current research notes; keep useful source links and caveats, but do not create a second active task tracker.

---

# aLandi Intelligence / Source Register (INTEL.md)

**Review date:** 2026-11-16. Recheck upstream releases and model cards before shipping an artifact.

## Landing 2.0: source-first Notebook, Offline Core and Skill Factory — reviewed 2026-11-17

These sources were checked for architecture direction only. They do not establish aLandi implementation, device compatibility, or production readiness.

- **Groundcast** — https://github.com/rohanhong/groundcast (MIT; repository snapshot checked 2026-11-17). A small local-first reference for turning selected study materials into podcast sessions: fixed typed pipeline, claim verification against source chunks, local TTS, transcript links to page/slide/time. Its README says LLM calls leave the device to the configured provider; therefore it is a design reference, not proof of fully offline generation or a dependency recommendation. Evaluate maintenance, security, resource use and licensing before adoption.
- **web.dev — Client-side AI performance** — https://web.dev/articles/client-side-ai-performance (checked 2026-11-17). Device feasibility cannot be reliably guaranteed before download; feature-detect WebGPU, account for large model assets, warn before downloads, cache deliberately and handle interrupted transfers. Supports a staged compatibility check and explicit install flow in Offline Core; it does not justify claiming all phones can run local models.
- **WebLLM — Local Inference** — https://webllm.io/docs/guides/local-inference/ (checked 2026-11-17). Documents WebGPU inference, OPFS model caching and worker execution; SharedArrayBuffer worker mode requires appropriate COOP/COEP headers. Treat browser runtime compatibility and headers as a deployment gate, not a universal browser guarantee.
- **Agent Skills specification** — https://agentskills.io/specification (checked 2026-11-17). Defines a portable skill directory with required SKILL.md YAML frontmatter and optional scripts/references/assets; allowed-tools is experimental and client support varies. aLandi Factory must add its own provenance, security scanning, eval, immutable version and approval gates; a Skill manifest is not a runtime permission grant.

**Disposition:** retain these as upstream candidates in the Landing 2.0 architecture. Do not install dependencies, download weights, ship voices, activate network access, or grant tools based on this research alone. Check exact releases, model/voice/data licences, hashes, hardware and RU/EN/TH evals before selecting artifacts.

## Coder runtime and engineering workflow candidates — reviewed 2026-11-17

These are upstream findings and design candidates, not proof of aLandi integration or target-host suitability.

- **[NVIDIA OpenShell v0.1.8](https://github.com/NVIDIA/OpenShell/releases/tag/v0.1.8)** — Apache-2.0; published 2026-11-10. Upstream describes kernel-enforced filesystem/syscall/network policy and formal policy-change review. The release fixes fail-closed symlink policy handling and credential placement, among other lifecycle and logging issues. The repository already contains a pinned v0.1.8 acquisition manifest and checksum/size validation workflow for Ubuntu 24.04 x86_64. Keep `CANDIDATE_NOT_INSTALLED`: host prerequisites, policy migration, credential injection, telemetry opt-out (`OPENSHELL_TELEMETRY_ENABLED=false`), escape testing and host compatibility must be verified before any install. The acquisition workflow only stages and hashes artifacts; it does not install or activate them. Sources: [v0.1.8 release notes](https://github.com/NVIDIA/OpenShell/releases/tag/v0.1.8), [upstream README](https://github.com/NVIDIA/OpenShell/blob/v0.1.8/README.md).
- **[CodeGraph](https://github.com/Cleboost/codegraph-rs)** — MIT; upstream stable release v1.2.0 dated 2026-07-07. Small Rust/Tree-sitter index using SQLite FTS5 and MCP for symbols, callers/callees, impact and context; official workflow publishes Linux x86_64 musl artifacts. Candidate for local repository navigation, not a production dependency: the reviewed release asset did not provide an independently published archive checksum, adoption is limited, and upstream benchmark claims are not aLandi measurements. Do not run an unverified binary or treat a CI artifact digest as the release tarball SHA. Sources: [repository](https://github.com/Cleboost/codegraph-rs), [v1.2.0 release](https://github.com/Cleboost/codegraph-rs/releases/tag/v1.2.0), [release workflow](https://github.com/Cleboost/codegraph-rs/blob/9d45aee862f2904ea45390e4d132b6eace927f01/.github/workflows/release.yml).
- **[Cortex workspace v3.5.0](https://github.com/enbattle/cortex-workspace)** — MIT; upstream release dated 2026-10-13. Useful practices: spec-first clarification, separate test-first implementation and read-only review, test/fixture locks and evidence-driven retrospectives. README reports only one real-repository pilot, notes stronger role separation is enforced only in one agent adapter, and describes a comparatively heavy six-stage process. Adopt lightweight practices; do not install the harness wholesale or treat it as a security boundary. Source: [repository and limits](https://github.com/enbattle/cortex-workspace).
- **[Agent Client Protocol](https://github.com/zed-industries/agent-client-protocol)** — stable wire protocol v1. JSON-RPC sessions standardize agent progress, tool-call lifecycle and permission requests. Consider as future Coder/UI interoperability; do not build an ACP layer before execution, sandbox policy and task contracts exist. Source: [protocol repository](https://github.com/zed-industries/agent-client-protocol).

**aLandi disposition:** first low-risk improvement is to bind a bounded set of trusted, repository-owned Skills to the existing non-executing Coder profile. Skills do not grant tools. Sandbox runtime, code index, MCP adapters, database connectors and editable workspace execution remain separate candidates with explicit license, checksum, resource, approval and escape-test gates.

## Browser automation: fast DOM coverage vs visual fidelity

- [Lightpanda official documentation](https://lightpanda.io/docs/quickstart/): Lightpanda is a JavaScript-capable headless browser with CDP/Playwright/Puppeteer compatibility. Its API/Web-platform coverage is still partial; it deliberately does not perform graphical rendering.
- [Lightpanda 1.0 WebDriver benchmark (2026-10-06)](https://lightpanda.io/blog/posts/speed-up-your-selenium-tests): the upstream benchmark reports 43/66 Selenium documentation tests passing; on the 43 tests passing in both engines, Lightpanda was 2.6x faster sequentially and 4.4x faster with eight parallel workers, with lower memory use. These are upstream measurements, not aLandi measurements.
- **aLandi disposition:** use Lightpanda as the fast JavaScript/DOM interaction smoke candidate; do not use it to claim CSS layout, viewport geometry, screenshot, touch-target, overflow or real-device coverage. Keep the existing Chromium suite as an opt-in visual/layout regression tool, not a per-commit gate. No browser package is part of the shipped app runtime.
- **Acceptance before promotion:** run the same bounded aLandi interaction cases in Lightpanda and Chromium, compare pass/fail coverage and wall-clock time on the same runner, document unsupported APIs, and retain Chromium for assertions that require actual layout. A faster engine is not an equivalent replacement when it omits rendering.

## Voice and model licensing

- Moonshine upstream license terms: https://github.com/moonshine-ai/moonshine/blob/main/LICENSE
  - Upstream states English models and streaming models default to MIT. Certain legacy non-streaming non-English models are exceptions; the list in upstream LICENSE is exhaustive. TTS/G2P assets have separate terms. Record the exact artifact SHA before use.
- Vosk API source: https://github.com/alphacep/vosk-api (Apache-2.0 code).
- Vosk model catalogue: https://alphacephei.com/vosk/models
  - The catalogue lists vosk-model-small-ru-0.22 as Apache 2.0 and approximately 45 MB. The downloaded archive checksum still has to be verified and stored in the manifest.
- Silero VAD: https://github.com/snakers4/silero-vad and https://github.com/snakers4/silero-vad/blob/master/LICENSE
  - Upstream code is MIT. Record the exact ONNX model hash separately.
- Silero TTS/model collection: https://github.com/snakers4/silero-models and https://github.com/snakers4/silero-models/wiki/Licensing-and-Tiers
  - The upstream licensing wiki describes its Community Edition STT models as non-commercial and Enterprise as separately licensed. Do not infer one universal SPDX identifier for every Silero artifact or assume the VAD license extends to TTS; confirm the exact selected model and model card/terms with the rights holder before use.
- Current Piper engine: https://github.com/OHF-Voice/piper1-gpl and https://github.com/OHF-Voice/piper1-gpl/docs/VOICES.md
  - Current package metadata identifies the engine as GPL-3.0-or-later. Each voice has a separate MODEL_CARD and may be more restrictive. The archived rhasspy/piper MIT license does not prove the current engine or any voice has MIT terms.
- ONNX standard: https://github.com/onnx/onnx (Apache-2.0). Runtime and model artifact licenses are tracked separately from the ONNX format.
- PyO3 native bridge: https://github.com/PyO3/pyo3 (dual MIT/Apache-2.0).

## Tool and security contracts

- JSON Schema validator, version/license: https://pypi.org/project/jsonschema/ (MIT; current pinned dependency is 4.26.0 in gateway requirements).
- OAuth security BCP: https://www.rfc-editor.org/rfc/rfc9700.html
- Google OAuth web-server flow: https://developers.google.com/identity/protocols/oauth2/web-server
- JSON Patch: https://www.rfc-editor.org/rfc/rfc6902.html
- Microsoft LazyGraphRAG: https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/
  - Current retrieval implementation remains SQLite FTS5 + lexical concept graph. It is not a claim of complete LazyGraphRAG parity.
- SSRF guidance: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
  - DNS results must all be checked and the connection must pin a validated address; a one-time URL string check alone is insufficient.

## Observability and package tooling

- OpenTelemetry Python official docs: https://opentelemetry.io/docs/languages/python/instrumentation/
  - Traces/metrics are stable; logs support is still described as development in the docs. Keep exporter disabled by default and use local collector unless privacy/security explicitly approves a remote endpoint.
- Vulture project: https://github.com/jendrikseipp/vulture and https://pypi.org/project/vulture/
  - Static analysis can produce false positives for framework callbacks and dynamic use; publish a report, do not automatically delete.
- orjson: https://github.com/ijl/orjson and https://pypi.org/project/orjson/
  - Current license expression includes MPL-2.0 AND (Apache-2.0 OR MIT). A serialization speed claim needs representative benchmark data, and licensing must be included in provenance.
- uv: https://docs.astral.sh/uv/ and https://github.com/astral-sh/uv
  - The project does not yet commit a generated uv.lock. CI must not migrate to uv sync --locked until the lock has been generated with registry access and reviewed.
- OCI shape/product details and availability: https://www.oracle.com/cloud/compute/ and https://www.oracle.com/cloud/free/
  - Availability, free-tier quotas, regional capacity and pricing must be rechecked in the account/region. This repo did not provision a VM.
- DigitalPlat Dev / FreeDomain terms: https://www.digitalplat.org/
  - Treat free-domain eligibility, renewal, ownership and DNS options as subject to current provider terms; this project did not register or modify a domain.

## Decision rule

License declarations are not inherited across engine/model/voice/data. Every distributable artifact records upstream URL, exact version, license/SPDX identifier, SHA-256, commercial/redistribution state, attribution obligations and approval. Missing data means not shipped.

## Media generation API status — reviewed 2026-10-24

- OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources: https://developers.openai.com/api/docs/guides/image-generation and https://developers.openai.com/api/docs/guides/tools-image-generation.
- OpenAI Sora 2 / Videos API: official current API pages state the models and Videos API were shut down on 2026-09-24 and no one-to-one replacement API is available. Do not implement the retired endpoint. Source: https://developers.openai.com/api/docs/guides/video-generation.
- Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source: https://docs.dev.runwayml.com/api/ and https://docs.dev.runwayml.com/guides/using-the-api/.
- Luma Agents API: current docs describe Ray 3.2 video generation/edit/reframe. Source: https://docs.agents.lumalabs.ai/guides/videos/.
- Google Vertex AI Veo: official API reference lists Veo 3.1 models and long-running video generation; needs Google Cloud project, IAM and billing/storage setup. Source: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation.
- Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder, https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia, https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API.
- Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport.

These are source checks, not provider-account tests. No provider was called, no billable media job was submitted, and no key/account access was verified.

## File picker and long-press behavior — reviewed 2026-10-24

- MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept.
- MDN documents pointer lifecycle events including pointerdown, pointerup, and pointercancel. Long-press UIs should clear timers on cancel and keep targets large enough for touch. Source: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events.
- aLandi PR #35 therefore keeps the native file chooser unrestricted but validates content type/size after selection; the application currently extracts selected text, images and a few video frames. PDF/Office/binary parsers are not implemented yet; such files are explicitly rejected rather than being silently sent as names or untrusted blobs.
- These docs are platform reference checks. Browser E2E uses mocked API endpoints; no real provider or private gateway is called.


## Sidebar, disclosure and contextual action patterns — reviewed 2026-11-15

This review is scoped to the aLandi Projects/Chats sidebar and project-row actions; it is not a full revalidation of the external URL inventory.

- **Apple Human Interface Guidelines — Sidebars:** a sidebar navigates between app areas or top-level collections such as folders/playlists; it consumes substantial vertical and horizontal space, so choose a compact alternative when space is limited. Adaptation: retain Projects and Chats as clear top-level collections and keep the sidebar hide/show affordance available. https://developer.apple.com/design/human-interface-guidelines/sidebars
- **W3C WAI-ARIA Authoring Practices — Disclosure:** the canonical APG pattern uses a button, exposes aria-expanded, optionally aria-controls, and supports Enter/Space. aLandi currently uses native details/summary for row action disclosure; if this is replaced with custom disclosure markup, implement the full APG button contract. Do not turn the project list into an ARIA tree/menu without implementing that interaction contract. https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- **GitHub Primer — ActionMenu:** an action menu is a trigger plus an overlay containing action-list items; it can be opened from a button/icon button or a contextual list-item action. Adaptation: reuse the existing fixed-position chat action-list overlay for project rows; retain normal button semantics and Escape/outside dismissal. https://primer.style/product/components/action-menu/
- **Microsoft Fluent 2 — Drawer:** reserve modal overlays for focused tasks; avoid stacking multiple modal drawers and use a lighter popover for brief contextual information/actions. Adaptation: project row actions stay in an anchored non-modal overlay; editing remains the existing single project dialog. https://fluent2.microsoft.design/components/web/react/core/drawer/usage
- **Singapore Government Design System — Sidebar:** documents optional upper/lower slots around the main navigation, collapsible/persistent/overlay variants, active-item state, and overlay behavior below 768px; below 512px its example hides the scrim and uses a full-width sidebar. Adaptation: preserve a distinct scrollable navigation region and the fixed create-chat action; do not claim a custom tree keyboard model. https://designsystem.tech.gov.sg/components/sidebar

**Implementation boundary:** these are interaction-pattern references, not a mandate to import React libraries. aLandi remains the existing HTML/CSS/JavaScript client. No third-party UI dependency was added.


## Consolidated external source inventory (snapshot: 2026-11-04)

This is the single navigational inventory for external upstreams referenced by the curated project source lists. The original catalogs remain the evidence/context records; this table deduplicates exact URLs and records where each reference was found. A link is **not** an adoption, license approval, verified current state, or download authorization. Recheck upstream version, exact artifact/model/voice license, checksum, redistribution terms and relevance before obtaining or shipping files.

**Catalog coverage:** `INTEL.md`; `docs/OPEN_SOURCE_TRIAGE_RU.md`; `docs/TECHNIQUE_REGISTER_RU.md`; `docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md`; `docs/MULTIMODAL_MODEL_STACK_RU.md`; research catalogs in PR #125 (Agent Studio), #128 (Agent Workforce/VERT), #129 (Voice 2.0), #130 (Deep Research 2.0), plus open-source feature extraction and multimodal research branches. Source docs are not merged into main by this register.

**Snapshot extraction:** 257 distinct URLs, deduplicated from curated Markdown links and raw URLs in INTEL; provenance column records catalog(s). This is a link inventory, not a claim that every referenced upstream has been independently revalidated today.

| Source / resource | Canonical URL | Found in |
|---|---|---|
| - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder> | INTEL.md |
| - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia> | INTEL.md |
| - Browser audio: MDN MediaRecorder is broadly supported for recording a MediaStream, while getUserMedia requires HTTPS and explicit microphone permission. Web Speech recognition is not consistently supported; default recognition may send audio to a remote service. On-device recognition requires supported browser/language packs. Sources: | <https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API> | INTEL.md |
| - Current Piper engine:  and | <https://github.com/OHF-Voice/piper1-gpl> | INTEL.md |
| - Current Piper engine:  and | <https://github.com/OHF-Voice/piper1-gpl/docs/VOICES.md> | INTEL.md |
| - DigitalPlat Dev / FreeDomain terms: | <https://www.digitalplat.org/> | INTEL.md |
| - Google OAuth web-server flow: | <https://developers.google.com/identity/protocols/oauth2/web-server> | INTEL.md |
| - Google Vertex AI Veo: official API reference lists Veo 3.1 models and long-running video generation; needs Google Cloud project, IAM and billing/storage setup. Source: | <https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation> | INTEL.md |
| - JSON Patch: | <https://www.rfc-editor.org/rfc/rfc6902.html> | INTEL.md |
| - JSON Schema validator, version/license:  (MIT; current pinned dependency is 4.26.0 in gateway requirements). | <https://pypi.org/project/jsonschema/> | INTEL.md |
| - Luma Agents API: current docs describe Ray 3.2 video generation/edit/reframe. Source: | <https://docs.agents.lumalabs.ai/guides/videos/> | INTEL.md |
| - MDN documents pointer lifecycle events including pointerdown, pointerup, and pointercancel. Long-press UIs should clear timers on cancel and keep targets large enough for touch. Source: | <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events> | INTEL.md |
| - MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file> | INTEL.md |
| - MDN documents that omitting the HTML file input accept attribute leaves the picker unrestricted; multiple allows multi-file selection. The accept attribute is only a selection hint and is not a security or type-validation boundary. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept> | INTEL.md |
| - Microsoft LazyGraphRAG: | <https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/> | INTEL.md |
| - Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport> | INTEL.md |
| - Mobile viewport: VisualViewport reports visual viewport dimensions/offset/scale and resize events; keyboard behavior differs between visual and layout viewport. Keep zoom accessibility enabled; use responsive viewport and 16px mobile input, not maximum-scale/user-scalable=no. Sources:  and | <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport> | INTEL.md |
| - Moonshine upstream license terms: | <https://github.com/moonshine-ai/moonshine/blob/main/LICENSE> | INTEL.md |
| - OAuth security BCP: | <https://www.rfc-editor.org/rfc/rfc9700.html> | INTEL.md |
| - OCI shape/product details and availability:  and | <https://www.oracle.com/cloud/compute/> | INTEL.md |
| - OCI shape/product details and availability:  and | <https://www.oracle.com/cloud/free/> | INTEL.md |
| - ONNX standard:  (Apache-2.0). Runtime and model artifact licenses are tracked separately from the ONNX format. | <https://github.com/onnx/onnx> | INTEL.md |
| - OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources:  and | <https://developers.openai.com/api/docs/guides/image-generation> | INTEL.md |
| - OpenAI Image API / Responses image_generation tool: current official guide describes image generations and edits through the Image API, and multi-turn image tool through Responses. This is not the existing chat-completions endpoint; requires server-side secret handling and may require organization verification. Sources:  and | <https://developers.openai.com/api/docs/guides/tools-image-generation> | INTEL.md |
| - OpenAI Sora 2 / Videos API: official current API pages state the models and Videos API were shut down on 2026-09-24 and no one-to-one replacement API is available. Do not implement the retired endpoint. Source: | <https://developers.openai.com/api/docs/guides/video-generation> | INTEL.md |
| - OpenTelemetry Python official docs: | <https://opentelemetry.io/docs/languages/python/instrumentation/> | INTEL.md |
| - orjson:  and | <https://github.com/ijl/orjson> | INTEL.md |
| - orjson:  and | <https://pypi.org/project/orjson/> | INTEL.md |
| - PyO3 native bridge:  (dual MIT/Apache-2.0). | <https://github.com/PyO3/pyo3> | INTEL.md |
| - Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source:  and | <https://docs.dev.runwayml.com/api/> | INTEL.md |
| - Runway Dev API: official docs list async generation tasks, including Gen-4.5 text-to-video and image-to-video; requires API key and required X-Runway-Version header. Source:  and | <https://docs.dev.runwayml.com/guides/using-the-api/> | INTEL.md |
| - Silero TTS/model collection:  and | <https://github.com/snakers4/silero-models> | INTEL.md |
| - Silero TTS/model collection:  and | <https://github.com/snakers4/silero-models/wiki/Licensing-and-Tiers> | INTEL.md |
| - Silero VAD:  and | <https://github.com/snakers4/silero-vad> | INTEL.md |
| - Silero VAD:  and | <https://github.com/snakers4/silero-vad/blob/master/LICENSE> | INTEL.md |
| - SSRF guidance: | <https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html> | INTEL.md |
| - uv:  and | <https://docs.astral.sh/uv/> | INTEL.md |
| - uv:  and | <https://github.com/astral-sh/uv> | INTEL.md |
| - Vosk API source:  (Apache-2.0 code). | <https://github.com/alphacep/vosk-api> | INTEL.md |
| - Vosk model catalogue: | <https://alphacephei.com/vosk/models> | INTEL.md |
| - Vulture project:  and | <https://github.com/jendrikseipp/vulture> | INTEL.md |
| - Vulture project:  and | <https://pypi.org/project/vulture/> | INTEL.md |
| A2A | <https://a2a-protocol.org/latest/specification/> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| ACP | <https://agentclientprotocol.com/protocol/v2/overview> | PR #125 · Agent Studio research |
| AG-UI | <https://docs.ag-ui.com/spec/1.0> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| AG-UI spec | <https://docs.ag-ui.com/> | PR #128 · Agent Workforce research |
| AG2 | <https://github.com/ag2ai/ag2> | PR #125 · Agent Studio research |
| Agent Skills | <https://agentskills.io/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Agent Skills specification | <https://agentskills.io/specification> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| Agent-Reach | <https://github.com/Panniantong/Agent-Reach> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| AgentScope | <https://github.com/agentscope-ai/agentscope> | PR #125 · Agent Studio research |
| AgentTeams | <https://github.com/agentscope-ai/AgentTeams> | PR #128 · Agent Workforce research |
| AI Engineering from Scratch | <https://github.com/rohitg00/ai-engineering-from-scratch> | docs/TECHNIQUE_REGISTER_RU.md |
| AirLLM | <https://github.com/lyogavin/airllm> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| Alertmanager | <https://github.com/prometheus/alertmanager> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Anything-to-Skill | <https://github.com/asale-ai/anything-to-skill> | PR #125 · Agent Studio research |
| AppFlowy | <https://github.com/AppFlowy-IO/AppFlowy> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Argo CD | <https://github.com/argoproj/argo-cd> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| ASR4ALL-L | <https://huggingface.co/futo-org/asr4all-l> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| ASR4ALL-S | <https://huggingface.co/futo-org/asr4all-s> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| AutoGen → Microsoft Agent Framework migration | <https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/> | PR #125 · Agent Studio research |
| AutoGPT | <https://github.com/Significant-Gravitas/AutoGPT> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Awesome Agentic Patterns | <https://github.com/nibzard/awesome-agentic-patterns> | PR #125 · Agent Studio research |
| Awesome Agentic Patterns | <https://agentic-patterns.com/> | PR #125 · Agent Studio research |
| Awesome Agents | <https://github.com/kyrolabs/awesome-agents> | PR #125 · Agent Studio research |
| Awesome Compose | <https://github.com/docker/awesome-compose> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Awesome Harness Engineering | <https://github.com/ai-boost/awesome-harness-engineering> | PR #125 · Agent Studio research |
| Berkeley Function-Calling Leaderboard | <https://gorilla.cs.berkeley.edu/leaderboard.html> | PR #125 · Agent Studio research |
| Book-to-Skill | <https://github.com/virgiliojr94/book-to-skill> | PR #125 · Agent Studio research |
| book-to-skill v1.3.0 | <https://github.com/virgiliojr94/book-to-skill/releases/tag/v1.3.0> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Browser Use | <https://github.com/browser-use/browser-use> | PR #125 · Agent Studio research |
| Bruno | <https://github.com/usebruno/bruno> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Cactus Needle | <https://github.com/cactus-compute/needle> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| CAMEL-AI | <https://github.com/camel-ai/camel> | PR #125 · Agent Studio research |
| Canary 180M Flash | <https://huggingface.co/nvidia/canary-180m-flash> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Cedar | <https://docs.cedarpolicy.com/> | PR #125 · Agent Studio research |
| checkpointers | <https://docs.langchain.com/oss/python/langgraph/checkpointers> | PR #125 · Agent Studio research |
| Claudex Loop | <https://github.com/chaseai-yt/claudex-loop> | docs/TECHNIQUE_REGISTER_RU.md |
| CLI-Anything | <https://github.com/HKUDS/CLI-Anything> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| Colibri | <https://github.com/JustVugg/colibri> | PR #128 · Agent Workforce research |
| Comfy API v2 | <https://docs.comfy.org/api-reference/v2/overview> | PR #130 · Deep Research research |
| Coucou | <https://github.com/Louis-CFM/coucou> | PR #125 · Agent Studio research |
| CrewAI | <https://docs.crewai.com/en/index> | PR #125 · Agent Studio research |
| DBOS | <https://docs.dbos.dev/architecture> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #125 · Agent Studio research |
| DBOS Durable Execution | <https://docs.dbos.dev/> | PR #128 · Agent Workforce research |
| DBX | <https://github.com/t8y2/dbx> | PR #125 · Agent Studio research |
| DeepSeek-OCR / DeepSeek-OCR2 | <https://github.com/deepseek-ai/DeepSeek-OCR> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| DeerFlow 2.0 | <https://github.com/bytedance/deer-flow> | PR #128 · Agent Workforce research |
| Developer Roadmap | <https://github.com/kamranahmedse/developer-roadmap> | docs/TECHNIQUE_REGISTER_RU.md |
| DevOps Exercises | <https://github.com/bregman-arie/devops-exercises> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Distil-Whisper | <https://github.com/huggingface/distil-whisper> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Docker sandbox | <https://docs.openhands.dev/openhands/usage/sandboxes/docker> | PR #125 · Agent Studio research |
| Docling supported formats | <https://docling-project.github.io/docling/usage/supported_formats/> | PR #130 · Deep Research research |
| dots.ocr → dots.mocr | <https://github.com/studio-dots-ai/dots.ocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| DrawDB | <https://github.com/drawdb-io/drawdb> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| dsh-our-free-model | <https://github.com/ebony-vinyl/dsh-our-free-model> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| dsh-our-free-model | <https://github.com/Ebony-Vinyl/dsh-our-free-model> | PR #128 · Agent Workforce research |
| EoT Bench | <https://github.com/livekit/eot-bench> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Every App | <https://github.com/every-app/every-app> | docs/TECHNIQUE_REGISTER_RU.md |
| Everything Claude Code / ECC | <https://github.com/affaan-m/ECC> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| File System Access API draft | <https://wicg.github.io/file-system-access/> | PR #130 · Deep Research research |
| Firecracker jailer | <https://github.com/firecracker-microvm/firecracker/blob/master/docs/jailer.md> | PR #125 · Agent Studio research |
| Free Programming Books | <https://github.com/EbookFoundation/free-programming-books> | docs/TECHNIQUE_REGISTER_RU.md |
| GAIA | <https://huggingface.co/gaia-benchmark> | PR #125 · Agent Studio research |
| garak | <https://docs.garak.ai/garak/> | PR #125 · Agent Studio research |
| GitIngest | <https://github.com/coderamp-labs/gitingest> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| GitMCP | <https://github.com/idosal/git-mcp> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| GitReverse | <https://github.com/filiksyos/gitreverse> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| GLM-OCR | <https://github.com/zai-org/glm-ocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Google ADK | <https://google.github.io/adk-docs/> | PR #125 · Agent Studio research |
| Google Online Boutique | <https://github.com/GoogleCloudPlatform/microservices-demo> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| google/adk-python | <https://github.com/google/adk-python> | PR #125 · Agent Studio research |
| Goose | <https://github.com/block/goose> | PR #128 · Agent Workforce research |
| GOT-OCR 2.0 | <https://github.com/Ucas-HaoranWei/GOT-OCR2.0> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| GPT Pilot | <https://github.com/Pythagora-io/gpt-pilot> | PR #128 · Agent Workforce research |
| Graphify | <https://github.com/Graphify-Labs/graphify> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Graphiti | <https://github.com/getzep/graphiti> | PR #125 · Agent Studio research |
| Grok Register | <https://github.com/AaronL725/grok-register> | PR #125 · Agent Studio research |
| gVisor security model | <https://gvisor.dev/docs/architecture_guide/security/> | PR #125 · Agent Studio research |
| Harness² | <https://github.com/google-research/harness2> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| Harper | <https://github.com/Automattic/harper> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Hatchet durable tasks | <https://docs.hatchet.run/v1/durable-tasks> | PR #125 · Agent Studio research |
| Hermes Agent | <https://github.com/NousResearch/hermes-agent> | PR #125 · Agent Studio research |
| Hive | <https://github.com/aden-hive/hive> | PR #128 · Agent Workforce research |
| Hive Apache-2.0 license | <https://github.com/aden-hive/hive/blob/main/LICENSE> | PR #128 · Agent Workforce research |
| Hono | <https://github.com/honojs/hono> | docs/TECHNIQUE_REGISTER_RU.md |
| Hugging Face smolagents | <https://huggingface.co/docs/smolagents/examples/multiagents> | PR #125 · Agent Studio research |
| Hugging Face Transformers | <https://github.com/huggingface/transformers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| HunyuanOCR-1.5 | <https://github.com/Tencent-Hunyuan/HunyuanOCR> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| HyperFrames | <https://github.com/heygen-com/hyperframes> | PR #125 · Agent Studio research |
| Impeccable | <https://github.com/pbakaus/impeccable> | PR #125 · Agent Studio research |
| Inspect AI | <https://inspect.aisi.org.uk/> | PR #125 · Agent Studio research |
| Jev Ultrafast | <https://github.com/browser-use/jev-ultrafast> | PR #125 · Agent Studio research |
| josstei/maestro-orchestrate | <https://github.com/josstei/maestro-orchestrate> | PR #125 · Agent Studio research |
| Kev-4B | <https://benchlm.ai/compare/glm-5-3-flash-vs-kev-4b> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Kubernetes Examples | <https://github.com/kubernetes/examples> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Langfuse tracing | <https://langfuse.com/docs/observability/get-started> | PR #125 · Agent Studio research |
| LangGraph | <https://docs.langchain.com/oss/python/langgraph/graph-api> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| LangGraph docs | <https://docs.langchain.com/oss/python/langgraph/overview> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| Letta | <https://docs.letta.com/> | PR #125 · Agent Studio research |
| LightOnOCR-3-4B | <https://huggingface.co/lightonai/LightOnOCR-3-4B> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| LiveKit Agent speech/audio | <https://docs.livekit.io/agents/multimodality/audio/> | PR #129 · Voice research; PR #130 · Deep Research research |
| LiveKit Agents | <https://github.com/livekit/agents> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| LiveKit turn handling | <https://docs.livekit.io/agents/logic/turns/> | PR #129 · Voice research; PR #130 · Deep Research research |
| llama.cpp server | <https://github.com/ggml-org/llama.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Magentic-One paper | <https://arxiv.org/html/2411.04468> | PR #125 · Agent Studio research |
| MagpieTTS 357M | <https://huggingface.co/nvidia/magpie_tts_multilingual_357m> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| MarkItDown | <https://github.com/microsoft/markitdown> | PR #130 · Deep Research research |
| MCP | <https://modelcontextprotocol.io/specification/2026-07-28> | PR #125 · Agent Studio research |
| MCP specification | <https://modelcontextprotocol.io/specification> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research; PR #130 · Deep Research research |
| MCP-Scan | <https://invariantlabs-ai.github.io/docs/mcp-scan/> | PR #125 · Agent Studio research |
| MDN OPFS | <https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system> | PR #130 · Deep Research research |
| Mem0 | <https://docs.mem0.ai/> | PR #125 · Agent Studio research |
| memvid | <https://github.com/memvid/memvid> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| MetaGPT | <https://github.com/FoundationAgents/MetaGPT> | PR #125 · Agent Studio research |
| Microsoft Agensh | <https://github.com/microsoft/Agensh> | PR #128 · Agent Workforce research |
| Microsoft Agent Framework | <https://github.com/microsoft/agent-framework> | PR #125 · Agent Studio research |
| Microsoft Research project | <https://aka.ms/magentic-one> | PR #125 · Agent Studio research |
| Minikube | <https://github.com/kubernetes/minikube> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| MIT license | <https://github.com/bytedance/deer-flow/blob/main/LICENSE> | PR #128 · Agent Workforce research |
| Moonshine Voice | <https://github.com/moonshine-ai/moonshine> | docs/TECHNIQUE_REGISTER_RU.md; docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| multi-agent routing | <https://docs.openclaw.ai/concepts/multi-agent/> | PR #125 · Agent Studio research |
| NaiboWang/EasySpider | <https://github.com/NaiboWang/EasySpider> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Nanochat | <https://github.com/karpathy/nanochat> | PR #128 · Agent Workforce research |
| Nemotron 3.5 ASR 0.6B | <https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| NemotronLabs VoiceChat 11B | <https://huggingface.co/nvidia/NVIDIA-NemotronLabs-VoiceChat-11B> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| NVIDIA Nemotron Streaming ASR | <https://build.nvidia.com/nvidia/nemotron-asr-streaming/modelcard> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| NVIDIA OpenShell | <https://github.com/NVIDIA/OpenShell> | PR #125 · Agent Studio research |
| obra/superpowers | <https://github.com/obra/superpowers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Octos | <https://github.com/octos-org/octos> | PR #128 · Agent Workforce research |
| official notice | <https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Official runtime | <https://github.com/NVIDIA/NeMo-Speech.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Open Multi-Agent (OMA) | <https://github.com/open-multi-agent/open-multi-agent> | PR #128 · Agent Workforce research |
| Open Notebook | <https://github.com/lfnovo/open-notebook> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Open Policy Agent | <https://openpolicyagent.org/docs> | PR #125 · Agent Studio research |
| Open-Generative-AI | <https://github.com/Anil-matcha/Open-Generative-AI> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| OpenAI Agents SDK | <https://openai.github.io/openai-agents-python/> | PR #125 · Agent Studio research; PR #128 · Agent Workforce research |
| OpenClaw skills and channels | <https://docs.openclaw.ai/concepts/features> | PR #125 · Agent Studio research |
| OpenClaw subagents | <https://docs.openclaw.ai/subagents> | PR #125 · Agent Studio research |
| OpenHands SDK | <https://docs.openhands.dev/sdk/arch/overview> | PR #125 · Agent Studio research |
| OpenMAIC | <https://github.com/THU-MAIC/OpenMAIC> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| OpenTelemetry GenAI conventions | <https://opentelemetry.io/docs/specs/semconv/gen-ai/> | PR #125 · Agent Studio research |
| OpenWOP v2 | <https://openwop.dev/spec/v2/> | PR #125 · Agent Studio research |
| orchestration guide | <https://developers.openai.com/api/docs/guides/agents/orchestration> | PR #125 · Agent Studio research |
| OWASP Agentic Top 10 2026 | <https://genai.owasp.org/download/52117/> | PR #125 · Agent Studio research |
| PaddleOCR-VL-1.6 | <https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| paper | <https://arxiv.org/pdf/2609.21967.pdf> | PR #129 · Voice research |
| paper arXiv:2609.26781 | <https://arxiv.org/abs/2609.26781> | PR #128 · Agent Workforce research |
| Paperclip | <https://github.com/paperclipai/paperclip> | PR #125 · Agent Studio research |
| PentAGI | <https://github.com/vxcontrol/pentagi> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| PinchTab | <https://github.com/pinchtab/pinchtab> | PR #125 · Agent Studio research |
| Pipecat | <https://github.com/pipecat-ai/pipecat> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| Pipecat documentation | <https://docs.pipecat.ai/> | PR #129 · Voice research; PR #130 · Deep Research research |
| Plandex | <https://github.com/plandex-ai/plandex> | PR #128 · Agent Workforce research |
| Pliny / L1B3RT4S | <https://github.com/elder-plinius/L1B3RT4S> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| policy schema | <https://docs.nvidia.com/openshell/how-it-works/policies/schema> | PR #125 · Agent Studio research |
| Ponytail | <https://github.com/DietrichGebert/ponytail> | docs/TECHNIQUE_REGISTER_RU.md |
| PP-OCRv6 Tiny / Medium | <https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| Promptfoo eval guides | <https://www.promptfoo.dev/docs/guides/> | PR #125 · Agent Studio research |
| public-api сервер | <https://github.com/davemachado/public-api> | docs/TECHNIQUE_REGISTER_RU.md |
| public-apis/public-apis | <https://github.com/public-apis/public-apis> | docs/OPEN_SOURCE_TRIAGE_RU.md; docs/TECHNIQUE_REGISTER_RU.md |
| punkpeye/awesome-mcp-servers | <https://github.com/punkpeye/awesome-mcp-servers> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| PydanticAI multi-agent | <https://pydantic.dev/docs/ai/guides/multi-agent-applications> | PR #125 · Agent Studio research |
| pyproject.toml | <https://github.com/Graphify-Labs/graphify/blob/v8/pyproject.toml> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| PyThaiNLP romanize | <https://pythainlp.org/dev-docs/api/transliterate.html> | PR #129 · Voice research |
| quickstart | <https://docs.graphify.com/quickstart> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Qwen3-ASR-0.6B | <https://github.com/QwenLM/Qwen3-ASR> | docs/MULTIMODAL_MODEL_STACK_RU.md; PR #129 · Voice research; Multimodal stack research branch |
| RAG-Anything | <https://github.com/HKUDS/RAG-Anything> | docs/TECHNIQUE_REGISTER_RU.md; PR #125 · Agent Studio research |
| reproduction guide | <https://github.com/microsoft/Agensh/blob/main/REPRODUCE.md> | PR #128 · Agent Workforce research |
| research repo | <https://github.com/warit-s/typhoon-asr-streaming> | PR #129 · Voice research |
| Restate actions | <https://docs.restate.dev/foundations/actions> | PR #125 · Agent Studio research |
| ripienaar/free-for-dev | <https://github.com/ripienaar/free-for-dev> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| roadmap.sh | <https://roadmap.sh> | docs/TECHNIQUE_REGISTER_RU.md |
| Roo Code | <https://github.com/RooCodeInc/Roo-Code> | PR #128 · Agent Workforce research |
| RuFlo | <https://github.com/ruvnet/ruflo> | PR #125 · Agent Studio research |
| RunMaestro/Maestro | <https://github.com/RunMaestro/Maestro> | PR #125 · Agent Studio research |
| Scrapling | <https://github.com/D4Vinci/Scrapling> | PR #128 · Agent Workforce research |
| screenshot-to-code | <https://github.com/abi/screenshot-to-code> | PR #130 · Deep Research research |
| security | <https://docs.openclaw.ai/security/> | PR #125 · Agent Studio research |
| sherpa-onnx streaming T-One Russian | <https://github.com/k2-fsa/sherpa-onnx/blob/master/docs/source/onnx/pretrained_models/online-ctc/t-one-ctc-models.rst> | PR #129 · Voice research |
| slee-persis/GVS5H | <https://github.com/slee-persis/GVS5H> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| slvDev/esp32-ai | <https://github.com/slvDev/esp32-ai> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Starter Workflows | <https://github.com/actions/starter-workflows> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Strix | <https://github.com/usestrix/strix> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Surya 2 | <https://github.com/datalab-to/surya> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| SWE-agent | <https://github.com/SWE-agent/SWE-agent> | PR #128 · Agent Workforce research |
| SWE-bench | <https://www.swebench.com/> | PR #125 · Agent Studio research |
| Tabby | <https://github.com/TabbyML/tabby> | PR #128 · Agent Workforce research |
| taste-skill | <https://github.com/Leonxlnx/taste-skill> | docs/TECHNIQUE_REGISTER_RU.md |
| Temporal | <https://docs.temporal.io/ai> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #125 · Agent Studio research |
| TensorFlow | <https://github.com/tensorflow/tensorflow> | PR #128 · Agent Workforce research |
| Trail-Code | <https://github.com/trailhq/Trail-Code> | docs/TECHNIQUE_REGISTER_RU.md |
| TurnBench | <https://github.com/SesameAILabs/turnbench> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| Turnitout-Humanizer | <https://github.com/AhmadHassan-BTed/Turnitout-Humanizer> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Typhoon ASR Real-time paper | <https://arxiv.org/html/2601.13044> | PR #129 · Voice research |
| Typhoon ASR Streaming 115M | <https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; PR #129 · Voice research |
| Unicode CLDR transliteration guidelines | <https://cldr.unicode.org/index/cldr-spec/transliteration-guidelines> | PR #129 · Voice research |
| Unicode ICU transforms | <https://unicode-org.github.io/icu/userguide/transforms/general/> | PR #129 · Voice research |
| Unidecode | <https://pypi.org/project/Unidecode/> | PR #129 · Voice research |
| upstream | <https://github.com/invariantlabs-ai/mcp-scan> | PR #125 · Agent Studio research |
| upstream | <https://github.com/openwop/openwop> | PR #125 · Agent Studio research |
| uroman | <https://github.com/isi-nlp/uroman> | PR #129 · Voice research |
| Utopia OS | <https://github.com/0xUrsanomics/utopia-os> | PR #125 · Agent Studio research |
| UVR5 / Ultimate Vocal Remover GUI | <https://github.com/Anjok07/ultimatevocalremovergui> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| VibeVoice ASR Streaming 1.5B | <https://huggingface.co/microsoft/VibeVoice-ASR-Streaming-1.5B> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| voicebench | <https://pypi.org/project/voicebench/> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| VoxCPM2 | <https://huggingface.co/openbmb/VoxCPM2> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| whisper.cpp | <https://github.com/ggml-org/whisper.cpp> | docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md |
| witr | <https://github.com/pranshuparmar/witr> | PR #125 · Agent Studio research |
| Worktrunk | <https://github.com/max-sixty/worktrunk> | PR #128 · Agent Workforce research |
| xerj-org/xerj | <https://github.com/xerj-org/xerj> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Xiryn | <https://github.com/SouravBeraAkaSpeed/xiryn> | PR #128 · Agent Workforce research |
| xtool-org/xtool | <https://github.com/xtool-org/xtool> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| Zagitta/gpu-unlock | <https://github.com/Zagitta/gpu-unlock> | docs/OPEN_SOURCE_TRIAGE_RU.md |
| ZIPFORMER VI / sherpa-onnx | <https://github.com/k2-fsa/sherpa/blob/master/docs/source/onnx/pretrained_models/offline-transducer/zipformer-transducer-models.rst> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |
| τ-bench | <https://github.com/sierra-research/tau-bench> | PR #125 · Agent Studio research |
| веса dots.mocr | <https://huggingface.co/dots-studio/dots.mocr> | docs/MULTIMODAL_MODEL_STACK_RU.md; Multimodal stack research branch |

**Download/archive gate:** only retain artifacts that serve a concrete future project task and whose exact upstream artifact, version/commit, license/terms, SHA-256, size and redistribution permissions are recorded. Prefer source snapshots or documentation for stable reference; do not bulk-download repositories, datasets, model weights, voice assets or user data by default. Store approved items in a clearly scoped archive with a manifest and review date; keep credentials and proprietary material out.


## Offline archive entries (provenance-checked)

| Artifact | Original source | Pinned upstream | License / attribution | Local archive | SHA-256 | Size |
|---|---|---|---|---|---|---:|
| W3C WAI — What's New in WCAG 2.2 | https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ | `w3c/wai-website` commit `321da62bab5c43fe44bd6f76decd547fcf76fee9`; source blob `91ba79fbf918aa1ab14202dc5b4030a1b3087d19` | W3C Document License 2023; Copyright © 2023 World Wide Web Consortium. See `docs/upstream-archive/README.md`. Copy is unchanged; no W3C endorsement implied. | `docs/upstream-archive/w3c-wai-wcag22-new-in-22.md` | `d837a780c59ad261aaad05c31a86e195c00e71794f5b8921e01a74ba105d47a6` | 25472 B |

This is the first archived artifact: selected for the active Landing UI V2.0 accessibility acceptance work. Continue adding items only after confirming a concrete future task, exact source/version, license and redistribution conditions, and reproducible hash. Do not bulk-mirror repositories, model weights, voice assets or datasets.

## External-source first-pass — 2026-11-04

Research only; no source code or model weights downloaded. These findings refine the later artifact-acquisition queue. Upstream pages and licenses must be rechecked at the exact revision selected for adoption.

| Source | High-value pattern / current evidence | Decision for aLandi |
|---|---|---|
| [Microsoft BitNet](https://github.com/microsoft/BitNet) + [VibeASR.cpp](https://github.com/microsoft/VibeASR.cpp) + [VibeVoice-ASR-BitNet model card](https://huggingface.co/microsoft/VibeVoice-ASR-BitNet) | CPU-first low-bit inference. The quantized ASR artifact is reported at 1.58 GB, RTF < 1 with 3+ CPU threads on x86 AVX2 / ARM NEON, and MIT code/model licensing. Its currently listed language set includes English, Chinese, French, Italian, Korean, Portuguese and Vietnamese — **not Russian or Thai**. | **High-priority benchmark candidate, not an RU/TH replacement.** Consider as an optional English/other-language helper or as an engineering pattern for CPU quantization. Require exact artifact digest, target-CPU test, peak RAM, WER and concurrency comparison before download/adoption. |
| [Moonshine](https://github.com/moonshine-ai/moonshine) | On-device streaming ASR with small models and a microcontroller-oriented pipeline. Current published STT languages do not include Russian or Thai. STT license defaults to MIT with enumerated legacy non-commercial exceptions; TTS/G2P assets have separate terms. | **Keep as a voice architecture reference, not the current RU/TH transcription candidate.** Tiny VAD / keyword ideas may be worth a separate microcontroller/device evaluation. |
| [Edge0](https://github.com/Edge0-AI/Edge0) | SSD expert offload, look-ahead prerouter and recover-LoRA are interesting memory/throughput techniques. Current documented runtime is MLX on Apple Silicon; CUDA is roadmap, not current support. The 8B/35B model tiers require about 4.2/23 GB disk; reported active memory is about 1.0/2.9 GB under short-context benchmarks. Project metadata says Apache-2.0 and Alpha. | **Research-only. Not suitable for the current Linux/Ollama VPS path today.** Revisit only if a supported Linux/CUDA backend appears or there is a separate Apple-Silicon local-runtime target. |
| [OpenViking](https://github.com/volcengine/OpenViking) | Strong context-engineering ideas: one inspectable virtual filesystem for resources/memories/skills; scoped directory retrieval; L0 abstract → L1 overview → L2 details; visible retrieval traces. | **Borrow concepts, not code.** Main project is AGPL-3.0 (some subcomponents have separate licenses); avoid importing code or a new service into the current SQLite/FTS5 architecture without an explicit license and migration decision. |
| [Open Notebook](https://github.com/lfnovo/open-notebook) | Useful research data model: notebooks → scoped sources → notes/transformations, with citations and multi-provider/local model choice. Code is MIT. Its full application uses Python/FastAPI + Next.js/React + SurrealDB; the sample Docker Compose publishes UI/API interfaces broadly and documents no password by default. | **Borrow the research workflow and information model, not the application stack or deployment recipe.** Map the idea to existing project/source boundaries and explicit API contracts. |
| [Agent Skills specification](https://agentskills.io/specification) | Portable `SKILL.md` directories with YAML metadata and optional `scripts/`, `references/`, `assets/`; progressive disclosure loads metadata first, instructions on activation, and resources on demand. `allowed-tools` is explicitly experimental. | **Adopt as a format/validation reference.** Keep permission enforcement in aLandi's own runtime; never treat Skill metadata or prompt text as an authorization boundary. |
| [Harness²](https://github.com/google-research/harness2) | Recursive Propose–Probe–Compose loop; compare behavior on the same task and retain only evidence-backed harness changes. Upstream warns that its executor network access is unrestricted and sandbox is disabled by default. | **Adopt the bounded experiment pattern only.** Never run its executor/sandbox configuration as-is against project credentials or production. |
| [ECC agent-harness-construction skill](https://github.com/affaan-m/ECC/blob/main/skills/agent-harness-construction/SKILL.md) | Useful capability design checklist: action-space quality, observation quality, recovery quality, context budgets; typed/narrow tools; deterministic outputs; safe retry and stop conditions. | **Convert into local capability-contract/evaluation checks**, not wholesale plugin installation. |

### External research next actions

1. Add immutable commit/release IDs and license/NOTICE references for the shortlisted candidates.
2. Check RU/EN/TH model language coverage and task-specific golden sets before any ASR/embedding/model download.
3. Compare CPU candidates against the current model/runtime baseline on the actual target hardware; record peak RAM, disk, cold/warm latency and throughput.
4. For research UX, map the Open Notebook source/notes workflow to existing project scopes before considering any new API or storage engine.
5. For memory/context, prototype only the L0/L1/L2 progressive retrieval concept over existing stores; do not introduce OpenViking's AGPL code or a competing memory service.


## Voice / ASR model shortlist — RU / TH — 2026-11-04

This is a research shortlist, not an adoption decision. Model weights are not downloaded. Code, model weights, training data and conversion artifacts have separate provenance and must be checked independently.

| Candidate | Grounded facts | Fit / caveat | Next evaluation |
|---|---|---|---|
| [T-one](https://github.com/voicekit-team/T-one) + [sherpa-onnx T-One CTC conversion](https://k2-fsa.github.io/sherpa/onnx/pretrained_models/online-ctc/t-one-ctc-models.html) | Russian streaming CTC, 71M parameters, 300 ms chunks; original repo declares Apache-2.0 for code and models. sherpa-onnx exposes a CPU T-One CTC recognizer with one thread; converted model package is about 144 MB and expects 8 kHz audio. Upstream benchmarks specialize in telephony. | **Best current RU low-footprint candidate for telephony**, not a general multilingual dictation model. Original repo recommends at least 4 CPU cores / 8 GB RAM for smooth pipeline use. The converted package contains its own small LICENSE file that must be inspected before redistribution. | Pin upstream commit and model revision; inspect both licenses; benchmark on RU telephony + ordinary speech; compare WER, RTF, peak RSS and chunk latency on target CPU. |
| [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B) + [Qwen3-ASR runtime](https://github.com/QwenLM/Qwen3-ASR) | Apache-2.0 model and code; 1.88 GB weight file; 30 languages plus 22 Chinese dialects, including Russian and Thai; offline and streaming inference. | **Best single-model RU/TH coverage candidate.** Official streaming inference currently requires the vLLM backend; Transformers backend is the simpler offline path. Published examples are GPU-oriented; CPU-only memory/latency on an 8 GB host is not established. | Test Transformers CPU first; measure peak RSS, RTF, concurrency and long-audio behavior. Treat vLLM streaming as a separate GPU path. |
| [Typhoon ASR Streaming 115M](https://huggingface.co/typhoon-ai/typhoon-asr-streaming-115m) | 115M FastConformer-Transducer, Thai streaming, 462 MB model file, CC-BY-4.0; cache-aware chunking and 80–1040 ms latency options. Published RTF 0.020 is on H100; usage requires NeMo streaming support and example maps to CUDA. | **Strong Thai-specialist candidate for GPU evaluation**, not proven as a CPU-only VPS fit. CC-BY attribution obligations apply; review upstream and base-model chain. | Benchmark on target hardware before choosing; compare CER/latency on Thai conversational speech and code-switching. |
| [Vosk small Russian](https://alphacephei.com/vosk/models) | 45 MB, Apache-2.0, about 300 MB runtime memory for the small-model class; published WER varies by dataset (e.g. 22.71 audiobook / 31.97 YouTube for small-ru-0.22). | **Very small offline fallback / baseline**, but quality is materially lower than larger Russian candidates on some sets. | Use as a low-resource baseline; compare exact same golden clips and latency. |
| [VibeVoice-ASR-BitNet](https://huggingface.co/microsoft/VibeVoice-ASR-BitNet) | MIT; 1.58 GB quantized artifact; listed languages include English, Chinese, French, Italian, Korean, Portuguese and Vietnamese. | **Not RU/TH capable according to the current published language list.** Do not select for the primary Russian/Thai path. | Keep only as a CPU-quantization engineering reference or optional non-RU/TH experiment. |
| [Moonshine](https://github.com/moonshine-ai/moonshine) | Streaming/on-device ASR family with small and micro models; current published STT language list does not include Russian or Thai. License exceptions apply to some legacy non-English STT models; TTS/G2P licensing is separate. | **Architecture reference, not primary RU/TH candidate.** | Recheck the exact selected model's license and language list before any experiment. |

### Required ASR evaluation contract

- Use one fixed, consented golden set per language and task: Russian telephony, Russian general dictation, Thai conversational speech, Thai code-switching, noisy/mobile audio.
- Report WER for word-spaced languages and CER where appropriate; do not compare metrics from different corpora as if they were directly comparable.
- Measure cold-start load time, model disk size, peak process RSS, CPU utilization, real-time factor, first-partial latency, finalization latency, and concurrency under the actual gateway workload.
- Verify sample rate, chunking, VAD, punctuation, timestamps and text normalization separately from acoustic recognition quality.
- Keep raw audio local and ephemeral by default; do not add audio retention or send it to external inference without explicit product consent and a documented privacy boundary.
- Prefer the smallest model that meets the measured quality threshold; use task/language routing only when it improves the same golden set without excessive operational complexity.


| [GigaAM Multilingual](https://github.com/salute-developers/GigaAM) + [sherpa-onnx CTC export reference](https://huggingface.co/fussraider/GigaAM-Multilingual-sherpa-onnx-ctc) | Upstream MIT; 220M CTC model can be exported to ONNX and dynamically quantized. A published sherpa-onnx conversion provides a 225 MB int8 CPU artifact and reports informal RTF ≈0.06 on an Apple CPU with 4 threads. Fine-tuned ASR languages are Russian, English, Kazakh, Kyrgyz and Uzbek; the 70+ pretraining languages must not be mistaken for 70+ ASR output languages. Output is lowercase/without punctuation and the CTC path has no hotword/contextual biasing. | **High-priority RU/EN CPU candidate**, complementary to telephony-specialist T-one; not Thai. The third-party ONNX pack is not the upstream release, so reproduce or audit its export, pin the exact source model revision and inspect the conversion artifact license/provenance. | Run the official exporter or independently verify the third-party export; compare 220M int8 against T-one, Vosk and Qwen on the same RU/EN golden set; measure RTF/RSS on target x86 VPS. |


## Artifact acquisition checkpoint — 2026-11-05 (owner authorized downloads)

### Initial small Russian ASR candidate — Vosk

- Upstream model catalog: https://alphacephei.com/vosk/models
- Canonical official archive attempt: https://alphacephei.com/vosk/models/vosk-model-small-ru-0.22.zip
- Catalog identifies `vosk-model-small-ru-0.22` as a lightweight mobile/Raspberry Pi model, approx. 45 MB, Apache-2.0. Catalog-reported benchmark figures vary by dataset (WER: 22.71 audiobook, 31.97 YouTube, 29.89 Sova devices, 11.79 Golos crowd); use these only as upstream-reported context, not aLandi eval.
- **Acquisition state: DOWNLOADED / HASH VERIFIED / EVAL PENDING.** GitHub Actions run #41968439622, artifact #13389210196 obtained the exact archive from the official URL. Size 46,236,750 bytes; SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`. ZIP CRC, path traversal, symlink, member-count and expansion bounds passed in the runner; after transfer, SHA-256 was independently recomputed and matched, ZIP CRC/path safety checks were repeated. Provenance sidecar and SHA256SUMS are available alongside the archive. After transfer, the inner model ZIP was independently extracted in the working environment: 14 files / 91,289,240 bytes; all paths were checked for traversal/absolute paths/symlinks and ZIP CRC passed. This is a working-copy extraction, not a repository-hosted model or runtime install. License Apache-2.0 per official catalog. `ship=false`; no runtime install, target-host or RU golden-set evaluation.
- Next: run bounded RU golden-set comparison against the current whisper.cpp baseline; measure WER/CER, RTF, RAM/PSS and latency on target hardware. Keep the artifact isolated until quality, resource and product acceptance.

### Follow-up multilingual ASR candidate — Qwen3-ASR-0.6B

- Official model card: https://huggingface.co/Qwen/Qwen3-ASR-0.6B
- Official project: https://github.com/QwenLM/Qwen3-ASR
- Apache-2.0; model card lists Russian (ru) and Thai (th) support, offline/streaming inference. HF page reports the BF16 model weight file at 1.88 GB with SHA-256 `79d6cbd4c98c7bbffe9db2edac07f56cd6637d0d5944b27f6c2b8353840323ea` for that specific `model.safetensors` file; the complete model repository consists of multiple files and needs a pinned revision + per-file manifest.
- **State: RESEARCH ONLY / NOT DOWNLOADED.** Hardware RAM/latency and RU/TH quality must be benchmarked before adoption. Do not confuse model card language coverage with project acceptance.



## Modern architecture/source sweep — 2026-11-05

This is a source-and-pattern review, not an adoption decision. Upstream refs are immutable commit snapshots inspected on 2026-11-05; recheck before vendoring or runtime use.

### Agent execution, durability and approvals

- **Temporal / LangGraph durable execution:** [Temporal LangGraph plugin (2026-07-16)](https://temporal.io/blog/temporal-langgraph-plugin-durable-execution), [Temporal AI docs](https://docs.temporal.io/ai), [LangGraph checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers), [Pydantic AI durable execution](https://pydantic.dev/docs/ai/durable-execution/). Key distinction: a checkpoint persists state; durable execution also journals/replays work, handles retries and waits for approval without holding a worker. LangGraph uses `thread_id`, pending writes and explicit durability modes; resume/replay semantics must be selected intentionally. Pydantic AI documents multiple engines and explicitly limits an agent to one durable engine.
- **aLandi decision:** keep durable execution as a future architecture option, not a new dependency now. For AgentRun (#134), retain explicit parent/child lifecycle, idempotency, terminal fencing, approval binding and recovery tests before selecting an engine. Temporal adds operational infrastructure; on the current single 8-GB host, justify it with measured long-running workflow demand.

### Local-first retrieval and memory

- **XERJ:** [repository](https://github.com/xerj-org/xerj), Apache-2.0, inspected `main` commit `83c9f0d123bac010a25ca2cf02ff093b08ee68ce`. One Rust binary offers BM25, vector and hybrid search, code definition lookup, MCP and Elasticsearch-compatible APIs. The README cites a controlled 2.7x output-token reduction at equal 16/16 solve rate; treat this as upstream-reported until independently reproduced. Security warning: `--insecure` disables TLS and API-key auth; keep the default loopback boundary and never expose an unauthenticated index service.
- **Memvid:** [repository](https://github.com/memvid/memvid), Apache-2.0, inspected `main` commit `e6bd9f7b9c38cd8d5370fa0fc936ac1dcd751813`. Single-file portable memory, append-only immutable frames, checksums, versioning and time-travel. Its benchmark claims are upstream/vendor claims, not aLandi measurements. Candidate for an isolated export/archive or portable capsule experiment, not a replacement for current SQLite/FTS5 without integrity, deletion, conflict and retrieval evals.
- **RAG-Anything:** [repository](https://github.com/HKUDS/RAG-Anything), MIT, inspected `main` commit `2cd2b3329c470ccb53923f8a6d320596b34e56c5`. Useful pipeline pattern: parser → typed text/table/image/equation fragments → cross-modal relations/provenance → hybrid retrieval and citations. Full MinerU/LightRAG/VLM dependency stack is not justified on the current small host until real corpus quality, memory and latency are measured.
- **Graphify:** [repository](https://github.com/Graphify-Labs/graphify), Apache-2.0, inspected `v8` commit `59b5ab1151e031fb42e39cfc9a50bf96f2d57ae0`. Current upstream emphasizes deterministic tree-sitter code parsing, queryable graph and explicit `EXTRACTED` versus `INFERRED` edge provenance. Reuse this evidence distinction in our dev-only Graphify reports; do not add Graphify Cloud or a runtime graph database.
- **aLandi decision:** first benchmark XERJ against existing SQLite FTS5 + Graphify on a fixed local corpus and query set. Compare Recall@5, MRR, nDCG, citation correctness, cold/warm latency, RSS, index size and operational surface. Keep Memvid/RAG-Anything as separate experiments; no second retrieval runtime by default.

### Engineering workflow and product UX

- **Superpowers:** [repository](https://github.com/obra/superpowers), MIT, inspected `main` commit `22f0b463e7a5e579904dd6211a520321035526f7`. Useful process ideas: clarify intent, get owner approval on a concise spec, create a bounded implementation plan, true red/green TDD, independent review and fix-forward. Adopt the process selectively; do not install its full plugin set or grant subagents broad permissions.
- **Mobile chat/accessibility references:** retain the existing [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [GOV.UK error-message pattern](https://design-system.service.gov.uk/components/error-message/) and Playwright real-browser approach already recorded in the V1 checklist. High-value test states include streaming while scrolled away from bottom, failed/stopped/denied outcomes, keyboard-only composer, modal focus return, reduced motion, forced colors and narrow viewport/virtual keyboard.
- **aLandi decision:** no wholesale UX clone. Use these as acceptance/test patterns for independently scoped Landing V1 improvements and as V2 research inputs.

### Provenance boundary

- Repository SHAs above identify the inspected source snapshots, not a vendored dependency or approved release pin.
- MIT/Apache-2.0 repo license does not automatically cover every model weight, dataset, voice, optional parser or third-party artifact. Audit those separately and preserve NOTICE/attribution before copying code.
- No upstream source code, model weights or executable binary was copied by this research sweep.

## Owner-provided upstream sweep — 2026-11-07 (research only)

This pass covers the owner-supplied names. Revisions below are exact upstream branch HEADs fetched on 2026-11-07; project descriptions and license statements were checked against upstream README/license/docs or release pages. This is source validation, **not an adoption, install, download, code copy, or runtime approval**.

| Candidate / exact upstream revision | Declared code license / scope | Verified capability and relevant caveat |
|---|---|---|
| [JustVugg/flint](https://github.com/JustVugg/flint) — `610f68a53374a64046de9f46e7dcd3ae758a4778` | Apache-2.0 | Python 3.11+, Linux/WSL, standard-library core. Reversible code/JSON/text compression, focused source reads, source-version-bound edits and decision memory. Upstream demo reports one 12-record JSON example (1,226→499 bytes), not a general token-saving guarantee. |
| [airene/flint](https://github.com/airene/flint) — `e883c88997dc7c626fa45331aa1a86de7ad65d62` | MIT | Different project with the same name: local-first Developer + read-only Reviewer workspace using Codex/Claude CLI, Vue/TypeScript/Bun, SQLite and WebSockets. Human approves review feedback before it returns to the exact Developer session. **“Flint” identity remains ambiguous; do not silently choose one.** |
| [DashBeam](https://github.com/tonyantony300/dashbeam) — `b41eddb16b226667de6f8dd7f1326a0ce6bf5e7d` | AGPL-3.0 | Cross-platform P2P file transfer built on Iroh/QUIC/TLS 1.3, BLAKE3 blobs, pairing and optional self-hosted relays. Latest release inspected: v0.7.2; it fixes an `iroh-blobs` push-permission issue by updating to 0.103.1. Do not evaluate older affected dependency versions as a baseline. |
| [img2threejs](https://github.com/img2threejs/img2threejs) — `0c0c49bc168e648dbaf9c8c080474de0b3a941b6` | Apache-2.0 | Agent workflow reconstructs a reference object as procedural Three.js/TypeScript geometry, not photogrammetry or downloaded mesh assets; staged quality checks and animation-ready hierarchy. Useful only for a future image→3D creation path. |
| [ArchiveBox](https://github.com/ArchiveBox/ArchiveBox) — `ee80665df21054102cd6d6fa9f524f7924c1abef` (`dev`) | MIT | Self-hosted web preservation to HTML/PDF/PNG/TXT/JSON/WARC/SQLite, CLI and APIs; Django/Python, SQLite/filesystem and multiple extractors including Chromium/yt-dlp. Security docs warn that cookies, session state and secret URL tokens can be captured; archived JavaScript is untrusted. Private archives require strict access controls and safe replay configuration. |
| [SearXNG](https://github.com/searxng/searxng) — `ac11e14c5edf995d4d2f066bfb885a614f52a978` | AGPL-3.0-or-later | Self-hosted privacy-oriented metasearch across external engines. Official deployment docs require configuration, secret key and operational controls; limiter and image proxy are recommended. Outbound engine traffic, rate limits and public-instance abuse remain operator concerns. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) — `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846` | MIT | Coding-agent Skill/ruleset emphasizing minimal necessary code while retaining tests, security, error handling and accessibility. Upstream benchmark figures are author-reported; not independently reproduced. Existing aLandi minimal-diff rules already overlap substantially. |
| [changedetection.io](https://github.com/dgtlmoon/changedetection.io) — `09619ffddb40300e6c09374a4f6aa9af8bab0c3d` | Apache-2.0 | Self-hosted URL/page change monitoring with scheduled fetchers, Chromium for JS pages, selectors/filters and notifications/webhooks; can use local or remote LLMs for change summaries. Treat monitored URLs and browser fetches as SSRF/untrusted-network inputs; enforce allowlists, DNS/IP checks, egress and resource budgets before any integration. |
| [LocalSend](https://github.com/localsend/localsend) — `92e133aa43869e94d394fd04fa70c50a0f796a64` | Apache-2.0 | Cross-platform nearby file/message transfer over LAN without cloud. REST/HTTPS, multicast discovery, certificate fingerprints and PIN support. App does not auto-update; protocol v2.2 is separately documented at [localsend/protocol](https://github.com/localsend/protocol) (`62bd3406ec80d62f2ed46269cdc06c4dcc391083`). Protocol's browser reverse-download path uses plain HTTP because browsers reject self-signed certificates; do not expose it as a trusted browser integration. |
| [MiroFish](https://github.com/666ghj/MiroFish) — `7657031ac01184afe2cb220f5ee3545573b5e843` | AGPL-3.0 | Multi-agent social simulation with graph/memory construction, environment setup, simulation and reports. Its own FAQ says it must not be equated with a scientifically calibrated classical agent-based model; outputs are scenarios, not validated forecasts. Latest branch commit inspected is 2026-10-01, older than most candidates in this sweep. |
| [Edge-Drop](https://github.com/Deepender25/Edge-Drop) — `31ac86cfabed483960ef985e671074500df779f2` | Apache-2.0 | Windows 10/11 Electron clipboard shelf with hover activation and native drag/drop for text, links, images and files. Desktop-only OS integration; not a browser feature or cross-device transfer protocol. |
| [Craft Anything](https://github.com/storytold/craft-anything) — `f672d50f0103983ca8149d80a5103f12e91b888c` | MIT OR Apache-2.0 (dual) | Early-alpha Rust reverse-engineering/inspection + agent rebuild/check workflow; CLI/MCP and a large tool surface. Claude Code builder path is reported working; other agent adapters are not all live-verified. High-risk inspection/decompilation and generated-code execution require isolated workspaces, explicit approval and legal review. |
| [Microsoft Agent Lightning](https://github.com/microsoft/agent-lightning) — `bc3a9e80417d731744040df5d37117f9cc48005f` | MIT | Agentic RL/training framework with Trainer (verl/vLLM), API Gateway and rollout controller, including Kubernetes Jobs. Training infrastructure, GPU and dataset/reward evaluation are distinct from aLandi's inference runtime; not a fit for the current small VPS baseline. |
| [Datalab Marker](https://github.com/datalab-to/marker) — `71dd5fd7e51ab24f8624b6ba2fcb6014b4e40ed4`; [Surya](https://github.com/datalab-to/surya) — `9d5aadfebb07939755c24e8a80d0e61b3be80895` | Code Apache-2.0; Marker/Surya model weights have separate modified AI Pubs OpenRAIL-M terms | Marker parses PDF/image/PPTX/DOCX/XLSX/HTML/EPUB to Markdown/JSON/HTML and can use OCR/VLM on CPU/GPU/MPS; Surya supplies OCR/layout/table models. Datalab's hosted API is a separate service and terms/data-retention contract. **Do not infer commercial rights for weights from the code license.** Compare against current parser on the same corpus and target hardware before adoption. |
| [diagram-design](https://github.com/cathrynlavery/diagram-design) — `e57eda6102a19444538ebd611d39534fad65b663` | MIT | Agent Skill creates self-contained HTML+SVG diagrams (45 types) and brand tokens. Output is publishable but not a native editable diagram source; README itself recommends Mermaid for diagrams that need frequent Git diffs. Review `PRIVACY.md` and network behavior before installing the Skill. |
| [HarnessRouter](https://github.com/HarnessRouter/harnessrouter) — `46d2cc2167ea257f8c4c99eada5297af300b01ab` | Community Edition Apache-2.0; Starter Kits have separate terms | Unified Harness Protocol / Responses-compatible interface for external agent CLIs: sessions, streaming, files/artifacts, cancellation and structured failures. The harness CLIs retain their own licenses and are installed separately. Promising architecture reference, but requires security review of process isolation, credentials, permissions, idempotency and resource limits before any pilot. |
| [Sound Center](https://github.com/Azare77/sound_center) — `f3b465a42d12c2d702d7110838be5d8d1377dd96` | GPL-3.0-or-later | Flutter local music/podcast player with downloads, background playback and MPRIS; Android/Linux focus. It is a player, not an audio-generation engine. GPL obligations make code reuse a separate legal decision. |
| [PocketPal AI](https://github.com/a-ghorbani/pocketpal-ai) — `34f561bf8cdcf63b85ecaa58a535541bd07dd3ff` | MIT app code; each model/voice asset has its own terms | Mobile on-device LLM app with llama.cpp/GGUF, Whisper input and on-device TTS engines, offline operation and hardware acceleration. Good mobile architecture/evaluation reference; model weights, voices and optional hosted/search features need separate license/privacy review. |
| [sammyZi/pdf-tools](https://github.com/sammyZi/pdf-tools) — `6a48d60ccbbaca4dd18840b9d85f00d44b51f311` | MIT app code; third-party libraries/models retain their own terms | Android-only PDF scanner/editor with 24 tools, on-device OCR and optional Drive sync. Third-party notices list Apache-2.0 libraries plus Google ML Kit terms; DocAligner model is separately identified. Reference for mobile PDF UX, not a browser runtime dependency. |

### Triage outcome

- **Keep as research references:** all entries above. No source was downloaded, installed, copied or enabled.
- **Highest-value next evaluations:** SearXNG adapter security/quality against the current search path; Marker/Surya against the current document parser; changedetection.io as a bounded upstream-watch service; HarnessRouter only as a future harness-contract comparison; LocalSend only if a native companion is approved.
- **Do not promote by popularity or upstream claims:** MiroFish forecasts, Ponytail/img2threejs/Marker benchmark claims, and repo star counts are not aLandi eval evidence.
- **License gates:** AGPL (DashBeam, SearXNG, MiroFish), GPL (Sound Center), separate model-weight terms (Datalab/Surya, PocketPal) and third-party CLI terms (HarnessRouter) need explicit legal/provenance decisions before code or artifact reuse.
- **No automatic installation:** Skills and repos are untrusted inputs. Inspect scripts/hooks/network access, dependency manifests, permissions and licenses first; use pinned commits and isolated pilots.

### GitHub Pages / Jekyll production baseline — 2026-11-07

- GitHub's latest release for [actions/jekyll-build-pages](https://github.com/actions/jekyll-build-pages/releases) is still **v1.0.13** (published 2024-08-06); tag `v1` resolves to commit `44a6e6beabd48582f863aeeb6cb2151cc1716697`. No newer upstream release was found on 2026-11-07.
- Production main deployment #42362476364 is the GitHub-managed dynamic workflow `dynamic/pages/pages-build-deployment`, not a repository-authored deploy workflow. Its jobs explicitly pulled `ghcr.io/actions/jekyll-build-pages:v1.0.13`, passed **Build with Jekyll**, uploaded the artifact and passed **Deploy to GitHub Pages** on main `69645ff357067f3656aa77cc67336ff423c26944`.
- The separate [actions/deploy-pages](https://github.com/actions/deploy-pages/releases) latest release is v5.0.1 (2026-09-01), but this repository's current production path is GitHub-managed dynamic Pages; do not add a parallel deploy workflow or replace the working path without evidence.
- Live cache-busting fetch returned **AI Mobile Agent v10.0** for both root and `/landing/`. The current main `index.md` blob `227223d78bb3be1d07422767a29a5ec3fd8df42a` does **not** contain `ai_ui_readability_v1` or `readingFontSize`; PR #166 current branch blob `8f36175b9b906d835c1aeea89bf3a516157d0388` contains both. Therefore Pages is publishing current main correctly, but the specific §8.17 change is not on main because PR #166 is still open.


## 2026-11-08 — orchestration, retrieval, local inference, voice and artifact-hosting sweep

**Inventory baseline:** this file contains 296 distinct URL references and 175 distinct GitHub repository URLs at this snapshot. These are references, not 296 validated products. Results below were reviewed as candidates against primary docs/repositories and the aLandi target profile.

### Durable agent execution and approvals

- [Conductor durable execution semantics](https://conductor-oss.github.io/conductor/architecture/durable-execution.html): persists workflow definitions, state, task executions and queues; task delivery is at-least-once. A side effect can run twice after a worker crash, so workers need idempotency or redelivery detection. **Decision:** adopt the engineering patterns (idempotency keys, explicit retries/timeouts, bounded budgets, durable approval checkpoints and recovery drills); do not add Conductor/Temporal as another runtime to the initial 8-GB stack.
- [Temporal LangGraph plugin announcement](https://temporal.io/blog/temporal-langgraph-plugin-durable-execution), 2026-07-16: public-preview integration runs graph nodes as durable activities and supports durable human interrupts. **Decision:** source-validated; not a current dependency. Revisit only if aLandi has long-running workflows that cannot be safely resumed by its existing gateway lifecycle.
- **Scope:** aLandi's current four-stage planner → researcher → critic → synthesizer pipeline remains bounded and uses the selected model. This research does not authorize an independent multi-agent fleet or a new orchestration database.

### Code navigation and repository harness

- [Graphify](https://github.com/Graphify-Labs/graphify) remains the existing dev-only code-navigation pilot. [CodeGraph](https://github.com/optave/ops-codegraph-tool/) was verified at upstream HEAD `580aaa97e9e87fa65b4560f91113904fe75291bd`; its LICENSE is Apache-2.0 (`8b8a2fece4804db74af7474d6664a28964b0cab7`). Its README describes a local SQLite/tree-sitter graph, 34 MCP tools, architecture rules/CI gate, incremental indexing and optional local embeddings; it claims zero network calls/telemetry for the local path. Those are upstream claims, not yet independently verified. **Decision:** promote CodeGraph to PILOT CANDIDATE, not replacement. Compare 10 real aLandi navigation tasks against Graphify and direct grep/source reading; measure correct entry-point recall, call-site precision, false edges, index time, peak RAM, incremental update time and reproducibility. Do not install until the disposable pilot is ready. For critical edits, graph output remains a navigation hint; verify source and callers directly.
- [AI-native repository architecture](https://www.vikramrao.me/architecture/ai-native-repository), 2026-10-05, and [GitLab AI-assisted development playbook](https://handbook.gitlab.com/handbook/engineering/workflow/ai-assisted-development/): practitioner guidance favors one behavioral instruction file, a task-routing index, bounded read-only discovery, restricted implementation scope and deterministic CI validators. **Decision:** incorporate these principles in `AGENTS.md` and the existing orchestrator; do not copy a separate multi-agent harness or create a second backlog.

### RAG and document processing

- [Docling technical report](https://arxiv.org/html/2408.09869v4): MIT-licensed structured document representation supports text, tables, pictures, hierarchy, page and bounding-box provenance. The report's older x86 CPU benchmark measured 0.79 s/page median and 16.3 s/page p95; OCR averaged 13 s/page in that setup. A separate [Docling 2.148.0 performance measurement](https://docling.org/performance/) (2026-11-06, one 9-page PDF on 4 vCPUs / 15 GB RAM) reports 6.6 s/page default, 1.8 s/page with OCR disabled, and ~15 s/page for scanned input. These are different datasets/configurations, not directly comparable. **Decision:** retain parser → structured elements → provenance → retrieval → citations as the design pattern; gate OCR by document type and budget; benchmark a representative aLandi corpus before choosing an ingestion worker.
- [RAG-Anything failure-mode guide](https://github.com/HKUDS/RAG-Anything/blob/main/docs/multimodal_rag_failure_modes.md): useful failure probes include merged/flattened tables, retrieval biased toward surrounding text instead of images/tables, and confusing slow OCR with a hang. **Decision:** add these as evaluation cases when multimodal ingestion is next changed; do not install the full framework.
- Keep the existing scoped RAG, evidence ledger, citations and retrieval evaluation. A multimodal parser is not proof of multimodal retrieval quality; probe each modality independently.

### Local inference and speech

- [llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/HEAD/tools/server/README.md): OpenAI-compatible APIs, parallel decoding, continuous batching, speculative decoding, CPU/GPU offload and quantized KV cache are supported. **Decision:** retain Ollama for the current runtime; benchmark llama.cpp only if a measured bottleneck (memory, concurrency, throughput or API capability) justifies a controlled alternative.
- [Qwen3-ASR upstream](https://github.com/QwenLM/Qwen3-ASR) supports 0.6B/1.7B models and 52 languages/dialects including Russian and Thai; the [official Hugging Face 0.6B model card](https://huggingface.co/Qwen/Qwen3-ASR-0.6B) declares Apache-2.0 and lists 1.88 GB unquantized weights. The upstream Python streaming example uses vLLM; [sherpa-onnx Qwen3-ASR docs](https://k2-fsa.github.io/sherpa/onnx/qwen3-asr/index.html) separately provide an int8 0.6B export and CPU/mobile streaming paths. **Decision:** high-priority ASR candidate for a bounded RU/TH benchmark, not installed or selected yet. Pin the exact sherpa artifact/revision/hash; measure peak RSS, RTF, p50/p95 latency, WER/CER and cancellation before promotion.
- [Moonshine available models](https://moonshine-voice.readthedocs.io/en/latest/models/available-models/): current streaming MIT models cover several languages, but the current table does not include Russian or Thai; older non-streaming non-English models can carry the Community License. **Decision:** not the default RU/TH candidate; check each exact model/license separately.
- [OpenVoiceStream](https://github.com/Seeed-Solution/openvoicestream) was verified at upstream HEAD `151b156dee2eb67f710df8347d1b4ddb449f2787`; LICENSE is MIT (`5d684641646a1cc872cd9a9f040a37b77ec618bc`). Its README is hardware-first (Jetson, Rockchip, Hailo, Raspberry Pi), with per-accelerator quantization and target-specific runtimes. **Decision:** useful edge-voice reference if a dedicated device is selected; not a generic 8-GB x86 VPS stack and not installed.

### Model and binary acquisition policy — hard platform constraint

- [GitHub repository limits](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits): regular Git objects above 100 MiB are blocked; GitHub recommends Git LFS for large binaries and keeping repository health manageable.
- [Git LFS documentation](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage): Git LFS stores pointer files, not the model bytes, and **Git LFS cannot be used with GitHub Pages sites**.
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits): Pages source repositories are recommended at ≤1 GB and published sites are limited to 1 GB.
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases): each release asset must be under 2 GiB.
- **Decision:** keep code, manifests, downloader/verification scripts, licenses and SHA-256 provenance in the repository. Store weights in a dedicated model cache/registry or a governed Release asset when per-file size and redistribution rights allow. Never put weights into the Pages-published tree or commit an unbounded model corpus. User authorization to acquire useful artifacts does not waive license, size, security or target-hardware checks.

- **Existing source snapshots:** selected RAG-Anything v1.4.1 and Memvid v2.0.140 source files already exist under `docs/upstream-archive/` on main. Their archived `raganything/parser.py` and `src/types/manifest.rs` Git blob SHA-1 values exactly match the official upstream tags. PR #169 adds the exact upstream MIT / Apache-2.0 LICENSE files and `UPSTREAM-MANIFEST.yaml` records (tag, full commit SHA, package license, archive scope and verified file hashes). These snapshots are research/reference only, not runtime dependencies. `.graphifyignore` now excludes them from the first-party architecture graph.

**Batch outcome:** techniques accepted for bounded use: idempotent side effects, durable checkpoints/approval records where needed, modality-specific RAG probes, source/page/bbox provenance, exact model artifact pinning and measured model evaluation. Framework/runtime replacements remain DEFERRED pending a concrete baseline failure.


## Source review — repository orchestration and durable handoff (2026-11-08)

**Research batch:** owner-requested cross-cutting sweep across agent execution, repository orientation, CI/release controls and security. Findings are source-derived; product adoption below is a separate aLandi proposal.

### Primary / practitioner references

- [OpenAI Agents SDK — Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents): explicit runner loop, select one state continuation strategy per conversation, await stream completion, resume paused approval from state rather than treating it as a new turn, distinguish expected pauses from runtime/validation failure.
- [OpenAI Agents SDK — Multi-agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/): manager-as-tools vs handoff are distinct ownership contracts; use structured outputs/code routing for deterministic control where appropriate; invest in specialized tasks, monitoring and evals.
- [Temporal — LangGraph plugin durable execution (2026-07-16)](https://temporal.io/blog/temporal-langgraph-plugin-durable-execution) and [Temporal AI durable orchestration](https://docs.temporal.io/ai): checkpointing state is not itself durable execution; recovery requires an execution journal/runner, retries, durable waits/approval and trace propagation. Temporal is vendor documentation; infrastructure cost/operational fit must be evaluated, not assumed.
- [LangGraph — workflows and agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents) and [checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers): explicit graph/checkpoint boundaries aid inspection and resume, but replayed nodes and side effects need idempotency and intentional durability modes.
- [GitLab AI-assisted development playbook](https://handbook.gitlab.com/handbook/engineering/workflow/ai-assisted-development/): tests and structural constraints should persist in CI/repository rather than prompt-only; use characterization tests before refactors; root instructions route to canonical detail.
- [GitHub — Beyond code generation: agentic engineering (2026-11-06)](https://github.blog/ai-and-ml/github-copilot/beyond-code-generation-a-developers-guide-to-agentic-engineering/): agree requirements/acceptance first, break into bounded issue/task work, plan/review before implementation.
- [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) and [Graphify architecture docs](https://docs.graphify.com/concepts/architecture): code-only AST extraction can be deterministic/local, while semantic docs/media indexing may call a model; extracted vs inferred edges should be distinguished. Graph output is a navigation aid, not proof or complete static analysis.
- [GitHub — required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks): required checks must match latest SHA; earlier SHA success does not satisfy current HEAD.
- [GitHub — merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue): queue checks run on the combined latest-base commit and need merge_group event support. Useful if concurrent PR throughput increases; not a reason to add a queue without validating repo settings/workflow triggers.
- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site): Pages Actions publication has build → artifact → deployment steps; verify actual deployment/public content separately from CI build.
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) and [NIST AI RMF / GenAI profile](https://www.nist.gov/itl/ai-risk-management-framework): risk framework references for agency, data disclosure, injection, supply chain and governance; use as threat/eval coverage, not as runtime permission engine.

### Reusable findings and aLandi fit

1. **One writer, bounded slice; parallelize read-only discovery.** Shared repo writes and sequential dependent updates otherwise cause PR proliferation, stale snapshots and conflicting checkpoints.
2. **External durable state is the recovery contract.** Persist task ID, current main/base/head/tested SHA, exact run IDs/results, diff summary, blocker, rollback and next action in GitHub canonical records; never depend on chat memory.
3. **One canonical task inventory + one systems map + one navigation index.** Root instructions stay concise and route to deeper source files; do not clone the backlog into agent memories.
4. **Tests/CI encode invariants.** Owner rules like no dangling completed PR, exact-head gating, provider exclusivity, Pages live-SHA verification and permission boundaries should be executable checks where feasible, not prompt-only wishes.
5. **Checkpointing vs durable execution is a distinct architectural decision.** Current bounded same-model pipeline/AgentRun prototype does not yet require Temporal/LangGraph runtime. Adopt a durable engine only after measured long-running recovery/approval demand, failure-injection evals, idempotency contract and target-host budget justify operations.
6. **Graphify supports navigation, not authority.** Read the graph/report plus source/test call sites; label inferred links; account for parser gaps, excluded test files and token-budget truncation. Never mark feature implemented from graph output.
7. **Merge discipline:** exact current-head required checks, compatibility/diff review, guarded merge, post-merge main checks and Pages deployment/content check; completed PR is closed immediately. Draft/HOLD/future work remains parked only by explicit scope/owner decision and durable recorded disposition.
8. **Source and artifact admission:** source exact revision, code/model/data licenses separately, integrity hash, provenance, maintenance, security, resource fit, isolated pilot and rollback. No mass model downloads and no weights in Pages source tree/Git LFS.

**Adoption status:** operating-method proposal applied to the PR #169 English AGENTS contract and append-only owner task register; not yet merged/verified on main. No orchestration engine, model, plugin, or dependency was installed/adopted in this research batch.


### Artifact acquisition checkpoint — pinned source snapshots (2026-11-08)

Owner-authorized, license/provenance-gated source import in PR #169: Memvid v2.0.140 curated 22-file subset under Apache-2.0 (upstream commit e18fe55494379e2ab7397ce03655e8abbc5e0c31) and RAG-Anything v1.4.1 selected 18 source files plus exact MIT license (upstream commit 0ef67b4d476b66407a03a39e5b17e756fc0aef29). Each selected source file Git blob SHA-1 was matched to its pinned upstream commit; Memvid upstream per-file SHA-256 values retained but not recomputed. The snapshots are incomplete research references, not buildable mirrors; transitive libraries/models/datasets are separately licensed. `ship=false`, no runtime dependency/model installed, no deployment. Whole selected archive SHA-256 remains OPEN.


## PR #131 / #125 source intake — 2026-11-08 (candidate batch; not yet current-version reviewed)

The following 103 distinct URL references were absent from the existing INTEL register and were found in the preserved research/spec snapshots from PR #131 and PR #125. They are retained for source-by-source thematic review; source presence is not endorsement/adoption. See the linked canonical research documents under `docs/`. Review in 8–15 source batches, record exact version/license/provenance and baseline comparisons before adoption.

| URL | Origin research document | Review status |
|---|---|---|
| `https://ai.google.dev/gemini-api/docs/veo` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://ai.google.dev/gemma/docs/core/model_card_3` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://developer.chrome.com/docs/capabilities/web-apis/file-system-access` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md, LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-text` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.comfy.org/api-reference/v2/jobs/job-status-the-polling-workhorse` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.comfy.org/api-reference/v2/jobs/request-cancellation` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.comfy.org/api-reference/v2/jobs/submit-a-workflow-for-execution` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.dev.runwayml.com/llms.txt` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reference/managing-and-standardizing-pull-requests` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners` | REPOSITORY_HYGIENE_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.letta.com/v1-sdk/memory/archival-memory/index.md` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.letta.com/v1-sdk/memory/memory-blocks/index.md` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.livekit.io/agents/logic/turns/vad/` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.mistral.ai/models/ministral-3-3b-25-12` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.ollama.com/api/tags` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openhands.dev/openhands/usage/sandboxes/overview` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openhands.dev/openhands/usage/sandboxes/process` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://docs.openviking.ai/en/getting-started/02-quickstart` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://fastapi.tiangolo.com/reference/security/` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://ffmpeg.org/` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/a2aproject/A2A` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/AIEGOBOT/agent-audio` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/AnotiaWang/deep-research-web-ui` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/cedar-policy/cedar` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Comfy-Org/ComfyUI` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md, LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Comfy-Org/workflow_templates` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/crewAIInc/crewAI` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/dbos-inc/dbos-transact` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/docling-project/docling` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md, VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/docling-project/docling/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/app.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/routing.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/tests/test_app.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/gateway/tests/test_document_extraction.py` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/index.md` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/blob/main/tests/e2e/document-attachments.spec.mjs` | OUTPUT_LIMITS_AND_AGENT_ORCHESTRATION_AUDIT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/DorpNay/skills-github-pages/issues/111` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/firecracker-microvm/firecracker` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/ggerganov/whisper.cpp` | VOICE_IMPLEMENTATION_PLAN_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/google/gvisor` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/hatchet-dev/hatchet` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/jgm/pandoc` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/khoj-ai/khoj` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/langchain-ai/open_deep_research` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/LearningCircuit/local-deep-research` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/letta-ai/letta` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/mem0ai/mem0` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/MODEL_CARD.md` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/microsoft/markitdown/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/microsoft/semantic-kernel` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/modelcontextprotocol/registry` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/nats-io/nats-server` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/NVIDIA/garak` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/open-policy-agent/OPA` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/promptfoo/promptfoo` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/pydantic/pydantic-ai` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/PyThaiNLP/pythainlp/blob/dev/LICENSE` | VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/restatedev/restate` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/samsgates/doc-parse` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/UKGovernmentBEIS/inspect_ai` | AGENT_ORCHESTRATION_RESEARCH_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/unicode-org/icu/blob/main/LICENSE` | VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Unstructured-IO/unstructured` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/docs/FAQ.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/docs/GETTING_STARTED.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/docs/VIDEO_CONVERSION.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/VERT/blob/main/README.md` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/vertd` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/VERT-sh/vertd/blob/main/LICENSE` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://github.com/Wan-Video/Wan2.2` | LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/google/functiongemma-270m-it` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/google/gemma-4-E2B-it` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/google/gemma-4-E4B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/HuggingFaceTB/SmolLM3-3B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/ibm-granite/granite-3.3-2b-instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/ibm-granite/granite-4.2-3b` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/microsoft/Phi-4-mini-instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/openbmb/MiniCPM5-2B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3-0.6B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3-1.7B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3.5-0.8B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3.5-2B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/Qwen/Qwen3.5-4B` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://huggingface.co/tiiuae/Falcon-H1-1.5B-Instruct` | AGENT_MODEL_BAKEOFF_RU.md | prior research snapshot; current upstream recheck pending |
| `https://microsoft.github.io/graphrag/query/overview/` | FIRST_FREE_LAUNCH_BACKLOG_RU.md | prior research snapshot; current upstream recheck pending |
| `https://openvoiceindex.com/` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md | prior research snapshot; current upstream recheck pending |
| `https://playwright.dev/docs/browsers` | SOURCE_SELECTION_AND_AUTONOMY_METHOD_RU.md | prior research snapshot; current upstream recheck pending |
| `https://playwright.dev/docs/ci` | SOURCE_SELECTION_AND_AUTONOMY_METHOD_RU.md | prior research snapshot; current upstream recheck pending |
| `https://stability.ai/license` | LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md | prior research snapshot; current upstream recheck pending |
| `https://web.dev/articles/storage-for-the-web` | DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |
| `https://www.libreoffice.org/` | VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md | prior research snapshot; current upstream recheck pending |


## 2026-11-13 — model, voice and OCR artifact group recheck

**Source groups revisited for this workstream:** local inference/model cards; embeddings and rerankers; ASR/VAD/TTS and per-voice license lineage; CPU OCR language data; model-format security and GitHub artifact storage limits. Canonical grouped intake remains INTEL.md plus the targeted inventories in docs/AGENT_MODEL_BAKEOFF_RU.md, docs/MULTIMODAL_MODEL_STACK_RU.md, docs/VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md and docs/ALANDI_N2O_CHATGPT_SOURCES_RU.md.

### Main model and security

- [HauhauCS Qwen3.5-4B Uncensored](https://huggingface.co/HauhauCS/Qwen3.5-4B-Uncensored-HauhauCS-Aggressive), revision c09cdbcdb1fefad6d335809d445621b5f5ba0c6e: Q4_K_M is 2,707,513,696 bytes; HF LFS SHA-256 79e28ecacf84e75b6056cf4059636d435aa9eb67795780f7b7dbc7d32a962741; model card metadata says Apache-2.0. This is the current owner-preferred primary candidate; owner supplies the main checkpoint to the server, so the repository downloader excludes it. The 675,568,768-byte BF16 vision projector is separately pinned.
- The author's 465-case / zero-refusal statement is an author-reported result, not independent evidence or an aLandi evaluation.
- [Palo Alto PAIT-GGUF-100 definition](https://insights-db.paloaltonetworks.com/knowledge-base/deserialization-threats/PAIT-GGUF-100): informational detection that a GGUF includes a Jinja chat template; the documented check did not find known sandbox-escape patterns. This is distinct from PAIT-GGUF-101, which flags arbitrary code execution patterns. Review the template against official Qwen3.5 base and use a trusted override where required. Do not mislabel PAIT-GGUF-100 as proof of malware or as a clean bill of health.

### Conditional RAG models

- [Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) is Apache-2.0; its full HF model.safetensors is 1,191,586,416 bytes (SHA-256 0437e45c94563b09e13cb7a64478fc406947a93cb34a7e05870fc8dcd48e23fd) and is retained as provenance only. **Runtime choice:** [Ollama qwen3-embedding:0.6b-q8_0](https://ollama.com/library/qwen3-embedding:0.6b-q8_0), approx 639 MB, digest prefix ac6da0dfba84; use native /api/embed only during RAG.
- [Qwen3-Reranker-0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B), revision e61197ed45024b0ed8a2d74b80b4d909f1255473: Apache-2.0; model.safetensors 1,191,588,280 bytes; SHA-256 27cd75a405b9c1b46b59abfd88aaa209e6fed2a1972cde9b70e7659537c5e65b.
- **Decision:** both are conditional RAG workers only. Do not route ordinary chat through either model. Embedding and reranking are separate eval gates; one resident helper at a time on the 8-GB profile.

### ASR, VAD and TTS

- [Qwen3-ASR-0.6B](https://huggingface.co/Qwen/Qwen3-ASR-0.6B), revision 5eb144179a02acc5e5ba31e748d22b0cf3e303b0: Apache-2.0; 1,876,091,704-byte weights; SHA-256 79d6cbd4c98c7bbffe9db2edac07f56cd6637d0d5944b27f6c2b8353840323ea; upstream lists 52 languages/dialects including Russian and Thai. Keep as an ASR challenger; existing gateway adapter is whisper.cpp.
- [Whisper large-v3-turbo Q5_0](https://huggingface.co/ggerganov/whisper.cpp/blob/98aa99a0a9db05ae2342309f5096248665f7cba3/ggml-large-v3-turbo-q5_0.bin): 574,041,195 bytes; SHA-256 394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2. This is the pinned baseline for the existing CLI integration.
- [Silero VAD](https://github.com/snakers4/silero-vad/tree/066409f3d9db45a30d21dfcbf9147826ffdd7052): 16k OP15 ONNX 1,289,603 bytes; MIT; exact upstream Git blob SHA-1 pinned in the manifest.
- [Piper v1.8.0](https://github.com/OHF-Voice/piper1-gpl/releases/tag/v1.8.0) is GPL-3.0-or-later. Release adds Thai phonemization via TLTK, not a Thai voice checkpoint.
- [Piper voice licensing guide](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/LICENSING.md) requires walking each voice's dataset and fine-tune base chain. Current dmitri medium (voice repo revision 2f358b6a560e3a913ebf509b2f3344f20b367f94) uses CC0 direct data and hifi_tts_92 CC-BY-4.0 base. Current joe medium uses CC0 direct data and rdh CC0 base. The old 2023 Lessac-derived dmitri/lessac chain is research-only; do not substitute.
- [F5-TTS-THAI](https://huggingface.co/VIZINTZOR/F5-TTS-THAI) has CC-BY-4.0 card metadata, but its [F5 base checkpoint](https://huggingface.co/SWivid/F5-TTS) is CC-BY-NC-4.0. **Decision:** defer Thai voice download/production pending derivative-rights clarification. The existence of Piper's Thai phonemizer does not establish a licensed Thai voice.

### OCR and document intake

- [Tesseract tessdata_fast](https://github.com/tesseract-ocr/tessdata_fast/tree/87416418657359cb625c412a48b6e1d6d41c29bd): Apache-2.0; CPU-first integer LSTM language data at exact pinned commit: English 4,113,088 bytes, Russian 3,861,738 bytes, Thai 1,072,600 bytes. Use LSTM OEM 1. This is an OCR fallback, not layout/table/document understanding.
- Retain the existing Docling / GLM-OCR / PaddleOCR-VL comparison plan for complex documents; do not install a large VLM on the 8-GB VPS without same-host RAM/latency measurements and exact weight licensing.

### Acquisition outcome and policy

- models/artifacts.manifest.json and scripts/download_model_artifacts.py now pin selected revisions, artifact sizes and SHA-256/Git blob SHA-1. Expected exact external-cache payload is 6,033,970,026 bytes; the Ollama base-model and embedding references add about 3,939,000,000 bytes in Ollama's own model store. Both exclude the owner-supplied main Q4 checkpoint and tokenizer/config overhead.
- Actual downloads did **not** complete in this engineering container: outbound DNS returned Temporary failure in name resolution. The downloader is prepared for a network-enabled workstation/server. No artifact is marked installed or runtime-verified.
- Keep all weights outside the GitHub Pages source repository and Git LFS. Preserve code, manifest, licenses, model cards, hashes and acquisition script in Git. This follows the existing model/binary acquisition policy; no bulk model corpus in the repository.
- Existing runtime boundary remains: Ollama is the intended main inference server; gateway ASR/TTS routes exist but require separate binaries/weights; RAG is still FTS5/lexical baseline; embedding/reranker/OCR adapters are not yet implemented; target VPS/Tunnel/Ollama remain UNVERIFIED.


- [Official Ollama Qwen3.5-4B reference](https://ollama.com/library/qwen3.5:4b): Q4_K_M, about 3.3 GB, registry digest prefix d8b0f5e9760c. This is the matched base comparator for the owner-preferred uncensored Qwen3.5-4B candidate; acquire through ollama pull and verify the local digest prefix.


- [Ollama Qwen3 embedding Q8_0](https://ollama.com/library/qwen3-embedding:0.6b-q8_0): approx 639 MB, registry digest prefix ac6da0dfba84. Chosen over duplicating the full 1.19-GB HF safetensors artifact; use Ollama's native /api/embed only on RAG paths.


## 2026-11-14 — ASR upstream clarification and challenger review

- **OpenAI Whisper naming:** the official model catalogue lists large-v3 and large-v3-turbo; there is no separate official model named “Whisper 3”. The current aLandi artifact remains the pinned large-v3-turbo Q5_0 baseline. Sources: https://github.com/openai/whisper/blob/main/whisper/__init__.py and https://github.com/openai/whisper/blob/main/CHANGELOG.md.
- **Runtime:** https://github.com/ggml-org/whisper.cpp/releases lists v1.9.5 (2026-10-06) as latest stable in this review. Keep the existing pinned runtime until a newer stable release is checked against the build/API contract.
- **Challenger:** https://github.com/QwenLM/Qwen3-ASR documents Qwen3-ASR-0.6B and 1.7B for 52 languages/dialects, plus ForcedAligner-0.6B; native Transformers support and torch.compile were announced 2026-06-26. Existing 0.6B artifact remains staged. The 1.7B model is a research candidate only; do not download or install before target-host resource fit and same-audio RU/EN/TH evaluation.
- **Decision:** retain whisper.cpp + large-v3-turbo as baseline; evaluate Qwen3-ASR on the identical permissioned golden set. Compare WER/CER, language detection, timestamps, RTF, cold/warm latency, peak RSS/PSS, cancellation and license/provenance. No migration based on model age or parameter count alone.


## 2026-11-14 — Coder sandbox upstream recheck

- **Selected candidate:** OpenShell v0.1.8 (2026-11-10), Apache-2.0. Tag commit `f3d976590d3eb1379690a2abaf0f0e26c21d487d` has a GitHub-verified signature. Official release assets expose SHA-256 digests; the x86_64 Ubuntu package and its gateway/sandbox/supervisor/driver/prover components can be staged without installing them. Sources: https://github.com/NVIDIA/OpenShell/releases/tag/v0.1.8 and https://github.com/NVIDIA/OpenShell.
- **Why this candidate:** policy-enforced filesystem, network and process boundaries plus endpoint-bound credential brokering and an audit trail. Keep arbitrary shell disabled until host compatibility, policy review and escape/isolation tests pass.
- **Upgrade caveats:** v0.1.8 rejects filesystem policy paths traversing symlinks inside writable workspaces; static provider credentials require explicit placement metadata for non-Authorization destinations; Python SDK moved to ai-openshell/sdk-python. Review these before authoring policies.
- **Alternatives:** gVisor remains the OCI application-kernel isolation option (https://gvisor.dev/docs/); OpenHands v1.38.0 was the 2026-11-17 snapshot; the 2026-11-20 release check found v1.43.0. The newer release does not itself authorize adoption., but its no-sandbox mode runs the agent directly on the host with full filesystem access (https://github.com/OpenHands/OpenHands/releases/tag/v1.38.0 and https://github.com/OpenHands/OpenHands).
- **Decision:** stage only the pinned Ubuntu 24.04 x86_64 OpenShell v0.1.8 assets as a temporary Actions artifact, SHA-256 verify every asset, and do not install until actual target OS/architecture, container/VM support, kernel, disk and RAM are measured. No Git LFS or multi-GB binaries in the Pages source tree.


## 2026-11-14 — dependency refresh decision

- pypdf 7.1.0 has a GitHub-verified signed release tag (2026-11-13) and includes the 7.0.1 image-buffer-size security fix. The project makes a narrow pypdf-only freshness-cutoff exception through 2026-11-14, retains the global seven-day cooldown, and maps LimitReachedError to HTTP 413.
- pytest 9.2.0 and pytest-asyncio 1.4.1.post1 are selected after call-site/API review. pytest-asyncio 1.5.0 and FastAPI 0.162.7 remain in the seven-day cooldown; Pydantic 2.14.3 is expected to resolve in the regenerated lock. Exact Python matrix is pending.


## 2026-11-14 — exact lock generation result

CI generated the 142,587-byte universal uv.lock on Python 3.13. It pins FastAPI 0.162.0, Pydantic 2.14.1, pypdf 7.1.0, pytest 9.2.0 and pytest-asyncio 1.4.1.post1. Gateway: 245/245 tests on Python 3.12/13/14; six-layer offline evaluation PASS. The pinned Python runtime-cache workflow still needs to pass after this exact lock is committed. The pytest-asyncio default fixture loop scope is now explicitly function-scoped.


## 2026-11-15 — LANDING-V2-2026-001 upstream freshness recheck

Release/tag recheck on 2026-11-15; this is not proof of target-host installation.

| Component | Current pin | Latest official stable | Decision |
|---|---|---|---|
| whisper.cpp | v1.9.5 | [v1.9.5](https://github.com/ggml-org/whisper.cpp/releases/tag/v1.9.5), 2026-10-06 | Keep stable pin. Upstream HEAD `5922450fbce1ed9d1648babd0d5ac4520055b436` (2026-11-13) is an untagged CMake/Windows fix, not a new release. OpenAI model names remain large-v3 / large-v3-turbo; no separate official “Whisper 3”. |
| Piper | v1.8.0 | [v1.8.0](https://github.com/OHF-Voice/piper1-gpl/releases/tag/v1.8.0), 2026-09-04 | Current; keep per-voice license-chain review. Thai phonemizer does not grant a Thai voice checkpoint. |
| Tesseract | 5.5.4 | [5.5.4](https://github.com/tesseract-ocr/tesseract/releases/tag/5.5.4), 2026-10-28 | Current; OCR remains uninstalled/unwired on target. |
| Ollama | v0.40.16 | [v0.40.16](https://github.com/ollama/ollama/releases/tag/v0.40.16), 2026-11-09 | Current pinned Linux AMD64 artifact; target install pending. |
| OpenShell | v0.1.8 | [v0.1.8](https://github.com/NVIDIA/OpenShell/releases/tag/v0.1.8), 2026-11-10 | Current. Six Ubuntu 24.04 x86_64 assets verified in Actions #43616944431; artifact #14122692509 (207,414,886 bytes), not installed. |
| FastAPI | 0.162.0 | [0.163.0](https://github.com/fastapi/fastapi/releases/tag/0.163.0), 2026-11-14 | Newer but within the repository seven-day cooldown; do not upgrade before 2026-11-21. Then regenerate lock and run Gateway/API matrix. |
| Pydantic | 2.14.1 in uv.lock | [v2.14.3](https://github.com/pydantic/pydantic/releases/tag/v2.14.3), 2026-11-05 | Eligible upgrade candidate; regenerate uv.lock and run Gateway + document fixtures before promotion. |
| pypdf | 7.1.0 | [7.1.0](https://github.com/py-pdf/pypdf/releases/tag/7.1.0), 2026-11-13 | Already current and pinned; retain narrow freshness exception and HTTP 413 mapping. |

**ASR decision:** retain whisper.cpp + large-v3-turbo as stable baseline. Qwen3-ASR-0.6B is staged as a challenger; do not replace Whisper or download 1.7B until same-audio RU/EN/TH WER/CER, RTF, cold/warm latency, peak RSS/PSS, cancellation and target-host resource tests are run. The owner-supplied primary checkpoint remains excluded from automated downloads.

**Artifact state:** external cache #43553056846 (6,054,444,756 bytes), Ollama packages #43418126506 (7,728,830,482 bytes), Python cache #43553056865 (80,105,944 bytes), and OpenShell #43616944431 (207,414,886 bytes) are verified temporary Actions artifacts, not installed on the target VPS. Check expiry before owner-host installation.


## 2026-11-15 — OR-008 targeted source review: same-origin studios and agent orchestration

**Scope and freshness.** The source register contains 450 distinct URL strings across 528 occurrences. Its full inventory snapshot is dated 2026-11-04. This entry records a targeted 2026-11-15 recheck of sources relevant to OR-007/008; it does not claim all 450 sources were freshly revalidated. No dependency, model, custom domain, DNS record or deployment target was installed or changed.

### Same-origin Pages routes versus custom subdomains

Rechecked primary sources:
- GitHub Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub Pages custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- MDN same-origin policy: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
- MDN Web Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN IndexedDB API: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN Broadcast Channel API: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API

**Finding:** a path such as `/notebook/` or `/research/` on the existing GitHub Pages host remains the same origin as the root application; the path does not change the origin tuple. Same-origin pages can use the same origin-scoped localStorage/IndexedDB and BroadcastChannel. A custom subdomain changes the host and therefore the origin; browser storage is isolated and API authentication, CORS and explicit synchronization become necessary. GitHub Pages custom domains require owner-controlled DNS configuration and domain setup.

**Recommendation (PROPOSAL, not implementation):** keep one Pages publication and add separately navigable same-origin paths only when each studio has a defined purpose and shared-data contract. Reuse the existing project/chat/document identity and a single versioned data layer; do not duplicate localStorage schemas or copy the application bundle into independent systems. Candidate shared identifiers: `projectId`, `chatId`, `workspaceId`, `documentId`, plus schema version. Use IndexedDB or the existing canonical persistence layer for larger artifacts; BroadcastChannel may notify open tabs of updates. Keep the root chat app as the primary surface. Defer custom subdomains until a verified owner domain, DNS control and a concrete cross-origin API/sync need exist.

### Agent orchestration and durable approvals

Rechecked versioned primary sources:
- OpenAI Agents Python v0.24.0 — multi-agent patterns: https://github.com/openai/openai-agents-python/blob/v0.24.0/docs/multi_agent.md
- OpenAI Agents Python v0.24.0 — run results and resumable state: https://github.com/openai/openai-agents-python/blob/v0.24.0/docs/results.md
- OpenAI Agents Python v0.24.0 — human-in-the-loop approvals: https://github.com/openai/openai-agents-python/blob/v0.24.0/docs/human_in_the_loop.md
- LangGraph — checkpointers: https://docs.langchain.com/oss/python/langgraph/checkpointers

**Finding:** OpenAI Agents SDK distinguishes manager-owned specialist calls (`Agent.as_tool()`) from handoffs that transfer control to a specialist. The former fits bounded research/code/critic subtasks where one manager owns the final answer; handoffs fit workflows where the specialist should own the rest of the turn. SDK RunState can serialize paused runs and resume after approvals/rejections, including nested agent-tool interruptions. LangGraph checkpointers provide thread-scoped durable graph state and resume semantics.

**Recommendation (PROPOSAL, not dependency selection):** inspect aLandi's existing AgentRun worker, persistence, idempotency, approvals and tracing before choosing an orchestration library. Prefer one manager plus on-demand bounded specialists; invoke them only when the router identifies a need. Keep explicit per-run budgets, step limits, source/tool allowlists, structured outputs and resumable state. Do not install OpenAI Agents SDK or LangGraph until a compatibility/license/dependency/performance comparison shows a gap the existing runtime cannot fill. Avoid a second parallel persistence/checkpoint system.

### Next targeted source passes

1. Audit current AgentRun and gateway contracts before selecting orchestration dependencies.
2. Recheck Deep Research methods and evidence/citation workflows against current official and maintained implementations.
3. Recheck local-first retrieval, SQLite FTS, document ingestion/conversion, file sandboxing and offline model packaging before downloading anything.
4. Recheck Notebook/studio UI patterns and accessibility before implementing same-origin routes.

**Status:** source review recorded; same-origin studio routes remain SPECIFIED/PROPOSED; no SDK, model, package, custom domain or DNS changes made.


## UI interaction patterns — targeted primary-source review, 2026-11-15

This pass rechecked official design-system and accessibility guidance against the existing vanilla HTML/CSS/JavaScript client. The purpose is to reuse mature interaction contracts, not import a React component stack.

### Primary sources checked

- Apple Human Interface Guidelines — [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars): sidebars are for top-level areas/collections; disclosure grouping controls vertical density; hiding the sidebar can give the content more room.
- Apple Human Interface Guidelines — [Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls): keep frequent/essential controls visible and disclose advanced details only when relevant; disclosure direction must match expanded/collapsed state and labels must describe what is hidden.
- W3C WAI-ARIA Authoring Practices — [Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): use a real button; Enter/Space toggles it; aria-expanded reflects visible state and aria-controls identifies the controlled region.
- W3C WCAG 2.2 — [2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): a focused component must remain at least partially visible; sticky headers and non-modal overlays are common failure sources.
- GitHub Primer — [ActionMenu](https://primer.style/product/components/action-menu/) and [guidelines](https://primer.style/product/components/action-menu/guidelines/): compose quick actions from a trigger, ActionList and overlay; use section titles/dividers for hierarchy; avoid form inputs inside action menus; do not mix icon/no-icon rows arbitrarily.
- Microsoft Fluent 2 — [Drawer usage](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): distinguish inline and overlay drawers; modal overlays should block background interaction; avoid stacking multiple overlay drawers; prefer a popover/tooltip for short contextual information and a dialog for confirmation.
- Singapore Government Design System — [Sidebar](https://designsystem.tech.gov.sg/components/sidebar): fixed upper/lower slots around a scrollable navigation region; active states, collapse variants, scrim behavior and normal tab order; keyboard navigation should remain predictable.

### Primary-source recheck — 2026-11-16

- Apple HIG — [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) and [Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls.md): keep primary/high-frequency controls visible; use clearly labelled disclosure for secondary actions; the indicator must reflect expanded/collapsed state.
- W3C APG — [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) and [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/): Enter/Space toggle disclosure; expose popup state and controlled region; opening an action menu moves focus into it and Escape returns focus to the trigger. Do not apply `role="menu"` to ordinary navigation unless the complete menu keyboard model is implemented.
- W3C WCAG 2.2 — [2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): keyboard focus must not be entirely hidden by author-created content; sticky headers and non-modal overlays are common risks.
- GitHub Primer — [ActionMenu](https://primer.style/product/components/action-menu/) / [Action menu guidance](https://primer.github.io/design/components/action-menu/): clear trigger and concise text labels; focus enters the first item; arrow keys navigate; Escape, Tab/Shift+Tab and outside click dismiss; focus returns to trigger; minimum target is 24×24 CSS px.
- Microsoft Fluent 2 — [Drawer usage](https://fluent2.microsoft.design/components/web/react/core/drawer/usage): use inline/overlay drawers for supplemental content, but prefer popovers for short contextual actions and dialogs for confirmation; avoid stacking modal surfaces.
- Singapore Government Design System — [Sidenav](https://www.designsystem.tech.gov.sg/components/sidenav): keep hierarchy shallow, group related links under expandable parents, expose active/expanded states and preserve predictable keyboard order; do not leave focusable descendants inside visually collapsed sections.

### aLandi application

- Keep Projects and Chats as equal-sized sibling panels. Projects starts collapsed; its create action stays visible. Chats starts expanded; the create-chat action stays above the independently scrollable list.
- Filtering by project changes only the visible Chats list. It must not switch the active chat or mutate chat ownership. The explicit back action restores all chats.
- The project label in the chat header is derived from the active chat, not from the currently selected navigation filter. Selecting a chat in a project updates the label; changing the filter alone does not.
- Context menus remain overlays anchored to their trigger, collision-aware and bounded by the visual viewport. Keep focus visible and preserve the first outside tap as dismissal rather than activating an underlying control.
- Retain the existing vanilla implementation and CSS tokens. Supabase/shadcn examples are useful as structural references (sticky header/content/footer, group action slots), not as a reason to add React, Radix or another runtime dependency.

### Evidence and limits

The live TinyFish audit confirmed persistent project-create and new-chat rows, non-shifting context overlays, absence of noisy chat status dots and the mobile off-canvas sidebar. Its report that no back navigation or project header existed is not supported by source: chatScopeBackButton, renderChatList(), activeProjectTitle and renderActiveChat() already implement those behaviors. The audit did not select a project chat to test the header. Existing Chromium tests already assert the back flow and equal panel heights; this pass adds a direct regression for filter-only semantics and the active-chat project label. The audit's statement that both sections are expanded by default also conflicts with source: Projects has aria-expanded=false and a hidden list; Chats has aria-expanded=true.

**Decision:** adopt interaction semantics and layout constraints only; no component package, dependency, remote UI service or external code was added. Source checks are not a full-market audit and do not establish native iOS/VoiceOver behavior.

## Deep Research 2.0 — targeted primary-source review, 2026-11-15

### Primary sources checked

- Exa Search API: https://docs.exa.ai/reference/search — one request can discover relevant results and optionally return content/highlights; responses expose title, URL, published date, author, text/highlights and cost fields.
- Exa Contents API: https://docs.exa.ai/reference/get-contents — fetches page contents, summaries and metadata for explicit URLs; cached content can fall back to live crawling.
- Firecrawl Search API: https://docs.firecrawl.dev/api-reference/endpoint/search — combines search and scraping; full Markdown can be requested through scrape options; supports site/filetype and research-category filters.
- Firecrawl Scrape API: https://docs.firecrawl.dev/api-reference/endpoint/scrape — extracts a single page; dynamic browser interactions are a separate Interact endpoint, not implicit in basic scraping.
- LangChain Deep Agents — Subagents: https://docs.langchain.com/oss/python/deepagents/subagents — subagents isolate context and specialized instructions; synchronous subagents block the supervisor; avoid delegation for simple tasks when overhead exceeds benefit.
- LangGraph Persistence: https://docs.langchain.com/oss/python/langgraph/persistence — checkpointers persist thread-scoped run state; stores hold cross-thread application data; in-memory savers do not survive process restarts.
- FastAPI Background Tasks: https://fastapi.tiangolo.com/tutorial/background-tasks/ and Lifespan: https://fastapi.tiangolo.com/advanced/events/ — BackgroundTasks run after the response but are not a durable queue; lifespan is the correct lifecycle boundary for shared workers/resources.
- Context7 FastAPI docs were queried for lifespan and long-running task guidance; no framework-version upgrade or dependency was made.

### Findings and decision

- Current browser research uses a four-stage same-model pipeline and stores the trace in localStorage; this is a structured workflow, not independent multi-agent research.
- gateway/rag/evidence_ledger.py hashes source text, stores exact Unicode offsets/quote snippets and scopes evidence to conversation/project/global. Authenticated POST/GET/DELETE quote routes are wired; the current backend slice adds typed claim/contradiction records and authenticated write routes. Research Trace UI integration is still pending.
- rag_enabled is false by default. Evidence persistence must be explicit and user-triggered; a configured remote Gateway must never receive excerpts silently.
- Exa and Firecrawl are complementary adapters (search/metadata vs extraction/interaction), not reasons to add multiple overlapping search libraries. API keys, cost accounting, remote-processing consent and rate limits belong in Gateway configuration.
- Do not use FastAPI BackgroundTasks for resumable research. Reuse existing persistent AgentRun/SQLite patterns or a clearly bounded research-specific state store; do not create a second checkpoint system without demonstrated need.
- A hash and exact quote span prove capture integrity, not semantic entailment between a claim and the source. Claim-to-citation support, contradictions and confidence require separate structured records and validation.

Decision: reuse the existing SQLite EvidenceLedger, add authenticated scoped API operations and explicit trace persistence first. Defer LangGraph/Deep Agents SDK adoption pending measured need, compatibility/license review and an adapter comparison. No dependency, paid service, model or host setting changed.


## Deep Research 2.0 — provider and evidence-contract revalidation (2026-11-16)

- The official Exa Search and Contents references and Firecrawl Search and Scrape references are already present in this register; the existing inventory contains 490 unique URLs. No duplicate source rows or new URL inventory were needed.
- Exa remains the discovery/metadata adapter candidate; its Contents API is a separate explicit-URL extraction step. Firecrawl Search can combine discovery with scraping, while Scrape is a single-page extraction operation; browser interaction is a distinct endpoint.
- These APIs are complementary, not a reason to add overlapping search libraries. Runtime adapters, provider credentials, per-provider budgets, remote-processing consent, rate limits, timeouts, retries and provenance are not implemented by this evidence-ledger backend change.
- No provider keys were read, no paid provider requests were made, and no provider was marked configured or live. The Research Trace critic remains same-model until a separate verifier runtime is implemented.
- UI design sources (Apple HIG, W3C APG/WCAG, GitHub Primer, Microsoft Fluent and Singapore Government Design System) remain in the existing source inventory; no new UI dependency was adopted.



## Owner-directed agent, model and tooling source review — 2026-11-16

**Inventory method:** the pre-sweep file contained 568 HTTP(S) occurrences and 478 distinct URLs after trimming trailing Markdown punctuation. This pass added 29 distinct primary-source references, bringing the normalized unique count to 507. An earlier note reported 490; that figure is not reproducible with this parser and is treated as a stale overcount. Existing inventory was searched by agent orchestration, small models, memory, RL, browser automation and UI themes; this is a focused thematic review, not a claim that all 507 pages were freshly fetched.

### Research tools available to the assistant

- Exa Search / Contents: https://docs.exa.ai/reference/search and https://docs.exa.ai/reference/get-contents
- Firecrawl Search / Scrape: https://docs.firecrawl.dev/api-reference/endpoint/search and https://docs.firecrawl.dev/api-reference/endpoint/scrape
- Both tool families returned successful results in this session. No provider keys were read, no paid request was made, and no Exa/Firecrawl runtime dependency was added to aLandi. They are research tools here; product adapters remain a separate, explicit implementation task.

### Small models and local inference

- PrismML Bonsai 2: https://github.com/PrismML-Eng/Bonsai-demo ; model card: https://huggingface.co/prism-ml/Ternary-Bonsai-2-2B-gguf ; format/runtime docs: https://docs.prismml.com/download/formats ; model catalogue: https://docs.prismml.com/download/models
  - The 1.88B language model is derived from Qwen3.5-2B and declares Apache-2.0. The 429,183,456-byte PTQ1_0 file is a packing of this same 1.88B model, not a separate smaller-parameter model. Other packings: PQ2_0 ~0.52 GB and Q2_0 ~0.55 GB; optional Q8 vision projector ~0.36 GB.
  - Official README recommends PQ2_0 as the default packing, PTQ1_0 where file size is the priority, and Q2_0 for stock upstream llama.cpp b11556+. PTQ1_0/PQ2_0 require the PrismML llama.cpp fork; this is not Ollama-compatible. Model revision a6032a5089ac27e96be3a80c7b42d1ad0bd89887; PTQ1_0 SHA-256 36061ad406df8a4903a6db005be350c50fabfaf717f9ef0acf4b76adcd9929fa. The 430 MB text artifact does not include the optional vision projector. A 262K context headline is not a usable 8-GB host budget.
  - **Disposition: CANDIDATE / ARTIFACT ACQUISITION WORKFLOW ADDED; NOT INSTALLED.** The workflow stages the pinned PTQ1_0 file as a GitHub Actions artifact only. First prove a generic local OpenAI-compatible runtime adapter, exact artifact digest, cold/warm RSS, KV memory, TTFT, p50/p95, tokens/sec, cancellation, RU/EN/TH quality and regression versus the current Ollama baseline. Do not make it the default or load it beside another model.
- Cactus Needle 2: https://huggingface.co/Cactus-Compute/needle2 ; engine/package source: https://github.com/cactus-compute/needle ; v2 lifecycle report: https://github.com/cactus-compute/needle/issues/130
  - The model card describes a 45M tool-calling/extraction model in a 14 MB binary and roughly 28 MB session RAM, with schema-constrained JSON, confidence gating, top-five tool retrieval and a 256-token sliding window. Its public card does not establish RU/EN/TH quality; Russian and Thai remain unverified.
  - A v2.0.4 issue documents deterministic crashes when a second session is initialized in the same process on macOS arm64 and Linux x86_64; the report also records tool-schema size sensitivity. **Disposition: DEFER for production.** Keep as a possible isolated English/tool-call benchmark only after the exact shipped engine passes repeated-init, long-session, schema-size and concurrency tests.
- ghost-infer: https://github.com/affifuddin-hazam/ghost-infer
  - Apache-2.0 Rust GGUF runtime with an OpenAI-compatible streaming/tool-call API, speculative decoding and GPU offload. Upstream benchmarks use a consumer NVIDIA GPU (including an 8 GB RTX 2060 SUPER) paired with 24 GB system RAM; the installer is Windows-focused. Figures are upstream claims, not aLandi measurements.
  - **Disposition: RESEARCH ONLY.** Current target facts are an 8-GB VPS and no verified GPU/host memory fit; do not replace the Ollama-first baseline without a same-hardware benchmark.
- Needle, Bonsai and ghost-infer are separate model/runtime options; do not conflate weights, tokenizer/template, engine, quantization and API compatibility.

### Agent orchestration, coding and operations

- OpenAI GitHub organization: https://github.com/openai
  - Agents SDK Python: https://github.com/openai/openai-agents-python (MIT). Study manager-owned specialist calls versus handoffs, guardrails, human approval, sessions, tracing and resumable run state. **Reuse concepts; do not add the SDK until an exact gap in current AgentRun is demonstrated.**
  - Codex: https://github.com/openai/codex (Apache-2.0). A local terminal coding agent; use as a harness/workspace benchmark for repository scoping, tool execution, review and event lifecycle, not as a drop-in backend or permission grant.
  - Cookbook: https://github.com/openai/openai-cookbook ; agent improvement loop turns real traces and human/model feedback into repeatable evals and then proposes harness changes. Reuse the evidence → eval → improvement cycle.
  - Evals: https://github.com/openai/evals ; study dataset/graded-eval patterns, but preserve aLandi's deterministic local tests and RU/EN/TH golden sets.
  - The closest official chat/HITL demo found is https://github.com/openai/openai-support-agent-demo (MIT, Next.js, Responses API, File Search and suggested actions for human review). The exact name chat-demo did not resolve to one canonical OpenAI repository; do not silently treat this demo as the intended exact project. No Next.js migration is proposed.
- Stakpak: https://github.com/stakpak/agent ; Warden design: https://stakpak.gitbook.io/docs/how-it-works/warden-guardrails
  - Apache-2.0 DevOps agent with isolated subagents, asynchronous task/progress handling, network policy enforcement and secret substitution before model exposure.
  - **Disposition: PATTERN SOURCE.** Reuse deterministic network/tool policy, secret redaction/substitution, per-worker tool scopes, resumable task state and reversible file operations. Do not install its 24/7 DevOps runtime into aLandi.
- Cloudroom: https://github.com/davidondrej/cloudroom ; cloud-thread architecture: https://www.cloudroom.dev/docs/cloud-threads
  - Apache-2.0 Rust core; one Linux sandbox and Git branch per thread, persistent event history, queued turns and resume. Its docs conflict: the cloud-threads page says the agent has full admin rights inside the sandbox, while the README security section says agents run as a separate Linux user without admin rights. Both describe no approval prompts. Treat its permission boundary as UNVERIFIED until code audit; do not copy its no-approval default.
  - **Disposition: PATTERN SOURCE ONLY.** Per-thread isolation and event persistence are useful; no assumption that 1,000-agent scale fits an 8-GB VPS.
- Kiri candidates: https://github.com/LeeCheneler/kiri and https://github.com/Yeshwanthyk/kiri
  - These are two distinct projects: a MIT local-first workspace with user-set allow/ask/off permissions, worker delegation and YAML workflows; and a keyboard-first local agent control plane. Both are useful UX/workflow references, not one verified interchangeable dependency.
- Obscura: https://github.com/h4ckf0r0day/obscura ; MCP contract: https://github.com/h4ckf0r0day/obscura/blob/main/docs/Use-the-MCP-server.md
  - Apache-2.0 Rust/V8 headless browser with CDP and MCP. Private/internal IP navigation is blocked by default with DNS checks; non-loopback HTTP MCP requires a bearer token, allowed origins and bounded requests/connections.
  - **Disposition: DEFERRED BROWSER ADAPTER CANDIDATE.** If adopted, run as an isolated browser worker with URL policy, DNS/IP revalidation, per-run state and no ambient host credentials. It is not installed.
- Existing aLandi architecture remains authoritative: use the current AgentRun/SQLite state and typed worker capability contracts. The manager owns the task/result; specialists receive minimal typed task packets and isolated context. Effective permissions remain the intersection of requested scope, agent profile, owner grant and environment policy. No role/Skill expands permissions. Do not add a second orchestrator or persistence engine.

### Memory, RL and policy divergence

- Memorilla: https://github.com/snap-stanford/memorilla ; paper: https://arxiv.org/html/2610.21375v1
  - Apache-2.0 research implementation that learns query-conditioned latent memory tokens for a frozen model. The README specifies Linux/CUDA/Python 3.11 and H100 80-GB training/evaluation examples; TextWorld memory training uses GRPO. Dataset licenses remain separate.
  - **Disposition: RESEARCH CANDIDATE / NOT A VPS INSTALL.** Study its compression/evaluation idea against existing SQLite FTS5/RAG and current MemoryManager; no replacement or model training on the 8-GB host.
- KL divergence: https://github.com/openai/spinningup ; https://spinningup.openai.com/en/latest/algorithms/trpo.html
  - A mathematical measure/constraint on policy distribution change, not a deployable module. Useful in model fine-tuning/evaluation to detect policy drift; not a new runtime subsystem.
- Critic-free RL: https://arxiv.org/html/2605.08666 ; literature index: https://github.com/smiles724/Awesome-LLM-RLVR
  - The cited paper studies token-level effects in critic-free RL such as GRPO and proposes query-preserved and reward-balanced batching interventions. This is a model-training method, not an inference-time agent reviewer. Do not confuse it with the current same-model research critic, which is explicitly not independent.
  - **Disposition: RESEARCH ONLY.** No RL training pipeline or dependency is justified on the current target hardware. If later explored, require licensed data, reproducible baseline, held-out evals and KL/policy-drift monitoring.

### Interface source

- React Bits: https://github.com/DavidHDev/react-bits ; license: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
  - Large animated React component collection. Its current license is MIT plus Commons Clause restrictions: do not sell, sublicense or redistribute the components themselves, including ported versions.
  - **Disposition: VISUAL REFERENCE ONLY.** Borrow interaction inspiration and implement original aLandi-native HTML/CSS/JS; do not copy/port its components or add React/Radix/Tailwind runtime dependencies.

### Explicit deferral

- VoxCPM2 is **DEFERRED** per owner instruction; do not spend this pass on voice/audio model integration.

### Consolidated decision

No external runtime, UI framework, model, agent platform or new package was installed in this documentation pass. Exa and Firecrawl were used as assistant-side research tools. Adopt only evidence-backed patterns into aLandi's own contracts: coordinator-owned bounded workers, isolated context, typed scopes, deterministic guardrails, explicit approvals, durable event state, source-grounded research, local-first data and measurable small-model routing. Keep all capabilities disabled or unavailable until their runtime and exact-head acceptance gates pass.


## 2026-11-16 — AgentRun implementation and upstream source refresh

**Baseline:** main `0d34aa1c70bb68e57a3856ba20d8b5f966c65038`. SQLite persists same-run dependencies; task-ID Fernet payloads; dependency-ready scheduling; coordinator synthesis. UI exposes safe `single`/`team_review`/`coder_review`, per-chat choice, General coordinator pin, explicit `strategy_id`, and actual task states/dependency labels. Coder Review is a sequential text-only draft → review → coordinator chain; no filesystem, shell, tools or tests. Quality #43827521092 passed 7/7 incl. 135 built-app Chromium + 1 live-site test and published contract; Graphify #43827521090 and Pages #43827520134 passed; public revision exact. Gateway unchanged; #43797179042 on backend parent 680ab022 (Python 3.12/13/14).

**Exa primary-source review, 2026-11-16:**
- [OpenAI orchestration](https://developers.openai.com/api/docs/guides/agents/orchestration), [running agents](https://developers.openai.com/api/docs/guides/agents/running-agents): handoffs transfer ownership; agents-as-tools retain manager ownership; narrow specialists and one state-continuation method. Adopt manager-owned synthesis, not SDK runtime.
- [Deep Agents subagents](https://docs.langchain.com/oss/python/deepagents/subagents), [async subagents](https://docs.langchain.com/oss/python/deepagents/async-subagents): isolated context reduces supervisor bloat; sync blocks; async needs lifecycle, steering/cancel and Agent Protocol server. Adopt isolated packets; no runtime import.
- [Temporal Activities](https://docs.temporal.io/activity-execution), [Workflows](https://docs.temporal.io/workflows): durable lifecycle, replay, timeouts/retries; I/O in Activities. Adopt idempotency/failure-injection patterns; defer separate service.
- [Microsoft workflows](https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/), [edges](https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/edges), [checkpoints](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints): typed edges, fan-in barriers, superstep checkpoints; distributed durability requires Durable Task infrastructure. Adopt dependency/fan-in semantics only.

**Limits/disposition:** one worker/model slot, serial inference, roles not OS processes, feature off, no tools/shell/filesystem/network, no Coder sandbox or target-host inference. Keep FastAPI + SQLite + Fernet; no competing orchestrator. Next: plugin strategy and source mapping, then continue the existing K.5 15-point order. Local Coder sandbox and human approval/resume remain deferred.




## 2026-11-16 — Plugin strategy and recent sandbox/agent-runtime research

**Status:** PROPOSED usage map; no plugin OAuth, new product integration, dependency, model download or hosting migration was authorized or applied.

### Primary working set
| Plugin/tool | Best role in aLandi work | Boundary |
|---|---|---|
| GitHub | Canonical repository, branch/HEAD, issues, commits, CI and docs | Always authoritative for project state; no raw history rewrite or unapproved protected action |
| Exa | Broad discovery and primary-source research | Search first; do not duplicate the same query across multiple search plugins |
| Firecrawl | Deep page extraction, crawling and structured content after discovery | Use when page content/links must be inspected; not a second broad search engine by default |
| Context7 | Version-specific library/framework/API documentation before a dependency or API change | Not a replacement for repository code/tests or official release notes |
| TinyFish | Browser navigation and multi-step public-site workflows when Playwright cannot cover the flow | Prefer Playwright for deterministic local/public-site regression; do not expose private authenticated data |
| Coder value tools | `make_design_tokens` and `check_color_contrast` for future design-token and WCAG review | These are design/accessibility utilities, not an on-device coding runtime or shell |
| Base44 | Isolated UI/product prototype only when it answers a specific design question | Base44 app inventory returned no existing aLandi app; no app was created and no migration is proposed |

### Conditional/reference-only tools
- **Cloudflare:** continue the existing Tunnel/edge role. Cloudflare Agents SDK/Workers/Durable Objects is a possible alternative architecture, not an addition to the current FastAPI + SQLite + Ollama runtime; adopting it would duplicate state and deployment surfaces.
- **Vercel:** Workflow/Agent and Sandbox documentation are useful comparative references. Vercel Sandbox is a hosted Firecracker environment, not offline on-device execution. Do not migrate the static Pages client or create a second orchestrator.
- **Twilio:** ConversationRelay/Voice are cloud telephony and speech-channel options. They do not provide offline local ASR/TTS and Twilio Conversation Memory is not aLandi Memory. Consider only for an explicitly requested phone channel.
- **Floot / Hercules / Coder build link / Base44:** overlapping app builders; choose one for a separately scoped prototype, never create parallel versions of the canonical aLandi product.
- **Railway / Render / Hostinger:** hosting/provisioning alternatives only; current GitHub Pages + Cloudflare Tunnel + FastAPI/Ollama architecture remains the baseline.
- **OpenAI Platform:** API-key lifecycle only on explicit request; never store or expose keys in repository/docs.
- **Automations:** scheduled external monitoring/check-ins only when requested; not an AgentRun runtime or product memory.
- **Plugin Management:** OAuth/connectors and scopes only after an explicit product integration decision.
- **Context_dev / Keenable:** fallback search/page extraction; avoid running them in parallel with Exa/Firecrawl for the same evidence set.

### Recent primary-source review (2026-05-16 → 2026-11-16)
- [OpenAI Agents orchestration](https://developers.openai.com/api/docs/guides/agents/orchestration) and [sandbox agents](https://developers.openai.com/api/docs/guides/agents/sandboxes): retain manager-owned delegation and explicit separation of agent harness from compute/sandbox. Do not import the SDK runtime merely to reproduce the concepts.
- [LangGraph checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) and [interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts): checkpoint/resume and human interrupts are relevant patterns; current aLandi state remains in SQLite, with approval/resume deferred until an actual side-effecting tool needs it.
- [Temporal workflows](https://docs.temporal.io/workflows) and [activity execution](https://docs.temporal.io/activity-execution): use durable/idempotent activity and retry semantics as design references; do not add a second workflow service now.
- [Microsoft Agent Framework workflows](https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/) and [checkpoints](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints): typed edges and fan-in are useful references; no framework dependency added.
- [OpenSandbox 1.2.0 release](https://github.com/opensandbox-group/OpenSandbox/releases/tag/release-1.2.0), published 2026-10-27, Apache-2.0: local Docker and Kubernetes deployment, Firecracker fast sandboxes, auto-pause/wake-on-access and Credential Vault. Candidate for a future isolated Coder adapter, not selected: heavier service footprint and the release notes identify an umbrella-release signing/provenance gap. Do not treat it as a mobile/browser-local runtime.
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) and [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/): hosted sandbox and Workers/Durable Objects alternatives; useful comparisons, not selected for the current local-first architecture.
- [Twilio ConversationRelay](https://www.twilio.com/docs/voice/conversationrelay): cloud voice/telephony, not offline speech or personal Memory.

**Disposition:** keep the working set small and complementary: GitHub → Exa → Firecrawl/Context7 as needed → TinyFish or Playwright for browser verification → Coder contrast/tokens for UX. Use other builders/hosting/voice platforms only for a concrete isolated need. No connector was authorized or connected by this research.

## 2026-11-16 — Deep Research provenance and runtime tracing standards

**Primary sources checked via Exa/Firecrawl:**
- [W3C PROV-O](https://www.w3.org/TR/prov-o/) and [PROV-DM](https://www.w3.org/TR/prov-dm/): provenance is expressed through Entities, Activities and Agents, with relations such as `used`, `wasGeneratedBy`, `wasDerivedFrom` and `wasAssociatedWith`. Candidate mapping for aLandi: a research run is an Activity; model/provider/tool is an Agent; source page, captured quote, claim, contradiction and final report are Entities. Claims and contradictions derive from explicitly linked evidence records. This is a conceptual mapping, not a recommendation to migrate SQLite records into RDF.
- [OpenTelemetry trace concepts](https://opentelemetry.io/docs/concepts/signals/traces/) and [Trace API](https://opentelemetry.io/docs/specs/otel/trace/api/): spans model bounded operations; parent/child spans describe synchronous stages; events record retries/checkpoints; span links model fan-in from separate retrieval/tool work. Use a root research span with stage and tool-call spans when observability is implemented.
- [W3C Trace Context](https://www.w3.org/TR/trace-context/): `traceparent`/`tracestate` support cross-service correlation. If future provider adapters propagate context, validate external headers and never treat trace context as authentication or durable identity.

**Disposition for aLandi:** keep durable `run_id`, checkpoints, dependencies, attempts and cancellation state in SQLite. Use telemetry `trace_id`/`span_id` only for observability correlation; telemetry is not a recovery database. Add spans/events when the K.1.13 observability work and real provider adapters are implemented. No RDF, OpenTelemetry SDK/exporter, or new runtime dependency was installed.

## 2026-11-16 — Complete owner plugin/tool map and usage policy

**Scope:** the owner's full requested set is mapped below. Availability refers to the current assistant-side tool/skill surface, not to aLandi runtime integration. No OAuth, app creation, hosting change, paid provisioning, deployment or secret handling was performed.

| Owner-listed tool | Current assistant-side surface / best use | Boundary and disposition |
|---|---|---|
| Code | No distinct @Code tool namespace or skill surfaced in the active tool registry for this session. | Do not claim availability or invent a connector. Use repository-aware GitHub tools and local code inspection. Recheck if the owner enables a distinct Code app later. |
| Coder | Build-link service available; Coder value tools reported unavailable in the service check. | Build link opens a separate hosted builder and does not edit this canonical repo. Not used for aLandi implementation; not a local Coder sandbox. |
| Context.dev | Web search/scrape/crawl/answers, brand/styleguide retrieval and monitors are available. | Use for website/design-reference extraction, structured page research and monitored changes; avoid duplicate queries already covered by Exa/Firecrawl. |
| Cloudflare | Docs/search/execute and account identity tools are available. | Existing Tunnel/edge remains baseline. Use docs and current account state when an edge/API task requires it; do not add Workers, Durable Objects or Agents SDK as a competing runtime without a specific decision. |
| Exa | Web search and page fetch are available and were used for recent multi-angle discovery. | Primary broad discovery/research tool; verify important claims against primary pages and current repo evidence. |
| Superpowers | Process skills are available and were invoked for brainstorming, planning, TDD, execution and verification workflow. | Engineering method only; not an aLandi runtime or subagent executor. No separate subagent dispatch capability was available in this session. |
| TinyFish | Browser workflow tools are available. | Use for read-only public-site workflows and live interactions not covered by deterministic Playwright. Never expose owner credentials or private browser data. |
| Base44 | App builder, sandbox/code tools and app inventory are available; prior inventory check found no existing aLandi app. | Use only for a disposable design spike or separately authorized prototype. Do not fork the canonical product or move GitHub Pages code/data into Base44 by default. |
| BrowserAct | BrowserAct skill exists, but the CLI is not installed (browser-act --version → command not found); uv 0.10.0 is present. | No install was performed. Use Playwright for deterministic tests and TinyFish for live browser work; install BrowserAct only after explicit approval if a concrete gap remains. |
| Railway | Project/service/deployment/log/metrics/automation APIs are available. | Hosting and background automation alternative; no migration or resource creation. Not the current Pages/FastAPI/Ollama baseline. |
| Render | Service, database, workflow, logs and deployment APIs are available. | Hosting/database alternative; no resource creation or migration. Do not create a parallel backend. |
| Floot | Project/file/database/preview/build/publish tools are available. | Full app builder overlaps Base44/Hercules/Coder; use only for a bounded prototype if needed, never a second canonical app. |
| Keenable | Web search and page-content fetch are available. | Fallback discovery/extraction when Exa or Firecrawl cannot access a source; avoid parallel duplicate searches. |
| Hercules | App builder and agent/app APIs are available. | Alternative app-builder surface; no app creation or agent runtime adoption. |
| Hostinger Connector / Hostinger | The Hostinger search/execute/multi-execute API surface and related skills are available; these two names resolve to the same underlying connector family here. | Use for read-only account/host audit or explicit Hostinger work only. No VPS/domain/DNS changes or provisioning. |
| Firecrawl | Search, scrape, map/crawl, developer research, document parsing and agent tools are available and were used for targeted research. | Use after discovery for deep extraction, code/docs lookup and ingestion research. Bound credits and avoid unnecessary autonomous crawls. |
| Vercel | Documentation, project/deployment, workflow, agent and sandbox tools/skills are available. | Use as comparative reference or a task-specific existing Vercel resource. Vercel Sandbox is hosted, not offline on-device; no project/runtime migration. |

### Complementary workflow (avoid duplicate tool calls)

1. **Canonical engineering truth:** GitHub repository, exact main SHA, tests and Actions.
2. **Broad discovery:** Exa.
3. **Deep page/code/document extraction:** Firecrawl; use Context.dev for page/brand/styleguide or structured web extraction where it adds a distinct field.
4. **Fallback:** Keenable only when the primary search/fetch route has a material access or coverage gap.
5. **Browser verification:** Playwright for deterministic app regression; TinyFish for live public-site workflows; BrowserAct only when installed and justified.
6. **Engineering process:** Superpowers; use Coder only for an isolated builder link/prototype or when its value tools become available.
7. **Platform/hosting references:** Cloudflare, Vercel, Railway, Render and Hostinger are not interchangeable runtime dependencies. Base44, Floot, Hercules and Coder are overlapping builders. Choose one only for a separately scoped need; do not provision parallel products.

### Recent source review (2026-05-16 → 2026-11-16)

- [Agent 4: Teamwork and Collaboration for Vibe-Coding, ACM CAIS '26](https://dl.acm.org/doi/full/10.1145/3786335.3813211), published 2026-05-26: planning agent decomposes a request into a dependency DAG; task agents work on isolated application-state forks; intra-task subagents can share a workspace; validation combines type checks, replayable regression tests and code review. This is a Replit platform paper, not a drop-in runtime for aLandi.
- [Aegis OS preprint](https://arxiv.org/html/2611.08516v1), 2026-10-22: proposes transactional copy-on-write workspaces, OS sandbox boundaries, scoped egress/credentials and human approval at workspace commit rather than every mutation. It is a preprint with author-reported results, not an independently established production guarantee; candidate patterns only.
- [Microsoft Agent Framework Durable Extension](https://learn.microsoft.com/en-us/agent-framework/hosting/durable-extension): describes persisted sessions, checkpointed workflows, crash recovery, pause/resume and self-hosted workers. Useful comparison; adopting it would add its durable-task infrastructure and is not justified before extending the existing SQLite contract.
- [Material Design 3 — Designing/Structure](https://m3.material.io/foundations/designing/structure): emphasizes clear hierarchy, task-focused navigation, top/bottom placement for important actions, semantic reading order and landmarks. Apply as design guidance, not as wholesale visual cloning.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/): normative accessibility baseline for focus, target size, contrast, keyboard and predictable interaction. Keep WCAG CSS-pixel criteria distinct from Apple points and Android dp recommendations.

**Disposition:** retain a small complementary assistant-side toolchain; keep the existing aLandi stack and GitHub Pages source of truth. Product connectors and hosting/runtime migrations require a separate explicit architecture decision, credentials/scopes, data-flow threat model, budget and contract tests.

### Mobile Safari form-focus zoom diagnosis — 2026-11-16

- **FACT:** index.md sets viewport width=device-width, initial-scale=1, viewport-fit=cover. Multiple text controls use Tailwind text-sm (14 CSS px), including project creation, API keys, model search and project/server settings.
- **HYPOTHESIS (strong):** iPhone Safari automatically zooms focused form controls when computed font-size is below 16 CSS px. This plausibly explains the owner's reported page zoom on text entry/select. It is not yet verified on a physical device.
- **PROPOSAL:** apply a mobile-only minimum 16px font-size to input/select/textarea controls, preserving pinch-to-zoom and accessible user scaling. Do not add maximum-scale=1 or user-scalable=no as a workaround.
- References: [WebKit — New Interaction Behaviors in iOS 10](https://webkit.org/blog/7367/new-interaction-behaviors-in-ios-10/); [CSS-Tricks — 16px or Larger Text Prevents iOS Form Zoom](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/); [iOS WebKit auto-zoom technical analysis](https://nahidmahamud.com/disable-auto-zoom-in-input-text-tag-safari-on-iphone/).
- **Acceptance:** test text, URL, password, search and select controls on real iPhone Safari, verify no focus zoom, keyboard visibility, voice controls and preserved pinch zoom.



### AgentRun live status and event transport review — 2026-11-16

**Official protocol/runtime references**
- [OpenAI Agents SDK — Streaming](https://openai.github.io/openai-agents-python/streaming/): `Runner.run_streamed()` exposes typed run events; the event iterator must be fully drained before treating a run as complete because persistence/approval/history post-processing may continue after visible output. Cancellation and interruption are explicit lifecycle outcomes. Pattern adopted: distinguish user-visible token output from run completion and reconcile terminal state from the runtime.
- [OpenAI API — Agents events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events): events are the real-time update channel; persisted items are the durable history. Pattern adopted: live activity and saved conversation history are separate projections.
- [AG-UI — Events](https://docs.ag-ui.com/concepts/events): run lifecycle events, step events, activity snapshots/deltas and subagent lifecycle events give the frontend structured status without conflating it with assistant text. [AG-UI — Subagents](https://docs.ag-ui.com/concepts/subagents): attribution identifies which child produced an event; it is not a permission grant. Pattern adopted: explicit typed status/task activity and attribution, with no raw chain-of-thought in the user-facing panel.
- [Temporal — Understanding Event History](https://docs.temporal.io/evaluate/understanding-temporal): a durable ordered event history enables replay/recovery after worker failure. Pattern adopted conceptually: event cursor + persisted run state + snapshot reconciliation; do not adopt Temporal service for the current single-host SQLite deployment.
- [Dify Agent Run Store](https://github.com/langgenius/dify/blob/d90f9759d2f251223d90dd500a6603fd320df905/dify-agent/src/dify_agent/storage/redis_run_store.py) and [Dify run routes](https://github.com/langgenius/dify/blob/d90f9759d2f251223d90dd500a6603fd320df905/dify-agent/src/dify_agent/server/routes/runs.py): request digests/idempotency, event cursor replay, retention and explicit run status. Pattern adopted: event log and status endpoint remain independently readable; reconnect must re-authorize. Do not add Redis or copy Dify's scheduler.

**aLandi source comparison**
- Current AgentRun already persists run/task events in SQLite and exposes authenticated status + cursor-based event endpoints. The browser observer polls events and snapshot every 500 ms, but only while the Agents modal owns the UI.
- No second orchestration engine, Redis/Temporal dependency or separate agent runtime is justified. Keep SQLite/DAG/lease/payload vault as the current base; optimize transport only after measuring the current polling cost/latency.
- For the requested status UX, show a collapsed chat-anchored summary with truthful state text; expand to a bounded activity/task list. Use the existing event cursor and server snapshot to recover after navigation/reconnect. Deduplicate by event ID; don't announce unchanged poll snapshots.
- Never expose hidden reasoning, prompts, secrets, encrypted payloads or source text in activity status. Color/animation is secondary to server-reported state; respect reduced motion and keyboard/screen-reader semantics.
- Full acceptance and maturity boundary: `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` §K.6.16. No new dependency or runtime adopted.


## 2026-11-16 — Agent context contracts, multi-model registry, local tool boundaries and RU/EN/TH translation review

**Status: SOURCE-VALIDATED / architecture patterns only.** Reviewed upstream specifications and live plugin search/extraction. No runtime, dependency, model artifact, account, or connector was installed.

### Agent and Skill contracts
- [Agent Skills specification](https://agentskills.io/specification) defines a portable Skill as a directory with required `SKILL.md` YAML frontmatter (`name`, `description`) plus optional `scripts/`, `references/`, `assets/`, license and compatibility metadata. Its `allowed-tools` field is explicitly experimental; therefore it is metadata for display/validation, **not a permission grant**.
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) / [Agent streaming](https://openai.github.io/openai-agents-python/streaming/): retain a typed run lifecycle distinct from assistant text; visible output can precede completion of the entire run/event iterator. Use events for activity, persisted state for recovery and explicit cancelled/failed/interrupted outcomes.
- [AG-UI Events](https://docs.ag-ui.com/concepts/events) and [Subagents](https://docs.ag-ui.com/concepts/subagents): model run/step/activity/subagent events as typed status projections; attribution says which worker emitted an event, not whether it has permission to read a source.
- Disposition: keep aLandi Agent Library, Skill Library, Memory, Research Evidence and Model Registry as distinct stores. A manifest declares role/model/skills/data scopes/output contract; an independent policy broker computes effective grants. Imported Skill packages are inert until reviewed. No Agents SDK or AG-UI dependency added.

### Multi-model registry and hardware-aware scheduling
- [Ollama `GET /api/ps`](https://docs.ollama.com/api/ps) exposes loaded model name/digest/size, quantization details, expiry, VRAM bytes and context length. [`POST /api/show`](https://docs.ollama.com/api-reference/show-model-details) exposes license text, parameters, capabilities, model details and model_info.
- [Ollama FAQ](https://docs.ollama.com/faq) documents multiple concurrently loaded models only when memory allows; otherwise requests queue and idle models can be unloaded. It documents `OLLAMA_MAX_LOADED_MODELS`, `OLLAMA_NUM_PARALLEL`, `OLLAMA_MAX_QUEUE`, and the fact that parallel requests multiply context-memory needs.
- Disposition: registry should use exact local digest and `/api/show` metadata, plus measured task quality, latency, RAM/VRAM, model load/unload time and language coverage. Select a task model by capability + budget, return an explicit no-fit outcome and show any user-authorized fallback. Do not infer capacity from model count. Current gateway remains one worker/model slot and sequential; no concurrency change without target-host measurements.

### Browser, Coder and external tool boundaries
- [Cloudflare Browser Run — Browser Agent](https://developers.cloudflare.com/agents/examples/browser-agent/) shows CDP-backed browsing and page inspection; [Playwright session management](https://developers.cloudflare.com/browser-run/playwright/) supports one-time or reusable browser sessions; [Browser Run Guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/) binds hostname allowlists to a session and notes that omitted guardrails leave HTTP(S) unrestricted.
- [Vercel Sandbox Firewall](https://vercel.com/docs/sandbox/concepts/firewall) exposes explicit deny-all and domain allowlist policies; [Vercel Queues Python SDK](https://vercel.com/docs/queues/python-sdk) is a managed queue API, not a reason to replace the existing SQLite lifecycle.
- Disposition: borrow the security shape only: per-run isolated browser session, explicit hostname policy, no ambient secrets, read/write separation, path confinement, approval ticket bound to exact args, audit, timeout and cancellation. The user's selected-file Workspace remains the basis for local Coder; execution requires a separate sandbox. No Browser Run, Vercel Sandbox or managed queue integrated.

### Offline translation and grammar — RU / EN / TH
- [Argos Translate](https://github.com/argosopentech/argos-translate) is an MIT offline translation library; it loads separate `.argosmodel` packages and can pivot through an intermediate language when no direct pair is installed. Pivoting may reduce quality.
- The live [Argos package index](https://github.com/argosopentech/argospm-index/blob/main/index.json) lists package version 1.9 directions `en→ru`, `ru→en`, `en→th`, `th→en`. The index provides version/link but not package SHA or per-weight license. **Candidate discovery only:** do not ship these artifacts until each exact package has a verified digest, provenance and redistribution terms.
- [Helsinki-NLP OPUS-MT-train](https://github.com/Helsinki-NLP/Opus-MT-train) states its released pre-trained models are CC-BY 4.0. [Helsinki-NLP OPUS-MT Thai→English card](https://huggingface.co/Helsinki-NLP/opus-mt-th-en) identifies translation direction, preprocessing and its 2020 Tatoeba test benchmark. A current mainstream `en→th` Helsinki card was not found in the source check; don't assume pair symmetry or substitute the community Argos package without its own license/hash check.
- [LanguageTool supported languages](https://dev.languagetool.org/languages) lists English and Russian rule coverage (the checked page is version 6.6 dated 2025-03-27) but no Thai. [Embedded HTTP server](https://dev.languagetool.org/http-server.html) runs locally; the upstream documentation explicitly says the local embedded server lacks AI-based rules available in the cloud. Core repo is LGPL-2.1-or-later.
- [PyThaiNLP](https://github.com/PyThaiNLP/pythainlp) is Apache-2.0 code; its README distinguishes CC0/CC-BY-4.0 for its data/models. It provides Thai segmentation, POS and text/spelling utilities, but this evidence does not establish full Thai grammar correction.
- Disposition: plausible modular candidates are Argos EN↔RU/TH pending exact package audit, LanguageTool offline for EN/RU, and PyThaiNLP for Thai segmentation/spelling. Thai contextual grammar remains open research/evaluation, not an implemented or selected capability. Keep original text immutable until acceptance, preserve code/citations/formatting, and make cloud fallback opt-in.

### Assistant-side plugin role map — not aLandi runtime permissions
- **GitHub** is canonical repository change/CI evidence; **Exa** broad semantic discovery and primary-source search; **Firecrawl** developer docs, scraping and structured extraction; **Context.dev** live search/page extraction. Use source freshness and provenance, not the number of hits, as the quality signal.
- **Superpowers** supplies the working process: plan, failing test first, minimal patch, focused verification and a separate review pass.
- **Coder** supplies a separate build-link workflow for creating apps/sites; it is not a direct repository coding agent. Do not substitute it for GitHub code changes.
- **Cloudflare** docs are relevant for Browser Run/Guardrails and future Tunnel/Workers/Queues decisions; **Vercel** docs for sandbox firewall, durable execution and AI SDK patterns. Treat them as references unless the owner separately authorizes an actual provider integration.
- **Base44/Floot/Hercules** are app-builder surfaces; **Railway/Render/Hostinger** hosting surfaces; **TinyFish/BrowserAct** browser automation; **Plugin Management** connection discovery. They should not be parallelized into competing builders/hosts. No account access/OAuth/connector setup is authorized by this research.
- No plugin result is itself a runtime tool grant. Any future live integration requires connector credentials, scoped typed contract, owner approval, audit and exact evals.

### Next implementation disposition
1. Plan 1 remains first: strict bounded context packet + encrypted worker handoff + context-aware idempotency, then chat UI and K.6.16 live status.
2. Plan 2 follows: migrate the legacy four-stage pipeline into the separate `multi_step_evidence_report` Deep Research method with ResearchTrace parity.
3. Agent Library / multi-model router / Skills catalog / tool adapters / Translator / grammar / offline package proceed as subsequent K.5 phases. Do not install artifacts or turn speculative catalog entries into enabled features without exact provenance and evals.


## 2026-11-16 — OR-013 continuation: bounded AgentRun context, prompt-injection boundary and idempotent retries

**Status: SOURCE-VALIDATED.** Exa reviewed 9 targeted searches (64 result slots) and fetched official OWASP, OpenAI Agents SDK, AG-UI, Pydantic/FastAPI, IETF draft and Stripe pages. Search hits were filtered; these are design constraints, not claims of upstream dependency adoption.

- [OWASP LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html): user messages, retrieved files, web pages, tool outputs and conversation history are all untrusted channels. Delimiters/labels help model interpretation but are not an enforcement boundary. Validate tool arguments and authorize against the caller in execution code outside the model; least privilege and action-specific approval remain mandatory.
- [OWASP RAG Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html): preserve provenance and approved-document digests in a separately protected manifest; enforce source access at retrieval time, bound context size/chunk count, isolate tenants, fail closed and retain audit lineage. A hash proves integrity against a baseline, not content safety.
- [OpenAI Agents SDK Sessions](https://openai.github.io/openai-agents-python/sessions/): sessions retrieve stored history before a run and persist new items after it; `session_input_callback` can filter/reorder old history without re-persisting it as new input. Its docs warn SQLiteSession trusts the database and session ID is not authentication/authorization. aLandi borrows bounded selection, not the SDK or session storage.
- [OpenAI Agents SDK Context](https://openai.github.io/openai-agents-python/context/): local application context is not sent to the model; shared policy inputs can gate tool visibility, but execution code must still authorize operations and validate arguments. Persisted run state should not contain secrets.
- [AG-UI Events](https://docs.ag-ui.com/concepts/events): run lifecycle has explicit start and terminal success/error; activity state can use snapshot/delta updates and subagent attribution. Use durable aLandi events as recovery truth and UI activity as a projection; don't expose hidden reasoning or fabricate progress.
- [IETF HTTPAPI Idempotency-Key draft](https://ietf-wg-httpapi.github.io/idempotency/draft-ietf-httpapi-idempotency-key-header.html): a key must not be reused with a different request; optional request fingerprints detect mismatched retries. Same key + same fingerprint is replay; same key + different fingerprint is a conflict; concurrent duplicate behavior is distinct from completed replay.
- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests): idempotency is intended for retry after connection loss; parameter mismatch under a reused key is rejected. Key lifecycle/retention must be documented.
- [Pydantic strict models](https://pydantic.dev/docs/validation/latest/api/pydantic/config/) and [FastAPI body fields](https://fastapi.tiangolo.com/tutorial/body-fields/): explicit strict type validation, forbid unknown fields and bound text lengths. Current aLandi gateway uses explicit hand validation for the AgentRun body to avoid changing broader request model contracts.

### OR-013 implementation boundary
- AgentRun context is a versioned, bounded packet of explicit user/assistant history and typed selected-source excerpts. Preserve opaque IDs, source kind, scope and inclusion reason; never accept system/developer/tool roles or arbitrary nested metadata.
- Store packet only in existing Fernet payload vault; do not place raw text in SQLite run/task metadata or event rows.
- Reuse existing SQLite idempotency contract: same key and same request returns the original run; same key with changed prompt/context/model/strategy conflicts.
- Context text is still untrusted and grants no resource access. Keep AgentRun feature-off and direct chat default.
- Main chat context construction, source picker authorization, event status overlay and UI integration remain subsequent slices. No automatic transcript, whole-project file, arbitrary URL or memory ingestion.

## 2026-11-17 — AgentRun chat status projection and non-blocking observation

**Status: SOURCE-VALIDATED / IMPLEMENTED PARTIAL.** Rechecked the [AG-UI event model](https://docs.ag-ui.com/concepts/events) via Exa/Firecrawl/Context.dev as a reference for typed lifecycle/activity projection. The implementation deliberately retains aLandi's authenticated SQLite event journal and existing snapshot/events endpoints; AG-UI is not installed as a runtime dependency and no transport migration is justified by measured latency/load evidence.

- Keep durable run/task state and monotonic event IDs as recovery truth; the browser status surface is only a projection. Reconcile the current snapshot with replayed events and deduplicate by event ID.
- Render an allowlist of user-safe event labels only. Do not surface event metadata, raw prompts, encrypted payloads, hidden reasoning or untrusted source text.
- Keep one observer per run. Main-chat submission returns after server acceptance; the observer continues in the background so chat input is not held for the full run duration. Reload recovery reattaches to the existing run ID.
- Elapsed time is derived only from the server's run `created_at`; it is not a completion estimate or progress percentage. Cancellation is retryable after an unconfirmed response and only a server-confirmed terminal state is shown as cancelled.
- UI controls use the existing 44px mobile target contract and a polite status region that changes only when the state text changes. Future actions are not fabricated; they will appear only when the runtime emits typed, permission-aware operational events.
- No AG-UI SDK, SSE transport, second event store, extra worker, new permissions or model dependency added.

## 2026-11-17 — Owner architecture 2.0 review: primary-source verification and disposition

**Status: SOURCE-VALIDATED / CANDIDATE REVIEW ONLY.** Evaluated OR-003 against official upstream pages and current aLandi contracts. No hosting migration, runtime, dependency, model replacement or permission change is accepted here.

### Infrastructure and origin
- [Cloudflare Pages — custom headers](https://developers.cloudflare.com/pages/configuration/headers/): `_headers` applies to static asset responses, not responses generated by Pages Functions. Headers for Function/API responses must be attached in the Function response. This corrects the blanket claim that Pages cannot set COOP/COEP.
- [Cloudflare Pages — redirects and proxying](https://developers.cloudflare.com/pages/configuration/redirects/): `_redirects` supports 200 proxy rewrites only for relative URLs on the same site; it cannot proxy an external hostname. Rules do not apply to requests served by Pages Functions. A same-origin API design therefore needs a concrete Function/Worker route and tests; it is not established merely by adding a Tunnel hostname.
- **Disposition:** retain GitHub Pages/Jekyll browser client → Cloudflare Tunnel → FastAPI gateway → private loopback Ollama in AGENTS.md. Vite/Cloudflare Pages migration and same-origin API proxy are deferred until a requirement, route/auth/CORS design, parity tests and rollback plan exist.

### Retrieval and multilingual indexing
- [SQLite FTS5](https://www.sqlite.org/fts5.html) documents that trigram full-text queries with fewer than three Unicode characters do not match rows. Any experiment needs a short-query fallback.
- Trigram indexing alone does not provide Thai word segmentation or Russian morphology. Preserve current FTS5/lexical baseline until a permission-scoped RU/EN/TH golden set compares ranking/recall, citation correctness, short-query behavior, latency and RSS. sqlite-vec, embeddings and reranking remain candidates.
- Reuse existing RRF/lexical patterns before adding a reranker; a CPU reranker requires a measured relevance gap and a same-corpus baseline win.

### Model and voice checks
- [Qwen3.5-4B official model repository](https://huggingface.co/Qwen/Qwen3.5-4B): current card identifies Apache-2.0, image-text-to-text and Transformers/Safetensors artifacts. This does not establish compatibility with the current Ollama/GGUF runtime, target RAM/latency or chat-only quality. Keep it a candidate until exact runtime compatibility, digest, license and RU/EN/TH task evals are recorded.
- [PrismML-Eng Bonsai demo](https://github.com/PrismML-Eng/Bonsai-demo) documents upstream llama.cpp support for Bonsai 2 Q2_0 from release b11556 onward; PQ2_0 and PTQ1_0 remain fork-specific in the reviewed notes. Pin checkpoint format and inference backend together; existing staged artifact is not target installation.
- [whisper.cpp releases](https://github.com/ggml-org/whisper.cpp/releases): official v1.9.5 exists (2026-10-06) and is described as a maintenance release updating ggml to v0.26.0. This confirms the named version, not ARM real-time performance or a reason to replace the current ASR baseline.
- [Piper releases](https://github.com/OHF-Voice/piper1-gpl/releases): v1.8.0 is marked Latest. It adds a Thai TLTK phonemizer and documents limitations in the placeholder espeak-ng Thai phonemizer. Phonemizer support does not prove an approved/licensed Thai voice model exists; exact voice license, checksum and target-device tests remain mandatory.

### Architectural simplification proposals — deferred pending code/eval evidence
- Keep distinct cache contracts: browser cache, inference prefix/KV reuse and bounded exact-response cache; preserve bypass rules for tools, research, streaming, multimodal, partial and failed responses.
- Do not merge or delete provider/model/agent/skill registries until live schemas, ownership and consumers are mapped. A model catalog grants no capability or permission.
- Do not remove job leases/fencing/idempotency based only on a single-node assumption; inspect SQLite task lifecycle and verify cancellation, retry, stale-worker and restart behavior before simplifying.
- Keep Whisper/Vosk and Qwen3-ASR as comparative candidates until a same-corpus RU/EN/TH WER/CER/RTF/privacy evaluation selects a baseline.
- Pyodide, bubblewrap, MCP, sqlite-vec/OPFS, llama-server, cloud model fallback and a new router each require capability, security, compatibility, resource and rollback gates.
- systemd credentials/Unix sockets are future owner-runbook candidates; they do not authorize host installation, credential handling or VPS deployment.
- The chat → RAG → voice vertical slice is a useful product-value lens, but existing owner-approved Plan 1/2 and K.5 remain authoritative. No parallel backlog is created.


## 2026-11-17 — Landing 2.0 Product Architecture 2.0 external research

- TinyFish deep research run `01a1e8c8-4101-7a4a-90d4-dfe5da530fae`, completed 2026-11-17, 47 sources across source-grounded Notebook/RAG, Studio audio/slides/charts, local file storage, Coder sandbox, Offline Core, PEFT/LoRA, Skill Factory and catalog IA. [Full cited report](https://agent.tinyfish.ai/research/01a1e8c8-4101-7a4a-90d4-dfe5da530fae). Freshness: latest dated source 2026-10-31; 27 dated, 20 undated; none in requested recent window. Design input, not current-version proof.
- Source-grounded workflow references: [Mozilla document-to-podcast](https://mozilla-ai.github.io/document-to-podcast/step-by-step-guide/), [Podcastfy](https://github.com/souzatharsis/podcastfy), [Open Notebook](https://github.com/lfnovo/open-notebook), [NotebookLM-Lite](https://github.com/LRriver/NotebookLM-Lite), [SourceLens](https://github.com/msmahdinejad/SourceLens). Borrow selected-source chat, evidence and studio patterns; do not adopt whole stacks or treat upstream claims as aLandi evidence.
- Parsing/local storage: [Docling](https://github.com/docling-project/docling), [MinerU](https://github.com/opendatalab/mineru), [MDN OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system), [MDN quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria), [MDN File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API). Existing parser remains baseline; model licences separate.
- Offline/training: [Transformers.js](https://huggingface.co/docs/transformers.js/index), [WebLLM](https://github.com/mlc-ai/web-llm), [PEFT](https://huggingface.co/docs/peft/index), [Unsloth](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide). Browser WebGPU is not proof of tested offline capability; weights/data/tokenizer licences separate.
- Render/eval/skills: [PptxGenJS](https://gitbrent.github.io/PptxGenJS/), [python-pptx](https://python-pptx.readthedocs.io/), [Ragas](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/), [Agent Skills spec](https://agentskills.io/specification), [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/). Candidates only; pin versions and verify licence before adoption.
- Reuse existing aLandi IndexedDB, Gateway FTS5, Evidence Ledger, AgentRun and Coder Workspace. No dependencies, model weights, paid services or runtime were installed. Research-reported benchmark deltas, eviction timing and skill vulnerability percentages are not adopted as project facts without independent verification.


---

# Integrated legacy external-source catalogues (2026-11-18)

The following catalogues were merged here so INTEL.md is the single source/technique list. They are retained as historical research records, not implementation authorization. Candidate status, stale release notes, licenses and benchmarks must be rechecked before adoption.

## Technique and architecture register — migrated from docs/TECHNIQUE_REGISTER_RU.md

# Реестр проектов, техник и инженерных решений aLandi

**Срез источников: 2026-11-16.** Этот документ отвечает на практический вопрос: что именно мы переносим в текущий aLandi, что оставляем справочником, а что сознательно не ставим. Ссылка на проект не означает его установки.

## Базовый принцип

Рабочая архитектура остаётся: статический AI Mobile Agent / GitHub Pages → авторизованный aLandi Lite Gateway → Ollama → одна активная модель на VPS с 8 GB RAM. Инструкции развёртывания находятся в [ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md). UI и существующий код не переписываются на новый framework без измеримого основания.

## Реестр решений

| Проект | Что это | Что заимствуем / решение |
|---|---|---|
| [Harness²](https://github.com/google-research/harness2) | Исследовательский harness с циклом Propose–Probe–Compose и проверкой гипотез. | **Заимствовать bounded loop:** сначала сформулировать гипотезу/план, выполнить небольшой probe, проверить результат, затем compose. Не запускать полноценный benchmark harness и его executor на production VPS; сетевые полномочия и sandbox настройки проверять строго. |
| [Claudex Loop](https://github.com/chaseai-yt/claudex-loop) | Workflow для структурированного планирования, реализации, review и проверки. Ты писал «cloudex-loop»; ближайший проверенный проект с таким названием — Claudex Loop. Если подразумевался другой URL, его надо сверить отдельно. | **Взять как процесс, не как runtime:** каждый значимый patch должен включать goal → probe → минимальный diff → независимую проверку → тесты → отчёт. |
| [Everything Claude Code / ECC](https://github.com/affaan-m/ECC) | Набор coding-agent skills, rules, hooks, TDD/review/evaluation и compaction patterns. | **Избирательно применять TDD, security review, context compaction и verified learning.** Не устанавливать весь Claude-specific hook/MCP комплект в браузерный сайт или VPS; не переносить чужие project-specific инструкции без аудита. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Набор prompt/practices вокруг простых изменений и отказа от лишней сложности. | **Принять YAGNI и минимальные диффы:** не добавлять framework/service без подтверждённой нужды; всегда указывать, какое измерение или тест улучшает изменение. |
| [Agent Skills specification](https://agentskills.io/specification) | Формат для навыков с кратким описанием и раскрываемыми по требованию инструкциями. | **Применять progressive disclosure.** Сейчас сайт имеет собственные on-demand assets в папке skills и загружает их только в Deep / Research; сохранить текущий контракт и regression tests. Не менять расширения/формат всех навыков массово без выгоды для загрузчика. |
| [Hono](https://github.com/honojs/hono) | Лёгкий TypeScript web framework для нескольких JavaScript runtime. | **Не переносить backend на Hono:** текущий FastAPI gateway уже реализован, покрыт контрактными тестами и работает совместно с Ollama. Переписывание добавит риск и не даст доказанного выигрыша на 8 GB. |
| [Public APIs каталог](https://github.com/public-apis/public-apis) и [public-api сервер](https://github.com/davemachado/public-api) | Два разных проекта с похожими именами: первый — каталог открытых API, второй — служба для каталога. | **Только справочник разработчика.** Не добавлять как обязательный runtime или зависимости inference. Уточнять точный upstream, когда пользователь называет просто «Public API». |
| [Free Programming Books](https://github.com/EbookFoundation/free-programming-books) | Каталог бесплатных учебников/курсов программирования. | **Оставить источником обучения**, не скачивать целый каталог на сервер и не подмешивать книги к системному prompt. |
| [Developer Roadmap](https://github.com/kamranahmedse/developer-roadmap) / [roadmap.sh](https://roadmap.sh) | Учебные дорожные карты по разработке и технологиям. | **Использовать для плана освоения**, не runtime-компонент приложения. |
| [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) | Отдельная multi-agent interactive classroom платформа. Код в upstream помечен MIT, но проект требует свежий Node/pnpm, PostgreSQL и provider credentials/long-running app. | **Не устанавливать на базовый VPS:** дублирует существующий продуктовый интерфейс, добавляет БД и сервисы, требует отдельного сценария «виртуальный класс». Вернуться только при явной потребности. |
| [Every App](https://github.com/every-app/every-app) | Платформа для персональных приложений на инфраструктуре Cloudflare, а не кэш Ollama. | **Не подключать в текущем runtime.** Изучать, если появится отдельная задача быстро строить изолированные персональные приложения; не путать с Cloudflare Tunnel. |
| [Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Установка/набор capability adapters для доступа к research-площадкам и интернет-источникам; часть каналов зависит от аккаунтов/cookies и может ломаться. | **Не запускать installer по умолчанию.** Добавлять только отдельный source adapter с ясным allowlist, проверкой URL/SSRF и отдельными секретами. Текущие поиск/evidence trail сохраняются. |
| [Trail-Code](https://github.com/trailhq/Trail-Code) | Инструменты контекста кодовой базы/графа и долговременных project learnings. Это не модель и не кэш ответов LLM. | **Dev-only эксперимент**, если реальная навигация по коду станет бутылочным горлышком. Не ставить как постоянный server service; не принимать его findings автоматически в правила безопасности. |
| [Cactus Needle](https://github.com/cactus-compute/needle) | Маленькая модель/инструментарий для ограниченных structured extraction/tool-call задач, не универсальная code LLM. | **Только необязательный benchmark** для локального extraction/tool routing. Проверить точный артефакт/лицензию, language support и telemetry; upstream предусматривает opt-out через NEEDLE_TELEMETRY=0 и DO_NOT_TRACK=1. Не заменяет Qwen3.5 основной диалог. |
| [AirLLM](https://github.com/lyogavin/airllm) | Layer-wise/offload inference, в основном интересен экономией GPU VRAM за счёт дискового ввода-вывода. | **Не считать магическим способом ускорить большие модели на CPU.** Не ставить в текущий 8-GB runtime; только отдельное измерение на GPU host при конкретной задаче. |
| [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) | Студия генерации изображений/видео с множеством подключаемых провайдеров. Это не единый локальный LLM runtime. | **Отложить до отдельного Image/Video feature.** Явно различать локальное исполнение и стороннюю генерацию; проверять лицензию моделей и условия API. |
| [dsh-our-free-model](https://github.com/ebony-vinyl/dsh-our-free-model) | Плагин DeepSeek Harness с публичными внешними gateway/модельными каналами и локальным relay. | **Не подключать внешние бесплатные каналы к приватным данным.** «Free» не гарантирует приватность, SLA или неизменность условий upstream. Заимствовать только приёмы актуализации каталогов/обнаружения ошибок провайдера. |
| [CLI-Anything](https://github.com/HKUDS/CLI-Anything) | Метод разработки agent-friendly CLI с help, JSON output, понятными exit codes и тестированием end-to-end. | **Применить к будущим административным/benchmark CLI:** фиксированный allowlist команд, валидируемые аргументы, dry-run, JSON и exit status. Не выдавать обычному браузерному агенту shell-доступ. |
| [RAG-Anything](https://github.com/HKUDS/RAG-Anything) | Multimodal RAG, который раскладывает документы на текст/таблицы/формулы/картинки и сохраняет связи содержимого. Полная установка может требовать тяжёлые парсеры и системные зависимости. | **Принять архитектуру parser → структурные фрагменты → provenance page/bbox → retrieval → citations.** Полный runtime не ставить на 8 GB до benchmark реального корпуса и памяти. |
| [Pliny / L1B3RT4S](https://github.com/elder-plinius/L1B3RT4S) | Prompt-jailbreak / «liberation» примеры; это не runtime и не безопасная агентная система. | **Не включать jailbreak-тексты в system prompt/skills.** Можно держать безопасные отрицательные prompt-injection тесты, доказывающие, что документы не меняют правила инструментов/авторизации. |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Frontend design skill: сначала осмотреть существующий продукт, задать art direction, проверить реальные изображения/атрибуцию и браузерные screenshots. | **Взять только audit-first QA:** не редизайнить страницу, если это не требование; проверить desktop/mobile, keyboard/focus, reduced motion, затем исправить 1–3 конкретных дефекта. |
| [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch) | Учебный инженерный курс с исполняемыми задачами и retrieval/agent упражнениями. Это наиболее вероятный upstream для упоминания «AI / FROM SCRATCH», но имя в исходном запросе было неоднозначным. | **Build → run → test → benchmark → compare.** Сохранять runnable artifact и измеряемый результат, не переносить весь учебный runtime в проект. |
| [Moonshine Voice](https://github.com/moonshine-ai/moonshine) | On-device speech toolkit, отдельный от текущей задачи aLandi gateway. | **Не часть текущего плана развёртывания.** Рассматривать позднее только если пользователь отдельно запросит голосовой интерфейс и есть точная модель/лицензия для нужного языка. |

## Уже сделано в aLandi

- Сохраняется текущий статический AI Mobile Agent и его режимы; новый framework не внедряется.
- Существующие on-demand skills и evidence trail остаются частью приложения.
- В правильном репозитории реализуется preset aLandi Self-hosted Gateway без скрытого fallback на Gemini при пустом custom Base URL.
- Добавляется точный SQLite L2 cache: 900 секунд TTL, ограничение размера/количества, ключ с hash-scope credentials, только завершённый plain text с явной низкой temperature; stream, tools, multimodal/structured content, ошибки/partial outputs и динамические Research stages обходят его.
- Добавляются тесты и deployment guide. Наличие в реестре не означает, что внешние модели/сервисы были установлены или что VPS уже настроен.

## Очерёдность внедрения

1. Проверить версию и развернуть базовый gateway/Ollama, не трогая рабочие существующие маршруты.
2. Проверить auth, CORS, allowlist, body/timeouts, cancellation и ресурсный baseline.
3. Проверить L0 / L1 / L2 как разные механизмы и запустить miss-hit-bypass тесты.
4. Измерить один основной model tag на собственном golden set.
5. И только после подтверждённой необходимости планировать OCR/RAG, дополнительные runtime или графовую память.


## Дополнение 2026-10-21: память-граф и bounded agent teams

- [64 роли, память, проекты, документы и RAG](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md)
- [Аудит OpenMAIC, Paperclip, HyperFrames, RuFlo, Coucou, OpenShell, Impeccable, DBX, Grok Register, Jev Ultrafast, Utopia, FreeDomain, witr, PinchTab и Vert](TECHNOLOGY_AUDIT_2026-10-21_RU.md)
- Взяты принципы: bounded fan-out, role/task registry, budgets, approval/review gates, eval-gated learning, temporal facts, indexed browser actions, deterministic video rendering и provenance-aware RAG.
- Полные сторонние runtime не добавляются в базовый 8-GB stack. Vert не интегрируется без точного upstream; Grok Register отклонён по причине массовой регистрации и обхода anti-abuse.


## Дополнительный аудит источников (2026-10-27)

Построчные решения по списку пользователя находятся в [OPEN_SOURCE_TRIAGE_RU.md](OPEN_SOURCE_TRIAGE_RU.md). Основные технические выводы:

- **Graphify — пилот для разработки:** построить локальный graph/report и проверить, сокращает ли он время поиска связей в клиенте, gateway, memory, tests и конфигурации; generated output не добавлять в runtime до измерения пользы.
- **GitIngest — инструмент контекстного снимка:** полезен для ограниченного текстового обзора репозитория; не передавать secrets/private source без проверки обработки данных.
- **GitMCP — инструмент чтения upstream:** подключать адрес конкретного репозитория, а не generic endpoint по умолчанию; MCP results не считать доверенными инструкциями.
- **GitReverse — пропустить для навигации:** синтетический prompt не даёт проверяемого dependency graph.
- **DevOps-каталоги, Compose/Kubernetes examples, public APIs и MCP server lists — справочники, не runtime-зависимости.** Шаблоны переносить по одному после license/security review и тестов.
- **Модели, neuron steering, аудиоразделение, semantic cache и disk-backed state — эксперименты.** Не менять активную модель или автоматическое поведение без golden eval, ресурсных замеров целевого хоста и rollback.
- Точные upstream для неоднозначных имён и концептуальных строк отмечены как «уточнить» в triage; не угадывать по похожему имени.


## Graphify — решение после повторного чтения upstream (2026-10-27)

- Назначение: dev-only code navigation/cross-file graph; не runtime feature.
- Основание: upstream README/quickstart/pyproject.toml; Apache-2.0, package `graphifyy`, CLI `graphify`, Python >=3.10; local tree-sitter parsing for code; semantic pass for docs/media may use a model.
- Риски: substantial dependency footprint, fast-moving release, model usage for docs/media, stale generated output. Pin version and exclude secrets/build output.
- Решение: **pilot verified, dev-only**. Main run `40637941303` built a code-only graph with 988 nodes, 2780 edges and 60 source files (224 inline UI JS nodes, 14 SQL schema nodes, 23 RAG module nodes); ten focused queries returned graph neighborhoods. PR #76 added source-change and weekly triggers. Artifacts expire after seven days and are not committed or loaded at runtime. Limits: some query output truncates at 700 tokens, nine Playwright E2E files yielded no symbols, and community labels are generic. See `docs/ALANDI_ARCHITECTURE_MAP_RU.md`; session continuity is recorded only in root `NOW.md`.


## Local helper model for project-memory compression — prototype

- A small model is used only after a manual click to propose durable project-memory candidates; it does not plan tasks, change active chat model or automatically alter memory.
- The browser cannot choose a model. ALANDI_HELPER_MODEL is an exact operator-configured Ollama tag and blank by default.
- Boundaries: max 80 source facts, per-fact 600 chars, combined input 512–8000 chars, at most 12 candidates of 240 chars, timeout 1–180 s, same inference semaphore, keep_alive=0, no-store response, secret-like input/output filtering.
- Each candidate is rendered via textContent and saved only by explicit user action after rechecking the active project and duplicates.
- Status: merged in PR #69 at `4c9096999fbb3e1265150c420b136066c555285b`; exact-head Gateway/Quality/Chromium/published-site/provenance passed. Live helper model inference remains unverified; the endpoint stays disabled unless the operator configures an exact local Ollama tag.

## Synthetic local-model smoke harness — engineering tool, not model selection (2026-10-30)

- Recovered as `gateway/evals/run_local_model_benchmark.py` with tests in `gateway/tests/test_local_model_benchmark.py`.
- Fixed RU/EN/TH prompts; request count, timeout and response size are bounded; API key is read only from `ALANDI_API_KEY`; redirects are refused to prevent forwarding a bearer token; plain HTTP is restricted to loopback.
- Success means only a non-empty API response. This is not a correctness score, model-quality benchmark, RAM/PSS measurement or first-token benchmark. Gateway Tests passed on the exact PR #123 code head; target-host execution remains a separate gate.
- No helper model is selected or wired by this tool. The main model remains responsible for planning, complex reasoning and synthesis; an optional small helper may only perform bounded tasks after shared RU/EN/TH evaluation and resource measurements.

## Reciprocal Rank Fusion for scoped RAG — merged baseline (2026-10-28)

- PR #77 merged at `91557e4eab1b122341bed578cdf4775ff867007f`; combines FTS5/BM25 and lexical-concept graph candidate rankings using RRF with `k=60` and deterministic tie-breaks.
- No schema/API/dependency change; source/page provenance and scope filtering remain intact; `ALANDI_RAG_ENABLED=false` stays the default.
- The score is only for ordering, not confidence/probability. Automated tests passed on exact PR head; no production-quality improvement is claimed until a labelled >=50-query golden set compares Recall@5, MRR/nDCG, citation correctness, latency and peak RSS.
- Full criteria: `docs/RAG_RRF_EVALUATION_RU.md`, `EVALS.md` EV-RAG-RRF-001, `DECISIONS.md` D-018.


## 2026-11-08 — обновление техник после нового upstream-прохода

| Technique | Status | Применение в aLandi | Ограничение / gate |
|---|---|---|---|
| **Durable execution semantics** (Conductor / Temporal) | ACCEPT — principles only | Idempotency keys for side effects; explicit timeout/retry/cancellation; persisted checkpoints for long jobs; durable approval state; recovery drill | At-least-once means a tool can execute twice; no runtime adoption without real long-running workload and storage/ops budget |
| **Single-instruction + task-routing manifest** | ACCEPT | One concise `AGENTS.md`; `PROJECT_ORCHESTRATOR_RU.md` routes to one system map, one task register, one source inventory and relevant validators | Do not create another agent runtime, routing database or parallel backlog |
| **Modality-specific RAG probes** | ACCEPT | Add image-only/table-only questions, layout/table integrity checks, page/bbox lineage and citation support tests; select OCR by document class (born-digital vs scanned) and profile per-stage latency | Docling 2.148.0 vendor run: 6.6 s/page default vs 1.8 no-OCR on 4 vCPU / 15 GB; scanned OCR ~15 s/page. This is not a target-host benchmark; parser success does not prove retrieval or answer correctness |
| **Local ASR candidate evaluation** | PILOT CANDIDATE | Benchmark Qwen3-ASR-0.6B int8 via sherpa-onnx against the current baseline for Russian/Thai; record WER/CER, RTF, p50/p95 latency, peak RSS, cancellation | Verify exact model artifact and license; no install/promotion until target hardware and privacy tests pass |
| **Inference runtime tuning** | SOURCE-VALIDATED | Use llama.cpp docs for KV cache, batching, thread/CPU affinity and speculative decoding comparison | Keep Ollama baseline; only switch after same-model/same-hardware benchmark and rollback |
| **Code graph selection** | PILOT CANDIDATE | Graphify stays current dev-only baseline; exclude vendored upstream snapshots from `.graphifyignore`. Current PR #169 graph: 1,122 nodes / 3,014 edges / 69 source files after vendor exclusion. CodeGraph (Apache-2.0, local SQLite/tree-sitter, 34 MCP tools, architecture CI gate) merits a disposable 10-task comparison | Upstream zero-telemetry claim needs code review; compare task accuracy, source coverage, index/update time and peak RAM; no runtime dependency |
| **Model/source artifact provenance** | ACCEPT | Keep manifest, upstream revision/tag/full commit, exact license, artifact hash, size, downloader and verification procedure in Git. Vendored source snapshots require LICENSE + UPSTREAM-MANIFEST; exclude third-party trees from first-party Graphify indexing | Never place model weights in Pages source tree; use model cache/registry or governed Release assets if legal and within limits. Git blob SHA-1 proves file identity, not a substitute for SHA-256 on downloaded binaries |


## Дополнение 2026-11-08 — Evidence-driven main-first orchestration

**Статус: ACCEPTED AS OPERATING METHOD; runtime adoption not implied.** Source batch is recorded in INTEL.md.

- **Session Sync Capsule:** one batched live snapshot of main SHA/subject, all open PR IDs/title/base/head/draft/mergeability, open issues, selected exact-head check runs/statuses, and current Pages deployment. Treat snapshot as ephemeral until logged; never route by remembered PR number.
- **Single active writer / parallel read-only:** one PR branch may receive dependent writes; independent source/code reads may fan out. Each bounded slice completes exact-head checks → guarded merge → main integrity/quality → Pages live verification → immediate closure/disposition before selecting next slice. If the slice is blocked, checkpoint the reason and exact next action; do not open a speculative successor PR.
- **Durable handoff record:** append every complete owner request and material action to root `NOW.md`, including exact paths, parent/result SHA, commands/checks, limits, rollback and next step. Update K.5/PROJECT_STATE/snapshot/VOLLEY_LOG only at material milestones. No parallel handoff files, transcripts or private reasoning.
- **Graph-aided inspection:** use Graphify/code graph only when a code-level task needs caller/test discovery; verify findings against exact source and tests. Mark inferred links and graph limitations; never treat graph as proof. It is not a startup orientation step.
- **Acceptance as executable constraint:** for owner invariants, add structural/freshness/E2E checks where stable; root AGENTS is concise routing, deeper canonical docs hold detail. Never weaken test assertions for a green run.
- **Decision threshold for durable workflow engines:** continue the current simple deterministic pipeline unless measured long-running jobs, recovery/approval requirements and injected-failure tests demonstrate a need; compare operational footprint and idempotency semantics before adopting Temporal/LangGraph/Restate/DBOS.
- **Knowledge loop:** batch ~300 source catalog by themes, cross-check primary source and failure evidence, capture version/license/provenance and aLandi-fit decision in existing INTEL/triage/technique/DECISIONS/EVALS destinations. Acquire artifacts only after isolated pilot, baseline comparison, integrity checks and owner-visible approval.

**Primary source anchors:** OpenAI Agents SDK runner/multi-agent docs; Temporal durable execution docs/blog; LangGraph workflows/checkpointers; GitLab AI-assisted development handbook; Graphify architecture docs; GitHub exact-head status/merge queue/Pages docs; OWASP Agentic Top 10 2026; NIST AI RMF GenAI Profile. URLs and evidence summary are in INTEL.md.


## 2026-11-08 — typed worker capability contract and inert Skill boundary

**Status: SPECIFIED / safety contract; independent runtime remains DEFERRED.** Detailed canonical contract: `docs/AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md`; lifecycle/Builder design: `docs/AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md`.

- Each worker task must receive a minimal typed packet: run/task/parent IDs, idempotency key, objective, bounded input refs, output schema, model policy, deadline, token/tool/output budgets, explicit read/write/network/memory/execute scopes, approval, cancellation and evaluation contract. No implicit full chat/project history.
- Effective capability is the intersection `task_request ∩ agent_profile ∩ user_grant ∩ environment_policy`; empty intersection fails closed, never falls back.
- A Skill is inert instructions/resources, not credentials or a policy grant. Import/preview does not execute scripts; provenance/license, prompt injection, secrets, path traversal, executable/dependency inventory, version/hash and eval review precede admission.
- Binding a Skill to a worker pins a specific version and minimal excerpts; Skill instructions cannot widen tool allowlists, bypass approvals, increase budgets or reveal credentials.
- Blueprint-only state may be edited/saved; it must not display a Run/worker status unless an independently permissioned, traced, cancellable and eval-gated runtime exists.


## 2026-11-08 — Graphify UI Surface bridge (CI-only)

**Status: IMPLEMENTED IN PR #169 branch / exact Graphify workflow verification pending.** `scripts/graphify_ui_surface.py` adds deterministic CSS selector, DOM ID/class and JavaScript selector/mutation relationships to the Graphify JSON graph. It uses stable SHA-256-derived node IDs, source-file/line provenance, `tinycss2==1.4.0` pinned in the workflow, and explicit `EXTRACTED` vs `INFERRED` confidence. Exact simple-selector matches score 0.65; token-overlap candidates score 0.25; class mutation edges score 0.35. The graph labels are candidates, not proof of runtime/computed style. Unit tests cover deterministic relations, provenance, confidence bounds and selector mismatches. The Graphify workflow runs the unit test before graph extraction and executes the bridge only on the disposable tracked-file staging graph; script/test are excluded from the graph input itself.

## 2026-11-08 — research intake disposition

The PR #131/#125 research-doc sweep added 103 distinct URL refs to `INTEL.md` as **prior-research candidates / current upstream recheck pending**. They are not promoted to adopted techniques. Source admission still requires current version, exact upstream pin, license/provenance, security and hardware/storage fit, measurable baseline, reproducible evaluation and rollback. The single-source catalog policy is preserved; the duplicate 88-URL `AGENT_RESEARCH_CATALOG_RU.md` was not copied as a second register.


## 2026-11-08 — AgentRun SQLite state store prototype (PR #169 candidate)

**Status: PROTOTYPE / offline persistence only; exact Gateway CI pending.** `gateway/agent_runtime/store.py` provides a bounded local SQLite run/task state journal with idempotency keys, explicit run transitions, typed metadata schemas, task leases/fencing, retry budgets, cancellation, immutable event records, scope checks, SQLite busy timeout/foreign keys/secure_delete and restrictive DB file mode. It deliberately does not call models, execute tools, grant capabilities, schedule workers, coordinate multiple hosts, provide sandbox/approval enforcement or guarantee exactly-once external side effects. Backup/restore and retention are operationally out of scope; use SQLite online backup or quiesced consistent copies. The tests are isolated offline in `gateway/tests/test_agent_run_store.py`. This is a storage building block; Agent Blueprint/Worker Capability contract remains separate and DEFERRED until runtime policy, trace, approval, recovery and adversarial evals are implemented.


## 2026-11-16 — owner-directed agent, model and tooling review

**Status: SOURCE-VALIDATED / design dispositions recorded; no runtime or dependency adopted.** This work maps to the existing K.5 programme (Deep Research, Agents, Skills, Coder, modes/efficiency and model/runtime decision pack). It creates no parallel backlog.

| Source | Evidence-backed capability | aLandi disposition |
|---|---|---|
| [Ternary Bonsai 2 2B](https://huggingface.co/prism-ml/Ternary-Bonsai-2-2B-gguf) | Same 1.88B model in three packings: PTQ1_0 429,183,456 bytes (SHA-256 pinned), PQ2_0 0.52 GB (official default), Q2_0 0.55 GB (upstream llama.cpp b11556+); PTQ/PQ require PrismML fork. | **CANDIDATE / ARTIFACT STAGED.** Actions artifact #14192531688 verified (429,196,247 bytes; archive SHA-256 41ced309f0ff10e4bd9b0c464bf3fe42013e60e4d27cd308666744618c18655a; expires 2026-12-16). Embedded model file SHA-256 36061ad406df8a4903a6db005be350c50fabfaf717f9ef0acf4b76adcd9929fa. 430 MB is a packing, not a smaller parameter model. Generic local OpenAI-compatible adapter and same-hardware RU/EN/TH eval required before install/selection. |
| [Needle 2](https://huggingface.co/Cactus-Compute/needle2) | 45M, 14 MB binary, ~28 MB RAM; constrained tool JSON, confidence gate, top-five tool retrieval; v2.0.4 has a repeat-initialization crash report. | **DEFER.** Model card does not establish RU/EN/TH quality; benchmark only in an isolated process after lifecycle and schema-size tests. |
| [ghost-infer](https://github.com/affifuddin-hazam/ghost-infer) | Apache-2.0 Rust GGUF runtime, OpenAI-compatible API, NVIDIA-GPU-first; upstream benchmark uses 8 GB RTX 2060 SUPER with 24 GB host RAM. | **RESEARCH ONLY.** Current 8-GB VPS has no verified GPU/host memory fit. |
| [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) / [Codex](https://github.com/openai/codex) | Specialist-as-tool vs handoff, guardrails, approvals, sessions/traces/resume; local coding harness and workspace lifecycle. | **PATTERNS ONLY.** Extend existing AgentRun/SQLite and capability contracts; do not add a second orchestrator or grant shell from a role name. |
| [Stakpak](https://github.com/stakpak/agent) | Warden network guardrails, secret substitution, isolated subagents, async task/progress lifecycle. | **PATTERNS ONLY.** Reuse deterministic tool/network policy, secret redaction, per-worker scopes and recovery. |
| [Cloudroom](https://github.com/davidondrej/cloudroom) | One sandbox/branch per thread and persistent event history; README/docs conflict on sandbox admin rights; approval prompts are not used by default. | **PATTERNS ONLY.** Learn isolation/event model; reject no-approval default and resolve upstream permission claims before reuse. |
| [Kiri](https://github.com/LeeCheneler/kiri) and [control plane](https://github.com/Yeshwanthyk/kiri) | Local-first workspace, allow/ask/off permissions, worker delegation, keyboard-first session control. | **UX/WORKFLOW REFERENCE.** Two distinct projects; no dependency. |
| [Obscura](https://github.com/h4ckf0r0day/obscura) | Apache-2.0 V8/CDP/MCP browser; private-network blocking, DNS checks, token/origin/resource guards. | **DEFER browser adapter.** Only isolated worker with URL/SSRF policy and no ambient credentials. |
| [Memorilla](https://github.com/snap-stanford/memorilla) | Apache-2.0 latent query-conditioned memory; documented H100 80-GB CUDA workflows and GRPO training. | **RESEARCH CANDIDATE.** Compare idea against current MemoryManager/RAG; not suitable for current 8-GB host training. |
| [React Bits](https://github.com/DavidHDev/react-bits) | Animated React components; MIT + Commons Clause restricts redistribution/porting of components. | **VISUAL REFERENCE ONLY.** Implement original vanilla HTML/CSS/JS; no copying/porting or React dependency. |
| [OpenAI support-agent demo](https://github.com/openai/openai-support-agent-demo) | MIT Next.js example of File Search, suggested actions and human-in-the-loop review. | **FLOW REFERENCE ONLY.** Exact chat-demo identity remains ambiguous; no Next.js migration. |
| [KL divergence](https://spinningup.openai.com/en/latest/algorithms/trpo.html) / [critic-free RL](https://arxiv.org/html/2605.08666) | Policy-divergence constraint and GRPO/RLOO-style training methods. | **TRAINING/EVAL RESEARCH ONLY.** Neither is a runtime agent or independent reviewer. |
| VoxCPM2 | Owner explicitly asked to defer voice-context review. | **DEFERRED.** |

### aLandi-native agent execution design direction

- One coordinator owns the run, task graph and final result. It may call a specialist as a bounded tool (manager retains control) or hand off only when the specialist should own the rest of the turn.
- Every worker receives a minimal typed packet: run/task/parent IDs, idempotency key, objective, bounded input references, output schema, model policy, deadline, token/tool/output budgets, explicit read/write/execute/network/data scopes, approval, cancellation and eval contract. Never pass the full conversation by default.
- Effective capability is the intersection of task request, agent profile, owner grant and environment policy; an empty intersection fails closed. Imported Skills remain inert and cannot grant permissions.
- Parallel workers require separate execution contexts, bounded fan-out/concurrency, queue leases/fencing, durable events/checkpoints, retry/idempotency, cancellation and recovery. One model slot remains the baseline until a measured need justifies more.
- Independent review requires an actually independent verifier or deterministic checks. A same-model critic is useful structured feedback but is not independent evidence.
- Coder requires an isolated workspace manifest, patch preview, command/test allowlist, approval tickets bound to exact arguments, redacted logs, recoverable file operations and a tested sandbox. OpenShell v0.1.8 remains staged, not installed.
- Model routing is task-based: deterministic code first; a small model only for bounded classification/extraction/reranking/tool selection; the main model for complex planning/synthesis. Do not assign one model to each of 64 role labels.

### Next implementation order

1. Correct the two stale Research Trace E2E assertions on exact main and restore green Quality/Chromium.
2. Finish explicit Research Trace → EvidenceLedger save using only returned source-quote IDs; then add provider adapters and resumable run state.
3. Extend existing AgentRun to a real bounded specialist/worker lifecycle; add isolated contexts, task graph, leases, event resume, approval and failure-injection tests before exposing parallel modes.
4. Wire Coder only to a tested isolated workspace; no host shell or broad filesystem access.
5. Run the task-based RU/EN/TH model bake-off on the actual target hardware. Bonsai 2 2B is a candidate only after a supported runtime path; Needle 2 is not a default multilingual model.
6. Keep browser automation, latent memory and RL training behind separate opt-in experiments and measurable acceptance gates.

No external package, runtime, model weights or UI framework was installed in this review.

## 2026-11-16 — OR-012: Agent Library, local model routing, browser/Coder and RU/EN/TH offline language

**Статус: SOURCE-VALIDATED / решения по применению записаны; зависимости не устанавливались.**

| Подсистема | Upstream / подтверждённый факт | Принцип для aLandi | Не делать |
|---|---|---|---|
| Agent Skills | [agentskills.io specification](https://agentskills.io/specification): папка Skill с обязательным `SKILL.md`, YAML-frontmatter (`name`, `description`), optional `scripts/`, `references/`, `assets/`, license/compatibility. `allowed-tools` помечен experimental. | Versioned manifest, progressive disclosure, provenance/license, test/eval, dependency list, enable/disable and rollback. Skill describes procedure; real permission comes only from policy broker. | Не трактовать imported Skill или `allowed-tools` как ACL или разрешение на браузер/файлы/shell. |
| Model Registry | [Ollama /api/ps](https://docs.ollama.com/api/ps) gives digest, size, quantization details, VRAM, context length and expiry; [Ollama /api/show](https://docs.ollama.com/api-reference/show-model-details) gives license, capabilities, params and model_info. | Store exact digest, license, task/language capabilities, measured quality, latency, load time, RAM/VRAM, context; route by task-fit + hardware budget. Return NoFit explicitly. | Не распределять «одна модель на профессию» и не считать число установленных моделей доказательством возможности параллельного выполнения. |
| Runtime scheduling | [Ollama FAQ](https://docs.ollama.com/faq): simultaneous models only when memory permits; otherwise queued/unloaded; parallel requests multiply context memory. | Keep worker/model slot=1 as current safe baseline. Measure on target host before tuning loaded-model count, parallelism or queue depth. | Не увеличивать `OLLAMA_NUM_PARALLEL` / loaded models до RAM/VRAM/latency measurement. |
| Browser capability | [Cloudflare Browser Run](https://developers.cloudflare.com/agents/examples/browser-agent/), [Playwright sessions](https://developers.cloudflare.com/browser-run/playwright/), [Guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/). Guardrails are per-session hostname allowlists; omitting them permits unrestricted HTTP(S). | Future adapter gets one isolated per-run browser session, explicit allowed domains, no ambient credentials, bounded navigation/extraction, audit and explicit approval for write/submit. | Не внедрять CDP as broad agent tool or assume default Browser Run policy is restricted. No Cloudflare runtime integration now. |
| Local Coder isolation | [Vercel Sandbox firewall](https://vercel.com/docs/sandbox/concepts/firewall): supports deny-all and domain allowlist policies; persistent sandboxes snapshot filesystem. | Reuse ideas for separate isolated executor, explicit workspace manifest, no-network default, approved commands, patch preview, argument-bound tickets, audit and recovery. | Не add Vercel sandbox as dependency or give BrowserLocal file handle direct shell/test rights. |
| Queue/recovery | [Vercel Queues Python SDK](https://vercel.com/docs/queues/python-sdk): durable queue delivery is retry-oriented, so handlers must be idempotent. | Existing SQLite leases/fencing/event cursor remain; request digest includes prompt + context, and retry reconciles the same run. | Не add a second queue (Redis/Vercel/Temporal) for the current single-host prototype. |
| Offline MT | [Argos Translate](https://github.com/argosopentech/argos-translate) is MIT code; models are separate `.argosmodel` packages and can pivot through an intermediate language. [Live package index](https://github.com/argosopentech/argospm-index/blob/main/index.json) lists EN↔RU and EN↔TH 1.9 directions. | Candidate local translation adapters; each packaged model gets immutable source, revision, SHA-256, per-artifact license, size, hardware profile and golden-set test. | The index has no weight SHA/license, so don't bundle based on index presence or software MIT license alone. |
| Grammar EN/RU | [LanguageTool](https://github.com/languagetool-org/languagetool) core is LGPL-2.1+; [language matrix](https://dev.languagetool.org/languages) checked v6.6 (2025-03-27) lists EN/RU, not Thai; [embedded server](https://dev.languagetool.org/http-server.html) lacks AI cloud rules. | Local baseline for explicit grammar-check action in English/Russian, subject to jar/dictionary/license pin and measured packaging size. | Don't imply full cloud parity; don't include proprietary/cloud-only rules. |
| Thai text tooling | [PyThaiNLP](https://github.com/PyThaiNLP/pythainlp) code Apache-2.0; project separates CC0/CC-BY-4.0 data/models; supports segmentation/POS/text processing and spelling/correction utilities. | Candidate Thai tokenizer/spell/lexicon component. Add model-backed grammar correction only after Thai golden-set evaluation. | Don't label segmentation/spell correction as comprehensive Thai grammar checking. |
| Research method catalog | [OpenAI Deep Research cookbook](https://developers.openai.com/cookbook/examples/deep_research_api/introduction_to_deep_research_api_agents), [Anthropic multi-agent research](https://www.anthropic.com/research/multi-agent-research-system), [LangChain Open Deep Research](https://www.langchain.com/blog/open-deep-research), [NVIDIA Deep Researcher](https://github.com/NVIDIA-AI-Blueprints/deep-researcher-agent). | Decompose target menu into source lookup, evidence report, comparison, literature review, audit and Notebook synthesis, each with a real method handler, citation policy, budget and eval. Existing four-stage aLandi pipeline stays one `multi_step_evidence_report`. | Не label same-model critique as independent review or expose unimplemented menu options as executable. |

### Assistant-side plugin roles, separated from product capabilities
- GitHub: canonical code, branch/HEAD and exact CI evidence.
- Exa: broad semantic search and upstream discovery; Firecrawl: developer documentation and extraction; Context.dev: live search/page scrape.
- Superpowers: plan/TDD/verification process.
- Coder: build-link/app-generation workflow, not direct GitHub repository editing.
- Cloudflare/Vercel: primary-source references for browser, firewall, sandbox and queue patterns; not integrated aLandi runtime providers.
- Base44/Floot/Hercules: alternative app builders; Railway/Render/Hostinger: hosting. Avoid competing builds/hosting products. TinyFish/BrowserAct: browser automation tools, not default runtime agent tools.
- Connector availability does not equal owner authorization or product capability. Live credentials and per-run grants are separate.

### Translator readiness decision
1. Argos EN↔RU/TH package directions are discovery candidates only; obtain per-package version, immutable artifact SHA, license notice and test corpus before download/redistribution.
2. LanguageTool is a realistic offline grammar baseline for EN/RU but not Thai, and its embedded server doesn't include upstream cloud AI features.
3. PyThaiNLP is a Thai language-processing toolbox, not an all-purpose grammar checker.
4. Therefore the translator feature can be designed around capability matrix and replaceable language adapters; do not promise full offline parity across RU/EN/TH until a golden set and target-hardware tests pass.

**No new runtime, package, model artifact, connector or external account was installed.**


## 2026-11-16 — OR-013: Bounded context packets and prompt-injection-resistant AgentRun handoff

**Статус: IMPLEMENTED / exact-head verification pending.**

| Источник | Подтверждённый принцип | Применение в aLandi |
|---|---|---|
| [OWASP Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) | Диалоги, файлы, retrieved content, страницы и tool output — недоверенные каналы. Маркеры/разделители сами по себе не защищают. Разрешения и валидация аргументов проверяются вне LLM на границе исполнения. | Контекст сериализуется как untrusted JSON reference data; не выдаёт никаких разрешений. Будущие tools обязаны иметь отдельный policy broker и серверную проверку прав. |
| [OWASP RAG Security](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) | Нужны provenance, integrity manifest, размерные лимиты, контроль доступа при retrieval, fail-closed и аудит. SHA-256 подтверждает совпадение с baseline, но не безопасность содержимого. | Для выбранных источников сохранять ID/kind/scope/inclusion reason; позднее добавить signed provenance при проектном Sources ingestion. |
| [OpenAI Agents SDK Sessions](https://openai.github.io/openai-agents-python/sessions/) | Session history извлекается перед run; callback позволяет ограничить/переупорядочить историю. Session ID не аутентифицирует пользователя и не авторизует доступ. | Контекст передаётся явно в запросе, а не подтягивается по opaque scope ID. Не копировать SDK session storage. |
| [OpenAI Agents SDK Context](https://openai.github.io/openai-agents-python/context/) | Local app context не посылается LLM; доступность инструмента не равна разрешению на операцию — проверка остаётся в реализации tool. | Разделять metadata/authorization и сериализуемые reference excerpts. |
| [AG-UI Events](https://docs.ag-ui.com/concepts/events) | Run lifecycle требует старт и терминальный success/error; activity поддерживает snapshot/delta, subagent attribution. | Следующий UI slice использует durable SQLite events как recovery truth, compact activity projection как сворачиваемое окно. |
| [IETF Idempotency-Key draft](https://ietf-wg-httpapi.github.io/idempotency/draft-ietf-httpapi-idempotency-key-header.html) | Одинаковый key + fingerprint — replay; тот же key с иным payload — conflict; concurrent duplicate — отдельный случай. | Существующий SQLite store сравнивает request fingerprint; goal_ref теперь включает канонический prompt/context/profile/model/strategy digest. |
| [Pydantic strict config](https://pydantic.dev/docs/validation/latest/api/pydantic/config/) | `strict=True` и `extra='forbid'` предотвращают coercion и молчаливое игнорирование неизвестных полей. | Ручной валидатор контекста и allowlist верхнеуровневых API полей; не добавлять новую runtime dependency. |

### OR-013 packet contract
- Version 1; message roles только `user` / `assistant`; никакого `system`, `developer`, `tool` или произвольного вложенного metadata.
- Source item содержит только opaque `id`, allowlisted `kind`, `scope`, `inclusion_reason` и extracted text; ID уникальны между сообщениями и источниками.
- Лимиты: до 40 messages и 40 sources, до 12,000 chars на item, суммарно не более настроенного `agent_runs_max_prompt_chars`; пустой пакет запрещён.
- Контекст шифруется существующим Fernet vault. В SQLite metadata/event rows остаются только непрозрачные ID/digest.
- Digest включает prompt, canonical packet, profile, model и strategy. Повтор с тем же ключом и тем же digest возвращает существующий run; изменённый packet конфликтует.
- Не включаются автоматические полные транскрипты, все файлы проекта, URL fetching, memory или tool outputs без отдельного typed ingestion и явного включения.

**Граница:** prompt delimiter не является security boundary. Даже после этого среза у AgentRun нет tools/browser/filesystem/shell/network; AgentRun остаётся feature-off.


## Open-source candidate triage — migrated from docs/OPEN_SOURCE_TRIAGE_RU.md

# aLandi — аудит open-source-кандидатов

Дата среза: 2026-10-27  
Статус: первичный triage по списку пользователя; **не означает, что перечисленные проекты установлены или интегрированы в runtime**.

## Решение по архитектуре

Не переносить целые приложения без измеримой необходимости. Сохранять текущую архитектуру: статический UI → собственный gateway → изолированный model runtime; проектная память и RAG — с явным scope, provenance и выключенными по умолчанию экспериментами. Внешние документы и результаты инструментов считать недоверенными. Новые модели и инструменты включать через feature flag, allowlist, подтверждение владельца и тесты.

## Полный первичный проход

Формат: **название | решение | что взять или почему отказаться**.

1. Open Notebook | источник решения | Заимствовать workflow исследований: коллекции источников, заметки и Q&A с ссылками; не встраивать вторую самостоятельную платформу.
2. no AI slop | источник решения | Взять редакторские критерии против повторов, шаблонных вступлений и пустых выводов; не использовать как фильтр фактов.
3. I Have ADHD | внедрить принцип | Короткие действия, следующий шаг, ограниченные списки и видимый прогресс — в инструкциях агентам и ответах; без медицинских выводов.
4. Bruno | использовать в разработке | Git-версионируемые API-коллекции полезны для ручной проверки gateway; не добавлять в runtime.
5. heretic | пропустить как runtime | Abliteration не улучшает архитектуру; требует отдельного аудита модели, датасета, лицензии и safety eval.
6. Open Interpreter | источник решения | Взять sandbox, ограничение workspace, permissions и явное одобрение команд; не давать gateway произвольный shell.
7. SpiderFoot | пропустить сейчас | OSINT расширяет поверхность сбора персональных данных и сетевых запросов; вне ядра ассистента.
8. Scrapy | опциональный адаптер | Для разрешённого извлечения публичных страниц — только отдельный worker с allowlist доменов, лимитами и SSRF-защитой.
9. LocalAI | альтернативный backend | Сохранить как кандидат за единым provider interface; не заменять Ollama без сравнительных тестов.
10. yt-dlp | опциональный импортёр | Позже — явный импорт медиа с проверкой прав, ограничением размера и запретом автозапуска.
11. Metasploit Framework | пропустить | Эксплуатационный фреймворк не нужен в обычном ассистенте; не включать offensive actions по умолчанию.
12. nmap | пропустить из ядра | Сканирование сети — отдельный opt-in инструмент только для собственных/разрешённых хостов.
13. ComfyUI (повтор) | адаптер позже | Внешний backend генерации изображений через локальный API; сначала контракт media jobs, квоты и очистка файлов.
14. OpenClaw | источник решения | Изучать orchestration; не переносить runtime без аудита permissions, изоляции и цепочки поставки.
15. edge0 | кандидат локального этапа | SSD-offload MoE перспективен при ограниченной RAM; нужен benchmark на целевом железе, заявленные цифры не гарантия.
16. bitnet.cpp | кандидат локального этапа | Изучить низкобитный CPU inference; проверить совместимость модели, качество и скорость на реальном устройстве.
17. manimGX | уточнить | Точное upstream-имя и репозиторий не установлены; не внедрять по одному названию.
18. DeerFlow 2.0 | источник решения | Исследовать исследовательские workflow; не импортировать большой агентный стек без сравнения с bounded DAG.
19. ollaya | уточнить / пропустить | Вероятная опечатка или неоднозначный проект; не считать его Ollama без подтверждения.
20. EmbeddingGemma2 | кандидат модели | Рассмотреть локальные embeddings после проверки точного model card, лицензии, размера и retrieval eval.
21. LibreTranslate | опциональный сервис | Локальный перевод может снизить отправку текста наружу; нужен отдельный адаптер и RU/EN eval.
22. SearXNG | приоритетный источник интеграции | Самостоятельный метапоиск подходит приватному web-search gateway; нужны таймауты, ограничение запросов и очистка результатов.
23. self-evolution | источник принципа, не автопилот | Предлагать улучшения через eval, diff, approval и rollback; автономное изменение production отклонить.
24. agent bridge | источник решения | Нужен стабильный typed bridge между UI, gateway и инструментами; внедрять после идентификации upstream/API.
25. llmtrim | экспериментальный кандидат | Проверить context compression на golden set; принять только при сохранении фактов, цитат и качества.
26. The Agency | источник skills | Брать узкие проверенные роли/инструкции; не клонировать набор промптов как архитектуру.
27. gstack | workflow reference | Заимствовать этапы review/test/browser QA по одному skill с тестами.
28. awesome-opus5-5-videos | каталог ресурсов | Сохранить как необязательную ссылку для обучения; не runtime-зависимость.
29. Syncthing | кандидат синхронизации | Для переносимой локальной памяти подходит file sync; позже нужны конфликт-резолвинг, шифрование и backup/restore тест.
30. Cloudflare Code Mode | кандидат tool adapter | Изучить typed API/tool access; исполнять только в изоляции с ограниченными capabilities.
31. MiniMind | учебный источник | Использовать для экспериментов с малыми моделями, не production dependency без benchmark.
32. onenMaic | уточнить | Точное имя/репозиторий не подтверждены.
33. OpenCloud | кандидат файловой интеграции | Сравнить с local-first подходом; не добавлять второй files backend без конкретного сценария.
34. OpenAI agent manage/mover | уточнить | Название не идентифицирует однозначный upstream.
35. Can I Vibecode | ресурс/каталог | Полезен для обучения/discovery, не архитектурная зависимость.
36. Vitrine | уточнить | Имя неоднозначно; upstream не идентифицирован.
37. anmolkapil/plexo | исследовать отдельно | Нужны подтверждённые назначение, лицензия, активность и конкретный выигрыш.
38. concou | уточнить | Точное upstream-имя не установлено.
39. system-prompts-and-models-of-ai-tools | справочник | Использовать как исследовательский материал; не копировать чужие промпты без проверки лицензии и безопасности.
40. Official MCP Registry | приоритетный discovery | Использовать для поиска MCP-серверов; отдельно проверять издателя, permissions, лицензии, зависимости и schema. Registry не равен allowlist доверия.
41. AppFlowy | внешний продукт/интеграция | Рассматривать как экспорт/knowledge connector; не встраивать его workspace в UI aLandi.
42. foooc b us | уточнить | Неоднозначная строка, проект не идентифицирован.
43. Colibry | уточнить | Имя неоднозначно; нужна точная ссылка.
44. AirLLM | экспериментальный backend | Проверить memory-saving inference на подходящем checkpoint/устройстве; не обещать любую большую модель на малой RAM.
45. skilspectator | уточнить | Точный upstream не подтверждён; возможно опечатка.
46. slee-persis/GVS5H | исследовать отдельно | Польза, лицензия и API не подтверждены в этом проходе; исходники не копировать до аудита.
47. DeepInfer | уточнить | Название неоднозначно без URL.
48. Muse Code | источник решений | Проверять идеи coding agent на задачах и тестах; не добавлять второй runtime без доказанного преимущества.
49. Understand Anything | источник решения | Полезны карта кодовой базы и связи; начать с лёгкого индекса с provenance, не держать второй тяжёлый индексатор постоянно.
50. agent memory | исследовать категорию | Сравнить Mem0/Hindsight/Graphiti с существующей SQLite/FTS5 scoped memory; не подключать несколько конкурирующих stores.
51. scientific agent skills | приоритетный пакет навыков | Добавлять узкие навыки поиска литературы, проверки доказательств и воспроизводимых вычислений с цитированием.
52. diagram design | skill/reference | Заимствовать правила читаемых диаграмм и проверять рендеринг; не добавлять runtime-зависимость.
53. OpenViking | memory/context candidate | Сравнить retrieval и provenance с текущей памятью; не мигрировать без eval и export/restore теста.
54. grill-me | skill-кандидат | Режим уточняющих вопросов для проектирования включать по запросу, не превращать каждый диалог в опрос.
55. TimesFM | специализированная модель | Подходит для временных рядов, не общего чата; отдельный optional skill/backend.
56. Ruflo | источник решения | Изучить координацию агентов; предпочесть bounded DAG и явные бюджеты вместо бесконтрольного swarm.
57. MiniCPM-V apps | мультимодальный кандидат | Проверить локальный vision/OCR на реальных данных и целевом железе; не загружать автоматически.
58. Voice Studio | уточнить | Название неоднозначно; voice runtime требует собственного контрактного и privacy-аудита.
59. Orca | уточнить | Несколько проектов/моделей с таким именем; нужен точный upstream.
60. Headroom | уточнить | Неясно, какой именно проект имеется в виду.
61. CLI-Anything | источник решения | Полезны узкие CLI-адаптеры; запускать в sandbox с allowlist и approval.
62. Open WebUI | reference/опциональный UI | Benchmark UX и MCP-поддержки; не сливать второй UI в текущий статический клиент.
63. Handy | уточнить | Имя неоднозначно; нужна ссылка.
64. Meetily | опциональный импортёр | Потенциально полезны локальные транскрипты встреч; opt-in с согласием участников и явным хранением.
65. Vain | уточнить | Точный upstream не установлен.
66. OpenCode | workflow/reference | Заимствовать provider-agnostic coding workflow; не запускать второй агент в фоне без необходимости.
67. Open Notebook (повтор) | объединено с №1 | Дубликат, повторная интеграция не нужна.
68. Dyad | внешний инструмент разработки | Опция для локального vibecoding, не часть runtime aLandi.
69. AgenticSeek | reference | Изучить локальный агентный workflow; browser/OS-control требует sandbox и approval.
70. Duix Avatar | опциональная мультимодальность | Аватар не усиливает базовый интеллект; отложить до рабочего voice/media pipeline и проверки лицензий.
71. theAlgorithms/python | учебный источник | Ссылаться на алгоритмы для обучения; проверять лицензию/provenance перед копированием.
72. ML-for-beginners | учебный источник | Использовать в учебных маршрутах, не в runtime.
73. homemade-machine-learning | учебный источник | Примеры для обучения; не production dependency.
74. machine-learning-interview | учебный источник | Библиотека обучения при необходимости; не влияет на ядро.
75. deep-learning-papers-reading-roadmap | research resource | Сохранить как последовательный маршрут чтения статей.
76. tensorflow-examples | учебный источник | Не внедрять в runtime; использовать, если конкретная задача требует TensorFlow.
77. PyTorch/tutorials | учебный источник | Для воспроизводимых экспериментов, не runtime.
78. llama-course | учебный источник | Для обучения по LLM, не зависимость продукта.
79. generative-ai-for-beginners | учебный источник | Учебный ресурс, не часть продукта.
80. awesome-ChatGPT-prompts | справочник с низким приоритетом | Не переносить коллекцию массово; каждую инструкцию проверять по задаче, лицензии и eval.
81. 500-AI-ML-DL-CV-NLP-Projects-with-code | каталог примеров | Discovery only; лицензии и код проверять у каждого отдельного проекта.
82. awesome-machine-learning | каталог | Использовать для поиска, не добавлять зависимости только за наличие в списке.
83. Papers with Code | research discovery | Статьи/реализации полезны, но результаты сверять с первоисточниками.
84. Caveman | skill-кандидат | Рассмотреть краткий режим как переключаемый стиль, не глобальное сокращение инженерных ответов.
85. Graphify | кандидат индексации | Проверить выигрыш над текущими индексами на offline eval по кодовой базе.
86. Browser Harness | кандидат тестирования | Полезны реальные browser smoke tests; внешнюю навигацию ограничивать доменами.
87. Claude Video | уточнить | Не интегрировать без точной ссылки, API и лицензии.
88. Open Design | reference/skill | Заимствовать правила дизайн-системы и доступности; не заменять UI вслепую.
89. Codebird | уточнить | Имя неоднозначно; нужен точный upstream.
90. Impeccable | skill-кандидат | Дизайн-review checklist — если подтверждены лицензия и формат skill; автоматическую правку не считать доказанным улучшением.
91. Design Extract | кандидат tooling | Изучить извлечение дизайн-токенов с проверкой источника, прав и точности.
92. n8n MCP | интеграция через границу | Внешний workflow connector при конкретном сценарии; auth, scopes, approval и аудит обязательны.

## Конкретные улучшения для ядра

1. **Единый upstream registry**: canonical URL, license, дата проверки, статус, риск, разрешения, benchmark и rollback для каждого кандидата.
2. **Skill-first**: ADHD-friendly output, no-slop review, grill-me, scientific research и diagram design — маленькие versioned skills, а не новые сервисы.
3. **Tool gateway**: web/CLI/browser/MCP проходят typed schema, least privilege, allowlist, timeouts, budgets, approval и audit; никакого shell из browser UI.
4. **Портативная память**: source of truth — экспортируемые Markdown/JSON/SQLite; индексы пересоздаваемы; project scope и provenance обязательны; sync — opt-in с конфликтами.
5. **Provider abstraction**: Ollama остаётся текущим путём; LocalAI/edge0/bitnet.cpp/AirLLM — кандидаты benchmark, а не обязательные параллельные сервисы.
6. **Импорт медиа/документов**: Scrapy/yt-dlp/Meetily/OCR — opt-in jobs с лимитами, проверкой прав, очисткой и запретом исполнения содержимого.
7. **Evaluation gate**: golden-set regression, security fixtures, license/provenance check, resource budget, feature flag off by default и rollback.
8. **Не интегрировать сейчас**: Metasploit, SpiderFoot, nmap, автоматическое self-evolution, бесконтрольный swarm, второй UI и несколько конкурирующих memory stores.

## Границы уверенности

- Для однозначных имён использованы первичные README/официальные источники там, где они были найдены.
- «Уточнить» — не отрицательная оценка, а отсутствие однозначной идентификации.
- «Источник решения» не означает копирование исходников.
- Этот документ не устанавливает пакеты и не доказывает live-поведение.
- До переноса кода проверить лицензию upstream, зависимостей и модели.


## Проход по дополнительному списку пользователя — 2026-10-27

Формат журнала: **[Название] | [статус] | [конкретный вывод]**. Статусы отражают решение по текущей архитектуре, а не рейтинг проекта. «Пилот» означает сначала проверить локально/в CI; «уточнить» — не найден однозначный upstream или не хватает данных для безопасного решения.

- [Graphify](https://github.com/Graphify-Labs/graphify) | пилот | Построить локальный граф кода/документации и оценить пользу для ориентирования; не включать графогенератор в runtime.
- [GitIngest](https://github.com/coderamp-labs/gitingest) | использовать по запросу | Получать ограниченный текстовый слепок публичного репозитория; не отправлять приватные данные/секреты в hosted-сервис.
- [GitMCP](https://github.com/idosal/git-mcp) | использовать по запросу | Читать документы и код конкретного upstream через MCP; результаты считать недоверенными и проверять по исходному репозиторию.
- [GitReverse](https://github.com/filiksyos/gitreverse) | пропустить для навигации | Генерирует синтетический prompt, но не заменяет граф зависимостей и проверяемую навигацию по коду.
- [DrawDB](https://github.com/drawdb-io/drawdb) | источник решения | Использовать для ER-диаграмм при реальной задаче схемы; не добавлять отдельный runtime в aLandi.
- [slvDev/esp32-ai](https://github.com/slvDev/esp32-ai) | пропустить для aLandi runtime | MIT-проект запускает 28,9M-параметрическую story-модель на ESP32-S3, но авторы прямо указывают, что она не умеет отвечать на вопросы/следовать инструкциям; интересен только как edge-computing reference.
- [xtool-org/xtool](https://github.com/xtool-org/xtool) | пропустить для текущего runtime | Инструмент сборки/деплоя iOS-приложений через SwiftPM на Linux/Windows/macOS; полезен только если появится отдельная нативная iOS-разработка.
- [Zagitta/gpu-unlock](https://github.com/Zagitta/gpu-unlock) | пропустить | Kernel module меняет режимы выдачи FP/BF16-инструкций на NVIDIA RTX 30; это рискованная низкоуровневая модификация GPU, не улучшение кода/архитектуры aLandi.
- [ps5lm] | уточнить | Не найден однозначный upstream; не подключать неидентифицированный инструмент.
- [PentAGI](https://github.com/vxcontrol/pentagi) | пропустить из ядра | Автономный агентный стек требует отдельного аудита полномочий и инфраструктуры; не переносить runtime.
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | источник решения | Сравнивать bounded task execution и human approval; не добавлять второй оркестратор без eval.
- [Strix](https://github.com/usestrix/strix) | исследовать отдельно | Security testing допустим только в разрешённом тестовом контуре; не давать агенту произвольное сканирование/эксплуатацию.
- [Turnitout-Humanizer](https://github.com/AhmadHassan-BTed/Turnitout-Humanizer) | пропустить | Проект прямо позиционируется как средство обхода AI/plagiarism detectors; не интегрировать обход академических проверок и не переносить его правила.
- [decomwtf] | уточнить | Не найден однозначный upstream; нужна точная ссылка или описание.
- [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | отложить | Возможен knowledge/export connector, но второй workspace не оправдан без конкретного сценария и плана синхронизации.
- [Minimo (video)] | уточнить | Неясно, какой именно видеопроект имеется в виду; нужен URL, лицензия и use case.
- [experiential] | уточнить | Слишком общее название для однозначной идентификации.
- [Perplexia] | уточнить | Неоднозначные продукты с похожим названием; требуется канонический URL.
- [Hugging Bay] | уточнить | Возможно опечатка или неофициальный ресурс; не приравнивать автоматически к Hugging Face.
- [angkorgit] | уточнить | Не удалось однозначно установить upstream по названию; нужна ссылка.
- [DevOps Exercises](https://github.com/bregman-arie/devops-exercises) | справочник | Использовать как учебный каталог и чек-листы; не добавлять в runtime.
- [Awesome Compose](https://github.com/docker/awesome-compose) | справочник | Выбирать отдельные проверенные Compose-примеры для разработки; не копировать весь каталог в deployment.
- [Starter Workflows](https://github.com/actions/starter-workflows) | использовать выборочно | Брать шаблоны GitHub Actions только после проверки permissions, pinning actions и минимальных прав.
- [Terraform Samples] | уточнить | Название не указывает однозначный репозиторий; до URL не переносить инфраструктурный код.
- [Kubernetes Examples](https://github.com/kubernetes/examples) | справочник | Брать отдельные примеры только при реальном переходе на Kubernetes; не вводить кластер для малого VPS.
- [Real DevOps Projects] | уточнить | Не найден однозначный upstream по общему названию.
- [Google Online Boutique](https://github.com/GoogleCloudPlatform/microservices-demo) | отложить | Полезен как тестовый пример распределённой системы, но чрезмерен для обычного aLandi deployment.
- [Alertmanager](https://github.com/prometheus/alertmanager) | использовать при настройке мониторинга | Рассмотреть для маршрутизации реальных Prometheus alerts, только если появится полноценный мониторинг и on-call сценарий.
- [Argo CD](https://github.com/argoproj/argo-cd) | отложить | GitOps полезен при наличии Kubernetes; не вводить Kubernetes/Argo CD ради одного приложения на VPS.
- [Minikube](https://github.com/kubernetes/minikube) | dev-only | Подходит для локального обучения и smoke-тестов Kubernetes, не production runtime.
- [SPECTRALAYERS PRO] | пропустить из open-source внедрения | Это коммерческий продукт, не исходный код для интеграции; не включать proprietary GUI/software в aLandi runtime.
- [UVR5 / Ultimate Vocal Remover GUI](https://github.com/Anjok07/ultimatevocalremovergui) | кандидат на отдельный аудио-пилот | Может помочь с разделением источников аудио, но сначала проверить лицензии каждого используемого model weight, размер, GPU/VRAM и качество на целевых записях.
- [GLM-5.3-Flash] | отложить | Поддержка заявлена в xLLM для специализированных ускорителей, но это не подтверждает совместимость с текущим Ollama/8-GB VPS и не заменяет отдельную проверку model card, лицензии весов, формата и benchmark.
- [memvid](https://github.com/memvid/memvid) | эксперимент | Проверить компактную мультимодальную архивную память на тестовом корпусе; не заменять source-linked records без теста целостности, поиска и восстановления.
- [obra/superpowers](https://github.com/obra/superpowers) | источник процесса | MIT-набор навыков coding-agent с TDD, планированием и review; заимствовать процесс по одному, не подключать весь набор автоматически и не давать ему права вне текущего repo workflow.
- [opendroid] | уточнить | Имя неоднозначно; нужен канонический URL и threat model.
- [kev] | уточнить | Не найден однозначный upstream/назначение по одному имени.
- [Kev-4B](https://benchlm.ai/compare/glm-5-3-flash-vs-kev-4b) | пропустить как основную чат-модель | Найден model card/benchmark reference для небольшой decision-модели, но публичная сравнимая benchmark-строка с GLM отсутствует; не считать универсальной диалоговой моделью.
- [paperthin] | уточнить | Не найден однозначный проект; не внедрять по названию.
- [Apache2.0 instant wake up - aws infinity] | уточнить | Похоже на концепцию/публикацию, а не подтверждённый артефакт; нужен исходный URL и воспроизводимые замеры.
- [STATELESS COROUTINE SLICES FLUSH TO DISK ZERO RAM WASTED] | экспериментальная гипотеза | Проверить bounded disk-backed state и crash recovery; абсолютное «zero RAM» технически неверно и не является критерием приёмки.
- [Steering neurons L14 N8949 +1 / L13 N7956 -1 for Qwen 3.5 4B] | отложить | Не применять steering без точного checkpoint, происхождения/лицензии, воспроизводимого метода и safety/quality eval.
- [harness learning research] | источник принципа | Принять цикл гипотеза → ограниченный probe → измерение → решение; самообучение не меняет production без review и rollback.
- [semantic cache] | пилот | Исследовать после exact-cache baseline; обязательны scope/model/prompt version keys, privacy, TTL и eval ложных совпадений.
- [sana] | уточнить | Название неоднозначно между моделями/проектами; нужен точный URL/model card.
- [agent-usage-guard] | исследовать отдельно | Лимиты/учёт использования потенциально полезны, но нужен точный upstream и сравнение с текущими gateway budgets.
- [xerj-org/xerj](https://github.com/xerj-org/xerj) | кандидат на отдельный retrieval-пилот | Локальный Rust search/MCP server с BM25/vector/hybrid search потенциально полезен для поиска по коду и документам, но сначала сравнить с Graphify и текущим FTS5/RAG; не добавлять второй поисковый runtime без eval и замера ресурсов.
- [Harper](https://github.com/Automattic/harper) | кандидат dev-tool для английского | Официальный README описывает offline grammar checker, но текущая поддержка только английского; не подходит для русской грамматики без будущего языкового backend, не менять текст без подтверждения/undo.
- [vane] | уточнить | Название неоднозначно; нужен канонический URL.
- [dessa] | уточнить | Не удалось идентифицировать однозначный upstream по названию.
- [Cloudflare R2] | кандидат хранения | Рассматривать для object storage с шифрованием, lifecycle и тестом восстановления; R2 сам по себе не является backup-политикой.
- [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) | справочник | Использовать для discovery бесплатных сервисов; проверять актуальные лимиты, privacy и условия.
- [public-apis/public-apis](https://github.com/public-apis/public-apis) | справочник | Каталог полезен для discovery, но не allowlist; каждый endpoint требует проверки auth, privacy, CORS и стабильности.
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | справочник | Использовать для поиска MCP-инструментов; проверять владельца, разрешения, цепочку поставки и изоляцию.
- [NaiboWang/EasySpider](https://github.com/NaiboWang/EasySpider) | отдельный browser-automation пилот | Может пригодиться для UI-задач; запускать в изолированной сессии с allowlist доменов, лимитами и подтверждением внешних действий.
- [slee-persis/GVS5H](https://github.com/slee-persis/GVS5H) | уточнить перед исследованием | Репозиторий идентифицирован по URL из списка, но назначение, лицензия и полезный API не подтверждены; не переносить код до аудита.
- [Open Notebook](https://github.com/lfnovo/open-notebook) | источник решения | Взять workflow коллекций источников, заметок и Q&A с citations; не встраивать вторую самостоятельную платформу.
- [Bruno](https://github.com/usebruno/bruno) | dev-only | Git-версионируемые API-коллекции полезны для ручной проверки gateway; не добавлять в пользовательский runtime.
- [Hugging Face Transformers](https://github.com/huggingface/transformers) | справочник/benchmark tooling | Использовать для проверки model cards, совместимости и локальных экспериментов; не тянуть библиотеку в production gateway без конкретной задачи.
- [Cloudflare R2 / GitMCP / GitIngest / GitReverse] | разделять по назначению | R2 — object storage; GitMCP — удалённый MCP-доступ к upstream; GitIngest — текстовый snapshot; GitReverse — синтетический prompt; технологии не взаимозаменяемы.

### Уточнения после дополнительной проверки upstream (2026-10-27)

- [xerj-org/xerj](https://github.com/xerj-org/xerj) найден как локальный search/MCP engine (Apache-2.0); это потенциальный альтернативный retrieval pilot, не готовая зависимость.
- [Automattic/harper](https://github.com/Automattic/harper) — Apache-2.0, offline и English-only; для русской грамматики сейчас не подходит.
- [Turnitout-Humanizer](https://github.com/AhmadHassan-BTed/Turnitout-Humanizer) прямо заявляет evasion of plagiarism/AI detectors; исключить из проекта.
- [Zagitta/gpu-unlock](https://github.com/Zagitta/gpu-unlock) — kernel module для изменения FP/BF16 issue rate RTX 30; исключить из aLandi, не запускать на сервере.
- [slvDev/esp32-ai](https://github.com/slvDev/esp32-ai) и [xtool-org/xtool](https://github.com/xtool-org/xtool) идентифицированы, но не дают прямой пользы текущему web/gateway runtime.
- GLM-5.3-Flash упоминается в xLLM deployment news, но это не подтверждает подходящий model artifact/license/runtime для нашего host; отложить.

### Следующие действия после первичного triage

1. Graphify: upstream изучен, но локальный запуск заблокирован отсутствием сетевого доступа в рабочем контейнере (git clone завершился DNS error); повторить пилот в среде с репозиторием и Python/uv.
2. PR #37 закрыт без merge: ветка отстала от main, Chromium и HTML/JavaScript integrity checks упали, Pages smoke был skipped. Не потерять полезные идеи из PR: composer positioning/safe-area, per-chat search/research settings, voice-menu tap/backdrop и Tavily depth; перепроверить и переносить по одному на актуальную базу.
3. Issue #1 закрыт с reason not_planned и пояснением: это исторический GitHub Skills exercise, не дефект aLandi; закрытие не утверждает, что tutorial завершён.
4. Для строк «уточнить» запросить точный URL только если пользователь ожидает дальнейшее исследование конкретного кандидата; до этого не внедрять.
5. Для runtime-кандидата требовать лицензию, происхождение, resource budget, feature flag, regression/eval и rollback.


## Повторная проверка Graphify upstream — 2026-10-27

- Прочитаны [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), [quickstart](https://docs.graphify.com/quickstart) и [pyproject.toml](https://github.com/Graphify-Labs/graphify/blob/v8/pyproject.toml) через Exa.
- Подтверждено upstream: Apache-2.0; пакет `graphifyy`, CLI `graphify`, Python >=3.10; code parsing через локальный tree-sitter AST; semantic extraction docs/media может использовать модель; dependency footprint заметный.
- Решение: disposable dev environment, pinned version, `graphify extract . --code-only --timing`, `graphify cluster-only . --no-label`, `graphify export html`, `graphify query`; проверка exclusions, ресурсные замеры и сравнение на реальных навигационных вопросах. Не ставить в gateway и не использовать hosted Cloud для пользовательских данных.
- Исполнение **BLOCKED**: локальный `git clone` завершился DNS-ошибкой `Could not resolve host: github.com`; CLI не установлен и граф не создан.
- Промежуточный артефакт `docs/ALANDI_ARCHITECTURE_MAP_RU.md` — кураторская схема, не подмена AST graph.


## 2026-11-05 — refreshed high-signal candidates (research only)

| Upstream / inspected revision | Verified project/license snapshot | Reusable pattern | aLandi decision |
|---|---|---|---|
| [XERJ](https://github.com/xerj-org/xerj) — `83c9f0d123bac010a25ca2cf02ff093b08ee68ce` | Apache-2.0 | Local Rust binary; BM25 + vector + hybrid; code definitions; MCP; source citations. Upstream token-saving benchmark is not independently verified. `--insecure` disables auth/TLS. | Highest-priority retrieval bake-off against SQLite FTS5 + Graphify. No adoption until same-corpus quality/resource/security comparison. |
| [Memvid](https://github.com/memvid/memvid) — `e6bd9f7b9c38cd8d5370fa0fc936ac1dcd751813` | Apache-2.0 | Append-only immutable memory frames, checksums, versioning, portable single-file capsule and temporal inspection. | Isolated export/archive prototype only; preserve SQLite as canonical store until deletion/conflict/recovery tests pass. Benchmark claims remain upstream-reported. |
| [RAG-Anything](https://github.com/HKUDS/RAG-Anything) — `2cd2b3329c470ccb53923f8a6d320596b34e56c5` | MIT | Typed multimodal document decomposition and provenance-preserving cross-modal retrieval. Built around LightRAG and optional heavy parsers/VLM. | Borrow parser→typed fragments→provenance→retrieval architecture. Do not install the full stack on the 8-GB host before corpus and memory evaluation. |
| [Graphify](https://github.com/Graphify-Labs/graphify) — `59b5ab1151e031fb42e39cfc9a50bf96f2d57ae0` (`v8`) | Apache-2.0 | Deterministic AST graph with explicit extracted/inferred edge labels and queryable provenance. | Keep dev-only; strengthen confidence/ambiguity reporting and artifact coverage tests in existing Graphify pilot. No runtime graph DB. |
| [Superpowers](https://github.com/obra/superpowers) — `22f0b463e7a5e579904dd6211a520321035526f7` | MIT | Spec-first workflow, owner approval, implementation plan, red/green TDD, review/fix cycle. | Adopt selected workflow patterns into existing engineering loop; no wholesale plugin install or permission expansion. |
| [Temporal durable execution](https://temporal.io/blog/temporal-langgraph-plugin-durable-execution) / [LangGraph checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) / [Pydantic AI durable execution](https://pydantic.dev/docs/ai/durable-execution/) | Official technical documentation; engine licenses vary by component | Distinguish state checkpoints from durable execution/replay, approval waits, retries and idempotent activities. | Use as design references for #134 AgentRun and future long-running workflows; no engine adoption until current lifecycle prototype and resource need are proven. |

**Next evaluation:** fixed corpus + query set; report Recall@5, MRR, nDCG, citation correctness, latency, RSS, index size, deletion semantics and operational/security boundaries. Keep vendor benchmarks separate from aLandi measurements.

## 2026-11-07 — owner-provided upstream sweep (research only)

Exact upstream HEADs and declared license/capability evidence are recorded in [INTEL.md](../INTEL.md), section “Owner-provided upstream sweep — 2026-11-07”. This extends the 2026-10-27 triage; it does not replace earlier decisions or authorize installation.

| Candidate | Triage decision | aLandi relevance / gate |
|---|---|---|
| Flint — [JustVugg/flint](https://github.com/JustVugg/flint) / [airene/flint](https://github.com/airene/flint) | **AMBIGUOUS / DEFER** | Two distinct repositories: reversible context/memory tooling vs local Developer/Reviewer control room. Ask which one the owner intended before a focused pilot. |
| [DashBeam](https://github.com/tonyantony300/dashbeam) | **RESEARCH / DEFER** | P2P transfer reference. If revisited, require v0.7.2+ and recheck Iroh dependency security; AGPL-3.0 is a code-reuse gate. |
| [img2threejs](https://github.com/img2threejs/img2threejs) | **FUTURE MEDIA REFERENCE** | Potential image→procedural 3D Skill; not needed for current UI/gateway and not photogrammetry. |
| [ArchiveBox](https://github.com/ArchiveBox/ArchiveBox) | **CANDIDATE / DEFER** | Durable web-source archive could complement Research Studio, but adds browser/extractor services and sensitive-cookie/URL storage risks. Evaluate isolated public-only archival first. |
| [SearXNG](https://github.com/searxng/searxng) | **EXISTING PRIORITY CANDIDATE / NO NEW DEPLOYMENT** | Remains a candidate search backend; test the existing optional adapter with timeouts, allowlists, limiter, egress/SSRF checks and RU/EN/TH result quality. AGPL-3.0-or-later. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | **SELECTIVE PROCESS REFERENCE** | Reuse YAGNI/minimal-diff ideas only; current LOOP/AGENTS already encode similar principles. Do not install its hooks/plugin wholesale or treat upstream benchmark claims as proven. |
| [changedetection.io](https://github.com/dgtlmoon/changedetection.io) | **CANDIDATE FOR UPSTREAM WATCH** | Could monitor release/security/source pages; requires domain allowlist, DNS/IP validation, egress controls, per-watch budgets and authenticated UI before deployment. |
| [LocalSend](https://github.com/localsend/localsend) | **NATIVE-COMPANION REFERENCE / DEFER** | Cross-platform LAN transfer is not safely equivalent to browser file access. Prefer native app/protocol boundary, HTTPS fingerprint/PIN and explicit receive approval; never expose plain-HTTP reverse-download as trusted. |
| [MiroFish](https://github.com/666ghj/MiroFish) | **EXPERIMENTAL RESEARCH ONLY** | Social simulation may support scenario exploration, but upstream FAQ explicitly disclaims calibrated classical ABM validity. Do not present output as predictive evidence. AGPL-3.0. |
| [Edge-Drop](https://github.com/Deepender25/Edge-Drop) | **DESKTOP UX REFERENCE ONLY** | Windows Electron clipboard shelf; no direct browser/runtime fit. |
| [Craft Anything](https://github.com/storytold/craft-anything) | **EARLY-ALPHA / SECURITY DEFER** | Software inspection/rebuild tool surface could inform Research Studio, but reverse-engineering, generated code and agent execution need sandbox/legal gates. Other adapters are not all live-verified. |
| [Agent Lightning](https://github.com/microsoft/agent-lightning) | **TRAINING REFERENCE / DEFER** | Useful only if aLandi later evaluates agent RL; verl/vLLM/Kubernetes/GPU training stack is outside current 8-GB inference deployment. |
| [Datalab Marker](https://github.com/datalab-to/marker) / [Surya](https://github.com/datalab-to/surya) | **HIGH-PRIORITY DOC-PARSER BAKE-OFF** | Compare with the existing parser and Docling on the same RU/EN/TH PDF/DOCX/PPTX/XLSX corpus; measure extraction quality, citations, latency, RAM and GPU requirement. Audit model-weight OpenRAIL-M terms separately from Apache code. Hosted API is a separate data-processing decision. |
| [diagram-design](https://github.com/cathrynlavery/diagram-design) | **OPTIONAL DOCS SKILL / DEFER** | Could produce polished one-file HTML/SVG diagrams. Keep Mermaid/draw.io as editable source of truth; inspect Skill scripts and PRIVACY.md before install. |
| [HarnessRouter](https://github.com/HarnessRouter/harnessrouter) | **ARCHITECTURE REFERENCE / DEFER** | Potential unified harness API pattern, but external CLIs, session persistence, files and cancellation introduce a large execution/security surface. Compare contracts first; no runtime integration. |
| [Sound Center](https://github.com/Azare77/sound_center) | **NOT FOR CORE / GPL REVIEW** | Local player and podcast UX, not generation. Use only as a UX reference unless GPL-3.0-or-later reuse is explicitly accepted. |
| [PocketPal AI](https://github.com/a-ghorbani/pocketpal-ai) | **MOBILE ARCHITECTURE REFERENCE** | Useful for offline mobile inference, Whisper/TTS and device acceleration; app code MIT does not license every model/voice. No replacement of the static web client. |
| [sammyZi/pdf-tools](https://github.com/sammyZi/pdf-tools) | **MOBILE UX REFERENCE** | Android scanner/PDF tools and on-device OCR; app MIT but Google ML Kit and bundled model terms remain separate. No runtime copy. |

**Decision:** source-validated candidates only. No dependency, Skill, model, binary, dataset or code was downloaded, installed, copied or deployed. Any pilot requires a separate bounded proposal with pinned upstream revision, dependency/license manifest, threat model, baseline, acceptance metrics, rollback and explicit owner approval.


## 2026-11-08 — повторный тематический проход: orchestration / RAG / local inference / voice / code navigation

| Кандидат | Evidence / ограничение | Решение для aLandi |
|---|---|---|
| Conductor durable execution | Официальная семантика at-least-once; side effects могут повторяться после сбоя worker | **ACCEPT principles only:** idempotency, retry budget, checkpoint, durable approval, recovery drill. Runtime DEFERRED |
| Temporal LangGraph plugin | Public Preview на 2026-07-16; решает durable recovery/human interrupts, но добавляет отдельную инфраструктуру | **DEFER** до реальной потребности в multi-hour/day workflow |
| CodeGraph | Apache-2.0, SQLite/tree-sitter, 34 MCP tools, architecture rules/CI gate; upstream claims local/zero telemetry, но нет aLandi baseline | **PILOT CANDIDATE**; сначала disposable 10-task comparison с Graphify и grep, без установки в runtime |
| Docling | MIT; structured document model с page/bbox provenance; 2.148.0 vendor benchmark: 6.6 s/page default, 1.8 s/page no-OCR on 4 vCPU / 15 GB; scanned OCR ~15 s/page | **ACCEPT architecture**, не runtime на 8-GB serving VPS; отдельный corpus-specific offline benchmark |
| RAG-Anything | Полезные failure-mode probes для таблиц/картинок/OCR; full install может быть тяжёлым | **ACCEPT test patterns**, не устанавливать framework |
| llama.cpp server | Continuous batching, parallel decode, KV quantization и OpenAI-compatible API | **DEFER runtime replacement**; сравнивать с Ollama только при измеренном bottleneck |
| Qwen3-ASR-0.6B int8 via sherpa-onnx | RU/TH в language list; upstream streaming limitation and exact artifact/license need verification | **PILOT CANDIDATE**; compare WER/CER, RAM, latency and cancellation against current ASR baseline |
| Moonshine streaming | Current MIT streaming table does not list RU/TH; some older non-English models use Community License | **NOT SELECTED** for RU/TH default |
| OpenVoiceStream | MIT; hardware-first Jetson/Rockchip/Hailo/Raspberry Pi and per-accelerator quantization | **EDGE REFERENCE ONLY**; not generic x86 VPS candidate |
| GitHub Releases / Pages artifact model | Git LFS unsupported by Pages; Pages site ≤1 GB; release asset <2 GiB | **ACCEPT acquisition boundary:** weights outside Pages tree, manifest + SHA in Git |

Ни один новый runtime, модель или крупный артефакт в этом проходе не скачан, установлен или активирован. Решения по источникам не означают реализацию. Ссылки и первичные ограничения внесены в `INTEL.md`.


## 2026-11-08 — selected upstream source snapshots archived (PR #169, not yet merged)

- **Memvid v2.0.140** — Apache-2.0, upstream commit `e18fe55494379e2ab7397ce03655e8abbc5e0c31`. Imported curated 22-file / 727,588-byte source/license subset from reviewed PR #155; all source Git blob SHA-1 values matched the pinned upstream commit or current main. Per-file SHA-256 values are retained from upstream manifest but not recomputed in this pass. Excludes binaries, model/filter assets, external dictionaries and third-party dependency source; not a complete/buildable mirror.
- **RAG-Anything v1.4.1** — MIT, upstream commit `0ef67b4d476b66407a03a39e5b17e756fc0aef29`. Imported 17 selected source/docs/tests and retained the previously archived `raganything/parser.py`; all 18 source file Git blob SHA-1s and MIT LICENSE SHA-1 independently matched the exact upstream commit. UPSTREAM-MANIFEST now enumerates all verified files.
- Both are research/reference-only, `ship=false`, excluded from runtime; no dependencies/model weights installed. Whole selected archive SHA-256 remains OPEN, recorded as null in provenance; per-file Git blob evidence is exact.


## 2026-11-08 — PR #131/#125 branch research reconciliation

- Preserved 17 non-duplicate research/spec snapshots and their 103 unique candidate URL refs in INTEL. These documents have a historical snapshot banner and a current main/PR boundary; old status claims are not promoted to live facts.
- `AGENT_RESEARCH_CATALOG_RU.md` was not copied as a parallel source register because all 88 URLs are already in INTEL. Source candidate table links to the origin research docs and marks current-version review pending.
- The Graphify UI Surface bridge is CI-only, deterministic and source-provenanced; no UI runtime code or model calls are introduced by the bridge.
- SECURITY.md is now available for responsible disclosure. Jekyll title/description branding is updated while retaining `jekyll-github-metadata` and source archive exclusions.


## 2026-11-14 — OpenShell sandbox candidate refresh

OpenShell v0.1.8 (2026-11-10) is the current pinned sandbox candidate for Coder. Its tag commit is GitHub-signature verified and the release is Apache-2.0. The acquisition workflow stages only Ubuntu 24.04 x86_64 assets as a temporary Actions artifact with fixed SHA-256 and package/archive checks. It does not install or enable arbitrary shell. The owner host must first be checked for OS, architecture, Docker/Podman/VM support, kernel and resources. v0.1.8 migration caveats: symlink policy paths in writable workspaces fail closed; non-Authorization credential placement needs explicit metadata; Python SDK moved to ai-openshell/sdk-python. OpenHands v1.38.0 was rechecked but is not selected as a primary runtime; its unsandboxed mode grants host filesystem access.

## Landing UI source verification — 2026-11-19

These primary sources informed the responsive/mobile navigation acceptance. They are design and test references, not evidence that aLandi itself passes the criteria.

- **W3C — WCAG 2.2 Recommendation:** https://www.w3.org/TR/WCAG22/ (reviewed 2026-11-19). SC 1.4.10 Reflow (AA) sets the 320 CSS px vertical-content baseline without two-dimensional scrolling except for inherently two-dimensional content. SC 2.5.8 Target Size (Minimum, AA) uses 24×24 CSS px with defined exceptions; SC 2.5.5 Target Size (Enhanced, AAA) uses 44×44 CSS px. aLandi keeps 44×44 as its stronger mobile interaction baseline; do not mislabel it as the AA minimum.
- **W3C WAI — Understanding Reflow:** https://www.w3.org/WAI/WCAG22/Understanding/reflow.html (reviewed 2026-11-19). Use 320 CSS px as a deterministic narrow-layout acceptance width; check information/functionality and avoid page-level horizontal overflow.
- **W3C WAI — Understanding Target Size (Minimum):** https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum (reviewed 2026-11-19). Apply the 24px AA criterion with spacing/equivalent-control exceptions; aLandi's 44px target policy is deliberately stricter for touch usability.
- **Playwright — Emulation:** https://playwright.dev/docs/emulation (reviewed 2026-11-19). Viewport, screen size, user agent and touch can be emulated for repeatable browser tests; this does not replace real iOS Safari or assistive-technology verification.
- **MDN — VisualViewport:** https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport (reviewed 2026-11-19). Mobile visual viewport can shrink or move independently of the layout viewport, including when the on-screen keyboard appears. Prefer progressive event handling and geometry tests over assuming one resize sequence.
- **MDN — VirtualKeyboard API:** https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API (reviewed 2026-11-19). Marked limited availability; do not make it a required layout dependency. Keep browser-managed keyboard behavior and VisualViewport fallback.

**Current application of sources:** mobile project/chat row controls were raised from 40px to 44px and a Playwright bounding-box regression was added. The code/test are IMPLEMENTED only after the commit lands on main; test execution and native-device acceptance remain separate verification gates.

- **aLandi mobile navigation follow-up — 2026-11-19:** the 44px baseline is applied to the complete primary sidebar path (Projects/Chats expanders, Create Project/Chat, unassigned filter, Memory disclosure, project/chat selection and row-action menus), not only row controls. Automated geometry coverage spans 320/360/390 CSS px; no test-pass claim until Chromium execution.

## Responsive landing and accessibility source review — 2026-11-19

Reviewed primary upstream references for the current root-app UI package:

- **W3C ARIA Authoring Practices — Modal Dialog Pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — modal content is inert outside the active dialog; Tab/Shift+Tab stay inside; Escape closes; focus moves into the dialog and normally returns to its invoking control. Use these as behavior requirements, not merely visual styling.
- **W3C WCAG 2.2 — Reflow (SC 1.4.10, AA):** https://www.w3.org/WAI/WCAG22/Understanding/reflow.html — vertically scrolling content must reflow at an equivalent width of 320 CSS px without loss of information/functionality or two-dimensional scrolling, except for inherently two-dimensional content.
- **W3C WCAG 2.2 — Target Size Minimum (SC 2.5.8, AA):** https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — 24×24 CSS px or applicable spacing/equivalent-control exception. aLandi's 44×44 mobile baseline is a stricter product usability target, not the AA minimum.
- **W3C WCAG 2.2 — Error Identification (SC 3.3.1, A):** https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html — detected input errors must be identified and described in text; color alone is insufficient. Keep inline error text programmatically associated with its field and focus the first invalid field on submit.
- **MDN — VisualViewport:** https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport — mobile OSK and pinch zoom can change the visual viewport independently of the layout viewport; observe resize/scroll and measure against visual viewport metrics. Do not rely on VirtualKeyboard API as a universal requirement.
- **Playwright — Emulation:** https://playwright.dev/docs/emulation — device profiles emulate viewport, screen, user agent and touch; this is not native iOS Safari or VoiceOver.
- **Playwright — Locator boundingBox:** https://playwright.dev/docs/api/class-locator#locator-bounding-box — bounding boxes are viewport-relative CSS pixel measurements; combine them with auto-waiting locators and focused assertions to avoid brittle broad snapshots.
- **Context7 Playwright documentation:** resolved /microsoft/playwright; queried Page.setViewportSize, keyboard interaction, toBeFocused, and test.step. Set viewport before navigation when testing initial responsive layout; use web-first assertions for focus and visibility.

**Current application:** nested chat/toolbar/attachment/context/voice menu actions and attachment removal now receive a 44px minimum mobile target. The new 30-point acceptance matrix includes eight widths (320–1440), landscape, visual viewport/keyboard behavior, menus, forms, focus, localization and assistive-technology checks. Added E2E code is IMPLEMENTED only after it lands in main; no browser execution is implied.

## Parallel execution technique — current session

- **Lane A — repository truth/change:** GitHub reads/writes, exact parent SHA, bounded source/test surface, one guarded main update.
- **Lane B — upstream research:** Exa discovers official source pages; Context7 resolves versioned library documentation; findings are deduplicated and recorded here.
- **Lane C — live behavior:** independent TinyFish browser runs for responsive geometry and keyboard/form interactions; start both before waiting, then poll each run while repository inspection continues.
- **Lane D — verification/record:** GitHub Actions exact-HEAD checks and deployment marker, then update NOW/master/INTEL. Do not equate Pages deployment with Chromium E2E or native-device acceptance.
- Parallelize independent reads, research and browser runs. Serialize dependent edits/commits on the latest exact main SHA. Do not launch overlapping writes to the same files or start a replacement browser run after a non-retryable timeout; continue polling the original run ID.


## Native disclosure keyboard behavior — 2026-11-19

- **W3C WAI-ARIA Authoring Practices — Disclosure pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ (reviewed 2026-11-19). Native disclosure activation uses Enter/Space and exposes expanded/collapsed state. Escape-close is an additional aLandi menu policy, not a mandatory APG disclosure key.
- **MDN — HTML details element:** https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details (reviewed 2026-11-19). The boolean open attribute controls visibility and summary labels the disclosure; keep native details semantics rather than presenting it as an ARIA menu.
- **Playwright — Keyboard API:** https://playwright.dev/docs/api/class-keyboard (reviewed 2026-11-19). keyboard.press('Enter'/'Escape') supports deterministic keyboard regression; this does not prove native assistive-technology behavior.


## Keyboard focus and modal acceptance — 2026-11-19

- **W3C WCAG 2.2 SC 2.4.7 Focus Visible (AA):** https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html — every keyboard-operable UI must have a mode where the focus indicator is visible; the indicator must not be time-limited. Check focus against overlays and all themes.
- **W3C WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum, AA):** https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html — a focused component must not be entirely hidden by author-created content. Sticky headers/footers and overlays are common failure sources.
- **W3C WCAG 2.2 SC 2.4.13 Focus Appearance (AAA):** https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html — where this enhanced criterion is targeted, indicator area is at least a 2 CSS px perimeter and focused/unfocused contrast change is at least 3:1. Do not label AAA as AA.
- **W3C ARIA APG — Modal Dialog Pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — move focus inside on open, contain Tab/Shift+Tab, close on Escape, return focus to invoker unless workflow justifies another target; aria-modal=true is truthful only when background interaction is actually blocked.
- **W3C WCAG 2.2 SC 2.1.2 No Keyboard Trap:** https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html — every keyboard-entered component needs a keyboard exit path; modal focus containment is acceptable when Escape/close allows exit.

## Browser automation tool capability note — 2026-11-19

- TinyFish run `9b55917e-a96d-4849-be99-c213a82a95c4` returned a static-DOM representation only. It explicitly could not set viewport, execute JavaScript, read `window.innerWidth`, or call `getBoundingClientRect`. Do not use that tool mode for responsive pixel acceptance. Its report that the revision meta was absent is not evidence of an app defect because it could not inspect the live rendered DOM; use the Jekyll artifact check and Playwright live-site workflow.
- TinyFish keyboard run `60646830-6785-4667-a831-37b1ac003db2` yielded partial observations only; do not promote unvisited menu/form flows to pass/fail.
- GitHub `quality-sentinels.yml` provides real Chromium E2E behind `workflow_dispatch` input `run_chromium=true`. The currently available GitHub connector exposes fetch/rerun functions but no workflow-dispatch operation; do not pretend the manual workflow was started. Pages/Graphify success does not imply Chromium tests passed.

## Toolbar disclosure focus return — 2026-11-19

- Outside click on Search/Functions disclosure now closes it and restores focus to its own summary on the next animation frame, while preventing activation of the underlying control. Native `details` semantics remain intact.
- Current DOM has no Language disclosure; language selection is a native select. Avoid stale selector references.

## Mobile safe-area and viewport sizing — 2026-11-19

- **MDN — CSS env() function:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env — `safe-area-inset-top/right/bottom/left` are user-agent values; they can be zero on unobstructed rectangular viewports and positive around non-rectangular display edges or occupied viewport regions. Use a fallback value and retain content inside the resulting safe rectangle.
- **MDN — CSS length / viewport-percentage units:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length — `dvh` tracks the dynamic viewport as browser UI expands/retracts; `svh` is the stable small viewport; `vh` currently maps to the large viewport and may extend under expanded browser chrome. `dvh` can resize during scrolling, so avoid expensive layout work on every change.
- **MDN — Viewport concepts:** https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts — layout and visual viewports differ; an on-screen keyboard, pinch zoom or browser chrome can shrink the visual viewport while the layout viewport remains unchanged. `100dvh` is not a substitute for listening to `visualViewport` when the keyboard changes the visible region.

**Current aLandi application:** modal max-heights subtract safe-area insets; composer/popovers also read `window.visualViewport`. Playwright viewport resizing is a deterministic approximation only; native iOS/Android keyboard and notch verification remain separate.

## iOS input typography — 2026-11-19

- Keep mobile editable controls at 16 CSS px to avoid automatic focus zoom in iOS Safari. Use compact spacing, row density and grouping for visual compactness; do not reduce the input font size to achieve it.
- Project Settings inherits the shared <=640px 16px form rule (`!important`). The earlier local 14px declaration was overridden at runtime; it has been removed to avoid misleading cascade intent. Playwright now asserts exact computed 16px and 44px minimum field height at 320px and 390px.

## RU/EN dictionary integrity — 2026-11-19

- `UI_TEXT.ru` and `UI_TEXT.en` are plain JavaScript object literals. Duplicate keys silently keep the last value and can hide stale copy. The current static markup uses `data-i18n`, `data-i18n-aria-label`, `data-i18n-placeholder` and `data-i18n-title`; each key must exist in both dictionaries. A Playwright static-source regression now enforces uniqueness and coverage.


## Engineering audit source review — 2026-11-19

These references support the proposed migration and analysis techniques; they do not authorize a vendor adoption or prove aLandi implementation.

- **LaunchDarkly — Performing multi-stage migrations with migration flags:** https://launchdarkly.com/docs/guides/flags/migrations (reviewed 2026-11-19). The documented migration stages distinguish the authoritative read source from write destinations: old-only, dual-write with old authority, shadow reads, new authority while retaining rollback writes, ramp-down, then new-only. Applied here as an architectural pattern for `multiAgentEnabled` → `deepResearchMethod`; no LaunchDarkly SDK, account, dependency or feature flag service is proposed.
- **Knip — Entry Files:** https://knip.dev/explanations/entry-files (reviewed 2026-11-19). Knip builds reachability from entry files; more complete entry coverage yields a more complete graph. The generated Jekyll HTML / inline scripts need an explicit extraction/entry strategy before a module-oriented JS analyzer can reason about browser consumers.
- **Knip — How Knip works:** https://knip.dev/explanations/how-knip-works (reviewed 2026-11-19). The report is only as complete as its entry graph; missing entries can cascade into false unused findings. A report-only inline-script audit must therefore preserve HTML/global/dynamic event consumers and show uncertainty rather than auto-delete.
- **Knip — Configuration / Compilers:** https://knip.dev/reference/configuration (reviewed 2026-11-19). Custom compilers are available for non-standard file formats and are configured in JavaScript/TypeScript config; evaluate extraction of built HTML into deterministic JS inputs before adopting a compiler or Knip in this repository. No package installation is proposed.

**Repository-specific application:** `.github/workflows/dead-code-check.yml` currently runs Vulture only on `gateway observability`; `index.md` is not in its trigger filter. The planned JS pass is separate, report-only, and must be validated against fixtures for dynamic browser references before it influences cleanup.

### Accessibility sources — root keyboard and contrast package (2026-11-19)

- **W3C — WCAG 2.2 Understanding SC 1.4.3 Contrast (Minimum):** https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — normal text requires 4.5:1; large text 3:1. The explanatory page is informative; conformance requires applying the normative criterion and evaluating actual rendered foreground/background pairs.
- **WAI-ARIA APG — Button Pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/button/ — native button semantics and keyboard activation are preferred; toggle buttons expose state with `aria-pressed`, and their label should remain stable when the control toggles a persistent setting. aLandi theme toggle uses action-oriented name plus current state.
- **MDN — prefers-reduced-motion:** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — use the OS preference as a baseline; preserve a user-selected reduced/off mode and avoid assuming motion is acceptable.
- **Disposition:** design/implementation guidance only. No claim of WCAG conformance or screen-reader verification from source review or Playwright assertions alone.



## Dynamic status announcements and voice capture lifecycle — 2026-11-20

- **W3C — WCAG 2.2 Understanding SC 4.1.3: Status Messages:** https://www.w3.org/WAI/WCAG22/Understanding/status-messages — status updates about waiting, progress, success or errors that do not change context must be programmatically determinable so assistive technologies can announce them without moving focus. The guidance explicitly cautions against unnecessarily interrupting the user's current activity.
- **W3C — ARIA22: Using role=status to present status messages:** https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22.html — `role="status"` has implicit polite live-region semantics and atomic announcement intent; W3C notes some environments may not treat it as atomic by default, so explicitly test whether `aria-atomic="true"` is needed for the whole status string. This is a sufficient technique, not the only way to conform.
- **MDN — MediaRecorder.stop():** https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/stop — stopping sets recorder state to inactive, then queues `dataavailable` and `stop` events. Cancellation tests must distinguish stopping capture from the later stop-event cleanup path.
- **MDN — MediaRecorder stop event:** https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/stop_event — the stop event follows dataavailable, so final captured data may still be delivered; discard/cancel logic must not accidentally submit that Blob.
- **MDN — MediaStreamTrack.stop():** https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop — calling stop marks that track ended immediately, but does not guarantee the shared physical source stops if another track still uses it. Test the app-owned track lifecycle rather than assuming exclusive microphone ownership.
- **Application relevance:** `#searchStatus`, `#projectSourcesStatus` and `#voiceRecordingStatus` already expose polite status semantics. The 2026-11-20 locale slice preserves the full dynamic message across RU/EN changes without moving focus or re-running work; the mock MediaRecorder regression checks active state during locale change and explicit stop on cancellation. Browser execution and actual screen-reader/native microphone verification remain open; no WCAG conformance claim is made.

## 2026-11-20 — aNoteBooki, AgentRun and connector contracts: official upstream recheck

### aNoteBooki / source-grounded notebook parity (research only; no route or runtime implied)

- **Google Gemini Notebook Help — Create a notebook:** https://support.google.com/gemininotebook/answer/16206563?hl=en — notebooks are independent source collections; Chat answers from notebook sources, while Studio creates separate artifacts. Documented Studio types include notes, Audio/Video Overviews, mind maps, reports, data tables, flashcards/quizzes, slide decks and infographics. Source selection/add/remove and labels are first-class navigation concepts. Exports to Docs/Sheets are copies; later edits and sharing permissions do not synchronize back.
- **Google Gemini Notebook Help — Use chat:** https://support.google.com/gemininotebook/answer/16179559?hl=en — users select which sources participate; answers cite source passages, citation chips navigate to the quoted context, and the product intentionally grounds chat in notebook sources rather than general creative chat.
- **Google Gemini Notebook Help — Sources:** https://support.google.com/gemininotebook/answer/16215270?co=GENIE.Platform%3DDesktop&hl=en — a source is an imported copy or auto-synced source; supported source classes include documents, web URLs, public YouTube, audio, images, ebooks and notes. Removing/updating a source does not retroactively update already generated Studio artifacts; imported Drive access can become unavailable if permissions are lost.
- **Google Gemini Notebook Help — Notes:** https://support.google.com/gemininotebook/answer/16262519?hl=en — notes are sources: they can be selected for Q&A, cited by passage and included in artifact generation. This is a useful pattern for aLandi's future SourceRecord/BlockRef model.
- **Google Gemini Notebook Help — Audio Overview:** https://support.google.com/gemininotebook/answer/16212820?hl=en — audio generation runs in the background and offers different editorial formats; output can contain inaccuracies/glitches and requires edit rights. Treat as a future artifact workflow, not as proof of an existing aLandi audio runtime.
- **Naming note:** current official Google pages use “Gemini Notebook” (formerly NotebookLM). Feature comparison is behavioral inspiration only; do not copy closed-source implementation or imply parity. Official help explicitly warns that mobile apps may have feature limitations.
- **aLandi disposition:** keep aNoteBooki as the owner-named studio. Its future feature map should prioritize source selection, source-grounded chat with passage citations, editable notes as sources, artifact provenance, background jobs, explicit export-copy semantics, and source/artifact invalidation. No aNoteBooki route/runtime was implemented in this research pass.

### Agent orchestration and durable execution (architecture guidance only)

- **OpenAI Agents SDK — Handoffs:** https://openai.github.io/openai-agents-python/handoffs/ — handoffs are explicit control transfers represented as tools to specialized agents; a handoff remains within one run. This is not the same as showing a role label or sequentially prompting one model.
- **OpenAI Agents SDK — Guardrails:** https://openai.github.io/openai-agents-python/guardrails/ — input/output guardrails and tool guardrails have different scopes. Tool guardrails are needed when checks must apply to each custom function invocation; agent-level input/output guards alone do not wrap every internal tool action.
- **OpenAI Agents SDK — Tracing:** https://openai.github.io/openai-agents-python/tracing/ — traces/spans can record model generations, tool calls, handoffs, guardrails and custom events with start/end times and parent-child lineage. This is an observability model, not permission to expose hidden reasoning or sensitive payloads.
- **LangGraph — Persistence:** https://docs.langchain.com/oss/python/langgraph/persistence — checkpoints persist thread-scoped graph state for continuity, fault tolerance and human review. Thread identity and checkpoint selection determine whether a run starts new work, resumes, or replays.
- **LangGraph — Interrupts:** https://docs.langchain.com/oss/python/langgraph/interrupts — durable human approval requires a checkpointer and stable thread ID. Resume re-enters the interrupted node from its beginning; code before the interrupt may run again, so side effects must be idempotent or delayed until after approval.
- **LangGraph — Checkpointers:** https://docs.langchain.com/oss/python/langgraph/checkpointers — durability modes trade latency for crash-recovery guarantees; a durable production checkpointer and explicit thread IDs are required for real resume semantics.
- **aLandi disposition:** AgentRun remains a single-worker, feature-off prototype. Future true subagents require independent worker/model calls, typed handoffs/DAG, per-tool guardrails, durable checkpoints, idempotent side effects, approval/resume/cancel/deadline semantics, and trace lineage. Do not add LangGraph or OpenAI Agents SDK as dependencies without a versioned bake-off against the existing SQLite DAG and explicit provider/runtime decisions.

### Connector / MCP security contract

- **MCP specification — Tools:** https://modelcontextprotocol.io/specification/2025-11-25/server/tools — tools are model-discoverable, but the spec recommends a human who can deny invocations, clear UI indicators, and confirmation for sensitive operations. Servers validate inputs, enforce access controls, rate-limit and sanitize outputs; clients should show tool inputs before sensitive calls and audit tool use. Tool annotations are untrusted unless the server is trusted.
- **MCP specification — Authorization:** https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization — HTTP authorization uses bearer headers, not query-string tokens; request minimum scopes and validate audience/token lifecycle.
- **MCP specification — Elicitation:** https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation — sensitive credentials must not be requested through form-mode elicitation; URL-mode flows require explicit consent and careful display of the target domain. Clients must not prefetch elicitation URLs or open them without consent.
- **aLandi disposition:** Connectors must be a real permissioned registry, not decorative integration tiles. Every connector needs source identity, tool schema, requested scopes, user approval/deny/revoke, argument preview for sensitive actions, timeout/rate limits, safe output handling, audit lineage and cleanup. Tool descriptions/annotations/returned content are untrusted data, never authority.

### Browser acceptance method

- **Playwright — Browser contexts:** https://playwright.dev/docs/browser-contexts — each test gets isolated storage/cookies/context; use separate contexts when multi-user state matters.
- **Playwright — Emulation:** https://playwright.dev/docs/emulation — viewport, device, touch, locale and color scheme can be controlled explicitly; report the configured dimensions rather than infer them.
- **Playwright — Assertions:** https://playwright.dev/docs/test-assertions — use retrying locator assertions for asynchronous UI state instead of fixed sleeps.
- **aLandi disposition:** use Playwright for deterministic responsive/interaction acceptance; TinyFish is useful for public-site reconnaissance but does not replace exact viewport geometry or the Chromium suite. No browser suite is claimed by this source review.

## 2026-11-20 — Landing performance measurement contract (P0.19 research)

- **web.dev — Web Vitals:** https://web.dev/articles/vitals — Core Web Vitals currently center on LCP, INP and CLS; good thresholds are LCP ≤2.5s, INP ≤200ms and CLS ≤0.1, evaluated at the 75th percentile and segmented by mobile/desktop.
- **web.dev — Core Web Vitals workflows:** https://web.dev/articles/vitals-tools — field data is the best measure of actual user experience; Lighthouse is lab diagnostics under predefined conditions and must not be presented as field Core Web Vitals. CrUX/PageSpeed Insights may be absent for low-traffic origins.
- **web.dev — Field measurement best practices:** https://web.dev/articles/vitals-field-measurement-best-practices — use percentiles/distributions, not averages; segment mobile and desktop; consider p90/p95 to understand slower devices/networks.
- **Chrome Developers — JavaScript execution time:** https://developer.chrome.com/docs/lighthouse/performance/bootup-time — JavaScript payload adds network, parse/compile, main-thread execution and memory cost; reduce unused code only after consumer review.
- **Chrome Developers — Main-thread work:** https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown — HTML/CSS parsing, JS parsing/evaluation and user events share the renderer main thread; diagnose long tasks before applying code splitting or workers.
- **Lighthouse CI — static sites and filesystem reports:** https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md — collect.staticDistDir can audit a built static site without starting a backend; upload.target=filesystem keeps reports local to the CI job rather than publishing temporary public reports. Assertions can be warning-only or blocking.
- **aLandi disposition:** current AST report provides static payload/parse/AST inventory only; it is not a Lighthouse score, field Web Vitals or runtime benchmark. A one-run mobile Lighthouse CI baseline is now configured against generated _site with filesystem-only output and no public report upload; only after a stable baseline should budgets be introduced. Do not fail builds on uncalibrated thresholds.

- **Pinned CI baseline package:** @lhci/cli 0.16.1 (Apache-2.0, Node >=22.19, Lighthouse 13.6.0); npm registry SHA-512 integrity: sha512-Vh3z9Xkcs4ULrl62NTF9a+c9HL9teyD+dq3TueG4p4oo9ypYbPBb3Ht4YvxHzOyr31rFaiuHqdphpnVZs5SXQw==. CI-only install; reports target filesystem and are not uploaded to public temporary storage. One mobile lab run is advisory, not field CWV and not a release gate.


## 2026-11-21 — targeted upstream freshness check for Offline Core / Coder / training

Official release-page snapshot reviewed for planning only; do not blindly update pinned runtime artifacts. Re-run compatibility, license, architecture and regression checks before changing any lock:

- **Ollama:** official releases show stable `v0.40.16`; `v0.40.17-rc0` appears as a release-candidate entry, so keep current lock `0.40.16` until a stable release and target-platform validation are confirmed. https://github.com/ollama/ollama/releases
- **llama.cpp:** upstream release page shows `b12249` as a pre-release (10 Nov 2026). Treat as a challenger, not an automatic production upgrade; compare exact commit/build backend, tool-call/template compatibility and Qwen3.5 image/projector support. https://github.com/ggml-org/llama.cpp/releases
- **PEFT:** official stable release `v0.21.3` (13 Nov 2026). Candidate for adapter training; compatibility with the chosen Transformers/TRL/base-model versions still needs a pinned environment smoke. https://github.com/huggingface/peft/releases
- **TRL:** official release `v1.17.1` (30 Oct 2026). Supports an expanding set of SFT/preference recipes, but large multi-GPU examples do not imply feasibility on the planned 8-GB VPS. https://github.com/huggingface/trl/releases
- **OpenHands:** official platform release `v1.40.0` (12 Nov 2026). Candidate reference for coding workflow UX/SDK patterns only; do not adopt the full platform as a runtime dependency without isolation, resource and licensing review. https://github.com/All-Hands-AI/OpenHands/releases
- **gVisor:** official release `20261116.0` (17 Nov 2026), including recent sandbox hardening changes. Candidate sandbox runtime; target kernel, cgroup, filesystem and nested virtualization compatibility must be tested before choosing it over OpenShell/Firecracker. https://github.com/google/gvisor/releases

**Disposition:** current `models/runtime-stack.lock.json` remains pinned to Ollama `0.40.16`; the acquired OpenShell `v0.1.8` artifact is staged only and expires 2026-12-05. No production install, model activation, VPS mutation or dependency upgrade was performed. The current acquisition runs on 2026-11-21 verified the downloaded auxiliary model/runtime caches and license/provenance gate; they remain Actions artifacts, not installed services.
