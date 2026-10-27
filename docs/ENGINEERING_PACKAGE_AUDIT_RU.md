# Технический аудит: «Полный инженерный пакет aLandi как автономная self-hosted система»

Дата аудита: 2026-10-27. Основа: предоставленный владельцем полный документ из 4 694 строк, 4 части, включая EXECUTION_PLAN и пофайловое ревью. Этот документ — инженерное решение по предложениям, а не заявление, что все функции уже внедрены или развёрнуты.

## 1. Результат в одном абзаце

Цель документа верна: развивать приватный локальный путь, не раздувать 8-GB deployment, проверять качество и безопасность измерениями, добавлять код только с eval и обратимым путём. Но нельзя переносить все примеры буквально: несколько псевдокодов либо дублируют существующие компоненты, либо создают новые риски. Проект уже содержит exact-response cache, SQLite FTS5 + concept graph retrieval, scoped memory и bounded delta-sync, read-only runtime inventory, SSRF validation primitive, локальные voice/document routes за флагами, deterministic routing, trace/provenance и quality/eval tooling. Поэтому основной прирост — закрыть реальные пробелы этих компонентов, а не установить альтернативный стек.

## 2. Проверенное состояние существующего проекта

| Направление | Что уже есть в коде | Вывод аудита |
|---|---|---|
| Gateway и inference | FastAPI, auth, allowlist моделей, ограничение request body, concurrency=1 по умолчанию, bounded timeout; промпты не сохраняются в логах | Сохранять контракт; не добавлять параллельный gateway/framework |
| Exact-response cache | SQLite cache с TTL, лимитом записей/размера, детерминированным cache key и bypass-политикой | Не копировать второй L2-cache из документа; расширять только при подтверждённом дефекте |
| RAG | SQLite FTS5/BM25 и lexical-concept graph; scope-фильтры в обоих retrieval-путях, page/source provenance, scoped document/chunk IDs, удаление документа и миграция схемы | Реальный дефект: BM25-rank score и вручную заданный concept score принадлежат разным шкалам; внедряется RRF в текущем модуле |
| Память | Отдельные модули manager/schema/conflict/temporal; scoped graph, candidate/confirmed workflow, source provenance; bounded versioned JSON Patch с транзакцией и конфликтом ревизий | Не создавать второй memory lifecycle или неполный delta-sync writer; UI recovery — отдельный этап |
| Runtime resource reporting | kv_budget.py честно представляет inventory /api/ps, а host_metrics.py читает фактический RSS из procfs; авто-unload отсутствует | Не добавлять фиксированную оценку «2 KB на токен» и автоматическое уничтожение процессов |
| SSRF | ssrf_protection.py проверяет HTTPS, allowlist host/port, DNS-результаты и запрещённые адреса; произвольного URL-fetcher в gateway нет | Не подключать защиту ко всем обычным исходящим запросам; в будущем проверять каждый hop и фиксировать IP только внутри реального контролируемого fetcher |
| Client safety | index.md содержит большой inline JS, safeMarkdown использует DOMPurify/Marked и escaped fallback; Pyodide загружается по запросу пользователя; cross-provider fallback уже выключен по умолчанию и имеет UI opt-in | Сначала добавлять конкретные тесты/контроль; не мигрировать настройки массово и не менять UI широкими заменами |
| Voice и документы | Локальные ASR/TTS и извлечение документов имеют ограниченные routes/limits и остаются настроенными/feature-flagged отдельно | CI с mocks не доказывает реальное железо, модели, latency и качество |
| Eval и supply chain | quality sentinels, Playwright/Chromium, six-layer synthetic eval, provenance manifest и лицензия/хэш проверки | Использовать существующие ворота; не выдавать синтетические метрики за benchmark реального VPS |

## 3. Решения по главным предложениям документа

### P0: безопасность и автономность

- **SSRF-защита ко всем внешним запросам — не внедрять в предложенной формулировке.** Gateway использует фиксированные/configured upstreams и не принимает произвольный URL для fetch. Подключать resolver/pinning/redirect-hop validation необходимо только в конкретном будущем URL-fetcher или crawler. При таком внедрении запрещать private/loopback/link-local/reserved IPv4 и IPv6, проверять все DNS-ответы и каждый redirect, не делать второй DNS resolve на connect.
- **Device-bound WebCrypto по fingerprint — отклонить как защиту от XSS.** Неперетаскиваемый CryptoKey в IndexedDB плюс fingerprint экрана/WebGL не означает hardware-bound key и не спасает, когда уже исполненный same-origin script может попросить WebCrypto расшифровать значение. Шифрование ключа тем же клиентом также не отменяет миграционные/восстановительные риски. Приоритетная архитектурная альтернатива — секреты во внешнем для browser trusted gateway или честное session/persistence UX; не выполнять автоматическую destructive migration без recovery/rollback.
- **CSP через Cloudflare Pages _headers — не готово для текущего GitHub Pages deployment.** Заголовки, nonce на каждом HTML response, report endpoint и Trusted Types требуют корректного hosting/build пути; статический inline-script монолит нельзя безопасно починить фиктивным nonce. Возможный отдельный этап: staging/report-only там, где заголовки действительно управляются, затем hash-based CSP для неизменяемого inline script либо извлечение скрипта с регрессионными тестами. SRI применим только к конкретным неизменяемым CDN resources с проверенным digest.
- **Service Worker — использовать только для статических ресурсов, когда подтверждена offline-цель.** Пример из документа кэширует /api и /v1 ответы, что может сохранять приватные/авторизационные данные, повторно выдавать устаревшие ответы и нарушить семантику отмены/ошибки. Нельзя делать SW stale-while-revalidate для chat completions по общему URL; нельзя удалять очередь пользователя после исчерпания retry без явного UI.
- **CRDT/Yjs/WebRTC — отложить, не отвергать навсегда.** Это может помочь будущей настоящей multi-device/collaborative синхронизации, но сейчас добавит P2P-signaling, конфликт-разрешение, дополнительный протокол и требования к E2EE. Сначала определить конкретную UX-задачу и гарантию восстановления.
- **Autonomy Guard на словах analytics/telemetry и AST Python для всех файлов — не копировать.** Это создаст ложные срабатывания и пропуски URL из JS/HTML/config. Расширять текущий security sentinel следует allowlist-ом реальных сетевых поверхностей и тестовыми примерами, отдельно от текстовых упоминаний запрещённых слов.
- **Self-host ассетов — полезно как отдельный этап, но не массовым копированием в первую очередь.** Markdown fallback уже позволяет показать безопасный базовый текст при недоступности Marked/DOMPurify; Pyodide загружается лениво и нужен только при запуске Python-блока. Сначала зафиксировать фактические CDN-запросы и размер каждого бандла, проверить лицензии/хэши и наличие GH Pages base path. Pyodide — особенно крупный offline asset; не добавлять его в каждый page load.

### P1: inference, ranking, memory

- **Quantization/capacity benchmark — принять только как measurement workflow.** Предложенный скрипт с pull моделей автоматически изменяет model cache/ресурсную нагрузку и ссылается на недостающие функции; usage, RSS, token count и perplexity там не измеряются надёжно. Нужны два режима: mock CI (только контракт) и явно запускаемый live benchmark на настроенном хосте; никогда не смешивать их результаты.
- **KV-budget «до 2 KB/token» и автоматический unload — не переносить.** Память KV зависит от модели/слоёв/KV dtype/context и runtime; /api/ps не сообщает per-conversation KV usage. Текущая read-only архитектура честнее и безопаснее.
- **Local speculative decoding на одной модели — отклонить как псевдоалгоритм.** Два последовательных обычных вызова и проверка, что следующий ответ непустой, не являются token-level speculative decoding; это может увеличить latency и изменить ответ без гарантии ускорения.
- **RRF для RAG — внедряется сейчас.** Сейчас BM25 позиция превращается в 1/(rank), а concept graph получает отдельный эвристический score, затем значения суммируются. RRF суммирует только вклад рангов независимых списков и задаёт устойчивый tie-break. Это гипотеза о ранжировании, а не утверждение, что качество уже выросло; acceptance — существующий synthetic Recall@5/citation smoke и дополнительные детерминированные тесты. Реальное качество на коллекции владельца остаётся не измеренным.
- **Context-aware compression — высокоприоритетный следующий пилот, но предложенный код не внедрять буквально.** Сохранять произвольные последние пять сообщений может отрезать tool-call pairing; оценка токенов только по content неверна; дополнительный запрос к той же модели конкурирует за semaphore/latency; summary как role=system опасно повышает недоверенное содержимое до уровня системных инструкций. Правильная версия должна быть выключена по умолчанию, budget-aware, не изменять оригинальную историю, не сжимать system/developer/tool protocol, сохранять завершённые ходы, маркировать summary как недоверенный исторический context и пройти golden/adversarial eval.
- **Delta-sync 409 recovery — принять как задачу клиента, не новый server writer.** Existing store уже атомарно проверяет base revision и не перезаписывает конфликт молча. Восстановление должно сначала показать/сохранить исходную попытку, получить актуальную ревизию, делать только понятный merge по root/path и повторять ограниченное число раз; неизвестные/конфликтующие edits не разрешать автоматическим overwrite.
- **Semantic cache/embeddings/multi-agent validation — отложить до baseline.** Сначала измерить hit rate существующего exact cache и RAG Recall@5/citation accuracy. Не добавлять vector DB, новый worker или agent swarm по общему обещанию выигрыша.

### P2: наблюдаемость, deployment, структура

- **Safe logging/metrics:** trace context и ограничения логирования уже есть. Добавлять фиксированную event schema/Prometheus exports только с конкретными метриками и consumer; никогда не логировать prompt, raw attachment, API key или model output по умолчанию.
- **Unified eval runner:** не дублировать six-layer eval. Сначала объединить форматы/metadata и явно обозначить synthetic/live/hardware status, не превращая mocked RSS/latency в production claims.
- **systemd, health, backup:** существующий gateway unit и runbooks изучить перед добавлением. Не публиковать Ollama port; не ставить MemoryMax, не трогать bind address и не запускать backup scripts без знания реального VPS/путей/пользователя. Backup должен быть проверяемым восстановлением, а не только копией файла.
- **Декомпозиция index.md:** полезна для поддерживаемости, но требует последовательной миграции по одному модулю, проверки Jekyll/relative paths/Security Sentinel и всех Chromium regression tests. Не начинать с большого перевода файла в framework.
- **CSP/SRI, self-hosted assets и offline mode** должны оцениваться через отдельные observable network tests; отсутствие API-key запроса к модели не доказывает «0 внешних запросов вообще».

## 4. Реализация первого этапа

В текущей ветке RAG FTS5/BM25 и concept graph fused посредством Reciprocal Rank Fusion. Scope-фильтры, provenance поля, удаления и схема SQLite не меняются. Параметр rank constant по умолчанию 60; score остаётся исключительно сортировочным score, а не probability/confidence. Добавлены тесты на consensus ranking, duplicate IDs, invalid inputs, deterministic scores и scope/source preservation.

## 5. Очерёдность после этого PR

1. Закончить exact-head Quality, gateway tests, Chromium, provenance и inspect diff; принять RRF только при зелёных воротах и без падения синтетического Recall@5.
2. Разобрать PR #69 (local helper) по актуальным CI; feature остаётся disabled by default и только с ручным сохранением кандидата.
3. Разобрать PR #68 (Graphify workflow) отдельно, когда cancelled Chromium проверка восстановлена; не блокировать продуктовые slices из-за графогенерации.
4. Затем реализовать контекстное сжатие с безопасной ролью summary и eval, либо delta-sync conflict UX — выбирать по доступным точкам интеграции и тестам.
5. Только после этого отдельными PR брать self-host assets/CSP и metrics/deployment; никаких автоматических model pulls или VPS changes без явного owner-configured live run.

## 6. Жёсткие границы

- Ни один пункт в аудите не означает, что он работает на VPS или опубликованном runtime.
- Не подменять настоящие hardware/live-provider результаты синтетикой.
- Не включать experimental flags автоматически.
- Не логировать пользовательские данные и не отправлять приватные данные другому provider без текущего явного opt-in.
- Каждый значимый этап отражать в FILE_ORIENTER_RU.md, PROJECT_STATE.yaml и VOLLEY_LOG.md; сохранять исходную историю и обратимый путь.
