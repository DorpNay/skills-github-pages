# Security Policy

## Reporting a vulnerability

Please do not publish exploit details, credentials, tokens, private prompts, or personal data in a public issue or pull request.

1. Prefer GitHub's private vulnerability reporting flow from the repository's **Security** tab, if it is enabled.
2. If private reporting is unavailable, contact the repository owner through the GitHub profile for **DorpNay** and share only the minimum information needed to reproduce and assess the issue.
3. Include the affected branch/commit, component or file, impact, a minimal reproduction, and any suggested mitigation. Redact secrets and user data.

There is no published response-time SLA. The maintainer will assess reports as practical and coordinate disclosure before public details are shared.

## Scope and safe testing

- The default branch and explicitly identified current release are the primary support targets. Experimental, draft, hold, and future-work branches may be incomplete or unsupported.
- Do not test against live VPS services, provider accounts, credentials, or other infrastructure without explicit authorization.
- GitHub Pages is a static client. Never place API keys, Tunnel credentials, private prompts, or server secrets in public source, documentation, fixtures, or workflows.
- A passing CI workflow does not prove that a live gateway, Tunnel, model runtime, or deployment is secure or operational.
