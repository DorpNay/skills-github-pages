# aLandi — правила независимых workstreams и допуска в main

**Дата:** 2026-10-31  
**Цель:** вести крупные будущие направления параллельно улучшению лендинга, не допуская случайного merge экспериментальной архитектуры в текущий продукт.

## 1. Два класса изменений

### A. Текущий продукт — Landing / V1
Единственный поток, который по умолчанию может поставлять изменения в `main`:
- статический browser UI: HTML/CSS/vanilla JavaScript;
- Jekyll + GitHub Pages;
- существующий FastAPI gateway;
- существующие provider/Ollama adapters and contracts;
- SQLite/FTS5 и уже принятые persistence/memory primitives;
- существующие skills, ToolDAG, voice/document adapters и feature flags в пределах их уже согласованного контракта;
- GitHub Actions, Gateway tests, Playwright/Chromium, Jekyll, security/integrity/context, provenance/freshness checks.

Новые runtime frameworks/services/dependencies, hosted SaaS, model backends или новая архитектура не входят в этот scope без отдельного решения владельца. Улучшения должны оставаться внутри текущего стека и иметь измеримую пользу.

### B. Future / Research workstreams
Исследовательские и платформенные направления готовятся параллельно, но не входят в обычный merge queue:
- Agent Studio 2.0 / agent workforce;
- Voice 2.0;
- conversion/document intelligence;
- новые orchestration, media, model serving, memory, sync and integration platforms;
- другие крупные продуктовые capability tracks.

Они могут содержать research, architecture, compatibility prototypes и acceptance plans. До отдельного решения владельца их нельзя автоматически переносить в main.

## 2. Branch / PR naming

Рекомендуемые префиксы:
- `landing/` — только текущий лендинг и исправления внутри accepted stack;
- `research/` — исследование, сравнение, architecture notes, source catalog;
- `future/` — будущая capability implementation, ещё не разрешённая для V1;
- `spike/` — короткий обратимый технический эксперимент;
- `release/` — согласованная подготовка релиза.

Названия PR:
- `[LANDING] ...` — кандидат в обычный main merge после checks/review;
- `[RESEARCH — HOLD] ...` — документы/исследование, merge только как документация после отдельного решения;
- `[FUTURE — DO NOT MERGE] ...` — будущая runtime capability, никогда не включать в main без explicit owner approval;
- `[SPIKE — DISCARD OR PORT] ...` — экспериментальная ветка; не merge целиком.

PR body должен содержать вверху:
`WORKSTREAM: LANDING | RESEARCH | FUTURE | SPIKE`  
`MERGE POLICY: NORMAL REVIEW | HOLD FOR OWNER | EXPLICIT OWNER APPROVAL REQUIRED | NEVER MERGE WHOLE BRANCH`

## 3. Merge guardrails

1. PR из `research/`, `future/` или `spike/` не входит в обычную очередь main и не merge-ится по инерции, даже если CI зелёный и GitHub показывает mergeable.
2. Исследовательский PR можно merge-ить только как документацию, когда владелец отдельно подтвердил именно этот documentation merge. Это не разрешает runtime adoption.
3. Future implementation сначала разбивается на минимальные port-ready slices; каждый slice должен быть отдельным PR от актуального main, без исследовательских/экспериментальных коммитов.
4. Перед интеграцией сверяются current stack, decisions, exact diff, dependency/licensing, security, data migration, rollback, tests and deployment gates.
5. Любой PR, меняющий runtime, dependencies, flags, public endpoints, provider behavior, persisted data or deployment, требует explicit owner approval независимо от label/draft status.
6. Никогда не закрывать исходный research PR/ветку до переноса и проверки нужных решений/артефактов.
7. Все Research/Future/Spike PR по умолчанию target отдельную holding branch `future-workstreams/parking-base-20261031`, а не `main`. Это физически отделяет merge этих PR от текущего продукта. Сам holding branch не должен автоматически сливаться в main; перенос решений выполняется только отдельными approved slices.
8. CI success доказывает только покрытые CI свойства; он не доказывает live VPS, real-device voice, model quality или production readiness.

## 4. Labels / визуальная маркировка

Желаемые GitHub labels (если отсутствуют — создать после проверки существующих):
- `workstream:landing`
- `workstream:research`
- `workstream:future`
- `merge-policy:hold`
- `merge-policy:owner-approval`
- `scope:docs-only`
- `scope:runtime`

Label — дополнительная визуальная подсказка, не enforcement. Основные safeguards — PR title, first-line banner, branch prefix, Draft state and explicit review.

## 5. Landing improvement cadence

- На каждом заходе сначала восстановить current main SHA, открытые PR/issue, последний master registry и согласованный stack.
- Выполнять один bounded landing improvement slice за раз: baseline → hypothesis → smallest patch → regression test → exact-head CI → state/registry update.
- Постоянно искать улучшения в текущем стеке: bundle/asset weight, rendering, interaction latency, accessibility, responsive behavior, SEO/metadata, resilience, browser compatibility, dependency/supply-chain hygiene, test quality, build determinism and privacy.
- Не добавлять новые services/frameworks/models merely because they are fashionable.
- Каждое предложение должно иметь: problem/evidence, expected benefit, compatibility impact, implementation size, test and rollback.
- Не запускать фоновый polling или автоматические внешние расходы без согласованного расписания/лимитов.

## 6. Current known queues

- Landing V1: frozen feature scope; polish and reliability only within selected stack.
- Agent Studio 2.0: PR #125 and PR #128 research lineage; future workstream, do not merge as runtime.
- Voice 2.0: PR #129; research-only baseline.
- PR #125/#128/#129 target `future-workstreams/parking-base-20261031`, not main. The holding branch was created from main SHA `e78a73b25725bfa63370d9946887cbbacbf51b82`.
- Master task registry: PR #127 contains the initial lossless 275-row migration from six historical checklists; duplicate reconciliation is still pending. Do not treat this as closed.

## 7. Governance task ledger

- [x] GOV-001 — define LANDING vs RESEARCH/FUTURE/SPIKE separation.
- [x] GOV-002 — define branch/PR naming and merge policy.
- [~] GOV-003 — apply explicit titles/banners/labels to all existing future/research PRs after reviewing each PR and current labels.
- [ ] GOV-004 — add repository-side merge protection/automation only after checking existing rulesets and obtaining owner approval; labels alone are not a security boundary.
- [ ] GOV-005 — update master registry and orienters when PR #127 is revised/merged.
