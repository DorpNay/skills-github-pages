# NOW — aLandi: единственная точка входа и журнал текущей работы

> **Старт:** сначала читать только этот файл, строки 1–100. Это единственный session/task checkpoint.
> **Триггер `oledue`:** тот же протокол; отдельного handoff-файла нет.
> **Полные запросы владельца:** дословный append-only архив в конце файла. На старте читать CURRENT; архив — только при необходимости точной формулировки.

## CURRENT

- **Task ID:** `LANDING-V2-2026-001`
- **Owner task received:** 2026-11-15; full verbatim request appended below.
- **Scope:** finish the 15-step Landing 2.0 plan, especially its final owner-action instructions; download/integrate all specified assets except the large model; audit/update modules against their authoritative external sources; unify product UI/UX and navigation; implement real model-backed agents and specialist tools; verify whole-system integrity and aLandi operation.
- **Authorization:** owner explicitly permits merges and plugin connections. This does not waive branch/CI/security checks or authorize deployment/destructive history changes.
- **Canonical scope:** `docs/MASTER_TASK_REGISTRY_ADDENDUM_2026-11-02_RU.md` §K; 15 items = K.1.1–K.1.14 + K.2; progress table K.5 updated in place only.
- **Owner-only action guide:** `docs/PRE_LAUNCH_STACK_RU.md` §8. These are explicit owner/environment gates, not work to fake as completed.
- **Live checkpoint:** `main` SHA `18da1a1f2c4568818fba136d50648c61a209bd74`; open PRs 0; open issue #111. This SHA contains the latest NOW owner-prompt record. No workflow runs associated with this commit were returned by the connector; CI is NOT VERIFIED for this SHA.
- **Immediate NEXT:** audit manifest/lock/download artifacts against current upstream source versions; preserve large primary checkpoint exclusion; then start first bounded UI/code slice only after code/test inspection.
- **Status:** IN PROGRESS — Landing V2 delivery; orientation consolidated to NOW.md.
- **Owner intent:** one fast entrypoint; preserve every owner request verbatim; record each material action/evidence; remove redundant orientation files; never select an old PR as a default; never revive stale tasks by default.
- **Repository / branch:** `DorpNay/skills-github-pages` / `main` (standing main-only policy).
- **Last functional baseline SHA (PROJECT_STATE snapshot):** `8e4edd83d50e6872852e7de8090934fbf6ae5f24`.
- **Live main SHA at this update:** `101e57d5a5efdbb291e0667df9e25e5fadd7e1f9` (parent of this atomic state-refresh commit).
- **Open PRs:** none
- **Open issues:** #111
- Open PRs: none
- Open issues: #111
- Routing invariant: never select an old PR as a default; route from the latest explicit owner request.
- **Live facts:** GitHub API confirms main at checkpoint parent, zero open PRs, issue #111 only. Commit `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`: `feat(github): add allowlisted read-only App connector` (2026-11-14). No workflow runs returned for this exact SHA; exact-head CI is NOT VERIFIED.
- **Prior-chat task:** not recovered. Do not infer it from old PRs, stale registry entries or historical checkpoints.
- **NEXT:** pass exact-head Freshness on this atomic checkpoint; then implement the first real model-backed AgentRun service slice. Keep sandbox installation gated on actual host facts.

## START PROTOCOL — five-second route

1. Read NOW.md lines 1–100. Identify CURRENT, status, checkpoint SHA and NEXT.
2. Batch live reads: main ref + open PRs + open issues. Check exact-head runs only for a PR explicitly matching CURRENT. Compare live SHA/queues; do not enumerate old PRs/branches unless the current owner request requires it.
3. Latest explicit owner request in this conversation wins. Otherwise resume CURRENT. Never select an old PR, task-register item or roadmap entry by default.
4. Read only source, tests and specifications directly required by that task. PROJECT_STATE, VOLLEY_LOG, registries, orchestrator and architecture maps are on-demand references, never startup ritual.
5. Before implementation, append the complete new owner message verbatim to OWNER REQUEST ARCHIVE. After every material action append a dated JOURNAL entry with exact paths, SHAs, commands/results, limits and next step; update CURRENT/NEXT when changed.
6. Never store hidden reasoning, secrets, credentials or unnecessary sensitive personal data. If a prompt contains such material, redact only that span and mark the redaction.
7. Engineering: inspect diff; run focused checks; verify exact current HEAD and corresponding CI. Main-only; no PR creation unless owner changes that policy. No merge/deploy/force-push/rebase/reset/history rewrite/destructive data action without explicit authorization.

## RECORD FORMAT

`[YYYY-MM-DD] STEP-ID | status | task | changed paths | exact evidence/checks | limits | next`

Statuses: `FACT`, `PROPOSAL`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`. A document edit or successful build alone is not VERIFIED.

## JOURNAL — latest first

- [2026-11-15] S-011 | VERIFIED | Fixed pre-existing Ruff E731 in `gateway/tests/test_github_app.py` with a typed helper. | Main commit `101e57d5a5efdbb291e0667df9e25e5fadd7e1f9`. | Gateway #43621379836 PASS (Python 3.12/13/14); Quality #43621379825 PASS (7 jobs incl. Ruff, Security, Integrity, Context, Chromium, Jekyll and release contract); Graphify #43621379893 PASS; Pages #43621380121 SUCCESS — exact SHA. | Freshness #43621323351 failed on prior parent `137bf621d7c9a7dd67e0af49fb3b54413bc722e8` because snapshot lagged; all 19 checker tests passed. Provenance exact-main UNVERIFIED. | Complete atomic checkpoint and rerun Freshness.
- [2026-11-15] S-010 | VERIFIED / UPSTREAM AUDIT | whisper.cpp v1.9.5 remains latest stable (2026-10-06); upstream HEAD `5922450fbce1ed9d1648babd0d5ac4520055b436` (2026-11-13) is an untagged CMake/Windows fix, not a new release. No official model named Whisper 3; large-v3/large-v3-turbo remain official names. Piper v1.8.0, Tesseract 5.5.4, Ollama v0.40.16 and OpenShell v0.1.8 are latest stable; pypdf 7.1.0 is current. FastAPI 0.163.0 (2026-11-14) is newer than lock 0.162.0 but held by seven-day cooldown until 2026-11-21; Pydantic 2.14.3 (2026-11-05) is a lock-refresh candidate vs 2.14.1. | Official upstream release pages recorded in INTEL.md. | No dependency lock changed. Qwen3-ASR 0.6B remains staged challenger; 1.7B deferred pending host fit and same-audio RU/EN/TH eval. | Refresh Pydantic lock only after generated lock + gateway/document matrix; re-evaluate FastAPI after cooldown.
- [2026-11-15] S-009 | VERIFIED | OpenShell v0.1.8 Ubuntu 24.04 x86_64 acquisition succeeded: run #43616944431, artifact #14122692509, 207,414,886 bytes, SHA-256 `d99d484ec2465f713b91b93cc37bf18cd1ad73ebe90d48d5a10f55572a2a9543`; all six pinned assets passed SHA/package/archive checks. | Run head `a71a117f2217449a00f32b3a14a06fa56a6a2808`; artifact expires 2026-11-28. | Actions artifact only, not installed. Target OS/architecture, kernel, Docker/VM, disk/RAM and network remain unverified. | Keep staged until host compatibility is confirmed; install only through §8 owner runbook.


- [2026-11-15] S-008 | FACT | Exact-main CI audit found the freshness failure is a stale/incomplete NOW checkpoint contract: checker expects functional baseline SHA `8e4edd83d50e6872852e7de8090934fbf6ae5f24`, literal open-queue markers, and exact no-default-PR wording. 19 freshness unit tests passed. | Main before fix `638cd2e7d537f923d9d79dc9983f58eb11b412cf`; Freshness #43621101052 FAIL; Pages #43621100962 SUCCESS; Quality #43621101004 still running, with Static Analysis failed Ruff gate. | No code behavior change. | Fix NOW contract and rerun exact-main Freshness; inspect Ruff JSON before touching code.


- [2026-11-15] S-006 | FACT | Resolved canonical task ID and source: `LANDING-V2-2026-001`, addendum §K; K.1.1–K.1.14 + K.2 = 15; status table K.5. Owner-only actions are in `docs/PRE_LAUNCH_STACK_RU.md` §8. | Live main `18da1a1f2c4568818fba136d50648c61a209bd74`; 0 open PRs; issue #111 open. | `OLEDUE.md`, `ORIENTER.md`, `project-reference/FILE_ORIENTER_RU.md` return 404 on live main; root `AGENTS.md` mandates NOW.md. No Actions runs returned for current main SHA. | Do not revive stale orienter pointers in older docs; use addendum K and owner §8 only as task-specific source. | Inspect artifacts/lock and revalidate upstream versions.


- [2026-11-15] S-005 | IN PROGRESS | Owner started `LANDING-2.0-2026-001`; verbatim request captured below. | No implementation yet. | Authorization includes merges and plugin connections; all large-model downloads excluded. | First inspect exact 15-step plan and last owner-action instruction; establish current main SHA and focused task scope.


- [2026-11-15] S-004 | IN PROGRESS | Replace orientation ritual with NOW.md; update AGENTS, freshness checker/tests/workflow and active pointers; delete obsolete orientation docs. | Parent `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`. | Checks pending. | Keep machine-readable product state and historic evidence as on-demand references, not startup docs. | Run focused tests and inspect exact main diff.
- [2026-11-15] S-003 | FACT | Live GitHub: main `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`, 0 open PRs, issue #111 only. Startup duplicated across AGENTS, OLEDUE, ORIENTER, two FILE_ORIENTER copies, orchestrator, YAML state, JSON snapshot and log. Freshness CI required old orienter files. | Live GitHub API. | No exact-SHA workflow runs returned for `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`. | Migrate checker before deleting required paths.
- [2026-11-15] S-002 | PROPOSAL | One root checkpoint plus append-only full prompt and step journal. Detailed product docs remain on-demand. | Explicit owner authorization. | Redact secrets/private personal data from prompt archive. | Implement atomically on main.
- [2026-11-15] S-001 | FACT | Captured both owner messages below. | Conversation. | Prior chat's active task was not recoverable. | Do not invent missing task.

## OWNER REQUEST ARCHIVE — verbatim, append-only

### OR-2026-11-15-001 — initial request

```text
Ну так, блядь, я тебе каждый раз нахуй, каждый запрос прошу. Сделай и исправь это ёбаное ориентирование. Почему ты с ним так мудришь? Мы все лимиты на него тратим. Только и делаешь, блядь, что в файлах ориентируешься. Раз-два и всё, и потом уже нахуй чат не отвечает, не загружается, блядь. И никакой работы не сделано в итоге. Что, нельзя, что ли, блядь, сделать один файл, в который ты будешь каждый свой шаг нахуй указывать поэтапно, когда ты его сделал, чтобы потом, блядь, сориентироваться по нему, сразу к нему обращаться? Как ты его так назвать, чтобы ты сразу на него внимание обращал? Как в какое-то такое место положить, чтобы вот которое ты в первую очередь обращаешься, когда тебе там слово all I do пишешь, например. И блядь, чтобы ты, потому что тебе когда говоришь просто сориентируйсь, ты берёшь, начинаешь с какого-то там старого PR продолжать работу. Что, нельзя, что ли, блядь, этот файл сделать так, чтобы ты к нему обращался, чтобы это было быстро, чтобы мы на это не тратили время? И блядь, туда как-то фиксировать задачи каждую прям кропотливо и детально. И мои сообщения, что ли, туда тоже дублировать, блядь. Каждое, каждое, когда я присылаю. Мои задачи, промпты целиком сообщения, блядь, чтобы в следующем чате могли к нему отослаться, и мне не пришлось его заново печатать. Сейчас у нас есть all do, ориентир, statement. Там ещё дохуя всякой хуйни. Блядь, сделай уже всё это комплексно. Я не знаю, упрости в один файл, продумай так, чтобы то место, в которое ты обращаешься в первую очередь, куда бы ты посмотрел. Туда его и положи, так и назови, который ты первый откроешь. И вот сделай так, чтобы, блядь, на него тратить пять секунд, а не всё время, блядь, так что проект на месте стоит, ёбаный в рот, блядь
```

### OR-2026-11-15-002 — follow-up and explicit scope

```text
А я тебе говорю, до ума сука все доводи и лишнее ориентирование и его файлы удаляй назуй. А то я тебя знаю, ты их потом в запрос включишь и опять назуй интерфейс 10 дневной давности оформишь блять  (вот нахуй предыдущее сообщение: а то вдруг ты не догадаешься про него вспомнить блять: Ну так, блядь, я тебе каждый раз нахуй, каждый запрос прошу. Сделай и исправь это ёбаное ориентирование. Почему ты с ним так мудришь? Мы все лимиты на него тратим. Только и делаешь, блядь, что в файлах ориентируешься. Раз-два и всё, и потом уже нахуй чат не отвечает, не загружается, блядь. И никакой работы не сделано в итоге. Что, нельзя, что ли, блядь, сделать один файл, в который ты будешь каждый свой шаг нахуй указывать поэтапно, когда ты его сделал, чтобы потом, блядь, сориентироваться по нему, сразу к нему обращаться? Как ты его так назвать, чтобы ты сразу на него внимание обращал? Как в какое-то такое место положить, чтобы вот которое ты в первую очередь обращаешься, когда тебе там слово all I do пишешь, например. И блядь, чтобы ты, потому что тебе когда говоришь просто сориентируйсь, ты берёшь, начинаешь с какого-то там старого PR продолжать работу. Что, нельзя, что ли, блядь, этот файл сделать так, чтобы ты к нему обращался, чтобы это было быстро, чтобы мы на это не тратили время? И блядь, туда как-то фиксировать задачи каждую прям кропотливо и детально. И мои сообщения, что ли, туда тоже дублировать, блядь. Каждое, каждое, когда я присылаю. Мои задачи, промпты целиком сообщения, блядь, чтобы в следующем чате могли к нему отослаться, и мне не пришлось его заново печатать. Сейчас у нас есть all do, ориентир, statement. Там ещё дохуя всякой хуйни. Блядь, сделай уже всё это комплексно. Я не знаю, упрости в один файл, продумай так, чтобы то место, в которое ты обращаешься в первую очередь, куда бы ты посмотрел. Туда его и положи, так и назови, который ты первый откроешь. И вот сделай так, чтобы, блядь, на него тратить пять секунд, а не всё время, блядь, так что проект на месте стоит, ёбаный в рот, блядь) @GitHub  думай УСЕРДНЕЕ
```

### OR-2026-11-15-003 — landing 2.0 task

```text
Окей, раз тот чат не грузится еще раз: делаем , доводим до финализации и до ума landing 2.0 2026 001. 15 шагов в него включены, очень важны - конец списка там инструкция моих действий. Все скачиваем кроме большой модели, абсолютно все, собираем. Пере проверяем работоспособность и актуальность модулей. Например, вышел whisper 3, если он новее - качаем, внедряем. При проверке модулей, типа кодера - проверяем внешние источники из списка, подходящие по данной конкретной тематике, извлекаем лучшее, собираем идеально. Стараемся держать только main, на самом сайте не забудь про единую концепцию визуалов, кнопок, текста, анимации, размеров, движений, удвоений и тд. Минимизация текста, минималистичность, статусы, индикаторы, упрощение текстов и инструкций, систематизация и умная сортировка всего сайта, его функций и настроек, перепроверка логики включения, комбинаций, правильности смыслов режимов, типа быстро, дольше. Важно выдвигающееся меню функций, где агенты, глубокие исследования, и тд. Каждый с отдельным меню, агенты настоящие с моделями, не имитация, у них лучшие решения типа зарнесов, окна статуса из работы, разных режимов на выбор и способов настройки. Инструменты  типа конвертера файлов, считывателя сайтов и конвертации в кодинговый формат для удобства кодинга самого Ии-агента-кодера. Ноутбук. Все это пожалуйста в свой now тоже фиксируй, и каждый свой шаг. И в начале этого файла сам себе инструкции дай, чтоб точно не запутаться. Не забывай избавляться от рудиментов, проверять целостность всей системы и работоспособность aLandi. Даю добро на мерджи и подключение плагинов; кодекса, exa, и всего, что тебе нужно для эффективнейшей работы. @GitHub
```

- [2026-11-15] S-007 | IN PROGRESS | Upstream audit started from `INTEL.md`, model manifest/lock and current release sources. | Current manifest and lock last updated 2026-11-13; INTEL review date 2026-11-04. | Existing model/runtime assets are recorded as downloaded in GitHub Actions, not installed on target host. | Compare current release tags/commits/licenses; do not claim target installation.
