# aLandi — объединённый backlog первого бесплатного релиза и полного стека

**Срез:** 2026-10-30  
**База main:** `e6404d510229fa64a7bb375995d76dcba55de623`  
**Текущий UI-кандидат:** PR #121, `feat/chat-settings-orthogonal-controls-20261030` (проверять фактический HEAD перед каждым решением).  
**Единый release tracker для инфраструктуры:** [Issue #111](https://github.com/DorpNay/skills-github-pages/issues/111).  
**Детальный UI DoD:** [V1_UI_FINALIZATION_RU.md](V1_UI_FINALIZATION_RU.md).

Этот документ объединяет последние инженерные аудиты P0/P1/P2, Issue #111, основной пользовательский чек-лист, V1 UI finalization, предпусковой runbook и предложенный стек. Это рабочий реестр решений, а не утверждение, что все перечисленные функции уже реализованы или развёрнуты.

## 0. Контракт первого бесплатного релиза

Первый публичный выпуск — бесплатный статический GitHub Pages лендинг и браузерный клиент. Он не предоставляет hosted inference, API-кредиты, VPS, постоянный Tunnel, публичную multi-user авторизацию или платные сервисы. Пользователь может выбрать внешний API на собственных условиях либо самостоятельно настроить личный FastAPI/Ollama gateway.

Базовый self-hosted маршрут:

```text
Браузер / GitHub Pages
        │ HTTPS + Bearer key
        ▼
Cloudflare Tunnel (только публичная точка входа)
        │ private origin
        ▼
FastAPI gateway — 127.0.0.1:8000
        │ localhost
        ▼
Ollama — 127.0.0.1:11434 — одна активная модель
```

Первичная эксплуатационная цель: один владелец, одна активная модель, concurrency=1, bounded request/context, закрытые порты, выключенные экспериментальные функции, измеряемый RAM/latency. Это не публичный SaaS.

**Главный критерий:** не добавлять тяжёлую зависимость, пока существующий лёгкий стек не доказал измеримую недостаточность.

## 1. Объединённый список задач

Статусы:
- **В работе** — код/тесты уже находятся в PR #121 или текущем implementation slice.
- **Есть частично** — механизм уже присутствует, но требует проверки/согласования.
- **Owner gate** — зависит от внешней инфраструктуры, credentials, физического устройства или решения владельца.
- **Отложено** — намеренно не входит в первый бесплатный релиз.

### P0 — выпуск UI, безопасность и доказательство первого рабочего контура

| ID | Задача | Текущая база / решение | Готово, когда |
|---|---|---|---|
| P0-01 | Зафиксировать бесплатную границу продукта | **В работе в PR #121.** Лендинг отдельно от приложения; бесплатен статический UI, не inference. | Текст на лендинге, README и FAQ совпадает; нет обещания бесплатной модели/hosted endpoint. |
| P0-02 | Завершить лендинг `/landing/` | **В работе в PR #121.** Добавлены структура, CTA, стек, readiness, roadmap и disclosures. | Jekyll build, E2E на 320/390/768/1024/1440, no horizontal overflow, canonical/description/links, reduced-motion и published Pages smoke проходят. |
| P0-03 | Завершить основной браузерный клиент V1 | **В работе в PR #121.** Параметры запроса разделяются; Research Studio не меняет режимы; есть проектные и provider UI доработки. | Все 18 доменов V1 checklist закрыты или помечены ручным/owner gate; точный PR HEAD проходит CI. |
| P0-04 | Убрать мелкие UX-регрессии | **В работе в PR #121.** Проверить Settings Close, кнопки Save/Close, provider state, модалки, клавиатуру, focus, scroll, длинные чаты, RU/EN и light/dark. | Нет дублирующих действий/селекторов; ошибки inline; клавиатурная навигация и mobile hit targets проверены. |
| P0-05 | Привести README и точки входа к реальному V1 | **Частично исправлено в PR #121.** Удаляются устаревшие шаги с предзаполненным Gemini URL/model и старой кнопкой restore. | README, START_HERE, landing и UI не дают противоречивых инструкций; есть единый порядок запуска. |
| P0-06 | Доказать FastAPI/Ollama health-контракт | **Есть частично.** Текущий `GET /healthz` уже вызывает Ollama `GET /api/tags` с timeout 2 s; это readiness, не чистая liveness. | Добавлены дешёвый `/livez` без upstream и `/readyz` с read-only check Ollama; старый `/healthz` остаётся совместимым alias readiness. Тесты покрывают 200/503/timeout и отсутствие секретов. |
| P0-07 | Доказать API и сетевые ограничения | **Есть частично.** Bearer auth, CORS allowlist, allowed models, body cap, bounded concurrency, loopback runbook и deployment preflight существуют. | CI проверяет конфигурационный шаблон; локальный VPS acceptance подтверждает 401 без ключа, allowlisted model, completion, cache behavior и loopback listeners. |
| P0-08 | Synthetic end-to-end canary | **Owner gate.** PR CI уже проверяет сборку, Chromium и опубликованный Pages. Живой Tunnel/Ollama отсутствует в доказательствах. | Отдельный opt-in live smoke выполняется только с предоставленными владельцем endpoint/secret и явным согласием; не отправляет приватные prompt и не пишет секреты в артефакты. |
| P0-09 | Синхронизация project-state | **Есть частично.** `check_project_state_freshness.py` и ежедневный/manual workflow сверяют SHA и точную очередь PR/issues. | После merge обновлены snapshot, PROJECT_STATE, ORIENTER, FILE_ORIENTER и VOLLEY_LOG; freshness проходит на актуальном main. |
| P0-10 | Сверка Docs-as-Code с исходниками | **Есть частично.** Freshness guard проверяет snapshot и очередь, но не является полной типизированной проверкой всех файлов/API/dependencies. | Добавлен ограниченный deterministic contract check для критических файлов, gateway route contract и шаблона зависимостей; ложные динамические предположения не попадают в YAML. |
| P0-11 | Защитить main | **Owner gate.** Фактический Ruleset/branch protection в этой сессии не был прочитан из GitHub Settings. | Владелец проверил правила в Settings; PR обязательны; нет force-push/delete; реальные статус-проверки выбраны по точным именам; обходы ограничены. |
| P0-12 | Secret scanning и push protection | **Owner gate.** Требуется проверить доступность и состояние функций в репозитории. | Включены доступные бесплатному публичному репозиторию механизмы; тестовый секрет не публикуется, реальные credentials не хранятся в Git. |

### P1 — надёжность основных подсистем после статического UI

| ID | Задача | Текущее решение | Критерий продвижения |
|---|---|---|---|
| P1-01 | Личная/проектная/общая память | Сохранять разделение browser-local, project, private/shared/global scopes и явное подтверждение promotion. Серверные graph/sync flags остаются выключенными по умолчанию. | Миграции, backup/restore, conflict policy, tombstones и cross-project isolation проходят integration tests. |
| P1-02 | Удаление и retention | Не называть SQLite `secure_delete` криптостиранием. Учитывать FTS, evidence copies, WAL/journals, browser copies и backup rotation. | Тест удаления по каждому реальному слою; явно документированы исключения и срок жизни backup. |
| P1-03 | RAG / retrieval | Оставить текущие SQLite FTS5 + lexical/concept graph + RRF как дешёвый baseline. Не добавлять vector DB/embeddings/GraphRAG автоматически. | На разрешённом обезличенном RU/EN/TH наборе не менее 50 golden queries сравнить baseline/candidate: Recall@5, MRR, nDCG, citation correctness, latency и peak RSS. |
| P1-04 | Голос ASR/TTS | Сохранить Whisper.cpp + Piper и half-duplex прототип как выключенную опцию. Не мигрировать на LiveKit/Pipecat только ради модного стека. | Проверены точные hashes/licenses, модель/голос, RSS, p95 latency, real microphone/speaker, cancellation, echo и RU/TH качество на целевом устройстве. |
| P1-05 | Документы | Local bounded extraction остаётся выключенным до проверки установки и parser behavior. | Проверены PDF/DOCX/XLSX limits, MIME, temp files, cancellation, malicious inputs, memory и отсутствие внешнего fallback. OCR — отдельный gate. |
| P1-06 | Tools / sandbox | Запретить shell и side-effect tools по умолчанию. Approval ticket без sandbox не делает команду безопасной. | Fail-closed policy, parameter-bound approval, idempotency/crash recovery, per-tool permissions, seccomp/Landlock или WASM isolation и adversarial tests. |
| P1-07 | OAuth / Drive / connectors | Только optional feature; browser localStorage не является vault для refresh tokens. | PKCE, minimum scopes, encrypted server storage, rotation/revoke, backup, deletion propagation и owner credentials verified. |
| P1-08 | Provider reliability | Сохранять отдельные credentials/provider configs и явный cross-provider fallback. Ошибка CORS не должна скрыто отправлять prompt другому поставщику. | Provider-specific contract tests и live smoke только с owner consent; проверить invalid key, 429, timeout, bad model, catalog refresh. |
| P1-09 | Privacy notice | `LAUNCH_PRIVACY_REVIEW_RU.md` — внутренняя карта, не юридическая политика. Не обещать zero logs, E2E encryption или multi-user security без доказательств. | Владелец подтверждает оператора, юрисдикцию, поставщиков, retention, backups, support contact; затем независимая проверка текста. |

### P2 — наблюдаемость, рост и качество эксплуатации

| ID | Задача | Текущее решение | Критерий продвижения |
|---|---|---|---|
| P2-01 | Простая наблюдаемость | В репозитории уже есть trace ID/W3C traceparent middleware и optional OTel config. Внешний collector не обязателен для V1. | Сначала request ID, duration, status, route class, upstream outcome и redacted counters; не записывать prompt, документы, audio, auth headers или memory facts. |
| P2-02 | OpenTelemetry | Оставить `ALANDI_OTEL_ENABLED=false`; подключать optional pinned exporter только при наличии реального локального/HTTPS OTLP target. | При включении подтверждены privacy allowlist, endpoint auth/TLS, sampling, timeout и отсутствие prompt/PII attributes. |
| P2-03 | Метрики LLM | Не вводить Langfuse/Phoenix в базовый 8-GB stack. | Добавлять только после измеримой нужды и отдельного согласования хранения prompt/output и стоимости. |
| P2-04 | Feature flags | Использовать уже существующие env flags с safe-off defaults. Не добавлять Unleash/LaunchDarkly в личный free-first контур. | Новая функция имеет один явный флаг, default false, owner docs, тест выключенного и включённого состояния и rollback. |
| P2-05 | Mobile/browser QA | Chromium E2E — автоматический regression check; iPhone Safari остаётся ручным gate. BrowserStack/Device Farm не включать без бюджета. | Native Safari keyboard, safe area, VoiceOver, touch, focus, reduced-motion и rotation проверены физическим устройством. |
| P2-06 | Runtime capacity | Не обещать latency target до измерения; старт — одна модель, concurrency=1, фиксированный контекст. | Снять RAM/PSS, disk, cold/warm latency, TTFT, tokens/s, p95, cancellation и reboot test на целевом VPS. |
| P2-07 | Агентная оркестрация | Существующий pipeline — 4 последовательных этапа на выбранной модели, не независимая swarm-команда. | Отдельный runtime вводится лишь с DAG limits, cancellation, idempotency, per-agent permissions, budget, trace и evaluations. |

## 2. Решения по предложенным технологиям

Предложенный стек — хорошая карта направлений, но не каждый инструмент улучшает первый бесплатный релиз. Решение на 2026-10-30:

| Предложение | Решение для aLandi | Причина |
|---|---|---|
| GitHub Rulesets | **Использовать / owner setup.** Не считать единственной заменой branch protection. | Rulesets и branch protection могут работать одновременно и складывать правила. Сначала изучить текущие настройки, затем применить минимальную защиту. |
| Mandatory signed commits | **Отложить до проверки workflow.** | GitHub проверяет подпись коммитов из PR-ветки; неподписанные commits могут блокировать squash merge даже когда финальный squash-коммит будет подписан. Сначала настроить и испытать signing для человека и automation. |
| Hourly live Playwright canary | **Не включать по умолчанию.** | Для проверки нужен живой staging host, секрет и inference budget; периодический запрос может раскрывать prompt и потребляет ресурсы. CI уже подходит для mocked/public UI smoke. |
| FastAPI liveness/readiness | **Добавить без breaking change.** | Существующий /healthz делает upstream check и ближе к readiness. Добавить /livez и /readyz, /healthz сохранить как alias readiness. |
| `POST /api/tags` | **Не использовать.** | Ollama list-tags endpoint в существующем коде вызывается как GET. Health probe не должен запускать generation. |
| OpenTelemetry / Jaeger / Tempo | **Оставить OTel optional; collector не ставить в base stack.** | Helper уже есть, а постоянный telemetry backend добавляет RAM/storage/ops и privacy concerns. |
| PowerSync / ElectricSQL | **Не мигрировать сейчас.** | Имеется browser localStorage/IndexedDB и FastAPI/SQLite. Межустройственная sync — отдельная архитектура с migration, ACL, conflict resolution, tombstones и deletion propagation. Сначала доказать необходимость. |
| Pipecat / LiveKit Agents | **Не заменять текущую voice схему в V1.** | Добавляют media/WebRTC runtime и больше operational surface. Оставить текущий local half-duplex; сравнить фреймворки после device benchmark. |
| GraphRAG / Qdrant / Weaviate | **Не добавлять сейчас.** | Текущий SQLite FTS5/RRF — дешёвый baseline; графовое извлечение/embeddings и отдельная БД требуют данных и ресурса. Промоутить только после golden-set win. |
| RAGAS / DeepEval | **Можно рассматривать как eval tooling, не как runtime dependency.** | Сначала обеспечить качественный, permissioned, de-identified golden dataset и воспроизводимую offline harness. |
| Firecracker / Wasmtime / WebContainers | **Не обещать sandbox V1.** | Изоляция требует host/runtime support и adversarial testing; оставить side-effect tools выключенными. |
| Unleash / LaunchDarkly | **Не добавлять.** | Текущие per-feature env flags достаточны для single-owner сервера; отдельный control plane добавит сеть/операции/стоимость. |
| BrowserStack / AWS Device Farm | **Не делать release dependency.** | Не входит в guaranteed free stack; использовать ручную приёмку реального iPhone и сохранять список проверок. |
| Langfuse / Arize Phoenix | **Не добавлять в базовый VPS.** | Трассировка prompt/output может создать новый канал хранения чувствительных данных и увеличить инфраструктурную нагрузку. |

## 3. Обязательный release gate V1

### Автоматические проверки на точном PR HEAD

- [ ] Integrity: HTML structure, JS parse, immutable Action SHAs.
- [ ] Security: no credentials, safe markdown, safe provider routing and tools.
- [ ] Context: bounded memory/context/tool-loop behavior.
- [ ] Jekyll build: root app and `/landing/` output.
- [ ] Chromium E2E: chat, settings, project, Research Studio, provider state, export/import, landing.
- [ ] Landing responsive sweep: 320, 360, 390, 768, 1024, 1440 CSS px; no horizontal overflow.
- [ ] Landing SEO/link checks: `lang`, title, description, canonical, CTA and relative paths.
- [ ] Reduced-motion behavior: ticker static when OS requests reduced motion; no fake progress.
- [ ] Gateway contract/security tests on PRs that touch gateway.
- [ ] Project State Freshness exact SHA + exact live queue.
- [ ] License/provenance check.
- [ ] Graphify is developer-only artifact; inspect quality and do not ship to runtime.
- [ ] After merge: post-merge Pages deployment and actual published-site smoke.

### Ручные/owner gates

- [ ] Native iPhone Safari: keyboard, safe area, focus, VoiceOver, touch, rotation, 320–390 width.
- [ ] GitHub branch rules and required checks inspected in repository settings.
- [ ] VPS inventory before any installation or reconfiguration; do not replace existing services blindly.
- [ ] Ollama model tag, digest, license, disk/RAM/PSS, cold/warm timings and concurrency=1 recorded.
- [ ] Gateway service listens on loopback; Ollama private on loopback; external origin accessible only through intended HTTPS Tunnel.
- [ ] Valid/invalid Bearer key, allowlisted model, completion, SSE, cache HIT/BYPASS, timeout and reboot tested.
- [ ] No prompt, user file/media body, secret or private memory in logs/traces/artifacts by default.
- [ ] Owner has confirmed whether the first deployment is personal/limited access; never imply public multi-user auth.

**Запрет на ложный release claim:** PR checks passing ≠ merge; merge ≠ Pages deployment; Pages deployment ≠ VPS live; `/healthz` ≠ verified model completion; source file ≠ enabled runtime feature.

## 4. Внешние зависимости и что нельзя выполнить только из репозитория

Следующие пункты требуют действия владельца или реальной среды. Их нельзя закрыть созданием документа, mock-тестом или CI:

1. Включение/проверка branch rules, ruleset, secret scanning и push protection через Settings.
2. Предоставление хоста/VPS и подтверждение его существующих сервисов, DNS, Tunnel и billing.
3. Установка модели и фактический benchmark на целевой машине.
4. Проверка физического iPhone Safari/VoiceOver и реального микрофона/динамика.
5. Предоставление permissioned de-identified RAG corpus RU/EN/TH.
6. Конфигурация OAuth/Drive, если она вообще нужна первому релизу.
7. Подтверждение оператора/юрисдикции/retention для публичной privacy policy.

Не запрашивать и не записывать в PR токены, API keys, Tunnel credentials, OAuth secrets или приватные host logs. Для live smoke владелец задаёт secret через GitHub Actions/среду и явно разрешает конкретный тест.

## 4.1 Рекомендуемая конфигурация защиты main (owner-only)

Настраивается только в GitHub **Settings → Rules → Rulesets** после просмотра уже действующих branch protection rules. В публичном репозитории GitHub Free rulesets и classic branch protection доступны, и они применяются совместно; не создавать дублирующие/конфликтующие правила вслепую.

Рекомендуемый начальный профиль для `main`:

- Enforcement: **Active**, target branch: `main`.
- **Require a pull request before merging**; запретить прямые push обычным участникам.
- **Require status checks**: сначала выбрать конкретные имена check runs после того, как они завершатся на реальном PR. Убедиться, что каждый обязательный check запускается на любом PR, либо иметь единый always-on gate; path-filtered workflow нельзя без проверки механики сделать обязательным для каждого PR.
- **Block force pushes** и **Restrict deletions**.
- **Require linear history** только при включённых squash/rebase merge methods.
- **Require conversation resolution** для review-комментариев.
- Не разрешать широкие bypass role. Для emergency bypass оставить только владельца и записывать причину.
- Число approvals: если владелец — единственный reviewer, требование 1 approval заблокирует self-merge; начать с 0, но с обязательным PR и зелёными CI. При появлении второго trusted maintainer включить 1 approval и dismiss stale approvals. Не считать self-review независимым подтверждением.
- **Require signed commits** пока не включать: сначала подтвердить, что локальные commits, GitHub/API-generated commits и все automation branches реально имеют verified signatures. GitHub может проверять все commits PR head при оценке merge; неподписанные commits способны блокировать squash merge, хотя финальный commit был бы подписан.
- Secret scanning / push protection: открыть repository Security settings и включить те бесплатные функции, которые доступны этому public repo. Никогда не проводить проверку реальным секретом в публичном commit; тестировать локально фиктивным маркером.

**Что проверить перед выбором обязательных checks:** текущий Quality workflow запускается на каждом PR и даёт Integrity, Security, Context, Jekyll и Chromium jobs. Gateway Tests, Project State Freshness и часть provenance/Graphify jobs имеют собственные path/условия запуска. Не требовать от ruleset job, который не создаётся на части PR — это способ случайно заблокировать все изменения документации или только UI. Сначала проверить реальный список checks на PR с frontend change, backend change и docs-only change.

## 4.2 Прослеживаемость исходных списков и мелких требований

Объединение не заменяет и не удаляет исходные реестры. Таблица показывает, куда перенесён каждый класс требований; исходный документ остаётся детализацией и историей принятия решения.

| Источник | Область/ID | Объединённые пункты | Что дополнительно проверять |
|---|---|---|---|
| `docs/V1_UI_FINALIZATION_RU.md` | Направления 1–4: общий UI, composer/mobile keyboard, маршруты, inline validation | P0-03, P0-04, P0-07, P2-05 | Ошибки URL/key/model/CORS/401/5xx; focus/scroll; нативная клавиатура и safe-area |
| То же | 5–8: system prompt, provider instructions, tools/Tavily, gateway state | P0-05, P0-06, P0-07, P1-08 | Pencil/readonly, privacy copy, redaction, реальный model probe отдельно от mock |
| То же | 9–13: modals, long scroll, advanced settings, theme/language/motion, catalog | P0-04, P0-05, P0-07, P2-05 | Escape/focus return, sticky actions, mobile hit targets, RU/EN, stale catalog/fingerprint |
| То же | 14–17: projects, Research Studio/search, task profiles, agent blueprint | P0-03, P0-04, P1-01, P1-03, P2-07 | Project isolation/export/delete; независимость effort/search/profile; pipeline не выдавать за swarm |
| То же | 18 + лендинг/release gates | P0-01, P0-02, P0-03, P0-08 | Desktop/mobile screenshots, canonical/CTA, Pages после merge, Safari owner gate |
| `docs/USER_REQUEST_CHECKLIST.md` | A: governance, baseline, continuity | P0-09, P0-10, P0-11, P0-12 | Открытая очередь, exact SHA, branch rules, secret scanning |
| То же | B: aLandi Cloud/provider/Tavily | P0-01, P0-07, P1-08 | Первичное disconnected состояние, один bounded probe, no silent fallback, отдельные credentials |
| То же | C: branding/header/clock/theme/language/composer/files/voice preview | P0-03, P0-04, P2-05, P2-06 | 44px controls, RU/EN copy, touch keyboard, voice preview остаётся preview |
| То же | D: chats/projects/private/shared memory/deletion | P1-01, P1-02 | Scope isolation, explicit promotion, export/import, derived records and backup deletion |
| То же | E: routing/tools/search/errors/research/evals | P0-07, P1-03, P1-06, P1-08, P2-07 | Bounded tool rounds, cancellation, citation links, no private-prompt cross-provider forwarding |
| То же | F: V-016 dependencies/audio/RAG/sandbox/hardware/license | P0-12, P1-02–P1-06, P2-06 | CUT/PAT не становятся runtime deps; hash/license/host benchmarks |
| То же | G–H: merge/deploy/manifest/rejected work | P0-08–P0-12, P1-09 | PR-head ≠ merge ≠ live deploy; отклонённые/заблокированные items остаются в ledger |
| То же | I + supplements 2026-10-24…30 | P0-03, P0-04, P1-01, P1-08, P2-05, P2-07 | Новые UI детали должны иметь regression test или честный manual gate |
| `docs/V016_IMPLEMENTATION_CHECKLIST.md` | Original 81-item audit + UX-01…UX-27 | P0-03–P0-10, P1-01–P1-09, P2-01–P2-07 | UX-01/04/05/06/08/09/10 провайдеры; UX-15 documents; UX-16 voice preview; UX-17…27 projects/settings/search/agents — статус остаётся источником подробного DoD |
| `docs/PRE_LAUNCH_STACK_RU.md` | Gateway → Tunnel → Ollama runbook and release checks | P0-06–P0-08, P0-11–P0-12, P2-06 | Inventory-before-install, loopback-only, firewall, rollback, backup restore, model digest/license and reboot test |
| `docs/IMPLEMENTATION_ROADMAP_RU.md` | P1 attachment/voice/RAG/image/agents/memory/provider verticals | P1-01–P1-09, P2-06–P2-07 | Проектные этапы не становятся обещанием релиза до runtime evidence and benchmark |
| Issue #111 | Main governance, supply chain, first deployment, live host, RAG corpus, voice/doc, sandbox, memory deletion, OAuth | P0-08–P0-12, P1-01–P1-09, P2-05–P2-06 | Каждая live/owner dependency закрывается только фактическим evidence в Issue #111 |

### Мелкие требования, которые нельзя потерять между крупными задачами

| Деталь | Где учитывается | Доказательство/остаток |
|---|---|---|
| Нет дублирующих action selectors и скрытых повторных кнопок Save/Close | P0-04 | Integrity + Chromium; повторно проверить exact-head |
| Ошибка ключа/модели видна около поля; секрет не попадает в toast/log | P0-04, P0-07 | Mock E2E invalid key/model; проверить отсутствие secret в diagnostics |
| Вставка ключа инициирует один ограниченный catalog refresh + model probe | P0-07, P1-08 | Playwright test paste-provider-key; live provider остаётся отдельным opt-in |
| Встроенный provider option остаётся скрытым legacy option, не удаляется из migration HTML | P0-05, P0-07 | Проверять hidden optgroup и наличие внешних option; native option не считать видимым как обычный DOM-блок |
| Settings/Project Settings закрываются через X и Escape; фокус возвращается на видимый control | P0-04 | Exact-head keyboard/focus E2E; ручной screen-reader review остаётся |
| Закрывающий control sidebar доступен при длинной памяти и проектах | P0-04 | Sticky header и 44px target; проверить на узкой высоте экрана |
| Search normal/more/offline не меняет effort; Fast/Thorough не меняет search scope | P0-03, P0-04 | Existing orthogonal-settings E2E; Thai locale отдельный regression |
| Research Studio не очищает composer, не отправляет автоматически и не меняет skill preset | P0-03, P0-04, P2-07 | research-studio.spec.mjs: apply/close/Escape/no-send/current-chat settings |
| Публичная выдача содержит URL источника и проверяемый origin/query; нет ссылки, выдуманной UI | P1-03 | Mock E2E for source contract; реальный CORS/provider availability не гарантируются |
| RU/EN/TH locale и корректная URL локали Wikipedia | P0-03, P1-03 | RU/EN UI tests + Thai Wikipedia mocked E2E; Thai search source language doesn't prove all Thai web coverage |
| Long chat/attachments/composer сохраняют draft и не расширяют document viewport | P0-04, P2-05 | 320/390 width + long-message + actual iPhone Safari manual gate |
| Reduced-motion отключает marquee/ticker, текст остаётся читаемым | P0-02, P0-04 | Chromium emulate media; verify published Pages after merge |
| Лендинг не обещает бесплатный inference, background work, active roadmap runtime или public multi-user SaaS | P0-01, P0-02 | Landing copy + build/E2E + post-deploy public URL smoke |
| Voice/agent/sandbox/image features остаются выключенными/preview пока не доказан backend | P1-04, P1-06, P2-07 | Truthful UI copy and safe-off defaults; no feature promoted by docs alone |

## 5. Итоговая рекомендованная последовательность

1. Довести PR #121: UI, лендинг, README, E2E, RU/EN, mobile touch, no-overflow и reduced-motion.
2. Пройти полный exact-head CI и merge только при green required gates; проверить post-merge Pages и опубликованные root/`landing/` URL.
3. Добавить совместимые `/livez` + `/readyz` и тесты; сохранить `/healthz` как старый readiness alias.
4. Согласовать README/START_HERE/gateway runbook и дополнить freshness/contract validation только deterministic checks.
5. Подготовить owner checklist для main protections; проверить точные реальные workflow status names прежде чем требовать их в ruleset.
6. Когда владелец предоставит VPS, провести preflight, deploy и реальный authenticated completion; закрыть соответствующие части Issue #111 только по evidence.
7. Только после работающего текстового контура отдельно решать memory sync, RAG improvements, voice and sandbox по метрикам и безопасным gate.

## 6. Проверенные первичные ориентиры

- GitHub Rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets — rulesets и branch protection могут наслаиваться; активные правила суммируются.
- GitHub signed commits: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets — неподписанные коммиты в PR могут блокировать squash merge.
- Ollama API: https://docs.ollama.com/api/tags — список моделей проверять read-only GET, не создавать inference из health probe.
- FastAPI security: https://fastapi.tiangolo.com/reference/security/ — Bearer/API-key dependencies; auth проверять отдельно от CORS.
- OpenTelemetry Python: https://opentelemetry.io/docs/languages/python/instrumentation/ — API/SDK/exporter ставятся отдельно; включение telemetry не требует автоматической установки collector.
- LiveKit Silero VAD: https://docs.livekit.io/agents/logic/turns/vad/ — локальный CPU VAD существует, но сам по себе не решает весь real-time voice pipeline.
- Microsoft GraphRAG: https://microsoft.github.io/graphrag/query/overview/ — Global Search resource-intensive; не вводить GraphRAG как бесплатную замену простому FTS без eval.

---
## 7. Дополнительные обязательные требования владельца — 2026-10-30

Эти требования добавлены после исходного V1 backlog и имеют приоритет при планировании первого полноценного обновления после публикации лендинга. Они не считаются реализованными только потому, что существуют отдельные прототипы.

### P0 — голос как обязательная часть первого полноценного релиза
- [ ] **P0-13. Editable speech-to-text:** запись с микрофона, локальная транскрипция, редактирование распознанного текста до отправки, RU/EN/TH quality tests.
- [ ] **P0-14. Conversational voice assistant:** полноценный естественный turn-taking, streaming transcript/response, VAD, barge-in, cancellation, echo cancellation, transcript alignment. Текущий half-duplex prototype — только основа, не завершённая функция.
- [ ] **P0-15. Read selected text aloud:** выделение произвольного фрагмента ответа/сообщения и озвучивание только выделенного содержимого.
- [ ] **P0-16. Read one whole message aloud:** стабильный TTS для целого сообщения, voice choice, mini-player, pause/resume/stop, cleanup and stale-request protection.
- [ ] **P0-17. Read multiple selected messages aloud:** multi-select messages, ordered playback queue, pause/resume/skip/stop, cancellation and queue state; no parallel Piper jobs.
- [ ] **P0-18. First-release voice acceptance:** реальные microphone/speaker tests на целевых устройствах; RU/EN/TH; word error rate, first transcript latency, first audio latency, interruption latency, echo, CPU/GPU/RAM, model license and SHA-256. Без этого не обещать «почти человеческий» realtime.

### P1 — small helper models, GPU inference and agent orchestration
- [ ] **P1-10. Helper model registry:** специализированные роли (classification, extraction, rerank, summary, memory candidate, skill synthesis), exact model ID/digest/license, capability, context/token budget, timeout, concurrency and eval.
- [ ] **P1-11. GPU inference profile:** Ollama GPU vs llama.cpp server benchmark; GPU-only inference mode must fail closed if no compatible GPU is detected. CPU still runs OS/API/orchestration; the requirement is no mandatory CPU model inference, not zero CPU usage for the whole host.
- [ ] **P1-12. High-throughput optional serving:** evaluate vLLM only on compatible accelerator hardware and when continuous batching/throughput materially helps. It is not the default 8-GB/single-model deployment.
- [ ] **P1-13. Multi-agent runtime:** bounded DAG/fan-out, queue/backpressure, per-agent scope/permissions, deadline, budget, cancellation propagation, idempotency, checkpoints, traces, retries and eval harness. Current four-stage research pipeline is not a swarm.
- [ ] **P1-14. Mass-agent load test:** establish safe concurrency, VRAM admission, memory residency/eviction, fairness, queue limits and degraded-mode behavior before increasing agent count.

### P1 — internal notebook / Knowledge-to-Skill
- [ ] **P1-15. Knowledge-to-Skill pipeline:** authorized books, PDFs, office documents, websites and repo sources → bounded extraction → chapters/sections → source/page provenance → skill generation → injection/license scan → human review → versioned private skill.
- [ ] **P1-16. Skill lifecycle:** schema validation, scope isolation (personal/project), diff, versioning, rollback, deletion/retention and import/export.
- [ ] **P1-17. Safe ingestion:** MIME sniffing, archive/path traversal defense, XXE/bomb limits, parser timeout, temp cleanup, invisible Unicode scan, prompt injection scan and no automatic external provider fallback.

### Реальный текущий статус голосового контура
- Уже есть: локальный ASR adapter на whisper.cpp; UI запись/отправка аудио; редактируемая транскрипция; локальный Piper TTS одного сообщения; mini-player; half-duplex voice conversation loop.
- Пока отсутствует/не доказано: чтение выделенного текста; multi-message queue; true streaming speech turn-taking; native acoustic echo cancellation; actual acoustic barge-in; стабильное качество на целевых устройствах и RU/EN/TH.
- Все server flags ASR/TTS остаются off by default; для использования нужны установленные бинарники/модели, проверенные licenses/hashes и owner-host acceptance.
- «Голосовой помощник почти как человек» — цель качества, а не маркетинговый claim до прохождения acceptance.

### Правило планирования
Сначала завершить и опубликовать честный статический лендинг и текущий клиентский UI. Первый функциональный update после публикации должен объединить эти обязательные вертикали с реальным backend/runtime и тестами; не загружать UI-кнопки, которые не имеют работающего end-to-end пути.

## 8. Остаток landing/app polish из актуального main
Синхронизирован документ [LANDING_UX_POLISH_BACKLOG_RU.md](LANDING_UX_POLISH_BACKLOG_RU.md). Его пункты также являются частью release checklist:
- [ ] Скриншоты и визуальная проверка landing на 320/360/390/768/1024/1440 px; hero, карточки, CTA, spacing, contrast, footer.
- [ ] Keyboard-only и screen-reader проверка трёх раскрываемых roadmap секций и pause controls.
- [ ] Published Pages smoke после merge; canonical, ссылки и реальный deployment.
- [ ] App screenshot pass desktop/mobile; typography, contrast, spacing, empty/error states, RU/EN, light/dark.
- [ ] Все composer popovers на краях viewport, коротком viewport, с клавиатурой и nested scroll.
- [ ] Dialog Escape/focus trap/return/scroll lock/background inert; sticky Settings actions.
- [ ] Проверка дублирования chat import/export и project bundle actions.
- [ ] Long names, large lists, keyboard navigation, 44px touch targets.
- [ ] Functional menu отражает только реально зарегистрированные skills/agents/connectors and permissions.
- [ ] Native iPhone Safari, VoiceOver, safe-area, keyboard, rotation and touch cancellation — owner gate.
- [ ] Keep Native Popover API/CSS Anchor Positioning progressive enhancement only; preserve JS fallback.


## 9. Дополнительные технические решения по голосу и Skill-формату
- Текущие `skills/*.txt` — это prompt/instruction snippets, а не Agent Skills standard. Не менять их формат и не ломать текущий selector. Новый Knowledge-to-Skill каталог должен быть отдельным, например `agent_skills/<slug>/SKILL.md` с YAML frontmatter и optional `references/`, `scripts/`, `assets/`; загрузчик должен поддерживать progressive disclosure и project/private scopes.
- ASR baseline остаётся whisper.cpp. Кандидаты для RU/EN/TH benchmark: NVIDIA NeMo-Speech.cpp + Nemotron 3.5 ASR Streaming 0.6B (RU transcription-ready, TH adaptation-ready), Qwen3-ASR-0.6B через sherpa-onnx (RU/TH указаны в языковом списке), и Parakeet RNNT 1.1B (RU/TH, но более крупный и NVIDIA Community Model License). Moonshine не является заменой для RU/TH, поскольку его текущий список STT языков их не включает.
- NeMo-Speech.cpp upstream заявляет streaming ASR/TTS и full-duplex VoiceChat; benchmark 160 ms chunks относится к upstream hardware, не к aLandi. Любая интеграция должна быть отдельным prototype с измерением target device, language WER, TTFA, RTF, interruption, echo and VRAM.
- GPU-only означает отсутствие CPU inference для модели, а не отсутствие CPU у gateway/OS/IO. Строгий GPU-only режим должен fail closed, если модель не помещается целиком в VRAM; частичный offload нельзя называть GPU-only.

## Research update — 2026-10-30 (Exa)
See docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md for sources and adoption decisions.
- Nemotron 3.5 ASR 0.6B: RU transcription-ready; TH adaptation-ready; OpenMDW-1.1 model terms.
- Typhoon ASR Streaming 115M: Thai-specific; CC-BY-4.0; separate NeMo/PyTorch path.
- VibeVoice ASR 1.5B: RU among ten listed languages, no TH; MIT model card.
- VoxCPM2 TTS: 30 languages including RU/TH; Apache-2.0; high-VRAM optional candidate.
- NeMo-Speech.cpp: Apache-2.0 code, separate model licences; optional local ASR/TTS/realtime WebSocket runtime. VoiceChat 11B requires 80GB VRAM/CUDA; not default target.
- MagpieTTS: NVIDIA Open Model License, 12 languages but excludes RU/TH.
No candidate selected without identical RU/EN/TH audio, WER/latency/turn/echo metrics, target-device measurements, exact SHA and licence acceptance. whisper.cpp/Piper remain baseline.
