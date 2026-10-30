# aLandi — постоянный backlog улучшений Landing V1

**Дата:** 2026-10-31  
**Статус:** backlog; это не разрешение на расширение стека.  
**Scope:** улучшать текущий лендинг внутри уже принятой архитектуры, без новых runtime frameworks/services/providers/dependencies без отдельного решения владельца.

## Фиксированная архитектурная граница

- Browser UI: HTML, CSS, vanilla JavaScript и существующие browser storage/state primitives.
- Delivery/build: Jekyll + GitHub Pages static hosting.
- Backend: существующий FastAPI Lite Gateway.
- Inference: текущие provider adapters и локальная Ollama integration; никакой скрытой cloud fallback.
- Data/search: существующие SQLite/FTS5, memory/RAG scopes and contracts.
- Tools/skills: текущие on-demand skills, ToolDAG, explicit approvals and existing tool contracts.
- Voice/doc: существующие whisper.cpp/Piper и bounded extraction adapters — не включать экспериментальные режимы.
- Quality: GitHub Actions, Gateway tests, Playwright/Chromium, Jekyll, Integrity/Security/Context, provenance/freshness, Graphify/Dead Code where applicable.

Это сводится с архитектурными границами в `docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md` и существующими решениями в `docs/TECHNIQUE_REGISTER_RU.md`. Перед каждым implementation slice проверять актуальность по текущему main и открытым PR.

## Принцип постоянного поиска

Поиск улучшений — повторяющаяся инженерная практика, а не обещание автономной фоновой работы. При каждом рабочем заходе:
1. Восстановить состояние репозитория, открытые PR, issue #111, ориентир и мастер-реестр.
2. Просмотреть изменения upstream/standards только для компонентов, уже входящих в принятый стек.
3. Найти доказуемый bottleneck/regression/maintenance cost; не создавать backlog из общих пожеланий.
4. Сформулировать гипотезу и baseline metric.
5. Выбрать минимальное изменение с regression coverage.
6. Выполнить тесты, проверить exact diff и exact-head CI.
7. Записать результат, trade-off, rollback and next task in registry/state.

## Приоритетный backlog

- [ ] LANDING-001 — зафиксировать baseline размера HTML/CSS/JS, critical rendering, LCP/INP/CLS и загрузки ключевых assets на опубликованном сайте.
- [ ] LANDING-002 — аудит доступности: keyboard-only, focus order, dialogs/popovers, screen-reader semantics, reduced motion, contrast and touch targets.
- [ ] LANDING-003 — аудит responsive поведения и реального iPhone Safari: visual viewport, keyboard, safe areas, rotation and zoom.
- [ ] LANDING-004 — аудит JS lifecycle: event listener cleanup, duplicate handlers, async race conditions, stale state, cancellation and memory leaks.
- [ ] LANDING-005 — аудит resilience: offline/slow network, retry/backoff, timeout, abort, provider 4xx/5xx, malformed/partial responses and error recovery.
- [ ] LANDING-006 — аудит client storage: migration, quota errors, import/export losslessness, corruption recovery, scoped deletion and backup/restore.
- [ ] LANDING-007 — audit security/privacy in current boundaries: CSP/SRI, DOM injection, URL handling, secret exposure, logging, CORS/SSRF and data retention.
- [ ] LANDING-008 — SEO/metadata/semantic HTML, canonical URL, social preview, sitemap/robots and crawl behavior without adding a framework.
- [ ] LANDING-009 — deterministic Jekyll/Actions build, cache correctness, immutable action pins, lockfile and provenance.
- [ ] LANDING-010 — reduce duplicated code/assets and dead paths only when exact reference and regression evidence prove safe removal.
- [ ] LANDING-011 — inspect current CSS/JS payload and optimize critical path only if measured; preserve visual behavior.
- [ ] LANDING-012 — expand Playwright coverage for critical user flows and failure states; avoid brittle/vacuous assertions.
- [ ] LANDING-013 — verify browser compatibility and graceful degradation for current supported browsers.
- [ ] LANDING-014 — audit i18n: RU/EN/TH labels, formatting, font fallback, transliteration of user-entered names only where required.
- [ ] LANDING-015 — review dependency freshness and security advisories within the existing dependency policy; do not blindly upgrade.
- [ ] LANDING-016 — inspect build/release observability and published Pages smoke; do not claim post-merge deploy from PR CI alone.
- [ ] LANDING-017 — reconcile historical landing UX requests with current code and master registry; preserve original task IDs and evidence.
- [ ] LANDING-018 — test graceful operation when optional gateway/voice/research capabilities are unavailable or disabled.

## Acceptance for each landing change

- Explicit problem statement and evidence in current main.
- No expansion of accepted stack or hidden provider/service fallback.
- Minimal diff, reversible change and regression test.
- Gateway / Chromium / Jekyll / security / provenance / freshness checks selected according to touched paths.
- Exact-head CI evidence after final commit.
- No live VPS, iPhone Safari, accessibility or published-site claim without the corresponding real check.
- Update `docs/MASTER_TASK_REGISTRY_RU.md`, `docs/PROJECT_STATE.yaml`, `ORIENTER.md` and `docs/VOLLEY_LOG.md` together at the next registry-maintenance checkpoint (master registry currently in PR #127).

## Status key

- `[ ]` pending.
- `[~]` partial or evidence pending.
- `[x]` complete with artifact and verification evidence.
