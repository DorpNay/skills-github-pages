# aLandi — финализация UI и лендинга первой версии

**Дата среза:** 2026-10-30  
**Ветка реализации:** feat/chat-settings-orthogonal-controls-20261030  
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

## 1. Требования владельца — 18 контрольных направлений

Статусы: **[x]** подтверждено кодом/тестом; **[~]** частично или ждёт exact-head/ручной проверки; **[ ]** не реализовано; **[!]** найден блокер/регрессия. Статусы ниже — на момент этого среза, до повторного полного CI на изменённом head.

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
- [x] Автопроверка ограничена debounce/single-flight и не должна принимать HTTP 200 с proxy text за успех.
- [~] В PR #121 убрана постоянная ручная кнопка проверки; поля/лампа должны отражать валидированное соединение.
- [ ] Проверить race/stale response, /healthz, model completion, timeout, CORS и очистку ключа на exact head.

**Приёмка:** зелёный статус означает реальный успешный probe + gateway health; после изменения любого credential зелёное состояние снимается.

### 9. Окна и закреплённые действия — [~]
- [x] Основные settings/project/research/function окна имеют отдельные закрытия.
- [!] В PR #121 обнаружены два data-action="close-settings" в header. Один должен остаться, иначе строгие browser locators неоднозначны. Исправление внесено, требуется повторный E2E.
- [~] Settings header уже содержит Save и X, но требование sticky при длинной прокрутке и открытой клавиатуре нужно проверить.
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
- [~] Новый roadmap ticker останавливается при prefers-reduced-motion и при пользовательском motion=off/reduced.
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
- [ ] Добавить browser E2E на структуру, CTA, responsive 320/390px, no horizontal overflow, открытие Roadmap details и reduced-motion.
- [ ] Проверить мета-теги, links, canonical URL, Jekyll output и published Pages path.

## 3. Правила для индикатора 1nv3nt10n 1n PrOc3ss…

Это **декоративный визуальный маркер roadmap**, а не сигнал о фоновой задаче, доступности сервиса, прогрессе deploy или текущем runtime.

- В лендинге анимация запускается только после раскрытия соответствующего details.
- В приложении маркер находится только внутри раскрытой панели будущих agents/connectors.
- Движущийся текст имеет aria-hidden="true"; рядом всегда присутствует обычное текстовое пояснение.
- При prefers-reduced-motion: reduce и пользовательском motion=off/reduced анимация выключается, остаётся неподвижная подпись.
- Не использовать aria-live для бегущей строки и не обновлять её псевдо-процентами/фальшивыми фазами.
- Готовые функции не маркировать этим текстом. Для настоящего выполнения использовать реальные состояния queued/running/succeeded/failed/cancelled с источником и временем обновления.

## 4. Исследование UI — два раунда

### Раунд 1: текущие работающие решения и accessibility

**ChatGPT (официальные источники):**
- Sidebar Search ищет chats, projects, images и files; web поддерживает Ctrl+K/Cmd+K и фильтры по типу контента. Для aLandi это подтверждает полезность поиска по истории как отдельного будущего среза, но не делает его обязательным release blocker V1. [OpenAI Help Center — Finding your chats, projects, and files (updated 24 Oct 2026)](https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt)
- Pinned chats поднимаются в начало списка; на web действие находится в меню чата ⋯, на mobile — long-press. Перенимаем контекстное размещение редких действий и принцип быстрых важных элементов; не добавляем синхронизацию/сложную pin-management модель в V1. [ChatGPT release notes — Pinned chats](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- Не копируем весь ChatGPT sidebar: его объём зависит от account/workspace features. aLandi оставляет только работающие локальные разделы и явные runtime boundaries.

**Платформенные/стандартные практики:**
- Apple: sidebar предназначен для top-level areas/collections и требует заметного пространства; узкие экраны выигрывают от компактной навигации. Отдельные search fields позволяют suggestions/recents и фильтрацию по scope, когда это оправдано задачей. [Apple HIG — Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars); [Searching](https://developer.apple.com/design/human-interface-guidelines/searching) (обновлено 8 Jun 2026).
- Nielsen Norman Group: progressive disclosure сначала показывает нужное большинству, редкое переносит во вторичный уровень; это помогает learnability, efficiency и снижает ошибки. [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- WCAG 2.2: 24×24 CSS px — AA minimum с оговорками; 44×44 CSS px — AAA enhanced target. Для часто используемых мобильных действий aLandi оставляет 44px как проектную цель. [Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced)
- WCAG 2.2 требует видимого keyboard focus (2.4.7) и не допускает полного перекрытия сфокусированного control авторским контентом (2.4.11). [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible); [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- GOV.UK: error messages помогают понять, что произошло и как исправить ошибку; ошибки следует проверять с реальными пользователями и отслеживать. [GOV.UK error message](https://design-system.service.gov.uk/components/error-message/)
- MDN: уважать prefers-reduced-motion; continuous ticker не должен постоянно озвучиваться ассистивными технологиями, если обновление не является основной функцией виджета. В aLandi визуальная строка aria-hidden, рядом есть статическое пояснение, а анимация отключается при reduce. [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion); [aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)
- GitHub Pages: доступен в публичных репозиториях GitHub Free и публикует статические HTML/CSS/JS/Jekyll assets; server-side languages не поддерживаются. Поэтому UI может быть бесплатной статической частью, но FastAPI/model inference должны быть отдельно развёрнуты/оплачены владельцем. [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages); [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

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

Дата online review: 2026-10-30. Два раунда: (1) current ChatGPT/OpenAI UI and standards research; (2) map each technique to the constraints of the V1 static client, selecting only low-cost/high-signal improvements. Это выборочный audit официальных и практических UX-источников, не заявление, что просмотрены буквально все интерфейсы рынка.

- OpenAI Help Center — [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), проверено 2026-10-30; pinning on web, sidebar chat management.
- OpenAI Help Center — [Finding your chats, projects, and files](https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt), проверено 2026-10-30; search scope, filters and keyboard shortcut.
- Apple — [Human Interface Guidelines: Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars), updated 2026-06-08; sidebars for top-level collections, responsive compact alternatives.
- Nielsen Norman Group — [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/); reduce initial complexity, reveal rare controls on demand.
- W3C — [WCAG 2.2 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced); 44×44 CSS px at AAA, with exceptions.
- GOV.UK Design System — [Error message](https://design-system.service.gov.uk/components/error-message/); specific correction guidance.
- MDN — [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion); honor OS motion preferences.
- GitHub — [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages); Pages serves static sites, not application server processes.

## 7. Change log

| Date | Change | Evidence |
|---|---|---|
| 2026-10-30 | Created V1-specific living checklist, distinct from whole-stack roadmap. | Current main/PR/issue inspection; first stack runbook and master principles. |
| 2026-10-30 | PR #121 test blockers recorded; duplicate settings close action, integrity parser, Research Studio E2E probe count fixed in branch. | Actions run #40989456177 logs; changes must be re-verified on new exact head. |
| 2026-10-30 | Added free UI vs inference cost boundary and staged public roadmap to landing. | Landing implementation on current feature branch; exact-head Jekyll/Chromium/Pages checks pending. |
| 2026-10-30 | Added innovation ticker for in-development Agent/Connector directions with reduced-motion and non-runtime caveat. | App and landing markup/CSS on feature branch; browser tests pending. |
