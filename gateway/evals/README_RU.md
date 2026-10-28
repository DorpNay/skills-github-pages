# Gateway evals: как проверять шесть пластов

Команда из корня репозитория:

```bash
python gateway/evals/run_six_layer_eval.py
```

Скрипт детерминированный, не вызывает real LLM, Google OAuth или внешние сайты. Он печатает JSON с:
- curated intent fixtures и false-shortcut checks;
- JSON Patch bytes/round-trip на append-heavy memory state;
- Recall@5 и p50/p95 на синтетических FTS/concept fixtures;
- тестом отсутствия plaintext tokens в SQLite и one-time PKCE state;
- явной проверкой, что runtime inventory не объявляет host RSS/KV usage измеренными и не выполняет eviction.

**Важное ограничение:** fixture accuracy и синтетический Recall@5 не являются оценкой production качества. Перед изменением feature flags соберите реальный, разрешённый и обезличенный golden set, замерьте точные версии моделей/железа и сравните baseline с вариантом. Не записывайте prompts и секреты в метрики.

CI запускает этот скрипт после gateway unit/contract/security tests. Любое отклонение завершает job с ненулевым кодом.

## Размеченный golden set для RAG

Запуск smoke fixture (2 синтетических запроса, не benchmark):

```bash
python gateway/evals/run_rag_golden_eval.py gateway/evals/fixtures/rag_golden_smoke.json --top-k 3 --output /tmp/rag-report.json
```

Для реальной оценки подготовьте JSON со `schema_version: 1`, документами (`document_id`, HTTPS `source_uri`, `chunks` с `chunk_id` и `content`) и запросами (`id`, `query`, `scope`, `scope_id`, `relevant_chunks` с парами `document_id/chunk_id`). Релевантные chunk IDs должны существовать в том же scope, что и запрос. Ограничения: до 10 MiB, 500 документов, 10 000 chunks и 1 000 запросов.

Отчёт включает Recall@k, MRR, nDCG@k, precision по ожидаемым source URI, полноту source provenance и локальную retrieval latency p50/p95. `--min-recall-at-k 0.8` задаёт необязательный exit gate. Время измеряется только на локальном SQLite retrieval; не включает ingestion, генерацию модели, сеть или UI. Smoke fixture нужен для проверки harness, не для вывода о качестве продукта. Перед заявлением об улучшении сравните baseline и candidate на не менее чем 50 разрешённых, обезличенных и вручную размеченных запросах.
