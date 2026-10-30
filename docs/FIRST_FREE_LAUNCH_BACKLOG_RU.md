# aLandi — объединённый backlog первого бесплатного релиза и полного стека

**Срез:** 2026-10-30  
**База main:** `2bda22229cba3576628f92c821bb6e1562d8abc5`  
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
