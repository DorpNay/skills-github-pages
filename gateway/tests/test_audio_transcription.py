import httpx
from fastapi.testclient import TestClient

import gateway.app as gateway_app
from gateway.app import Settings, create_app

API_KEY = "a" * 64


def config(**overrides):
    values = dict(
        api_key=API_KEY,
        ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",),
        cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False,
        audio_transcription_enabled=False,
    )
    values.update(overrides)
    return Settings(**values)


def client(settings, handler):
    return TestClient(create_app(settings, transport=httpx.MockTransport(handler)))


def upstream_handler(request):
    if request.url.path == "/api/tags":
        return httpx.Response(200, json={"models": []})
    raise AssertionError(f"Unexpected upstream request: {request.url}")


def make_executable(path):
    path.write_bytes(b"local test stub")
    path.chmod(0o700)
    return str(path)


def test_transcription_requires_auth_and_is_disabled_by_default():
    with client(config(), upstream_handler) as app:
        assert app.post("/v1/audio/transcriptions", content=b"audio",
                        headers={"Content-Type": "audio/webm"}).status_code == 401
        response = app.post("/v1/audio/transcriptions", content=b"audio",
                            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "audio/webm"})
        assert response.status_code == 503


def test_transcription_validates_audio_type_language_and_empty_body(tmp_path):
    binary = make_executable(tmp_path / "whisper-cli")
    ffprobe = make_executable(tmp_path / "ffprobe")
    model = tmp_path / "model.gguf"
    model.write_bytes(b"model")
    settings = config(audio_transcription_enabled=True, audio_transcription_binary=binary,
                      audio_transcription_model=str(model), audio_transcription_ffprobe_binary=ffprobe)
    auth = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "audio/webm"}
    with client(settings, upstream_handler) as app:
        assert app.post("/v1/audio/transcriptions?lang=fr", content=b"audio", headers=auth).status_code == 400
        assert app.post("/v1/audio/transcriptions", content=b"audio",
                        headers={**auth, "Content-Type": "application/json"}).status_code == 415
        assert app.post("/v1/audio/transcriptions", content=b"", headers=auth).status_code == 400


def test_transcription_runs_configured_local_cli_and_returns_no_store(tmp_path, monkeypatch):
    binary = make_executable(tmp_path / "whisper-cli")
    ffprobe = make_executable(tmp_path / "ffprobe")
    model = tmp_path / "model.gguf"
    model.write_bytes(b"model")

    class FakeProcess:
        returncode = 0

        async def wait(self):
            return 0

        async def communicate(self):
            return b"3.5\\n", b""

        def kill(self):
            self.returncode = -9

    async def fake_create_subprocess_exec(*args, **kwargs):
        if args[0] == ffprobe:
            assert "-show_entries" in args and "format=duration" in args
            return FakeProcess()
        assert args[0] == binary
        assert "-m" in args and str(model) in args
        assert "-l" in args and "ru" in args
        prefix = args[args.index("-of") + 1]
        with open(prefix + ".txt", "w", encoding="utf-8") as output:
            output.write("  Проверка локальной расшифровки.  ")
        return FakeProcess()

    monkeypatch.setattr(gateway_app.asyncio, "create_subprocess_exec", fake_create_subprocess_exec)
    settings = config(audio_transcription_enabled=True, audio_transcription_binary=binary,
                      audio_transcription_model=str(model), audio_transcription_ffprobe_binary=ffprobe)
    with client(settings, upstream_handler) as app:
        response = app.post("/v1/audio/transcriptions?lang=ru", content=b"fake-audio",
                            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "audio/webm"})
    assert response.status_code == 200, response.text
    assert response.headers["cache-control"] == "no-store"
    assert response.json() == {
        "text": "Проверка локальной расшифровки.",
        "language": "ru",
        "provider": "local-whisper.cpp",
    }


def test_transcription_rejects_unavailable_local_runtime(tmp_path):
    ffprobe = make_executable(tmp_path / "ffprobe")
    model = tmp_path / "model.gguf"
    model.write_bytes(b"model")
    settings = config(audio_transcription_enabled=True, audio_transcription_binary=str(tmp_path / "missing"),
                      audio_transcription_model=str(model), audio_transcription_ffprobe_binary=ffprobe)
    with client(settings, upstream_handler) as app:
        response = app.post("/v1/audio/transcriptions", content=b"fake-audio",
                            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "audio/webm"})
    assert response.status_code == 503
