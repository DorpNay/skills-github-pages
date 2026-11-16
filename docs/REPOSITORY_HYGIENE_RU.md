> **Historical research snapshot — PR #131 / 2026-10-31; imported 2026-11-08.** Main baseline at this audit is `bf039f887e29137b627b06fc2bb107c2793d6b69` (PR #173 merged). This file preserves source-derived findings and requirements; it does not assert current runtime implementation. The canonical active task register is `docs/MASTER_TASK_REGISTRY_RU.md` plus its existing addendum. Current source admission/review status is tracked in `INTEL.md`.
> **Current boundary:** Any branch/PR inventory below is a historical snapshot. Always use live GitHub state; the current owner policy is main-only, with one temporary exact-head PR at a time and immediate merge/closure after required gates pass.

---

# Гигиена GitHub-репозитория aLandi

**Назначение:** безопасно поддерживать репозиторий в понятном состоянии после крупных инженерных этапов. Это операционный чек-лист, а не разрешение на автоматическое удаление или переписывание истории.

## 1. Принципы

- Источник истины — Git-история, содержимое файлов, открытые PR/issues, Actions и фактические ссылки/импорты. Название ветки или возраст файла сами по себе не доказывают бесхозность.
- Сначала инвентаризация и доказательства, затем ограниченная уборка, затем повторная проверка.
- Не объединять в один проход массовый rename, форматирование, удаление файлов и обновление зависимостей.
- Не менять main, защищённые ветки, чужие/активные workstreams и owner-only инфраструктуру без отдельного основания.
- Сохранять обратимость: фиксировать SHA удаляемой ветки/файла и способ восстановления.

## 2. Инвентаризация веток

Для каждой ветки записать: имя, HEAD SHA, дату последнего commit, связанный PR/issue, PR state/draft, base branch, compare status и ancestry относительно default branch.

**Ветка может быть кандидатом на удаление только если одновременно подтверждено:**

1. это не default/protected/release branch;
2. нет открытого PR, незакрытого review или активной issue, которая на неё ссылается;
3. ветка относится к завершённому/слитому PR либо её уникальные изменения уже перенесены и сверены;
4. её HEAD уже достижим из актуальной целевой ветки (или есть отдельное документированное доказательство, что уникальной работы не осталось);
5. workflow, release scripts, docs и внешние инструкции не используют имя ветки/SHA;
6. сохранён SHA и понятен способ восстановления.

Если ветка diverged/unmerged, связана с draft/hold/future PR или содержит уникальные коммиты — **оставить**, пометить как active/hold либо вынести владельцу на решение. Не удалять только потому, что ветка старая.

## 3. Инвентаризация файлов и кода

Перед удалением файла проверить:

- статические и динамические imports/require, fetch()/script/style URLs, Jekyll includes/layouts, YAML workflow paths и generated artifacts;
- ссылки из README, docs, project state, skills, issue/PR templates и других markdown;
- E2E/unit tests, fixtures, package/lock/config files, deployment/runbook references;
- persistence contracts, localStorage keys, migration code, external integrations and backwards compatibility;
- результаты dead-code/static-analysis tools вручную: protocol/interface methods, plugin entry points, reflection and runtime-loaded files могут быть false positives.

Удалять только при согласованном доказательстве отсутствия runtime, build, test, docs и compatibility references. Исторические исследования с самостоятельной ценностью архивировать, а не стирать автоматически.

## 4. Pull requests и документация

- Проверить открытые PR на актуальность, дубли, зависшие draft/hold, понятный scope, base/head и точный статус CI.
- Не закрывать future/hold PR автоматически; сначала проверить назначение и уникальные решения.
- Убедиться, что PR body, README, AGENTS.md, ORIENTER.md, docs/PROJECT_STATE.yaml, living checklists, architecture map, decisions и engineering log не противоречат друг другу.
- В каждом checkpoint разделять code/test SHA, documentation SHA, exact-head CI evidence и manual gates.
- Не переносить результаты CI с другого SHA/ветки и не называть конфигурацию workflow доказательством успешного запуска.

## 5. GitHub Actions и зависимости

- Для Actions использовать immutable commit SHA pins с читаемым version comment; проверять обновления отдельным контролируемым изменением.
- Ограничивать workflow permissions принципом least privilege; проверять pull_request/push/workflow_dispatch triggers, concurrency, timeouts и artifact retention.
- Не хранить credentials в репозитории; проверять .gitignore, example env files и отсутствие реальных ключей в docs/tests/logs.
- Проверять lockfiles, прямые и транзитивные зависимости, security advisories и воспроизводимость установки; не обновлять все версии одновременно.
- После dependency changes выполнять соответствующие tests, security scans и provenance checks на exact HEAD.

## 6. Настройки безопасности GitHub

Владелец репозитория периодически проверяет через GitHub Settings/Security:

- branch protection или repository rulesets для main (PR requirement, required status checks, conversation resolution, запрет force-push и удаления, явно ограниченный bypass);
- уникальность имён required status checks между workflows;
- минимальные Actions permissions и ограничения на создание/изменение workflows;
- Dependabot alerts/security updates, dependency graph/review;
- secret scanning и push protection, code scanning/CodeQL, SECURITY.md и private vulnerability reporting — с учётом доступности функций на текущем плане;
- collaborator/app/token permissions и least-privilege access.

Не включать обязательное число approvals, которое невозможно выполнить в текущей модели единственного сопровождающего. Для чувствительных путей рассмотреть CODEOWNERS, но только если назначенные owners реально существуют и могут review.

## 7. Ритм и отчёт

Запускать аудит после завершения крупного пласта (например, закрытия implementation pass 8.1–8.17 до полного Chromium/Quality gate), а затем регулярно по мере churn.

Отчёт должен содержать:

- дату, default branch SHA и проверенные PR/branch snapshots;
- список подтверждённых проблем и evidence;
- кандидаты на удаление с обоснованием и rollback SHA;
- выполненные действия и точные commit SHA;
- то, что оставлено намеренно (active PR, hold/future work, compatibility keys, historical research);
- проверки после уборки и оставшиеся ограничения.

## 8. Официальные источники

- [GitHub — Best practices for repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories)
- [GitHub — About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub — About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub — Quickstart for securing your repository](https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository)
- [GitHub — Managing and standardizing pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reference/managing-and-standardizing-pull-requests)

**Текущий статус:** регламент подготовлен; полный branch/file/security-settings cleanup ещё не выполнялся. Наличие доступа к GitHub API не означает, что все настройки репозитория доступны через интеграцию.


## 9. Первичная инвентаризация — 2026-11-02

**Снимок:** default branch `main` `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`; PR #131 HEAD на момент аудита `d28c2f01ac8d6b3a6867f358b7d7131dc6062e7f`. Read-only инвентаризация; полный ancestry-аудит каждой ветки ещё не выполнен.

### Подтверждённые факты
- GitHub API вернул **126 веток** (100 + 26 на двух страницах) и **9 открытых PR** (#124–#132).
- **117 веток** не являются head открытого PR. Это очередь для классификации, а не список на удаление: PR/issue-контекст, ancestry, уникальные коммиты и ссылки ещё не проверены для каждой ветки.
- `delete_branch_on_merge=false`; repository rulesets API вернул пустой список.
- Classic branch protection для `main` проверить не удалось: интеграция получила 403 `Resource not accessible by integration`. Наличие/отсутствие классической защиты неизвестно.
- В root, `.github/` и `docs/` не найдены `CODEOWNERS` и `SECURITY.md`; в стандартных местах не найдена Dependabot config. Это не доказывает, что account-level security alerts выключены.
- PR #131 открыт, не объединён; GitHub сообщает `mergeable_state=dirty`. Rebase/sync не выполнялись.
- На точном PR #131 HEAD нет Quality/Chromium run или commit status. Provenance run `41336870473` прошёл на SHA `5b9aa7abcc70fc1fa6f3c0fba402e025cb44c772`; это предшествующий head, не текущий. Quality #1126 — старый SHA `7cdf35d581d9d6bca39256e67a0b0db6083e486c`, Chromium 101 passed / 18 failed; результат не относится к текущему HEAD.
- PR #132 остаётся отдельной открытой draft-документацией; её проверки не являются доказательством качества V2-кода PR #131.

### Дальнейшие действия
1. **P0:** проверить все 117 веток вне открытых PR по дате последнего commit, связанным PR/issues, compare/ancestry, уникальным коммитам и ссылкам в workflows/docs/runtime. Только затем выделять подтверждённые кандидаты на удаление.
2. **P1:** владелец проверяет Settings → Rules → Rulesets и Branches → branch protection для `main`; не вводить невыполнимые обязательные approvals.
3. **P1:** владелец проверяет secret scanning/push protection, Dependabot alerts/security updates, dependency graph/review и CodeQL. Отдельно решить, нужны ли `SECURITY.md`, `CODEOWNERS` и Dependabot config.
4. **P2:** после классификации обсудить автоматическое удаление веток после merge; сохранять SHA и recovery path.

### Граница выполненных действий
- Не удалялись ветки, файлы, PR, Actions artifacts или workflow runs.
- Не менялись rulesets, branch protection, Actions permissions или security settings.
- Не выполнялись merge, rebase, force-push, закрытие PR или deployment.
- Полный ancestry/reference аудит и owner-side security settings review остаются открытыми.

Официальные ориентиры: [GitHub repository best practices](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories), [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [security quickstart](https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).


## 10. Graphify source-coverage follow-up

During the 2026-11-02 continuation, a concrete CI hygiene gap was found: after the browser runtime/styles moved from `index.md` into static assets, the Graphify Code-Only Pilot path filters did not include those extracted files. The workflow now watches `assets/js/**/*.js`, `assets/css/**/*.css` and `landing/**/*.html` on PR and main-push events.

This is a narrow, reversible CI configuration correction. The Graphify workflow/artifact has not yet been confirmed on the new head. No branch cleanup, repository settings mutation, history rewrite, merge or deployment was performed.


## 11. Подробный snapshot инвентаризации — 2026-11-02

**Проверенная база:** main SHA 0a1f764f295f92e49e347cdc972f8c6c9a07e4c1. В GitHub branch listing получено 126 веток (100 в первой странице + 26 во второй); открытых PR — 9 (#124–132), закрытых PR — 100. Для всех 100 закрытых PR получены metadata с head branch и merged flag.

### Ветки, которые сохраняем

- Все 19 закрытых, но не merged PR имеют уникальные коммиты относительно main (ahead > 0); их ветки не удалять. Среди них есть отдельные голосовые, document-attachment, RAG, security и UX workstreams. Нужен отдельный review, прежде чем переносить или закрывать эту работу.
- Все 10 веток без связанного PR, у которых compare показывает ahead > 0, содержат уникальные коммиты; оставить для отдельной triage.
- future-workstreams/parking-base-20261031 намеренно обозначена как парковочная база. Хотя она behind-only, сохранить.

### Подтверждённые кандидаты на удаление веток

Для каждой ветки ниже GitHub compare к main показал ahead = 0 (текущая ветка полностью позади main), а поиск кода и PR по точному имени не нашёл ссылок:

| Branch | Compare main | Решение |
|---|---:|---|
| feat/alandi-helper-model-routing | 0 ahead / 165 behind | Candidate — удалить после ручного подтверждения владельцем |
| feat/rag-rrf-engineering-audit-rebased-20261027 | 0 / 111 | Candidate — удалить после ручного подтверждения владельцем |
| fix/provider-model-catalogs-v2 | 0 / 182 | Candidate — удалить после ручного подтверждения владельцем |
| fix/pyodide-setup | 0 / 270 | Candidate — удалить после ручного подтверждения владельцем |
| fix/theme-persistence-e2e-isolation | 0 / 178 | Candidate — удалить после ручного подтверждения владельцем |

Удаление не выполнено: доступная GitHub-интеграция не предоставляет операцию удаления branch ref. Удалить эти пять веток можно через GitHub UI после последней проверки их отсутствия в открытых PR/issues и сохранения commit SHA. Не удалять остальные ветки по одному лишь возрасту.

### Файлы и настройки

- Подтверждённых бесхозных файлов не найдено; файлы не удалялись.
- В main на snapshot не найдены SECURITY.md, CODEOWNERS и .github/dependabot.yml. SECURITY.md добавлен в PR #131 и PR #132, но ещё не в main.
- CODEOWNERS пока не добавлен: сначала нужно подтвердить реальный независимый reviewer; self-review requirement может блокировать PR единственного автора.
- Dependabot config отложен до завершения PR #124: он добавляет uv.lock и обновляет Python dependency contract; не стоит создавать конкурирующий dependency-update поток до фиксации этого контракта.
- Проверены workflow quality-sentinels.yml и gateway-tests.yml: они ограничивают GITHUB_TOKEN permissions до contents: read и используют immutable SHA-pinned Actions. Quality workflow запускает scripts/check-action-pinning.mjs.
- Настройки branch protection/rulesets, secret scanning, push protection, Dependabot alerts/security updates и CodeQL нельзя прочитать через доступные действия интеграции. Их состояние **не подтверждено**; нужен ручной просмотр Settings → Rules/Branches и Security & analysis.

**Итог:** найдено пять доказуемых branch cleanup candidates, но удаление не выполнено из-за отсутствия branch-delete action. Все ветки с уникальными коммитами и все закрытые unmerged PR workstreams сохранены.

## 12. Security policy follow-up

The 2026-11-02 branch inventory found no SECURITY.md on main. A responsible vulnerability-reporting policy has since been added as SECURITY.md in PR #131 and mirrored in PR #132. It directs reports to GitHub private vulnerability reporting when enabled, otherwise to the repository owner, prohibits public disclosure of secrets/user data, and does not promise an unsupported response-time SLA.

This file is present only on the feature/documentation branches until their owner-approved merge. It does not establish that private vulnerability reporting, secret scanning, push protection, CodeQL or branch protection are enabled. Those settings still require owner-side verification.


## 13. GitHub Skills exercise scaffolding and repository identity — 2026-11-02

### Confirmed remnants

- .github/workflows/0-start-exercise.yml, 1-step.yml, 2-step.yml, 3-step.yml still reference skills/exercise-toolkit and skills/action-*.
- 0-start-exercise.yml listens to push on main, grants contents: write, and its dependent job creates/replaces _config.yml and index.md if the exercise path proceeds.
- .github/steps/1-step.md–4-step.md are associated GitHub Pages exercise instructions.
- temp/1 and temp/2 are large historical research notes with references to the original GitHub Skills template. Reconcile unique useful content with current canonical docs before archiving/removing.
- Issue #1 is already documented as a closed historical exercise, not a product defect.

### Safe cleanup sequence

1. Verify the repository's is_template flag and inspect run history for the four exercise workflows. The current integration did not expose the template flag or repository-wide workflow history.
2. If the exercise scaffold is no longer needed, remove the four exercise workflows and their .github/steps instructions together in a dedicated change. Do not delete them until the trigger/condition behavior is confirmed.
3. Review temp/1 and temp/2 for unique references, decisions or source links. Archive only if they contain useful historical material; otherwise remove after preserving needed facts in canonical docs.
4. Keep skills/*.txt: these are aLandi task profiles, not the GitHub Skills exercise toolkit.
5. Preserve the actual GitHub Pages/Jekyll publishing configuration and Quality, Security, Graphify and deployment automation. Determine the real publishing source before removing any workflow.

### Repository rename gate

GitHub's repository-renaming guidance says project Pages URLs are not automatically redirected. Rename to aLandi/alandi only after a stable custom domain is configured and a migration checklist covers baseurl, canonical/OG metadata, absolute links, OAuth redirect URIs, Actions/reusable-workflow references, local clone remotes and published-site smoke.

No files, workflows, settings, branches or repository names were deleted or changed in this audit.


## 10. Продолжение аудита — 2026-11-02, PR #131

### Проверка CI и публикации
- Текущий PR #131 HEAD на момент аудита: 9a23d58313da6379cb112b617daedeaa6d38f605.
- Quality #1234 (run 41363212486) завершился success за 105 секунд: 4/4 Chrome shards, 128/128 E2E passed; preflight, static analysis, Integrity, Security, Context и Jekyll passed.
- Published-site smoke в этом PR run был skipped; это не проверка preview и не подтверждение новой публикации.
- Quality #1233 на предыдущем SHA завершился failure из-за невидимого #uiTextContrast в одном тесте. Следующий exact-head run #1234 прошёл без изменения исходников. Наблюдать за нестабильностью; не считать доказанным дефектом production UI.
- Ускорение относительно #1197 пока не заявляется: baseline 1863s закончился timeout и не завершил сопоставимый набор тестов.

### V2 preview и граница V1
- В репозитории обнаружен один Pages-проект и один опубликованный адрес. Развёртывание PR artifact в этот Pages target заменит опубликованную V1 версию, поэтому такой способ запрещён.
- Отдельный GitHub Pages URL требует второго Pages site/repository либо отдельного хостинг-проекта. Preview пока не развёрнут; V1 не затронута.
- Перед публичным preview: отдельный target, минимальные Pages permissions, PR-only deployment, immutable artifact, защита от fork PR secrets, retention/cleanup и smoke test. Не давать preview workflow права на production Pages target.

### Ветки и файлы
- Снимок branch API показывает 126 refs; 117 не являются head открытого PR. Это не эквивалентно 117 бесхозным веткам.
- В подключённом GitHub toolset нет операции удаления branch/ref. Ничего не удалено. Пять ранее выявленных behind-only кандидатов требуют повторной проверки открытых PR/issues, commit ancestry, уникальных изменений и ссылок до удаления через GitHub UI/API владельцем.
- Уникальные коммиты, закрытые unmerged PR и future-workstream ветки сохранять. Файлов-кандидатов на удаление с доказанной ненужностью пока нет.

### Результат
- Документация состояния обновлена в ORIENTER.md, docs/PROJECT_STATE.yaml и docs/VOLLEY_LOG.md.
- Никаких branch/file deletions, merges, rebases или production deployments не выполнялось.
- Следующий этап: отдельный preview target; подробный upstream triage 60 owner-provided repositories; повторная branch ancestry audit; продолжение UI acceptance scope.

## Workflow supply-chain audit — 2026-11-02

- Audited `.github/workflows/*.yml` on both `main` and PR #131 branch.
- Inventory: 13 workflow files, 33 external `uses:` references (actions and reusable workflows).
- Result: 33/33 pinned to full 40-character commit SHAs; zero mutable tag references on either ref.
- This verifies workflow reference pinning only. GitHub Rulesets, required reviewers/status checks, force-push protection and repository security settings still require live owner/admin inspection.

## Transitive reusable-workflow pinning — 2026-11-02

- Direct workflow references on main and PR #131: 33/33 pinned to full commit SHAs across 13 files.
- Pinned reusable workflows from `skills/exercise-toolkit` were inspected at exact ref `ebf43bb96882683e03e667184c6445ed4c8074e6`. Their nested calls still use mutable tags: `actions/checkout@v4`, `actions/github-script@v7`, `EndBug/add-and-commit@v9`, `skills/action-text-variables@v2`. Upstream default branch has moved to newer tags (checkout@v6, github-script@v9, add-and-commit@v10, action-text-variables@v4), still mutable.
- The parent reusable workflow is SHA-pinned, but this does not pin nested action refs. Full transitive supply-chain pinning is therefore **not complete**. Keep as a separate scoped issue/PR; no external repo or main workflow changed in PR #131.
- Permission review: write scopes in exercise workflows support README commits, issue comments/closure and workflow enable/disable. Other eight repository workflows are read-only. This does not verify live repository rulesets or admin settings.


## 14. Повторная live-сверка — 2026-11-03

**Снимок на начало аудита PR #131:** `main` = `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`; PR #131 открыт, HEAD `fd9eee63d781ca2fc8c276edafb79d97f6810c56`, base/merge-base `e78a73b25725bfa63370d9946887cbbacbf51b82`, GitHub сообщает mergeable=false; compare `main...branch` = 989 ahead / 4 behind. Поиск веток вернул 127 refs (100 + 27), открытых PR — 10 (#124–#133), открытая issue — #111.

### Повторно подтверждённые branch cleanup candidates

Каждая ветка по-прежнему behind-only относительно актуального main (ahead=0); SHA зафиксированы для восстановления. В текущем списке открытых PR эти ветки не являются head:

| Branch | HEAD SHA | Compare main | Disposition |
|---|---|---:|---|
| `feat/alandi-helper-model-routing` | `55248f81585c52d7cc7ba7cfc08158a291a761ca` | 0 / 165 behind | Candidate — удалить только после последней проверки issue/reference и сохранения SHA |
| `feat/rag-rrf-engineering-audit-rebased-20261027` | `9aa36465158c27c49ff647a6ce349b46a6e1151e` | 0 / 111 behind | Candidate — то же условие |
| `fix/provider-model-catalogs-v2` | `e58b5d1d96a01e6a1a7a1b37b029244ea0b8dcb4` | 0 / 182 behind | Candidate — то же условие |
| `fix/pyodide-setup` | `d9fb63bd27463399d152627d290f7ec19d2f99e1` | 0 / 270 behind | Candidate — то же условие |
| `fix/theme-persistence-e2e-isolation` | `041c3a5448ff00b46a7583b3611892dc756a055b` | 0 / 178 behind | Candidate — то же условие |

Это повторная проверка ancestry и открытых PR, но не полный поиск каждого упоминания по всем закрытым issues, внешним инструкциям и workflow. Удаление в этой сессии **не выполнено**: доступный GitHub connector не предоставляет delete-branch/delete-ref action. Не подменять удаление перемещением ref. Ветки с уникальными коммитами, активными PR и future/HOLD workstreams сохранены.

### Файлы, Actions и настройки

- Подтверждённых бесхозных файлов нет. Не удалять исторические research notes только по возрасту.
- Exercise scaffold в `.github/workflows/0-start-exercise.yml`, `1-step.yml`, `2-step.yml`, `3-step.yml` и `.github/steps/` остаётся кандидатом на отдельный аудит: template state и полная история запусков не доступны через текущую интеграцию. До проверки не удалять.
- `skills/*.txt` — реальные aLandi task profiles; не путать их с GitHub Skills exercise toolkit.
- 33 direct GitHub Actions references ранее были проверены как full-SHA pinned. Transitive refs внутри pinned reusable exercise workflows остаются отдельным supply-chain gap.
- Vercel project search для этого repo вернул 0 проектов. Текущий Pages target публикует stable V1; использовать его для PR preview нельзя. Нужен отдельный owner-approved preview target.
- GitHub Rulesets/classic branch protection, secret scanning/push protection, Dependabot alerts/security updates и CodeQL остаются owner-side checks; текущая интеграция не подтверждает их состояние.
- Issue #111 остаётся открытой консолидированной записью release gates; CI не закрывает VPS/Tunnel/Ollama, hardware, permissioned RAG data, real-device voice и account-level governance.

**Итог:** 5 behind-only refs подтверждены как cleanup candidates, но не удалены из-за отсутствия безопасной delete-ref операции; бесхозных файлов/инструментов с доказанной ненужностью не найдено; 10 открытых PR сохранены в своих workstream-границах. Следующий безопасный шаг для владельца — удалить только эти пять refs через GitHub UI после последней проверки ссылок/issue и сохранения приведённых HEAD SHA.


## 10. Supply-chain revalidation — 2026-11-08

**Main evidence:** exact main `bf039f887e29137b627b06fc2bb107c2793d6b69`; Quality run #42410163178, Integrity job #128516358240. Step **Enforce immutable GitHub Action references** passed and reported 14 workflow files inspected.

- Independently fetched all 14 current `.github/workflows/*.yml` files and counted **62 direct external `uses:` references**. All **62/62** resolve syntactically to full 40-character commit SHAs; zero mutable direct refs were found.
- The local checker `scripts/check-action-pinning.mjs` enforces full-SHA syntax in the repository's workflow files. It does **not** recursively inspect dependencies inside third-party reusable workflows.
- The five exercise workflows call `skills/exercise-toolkit` reusable workflows pinned to exact commit `ebf43bb96882683e03e667184c6445ed4c8074e6`. At that pinned upstream commit, the three called workflow files contain **14 mutable action references**: `actions/checkout@v4` (5), `actions/github-script@v7` (3), `skills/action-text-variables@v2` (4), and `EndBug/add-and-commit@v9` (2). This is a direct line-by-line count of all `uses:` statements in those three files.
- The pinned upstream `start-exercise.yml` declares workflow-wide `contents: write`, `actions: write`, and `issues: write`; however, job-level review shows only `disable_workflows` needs `actions: write`, `create_exercise` needs `issues: write`, and `update_readme` needs `contents: write`. Job-level permissions could reduce cross-job authority without changing behavior. `finish-exercise.yml` has one job that updates README and closes/comments on the issue, so it needs `contents: write` + `issues: write`; `find-exercise-issue.yml` needs only `issues: read`. These are upstream workflow permissions, not permissions granted by our local pin checker.
- **Repository governance evidence:** `GET /repos/DorpNay/skills-github-pages/rulesets?includes_parents=true` returned an empty list (`[]`). The `GET /branches/main/protection` endpoint returned HTTP 403 `Resource not accessible by integration`; therefore classic branch protection is **UNVERIFIED**, not absent.
- **Conclusion:** direct repository pinning is VERIFIED (62/62), but the transitive reusable-workflow dependency chain, least-privilege review and repository governance are OPEN under issue #111. Do not mark the supply-chain gate complete. A bounded follow-up should replace or fork the exercise workflows with locally reviewed equivalents or otherwise pin their nested dependencies and reduce permissions; preserve behavior and test triggers before changing them.

## 15. Browser asset supply-chain review — 2026-11-08

**Scope:** current `index.md` script references on the PR #174 work branch. This is a source inventory, not a runtime network capture.

| Asset | Current reference | Finding | Safe disposition |
|---|---|---|---|
| Tailwind Play CDN | `https://cdn.tailwindcss.com` | Mutable/unversioned browser-executed code; no SRI. Official Tailwind v3 documentation explicitly says Play CDN is for development and is not intended for production. | Replace with a reproducible build-time Tailwind CLI/PostCSS step and committed/generated static CSS. Do not guess a versioned Play CDN URL or fabricate an integrity hash. |
| marked | `https://cdn.jsdelivr.net/npm/marked@18.0.14/marked.min.js` | Package version is explicit, but no SRI and runtime still trusts jsDelivr delivery. | Prefer a reviewed local artifact or add SRI only after hashing the exact served bytes and pinning the expected file. |
| DOMPurify | `https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.16/purify.min.js` | Package version is explicit, but no SRI and runtime still trusts cdnjs delivery. | Prefer a reviewed local artifact or add SRI only after hashing the exact served bytes and pinning the expected file. |

Primary reference: Tailwind CSS v3.4.17 Play CDN documentation, https://v3.tailwindcss.com/docs/installation/play-cdn — explicitly classifies Play CDN as development-only. This makes static Tailwind compilation the preferred production fix, not merely changing the unversioned CDN URL.

**Status:** inventory and production-boundary decision are **VERIFIED** from repository source + official documentation. No CDN URL, dependency, build workflow or generated CSS was changed in this review. Exact SRI hashes have not been obtained; do not add guessed hashes. Remaining work: establish a reproducible static CSS build, compare generated CSS against current rendered pages and all responsive states, then self-host/version marked and DOMPurify or verify exact-byte SRI with Chromium regression coverage.
