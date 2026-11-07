> **Historical research snapshot — PR #131 / 2026-10-31; imported 2026-11-08.** Main baseline is now `c4f23e03f563d03213eb87002863da630fc8b833`. This file preserves source-derived findings and requirements; it does not assert current runtime implementation. The canonical active task register is `docs/MASTER_TASK_REGISTRY_RU.md` plus its existing addendum. Current source admission/review status is tracked in `INTEL.md`.

---

# aLandi — Local Source Vault и мультимодальное преобразование материалов

**Дата:** 2026-11-02  
**Workstream:** PR #130 Deep Research 2.0, research-only / Draft / HOLD.

## 1. Задача и продуктовая модель

Пользователь должен иметь возможность работать с материалом в одном из трёх режимов:

1. **Reference only:** сохранить описание места/пути/URL и metadata; сам файл не копируется и не обещается доступ к нему.
2. **Attach for this task:** пользователь выбирает/перетаскивает файл; он доступен только в рамках текущего запроса/чата по действующим правилам.
3. **Import to local knowledge:** после отдельного согласия создать локальную копию/индекс с происхождением, квотой, управлением удалением и поиском.

Эти режимы должны быть различимы в UI и в storage. Нельзя тихо превращать ссылку на путь в копию файла или помещать содержимое в долгосрочную память.

## 2. Доступ к файлам устройства

### Browser-only

- HTTPS и явный user gesture для file/folder picker.
- File System Access API: `showOpenFilePicker()`, `showDirectoryPicker()`; проверять `queryPermission()` и при необходимости запрашивать `requestPermission()`.
- Сохранённые handles можно хранить в IndexedDB, но permission может не сохраниться после закрытия всех вкладок; повторно запрашивать доступ при следующем использовании.
- Для браузеров без API: обычный `<input type=file>`, drag-and-drop или выбор файла заново.
- Запись на диск — отдельное разрешение и отдельная кнопка Save/Export.
- Ввод пути текстом может быть сохранён как reference, но веб-страница не может читать произвольный локальный путь только потому, что пользователь его напечатал.

### Optional local companion

Если требуется постоянный доступ к выбранным папкам, watchers, shell conversion или стабильные filesystem paths, это отдельный локальный companion/desktop agent:
- loopback-only authenticated API;
- pairing и origin allowlist;
- user-visible file grants per folder;
- scoped read/write roots;
- no arbitrary shell;
- audit trail and revoke;
- explicit owner approval before implementation.

Не открывать gateway filesystem через публичный endpoint и не передавать абсолютные локальные пути в облачные модели без согласия.

## 3. Source Vault record

Минимальная запись источника:
- source_id, owner_scope (private/chat/project), source_type;
- original_name, MIME, size, SHA-256;
- origin URL/path label, source locator, acquired_at;
- permission/grant state and expiry;
- storage mode (reference/attachment/local-copy);
- extraction tool/version/model and license metadata;
- derived artifacts with parent_source_id and hash;
- retention, deletion status and user-visible provenance.

Индекс и derived artifacts должны быть удаляемы по lineage. Удаление оригинала/источника должно помечать зависимые chunks, embeddings, summaries и generated Skills для повторной проверки/удаления.

## 4. Ingestion pipeline

`Select → Consent → Type/size validation → Malware/quarantine → Hash → Extract → Normalize → Chunk → Evidence map → Index → Review`

- PDF/Office/HTML: native structure extraction first; OCR only for pages that need it.
- Images: metadata + OCR + optional VLM descriptions/regions.
- Audio: ASR transcript + timecodes; audio is sensitive content.
- Video: metadata + scene/frame sampling + ASR + timestamped index.
- Web pages: safe fetch with allowlist, SSRF defense, robots/terms review, source timestamp.
- Repositories: selected paths and commit SHA; never run arbitrary code during indexing.

## 5. Converters and Skills

### Universal material → Skill / Agent blueprint

`Source → Extraction → Claim/procedure map → Skill draft → Evals → License/security review → Human approval → Versioned Skill`

A second path creates an Agent blueprint by combining a task scenario with a role, Skills, model policy, tool scopes, data scope, budgets and approvals. It does not instantiate an independent runtime by itself.

### Image / screenshot / page → code

- Candidate: [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code), MIT repository source; supports screenshot/mockup/Figma/screen-recording inputs and several frontend output stacks.
- Treat output as a draft: semantic HTML, responsive layout, keyboard, accessibility, assets, security and existing project architecture must be reviewed.
- Never execute generated code automatically; generate in an isolated review workspace and show a diff.
- Preserve source screenshot hash, prompt, model/provider, output commit and reviewer.

### Documents and OCR

- [Docling](https://github.com/docling-project/docling): MIT codebase, local/offline document conversion; each bundled model has its own license.
- [doc-parse](https://github.com/samsgates/doc-parse): promising multi-provider OCR/DPIR router; review repository license, dependencies, security and maintenance before use.
- Existing aLandi document parser remains baseline; compare extraction quality and resource use before adding another stack.

### Video generation / editing

- [ComfyUI](https://github.com/Comfy-Org/ComfyUI): local graph/API workflow engine, GPL-3.0 app; supports media workflows and saved JSON graphs. It is a separate substantial runtime, not a lightweight converter.
- [ComfyUI workflow templates](https://github.com/Comfy-Org/workflow_templates): reusable workflow JSON and model metadata.
- [Wan 2.2](https://github.com/Wan-Video/Wan2.2): selected model variants are published under Apache-2.0; verify exact checkpoint, model card and dependencies before use. 5B is the first candidate to assess, but still likely beyond an 8-GB CPU VPS.
- Image-to-video, text-to-video, video-to-video, frame interpolation, upscaling and audio sync should be distinct task types.

## 6. Model/workflow archive

Для важных upstream components и ранее выбранных artifacts вести **watchlist**, а не бесконтрольное скачивание:
- repository URL, exact commit/tag/release, SHA-256;
- code license, model/weights license, dataset license separately;
- dependencies, runtime and hardware;
- release date, last activity, maintainer/security status;
- reason for preserving, size, storage location;
- provenance and update policy.

Только после review и explicit approval:
- mirror source archives/releases that license permits;
- download weights into external artifact storage, never Git;
- pin hashes and preserve notices;
- retain old versions for reproducibility;
- never mirror gated/restricted assets without permission.

## 7. Tasks

- [ ] LSV-001 — compare browser File System Access support across target browsers and native mobile.
- [ ] LSV-002 — define reference/attachment/local-copy consent and storage state machine.
- [ ] LSV-003 — prototype IndexedDB handle persistence and permission revalidation; no background watcher.
- [ ] LSV-004 — define local Source Vault schema, quotas, deletion lineage and export.
- [ ] LSV-005 — threat model file parsing, archive bombs, path traversal, symlinks and malicious PDFs.
- [ ] LSV-006 — evaluate Docling against existing parser on a representative RU/EN/TH corpus.
- [ ] LSV-007 — review doc-parse license, dependency tree, maintenance and adapter isolation.
- [ ] LSV-008 — evaluate screenshot-to-code in a no-execution sandbox with golden screenshot tests.
- [ ] LSV-009 — define video frame sampling, subtitle/transcript and provenance contracts.
- [ ] LSV-010 — benchmark ComfyUI/Wan 2.2 5B only on suitable GPU hardware; no target VPS assumption.
- [ ] LSV-011 — implement material-to-Skill draft with evidence mapping and human approval.
- [ ] LSV-012 — implement Agent blueprint conversion as a separate artifact type.
- [ ] LSV-013 — create upstream archive watchlist and preservation policy.
- [ ] LSV-014 — no downloads, mirrors, dependencies or runtime activation without owner approval.

## 8. Explicit limitations

- Static browser cannot read arbitrary local paths from text input.
- Browser folder handles do not guarantee persistent permission or background watching.
- IndexedDB/OPFS are browser-origin storage, not an automatically synchronized user filesystem.
- Source reference, local copy, indexed text, embeddings, summary and Skill are distinct artifacts with separate retention/deletion lineage.
- Large video models and ComfyUI are not realistic assumptions for an 8-GB CPU-only gateway.
- Model weights and datasets may have licenses different from the source repository.

## Sources

- [File System Access API — Chrome Developers](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access)
- [FileSystemFileHandle — MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle)
- [Docling](https://github.com/docling-project/docling)
- [doc-parse](https://github.com/samsgates/doc-parse)
- [screenshot-to-code](https://github.com/abi/screenshot-to-code)
- [ComfyUI](https://github.com/Comfy-Org/ComfyUI)
- [Official ComfyUI workflow templates](https://github.com/Comfy-Org/workflow_templates)
- [Wan 2.2](https://github.com/Wan-Video/Wan2.2)

**Status:** research/design only. No files were read from the owner's device, no model was downloaded, no new dependency/runtime was installed, and no production route was changed.
