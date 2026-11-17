---
name: debugging-observability
description: Find root causes through reproducible experiments and privacy-safe diagnostic evidence.
---

## Workflow
- Reproduce the issue on the exact revision and environment; record the smallest failing input, expected behavior and observed behavior.
- Separate symptoms from causes. Trace the request across boundaries using stable correlation IDs, structured events and timestamps; do not infer causality from adjacent log lines.
- Inspect the narrowest relevant logs, metrics, traces, state transitions and dependency versions. Redact tokens, credentials, source contents and personal data before collection or sharing.
- Form one falsifiable hypothesis at a time. Change one variable, compare against a baseline and preserve the original failure as a regression test.
- Check cancellation, retries, concurrency, timeouts, stale caches, partial writes, clock assumptions and race conditions before adding generic retry logic.
- For performance issues, measure cold and warm paths separately; collect p50/p95, peak memory, CPU, database I/O and token usage with a representative workload.
- Prefer explicit error categories and actionable user states over swallowed exceptions or success messages that overwrite earlier failures.
- After repair, rerun the original reproducer, focused regressions and only the broader gates required by risk. Record exact command, exit code, revision and unchecked surfaces.

## Stop conditions
Do not enable verbose secret-bearing logs, disable assertions, broaden production permissions or make an unmeasured optimization merely to hide the symptom.
