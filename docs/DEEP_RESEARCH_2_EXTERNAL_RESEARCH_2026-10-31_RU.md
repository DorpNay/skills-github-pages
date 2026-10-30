# Deep Research 2.0 — независимый первичный-source pass

**Дата:** 2026-10-31. Это первичный обзор, не исчерпывающий benchmark. Сначала проверены ранее сохранённые в репозитории решения; затем выполнен независимый поиск по официальным upstream/docs. Никакой проект не устанавливался.

## 1. Deep Research systems

### Local Deep Research (LearningCircuit)
Source: https://github.com/LearningCircuit/local-deep-research

- MIT repository; upstream describes local LLM via Ollama/LM Studio, search via DuckDuckGo or configured SearXNG/Tavily/Perplexity, iterative query → retrieval → summary → gap reflection → next query, and a cited Markdown report.
- It is a useful reference for a bounded evidence-gap loop and local-model compatibility.
- It is a separate app/service with Docker and SearXNG/Ollama operational requirements; not a drop-in library for aLandi.
- Upstream benchmark statements are not aLandi evidence.

### LangChain Open Deep Research
Source: https://github.com/langchain-ai/open_deep_research

- MIT, configurable model/search/MCP integrations and LangGraph workflow.
- Repository metadata returned by the search source marks the project **ARCHIVED** (Aug 2026). Do not select as a new runtime dependency; architecture and prompts may be studied at a pinned commit.

### Khoj
Source: https://github.com/khoj-ai/khoj

- Self-hosted personal AI app; local/online LLMs, internet and document search, browser/desktop/phone/Obsidian interfaces, agents and semantic search.
- Repository license is AGPLv3; review network-copyleft obligations before any code reuse or embedding.
- Broad platform footprint; better as a product/architecture reference than a small dependency.

### Deep Research Web UI
Source: https://github.com/AnotiaWang/deep-research-web-ui

- Describes a research tree, source-page verification, evidence excerpts, follow-up queries, partial report updates, export, client/server modes and budget sharing across full-page reads.
- Useful UX/evidence interaction reference. Client mode is browser-side; server mode requires a server runtime. Verify exact license, current maintenance and provider support before reuse.

### Interim decision

Keep aLandi's own bounded state machine and evidence contracts. Borrow:
- gap-driven recursive search with saturation/early-stop;
- separate query plan, source retrieval, full-page evidence and final synthesis;
- inspectable evidence with follow-up that updates a new report version rather than overwriting the original;
- exportable run state and source ledger.

Do not import an entire research platform before comparing maintenance, license, source adapters, runtime footprint and exact citation behavior.

## 2. Local project sources — what browser standards actually permit

Primary documentation:
- Chrome File System Access: https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
- MDN OPFS: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
- web.dev storage: https://web.dev/articles/storage-for-the-web
- File System Access specification: https://wicg.github.io/file-system-access/

Findings:
- A web app can read selected files and enumerate a selected directory after explicit user permission.
- File/directory handles are serializable and can be stored in IndexedDB; on later visits the app must query/request permission again where required.
- Chrome has an optional persistent-permission flow ("allow on every visit") under documented preconditions, but this is browser behavior, not a universal guarantee across all browsers.
- OPFS is private to the origin, invisible as normal user files, optimized for app-owned bytes and subject to browser quota. Clearing site data removes it.
- IndexedDB/OPFS are appropriate for local indexes, caches and app-owned artifacts, not a universal substitute for user-selected source files.
- A static site cannot silently read arbitrary folders. It cannot guarantee an always-on background folder watcher when the browser is closed.
- Cross-device access does not follow from a stored handle. The second device must have its own local copy/permission or use an explicitly selected sync/connector.

**Recommended architecture:** browser file picker + IndexedDB handles for selected files where supported; local OPFS/IndexedDB for local indexes; companion/desktop agent for durable watch/index of approved folders. Store source hashes and metadata, not a remote copy by default. The companion needs path allowlists, explicit grants, loopback auth, symlink protections, bounded parsers and revocation.

## 3. AI coding and sandbox

Primary docs:
- OpenHands Docker sandbox: https://docs.openhands.dev/openhands/usage/sandboxes/docker
- OpenHands sandbox overview: https://docs.openhands.dev/openhands/usage/sandboxes/overview
- OpenHands process sandbox: https://docs.openhands.dev/openhands/usage/sandboxes/process
- OpenHands SDK Docker workspace: https://docs.openhands.dev/sdk/guides/agent-server/docker-sandbox

Findings:
- OpenHands documents Docker as the recommended sandbox provider; a repo can be mounted into the container, and mounted read-write paths are modifiable by the agent.
- Its Process mode explicitly has no sandbox isolation: the agent can read/write what the host user can access and execute commands on the host.
- Container isolation is not absolute if broad mounts, privileged mode, host networking or Docker socket access are granted.
- This confirms the existing aLandi decision: subprocess execution is not a sandbox; arbitrary code remains blocked until an isolated executor and escape tests exist.

**aLandi direction:** implement a narrow coding workspace contract rather than importing a full coding platform: ephemeral worktree/container, scoped repo mount, network disabled by default, no secrets, resource/time limits, explicit approval for dependency installs/network/deploy/destructive actions, patch review, tests and rollback. Evaluate OpenHands/OpenCode/Aider/etc. against this contract before selection.

## 4. Memory and context systems

Primary docs:
- Letta memory blocks: https://docs.letta.com/v1-sdk/memory/memory-blocks/index.md
- Letta archival memory: https://docs.letta.com/v1-sdk/memory/archival-memory/index.md
- Letta repository: https://github.com/letta-ai/letta
- Graphiti: https://github.com/getzep/graphiti
- OpenViking: https://github.com/volcengine/OpenViking
- OpenViking docs: https://docs.openviking.ai/en/getting-started/02-quickstart

Findings:
- Letta separates always-visible, bounded memory blocks from on-demand archival memory and historical conversation search. Repository license metadata reports Apache-2.0. This is a useful conceptual separation, not a reason to replace aLandi's scoped store.
- Graphiti describes temporal context graphs with source provenance and incremental updates. It is a framework: the application still supplies graph database, LLM/embedder, ingestion, tenancy and access control. It is not a complete memory product by itself.
- OpenViking uses a virtual filesystem for knowledge/memory/skills, project-scoped retrieval and summary tiers (abstract → overview → full source). Its main project is AGPLv3, with component-specific exceptions. This is an interesting UX/retrieval reference but would overlap aLandi's current SQLite/FTS5 and memory graph.
- Vendor/product claims such as "unlimited memory" or sub-200ms retrieval are not meaningful acceptance evidence without same-corpus aLandi tests.

**Interim decision:** preserve the existing SQLite/FTS5 + scoped graph foundation; compare retrieval quality before adding a second store. Borrow inspectable memory layers, temporal facts, source episodes and summary tiers. Evaluate recall, precision, scope leakage, stale facts, contradiction detection, deletion propagation, export/restore, latency, disk and RAM on an owner-approved corpus.

## 5. Image and video generation

Primary docs:
- Comfy API v2 overview: https://docs.comfy.org/api-reference/v2/overview
- Comfy job submit: https://docs.comfy.org/api-reference/v2/jobs/submit-a-workflow-for-execution
- Comfy job status: https://docs.comfy.org/api-reference/v2/jobs/job-status-the-polling-workhorse
- Comfy cancellation: https://docs.comfy.org/api-reference/v2/jobs/request-cancellation
- Runway Dev docs: https://docs.dev.runwayml.com/llms.txt
- Google Veo on Vertex AI: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-text
- Google Gemini Veo notice: https://ai.google.dev/gemini-api/docs/veo

Findings:
- Comfy API v2 exposes versioned workflow submission, durable job IDs, polling, incremental outputs and cancellation. SSE is an enhancement; polling/job state is authoritative. This maps well to a future aLandi media-job adapter.
- Comfy API documentation distinguishes local/self-hosted, Comfy API deployments and Comfy Cloud. Self-hosted proxy authentication must be configured; do not expose an unauthenticated Comfy endpoint publicly.
- Runway Dev describes async generation tasks with task IDs and polling; requests require a version header and model-specific schemas. Verify account eligibility, model access, prices and data terms before selection.
- Vertex AI Veo uses long-running operations and requires Google Cloud project/storage configuration and billing/permissions.
- Google AI for Developers' Veo 3.1 Preview notice says those Gemini API preview model IDs shut down on 2026-10-22; it directs migration to Gemini Omni Flash or GA models on the Gemini Enterprise Agent Platform. Do not confuse Gemini API preview availability with Vertex AI GA model availability.

**Interim decision:** define one provider-neutral MediaJob contract; keep ComfyUI as local-GPU adapter candidate and choose one hosted video provider only after owner account/region/pricing/privacy checks. Do not build multiple providers in parallel. Store results in user-controlled storage; signed output URLs may expire and must not be treated as durable asset IDs.

## 6. Policy and uncensored local models

The repository's owner checklist explicitly says:
- do not add a hidden refusal filter over the selected model;
- do not promise "never refuses", because checkpoint behavior and external API rules are not controlled by the app.

The technical design must preserve this distinction:
- model-level refusal = behavior of the selected checkpoint/provider;
- adapter-level content filtering = must not silently add arbitrary extra refusals;
- platform security = authentication, scoped data, capability permissions, sandbox, approvals, audit and abuse prevention; this is not model censorship and must remain enforced;
- imported web/file content = untrusted input, never policy or authority.

A local model's lack of refusal training cannot grant it filesystem, network, secret or destructive-action authority. The user-facing policy should explain which layer refused and why, without pretending all providers behave identically.

## 7. Candidate/decision table

| Area | Candidate/reference | Keep / reject for now | Next evidence required |
|---|---|---|---|
| Research loop | Local Deep Research | Borrow iterative gap loop; don't import whole app yet | Compare query quality, citation precision, run resume, RU/EN/TH |
| Research UX | Deep Research Web UI | Borrow evidence inspection/follow-up ideas | License, maintenance, source-page verification tests |
| Personal knowledge | Khoj | Architecture reference; AGPL review | Runtime footprint and source/index contract |
| Local files | File System Access + OPFS | Browser-local connector candidate | Target browser tests, permission recovery, quota and deletion |
| Local folders | Local companion | Likely needed for persistent indexing | Threat model, signed app, loopback auth, path isolation |
| Coding | OpenHands Docker sandbox | Reference; no direct platform adoption | Escape tests, mount/network policy, resource limits |
| Memory | Letta / Graphiti / OpenViking | Borrow concepts; do not replace SQLite/FTS5 yet | Same-corpus retrieval and memory lifecycle eval |
| Image | Comfy API v2 | Strong adapter contract candidate | Local GPU benchmark, exact checkpoints and licenses |
| Video | Runway / Vertex AI Veo | Hosted candidates, no provider selected | Account access, region, cost, terms, retention, quality |

## 8. Follow-up tasks

- [ ] DR2-EXT-001 — pin Local Deep Research commit, verify full dependency/license and run architecture comparison.
- [ ] DR2-EXT-002 — verify Khoj AGPL obligations and exact local deployment footprint.
- [ ] DR2-EXT-003 — review Deep Research Web UI license/maintenance and reproduce evidence-follow-up flow.
- [ ] DR2-EXT-004 — browser matrix for File System Access/IndexedDB/OPFS permission persistence, quota and file changes.
- [ ] DR2-EXT-005 — prototype local folder companion threat model; no code until explicit approval.
- [ ] DR2-EXT-006 — compare OpenHands Docker isolation with aLandi's required container/seccomp/Landlock policy and adversarial escape tests.
- [ ] DR2-EXT-007 — compare Letta/Graphiti/OpenViking retrieval against current SQLite/FTS5 on the same labelled corpus.
- [ ] DR2-EXT-008 — verify exact Comfy API deployment/auth/retention behavior and benchmark a local workflow on target GPU.
- [ ] DR2-EXT-009 — verify Runway and Vertex AI availability, pricing, regional access and data retention from owner accounts.
- [ ] DR2-EXT-010 — produce policy matrix and false-refusal/security separation tests.

**No production adoption:** all findings are research candidates. No code, dependencies, models or deployment changed.
