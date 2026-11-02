# aLandi — Skill Factory и конструктор агентов

**Дата:** 2026-11-02  
**Workstream:** PR #125 Agent Studio 2.0, research-only / Draft / HOLD.

## Цель

Дать пользователю безопасный путь превращать книгу, PDF, веб-страницу, репозиторий, изображение, аудио/видеотранскрипт или собственные заметки в:
1. reusable **Skill** — переносимую процедуру/компетенцию;
2. **Agent blueprint** — конфигурацию агента с ролью, модельной политикой, разрешениями, входами/выходами и бюджетом;
3. **Task template** — конкретный сценарий, который можно запускать повторно.

Это три разных результата. Skill не является агентом и не выдаёт разрешения. Agent blueprint не означает, что независимый runtime уже существует.

## 1. Skill Factory lifecycle

1. **Выбор источников:** файлы, папки, URL, репозитории, пользовательский текст, транскрипты.
2. **Ingestion:** сохранить оригинальную ссылку/файл по явному согласию; зафиксировать hash, MIME, размер, timestamp и source owner.
3. **Extraction:** извлечь текст, структуру, изображения, таблицы, timestamps и ссылки на исходные страницы.
4. **Evidence map:** утверждения/процедуры связать с точными source spans; неизвестное помечать, не домысливать.
5. **Synthesis:** определить область применения, prerequisites, последовательность шагов, decision points, failure modes, expected outputs.
6. **Skill draft:** сформировать стандартный пакет `SKILL.md` + необязательные `references/`, `assets/`, `scripts/` с manifest и provenance.
7. **Validation:** schema, broken links, prompt-injection scan, secrets scan, license review, script inventory, dependency inventory.
8. **Generated evals:** positive/negative tasks, edge cases, expected outputs, refusal/permission boundaries.
9. **Human review:** preview diff, approve/reject/edit; не публиковать автоматически.
10. **Version/promotion:** immutable version, changelog, rollback, compatibility and source lineage.

## 2. Agent Builder lifecycle

`Scenario → Goal → Role/Profession → Skills → Model policy → Tool scopes → Data scope → Budget → Approval policy → Evaluation → Blueprint`

Blueprint включает:
- AgentProfile ID/version, purpose and owner;
- role/profession and task contract;
- referenced Skill IDs + pinned versions;
- model allowlist and fallback rules;
- explicit capabilities and approval requirements;
- chat/project/file scope;
- time/token/tool/output budgets;
- success criteria and eval set;
- audit/retention policy.

Нельзя автоматически расширять разрешения по содержимому Skill или загруженного документа. Каждое tool call проходит независимую policy authorization.

## 3. Входные типы и обработчики

| Вход | Извлечение | Важное ограничение |
|---|---|---|
| PDF/Office | Docling/существующий parser | OCR/model licenses отдельно |
| HTML/URL | clean text + DOM metadata | SSRF/network allowlist |
| Git repository | tree, README, selected files, licenses | не исполнять repo code |
| Image/screenshot | OCR + VLM description + coordinates | сохранять image provenance |
| Audio | ASR transcript + timecodes | consent, sensitive data |
| Video | scene/frame index + ASR + timestamps | не скачивать без прав |
| Book/long text | chapters + citation map | copyright; output transformation, not reproduction |

## 4. Skill package security

- Imported skill is untrusted data.
- Scripts are inert by default; no implicit execution.
- Network access disabled by default; explicit allowlist per task.
- Secrets and personal data excluded from generated package unless owner explicitly selects them.
- Skills never grant filesystem, shell, network, memory or connector scopes.
- Preserve upstream license and attribution; model/data license is independent of repository license.
- Store source hash, upstream URL, commit/version, extraction timestamp, transformation provenance and review record.
- Reject hidden prompt injection, executable payloads, obfuscated commands and unreviewable binaries.

## 5. UI integration

Functions → Skills:
- Import package / source material
- Create from selected sources
- Draft preview
- Evidence and provenance
- Validation and security report
- Generated test cases
- Versions, compare, rollback
- Attach Skill to agent blueprint

Functions → Agents:
- Create from scenario/template
- Configure role and skills
- Model/resource policy
- Permissions and data scope
- Evaluate blueprint
- Save draft / activate only when runtime exists

If no runtime exists, show `1ИÆИT10И` and label the item “Blueprint only”; do not show Start/Run.

## 6. Proposed tasks

- [ ] SF-001 — define versioned SkillManifest and schema aligned with Agent Skills spec.
- [ ] SF-002 — source adapter contract and immutable source provenance.
- [ ] SF-003 — create-from-material pipeline with evidence span preservation.
- [ ] SF-004 — import/export package validator and license inventory.
- [ ] SF-005 — prompt-injection/secrets/malicious-script scanner.
- [ ] SF-006 — generated eval suite and skill quality rubric.
- [ ] SF-007 — human approval, immutable versions and rollback.
- [ ] AB-001 — AgentBlueprint schema separated from SkillManifest.
- [ ] AB-002 — permission intersection and explicit user approvals.
- [ ] AB-003 — UI builder for roles, skills, model policy, data scope and budgets.
- [ ] AB-004 — blueprint dry-run/evaluation with no side effects.
- [ ] AB-005 — promote blueprint only after runtime, isolation and exact-head tests exist.

## 7. External references

- [Agent Skills specification](https://agentskills.io/specification)
- [Docling](https://github.com/docling-project/docling) — MIT code; individual model licenses remain separate.
- [Docling Agent](https://github.com/docling-project/docling-agent) — document-oriented agent patterns.
- [screenshot-to-code](https://github.com/abi/screenshot-to-code) — MIT source; vision provider/model terms are separate.
- [BrowserSkill](https://github.com/Tencent/BrowserSkill) — visible browser task controls.

**Status:** architecture proposal only. No runtime, dependency, model, skill loader or model download is introduced by this document.
