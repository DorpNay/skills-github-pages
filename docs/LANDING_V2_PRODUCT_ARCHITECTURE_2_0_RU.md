# aLandi Landing 2.0 — Product Architecture 2.0

**Дата:** 2026-11-17 · **Статус:** OWNER-REQUIRED / SPECIFIED / IMPLEMENTATION PARTIAL  
**Канонический delivery tracker:** единственная таблица K.5 (15 пунктов) в master addendum. Этот документ раскрывает продуктовый контракт, не создаёт параллельный backlog.

> **ВИДИМЫЙ ПРИОРИТЕТ ФИНАЛИЗАЦИИ**
> 1. Source-first Notebook — общение с выбранными источниками, доказательства и follow-up, а не просто блокнот заметок.
> 2. Notebook Studio — подкасты, редактируемые презентации, chart-slides, диаграммы, инфографика и отчёты строго из выбранных источников.
> 3. Coder — существующий Workspace + source-aware context, Skills, DB/tool adapters и изолированный sandbox.
> 4. Offline Core — скачиваемый из Settings автономный комплект с локальным runtime и режимом без cloud fallback.
> 5. AI Studio — Knowledge Packs, датасеты и узкоспециализированные модели; RAG и обучение весов не смешивать.
> 6. Source → Skill / Agent Factory — книга, страница, изображение или другой материал в проверяемый Skill/Agent draft.
> 7. Единый Local File Layer и честный каталог реальных возможностей.

## 1. Existing foundations — reuse, do not duplicate

FACT at inspected main: aNoteBooki IndexedDB now has local evidence search and separate model-backed Q&A. The model path sends only explicitly selected lexical excerpts to aServi after consent and persists source hashes, exact quotes and code-point offsets; source deletion invalidates dependent answers. Gateway FTS5/RAG ingest+retrieve and Evidence Ledger exist but remain feature-flagged OFF.

## 2. Shared data contracts

Freeze versioned compatible DTOs before expanding storage; extend current stores/APIs rather than adding a parallel DB.

- **SourceRecord:** source_id/content hash; origin (file/url/project source/repository/note/media); scope+scope_id; MIME/name/size/time; parser+version; licence/provenance; storage mode (reference/ephemeral attachment/retained local copy/project index); permission and retention.
- **BlockRef:** source_id/block_id; page/section; normalized-text char offsets; optional bounding box, table cell or media timestamps; text hash/snippet; stable locator; parser version. Explicitly define Unicode offset semantics; preserve original page/region/time locators.
- **ArtifactRecord:** artifact_id/type/version; selected source set; generator/model/template; claim_citation_map from every factual claim, slide point, chart series and audio segment to BlockRefs; unsupported_claim_count; validation/review state; hash; parent lineage.

No artifact becomes source truth automatically.

## 3. Source-first Notebook

User flow: create notebook → add files/books/URLs/Project Sources/notes → explicitly choose reference/attach/import → parse and preview → select exact source set → chat/follow up/compare → inspect citations and original passages → save derived notes/artifacts.

MVS retrieval reuses Gateway FTS5 with exact scope and selected source IDs. Next evaluate dense embeddings + sparse FTS5 RRF, then optional reranker; add vector storage only after RU/EN/TH eval proves measurable benefit. Context packets contain bounded excerpts and BlockRefs. Application resolves citations; model cannot invent arbitrary citation URLs. Unsupported facts trigger abstention (“в выбранных источниках этого нет”). Evidence Ledger persistence is explicit, never silent. Source deletion/replacement marks dependent chunks, evidence, chats and artifacts stale.

Acceptance: zero selected-source leakage; every factual claim maps to a valid BlockRef or is explicitly unsupported; test citation precision/recall, retrieval Recall@k/MRR/nDCG, faithfulness and abstention on a permissioned RU/EN/TH corpus.

## 4. Notebook Studio — outputs only from selected evidence

- **Podcast:** outline → two-speaker script → BlockRef validation → user script approval → per-segment TTS → audio assembly → transcript/WebVTT with timestamped citations.
- **Presentation:** outline → per-slide evidence → editable slide IR → PPTX/HTML; speaker notes list supporting BlockRefs. Do not settle for image-only PPTX as the canonical editable format.
- **Chart-slide:** data comes only from cited table/data blocks; preserve units, labels, axes and source note; never invent missing values.
- **Other artifacts:** structured reports, diagrams, infographics, timelines, comparison tables and study packs with claim/element provenance.
- Deterministic post-validation is mandatory. `unsupported_claim_count=0` is the gate for “source-verified” export. Drafts with unresolved claims remain visibly flagged.
- Candidate renderers only: PptxGenJS/python-pptx, Mermaid, Vega-Lite/Plotly, FFmpeg, Kokoro/Piper. No dependency selected or installed yet.

## 5. Local File Layer

Three distinct modes: **reference** (metadata only), **attach** (temporary current-task access), **import** (explicitly retained normalized source/index). Browser file/folder access requires a user gesture and permission; ordinary upload is fallback. OPFS suits larger app-owned blobs; existing IndexedDB remains metadata/UI state. Browser storage may be evicted; never promise persistence. Mobile Safari folder access differs; native companion requires separate approval, pairing, loopback auth, origin allowlist, per-folder grants, audit and revoke.

Pipeline: select → consent → MIME/size/signature validation → quarantine/scan → hash/dedupe → parse → normalize → BlockRefs → preview → index → review. Cover PDF/Office/EPUB/HTML/CSV/JSON/images/audio/video, selective OCR, tables, images, timestamps and repository snapshots. Webpage→JSON and image→JSON must emit typed schema, confidence, source hash, region/URL and extraction provenance. Protect archives from traversal, symlinks, bombs, recursion and resource exhaustion. Delete by lineage.

Existing parser stays baseline. Docling is first broad parser candidate; model licences separate. MinerU is optional scientific/formula route after licence/hardware bake-off. Compare on identical RU/EN/TH fixtures and record quality, missing blocks, offsets, RAM/PSS, CPU time and p95.

## 6. Coder

Extend current Workspace, don't replace it: add repository snapshot/commit scope, code-aware chunking/symbol navigation, curated code/API packs, Skill binding, read-only DB schema/query, typed file/search/test/lint/build/patch tools.

Current partial implementation (FACT, 2026-11-17): AgentRun's non-executing Coder profile now consumes four fixed repository-owned Skills for repository navigation, test-first delivery, security boundaries and performance engineering. This is prompt guidance only; it grants no tools or access. Project-scoped repository context, code intelligence, DB/tool adapters and isolated execution are still deferred. Separate read, write, test, network and DB mutation permissions. Code execution requires isolated ephemeral sandbox (non-root, resource/time/network/filesystem policy, no host secrets/sockets/unrestricted mounts); a shared-kernel container alone is not assumed sufficient for hostile code. Human approval for writes, installs, migrations and network operations. Show exact diff, tests and rollback. No arbitrary browser/Gateway shell.

## 7. Offline Core downloadable from Settings

The browser cache alone is not Offline Core. Package must launch independently and work with internet disconnected for its declared capabilities. Manifest: package/version/platform/architecture; component IDs/revisions/digests/sizes; separate code/weights/tokenizer/voice/data licences; SHA-256 and signed manifest where supported; CPU/RAM/VRAM/disk requirements; runtime compatibility; tasks/languages; limits; install/update/uninstall/rollback.

Selectable components: local inference runtime/model/tokenizer; parser/OCR; local retrieval; ASR/VAD/TTS; translator/grammar packs; optional Coder sandbox; local data store/migrations/backup. Settings shows exact size, licence, hardware and offline task matrix. Download supports resume, integrity verification, atomic activation and rollback. Distinguish downloaded, loaded and inference-tested. `local_only=true` blocks network/cloud fallback, including telemetry/search/connectors. Never put weights in Pages/Git/LFS; durable distribution requires separate storage/retention/cost/licence decision.

## 8. AI Studio / Model Lab

Clearly separate five outcomes:
1. **Knowledge Pack (RAG):** documents indexed/retrieved; no weights changed. Default path.
2. **Assistant/Skill:** instructions/examples/evals; no weights changed and no permissions granted.
3. **Dataset Builder:** approved examples, labels, provenance, dedupe and splits; not training.
4. **LoRA/QLoRA adapter tuning:** supervised tuning of supported base model; versioned adapter, not a new foundation model.
5. **Full pretraining:** expert-only, high compute/cost; not a one-click book conversion.

Training gates: rights/consent for each sample; PII/secrets review; decontamination; split by source to prevent leakage; baseline evaluation; RU/EN/TH task set; hardware/cost estimate; immutable base model/tokenizer/dataset/config/checkpoint hashes; validation/regression; human review; export/merge compatibility; version/rollback. No autonomous weight changes, cross-user training or private-file training by default. Most users need RAG + Skill, not tuning.

## 9. Source → Skill / Agent Factory

Inputs: books, PDF, websites, images, media transcripts, selected folders and repositories. Pipeline: select → extract → procedure/claim map → draft → generated positive/negative evals → prompt-injection/secrets/script/dependency/licence scan → preview → human approval → immutable version.

Outputs are distinct: **Skill** (SKILL.md, references, examples, tests, manifest, SkillBOM; scripts inert); **Agent Blueprint** (role, model policy, Skill refs, source scope, typed capabilities, approvals, budgets, output contract; blueprint is not runtime); **Task Template** (bounded reusable scenario). Do not copy whole copyrighted books into a Skill. No auto-grant of tools or filesystem/network rights.

## 10. Navigation

Preserve four owner-approved Functions entries: Deep Research / Agents / Skills / Connectors. No fifth competing top-level entry.
- Notebook route: Sources · Chat with sources · Evidence · Studio (podcast/deck/chart/report).
- Settings: Offline Core download, health, updates, uninstall and Local-only route.
- Coder Workspace: focused workspace; expose only backed tools.
- Skills: catalog + Source-to-Skill Factory.
- Agents: catalog + My Agents + Blueprint Builder; executable only with runtime.
- AI Studio / Model Lab: distinct model/runtime area, not Notebook, Skills or Agent Builder.
Catalog statuses: AVAILABLE (live handler+tests), SPECIFIED (contract only), DEFERRED (blocked), EXTERNAL (link only).

## 11. Delivery order

A Local File/Source contract → B Notebook source chat/evidence → C Studio report+podcast → D editable deck/chart → E Coder+sandbox → F Offline Core → G AI Studio → H Skill Factory → I catalog surfacing. Each stage requires scope isolation, focused RU/EN/TH tests, licence/security review, exact-head checks and rollback. No VPS flags, dependencies, model downloads, paid services, OAuth, deployment or runtime activation from this spec alone.

## 12. External research and source register

**TinyFish deep research:** run `01a1e8c8-4101-7a4a-90d4-dfe5da530fae`, completed 2026-11-17, 47 sources; [full cited report](https://agent.tinyfish.ai/research/01a1e8c8-4101-7a4a-90d4-dfe5da530fae). Freshness: latest dated source 2026-10-31; 27 dated, 20 undated, none in requested recent window. Research is design input, not current implementation/version proof.

Primary/upstream candidates:
- [Docling](https://github.com/docling-project/docling) · [formats](https://docling-project.github.io/docling/usage/supported_formats/)
- [MinerU](https://github.com/opendatalab/mineru)
- [Transformers.js](https://huggingface.co/docs/transformers.js/index) · [WebLLM](https://github.com/mlc-ai/web-llm)
- [PEFT](https://huggingface.co/docs/peft/index) · [Unsloth](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide)
- [Mozilla document-to-podcast](https://mozilla-ai.github.io/document-to-podcast/step-by-step-guide/) · [Podcastfy](https://github.com/souzatharsis/podcastfy)
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) · [python-pptx](https://python-pptx.readthedocs.io/)
- [MDN OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) · [storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) · [File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)
- [Agent Skills spec](https://agentskills.io/specification) · [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) · [Ragas](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)

Repository sources to preserve: `INTEL.md`, `docs/LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md`, `docs/AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md`, `docs/MULTIMODAL_MODEL_STACK_RU.md`, `docs/LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md`.

Research claims about benchmark deltas, storage eviction timing and third-party skill vulnerability rates are not adopted as aLandi facts without independent verification. Code, model weights, tokenizer, voice and dataset licences must be checked separately. No external stack or model was installed.
