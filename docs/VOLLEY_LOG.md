| V-2026-10-30-RECONCILIATION-PR123-001 | 2026-10-30 | Restore bounded local-model evaluation and reconcile V1 documentation/branch history | PR #123 exact head `fb6f6b6f4036cfc54d5e4dc35a6e0105a9272222`: Gateway Tests, Quality (Chromium/Jekyll/published-site smoke, Integrity/Security/Context), Project State Freshness, Graphify, Provenance and Dead Code all passed. Restored synthetic RU/EN/TH model smoke harness with bounded requests, env-only key, loopback-only HTTP and redirect refusal. Consolidated duplicate decision IDs and updated README, architecture map, UX audits, V1 freeze, file orienters and state. | PR #123 is merge-ready at verified head; no subsequent code changes. Post-merge Pages deployment and target-host model quality remain unverified. | Merge PR #123, then update issue #111 supply-chain baseline; keep issue #111 open for owner-only deployment, hardware, ruleset, RAG, voice, sandbox and OAuth gates. |\n| V-2026-10-30-POST-MERGE-RECONCILE-001 | 2026-10-30 | Merge first free landing V1 and Gateway readiness; reconcile chronology and preserve helper-model work | PR #121 merged at `f4d880f9648989f4fe48ddd2284220b3606c3b86` (exact head `e3c3017`; six workflow groups passed). PR #122 merged at `fd4f0a105183feb23e0f4e4697446235de9ffe9a` (exact head `94d871d`; Gateway, Quality/Chromium/Jekyll/published-site smoke, Graphify and Dead Code passed). Added `/livez`, `/readyz`, kept `/healthz` alias. Branch audit confirmed 64-role memory/knowledge spec and AGENTS/provider E2E already exist in main; old mode selector is superseded; workspace project tools remain deferred. Recovered bounded local-model benchmark harness into current reconciliation branch; target-host model evaluation remains pending. | PR-head CI passed for #121/#122; no independent post-merge Pages deployment run ID returned. Current main `fd4f0a1`; open PRs 0, issue #111 only. | First landing V1 scope is frozen. Next: exact-head CI for this reconciliation branch, then post-merge state snapshot refresh, published Pages deployment check, visual/native mobile review, and owner-only VPS/model/voice/RAG/sandbox/OAuth gates. |\n| V-2026-10-30-LANDING-UX-001 | 2026-10-30 | Recover all pending landing/app visual polish and implement first bounded accessibility improvement | Read legacy UX audit, V1 UI finalization, landing markup and E2E. Consolidated remaining tasks in `docs/LANDING_UX_POLISH_BACKLOG_RU.md`. Existing landing ticker was already present; added visible CSS-only pause/resume controls to all three roadmap tickers and a Playwright regression test. | Commits `f42c42d` (landing) and `b213c8a` (test); exact-head CI pending. Other screenshot/mobile/native accessibility work not yet done. | Next: run current-head CI, then implement visual consistency and interaction polish in bounded slices. |\n| V-2026-10-30-ARCH-DEBUG-VOICE-002 | 2026-10-30 | Inspect Graphify and dead-code artifacts; identify voice capability gaps and new upstream candidates | Graphify artifact #12956306584 inspected: 1,109 nodes, 3,103 edges, 53 communities, no import cycles detected. Dead-code artifact #12956377148 has one false positive on Protocol parameter `max_duration_ms`; no deletion. Confirmed Gateway run #483 passed after missing import fix. Research: Moonshine Voice is a promising optional on-device streaming voice candidate; book-to-skill remains Knowledge-to-Skill reference; llama.cpp/vLLM are GPU-runtime comparison candidates. | Quality/Chromium run #916 was cancelled; rerun requested. Graphify workflow #262 cancelled after artifact generation, so not marked as complete workflow success. Current voice is half-duplex; selection-to-speech, multi-message queue, streaming STT and native AEC are gaps. | Next: complete exact-head Quality/Chromium, continue code/security review and maintain voice/GPU benchmark matrix. |\n| V-2026-10-30-V1-UI-RECONCILE-002 | 2026-10-30 | Continue first-free-landing UI finalization; consolidate requirements, reconcile exact-head failures and refresh repository continuity | Canonical living register is docs/V1_UI_FINALIZATION_RU.md (18 user directions, landing structure, roadmap ticker rules, two-round UX research and acceptance gates). README and PROJECT_STATE point to this canonical file. E2E settings-close selectors target the sticky header; Research Studio excludes the expected provider connectivity probe from chat-send assertion. Privacy sentinel now matches the concise, accurate fallback disclosure in UI copy. | Commit 44ea54e had one integrity assertion mismatch (old expected copy) and Project State Freshness drift (stale ORIENTER/FILE_ORIENTER/VOLLEY/snapshot). The assertion is fixed in code head 6cbd915; state files are being refreshed. Exact-head CI after these fixes is pending; no merge/deployment claim. | Keep PR #121 open until exact-head Quality, Chromium, Jekyll, published-site smoke, provenance and Graphify checks pass. Issue #111 remains owner-only/live-host gate. Native iPhone Safari and live gateway/model remain unverified. | Next: run exact-head CI; fix only evidence-backed failures; review published /landing/ and root client after merge. |
| V-2026-10-30-V1-UI-FINALIZATION-001 | 2026-10-30 | Reconcile first free landing/UI V1 against project principles and current product UX; preserve app/landing boundary; add living 18-point release checklist and roadmap disclosure ticker | PR #121 branch now contains docs/V1_UI_FINALIZATION_RU.md, free-static-UI vs inference-cost copy, expandable roadmap on /landing/, motion-safe 1nv3nt10n 1n PrOc3ss cues for unfinished Agent/Connector directions, landing-specific E2E, unique Settings close action, deterministic provider-group integrity sentinel, and corrected Research Studio probe accounting | At capture: exact-head Quality/Chromium/Pages run #40991938982 was pending on an earlier branch head; subsequent commits retrigger checks. No latest-head green result claimed. Main base is 2bda22229cba3576628f92c821bb6e1562d8abc5; issue #111 remains owner/live-host release gate | Next: inspect exact-head run failures; close only verified CI defects; after merge validate published /landing/ and root app. Native iPhone Safari and live gateway/model/device remain manual/owner gates |
| V-2026-10-29-UX-POPOVER-002 | 2026-10-29 | Dim the background for composer popovers and make the first outside tap dismiss without activating underlying controls | PR #115 merged at `ed2c4c7ee3a67c7a0cf5b541c1ab6206609dd32c`; added composer scrim, modal backdrop blur respecting reduced-transparency, outside-click closure for toolbar/language/chat-row menus, and E2E coverage | Exact-head Quality/Chromium + published-site smoke #40914324102 and Graphify #40914324092 passed; main Quality #40915070855 and Pages #40915070655 passed; native device still unverified |
| V-2026-10-29-USER-PROMPT-001 | 2026-10-29 | Keep optional global user system prompt empty by default and remove obsolete Gemini reset | PR #114 merged at `25bfe66b5454e45fb5f6cef9dd86ae3c0ef1c5e5`; quality sentinel updated and 400-character context serialization headroom added | Exact-head Quality/Chromium/published-site smoke passed on `df3449db132393cdad1a93080d736bb973ae4bc2`; main Quality/Pages/Gateway/Graphify/provenance passed on `80597f61c000d691e95d67893edea60e75da1033` |
| V-2026-10-29-ACTIONS-PIN-001 | 2026-10-29 | Pin GitHub Actions to immutable commit SHAs to reduce CI supply-chain risk | PR #113 merged at `80597f61c000d691e95d67893edea60e75da1033`; PR-head queue, gateway, provenance, quality and Pages checks passed | Post-merge main Quality #40915070855, Pages #40915070655, Gateway #40915070886, provenance #40915070933 and Graphify #40915070939 passed; Project State Freshness failed only because the checkpoint snapshot needed refresh, addressed by this state-refresh change |
| V-2026-10-27-MOBILE-COMPOSER-001 | 2026-10-27 | Keep message input visible at the bottom for new chats and stable through mobile keyboard viewport changes | PR #71 merged; removed centered fixed positioning, made textarea resizing visualViewport-aware, increased bottom touch inset, added Playwright new-chat/viewport-resize regression | Exact-head Chromium and published-site smoke passed; native iOS Safari still requires device validation |
| V-2026-10-27-HELPER-MEMORY-001 | 2026-10-27 | Integrate opt-in local helper-memory suggestions with strict bounds and manual save; close secret-filter regression | PR #69 merged at `4c9096999fbb3e1265150c420b136066c555285b`; exact-head Gateway #40539476154, Quality/Chromium/published-site smoke #40539476242 and provenance #40539476214 passed | Helper remains disabled when ALANDI_HELPER_MODEL is blank; live VPS model/inference quality/RAM/latency remain unverified |
| V-2026-10-27-GRAPHIFY-TEN-QUERIES-001 | 2026-10-27 | Verify Graphify utility with ten focused real code-navigation questions, not only successful generation | Run #40534892152 success; 10/10 queries returned graph neighborhoods (10–151 nodes); graph 940 nodes/2,637 edges/59 source files; artifact #12747755798 retained 7 days | Graph useful as a dev navigation aid, not a runtime component; communities remain generically named without model calls; exact-head Quality gate must pass before merge |
| V-2026-10-27-GRAPHIFY-REFINED-001 | 2026-10-27 | Refine Graphify corpus and inspect actual graph artifact; include main inline UI JS and SQL schema, remove YAML noise | Run #40534094060 succeeded: 940 nodes, 2,637 edges, 44 communities, 59 source files; 209 UI JS nodes, 14 SQL schema nodes; three focused queries returned 134/50/59 nodes | Graph materially improved, but UI query remains broad and labels are generic without LLM; ten focused 700-token queries and final Quality checks pending |
| V-2026-10-27-GRAPHIFY-PILOT-QUALITY-REVIEW-001 | 2026-10-27 | Inspect actual Graphify artifact, not just exit status; identify config-noise and coverage gaps | First pilot #40532798178 succeeded: 1,717 nodes, 2,877 edges, 140 communities; report and graph artifact downloaded and inspected | First graph is not yet accepted: 999 YAML/YML/TOML-derived nodes, SQL schema skipped, main index.md JS absent, broad query returned 49 nodes/45 edges; refined rerun pending |
| V-2026-10-27-GRAPHIFY-CI-PILOT-001 | 2026-10-27 | Replace blocked local Graphify execution with a read-only, code-only GitHub Actions pilot in disposable staging; update orienter/state and preserve release-license discrepancy | Workflow `.github/workflows/graphify-pilot.yml` added on branch `feat/graphify-code-only-pilot-workflow-20261027`; pinned `graphifyy==0.9.96`; artifact only, no runtime dependency | PR-head workflow result still pending; inspect artifact for coverage, query quality, runtime/memory and ignore safety before accepting graph output |
| V-2026-10-27-POST-ARCH-MAP-001 | 2026-10-27 | Record PR #66 merge and update the orienter checkpoint after adding module map and Graphify safeguards | PR #66 merged at `1faf60164b9a0f82eb5e0c56b143ba90499be4a5`; PR-head Quality 6/6 and provenance passed; post-merge Pages/provenance passed; queue 0/0 | Post-merge Quality #40530196483 was in progress at last poll; Graphify execution still blocked by DNS |
| V-2026-10-27-ARCH-MAP-GRAPHIFY-001 | 2026-10-27 | Verify current main/queue; review Graphify upstream and module boundaries; add navigable architecture map and checkpoint | PR #65 merged at `3887b408988e0476251736a8e7a3e3374eb2ce58`; PR-head checks 7/7 passed; map grounded in 140-file tree and confirmed routes | Post-merge Quality #40527418639 success 6/6; local Graphify pilot blocked by DNS; `.graphifyignore` prepared; no generated graph/runtime integration claimed |
# aLandi Engineering Volley Log

| V-2026-10-27-STATE-RECONCILIATION-001 | 2026-10-27 | Reconcile orienter/state to current main, add recent PR milestones, and fix stale PR #61 evaluation/roadmap statuses | Base main `b91aab316c224588baea99fbb9b966b8865de0a6`; live queue 0 PR/0 issues; provenance #40522824071 and Pages #40522822481 passed; Quality #40522824202 still in progress at check | Docs-only branch `docs/current-state-and-mobile-ledger-20261027`; Graphify not run; do not mark current-main Quality green until run concludes |

| Volley | Date | Scope | Result | Gate |
| V-2026-10-27-ROOT-ORIENTER-001 | 2026-10-27 | Promote orienter to repository root workflow via AGENTS.md; refresh current queue and graph pilot checkpoint | PR #63 merged at `623f1865ee4021debade9000bbecf6004c6b4cfa`; main had 0 open PRs and 0 open issues; docs PR adds first-read protocol and explicit graph-tool boundary | Graphify remains unrun because prior container DNS could not resolve github.com; this step does not integrate a graph into aLandi runtime |
| V-2026-10-27-OPEN-SOURCE-TRIAGE-001 | 2026-10-27 | Восстановить orienter, проверить актуальный main/open PRs/issues, добавить построчные решения по дополнительному списку источников и порядок следующих шагов | PR #62 merged at f689cbe17a2996ebd4cd2ca9fcb71d60102a6c25; Quality Sentinels 6/6 and provenance passed. Issue #1 closed as not_planned; PR #37 closed without merge after Chromium/integrity failures | Graphify not run: container DNS cannot resolve github.com. Revisit unique PR #37 ideas as small current-main changes; ambiguous source identities remain marked уточнить |
| V-2026-10-27-MOBILE-MESSAGE-TOOLS-001 | 2026-10-27 | Add full-text user/assistant message viewer, clipboard rejection fallback and a scroll-position-aware jump-to-latest button | Ported onto post-voice main branch; deterministic Chromium regression added; exact-head CI pending | Native iOS Safari clipboard, safe-area and keyboard behavior remain unverified |
| V-2026-10-27-LOCAL-VOICE-DIALOGUE-001 | 2026-10-27 | Carry local push-to-talk half-duplex turn loop onto current main with voice-menu setup guard and mocked ASR/chat/TTS cycle | Merged via PR #60 at `65cdae7a895d58b9f4371e99f64402bdcfe7513d`; Quality #40492599339 passed all six jobs including Chromium and published-site smoke; Provenance #40492599312 passed | CI mocks media/model calls; microphone/device behavior, speech quality, latency and echo remain unverified |
| V-2026-10-27-PROJECT-SCOPE-REGRESSION-001 | 2026-10-27 | Port project memory-scope persistence and clear-history isolation tests onto current main | Three deterministic Chromium E2E regressions carried forward from PR #36; tree rebased onto main `31ea7fd3b56a80f93f8d667d843cf743918ff23f`; exact-head Quality run pending | No production code changes; do not mark the latest tests passed until current-head CI finishes |
| V-2026-10-27-STORAGE-QUOTA-WARNING-001 | 2026-10-27 | Add proactive browser-storage estimates and warning levels at 80%/95%; keep unsupported or rejected estimates non-blocking | Merged via PR #56 at `31ea7fd3b56a80f93f8d667d843cf743918ff23f`; Quality run #40490650505 passed all jobs including Chromium and published-site smoke; Provenance #40490650488 passed | Quota estimates are advisory; export is not a full-profile backup, and restore has not been proven |
| V-2026-10-27-CODE-HYGIENE-001 | 2026-10-27 | Vulture candidate review: remove unused `ValidationError` import; retain `max_duration_ms` because it is part of the injected TTS protocol contract | Merged via PR #57 at `0c81cd8b9556c56ed545d93882e3d2021bf57300`; Gateway Tests, Quality Sentinels and Dead Code Audit passed on exact PR head | Do not delete protocol parameters based on static unused-argument reports alone |
| V-2026-10-21 | 2026-10-21 | Gateway foundations: memory delta, RAG baseline, OAuth vault, RSS metrics | Merged in PR #18; RAG identity isolation/legacy migration merged in PR #19 | Contract tests and offline smoke eval passed |
| V-CODER-PACKET-FOUNDATIONS | 2026-10-22 | Trace IDs, provenance-first temporal memory, voice contracts, bounded tool DAG, JSON Schema, SSRF/approval primitives, citations/evidence ledger, hardware/license/latency docs | Contract foundations merged; runtime remains prototype-only until separately deployed | Do not enable voice/tool/OAuth/RAG flags or claim live deployment |
| V-2026-10-23-CLOUD-UI-PROJECTS | 2026-10-23 | Primary aLandi aServi card, provider recovery, project CRUD/instructions/browser-local memory/export, theme/language/clock/composer/text attachments and voice preview | PR #21 merged at `97793ddfc00b1d364e9109ecd3efabe927a1f08a`; PR-head Chromium/quality/gateway/provenance/Pages checks passed | Live aLandi gateway unconfigured; project data remains browser-local; voice is preview-only; latency unmeasured |
| V-2026-10-23-ALANDI-V016-SEARCH | 2026-10-23 | Source fingerprint, offline provenance checks, target-only latency budget, typed router prototype, bounded keyless search and UI regression tests | PR #21 merged; E2E and Pages passed | Fingerprint is not attestation; router is not runtime-integrated; public-source CORS remains a constraint |
| V-2026-10-23-PROVIDER-RACE | 2026-10-23 | PR #22 prevents stale provider/model/base URL/key probe results from overwriting active settings; three deterministic race tests | Merged at `7fac23ce3e50e0bcb1169e312a3d692484b95808`; PR-head quality/Chromium passed | Mock E2E is not live-provider proof |
| V-2026-10-23-POST-MERGE-STATE | 2026-10-23 | PR #23 reconciles source-of-truth, To Do, EVALS and V-016 after the UI merge | Merged at `36e9a6441989e8c2d3b7f813a86479d620365e49`; PR-head quality and Pages smoke passed | Reconcile again after subsequent merges |
| V-2026-10-23-RAG-SCOPE-DELETE | 2026-10-23 | PR #24 validates RAG scope pairing and version-gates SQLite/FTS5 secure-delete | Merged at `0ae1ed1892380562d148574abc2d2cd64e5abe9d`; gateway/provenance/quality/Chromium/Pages passed | Does not erase evidence copies, WAL/backups or browser storage; no crypto-erasure SLA |
| V-2026-10-23-PROVIDER-SMOKE-CONSENT | 2026-10-23 | PR #25 requires explicit live-smoke consent (default false) and supports per-provider model override variables | Merged at `9006c7ed8737174e73c615504eb80362f4673949`; quality, Chromium, Pages smoke and provenance passed | Live provider smoke was not dispatched; no account availability claim |
| V-2026-10-23-MEMORY-FTS5-SEARCH | 2026-10-23 | PR #26 adds bounded scope-filtered FTS5 search, confirmed-only default, delete triggers, legacy backfill and capability-gated secure-delete | Merged at `cbc5e19b14c5d464782108b4f0534faac88290c2`; Gateway/provenance/quality/Chromium/Pages passed | Module-level retrieval only; not whole-system crypto-erasure |
| V-2026-10-23-MEMORY-GRAPH-API | 2026-10-23 | PR #27 adds authenticated feature-flagged single-owner graph API for candidate creation, search/list, explicit review, relations/supersede and scoped delete | Merged at `653febb01e2f9887dfec8116bf81f26f39e5077a`; post-merge Gateway/provenance/full quality/Pages passed | API not connected to browser localStorage; double opt-in for global scope; no multi-user ACL |
| V-2026-10-23-CPOCKET-RUNBOOK | 2026-10-23 | cPocket bounds cleanup registration and continues after cleanup RuntimeError/CancelledError; from-zero guide documents memory API, current model/fallback behaviour and experiment limits | PR #28 merged at e424d353; Gateway, Quality Sentinels, provenance and Pages passed on post-merge main | No live audio runtime, target-host FD soak or gateway/VPS deploy is claimed |

| V-2026-10-23-MEMORY-BROWSER-BRIDGE | 2026-10-23 | Browser UI manually transfers local project facts as server candidates, reviews/deletes graph facts, and retrieves confirmed server facts only with two per-chat opt-ins | PR #29 merged at `55248f81585c52d7cc7ba7cfc08158a291a761ca`; PR-head and post-merge Quality/Chromium, provenance and Pages checks passed; Gateway tests passed on unchanged base `e424d353418cad62981eb269b4082d2925592708` | No live gateway activation; graph flag remains off by default; global memory remains disabled; no automatic migration |

| V-2026-10-28-LOCAL-TTS-VOICE-CHOICE-001 | 2026-10-28 | Собраны существующие ASR/TTS источники и матрица лицензий; добавлен allowlist установленных Piper voice IDs, авторизованный inventory в capabilities, выбор голоса в mini-player и тесты | Ветка `feat/configurable-local-tts-voices-20261028`; PR ещё не открыт; голосовые runtime-флаги остаются off by default | Тесты локально не запускались; exact-head CI, реальные голосовые файлы, лицензии/hash и микрофон целевого устройства не проверены; rollback — revert коммитов ветки |

## Required fields for future entries

- Git SHA and PR link
- Exact files/architectural changes
- Test command and result, with sample count
- Benchmarked hardware/model artifact hashes (if relevant)
- Accepted/rejected assumptions and remaining blockers
- Rollback method
- Whether the change is merely merged, or has been activated and verified on the target runtime
| V-2026-10-28-VOICE-LANDING-RUNBOOK-001 | 2026-10-28 | Add owner-executable VPS landing instructions for local ASR/TTS artifacts, voice allowlist, SHA-256/license provenance, feature-flag sequencing, private bind, smoke and release acceptance | Updated `docs/VOICE_IMPLEMENTATION_PLAN_RU.md`, `docs/USER_REQUEST_CHECKLIST.md`, and `docs/PROJECT_STATE.yaml` on `feat/configurable-local-tts-voices-20261028`; code-head CI for `b8b7bde4` passed Gateway, Quality/Chromium, and provenance | Latest docs-updated branch head needs exact-head CI confirmation; private VPS cannot be reached through current GitHub integration; actual voice artifacts/licenses and real microphone remain owner-side ship gates |

| V-2026-10-28-VOICE-PR75-MERGED-001 | 2026-10-28 | Merge selectable preinstalled Piper voices after exact-head gates; reconcile state and deployment boundary | PR #75 merged by squash at `4296a8decc12710fafb0a1a4e9644cd8f00b2dfa` from head `006d5d564b6afd4606a604baab0cf1f78e745565`; Gateway #40633704413, Quality/Chromium/Pages smoke #40633704436, provenance #40633704435, and dead-code audit #40633704411 all succeeded on PR head | Post-merge main CI still needs a fresh check. No local test run, live VPS, installed model, exact voice artifact SHA/license approval, real microphone/device playback, or latency/RAM benchmark is claimed. ASR/TTS flags stay off by default; rollback: revert merge commit `4296a8d` and docs follow-up if needed |

| V-2026-10-28-FIRST-RUN-GUIDE-001 | 2026-10-28 | Reconcile outdated quickstart and document first text/document/voice request sequence | Updated docs/START_HERE_RU.md: text completion, local PDF/DOCX/XLSX extraction gate, three distinct voice flows, safe feature-flag sequencing and links to the voice runbook; corrected the stale statement that PDF/DOCX/XLSX extraction was unsupported | Documentation review only; no server/device request executed. Post-merge main CI cannot yet be confirmed from the available run/status results; current model/voice artifact SHA-256 and license review, VPS installation and real audio remain blocked on owner-side verification. Rollback: revert this documentation commit |


## V-2026-10-28-GRAPHIFY-REGULAR-CHECKS-001 — регулярная проверка графа архитектуры

- **Цель:** использовать Graphify как живой инструмент навигации по коду, а не как одноразовый успешный CI-прогон.
- **Подтверждённая база:** run [#40534892152](https://github.com/DorpNay/skills-github-pages/actions/runs/40534892152) успешен; граф содержит 940 узлов, 2637 рёбер и 59 исходных файлов; 10/10 сфокусированных запросов вернули соседства. Артефакт ограничен 7 днями хранения; в git граф не добавляется.
- **Изменение:** ветка `ci/graphify-regular-architecture-checks-20261028`; расширены workflow path filters на основной UI, gateway Python/SQL, scripts, E2E и skill assets; добавлен еженедельный drift-check. Граф строится в disposable staging из tracked files, без LLM/model calls; secret/media/database ignore и artifact-only output сохранены.
- **Проверки:** текущий main на старте — `4fc342b468e370c792f1e87e77a20fda4de6bbaa`; Quality run `40634598755` прошёл 6/6 jobs, Pages deployment `40634598517` прошёл. Для новой ветки обязательны собственные Graphify, Quality/Chromium и provenance checks; до этого изменение не считается принятым.
- **Сопутствующий triage:** на PR #72 выявлены два устаревших E2E assertion; поправлены на head `407a42ca16dfd69bee91620ae8deed098d229226`, повторный Chromium gate выполняется. PR #70 нельзя объединять напрямую (`mergeable=false`, exact-head checks не подтверждены); RRF следует перенести отдельным изменением на актуальный main. PR #74 оставить черновиком до сохранения полезного readiness-аудита и reconciliation.
- **Границы:** Graphify не runtime-модуль, не тест функциональной корректности и не замена RAG golden set. VPS, реальная модель/голос и физические устройства по-прежнему требуют отдельных проверок.
- **Следующий шаг:** дождаться exact-head gates; затем портировать RRF на актуальный main и проверить deterministic ranking, Recall@5, citation metadata, scope isolation и deletion/upsert behavior.

## V-2026-10-29-STATE-FRESHNESS-GUARD-001 — восстановить актуальный ориентир и автоматизировать контроль дрейфа

- **Проверенный baseline main:** `337e38690af8f22a712c6442192c5ea62d354c3d`, коммит от 2026-10-28 `docs: preserve engineering and runtime readiness audits`; это последний main action на момент аудита, а не последний функциональный кодовый коммит.
- **Последний функциональный checkpoint:** `91557e4eab1b122341bed578cdf4775ff867007f`; Gateway #40637941350, Quality/Chromium #40637941308, Graphify #40637941303 и Pages #40637941951 прошли на этом кодовом SHA. Документационный main `337e38690af8f22a712c6442192c5ea62d354c3d` прошёл Quality #40639031308 и Pages #40639030224.
- **Очередь, проверенная через GitHub API 2026-10-29:** open PRs (9): #78, #80, #81, #82, #83, #84, #85, #86, #87; open issues (14): #88, #89, #90, #91, #92, #96, #97, #98, #99, #100, #101, #102, #103, #104.
- **Важное расхождение:** PR #78 открыт и основан на `91557e4eab1b122341bed578cdf4775ff867007f`, поэтому его документы ещё нельзя считать частью текущего main. Текущий main уже содержит `337e38690af8f22a712c6442192c5ea62d354c3d`, сохранивший readiness-аудиты и runtime/device boundaries.
- **Изменения:** добавлены `docs/project-state-snapshot.json`, `scripts/check_project_state_freshness.py`, `tests/test_project_state_freshness.py` и ежедневный workflow `.github/workflows/project-state-freshness.yml`; синхронизированы `ORIENTER.md`, этот ориентир и `docs/PROJECT_STATE.yaml`.
- **Проверка политики:** PR-check сверяет exact main SHA и точные множества открытых PR/issues с GitHub API; исключает только PR, на котором запущен текущий check. Daily/manual/main check принимает только сам snapshot baseline или непосредственно следующий коммит, который обновил все обязательные orienter/state files. Изменения очереди не скрываются и не автоисправляются — CI печатает missing/new IDs и завершает run ошибкой.
- **Локальная проверка:** 10 unit tests для schema, exact queue comparison, PR exclusion и main-SHA drift passed в изолированной тестовой копии. Live API check и repo-wide CI должны подтвердиться на PR head.
- **Границы:** VPS/gateway, реальные модельные/голосовые артефакты и физическое устройство не проверялись и не считаются развёрнутыми. Rollback — revert этого документационного PR/коммита; runtime flags и production code не меняются.

| V-2026-10-29-RESEARCH-APPLY-001 | 2026-10-29 | Apply highest-confidence recommendations from the comprehensive engineering report without enabling unverified runtime features | Verified current main SHA `375bcc10efe7b3a0e3e999b6504face1974a7cce`; merged PRs #84 (CORS canonicalization), #81 (deployment repository preflight), #83 (in-memory SQLite delta persistence), #82 (readiness/model policy audit), #106 (offline RAG evaluator core), #107 (private/shared memory UI), and #108 (launch page/first-stack runbook/mobile viewport fix). Closed #80 after carrying its evaluator core to #106; closed #85 pending real target-host voice acceptance; closed original #86/#87 after their reconciled implementations were merged as #107/#108. | Exact PR-head CI passed for each merged change; latest #108 Quality Sentinels #40896977015 and Graphify #40896977071 passed, including Chromium and published-site smoke. No live VPS/Tunnel/Ollama, OAuth, voice device, or target-hardware benchmark was run. | Runtime flags remain disabled by default; RAG fixture is smoke-only, not production relevance evidence. Main branch protection and SHA-pinning of all Actions are still unresolved. | PR #78 was closed after its unique docs were carried into the reconciliation branch. Research-only issues #88–#92 and #96–#104 were closed with comments; unresolved owner/live-host acceptance remains in issue #111. The state-refresh PR is the only active PR. |

| V-2026-10-29-STATE-RECONCILIATION-001 | 2026-10-29 | Reconcile research decisions and refresh project checkpoint after PR #109 merge | PR #109 merged; main now c848212832b44a7f4c8ae08cf090de590a47cc89; PR #113 proposes immutable SHA pins for all external actions and CI enforcement | PR #109 exact-head checks passed; post-merge checks on c848212 not yet independently verified; PR #113 exact-head checks pending | Do not merge PR #113 until exact-head checks pass; issue #111 retains owner-only ruleset, live host, hardware, RAG golden set, voice/device, OAuth and sandbox gates | Revert PR #113 if pinned actions break workflow execution |

| V-2026-10-29-RESEARCH-APPLY-001 | 2026-10-29 | Apply the highest-confidence security and release recommendations from the comprehensive aLandi engineering report | Grouped report decisions into 15 problem domains; pinned external GitHub Actions/reusable workflows to verified commit SHAs; added a CI guard against floating refs; refreshed the checkpoint after PR #109 merge | Local checker behavior verified for SHA/local/Docker/floating refs; PR #113 exact-head checks pending; post-merge main checks for c848212 not independently verified | Keep all experimental runtime flags off; owner-only ruleset, live VPS/hardware, labelled RAG corpus, voice/device, OAuth and sandbox remain blocked under issue #111 | Revert PR #113 if CI/action behavior regresses; no merge or deployment without owner approval |

| V-2026-10-30-THREE-ROLE-AUDIT-001 | 2026-10-30 | Start user-requested architecture integrator → debugger → release planner audit; preserve every task and checkpoint | Added `docs/ARCHITECTURE_DEBUGGER_PLANNER_2026-10-30_RU.md` with complete task list, verified architecture boundaries, source triage, release slices and per-step log. PR #121 is 144 commits ahead / 0 behind main. Found Lite Gateway CI failure: missing import of `canonical_action_digest` in test module; added import in commit `f9d5afaae983675d2c616e3fbc70942840d314e5`. Freshness, provenance, dead-code report and Graphify passed on previous head; quality was still running. | Re-run Gateway/Quality/Graphify/Provenance on post-fix HEAD; then complete cross-subsystem audit. Voice, GPU, runtime and owner-host claims remain unverified; no files deleted. | Next: inspect post-fix exact-head checks, then work through request lifecycle, providers, memory/RAG, DAG/security, voice and document pipeline. |

| V-2026-10-30-OWNER-VOICE-AGENT-003 | 2026-10-30 | Convert the new owner addendum into release requirements and research small models/agent protocols | Added P0-13…P0-18 for STT, realtime conversational voice, selection TTS, single-message TTS, multi-message queue and real device acceptance; added P1-10…P1-17 for helper registry, GPU profiles, optional vLLM, multi-agent runtime/load tests and Knowledge-to-Skill lifecycle. Reviewed Agent Skills standard, Qwen3.5-0.8B, Granite-4.2-3B, OpenWOP v2, LangGraph interrupts and Temporal durable workflows. | Moonshine Voice is attractive for streaming, but current listed STT language set does not include RU/TH; exact non-English model license varies. OpenWOP asks for first independent implementation; treat as research only. No model or orchestrator integrated. | Next: continue subsystem/debug audit and complete current PR Chromium run; no destructive cleanup without verified references. |


### 2026-10-30 — Voice and agent release requirements
Added P0 voice acceptance tasks for editable STT, streaming conversational dialogue, selection TTS, full-message TTS, multi-message queue and real RU/EN/TH device tests. Added P1 tasks for helper model registry, GPU profiles, bounded multi-agent execution, load tests and Knowledge-to-Skill lifecycle. Reviewed Agent Skills, Qwen3.5-0.8B, Granite-4.2-3B, OpenWOP v2, LangGraph and Temporal. Moonshine Voice is promising for streaming but its currently listed STT languages omit RU/TH; no model/runtime was adopted. Continue subsystem audit and Chromium checks. No files deleted.

### 2026-10-30 — ASR/TTS subprocess cancellation fix
Confirmed defect: local ffprobe/ffmpeg/whisper.cpp and Piper child processes were terminated on timeout but not on request cancellation. Added shared cleanup helper `await_local_process()` in gateway/app.py and regression tests for timeout/cancellation in gateway/tests/test_audio_concurrency.py. Functional commits: 77b2691 and 363bb5c. Equivalent local subprocess smoke passed (both children killed/reaped, return code -9). Repository Gateway CI on the new code SHA is pending; prior Gateway #483 (150 tests) predates this fix. GitHub connector has no workflow_dispatch capability for a new run.

### 2026-10-30 — Verified temporary-file cleanup
Inspected temp/1 through temp/5 and searched repository references. Updated IMPROVEMENT_SELECTION.md, then removed temp/3 (obsolete conversation scratch), temp/4 (simulated brainstorming with stale claims), and temp/5 (generic Jekyll plan unrelated to aLandi). Kept temp/1 and temp/2 as historical research. No production code removed. See detailed tracker and project state for deletion commit SHAs.

### 2026-10-30 — Sync latest main and merge landing polish requirements
Main advanced by docs-only commit e6404d510229fa64a7bb375995d76dcba55de623, adding docs/LANDING_UX_POLISH_BACKLOG_RU.md. Synced PR #121 through two-parent merge commit 2c1e6bd811546a87f0ac86bc5e550dd9a31aeb13; compare was 194 ahead / 0 behind immediately after sync. Merged the remaining screenshot, keyboard/screen-reader, app visual consistency, popover/dialog, mobile Safari, VoiceOver and published Pages tasks into FIRST_FREE_LAUNCH_BACKLOG_RU.md. Refreshed PROJECT_STATE, project-state-snapshot, ORIENTER and FILE_ORIENTER. Current base main e6404d5; exact-head CI remains incomplete.

### 2026-10-30 — Landing voice requirements and ASR research
Updated landing/index.html to make voice a visible first-functional-update commitment: editable STT, conversational voice with interruption, selected-text TTS, whole-message TTS and multi-message playback queue. Copy clearly separates current ASR/Piper/half-duplex prototype from unfinished streaming, echo cancellation, barge-in, queue and target-device tests. Added Playwright assertions in tests/e2e/landing.spec.mjs; CI not yet run on this exact head. Researched multilingual streaming ASR: Nemotron 3.5 ASR Streaming 0.6B, Qwen3-ASR-0.6B via sherpa-onnx, and Parakeet RNNT 1.1B; Whisper remains baseline until RU/EN/TH golden-set and license benchmark.

### 2026-10-30 — Exa research, XML hardening and Node24 CI
Reviewed 45 targeted Exa queries (up to 360 requested result slots) and fetched primary repositories/model cards. Added docs/EXA_RESEARCH_SYNTHESIS_2026-10-30_RU.md. Decisions: keep whisper.cpp/Piper; measure NeMo-Speech.cpp, Nemotron 3.5 (RU-ready / TH adaptation-ready), Typhoon Thai ASR, VibeVoice (RU/no TH), VoxCPM2 (RU/TH TTS) and optional 80GB VoiceChat tier. No runtime adopted. Fixed OOXML DTD parsing and duplicate tests in 051308c; Gateway 156 passed. Updated direct Node24 Action pins in 48874eab. Exact-head Gateway, Quality/Chromium/Pages smoke, Graphify, Dead Code, Provenance and Freshness passed. External exercise-toolkit remains pinned pending semantic compatibility review.


### 2026-10-30 — Whole-stack integrity audit baseline recorded
Before beginning the audit, re-read live PR #123, current main base and issue #111. Recorded baseline: PR #123 open/mergeable, HEAD `f6e67db5a7e39abc5f9351aae5ccadefc58e865e`, base `fd4f0a105183feb23e0f4e4697446235de9ffe9a`; prior exact-head CI 6/6 passed, subject to re-run after any new commit. Issue #111 remains open for owner/environment gates. Created `docs/WHOLE_STACK_INTEGRITY_AUDIT_2026-10-30_RU.md` with frozen stack boundaries, initial full checklist and independent reviewer handoff brief. No source code changed in this stage. Post-merge Pages and live VPS/Ollama remain unverified.

### 2026-10-31 — Landing UI v2.0 continuation checkpoint
- PR #131 remains the isolated V2 UI workstream; V1 in main remains untouched. No merge/deploy performed.
- Branch feat/landing-v1-accessibility-responsive-20261031, verified code/test head before continuity-doc commits: b12038e8ee58aba77191daa29de4a232536179f2; 44 commits ahead / 4 behind current main; merge base e78a73b25725bfa63370d9946887cbbacbf51b82.
- Added exclusive aLandi aServi settings behavior; collapsed private/shared memory explanations; added E2E assertions for disclosure behavior and actual text scaling.
- Removed five stale delegated action cases for retired experimental server/helper-memory UI. Independent local/private/shared/project-local memory remains.
- Project Sources remains explicitly unavailable because the gateway lacks a source-list API; no mock CRUD controls.
- Exact-head combined status and workflow-run lookups returned no entries. No E2E/CI result is claimed; execute focused Chromium and full Quality/Freshness/Provenance/Graphify checks next.

### 2026-10-31 — exact branch checkpoint refresh
- PR #131 remains open and isolated for aLandi Landing UI v2.0; V1 remains in main. PR body now reflects partial implementation and unexecuted verification.
- Latest verified branch head: dfaeee97692fd65384ddc070b2b09d99875c5877. Compare main: 49 ahead / 4 behind; merge base e78a73b25725bfa63370d9946887cbbacbf51b82.
- The branch contains follow-up control-geometry/typography normalization and obsolete provider/sidebar label cleanup after the earlier b120 checkpoint.
- Exact-head status/workflow-run lookups remain empty. Do not claim CI/E2E passed. No merge or deploy.


### 2026-10-31 — Readability preview/reset slice
- Added a live preview that follows the selected text scale and contrast in light/dark themes, plus a one-action reset to defaults.
- Added E2E assertions for preview scaling and reset persistence. Not executed yet; no passing test result claimed.
- Current code/test head: 934f5f30189f8615ece8be64474da272809a53e4; 55 ahead / 4 behind main. Exact-head CI queries returned no entries.

### 2026-10-31 — latest PR #131 head reconciliation
- Latest verified branch head before this checkpoint: 5289c2d17f1cd9d69ff1857c82942798367e1a62; 60 commits ahead / 4 behind main; merge base e78a73b25725bfa63370d9946887cbbacbf51b82.
- Exact-head combined status and workflow-run queries returned no entries; Chromium/E2E remains unexecuted. PR body and V2 implementation ledger refreshed. No merge/deploy.

### 2026-10-31 — PR #131 project creation and chat-membership correction
- Re-read owner requirement 8.1 and confirmed a real violation: `createProject()` reassigned the active chat to the new project, while project creation and full settings shared one modal.
- Added a dedicated project-creation dialog with basic name/instructions; full project settings remain reachable only through the selected project's gear.
- Removed automatic current-chat reassignment and chat-history writes from project creation. The active chat-list filter remains anchored to the current chat; the user explicitly creates a project chat using that project's “New chat” action.
- Kept the project-create back control at a 44×44px touch target.
- Updated Playwright cases/helpers for project creation, focus/Escape, touch targets, project-scoped memory/context, import/export and deletion.
- Commits: code `5a49d8db6f05f2c328067d1da6fdb188ee7830ca`; E2E updates `fcbd9ec2f88a883c7e509facc7238374ebb2e73a`, `2c5dfcf391c81d4d9d578b7daee9b6a4cebde88b`, `4c5c583d08d242308b9019417cb0c90bcaf264d3`.
- JavaScript syntax parsing passed for the inline app script and Playwright test module. Exact-head workflow-run and combined-status lookups returned no entries; Playwright tests were not executed and are not marked passed. Current compare: 72 ahead / 4 behind main, merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`.
- No merge/deploy. Next: exact-head Quality/Chromium if workflow execution becomes available; then continue remaining 8.1 accordion/memory hierarchy and other V2 gaps.


### 2026-10-31 — memory hierarchy and sidebar accordion state in PR #131
- Aligned memory section order with owner requirement 8.1: shared memory first, personal memory second, personal-memory request-context opt-in at the bottom; fixed Russian grammar in the shared-memory help summary.
- Added E2E assertions for this DOM order and for sidebar close/reopen: only memory settings/help collapse, while project navigation, “Без проекта” and Chats preserve their open/closed state.
- Code commit `a541932307c764e56f81b795b940785839128338`; test commit `64cfa3abfd1750751951cf1715502e7ca3409ce4`. Syntax parsing passed; no browser test run/status exists for this head.
- No merge/deploy; continue remaining Landing V2 requirements in PR #131.


### 2026-10-31 — last-closed-chat restoration regression in PR #131
- The local last-closed-chat restore path already existed; added a Playwright scenario that deletes a chat, reloads the app and restores that chat from local storage without creating a new one.
- Test commit: `2bfc6c080abeef00ed2566e54e0b847f40c11e2d`. JavaScript syntax parsing passed; browser E2E was not executed and is not marked passed.
- PR #131 remains open and unmerged; no deployment.


### 2026-10-31 — project-to-existing-chat context handoff in PR #131
- Implemented a project-settings action to choose an existing chat and queue project context for that chat's next request. The action preserves the current chat and all project memberships; it does not create a chat. It reuses the per-chat request-context queue and five-project limit.
- Audited the newly added path and fixed a malformed `querySelector` for the handoff button; without the closing attribute quote, `renderProjectUI()` could throw and the handoff control would remain disabled.
- Added E2E coverage for handing off to a non-current chat, unchanged current chat/chat count/project membership, and one-shot context consumption after the next successful request.
- UI fix commit `c3855c28317c5b481d59b463e4d4cb985d992dcd`; E2E commits `ccb76ea689ddb0ad6ef8d580dee06148aab6f94f` and `24004fe48e506a7d1a7e03b1538f3faed209381b`.
- JavaScript syntax parsing passed. Playwright/Chromium and exact-head CI were not executed; no passing result is claimed. No merge/deploy.

### 2026-10-31 — Landing UI V2 navigation/modal/readability follow-up
- PR #131 only; main/V1 untouched; no merge/deploy.
- Browser Back now tracks project-filter and modal depth; Escape uses the same stack. Dialogs share focus return/trap and scroll-lock cleanup.
- Added explicit project → existing chat context handoff (next request only; no chat creation or project reassignment); corrected handoff selector and covered one-shot consumption.
- Expanded viewer keeps accessible copy/speech icon actions. Status/toast states use semantic colors; high-contrast text applies to secondary/disabled/link/error/status states in both themes.
- E2E scenarios added for Back, modal lifecycle, handoff, viewer controls, semantic status and contrast. Exact-head CI/Chromium has no result; tests remain unexecuted.
- Next: exact-head Quality/Chromium, then native mobile/VoiceOver acceptance.

### 2026-10-31 — browser Forward support in Landing V2
- Project-filter and modal history entries now restore on browser Forward as well as close/restore on Back.
- Added E2E assertions for project-filter and modal Forward paths. Exact-head browser execution remains pending.
- PR #131 remains open; no merge/deploy.


### 2026-11-01 — PR #131 continuation: requirement 8.12 audit and gateway secret-leak regressions
- Reconstructed the exact PR #131 branch head before editing; V1/main remains untouched and PR stays open.
- Completed the 8.12 backend ownership audit: removed server-memory graph HTTP routes and graph-specific env flags in this branch; retained MemoryManager/schema only for Graphify/code-evidence, without deleting SQLite data. Conversation delta sync, RAG, browser-local personal/shared/project memory and the independent local helper remain separate.
- Tightened the E2E retirement regression so it tests only the removed graph bridge and does not conflate the independent local helper route.
- Added gateway regressions: /livez, /readyz and /healthz must not expose API/OAuth secrets; invalid bearer tokens are not echoed; upstream error bodies containing synthetic API/OAuth secrets are replaced by the gateway's bounded error response.
- Test source updated; NOT EXECUTED. Exact-head GitHub workflow-run and combined-status queries returned no entries. No CI/Playwright pass is claimed.
- The exact current head, compare-to-main counts and verification boundary are maintained in `docs/PROJECT_STATE.yaml` and the PR #131 checkpoint. PR #131 remains open/unmerged; no deployment.


### 2026-11-01 — PR #131: 8.13 handoff audit and 8.14 touch-selection regression
- Re-audited 8.13 against the owner checklist and current implementation: project context is queued only after an explicit action against an existing chat; project membership and active chat remain unchanged; the next successful request consumes the handoff; request context remains capped at five projects. Pending handoff is intentionally session-only. Reload persistence is not specified by 8.13, so no new persistence layer was introduced.
- Expanded the 8.14 Playwright regression to cover non-selectable buttons/disclosures and touch-action, while editable input, assistant message text and expanded message content remain selectable. The test checks both standard and WebKit-prefixed selection properties.
- Test commit: `64a1a811bd5531d8095245d649829fd838486821`; ledger update: pending next documentation commit. Source has been inspected, but Playwright/Chromium and native iOS Safari/VoiceOver have NOT been executed. No test pass is claimed.
- Continue with remaining 8.14 device-specific gesture checks only when a real device/browser is available, then proceed to 8.15 status/reduced-motion regression. PR #131 stays open; no merge/deploy.


### 2026-11-01 — PR #131: requirement 8.15 status and reduced-motion coverage
- Inspected the existing status/toast state mapping and motion rules. The app already has neutral/info/success/warning/error status colors, semantic toast colors, centered status/ticker layout, elapsed-time reporting without fabricated progress, and reduced-motion overrides.
- Added a focused Playwright regression for all five distinct status colors, toast state styling, centered alignment and disabling the roadmap marquee under `prefers-reduced-motion`.
- Test commit: `9a6cbe71e3c433bd20b1d0fbddfbd799834019d5`; implementation ledger updated. Test source has NOT been executed; no Chromium pass is claimed.
- Next: continue 8.16 consistency audit, then 8.17 readability contrast coverage. PR #131 remains open/unmerged; no deployment.


### 2026-11-01 — PR #131: requirement 8.16 message action consistency
- Audited the inline message-action renderer and found duplicate `aria-label` writes with conflicting copy/view wording, plus the speech control's tooltip being overwritten without updating its accessible name.
- Corrected the renderer so each icon-first copy/view/speech action has one concise label shared by `title` and `aria-label`.
- Expanded E2E assertions for all inline and expanded-view message actions: labels match tooltips and inline action hit targets remain at least 44×44px.
- Code commit: `f1b7792dd6c38af08cf4e3f8979660890a3bea0a`; test commit: `a6ce9eed87d6c239b9f5ea394ab04359939479e2`; ledger update: `280f2c94aa34787d86f793ca17ef32a2bdb61184`. Playwright remains unexecuted; no pass is claimed.
- Next: audit 8.17 contrast controls and verify the full set of text states in both themes. PR #131 stays open; no merge/deploy.


### 2026-11-01 — PR #131: requirement 8.17 high-contrast text-state coverage
- Audited the current readability controls: persistent 90–120% text scale, standard/high contrast choice, live preview/reset, and theme-aware tokens for secondary, disabled, links, errors and statuses are already implemented.
- Added a Playwright scenario that compares normal/high-contrast computed colors for secondary, disabled, link, error and status text in both dark and light themes, while checking that primary message text remains unchanged.
- Test commit: `787c9aaf6026559da31daf51d82f884abdc78c1d`; ledger update: `daa31d62893fb71c1147cac2e76d902ed458a3a2`. Browser execution and actual WCAG contrast-ratio audit remain pending; no conformance claim is made.
- Next: exact-head CI/browser execution when available, then close remaining 8.1–8.11 verification gaps and perform the full acceptance sweep. PR #131 remains open/unmerged; no deployment.


### 2026-11-01 — PR #131: requirement 8.1 sidebar swipe acceptance
- Audited the existing sidebar touch handler: it closes only on a predominantly horizontal left swipe (minimum 72px); vertical movement is intentionally ignored. Closing collapses memory disclosures while preserving project/chat navigation state.
- Added a mobile-viewport Playwright regression: vertical swipe leaves the sidebar open, horizontal left swipe closes it, and reopening preserves the expanded project list.
- Test commit: `d388a02445ddc1ebccbaec58fd8515b8d0b9adfa`; implementation ledger update: `59e30ad32d0389f785955feb03ee8516b8368a41`. Test is source-only until Chromium and native touch execution are available.
- Requirements 8.3 and 8.7 already have source/E2E coverage for Cloud-vs-peer disclosure rules and the truthful unsupported project-source state; no fake source CRUD or duplicate accordion logic added.
- Next: audit and close the remaining 8.1–8.11 test gaps; prioritize chat restoration/accordion persistence and 8.2 header typography/responsive layout. PR #131 remains open/unmerged; no deployment.


### 2026-11-01 — PR #131: requirement 8.2 responsive header coverage
- Audited the header implementation: chat title is a bordered standalone surface; wordmark has a rounded heavy display treatment; clock remains in the header; Fast/Thorough controls have compact 28px minimum height; the shared system font stack is applied consistently.
- Added a Playwright layout regression at 320/360/390/768/1024/1440px for header horizontal overflow, title treatment, clock presence, wordmark styling and compact mode controls.
- Test commit: `9ff326d40ac0567c1c62c293cb396bcd9c4eba82`; implementation ledger update: `1293af834c8b765828e45c2f6cf0af3fbedcb530`. Test remains unexecuted; screenshot review and native mobile rendering remain pending.
- Next: continue the 8.1–8.11 gap audit. Existing coverage already exercises 8.3 Cloud/provider group transitions, 8.6 browser Back/Forward and 8.7 truthful Sources unsupported-state.


### 2026-11-01 — PR #131: reconcile legacy UI checklist with current V2 work

- Compared pre-8.1 sections 1–7 and the previous visual-polish backlog against the current PR #131 source, the 8.1–8.17 owner requirements and the latest implementation ledger.
- Reclassified old [~]/[ ] items in sections 1–7 as historical V1 baseline rather than a second active queue; mapped still-relevant gaps into one consolidated section 8.0.
- Consolidated the remaining work into P0 exact-head Gateway/Playwright/Quality checks; P1 native iPhone/VoiceOver, screenshot, localization/theme and measured contrast acceptance; P2 long-content/scroll/popover stress, truthful capability labels, Tavily/keyless-search audit and provider/gateway error contracts.
- Removed stale duplicate backlog language: LANDING_UX_POLISH_BACKLOG_RU.md now mirrors section 8.0 and the V2 implementation ledger rather than acting as an independent plan.
- Explicitly marked Project Sources CRUD as blocked by the missing gateway source-list API; 8.12 graph bridge/UI removal is implemented pending tests; 8.13 session-only handoff is intentional, not a persistence gap.
- Updated V1_UI_FINALIZATION_RU.md, LANDING_UX_POLISH_BACKLOG_RU.md, LANDING_UI_V2_IMPLEMENTATION_RU.md, ORIENTER.md and docs/PROJECT_STATE.yaml. PR #131 remains open/unmerged.
- Documentation updates do not constitute test execution. Exact-head Gateway/Chromium/CI, native iPhone/VoiceOver and WCAG contrast-ratio checks remain unexecuted. No passing test or merge/deployment is claimed.
- Latest known code/test head before documentation-only commits: 8f68c2cc4b4b01a1917e32f75f7d5016517d41c3. Latest documentation commit at this entry: pending.
- Next action: execute exact-head verification (Gateway + focused Playwright/Chromium + full Quality/Freshness/Provenance/Graphify/Dead Code where available); fix only confirmed failures, then continue manual acceptance.


### 2026-11-01 — PR #131: source audit of search and capability labels

- Re-read index.md settings/search/function-panel markup and RU/EN copy.
- Confirmed standard vs expanded web search is distinct from execution budget; offline disables web tools but does not claim cloud inference is local.
- Confirmed agent mode is described as a four-stage sequential workflow on one selected model; the 1–50 team configuration is explicitly a saved blueprint, not independent agents.
- Confirmed the connector panel reports no external integrations connected and has no placeholder switches.
- Confirmed Tavily remains optional with a pending decision note; global user system prompt defaults to empty and legacy default text is normalized to empty.
- No source-level contradiction found in the inspected surfaces. Tavily/keyless-search decision and provider/runtime error tests remain open. This was a source review only, not browser/live-provider verification.
- Updated LANDING_UI_V2_IMPLEMENTATION_RU.md. Exact-head workflow/status queries remain empty; no test pass is claimed.


### 2026-11-01 — PR #131: P0 verification source inventory

- Inspected current branch workflow definitions: Quality Sentinels triggers on every PR and includes integrity/security/context, Jekyll, Chromium E2E, published-site smoke and static analysis; Gateway Tests triggers on PRs touching gateway/** and includes compileall, manifest/INTEL checks, pytest, deploy preflight and offline eval.
- Source inventory: 90 Playwright declarations in tests/e2e/app.spec.mjs, 8 in tests/e2e/landing.spec.mjs, 36 pytest test functions in gateway/tests/test_app.py.
- Confirmed gateway/app.py contains no graph-memory HTTP route/flag references. Tests include health-probe secret checks, invalid Bearer token non-echo and upstream error-body redaction.
- Current branch head before this log entry: 6a597ded2f872669c70654c9a9db1b65429c8147. Exact-head workflow-run and combined-status queries returned zero entries. Workflow YAML indicates PR triggers are configured; no run result is visible, so no test pass is claimed.
- Execution blocker: this session can inspect/update repository files but cannot dispatch Actions and cannot clone from GitHub due unavailable outbound network. The next concrete step is to obtain real Gateway/Quality runs through the normal PR workflow. Do not substitute source inspection for execution.


### 2026-11-01 — PR #131: Gateway verification evidence recovered

- Queried the raw GitHub Actions run collection after the convenience workflow lookup returned an empty list.
- Found Gateway Tests run #640 (ID 41280622385) on commit 6f7fde485b2b13aecc50523b20785e0ac615d2ad. All steps succeeded: dependency install, compileall, manifest/INTEL checks, pytest gateway/tests, deploy preflight and six-layer offline evaluation.
- Compared that tested commit to current PR HEAD 579666d45964f56a4e68e3997293a288d7fd1553: the intervening 57 commits change docs, index.md and Playwright tests only; there are no gateway/** changes. Gateway code and tests therefore match the successfully tested state.
- This closes the Gateway contract/security test gate for the current source. It does not close the latest UI/Chromium/Quality gate. The current exact HEAD has a successful License/Artifact Provenance push run; no current-head Quality/Chromium run is visible.
- Corrected the P0 status in V1_UI_FINALIZATION_RU.md, LANDING_UX_POLISH_BACKLOG_RU.md, LANDING_UI_V2_IMPLEMENTATION_RU.md, ORIENTER.md and PROJECT_STATE.yaml. No merge/deployment performed.


### 2026-11-01 — PR #131: record main-branch divergence without syncing or merging

- Live compare: `main` is `0a1f764f295f92e49e347cdc972f8c6c9a07e4c1`; PR branch is 188 ahead / 4 behind; merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`. GitHub reports `mergeable=false`.
- The four main-side commits since the merge base change only `docs/V1_UI_FINALIZATION_RU.md`. Compared main and PR copies: the PR version contains the current main additions plus the V2 reconciliation; no other main-side source delta was found.
- No branch synchronization, PR merge or deployment was performed. Keep the reported mergeability issue as a separate pre-merge gate and re-check after the remaining P0/P1 work.


### 2026-11-01 — PR #131: P0 browser workflow and branch-divergence audit

- Inspected `.github/workflows/quality-sentinels.yml`, `playwright.config.mjs` and `tests/e2e/landing.spec.mjs`.
- Confirmed PR Quality's Chromium command runs the Jekyll-built branch locally; with no `LIVE_SITE_URL`, the Playwright config serves `_site` on localhost, so the 8 landing tests are included in PR browser E2E. The separate published-site smoke checks the currently deployed site, not the V2 branch.
- Gateway run #640 is a verified pass; no Gateway files changed since the tested commit. Gateway P0 sub-gate is closed; browser/Quality P0 remains open.
- Current PR #131 is 197 ahead / 4 behind main, merge base `e78a73b25725bfa63370d9946887cbbacbf51b82`, GitHub mergeable=false. The four main-side commits touch only the canonical UI checklist; the PR branch contains the substantive new requirement lines but changes the section structure. No blind branch sync/rebase/merge.
- Exact-head Quality/Chromium status remains unavailable from the current Actions lookup. Workflow config alone is not evidence of a run or pass.
- Updated implementation ledger. Next: obtain and inspect an actual Quality Sentinels browser job on the PR head; then fix only confirmed failures.


### 2026-11-01 — PR #131: diagnose and repair Quality Sentinel drift

- Inspected owner-dispatched Quality Sentinels run #41285658893 on SHA `d822cb623b2a72642921654a04e6c9d988091834`.
- Security, Jekyll build and independent static analysis passed. Context and Integrity failed because the sentinel script still expected renamed UI IDs, the removed server-memory graph bridge, the former project-memory toggle, and outdated memory-context wording. Chromium was still running at the last status check.
- Updated `scripts/quality-agents.mjs` in commits `1b30cae806469fa5ef1cf8325a41094c54d042a2`, `5d01a7da02207665ce480a68eba99ce7efbc08a9` and `d94d842608c07aa8def4b5fdc89ed95b80524034`. The checks now assert the real project-scope selector, explicit local-memory opt-in, shared-memory scope gate and current prompt wording; ensure the retired graph API stays absent; and reflect the external-only provider picker plus separate first-party aLandi card. No product guard or application behavior was relaxed.
- Source-level cross-check: all literal sentinel `includes(...)` expectations now match the branch `index.md`; all required current UI IDs are present. This does not substitute for executing the workflow.
- Exact-head rerun remains pending. PR #131 stays open/unmerged; no merge or deployment.
- Next: rerun Quality Sentinels on the current PR head, inspect Chromium and all sentinels, then proceed to native iPhone/VoiceOver, screenshots and measured WCAG review.

### 2026-11-01 — PR #131: Chromium timeout diagnosis and CI runtime correction

- Inspected Quality run #41287868283 on exact SHA `b6a3db77fb9bbf8375f8b9d9010365a0e9010158`. Jekyll, Security, Static Analysis, Context and Integrity passed. Chromium was cancelled at the configured 15-minute job timeout; Playwright had started 118 tests but did not emit its final report. The progress stream shows failures/timeouts, but the interrupted log does not preserve their names.
- Root cause of the incomplete run: 118 tests were serialized (`fullyParallel: false`, one CI worker) under a 15-minute job limit.
- Updated Playwright to run isolated tests fully parallel with three CI workers and both GitHub/list reporters; increased Chromium job timeout to 20 minutes; diagnostics upload now runs after cancellation as well. No app behavior or assertions were weakened.
- Commits: `6bba3e8ef49102e2b45464fb1b63595afb682a5a` (job timeout), `d0d38d840470e690aebf2c6a322d0518f54dd6a4` (parallel Playwright), `14d9dc9789dfc958d99685d36a7649ada8ce5120` (diagnostics).
- Exact-head rerun on `14d9dc9789dfc958d99685d36a7649ada8ce5120` is still required; the previous Chromium result is CANCELLED, not PASS. Gateway run #640 remains valid for unchanged gateway source. PR #131 remains open/unmerged; no merge or deployment.

### 2026-11-01 — PR #131: shared navigation touch targets (8.10)

- Source audit found undersized 30–36px controls in chat-row action menus, language-menu options and settings header actions; project disclosures, toolbar summaries and memory actions also lacked a shared touch minimum.
- Added a final CSS normalization using the existing `--ui-control-touch` token (44px), preserving the controls and their actions.
- Extended the mobile Playwright regression to create a chat and measure the chat-row menu target, then open the language menu and measure an option. Existing sidebar/settings/project modal checks remain.
- Commits: `6e75dbf368b71ccd1660873d5cd0f9870cf58119`, `441d5da57b80399228c0a520d7a867ae3fc5371b`, `2d25b12f100b246a929fc6921dfb44971f7d50e3`. Test execution remains pending; 8.10 is not marked complete until exact-head Chromium passes.

### 2026-11-01 — PR #131: Chromium #1125 diagnosis and corrective batch

- User-dispatched Quality run #1125 (`41289724442`) completed on exact SHA `e0e0f80e678e6b418690ba9f33b808a29fe22fef`. Jekyll, Security, Static Analysis, Context and Integrity passed. Chromium finished in 11 minutes with 78 passed, 38 failed and 2 flaky; browser diagnostics uploaded as artifact ID `13077550536`. Published-site smoke steps were skipped because local Chromium failed.
- Root cause groups include stale selectors for retired `#legacyProviderSettings`, Research Studio's moved entry point, and hidden native language controls; tests also counted the provider connectivity probe as a user request. Corrected these E2E contracts and fixtures without removing app assertions.
- Source fixes: narrow-screen clock remains 54px instead of collapsing to 42px; message-viewer speech action is now hidden for user messages despite `.message-actions` layout styling. Additional test corrections cover default-open Cloud settings, project/personal chat navigation, connectivity probe handling in status and web-search tests, and ticker locator strictness.
- CI changed to two workers and a 25-minute Chromium job timeout to reduce browser resource contention while retaining the complete suite and diagnostics. Changes are recorded in the implementation ledger.
- Current code/test head after corrections: `b42797ca0e09576519bc82710f993a0d4a4823bb`. No Quality run has verified this head yet. Remaining areas to verify include contrast state, settings disclosure transitions, project/chat handoff, provider fallback/401, message viewer and 44px touch targets.
- PR #131 remains open/unmerged; GitHub reports `mergeable_state=dirty`, which must be investigated before merge. No merge or deployment performed.

### 2026-11-01 — PR #131: compact separate theme/language controls (8.11)

- Replaced the combined theme+language dropdown summary with two separate adjacent header controls: icon-only theme toggle and language selector. Both use the existing `.header-icon` style and have matching 44px hit areas; the language menu contains only language options.
- `updateHomeThemeButton()` now updates the theme icon, localized accessible label/title and `aria-pressed`; language selector displays `RU`/`EN` and retains the existing menu behavior.
- Updated the shared theme helper and added a 320px E2E test for equal control geometry, accessible names, no horizontal overflow, theme toggling and language selection.
- Commits: `9433ccad9767bf3b648c1d5d7c293fc283740447`, `6b7236ea1c0a7ce092073a0fbbd870a9b88cb1a7`, `669b808e23775b116f9e7ac6261b5a1431effcf1`, `652c3b47858c34c184146c03ec6044b103703cdb`.
- Latest code/test head: `652c3b47858c34c184146c03ec6044b103703cdb`; the last Quality run #1125 predates these corrections. Exact-head rerun remains required; 8.11 is not marked complete until Chromium passes.


### 2026-11-01 — PR #131: Chromium #1126 diagnosis and corrective batch

- User-dispatched Quality run #1126 (`41291438804`) checked exact SHA `7cdf35d581d9d6bca39256e67a0b0db6083e486c`. Jekyll, Security, Static Analysis, Context and Integrity passed; Chromium failed after 101 passed and 18 failed. Diagnostics artifact ID `13077583320`; published-site smoke was skipped.
- Root cause confirmed in three local-gateway test files: they still selected aLandi from the third-party provider list, while the live UI configures it in the Cloud card. Fixtures now set Cloud URL/model/key, answer the exact model probe and provide `/healthz` success. PDF and audio tests retain their original user-path assertions.
- Other verified corrections: narrow header compression at 320px, disabled text high-contrast specificity, Research Studio close/history handling, visible-label checkbox interaction, project/sidebar state assumptions, collapsed private-memory disclosure, duplicate modal close selector and stale settings close after language selection.
- Commits: `53c384a`, `54e90c3`, `a793f5d`, `8302b8f`, `ecc5118`, `c9c1df9`, `929ebcf`, `6845b8a`, `e64cfad`. Latest code/test head: `929ebcf20db87eca949c6f5a386c16e75f2856a1`. All changes remain unverified by a subsequent Quality run; do not infer a pass.
- PR #131 remains open/unmerged and undeployed. Mergeability/dirty state is a separate blocker; native mobile and measured WCAG checks remain manual gates.


### 2026-11-01 — PR #131: integrated UI pass + Chromium reliability research

- Owner direction: finish the coherent UI backlog 8.1–8.17 first, and fold in still-open pre-8 UI work rather than starting another fragmented test-fix loop.
- Added an inherited-work map to docs/V1_UI_FINALIZATION_RU.md and docs/LANDING_UI_V2_IMPLEMENTATION_RU.md: overall visual polish; mobile composer/VisualViewport; provider route migration; inline validation/redaction; global prompt edit affordance; provider privacy/docs; Tavily key/fallback; gateway status races; modal/focus/scroll; secondary controls; RU/EN + light/dark; model catalog, project, research, skills and agents truthfulness.
- Source: Cloud field validation now covers missing URL/model/key and invalid remote HTTP URL in RU/EN; field errors are connected with aria-invalid/aria-describedby; Cloud labels, paste action, connection button and system-prompt placeholder localize.
- Source: asynchronous Cloud health refresh re-checks URL/model/key after fingerprint and network completion so stale /healthz results cannot restore connected state after a field changes. Added deterministic race E2E with a held health response.
- Source: system-prompt edit action now localizes accessible name/title/live hint; added keyboard-focus/edit/read-only E2E.
- Source: mobile VisualViewport resize now preserves scroll position when reading older messages and keeps the latest message anchored only when the user was already near the bottom. Added a responsive scroll-preservation E2E.
- Chromium research (official Playwright docs + upstream issues): CI guide recommends one worker for constrained hosted runners; web-first assertions/user-facing locators and test isolation are preferred; trace on first retry is recommended; retries diagnose flakiness, not mask it. Public reports #41562 (Chromium 149 + active MPA View Transitions causing click stability hangs) and #38489 (reported Playwright 1.57 Chrome-for-Testing memory spikes under parallel runs) are cautionary examples, not proven causes for aLandi. Kept Playwright 1.56.1 pinned to avoid changing the browser runtime during UI stabilization.
- CI changed: one Chromium worker; Playwright global timeout 30 minutes; Actions job timeout 35 minutes; trace on first retry; screenshots only on failure; video disabled. This should reduce resource contention and let Playwright finish reporters/artifact cleanup before the job limit. Exact-head CI not run yet.
- Commits in this pass: 6728797, 9d3cab6, f374798, 2194b0a, ea62903, ed8b255, 35b7ea1, db61b95, e7db377, 539b1a7, 847f1bee; documentation commits include 76e3336, 787e395, 624554c.
- Syntax checks run through GitHub-fetched source: inline index.md JavaScript and changed E2E modules parsed successfully before the final stale-health test was added; final syntax pass remains to be done. No Chromium or manual-device pass is claimed.
- Next: finish remaining UI coherence/source audit, then run focused/full Chromium on exact current HEAD 847f1bee5ab7c12d960195891dac5a2e5af7201d; native iPhone Safari, VoiceOver and measured WCAG ratios remain manual. PR stays open/unmerged/undeployed.


### 2026-11-01 — PR #131: theme-aware status colors and final source syntax pass

- Added theme-specific info/warning color tokens: dark and light themes now use separate readable warning colors; Cloud checking status consumes the semantic token instead of hard-coded amber.
- Extended the readability regression to confirm Cloud checking color changes between dark and light themes.
- Re-ran source syntax parsing against GitHub-fetched current source: index.md inline JavaScript, app.spec.mjs, audio-transcription.spec.mjs, document-attachments.spec.mjs, alandi-provider.spec.mjs, research-studio.spec.mjs and playwright.config.mjs all parsed successfully. This is a syntax check only; no browser execution.
- Current code/test head: bca8fa892e95bd35db812382afdadbba41813265. Latest docs checkpoints: V1 checklist b1afbf0e3420b27c19fc7ee2447dd838204908fa; compact backlog dc785967bc8d07877d9697f588f5a589404a7706; implementation ledger 8da576774c8cf948aa403111e34461396999e57d. Exact-head Quality remains intentionally pending until the integrated UI pass is complete.


### 2026-11-01 — PR #131: token-level contrast calculation

- Added a deterministic E2E contrast calculator for actual CSS custom-property values against each theme's solid surface. Primary, secondary, disabled, info, success, warning and error tokens are checked in both dark and light themes at the 4.5:1 threshold.
- Calculated current base token ratios: dark surface #0f1b2b — primary 15.93:1, secondary 8.26:1, success 9.02:1, warning 10.92:1, error 6.59:1; light surface #ffffff — primary 15.48:1, secondary 5.91:1, success 4.90:1, warning 6.59:1, error 5.26:1. Disabled/info tokens are included in E2E. These are token-vs-surface measurements only, not the full WCAG audit.
- Added default light/dark semantic info/warning tokens and changed Cloud checking text to use the theme-aware warning token.
- Current code/test head: 95b50bc699a1eb2c98a677829cc228e4b60b7b5b. Syntax parsing passed for index.md inline JS, app.spec.mjs and playwright.config.mjs. Browser tests and actual component-level WCAG review remain unrun.


### 2026-11-01 — PR #131: inherited checklist made explicit

- Clarified that the original pre-8 section contains 18 control directions, not only seven headings. Expanded the matrix in docs/V1_UI_FINALIZATION_RU.md to list all 18, preserve their original [x]/[~] status, summarize remaining acceptance and map each into 8.1–8.17 or release gates.
- Confirmed the workstreams already taken into the current code pass: #2 mobile composer/VisualViewport, #3 provider-route localization, #4 field validation/accessibility, #5 prompt edit/focus, #8 gateway stale-response handling, #10 chat scroll preservation, #12 theme-aware status color, and #18 release/Chromium reliability strategy. Other inherited items remain explicitly mapped rather than silently marked complete.
- Latest code/test head remains 95b50bc699a1eb2c98a677829cc228e4b60b7b5b; latest UI checklist doc commit 162ee62b8ff2e34e20ca161bf66dc37f761b15ad; implementation ledger 8b0639f10c7b0f2e154039c961ac850e5cff79ea. Exact-head browser verification intentionally deferred until the integrated UI pass is complete.


### 2026-11-01 — PR #131: remove forced interaction from mobile touch-target test

- Audited all active E2E specs for fixed sleeps, networkidle waits and forced clicks. Found one forced click in the mobile touch-target test.
- Root cause: the test created a new chat, and the product correctly closed the sidebar. The test then force-clicked the now-hidden close button. Corrected the sequence to assert the sidebar closes after New Chat, reopen it, and use an ordinary click to close it.
- Current audited E2E set has zero force:true, waitForTimeout and networkidle usages. This is a test-contract correction, not an application bug.
- Current code/test head: 2231691fab0a56a39ce6e1edb571fee6d131607b. Syntax parse after this test edit remains pending; no Chromium execution claimed.


### 2026-11-01 — PR #131: complete E2E source hygiene/syntax audit

- Enumerated all 11 files in tests/e2e and parsed each module from the current branch source; all 11 passed JavaScript syntax parsing.
- Across all 11 E2E files, found zero force:true clicks, zero waitForTimeout sleeps and zero networkidle waits.
- Also parsed index.md inline JavaScript and playwright.config.mjs successfully. This is source/syntax validation only; Playwright itself has not run on current HEAD.


### 2026-11-01 — aServi terminology pass
- Updated primary self-hosted route UI/action naming to aLandi aServi; renamed handler/action identifiers and aligned Playwright + Quality Sentinels expectations.
- Preserved legacy localStorage keys `ai_alandi_cloud_*` to avoid breaking configured installations. These are internal compatibility keys, not visible naming.
- `aLandi aCloudi` is reserved for a possible future information-storage product; no storage feature is implied or created.
- Chromium/Quality verification of the new exact head is pending.


### 2026-11-01 — PR #131: runtime source-of-truth audit

- Confirmed the active source split: index.md contains the Jekyll app shell/markup/CSS and loads assets/js/app.js; runtime logic is in assets/js/app.js after refactor commit 9e5cf6465c8be4908ada83f1806bcd82a8907149. Actual server controls use aserviBaseUrl/aserviModel/aserviApiKey/connect-aservi/aserviStatus; legacy cloudBaseUrl selectors must not be introduced.
- Localized the in-flight aServi connect button and stale-settings status message in assets/js/app.js. Existing RU/EN field errors, stale health guard, prompt edit labels and mobile viewport scroll preservation were confirmed in the active runtime source.
- Correction to earlier syntax note: index.md has no inline application script, so the meaningful JavaScript parse target is assets/js/app.js. Re-parsed assets/js/app.js, all 11 E2E specs and playwright.config.mjs successfully. All 11 E2E files remain free of force:true, waitForTimeout and networkidle.
- Latest code/test head: 4bd40770fd3446e5280e719644394882c9148dae. No Chromium run yet.


### 2026-11-01 — PR #131: active runtime validation and localized connection state

- Confirmed source architecture from the current branch: index.md is the shell/CSS and assets/js/app.js is the loaded runtime. The active controls are aServi-named; tests correctly use aserviBaseUrl/aserviModel/aserviApiKey/connect-aservi/aserviStatus.
- Updated active runtime code so the aServi connection button uses the selected language while checking and after completion; stale-settings status text is localized in both stale branches.
- Parsed the actual assets/js/app.js and all 11 E2E modules plus playwright.config.mjs after the final changes; all syntax checks passed. No forced clicks, fixed sleeps or networkidle waits in any of the 11 E2E files.
- Current code/test head: 4bd40770fd3446e5280e719644394882c9148dae. No Chromium/browser run is claimed.


| V-2026-11-01-ASERVI-HTML-CSS-001 | 2026-11-01 | Rename primary server route to aLandi aServi; retain legacy storage keys; externalize app/landing CSS; order renderer/sanitizer scripts with defer; align E2E and Quality assertions; document Chromium mobile edge cases | PR #131 code/test checkpoint `6dcd78485eaf6542190265b9a3a3d30491677dd4` (stable aServi storage contract and provider-separation E2E); branch head before documentation refresh `75c029080a889d659cb2e3da8dd6ce6bbe49b61c`; app.js + 11 E2E modules syntax-parse, CSS brace counts balanced; exact-head Quality/Chromium pending | Do not migrate/delete legacy localStorage keys without explicit migration; Cloudflare is not renamed; no merge/deploy |


### 2026-11-01 — PR #131: modal focus containment hardening (8.6 / 8.9)

- Existing modal lifecycle already handled Escape/Back/Forward, body scroll lock, initial focus and per-modal focus return, but Tab containment selected the last entry in a fixed modal list rather than the dialog actually on top.
- Added getTopmostUiModal(), which chooses the visible modal with the highest computed z-index. The Tab handler now filters disabled, hidden, inert, aria-hidden and visibility-hidden descendants; wraps Tab/Shift+Tab; and focuses the dialog itself if it contains no usable controls.
- Added an E2E for both wrap directions and for focus entering the modal from an outside control. Refined the test to consider only rendered focusable elements, not descendants of collapsed disclosures.
- Latest code commit: 5f4d3fb4a9b96eb85ddef98758e2301abea78ae0; latest modal E2E commit: baee92526def09756dd294d28a6675092c5bccf4. Syntax check passed after this change; browser verification remains deferred.


| V-2026-11-01-PR131-DIVERGENCE-001 | 2026-11-01 | Recheck PR #131 against live main after owner documentation updates | Compare reports 415 ahead / 4 behind, merge base `e78a73b`; main-side delta is only `docs/V1_UI_FINALIZATION_RU.md` (210 additions, 6 deletions), overlapping the PR's unified 8.0/8.1–8.17 requirements ledger; no source-code file conflict identified | Do not rebase, merge or discard either version of the shared checklist without explicit owner approval |


### 2026-11-02 — PR #131: app identity metadata and source checkpoint

- Updated `index.md` Jekyll/browser title from the stale `AI Mobile Agent v10.0` to `aLandi — личная AI-среда`; added the app description and changed the color-scheme hint to `dark light` to match the existing selectable themes.
- Updated `_config.yml` site title/description to aLandi. Added deterministic Quality Sentinel and Playwright assertions for title, description and theme metadata.
- Code/test commits: `66e265ff73f90ebdc35a2c5ed67aaa3c618bcc94` (app HTML metadata), `7823b63a8259d42707930268e3b0b2de49cea363` (Jekyll metadata), `111830500aeeee79e3cc74412533210cb3361cba` (Quality contract), `b6b4cd612e288f0ad2c0e23419a562b06b491ef5` (E2E contract).
- Documentation commits: `de8cbc047d7e9b39923e02bb950918358340884c` (8.2 checklist), `749aac0e6566478ad453696409fa3ab6edd6f149` (implementation record), `ec7625c98a36f1d54a190da695391244e5eecdd3` (project state).
- V8 syntax parsing passed for app.js, the E2E module and Quality Sentinel after adapting module-only imports/shebang for the parser. CSS brace balance is zero; exact metadata assertions are present. Playwright/Chromium and the Quality workflow have not been run on this checkpoint.
- PR #131 was 476 ahead / 4 behind main, with four base-side commits touching the shared UI checklist only. No synchronization, merge, deletion or deployment was performed.


### 2026-11-02 — Repository hygiene runbook

- Added docs/REPOSITORY_HYGIENE_RU.md with evidence thresholds for branch/file deletion, PR and docs reconciliation, Actions/dependency review, GitHub security settings and rollback records.
- Grounded the checklist in official GitHub repository best practices, protected branches, CODEOWNERS, security quickstart and PR standardization guidance.
- This is a procedure only. Full branch/file/security-settings cleanup is intentionally deferred until the next major-slice boundary; no deletion or history rewrite was performed.


### 2026-11-02 — PR #131 compare correction

- Rechecked live GitHub compare after the repository-hygiene and documentation commits: PR #131 is 483 commits ahead / 4 behind main; merge base remains e78a73b25725bfa63370d9946887cbbacbf51b82.
- The four main-side commits still affect only docs/V1_UI_FINALIZATION_RU.md, which overlaps the branch's consolidated owner checklist. No code-file conflict was identified; no automatic rebase or merge was performed.
