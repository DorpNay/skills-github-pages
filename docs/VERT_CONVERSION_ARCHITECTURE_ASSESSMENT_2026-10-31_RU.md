> **Historical research/spec snapshot — imported 2026-11-08.** Main baseline is `c4f23e03f563d03213eb87002863da630fc8b833`. Preserve original findings/source context; runtime implementation is not inferred. Canonical active task register: `docs/MASTER_TASK_REGISTRY_RU.md` plus its addendum. Source intake/review status: `INTEL.md`.
> **Current boundary:** Future conversion architecture assessment. No OCR/ASR/VLM or conversion model is installed by this document; evaluate license, data provenance, storage, hardware, privacy and reproducible quality before acquisition.

---

# aLandi — оценка VERT и архитектуры конвертации файлов

**Дата:** 2026-10-31  
**Статус:** исследование; зависимости и runtime не менялись.  
**Вопрос владельца:** стоит ли использовать [VERT](https://github.com/VERT-sh/VERT) и его технику, чтобы дать пользователю и самой модели конвертацию файлов; есть ли более простые решения?

## 1. Краткий вердикт

**VERT — очень полезный reference по UX, локальной обработке через WebAssembly и маршрутизации конвертеров, но не лучший вариант для прямого встраивания в aLandi.**

Почему:
- VERT — самостоятельное Svelte/TypeScript приложение, заявляет 250+ форматов и использует WebAssembly для локальной конвертации большинства типов.
- Его собственная документация уточняет, что видео по умолчанию обрабатывается на сервере, потому что browser conversion слишком ресурсоёмок; для локального/самостоятельного видеообработчика существует `vertd`.
- VERT лицензирован **AGPL-3.0**, а отдельный `vertd` — **GPL-3.0**. Нельзя переносить код или встраивать UI wholesale без отдельного license/compliance review.
- Для aLandi лучше создать небольшой **Conversion Adapter Registry** поверх подходящих узких engines, разделив две разные задачи: пользовательская конвертация с сохранением представления и подготовка документа для LLM.

**Рекомендация:** сохранить VERT как эталон UX и browser-WASM architecture; не добавлять VERT/VERTD как зависимость. Первым делом расширять существующий локальный парсер и добавить опциональные adapter-ы только под доказанные форматы.

## 2. Что подтверждено в upstream VERT

[Официальный README](https://github.com/VERT-sh/VERT/blob/main/README.md) и [FAQ](https://github.com/VERT-sh/VERT/blob/main/docs/FAQ.md) сообщают:

- 15K stars на момент исследовательского среза; проект на Svelte и TypeScript.
- Более 250 форматов, изображения, аудио, документы и видео.
- Non-video conversion выполняется на устройстве через WebAssembly; файл не должен отправляться на cloud server для этих операций.
- VERT использует FFmpeg для audio/video, ImageMagick для изображений, Pandoc для документов.
- Видео по умолчанию отправляется на сервер; VERT предупреждает, что файл хранится до часа или до скачивания результата. Это не соответствует локально-приватному default aLandi.
- Официальный FAQ позволяет отключить внешние запросы build-time переменной `PUB_DISABLE_ALL_EXTERNAL_REQUESTS=true`, но оставляет запрос к jsDelivr для FFmpeg WASM bundle.
- [Video Conversion docs](https://github.com/VERT-sh/VERT/blob/main/docs/VIDEO_CONVERSION.md) описывают `vertd`: Rust HTTP wrapper around FFmpeg, default port 24153, можно self-host и подключить к UI.

**Лицензии:**
- [VERT LICENSE](https://github.com/VERT-sh/VERT/blob/main/LICENSE): GNU AGPL-3.0.
- [vertd LICENSE](https://github.com/VERT-sh/vertd/blob/main/LICENSE): GNU GPL-3.0.
- Отдельные upstream engines имеют собственные лицензии и условия сборки. Нужно проверять точные версии, бинарные bundles и notices, а не переносить общую лицензию VERT на все библиотеки.

## 3. Соответствие задачам aLandi

| Сценарий | Что нужно | VERT fit | Решение |
|---|---|---|---|
| Пользователь загружает DOCX и хочет PDF | Сохранить страницы, стили, таблицы и шрифты | UX reference; browser conversion possible only for selected formats | LibreOffice headless / browser-specific engine after license and output tests |
| Пользователь хочет PNG/JPEG/WebP/AVIF | Resize, metadata, color profile, quality settings | Strong reference for browser WASM ImageMagick approach | Browser-side narrow converter or local ImageMagick adapter; no full VERT UI |
| Пользователь конвертирует audio/video | Codec/container/transcode, subtitles, metadata | VERT delegates heavy video to vertd/FFmpeg | Optional FFmpeg adapter with sandbox/timeouts; never remote by default |
| Пользователь конвертирует Markdown/HTML/EPUB/DOCX/PPTX | Rich markup conversion and PDF export | VERT uses Pandoc | Pandoc adapter for supported markup pairs; test PDF toolchain and fidelity |
| Модель читает PDF/DOCX/XLSX | Extract meaning, headings, tables, pages, provenance | VERT UI is not the main solution | Model-facing parser pipeline: existing parsers → MarkItDown/Docling optional adapters |
| Модель преобразует документ в другой формат | Produce structured artifact for user | VERT UI is not a tool contract | Typed `convert_document` tool with format pair, profile, result artifact and warnings |

## 4. Что уже есть в aLandi

На текущем main:
- Gateway document extraction is disabled by default.
- Default upload body limit: 8 MiB.
- Default extracted-text cap: 80,000 characters.
- Existing local parsers handle UTF-8 text, PDF via pypdf, DOCX XML and XLSX OOXML; no file is written to disk by the extraction route.
- The UI can attach PDF/DOCX/XLSX to the configured local Gateway for model-facing extraction.
- This is **extraction**, not general file conversion. There is no verified user-facing convert/download pipeline yet.
- Existing source/test: `gateway/app.py`, `gateway/tests/test_document_extraction.py`, `tests/e2e/document-attachments.spec.mjs`, `index.md`.

The existing parser is a better low-footprint default than installing a broad document stack on an 8-GB VPS. Keep its DTD/OOXML/archive safety tests.

## 5. Более простые и эффективные alternatives

### 5.1 Model-facing normalization

| Project | License / scope | Strong side | Limitation / best fit |
|---|---|---|---|
| [Microsoft MarkItDown](https://github.com/microsoft/markitdown) | MIT; Python; Markdown-oriented extraction | Lightweight utility for PDF, Word, PowerPoint, Excel, images/OCR, audio transcription, HTML, CSV/JSON/XML, ZIP and EPUB. Preserves headings/lists/tables/links in Markdown. | README explicitly says it targets LLM/text analysis, not high-fidelity human-facing conversion. Good optional adapter, not a universal converter. |
| [Docling](https://github.com/docling-project/docling) | MIT; Python; 69K+ stars snapshot | Advanced PDF layout, reading order, tables, formulas, OCR, images, DOCX/PPTX/XLSX/HTML/EPUB/audio/video/ODF and structured DoclingDocument/Markdown/JSON. Local and air-gapped operation supported. | Much heavier dependency/model surface than current parser; excellent optional high-fidelity document worker, not default import dependency. |
| [Unstructured](https://github.com/Unstructured-IO/unstructured) | Apache-2.0 | Broad ETL/partitioning/chunking ecosystem and many document formats; useful for RAG pipelines. | Large optional dependency set (Poppler, Tesseract, LibreOffice, Pandoc, etc. depending on formats); upstream distinguishes OSS library from paid Transform API. Too broad for first minimal adapter. |
| Existing pypdf + safe OOXML parser | Current aLandi code | Small, local, testable, no new runtime; precise control over archive/DTD behavior. | Limited layout understanding, OCR and format coverage. Keep as fast path. |

**Recommendation for model ingestion:**
1. Keep current pypdf/DOCX/XLSX/text parser as fast, local baseline.
2. Benchmark MarkItDown as an optional adapter for broader file-to-Markdown coverage; install only format extras actually used.
3. Add Docling as a separate opt-in heavy worker for scanned PDFs, complex layouts/tables, and multimodal documents if golden-set results justify the memory/dependency cost.
4. Consider Unstructured only if a full ETL/chunking/RAG pipeline is justified; do not add it just to parse a few uploads.
5. Every parser returns source hash, parser/version, page/section offsets, warnings, extraction confidence, and structured elements where available.

### 5.2 User-facing conversion engines

| Engine | Useful conversion class | License / caveat | aLandi role |
|---|---|---|---|
| [Pandoc](https://github.com/jgm/pandoc) | Rich markup: Markdown, HTML, DOCX, EPUB, ODT, PPTX, XLSX, LaTeX, RST and many more; native AST + readers/writers | GPL-2.0; PDF output needs a suitable LaTeX/Groff/HTML backend | Optional adapter for markup/document conversions; not OCR or general office fidelity |
| [LibreOffice](https://www.libreoffice.org/) | Office documents: DOCX/ODT, XLSX/ODS, PPTX/ODP, PDF | GPLv3/MPL/LGPL component mix; inspect exact binary distribution and notices | Strong server-side office conversion engine; heavy process, isolate and test fonts/layout |
| [FFmpeg](https://ffmpeg.org/) | Audio/video containers, codecs, streams, subtitles, extraction | Core is LGPL; optional GPL components change build licensing | Optional local media conversion/transcode worker; use exact pinned build and provenance |
| ImageMagick | Image formats, resize, color, metadata, batch transforms | License/delegate details depend on build and delegates | Optional image adapter; strict resource/delegate policy |
| Browser WASM libraries | Selected image/archive/PDF transformations in user browser | Per-library license and browser memory limits | Privacy-first lightweight conversions; use narrow libraries, not a universal framework |
| [VERT](https://github.com/VERT-sh/VERT) | A complete user-friendly conversion product across many formats | AGPL-3.0; video daemon GPL-3.0 | Product/UX reference only unless legal review approves code reuse |

No single engine handles all file pairs well. Use a capability matrix and adapter routing; never advertise a pair until it has a fixture-based test and quality review.

## 6. Proposed aLandi Conversion Adapter Registry

Separate two pipelines so a model-optimized representation does not overwrite a user's original file.

### 6.1 User-facing conversion profile

Input:
- original file bytes/reference, detected MIME and signature;
- requested target format;
- quality/preset/options selected by the user.

Output:
- converted file as a downloadable artifact/blob;
- original filename + safe target extension;
- engine/version, checksum, output MIME/size;
- warnings: lossy conversion, unsupported feature, missing font, OCR needed, metadata stripped;
- preview where safe and practical.

Default: local browser WASM for small supported files; local gateway worker for heavy formats. No external converter endpoint unless user explicitly opts in and sees where data goes.

### 6.2 Model-facing normalization profile

Input: file reference and extraction policy.

Output:
- Markdown for semantic reading;
- structured JSON for tables, pages, sections, cells and metadata;
- source hash and exact page/section/element provenance;
- OCR/transcription metadata where used;
- parser version, warnings, and extraction completeness.

The model sees references to extracted artifacts, not an arbitrary binary blob or an entire file flattened into one string. It can request more pages/sections through bounded tools.

### 6.3 Typed tool contract

A future tool should look conceptually like:

```json
{
  "name": "convert_document",
  "input": {
    "artifact_id": "user-owned-input",
    "target_format": "pdf",
    "profile": "user_facing",
    "options": {}
  },
  "output": {
    "artifact_id": "converted-output",
    "mime_type": "application/pdf",
    "sha256": "...",
    "engine": "libreoffice",
    "warnings": []
  }
}
```

The model selects a supported conversion intent; server-side code chooses only an approved engine and exact format pair. The model cannot supply an executable path, arbitrary CLI flags, network URL or filesystem destination.

## 7. Security and quality contract

- Detect actual file signature/MIME, not extension alone.
- Validate ZIP member paths, compression ratio, nesting, XML DTD/entities, macro/embedded content and archive size.
- Enforce independent limits: upload bytes, pages, pixels, audio/video duration, decompressed bytes, CPU time, wall-clock timeout and output bytes.
- Run heavy converters in an isolated worker with no network, no host mounts, minimal filesystem and scoped temp directory.
- Always clean temporary files on success, failure, timeout and cancellation.
- Keep source file immutable; output gets a new artifact ID and SHA-256.
- Use `Cache-Control: no-store` for private artifacts and avoid logging document content.
- Warn when the conversion is lossy; test round-trip fidelity with fixtures for fonts, tables, formulas, layouts, embedded media and multilingual content.
- Do not execute macros or document-embedded scripts.
- Preserve page/section provenance in model-facing extraction and mark OCR-derived text.

## 8. Suggested adoption sequence

1. **No new dependency:** document the current extraction capabilities and fixture gaps; add an explicit format capability registry.
2. **Model-facing pilot:** compare current parser vs MarkItDown vs Docling on a golden set (RU/EN/TH; scanned PDF; tables; complex DOCX/XLSX/PPTX). Measure accuracy, table structure, RSS, p95 and dependency footprint.
3. **User-facing pilot:** implement one format family at a time, starting with a browser-safe image conversion or a local office-to-PDF worker after license/runtime review.
4. **Media adapter:** decide whether direct FFmpeg subprocess is simpler than adopting GPL vertd; test on target host.
5. **VERT UX:** adopt ideas such as local-first processing, conversion settings, format-pair discovery and clear privacy disclosures; do not embed AGPL frontend.
6. Only add heavy services or broad engines after measured demand and exact provenance/license review.

## 9. Source links

- [VERT README](https://github.com/VERT-sh/VERT/blob/main/README.md)
- [VERT FAQ](https://github.com/VERT-sh/VERT/blob/main/docs/FAQ.md)
- [VERT Getting Started](https://github.com/VERT-sh/VERT/blob/main/docs/GETTING_STARTED.md)
- [VERT Video Conversion](https://github.com/VERT-sh/VERT/blob/main/docs/VIDEO_CONVERSION.md)
- [VERT AGPL-3.0 license](https://github.com/VERT-sh/VERT/blob/main/LICENSE)
- [vertd repository](https://github.com/VERT-sh/vertd) · [GPL-3.0 license](https://github.com/VERT-sh/vertd/blob/main/LICENSE)
- [MarkItDown](https://github.com/microsoft/markitdown) · [MIT license](https://github.com/microsoft/markitdown/blob/main/LICENSE)
- [Docling](https://github.com/docling-project/docling) · [MIT license](https://github.com/docling-project/docling/blob/main/LICENSE)
- [Unstructured](https://github.com/Unstructured-IO/unstructured)
- [Pandoc](https://github.com/jgm/pandoc)
- [LibreOffice](https://www.libreoffice.org/)
- [FFmpeg](https://ffmpeg.org/)



## 2026-11-23 — Filee and Altered source review; P4 boundary refinement

### Current aLandi extraction baseline (live `main` inspection)

This is the existing **model-facing extraction** path, not a user-facing file-conversion service:

- `POST /v1/documents/extract?filename=…`; disabled by default (`ALANDI_DOCUMENT_EXTRACTION_ENABLED=false` unless explicitly enabled).
- Accepted extensions: `.pdf`, `.docx`, `.xlsx`, `.txt`, `.md`, `.csv`, `.json`. Text must decode as UTF-8; PDF checks the `%PDF-` signature; OOXML checks the ZIP signature and required package parts.
- Default request-body cap: 8 MiB; extracted-text cap: 80,000 characters; PDF cap: 40 pages.
- OOXML archive guard: at most 500 entries, at most 20 MiB expanded bytes, rejects unsafe/absolute/backslash/`..` paths, duplicate names and encrypted entries, and rejects suspicious high compression ratios for large entries. XML parser explicitly rejects DTD/entity declarations; XLSX relationship targets are normalized and constrained to the package.
- Extraction runs through `asyncio.to_thread`, does not persist the upload as a file, and returns `Cache-Control: no-store`. Scanned PDFs correctly report no extractable text; OCR is a separate future local runtime.
- `POST /v1/rag/ingest` is a separate interface accepting an already normalized JSON document/chunk payload with document/source IDs and scope; it is not a raw-file converter or durable artifact-job API.

**Gap confirmed:** the code still has a fixed extension allowlist and format-specific extraction functions. It does not yet define a typed input/output format-pair registry, a multi-step conversion planner, a queued/cancellable user artifact job, or a general conversion/download endpoint. Keep extraction and user-visible conversion as separate products and security contracts.

### Filee practices to adapt in aLandi — no Filee runtime import

[Filee](https://github.com/KnifeLemon/Filee) v2.5.0 is MIT and desktop Avalonia/.NET, so it is not a browser or FastAPI drop-in. Its useful contribution is its **converter-system design**:

1. Represent each converter as a typed edge: accepted input format(s), produced output format(s), engine/version, explicit capability reason, fidelity/loss characteristics, resource profile and separate license/provenance.
2. Plan only registered paths. A bounded Dijkstra route with a maximum of three hops is a reasonable initial policy to evaluate; tie-breaking and edge cost must be deterministic. Never infer a path just because two extensions appear in a UI list.
3. Execute an approved path as one job with step-level progress, a per-engine concurrency limit, cancellation and wall-clock/resource budgets. Do not put all converters behind one unbounded queue.
4. Stage outputs in a private job-owned directory. Reserve output IDs/paths before execution; never overwrite the source by default. On cancellation/failure clean only intermediates created by that job; keep shared or pre-existing artifacts untouched.
5. Adapters receive immutable input and allocate new outputs through a scoped allocator. External executables use fixed argument arrays (no shell), fixed operator-configured binary paths, no ambient PATH lookup, timeout/cancel/reap and no model-controlled command/URL/flags.
6. Any downloadable optional engine must be pinned by upstream release, URL, SHA-256 and byte size; engine licensing is independent from the MIT license of Filee itself.
7. Validate the completed output by reading it back (signature/parser/format test, and `ffprobe` or equivalent for media), calculate an artifact hash, preserve metadata where promised, record warnings and state clearly when conversion is lossy. A deterministic output claim requires fixture-based reproducibility tests.

Filee v2.5.0 also documents three security fixes involving crafted documents/archives, memory/disk/time expansion and installer path/privilege boundaries. That reinforces the existing P4 requirement: enforce archive entry, expanded-byte, compression-ratio, page/pixel/duration, output-size, CPU and wall-clock limits **per format and per conversion step**, not only an HTTP upload-size cap.

### Altered Audio Editor — audio-specific reference only

[Altered Audio Editor](https://github.com/geekcastradio/altered-audio-editor) v0.63.0 (2026-11-22) is GPL-3.0/GPL-3.0-or-later and pre-1.0; Windows is primary while Linux/macOS are experimental. It is not a general document converter. Its local audio pipeline can inform future P6/aSoundi design: immutable source clips, versioned session state, deterministic rendering, metadata-aware batch jobs, per-file progress, output read-back validation and explicit known-limitations. **Do not copy its GPL code** into the core project. Keep any future audio converter adapter/license review distinct from document extraction and from commercial Altered.ai.

### P4 decision and acceptance packet

- **ADAPT now as design:** typed format capability registry and explicit unavailable reasons; immutable source/artifact IDs; bounded conversion graph; per-engine queue; job-owned staging/cleanup; cancel/retry/recovery; output verification/provenance.
- **DEFER implementation until the user-visible artifact contract is ready:** define target formats, artifact persistence/retention, quota ownership, job status/events, cancellation semantics and export/download access before adding a converter executable or a large framework.
- **No new dependencies selected:** keep current pypdf and small OOXML/text parsers as the extraction baseline. Benchmark MarkItDown/Docling/Unstructured only against a RU/EN/TH golden corpus and exact target-host RSS/latency/accuracy before replacing any parser.
- **Required evals:** malformed/valid files by format; RU/EN/TH and mixed scripts; scanned and text PDFs; DOCX styles/tables; XLSX formulas/shared strings/sheets; archive bombs/traversal/duplicate/DTD; cancellation at each conversion step; crash cleanup; idempotent retry; source immutability; output parse/read-back; artifact hash/provenance; measured p50/p95, peak RSS, disk expansion and exact engine version/license.


## 2026-11-02 — Conversion adapter registry and VERT decision

### Normalized conversion pipeline

Treat conversion as a set of typed adapters, not one universal "convert everything" switch:

1. Detect format using extension **and** byte-level MIME/signature checks.
2. Enforce size, page, duration, decompression and wall-clock budgets before parsing.
3. Run the selected parser in an isolated, non-networked worker/process with bounded memory and temp storage.
4. Normalize into a typed document representation: text blocks, headings, tables, formulas, image references, page numbers, bounding boxes, timestamps, source metadata and warnings.
5. Preserve source hash and stable chunk IDs so citations point back to the original page/region/time.
6. Offer explicit output profiles: readable Markdown, structured JSON, searchable text, extracted assets, subtitles/transcript, or code draft.
7. Validate output and expose parser warnings/unsupported regions; never claim lossless conversion without a round-trip test.

### Candidate adapters — reference only

| Tool | Best-fit role | Integration caveat |
|---|---|---|
| [MarkItDown](https://github.com/microsoft/markitdown) | Lightweight office/web content → Markdown | Useful first benchmark; not a universal layout/OCR engine. |
| [Docling](https://github.com/docling-project/docling) | Layout-aware documents, tables, figures, OCR and structured representation | Larger dependency/model footprint; benchmark on actual target hardware and exact format extras. |
| [Unstructured](https://github.com/Unstructured-IO/unstructured) | Partitioning heterogeneous documents and chunking | Deployment and parser dependency surface can be substantial. |
| [Pandoc](https://github.com/jgm/pandoc) | Markup/document format conversion | Not OCR or visual-layout understanding. |
| LibreOffice headless | Office format rendering/conversion | Run isolated with profile/temp limits; do not expose arbitrary macro execution. |
| FFmpeg | Audio/video demux, sampling, transcode and metadata | Strict codec, duration, stream-count and resource limits required. |

Docling's official [supported-formats matrix](https://docling-project.github.io/docling/usage/supported_formats/) is the authoritative source for its current format coverage; do not infer support from file extensions alone.

### Screenshot and webpage reverse engineering

Separate two inputs:
- **Visual screenshot/mockup → code draft:** [screenshot-to-code](https://github.com/abi/screenshot-to-code) is MIT, but its current self-host path uses a React/Vite frontend, FastAPI backend and model-provider keys. Use as a design reference or isolated spike, not as a dependency in the static app.
- **Live webpage → code/source map:** use an explicit browser capture of DOM, computed styles, asset URLs and responsive states, then map nodes to screenshots. A screenshot alone cannot recover semantic intent, original component boundaries or source assets.

All generated code must be reviewed for semantics, accessibility, responsive layout, asset provenance, external requests and unsafe scripts before preview or export.

### VERT

[VERT](https://github.com/VERT-sh/VERT) is AGPL-3.0 and [vertd](https://github.com/VERT-sh/vertd) is GPL-3.0. Treat these as strong copyleft deployment decisions, not neutral drop-in utilities. Benchmark permissive alternatives first; if VERT is still selected, require a separate legal/license review, process boundary and explicit owner approval. No VERT code or service is adopted by this research PR.


## 2026-11-24 — File-ingestion source-group audit (primary upstream refresh)

**Scope:** Filee, MarkItDown, Docling, Unstructured, Pandoc, LibreOffice, FFmpeg, VERT/vertd, browser-WASM approaches, plus the current aLandi extraction implementation. This is a source-group review, not a claim that every URL in the legacy catalogue has been audited. Upstream versions below are the versions visible in the official sources at this review; recheck before pinning or installation.

### Findings by source

| Source | Verified upstream boundary | Reusable design / best fit | aLandi disposition |
|---|---|---|---|
| [KnifeLemon/Filee](https://github.com/KnifeLemon/Filee) | v2.5.0; MIT for Filee itself. Avalonia/.NET desktop app; optional converters/engines have independent licenses. | Typed converter edges, explicit format registry, weighted Dijkstra with max 3 hops, route-specific constraints, stable converter IDs, engine availability status, per-engine semaphores, job progress/cancel, private work folder, output path reservation and source-preserving default. ProcessRunner uses fixed argument lists, no shell, timeout/cancellation and explicit engine discovery. | **ADAPT architecture, not runtime.** Do not copy the desktop application wholesale. Important caveat from current source: its Channel queue is unbounded and each job may fan out to processor-count parallelism; the server must instead use bounded admission, global/per-tenant quotas, per-engine concurrency and explicit overload responses. Its single-user local trust model is not a multi-tenant service security model. |
| [Microsoft MarkItDown](https://github.com/microsoft/markitdown) | Latest release visible in official Releases: v0.1.9; MIT. Optional format extras/plugins. README explicitly says operations run with current process privileges and warns to sanitize untrusted inputs. | Narrow format adapters and conversion to Markdown; use stream/local entry points where possible, choose only needed converters, pin exact extras. Good benchmark candidate for common office/web/structured-text extraction. | **BENCHMARK, not default dependency.** It is optimized for LLM/text analysis, not high-fidelity human-facing conversion. Do not pass arbitrary URLs or user paths to it; isolate and pass bounded bytes/streams. |
| [Docling](https://github.com/docling-project/docling) | Current main package metadata observed at v2.151.1; MIT code. Official supported-formats matrix includes PDF, modern/legacy Office, ODF, EPUB, Markdown/HTML, images, audio/video, email and more; some paths require LibreOffice, FFmpeg, audio/ASR extras or model assets. | Rich document representation, layout/reading order, table structure, OCR and export to Markdown/JSON/HTML; best candidate for a separate high-fidelity extraction worker. | **OPTIONAL HEAVY WORKER, deferred.** Broad format count is not a guarantee of identical quality or light runtime. Exact extras, model weights/licenses, CPU/RAM, cold-start, page latency and RU/EN/TH quality must be measured on the target host before enabling. |
| [Unstructured](https://github.com/Unstructured-IO/unstructured) | Apache-2.0 project; format-specific partitions often depend on external binaries/libraries and optional services. | Partitioning, chunking and ETL patterns for a later RAG ingestion pipeline. | **DEFER.** Too broad for the current minimal extraction path; compare only if P4 retrieval/partitioning evaluations show a concrete gap. |
| [Pandoc](https://github.com/jgm/pandoc) | GPL-2.0; broad markup reader/writer ecosystem. PDF output depends on a separate backend/toolchain. | AST-based rich markup transformations and explicit reader/writer pairs. | **OPTIONAL isolated adapter.** Strong for Markdown/HTML/EPUB/office markup, not OCR or visual office fidelity. GPL distribution review required. |
| [LibreOffice](https://www.libreoffice.org/) | Headless office conversion is possible; distribution includes multiple components/licenses and platform/font dependencies. | DOCX/XLSX/PPTX ↔ PDF/ODF rendering where fidelity tests pass. | **OPTIONAL isolated process.** Separate user profile and temp directory, fixed CLI arguments, macros disabled, no network, CPU/RAM/time/output quotas; inspect exact packaged binaries and notices. |
| [FFmpeg](https://ffmpeg.org/) | Core licensing is LGPL when built accordingly; optional GPL components and codec libraries can change the effective distribution obligations. | Audio/video demux, transcode, stream metadata, thumbnail/waveform and subtitle pipelines. | **P6/P4 media adapter only after build provenance.** Pin exact build/configuration and codec set; sandbox subprocess, restrict protocols, stream count, duration, dimensions, threads and output bytes. |
| [VERT](https://github.com/vert-sh/vert) / [vertd](https://github.com/vert-sh/vertd) | VERT AGPL-3.0; vertd GPL-3.0. Current FAQ says non-video processing is on-device but official video flow uploads to its server; self-hosted Rust/FFmpeg daemon is available. Homepage's broad local-processing wording must not override the more specific FAQ. | Excellent local-first converter UX, format-pair discovery/settings, browser-WASM processing, separate heavy media daemon. | **UX/architecture reference only.** No wholesale UI/code/service adoption. Copyleft and external-request behavior conflict with current no-hidden-upload boundary unless separately approved. |
| Browser-WASM engines | Per-library licenses and browser support/memory limits vary. | Small image/PDF/archive transforms can remain private and avoid server load. | **PILOT one narrow family only.** Capability detection, worker isolation, memory caps, cancellation, same-origin pinned assets and output read-back required. Browser availability is not a server conversion capability. |

### Cross-source synthesis — recommended aLandi design

1. **Keep two independent products:** (A) model-facing extraction/normalization into text or structured evidence; (B) user-facing conversion producing a new downloadable artifact. Never label extraction as conversion and never replace the original.
2. **One typed capability registry:** each adapter declares exact input/output MIME pair, extension hints, signature detector, parser/engine version, license/source, fidelity/loss, limits, availability reason and test-fixture ID. Extension lists are UI hints only; signature and MIME checks remain server-side.
3. **Bounded route planning:** only registered edges; deterministic weighted route, initial maximum 3 hops; reject loops and format-specific forbidden edges; record the complete planned route before execution. Cost should include fidelity loss, CPU/RAM, duration and trust class, not just hop count.
4. **Bounded durable jobs:** bounded admission queue; global and per-user concurrency; per-engine semaphores; job idempotency; explicit queued/running/cancelling/completed/failed/cancelled states; progress per step; retry only when idempotency and cleanup are proven. Do not copy Filee's unbounded Channel or CPU-count fan-out into a shared server.
5. **Private staging and output ownership:** immutable source artifact; job-scoped directory with restrictive permissions; reserve destination ID before work; cleanup only paths owned by the job; never overwrite original; clean on success/failure/cancel/timeout/process crash recovery.
6. **Sandbox external engines:** no network by default; no shell; fixed executable allowlist and argument builder; minimal filesystem; no ambient PATH discovery; macros/scripts disabled; subprocess timeout/kill/reap; independent resource budgets per hop.
7. **Validate output:** read back with the declared output parser/signature checker; hash output; record MIME/size/engine/version/warnings/fidelity; preserve page/sheet/slide/time offsets and source hash. A successful process exit alone is not a valid artifact.
8. **Choose engines by evidence:** keep current pypdf + bounded OOXML/text extraction as fast path; benchmark MarkItDown on a representative RU/EN/TH corpus; reserve Docling for complex layout/OCR only if its quality gain justifies model and memory costs; keep Pandoc/LibreOffice/FFmpeg as separate user-facing conversion families.

### Source review caveats

- MarkItDown's current-process I/O warning is a security boundary, not a minor deployment note. A parser process must not be able to read arbitrary gateway files or reach internal URLs.
- Docling's format matrix includes optional dependencies and model-backed paths. Capability must be registered per exact installed adapter/extras/model, not inferred from the upstream umbrella project's format table.
- Filee is an excellent systems reference, but its local desktop assumptions (single user, local filesystem, interactive process) must be reworked for a shared FastAPI gateway.
- VERT's homepage and FAQ are not equally precise about server-side video. Use the FAQ and deployment configuration as the operative privacy evidence.
- No new package, converter binary, OCR model, media model, browser-WASM bundle or upstream code was installed/copied in this audit.

### Relation to current aLandi implementation

- Main currently has the small model-facing extraction route and no general user-facing conversion/download job pipeline.
- Draft PR #190 adds the first typed capability registry for fixture-backed TXT/MD/CSV/JSON/PDF/DOCX/XLSX extraction only; it is not merged and does not implement the converter graph, queue, artifact lifecycle or external engine sandbox described above.
- P4.6 remains OPEN. P0 landing/release acceptance remains the active delivery blocker; this research can inform the later P4 packet without reordering the release gate.

### Primary upstream sources inspected

- [Filee v2.5.0 release](https://github.com/KnifeLemon/Filee/releases/tag/v2.5.0)
- [Filee architecture](https://github.com/KnifeLemon/Filee/blob/master/docs/ARCHITECTURE.md)
- [Filee route planner](https://github.com/KnifeLemon/Filee/blob/master/src/Filee.Core/Conversion/RoutePlanner.cs)
- [Filee job queue](https://github.com/KnifeLemon/Filee/blob/master/src/Filee.Core/Conversion/JobQueue.cs)
- [Filee converter-authoring contract](https://github.com/KnifeLemon/Filee/blob/master/docs/ADDING-A-CONVERTER.md)
- [MarkItDown README/security](https://github.com/microsoft/markitdown)
- [MarkItDown releases](https://github.com/microsoft/markitdown/releases)
- [Docling package metadata](https://github.com/docling-project/docling/blob/main/packages/docling/pyproject.toml)
- [Docling supported formats](https://docling-project.github.io/docling/usage/supported_formats/)
- [Docling model catalogue](https://docling-project.github.io/docling/usage/model_catalog/)
- [VERT FAQ](https://github.com/vert-sh/vert/blob/main/docs/FAQ.md)
- [VERT video conversion](https://github.com/vert-sh/vert/blob/main/docs/VIDEO_CONVERSION.md)
- [VERT license](https://github.com/vert-sh/vert/blob/main/LICENSE) · [vertd license](https://github.com/vert-sh/vertd/blob/main/LICENSE)
