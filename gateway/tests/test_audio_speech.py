import httpx
from fastapi.testclient import TestClient

import gateway.app as gateway_app
from gateway.app import Settings, create_app

API_KEY = "b" * 64


def config(**overrides):
    values = dict(
        api_key=API_KEY,
        ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",),
        cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False,
        audio_speech_enabled=False,
    )
    values.update(overrides)
    return Settings(**values)


def handler(request):
    if request.url.path == "/api/tags":
        return httpx.Response(200, json={"models": []})
    raise AssertionError(f"Unexpected upstream request: {request.url}")


def make_executable(path):
    path.write_bytes(b"local test stub")
    path.chmod(0o700)
    return str(path)


def test_speech_requires_auth_and_is_disabled_by_default():
    with TestClient(create_app(config(), transport=httpx.MockTransport(handler))) as client:
        assert client.post("/v1/audio/speech", json={"text": "hello"}).status_code == 401
        response = client.post("/v1/audio/speech", json={"text": "hello"},
                               headers={"Authorization": f"Bearer {API_KEY}"})
        assert response.status_code == 503


def test_speech_validates_text_and_local_runtime(tmp_path):
    binary = make_executable(tmp_path / "piper")
    model = tmp_path / "voice.onnx"
    model.write_bytes(b"model")
    settings = config(audio_speech_enabled=True, audio_speech_binary=binary,
                      audio_speech_model=str(model))
    auth = {"Authorization": f"Bearer {API_KEY}"}
    with TestClient(create_app(settings, transport=httpx.MockTransport(handler))) as client:
        assert client.post("/v1/audio/speech", json={"text": " "}, headers=auth).status_code == 400
        assert client.post("/v1/audio/speech", json={"text": "x" * 5001}, headers=auth).status_code == 400


def test_speech_runs_configured_local_cli_and_returns_wav(tmp_path, monkeypatch):
    binary = make_executable(tmp_path / "piper")
    model = tmp_path / "voice.onnx"
    model.write_bytes(b"model")
    captured = {}

    class FakeProcess:
        returncode = 0

        def __init__(self, output_path):
            self.output_path = output_path

        async def communicate(self, input=None):
            captured["text"] = input.decode("utf-8")
            wav = b"RIFF" + (36).to_bytes(4, "little") + b"WAVE" + bytes(28)
            with open(self.output_path, "wb") as output:
                output.write(wav)
            return b"", b""

        async def wait(self):
            return 0

        def kill(self):
            self.returncode = -9

    async def fake_create_subprocess_exec(*args, **kwargs):
        assert args[0] == binary
        assert "--model" in args and str(model) in args
        return FakeProcess(args[args.index("--output_file") + 1])

    monkeypatch.setattr(gateway_app.asyncio, "create_subprocess_exec", fake_create_subprocess_exec)
    settings = config(audio_speech_enabled=True, audio_speech_binary=binary, audio_speech_model=str(model))
    with TestClient(create_app(settings, transport=httpx.MockTransport(handler))) as client:
        response = client.post("/v1/audio/speech", json={"text": "Hello local world"},
                               headers={"Authorization": f"Bearer {API_KEY}"})
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("audio/wav")
    assert response.headers["cache-control"] == "no-store"
    assert response.content[:4] == b"RIFF" and response.content[8:12] == b"WAVE"
    assert captured["text"] == "Hello local world"


def test_speech_rejects_missing_local_runtime(tmp_path):
    model = tmp_path / "voice.onnx"
    model.write_bytes(b"model")
    settings = config(audio_speech_enabled=True, audio_speech_binary=str(tmp_path / "missing"),
                      audio_speech_model=str(model))
    with TestClient(create_app(settings, transport=httpx.MockTransport(handler))) as client:
        response = client.post("/v1/audio/speech", json={"text": "hello"},
                               headers={"Authorization": f"Bearer {API_KEY}"})
    assert response.status_code == 503
