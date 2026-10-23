# aLandi — мастер-контекст проекта

Редакция: 2026-10-21. Документ для разработчиков и ИИ-агентов, включая роль @Поиск.

> Важно: одобрение идеи не означает, что она уже реализована. Проверяйте код, тесты, CI и live-поведение прежде, чем утверждать обратное.

## Источник истины

- Репозиторий: https://github.com/DorpNay/skills-github-pages
- Публичный клиент: https://dorpnay.github.io/skills-github-pages/
- Установка и rollback: [ALANDI_IMPLEMENTATION_GUIDE_RU.md](ALANDI_IMPLEMENTATION_GUIDE_RU.md)
- Агентные роли и память: [ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md](ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md)
- Техники и источники: [TECHNIQUE_REGISTER_RU.md](TECHNIQUE_REGISTER_RU.md)
- Технологический аудит: [TECHNOLOGY_AUDIT_2026-10-21_RU.md](TECHNOLOGY_AUDIT_2026-10-21_RU.md)
- Шесть инженерных пластов и критерии eval: [SIX_LAYER_ENGINEERING_RU.md](SIX_LAYER_ENGINEERING_RU.md)
- Реестр архитектурных решений D-001–D-006: [DECISIONS.md](../DECISIONS.md)
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
