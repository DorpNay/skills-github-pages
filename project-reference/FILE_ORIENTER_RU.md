# aLandi — ФАЙЛ-ОРИЕНТИР ДЛЯ ПРОДОЛЖЕНИЯ РАБОТЫ

> **Первым делом в новом чате:** прочитай этот файл, затем актуальный `docs/PROJECT_STATE.yaml`, потом только конкретные файлы по текущей задаче. Этот индекс — навигация, а не доказательство того, что feature включена или развёрнута.

Последний подтверждённый main: **623f1865ee4021debade9000bbecf6004c6b4cfa** (PR #63 merged после успешных 6/6 Quality jobs и provenance). Live queue snapshot at 2026-10-27: **0 open PRs, 0 open issues**. Повторно проверять HEAD/очереди перед каждым изменением.

## 1. Быстрый маршрут

1. **Текущий статус и флаги:** `docs/PROJECT_STATE.yaml`.
2. **Архитектура и границы:** `docs/ALANDI_MASTER_CONTEXT_RU.md`.
3. **Что пользователь просил и что осталось:** `docs/USER_REQUEST_CHECKLIST.md`.
4. **Порядок внедрения:** `docs/IMPLEMENTATION_ROADMAP_RU.md`, `docs/CODER_PACKET.md`.
5. **Решения / eval / цикл:** корневые `DECISIONS.md`, `EVALS.md`, `LOOP.md`, `INTEL.md`, `IMPROVEMENT_SELECTION.md`.
6. **Поиск и исследования:** `docs/SEARCH_RESEARCH_FEATURE_EXTRACTION_RU.md`, `docs/OPEN_SOURCE_TRIAGE_RU.md`.
7. **Лицензии и происхождение:** `infra/license/provenance_manifest.yaml`; не подключать runtime/model/voice без отдельной проверки лицензии и SHA-256.
8. **Основной клиент:** `index.md` (большой единый HTML/JS файл). Перед правками найди точные функции/якоря, не делай широких замен без проверки единственности.
9. **Backend/API:** `gateway/app.py`; тесты в `gateway/tests/`; зависимости в `gateway/requirements*.txt`.
10. **Память:** `gateway/memory/{manager.py,schema.sql,delta_sync.py,scope.py,conflict.py,temporal.py}`; браузерное хранение и экспорт — `index.md` около `safeSet`, `downloadRecoveryBackup`, `exportChats`, `exportProjectBundle`.
11. **Голос и вложения:** `gateway/voice/`, `gateway/tests/test_audio_*.py`, `tests/e2e/audio-transcription.spec.mjs`, `tests/e2e/document-attachments.spec.mjs`.
12. **Реальные browser checks:** `tests/e2e/`, workflow Quality Sentinels; отдельная GitHub Pages публикация не означает, что VPS gateway обновлён.

## 2. Ключевые статусы на момент проверки

- PR #45: local document extraction + authenticated capabilities — merged; server flag off by default, actual VPS configuration unverified.
- PR #48: non-queueing local audio concurrency — merged.
- PR #50: UI routes PDF/DOCX/XLSX only through configured local gateway — merged, CI reportedly passed.
- PR #51: stop cancels in-flight TTS and prevents stale playback — merged.
- PR #53: attached-audio transcription through local ASR — merged in main commit above.
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
