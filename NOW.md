# aLandi — NOW / единственный ориентир

**Срез:** 2026-11-28 · **Репозиторий:** DorpNay/skills-github-pages · **Ветка:** main
**Последний функциональный HEAD:** 9ef5177085d6a860537a237299faa23909fe604d.
**Последний docs checkpoint (parent этого NOW):** a25857920819abc3e7f826506871554af2e35a96.
**Канонический контракт:** root AGENTS.md v4.0; P0–P8 acceptance — docs/ALANDI_MASTER_PLAN_RU.md; sources/licenses/verdicts — INTEL.md.

## Governance
1. Сначала этот файл (≤100 строк), затем batch live main SHA, PR/issues и Actions exact HEAD.
2. Читать только owning spec, нужные секции Master Plan/INTEL и затронутый код.
3. Main-first с exact-parent/CAS. Без force-push, merge/close PR, destructive deletion, manual Pages deploy, Pages workflow/settings, DNS/Tunnel/host/firewall/secrets/permissions или paid resources без отдельной узкой авторизации.
4. Pages auto-publish защищён. Project Sources владелец синхронизирует вручную.
5. N₂O / LOOP / старые orienters архивированы. Четыре ступени не обязательны; direct chat — default.
6. Приоритет — реальные продуктовые срезы; тесты подтверждают работу, но не заменяют её. Не ослаблять assertions.

## Текущее состояние
- **P0:** root app — единственный публичный клиент. Full Chromium Quality on 5c5f82d: **232 passed / 35 failed**; failures include provider catalog, locale/focus, dialogs, mobile geometry, settings rollback, memory/privacy scope, Offline Core and Coding Workspace. Treat as open release blocker; inspect traces and fix product behavior, not assertions.
- **P1.5 — PARTIAL:** Coding Projects in canonical ai_projects_v1; dedicated chat, instructions, reload persistence, typed bundle import/export, scoped workspace handoff. Per-project directory handles/event metadata in IndexedDB; permission rechecked and requested only on user gesture. Recovery snapshots tied to project ID; activity timeline has allowlisted events. Metadata export excludes handles and file contents.
- **aCodingi:** browser editor supports selected files, diff, explicit approval and local recovery. Real sandbox, shell/test runner, agent edits, Git worktrees/branches and durable run approvals are not implemented.
- **aNoteBooki:** shared shell, IndexedDB Notebook and source-grounded chat over explicitly selected sources. Studio jobs without runtime honestly unavailable; keep Notebook Studio frozen behind core work.
- **P3:** AgentRun SQLite lifecycle/worker/context/skills; WAL with FULL synchronous durability; per-run event_seq/last_event_seq and legacy migration. Gateway tests pass on Python 3.12–3.14 at functional HEAD 9ef5177; generated typed client, reconnect UI, approvals and isolated production runtime remain open.
- **P5.7 — PARTIAL:** SW caches public shell/static assets, excludes sensitive API/auth, preserves previous revision cache. Offline Core reports browser storage/quota and requests persistent storage only after click. Offline dependency closure, integrity installer, quota/eviction and network-disabled proof remain open.
- **26-point owner audit:** mapped in Master Plan §0.6; most requirements were already captured, but many are specified only. See per-item status and canonical owner sections; no second backlog created.
- **Source bundle:** owner list deduplicated in INTEL.md; ambiguous names remain unresolved. No bulk downloads or blanket adoption.
- **Open queues:** PR #195, PR #187, issue #111 — inspect/retain; do not merge/close without separate decision.
- **Repository About description:** stale (“Exercise: Create a site or blog…”); suggested replacement recorded in Master Plan §0.6 / INTEL. Owner must update in GitHub UI; no metadata-write action exposed here.

## Exact-head evidence
- **Functional HEAD:** 9ef5177085d6a860537a237299faa23909fe604d.
- **Lite Gateway Tests:** run #46078897464 SUCCESS on Python 3.12, 3.13 and 3.14; includes WAL and event-sequence migration/cursor tests.
- **Pages:** run #46079180120 SUCCESS on docs parent a683c44; new docs checkpoint Pages run #46112186649 was QUEUED at last observation.
- **Graphify:** run #46078897527 SUCCESS on functional HEAD 9ef5177.
- **Quality Sentinels:** run #46078463308 FAILURE on 5c5f82d: Chromium 232 passed / 35 failed; Jekyll, integrity, security, context and root-app smoke passed. Failure is not evidence against exact newer 9ef; a fresh full suite on current code remains required.
- CI, published Pages browser, owner host/model/VPS and native-device permission evidence are separate environments.

## Следующие действия
1. Fix P0 browser/runtime failures against current code; do not weaken tests. Run full Chromium on exact new functional HEAD.
2. Implement P0.35.1 mode selector + P0.35.2–.8 visual/header/sidebar/settings package as user-visible work, then RU/EN/mobile/reduced-motion acceptance.
3. P1/P3: finish workspace continuity, isolated Coding execution, typed AgentRun orchestration, subagents, approvals and reconnect/replay.
4. P4/P5: pre-upload conversion, stable-ID Library, local folder/export/backup and portable Offline Core with network-disabled proof.
5. P2/P7/P6: transparent provider switching/retries; local voice and authorized voice profile after device/artifact gates.
6. Refresh free-first hosting/owner runbook; do not perform owner-only infrastructure actions.

## Ограничения
- Browser directory handles are profile-local; permissions may require a fresh user gesture.
- Metadata export contains allowlisted lifecycle/count metadata only; no handles or file contents.
- Deleting workspace metadata does not delete user files.
- SPECIFIED ≠ IMPLEMENTED ≠ VERIFIED. Do not claim live browser, VPS/model, native-device or full P1.5/P3/P5 acceptance without separate exact evidence.
