# Полный аудит целостности aLandi — 2026-10-30

## 0. Зафиксированное исходное состояние (до аудита)

- Репозиторий: `DorpNay/skills-github-pages`.
- База PR #123: `main` = `fd4f0a105183feb23e0f4e4697446235de9ffe9a`.
- PR #123: открыт, mergeable=true, branch `chore/reconcile-architecture-and-helper-eval-20261030`, HEAD `f6e67db5a7e39abc5f9351aae5ccadefc58e865e`; 51 commit, 23 файла в PR snapshot.
- Exact-head CI для указанного HEAD подтверждён в предыдущей проверке: 6/6 workflow groups успешны (Gateway, Quality/Chromium/Jekyll/published-site smoke/Integrity/Security/Context, Freshness, Provenance, Graphify, Dead Code). Перед любым merge/новой интеграцией повторно проверить, потому что последующие коммиты инвалидируют exact-head evidence.
- Единственный открытый issue: #111 — release gates, зависящие от владельца/реального окружения. Не закрывать по CI.
- Пост-merge Pages deployment на точном merge SHA и live VPS/Tunnel/Ollama не подтверждены.
- Важно: часть ориентиров на `main` отстаёт от PR #123 и содержит прежние SHA/счётчики. Этот аудит начинается от проверенного PR branch, а не от устаревших snapshot-строк в main.

## 1. Замороженная архитектурная граница

Аудит не является разрешением на расширение стека. Проверяем целостность уже принятого набора:
- Browser/client: HTML, CSS, vanilla JavaScript, browser storage/state, Playwright E2E.
- Static delivery: Jekyll + GitHub Pages.
- Backend: существующий FastAPI gateway, Python.
- Local inference/runtime: Ollama, локальные модели и существующие адаптеры; ничего не считать live без host evidence.
- Persistence/search: существующие SQLite/FTS5 и scoped memory/RAG primitives.
- Tool/agent path: существующие typed contracts, bounded DAG и explicit approvals; logical roles не равны отдельным агентным процессам.
- Voice/doc: существующие whisper.cpp/Piper/локальные extraction adapters; флаги и эксплуатационные gates остаются закрытыми до реальных тестов.
- CI/quality: GitHub Actions, Gateway tests, Chromium/Playwright, Jekyll/published-site smoke, Security/Integrity/Context, Graphify, Dead Code, provenance/freshness.
- Никаких новых сервисов, фреймворков, оплачиваемых API, автоматического cloud fallback, новых runtime dependencies или включения экспериментальных функций без отдельного решения.

## 2. Полный чек-лист работ

### A. Снимок и архитектурная карта
- [x] A1. Зафиксировать GitHub HEAD, PR/issue queue, mergeability и известные CI evidence.
- [x] A2. Зафиксировать границы существующего стека и запрет расширения.
- [ ] A3. Сверить все принятые решения (DECISIONS/ADRs/PROJECT_STATE) с реализованными модулями и флагами.
- [ ] A4. Построить карту модулей, входов/выходов, владельцев данных и межслойных контрактов.
- [ ] A5. Проверить циклы, дублирующие реализации, orphan modules, скрытые/неиспользуемые пути.

### B. Сквозные взаимодействия
- [ ] B1. Browser UI → request construction → provider/router → gateway → model/tool → response rendering.
- [ ] B2. Identity/session/auth → scopes/permissions → memory/RAG → persistence/deletion.
- [ ] B3. Search/research/evidence → citations/provenance → UI state and failure handling.
- [ ] B4. Agents/ToolDAG/helper model → budgets, deadlines, cancellation, retries, approvals, idempotency.
- [ ] B5. Voice/ASR/TTS/document extraction → child processes, resource bounds, cancellation, cleanup.
- [ ] B6. Config/env/feature flags → startup/readiness/liveness → deploy and rollback.
- [ ] B7. Browser storage ↔ server persistence, import/export, cross-project/private/shared boundaries.

### C. Качество и безопасность
- [ ] C1. Static analysis: Python typing/lint/security; JS syntax/lint/security; shell/YAML/config validation.
- [ ] C2. Dependency and supply-chain audit: direct/transitive dependencies, immutable action pins, licenses/provenance.
- [ ] C3. Security review: auth, CORS, SSRF, XML/ZIP parsing, path traversal, secrets/logging, prompt/tool injection.
- [ ] C4. Reliability: timeouts, cancellation, backpressure, concurrency, retries, partial failure, state recovery.
- [ ] C5. Performance/resource: payload sizes, browser work, DB indexes/queries, model memory/latency, process lifecycle.
- [ ] C6. Accessibility/i18n/responsive and degraded/offline/error states.
- [ ] C7. Test quality: coverage of boundaries and failure paths; detect duplicate, brittle or vacuous assertions.
- [ ] C8. Re-run all relevant exact-head checks after any accepted change.

### D. Независимый второй взгляд и решение
- [ ] D1. Подготовить независимому субагенту полный стек, решения, invariants, audit questions and output format.
- [ ] D2. Получить реальный независимый review (если host предоставляет субагента); иначе честно зафиксировать отсутствие отдельного агента.
- [ ] D3. Сопоставить рекомендации с локальными решениями и воспроизводимыми доказательствами.
- [ ] D4. Отобрать только улучшения с измеримой пользой и без расширения стека.
- [ ] D5. Внести минимальные обратимые исправления отдельными slices/PR.
- [ ] D6. Обновить ориентиры, project state, decision/eval records и volley log после каждого подтверждённого этапа.

## 3. Независимому субагенту — handoff brief

Ты — независимый principal engineer/reviewer проекта aLandi. Не переписывай систему и не предлагай новые продукты/сервисы. Изучи repository tree, архитектурную карту, PRE_LAUNCH_STACK, DECISIONS, EVALS, PROJECT_STATE, security/deploy docs, source, tests and CI.

Цель: обнаружить скрытые сильные взаимодействия уже существующих модулей и реальные разрывы между намерением, кодом, runtime и проверками. Рассматривай систему как граф контрактов, потоков данных и границ доверия, а не как набор несвязанных файлов.

Обязательные углы:
1. UI/request/provider/gateway/model response lifecycle.
2. Memory/RAG scopes, citations, deletion and persistence.
3. ToolDAG/agent/helper orchestration, typed contracts, approvals, cancellation and recovery.
4. Voice/document child-process lifecycle and bounded resource use.
5. Search/research provenance and offline/degraded behavior.
6. Feature flags/config/readiness/deployment/rollback.
7. CI/test architecture, dependency/supply-chain, accessibility and performance.

Правила:
- Accepted decisions and current project stack are binding. If code conflicts, report drift; do not silently redefine architecture.
- Distinguish implemented, integrated, enabled, CI-tested, target-tested, and production-verified.
- No invented tests/results. Every finding needs exact path/symbol/line or reproducible command/evidence.
- Rank findings by severity, confidence, impact and remediation cost.
- Propose only changes inside the existing stack; no new runtime dependencies unless an existing decision explicitly allows them.
- Prefer interaction improvements (shared contracts, fewer duplicate paths, one source of truth, cancellation propagation, state consistency) over adding features.
- Return: (a) system interaction map, (b) top 10 findings with evidence, (c) positive architectural synergies currently underused, (d) minimal patch proposals, (e) tests needed, (f) explicit non-findings/uncertainties.

## 4. Правило завершения

Этап считается завершённым только после сохранения артефакта/изменения, проверки diff и выполнения соответствующих тестов. Статический CI, synthetic fixture, mocked browser and target-host evidence — разные уровни доказательств. Не подменять одно другим.
