# Optional Infrastructure Upgrade — Oracle ARM 24 GB

Status: documentation only. No cloud instance was created, no account identifiers or credentials are stored here.

## Why this is optional

The baseline remains the 8 GB CPU-only host. An ARM64 instance with more RAM may allow one model plus voice runtime and SQLite memory to coexist, but does not guarantee lower latency, enough CPU throughput or available capacity. More RAM is not the same as a GPU.

Official references:
- OCI Compute: https://www.oracle.com/cloud/compute/
- OCI Free Tier: https://www.oracle.com/cloud/free/
- OCI documentation: https://docs.oracle.com/en-us/iaas/Content/Compute/home.htm

Availability, quota, price, free-tier eligibility, ARM shape capacity and supported image must be rechecked in the account and chosen region before provisioning. Do not treat an example shape as guaranteed.

## Manual checklist

1. Confirm account ownership, MFA, budget alerts, region and current quota.
2. Confirm the exact ARM shape and supported Ubuntu LTS ARM64 image in the console/API.
3. Use a fresh SSH key; never commit its private part or instance metadata.
4. Configure security lists/NSGs to allow SSH only from the operator's trusted IP, and do not expose Ollama port 11434 or gateway port 8000 directly to the public internet.
5. Install OS security updates, a dedicated least-privilege service user, systemd unit, log retention limits and firewall.
6. Install a compatible ARM64 Python, Ollama release and model tag; record exact versions and SHAs/checksums.
7. Copy the gateway via a reviewed release/commit; put the environment file under a root-owned path with permissions 600.
8. Configure Cloudflare Tunnel/Access to reach only the loopback gateway. Keep the Ollama API private.
9. Benchmark model load time, warm/cold latency, peak RSS/PSS, swap, completion failure and concurrent-request limits.
10. Keep the smaller instance available until rollback from the new deployment is tested.

## Rollback

- Stop routing traffic to the upgraded host.
- Return the tunnel/service to the last verified gateway endpoint.
- Preserve required SQLite backup, check DB migrations, and do not delete credentials/artifacts until revocation and retention requirements are satisfied.
- Destroy the instance manually only after logs/required evidence and data export are handled.

No automated OCI provisioning script is included intentionally: it would create billable resources and needs account-specific network/compartment/image IDs and explicit operator confirmation.
