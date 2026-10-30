# aLandi — трёхролевая проверка архитектуры, дебаг и план первого обновления

**Дата:** 2026-10-30  
**Ветка:** `feat/chat-settings-orthogonal-controls-20261030`  
**PR:** #121  
**Основа:** `main 2bda22229cba3576628f92c821bb6e1562d8abc5`  
**Назначение:** единый журнал дополнительных поручений пользователя. Отмечать каждый шаг только после фактического выполнения и указывать SHA/evidence.

## 0. Полный список поручений пользователя

### Роль 1 — архитектор / systems integrator
- [x] A1. Восстановить фактический HEAD, PR queue, базу main и историю последних изменений.
- [x] A2. Прочитать действующие архитектурные ориентиры, backlog, state, решения, voice/memory/RAG/tool boundaries.
- [x] A3. Сверить архитектуру целиком и последние UI/CI нововведения; разделить runtime, prototypes, flags и owner gates.
- [x] A4. Проверить новые открытые проекты/технологии, включая Graphify, book-to-skill, voice stack и inference runtimes.
- [ ] A5. Выполнить системную матрицу совместимости: UI ↔ API ↔ runtime ↔ persistence ↔ security ↔ CI/deploy.
- [ ] A6. Внести только подтверждённые совместимые архитектурные исправления; не добавлять тяжёлые зависимости без измеримого выигрыша.

### Роль 2 — debugger / repository auditor
- [x] D1. Получить полный список файлов PR #121 и exact-head workflow evidence.
- [x] D2. Изучить фактический провал Gateway CI и локализовать дефект.
- [x] D3. Исправить найденную причину: добавить отсутствующий импорт `canonical_action_digest` в тест.
- [ ] D4. Повторно прогнать Gateway tests и все exact-head quality gates после исправления.
- [ ] D5. Провести полный статический/графовый аудит UI, gateway, memory, RAG, voice, tools, workflows и dependencies.
- [ ] D6. Исправить только воспроизводимые дефекты; каждый фикс покрыть регрессионным тестом.
- [ ] D7. Составить verified dead-code/obsolete-file inventory; ничего не удалять без доказательства отсутствия ссылок, CI/операционных ролей и истории.
- [ ] D8. Проверить security: SSRF/redirect, prompt injection, scopes, deletion, approval, tool sandbox, secrets, upload parsers, audio.
- [ ] D9. Проверить runtime contracts, cancellation, timeouts, limits, retries, concurrency и resource bounds.

### Роль 3 — release planner / product integrator
- [x] P1. Зафиксировать пользовательский принцип: до первого лендинга — только необходимая подготовка; после него — оптимизация и доведение имеющейся системы.
- [x] P2. Зафиксировать, что лендинг/продукт не должен рекламировать prototype как готовую функцию.
- [x] P3. Добавить book/document/source → reusable agent skill направление в план.
- [ ] P4. Свести весь функциональный объём первого обновления в вертикальные, тестируемые deliverables.
- [ ] P5. Подготовить голосовой UX: запись/транскрипция, голосовой диалог, interruption/barge-in, TTS одного сообщения, выделенного фрагмента и нескольких сообщений.
- [ ] P6. Спроектировать small helper models, GPU-only/accelerated inference и routing без обязательной нагрузки CPU; сохранить CPU fallback только как осознанный режим.
- [ ] P7. Спроектировать bounded multi-agent / mass-agent orchestration: DAG, budgets, queue, cancellation, idempotency, permissions, traces, evals и safe-off.
- [ ] P8. Увязать agent-skill generation, RAG, source provenance, memory scopes и project notebook.
- [ ] P9. Подготовить release sequence, acceptance criteria, rollback и owner gates для первого обновления.
- [ ] P10. Проверить все лендинговые claims, CTA, статусы функций, доступность, mobile, SEO и опубликованный Pages.

## 1. Проверенное состояние на старте

- PR #121 — единственный открытый PR; Issue #111 — владелец/infra/live-host release gate.
- PR #121 основан на текущем main `2bda22229cba3576628f92c821bb6e1562d8abc5`; GitHub compare показывает 144 commits ahead, 0 behind. Это означает, что ранее сохранённая заметка «19 ahead / 2 behind» устарела.
- Текущий HEAD PR #121: `b09c1365e9d5f434b69ebb60bb285c7574051172`.
- В PR #121 затронуты 25 файлов: UI, landing, E2E, Gateway DAG/approval, quality agents, docs/state и workflow.
- На exact HEAD: Project State Freshness, Provenance, Dead Code Audit и Graphify — success; Lite Gateway Tests — failure; Independent Quality Sentinels — in progress на момент чтения.
- Подтверждённая причина Gateway failure: тест обращался к `canonical_action_digest`, но функция не импортирована в `gateway/tests/test_coder_packet.py`. Код функции существует в `gateway/security/approval_gates.py`; это ошибка тестового импорта, не дефект production helper.
- Исправление отправлено в PR branch commit `f9d5afaae983675d2c616e3fbc70942840d314e5`: добавлен импорт `canonical_action_digest`. Повторный CI ещё не подтверждён.
- Main и опубликованный Pages не означают, что private gateway/VPS/Tunnel/Ollama развернуты. Live voice, iPhone Safari, GPU/CPU benchmark и hardware quality остаются неподтверждёнными.

## 2. Архитектурная оценка — подтверждённые границы

### Уже существующие foundations
- Клиент: статический HTML/CSS/JS, Jekyll/GitHub Pages; основной app в `index.md`, отдельный `landing/index.html`.
- Gateway: FastAPI; Ollama upstream; auth/CORS/model allowlist/body limits/concurrency/cache.
- Memory: browser-local scopes плюс серверный feature-flagged SQLite graph prototype; candidate/confirmed и explicit promotion.
- Retrieval: SQLite FTS5 + lexical/concept graph + RRF; evidence/citation primitives.
- Tools: bounded DAG prototype + approval tickets; это не полноценная sandbox execution.
- Voice: локальные whisper.cpp ASR / Piper TTS adapters, UI transcription, message read-aloud/mini-player и half-duplex dialogue prototype. Модели/бинарники/flags и target-device quality не доказаны автоматически.
- Graphify: изолированный code-only CI pilot, артефактный dev tooling; не production dependency.
- CI: quality sentinels, Chromium E2E, Jekyll, published-site smoke, gateway tests, provenance, dead-code report, Graphify.

### Архитектурные правила, которые сохраняем
1. Один источник истины для контрактов; никаких параллельных frameworks без доказанного выигрыша.
2. Feature flags default-off; включение не должно требовать доверия к UI state.
3. Любой agent/tool call имеет общие deadline, budget, max rounds, cancellation и explicit permission.
4. Project/private/global data scopes проверяются на каждом persistence/retrieval/cache/evidence boundary.
5. Никаких prompt/document/audio/auth secrets в telemetry/logs/cache/artifacts.
6. Retrieval остаётся FTS5 baseline до golden-set win для нового engine.
7. Не называть approval token sandbox; не разрешать произвольный shell без отдельной изоляции.
8. CPU/GPU режим выбирается runtime capabilities и измерениями; не обещать «без CPU» до проверки реального GPU, драйверов, VRAM и полного audio/IO pipeline.

## 3. Новые источники и решения

### Book-to-skill
Проверенный upstream: https://github.com/virgiliojr94/book-to-skill (MIT для кода инструмента). Конвертирует PDF/EPUB/DOCX/TXT/Markdown/HTML/RTF/MOBI/AZW и наборы источников в Agent Skill: краткий core `SKILL.md`, главы по требованию, glossary, patterns, cheatsheet. Работает через открытый Agent Skills формат; extraction локальный, генерация зависит от модели/host. В upstream v1.3.0 добавлены prompt-injection advisory scan, invisible Unicode scrub и parser hardening. Важная оговорка: generated skills из copyrighted книг хранить приватно; не копировать текст книги; проверять лицензию исходника и parser dependencies.

**Решение:** прототипировать внутренний «Knowledge-to-Skill» модуль как bounded ingestion pipeline: source registry → safe extraction → chapter/section map → evidence/provenance → skill synthesis → injection scan → human review → versioned skill. Не устанавливать чужой upstream напрямую в публичный runtime; сначала проверить текущий документный extractor и Agent Skills loader, затем заимствовать спецификацию/алгоритм и добавить тесты.

### Graphify
Текущий dev-only пилот уже встроен в CI и ранее проверен по 10 вопросам. Использовать для полного repo audit и архитектурного drift; не добавлять Graphify в production dependencies и не принимать generated graph за источник истины. Повторно смотреть на coverage/line mapping, а не только успешный exit code.

### Voice
- whisper.cpp streaming/VAD пример существует, но upstream example — naive rolling-window microphone transcription; это не готовый full-duplex conversational runtime.
- LiveKit Agents демонстрирует mature turn handling, interruptions, VAD/STT/TTS and preemptive generation, но добавляет media runtime, network/ops и зависимости.
- llama.cpp server поддерживает CPU/GPU inference, continuous batching, OpenAI-compatible API, tools и experimental multimodal; GPU offload опционален и требует конкретной сборки/модели.
**Решение:** сначала завершить текущие локальные whisper.cpp/Piper контракты и UX, добавить stream/turn/interruption только с device eval. LiveKit/Pipecat — сравнить как отдельный optional voice runtime, не мигрировать без benchmark.

### Inference / small helpers
Сохраняем Ollama как текущий основной локальный runtime. Для более точного GPU control допускается benchmark llama.cpp server (GPU layers/offload, parallel decode, speculative decoding) на отдельной ветке/хосте. Никакой автоматической миграции. Helper models — отдельный role/model registry с capabilities, context/token budgets, timeouts, max concurrency и task-specific eval; нельзя превращать одну маленькую модель в глобального «автономного управляющего».

## 4. Целевая карта первого обновления после публикации лендинга

### Release slice A — user-visible core
- Текстовый chat, projects, scoped memory, research/source citations, provider routing и settings должны быть надёжными и согласованными.
- Голосовой UX: push-to-talk/record → transcription editable before send; TTS full assistant message; selection-to-speech for selected text; multi-message queue with order, pause/resume/stop; one shared audio queue and cancellation token; no duplicate audio jobs.
- Conversational voice: streaming audio input/output, VAD/turn detection, interruption/barge-in, echo control, transcript alignment, graceful text fallback. Не показывать «почти человеческий realtime» пока latency/interrupt/echo tests не проходят.
- Accessibility: keyboard, focus, reduced motion, captions/transcripts, touch targets and iOS Safari.

### Release slice B — helpers and agents
- Role registry: helper type, model capability, allowed tools, data scopes, max tokens, timeouts, cost/resource budget, fallback.
- Small helpers: classify, extract, rerank, summarize, memory candidate proposal, skill synthesis; отдельные golden evals.
- Orchestration: DAG with bounded fan-out, queue/backpressure, max depth/rounds, deadlines, cancellation propagation, retries only for idempotent calls, checkpoints, idempotency keys, trace IDs and human approval for side effects.
- Массовые агенты — только после load tests; default concurrency small and hard-capped. No uncontrolled swarm.
- GPU execution: explicit device profile and VRAM admission; GPU-only mode fails clearly if unavailable; optional CPU fallback requires explicit policy. Model residency/eviction measured, not assumed.

### Release slice C — notebook and knowledge conversion
- Ingest owned/authorized books, PDFs, docs, websites and repository references.
- Keep source metadata, license/rights, hash, extraction version, page/section offsets and citations.
- Parse with size/time/page limits, MIME sniffing, archive traversal defense, temp-file cleanup, cancellation and malware/prompt-injection checks.
- Generate skills in Agent Skills format; validate frontmatter/schema, paths, instruction scope, secret leakage, copied text limits, malicious instructions and output budget.
- Human review before activation; versioning, diff, rollback, delete/retention and private-by-default output.
- Retrieval must point to source evidence; generated skill cannot override system policy or tool permissions.

## 5. Release acceptance gates (must all be evidenced)
- [ ] Exact PR HEAD: Integrity, Security, Context, Jekyll, Chromium, Gateway, Provenance, Graphify and Dead-code report pass.
- [ ] Post-merge main: deployment workflow passes; public root app and /landing/ smoke verify the exact release.
- [ ] Voice: real microphone/speaker, target language set RU/EN/TH, transcription accuracy, first-audio latency, RTF, interruption latency, echo, cancellation, repeated playback, multi-selection ordering.
- [ ] Model: exact artifact/tag, quantization, license, checksum, device backend, VRAM/RAM/PSS, cold/warm TTFT, tokens/s, p95 and thermal stability.
- [ ] Agent: budget, permission, scope isolation, cancellation, timeout, idempotency, retry and adversarial prompt injection tests.
- [ ] Knowledge-to-skill: parser corpus, malicious documents, injection scanner, provenance/citation correctness, license handling and human approval.
- [ ] Security/privacy: no secrets in browser bundle/logs/cache/CI artifacts; explicit disclosure of provider routing and storage.
- [ ] Owner gates: actual VPS inventory, firewall/loopback, Cloudflare Tunnel, credentials, backup/restore, reboot, iPhone Safari and legal privacy text.

## 6. Удаление и оптимизация
Никакие файлы пока не удалены. Удаление разрешается только после:
1. reference search across code/tests/workflows/docs/build scripts;
2. dynamic/indirect reference review (HTML selectors, glob imports, config names, runtime discovery);
3. check against release/rollback/forensics/source-of-truth roles;
4. replacement or archive decision;
5. regression test and PR diff review.

Dead-code workflow is report-only; its findings are candidates, not deletion authorization. Graphify can expose call/import paths but cannot prove dynamic code unused. Prefer consolidating duplicate helpers and removing proven unreachable branches only after evidence.

## 7. Хронология работ

| Шаг | Статус | Evidence / результат |
|---|---|---|
| 1. Восстановлен repo/PR/main context | done | main `2bda222`, PR #121, Issue #111 |
| 2. Получен список 25 PR files | done | GitHub PR changed filenames |
| 3. Проверены exact-head workflows | done | Gateway failed; Freshness/Provenance/Dead-code/Graphify passed; Quality in progress |
| 4. Найдена причина Gateway failure | done | `NameError: canonical_action_digest is not defined` в test import |
| 5. Исправлен тестовый импорт | done | commit `f9d5afaae983675d2c616e3fbc70942840d314e5` |
| 6. Повторный exact-head CI | pending | следующий обязательный шаг |
| 7. Полный графовый/статический аудит | pending | Graphify artifact + targeted source/tests |
| 8. Исправления найденных багов | pending | только reproducible defects |
| 9. Dead-code review and cleanup | pending | no deletes before evidence |
| 10. Release plan and final acceptance | in progress | this document; update after each stage |

## 8. Next action
Fetch latest PR head after commit `f9d5afaae983675d2c616e3fbc70942840d314e5`, inspect newly triggered Gateway/Quality/Graphify/Provenance runs, fix any new confirmed failure, then continue subsystem audit in dependency order: request lifecycle → providers → memory/RAG → tools/DAG/security → voice → document ingestion → landing/release.
