from __future__ import annotations

import io
import json
import urllib.error
import urllib.request

import pytest

from gateway.evals import run_local_model_benchmark as benchmark


class FakeResponse:
    def __init__(self, payload: bytes):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self, size=-1):
        return self.payload[:size]


class FakeOpener:
    def __init__(self, response=None, error=None):
        self.response = response
        self.error = error
        self.request = None
        self.timeout = None

    def open(self, request, timeout):
        self.request = request
        self.timeout = timeout
        if self.error:
            raise self.error
        return self.response


def test_percentile_uses_nearest_rank_and_handles_empty_samples():
    assert benchmark.percentile([], 95) is None
    assert benchmark.percentile([4.0, 1.0, 3.0, 2.0], 50) == 2.0
    assert benchmark.percentile([4.0, 1.0, 3.0, 2.0], 95) == 4.0


def test_summary_reports_median_and_p95_without_inventing_empty_values():
    assert benchmark.summarize([]) == {
        "count": 0, "min": None, "median": None, "p95": None, "max": None,
    }
    assert benchmark.summarize([10.0, 30.0, 20.0]) == {
        "count": 3, "min": 10.0, "median": 20.0, "p95": 30.0, "max": 30.0,
    }


def test_request_completion_sends_bearer_header_and_parses_bounded_json(monkeypatch):
    payload = {"choices": [{"message": {"content": "synthetic response"}}]}
    opener = FakeOpener(response=FakeResponse(json.dumps(payload).encode("utf-8")))
    monkeypatch.setattr(benchmark.urllib.request, "build_opener", lambda handler: opener)

    result, latency_ms = benchmark.request_completion(
        "http://127.0.0.1:8000/v1", "test-secret", "local-model", "synthetic prompt", 5
    )

    assert result == payload
    assert latency_ms >= 0
    assert opener.timeout == 5
    assert opener.request.get_header("Authorization") == "Bearer test-secret"
    assert b"test-secret" not in opener.request.data


def test_redirects_are_never_followed():
    handler = benchmark.NoRedirectHandler()
    assert handler.redirect_request(
        urllib.request.Request("https://local.example/v1/chat/completions"),
        None, 302, "Found", {}, "https://other.example/collect"
    ) is None


def test_http_error_body_is_not_exposed(monkeypatch):
    error = urllib.error.HTTPError(
        "https://local.example/v1/chat/completions", 401, "Unauthorized", {},
        io.BytesIO(b"private-upstream-diagnostic")
    )
    opener = FakeOpener(error=error)
    monkeypatch.setattr(benchmark.urllib.request, "build_opener", lambda handler: opener)

    with pytest.raises(RuntimeError, match="HTTP 401") as raised:
        benchmark.request_completion(
            "https://local.example/v1", "test-secret", "local-model", "synthetic prompt", 5
        )

    assert "private-upstream-diagnostic" not in str(raised.value)
    assert "test-secret" not in str(raised.value)


def test_oversized_response_is_rejected(monkeypatch):
    opener = FakeOpener(response=FakeResponse(b"x" * (benchmark.MAX_RESPONSE_BYTES + 1)))
    monkeypatch.setattr(benchmark.urllib.request, "build_opener", lambda handler: opener)

    with pytest.raises(RuntimeError, match="1 MiB"):
        benchmark.request_completion(
            "http://127.0.0.1:8000/v1", "", "local-model", "synthetic prompt", 5
        )
