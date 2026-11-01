# aLandi — остаток UI/UX polish (единый реестр)

**Сверка:** 2026-11-01  
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

- [ ] После завершения UI source pass запустить focused Playwright/Chromium regressions для 8.1–8.17 и исправить подтверждённые падения. Текущий code/test HEAD: 2231691fab0a56a39ce6e1edb571fee6d131607b; exact-head Quality ещё не запускался.
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
