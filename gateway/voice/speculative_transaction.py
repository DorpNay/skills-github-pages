"""Read-only speculative voice transaction contracts.

Adapters are dependency-injected. This code does not load models, touch a microphone, play audio,
or execute tools. Implementations must buffer TTS without playing until final endpoint confirmation.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from .cpocket import ResourceLease, TransactionalCPocket
from .tier_router import normalize_transcript


@dataclass(frozen=True)
class ReadOnlyIntent:
    name: str
    tier: str = "tier1"
    arguments: dict[str, Any] | None = None


@dataclass(frozen=True)
class SpeculativeResponse:
    text: str
    cacheable: bool = False


class ReadOnlyRouter(Protocol):
    async def classify_readonly(self, transcript: str) -> ReadOnlyIntent: ...


class ReadOnlyResponder(Protocol):
    async def speculate_readonly(self, intent: ReadOnlyIntent) -> SpeculativeResponse: ...


class BufferedTTS(Protocol):
    async def synthesize_prefix(self, text: str, *, max_duration_ms: int,
                                destination: str) -> Any: ...
    async def discard_buffer(self, buffer: Any) -> None: ...
    async def play_buffered_prefix(self, buffer: Any) -> None: ...
    async def continue_streaming(self, text: str) -> None: ...


@dataclass
class SpeculativeBranch:
    branch_id: str
    partial_transcript: str
    intent: ReadOnlyIntent
    response_text: str
    tts_prefix_buffer: Any
    lease: ResourceLease
    committed: bool = False
    rolled_back: bool = False


class SpeculativeVoiceTransaction:
    def __init__(self, router: ReadOnlyRouter, responder: ReadOnlyResponder, tts: BufferedTTS,
                 cpocket: TransactionalCPocket, *, lease_ttl_ms: int = 3000,
                 max_prefix_audio_ms: int = 220):
        if not 50 <= lease_ttl_ms <= 60_000 or not 0 <= max_prefix_audio_ms <= 500:
            raise ValueError("invalid speculative transaction budget")
        self.router, self.responder, self.tts, self.cpocket = router, responder, tts, cpocket
        self.lease_ttl_ms, self.max_prefix_audio_ms = lease_ttl_ms, max_prefix_audio_ms

    async def on_asr_stable_partial(self, transcript: str) -> SpeculativeBranch:
        if not isinstance(transcript, str) or not transcript.strip() or len(transcript) > 2000:
            raise ValueError("stable partial transcript must be non-empty and bounded")
        lease = await self.cpocket.acquire_lease("voice_speculation", ttl_ms=self.lease_ttl_ms)
        buffer = None
        try:
            intent = await self.router.classify_readonly(transcript)
            response = await self.responder.speculate_readonly(intent)
            if not isinstance(response, SpeculativeResponse) or not isinstance(response.text, str) or not response.text:
                raise ValueError("read-only responder returned an invalid response")
            buffer = await self.tts.synthesize_prefix(
                response.text, max_duration_ms=self.max_prefix_audio_ms, destination="buffer_only"
            )
            lease.add_cleanup(self.tts.discard_buffer, buffer)
            return SpeculativeBranch(lease.branch_id, transcript, intent, response.text, buffer, lease)
        except Exception:
            await self.cpocket.rollback(lease.branch_id, reason="speculation_failed")
            # If failure occurred before cleanup registration, discard explicitly.
            if buffer is not None and not lease.cleanup_errors:
                try:
                    await self.tts.discard_buffer(buffer)
                except Exception:
                    pass
            raise

    async def on_endpoint_confirmed(self, final_transcript: str, branch: SpeculativeBranch) -> bool:
        if branch.rolled_back or branch.committed:
            return False
        if not isinstance(final_transcript, str) or not final_transcript.strip() or not self._is_compatible(
            branch.partial_transcript, final_transcript
        ):
            await self.rollback(branch, reason="transcript_mismatch")
            return False
        committed = await self.cpocket.commit(branch.branch_id)
        if not committed:
            branch.rolled_back = True
            return False
        branch.committed = True
        # Playback happens only after the recognizer confirms compatible final text.
        await self.tts.play_buffered_prefix(branch.tts_prefix_buffer)
        await self.tts.continue_streaming(branch.response_text)
        return True

    async def rollback(self, branch: SpeculativeBranch, reason: str = "transcript_mismatch") -> bool:
        if branch.committed or branch.rolled_back:
            return False
        branch.rolled_back = True
        return await self.cpocket.rollback(branch.branch_id, reason=reason)

    @staticmethod
    def _is_compatible(partial: str, final: str) -> bool:
        p = normalize_transcript(partial)
        f = normalize_transcript(final)
        return bool(p and f and (f == p or f.startswith(p + " ")))
