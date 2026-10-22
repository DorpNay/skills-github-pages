"""Optional OpenTelemetry tracing setup with privacy-safe defaults.

Nothing is imported, initialized, or exported until ALANDI_OTEL_ENABLED=true.
Remote exporters are rejected unless ALANDI_OTEL_ALLOW_REMOTE=true and the endpoint is HTTPS.
This module does not attach prompts, transcripts, OAuth tokens, or tool arguments to spans.
"""
from __future__ import annotations

import os
import socket
from dataclasses import dataclass
from urllib.parse import urlsplit


class OTelConfigurationError(ValueError):
    pass


@dataclass(frozen=True)
class OTelStatus:
    enabled: bool
    endpoint: str | None
    exporter: str
    reason: str


def _truthy(value: str | None) -> bool:
    return (value or "").strip().lower() in {"1", "true", "yes", "on"}


def validate_endpoint(endpoint: str, *, allow_remote: bool = False) -> str:
    if not isinstance(endpoint, str) or not endpoint.strip() or len(endpoint) > 512:
        raise OTelConfigurationError("OTEL endpoint must be a bounded URL")
    parsed = urlsplit(endpoint.strip())
    if parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise OTelConfigurationError("OTEL endpoint cannot contain credentials, query, or fragment")
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise OTelConfigurationError("OTEL endpoint must be an HTTP(S) URL")
    host = parsed.hostname.lower().rstrip(".")
    is_loopback_name = host in {"localhost", "localhost.localdomain"}
    is_loopback_ip = False
    try:
        import ipaddress
        is_loopback_ip = ipaddress.ip_address(host).is_loopback
    except ValueError:
        pass
    if not (is_loopback_name or is_loopback_ip):
        if not allow_remote or parsed.scheme != "https":
            raise OTelConfigurationError("remote OTEL export requires explicit opt-in and HTTPS")
    if parsed.port is not None and not 1 <= parsed.port <= 65535:
        raise OTelConfigurationError("invalid OTEL port")
    # Return the original validated URL without modifying host, path or TLS semantics.
    return endpoint.strip()


def initialize_otel_from_env() -> OTelStatus:
    """Initialize a single SDK provider when explicitly enabled; raises on unsafe setup."""
    if not _truthy(os.getenv("ALANDI_OTEL_ENABLED")):
        return OTelStatus(False, None, "none", "disabled_by_default")
    allow_remote = _truthy(os.getenv("ALANDI_OTEL_ALLOW_REMOTE"))
    endpoint = validate_endpoint(
        os.getenv("ALANDI_OTEL_ENDPOINT", "http://127.0.0.1:4318/v1/traces"),
        allow_remote=allow_remote,
    )
    try:
        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
    except ImportError as exc:
        raise OTelConfigurationError(
            "OTel is enabled but optional packages are not installed; install a reviewed pinned extra"
        ) from exc
    current = trace.get_tracer_provider()
    # Do not override another owner's provider or initialize duplicate exporters.
    if isinstance(current, TracerProvider):
        return OTelStatus(True, endpoint, "otlp-http", "provider_already_initialized")
    resource = Resource.create({"service.name": "alandi-gateway"})
    provider = TracerProvider(resource=resource)
    exporter = OTLPSpanExporter(endpoint=endpoint)
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)
    return OTelStatus(True, endpoint, "otlp-http", "initialized")
