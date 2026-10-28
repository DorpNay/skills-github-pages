import asyncio
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from gateway.app import Settings, local_audio_limited

API_KEY = "c" * 64


def config():
    return Settings(
        api_key=API_KEY,
        ollama_base_url="http://ollama.test:11434",
        allowed_models=("alandi-huihui-qwen35-4b",),
        cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False,
    )


@pytest.mark.asyncio
async def test_local_audio_jobs_reject_concurrent_work_instead_of_queueing():
    semaphore = asyncio.Semaphore(1)
    request = SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(semaphore=semaphore)))
    started = asyncio.Event()
    release = asyncio.Event()

    async def endpoint(_request, **_kwargs):
        started.set()
        await release.wait()
        return "completed"

    wrapped = local_audio_limited(config())(endpoint)
    first = asyncio.create_task(wrapped(request, authorization=f"Bearer {API_KEY}"))
    await asyncio.wait_for(started.wait(), timeout=0.5)

    with pytest.raises(HTTPException) as exc:
        await wrapped(request, authorization=f"Bearer {API_KEY}")
    assert exc.value.status_code == 429

    release.set()
    assert await first == "completed"
    assert not semaphore.locked()


@pytest.mark.asyncio
async def test_local_audio_jobs_release_slot_when_endpoint_raises():
    semaphore = asyncio.Semaphore(1)
    request = SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(semaphore=semaphore)))

    async def endpoint(_request, **_kwargs):
        raise RuntimeError("test failure")

    wrapped = local_audio_limited(config())(endpoint)
    with pytest.raises(RuntimeError):
        await wrapped(request, authorization=f"Bearer {API_KEY}")
    assert not semaphore.locked()
