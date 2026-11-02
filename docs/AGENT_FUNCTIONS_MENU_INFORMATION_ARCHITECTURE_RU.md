# aLandi — информационная архитектура меню функций и агентов

**Дата:** 2026-11-02  
**Контекст:** PR #131, Landing UI V2.0. Это UX-контракт и будущая карта управления, а не утверждение, что перечисленные runtime-функции уже реализованы.

## 0. Аудит фактического UI на PR #131 HEAD 853a377

Проверены `index.md`, `assets/js/app.js`, `assets/css/app.css` и существующие Playwright specs. Значительная часть запрошенной структуры уже реализована; её нужно развивать, а не дублировать.

### Уже присутствует в коде

- Меню Functions разделено на четыре группы: работа с задачей, исследование и источники, создание и преобразование, подключения.
- Реальные пункты: structured workflow, task profile и integrations status. Research Studio запускается из блока Thorough; в меню «Исследование и источники» теперь показан roadmap-only пункт «Глубокое исследование 2.0».
- Roadmap items с `1ИÆИT10И`: Deep Research 2.0, локальные файлы/папки, конвертеры/извлечение, Knowledge-to-Skill/Agent, аудио/изображения/видео. Research и Create/Transform items размещены в двух отдельных контейнерах под соответствующими group labels.
- Agent panel: execution mode, team blueprint (size/scenario/role preset), custom scenario/roles, use cases, 64 logical professions, orchestration modes, models/resources, permissions/capabilities. Future capability sections are grouped into three native disclosures (use cases/roles; orchestration/models/resources; tools/permissions), collapsed by default with 44px keyboard/touch summaries and RU/EN labels.
- Skills panel: chat-scoped task profiles, custom instructions, quiz selection and roadmap for shared versioned library/import/validation.
- Для current pipeline явно сказано, что четыре этапа выполняются одной выбранной моделью; независимые agent processes не запускаются.
- Есть pause controls, reduced-motion handling, bilingual labels and non-runtime disclaimers.

### Agent panel progressive disclosure update — 2026-11-02

- Wrapped the five existing capability sections into three native `details/summary` groups: use cases and roles; orchestration, models and resources; tools and permissions.
- Groups start collapsed to keep the configuration panel scannable; each summary has a 44px minimum touch target and visible keyboard focus. Native disclosure semantics provide keyboard interaction without custom JS state.
- Added RU/EN labels. The roadmap pause selector now targets tickers nested inside the disclosure groups.
- The two real configuration groups (execution mode and team blueprint) remain separate and unchanged. No runtime capability or permission was added.
- Playwright coverage now checks group count/order, RU labels, 44px summary hit targets, Enter/Space open/close behavior and that the pause checkbox pauses a ticker nested inside an opened disclosure. Execution on current HEAD is pending.

### Existing regression coverage (tests authored, not a claim of current execution)

`tests/e2e/app.spec.mjs` already contains coverage for:
- four function-menu groups and RU/EN labels;
- two agent configuration groups and five future sections;
- ticker presence and non-runtime messaging;
- reduced-motion and pause behavior.

### Gaps to continue

1. Расширить каталог из blueprint в управляемый registry: роли/профессии, agent profiles, Skill versions, model policy and capability scopes.
2. Не путать team blueprint slider with actual team concurrency; label must remain explicit until durable workers exist.
3. Отделить task profile from reusable/importable Skill package library.
4. Разложить будущие пункты на nested categories without turning the compact toolbar into a long flat menu.
5. Добавить explicit status taxonomy and data/provenance/permission details where they become backed by real handlers.
6. File System Access, persistent source vault, universal converters, Knowledge-to-Skill and media generation remain roadmap-only.
7. Run current exact-head Playwright/Quality and visual/mobile/assistive-technology acceptance before claiming pass.


## 1. Принцип представления возможностей

Каждая функция в меню обязана иметь явный статус:

- **Доступно** — есть реальный handler/runtime, разрешение, понятный результат и regression coverage.
- **Настраивается** — можно сохранить blueprint/профиль/шаблон, но выполнение ещё не подключено.
- **В разработке** — интерфейс показывает описание, ограничения и ticker `1ИÆИT10И`; никаких фиктивных кнопок запуска.
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
- The shared Skill package library is a separate collapsed native disclosure. It documents the planned source → extraction → provenance/license → draft → tests → security review → manual approval → version lifecycle.
- Import does not imply filesystem, network, memory, shell or external-action permissions. Script execution remains unavailable until a separate runtime and permission model exist.
- RU/EN strings, 44px disclosure target, keyboard activation and nested ticker pause are covered by a new Playwright test. The test is authored, not executed; exact-head CI is not available yet.
- No API, runtime, dependency, shared registry, package import or script execution was added.


### Roadmap pause selector correction — 2026-11-02

The checkbox inputs are nested inside their visible labels. The previous CSS input-sibling selectors could not reach the following ticker containers. The selectors for Functions, Agents and Skills now use the containing `.roadmap-pause-control:has(input:checked)` label, matching the actual DOM. A Skills regression checks the computed paused animation state. Exact-head browser execution remains pending.
