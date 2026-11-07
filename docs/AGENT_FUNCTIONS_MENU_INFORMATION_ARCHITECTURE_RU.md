# aLandi — информационная архитектура меню функций и агентов

**Дата:** 2026-11-08  
**Контекст:** owner-directed PR #169, с сохранением проверенных UX-контрактов из PR #131. Документ — спецификация и карта управления; кроме текущего UI-среза §0, перечисленные будущие runtime-функции не считаются реализованными.

## 0. Аудит фактического UI на owner-directed PR #169 code/test HEAD 08a73a7 (branch only; not merged)

**Verified source snapshot:** main `c4f23e03f563d03213eb87002863da630fc8b833`; PR #169 code/test HEAD `08a73a7594695b8a74fa88d90db07832a8373665`. This is an implementation candidate, not a live/main release. The following menu details describe the current branch source; exact-head Quality/E2E must pass before status becomes VERIFIED.

### Top-level Functions menu — three actual actions

- **Agents / Structured analysis:** opens the existing Agent panel. Current implementation is a bounded four-stage sequential pipeline (planner → researcher → critic → synthesizer) on one selected model, conditionally invoked for suitable complex tasks. Team Blueprint may be saved, but it does not launch independent worker agents.
- **Deep Research:** opens a dedicated Deep Research settings panel (new in this PR). It reports current Quick/Thorough effort, current Web search breadth (standard/expanded/offline) and current structured-pipeline state. It provides actions to select Thorough, open the existing Web settings menu, or navigate to the Agents panel. The separate Research Studio is retired.
- **Skills / Task profile:** opens the chat-scoped task profile panel. Presets/custom instructions change task guidance and output style only; they do not grant tools, permissions, network access or data scope.
- **Integrations:** no external connectors are connected; placeholder switches and fake runtime states are absent.

### Agents panel — actual vs roadmap

- Actual: structured-analysis toggle, role/scenario blueprint fields and bounded configuration controls. The execution path remains the documented four-stage single-model pipeline.
- Blueprint-only/roadmap: independently scheduled workers, role-specific models, task queues/history, per-worker permissions/approval, durable recovery and true parallel orchestration. These must remain visibly SPECIFIED/DEFERRED until a real runtime contract, policy enforcement, traces and adversarial/eval gates exist.

### Deep Research panel — actual vs roadmap

- Actual: Quick/Thorough selector and summary, search-breadth status and navigation to existing search controls, pipeline status and navigation to Agents.
- Roadmap-only **Deep Research 2.0**: durable/resumable multi-step runs, source collections, evidence ledger, claim-to-citation validation, contradiction analysis, report artifacts and source refresh. This panel is configuration/navigation; it is not an independent research engine and does not imply a 12-stage state machine is implemented.

### Skills panel — actual vs roadmap

- Actual: chat-scoped Auto/Planning/Research/Code review/Data analysis/Agent systems/Multimodal/custom profiles, custom task instructions and current output-format controls. Profile changes are instructions only.
- Roadmap-only Skill Factory: source ingestion/evidence map, reusable SKILL.md package generation, provenance/license/security/evals/review/versioning and import/export. Imported skill content remains inert until separately approved; scripts never run on import/preview.

### Modal and regression contract

- All three panels share `functionPanelModal`, with the existing `backdrop-filter: blur(4px)` overlay. Close, Escape/outside click where supported, focus restoration, no stale overlay and 390×844 keyboard/touch behavior are acceptance.
- A Chromium E2E spec now opens Deep Research, changes effort, opens Web settings, navigates to Agents, and opens Skills while checking blur/clean-close. Exact-head result must be re-fetched; authored assertions alone are not verification.
- The four-group menu proposed in §2 below is a future IA expansion, not the current top-level menu. Only expose future items after real handlers, capability registry, status and permission evidence exist.

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
