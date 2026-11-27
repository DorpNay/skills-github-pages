# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-28 · **Репозиторий:** `DorpNay/skills-github-pages` · **Ветка:** `main`
**Последний функциональный HEAD:** `eca91fc013bf8664957a83a18bb0fee09d1cf532`. Следующий функциональный срез — fast-forward child после exact-head CI.
**Канонический контракт:** root `AGENTS.md` v4.0; P0–P8 acceptance — `docs/ALANDI_MASTER_PLAN_RU.md`; источники/лицензии/verdicts — `INTEL.md`.

## Governance
1. Сначала этот файл (≤100 строк), затем batch live main SHA, PR/issues и Actions exact HEAD.
2. Читать только owning spec, нужные секции Master Plan/INTEL и затронутый код.
3. Main-first с exact-parent/CAS. Без force-push, merge/close PR, destructive deletion, manual Pages deploy, Pages workflow/settings, DNS/Tunnel/host/firewall/secrets/permissions или paid resources без отдельной узкой авторизации.
4. Pages auto-publish защищён. Project Sources владелец синхронизирует вручную.
5. N₂O / LOOP / старые orienters архивированы. Четыре ступени не обязательны; direct chat — default.
6. Приоритет — реальные продуктовые срезы; тесты подтверждают работу, но не заменяют её. Не ослаблять assertions.

## Текущее состояние
- **P0:** root app — единственный публичный клиент. Старый baseline SHA `65564d1…` имел 230 passed / 32 failed Chromium; не переносить автоматически на новые HEAD.
- **P1.5 — PARTIAL:** Coding Projects в canonical `ai_projects_v1`; dedicated chat, instructions, reload persistence, typed bundle import/export, scoped workspace handoff. Per-project directory handles и event metadata хранятся в IndexedDB; permission проверяется повторно и запрашивается только по user gesture. Recovery snapshots привязаны к project ID; чужой snapshot нельзя восстановить даже при одинаковом имени папки. Activity timeline показывает последние allowlisted события. Metadata export исключает handle и file contents.
- **aCodingi:** браузерный редактор поддерживает выбранные файлы, diff, explicit approval и local recovery. Реальный sandbox, shell/test runner, agent edits, Git worktrees/branches и durable run approvals не реализованы.
- **aNoteBooki:** shared shell, IndexedDB Notebook, source-grounded chat только по явно выбранным источникам. Studio jobs без runtime честно unavailable.
- **P3:** AgentRun SQLite lifecycle/worker/context/skills существуют; WAL включён без ослабления FULL synchronous durability. Client replay/cursor contract, approvals and real isolated runtime остаются открыты.
- **P5.7 — PARTIAL:** SW кэширует public shell/static assets, исключает sensitive API/auth; сохраняет предыдущий revision cache и использует его как fallback для отсутствующих legacy assets при HTTP-ошибках и сетевых сбоях. Offline Core показывает browser storage/quota и запрашивает persistent storage только по клику. Offline dependency closure, integrity installer, quota/eviction and network-disabled proof открыты.
- **P6–P8:** продолжать по существующим acceptance criteria, не плодить backlog.
- **Открытые очереди:** PR #195, PR #187, issue #111 — не merge/close без отдельного решения.

## Exact-head evidence
- **Current code parent:** `eca91fc013bf8664957a83a18bb0fee09d1cf532`.
- **Quality Sentinels:** run [#46078010104](https://github.com/DorpNay/skills-github-pages/actions/runs/46078010104) in progress at checkpoint.
- **Pages build/deployment:** run [#46078010031](https://github.com/DorpNay/skills-github-pages/actions/runs/46078010031) completed successfully.
- **Graphify:** run [#46078010063](https://github.com/DorpNay/skills-github-pages/actions/runs/46078010063) completed successfully.
- CI, published Pages browser, owner host/model/VPS and native-device permission evidence are separate environments.

## Следующие действия
1. Проверить Quality/Pages/Graphify exact-head; исправить реальные P0 regressions без удаления/ослабления тестов.
2. P1: finish chat/project/session continuity, workspace file snapshots/recovery, Git worktree design and RU/EN/mobile accessibility.
3. P3: explicit AgentRun command/task contract, replayable events, approvals and cancel/retry; sandbox default-off until isolation/escape acceptance.
4. P5: pinned offline dependency closure, manifest/hashes, installer/update/rollback and true network-disabled proof; main model не скачивать.
5. Подготовить owner launch sequence для host/model/domain/Tunnel/data grants/native device; не выполнять owner-only действия.

## Ограничения
- Directory handle локален для browser profile; browser permission может потребовать повторного user gesture.
- Metadata export содержит только allowlisted lifecycle/count metadata; не содержит handles или file contents.
- Удаление workspace metadata не удаляет пользовательские файлы.
- SPECIFIED ≠ IMPLEMENTED ≠ VERIFIED. Не заявлять live browser, VPS/model, native-device или полный P1.5/P3/P5 acceptance без отдельного exact evidence.
