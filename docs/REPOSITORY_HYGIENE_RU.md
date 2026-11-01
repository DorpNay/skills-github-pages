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

**Снимок:** default branch `main` `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`; PR #131 HEAD `5b9aa7abcc70fc1fa6f3c0fba402e025cb44c772`. Это read-only инвентаризация, не полный аудит ancestry каждой ветки.

### Подтверждённые факты
- GitHub API вернул **126 веток** (100 + 26 на двух страницах) и **9 открытых PR** (#124–#132).
- **117 веток** не являются head открытого PR. Это очередь для классификации, а не список на удаление: PR/issue-контекст, ancestry, уникальные коммиты и ссылки ещё не проверены для каждой ветки.
- `delete_branch_on_merge=false`; repository rulesets API вернул пустой список.
- Classic branch protection для `main` проверить не удалось: интеграция получила 403 `Resource not accessible by integration`. Наличие/отсутствие классической защиты неизвестно.
- В root, `.github/` и `docs/` не найдены `CODEOWNERS` и `SECURITY.md`; в стандартных местах не найдена Dependabot config. Это не доказывает, что account-level security alerts выключены.
- PR #131 открыт, не объединён; GitHub сообщает `mergeable_state=dirty`. Rebase/sync не выполнялись.
- На точном PR #131 HEAD нет Quality/Chromium run или commit status. Provenance run `41336870473` прошёл на этом SHA. Quality #1126 — старый SHA `7cdf35d581d9d6bca39256e67a0b0db6083e486c`, Chromium 101 passed / 18 failed; результат не относится к текущему HEAD.
- PR #132 — отдельная открытая draft-документация; её проверки не являются доказательством качества V2-кода PR #131.

### Дальнейшие действия
1. **P0:** проверить все 117 веток вне открытых PR по дате последнего commit, связанным PR/issues, compare/ancestry, уникальным коммитам и ссылкам в workflows/docs/runtime. Только затем выделять подтверждённые кандидаты на удаление.
2. **P1:** владелец проверяет Settings → Rules → Rulesets и Branches → branch protection для `main`; не вводить невыполнимое обязательное число approvals.
3. **P1:** владелец проверяет secret scanning/push protection, Dependabot alerts/security updates, dependency graph/review и CodeQL. Отдельно решить, нужны ли `SECURITY.md`, `CODEOWNERS` и Dependabot config.
4. **P2:** после классификации обсудить автоматическое удаление веток после merge; сохранять SHA и recovery path.

### Граница выполненных действий
- Не удалялись ветки, файлы, PR, Actions artifacts или workflow runs.
- Не менялись rulesets, branch protection, Actions permissions или security settings.
- Не выполнялись merge, rebase, force-push, закрытие PR или deployment.
- Полный ancestry/reference аудит и owner-side security settings review остаются открытыми.

Официальные ориентиры: [GitHub repository best practices](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories), [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [security quickstart](https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).
\n\n## 10. Follow-up — Graphify extracted UI source coverage\n\nPR #131 now extends the Graphify Code-Only Pilot path filters to `assets/js/**/*.js`, `assets/css/**/*.css` and `landing/**/*.html` for pull requests and main pushes. This closes a coverage gap created when the app runtime and styles were externalized. The resulting Graphify run/artifact is still pending confirmation. No branch deletion or repository settings change was performed.\n