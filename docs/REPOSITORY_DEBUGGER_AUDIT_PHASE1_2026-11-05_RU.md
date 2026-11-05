# aLandi — независимый инженерный аудит, фаза 1

**Дата:** 2026-11-05  
**Базовый main:** `4fbf16aad3f741159654950e0260aaf717653291`  
**Статус:** PARTIALLY VERIFIED — критические сквозные поверхности проверены; PR #149 merged; новый P1 storage fix реализован в PR #150, но exact-head gates pending; полный аудит модулей и live runtime продолжается.  
**Назначение:** независимый взгляд Debugger / Architecture Reviewer, затем превращение подтверждённых находок в инженерные задачи и исправления.

## 1. Краткий итог

В основной ветке обнаружены и исправлены два дефекта жизненного цикла/безопасности, а также устранена третья граница доступа для browser Python:

1. Отмена запроса к Ollama могла навсегда занимать единственный inference semaphore slot — исправлено в PR #147.
2. Raw HTML из ответа модели мог создать поддельный `data-action` control в полнотекстовом просмотрщике — исправлено в PR #148.
3. Pyodide по умолчанию предоставлял Python-коду `globalThis` через модуль `js`, включая доступ к browser `localStorage` — в PR #148 задан пустой null-prototype `jsglobals`. Это ограничение доступа к globals, но не полноценная sandbox/worker isolation.

Дополнительно выявлены и вынесены в текущий PR #149 две документально-конфигурационные регрессии: stale provenance для pypdf/Vosk и потерянный переход CI на Node.js 24. Обновление state/orientation и отчёт об аудите также входят в PR #149.

## 2. Базовый scope и метод

Проверены на live GitHub main:

- FastAPI Gateway: `gateway/app.py`, request limits, chat completion lifecycle, local document extraction, audio semaphore boundary.
- OAuth/PKCE и token vault: `gateway/security/google_oauth.py`, `oauth_vault.py`; SSRF validation и approval tickets.
- Memory/RAG: `gateway/memory/manager.py`, `delta_sync.py`, `gateway/rag/lazy_graph_rag.py`.
- Tool DAG/validator: prototype boundary, bounded readers, explicit side-effect gates.
- Browser client: `index.md`, delegated actions, Markdown rendering, browser storage, Pyodide bootstrap.
- CI/dependencies/provenance: Python lock and requirements, GitHub Actions Node versions, provenance manifest, static-analysis artifact.
- State/orientation, master task register, architecture map and branch/PR inventory.

Это не утверждение о построчной проверке каждого файла. Полный проход по voice adapters, browser storage migrations, provider routing, V2 branch, native devices and live host остаётся открытым.

## 3. Подтверждённые находки

| ID | Severity | Наблюдение | Решение / evidence |
|---|---|---|---|
| AUDIT-FIND-001 | P1 | В `POST /v1/chat/completions` отмена во время `AsyncClient.send()` до upstream headers обходила HTTP/timeout handlers и могла оставить semaphore занятой. | **FIXED / VERIFIED.** PR #147, merge `3f37a8166fcbf89c5392f985e290be48ea27ef6a`; regression test отменяет blocking transport. Gateway #41998613130 (Python 3.12/3.13/3.14), Quality #41998613190, Graphify #41998613246 и Dead Code #41998613138 PASS на exact PR HEAD `6ef3b8e4ab19880beb5785e1e8d72295a078541d`. |
| AUDIT-FIND-002 | P1 | Sanitized assistant Markdown сохранял `data-action`; глобальный dispatcher не ограничивал команды в `#messageViewerContent`, который находится вне `#chatBox`. Raw HTML мог имитировать app action, например `clear-chat`. | **FIXED / VERIFIED.** PR #148, merge `4fbf16aad3f741159654950e0260aaf717653291`; raw HTML tokens выводятся как текст, viewer read-only; Chromium fixture проверяет forged button в chat и viewer. Quality #41999525882 и Graphify #41999525846 PASS на exact PR HEAD `1159f30dfdfc2b76fe8b47a7fcfd8716804b7df8`. |
| AUDIT-FIND-003 | P1 | Pyodide default `jsglobals` равен page `globalThis`; Python через `js` мог обращаться к DOM/storage globals, а API keys хранятся в browser localStorage. | **MITIGATED / VERIFIED, NOT A COMPLETE SANDBOX.** PR #148 передаёт `Object.create(null)`; Chromium test проверяет null prototype и отсутствие window/document/localStorage/fetch/globalThis в передаваемом namespace. Долгий цикл всё ещё может блокировать main thread; отдельный Worker остаётся follow-up. |
| AUDIT-FIND-004 | P2 | `provenance_manifest.yaml` указывал pypdf 6.4.1, тогда как runtime pins в `pyproject.toml`, `gateway/requirements.txt` и `uv.lock` — 6.21.4. | **FIXED / VERIFIED.** PR #149 merge `8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`; exact-head Provenance #42001309703 PASS. |
| AUDIT-FIND-005 | P2 | Main workflows использовали Node 22, хотя закрытый PR #126 уже содержал Node 24 migration в трёх workflows; PR #145 эту часть не перенёс. | **FIXED / VERIFIED.** PR #149 merge `8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`; exact-head Quality #42001310270 (7 jobs) PASS. |
| AUDIT-FIND-006 | P2 / HYPOTHESIS | При включённом document extraction endpoint использует `asyncio.to_thread`, но отдельного явного concurrency semaphore для parse jobs нет. Feature default-off, body/archive/page bounds существуют; реальный memory-pressure сценарий пока не воспроизведён. | **OPEN.** Нужен bounded concurrency design + нагрузочный/отменный тест до изменения поведения. |
| AUDIT-FIND-007 | P2 | Pyodide исполняется на main browser thread; бесконечный/длительный Python loop способен заморозить вкладку. | **OPEN.** Спроектировать dedicated Worker, termination/timeout, output/result bounds и отсутствие page-origin privileges. Не называть текущий runtime полной sandbox. |
| AUDIT-FIND-008 | P2 / SUPPLY-CHAIN | Tailwind CDN не закреплён точной версией; Marked/DOMPurify/Pyodide загружаются с CDN без SRI. Текущих признаков компрометации нет. | **OPEN.** Сравнить self-hosting и SRI/immutable asset pinning; не добавлять широкую сборочную систему без измеренной пользы. |
| AUDIT-FIND-009 | P2 / PROCESS | Репозиторий содержит 143 branch refs. Интеграция не предоставляет branch-delete action. | **PARTIALLY VERIFIED.** Пять behind-only кандидатов повторно проверены; PR #133 branch tree-equivalent по четырём документам. Удаление не выполнено и не объявляется выполненным. |
| AUDIT-FIND-010 | INFO | Bandit/Semgrep artifact PR #147 показал 2 Bandit B608 и 4 Semgrep findings. | **REVIEWED FALSE POSITIVES:** SQL values bound parameters, SQL templates use fixed clauses/generated placeholder count; `vm.Script` in quality script only parses code; reported SRI target was a local Jekyll CSS asset. Scanners не отключались и правила не ослаблялись. |

## 4. Проверка связности и зрелости

- OAuth callback использует одноразовый PKCE state; token vault хранит зашифрованные token values, а refresh без нового refresh token сохраняет прежний токен. Live Google credentials/redirect flow не проверялись.
- SSRF helper и approval registry существуют как ограниченные компоненты; наличие helper не доказывает, что все внешние fetch paths им защищены. End-to-end wiring требует отдельной проверки.
- Memory/RAG SQL warnings проверены по фактической сборке запросов: динамические значения передаются bind parameters; структура SQL ограничена кодом/числом placeholder, не пользовательской строкой.
- DAG engine остаётся prototype boundary; не считать его production orchestration или независимым агентом.
- Document extraction default-off; zip/page/body limits присутствуют. Concurrency hypothesis не повышать до confirmed defect без воспроизводимого теста.
- Graphify PASS — навигационное evidence, не замена чтению исходников и не доказательство live behavior.

## 5. Repository hygiene — проверенный срез

**Live snapshot:** 143 branches, 6 open PRs (#125, #128, #129, #130, #131, #134), 1 open issue (#111).

Повторно проверенные behind-only candidates (ahead=0; exact SHA сохранён для rollback):

| Branch | Ahead / behind | HEAD SHA |
|---|---:|---|
| `feat/alandi-helper-model-routing` | 0 / 177 | `55248f81585c52d7cc7ba7cfc08158a291a761ca` |
| `feat/rag-rrf-engineering-audit-rebased-20261027` | 0 / 123 | `9aa36465158c27c49ff647a6ce349b46a6e1151e` |
| `fix/provider-model-catalogs-v2` | 0 / 194 | `e58b5d1d96a01e6a1a7a1b37b029244ea0b8dcb4` |
| `fix/pyodide-setup` | 0 / 282 | `d9fb63bd27463399d152627d290f7ec19d2f99e1` |
| `fix/theme-persistence-e2e-isolation` | 0 / 190 | `041c3a5448ff00b46a7583b3611892dc756a055b` |

Для этих пяти имён live поиск не нашёл открытых PR, issues или code references. Дополнительный кандидат `docs/alandi-n2o-knowledge-core-20261102` имеет 11/13 divergent ancestry, но все четыре changed files byte-identical main; PR #133 closed, open issue/code references не найдены.

**Preserve list:** default/main; `archive/landing-v1-baseline-9b746f7-20261105`; `future-workstreams/parking-base-20261030`; active PR #131/#134 and research PR #125/#128/#129/#130; branches with unique commits or unique docs/workflows (including #124/#126/#127/#132/#141 lineages). PR #126 branch contains the unported Node 24 workflow changes until PR #149 is merged.

**Deletion status:** NOT EXECUTED. The available GitHub integration has no branch deletion operation. Полный ancestry pass всех 143 refs не завершён; пять кандидатов и один tree-equivalent candidate не означают, что остальные branches автоматически safe.

## 6. Проверки и ограничения

**Exact PR-head evidence:**
- PR #146 HEAD `112c29eadeb788209f490b4585d3e4ac33884085`: Quality #41998268074 (7 jobs), Freshness #41998267817, Provenance #41998267937 — PASS; merge `21162e858d769c23ee4907264305f792148a7fbf`.
- PR #147 HEAD `6ef3b8e4ab19880beb5785e1e8d72295a078541d`: Gateway #41998613130, Quality #41998613190, Graphify #41998613246, Dead Code #41998613138 — PASS; merge `3f37a8166fcbf89c5392f985e290be48ea27ef6a`.
- PR #148 HEAD `1159f30dfdfc2b76fe8b47a7fcfd8716804b7df8`: Quality #41999525882 (7 jobs), Graphify #41999525846 — PASS; merge `4fbf16aad3f741159654950e0260aaf717653291`.

**Не проверено:** post-merge main workflow IDs после PR #146–#148 не удалось получить через доступный connector; PR-head PASS не подменяет post-merge verification. Не проверены live VPS/Tunnel/Ollama, real provider calls, Google OAuth, physical iPhone/VoiceOver, microphone/speaker/ASR/TTS quality, target-host memory/latency и production deployment. PR #131 не синхронизирован и не вливался; текущий compare 1,101 ahead / 17 behind, 57 files, mergeable=false. PR #134 остаётся Draft/HOLD.

## 7. Следующий инженерный цикл

1. Завершить PR #150: exact-head Quality/Chromium/Graphify/Freshness; review rollback paths and storage regressions.
2. Продолжить subsystem audit: provider routing and browser storage migrations, voice/audio lifecycle, document intake concurrency, RAG deletion lineage, V2 candidate slices.
3. Выполнить bounded Worker design for Pyodide и concurrency limits для document extraction только после acceptance criteria/baseline.
4. Завершить ancestry/reference audit остальных branch refs; удалять только allowlist после появления разрешённой branch-delete операции.
5. Держать issue #111 открытым для owner-only live-host, ruleset, device and release gates.

**Итог:** два исходных P1 дефекта исправлены и merged; Pyodide page-global exposure ограничен, но Worker isolation остаётся. Дополнительный P1 localStorage data-loss path исправлен в PR #150, verification pending. Текущий отчёт — verified phase 1 plus incremental findings, не заявление о завершении полного аудита.


## 8. Дополнительные находки после phase-1 snapshot — 2026-11-05

| ID | Severity | Наблюдение | Решение / evidence |
|---|---|---|---|
| AUDIT-FIND-011 | P1 | Browser persistence не сохраняла исходные данные проектов при JSON/shape corruption; частично повреждённые чаты могли фильтроваться без backup. `persistChats()` не откатывала chat-list запись при ошибке записи current-chat key. Создание/удаление/импорт проекта последовательно писали project и chat keys, могли оставить orphaned chat references и показывать success при неуспешном сохранении. | **IMPLEMENTED IN PR #150; VERIFICATION PENDING.** Branch `fix/browser-storage-recovery-atomicity-20261105`, HEAD `57a10e82198943da5e7625b26daa10d15ccafc40`. Добавлены raw recovery backups, fail-closed при неудаче backup, download исходного raw значения, rollback chat/current и project/chat, rollback in-memory state, success gating, 50k aggregate message cap и 100 tool-call cap. Четыре Chromium regressions: project backup download, partial chat corruption, rollback при quota failure, fail-closed при невозможности создать backup. |
| AUDIT-FIND-012 | P2 (conditional) | `MemoryManager` включает FTS5 `secure-delete` только при SQLite `>=3.42.0`. При более старом runtime capability false, но логическое удаление всё равно выполняется; status не выводится через health/diagnostic API. Удалённый текст может оставаться в FTS index segments до merge. Это не доказывает проблему на target host: runtime version и MemoryGraph/RAG flags не проверены. | **SOURCE-VALIDATED / RUNTIME UNVERIFIED.** Context7/SQLite FTS5 documentation: https://www.sqlite.org/fts5.html#the_secure_delete_configuration_option. Follow-up: expose capability and verify target-host SQLite before promising secure deletion. |

**PR #149 completion:** merge `8e7d4aafe4b9580e9f8978c6f888e35f3fa99242`; exact-head Quality #42001310270 (7 jobs), Freshness #42001309687, Provenance #42001309703 and Graphify #42001311323 PASS. Post-merge main workflow IDs were not retrieved. Current branch inventory is 145 refs (143 at initial inventory plus PR #149 and PR #150 refs); no branch deletion was performed.
