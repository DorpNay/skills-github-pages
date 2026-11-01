# aLandi Engineering Loop (LOOP.md)

## Principle

Every iteration must reduce a named risk or improve a measured outcome. A model/agent may propose changes, but production state changes only through explicit code review, test/eval gates and rollback planning. No hidden reasoning transcripts are stored; audit artifacts record actions, cited evidence, concise rationale and outcomes.

## State machine

1. **Observe:** find actual code path, live status, relevant test, upstream source and current failure. Mark IMPLEMENTED / VERIFIED LIVE / PROTOTYPE / SPECIFIED / DEFERRED honestly.
2. **Hypothesize:** one hypothesis, baseline, target, confidence/source, alternative solution and reversal cost.
3. **Define gate:** deterministic regression fixture, quality golden set if needed, security edge cases, resource budget and kill criteria.
4. **Implement minimum vertical slice:** one bounded capability, injectable adapters, flags off by default, no broad refactor.
5. **Verify:** compile, unit/contract/security tests, complete CI; benchmark only on the correct hardware and with enough samples.
6. **Review:** inspect diff, dependency/licensing impact, log safety, scope isolation, migration and failure recovery.
7. **Decide:** ACCEPTED, PIVOT, DEFERRED or REJECTED with evidence and merge SHA.
8. **Release:** merge first, deploy separately with runbook, backup and rollback; never imply merge equals deployment.
9. **Learn:** store concise regression test/eval/data/source IDs; any automatic skill/agent change becomes a versioned proposal and runs the full regression suite before approval.

## Budgets and stop conditions

- At most one large architectural variable changes per comparative experiment.
- Bounded tasks: max nodes, timeouts, retries, context bytes, result bytes, active leases and concurrent readers.
- On timeout/cancellation: cancel outstanding read-only work; rollback speculative buffers; never assume a side-effecting operation was undone by cancelling its coroutine.
- On failure: fail closed for tools and OAuth; ordinary chat remains available if the experimental component is disabled.
- If evidence is inconclusive, keep the existing baseline and report UNVERIFIED; do not mark accepted based on intuition.
- Disable experimental feature via its flag, preserve data needed for rollback, revert schema/version changes only through a tested migration.
- Never auto-remove code based only on Vulture, automatically resolve conflicting memories, or grant permissions from prompt text.

## Decision record template

For every new decision add: ID, date, title, status, problem, evidence, decision, alternatives, assumptions, exact affected files, risks, measurable acceptance, kill criteria, rollback command/flag, owner and merge SHA.

## Standard experiment shape

- Day 0: baseline and fixtures recorded.
- Cycle A: implement bounded prototype and failure-path tests.
- Cycle B: compare on identical golden set / hardware and inspect regressions.
- Cycle C: record outcome, decide and either merge or revert.
The cycle may take longer than 72 hours when hardware, credentials or licensed model artifacts are unavailable. Do not compress critical security/legal gates to fit a calendar estimate.
