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
