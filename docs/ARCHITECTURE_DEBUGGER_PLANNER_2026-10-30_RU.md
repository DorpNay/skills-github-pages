# aLandi — трёхролевая проверка архитектуры, дебаг и план первого обновления

**Дата:** 2026-10-30  
**Текущая база:** `main fd4f0a105183feb23e0f4e4697446235de9ffe9a`  
**Слитые релизы:** PR #121 (первый бесплатный лендинг V1 и UI) и PR #122 (Gateway liveness/readiness).  
**Текущий этап:** freeze V1, хронологическая сверка веток, восстановление проверочного инструментария и синхронизация документации.  
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
- [x] D4. Gateway Tests на точном HEAD PR #121 и PR #122 прошли; Quality/Chromium/Jekyll/Security/Integrity/Context, Graphify, Provenance и Dead Code на PR-head завершились успешно. Post-merge Pages deployment отдельно не подтверждён.
- [~] D5. Провести полный статический/графовый аудит UI, gateway, memory, RAG, voice, tools, workflows и dependencies. Graphify inspected: 1,109 nodes / 3,103 edges / 53 communities; no import cycles detected; full manual audit remains.
- [x] D6. Исправлены тестовый импорт `canonical_action_digest` и orphan subprocess при ASR/TTS timeout/cancellation; регрессионные тесты включены в PR #121 и прошли Gateway Tests на exact HEAD.
- [~] D7. Составить verified dead-code/obsolete-file inventory. Удалены только три подтверждённо устаревших scratch-файла после поиска ссылок и обновления `IMPROVEMENT_SELECTION.md`: `temp/3`, `temp/4`, `temp/5`. Содержательные `temp/1` и `temp/2` оставлены как архивные источники. Vulture warning по Protocol parameter — false positive.
- [ ] D8. Проверить security: SSRF/redirect, prompt injection, scopes, deletion, approval, tool sandbox, secrets, upload parsers, audio.
- [ ] D9. Проверить runtime contracts, cancellation, timeouts, limits, retries, concurrency и resource bounds.

### Роль 3 — release planner / product integrator
- [x] P1. Зафиксировать пользовательский принцип: до первого лендинга — только необходимая подготовка; после него — оптимизация и доведение имеющейся системы.
- [x] P2. Зафиксировать, что лендинг/продукт не должен рекламировать prototype как готовую функцию.
- [x] P3. Добавить book/document/source → reusable agent skill направление в план.
- [x] P4. Свести весь функциональный объём первого обновления в вертикальные, тестируемые deliverables — добавлены P0-13…P0-18 и P1-10…P1-17 в `docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md`.
- [~] P5. Подготовить голосовой UX: запись/транскрипция и TTS одного сообщения уже есть в коде; диалог сейчас half-duplex; selection-to-speech, multi-message queue, streaming turn detection и реальный barge-in остаются незавершёнными.
- [~] P6. Спроектировать small helper models, GPU-only/accelerated inference и routing без обязательной нагрузки CPU; сохранить CPU fallback только как осознанный режим. Подтверждены варианты Ollama GPU, llama.cpp offload и vLLM; требуется hardware benchmark.
- [~] P7. Спроектировать bounded multi-agent / mass-agent orchestration: DAG, budgets, queue, cancellation, idempotency, permissions, traces, evals и safe-off. Сравнены OpenWOP v2 protocol, LangGraph interrupts/checkpointing and Temporal durable workflows; no runtime chosen.
- [x] P8. Увязать agent-skill generation, RAG, source provenance, memory scopes и project notebook — целевой pipeline и security gates описаны; implementation remains pending.
- [x] P9. Release sequence, acceptance criteria, rollback и owner gates записаны; PR #121/#122 прошли exact-head CI. Post-merge deployment, native iPhone и owner runtime gates остаются отдельно.
- [~] P10. Лендинговые claims/CTA/SEO/структура проверены в PR #121; exact-head Chromium и published-site smoke прошли. Post-merge Pages deployment, финальный screenshot-review и native iPhone accessibility ещё не подтверждены.

## 1. Проверенное состояние на старте

- PR #121 merged at `f4d880f`; PR #122 merged at `fd4f0a1`. На checkpoint после merge PR queue пустая; Issue #111 — единственный открытый owner/infra/live-host release gate.
- PR #121 был слит после exact-head CI на SHA `e3c30173c40c4bd45bd2f49b23e0a3f33bdfb97b`; merge commit `f4d880f9648989f4fe48ddd2284220b3606c3b86`.
- PR #122 был создан из ветки Gateway readiness и слит на exact-head `94d871dbf76a5364ebb3c61d86cc763affa5eaa1`; merge commit `fd4f0a105183feb23e0f4e4697446235de9ffe9a`.
- PR #121 содержал основной срез UI/landing/E2E/Gateway DAG/approval/docs/workflow; его exact-head CI завершился успешно (6 workflow groups).
- На exact HEAD PR #121: Gateway, Quality (включая Jekyll/Chromium/published-site smoke), Freshness, Provenance, Graphify и Dead Code — success. PR #122: Gateway, Quality (включая Jekyll/Chromium/published-site smoke), Graphify и Dead Code — success.
- Историческая причина Gateway failure была тестовым импортом `canonical_action_digest`; исправление вошло в PR #121 и прошло exact-head Gateway Tests.
- Audio subprocess cancellation/timeout cleanup и regression tests также вошли в слитый PR #121; на exact-head Gateway Tests passed.
- PR-head published-site smoke прошёл, но это не отдельное доказательство post-merge Pages deployment. Private Gateway/VPS/Tunnel/Ollama, live voice, iPhone Safari, GPU/CPU benchmark и hardware quality остаются неподтверждёнными.

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

### Multi-agent orchestration
- [OpenWOP v2](https://github.com/openwop/openwop) is a promising wire protocol: durable suspend/resume, replay/fork, event streams, idempotency, HITL and interop. Its own README still asks for the first independent implementation; treat as protocol research/conformance target, not production-proven runtime.
- [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) provide graph checkpoint + human pause/resume; note interrupt restarts the node from its beginning, so side effects must be idempotent.
- [Temporal](https://docs.temporal.io/workflows) is the stronger durable workflow engine option for long-running/high-volume orchestration, but brings a separate service/worker operational footprint.
- **Decision:** keep aLandi's existing bounded DAG as a prototype; define a durable `AgentRun`/event contract first. Benchmark SQLite-backed single-owner queue vs Temporal before choosing a runtime. OpenWOP conformance may be an interoperability target later.

### Small helper models
- Candidates from October 2026 model cards: Qwen3.5-0.8B for narrow classification/extraction only; Granite-4.2-3B for tool-calling/agentic experiments (Apache-2.0, 128K native context, but vendor-tested language list does not include Russian or Thai). Do not select from leaderboard alone; use aLandi RU/EN/TH golden evals, exact quantization, GPU VRAM/RAM and latency. Qwen3.5-0.8B model card describes its intended use as prototyping/research, not as an autonomous action model.
- Sources: [Qwen3.5-0.8B](https://huggingface.co/Qwen/Qwen3.5-0.8B), [Granite-4.2-3B](https://huggingface.co/ibm-granite/granite-4.2-3b).

### Voice
- [Moonshine Voice](https://github.com/moonshine-ai/moonshine) — новый кандидат для streaming STT/TTS/voice agent; upstream заявляет on-device execution, streaming incremental recognition, AgentFlow/Dialog, MIT code. Current listed STT languages include EN/ES/ZH/JA/KO/VI/UK/AR but not RU or TH; TTS list includes RU but not TH. Non-English model licensing is model/version-specific (legacy Community License is non-commercial); inspect exact artifact license. Keep whisper.cpp for RU/TH and benchmark Moonshine only for supported locales.
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

### Дополнительные результаты архитектурного/debug этапа
- Graphify artifact run #262: 1,109 nodes, 3,103 edges, 53 communities, 0 detected import cycles. Core hubs: `create_app()` (66 edges), `showToast()` (51), `getUiLanguage()` (45), `safeGet()` (42), `Settings` (32). Это подтверждает концентрацию логики, но не является поводом для массового рефакторинга.
- Dead-code artifact run #389: Vulture сообщил только `gateway/voice/speculative_transaction.py:39 max_duration_ms`. Это параметр Protocol method signature и используется в контракте реализации; false positive. Не удалять.
- Голосовая проверка: gateway ASR поддерживает auto/ru/en/th и ограниченные аудиоформаты; UI имеет запись, редактируемую транскрипцию, локальный Piper TTS и half-duplex loop. Отсутствуют доказанные selection-to-speech, multi-message playback queue, real-time streaming STT and acoustic barge-in. Barge-in module сейчас только policy, native AEC отсутствует.

## 7. Хронология работ

| Шаг | Статус | Evidence / результат |
|---|---|---|
| 1. Восстановлен repo/PR/main context | done | main `2bda222`, PR #121, Issue #111 |
| 2. Получен список 25 PR files | done | GitHub PR changed filenames |
| 3. Проверены exact-head workflows | done | Gateway failed; Freshness/Provenance/Dead-code/Graphify passed; Quality in progress |
| 4. Найдена причина Gateway failure | done | `NameError: canonical_action_digest is not defined` в test import |
| 5. Исправлен тестовый импорт | done | commit `f9d5afaae983675d2c616e3fbc70942840d314e5` |
| 6. Повторный Gateway CI | done | Lite Gateway Tests run #483 passed после import fix |
| 6a. Полный Quality/Chromium exact-head CI | pending | предыдущий run #916 отменён; rerun запрошен, требуется финальный evidence |
| 6b. Graphify artifact inspection | done | 1,109 nodes / 3,103 edges / 53 communities; no import cycles |
| 6c. Dead-code artifact review | done | один Vulture false positive; никаких удалений не подтверждено |
| 7. Полный графовый/статический аудит | in progress | Graphify artifact + targeted source/tests; subsystem review continues |
| 8. Исправления найденных багов | pending | только reproducible defects |
| 9. Dead-code review and cleanup | pending | no deletes before evidence |
| 10. Release plan and final acceptance | in progress | this document; update after each stage |





### Confirmed debugger finding — subprocess cancellation leak (2026-10-30)
- In ASR route, ffprobe, ffmpeg and whisper.cpp subprocesses were killed on timeout, but not when the request task was cancelled. TTS Piper subprocess had the same gap. A cancelled request/server shutdown could leave local child processes running after the request and temporary-directory cleanup.
- Fixed in commit `77b2691f4a9cedfab280384667ece9ae92ba9bd3`: shared `await_local_process()` now kills and reaps the child on timeout or `asyncio.CancelledError`, then preserves the original exception. Applied to all four subprocess waits (ffprobe communicate, ffmpeg, whisper.cpp, Piper).
- Added two tests in `gateway/tests/test_audio_concurrency.py`: cancellation cleanup and timeout cleanup. Equivalent local Python smoke executed both paths; both subprocess return codes were `-9` (killed/reaped). This smoke is not a substitute for running the repository test suite.
- **Verification blocker:** current functional fix commit is `363bb5c46c6a0fcad55bb5d243289e065ee6450a`. GitHub app Contents updates did not trigger a new PR workflow run; available GitHub connector supports rerunning existing jobs but not workflow_dispatch/push with a user token. Existing Gateway #483 passed before this fix (on earlier code SHA). Run Gateway tests on the new SHA before merge.



### Verified repository cleanup — 2026-10-30
- Inspected all five files under `temp/`, searched repository references and reviewed `IMPROVEMENT_SELECTION.md` before deletion.
- Deleted `temp/3` (obsolete conversation/planning scratch), `temp/4` (simulated multi-agent brainstorm with stale/unsupported claims), and `temp/5` (generic Jekyll portfolio plan unrelated to the aLandi SPA). Commits: `936f37b2d9c3542956a227a72c0d3d8069042231`, `81bfe30428fdf3b60ea775eb7668253e270aefad`, `893736069e24bc04cd984aa57699caff9780f91d`.
- Updated `IMPROVEMENT_SELECTION.md` to explain the cleanup and retained source files.
- Kept `temp/1` (76-point research) and `temp/2` (AI Mobile Agent improvement research) because they contain substantial historical research; no runtime imports or build dependencies reference them. Archive/migration can be considered after their remaining useful ideas are fully reconciled.
- No production source file was deleted. Dead-code report's only Vulture warning remains a false positive.



### Main/PR synchronization and complete landing checklist — 2026-10-30
- Main advanced by documentation-only commit `e6404d510229fa64a7bb375995d76dcba55de623`, adding `docs/LANDING_UX_POLISH_BACKLOG_RU.md` with remaining landing/app screenshots, responsive checks, pause controls, accessibility, popovers/dialogs, settings, menus and published Pages smoke.
- PR #121 was synchronized using a two-parent merge commit `2c1e6bd811546a87f0ac86bc5e550dd9a31aeb13`; compare after sync: 194 ahead / 0 behind; GitHub reports mergeable=true, mergeable_state=unstable because required checks are incomplete.
- Merged the latest landing polish checklist into `docs/FIRST_FREE_LAUNCH_BACKLOG_RU.md`; all screenshot, keyboard/screen-reader, mobile, popover, dialog, focus, long-list and published deployment checks are now represented in the consolidated release backlog.
- Current main base is `e6404d510229fa64a7bb375995d76dcba55de623`; last functional audio fix remains `363bb5c46c6a0fcad55bb5d243289e065ee6450a`.

## 9. Дополнительные выводы по моделям и оркестрации

- Agent Skills is an open standard: portable skill folder with `SKILL.md`, optional scripts/references/assets and progressive disclosure. Knowledge-to-Skill output should be validated against the official spec rather than inventing aLandi-only schema: https://github.com/agentskills/agentskills.
- Book-to-skill v1.3.0 is an appropriate design reference; it has parser hardening and advisory injection scan. Keep it isolated and review dependencies and generated content before integration.
- Small-model candidates: Qwen3.5-0.8B (narrow low-risk classify/extract only, card positions it for prototyping/research); Granite-4.2-3B (agent/tool calling, Apache-2.0, 128K native context, but language coverage listed by IBM does not confirm RU/TH). Neither is automatically selected.
- GPU path: current Ollama can use supported NVIDIA/AMD/Vulkan backends; llama.cpp offers CPU/GPU offload, OpenAI-compatible API, parallel decoding and continuous batching; vLLM is a better candidate for a compatible GPU host needing throughput/quantization/continuous batching, not for the current small base stack.
- Multi-agent path: OpenWOP v2 provides an interesting protocol for durable suspend/resume, replay, event streaming, idempotency and human approval, but its project asks for first independent implementations; do not call it production-proven. LangGraph has graph checkpoints and interrupts; interrupts restart a node on resume, requiring idempotent side effects. Temporal is the mature durable workflow alternative but requires separate service/worker ops. Keep existing DAG prototype until a benchmarked runtime decision.
- The user explicitly requires voice capabilities to be a first-release deliverable. The backlog now tracks P0-13…P0-18: editable STT, natural turn-taking, selected text TTS, full-message TTS, multi-message queue, and real-device RU/EN/TH acceptance. Current code does not meet the complete scope.



### Updated multilingual voice research (2026-10-30)
- [NVIDIA NeMo-Speech.cpp](https://github.com/NVIDIA/NeMo-Speech.cpp) is a promising C++ speech runtime. Its current repository documents streaming ASR, streaming TTS, and a full-duplex VoiceChat path. Its published benchmark reports 160 ms ASR chunks; these are upstream benchmarks on named hardware, not aLandi measurements.
- [Nemotron 3.5 ASR Streaming 0.6B](https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b) supports 40 language locales. Russian is listed in transcription-ready tier; Thai is in adaptation-ready tier and must be evaluated carefully. Sherpa's official docs describe the same streaming model integration and locale tiers.
- [Qwen3-ASR-0.6B](https://github.com/QwenLM/Qwen3-ASR) via [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) lists both Russian and Thai; determine whether the exact backend supports the required streaming/partial transcript behavior before choosing.
- [Parakeet RNNT 1.1B multilingual](https://build.nvidia.com/nvidia/parakeet-1_1b-rnnt-multilingual-asr/modelcard) supports Russian and Thai and is described as ready for commercial use, but it is larger and governed by NVIDIA Community Model License. Verify the exact terms and redistribution rights before packaging.
- **Decision:** keep Whisper.cpp as current known baseline; run an offline benchmark matrix against Nemotron 3.5 0.6B and Qwen3-ASR 0.6B for RU/EN/TH. Do not replace Whisper based on language list alone. Streaming candidate must pass WER, endpointing, partial stability, TTFA, RTF, interruption/cancellation and target GPU memory tests.
- **Important distinction:** NeMo-Speech.cpp upstream claims are not proof that its full-duplex voicechat can be integrated into the current FastAPI/vanilla JS app without a substantial media runtime. Prototype on a separate branch and retain the current endpoint fallback.

## 8. Next action
Fetch latest PR head after commit `f9d5afaae983675d2c616e3fbc70942840d314e5`, inspect newly triggered Gateway/Quality/Graphify/Provenance runs, fix any new confirmed failure, then continue subsystem audit in dependency order: request lifecycle → providers → memory/RAG → tools/DAG/security → voice → document ingestion → landing/release.

## 8. Дополнительный UX polish — 2026-10-30
- [x] U1. Перепроверить ранее записанные UX-пожелания по legacy audit, V1 UI checklist, PR #121 body, landing markup и E2E. Результат собран в `docs/LANDING_UX_POLISH_BACKLOG_RU.md`.
- [x] U2. Найти фактический landing ticker: три roadmap item, открытие по details, CSS-only animation 22s, reduced-motion. Он уже существовал; не создавать второй ticker и не дублировать дизайн.
- [x] U3. Закрыть обнаруженный accessibility gap ticker: WCAG 2.2 SC 2.2.2 требует pause/stop/hide для auto-moving content >5s. Добавлены visible checkbox pause controls для каждого ticker, без JS/runtime dependency (commit `f42c42d51eb624b4d2e9fe638ddebffc3b7ab8db`).
- [x] U4. Добавить Playwright regression test pause/resume + assert zero scripts (commit `b213c8a5d50c93af675693986fe22c3bd4d5499d`).
- [ ] U5. Прогнать exact-current-head Chromium/Quality and published Pages after merge.
- [ ] U6. Реализовать оставшийся polish в больших вертикальных slices: visual consistency; popover/dialog keyboard/focus; mobile Safari; RU/EN/light-dark; screenshot review.

**Новые UX источники:** MDN deprecated marquee; MDN prefers-reduced-motion; W3C WCAG 2.2 SC 2.2.2; MDN Popover API and CSS Anchor Positioning. Ссылки и rationale в `docs/LANDING_UX_POLISH_BACKLOG_RU.md`.


### Landing voice requirements made explicit — 2026-10-30
- Updated landing capability card and roadmap to enumerate editable speech transcription, conversational voice with interruption, selected-text TTS, whole-message TTS and sequential multi-message playback queue.
- Copy distinguishes existing local ASR/Piper/half-duplex prototype from unfinished streaming, echo cancellation, interruption, queue and target-device acceptance; it does not claim these are already available.
- Updated landing Playwright assertions to require the voice scope and echo-cancellation acceptance text. Commits: a2df368, 1c3cd5d, 4abe657, da69c8e, af13b48.
- Exact-head landing/Chromium test has not yet run on the current branch. The existing PR description still explicitly excludes realtime voice/AEC as ready; the new landing text presents them as first functional update scope, not as shipped functionality.

## Exa research and verified architecture decisions — 2026-10-30
- Synthesis: docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md; 45 targeted queries / up to 360 requested result slots.
- [x] A4 — reviewed NeMo-Speech.cpp, Nemotron 3.5, Typhoon Thai ASR, VibeVoice, VoxCPM2, Magpie TTS, VoiceChat, Pipecat/LiveKit, voicebench, Agent Skills/book-to-skill, DBOS/Temporal/LangGraph and Node24 Actions.
- [~] D5 — Graphify and targeted source audit cover current hotspots; full manual subsystem audit remains open.
- [~] D8 — OOXML DTD/external-entity handling fixed and regression-tested in 051308c; broader SSRF, parser isolation and adversarial corpus remain open.
- [x] D4/D6 — Gateway CI after XML hardening: 156 passed (one upstream Starlette/AnyIO deprecation warning).
- [x] CI runtime — direct Action pins upgraded to Node24 in 48874eab; Gateway, Quality/Chromium/Pages smoke, Graphify, Dead Code, Provenance and Freshness passed.
- [~] P5/P6 — candidates/constraints documented; target-device quality, helper registry and GPU-only admission tests remain open.
- [~] P7/P9 — durable workflow options compared; no engine chosen. Current bounded DAG stays baseline.
- [x] P3/P8 — Knowledge-to-Skill linked to Agent Skills and book-to-skill v1.3.0; implementation/human review UI remain pending.
- [ ] No speech model, voice framework, GPU scheduler, agent engine or document converter integrated in this research pass.
- [ ] External skills/exercise-toolkit@ebf43bb remains pinned pending behavior review.

## 10. Хронологическая сверка, freeze V1 и оставшиеся задачи — 2026-10-30

### Подтверждённые merge milestones
- [x] M1. PR #121 merged: `f4d880f9648989f4fe48ddd2284220b3606c3b86`; exact PR HEAD `e3c3017`; все шесть workflow groups успешны.
- [x] M2. PR #122 merged: `fd4f0a105183feb23e0f4e4697446235de9ffe9a`; exact PR HEAD `94d871d`; Gateway, Quality/Chromium/Jekyll/published-site smoke, Graphify и Dead Code успешны.
- [x] M3. Open PR queue после этих merge — пустая; Issue #111 остаётся единственным открытым issue. Не закрывать его ради нулевого счётчика: там реальные owner-only gates (VPS, hardware, credentials, ruleset, corpus, voice, sandbox, OAuth).
- [x] M4. Проверена историческая ветка `feat/agent-memory-knowledge-superstack`: 64 роли и memory/knowledge design уже присутствуют в main в `docs/ALANDI_AGENT_MEMORY_KNOWLEDGE_RU.md`; это логические профили, не 64 параллельных процесса.
- [x] M5. Проверена старая `feat/alandi-superlite-core`: `AGENTS.md` и provider E2E уже есть в main; не переносить повторно.
- [~] M6. Сверены основные старые search/functions, landing, local audio/document, provider diagnostics и superstack ветки по именам/compare; текущие PR/документы показывают значительное перекрытие с более поздними merge. Полная файловая экспертиза каждой исторической ветки не проводилась; wholesale merge старых веток не нужен.
- [x] M7. В `feat/advanced-settings-model-modes-uncensored-20261028` найден benchmark harness, который отсутствовал в main, несмотря на важность helper-model evaluation. Перенесён только bounded synthetic smoke + tests; отдельный `self-hosted/free-cloud` selector не переносить — он дублирует provider route state PR #119/#121.
- [x] M8. Старые `project_create/project_read/project_update/diagram_create` workspace tools не входят в первый лендинг; оставить deferred до отдельного permission/scope/approval/security review. Uncensored 2B/4B checkpoint из старого runbook не выбран и не установлен.
- [x] M9. Устранены повторяющиеся decision IDs: D-015 — local helper; D-016 — orchestration; D-017 — adaptive-minimalist workspace; D-018 — RRF; D-019 — orthogonal chat settings. Перекрёстные ссылки приведены к уникальным ID.
- [ ] M10. Завершить exact-head CI PR reconciliation branch, затем merge только при всех релевантных проверках зелёными.
- [ ] M11. После merge проверить post-merge Pages deployment и опубликованный `/landing/` и root app.
- [ ] M12. Провести ручной visual/screenshot pass и native iPhone Safari/keyboard/safe-area/VoiceOver.
- [ ] M13. На реальном хосте выполнить helper-model benchmark: точные model IDs/digests/licenses, одинаковые RU/EN/TH golden prompts, quantization/context/hardware, p50/p95, cold/warm latency, tokens/s, RAM/PSS и human-rated quality. Пока модель не выбрана и не включена.
- [ ] M14. Продолжить системную матрицу UI ↔ API ↔ runtime ↔ persistence ↔ security ↔ CI/deploy; не объявлять sandbox, independent agents, live voice, OAuth или RAG production-ready без evidence.

### Обязательное правило freeze первого лендинга
После PR #121 не расширяем состав первой бесплатной версии. Разрешены только оптимизация, polish, исправления, безопасность, доступность, производительность, наблюдаемость и тесты **внутри выбранного стека**: HTML/CSS/JavaScript + Jekyll/GitHub Pages и существующий FastAPI/Ollama gateway. Новые функции и runtime-компоненты остаются в отдельном будущем backlog.

### Малые модели и агентная оркестрация — текущая граница
- В main уже есть ручной opt-in helper для candidate memory suggestions через операторский `ALANDI_HELPER_MODEL`; пустое значение отключает endpoint. Это не general-purpose subagent router.
- Целевой дизайн: одна главная модель для планирования/сложного reasoning/синтеза; максимум одна optional helper модель для узкой классификации/extraction/summarization/rerank после RU/EN/TH benchmark.
- Qwen3.5-0.8B и Granite-4.2-3B — только исследовательские кандидаты; не выбранные runtime dependencies. На 8-GB профиле default inference concurrency остаётся 1; не грузить несколько весов без измеримого выигрыша.
- Роли — лёгкие профили/skills и typed contracts. Оркестрация — bounded DAG/state machine с budgets, deadlines, queue/backpressure, cancellation, idempotency, checkpoints, fail-closed policy, action-bound approval, independent verifier и durable journal. Никакой uncontrolled swarm.
- Малые модели не получают право выдавать себе permissions, подтверждать side effects или заменять deterministic policy/verifier. Core path должен работать при выключенном helper.

