# aLandi — остаток UI/UX polish (единый реестр)

**Сверка:** 2026-11-01  
**Рабочая ветка:** PR #131 — aLandi Landing UI v2.0.  
**Основной список владельца:** V1_UI_FINALIZATION_RU.md, раздел 8.0 и требования 8.1–8.17.  
**Технические статусы и evidence:** LANDING_UI_V2_IMPLEMENTATION_RU.md.

Этот файл больше не является самостоятельным вторым backlog. Он повторяет только текущие остаточные проверки из основного документа. Закрытые задачи PR #115–121 не возвращать в работу без нового воспроизводимого дефекта. PR #131 остаётся открытым; merge/deploy запрещены без явного разрешения владельца.

## P0 — автоматическая проверка точного HEAD

- [ ] Запустить focused Playwright/Chromium regressions для 8.1–8.17 и исправить подтверждённые падения.
- [ ] Запустить полный Quality (Gateway, Security, Integrity, Context, Jekyll, Chromium), Freshness, Provenance, Graphify и Dead Code, если workflows доступны.
- [ ] Проверить тесты удаления experimental server-memory graph bridge и secret-redaction; тестовый код добавлен, но ещё не выполнялся.
- [ ] Подтвердить, что E2E охватывает sidebar/chat restore, responsive header, settings disclosures, Back/Forward/Escape, modal lifecycle, message actions, explicit project handoff, touch selection, status/reduced-motion и readability.

## P1 — визуальная и ручная доступность

- [ ] Screenshot review на 320/360/390/768/1024/1440 px: header, sidebar, composer, dialogs, empty states, long labels, spacing, typography and contrast.
- [ ] Native iPhone Safari: virtual keyboard/VisualViewport, safe-area, orientation, edge swipe, long-press, touchcancel, nested scroll and scroll restoration.
- [ ] VoiceOver/keyboard-only: heading order, accessible names/tooltips, visible/unobscured focus, Tab/Escape/Back/Forward, focus return and modal isolation.
- [ ] Полная RU/EN проверка, light/dark для modal/menu/status/error/help/empty states.
- [ ] Измерить реальные WCAG contrast ratios для primary/secondary/disabled/link/error/status в обеих темах. Computed-style assertions не равны WCAG audit.

## P2 — поведенческие проверки и достоверность интерфейса

- [ ] Длинные списки/имена проектов и чатов, длинные сообщения, пустые состояния, вложенный scroll и popover у краёв viewport/при клавиатуре.
- [ ] Меню «Исследование / Агенты / Навыки / Коннекторы»: только реально зарегистрированные сущности, статусы и permissions; отделить web-search breadth, offline и sequential pipeline от independent agent runtime.
- [ ] Перепроверить empty-by-default global system prompt и legacy migration; решение по Tavily — только после аудита keyless search fallback и реального adapter contract.
- [ ] Mock/contract-проверки provider/gateway ошибок: invalid URL/model, CORS, timeout, 401/5xx, secret redaction. Live smoke — только с явным согласием владельца.

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
