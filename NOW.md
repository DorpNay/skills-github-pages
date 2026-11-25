# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-25 · **Репозиторий:** `DorpNay/skills-github-pages` · **Ветка:** `main`
**Последний подтверждённый main SHA до этого NOW-only checkpoint:** `3e37db95b34c4d49ab9fc5f16e525d5a217be2de` (parent of this checkpoint update).
**Последний application-code baseline:** `191b2dac602273a2c3c4a2d80fbd722acadf6cd1`. Последний test-only baseline: `3e37db95b34c4d49ab9fc5f16e525d5a217be2de`; runtime app code не менялся.

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
- **FACT — exact main parent of this checkpoint:** `3e37db95b34c4d49ab9fc5f16e525d5a217be2de`. The test-only commit changes `tests/e2e/privacy-memory.spec.mjs`; application runtime code is unchanged.
- **FACT — P0 privacy regression implemented:** provider inference is now counted only for POST requests with a `/chat/completions` path and a request body. Gemini catalog GET discovery is not mistaken for user-message inference. Three broad Gemini route mocks now intercept only the chat-completions endpoint. Zero-leak, private-chat, explicit-consent and payload-scope assertions remain intact. Added a deterministic GET-vs-POST regression test.
- **FACT — exact-head Quality Sentinels:** run [45631537259](https://github.com/DorpNay/skills-github-pages/actions/runs/45631537259) on `3e37db95b34c4d49ab9fc5f16e525d5a217be2de`: Context, Integrity, Security, Jekyll and required root-app smoke **SUCCESS**; real Chromium browser regression **IN PROGRESS** at last read. Lightpanda, independent static analysis and separate Published Pages release contract were **SKIPPED**.
- **FACT — exact-head Pages auto-publication:** run [45631535874](https://github.com/DorpNay/skills-github-pages/actions/runs/45631535874) on `3e37db95b34c4d49ab9fc5f16e525d5a217be2de`: build, report and deploy **SUCCESS**. This is Pages pipeline evidence, not a substitute for full Chromium or owner-host acceptance.
- **FACT — previous Chromium failure baseline:** run [45553470306](https://github.com/DorpNay/skills-github-pages/actions/runs/45553470306) on `191b2dac602273a2c3c4a2d80fbd722acadf6cd1`: 213 passed, 45 unique failed, 1 flaky. The raw log confirms the context-budget failure sent only `LATEST_TURN` instead of retaining `OLD_TURN_7`; investigate the real system-prompt/context-budget input before changing assertions.
- **FACT — open PRs:** #195 and #187 remain open and diverged from current main. Main already contains provider-probe RU/EN diagnostics, credential redaction, busy-state recovery and the push/PR Chromium gate. Do not merge stale PRs wholesale or close them without separate authorization.
- **FACT — open issue:** #111 remains the consolidated owner/live-host/release gate.
- **FACT — governance:** Pages auto-publish is untouched. No manual deployment, PR merge/close, branch deletion, ruleset/permissions change, infrastructure change or purchase was performed.
- **FACT — Project Sources:** manual mirror only. The owner must replace stale uploaded sources with live `AGENTS.md` v4.0; do not claim UI synchronization.

## Ближайшее действие
1. Дождаться завершения full Chromium run `45631537259` на exact SHA `3e37db95b34c4d49ab9fc5f16e525d5a217be2de`; получить уникальные ошибки/trace и triage, не считать in-progress VERIFIED.
2. Следующим проверить context-budget fixture (tests/e2e/context-budget.spec.mjs) против реального system prompt, selected model и contextLength; не ослаблять критерии сохранения истории.
3. Затем продолжить P0 focus/navigation/mobile/voice/storage triage; закрыть P0 только после полного exact-head Chromium и нужной live-browser acceptance. После этого — P1 Coding, P3 orchestration foundation и P5 Offline Core.
4. После каждого существенного commit обновлять checkpoint и проверять штатный Pages auto-publish; manual deploy запрещён.