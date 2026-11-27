# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-28 · **Репозиторий:** `DorpNay/skills-github-pages` · **Ветка:** `main`
**Последний функциональный commit:** `7fadd2b029d64debb0d38079f4747a1fa6204f09` — P1.5 project-scoped browser workspace persistence.
**Канонический контракт:** root `AGENTS.md` v4.0; P0–P8 acceptance — `docs/ALANDI_MASTER_PLAN_RU.md`; внешние источники, лицензии и verdicts — `INTEL.md`.

## Старт и governance
1. Прочитать только этот файл (≤100 строк), затем единым batch сверить live main SHA, открытые PR/issues и Actions/checks exact HEAD.
2. Читать только owning spec, релевантные разделы Master Plan/INTEL и код текущей задачи.
3. Main-first только после exact-parent/CAS. Без force-push, merge/close PR, удаления веток/данных, ручного Pages deploy, изменения Pages workflow/settings, DNS/Tunnel/host/firewall/secrets/permissions или платных ресурсов без отдельной узкой авторизации.
4. Pages auto-publish защищён и не меняется. Project Sources синхронизируются владельцем вручную.
5. N₂O / LOOP и старые orienters архивированы. Четыре ступени не обязательны; direct chat — default.
6. Приоритет — крупные полезные продуктовые срезы. Проверки подтверждают реализацию, но не подменяют её; не ослаблять assertions.

## Текущее состояние
- **P0:** root app — единственный публичный клиент. На SHA `65564d1…` Quality Chromium дал 230 passed / 32 failed; это старый baseline, не переносить автоматически на текущий HEAD. Quality run на SHA `8b5f46e…` был cancelled до завершения полного browser gate.
- **P1.5 — PARTIAL:** Coding Projects — типизированные записи в canonical `ai_projects_v1`, dedicated project chat, инструкции, reload persistence, bundle import/export, scoped `/workspace/?projectId=…` handoff. Последний срез добавил per-project IndexedDB для directory handle, permission re-check при возвращении, explicit re-authorization, bounded metadata-only events/export и cleanup metadata при удалении проекта.
- **aCodingi:** реальный sandbox, shell/test runner, agent-driven file edits, Git worktrees/branches, durable run/approval lifecycle ещё не реализованы. Browser File System Access не является process isolation.
- **aNoteBooki:** общий shell и IndexedDB Notebook; source-grounded chat использует только явно отмеченные источники. Нереализованные Studio jobs остаются unavailable.
- **P3:** AgentRun SQLite lifecycle/worker/context/skills существуют; client event replay, approvals и настоящий изолированный runtime остаются открыты.
- **P5:** Service Worker кэширует публичный shell/static assets, не чувствительные API. Offline package closure, integrity-checked installer, no-network proof и rollback ещё не закрыты.
- **P6–P8:** продолжать только по активным acceptance; не создавать дублирующий backlog.
- **Открытые очереди:** PR #195, PR #187 и issue #111 остаются открытыми; без merge/close.

## Exact-head evidence
- **App commit:** `7fadd2b029d64debb0d38079f4747a1fa6204f09`, parent `8b5f46e0f852a3286b275d3bfca7157e367163af`.
- **Quality Sentinels:** run [#46077143068](https://github.com/DorpNay/skills-github-pages/actions/runs/46077143068) был `in_progress` при последней проверке; полный Chromium ещё не завершён.
- **Pages build/deployment:** run [#46077142724](https://github.com/DorpNay/skills-github-pages/actions/runs/46077142724) был `in_progress` при последней проверке; это автоматическая проверка/публикация, не ручной deploy.
- **Graphify:** run [#46077143110](https://github.com/DorpNay/skills-github-pages/actions/runs/46077143110) был `in_progress` при последней проверке.
- SPECIFIED ≠ IMPLEMENTED ≠ VERIFIED. CI, published Pages browser, owner host/model/VPS, and native browser/device permission proof are separate environments.

## Следующие действия
1. Проверить точный итог run #46077143068 и Pages/Graphify exact-head evidence; исправлять реальные Chromium/product defects по первопричинам без ослабления tests.
2. Продолжить крупный P1 срез: durable project/chat/session continuity, file snapshots/recovery, Git worktree contract and RU/EN/mobile accessibility.
3. Следующий P5 срез: pinned dependency closure, offline bundle manifest, hashes, install/rollback и реальный network-disabled proof; не скачивать main model.
4. Подключать AgentRun к aCodingi только через explicit permissioned run/task contract; sandbox P3.10 остаётся default-off до подтверждения isolation, approval, cancel, rollback и escape resistance.
5. Владелец отдельно закрывает host/model/domain/Tunnel, provider/data grants, native-device и live deployment gates.

## Ограничения
- Directory handle хранится локально в IndexedDB, но browser permission каждый раз перепроверяется; при необходимости требуется явный user gesture.
- Metadata export не включает handle или содержимое локальных файлов; журнал хранит только allowlisted event types, labels/counts и sequence metadata.
- Project deletion очищает workspace metadata/handle, но не удаляет пользовательские файлы.
- Не утверждать, что live browser, owner VPS/model, native-device permissions или полный P1.5/P3/P5 acceptance проверены этими commit/CI runs.
