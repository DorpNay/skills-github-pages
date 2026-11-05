# Аудит актуальности кода и зависимостей aLandi — 2026-10-31

**Ветка:** `chore/dependency-currency-audit-20261031`  
**База PR:** main `e78a73b25725bfa63370d9946887cbbacbf51b82`  
**Цель:** проверить буквальные ссылки на `v.2.0`, актуальность API/техник, закреплённые версии runtime/dev/CI и найти конкретные места для оптимизации без расширения продуктового стека.

## 1. Объём и метод

Проверены все **97 файлов с кодовыми/конфигурационными расширениями** в текущем дереве main: 71 файл приложения, скриптов и конфигурации плюс 26 тестовых файлов. Отдельно проверен основной `index.md` — **5 228 строк** со встроенным HTML/CSS/JavaScript. Проверены также dependency manifests, workflow pins, provenance manifest и актуальные upstream release notes.

Поиск включал:
- точные варианты `v.2.0`, `v2.0`, version-like pins и старые major/minor API markers;
- Pydantic v1 API (`pydantic.v1`, `.dict()`, `parse_obj`, `@validator`, `@root_validator`), FastAPI lifecycle/deprecated route patterns;
- устаревшие Playwright ожидания (`waitForTimeout`, `networkidle`, `waitForNavigation`, `waitForSelector`);
- TODO/FIXME/NotImplemented и явные deprecated/obsolete markers;
- статические Actions SHA pins, Python/Node runtime, browser runner и scanner versions.

Это исходный аудит и targeted API review, а не формальное доказательство отсутствия всех возможных дефектов. Дополнительная автоматическая проверка проекта выполняется существующими Ruff/Bandit/Semgrep, Gateway, Chromium, Jekyll, provenance и freshness workflows.

## 2. Результат поиска «v.2.0»

- Точного использования техники/API `v.2.0` в приложении не найдено.
- Единственный похожий version marker — комментарий `# v2.0.0` у `skills/action-keyphrase-checker` в `.github/workflows/3-step.yml`. Сам action закреплён неизменяемым commit SHA `4771c016e1a66082db6bff148136b82689f7bd84`; это номер версии стороннего action, а не применение устаревшей техники.
- Числа вроде `2.0` в таймаутах/лимитах не являются version pins.
- Поиск не выявил использования Pydantic v1 API, старых FastAPI lifecycle decorators или перечисленных устаревших Playwright ожиданий.

## 3. Dependency/API currency

| Компонент | Было | Upstream на 2026-10-31 | Решение в этой ветке |
|---|---:|---:|---|
| FastAPI | 0.128.2 | 0.162.0 (23 Oct) | Обновлено до 0.162.0. В gateway нет Form/Body моделей, Pydantic v1, `**extra` parameter kwargs или обхода внутренних `router.routes`; Gateway tests — обязательный gate. |
| Uvicorn | 0.48.0 | 0.54.0 (24 Sep) | Обновлено до 0.54.0. Проверено: gateway не читает `request.client`, service слушает только `127.0.0.1`, один worker. В 0.49 менялась обработка duplicate forwarded headers; live Cloudflare Tunnel/proxy smoke остаётся owner-host gate. |
| pypdf | 6.4.1 | 6.21.4 (28 Oct) | Обновлено до 6.21.2 — последней версии за пределами семидневного cooldown. 6.21.0–6.21.2 добавили security hardening, включая ограничения работы с xref/streams и повторной загрузки PDF. 6.21.3/6.21.4 содержат дополнительные security fixes, но пока попадают в cooldown. |
| pytest | 9.0.2 | 9.2.0 (27 Oct) | Обновлено до 9.1.1 — последнего проверенного выпуска за пределами семидневного cooldown. 9.2.0 повторно оценить после 3 Nov; его новые keyword-only аргументы parametrization не используются позиционно в текущих тестах. |
| pytest-asyncio | 1.4.0 | 1.4.1 (25 Oct) | Оставлено 1.4.0: 1.4.1 пока внутри cooldown и в основном добавляет Python 3.15 support плюс исправление AsyncIterable fixture. Повторно оценить после 1 Nov. |
| Playwright | 1.56.1 | 1.64.1 (14 Oct) | Обновлено до 1.64.1. В тестах используются обычные page/locator/assertion APIs; recorder API не используется. Полный Chromium suite должен подтвердить upgrade. |
| Node.js CI | 22 | 24 LTS | Workflow Node runtime обновлён до 24 во всех quality/provider-smoke jobs. |
| HTTPX | 0.28.1 | 0.28.1 — последняя stable ветка upstream | Оставлено. В upstream обсуждении 18 Sep 2026 maintainer не объявлял срок следующего stable release/1.0. |
| cryptography | 50.0.2 | 50.0.2 (30 Sep) | Оставлено: совпадает с текущим upstream. |
| jsonschema | 4.26.0 | 4.26.0 | Оставлено: совпадает с текущим upstream. |
| PyYAML | 6.0.3 | 6.0.3 | Оставлено: совпадает с текущим upstream; Python 3.14/free-threading support уже добавлена upstream. |
| vulture | 2.16 | 2.16 | Оставлено: совпадает с текущим upstream. |
| uv | 0.13.6 в PR #124 workflow | 0.13.6 (26 Oct) | Уже актуален; workflow lock experiment не требует обновления. |
| Ruff / Semgrep | 0.17.3 / 1.183.0 | 0.17.3 / 1.183.0 | Совпадают с актуальными upstream на дату аудита. |
| Graphify CLI | 0.9.96 | 0.9.97 (27 Oct) | Пока оставить 0.9.96: 0.9.97 младше семи дней и является отдельным research-only инструментом, не runtime. Повторно оценить после 3 Nov. |

### GitHub Actions

Основные actions уже закреплены неизменяемыми commit SHA и соответствуют актуальным upstream release tags:
- checkout v7.0.1;
- setup-python v7.1.0;
- setup-node v7.1.0;
- upload-artifact v7.0.2;
- jekyll-build-pages v1.

Не менять SHA pins на плавающие major tags. Внешний `skills/exercise-toolkit` остаётся закреплён на проверенном commit: обновление может менять поведение workflow и требует отдельного review. Пины не следует обновлять только ради более нового номера.

## 4. Реализованные изменения в этой ветке

1. Обновлены FastAPI 0.128.2 → 0.162.0 и Uvicorn 0.48.0 → 0.54.0 в `pyproject.toml` и `gateway/requirements.txt`.
2. Обновлён pypdf 6.4.1 → 6.21.2 в обоих dependency manifests; provenance manifest синхронизирован с версией 6.21.2.
3. Обновлён pytest 9.0.2 → 9.1.1 в `pyproject.toml` и `gateway/requirements-dev.txt`. Cooldown `exclude-newer = "7 days"` сохранён.
4. Обновлён Playwright 1.56.1 → 1.64.1; Node 22 → 24 во всех трёх workflow-файлах, где задавался Node runtime.
5. Изменён document extraction endpoint: синхронный `extract_local_document()` теперь вызывается через `await asyncio.to_thread(...)`, чтобы PDF/DOCX/XLSX parsing не исполнялся непосредственно на event-loop thread.
6. Добавлен regression test `test_document_parser_runs_outside_event_loop_thread`. Существующие ограничения размера тела, PDF страниц, количества символов и форматов не менялись.

## 5. Дополнительные оптимизации — не внедрять без отдельного измерения

- **PDF parser concurrency:** `asyncio.to_thread` убирает синхронный вызов с event loop, но CPU-bound работа всё ещё потребляет worker thread/GIL. При росте параллельных загрузок измерить очередь и p95; только затем решать, нужен ли отдельный semaphore/worker pool.
- **Playwright browser install:** текущий CI устанавливает браузерные зависимости на каждом запуске. Можно рассмотреть cache только после измерения времени и проверки cache key по точной версии Playwright/OS.
- **FastAPI/Uvicorn:** не добавлять middleware/HTTP2/новые серверные зависимости ради версии. Сначала подтвердить live tunnel behavior и реальную нагрузку.
- **Малые модели/агенты:** не добавлять framework или модель в runtime на основании upstream benchmark. Агентный дизайн и bake-off ведутся отдельно в PR #125.

## 6. Проверка и критерии приёмки

После изменений обязательны:
- Python compile + полный `gateway/tests`;
- deterministic six-layer eval и deployment preflight;
- Ruff gate, Bandit/Semgrep advisory;
- Jekyll build, полный Chromium E2E, published Pages smoke;
- Project State Freshness и License/Artifact Provenance;
- Graphify и Dead Code reports.

На момент создания этого документа обновлённая ветка ещё ожидает exact-head CI. Никакой тест не объявляется успешным до результата workflow на конкретном HEAD. Live VPS/Cloudflare Tunnel/Ollama и native iPhone не проверяются CI и остаются отдельными owner gates.

## 7. Результат review статического анализа

На exact code head `c4aa11be5be7b3d95f132f3a7662ce45cd9dca6e` CI собрал и был вручную просмотрен artifact `independent-static-analysis`:

- Ruff: exit 0, findings отсутствуют.
- Bandit: exit 1 из-за двух B608 medium-severity / low-confidence предупреждений: `gateway/memory/manager.py:271` и `gateway/rag/lazy_graph_rag.py:367`.
- Semgrep: scanner завершился без внутренних ошибок; отчёт содержит те же два SQL raw-query findings плюс два предупреждения: canonical link в `landing/index.html` ошибочно распознан как внешняя subresource без SRI, а строка со статическим HTML-фрагментом `<script>` в `scripts/quality-agents.mjs` — как потенциальный XSS sink.
- SQL review: динамически строятся только фиксированные SQL fragments и число `?` placeholders из ограниченного списка. Все значения пользователя (FTS query, concepts, scope, status, timestamps, limit) передаются отдельными bound parameters в `sqlite3.execute`. Интерполяции пользовательского текста в SQL statement нет. На текущем коде признаков SQL injection не найдено.
- Canonical link не загружает ресурс и не является script/style subresource; SRI к нему неприменим. Script-tag finding относится к строковому assertion в статическом quality harness, а не к HTML insertion или runtime rendering.
- Эти findings оставлены видимыми и advisory; правила не отключались, suppression не добавлялся. При изменении SQL-конструкции повторить review и тесты.

Итог: blocking Ruff gate зелёный; Bandit/Semgrep завершились успешно как report-only scanners, но их четыре ручных disposition сохранены выше. Это не следует трактовать как «нулевые security findings».

## 8. Проверка exact HEAD

- На code head `c4aa11be5be7b3d95f132f3a7662ce45cd9dca6e` все шесть workflow groups завершились success: Gateway Tests, Quality Sentinels (включая Chromium), Project State Freshness, License/Artifact Provenance, Graphify и Dead Code.
- В Quality Sentinels прошли все шесть jobs: Ruff/static analysis gate, Jekyll, Context, Integrity, Security и Real Chromium browser regression.
- Последующий commit с этим уточнением отчёта является documentation-only; его exact-head CI запускается заново. До его завершения успешные результаты относятся к указанному выше code head.

## 9. Upstream references

- [FastAPI release notes](https://fastapi.tiangolo.com/release-notes/)
- [Uvicorn release notes](https://uvicorn.dev/release-notes/)
- [pypdf changelog](https://pypdf.readthedocs.io/en/latest/meta/CHANGELOG.html)
- [pytest 9.1.1 release](https://github.com/pytest-dev/pytest/releases/tag/9.1.1)
- [pytest 9.2.0 release notes](https://docs.pytest.org/en/stable/announce/release-9.2.0.html)
- [pytest-asyncio releases](https://github.com/pytest-dev/pytest-asyncio/releases)
- [Playwright releases](https://github.com/microsoft/playwright/releases)
- [Playwright release notes](https://playwright.dev/docs/release-notes)
- [cryptography changelog](https://cryptography.io/en/stable/changelog/)
- [jsonschema changelog](https://github.com/python-jsonschema/jsonschema/blob/main/CHANGELOG.rst)
- [PyYAML releases](https://github.com/yaml/pyyaml/releases)
- [HTTPX upstream release discussion](https://github.com/encode/httpx/discussions/3792)
- [uv releases](https://github.com/astral-sh/uv/releases)
- [Graphify upstream](https://github.com/Graphify-Labs/graphify)
- [actions/checkout releases](https://github.com/actions/checkout/releases)
- [actions/setup-python releases](https://github.com/actions/setup-python/releases)
- [actions/setup-node releases](https://github.com/actions/setup-node/releases)
- [actions/upload-artifact releases](https://github.com/actions/upload-artifact/releases)
