# aLandi — остаток оформления и UX-оптимизации сайта

**Срез:** 2026-11-17  
**Текущая база:** root app на `main`; единственный публичный продуктовый маршрут — `/`, а `/landing/` намеренно отсутствует (404) по контракту `tests/e2e/landing.spec.mjs`.  
**Назначение:** единый реестр незавершённого визуального/интерактивного polish после PR #121. Это продолжение `V1_UI_FINALIZATION_RU.md` и `LEGACY_UX_REQUEST_AUDIT_RU.md`, не замена им.

Статусы: [x] выполнено и подтверждено; [~] частично / автоматическая проверка есть, ручной gate нет; [ ] не выполнено; [!] блокер. Закрывать пункт только с тестом, screenshot или owner evidence.

## 1. Найденные и сохранённые требования

### Публичная точка входа и root app
- [x] Контракт маршрутизации обновлён: единственная публичная продуктовая поверхность — root app; `/landing/` и `/assets/css/landing.css` возвращают 404. Не восстанавливать отдельный статический лендинг без нового решения владельца.
- [x] Pages build + deploy завершились успешно на main SHA `0f1b3cfdef9a25198c6435a64f886db4f6fbd510` (run `44016571123`); live metadata with cache bypass reports the same `alandi-build-revision`, and `/landing/` returns HTTP 404.
- [~] Screenshot review 320/360/390/768/1024/1440 px: root header, sidebar, composer, settings/function/project dialogs, line lengths, section rhythm and contrast.
- [ ] Native keyboard/screen-reader pass for the public root app; DOM/E2E assertions are not a VoiceOver certification.
- [ ] Verify the deployed root revision marker and critical navigation on the actual published Pages URL after the next UI change.
- [ ] Keep the dark/light app themes and reduced-motion behavior consistent; do not add a separate landing theme or duplicate route.

### Корневое приложение — визуальная иерархия
- [x] PR #117/#120: header hierarchy, project label, clock polish, sidebar grouping, memory/project statuses, synchronized theme/language.
- [~] Общий screenshot review desktop/mobile после последнего PR #121.
- [~] aServi cloud fields now reference their inline error messages with aria-describedby; URL validation, connection progress/status and success copy follow RU/EN. Remaining forms and empty/error states still need a full pass.
- [ ] Полная RU/EN проверка микротекстов, подсказок, статусов, светлой темы модалок и пустых состояний.
- [ ] Проверить pencil/edit state у system prompt и возврат в readonly.
- [ ] Проверить touch targets (проектная цель 44×44 CSS px) и отсутствие конкурирующих controls.

### Popovers, menus, dialogs
- [x] PR #117: chat-row menu placement viewport-safe; PR #115: scrim и inert first outside tap.
- [~] Chat/project action menus now choose the roomier side of the trigger and cap their scroll area to the live visual viewport (including keyboard-reduced height); added a focused E2E geometry/scroll regression. Composer popovers at all four viewport edges, nested scroll and real iPhone keyboard still need verification.
- [~] Settings, project-create и project-settings dialogs: Escape, focus return и Tab/Shift+Tab containment реализованы; Settings и project-create имеют E2E regression, выполнение тестов pending. Остальные dialog/menu patterns, scroll lock и background inert проверить отдельно.
- [x] Settings Save/Close остаются sticky; добавлены начальный focus на Close, Tab/Shift+Tab trap, Escape close и возврат фокуса к открывшему control (runtime E2E добавлен, запуск ещё pending).
- [ ] Проверить короткий viewport, открытую iPhone keyboard и safe-area на реальном Safari.
- [ ] Native Popover API / CSS Anchor Positioning рассматривать только как progressive enhancement после support matrix; сохранить существующий JS fallback. Не мигрировать ради моды.

### Sidebar, проекты, чаты
- [x] PR #120: порядок памяти → проекты → чаты и компактные статусы.
- [x] PR #118/#119: chat import/export и project-first actions.
- [~] Проверить, что общий импорт/экспорт не дублируется в sidebar и project settings; chat actions остаются в chat menu, project bundle — в project settings.
- [ ] Длинные названия проектов/чатов, пустые списки, большое количество проектов/чатов, keyboard navigation и mobile scroll.

### Research / functions / agents
- [x] Owner override 2026-11-08 (D-022): Research Studio remains retired; PR #169 removed the modal, wiring and entrypoints. Post-merge public root/landing Chromium verified the absence on exact main SHA.
- [x] Functions menu: owner-approved three-entry subset (Agents/structured analysis, Deep Research, Skills/task profile) was restored and implemented in PR #169; public Chromium confirmed it. This supersedes the 2026-11-07 blanket removal/defer instruction. Integrations/connectors remain absent until real registry/status/permission contracts exist.
- [ ] Release-contract sentinel correction: PR #174 changes the published marker list to require the approved menu and forbid only retired Research Studio, legacy provider selection and removed sidebar controls.
- [ ] Развести семантику web search breadth, offline mode и multi-agent orchestration в copy и UI.
- [ ] В roadmap/agent panels сохранять чёткое различие между blueprint, sequential pipeline и независимым agent runtime.

### Мобильность и доступность
- [~] Composer placeholder uses `Текст`/`Type` at <=360px and `Текст…`/`Type…` at <=420px, restores the full text on wider screens, and trims horizontal padding only at <=360px; E2E covers 320/360/390/420/768 px (execution pending).
- [~] Chromium responsive matrix 320/360/390/768/1024/1440 и no-overflow tests.
- [ ] Native iPhone Safari: visual viewport, клавиатура, safe-area, edge swipe, touchcancel, rotation, scroll restoration.
- [ ] VoiceOver: headings, dialogs, menus, status text, message actions, focus visibility.
- [ ] Reduced motion: landing ticker, app ticker, transitions and scroll behavior; проверить пользовательскую настройку вместе с OS preference.

## 2. Порядок реализации большими шагами

1. **UX inventory + baseline (этот документ):** требования собраны; не переписывать уже закрытые PR #115–120.
2. **Root app finish:** screenshot review at 320/360/390/768/1024/1440, compact composer/header, dialogs, navigation, metadata and published Pages smoke. The separate `/landing/` route is retired by contract.
3. **App visual consistency:** screenshot pass, typography/spacing/contrast, RU/EN, light/dark, empty/error/secondary states.
4. **Interaction correctness:** popover edge placement, dialog sticky actions, Escape/focus/scroll lock, project/chat menus.
5. **Mobile/accessibility:** Chromium matrix, then native iPhone Safari + VoiceOver owner gate.
6. **Release verification:** root Pages publication and `/landing/` HTTP 404 have been verified on the previous exact head; rerun after every UI commit. Keep Quality manual-only and do not alter the Pages workflow.

## 3. Исторический первый polish patch
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

### Fast regression path (2026-11-17)

- [x] Quality workflow is manual-only; expensive static analysis, full Chromium and live Pages release verification are opt-in. The GitHub Pages publishing mechanism is unchanged.
- [x] Added a dependency-free local gate: `bash scripts/fast-check.sh` (integrity, security, context, immutable-action parser, state-freshness unit tests, source accessibility check, syntax and diff checks).
- [~] Added `scripts/check_a11y_surface.py`; a source scan of current `index.md` finds 5 visible form controls with names, 28 buttons with a non-empty name source, and all 8 runtime-localized field IDs in `fieldTexts`. This is a structural heuristic, not WCAG/screen-reader certification; the committed script still needs execution from a real checkout.
- [~] Added a Lightpanda JavaScript/DOM smoke for Functions → Skills and localized accessible names. It is a fast functional candidate, not a visual browser: Lightpanda does not render layout. Its compatibility and timing are **not yet verified on aLandi**.
- [ ] Run the fast gate and Lightpanda smoke in a real repository checkout; compare elapsed time and coverage against Chromium on the same commit.
- [ ] Keep Chromium as a manual-only check for viewport geometry, CSS reflow, overflow and screenshots; do not infer those properties from DOM-only tests.

## 5. Change log
| Date | Change | Evidence |
| 2026-11-17 | Chat action dialog now focuses its active field, traps Tab/Shift+Tab, closes on Escape and restores the originating chat-menu focus (or a safe fallback after list rerender); the no-project path also restores focus after its notice. The move-project select has a localized accessible name/description. | `index.md` `50ff6ec6`, `72327b4e`; `tests/e2e/app.spec.mjs` `097876f6`, `6e5e0ce3`; runtime verification pending |
| 2026-11-17 | Closed sidebar now uses `inert`/`aria-hidden` and restores focus; the move-chat project selector is labelled by its visible dynamic field/help text. Static HTML audit: 0 visible unnamed form controls and 0 unnamed buttons (heuristic only). | `index.md` `ea06d0a2`, `50ff6ec6`; `tests/e2e/app.spec.mjs` `36332c00`, `097876f6`; browser execution pending |
| 2026-11-17 | Sidebar is now a named navigation landmark; the trigger exposes `aria-controls`/synchronized `aria-expanded` and localized Open/Close accessible names; closed navigation is `inert`/`aria-hidden`, opening focuses Close and closing restores trigger focus. Added RU/EN and focus assertions to E2E and the fast DOM smoke. | `index.md` `351004a4`; `tests/e2e/app.spec.mjs` `f862c61e`; `scripts/lightpanda-smoke.mjs` `b33b5097`; execution pending |
| 2026-11-17 | Custom Skill and Agent fields now expose localized accessible names; added RU/EN E2E assertions and a Lightpanda DOM smoke. Test runtime strategy is manual/fast-first; Lightpanda is not visual-layout evidence. | `index.md` `4e35efd`; `tests/e2e/app.spec.mjs` `a2e7789`, `c82e3b0`; `scripts/lightpanda-smoke.mjs`; execution pending |
|---|---|---|
| 2026-10-30 | Consolidated remaining visual/interaction tasks from legacy UX audit, V1 UI checklist and landing source. | `LEGACY_UX_REQUEST_AUDIT_RU.md`, `V1_UI_FINALIZATION_RU.md`, `landing/index.html`, `tests/e2e/landing.spec.mjs` |
| 2026-10-30 | Added explicit pause controls to landing roadmap tickers and Playwright pause/resume test. | Commits `f42c42d`, `b213c8a`; PR #121 exact-head Chromium/Quality passed; native keyboard/screen-reader confirmation pending |

- [~] Provider settings: aLandi aServi is a first-party section, not a third-party provider option; aServi excludes both peer sections, and no silent cross-provider fallback is allowed. PR #169 implements; exact-head CI and live check pending.
