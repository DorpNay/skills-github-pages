# aLandi — NOW / checkpoint для немедленного продолжения

КЛЮЧ ПРОДОЛЖЕНИЯ: oledue (регистр не важен). Когда владелец пишет oledue, не проси повторять контекст и не трать ход на объяснение ориентации. Сразу начни по этой карточке.

## Как подхватить работу
1. Прочитай только NOW.md, строки 1–100.
2. Одним batch проверь live main SHA, open PR/issues и Actions/checks именно для текущего HEAD.
3. Сверь этот checkpoint с live SHA. Если он изменился — используй новые факты и не переноси старый parent.
4. Прочитай только owning section Master Plan, нужные строки INTEL, owning spec и код/тесты текущей задачи. Дополнительный документ открывай, только если он нужен текущему acceptance или HEAD/источник изменился.
5. Не пересказывай владельцу этот файл; сразу продолжай следующий открытый engineering step. Не повторяй закрытые проверки и не задавай вопросов, на которые уже есть ответ в каноне.

Срез: 2026-11-28 · Repo: DorpNay/skills-github-pages · Branch: main
Last verified main before this evidence refresh: a4ca42fce37545b347a18685f66c35a2445deb99
Current tested code parent: fd5309a7ff5e978e2749e255210fc8cd8e3a1b6f
Known functional base: 9ef5177085d6a860537a237299faa23909fe604d
Canon: root AGENTS.md v4.0 · P0–P8: docs/ALANDI_MASTER_PLAN_RU.md · sources/licenses: INTEL.md.

## Важные правила
- Main-first, exact parent + compare-and-swap. Без force-push/rebase/reset.
- Никаких merge/close PR, destructive delete, manual/modified Pages deploy/workflow/settings, DNS/Tunnel/host/firewall/secrets/permissions, paid resources или private-data transfer без отдельного узкого owner approval.
- Pages auto-publish protected; обычный commit может запускать штатный build.
- N₂O/LOOP/старые orienters архивированы. Фиксированные четыре ступени не обязательны; direct chat — default.
- Никакого raw hidden chain-of-thought. Только реальные typed events/status и краткая безопасная сводка.
- SPECIFIED ≠ IMPLEMENTED ≠ VERIFIED. Любое VERIFIED содержит exact SHA + environment.

## Состояние и приоритеты
- P0 blocker: полный Chromium на code SHA fd5309a — 230 passed / 36 failed / 3 flaky (Quality #46113683061). Jekyll, context, integrity, root boot smoke и security jobs прошли; Chromium упал. Сначала разбирать traces, исправлять реальные дефекты и неверные ожидания с доказательством; не ослаблять тесты.
- P0.35.1 mode strip: реализован commit 05b50fc; но E2E mode-selector test падает — проверка не увидела return-signal. Причину установить по trace/lifecycle; функция не VERIFIED.
- P0.35.2 palette: token base Graphite + Tiffany dark / Pearl + Deep Teal light внесён в fd5309a; точный цвет эмблемы не снят, WCAG/все состояния и visual/device acceptance открыты.
- P1 aCodingi — PARTIAL: Coding Projects, dedicated project chat, browser-selected folder handles, diff/approval, recovery metadata/timeline есть. Это не sandbox/shell/agentic full IDE; arbitrary command execution unavailable. Coding Project handoff E2E также timed out в Quality #46113683061.
- aNoteBooki: полезная IndexedDB/source-grounded база есть; Studio expansion заморожен до P0/P1/P5.
- P2 direct chat — OPEN: direct chat является целевым default, но docs/CHAT_SETTINGS_INFORMATION_ARCHITECTURE_RU.md фиксирует риск: new chat may start with web search/tool schemas enabled. Проверить request payload + legacy migration до закрытия.
- P3 — PARTIAL: AgentRun SQLite/WAL, event sequence и migrations есть; Gateway Tests #46078897464 прошли на Python 3.12–3.14 для base 9ef5177. Generated typed client, reconnect/replay UI, approvals, independent production subagents и isolation открыты.
- P4 — PARTIAL: extraction registry есть; pre-upload conversion staging, durable jobs, unified File Library и Artifact lineage UI открыты.
- P5 — PARTIAL: service-worker shell cache и storage diagnostics есть; offline dependency closure, installer, network-denied proof, portable folder scaffold/backup/model relocation открыты.
- P6 — EXPERIMENTAL: Whisper/Piper prototypes; личный voice cloning/profile не реализован. Samples local-only by default.
- P7 — SAFETY GAP: allowCrossProviderFallback всё ещё может маршрутизировать к другому provider при включённой настройке. Требуется same-route bounded retry + per-failure Yes/No до любого alternate POST. Держать cross-provider fallback выключенным.
- P8 — OWNER GATE: Pages commercial/SaaS policy требует отдельного решения; Cloudflare Pages — первый static candidate, Netlify Free — второй. Никаких аккаунтов, billing, DNS/Tunnel/host changes без разрешения. GitHub About description устарел — owner вручную обновляет в GitHub UI.

## 26 требований владельца
Все 26 пунктов сведены в Master Plan §0.6 и разложены по существующим P0–P8; owning details лежат в профильных specs. Это карта полноты, не заявление, что всё реализовано. В INTEL.md уже есть дедуплицированный source sweep; неоднозначные имена остаются unresolved, модели/веса не скачивались.

## GitHub queues и evidence
- Open PRs: #195 (Chromium release gate/provider safety), #187 (provider diagnostics/i18n). Не merge/close без отдельного разрешения.
- Open issue: #111 (free-first release gates).
- Quality: #46113683061 FAILURE на code SHA fd5309a; Chromium 230/36/3.
- Pages: #46120612916 SUCCESS на exact main HEAD a4ca42f; static build/deployment check passed. This does not replace Quality/Chromium.
- Graphify: #46113683020 SUCCESS на code SHA fd5309a.
- Gateway: #46078897464 SUCCESS на functional base 9ef5177, Python 3.12/3.13/3.14; это не проверка VPS/live host.
- PR queues/open issue нужно прочитать заново по live HEAD при следующем oledue.

## Следующий шаг
1. Разобрать Quality #46113683061: сначала selector return signal и Coding Project handoff trace, затем remaining unique Chromium failures по scope/privacy/focus/mobile/settings/Offline Core; сохранить assertions.
2. После реального P0 browser gate завершить палитру/лого/header/sidebar/settings/voice overlay/picker; RU/EN, reduced motion и responsive.
3. P1 + P5: полноценный scoped Coding runtime и installable portable Offline Core.
4. P3 + P4: typed AgentRun client/replay/approval/real subagents; затем pre-upload converter + File Library.
5. P7: убрать широкую сохранённую cross-provider fallback настройку, внедрить bounded same-route retries и отдельный Yes/No before transfer.
6. P6 voice profile; затем P8 owner launch/hosting steps. Notebook остаётся frozen.

## Какие документы читать только по задаче
- P0/UI: Master Plan §0.6 + P0.35; index.md, assets/js/shared-modes.js, tests/e2e/shared-modes.spec.mjs; INTEL только для выбранного UI/motion source.
- P1/Coding: Master Plan P1/P3.10; LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md; AGENT_WORKER_CAPABILITY_AND_SKILL_SAFETY_RU.md; owning workspace code/tests.
- P3/agents: Master Plan P3 + AGENT_SKILL_FACTORY_AND_AGENT_BUILDER_RU.md + AgentRun contract/schema/tests.
- P4/library/conversion: Master Plan P4 + LOCAL_SOURCE_VAULT_AND_MULTIMODAL_CONVERSION_RU.md; INTEL только для выбранного parser/converter.
- P5/offline: Master Plan P5 + INTEL P5 sources + models/runtime-install.md/manifest when package work starts.
- P6/voice: Master Plan P6 + LOCAL_AUDIO_GENERATION_AND_MEDIA_SKILLS_RU.md + VOICE_IMPLEMENTATION_PLAN_RU.md + exact model artifact records.
- P7/providers: Master Plan P7 + PROVIDER_SETUP.md + current provider code/tests; INTEL для policy конкретного provider.
- P8/launch: Master Plan P8.0 + INTEL hosting sources + ALANDI_IMPLEMENTATION_GUIDE_RU.md; owner-only steps remain gated.

## Limits / owner actions
- No live VPS/Ollama/model host, native iOS/Android, owner-device mic/audio, provider signup, DNS/Tunnel or paid resource verification.
- No model weights, private chats/files or voice samples were sent externally/downloaded in this slice.
- GitHub About description обновляет владелец вручную; Project Sources зеркалируются вручную.
