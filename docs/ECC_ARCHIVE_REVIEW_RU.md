# Разбор Everything Claude Code ZIP для aLandi

Проверен приложенный архив everything-claude-code-main.zip. Он содержит 113 записей и 349 126 байт распакованного содержимого. Внутри есть agents, commands, contexts, hooks, MCP-конфиги, rules, scripts, skills и tests. Основные паттерны: TDD, планирование, code/security review, verification loop, eval harness, strategic compaction, session continuity и continuous learning.

Важная оговорка: ZIP не содержит LICENSE-файла, хотя README показывает MIT badge. Пока не сверена лицензия конкретной upstream-версии, не переносим большие фрагменты исходного кода. Это tooling pack под Claude Code и похожие agent harness-ы, а не локальная LLM, база знаний или готовый backend для GitHub Pages. Многие hooks зависят от host-specific событий и путей к transcript-ам.

## Принимаем
- Plan → test → implement → independent review → verify → record only checked lessons.
- Тесты перед исправлением; contract tests и Playwright E2E для критичных путей.
- Security review для auth, tool arguments, web fetch, secrets и рендеринга.
- Контекст compact-ится на границах этапов, а не посреди незавершённой операции.
- Continuous learning предлагает новые правила/skills, но их принятие проходит тесты/ревью.
- Skills загружаются по требованию; количество инструментов и конкурентных задач ограничено.

## Не копируем целиком
Не импортируем Claude-specific hooks/transcript paths, весь каталог skills/MCP, инструкции Synapse/Rust, автосохранение полных диалогов и телеметрию с prompt contents. Не подменяем meaningful tests формальным требованием coverage 80%; не считаем один LLM judge истиной.

Большинство принятых улучшений работает в CI и во время разработки, поэтому не увеличивает стоимость каждого пользовательского вызова. Runtime aLandi остаётся компактным: FastAPI + Ollama, выборочная память, evidence ledger, безопасные инструменты и измеримые результаты.
