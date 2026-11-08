# aLandi — информационная архитектура меню функций и агентов

**Дата актуализации:** 2026-11-08  
**Контекст:** текущий фактический UI на main 9033c6ad708a993cba5d1b27442f53651ad71c0f после PR #174; сохранены принципы PR #169 и owner override D-022. Документ разделяет работающие UI/handlers, blueprint/configuration и будущий runtime. Спецификация или внешний reference сами по себе не означают реализации.

## 0. Фактический UI на current main

**Verified source snapshot:** main 9033c6ad708a993cba5d1b27442f53651ad71c0f. PR #174 merged; Pages deployment #42430269181 SUCCESS; main Quality #42430269155 PASS (all 7 jobs, 114 Chromium tests, public root smoke 1/1 and landing Chromium 8/8); Freshness #42430269156, Graphify #42430269131 and Provenance #42430269144 PASS. The root client and /landing/ were verified by the post-merge workflow against this exact SHA.

### Top-level Functions menu — three actual actions

- **Agents / Structured analysis:** opens the existing Agent panel. Current implementation is a bounded four-stage sequential pipeline (planner → researcher → critic → synthesizer) on one selected model, conditionally invoked for suitable complex tasks. Team Blueprint is saved configuration; it does not launch independent worker agents.
- **Research / Deep Research:** opens the current research configuration/navigation panel. It reports Quick/Thorough effort, Web search breadth (standard/expanded/offline) and structured-pipeline state; it can select Thorough and navigate to the existing Web/Agents controls. The separate Research Studio remains retired.
- **Skills / Task profile:** opens the chat-scoped task profile panel. Presets/custom instructions change task guidance only; they do not grant tools, permissions, network access or data scope.
- **Integrations:** no external connectors are connected; placeholder switches and fake runtime states remain absent.

### Actual vs roadmap boundaries

- **Agents actual:** structured-analysis toggle and role/scenario blueprint fields; execution remains the four-stage single-model pipeline. **Deferred:** independent workers, scheduler, task queue/history, per-worker grants/approvals, sandbox and durable recovery.
- **Research actual:** settings/status/navigation only. **Deferred:** resumable multi-stage research runs, source collections, evidence ledger, claim-to-citation validation, contradiction analysis, source refresh and report artifacts.
- **Skills actual:** chat-scoped task profiles/instructions. **Deferred:** Skill Factory package creation, source-to-skill conversion, provenance/license/security/evals/review/versioning and import/export.
- **Notebook:** no notebook workspace, notebook persistence or notebook execution is currently exposed on main. Keep it out of the active menu until the local-first notebook MVP has real CRUD, save/restore and import/export handlers.

### Modal and regression contract

- All three current panels share functionPanelModal and the existing blurred backdrop. Focus-on-open, Tab/Shift+Tab containment, Escape/backdrop close, focus restoration and no stale overlay are tested in Chromium; native iPhone Safari/VoiceOver remains a manual acceptance item.
- The Functions disclosure uses native details/summary with real buttons, not an ARIA menu widget. Preserve native Enter/Space behavior; only adopt the full ARIA menu keyboard model if the product deliberately changes to that widget.
- Interactive mobile targets are designed at 44×44 CSS px where practical. WCAG 2.2 SC 2.5.8 AA requires 24×24 CSS px or sufficient spacing; 44px is the stronger project touch target, not the WCAG AA minimum.
- The expanded multi-group IA in later sections is a roadmap proposal. No placeholder controls, fake progress, connector switches or invented runtime states may be added.
## 1. Принцип представления возможностей

Каждая функция в меню обязана иметь явный статус:

- **Доступно** — есть реальный handler/runtime, разрешение, понятный результат и regression coverage.
- **Настраивается** — можно сохранить blueprint/профиль/шаблон, но выполнение ещё не подключено.
- **В разработке** — интерфейс показывает описание, ограничения и ticker `1ИV3ИT10И`; никаких фиктивных кнопок запуска.
- **Недоступно в этой среде** — функция существует, но не хватает модели, разрешения, локального runtime или аппаратного ресурса.

Ticker — декоративно-информационная индикация незавершённой функции, не progress indicator. Должен иметь текстовую альтернативу, уважать `prefers-reduced-motion`, не мешать screen reader и не быть единственным способом сообщить статус.

## 2. Предлагаемая структура «Функции»

1. **Агенты**
   - Мои агенты и профили
   - Профессии и роли
   - Команды и схемы делегирования
   - Шаблоны сценариев
   - Запуски, очередь и результаты
   - Политики, разрешения и бюджеты
2. **Навыки**
   - Каталог и мои навыки
   - Импорт из Agent Skills
   - Создать навык из источника
   - Проверка, версии и откат
   - Совместимость и зависимости
3. **Исследования**
   - Быстрый поиск
   - Глубокое исследование
   - Мои источники и коллекции
   - Evidence, цитаты и отчёты
   - Преобразование материалов в Skill/Agent blueprint
4. **Файлы и источники**
   - Прикрепить файлы
   - Выбрать локальную папку (если поддерживается браузером)
   - Сохранённые ссылки на локальные источники
   - Импорт в локальную базу знаний
   - Источники проектов и история происхождения
5. **Медиа и конвертеры**
   - Изображения → OCR/описание/структура
   - Скриншот/макет → черновик HTML/CSS
   - Аудио → транскрипт/метаданные
   - Текст → речь и генерация звуков
   - Видео → транскрипт/кадры/описание/черновой монтаж
6. **Модели и среды**
   - Основная модель и провайдер
   - Компактные помощники
   - Локальные runtimes
   - Ресурсы, лицензии и доступность
7. **Задачи и история**
   - Активные/ожидающие задачи
   - Требуют подтверждения
   - Завершённые/ошибки/отменённые
   - Артефакты и аудит действий

Разделы могут быть свёрнуты; наиболее частые действия остаются короткими и видимыми. Не создавать вторую копию уже существующих controls в Settings, composer или project sidebar.

## 3. Карточка агента

Каждая карточка содержит: название, назначение, статус, профиль/профессию, доступные навыки, выбранную модель (если известна), область данных, разрешённые инструменты, режим, лимиты, последнее подтверждённое действие и ссылку на историю.

### Режимы

- **Спросить** — обычный ответ одной модели.
- **Спланировать** — подготовить план/blueprint без side effects.
- **Исследовать** — собрать источники и evidence.
- **Выполнить** — только при подключённом runtime и разрешениях.
- **Проверить** — независимая проверка результата.
- **Пакетная задача** — очередь ограниченных однотипных задач, только после реализации durable queue.

Наличие роли или Skill не даёт прав на filesystem, network, shell, memory или внешние side effects.

## 4. Настройки агента

Разделять настройки по смыслу:

- **Идентичность:** имя, описание, профессия, версия профиля.
- **Задача:** цель, входные источники, ожидаемый формат и критерии завершения.
- **Модель:** provider, model ID/digest, контекст, output limit, fallback policy.
- **Навыки:** привязанные Skill IDs и версии.
- **Инструменты:** read/write/network/execute/memory scopes с отдельными разрешениями.
- **Данные:** текущий чат, выбранный проект, выбранные файлы/коллекции; никаких неявных cross-project grants.
- **Ресурсы:** token/tool/time budget, concurrency, RAM/VRAM estimates.
- **Контроль:** approvals, pause/resume/cancel, retry policy, retention.
- **Результат:** артефакты, citations, logs с redaction и проверка.

## 5. Skill workflow

Создание навыка из материала — это draft workflow:

`Источник → извлечение → проверка происхождения/лицензии → структура процедуры → Skill draft → тестовые вопросы → security review → ручное утверждение → версия`

Не запускать импортированные scripts автоматически. Не превращать произвольный текст в исполняемые полномочия. Agent blueprint и Skill — разные сущности: Skill описывает повторяемую компетенцию; Agent profile выбирает роль, модель, инструменты и policy.

## 6. Локальные файлы: понятные варианты

- **Выбрать файл/папку:** браузерный file picker и явное разрешение.
- **Перетащить/загрузить:** одноразовая передача выбранных файлов.
- **Ссылка на путь:** сохранять текстовый указатель/описание местоположения, но не обещать чтение по произвольному пути из браузера.
- **Локальная память:** отдельное согласие на копирование/индексацию в IndexedDB/OPFS или локальном companion; показывать квоту, источник и удаление.
- **Проектный источник:** только после реального scoped source API; до этого CRUD источников проектов не изображать как работающий.

File System Access API не одинаково доступен во всех браузерах. Handles могут требовать повторного разрешения после закрытия вкладок; любое чтение/запись должно оставаться пользовательским действием и проверять permission state.

## 7. Приёмка

- Для каждой строки меню есть реальный статус и владелец данных.
- Нет неработающих переключателей и фальшивых прогресс-баров.
- Все действия имеют loading/success/error/cancel/empty states.
- Keyboard, screen reader, touch, RU/EN, dark/light, reduced motion.
- Проверить 320/360/390/768/1024/1440 px.
- Новые runtime capabilities остаются в Future/Research PR, не в V1 UI slice.

## Источники для проектирования

- [File System Access API — Chrome Developers](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access)
- [FileSystemFileHandle — MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle)
- [Agent Skills specification](https://agentskills.io/specification)
- [BrowserSkill](https://github.com/Tencent/BrowserSkill) — референс видимых browser tasks и shared control.
- [screenshot-to-code](https://github.com/abi/screenshot-to-code) — референс screenshot/design-to-code, не готовая часть aLandi.

**Статус:** proposal/UX contract. Не доказывает наличие runtime-функций и не разрешает добавлять новые зависимости.


### Follow-up source change after initial audit

The latest menu slice moves the existing Research Studio entry out of the compact Functions menu (it remains available from Thorough mode), adds a roadmap-only **Deep Research 2.0** card under Research & Sources, and separates Research from Create/Transform roadmap cards into distinct containers. E2E assertions were updated to verify the 2-container / 1+4 card structure and that no fake Research Studio action remains in the menu. These assertions are authored but not executed in this session.


### Skills panel progressive disclosure — 2026-11-02

- The working chat-scoped task profile is now the primary configuration group, with its scope called out as “available · this chat only”.
- Goal and output format are explicitly labelled; the existing custom instructions and apply handler remain attached to the current chat.
- The shared Skill package library is a separate collapsed native disclosure with a read-only Details action. It documents the planned source → extraction → provenance/license → draft → tests → security review → manual approval → version lifecycle.
- Import does not imply filesystem, network, memory, shell or external-action permissions. Script execution remains unavailable until a separate runtime and permission model exist.
- RU/EN strings, 44px disclosure target, keyboard activation and nested ticker pause are covered by a new Playwright test. The test is authored, not executed; exact-head CI is not available yet.
- No API, runtime, dependency, shared registry, package import or script execution was added.


### Roadmap pause selector correction — 2026-11-02

The checkbox inputs are nested inside their visible labels. The previous CSS input-sibling selectors could not reach the following ticker containers. The selectors for Functions, Agents and Skills now use the containing `.roadmap-pause-control:has(input:checked)` label, matching the actual DOM. A Skills regression checks the computed paused animation state. Exact-head browser execution remains pending.


### Read-only roadmap detail windows — 2026-11-03

- Added 15 “Details / Подробнее” entry points across the five Functions roadmap cards, seven Agent/Skills roadmap sections, saved Team Blueprint library, Project Sources and Integrations.
- All entry points use one shared accessible modal. It reads the localized title/description from the existing section, displays a status, supports Escape/backdrop/close, participates in the existing browser modal history/focus trap and restores focus to the invoking control.
- Status mapping supports Available, Blueprint only, In development and Unavailable in this environment. Current markup assigns only In development to roadmap cards and Blueprint only to the local Team Blueprint collection; no status is inferred from a ticker alone.
- Added Agent Profiles and Tasks & History as collapsed roadmap-only sections. No profile registry, durable AgentRun API, queue, worker, execution, permission or artifact API was added.
- Normalized visible app and marketing-page ticker prefix to `1ИV3ИT10И`; existing pause and reduced-motion behavior remains in place.
- App E2E spec contains 121 tests; landing E2E spec contains 8. Assertions are authored, not executed. Static V8 parsing, CSS brace balance, unique HTML IDs and RU/EN translation-key checks passed.
- Exact code/test HEAD: `dc82acb95c850d7821e071e16a8ab11524a459c2`. GitHub returned zero workflow runs and zero commit statuses; no browser/Quality pass is claimed.
- No runtime, API, dependency, permission or deployment changes. PR #131 remains open/unmerged and mergeable=false due the shared V1 checklist conflict; no rebase/synchronization/merge/deployment.


## 8. Landing UI 2.0 — настоящий Agent Workforce boundary (2026-11-03)

PR #128 is the canonical research/specification home for the durable AgentRun/task-board/worker runtime and the owner-source review. The Functions/Agents menu in PR #131 must remain consistent with its contracts:

- Current four-stage planner/researcher/critic/final pipeline is a sequential flow using one selected provider/model; it must not be marketed as independent multi-agent execution.
- Team Blueprint is local configuration only; role/profession count is not active worker count.
- Display separate values for logical profiles/tasks, queued/running workers, and actual provider/model inference slots.
- Runtime menu entries are enabled only after durable AgentRun API, scoped grants, cancellation/approval, event/artifact provenance and tests exist.
- Worker card metadata should explain task goal, model route (when known), exact Skill versions, data scope, allowed tools, token/tool/time budget, state, validator and artifact refs. Never expose hidden chain-of-thought.
- Small model choices are task-class routing policy behind golden-set evals, not a static “best small models” list. Route only if quality/privacy/latency/RAM/cost improves against baseline.
- Harness adapter concepts from Worktrunk/Goose/ECC/SWE-agent and model-provider patterns from dsh-our-free-model are reference-only; PR #131 introduces no dependency or runtime execution.
- Preserve progressive disclosure and concise toolbar. Actual run history/queue is a future dedicated surface, not an inert toggle in existing Settings.

**Runtime checkpoint:** PR #134 now contains an offline file-backed AgentRun/task lifecycle persistence prototype on a branch from `main`; its tested payload/result contract accepts bounded scalar metadata and reference lists only. This does **not** provide a durable AgentRun API, authenticated scope grants, real workers, tool execution, approvals, artifact registry/validator or UI run controls.

Acceptance is owned by PR #128 research/eval contracts plus PR #134 prototype review. No runtime controls should be exposed by this UI architecture note until the missing API/permission/execution contracts are implemented and tested.

## 9. Owner increment — Notebook, Knowledge-to-Skill and expanded Functions (2026-11-08)

This section consolidates the current owner direction with existing task IDs; it does not create a second backlog or claim implementation.

### 9.1 Notebook — first-class local workspace

**Purpose:** one place to collect, read, analyse, and progressively transform project knowledge. Notebook is a workspace, not just a code editor and not a second chat history.

**Initial information architecture**
- **Notebook list:** personal notebooks and notebooks scoped to the selected project; search, sort by title/updated time, create, rename, duplicate, export, archive/delete with confirmation.
- **Notebook workspace:** title + scope breadcrumb; ordered cell list; central editor; add/move/collapse cell; autosave state; import/export; visible source/evidence inspector.
- **Cell types in aLandi:** markdown, code, source, evidence. Source/evidence are aLandi extensions; standard Jupyter cells remain Markdown, Code and Raw. Preserve custom type/provenance in namespaced notebook metadata or an explicit sidecar; do not invent non-standard Jupyter cell types.
- **Evidence view:** excerpt/claim, exact source locator (URL + page/line/anchor/timestamp), captured/fetched time, source hash when available, and scope. A citation must resolve to its source, not only display a decorative URL.
- **Import/export:** validate a bounded Jupyter .ipynb JSON file; map standard Markdown/Code/Raw cells; preserve supported notebook metadata; show unsupported outputs or attachments instead of silently dropping them. Native aLandi backup/export retains project/scope/evidence metadata.
- **Local storage:** IndexedDB is the first browser-local persistence candidate. Personal and project scopes must be separated, quotas/errors surfaced, and deletion/rollback tested. A local notebook must not silently upload source content to a remote provider.
- **Initial execution boundary:** code cells are inert text. Do not route them through the current main-thread Pyodide execution path. First deliver editing, persistence, source/evidence cells and export/import. A later isolated execution slice needs a module Web Worker, bounded wall-clock time, user-visible cancellation/termination, output limits and an explicit network/import policy. A Worker separates execution from the page's main thread; it is not by itself a complete security sandbox.

### 9.2 Notebook layout and interaction

- Desktop: compact notebook outline/list pane, central cell canvas and contextual inspector for sources/evidence; panes can collapse without losing cell order or focus.
- Mobile: one-column navigation; notebook list → notebook → cell editor/inspector; Back returns exactly one navigation level. No desktop-only hover requirement.
- Primary actions: New notebook, Add Markdown, Add Code, Add Source, Add Evidence, Import, Export and Search. Keep cell actions contextual (move up/down, duplicate, delete) rather than permanently filling the toolbar.
- Autosave must expose Saving / Saved / Error using the actual IndexedDB result; a failed write must not show success. Keep a visible retry path and preserve the unsaved draft until recovery.
- Keyboard: deterministic Tab order, visible focus, Enter/Space for native disclosures, Escape for transient overlays, no focus loss after cell insertion/deletion, and screen-reader labels for reorder/delete actions.
- Touch: preserve 44×44 CSS px primary controls, no horizontal overflow at 320px, account for software keyboard and safe areas. 44px is a project usability target; WCAG 2.2 AA SC 2.5.8 is 24×24 CSS px or a spacing exception.

### 9.3 Knowledge-to-Skill — book/document to private Skill draft

The user-facing wizard belongs under **Functions → Skills → Create from source** once the end-to-end draft lifecycle is real. Its source selector must accept only formats for which a tested parser exists; it must not promise arbitrary file/folder access.

Select source → consent/rights → MIME/size validation → bounded extraction → chapters/sections → source-span map → transformed Skill draft → schema/provenance/license/security review → eval questions → human approval → version.

- Keep original source identity separate from its bytes: reference-only URL/path, attach-for-this-task, or explicit local copy/import. Record owner, source URL/path, MIME, size, timestamps and hash; preserve page/section/line locators.
- Generate a concise procedure/knowledge representation, not a copy of the book. Do not emit long verbatim source passages. Require the user's authority to process the material; keep Skills derived from third-party copyrighted books private unless redistribution rights are verified.
- Output an Agent Skills package with a validated SKILL.md frontmatter (name, description) and focused references as needed. Treat allowed-tools as experimental format metadata, never as an authorization grant.
- Imported and generated content is untrusted. Indirect prompt injection can be hidden in web pages, source docs, code comments, metadata and attachments. Keep it separate from trusted system rules; validate permissions in application code; do not rely on regex/prompt scanning alone.
- First versions contain no executable scripts; import/preview never runs code. A later script capability requires explicit manifest, static review, sandbox, approvals and adversarial tests.
- Show a provenance/diff view before approval: source spans, generated claims, missing evidence, parser warnings, license state, injection/security findings and eval results. Support version history, rollback, export and deletion/retention.
- A Skill is a reusable instruction/procedure package, not an Agent, model, credential, connector or permission set.

### 9.4 Agent Builder — blueprint before runtime

The builder may create a configuration artifact only after the relevant editor/validation is implemented:

Scenario → Goal → Role → Skills (exact versions) → Model policy → Tool scope → Data scope → Budget → Approval policy → Evaluation → Blueprint.

- Every blueprint field is descriptive until a real executor and authorization service enforce it.
- Display logical profiles/tasks separately from actual running workers and inference slots.
- Do not enable independent worker execution until typed task contract, durable AgentRun state, scoped capability grants, idempotency, cancellation, approval-bound side effects, sandbox, event/artifact provenance and failure-injection tests exist.
- Current four-stage pipeline stays labelled **Structured analysis**, not “independent agent team”.

### 9.5 Deep Research — quick controls vs research run

- **Quick / Thorough** controls effort and tool-loop budget. **Web breadth / Offline** independently controls web access and result breadth. **Structured analysis** controls the existing four-stage pipeline. A Skill profile changes instructions only. No selector may silently change another dimension.
- The current Research panel remains settings/navigation. A true Deep Research run needs plan, source allowlist, fetch status, evidence ledger, claims, citation validation, contradiction/gap analysis, freshness refresh, cancellation/resume, budgets, report artifacts and a truthful event timeline.
- Do not restore Research Studio under another name. Integrations remain hidden until a real connector registry, scopes, status and action handlers exist.

### 9.6 Progressive-disclosure Functions navigation

The future drawer is a compact disclosure → section landing → real tools → detail/workspace flow. Back returns one level; active project/chat context stays visible. Suggested groups:

1. **Agents:** Structured analysis (available); Agent Builder (blueprint only); independent worker runs (deferred until runtime).
2. **Research:** Quick/Thorough, web breadth, source collections, evidence/citations and Research runs (separate actual vs deferred states).
3. **Skills:** current task profile; Skill library; Create from source; version/review/import/export.
4. **Notebook:** notebook list, new notebook, source/evidence cells, import/export; code execution stays disabled until its isolated runtime exists.
5. **Sources & media:** attach/reference/import distinction and only implemented parsers/converters. Do not duplicate existing composer attachment or project-settings actions.
6. **Settings:** route/model, web access, privacy/data scope, permissions, appearance and language. Each setting has one canonical control and one source of truth.

The current three-action Functions menu is the verified delivered subset. Add a future group only when its first usable handler, state lifecycle, error path and E2E contract exist; do not add empty buttons or fake status switches.

### 9.7 Source-based architecture decisions — 2026-11-08

- [JupyterLite storage configuration](https://jupyterlite.readthedocs.io/en/stable/howto/configure/storage.html) documents persistent IndexedDB storage as the usual browser driver and warns that memory-only storage is volatile. Borrow the storage principle, not a full JupyterLite runtime without a bundle-size/compatibility evaluation.
- [JupyterLite file workflow](https://jupyterlite.readthedocs.io/en/stable/quickstart/using.html) confirms browser-local IndexedDB files and browser quota limits. Test quota/eviction behavior on supported browsers before choosing import limits.
- [Jupyter notebook format](https://nbformat.readthedocs.io/en/latest/) defines notebooks as JSON with cells, text/source, outputs and metadata. Use it for interoperability; put aLandi-only source/evidence types in namespaced metadata or a sidecar.
- [Pyodide Web Worker guidance](https://pyodide.org/en/latest/usage/webworker.html) states that long synchronous work on the main browser thread can make the UI unresponsive and that a module Worker runs in a separate global context. Worker isolation does not itself define the aLandi permission/network sandbox.
- [Agent Skills specification](https://agentskills.io/specification) defines the portable SKILL.md package and progressive disclosure. The experimental allowed-tools field is not runtime authorization.
- [OWASP LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) documents indirect injection via retrieved documents/web pages/attachments and recommends controls at execution/tool boundaries; filtering alone is insufficient.
- [W3C APG disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) supports Enter/Space disclosure activation; [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) defines the 24×24 CSS px AA minimum with exceptions.
- [book-to-skill v1.3.0](https://github.com/virgiliojr94/book-to-skill/releases/tag/v1.3.0) is an external implementation reference only. Upstream tag commit: e087255f187c4fd3a5cdbb1cf1a11e09cdb84b46 (GitHub commit verification reports false); repository metadata declares MIT and README says the MIT license covers the converter, not any source book. Release notes claim injection/invisible-Unicode and parser hardening; those are upstream self-reports, not aLandi verification. Borrow the workflow/checklist, not its code or claims.

**Status:** Notebook MVP, Knowledge-to-Skill runtime, Agent Builder and Deep Research 2.0 remain **SPECIFIED / DEFERRED**. The immediate implementation slice is the existing UX-040 project-scoped Chat list, tracked in docs/MASTER_TASK_REGISTRY_RU.md; no notebook runtime or source converter is claimed by that slice.