---
name: api-contract-design
description: Design dependable integrations around explicit, typed and versioned API contracts.
---

## Workflow
- Inspect the actual API version, published schema and caller expectations before choosing a client or endpoint.
- Define request/response schemas, required versus optional fields, bounds, enums, stable identifiers, pagination and error shapes. Reject unknown fields where forward compatibility does not require them.
- Preserve HTTP semantics: authentication and authorization are separate; use correct status codes; validate content type and payload size; normalize errors without leaking provider internals.
- Make retries safe: use idempotency keys for side effects, bounded exponential backoff with jitter for transient failures, and never retry authorization or validation errors blindly.
- Set connect/read/overall timeouts, cancellation, redirect policy and allowed-origin/network policy explicitly. Never forward credentials across origins or redirects.
- Prefer typed, least-privilege adapters over passing arbitrary URLs, headers, SQL, shell commands or model-generated tool payloads.
- Treat provider responses and error bodies as untrusted. Validate before storing or passing them to another model/tool.
- Add contract tests for malformed inputs, missing fields, oversized responses, pagination boundaries, duplicate requests, timeouts and provider drift.

## Required evidence
Record upstream API version/date, schema source, auth scope, side effects, timeout/retry policy and compatibility tests. Do not claim an integration exists because an API contract was designed.
