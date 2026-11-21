---
name: test-first-delivery
description: Turn coding requests into bounded, reviewable changes with measurable acceptance.
---

## Workflow
- Translate the request into observable acceptance criteria, compatibility constraints and explicit non-goals.
- Add or identify a focused regression before changing behavior. Preserve existing tests and fixtures; never weaken assertions to obtain a pass.
- Make the smallest maintainable patch. Keep API, data and migration compatibility explicit.
- Run the fastest relevant syntax, unit and contract checks first; expand only when risk requires it.
- Verify the exact resulting revision and applicable checks. A written test is not a pass; a build is not proof of deployment.
- Capture actual commands, exit codes, test counts, commit SHA and anything not executed.
- Include a rollback that reverses only this change and preserves user data.
- If an environment or permission is absent, mark execution blocked rather than inventing success.

## Response contract
Summarize changed paths, acceptance status, verification evidence, unresolved risks and rollback. Never report completion without evidence.
