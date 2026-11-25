# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-25 · **Репозиторий:** `DorpNay/skills-github-pages` · **Ветка:** `main` · **Live HEAD:** `f45eedb6b3b877ea695a7064189ef1c7333bcd2c`
**Последний application-code baseline:** `191b2dac602273a2c3c4a2d80fbd722acadf6cd1`. Между ним и текущим HEAD — документационные, тестовые и instruction-only изменения; runtime app code не менялся.

## Старт новой задачи
1. Прочитать только root `NOW.md`, строки 1–100.
2. Одним пакетом проверить live `main` SHA, открытые PR/issues и Actions/checks на exact HEAD.
3. Открыть нужные разделы мастер-плана, `INTEL.md`, owning spec и связанного кода.
4. Не перечитывать проект и не восстанавливать архивные orienters, если релевантный контекст не изменился.

## Канонические документы
- `AGENTS.md` — **AI Engineer Project Instruction v4.0**, полный инженерный контракт + authority boundaries (145 строк; 16,610 символов).
- `NOW.md` — короткий exact checkpoint, приоритеты, блокеры, ближайшее действие (этот файл, ≤100 строк).
- `docs/ALANDI_MASTER_PLAN_RU.md` — единственный активный requirements/P0–P8/acceptance registry.
- `INTEL.md` — актуальные источники, версии, лицензии, риски, verdicts.
Supporting ADR/specs/tests/runbooks допустимы; не создавать вторую governance-инструкцию или backlog.

Project Instructions / Sources в ChatGPT синхронизируются вручную. Полный `AGENTS.md` не помещается в поле Project Instructions; прикреплять его как Project Source и держать в поле короткую инструкцию-ссылку на live canon. Не утверждать, что Project Source обновлён, пока владелец не заменил его в UI.

## Зафиксированные решения владельца
- **N₂O / LOOP:** окончательно остаются архивными по решению владельца от 2026-11-25. Не восстанавливать N₂O Core/Knowledge Loop/Sources и старые orienters; не навязывать фиксированные четыре стадии. Полезные принципы встроены в адаптивный `AGENTS.md` v4.0.
- **Main-first:** малые связные обратимые commits прямо в `main`; перед записью проверять exact parent/head и использовать expected-SHA guard. Не создавать PR ради ритуала.
- **Pages:** auto-publish workflow/triggers/settings неприкосновенны; обычный push может запускать штатную публикацию, manual deploy запрещён без отдельного разрешения.
- **Upstream reuse:** разрешено переносить зрелую целую систему, если она реально лучше переписывания и пройдёт license/security/runtime/data/offline/rollback gate. Основную большую модель не скачивать.
- **aNoteBooki:** после стабильной полезной базы заморозить; приоритет P0 UI, реальный aCodingi и Offline Core.

## Очерёдность P0–P8
- **P0:** root landing, UI/RU-EN, accessibility, responsive, keyboard/SR, lifecycle, security и полная browser acceptance.
- **P1:** общий root frame; aCodingi первым, aNoteBooki frozen baseline.
- **P2:** direct-chat, context/memory, routing и continuity.
- **P3:** Deep Research, agents/subagents, Skills, connectors, durable runs, approval/sandbox, bootstrap и отдельное model training.
- **P4:** Source Vault, safe ingestion/converter graph, stable artifacts, lineage, File Library/export.
- **P5:** installable Offline Core, local/server parity, pinned artifacts, update/rollback.
- **P6:** voice/audio ASR/VAD/TTS и device/weights acceptance.
- **P7:** providers, live catalogs, privacy/retention, cost/quotas, exclusive routing.
- **P8:** release/hosting/security/governance; owner-only gates остаются открытыми.
Текущий порядок исполнения — в ближайшем действии ниже; исторические backlog пункты не удалять без reconciliation.

## Live state — verified 2026-11-25
- **FACT — current exact main HEAD:** `f45eedb6b3b877ea695a7064189ef1c7333bcd2c`. This commit updates only `AGENTS.md` and `docs/ALANDI_MASTER_PLAN_RU.md`.
- **FACT — AGENTS v4.0:** полный текст владельца добавлен в `AGENTS.md` без сокращения; согласованы supporting ADR/specs, task-scoped authorization, no-skip flaky-test handling, N₂O archive decision и owner-gated external effects. The repository-aligned instruction contains 16,610 characters / 145 lines.
- **FACT — P3.6 new acceptance:** contract-first API/event schema (Pydantic → generated typed client), idempotent creation, SQLite WAL append-only event journal, per-run `event_seq` / `last_event_seq`, resume by `run_id` + cursor and default-off risky surfaces — **SPECIFIED, not VERIFIED**. Current `gateway/agent_runtime/store.py` has file-backed SQLite run/task/event tables, idempotency and `event_id`; its connection setup does not enable WAL. A generated typed client and immutable append-only/retention contract are not proven. Migration from `event_id` must be compatible.
- **FACT — exact HEAD Pages:** run [45627857297](https://github.com/DorpNay/skills-github-pages/actions/runs/45627857297) build/deploy/report — **SUCCESS**. This is static publication evidence only, not app runtime acceptance.
- **FACT — latest full Quality Sentinel:** run [45621154437](https://github.com/DorpNay/skills-github-pages/actions/runs/45621154437), test SHA `6ed6f576c8e652dfd335f98c98d4be35d6adf0de` — **FAIL** in real Chromium. Jekyll, Security, Integrity, Context and required root app boot/interaction smoke passed; Chromium failed. The run was before current docs-only HEAD; no Quality suite is claimed on `f45eedb6`.
- **FACT — failure triage evidence:** privacy tests include a missing aServi API key in the fail-closed fixture; three Gemini privacy tests count all host requests and mistake GET model-catalog discovery (`postDataJSON() === null`) for inference POST. Filter inference method/payload; preserve zero-leak and payload-scope assertions. Other failures include real candidates in focus restoration, project/chat filtering, mobile touch geometry, voice lifecycle and storage rollback, plus stale locale/copy/title expectations. Do not blanket-classify or loosen assertions.
- **FACT — previous baseline:** `191b2dac602273a2c3c4a2d80fbd722acadf6cd1` Quality Sentinel run [45553470306](https://github.com/DorpNay/skills-github-pages/actions/runs/45553470306) reported 213 passed, 45 unique failed, 1 flaky. Reconcile retry duplicates before counting later run results.
- **FACT — PR queue:** #195 (head `4a2718e305bf1f57dee38d867d07511d63ac1e9c`) and #187 (head `c951585d5a411a0099a229c074cb5d8ed1168fff`) remain open and are not to be auto-merged/closed. Provider redaction + full-Chromium workflow behavior from #195 already exist in main; do not merge stale PRs wholesale.
- **FACT — issue queue:** #111 remains open for owner/live-host/release gates. Unrelated imported issue #186 was closed as `not_planned` with comment.
- **FACT — governance:** `main` is not protected and has no required checks/review rules; tracked by #111. Do not change repository settings without owner approval.
- **FACT — Project Sources:** manual mirror only. Uploaded `AGENTS.md` and prior N₂O/LOOP copies are stale; the owner must replace the project source with live v4.0 `AGENTS.md`. The current chat Project Instructions field should contain a short pointer, not the full file.

## Ближайшее действие
1. Продолжить P0 Chromium triage на exact current main; сначала исправить privacy fixtures/request filtering, затем локальные assertion drift, затем реальные focus/navigation/mobile/voice/storage дефекты. На каждом баге — repro → minimal fix → focused test → full Chromium on exact HEAD. Не снижать privacy/security assertions и не исключать тесты.
2. После полного browser acceptance — P0.35 header/mode selector/themes; затем P1 Coding + P3 orchestration foundation + P5 Offline Core. Notebook Studio remains frozen.
3. После каждого существенного commit обновлять этот checkpoint и проверять Pages auto-publish; не делать manual deploy.
