# aLandi — ФАЙЛ-ОРИЕНТИР ДЛЯ ПРОДОЛЖЕНИЯ РАБОТЫ

> **Первым делом:** прочитай корневой `ORIENTER.md` как короткую точку входа, затем этот подробный индекс, `docs/PROJECT_STATE.yaml` и последнюю запись `docs/VOLLEY_LOG.md`. После этого открывай только файлы, относящиеся к текущей задаче. Этот индекс — навигация, а не доказательство того, что feature включена или развёрнута.

Текущий main `337e38690af8f22a712c6442192c5ea62d354c3d` — документационный follow-up к code SHA `91557e4eab1b122341bed578cdf4775ff867007f`. На code SHA прошли Gateway `40637941350`, Quality/Chromium `40637941308`, Graphify `40637941303`, Pages `40637941951`; на docs-only main `337e` повторно прошли Quality `40639031308` и Pages `40639030224`. PR #76, #72 и #77 merged после зелёных exact-head gates. Перед каждым новым merge проверять актуальный head и его обязательные проверки.

## 1. Быстрый маршрут

0. **Короткая точка входа:** корневой `ORIENTER.md`.
1. **Текущий статус и флаги:** `docs/PROJECT_STATE.yaml`.
2. **Архитектура и границы:** `docs/ALANDI_MASTER_CONTEXT_RU.md`.
3. **Что пользователь просил и что осталось:** `docs/USER_REQUEST_CHECKLIST.md`.
4. **Порядок внедрения:** `docs/IMPLEMENTATION_ROADMAP_RU.md`, `docs/CODER_PACKET.md`.
5. **Решения / eval / цикл:** корневые `DECISIONS.md`, `EVALS.md`, `LOOP.md`, `INTEL.md`, `IMPROVEMENT_SELECTION.md`.
6. **Поиск и исследования:** `docs/SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md`.
7. **Карта модулей:** `docs/ALANDI_ARCHITECTURE_MAP_RU.md` — кураторская схема, не автоматически извлечённый Graphify graph.
8. **Лицензии и происхождение:** `infra/license/provenance_manifest.yaml`; не подключать runtime/model/voice без отдельной проверки лицензии и SHA-256.
9. **Основной клиент:** `index.md` (большой единый HTML/JS файл). Перед правками найди точные функции/якоря, не делай широких замен без проверки единственности.
10. **Backend/API:** `gateway/app.py`; тесты в `gateway/tests/`; зависимости в `gateway/requirements*.txt`.
11. **Память:** `gateway/memory/{manager.py,schema.sql,delta_sync.py,scope.py,conflict.py,temporal.py}`; браузерное хранение и экспорт — `index.md` около `safeSet`, `downloadRecoveryBackup`, `exportChats`, `exportProjectBundle`.
12. **Голос и вложения:** `gateway/voice/`, `gateway/tests/test_audio_*.py`, `tests/e2e/audio-transcription.spec.mjs`, `tests/e2e/document-attachments.spec.mjs`.
13. **Реальные browser checks:** `tests/e2e/`, workflow Quality Sentinels; отдельная GitHub Pages публикация не означает, что VPS gateway обновлён.

## 2. Ключевые статусы на момент проверки

- PR #45: local document extraction + authenticated capabilities — merged; server flag off by default, actual VPS configuration unverified.
- PR #48: non-queueing local audio concurrency — merged.
- PR #50: UI routes PDF/DOCX/XLSX only through configured local gateway — merged, CI reportedly passed.
- PR #51: stop cancels in-flight TTS and prevents stale playback — merged.
- PR #53: attached-audio transcription through local ASR — merged.
- PR #60: local half-duplex voice dialogue prototype — merged; CI mocks media/model calls; target hardware/audio quality unverified.
- PR #61: mobile message viewer/copy fallback/jump-to-latest — merged at `529b1d0b86aef58c2b84663a44e78677a31ce9b1`; exact-head Quality (6 jobs) and provenance passed.
- PR #62: open-source triage docs — merged at `f689cbe17a2996ebd4cd2ca9fcb71d60102a6c25`; triage decisions are not runtime installs.
- PR #63: root orienter + AGENTS first-read protocol — merged at `623f1865ee4021debade9000bbecf6004c6b4cfa`; main has since advanced with docs-only commit `b91aab316c224588baea99fbb9b966b8865de0a6`.
- Open PRs at index creation: #52 document attachment integration (branch `feat/document-attachment-ui-v3`), #37 mobile chat ergonomics, #36 project-memory scope regression tests. Check live PR status before assuming any remain open.
- Local whisper.cpp ASR and Piper TTS + mini-player are code-level features, **not enabled/deployed by default**. Verify models, binary paths, flags, and target hardware before saying audio works on the user's server.
- Search & Research Studio exists; SearXNG adapter is optional/configured-server-only, not an independently deployed search cluster.
- Memory graph and delta-sync API are experimental/flagged off. Browser/local memory, gateway graph memory, and external storage are not one magically synchronized store.

## 3. Folder taxonomy

`docs/` contains project documentation and planning; `gateway/evals/` contains evaluation instructions/scripts; `infra/license/` and `infra/*.yaml` contain runtime/deployment configuration and provenance; `skills/` contains prompt/skill assets loaded by the app; `tests/` and `gateway/tests/` are executable verification assets. Do **not** move these into a generic archive folder without updating imports, CI paths, Pages links and relative Markdown links.

Root engineering records (`DECISIONS.md`, `EVALS.md`, `IMPROVEMENT_SELECTION.md`, `INTEL.md`, `LOOP.md`, `PROVIDER_SETUP.md`) are reference documentation, not runtime modules, but CI and docs link to them. Keep compatibility paths if relocating them. This index is the single recommended entry point; preserve current paths until a link-aware migration can be tested.

## 4. Memory: known architecture boundary

- Browser chat history is stored through `localStorage`; application notes also use IndexedDB. Browser quota/eviction and clearing site data can cause loss. A localStorage fallback/backup is not a separate durable backup medium.
- The gateway has two distinct opt-in concepts: versioned conversation delta sync (`ALANDI_MEMORY_SYNC_ENABLED=false`) and scoped memory graph (`ALANDI_MEMORY_GRAPH_ENABLED=false`). They have different schemas and are not a completed automatic sync pipeline.
- Graph facts require source provenance, scope and status; newly uploaded facts are candidates, not automatically trusted facts. Prompt use is opt-in and should remain scope-restricted.
- OAuth vault/Google OAuth routes exist as groundwork; real credentials, Drive Picker/UI, file import and sync are not configured. Do not promise Google Drive synchronization.
- Do not store raw long audio, recordings or full files in the compact “memory” graph. Preserve original conversation/attachment as an immutable source, then store a short, source-linked summary/transcript plus hash and offsets. Never overwrite the only source with a summary.
- Compression can reduce archival size, but is not a substitute for retention, integrity hashes, version history, backups and restore tests. Encrypted data cannot be compressed efficiently; compress before encryption. Never silently discard history when limits are reached.

## 5. Working protocol

- Verify current branch/HEAD, PR diff and user changes first.
- Make small reversible changes, feature-flagged where appropriate.
- Run relevant gateway tests plus security/context/integrity/Jekyll/Chromium and provenance checks; report exact evidence.
- Update `docs/PROJECT_STATE.yaml` and `docs/VOLLEY_LOG.md` after a meaningful milestone.
- Never equate code merged, CI passed, Pages deployed and VPS configured; these are separate statuses.


## Текущий checkpoint — root orienter and queue cleanup (2026-10-27)

- Root `AGENTS.md` теперь явно направляет агента сначала к этому orienter и state file.
- PR #63 merged at `623f1865ee4021debade9000bbecf6004c6b4cfa`; its checks: Quality Sentinels, Chromium, published Pages smoke and provenance all passed.
- Live queue checked after merge: 0 open PRs, 0 open issues. This is a snapshot; always refresh before edits.
- Graphify is not installed/run: the previous execution container could not resolve github.com. The next real implementation step is a network-enabled isolated pilot, not claiming graph integration.

## Текущий checkpoint — open-source triage (2026-10-27)

- Решения по дополнительному списку внесены в docs/OPEN_SOURCE_TRIAGE_RU.md; техники и способы применения — в docs/TECHNIQUE_REGISTER_RU.md.
- Состояние и продолжение записаны в docs/PROJECT_STATE.yaml; журнал этапов — в docs/VOLLEY_LOG.md.
- Ветка документации: docs/source-triage-and-next-steps-20261027. Это документационный этап, не runtime-интеграция.
- Следующий этап: (1) запустить Graphify в сетевой изолированной рабочей копии и сравнить результат с обычным чтением репозитория; (2) перенести только выбранные идеи из закрытого PR #37 небольшими PR с exact-head tests; (3) проверить актуальную очередь GitHub; (4) продолжать только измеримые, безопасные реализации.
- Не считать Graphify установленным/запущенным: в этом checkpoint изучен upstream README и задокументирован пилот, но локальный запуск ещё не подтверждён.

- Ограничение текущего окружения: `git clone https://github.com/...` не удался из-за DNS (`Could not resolve host: github.com`); не утверждать, что Graphify был установлен или запускался.


## Checkpoint — root orienter rollout

- Текущая ветка документации: `docs/root-orienter-checkpoint-20261027`; корневой `AGENTS.md` дополнен протоколом первого чтения, ведения чекпоинтов и отдельной границей Graphify vs memory graph.
- На main в момент старта: `623f1865ee4021debade9000bbecf6004c6b4cfa`; PR/Issues очередь была пустой.
- Следующий шаг после merge этого docs PR: Graphify pilot в среде с сетевым доступом и локальной копией репозитория. Если текущая среда не позволяет checkout/install, зафиксировать blocker и перейти к доступным безопасным улучшениям, не выдавая пилот за выполненный.


## Checkpoint — reconcile current main and evidence ledgers (2026-10-27)

- **Current main at start of this stage:** `b91aab316c224588baea99fbb9b966b8865de0a6`.
- **Queue:** live GitHub API returned 0 open PRs and 0 open issues.
- **Exact-main workflows:** Provenance run #40522824071 passed; Pages build/deployment run #40522822481 passed; Quality Sentinels run #40522824202 was still in progress when checked. Do not report all gates green until that run completes.
- **Documentation drift found:** `EVALS.md` still said the mobile message tools were pending despite PR #61 being merged and its exact-head Quality/Chromium + provenance passing; roadmap still labelled the PR #61 slice “validation pending”. These statuses are being reconciled in a small docs-only change.
- **Graphify:** still not run. Prior container clone failed due DNS resolution of github.com; GitHub API reading is not a local checkout and does not satisfy the pilot. Do not claim graph integration.
- **Next action:** wait/check Quality run #40522824202; then run Graphify only if a network-enabled isolated execution workspace is available. Meanwhile inspect product modules and only implement changes whose source, tests, and rollback can be verified.


## Checkpoint — PR #65 merged; architecture map and Graphify research (2026-10-27)

- PR #65 merged into main at `3887b408988e0476251736a8e7a3e3374eb2ce58`; exact PR-head checks 7/7 passed (integrity, security, context, Jekyll, Chromium, published-site smoke, provenance).
- PR #66 merged into main at `1faf60164b9a0f82eb5e0c56b143ba90499be4a5`; exact PR-head Quality checks and provenance passed; post-merge Pages and provenance passed. Post-merge Quality run #40530196483 was still in progress at last poll.
- Post-merge Quality run #40527418639 completed successfully: 6/6 jobs, including Chromium and published-site smoke.
- GitHub API tree: 140 tracked files across static UI, FastAPI gateway, memory, RAG/evidence, security, tools, voice, browser E2E and quality/provenance scripts. Local checkout remains blocked by DNS.
- Graphify upstream rechecked via Exa: Apache-2.0, package `graphifyy`, Python >=3.10, local tree-sitter code extraction; docs/media semantic pass may use a model; dependency footprint is substantial. Official code-only commands now documented in the architecture map (`extract --code-only --no-gitignore` in a tracked staging copy, `cluster-only --no-label`, `export html`, `query`).
- `docs/ALANDI_ARCHITECTURE_MAP_RU.md` adds a curated module map, routes, tests and a bounded Graphify pilot plan. `.graphifyignore` is added as a precautionary exclusion list; its interpretation by Graphify remains unverified until the pilot. The staging-copy approach prevents indexing untracked local secrets, and `--no-gitignore` preserves the SQL schema ignored by the repository's `*.sql` rule. It is not a generated dependency graph.
- Graphify is **not run**: `git clone https://github.com/DorpNay/skills-github-pages.git /tmp/alandirepo` failed with `Could not resolve host: github.com`. No CLI install or graph generation claimed.
- Next: confirm exact-main Quality/Pages/Provenance; inspect official code-only workflow and ignore semantics; run isolated pilot only in a network-enabled workspace; meanwhile choose a bounded product change supported by current source/tests.


## Checkpoint — PR #66 merged (2026-10-27)

- Merge SHA: `1faf60164b9a0f82eb5e0c56b143ba90499be4a5`.
- Added curated architecture map `docs/ALANDI_ARCHITECTURE_MAP_RU.md`, README link, source-triage/technique updates, and `.graphifyignore` exclusions. This is not a generated AST graph.
- PR-head Quality run #40529576448 passed all 6 jobs, and provenance #40529576476 passed. Post-merge Pages run #40530195904 and provenance #40530196480 passed. Post-merge Quality #40530196483 завершился success (6/6 jobs).
- GitHub API queue after PR #66 and again after PR #67: 0 open PRs and 0 open Issues at the respective checks.
- Post-merge Quality #40530196483, Pages #40530195904 and provenance #40530196480 all completed successfully.
- Local Graphify still cannot run in this execution container because DNS resolution for github.com fails. A read-only GitHub Actions pilot workflow is now being prepared to run code-only Graphify in an ephemeral staging copy, with no model calls and no runtime dependency.
- Next action: inspect the Graphify pilot workflow's PR-head CI and its artifact/logs; record actual coverage, runtime, memory and query usefulness before deciding whether a generated graph should be retained. Do not add Graphify to runtime.


## Checkpoint — Graphify code-only CI pilot added (2026-10-27)

- Current base before this PR: `82beb7fcddbe9a1438e811693c76bc731d3a5de3`; PR #67 is merged. Post-merge Quality run #40531356851, Pages run #40531354887 and provenance run #40531357120 all passed.
- New workflow: `.github/workflows/graphify-pilot.yml`. It runs on a narrowly filtered PR, on main when the workflow is added/changed, or manually via `workflow_dispatch`.
- First PR-head pilot run #40532798178 succeeded but exposed quality problems: 1,717 nodes/2,877 edges/140 communities, with 539 nodes from `docs/PROJECT_STATE.yaml`, 460 from workflow YAML, a missing SQL grammar, no `index.md` JS and a broad query over budget.
- Refined run #40534094060 succeeded after installing `graphifyy[sql]==0.9.96`, excluding YAML/YML/TOML from the disposable corpus, extracting inline JS from `index.md` into `index-inline.js` with original line count preserved, and narrowing queries: 940 nodes, 2,637 edges, 44 communities, 59 source files with nodes; 209 nodes from UI JS and 14 from `gateway/memory/schema.sql`. Three queries returned 134, 50 and 59 nodes.
- The refined ten-query run #40534892152 succeeded: all ten queries found graph neighborhoods (10–151 nodes each); examples: UI Research Studio 55, request parsing 50, RAG retrieval 52, audio 31 each, evidence provenance 10. The 700-token budget is approximate; evidence-provenance output (10 nodes/9 edges) still reported ~762 tokens. This demonstrates useful source navigation, though community labels remain generic because `--no-label` avoids model calls. Artifact #12747755798, SHA-256 `e16c01df143a3380bfd66be523ec709d2dc85bf35fd4d8e5133a64922a841b22`, is retained for 7 days. Generated graph remains artifact-only, not a runtime dependency.
- License/version discrepancy: release tag `v0.9.96` LICENSE and PyPI metadata identify Apache-2.0, while default-branch `pyproject.toml` appeared to show older `0.1.14`/MIT metadata. The workflow pins the published package release; do not assume every upstream ref has identical provenance.


## Checkpoint — local helper-memory suggestions vertical slice (2026-10-27)

- Current main baseline before PR #69 sync: `9aa36465158c27c49ff647a6ce349b46a6e1151e`; PR #69 is open. PR #70 is independent and must be reviewed separately.
- The helper uses an operator-configured local Ollama model, blank/disabled by default. Request is manual, bounded and authenticated; suggestions remain text candidates and are saved one at a time only after explicit user choice.
- Found and fixed a server filter gap: `\bAPI_KEY` did not match a prefixed environment variable such as `ALANDI_API_KEY`. New regex accepts underscore/hyphen prefixes, and the regression test now checks both input facts and returned candidates.
- Lite Gateway Tests run #40538692632 passed on earlier code SHA `c12391cbbbd2fb917035919c29ee900af477ec83`. Exact-head Quality, Chromium, Pages smoke and provenance must pass again on the post-sync head before merge.
- No live inference or target-VPS model/resource claim is made. Keep `ALANDI_HELPER_MODEL` blank until the owner chooses and installs an exact local model tag.


## Checkpoint — mobile composer docking (2026-10-27)

- Base main: `4c9096999fbb3e1265150c420b136066c555285b`; active PR #71, branch `fix/mobile-composer-docking-20261027`.
- Current source centered `#composerFooter` on an empty chat via `body.composer-centered` and hid the empty-chat welcome message. That makes keyboard/visual-viewport stability the first priority rather than changing layout speculatively elsewhere.
- PR #71 removes the fixed centered state, keeps the composer in the bottom flex layout, resizes the textarea against `visualViewport.height`, recomputes on viewport resize, and increases the bottom safe touch inset.
- E2E covers visibility in a new chat and viewport shrink/restore. Exact-head CI is pending; native iOS Safari behavior is not proven by Playwright.
- Full legacy request audit: `docs/LEGACY_UX_REQUEST_AUDIT_RU.md`. Already-present features include per-message copy/viewer and jump-to-latest (PR #61), web-driven attachment-type menu and per-chat row actions (PR #35); do not rewrite them wholesale. Outstanding larger verticals are function/search dropdowns, overlay/focus/outside-click contracts, provider/settings simplification, and persisting/resetting modes per chat.


## Checkpoint — PR #75 local TTS voice selection merged (2026-10-28)

- PR #75 (feat/configurable-local-tts-voices-20261028) merged by squash at 4296a8decc12710fafb0a1a4e9644cd8f00b2dfa; reviewed head was 006d5d564b6afd4606a604baab0cf1f78e745565.
- Exact PR-head checks succeeded: Gateway #40633704413; Quality #40633704436 (6/6, including Chromium and published Pages smoke); provenance #40633704435; dead-code audit #40633704411. These are PR-head results, not post-merge main evidence.
- Added operator-configured Piper voice allowlist, authenticated capabilities listing only installed .onnx + .onnx.json pairs, server-side voice-ID validation, mini-player voice selector and mock E2E coverage.
- ASR/TTS flags remain off by default. No model is auto-downloaded. docs/VOICE_IMPLEMENTATION_PLAN_RU.md contains owner-run VPS instructions for binary/model installation, SHA-256 and license review, private loopback binding, staged flag activation, smoke tests, metrics and rollback.
- Remaining ship gates: exact artifact hashes and individual model/voice/phonemizer license review; compatible binaries and models installed on the real VPS; current post-merge main CI; real microphone and device playback; measured latency/RAM/quality. No local test, live VPS, or physical-device validation is claimed.
- Next: verify current main SHA and post-merge checks, inspect remaining voice TODO/model provenance, then prepare the owner’s first-run checklist without enabling flags or fetching models automatically.

## Checkpoint — first-request runbook reconciliation (2026-10-28)

- Updated docs/START_HERE_RU.md to provide the ordered path from account/VPS/Tunnel setup to first authenticated text completion, then local PDF/DOCX/XLSX extraction, then three separate voice scenarios: record-to-editable-transcript, same-chat half-duplex dialogue, and per-message TTS mini-player/voice selection.
- Corrected stale quickstart text that incorrectly labelled PDF/DOCX/XLSX extraction unsupported. Extraction still requires the server flag ALANDI_DOCUMENT_EXTRACTION_ENABLED=true, a configured private gateway, supported format and size within configured limits; it remains off by default.
- Updated docs/PROJECT_STATE.yaml and docs/VOLLEY_LOG.md with exact PR-head evidence and remaining gates.
- Follow-up verification corrected the earlier limitation: direct GitHub Actions API lookup for exact main SHA `4fc342b468e370c792f1e87e77a20fda4de6bbaa` confirms Quality run `40634598755` and Pages deployment `40634598517` both succeeded.
- No VPS/server/device was accessed; no model weights downloaded; no voice/document flags were enabled. Model/voice/phonemizer licenses and SHA-256 remain mandatory per-artifact ship gates.


## 6. Контроль Graphify и актуального CI — 2026-10-28

- Graphify подтверждён по новому артефакту PR #76: run [#40637941303](https://github.com/DorpNay/skills-github-pages/actions/runs/40637941303) на code SHA `91557e4` собрал 988 узлов / 2780 рёбер из 60 source files; 224 nodes относятся к inline UI JS, 14 — к SQL schema, 23 — к RAG module; 10/10 сфокусированных запросов вернули соседства. Документационный follow-up `337e` не менял код. Артефакты сохраняются на 7 дней и не коммитятся в репозиторий.
- Graphify остаётся dev-only навигацией, не runtime-зависимостью и не доказательством корректности. Важные запросы: UI send path, gateway auth/provider, scoped memory, RAG, ASR/TTS, document extraction и evidence provenance.
- PR #76 merged at `708b9e4780ce2e33541a7f09c1395cf4aafa1b9e`: Graphify workflow запускается на изменениях source/architecture paths и еженедельно; exact-head Graphify, Quality/Chromium и provenance passed. Это dev-only navigation; 9 Playwright E2E files дали no symbols, часть query output ограничена 700 tokens.
- PR #72 merged at `d332a6b2ab09911145520c9d10588d0bcb8e0e41`; exact-head Quality run `40637581310` passed all 6 jobs including Chromium and published-site smoke. Исправлены два stale assertion и удалена проверка PR-only UI на опубликованном main site.
- PR #77 merged at `91557e4eab1b122341bed578cdf4775ff867007f`; Gateway run `40637641493`, Quality run `40637641255` and dead-code report `40637641563` passed. RRF remains a ranking-score hypothesis until a labelled >=50-query golden set is evaluated. PR #70 closed as superseded after preserving `docs/ENGINEERING_PACKAGE_AUDIT_RU.md` in PR #79 and porting RRF in PR #77.
- PR #74 — черновик, основан на устаревшем base; сохранить полезный аудит готовности голоса/документов, но не мерджить старую ветку без повторного review.

- PR #74 closed after preserving its unique, updated `docs/VOICE_DOCUMENT_READINESS_AUDIT_RU.md` in PR #79. Real VPS, microphone, model, license/hash and hardware metrics remain explicitly unverified.

- Обновлено 2026-10-28: историческая ветка `feat/deployment-preflight-gates-20261028` остаётся отдельным WIP; активная реализация — PR #81 (`feat/deployment-preflight-ci-20261028`), exact-head Gateway/Quality/Graphify/dead-code checks зелёные, но live VPS/Tunnel не проверены. Очередь PR #78, #80–#86 см. в `docs/PROJECT_STATE.yaml`; PR #78 интегрировать последним после reconciliation документов. Не сливать PR и не разворачивать на VPS без прямого разрешения.


## Checkpoint — PR queue refresh (2026-10-28)

- PR #86 latest verified HEAD: `6785bb03f6975e9d60ccc8eba56b6ca207860b97`; Quality (six jobs including Chromium and published Pages smoke), Graphify, Dead Code and Provenance all green. The cancellation regression is included.
- PR #78 remains the documentation reconciliation PR and should be reviewed after implementation PRs #80–#86. Its current head before this refresh was `3de8980a9b8a298a6d7fcdc8a288e13c9dd62891`; a docs update requires fresh exact-head checks.
- PR #85 CI is green, but voice-license review and live microphone/device/VPS tests are not done.
- No merge, deployment, model pull, driver installation or production change was performed.


## Checkpoint — launch landing and first stack (2026-10-28)

- PR #87 (`feat/launch-landing-stack-20261028`) HEAD `01040fed70e323018bd2de1173a161b13e496123`: Quality `40718463517` passed all six jobs, including 68 Chromium E2E tests and published Pages smoke; Graphify `40718463612` passed. Landing lives at `/landing/` only after merge/deployment; root app is preserved.
- The first Chromium run exposed unprocessed Jekyll Liquid placeholders in the landing URL; explicit front matter (`layout: null`, `permalink: /landing/`) fixed the output and the exact-head browser suite passed.
- Added `docs/PRE_LAUNCH_STACK_RU.md` with a personal/closed beta stack and gates, plus `docs/LAUNCH_PRIVACY_REVIEW_RU.md` as an internal input checklist—not a publishable legal notice. Recommended first stack: existing GitHub Pages UI, FastAPI/systemd, one Ollama model candidate, Cloudflare Tunnel to loopback, no open origin ports; benchmark before declaring model fit.
- Nine PRs are open (#78, #80–#87); no non-PR issues were open in the last live check. Keep #78 last because it reconciles overlapping state/docs. Do not merge or deploy without direct authorization.
- Owner-side gates remain: confirm the VPS/domain/budget, inventory the existing host, safeguard and test backups, run local auth/model/cache gates before configuring the Tunnel, then test reboot, restore/rollback and target-device behavior. Gateway, model, voice/doc flags and production runtime remain unverified.
