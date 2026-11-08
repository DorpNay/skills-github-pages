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


---

## 2026-11-08 — Coder Workspace и прямой доступ к локальным файлам

**Статус:** PROPOSAL / research-backed; runtime не выбран и не установлен. Проверка выполнена по main `9033c6ad708a993cba5d1b27442f53651ad71c0f` и upstream snapshots ниже. Требования Coder должны быть reconciled в едином Master Task Registry после завершения PR #175; этот раздел не создаёт второй backlog.

### 1. Вывод по платформам

- **Desktop Chromium / Android Chromium:** File System Access API позволяет открыть выбранный файл/каталог в HTTPS-контексте после явного действия пользователя. Хранение handle не заменяет проверку permission при каждом возобновлении операции.
- **Safari на iOS/iPadOS и Safari desktop:** `showDirectoryPicker()` не поддерживается в текущей проверенной матрице. Обычный web upload/drag-and-drop остаётся fallback, но не эквивалентен постоянному доступу к папке.
- **iOS native:** `UIDocumentPickerViewController` умеет открыть каталог через security-scoped URL; приложение должно использовать `startAccessingSecurityScopedResource()`, file coordination и корректно сохранять/обновлять security-scoped bookmark.
- **Android native:** Storage Access Framework `ACTION_OPEN_DOCUMENT_TREE` даёт доступ к выбранному дереву; persistable URI permission можно сохранить, но доступ теряется, если документ перемещён/удалён. Android ограничивает некоторые системные каталоги.

**Следствие:** один static Pages/PWA client не может обеспечить одинаковый прямой доступ к папкам на всех устройствах. Не обещать iOS folder access через Safari. Для него потребуется native iOS shell/document-provider integration; для Android — native SAF provider или поддерживаемый Chromium File System Access API.

### 2. Рекомендуемая архитектура: Workspace Provider

Единый UI и editor должны работать через capability-based interface, а не считать все workspace одним filesystem:

| Provider | Где работает | Контракт и ограничения |
|---|---|---|
| `DirectLocalProvider` | Поддерживаемый browser | Только явно выбранные файлы/папка; permission revalidation; read/write отдельно; no arbitrary path access; upload/export fallback |
| `DesktopCompanionProvider` | Windows/macOS/Linux companion | Loopback-only authenticated API; pairing + origin allowlist; явные folder grants; canonical path/root confinement; revoke/audit; без произвольного shell |
| `MobileDocumentProvider` | Native iOS / Android | iOS security-scoped URLs/bookmarks; Android SAF URI grants; системный picker и повторная авторизация при потере доступа |
| `RemoteWorkspaceProvider` | aServi / удалённая машина | Отдельная аутентифицированная API-сессия, явный remote data scope; не выдавать за local files |
| `IsolatedVirtualWorkspaceProvider` | Изолированная среда исполнения | Ephemeral workspace, quotas/timeouts, restricted egress, sandbox; host mounts только по явному grant |

Capabilities объявляются явно: `list/read/writeAtomic/rename/delete/watch/git/terminal`. Отсутствующая capability должна быть disabled/unsupported, а не симулироваться. Watcher и terminal не включать в browser-only provider.

### 3. Coder UX и безопасность

- Monaco — только editor surface. File provider, persistence, Git, terminal, approval и sandbox остаются отдельными слоями.
- Изменения модели/агента — staged patch: multi-file diff → пользовательский review → approve конкретных файлов/операций → atomic write → проверка результата. Не исполнять generated code автоматически.
- Перед записью: сохранить recovery snapshot/undo point; показывать конфликт при изменении файла извне; не затирать чужие изменения. Rename/delete и массовые операции требуют отдельного подтверждения.
- Не следовать symlink за пределы разрешённого root; проверять canonical path после разрешения ссылки и повторно непосредственно перед операцией; ограничить размер/число файлов и глубину обхода.
- Локальный файл не означает локальную обработку: перед отправкой содержимого внешнему provider явно показать маршрут и объём данных. Local-only policy должна блокировать outbound provider calls, а не только менять надпись в UI.
- Terminal/CLI — отдельная capability. Пока нет проверенного sandbox с filesystem/network isolation, resource limits, cancellation и escape tests, host shell не предоставлять. `subprocess.run` не является sandbox.
- OPFS/IndexedDB подходят для локального индекса, cache и metadata, но не являются заменой пользовательской папки, backup или cross-device sync.

### 4. Open-source shortlist — результат первичного аудита

| Upstream snapshot | Лицензия / назначение | Решение для aLandi |
|---|---|---|
| [Monaco Editor](https://github.com/microsoft/monaco-editor) — `5359a3330383137dfdf8897ba1d93d943fec4027` | MIT; browser editor models/URIs, без filesystem provider и runtime | **Кандидат для editor layer**, если отдельный прототип докажет multi-file editing, accessibility и bundle/performance fit |
| [Co-do](https://github.com/PaulKinlan/Co-do) — `d3ebdbd5066f16a2bb8a2b8cb8af4b57c8ae324a` | File System Access PWA, IndexedDB handles, permission controls, WASM workers. README/package.json говорят MIT, но root `LICENSE` содержит Apache-2.0 — **лицензионное противоречие** | **Только UX/security reference** до upstream clarification; Safari iOS не решает; зависимости и WASM tool surface слишком велики для слепого переноса |
| [code-server](https://github.com/coder/code-server) — `fcd14dceb7f60195d6925ec5d0716e08a6e04b22` | MIT; полноценный browser VS Code server с terminal/runtime | **Опциональный RemoteWorkspace adapter**, не встроенный editor. Никогда не публиковать напрямую: upstream требует auth + TLS; default localhost/password не заменяет hardening |
| [OpenHands / Agent Canvas](https://github.com/OpenHands/OpenHands) — `c90c6199dcf57e9208ad2adfac2aef5b41e04ec8` | MIT; frontend control plane для Agent Server и разных backends; Docker sandbox — отдельная граница исполнения | **Архитектурный reference** для backend adapters, run state и sandbox; не импортировать целиком и не выдавать host access за безопасный режим |
| [ComfyUI](https://github.com/Comfy-Org/ComfyUI) — `bdb0816a292d221efeb6ec4ae41bcdff3f91fc86` | GPL-3.0; локальный node/workflow engine, image/video/media | **Отдельный optional media provider** через API; не встраивать код без GPL review. Лицензии моделей/checkpoints/nodes проверять отдельно |
| [Comfy Desktop](https://github.com/Comfy-Org/Comfy-Desktop) — `47e414e84a5fbb3f912602b5ba371f30b9be3af3` | AGPL-3.0-or-later или коммерческая лицензия; standalone desktop manager | **Не vendoring/hosting** без отдельного legal decision; не является лёгкой библиотекой для aLandi |

Не устанавливать все кандидаты. Наиболее узкий стек: существующий UI + один editor (Monaco, если eval оправдает) + наши provider adapters. Companion/native file bridge и isolated execution — отдельные компоненты с независимыми threat models.

### 5. Image / Video Factory — уточнение границы

ComfyUI остаётся кандидатом для локального GPU adapter, но не для базового 8-GB CPU gateway. API v2 подходит под будущий общий `MediaJob` contract: submit workflow → durable job ID → poll/status → outputs → cancel. Статус job должен быть авторитетным; UI не должен считать исчезновение polling ответа успешной генерацией. Модель, checkpoint, LoRA, custom node, dataset и workflow имеют независимые лицензии/условия.

Порядок: **Image Factory сначала**, затем Video Factory после отдельного GPU benchmark и оценки хранения/стоимости. Hosted provider допустим только после явного выбора, account/region/pricing/privacy review; никаких auto-download моделей или включения платных API.

### 6. Evidence и ограничения этого прохода

- Browser API: [MDN File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API), [MDN showDirectoryPicker](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker), [browser support matrix](https://web-platform-dx.github.io/web-features-explorer/features/file-system-access/).
- Native files: [Apple directory access](https://developer.apple.com/documentation/uikit/providing-access-to-directories), [Apple document picker](https://developer.apple.com/documentation/uikit/uidocumentpickerviewcontroller), [Android Storage Access Framework](https://developer.android.com/training/data-storage/shared/documents-files).
- Security/runtime: [code-server secure exposure](https://github.com/coder/code-server/blob/main/docs/guide.md), [OpenHands Docker sandbox](https://docs.openhands.dev/openhands/usage/sandboxes/docker).
- Media API: [ComfyUI API v2](https://docs.comfy.org/api-reference/v2/overview), [submit workflow](https://docs.comfy.org/api-reference/v2/jobs/submit-a-workflow-for-execution), [job status](https://docs.comfy.org/api-reference/v2/jobs/job-status-the-polling-workhorse), [cancellation](https://docs.comfy.org/api-reference/v2/jobs/request-cancellation).

**Не проверялось:** физические устройства владельца, iOS/Android native prototype, browser permission persistence на реальных профилях, companion threat-model tests, sandbox escape, target GPU/VRAM, media quality/latency и актуальные цены hosted providers. Upstream README/metadata не заменяют юридическое заключение; противоречие Co-do license оставлено открытым.

**Next:** после PR #175 повторно прочитать Master Task Registry и добавить/связать конкретные Coder acceptance tasks без дублирования LSV-001…017; затем подготовить отдельный ограниченный prototype plan для Monaco + provider contract.