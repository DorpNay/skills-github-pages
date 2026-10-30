# Deep Research 2.0 — scope, research plan and acceptance contract

**Дата:** 2026-10-31  
**Workstream:** RESEARCH / FUTURE — отдельный от Landing V1, Voice 2.0 и Agent Studio 2.0.  
**Merge policy:** HOLD. Этот PR не предназначен для обычного merge в main.

## Цель и порядок исследования

Спроектировать возобновляемую исследовательскую систему, которая работает с вебом и локальными материалами пользователя, сохраняет проверяемые результаты, продолжает работу между сессиями и не теряет происхождение данных.

Источники проверяются строго в следующем порядке:

1. Ранее найденное совместно с владельцем: старые списки проектов, ссылки, сравнительные таблицы, принятые решения и результаты прежних исследований.
2. Материалы текущего репозитория: SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md, AGENT_ORCHESTRATION_RESEARCH_RU.md, EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md, ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md, MEMORY_RETENTION_AND_SYNC_AUDIT_RU.md, USER_REQUEST_CHECKLIST.md, V016_IMPLEMENTATION_CHECKLIST.md, IMPLEMENTATION_ROADMAP_RU.md, ACCEPTED_IMPROVEMENTS.md, PROJECT_STATE.yaml, tests and actual code.
3. Источники, ранее предоставленные владельцем: сверять по истории проекта и первичным URL; неподтверждённое происхождение отмечать unknown, не приписывать владельцу.
4. Независимый поиск: актуальные официальные upstream repositories, specifications, original papers, model cards, licenses and maintainer documentation. Vendor claims, independent evaluations and aLandi measurements — разные классы доказательств.

Ни один проект/модель/библиотека не становится production dependency только из-за попадания в обзор.

## 1. Deep Research 2.0 — это не просто длинный web search

Целевой workflow:

1. принять вопрос, ограничения, язык, приватность и deliverable;
2. классифицировать задачу: web / local sources / mixed / exact lookup / comparative research;
3. построить план и независимые проверяемые подзапросы;
4. выбрать источники и адаптеры по allowlist, дате, лицензии и privacy scope;
5. получить metadata, fetch content and preserve raw source identity;
6. извлечь текст, таблицы, страницы, кадры, timestamps, code symbols and typed evidence;
7. построить evidence ledger с provenance and source excerpts;
8. сгруппировать claims, найти противоречия, пробелы и устаревшие утверждения;
9. выполнять дополнительные поиски только для нерешённых claims;
10. проверить claim-to-evidence и citations;
11. создать report с методикой, источниками, ограничениями и воспроизводимостью;
12. сохранить run state, запросы, источники, артефакты и незакрытые вопросы для resume.

Это целевой контракт, а не заявление, что все 12 этапов уже реализованы.

## 2. Источники и адаптеры

- Web: search, fetch, canonical URL, publication/update/fetch time, domain and availability.
- Local files: выбранные файлы/папки, PDF, Office, Markdown, code repositories, images, audio and video.
- Project collections: project files, notes, chat exports, prior reports and approved memory.
- Connected services: Drive/Dropbox/GitHub/etc. только через явный OAuth/connector scope и выбранные ресурсы.
- Repositories: Git ref/commit SHA, file path, line ranges, symbol references, license and manifests.
- Media: image/frame/audio segment with timestamp/page/bounding-box provenance.

Каждый source record содержит source ID, origin, owner/scope, content hash, media type, size, timestamps, parser/model versions, license constraints, extraction status and deletion lineage.

## 3. Могут ли источники проектов оставаться на устройстве?

**Да, частично — уже в рамках browser-first архитектуры. Для надёжной работы с произвольными папками и между устройствами потребуется local companion или desktop runtime.**

### Browser-only

- Пользователь выбирает файл/папку через picker; скрытого доступа к файловой системе нет.
- Где поддерживается, File System Access API может хранить разрешённый handle на оригинал без копирования его в удалённый сервис.
- IndexedDB/OPFS могут хранить локальные индексы, metadata и выбранные derived artifacts.
- Локальный parser/indexer сохраняет байты на устройстве, если обработка действительно выполняется локально.
- Permission может истечь/быть отозван; handle ломается при перемещении файла; quota зависит от браузера/профиля; private mode и потеря устройства — риски.
- Статический Pages-сайт не может незаметно индексировать любые папки, следить за изменениями при закрытом браузере или гарантировать постоянный доступ.
- Remote provider не получает source bytes без явного согласия и объяснения, какие данные покидают устройство.

### Local companion / desktop

Небольшой подписанный companion может дать постоянный connector: разрешённые пользователем root folders, filesystem watcher, стабильные IDs/hashes, incremental indexing, локальные OCR/ASR/parser workers и authenticated localhost API. Оригиналы могут оставаться на месте; aLandi получает только запрошенные evidence/derived text.

Security: explicit folder grants, path allowlist, запрет путей из model output, symlink traversal protection, file sniffing, bounded extraction, zip-bomb protection, loopback-only binding, origin/CSRF checks, revocation and audit log.

### Между устройствами

Локальный path/handle на Device A не делает файл доступным на Device B. Возможны local-only; encrypted sync выбранных bytes/index; sync только metadata/hash с повторным подключением локальной копии; явный gateway/connector import. Пользователь должен видеть, на каком устройстве есть байты и какая копия authoritative.

## 4. Память: хватает ли её для всех целей?

Ёмкость памяти нельзя измерить одним числом токенов. Важнее recall правильного факта из правильного scope с provenance, учётом обновлений, конфликтов и удаления.

Слои: active conversation state; project memory/instructions; user/global facts; reviewed procedural memory; source vault/evidence ledger; run/artifact history. Исследовательские документы не превращаются автоматически в пользовательскую память.

Метрики: recall@k, precision@k, citation precision, answer-support rate, stale-fact and contradiction detection, cross-project leakage (должен быть 0), deletion propagation across indexes/evidence/summaries/caches/backups, recovery success, data-loss rate, p50/p95 latency, index size, RAM/disk, long-session behavior at 1k+ messages.

Существующие аудиты прямо не подтверждают полную синхронизацию, системное удаление и отсутствие потерь. Нельзя обещать unlimited memory. Оригиналы сохраняются неизменными; summaries versioned and source-linked; compaction must be auditable.

## 5. Локальная uncensored-модель и поведение остальных модулей

Локальная модель может иметь другое поведение отказов, чем hosted provider. Платформа не должна незаметно добавлять произвольный content-style refusal layer только потому, что модель локальная или self-hosted.

Но «uncensored model» не означает unrestricted platform:
- разделять модельные отказы, продуктовую content policy, platform security, authorization and side-effect controls;
- пользовательские policy profiles могут настраивать тон, предпочтения и обработку benign topics в пределах допустимой политики;
- tool permissions, filesystem/network access, secrets, code execution, payments, publishing and deletion остаются capability-scoped and approval-gated;
- prompt injection из web/files — недоверенные данные, не policy;
- модуль не может сам повысить свои права, сославшись на uncensored model;
- сохраняются необходимые legal, privacy, safety and abuse-prevention boundaries.

Цель: **никакой произвольной скрытой цензуры, добавленной адаптерами**, но не отмена контроля доступа и security safeguards. Нужны policy matrix и false-positive/refusal tests.

## 6. Смежные вертикали — аудитировать отдельно, не смешивать

### Image / video generation

- Разделить image understanding/OCR, image generation/editing, video understanding и video generation.
- Текущий roadmap рассматривает ComfyUI как локальный workflow reference и hosted image APIs как server-side adapters; production backend генерации не выбран.
- В roadmap отмечено закрытие Sora 2/Videos API (2026-09-24); среди предыдущих кандидатов — Runway Gen-4.5, Luma Ray 3.2, Google Veo 3.1. Перед реализацией перепроверить доступность, цену, регион, data terms and exact model version.
- 8GB CPU VPS не считать media inference host. Локальный ComfyUI требует отдельного GPU/VRAM benchmark и проверки лицензий.
- Media jobs: async queue, progress, cancel, retry, input/output hashes, provenance, retention and explicit remote-processing consent.

### AI coding

- Документы проекта описывают planner → implementer → independent reviewer → tests и упоминают Muse Code/OpenCode/Dyad как кандидатов/референсы.
- Это не доказательство наличия безопасного autonomous coding runtime.
- Оценка: repo understanding, patch correctness, test pass rate, regressions, tool efficiency, cost, latency, review quality and interrupted-run recovery.
- Coding sandbox отдельно от обычного чата: ephemeral worktree/container, scoped paths, no secrets by default, network off by default, explicit approval for dependency installs, external network, deployment and destructive actions.
- Код агента недоверенный до независимого review and tests.

### Voice 2.0

Voice models, streaming, diarization, TTS and transliteration принадлежат отдельному PR #129. Deep Research может индексировать разрешённые транскрипты и research artifacts, но не дублирует Voice runtime design.

### Agent Studio 2.0

Worker pools, professions, swarms, durable AgentRun and tool execution принадлежат отдельным Agent Studio/Future PRs. Deep Research использует bounded orchestration contracts, но не переопределяет платформу агентов.

## 7. Подтверждённый repository baseline (не production claims)

- SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md уже описывает quick search, deep research, search-my-materials, provenance, query logs, evidence, claims and project-scoped research artifacts.
- IMPLEMENTATION_ROADMAP_RU.md предлагает 12-stage deep research state machine; полноту реализации нужно проверить по текущему коду и тестам.
- Memory design описывает conversation/project/global/procedural scopes и SQLite FTS5 + graph prototypes; cross-device sync, full source vault, deletion lineage and long-term reliability остаются открытыми.
- MEMORY_RETENTION_AND_SYNC_AUDIT_RU.md предлагает IndexedDB/OPFS local-first storage, FileSystemHandle references, content hashes, source vault and optional gateway/Drive sync.
- Roadmap разделяет media generation and understanding, описывает ComfyUI/API adapters, но production generator не выбран.
- Agent/memory design содержит coding workflow, но не подтверждает production-grade sandbox.
- USER_REQUEST_CHECKLIST.md сохраняет генерацию изображений и полную индексацию project sources среди открытых требований.

Следующий аудит обязан проверить actual current code and tests прежде чем назначать статусы. Документ с планом не является доказательством реализованного поведения.

## 8. Acceptance gates

- Каждый существенный claim привязан к retrievable evidence или явно помечен unsupported/unknown.
- Citation ведёт к точному URL/commit/page/line/timestamp.
- Противоречащие источники показываются, не усредняются.
- Research run воспроизводим и возобновляем после прерывания.
- Есть режимы web-only, local-only, mixed and remote-with-consent.
- Local-only test доказывает нулевую отправку source content наружу.
- Cross-project/global scope isolation tests проходят.
- Удаление источника распространяется на derived records либо показывает, какие копии остались.
- Инструкции из импортированных документов никогда не исполняются как policy; prompt-injection corpus проходит.
- Нет неподтверждённых заявлений о live access, exhaustive search или доступности источника.
- Этот PR не меняет Landing V1 runtime/stack.

## 9. Task ledger

- [ ] DR2-001 — восстановить ранее предоставленные владельцем research links и provenance.
- [x] DR2-002 — инвентаризировать repository research, memory, local-source and multimodal docs.
- [ ] DR2-003 — проверить actual search/research UI и Gateway code; разделить implemented/planned.
- [ ] DR2-004 — аудит source ingestion, local storage, index and citation lineage.
- [ ] DR2-005 — проверить browser File System Access, OPFS and IndexedDB на целевых браузерах.
- [ ] DR2-006 — оценить local companion/desktop connectors and threat model.
- [ ] DR2-007 — сравнить notebook/research workspace проекты и source adapters по первоисточникам.
- [ ] DR2-008 — сравнить hybrid lexical/vector retrieval с SQLite FTS5 до добавления vector store.
- [ ] DR2-009 — определить claim/evidence schema and citation-validation golden set.
- [ ] DR2-010 — специфицировать resumable 12-stage Research run: deadline, cancellation, idempotency, bounded concurrency.
- [ ] DR2-011 — RU/EN/TH research golden set, source freshness and contradiction tests.
- [ ] DR2-012 — аудит memory recall, scope isolation, stale facts, conflicts, deletion and long-session capacity.
- [ ] DR2-013 — оценить local memory/index size and performance на target devices; определить практические пределы.
- [ ] DR2-014 — data-flow режимов local-only / mixed / remote-with-consent.
- [ ] DR2-015 — policy matrix: model refusals vs content policy vs platform security vs tool permissions.
- [ ] DR2-016 — false-positive/false-refusal and tool-authorization tests; no hidden adapter censorship.
- [ ] DR2-017 — image-generation candidates: ComfyUI/local GPU vs hosted APIs, licenses, cost, region, privacy.
- [ ] DR2-018 — video-generation candidates and async job APIs; не использовать retired endpoints.
- [ ] DR2-019 — AI coding assistants/agents and isolated coding sandboxes.
- [ ] DR2-020 — source inventory, decisions, risk register and staged implementation roadmap.
- [ ] DR2-021 — подготовить отдельные минимальные implementation PR после owner review; никаких production dependencies в этом PR.

## 10. Материалы для сверки

- docs/SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md
- docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md
- docs/AGENT_ORCHESTRATION_RESEARCH_RU.md
- docs/ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md
- project-reference/MEMORY_RETENTION_AND_SYNC_AUDIT_RU.md
- docs/MULTIMODAL_MODEL_STACK_RU.md
- docs/IMPLEMENTATION_ROADMAP_RU.md
- docs/USER_REQUEST_CHECKLIST.md
- docs/V016_IMPLEMENTATION_CHECKLIST.md
- docs/ACCEPTED_IMPROVEMENTS.md
- docs/PROJECT_STATE.yaml

**Status:** research baseline only. No runtime, dependencies, model weights, credentials, endpoints or deployment changed.
