# Технологический аудит aLandi — 21 октября 2026

Ссылки ниже — upstream-кандидаты, а не свидетельство установки. Звёзды не доказывают качество или безопасность.

| Проект | Upstream | Вывод |
|---|---|---|
| OpenMAIC | https://github.com/THU-MAIC/OpenMAIC | AI classroom: учителя/одноклассники, слайды, quizzes и simulations. Требует Node >=22.19, pnpm >=10, PostgreSQL и provider key. Не включать в базовый runtime; позже отдельный режим «обучение». |
| Paperclip | https://github.com/paperclipai/paperclip | Control plane: задачи, роли, permissions, approvals, budgets, training/evals. Заимствовать role/task registry, cost budgets, review gates, skill versions и evals; не ставить полный Node/React server на inference VPS без доказанной нужды. |
| HyperFrames | https://github.com/heygen-com/hyperframes | HTML/CSS/media → deterministic MP4; Node >=22 и FFmpeg; Apache-2.0 заявлен upstream. Полезен для презентаций, титров, графиков и клипов. Сам по себе не генерирует видео-сцены из текста. |
| RuFlo | https://github.com/ruvnet/ruflo | Agent harness/swarm/memory/RAG; MIT заявлен upstream. Заимствовать bounded orchestration и memory/eval ideas, не ставить сотни plugins. |
| Coucou | https://github.com/Louis-CFM/coucou | UI мониторинга coding-agent sessions, approvals, mobile companion, local voice. Код MIT, но name/character/assets имеют отдельные условия. Заимствовать timeline и approval UX, не бренд/ассеты. |
| NVIDIA OpenShell | https://github.com/NVIDIA/OpenShell | Policy-governed isolated agent runtime; Apache-2.0 заявлен upstream. Референс для будущего Coding-Lab; не нужен обычному чату. |
| Impeccable | https://github.com/pbakaus/impeccable | Design skill, commands и anti-pattern checks. Применить inspect-first, screenshots, responsive/accessibility regression; перепроверять лицензию точной версии/ассетов. |
| DBX | https://github.com/t8y2/dbx | Компактный DB client с MCP, AI и SQL safety; Apache-2.0 заявлен upstream. Не runtime-зависимость; взять typed tools, read-only defaults и SQL validation. |
| Grok Register | https://github.com/AaronL725/grok-register | Автоматизация массовой регистрации, proxy pools и credential export. Отклонить: не интегрировать mass account creation, abuse evasion или токен-пулы. Для xAI — официальный API и собственный ключ. |
| Jev Ultrafast | https://github.com/browser-use/jev-ultrafast | Indexed action space: small model выбирает ограниченную операцию/цель, текст генерируется только для TYPE_TEXT. README показывает узкий benchmark, не универсальную гарантию. Взять closed action set, indexed DOM и independent DONE verification; только sandbox. |
| Utopia | https://github.com/deeplethe/utopia | Temporal/bitemporal knowledge graph, provenance, conflicts; Rust + PostgreSQL/pgvector по README. Заимствовать valid-time/record-time и supersedes/conflicts; не поднимать полный стек до доказанной необходимости. |
| FreeDomain | https://github.com/DigitalPlatDev/FreeDomain | Бесплатные домены и DNS-обучение, документация AGPL-3.0. Не AI/runtime. Только необязательный домен; бесплатный домен не считать production-надежным без проверки условий. |
| witr | https://github.com/pranshuparmar/witr | Диагностика происхождения процессов/портов/контейнеров, JSON и exit codes; Apache-2.0 заявлен upstream. Полезно операторам, но не останавливать процессы автоматически. |
| PinchTab | https://github.com/pinchtab/pinchtab | Local browser control plane, indexed element refs, token-efficient snapshots; MIT заявлен upstream. Опциональный Browser-Lab; loopback only, sessions/cookies — секреты. |
| Vert | Не определён однозначно | Имя даёт много несвязанных проектов, включая Vert.x. Не интегрировать без точного URL или владельца. |

## Предыдущие источники — обновлённый отбор

- Harness² — https://github.com/google-research/harness2: hypothesis → probe → compose, verified results; не запускать исследовательскую sandbox на production VPS.
- Everything Claude Code — https://github.com/affaan-m/ECC: selective TDD, review, skills, compaction; не копировать provider-specific harness целиком.
- Agent Skills — https://agentskills.io/specification: progressive disclosure.
- Trail-Code — https://github.com/trailhq/Trail-Code: dev-only codebase map/learnings, не модель.
- Cactus Needle — https://github.com/cactus-compute/needle: benchmark для ограниченного extraction/tool routing; проверить артефакт, лицензию и telemetry.
- RAG-Anything — https://github.com/HKUDS/RAG-Anything: document structure, tables/formulas, page provenance; тяжёлый parser отдельно benchmark.
- CLI-Anything — https://github.com/HKUDS/CLI-Anything: help, JSON, exit codes, dry-run, E2E.
- taste-skill — https://github.com/Leonxlnx/taste-skill: inspect-first, preserve design, responsive/accessibility checks.
- AirLLM — https://github.com/lyogavin/airllm: offload trades memory for I/O; не магическое ускорение CPU.
- Open-Generative-AI — https://github.com/Anil-matcha/Open-Generative-AI: studio/catalog, не одна универсальная локальная модель.
- dsh-our-free-model — https://github.com/ebony-vinyl/dsh-our-free-model: не передавать private prompts/docs неизвестным бесплатным gateway.
- Pliny/L1B3RT4S — https://github.com/elder-plinius/L1B3RT4S: только безопасные negative security fixtures, не системные инструкции.
- Free Programming Books — https://github.com/EbookFoundation/free-programming-books и Developer Roadmap — https://github.com/kamranahmedse/developer-roadmap: учебные каталоги.
- Hono — https://github.com/honojs/hono: не переписывать FastAPI без измеримого выигрыша.
- Every App — https://github.com/every-app/every-app: отдельная app platform, не память/модель.
- Agent-Reach — https://github.com/Panniantong/Agent-Reach: только конкретные adapters с SSRF policy и отдельной авторизацией.
- OpenMAIC и Open-Generative-AI — отдельные продуктовые направления, не обязательные зависимости.

## Лучшие идеи для лёгкого aLandi

1. Paperclip/RuFlo/Harness²: ограниченные роли, task state, budgets, approvals, skill versions и eval-gated learning.
2. Utopia: temporal facts, explicit conflicts and evidence lineage.
3. Jev Ultrafast/PinchTab: small action space вместо больших DOM/screenshot prompts.
4. OpenShell: sandbox/policy/credential mediation для Coding-Lab.
5. HyperFrames: отдельный deterministic video renderer.
6. RAG-Anything: multimodal provenance and citation contract.
7. Coucou: прозрачный timeline/approval UI.
8. witr/CLI-Anything: диагностируемые CLI с JSON и exit codes.

## Граница достоверности

README и сторонние benchmarks не доказывают производительность на нашем сервере. До runtime-зависимости нужны pinned commit, проверка лицензий кода/весов/ассетов, threat model, resource measurement и rollback. Этот аудит не устанавливает сервисы и не подключает личные аккаунты.
