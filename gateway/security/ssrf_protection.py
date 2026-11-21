"""SSRF validation primitives for a future controlled URL-fetch tool.

No arbitrary URL fetcher is wired into the gateway. Callers must resolve DNS once, validate
every result here, and pin the chosen public IP at connect time while still validating TLS for
the original hostname; validating a URL and resolving it again later is vulnerable to rebinding.
"""
from __future__ import annotations

import ipaddress
import re
from dataclasses import dataclass
from urllib.parse import urlsplit, urlunsplit


class SSRFRejected(ValueError):
    pass


_CONTROL = re.compile(r"[\x00-\x20\x7f]")


@dataclass(frozen=True)
class SafeDestination:
    canonical_url: str
    hostname: str
    port: int
    resolved_public_ips: tuple[str, ...]


def validate_resolved_destination(url: str, resolved_ips: list[str] | tuple[str, ...], *,
                                  allowed_hosts: set[str] | frozenset[str] | None = None,
                                  allowed_ports: set[int] | frozenset[int] = frozenset({443})) -> SafeDestination:
    if not isinstance(url, str) or not url or len(url) > 4096 or _CONTROL.search(url):
        raise SSRFRejected("URL must be bounded and contain no control characters")
    try:
        parsed = urlsplit(url)
        port = parsed.port or 443
    except ValueError as exc:
        raise SSRFRejected("Invalid URL authority or port") from exc
    if parsed.scheme.lower() != "https":
        raise SSRFRejected("Only HTTPS destinations are allowed")
    if not parsed.hostname or parsed.username is not None or parsed.password is not None:
        raise SSRFRejected("URL must have a hostname and cannot contain credentials")
    if parsed.query or parsed.fragment:
        raise SSRFRejected("Query strings and fragments are not accepted for registered destinations")
    if port not in allowed_ports:
        raise SSRFRejected("Destination port is not allowed")
    try:
        host = parsed.hostname.encode("idna").decode("ascii").lower().rstrip(".")
    except UnicodeError as exc:
        raise SSRFRejected("Invalid internationalized hostname") from exc
    if not host or host in {"localhost", "localhost.localdomain"} or "." not in host:
        raise SSRFRejected("Non-public or single-label hostnames are not allowed")
    if allowed_hosts is not None:
        normalized_allow = {item.encode("idna").decode("ascii").lower().rstrip(".") for item in allowed_hosts}
        if host not in normalized_allow:
            raise SSRFRejected("Hostname is not on the configured allowlist")

    try:
        literal = ipaddress.ip_address(host)
    except ValueError:
        literal = None
    if literal is not None:
        if not literal.is_global:
            raise SSRFRejected("Private, loopback, link-local, reserved, or non-global IP is forbidden")
        candidates = [str(literal)]
    else:
        candidates = []
        if not isinstance(resolved_ips, (list, tuple)) or not resolved_ips:
            raise SSRFRejected("Host must be resolved and validated before connecting")
        for raw in resolved_ips:
            try:
                parsed_ip = ipaddress.ip_address(raw)
            except (ValueError, TypeError) as exc:
                raise SSRFRejected("DNS returned an invalid address") from exc
            if not parsed_ip.is_global:
                raise SSRFRejected("DNS returned a non-public IP; reject the entire answer set")
            normalized_ip = str(parsed_ip)
            if normalized_ip not in candidates:
                candidates.append(normalized_ip)
    canonical = urlunsplit(("https", f"{host}:{port}" if port != 443 else host, parsed.path or "/", "", ""))
    return SafeDestination(canonical_url=canonical, hostname=host, port=port,
                           resolved_public_ips=tuple(candidates))
