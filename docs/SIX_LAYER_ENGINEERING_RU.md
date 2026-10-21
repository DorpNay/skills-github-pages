# Шесть инженерных пластов aLandi: решение, реализация и план EVAL

**Редакция:** 21 октября 2026 г.  
**Статус:** первые bounded-прототипы добавлены в gateway; feature flags по умолчанию выключены. Это не утверждение о deploy на VPS или о live-использовании.

## Главный вывод

Идеи из исходного предложения полезны, но несколько контрактов нельзя переносить буквально:

1. Спекулятивная генерация, speculative decoding и последовательный draft→verify cascade — разные техники. Лёгкая модель не умеет доказать истинность собственного ответа по одному числу confidence.
2. Ollama `GET /api/ps` выдаёт инвентарь загруженных моделей и их resident size. Он не является интерфейсом KV-cache usage и не позволяет удалить KV-состояние по conversation ID. Неизвестный endpoint `/api/evict` не используется.
3. LazyGraphRAG от Microsoft — staged/iterative retrieval, который откладывает LLM-проверки и регулирует стоимость budget параметром relevance test budget. «NER + embeddings + три итерации PPR» — самостоятельный упрощённый алгоритм, а не точная реализация LazyGraphRAG.
4. OAuth encryption защищает данные в SQLite только при условии, что ключ хранится отдельно и не скомпрометирован. Нельзя обещать «0% утечек» или считать encrypt-at-rest заменой разрешениям, минимальным scope, PKCE и безопасному lifecycle токенов.
5. JSON Patch сокращает передачу только когда клиент действительно отправляет patch вместо полного state. Сам по себе подсчёт токенов не гарантирует экономию: нужны измерения на реальном golden set.
6. Embedding similarity не равна вероятности корректности intent. До покупки дополнительной модели предпочтителен дешёвый deterministic baseline и проверяемая граница, за которой всё идёт в main model.

## Статусы реализации

| Пласт | Уже внесено в код | Пока отсутствует / выключено |
|---|---|---|
| 1. Draft routing | Узкий exact-template fast path и консервативный IntentRouter в `gateway/routing.py`; интеграция за `ALANDI_FAST_ROUTING_ENABLED=false` | Draft model cascade, Qwen2.5 отдельным постоянно загруженным процессом, quality verifier; эти части не следует включать без измерений |
| 2. KV/cache memory budget | `GET /admin/runtime` и `gateway/kv_budget.py`: truthful inventory и advisory budget | Per-conversation KV telemetry/eviction — отсутствует в документированном Ollama API; автоматическая eviction сознательно не реализована |
| 3. LazyGraphRAG | `gateway/rag/lazy_graph_rag.py`: SQLite FTS5 + lexical concept graph, ссылки на источник/страницу и scope isolation | Embeddings, полноценный entity extraction/PPR, LLM reranker, автоматическое извлечение файлов/документов |
| 4. OAuth | `gateway/security/oauth_vault.py` + `gateway/security/google_oauth.py`: backend Authorization Code/PKCE endpoints, Fernet vault, hashed single-use state, TTL; OAuth flag off by default | Google credentials, actual domain callback, Drive Picker, browser UI, and file-content API are not configured/integrated |
| 5. Delta sync | `gateway/memory/delta_sync.py`, `GET /v1/memory/state/{conversation_id}`, `POST /v1/memory/delta` с optimistic revision check | Browser UI ещё не использует gateway memory API; scope пока только conversation и gateway остаётся single-user |
| 6. Semantic router | Детеминированный intent baseline и exact-phrase short-circuit, без дополнительного runtime | Embedding backend/FastEmbed, обученный router и его threshold calibration; не включать только на основании cosine similarity |

Все новые режимы памяти, RAG и шаблонной маршрутизации выключены по умолчанию. Ключевые флаги описаны в `gateway/.env.example`. Не меняйте их на VPS, пока не пройдены контрактные тесты и локальные evals.

---

## Пласт 1 — Speculative Draft Routing / быстрый маршрут

### Принятое решение

Не использовать confidence как среднее пяти boolean-эвристик и не возвращать произвольный draft только потому, что score >= 0.85. Length, format, keywords и schema checks проверяют отдельные свойства, но не истинность фактов. Cosine similarity тоже не является калиброванной вероятностью правильного ответа.

Первый внедрённый шаг — конечный allowlist точных приветствий, благодарностей и прощаний в `gateway/routing.py`. Это единственный fast path, который может пропустить main model; только если:
- в запросе одна conversational user message без истории;
- текстовая реплика короткая и после нормализации точно совпадает с allowlist;
- отсутствуют streaming, tools, functions и response_format;
- ответ шаблонный и не содержит предметных фактических утверждений.

Остальные запросы идут в основную модель. Для tool calls и research router лишь помечает намерение как hint; выполнять инструмент или возвращать ответ напрямую он не разрешает.

### Почему пока не запускаем Qwen2.5-1.5B в каскаде

Ollama публикует `qwen2.5:1.5b-instruct` с приблизительным размером файла около 986 MB, но вес на диске не равен peak RSS. Два одновременно загруженных model runtimes плюс KV/context memory могут не уложиться в реальный RAM budget 8 GB. Если draft-модель не остаётся в памяти, холодная загрузка может поглотить предполагаемый выигрыш. Более того, generate draft → call main model не обязательно экономит tokens или latency.

Qwen2.5 остаётся кандидатом для сравнения, не production-зависимостью. Если тестировать draft cascade, измерять оба сценария на одной машине: main-only против draft→verify, включая холодный/тёплый запуск, фактические RSS, TTFT/TTFT p95, total latency, tokens и качество. Не сравнивать чужие непроверенные latency estimates.

### Gate для следующего этапа

- Golden set >=200 запросов, сбалансированный по языку и сложности.
- False short-circuit rate на сложных/опасных запросах = 0 в обязательных security fixtures.
- Разница качества по judge/ground truth <=5% как target; >10% — kill.
- Требуемое ускорение должно быть подтверждено на целевом VPS по p50 и p95, а не выдуманным `latency_ms`.
- Draft model включается только отдельным флагом и после проверки, что одновременная резидентность не вызывает unload thrashing/OOM.

## Пласт 2 — KV cache eviction / ресурсный бюджет

### Принятое решение

`GET /admin/runtime` обращается к Ollama `GET /api/ps` и возвращает:
- загруженные модели;
- `size`/resident footprint, сообщённый Ollama;
- настроенный advisory budget;
- явные поля `kv_cache_usage_mb: null`, `kv_cache_api_supported: false`;
- `automatic_eviction_performed: false`.

Это намеренно не называет размер модели «KV cache». Конкретная беседа не имеет поддерживаемого API идентификатора, по которому можно безопасно выселить только её KV-кэш. Gateway передаёт историю в новом chat completion, поэтому примитив «LRU по conversation ID → /api/evict» не работает как заявлено.

### Правильная политика

- Базовый deployment: concurrency = 1; реальный контекст ограничен конфигурацией Ollama и gateway.
- Собирать systemd/container RSS, OOM, latency, model inventory и request queue отдельно; `/api/ps` не заменяет системный мониторинг.
- При превышении бюджета — сигнал/отчёт оператору. Разрешённая мера после проверки отсутствия активных запросов: уменьшить context/parallelism или unload неиспользуемую модель документированным `keep_alive: 0`/командой `ollama stop`.
- Автоматическое завершение запросов, удаление памяти или остановка модели из middleware не включены.

### Gate

Стресс-набор не менее 50–200 последовательных задач, несколько длин контекста и worst-case RAG. Измерять peak RSS, swap, OOM, p95 latency и completion rate. Критерий «RSS < 6.5 GB» не использовать без общей памяти хоста, свободной памяти ОС и запасов на gateway/SQLite.

## Пласт 3 — LazyGraphRAG как retrieval-путь

### Что реализовано сейчас

`gateway/rag/lazy_graph_rag.py` даёт базовый low-footprint engine:
1. документы/chunks привязываются к scope, scope ID и source URI;
2. индексируются FTS5, страница и оригинальный источник сохраняются;
3. извлекаются лексические концепты из текста без LLM на этапе indexing;
4. кандидаты от FTS5 и shared concept graph объединяются;
5. возвращаются chunks с source URI, page number и retrieval path.

Это **SQLite FTS5 + lexical concept graph baseline**, не точная реплика Microsoft LazyGraphRAG. Он не использует embeddings, отдельный vector index или LLM reranker; PPR не реализован. У такого начального этапа меньше зависимостей и RAM pressure.

### Следующий исследовательский цикл

1. Golden set: не менее 50 вопросов с документными ground-truth chunk IDs, включая multi-hop и «сводные» вопросы.
2. Сравнить FTS5-only и FTS5+graph, отдельно считать Recall@5, MRR/nDCG, citation correctness, p50/p95 и peak RSS.
3. Проверить scope isolation, повторную индексацию и удаление источника.
4. Если local baseline не проходит порог, добавить embedding retriever как optional strategy — только после оценки RAM/latency.
5. LLM reranking вызывать только для ограниченного числа кандидатов, если eval показывает выигрыш выше затрат.

Целевые Recall@5 0.75 и baseline 0.65 из исходной заметки — **гипотезы**, пока не получены собственные labelled results. Не указывать их как измеренные значения.

## Пласт 4 — OAuth proxy и encrypted token vault

### Что реализовано

`gateway/security/oauth_vault.py`:
- шифрует access/refresh tokens с Fernet;
- хранит hash случайного state вместо исходного значения;
- хранит verifier в зашифрованном виде;
- создаёт PKCE challenge методом S256;
- одноразово поглощает state с TTL;
- допускает сохранение/чтение/удаление токенов только из backend Python-кода.

В `gateway/requirements.txt` добавлена фиксированная зависимость `cryptography`. Сам vault не включён в API и пока не означает наличие Google Drive integration.

### Security contract перед production-включением

- Google Authorization Code flow, PKCE S256, точный server-configured redirect URI, state transaction с TTL и однократным callback.
- Scope минимальный: планировать `drive.file` для файлов, специально открытых/выбранных пользователем, и проверить требования Picker до реализации.
- Access/refresh tokens остаются на сервере и никогда не возвращаются клиенту, не попадают в query string или логи.
- Refresh rotation: если provider выдаёт новый refresh token — атомарно заменить encrypted value; если refresh token отсутствует в refresh response — сохранить старый.
- Revoke должен вызвать официальный endpoint, затем удалить local credentials и связанные данные, согласно политике удаления.
- Ключ Fernet хранить вне Git, с владельцем и file mode 600; не держать рядом с SQLite в общедоступном каталоге. Ротация требует процедуры decrypt→reencrypt и backup, не простого замещения ключа.
- Одна gateway Bearer key сейчас — личный однопользовательский прототип. Нельзя считать `user_id` из тела авторизацией; multi-user потребует настоящих principals, owner-bound states и изоляции данных.

### Gate

Расширить тесты wrong/expired/replayed state, PKCE verifier mismatch, OAuth error response, no-refresh-token response, expired access token, revoke, corrupted vault, DB-only exposure, logging/callback query inspection и scope checks. Утверждение «0% token leaks» не является метрикой качества; требование — ни один тестовый секрет не должен появляться в API responses, logs, URLs или plaintext в SQLite.

## Пласт 5 — Delta-Sync Memory Protocol

### Что реализовано

`gateway/memory/delta_sync.py` содержит bounded JSON Patch subset и SQLite-backed memory revisions:
- только roots `facts`, `decisions`, `questions`, `notes`, `summary`;
- только operations add/remove/replace/test;
- ограниченный conversation ID, body, patch operations и state bytes;
- optimistic concurrency через `base_revision`;
- state SHA-256 digest и сохранение delta history;
- ошибка 409 при устаревшей версии, чтобы не затирать конкурентное обновление;
- endpoint memory выключен по умолчанию и требует gateway Bearer auth.

Array diff может заменять массив целиком. Это намеренный компромисс: diff может быть не самым маленьким, но проще корректно применять и тестировать. Данные чата/памяти не становятся prompt-system instructions.

### Что ещё не сделано

Browser UI не отправляет дельты на эти endpoints. Нельзя заявлять 75% token reduction до измерения; API передаёт patch от клиента, и выигрыш зависит от размера полного state, структуры и сериализации. Сейчас scope только conversation. Project/global/procedural/evidence store требуют собственных ACL, provenance, expiry, export/delete semantics.

### Gate

Round-trip exact state reconstruction — 100%; stale revision/replay/invalid pointer/out-of-scope mutation/oversized patch должны отклоняться; измерять байты JSON (это не то же самое, что токены), p50/p95 и SQLite growth. При подключении UI обязательно добавить recovery flow: получить latest revision → merge/rebase delta → повторить безопасную запись; не делать silent last-write-wins.

## Пласт 6 — Semantic Router на малых embeddings

### Принятое решение

Пока используется детерминированный `IntentRouter`: exact allowlist — единственный route, который может short-circuit. Keyword hints для tool/research имеют низкую confidence и `requires_verification=True`; они не дают permission на tool execution. Это измеримый rule-based baseline, а не утверждение, что embeddings уже включены.

FastEmbed и `all-MiniLM-L6-v2`/BGE остаются экспериментальными адаптерами. До внедрения нужно подтвердить:
- модель действительно доступна в выбранной версии FastEmbed и правильно поддерживает русский/английский/тайский;
- размер embedding, RAM/cache/cold-load time и CPU latency на целевом сервере;
- accuracy/confusion matrix на golden set;
- calibrated abstain threshold; ambiguous/low-confidence запрос всегда отправляется в main model;
- embedding не может повысить privileges, autorize tools или отключить security checks.

Требования `latency <10ms`, accuracy >85% и 30% no-LLM requests из исходного предложения — целевые гипотезы. Их нельзя считать фактами без измерений. Для 8GB VPS сначала сравнить pure rules с embedding model, включая время загрузки модели и RSS.

## Единый экспериментальный protocol

Каждый эксперимент пишет JSONL/CSV с: run ID, git SHA, model tags/quantization, Ollama version, host CPU/RAM, context/parallelism, feature flags, language, intent, duration, TTFT, total latency, input/output token usage (если надёжно доступно), peak RSS, selected route, outcome, source/citation correctness и ошибки. Удалять prompts/PII из журналов или заменять безопасным case ID.

Сравнивать baseline и variant на одинаковых данных/железе. Рандомизировать порядок для снижения cache bias, прогонять тёплый и холодный режим отдельно, повторять случаи с вариативными генерациями и сообщать p50/p95 вместе с доверительными интервалами/числом измерений. Вручную подтверждать регрессии с высоким риском.

### Общие release gates

- Все gateway contract/security tests проходят.
- Флаги новых функций остаются off по умолчанию до утверждённого решения.
- Ошибка/таймаут retrieval или памяти не должна тихо отправлять данные внешнему provider.
- Никаких разрушительных действий на VPS из автоматического middleware.
- В documentation и README помечены фактически работающие endpoints и ограничения.
- После merge CI прошёл; live deployment выполняется только по отдельному runbook и с rollback.

## Первичные источники

- [Ollama API — list running models (/api/ps)](https://github.com/ollama/ollama/blob/main/docs/api.md) — инвентарь загруженных моделей, не API выселения отдельных conversations.
- [Ollama FAQ — keep_alive и выгрузка моделей](https://github.com/ollama/ollama/blob/main/docs/faq.mdx) — документированные способы удерживать/выгружать модель.
- [Qwen2.5 в Ollama](https://ollama.com/library/qwen2.5) — варианты и опубликованный размер модели; размер артефакта не равен peak RAM.
- [Microsoft Research: LazyGraphRAG](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/) — deferred LLM relevance testing и итеративный retrieval.
- [RFC 9700 OAuth 2.0 Security BCP](https://www.rfc-editor.org/rfc/rfc9700.html) — PKCE, защита refresh tokens и best practices.
- [Google OAuth web-server flow](https://developers.google.com/identity/protocols/oauth2/web-server) — redirect URI, state, offline access и token lifecycle.
- [RFC 6902 JSON Patch](https://www.rfc-editor.org/rfc/rfc6902.html) — формат patch, последовательное применение операций и security considerations.
- [FastEmbed upstream](https://github.com/qdrant/fastembed) — поддерживаемые embedding-модели, загрузка и локальный cache.

## Следующий этап

1. Довести CI на feature branch и устранить любые обнаруженные тестами ошибки.
2. Подготовить golden sets и скрипты воспроизводимых evals.
3. Выполнить gateway tests локально на VPS-like окружении, оставить все flags выключенными.
4. В отдельном согласованном окне включить только один флаг, сравнить с baseline, сохранить результаты и решение.
5. Подключение Google Drive UI/OAuth и расширение memory scope делать отдельными этапами с security review.
