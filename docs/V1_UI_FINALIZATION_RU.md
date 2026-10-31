# aLandi — финализация UI и лендинга первой версии

**Дата среза:** 2026-10-30  
**Реализация:** PR #121 merged at `f4d880f`; Gateway readiness PR #122 merged at `fd4f0a1`.  
**Область:** публичный статический лендинг /landing/ и существующий браузерный клиент на корневом URL.  
**Не является:** планом полного автономного стека, обещанием бесплатного inference, доказательством развёртывания VPS/gateway или спецификацией публичного multi-user SaaS.

> **Source of truth.** Этот документ — живой release checklist пользовательского UI V1. Статус отмечается только по коду, exact-head тестам и фактическим проверкам. Планируемое не называется реализованным; CI не доказывает работу реального gateway, модели или iPhone Safari.

## 0. Продуктовая граница и правила V1

Первая публичная версия — бесплатный статический веб-интерфейс GitHub Pages для личного/ограниченного сценария. Пользователь может открыть лендинг и клиент без оплаты хостинга inference от aLandi. Но статический сайт **не предоставляет включённый hosted AI endpoint**: при использовании внешнего API пользователь выбирает провайдера и несёт его условия/квоты/стоимость; self-hosted вариант требует собственный gateway и инфраструктуру. Бесплатность UI не равна бесплатной генерации.

Базовый стек, который лендинг описывает как целевой, а не как уже развёрнутый: GitHub Pages UI → HTTPS Cloudflare Tunnel → FastAPI gateway (systemd, отдельный Linux user, auth/CORS/limits) → Ollama, доступная только на loopback. Первый gateway-контур — один владелец, одна активная модель, concurrency=1, измеряемый ресурсный бюджет. Не публиковать порты 8000/11434. Не включать платные сервисы, модельные загрузки и сторонние интеграции без отдельного согласия.

**Не входят в готовность V1:** открытая регистрация и multi-user SaaS; независимая команда 50 агентов; полноценный connector marketplace; cloud sync; OAuth/Drive; публичный hosted model endpoint; realtime voice/AEC; OCR и тяжёлое извлечение документов без проверенных артефактов; автоматический перенос памяти; side-effect tools/shell. Отдельные прототипы или выключенные feature flags не означают готовую функцию.

### Обязательные принципы

1. Сохранять текущий HTML/CSS/JavaScript + Jekyll/GitHub Pages. Новый frontend framework не внедрять без измеримой причины.
2. Один control — одно значение/действие. Не дублировать настройки в модалке, sidebar и composer, если это разные источники правды.
3. Progressive disclosure: сначала часто используемые действия; редкие/опасные — в контекстном меню или раскрывающейся секции.
4. У каждой функции видимые границы данных, разрешений, провайдера и runtime. Никакого скрытого cross-provider fallback для приватного маршрута.
5. Только работающие действия. Не добавлять декоративные переключатели несуществующих connector/agent/runtime.
6. Ошибки рядом с полем и с понятным исправлением; не выводить секреты в текстах статусов, логах или diagnostics.
7. Mobile-first, keyboard/focus, RU/EN, светлая/тёмная тема, reduced-motion. Основные мобильные touch controls — проектная цель 44×44 CSS px.
8. Маленькие reversible changes, контрактный тест на каждое новое поведение, exact-head CI, потом merge и отдельно deployment. Записывать rollback и неизвестные.

## 0.1 Freeze первой версии после merge

PR #121 зафиксировал первый бесплатный лендинг и согласованный стек. **Состав V1 больше не расширяем.** Разрешены только улучшения внутри выбранной конструкции: HTML/CSS/JavaScript + Jekyll/GitHub Pages на клиенте; существующий FastAPI Gateway + Ollama для личного self-hosted маршрута; уже определённые механизмы хранения, поиска, памяти и настроек. Работаем над качеством взаимодействия, скоростью, доступностью, надёжностью, безопасностью, тестами, наблюдаемостью и документацией. Новые модели, внешние сервисы, продуктовые функции и runtime-подсистемы не добавляются в первый релиз; их можно записать в будущий backlog без реализации.

PR #122 добавил только эксплуатационную надёжность существующего Gateway: process liveness/readiness probes. Он не расширяет пользовательский стек лендинга.

## 0.2 Подтверждённая шапка и закреплённые действия

Фактический порядок DOM в main после PR #117/#120/#121: **меню → название проекта/чата → цифровые и аналоговые часы → wordmark aLandi → тема → настройки**. Python status перенесён в компактную mode toolbar; язык синхронизирован с sidebar/settings. Chat-row menu позиционируется с учётом visualViewport и scroll/resize. Settings header и нижние actions используют sticky positioning. Остаются screenshot review, проверка wordmark (сейчас статический, не интерактивный), короткий viewport, native keyboard/safe-area и VoiceOver.

## 1. Требования владельца — 18 контрольных направлений

Статусы: **[x]** подтверждено кодом/тестом; **[~]** частично или ждёт exact-head/ручной проверки; **[ ]** не реализовано; **[!]** найден блокер/регрессия. Статусы ниже актуализированы после merge PR #121. Exact-head CI прошёл; post-merge Pages deployment, нативный iPhone и live Gateway остаются отдельными проверками.

### 1. Общий UI/UX — [~]
- [x] Сохранить индивидуальный визуальный язык aLandi и не переписывать интерфейс на новый framework.
- [x] Развести память, проекты, чаты и настройки в отдельные зоны sidebar (PR #120).
- [x] Свести частые параметры запроса к короткой сводке и независимым настройкам (PR #121, ожидает финальной проверки).
- [~] Завершить проход по типографике, контрасту, spacing, пустым состояниям, ошибкам и вторичным действиям.
- [ ] Пройти финальный визуальный screenshot-review desktop/mobile после всех изменений.

**Приёмка:** одно очевидное место для каждого действия; нет конкурирующих control-ов; состояния основаны на реальном состоянии приложения, не на наличии поля/ключа.

### 2. Composer и мобильная клавиатура — [~]
- [x] Composer остаётся нижним flex-элементом и не центрируется фиксированным позиционированием (PR #71).
- [x] Chromium E2E покрывает новый чат и resize viewport.
- [~] Сохранена настраиваемая top/bottom позиция (PR #119/#121 track), но перепроверить её влияние на мобильные viewport и scroll.
- [ ] Нативно проверить iPhone Safari: клавиатура, safe-area, focus, долгий текст, свайпы от края, ориентация экрана.

**Приёмка:** ввод, send/stop и поле видимы на узком экране и при клавиатуре; нет скачков/горизонтального overflow. Chromium — regression proxy, не доказательство iOS.

### 3. Маршруты aLandi и сторонних API — [~]
- [x] Собственная карточка «Мой сервер» отделена от списка внешних провайдеров.
- [x] Внешний picker сгруппирован; Kilo — обычный альтернативный провайдер.
- [~] В PR #121 унаследованный внутренний alandi option остаётся скрытым для миграции/совместимости. Тест должен подтверждать, что он hidden и не попадает в optgroup сторонних API; нельзя требовать его полного отсутствия в HTML.
- [ ] Проверить RU/EN labels, переключение и миграцию сохранённого маршрута на текущем head.

**Приёмка:** пользователь не может ошибочно выбрать aLandi как third-party provider; сохранённые старые настройки не теряются; приватный маршрут не уходит в сторонний fallback.

### 4. Подписи, placeholder и inline validation — [~]
- [x] URL/модель/ключ собственного сервера представлены компактными полями с placeholder.
- [x] Ошибки трёх серверных полей имеют отдельные элементы.
- [~] Завершить единый язык placeholder/error/help для внешних API, Cloudflare и Tavily; постоянный текст оставлять только там, где он несёт важную privacy/security информацию.
- [ ] Проверить ошибки invalid URL, неверной модели, пустого ключа, CORS, HTTP 401/5xx и корректность redaction секретов.

**Приёмка:** ошибка появляется у конкретного поля и сообщает действие; корректно заполненное поле не сопровождается лишними подсказками.

### 5. System prompt и случайное редактирование — [x]
- [x] Глобальный пользовательский prompt пуст по умолчанию; legacy built-in prompt мигрирует в пустое значение (PR #114).
- [x] Сохранён явный режим редактирования; prompt не подменяет системные правила приложения.
- [x] Старый restore Gemini defaults удалён.
- [ ] В итоговом визуальном проходе подтвердить заметность pencil/edit, focus и возврат в readonly.

**Приёмка:** пользовательский текст необязателен; защищён от случайной правки; никакой автоматической вставки скрытого default prompt.

### 6. Инструкции сторонних провайдеров — [~]
- [x] Обычный провайдерный поток общий; Kilo не выделен в отдельную особую настройку.
- [~] Удалить повторяющиеся provider explanations, но оставить короткие честные privacy notices там, где данные уходят внешнему оператору.
- [ ] Сверить каждую ссылку/инструкцию с актуальным upstream, не выдумывать endpoint или модельный ID.

**Приёмка:** инструкция — только необходимые шаги и специфические требования; никаких маркетинговых/устаревших описаний.

### 7. Tools и Tavily — [~]
- [x] Ключ Tavily находится в свёрнутом разделе инструментов/веб-поиска, отдельно от ключей провайдеров.
- [~] Автоматическая проверка/индикатор ключа должна быть подтверждена реальным вызовом, не только непустым полем.
- [ ] Проверить paste, сохранение, удаление, неверный ключ, публичные fallback источники, privacy copy.

**Приёмка:** веб Off действительно убирает web tools, но не заявляет, что облачная модель теперь работает offline; отсутствие Tavily не делает поиск/весь продукт сломанным.

### 8. Статус собственного gateway — [~]
- [x] Проверка требует реального model completion и health-check; изменение параметров сбрасывает connected state.
- [x] Автопроверка ограничена debounce/single-flight и не должна принимать HTTP 200 с proxy text за успех.- [~] В PR #121 убрана постоянная ручная кнопка проверки; поля/лампа должны отражать валидированное соединение.
- [ ] Проверить race/stale response, /healthz, model completion, timeout, CORS и очистку ключа на exact head.

**Приёмка:** зелёный статус означает реальный успешный probe + gateway health; после изменения любого credential зелёное состояние снимается.

### 9. Окна и закреплённые действия — [~]
- [x] Основные settings/project/research/function окна имеют отдельные закрытия.
- [x] Дублирующий data-action="close-settings" в header удалён; exact-head Chromium/Quality PR #121 passed.
- [x] Settings header с Save/X и нижние actions закреплены через sticky positioning; exact-head Chromium/Quality PR #121 passed. Короткий viewport, открытая iPhone keyboard и safe-area остаются ручной проверкой.
- [ ] Проверить Escape, focus return, screen reader name, scroll lock и background interaction.

**Приёмка:** Save/Close доступны в любом положении; каждое действие имеет уникальный однозначный selector; модалка не теряет keyboard focus.

### 10. Скроллинг и длинные чаты — [~]
- [x] Есть jump-to-latest, full message viewer и popover scrim/outside-tap behavior (PR #115 + предшествующие UI slices).
- [~] Проверить потоковую генерацию, вложенные скроллы, длинные сообщения/вложения, чат-список и модальные окна.
- [ ] Проверить экран 320px, динамическую клавиатуру и scroll restoration на iOS Safari.

**Приёмка:** прокрутка не скачет; первый тап снаружи закрывает поповер и не активирует control за ним; long chat остаётся usable.

### 11. Дополнительные настройки — [x]
- [x] Редкие параметры свёрнуты в «Дополнительные настройки».
- [x] Язык, motion, composer position и провайдеры сгруппированы отдельно от основной server card.
- [x] Отдельные настройки функций и проекта открываются контекстными модалками.
- [ ] Завершить аудит всех secondary controls на дубли/устаревшие toggle.

**Приёмка:** основная поверхность короткая; в дополнительном разделе только работающие параметры; группа сохраняет состояние и понятную семантику.

### 12. Тема, язык, анимации — [~]
- [x] Базовые theme/language state синхронизируются между header/sidebar/settings (PR #120/#121).
- [x] Есть reduced-motion стили для существующих анимаций.
- [x] Landing roadmap ticker запускается только в раскрытом пункте и поддерживает явную паузу/возобновление; [x] prefers-reduced-motion оставляет читаемый статичный текст. App ticker и пользовательский motion=off/reduced требуют exact-head проверки.
- [ ] Проверить полную RU/EN копию, светлую тему модалок, статусов, подсказок и Roadmap.

**Приёмка:** нет конкурирующих источников темы/языка; пользовательское системное preference соблюдается; содержание понятно без анимации.

### 13. Каталог моделей и provider state — [~]
- [x] Каталоги могут обновляться и фильтровать text model choices; credentials разнесены по provider.
- [~] Проверить сохранение выбранной модели при refresh, invalid catalog, устаревший fingerprint, auth failure и provider switch.
- [ ] Live provider smoke остаётся опциональным и требует явного согласия; mock E2E не выдавать за доступность реального аккаунта.

**Приёмка:** model catalog loaded ≠ model completion succeeded; эти состояния не смешиваются.

### 14. Project settings — [~]
- [x] Создание/редактирование проекта вынесено в отдельное окно; настройки memory scope сохраняются.
- [x] Проект, чаты и проектная память имеют разграниченные browser-local scopes.
- [~] В PR #121 E2E должен подтвердить modal close, persistence, создание и переключение проекта после текущих исправлений.
- [ ] Реальный multi-device sync/source indexing не входит в V1; не изображать его включённым.

**Приёмка:** настройки проекта не занимают постоянно sidebar; данные соседних проектов и личных чатов не смешиваются.

### 15. Search & Research Studio — [~]
- [x] Studio вынесена в отдельное окно; основная задача остаётся в composer.
- [~] PR #121 удалил дублирующие prompt/depth/web selectors и показывает текущие настройки чата. Исправлена проверка E2E, которая считала первичную provider connectivity probe отправкой пользовательского сообщения; exact-head run ещё требуется.
- [ ] Проверить на 390×844, клавиатуре, RU/EN, Escape, сохранение draft и отсутствие автоматической отправки.
- [ ] Исследовательский pipeline остаётся четырёхэтапным на одной модели; UI не называть независимой swarm-командой.

**Приёмка:** открытие/закрытие не меняет режимы; применение настроек меняет только режимы; текст запроса не дублируется в модалке.

### 16. Task profiles / skills — [~]
- [x] Профиль задачи привязан к чату и добавляет инструкции; он не выдаёт web/tools/data permissions.
- [x] Есть пресеты и собственные поля; навыки загружаются по требованию.
- [~] Проверить quiz flow, кастомный профиль, формат результата, переключение чата и сохранение.
- [ ] Не показывать несуществующие навыки как доступные runtime-пакеты.

**Приёмка:** выбранный профиль влияет на system/task guidance текущего чата, не активируя инструменты и не расширяя права.

### 17. Agents / team blueprint — [~]
- [x] Реальный четырёхэтапный pipeline прозрачно описан; конфигурация blueprint до 50 ролей может сохраняться.
- [x] UI предупреждает, что blueprint не создаёт 50 независимых агентов.
- [~] Внутри соответствующей открытой панели добавлен декоративный маркер 1nv3nt10n 1n PrOc3ss… с пояснением, что это не runtime/фоновой статус.
- [ ] Независимые роли, scheduler, policy engine, sandbox, approval и durable recovery — будущая реализация с отдельными tests/evals; не входят в V1.

**Приёмка:** не называть blueprint работающей командой; если команда появится — обязателен ограниченный orchestration contract, permission matrix, trace, cancel/retry и adversarial tests.

### 18. Финальный release gate — [~]
- [x] Основной код имеет Quality sentinels, Jekyll, Chromium E2E, published-site smoke и отдельные gateway/provenance workflows.
- [~] PR #121 был красным: duplicate settings close selectors, invalid regex in integrity sentinel и один неверный assertion around settings probe. Исправления внесены; повторный exact-head CI нужен.
- [ ] Проверить точный merge SHA, post-merge Pages deploy, опубликованный лендинг и приложение.
- [ ] Выполнить native iPhone Safari/keyboard/touch test вручную.
- [ ] Пересверить PR/Issues. Issue #111 остаётся открытым до реальных owner-only gates (ruleset/main governance, VPS, hardware/model, voice/device, licensed data corpus); не закрывать только ради нулевой очереди.

**Приёмка:** exact-head required checks green; published site проверен после merge; нет ложных обещаний о deployment/hosted AI; все остаточные ручные проверки подписаны как UNVERIFIED.

## 2. Лендинг — обязательная структура V1

- [x] Отдельный permalink /landing/; корневой URL приложения не заменяется.
- [x] Hero с CTA на рабочую среду и runbook.
- [x] Карточки возможностей и отдельная схема browser → tunnel → gateway → Ollama.
- [x] Статусы voice/docs/self-hosted и multi-user boundaries не выдаются за готовые.
- [~] Усилить copy: «бесплатный статический интерфейс» не означает «бесплатный inference», hosted AI endpoint не предоставляется.
- [~] Добавить открываемый Roadmap с маркером 1nv3nt10n 1n PrOc3ss… только у направлений, которые ещё разрабатываются/планируются.
- [~] Browser E2E на структуру/CTA, метаданные, отсутствие пустых ссылок, responsive 320/360/390/768/1024/1440px, Roadmap details и reduced-motion есть; добавлен тест pause/resume ticker (commit b213c8a); ожидается exact-head Chromium run.
- [~] E2E проверяет lang/title/description/canonical/CTA/непустые ссылки; Jekyll build проходит в текущем CI; фактический published Pages path требует успешного exact-head smoke после merge.

## 3. Правила для индикатора 1nv3nt10n 1n PrOc3ss…

Это **декоративный визуальный маркер roadmap**, а не сигнал о фоновой задаче, доступности сервиса, прогрессе deploy или текущем runtime.

- В лендинге анимация запускается только после раскрытия соответствующего details.- В приложении маркер находится только внутри раскрытой панели будущих agents/connectors.
- Движущийся текст имеет aria-hidden="true"; рядом всегда присутствует обычное текстовое пояснение.
- При prefers-reduced-motion: reduce и пользовательском motion=off/reduced анимация выключается, остаётся неподвижная подпись.
- Не использовать aria-live для бегущей строки и не обновлять её псевдо-процентами/фальшивыми фазами.
- Готовые функции не маркировать этим текстом. Для настоящего выполнения использовать реальные состояния queued/running/succeeded/failed/cancelled с источником и временем обновления.

## 3a. Остаток визуального polish после PR #121

Подробный живой реестр: [LANDING_UX_POLISH_BACKLOG_RU.md](LANDING_UX_POLISH_BACKLOG_RU.md). В нём собраны landing screenshot review, typography/contrast/spacing, RU/EN/light-dark, menus/popovers/dialog focus and sticky actions, sidebar/project/chat states, Research/Functions menu truthfulness, native iPhone Safari и VoiceOver. Реализовывать по шесть больших этапов, не повторяя закрытые PR #115–120.

## 4. Исследование UI — два раунда

### Раунд 1: текущие работающие решения и accessibility

**ChatGPT (официальные источники):**
- Sidebar Search ищет chats, projects, images и files; web поддерживает Ctrl+K/Cmd+K и фильтры по типу контента. Для aLandi это подтверждает полезность поиска по истории как отдельного будущего среза, но не делает его обязательным release blocker V1. [OpenAI Help Center — Finding your chats, projects, and files (updated 24 Oct 2026)](https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt)
- Pinned chats поднимаются в начало списка; на web действие находится в меню чата ⋯, на mobile — long-press. Перенимаем контекстное размещение редких действий и принцип быстрых важных элементов; не добавляем синхронизацию/сложную pin-management модель в V1. [ChatGPT release notes — Pinned chats](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- Не копируем весь ChatGPT sidebar: его объём зависит от account/workspace features. aLandi оставляет только работающие локальные разделы и явные runtime boundaries.

**Платформенные/стандартные практики:**
- **OpenAI / ChatGPT, актуальный web UX:** ChatGPT keeps Search in the sidebar for chats/projects/files; on web it supports Ctrl+K/Cmd+K and result-type filters. Pinned chats and projects are grouped separately from recent items, while a Project keeps chats, files and instructions together and exposes project-specific settings through its own menu. Для aLandi переносим только дешёвые принципы: одна точка поиска, приоритет важных/недавних элементов, контекстные project settings и отдельные границы проекта. Не копируем аккаунтную синхронизацию, Library, locked chats или функции Work/Codex. [Finding your chats, projects, and files](https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt); [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt); [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes).
- Apple HIG: sidebar предназначен для top-level areas/collections; popovers не следует переносить в compact views — для мобильного контекста лучше sheet/full-screen modal. Модальность применять только для отдельной задачи, которая выигрывает от фокуса; не превращать каждый control в окно. [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars); [Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers/); [Modality](https://developer.apple.com/design/human-interface-guidelines/modality).
- Apple HIG: отдельные search fields нужны для сфокусированного поиска по большому объёму контента; для V1 не добавлять глобальный поиск, пока локальные чаты/проекты/файлы не имеют единого индексируемого контракта. [Searching](https://developer.apple.com/design/human-interface-guidelines/searching).
- Nielsen Norman Group: progressive disclosure сначала показывает нужное большинству, редкое переносит во вторичный уровень; это помогает learnability, efficiency и снижает ошибки. [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- WCAG 2.2: 24×24 CSS px — AA minimum с оговорками; 44×44 CSS px — AAA enhanced target. Для часто используемых мобильных действий aLandi оставляет 44×44 CSS px как проектную цель, не приравнивая это к 44 pt Apple. [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum); [Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced).
- WCAG 2.2 требует видимого keyboard focus (2.4.7) и не допускает полного перекрытия сфокусированного control авторским контентом (2.4.11). [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible); [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum).
- GOV.UK: error messages должны сообщать, что произошло и как исправить ошибку; в aLandi — inline, у конкретного поля, с конкретным исправлением, без дублирования общего toast там, где поля достаточно. [GOV.UK error message](https://design-system.service.gov.uk/components/error-message/).
- MDN: мобильная клавиатура может уменьшать visual viewport, не меняя layout viewport; поэтому composer нельзя проверять только по desktop resize или статичному viewport. Использовать VisualViewport API как прогрессивный слой и подтверждать на iPhone Safari. [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport).
- MDN: уважать prefers-reduced-motion; continuous ticker не должен постоянно озвучиваться screen reader. В aLandi строка aria-hidden, рядом есть статическое пояснение, а анимация отключается при reduce и пользовательском motion=off/reduced. [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion); [aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live).
- **Автономность и безопасность:** OWASP предупреждает, что JavaScript на том же origin может прочитать localStorage и один XSS способен извлечь его содержимое. Поэтому browser BYOK storage — удобство, а не secure vault: не класть туда общий server/API secret, не обещать защищённость от XSS, не использовать ключи на общедоступных устройствах. Серверные shared secrets держать только на gateway. [OWASP HTML5 Security Cheat Sheet — Storage APIs](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html); [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
- **Связь с API:** браузерный fetch к стороннему origin зависит от CORS-заголовков целевого сервера; статический frontend не может сам разрешить CORS. Для приватного self-hosted маршрута использовать собственный HTTPS gateway; не подменять ошибку CORS скрытым provider fallback. [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).
- GitHub Pages доступен в публичном репозитории GitHub Free и публикует статические HTML/CSS/JS/Jekyll assets; он не запускает backend inference. Поэтому UI может быть бесплатной статической частью, но FastAPI/model inference должны быть отдельно развёрнуты и иметь собственный ресурсный/денежный бюджет. [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages); [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

### Раунд 2: что перенимаем, что не переносим

**Перенимаем:** компактную sidebar иерархию; быстрый поиск как отдельное намерение; контекстное chat menu для редких действий; pinned/frequent items как будущий улучшенный способ возврата к важному; один composer как место запроса; отдельные project settings; progressive disclosure; ясное разделение режима выполнения и ширины поиска; короткую status copy; inline field errors; reduced-motion и крупные touch targets.

**Не копируем:** платные Work/Codex-режимы, аккаунтную синхронизацию, огромный каталог интеграций, locked chats, сложную мультимодальную панель и модельные режимы, не имеющие эквивалента в первом бесплатном статическом клиенте. Не добавляем поиск по истории, pinning или new nav solely ради feature parity: сначала нужен конкретный пользовательский сценарий, минимальный implementation slice и E2E.

## 5. Приёмка и откат

- Browser suite: все существующие E2E плюс landing-specific smoke.
- Quality: integrity, security, context, Jekyll, Chromium и published Pages smoke на exact PR head.
- После merge: post-merge Pages deployment и browser smoke на опубликованной версии.
- Ручной gate: native iPhone Safari keyboard/safe-area/touch; live gateway/model only with owner-provided credentials/host; no secret material in PR/test artifacts.
- Rollback: revert bounded UI/landing commit(s); при поломке нового marquee отключить CSS class/section, не менять routing/provider logic. Для PR #121 не merge до зелёного exact-head CI.

## 6. Источники и дата проверки

Дата online review: 2026-10-30. Два раунда: (1) текущий ChatGPT/OpenAI web UX, Apple HIG, WCAG 2.2, GOV.UK, MDN, GitHub Pages и OWASP; (2) сопоставление каждого приёма с ограничениями V1 static client, выбор только low-cost/high-signal improvements и явный отказ от платных/серверных/аккаунтных функций, которых в aLandi нет. Это выборочный audit официальных и практических UX-источников, а не заявление, что просмотрены буквально все интерфейсы рынка.

- OpenAI Help Center — [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), проверено 2026-10-30; pinning on web, sidebar chat management.
- OpenAI Help Center — [Finding your chats, projects, and files](https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt), проверено 2026-10-30; search scope, filters and keyboard shortcut.
- Apple — [Human Interface Guidelines: Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars), updated 2026-06-08; sidebars for top-level collections, responsive compact alternatives.
- Nielsen Norman Group — [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/); reduce initial complexity, reveal rare controls on demand.
- W3C — [WCAG 2.2 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced); 44×44 CSS px at AAA, with exceptions.
- GOV.UK Design System — [Error message](https://design-system.service.gov.uk/components/error-message/); specific correction guidance.
- MDN — [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport); mobile keyboard can shrink the visual viewport independently of the layout viewport.
- MDN — [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion); honor OS motion preferences and remove non-essential continuous animation.
- OWASP — [HTML5 Security Cheat Sheet / Storage APIs](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html); localStorage is readable by same-origin JavaScript and vulnerable to XSS exfiltration.
- MDN — [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS); frontend fetch requires remote server opt-in through CORS headers.
- GitHub — [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages); Pages serves static sites, not application server processes.
- GitHub — [Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site); branch/folder source and Actions deployment are explicit publishing choices.

## 7. Change log

| Date | Change | Evidence |
|---|---|---|
| 2026-10-30 | Created V1-specific living checklist, distinct from whole-stack roadmap. | Current main/PR/issue inspection; first stack runbook and master principles. |
| 2026-10-30 | PR #121 test blockers recorded; duplicate settings close action, integrity parser, Research Studio E2E probe count fixed in branch. | Actions run #40989456177 logs; changes must be re-verified on new exact head. |
| 2026-10-30 | Added free UI vs inference cost boundary and staged public roadmap to landing. | Landing implementation on current feature branch; exact-head Jekyll/Chromium/Pages checks pending. |
| 2026-10-30 | Added innovation ticker for in-development Agent/Connector directions with reduced-motion and non-runtime caveat. | App and landing markup/CSS on feature branch; browser tests pending. |
| 2026-10-30 | Expanded two-round research with current ChatGPT search/projects/pinning patterns, Apple compact-view modality, VisualViewport/mobile keyboard, WCAG sizing, CORS and OWASP storage threat model. | Official OpenAI, Apple, W3C, MDN, OWASP, GOV.UK and GitHub sources linked in sections 4/6; recommendations filtered through V1 static/autonomy boundary. |


## 8. Дополнительные заметки владельца по интерфейсу (2026-10-31)

Этот раздел дополняет живой UI-чек-лист требованиями, продиктованными владельцем. Это backlog требований, а не подтверждение реализации. Перед изменениями сверять каждый пункт с текущим кодом и существующими пунктами выше; уже реализованное не дублировать и не ломать.

### 8.1 Левое меню, память, проекты и чаты

- Удалить из левого выдвижного меню кнопку «Поиск исследований».
- Добавить закрытие левого меню жестом свайпа.
- Блок «Настройки памяти» разместить над «Проектами»; по умолчанию он свёрнут, компактный и малозаметный. Строку состояния поставить над названием блока и сделать существенно меньше.
- Раскрытые настройки памяти оформить в стиле основного меню, без визуального мусора.
- При закрытии левого меню сворачивать только «Настройки памяти»; состояние блоков «Проекты» и «Чаты» сохранять.
- Внутри настроек памяти соблюдать порядок: добавление/создание записи; перечень отдельных участков памяти; отдельный блок факта для общей памяти; отдельный блок факта для личной памяти; в самом низу — checkbox разрешения использовать заметки личной памяти в контексте запросов.
- Пояснения общей и личной памяти спрятать в соответствующих сворачиваемых блоках, закрытых по умолчанию; формулировки сделать короткими и понятными.
- «Проекты» по умолчанию свёрнуты; кнопка «Создать проект» остаётся видимой. При раскрытии показывать список с тонкой ненавязчивой границей.
- Не добавлять отдельную кнопку «Настройки проекта» в главное меню. Справа в строке каждого проекта разместить небольшую шестерёнку для подробных настроек именно этого проекта.
- Создание проекта и полные настройки проекта — разные окна/действия. При создании доступны базовые настройки, полные — через шестерёнку.
- Не переносить автоматически текущий открытый чат в новый проект.
- Блок «Чаты» находится под проектами и по умолчанию раскрыт; плашка «Новый чат» всегда видна. Не создавать новый чат автоматически при открытии меню.
- Визуально блоки «Проекты» и «Чаты» должны быть согласованы: компактные прямоугольные плашки со скруглениями и тонкой границей.
- Предусмотреть восстановление последнего закрытого чата из локальной памяти как альтернативу автоматическому созданию нового.
- Добавить самостоятельную категорию «Без проекта» — это не проект. Она располагается первой, перед проектами, и раскрывается/сворачивается по аналогичным правилам.
- Чаты, принадлежащие проектам, не показывать в общем списке. При выборе проекта в блоке «Чаты» показывать только чаты этого проекта; «Новый чат» в этом режиме создаёт чат внутри выбранного проекта.
- Добавить стрелку «Назад» для возврата к общему режиму чатов, где доступны чаты без проекта и создание нового чата без проекта.
- Соблюдать иерархию размеров: отдельный чат меньше блока «Чаты», отдельный проект меньше блока «Проекты»; не расходовать лишнюю ширину и не оставлять пустое пространство.

### 8.2 Типографика, шапка и главная поверхность

- Подобрать более современный и аккуратный шрифт, менее шаблонный/заезженный. Допускается увеличить протяжённость текста по горизонтали, но не его высоту.
- Название текущего чата в шапке оформить как самостоятельный визуальный элемент, а не обычную строку текста.
- Wordmark «aLandi» сделать довольно крупным и стильным, с лёгким характером граффити, но без чрезмерно уличной стилистики.
- Кнопки «Быстро» и «Тщательно» сделать ниже и компактнее по вертикали, современнее и аккуратнее; не создавать дублирующие элементы.
- Циферблат сделать немного шире шапки, чтобы он слегка выступал за её края.

### 8.3 Настройки и провайдеры

- Организовать настройки в три сворачиваемых столбца/раздела: «aLandi Cloud», «Сторонние провайдеры», «Дополнительные настройки».
- При открытии «aLandi Cloud» два остальных раздела сворачиваются и недоступны для открытия, пока Cloud открыт.
- Предусмотреть обратное взаимоисключение: при открытии одного из остальных разделов «aLandi Cloud» закрыт/недоступен. Детали поведения двух остальных разделов уточнить при проектировании, не вводя дополнительных ограничений без необходимости.
- Не показывать aLandi Cloud в списке сторонних провайдеров.

### 8.4 Tavily и системный промпт

- Отдельно оценить необходимость сохранения функции/«Ключа Tavily» в связи с развитием собственного поиска. Это заметка на рассмотрение, не указание удалить функцию без проверки.
- Системный промпт — глобальная настройка приложения, не настройка отдельного чата. Требование владельца: значение по умолчанию пустое, без автоматической подстановки предустановленного текста.
- В существующем разделе 5 уже отмечено, что глобальный пользовательский prompt пуст по умолчанию и legacy built-in prompt мигрирует в пустое значение (PR #114). Поэтому считать это требование зафиксированным; не создавать повторную реализацию, а при следующем аудите проверить, что поведение всё ещё соответствует требованию и не регрессировало.

### 8.5 Правило дальнейшего ведения заметок

Новые UI-требования владельца добавлять в этот документ, в соответствующий подраздел, объединяя точные повторы. Не менять статус [x]/[~]/[ ] без проверки кода и тестов. Этот раздел фиксирует пожелания; реализация выполняется отдельным bounded change в рамках уже утверждённого стека V1 (HTML/CSS/JavaScript + Jekyll/GitHub Pages и существующий gateway), без самовольного расширения стека.

| Date | Change | Evidence |
|---|---|---|
| 2026-10-31 | Added owner-dictated sidebar, memory, projects/chats, typography/header, settings/provider, Tavily and global system-prompt requirements to the existing living UI checklist. | Consolidated from the current conversation; implementation status intentionally not inferred. |
