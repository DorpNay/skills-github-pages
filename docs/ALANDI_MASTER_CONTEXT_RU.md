# aLandi — мастер-контекст проекта

Редакция: 2026-11-02. Документ для разработчиков и ИИ-агентов, включая роль @Поиск.

> Важно: одобрение идеи не означает, что она уже реализована. Проверяйте код, тесты, CI и live-поведение прежде, чем утверждать обратное.


## Актуальная контрольная точка — 2026-11-02

- Основной продуктовый UI V2.0 разрабатывается в PR #131: https://github.com/DorpNay/skills-github-pages/pull/131. Рабочая ветка: feat/landing-v1-accessibility-responsive-20261031. Не объединять и не публиковать без отдельного разрешения владельца.
- Проверенный PR-head до CI correction: e75e608bb1b9f588ccc26f575602113037f44039; first CI correction commit: 414ce3c6a25062740cf33d5bcd807a061e422697. This follow-up moves the local Pages baseurl mapping into a writable temporary document root; exact current HEAD is always read from live PR metadata.
- Текущий main на момент сверки: 0a1f764f295f92e49e347cdc972f8c6c9a07e4c1. PR #131 diverged: 537 commits ahead, 4 behind, merge base e78a73b25725bfa63370d9946887cbbacbf51b82. Четыре коммита main затрагивают только docs/V1_UI_FINALIZATION_RU.md; не выполнять rebase/sync без сохранения обеих версий.
- Quality #1197 / run 41352153636 hit the 30m Chromium global timeout after local CSS/JS 404s caused by a mismatch between Jekyll baseurl and the local server root. First sharded run #1198 / 41355064390 started four runners concurrently but failed before tests because the first symlink attempt wrote into read-only _site; the temp-root overlay correction is now in progress. Do not infer product regressions or a 3x speedup until the exact-head suite executes and passes.
- Единый UI scope: active inherited work through section 8 plus mandatory 8.1–8.17 remain the release queue. After the exact-head Chromium harness is green, resume this UI queue and continue the evidence-first @Поиск research protocol; optional 8.18–8.27 remain non-blocking candidates.
- В исходнике уже есть modal/history stack, toast/status, last-closed-chat recovery, project memory scope, contextual chat/project/message actions, local chat persistence и attachment processing. Новые улучшения должны развивать эти механизмы, а не создавать дубли.
- Repository identity cleanup — отдельный workstream. Legacy GitHub Skills exercise workflows обнаружены; удаление не выполнялось до проверки repository template flag и run history. Каталог skills/*.txt — действующие task profiles aLandi и сохраняется. Rename repo отложен до custom domain: GitHub не перенаправляет project Pages URL при rename.


## Источник истины

- Репозиторий: https://github.com/DorpNay/skills-github-pages
- Публичный клиент: https://dorpnay.github.io/skills-github-pages/
- Установка и rollback: [ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md)
- Агентные роли и память: [ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md)
- Техники и источники: [TECHNIQUE_REGISTER_RU.md](TECHNIQUE_REGISTER_RU.md)
- Технологический аудит: [TECHNOLOGY_AUDIT_2026-10-21_RU.md](TECHNOLOGY_AUDIT_2026-10-21_RU.md)
- Шесть инженерных пластов и критерии eval: [SIX_LAYER_ENGINEERING_RU.md](SIX_LAYER_ENGINEERING_RU.md)
- Реестр архитектурных решений D-001–D-019: [DECISIONS.md](../DECISIONS.md)
- Запуск offline smoke eval: [gateway/evals/README_RU.md](../gateway/evals/README_RU.md)
- Полный имплементационный пакет: [CODER_PACKET.md](CODER_PACKET.md)
- Формальное состояние улучшений: [PROJECT_STATE.yaml](PROJECT_STATE.yaml)
- Evaluation registry: [EVALS.md](../EVALS.md)
- Engineering loop / rollback protocol: [LOOP.md](../LOOP.md)
- Upstream evidence and licenses: [INTEL.md](../INTEL.md)
- Voice latency contract: [LATENCY_CONTRACT.md](LATENCY_CONTRACT.md)
- Accepted improvement backlog: [ACCEPTED_IMPROVEMENTS.md](ACCEPTED_IMPROVEMENTS.md)

## Подтверждённый статус после merge (21 октября 2026)

PR #18 уже влит в `main` (merge commit `ac342efe29f6b9886425a83d04438ea25d731fee`). Он добавил backend-прототипы, но не live-deployment:
- `gateway/routing.py`: deterministic exact-template fast path, выключен `ALANDI_FAST_ROUTING_ENABLED=false`; general draft cascade и embeddings пока не внедрены.
- `gateway/kv_budget.py` + `gateway/host_metrics.py`: inventory `/api/ps` плюс read-only current/peak RSS gateway/Ollama через Linux procfs, если доступен; per-conversation KV telemetry/eviction не поддерживается, автодействий нет.
- `gateway/rag/lazy_graph_rag.py`: SQLite FTS5 + lexical concept graph with source/page provenance, отключено `ALANDI_RAG_ENABLED=false`; это baseline, не полный LazyGraphRAG.
- `gateway/memory/delta_sync.py`: bounded versioned JSON Patch, append/truncate deltas, conflict checks and deletion; API отключено `ALANDI_MEMORY_SYNC_ENABLED=false`, browser UI ещё не интегрирован.
- `gateway/security/oauth_vault.py` + `gateway/security/google_oauth.py`: Fernet vault и Google OAuth Authorization Code/PKCE routes; отключены `OAUTH_ENABLED=false`; реальные client credentials/callback, Drive Picker/UI и file import не настроены.
- `gateway/evals/run_six_layer_eval.py`: offline synthetic smoke suite (не product benchmark), включена в gateway CI.

Код находится в `main`, но не следует делать выводов, что компоненты развернуты на VPS: gateway не обновлялся в этой работе, feature flags остаются выключенными, а реальные OAuth credentials не настроены.

При конфликте источников приоритет: актуальный код и тесты → успешный CI/live-проверка → документация проекта → upstream → сторонние статьи → предположение.

## Новые инженерные прототипы (Coder Packet, 22 октября 2026)

Реализационные файлы и тесты присутствуют в ветке внедрения; перед ссылкой на production всегда проверять текущий merge SHA и Actions:
- `observability/trace_context.py`: безопасный trace ID и ответный заголовок `X-AI-Trace-ID`; event schema запрещает произвольные атрибуты.
- `gateway/memory/schema.sql` и `manager.py`: scoped graph, обязательный provenance, valid/recorded time, CONTRADICTS/SUPERSEDES и scoped delete.
- `gateway/rag/citations.py`, `evidence_ledger.py`: цитаты проверяются по source hash и offsets; ledger локальный и не опубликован как API.
- `gateway/voice/*`: Tier0 harmless commands, bounded endpoint heuristic, cPocket leases, speculative read-only response buffer и barge-in policy. Нет нативного audio capture/ASR/TTS/AEC runtime.
- `gateway/tools/*`: JSON Schema, bounded read-only DAG, approval ticket; gateway не исполняет shell commands и не публикует executor.
- `gateway/security/ssrf_protection.py`: SSRF policy primitive; arbitrary URL fetcher не подключён.
- `infra/license/provenance_manifest.yaml` and CI: модель не допускается к shipping без artifact SHA-256 и отдельно проверенной лицензии engine/model/voice.

`gateway/requirements-dev.txt` добавляет PyYAML для проверки манифеста и Vulture как report-only статический анализ. `orjson` пока только бенчмарк, `uv` пока metadata candidate: lockfile не считается готовым, пока его не создали в сети с package registry и не проверили. Все прототипы требуют CI и остаются отдельно от live deploy.

## Обязательные статусы

- **IMPLEMENTED** — код и путь вызова найдены, тесты существуют.
- **VERIFIED LIVE** — актуальное опубликованное поведение проверено отдельно.
- **SPECIFIED / APPROVED** — решение принято, реализация не подтверждена.
- **PROTOTYPE** — эксперимент, не production.
- **NEXT** — следующий согласованный этап.
- **DEFERRED** — отложено.
- **REJECTED** — не внедрять без нового обоснования.

Успешный GitHub Pages build не доказывает, что gateway, Cloudflare Tunnel или Ollama работают на сервере.

## Миссия и принципы

aLandi — личный, мобильный, экономный и расширяемый ИИ-ассистент: простой веб-клиент, приватный gateway, контролируемые инструменты, память, проекты, исследования, мультимодальные документы и безопасные рабочие среды.

1. Сначала работающий вертикальный сценарий, а не большой swarm ради количества.
2. Малые модели получают короткие наблюдения и ограниченное пространство действий с типизированными аргументами.
3. Минимальные diff, YAGNI и отсутствие переписывания стека без измеримой пользы.
4. Источники, документы и результаты инструментов имеют provenance и считаются недоверенными данными.
5. Самообучение не попадает в production без golden-set eval, approval и rollback.
6. Учитывать RAM, latency, стоимость, квоты, приватность и лицензии.
7. Не сохранять секреты или скрытые chain-of-thought; для аудита хранить действия, источники, результаты и краткие проверяемые причины.

## Архитектура

### Клиент

Текущий опубликованный клиент — статическое приложение на GitHub Pages/Jekyll с HTML/CSS/JavaScript и навыками в `skills/*.txt`. Он не является постоянно работающим агентным сервером. Не помещать в browser bundle серверные ключи или OAuth secrets. Настройки и история в браузере не означают серверную синхронизацию или backup.

### Целевая серверная схема

`Mobile Web UI → HTTPS/Cloudflare Tunnel → aLandi Lite Gateway → private Ollama → one active model`

Gateway отвечает за авторизацию, лимиты, allowlist, timeouts, безопасные журналы и единые политики. Ollama не выставлять непосредственно в интернет. Для VPS около 8 GB RAM исходное ограничение — одна активная модель и параллелизм генерации 1, пока измерения не докажут другое. SQLite — базовый выбор для небольших данных и exact-response cache. Redis, PostgreSQL, vector DB, Dify и новые framework не добавлять в базовый deployment без измеримого требования.

Exact-response cache должен учитывать нормализованный запрос, модель, параметры, версии prompt/policy и контекст; нужны TTL, ограничения размера и очистка. Не кэшировать приватные ответы без решения о privacy.

## Оркестрация 64 ролей

Каталог 64 ролей описан в [ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md). Роль — логический профиль/контракт, не отдельный процесс модели. Выбирать только необходимые роли:
- Fast: 0–1 роль, не запускать swarm на простом вопросе.
- Deep/Research: план → источники → проверка → синтез.
- Coding: planner → implementer → independent reviewer → tests.
- Security: threat model → негативные тесты → validation → отчёт.
- Documents: classify → parse/OCR → provenance chunks → retrieve → citation check.
- Learning: correction → candidate lesson → golden eval → approval → release/rollback.

Каждая задача получает цель, разрешённые инструменты, max steps, deadline, budget, cancellation и проверяемый критерий остановки.

## Историческая контрольная точка — 2026-10-27

- Последний подтверждённый main после PR #66: 1faf60164b9a0f82eb5e0c56b143ba90499be4a5; post-merge Quality, Pages и provenance прошли на точных SHA.
- PR #66 добавил кураторскую карту docs/ALANDI_ARCHITECTURE_MAP_RU.md и безопасные exclusions для Graphify. Graphify code-only graph теперь строится в GitHub Actions как временный artifact-only dev-инструмент; последний проверенный срез — 1,109 nodes / 3,103 edges / 53 communities, без import cycles. Это не runtime-компонент и не замена ручной архитектурной проверки; локальный container checkout не требуется.
- Ветка feat/local-helper-memory-suggestions-current-main-20261027 содержит новую вертикаль ручных suggestions для проектной памяти: операторский локальный helper model, ограниченные факты, фильтрация секретов, JSON schema, общий inference semaphore и явное сохранение только после клика. На момент записи это feature branch; exact-head CI ещё не подтверждён.
- Не путать три разных слоя: browser-local project memory, local helper suggestions и внутренний Graphify/code-evidence graph. Server-memory browser bridge, per-chat toggle и gateway /v1/memory/graph/* API retired 2026-10-31 по требованию 8.12 / PR #131. Helper не включает серверную память, не меняет prompt автоматически и не подтверждает качество модели на VPS. Conversation delta sync и RAG остаются отдельными механизмами.

## Одобренные техники и происхождение

Ссылки указывают на upstream идей, а не на установку или одобрение всего проекта. Перед переносом кода проверять commit/tag, лицензию кода, весов, данных и ассетов, зависимости и безопасность.

### Harness и инженерный процесс
- [Harness²](https://github.com/google-research/harness2): bounded Propose–Probe–Compose; гипотеза, небольшой probe, проверка, сборка результата.
- [Claudex Loop](https://github.com/chaseai-yt/claudex-loop): цель → probe → минимальный diff → независимый review → тесты → отчёт. Если подразумевался иной проект, уточнить URL.
- [Everything Claude Code](https://github.com/affaan-m/ECC): выборочно TDD, review, context compaction и evals; не переносить весь provider-specific комплект.
- [Ponytail](https://github.com/DietrichGebert/ponytail): YAGNI, простота, небольшие изменения.
- [Agent Skills](https://agentskills.io/specification): progressive disclosure; сохранять совместимость загрузчика `skills/*.txt`.
- [Paperclip](https://github.com/paperclipai/paperclip): registry ролей/задач, бюджеты, approvals, версии навыков и evals; не устанавливать полный control plane без необходимости.
- [RuFlo](https://github.com/ruvnet/ruflo): bounded orchestration, memory и RAG — идеи, не обязательная зависимость.
- [Trail-Code](https://github.com/trailhq/Trail-Code): dev-only codebase map и проверенные инженерные learnings.
- [Cactus Needle](https://github.com/cactus-compute/needle): benchmark ограниченных extraction/tool-routing задач; проверять точный артефакт, лицензию и telemetry.
- [CLI-Anything](https://github.com/HKUDS/CLI-Anything): help, JSON, exit codes, dry-run, E2E.
- [witr](https://github.com/pranshuparmar/witr): диагностика происхождения процессов и портов; не останавливать процессы автоматически.
- [DBX](https://github.com/t8y2/dbx): typed tools, read-only defaults и SQL validation.

### Память, знания и RAG
- [Utopia](https://github.com/deeplethe/utopia): temporal/bitemporal graph, provenance и конфликты; полный Rust/PostgreSQL/pgvector стек отложен до подтверждения необходимости.
- [RAG-Anything](https://github.com/HKUDS/RAG-Anything): мультимодальные документы, таблицы и формулы — архитектурный ориентир.
- [Free Programming Books](https://github.com/EbookFoundation/free-programming-books): учебный каталог, не runtime.
- [Developer Roadmap](https://github.com/kamranahmedse/developer-roadmap) и [roadmap.sh](https://roadmap.sh): планирование обучения.
- Начинать с SQLite FTS5 и source provenance; embeddings/vector DB/reranking добавлять только если golden set показывает улучшение.

### Браузер, sandbox и интерфейс
- [Jev Ultrafast](https://github.com/browser-use/jev-ultrafast): bounded action space, indexed DOM targets, короткие действия; benchmark узкий, использовать только в изоляции.
- [PinchTab](https://github.com/pinchtab/pinchtab): опциональный Browser-Lab, indexed refs и компактные snapshots; loopback-only, cookies — секреты.
- [NVIDIA OpenShell](https://github.com/NVIDIA/OpenShell): reference для policy-controlled sandbox; не нужен обычному чату.
- [Agent-Reach](https://github.com/Panniantong/Agent-Reach): не запускать installer вслепую; интегрировать только отдельные проверенные adapters с allowlist и SSRF protection.
- [Impeccable](https://github.com/pbakaus/impeccable): inspect-first, critique/polish и UI anti-pattern checks; тестировать responsive/accessibility.
- [taste-skill](https://github.com/Leonxlnx/taste-skill): дизайн-ревью; upstream меняется, проверять актуальный репозиторий и лицензии.
- [Coucou](https://github.com/Louis-CFM/coucou): идеи timeline и approval UX; не копировать бренд/ассеты без проверки прав.
- [Every App](https://github.com/every-app/every-app): отложено, отдельная платформа, не замена клиенту или Ollama cache.
- [Public APIs catalogue](https://github.com/public-apis/public-apis) и [public-api server](https://github.com/davemachado/public-api) — разные проекты; каталог только справочный.
- [Vert](https://github.com/vert-x3/vertx) не считать тем самым проектом, если пользователь не уточнил URL. Неоднозначные названия не интегрировать наугад.

### Документы, OCR, ASR, видео
OCR-кандидаты для собственного benchmark, не утверждение об установке:
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR), [Surya](https://github.com/datalab-to/surya), [GLM-OCR](https://github.com/THUDM/GLM-OCR), [HunyuanOCR](https://github.com/Tencent-Hunyuan/HunyuanOCR), [GOT-OCR 2.0](https://github.com/Ucas-HaoranWei/GOT-OCR2.0), [dots.ocr](https://github.com/rednote-hilab/dots.ocr), [DeepSeek-OCR](https://github.com/deepseek-ai/DeepSeek-OCR), [LightOnOCR](https://github.com/LightOnAI/LightOnOCR).
ASR-кандидаты: [Moonshine](https://github.com/moonshine-ai/moonshine), [Distil-Whisper](https://github.com/huggingface/distil-whisper), [NVIDIA NeMo](https://github.com/NVIDIA/NeMo), [Qwen3-ASR](https://github.com/QwenLM/Qwen3-ASR), [ZIPFORMER](https://github.com/k2-fsa/zipformer), [ASR4ALL](https://github.com/ASR4ALL).
Сравнивать качество на собственных русских, английских, тайских и многоязычных документах/аудио, latency, RAM, streaming и лицензии. ASR (speech-to-text) отделён от TTS и генерации звука.
- [HyperFrames](https://github.com/heygen-com/hyperframes): детерминированный рендер HTML/CSS/media в видео; это renderer, а не text-to-video модель.
- [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC): отдельный AI classroom со слайдами/quiz/simulation/TTS; отложить, пока не будет отдельного сценария и оценки инфраструктуры.
- [AirLLM](https://github.com/lyogavin/airllm): компромисс памяти и I/O, не обещание ускорения.
- [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI): каталог/studio, не универсальная модель.
- [FreeDomain](https://github.com/DigitalPlatDev/FreeDomain): необязательный доменный ресурс, не runtime.

Отклонить автоматизацию массовой регистрации и credential pools из [Grok Register](https://github.com/AaronL725/grok-register). Для xAI и других сервисов использовать официальные API и пользовательские ключи. Не переписывать gateway на [Hono](https://github.com/honojs/hono) без измеримой выгоды.

## Модель памяти

Разделять conversation, project, user preferences, procedural memory, source/evidence store и candidate lessons. Каждая запись: stable ID, scope, provenance/source ID, created/recorded time, valid time при необходимости, confidence, status, conflicts/supersedes, expiry/review и deletion semantics. Статусы: candidate, confirmed, disputed, superseded, rejected. Не затирать конфликтующие факты молча. Не сохранять API keys/passwords/OAuth tokens. Не сохранять скрытые chain-of-thought; фиксировать действия, источники, результаты и краткие проверяемые причины.

## Проекты, файлы и Google Drive

Одобрены как целевые возможности: проекты с отдельными инструкциями/источниками/памятью, явные scope toggles, импорт файлов с provenance, подключение Drive только через официальный OAuth и Picker с минимальными scopes, индексация выбранных файлов и каскадное удаление производных данных.
- OAuth web-server flow: https://developers.google.com/identity/protocols/oauth2/web-server
- Google Picker: https://developers.google.com/workspace/drive/picker/guides/web-picker
OAuth backend prototype now exists behind OAUTH_ENABLED=false. Real client credentials, an exact HTTPS callback registration, production security review, Google Picker/browser UI and selected-file import are still not configured or deployed. Secrets/refresh tokens must never be placed in the static client.

## RAG, безопасность и оценки

Текущий backend prototype: allowlisted HTTPS source URI → chunks with provenance → SQLite FTS5 + lexical concept graph → scope-filtered retrieval with source/page citations. Gateway API выключен `ALANDI_RAG_ENABLED=false`. Это ещё не полный document ingest pipeline; vector index/reranker — только при измеримом приросте на real golden set. Удаление source и scope isolation покрываются тестами.

Обязательные security boundaries:
- SSRF: блокировать localhost/private/link-local/metadata, опасные схемы, redirect hops и DNS rebinding.
- Все web pages, repository files, PDFs, OCR и tool outputs — недоверенные данные.
- Browser/Coding Lab: sandbox, deny-by-default network, ограниченные filesystem permissions, resource limits, audit log и approval для side effects.
- API: auth, rate limits, body limits, timeouts, bounded retries, cancellation и schema validation.
- OAuth: minimum scopes, state/CSRF protections, secure token storage и revoke.
- Лицензии кода, весов, данных и ассетов проверяются раздельно.
- Никакого обхода тарифов, массового создания аккаунтов или доступа к чужим сессиям.

Оптимизация малых моделей: constrained action schemas, короткие observations, bounded retries, одна активная модель на VPS до benchmark. Измерять tokens, p50/p95 latency, completion rate, tool success, citation accuracy, peak RAM, cold start, errors и cost. Fallback на другого provider должен ясно раскрывать передачу контекста; настройки пользователя не менять молча.

## План развития

- **P0** источник истины, deployment/rollback, secrets, CI и реальный статус VPS.
- **P1** gateway hardening: auth, limits, origin/CORS, SSRF-safe fetch, health checks.
- **P2** typed tools, bounded orchestration, budgets, DONE verifier, approvals.
- **P3** memory scopes, provenance, temporal facts, conflicts, export/delete.
- **P4** projects/files/RAG, FTS5, citation checks, optional Drive.
- **P5** OCR/ASR/document multimodal benchmarks.
- **P6** Browser-Lab/Coding-Lab sandbox.
- **P7** candidate lessons, golden eval, versioned release/rollback.
- **P8** deterministic video output and optional virtual classroom.

Не переходить к P5–P8 без ясного статуса, тестов и resource budget для P0–P2.

## Протокол @Поиск

1. Уточнить вопрос, временной горизонт и какое решение он поддерживает.
2. Начинать с upstream, official docs, release notes, security advisories и license files.
3. Зафиксировать URL, commit/tag, дату проверки, лицензии кода/весов/данных, runtime, RAM/VRAM, сеть и maintenance signals.
4. Различать подтверждённые факты, гипотезы и неизвестное; проверять точность названия проекта.
5. Сравнить качество, latency, RAM, complexity, privacy, license и maintenance.
6. Ответить в формате: вопрос → источники → факты → неопределённости → рекомендация → план интеграции → тесты → риски → rollback.
7. Не называть компонент установленным без кода/deployment evidence; не копировать большие объёмы чужого кода или документации без необходимости.

## Definition of Done

Каждое изменение имеет acceptance criteria, минимальный diff, тесты happy/error/security paths, проверенные источники/лицензии, актуальную документацию, CI и rollback. Live claims подтверждаются отдельно. Итоговый отчёт сообщает commit/PR, изменённые файлы, тесты, доказанный статус, ограничения и следующий шаг.

## Краткая инструкция агенту

Ты работаешь над aLandi в `DorpNay/skills-github-pages`. Сначала прочитай этот мастер-контекст и связанные документы, затем исследуй актуальный код. Одобренная идея не равна реализованной функции. Работай небольшими проверяемыми шагами, используй bounded roles, provenance, evals и rollback. Не раскрывай секреты и не выполняй действия с побочными эффектами без разрешения. В финале сообщай, что реально изменено, что проверено, какие ограничения остались и как откатить изменение.

## Актуальная контрольная точка — 2026-11-02

### Landing UI V2.0

- PR #131 — единственная активная ветка реализации V2 UI; PR остаётся открытым и не объединённым. V1 в main сохраняется как стабильная база.
- Объём UI не ограничивается требованиями 8.1–8.17: все актуальные незакрытые требования из разделов 1–7 объединены с 8.1–8.17 в едином реестре раздела 8.0 docs/V1_UI_FINALIZATION_RU.md. Старые закрытые, неактуальные и заменённые пункты не открывать заново.
- docs/LANDING_UX_POLISH_BACKLOG_RU.md — краткий mirror, а не отдельный backlog. docs/LANDING_UI_V2_IMPLEMENTATION_RU.md — технический журнал изменений и evidence.
- Latest UI source checkpoint: 9aa74853478a6a680cdd36ab0f84c851721405a4; последующие PR HEAD коммиты продвигают документацию и CI-гигиену. На точном текущем HEAD нет подтверждённого Quality/Chromium результата. Предыдущий Quality #1126 (101 passed / 18 failed) относится к старому SHA и не доказывает состояние текущего кода.
- Клиент остаётся статическим HTML/CSS/JavaScript + Jekyll/GitHub Pages. Browser runtime/styles вынесены в assets/js/app.js, assets/css/app.css и assets/css/landing.css; framework/build migration не выполнялась.
- Graphify Code-Only Pilot обновлён так, чтобы отслеживать вынесенные assets/js/**/*.js, assets/css/**/*.css и landing/**/*.html. Новый exact-head граф/артефакт ещё не подтверждён; исторические метрики Graphify не выдавать за актуальный граф текущей ветки.
- PR #131 расходится с main на четыре коммита; все четыре main-side изменения затрагивают только docs/V1_UI_FINALIZATION_RU.md. GitHub сообщает mergeable_state=dirty. Не выполнять rebase/sync без отдельного анализа и сохранения обеих версий единого UI checklist.

### GitHub repository hygiene

- Подготовлен docs/REPOSITORY_HYGIENE_RU.md на основе официальных рекомендаций GitHub. Снимок: 126 веток, 9 открытых PR, 100 закрытых PR.
- 19 веток закрытых, но не объединённых PR и 10 не связанных с PR веток содержат уникальные коммиты; их сохраняем. Пять веток с ahead=0 — только кандидаты на удаление после ручного подтверждения владельцем. Удаление не выполнялось: текущая GitHub-интеграция не предоставляет branch-delete action.
- SECURITY.md добавлен в PR #131/#132, но ещё не находится в main. CODEOWNERS и Dependabot config не добавлялись без подтверждённого независимого reviewer и завершения текущего dependency-lock workstream. Account-level security settings и classic branch protection остаются непроверенными через интеграцию.
- Никакие ветки, файлы, Actions artifacts или настройки репозитория не удалялись и не менялись; PR не сливался, deployment не выполнялся.



### Notification queue — 2026-11-02

- PR #131 HEAD `fed3137bae2355629a976515719f498940ad8601`: existing toast extended with FIFO queue, duplicate suppression, urgency-based duration, hover/focus/hidden-tab pause and polite/assertive ARIA semantics.
- Focused Playwright assertions were added but not run. No exact-head workflow run or status was returned. This is partial 8.19 work; durable operation state/IDs and persistent error recovery remain open.
