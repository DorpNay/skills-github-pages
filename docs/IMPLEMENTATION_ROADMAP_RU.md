# aLandi — единая инженерная дорожная карта исполнения

**Редакция:** 2026-11-06  
**Статус:** ACCEPTED AS PLANNING STRUCTURE; отдельные capability/technology decisions остаются CANDIDATE до evidence и решения владельца.  
**Канонический порядок:** этот документ задаёт последовательность и gates; `docs/MASTER_TASK_REGISTRY_RU.md` остаётся единственным lossless inventory задач, а его owner addendum — append-only delta.  
**Связанные каноны:** `LOOP.md`, `AGENTS.md`, `docs/ALANDI_N2O_CORE_RU.md`, `docs/ALANDI_N2O_KNOWLEDGE_LOOP_RU.md`, `docs/PROJECT_STATE.yaml`, `DECISIONS.md`, `EVALS.md`, `INTEL.md`, `docs/TECHNIQUE_REGISTER_RU.md`.

## 1. Назначение и правила

Это единый порядок исполнения оставшейся работы, а не обещание сроков и не утверждение, что все перечисленные capabilities уже существуют. План объединяет 20 последовательных шагов в четыре фазы. Переход к следующей фазе разрешён после закрытия её blocking gates; независимые безопасные задачи можно исследовать, но WIP implementation остаётся равным одному.

**Приоритеты:** P0 — доказать целостность основы; P1 — детерминированная безопасность и side-effect control; P2 — память, retrieval, evaluation и document intelligence; P3 — пользовательская/операционная зрелость и управляемая эволюция. Никакой автономности или новых тяжёлых компонентов до измеримости, ограничений и восстановления базовых контуров.

### Нормативный execution contract

Каждый существенный инкремент проходит:

`GOAL → USER JOURNEY → BASELINE → CONTRACT → INCREMENT → ACCEPTANCE → EVIDENCE → DECISION → RECORD`

Для каждого инкремента фиксируются:
- конкретный пользовательский результат и затронутые capability IDs;
- фактический code path, branch/base/head и текущая зрелость;
- baseline и измеримый критерий до изменения;
- контракт входов/выходов, scope, permissions, side effects, dependencies и failure/recovery path;
- минимальный вертикальный срез и feature flag (off by default, если поведение экспериментальное);
- позитивные, негативные, regression, security и resource checks по риску;
- kill criteria, rollback/migration plan, владелец решения;
- exact tested SHA, CI run IDs, результаты и ограничения.

**Статусы разделяются:** решение (CANDIDATE / PROPOSED / ACCEPTED / DEFERRED / REJECTED), реализация (SPECIFIED / PROTOTYPE / IMPLEMENTED / DEPRECATED), evidence (UNVERIFIED / PARTIALLY VERIFIED / VERIFIED) и доступность (DISABLED / CONFIGURED / AVAILABLE / VERIFIED LIVE). Один статус не доказывает другой.

**Правила остановки:** если нет baseline, scope, permissions, актуального контракта, безопасного rollback или нужного evidence — не продвигать изменение. При неубедительном результате сохранять baseline и ставить UNVERIFIED. Timeout/cancellation не означает rollback side-effect. Не снижать критерии ради календаря или зелёного статуса.

## 2. Бюджеты и метрики

Численные цели ниже — кандидаты для baseline/evaluation, а не действующие SLA. Сначала измерить текущую систему на указанной среде и зафиксировать выборку, затем принять целевое значение в `EVALS.md` или соответствующем контракте.

| Область | Что измерять | Кандидат-ориентир / правило |
|---|---|---|
| CI | pass rate на exact HEAD, flaky failures, повторяемость | целевой green rate ≥98%, flaky <2%; считать flaky fail до исправления причины |
| Browser UX | критические journeys, viewport, keyboard, contrast, focus | top-15 journeys как управляемый smoke set; WCAG 2.2 AA как целевой стандарт, не blanket claim без проверки |
| Gateway/model | TTFT, p50/p95, total latency, tokens, timeout, errors | p95 TTFT text <1.5s — проверить на целевом host; не обещать до измерения |
| Voice | capture→ASR→generation→queue→playback, interruption/recovery | p95 TTFT voice <800ms — только кандидат; проверять на физическом устройстве и реальном runtime |
| Cost/resources | cost/turn, RAM/PSS/VRAM, CPU, concurrency, disk, cold/warm | $0.01/turn и session cap $0.50 — только для тарифицируемого маршрута; на local-only считать стоимость ресурсов/TCO |
| Security | denied escalation, scope leaks, injection/exfiltration cases | 0 подтверждённых privilege escalations / cross-scope leaks; процент jailbreak не заменяет анализ severity |
| Retrieval | precision/recall@k, MRR/nDCG, citation correctness, latency/RSS | precision@10 >0.85 — гипотеза до golden-set baseline; обязательно scope leakage = 0 |
| Data/recovery | interrupted writes, restore success, integrity | 0 silent data-loss; restore проверять практически |
| Onboarding | time-to-first-run | <120 min — кандидат после актуализации setup/runbook |

Бюджеты задаются per capability и target profile. Для текущего базового 8-GB VPS сохранять один heavyweight model и concurrency=1, пока измерения не докажут безопасный запас. Не переносить GPU/72B/AWQ/VRAM-предположения на CPU-host. Ограничивать tokens/context, bytes/pages/archive expansion, wall time, retries, concurrency, leases, queue depth и egress.

## 3. Последовательность исполнения

## Фаза P0 — фундамент и доказательство стабильности

### Шаг 1. Стабилизация shell, voice regressions и критических PR

**Цель:** сохранить пользовательские контракты и получить достоверный зелёный результат на точном HEAD.

- **1.1 UI/Chromium forensics.** Разбирать PR #154 и связанные failures по trace, screenshot, video, console и shard/job logs. Исправлять первопричины (state/reference errors, selectors, contrast, timing, resource contention); не скрывать дефекты retries, sleep или ослаблением assertions. Использовать стабильные test IDs там, где селекторы должны быть контрактными; не вводить blanket testid-only политику без нужды.
- **1.2 Voice/TTS lifecycle.** Разобрать PR #152 отдельно от shell work: queue ownership, cancellation/AbortController, late TTS startup, device changes, autoplay rejection, concurrent generation, stale playback и cleanup. Не смешивать незрелую voice ветку с V2 promotion без зависимости и отдельного решения.
- **1.3 Accessibility.** Добавить/расширить axe-core проверки на критических сценариях и responsive viewports; ручные screen-reader/native-device проверки остаются отдельным gate.

**Acceptance:** обязательные checks зелёные на exact HEAD; все shards объяснены; ноль необъяснённых flaky failures; speech queue не зависает и не воспроизводит устаревшие ответы в покрытых race/cancel сценариях; контраст/focus/keyboard не регрессируют.  
**Kill / rollback:** остановить продвижение PR при неразобранном browser failure, потере state/history/tool contracts или security regression; откатить только ограниченный patch.  
**Текущий контекст:** PR #154 — shell promotion candidate; PR #152 — отдельный Draft voice candidate. Их live status и SHAs перепроверять перед действиями.

### Шаг 2. Сверка документации с live repository state

**Цель:** канонические документы отражают подтверждённую реальность, а не вчерашние PR/branch snapshots.

- **2.1 Live state.** Сверять main SHA, открытые PR/issues, base/head, draft/hold, mergeability и exact-head checks; отдельно отмечать merge SHA и post-merge verification.
- **2.2 Maturity matrix.** Для capability записывать runtime/code path, test/evidence, scope и maturity: available / experimental / specified-only / deprecated. Feature flag или UI control не доказывает backend capability.
- **2.3 Drift prevention.** Сначала проверять существующие Freshness checks; расширять их только под обнаруженный повторяющийся drift. Генератор состояния не должен сам переписывать owner decisions или маскировать расхождения.

**Acceptance:** ориентирование восстанавливает active task из live GitHub + OLEDUE + одного canonical register; stale SHA/PR snapshot явно помечен; все важные claims имеют code/test/evidence anchor.  
**Kill:** если live state расходится с snapshot — не выполнять зависящие от него protected/branch operations до reconciliation.

### Шаг 3. Архитектурные и capability contracts

**Цель:** описать реальные границы и гарантии UI → Cloudflare Tunnel → FastAPI gateway → private Ollama и локальных/внешних adapters.

- **3.1 Data/API contracts.** Инвентаризировать существующие browser storage, gateway/OpenAPI, inference, memory, retrieval, voice и tool interfaces до решения о schema-first/generation. Не создавать второй OpenAPI source of truth, если актуальный contract уже генерируется/поддерживается иначе.
- **3.2 Capability contract.** Стабильный ID, purpose, version, inputs/outputs, data scope, actor/permissions, side effects, dependencies, timeout/budget, retry/idempotency, failure/recovery, maturity, owner и evidence. Для read-only helper допускается сокращённый контракт.
- **3.3 Contract tests.** Привязать contract fixtures к фактическому API и CI. Pact, Schemathesis, openapi-diff, JSON Schema/AJV — кандидаты, не обязательные установки; выбирать после проверки существующего tooling и стоимости сопровождения.

**Acceptance:** для каждого capability, который UI показывает как доступный, существует реальный runtime/API и проверяемый contract; unavailable/spec-only не имеет ложной кнопки/обещания.  
**Kill:** breaking contract без миграции/compatibility path блокирует продвижение.

### Шаг 4. Единая quality/evaluation система

**Цель:** доказательство качества привязано к коду, сценарию и SHA.

- **4.1 Test layers.** Разделить unit, integration, contract, security, privacy, accessibility, browser E2E и live/host checks. Выбрать критические journeys, а не максимизировать число E2E.
- **4.2 Golden fixtures.** Для каждого важного capability хранить deterministic input/expected invariants; обновление fixture требует review и причины. Hash фиксирует целостность fixture, но не заменяет читаемые expected assertions.
- **4.3 Flaky policy.** Классифицировать инфраструктурный шум и продуктовый дефект; quarantine только с owner, сроком и запретом считать gate зелёным, если quarantined test критичен. Не вводить произвольный SLA 72h без доступной capacity.

**Acceptance:** PR quality report перечисляет suites, SHA, run IDs, failures/quarantine и непроверенные среды; regression в затронутом контракте блокирует продвижение.  
**Kill:** если тест не детерминирован или eval set недостаточен, статус UNVERIFIED, не PASS.

### Шаг 5. Восстанавливаемость browser/user data

**Цель:** сбой импорта, миграции или storage write не приводит к тихой потере данных.

- **5.1 Audit current storage.** Начать с уже реализованных в main recovery/atomic rollback механизмов PR #150; не переписывать их в IndexedDB/idb или добавлять WAL поверх browser storage без доказанного дефекта.
- **5.2 Failure injection.** Проверить quota exhaustion, corrupt payload, interrupted write, tab termination, duplicate IDs, partial import/export и повторный импорт.
- **5.3 Versioned migration/recovery.** Проверить существующие migration/version contracts, backup/export и идемпотентность; добавить недостающий слой только если аудит выявит пробел.

**Acceptance:** rollback/recovery воспроизводим; пользователь видит ошибку и путь восстановления; исходные данные сохраняются при failed operation; backup можно реально импортировать.  
**Kill:** потеря исходных данных, непроверенная destructive migration или невозможность восстановить — блокирует release; schema rollback только через протестированную миграцию.

## Фаза P1 — безопасность и управляемое исполнение

### Шаг 6. Детерминированный Permission Engine

**Цель:** полномочия определяются trusted execution layer, а не моделью, prompt или tool output.

- **6.1 Authorization model.** Сверить текущие auth/scope primitives в gateway/tools/memory. Формализовать actor → project → resource → operation и least privilege без дублирующего policy engine.
- **6.2 Capability grants.** Ограниченные, короткоживущие grants/opaque handles; модель не получает raw credentials и не может расширить scope.
- **6.3 Adversarial tests.** Prompt claims, fake tool permission, cross-project resource IDs, expired grants, confused deputy, revoked access и concurrency races.

**Acceptance:** unauthorized operations deny-by-default; scope leak/escalation tests = 0; latency измерена на целевой среде.  
**Technology gate:** OpenFGA/ReBAC, OPA/OPAL, CASL или собственный policy layer сравнивать только после code audit и workload benchmark. Цель <5ms и fallback >10ms — кандидаты, не заранее принятые SLA.  
**Kill:** новый engine не принимается, если он дублирует текущие scope checks, увеличивает attack surface или не даёт измеримого выигрыша.

### Шаг 7. Intent Gate и точное подтверждение действий

**Цель:** каждый tool call валидируется до исполнения, а approval связан с конкретной операцией.

- **7.1 Typed validation.** Trusted registry, strict JSON Schema, ограничения размера/типа/target resource, запрет неожиданных properties и remote schema refs.
- **7.2 Risk-tiered approval.** Различать read, draft, local change, external side effect и protected action. Для write/external показывать exact preview/diff, actor, resource и параметры.
- **7.3 Approval binding/replay.** Одноразовый approval к конкретному tool + canonical args hash + resource + actor + expiry/nonce. Изменение параметров требует нового подтверждения.

**Acceptance:** invalid/unauthorized calls не достигают handler; approvals нельзя переиспользовать на изменённом payload или другом ресурсе; отказ/timeout не превращается в success.  
**Kill:** confirmation не реализован end-to-end — write tool остаётся disabled; никаких автономных write действий.

### Шаг 8. Изоляция инструментов и execution tiers

**Цель:** инструмент имеет минимально нужные FS/network/process права.

- **8.1 Read / draft / write.** Read-only APIs отдельно; draft не исполняет side effects; write только через проверенный capability API.
- **8.2 Sandbox boundary.** Сначала инвентаризировать текущие Pyodide/security ограничения и отсутствие произвольного shell. Для code execution провести threat model и bounded pilot (WASM, gVisor, Firecracker, container seccomp/AppArmor/Landlock) по реальной модели угроз.
- **8.3 Egress/secrets.** Explicit domain allowlist, DNS/redirect/SSRF checks, env/vault separation; secrets остаются на серверной стороне и не попадают в model context/logs.

**Acceptance:** negative tests подтверждают запрет path traversal, private-IP SSRF, secret reads, cross-tenant access и unbounded execution; resource limits реально enforced.  
**Kill:** если изоляция только декларативная или обходится через /tmp/network/shared mounts — capability не включать. Не добавлять Vault/CoreDNS/Firecracker без deployment fit и owner approval.

### Шаг 9. Prompt injection, taint и exfiltration protection

**Цель:** внешнее содержимое не может изменить policy/goal/permissions и не может незаметно утечь в другой scope.

- **9.1 Provenance/trust labels.** Repository, documents, web, memory и tool outputs явно недоверенные; сохранять source, owner/scope и provenance.
- **9.2 Flow controls.** Проверять private-read → external-send цепочки, tool output instruction override, memory poisoning и cross-scope retrieval. Deterministic policy precedes any classifier.
- **9.3 Red-team.** Начать с тестов OWASP Agentic/LLM threat scenarios; расширять corpus по найденным классам дефектов. Classifier/dual-model guard — только defence-in-depth, не authority engine.

**Acceptance:** запрещённые потоки блокируются детерминированно; adversarial suite не выявляет подтверждённых escalation/exfiltration paths; false positives и latency измерены.  
**Kill:** LLM classifier не может быть единственным security gate; при неопределённости fail closed для tool actions, ordinary chat сохраняется.

### Шаг 10. Транзакционная безопасность side effects

**Цель:** повтор, timeout и cancellation не дублируют внешнее действие и не создают ложный success.

- **10.1 Operation state.** operation ID, idempotency key, pending/committed/failed/unknown и durable audit metadata там, где реально нужен write.
- **10.2 Reconciliation.** При ambiguous timeout запросить внешний фактический state, если API позволяет; иначе оставить UNKNOWN и передать владельцу.
- **10.3 Compensation.** Для multi-step external workflow описать compensating action/manual recovery; outbox/saga/Temporal/Celery — кандидаты только при доказанной потребности в durable orchestration.

**Acceptance:** повторный запрос с тем же ключом не дублирует действие; unknown не маскируется под failed/committed; compensation проверена.  
**Kill:** если provider не поддерживает idempotency/reconciliation, требовать явного approval и manual confirmation; не обещать exactly-once.

## Фаза P2 — память, retrieval и качество интеллекта

### Шаг 11. Продуктовая Memory как отдельная подсистема

**Цель:** сохранить scope, provenance, temporal validity, conflict и deletion semantics, не смешивая продуктовую Memory с N₂O.

- **11.1 Audit current graph.** Проверить существующие SQLite memory manager/schema/scope/conflict/temporal/delta sync и browser bridge; N₂O остаётся governance layer, не новый memory runtime.
- **11.2 Data contract.** Owner, scope (personal/conversation/project/shared), source/provenance, confidence, valid-time/recorded-time, status, expiry/review trigger и deletion lineage.
- **11.3 Conflict/review.** Противоречия остаются disputed/pending review; не auto-overwrite и не auto-resolve. Проверить scoped recursive delete, export/restore и retention.

**Acceptance:** cross-scope read/write/delete deny; provenance обязательна; conflicts traceable; deletion покрывает derived records в заявленном scope.  
**Technology gate:** SQLite baseline сохраняется; vector DB/mem0/qdrant/pgvector рассматриваются только при измеренном retrieval gap и privacy/ops review.

### Шаг 12. Управляемый Retrieval/RAG pipeline

**Цель:** каждый retrieved chunk доступен по scope и может быть прослежен до источника.

- **12.1 Pipeline audit.** Ingestion → normalization → chunking → indexing → retrieval → reranking → grounding/citations. Начальный baseline — существующий FTS5 + lexical graph/RRF, не подменять его абстрактной схемой.
- **12.2 Access-aware retrieval.** Permission/scope filtering до выдачи кандидатов; hybrid BM25+dense и reranking — сравнительные варианты.
- **12.3 Citation integrity.** chunk/source/page/offset/hash/score; citation должна ссылаться на реально извлечённый текст и проверяемый source offset. Relevance score не равен confidence или source integrity.

**Acceptance:** golden set с labelled corpus; Recall@5/MRR/nDCG/citation correctness/latency/RSS; scope leakage = 0; citations воспроизводимы.  
**Kill:** precision@10 target не принят без baseline; если hybrid/reranker не выигрывает на одинаковом наборе с учётом RAM/latency — оставить baseline. Docling не является RAG prerequisite.

### Шаг 13. Единый Evaluation Framework и CI gates

**Цель:** качество моделей, prompts, memory и retrieval сравнивается на одной версии datasets и методики.

- **13.1 Golden datasets.** RU/EN/TH для QA, extraction, reasoning, tool use, documents, retrieval и adversarial cases; начинать с 50–100 качественно размеченных примеров на конкретный capability, затем наращивать до статистически оправданного объёма. 500 на язык — долгосрочная цель-кандидат, не входной блокер для всех задач.
- **13.2 Metrics.** Task success, factual/source accuracy, groundedness, retrieval P/R@k, citation integrity, adversarial outcomes, latency, tokens, cost и resource usage по типу задачи.
- **13.3 CI eval gate.** PR запускает только affected capability sample; полный corpus — nightly/on-demand. Judge model дополняется deterministic checks и human review; regression threshold фиксируется после noise/baseline analysis.

**Acceptance:** каждый eval report привязан к dataset version, code/model/prompt config, environment и SHA; regression beyond agreed tolerance blocks promotion.  
**Technology gate:** promptfoo/ragas/deepeval/langfuse — optional; не устанавливать набор целиком, выбрать минимальный инструмент после проверки существующего harness.  
**Kill:** нестабильный judge или маленькая выборка не блокирует релиз сама по себе, но запрещает сильный quality claim.

### Шаг 14. Document Intelligence pipeline

**Цель:** безопасный, ограниченный, сравнимый разбор документов, включая OCR/layout только при доказанной пользе.

- **14.1 Safe baseline.** Проверить существующие PDF/DOCX/XLSX/TXT/CSV/JSON parser и их лимиты: bytes, pages/sheets, archive expansion, CPU/wall time, extracted text size, temp cleanup. Не заменять уже работающие parser stack без evidence.
- **14.2 Bounded pilot.** Docling/RapidOCR — отдельный выключенный pilot на фиксированном RU/EN/TH corpus. Измерять text/table F1, OCR WER, layout/page coordinates, RAM peak и p95 latency против текущего baseline.
- **14.3 Provenance/license.** Проверить engine, model weights, tokenizer, OCR models и datasets по отдельности: license, version, SHA-256, redistribution/commercial terms, artifact size и security.

**Acceptance:** malicious PDFs/archives, embedded files, malformed OOXML, resource exhaustion и timeout безопасно обрабатываются; pilot выигрывает на одинаковом corpus без неприемлемого resource/license cost.  
**Kill:** если качество/ресурсы/лицензия не проходят gate — выключить pilot и оставить baseline; не блокировать основной релиз.

### Шаг 15. Model routing и вычислительные бюджеты

**Цель:** выбор модели/back-end основан на качестве, бюджете и target hardware, а не размере/названии модели.

- **15.1 Task routing.** Сначала правила на известных типах задач; helper models только для узких bounded tasks и только после bake-off против main-only.
- **15.2 Budget enforcement.** Per-turn/session tokens, context bytes, concurrency, retries, timeout, RAM/VRAM, queue depth, latency/cost; отказ или downgrade должен быть явным и безопасным.
- **15.3 Quantization/runtime.** Сравнить GGUF/AWQ/другие варианты только на совместимом hardware и одинаковом golden set; quality degradation, memory, cold/warm latency и license фиксируются.

**Acceptance:** router улучшает success/cost/latency без security/quality regression; fallback не раскрывает секреты и не отправляет private data в неразрешённый provider.  
**Kill:** без target-host evidence оставить один основной model и concurrency=1; MoE/72B/speculative decoding не внедрять без измеренного выигрыша и ресурсов.

## Фаза P3 — продуктовая и эксплуатационная зрелость

### Шаг 16. Voice как надёжный сервис

**Цель:** один проверяемый lifecycle для capture, ASR, generation, queue, playback, interruption и recovery.

- **16.1 Lifecycle state machine.** Формализовать состояния и допустимые переходы поверх существующего voice path; XState не обязателен, если простая FSM уже достаточна.
- **16.2 Recovery matrix.** Reconnect, device change, permission revoked, autoplay rejected, suspended AudioContext, cancel/interrupt, late response, queue bounds, mic cleanup и text fallback.
- **16.3 Runtime bake-off.** STT/TTS candidates (включая текущие Whisper/Piper/Vosk и другие) сравнивать на одинаковом RU/EN/TH corpus, target device и license constraints; streaming/chunking включать после измерения.

**Acceptance:** нет stale playback/leaked tracks/stuck queue в покрытых тестах; физический browser/device test и real local model test отдельно от mocked CI; text mode всегда доступен.  
**Kill:** если модель/runtime не лицензированы, не помещаются в бюджет или ухудшают качество — не включать; ASR/TTS остаются disabled.

### Шаг 17. UX, mobile и accessibility

**Цель:** критические пользовательские journeys работают на реальных viewport/input modalities и не создают ложных capability claims.

- **17.1 Responsive workflows.** Composer, virtual keyboard/VisualViewport, sidebar/dialog/navigation, touch selection, file picker, safe area, focus restoration.
- **17.2 Localization.** RU/EN текущего scope; Thai — для соответствующих capability evals; ICU/i18next/RTL architecture не внедрять до реальной потребности.
- **17.3 Accessibility.** WCAG 2.2 AA checks, contrast, text scaling, keyboard, focus, reduced motion, axe snapshots и ручные VoiceOver/TalkBack/NVDA проверки.

**Acceptance:** top journeys проходят desktop/mobile browser matrix; manual device/screen-reader limits честно перечислены; нет keyboard/focus/contrast regressions.  
**Kill:** недоступный критический flow блокирует его promotion, но не обязательно весь unrelated release.

### Шаг 18. Privacy-safe observability

**Цель:** диагностировать цепочку без записи prompts, secrets и private content.

- **18.1 Correlation.** request ID → conversation ID → model call → retrieval → tool execution → response; W3C Trace Context propagation.
- **18.2 Metrics.** Stage latency, TTFT, tokens, retries, queue depth, errors, resource usage и outcome codes.
- **18.3 Redaction/retention.** Allowlisted attributes, PII/secret redaction, bounded retention/access; не логировать raw prompts, tool arguments, file/media contents или bearer headers.

**Acceptance:** трасса связывает stages и позволяет локализовать bottleneck; negative tests подтверждают отсутствие sensitive payloads; collector недоступен — chat не падает.  
**Technology gate:** OTel SDK/exporter, Phoenix/Langfuse/HyperDX/Presidio — варианты; выбрать один путь по privacy, hosting, overhead и maintenance.

### Шаг 19. Эксплуатационная зрелость aServi

**Цель:** безопасное обслуживание gateway/Ollama и практическое восстановление.

- **19.1 Health/readiness.** Проверить существующие /healthz, /livez, /readyz semantics и зависимости; liveness не должен маскировать not-ready.
- **19.2 Resource/network.** systemd/container limits, restart behavior, Ollama compatibility, disk/RAM pressure, loopback/private network. Port 11434 не публиковать; Cloudflare Tunnel — внешний ingress, не auth.
- **19.3 Backup/restore/runbooks.** Проверить backup integrity, restore rehearsal, update/rollback, incident runbooks и operator observability.

**Acceptance:** gateway/Ollama остаются в установленной сетевой границе; readiness отражает зависимость; restore/rollback практически проверены; resource exhaustion деградирует безопасно.  
**Kill:** никаких host changes, provisioning, deployment или credential changes без отдельного owner approval; отсутствие live-host доступа означает UNVERIFIED, не FAILED/VERIFIED.

### Шаг 20. Безопасная эволюция Skills, Agents и Workflows

**Цель:** расширять capabilities без бесконтрольной автономии и без превращения skills в permissions.

- **20.1 Versioned contracts.** Role/skill/integration/workflow имеет owner, version, dependencies, scope, permissions, budget, maturity и tests. Skill — procedure/package, не executable authority.
- **20.2 Bounded workflows.** Явные DAG/state transitions/checkpoints, max steps/time/results/concurrency, cancellation, idempotency, stop conditions и durable resume только если требуется.
- **20.3 Owner gates.** Pilot → evaluation → owner decision → release. Write/external/protected actions требуют соответствующего явного разрешения; автоматическое изменение skills/policies/permissions запрещено.

**Acceptance:** каждый workflow ограничен, воспроизводим и восстанавливаем; permissions проверяются execution layer; eval/regression/security suite проходит до release.  
**Kill:** не строить swarm/64 независимых runtime/тяжёлый orchestrator до доказанной потребности; роли остаются логическими профилями, если отдельные процессы не реализованы и не обоснованы.

## 4. Порядок приоритета и зависимости

1. Шаги 1–5 — обязательный фундамент. Нельзя начинать broad runtime promotion, пока затронутые критические дефекты и recovery contracts не закрыты.
2. Шаги 6–10 — security prerequisites для любых write/external tools, agents и workflow automation. Read-only исследования могут идти параллельно, но не расширяют permissions.
3. Шаги 11–15 — развивать на существующих Memory/RAG/parser/model baselines; evaluation framework (13) становится общим gate для последующих comparative pilots. Пилоты Docling/OpenFGA/reranker/model routing не имеют права блокировать безопасный baseline.
4. Шаги 16–19 — закрывать по реальным user journeys и доступности hardware/host; mocks подтверждают контракт, но не physical/live readiness.
5. Шаг 20 — только после доказанной безопасности и наблюдаемости; не является разрешением на autonomous writes.

**Первый пилот для интеллектуального слоя:** evaluation framework / golden-set skeleton, но после/в рамках стабилизации P0 и без отвлечения WIP от текущего блокирующего PR. Это снижает риск слепого выбора OpenFGA/Docling/model stack. Permission Engine spike идёт после аудита существующих security primitives; Docling — после baseline parser eval.

## 5. Что сознательно не принимается как готовое решение

- OpenFGA, OPA, CASL, Temporal, Redis/Valkey, vector DB, LangGraph/CrewAI, Langfuse/Phoenix, Docling/RapidOCR, Presidio, gVisor/Firecracker, XState, i18next, AWQ/GGUF и конкретные model tags — **technology candidates**, не обязательный stack.
- Указанные во входных планах package/repository names и numeric thresholds требуют актуального upstream/license/version review и target fit.
- Pact/Schemathesis/openapi-diff/axe/promptfoo/ragas/deepeval не устанавливаются пачкой; сначала проверить уже существующие CI/tooling и добавить только минимальный полезный компонент.
- Не вводить 80% coverage как глобальный vanity metric; измерять critical-module coverage и mutation/contract effectiveness там, где это полезно.
- Не требовать 500 golden examples per language до первого полезного eval; наращивать набор по coverage/variance и error classes.
- Не вводить two-phase commit для API, которые его не поддерживают; не обещать exactly-once, если достижим только idempotent retry + reconciliation.
- Не включать модельный классификатор как единственную защиту от injection/PII; deterministic authorization и data-flow constraints обязательны.
- Не считать test.fixme/quarantine/retries приемлемым решением первопричины.

## 6. Связь с существующим backlog и реестрами

- `docs/MASTER_TASK_REGISTRY_RU.md` — единственный lossless inventory открытых/частичных задач. Все 20 шагов этой дорожной карты становятся верхнеуровневой последовательностью; исходные task IDs и исторические источники сохраняются. Не переписывать [ ]/[~] в [x] без evidence.
- `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` — append-only owner delta; не переносить её задачи молча и не создавать новый addendum.
- `docs/LANDING_RELEASE_STRATEGY_RU.md` и `docs/V1_UI_FINALIZATION_RU.md` остаются специализированными acceptance/integration registers для V1/V2; их задачи маппятся на шаги 1–5 и 17, но не дублируются.
- `docs/CODER_PACKET.md`, voice plans, memory/RAG specs и operational runbooks — детальные спецификации подсистем; они подчиняются этой последовательности и не образуют конкурирующий master roadmap.
- `DECISIONS.md` хранит принятые/отклонённые архитектурные решения; `EVALS.md` — datasets, metrics, baselines и thresholds; `INTEL.md`/Technique Register — upstream evidence.
- `docs/PROJECT_STATE.yaml` и `ORIENTER.md` — актуальный state/checkpoint, не долгосрочный backlog.

## 7. Definition of Done для шага и фазы

Шаг считается закрытым только когда:
1. baseline и acceptance были определены до изменения;
2. scope, contract, owner и maturity указаны;
3. tests/evals/security/resource/recovery checks выполнены в применимом объёме;
4. точный tested SHA и CI run IDs записаны; результаты воспроизводимы;
5. diff/dependencies/licenses/privacy/migrations/rollback reviewed;
6. kill criteria проверены, остаточные ограничения названы;
7. решение ACCEPT / PIVOT / DEFER / REJECT зафиксировано в каноническом месте;
8. при необходимости merge и deployment отдельно подтверждены; merge не равен deployment.

Фаза не обязана закончиться за 24/48/72 часа или 90 дней. Сроки — planning estimates после измерения capacity, не повод пропускать security/legal/owner gates.

## 8. Текущая стартовая точка (снимок при принятии плана)

**Repository:** `DorpNay/skills-github-pages`  
**Verified base for this planning branch:** `f323b6f339d454dad6e820a4074fa230acc7b6df` (PR #154 base SHA; перепроверить live перед дальнейшим execution).  
**Live PR context observed:** PR #154 targets this base and promotes modular V2 shell; PR #152 is a separate Draft voice queue/selection workstream; PR #131 remains large V2 workbench; PR #125 is explicitly FUTURE/HOLD. Historical ORIENTER/PROJECT_STATE snapshots may lag this newer base and must be reconciled by live checks before dependent work.

**Next execution order:** (1) reconcile current live queue/state and exact-head checks; (2) finish the highest-priority P0 shell blocker on its authorized PR; (3) inspect PR #152 separately; (4) define a small evaluation baseline for the next capability pilot. Do not merge, deploy, rebase, force-push or change protected runtime as part of adopting this planning document.

