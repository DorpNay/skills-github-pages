# aLandi — инженерные решения

**Обновлено:** 2026-10-21.  
**Источник:** шесть слоёв, предложенные владельцем проекта. Эти записи фиксируют принятое техническое направление после проверки upstream и ограничений текущего gateway.

Статусы: **Accepted for prototype** = код/проверки добавляются, но feature flag остаётся выключенным; **Deferred** = ждёт данных или внешней конфигурации; **Rejected as specified** = предложенный контракт неверен/неподдержан, при этом полезная цель может быть достигнута иначе.

## D-001 — Fast routing вместо небезопасного auto-accept draft

- **Статус:** Accepted for prototype; draft-model cascade deferred.
- **Проблема:** снизить latency/стоимость простых запросов.
- **Решение:** уже добавлен opt-in exact-template fast path в `gateway/routing.py`. Он может short-circuit только короткие фразы из allowlist и исключает streaming, tools, structured output и multi-turn context. Все общие/сложные запросы остаются на main model.
- **Отклонено:** принимать произвольный draft при среднем score Boolean-проверок >=0.85. Этот score не калиброван и не доказывает factual correctness. Draft→verify cascade также не является speculative decoding и может повысить суммарную задержку.
- **Evidence:** upstream Qwen2.5 model listing и текущий target 8GB RAM; собственные latency/quality evals пока не собраны.
- **Acceptance:** false short-circuit в негативном golden set = 0; сравнение main-only и candidate cascade на одном target VPS, p50/p95, TTFT, total latency, RSS, tokens, task quality.
- **Rollback/kill:** выключить `ALANDI_FAST_ROUTING_ENABLED`; модель draft не pull/load до решения по evals.
- **Owner:** aLandi project owner / agent implementer.
- **Связи:** `gateway/routing.py`, `gateway/tests/test_six_layers.py`, [six-layer spec](docs/SIX_LAYER_ENGINEERING_RU.md).

## D-002 — Не имитировать per-conversation KV eviction

- **Статус:** Accepted for prototype monitoring; proposed eviction API rejected as specified.
- **Проблема:** предотвращать OOM на ограниченной памяти.
- **Решение:** `GET /admin/runtime` отдаёт явно названные поля `/api/ps` плюс best-effort текущий/peak RSS gateway/Ollama из Linux procfs через `gateway/host_metrics.py`. Он не измеряет KV usage по беседе и не выполняет eviction. Поля `kv_cache_usage_mb` остаётся `null`, `automatic_eviction_performed` — `false`.
- **Отклонено:** вызов несуществующего `/api/evict` с conversation ID. Документированный `/api/ps` не предоставляет per-conversation KV usage/eviction.
- **Альтернативы:** concurrency/context limits; monitor RSS/OOM; при отсутствии активных запросов оператор может выгрузить неиспользуемую модель документированным `keep_alive: 0` или `ollama stop`.
- **Acceptance:** inventory честно отражает `/api/ps`; procfs current/peak RSS корректно читается там, где доступны права; недоступные данные возвращаются как null; malformed payload tests; target-host load test before context-limit changes.
- **Rollback:** endpoint read-only; он не меняет модель и не разрушает сессии.
- **Связи:** `gateway/kv_budget.py`, `/admin/runtime`, official [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md), [FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.mdx).

## D-003 — SQLite FTS5 + lexical concept graph как начальный retrieval baseline

- **Статус:** Accepted for prototype; embeddings, PPR and LLM reranking deferred.
- **Проблема:** retrieval на ограниченном VPS без дорогой индексации.
- **Решение:** `gateway/rag/lazy_graph_rag.py` индексирует chunks в FTS5, извлекает lexical concepts без LLM и объединяет текстовые/graph кандидаты в пределах scope. Source URI и page metadata сохраняются для цитирования.
- **Важно:** это не точная реализация Microsoft LazyGraphRAG. Upstream предлагает staged retrieval с отложенными LLM relevance tests; текущий code — более простой baseline.
- **Acceptance:** сравнить FTS5-only с lexical graph на labelled golden set (≥50 queries); Recall@5/MRR/citation correctness/latency/RSS; scope leakage tests; upsert/delete correctness.
- **Rollback:** установить `ALANDI_RAG_ENABLED=false`; индекс можно пересоздать из оригинальных разрешённых документов.
- **Связи:** `gateway/rag/lazy_graph_rag.py`, `POST /v1/rag/ingest`, `POST /v1/rag/retrieve`, [Microsoft LazyGraphRAG](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/).

## D-004 — Server-side OAuth vault groundwork, no premature Drive integration

- **Статус:** Accepted for opt-in backend prototype; live credentials and UI deferred.
- **Проблема:** не хранить refresh tokens в browser localStorage или plaintext SQLite.
- **Решение:** `gateway/security/oauth_vault.py` шифрует access/refresh tokens Fernet, хранит state hash, verifier в encrypted form, использует PKCE S256 и одноразовое TTL-limited состояние. `gateway/security/google_oauth.py` подключён к FastAPI как opt-in Authorization Code/PKCE initiate/callback/status/refresh/revoke endpoints.
- **Ограничения:** реальные Google credentials/domain callback не заданы, live OAuth не проверен; Google Picker, UI и Drive file retrieval ещё не интегрированы. Все endpoints остаются выключенными, пока `OAUTH_ENABLED=false`. Encryption key хранится вне Git и должен быть защищён отдельно от базы. Один gateway Bearer key не обеспечивает multi-user isolation.
- **Acceptance:** expired/replay/state mismatch/DB-only exposure/corrupted vault/no-refresh-token/rotation/revoke tests; отсутствие тестовых секретов в logs, API bodies, URLs и plaintext DB. Должны быть review redirect URI, scopes, OAuth callback and revocation before live use.
- **Rollback:** установить `OAUTH_ENABLED=false`; для полного отключения отозвать grant у Google и удалить зашифрованные credentials/DB с соблюдением retention policy.
- **Связи:** `gateway/security/oauth_vault.py`, [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html), [Google OAuth web-server flow](https://developers.google.com/identity/protocols/oauth2/web-server).

## D-005 — Bounded JSON Patch для conversation-scoped memory

- **Статус:** Accepted for prototype; browser sync and wider scopes deferred.
- **Проблема:** не передавать всю память после каждого изменения.
- **Решение:** `gateway/memory/delta_sync.py` реализует ограниченное подмножество JSON Patch, SQLite state/delta history, revision checks and SHA-256 digest. API `GET /v1/memory/state/{conversation_id}` and `POST /v1/memory/delta` защищены Bearer auth и отключены по умолчанию.
- **Границы:** пока conversation-only; project/global/profile scopes, bitemporal facts, export/delete and browser integration отсутствуют. Размеры сравниваются в байтах, не объявляются как экономия токенов без tokenizer/eval. Pure append в массиве использует компактный `add /-`, suffix removal — операции `remove` с конца; произвольные изменения массива могут заменить его целиком.
- **Acceptance:** state round-trip = 100%; stale revision -> 409; out-of-scope/root mutation/invalid JSON Pointer/oversized patch reject; benchmark bytes/latency/DB growth; UI conflict recovery.
- **Rollback:** `ALANDI_MEMORY_SYNC_ENABLED=false`; перед выключением/export сохранять нужный state согласно retention policy.
- **Связи:** `gateway/memory/delta_sync.py`, [RFC 6902](https://www.rfc-editor.org/rfc/rfc6902.html).

## D-006 — Deterministic routing baseline first; embeddings require measured gain

- **Статус:** Accepted for prototype; embedding runtime deferred.
- **Проблема:** сократить ненужные LLM calls.
- **Решение:** узкий rule/phrase intent baseline уже существует; только exact low-risk template может bypass main model. Keyword hints на tool/research не grant privileges and require verification.
- **Отклонено:** использовать embedding cosine similarity как calibrated confidence или позволить router авторизовывать инструменты.
- **Кандидаты:** FastEmbed модели из актуального supported registry; оценить RU/EN/TH coverage, model startup/RAM, latency и confusion matrix. Не предполагать, что все модели одинаково многоязычны.
- **Acceptance:** labelled test set ≥100 queries; accuracy and per-class confusion matrix, false simple route rate, cold/warm latency, token/call savings. Ambiguous intents fall back to main model.
- **Rollback:** `ALANDI_FAST_ROUTING_ENABLED=false`; default remains false.
- **Связи:** `gateway/routing.py`, [FastEmbed](https://github.com/qdrant/fastembed).

## D-007 — Deterministic artifact fingerprint and provenance triad

- **Статус:** Accepted for governance prototype; no cryptographic attestation or live artifact approval.
- **Проблема:** сделать изменения исходников и лицензий заметными в CI, не включая секреты и generated artifacts.
- **Решение:** `scripts/manifest_state.py` считает детерминированный SHA-256 по сортированным путям и SHA-256 каждого файла; главный `index.md` входит в список. `scripts/check_intel_triad.py` отклоняет принятые записи без явного HTTPS URL, идентификатора лицензии конкретного артефакта и URL источника утверждения.
- **Ограничения:** state hash не является подписью/attestation и не доказывает безопасность; triad gate не проверяет DNS, доступность URL, текст лицензии, checksum весов или право коммерческого распространения. `ship: false` остаётся обязательным до ручной проверки и точного SHA-256.
- **Acceptance:** тесты детерминизма, изменения hash при изменении `index.md`, исключение секретных/generated paths, отказ для placeholder domain и отсутствующего claim URL.
- **Rollback:** отключить gate только отдельным review; не использовать manifest hash как единственную гарантию целостности.
- **Связи:** `scripts/manifest_state.py`, `scripts/check_intel_triad.py`, `intel/RECON.yaml`, `gateway/tests/test_v016_foundation.py`, EV-STATE-001, EV-INTEL-001.

## D-008 — Risk-aware router is a local policy prototype, not an active runtime router

- **Статус:** Accepted for prototype; runtime integration and regret evaluation deferred.
- **Проблема:** выбирать простой/поисковый/сложный маршрут по confidence, context cost, remaining budget and risk without granting hidden privileges.
- **Решение:** `router/policy.py` validates bounded inputs, blocks unconfirmed destructive actions, exposes explicit notice/slow-escalation metadata and never returns a cloud route.
- **Ограничения:** модуль пока не подключён к реальному gateway request path; текущие thresholds — policy fixtures, не измеренная оптимизация. No route-regret claim without oracle-labelled set.
- **Acceptance:** deterministic tests pass; then wire via a reviewed adapter, build >=200 labelled RU/EN cases, measure regret and false-fast-route rate, keep feature disabled until review.
- **Rollback:** leave module unused; existing runtime route remains authoritative until a separately tested integration PR.
- **Связи:** `router/policy.py`, `latency/budget_v2.yaml`, EV-ROUTER-001.

## D-009 — Keyless public-source fallback for web_search

- **Статус:** Accepted for prototype; latest browser E2E pending.
- **Проблема:** не прекращать исследование только потому, что Tavily не настроен, вернул ошибку или недоступен из браузера.
- **Решение:** `web_search` переходит к ограниченному набору открытых источников; отдельные недоступные источники пропускаются, а в результат попадают только реальные ответы с URL.
- **Ограничения:** браузерные API зависят от CORS, доступности и актуальности; отсутствие результатов остаётся явной ошибкой. Никаких выдуманных ссылок и неограниченных повторов.
- **Acceptance:** E2E без Tavily key подтверждает обращения к открытым источникам, отсутствие Tavily request, наличие URL в tool result и bounded tool rounds.
- **Rollback:** вернуть `performTavilySearch` к явной ошибке без fallback; `public_knowledge_search` остаётся отдельным инструментом.
- **Связи:** `index.md`, `tests/e2e/app.spec.mjs`, EV-SEARCH-001.

## D-010 — Scoped FTS5 retrieval for the memory graph; no crypto-erasure claims

- **Status:** Accepted for prototype; public UI/API wiring and physical-erasure SLA deferred.
- **Problem:** Search the existing SQLite memory graph without a new embedding/vector dependency or crossing chat/project/global boundaries.
- **Decision:** Use an external-content FTS5 index with insert/update/delete triggers. `search_nodes()` bounds and quotes literal terms, filters exact `(scope, scope_id)`, defaults to confirmed nodes and supports temporal filters. Recursive deletion updates FTS through delete triggers.
- **Deletion boundary:** `PRAGMA secure_delete=ON` applies to ordinary SQLite b-tree pages; FTS5 `secure-delete=1` is enabled only with SQLite >= 3.42.0 and a verified setting. These are defense-in-depth settings, not cryptographic erasure and do not clear external copies, WAL/journal files, snapshots or backups.
- **Acceptance:** CI covers scope isolation, confirmed-only defaults, query parsing, index/delete consistency, legacy index rebuild and capability-gated secure-delete.
- **Alternatives rejected:** embeddings before a representative quality/performance bake-off; rebuilding the entire index on every startup.
- **Reversal cost:** medium; schema and query adapter can be reverted, index rebuilt from canonical nodes.
- **Owner:** aLandi project owner / agent implementer.
- **Kill criteria:** stale scoped results, unavailable FTS5, or resource cost outside the target profile. Disable search while retaining canonical rows and scoped list APIs.
- **Rollback:** revert query/triggers in a reviewed migration; preserve canonical memory nodes.
- **Links:** `gateway/memory/manager.py`, `gateway/memory/schema.sql`, `gateway/tests/test_coder_packet.py`, EV-MEM-005.

## D-011 — Authenticated opt-in API for the structured memory graph

- **Status:** Accepted for single-owner gateway prototype; disabled by default and not yet wired to the static-site project memory UI.
- **Problem:** the graph and FTS5 search had no authenticated API surface, so only direct module users could create, review, search or delete facts.
- **Decision:** expose bounded Bearer-authenticated routes for candidate creation, scope-filtered listing/search, explicit relation creation, owner review and recursive deletion. Reject unknown JSON keys, use no-store responses, and bound request bodies.
- **Truth/lifecycle rule:** API-created facts always start as `candidate`; only the explicit review route may set `confirmed` or `rejected`, with an audit code. Superseded/rejected nodes are immutable through review.
- **Privacy boundary:** `ALANDI_MEMORY_GRAPH_ENABLED=false` by default. Global memory is behind a second server flag and a per-request `global_opt_in=true`. The service remains a single-owner personal gateway, not a multi-tenant permission system; do not reuse one bearer key across users.
- **Rollback:** keep the graph flag off or revert the route/config change. The existing conversation-delta and RAG stores remain separate databases and contracts.
- **Acceptance:** tests prove disabled-by-default behaviour, Bearer auth, candidate-first lifecycle, confirmed-only default search, scope isolation, relation/delete propagation and global double opt-in.
- **Links:** `gateway/app.py`, `gateway/memory/manager.py`, `gateway/tests/test_app.py`, EV-MEM-006.

## D-012 — cPocket cleanup is bounded and failure-resilient

- **Status:** Accepted for voice prototype; there is no live microphone/native audio runtime.
- **Problem:** one cleanup callback raising `RuntimeError` or `CancelledError` could prevent later handlers from releasing their resources; registrations had no upper bound.
- **Decision:** cap one lease at 128 cleanup callbacks, execute rollback handlers in reverse order, record only exception class names, and continue after per-handler exceptions including `CancelledError`. Preserve idempotent rollback and shield cleanup from caller cancellation.
- **Acceptance:** deterministic regression tests cover reverse-order execution, mixed cleanup failures, bounded registration, concurrent rollback and caller cancellation.
- **Remaining evidence:** current-head CI, followed later by a target-host resource/file-descriptor soak and integration with real audio adapters.
- **Rollback:** revert this helper change or leave voice callers disabled.

## Global release rules

- Feature flag выключен до прохождения eval и review.
- Код и документация должны описывать текущий фактический уровень, не целевое обещание.
- Не проводить destructive runtime changes автоматическим middleware.
- Не публиковать API keys, OAuth secrets, refresh tokens или prompts в логах.
- Любой live activation требует проверки на целевом VPS и отдельного rollback plan.


## D-013 — Browser-to-server project memory bridge is explicit and candidate-first

- **Status:** Merged in PR #29 at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; PR-head and post-merge Quality/Chromium/provenance/Pages checks passed. Live gateway activation remains pending.
- **Decision:** browser-local project facts remain local until the owner clicks “Send local facts”. Upload creates server-side candidate nodes; UI can list, confirm/reject and delete them. No automatic migration or global-memory write occurs.
- **Retrieval gate:** server search runs only when the current chat has both project memory and server project memory opted in. Query scope is exactly `scope=project, scope_id=currentProject.id`; only `confirmed` nodes enter the prompt. Retrieval is capped at six facts and 1200 total characters; manual uploads are bounded to 100 new candidates per click, query up to 100 recent server nodes (the API limit), and keep a bounded local source-ID ledger for idempotency across batches. A failed lookup degrades to local-only context and is shown in the UI.
- **Activation:** the browser uses the configured aLandi gateway URL ending in `/v1` and the aLandi bearer key. Gateway requires `ALANDI_MEMORY_GRAPH_ENABLED=true`; keep `ALANDI_GLOBAL_MEMORY_ENABLED=false`. CORS must allow the Pages origin. This is still a single-owner gateway, not multi-user ACL.
- **Deletion:** deleting a browser project does not silently delete server facts. Delete server facts explicitly in the memory panel before deleting the local project if they are no longer needed.
- **Acceptance:** Chromium mock proves no auto-upload, candidate-first upload, review, no context inclusion when either toggle is off, and scoped retrieval with both on. Live gateway proof is separate.
- **Rollback:** turn off the per-chat server-memory toggle or revert the UI bridge; leave the graph flag off if not needed.
- **Links:** `index.md`, `gateway/app.py`, `gateway/memory/manager.py`, EV-MEM-007.

## D-014 — Free-first stack and local model autonomy

- **Status:** accepted direction; small-model dispatch and image generation are not yet implemented.
- **Decision:** month-one development must not provision billable resources automatically. Use GitHub Pages, already-owned hardware and local Ollama where available; public free APIs are optional, quota-bound and disclose data to the selected provider.
- **Agent split:** keep one main model for planning, difficult reasoning and synthesis. Evaluate one small helper for bounded extraction, routing hints, compression and candidate-memory extraction. Do not run dozens of concurrent model processes or load multiple weights on an 8 GB host without measured benefit.
- **Model autonomy:** do not add a hidden refusal layer that blocks otherwise allowed requests. Local model behavior depends on the selected checkpoint; external providers enforce their own terms and filters. No model can be promised to never refuse.
- **Image generation:** not a working feature in the current browser UI. Add only after a real local/provider backend, exact artifact/license, VRAM/runtime fit and end-to-end image-return test are selected.
- **Upgrade gate:** compare free/local baseline and paid target on identical tasks: p50/p95, peak RAM, quality, quotas and expected monthly cost. Preserve the OpenAI-compatible gateway contract and explicit endpoint/model changes.
