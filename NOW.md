# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-28 · **Репозиторий:** `DorpNay/skills-github-pages` · **Ветка:** `main`
**Последний проверенный application baseline:** `65564d154823e3b7fe56ed491ef331bd1834e032`. Следующий commit — только fast-forward с этим exact parent.
**Канонический контракт:** root `AGENTS.md` v4.0; полный план — `docs/ALANDI_MASTER_PLAN_RU.md`; внешние источники/лицензии/риски — `INTEL.md`.

## Старт и governance
1. Прочитать только этот файл (≤100 строк), затем в одном batch проверить live main SHA, открытые PR/issues и Actions/checks exact HEAD.
2. Изучать только owning spec, релевантные секции плана/INTEL и код текущей задачи.
3. Работать в main после проверки exact parent; никаких force-push, merge/close PR, удаления веток/данных, ручного Pages deploy, изменения Pages settings/workflows, DNS/Tunnel/host/firewall/secrets/permissions или платных ресурсов без отдельного узкого разрешения.
4. Pages auto-publish защищён и остаётся нетронутым. Project Sources синхронизируются владельцем вручную.
5. N₂O и LOOP — архив. Четыре ступени не обязательны: direct chat — default, дополнительные методы выбираются по задаче.

## Текущее состояние
- **P0:** root app — единственный публичный клиент; CI Chromium имеет известный failing baseline, его дефекты чинить по сути, не ослабляя assertions.
- **P1.5 — PARTIAL:** Coding Projects используют существующий project/chat store; dedicated chat, instructions, reload persistence, bundle type, project-scoped browser editor handoff и folder-name reminder. Browser grant не персистируется. Нет sandbox, shell, agent edits, branches/worktrees.
- **aNoteBooki:** общий shell и IndexedDB Notebook; source-grounded chat ограничен отмеченными фрагментами. Studio jobs без runtime честно unavailable.
- **P3:** AgentRun SQLite lifecycle/worker/context/skills существуют, но event replay/client contract, approvals и реальная изолированная среда не закрыты.
- **P5:** Service Worker кэширует публичный shell/static assets, не чувствительные API. Workspace navigation с локальным `projectId` разрешена; произвольные query URLs остаются вне cache.
- **P6–P8:** продолжать по активным acceptance criteria; не дублировать backlog в ADR/ориентирах.
- **PR #195, #187 и issue #111:** остаются открытыми до отдельного решения; полезные изменения портировать по необходимости, не merge/close.
- **Owner launch gates:** host/model, domain/Tunnel, permissioned data, native device and live deployment evidence остаются шагами владельца.
## Ближайшая последовательность
1. Прогнать focused Chromium для Coding Projects и Offline Core на exact commit; исправить реальные дефекты.
2. Довести P1 lifecycle: project chat continuity, folder reselect/recovery, metadata consistency and RU/EN/mobile.
3. Закрыть P0 Chromium product regressions, затем выполнить P0 base UI/aCodingi/Offline Core.
4. Подключать AgentRun к aCodingi только через explicit permissioned run/task contract; sandbox P3.10 default-off до isolation + approval + rollback + escape acceptance.
5. Сформировать владельцу короткую последовательность запуска из уже проверенных host/model/domain/privacy/device gates.