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
