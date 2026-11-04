# aLandi — финализация UI и лендинга первой версии

**Дата среза:** 2026-10-30  
**Реализация:** PR #121 merged at `f4d880f`; Gateway readiness PR #122 merged at `fd4f0a1`.  
**Область:** публичный статический лендинг /landing/ и существующий браузерный клиент на корневом URL.  
**Не является:** планом полного автономного стека, обещанием бесплатного inference, доказательством развёртывания VPS/gateway или спецификацией публичного multi-user SaaS.

> **Source of truth.** Этот документ — живой release checklist пользовательского UI V1. Статус отмечается только по коду, exact-head тестам и фактическим проверкам. Планируемое не называется реализованным; CI не доказывает работу реального gateway, модели или iPhone Safari.

> **Актуальность очереди:** старые пункты разделов 1–7 сохранены для истории V1. Их незакрытые отметки не следует автоматически считать задачами V2: актуальная объединённая очередь — раздел 8.0, а реализационные статусы 8.1–8.17 — docs/LANDING_UI_V2_IMPLEMENTATION_RU.md.

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

### 15. Глубокие исследования — Research Studio — [~]
- [x] Research Studio — вспомогательное окно внутри блока «Тщательно»/глубокого исследования; самостоятельного пункта в меню «Функции» или боковой панели нет.
- [x] Окно показывает текущие настройки чата; основной запрос остаётся в composer. Открытие/закрытие не запускает запрос и не меняет параметры.
- [~] E2E проверяет открытие из блока глубокого исследования, сохранение draft, RU/EN, Escape и отсутствие автоматической отправки; требуется exact-head Chromium.
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

## 3a. Статус polish после PR #121 и перехода на V2

Старый отдельный перечень polish пересобран: его пункты сверены с PR #131 и требованиями 8.1–8.17. Дублирующие задачи больше не ведутся параллельно. Актуальный остаток находится в разделе **8.0 «Единый список незавершённых UI-задач»** и в подробном implementation ledger [LANDING_UI_V2_IMPLEMENTATION_RU.md](LANDING_UI_V2_IMPLEMENTATION_RU.md). Файл [LANDING_UX_POLISH_BACKLOG_RU.md](LANDING_UX_POLISH_BACKLOG_RU.md) оставлен как совместимый краткий реестр тех же остаточных проверок, а не как второй независимый план.

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
| 2026-11-02 | Added optional 8.28 capability-catalogue/agent-and-skill management proposal after auditing the existing Functions menu, Agent/Skills panels, tickers and Playwright assertions; existing implementation is not duplicated. | PR #131 source (`index.md`, `assets/js/app.js`, `assets/css/app.css`, `tests/e2e/app.spec.mjs`); assertions located but not executed on the current HEAD. |
|---|---|---|
| 2026-10-30 | Created V1-specific living checklist, distinct from whole-stack roadmap. | Current main/PR/issue inspection; first stack runbook and master principles. |
| 2026-10-30 | PR #121 test blockers recorded; duplicate settings close action, integrity parser, Research Studio E2E probe count fixed in branch. | Actions run #40989456177 logs; changes must be re-verified on new exact head. |
| 2026-10-30 | Added free UI vs inference cost boundary and staged public roadmap to landing. | Landing implementation on current feature branch; exact-head Jekyll/Chromium/Pages checks pending. |
| 2026-10-30 | Added innovation ticker for in-development Agent/Connector directions with reduced-motion and non-runtime caveat. | App and landing markup/CSS on feature branch; browser tests pending. |
| 2026-10-30 | Expanded two-round research with current ChatGPT search/projects/pinning patterns, Apple compact-view modality, VisualViewport/mobile keyboard, WCAG sizing, CORS and OWASP storage threat model. | Official OpenAI, Apple, W3C, MDN, OWASP, GOV.UK and GitHub sources linked in sections 4/6; recommendations filtered through V1 static/autonomy boundary. |


## 8. Требования владельца по интерфейсу и актуальный backlog (2026-10-31)

Этот раздел дополняет живой UI-чек-лист требованиями, продиктованными владельцем. Это backlog требований, а не подтверждение реализации. Перед изменениями сверять каждый пункт с текущим кодом и существующими пунктами выше; уже реализованное не дублировать и не ломать.

## 8.0. Единый список незавершённых UI-задач (сверка 2026-11-02)

Этот список заменяет разрозненные «остатки» в разделах 1–7 и старом polish backlog. Разделы 1–7 сохраняются как история требований и базовый V1 release checklist, но их старые отметки [~]/[ ] **не являются отдельной очередью работ PR #131**. Если задача ниже совпадает с 8.1–8.17, она учитывается здесь один раз; подробная привязка к коду и тестам — в implementation ledger. Дополнительные предложения владельца 8.18–8.28 приведены после 8.17 отдельно: это кандидаты на развитие V2.0, а не обязательные требования и не release blockers.

### P0 — обязательная автоматическая проверка PR #131

- [x] Exact-head Quality #1252 / run `41365833770` проверил documentation HEAD `63f429ccf16fe7648519ebb3ecc02b9f8949ad53` (кодовой HEAD `f3151472e285c7d31d46809f52337202eb15e6b3`): все четыре real Chrome shards — PASS; preflight, static analysis, Integrity, Security, Context и Jekyll — PASS. Published-site smoke skipped; это не deployment/live-preview evidence.
- [x] Новый exact-head Quality #41411404686 на code/test HEAD `1ec4a1d338975934a9cbefa3f3a262ad97ee118f`: 4/4 Chromium shards, 147 tests PASS; syntax, Ruff/static analysis, Jekyll, Integrity, Security и Context PASS. Published-site smoke skipped; это не deployment/live-preview evidence.
- [x] Exact code-head Quality #1250 / run `41364775725` на `f3151472e285c7d31d46809f52337202eb15e6b3` прошёл после расширения E2E для 8.13: reload с неактивным target chat и reload, когда target chat уже активен; one-shot handoff проверен.
- [x] Provenance #976 / run `41365833791` на documentation HEAD `63f429ccf16fe7648519ebb3ecc02b9f8949ad53` завершился success.
- [x] Direct workflow references: 13 workflow-файлов, 33 внешних `uses:` references; все 33 закреплены полными 40-character commit SHA на `main` и PR branch.
- [~] **Transitive action pinning остаётся открытым:** pinned reusable workflows из `skills/exercise-toolkit` внутри себя вызывают mutable tags (`actions/checkout@v6`, `actions/github-script@v9`, `EndBug/add-and-commit@v10`, `skills/action-text-variables@v4`). Сам reusable workflow закреплён SHA, но вложенные action refs нет; нужен отдельный scope/PR либо upstream fix.
- [x] Quality автоматически запускается на push и pull_request. Owner не должен вручную запускать workflow или выполнять локальные CI-команды.
- [x] 8.13: pending context хранится в tab-scoped `sessionStorage` (только chat/project IDs), восстанавливается после reload для active/inactive target, consumes once; чат не создаётся и не меняет project membership.
- [~] Остаточные автоматические UI assertions 8.1–8.17 продолжают выполняться в PR #131; зелёный CI не закрывает ручные native-device и visual gates.
- [x] Gateway security/contract suite: run #640 на `6f7fde485b2b13aecc50523b20785e0ac615d2ad` прошёл compileall, manifest/INTEL checks, `pytest gateway/tests`, deploy preflight и шесть offline-evaluation layers. Между этим tested commit и текущим PR source нет изменений `gateway/**`; sub-gate остаётся применимым.

### P1 — ручная UX/accessibility приёмка

- [~] Chromium screenshot review приложения выполнен на 320/360/390/768/1024/1440 px и с открытым sidebar (desktop/mobile); найденные квадратные glyphs в проектной навигации исправлены. Отдельный публичный /landing screenshot pass, светлая тема, контраст реальных компонентов и ручной iPhone review остаются открыты.
- [ ] На реальном iPhone Safari проверить virtual keyboard/VisualViewport, safe-area, ориентацию, edge-swipe, long-press, touchcancel, вложенный scroll и восстановление позиции.
- [ ] Провести VoiceOver/keyboard-only проход: порядок заголовков, доступные имена и tooltips, видимый/неперекрытый focus, Tab/Escape/Back/Forward, возврат фокуса и modal background isolation.
- [ ] Проверить RU/EN copy и светлую/тёмную темы для модалок, меню, статусов, ошибок, подсказок и пустых состояний.
- [ ] Провести фактический WCAG contrast-ratio audit для primary/secondary/disabled/link/error/status в обеих темах. Добавлен автоматический расчёт базовых CSS-токенов против однотонных theme surfaces (все измеренные значения ≥4.5:1), но это не проверяет градиенты, реальные карточки, focus/hover, мелкий текст и non-text contrast. Полная визуальная/ручная приёмка остаётся обязательной.

### P2 — оставшиеся проверки поведения и честности UI

- [ ] Проверить длинные списки проектов/чатов, длинные имена и сообщения, пустые состояния, вложенные scroll-контейнеры и popover у всех краёв viewport/при открытой клавиатуре.
- [ ] Завершить аудит меню функций «Исследование / Агенты / Навыки / Коннекторы»: показывать только реально зарегистрированные сущности, реальные статусы и permissions; чётко отличать web-search breadth, offline и последовательный research pipeline от независимых агентов.
- [ ] Повторно проверить глобальный пустой system prompt и миграцию legacy значения; решение по Tavily принимать только после аудита keyless search fallback и реального adapter contract.
- [ ] Проверить provider/gateway error states, invalid URL/model, CORS, timeout, 401/5xx и redaction на mock/contract tests. Live provider/gateway smoke — отдельный opt-in gate владельца, без платных запросов по умолчанию.

### P1 — Унаследованные UI-задачи из разделов 1–7 (сверка и объединение)

Старые отметки ниже не создают параллельный backlog: это остаточные требования V1, которые включены в соответствующие workstreams 8.1–8.17.

| № до 8 | Статус в исходном списке | Остаточная задача простыми словами | Включено в |
|---|---|---|---|
| **1. Общий UI/UX** | [~] | Довести типографику, контраст, интервалы, пустые/ошибочные состояния и вторичные действия; затем проверить реальные скриншоты. | 8.2, 8.6, 8.10, 8.15–8.17 |
| **2. Composer и мобильная клавиатура** | [~] | Проверить верхнее/нижнее положение поля ввода, клавиатуру, VisualViewport, safe-area, длинный текст и сохранение позиции чтения. | 8.2, 8.6, 8.9, 8.14 |
| **3. Маршруты aLandi и сторонних API** | [~] | Проверить старые сохранённые настройки, RU/EN и то, что приватный маршрут aLandi не уходит к стороннему провайдеру. | 8.3, 8.11 |
| **4. Подписи, placeholder и inline validation** | [~] | Довести ошибки URL/модели/ключа, CORS, 401/5xx и скрытие секретов; показывать ошибку у конкретного поля. | 8.3, 8.9, 8.10 |
| **5. System prompt и случайное редактирование** | [x] | Основная функция решена: пустое значение по умолчанию и явное редактирование. Осталась финальная проверка заметности, клавиатуры и возврата в readonly. | 8.4, 8.10, 8.16, 8.17 |
| **6. Инструкции сторонних провайдеров** | [~] | Убрать повторения, оставить честные privacy-предупреждения и сверить ссылки/endpoint с upstream. | 8.3, 8.6 |
| **7. Tools и Tavily** | [~] | Проверить реальную проверку ключа, вставку/сохранение/удаление, неверный ключ, публичный fallback и privacy copy. | 8.4, 8.6, 8.15 |
| **8. Статус собственного gateway** | [~] | Проверить реальный model probe + /healthz, timeout, CORS и гонки при смене URL/модели/ключа. | 8.3, 8.9 |
| **9. Окна и закреплённые действия** | [~] | Довести Escape, возврат фокуса, screen-reader labels, scroll lock и фоновые клики при открытой модалке. | 8.6, 8.9, 8.10 |
| **10. Скроллинг и длинные чаты** | [~] | Проверить потоковую генерацию, вложенные области прокрутки, длинные сообщения/вложения и iOS scroll restoration. | 8.1, 8.2, 8.6, 8.14 |
| **11. Дополнительные настройки** | [x] | Основная группировка решена; осталось найти дублирующие или устаревшие переключатели. | 8.3, 8.6, 8.10 |
| **12. Тема, язык, анимации** | [~] | Проверить весь RU/EN текст, светлые/тёмные модалки, статусы, подсказки и reduced-motion. | 8.2, 8.11, 8.15, 8.17 |
| **13. Каталог моделей и provider state** | [~] | Проверить сохранение модели, пустой/ошибочный каталог, устаревший fingerprint, отказ авторизации и смену провайдера. | 8.3, 8.4 |
| **14. Project settings** | [~] | Довести создание/редактирование/закрытие, сохранение параметров и изоляцию данных разных проектов. | 8.1, 8.6, 8.7, 8.13 |
| **15. Search и Research Studio** | [~] | Проверить мобильный экран, клавиатуру, RU/EN, Escape, сохранение черновика и отсутствие самовольной отправки. | 8.6, 8.15 |
| **16. Task profiles / skills** | [~] | Проверить quiz, пользовательский профиль, формат ответа и сохранение между чатами; не выдавать профиль за runtime-пакет. | 8.6, 8.15, 8.16 |
| **17. Agents / team blueprint** | [~] | Честно отделять четырёхэтапный pipeline на одной модели от независимой команды агентов; blueprint не должен обещать несуществующий runtime. | 8.6, 8.15, 8.16 |
| **18. Финальный release gate** | [~] | Exact-head CI, проверка опубликованного сайта после merge, iPhone Safari и owner-only инфраструктурные проверки. Это gate, не UI-функция. | P0/P1 gates |

**Уже взято в работу в рамках текущего прохода:** двуязычная inline-валидация aLandi aServi и доступная связь поля с ошибкой; локализация cloud controls и system-prompt edit action; keyboard/edit/read-only E2E; защита от устаревшего ответа /healthz; сохранение позиции чтения чата при mobile viewport resize; снижение Chromium runner contention и тяжёлой записи диагностик.

### Не является незавершённой UI-задачей

- Project Sources: gateway пока не предоставляет source-list API. Оставить честное unsupported-state; CRUD не добавлять до появления реального scoped API.
- 8.12: устаревший server-memory graph HTTP bridge/UI удалён; обычная local/private/shared/project memory, delta sync и RAG сохранены. Осталась только автоматическая проверка на exact HEAD.
- 8.13: handoff контекста выполняется только по явному выбору существующего чата; чат не создаётся и не перемещается. Pending handoff хранится в `sessionStorage` текущей вкладки (только ID чата и проектов), переживает reload, валидируется по существующим чатам/проектам и потребляется ровно одним запросом. Это не project membership и не автоматическая инъекция памяти.
- Новые провайдеры, connector marketplace, cloud sync, OAuth и новые runtime-возможности из раздела 9 не входят в текущую UI-реализацию PR #131 без отдельного решения владельца.

### Приоритетные требования 8.1–8.17 от 2026-10-31 — V2.0


**Реализация V2.0:** требования 8.1–8.17 ведутся отдельно в [docs/LANDING_UI_V2_IMPLEMENTATION_RU.md](LANDING_UI_V2_IMPLEMENTATION_RU.md) и PR [#131 — aLandi Landing UI v2.0](https://github.com/DorpNay/skills-github-pages/pull/131). V1 в `main` остаётся стабильной; PR #131 не сливать и не публиковать до отдельного разрешения владельца. Статусы исходных требований не менять без подтверждённого кода и тестов.


> **Приоритетный пакет для лендинга версии 2.0.** Все требования подразделов **8.1–8.17** ниже зафиксированы/уточнены владельцем **31 октября 2026 года**. Это актуальные поправки и приоритетные изменения, которые необходимо учесть при проектировании и реализации лендинга aLandi V2.0. Они **не считаются выполненными** и не должны незаметно переноситься в замороженный состав V1. Перед реализацией сверять их с кодом и архитектурой; сохранять действующие ограничения безопасности и согласованный стек, если владелец отдельно не утвердит иное.

### 8.1 Левое меню, память, проекты и чаты

- Удалить из левого выдвижного меню кнопку «Поиск исследований».
- Добавить закрытие левого меню жестом свайпа. E2E покрывает горизонтальный close, вертикальный scroll, touchcancel и pointercancel; системные/native iPhone Safari gestures остаются ручным gate.
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
- Согласовать название страницы, browser title и метаданные Jekyll/SEO с продуктовым именем aLandi; явно объявить поддержку светлой и тёмной системных цветовых схем.

### 8.3 Настройки и провайдеры

- Организовать настройки в три сворачиваемых столбца/раздела: «aLandi aServi», «Сторонние провайдеры», «Дополнительные настройки».
- При открытии «aLandi aServi» два остальных раздела сворачиваются и недоступны для открытия, пока aServi открыт.
- Предусмотреть обратное взаимоисключение: при открытии одного из остальных разделов «aLandi aServi» закрыт/недоступен. Детали поведения двух остальных разделов уточнить при проектировании, не вводя дополнительных ограничений без необходимости.
- Не показывать aLandi aServi в списке сторонних провайдеров.

### 8.4 Tavily и системный промпт

- Отдельно оценить необходимость сохранения функции/«Ключа Tavily» в связи с развитием собственного поиска. Это заметка на рассмотрение, не указание удалить функцию без проверки.
- Системный промпт — глобальная настройка приложения, не настройка отдельного чата. Требование владельца: значение по умолчанию пустое, без автоматической подстановки предустановленного текста.
- В существующем разделе 5 уже отмечено, что глобальный пользовательский prompt пуст по умолчанию и legacy built-in prompt мигрирует в пустое значение (PR #114). Поэтому считать это требование зафиксированным; не создавать повторную реализацию, а при следующем аудите проверить, что поведение всё ещё соответствует требованию и не регрессировало.

### 8.5 Правило дальнейшего ведения заметок

Новые UI-требования владельца добавлять в этот документ, в соответствующий подраздел, объединяя точные повторы. Не менять статус [x]/[~]/[ ] без проверки кода и тестов. Этот раздел фиксирует пожелания; реализация выполняется отдельным bounded change в рамках уже утверждённого стека V1 (HTML/CSS/JavaScript + Jekyll/GitHub Pages и существующий gateway), без самовольного расширения стека.


### 8.6 Навигация и общая визуальная эргономика

- При открытии вложенного меню или экрана кнопка/действие «Назад» возвращает на непосредственно предыдущий уровень навигации, а не на главный экран. История переходов должна быть последовательной и предсказуемой; проверять вложенные меню, включая настройки проекта.
- Заголовок списка должен быть визуально однозначно связан именно со своим списком: использовать согласованные отступы, интервалы, размеры и контраст. Не допускать ситуации, когда заголовок воспринимается как относящийся к соседнему блоку.
- Соблюдать общую систему визуальной иерархии и размеров по всему сайту: заголовки, подписи, группы, списки и элементы управления должны иметь понятные отношения и единообразные интервалы.
- Внутренние меню и экраны, в том числе настройки проекта, делать минималистичными, легко читаемыми и не перегруженными. Связанные параметры группировать; визуально отделять независимые группы без избыточных рамок и декора.
- Эти требования дополняют общий UI/UX и существующие пункты о размерах, отступах и настройках; не создавать дублирующие локальные правила.

### 8.7 Настройки проекта и раздел «Источники»

- В настройках каждого проекта предусмотреть самостоятельный раздел «Источники»: проект может иметь собственные источники информации, относящиеся к его контексту.
- Раздел должен быть понятным местом для просмотра и дальнейшего управления источниками проекта. Конкретные поддерживаемые типы источников, операции и состояния определить после аудита текущего кода и существующих механизмов.
- До аудита не обещать неподдерживаемые типы источников и не добавлять фиктивные действия. Сам раздел «Источники» и его окно/структура остаются видимыми заранее; для незавершённой части показывать единый ticker «В разработке». Не дублировать существующие механизмы хранения, загрузки или подключения.
- Разместить раздел в общей структуре настроек проекта так, чтобы он был логически связан с остальными настройками, но оставался самостоятельным и легко обнаруживаемым.


| Date | Change | Evidence |
|---|---|---|
| 2026-10-31 | Added owner-dictated sidebar, memory, projects/chats, typography/header, settings/provider, Tavily and global system-prompt requirements to the existing living UI checklist. | Consolidated from the current conversation; implementation status intentionally not inferred. |

### 8.8 Иконки действий сообщений

- Действия «Копировать», «Открыть целиком» и «Озвучить» по возможности показывать компактными понятными иконками вместо текстовых кнопок.
- Использовать единый стиль иконок; для неоднозначных действий предусмотреть tooltip и доступное имя для assistive technologies.
- Сохранять удобную touch-area на мобильных устройствах.
- В полном/развёрнутом представлении сообщения действия «Копировать» и «Озвучить» также должны оставаться доступными в виде иконок.
- Не допускать расхождения между компактным и полным представлением по доступности этих действий.

### 8.9 Жизненный цикл backdrop и затемнения окон

- При закрытии диалога/окна затемняющий backdrop должен исчезать одновременно с ним, без дополнительного клика.
- Не оставлять невидимый или остаточный overlay, который затемняет интерфейс, блокирует прокрутку или перехватывает клики.
- Проверить закрытие крестиком/кнопкой, кликом вне окна, Escape, переход между окнами и быстрое повторное открытие.
- Исключить конфликты нескольких окон, дублирующиеся backdrop и зависшие состояния.
- Проверить мобильные viewport и повторные циклы открытия/закрытия.
- Критерий приёмки: после штатного закрытия интерфейс сразу полностью интерактивен и не затемнён.

### 8.10 Единая система размеров интерактивных элементов

- Унифицировать размеры кнопок, полей, переключателей, выпадающих списков, меню и других контролов: высоту/ширину, padding, радиусы, интервалы и hit-area.
- Использовать компактные и эргономичные пропорции; одинаковые по назначению элементы не должны случайно различаться между разделами.
- Не требовать одной геометрии для всех элементов: основные кнопки, вторичные действия и иконки могут иметь разные варианты в рамках единой дизайн-системы.
- Сохранить удобные мобильные зоны нажатия.
- Перед реализацией провести аудит существующих CSS-токенов и переиспользовать текущую систему, а не создавать параллельный набор.

### 8.11 Компактная группа темы и языка в шапке

- Существенно уменьшить визуальный размер кнопки смены темы.
- Рядом разместить отдельную кнопку выбора языка такого же размера.
- Оформить обе кнопки как компактную согласованную группу, не перегружающую шапку.
- Сохранить доступность, удобную область нажатия и адаптивное поведение на узких экранах.

### 8.12 Удаление функции «Серверная память (Эксперимент)»

- Полностью исключить из продукта одну функцию с точным названием «Серверная память (Эксперимент)», включая связанные пункты интерфейса, меню, настройки, переключатели, подсказки и устаревшие упоминания.
- Речь об одной функции, а не о двух независимых функциях.
- Перед удалением проверить зависимости, миграции и обращения из других частей приложения.
- Не затрагивать обычную локальную память и независимые механизмы памяти.
- Требование означает удаление функциональности, а не временное скрытие элемента интерфейса.

### 8.13 Управление передачей проектного контекста в чат

- Убрать из настроек чата checkbox «Использовать память выбранного проекта в этом чате».
- Не подключать проектную память к каждому чату автоматически только на основании его принадлежности проекту.
- Разделять два понятия: хранение/память проекта и явную передачу выбранного контекста в конкретный чат.
- Если соответствующий механизм реально существует, предусмотреть в настройках проекта отдельное действие наподобие «Передать контекст в чат»: показать существующие чаты и дать пользователю выбрать целевой.
- Не создавать новый чат автоматически и не менять принадлежность выбранного чата к проекту при передаче контекста.
- Передавать контекст только после явного действия пользователя.
- Если отдельная возможность ещё не реализована, не скрывать её будущий раздел или окно: заранее выстраивать структуру и настройки, а в незавершённой области показывать единый ticker «В разработке». При этом нельзя имитировать успешное выполнение, отправку или изменение данных; недоступные действия явно блокируются либо объясняются через ticker.

### 8.14 Предотвращение случайного выделения интерфейса на touch-устройствах

- Исправить ситуации, когда удержание пальца на кнопке/контроле приводит к выделению текста или почти всего интерфейса.
- Настроить `user-select`, `-webkit-user-select` и `touch-action` точечно для интерактивных областей, не отключая выделение глобально.
- Обычный текст сообщений должен оставаться выделяемым и копируемым.
- Проверить мобильные браузеры, long-press, свайпы, кнопки и поля ввода.
- Критерий приёмки: удержание на интерактивном элементе не выделяет весь экран; выделение пользовательского содержимого продолжает работать.

### 8.15 Строки состояния и бегущие строки

- Строки состояния и бегущие строки визуально центрировать.
- Использовать умеренные цвета, помогающие различать смысл состояния: нейтральное, информационное, успешное, предупреждение и ошибка.
- Не применять чрезмерно яркие оттенки и не ухудшать контраст.
- Сохранять читаемость в светлой и тёмной темах, на мобильных экранах и при отключённой анимации.
- Не подменять реальное состояние декоративной анимацией или фиктивным прогрессом; соблюдать уже установленные правила reduced-motion и доступности.

### 8.16 Типографика и содержимое кнопок: единый стандарт и icon-first

- Размер, начертание и пропорции текста в кнопках должны соответствовать единой типографической шкале и размеру самого контрола.
- Текст и иконки аккуратно выравнивать по горизонтали и вертикали; выдерживать единые отступы, интервалы и визуальный баланс.
- Не допускать случайных различий в одинаковых по назначению кнопках.
- Если действие можно однозначно и понятно обозначить иконкой, предпочитать иконку вместо текстовой кнопки.
- Для неоднозначных иконок добавлять подсказку и доступное имя для assistive technologies; не заменять иконкой текст там, где смысл действия станет неясным.
- Сохранять удобные touch-area, особенно на мобильных устройствах.

### 8.17 Настраиваемая читаемость текста в светлой и тёмной темах

- Предоставить пользователю доступные настройки читаемости/цветового оформления текста; не ограничиваться внутренне выбранными разработчиком значениями.
- По умолчанию подобрать гармоничные цвета и достаточный контраст для обеих тем.
- Дать пользователю возможность самостоятельно настроить соответствующие параметры, если стандартные значения ему не подходят.
- Не перегружать настройки: названия, диапазоны и результат изменения должны быть понятными; изменения должны корректно работать в обеих темах.
- Проверять контраст и состояния текста (обычный, вторичный, disabled, ссылки, ошибки, статусы), а не только основной цвет.
- В системном режиме Windows Forced Colors сохранять заметный клавиатурный фокус и различимые границы интерактивных элементов; не полагаться только на собственную настройку high contrast.


### 8.18–8.28. Дополнительные предложения владельца для aLandi V2.0

**Статус: PRODUCT PROPOSALS / CANDIDATES, не обязательные требования и не release blockers.** Зафиксированы 2026-11-02 по предложению владельца. Их нужно реализовывать выборочно, после сверки с существующими механизмами. Порядок ниже — рекомендуемая последовательность, а не обещание включить всё в один релиз. Не создавать второй backlog: это продолжение единого реестра 8.0.

#### 8.18. Единый контракт интерактивных поверхностей — P1

- Использовать уже существующий uiNavigationStack, History API и modal lifecycle как основу, а не создавать параллельный менеджер навигации.
- Описать единый контракт открытия/закрытия для modal, sheet, popover, sidebar и будущих docked panels: источник открытия, topmost layer, close reason, focus origin, scroll owner и history entry.
- Унифицировать backdrop/outside click, Escape, browser Back/Forward, focus return, scroll lock, анимацию входа/выхода и очистку состояния при быстром повторном открытии.
- Для каждого слоя определить, закрывает ли outside click только верхний слой; первый tap не должен активировать control за закрывающимся слоем.
- Запоминать локальное положение прокрутки при переходе между вложенными экранами, не смешивая его с прокруткой чата.
- Сохранять pointercancel/touchcancel cleanup и не перехватывать системные edge gestures.
- **Приёмка:** нет двойного Back, зависшего backdrop, потерянного focus, scroll jump или двойного действия при серии быстрых открытий/закрытий; тестируются клавиатура, touch и browser history.

#### 8.19. Единая система уведомлений и состояний операций — P1

- Развить существующие showToast и showStatus, не создавать третью конкурирующую систему статусов.
- Разделить долговечное состояние операции (idle / pending / succeeded / failed / cancelled) и краткое уведомление о результате. Таймер может скрыть только подтверждение успеха, но не должен объявлять операцию завершённой.
- Связывать async-операции с устойчивым operationId: повторное обновление статуса изменяет существующее уведомление, а не создаёт копию.
- Для success использовать ненавязчивое краткое подтверждение; для pending — видимый процесс без фиктивного процента; для ошибки — конкретное объяснение и следующий шаг рядом с соответствующим контролом.
- Важные ошибки не исчезают автоматически, пока пользователь не увидел их или не устранил причину. Повторные одинаковые события дедуплицируются по operation/error key.
- Учитывать aria-live: обычные сообщения — polite/status, срочные ошибки — alert; уведомления не забирают фокус.
- Позиционировать уведомления с учётом safe-area, клавиатуры, composer и доступной области экрана; не перекрывать поле ввода и критические кнопки.
- **Приёмка:** интерфейс всегда различает «не начато», «выполняется», «успешно», «ошибка» и «отменено» на основании реального результата операции.

**Частичная реализация 2026-11-02:** существующий toast получил FIFO-очередь, дедупликацию одинаковых сообщений в очереди/активном состоянии, разные интервалы показа, паузу при hover/focus/скрытой вкладке и семантику polite/status против assertive/alert. Добавлены Playwright assertions для последовательного success → error и ARIA. Это только presentation/accessibility slice: durable operation states/IDs, pending-to-result updates, persistent unacknowledged errors и inline recovery actions ещё не реализованы; 8.19 остаётся незавершённым. Browser execution на текущем HEAD пока не подтверждён.

#### 8.20. Ограниченная история Undo — P2

- Расширить существующее восстановление последнего закрытого чата, не дублировать его отдельным механизмом.
- Рассмотреть обратимые локальные действия: удаление чата, переименование чата/проекта, перемещение чата между проектами, изменения локальных настроек и будущие перемещения файлов.
- Реализовать небольшой bounded command history с обратной операцией и сохранённым исходным состоянием; объединять серию быстрых изменений одного поля в одну запись.
- Для удаления проекта учитывать каскадное удаление чатов как одну транзакцию, либо оставить явное необратимое подтверждение до появления безопасного snapshot/restore.
- Не обещать Undo для внешнего API-запроса, оплаты, отправленного сообщения или другого побочного эффекта, который невозможно отменить на стороне получателя.
- Не превращать это в полное версионирование, синхронизацию или redo-систему без доказанной необходимости.
- [~] Первый ограниченный срез: Undo перемещения чата между проектами доступен действием в существующем toast; отмена применяется только если чат не менялся повторно и исходный проект ещё существует. Окно действия ограничено жизненным циклом toast; это не persistent command history и не Undo удаления/переименования/каскадного удаления.
- [~] Первый ограниченный срез: Undo перемещения чата между проектами доступен действием в существующем toast; отмена применяется только если чат не менялся повторно и исходный проект существует. Покрыты оба входа: selector текущего чата и контекстное меню строки чата. Окно ограничено жизненным циклом toast; это не persistent command history и не Undo удаления/переименования/каскадного удаления.
- [~] Ограниченный Undo покрывает перемещение чата (selector и chat-row menu), удаление чата (существующий last-closed recovery slot) и переименование. Каждая отмена проверяет, что исходное состояние не изменилось повторно; move также проверяет исходный проект, delete — владельца recovery slot. Это не persistent command history; project cascade/settings остаются вне Undo. После клавиатурной отмены фокус возвращается к строке чата (fallback — composer).
- **Приёмка:** Undo возвращает точное предыдущее состояние, не теряет новые данные и явно сообщает, если срок/контекст отмены истёк.

#### 8.21. Поиск и организация чатов/проектов — P1

- [~] Локальный поиск по названиям чатов и проектов реализован и покрыт E2E; содержимое сообщений не индексируется. В PR #131 добавлены закрепление и постоянный выбор сортировки по последней активности / дате создания; exact-head E2E пока не выполнен.
- [~] Закреплённые чаты образуют приоритетный слой и сохраняют принадлежность исходному проекту; настройка хранится отдельно от истории чатов.
- [~] Сортировка по последней активности и дате создания сохраняет выбор. Метка активности активного чата фиксируется до переключения на другой чат, чтобы строка не перемещалась во время чтения; требуется подтвердить браузерным прогоном.
- Папки/коллекции рассматривать после поиска и закрепления. Начать с плоских пользовательских групп или меток, а не с вложенного файлового дерева и сложной миграции.
- Сохранить текущие категории «Без проекта» и проектные чаты, фильтр проекта, ручное переименование и контекстное меню.
- Первоначальное название из первого сообщения уже формируется один раз, если у чата ещё нет пользовательских сообщений; ручное переименование должно блокировать последующие автоматические изменения.
- Проектная память уже хранится на уровне проекта и имеет режимы project-only / project-and-global; не создавать вторую «единую память». Отдельно проверить, что project-only не утекает в личные чаты или глобальный контекст.
- **Приёмка:** поиск не меняет данные и scope; закрепление/сортировка переживают reload; ручное название не перезаписывается; проектные чаты остаются изолированными.

#### 8.22. Адаптивное рабочее пространство — P2

- Строить три режима на одной структуре и общем наборе действий, а не поддерживать три отдельные версии интерфейса.
- Выбирать compact / medium / expanded по доступной ширине и минимальным размерам содержимого, а не по предположению о типе устройства.
- На широком экране постепенно добавить одну дополнительную docked-панель: сначала контекст проекта или инспектор; затем, если есть реальный API, источники.
- На планшете использовать одну сменную панель/overlay, сохраняя основной чат; на телефоне — последовательный полноэкранный/sheet flow, не сжатую desktop-колонку.
- Запоминать ширину и видимость панели только после явного изменения пользователем; уважать минимальную ширину чата и восстанавливать разумный layout после resize.
- Сравнение нескольких моделей не включать в первый slice: оно требует явного согласия на параллельные запросы, показа стоимости/квот, provider isolation и раздельного отображения результатов.
- **Приёмка:** функции доступны во всех режимах; панели не создают горизонтальный overflow и не вытесняют composer; mobile не теряет доступ к действиям.

#### 8.23. Файлы как объекты рабочей среды — P2, с отдельным API gate

- Сохранить существующий composer attachment flow и не выдавать временно выбранный файл за постоянный источник проекта.
- Спроектировать единый реестр файлов с происхождением (user-provided / model-generated), scope (chat/project/local), MIME/size, временем, ссылкой на источник и статусом обработки (selected, processing, processed, failed).
- В интерфейсе показывать единый список с фильтрами по происхождению и обработке. Происхождение и состояние обработки — разные измерения: один пользовательский файл может быть успешно обработан, поэтому эти категории нельзя моделировать как взаимоисключающие статусы.
- Предпросмотр изображений и безопасных документных форматов выполнять локально, где это возможно; тяжёлое извлечение и индексацию показывать только после подтверждённого ответа реального сервиса.
- Повторное использование возможно только при наличии сохранённого объекта и ясного scope. Project Sources CRUD остаётся заблокированным до появления настоящего scoped source-list API.
- Не сохранять обычный абсолютный путь устройства как гарантию повторного доступа. File System Access API даёт доступ через пользовательский picker и разрешённый handle в поддерживающих браузерах; handle можно сериализовать в IndexedDB, но разрешение требуется проверять повторно. На остальных устройствах нужен обычный file picker или явная загрузка.
- **Приёмка:** пользователь различает выбранный, обработанный и созданный моделью файл; нет ложного «готово» при неудачном extraction; приватные и проектные файлы не смешиваются.

#### 8.24. Контекстные действия и progressive disclosure — P1

- Сохранить уже существующие chat-row menu, project gear и message actions; не переносить их в новые глобальные меню.
- Довести контекстные действия для файлов и моделей только там, где есть поддерживаемая операция: открыть, повторно использовать, экспортировать, проверить доступность, удалить локальную запись.
- Основные действия оставить видимыми; редкие и потенциально опасные — в ⋯ с понятными названиями и подтверждением.
- В настройках оставить только глобальные предпочтения и расширенные параметры; действия над конкретным чатом/проектом/файлом/сообщением должны жить рядом с объектом.
- **Приёмка:** одно действие имеет одно очевидное место; меню не показывает неподдерживаемые операции и не дублирует настройки.

#### 8.25. Автосохранение и восстановление после потери соединения — P1

- Добавить автосохранение текста черновика по chat ID и восстановление после reload, закрытия/выгрузки вкладки и повторного открытия чата.
- Для крупных вложений использовать IndexedDB/Blob storage, а не увеличивать JSON в localStorage; существующие chat history и recovery backup сохранить совместимыми.
- Показывать фактическое сетевое состояние отдельно от режима отключённого web search: текущий offline search mode не означает отсутствие интернет-соединения.
- Не отправлять запрос автоматически после восстановления сети. Повтор — только по явному действию пользователя.
- Сохранить текущую защиту isGenerating от двойного запуска; дополнить request ID и проверкой состояния запроса. Exactly-once для сторонних API нельзя обещать без поддержки idempotency на стороне провайдера/gateway.
- При неопределённом timeout объяснять, что удалённый провайдер мог уже получить запрос; не повторять молча.
- Перед закрытием настроек предупреждать только о реально несохранённых изменениях; настройки, которые применяются и сохраняются немедленно, не должны вызывать ложное предупреждение.
- Длинные чаты оптимизировать по профилю: сначала измерить время рендера/размер DOM/storage, затем добавить пагинацию или windowing при подтверждённом пороге. Не внедрять виртуализацию вслепую.
- [~] Текстовые черновики сохраняются по chat ID и восстанавливаются без автосендера; добавлен синхронный flush на `visibilitychange` при уходе вкладки в фон и на `pagehide`.
- [~] Состояние браузерной сети отдельно от offline search: UI показывает только `navigator.onLine === false`, явно оговаривает, что доступность API не проверена; после `online` предлагает ручной повтор. Автоматической отправки нет.
- **Приёмка:** черновик и выбранные вложения восстанавливаются в пределах разрешённого локального хранилища; сетевой retry всегда явный; нет незаметной повторной отправки и потери старых данных.

#### 8.26. Доступность и удобство на touch-устройствах — P1, непрерывный gate

- Сохранить существующие 44px touch targets, reduced-motion, пользовательскую настройку читаемости, keyboard focus и свайп закрытия sidebar.
- Проверить фактические размеры hit-area и расстояние между разрушительными действиями; не применять один размер ко всем контролам механически.
- Проверить увеличение системного шрифта, длинные RU/EN подписи, zoom, Forced Colors, светлую/тёмную темы, focus-visible/focus-not-obscured и screen-reader names.
- Проверить VoiceOver и реальный iPhone Safari; Chromium не заменяет эти проверки.
- Одноручное расположение основных кнопок — полезная оптимизация, но не ценой конфликтов с системной навигацией. Не добавлять edge-swipe на всю поверхность: текущий sidebar swipe должен оставаться локальным и отменяемым через pointercancel/touchcancel.
- **Приёмка:** основные сценарии выполняются клавиатурой и touch; системные жесты не перехватываются; контраст измерен на реальных компонентах.

#### 8.27. Интерфейс вокруг пользовательских сценариев — продуктовый принцип, P2

- Проектировать новые поверхности от законченного сценария: «исследовать тему», «работать в проекте», «разобрать файл», «сравнить варианты», а не от количества функций.
- Для сценария исследования объединять запрос, Thorough/deep-research, источники и trace в последовательный путь; Research Studio остаётся вложенным в текущий deep-research flow.
- Для проектного сценария держать чаты, инструкции, память и источники в одном контексте, сохраняя текущие scope boundaries.
- Использовать короткие contextual entry points и progressive disclosure; не создавать отдельный dashboard, wizard или постоянную панель для каждой функции.
- **Приёмка:** пользователь понимает следующий шаг без изучения структуры настроек; основной экран остаётся компактным.

#### 8.28. Каталог возможностей и управление агентами/навыками — P1/P2

**Аудит текущего кода PR #131 (2026-11-02):** основа меню уже реализована. В `index.md` есть четыре группы Functions: работа с задачей, исследование и источники, создание и преобразование, подключения. Agent panel содержит режим выполнения, черновик команды, сценарии, роли, 64 логические профессии, оркестрацию, модели/ресурсы и capability disclosures. Skills panel содержит chat-scoped task profiles и пользовательские инструкции. Roadmap tickers уже покрывают локальные файлы, конвертеры, Knowledge-to-Skill/Agent и аудио/изображения/видео. Не создавать повторные пункты меню и не дублировать controls.

- Сохранить существующие четыре группы как компактный верхний уровень; будущие разделы Agents, Skills, Research, Files & Sources, Media & Converters, Models & Runtimes, Tasks & History раскрывать вложенно и только по мере появления реальных сценариев.
- В панели агентов сгруппировать семь roadmap-разделов в четыре нативных сворачиваемых группы: применение/роли; оркестрация/модели/ресурсы; инструменты/разрешения; задачи/история. Сохранять 44px touch target, RU/EN, клавиатурное управление и работу общей паузы ticker.
- Разделять сущности: Profession/Role — шаблон специализации; Agent Profile — конфигурация; Team Blueprint — план состава; Skill — версионируемый пакет процедур; AgentRun — реальный запуск с task/run ID и durable state. Размер blueprint не является числом запущенных процессов.
- В Agent panel постепенно добавить выбор конкретного role/profile, закреплённые Skill versions, model policy, data scope, tool permissions, budgets, approval policy и outputs. Отображать только те controls, у которых есть backing data/API и проверка.
- Для каждой возможности использовать единый статус: Available (реальный handler + tests), Blueprint only (можно сохранить план без выполнения), In development (ticker `1ИV3ИT10И`, read-only окно с назначением и ограничениями), Unavailable in this environment (не хватает runtime/model/permission/resource).
- [~] Team Blueprint library: added a local-only reusable library for up to 20 named team-plan snapshots (team size, scenario, role preset and custom role/scenario text). Save/apply/delete are explicit; data contains no chat ID or messages and does not enable the structured workflow or launch agents. RU/EN, mobile touch targets and E2E regression are authored; exact-head browser/Quality execution remains pending. This is a Team Blueprint collection, not an Agent Profile registry or AgentRun runtime.
- [~] Skills panel: UI разделяет работающий профиль инструкций текущего чата и будущую библиотеку Skill packages. В панели собраны настройки цели/формата; библиотека раскрывается отдельно и показывает будущий lifecycle (source, extraction, provenance/license, draft, tests, security review, approval, version). Playwright regression authored for scope, 44px disclosure, keyboard, RU/EN and ticker pause; the CSS pause selector now targets the containing label via :has(), since the checkbox is nested inside it. Exact-head execution pending. Runtime import/loader, shared registry, package execution, eval runner and rollback remain unimplemented.
- Добавить видимый roadmap-раздел Tasks & History можно заранее, но его рабочее содержимое (run ID, queued/running/waiting approval/verifying/succeeded/failed/cancelled, артефакты и recovery actions) показывать только после появления durable AgentRun API. Не показывать chain-of-thought.
- [~] Read-only roadmap detail windows: все пять карточек Functions, семь Agent/Skills roadmap-разделов, Team Blueprint library, Project Sources и Integrations имеют действие «Подробнее». Общая модалка показывает название, статус и фактическое описание; Escape/backdrop/close возвращают фокус. Эти кнопки не запускают операции, не меняют настройки и не выдают permissions. Сейчас реально выставляются In development и Blueprint only; остальные статусы не назначаются без backing state.
- [~] В Agent panel добавлены отдельные roadmap slots Agent Profiles и Tasks & History. Реестр профилей, durable AgentRun, очередь, запуски и результаты не реализованы; соответствующие окна только описывают будущий scope.
- Существующие tickers должны оставаться disclosure, не progress bars; сохранять pause, reduced-motion, ARIA alternative и ясную подпись «не активный runtime».
- Поддерживать отдельную матрицу RU/EN, keyboard, screen reader, touch, 320/360/390/768/1024/1440px и реальные пустые/ошибочные состояния.

**Текущая evidence boundary:** Quality #41411404686 на exact code/test HEAD `1ec4a1d338975934a9cbefa3f3a262ad97ee118f` прошёл 4/4 Chromium shards (147 tests) — это историческая проверка. Новый code/test HEAD `dc82acb95c850d7821e071e16a8ab11524a459c2`: статические проверки проходят, 121 app E2E и 8 landing E2E assertions authored; GitHub вернул 0 workflow runs и 0 commit statuses. Browser/Quality NOT RUN. Ни этот результат, ни исторический run не доказывают runtime import/loader, shared registry, AgentRun API, native iPhone/VoiceOver или live deployment. См. `docs/AGENT_FUNCTIONS_MENU_INFORMATION_ARCHITECTURE_RU.md`.

**Приёмка:** не более одного entry point на действие; blueprint не запускает worker; статус выводится из реального runtime; roadmap-кнопки открывают только объяснение и не маскируются под запуск; отсутствуют дублирующие настройки и ложный progress.

#### Вне UI backlog: R-01. Идентичность репозитория и остатки GitHub Skills exercise

- Отделить название продукта aLandi от технического механизма публикации GitHub Pages/Jekyll. Упоминания GitHub Pages, Jekyll, Actions и skills/*.txt не являются чужим брендингом и должны сохраниться там, где описывают реальные зависимости.
- На текущем PR-head найдены legacy exercise workflows .github/workflows/0-start-exercise.yml, 1-step.yml, 2-step.yml, 3-step.yml, ссылающиеся на skills/exercise-toolkit и skills/action-*. 0-start-exercise.yml срабатывает на push в main, имеет contents: write и при выполнении downstream job создаёт/перезаписывает _config.yml и index.md. До удаления проверить is_template репозитория и историю этих workflow runs; если exercise-механизм больше не нужен, удалить его workflows и связанные .github/steps/шаблонные файлы отдельным проверяемым cleanup change.
- В том же дереве найдены .github/steps/1-step.md–4-step.md и временные исследовательские файлы temp/1 и temp/2; последние содержат исторические рекомендации/упоминания исходного GitHub Skills template, но их полезное содержание и ссылки нужно сверить с актуальными реестрами до архивации или удаления. Issue #1 уже зафиксирован в истории как закрытое историческое упражнение, не дефект aLandi.
- Не удалять каталог skills/*.txt: это действующие task profiles/skills aLandi, не GitHub Skills exercise toolkit.
- Не удалять и не переименовывать Jekyll/Pages, Quality, Security, Graphify и deploy workflows в рамках этой очистки. Сначала установить фактический publishing source и оставить его работоспособным.
- Переименование репозитория в aLandi/alandi — отдельная миграция после выбора и настройки стабильного custom domain. GitHub предупреждает, что project Pages URL не перенаправляется при rename; текущие ссылки /skills-github-pages/, Jekyll baseurl, canonical/OG URLs, OAuth redirect URI, deployment smoke и внешние инструкции потребуют синхронного обновления. Старый URL сайта нельзя считать автоматически сохранённым.
- **Приёмка:** exercise scaffolding не запускается и не может перезаписать продуктовые файлы; Pages build/deploy, app root, /landing/, OAuth callback и custom domain проходят отдельные проверки; история и git clone redirects сохранены.


## 9. Дополнительные требования владельца к сторонним провайдерам (2026-10-31)

Этот раздел фиксирует согласованный в разговоре backlog. Он не означает, что перечисленные интеграции уже реализованы, что провайдеры предоставляют бесплатный inference или что статический клиент может безопасно раздавать общий секретный API-ключ.

### 9.1 Список провайдеров и варианты подключения

- Сохранить в списке сторонних провайдеров: Google AI Studio / Gemini, Kilo, Grok (xAI), OpenRouter, Hugging Face, Anthropic / Claude и NVIDIA.
- Kilo и OpenRouter рассматривать как два приоритетных варианта с максимально готовым подключением: пользователь выбирает провайдера и может начать работу без обязательной ручной настройки там, где провайдер действительно предоставляет поддерживаемый публичный доступ.
- В качестве третьего готового варианта рассмотреть Kimi (Moonshot AI). Включать его в этот сценарий только после подтверждения реально работающего и допустимого способа доступа; если это невозможно, выбрать другого провайдера с аналогичными возможностями.
- Для перечисленных и остальных поддерживаемых провайдеров сохранить возможность пользователя вставить собственный API-ключ.
- Добавить отдельный пункт «Собственный совместимый API» для ввода собственного base URL/адреса API и необходимых параметров подключения.
- Для каждого провайдера, где это применимо, предоставить актуальную официальную ссылку на получение API-ключа и краткую инструкцию подключения. Не выдумывать endpoint, URL, тарифы или доступность моделей.
- NVIDIA оставить в списке при условии сохранения поддерживаемого способа доступа, включая бесплатный вариант, если он реально доступен на момент реализации.

### 9.2 Автоматическая проверка ключа и подбор рабочей модели

- После вставки собственного API-ключа автоматически запускать проверку подключения и доступных для этого ключа моделей; не заставлять пользователя заранее угадывать единственную модель, с которой заработает ключ.
- По возможности проверять модели, поддерживаемые конкретным провайдером и его API. Если первоначально выбранная модель не проходит проверку, искать другие подходящие модели и определить рабочую.
- После успешного реального тестового запроса автоматически выбрать найденную рабочую модель и явно отобразить подтверждённое состояние подключения.
- Не считать наличие модели в каталоге, HTTP 200 или успешную загрузку каталога доказательством того, что модель выполняет запросы.
- В пользовательском списке показывать только модели, действительно доступные конкретному ключу и совместимые с используемым API. Полный upstream-каталог при необходимости может храниться отдельно для внутреннего сопоставления.
- Сортировать доступные модели от самой новой к самой старой, используя подтверждённые upstream-метаданные/даты или версионирование. Если достоверно определить возраст нельзя, не выдавать произвольный порядок за хронологический.
- Применять общий принцип ко всем провайдерам, где технически поддерживаются проверка доступа и безопасный тестовый запрос.
- Учитывать rate limits, квоты, стоимость и условия провайдера; не запускать массовые или потенциально платные тесты без необходимости и явного согласия. Не выполнять перебор, нарушающий условия API.
- Не показывать ключи в логах, статусах, URL, диагностике или тестовых артефактах; учитывать ограничения безопасности BYOK в статическом браузерном клиенте.

### 9.3 Границы бесплатного и автоматического доступа

- «Готовое подключение» не должно означать выдуманный или встроенный общий секретный ключ. Для публичного статического клиента нельзя безопасно хранить и раздавать общий provider secret.
- Подключение без ручного ввода ключа допустимо только при наличии легального публичного механизма доступа, пользовательской авторизации/выдачи credentials или иного явно поддерживаемого провайдером потока.
- Не обещать бесплатный API/inference, если он зависит от регистрации, ограниченной квоты, региона, платёжного метода или условий, которые пользователь должен выполнить.
- Отдельно показывать, кто предоставляет endpoint, какие действуют лимиты/условия и кто несёт возможную стоимость.
- Не подменять недоступность выбранного провайдера скрытым переключением на другой маршрут; fallback допустим только как явно показанное и разрешённое пользователем действие.

## 10. Запись требований и границы реализации

- Все пункты разделов 8–9 — согласованные требования/backlog, а не отметка о готовой реализации.
- Перед реализацией сверять каждый пункт с текущим кодом, существующими механизмами, ограничениями безопасности и текущими условиями upstream-провайдеров; не дублировать уже работающие функции.
- Не менять статусы контрольных направлений без проверки кода и тестов.
- Соблюдать V1 freeze: требования, которые расширяют набор провайдеров или runtime-возможности, сохраняются как будущий backlog и не внедряются в V1 без отдельного решения владельца. UI-polish и исправления существующих механизмов можно выполнять в пределах утверждённого стека.
- При пакетной фиксации объединять повторы, сохранять историю решений и не трактовать отменённые промежуточные варианты как действующие требования.

## 11. Change log

| Date | Change | Evidence |
|---|---|---|
| 2026-11-01 | Reconciled legacy sections 1–7 against PR #131 and requirements 8.1–8.17; added one P0/P1/P2 open-task list in section 8.0 and retired duplicate polish tracking. | Current PR #131 source, V2 implementation ledger and explicit owner checklist; exact-head tests remain pending. |
| 2026-10-31 | Marked owner corrections in sections 8.1–8.17 as a dated, priority backlog for landing V2.0; explicitly kept them separate from V1 implementation status/freeze. | Owner instruction in current conversation; document re-read before update. |
| 2026-10-31 | Consolidated the remaining owner-dictated UI notes: message action icons, backdrop lifecycle, unified control sizing, compact theme/language controls, removal of experimental server memory, explicit project-context transfer, touch text-selection behavior, centered/color-coded status tickers, icon-first button typography and user-adjustable text readability. Added the agreed third-party provider shortlist and BYOK/model auto-detection requirements, including V1/funding/security boundaries. | Confirmed in the current conversation; requirements only, implementation status not inferred. |




### 8.29 OLEDUE — automatic workstream handoff (owner operational requirement, 2026-11-04)

- [ ] Keep the root `OLEDUE.md` as a short single-word handoff: when the owner writes `oledue`, determine the current owner-authorized workstream, PR and branch from live GitHub and canonical project records; never ask the owner to restate the PR/branch.
- [ ] Main must carry the stable entrypoint and route to active PR #131 by default while it is the active Landing UI 2.0 stream; update routing when that PR is closed/replaced. Reading main must not imply that implementation happens on main.
- [ ] Preserve exact-head verification, canonical task-list-first recording and owner approval gates. No merge/rebase/deploy from the trigger alone.
- **Acceptance:** one-word trigger reliably resumes the live authorized branch with a verified checkpoint and one next action; no duplicate task registry.

### 8.30 External sources and future artifact archive (owner operational requirement, 2026-11-04)

- [ ] Consolidate external upstream/source references from the main curated catalogs and research PRs into one central inventory at `INTEL.md`, with exact URL deduplication and origin/provenance back-links.
- [ ] Preserve source research documents as contextual evidence; central inventory is the common lookup index, not a claim of adoption or license approval.
- [ ] Archive only future-useful artifacts after a concrete task/use is identified and exact source/version, license and redistribution terms, SHA-256, size and review date are recorded. Do not bulk-download repositories, datasets, model/voice weights or assets without a justified, reviewed need.
- [ ] Keep an archive manifest and stable storage location in repository; exclude secrets, credentials, private or user data.
- **Acceptance:** one searchable source inventory with source provenance and a reproducible, license-aware artifact manifest; unverified links/artifacts remain explicitly pending.

### Integrated UI scope and Graphify source coverage — 2026-11-02

- Execution scope remains unified: active inherited UI requirements from sections 1–7 are mapped into section 8.0 workstreams and requirements 8.1–8.17; obsolete, completed or superseded items are not reopened as a second backlog.
- Section 8.0 remains the canonical open-work register. The polish backlog is a concise mirror; implementation evidence belongs in `LANDING_UI_V2_IMPLEMENTATION_RU.md`.
- Latest UI source checkpoint: `9aa74853478a6a680cdd36ab0f84c851721405a4`; latest PR #131 branch head at this documentation update: `c8facdac2eebc7d2217b807f1b7e314ae3abf2dd` (the intervening commits are documentation/workflow changes). Exact-head Quality/Chromium remains unverified.
- Graphify Code-Only Pilot path filters now include `assets/js/**/*.js`, `assets/css/**/*.css` and `landing/**/*.html`, so the extracted client runtime and stylesheet are included in future graph refreshes. The new run/artifact has not yet been observed; no graph-analysis pass is claimed.
- PR #131 remains open/unmerged. No rebase, merge or deployment was performed.


| 2026-11-02 | 8.13: queued context handoff now survives tab reload without changing chat/project ownership; one-shot behavior is covered by exact-head Playwright/Quality #1250. | PR #131 HEAD `f3151472e285c7d31d46809f52337202eb15e6b3`; run `41364775725`; native iOS Safari remains a separate manual gate. |

### 8.25 implementation note — per-chat text drafts (2026-11-02)

- A first bounded slice is implemented on PR #131: text-only composer drafts are stored locally per existing chat, restored after reload and isolated when switching chats. Explicit submission clears the draft; reload never auto-sends it. Storage retains up to 100 chat entries without silently truncating text; browser quota errors use the existing warning path.
- Attachments are not persisted. This is partial implementation of optional proposal 8.25, not completion of offline/attachment recovery or a release blocker.
- Playwright regression was added; exact-head execution is pending. Evidence and storage limits: `docs/LANDING_UI_V2_IMPLEMENTATION_RU.md`.


**Menu follow-up 2026-11-02:** the Research group now owns a single Deep Research 2.0 roadmap card; Create/Transform owns the four local-file/converter/Knowledge-to-Skill/media cards in its own container. Research Studio remains in the Thorough mode path, not a duplicate toolbar entry. Playwright now asserts this exact grouping; execution remains pending.
