# Custom Domain and DNS Setup

Status: checklist only. This repository has not registered a domain or changed DNS records.

## Keep two hostnames conceptually separate

1. **Public static client:** current GitHub Pages URL https://dorpnay.github.io/skills-github-pages/
2. **Private gateway API:** a separate HTTPS hostname routed through the configured secure tunnel/access policy to gateway loopback. Never expose Ollama :11434 directly.

Changing the client domain is optional and should not be coupled to the gateway OAuth callback change without an explicit plan.

## Provider checklist (including DigitalPlatDev/FreeDomain)

- Recheck the provider's current eligibility, renewal/expiry rules, ownership/transfer policy and allowed DNS records directly before registration. A free-domain offering is not a guarantee of long-term uptime or ownership.
- Record the exact domain, registrar account recovery plan, DNS host, renewal reminders and account MFA in the owner's private password manager; never write credentials in this repository.
- Before pointing the domain, inspect the current GitHub Pages custom-domain instructions and ensure the domain is under your control.
- Add only DNS records the provider and GitHub Pages/Cloudflare currently instruct you to create. Do not guess apex A/AAAA records, tunnel CNAMEs or validation TXT values.
- Use different hostnames for the public frontend and private gateway API where possible.
- For the private gateway, enforce Cloudflare Access or equivalent identity policy; CORS alone is not authentication.
- Register OAuth redirect URI only after the gateway has a stable HTTPS callback hostname. The URI must exactly match the OAuth provider configuration.
- Confirm TLS, DNS propagation and that direct origin IP/ports are not publicly accessible.
- Preserve the previous DNS values and TTL until the new route passes smoke tests.

References:
- GitHub Pages custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- Cloudflare Tunnel docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- DigitalPlat official provider site: https://www.digitalplat.org/
