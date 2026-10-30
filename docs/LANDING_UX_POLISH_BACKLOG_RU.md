# aLandi — остаток оформления и UX-оптимизации сайта

**Срез:** 2026-10-30  
**Текущая база:** main после merge PR #121 и #122.  
**Назначение:** единый реестр незавершённого визуального/интерактивного polish после PR #121. Это продолжение `V1_UI_FINALIZATION_RU.md` и `LEGACY_UX_REQUEST_AUDIT_RU.md`, не замена им.

Статусы: [x] выполнено и подтверждено; [~] частично / автоматическая проверка есть, ручной gate нет; [ ] не выполнено; [!] блокер. Закрывать пункт только с тестом, screenshot или owner evidence.

## 1. Найденные и сохранённые требования

### Landing / публичная страница
- [x] Отдельный `/landing/`, hero, CTA, возможности, архитектура, readiness, FAQ, roadmap.
- [x] Roadmap ticker `1nv3nt10n 1n PrOc3ss…` показывается только внутри раскрытого пункта; не выдаёт фоновые задачи за реально исполняемые.
- [x] `prefers-reduced-motion` выключает движение и оставляет читаемый текст.
- [x] **2026-10-30:** добавлены видимые pause controls для каждого из трёх ticker; checkbox управляет `animation-play-state` без JavaScript.
- [ ] Screenshot review 320/360/390/768/1024/1440 px: hero balance, card rhythm, line lengths, section spacing, contrast, footer and CTA.
- [ ] Проверить keyboard-only и screen reader чтение всех трёх раскрываемых roadmap пунктов и pause controls.
- [ ] Проверить опубликованный Pages, а не только PR preview/Jekyll build; ссылки и canonical после merge.
- [ ] Проверить светлую/тёмную тему? Landing сейчас намеренно самостоятельная тёмная публичная страница; не добавлять переключатель без требования и цельного дизайна.

### Корневое приложение — визуальная иерархия
- [x] PR #117/#120: header hierarchy, project label, clock polish, sidebar grouping, memory/project statuses, synchronized theme/language.
- [~] Общий screenshot review desktop/mobile после последнего PR #121.
- [ ] Единый проход по typography, contrast, spacing, empty states, inline errors и secondary actions.
- [ ] Полная RU/EN проверка микротекстов, подсказок, статусов, светлой темы модалок и пустых состояний.
- [ ] Проверить pencil/edit state у system prompt и возврат в readonly.
- [ ] Проверить touch targets (проектная цель 44×44 CSS px) и отсутствие конкурирующих controls.

### Popovers, menus, dialogs
- [x] PR #117: chat-row menu placement viewport-safe; PR #115: scrim и inert first outside tap.
- [~] Проверить все composer popovers у четырёх краёв viewport, короткую высоту, экранную клавиатуру и nested scroll.
- [ ] Проверить Escape, focus trap/return, accessible names, scroll lock и background inert для всех modal/dialog.
- [ ] Sticky Save/Close в Settings при длинном scroll и мобильной клавиатуре — проверить, исправить только при воспроизводимом дефекте.
- [ ] Native Popover API / CSS Anchor Positioning рассматривать только как progressive enhancement после support matrix; сохранить существующий JS fallback. Не мигрировать ради моды.

### Sidebar, проекты, чаты
- [x] PR #120: порядок памяти → проекты → чаты и компактные статусы.
- [x] PR #118/#119: chat import/export и project-first actions.
- [~] Проверить, что общий импорт/экспорт не дублируется в sidebar и project settings; chat actions остаются в chat menu, project bundle — в project settings.
- [ ] Длинные названия проектов/чатов, пустые списки, большое количество проектов/чатов, keyboard navigation и mobile scroll.

### Research / functions / agents
- [x] PR #121 merged; exact-head Chromium/Quality passed for Research Studio active-chat settings and non-mutation. Ручная проверка текста, доступности и всех комбинаций остаётся отдельным polish gate.
- [ ] Функциональное меню «Исследование / Агенты / Навыки / Коннекторы» должно показывать только реально зарегистрированные сущности, статусы и permissions. Не рисовать fake marketplace.
- [ ] Развести семантику web search breadth, offline mode и multi-agent orchestration в copy и UI.
- [ ] В roadmap/agent panels сохранять чёткое различие между blueprint, sequential pipeline и независимым agent runtime.

### Мобильность и доступность
- [~] Chromium responsive matrix 320/360/390/768/1024/1440 и no-overflow tests.
- [ ] Native iPhone Safari: visual viewport, клавиатура, safe-area, edge swipe, touchcancel, rotation, scroll restoration.
- [ ] VoiceOver: headings, dialogs, menus, status text, message actions, focus visibility.
- [ ] Reduced motion: landing ticker, app ticker, transitions and scroll behavior; проверить пользовательскую настройку вместе с OS preference.

## 2. Порядок реализации большими шагами

1. **UX inventory + baseline (этот документ):** требования собраны; не переписывать уже закрытые PR #115–120.
2. **Landing finish:** screenshot review, ticker pause/reduced-motion/keyboard, metadata/CTA/link validation, published Pages smoke.
3. **App visual consistency:** screenshot pass, typography/spacing/contrast, RU/EN, light/dark, empty/error/secondary states.
4. **Interaction correctness:** popover edge placement, dialog sticky actions, Escape/focus/scroll lock, project/chat menus.
5. **Mobile/accessibility:** Chromium matrix, then native iPhone Safari + VoiceOver owner gate.
6. **Release verification:** PR #121 merged after exact-head CI; post-merge Pages root + /landing smoke remains pending because no independent deployment run was returned. Update this file, V1 checklist, PROJECT_STATE, ORIENTER and VOLLEY_LOG after the actual public URL is verified.

## 3. Реализованный первый polish patch
- [x] Добавлен checkbox Pause control на каждый из трёх landing roadmap ticker.
- [x] Pause toggles animation state using CSS only; no new JavaScript or runtime dependency.
- [x] Added Playwright test for pause/resume and retained reduced-motion test.
- [x] Exact-head Chromium/Quality passed on PR #121, including landing pause/resume and reduced-motion regression coverage.
- [ ] Native keyboard/screen-reader confirmation.

## 4. Источники и технологические ограничения
- MDN `<marquee>`: deprecated; use CSS transforms/animations instead. https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/marquee
- MDN `prefers-reduced-motion`: respect OS reduced-motion preference. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- W3C WCAG 2.2 SC 2.2.2: automatically moving content lasting over five seconds alongside other content needs pause/stop/hide. https://www.w3.org/TR/WCAG22/#pause-stop-hide
- MDN Popover API (Baseline 2025) and anchor positioning: promising progressive enhancement for edge-aware popovers, but keep fallback for unsupported browser versions. https://developer.mozilla.org/en-US/docs/Web/API/Popover_API and https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning
- MDN CSS/JS accessibility practices: visible focus and restrained motion. https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript

## 5. Change log
| Date | Change | Evidence |
|---|---|---|
| 2026-10-30 | Consolidated remaining visual/interaction tasks from legacy UX audit, V1 UI checklist and landing source. | `LEGACY_UX_REQUEST_AUDIT_RU.md`, `V1_UI_FINALIZATION_RU.md`, `landing/index.html`, `tests/e2e/landing.spec.mjs` |
| 2026-10-30 | Added explicit pause controls to landing roadmap tickers and Playwright pause/resume test. | Commits `f42c42d`, `b213c8a`; PR #121 exact-head Chromium/Quality passed; native keyboard/screen-reader confirmation pending |
