# aLandi — остаток UI/UX polish (единый реестр)

**Сверка:** 2026-11-02  
**Рабочая ветка:** PR #131 — aLandi Landing UI v2.0.  
**Основной список владельца:** V1_UI_FINALIZATION_RU.md, раздел 8.0 и требования 8.1–8.17.  
**Технические статусы и evidence:** LANDING_UI_V2_IMPLEMENTATION_RU.md.

Этот файл больше не является самостоятельным вторым backlog. Он повторяет только текущие остаточные проверки из основного документа. Закрытые задачи PR #115–121 не возвращать в работу без нового воспроизводимого дефекта. PR #131 остаётся открытым; merge/deploy запрещены без явного разрешения владельца.

## Наследуемые UI-задачи до раздела 8 — актуальный остаток

Старые разделы 1–7 не открываем заново целиком: ниже только пункты, которые остаются полезными после сверки с текущим кодом и объединены с 8.1–8.17.

| Направление до раздела 8 | Что ещё действительно нужно довести | Объединённые пункты | Решение в текущем проходе |
|---|---|---|---|
| Общая визуальная цельность | Финальный ритм типографики/отступов, empty/error states, контраст реальных поверхностей и скриншоты на брейкпоинтах. | 8.2, 8.10, 8.15–8.17 | Сверяю общие токены и семантические состояния; не переписываю уже оформленные компоненты. |
| Composer и мобильная навигация | Поведение VisualViewport, safe-area, top/bottom composer, вложенный scroll и удержание позиции при длинном чате. | 8.2, 8.6, 8.9, 8.14 | Сохраняю реализованное удержание scroll; нативную iOS-приёмку оставляю отдельным ручным gate. |
| Маршруты и провайдеры | RU/EN, legacy route migration, сохранение модели, auth/catalog failures и отсутствие cross-provider fallback. | 8.3, 8.11 | Довожу единую терминологию aServi и отделение от third-party provider. |
| Поля и серверные статусы | Inline validation, timeout/CORS/401/5xx, stale response, реальный completion + health и secret redaction. | 8.3, 8.9, 8.15, 8.17 | Уже добавленные проверки aServi сохраняю; далее закрываю только отсутствующие контракты/состояния. |
| System prompt и инструменты | Пустой default, legacy migration, безопасное редактирование, Tavily key lifecycle и keyless fallback. | 8.4, 8.10, 8.16 | Сохраняю пустой prompt и не удаляю Tavily без проверки реального fallback/adapter. |
| Модальные окна и длинный контент | Escape/Back/Forward, focus return, scroll lock, большие списки/сообщения/вложения и popover у краёв. | 8.1, 8.6, 8.9, 8.10 | Довожу общие lifecycle-паттерны; не возвращаю закрытые задачи PR #115–121. |
| RU/EN и темы | Полная локализация меню, диалогов, статусов, ошибок, подсказок и empty states в light/dark. | 8.11, 8.15, 8.17 | Сверяю словарь и семантические состояния; оставшиеся визуальные проверки — после реализации. |
| Research / Agents / Skills / Connectors | Сохранение draft/settings, mobile/Escape, честное описание pipeline и только реально доступные runtime сущности. | 8.6, 8.15, 8.16 | Не добавляю фиктивные агенты/коннекторы и не расширяю runtime в рамках UI PR. |

### Что уже взято в этот совместный проход

- Единая терминология **aLandi aServi** в интерфейсе, DOM-контрактах E2E и документации. `aLandi aCloudi` остаётся зарезервированным возможным названием отдельного хранилища данных. Старые `localStorage`-ключи `ai_alandi_cloud_*` сохранены как compatibility contract, чтобы не потерять существующие подключения.
- Перенос крупного inline runtime из index.md в cacheable assets/js/app.js без изменения логики и без нового build step. HTML становится существенно компактнее; runtime сохраняет отдельную точку загрузки через Jekyll relative_url.
- Сохранение общего CSS/JS стека без framework migration, minification source и рискованной массовой чистки каскада. Дублирующиеся CSS overrides пока не удаляются автоматически: порядок каскада влияет на реальные компоненты.
- Выборочные унаследованные задачи по визуальной цельности, provider wording, validation, modal lifecycle и mobile scroll включены в соответствующие 8.x-пункты, а не ведутся вторым независимым backlog.

## P0 — автоматическая проверка точного HEAD

- [ ] После завершения UI source pass запустить focused Playwright/Chromium regressions для 8.1–8.17 и исправить подтверждённые падения. Последний UI source checkpoint: `9aa74853478a6a680cdd36ab0f84c851721405a4`; после него exact-head Quality/Chromium не подтверждён.
- [ ] Установить, почему exact-head GitHub Actions runs/statuses не видны, хотя Quality Sentinels запускается на pull_request, а Gateway Tests — на PR с изменениями gateway/**; получить реальные результаты.
- [ ] Запустить полный Quality (Gateway, Security, Integrity, Context, Jekyll, Chromium), Freshness, Provenance, Graphify и Dead Code, если workflows доступны.
- [x] Gateway tests passed in Actions run #640 on `6f7fde4` (compileall, manifest/INTEL, pytest, deploy preflight, six-layer eval); no `gateway/**` changes since that tested commit. Browser/Quality verification remains open.
- [ ] Подтвердить, что E2E охватывает sidebar/chat restore, responsive header, settings disclosures, Back/Forward/Escape, modal lifecycle, message actions, explicit project handoff, touch selection, status/reduced-motion, readability, bilingual field validation, stale aServi health responses, prompt editing and mobile scroll retention.
- [x] Chromium reliability hardening applied: one CI worker, 30-minute Playwright global timeout within 35-minute job timeout, trace on first retry, screenshot on failure, video disabled. Playwright 1.56.1 remains pinned to keep the browser baseline fixed until UI stabilization; findings are documented in LANDING_UI_V2_IMPLEMENTATION_RU.md.

## P1 — визуальная и ручная доступность

- [ ] Screenshot review на 320/360/390/768/1024/1440 px: header, sidebar, composer, dialogs, empty states, long labels, spacing, typography and contrast.
- [ ] Native iPhone Safari: virtual keyboard/VisualViewport, safe-area, orientation, edge swipe, long-press, touchcancel, nested scroll and scroll restoration.
- [ ] VoiceOver/keyboard-only: heading order, accessible names/tooltips, visible/unobscured focus, Tab/Escape/Back/Forward, focus return and modal isolation.
- [ ] Полная RU/EN проверка, light/dark для modal/menu/status/error/help/empty states. aServi validation, aServi field names, paste/connect actions and system-prompt editing now have targeted RU/EN coverage; full surface review remains.
- [ ] Завершить WCAG contrast audit для реальных компонентов primary/secondary/disabled/link/error/status в обеих темах. Базовые CSS tokens против solid theme surfaces уже автоматически рассчитываются и проходят ≥4.5:1; градиенты, фактические поверхности, focus/hover, мелкий текст и non-text contrast требуют отдельной проверки.

## P2 — поведенческие проверки и достоверность интерфейса

- [ ] Длинные списки/имена проектов и чатов, длинные сообщения, пустые состояния, вложенный scroll и popover у краёв viewport/при клавиатуре.
- [ ] Меню «Исследование / Агенты / Навыки / Коннекторы»: только реально зарегистрированные сущности, статусы и permissions; отделить web-search breadth, offline и sequential pipeline от independent agent runtime.
- [ ] Перепроверить empty-by-default global system prompt и legacy migration; решение по Tavily — только после аудита keyless search fallback и реального adapter contract.
- [ ] Mock/contract-проверки provider/gateway ошибок: invalid URL/model, CORS, timeout, 401/5xx, secret redaction. aServi now validates required fields and remote HTTPS, links errors accessibly, and ignores stale health responses; broader provider/catalog failure matrix remains. Live smoke — только с явным согласием владельца.

## Не включать в UI backlog

- Project Sources: пока нет gateway source-list API. Сохранять честное unsupported state; CRUD не имитировать.
- 8.12: server-memory graph UI/HTTP bridge удалены; local/private/shared/project memory, delta sync и RAG сохранены. Осталась проверка тестов на exact HEAD.
- 8.13: явный handoff в существующий чат реализован; session-only pending state — принятое ограничение, не требование к persistence.
- Новые провайдеры, connector marketplace, cloud sync, OAuth и новые runtime capabilities — вне PR #131 без отдельного решения владельца.

## История закрытых направлений

- PR #115: popover scrim, modal backdrop и inert first outside tap.
- PR #117: header hierarchy, clock, viewport-safe chat menus.
- PR #118: chat-scoped import/export.
- PR #119: provider route selection, project-first actions, composer position.
- PR #120: sidebar/memory/project hierarchy and synchronized theme/language.
- PR #121: Research Studio settings semantics, first free landing V1 and client UX.

Не восстанавливать старые задачи из LEGACY_UX_REQUEST_AUDIT_RU.md или прежних версий этого backlog как активные, если они уже закрыты перечисленными PR или заменены требованиями 8.1–8.17.


## Chromium, Playwright и мобильные browser edge cases — исследование 2026-11-01

Проверены официальные рекомендации Playwright/Chrome и спецификации браузерных touch/viewport API. Применяемые решения:

- **CI concurrency:** Playwright рекомендует один worker в CI ради воспроизводимости; текущий `playwright.config.mjs` уже использует `workers: process.env.CI ? 1 : undefined`. Не возвращать 2 workers только ради ускорения без замеров.
- **Диагностика падений:** сохранять trace на первой повторной попытке, screenshots только при ошибке, video выключено. Trace Viewer позволяет просмотреть последовательность действий, DOM snapshots, network и console; не включать trace для каждого теста, это увеличивает нагрузку.
- **Retries не заменяют исправление:** flaky/pass-on-retry учитывать отдельно; детерминированные падения исправлять по trace и первопричине, а не увеличивать число повторов до зелёного статуса.
- **Headless Chromium:** современный Chrome Headless использует тот же browser implementation, что и headful Chrome. Это надёжный регрессионный движок, но он не доказывает работу реальной iOS-клавиатуры, safe-area, VoiceOver, hardware gestures или конкретного WebKit.
- **VisualViewport:** мобильная экранная клавиатура может менять visual viewport без изменения layout viewport. При адаптации composer/dialogs учитывать `visualViewport.resize` и `visualViewport.scroll`, а не только `window.innerHeight`; проверять закрытие клавиатуры и возврат фокуса.
- **Touch/gesture lifecycle:** браузер может отправить `pointercancel`, когда начинает сам обрабатывать pan/zoom/scroll. Любой собственный swipe должен очищать состояние на `pointercancel`/`touchcancel`; `touch-action` задавать локально на зоне жеста, не глобально и не через blanket `none`.
- **Селекторы и фикстуры:** мок aServi должен соответствовать реальному контракту: first-party settings card + model completion probe + `/healthz`. Не выбирать aServi через список сторонних API и не считать HTTP 200 без валидного completion подтверждением соединения.
- **Runner stall:** существующий workaround с Ubuntu `man-db` оставлен только в шаге установки browser dependencies; он не подменяет тесты и не отключает проверки.
- **HTML/CSS payload:** оба крупных inline `<style>` блока вынесены в cacheable `assets/css/app.css` и `assets/css/landing.css` (48.1 KB и 10.4 KB). HTML уменьшился с 109.3 до 61.3 KB для приложения и с 26.1 до 15.8 KB для лендинга; CSS declarations сохранены без минификации и перестановки каскада. E2E/Quality теперь проверяют ссылки на stylesheet. Tailwind CDN оставлен: его удаление требует отдельного build-time CSS pipeline и полного utility-class inventory, что не оправдано без замера и approval.

Источники:
- Playwright CI: https://playwright.dev/docs/ci
- Playwright retries: https://playwright.dev/docs/test-retries
- Playwright trace viewer: https://playwright.dev/docs/trace-viewer-intro
- Chrome Headless automation: https://developer.chrome.com/docs/automation-and-testing
- MDN VisualViewport: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- MDN pointercancel: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event
- MDN touch-action: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action


## Future UI visibility and research hierarchy — 2026-11-01

- Keep planned product sections and their windows visible so the information architecture can be built and reviewed before every runtime capability ships.
- Use one consistent moving ticker/status treatment in areas under active development. Do not represent a placeholder as a completed integration or successful action; disable unavailable mutations or explain their status.
- Research Studio is a subfeature of deep research, entered from the Thorough/deep-research controls. It is not a standalone navigation destination or Functions-menu item.

- Project source management is a concrete example of the rule: keep the section visible, explain the missing source-list API, show the shared ticker, and expose no fake mutation controls.


### Integrated backlog checkpoint — 2026-11-02

- This file remains a concise mirror of the canonical section 8.0 queue; it does not create independent tasks. Active inherited requirements from sections 1–7 are included in the same workstreams as 8.1–8.17.
- Latest UI source checkpoint: `9aa74853478a6a680cdd36ab0f84c851721405a4`; PR #131 branch head after the Graphify path-filter change: `c8facdac2eebc7d2217b807f1b7e314ae3abf2dd`.
- Graphify path filters now include extracted JS/CSS and landing HTML. The run/artifact is pending confirmation.
- Exact-head Quality/Chromium, screenshot review, native iPhone Safari, VoiceOver and full component-level WCAG review remain open. Do not infer completion from added test source.


### Дополнительные предложения владельца для aLandi V2.0 — 2026-11-02

Предложения 8.18–8.27 добавлены в единый реестр docs/V1_UI_FINALIZATION_RU.md как необязательные кандидаты, а не release blockers. Их сопоставление с существующим кодом, конфликты, исследованные open-source patterns и рекомендуемый порядок реализации находятся в docs/LANDING_UI_V2_IMPLEMENTATION_RU.md. Этот mirror не создаёт второй очереди и не меняет приоритет текущих 8.1–8.17.

### 8.19 notification slice — 2026-11-02

- The existing toast was extended with a FIFO queue, duplicate suppression, urgency-based durations, hover/focus/hidden-tab pause and polite/assertive ARIA semantics.
- Playwright assertions were added for sequential success/error announcements; they have not yet been executed on the current branch head. This is partial 8.19 work, not completion of the durable operation-state contract.
- Detailed scope and remaining work: `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md`.


### 8.20 bounded Undo slice — 2026-11-02

- The existing toast now supports an optional action button; one reversible action is implemented for moving a chat between project and personal scope.
- Undo validates that the chat has not changed again and the original project still exists; otherwise it reports a conflict without overwriting current data. The action is bounded by the toast lifetime and is not persistent across reload.
- Playwright coverage is authored, not yet executed. Detailed evidence and remaining scope: `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md`.


### 8.25 browser connectivity and draft flush — 2026-11-02

- Composer now reports the browser's offline signal separately from offline search; reconnect asks for a manual retry and never resends a request. Drafts flush on hidden-tab `visibilitychange` and `pagehide`.
- E2E coverage is authored for offline → online/no automatic retry and immediate draft flush. Not yet executed in Chromium.

### 8.20 bounded Undo — both entry points — 2026-11-02

- Undo for chat project moves is covered through the current-chat project selector and chat-row context menu. It restores only if the chat has not changed again and the original project still exists.
- Both E2E tests are authored but not yet executed. This is a bounded in-memory action, not persistent command history.
