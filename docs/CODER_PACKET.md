# CODER_PACKET.md — имплементационный пакет aLandi

**Редакция:** 22 октября 2026  
**Репозиторий:** https://github.com/DorpNay/skills-github-pages  
**Публичный клиент:** https://dorpnay.github.io/skills-github-pages/  
**Назначение:** единая входная инструкция для инженера/ИИ-агента, включая @Поиск.

> Одобренная архитектура не равна работающему runtime. Всегда различай IMPLEMENTED, PROTOTYPE, VERIFIED LIVE, CONDITIONAL, DEFERRED и BLOCKED. Нельзя заявлять, что голос работает на p95 <400 ms, пока нет измерений на эталонном 8 GB CPU-host с реальным захватом/ASR/TTS.

## 1. Канонические источники

- PROJECT_STATE.yaml — состояние всех архитектурных пластов и статус развертывания.
- EVALS.md — golden sets, метрики, критерии pass/fail.
- DECISIONS.md — решения D-001…D-006 по маршрутам, памяти, RAG, OAuth; дополнять новыми D-VOICE/D-SEC/D-MEM.
- LOOP.md — ограниченный цикл планирования → реализации → eval → review → rollback.
- INTEL.md — первоисточники, лицензии и принятые технические выводы.
- ACCEPTED_IMPROVEMENTS.md — backlog принятых/условных/отложенных изменений.
- LATENCY_CONTRACT.md — раздельные voice latency метрики и gate.
- INFRASTRUCTURE_UPGRADE.md и DOMAIN_SETUP.md — ручные необязательные инструкции без автопровижининга.

Порядок доверия: актуальный исходный код + тесты → успешный CI → live-проверка той же версии → решения/спецификации → upstream documentation → внешние обсуждения → предположение.

## 2. Mission and non-negotiable contracts

1. **Local-first:** voice, ASR/TTS, память, индекс, model inference и trace storage локальны по умолчанию. Никакого скрытого cloud fallback.
2. **Privacy:** transcript, prompt, OAuth token, tool arguments и audio frames не попадают в обычные logs. Трассировка хранит IDs, stage, durations, bounded enum/metrics and outcome codes.
3. **Resource-aware:** один активный heavyweight model/voice engine по умолчанию, bounded queue/context/concurrency, no unbounded task loops.
4. **Eval-driven:** claims о latency, CER/WER, MOS, memory and retrieval quality только из reproducible reports.
5. **License-safe:** лицензии engine, model weights, конкретного TTS voice, phonemizer и training data — разные записи. Artifact без hash/model card = не разрешён к shipping.
6. **Least privilege:** tools имеют typed JSON Schema, read-only/write capability, explicit approval, timeout и audit IDs. Prompt/agent output never grants itself authorization.
7. **Safe rollback:** speculative work не исполняет write tools; rollback cleaning идемпотентен, TTL/exception/barg-in paths покрыты tests.
8. **No fake sandbox:** subprocess.run сам по себе не является sandbox. Реальный CLI runtime требует container/user namespace, filesystem/network restrictions, seccomp/Landlock и tested policy; пока этого нет, gateway не запускает CLI.
9. **No fake citation check:** citation must refer to exact source hash and source offsets. Relevance judge ≠ source-integrity check.
10. **User control:** memory entries have provenance, scope, status, valid-time and recorded-time. Contradictions remain disputed until reviewed; delete has defined scope.

## 3. Current architecture and known status

### Already present before this packet

- Static GitHub Pages/Jekyll client (index.md, CSS/JS, skills/*.txt).
- Authenticated FastAPI/Ollama gateway (gateway/app.py): allowlisted model tags, bounded body, timeout and concurrency, exact-response cache, SSE forwarding.
- Exact-template fast path, runtime model inventory plus best-effort Linux RSS, conversation-scoped versioned JSON Patch, SQLite FTS5 + lexical concept graph, OAuth vault and optional Google PKCE endpoints.
- RAG internal document/chunk IDs are scope-bound and legacy index migration exists.
- All experimental feature flags are off by default. The code is not proof of VPS deployment.

### Added/expanded by this packet branch

- Trace-context middleware (observability/trace_context.py) with valid inbound ID propagation, generated IDs otherwise, response header X-AI-Trace-ID and privacy-filtered event metadata.
- Scoped memory graph (gateway/memory/schema.sql, manager.py, scope.py, temporal.py, conflict.py): provenance required, candidate-first status, bitemporal fields, conflict/supersede edges, scoped recursive delete.
- Voice contracts and policy primitives (gateway/voice/*): Tier0/Tier1 decision, event interface, bounded endpoint heuristic, transactional resource leases, read-only speculation and barge-in decision contract.
- Tool safety foundations (gateway/tools/*, gateway/security/ssrf_protection.py, approval_gates.py): schema validation, bounded DAG, deny-private-IP SSRF policy, action-bound one-time approval tickets.
- Exact citations/evidence (gateway/rag/citations.py, evidence_ledger.py).
- License manifest, voice language matrix, hardware profile, latency contract, and CI checks.

**Not implemented by these interfaces:** native Rust/PyO3/ONNX audio capture/inference, AEC engine, live voice client UI, real Tier0 audio commands, production sandbox/container execution, production OTel exporter, timeline UI, Google Drive Picker/file ingestion, 8 GB hardware benchmark.

## 4. Implementation sequence (ordered to reduce risk)

### Phase 0 — Governance and provenance
Required: PROJECT_STATE, accepted improvements, EVALS, DECISIONS, LOOP, INTEL, CODER_PACKET, latency contract, hardware profile and license manifest. Every item names code, evidence, rollback and truthful status.

Gate: governance files are valid YAML/JSON/Markdown; every shipped model has a verifiable artifact hash and approved license; no TBD artifact is marked ship-enabled.

### Phase 1 — Base gateway and trace context
Maintain current auth, CORS, body caps, cache semantics and bounded concurrency. Add trace IDs at the ASGI boundary. Instrument start/end/error stages without logging request text, headers with bearer values, OAuth callback code or tool arguments.

Gate: invalid external trace IDs are rejected/replaced; response always has an ID; exception paths reset ContextVar; normal tests do not require collector/network.

### Phase 2 — Memory graph and evidence lineage
Use the SQLite graph manager as an opt-in storage module. Start with conversation/project/global scopes strictly isolated. Every fact has source_kind/source_id; source hash is stored when source text is available. Bitemporal fields are distinct: valid_from/valid_until are world-time; recorded_at is system-time. Contradictions create CONTRADICTS and disputed statuses, not automatic rewriting. SUPERSEDES records reviewed correction. Deletion must scope-check recursive derived nodes.

Gate: cross-scope reads/edges/deletes fail closed; conflict changes are recorded; valid-time and recorded-time queries are tested; backup/export/delete behavior documented.

### Phase 3 — RAG and precise citations
Keep current FTS5+lexical graph as baseline. Build Citation objects only from actual extracted source text offsets; compute SHA-256 over normalized source text; store URI/page/section/offset. Evidence ledger only stores scoped evidence and verified quote text.

Gate: source hash or offset mismatch invalidates citation; scope isolation test; Recall@k uses labelled documents; no claim that this is full Microsoft LazyGraphRAG until its staged graph algorithm is actually implemented.

### Phase 4 — Tool schemas, approval and SSRF
Tools are registered by trusted code with JSON Schema and read_only/side-effect metadata. Validate arguments before any work. Reject remote schema refs. For side-effect tools, require a one-time approval bound to action + canonical args + scope + actor. Read-only DAG nodes can run concurrently under a limit; mutations are sequential and time-bounded. Network readers must validate the complete DNS answer set and pin the chosen IP during connect/TLS; URL validation alone is not a complete SSRF defense.

Gate: bad schemas, oversized arguments, missing deps, cycles, forged/replayed approval, action mismatch, private/link-local/mixed DNS answers and timeout paths all tested. The tool DAG is not mounted as a public API and no shell tool exists yet.

### Phase 5 — Voice interfaces and transaction invariants
Build adapters around interfaces, not pretend runtime classes. Native core owns audio capture/frames and ONNX inference. Python control plane consumes bounded metadata events. Tier0 is restricted to harmless, exact commands (stop/cancel/repeat); everything with external effects routes to Tier1 and explicit confirmation if required. Speculative branch may classify and synthesize into a buffer only; audio is played only after compatible final ASR. cPocket owns rollback/TTL and cleanup idempotency. Barge-in detects user speech after self-echo suppression; a policy decision function is not an acoustic echo canceller.

Gate: no speculative write tool attempts, zero unhandled resource leases after failure/TTL/barge-in, and output audio not played before final confirmation. Test fake adapters in CI; use actual model adapters only on target hardware.

### Phase 6 — Native ASR/VAD/TTS benchmark
Start with small Russian Vosk candidate and English streaming Moonshine candidate, subject to recorded artifact hashes and model-level terms. Silero VAD code/model license is MIT upstream; this does not make Silero TTS commercial-use permissive. Piper current OHF engine is GPL-3.0-or-later; individual voice model cards must be inspected and may be restrictive. Do not ship any TTS voice until the exact voice license is cleared.

Native implementation must use ONNX Runtime/PyO3 or an equivalent maintained native boundary; do not pass raw PCM through high-frequency Python callbacks. Thread/process boundaries and GIL claims must be measured, not inferred from a mocked coroutine.

Gate: reference hardware report records exact model SHA256, CPU, RAM/PSS, thread config, warm/cold start, p50/p95, real-time factor, audio drops, RU CER/EN WER and quality notes. No CI target runner means status remains UNVERIFIED.

### Phase 7 — OTel and event timeline
Trace ID is first step; OTel exporter is optional and disabled by default. Export target must be explicitly configured; local collector is preferred. Never ship prompt/transcript, access token, query string, user content or tool arguments to spans. Timeline UI must consume sanitized events, not Python-internal objects or hidden model reasoning.

Gate: no exporter network traffic unless explicitly enabled; trace linkage from client → gateway → inference/ASR/TTS; event retention/budgets and redaction tests.

### Phase 8 — UI and infra integration
Only after backend contracts pass: connect memory viewer, project CRUD/settings, personalization, timeline, voice controls, and Google Picker. The static frontend cannot safely hold OAuth client secrets/refresh tokens. Keep gateway loopback-only behind the configured secure tunnel; no automated cloud creation.

Gate: e2e flows against a test/local backend, browser storage inspection, auth/CORS checks, deletion confirmation and rollback. Cloud profile is optional; never assume advertised free capacity or quotas are available.

## 5. Voice latency contract

The normative definitions and targets live in LATENCY_CONTRACT.md. Do not mix wake-word detection latency, silence endpointing delay, final ASR time, first text token and first audible TTS. A target is not a result. The 8 GB benchmark is a manual/reproducible runner until a labelled self-hosted runner is present.

## 6. Model/license defaults

- Candidate RU ASR: vosk-model-small-ru-0.22 (Vosk model catalogue lists Apache-2.0); exact downloaded artifact hash still required.
- Candidate EN ASR: Moonshine English Tiny Streaming (upstream says streaming and English models default to MIT; still record exact artifact hash).
- VAD: Silero VAD upstream MIT; exact model file still needs provenance/hash.
- TTS: no voice currently cleared for shipping. Current OHF-Voice/piper1-gpl engine is GPL-3.0-or-later and voices have separate MODEL_CARD terms; Silero TTS model repository says non-commercial for most models.
- orjson is not wired as default until benchmark and license/provenance review. Current license expression includes MPL-2.0 and Apache/MIT code; performance claims must be tested on representative payloads.
- uv can speed resolution/install, but the repository must commit a generated, reviewed uv.lock before CI is migrated to uv sync --locked. Do not claim lockfile reproducibility without a lockfile.

Sources are recorded in INTEL.md and infra/license/provenance_manifest.yaml.

## 7. Evaluation and release gates

Run local CI contracts:

~~~bash
python -m pip install -r gateway/requirements-dev.txt
python -m compileall -q gateway
python -m pytest -q gateway/tests
python gateway/evals/run_six_layer_eval.py
python gateway/evals/serialization_benchmark.py --iterations 100
python scripts/check_project_metadata.py
python scripts/check_license_manifest.py
~~~

For every new feature include:
- offline unit/contract/security tests;
- labelled eval set (when claiming quality);
- before/after measurement with exact Git SHA, hardware, dependency/model version and flags;
- false-positive/false-negative and failure-path analysis;
- scope-isolation, cancellation and deletion checks;
- kill criteria and tested rollback.

Do not enable feature flags together during comparative experiments. Start with one bounded feature, gather evidence, write decision, then broaden scope.

## 8. Non-goals for this iteration

No fake Rust backend, no fake ONNX load, no actual microphone access in CI, no model downloads into Git, no auto-provisioning OCI, no guessed DNS/IP allowlists, no arbitrary CLI execution, no remote OTel exporter enabled by default, no automatic deletion of conflicting memory, and no claim of production deployment.

The packet is the contract and roadmap, not proof all components exist. Always update PROJECT_STATE and EVALS after each merge.
