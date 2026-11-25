# aLandi — единый мастер-план и реестр реализации

**Единственный полный список работ.** Короткий вход — NOW.md. Внешние источники, плагины и инструменты — INTEL.md.
**База консолидации (не текущий HEAD):** 2026-11-18 · DorpNay/skills-github-pages · main 42a63dbd6cea81e97e7a577fce159700186771ac. После этого baseline были созданы последовательные docs commits; следующий SHA всегда проверять live.

> Статусы: SPECIFIED — требование; IMPLEMENTED — артефакт/код присутствует в `main`; PARTIAL — реализована только часть acceptance; VERIFIED — конкретная проверка на указанном SHA/среде; DEFERRED — осознанная отсрочка; RETIRED — отменено владельцем. Старые DONE-галочки находятся только в конце и остаются историческими. Новые задачи закрываются в активной части лишь после коммита в main; VERIFIED дополнительно требует доказательства проверки.

## 0. Исполнительные правила

1. Первый приоритет — корневое веб-приложение на /. Не восстанавливать /landing/: текущий контракт оставляет root app единственной публичной поверхностью.
2. Работать крупными связными пакетами, быстро и без лишних ритуалов ориентирования; внутри — минимальные обратимые изменения.
3. Рабочие документы ровно три: NOW.md, этот мастер-план и INTEL.md. Технические спецификации могут оставаться в docs как источники контракта, но не как конкурирующие списки задач.
4. Никаких фальшивых функций: доступное действие требует реального handler/runtime, разрешения, scope, успеха/ошибки/отмены и честного статуса. Остальное — blueprint/unavailable.
5. Обычный чат — прямой запрос к основной модели без обязательного planner/helper/agent/tool overhead. Quick/Thorough, web breadth/offline, execution topology, task skill, model/provider, memory scope и output format — независимые измерения.
6. Показывать только реальные operational events: этап, модель/агент, tool/source, время, состояние, результат/ошибка/approval/cancel. Не раскрывать hidden chain-of-thought.
7. Роли, skills, загруженные документы и prompt не дают полномочий. Local files, network, shell, repository writes и внешние side effects требуют отдельного scope/approval; arbitrary code execution — только после настоящей sandbox изоляции.
8. Сохранять HTML/CSS/JS + Jekyll/GitHub Pages + существующий FastAPI/Ollama. Новые framework/runtime/dependencies — только при измеримой выгоде, актуальном первоисточнике, проверенных лицензиях и rollback.
9. Не выполнять merge, deploy, force-push, rebase/reset, историю переписывать, удалять пользовательские данные, менять хост/провайдер/секреты или платить без отдельного разрешения. Прямые commits в main разрешены.
10. Work Loop: live orient → inspect minimum surface → acceptance/rollback → implement → focused verification → exact-head/publication checks → update NOW/master/INTEL → concise report.


## 0.1 Owner directive — Landing 2.0, автономность и публикация (2026-11-21; SPECIFIED)

Владелец подтвердил следующий обязательный scope. Это требования и задачи, не заявление о готовности или доступности серверов/моделей.

1. **Сначала восстановить root app и автоматическую Pages-публикацию.** Проверять связку main commit → GitHub Actions Pages build → deploy → опубликованный root; Jekyll success сам по себе не доказывает работу браузерного JavaScript. Любой критичный root bootstrap/delegated-handler regression должен ловиться Playwright smoke-тестом.
2. **Landing 2.0 в main:** завершить все уже перечисленные отдельные пункты локализации RU/EN, чатов, памяти, действий, безопасности, управления элементами, адаптивности, доступности, форм, меню, диалогов, функций и инструментов. Существующие P0.1–P0.32 и P1–P8 сохраняют свои acceptance и статусы; новые пункты не заменяют их.
3. **Реальная работоспособность:** у каждой видимой кнопки, переключателя, меню, формы и панели должен быть работающий handler/runtime, проверяемое состояние, обратная связь, error/cancel/approval path и тест. Не оставлять декоративные или фиктивные элементы.
4. **Бесплатная публичная оболочка:** сохранять static HTML/CSS/JS + Jekyll/GitHub Pages и не вводить обязательный платный frontend/runtime. Отдельно учитывать возможные расходы владельца на сервер/железо/регистрации; не создавать платные ресурсы без отдельного согласования.
5. **Автономность на сервере:** при наличии доступа только к запланированному серверу система должна выполнять задачи, не требующие внешнего поиска, внешних БД, Pages, GitHub, сторонних API или других сервисов. Сервер — допустимый внешний физический контур; web search — явное исключение и отдельная capability.
6. **Интернет-поиск:** довести реальный поиск как инструмент основного чата и как capability инструментов/моделей/агентов по необходимости; offline режим обязан явно отключать web и не имитировать доступность источников.
7. **Offline Core:** подготовить переносимый локальный пакет ядра с локальным runtime, persistence, manifest/checksums/licenses, установкой/обновлением/rollback и честной матрицей возможностей без сети. Сохранить local/server switch и запрет скрытой отправки данных/remote fallback.
8. **Модели:** инвентаризировать уже скачанные малые модели и разрешённые кандидаты; связать их с реальными задачами (routing, helper, embedding/rerank, ASR/TTS/код и т.п.) только после проверки точных артефактов, версий, лицензий, ресурсов, качества и совместимости. Основная крупная модель размещается владельцем на выбранном сервере по отдельной инструкции; не утверждать, что ранее скачанные модели доступны в текущем runtime без проверки.
9. **Внешние зависимости:** проверить актуальность версий, security advisories, совместимость и улучшения для моделей, библиотек, API, инструментов и runtime по официальным первоисточникам; фиксировать provenance, license, pin, risk и rollback в INTEL.md. По возможности self-host статические зависимости; CDN не должен быть обязательным условием работы уже открытого приложения.
10. **Cloudflare:** разрешены read-only инвентаризация и безопасная подготовка плана; изменения DNS, Tunnel, Workers, Access, secrets, permissions, платных ресурсов и production routing требуют отдельного точечного согласования.
11. **Параллельная работа:** независимые repository, research, tests и infra-inventory lanes можно выполнять одновременно; изменения одного файла/ref сериализовать и проверять по точному parent SHA.
12. **Owner handoff:** в конце предоставить пошаговую инструкцию только для действий владельца: регистрации/аккаунты, секреты через защищённые UI, сервер/ОС, размещение основной модели, запуск сервисов, подключение домена/Tunnel при необходимости, backup/update/rollback и smoke/acceptance. Указывать стоимость/условия/необходимые решения и не просить секреты в чате.

## 0.2 Owner directive — main-first integrated completion and upstream reuse (2026-11-25; SPECIFIED)

Владелец расширил объём работ до интегрированной реализации всех применимых срезов P0–P8 и разрешил переносить целые upstream-подсистемы, если это быстрее и безопаснее самостоятельного повторного создания. Это директива выполнения, а не доказательство доступности runtime, лицензий, прав, сервера или устройств.

1. **Очередь и результат.** Сначала P0.1–P0.34 довести до полной browser/runtime acceptance; затем P1–P5 как функциональное ядро (общая оболочка, Notebook/Studio, Coding workspace, routing/continuity, agents/research, ingestion/conversion/artifacts, Offline Core); далее P6 voice/audio и P7 provider decision; затем P8 release/owner gates. Исторические реестры в конце не превращать в дублирующую очередь: сначала дедуплицировать с активными acceptance.
2. **Main-first.** Работать крупными связными срезами, но минимальными обратимыми commits прямо в `main`, если текущий репозиторий и права это допускают. Перед каждым write проверять exact live HEAD и ожидаемый parent; использовать compare-and-swap/expected SHA. Существующие PR/ветки сначала исследовать по diff/base/head/checks; переносить только доказанно полезные минимальные части с повторным тестом на актуальном main. Не merge/close/delete, не переписывать историю и не чистить очередь без отдельного основания и разрешения владельца.
3. **Pages не трогать.** Workflow автоматической GitHub Pages публикации, его triggers, build/deploy, source/artifact flow, repo Pages settings и published state не менять и не обходить. Не запускать ручной deploy. Раздельные quality/test workflow разрешены только при гарантии отсутствия изменения автопубликации. Кодовый commit в main может вызвать существующую автоматическую публикацию; это штатное поведение, которое нельзя отключать/подменять ради тестов.
4. **Override на повторное использование целых upstream-систем.** Разрешено перенести целую зрелую систему, runtime или модульный набор вместо точечной реализации, когда это объективно быстрее, встраиваемо и лучше поддерживается. До переноса проверить точную версию/commit; полную лицензию дерева, транзитивных зависимостей, моделей/weights/datasets и NOTICE; advisories/CVE; API/runtime и deployment boundary; auth/permissions/sandbox; privacy/retention; CPU/RAM/GPU/network profile; offline compatibility; сохранение aLandi contracts/data; миграцию, обновление и сопровождение; deterministic tests/evals; rollback/kill criteria. Неизвестный критичный gate означает CANDIDATE/DEFERRED, а не разрешение копировать наугад.
5. **Явный тип заимствования.** Для каждого upstream указывать `COPY` (код переносится при совместимой лицензии и notices), `ADAPT` (собственная реализация по контракту/алгоритму), `INSPIRE` (UX/architecture pattern), `DEFER` или `REJECT`. Не выдавать список идей за полный перенос. Не создавать второй runtime, database или orchestrator, если замена существующему не доказана измеримо.
6. **Исследование по каждому P0–P8.** На фактический implementation slice собрать свежий primary-source pack: официальный spec/API; upstream repository и immutable release/commit; LICENSE/NOTICE + third-party/model/data terms; security advisories; runtime/system requirements; rate/resource limits; data retention/privacy; retry/cancel/idempotency/recovery; upgrade/rollback; runnable examples and tests. Exa — discovery, Firecrawl/Context.dev — extraction/crawl, Context7 — version-aware library docs, GitHub/official registries — проверка версий, кода и состояния. Вторичные обзоры — discovery-only. Записывать evidence, дату, version/hash и disposition в существующий `INTEL.md`; не заводить новый source register.
7. **Приобретение и кэширование.** Скачивать/собирать необходимые runtime, зависимости, небольшие модели и fixtures только при наличии нужды и проверяемой лицензии. Для каждого артефакта фиксировать canonical URL, release/commit, SHA-256, size, license/NOTICE, provenance, target platform/runtime, acquisition date и verification steps. Публичный GitHub repository не является private vault: commit только redistributable, size-bounded файлы; неизвестные/неразрешённые к распространению веса и пользовательские/секретные данные не коммитить. Более крупные или private артефакты — в контролируемый Actions artifact/cache с digest/retention либо owner-side acquisition. Кэш моделей исключить из Jekyll/Pages artifact. Проверять traversal, symlinks, archive bombs, collisions, atomic promotion и offline dependency closure. **Крупнейшую основную модель не скачивать**; её разместит владелец по отдельной инструкции.
8. **Параллельность и инструменты.** Реально подключённые GitHub, Exa, Context.dev, Context7, Firecrawl, skills, connectors и прочие services применять по конкретной полезности. Не создавать сторонние app/hosting/infrastructure prototypes как побочный эффект. Параллелить независимые read-only inspections, research, review и test lanes; сериализовать запись одного файла/ref. Relay worker использовать только при доступном live target, правильном repo scope и readiness; пустой roster не позволяет заявлять, что работа делегирована.
9. **Критерии закрытия.** Для каждой функции нужны реальные success/failure/cancel/retry/approval flows, RU/EN, permission/data boundaries и deterministic tests. SPECIFIED, IMPLEMENTED, VERIFIED и AVAILABLE LIVE независимы. Exact-head CI доказывает только этот SHA и тестовую среду; Pages publication, browser runtime, server, model loading и native-device acceptance — отдельные gates. Owner-only VPS/DNS/Tunnel/provider/purchase/secrets/device/production actions не закрывать фиктивным CI.
10. **Неприкосновенные границы.** Сохранять root static HTML/CSS/JS + Jekyll/GitHub Pages и существующий aServi/FastAPI/Ollama contract до доказанного ADR. Не менять Pages auto-publish. Не добавлять fake controls/capabilities; не хранить hidden reasoning, secrets и ненужные данные. Merge, deploy, force-push, rebase/reset, destructive deletion, permissions, secrets и платные изменения требуют отдельного разрешения.


## 0.3 Owner directive — detailed visual, interaction, local-workspace and capability requirements (2026-11-25; SPECIFIED)

Ниже фиксируются дополнительные пожелания владельца от 2026-11-25. Они дополняют существующие P0.1–P0.35 и P1–P8, но не отменяют их acceptance, security boundaries или очередь. Это требования, а не свидетельство реализации.

1. **Визуальная система.** Направление: глубокий графит/серебристо-серый dark theme с бирюзовым фирменным accent, плюс согласованная светлая pearl/silver версия. До фиксации точных токенов получить цвет из фактической эмблемы aLandi. Не выдавать предполагаемый HEX за официальный Tiffany Blue: Tiffany сообщает, что proprietary 1837 Blue стандартизован специально для бренда и не является публичным Pantone-цветом для произвольного воспроизведения. Для всех сочетаний проверить WCAG 2.2: обычный текст ≥4.5:1, крупный ≥3:1; цвет не должен быть единственным признаком состояния. Свечение/пульсация/бегущий огонёк — дозированно, с проверкой контрастности и prefers-reduced-motion.
2. **Режимы и micro-interactions.** Три режима должны иметь один общий, однозначный selector: collapsed strip с высотой видимой части около 1/3 стандартной кнопки, подписью текущего режима и его цветом; раскрытие в три равные кнопки; силуэтное равномерное «деление клеток»; спокойный акцент выбранного режима. При входе/возврате вкладки — короткий двойной по частоте сигнальный flash и автосворачивание без захвата фокуса. В раскрытом состоянии повторный клик по активному режиму сворачивает selector; первый клик по другому режиму только выбирает его, второй по уже выбранному — сворачивает. Сохранять mode state при reload/history/visibility lifecycle. Тонкая визуальная полоса не должна превращать touch-target в недоступную цель: оставить полноценную интерактивную область, клавиатуру и accessible name. Никакой бесконечной пульсации, конфликтующей с reduced motion.
3. **Названия и эмблемы.** Зафиксировать авторскую naming-концепцию: визуально разделённые начальная a и конечная i образуют AI-рамку тематического слова; добавленные AI-части — строчные и могут иметь согласованное оптическое смещение/масштаб/интервал. Land означает grounding / приземление интеллекта в личную offline-среду (физическое локальное оборудование либо контролируемый сервер — не зависимость от внешнего сервиса). aCodingi и aNoteBooki — текущие рабочие имена, не запрет на последующий naming review. Подготовить два logo directions: (A) оригинальная абстрактная/объёмная фигура из трёх переплетённых потоков, приземляющихся в устойчивое основание; скрытые negative-space намёки на a/L/i, без клише мозга/чипа/робота; (B) лаконичный custom wordmark aLandi, где начальная a и конечная i тонко выделены оптически, а Land остаётся центральным словом. Пока зафиксированы creative briefs/prompts, а не готовые image assets. Переключение варианта в шапке: double-click по логотипу (double-tap на touch) переключает вариант; одновременно существует отдельный discoverable accessible control для touch/mouse/keyboard. Жест — быстрый shortcut, никогда не единственный способ управления.
4. **Header и навигация.** Часы имеют фиксированную геометрию и не сдвигаются при изменении project/chat title. Название проекта — более тяжёлое uppercase-поле, ограниченное областью до часов; название чата — отдельной строкой ниже с контролируемым продолжением по области часов. Проверить реальные длинные имена, узкий экран, локали и масштаб текста. Для часов подобрать контрастные стрелки/обозначения на фоне заголовка. Скрывать метку «Без названия» внутри открытого проекта; в общем списке оформить её компактно над возвратом ко всем чатам.
5. **Проекты и чаты.** Высота/раскрытие секций зависит от количества записей: не резервировать пустое место без необходимости. Заголовки секций визуально иерархичнее строк; выбранные project/chat/expanded section получают умеренную подсветку и медленный, не отвлекающий сигнал. Строгая existing navigation identity/scope модель P0.34 остаётся единственным источником состояния.
6. **Кнопки и message actions.** Уменьшить квадратные декоративные controls примерно вдвое относительно текущих, но не уменьшать удобную hit-area; в сообщениях action cluster привязать к краю карточки и не перекрывать текст/selection. Проверить touch target ≥44 CSS px там, где это требуется, focus ring, hover/focus/pressed/disabled и screen reader name.
7. **Additional Settings IA.** Все разделы по умолчанию закрыты, кроме layout/placement основных элементов и системного prompt. Порядок: (1) расположение основных областей и включение функций; (2) system prompt; (3) Offline Core, storage/save/export; (4) основные технические параметры; (5) свёрнутая группа appearance, motion, typography, contrast. Настройки хранения/экспорта — отдельная полноценная секция с политикой retention, backup/restore, path/scope и конфликтами.
8. **Voice/provider overlay regression.** Воспроизвести и исправить зависающий затемнённый backdrop/закрытие меню после выбора voice controls при недоступном aServi. Voice selection не должна сбрасывать активного стороннего provider, ключ или модель. Общие browser-local voice input/playback и доступные speech helpers могут работать без собственного сервера, если конкретный runtime реально присутствует; provider-specific и server-only возможности должны отображаться отдельно.
9. **File picker.** На iPhone не дублировать две кнопки, если системный picker фактически открывает один и тот же объединённый выбор фото/файлов. Разделять кнопки только там, где они запускают разные нативные операции. Проверять реальное поведение Safari/iOS, а не только desktop emulation.
10. **Live status.** Все long-running действия в чате и вне его показывают только реальные typed lifecycle events: queued/running/waiting/approval/retrying/cancelling/succeeded/failed/cancelled, current step, timestamps, source/tool/model/agent attribution, bounded progress when measurable, resume/cancel. Durable event log остаётся источником восстановления; UI — лёгкая проекция. Разворачиваемое пояснение может сообщать краткое резюме действий/обоснования и источники, но не raw hidden chain-of-thought.
11. **aNoteBooki priority.** Допускается заморозить расширение Notebook UI/Studio после сохранения существующих полезных функций и контрактов. Приоритет — P0 base UI + реальный aCodingi + Offline Core; Notebook не должен блокировать базис.
12. **Free-first and autonomy.** Не вводить обязательный платный frontend или managed backend. GitHub Pages остаётся бесплатной статической публичной оболочкой при соблюдении условий GitHub Pages; она не является backend/инференсом и не должна трактоваться как бесплатный хостинг коммерческого SaaS. Сервер — единственный разрешённый внешний физический контур для автономных не-web задач; offline mode должен работать без Pages/GitHub/cloud DB/provider APIs. Интернет-поиск — отдельная включаемая online capability.
13. **Смелые эксперименты.** Допустимы только обратимые optional prototypes вне основных контрактов, с флагом off-by-default, измеримым сравнением, kill criteria и rollback.

### First live checkpoint and ordered next slice — 2026-11-25

- **FACT — live main before this documentation change:** `30ca032ed378f47e2e0946d93db3f35feb92433c`; the preceding code HEAD `5b89051749b01be776868d75ecfea46371ac9ee1` contains resumable, checksum-verified artifact download, range validation, atomic promotion and symlink-path rejection.
- **FACT — open queue:** PR #195 head `4a2718e305bf1f57dee38d867d07511d63ac1e9c` was 15 commits ahead / 1 behind the preceding main code SHA. Its full Chromium run #45499554626 ended **201 passed / 58 failed in 26.8 minutes**. Failures include obsolete Notebook route selectors, a stale RU HTTP-401 text expectation, a duplicate strict locator, a Research selector mismatch and other navigation/runtime timeouts. Do not merge/copy its changes wholesale; triage against current main and preserve only proven fixes.
- **FACT — open PR #187:** provider-diagnostics candidate uses stale base `484c3b9b4570e110f8bc4584bab322c80c37803c` and was non-mergeable at last read. No PR is implicitly approved for merge.
- **FACT — open issues:** #111 is an owner/live-host release-gate issue; #186 is an unrelated imported GitHub Skills exercise. Do not close either merely to empty the queue.
- **FACT — checks:** the preceding exact main code HEAD had successful Pages build/deploy, Graphify, Gateway/runtime-cache and artifact/provenance workflows. It did not have a full Chromium suite on that SHA. Rulesets returned an empty list; classic branch-protection read returned 403 for this integration, so review/required-check protection is UNKNOWN.
- **FACT — delegation:** Agent Relay exposed no live agents, launch targets or shared sessions at inspection. Work is not represented as an agent swarm.
- **NEXT:** resolve P0 browser/runtime acceptance and a full exact-main Chromium baseline first; then execute P1–P5 by dependency order; then P6/P7; then owner-controlled P8. Keep the Pages auto-publish workflow unchanged.

### P0.33 — Recovery, автономная публикация и Landing 2.0 expansion (SPECIFIED)

- [~] P0.33.1 Root JavaScript bootstrap восстановлен: закрыт Python runtime-load catch; прежний eager `applyUiLanguage()` удалён из top-level до инициализации `activeVoiceStatusKey` (saved locale применяется из `initializeSettings()` после объявления runtime state). Live Pages smoke подтвердил Settings open/close и Quick/Thorough mode переключение без page errors на SHA `dc997572`; navigation/composer/full matrix остаются открыты.
- [x] P0.33.2 Required root-app Chromium smoke on exact code/test HEAD `58b7465a` passed all 10 focused tests in 16.4s (Quality Sentinels #44900882759): cold boot/delegated controls, same-origin runtime assets, offline shell after first visit, project/chat scope, same-active-chat reselection, personal-chat persistence after reload, project deletion, long-list scroll/focus and keyboard menu/clone/delete-cancel. The earlier #44900606374 failure was a 2px scrollTop rounding assertion; tolerance was limited to 3px, no app behavior was changed. Full Chromium suite remains optional/skipped.
- [~] P0.33.3 Release chain: exact code/test HEAD `58b7465a` Pages build/deploy #44900882308 succeeded; Quality Sentinels #44900882759 passed Jekyll artifact SHA + 10/10 root-app Chromium smoke; Graphify #44900882741 succeeded. Latest main docs/infrastructure HEAD `b4089566` Pages build/deploy #44901426524 succeeded; model inventory gate #44901175865 passed on its source HEAD. Published-release contract and independent live published-site revision/click check remain open (TinyFish browser run could not start because connected wallet balance was negative; no paid top-up was initiated).
- [x] P0.33.4 Push-triggered GitHub Pages build/deploy succeeded automatically for code/test HEAD `58b7465a` (#44900882308), model-gate HEAD `53c3334d` (#44901175097) and latest main HEAD `b4089566` (#44901426524); no manual deployment was used.
- [x] P0.33.5 Critical browser runtime dependencies are same-origin and pinned: Tailwind compiled CSS 3.4.17, marked 18.0.14 and DOMPurify 3.4.16; no external CDN scripts/styles/fonts. Service worker caches the shell after a successful visit, excludes sensitive API/auth paths and query URLs, and fails with a clear 503 when shell was never cached. Tests `root runtime assets stay same-origin and work without a CDN` and `app shell is available offline after its first successful visit` passed in required smoke #44900882759. This proves offline UI shell, not offline model/API inference.
- [ ] P0.33.6 Полностью завершить существующие RU/EN, chats, memory, actions, security, element management и responsive/accessibility acceptance P0.1–P0.32.
- [ ] P0.33.7 Провести полный visible-control inventory: каждый data-action, direct listener, form submit, disclosure и keyboard path связан с реальным handler и E2E.
- [ ] P0.33.8 Проверить автономный server-only путь для чата, локальных файлов/БД, моделей, памяти, tools и agent workflows без внешних API.
- [ ] P0.33.9 Реализовать реальный web-search route в основном чате и ограниченные, разрешённые web capabilities для tools/agents; проверить online/offline separation.
- [ ] P0.33.10 Подготовить Offline Core manifest/runtime package, local persistence, dependency closure, integrity checks, update/rollback и capability matrix.
- [~] P0.33.11 Acquisition-side inventory is refreshed: external model cache, four Ollama packages + lock, Bonsai PTQ1_0 helper, OpenShell v0.1.8 and CPython 3.12/3.13/3.14 offline caches have artifact digests, expiry and license/provenance recorded. Gate #44901175865 validates the runtime lock and candidate sandbox manifests. These are Actions artifacts, not target-host files; host hashes, hardware compatibility, loading, role assignment and evals remain open.
- [ ] P0.33.12 Подготовить main-model server deployment architecture и owner-only runbook; не скачивать/перемещать модели и не менять VPS без доступной среды и отдельного разрешения.
- [~] P0.33.13 Targeted official-source freshness snapshot recorded in `INTEL.md` (2026-11-21): Ollama stable 0.40.16 vs 0.40.17-rc0, llama.cpp b12249 pre-release, PEFT 0.21.3, TRL 1.17.1, OpenHands 1.40.0 and gVisor 20261116.0. No automatic upgrade was made. Full per-component API/security/compatibility audit and target-host benchmark remain open.
- [~] P0.33.14 **Cloudflare read-only inventory (2026-11-21):** connected account list returns one standard account, zero zones and zero named Tunnels. No domain/zone or target VPS is available to bind; no DNS, Tunnel, Access policy, secret, paid resource or account mutation was performed. Next safe step is owner-supplied domain/host choice; then prepare a reviewed tunnel design and require approval before any create/update action.
- [ ] P0.33.15 Выполнить end-to-end acceptance на чистом браузерном профиле, затем RU/EN, mobile/desktop, offline/server-only, browser/device и rollback matrices.
- [ ] P0.33.16 Подготовить owner checklist для регистраций, ключей, сервера, модели, domain/Tunnel, service startup, monitoring, backup и recovery; не хранить credentials в репозитории/чате.

### P0.34 — Owner corrections: shared app modes, strict project/chat navigation, persistent agents and model-training paths (2026-11-21; SPECIFIED)

This section supersedes conflicting P1 language that described aCodingi/aNoteBooki as separate primitive pages/shells. The binding target is one root application with three shared-frame modes. P1–P5 below hold the detailed acceptance; earlier historical register rows remain traceable but do not override this owner directive.

- [~] P0.34.1 **IMPLEMENTED; focused navigation matrix VERIFIED (code `abdad330`, tests `58b7465a`):** project selection filters/expands; switching chats selects the parent/no-project scope; reselecting the already-active chat after All Chats restores its parent scope. Required Chromium smoke #44900882759 passed 10/10, including personal-chat persistence after reload, project deletion isolation, long-list scroll/focus and keyboard menu lifecycle. Full lifecycle matrix (move/clone edge cases, project removal, storage quota failure, mode/locale transitions) and optional full Chromium suite remain open.
- [~] P0.34.2 **IMPLEMENTED in main:** `ai_project_chat_filter_v1` persists `all` / no-project / project-ID scope; stale IDs are normalized; current-chat changes, move/detach, clone/delete fallback and project deletion reconcile the same scope; failed chat writes restore the previous scope. Expanded disclosure state and selected project row are refreshed with the chat list. Broader move/clone/delete/reload and storage-failure matrix remains to be executed.
- [~] P0.34.3 **PARTIAL IMPLEMENTED in main (2026-11-22):** root `index.md` now loads `assets/js/shared-modes.js` after the root `alandi:ready` event. aLandi/aNoteBooki/aCodingi switch inside the same root `#chatBox` + `#composerFooter` frame; mode state is persisted and deep-linked with `#mode=...`; the normal chat DOM, scroll, title, draft and placeholder are restored on exit. Notebook mode reuses the existing `AlandiNotebookStore` IndexedDB: create/select notebooks, add notes/references, import TXT/MD/CSV/JSON/HTML, export JSON, select up to 8 text sources, and route the normal composer through explicit-consent aServi Q&A. Only selected-source excerpts are sent; source hashes/offsets/evidence are persisted by `addSourceChatTurn`. Coding mode has the burgundy shared-frame shell and honestly disables chat until sandbox runtime exists. Remaining: full geometry/keyboard/locale acceptance, Studio job runtime, typed Coding Projects and isolated sandbox.
- [ ] P0.34.4 Agent and research menus must become scenario/configuration catalogues rather than truncated legacy switches. Provide a task-first method, model, Skills, permissions, context, budget, depth, source, resume and output settings only where the backing contract exists; clearly label SPECIFIED/EXPERIMENTAL/UNAVAILABLE capabilities.
- [ ] P0.34.5 Auto-agent participation is chat-aware and policy-driven. Keep direct model chat for simple requests; use genuine bounded specialists when useful or explicitly requested. Store versioned agent/team configuration on chat/project and restore it between turns/sessions. Never store hidden chain-of-thought.
- [ ] P0.34.6 Build two distinct learning workflows: (a) bootstrap/evaluate an agent from project instructions, granted tools, selected knowledge and examples without changing model weights; (b) train/adapt model weights with resource/license-checked datasets, base-model immutability, SFT/LoRA/QLoRA/preference options, held-out evaluation and versioned rollback.
- [ ] P0.34.7 Reconcile the external source catalogue with the current requests: apply relevant entries from INTEL.md to each design/implementation packet; use official current primary sources and record evidence/decision, not indiscriminate dependency adoption.
- [ ] P0.34.8 Preserve free-first public Pages, private server-only autonomy, local/offline capability truth, security/privacy, RU/EN, touch/accessibility and owner-only infrastructure gates.
- [ ] P0.34.9 Record this correction in NOW.md and INTEL.md; new code acceptance remains separate from the fact that requirements are recorded.


### P0.34 — Owner reaffirmation and expanded delivery contract (2026-11-21; SPECIFIED; takes precedence)

This is the owner's repeated, explicit confirmation. It resolves any ambiguity in historical notes: implement the product as a single coherent application, not a collection of primitive menus, links or isolated demos. Preserve the current free-first static Pages client and move privileged compute/data to the owner-controlled server. P0 root/Pages recovery remains the first release gate; P1 through P5 are the required product scope, not optional ideas.

**Exact shared-frame behavior**
- aLandi, aNoteBooki and aCodingi use the same root page geometry: header, window edges, sidebar width/placement, main conversation pane, composer, dialogs, keyboard/focus behavior and responsive breakpoints remain in the same positions. Only mode theme, navigation data, context and genuine capabilities change.
- aNoteBooki uses a deliberate Notebook palette. In its sidebar, the Projects region becomes notebook collections/items; the adjacent chat-list region becomes a compact catalogue of real Notebook Studio jobs (podcast, slide deck, chart, diagram, video presentation, report, quiz/flashcards and other enabled conversions). The normal chat stays in place and is strictly grounded in the active notebook plus explicitly included sources. Each job is source-linked, editable where applicable, cancellable, resumable and exportable; unsupported media jobs are visibly unavailable, never decorative.
- aCodingi uses restrained burgundy/red/black styling with the exact same frame. The normal chat becomes the coding conversation with concise operational status, current task/step, file changes, tool results, tests, diffs, approval prompts, error and stop/resume controls. Do not expose hidden chain-of-thought. The sidebar offers coding tools only when their registry/runtime is actually available.
- Creating a coding workspace creates a typed Coding Project inside the existing Projects hierarchy. Selecting it opens that project's isolated workspace, sandbox, files, run history and project-bound chat. Switching away/back or leaving a mode must save and restore draft, active identity, source selections, agent configuration, scroll/focus and unfinished run state without cross-project or cross-notebook leakage.

**Navigation invariants**
- Selecting a normal project shows only that project's chats. Selecting a chat automatically expands and highlights its parent project and filters the list to that project. Selecting a personal/no-project chat selects the no-project scope. Only explicit All Chats may mix project and personal chats. Selecting an already-active project chat after All Chats must still restore its parent scope. Move/clone/delete/project removal/reload/locale/mode changes must reconcile the same canonical state.
- Project chat membership, currentChatId, selected filter, expanded disclosure, active project, persisted scope and visible list are one transition contract, not separately updated UI fragments.

**Agent, research and learning requirements**
- Replace truncated/obsolete Agents and Research menus with task-first scenario catalogues and compact, progressive settings: goal/method, depth, source scope, model preference, Skills, tools, permissions, context/memory scope, budgets/deadlines, output, resume/cancel and approval policy. Show only controls backed by a real contract; distinguish available, experimental and unavailable.
- In ordinary chat, policy-driven routing may use real specialists when complexity or saved chat/project policy justifies it; simple requests remain direct model calls. Chat/project stores versioned agent/team settings and authorized memory references across sessions. The user can inspect, bypass, stop and resume. No fake agents or hidden chain-of-thought persistence.
- Keep agent bootstrapping separate from model-weight training. Agent bootstrap builds/evaluates a versioned role/profile/Skill from project instructions, granted tools, selected knowledge and examples without changing weights. Weight training is a separate resource/licence-gated workflow with base model immutability, selectable scale/technique (SFT, LoRA/QLoRA, preference methods or full tuning only when justified), dataset validation, held-out eval, metrics, adapter/checkpoint versioning and rollback. Never train production weights from raw chat history by default.

**Autonomy and delivery boundaries**
- Free public Pages is the static client; owner server is the autonomous compute/data plane. All non-web tasks must run without Pages, GitHub, cloud databases or third-party APIs once the server is installed. Internet search is an explicit online capability for main chat and permitted agents/tools; offline mode must be honest and fully disable remote fetches/fallbacks.
- Prepare, do not assume: inventory already-acquired small model artifacts and licences; integrate only after checksum/runtime/resource/eval checks. Main large model placement, account registration, VPS/DNS/Tunnel/secrets and production Cloudflare mutations remain owner-controlled and require the appropriate explicit approval/environment.
- Use the existing large external-source catalogue and connected tools/plugins/skills as a task-specific candidate pool for every package. Select a small best-fit set after current official-source/version/license/security review; do not bulk-install or trust all ~500 entries. Record accepted/rejected/deferred decisions and provenance in INTEL.md.

**New acceptance tasks**
- [~] P0.34.10 **PARTIAL / REQUIRED SMOKE VERIFIED:** Quality Sentinels #45111150135 passed on exact code/test HEAD `d7671b7b2c5f05426b7b0c6185e55cf022247ffb`; root Chromium smoke passed **13/13 tests in 19.8s**. Coverage includes shared-frame geometry, Notebook checked-source isolation/unselected-source exclusion, Notebook sidebar shortcut staying on the root app, direct legacy workspace-route compatibility, Coding fail-closed state, project/chat navigation, same-origin assets and offline shell. The earlier #45110687637 failure was a stale test expecting the removed `/notebook/` sidebar anchor; its assertion was updated to the shared-mode button while direct route compatibility remains tested. Full Chromium suite, desktop/tablet/phone matrix, visual snapshots, focus and native-device acceptance remain open.
- [~] P0.34.11 **PARTIAL IMPLEMENTED / REQUIRED SMOKE VERIFIED:** Notebook panel replaces Projects/Chats with IndexedDB notebooks, explicit source checkboxes (max 8), note/link/text-import/export actions and a Studio catalogue that labels podcast/slides/charts/diagram/video/report/quiz as unavailable rather than fake controls. The normal composer is source-scoped through aServi with confirmation, hashes, offsets and persisted evidence. Quality Sentinels #45111150135 passed on exact code/test HEAD `d7671b7b2c5f05426b7b0c6185e55cf022247ffb` (13/13 focused tests, 19.8s), including the root-frame shortcut transition and source-selection/exclusion. Resumable artifact jobs and broader import/quota/reload/isolation matrix remain open.
- [~] P0.34.12 **SHELL ONLY / E2E AUTHORED:** aCodingi now has a same-frame burgundy mode and explicitly gates the composer while no sandbox exists; it links to the existing base-path-aware browser-local editor and states its limits. Typed Coding Project persistence, per-project roots, sandbox, runs, tools and grants are NOT IMPLEMENTED.
- [ ] P0.34.13 Full navigation lifecycle matrix: project/chat scope, same-active-chat, personal chat, All Chats, move, clone, delete, project deletion, reload, RU/EN and mode transitions; test storage/quota failure and focus/scroll restoration.
- [ ] P0.34.14 Agents/Research catalogue acceptance: scenarios, settings, real capability availability, permission boundaries, direct-chat baseline, specialist routing, persistent chat profile and run recovery.
- [ ] P0.34.15 Learning acceptance: agent bootstrap dry-run/eval and separate model-training resource/license preflight, dataset validation, adapter output and rollback contract.
- [ ] P0.34.16 Offline acceptance: server-only non-web task matrix with network denied except explicitly allowed web-search route; prove no Pages/GitHub/provider/cloud DB dependency.
- [~] P0.34.17 **PARTIAL / SOURCE MAP + VERSION/LICENSE TRIAGE RECORDED:** `INTEL.md` maps owner-added sources to P0–P8 and records initial disposition. Exact latest reviewed versions: Filee v2.5.0 (MIT desktop converter, adapt bounded route/queue/staging only); T3 Code stable v0.1.11 (MIT; nightly v0.1.12 separate, unpinned), Modern Web Guidance v1.0.1 (Apache-2.0 code / CC-BY-4.0 guides) and Altered Audio Editor v0.63.0 (GPL-3.0, audio/P6 only, no code copy). T3 server-owned execution boundary, durable receipt/outbox/replay and diff/approval UX are P1/P3 design candidates; Modern Web task-scoped guides + Playwright A/B eval are P0/P1 candidates; Filee converter graph and cancellation/cleanup rules are P4 candidates. Voyager remains GPL-3.0/no code copy; Oh My OpenAgent Business Use License remains direct-reuse REJECT; Voicebox/Meetily/DSH code licenses do not cover model/voice/provider terms. VERT conversion assessment now distinguishes existing model-facing extraction from the missing user-visible converter registry and artifact-job pipeline. Remaining: resolve Nota/Wenwiko/KL identities; inspect remaining code/model/voice/data licenses; run task-specific bake-offs/evals and ACCEPT/DEFER/REJECT per P1–P5. No upstream code or runtime dependency was imported.

**Done gate:** do not mark P1–P5 complete because the UI is present or a Pages build is green. Each capability needs a working backend/runtime, deterministic tests, permissions, failure/cancel/recovery, RU/EN and evidence on the exact HEAD. Pages publication, browser runtime, server runtime, model availability and native-device acceptance are separate gates.


### P0.35 — Owner visual identity, mode selector, header, settings and interaction details (2026-11-25; SPECIFIED)

Эта группа расширяет P0 acceptance, не закрывая уже существующие P0 дефекты.

- [ ] **P0.35.1 Mode-selector state machine:** collapsed colored strip (~1/3 visible button height) identifies the current mode; expands into three equal mode buttons with a restrained cell-division transition. Entry/return signal is a short flash at 2× the regular expansion cadence, then auto-collapse. Active-mode click collapses; different-mode click selects and remains expanded; second click on the now-active mode collapses. Preserve state/history/focus. Provide full keyboard and touch hit areas even when the visual strip is thin.
- [ ] **P0.35.2 Palette tokens:** derive brand turquoise from the actual aLandi emblem asset; trial a graphite/silver dark family and coordinated pearl/silver light family. Build semantic tokens for canvas/surface/elevated surface/text/muted text/border/focus/selected/disabled/success/warning/error. Evaluate all text, controls, charts and overlay states at WCAG 2.2 AA; never use color as the only signal. Final HEX values remain open until emblem sampling and contrast matrix are available.
- [ ] **P0.35.3 Motion and feedback:** keep glow, selected-state pulse, moving highlight and color transitions short/low-amplitude; use one composable animation mechanism if native CSS/Web Animations is insufficient and its cost/licence are justified. Respect prefers-reduced-motion and an explicit reduced-animation setting; no decorative infinite motion by default.
- [ ] **P0.35.4 Dual logo concept:** prepare the abstract interwoven/grounded mark and custom typographic aLandi wordmark as separate assets; double-click on the header logo (double-tap on touch) must switch variants, and a separate discoverable accessible control must also work by touch/mouse/keyboard; the gesture is a shortcut, never the only route. Record source prompt, generation model/version, rights and asset hashes. Until real assets and exact emblem reference exist, keep this SPECIFIED.
- [ ] **P0.35.5 Stable header geometry:** fixed clock position independent of long project/chat names; separate title lines and typography; readable clock hands/labels on overlap; localized compact untitled indicator and hide it inside a named project. Test 320/390/768/1024/1440 px and browser zoom.
- [ ] **P0.35.6 Dynamic Projects/Chats layout:** size the two sections to their content without wasting viewport; make section headers clearer/larger than rows; subtle selection/expanded feedback; preserve keyboard, scroll, reduced motion and stable project/chat scope.
- [ ] **P0.35.7 Controls and message actions:** halve visual footprint of square buttons where feasible while preserving 44 px mobile hit target; attach message actions at the card edge without covering text, links, selection or code blocks.
- [ ] **P0.35.8 Additional Settings IA:** order: layout/features → system prompt → Offline Core/storage/export → core technical settings → collapsed appearance/accessibility group. All groups collapsed except layout and system prompt. Persist expansion only if it does not conflict with the owner-specified initial state.
- [ ] **P0.35.9 Overlay/voice regressions:** reproduce aServi/voice overlay dismissal, backdrop lock and selected-provider reset paths; add RU/EN browser regression tests for outside click, Escape, cancel, missing server and provider independence.
- [ ] **P0.35.10 Native attachment picker:** deduplicate iPhone photo/file controls only when native picker behavior is genuinely identical; retain distinct controls where they perform different functions. Verify on real iOS Safari.
- [ ] **P0.35.11 Real-time status projection:** use durable run/activity events and typed states; no invented percentages or hidden-reasoning transcript. Add reconnect/replay, error, cancel and no-event/idle tests.
- [ ] **P0.35.12 Motion/logo prompt package:** two prompts in the owner addendum above are design briefs only. Image creation, source files, variants, accessibility and real device review remain open; do not claim generated logos until assets exist.

- [ ] **P0.35.13 Exact Chromium baseline triage (code/test baseline `191b2dac`; run `45553470306`):** classify each unique failure once (do not double-count Playwright retry output); separate product defect, stale assertion/text contract, locale nondeterminism, mock/route setup error, geometry/tolerance issue, browser/harness limitation and genuine flaky test. First confirmed examples: expected English `Completed` while page is Russian `Завершено`; exact Russian toast copy assertions disagree with current semantically equivalent copy; old multimodal title expects `AI Mobile Agent` while page uses `aLandi v10.0`; disclosure text assertion expects English while page is Russian. These are test-contract mismatches only where explicit locale/semantic equivalence is verified, not permission to weaken user-facing behavior. Actual interaction candidates include modal focus restoration, mobile composer/touch target, nested menu dismissal, provider probe/catalog deletion, voice recording lifecycle, chat/project storage rollback and privacy-memory request counts. Reproduce each on clean storage and current `main`, inspect trace/screenshot/console/network; add focused deterministic tests; preserve real permission/security/privacy checks. Never solve by skipping tests, broadening timeouts, deleting assertions, or accepting unverified cross-provider sends. Exit gate: unique failures triaged, focused regression passes, full exact-HEAD Chromium passes, retries/flakes documented with evidence.


**Triage snapshot — 2026-11-25 (run #45553470306; exact code/test SHA `191b2dac602273a2c3c4a2d80fbd722acadf6cd1`).** Raw Chromium job log was re-read, not inferred from its summary. Reporter summary: **213 passed, 45 failed, 1 flaky** over 22.8 minutes; output contains 46 numbered failure entries because retry/flaky reporting must be deduplicated before counting. Initial classification below is investigative, not a declaration that every item is a product defect:

| Test / observed failure | Initial classification | Required action |
|---|---|---|
| `app.spec.mjs:1178` API auth feedback | stale copy assertion: actual RU message includes HTTP 401 and a more specific provider-key hint | update assertion to current localized semantic contract; keep prompt-preservation check |
| `:1202` provider catalog/key deletion | unresolved async/route/dialog timeout | trace requests, modal state and confirmation lifecycle |
| `:1556` historical cache metadata | metadata fixture/render mismatch: DOM only exposed provider/model, not expected cache HIT | trace fixture-to-render metadata contract |
| `:2219` project bundles | focus restoration failure | product candidate; inspect dialog close/return focus |
| `:2907` active voice recording | capture/status lifecycle timeout | separate unavailable-device fixture from real lifecycle defect |
| `:3326` request-only project context | expected mock response, actual aServi-unconfigured greeting | inspect provider state, route matching and fail-closed contract |
| `:3458` toast semantics | stale copy assertion; actual Russian validation is semantically equivalent | test role/polarity and current localized meaning |
| `:3654` AgentRun | locale mismatch: RU page expected English `Completed`, actual `Завершено` | make assertion locale-aware; retain state/event assertions |
| `:4263` narrow composer | real geometry candidate at 320 CSS px | inspect layout and fix, do not relax 44px or draft usability |
| `:4295` nested menu/touch | interaction timeout | inspect open/close and hit-target path |
| `:4456` toolbar disclosure | focus return failure | product candidate; restore invoker focus |
| `:4481` Functions panels | expected panel content differs from current structure | compare actual runtime catalogue and truthful capability labels |
| `:4715`, `:4767` settings import rollback | stale error-copy assertions; current message is more specific | update copy assertion only; preserve rollback and key-isolation checks |
| `:4885` skill/agent setters | timeout under failing storage | reproduce rollback and state restoration |
| `:5333` mobile dialogs | strict locator matches two close controls | scope test to intended header close control; separately decide if duplicate UX is desirable |
| `:5442` settings modal | focus trap/restore failure | product candidate; repair keyboard lifecycle |
| `:5513` sidebar balance | historical equal-height assertion conflicts with owner's newer content-driven sizing requirement | replace obsolete equal-height test with dynamic-height/no-wasted-space acceptance |
| `:6164`, `:6197`, `:6256` custom Agent/Skill fields | selection, visibility and timeout failures | inspect field state machine/persistence; do not mark unavailable fields as working |
| `:6466` projectless filter | expected 1 chat, rendered 9 | high-priority navigation-scope candidate; verify fixture and currentChat/project contract |
| `:6683` keyboard order | voice control not reached at expected Tab position | inspect focusability, hidden/disabled capability state and accessible order |
| `:6737` RU/EN Agent summary | test expects obsolete fixed-stage wording; owner explicitly rejected mandatory four-step workflow | remove fixed-stage assumption and test meaningful locale/state content instead |
| `:6777`, `:7400` composer placeholder | stale/unstable literal placeholder expectations | inspect `composerPlaceholder` dictionary and viewport-specific placeholder policy |
| `:6800` locale refresh | project/request-context focus lost | product candidate; preserve element identity/focus after rerender |
| `:6839`, `:7283` memory confirmations | dialog interaction timeout | inspect native dialog sequencing and action dispatch |
| `:6929` reduced motion | CSS computed time serialization differs (`1e-05s` vs `0.01ms`) | assert normalized numeric duration, not browser serialization |
| `:6954` dynamic locale options | strict locator matches two close controls | scope locator to modal header; retain Escape/backdrop behavior tests |
| `:7239` accessible controls | timeout in inventory | identify exact control and hidden-navigation state from trace |
| `:7370` recovery warning | stale error-copy assertion | assert current localized warning, backup visibility and byte preservation |
| `:7443` request-context cap | timeout | inspect selected-project fixture and cap/rejection flow |
| `:7608` chat-list scroll/focus | scroll shifts 11px during RU/EN rebuild | inspect row-height changes; preserve visual anchor, do not hide arbitrary drift with large tolerance |
| `:7650` Project Settings locale changes | edit/focus timeout | inspect modal rebuild and draft preservation |
| `:7873` backup downloads | download/click timeout | inspect fixture storage, browser download event and backup bytes |
| `multimodal-skill.spec.mjs:12` | stale title `AI Mobile Agent`; actual title is `aLandi v10.0` | update brand/title assertion while retaining specialist-skill behavior |
| `privacy-memory.spec.mjs:167` | cancel promotion timeout | reproduce cancel path; verify private fact remains private |
| `:229` fail-closed privacy marker | expected blocked request message, actual welcome/unconfigured provider state | verify fixture setup and prove zero outbound model requests |
| `:330`, `:378`, `:518`, `:640` memory/provider scope | observed outbound request counts differ from fixture expectation | inspect actual network timeline and privacy boundary; never change expected count without evidence |
| `:461` external project disclosure | RU disclosure text compared with English phrase | set intended locale or assert locale-specific equivalent; preserve disclosure and no-send-on-cancel |
| `context-budget.spec.mjs:14` | retained history differs from expected `OLD_TURN_7` | inspect token budget/retention algorithm and fixture model context; do not loosen privacy/context cap |

**Triage priority:** first settle privacy/network-boundary and context-budget tests (#40–46), then focus restoration/navigation (#4, #11, #17, #22, #23, #26), then mobile geometry (#9, #10), storage rollback and project/skill state, then assertion-contract cleanup. Any test-only correction must preserve or strengthen what is actually proven. Do not close this gate until each unique case has one evidence-backed classification and the complete exact-HEAD Chromium run passes.

**Design and release gates:** no palette or motion change may weaken existing high contrast, focus visibility, touch access, reduced-motion, RU/EN, iOS or browser lifecycle behavior. Keep experimental visual effects behind an optional feature flag until comparable screenshots and interaction tests pass.

### 0.4 Owner requirement traceability — consolidated sweep (2026-11-25; SPECIFIED)

Эта карта — проверка полноты требований владельца, а не дополнительная очередь и не статус реализации. Она связывает исходные пожелания с единственным активным acceptance; при изменении приоритета обновлять соответствующий раздел, а не создавать дубликат.

| Owner requirement / intent | Canonical acceptance / destination | Current disposition |
|---|---|---|
| aLandi naming: lowercase `a` + `i` frame, Land = grounding in private offline environment; aCodingi/aNoteBooki | 0.3.3, P0.35.4, P1 | SPECIFIED; naming review may refine names, not erase the concept |
| Two logo directions: abstract grounded/interwoven mark and custom wordmark; required header double-click/double-tap shortcut plus separate accessible switch control | 0.3.3, P0.35.4, P0.35.12 | SPECIFIED; no final logo assets yet |
| Graphite/silver dark + pearl/silver light, emblem-derived turquoise, contrast and restrained motion | 0.3.1, P0.35.2–P0.35.3 | SPECIFIED; emblem asset sampling and visual acceptance open |
| Thin active-mode strip, equal three-way expansion, cell-division transition, fast return signal, auto-collapse, two-click selection/collapse semantics | 0.3.2, P0.35.1 | SPECIFIED; state-machine implementation and lifecycle tests open |
| Stable clock/header geometry, project/chat title layout, untitled-label behavior | 0.3.4, P0.35.5 | SPECIFIED; responsive/locale/zoom acceptance open |
| Dynamic Projects/Chats height, hierarchy, selection feedback and strict identity/scope | 0.3.5, P0.35.6, P0.34.13 | SPECIFIED/PARTIAL; full lifecycle matrix open |
| Smaller visual controls without smaller hit areas; message actions at card edge | 0.3.6, P0.35.7 | SPECIFIED; geometry and accessibility acceptance open |
| Additional Settings order, default collapsed groups, storage/backup/restore/export policy | 0.3.7, P0.35.8, P5 | SPECIFIED; implementation and conflict/retention policy open |
| Shared aLandi/aNoteBooki/aCodingi frame; Notebook can freeze after useful stable baseline | P0.34, P1, P4, 0.3.11 | SPECIFIED/PARTIAL; Notebook Studio expansion intentionally deferred |
| NotebookLM/Gemini Notebook-inspired source-grounded notebook, citations, notes and later Studio outputs | P0.34 shared-frame contract, P1, P4.9–P4.11 | SPECIFIED; use as behavioral inspiration only; Notebook remains frozen until priority returns |
| Cursor-like full coding IDE: project tree, multi-file edit, diff, terminal/test/build/debug, task chat and rollback | P1, P3.10, P0.34.12 | SPECIFIED; current Coding mode is shell-only, not a full coder |
| ComfyUI-like node/graph workflow UX for real multi-step pipelines, not decorative agent boxes | P3.13 (added), P3.2–P3.6 | SPECIFIED; only for workflows with typed executable contracts |
| Direct chat remains zero-overhead; model/provider/draft/attachment/voice/project continuity | P2, P1 addendum | SPECIFIED; routing and visibility lifecycle acceptance open |
| True multi-agent/subagent orchestration, delegated work, durable runs, objective real-time state, replay/resume/cancel | P3.4–P3.7, P0.35.11 | SPECIFIED/PROTOTYPE; independent workers and durable production lifecycle not yet VERIFIED |
| Skill Library and versioned agent profiles with provenance, permission boundaries and rollback | P3.8, P3 addendum | SPECIFIED; lifecycle implementation/evals open |
| Separate agent bootstrap vs model-weight training; consented datasets, held-out eval, adapters and selectable only after pass | P0.34.6, P3.11–P3.12 | SPECIFIED; training runtime not implemented |
| Pre-upload destination/name/path and conversion target; fidelity warnings; resumable job | P4.6, P4 addendum | SPECIFIED/PARTIAL; extraction registry is not the user-facing converter pipeline |
| Stable-ID File Library, versions/derivation lineage, sort/filter by date/chat/project/type/size/source/status | P4.1, P4.6, P4 addendum | SPECIFIED; artifact UI/index lifecycle open |
| Per-project file sandbox grants, own-folder/full managed sandbox/explicit device paths, revoke/audit | P3.10, P4 addendum | SPECIFIED; no arbitrary file access |
| Office import/export/preview via LibreOffice only after license/size/isolation/platform gate | P4 addendum | SPECIFIED; optional and unavailable until validated |
| Offline Core, device folder hierarchy, stable IDs, atomic writes, backup/restore, relocation across local/server/VPS/models | P5.1–P5.12, P5 addendum | SPECIFIED/PARTIAL; package acquisition subset only, target-host acceptance open |
| Small downloadable local knowledge databases and versioned coding/API reference packs | P5.15 (added), P4.8, INTEL | SPECIFIED; package selection, licenses, hashes and retrieval eval open |
| Local/browser voice input and playback where runtime exists; voice cannot reset third-party provider | P0.35.9, P6 addendum | SPECIFIED; real browser/device capability matrix open |
| Personal voice cloning only from authorized recordings, explicit consent, local default, delete/export/preview, multilingual quality eval | P6 addendum, P6.1–P6.8 | SPECIFIED; adapters disabled pending artifact/device gates |
| Five trusted external providers + custom adapter, truly free/reachable catalog, live discovery and capability summary | P7 addendum | SPECIFIED; owner provider decision and live verification pending |
| Confirm route switch, isolate provider credentials from aServi, bounded same-provider retries, no silent cross-provider prompt transfer | P7.2–P7.6, P2 | SPECIFIED; regression matrix open |
| Voice overlay/backdrop dismissal and preservation of external provider/model/key | P0.35.9, P6 addendum | SPECIFIED; reproduce and test |
| iPhone native picker deduplication only when behavior is identical; test real Safari | P0.35.10, P0.21.27 | SPECIFIED; native device gate open |
| Real status panes and collapsible safe rationale; never expose hidden chain-of-thought | P0.35.11, P3.6, P3 addendum | SPECIFIED; event replay and UI projection acceptance open |
| Free-first static Pages client, private server autonomy, explicit online web-search exception | 0.1, 0.3.12, P0.33, P5.2 | SPECIFIED/PARTIAL; server-only acceptance open |
| Review all external candidates and complete code/model/data licenses, advisories, resource and offline fit | 0.2, P0.34.7, INTEL | SPECIFIED/PARTIAL; task-specific primary-source packs remain per-slice gates |
| Repository About metadata, Pages policy and owner-only host/secret/billing/DNS/Tunnel actions | NOW, P8, issue #111 | OWNER GATE; About description still requires manual owner update |
| Reversible experiments outside core, off by default, measured, kill criteria and rollback | 0.3.13, LOOP.md | SPECIFIED |

### 0.5 Project Sources / N₂O archive — owner decision (2026-11-25; FACT + DECIDED)

- Live `AGENTS.md` is the active engineering contract and already implements the current entry protocol: read `NOW.md` lines 1–100, verify live main and open queues, then use the master plan and INTEL. The uploaded AGENTS snapshot is older and must not replace the live file.
- Live `LOOP.md`, `docs/ALANDI_N2O_CORE_RU.md`, `docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md`, `docs/ALANDI_N2O_CHATGPT_SOURCES_RU.md` and `docs/ALANDI_CHATGPT_PROJECT_INSTRUCTIONS_RU.md` are archive stubs dated 2026-11-18. The uploaded v1.1 files are useful historical source material, not current repository policy.
- Current canonical working documents remain exactly `NOW.md`, `docs/ALANDI_MASTER_PLAN_RU.md` and `INTEL.md`; `AGENTS.md` is the active engineering entry contract. Do not create a competing backlog, resurrect old orienters or silently restore a second knowledge workflow.
- `AGENTS.md` v2.0 deliberately uses an adaptive method rather than a mandatory four-step ritual: the amount of research, planning and verification is proportional to task complexity and risk.
- **OWNER DECISION (2026-11-25): keep N₂O and its four workflow/source documents archived permanently unless the owner explicitly changes direction.** The old system is outdated; its fixed four-stage flow is not a universal requirement and must not be imposed on every activity. Preserve useful ideas—owner authority, evidence maturity, no hidden-reasoning storage, reversible changes, reusable knowledge and deduplication—through the adaptive `AGENTS.md` v2.0 contract and canonical docs. Do not restore N₂O, create replacement ceremony or add a parallel orienter.
- Project Sources and Project Instructions are manually maintained. Replace stale uploaded copies from the live repository; do not assume GitHub updates the Project automatically. The active source of operational behavior is `AGENTS.md` v2.0, not historical N₂O files.

### Incident record — root app controls unavailable (2026-11-21)

- **FACT:** commit 58be3e1 omitted the closing brace after the Python runtime-load catch. The initial repair in 8fbb128 restored the function boundary, but live browser instrumentation then exposed a second bootstrap exception: top-level `applyUiLanguage()` ran before the later `let activeVoiceStatusKey` declaration, causing a temporal-dead-zone ReferenceError inside `refreshVoiceRecordingStatus()`. This aborted the IIFE before delegated click registration. Static Jekyll/Pages success did not detect either runtime fault.
- **IMPLEMENTED:** 8fbb128 closed the catch. Follow-up b1a8a3f removed the premature top-level locale render; saved locale continues to be applied by `initializeSettings()` after all runtime state declarations. Commit dc997572 adds a required Playwright Chromium root-app smoke to every relevant push Quality Sentinels run, asserting no page errors and real Settings + Quick/Thorough interactions.
- **VERIFIED:** Quality root-app smoke #44886724869 SUCCESS on code/test HEAD dc997572. Push-triggered Pages run #44886724596 SUCCESS for exact SHA dc997572. Published site reports `alandi-build-revision=dc997572ab4a356aca9b221a344cba06496e35fd`; live browser smoke confirmed Settings opens/closes, Thorough/Quick state toggles, and no page/console errors.
- **LIMITS:** full Chromium suite, native iOS Safari/VoiceOver, full navigation/composer matrix and server/offline acceptance remain unverified. Graphify #44886658887 SUCCESS on preceding code/test HEAD b1a8a3f, not dc997572.
- **PREVENTION:** required root interaction smoke is now in CI; Pages build success is not treated as proof of client runtime correctness.

## 1. Проверенный baseline на момент объединения

- FACT at consolidation start: main HEAD 42a63dbd6cea81e97e7a577fce159700186771ac; open PRs: 0; open issue #111 (owner/live host release gates) and unrelated #186. Docs consolidation advanced main afterward.
- VERIFIED: Graphify run #44297733900 SUCCESS and Pages deploy #44297733956 SUCCESS, both exact HEAD 42a63dbd6cea81e97e7a577fce159700186771ac. Combined status API returned no status records; do not conflate that endpoint with Actions results.
- FACT: latest 15 commits since stale checkpoint 60de827 entered main; include row/menu focus, validation, persistence, i18n and live panel refresh fixes.
- FACT: four Functions panels exist: Agents, Deep Research, Skills, Connectors. Connectors honestly reports unconfigured registry; no live connector is implied.
- FACT: /workspace/ is permissioned browser-local file editing with diff/confirmation/recovery, not AI Coder, shell, test runner, or sandbox.
- FACT: AgentRun is a limited SQLite DAG/prototype with one worker/model slot and serial inference; no general independent swarm or arbitrary tools/filesystem/network. Legacy four-stage same-model pipeline is not independent multi-agent execution.
- FACT (current source-tree inspection): `/notebook/` exists as a standalone local-first page with IndexedDB notebooks, notes, TXT/MD/CSV/JSON/HTML text imports, non-fetched web references and lexical retrieval over selected notes/files. Sending matching excerpts to aServi requires an explicit RU/EN confirmation; the whole notebook and unselected sources are not sent. This is not yet the shared aLandi frame, and URL references are not fetched/indexed. `/workspace/` exists as a separate browser-local file editor with diff/approval/recovery, not an isolated AI coding runtime or server sandbox. These standalone routes do not satisfy P1 shared-frame acceptance. Only aCodingi and aNoteBooki names are explicitly owner-confirmed; do not invent missing studio names.
- FACT: retrieval baseline is SQLite FTS5 + lexical concept graph; full hybrid/vector RAG is not proven. Extraction/RAG flags were documented off by default.
- FACT: Offline Core is specified, not a verified installable/local-inference package. Voice UI/prototypes do not prove working ASR/TTS/audio on a device.
- FACT: VPS, Tunnel, Ollama, production model weights, real provider credentials and native iPhone Safari/VoiceOver are not verified by these repo checks.

## 2. Новая приоритетная последовательность

### P0 — Root app / landing UI finish (сейчас)

- [~] P0.1 Sidebar: IMPLEMENTED compact headings/rows and independent scrolling; mobile Create/primary rows preserve 44px touch targets. Still measure desktop density and approach ~2× reduction without harming readability (commit `3f20322f`).
- [x] P0.2 Создание: Create Project и Create Chat размещены компактными `＋`-действиями прямо в заголовках секций, с локализуемыми accessible names (commit `3f20322f`).
- [~] P0.3 Collapsible Projects: collapse gives the freed height to Chats; expanded list has internal scroll cap. Focus/scroll/selection persistence needs browser acceptance (commit `3f20322f`; E2E added, not run).
- [~] P0.4 Project Settings: FACT — form is already grouped by Context, Profile, Memory, Sources and Data; no rebuild needed. Mobile density, actions, save/cancel/migrations and duplicate audit remain.
- [~] P0.5 Единая визуальная система: добавлен общий token layer для typography, line-height, spacing, radius, elevation, focus geometry, touch target и motion; toast, cloud card/status, popovers, toolbar panel и dialogs переведены на shared semantic tokens. Playwright token contract для dark/light добавлен; runtime visual acceptance и полный перевод остальных hard-coded styles остаются открытыми.
- [~] P0.6 Mobile: primary sidebar navigation and nested project/chat actions already target 44px; this package extends the same minimum to chat/project menus, toolbar, attachment/context/voice choices and attachment removal. Responsive visual acceptance and real-device pass remain open.
- [~] P0.7 Responsive: диапазон 320–1440px, portrait/landscape and root overflow regression added; mobile dialog safe-area padding/internal-scroll rules and 320×568 settings/functions/chat-action geometry test added. Keyboard/VisualViewport and native-device acceptance remain open.
- [~] P0.8 Menus/dialogs: primary Settings/Functions/Project dialogs have focus lifecycle and keyboard/outside-close in code/E2E; toolbar Search/Functions disclosures close on Escape and outside click with focus return. Full dialogs/popovers, scroll containment, background inert and viewport/keyboard edge cases remain; browser tests not run here.
- [~] P0.9 Chat row actions: rename/move/clone/delete/clear/export/import handlers exist; existing E2E covers move dialog, clear, clone, delete-cancel, keyboard and focus. Added a focused rename + selected-chat export regression test; import/export bundle behavior was delivered historically (PR #118). Still run the full browser suite and verify mobile/desktop menu geometry, touch and active-item persistence.
- [~] P0.10 Composer: narrow-phone layout keeps the four utility controls in a first row and draft + send/stop in a usable second row at <=380px. Added 320/360px geometry regression plus nested attachment/context/voice menu and attachment-removal target coverage; browser execution pending. Remaining: empty/populated/long draft, stop/cancel/retry/regenerate and native keyboard reposition.
- [~] P0.11 Forms: project create/edit and aServi required URL/model/key validation, localized errors, `aria-invalid`/`aria-describedby`, first-invalid focus and corrected-error clearing already exist with E2E coverage. Remaining: cross-form required/validation/error/success/busy/disabled/offline matrix, consistent first-invalid focus, safe retry/clear and no false connected states.
- [~] P0.12 Functions IA: four independent panels exist. Research and Agents separate active runtime / saved blueprint / planned methods; Skills and Connectors still need contract and visual audit. AgentRun chat integration is present in client code (bounded context packet, chat result return, active-run restore and chat-anchored status), but Gateway `ALANDI_AGENT_RUNS_ENABLED` defaults false; never imply host availability or production readiness from the UI/code alone.
- [x] P0.13 Deep Research panel: duplicate Quick/Thorough and web breadth removed; real `multi_step_evidence_report` (sequential stages on one model) remains selectable, other methods are a non-interactive planned catalogue. No fake multi-agent independence (commit `8d88296ffc1ef86a7df0ed9368e897bc40e9d425`).
- [~] P0.14 Agents panel: runtime separated from saved role blueprint; read-only catalogue includes specialist profiles, chat-directed subagents, parallel teams, review/debate, coding team, swarm/DAG and custom builder as PLANNED. Actual runtime remains one Gateway worker/concurrency=1; independent subagents/agent library/builder are not implemented (commit `4bd7df01…`).
- [~] P0.15 Live chat status: allowlisted Gateway events and real `occurred_at` timestamps appear in the Agents panel; main-chat integration also has a chat-anchored status surface, task/event rendering, active-run restoration and result return. Verify exact behavior for progress/error/approval/cancel/reconnect and keep UI status separate from feature-flag/host availability.
- [~] P0.16 RU/EN: all static `data-i18n*` markup references exist in both dictionaries; duplicate `languageLabel` and project-memory helper keys removed, and a static Playwright guard checks uniqueness/completeness. The aNoteBooki sidebar descriptor and accessible name now follow RU/EN locale without changing its route. Chat message region and AgentRun chat/panel controls, task/event lists and refresh tooltip also localize their accessible names in RU/EN. Dynamic validation/empty/error/loading/disabled state matrix remains.
- [~] P0.17 Theme/motion/accessibility: light/dark and stored motion preference already work; system reduced-motion is honored in auto mode. Added first-focus keyboard skip link to chat, localized theme-toggle target name + aria-pressed state, and stronger focus/border/link treatment in high-contrast mode. New Playwright coverage is authored, not yet run. Full WCAG/ARIA, landmarks/live regions and real browser/device acceptance remain open.
- [~] P0.18 Remove deadwood: a report-only Acorn AST pass runs after Jekyll against generated `_site/index.html`; fixture tests cover direct calls, recursive-only functions, exports, window['name'], inline handlers and malformed syntax. First exact build: 598,978 inline-JS bytes, 74,171 AST nodes, 855 function nodes, 115 data-action attributes, 0 parse errors and one low-confidence candidate. Manual source/test/search review confirmed setAgentMode was an unreferenced legacy wrapper; removed it and its stale Graphify seed reference. Active setDeepResearchMethod/legacy checkbox behavior remains wired and existing E2E coverage remains. Re-run audit after removal; keep report-only and do not auto-delete. Remaining: calibrate false positives against runtime consumers and manually review future candidates.
- [~] P0.19 Performance / quality tooling: report-only Acorn audit measures generated HTML/inline-JS payload, script inventory, AST/function counts, action/handler references and parse errors with fixtures. Lighthouse CI 0.16.1 now runs three mobile lab samples against generated _site, stores reports only on the ephemeral runner filesystem, and prints median LCP/CLS/TBT/FCP plus top performance opportunities and accessibility findings; no public upload, thresholds or build gate. First one-run baseline was performance 81, accessibility 96, best-practices 92, SEO 100; LCP/FCP 3.04s, TBT 337ms, CLS 0, INP unavailable. Remaining: inspect three-run opportunities, repeat on desktop, capture field Web Vitals only if CrUX/RUM data exists, then set justified budgets.
- [~] P0.20 Final UI acceptance: exact application/test HEAD `8e2a03ef1e0be751ae5ca49efc714a7b36f692a8` on main: Quality Sentinels #44672296672 SUCCESS (Jekyll, Integrity, Security, Context PASS), Graphify #44672296604 SUCCESS, Pages build/deploy #44672296035 SUCCESS. Chromium, Lightpanda, independent static analysis and published-release contract were SKIPPED; no E2E pass is claimed. TinyFish post-deployment smoke #42f29d9d-aa38-4df7-93b0-a1401c0dd65e confirmed aLandi v10.0, RU→EN→RU and Functions labels, no visible page/runtime errors. It could not open voice disclosure/sidebar and exposed no viewport/build SHA; Project Sources and those controls remain UNVERIFIED. The RU/EN live-state package adds cached Project Sources, active voice capture, in-flight request status/timer and historical metadata regressions; Chromium execution remains pending. Complete 320–1440px matrix and native iPhone Safari/VoiceOver remain open. PR #187 remains DIRTY and is not merged.

### P0.21 — 30-point landing acceptance matrix (all items remain open until exact evidence)

**Mobile and responsive geometry**

`[~]` means implementation or focused regression exists but browser/device acceptance is still pending; none of these 30 points is fully VERIFIED by the matrix alone.
1. [~] 320 CSS px: root/body overflow and header/composer bounds have Playwright coverage; browser execution pending.
2. [~] 360 CSS px: root/body overflow and header/composer bounds have Playwright coverage; browser execution pending.
3. [~] 390 CSS px: sidebar/nav/menu 44px geometry tests exist; full surface audit pending.
4. [~] 640 CSS px: root overflow sweep covers breakpoint width; all control bounds pending.
5. [~] 768 CSS px: root overflow sweep covers tablet width; visual hierarchy acceptance pending.
6. [~] 1024 CSS px: root overflow sweep covers width; overlap/visual hierarchy acceptance pending.
7. [~] 1280 CSS px: root overflow sweep covers width; detailed alignment acceptance pending.
8. [~] 1440 CSS px: root overflow sweep covers width; typography/measure acceptance pending.
9. [~] Landscape 844×390: Playwright checks root overflow plus header/toolbar/composer left-right bounds, textarea target height and Send visibility; browser execution pending.
10. [~] Composer resize and short-viewport popover tests exist; real OSK/VisualViewport offset simulation and native iOS keyboard remain open.

**Composer and menus**
11. [~] Composer row geometry and 44px control tests exist at 320/360px; browser execution pending.
12. [~] Narrow composer regression asserts >=200px draft width at 320/360px; browser execution pending.
13. [~] Send target geometry is asserted; visible Stop target is now measured at 44×44, while real streaming/abort state remains a separate scenario.
14. [~] Attachment, project/chat, Functions and context/voice menu actions plus attachment removal have Playwright 44px target coverage; width and height are now both measured. Bounded scrolling remains.
15. [~] Request context scope and active-chat project isolation have E2E coverage; touch/scroll acceptance pending.
16. [~] Voice menu copy and 44px action-target regression added; browser execution pending.
17. [~] Escape/outside dismissal closes only the active popover and returns focus to its trigger; Search/Functions disclosures close on Escape and outside click, composer popovers have Escape handling; outside-click focus return added, but the full cross-menu matrix remains unverified.
18. [~] Attachment removal width/height and draft preservation have regression coverage; browser execution pending.

**Sidebar and navigation**
19. [~] Sidebar swipe, overlay and close controls have E2E coverage; browser execution pending.
20. [~] Projects/Chats disclosure and Create touch targets have 44px geometry coverage; browser execution pending.
21. [~] Project/chat row targets have 320/360/390px coverage; browser execution pending.
22. [~] Nested project/chat action entries have 44px width+height coverage; browser execution pending.
23. [~] Long navigation list internal-scroll tests exist; browser execution pending.
24. [~] Projects collapse/Chats height and state preservation have regression coverage; browser execution pending.
25. [~] Menu Escape/outside click does not activate the control underneath and restores focus; toolbar disclosure Escape handling is implemented and a regression test is added, awaiting Chromium.

**Dialogs, forms and accessibility**
26. [~] Settings/Project/Chat focus lifecycle already has tests; added Functions + Chat Action Tab/Shift+Tab wrap, Escape close and invoker restoration regression. Chromium execution pending.
27. [~] Project create/edit tests assert textual RU errors, aria-invalid, aria-describedby→role=alert and first-invalid focus; full EN/browser pass pending.
28. [~] aServi URL/model/key tests assert sequential textual errors, aria-describedby→role=alert and corrected-error clearing; browser execution pending.
29. [~] RU/EN, both themes, contrast and reduced-motion have existing focused tests; full cross-surface matrix pending.
30. [~] Keyboard traversal, accessible names, status/error roles and focus behavior have E2E coverage; screen-reader and native VoiceOver remain manual gates.

- [x] P0.22 Mobile interaction polish: extended 44px minimum hit areas to nested chat/project actions, toolbar choices, attachment/context/voice menus, attachment removal and jump-to-latest; Project Settings inputs/selects also use 44px minimum height. Menu spacing tightened and reduced-motion transitions disabled. Browser execution remains separate.
- [~] P0.23 Project Settings mobile workspace: narrow-screen settings use a safe-area-aware full-height sheet with sticky compact header, reduced group padding, readable 16px fields (avoids iOS focus auto-zoom) and bounded internal scrolling; added 320/390px Playwright geometry/field-size regression. Browser execution pending.


### P0.25 — Root controls, toolbar and form-state consistency (IMPLEMENTED; browser acceptance pending)

- [~] 1. Unified visible keyboard focus for buttons, links, inputs, selects, disclosures and explicit role=button controls.
- [~] 2. Theme-token focus treatment respects light/dark and forced-colors system mode.
- [~] 3. Disabled buttons and aria-disabled controls no longer retain active visual affordances.
- [~] 4. Busy controls expose a progress cursor without inventing a loading indicator.
- [~] 5. aria-invalid fields use semantic danger border and restrained error halo.
- [~] 6. Inline field errors share readable size, spacing and semantic color.
- [~] 7. Disabled form fields use consistent muted surface and cursor.
- [~] 8. Labels and placeholders use theme-aware muted text without changing copy.
- [~] 9. Mode toolbar uses shared surface/border tokens.
- [~] 10. Fast/Thorough pressed state is visually explicit and semantically distinct.
- [~] 11. Toolbar disclosures align content, use bounded scroll and stable scrollbar space.
- [~] 12. Toolbar options have keyboard-focus treatment and predictable minimum row height.
- [~] 13. Composer surface and border align with the shared theme.
- [~] 14. Composer tools have consistent alignment and compact desktop sizing.
- [~] 15. Draft field has theme-aware text, border and placeholder states.
- [~] 16. Send and Stop use distinct primary/destructive semantic treatments.
- [~] 17. Sidebar section and row-menu triggers share the focus language.
- [~] 18. Focus within project/chat rows is visibly discoverable.
- [~] 19. Settings disclosure rows have consistent minimum height and focus containment.
- [~] 20. Toast placement respects mobile safe-area and composer clearance.
- [~] 21. Mobile toolbar controls and menu options preserve 44px targets.
- [~] 22. Mobile composer controls and input preserve 44px targets.
- [~] 23. Mobile sidebar section/menu triggers preserve 44px targets.
- [~] 24. Reduced-motion removes active press translation.
- [~] 25. Forced-colors mode uses system highlight/mark colors for focus and invalid fields.
- [~] 26. 320/360/390px visual regression: root overflow sweep covers 8 widths and now measures toolbar/header/composer bounds; composer row wrapping is separately tested at 320/360px. Browser execution pending.
- [~] 27. 640/768px breakpoint regression: root overflow + toolbar bounds cover both widths; detailed density/label clipping review remains.
- [~] 28. Added explicit Tab-order regression across mode toolbar → composer → sidebar; browser execution pending.
- [~] 29. Existing RU/EN tests cover dynamic research/agent panels, composer validation, provider and project forms; full root status-copy parity remains.
- [ ] 30. Real iOS Safari/VoiceOver and Windows forced-colors manual verification.


### P0.26 — RU/EN live runtime parity (IMPLEMENTED; Chromium acceptance pending)

- [~] 1. Re-render skill configuration summary on locale changes while Skills panel is open.
- [~] 2. Re-render Agent team blueprint summary on locale changes while Agents panel is open.
- [~] 3. Keep Agent role-count grammar consistent with the selected language.
- [~] 4. Refresh AgentRun static labels without re-fetching Gateway capability.
- [~] 5. Rebuild cached AgentRun task labels after a locale change.
- [~] 6. Rebuild chat-scoped AgentRun task labels after a locale change.
- [~] 7. Preserve AgentRun event IDs while refreshing event descriptions and local time format.
- [~] 8. Refresh project navigation names/actions in the active locale.
- [~] 9. Refresh chat navigation labels and empty states without losing scroll/focus.
- [~] 10. Re-render project settings status while preserving an actively edited draft.
- [~] 11. Refresh composer attachment metadata and unsupported-file warnings.
- [~] 12. Refresh request-project choices without losing selected project IDs.
- [~] 13. Localize request-project instruction/memory descriptors.
- [~] 14. Refresh empty-chat welcome copy without rebuilding message history.
- [~] 15. Refresh message copy/view/speak accessible names in-place.
- [~] 16. Refresh research-trace and retry action labels in-place.
- [~] 17. Refresh tool-call indicators in the active chat.
- [~] 18. Refresh provider/model metadata labels while retaining original metadata values.
- [~] 19. Re-localize an open chat rename dialog without overwriting its draft.
- [~] 20. Re-localize an open chat-project dialog without losing its selected project.
- [~] 21. Preserve AgentRun event scroll position during translation refresh.
- [~] 22. Preserve chat-list scroll/focus during locale-triggered re-render.
- [~] 23. Keep research configuration method/status synchronized with locale.
- [~] 24. Keep memory count/status copy synchronized with locale.
- [~] 25. Keep selected Quick/Thorough, search mode and skill profile unchanged during locale changes.
- [~] 26. Project Sources status/error state is re-rendered from its cached semantic key on locale change; E2E asserts no second Gateway request. Chromium execution pending.
- [~] 27. Voice menu labels and active recording status re-localize without resetting MediaRecorder; cancel now stops capture and closes the one-shot panel while preserving conversation-turn discard semantics. Mock-recorder E2E authored; Chromium execution pending.
- [~] 28. Live request status and elapsed timer re-localize from a semantic descriptor while the request remains in flight. Delayed-response E2E authored; the assertion now follows the actual model-waiting stage rather than assuming a pipeline stage. Chromium execution pending.
- [~] 29. Historical tool-call, provider/cache, research-trace and retry labels refresh in place; E2E compares stored chat JSON before/after. Chromium execution pending.
- [~] 30. Verify full RU → EN → RU round-trip in Chromium at 320/390/768/1440px; a Playwright regression now iterates all four widths, checks the language/placeholder state, preserves the unsent composer draft and asserts that locale changes do not navigate. Chromium execution remains pending.

### P0.27 — Chat, project and composer interaction integrity (PARTIAL)

- [~] 1. Keep chat action modal labels in sync with locale.
- [~] 2. Preserve rename draft when locale changes.
- [~] 3. Preserve selected project in move-chat dialog when locale changes.
- [~] 4. Rebuild chat list with focus/scroll restoration on locale changes.
- [~] 5. Rebuild project navigation action labels on locale changes.
- [~] 6. Preserve project editor draft while updating project settings status.
- [~] 7. Preserve request context selection while refreshing descriptions.
- [~] 8. Refresh draft attachment labels without dropping selected files.
- [~] 9. Refresh empty-chat welcome without replacing conversation content.
- [~] 10. Update message action accessible names without rebuilding the chat.
- [~] 11. Update research trace/retry labels without mutating message data.
- [~] 12. Keep provider/model provenance values intact while localizing fallback labels.
- [~] 13. Verify chat action dialog Tab/Shift+Tab loop after language change; new move-chat dialog regression selects a project, switches RU/EN, verifies the selected option remains stable and asserts both Tab and Shift+Tab wrap focus. Chromium execution pending.
- [~] 14. Preserve focused project navigation control after locale-triggered list refresh; browser test added.
- [~] 15. Preserve focused request-context checkbox after locale-triggered rebuild; browser test added.
- [~] 16. Restore attachment remove-button focus when attachment chips are re-rendered.
- [~] 17. Verify message action keyboard focus survives in-place relabeling; new Playwright test focuses the message copy action, switches RU→EN→RU and asserts the same action retains focus while its accessible name changes. Chromium execution pending.
- [~] 18. Verify long project/chat names remain clipped without horizontal overflow; existing 320px regression checks title preservation and bounded row geometry. Locale-specific recheck and Chromium execution remain pending.
- [~] 19. Verify five-project request context cap in both locales; new mock-provider Playwright regression selects five projects, checks the sixth is rejected with localized RU/EN feedback, and asserts only projects 1–5 enter the outbound system context while projects 6–7 are excluded. Chromium execution pending.
- [~] 20. Verify no duplicate change handlers after repeated context-menu refresh; added 10-cycle RU/EN regression for composer disclosures and their single Escape-close path.
- [~] 21. Verify no duplicate project/chat rows after 10 repeated locale switches; added 10-cycle locale idempotency regression, runtime execution pending.
- [~] 22. Verify no state loss across chat switch while locale is changed; new two-chat Playwright fixture switches RU→EN, opens the second chat, verifies only its history is shown, switches EN→RU, checks both persisted histories and current-chat identity, then returns to the first chat and confirms its history is intact. Chromium execution pending.
- [~] 23. Synchronize `aria-expanded` from actual menu visibility after locale refresh; regression covers attachment, request-context and voice disclosures.
- [~] 24. Verify browser history/deep-link state remain unchanged by locale; the new round-trip regression checks URL stability through RU→EN→RU at 320/390/768/1440px. `history.state`/deep-link route matrix and Chromium execution remain pending.
- [~] 25. Added 10-cycle RU/EN regression preserving composer draft, unsupported attachment, localized remove label and keyboard focus.

### P0.28 — UI action feedback localization (PARTIAL)

- [~] 1. Localize Pollinations disconnect feedback.
- [~] 2. Localize personal-memory delete confirmation.
- [~] 3. Localize shared-memory save confirmation and success toast.
- [~] 4. Localize shared-memory delete confirmation.
- [~] 5. Localize system-prompt edit/finish title and inline hint.
- [~] 6. Localize missing research-trace error.
- [~] 7. Localize copied research-trace link toast.
- [~] 8. Localize tool-call indicator prefix.
- [~] 9. Localize research trace and retry labels in rendered messages.
- [~] 10. Static audit found no raw alert() calls; all remaining confirm() paths use the active locale or projectSourcesText dictionary.
- [~] 11. Audit thrown errors shown to users for locale-safe messages; project-memory helper and settings-profile import now map unknown/parser/Gateway errors to RU/EN safe copy, but the full thrown-error inventory remains open.
- [~] 12. Audit async Gateway failure/status messages for locale refresh; helper, local document extraction and local ASR no longer render raw Gateway details, with RU/EN redaction regressions added.
- [~] 13. Audit provider test/connect/disconnect failure feedback; provider probe failure is localized, redacts echoed credentials, and exposes an aria-busy lifecycle with RU/EN Playwright coverage. The full provider probe/connect/disconnect matrix remains open. The private-chat guard against external providers now uses the active RU/EN locale; a focused English regression is authored, with Chromium execution pending.
- [~] 14. Audit project CRUD and import/export feedback; project name validation now targets the correct inline error nodes and synchronizes aria-invalid/aria-describedby. Existing bundle E2E verifies a new imported project ID/name, imported chat association, and preservation of the source/other project; the full CRUD feedback inventory remains open.
- [~] 15. Audit memory CRUD and helper suggestions feedback; helper Gateway failures now use allowlisted localized states and never expose raw backend diagnostics.
- [~] 16. Audit chat CRUD and dialog validation; stale project references now show RU/EN feedback, clone titles and missing imported-chat titles use the active locale, and a combined RU/EN regression is added. Remaining: complete persistence-failure and dialog-validation matrix.
- [~] 17. Audit trace export/copy/download feedback; trace modal controls and Markdown export metadata/headings now follow RU/EN, Markdown/JSON downloads announce success, and missing traces receive safe feedback. E2E checks RU/EN Markdown and JSON exports; clipboard failure and dynamic trace-content localization remain open.
- [~] 18. Audit attachment parser/extraction warnings and failures; local document/ASR Gateway errors and image/video preview failures now use safe localized messages with credential-redaction coverage.
- [~] 19. Audit Voice/ASR/TTS capability feedback; local document/ASR, voice transcription and TTS errors now map to safe localized messages. Voice capture/TTS capability and full native-device matrix remain open.
- [~] 20. Audit offline/online mode and connectivity feedback; browser offline/online events now show localized hints and distinguish browser network state from Gateway/provider availability. The web-search preference is not changed; endpoint health checks and full connectivity recovery matrix remain open.
- [~] 21. Audit storage quota and recovery warning feedback; 80%/95% browser quota warnings have RU/EN copy, assertive alert semantics and explicit export/backup guidance. Chat/project partial-read and failed-backup recovery messages use RU/EN copy while preserving original data. Recovery backup download success/failure feedback is now localized for both chat and project backups; new RU/EN Playwright coverage downloads both files and verifies exact source bytes remain unchanged. Full backup/restore and recovery-flow matrix remains open; Chromium execution pending.
- [~] 22. Audit all toast messages for locale parity; browser-storage 80%/95% quota warnings now use RU/EN copy. The complete toast inventory remains open.
- [~] 23. Audit all aria-live/status announcements for locale parity; the shared toast uses role=status/polite for success and role=alert/assertive for errors, with aria-atomic=true. Other async status surfaces remain open.
- [~] 24. Audit native browser confirm prompts for contextual language parity; project-memory item deletion and provider credential clearing now have RU/EN confirmations. Complete chat/project/source/personal/shared-memory prompt matrix remains open.
- [~] 25. Verify errors do not expose secrets, request bodies or internal traces; covered helper/document/audio/provider/OAuth/profile/chat-import/trace-save and research-trace export failures use bounded localized feedback. Full thrown-error and recovery inventory remains open.

### P0.29 — Control inventory and semantic integrity (PARTIAL)

- [~] 1. Static markup contains no duplicate element IDs.
- [~] 2. All static data-action elements are native buttons.
- [~] 3. Chat action save remains a form submit, not a click-only pseudo-action.
- [~] 4. Dynamic menu actions remain delegated through one action dispatcher.
- [~] 5. Static inventory found 77 data-action nodes across 69 unique action names.
- [~] 6. Static audit matched all 69 static action names and 13 generated action names to dispatcher cases/submit path; runtime behavior still pending.
- [~] 7. Static audit found no orphaned static or generated action names.
- [~] 8. Static source audit confirms locale refresh does not reinstall delegated listeners; dynamic actions remain on the shared dispatcher. The 10-cycle RU/EN regression is authored; runtime execution pending.
- [~] 9. Confirm destructive actions have clear confirmation or reversible undo; project-memory item deletion and provider credential removal now have RU/EN native confirmations. Credential copy explicitly says browser-local removal does not revoke the provider credential; E2E covers cancel/accept and preserved/cleared field state. Chat, project, project-source and personal/shared-memory deletion already use confirmations; complete inventory remains open.
- [~] 10. Provider probe now disables its control and toggles aria-busy through pending/completed states; RU/EN regression added. The full async-action inventory remains open.
- [~] 11. Confirm cancel actions abort the corresponding operation; existing project-memory deletion and personal→shared promotion tests assert cancel preserves data, while shared-memory and external project-context cancellation tests assert no mutation/no model request. Full action matrix and Chromium execution remain pending.
- [~] 12. Settings modal now shares the Tab/Shift+Tab focus loop, Escape/backdrop close and existing opener restoration; browser regression is authored but not run.
- [~] 13. Attachment, request-context and voice disclosures synchronize aria-expanded from actual visibility; RU/EN locale regression added, runtime pending.
- [~] 14. Confirm selected toggles expose aria-pressed/checked; the Direct/AgentRun execution-mode control now synchronizes `aria-pressed` from the active chat mode, with existing execution-mode E2E asserting false→true. Complete toggle inventory remains open.
- [~] 15. Project create/edit name validation now resolves the actual inline error element and synchronizes aria-invalid/aria-describedby; the full form inventory remains open.
- [~] 16. Confirm all visible buttons have non-empty accessible names; source scan found no unlabeled static buttons and a runtime DOM audit now checks visible buttons plus chat-menu actions. Playwright execution pending.
- [~] 17. Confirm all form controls have associated labels or accessible names; source scan found no unlabelled static controls and the runtime DOM audit checks visible inputs/selects/textareas. Playwright execution pending.
- [~] 18. Settings focus handling is complete for the current modal; Project Settings uses a full-height mobile safe-area sheet and Function panels have bounded viewport height. A complete role/title/description inventory remains open.
- [~] 19. Sidebar uses `aria-hidden` plus `inert`; the runtime audit verifies closed navigation has no tabbable descendants and checks open/closed states. Playwright execution pending.
- [~] 20. Outside-click now closes menus without swallowing the clicked action; Function panels remain on the shared dispatcher, with Escape/backdrop behavior and keyboard regression authored. Full menu inventory remains open.
- [~] 21. Confirm action buttons do not trigger nested row click handlers twice; chat row actions are sibling native buttons/menus rather than nested row-click targets, and a regression opens the second chat's rename action while asserting the active chat remains unchanged. Project-row and full generated-action runtime inventory remain open.
- [~] 22. Confirm disabled controls cannot dispatch consequential actions; the shared delegated dispatcher now ignores native `disabled` and `aria-disabled="true"` action controls before dispatch. E2E injects an aria-disabled destructive action and asserts no confirmation or project mutation; execution pending.
- [~] 23. Provider request failures now use localized status-based feedback and preserve the draft; the 401 regression asserts the original text remains and raw credentials/details are absent.
- [~] 24. Mobile navigation, nested menus, attachment actions and composer controls now enforce 44px minimum targets; native-device and complete keyboard parity checks remain open.
- [~] 25. Confirm native controls remain operable in forced-colors mode; existing CSS sets system `Highlight` focus outlines and `Mark` invalid borders, and a new Playwright test emulates `forcedColors: active`, checks `:focus-visible` outline width/style/color, and verifies focus survives RU/EN/RU refresh. Real Windows/Edge/native control acceptance and Chromium execution remain pending.

### P0.30 — RU/EN and interaction regression matrix (IMPLEMENTED; browser execution pending)

- [~] 1. Skills summary updates RU → EN → RU while panel remains open.
- [~] 2. Skill option labels update while preserving selected option values.
- [~] 3. Agent blueprint summary updates RU → EN → RU while panel remains open.
- [~] 4. Agent role count updates with correct English/Russian grammar.
- [~] 5. AgentRun strategy help updates with the selected locale.
- [~] 6. Open rename dialog title/help update with locale.
- [~] 7. Open rename dialog text draft survives locale change.
- [~] 8. Composer placeholder changes RU → EN → RU at 390px.
- [~] 9. DOM audit checks duplicate IDs.
- [~] 10. DOM audit checks native semantics of data-action controls.
- [~] 11. DOM audit checks visible button accessible names.
- [~] 12. Add active move-chat dialog selection-preservation regression; mock-free UI test preserves selected destination through RU/EN refresh, verifies localized fields and submits the same project selection. Chromium execution pending.
- [~] 13. Add live request-context selected-project preservation regression; the one-shot project-context test confirms selected project context is sent once without changing the active chat project, while locale-focus regression checks the request-context checkbox retains focus after language refresh. Combined selected-state + locale matrix and Chromium execution remain pending.
- [~] 14. Add selected attachment preservation regression across locale changes; existing ten-cycle RU/EN test preserves the draft, selected attachment, localized remove action and keyboard focus. Chromium execution remains pending.
- [~] 15. Add existing message-action aria-label refresh regression; copy-message accessible name updates in-place from RU→EN→RU without losing keyboard focus. Chromium execution pending.
- [~] 16. Add research-trace/retry label refresh regression; historical tool/research metadata test checks localized trace-open/retry labels and unchanged chat history. Chromium execution remains pending.
- [~] 17. Add tool-call indicator prefix refresh regression; historical metadata test checks RU/EN tool-call prefix without mutating stored history. Chromium execution remains pending.
- [~] 18. Add provider/model metadata fallback refresh regression; historical metadata test checks localized cache/provider metadata labels while preserving provenance and serialized history. Chromium execution remains pending.
- [~] 19. Add AgentRun task/event refresh regression with mocked Gateway; the existing mock-Gateway run test now supplies task records and two events, verifies RU labels, switches RU→EN→RU, and checks task/event labels, run state, event IDs and timestamps remain stable. Chromium execution pending.
- [~] 20. Add chat-list focus/scroll preservation regression; new 40-chat fixture scrolls to the last row, focuses its menu trigger, switches RU/EN in place and asserts the same row remains focused, scrollTop is unchanged and no rows duplicate. Chromium execution pending.
- [~] 21. Add project-navigation focus preservation regression; existing locale refresh test asserts the focused project navigation control survives list rebuild. Chromium execution remains pending.
- [~] 22. Add 320px locale overflow regression; RU/EN round-trip test asserts document/body width stays within the viewport at 320px. Chromium execution remains pending.
- [~] 23. Add 768px locale wrapping regression; RU/EN round-trip test asserts document/body width stays within the viewport at 768px; text-wrap-specific geometry remains pending. Chromium execution remains pending.
- [~] 24. Add 1440px locale wrapping regression; RU/EN round-trip test asserts document/body width stays within the viewport at 1440px; text-wrap-specific geometry remains pending. Chromium execution remains pending.
- [~] 25. Added 10-cycle RU/EN idempotency regression for composer draft, attachment focus and disclosure state; browser execution pending.
- [~] 26. Add active stream locale-change regression without aborting generation; existing in-flight status test blocks a mock response, switches RU/EN, asserts the request stays active and then completes. Chromium execution remains pending.
- [ ] 27. Add native iOS Safari/VoiceOver language-change check.
- [~] 28. Add Windows forced-colors language-change check; new Playwright regression uses the browser `forcedColors: active` media emulation, changes RU/EN while the composer remains focused, and verifies the system focus outline persists. This is browser emulation, not a Windows hardware/Edge test; native Windows acceptance and Chromium execution remain pending.
- [~] 29. Added a RU/EN persisted-locale reload regression that checks initial sidebar labels, Cloudflare help, composer option copy and Research option copy; browser execution pending.
- [~] 30. Add language change during Project Settings edit regression; new project fixture edits name/instructions, switches RU→EN→RU while the name field remains focused, verifies both drafts and focus survive, then saves and checks persisted values. Chromium execution pending.


### P0.31 — Memory, project and chat feedback parity (PARTIAL)

- [~] 1. Localize project memory 500-item limit feedback.
- [~] 2. Localize project-delete empty-selection feedback.
- [~] 3. Localize personal-memory promotion confirmation.
- [~] 4. Localize personal-memory promotion success toast.
- [~] 5. Localize missing personal-memory item error.
- [~] 6. Localize current-chat history-clear confirmation.
- [~] 7. Localize chat title reset after clearing history.
- [~] 8. Replace last-chat delete alert with localized non-blocking error toast.
- [~] 9. Localize chat import file-size, JSON/shape, message-count and local-chat limit feedback in RU/EN.
- [~] 10. Localize imported chat fallback title.
- [~] 11. Replace raw chat-import error text with safe localized user feedback; parser/storage exceptions now map to bounded localized messages.
- [~] 12. Replace raw personal-memory storage error alert with safe localized feedback.
- [~] 13. Localize personal-memory gateway-only guard.
- [~] 14. Localize synthetic private-memory command/assistant transcript.
- [~] 15. Localize shared-memory command confirmation.
- [~] 16. Localize synthetic shared-memory command/assistant transcript.
- [~] 17. Localize project import structural validation errors; format, project-name and chat-shape validation now have RU/EN copy and regression coverage.
- [~] 18. Localize project import size/count limits; 15 MiB, 200 projects, 500 chats, 50,000 messages and 1,000 local chats have explicit RU/EN feedback.
- [~] 19. Localize project export/import completion toasts; export and import now announce success in the active locale.
- [~] 20. Localize project source upload/delete/catalog failures and timeouts; raw Gateway diagnostics are no longer shown in status, with RU/EN credential-redaction regression authored.
- [~] 21. Localize shared-memory promotion errors from IndexedDB; promotion now uses a strict private-memory read and safe RU/EN feedback for shared-store write failures while retaining the private copy. Regression authored; execution pending.
- [~] 22. Localize memory list loading failures; UI-only strict reads show a polite `role=status` error and mark unavailable counts instead of reporting a false empty list. Request-context reads retain the existing tolerant fallback. RU/EN regression authored; execution pending.
- [~] 23. Localize chat rename/move failure feedback; missing/stale project references now use active-locale messages, while rename/move storage failures reuse the existing localized `persistChats()` recovery feedback. Browser regression is authored; execution remains pending.
- [~] 24. Localize chat import collision/limit details; format, count and collision-safe append behavior now have explicit feedback.
- [~] 25. Added Playwright coverage for EN personal/shared-memory confirmation copy; RU dialog and project/chat prompt matrix still pending.

### P0.32 — Safety and privacy feedback clarity (PARTIAL)

- [~] 1. Keep shared-memory confirmation explicit about third-party provider exposure.
- [~] 2. Keep personal-memory promotion explicit that the local copy remains.
- [~] 3. Keep personal-memory command explicit that no shared-memory copy is created.
- [~] 4. Keep shared-memory command explicit that personal memory is unchanged.
- [~] 5. Avoid displaying raw internal memory storage exception text; promotion, shared-memory save/delete and list-read failures now use bounded RU/EN feedback without exposing IndexedDB exception details.
- [~] 6. Avoid displaying raw chat import exception text.
- [~] 7. Audit confirmations before sending private/project data externally; Direct chat now requires localized RU/EN confirmation before sending active-project instructions/memory or request-selected project contexts to any non-aLandi provider. Cancel returns before chat mutation or network request. Accept/cancel mock-provider Playwright tests are authored; Chromium execution pending. File/Notebook/other outbound paths still require inventory.
- [~] 8. Audit every path that transfers personal memory into shared scope; source audit finds one explicit personal→shared transfer function plus two separate manual shared-save paths, each guarded by confirmation and preserving the personal copy on promotion. Promotion-cancel and shared-save-cancel regressions exist; full accept/failure matrix and Chromium execution remain pending.
- [~] 9. Audit third-party provider exposure warnings for accurate scope; the direct-chat disclosure now names the selected provider and project(s), and explicitly states that project context leaves the aLandi Gateway. Full provider-specific retention/privacy wording and non-chat route inventory remain open.
- [~] 10. Audit project-memory inheritance and global-memory toggles; request builder includes shared facts only when global opt-in is true and every active/requested project's memoryScope is `project-and-global` (without project scopes, global opt-in alone is sufficient). New mock-provider Playwright coverage proves `project-only` excludes a shared fact even with global opt-in enabled, and `project-and-global` includes it only after explicit global opt-in; existing tests cover project-scope edits, one-shot project context and global-memory opt-in off/on. Full multi-project cross-product and Chromium execution remain pending.
- [~] 11. Audit file-import error messages for path/content disclosure; project-bundle parser and chat-import failures use fixed localized validation messages, with tests asserting raw parser exception details are not surfaced and existing chat history remains unchanged. Complete per-import-path/path-leak matrix and Chromium execution remain pending.
- [~] 12. Audit provider errors for API key/token redaction; Pollinations OAuth, model-catalog and provider-probe feedback no longer echoes backend error details or credentials. Full provider connect/disconnect and external OAuth token-response matrix remains open.
- [~] 13. Audit Gateway errors for URL/authorization redaction; project-source, helper, document extraction, ASR, voice transcription, TTS, trace-save and chat-request feedback now map covered failures to safe localized messages. Public-tool failures no longer pass raw exception text into the model transcript; the UI reports a bounded localized network/URL hint. Full endpoint inventory and Chromium execution remain open.
- [~] 14. Audit voice/transcription errors for media/body redaction; local ASR, voice transcription and TTS failure details no longer surface raw Gateway bodies. Voice-chat startup now reports a bounded localized microphone/Gateway hint rather than raw exception text. Native capture/recording and Chromium verification remain open.
- [~] 15. Audit AgentRun errors for prompt/task content redaction; UI catches now use the allowlisted agentRuntimeErrorText mapper instead of raw error.message, while task/event/trace content paths still need review.
- [~] 16. Audit trace export errors for source/private data redaction; Markdown/JSON download exceptions now map to fixed RU/EN feedback without exposing browser exception details or trace content. Fault-injection regression added; full export/privacy review remains open.
- [~] 17. Confirm confirmations never silently default to approval; canceling external project-context disclosure aborts before chat/history mutation and before any provider request. A Playwright regression asserts draft/state preservation and zero model calls; full prompt/native-dialog matrix remains open.
- [~] 18. Confirm cancel paths leave persisted data unchanged; Playwright now covers cancelling personal→shared promotion and cancelling the explicit shared-memory command, asserting the composer draft and memory stores remain unchanged. Chromium execution remains pending.
- [~] 19. Confirm local-only memory does not enter third-party requests; existing request routing filters private-memory contexts to the first-party aLandi provider. The chat-level `privateMemoryUsed` barrier now fails closed: when its durable browser-storage write fails, generation aborts before any model request and the in-memory marker is restored. Added Playwright fault-injection coverage for an IndexedDB private fact plus localStorage quota failure, plus paired mock-provider opt-in/off and cancellation-invariance scenarios; Chromium execution remains pending.
- [~] 20. Confirm shared memory only enters requests when explicit scope is enabled; the request builder gates shared facts on the global-memory opt-in and project scope. Mock-provider regressions now assert a shared fact is excluded when opt-in is off and included only when explicitly enabled; project-context consent tests cover both cancel/no-send and accept/expected-context. Chromium execution remains pending.
- [~] 21. Confirm imported bundles cannot overwrite current state on failed validation; malformed chat records are rejected before mutation and RU/EN storage-invariance regressions were added.
- [~] 22. Confirm failure feedback does not mutate or clear the user's draft; the 401 provider failure regression asserts that the original composer text remains after the failed request.
- [~] 23. Confirm toast/alert copy does not expose raw secrets or private content; helper/document/audio/provider/OAuth/profile/trace paths use bounded safe messages. Code-copy and Python-runtime load failures now use localized fixed feedback instead of raw browser exception strings; clipboard fallback no longer logs the raw exception, and RU/EN fault-injection Playwright coverage asserts credential-bearing diagnostics are not shown. Full message inventory, recovery/partial-export copy and Chromium execution remain open. The root-app boot regression caused by a missing brace in the Python-load catch is separately recorded in §0.1; a delegated-control click regression was added, but exact-head browser execution remains pending.
- [~] 24. Verify all privacy prompts in both locales; project-memory deletion and provider credential removal confirmations have RU/EN coverage. Remaining native prompt matrix and cancellation invariance still open.
- [~] 25. Verify user-data export/restore messages distinguish complete vs partial recovery; chat import now classifies lossy normalization (unsupported roles, malformed/non-string content, oversized IDs/titles/content/tool-call lists, excess per-chat messages and missing project associations) and shows explicit RU/EN complete vs partial result copy while preserving existing history. Playwright covers complete/partial imports in both locales and persisted content. Chat/project corruption backup downloads now have RU/EN success copy and E2E verifies exact raw bytes plus source-store invariance in both locales. Chromium execution pending. Raw corruption backups remain byte-preserving and downloadable separately; this is not a general restore/merge UI for raw backups.

### P1 — Единая трёхрежимная оболочка: aLandi / aNoteBooki / aCodingi (SPECIFIED; progressive implementation)

**Binding owner override, 2026-11-21:** aNoteBooki and aCodingi are not primitive menus, isolated dashboard pages or separate app shells. They are full working modes of the existing root application. All three modes share the same application frame, geometry, header, navigation placement, composer/chat placement, dialogs, keyboard/focus contracts, responsive behavior, project/chat identity and session lifecycle. The mode changes the visual theme, navigation content, chat context and available tools — not the underlying application skeleton.

- [~] P1.1 **PARTIAL IMPLEMENTED / SHARED NAVIGATION COHERENCE VERIFIED:** all three modes run inside the root page; `#mode=notebook|coding` deep links and browser history are supported. The aNoteBooki sidebar shortcut is now a button invoking the shared-mode controller instead of navigating away to `/notebook/`; direct `/notebook/` and `/workspace/` routes remain for compatibility. Required smoke #45111150135 verifies this contract on exact code/test HEAD `d7671b7b2c5f05426b7b0c6185e55cf022247ffb` (13/13 tests). The normal chat DOM, title, draft, placeholder and scroll position are restored when leaving a mode. Focus, attachments, project identity, unfinished-run restoration, mobile geometry and complete mode lifecycle remain to be verified.
- [~] P1.2 **PARTIAL IMPLEMENTED:** Notebook palette and shared root footprint; IndexedDB notebook list/create; note, reference, text import and JSON export actions. Other Studio jobs are clearly marked unavailable. Full job lifecycle, source-linked artifacts, desktop/tablet/phone visual acceptance and locale/accessibility matrix remain open.
- [~] P1.3 **PARTIAL IMPLEMENTED:** normal root composer is intercepted only in Notebook mode; requests require 1–8 explicitly checked text sources and a native consent prompt. Only lexical matches from checked sources are sent to the configured aServi endpoint; URL references are not fetched; cross-notebook/global memory is not included. Source IDs, SHA-256, offsets and evidence are persisted. Claim-level entailment validation, broader retrieval, notebook policy profiles and artifact actions remain open.
- [~] P1.4 **SHELL ONLY:** burgundy shared-frame theme and explicit unavailable-runtime state are implemented; the composer is disabled rather than pretending ordinary chat is a coding agent. Real coding-agent events, tool output, tests, diffs, approvals and cancel/resume require the later sandbox/agent runtime.
- [ ] P1.5 **Coder project lifecycle:** create a coding project from a chat or command; persist it as a distinct project subtype in the existing Projects system. Selecting that project opens its own coding workspace/sandbox and restores its files, branch/worktree snapshot, chat, instructions, agent/team settings, tools, run history and approvals. Moving between projects must never mix workspace roots or execution grants. Existing /workspace/ browser-local editor is a foundation, not a full sandbox; preserve its diff/permission/recovery safeguards while integrating a real execution sandbox only after P3.10 acceptance.
- [ ] P1.6 **Coding tools and curated knowledge:** expose only real capabilities from the pinned/evaluated tool, library, Skill, model and connector registries. Organize them compactly by task (inspect, plan, edit, test, review, debug, docs, dependency/security, Git); support approved reference repositories/templates and starter projects. Record source/version/license/security/provenance/compatibility. No indiscriminate repository cloning, auto-execution of imported scripts, or role/Skill-derived permission.
- [ ] P1.7 **Mode transition and sync:** preserve current chat/project identity, draft, attachments, active notebook/coder project, session/agent profiles, source references, local storage revisions and return destination. Save before transition; surface failed save/sync and offer retry/recovery. Browser-local IndexedDB is the initial offline persistence; server sync must use explicit scope/revision/conflict policy, not silent overwrite.
- [ ] P1.8 **Information density and accessibility:** desktop-like landscape-first workspaces; on portrait phones retain compact panels and bounded internal scrolling rather than stretching into long cards. Keep 44px minimum touch targets, 16px editable fields, keyboard navigation, focus return, live status and RU/EN copy parity.
- [~] P1.9 **PARTIAL implementation / REQUIRED SMOKE VERIFIED:** shared project/chat scope state and navigation smoke are implemented. Shared-mode implementation adds root-frame Notebook/Coding modes, IndexedDB Notebook integration, explicit source-grounded aServi chat, a Coding shell with sandbox fail-closed gating, and a shared-mode Notebook shortcut that no longer leaves the root app. Quality Sentinels #45111150135 passed 13/13 focused tests in 19.8s on exact code/test HEAD `d7671b7b2c5f05426b7b0c6185e55cf022247ffb`. Full lifecycle, quota failure, mobile/locale/focus acceptance and actual Coding runtime remain open.
- [~] P1.10 **Acceptance foundation VERIFIED on code/test HEAD:** required smoke includes shared-frame geometry, Notebook source isolation (including unselected-source exclusion), mode deep-link/browser-history restoration, root-frame Notebook shortcut, direct legacy-route compatibility and Coding sandbox gating. Quality Sentinels #45111150135 passed 13/13 tests in 19.8s on `d7671b7b2c5f05426b7b0c6185e55cf022247ffb`; Pages build/deploy #45111149497 and Graphify #45111150110 also passed on the same SHA. Later commits are documentation-only; exact current-HEAD Pages build will be checked after the documentation checkpoint. Full RU/EN, offline, phone/tablet and sandbox acceptance remain open.
### P2 — Чат, контекст, модельный routing, память и непрерывность (SPECIFIED)

- [ ] P2.1 Preserve the natural direct chat for conversation, ideas, planning, analysis, research and code. Simple requests use the main model directly; orchestration is invoked when task complexity, explicit user choice or a saved chat policy justifies it.
- [ ] P2.2 Keep Quick/Thorough, web breadth/online/offline, research method, execution topology, task profile/Skill, model/provider, memory scope, output format and attachment scope orthogonal. Verify persisted state, migrations, import/export, request payload and precedence. Retire legacy multiAgentEnabled only in the existing staged compatibility path; do not remove adapters or historical traces before migration/rollback acceptance.
- [ ] P2.3 **Chat-bound agent continuity:** each chat can store versioned agent/team profile, execution strategy, allowed tools, research/coding preferences, context-window policy and memory references. Project-level defaults may be inherited, but per-chat overrides are explicit and reversible. On subsequent turns/reloads, restore the same configuration and active run association; do not persist prompts/secrets or hidden chain-of-thought.
- [ ] P2.4 **Automatic agent participation:** a policy/router evaluates whether a request is simple enough for direct inference or merits bounded planner, researcher, coder, critic/reviewer, data analyst or other specialist work. Direct-chat is the baseline; auto-orchestration may be enabled per chat/project with transparent visible status and a one-click bypass/stop. Specialists are real worker/model calls, not role labels or same-model stage names presented as independent agents.
- [ ] P2.5 **Context engineering:** build bounded, provenance-preserving context packets from the current chat, its project, selected notebook/source blocks and specifically granted memory scopes. Include source type/ID/hash/offset and inclusion reason; apply token budgets, recency/relevance, stale-state detection, cancellation, tool/deadline limits and provider-compatible multimodal normalization. Never treat an opaque project/chat ID as a data grant.
- [ ] P2.6 Memory scopes: global/personal/project/chat/Notebook/research/agent/coder-workspace. Define provenance, user edit/correction, freshness, retention, deletion/tombstones, derived-data lineage, export, backup/restore and cross-scope leak tests. Private-memory barrier and external-provider disclosure remain mandatory.
- [ ] P2.7 Model routing: use the main server model as the baseline; evaluate already-acquired helpers by task against exact runtime artifacts, model licenses, supported context/tool formats, RAM/VRAM/disk, load/unload and concurrency. Route embeddings, rerank, OCR, ASR/TTS and coding helpers only when a real adapter and comparative eval exist. Do not load several models concurrently on the 8-GB target without measured budget.
- [ ] P2.8 Search and tool policy: online search is a tool in the main chat and may be exposed to agents only by explicit capability/grant. Offline mode disables web search and remote providers. No automatic provider/API fallback, key migration or cross-provider request transfer.
- [ ] P2.9 Cache correctness: browser shell cache, local persistence, inference prefix/KV cache and exact response cache have separate retention/invalidation contracts. Never serve stale outputs for tools, streaming, dynamic research, media, errors, partial responses or a changed source/context hash.
- [ ] P2.10 Chat continuity acceptance: new chat defaults, reopen, rename, project move, clone, export/import, mode transitions, agent-profile edits, source-scope changes, interrupted runs, recovery and RU/EN refresh must preserve exactly the intended state without cross-chat or cross-project leakage.
- [ ] P2.11 Optional user export directory: use permissioned directory/file pickers and show read/write/revoke state; do not claim arbitrary local filesystem or shell access from the browser.
- [ ] P2.12 Provider decision remains a separate owner session after the user-visible landing experience; do not infer a provider set.
### P3 — Deep Research, Agents, Skills, Connectors and aCodingi execution

- [ ] P3.1 **Deep Research method catalogue:** replace the truncated/obsolete menu with a task-oriented catalogue and compact settings: targeted lookup; multi-source report; compare; literature review; fact-check/source audit; evidence extraction; Notebook/source research; technical investigation; codebase research; data analysis; and follow-up/monitoring where supported. Every method defines output contract, search policy, source limits, depth, time/token budget, citation requirements, save/export target and fallback.
- [ ] P3.2 **Resumable research workflow:** discovery → fetch/read → gap analysis → evidence extraction → claim/source validation → contradiction and freshness handling → synthesis → report/export. Persist state in existing SQLite/AgentRun/EvidenceLedger patterns; do not add a competing checkpoint database. Provide pause/resume/cancel/retry and a truthful state for disabled dependencies.
- [ ] P3.3 Evidence lineage: stable SourceRecord/BlockRef, URI, retrieval time, content hash, page/heading/offset/timecode, claim-to-source edges, quote length/licensing constraints, citation verifier and unsupported-claim audit. Preserve source snapshots where policy/license allows; otherwise report freshness limitations.
- [ ] P3.4 **Agent system catalogue and settings:** agent roles/templates are selectable task profiles with clear purpose, input/output schema, model preference, Skill set, allowed tools, memory/context scope, budget, concurrency, retry/cancel and human-approval policy. Cover planner/orchestrator, researcher, coder, reviewer/critic, test engineer, security auditor, data analyst and source curator as available evaluated roles. A role never grants permission.
- [ ] P3.5 **Automatic and chat-directed team use:** support manager-owned specialist subcalls for bounded tasks and true handoffs only when a specialist should own the rest of the turn. The router chooses none/single/manager-plus-specialists/team-review/coder-review using explicit policy; expose why a method was selected, actual worker identity, status and result. Bound fan-out, queues, deadlines, token/cost budgets and model residency.
- [ ] P3.6 **Persistent execution and chat status:** one run ID tied to chat/project, durable task DAG/events, cursor replay, reconnect after reload, checkpoints, idempotency keys, retries, partial-failure recovery, approval interrupt/resume, cancellation and terminal reconciliation. Chat remains usable while background work runs. Keep event stream separate from assistant prose; do not show fake parallel progress.
- [ ] P3.7 **Memory and context between sessions:** use chat/session identity to retrieve authorized prior conversation/configuration, not private chain-of-thought. Save structured summaries/decisions, user-approved memory, artifacts and provenance with expiration/edit/delete controls. Re-check access on every resumed run.
- [ ] P3.8 **Skill lifecycle:** import/create → provenance/license/security scan → schema and capability declaration → tests/evals → owner approval → version/diff → enable/disable → export/rollback. Scripts are inert until separately approved and sandboxed. Skill selection cannot expand tool or data grants.
- [ ] P3.9 **Connector registry:** real GitHub/repository and approved local/cloud connectors with least-privilege scopes, consent/revoke, encrypted secret lifecycle, quotas, audit, provenance and deletion cleanup. UI empty state remains truthful until a connector is actually registered.
- [ ] P3.10 **aCodingi workspace execution:** explicit workspace root, per-project isolated runtime, diff-first modifications, shell/test runner only inside real container/VM isolation, network egress allowlist, read-only defaults, resource/time limits, logs redaction, cancellation, approval, rollback, workspace export and escape tests. Browser File System Access is not a general sandbox.
- [ ] P3.11 **Training a new agent from a task/project:** distinguish agent bootstrapping from weight training. Agent bootstrap composes instructions, role contract, tools granted, project context, memory references and a held-out eval suite; outputs a versioned profile/Skill, not modified model weights. Start with supervised examples and repeatable evaluations before enabling auto use.
- [ ] P3.12 **Training a model's weights:** provide a separate guided workflow for permitted local training jobs: select base model/architecture and scale, estimate RAM/VRAM/disk/time before starting, choose SFT/LoRA/QLoRA/full fine-tuning or preference optimization only when supported, prepare/validate/licence datasets, split held-out evals, version config/checkpoints/adapters, track training/eval metrics, compare against base, package with manifest/checksums and roll back. Default candidate techniques: SFT for demonstrations, LoRA/QLoRA for parameter-efficient adaptation, DPO/related preference objectives only with a valid preference dataset; full fine-tune/RL are advanced, resource-gated options. No automatic training of the production model from raw chat history.
- [ ] P3.13 **Training toolkit selection:** compare official current Hugging Face TRL + PEFT, Axolotl and Unsloth (and keep LLaMA-Factory as candidate where current maintenance/compatibility evidence supports it). Do not install all frameworks; choose one compatible recipe per model/hardware after reproducible bake-off. Training tools are an optional owner-operated workstation/GPU package, not a promise that the small VPS can train.
- [ ] P3.14 Routing and permissions: model, role, Skill, team, connector, data scope and execution environment are independent dimensions. Effective permissions are the intersection of owner grant, chat/project scope, tool policy and environment isolation.
- [ ] P3.15 **Acceptance:** direct-chat baseline, auto-router decisions, user bypass, chat persistence, distinct workers, event replay, interruption/resume, source context, permissions, agent-bootstrap eval and model-training dry-run/resource preflight must be tested. Host feature flags remain unavailable until live host acceptance.
### P4 — aNoteBooki, Source Vault, ingestion and Studio artifacts

- [ ] P4.1 **Shared source model:** SourceRecord/BlockRef/ArtifactRecord contracts with stable IDs, hashes, offsets, MIME/parser/version, licence, provenance, timestamps, source freshness and deletion lineage across Notebook, chat, projects, RAG and outputs.
- [ ] P4.2 **Notebook mode inside the shared shell:** the Notebook view is not a plain source form page. Its sidebar lists notebook collections and artifact/task actions; the middle remains the same chat surface and composer as the root app. The chat is strictly source-grounded to selected items from the active notebook, with per-source Include/Exclude/Reference-only context, saved sessions, follow-ups and citations.
- [ ] P4.3 Source and note management: local imports, web references/captures, user-authored and AI-assisted notes, attach/detach between notebooks, version/hash deduplication, selective context, search/filter, evidence viewer, export and freshness indicators. User source data stays local/server-owned; no silent upload.
- [ ] P4.4 Studio job catalogue: report, podcast/audio overview, slide deck, chart/table, mind map/diagram, video presentation, flashcards/quiz and structured summary. Store each artifact as an editable job/result with inputs, source BlockRefs, prompt/config version, model, status, provenance, generated assets, cancellation/retry and copy/export semantics. Only enable outputs with a real runtime.
- [ ] P4.5 Podcast pipeline: outline → cited script → segments/speakers/pronunciation → selected local/approved TTS → audio segments/mix → transcript/timestamps/citations → preview/export. Voice/ASR/TTS availability must be independently reported.
- [ ] P4.6 Parsers/converters: keep model-facing extraction separate from user-visible conversion. First define a typed format-capability/adapter registry (input/output pairs, parser/engine version, license/provenance, loss/fidelity, resource limits and explicit unavailable reason); only fixture-verified edges may be advertised. For multi-step conversions evaluate a bounded graph (initially max 3 hops), per-engine queue/concurrency, private job-owned staging, immutable source, output artifact reservation, idempotent job IDs, cancellation/cleanup and read-back output validation. Formats: text/MD/CSV/JSON/HTML, PDF, DOCX, XLSX, EPUB/books, images/audio/video metadata and URL capture; OCR/scanned PDFs only after exact engine/weights/license/resource checks. Preserve page/sheet/slide/time offsets and parsing errors. Current extraction limits and design detail: `docs/VERT_CONVERSION_ARCHITECTURE_ASSESSMENT_2026-10-31_RU.md` (2026-11-23 addendum).
  **Partial implementation checkpoint, 2026-11-24 (mainline integration candidate):** added an immutable, fixture-backed registry for current text/MD/CSV/JSON/PDF/DOCX/XLSX extraction edges. Dispatch and extension acceptance use the same registry; capability responses and extraction results include MIME pair, parser ID, engine/runtime version, engine source and licence URLs, fidelity/loss notes, configured input/output limits and format-specific page/sheet/archive limits. HTML, EPUB, image OCR/image metadata, audio/video metadata, URL capture, scanned-PDF OCR and user-facing file conversion are explicitly unavailable. This is **not** the P4.6 converter pipeline: bounded multi-hop routes, per-engine queues, private staging, output artifacts, durable conversion jobs, idempotency, cancellation/cleanup and read-back output validation remain open.
- [ ] P4.7 Ingestion security: archive bombs, decompression ratio, path traversal, symlinks, malformed PDF/Office, active HTML, prompt injection, SSRF, MIME confusion, temp files, size/CPU/RAM/time quotas and sensitive-data privacy. Source content is data, never executable instruction.
- [ ] P4.8 RAG/evidence: current FTS5/lexical baseline vs embedding + hybrid retrieval + reranker by Russian/English/Thai golden evals, citation recall/precision, latency/RAM, provenance and cross-scope leak tests. Do not claim vector/hybrid RAG before adapter + eval.
- [ ] P4.9 Notebook lifecycle: create/rename/archive/restore/delete, export/import, backup/restore, conflict resolution, idempotency, tombstones, revisions and source/artifact link repair. Delete must explain downstream derived copies and retention limits.
- [ ] P4.10 Source-grounded chat and artifacts: every factual claim should bind to an exact selected BlockRef or be marked as model inference/unsupported; source selection is visible and persisted per chat.
- [ ] P4.11 **Offline/server continuity:** IndexedDB is browser-local persistence; server-side SQLite is a separate owner-host store. Sync uses versioned revisions, explicit scope and visible conflict/permission states; never silently merge a notebook into general chat or another user's workspace.
### P5 — Offline Core, local/server operation and portable model packages

- [ ] P5.1 **Offline Core manifest:** component-level manifest with exact upstream/version, file size, platform/architecture, CPU/GPU/RAM/VRAM/disk estimates, runtime, model/tokenizer/config/template, licence and usage constraints, SHA-256, provenance, dependencies, optional/required classification and removal/rollback path. Display full download/storage budget and ask consent before any new download.
- [ ] P5.2 **Server-only autonomy:** the target server must handle all non-web tasks without GitHub Pages, GitHub API, external DB, cloud provider or third-party API. Public Pages hosts a free static client only; web search is an explicitly online capability. Offline mode exposes only local runtime/data capabilities.
- [ ] P5.3 **Small model roles:** inventory and verify already acquired Qwen3.5-4B base, Qwen3.5-2B helper, Qwen3 embedding 0.6B Q8_0, GLM-OCR Q8_0, Whisper/Vosk/Piper/Silero and related artifacts; verify exact local file/digest, registry metadata, runtime compatibility, licence and resource fit before enabling each adapter. Embedding, OCR, ASR/TTS and code roles remain separate capabilities until adapters/evals pass.
- [ ] P5.4 **Main model deployment boundary:** prepare exact owner runbook for the selected main checkpoint/quantization, Ollama or a validated alternative, model template/tool support, context/KV budget, warm/cold load, CPU/GPU, parallelism=1 baseline, memory ceiling, service supervision and recovery. Owner installs the main model and supplies the host; no assumption of VPS access or hardware.
- [ ] P5.5 **Local/server switch:** preserve chat/project/notebook/source/agent config/run/approval state and provenance with explicit migration plan, backup, revision/checksum, pause/resume and failure recovery. No silent data upload or remote/provider fallback.
- [~] P5.6 **Safe package lifecycle — acquisition subset IMPLEMENTED:** `scripts/download_model_artifacts.py` now resumes raw GitHub `.partial` downloads with validated HTTP Range/Content-Range, restarts safely when Range is ignored, preserves bounded partial bytes on transport interruption, verifies pinned size + SHA-256/Git blob SHA-1 before atomic promotion, and rejects invalid ranges/checksums and symlinked partial paths. Seven deterministic regression tests cover resume, restart, interruption recovery, range mismatch, checksum rejection, complete 416 promotion and symlink rejection. Exact-head Gateway CI pending. Still OPEN: upstream signature validation, Hugging Face snapshot staging/atomic promotion, extraction/install isolation, smoke eval, health check, versioned activation, pause, rollback, uninstall and retention. Never overwrite the last known-good runtime in place.
- [ ] P5.7 **Browser Offline Core:** use IndexedDB/OPFS/Cache API only for appropriate data and shell assets; keep credentials/secrets and private chat/source contents out of public static cache. Service Worker may cache same-origin UI and pinned assets, never private API responses, authenticated data or search results. Storage persistence/eviction/quota and browser support are explicit limitations.
- [ ] P5.8 **Dependency closure:** remove mandatory CDN access for the app shell and required local tools; pin and self-host critical libraries/licenses/checksums. Optional Python/WebGPU/model modules are separate large downloadable packs with exact sizes and no network fetch until requested. Provide offline integrity manifest and graceful missing-capability states.
- [ ] P5.9 **Evaluation-driven inference:** measure cold/warm latency, TTFT, tokens/sec, RAM/PSS/VRAM, context usage, parallel queueing, quality, RU/EN/TH and task-specific success, tool call correctness, citations and failure recovery. Do not enable multiple resident models without memory proof.
- [ ] P5.10 **Training packages:** keep model weight training optional and physically separate from inference service. Package a selected toolkit/adapter and data/eval pipeline only after GPU/resource preflight; keep base checkpoint read-only, store versioned LoRA/adapters separately, verify licences and provide rollback to base model.
- [ ] P5.11 **Target-host test:** a clean server with network blocked except explicitly allowed internet search must complete direct chat, local code/test workflow within sandbox, Notebook/RAG/local conversion, memory and resumable run without Pages/GitHub/cloud DB/provider dependencies.
- [ ] P5.12 **Owner handoff:** exact account/registration, domain/DNS/Tunnel, OS/security, secret placement through UI, disk preparation, model acquisition/placement, service enable/start, backups, monitoring, upgrades, rollback and smoke instructions; identify owner-only work, price assumptions and unresolved hardware choices.
- [x] P5.13 **Pages continuity (static client):** automatic build/deploy and exact revision marker verified for code/test HEAD `58b7465a`, model-gate HEAD `53c3334d` and latest main HEAD `b4089566`; required smoke verifies root boot, same-origin pinned assets and offline shell after first successful visit. Separate live published-site click/revision check remains open under P0.33.3; no VPS/Tunnel deployment is implied.
- [~] P5.14 **Preserve acquired model cache before expiry:** inventory and download commands are current in `models/runtime-install.md`; lock/archive SHA-256, exact IDs, sizes, target OS and expiries are recorded in `models/runtime-stack.lock.json`. External cache run `44900155001` / artifact `14705393467` (6.05 GB); Ollama run `44900155025` (four packages + lock, 7.73 GB); Bonsai run `44900155036` (429 MB); OpenShell v0.1.8 run `44900155047` (207 MB); Python caches run `44900155000` (80 MB). License/provenance/runtime-inventory gate #44901175865 passed. External cache refresh #44901084396 completed and produced duplicate verified artifact `14705619951` (6,054,446,752 bytes, archive SHA-256 `696c704787265e0684a42129a32d7dcd26d58ff1503a27e4784a3f698ef7806c`, expires 2026-12-21 11:53:03Z). Canonical lock/runbook still points to `44900155001` to avoid another download triggered only by metadata refresh; both archives are valid staging copies. OpenShell expires 2026-12-05; others 2026-12-21. None is installed on target host. Owner must copy to durable storage before expiry and verify host OS/architecture/disk before installation.
- [ ] **P5.15 Offline knowledge and coding-reference packs:** support opt-in, compact, independently versioned local packs for selected programming languages/frameworks/API references and small domain databases/indexes. Each pack must declare canonical source, upstream version/commit, content license/NOTICE, SHA-256, size, language, update date, target runtime, dependencies, retrieval/index format and rollback/removal path. Keep docset/content licenses separate from the viewer/runtime license; no blanket redistribution assumption. Do not bundle broad corpora by default, put packs in public Pages output, or download without owner consent. Acceptance: network-denied lookup, exact version/source attribution, update/rollback, size budget and RU/EN/TH retrieval golden tests where applicable. Zeal/Dash docsets are research candidates, not a required runtime.

### P6 — Voice and audio (после landing)

- [ ] P6.1 Re-audit all existing VoiceStudio/Whisper/Vosk/Qwen ASR/Piper/Silero VAD/TTS artefacts and runtimes; distinguish downloaded vs installed vs loaded vs verified.
- [ ] P6.2 ASR RU/EN/TH benchmark WER/CER, RTF, first token/response, RAM/PSS, model/weight/license/hash; transcript editable before send.
- [ ] P6.3 TTS licensed high-quality voices, selected text/full message read-aloud, queue/pause/resume/stop/cancel and device validation.
- [ ] P6.4 Voice chat turn-taking, endpointing, VAD, interruption/barge-in, AEC/echo, Bluetooth/mobile lifecycle and recovery; start with feasible measured half-duplex.
- [ ] P6.5 Podcast as Notebook artifact, grounded script, TTS, transcript and source links.
- [ ] P6.6 Audio format/codec/sample rate/duration/hash/voice/model/license/provenance/retention/export contracts.
- [ ] P6.7 Verify upstreams and licenses including user-mentioned VoiceStudio/Whisper and ambiguous “Dessa” reference; do not assume exact project identity.
- [ ] P6.8 aSoundi — separate audio studio shell/route after landing; audio generation, editing, voice and podcast runtime only after source/license audit and corresponding ASR/TTS/pipeline acceptance. Do not pull aSoundi into P0 landing.

### P7 — Provider owner session (строго после landing)

- [ ] P7.1 Ask owner how to finish supported provider set and UX only after landing UI acceptance.
- [ ] P7.2 Verify Additional Providers isolation from first-party aServi and backend/server config.
- [ ] P7.3 Verify official endpoints/CORS/auth/rate limits/error schemas and live catalog per provider using current primary sources.
- [ ] P7.4 Dynamic model catalog with static fallback and per-provider capability compatibility.
- [ ] P7.5 Error matrix 400/401/403/404/429/5xx/timeout/network/CORS/malformed/cancel; no inappropriate retry/fallback.
- [ ] P7.6 Never migrate provider keys, include in export/log or show secrets in diagnostics.

### P8 — Release and owner-only gates

- [ ] P8.1 Run the appropriate focused fast and browser checks at the end of implementation packages; no weakening assertions or safety gates.
- [ ] P8.2 Exact current HEAD CI, Pages publish marker and root routes after each material main package.
- [ ] P8.3 Owner-run VPS/Tunnel/Ollama/OS/hardware/model/DB/readiness/cold-warm latency and RAM/PSS evidence.
- [ ] P8.4 Permissioned RU/EN/TH golden datasets; benchmark main model, agent, RAG, Coder, ASR/TTS and adversarial cases.
- [ ] P8.5 Security/supply chain: main ruleset, action pins, CSP/SRI, secrets, CORS/SSRF, sandbox escape, backup/restore.
- [ ] P8.6 Owner-only credentials, payments, account registration, physical mic tests and host operations remain explicit owner actions.


## 2.1 Owner detailed acceptance addendum — P1–P8 (2026-11-25; SPECIFIED)

Do not create a parallel backlog. These details refine the existing P1–P8 sections and are scheduled by their existing priority.

### P1 — Shared modes and Coding workspace
- Keep one root shell and one persisted mode contract. In the expanded mode bar, aCodingi and aNoteBooki are adjacent equal-size buttons with distinct mode accents; ordinary aLandi uses the emblem-derived turquoise. The collapsed strip always identifies the active mode.
- aNoteBooki may remain visually/functionally frozen after its current stable local-first baseline. Do not expand Studio catalogue/runtime until P0, real coding and Offline Core priorities are met.
- **Cursor-inspired coding UX (INSPIRE, not clone):** provide a project tree, coding conversation, multi-file editor, inline diff/review, task/terminal output, test/build/debug results, stop/resume and checkpoint/rollback. The experience must be backed by P1/P3 sandbox and permission contracts; never copy proprietary Cursor code or route private work to cloud agents by default.
- **NotebookLM/Gemini Notebook-inspired UX (INSPIRE, later):** keep source-grounded notebook Q&A, explicit source selection, citations/evidence, notes and derived artifacts. Preserve the freeze rule: do not expand Notebook Studio until P0, real Coding and Offline Core are accepted.
- aCodingi must become a real project-aware coding agent: create/edit/delete files, inspect trees, design and implement whole projects, run tests/builds/debugging, present diffs and explain results. It is not limited to patching selected text. Every operation is bound to typed Coding Project, sandbox, tool contract, resource budget and explicit file/network scope.

### P2 — Direct chat and model routing
- Keep direct chat as the zero-overhead baseline. Do not require planners, agents or external providers for ordinary chat.
- Preserve provider/model identity, active draft, attachment, voice state and project context across mode/window visibility changes; never silently rewrite the configured route.

### P3 — Orchestration, agents, Skills Library and training
- Prioritize real multi-agent orchestration, subagent lifecycle, delegation, durable runs, resume/replay, timeouts, bounded retries and approval gates. Show objectively measured state/attribution in real time; distinguish queued/running/waiting/blocked/succeeded/failed/cancelled and actual progress from estimates.
- Provide a Library area for reviewed Skill packages and versioned agent profiles with scoped memory references. Imported packages remain inert until license/security/permission review. A role/profile is not an independent worker unless a real runtime/lease exists.
- Keep two separate workflows: (a) create/bootstrap an agent from instructions, Skills, examples and granted tools without changing base weights; (b) train/adapt model weights using an isolated dataset, explicit material selection, resource/size estimate, licence and consent checks, train/validation/test split, checkpoint/adapter versioning, evaluation and rollback. Training must not learn from all chat history by default. A trained adapter/model is selectable only after registry, compatibility and eval pass.
- A collapsible “why/status” view may show a short safe rationale, chosen method, sources and events, but must never disclose or persist raw hidden chain-of-thought.

- [ ] **P3.13 ComfyUI-inspired visual workflow canvas:** offer a node/edge editor only for genuine multi-step workflows (research, conversion, media generation or agent pipelines) whose nodes have typed input/output contracts, permissions, dependencies, budgets and executable handlers. Persist versioned graphs; validate before run; expose queue, step attribution, error, retry, cancel and artifact outputs. Keep ordinary chat and simple workflows linear; no decorative graph, fake parallelism or ComfyUI runtime dependency by default. Reuse graph UX concepts only; review ComfyUI release/license/security before any code/runtime reuse.

### P4 — File ingestion, converter, Library and exports
- Before upload, let the user set destination name/path and optional conversion target; show fidelity/loss warnings and a real capability reason. The final “Upload files” action starts a durable, resumable job only after these fields are confirmed.
- Add a file Library for all retained/imported/generated/downloaded/edited artifacts with immutable IDs and lineage. Filters: date, chat, project, MIME/format, size, original vs edited/generated/generated-from/downloaded/created, source URL and status. Do not duplicate a file on every chat save; append versions/derivation edges to stable artifact identity.
- Coding workspace file scope is selected separately: own project folder; full aLandi-managed sandbox; or explicitly approved device directories. Revoke and audit grants; no arbitrary file access from prompt text.
- Provide Office import/export/preview through a pinned local LibreOffice headless/service adapter only if package size, license, isolation, latency and target OS/mobile support pass. The UI must show unavailable rather than pretending mobile browsers can install desktop LibreOffice.

### P5 — Offline Core, storage structure and portability
- Settings contain Offline Core installation/download, model/runtime inventory, storage location, backup/restore, export, update and rollback.
- Offer creation of a user-selected device folder tree with manifest and stable IDs for conversations/projects/artifacts. Use atomic writes, immutable versions, conflict detection, checksums and recovery; never overwrite source data on a failed conversion.
- Local storage must be device-aware: IndexedDB/OPFS for browser-owned data; file picker/import/export on constrained mobile browsers; File System Access API only where implemented/supported and permissioned. Do not promise unrestricted iPhone/iPad file access.
- Local/server deployments must be relocatable: identical capability contracts/config manifests across GitHub/local server/VPS, model adapter registry, versioned artifacts, explicit weights swap and health/eval gates. Only the largest main model is owner-supplied; all other public artifacts have pinned hashes/licences and offline closure.
- Offline non-web tasks must work with network denied. Internet search is a separate online capability and is the only planned external dependency for the explicitly requested web path.

### P6 — Voice, voice profile and speech output
- Voice input/playback must not require aServi if a genuine local/browser or explicitly selected external speech capability is installed and reachable. Voice UI cannot switch a third-party chat model/provider.
- Add opt-in personal voice profile creation from user-authorized recordings, explicit consent/ownership confirmation, sample-quality checks, deletion/export, immutable profile IDs and a preview before use. Keep raw source samples local by default; do not use other people's voices without permission.
- Multi-language TTS must preserve selected voice characteristics while measuring language/accent quality; report supported languages, model/weight/license, size, device/server requirements and fallback. Never claim accent fidelity without listening evaluation on real target devices.
- Voice cloning, ASR and TTS adapters remain disabled/unavailable until exact weights/runtime/license hashes, memory, security and real-device latency/quality acceptance are recorded.

### P7 — External providers and route switching
- Curate five trusted providers plus one custom OpenAI-compatible/typed adapter entry only after a current source, free-tier, price, data-retention, privacy, region, rate-limit and reliability review. “Free” models are listed only when currently reachable under explicit zero-cost terms and the user’s credentials/access; do not infer availability from catalog metadata.
- Provider-specific settings own provider switching and live model discovery. “Connect” probes the account and refreshes its catalog; no hard-coded stale list or manual model string is presented as verified.
- Entering third-party provider mode while aServi is active (or vice versa) requires a concise confirmation and bounded preparation step. Keep server auth/settings/storage and provider credentials/catalogs isolated; share only intentionally neutral capabilities.
- On transient failure, retry only safe/idempotent connection checks with bounded backoff; then try compatible models within the same provider according to policy. Do not silently transmit a prompt to another provider. Ask before switching providers and disclose destination/data/price.
- The chat’s model badge opens a compact capability summary: tools, vision, audio, context, streaming, structured output, languages, limitations and suitable tasks; all values derive from current model metadata/probes.

### P8 — Owner runbook and deployment gates
- Refresh owner instructions against current official VPS/hosting offerings before each infrastructure choice; compare monthly recurring cost, free-trial expiry, GPU access, CPU/RAM/disk, inbound network, region, backups, SLA and exit/export.
- Account registration, billing activation, API keys, DNS/Tunnel, host changes, paid upgrades and production deployment remain owner-only actions. Provide step-by-step owner procedures without requesting secrets in chat.
- Record the policy boundaries of GitHub Pages and any free provider; free static UI hosting is not a promise of free inference or perpetual compute.

**Sequencing reaffirmation:** P0 release defects and the full required Chromium gate first; then P1 Coding + P3 orchestration foundation + P5 Offline Core; then P2 routing continuity; P4 library/conversion expansion; keep aNoteBooki Studio frozen until its priority returns; P6 voice clone/audio after artifact gates; P7 provider curation after route-isolation review; finally P8 owner environment/release gates. Independent read-only research may proceed in parallel.

## 3. Текущий ближайший пакет реализации

- [~] Первый UI пакет: sidebar Create/section headings/space recovery IMPLEMENTED; остаётся довести desktop row density и проверить focus/scroll/selection persistence. Project Settings уже имеют базовую логическую IA; нужна mobile/action acceptance.
- [~] Второй UI пакет: основные dialog focus/keyboard сценарии уже присутствуют; остаток — полный menu/popover sweep, chat-row action completeness, composer geometry/keyboard и все form states.
- [~] Третий UI пакет: Research duplicate controls removed, current method selector/catalogue and Agent topology roadmap IMPLEMENTED; осталось довести Skills/Connectors IA и полную real status-strip semantics. См. P0.12–P0.15.
- [~] Fourth UI package: RU/EN, mobile 320–1440, typography/spacing/theme/motion/accessibility, browser matrix and dead-control audit remains the active package; memory IndexedDB read-failure states and promotion feedback are now implemented with RU/EN regression coverage, while the remaining responsive/native/browser matrix is still open.
- [ ] After the root interaction/navigation foundation is accepted, implement the three shared-frame modes in P1 progressively: aNoteBooki source-grounded chat + real Studio jobs; aCodingi chat + per-project isolated workspace. This is not deferred to primitive standalone shells. aSoundi comes later after landing.
- [ ] At end of landing: run complete package verification and then owner provider consultation.

## 4. Imported historical registers — open/partial task rows

Ниже сохранены все строки checkbox двух прежних мастер-реестров. Стабильные ID и исходные формулировки оставлены для трассировки. PARTIAL перенесён как открытый пункт с явной пометкой; старые статусы не заменяют актуальную приёмку.

## 4A. Open / partial
### MASTER_TASK_REGISTRY_RU.md — UR — Исторический пользовательский реестр
- [ ] **UR-014** **UR-014** (строка 14; A. База, управление и непрерывность): Проверить все старые регрессии: создание чата, история, экспорт/импорт, отмена, повтор запроса. _(исходный статус: OPEN; строка 55)_
- [ ] **UR-015** **UR-015** (строка 15; A. База, управление и непрерывность): Обновить сведения о реальном состоянии системы: код, контракт, эксперимент, развёрнутая служба, измеренная метрика. _(исходный статус: OPEN; строка 56)_
- [ ] **UR-020** **UR-020** (строка 20; B. Первичное облако aLandi и API-провайдеры): Начальный статус облака — красный/неподтверждённый; зелёный возможен лишь после реального модельного ответа и успешной `/healthz`-проверки при следующем запуске. Живой пользовательский gateway ещё не сконфигурирован. _(исходный статус: PARTIAL; строка 57)_
- [ ] **UR-021** **UR-021** (строка 21; B. Первичное облако aLandi и API-провайдеры): Хранить адрес, модель и ключ aLandi отдельно; не считать наличие ключа доказательством связи. _(исходный статус: PARTIAL; строка 58)_
- [ ] **UR-022** **UR-022** (строка 22; B. Первичное облако aLandi и API-провайдеры): Проверять сохранённое соединение при запуске через health-check, а не доверять вечному старому зелёному статусу. _(исходный статус: PARTIAL; строка 59)_
- [ ] **UR-023** **UR-023** (строка 23; B. Первичное облако aLandi и API-провайдеры): Перенести старые настройки провайдеров в свёрнутый дополнительный раздел. _(исходный статус: PARTIAL; строка 60)_
- [ ] **UR-024** **UR-024** (строка 24; B. Первичное облако aLandi и API-провайдеры): Вынести ключ Tavily в под-раздел инструментов и веб-поиска. _(исходный статус: PARTIAL; строка 61)_
- [ ] **UR-025** **UR-025** (строка 25; B. Первичное облако aLandi и API-провайдеры): Добавить кнопку вставки для ключей провайдера и своего gateway. _(исходный статус: PARTIAL; строка 62)_
- [ ] **UR-026** **UR-026** (строка 26; B. Первичное облако aLandi и API-провайдеры): После явной вставки ключа запускать один ограниченный refresh каталога и тест соединения. _(исходный статус: PARTIAL; строка 63)_
- [ ] **UR-027** **UR-027** (строка 27; B. Первичное облако aLandi и API-провайдеры): Блокировать конкурирующие одновременные тесты подключения. _(исходный статус: PARTIAL; строка 64)_
- [ ] **UR-029** **UR-029** (строка 29; B. Первичное облако aLandi и API-провайдеры): При явной ошибке доступности модели искать не более трёх альтернатив того же провайдера. _(исходный статус: PARTIAL; строка 65)_
- [ ] **UR-030** **UR-030** (строка 30; B. Первичное облако aLandi и API-провайдеры): Не делать retry альтернативных моделей на 401/403, 429, сетевой ошибке или общем сбое API. _(исходный статус: PARTIAL; строка 66)_
- [ ] **UR-031** **UR-031** (строка 31; B. Первичное облако aLandi и API-провайдеры): Принимать корректные текстовые массивы, refusals/tool-calls и варианты совместимого ответа, не путать валидный JSON-envelope с ошибкой формата. _(исходный статус: PARTIAL; строка 67)_
- [ ] **UR-032** **UR-032** (строка 32; B. Первичное облако aLandi и API-провайдеры): Kilo Auto Free доступен как обычный альтернативный провайдер в общем списке: без ключа, только по явному выбору и без скрытого fallback. Официальная документация предупреждает, что промпты могут поступать провайдерам, которые логируют их/используют для улучшения моделей; конфиденциальные данные туда не отправлять. См. `docs/V016_IMPLEMENTATION_CHECKLIST.md` и [официальное предупреждение Kilo](https://kilo.ai/docs/getting-started/using-kilo-for-free). _(исходный статус: PARTIAL; строка 68)_
- [ ] **UR-033** **UR-033** (строка 33; B. Первичное облако aLandi и API-провайдеры): Обновить все модельные ID по официальным динамическим каталогам; статические preset считать только fallback. _(исходный статус: OPEN; строка 69)_
- [ ] **UR-034** **UR-034** (строка 34; B. Первичное облако aLandi и API-провайдеры): Провести E2E-проверку реального пользовательского выбора Kilo и документацию об обработке данных сторонним шлюзом. _(исходный статус: OPEN; строка 70)_
- [ ] **UR-036** **UR-036** (строка 36; B. Первичное облако aLandi и API-провайдеры): Проверить официальные endpoints, CORS, лимиты, схему аутентификации и формат ошибок каждого сохранённого провайдера. _(исходный статус: OPEN; строка 71)_
- [ ] **UR-037** **UR-037** (строка 37; B. Первичное облако aLandi и API-провайдеры): Никогда не переносить ключи из одного провайдера в другой и не экспортировать ключи в settings-profile. _(исходный статус: OPEN; строка 72)_
- [ ] **UR-040** **UR-040** (строка 40; C. Главный экран, визуальная система и язык): Переоформить шапку в бренд aLandi и перенести название активного чата в подпись. _(исходный статус: PARTIAL; строка 73)_
- [ ] **UR-041** **UR-041** (строка 41; C. Главный экран, визуальная система и язык): Добавить пасхалку «a land i → i land AI». _(исходный статус: PARTIAL; строка 74)_
- [ ] **UR-042** **UR-042** (строка 42; C. Главный экран, визуальная система и язык): Добавить реальные цифровые часы и аналоговые стрелки с дискретным обновлением. _(исходный статус: PARTIAL; строка 75)_
- [ ] **UR-043** **UR-043** (строка 43; C. Главный экран, визуальная система и язык): Добавить основной переключатель тёмной/светлой темы на главном экране. _(исходный статус: PARTIAL; строка 76)_
- [ ] **UR-044** **UR-044** (строка 44; C. Главный экран, визуальная система и язык): Добавить RU/EN переключатель и сохранять выбранный язык. _(исходный статус: PARTIAL; строка 77)_
- [ ] **UR-045** **UR-045** (строка 45; C. Главный экран, визуальная система и язык): Обновить шрифтовой fallback без обязательной внешней загрузки; улучшить радиусы и состояния элементов. _(исходный статус: PARTIAL; строка 78)_
- [ ] **UR-046** **UR-046** (строка 46; C. Главный экран, визуальная система и язык): Реализовать центрирование поля ввода в пустом чате и увеличение высоты по мере ввода. _(исходный статус: PARTIAL; строка 79)_
- [ ] **UR-047** **UR-047** (строка 47; C. Главный экран, визуальная система и язык): Перемещать длинный черновик из центрального режима в привычную нижнюю позицию. _(исходный статус: PARTIAL; строка 80)_
- [ ] **UR-048** **UR-048** (строка 48; C. Главный экран, визуальная система и язык): Добавить ограниченное прикрепление текстовых файлов (.txt, .md, .csv, .json, .log) с размерными лимитами. _(исходный статус: PARTIAL; строка 81)_
- [ ] **UR-049** **UR-049** (строка 49; C. Главный экран, визуальная система и язык): Мобильная кнопка голоса, удержание и свайп покрыты успешным PR #21 Chromium E2E. Это только preview: микрофон, ASR, TTS, AEC и аудиотранспорт не подключены. _(исходный статус: PARTIAL; строка 82)_
- [ ] **UR-050** **UR-050** (строка 50; C. Главный экран, визуальная система и язык): Полностью пройти мобильную/настольную проверку размеров и областей касания. _(исходный статус: OPEN; строка 83)_
- [ ] **UR-051** **UR-051** (строка 51; C. Главный экран, визуальная система и язык): Проверить клавиатурную доступность, visible focus, контраст, screen reader и reduced-motion. _(исходный статус: OPEN; строка 84)_
- [ ] **UR-052** **UR-052** (строка 52; C. Главный экран, визуальная система и язык): Перевести все пользовательские надписи, подсказки и ошибки интерфейса; текущий RU/EN перевод неполный. _(исходный статус: OPEN; строка 85)_
- [ ] **UR-053** **UR-053** (строка 53; C. Главный экран, визуальная система и язык): Сокращены ключевые инструкции настроек: cloud/API, ключи, CORS, контекст и веб-поиск. Полный аудит всех подсказок и согласование RU/EN ещё не завершены. _(исходный статус: PARTIAL; строка 86)_
- [ ] **UR-054** **UR-054** (строка 54; C. Главный экран, визуальная система и язык): Провести визуальную регрессию desktop/mobile и проверить, что анимации не мешают длинному вводу. _(исходный статус: OPEN; строка 87)_
- [ ] **UR-057** **UR-057** (строка 57; D. Чаты, проекты, инструкции и память): Project CRUD присутствует в клиенте: создать, переименовать/редактировать, удалить с подтверждением; повторно проверить E2E на текущей ветке. _(исходный статус: PARTIAL; строка 88)_
- [ ] **UR-058** **UR-058** (строка 58; D. Чаты, проекты, инструкции и память): Проектные инструкции редактируются и добавляются в контекст как предпочтения, не как политика безопасности; подтвердить тестами precedence. _(исходный статус: PARTIAL; строка 89)_
- [ ] **UR-059** **UR-059** (строка 59; D. Чаты, проекты, инструкции и память): Текущий чат можно привязать/отвязать от проекта; проектная принадлежность видна в интерфейсе. _(исходный статус: PARTIAL; строка 90)_
- [ ] **UR-060** **UR-060** (строка 60; D. Чаты, проекты, инструкции и память): Есть экспорт/импорт project bundle с чатом, инструкциями и памятью; проверить схему, duplicate IDs, limits, malicious content. _(исходный статус: PARTIAL; строка 91)_
- [ ] **UR-061** **UR-061** (строка 61; D. Чаты, проекты, инструкции и память): Browser-local global/project memory toggles are separate and global context defaults off; UI toggle E2E exists, but a dedicated multi-project prompt-leak test for browser-local global facts remains open. _(исходный статус: PARTIAL; строка 92)_
- [ ] **UR-063** **UR-063** (строка 63; D. Чаты, проекты, инструкции и память): Реализовать authenticated API/индексацию project sources только после согласованного backend contract; не имитировать работающий индекс на пустой заглушке. _(исходный статус: OPEN; строка 94)_
- [ ] **UR-064** **UR-064** (строка 64; D. Чаты, проекты, инструкции и память): RAG retrieval/delete, Evidence Ledger and exact-payload cache isolation tests are present; browser-global memory prompt leakage and a distinct cache project-ID scope contract remain open. Server-memory graph is retired. _(исходный статус: PARTIAL; строка 95)_
- [ ] **UR-065** **UR-065** (строка 65; D. Чаты, проекты, инструкции и память): RAG source deletion is scope-checked and removes chunk/concept/FTS rows; SQLite `secure_delete` plus version-gated FTS5 `secure-delete` regression tests passed on PR #24 HEAD and post-merge main. This still does **not** erase evidence-ledger copies, WAL/journals, backups or browser-local source copies; system-wide crypto-erasure remains open. _(исходный статус: PARTIAL; строка 96)_
- [ ] **UR-066** **UR-066** (строка 66; D. Чаты, проекты, инструкции и память): Проверить экспорт, исправление и удаление пользовательских фактов и связанные derived records. _(исходный статус: OPEN; строка 97)_
- [ ] **UR-067** **UR-067** (строка 67; D. Чаты, проекты, инструкции и память): Реализовать удаление/криптостирание по всем реальным слоям; не обещать SLA ≤60 секунд без измерения. _(исходный статус: OPEN; строка 98)_
- [ ] **UR-071** **UR-071** (строка 71; D. Чаты, проекты, инструкции и память): Полноценный viewer источников/индекса, citation lineage и cross-device project memory остаются задачами последующих фаз. _(исходный статус: OPEN; строка 100)_
- [ ] **UR-074** **UR-074** (строка 74; E. Инструменты, маршрутизация, веб-поиск и отказы): Сохранить ограничение по числу шагов инструментов и исследовательских вызовов; не запускать неограниченный retry loop. _(исходный статус: PARTIAL; строка 101)_
- [ ] **UR-075** **UR-075** (строка 75; E. Инструменты, маршрутизация, веб-поиск и отказы): Сохранить явный opt-in для fallback к другому облачному провайдеру. _(исходный статус: PARTIAL; строка 102)_
- [ ] **UR-076** **UR-076** (строка 76; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить все циклы tool-calls на max rounds, общий deadline, cancellation, bounded concurrency и корректное продолжение assistant/tool messages. _(исходный статус: OPEN; строка 103)_
- [ ] **UR-077** **UR-077** (строка 77; E. Инструменты, маршрутизация, веб-поиск и отказы): При ошибке инструмента пробовать совместимый способ/альтернативный инструмент только в пределах явного policy и бюджета. _(исходный статус: OPEN; строка 104)_
- [ ] **UR-078** **UR-078** (строка 78; E. Инструменты, маршрутизация, веб-поиск и отказы): Показывать правдивую timeline событий: фактический вызов, источник, duration, результат, ошибка; не показывать скрытые рассуждения. _(исходный статус: OPEN; строка 105)_
- [ ] **UR-080** **UR-080** (строка 80; E. Инструменты, маршрутизация, веб-поиск и отказы): Внедрить 12-шаговый Deep Research state machine, повторный поиск при пробелах и проверку утверждений против ссылок. _(исходный статус: OPEN; строка 106)_
- [ ] **UR-081** **UR-081** (строка 81; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить prompt-injection в проектных инструкциях и загруженных документах. _(исходный статус: OPEN; строка 107)_
- [ ] **UR-082** **UR-082** (строка 82; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить SSRF/redirect protections, MIME/size/time limits, безопасную очистку временных файлов и отсутствие секретов в логах. _(исходный статус: OPEN; строка 108)_
- [ ] **UR-083** **UR-083** (строка 83; E. Инструменты, маршрутизация, веб-поиск и отказы): Не кэшировать streaming, tool calls, web research, multimedia, errors или partial outputs. _(исходный статус: OPEN; строка 109)_
- [ ] **UR-084** **UR-084** (строка 84; E. Инструменты, маршрутизация, веб-поиск и отказы): Проверить точную инвалидацию exact cache при изменении prompt, project instructions или tool schema. _(исходный статус: OPEN; строка 110)_
- [ ] **UR-085** **UR-085** (строка 85; E. Инструменты, маршрутизация, веб-поиск и отказы): Измерить retry rate, повторные дубликаты, частоту 429/5xx, latency и успешность tool-циклов. _(исходный статус: OPEN; строка 111)_
- [ ] **UR-089** **UR-089** (строка 89; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить CI-гейт триады: точный проверенный URL + лицензия конкретного артефакта + источник технического утверждения. _(исходный статус: OPEN; строка 112)_
- [ ] **UR-090** **UR-090** (строка 90; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Не включать модели/голоса в установщик до проверки точной лицензии, весов, voice artifact и checksums. _(исходный статус: OPEN; строка 113)_
- [ ] **UR-091** **UR-091** (строка 91; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Внедрить ALBF binary framing только вместе с real transport и тестами на усечение, CRC, max payload и cancellation. _(исходный статус: OPEN; строка 114)_
- [ ] **UR-092** **UR-092** (строка 92; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Сделать bake-off ASR/TTS с измерением RTF, first audio, e2e p95 и потребления PSS; не опираться на неподтверждённые цифры. _(исходный статус: OPEN; строка 115)_
- [ ] **UR-093** **UR-093** (строка 93; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Подтвердить native audio capture/processing прежде, чем обещать отсутствие PCM/аудио hotpath в Python. _(исходный статус: OPEN; строка 116)_
- [ ] **UR-095** **UR-095** (строка 95; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить безопасную изоляцию tool workspace; не называть subprocess без sandbox production-изоляцией. _(исходный статус: OPEN; строка 117)_
- [ ] **UR-096** **UR-096** (строка 96; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить scope isolation, no-PII logs, prompt priority stack и fail-safe privacy policy. _(исходный статус: OPEN; строка 118)_
- [ ] **UR-097** **UR-097** (строка 97; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Измерить профиль laptop_8gb_cpu_mvp на целевом 8-GB железе, включая combined LLM+RAG+tools и cold-tier eviction. _(исходный статус: OPEN; строка 119)_
- [ ] **UR-098** **UR-098** (строка 98; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Не заявлять p95 900/2500 ms, regret ≤1.25, PII leak=0 или crypto-erase SLA, пока нет воспроизводимых evals. _(исходный статус: OPEN; строка 120)_
- [ ] **UR-099** **UR-099** (строка 99; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Полностью пересмотреть список зависимостей/отклонённых технологий в V-016 и не вводить CUT/PAT items как production-зависимости. _(исходный статус: OPEN; строка 121)_
- [ ] **UR-100** **UR-100** (строка 100; F. V-016: зависимости, аудио, память, бюджеты и лицензии): Проверить Third-party NOTICE и права распространения каждой включённой библиотеки/модели. _(исходный статус: OPEN; строка 122)_
- [ ] **UR-103** **UR-103** (строка 103; G. Выпуск и финальный аудит): Пройти Jekyll build, quality sentinels, browser Chromium tests, accessibility/interaction tests и provider-specific deterministic E2E. _(исходный статус: OPEN; строка 123)_
- [ ] **UR-104** **UR-104** (строка 104; G. Выпуск и финальный аудит): Проверить без реальных секретов: malformed response, 400/404 model missing, 401/403 auth, 429, 5xx, timeout, CORS, offline and cancelled request. _(исходный статус: OPEN; строка 124)_
- [ ] **UR-105** **UR-105** (строка 105; G. Выпуск и финальный аудит): Проверить, что новая ветка не меняет чужую конфигурацию, историю, секреты или сохранённые настройки молча. _(исходный статус: OPEN; строка 125)_
- [ ] **UR-106** **UR-106** (строка 106; G. Выпуск и финальный аудит): После merge проверить main SHA, успешные workflows и опубликованную GitHub Pages версию. _(исходный статус: OPEN; строка 126)_
- [ ] **UR-107** **UR-107** (строка 107; G. Выпуск и финальный аудит): Перепроверить каждый пункт этого реестра перед итоговым отчётом; явно перечислить незавершённое и неподтверждённое. _(исходный статус: OPEN; строка 127)_
- [ ] **UR-117** **UR-117** (строка 117; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 0–4: gateway/trace, scoped temporal memory, FTS5/evidence/citations и tool safety имеют foundations/prototypes; у каждого остаются отдельные eval-гейты. _(исходный статус: PARTIAL; строка 128)_
- [ ] **UR-118** **UR-118** (строка 118; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 5–6: подключить настоящий voice runtime и native ASR/VAD/TTS только после лицензий и воспроизводимого hardware benchmark. _(исходный статус: OPEN; строка 129)_
- [ ] **UR-119** **UR-119** (строка 119; Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8): Фазы 7–8: подключить реальную telemetry timeline, authenticated UI API и cloud integration только после backend contract/security review. _(исходный статус: OPEN; строка 130)_
- [ ] **UR-169** **UR-169** (строка 169; Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты): На каждое изменение статуса дополнить eval-отчёт командой, результатом, sample size, SHA и rollback; обновить PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md и соответствующий отчёт. _(исходный статус: OPEN; строка 131)_
- [ ] **UR-174** **UR-174** (строка 174; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Прогнать python -m compileall -q gateway, python -m pytest -q gateway/tests, python gateway/evals/run_six_layer_eval.py и лицензионный CI gate на текущем состоянии ветки. _(исходный статус: OPEN; строка 132)_
- [ ] **UR-175** **UR-175** (строка 175; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Проверить provenance каждого реально поставляемого артефакта: точный источник, применимая лицензия модели/голоса, SHA-256. TBD/непроверенные hashes не могут отмечаться как ship-enabled. _(исходный статус: OPEN; строка 133)_
- [ ] **UR-176** **UR-176** (строка 176; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Измерить на целевом хосте cold/warm p50/p95/p99, RTF, RAM/PSS, аудиодропы, CER/WER и regression sample counts до любых performance claims. _(исходный статус: OPEN; строка 134)_
- [ ] **UR-177** **UR-177** (строка 177; Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates): Развёртывание VPS, DNS, OAuth secrets и создание billable infrastructure не выполнять без актуального account access/проверенных параметров и отдельного согласованного действия. _(исходный статус: OPEN; строка 135)_
- [ ] **UR-191** **UR-191** (строка 191; Gate перед финальным ответом): Пересверить весь этот To do и таблицу ID с текущим HEAD после завершения всех workflows; подробный аудит четырёх частей манифеста — `docs/V016_IMPLEMENTATION_CHECKLIST.md` (81 пункт, §§0–40). _(исходный статус: OPEN; строка 136)_
- [ ] **UR-192** **UR-192** (строка 192; Gate перед финальным ответом): Указать раздельно: фактически внедрено, проверено CI, подтверждено live, измерено benchmark, осталось prototype/deferred/blocked. _(исходный статус: OPEN; строка 137)_
- [ ] **UR-193** **UR-193** (строка 193; Gate перед финальным ответом): Не объединять PR и не сообщать о публикации до зелёных релевантных workflow и проверки merge result. _(исходный статус: OPEN; строка 138)_
- [ ] **UR-202** **UR-202** (строка 202; I. Следующие продуктовые вертикали): Первый месяц не создавать платные ресурсы автоматически: GitHub Pages + уже имеющееся железо + Ollama локально; free-tier API считать квотируемым и внешним, не гарантированно бесплатным. _(исходный статус: OPEN; строка 140)_
- [ ] **UR-203** **UR-203** (строка 203; I. Следующие продуктовые вертикали): Оценить одну маленькую helper-модель для классификации, извлечения фактов, кратких сводок и чернового ранжирования. Главная модель остаётся для планирования, сложного reasoning и синтеза. Сравнить качество, latency и RAM перед включением. _(исходный статус: OPEN; строка 141)_
- [ ] **UR-204** **UR-204** (строка 204; I. Следующие продуктовые вертикали): Добавить генерацию изображений отдельным модулем после выбора реального backend (локальный ComfyUI/API или явно выбранный внешний провайдер), проверки точной модели/лицензии/VRAM и mock E2E. _(исходный статус: OPEN; строка 142)_
- [ ] **UR-205** **UR-205** (строка 205; I. Следующие продуктовые вертикали): Не добавлять скрытый refusal-фильтр поверх выбранной модели; не обещать «никогда не отказывает»: поведение checkpoint и правила внешнего API не контролируются приложением. _(исходный статус: OPEN; строка 143)_
- [ ] **UR-206** **UR-206** (строка 206; I. Следующие продуктовые вертикали): Перед переходом на платный сервер сравнить baseline с измерениями p50/p95, RAM, качества, устойчивости, квот и месячной стоимости; менять endpoint/model config без смены контракта UI. _(исходный статус: OPEN; строка 144)_
- [ ] **UR-213** **UR-213** (строка 213; Supplement — 2026-10-24 owner quickstart and chat ergonomics): Real voice capture/ASR/TTS, image/video pipelines and complete document ingestion remain separate unimplemented work; see `docs/IMPLEMENTATION_ROADMAP_RU.md` and the original V-016 evidence ledger. _(исходный статус: OPEN; строка 145)_
- [ ] **UR-225** **UR-225** (строка 225; Supplement — 2026-10-24 project navigation and composer): Real device verification: touch long-press/cancel, mobile keyboard focus/viewport reset, screen reader flow, and large file handling. _(исходный статус: OPEN; строка 146)_
- [ ] **UR-226** **UR-226** (строка 226; Supplement — 2026-10-24 project navigation and composer): Implement real file intake pipeline for PDF/DOCX/XLSX/OCR/audio/video metadata before claiming all formats are supported. _(исходный статус: OPEN; строка 147)_
- [ ] **UR-235** **UR-235** (строка 235; Supplement — local helper memory suggestions (2026-10-27)): Live inference, selected/installed VPS model, output quality, RAM and latency remain unverified. _(исходный статус: OPEN; строка 148)_
- [ ] **UR-243** **UR-243** (строка 243; Supplement — reconciliation of the older mobile and interface request (2026-10-27)): Next bounded slice: edge-aware chat-row/popover placement and compact header order/project label/clock polish. Keep these separate from provider/project export-import cleanup and per-chat settings audit. _(исходный статус: PARTIAL; строка 149)_
- [ ] **UR-244** **UR-244** (строка 244; Supplement — reconciliation of the older mobile and interface request (2026-10-27)): Run native iPhone Safari/keyboard/touch verification separately; passing Chromium viewport simulation is not proof of native behavior. _(исходный статус: OPEN; строка 150)_
- [ ] **UR-251** **UR-251** (строка 251; Supplement — autonomous agent orchestration research (2026-10-28)): Reconcile current main and open PRs before code changes; audit actual runtime paths rather than relying on module names. _(исходный статус: OPEN; строка 151)_
- [ ] **UR-252** **UR-252** (строка 252; Supplement — autonomous agent orchestration research (2026-10-28)): Implement task contract/state machine and tests in a bounded PR. _(исходный статус: OPEN; строка 152)_
- [ ] **UR-253** **UR-253** (строка 253; Supplement — autonomous agent orchestration research (2026-10-28)): Select and verify a real sandbox before allowing arbitrary command/code execution. _(исходный статус: OPEN; строка 153)_
- [ ] **UR-254** **UR-254** (строка 254; Supplement — autonomous agent orchestration research (2026-10-28)): Add adversarial/golden evaluations, crash/restart and idempotency tests; measure target-host RAM/latency. _(исходный статус: OPEN; строка 154)_
- [ ] **UR-255** **UR-255** (строка 255; Supplement — autonomous agent orchestration research (2026-10-28)): Update PROJECT_STATE.yaml and EVALS.md only with verified implementation/test evidence. Research/documentation completion does not mean runtime implementation. _(исходный статус: OPEN; строка 155)_
- [ ] **UR-259** **UR-259** (строка 259; Supplement — voice model landing and VPS owner steps (2026-10-28)): After PR #75 exact-head CI passes and the code is merged, deploy that exact code revision to the VPS; GitHub Pages deployment alone does not update the private gateway. _(исходный статус: OPEN; строка 156)_
- [ ] **UR-260** **UR-260** (строка 260; Supplement — voice model landing and VPS owner steps (2026-10-28)): On the VPS, inspect OS/architecture/RAM/disk before installing Python 3.12+, ffmpeg/ffprobe, whisper.cpp, Piper and selected local model artifacts. _(исходный статус: OPEN; строка 157)_
- [ ] **UR-261** **UR-261** (строка 261; Supplement — voice model landing and VPS owner steps (2026-10-28)): Download only upstream-verified, license-reviewed artifacts; record exact source/version/license/SHA-256. For Piper, verify matching `.onnx` + `.onnx.json`; do not auto-download models from user requests. _(исходный статус: OPEN; строка 158)_
- [ ] **UR-262** **UR-262** (строка 262; Supplement — voice model landing and VPS owner steps (2026-10-28)): Configure `/etc/alandi-gateway.env` with `0600` permissions; keep ASR/TTS flags false until binaries, models and authenticated capabilities are checked. Then enable one feature at a time and restart the service. _(исходный статус: OPEN; строка 159)_
- [ ] **UR-263** **UR-263** (строка 263; Supplement — voice model landing and VPS owner steps (2026-10-28)): Validate the real microphone → editable transcript → explicit send → same-chat response → local TTS playback/voice choice/Stop path on the target device; record RAM, latency and speech quality. _(исходный статус: OPEN; строка 160)_
- [ ] **UR-264** **UR-264** (строка 264; Supplement — voice model landing and VPS owner steps (2026-10-28)): Never share secrets or full env files in chat. SSH/VPS access is not available through the current GitHub integration, so server-side installation must be executed by the owner using the runbook. _(исходный статус: OPEN; строка 161)_
- [ ] **UR-271** **UR-271** (строка 271; Supplement — consolidated interface cleanup, 2026-10-30): Native iPhone Safari keyboard, safe-area, touch and accessibility checks remain manual gates. Chromium geometry assertions do not establish native iOS behavior. _(исходный статус: OPEN; строка 162)_
- [ ] **UR-272** **UR-272** (строка 272; Supplement — consolidated interface cleanup, 2026-10-30): Live aLandi gateway, third-party provider credentials, external connectors, independent agent teams and production voice transport are not verified by these UI changes. _(исходный статус: OPEN; строка 163)_
- [ ] **UR-278** **UR-278** (строка 278; Supplement — sidebar hierarchy and preferences, 2026-10-30): Native iPhone Safari keyboard, safe-area, focus, touch and screen-reader behavior remain unverified. Live gateway, provider credentials, connector sync, independent agent teams and voice transport remain separate runtime/infrastructure gates. _(исходный статус: OPEN; строка 164)_
- [ ] **UR-284** **UR-284** (строка 284; Supplement — orthogonal chat settings and Research Studio, 2026-10-30): Native iPhone Safari behavior and live gateway/provider execution remain separate manual/runtime gates. _(исходный статус: OPEN; строка 165)_
- [ ] **UR-290** **UR-290** (строка 290; Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30): Run a real target-host comparison with identical model artifact/digest/license, quantization, context, hardware and repetitions. Record RAM/PSS, cold/warm latency, p50/p95, tokens/s where available and human-rated RU/EN/TH task quality. _(исходный статус: OPEN; строка 166)_
- [ ] **UR-291** **UR-291** (строка 291; Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30): Keep the main model responsible for planning, complex reasoning and synthesis. Evaluate at most one optional helper for bounded extraction/classification/summarization; helper remains off by default and cannot authorize tools or approve side effects. _(исходный статус: OPEN; строка 167)_
- [ ] **UR-302** **UR-302** (строка 302; Supplement — V1 landing and interface finalization, 2026-10-30): Native iPhone Safari, keyboard, safe-area, screen-reader and touch verification remain manual gates. _(исходный статус: OPEN; строка 168)_
- [ ] **UR-303** **UR-303** (строка 303; Supplement — V1 landing and interface finalization, 2026-10-30): Issue #111 remains open for owner-only ruleset, VPS/hardware, live gateway/model, RAG corpus, voice/device and sandbox gates. CI alone cannot close it. _(исходный статус: OPEN; строка 169)_
- [ ] **UR-310** **UR-310** (строка 310; Owner override D-022, 2026-11-08): Final screenshot/accessibility review of the neutral compact contextual stop control; preserve stop while generation is active, but do not use a persistent/floating red button. _(исходный статус: PARTIAL; строка 170)_

### MASTER_TASK_REGISTRY_RU.md — V016 — GEN1 / CRAZE V-016
- [ ] **V016-153** **V016-153** (строка 153; P1 — required next implementation slices): Add a formal safety-first prompt composer (safety/workspace/project/profile/user), with prompt-injection regression tests. _(исходный статус: OPEN; строка 177)_
- [ ] **V016-154** **V016-154** (строка 154; P1 — required next implementation slices): Add a privacy-only/local-only routing policy that blocks remote APIs and makes refusal explicit. _(исходный статус: OPEN; строка 178)_
- [ ] **V016-155** **V016-155** (строка 155; P1 — required next implementation slices): Add route/router error tests for Grok/xAI, Kilo keyless route, 401/403/429/5xx, CORS failures, abort and malformed bodies. _(исходный статус: OPEN; строка 179)_
- [ ] **V016-156** **V016-156** (строка 156; P1 — required next implementation slices): Complete RU/EN translation of settings help, errors, traces, project controls and all interactive labels. _(исходный статус: OPEN; строка 180)_
- [ ] **V016-157** **V016-157** (строка 157; P1 — required next implementation slices): Audit keyboard navigation, contrast, mobile composer movement, safe-area and reduced-motion support. _(исходный статус: OPEN; строка 181)_
- [ ] **V016-160** **V016-160** (строка 160; P2 — V-016 engineering blockers; do not advertise as production): Implement and test deterministic artifact-manifest hashing + complete INTEL triad gate. _(исходный статус: OPEN; строка 182)_
- [ ] **V016-161** **V016-161** (строка 161; P2 — V-016 engineering blockers; do not advertise as production): Implement typed risk-aware router and route-regret evaluation corpus. _(исходный статус: OPEN; строка 183)_
- [ ] **V016-162** **V016-162** (строка 162; P2 — V-016 engineering blockers; do not advertise as production): Implement ALBF binary framing with CRC/truncation/overflow/interrupt tests. _(исходный статус: OPEN; строка 184)_
- [ ] **V016-163** **V016-163** (строка 163; P2 — V-016 engineering blockers; do not advertise as production): Implement native audio capture/inference adapters and measure e2e p50/p95 + PSS on the target 8 GB CPU host. _(исходный статус: OPEN; строка 185)_
- [ ] **V016-164** **V016-164** (строка 164; P2 — V-016 engineering blockers; do not advertise as production): Resolve every model/voice license/hash before packaging any weights. _(исходный статус: OPEN; строка 186)_
- [ ] **V016-165** **V016-165** (строка 165; P2 — V-016 engineering blockers; do not advertise as production): Harden cPocket rollback/TTL/cancellation races; do not enable speculative side-effect tools. _(исходный статус: OPEN; строка 187)_
- [ ] **V016-166** **V016-166** (строка 166; P2 — V-016 engineering blockers; do not advertise as production): Add crypto-erasure semantics and prove logical vs physical deletion guarantees. _(исходный статус: OPEN; строка 188)_
- [ ] **V016-167** **V016-167** (строка 167; P2 — V-016 engineering blockers; do not advertise as production): Add scratch-file offload, secure document ingestion, exact page/offset/hash citations and retrieval benchmarks. _(исходный статус: OPEN; строка 189)_
- [ ] **V016-168** **V016-168** (строка 168; P2 — V-016 engineering blockers; do not advertise as production): Keep CLI/browser runtime blocked until real sandbox/SSRF/approval escape tests pass. _(исходный статус: OPEN; строка 190)_
- [ ] **V016-169** **V016-169** (строка 169; P2 — V-016 engineering blockers; do not advertise as production): Implement 12-state research workflow and claim-to-evidence citation validation. _(исходный статус: OPEN; строка 191)_
- [ ] **V016-170** **V016-170** (строка 170; P2 — V-016 engineering blockers; do not advertise as production): Implement candidate-lessons pipeline with golden tests and rollback; no automatic weight training. _(исходный статус: OPEN; строка 192)_
- [ ] **V016-171** **V016-171** (строка 171; P2 — V-016 engineering blockers; do not advertise as production): Implement optional connectors only after encrypted token storage, scope review, revoke and index cleanup. _(исходный статус: OPEN; строка 193)_
- [ ] **V016-172** **V016-172** (строка 172; P2 — V-016 engineering blockers; do not advertise as production): Keep infrastructure and hardware targets as documentation until the required access and measurement environment exist. _(исходный статус: OPEN; строка 194)_
- [ ] **V016-186** **V016-186** (строка 186; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-AGENT-004 — Small helper model:** design plus synthetic RU/EN/TH response/latency smoke harness (`gateway/evals/run_local_model_benchmark.py`); Gateway Tests passed on PR #123 code head. Target-host quality/RAM/PSS/cold-warm benchmark and model selection remain pending. No general helper/subagent dispatch is wired into runtime. _(исходный статус: PARTIAL; строка 195)_
- [ ] **V016-187** **V016-187** (строка 187; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-IMAGE-001 — Image generation:** no working image-generation UI/runtime exists yet. Select local ComfyUI or explicit external provider, verify exact checkpoint/license/hash/VRAM and add request-to-image E2E before marking implemented. _(исходный статус: OPEN; строка 196)_
- [ ] **V016-188** **V016-188** (строка 188; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-OPS-001 — Free-first month:** no automatic paid resource provisioning. Use existing hardware and optional free-tier APIs with explicit quota/privacy caveats; paid hosting only after benchmark and owner decision. _(исходный статус: OPEN; строка 197)_
- [ ] **V016-189** **V016-189** (строка 189; Supplement: product work after the original V-016 checklist (not part of its original 81 items)): **AI-MODEL-001 — Local-model autonomy:** no hidden application-level refusal filter is planned. Actual refusals remain checkpoint/provider-dependent; do not claim guaranteed zero refusals. _(исходный статус: OPEN; строка 198)_
- [ ] **V016-198** **V016-198** (строка 198; Supplement — legacy mobile and interface request, 2026-10-29): Native iPhone Safari, software keyboard, edge-swipe and touchcancel behavior remain unverified. Do not mark complete based only on Chromium. _(исходный статус: OPEN; строка 199)_
- [ ] **V016-206** **V016-206** (строка 206; Supplement — consolidated interface closure, 2026-10-30): Native iPhone Safari keyboard/safe-area/focus and real touch interaction remain unverified. Provider credentials, live gateway, connector OAuth/sync, independent agent processes and full audio transport remain infrastructure/runtime gates rather than UI acceptance claims. _(исходный статус: OPEN; строка 200)_
- [ ] **V016-213** **V016-213** (строка 213; Supplement — sidebar hierarchy and preference synchronization, 2026-10-30): Real iPhone Safari keyboard/touch/accessibility behavior remains unverified; Chromium tests cover DOM order, live status updates and cross-surface preference synchronization only. _(исходный статус: OPEN; строка 201)_
- [ ] **V016-218** **V016-218** (строка 218; Supplement — orthogonal chat settings, 2026-10-30): Exact-head tests must pass for Quick+Expanded, Thorough+Standard, Thorough+Off, RU/EN, per-chat persistence and Research Studio non-mutation before merge. _(исходный статус: OPEN; строка 202)_
- [ ] **V016-219** **V016-219** (строка 219; Supplement — orthogonal chat settings, 2026-10-30): Native iPhone Safari and live gateway/provider behavior remain unverified. _(исходный статус: OPEN; строка 203)_

### MASTER_TASK_REGISTRY_RU.md — LAUNCH — Общий backlog первого запуска
- [ ] **LAUNCH-110** **LAUNCH-110** (строка 110; Автоматические проверки на точном PR HEAD): Integrity: HTML structure, JS parse, immutable Action SHAs. _(исходный статус: OPEN; строка 209)_
- [ ] **LAUNCH-111** **LAUNCH-111** (строка 111; Автоматические проверки на точном PR HEAD): Security: no credentials, safe markdown, safe provider routing and tools. _(исходный статус: OPEN; строка 210)_
- [ ] **LAUNCH-112** **LAUNCH-112** (строка 112; Автоматические проверки на точном PR HEAD): Context: bounded memory/context/tool-loop behavior. _(исходный статус: OPEN; строка 211)_
- [ ] **LAUNCH-113** **LAUNCH-113** (строка 113; Автоматические проверки на точном PR HEAD): Jekyll build: root app and `/landing/` output. _(исходный статус: OPEN; строка 212)_
- [ ] **LAUNCH-114** **LAUNCH-114** (строка 114; Автоматические проверки на точном PR HEAD): Chromium E2E: chat, settings, project, Research Studio, provider state, export/import, landing. _(исходный статус: OPEN; строка 213)_
- [ ] **LAUNCH-115** **LAUNCH-115** (строка 115; Автоматические проверки на точном PR HEAD): Landing responsive sweep: 320, 360, 390, 768, 1024, 1440 CSS px; no horizontal overflow. _(исходный статус: OPEN; строка 214)_
- [ ] **LAUNCH-116** **LAUNCH-116** (строка 116; Автоматические проверки на точном PR HEAD): Landing SEO/link checks: `lang`, title, description, canonical, CTA and relative paths. _(исходный статус: OPEN; строка 215)_
- [ ] **LAUNCH-117** **LAUNCH-117** (строка 117; Автоматические проверки на точном PR HEAD): Reduced-motion behavior: ticker static when OS requests reduced motion; no fake progress. _(исходный статус: OPEN; строка 216)_
- [ ] **LAUNCH-118** **LAUNCH-118** (строка 118; Автоматические проверки на точном PR HEAD): Gateway contract/security tests on PRs that touch gateway. _(исходный статус: OPEN; строка 217)_
- [ ] **LAUNCH-119** **LAUNCH-119** (строка 119; Автоматические проверки на точном PR HEAD): Project State Freshness exact SHA + exact live queue. _(исходный статус: OPEN; строка 218)_
- [ ] **LAUNCH-120** **LAUNCH-120** (строка 120; Автоматические проверки на точном PR HEAD): License/provenance check. _(исходный статус: OPEN; строка 219)_
- [ ] **LAUNCH-121** **LAUNCH-121** (строка 121; Автоматические проверки на точном PR HEAD): Graphify is developer-only artifact; inspect quality and do not ship to runtime. _(исходный статус: OPEN; строка 220)_
- [ ] **LAUNCH-122** **LAUNCH-122** (строка 122; Автоматические проверки на точном PR HEAD): After merge: post-merge Pages deployment and actual published-site smoke. _(исходный статус: OPEN; строка 221)_
- [ ] **LAUNCH-126** **LAUNCH-126** (строка 126; Ручные/owner gates): Native iPhone Safari: keyboard, safe area, focus, VoiceOver, touch, rotation, 320–390 width. _(исходный статус: OPEN; строка 222)_
- [ ] **LAUNCH-127** **LAUNCH-127** (строка 127; Ручные/owner gates): GitHub branch rules and required checks inspected in repository settings. _(исходный статус: OPEN; строка 223)_
- [ ] **LAUNCH-128** **LAUNCH-128** (строка 128; Ручные/owner gates): VPS inventory before any installation or reconfiguration; do not replace existing services blindly. _(исходный статус: OPEN; строка 224)_
- [ ] **LAUNCH-129** **LAUNCH-129** (строка 129; Ручные/owner gates): Ollama model tag, digest, license, disk/RAM/PSS, cold/warm timings and concurrency=1 recorded. _(исходный статус: OPEN; строка 225)_
- [ ] **LAUNCH-130** **LAUNCH-130** (строка 130; Ручные/owner gates): Gateway service listens on loopback; Ollama private on loopback; external origin accessible only through intended HTTPS Tunnel. _(исходный статус: OPEN; строка 226)_
- [ ] **LAUNCH-131** **LAUNCH-131** (строка 131; Ручные/owner gates): Valid/invalid Bearer key, allowlisted model, completion, SSE, cache HIT/BYPASS, timeout and reboot tested. _(исходный статус: OPEN; строка 227)_
- [ ] **LAUNCH-132** **LAUNCH-132** (строка 132; Ручные/owner gates): No prompt, user file/media body, secret or private memory in logs/traces/artifacts by default. _(исходный статус: OPEN; строка 228)_
- [ ] **LAUNCH-133** **LAUNCH-133** (строка 133; Ручные/owner gates): Owner has confirmed whether the first deployment is personal/limited access; never imply public multi-user auth. _(исходный статус: OPEN; строка 229)_
- [ ] **LAUNCH-218** **LAUNCH-218** (строка 218; Порядок после PR #121/#122): Завершить visual screenshot-review, native iPhone Safari, keyboard/safe-area, VoiceOver и touch checks. _(исходный статус: OPEN; строка 231)_
- [ ] **LAUNCH-219** **LAUNCH-219** (строка 219; Порядок после PR #121/#122): Закрыть только оставшиеся polish/security/reliability задачи внутри текущего стека; не добавлять новые продуктовые функции в первый лендинг. _(исходный статус: OPEN; строка 232)_
- [ ] **LAUNCH-220** **LAUNCH-220** (строка 220; Порядок после PR #121/#122): Owner gates issue #111: main ruleset, VPS/Tunnel/Ollama, provider credentials, hardware/model benchmark, RAG corpus, voice/device, sandbox и OAuth. Закрывать только после фактического evidence. _(исходный статус: OPEN; строка 233)_
- [ ] **LAUNCH-221** **LAUNCH-221** (строка 221; Порядок после PR #121/#122): Будущие функции (voice expansion, helper registry, durable multi-agent runtime, Knowledge-to-Skill) оставить в отдельном post-landing backlog; не считать блокером публикации статического лендинга V1. _(исходный статус: OPEN; строка 234)_
- [ ] **LAUNCH-239** **LAUNCH-239** (строка 239; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-13. Editable speech-to-text:** запись с микрофона, локальная транскрипция, редактирование распознанного текста до отправки, RU/EN/TH quality tests. _(исходный статус: OPEN; строка 235)_
- [ ] **LAUNCH-240** **LAUNCH-240** (строка 240; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-14. Conversational voice assistant:** полноценный естественный turn-taking, streaming transcript/response, VAD, barge-in, cancellation, echo cancellation, transcript alignment. Текущий half-duplex prototype — только основа, не завершённая функция. _(исходный статус: OPEN; строка 236)_
- [ ] **LAUNCH-241** **LAUNCH-241** (строка 241; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-15. Read selected text aloud:** выделение произвольного фрагмента ответа/сообщения и озвучивание только выделенного содержимого. PR #152 closed non-merged on 2026-11-07; bounded speech queue + selected-text playback remain unimplemented/unaccepted. Revisit after PR #173 restores main Quality; adapt E2E to explicit aServi connect/provider isolation, verify cancellation/queue limits/device behavior and target-device RU/EN/TH acceptance before promotion. _(исходный статус: OPEN; строка 237)_
- [ ] **LAUNCH-242** **LAUNCH-242** (строка 242; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-16. Read one whole message aloud:** стабильный TTS для целого сообщения, voice choice, mini-player, pause/resume/stop, cleanup and stale-request protection. _(исходный статус: OPEN; строка 238)_
- [ ] **LAUNCH-243** **LAUNCH-243** (строка 243; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-17. Read multiple selected messages aloud:** multi-select messages, ordered playback queue, pause/resume/skip/stop, cancellation and queue state; no parallel Piper jobs. _(исходный статус: OPEN; строка 239)_
- [ ] **LAUNCH-244** **LAUNCH-244** (строка 244; Future post-landing requirements — voice (not part of the frozen landing V1)): **P0-18. First-release voice acceptance:** реальные microphone/speaker tests на целевых устройствах; RU/EN/TH; word error rate, first transcript latency, first audio latency, interruption latency, echo, CPU/GPU/RAM, model license and SHA-256. Без этого не обещать «почти человеческий» realtime. _(исходный статус: OPEN; строка 240)_
- [ ] **LAUNCH-247** **LAUNCH-247** (строка 247; P1 — small helper models, GPU inference and agent orchestration): **P1-10. Helper model registry:** специализированные роли (classification, extraction, rerank, summary, memory candidate, skill synthesis), exact model ID/digest/license, capability, context/token budget, timeout, concurrency and eval. _(исходный статус: OPEN; строка 241)_
- [ ] **LAUNCH-248** **LAUNCH-248** (строка 248; P1 — small helper models, GPU inference and agent orchestration): **P1-11. GPU inference profile:** Ollama GPU vs llama.cpp server benchmark; GPU-only inference mode must fail closed if no compatible GPU is detected. CPU still runs OS/API/orchestration; the requirement is no mandatory CPU model inference, not zero CPU usage for the whole host. _(исходный статус: OPEN; строка 242)_
- [ ] **LAUNCH-249** **LAUNCH-249** (строка 249; P1 — small helper models, GPU inference and agent orchestration): **P1-12. High-throughput optional serving:** evaluate vLLM only on compatible accelerator hardware and when continuous batching/throughput materially helps. It is not the default 8-GB/single-model deployment. _(исходный статус: OPEN; строка 243)_
- [ ] **LAUNCH-250** **LAUNCH-250** (строка 250; P1 — small helper models, GPU inference and agent orchestration): **P1-13. Multi-agent runtime:** bounded DAG/fan-out, queue/backpressure, per-agent scope/permissions, deadline, budget, cancellation propagation, idempotency, checkpoints, traces, retries and eval harness. Current four-stage research pipeline is not a swarm. _(исходный статус: OPEN; строка 244)_
- [ ] **LAUNCH-251** **LAUNCH-251** (строка 251; P1 — small helper models, GPU inference and agent orchestration): **P1-14. Mass-agent load test:** establish safe concurrency, VRAM admission, memory residency/eviction, fairness, queue limits and degraded-mode behavior before increasing agent count. _(исходный статус: OPEN; строка 245)_
- [ ] **LAUNCH-254** **LAUNCH-254** (строка 254; P1 — internal notebook / Knowledge-to-Skill): **P1-15. Knowledge-to-Skill pipeline:** authorized books, PDFs, office documents, websites and repo sources → bounded extraction → chapters/sections → source/page provenance → skill generation → injection/license scan → human review → versioned private skill. _(исходный статус: OPEN; строка 246)_
- [ ] **LAUNCH-255** **LAUNCH-255** (строка 255; P1 — internal notebook / Knowledge-to-Skill): **P1-16. Skill lifecycle:** schema validation, scope isolation (personal/project), diff, versioning, rollback, deletion/retention and import/export. _(исходный статус: OPEN; строка 247)_
- [ ] **LAUNCH-256** **LAUNCH-256** (строка 256; P1 — internal notebook / Knowledge-to-Skill): **P1-17. Safe ingestion:** MIME sniffing, archive/path traversal defense, XXE/bomb limits, parser timeout, temp cleanup, invisible Unicode scan, prompt injection scan and no automatic external provider fallback. _(исходный статус: OPEN; строка 248)_
- [ ] **LAUNCH-269** **LAUNCH-269** (строка 269; 8. Остаток landing/app polish из актуального main): Скриншоты и визуальная проверка landing на 320/360/390/768/1024/1440 px; hero, карточки, CTA, spacing, contrast, footer. _(исходный статус: OPEN; строка 249)_
- [ ] **LAUNCH-270** **LAUNCH-270** (строка 270; 8. Остаток landing/app polish из актуального main): Keyboard-only и screen-reader проверка трёх раскрываемых roadmap секций и pause controls. _(исходный статус: OPEN; строка 250)_
- [ ] **LAUNCH-272** **LAUNCH-272** (строка 272; 8. Остаток landing/app polish из актуального main): App screenshot pass desktop/mobile; typography, contrast, spacing, empty/error states, RU/EN, light/dark. _(исходный статус: OPEN; строка 252)_
- [ ] **LAUNCH-273** **LAUNCH-273** (строка 273; 8. Остаток landing/app polish из актуального main): Все composer popovers на краях viewport, коротком viewport, с клавиатурой и nested scroll. _(исходный статус: OPEN; строка 253)_
- [ ] **LAUNCH-274** **LAUNCH-274** (строка 274; 8. Остаток landing/app polish из актуального main): Dialog Escape/focus trap/return/scroll lock/background inert; sticky Settings actions. **Progress 2026-11-08 / PR #174:** Functions panel now receives focus on open, traps Tab/Shift+Tab, closes on Escape/backdrop and restores focus to its trigger; Settings and Functions backdrop dismissal have dedicated E2E coverage. Exact-head CI pending. Remaining: bring Settings/project/trace/message dialogs onto the same tested focus-return/trap contract, verify background inert + body scroll lock, and implement sticky Settings actions. _(исходный статус: PARTIAL; строка 254)_
- [ ] **LAUNCH-275** **LAUNCH-275** (строка 275; 8. Остаток landing/app polish из актуального main): Проверка дублирования chat import/export и project bundle actions. _(исходный статус: OPEN; строка 255)_
- [ ] **LAUNCH-276** **LAUNCH-276** (строка 276; 8. Остаток landing/app polish из актуального main): Long names, large lists, keyboard navigation, 44px touch targets. _(исходный статус: OPEN; строка 256)_
- [ ] **LAUNCH-277** **LAUNCH-277** (строка 277; 8. Остаток landing/app polish из актуального main): Functional menu отражает только реально зарегистрированные skills/agents/connectors and permissions. _(исходный статус: OPEN; строка 257)_
- [ ] **LAUNCH-279** **LAUNCH-279** (строка 279; 8. Остаток landing/app polish из актуального main): Keep Native Popover API/CSS Anchor Positioning progressive enhancement only; preserve JS fallback. _(исходный статус: OPEN; строка 259)_

### MASTER_TASK_REGISTRY_RU.md — V1 — Канонический чек-лист V1 UI
- [ ] **V1-047** **V1-047** (строка 47; 1. Общий UI/UX — [~]): Завершить проход по типографике, контрасту, spacing, пустым состояниям, ошибкам и вторичным действиям. _(исходный статус: PARTIAL; строка 265)_
- [ ] **V1-048** **V1-048** (строка 48; 1. Общий UI/UX — [~]): Пройти финальный визуальный screenshot-review desktop/mobile после всех изменений. _(исходный статус: OPEN; строка 266)_
- [ ] **V1-055** **V1-055** (строка 55; 2. Composer и мобильная клавиатура — [~]): Сохранена настраиваемая top/bottom позиция (PR #119/#121 track), но перепроверить её влияние на мобильные viewport и scroll. _(исходный статус: PARTIAL; строка 267)_
- [ ] **V1-056** **V1-056** (строка 56; 2. Composer и мобильная клавиатура — [~]): Нативно проверить iPhone Safari: клавиатура, safe-area, focus, долгий текст, свайпы от края, ориентация экрана. _(исходный статус: OPEN; строка 268)_
- [ ] **V1-063** **V1-063** (строка 63; 3. Маршруты aLandi и сторонних API — [~]): В PR #121 унаследованный внутренний alandi option остаётся скрытым для миграции/совместимости. Тест должен подтверждать, что он hidden и не попадает в optgroup сторонних API; нельзя требовать его полного отсутствия в HTML. **Актуализация 2026-11-08:** first-party route label/actions — aLandi aServi; `alandi` и `ai_alandi_cloud_*` remain internal compatibility identifiers. PR #169 merged provider isolation and hidden internal option; exact PR Quality passed. PR #171 closed non-merged; no silent fallback remains. Compatibility migration still requires acceptance. _(исходный статус: PARTIAL; строка 269)_
- [ ] **V1-064** **V1-064** (строка 64; 3. Маршруты aLandi и сторонних API — [~]): Проверить RU/EN labels, переключение и миграцию сохранённого маршрута на текущем head. **Progress:** PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`, adds explicit aServi connection action and provider isolation; exact PR Quality #42408172737 passed 113/113. Main Quality #42408500881 exposed two E2E failures; follow-up PR #173 code/test Quality #42408845013 passed 113/113 and Graphify #42408844985 passed. English-label and legacy saved-route migration acceptance remain open. _(исходный статус: OPEN; строка 270)_
- [ ] **V1-071** **V1-071** (строка 71; 4. Подписи, placeholder и inline validation — [~]): Завершить единый язык placeholder/error/help для внешних API, Cloudflare и Tavily; постоянный текст оставлять только там, где он несёт важную privacy/security информацию. _(исходный статус: PARTIAL; строка 271)_
- [ ] **V1-072** **V1-072** (строка 72; 4. Подписи, placeholder и inline validation — [~]): Проверить ошибки invalid URL, неверной модели, пустого ключа, CORS, HTTP 401/5xx и корректность redaction секретов. _(исходный статус: OPEN; строка 272)_
- [ ] **V1-080** **V1-080** (строка 80; 5. System prompt и случайное редактирование — [x]): В итоговом визуальном проходе подтвердить заметность pencil/edit, focus и возврат в readonly. _(исходный статус: OPEN; строка 273)_
- [ ] **V1-086** **V1-086** (строка 86; 6. Инструкции сторонних провайдеров — [~]): Удалить повторяющиеся provider explanations, но оставить короткие честные privacy notices там, где данные уходят внешнему оператору. _(исходный статус: PARTIAL; строка 274)_
- [ ] **V1-087** **V1-087** (строка 87; 6. Инструкции сторонних провайдеров — [~]): Сверить каждую ссылку/инструкцию с актуальным upstream, не выдумывать endpoint или модельный ID. _(исходный статус: OPEN; строка 275)_
- [ ] **V1-093** **V1-093** (строка 93; 7. Tools и Tavily — [~]): Автоматическая проверка/индикатор ключа должна быть подтверждена реальным вызовом, не только непустым полем. _(исходный статус: PARTIAL; строка 276)_
- [ ] **V1-094** **V1-094** (строка 94; 7. Tools и Tavily — [~]): Проверить paste, сохранение, удаление, неверный ключ, публичные fallback источники, privacy copy. _(исходный статус: OPEN; строка 277)_
- [ ] **V1-101** **V1-101** (строка 101; 8. Статус собственного gateway — [~]): В PR #121 убрана постоянная ручная кнопка проверки; поля/лампа должны отражать валидированное соединение. _(исходный статус: PARTIAL; строка 278)_
- [ ] **V1-102** **V1-102** (строка 102; 8. Статус собственного gateway — [~]): Проверить race/stale response, /healthz, model completion, timeout, CORS и очистку ключа на exact head. _(исходный статус: OPEN; строка 279)_
- [ ] **V1-110** **V1-110** (строка 110; 9. Окна и закреплённые действия — [~]): Проверить Escape, focus return, screen reader name, scroll lock и background interaction. _(исходный статус: OPEN; строка 280)_
- [ ] **V1-116** **V1-116** (строка 116; 10. Скроллинг и длинные чаты — [~]): Проверить потоковую генерацию, вложенные скроллы, длинные сообщения/вложения, чат-список и модальные окна. _(исходный статус: PARTIAL; строка 281)_
- [ ] **V1-117** **V1-117** (строка 117; 10. Скроллинг и длинные чаты — [~]): Проверить экран 320px, динамическую клавиатуру и scroll restoration на iOS Safari. _(исходный статус: OPEN; строка 282)_
- [ ] **V1-125** **V1-125** (строка 125; 11. Дополнительные настройки — [x]): Завершить аудит всех secondary controls на дубли/устаревшие toggle. _(исходный статус: OPEN; строка 283)_
- [ ] **V1-133** **V1-133** (строка 133; 12. Тема, язык, анимации — [~]): Проверить полную RU/EN копию, светлую тему модалок, статусов, подсказок и Roadmap. _(исходный статус: OPEN; строка 284)_
- [ ] **V1-139** **V1-139** (строка 139; 13. Каталог моделей и provider state — [~]): Проверить сохранение выбранной модели при refresh, invalid catalog, устаревший fingerprint, auth failure и provider switch. _(исходный статус: PARTIAL; строка 285)_
- [ ] **V1-140** **V1-140** (строка 140; 13. Каталог моделей и provider state — [~]): Live provider smoke остаётся опциональным и требует явного согласия; mock E2E не выдавать за доступность реального аккаунта. _(исходный статус: OPEN; строка 286)_
- [ ] **V1-147** **V1-147** (строка 147; 14. Project settings — [~]): В PR #121 E2E должен подтвердить modal close, persistence, создание и переключение проекта после текущих исправлений. _(исходный статус: PARTIAL; строка 287)_
- [ ] **V1-148** **V1-148** (строка 148; 14. Project settings — [~]): Реальный multi-device sync/source indexing не входит в V1; не изображать его включённым. _(исходный статус: OPEN; строка 288)_
- [ ] **V1-156** **V1-156** (строка 156; 15. Search & Research Studio — [~]): Исследовательский pipeline остаётся четырёхэтапным на одной модели; UI не называть независимой swarm-командой. _(исходный статус: OPEN; строка 291)_
- [ ] **V1-163** **V1-163** (строка 163; 16. Task profiles / skills — [~]): Проверить quiz flow, кастомный профиль, формат результата, переключение чата и сохранение. _(исходный статус: PARTIAL; строка 292)_
- [ ] **V1-164** **V1-164** (строка 164; 16. Task profiles / skills — [~]): Не показывать несуществующие навыки как доступные runtime-пакеты. _(исходный статус: OPEN; строка 293)_
- [ ] **V1-171** **V1-171** (строка 171; 17. Agents / team blueprint — [~]): Внутри соответствующей открытой панели добавлен декоративный маркер 1nv3nt10n 1n PrOc3ss… с пояснением, что это не runtime/фоновой статус. _(исходный статус: PARTIAL; строка 294)_
- [ ] **V1-172** **V1-172** (строка 172; 17. Agents / team blueprint — [~]): Независимые роли, scheduler, policy engine, sandbox, approval и durable recovery — будущая реализация с отдельными tests/evals; не входят в V1. _(исходный статус: OPEN; строка 295)_
- [ ] **V1-178** **V1-178** (строка 178; 18. Финальный release gate — [~]): PR #121 был красным: duplicate settings close selectors, invalid regex in integrity sentinel и один неверный assertion around settings probe. Исправления внесены; повторный exact-head CI нужен. _(исходный статус: PARTIAL; строка 296)_
- [ ] **V1-179** **V1-179** (строка 179; 18. Финальный release gate — [~]): Проверить точный merge SHA, post-merge Pages deploy, опубликованный лендинг и приложение. _(исходный статус: OPEN; строка 297)_
- [ ] **V1-180** **V1-180** (строка 180; 18. Финальный release gate — [~]): Выполнить native iPhone Safari/keyboard/touch test вручную. _(исходный статус: OPEN; строка 298)_
- [ ] **V1-181** **V1-181** (строка 181; 18. Финальный release gate — [~]): Пересверить PR/Issues. Issue #111 остаётся открытым до реальных owner-only gates (ruleset/main governance, VPS, hardware/model, voice/device, licensed data corpus); не закрывать только ради нулевой очереди. _(исходный статус: OPEN; строка 299)_
- [ ] **V1-191** **V1-191** (строка 191; 2. Лендинг — обязательная структура V1): Усилить copy: «бесплатный статический интерфейс» не означает «бесплатный inference», hosted AI endpoint не предоставляется. _(исходный статус: PARTIAL; строка 300)_
- [ ] **V1-192** **V1-192** (строка 192; 2. Лендинг — обязательная структура V1): Добавить открываемый Roadmap с маркером 1nv3nt10n 1n PrOc3ss… только у направлений, которые ещё разрабатываются/планируются. _(исходный статус: PARTIAL; строка 301)_
- [ ] **V1-193** **V1-193** (строка 193; 2. Лендинг — обязательная структура V1): Browser E2E на структуру/CTA, метаданные, отсутствие пустых ссылок, responsive 320/360/390/768/1024/1440px, Roadmap details и reduced-motion есть; добавлен тест pause/resume ticker (commit b213c8a); ожидается exact-head Chromium run. _(исходный статус: PARTIAL; строка 302)_
- [ ] **V1-194** **V1-194** (строка 194; 2. Лендинг — обязательная структура V1): E2E проверяет lang/title/description/canonical/CTA/непустые ссылки; Jekyll build проходит в текущем CI; фактический published Pages path требует успешного exact-head smoke после merge. _(исходный статус: PARTIAL; строка 303)_

### MASTER_TASK_REGISTRY_RU.md — UX — Полировка лендинга
- [ ] **UX-016** **UX-016** (строка 16; Landing / публичная страница): Screenshot review 320/360/390/768/1024/1440 px: hero balance, card rhythm, line lengths, section spacing, contrast, footer and CTA. _(исходный статус: OPEN; строка 309)_
- [ ] **UX-017** **UX-017** (строка 17; Landing / публичная страница): Проверить keyboard-only и screen reader чтение всех трёх раскрываемых roadmap пунктов и pause controls. _(исходный статус: OPEN; строка 310)_
- [ ] **UX-018** **UX-018** (строка 18; Landing / публичная страница): Проверить опубликованный Pages, а не только PR preview/Jekyll build; ссылки и canonical после merge. _(исходный статус: OPEN; строка 311)_
- [ ] **UX-019** **UX-019** (строка 19; Landing / публичная страница): Проверить светлую/тёмную тему? Landing сейчас намеренно самостоятельная тёмная публичная страница; не добавлять переключатель без требования и цельного дизайна. _(исходный статус: OPEN; строка 312)_
- [ ] **UX-023** **UX-023** (строка 23; Корневое приложение — визуальная иерархия): Общий screenshot review desktop/mobile после последнего PR #121. _(исходный статус: PARTIAL; строка 313)_
- [ ] **UX-024** **UX-024** (строка 24; Корневое приложение — визуальная иерархия): Единый проход по typography, contrast, spacing, empty states, inline errors и secondary actions. _(исходный статус: OPEN; строка 314)_
- [ ] **UX-025** **UX-025** (строка 25; Корневое приложение — визуальная иерархия): Полная RU/EN проверка микротекстов, подсказок, статусов, светлой темы модалок и пустых состояний. _(исходный статус: OPEN; строка 315)_
- [ ] **UX-026** **UX-026** (строка 26; Корневое приложение — визуальная иерархия): Проверить pencil/edit state у system prompt и возврат в readonly. _(исходный статус: OPEN; строка 316)_
- [ ] **UX-027** **UX-027** (строка 27; Корневое приложение — визуальная иерархия): Проверить touch targets (проектная цель 44×44 CSS px) и отсутствие конкурирующих controls. _(исходный статус: OPEN; строка 317)_
- [ ] **UX-031** **UX-031** (строка 31; Popovers, menus, dialogs): Проверить все composer popovers у четырёх краёв viewport, короткую высоту, экранную клавиатуру и nested scroll. _(исходный статус: PARTIAL; строка 318)_
- [ ] **UX-032** **UX-032** (строка 32; Popovers, menus, dialogs): Проверить Escape, focus trap/return, accessible names, scroll lock и background inert для всех modal/dialog. _(исходный статус: OPEN; строка 319)_
- [ ] **UX-033** **UX-033** (строка 33; Popovers, menus, dialogs): Sticky Save/Close в Settings при длинном scroll и мобильной клавиатуре — проверить, исправить только при воспроизводимом дефекте. _(исходный статус: OPEN; строка 320)_
- [ ] **UX-034** **UX-034** (строка 34; Popovers, menus, dialogs): Native Popover API / CSS Anchor Positioning рассматривать только как progressive enhancement после support matrix; сохранить существующий JS fallback. Не мигрировать ради моды. _(исходный статус: OPEN; строка 321)_
- [ ] **UX-039** **UX-039** (строка 39; Sidebar, проекты, чаты): Проверить, что общий импорт/экспорт не дублируется в sidebar и project settings; chat actions остаются в chat menu, project bundle — в project settings. _(исходный статус: PARTIAL; строка 322)_
- [ ] **UX-040** **UX-040** (строка 40; Sidebar, проекты, чаты): CORE IMPLEMENTED / VERIFIED на exact main `bc6cee08c3d28fec3a6ac4d61019d958f92ba779`: выбранный проект фильтрует `#chatList`, Back возвращает общий список, persistent New Chat создаёт чат с выбранным `projectId`, навигационный фильтр не меняет активный чат/его принадлежность. Exact Quality #43998698846: 140 built-app Chromium + 1 published-site Chromium passed; Graphify #43998698805 и Pages #43998698607 passed, опубликованный revision exact. Проверены RU/EN project/personal header scope labels и 390px no-overflow/long project name. **PARTIAL** до проверки длинных/пустых/больших списков, keyboard navigation, scroll restoration и native iPhone Safari. _(исходный статус: OPEN; строка 323)_
- [ ] **UX-044** **UX-044** (строка 44; Research / functions / agents): The broad registered-capability/status/permission contract and connector registry remain unimplemented; the owner-directed three-entry Functions subset is delivered in PR #169 (exact PR Quality passed). No fake marketplace. _(исходный статус: OPEN; строка 324)_
- [ ] **UX-045** **UX-045** (строка 45; Research / functions / agents): Развести семантику web search breadth, offline mode и multi-agent orchestration в copy и UI. _(исходный статус: OPEN; строка 325)_
- [ ] **UX-046** **UX-046** (строка 46; Research / functions / agents): В roadmap/agent panels сохранять чёткое различие между blueprint, sequential pipeline и независимым agent runtime. _(исходный статус: OPEN; строка 326)_
- [ ] **UX-049** **UX-049** (строка 49; Мобильность и доступность): Chromium responsive matrix 320/360/390/768/1024/1440 и no-overflow tests. _(исходный статус: PARTIAL; строка 327)_
- [ ] **UX-050** **UX-050** (строка 50; Мобильность и доступность): Native iPhone Safari: visual viewport, клавиатура, safe-area, edge swipe, touchcancel, rotation, scroll restoration. _(исходный статус: OPEN; строка 328)_
- [ ] **UX-051** **UX-051** (строка 51; Мобильность и доступность): VoiceOver: headings, dialogs, menus, status text, message actions, focus visibility. _(исходный статус: OPEN; строка 329)_
- [ ] **UX-052** **UX-052** (строка 52; Мобильность и доступность): Reduced motion: landing ticker, app ticker, transitions and scroll behavior; проверить пользовательскую настройку вместе с OS preference. _(исходный статус: OPEN; строка 330)_
- [ ] **UX-068** **UX-068** (строка 68; 3. Реализованный первый polish patch): Native keyboard/screen-reader confirmation. _(исходный статус: OPEN; строка 331)_

### MASTER_TASK_REGISTRY_RU.md — STACK — Сквозной аудит целостности стека
- [ ] **STACK-031** **STACK-031** (строка 31; A. Снимок и архитектурная карта): A3. Сверить все принятые решения (DECISIONS/ADRs/PROJECT_STATE) с реализованными модулями и флагами. _(исходный статус: OPEN; строка 337)_
- [ ] **STACK-032** **STACK-032** (строка 32; A. Снимок и архитектурная карта): A4. Построить карту модулей, входов/выходов, владельцев данных и межслойных контрактов. _(исходный статус: OPEN; строка 338)_
- [ ] **STACK-033** **STACK-033** (строка 33; A. Снимок и архитектурная карта): A5. Проверить циклы, дублирующие реализации, orphan modules, скрытые/неиспользуемые пути. _(исходный статус: OPEN; строка 339)_
- [ ] **STACK-036** **STACK-036** (строка 36; B. Сквозные взаимодействия): B1. Browser UI → request construction → provider/router → gateway → model/tool → response rendering. _(исходный статус: OPEN; строка 340)_
- [ ] **STACK-037** **STACK-037** (строка 37; B. Сквозные взаимодействия): B2. Identity/session/auth → scopes/permissions → memory/RAG → persistence/deletion. _(исходный статус: OPEN; строка 341)_
- [ ] **STACK-038** **STACK-038** (строка 38; B. Сквозные взаимодействия): B3. Search/research/evidence → citations/provenance → UI state and failure handling. _(исходный статус: OPEN; строка 342)_
- [ ] **STACK-039** **STACK-039** (строка 39; B. Сквозные взаимодействия): B4. Agents/ToolDAG/helper model → budgets, deadlines, cancellation, retries, approvals, idempotency. _(исходный статус: OPEN; строка 343)_
- [ ] **STACK-040** **STACK-040** (строка 40; B. Сквозные взаимодействия): B5. Voice/ASR/TTS/document extraction → child processes, resource bounds, cancellation, cleanup. _(исходный статус: OPEN; строка 344)_
- [ ] **STACK-041** **STACK-041** (строка 41; B. Сквозные взаимодействия): B6. Config/env/feature flags → startup/readiness/liveness → deploy and rollback. _(исходный статус: OPEN; строка 345)_
- [ ] **STACK-042** **STACK-042** (строка 42; B. Сквозные взаимодействия): B7. Browser storage ↔ server persistence, import/export, cross-project/private/shared boundaries. _(исходный статус: OPEN; строка 346)_
- [ ] **STACK-045** **STACK-045** (строка 45; C. Качество и безопасность): C1. Static analysis: Python typing/lint/security; JS syntax/lint/security; shell/YAML/config validation. _(исходный статус: OPEN; строка 347)_
- [ ] **STACK-046** **STACK-046** (строка 46; C. Качество и безопасность): C2. Dependency and supply-chain audit: direct/transitive dependencies, immutable action pins, licenses/provenance. _(исходный статус: OPEN; строка 348)_
- [ ] **STACK-047** **STACK-047** (строка 47; C. Качество и безопасность): C3. Security review: auth, CORS, SSRF, XML/ZIP parsing, path traversal, secrets/logging, prompt/tool injection. _(исходный статус: OPEN; строка 349)_
- [ ] **STACK-048** **STACK-048** (строка 48; C. Качество и безопасность): C4. Reliability: timeouts, cancellation, backpressure, concurrency, retries, partial failure, state recovery. _(исходный статус: OPEN; строка 350)_
- [ ] **STACK-049** **STACK-049** (строка 49; C. Качество и безопасность): C5. Performance/resource: payload sizes, browser work, DB indexes/queries, model memory/latency, process lifecycle. _(исходный статус: OPEN; строка 351)_
- [ ] **STACK-050** **STACK-050** (строка 50; C. Качество и безопасность): C6. Accessibility/i18n/responsive and degraded/offline/error states. _(исходный статус: OPEN; строка 352)_
- [ ] **STACK-051** **STACK-051** (строка 51; C. Качество и безопасность): C7. Test quality: coverage of boundaries and failure paths; detect duplicate, brittle or vacuous assertions. _(исходный статус: OPEN; строка 353)_
- [ ] **STACK-052** **STACK-052** (строка 52; C. Качество и безопасность): C8. Re-run all relevant exact-head checks after any accepted change. _(исходный статус: OPEN; строка 354)_
- [ ] **STACK-055** **STACK-055** (строка 55; D. Независимый второй взгляд и решение): D1. Подготовить независимому субагенту полный стек, решения, invariants, audit questions and output format. _(исходный статус: OPEN; строка 355)_
- [ ] **STACK-056** **STACK-056** (строка 56; D. Независимый второй взгляд и решение): D2. Получить реальный независимый review (если host предоставляет субагента); иначе честно зафиксировать отсутствие отдельного агента. _(исходный статус: OPEN; строка 356)_
- [ ] **STACK-057** **STACK-057** (строка 57; D. Независимый второй взгляд и решение): D3. Сопоставить рекомендации с локальными решениями и воспроизводимыми доказательствами. _(исходный статус: OPEN; строка 357)_
- [ ] **STACK-058** **STACK-058** (строка 58; D. Независимый второй взгляд и решение): D4. Отобрать только улучшения с измеримой пользой и без расширения стека. _(исходный статус: OPEN; строка 358)_
- [ ] **STACK-059** **STACK-059** (строка 59; D. Независимый второй взгляд и решение): D5. Внести минимальные обратимые исправления отдельными slices/PR. _(исходный статус: OPEN; строка 359)_
- [ ] **STACK-060** **STACK-060** (строка 60; D. Независимый второй взгляд и решение): D6. Обновить ориентиры, project state, decision/eval records и volley log после каждого подтверждённого этапа. _(исходный статус: OPEN; строка 360)_

### MASTER_TASK_REGISTRY_RU.md — START — `docs/START_HERE_RU.md`
- [ ] **START-054** **START-054** (строка 54; `docs/START_HERE_RU.md`): Pages deployment успешен, сайт открывается. _(исходный статус: OPEN; строка 371)_
- [ ] **START-055** **START-055** (строка 55; `docs/START_HERE_RU.md`): VPS: Ollama и gateway активны. _(исходный статус: OPEN; строка 372)_
- [ ] **START-056** **START-056** (строка 56; `docs/START_HERE_RU.md`): Gateway доступен только через Tunnel; публичные порты 8000/11434 закрыты. _(исходный статус: OPEN; строка 373)_
- [ ] **START-057** **START-057** (строка 57; `docs/START_HERE_RU.md`): HTTPS hostname отвечает; неправильный API key получает 401. _(исходный статус: OPEN; строка 374)_
- [ ] **START-058** **START-058** (строка 58; `docs/START_HERE_RU.md`): Из чата проходит реальный completion через gateway. _(исходный статус: OPEN; строка 375)_
- [ ] **START-059** **START-059** (строка 59; `docs/START_HERE_RU.md`): Cache MISS → повтор HIT; bypass действительно обходит cache. _(исходный статус: OPEN; строка 376)_
- [ ] **START-060** **START-060** (строка 60; `docs/START_HERE_RU.md`): После перезагрузки VPS gateway и Tunnel запускаются автоматически. _(исходный статус: OPEN; строка 377)_
- [ ] **START-061** **START-061** (строка 61; `docs/START_HERE_RU.md`): Сохранены backup env/config и инструкции rollback (сам секрет — отдельно и защищённо). _(исходный статус: OPEN; строка 378)_

### MASTER_TASK_REGISTRY_RU.md — PRIVACY — `docs/LAUNCH_PRIVACY_REVIEW_RU.md`
- [ ] **PRIVACY-025** **PRIVACY-025** (строка 25; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Оператор: физическое лицо или юридическое лицо, публичное имя/бренд и юридический адрес, если применимо. _(исходный статус: OPEN; строка 385)_
- [ ] **PRIVACY-026** **PRIVACY-026** (строка 26; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Контакт для запросов на доступ/удаление и вопросов приватности (лучше отдельный адрес поддержки; не выдумывать адрес до его создания). _(исходный статус: OPEN; строка 386)_
- [ ] **PRIVACY-027** **PRIVACY-027** (строка 27; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): География оператора, хостинга, предполагаемых пользователей и целевые страны запуска. _(исходный статус: OPEN; строка 387)_
- [ ] **PRIVACY-028** **PRIVACY-028** (строка 28; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Целевая аудитория и минимальный возраст, если применимо. _(исходный статус: OPEN; строка 388)_
- [ ] **PRIVACY-029** **PRIVACY-029** (строка 29; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Будет ли это личный интерфейс одного владельца, ограниченная beta по приглашениям или публичный многопользовательский продукт. _(исходный статус: OPEN; строка 389)_
- [ ] **PRIVACY-030** **PRIVACY-030** (строка 30; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Реальная схема входа и авторизации: сейчас отдельная multi-user auth система не подтверждена. _(исходный статус: OPEN; строка 390)_
- [ ] **PRIVACY-031** **PRIVACY-031** (строка 31; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Точные домены, hosting providers, Tunnel mode/plan и фактически подключённые внешние AI/search providers. _(исходный статус: OPEN; строка 391)_
- [ ] **PRIVACY-032** **PRIVACY-032** (строка 32; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Какие данные собираются: чаты, выбранный контекст, проекты/инструкции, вложения, provider settings, browser storage, server-side cache, diagnostic logs, billing/support messages. _(исходный статус: OPEN; строка 392)_
- [ ] **PRIVACY-033** **PRIVACY-033** (строка 33; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Retention по каждой категории: browser data, server cache, logs, temporary files, backup copies. Если срок неизвестен, сначала измерить/проверить, а не угадывать. _(исходный статус: OPEN; строка 393)_
- [ ] **PRIVACY-034** **PRIVACY-034** (строка 34; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Реальная политика удаления и экспорта: что удаляется сразу, что остаётся в резервных копиях и когда копии ротируются. _(исходный статус: OPEN; строка 394)_
- [ ] **PRIVACY-035** **PRIVACY-035** (строка 35; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Фактическая обработка Cloudflare/GitHub Pages/VPS и внешнего провайдера: metadata/access logs, location/jurisdiction, applicable terms. _(исходный статус: OPEN; строка 395)_
- [ ] **PRIVACY-036** **PRIVACY-036** (строка 36; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Используются ли analytics, cookies beyond essential browser storage, tracking pixels, telemetry или third-party frontend assets. _(исходный статус: OPEN; строка 396)_
- [ ] **PRIVACY-037** **PRIVACY-037** (строка 37; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Как обрабатываются запросы об удалении, security incident, credential compromise и закрытии аккаунта, если появится account system. _(исходный статус: OPEN; строка 397)_
- [ ] **PRIVACY-038** **PRIVACY-038** (строка 38; `docs/LAUNCH_PRIVACY_REVIEW_RU.md`): Кто отвечает за support и стоимость вычислений; есть ли автоматические биллинговые ограничения/quotas. _(исходный статус: OPEN; строка 398)_

### MASTER_TASK_REGISTRY_RU.md — PRELAUNCH — `docs/PRE_LAUNCH_STACK_RU.md`
- [ ] **PRELAUNCH-070** **PRELAUNCH-070** (строка 70; `docs/PRE_LAUNCH_STACK_RU.md`): Есть доступ к имеющемуся VPS либо подтверждена итоговая цена нового. _(исходный статус: OPEN; строка 405)_
- [ ] **PRELAUNCH-071** **PRELAUNCH-071** (строка 71; `docs/PRE_LAUNCH_STACK_RU.md`): ОС/архитектура совместимы с выбранным runbook. _(исходный статус: OPEN; строка 406)_
- [ ] **PRELAUNCH-072** **PRELAUNCH-072** (строка 72; `docs/PRE_LAUNCH_STACK_RU.md`): Достаточно RAM/диска после учёта уже работающих сервисов и модели. _(исходный статус: OPEN; строка 407)_
- [ ] **PRELAUNCH-073** **PRELAUNCH-073** (строка 73; `docs/PRE_LAUNCH_STACK_RU.md`): Известно, кто имеет SSH/root access и как восстановиться при неудачном обновлении. _(исходный статус: OPEN; строка 408)_
- [ ] **PRELAUNCH-074** **PRELAUNCH-074** (строка 74; `docs/PRE_LAUNCH_STACK_RU.md`): Домен, DNS и план ежемесячных затрат понятны. _(исходный статус: OPEN; строка 409)_
- [ ] **PRELAUNCH-075** **PRELAUNCH-075** (строка 75; `docs/PRE_LAUNCH_STACK_RU.md`): Никакие существующие сервисы не будут удалены/перенастроены без инвентаризации. _(исходный статус: OPEN; строка 410)_
- [ ] **PRELAUNCH-108** **PRELAUNCH-108** (строка 108; `docs/PRE_LAUNCH_STACK_RU.md`): /livez возвращает HTTP 200 без обращения к Ollama. _(исходный статус: OPEN; строка 411)_
- [ ] **PRELAUNCH-109** **PRELAUNCH-109** (строка 109; `docs/PRE_LAUNCH_STACK_RU.md`): /readyz возвращает HTTP 200 при доступной Ollama; `/healthz` — совместимый alias `/readyz`. _(исходный статус: OPEN; строка 412)_
- [ ] **PRELAUNCH-110** **PRELAUNCH-110** (строка 110; `docs/PRE_LAUNCH_STACK_RU.md`): Неавторизованный /v1/models возвращает HTTP 401. _(исходный статус: OPEN; строка 413)_
- [ ] **PRELAUNCH-111** **PRELAUNCH-111** (строка 111; `docs/PRE_LAUNCH_STACK_RU.md`): Авторизованный /v1/models показывает только разрешённую модель. _(исходный статус: OPEN; строка 414)_
- [ ] **PRELAUNCH-112** **PRELAUNCH-112** (строка 112; `docs/PRE_LAUNCH_STACK_RU.md`): Небольшой completion завершается и возвращает модельный ответ. _(исходный статус: OPEN; строка 415)_
- [ ] **PRELAUNCH-113** **PRELAUNCH-113** (строка 113; `docs/PRE_LAUNCH_STACK_RU.md`): Повтор exact-запроса даёт ожидаемый cache HIT, а cache bypass действительно работает. _(исходный статус: OPEN; строка 416)_
- [ ] **PRELAUNCH-114** **PRELAUNCH-114** (строка 114; `docs/PRE_LAUNCH_STACK_RU.md`): Порты 8000 и 11434 слушают только loopback. _(исходный статус: OPEN; строка 417)_
- [ ] **PRELAUNCH-115** **PRELAUNCH-115** (строка 115; `docs/PRE_LAUNCH_STACK_RU.md`): В логах нет API ключа, пользовательского prompt, приватного документа или сырого аудио. _(исходный статус: OPEN; строка 418)_
- [ ] **PRELAUNCH-116** **PRELAUNCH-116** (строка 116; `docs/PRE_LAUNCH_STACK_RU.md`): Права env/config соответствуют инструкции; service перезапускается без ручного shell state. _(исходный статус: OPEN; строка 419)_
- [ ] **PRELAUNCH-138** **PRELAUNCH-138** (строка 138; `docs/PRE_LAUNCH_STACK_RU.md`): Перезапусти gateway и Ollama, проверь health/capabilities после рестарта. _(исходный статус: OPEN; строка 420)_
- [ ] **PRELAUNCH-139** **PRELAUNCH-139** (строка 139; `docs/PRE_LAUNCH_STACK_RU.md`): Перезагрузи VPS в согласованное окно и подтверди автозапуск сервисов/Tunnel. _(исходный статус: OPEN; строка 421)_
- [ ] **PRELAUNCH-140** **PRELAUNCH-140** (строка 140; `docs/PRE_LAUNCH_STACK_RU.md`): Сделай backup конфигураций и необходимой SQLite data; секреты хранить отдельным защищённым способом. _(исходный статус: OPEN; строка 422)_
- [ ] **PRELAUNCH-141** **PRELAUNCH-141** (строка 141; `docs/PRE_LAUNCH_STACK_RU.md`): Проверь restore на безопасной копии, прежде чем считать backup рабочим. _(исходный статус: OPEN; строка 423)_
- [ ] **PRELAUNCH-142** **PRELAUNCH-142** (строка 142; `docs/PRE_LAUNCH_STACK_RU.md`): Подготовь rollback: отключить hostname/tunnel route; вернуть предыдущий env/config; восстановить known-good commit/service unit; проверить health. Не удалять данные, volumes и старые сервисы ради чистоты. _(исходный статус: OPEN; строка 424)_
- [ ] **PRELAUNCH-157** **PRELAUNCH-157** (строка 157; `docs/PRE_LAUNCH_STACK_RU.md`): Все выбранные PR проверены по актуальному HEAD и нужным required checks; после merge повторно проверены main Quality и Pages deployment. _(исходный статус: OPEN; строка 425)_
- [ ] **PRELAUNCH-158** **PRELAUNCH-158** (строка 158; `docs/PRE_LAUNCH_STACK_RU.md`): Лендинг не обещает работающий hosted endpoint, автоматическую синхронизацию, включённый voice/OCR или multi-user SaaS, если это не подтверждено. _(исходный статус: OPEN; строка 426)_
- [ ] **PRELAUNCH-159** **PRELAUNCH-159** (строка 159; `docs/PRE_LAUNCH_STACK_RU.md`): Проверены mobile layout, клавиатура/viewport, навигация, доступность клавиатурой и отсутствие внешних обязательных JS-зависимостей на лендинге. _(исходный статус: OPEN; строка 427)_
- [ ] **PRELAUNCH-160** **PRELAUNCH-160** (строка 160; `docs/PRE_LAUNCH_STACK_RU.md`): Все ссылки и инструкции ведут к актуальным путям; нет несуществующих contact/support обещаний. _(исходный статус: OPEN; строка 428)_
- [ ] **PRELAUNCH-163** **PRELAUNCH-163** (строка 163; `docs/PRE_LAUNCH_STACK_RU.md`): API работает за HTTPS Tunnel; origin ports закрыты; auth/CORS/allowlist/limits проверены. _(исходный статус: OPEN; строка 429)_
- [ ] **PRELAUNCH-164** **PRELAUNCH-164** (строка 164; `docs/PRE_LAUNCH_STACK_RU.md`): Модель не превышает заданный RAM/latency budget под тестом; restart and reboot проверены. _(исходный статус: OPEN; строка 430)_
- [ ] **PRELAUNCH-165** **PRELAUNCH-165** (строка 165; `docs/PRE_LAUNCH_STACK_RU.md`): Секреты не попали в git/history/logs/artifacts. _(исходный статус: OPEN; строка 431)_
- [ ] **PRELAUNCH-166** **PRELAUNCH-166** (строка 166; `docs/PRE_LAUNCH_STACK_RU.md`): Backup восстановлен в тестовой копии; rollback известен. _(исходный статус: OPEN; строка 432)_
- [ ] **PRELAUNCH-167** **PRELAUNCH-167** (строка 167; `docs/PRE_LAUNCH_STACK_RU.md`): Есть владелец расходов, мониторинг диска/RAM и расписание обновлений. _(исходный статус: OPEN; строка 433)_
- [ ] **PRELAUNCH-170** **PRELAUNCH-170** (строка 170; `docs/PRE_LAUNCH_STACK_RU.md`): Определён закрытый круг первых пользователей и путь обратной связи. _(исходный статус: OPEN; строка 434)_
- [ ] **PRELAUNCH-171** **PRELAUNCH-171** (строка 171; `docs/PRE_LAUNCH_STACK_RU.md`): На лендинге раскрыты ограничения и зависимость от пользовательского gateway. _(исходный статус: OPEN; строка 435)_
- [ ] **PRELAUNCH-172** **PRELAUNCH-172** (строка 172; `docs/PRE_LAUNCH_STACK_RU.md`): Подготовлены Terms/Privacy policy только под фактические data flows; не писать «данные никогда не покидают устройство», если может быть выбран внешний provider. _(исходный статус: OPEN; строка 436)_
- [ ] **PRELAUNCH-173** **PRELAUNCH-173** (строка 173; `docs/PRE_LAUNCH_STACK_RU.md`): Для открытого multi-user доступа отдельно спроектированы auth/session, tenant isolation, quotas, abuse controls, cost controls и retention/deletion. До этого не выдавать личный beta за публичный SaaS. _(исходный статус: OPEN; строка 437)_

### MASTER_TASK_REGISTRY_RU.md — VOICEAUDIT — `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`
- [ ] **VOICEAUDIT-031** **VOICEAUDIT-031** (строка 31; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): `GET /v1/capabilities` отражает только реально включённые функции. _(исходный статус: OPEN; строка 444)_
- [ ] **VOICEAUDIT-032** **VOICEAUDIT-032** (строка 32; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Неавторизованные запросы получают 401; тело, длительность и время выполнения ограничены. _(исходный статус: OPEN; строка 445)_
- [ ] **VOICEAUDIT-033** **VOICEAUDIT-033** (строка 33; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Конкурентные ASR/TTS задачи не копятся бесконечной очередью; корректно возвращается 429. _(исходный статус: OPEN; строка 446)_
- [ ] **VOICEAUDIT-034** **VOICEAUDIT-034** (строка 34; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Временные аудиофайлы удаляются при успехе и ошибке; сырой звук не пишется в логи и долговременную память. _(исходный статус: OPEN; строка 447)_
- [ ] **VOICEAUDIT-035** **VOICEAUDIT-035** (строка 35; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверены лицензии и SHA-256 бинарника/моделей/голоса; runtime пути задаются оператором, ничего не скачивается автоматически. _(исходный статус: OPEN; строка 448)_
- [ ] **VOICEAUDIT-038** **VOICEAUDIT-038** (строка 38; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Установлены совместимые `whisper.cpp`, `ffprobe` и локальная ASR-модель. _(исходный статус: OPEN; строка 449)_
- [ ] **VOICEAUDIT-039** **VOICEAUDIT-039** (строка 39; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): На целевом устройстве браузер действительно получает микрофонное разрешение, записывает поддерживаемый MIME/кодек и корректно останавливает треки. _(исходный статус: OPEN; строка 450)_
- [ ] **VOICEAUDIT-040** **VOICEAUDIT-040** (строка 40; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Русская, английская и тайская короткие записи проходят через настоящий endpoint; ошибки формата/пустой записи объясняются пользователю. _(исходный статус: OPEN; строка 451)_
- [ ] **VOICEAUDIT-041** **VOICEAUDIT-041** (строка 41; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Транскрипт вставляется в composer и остаётся редактируемым; автоматической отправки нет. _(исходный статус: OPEN; строка 452)_
- [ ] **VOICEAUDIT-042** **VOICEAUDIT-042** (строка 42; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Измерены время до первой расшифровки, длительность аудио, пиковая RAM и точность на фиксированном небольшом тестовом наборе. _(исходный статус: OPEN; строка 453)_
- [ ] **VOICEAUDIT-045** **VOICEAUDIT-045** (строка 45; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Установлены совместимые Piper runtime и voice model с проверенной лицензией. _(исходный статус: OPEN; строка 454)_
- [ ] **VOICEAUDIT-046** **VOICEAUDIT-046** (строка 46; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Несколько ответов на русском/английском синтезируются в валидный WAV и воспроизводятся на целевом iPhone/браузере. _(исходный статус: OPEN; строка 455)_
- [ ] **VOICEAUDIT-047** **VOICEAUDIT-047** (строка 47; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Stop отменяет запрос и воспроизведение; повторное нажатие не запускает дубликат. _(исходный статус: OPEN; строка 456)_
- [ ] **VOICEAUDIT-048** **VOICEAUDIT-048** (строка 48; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Измерены latency, длительность генерации, размер WAV и RAM. _(исходный статус: OPEN; строка 457)_
- [ ] **VOICEAUDIT-049** **VOICEAUDIT-049** (строка 49; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Синтез отключён при недоступном runtime, без имитации успешного ответа. _(исходный статус: OPEN; строка 458)_
- [ ] **VOICEAUDIT-052** **VOICEAUDIT-052** (строка 52; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Кодовый half-duplex цикл и mock E2E существуют (PR #60); реальная последовательность запись → ASR → редактируемый текст → запрос → TTS → воспроизведение → следующий ход на целевом устройстве не проверена. _(исходный статус: PARTIAL; строка 459)_
- [ ] **VOICEAUDIT-053** **VOICEAUDIT-053** (строка 53; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Нет автоматической отправки до подтверждённого состояния, если режим явно не настроен на это. _(исходный статус: OPEN; строка 460)_
- [ ] **VOICEAUDIT-054** **VOICEAUDIT-054** (строка 54; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Ошибка на любом этапе оставляет пользователя в восстанавливаемом состоянии; нет скрытой повторной записи или позднего воспроизведения. _(исходный статус: OPEN; строка 461)_
- [ ] **VOICEAUDIT-055** **VOICEAUDIT-055** (строка 55; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Отдельно проверены iOS Safari, блокировка/разблокировка экрана, переключение аудиоустройства и прерывание звонком. _(исходный статус: OPEN; строка 462)_
- [ ] **VOICEAUDIT-056** **VOICEAUDIT-056** (строка 56; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Только после измерений решить, нужен ли streaming/VAD/barge-in; не добавлять их как фиктивную настройку. _(исходный статус: OPEN; строка 463)_
- [ ] **VOICEAUDIT-061** **VOICEAUDIT-061** (строка 61; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить `ALANDI_DOCUMENT_EXTRACTION_ENABLED=false` по умолчанию; включать только на намеренно настроенном gateway. _(исходный статус: OPEN; строка 464)_
- [ ] **VOICEAUDIT-062** **VOICEAUDIT-062** (строка 62; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить реальные сигнатуры/MIME, расширения, пределы размера, страниц/листов, ZIP entries, коэффициента сжатия, времени и длины извлечённого текста. _(исходный статус: OPEN; строка 465)_
- [ ] **VOICEAUDIT-063** **VOICEAUDIT-063** (строка 63; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить повреждённые файлы, архивную бомбу, неверное расширение, пустой/сканированный PDF, превышение лимитов и cleanup временных данных. _(исходный статус: OPEN; строка 466)_
- [ ] **VOICEAUDIT-064** **VOICEAUDIT-064** (строка 64; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Сохранить `no-store`; не отправлять документ в стороннего провайдера без явного выбора и применимых настроек согласия/приватности. _(исходный статус: OPEN; строка 467)_
- [ ] **VOICEAUDIT-067** **VOICEAUDIT-067** (строка 67; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): На реальном gateway вложить по одному TXT, PDF с текстовым слоем, DOCX, XLSX, CSV и JSON. _(исходный статус: OPEN; строка 468)_
- [ ] **VOICEAUDIT-068** **VOICEAUDIT-068** (строка 68; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Подтвердить, что извлечённое содержимое действительно включено в prompt активного провайдера, а не просто отображено в UI. _(исходный статус: OPEN; строка 469)_
- [ ] **VOICEAUDIT-069** **VOICEAUDIT-069** (строка 69; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить страницы/листы и происхождение источника; для таблиц не терять заголовки, порядок и значения ячеек. _(исходный статус: OPEN; строка 470)_
- [ ] **VOICEAUDIT-070** **VOICEAUDIT-070** (строка 70; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Недоступный parser или превышение лимита блокирует отправку с понятной ошибкой, а не создаёт впечатление, что модель прочитала файл. _(исходный статус: OPEN; строка 471)_
- [ ] **VOICEAUDIT-071** **VOICEAUDIT-071** (строка 71; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Проверить раздельные сценарии собственного и стороннего провайдера: документ не должен незаметно менять выбранный маршрут. _(исходный статус: OPEN; строка 472)_
- [ ] **VOICEAUDIT-074** **VOICEAUDIT-074** (строка 74; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): OCR для сканированных PDF и изображений — отдельный локальный компонент, лицензия, лимиты и тесты. _(исходный статус: OPEN; строка 473)_
- [ ] **VOICEAUDIT-075** **VOICEAUDIT-075** (строка 75; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Chunking с page/offset/source hash, preview и подтверждением перед индексацией. _(исходный статус: OPEN; строка 474)_
- [ ] **VOICEAUDIT-076** **VOICEAUDIT-076** (строка 76; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Re-index/delete, удаление производных chunks вместе с источником, provenance и тесты scope isolation. _(исходный статус: OPEN; строка 475)_
- [ ] **VOICEAUDIT-077** **VOICEAUDIT-077** (строка 77; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): XLSX: отдельно определить формулы, отображаемые значения, листы и лимиты. _(исходный статус: OPEN; строка 476)_
- [ ] **VOICEAUDIT-078** **VOICEAUDIT-078** (строка 78; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Видео: выборка кадров не равна расшифровке звука; audio track, ASR и синхронизация требуют отдельного pipeline. _(исходный статус: OPEN; строка 477)_
- [ ] **VOICEAUDIT-079** **VOICEAUDIT-079** (строка 79; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Google Drive OAuth/Picker/sync не обещать до завершения UI, encrypted token storage, revoke и проверки удаления индекса. _(исходный статус: OPEN; строка 478)_
- [ ] **VOICEAUDIT-104** **VOICEAUDIT-104** (строка 104; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): **Голосовое сообщение:** UI/code path реализован; пользователь может записать фрагмент, отредактировать расшифровку и отправить вручную. Реальный микрофон/модель на целевом устройстве ещё не проверены. _(исходный статус: PARTIAL; строка 479)_
- [ ] **VOICEAUDIT-105** **VOICEAUDIT-105** (строка 105; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): **Живой разговор (первый этап — half-duplex):** прототип цикла есть, но это не streaming/full-duplex. Проверить реальные ASR/TTS, задержку, отмену, echo и состояние UI на устройстве. _(исходный статус: PARTIAL; строка 480)_
- [ ] **VOICEAUDIT-106** **VOICEAUDIT-106** (строка 106; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Переключение в живой режим не включается само собой; видимые Start/Stop и разрешение микрофона обязательны. Stop прекращает запись, ASR, запрос модели и воспроизведение настолько полно, насколько позволяют используемые API. _(исходный статус: OPEN; строка 481)_
- [ ] **VOICEAUDIT-108** **VOICEAUDIT-108** (строка 108; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Для локального TTS показывать только голоса, чьи файлы и runtime действительно установлены и прошли проверку. Если доступен один голос, не рисовать второй фиктивный вариант. _(исходный статус: OPEN; строка 482)_
- [ ] **VOICEAUDIT-109** **VOICEAUDIT-109** (строка 109; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Голос хранится как предпочтение выбранного режима/чата согласно принятой модели настроек; не передавать это предпочтение внешнему провайдеру, если синтез остаётся локальным. _(исходный статус: OPEN; строка 483)_
- [ ] **VOICEAUDIT-110** **VOICEAUDIT-110** (строка 110; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): При смене языка выбирать совместимый установленный голос либо объяснять, что голос недоступен; не делать тихий fallback на внешний сервис. _(исходный статус: OPEN; строка 484)_
- [ ] **VOICEAUDIT-111** **VOICEAUDIT-111** (строка 111; `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md`): Расшифровка и ответ видны текстом, если пользователь не включил отдельный режим аудио-only. Пользователь может исправить распознанный текст до отправки. _(исходный статус: OPEN; строка 485)_

### MASTER_TASK_REGISTRY_RU.md — CHATSET — `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`
- [ ] **CHATSET-106** **CHATSET-106** (строка 106; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Расширенный веб-поиск не увеличивает число раундов/вызовов инструментов. _(исходный статус: OPEN; строка 492)_
- [ ] **CHATSET-107** **CHATSET-107** (строка 107; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Тщательный режим не расширяет число результатов веб-поиска сам по себе. _(исходный статус: OPEN; строка 493)_
- [ ] **CHATSET-108** **CHATSET-108** (строка 108; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Offline не предлагает веб-инструменты даже в тщательном/структурированном режиме. _(исходный статус: OPEN; строка 494)_
- [ ] **CHATSET-109** **CHATSET-109** (строка 109; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Смена профиля не включает веб-поиск и не включает структурированный конвейер. _(исходный статус: OPEN; строка 495)_
- [ ] **CHATSET-110** **CHATSET-110** (строка 110; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Структурированный разбор не называется «командой независимых агентов». _(исходный статус: OPEN; строка 496)_
- [ ] **CHATSET-112** **CHATSET-112** (строка 112; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Настройки сохраняются отдельно для каждого чата; импорт/экспорт не теряет значения. _(исходный статус: OPEN; строка 498)_
- [ ] **CHATSET-113** **CHATSET-113** (строка 113; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Русские и английские подписи и подсказки согласованы. _(исходный статус: OPEN; строка 499)_
- [ ] **CHATSET-114** **CHATSET-114** (строка 114; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): На мобильном экране базовые контролы остаются читаемыми и доступны для касания. _(исходный статус: OPEN; строка 500)_

### MASTER_TASK_REGISTRY_RU.md — GUIDE — `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`
- [ ] **GUIDE-544** **GUIDE-544** (строка 544; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Реальная цена Vultr, промокредит и срок истечения проверены в кабинете. _(исходный статус: OPEN; строка 507)_
- [ ] **GUIDE-545** **GUIDE-545** (строка 545; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Домен подключён к Cloudflare; старые DNS/туннели не сломаны. _(исходный статус: OPEN; строка 508)_
- [ ] **GUIDE-546** **GUIDE-546** (строка 546; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Ollama и gateway работают как службы. _(исходный статус: OPEN; строка 509)_
- [ ] **GUIDE-547** **GUIDE-547** (строка 547; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Ollama не доступна с публичного интерфейса; /v1/models без токена отказывает. _(исходный статус: OPEN; строка 510)_
- [ ] **GUIDE-548** **GUIDE-548** (строка 548; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Из опубликованного сайта запрос проходит через aLandi. _(исходный статус: OPEN; строка 511)_
- [ ] **GUIDE-549** **GUIDE-549** (строка 549; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Межпровайдерный fallback выключен для приватных запросов. _(исходный статус: OPEN; строка 512)_
- [ ] **GUIDE-550** **GUIDE-550** (строка 550; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Прямой JSON-запрос даёт L2 MISS → HIT; bypass header работает. _(исходный статус: OPEN; строка 513)_
- [ ] **GUIDE-551** **GUIDE-551** (строка 551; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Gateway tests, quality sentinels, Jekyll build и Chromium E2E прошли на текущем main SHA. _(исходный статус: OPEN; строка 514)_
- [ ] **GUIDE-552** **GUIDE-552** (строка 552; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Experimental memory/RAG/OAuth/voice flags remain off until their own gates and rollback are reviewed. _(исходный статус: OPEN; строка 515)_
- [ ] **GUIDE-554** **GUIDE-554** (строка 554; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Есть резервная копия env, команда отключения L2 и процедура отката. _(исходный статус: OPEN; строка 517)_
- [ ] **GUIDE-555** **GUIDE-555** (строка 555; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Известно, как остановить/удалить платные ресурсы до истечения кредита. _(исходный статус: OPEN; строка 518)_

### MASTER_TASK_REGISTRY_RU.md — ARCHDBG — `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`
- [ ] **ARCHDBG-016** **ARCHDBG-016** (строка 16; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): A5. Выполнить системную матрицу совместимости: UI ↔ API ↔ runtime ↔ persistence ↔ security ↔ CI/deploy. _(исходный статус: OPEN; строка 525)_
- [ ] **ARCHDBG-017** **ARCHDBG-017** (строка 17; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): A6. Внести только подтверждённые совместимые архитектурные исправления; не добавлять тяжёлые зависимости без измеримого выигрыша. _(исходный статус: OPEN; строка 526)_
- [ ] **ARCHDBG-024** **ARCHDBG-024** (строка 24; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D5. Провести полный статический/графовый аудит UI, gateway, memory, RAG, voice, tools, workflows и dependencies. Graphify inspected: 1,109 nodes / 3,103 edges / 53 communities; no import cycles detected; full manual audit remains. _(исходный статус: PARTIAL; строка 527)_
- [ ] **ARCHDBG-026** **ARCHDBG-026** (строка 26; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D7. Составить verified dead-code/obsolete-file inventory. Удалены только три подтверждённо устаревших scratch-файла после поиска ссылок и обновления `IMPROVEMENT_SELECTION.md`: `temp/3`, `temp/4`, `temp/5`. Содержательные `temp/1` и `temp/2` оставлены как архивные источники. Vulture warning по Protocol parameter — false positive. _(исходный статус: PARTIAL; строка 528)_
- [ ] **ARCHDBG-027** **ARCHDBG-027** (строка 27; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D8. Проверить security: SSRF/redirect, prompt injection, scopes, deletion, approval, tool sandbox, secrets, upload parsers, audio. _(исходный статус: OPEN; строка 529)_
- [ ] **ARCHDBG-028** **ARCHDBG-028** (строка 28; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D9. Проверить runtime contracts, cancellation, timeouts, limits, retries, concurrency и resource bounds. _(исходный статус: OPEN; строка 530)_
- [ ] **ARCHDBG-035** **ARCHDBG-035** (строка 35; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P5. Подготовить голосовой UX: запись/транскрипция и TTS одного сообщения уже есть в коде; диалог сейчас half-duplex; selection-to-speech, multi-message queue, streaming turn detection и реальный barge-in остаются незавершёнными. _(исходный статус: PARTIAL; строка 531)_
- [ ] **ARCHDBG-036** **ARCHDBG-036** (строка 36; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P6. Спроектировать small helper models, GPU-only/accelerated inference и routing без обязательной нагрузки CPU; сохранить CPU fallback только как осознанный режим. Подтверждены варианты Ollama GPU, llama.cpp offload и vLLM; требуется hardware benchmark. _(исходный статус: PARTIAL; строка 532)_
- [ ] **ARCHDBG-037** **ARCHDBG-037** (строка 37; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P7. Спроектировать bounded multi-agent / mass-agent orchestration: DAG, budgets, queue, cancellation, idempotency, permissions, traces, evals и safe-off. Сравнены OpenWOP v2 protocol, LangGraph interrupts/checkpointing and Temporal durable workflows; no runtime chosen. _(исходный статус: PARTIAL; строка 533)_
- [ ] **ARCHDBG-040** **ARCHDBG-040** (строка 40; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P10. Лендинговые claims/CTA/SEO/структура проверены в PR #121; exact-head Chromium и published-site smoke прошли. Post-merge Pages deployment, финальный screenshot-review и native iPhone accessibility ещё не подтверждены. _(исходный статус: PARTIAL; строка 534)_
- [ ] **ARCHDBG-129** **ARCHDBG-129** (строка 129; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Exact PR HEAD: Integrity, Security, Context, Jekyll, Chromium, Gateway, Provenance, Graphify and Dead-code report pass. _(исходный статус: OPEN; строка 535)_
- [ ] **ARCHDBG-130** **ARCHDBG-130** (строка 130; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Post-merge main: deployment workflow passes; public root app and /landing/ smoke verify the exact release. _(исходный статус: OPEN; строка 536)_
- [ ] **ARCHDBG-131** **ARCHDBG-131** (строка 131; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Voice: real microphone/speaker, target language set RU/EN/TH, transcription accuracy, first-audio latency, RTF, interruption latency, echo, cancellation, repeated playback, multi-selection ordering. _(исходный статус: OPEN; строка 537)_
- [ ] **ARCHDBG-132** **ARCHDBG-132** (строка 132; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Model: exact artifact/tag, quantization, license, checksum, device backend, VRAM/RAM/PSS, cold/warm TTFT, tokens/s, p95 and thermal stability. _(исходный статус: OPEN; строка 538)_
- [ ] **ARCHDBG-133** **ARCHDBG-133** (строка 133; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Agent: budget, permission, scope isolation, cancellation, timeout, idempotency, retry and adversarial prompt injection tests. _(исходный статус: OPEN; строка 539)_
- [ ] **ARCHDBG-134** **ARCHDBG-134** (строка 134; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Knowledge-to-skill: parser corpus, malicious documents, injection scanner, provenance/citation correctness, license handling and human approval. _(исходный статус: OPEN; строка 540)_
- [ ] **ARCHDBG-135** **ARCHDBG-135** (строка 135; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Security/privacy: no secrets in browser bundle/logs/cache/CI artifacts; explicit disclosure of provider routing and storage. _(исходный статус: OPEN; строка 541)_
- [ ] **ARCHDBG-136** **ARCHDBG-136** (строка 136; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): Owner gates: actual VPS inventory, firewall/loopback, Cloudflare Tunnel, credentials, backup/restore, reboot, iPhone Safari and legal privacy text. _(исходный статус: OPEN; строка 542)_
- [ ] **ARCHDBG-225** **ARCHDBG-225** (строка 225; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): U5. Прогнать exact-current-head Chromium/Quality and published Pages after merge. _(исходный статус: OPEN; строка 543)_
- [ ] **ARCHDBG-226** **ARCHDBG-226** (строка 226; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): U6. Реализовать оставшийся polish в больших вертикальных slices: visual consistency; popover/dialog keyboard/focus; mobile Safari; RU/EN/light-dark; screenshot review. _(исходный статус: OPEN; строка 544)_
- [ ] **ARCHDBG-240** **ARCHDBG-240** (строка 240; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D5 — Graphify and targeted source audit cover current hotspots; full manual subsystem audit remains open. _(исходный статус: PARTIAL; строка 545)_
- [ ] **ARCHDBG-241** **ARCHDBG-241** (строка 241; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): D8 — OOXML DTD/external-entity handling fixed and regression-tested in 051308c; broader SSRF, parser isolation and adversarial corpus remain open. _(исходный статус: PARTIAL; строка 546)_
- [ ] **ARCHDBG-244** **ARCHDBG-244** (строка 244; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P5/P6 — candidates/constraints documented; target-device quality, helper registry and GPU-only admission tests remain open. _(исходный статус: PARTIAL; строка 547)_
- [ ] **ARCHDBG-245** **ARCHDBG-245** (строка 245; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): P7/P9 — durable workflow options compared; no engine chosen. Current bounded DAG stays baseline. _(исходный статус: PARTIAL; строка 548)_
- [ ] **ARCHDBG-247** **ARCHDBG-247** (строка 247; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): No speech model, voice framework, GPU scheduler, agent engine or document converter integrated in this research pass. _(исходный статус: OPEN; строка 549)_
- [ ] **ARCHDBG-248** **ARCHDBG-248** (строка 248; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): External skills/exercise-toolkit@ebf43bb remains pinned pending behavior review. _(исходный статус: OPEN; строка 550)_
- [ ] **ARCHDBG-258** **ARCHDBG-258** (строка 258; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M6. Сверены основные старые search/functions, landing, local audio/document, provider diagnostics и superstack ветки по именам/compare; текущие PR/документы показывают значительное перекрытие с более поздними merge. Полная файловая экспертиза каждой исторической ветки не проводилась; wholesale merge старых веток не нужен. _(исходный статус: PARTIAL; строка 551)_
- [ ] **ARCHDBG-263** **ARCHDBG-263** (строка 263; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M11. После merge проверить post-merge Pages deployment и опубликованный `/landing/` и root app. _(исходный статус: OPEN; строка 552)_
- [ ] **ARCHDBG-264** **ARCHDBG-264** (строка 264; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M12. Провести ручной visual/screenshot pass и native iPhone Safari/keyboard/safe-area/VoiceOver. _(исходный статус: OPEN; строка 553)_
- [ ] **ARCHDBG-265** **ARCHDBG-265** (строка 265; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M13. На реальном хосте выполнить helper-model benchmark: точные model IDs/digests/licenses, одинаковые RU/EN/TH golden prompts, quantization/context/hardware, p50/p95, cold/warm latency, tokens/s, RAM/PSS и human-rated quality. Пока модель не выбрана и не включена. _(исходный статус: OPEN; строка 554)_
- [ ] **ARCHDBG-266** **ARCHDBG-266** (строка 266; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): M14. Продолжить системную матрицу UI ↔ API ↔ runtime ↔ persistence ↔ security ↔ CI/deploy; не объявлять sandbox, independent agents, live voice, OAuth или RAG production-ready без evidence. _(исходный статус: OPEN; строка 555)_
- [ ] **ARCHDBG-283** **ARCHDBG-283** (строка 283; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W2. Reconcile accepted decisions against implementation, flags and runtime wiring. _(исходный статус: OPEN; строка 556)_
- [ ] **ARCHDBG-284** **ARCHDBG-284** (строка 284; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W3. Trace all cross-module data/control flows and trust boundaries. _(исходный статус: OPEN; строка 557)_
- [ ] **ARCHDBG-285** **ARCHDBG-285** (строка 285; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W4. Run additional independent quality/security/static-analysis tools and record exact outputs. _(исходный статус: OPEN; строка 558)_
- [ ] **ARCHDBG-286** **ARCHDBG-286** (строка 286; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W5. Obtain independent subagent review if an actual subagent execution capability is available; otherwise record limitation and use a separately structured adversarial review. _(исходный статус: OPEN; строка 559)_
- [ ] **ARCHDBG-287** **ARCHDBG-287** (строка 287; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W6. Triage findings against accepted architecture; reject stack expansion and speculative changes. _(исходный статус: OPEN; строка 560)_
- [ ] **ARCHDBG-288** **ARCHDBG-288** (строка 288; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W7. Implement only evidence-backed, bounded fixes; test each slice and update all state docs. _(исходный статус: OPEN; строка 561)_
- [ ] **ARCHDBG-289** **ARCHDBG-289** (строка 289; `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md`): W8. Re-run exact-head CI and verify final PR/issue/deployment status without overstating live readiness. _(исходный статус: OPEN; строка 562)_

### MASTER_TASK_REGISTRY_RU.md — AGENTPLAT — `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`
- [ ] **AGENTPLAT-404** **AGENTPLAT-404** (строка 404; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Typed AgentProfile, Profession, SkillManifest, Capability, ModelPolicy, BudgetPolicy. _(исходный статус: OPEN; строка 574)_
- [ ] **AGENTPLAT-405** **AGENTPLAT-405** (строка 405; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Registry read-only API + versioned config; никакой динамической загрузки исполняемого кода. _(исходный статус: OPEN; строка 575)_
- [ ] **AGENTPLAT-406** **AGENTPLAT-406** (строка 406; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Перевести 64 роли в валидируемые профили, не создавая 64 процессов. _(исходный статус: OPEN; строка 576)_
- [ ] **AGENTPLAT-407** **AGENTPLAT-407** (строка 407; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): JSON Schema/Pydantic contract tests, license/provenance validation, deterministic registry selection. _(исходный статус: OPEN; строка 577)_
- [ ] **AGENTPLAT-410** **AGENTPLAT-410** (строка 410; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): SQLite schema + append-only events + snapshots + state machine. _(исходный статус: OPEN; строка 578)_
- [ ] **AGENTPLAT-411** **AGENTPLAT-411** (строка 411; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Cancellation, deadlines, budgets, idempotency, restart recovery. _(исходный статус: OPEN; строка 579)_
- [ ] **AGENTPLAT-412** **AGENTPLAT-412** (строка 412; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Failure injection tests на каждом transition. _(исходный статус: OPEN; строка 580)_
- [ ] **AGENTPLAT-413** **AGENTPLAT-413** (строка 413; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): UI timeline read-only; не показывать chain-of-thought. _(исходный статус: OPEN; строка 581)_
- [ ] **AGENTPLAT-416** **AGENTPLAT-416** (строка 416; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Supervisor → bounded specialist tasks. _(исходный статус: OPEN; строка 582)_
- [ ] **AGENTPLAT-417** **AGENTPLAT-417** (строка 417; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Isolated task packet/history; strict capability intersection. _(исходный статус: OPEN; строка 583)_
- [ ] **AGENTPLAT-418** **AGENTPLAT-418** (строка 418; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): fan-out/fan-in для read-only tasks; generation concurrency 1 на 8-GB VPS. _(исходный статус: OPEN; строка 584)_
- [ ] **AGENTPLAT-419** **AGENTPLAT-419** (строка 419; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): независимая проверка результата и корректная агрегация. _(исходный статус: OPEN; строка 585)_
- [ ] **AGENTPLAT-420** **AGENTPLAT-420** (строка 420; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): eval: delegation correctness, no context/permission leakage, cost and latency. _(исходный статус: OPEN; строка 586)_
- [ ] **AGENTPLAT-423** **AGENTPLAT-423** (строка 423; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Run model bake-off на целевом host и golden set. _(исходный статус: OPEN; строка 587)_
- [ ] **AGENTPLAT-424** **AGENTPLAT-424** (строка 424; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Capability-based routing, explicit provider/model allowlist, no silent fallback. _(исходный статус: OPEN; строка 588)_
- [ ] **AGENTPLAT-425** **AGENTPLAT-425** (строка 425; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Только один helper use case за раз; rollback и feature flag off by default. _(исходный статус: OPEN; строка 589)_
- [ ] **AGENTPLAT-426** **AGENTPLAT-426** (строка 426; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Не держать несколько checkpoints resident без измеренной причины. _(исходный статус: OPEN; строка 590)_
- [ ] **AGENTPLAT-429** **AGENTPLAT-429** (строка 429; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Agent Skills-compatible loader and registry. _(исходный статус: OPEN; строка 591)_
- [ ] **AGENTPLAT-430** **AGENTPLAT-430** (строка 430; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Source ingestion, provenance, license checks, injection scanner. _(исходный статус: OPEN; строка 592)_
- [ ] **AGENTPLAT-431** **AGENTPLAT-431** (строка 431; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): eval-generated test questions, human review, skill versioning/rollback. _(исходный статус: OPEN; строка 593)_
- [ ] **AGENTPLAT-432** **AGENTPLAT-432** (строка 432; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): No auto-execution of scripts and no permission inheritance from skill metadata. _(исходный статус: OPEN; строка 594)_
- [ ] **AGENTPLAT-435** **AGENTPLAT-435** (строка 435; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Capability-based tool authorization before each call. _(исходный статус: OPEN; строка 595)_
- [ ] **AGENTPLAT-436** **AGENTPLAT-436** (строка 436; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Scoped credential broker, audit, egress restrictions. _(исходный статус: OPEN; строка 596)_
- [ ] **AGENTPLAT-437** **AGENTPLAT-437** (строка 437; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): gVisor/Firecracker/OpenShell spike; choose only after threat model and host checks. _(исходный статус: OPEN; строка 597)_
- [ ] **AGENTPLAT-438** **AGENTPLAT-438** (строка 438; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Arbitrary code remains disabled until isolation/escape tests pass. _(исходный статус: OPEN; строка 598)_
- [ ] **AGENTPLAT-441** **AGENTPLAT-441** (строка 441; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Goals, org chart, task queue, heartbeats, budgets, pause/resume/terminate. _(исходный статус: OPEN; строка 599)_
- [ ] **AGENTPLAT-442** **AGENTPLAT-442** (строка 442; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): A2A for explicit external-agent connections; MCP for tools; AG-UI for UI events. _(исходный статус: OPEN; строка 600)_
- [ ] **AGENTPLAT-443** **AGENTPLAT-443** (строка 443; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Multi-tenant boundaries, adapter isolation, credential scopes and operator controls. _(исходный статус: OPEN; строка 601)_
- [ ] **AGENTPLAT-444** **AGENTPLAT-444** (строка 444; `docs/AGENT_PLATFORM_BLUEPRINT_RU.md` @ `research/agent-platform-blueprint-20261030`): Human opt-in for recurring work and clear stop controls. _(исходный статус: OPEN; строка 602)_

### MASTER_TASK_REGISTRY_RU.md — LANDINGBK — `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`
- [ ] **LANDINGBK-033** **LANDINGBK-033** (строка 33; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-001 — зафиксировать baseline размера HTML/CSS/JS, critical rendering, LCP/INP/CLS и загрузки ключевых assets на опубликованном сайте. _(исходный статус: OPEN; строка 637)_
- [ ] **LANDINGBK-034** **LANDINGBK-034** (строка 34; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-002 — аудит доступности: keyboard-only, focus order, dialogs/popovers, screen-reader semantics, reduced motion, contrast and touch targets. _(исходный статус: OPEN; строка 638)_
- [ ] **LANDINGBK-035** **LANDINGBK-035** (строка 35; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-003 — аудит responsive поведения и реального iPhone Safari: visual viewport, keyboard, safe areas, rotation and zoom. _(исходный статус: OPEN; строка 639)_
- [ ] **LANDINGBK-036** **LANDINGBK-036** (строка 36; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-004 — аудит JS lifecycle: event listener cleanup, duplicate handlers, async race conditions, stale state, cancellation and memory leaks. _(исходный статус: OPEN; строка 640)_
- [ ] **LANDINGBK-037** **LANDINGBK-037** (строка 37; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-005 — аудит resilience: offline/slow network, retry/backoff, timeout, abort, provider 4xx/5xx, malformed/partial responses and error recovery. _(исходный статус: OPEN; строка 641)_
- [ ] **LANDINGBK-038** **LANDINGBK-038** (строка 38; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-006 — аудит client storage: migration, quota errors, import/export losslessness, corruption recovery, scoped deletion and backup/restore. _(исходный статус: OPEN; строка 642)_
- [ ] **LANDINGBK-039** **LANDINGBK-039** (строка 39; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-007 — audit security/privacy in current boundaries: CSP/SRI, DOM injection, URL handling, secret exposure, logging, CORS/SSRF and data retention. _(исходный статус: OPEN; строка 643)_
- [ ] **LANDINGBK-040** **LANDINGBK-040** (строка 40; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-008 — SEO/metadata/semantic HTML, canonical URL, social preview, sitemap/robots and crawl behavior without adding a framework. _(исходный статус: OPEN; строка 644)_
- [ ] **LANDINGBK-041** **LANDINGBK-041** (строка 41; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-009 — deterministic Jekyll/Actions build, cache correctness, immutable action pins, lockfile and provenance. _(исходный статус: OPEN; строка 645)_
- [ ] **LANDINGBK-042** **LANDINGBK-042** (строка 42; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-010 — reduce duplicated code/assets and dead paths only when exact reference and regression evidence prove safe removal. _(исходный статус: OPEN; строка 646)_
- [ ] **LANDINGBK-043** **LANDINGBK-043** (строка 43; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-011 — inspect current CSS/JS payload and optimize critical path only if measured; preserve visual behavior. _(исходный статус: OPEN; строка 647)_
- [ ] **LANDINGBK-044** **LANDINGBK-044** (строка 44; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-012 — expand Playwright coverage for critical user flows and failure states; avoid brittle/vacuous assertions. _(исходный статус: OPEN; строка 648)_
- [ ] **LANDINGBK-045** **LANDINGBK-045** (строка 45; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-013 — verify browser compatibility and graceful degradation for current supported browsers. _(исходный статус: OPEN; строка 649)_
- [ ] **LANDINGBK-046** **LANDINGBK-046** (строка 46; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-014 — audit i18n: RU/EN/TH labels, formatting, font fallback, transliteration of user-entered names only where required. _(исходный статус: OPEN; строка 650)_
- [ ] **LANDINGBK-047** **LANDINGBK-047** (строка 47; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-015 — review dependency freshness and security advisories within the existing dependency policy; do not blindly upgrade. _(исходный статус: OPEN; строка 651)_
- [ ] **LANDINGBK-048** **LANDINGBK-048** (строка 48; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-016 — inspect build/release observability and published Pages smoke; do not claim post-merge deploy from PR CI alone. _(исходный статус: OPEN; строка 652)_
- [ ] **LANDINGBK-049** **LANDINGBK-049** (строка 49; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-017 — reconcile historical landing UX requests with current code and master registry; preserve original task IDs and evidence. _(исходный статус: OPEN; строка 653)_
- [ ] **LANDINGBK-050** **LANDINGBK-050** (строка 50; `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` @ `research/voice-assistant-transcription-20261031`): LANDING-018 — test graceful operation when optional gateway/voice/research capabilities are unavailable or disabled. _(исходный статус: OPEN; строка 654)_

### MASTER_TASK_REGISTRY_RU.md — GOV — `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`
- [ ] **GOV-094** **GOV-094** (строка 94; `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`): GOV-003 — apply explicit titles/banners/labels to all existing future/research PRs after reviewing each PR and current labels. _(исходный статус: PARTIAL; строка 661)_
- [ ] **GOV-095** **GOV-095** (строка 95; `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`): GOV-004 — add repository-side merge protection/automation only after checking existing rulesets and obtaining owner approval; labels alone are not a security boundary. _(исходный статус: OPEN; строка 662)_
- [ ] **GOV-096** **GOV-096** (строка 96; `docs/WORKSTREAM_GOVERNANCE_RU.md` @ `research/voice-assistant-transcription-20261031`): GOV-005 — update master registry and orienters when PR #127 is revised/merged. _(исходный статус: OPEN; строка 663)_

### MASTER_TASK_REGISTRY_RU.md — DR2PLAN — `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`
- [ ] **DR2PLAN-152** **DR2PLAN-152** (строка 152; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-001 — восстановить ранее предоставленные владельцем research links и provenance. _(исходный статус: OPEN; строка 670)_
- [ ] **DR2PLAN-154** **DR2PLAN-154** (строка 154; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-003 — проверить actual search/research UI и Gateway code; разделить implemented/planned. _(исходный статус: OPEN; строка 671)_
- [ ] **DR2PLAN-155** **DR2PLAN-155** (строка 155; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-004 — аудит source ingestion, local storage, index and citation lineage. _(исходный статус: OPEN; строка 672)_
- [ ] **DR2PLAN-156** **DR2PLAN-156** (строка 156; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-005 — проверить browser File System Access, OPFS and IndexedDB на целевых браузерах. _(исходный статус: OPEN; строка 673)_
- [ ] **DR2PLAN-157** **DR2PLAN-157** (строка 157; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-006 — оценить local companion/desktop connectors and threat model. _(исходный статус: OPEN; строка 674)_
- [ ] **DR2PLAN-158** **DR2PLAN-158** (строка 158; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-007 — сравнить notebook/research workspace проекты и source adapters по первоисточникам. _(исходный статус: OPEN; строка 675)_
- [ ] **DR2PLAN-159** **DR2PLAN-159** (строка 159; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-008 — сравнить hybrid lexical/vector retrieval с SQLite FTS5 до добавления vector store. _(исходный статус: OPEN; строка 676)_
- [ ] **DR2PLAN-160** **DR2PLAN-160** (строка 160; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-009 — определить claim/evidence schema and citation-validation golden set. _(исходный статус: OPEN; строка 677)_
- [ ] **DR2PLAN-161** **DR2PLAN-161** (строка 161; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-010 — специфицировать resumable 12-stage Research run: deadline, cancellation, idempotency, bounded concurrency. _(исходный статус: OPEN; строка 678)_
- [ ] **DR2PLAN-162** **DR2PLAN-162** (строка 162; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-011 — RU/EN/TH research golden set, source freshness and contradiction tests. _(исходный статус: OPEN; строка 679)_
- [ ] **DR2PLAN-163** **DR2PLAN-163** (строка 163; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-012 — аудит memory recall, scope isolation, stale facts, conflicts, deletion and long-session capacity. _(исходный статус: OPEN; строка 680)_
- [ ] **DR2PLAN-164** **DR2PLAN-164** (строка 164; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-013 — оценить local memory/index size and performance на target devices; определить практические пределы. _(исходный статус: OPEN; строка 681)_
- [ ] **DR2PLAN-165** **DR2PLAN-165** (строка 165; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-014 — data-flow режимов local-only / mixed / remote-with-consent. _(исходный статус: OPEN; строка 682)_
- [ ] **DR2PLAN-166** **DR2PLAN-166** (строка 166; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-015 — policy matrix: model refusals vs content policy vs platform security vs tool permissions. _(исходный статус: OPEN; строка 683)_
- [ ] **DR2PLAN-167** **DR2PLAN-167** (строка 167; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-016 — false-positive/false-refusal and tool-authorization tests; no hidden adapter censorship. _(исходный статус: OPEN; строка 684)_
- [ ] **DR2PLAN-168** **DR2PLAN-168** (строка 168; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-017 — image-generation candidates: ComfyUI/local GPU vs hosted APIs, licenses, cost, region, privacy. _(исходный статус: OPEN; строка 685)_
- [ ] **DR2PLAN-169** **DR2PLAN-169** (строка 169; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-018 — video-generation candidates and async job APIs; не использовать retired endpoints. _(исходный статус: OPEN; строка 686)_
- [ ] **DR2PLAN-170** **DR2PLAN-170** (строка 170; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-019 — AI coding assistants/agents and isolated coding sandboxes. _(исходный статус: OPEN; строка 687)_
- [ ] **DR2PLAN-171** **DR2PLAN-171** (строка 171; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-020 — source inventory, decisions, risk register and staged implementation roadmap. _(исходный статус: OPEN; строка 688)_
- [ ] **DR2PLAN-172** **DR2PLAN-172** (строка 172; `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` @ `research/deep-research-2.0-20261031`): DR2-021 — подготовить отдельные минимальные implementation PR после owner review; никаких production dependencies в этом PR. _(исходный статус: OPEN; строка 689)_

### MASTER_TASK_REGISTRY_RU.md — DR2EXT — `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`
- [ ] **DR2EXT-147** **DR2EXT-147** (строка 147; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-001 — pin Local Deep Research commit, verify full dependency/license and run architecture comparison. _(исходный статус: OPEN; строка 696)_
- [ ] **DR2EXT-148** **DR2EXT-148** (строка 148; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-002 — verify Khoj AGPL obligations and exact local deployment footprint. _(исходный статус: OPEN; строка 697)_
- [ ] **DR2EXT-149** **DR2EXT-149** (строка 149; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-003 — review Deep Research Web UI license/maintenance and reproduce evidence-follow-up flow. _(исходный статус: OPEN; строка 698)_
- [ ] **DR2EXT-150** **DR2EXT-150** (строка 150; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-004 — browser matrix for File System Access/IndexedDB/OPFS permission persistence, quota and file changes. _(исходный статус: OPEN; строка 699)_
- [ ] **DR2EXT-151** **DR2EXT-151** (строка 151; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-005 — prototype local folder companion threat model; no code until explicit approval. _(исходный статус: OPEN; строка 700)_
- [ ] **DR2EXT-152** **DR2EXT-152** (строка 152; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-006 — compare OpenHands Docker isolation with aLandi's required container/seccomp/Landlock policy and adversarial escape tests. _(исходный статус: OPEN; строка 701)_
- [ ] **DR2EXT-153** **DR2EXT-153** (строка 153; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-007 — compare Letta/Graphiti/OpenViking retrieval against current SQLite/FTS5 on the same labelled corpus. _(исходный статус: OPEN; строка 702)_
- [ ] **DR2EXT-154** **DR2EXT-154** (строка 154; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-008 — verify exact Comfy API deployment/auth/retention behavior and benchmark a local workflow on target GPU. _(исходный статус: OPEN; строка 703)_
- [ ] **DR2EXT-155** **DR2EXT-155** (строка 155; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-009 — verify Runway and Vertex AI availability, pricing, regional access and data retention from owner accounts. _(исходный статус: OPEN; строка 704)_
- [ ] **DR2EXT-156** **DR2EXT-156** (строка 156; `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md` @ `research/deep-research-2.0-20261031`): DR2-EXT-010 — produce policy matrix and false-refusal/security separation tests. _(исходный статус: OPEN; строка 705)_

### MASTER_TASK_REGISTRY_RU.md — USER125 — branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`
- [ ] **USER125-254** **USER125-254** (строка 254; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Review the architecture and approve/adjust the Phase 1 contracts and registry before any runtime implementation. _(исходный статус: OPEN; строка 712)_
- [ ] **USER125-255** **USER125-255** (строка 255; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Implement a versioned AgentProfile/Profession/Skill/Capability/ModelPolicy contract in a separate bounded PR. _(исходный статус: OPEN; строка 713)_
- [ ] **USER125-256** **USER125-256** (строка 256; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Build durable AgentRun state, isolated subagent task packets, budget/cancellation and restart recovery in subsequent PRs. _(исходный статус: OPEN; строка 714)_
- [ ] **USER125-257** **USER125-257** (строка 257; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Run RU/EN/TH model quality and target-host RAM/latency bake-off before choosing helper models. _(исходный статус: OPEN; строка 715)_
- [ ] **USER125-258** **USER125-258** (строка 258; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `research/agent-platform-blueprint-20261030`): Complete threat model and real sandbox/escape tests before enabling arbitrary code or shell tools. _(исходный статус: OPEN; строка 716)_

### MASTER_TASK_REGISTRY_RU.md — USER126 — branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `chore/dependency-currency-audit-20261031`
- [ ] **USER126-328** **USER126-328** (строка 328; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `chore/dependency-currency-audit-20261031`): После cooldown повторно оценить pypdf 6.21.4, pytest 9.2.0, pytest-asyncio 1.4.1 и Graphify 0.9.97. _(исходный статус: OPEN; строка 729)_
- [ ] **USER126-329** **USER126-329** (строка 329; branch-only delta `docs/USER_REQUEST_CHECKLIST.md` @ `chore/dependency-currency-audit-20261031`): Live Cloudflare Tunnel/Ollama, целевой VPS и native iPhone остаются owner/manual gates. _(исходный статус: OPEN; строка 730)_

### MASTER_TASK_REGISTRY_RU.md — B. Новые задачи по указанию владельца (2026-10-31)
- [ ] **CONT-001** **CONT-001**: Единый устойчивый протокол непрерывности: корневой ориентир, мастер-реестр, стабильные ID, обязательное обновление после этапов, восстановление по GitHub и файлам. **Progress:** PR #127 содержит 544 открытые/частичные записи из 20 документов и двух branch-only checklist snapshots (470 unchecked + 74 partial); исходники не изменены. Exact-head Freshness/Quality/Provenance после последнего обновления ещё требуется. _(исходный статус: PARTIAL; строка 734)_
- [ ] **AGENT-001** **AGENT-001**: Исследовать и спроектировать реальную параллельную multi-agent архитектуру: минимум 5 одновременно исполняемых независимых workers поверх главной модели; масштабирование выше 64 и до сотен/тысяч логических workers через очереди, leases, backpressure и распределённые workers. **Progress:** целевая архитектура и acceptance criterion 5+ workers описаны в PR #128; runtime implementation pending. _(исходный статус: PARTIAL; строка 735)_
- [ ] **AGENT-002** **AGENT-002**: Сравнить Agensh (до 1,024 workers), Hive, DeerFlow, Open Multi-Agent, AgentTeams, OpenAI Agents SDK, Swarms, Octos и новые upstream; проверить первичные репозитории, бумаги, лицензии, adoption и ограничения. **Progress:** сравнены Agensh, Hive, DeerFlow, OMA, AgentTeams, Octos и ранее выбранные проекты; дальнейший source/license review pending. _(исходный статус: PARTIAL; строка 736)_
- [ ] **AGENT-003** **AGENT-003**: Расширить профессию/skill/capability registry: 64 роли оставить как один seed-набор, но поддержать динамические профили, пользовательские профессии, composable skills и capability discovery без жёсткого потолка. **Progress:** зафиксировано: 64 роли — seed catalogue, без жёсткого потолка; dynamic profile implementation pending. _(исходный статус: PARTIAL; строка 737)_
- [ ] **AGENT-004** **AGENT-004**: Спроектировать durable AgentRun: persistence, checkpoints, leases, retries, cancellation, approvals, idempotency, isolation, event journal, budgets, tracing, independent verification. **Progress:** durable AgentRun, leases, journal, retries and recovery описаны; implementation pending. _(исходный статус: PARTIAL; строка 738)_
- [ ] **AGENT-005** **AGENT-005**: Проверить параллельную работу разных моделей и главной модели без требования держать отдельный checkpoint на каждого worker; model routing, batching, queue fairness, resource-aware scheduling. **Progress:** разделены logical worker slots и backend inference concurrency; target-host benchmark pending. _(исходный статус: PARTIAL; строка 739)_
- [ ] **VERT-001** **VERT-001**: Проверить VERT-sh/vert, vertd, WASM converters, engine routing, format coverage, local privacy, AGPL/GPL licensing; решить, что переиспользовать как идеи/engines, а не встраивать UI wholesale. **Progress:** VERT/верtd upstream, формат и лицензии проверены; implementation decision pending. _(исходный статус: PARTIAL; строка 740)_
- [ ] **VERT-002** **VERT-002**: Сравнить более лёгкий conversion stack: существующий pypdf/docx/xlsx extraction, Pandoc, LibreOffice headless, FFmpeg, ImageMagick и browser WASM; отдельно user-facing conversion и model-facing normalization. **Progress:** MarkItDown, Docling, Unstructured, Pandoc, LibreOffice, FFmpeg и WASM approaches сравнены; fixture benchmark pending. _(исходный статус: PARTIAL; строка 741)_
- [ ] **VERT-003** **VERT-003**: Сформировать безопасный conversion contract: MIME/signature sniffing, limits, async workers, timeouts, temp cleanup, no-store, provenance, conversion preview, loss warnings, supported pairs and license manifest. **Progress:** typed conversion contract and security gates описаны; implementation pending. _(исходный статус: PARTIAL; строка 742)_
- [ ] **TOK-001** **TOK-001**: Полный аудит generation/output limits, history/context budgets, truncation, stop sequences, finish_reason, provider compatibility, streaming completion and reasoning settings. **Progress:** frontend, Gateway, tool loop, context, cache and import paths audited; remediation pending. _(исходный статус: PARTIAL; строка 743)_
- [ ] **TOK-002** **TOK-002**: Разделить safety/resource bounds на input/file/context/tool orchestration vs искусственные ограничения длины ответа/размышления; не обрезать ответ модели ради внутреннего формата aLandi. **Progress:** подтверждено отсутствие обычного main-answer cap; context/tool orchestration limits and finish_reason issue documented. _(исходный статус: PARTIAL; строка 744)_
- [ ] **TOK-003** **TOK-003**: Разработать provider-aware output handling: не посылать max_tokens/max_completion_tokens/max_output_tokens по умолчанию без нужды; уважать provider/model context; detect length/incomplete; продолжать безопасно только если continuation semantics подтверждены. _(исходный статус: OPEN; строка 745)_
- [ ] **DR-001** **DR-001**: Создать отдельный deep-research PR/ветку: многопроходный поиск, первичные источники, GitHub discovery, adoption signals, papers, issue/release activity, security/licensing, practitioner evidence. **Progress:** отдельная research branch и PR #128 созданы; review/merge pending. _(исходный статус: PARTIAL; строка 746)_
- [ ] **DR-002** **DR-002**: Собрать ранее выбранные источники из temp/1, temp/2, existing research catalogues and user-provided repositories; dedupe and classify by idea, implementation, evidence and adoption. **Progress:** повторно использованы temp/1, temp/2, OPEN_SOURCE_TRIAGE, TECHNIQUE_REGISTER и PR #125 research docs. _(исходный статус: PARTIAL; строка 747)_
- [ ] **DR-003** **DR-003**: Подготовить обновляемый research catalogue и architecture decision matrix, не копируя сторонний код/лицензии и не превращая каждую найденную технологию в зависимость. **Progress:** три документа deep research созданы; расширение каталога и независимый review pending. _(исходный статус: PARTIAL; строка 748)_
- [ ] **DEP-001** **DEP-001**: Согласовать пересекающиеся PR #124 и #126. #124 добавляет uv.lock и Python 3.12/3.13/3.14 matrix, обновляет pypdf до 6.21.4 с узким security cutoff; #126 повторяет dependency pins с pypdf 6.21.2 и меняет Node 22→24. Рекомендованный порядок: сначала принять #124 после exact-head checks, затем rebase/reconcile #126 на новый main и сохранить единый dependency/lockfile truth. _(исходный статус: OPEN; строка 750)_
- [ ] **AGENT-006** **AGENT-006**: Обновить PR #125 blueprint по результатам PR #128 и указанию владельца: 64 профессии — seed, не ceiling; минимум 5 параллельных workers рядом с main model; раздельные logical worker slots и backend-specific inference concurrency. _(исходный статус: OPEN; строка 751)_
- [ ] **TOK-004** **TOK-004**: Реализовать сохранение finish_reason и явное состояние incomplete для length/provider interruption; provider-specific continuation semantics и regression tests. _(исходный статус: OPEN; строка 752)_
- [ ] **TOK-005** **TOK-005**: Реализовать adaptive tool budgets и provider-specific inference pools/queues с main priority, backpressure и cancellation; acceptance — 5 параллельных workers + main request без cross-scope leakage. _(исходный статус: OPEN; строка 753)_
- [ ] **VERT-004** **VERT-004**: Выполнить fixture benchmark current parser vs MarkItDown vs Docling; выбрать одну пользовательскую conversion family для pilot и проверить локальный engine/license/security. _(исходный статус: OPEN; строка 754)_

### MASTER_TASK_REGISTRY_RU.md — F1. Landing V1 — постоянное улучшение текущего стека
- [ ] **LANDING-TRACK-003** **LANDING-TRACK-003**: Снять baseline метрик опубликованного лендинга и выбрать первый минимальный improvement slice. **Progress:** source baseline на PR #131: 26,139 символов HTML, 0 script tags, 0 external stylesheets/images/video/CSS URL assets; published LCP/INP/CLS и реальные network waterfalls пока не измерены. _(исходный статус: PARTIAL; строка 788)_
- [ ] **LANDING-TRACK-004** **LANDING-TRACK-004**: Вести цикл baseline → hypothesis → minimal patch → regression test → exact-head CI → state update на каждом рабочем заходе. **Progress:** PR #131 exact HEAD `b75303070cc06bee993555b979bc0a942466fe51`: Quality run `41120598763` passed all 7 jobs (Chromium: 100 passed; one unrelated Cloudflare provider test was flaky on first attempt but passed on retry; Context/Integrity/Security/Static/Jekyll and published root Pages smoke passed). Graphify `41120598741` passed. Landing-specific post-merge smoke was skipped because PR is not merged; native iPhone Safari/VoiceOver remain unverified. _(исходный статус: PARTIAL; строка 789)_

### MASTER_TASK_REGISTRY_RU.md — F2. Future workstreams — отдельные PR, не для случайного merge
- [ ] **GOVERNANCE-003** **GOVERNANCE-003**: Проставить маркировку на существующих agent/research PR. **Progress:** PR #125 переименован в [FUTURE — DO NOT MERGE] и остаётся Draft; PR #128 переименован в [RESEARCH — HOLD] и переведён в Draft; новый PR #129 создан как Draft. Остальные PR и label availability требуют отдельной проверки. _(исходный статус: PARTIAL; строка 796)_
- [ ] **GOVERNANCE-004** **GOVERNANCE-004**: Проверить repository rulesets/branch protection и только после согласования включить техническое enforcement. _(исходный статус: OPEN; строка 797)_
- [ ] **GOVERNANCE-005** **GOVERNANCE-005**: Синхронизировать ориентиры и этот реестр с PR #127 после подтверждённого merge. _(исходный статус: OPEN; строка 798)_

### MASTER_TASK_REGISTRY_RU.md — F3. Voice 2.0 — research-only
- [ ] **VOICE-004** **VOICE-004**: Собрать provenance-реестр ранее найденных и предоставленных владельцем источников; точное происхождение части исторических ссылок ещё проверить. _(исходный статус: PARTIAL; строка 805)_
- [ ] **VOICE-005** **VOICE-005**: Провести независимый обзор актуальных ASR/STT, TTS, streaming, VAD/AEC, diarization, translation, transliteration, normalization and voice-agent systems. _(исходный статус: OPEN; строка 806)_
- [ ] **VOICE-006** **VOICE-006**: Проверить кодовые, model, voice, phonemizer and dataset licenses plus redistribution restrictions. _(исходный статус: OPEN; строка 807)_
- [ ] **VOICE-007** **VOICE-007**: Сверить текущий код/тесты с полным Voice 2.0 acceptance matrix. _(исходный статус: OPEN; строка 808)_
- [ ] **VOICE-008** **VOICE-008**: Подготовить воспроизводимый RU/EN/TH golden-set benchmark and privacy/consent protocol. _(исходный статус: OPEN; строка 809)_
- [ ] **VOICE-009** **VOICE-009**: Сравнить shortlist на одинаковых данных и target hardware; не менять whisper.cpp/Piper до измеримого выигрыша. _(исходный статус: OPEN; строка 810)_
- [ ] **VOICE-010** **VOICE-010**: Подготовить staged architecture/API plan for future implementation; любые runtime slices требуют отдельного owner approval. _(исходный статус: OPEN; строка 811)_
- [ ] **VOICE-TRACK-010** **VOICE-TRACK-010** — independent security/privacy review and explicit owner approval before runtime changes; no runtime activation or dependency changes before the review gate. _(исходный статус: OPEN; строка 812)_
- [ ] **VOICE-011** **VOICE-011** — map every visible voice/audio control to a real handler, feature flag, runtime and test; label current/partial/planned states. _(исходный статус: OPEN; строка 813)_
- [ ] **VOICE-012** **VOICE-012** — implement selected-text TTS with selection boundaries, safe HTML stripping and cancellation. _(исходный статус: OPEN; строка 814)_
- [ ] **VOICE-013** **VOICE-013** — implement multi-message serial TTS queue with pause/resume/skip/stop and stale-request protection. _(исходный статус: OPEN; строка 815)_
- [ ] **VOICE-014** **VOICE-014** — benchmark true streaming turn-taking, VAD/endpointing, barge-in, echo/AEC and mobile audio lifecycle. _(исходный статус: OPEN; строка 816)_
- [ ] **VOICE-015** **VOICE-015** — research sound-effects/ambience/music generation as a separate adapter family; verify model and output licenses, consent, cost and export. _(исходный статус: OPEN; строка 817)_
- [ ] **VOICE-016** **VOICE-016** — define audio job artifacts: duration, codec, sample rate, source/model, checksum, retention and user export. _(исходный статус: OPEN; строка 818)_
- [ ] **VOICE-017** **VOICE-017** — compare LiveKit and Pipecat against current browser/FastAPI interfaces and target hardware; no migration until measured. _(исходный статус: OPEN; строка 819)_
- [ ] **VOICE-018** **VOICE-018** — add RU/EN/TH golden tests for code-switching, names, numbers, punctuation and noisy mobile recordings. _(исходный статус: OPEN; строка 820)_
- [ ] **AUDIO-GEN-001** **AUDIO-GEN-001** — verify Agent Audio source, releases, security posture and install permissions. _(исходный статус: OPEN; строка 821)_
- [ ] **AUDIO-GEN-002** **AUDIO-GEN-002** — review Stable Audio 3 Medium and T5Gemma terms independently. _(исходный статус: OPEN; строка 822)_
- [ ] **AUDIO-GEN-003** **AUDIO-GEN-003** — measure cold/warm RAM, disk, latency and throughput on actual target hardware. _(исходный статус: OPEN; строка 823)_
- [ ] **AUDIO-GEN-004** **AUDIO-GEN-004** — build a small RU/EN prompt set for sound effects, ambience and music; run blinded listening evaluation. _(исходный статус: OPEN; строка 824)_
- [ ] **AUDIO-GEN-005** **AUDIO-GEN-005** — test generated WAV metadata, clipping, silence, duration, sample rate and reproducibility. _(исходный статус: OPEN; строка 825)_
- [ ] **AUDIO-GEN-006** **AUDIO-GEN-006** — define artifact folder, provenance, user approval and cleanup. _(исходный статус: OPEN; строка 826)_
- [ ] **AUDIO-GEN-007** **AUDIO-GEN-007** — add an audio-generation Skill only after security/license review. _(исходный статус: OPEN; строка 827)_
- [ ] **AUDIO-GEN-008** **AUDIO-GEN-008** — compare at least one smaller model/backend before adopting Stable Audio 3 Medium. _(исходный статус: OPEN; строка 828)_
- [ ] **AUDIO-GEN-009** **AUDIO-GEN-009** — no model download or runtime activation without explicit owner approval. _(исходный статус: OPEN; строка 829)_

### MASTER_TASK_REGISTRY_RU.md — F4. Исторический общий backlog
- [ ] **REGISTRY-002** **REGISTRY-002**: Свести дубли и cross-link исторические пункты с текущим кодом, PR, tests and owner gates. Ничего не удалять до reconciliation. **Progress 2026-11-08:** full inventory audit recorded in section H: master 599 stable IDs (482 open / 95 partial / 22 done); addendum 128 stable IDs (46 open / 60 partial / 22 done). `REGISTRY-002` is the only shared ID between the two files; no duplicate or unnumbered checklist rows remain in either register. Source drift candidates after the first source corrections: USER_REQUEST has 113 open/partial source boxes vs 113 open/partial UR IDs after adding UR-310 for the remaining stop-control accessibility review; V016 is aligned at 27/27 after retiring the server-memory graph item; Landing UX has 24 open/partial boxes; its aServi provider-settings line is the same first-party routing goal as UR-272 and should be cross-linked rather than counted as a second task; V1 has 31 open/partial source boxes vs 37 registry open/partial rows; a text-level spot check found no confirmed status mismatch, while line-number-only mapping is stale and six registry rows are candidate newer owner/acceptance slices; LAUNCH has 46 open source boxes vs 48 canonical registry rows after cross-linking LAUNCH-217/271 → LAUNCH-122 and LAUNCH-278 → LAUNCH-126; the remaining two rows are more granular/cross-cutting acceptance items requiring description-level reconciliation. CHATSET and GUIDE now align after CHATSET-111/GUIDE-553 retirement reconciliation. VOICE2-106…112 → VOICE-004…010; VOICE2-113 → VOICE-TRACK-010; VOICE2EXT-080…087 → VOICE-EXT-001…008; USER126-254…258 → USER125-254…258. Distinct VOICE-011…018 and AUDIO-GEN-001…009 are now individually tracked in master; the Voice source crosswalk is complete. Preserve every source row until content-level mapping is complete. _(исходный статус: OPEN; строка 834)_

### MASTER_TASK_REGISTRY_RU.md — F5. Voice 2.0 — независимый research pass (2026-10-31)
- [ ] **VOICE-EXT-001** **VOICE-EXT-001**: Проверить Qwen3-ASR exact model-card license, inference backend and target-host resource profile. **Progress:** repository code license Apache-2.0 confirmed; exact weights terms and vLLM streaming footprint pending. _(исходный статус: PARTIAL; строка 839)_
- [ ] **VOICE-EXT-002** **VOICE-EXT-002**: Проверить Typhoon 115M exact model/NeMo compatibility, artifact hashes, CC-BY attribution and resource needs. **Progress:** model card reports CC-BY-4.0 weights, Apache-2.0 code, NeMo pinned runtime and H100 benchmark; target-host test pending. _(исходный статус: PARTIAL; строка 840)_
- [ ] **VOICE-EXT-003** **VOICE-EXT-003**: Build Thai code-switch benchmark slice with Latin/Thai entity preservation and raw-vs-normalized transcripts. _(исходный статус: OPEN; строка 841)_
- [ ] **VOICE-EXT-004** **VOICE-EXT-004**: Compare ICU, PyThaiNLP RTGS/thai2rom/TLTK and uroman on consented RU/TH fixtures; no runtime dependency yet. _(исходный статус: OPEN; строка 842)_
- [ ] **VOICE-EXT-005** **VOICE-EXT-005**: Verify uroman license and exact language-specific behavior before redistribution. _(исходный статус: OPEN; строка 843)_
- [ ] **VOICE-EXT-006** **VOICE-EXT-006**: Compare LiveKit vs Pipecat against current FastAPI/browser contracts and operational footprint; no migration. _(исходный статус: OPEN; строка 844)_
- [ ] **VOICE-EXT-007** **VOICE-EXT-007**: Extend voice acceptance matrix to full-duplex interruption, echo, Bluetooth, mobile lifecycle and diarization. _(исходный статус: OPEN; строка 845)_
- [ ] **VOICE-EXT-008** **VOICE-EXT-008**: Review audio/text retention, consent, user correction and privacy threat model. _(исходный статус: OPEN; строка 846)_

### MASTER_TASK_REGISTRY_RU.md — F6. Физическая изоляция future/research PR
- [ ] **GOVERNANCE-008** **GOVERNANCE-008**: Проверить GitHub rulesets/branch protection и запретить автоматический merge holding branch в main без explicit owner approval. _(исходный статус: OPEN; строка 855)_

### MASTER_TASK_REGISTRY_RU.md — F7. Deep Research 2.0 — отдельный workstream
- [ ] **DR2-004A** **DR2-004A**: Проверить текущие research/RAG/memory/local source/media/coding foundations; line-by-line audit and independent research still pending. **Progress:** repository code search + first independent primary-source pass completed; see `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md`. _(исходный статус: PARTIAL; строка 863)_
- [ ] **DR2-005A** **DR2-005A**: Выполнить 21 задачу DR2-001…DR2-021 из Deep Research 2.0 plan. **Progress:** external source pass completed (Local Deep Research, Khoj, Letta, Graphiti, OpenViking, browser file APIs, OpenHands sandbox, Comfy API v2, Runway, Vertex AI Veo); target browser/device and benchmark checks remain pending. _(исходный статус: PARTIAL; строка 864)_
- [ ] **DR2-006A** **DR2-006A**: После owner review подготовить отдельные минимальные implementation PR; не переносить будущие функции напрямую из holding branch. _(исходный статус: OPEN; строка 865)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — A. Functions / Agents menu — PR #131
- [ ] **MENU-001** **MENU-001** — inventory the Functions menu against `index.md`, `assets/css/landing.css` and `tests/e2e/app.spec.mjs`; finish the handler/permission/data-scope/evidence matrix. _(исходный статус: PARTIAL; строка 22)_
- [ ] **MENU-002** **MENU-002** — базовая иерархия уже существует как 4 группы (task workflow, research/sources, create/transform, connections); расширить вложенные категории Agents/Skills/Files/Media/Models/Tasks без дублирования. _(исходный статус: PARTIAL; строка 23)_
- [ ] **MENU-003** **MENU-003** — текущие roadmap items уже показывают non-runtime ticker и пояснение; формализовать единый status model для всех карточек. _(исходный статус: PARTIAL; строка 24)_
- [ ] **MENU-004** **MENU-004** — текущий agent panel уже показывает mode, team blueprint, use cases, 64 roles, orchestration, models/resources and capabilities; добавить Skill binding, data scope, budgets, approvals and outputs по мере появления реальных handlers. _(исходный статус: PARTIAL; строка 25)_
- [ ] **MENU-005** **MENU-005** — сейчас доступны direct response и sequential four-stage workflow; остальные режимы оставить roadmap-only до независимого runtime. _(исходный статус: PARTIAL; строка 26)_
- [ ] **MENU-006** **MENU-006** — текущие chat profile/team blueprint controls существуют; расширенные model/skill/data/permission/resource/history controls требуют реальных backing APIs. _(исходный статус: PARTIAL; строка 27)_
- [ ] **MENU-007** **MENU-007** — `1ИÆИT10И` tickers, pause controls, reduced-motion CSS and non-runtime notes exist; E2E assertions are authored, but exact-head execution is pending. _(исходный статус: PARTIAL; строка 28)_
- [ ] **MENU-008** **MENU-008** — RU/EN labels and Chromium keyboard path now covered: native summary opens on Enter; panel/menu close on Escape and focus returns to summary; modal moves focus to Close and traps Tab/Shift+Tab; close-button accessible name localizes RU/EN; 320px mobile options assert ≥44px hit targets and no horizontal overflow. Duplicate-control inventory: exactly three top-level actions; the Agents link inside Deep Research is intentional contextual navigation to the same panel, not a fourth menu entry. Exact-head Quality is pending; VoiceOver still requires manual iPhone/Safari verification. _(исходный статус: PARTIAL; строка 29)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — B. Skill Factory и Agent Builder — PR #125 / PR #128
- [ ] **SF-001…SF-007** — Skill lifecycle: source ingestion, evidence/provenance, manifest, license/security scans, generated evals, human review, versioning/rollback. _(исходный статус: OPEN; строка 35)_
- [ ] **AB-001…AB-005** — Agent blueprint: role, Skill versions, model policy, capability scopes, data scope, budgets, approvals, dry-run/evals. _(исходный статус: OPEN; строка 36)_
- [ ] **AW-SK-001…AW-SK-005** — threat model и adversarial tests для imported Skills; inert-by-default scripts. _(исходный статус: OPEN; строка 37)_
- [ ] **AW-UI-001…AW-UI-002** — отображать реальные worker states/concurrency отдельно от inference slots. _(исходный статус: OPEN; строка 38)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — C. Компактные модели / SLM — PR #125
- [ ] **SLM-002** **SLM-002** — подготовить одинаковый RU/EN/TH golden set и схемы для каждого узкого сценария. _(исходный статус: OPEN; строка 48)_
- [ ] **SLM-003** **SLM-003** — измерить cold load, RAM/PSS, VRAM, TTFT, p50/p95, tokens/sec, concurrency and cancellation на целевом хосте. _(исходный статус: OPEN; строка 49)_
- [ ] **SLM-004** **SLM-004** — зафиксировать immutable model digest, quantization, tokenizer/template, runtime, code/weights/dataset licenses. _(исходный статус: OPEN; строка 50)_
- [ ] **SLM-005** **SLM-005** — сравнить с main-only baseline и включать не более одного helper model за раз; default remains off until owner approval. _(исходный статус: OPEN; строка 51)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — C. Voice и audio generation — PR #129
- [ ] **AUDIO-UI-001** **AUDIO-UI-001** — разделить ASR, TTS/voice conversation, non-speech audio generation и post-processing. _(исходный статус: OPEN; строка 56)_
- [ ] **AUDIO-UI-002** **AUDIO-UI-002** — preview/accept/reject, artifact provenance, project attach only after explicit approval. _(исходный статус: OPEN; строка 57)_
- [ ] **AUDIO-SKILL-001** **AUDIO-SKILL-001** — описать media-production Skill с cue sheet, sound generation, audition, sync and export. _(исходный статус: OPEN; строка 58)_
- [ ] **AUDIO-SMALL-001** **AUDIO-SMALL-001** — сравнить компактные модели/backends с baseline на target hardware; не принимать parameter count за benchmark. _(исходный статус: OPEN; строка 59)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — D. Deep Research, local files, conversion, video — PR #130
- [ ] **LSV-001…LSV-014** — browser permissions, local Source Vault, consent/storage modes, extraction, deletion lineage, screenshot-to-code, video workflows and archive policy. _(исходный статус: OPEN; строка 65)_
- [ ] **LSV-015** **LSV-015** — capability matrix File System Access across desktop/mobile browsers. _(исходный статус: OPEN; строка 66)_
- [ ] **LSV-016** **LSV-016** — fallback upload/drag-drop for unsupported browsers. _(исходный статус: OPEN; строка 67)_
- [ ] **LSV-017** **LSV-017** — decide if persistent directory watchers require a local companion; no public filesystem endpoint. _(исходный статус: OPEN; строка 68)_
- [ ] **CONV-001** **CONV-001** — compare Docling with existing parser on RU/EN/TH corpus and resource budgets. _(исходный статус: OPEN; строка 69)_
- [ ] **CONV-002** **CONV-002** — validate screenshot-to-code quality with golden screenshots, no-execution review workspace. _(исходный статус: OPEN; строка 70)_
- [ ] **CONV-003** **CONV-003** — define image→OCR/VLM, page→HTML/CSS, audio→transcript, video→frames/transcript workflows and provenance. _(исходный статус: OPEN; строка 71)_
- [ ] **VIDEO-001** **VIDEO-001** — benchmark ComfyUI/Wan candidate only on suitable GPU hardware and with exact model/checkpoint license review. _(исходный статус: OPEN; строка 72)_
- [ ] **ARCHIVE-001** **ARCHIVE-001** — upstream watchlist: exact versions, SHA-256, source/model/dataset licenses, dependencies, storage size and preservation reason. _(исходный статус: OPEN; строка 73)_
- [ ] **ARCHIVE-002** **ARCHIVE-002** — mirror only after explicit approval and only when licenses/terms permit; never commit weights to Git. _(исходный статус: OPEN; строка 74)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — E. Общие acceptance gates
- [ ] **GATE-001** **GATE-001** — capability maturity matrix partially recorded in `docs/ALANDI_SYSTEMS_MAP_RU.md` (18 systems; current/partial/prototype/specified boundaries). Recent correction: aServi, Functions/Deep Research/Skills and AgentRunStore now reflect merged-main maturity. Fine-grained per-capability evidence and full subsystem sweep remain OPEN. _(исходный статус: PARTIAL; строка 80)_
- [ ] **GATE-002** **GATE-002** — threat model for local file access, untrusted documents, archive bombs, prompt injection, path traversal, malicious scripts and generated code. _(исходный статус: OPEN; строка 81)_
- [ ] **GATE-003** **GATE-003** — verify code, model weights, tokenizer, voice, dataset and workflow licenses independently. _(исходный статус: OPEN; строка 82)_
- [ ] **GATE-004** **GATE-004** — record actual disk/RAM/VRAM/latency/quality on target hardware; no extrapolation from model size. _(исходный статус: OPEN; строка 83)_
- [ ] **GATE-005** **GATE-005** — add exact-head tests and update canonical project state after each bounded implementation stage. _(исходный статус: OPEN; строка 84)_
- [ ] **GATE-006** **GATE-006** — require explicit owner approval before model downloads, runtime/dependency changes, external sync, destructive file operations, deployment or merge. _(исходный статус: OPEN; строка 85)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — F. Chromium and responsive follow-up — PR #131
- [ ] **MENU-011** **MENU-011** — Agent panel: сгруппировать пять future capability sections в три native RU/EN disclosures (use cases/roles; orchestration/models/resources; tools/permissions); сохранить 44px hit targets, keyboard Enter/Space и работу ticker pause. Source/test/documentation committed on PR #131; exact-head Quality/Chromium is still unverified. _(исходный статус: PARTIAL; строка 100)_
- [ ] **E2E-UI-001** **E2E-UI-001** — project settings test now opens the actual project settings modal before using the current-chat project selector. _(исходный статус: PARTIAL; строка 104)_
- [ ] **E2E-UI-002** **E2E-UI-002** — chat-row move/Undo test seeds two projects and one chat, avoiding unrelated queued creation toasts; asserts restored project and stable chat ID. _(исходный статус: PARTIAL; строка 105)_
- [ ] **E2E-UI-003** **E2E-UI-003** — memory tests now open the outer Memory disclosure before interacting with nested Memory tools; privacy opt-in assertions remain unchanged. _(исходный статус: PARTIAL; строка 106)_
- [ ] **A11Y-UI-001** **A11Y-UI-001** — scope ticker locators to the first intended ticker where multiple cards exist; retain reduced-motion and explicit pause checks. _(исходный статус: PARTIAL; строка 108)_
- [ ] **MOBILE-001** **MOBILE-001** — restore 44px new-chat target on mobile despite later sidebar overrides. _(исходный статус: PARTIAL; строка 109)_
- [ ] **MOBILE-002** **MOBILE-002** — remove extra 12px composer-footer padding on short mobile viewports while preserving the device safe-area inset. _(исходный статус: PARTIAL; строка 110)_
- [ ] **MOBILE-003** **MOBILE-003** — reduce clock shell to 56px at <=360px to recover header title width without forcing horizontal overflow. _(исходный статус: PARTIAL; строка 111)_
- [ ] **MOBILE-004** **MOBILE-004** — review actual Chromium screenshots at 320/360/390/768/1024/1440px and manually verify iPhone Safari/VoiceOver. _(исходный статус: OPEN; строка 112)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Продолжение владельца — 2026-11-05
- [ ] **VOSK-2026-002** **VOSK-2026-002** — run same-audio RU golden-set comparison against current whisper.cpp baseline; record WER/CER, RTF, cold/warm latency, peak RSS/PSS, CPU and microphone/noise results on target hardware. No model-quality claim before measurement. _(исходный статус: OPEN; строка 128)_
- [ ] **LANDING-V2-2026-001 — OWNER-PRIORITY DELIVERY (2026-11-13).** Replace the previous frozen/post-landing deferral: the owner now requires a fully working local-first aLandi workstation as the priority product outcome. Canonical scope and phased acceptance are recorded in section K below. Reuse/cross-link existing UI-PROMO-001, FUNCTIONS-DETAIL-001/002, MENU-001…011, UR-080/117…119/226/251…264/290…291, V016-163…172/186/189, LAUNCH-239…256/269…279, VOICE-004…018, SLM-001…005, SF/AB/AW, GATE-001…006, AUDIT-002/004/005/008/010, FIX-006/007, EV-AGENT-RUN-STORE-001, VOSK-2026-001/002, and issue #111. Do not create a parallel backlog. Current active implementation work must converge to main; at steady state retain at most one active product/landing PR. _(исходный статус: PARTIAL; строка 129)_
- [ ] **GRAPHIFY-UI-2026-001** **GRAPHIFY-UI-2026-001** — PR #131 static UI Surface bridge now separates exact selectors (0.65 heuristic score) from token-overlap candidates (0.25), distinguishes classList mutations from DOM selection, and removes nearest-previous-function ownership guesses. Graphify pilot passed on code/test HEAD `c79e983a57d6cc2b87a9296a1334e6d6ed5b3479`; final PR Quality #41981955002 was still running at this checkpoint. Static inference is not browser-computed style or AST-level proof. _(исходный статус: PARTIAL; строка 130)_
- [ ] **CLEANUP-2026-001** **CLEANUP-2026-001** — stale PRs #124, #126, #132, #133 and #141 were closed after their replacements landed. PR #127 was closed after replacement PR #146 passed exact-head Freshness/Quality/Provenance and carried the complete registry. Keep #125/#128/#129/#130 as isolated Draft/HOLD research workstreams, #131 as active V2, #134 as prototype HOLD. GitHub connector currently exposes no direct branch-delete action; do not claim those branches are deleted. Recheck unique commits before any future deletion. _(исходный статус: PARTIAL; строка 131)_
- [ ] **OWNER-GATE-2026-001** **OWNER-GATE-2026-001** — keep Issue #111 open for owner-controlled ruleset, live host, deployment, target-hardware, native device and credentials gates. Do not close it merely to clear the queue. _(исходный статус: OPEN; строка 132)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G1. Завершить ранее начатую безопасную очистку Git
- [ ] **HYGIENE-001** **HYGIENE-001** — получить полный live inventory branches, tags, open/closed PRs и default branch; различить merged, superseded, abandoned, active research, backup и protected refs. _(исходный статус: PARTIAL; строка 143)_
- [ ] **HYGIENE-002** **HYGIENE-002** — для каждого кандидата на удаление проверить merged PR / equivalent tree or commit ancestry, unique commits, exact SHA, open PR/issue/release/workflow references и последний полезный код/документы. _(исходный статус: PARTIAL; строка 144)_
- [ ] **HYGIENE-003** **HYGIENE-003** — подготовить reviewable allowlist с доказательствами и отдельный preserve-list; не удалять main, default, active V2, future/research, backup/archive или незавершённые направления. _(исходный статус: PARTIAL; строка 145)_
- [ ] **HYGIENE-004** **HYGIENE-004** — выполнить удаление только подтверждённых merged/superseded refs после проверки доступного безопасного delete API и owner authorization; если инструмент не поддерживает branch deletion, оставить кандидатов нетронутыми и выдать точные команды/список. _(исходный статус: OPEN; строка 146)_
- [ ] **HYGIENE-005** **HYGIENE-005** — после cleanup повторно сверить branch/PR queue, защиту main, unique commits и ссылочную целостность; записать точный результат и rollback feasibility. _(исходный статус: OPEN; строка 147)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G2. Независимый инженерный аудит — роль External Debugger / Architecture Reviewer
- [ ] **AUDIT-001** **AUDIT-001** — зафиксировать audit baseline (main SHA, active PR heads, dependency/lock/workflow versions) и scope; не смешивать состояние main с экспериментальными ветками. _(исходный статус: PARTIAL; строка 151)_
- [ ] **AUDIT-002** **AUDIT-002** — проследить end-to-end продуктовые потоки UI → browser storage → API/gateway → adapters/providers → persistence/search/memory; проверить контракты, state transitions, data scope и graceful failure. _(исходный статус: PARTIAL; строка 152)_
- [ ] **AUDIT-003** **AUDIT-003** — проверить Python backend: async/sync boundaries, cancellation/timeouts, subprocess lifecycle, concurrency/locking, retries/idempotency, validation, resource bounds, typing, error handling и current API/framework idioms. _(исходный статус: PARTIAL; строка 153)_
- [ ] **AUDIT-004** **AUDIT-004** — проверить HTML/CSS/vanilla JS client: module boundaries, event/listener lifecycle, DOM safety/XSS, storage migrations, race/stale responses, accessibility, responsive behavior, browser compatibility и duplicated state. _(исходный статус: PARTIAL; строка 154)_
- [ ] **AUDIT-005** **AUDIT-005** — проверить все integrations/connections: auth and scopes, CORS, provider isolation, secrets/logging, external API contracts, timeouts/rate limits, fallback behavior, failure recovery и tests with mocks. _(исходный статус: PARTIAL; строка 155)_
- [ ] **AUDIT-006** **AUDIT-006** — проверить dependency/lockfile/CI/workflow supply chain: pinned immutable actions, permissions, caches/artifacts, Python/Node matrices, freshness policy, licenses/provenance и reproducibility. _(исходный статус: PARTIAL; строка 156)_
- [ ] **AUDIT-007** **AUDIT-007** — проверить архитектурное единство: canonical source of truth, naming/API/schema compatibility, duplicated implementations, stale docs, contradictory status claims, feature flags и boundaries between V1/V2/research/prototype. _(исходный статус: PARTIAL; строка 157)_
- [ ] **AUDIT-008** **AUDIT-008** — провести security/privacy pass: trust boundaries, prompt injection, local file/archive parsing, path traversal, SSRF, SQL/XSS, authorization, deletion lineage, sensitive data retention and abuse/resource exhaustion. _(исходный статус: PARTIAL; строка 158)_
- [ ] **AUDIT-009** **AUDIT-009** — подготовить независимый report с FACT / HYPOTHESIS / PROPOSAL, severity P0–P3, evidence (path/line/test/SHA), impact, reproduction, confidence, owner decision needed и acceptance gate. Не объявлять «независимого агента» — аудит выполняется текущим исполнителем в отдельной роли. _(исходный статус: PARTIAL; строка 159)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G3. Исполнение подтверждённых улучшений
- [ ] **FIX-001** **FIX-001** — преобразовать подтверждённые audit findings в дедуплицированные задачи этого реестра/существующих канонических workstreams; назначить приоритет, scope, acceptance и rollback. _(исходный статус: PARTIAL; строка 163)_
- [ ] **FIX-002** **FIX-002** — исправлять минимальными вертикальными slices в разрешённых ветках; сначала регрессионный тест, затем patch; не менять больше одной крупной архитектурной переменной за цикл. _(исходный статус: PARTIAL; строка 164)_
- [ ] **FIX-003** **FIX-003** — после каждого slice выполнить focused tests, статические/security checks по затронутой поверхности и полный обязательный exact-HEAD CI перед merge. _(исходный статус: PARTIAL; строка 165)_
- [ ] **FIX-004** **FIX-004** — интегрировать в main только V1-совместимые, проверенные и одобренные изменения; PR #131 и Future/Research/Draft workstreams не вливать целиком. _(исходный статус: PARTIAL; строка 166)_
- [ ] **FIX-005** **FIX-005** — после merge перепроверить post-merge main SHA/checks и обновить существующие canonical state/orientation/log записи; deployment и live-host verification остаются отдельными gates. _(исходный статус: OPEN; строка 167)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G4. Целостность и функциональная приёмка
- [ ] **INTEGRITY-001** **INTEGRITY-001** — проверить связность навигации/документации/реестров и отсутствие потерянных owner requirements; подтвердить ссылки, anchors, IDs, workflow manifests и machine-readable state. _(исходный статус: PARTIAL; строка 171)_
- [ ] **INTEGRITY-002** **INTEGRITY-002** — выполнить regression matrix основных сценариев чата, истории, проектов, импорта/экспорта, настроек, provider routing, tools/research, memory/RAG, voice и document intake с точным разделением mocked CI и live runtime. _(исходный статус: OPEN; строка 172)_
- [ ] **INTEGRITY-003** **INTEGRITY-003** — проверить schema/data compatibility и миграции browser storage / SQLite / API payloads; проверить backward compatibility и failure recovery без повреждения пользовательских данных. _(исходный статус: PARTIAL; строка 173)_
- [ ] **INTEGRITY-004** **INTEGRITY-004** — подтвердить согласованность UI claims, feature flags, backend capabilities, tests, docs и release state; убрать/исправить только доказанные противоречия. _(исходный статус: PARTIAL; строка 174)_
- [ ] **INTEGRITY-005** **INTEGRITY-005** — зафиксировать непроверяемые без owner device/credentials/host условия (iPhone/VoiceOver, VPS/Tunnel/Ollama, OAuth, real providers, target hardware) как OPEN, не подменяя их CI. _(исходный статус: PARTIAL; строка 175)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G6. Follow-up tasks from phase-1 report
- [ ] **FIX-006** **FIX-006** — move Pyodide execution to a dedicated Worker or isolated execution surface; add timeout/termination, memory/output bounds and tests proving no page-origin access. Do not claim complete sandbox before this gate. _(исходный статус: OPEN; строка 195)_
- [ ] **FIX-007** **FIX-007** — design a bounded document-extraction concurrency gate when the feature is enabled; add cancellation, queue saturation and memory-pressure regressions. _(исходный статус: OPEN; строка 196)_
- [ ] **FIX-008** **FIX-008** — browser asset inventory recorded in `docs/REPOSITORY_HYGIENE_RU.md` §15: Tailwind Play CDN is mutable and officially development-only; marked 18.0.14 and DOMPurify 3.4.16 are versioned but lack SRI. Static Tailwind build + local/versioned vendor assets recommended. No guessed hashes or runtime/build changes; implementation and exact-head visual regression remain OPEN. _(исходный статус: PARTIAL; строка 197)_
- [ ] **HYGIENE-006** **HYGIENE-006** — delete only the verified allowlist after an authorized branch-delete API/UI is available; preserve every branch HEAD SHA and recheck open references immediately before deletion. _(исходный статус: OPEN; строка 198)_
- [ ] **AUDIT-010** **AUDIT-010** — finish subsystem review of provider routing, browser storage migrations, voice/audio lifecycle, RAG deletion lineage, V2 candidate slices and native device/runtime behavior. _(исходный статус: OPEN; строка 199)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Browser persistence integrity and follow-up debugger findings — 2026-11-05
- [ ] **AUDIT-FIND-011 — P1 localStorage recovery/data integrity.** Confirmed in `index.md`: project JSON parse/shape failures were silently reduced to an empty list without preserving raw data; partially invalid chat arrays could drop records without backup; `persistChats()` wrote chat list and current ID separately without rollback; create/delete/import project operations could partially persist while showing success. PR #150 branch `fix/browser-storage-recovery-atomicity-20261105` implements raw recovery backups, fail-closed behavior when backup creation fails, direct download of original raw payload, rollback for chat/current and project/chat writes, in-memory rollback, success-state gating, import bounds and four Chromium regressions. **Status: IMPLEMENTED IN PR #150; exact-head Quality (7 jobs), Freshness, Provenance and Graphify PASS. PR remains open/unmerged; owner review/merge decision pending.** _(исходный статус: PARTIAL; строка 206)_
- [ ] **FIX-009 — transactional browser persistence.** Exact-head CI and injected-quota Chromium rollback regressions pass on PR #150 HEAD `0c2cf9f15c9cef6053487e5f01adadcb8917115e`. Before closure, complete manual diff/call-site review and owner merge decision; keep localStorage keys/version compatibility unchanged. _(исходный статус: PARTIAL; строка 207)_
- [ ] **UNVERIFIED** **AUDIT-FIND-012 — P2 conditional FTS5 secure-delete capability.** `MemoryManager` only enables the FTS5 `secure-delete` option on SQLite 3.42.0+; on older SQLite the capability flag is false but logical deletion still proceeds. The capability is not exposed through health/status APIs. Deleted FTS entries may remain in index segments until merge; logical deletion is not forensic erasure. Runtime SQLite version and feature enablement on the target host are **UNVERIFIED**. Reference: https://www.sqlite.org/fts5.html#the_secure_delete_configuration_option. _(исходный статус: OPEN; строка 208)_
- [ ] **FIX-010 — surface FTS5 deletion capability.** Report SQLite runtime version and FTS5 secure-delete capability in a health/diagnostic surface; document the deletion guarantee accurately; test supported and unsupported SQLite versions before enabling MemoryGraph/RAG on a host. _(исходный статус: OPEN; строка 209)_
- [ ] **AUDIT-011 — target-host SQLite/runtime verification.** Verify the actual VPS Python-linked SQLite version, FTS5 availability, feature flags and deletion behavior; do not infer from CI's Python runtime. _(исходный статус: OPEN; строка 210)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — H. Owner priority reset and recurring requirements — 2026-11-07 (append-only)
- [ ] **UI-PROMO-001 — owner UI backlog §§8.1–8.17 and later requirements (P1; IN PROGRESS / PARTIALLY PUBLISHED).** Canonical scope remains `docs/V1_UI_FINALIZATION_RU.md` plus existing MENU/UI/E2E/MOBILE IDs; deduplicate and enrich, do not create another backlog. §8.8 icon-first message actions are merged via PR #157; §8.1 sidebar swipe-to-close is merged via PR #161 at `094e249860b651166d4d1029f175e97a5cea2345`. §8.17 adjustable readability controls are **IMPLEMENTED, MERGED and PUBLISHED** via PR #166 at main SHA `c4f23e03f563d03213eb87002863da630fc8b833`: message font size 14–22 px, line-height 1.4–2.0, and standard/high-contrast color scheme; users access them in the root app's global gear/settings → “Читаемость текста”. Exact PR-head Quality #42368514164 (7/7) and Graphify #42368514210 passed; post-merge Pages #42372745873 and main Quality #42372746360 passed, including 116 Chromium tests and canonical root/landing exact SHA checks. Remaining UI scope stays OPEN. PR #154 remains stale/diverged (base `f323b6f339d454dad6e820a4074fa230acc7b6df`, head `6ca47522d7d6998916b1b01931c217d8b7e76c75`); prior Quality #42349173942 failed 17 E2E + 1 flaky and Freshness #42349173878 failed. **Do not merge #154 as-is or weaken tests.** Reconcile only useful slices against current main, preserving #147/#148/#150; repair real behavior/selector failures and rerun exact-head Quality/Freshness/Provenance/Graphify. #131 remains a selective workbench, never wholesale merge. Native iPhone Safari/VoiceOver/manual visual acceptance remains open. _(исходный статус: PARTIAL; строка 225)_
- [ ] **SRC-001 — grouped external-source research and artifact acquisition (P2).** Continue `INTEL.md` and the existing source-selection method. **Progress (2026-11-07):** reviewed the owner's full named list against official upstream repositories/README/license/docs/release notes; recorded exact branch HEADs, declared code/model licenses, capabilities, security/privacy constraints and triage decisions in `INTEL.md` and `docs/OPEN_SOURCE_TRIAGE_RU.md`. Candidates include two distinct, ambiguous Flint repositories; DashBeam; img2threejs; ArchiveBox; SearXNG; Ponytail; changedetection.io; LocalSend + protocol; MiroFish; Edge-Drop; Craft Anything; Agent Lightning; Datalab Marker/Surya; diagram-design; HarnessRouter; Sound Center; PocketPal AI; and sammyZi/pdf-tools. **No code, model, binary, dataset or Skill was downloaded, installed, copied or activated.** Next: run bounded baseline comparisons for SearXNG, Marker/Surya and changedetection.io only when prioritized; review HarnessRouter contracts separately. For each acquisition: exact upstream revision, source URL, separate code/weight/data license, SHA-256, provenance, target fit and storage policy. Do not bulk-mirror restricted/oversized weights or activate unapproved runtime; require explicit review and owner approval before downloads or adoption. _(исходный статус: PARTIAL; строка 227)_
- [ ] **HYGIENE-007 — verified obsolete-code and branch/PR cleanup (P3).** Identify exact dead/duplicate code through references, dependency/call-site review, tests and architecture evidence; remove only after rollback review. Selectively consolidate useful PR work into #131 or main; preserve backup/orientation/active-scope/evidence-bearing work. No branch/PR/history deletion without explicit owner approval and fresh reference checks. _(исходный статус: OPEN; строка 228)_
- [ ] **CHAT-001 — continuity and failure-resistant checkpointing (P1).** Owner reports recent ChatGPT chats can hang/error, then history becomes inaccessible and the work must be discarded. Mitigate what the repository/workflow can control: compact durable checkpoints containing task ID, branch/HEAD, changed artifacts, exact checks, blockers and next step; avoid repeated context requests, duplicate implementations and oversized handoffs. Do not claim this fixes the ChatGPT client/history failure itself; investigate it as a separate product/client issue only with reproducible evidence. _(исходный статус: OPEN; строка 229)_
- [ ] **OWNER-REQ-001 — task capture invariant.** Before execution, search canonical register for each newly stated owner goal; add a new stable task ID or enrich existing entry. Maintain original goals and relative order even when higher priority work temporarily supersedes them. No silent dropping, duplicate backlog, or status upgrade without evidence. _(исходный статус: OPEN; строка 230)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — I. Owner execution contract — 2026-11-08 (append-only)
- [ ] **MAIN-ONLY-001 — one durable product baseline.** Keep `main` as the only durable product baseline. Use temporary PRs only for bounded exact-head verification and merge promptly after all required gates pass. Audit every open PR; port compatible value; do not merge stale/conflicting/draft/future/V2 work wholesale. Close superseded PRs only after a file-by-file reconciliation and a recorded reason. **Acceptance:** no completed slice remains parked; every remaining open PR has a current owner-approved disposition and explicit next action. _(исходный статус: PARTIAL; строка 245)_
- [ ] **SYSTEMS-MAP-001 — compact system/subsystem inventory.** Maintain `docs/ALANDI_SYSTEMS_MAP_RU.md` as the concise canonical catalog of systems, implementation surfaces, methods and maturity. Cross-link `docs/ALANDI_ARCHITECTURE_MAP_RU.md` for code-level detail. **Acceptance:** each listed system has source paths, current method, maturity and a clear unverified boundary; no second backlog is created. _(исходный статус: PARTIAL; строка 246)_
- [ ] **AGENT-CONTRACT-001 — effective English operating instruction.** Keep `AGENTS.md` short and operational: live orientation, one active slice, exact-head verification, source quality, main-first delivery, durable recording and product invariants. `NOW.md` is the sole first-read checkpoint and owner-request/action journal. **Acceptance:** a fresh session can identify the next safe action from repository state and one checkpoint. _(исходный статус: PARTIAL; строка 247)_
- [ ] **CONTINUITY-001 — step-level durable evidence.** Record every owner prompt verbatim and every material stage in `NOW.md`; update the current checkpoint and next action in that same file. Record branch/PR/HEAD, changed files, check IDs/results, what was not checked, rollback and next step. Do not store chat transcripts or private reasoning. **Acceptance:** no material step needs to be repeated after a new chat. _(исходный статус: PARTIAL; строка 248)_
- [ ] **SRC-002 — recurring thematic source batches.** Continue from the existing `INTEL.md` inventory (310 distinct URL references / 183 GitHub repositories at the 2026-11-08 count). Review 8–15 high-signal sources per thematic batch and occasionally run a cross-cutting sweep. Prefer primary sources; record revision, date, license, evidence, resource fit, decision and limits. Preserve prior research and distinguish source-validated from accepted/implemented. _(исходный статус: PARTIAL; строка 249)_
- [ ] **ARTIFACT-001 — controlled source/model acquisition.** Owner authorizes acquisition of useful tools and model artifacts. For each selected item verify upstream revision, separate code/weights/data/voice license, provenance, SHA-256, size, security, privacy and target hardware. Keep manifests and verification scripts in Git. Do not put weights in the GitHub Pages source tree: Git LFS is unsupported by Pages. Use a model cache/registry or governed GitHub Release asset where legal and within limits. Do not bulk-download unrelated or oversized assets. _(исходный статус: PARTIAL; строка 250)_
- [ ] **PAGES-002 — post-integration release verification.** Preserve the official GitHub-managed main-push Pages path. After every integration verify the Pages deployment and canonical published content against the exact merge SHA; do not add duplicate deployment workflows or claim VPS health from Pages checks. _(исходный статус: PARTIAL; строка 251)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J. Owner directive — orchestration, main-only delivery, systems inventory and source loop (2026-11-08)
- [ ] **ORIENT-004 / MAIN-ONLY-001 — operational handoff and PR completion.** Replace inefficient orchestration with a compact main-first Session Sync Capsule: live main SHA, PR queue (base/head/status/draft), issues, exact-head checks, Pages status; select task from owner intent + canonical register. One active bounded implementation lane. Merge only exact-head green compatible scope; after merge run main integrity/quality and end-to-end Pages checks; close superseded/parking PRs only after preserving value and recording reason. Append compact checkpoint at each material step to VOLLEY_LOG and synchronize orientation/state records only when facts change. No dangling completed PRs. _(исходный статус: PARTIAL; строка 279)_
- [ ] **SYS-MAP-001 — whole-product systems/subsystems/methods inventory.** Use existing docs/ALANDI_SYSTEMS_MAP_RU.md as canonical map (no duplicate catalog); trace every listed subsystem to source files, contracts, tests, maturity and dependencies. Review methods against current primary sources and the existing technique register; promote replacements only with evidence/baseline/rollback. Record gaps and versioned changes. _(исходный статус: PARTIAL; строка 280)_
- [ ] **INSTR-001 — concise English executor contract.** Replace AGENTS.md with the compact owner-focused operating contract: main-only durable baseline; oledue/ORIENTER live sync; one canonical register; sequential bounded delivery; exact-head verification; immediate authorized merge and main/Pages post-check; durable Volley checkpoints; research/license/security/provenance gates; no speculative runtime. _(исходный статус: PARTIAL; строка 282)_
- [ ] **PAGES-LIVE-001 — verify auto-publication.** After each authorized main integration, confirm GitHub-managed Pages deployment on the exact merge SHA and cache-busted public root/asset version. Diagnose/repair existing auto-publish mechanism if broken; do not infer live deployment from build success. _(исходный статус: PARTIAL; строка 283)_
- [ ] **ACQUIRE-001 — governed acquisition.** For useful models/tools/microtechnologies/plugins/skills, assess concrete task fit, source/version, license, checksum, provenance, storage, budget and target hardware. Download into repository only where size, redistribution rights and repository policy permit; model weights must use suitable governed asset storage, not Pages source tree/Git LFS. Pilot before runtime adoption. _(исходный статус: PARTIAL; строка 284)_
- [ ] **FUNCTIONS-DETAIL-002 — owner-directed Functions panel detail.** Preserve three truthful entrypoints (Agents/structured analysis, Deep Research, Skills/task profile) while expanding their details: current runtime behavior vs roadmap; role/workflow, model/resources, tools/permissions; research effort/web orthogonality; skill lifecycle/profile/output. Modal backdrop blur and focus/escape/close lifecycle are explicit acceptance. Integrations remain hidden absent real registry/status/permissions. Research Studio stays retired. _(исходный статус: PARTIAL; строка 285)_
- [ ] **PR-QUEUE-001 — consolidate the live PR queue into main.** Owner's explicit 2026-11-08 instruction: merge every currently open PR after its final exact-head required checks pass. Live queue is currently only PR #174; merge it when green, then verify main Quality and Pages on the exact merge SHA. Closed/stale/HOLD PRs #125/#131/#152/#154/#155/#168/#171/#172 are not to be merged wholesale; selectively preserve compatible unique work and keep their deferred tasks in the canonical register. _(исходный статус: PARTIAL; строка 286)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J.4 AgentRun state persistence prototype — 2026-11-08 (PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2`; prototype only)
- [ ] **EV-AGENT-RUN-STORE-001** **EV-AGENT-RUN-STORE-001** — evaluation definition exists; backup/restore, retention, multi-host, recovery semantics and adversarial runtime tests remain OPEN. _(исходный статус: PARTIAL; строка 313)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J.6 Full checklist and supply-chain audit — 2026-11-08
- [ ] **REGISTRY-002 source reconciliation:** candidate source drift is recorded in the main registry section H. Current count deltas after source corrections: USER_REQUEST 113 open/partial vs 112 UR open/partial IDs (+1 candidate); V016 aligned 27/27; Landing UX 24 vs 23 UX open/partial IDs (+1 candidate); V1 30 source open/partial vs 37 registry open/partial; LAUNCH 46 source open vs 51 registry rows; VOICE2 17 source open/partial vs 8 VOICE2 IDs, with overlap against VOICE/VOICEAUDIT/LAUNCH. CHATSET and GUIDE now align after retirement updates. V1/LAUNCH/VOICE still need content-level mapping before status changes. _(исходный статус: OPEN; строка 328)_
- [ ] **ACTION-TRANSITIVE-001** **ACTION-TRANSITIVE-001** — the pinned `skills/exercise-toolkit` reusable workflow revision `ebf43bb96882683e03e667184c6445ed4c8074e6` has 14 nested mutable action references across three workflows. `start-exercise.yml` grants workflow-wide `contents/actions/issues: write`, although only `disable_workflows` needs `actions: write`, `create_exercise` needs `issues: write`, and `update_readme` needs `contents: write`; `finish-exercise` uses contents+issues write in one job; `find-exercise-issue` uses issues read. Local pin checker does not recurse into upstream dependencies. Replace/fork with reviewed local equivalents or pin nested dependencies and reduce permissions before closing #111. _(исходный статус: OPEN; строка 332)_

## 4B. Retired by owner — do not restore
### MASTER_TASK_REGISTRY_RU.md — UR — Исторический пользовательский реестр
- [ ] **UR-062 — RETIRED BY OWNER 2026-11-07** (строка 62; D. Чаты, проекты, инструкции и память): experimental server-memory graph API and opt-in browser bridge removed from UI and gateway. Preserve browser-local memory, conversation delta sync and independent RAG. Existing server DB files are not deleted; live host is unverified. _(исходный статус: RETIRED; строка 93)_
- [ ] **UR-070 — RETIRED BY OWNER 2026-11-07** (строка 70; D. Чаты, проекты, инструкции и память): temporal/conflict/recursive-delete test scope belonged to the removed server-memory graph prototypes; do not recreate that subsystem. _(исходный статус: RETIRED; строка 99)_
- [ ] **UR-201 — RETIRED BY OWNER 2026-11-07** (строка 201; I. Следующие продуктовые вертикали): do not enable retired server-memory graph/global flags; API code removed. Preserve any existing DB file until a separate backup/retention decision. _(исходный статус: RETIRED; строка 139)_

### MASTER_TASK_REGISTRY_RU.md — V016 — GEN1 / CRAZE V-016
- [ ] **V016-152 — RETIRED BY OWNER 2026-11-07** (строка 152; P1 — required next implementation slices): backend server-memory graph removed; its isolation/deletion/global-opt-in test scope is no longer applicable. Keep separate RAG scope/deletion tests. _(исходный статус: RETIRED; строка 176)_

### MASTER_TASK_REGISTRY_RU.md — V1 — Канонический чек-лист V1 UI
- [ ] **V1-154** **V1-154** (строка 154; 15. Research Studio — RETIRED): По прямому указанию владельца Research Studio удалена из интерфейса и приложения; не восстанавливать из старых PR/документации. Исследовательский pipeline как capability чата не удалён. _(исходный статус: RETIRED; строка 289)_
- [ ] **V1-155** **V1-155** (строка 155; 15. Research Studio — RETIRED): UI-проверки модального окна больше не применимы; regression test подтверждает отсутствие удалённого shortcut/modal и отсутствие горизонтального overflow на 390px. _(исходный статус: RETIRED; строка 290)_

### MASTER_TASK_REGISTRY_RU.md — GUIDE — `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`
- [ ] **GUIDE-553 — RETIRED BY OWNER 2026-11-07** (строка 553; `docs/ALANDI_IMPLEMENTATION_GUIDE_RU.md`): Owner removed the server-memory graph; this auth/scope/cascade-delete gate is obsolete. Do not restore the graph. _(исходный статус: RETIRED; строка 516)_


## 4C. Дополнительные актуальные source checklists (перенесены при консолидации 2026-11-18)

Эти строки появились или обновлялись позднее исторического master registry. Повторяющиеся stable IDs и точные дубликаты исключены; исходные пути и строки сохранены. Source checkbox — историческая отметка и не заменяет текущую проверку.

### Open / partial
### docs/USER_REQUEST_CHECKLIST.md — A. База, управление и непрерывность
- [ ] Проверить все старые регрессии: создание чата, история, экспорт/импорт, отмена, повтор запроса. _(source line 14)_
- [ ] Обновить сведения о реальном состоянии системы: код, контракт, эксперимент, развёрнутая служба, измеренная метрика. _(source line 15)_

### docs/USER_REQUEST_CHECKLIST.md — B. Первичное облако aLandi и API-провайдеры
- [ ] Начальный статус облака — красный/неподтверждённый; зелёный возможен лишь после реального модельного ответа и успешной `/healthz`-проверки при следующем запуске. Живой пользовательский gateway ещё не сконфигурирован. _(source line 20)_
- [ ] Хранить адрес, модель и ключ aLandi отдельно; не считать наличие ключа доказательством связи. _(source line 21)_
- [ ] Проверять сохранённое соединение при запуске через health-check, а не доверять вечному старому зелёному статусу. _(source line 22)_
- [ ] Перенести старые настройки провайдеров в свёрнутый дополнительный раздел. _(source line 23)_
- [ ] Вынести ключ Tavily в под-раздел инструментов и веб-поиска. _(source line 24)_
- [ ] Добавить кнопку вставки для ключей провайдера и своего gateway. _(source line 25)_
- [ ] После явной вставки ключа запускать один ограниченный refresh каталога и тест соединения. _(source line 26)_
- [ ] Блокировать конкурирующие одновременные тесты подключения. _(source line 27)_
- [ ] При явной ошибке доступности модели искать не более трёх альтернатив того же провайдера. _(source line 29)_
- [ ] Не делать retry альтернативных моделей на 401/403, 429, сетевой ошибке или общем сбое API. _(source line 30)_
- [ ] Принимать корректные текстовые массивы, refusals/tool-calls и варианты совместимого ответа, не путать валидный JSON-envelope с ошибкой формата. _(source line 31)_
- [ ] Kilo Auto Free доступен как обычный альтернативный провайдер в общем списке: без ключа, только по явному выбору и без скрытого fallback. Официальная документация предупреждает, что промпты могут поступать провайдерам, которые логируют их/используют для улучшения моделей; конфиденциальные данные туда не отправлять. См. `docs/V016_IMPLEMENTATION_CHECKLIST.md` и [официальное предупреждение Kilo](https://kilo.ai/docs/getting-started/using-kilo-for-free). _(source line 32)_
- [ ] Обновить все модельные ID по официальным динамическим каталогам; статические preset считать только fallback. _(source line 33)_
- [ ] Провести E2E-проверку реального пользовательского выбора Kilo и документацию об обработке данных сторонним шлюзом. _(source line 34)_
- [ ] Проверить официальные endpoints, CORS, лимиты, схему аутентификации и формат ошибок каждого сохранённого провайдера. _(source line 36)_
- [ ] Никогда не переносить ключи из одного провайдера в другой и не экспортировать ключи в settings-profile. _(source line 37)_

### docs/USER_REQUEST_CHECKLIST.md — C. Главный экран, визуальная система и язык
- [ ] Переоформить шапку в бренд aLandi и перенести название активного чата в подпись. _(source line 40)_
- [ ] Добавить пасхалку «a land i → i land AI». _(source line 41)_
- [ ] Добавить реальные цифровые часы и аналоговые стрелки с дискретным обновлением. _(source line 42)_
- [ ] Добавить основной переключатель тёмной/светлой темы на главном экране. _(source line 43)_
- [ ] Добавить RU/EN переключатель и сохранять выбранный язык. _(source line 44)_
- [ ] Обновить шрифтовой fallback без обязательной внешней загрузки; улучшить радиусы и состояния элементов. _(source line 45)_
- [ ] Реализовать центрирование поля ввода в пустом чате и увеличение высоты по мере ввода. _(source line 46)_
- [ ] Перемещать длинный черновик из центрального режима в привычную нижнюю позицию. _(source line 47)_
- [ ] Добавить ограниченное прикрепление текстовых файлов (.txt, .md, .csv, .json, .log) с размерными лимитами. _(source line 48)_
- [ ] Мобильная кнопка голоса, удержание и свайп покрыты успешным PR #21 Chromium E2E. Это только preview: микрофон, ASR, TTS, AEC и аудиотранспорт не подключены. _(source line 49)_
- [ ] Полностью пройти мобильную/настольную проверку размеров и областей касания. _(source line 50)_
- [ ] Проверить клавиатурную доступность, visible focus, контраст, screen reader и reduced-motion. _(source line 51)_
- [ ] Перевести все пользовательские надписи, подсказки и ошибки интерфейса; текущий RU/EN перевод неполный. _(source line 52)_
- [ ] Сокращены ключевые инструкции настроек: cloud/API, ключи, CORS, контекст и веб-поиск. Полный аудит всех подсказок и согласование RU/EN ещё не завершены. _(source line 53)_
- [ ] Провести визуальную регрессию desktop/mobile и проверить, что анимации не мешают длинному вводу. _(source line 54)_

### docs/USER_REQUEST_CHECKLIST.md — D. Чаты, проекты, инструкции и память
- [ ] Project CRUD присутствует в клиенте: создать, переименовать/редактировать, удалить с подтверждением; повторно проверить E2E на текущей ветке. _(source line 57)_
- [ ] Проектные инструкции редактируются и добавляются в контекст как предпочтения, не как политика безопасности; подтвердить тестами precedence. _(source line 58)_
- [ ] Текущий чат можно привязать/отвязать от проекта; проектная принадлежность видна в интерфейсе. _(source line 59)_
- [ ] Есть экспорт/импорт project bundle с чатом, инструкциями и памятью; проверить схему, duplicate IDs, limits, malicious content. _(source line 60)_
- [ ] Browser-local global/project memory имеют отдельные явные toggles; global context по умолчанию выключен. E2E проверяет состояние переключателя, но отдельный multi-project prompt-leak test для browser-local global facts ещё не закрыт. _(source line 61)_
- [ ] Реализовать authenticated API/индексацию project sources только после согласованного backend contract; не имитировать работающий индекс на пустой заглушке. _(source line 63)_
- [ ] Межпроектные проверки: RAG retrieval/delete — `gateway/tests/test_six_layers.py::test_rag_retrieval_preserves_citations_and_isolates_scopes` и `test_rag_scope_bound_ids_allow_same_document_name_without_leak_or_cross_delete`; Evidence Ledger — `gateway/tests/test_coder_packet.py::test_evidence_ledger_stores_scoped_provenance_and_exact_quote`; exact-response cache — `gateway/tests/test_app.py::test_exact_cache_key_separates_project_specific_prompt_context`. Cache key зависит от полного payload, а не от отдельного project-ID ACL; browser-global memory leak test и отдельный cache project-scope contract остаются открытыми. Серверная graph-memory изоляция retired. _(source line 64)_
- [ ] RAG source deletion is scope-checked and removes chunk/concept/FTS rows; SQLite `secure_delete` plus version-gated FTS5 `secure-delete` regression tests passed on PR #24 HEAD and post-merge main. This still does **not** erase evidence-ledger copies, WAL/journals, backups or browser-local source copies; system-wide crypto-erasure remains open. _(source line 65)_
- [ ] Проверить экспорт, исправление и удаление пользовательских фактов и связанные derived records. _(source line 66)_
- [ ] Реализовать удаление/криптостирание по всем реальным слоям; не обещать SLA ≤60 секунд без измерения. _(source line 67)_
- [ ] Полноценный viewer источников/индекса, citation lineage и cross-device project memory остаются задачами последующих фаз. _(source line 71)_

### docs/USER_REQUEST_CHECKLIST.md — E. Инструменты, маршрутизация, веб-поиск и отказы
- [ ] Сохранить ограничение по числу шагов инструментов и исследовательских вызовов; не запускать неограниченный retry loop. _(source line 74)_
- [ ] Сохранить явный opt-in для fallback к другому облачному провайдеру. _(source line 75)_
- [ ] Проверить все циклы tool-calls на max rounds, общий deadline, cancellation, bounded concurrency и корректное продолжение assistant/tool messages. _(source line 76)_
- [ ] При ошибке инструмента пробовать совместимый способ/альтернативный инструмент только в пределах явного policy и бюджета. _(source line 77)_
- [ ] Показывать правдивую timeline событий: фактический вызов, источник, duration, результат, ошибка; не показывать скрытые рассуждения. _(source line 78)_
- [ ] Внедрить 12-шаговый Deep Research state machine, повторный поиск при пробелах и проверку утверждений против ссылок. _(source line 80)_
- [ ] Проверить prompt-injection в проектных инструкциях и загруженных документах. _(source line 81)_
- [ ] Проверить SSRF/redirect protections, MIME/size/time limits, безопасную очистку временных файлов и отсутствие секретов в логах. _(source line 82)_
- [ ] Не кэшировать streaming, tool calls, web research, multimedia, errors или partial outputs. _(source line 83)_
- [ ] Проверить точную инвалидацию exact cache при изменении prompt, project instructions или tool schema. _(source line 84)_
- [ ] Измерить retry rate, повторные дубликаты, частоту 429/5xx, latency и успешность tool-циклов. _(source line 85)_

### docs/USER_REQUEST_CHECKLIST.md — F. V-016: зависимости, аудио, память, бюджеты и лицензии
- [ ] Проверить CI-гейт триады: точный проверенный URL + лицензия конкретного артефакта + источник технического утверждения. _(source line 89)_
- [ ] Не включать модели/голоса в установщик до проверки точной лицензии, весов, voice artifact и checksums. _(source line 90)_
- [ ] Внедрить ALBF binary framing только вместе с real transport и тестами на усечение, CRC, max payload и cancellation. _(source line 91)_
- [ ] Сделать bake-off ASR/TTS с измерением RTF, first audio, e2e p95 и потребления PSS; не опираться на неподтверждённые цифры. _(source line 92)_
- [ ] Подтвердить native audio capture/processing прежде, чем обещать отсутствие PCM/аудио hotpath в Python. _(source line 93)_
- [ ] Проверить безопасную изоляцию tool workspace; не называть subprocess без sandbox production-изоляцией. _(source line 95)_
- [ ] Проверить scope isolation, no-PII logs, prompt priority stack и fail-safe privacy policy. _(source line 96)_
- [ ] Измерить профиль laptop_8gb_cpu_mvp на целевом 8-GB железе, включая combined LLM+RAG+tools и cold-tier eviction. _(source line 97)_
- [ ] Не заявлять p95 900/2500 ms, regret ≤1.25, PII leak=0 или crypto-erase SLA, пока нет воспроизводимых evals. _(source line 98)_
- [ ] Полностью пересмотреть список зависимостей/отклонённых технологий в V-016 и не вводить CUT/PAT items как production-зависимости. _(source line 99)_
- [ ] Проверить Third-party NOTICE и права распространения каждой включённой библиотеки/модели. _(source line 100)_

### docs/USER_REQUEST_CHECKLIST.md — G. Выпуск и финальный аудит
- [ ] Пройти Jekyll build, quality sentinels, browser Chromium tests, accessibility/interaction tests и provider-specific deterministic E2E. _(source line 103)_
- [ ] Проверить без реальных секретов: malformed response, 400/404 model missing, 401/403 auth, 429, 5xx, timeout, CORS, offline and cancelled request. _(source line 104)_
- [ ] Проверить, что новая ветка не меняет чужую конфигурацию, историю, секреты или сохранённые настройки молча. _(source line 105)_
- [ ] После merge проверить main SHA, успешные workflows и опубликованную GitHub Pages версию. _(source line 106)_
- [ ] Перепроверить каждый пункт этого реестра перед итоговым отчётом; явно перечислить незавершённое и неподтверждённое. _(source line 107)_

### docs/USER_REQUEST_CHECKLIST.md — Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8
- [ ] Фазы 0–4: gateway/trace, scoped RAG FTS5/evidence/citations и tool safety имеют foundations/prototypes; experimental server-memory graph/temporal/conflict layer retired by owner 2026-11-07. _(source line 117)_
- [ ] Фазы 5–6: подключить настоящий voice runtime и native ASR/VAD/TTS только после лицензий и воспроизводимого hardware benchmark. _(source line 118)_
- [ ] Фазы 7–8: подключить реальную telemetry timeline, authenticated UI API и cloud integration только после backend contract/security review. _(source line 119)_

### docs/USER_REQUEST_CHECKLIST.md — Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты
- [ ] На каждое изменение статуса дополнить eval-отчёт командой, результатом, sample size, SHA и rollback; обновить PROJECT_STATE.yaml, EVALS.md, LOOP.md, DECISIONS.md и соответствующий отчёт. _(source line 169)_

### docs/USER_REQUEST_CHECKLIST.md — Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates
- [ ] Прогнать python -m compileall -q gateway, python -m pytest -q gateway/tests, python gateway/evals/run_six_layer_eval.py и лицензионный CI gate на текущем состоянии ветки. _(source line 174)_
- [ ] Проверить provenance каждого реально поставляемого артефакта: точный источник, применимая лицензия модели/голоса, SHA-256. TBD/непроверенные hashes не могут отмечаться как ship-enabled. _(source line 175)_
- [ ] Измерить на целевом хосте cold/warm p50/p95/p99, RTF, RAM/PSS, аудиодропы, CER/WER и regression sample counts до любых performance claims. _(source line 176)_
- [ ] Развёртывание VPS, DNS, OAuth secrets и создание billable infrastructure не выполнять без актуального account access/проверенных параметров и отдельного согласованного действия. _(source line 177)_

### docs/USER_REQUEST_CHECKLIST.md — Gate перед финальным ответом
- [ ] Пересверить весь этот To do и таблицу ID с текущим HEAD после завершения всех workflows; подробный аудит четырёх частей манифеста — `docs/V016_IMPLEMENTATION_CHECKLIST.md` (81 пункт, §§0–40). _(source line 191)_
- [ ] Указать раздельно: фактически внедрено, проверено CI, подтверждено live, измерено benchmark, осталось prototype/deferred/blocked. _(source line 192)_
- [ ] Не объединять PR и не сообщать о публикации до зелёных релевантных workflow и проверки merge result. _(source line 193)_

### docs/USER_REQUEST_CHECKLIST.md — I. Следующие продуктовые вертикали
- [ ] Первый месяц не создавать платные ресурсы автоматически: GitHub Pages + уже имеющееся железо + Ollama локально; free-tier API считать квотируемым и внешним, не гарантированно бесплатным. _(source line 202)_
- [ ] Оценить одну маленькую helper-модель для классификации, извлечения фактов, кратких сводок и чернового ранжирования. Главная модель остаётся для планирования, сложного reasoning и синтеза. Сравнить качество, latency и RAM перед включением. _(source line 203)_
- [ ] Добавить генерацию изображений отдельным модулем после выбора реального backend (локальный ComfyUI/API или явно выбранный внешний провайдер), проверки точной модели/лицензии/VRAM и mock E2E. _(source line 204)_
- [ ] Не добавлять скрытый refusal-фильтр поверх выбранной модели; не обещать «никогда не отказывает»: поведение checkpoint и правила внешнего API не контролируются приложением. _(source line 205)_
- [ ] Перед переходом на платный сервер сравнить baseline с измерениями p50/p95, RAM, качества, устойчивости, квот и месячной стоимости; менять endpoint/model config без смены контракта UI. _(source line 206)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 owner quickstart and chat ergonomics
- [ ] Real voice capture/ASR/TTS, image/video pipelines and complete document ingestion remain separate unimplemented work; see `docs/IMPLEMENTATION_ROADMAP_RU.md` and the original V-016 evidence ledger. _(source line 213)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 project navigation and composer
- [ ] Real device verification: touch long-press/cancel, mobile keyboard focus/viewport reset, screen reader flow, and large file handling. _(source line 225)_
- [ ] Implement real file intake pipeline for PDF/DOCX/XLSX/OCR/audio/video metadata before claiming all formats are supported. _(source line 226)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — local helper memory suggestions (2026-10-27)
- [ ] Live inference, selected/installed VPS model, output quality, RAM and latency remain unverified. _(source line 235)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — reconciliation of the older mobile and interface request (2026-10-27)
- [ ] Next bounded slice: edge-aware chat-row/popover placement and compact header order/project label/clock polish. Keep these separate from provider/project export-import cleanup and per-chat settings audit. _(source line 243)_
- [ ] Run native iPhone Safari/keyboard/touch verification separately; passing Chromium viewport simulation is not proof of native behavior. _(source line 244)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — autonomous agent orchestration research (2026-10-28)
- [ ] Reconcile current main and open PRs before code changes; audit actual runtime paths rather than relying on module names. _(source line 251)_
- [ ] Implement task contract/state machine and tests in a bounded PR. _(source line 252)_
- [ ] Select and verify a real sandbox before allowing arbitrary command/code execution. _(source line 253)_
- [ ] Add adversarial/golden evaluations, crash/restart and idempotency tests; measure target-host RAM/latency. _(source line 254)_
- [ ] Update PROJECT_STATE.yaml and EVALS.md only with verified implementation/test evidence. Research/documentation completion does not mean runtime implementation. _(source line 255)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — voice model landing and VPS owner steps (2026-10-28)
- [ ] After PR #75 exact-head CI passes and the code is merged, deploy that exact code revision to the VPS; GitHub Pages deployment alone does not update the private gateway. _(source line 259)_
- [ ] On the VPS, inspect OS/architecture/RAM/disk before installing Python 3.12+, ffmpeg/ffprobe, whisper.cpp, Piper and selected local model artifacts. _(source line 260)_
- [ ] Download only upstream-verified, license-reviewed artifacts; record exact source/version/license/SHA-256. For Piper, verify matching `.onnx` + `.onnx.json`; do not auto-download models from user requests. _(source line 261)_
- [ ] Configure `/etc/alandi-gateway.env` with `0600` permissions; keep ASR/TTS flags false until binaries, models and authenticated capabilities are checked. Then enable one feature at a time and restart the service. _(source line 262)_
- [ ] Validate the real microphone → editable transcript → explicit send → same-chat response → local TTS playback/voice choice/Stop path on the target device; record RAM, latency and speech quality. _(source line 263)_
- [ ] Never share secrets or full env files in chat. SSH/VPS access is not available through the current GitHub integration, so server-side installation must be executed by the owner using the runbook. _(source line 264)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — consolidated interface cleanup, 2026-10-30
- [ ] Native iPhone Safari keyboard, safe-area, touch and accessibility checks remain manual gates. Chromium geometry assertions do not establish native iOS behavior. _(source line 271)_
- [ ] Live aLandi gateway, third-party provider credentials, external connectors, independent agent teams and production voice transport are not verified by these UI changes. _(source line 272)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — sidebar hierarchy and preferences, 2026-10-30
- [ ] Native iPhone Safari keyboard, safe-area, focus, touch and screen-reader behavior remain unverified. Live gateway, provider credentials, connector sync, independent agent teams and voice transport remain separate runtime/infrastructure gates. _(source line 278)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — orthogonal chat settings and Research Studio, 2026-10-30
- [ ] Native iPhone Safari behavior and live gateway/provider execution remain separate manual/runtime gates. _(source line 284)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30
- [ ] Run a real target-host comparison with identical model artifact/digest/license, quantization, context, hardware and repetitions. Record RAM/PSS, cold/warm latency, p50/p95, tokens/s where available and human-rated RU/EN/TH task quality. _(source line 290)_
- [ ] Keep the main model responsible for planning, complex reasoning and synthesis. Evaluate at most one optional helper for bounded extraction/classification/summarization; helper remains off by default and cannot authorize tools or approve side effects. _(source line 291)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — V1 landing and interface finalization, 2026-10-30
- [ ] Native iPhone Safari, keyboard, safe-area, screen-reader and touch verification remain manual gates. _(source line 302)_
- [ ] Issue #111 remains open for owner-only ruleset, VPS/hardware, live gateway/model, RAG corpus, voice/device and sandbox gates. CI alone cannot close it. _(source line 303)_

### docs/USER_REQUEST_CHECKLIST.md — Owner override — 2026-11-07
- [ ] **Stop control styling.** Retain the contextual ability to stop an active generation, using a neutral compact control; final screenshot/accessibility review remains open. _(source line 310)_

### docs/V1_UI_FINALIZATION_RU.md — 1. Общий UI/UX — [~]
- [ ] Завершить проход по типографике, контрасту, spacing, пустым состояниям, ошибкам и вторичным действиям. _(source line 49)_
- [ ] Пройти финальный визуальный screenshot-review desktop/mobile после всех изменений. _(source line 50)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Composer и мобильная клавиатура — [~]
- [ ] Сохранена настраиваемая top/bottom позиция (PR #119/#121 track), но перепроверить её влияние на мобильные viewport и scroll. _(source line 57)_
- [ ] Нативно проверить iPhone Safari: клавиатура, safe-area, focus, долгий текст, свайпы от края, ориентация экрана. _(source line 58)_

### docs/V1_UI_FINALIZATION_RU.md — 3. Маршруты aLandi и сторонних API — [~]
- [ ] В PR #121 унаследованный внутренний alandi option остаётся скрытым для миграции/совместимости. Тест должен подтверждать, что он hidden и не попадает в optgroup сторонних API; нельзя требовать его полного отсутствия в HTML. _(source line 65)_
- [ ] Проверить RU/EN labels, переключение и миграцию сохранённого маршрута на текущем head. _(source line 66)_

### docs/V1_UI_FINALIZATION_RU.md — 4. Подписи, placeholder и inline validation — [~]
- [ ] Завершить единый язык placeholder/error/help для внешних API, Cloudflare и Tavily; постоянный текст оставлять только там, где он несёт важную privacy/security информацию. _(source line 73)_
- [ ] Проверить ошибки invalid URL, неверной модели, пустого ключа, CORS, HTTP 401/5xx и корректность redaction секретов. _(source line 74)_

### docs/V1_UI_FINALIZATION_RU.md — 5. System prompt и случайное редактирование — [x]
- [ ] В итоговом визуальном проходе подтвердить заметность pencil/edit, focus и возврат в readonly. _(source line 82)_

### docs/V1_UI_FINALIZATION_RU.md — 6. Инструкции сторонних провайдеров — [~]
- [ ] Удалить повторяющиеся provider explanations, но оставить короткие честные privacy notices там, где данные уходят внешнему оператору. _(source line 88)_
- [ ] Сверить каждую ссылку/инструкцию с актуальным upstream, не выдумывать endpoint или модельный ID. _(source line 89)_

### docs/V1_UI_FINALIZATION_RU.md — 7. Tools и Tavily — [~]
- [ ] Автоматическая проверка/индикатор ключа должна быть подтверждена реальным вызовом, не только непустым полем. _(source line 95)_
- [ ] Проверить paste, сохранение, удаление, неверный ключ, публичные fallback источники, privacy copy. _(source line 96)_

### docs/V1_UI_FINALIZATION_RU.md — 8. Статус собственного gateway — [~]
- [ ] Проверить race/stale response, /healthz, model completion, timeout, CORS и очистку ключа на exact head. _(source line 103)_

### docs/V1_UI_FINALIZATION_RU.md — 9. Окна и закреплённые действия — [~]
- [ ] Проверить Escape, focus return, screen reader name, scroll lock и background interaction. _(source line 111)_

### docs/V1_UI_FINALIZATION_RU.md — 10. Скроллинг и длинные чаты — [~]
- [ ] Проверить потоковую генерацию, вложенные скроллы, длинные сообщения/вложения, чат-список и модальные окна. _(source line 116)_
- [ ] Проверить экран 320px, динамическую клавиатуру и scroll restoration на iOS Safari. _(source line 117)_

### docs/V1_UI_FINALIZATION_RU.md — 11. Дополнительные настройки — [x]
- [ ] Завершить аудит всех secondary controls на дубли/устаревшие toggle. _(source line 125)_

### docs/V1_UI_FINALIZATION_RU.md — 12. Тема, язык, анимации — [~]
- [ ] Проверить полную RU/EN копию, светлую тему модалок, статусов, подсказок и Roadmap. _(source line 133)_

### docs/V1_UI_FINALIZATION_RU.md — 13. Каталог моделей и provider state — [~]
- [ ] Проверить сохранение выбранной модели при refresh, invalid catalog, устаревший fingerprint, auth failure и provider switch. _(source line 139)_
- [ ] Live provider smoke остаётся опциональным и требует явного согласия; mock E2E не выдавать за доступность реального аккаунта. _(source line 140)_

### docs/V1_UI_FINALIZATION_RU.md — 14. Project settings — [~]
- [ ] В PR #121 E2E должен подтвердить modal close, persistence, создание и переключение проекта после текущих исправлений. _(source line 147)_
- [ ] Реальный multi-device sync/source indexing не входит в V1; не изображать его включённым. _(source line 148)_

### docs/V1_UI_FINALIZATION_RU.md — 18. Финальный release gate — [~]
- [ ] PR #121 был красным: duplicate settings close selectors, invalid regex in integrity sentinel и один неверный assertion around settings probe. Исправления внесены; повторный exact-head CI нужен. _(source line 169)_
- [ ] Выполнить native iPhone Safari/keyboard/touch test вручную. _(source line 171)_
- [ ] Пересверить PR/Issues. Issue #111 остаётся открытым до реальных owner-only gates (ruleset/main governance, VPS, hardware/model, voice/device, licensed data corpus); не закрывать только ради нулевой очереди. _(source line 172)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Лендинг — обязательная структура V1
- [ ] Усилить copy: «бесплатный статический интерфейс» не означает «бесплатный inference», hosted AI endpoint не предоставляется. _(source line 182)_
- [ ] Добавить открываемый Roadmap с маркером 1nv3nt10n 1n PrOc3ss… только у направлений, которые ещё разрабатываются/планируются. _(source line 183)_
- [ ] Browser E2E на структуру/CTA, метаданные, отсутствие пустых ссылок, responsive 320/360/390/768/1024/1440px, Roadmap details и reduced-motion есть; добавлен тест pause/resume ticker (commit b213c8a); ожидается exact-head Chromium run. _(source line 184)_
- [ ] E2E проверяет lang/title/description/canonical/CTA/непустые ссылки; Jekyll build проходит в текущем CI; фактический published Pages path требует успешного exact-head smoke после merge. _(source line 185)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Публичная точка входа и root app
- [ ] Screenshot review 320/360/390/768/1024/1440 px: root header, sidebar, composer, settings/function/project dialogs, line lengths, section rhythm and contrast. _(source line 14)_
- [ ] Native keyboard/screen-reader pass for the public root app; DOM/E2E assertions are not a VoiceOver certification. _(source line 15)_
- [ ] Verify the deployed root revision marker and critical navigation on the actual published Pages URL after the next UI change. _(source line 16)_
- [ ] Keep the dark/light app themes and reduced-motion behavior consistent; do not add a separate landing theme or duplicate route. _(source line 17)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Корневое приложение — визуальная иерархия
- [ ] Общий screenshot review desktop/mobile после последнего PR #121. _(source line 21)_
- [ ] aServi cloud fields now reference their inline error messages with aria-describedby; URL validation, connection progress/status and success copy follow RU/EN. Required URL/model/key errors now appear in field order, focus the first missing field, clear when corrected and localize the checking state; focused RU/EN regressions added. Remaining forms and empty/error states still need a full pass. _(source line 22)_
- [ ] Полная RU/EN проверка микротекстов, подсказок, статусов, светлой темы модалок и пустых состояний; aServi required fields and project create/edit name validation now have localized inline errors and focus recovery. Broader panel/form copy review remains open. _(source line 23)_
- [ ] Проверить pencil/edit state у system prompt и возврат в readonly. _(source line 24)_
- [ ] Проверить touch targets (проектная цель 44×44 CSS px) и отсутствие конкурирующих controls. _(source line 25)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Popovers, menus, dialogs
- [ ] Chat/project action menus and composer popovers now size internal scroll areas to the live visual viewport; composer popovers move focus into the active menu, trap Tab/Shift+Tab and restore the trigger on Escape/scrim dismissal. Focused short-viewport regressions are added. Four-edge placement and real iPhone keyboard still need verification; nested project-choice scrolling now has overscroll containment and E2E coverage. _(source line 29)_
- [ ] Settings, project-create, project-settings and message-viewer dialogs: Escape, focus return and Tab/Shift+Tab containment are implemented; focused E2E coverage exists, execution pending. Other dialog/menu patterns, scroll lock and background inert still need review. _(source line 30)_
- [ ] Проверить короткий viewport, открытую iPhone keyboard и safe-area на реальном Safari. _(source line 32)_
- [ ] Native Popover API / CSS Anchor Positioning рассматривать только как progressive enhancement после support matrix; сохранить существующий JS fallback. Не мигрировать ради моды. _(source line 33)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Sidebar, проекты, чаты
- [ ] Проверить, что общий импорт/экспорт не дублируется в sidebar и project settings; chat actions остаются в chat menu, project bundle — в project settings. _(source line 38)_
- [ ] Project/chat navigation truncates long names within flex rows while retaining the full value in `title`; long project lists scroll internally. `renderChatList()` preserves scroll offset and restores focused controls; when a chat row disappears it moves focus to the current/first remaining chat. Chat-row menu actions that rerender the list return focus to a stable row trigger; keyboard traversal, Escape and outside-click focus restoration are covered. Added 320px no-overflow, 30-project, 40-chat scroll/focus, menu Tab/Shift+Tab/Escape, clone and delete-cancel focus regressions. Native mobile scroll, VoiceOver and full keyboard traversal remain open; Playwright execution is pending. _(source line 39)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Research / functions / agents
- [ ] Release-contract sentinel correction: PR #174 changes the published marker list to require the approved menu and forbid only retired Research Studio, legacy provider selection and removed sidebar controls. _(source line 44)_
- [ ] Web search is opt-in by default: fresh chats and legacy/imported records without an explicit saved preference stay model-only; saved per-chat `normal`/`more` choices are preserved. RU regression added; E2E execution and the broader mode-combination matrix remain open. _(source line 45)_
- [ ] Развести семантику web search breadth, offline mode и multi-agent orchestration в copy и UI. _(source line 46)_
- [ ] В roadmap/agent panels сохранять чёткое различие между blueprint, sequential pipeline и независимым agent runtime. _(source line 48)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Мобильность и доступность
- [ ] Composer placeholder uses `…` at <=340px, `Текст`/`Type` at <=360px, `Текст…`/`Type…` at <=420px, and full localized text above; horizontal padding is 4px only at <=360px. E2E covers 320/340/360/390/420/768 px (execution pending). _(source line 51)_
- [ ] Chromium responsive matrix 320/360/390/768/1024/1440 и no-overflow tests. _(source line 52)_
- [ ] Native iPhone Safari: visual viewport, клавиатура, safe-area, edge swipe, touchcancel, rotation, scroll restoration. _(source line 53)_
- [ ] VoiceOver: headings, dialogs, menus, status text, message actions, focus visibility. _(source line 54)_
- [ ] User `reduced` now disables the infinite prompt-edit pulse and voice-menu entrance animation; OS reduced-motion rules already cover ticker/dots and global timing. Full transitions/scroll and native OS-preference interaction still need manual review. _(source line 55)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — 3. Исторический первый polish patch
- [ ] Native keyboard/screen-reader confirmation. _(source line 71)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Fast regression path (2026-11-17)
- [ ] Added `scripts/check_a11y_surface.py`; a source scan of current `index.md` finds 5 visible form controls with names, 28 buttons with a non-empty name source, and all 8 runtime-localized field IDs in `fieldTexts`. This is a structural heuristic, not WCAG/screen-reader certification; the committed script still needs execution from a real checkout. _(source line 84)_
- [ ] Added a Lightpanda JavaScript/DOM smoke for Functions → Skills and localized accessible names. It is a fast functional candidate, not a visual browser: Lightpanda does not render layout. Its compatibility and timing are **not yet verified on aLandi**. _(source line 85)_
- [ ] Run the fast gate and Lightpanda smoke in a real repository checkout; compare elapsed time and coverage against Chromium on the same commit. _(source line 86)_
- [ ] Keep Chromium as a manual-only check for viewport geometry, CSS reflow, overflow and screenshots; do not infer those properties from DOM-only tests. _(source line 87)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — 5. Change log
- [ ] Provider settings: aLandi aServi is a first-party section, not a third-party provider option; aServi excludes both peer sections, and no silent cross-provider fallback is allowed. PR #169 implements; exact-head CI and live check pending. _(source line 107)_

### docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md — Приоритетный backlog
- [ ] LANDING-001 — зафиксировать baseline размера HTML/CSS/JS, critical rendering, LCP/INP/CLS и загрузки ключевых assets на опубликованном сайте. _(source line 38)_
- [ ] LANDING-002 — аудит доступности: keyboard-only, focus order, dialogs/popovers, screen-reader semantics, reduced motion, contrast and touch targets. _(source line 39)_
- [ ] LANDING-003 — аудит responsive поведения и реального iPhone Safari: visual viewport, keyboard, safe areas, rotation and zoom. _(source line 40)_
- [ ] LANDING-004 — аудит JS lifecycle: event listener cleanup, duplicate handlers, async race conditions, stale state, cancellation and memory leaks. _(source line 41)_
- [ ] LANDING-005 — аудит resilience: offline/slow network, retry/backoff, timeout, abort, provider 4xx/5xx, malformed/partial responses and error recovery. _(source line 42)_
- [ ] LANDING-006 — аудит client storage: migration, quota errors, import/export losslessness, corruption recovery, scoped deletion and backup/restore. _(source line 43)_
- [ ] LANDING-007 — audit security/privacy in current boundaries: CSP/SRI, DOM injection, URL handling, secret exposure, logging, CORS/SSRF and data retention. _(source line 44)_
- [ ] LANDING-008 — SEO/metadata/semantic HTML, canonical URL, social preview, sitemap/robots and crawl behavior without adding a framework. _(source line 45)_
- [ ] LANDING-009 — deterministic Jekyll/Actions build, cache correctness, immutable action pins, lockfile and provenance. _(source line 46)_
- [ ] LANDING-010 — reduce duplicated code/assets and dead paths only when exact reference and regression evidence prove safe removal. _(source line 47)_
- [ ] LANDING-011 — inspect current CSS/JS payload and optimize critical path only if measured; preserve visual behavior. _(source line 48)_
- [ ] LANDING-012 — expand Playwright coverage for critical user flows and failure states; avoid brittle/vacuous assertions. _(source line 49)_
- [ ] LANDING-013 — verify browser compatibility and graceful degradation for current supported browsers. _(source line 50)_
- [ ] LANDING-014 — audit i18n: RU/EN/TH labels, formatting, font fallback, transliteration of user-entered names only where required. _(source line 51)_
- [ ] LANDING-015 — review dependency freshness and security advisories within the existing dependency policy; do not blindly upgrade. _(source line 52)_
- [ ] LANDING-016 — inspect build/release observability and published Pages smoke; do not claim post-merge deploy from PR CI alone. _(source line 53)_
- [ ] LANDING-017 — reconcile historical landing UX requests with current code and master registry; preserve original task IDs and evidence. _(source line 54)_
- [ ] LANDING-018 — test graceful operation when optional gateway/voice/research capabilities are unavailable or disabled. _(source line 55)_

### docs/LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md — 7. Tasks
- [ ] LSV-001 — compare browser File System Access support across target browsers and native mobile. _(source line 116)_
- [ ] LSV-002 — define reference/attachment/local-copy consent and storage state machine. _(source line 117)_
- [ ] LSV-003 — prototype IndexedDB handle persistence and permission revalidation; no background watcher. _(source line 118)_
- [ ] LSV-004 — define local Source Vault schema, quotas, deletion lineage and export. _(source line 119)_
- [ ] LSV-005 — threat model file parsing, archive bombs, path traversal, symlinks and malicious PDFs. _(source line 120)_
- [ ] LSV-006 — evaluate Docling against existing parser on a representative RU/EN/TH corpus. _(source line 121)_
- [ ] LSV-007 — review doc-parse license, dependency tree, maintenance and adapter isolation. _(source line 122)_
- [ ] LSV-008 — evaluate screenshot-to-code in a no-execution sandbox with golden screenshot tests. _(source line 123)_
- [ ] LSV-009 — define video frame sampling, subtitle/transcript and provenance contracts. _(source line 124)_
- [ ] LSV-010 — benchmark ComfyUI/Wan 2.2 5B only on suitable GPU hardware; no target VPS assumption. _(source line 125)_
- [ ] LSV-011 — implement material-to-Skill draft with evidence mapping and human approval. _(source line 126)_
- [ ] LSV-012 — implement Agent blueprint conversion as a separate artifact type. _(source line 127)_
- [ ] LSV-013 — create upstream archive watchlist and preservation policy. _(source line 128)_
- [ ] LSV-014 — no downloads, mirrors, dependencies or runtime activation without owner approval. _(source line 129)_

### docs/AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md — 6. Proposed tasks
- [ ] SF-001 — define versioned SkillManifest and schema aligned with Agent Skills spec. _(source line 92)_
- [ ] SF-002 — source adapter contract and immutable source provenance. _(source line 93)_
- [ ] SF-003 — create-from-material pipeline with evidence span preservation. _(source line 94)_
- [ ] SF-004 — import/export package validator and license inventory. _(source line 95)_
- [ ] SF-005 — prompt-injection/secrets/malicious-script scanner. _(source line 96)_
- [ ] SF-006 — generated eval suite and skill quality rubric. _(source line 97)_
- [ ] SF-007 — human approval, immutable versions and rollback. _(source line 98)_
- [ ] AB-001 — AgentBlueprint schema separated from SkillManifest. _(source line 99)_
- [ ] AB-002 — permission intersection and explicit user approvals. _(source line 100)_
- [ ] AB-003 — UI builder for roles, skills, model policy, data scope and budgets. _(source line 101)_
- [ ] AB-004 — blueprint dry-run/evaluation with no side effects. _(source line 102)_
- [ ] AB-005 — promote blueprint only after runtime, isolation and exact-head tests exist. _(source line 103)_

### docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md — 9. Task ledger
- [ ] DR2-001 — восстановить ранее предоставленные владельцем research links и provenance. _(source line 151)_
- [ ] DR2-003 — проверить actual search/research UI и Gateway code; разделить implemented/planned. _(source line 153)_
- [ ] DR2-004 — аудит source ingestion, local storage, index and citation lineage. _(source line 154)_
- [ ] DR2-005 — проверить browser File System Access, OPFS and IndexedDB на целевых браузерах. _(source line 155)_
- [ ] DR2-006 — оценить local companion/desktop connectors and threat model. _(source line 156)_
- [ ] DR2-007 — сравнить notebook/research workspace проекты и source adapters по первоисточникам. _(source line 157)_
- [ ] DR2-008 — сравнить hybrid lexical/vector retrieval с SQLite FTS5 до добавления vector store. _(source line 158)_
- [ ] DR2-009 — определить claim/evidence schema and citation-validation golden set. _(source line 159)_
- [ ] DR2-010 — специфицировать resumable 12-stage Research run: deadline, cancellation, idempotency, bounded concurrency. _(source line 160)_
- [ ] DR2-011 — RU/EN/TH research golden set, source freshness and contradiction tests. _(source line 161)_
- [ ] DR2-012 — аудит memory recall, scope isolation, stale facts, conflicts, deletion and long-session capacity. _(source line 162)_
- [ ] DR2-013 — оценить local memory/index size and performance на target devices; определить практические пределы. _(source line 163)_
- [ ] DR2-014 — data-flow режимов local-only / mixed / remote-with-consent. _(source line 164)_
- [ ] DR2-015 — policy matrix: model refusals vs content policy vs platform security vs tool permissions. _(source line 165)_
- [ ] DR2-016 — false-positive/false-refusal and tool-authorization tests; no hidden adapter censorship. _(source line 166)_
- [ ] DR2-017 — image-generation candidates: ComfyUI/local GPU vs hosted APIs, licenses, cost, region, privacy. _(source line 167)_
- [ ] DR2-018 — video-generation candidates and async job APIs; не использовать retired endpoints. _(source line 168)_
- [ ] DR2-019 — AI coding assistants/agents and isolated coding sandboxes. _(source line 169)_
- [ ] DR2-020 — source inventory, decisions, risk register and staged implementation roadmap. _(source line 170)_
- [ ] DR2-021 — подготовить отдельные минимальные implementation PR после owner review; никаких production dependencies в этом PR. _(source line 171)_

### docs/VOICE_2_RESEARCH_RU.md — 6. Work plan / task ledger
- [ ] VOICE-TRACK-003 — собрать ранее найденные/предоставленные владельцем источники и пометить provenance; часть исходных scratch/source URLs ещё требует сверки. _(source line 111)_
- [ ] VOICE-TRACK-004 — провести независимый поиск по официальным upstream/papers/model cards/standards в категориях ASR, TTS, real-time audio, diarization, transliteration и multilingual normalization. **Progress:** первый проход выполнен по 6 поисковым направлениям (50 result slots до дедупликации); отдельный первичный-source отчёт создан в [VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md](VOICE_2_EXTERNAL_RESEARCH_2026-10-31_RU.md). Полный sweep и проверка оставшихся лицензий продолжаются. _(source line 112)_
- [ ] VOICE-TRACK-005 — проверить точные лицензии кода, весов, голосов, phonemizers, datasets и redistribution obligations. _(source line 113)_
- [ ] VOICE-TRACK-006 — сверить current code/tests and voice UI against every existing acceptance item; report precise implemented/partial/missing matrix. _(source line 114)_
- [ ] VOICE-TRACK-007 — составить воспроизводимый RU/EN/TH benchmark harness and golden-set governance. _(source line 115)_
- [ ] VOICE-TRACK-008 — сравнить 2–3 лучших кандидата на одинаковом наборе и target hardware; никаких model switches до measured win. _(source line 116)_
- [ ] VOICE-TRACK-009 — подготовить Voice 2.0 architecture/API contracts and phased implementation slices. _(source line 117)_
- [ ] VOICE-TRACK-010 — независимая security/privacy review и explicit owner approval перед runtime changes. _(source line 118)_

### docs/VOICE_2_RESEARCH_RU.md — Task ledger extension
- [ ] **AUDIO-GEN-001…009** — use the detailed task ledger in `LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md`; no download or runtime activation without owner approval. _(source line 156)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P1 — required next implementation slices
- [ ] Add a formal safety-first prompt composer (safety/workspace/project/profile/user), with prompt-injection regression tests. _(source line 153)_
- [ ] Add a privacy-only/local-only routing policy that blocks remote APIs and makes refusal explicit. _(source line 154)_
- [ ] Add route/router error tests for Grok/xAI, Kilo keyless route, 401/403/429/5xx, CORS failures, abort and malformed bodies. _(source line 155)_
- [ ] Complete RU/EN translation of settings help, errors, traces, project controls and all interactive labels. _(source line 156)_
- [ ] Audit keyboard navigation, contrast, mobile composer movement, safe-area and reduced-motion support. _(source line 157)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P2 — V-016 engineering blockers; do not advertise as production
- [ ] Implement and test deterministic artifact-manifest hashing + complete INTEL triad gate. _(source line 160)_
- [ ] Implement typed risk-aware router and route-regret evaluation corpus. _(source line 161)_
- [ ] Implement ALBF binary framing with CRC/truncation/overflow/interrupt tests. _(source line 162)_
- [ ] Implement native audio capture/inference adapters and measure e2e p50/p95 + PSS on the target 8 GB CPU host. _(source line 163)_
- [ ] Resolve every model/voice license/hash before packaging any weights. _(source line 164)_
- [ ] Harden cPocket rollback/TTL/cancellation races; do not enable speculative side-effect tools. _(source line 165)_
- [ ] Add crypto-erasure semantics and prove logical vs physical deletion guarantees. _(source line 166)_
- [ ] Add scratch-file offload, secure document ingestion, exact page/offset/hash citations and retrieval benchmarks. _(source line 167)_
- [ ] Keep CLI/browser runtime blocked until real sandbox/SSRF/approval escape tests pass. _(source line 168)_
- [ ] Implement 12-state research workflow and claim-to-evidence citation validation. _(source line 169)_
- [ ] Implement candidate-lessons pipeline with golden tests and rollback; no automatic weight training. _(source line 170)_
- [ ] Implement optional connectors only after encrypted token storage, scope review, revoke and index cleanup. _(source line 171)_
- [ ] Keep infrastructure and hardware targets as documentation until the required access and measurement environment exist. _(source line 172)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement: product work after the original V-016 checklist (not part of its original 81 items)
- [ ] **AI-AGENT-004 — Small helper model:** design plus synthetic RU/EN/TH response/latency smoke harness (`gateway/evals/run_local_model_benchmark.py`); Gateway Tests passed on PR #123 code head. Target-host quality/RAM/PSS/cold-warm benchmark and model selection remain pending. No general helper/subagent dispatch is wired into runtime. _(source line 186)_
- [ ] **AI-IMAGE-001 — Image generation:** no working image-generation UI/runtime exists yet. Select local ComfyUI or explicit external provider, verify exact checkpoint/license/hash/VRAM and add request-to-image E2E before marking implemented. _(source line 187)_
- [ ] **AI-OPS-001 — Free-first month:** no automatic paid resource provisioning. Use existing hardware and optional free-tier APIs with explicit quota/privacy caveats; paid hosting only after benchmark and owner decision. _(source line 188)_
- [ ] **AI-MODEL-001 — Local-model autonomy:** no hidden application-level refusal filter is planned. Actual refusals remain checkpoint/provider-dependent; do not claim guaranteed zero refusals. _(source line 189)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — legacy mobile and interface request, 2026-10-29
- [ ] Native iPhone Safari, software keyboard, edge-swipe and touchcancel behavior remain unverified. Do not mark complete based only on Chromium. _(source line 198)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — consolidated interface closure, 2026-10-30
- [ ] Native iPhone Safari keyboard/safe-area/focus and real touch interaction remain unverified. Provider credentials, live gateway, connector OAuth/sync, independent agent processes and full audio transport remain infrastructure/runtime gates rather than UI acceptance claims. _(source line 206)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — sidebar hierarchy and preference synchronization, 2026-10-30
- [ ] Real iPhone Safari keyboard/touch/accessibility behavior remains unverified; Chromium tests cover DOM order, live status updates and cross-surface preference synchronization only. _(source line 213)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — orthogonal chat settings, 2026-10-30
- [ ] Exact-head tests must pass for Quick+Expanded, Thorough+Standard, Thorough+Off, RU/EN, per-chat persistence and Research Studio non-mutation before merge. _(source line 218)_
- [ ] Native iPhone Safari and live gateway/provider behavior remain unverified. _(source line 219)_

### Retired by owner
### docs/USER_REQUEST_CHECKLIST.md — D. Чаты, проекты, инструкции и память
- [x] **RETIRED BY OWNER 2026-11-07:** server-memory graph API and browser bridge are removed from the product. Browser-local project notes remain; conversation delta sync and RAG are separate and preserved. Existing server DB files are not deleted by code; live host is unverified. _(source line 62)_
- [x] **RETIRED BY OWNER 2026-11-07:** scoped FTS5 `search_nodes()` belonged to the removed server-memory graph. RAG retains its independent scoped FTS5 store. _(source line 68)_
- [x] **RETIRED BY OWNER 2026-11-07:** temporal/conflict/recursive-delete tests belonged to the removed server-memory graph prototypes; do not rebuild them as a hidden backend memory subsystem. _(source line 70)_

### docs/USER_REQUEST_CHECKLIST.md — I. Следующие продуктовые вертикали
- [x] **RETIRED BY OWNER 2026-11-07:** PR #29's browser-to-server project memory bridge, API actions and settings removed; project notes remain browser-local. _(source line 198)_
- [x] **RETIRED BY OWNER 2026-11-07:** per-chat server-memory toggle and retrieval path removed; do not confuse this with local project notes or conversation delta sync. _(source line 199)_
- [x] **RETIRED BY OWNER 2026-11-07:** do not configure old graph/global-memory flags; API code is removed. Existing server SQLite files/backups remain untouched pending a separate owner decision. _(source line 201)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P1 — required next implementation slices
- [x] RETIRED BY OWNER 2026-11-07: backend server-memory graph and browser bridge removed in PR #169. Its two-project graph isolation/deletion/global-opt-in test scope is obsolete; preserve independent browser-local memory and RAG scope tests. _(source line 152)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement: product work after the original V-016 checklist (not part of its original 81 items)
- [x] **AI-MEM-006 — RETIRED BY OWNER 2026-11-07:** server graph API, feature flags, storage and browser bridge were removed in the current PR #169 implementation. PR #27/#29 and their CI results remain historical evidence only; do not enable or restore this capability. _(source line 184)_
- [x] **AI-MEM-007 — RETIRED BY OWNER 2026-11-07:** per-chat server-memory retrieval gate and UI state removed with the graph bridge. Browser-local project notes remain; conversation delta sync and independent scoped RAG are separate and preserved. _(source line 185)_

## 4E. Launch, privacy, readiness and governance source checklists (reconciled 2026-11-18)

The following source rows were not yet represented by a unique ID/text in the imported registries. They retain source path and line number. Legacy deployment actions remain owner-gated; these rows do not authorize host changes.

### Open / partial
### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — Автоматические проверки на точном PR HEAD
- [ ] Integrity: HTML structure, JS parse, immutable Action SHAs. _(source line 115)_
- [ ] Security: no credentials, safe markdown, safe provider routing and tools. _(source line 116)_
- [ ] Context: bounded memory/context/tool-loop behavior. _(source line 117)_
- [ ] Jekyll build: root app and `/landing/` output. _(source line 118)_
- [ ] Chromium E2E: chat, settings, project, Research Studio, provider state, export/import, landing. _(source line 119)_
- [ ] Landing responsive sweep: 320, 360, 390, 768, 1024, 1440 CSS px; no horizontal overflow. _(source line 120)_
- [ ] Landing SEO/link checks: `lang`, title, description, canonical, CTA and relative paths. _(source line 121)_
- [ ] Reduced-motion behavior: ticker static when OS requests reduced motion; no fake progress. _(source line 122)_
- [ ] Gateway contract/security tests on PRs that touch gateway. _(source line 123)_
- [ ] Project State Freshness exact SHA + exact live queue. _(source line 124)_
- [ ] License/provenance check. _(source line 125)_
- [ ] Graphify is developer-only artifact; inspect quality and do not ship to runtime. _(source line 126)_
- [ ] After merge: post-merge Pages deployment and actual published-site smoke. _(source line 127)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — Ручные/owner gates
- [ ] Native iPhone Safari: keyboard, safe area, focus, VoiceOver, touch, rotation, 320–390 width. _(source line 131)_
- [ ] GitHub branch rules and required checks inspected in repository settings. _(source line 132)_
- [ ] VPS inventory before any installation or reconfiguration; do not replace existing services blindly. _(source line 133)_
- [ ] Ollama model tag, digest, license, disk/RAM/PSS, cold/warm timings and concurrency=1 recorded. _(source line 134)_
- [ ] Gateway service listens on loopback; Ollama private on loopback; external origin accessible only through intended HTTPS Tunnel. _(source line 135)_
- [ ] Valid/invalid Bearer key, allowlisted model, completion, SSE, cache HIT/BYPASS, timeout and reboot tested. _(source line 136)_
- [ ] No prompt, user file/media body, secret or private memory in logs/traces/artifacts by default. _(source line 137)_
- [ ] Owner has confirmed whether the first deployment is personal/limited access; never imply public multi-user auth. _(source line 138)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — Future post-landing requirements — voice (not part of the frozen landing V1)
- [ ] **P0-13. Editable speech-to-text:** запись с микрофона, локальная транскрипция, редактирование распознанного текста до отправки, RU/EN/TH quality tests. _(source line 244)_
- [ ] **P0-14. Conversational voice assistant:** полноценный естественный turn-taking, streaming transcript/response, VAD, barge-in, cancellation, echo cancellation, transcript alignment. Текущий half-duplex prototype — только основа, не завершённая функция. _(source line 245)_
- [ ] **P0-15. Read selected text aloud:** выделение произвольного фрагмента ответа/сообщения и озвучивание только выделенного содержимого. _(source line 246)_
- [ ] **P0-16. Read one whole message aloud:** стабильный TTS для целого сообщения, voice choice, mini-player, pause/resume/stop, cleanup and stale-request protection. _(source line 247)_
- [ ] **P0-17. Read multiple selected messages aloud:** multi-select messages, ordered playback queue, pause/resume/skip/stop, cancellation and queue state; no parallel Piper jobs. _(source line 248)_
- [ ] **P0-18. First-release voice acceptance:** реальные microphone/speaker tests на целевых устройствах; RU/EN/TH; word error rate, first transcript latency, first audio latency, interruption latency, echo, CPU/GPU/RAM, model license and SHA-256. Без этого не обещать «почти человеческий» realtime. _(source line 249)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — P1 — small helper models, GPU inference and agent orchestration
- [ ] **P1-10. Helper model registry:** специализированные роли (classification, extraction, rerank, summary, memory candidate, skill synthesis), exact model ID/digest/license, capability, context/token budget, timeout, concurrency and eval. _(source line 252)_
- [ ] **P1-11. GPU inference profile:** Ollama GPU vs llama.cpp server benchmark; GPU-only inference mode must fail closed if no compatible GPU is detected. CPU still runs OS/API/orchestration; the requirement is no mandatory CPU model inference, not zero CPU usage for the whole host. _(source line 253)_
- [ ] **P1-12. High-throughput optional serving:** evaluate vLLM only on compatible accelerator hardware and when continuous batching/throughput materially helps. It is not the default 8-GB/single-model deployment. _(source line 254)_
- [ ] **P1-13. Multi-agent runtime:** bounded DAG/fan-out, queue/backpressure, per-agent scope/permissions, deadline, budget, cancellation propagation, idempotency, checkpoints, traces, retries and eval harness. Current four-stage research pipeline is not a swarm. _(source line 255)_
- [ ] **P1-14. Mass-agent load test:** establish safe concurrency, VRAM admission, memory residency/eviction, fairness, queue limits and degraded-mode behavior before increasing agent count. _(source line 256)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — P1 — internal notebook / Knowledge-to-Skill
- [ ] **P1-15. Knowledge-to-Skill pipeline:** authorized books, PDFs, office documents, websites and repo sources → bounded extraction → chapters/sections → source/page provenance → skill generation → injection/license scan → human review → versioned private skill. _(source line 259)_
- [ ] **P1-16. Skill lifecycle:** schema validation, scope isolation (personal/project), diff, versioning, rollback, deletion/retention and import/export. _(source line 260)_
- [ ] **P1-17. Safe ingestion:** MIME sniffing, archive/path traversal defense, XXE/bomb limits, parser timeout, temp cleanup, invisible Unicode scan, prompt injection scan and no automatic external provider fallback. _(source line 261)_

### docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md — 8. Остаток landing/app polish из актуального main
- [ ] Скриншоты и визуальная проверка landing на 320/360/390/768/1024/1440 px; hero, карточки, CTA, spacing, contrast, footer. _(source line 274)_
- [ ] Keyboard-only и screen-reader проверка трёх раскрываемых roadmap секций и pause controls. _(source line 275)_
- [ ] Published Pages smoke после merge; canonical, ссылки и реальный deployment. _(source line 276)_
- [ ] App screenshot pass desktop/mobile; typography, contrast, spacing, empty/error states, RU/EN, light/dark. _(source line 277)_
- [ ] Все composer popovers на краях viewport, коротком viewport, с клавиатурой и nested scroll. _(source line 278)_
- [ ] Dialog Escape/focus trap/return/scroll lock/background inert; sticky Settings actions. _(source line 279)_
- [ ] Проверка дублирования chat import/export и project bundle actions. _(source line 280)_
- [ ] Long names, large lists, keyboard navigation, 44px touch targets. _(source line 281)_
- [ ] Functional menu отражает только реально зарегистрированные skills/agents/connectors and permissions. _(source line 282)_
- [ ] Native iPhone Safari, VoiceOver, safe-area, keyboard, rotation and touch cancellation — owner gate. _(source line 283)_
- [ ] Keep Native Popover API/CSS Anchor Positioning progressive enhancement only; preserve JS fallback. _(source line 284)_

### docs/PRE_LAUNCH_STACK_RU.md — Шаг 3. Подтвердить целевой профиль
- [ ] Есть доступ к имеющемуся VPS либо подтверждена итоговая цена нового. _(source line 70)_
- [ ] ОС/архитектура совместимы с выбранным runbook. _(source line 71)_
- [ ] Достаточно RAM/диска после учёта уже работающих сервисов и модели. _(source line 72)_
- [ ] Известно, кто имеет SSH/root access и как восстановиться при неудачном обновлении. _(source line 73)_
- [ ] Домен, DNS и план ежемесячных затрат понятны. _(source line 74)_
- [ ] Никакие существующие сервисы не будут удалены/перенастроены без инвентаризации. _(source line 75)_

### docs/PRE_LAUNCH_STACK_RU.md — Этап D — обязательные локальные gates
- [ ] /livez возвращает HTTP 200 без обращения к Ollama. _(source line 108)_
- [ ] /readyz возвращает HTTP 200 при доступной Ollama; `/healthz` — совместимый alias `/readyz`. _(source line 109)_
- [ ] Неавторизованный /v1/models возвращает HTTP 401. _(source line 110)_
- [ ] Авторизованный /v1/models показывает только разрешённую модель. _(source line 111)_
- [ ] Небольшой completion завершается и возвращает модельный ответ. _(source line 112)_
- [ ] Повтор exact-запроса даёт ожидаемый cache HIT, а cache bypass действительно работает. _(source line 113)_
- [ ] Порты 8000 и 11434 слушают только loopback. _(source line 114)_
- [ ] В логах нет API ключа, пользовательского prompt, приватного документа или сырого аудио. _(source line 115)_
- [ ] Права env/config соответствуют инструкции; service перезапускается без ручного shell state. _(source line 116)_

### docs/PRE_LAUNCH_STACK_RU.md — Этап G — reboot, backup и rollback
- [ ] Перезапусти gateway и Ollama, проверь health/capabilities после рестарта. _(source line 138)_
- [ ] Перезагрузи VPS в согласованное окно и подтверди автозапуск сервисов/Tunnel. _(source line 139)_
- [ ] Сделай backup конфигураций и необходимой SQLite data; секреты хранить отдельным защищённым способом. _(source line 140)_
- [ ] Проверь restore на безопасной копии, прежде чем считать backup рабочим. _(source line 141)_
- [ ] Подготовь rollback: отключить hostname/tunnel route; вернуть предыдущий env/config; восстановить known-good commit/service unit; проверить health. Не удалять данные, volumes и старые сервисы ради чистоты. _(source line 142)_

### docs/PRE_LAUNCH_STACK_RU.md — Код и сайт
- [ ] Все выбранные PR проверены по актуальному HEAD и нужным required checks; после merge повторно проверены main Quality и Pages deployment. _(source line 157)_
- [ ] Лендинг не обещает работающий hosted endpoint, автоматическую синхронизацию, включённый voice/OCR или multi-user SaaS, если это не подтверждено. _(source line 158)_
- [ ] Проверены mobile layout, клавиатура/viewport, навигация, доступность клавиатурой и отсутствие внешних обязательных JS-зависимостей на лендинге. _(source line 159)_
- [ ] Все ссылки и инструкции ведут к актуальным путям; нет несуществующих contact/support обещаний. _(source line 160)_

### docs/PRE_LAUNCH_STACK_RU.md — Сервер и безопасность
- [ ] API работает за HTTPS Tunnel; origin ports закрыты; auth/CORS/allowlist/limits проверены. _(source line 163)_
- [ ] Модель не превышает заданный RAM/latency budget под тестом; restart and reboot проверены. _(source line 164)_
- [ ] Секреты не попали в git/history/logs/artifacts. _(source line 165)_
- [ ] Backup восстановлен в тестовой копии; rollback известен. _(source line 166)_
- [ ] Есть владелец расходов, мониторинг диска/RAM и расписание обновлений. _(source line 167)_

### docs/PRE_LAUNCH_STACK_RU.md — Продукт и политика
- [ ] Определён закрытый круг первых пользователей и путь обратной связи. _(source line 170)_
- [ ] На лендинге раскрыты ограничения и зависимость от пользовательского gateway. _(source line 171)_
- [ ] Подготовлены Terms/Privacy policy только под фактические data flows; не писать «данные никогда не покидают устройство», если может быть выбран внешний provider. _(source line 172)_
- [ ] Для открытого multi-user доступа отдельно спроектированы auth/session, tenant isolation, quotas, abuse controls, cost controls и retention/deletion. До этого не выдавать личный beta за публичный SaaS. _(source line 173)_

### docs/LAUNCH_PRIVACY_REVIEW_RU.md — 2. Что обязательно подтвердить владельцу перед публичным Privacy Notice
- [ ] Оператор: физическое лицо или юридическое лицо, публичное имя/бренд и юридический адрес, если применимо. _(source line 25)_
- [ ] Контакт для запросов на доступ/удаление и вопросов приватности (лучше отдельный адрес поддержки; не выдумывать адрес до его создания). _(source line 26)_
- [ ] География оператора, хостинга, предполагаемых пользователей и целевые страны запуска. _(source line 27)_
- [ ] Целевая аудитория и минимальный возраст, если применимо. _(source line 28)_
- [ ] Будет ли это личный интерфейс одного владельца, ограниченная beta по приглашениям или публичный многопользовательский продукт. _(source line 29)_
- [ ] Реальная схема входа и авторизации: сейчас отдельная multi-user auth система не подтверждена. _(source line 30)_
- [ ] Точные домены, hosting providers, Tunnel mode/plan и фактически подключённые внешние AI/search providers. _(source line 31)_
- [ ] Какие данные собираются: чаты, выбранный контекст, проекты/инструкции, вложения, provider settings, browser storage, server-side cache, diagnostic logs, billing/support messages. _(source line 32)_
- [ ] Retention по каждой категории: browser data, server cache, logs, temporary files, backup copies. Если срок неизвестен, сначала измерить/проверить, а не угадывать. _(source line 33)_
- [ ] Реальная политика удаления и экспорта: что удаляется сразу, что остаётся в резервных копиях и когда копии ротируются. _(source line 34)_
- [ ] Фактическая обработка Cloudflare/GitHub Pages/VPS и внешнего провайдера: metadata/access logs, location/jurisdiction, applicable terms. _(source line 35)_
- [ ] Используются ли analytics, cookies beyond essential browser storage, tracking pixels, telemetry или third-party frontend assets. _(source line 36)_
- [ ] Как обрабатываются запросы об удалении, security incident, credential compromise и закрытии аккаунта, если появится account system. _(source line 37)_
- [ ] Кто отвечает за support и стоимость вычислений; есть ли автоматические биллинговые ограничения/quotas. _(source line 38)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V0 — Контракт и безопасность
- [ ] `GET /v1/capabilities` отражает только реально включённые функции. _(source line 31)_
- [ ] Неавторизованные запросы получают 401; тело, длительность и время выполнения ограничены. _(source line 32)_
- [ ] Конкурентные ASR/TTS задачи не копятся бесконечной очередью; корректно возвращается 429. _(source line 33)_
- [ ] Временные аудиофайлы удаляются при успехе и ошибке; сырой звук не пишется в логи и долговременную память. _(source line 34)_
- [ ] Проверены лицензии и SHA-256 бинарника/моделей/голоса; runtime пути задаются оператором, ничего не скачивается автоматически. _(source line 35)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V1 — Реальный локальный ASR
- [ ] Установлены совместимые `whisper.cpp`, `ffprobe` и локальная ASR-модель. _(source line 38)_
- [ ] На целевом устройстве браузер действительно получает микрофонное разрешение, записывает поддерживаемый MIME/кодек и корректно останавливает треки. _(source line 39)_
- [ ] Русская, английская и тайская короткие записи проходят через настоящий endpoint; ошибки формата/пустой записи объясняются пользователю. _(source line 40)_
- [ ] Транскрипт вставляется в composer и остаётся редактируемым; автоматической отправки нет. _(source line 41)_
- [ ] Измерены время до первой расшифровки, длительность аудио, пиковая RAM и точность на фиксированном небольшом тестовом наборе. _(source line 42)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V2 — Реальный локальный TTS
- [ ] Установлены совместимые Piper runtime и voice model с проверенной лицензией. _(source line 45)_
- [ ] Несколько ответов на русском/английском синтезируются в валидный WAV и воспроизводятся на целевом iPhone/браузере. _(source line 46)_
- [ ] Stop отменяет запрос и воспроизведение; повторное нажатие не запускает дубликат. _(source line 47)_
- [ ] Измерены latency, длительность генерации, размер WAV и RAM. _(source line 48)_
- [ ] Синтез отключён при недоступном runtime, без имитации успешного ответа. _(source line 49)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — V3 — Half-duplex голосовой помощник
- [ ] Кодовый half-duplex цикл и mock E2E существуют (PR #60); реальная последовательность запись → ASR → редактируемый текст → запрос → TTS → воспроизведение → следующий ход на целевом устройстве не проверена. _(source line 52)_
- [ ] Нет автоматической отправки до подтверждённого состояния, если режим явно не настроен на это. _(source line 53)_
- [ ] Ошибка на любом этапе оставляет пользователя в восстанавливаемом состоянии; нет скрытой повторной записи или позднего воспроизведения. _(source line 54)_
- [ ] Отдельно проверены iOS Safari, блокировка/разблокировка экрана, переключение аудиоустройства и прерывание звонком. _(source line 55)_
- [ ] Только после измерений решить, нужен ли streaming/VAD/barge-in; не добавлять их как фиктивную настройку. _(source line 56)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — D0 — Защищённое извлечение
- [ ] Проверить `ALANDI_DOCUMENT_EXTRACTION_ENABLED=false` по умолчанию; включать только на намеренно настроенном gateway. _(source line 61)_
- [ ] Проверить реальные сигнатуры/MIME, расширения, пределы размера, страниц/листов, ZIP entries, коэффициента сжатия, времени и длины извлечённого текста. _(source line 62)_
- [ ] Проверить повреждённые файлы, архивную бомбу, неверное расширение, пустой/сканированный PDF, превышение лимитов и cleanup временных данных. _(source line 63)_
- [ ] Сохранить `no-store`; не отправлять документ в стороннего провайдера без явного выбора и применимых настроек согласия/приватности. _(source line 64)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — D1 — Путь от вложения до ответа модели
- [ ] На реальном gateway вложить по одному TXT, PDF с текстовым слоем, DOCX, XLSX, CSV и JSON. _(source line 67)_
- [ ] Подтвердить, что извлечённое содержимое действительно включено в prompt активного провайдера, а не просто отображено в UI. _(source line 68)_
- [ ] Проверить страницы/листы и происхождение источника; для таблиц не терять заголовки, порядок и значения ячеек. _(source line 69)_
- [ ] Недоступный parser или превышение лимита блокирует отправку с понятной ошибкой, а не создаёт впечатление, что модель прочитала файл. _(source line 70)_
- [ ] Проверить раздельные сценарии собственного и стороннего провайдера: документ не должен незаметно менять выбранный маршрут. _(source line 71)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — D2 — Следующий уровень ingestion (не считать реализованным)
- [ ] OCR для сканированных PDF и изображений — отдельный локальный компонент, лицензия, лимиты и тесты. _(source line 74)_
- [ ] Chunking с page/offset/source hash, preview и подтверждением перед индексацией. _(source line 75)_
- [ ] Re-index/delete, удаление производных chunks вместе с источником, provenance и тесты scope isolation. _(source line 76)_
- [ ] XLSX: отдельно определить формулы, отображаемые значения, листы и лимиты. _(source line 77)_
- [ ] Видео: выборка кадров не равна расшифровке звука; audio track, ASR и синхронизация требуют отдельного pipeline. _(source line 78)_
- [ ] Google Drive OAuth/Picker/sync не обещать до завершения UI, encrypted token storage, revoke и проверки удаления индекса. _(source line 79)_

### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — UX и режимы
- [ ] **Голосовое сообщение:** UI/code path реализован; пользователь может записать фрагмент, отредактировать расшифровку и отправить вручную. Реальный микрофон/модель на целевом устройстве ещё не проверены. _(source line 104)_
- [ ] **Живой разговор (первый этап — half-duplex):** прототип цикла есть, но это не streaming/full-duplex. Проверить реальные ASR/TTS, задержку, отмену, echo и состояние UI на устройстве. _(source line 105)_
- [ ] Переключение в живой режим не включается само собой; видимые Start/Stop и разрешение микрофона обязательны. Stop прекращает запись, ASR, запрос модели и воспроизведение настолько полно, насколько позволяют используемые API. _(source line 106)_
- [ ] Для локального TTS показывать только голоса, чьи файлы и runtime действительно установлены и прошли проверку. Если доступен один голос, не рисовать второй фиктивный вариант. _(source line 108)_
- [ ] Голос хранится как предпочтение выбранного режима/чата согласно принятой модели настроек; не передавать это предпочтение внешнему провайдеру, если синтез остаётся локальным. _(source line 109)_
- [ ] При смене языка выбирать совместимый установленный голос либо объяснять, что голос недоступен; не делать тихий fallback на внешний сервис. _(source line 110)_
- [ ] Расшифровка и ответ видны текстом, если пользователь не включил отдельный режим аудио-only. Пользователь может исправить распознанный текст до отправки. _(source line 111)_

### docs/WORKSTREAM_GOVERNANCE_RU.md — 7. Governance task ledger
- [ ] GOV-003 — apply explicit titles/banners/labels to all existing future/research PRs after reviewing each PR and current labels. _(source line 99)_
- [ ] GOV-004 — add repository-side merge protection/automation only after checking existing rulesets and obtaining owner approval; labels alone are not a security boundary. _(source line 100)_
- [ ] GOV-005 — update master registry and orienters when PR #127 is revised/merged. _(source line 101)_

### docs/START_HERE_RU.md — 5. Проверка «готово»
- [ ] Pages deployment успешен, сайт открывается. _(source line 54)_
- [ ] VPS: Ollama и gateway активны. _(source line 55)_
- [ ] Gateway доступен только через Tunnel; публичные порты 8000/11434 закрыты. _(source line 56)_
- [ ] HTTPS hostname отвечает; неправильный API key получает 401. _(source line 57)_
- [ ] Из чата проходит реальный completion через gateway. _(source line 58)_
- [ ] Cache MISS → повтор HIT; bypass действительно обходит cache. _(source line 59)_
- [ ] После перезагрузки VPS gateway и Tunnel запускаются автоматически. _(source line 60)_
- [ ] Сохранены backup env/config и инструкции rollback (сам секрет — отдельно и защищённо). _(source line 61)_

### Retired


### Historical completed source marks
### docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md — UX и режимы
- [x] **Выбор установленного голоса:** PR #75 добавил allowlisted список preinstalled Piper voices из authenticated `/v1/capabilities` и UI selector; API валидирует voice ID. Остаются выбор конкретных packs, artifact-specific license/SHA-256, реальный синтез и UX-проверка на устройстве. _(source line 107)_

### docs/WORKSTREAM_GOVERNANCE_RU.md — 7. Governance task ledger
- [x] GOV-001 — define LANDING vs RESEARCH/FUTURE/SPIKE separation. _(source line 97)_
- [x] GOV-002 — define branch/PR naming and merge policy. _(source line 98)_

## 4D. Accepted improvements and requirements carried into the priority plan

Source: docs/ACCEPTED_IMPROVEMENTS.md. Current accepted tracks are represented in P0/P2/P3: AI-AGENT-005 — policy-enforced autonomous orchestration (real capability/permission policy, not a prompt promise); AI-UI-005 — adaptive-minimalist private workspace with owner-controlled changes. AI-MEM-007 — opt-in browser-to-server project memory bridge — is explicitly RETIRED and must not be reintroduced. The source file contains the concise acceptance record; no new permission is granted by that historical decision.

Requirements crosswalk from docs/ALANDI_REQUIREMENTS_REGISTER_RU.md: preserve manual and explicit provider-mode separation; isolate history/context per route; never auto-fallback between providers; keep Personal/Project/Global memory scopes distinct and permissioned; user can refuse/revoke memory access; show provider and route status honestly; avoid claiming a connected/unavailable provider as active. These requirements are consolidated into P2.2–P2.10 and release gates; older conflicting defaults are superseded by later owner overrides.
## 5. Completed archive — читать в последнюю очередь

Следующие строки были отмечены [x] в старых реестрах. Это исторические отметки; не считать их автоматически подтверждёнными на текущем SHA. Не возвращать в работу без нового требования или контр-evidence.

### MASTER_TASK_REGISTRY_RU.md — CHATSET — `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`
- [x] **CHATSET-111** **CHATSET-111** (строка 111; `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`): Research Studio снята владельцем и удалена; прежний контракт модального окна больше не действует. Сами настройки чата остаются отдельными. _(исходный статус: DONE; строка 497)_

### MASTER_TASK_REGISTRY_RU.md — F1. Landing V1 — постоянное улучшение текущего стека
- [x] **LANDING-TRACK-001** **LANDING-TRACK-001**: Зафиксировать направление постоянного поиска улучшений лендинга строго внутри согласованного стека. **Progress:** границы повторно сверены с `docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md` и `docs/TECHNIQUE_REGISTER_RU.md`. _(исходный статус: DONE; строка 786)_
- [x] **LANDING-TRACK-002** **LANDING-TRACK-002**: Создать отдельный bounded backlog улучшений Landing V1. **Artifact:** `docs/LANDING_STACK_IMPROVEMENT_BACKLOG_RU.md` в PR #129. _(исходный статус: DONE; строка 787)_

### MASTER_TASK_REGISTRY_RU.md — F2. Future workstreams — отдельные PR, не для случайного merge
- [x] **GOVERNANCE-001** **GOVERNANCE-001**: Ввести правила разделения LANDING / RESEARCH / FUTURE / SPIKE. **Artifact:** `docs/WORKSTREAM_GOVERNANCE_RU.md` в PR #129. _(исходный статус: DONE; строка 794)_
- [x] **GOVERNANCE-002** **GOVERNANCE-002**: Зафиксировать naming, HOLD banners, Draft state and owner-approval merge gates. _(исходный статус: DONE; строка 795)_

### MASTER_TASK_REGISTRY_RU.md — F3. Voice 2.0 — research-only
- [x] **VOICE-001** **VOICE-001**: Создать отдельную ветку `research/voice-assistant-transcription-20261031` от актуального main. _(исходный статус: DONE; строка 802)_
- [x] **VOICE-002** **VOICE-002**: Сверить существующие voice implementation plan, Exa synthesis, multimodal stack, latency contract, language matrix, V-016 checklist and current implementation notes. _(исходный статус: DONE; строка 803)_
- [x] **VOICE-003** **VOICE-003**: Зафиксировать последовательность источников: ранее найденные совместно → repository → owner-provided → independent primary sources. _(исходный статус: DONE; строка 804)_

### MASTER_TASK_REGISTRY_RU.md — F4. Исторический общий backlog
- [x] **REGISTRY-001** **REGISTRY-001**: Найти прежний большой список незавершённых задач. **Result:** PR #127 / `docs/MASTER_TASK_REGISTRY_RU.md` — lossless inventory of **544 open/partial rows** across 20 unique checklist documents plus two branch-only snapshots (470 unchecked + 74 partial), including main operational/privacy/voice/architecture lists and active PR #125/#126/#129/#130 task deltas. Duplicates intentionally preserved; no original source was modified. _(исходный статус: DONE; строка 833)_

### MASTER_TASK_REGISTRY_RU.md — F6. Физическая изоляция future/research PR
- [x] **GOVERNANCE-006** **GOVERNANCE-006**: Создать отдельную holding base branch `future-workstreams/parking-base-20261031` от main SHA `e78a73b25725bfa63370d9946887cbbacbf51b82`. _(исходный статус: DONE; строка 853)_
- [x] **GOVERNANCE-007** **GOVERNANCE-007**: Перенаправить PR #125, #128 и #129 на holding branch; все три остаются Draft и помечены в заголовке/body как HOLD / DO NOT MERGE. Их merge не меняет main. _(исходный статус: DONE; строка 854)_

### MASTER_TASK_REGISTRY_RU.md — F7. Deep Research 2.0 — отдельный workstream
- [x] **DR2-001A** **DR2-001A**: Создать самостоятельную ветку `research/deep-research-2.0-20261031` от holding base. _(исходный статус: DONE; строка 860)_
- [x] **DR2-002A** **DR2-002A**: Создать PR #130 Draft / HOLD, отдельно от Agent Studio и Voice. _(исходный статус: DONE; строка 861)_
- [x] **DR2-003A** **DR2-003A**: Зафиксировать baseline: `docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md` и `docs/DEEP_RESEARCH_2_CURRENT_STATE_AUDIT_RU.md`, `docs/DEEP_RESEARCH_2_EXTERNAL_RESEARCH_2026-10-31_RU.md`. _(исходный статус: DONE; строка 862)_

### MASTER_TASK_REGISTRY_RU.md — G. Session continuity — single entrypoint
- [x] **ORIENT-001 — SUPERSEDED BY NOW.md (2026-11-15).** Current contract: read only root `NOW.md` lines 1–100 first; append each complete owner request and each material action/checkpoint there; make one batched live GitHub read for main SHA and open queues. No default PR, no parallel handoff, no startup bundle. Historical ORIENT/OLEDUE/FILE_ORIENTER records are on-demand history only. _(исходный статус: DONE; строка 872)_
- [x] **ORIENT-002 — HISTORICAL HANDOFF TEST (2026-11-07).** The previous fresh-session exercise is retained as historical evidence; it does not route current work or authorize resuming PR #154/#131. The latest explicit owner request in NOW.md always wins. This workflow does not claim to repair ChatGPT client loading failures. _(исходный статус: DONE; строка 873)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — A. Functions / Agents menu — PR #131
- [x] **MENU-009** **MENU-009** — supporting UX contract создан; source audit and remaining gaps синхронизированы с canonical UI checklist section 8.28. _(исходный статус: DONE; строка 30)_
- [x] **UI-ICON-001** **UI-ICON-001** — owner UI requirement 8.8: icon-first copy/open/speak message actions with accessible labels/tooltips and 44×44 hit area; retain copy/speak in full-message view, with speak unavailable for user messages. Exact-head Quality #42349078380 passed (Jekyll, Chromium and all Quality sentinels) on implementation/test SHA 350c01513ec6dc147cd5b26e7b8e3bfa17a26d0e; status-only documentation follow-up SHA e41b1f40a0ea121a759bd0080ffc63dd2cde09c6 is awaiting recheck. _(исходный статус: DONE; строка 31)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — C. Компактные модели / SLM — PR #125
- [x] **SLM-001** **SLM-001** — определить task-based bake-off вместо рейтинга по числу параметров; роли: classification/routing, structured extraction, reranking, summarization, memory candidate generation, Skill synthesis. **Artifact:** `docs/AGENT_MODEL_BAKEOFF_RU.md`, раздел “2026-11-02 — Task-based small-model evaluation contract”. _(исходный статус: DONE; строка 47)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — F. Chromium and responsive follow-up — PR #131
- [x] **MENU-010** **MENU-010** — Research Studio is retired entirely by the owner. PR #169 removes the Research Studio surface and entrypoints; exact PR Quality #42408172737 passed 113/113 Chromium. _(исходный статус: DONE; строка 107)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Продолжение владельца — 2026-11-05
- [x] **ORIENT-2026-001 — SUPERSEDED BY NOW.md (2026-11-15).** Historical PR #140 handoff remains evidence only; the single first-read checkpoint is root `NOW.md` lines 1–100, with full owner prompts and append-only step journal. Do not read/recreate Session Sync Capsule, OLEDUE, ORIENTER or FILE_ORIENTER as startup inputs. Detailed product documents are on-demand. _(исходный статус: DONE; строка 121)_
- [x] **BASELINE-2026-001** **BASELINE-2026-001** — preserve original Landing V1 at `9b746f7bbb1a12b482bd6f0a7cefd62b3cb454af` in branch `archive/landing-v1-baseline-9b746f7-20261105`. This is a separate recoverable reference; main remains open to bounded quality improvements. _(исходный статус: DONE; строка 122)_
- [x] **LANDING-V1-2026-001** **LANDING-V1-2026-001** — promote the independent public landing accessibility/responsive slice via PR #139 (merge SHA `2e11849d409a51009693af95ac3ecbf1f057a3fc`). Exact-main Quality, Pages, Freshness, Provenance and Graphify passed on that merge SHA. _(исходный статус: DONE; строка 123)_
- [x] **N2O-2026-001** **N2O-2026-001** — integrate the owner-provided N₂O Core, Knowledge Loop, ChatGPT Sources and Project Instructions documents via PR #142 (merge SHA `c307b7e3940e9051843befd5f77acfeaef66c91d`). Three owner-provided source documents were byte-for-byte matched to the uploaded files. Existing `AGENTS.md` and `LOOP.md` remain shared engineering foundations. _(исходный статус: DONE; строка 124)_
- [x] **SOURCES-2026-001** **SOURCES-2026-001** — refresh upstream architecture inspiration and license/revision triage via PR #144 (merge SHA `99c5d673cf239a1cd86b67aca101a3c0773f3761`). XERJ, Memvid, RAG-Anything, Graphify, Superpowers and durable-execution references are research candidates, not adopted dependencies. _(исходный статус: DONE; строка 125)_
- [x] **VOSK-2026-001** **VOSK-2026-001** — store Vosk Small Russian 0.22 archive in `models/vosk/` via PR #143 (merge SHA `12ce75cdd6e14ae7752643bb20fc5421b177c26e`): 46,236,750 bytes, SHA-256 `961d5ff98a17f4aa6de69864d0aa71fa5bac682301d2b5d17a3f24c5c99a46d4`, metadata, checksum, upstream README and Apache-2.0 license notice. Acquisition workflow is read-only/manual. `ship=false`; no runtime activation. _(исходный статус: DONE; строка 126)_
- [x] **DEP-2026-001** **DEP-2026-001** — consolidate dependency/lock and document-parser improvements from PRs #124/#126 into PR #145 (merge SHA `88d230fc92fef5b884af699345fd010291107693`). Universal `uv.lock`, FastAPI/Uvicorn/pypdf pins, Python 3.12/3.13/3.14 matrix and `asyncio.to_thread` document parsing; all PR-head Quality/Gateway/Graphify/Provenance/Dead Code checks passed. _(исходный статус: DONE; строка 127)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — G. Browser persistence integrity and follow-up debugger findings — 2026-11-05
- [x] **AUDIT-FIND-013 — P1 settings-profile partial-write / false-success.** Fixed on PR #150 code/test HEAD `c1103a74cc0774380b98728fd0e5698c1afb64db`: raw snapshots, reverse-order restore, active-chat rollback and success gating. Two Chromium quota-injection regressions pass. _(исходный статус: DONE; строка 212)_
- [x] **FIX-011 — transactional settings-profile import.** Profile keys and active-chat state are rolled back if any required localStorage write fails; API-key storage is untouched and existing key names/schema are preserved. _(исходный статус: DONE; строка 213)_
- [x] **AUDIT-FIND-014 — P2 fire-and-forget chat-setting persistence.** Fixed on PR #150 exact code/test HEAD `54e4858ed19fb4fa1daaa55444121ff2f8c5f780`: a shared mutation helper snapshots chat fields and raw mirrored storage keys, then rolls back both on any failed write. Search/processing/multi-agent modes, skill preset/goal/output/custom fields and agent-team controls now use the helper. _(исходный статус: DONE; строка 214)_
- [x] **FIX-012 — common chat-setting mutation rollback.** Two Chromium quota-injection regressions exercise mode/mirror rollback and skill/agent configuration UI rollback; existing storage names/schema remain unchanged. _(исходный статус: DONE; строка 215)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — H. Owner priority reset and recurring requirements — 2026-11-07 (append-only)
- [x] **OWN-001 — OLEDUE fast handoff / principles integration (P0).** The normative Core, Knowledge Loop and concise LOOP method are explicitly linked from OLEDUE/AGENTS/orchestrator and now from LOOP itself. Owner task-intake and single-index routing are in main via PR #156. Fresh-session ORIENT-002 was exercised in this session: OLEDUE first, one batched live-state orientation, latest request routed to UI-PROMO-001 / PR #154, exact head/checks inspected. ORIENT-002 is recorded complete in the Master Registry. Keep handoff short; do not add mandatory bulk reads or another backlog. _(исходный статус: DONE; строка 223)_
- [x] **PAGES-001 — GitHub Pages publication truth (P0; VERIFIED on current main, 2026-11-08).** Current `main` is `bf039f887e29137b627b06fc2bb107c2793d6b69`. GitHub-managed Pages deployment #42410162803 completed SUCCESS on this exact SHA. Quality run #42410163178 completed FAILURE overall only because the separate published release-contract sentinel still forbade the owner-approved `functionsMenu`; the Chromium job itself passed the built app, published root, canonical landing content and landing Chromium (8/8) on the exact SHA. PR #174 repairs only that stale contract. Production remains GitHub-managed Pages/Jekyll; no duplicate deploy workflow or custom builder is needed. _(исходный статус: DONE; строка 224)_
- [x] **PLAN-001 — unified orchestrator navigation (P0).** Keep one canonical entrypoint (OLEDUE) pointing to N₂O principles, LOOP, external-source inventory INTEL, roadmap, decisions, state and Master Task Registry. Avoid new parallel backlogs; synchronize project state/orientation only when materially changed. **Implemented:** `PROJECT_ORCHESTRATOR_RU.md` was created and merged in PR #156 at main SHA f6f3896bf3989f9c88e3764f848b84e90b601a65; OLEDUE and AGENTS point to it, with principles core/knowledge loop, INTEL, roadmap, decisions, evals, provenance and one task register. _(исходный статус: DONE; строка 226)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — Owner override — 2026-11-08: Functions menu capability slice (D-022)
- [x] **FUNCTIONS-DETAIL-001 / MENU-002 / MENU-003:** Owner explicitly requests a concise Functions section containing Agents/structured analysis, Deep Research and Skills/task profile. PR #169 merged at main `72bcd1a4e9b31bbd7c1076d3f3204e488437dbc2` and exact PR Quality #42408172737 passed 113/113 Chromium. Deep Research selects Thorough processing mode only; web-search breadth stays orthogonal. Agent mode is the current four-stage same-model pipeline, not a swarm. Skills are prompt/profile guidance only and grant no permissions. Integrations/connectors remain hidden until real registry/status/permission contracts exist. Research Studio remains retired. _(исходный статус: DONE; строка 271)_

### MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md — J.6 Full checklist and supply-chain audit — 2026-11-08
- [x] **REGISTRY-003** **REGISTRY-003** — inventory and normalize stable task IDs across the master registry and append-only addendum. As of 2026-11-08: main 599 unique IDs; addendum 128 unique IDs; REGISTRY-002 is the only cross-file shared ID; no duplicate IDs remain within either file and no unnumbered checklist rows remain in this addendum. Source-description reconciliation continues under REGISTRY-002. _(исходный статус: DONE; строка 327)_
- [x] **VOICE-DEDUP-001** **VOICE-DEDUP-001** — completed source crosswalk: VOICE2-106…112 → VOICE-004…010 (VOICE-TRACK-003…009); VOICE2-113 → VOICE-TRACK-010; VOICE2EXT-080…087 → VOICE-EXT-001…008; USER126-254…258 → USER125-254…258. The distinct VOICE-011…018 and AUDIO-GEN-001…009 tasks are now atomized in the master registry; source references are preserved as cross-links, not duplicate tasks. _(исходный статус: DONE; строка 329)_
- [x] **ACTION-PIN-001** **ACTION-PIN-001** — 14 repository workflow files contain 62 direct external references; all 62/62 are full 40-character SHAs. Main Integrity job #128516358240 passed the action-pinning step. _(исходный статус: DONE; строка 331)_

---
Детальные технические документы, схемы и research сохраняются как спецификации/источники. У них нет права менять порядок работ без обновления этого файла. Все новые owner requirements добавляются сюда; никаких параллельных backlog не создавать.

### Дополнительные исторические [x] отметки из актуальных source checklists
### docs/USER_REQUEST_CHECKLIST.md — A. База, управление и непрерывность
- [x] PR #20 с базовыми контрактами памяти, инструментария, происхождения источников и governance объединён; CI прошёл. _(source line 10)_
- [x] Создана ветка для облачной настройки/UX: `feat/alandi-cloud-settings-ux`. _(source line 11)_
- [x] PRs #21–#29 merged with required PR-head gates passing. PR #32 then merged at `31eecce8203073dbc8e0e46b3ac338f64788d59b`; all six PR-head jobs passed, including Chromium regression, integrity/security/context sentinels, Jekyll build and published Pages browser smoke. Added safe structured Markdown fallback when CDN renderer libraries are unavailable. Gateway contract/security tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708`. Live gateway/VPS and separate post-merge deployment remain unverified. _(source line 12)_
- [x] Проведён аудит V-016 §0–40 и начальной инженерной фиксации; создан подробный 81-пунктный ledger в `docs/V016_IMPLEMENTATION_CHECKLIST.md`. Аудит завершён, но многие runtime-функции ещё не реализованы/не подтверждены. _(source line 13)_

### docs/USER_REQUEST_CHECKLIST.md — B. Первичное облако aLandi и API-провайдеры
- [x] Зафиксировано продуктовое правило: aLandi Cloud — единственный главный облачный блок; Kilo остаётся обычным альтернативным провайдером в общем списке, без отдельной главной кнопки. _(source line 18)_
- [x] Собственное облако aLandi — единственная кнопка/главная карточка в верхней части настроек; Kilo и остальные альтернативы расположены только в общем списке сторонних провайдеров. _(source line 19)_
- [x] Проверено: async-проверка не подтверждает другой провайдер/модель/ключ после их смены; legacy-проверка aLandi не перезаписывает отдельно изменённую главную облачную карточку. Deterministic race E2E прошли в PR #22 (HEAD `bd8fdddd…`) и post-merge Quality Sentinel прошёл на main `7fac23ce…`. _(source line 28)_
- [x] All-provider smoke workflow требует явного подтверждения (default false) и поддерживает per-provider model overrides; PR #25 quality/provenance CI passed. Live workflow не запускался из этой сессии; доступность аккаунтов не утверждается. _(source line 35)_

### docs/USER_REQUEST_CHECKLIST.md — D. Чаты, проекты, инструкции и память
- [x] Historical PR #27 Gateway/provenance/Quality/Pages evidence retained. Its server-memory graph API is now retired by owner; do not enable or restore it. _(source line 69)_

### docs/USER_REQUEST_CHECKLIST.md — E. Инструменты, маршрутизация, веб-поиск и отказы
- [x] Ограниченный fallback web_search на открытые источники реализован и прошёл Chromium E2E без Tavily-ключа. Недоступные источники пропускаются; ссылки берутся из реальных ответов. Доступность API всё ещё зависит от CORS/сети. _(source line 79)_

### docs/USER_REQUEST_CHECKLIST.md — F. V-016: зависимости, аудио, память, бюджеты и лицензии
- [x] Детерминированный state hash реализован и проверен CI: сортированные пути и SHA-256 содержимого, исключение типовых секретов/генерируемых каталогов, `index.md` включён. Это не подпись и не доказательство безопасности. _(source line 88)_
- [x] cPocket hardening merged in PR #28; gateway contract/security tests passed on post-merge main `e424d353418cad62981eb269b4082d2925592708`. Cap 128 cleanup registrations per lease; cleanup continues after RuntimeError/CancelledError and rollback is tested for exactly-once behavior. Target-runtime resource/FD soak and live voice integration remain unverified. _(source line 94)_

### docs/USER_REQUEST_CHECKLIST.md — Part I — CODER_PACKET.md: архитектура, обязательные контракты, фазы 0–8
- [x] Прочитаны разделы 1–8: канонические источники, non-negotiable contracts, текущая архитектура, план фаз 0–8, voice latency, model/license policy, eval/release gates и non-goals. _(source line 115)_
- [x] Зафиксированы ограничения: не выдавать prototype за live, не обещать p95 без измерения, no fake sandbox, no fake citation checks, tool approval/SSRF, scoped deletion, локальный аудиотракт и отсутствие автоматического cloud provisioning. _(source line 116)_

### docs/USER_REQUEST_CHECKLIST.md — Part III — ACCEPTED_IMPROVEMENTS.md и связанные артефакты
- [x] Сверены все строки реестра accepted improvements с идентификаторами в PROJECT_STATE.yaml; статус каждой строки сохранён отдельно, а не слит в одно «готово». _(source line 167)_
- [x] Различены реализованные модули, prototypes, документационные контракты, deferred items и блокеры. Макет или unit primitive не приравниваются к production runtime. _(source line 168)_

### docs/USER_REQUEST_CHECKLIST.md — Part IV — EVALS.md, DECISIONS.md, LOOP.md, INTEL.md, license/latency/infra/domain gates
- [x] Проверены eval registry, решения D-001…D-006, bounded engineering loop, source/licensing register, latency contract, infrastructure upgrade и domain setup. _(source line 172)_
- [x] Voice performance, 8-GB profile, OTel exporter, native audio path, real sandbox, full LazyGraphRAG, external approval UI и live VPS обозначены как не подтверждённые/не развёрнутые. _(source line 173)_

### docs/USER_REQUEST_CHECKLIST.md — I. Следующие продуктовые вертикали
- [x] PR #29 head checks passed: Quality/Chromium, provenance and published Pages smoke. Post-merge main Quality/Chromium, provenance and Pages deployment passed at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; gateway contract/security tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708`. _(source line 200)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 owner quickstart and chat ergonomics
- [x] Added owner-first setup sequence: `docs/START_HERE_RU.md`, linked from detailed VPS guide. It distinguishes existing VPS diagnostics from new Vultr setup and gates tunnel/client setup on local health/auth/completion/cache checks. _(source line 209)_
- [x] Added evidence-based subsystem roadmap: `docs/IMPLEMENTATION_ROADMAP_RU.md`, ordered P0 client UX → voice message → live voice → document/RAG → image/video → agent teams → memory/security → provider operations/governance. _(source line 210)_
- [x] PR #33 merged at `05f4c2454c279cc21dcbf08c83ff3c3025838257`; PR #34 merged at `e3463f9b048dfda742b8158faf054c617defda9a`; PR #35 merged at `23add2547a69df877b4baf213957827aa2e8e561`. PR-head run #418 passed context, integrity, security, Jekyll, 48 Chromium E2E tests and published-site browser smoke; separate license/provenance and dead-code gates passed. Post-merge main checkpoint `4fb39df2cb0c23c907fc69b52c1ebf2e05e6024e` also passed Quality workflow #420, 48 Chromium E2E tests, live-site smoke, Pages deployment #122 and provenance gate #159. Real-device keyboard/accessibility remain follow-up. _(source line 211)_
- [x] Replace prompt-based rename/project chooser with accessible in-app dialog/select; Chromium E2E covers rename and moving between projects. [ ] Real-device mobile keyboard open/close, focus, persistence and project delete/move accessibility follow-up. _(source line 212)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — 2026-10-24 project navigation and composer
- [x] PR #35: Projects at top, collapsed by default; each project expands to its own chat list; top-level Chats is expanded and contains only unassigned/personal chats. Covered by Chromium E2E. _(source line 217)_
- [x] New personal chat from Chats; create a project-scoped chat from that project's expanded group; per-row menu includes rename, clone, move/detach, clear history, delete. Covered by Chromium E2E. _(source line 218)_
- [x] Move global memory controls and project facts under collapsed project settings; persisted project memory scope selects project-only vs project-and-global. Implemented; UI/browser checks pass. _(source line 219)_
- [x] Add composer + chooser for photo/video vs unrestricted multi-file picker. Known text formats and images are processed; video sends sampled frames. Other binary formats are selected but currently shown as unsupported and block sending until a parser/ingestion endpoint is implemented. Chromium E2E passes. _(source line 220)_
- [x] Add ◎ request-context selector for up to five projects. Context is scoped by chat ID, bounded, added to the next request only, and cleared after successful send. Selected project context must not mutate the chat's own project. Chromium E2E passes. _(source line 221)_
- [x] Voice chooser opens after press-and-hold, not a short tap. Long-press and short-tap behavior pass Chromium E2E; real-device touch/cancel still needs verification. Live recording, ASR, TTS and audio transcript remain unimplemented. _(source line 222)_
- [x] aLandi is a dedicated first-party primary-route card; third-party providers stay in advanced settings. Quality sentinel and Chromium E2E pass. _(source line 223)_
- [x] PR #35 was merged at `23add2547a69df877b4baf213957827aa2e8e561`; PR-head run #418 passed all quality gates, 48 Chromium E2E tests and published-site browser smoke. [x] Post-merge main checkpoint `4fb39df2cb0c23c907fc69b52c1ebf2e05e6024e` passed Quality workflow #420, live-site Chromium smoke, Pages deployment #122 and provenance gate #159. _(source line 224)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — local helper memory suggestions (2026-10-27)
- [x] Added a manual, bounded local-model flow to propose compact project-memory facts. PR #69 merged at `4c9096999fbb3e1265150c420b136066c555285b`. _(source line 231)_
- [x] Kept it disabled when `ALANDI_HELPER_MODEL` is blank; only the operator-configured local Ollama tag can be used; the route shares inference concurrency and asks Ollama to unload after the request. _(source line 232)_
- [x] Filtered common secret-like input/output patterns and require an explicit click for every saved candidate. A regression fix handles prefixed names such as `ALANDI_API_KEY`. _(source line 233)_
- [x] Exact PR-head Gateway run #40539476154, Quality/Chromium/published-site smoke #40539476242, and provenance #40539476214 passed. _(source line 234)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — reconciliation of the older mobile and interface request (2026-10-27)
- [x] Compared the full owner message with current `main`, the implementation roadmap, existing browser tests, and visible UI/source identifiers. The audit separates already implemented behavior from partial work and unimplemented interaction design in `docs/LEGACY_UX_REQUEST_AUDIT_RU.md`. _(source line 239)_
- [x] PR #71 (`fix/mobile-composer-docking-20261027`) merged: composer stays at the bottom in empty and populated chats, textarea height follows `visualViewport`, and Chromium viewport regression passes. Native iPhone Safari remains unverified. _(source line 240)_
- [x] PR #114 merged at `25bfe66b5454e45fb5f6cef9dd86ae3c0ef1c5e5`: empty global system prompt by default, obsolete Gemini reset removed, quality sentinel aligned with the opt-in prompt contract, and history budgeting reserves serialization headroom. Exact-head Quality/Chromium/published-site smoke passed. _(source line 241)_
- [x] PR #115 merged at `ed2c4c7ee3a67c7a0cf5b541c1ab6206609dd32c`: composer popover scrim, modal backdrop blur respecting reduced-transparency, inert first outside tap for toolbar/language/chat-row menus; exact-head Chromium and published-site smoke passed. _(source line 242)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — autonomous agent orchestration research (2026-10-28)
- [x] Reviewed additional upstream open-source patterns for orchestration, durable workflows, policy-as-code, sandboxing, agent evaluations, memory, protocols and observability; recorded source links and limitations in `docs/AGENT_ORCHESTRATION_RESEARCH_RU.md`. _(source line 249)_
- [x] Owner-approved design direction recorded in D-016 and AI-AGENT-005: explicit task state machine, least-capability executor, fail-closed policy gate, action-bound approval, independent verifier, durable journal/recovery, bounded retries and eval-gated helper model. _(source line 250)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — voice model landing and VPS owner steps (2026-10-28)
- [x] Added a VPS deployment runbook to `docs/VOICE_IMPLEMENTATION_PLAN_RU.md`: model install, voice/model hash and license review, feature-flag sequencing, private gateway binding, smoke checks, and release acceptance. _(source line 258)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — consolidated interface cleanup, 2026-10-30
- [x] PR #118 merged at `4bde19249b1ac05ccf55c2499a8ee08a27b9a198`: chat export/import actions live in each chat menu; chat import merges rather than replaces existing history, deduplicates IDs, validates settings and bounds imported data. Project bundle import/export remains in project settings. _(source line 269)_
- [x] PR #119 merged: persisted top/bottom composer preference; aLandi Cloud and third-party provider routes share one clear selector; redundant primary-route action and connector hints were removed; the staged research workflow is described truthfully; project-first quick actions and per-project memory scope are persisted. _(source line 270)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — sidebar hierarchy and preferences, 2026-10-30
- [x] PR #120 merged at `2bda22229cba3576628f92c821bb6e1562d8abc5`: memory controls have their own first sidebar section; project/chat navigation and status lines follow; Research Studio is below chats; theme/language controls are pinned at the sidebar bottom and language is synchronized with Settings. _(source line 277)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — orthogonal chat settings and Research Studio, 2026-10-30
- [x] PR #121 merged at `f4d880f`: separates work effort from web-search scope; clarifies the structured workflow and task-profile permissions; removes duplicated Research Studio selectors and makes Studio use active chat settings without mutating them; localizes the settings summary, removes the duplicate Research entry point and raises primary mobile hit areas to 44px. _(source line 282)_
- [x] Exact-head Chromium/Quality on PR #121 passed the orthogonal-settings, per-chat, RU/EN and Research Studio non-mutation coverage. _(source line 283)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — small-model evaluation and legacy branch reconciliation, 2026-10-30
- [x] Recovered a bounded synthetic local-model smoke harness: `gateway/evals/run_local_model_benchmark.py` plus `gateway/tests/test_local_model_benchmark.py`. Gateway Tests passed on the exact PR #123 code head. It uses fixed RU/EN/TH prompts, bounded requests/time/response size, environment-only API key and refuses redirects; target-host evaluation remains pending. _(source line 289)_
- [x] Chronological branch audit: current provider separation supersedes the legacy `self-hosted/free-cloud` selector; legacy project tools are deferred pending current permission/scope/approval contracts; the 64-role architecture document already exists in main and describes logical roles, not separate model processes. _(source line 292)_

### docs/USER_REQUEST_CHECKLIST.md — Supplement — V1 landing and interface finalization, 2026-10-30
- [x] Created the dedicated living release checklist: [V1_UI_FINALIZATION_RU.md](V1_UI_FINALIZATION_RU.md). It preserves the owner's 18 UI directions, adds landing-specific gates, states the V1/free-static-UI boundary and distinguishes implementation from verification. _(source line 296)_
- [x] Audited current ChatGPT/OpenAI UI patterns and official Apple, W3C, GOV.UK, NN/G and MDN accessibility/design guidance; recorded what is adopted and what is deliberately not copied in the V1 checklist. _(source line 297)_
- [x] Landing copy now distinguishes a free static interface from inference/API/hosting cost; public hosted AI endpoint is not provided by GitHub Pages. _(source line 298)_
- [x] Added staged roadmap disclosures; the "1nv3nt10n 1n PrOc3ss…" ticker is decorative, appears only for unfinished directions, is hidden from assistive technology and respects reduced-motion. _(source line 299)_
- [x] PR #121 merged: duplicate settings close action removed; integrity provider-group assertion uses deterministic parsing; Research Studio E2E excludes the expected provider connectivity probe from user-send count. _(source line 300)_
- [x] Landing and in-app roadmap E2E coverage passed on PR #121 exact head. Post-merge Pages deployment and public root + /landing/ exact-SHA Chromium checks passed on PR #173 merge SHA `bf039f887e29137b627b06fc2bb107c2793d6b69`; the remaining PR #174 failure is a stale release-contract sentinel, not a site failure. _(source line 301)_

### docs/USER_REQUEST_CHECKLIST.md — Owner override — 2026-11-07
- [x] **Research Studio retired.** PR #169 removed the complete product surface; post-merge public root/landing Chromium verified the absence on exact main SHA. Do not restore it. _(source line 307)_
- [x] **Owner override D-022 (2026-11-08) supersedes the previous menu prohibition:** restore only three truthful Functions entries — Agents/structured analysis, Deep Research, and Skills/task profile. PR #169 implements the menu and post-merge public Chromium verified it. Integrations/connectors remain absent until real capability registry/status/permission contracts exist. PR #174 corrects the stale release-contract assertion. _(source line 308)_
- [x] **First-party routing is separate.** aLandi aServi is a dedicated settings section, never a third-party provider option. PR #169 implements the exclusivity rule; PR #173 and post-merge public Chromium checks passed. No silent auto-fallback between aServi and external providers. _(source line 309)_

### docs/V1_UI_FINALIZATION_RU.md — 1. Общий UI/UX — [~]
- [x] Сохранить индивидуальный визуальный язык aLandi и не переписывать интерфейс на новый framework. _(source line 46)_
- [x] Развести память, проекты, чаты и настройки в отдельные зоны sidebar (PR #120). _(source line 47)_
- [x] Свести частые параметры запроса к короткой сводке и независимым настройкам (PR #121, ожидает финальной проверки). _(source line 48)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Composer и мобильная клавиатура — [~]
- [x] Composer остаётся нижним flex-элементом и не центрируется фиксированным позиционированием (PR #71). _(source line 55)_
- [x] Chromium E2E покрывает новый чат и resize viewport. _(source line 56)_

### docs/V1_UI_FINALIZATION_RU.md — 3. Маршруты aLandi и сторонних API — [~]
- [x] Собственная карточка «Мой сервер» отделена от списка внешних провайдеров. _(source line 63)_
- [x] Внешний picker сгруппирован; Kilo — обычный альтернативный провайдер. _(source line 64)_

### docs/V1_UI_FINALIZATION_RU.md — 4. Подписи, placeholder и inline validation — [~]
- [x] URL/модель/ключ собственного сервера представлены компактными полями с placeholder. _(source line 71)_
- [x] Ошибки трёх серверных полей имеют отдельные элементы. _(source line 72)_

### docs/V1_UI_FINALIZATION_RU.md — 5. System prompt и случайное редактирование — [x]
- [x] Глобальный пользовательский prompt пуст по умолчанию; legacy built-in prompt мигрирует в пустое значение (PR #114). _(source line 79)_
- [x] Сохранён явный режим редактирования; prompt не подменяет системные правила приложения. _(source line 80)_
- [x] Старый restore Gemini defaults удалён. _(source line 81)_

### docs/V1_UI_FINALIZATION_RU.md — 6. Инструкции сторонних провайдеров — [~]
- [x] Обычный провайдерный поток общий; Kilo не выделен в отдельную особую настройку. _(source line 87)_

### docs/V1_UI_FINALIZATION_RU.md — 7. Tools и Tavily — [~]
- [x] Ключ Tavily находится в свёрнутом разделе инструментов/веб-поиска, отдельно от ключей провайдеров. _(source line 94)_

### docs/V1_UI_FINALIZATION_RU.md — 8. Статус собственного gateway — [~]
- [x] Проверка требует реального model completion и health-check; изменение параметров сбрасывает connected state. _(source line 101)_
- [x] Автопроверка ограничена debounce/single-flight и не должна принимать HTTP 200 с proxy text за успех.- [~] В PR #121 убрана постоянная ручная кнопка проверки; поля/лампа должны отражать валидированное соединение. _(source line 102)_

### docs/V1_UI_FINALIZATION_RU.md — 9. Окна и закреплённые действия — [~]
- [x] Основные settings/project/research/function окна имеют отдельные закрытия. _(source line 108)_
- [x] Дублирующий data-action="close-settings" в header удалён; exact-head Chromium/Quality PR #121 passed. _(source line 109)_
- [x] Settings header с Save/X и нижние actions закреплены через sticky positioning; exact-head Chromium/Quality PR #121 passed. Короткий viewport, открытая iPhone keyboard и safe-area остаются ручной проверкой. _(source line 110)_

### docs/V1_UI_FINALIZATION_RU.md — 10. Скроллинг и длинные чаты — [~]
- [x] Есть jump-to-latest, full message viewer и popover scrim/outside-tap behavior (PR #115 + предшествующие UI slices). _(source line 115)_

### docs/V1_UI_FINALIZATION_RU.md — 11. Дополнительные настройки — [x]
- [x] Редкие параметры свёрнуты в «Дополнительные настройки». _(source line 122)_
- [x] Язык, motion, composer position и провайдеры сгруппированы отдельно от основной server card. _(source line 123)_
- [x] Отдельные настройки функций и проекта открываются контекстными модалками. _(source line 124)_

### docs/V1_UI_FINALIZATION_RU.md — 12. Тема, язык, анимации — [~]
- [x] Базовые theme/language state синхронизируются между header/sidebar/settings (PR #120/#121). _(source line 130)_
- [x] Есть reduced-motion стили для существующих анимаций. _(source line 131)_
- [x] Landing roadmap ticker запускается только в раскрытом пункте и поддерживает явную паузу/возобновление; [x] prefers-reduced-motion оставляет читаемый статичный текст. App ticker и пользовательский motion=off/reduced требуют exact-head проверки. _(source line 132)_

### docs/V1_UI_FINALIZATION_RU.md — 13. Каталог моделей и provider state — [~]
- [x] Каталоги могут обновляться и фильтровать text model choices; credentials разнесены по provider. _(source line 138)_

### docs/V1_UI_FINALIZATION_RU.md — 14. Project settings — [~]
- [x] Создание/редактирование проекта вынесено в отдельное окно; настройки memory scope сохраняются. _(source line 145)_
- [x] Проект, чаты и проектная память имеют разграниченные browser-local scopes. _(source line 146)_

### docs/V1_UI_FINALIZATION_RU.md — 18. Финальный release gate — [~]
- [x] Основной код имеет Quality sentinels, Jekyll, Chromium E2E, published-site smoke и отдельные gateway/provenance workflows. _(source line 168)_
- [x] PR #173 merge SHA `bf039f887e29137b627b06fc2bb107c2793d6b69`, Pages #42410162803 и публичные root + /landing/ exact-SHA Chromium checks подтверждены. [ ] Исправить stale release-contract sentinel в PR #174 и повторно проверить после merge. _(source line 170)_

### docs/V1_UI_FINALIZATION_RU.md — 2. Лендинг — обязательная структура V1
- [x] Отдельный permalink /landing/; корневой URL приложения не заменяется. _(source line 178)_
- [x] Hero с CTA на рабочую среду и runbook. _(source line 179)_
- [x] Карточки возможностей и отдельная схема browser → tunnel → gateway → Ollama. _(source line 180)_
- [x] Статусы voice/docs/self-hosted и multi-user boundaries не выдаются за готовые. _(source line 181)_

### docs/V1_UI_FINALIZATION_RU.md — 8.8 Иконки действий сообщений
- [x] Реализован icon-first вариант для copy/open/speak с aria-label/title и 44×44 CSS px touch targets; в полном просмотре добавлены copy/speak actions, а для пользовательского сообщения озвучивание скрывается. Exact-head Quality #42349078380 passed (Chromium + Jekyll + sentinels) on code/test SHA 350c01513ec6dc147cd5b26e7b8e3bfa17a26d0e; this SHA is the pre-status-update implementation checkpoint. _(source line 372)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Публичная точка входа и root app
- [x] Контракт маршрутизации обновлён: единственная публичная продуктовая поверхность — root app; `/landing/` и `/assets/css/landing.css` возвращают 404. Не восстанавливать отдельный статический лендинг без нового решения владельца. _(source line 12)_
- [x] Pages build + deploy завершились успешно на main SHA `0f1b3cfdef9a25198c6435a64f886db4f6fbd510` (run `44016571123`); live metadata with cache bypass reports the same `alandi-build-revision`, and `/landing/` returns HTTP 404. _(source line 13)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Корневое приложение — визуальная иерархия
- [x] PR #117/#120: header hierarchy, project label, clock polish, sidebar grouping, memory/project statuses, synchronized theme/language. _(source line 20)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Popovers, menus, dialogs
- [x] PR #117: chat-row menu placement viewport-safe; PR #115: scrim и inert first outside tap. _(source line 28)_
- [x] Settings Save/Close остаются sticky; добавлены начальный focus на Close, Tab/Shift+Tab trap, Escape close и возврат фокуса к открывшему control (runtime E2E добавлен, запуск ещё pending). _(source line 31)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Sidebar, проекты, чаты
- [x] PR #120: порядок памяти → проекты → чаты и компактные статусы. _(source line 36)_
- [x] PR #118/#119: chat import/export и project-first actions. _(source line 37)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Research / functions / agents
- [x] Owner override 2026-11-08 (D-022): Research Studio remains retired; PR #169 removed the modal, wiring and entrypoints. Post-merge public root/landing Chromium verified the absence on exact main SHA. _(source line 42)_
- [x] Functions menu: D-022 owner override supersedes the original three-entry subset. Four entries are present (Agents, Deep Research, Skills, Connectors); the Connectors panel truthfully reports that no registry is configured and does not claim to query live status, scopes or actions. A real registry/permission contract remains a separate implementation gate. _(source line 43)_
- [x] Connectors empty state now explicitly says that no registry is configured and no connection status, permissions or actions are queried; removed decorative ticker that could imply integration progress. RU/EN regression added; execution pending. _(source line 47)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — 3. Исторический первый polish patch
- [x] Добавлен checkbox Pause control на каждый из трёх landing roadmap ticker. _(source line 67)_
- [x] Pause toggles animation state using CSS only; no new JavaScript or runtime dependency. _(source line 68)_
- [x] Added Playwright test for pause/resume and retained reduced-motion test. _(source line 69)_
- [x] Exact-head Chromium/Quality passed on PR #121, including landing pause/resume and reduced-motion regression coverage. _(source line 70)_

### docs/LANDING_UX_POLISH_BACKLOG_RU.md — Fast regression path (2026-11-17)
- [x] Quality workflow is manual-only; expensive static analysis, full Chromium and live Pages release verification are opt-in. The GitHub Pages publishing mechanism is unchanged. _(source line 82)_
- [x] Added a dependency-free local gate: `bash scripts/fast-check.sh` (integrity, security, context, immutable-action parser, state-freshness unit tests, source accessibility check, syntax and diff checks). _(source line 83)_

### docs/DEEP_RESEARCH_2_RESEARCH_PLAN_RU.md — 9. Task ledger
- [x] DR2-002 — инвентаризировать repository research, memory, local-source and multimodal docs. _(source line 152)_

### docs/VOICE_2_RESEARCH_RU.md — 6. Work plan / task ledger
- [x] VOICE-TRACK-001 — создать изолированную research-ветку от main. _(source line 109)_
- [x] VOICE-TRACK-002 — перечитать существующие voice plans, research synthesis, language matrix, latency contract and implementation checklist. _(source line 110)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — P0 — post-merge verification through PR #29; live gateway remains a separate manual gate
- [x] Confirmed merged PR #21 contains UI, project, quality-sentinel and E2E test updates. _(source line 141)_
- [x] All Independent Quality Sentinels passed on PR head `acce1d7ce5ac6eb37251fe5d899a392150b82e9e`. _(source line 142)_
- [x] Chromium E2E passed, including cloud-primary route, keyless web search, project scope/export/deletion and mobile voice swipe. _(source line 143)_
- [x] Reviewed the changed-file diff and added regression coverage for auth, route, scope and recovery paths. _(source line 144)_
- [x] PR #21 description records Kilo as an explicit alternate and project support as browser-local. _(source line 145)_
- [x] Merged only after PR-head quality, Chromium E2E, Lite Gateway and provenance gates passed. _(source line 146)_
- [x] PR #28 merged; gateway contract/security tests, provenance, quality and Pages checks passed on post-merge main `e424d353418cad62981eb269b4082d2925592708`. _(source line 147)_
- [x] PR #29 merged at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; PR-head and post-merge Quality/Chromium, provenance and Pages browser smoke passed; Pages deployment succeeded. _(source line 148)_
- [x] Memory bridge merge state and all available workflow results reconciled. No live gateway/VPS, real provider smoke or target-hardware result is claimed. _(source line 149)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — legacy mobile and interface request, 2026-10-29
- [x] PR #71: stable bottom composer for empty/populated chats and visualViewport-aware textarea; native iPhone Safari remains a separate manual gate. _(source line 194)_
- [x] PR #114: optional global user system prompt empty by default; obsolete Gemini reset removed; legacy default migrates to empty; context history budget reserves serialization/provider overhead. _(source line 195)_
- [x] PR #115: dim/blur scrim for attachment/context/voice popovers; modal backdrop blur respects reduced-transparency; first outside tap closes composer popover or toolbar/language/chat-row menu without activating underlying controls. Exact-head Chromium and published-site smoke passed. _(source line 196)_
- [x] PR #120 merged at `2bda22229cba3576628f92c821bb6e1562d8abc5`: dedicated memory section, ordered project/chat navigation, live status lines, Research Studio placement and synchronized sidebar theme/language preferences. _(source line 197)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — consolidated interface closure, 2026-10-30
- [x] PR #118 merged: chat-scoped import/export, merge-with-existing-history behavior, ID collision handling, validation and size/count bounds; exact-head quality and browser gates passed. _(source line 203)_
- [x] PR #119 merged: UX-21–UX-25 delivered, including persisted composer position, clear provider route grouping, request-context boundaries, truthful staged-workflow wording, project-first actions and persisted project memory scope. _(source line 204)_
- [x] PR #120 merged: sidebar hierarchy, memory status, Research Studio placement and synchronized theme/language controls delivered. _(source line 205)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — sidebar hierarchy and preference synchronization, 2026-10-30
- [x] PR #120 merged: UX-26 and UX-27 delivered with dedicated memory controls, live status lines, Research Studio placement and synchronized theme/language preferences. _(source line 212)_

### docs/V016_IMPLEMENTATION_CHECKLIST.md — Supplement — orthogonal chat settings, 2026-10-30
- [x] PR #121 merged at `f4d880f`: effort controls only execution budget; web-search scope controls only availability/result breadth; structured workflow and task profile are separate; Research Studio uses current chat settings without mutation; exact-head Chromium/Quality passed. Native iPhone/VoiceOver remains manual. _(source line 217)_

## 6. Архив реализованных пакетов — 2026-11-18 (append-only)

Этот раздел — хвостовой журнал уже попавших в `main` изменений. Не читать его при обычном ориентировании; новые завершённые пакеты добавлять только сюда. Наличие записи IMPLEMENTED не означает прохождение неисполненного E2E или проверку live runtime.

### P0 UI — sidebar, Research, Agents and operational timeline

- **IMPLEMENTED — Sidebar structure (commit `3f20322f0fd1be539644fd84d798cfbaff3f133e`).** Create Project/Chat actions moved into their own section headings; collapsed Projects returns available space to Chats; desktop row density and mobile 44px touch targets adjusted. Residual density and state-persistence acceptance remains active at P0.1/P0.3.
- **IMPLEMENTED — Deep Research panel (commit `8d88296ffc1ef86a7df0ed9368e897bc40e9d425`).** Duplicate Quick/Thorough and web-breadth controls removed; one real sequential evidence-report workflow selectable per chat; future research methods are listed without fake launch controls.
- **IMPLEMENTED — Agents panel IA (commit `4bd7df011b2c21dc64d3d233caba89848fce6a03`).** Honest saved-role blueprint labels and a planned-only topology catalogue. Independent agents/subagents/swarm are not yet implemented.
- **IMPLEMENTED — AgentRun timeline timestamps (commit `6f6914f2dd3fd506df10d8ba08a55a04dc893a35`).** Chat and Functions timelines use allowlisted Gateway event types and actual `occurred_at` timestamps; no model chain-of-thought or raw event payload is exposed.
- **VERIFIED — exact-HEAD Pages and Graphify only:** commit `3f20322f`: Pages #643 SUCCESS / Graphify #1414 SUCCESS; `8d88296f`: #644 / #1415 SUCCESS; `4bd7df01`: #645 / #1416 SUCCESS; `6f6914f2`: #646 / #1417 SUCCESS.
- **NOT RUN:** the updated Chromium E2E and quality-sentinel suites were committed but not executed during this work session. No Gateway live runtime, private VPS/Tunnel/Ollama, iPhone Safari/VoiceOver, audio hardware or model-weight installation was checked.
- **IMPLEMENTED — Chat row action cleanup and coverage (this commit).** Removed an unreachable project-source sync call after `return` in `createChatRow`; added a Playwright regression covering rename persistence, active-chat preservation and single-chat export payload. Existing tests cover move/clear/clone/delete-cancel and keyboard traversal. The new browser test is committed but not yet run.
- **IMPLEMENTED — narrow mobile composer (commit `39730108fee5f99f7cca012381ba2baee206687b`).** At viewport widths <=380px, composer utility controls occupy a compact first row and the draft input shares a second row with send/stop; 44px touch targets remain. Added Playwright geometry regression for 320/360px; test execution remains pending.
- **VERIFIED — exact-HEAD Pages + Graphify:** both succeeded on `39730108fee5f99f7cca012381ba2baee206687b` (Pages run #44444338963; Graphify run #44444339995). This does not verify Chromium E2E or native iPhone behavior.
- **Next:** continue P0 composer edge cases, forms and validation; then complete menu/dialog, responsive, density, RU/EN, theme/motion, accessibility and dead-control acceptance. Keep P1 studio shells and P7 provider decisions behind the landing gate.
- **IMPLEMENTED — mobile navigation touch targets (this commit).** Project/chat selection and row-action controls are now 44×44px at <=640px; a Playwright regression creates a project and measures project/chat selection + action targets at 390px, including sidebar horizontal-overflow guard. Browser execution is pending.
- **NOT RUN — browser acceptance:** the new mobile navigation regression and existing composer 320/360px geometry regression have not yet run in Chromium; no native iPhone Safari/VoiceOver check was performed.
- **IMPLEMENTED — shared keyboard focus ring (this commit).** Native disclosure summaries, links and role=button controls now use the same 2px Tiffany focus indicator as buttons/inputs/selects; added a keyboard-modality regression for the Functions menu summary.
- **EXPANDED — mobile navigation regression.** The 44×44px checks now cover 320, 360 and 390 CSS px instead of one viewport; project/chat selection and action controls plus sidebar horizontal overflow are measured at every width. Browser execution remains pending.
- **IMPLEMENTED — complete primary sidebar touch target pass (this commit).** At <=640px, Projects/Chats toggles, Create actions, unassigned-chat filter, Memory disclosure, project/chat selection and row-action controls use at least 44px height/width as applicable. Expanded the 320/360/390px regression to measure the full primary navigation set. Browser execution remains pending.
- **VERIFIED — exact-HEAD Pages + Graphify:** commit `cc1e9c376955ced48c9c4b7891c4fa3d880a64ab`; Pages build/deploy #44446119751 SUCCESS; Graphify #44446120302 SUCCESS. Cache-busted public Pages metadata reports the same build revision.
- **NOT RUN — browser/device acceptance:** Chromium E2E (including the new 320/360/390px sidebar, narrow composer and keyboard focus tests) was not executed; native iPhone Safari/VoiceOver was not checked. Pages + Graphify do not substitute for those gates.
- **IMPLEMENTED — nested mobile action targets (this commit).** At <=640px chat-row menu entries, toolbar choices, attachment/context/voice choices and attachment removal use 44px minimum touch targets. Added a Playwright regression that opens these menus, measures every visible action and checks attachment removal.
- **IMPLEMENTED — responsive root viewport sweep (this commit).** Added a document/body/header/composer horizontal-overflow regression for 320, 360, 390, 640, 768, 1024, 1280 and 1440 CSS px. It is a browser test, not a native device test.
- **SPECIFIED — 30-point landing acceptance matrix.** Thirty explicit responsive, composer, navigation, dialog, form, localization and accessibility gates now live under P0.21. None is considered VERIFIED until executed with recorded environment and exact SHA.
- **NOT RUN — browser/device acceptance:** the new nested-menu and viewport sweep tests, along with earlier 320/360/390px regressions, have not yet run in Chromium; no native iPhone Safari/VoiceOver check was performed.

- **IMPLEMENTED — toolbar disclosure Escape behavior (this commit).** Search, Functions and Language toolbar disclosures now share one Escape close path and restore focus to their own summary. Added Playwright coverage for Search/Functions Escape and first outside click not activating the underlying processing-mode control. Browser execution pending.

- **IMPLEMENTED — landscape mobile acceptance (this commit).** Added an 844×390 Playwright regression for document/body overflow, composer viewport bounds, textarea minimum height and Send reachability. Browser execution remains pending.

- **IMPLEMENTED — form error association assertions (this commit).** Project create/edit and aServi URL/model/key Playwright tests now verify aria-describedby points to the inline error and the error is announced with role=alert, in addition to aria-invalid, text and focus. Browser execution pending.

- **VERIFIED — exact-HEAD Pages + Graphify:** `82fb7608c5dc9bc8bb048280b0952769d26595a1`; Pages build/deploy #44448092746 SUCCESS; Graphify #44448093330 SUCCESS. Chromium E2E was not part of these runs.
- **IMPLEMENTED — toolbar Escape behavior:** Search/Functions disclosures close on Escape and restore focus to their own summary; outside click closes without activating the underlying processing-mode control. Playwright regression added; execution pending.
- **IMPLEMENTED — accessible form error associations:** project create/edit and aServi URL/model/key regressions assert `aria-describedby` points to the inline `role=alert` error, plus `aria-invalid` and first-invalid focus. Execution pending.
- **IMPLEMENTED — landscape mobile regression:** 844×390 test measures document/body overflow, composer bounds, textarea height and Send reachability. Execution pending.
- **BROWSER TOOL LIMITATION:** TinyFish run `9b55917e-a96d-4849-be99-c213a82a95c4` explicitly reported static DOM only and could not set viewport, execute JavaScript or call `getBoundingClientRect`. Its `alandi-build-revision NOT_FOUND` claim is not treated as a site defect: the source has the revision marker and the Jekyll quality sentinel checks the generated artifact. Use Playwright for actual geometry.
- **PARTIAL KEYBOARD OBSERVATION:** TinyFish run `60646830-6785-4667-a831-37b1ac003db2` observed sidebar and Settings Escape closure/focus return; project actions, Functions outside click, Voice menu and Create Project validation were not reached. Existing Playwright tests cover several of those paths; no browser pass is claimed.

- **IMPLEMENTED — stronger geometry assertions (this commit).** Nested menu/action acceptance measures both width and height; the eight-width responsive sweep checks left/right bounds for header and composer, and the 844×390 landscape test checks header/toolbar/composer edges rather than width alone. Browser execution pending.

- **IMPLEMENTED — toolbar outside-click focus return (this commit).** Focus target is selected from the active toolbar disclosure; requestAnimationFrame restores focus only while the trigger remains connected and outside inert content. Removed stale Language disclosure selector because the current UI uses a language select.

- **VERIFIED — exact-HEAD Pages + Graphify:** `fef43b55237c1106c02880914bc6a81681cfe0f4`; Pages build/deploy #44448700108 SUCCESS; Graphify #44448701548 SUCCESS. Chromium E2E not run.

- **IMPLEMENTED — Project Settings mobile sheet acceptance (this commit).** Added 320/390px Playwright checks for full-height bounds, zero radius, sticky header, internal scrolling, 16px/44px fields, 44px disclosures and no horizontal overflow. CSS implementation landed in `e3c7a850`; browser execution pending.
- **IMPLEMENTED — attachment popover dismissal acceptance (this commit).** Added Escape and outside-click checks for scrim/aria-expanded/focus return while preserving the unsent draft. Browser execution pending.

- **IMPLEMENTED — mobile modal safe-area sizing (this commit).** Project Create, Settings, Message Viewer, Chat Action, Functions and Trace surfaces now share safe-area-aware viewport padding and max-height; Chat Action has bounded internal scrolling. Added 320×568 geometry/scroll regression for Settings, Functions and Chat Action. Browser execution pending.

- **IMPLEMENTED — sticky mobile panel headers (this commit).** Functions and Trace panel headers remain visible while their long content scrolls; the short-viewport dialog regression asserts the Functions header is sticky. Browser execution pending.

- **IMPLEMENTED — Functions/Chat Action modal focus regression (this commit).** Playwright now exercises Tab/Shift+Tab wrapping, Escape closure and return focus to each invoking control for both dialogs. Browser execution pending.

- **IMPLEMENTED — 30-point acceptance status reconciliation (this commit).** Items with code/test coverage are marked PARTIAL `[~]`; all 30 remain open until Chromium/native-device evidence. The matrix explicitly distinguishes Playwright emulation from real mobile OSK/VoiceOver.

- **IMPLEMENTED — remaining 42px touch-target exceptions (this commit).** Jump-to-latest and Project Settings inputs/selects now meet the 44px internal baseline; their E2E geometry assertions enforce the target. Browser execution pending.

- **IMPLEMENTED — visible Stop target regression (this commit).** The root control test now temporarily exposes the Stop control and asserts its 44×44 mobile target; this verifies styling/geometry, not the live streaming/abort transition.

- **IMPLEMENTED — iOS-safe Project Settings typography (this commit).** Removed a misleading 14px declaration; the shared <=640px `!important` form rule keeps editable controls at 16px. Playwright asserts computed 16px and 44px minimum height at 320/390px.

- **IMPLEMENTED — root keyboard and toolbar bounds regression (this commit).** Responsive sweep measures toolbar edges at all eight widths; root focus/44px coverage includes modeDeep, Functions and execution-mode toggle; added a real Tab-order walk across toolbar → composer → sidebar. Browser execution pending.

- **VERIFIED — exact-HEAD Pages + Graphify:** `b72d134fcc4b5de2dc123ac919cea3d51a9ea72d`; Pages build/deploy #44450998348 SUCCESS; Graphify #44450998692 SUCCESS. Playwright E2E was not run; Quality Sentinels requires manual workflow_dispatch, which is not exposed by the current GitHub connector.

- **IMPLEMENTED — RU/EN dictionary integrity (this commit).** Removed duplicate `languageLabel`, `helperMemoryNoProject` and `helperMemoryNoConfig` keys; later explicit copy remains authoritative. Added a static test for duplicate keys and missing markup translations. Browser execution pending.


## 7. Дополнительный инженерный аудит — 2026-11-19 (append-only; не меняет P0 priority)

Этот аудит уточняет три разных класса долга. Это не разрешение на немедленную чистку и не причина останавливать root UI. Source baseline: main `484c3b9b4570e110f8bc4584bab322c80c37803c`; PR #187 остаётся отдельной незамерженной веткой.

### 7.1 Compatibility debt — staged retirement `multiAgentEnabled` (P2.2; после landing)

**FACT · main source inspection:** `createChat()` создаёт одновременно `deepResearchMethod: 'none'` и `multiAgentEnabled: false`; `loadChats()` умеет преобразовать legacy boolean; `ensureChatFunctionSettings()` дополняет отсутствующие значения; `setDeepResearchMethod()` dual-writes chat fields и `STORAGE.multiAgent`; текущая синхронизация активного чата продолжает писать legacy storage key; settings profile v1 импортирует/экспортирует `multiAgent`; скрытый `toggleMultiAgent` остаётся DOM adapter. ResearchTrace сохраняет `multiAgentEnabled` в исторической телеметрии.

**Проблема:** при валидном `deepResearchMethod` и конфликтующем boolean текущая нормализация не всегда приводит legacy boolean к каноническому значению; часть путей продолжает dual-write. Нельзя называть boolean полностью мёртвым, пока его читают migration/profile/history paths.

**Предлагаемые стадии:**
1. Закрепить enum `deepResearchMethod: 'none' | 'multi_step_evidence_report'` как единственный runtime authority. Валидный enum всегда побеждает legacy boolean.
2. Сделать миграцию идемпотентной: при отсутствующем/невалидном enum преобразовать boolean; затем нормализовать legacy boolean как derived compatibility value без изменения выбранного enum.
3. Сохранить dual-write на явно ограниченный rollback window; срок/закрытие окна — решение владельца, не вывод исполнителя.
4. Ввести settings profile v2: v1 import преобразует `multiAgent`; v2 import/export использует `deepResearchMethod`; экспорт v2 не пишет legacy поле.
5. После rollback gate отдельным изменением прекратить legacy writes, удалить `STORAGE.multiAgent` и hidden DOM adapter; legacy read оставить на срок поддержки старых данных.
6. Не переписывать и не удалять старые ResearchTrace: это исторические записи.

**Acceptance:** старые записи true/false/missing/invalid; конфликтующие поля; идемпотентная повторная миграция; profile v1/v2 import/export; quota/partial-write rollback; no loss of user choice; routing uses enum only; ResearchTrace immutable; tested rollback restores dual-write. **Status: SPECIFIED; no cleanup authorized yet.**

### 7.2 Documentation drift — AgentRun main-chat integration (P3.4/P3.6; после landing, в AgentRun docs package)

**FACT · main source inspection:** `buildAgentRunContextPacket()` constructs bounded project/chat context; `sendAgentRunChatMessage()` routes a chat request into AgentRun and stores `activeAgentRunId`; observed output returns to the same chat; `resumeAgentRunForChat()` restores observation; `renderAgentRunChatStatus()` renders a chat-anchored status surface. Gateway config explicitly defaults `ALANDI_AGENT_RUNS_ENABLED=false`; current worker concurrency is one. The code therefore proves client integration paths, not host feature availability or production readiness.

**Documents requiring source-backed reconciliation:**
- `docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md`: replace legacy-only orchestration description with current `executionMode`, `deepResearchMethod`, AgentRun routing and orthogonal settings; retain historical context.
- `docs/AGENT_FUNCTIONS_MENU_INFORMATION_ARCHITECTURE_RU.md`: its 2026-11-16 audit says context packet/result/chat status are absent or modal-only; update these specific claims against main, preserving the one-worker/feature-off limits.
- `docs/ALANDI_SYSTEMS_MAP_RU.md`: split browser context/routing/status, Gateway API, worker and state store; correct stale snapshot metadata and maturity.
- Plan 1 / AgentRun integration task record: update Tasks 2–4 only where current source satisfies their acceptance; preserve the original plan and unresolved host/eval gates.
- `docs/AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md`: retain its useful safety/maturity contract; make only targeted factual updates if current main contradicts it.

**Unified maturity vocabulary:** Browser context builder — IMPLEMENTED; chat routing/result return/chat-anchored status — IMPLEMENTED in client source; Gateway worker/runtime — PROTOTYPE / one worker; host feature availability — NOT VERIFIED (code default false); production readiness — NOT VERIFIED. IMPLEMENTED is not VERIFIED; PROTOTYPE is not production capability; feature flag false is not dead code. **Status: SPECIFIED; docs not yet changed.**

### 7.3 Coverage gap — inline JavaScript dead-code audit (P0.18/P0.19 quality-tooling extension; after immediate root UI packages)

**FACT · workflow inspection:** `.github/workflows/dead-code-check.yml` triggers on `gateway/**`, `observability/**`, `scripts/**` and itself; it runs `vulture gateway observability --min-confidence 90`. Thus the path filter includes `scripts/**` while the Vulture command does not inspect scripts, and the workflow does not trigger for `index.md`. The current report cannot establish which inline browser functions in the generated root app are unused.

**PROPOSAL · report-only pipeline:**
1. Build Jekyll output and extract inline script blocks from generated `_site/index.html` into a temporary, deterministic directory with source line mapping.
2. Parse JavaScript into AST and inventory declarations/references, DOM IDs, `data-action`, delegated/dynamic `addEventListener`, inline/global handlers, string-name dispatch, generated elements and public callbacks.
3. Distinguish unresolved dynamic consumers from unused candidates; emit confidence, source location, consumer trace and rationale.
4. Keep Python Vulture and JavaScript report as separate artifacts. Add fixtures for `$('id')`, `addEventListener`, inline handlers, global functions, string dispatch and dynamically created elements.
5. Maintain a candidate registry (symbol/path, callers, dynamic consumers, compatibility state, tests, decision keep/migrate/remove/investigate, revisit condition).
6. Never auto-delete or make advisory findings release-blocking until precision/false-positive rates are measured against manually classified fixtures.

**Acceptance:** workflow runs on `index.md`; built HTML is the JS input; Python/JS reports are distinct; dynamic-consumer fixtures pass; each exception has a reason; report-only behavior is enforced. **Status: SPECIFIED; no analyzer/dependency added.**

### 7.4 Cross-cutting engineering safeguards (attach to matching packages)

- **Migration acceptance matrix (P2.2):** old/new chat values, legacy/profile v1 and v2, conflicting fields, corrupt records, quota/partial-write failure, export/import and rollback.
- **Architecture drift assertions (P0.12/P2/P3 docs packages):** source-backed checks for default `executionMode`, default `deepResearchMethod`, allowed AgentRun strategies, default host flag, runtime route names, context builder and result-return path. Assertions must fail only on explicit contract drift, not wording changes in long prose.
- **Routing invariant (P2/P3):** Direct, Deep Research and AgentRun are distinct execution paths; one request must not trigger two engines. Preserve current AgentRun-vs-Deep-Research exclusion and test it.
- **Preservation rule:** do not delete `runMultiAgentResearch`, ToolDAG, `validator.py`, approval gates, AgentRun state/task journal, Team Blueprint or helper route merely because they share orchestration vocabulary. Require consumer graph, migration and regression evidence first.

### 7.5 Execution order and gates

1. Finish root UI P0, starting with P0.5 shared visual-system foundations and remaining high-frequency control/form/accessibility acceptance. Do not start studio routes.
2. Then reconcile the three AgentRun architecture documents and Plan 1 from exact main source.
3. Then implement the staged settings/profile migration; ask the owner to confirm the rollback-window end before removing any legacy write path.
4. Add the report-only inline JavaScript audit as a bounded Quality tooling package; do not make it a blocker or delete code on its findings.
5. Exact-HEAD Quality/Chromium, Pages and native-device evidence remain separate gates; no claim is inherited from a different SHA or PR.

### 7.6 Implementation progress — root visual-system foundation (2026-11-19)

- **IMPLEMENTED:** main commits `ab90ff5`, `7545395` and `091bfd6` add shared typography/line-height/spacing/radius/elevation/focus/touch/motion tokens and apply theme-semantic values to toast, cloud status/card, provider state, focus rings, composer/toolbar popovers and dialogs.
- **IMPLEMENTED:** main commit `67a50f6` adds a Playwright contract test for token presence and dark/light semantic differences.
- **VERIFIED:** Pages build + deploy #44467972603 passed on exact main `2d1286eeab6850380c434d90c5e5b39a12435d2e`; Graphify #44467776502 passed on code SHA `091bfd660406acb1cb553567a46d4c3585a6ab24` (subsequent main commits were documentation-only).
- **NOT VERIFIED:** the new Playwright test has not been executed; visual review on actual browser/device, Quality/Chromium and full P0.5 coverage remain open. This is a foundation slice, not completion of the unified visual system.

### 7.7 Implementation progress — keyboard/accessibility package (2026-11-19)

- **IMPLEMENTED:** root keyboard skip link is the first tab stop and targets the chat main region; its label follows RU/EN.
- **IMPLEMENTED:** theme toggle exposes its next action in the accessible name and current light/dark state via `aria-pressed`; localization refresh keeps the state/name synchronized.
- **IMPLEMENTED:** high-contrast mode strengthens keyboard focus geometry, control borders and link underline visibility without changing stored user preferences.
- **TEST ADDED / NOT RUN:** Playwright covers first-tab skip navigation, Enter focus transfer, theme state/name transitions in RU/EN, system `prefers-reduced-motion` in auto mode and high-contrast focus geometry.
- **SOURCE REVIEW:** W3C WCAG 2.2 SC 1.4.3 keeps the 4.5:1 normal-text / 3:1 large-text thresholds; WAI-ARIA APG button pattern and MDN `prefers-reduced-motion` inform semantic state and OS preference behavior. These checks are not a complete WCAG conformance claim.
- **BROWSER FINDINGS:** TinyFish confirmed the skip-link flow and RU/EN labels. It reported a missing build-revision meta and missing `aria-pressed`; direct cache-busted Context.dev HTML confirmed the exact meta revision `fa51a2431f83f10477525026a8773f67d3ad6f01`, so that report was a false negative. It also measured a 2px focus outline in high contrast: the earlier generic `!important` focus rule overrode the width-only high-contrast declaration. The CSS has now been corrected to set the complete 3px outline with `!important`. Follow-up live browser confirmed revision, skip navigation and theme state/name in RU/EN, but the focused-control diagnostic did not reach the target (activeElement remained body, `:focus-visible` false); reported 1px/0px outlines are inconclusive. Keep 3px high-contrast focus acceptance OPEN. `prefers-reduced-motion` media emulation is unavailable in this browser environment.
- **FOLLOW-UP LIVE CHECK:** Pages #44470332033 and Graphify #44470331614 both SUCCESS on exact SHA `4b403ff8d0348a2fec7edb34a27349db561ea02d`. Cache-busted Context.dev HTML independently confirms `meta[name=alandi-build-revision]` equals that SHA; TinyFish's report of a missing meta tag conflicts with this raw HTML evidence and is treated as an automation observation error. TinyFish confirms theme-toggle labels and `aria-pressed` after toggling, and first-tab skip-link targeting. Its computed outline observation was `none` after programmatic focus; the Playwright test now explicitly establishes keyboard `:focus-visible` modality before measuring the high-contrast ring. This follow-up test is authored, NOT RUN.
- **OPEN:** full landmark/live-region audit, actual computed contrast for all component states, forced-colors and screen-reader/browser/device acceptance. P0.17 remains PARTIAL.



### 7.10 Implementation progress — browser connectivity hints (2026-11-20)

- **IMPLEMENTED:** the root app listens to browser offline/online events and shows RU/EN status feedback. Offline warns that local chats remain available while cloud/Gateway calls may fail; online explicitly does not claim that any server/provider is reachable.
- **IMPLEMENTED:** the browser connectivity hint does not toggle the independent web-search preference or execution mode.
- **TEST ADDED / NOT RUN:** Playwright dispatches offline/online events, checks RU/EN copy and announcement priority, and asserts web-search preference is unchanged.
- **SOURCE BASIS:** MDN Navigator.onLine and Window online/offline event documentation warns that browser network state is heuristic and must not be used to infer availability of a specific website. Source URL is recorded in INTEL.md.
- **OPEN:** actual provider/Gateway reachability, request retry/cancel recovery, native iOS offline behavior and Chromium execution remain pending.

## Owner runbook — действия после Landing 2.0 (ручные; сервер не менялся)

**Разделение:** GitHub Pages — статический клиент; FastAPI/aServi и Ollama — отдельный приватный контур. Live VPS/Tunnel/Ollama не подтверждены. Никогда не передавай пароль, API key, Tunnel token, OAuth secret или полный env-файл в чат/issues/CI.

**Read-only inventory, 2026-11-20:** the connected Cloudflare account returned 0 DNS zones and 0 named Tunnels; the connected Hostinger account returned no VPS instances. This does not rule out a Vultr/other-provider server or a separately managed Cloudflare account. Confirm the actual provider, domain, VPS and SSH owner access before installation; do not purchase or create resources based on this inventory alone.

### 1. До сервера
1. Обнови чистый checkout до выбранного commit main и запиши SHA. Не деплой PR preview.
2. Из корня репозитория запусти:
   ```bash
   python scripts/check_deploy_preflight.py
   python -m pytest -q gateway/tests/test_deploy_preflight.py
   ```
   Это проверяет шаблон/unit в Git, не живой VPS.
3. Создай и проверь защищённые резервные копии /etc/alandi-gateway.env и SQLite из /var/lib/alandi-gateway. Храни вне Git и публичных артефактов.
4. Зафиксируй ОС/архитектуру, CPU/RAM/disk и бюджет. Не создавай платную VM и не скачивай модели без отдельного решения.

### 2. VPS и Gateway
1. Сверь фактический unit: sudo systemctl cat alandi-gateway. Канонический файл — gateway/alandi-gateway.service: пользователь alandi, один Uvicorn worker, bind 127.0.0.1:8000, EnvironmentFile /etc/alandi-gateway.env, systemd hardening.
2. Проверь слушающие порты: sudo ss -ltnp. Gateway — только 127.0.0.1:8000; Ollama — только 127.0.0.1:11434. Не открывай их публично.
3. Создай /etc/alandi-gateway.env вручную из gateway/.env.example. Замени placeholder на новый ALANDI_API_KEY, созданный openssl rand -hex 32. Целевой режим файла 0600, владелец root; production env никогда не копировать обратно в Git.
4. Сохрани ALANDI_MAX_INFLIGHT_REQUESTS=1, один реально установленный и разрешённый model tag, OLLAMA_BASE_URL=http://127.0.0.1:11434. Все experimental flags false, helper model пустой. Не включай AgentRun, RAG, extraction, ASR/TTS, OAuth или GitHub App без отдельных eval/license/security gates.
5. Локально проверь ollama --version, ollama list, ollama ps; зафиксируй точный tag/digest/license. Не выполняй ollama pull без явного решения о модели и размере.
6. После backup и preflight: sudo systemctl daemon-reload; sudo systemctl restart alandi-gateway; sudo systemctl status alandi-gateway --no-pager. При сбое — sudo journalctl -u alandi-gateway -n 100 --no-pager; не публикуй секреты/prompts.
7. На VPS проверь /livez, /readyz, /healthz через loopback. Отдельно проверь отказ без авторизации и один реальный completion с Bearer key из защищённого локального shell/password manager; не помещай ключ в чат, командную историю или screenshot.

### 3. HTTPS Tunnel, Access и CORS
1. Оставь public frontend на https://dorpnay.github.io/skills-github-pages/; private Gateway API размести на отдельном HTTPS hostname.
2. Cloudflare Tunnel (или ранее утверждённый эквивалент) направляй только на http://127.0.0.1:8000. Не публикуй порт 8000 и никогда не проксируй Ollama 11434.
3. Включи Cloudflare Access или эквивалентную identity policy. CORS не является аутентификацией.
4. В ALANDI_CORS_ORIGINS оставь точный origin https://dorpnay.github.io; дополнительные origins добавляй только после явной настройки домена. Не используй wildcard.
5. С публичного сайта проверь TLS, Access, CORS preflight, отказ без Bearer key, health/readiness и authenticated completion. Убедись, что прямой origin IP и порты 8000/11434 недоступны извне.

### 4. Evidence, rollback и ручная приёмка
1. Запиши приватно app SHA, OS/архитектуру, unit revision, Python/FastAPI/Uvicorn, Ollama, model tag+digest+license, CORS/Tunnel/Access state, health/auth results, cold/warm latency, RAM/PSS, disk и дату backup. Не записывай ключи, prompts или payloads.
2. Включай только одну experimental capability за раз после eval, hash/license review, negative auth tests и rollback. База — один model/worker/concurrency=1.
3. При сбое верни Tunnel на предыдущий проверенный endpoint, восстанови env/SQLite backup по отдельной процедуре и повтори health/auth smoke. Не удаляй базу/backups и не меняй DNS наугад.
4. Отдельно проверь iPhone Safari/VoiceOver и реальные microphone/voice paths. CI, Pages и TinyFish не заменяют VPS/native-device evidence.

**Owner-only:** домен/DNS, Cloudflare account/Access, SSH/VPS, секреты, платные ресурсы и реальные model downloads выполняет владелец в своих аккаунтах. SSH/VPS доступ в текущем контексте не подтверждён; серверных действий этим срезом не выполнялось.

**Опорные материалы:** docs/DEPLOYMENT_PREFLIGHT_RU.md, docs/DOMAIN_SETUP.md, docs/INFRASTRUCTURE_UPGRADE.md, gateway/alandi-gateway.service, gateway/.env.example и issue #111. Архивный docs/PRE_LAUNCH_STACK_RU.md не использовать как актуальный runbook.

