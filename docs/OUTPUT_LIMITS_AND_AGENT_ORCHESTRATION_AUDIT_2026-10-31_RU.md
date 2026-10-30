# aLandi — аудит ограничений генерации, контекста и оркестрации

**Дата:** 2026-10-31  
**Scope:** текущий `main` `e78a73b25725bfa63370d9946887cbbacbf51b82`; frontend `index.md`, Gateway `gateway/app.py`, `gateway/routing.py`, tests and import/export paths.  
**Статус:** code-path audit; runtime не менялся. Значения ниже подтверждены исходниками, но фактические target-host env overrides и Ollama runtime settings требуют отдельной проверки.

## 1. Краткий вывод

**В основном запросе к главной модели не обнаружен фиксированный `max_tokens`, `max_completion_tokens`, output-character cap или stop sequence, добавляемые самим aLandi.** Frontend отправляет `model`, `messages`, `stream:false` и иногда `temperature:0` для локального deterministic path; Gateway пересылает JSON body в Ollama OpenAI-compatible endpoint. Gateway stream path пересылает upstream chunks без обрезки; non-stream path читает и возвращает весь upstream response body.

Но обнаружены другие важные ограничения:

1. Сильно ограничен **tool orchestration**: обычный режим — один вызов инструмента на запуск; Deep — максимум четыре tool rounds, три вызова в раунде и восемь за весь run.
2. Текущий `multiAgentEnabled` — не настоящая параллельная агентная команда: он последовательно вызывает planner → researcher → critic → final через один выбранный provider/model.
3. Gateway по умолчанию допускает **один одновременный Ollama inference request** и при занятости быстро возвращает HTTP 429; это препятствует параллельной генерации локальных workers.
4. История сообщений ограничивается оценочным context budget; старые целые turns могут исключаться из следующего запроса. Это не обрезка текущего ответа, но влияет на полноту контекста.
5. UI не сохраняет/не обрабатывает `finish_reason`: если provider вернул `length`, текст может отображаться как обычный завершённый ответ. Gateway корректно не кладёт такие ответы в cache, но frontend не предупреждает пользователя.
6. Импорт старых чатов имеет silent truncation отдельных сообщений и общего количества сообщений; это отдельный риск сохранности пользовательских данных.

## 2. Подтверждённые значения и их реальное назначение

| Параметр / место | Значение по умолчанию | Что ограничивает | Обрезает финальный ответ? |
|---|---:|---|---|
| Frontend `FALLBACK_CONTEXT_TOKENS` | 16 384 tokens | Только оценку context budget, если не найдено metadata выбранной модели | Нет |
| Gateway `model_context_length_tokens` | 4 096 tokens | Поле `context_length` в endpoint `/v1/models`; в main chat payload не устанавливает `num_ctx` | Нет |
| History output reserve | up to 2 048 tokens (25% context cap) | Вычитает резерв ответа из доступного бюджета старых сообщений | Нет, но влияет на то, сколько старой истории отправляется |
| Deep tool rounds | 4 | Количество циклов model → tool → model | Нет |
| Deep tool calls / round | 3 | Количество исполнений tools в одном цикле | Нет |
| Deep tool calls / run | 8 | Суммарное число tool executions за Deep run | Нет, но может оставить задачу незавершённой |
| Normal tool calls / run | 1 | Суммарное число tool executions в обычном режиме | Нет, но резко ограничивает возможности |
| Tool calls / model response | 8 | Дополнительные tool calls от модели отбрасываются; показывается toast | Нет, ограничивает actions |
| Research evidence | 40 items | Максимум сохраняемых/показываемых source entries | Нет; ограничивает журнал источников |
| Research excerpt | 360 chars | Длина excerpt одного source item в research trace | Нет; ограничивает evidence preview |
| Multimodal history blocks | 9 blocks; text block 30 000 chars | Нормализация content arrays в history | Не текущий текстовый ответ; может терять часть старого multimodal input |
| User images per request | 8 images | Число прикрепляемых image blocks | Нет; ограничивает вход |
| Gateway request body | 8 MiB | Размер входящего HTTP request | Нет |
| Gateway cache response | 1 000 000 bytes | Только максимальный размер response, который можно положить в cache | **Нет**: больший ответ возвращается, просто не кэшируется |
| Gateway upstream read timeout | 300 s | HTTP read inactivity timeout для Ollama | Не token cap, но длительное отсутствие upstream bytes может прервать запрос |
| Gateway inference concurrency | 1 | Число одновременных локальных Ollama requests по умолчанию | Нет, но блокирует параллельные локальные workers |
| Document extraction input | 8 MiB | Размер загружаемого файла | Не модельный ответ |
| Document extraction output | 80 000 chars | Максимум извлечённого текста из документа | Не модельный ответ; ограничивает материал для модели |
| Helper model input | 6 000 chars | Только optional ручной memory helper | Нет |
| Helper Ollama `num_predict` | 512 tokens | Только structured memory-helper JSON route | Не main model; helper намеренно bounded |
| Provider connectivity probes | `max_tokens: 8` | Короткая проверка API-ключа/endpoint | Не обычный чат |
| Local benchmark harness | bounded synthetic request, 160 output tokens | Только benchmark tool | Не обычный чат |

## 3. Что происходит с историей

Frontend ищет `context_length` в model catalog. Если metadata нет, использует `FALLBACK_CONTEXT_TOKENS=16384`. Доступный history budget приблизительно вычисляется так:

- context tokens × 1.25 chars/token;
- минус reserve для ответа (до 2 048 tokens × 1.25);
- минус system prompt;
- минус 400 chars framing overhead.

Это эвристика, а не tokenizer. Для RU/TH, JSON, tool payloads и multimodal messages ошибка может быть заметной.

Затем `buildHistory()` группирует сообщения в turns и идёт от новых к старым. Если следующий старый turn превышает budget, он не добавляется. Самый новый полный turn сохраняется даже если один превышает estimate. Таким образом:
- нет доказательства, что обрезается текущий assistant answer;
- старая история может целиком исчезнуть из prompt без summary;
- 16 384 fallback может не совпадать с фактическим context модели.

**Дополнительное несоответствие:** Gateway по умолчанию рекламирует `context_length=4096` в `/v1/models`, тогда как frontend fallback равен 16 384. Это metadata fallback, не установленное значение фактического Ollama context. Сам Gateway не передаёт `num_ctx` в основной Ollama chat request; `num_ctx=4096` используется в отдельном helper route. Реальный context может задаваться модельным Modelfile/Ollama deployment и должен быть подтверждён на target host.

## 4. Tool orchestration — главное искусственное ограничение возможностей

В `index.md`:

- Fast/normal: `maxToolRounds=1`, `maxToolCallsPerRound=1`, `maxToolCallsPerRun=1`.
- Deep: `maxToolRounds=4`, `maxToolCallsPerRound=3`, `maxToolCallsPerRun=8`.
- Если модель вернула более восьми tool calls в одном response, остальные отбрасываются и показывается сообщение «слишком много инструментов».
- Идентичные tool signatures подавляются, чтобы избежать повторов.

Это ограничивает не длину ответа, а возможность модели продолжить работу через инструменты. Например, сложная задача может потребовать больше восьми проверок/источников/операций.

**Решение:** заменить маленькие hardcoded limits на per-run adaptive budget policy:
- профиль задачи (simple / research / engineering / data / high-risk);
- deadline и пользовательский/системный budget;
- provider quota, worker count и доступная concurrency;
- progress/stall detection и повторные идентичные вызовы;
- tool-specific limits, rate limits, idempotency и side-effect approval;
- пользовательская кнопка Stop/Pause и понятный статус расхода бюджета.

Не делать бесконечный loop. У run остаются абсолютные safety ceilings и kill switch, но обычный Deep Research/Engineering budget должен быть расширяемым и зависеть от задачи, а не от одной цифры 8.

## 5. «Multi-agent» сегодня не означает параллельные субагенты

Функция `runMultiAgentResearch()` организует последовательный workflow:

1. Planner — отдельный model request, план на 3–5 шагов.
2. Researcher — `runAssistant()` в том же выбранном режиме и model/provider route; может вызывать tools.
3. Critic — отдельный model request, анализ черновика.
4. Final — отдельный model request для синтеза.

Этапы выполняются последовательно и используют один выбранный conversation context/model route. Здесь нет пяти independent AgentRuns, worker pool, shared task board, durable task state, параллельных inference calls или независимых credentials.

Это полезный staged workflow, но его нельзя описывать как реализованную multi-agent system. Целевая архитектура вынесена в [DEEP_AGENT_WORKFORCE_RESEARCH_2026-10-31_RU.md](DEEP_AGENT_WORKFORCE_RESEARCH_2026-10-31_RU.md).

## 6. Gateway concurrency и влияние на требование пяти workers

В `gateway/app.py`:
- `max_inflight_requests=1` default;
- создаётся общий `asyncio.Semaphore`;
- main Ollama chat endpoint ждёт semaphore только 50 ms, затем возвращает HTTP 429 + Retry-After 3;
- helper model shares the same semaphore;
- local audio-limited operations also share it to avoid overlapping memory peaks.

Это объясняет, почему текущий local Gateway намеренно защищён от параллельных inference requests. Нельзя просто поменять default на 6: на VPS с 8 GB RAM это может вызвать memory pressure/OOM и деградацию main model.

**Нужна новая модель concurrency:**
- logical AgentRun slots ≥ 5, независимо от model inference slots;
- provider-specific inference pools (remote provider A/B, local Ollama, future vLLM/llama.cpp);
- main interactive lane with priority;
- background worker queue with leases, fair scheduling and backpressure;
- отдельные concurrency controls для tools, parsers and browser workers;
- local Ollama concurrency remains measured and conservative; remote provider workers can run concurrently with main if quota allows.

Не смешивать «пять активных workers» с «пять копий модели в RAM».

## 7. Gateway response path — что не обрезает ответ

- Streaming: `StreamingResponse` передаёт upstream byte chunks и освобождает semaphore после завершения/ошибки.
- Non-streaming: `await upstream.aread()`, затем возвращается весь body.
- `cache_max_response_bytes=1_000_000` используется только как условие cache_put. Если response больше — cache_put пропускается; endpoint всё равно возвращает исходные response bytes.
- `response_is_complete_text()` требует `finish_reason == "stop"` для кэширования. Ответ с `finish_reason == "length"` не кэшируется (есть regression test).
- В `routing.py` exact-template fast path отказывается перехватывать payload, если переданы `max_tokens`, `max_completion_tokens`, `stop`, `reasoning_effort` и другие generation parameters. Это правильно: deterministic shortcut не должен игнорировать пользовательские настройки.
- В обычный main request frontend не добавляет `max_tokens`/stop parameters. `max_tokens:8` встречается в provider probes; `num_predict:512` — только в ручном memory helper.

## 8. Реальные проблемы, требующие исправления

### P0 — сохранить статус завершения генерации

Frontend сейчас не проверяет и не сохраняет `choices[0].finish_reason`. Если provider вернул `length`, UI может показать неполный текст как обычный завершённый ответ.

Нужно:
- сохранить finish_reason и provider completion metadata в message/run;
- отличать `stop`, `length`, `tool_calls`, `content_filter`, provider interruption;
- при `length` пометить ответ как incomplete, не выдавать его за завершённый;
- предлагать продолжение только при подтверждённой provider semantics, передавая continuation context без повторения уже выданного текста;
- не применять универсальное auto-continue к provider-ам, где continuation semantics отличаются;
- regression tests на partial/length/tool_calls/stop.

### P1 — context/history не терять молча

- Убрать единую fallback догадку 16 384 как универсальную для неизвестной модели; использовать provider/model capability registry и проверенные metadata.
- Не путать Gateway advertised metadata 4 096 с фактическим Ollama context.
- Заменить silent dropping старых turns на evidence-preserving compaction: summary с message IDs/source offsets + retrieval к оригиналу; исходная история остаётся в local storage.
- Не обрезать content block тихо; если multimodal input превышает поддерживаемый размер, показать точную причину и предложить нормализацию/разбиение.

### P1 — расширить tool budgets без runaway

- Fast mode остаётся лёгким для простых запросов, но не должен иметь неявный глобальный потолок «один tool call» для задач, где tool use необходим.
- Deep/Research/Engineering получают адаптивные бюджеты и больше раундов/вызовов по policy, deadline, provider quota и progress.
- Переполнение tool calls должно корректно продолжаться следующим bounded batch, а не молча отбрасываться.
- Повторяющиеся вызовы, cycles, no-progress and side effects остаются под защитой.

### P1 — обеспечить пять реальных параллельных workers

- Ввести durable task queue и AgentRun scheduler.
- Не менять локальный semaphore на 6 без измерений.
- Разделить remote/local inference pools и interactive/background priority.
- Добавить test: main request + 5 remote workers active simultaneously; отдельно local backend queue test и target-host resource benchmark.

### P2 — таймауты и импорт истории

- `upstream_timeout_seconds=300` задаёт HTTP read inactivity timeout, а не output-token cap. Проверить медленные модели и долгие pauses; перейти к provider-aware idle timeout + overall run deadline, чтобы не обрывать долгое рассуждение без явного уведомления.
- Chat import ограничивает импортируемый список 10 000 сообщений и каждый импортируемый string content 30 000 chars. Сейчас это может быть silent data truncation. Изменить на fail-with-warning or lossless import; never silently rewrite user archive.
- Research evidence 40 items and 360-char excerpts — это лимит журнала/preview. Хранить полные source metadata/artifacts отдельно; UI может показывать пагинацию.

## 9. Что не нужно делать

- Не добавлять `max_tokens` или `max_completion_tokens` default к обычному model request.
- Не резать assistant answer по длине, числу строк, Markdown blocks или внутреннему UI schema.
- Не завершать reasoning только потому, что закончился внутренний формат response.
- Не удалять all limits: upload size, parser CPU/time, tool permissions, provider rate limit, deadline, cancellation and concurrency safety нужны.
- Не поднимать local inference concurrency без измерений реальной памяти, KV cache, throughput и стабильности.
- Не пытаться читать или сохранять скрытый chain-of-thought. Сохранять нужно task state, краткие рабочие summaries, tool events, evidence, decisions and outputs.

## 10. Рекомендуемый порядок реализации

1. P0 finish_reason propagation + explicit incomplete UI state + provider-specific continuation tests.
2. P1 provider/model capability metadata and context budget reconciliation.
3. P1 durable AgentRun + worker queue + five parallel worker acceptance.
4. P1 adaptive tool budget policy with progress, deadline, idempotency and side-effect gates.
5. P2 lossless history import and evidence artifact storage.
6. P2 provider-aware idle/run deadlines and backend-specific inference pools.
7. Only after tests, review whether any hardcoded tool-round defaults should be raised/removed.

## 11. Primary code references

- [Frontend generation loop](https://github.com/DorpNay/skills-github-pages/blob/main/index.md)
- [Gateway main API and Settings](https://github.com/DorpNay/skills-github-pages/blob/main/gateway/app.py)
- [Deterministic routing guard](https://github.com/DorpNay/skills-github-pages/blob/main/gateway/routing.py)
- [Gateway tests](https://github.com/DorpNay/skills-github-pages/blob/main/gateway/tests/test_app.py)
- [Document extraction tests](https://github.com/DorpNay/skills-github-pages/blob/main/gateway/tests/test_document_extraction.py)
- [Attachment E2E tests](https://github.com/DorpNay/skills-github-pages/blob/main/tests/e2e/document-attachments.spec.mjs)
