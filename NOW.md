# NOW — aLandi: единственная точка входа и журнал текущей работы

> **Старт:** сначала читать только этот файл, строки 1–100. Это единственный session/task checkpoint.
> **Триггер `oledue`:** тот же протокол; отдельного handoff-файла нет.
> **Полные запросы владельца:** дословный append-only архив в конце файла. На старте читать CURRENT; архив — только при необходимости точной формулировки.

## CURRENT

- **Task ID:** `CONTINUITY-NOW-001`
- **Status:** IN PROGRESS — consolidate orientation and continuity.
- **Owner intent:** one fast entrypoint; preserve every owner request verbatim; record each material action/evidence; remove redundant orientation files; never revive stale PR/tasks by default.
- **Repository / branch:** `DorpNay/skills-github-pages` / `main` (standing main-only policy).
- **Checkpoint parent SHA:** `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`
- **Open PRs:** none
- **Open issues:** #111
- **Live facts:** GitHub API confirms main at checkpoint parent, zero open PRs, issue #111 only. Commit `54ab1604bcc64f25a2edd4a24d08f06158ea1c08`: `feat(github): add allowlisted read-only App connector` (2026-11-14). No workflow runs returned for this exact SHA; exact-head CI is NOT VERIFIED.
- **Prior-chat task:** not recovered. Do not infer it from old PRs, stale registry entries or historical checkpoints.
- **NEXT:** finish this refactor; run focused freshness tests; inspect exact resulting main commit. Afterward continue only the latest explicit owner task recorded here.

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
