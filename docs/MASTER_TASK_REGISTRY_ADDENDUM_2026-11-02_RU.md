# Реестр задач — дополнение 2026-11-02: функции, локальные источники и мультимедиа

**Родительский реестр:** `docs/MASTER_TASK_REGISTRY_RU.md` (PR #127).  
**Назначение:** append-only delta новых требований владельца от 2026-11-02. Не заменяет исходный lossless inventory и не переносит задачи между workstreams.

## Правила статусов

- `[ ]` — задача поставлена, не реализована/не проверена.
- `[~]` — частично исследована или имеет незакрытые проверки.
- `[x]` — только при наличии точного артефакта и evidence.
- Исследовательская задача не означает разрешение на runtime, dependency, download или deployment.
- Future/Research PR остаются Draft/HOLD; принятые решения переносить отдельными минимальными PR от актуального main.

## A. Functions / Agents menu — PR #131

- [~] MENU-001 — инвентаризация первично выполнена по `index.md`, `assets/js/app.js`, `assets/css/app.css` и E2E; полную матрицу handler/permission/data scope/evidence завершить.
- [~] MENU-002 — базовая иерархия уже существует как 4 группы (task workflow, research/sources, create/transform, connections); расширить вложенные категории Agents/Skills/Files/Media/Models/Tasks без дублирования.
- [~] MENU-003 — текущие roadmap items уже показывают non-runtime ticker и пояснение; формализовать единый status model для всех карточек.
- [~] MENU-004 — текущий agent panel уже показывает mode, team blueprint, use cases, 64 roles, orchestration, models/resources and capabilities; добавить Skill binding, data scope, budgets, approvals and outputs по мере появления реальных handlers.
- [~] MENU-005 — сейчас доступны direct response и sequential four-stage workflow; остальные режимы оставить roadmap-only до независимого runtime.
- [~] MENU-006 — текущие chat profile/team blueprint controls существуют; расширенные model/skill/data/permission/resource/history controls требуют реальных backing APIs.
- [~] MENU-007 — `1ИÆИT10И` tickers, pause controls, reduced-motion CSS and non-runtime notes exist; E2E assertions are authored, but exact-head execution is pending.
- [ ] MENU-008 — завершить mobile/keyboard/VoiceOver and duplicate-control review; RU/EN menu labels and initial Playwright assertions already exist.
- [x] MENU-009 — supporting UX contract создан; он включает source audit and remaining gaps. Canonical UI checklist sync remains a separate bounded docs step.

## B. Skill Factory и Agent Builder — PR #125 / PR #128

- [ ] SF-001…SF-007 — Skill lifecycle: source ingestion, evidence/provenance, manifest, license/security scans, generated evals, human review, versioning/rollback.
- [ ] AB-001…AB-005 — Agent blueprint: role, Skill versions, model policy, capability scopes, data scope, budgets, approvals, dry-run/evals.
- [ ] AW-SK-001…AW-SK-005 — threat model и adversarial tests для imported Skills; inert-by-default scripts.
- [ ] AW-UI-001…AW-UI-002 — отображать реальные worker states/concurrency отдельно от inference slots.
- [ ] VERT-001 — универсальный pipeline «материал → Skill draft / Agent blueprint / Task template»; три типа артефактов не смешивать.
- [ ] VERT-002 — source spans/evidence сохранять на всех этапах преобразования.
- [ ] VERT-003 — не выполнять scripts и не наследовать права из Skill/Agent metadata.

**Artifacts:** PR #125 `AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md`; PR #128 `AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md`.

## C. Компактные модели / SLM — PR #125

- [x] SLM-001 — определить task-based bake-off вместо рейтинга по числу параметров; роли: classification/routing, structured extraction, reranking, summarization, memory candidate generation, Skill synthesis. **Artifact:** `docs/AGENT_MODEL_BAKEOFF_RU.md`, раздел “2026-11-02 — Task-based small-model evaluation contract”.
- [ ] SLM-002 — подготовить одинаковый RU/EN/TH golden set и схемы для каждого узкого сценария.
- [ ] SLM-003 — измерить cold load, RAM/PSS, VRAM, TTFT, p50/p95, tokens/sec, concurrency and cancellation на целевом хосте.
- [ ] SLM-004 — зафиксировать immutable model digest, quantization, tokenizer/template, runtime, code/weights/dataset licenses.
- [ ] SLM-005 — сравнить с main-only baseline и включать не более одного helper model за раз; default remains off until owner approval.

## C. Voice и audio generation — PR #129

- [ ] AUDIO-GEN-001…009 — исследовать Agent Audio; проверить модельные terms, hardware, WAV quality, latency, integration and security.
- [ ] AUDIO-UI-001 — разделить ASR, TTS/voice conversation, non-speech audio generation и post-processing.
- [ ] AUDIO-UI-002 — preview/accept/reject, artifact provenance, project attach only after explicit approval.
- [ ] AUDIO-SKILL-001 — описать media-production Skill с cue sheet, sound generation, audition, sync and export.
- [ ] AUDIO-SMALL-001 — сравнить компактные модели/backends с baseline на target hardware; не принимать parameter count за benchmark.

**Artifact:** PR #129 `LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md`. Agent Audio remains early-preview candidate; no install/download performed.

## D. Deep Research, local files, conversion, video — PR #130

- [ ] LSV-001…LSV-014 — browser permissions, local Source Vault, consent/storage modes, extraction, deletion lineage, screenshot-to-code, video workflows and archive policy.
- [ ] LSV-015 — capability matrix File System Access across desktop/mobile browsers.
- [ ] LSV-016 — fallback upload/drag-drop for unsupported browsers.
- [ ] LSV-017 — decide if persistent directory watchers require a local companion; no public filesystem endpoint.
- [ ] CONV-001 — compare Docling with existing parser on RU/EN/TH corpus and resource budgets.
- [ ] CONV-002 — validate screenshot-to-code quality with golden screenshots, no-execution review workspace.
- [ ] CONV-003 — define image→OCR/VLM, page→HTML/CSS, audio→transcript, video→frames/transcript workflows and provenance.
- [ ] VIDEO-001 — benchmark ComfyUI/Wan candidate only on suitable GPU hardware and with exact model/checkpoint license review.
- [ ] ARCHIVE-001 — upstream watchlist: exact versions, SHA-256, source/model/dataset licenses, dependencies, storage size and preservation reason.
- [ ] ARCHIVE-002 — mirror only after explicit approval and only when licenses/terms permit; never commit weights to Git.

**Artifact:** PR #130 `LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md`.

## E. Общие acceptance gates

- [ ] GATE-001 — classify each capability as current / partial / blueprint / not implemented using source code and tests.
- [ ] GATE-002 — threat model for local file access, untrusted documents, archive bombs, prompt injection, path traversal, malicious scripts and generated code.
- [ ] GATE-003 — verify code, model weights, tokenizer, voice, dataset and workflow licenses independently.
- [ ] GATE-004 — record actual disk/RAM/VRAM/latency/quality on target hardware; no extrapolation from model size.
- [ ] GATE-005 — add exact-head tests and update canonical project state after each bounded implementation stage.
- [ ] GATE-006 — require explicit owner approval before model downloads, runtime/dependency changes, external sync, destructive file operations, deployment or merge.

## Cross-links

- PR #131 — UI information architecture; main remains V1.
- PR #125 — Agent Studio / Skill Factory; Draft/HOLD.
- PR #128 — Agent Workforce / worker safety; Draft/HOLD.
- PR #129 — Voice / local audio generation; Draft/HOLD.
- PR #130 — Deep Research / local source vault and conversion; Draft/HOLD.

**Status:** new owner requirements indexed; no runtime implementation or model download is implied.
