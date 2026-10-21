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
- **Решение:** `GET /admin/runtime` читает документированный `/api/ps` и отдаёт resident model inventory и advisory budget. Поля `kv_cache_usage_mb` остаётся `null`, `automatic_eviction_performed` — `false`.
- **Отклонено:** вызов несуществующего `/api/evict` с conversation ID. Документированный `/api/ps` не предоставляет per-conversation KV usage/eviction.
- **Альтернативы:** concurrency/context limits; monitor RSS/OOM; при отсутствии активных запросов оператор может выгрузить неиспользуемую модель документированным `keep_alive: 0` или `ollama stop`.
- **Acceptance:** runtime inventory честно отражает /api/ps; тесты malformed payload and budget; load test на хосте до изменения контекстных лимитов.
- **Rollback:** endpoint read-only; он не меняет модель и не разрушает сессии.
- **Связи:** `gateway/kv_budget.py`, `/admin/runtime`, official [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md), [FAQ](https://github.com/ollama/ollama/blob/main/docs/faq.mdx).

## D-003 — SQLite FTS5 + lexical concept graph как начальный retrieval baseline

- **Статус:** Accepted for prototype; embeddings, PPR and LLM reranking deferred.
- **Проблема:** retrieval на ограниченном VPS без дорогой индексации.
- **Решение:** `gateway/rag/lazy_graph_rag.py` индексирует chunks в FTS5, извлекает lexical concepts без LLM и объединяет текстовые/graph кандидаты в пределах scope. Source URI и page metadata сохраняются для цитирования.
- **Важно:** это не точная реализация Microsoft LazyGraphRAG. Upstream предлагает staged retrieval с отложенными LLM relevance tests; текущий code — более простой baseline.
- **Acceptance:** сравнить FTS5-only с lexical graph на labelled golden set (≥50 queries); Recall@5/MRR/citation correctness/latency/RSS; scope leakage tests; upsert/delete correctness.
- **Rollback:** установить `ALANDI_RAG_ENABLED=false); index можно пересоздать из оригинальных разрешённых документов.
- **Связи:** `gateway/rag/lazy_graph_rag.py`, `POST /v1/rag/ingest`, `POST /v1/rag/retrieve`, [Microsoft LazyGraphRAG](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/).

## D-004 — Server-side OAuth vault groundwork, no premature Drive integration

- **Статус:** Accepted for prototype; full OAuth and UI deferred.
- **Проблема:** не хранить refresh tokens в browser localStorage или plaintext SQLite.
- **Решение:** `gateway/security/oauth_vault.py` шифрует access/refresh tokens Fernet, хранит state hash, verifier в encrypted form, использует PKCE S256 и одноразовое TTL-limited состояние.
- **Ограничения:** helper пока не подключён к OAuth endpoints или UI. Encryption key хранится вне Git и должен быть защищён отдельно от базы. Один gateway Bearer key не обеспечивает multi-user isolation.
- **Acceptance:** expired/replay/state mismatch/DB-only exposure/corrupted vault/no-refresh-token/rotation/revoke tests; отсутствие тестовых секретов в logs, API bodies, URLs и plaintext DB. Должны быть review redirect URI, scopes, OAuth callback and revocation before live use.
- **Rollback:** не подключать OAuth endpoints; удалить OAuth vault DB/credentials с соблюдением retention, revoke grant у provider.
- **Связи:** `gateway/security/oauth_vault.py`, [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html), [Google OAuth web-server flow](https://developers.google.com/identity/protocols/oauth2/web-server).

## D-005 — Bounded JSON Patch для conversation-scoped memory

- **Статус:** Accepted for prototype; browser sync and wider scopes deferred.
- **Проблема:** не передавать всю память после каждого изменения.
- **Решение:** `gateway/memory/delta_sync.py` реализует ограниченное подмножество JSON Patch, SQLite state/delta history, revision checks and SHA-256 digest. API `GET /v1/memory/state/{conversation_id}` and `POST /v1/memory/delta` защищены Bearer auth и отключены по умолчанию.
- **Границы:** пока conversation-only; project/global/profile scopes, bitemporal facts, export/delete and browser integration отсутствуют. Патчи используют байты, не объявляют экономию токенов без tokenizer/eval; массивы могут заменяться целиком.
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

## Global release rules

- Feature flag выключен до прохождения eval и review.
- Код и документация должны описывать текущий фактический уровень, не целевое обещание.
- Не проводить destructive runtime changes автоматическим middleware.
- Не публиковать API keys, OAuth secrets, refresh tokens или prompts в логах.
- Любой live activation требует проверки на целевом VPS и отдельного rollback plan.
