# aLandi — реестр финальной UX-полировки лендинга и клиента

**Срез:** 2026-10-30  
**Ветка:** `feat/chat-settings-orthogonal-controls-20261030`  
**PR:** [#121](https://github.com/DorpNay/skills-github-pages/pull/121)  
**Назначение:** единый проверяемый список незавершённых работ по оформлению, адаптивности, доступности и интерактивным состояниям. Это backlog, не заявление о готовности функций.

## Правила
- Не добавлять новые библиотеки или UI-фреймворки без измеримой необходимости.
- Не делать декоративные контролы для ещё не существующих функций.
- Каждый UI-срез должен иметь регрессионный тест и проверку на exact HEAD.
- Разделять автоматические Chromium проверки, опубликованный Pages smoke и ручную проверку реального устройства.
- Не считать roadmap-текст обещанием фонового выполнения или доступности функции.

## Уже реализовано в текущем HEAD
- [x] Лендинг `/landing/` с SEO/OG/canonical metadata, CTA и явными границами бесплатного статического UI и внешнего inference.
- [x] Три roadmap-карточки с ticker-анимацией только при раскрытии.
- [x] Уважение `prefers-reduced-motion`.
- [x] CSS-only checkbox pause/resume для бегущих строк; без дополнительного JavaScript.
- [x] Playwright-сценарии на метаданные/CTA/границы продукта, отсутствие горизонтального overflow на 320/360/390/768/1024/1440 px, запуск ticker по раскрытию, pause/resume и reduced motion.
- [x] Сохранение существующего HTML/CSS/JS + Jekyll без нового frontend framework.

## Остаток работ — по крупным этапам

### Этап A — закрыть публичный лендинг
- [ ] Получить exact-HEAD результат Chromium E2E, включая `tests/e2e/landing.spec.mjs`.
- [ ] Проверить опубликованный Pages URL после merge/deploy отдельным smoke; PR CI не доказывает публикацию.
- [ ] Сделать визуальный screenshot review на 320, 360, 390, 768, 1024 и 1440 px: hero, CTA, карточки, roadmap, footer, вертикальный ритм и отсутствие обрезания.
- [ ] Проверить keyboard-only навигацию, видимый focus, названия элементов для screen reader и читаемость ticker без движения.
- [ ] Перепроверить все внешние и внутренние ссылки, canonical/OG metadata и корректность текстов о доступности функций.

### Этап B — согласованность интерфейса приложения
- [ ] Сверить типографику, интервалы, размеры контролов, границы/тени, контраст и иерархию заголовков между header, sidebar, chat, composer и settings.
- [ ] Проверить light/dark и RU/EN: переполнение длинных переводов, переключение темы/языка и сохранение единого источника состояния.
- [ ] Проверить empty/loading/error/disabled/success states для основных экранов и действий.
- [ ] Проверить системный prompt: empty-by-default, read-only по умолчанию, понятный opt-in edit/save/cancel.
- [ ] Проверить touch targets; целевой ориентир проекта — 44×44 CSS px для основных мобильных действий.

### Этап C — popovers, menus и dialogs
- [ ] Проверить размещение у краёв viewport, короткие окна, mobile keyboard и прокрутку.
- [ ] Проверить Escape, focus trap там, где нужен modal, возврат фокуса к триггеру, scroll lock и inert/background interaction.
- [ ] Проверить outside tap: первый тап не должен случайно запускать underlying action.
- [ ] Проверить sticky Save/Close и доступность действий на мобильной высоте.
- [ ] Popover API и CSS Anchor Positioning рассматривать только как progressive enhancement с fallback; не внедрять ради новизны.

### Этап D — sidebar, projects и chats
- [ ] Проверить длинные названия проектов/чатов, пустые и большие списки, переполнение и прокрутку.
- [ ] Проверить keyboard navigation, touch targets, меню действий и подтверждения разрушительных действий.
- [ ] Убедиться, что import/export не дублируются и работают в правильном chat/project scope.

### Этап E — research, функции и агенты
- [ ] В UI показывать только реально зарегистрированные функции, providers, connectors и permissions.
- [ ] Ясно различать web search, offline/local execution, sequential pipeline, blueprint и independent agents.
- [ ] Не называть roadmap ticker, прототип DAG или последовательность вызовов «командой независимых агентов».
- [ ] Сверить подписи, disabled states и сообщения об ошибках с реальными capabilities API.

### Этап F — mobile и accessibility acceptance
- [ ] Пройти Chromium responsive matrix и keyboard tests.
- [ ] Выполнить ручной тест на реальном iPhone Safari: safe-area, клавиатура, прокрутка, touch, edge gestures.
- [ ] Проверить VoiceOver/screen reader, контраст, focus order и reduced motion.
- [ ] Отдельно зафиксировать неподтверждённые устройства/браузеры; не экстраполировать Chromium на iOS.

## Порядок исполнения
1. Этап A — exact-head CI + visual review + опубликованный smoke.
2. Этап B — единый bounded visual consistency pass с тестами.
3. Этап C — исправление конкретных воспроизводимых проблем popover/dialog.
4. Этап D — sidebar/project/chat edge cases.
5. Этап E — проверка соответствия UI реальным capabilities.
6. Этап F — native device/accessibility acceptance.

Не начинать следующий крупный этап, пока предыдущий не имеет записанного результата и списка оставшихся ручных gates.

## Текущий CI-срез
- PR #121 HEAD: `78e19e8f1147e44004273e18c23a52f40cfb7f9d`.
- Check runs на этом SHA: Graphify, Gateway contract/security, model/voice provenance и dead-code report завершились успешно.
- Project State Freshness остаётся pending; Independent Quality Sentinels был in progress при последней проверке.
- Combined commit status оставался pending. Следовательно, exact-head Quality/Chromium/Pages smoke ещё нельзя объявить полностью зелёными.
- PR #121 открыт, не merged. Published Pages smoke и native iPhone проверки остаются отдельными gates.

## Журнал
- 2026-10-30: восстановлен единый UX backlog после обнаружения отсутствующего файла, на который уже ссылались ориентиры. Составлен по существующим UI finalization/legacy audit docs и фактическому дереву кода/тестов.
