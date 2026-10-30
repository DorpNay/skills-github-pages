# Аудит актуальности стека и версий — 2026-10-31

## Результат

Проведён line-oriented аудит исполняемых исходников, тестов, workflow и деклараций зависимостей на main `e78a73b25725bfa63370d9946887cbbacbf51b82`. Главный клиент `index.md` — 5 228 строк / 448 811 символов. В дереве репозитория обнаружено 98 файлов с кодом и конфигурацией (Python, JavaScript/HTML, shell, YAML, TOML, JSON); дополнительно проверены manifest/state и документация, непосредственно описывающая технологические решения.

Проверялись точные маркеры `v2.0`, `v.2.0`, `2.0.0`, упоминания deprecated/removed/EOL, версии импортируемых библиотек и Actions, schema/runtime version markers, TODO/FIXME, а также текущие upstream release pages. Это аудит версий и явных маркеров устаревания, а не формальная верификация каждой семантической ветви программы или полный security audit.

## 1. Точные совпадения «v2.0»

Найден один реальный version-tag в исполняемом workflow:

- `skills/action-keyphrase-checker@4771c016e1a66082db6bff148136b82689f7bd84 # v2.0.0` в `.github/workflows/3-step.yml`.
- SHA указывает на подписанный/verified upstream commit от 2026-03-23. Сам action уже использует Node 24 и обновлённые npm/GitHub Actions зависимости. Это не floating tag и не устаревший v1 pin; оставлен без изменений.

Другие найденные цифры «2» — версии данных, а не библиотеки/техники:

- `indexedDB.open('AI_Agent_DB_v87', 2)` — версия браузерной схемы IndexedDB.
- `PRAGMA user_version=2` — версия схемы SQLite.
- `schema_version: 2` — версия YAML/JSON контракта.
- `sqlite3.sqlite_version_info >= (3, 42, 0)` — реальный минимальный runtime guard для SQLite FTS5 secure-delete, не «v2.0».

Поиск `v.2.0` не дал совпадений. В основном клиенте `index.md` буквального version marker `v2.0` нет.

## 2. Обновления, внесённые этим PR

| Компонент | Было | Стало | Основание |
|---|---:|---:|---|
| FastAPI | 0.128.2 | 0.162.0 | Upstream release 2026-10-23 |
| Uvicorn | 0.48.0 | 0.54.0 | Upstream release 2026-09-25 |
| pypdf | 6.4.1 | 6.21.4 | Security release 2026-10-28; точечное исключение из 7-day cutoff до 2026-10-29 |
| pytest | 9.0.2 | 9.1.1 | Последняя версия, проходящая общий 7-day cutoff |
| pytest-asyncio | 1.4.0 | 1.4.0 | 1.4.1 опубликован 2026-10-25 и исключён общим 7-day cutoff |
| Playwright | 1.56.1 | 1.64.1 | Текущий npm latest stable |
| graphifyy | 0.9.96 | 0.9.97 | Upstream release 2026-10-27 |

Python CI matrix расширен до 3.12 / 3.13 / 3.14, поскольку проект декларирует `requires-python >=3.12`, а выбранные пакеты публикуют поддержку Python 3.14. Реальная совместимость будет считаться подтверждённой только после прохождения всех трёх matrix legs.

**Сохранён supply-chain cutoff:** общий `exclude-newer = "7 days"` остаётся включён. Единственное узкое исключение — `pypdf` до `2026-10-29T00:00:00Z`: PyPI upload 6.21.4 датирован 2026-10-28, а changelog 6.21.3/6.21.4 содержит защитные исправления PDF parsing (ограничение xref/page attributes, проверка EOF и исправление loop detection). Это пользовательский document-parser, поэтому security fix имеет приоритет над ожиданием полного семидневного окна. Исключение ограничено одним пакетом и одной датой; остальные зависимости продолжают соблюдать cutoff.

**Важная причина обновить pypdf:** Graphify 0.9.96 поднял собственный upstream floor до pypdf >=6.19.0 в security/dependency refresh; проект удерживал 6.4.1. Обновление до 6.21.4 закрывает version drift и включает последующие parser-hardening fixes. Узкое исключение из общего cutoff документировано выше; PyPI указывает полную provenance для релиза 6.21.4.

## 3. Версии, которые оставлены

Оставлены, поскольку на дату аудита текущая стабильная версия совпадает с pin либо новая версия является только prerelease:

- HTTPX 0.28.1 — последняя stable; HTTPX 1.0.dev* — prerelease, не production replacement.
- pytest-asyncio 1.4.0 — оставлен: 1.4.1 опубликован 2026-10-25, поэтому не проходит семидневный cutoff; патч не обходит freshness gate ради номера версии.
- cryptography 50.0.2 — текущий release на PyPI.
- jsonschema 4.26.0 — последний release в upstream release list.
- PyYAML 6.0.3 — текущий upstream release.
- vulture 2.16 — текущий release.
- Ruff 0.17.3, Bandit 1.9.4, Semgrep 1.183.0 — актуальные pins на дату проверки.
- uv 0.13.6 — latest PyPI release на дату PR #124.

GitHub Actions уже закреплены полными commit SHA. Текущие upstream versions проверены: checkout v7.0.1, setup-node v7.1.0, setup-python v7.1.0, upload-artifact v7.0.2. SHA pinning сохраняется; floating tags не добавлялись.

Node 22 остаётся поддерживаемой maintenance-LTS линией на дату аудита. Переводить все workflows на Node 24 только ради номера версии не требуется; пересмотреть до завершения поддержки Node 22 в 2027 году.

## 4. Внешние reusable workflows: сознательно не обновлялись

`skills/exercise-toolkit` в `.github/workflows/0-start-exercise.yml`, `1-step.yml`, `2-step.yml`, `4-step.yml` закреплён на commit `ebf43bb96882683e03e667184c6445ed4c8074e6` (2025-06-25). Upstream main уже на commit `2bed354b84a2633bc05cb5d6c8658bfa47345445`, на 43 commits вперёд.

Это не безопасный blind bump: новые reusable workflows меняют поведение start/finish exercise, используют checkout v6, github-script v9, action-text-variables v4, EndBug add-and-commit v10, переписывают README и .github/steps, а также меняют шаблоны issue/finish. Текущие workflows используют прежние входы и отдельные шаблоны. Нужен отдельный compatibility PR с проверкой end-to-end на тестовом exercise; в этом PR оставлена текущая рабочая immutable pin.

## 5. Проверки и границы доказательств

- GitHub Actions workflow pins: SHA immutable; no unpinned direct Actions introduced.
- Exact v2.0 search: one valid signed v2.0.0 action pin, no floating dependency.
- Explicit deprecated/EOL scan: в основном коде не обнаружено вызовов API с явной пометкой deprecated/removed/EOL. Текстовые упоминания в документации/истории не равны использованию устаревшего API.
- Runtime behavior: этот PR меняет только версии зависимостей, CI matrix и audit documentation; бизнес-логику приложения и runtime feature flags не меняет.
- Acceptance: Gateway tests на Python 3.12/3.13/3.14, Chromium/Pages Quality, Graphify, Provenance и Freshness должны пройти на точном HEAD. До завершения CI обновлённые версии — кандидаты, не production-verified runtime.
- Не проверялись live VPS, установленные там версии Python/SQLite/Ollama, real provider credentials, физические устройства и целевые RAM/latency.

## Upstream release evidence

- FastAPI 0.162.0: https://fastapi.tiangolo.com/release-notes/
- Uvicorn PyPI: https://pypi.org/project/uvicorn/
- pypdf 6.21.4 and security changelog: https://pypi.org/project/pypdf/ and https://pypdf.readthedocs.io/en/stable/meta/CHANGELOG.html
- pytest 9.1.1: https://pypi.org/project/pytest/
- pytest-asyncio 1.4.1 (excluded by the seven-day cutoff): https://pypi.org/project/pytest-asyncio/
- Playwright 1.64.1: https://www.npmjs.com/package/@playwright/test
- Graphify 0.9.97: https://pypi.org/project/graphifyy/
- cryptography 50.0.2: https://pypi.org/project/cryptography/
- jsonschema 4.26.0: https://github.com/python-jsonschema/jsonschema/releases
- PyYAML 6.0.3: https://github.com/yaml/pyyaml/releases
- Ruff 0.17.3: https://pypi.org/project/ruff/
- Bandit 1.9.4: https://pypi.org/project/bandit/
- Semgrep 1.183.0: https://pypi.org/project/semgrep/
- uv 0.13.6: https://pypi.org/project/uv/
- uv per-package freshness policy: https://docs.astral.sh/uv/reference/settings/
