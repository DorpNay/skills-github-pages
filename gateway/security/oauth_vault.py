"""Encrypted single-user OAuth token vault and one-time PKCE state storage.

These primitives are not an end-to-end Google Drive integration. They deliberately model
one personal gateway installation, not a multi-user SaaS identity system.
"""
from __future__ import annotations

import base64
import hashlib
import json
import secrets
import sqlite3
import time
from contextlib import closing
from pathlib import Path
from typing import Any

from cryptography.fernet import Fernet, InvalidToken


class OAuthVaultError(ValueError):
    pass


class OAuthVault:
    def __init__(self, path: str | Path, encryption_key: str, *, state_ttl_seconds: int = 600):
        if not isinstance(encryption_key, str) or not encryption_key:
            raise OAuthVaultError("OAuth encryption key is required")
        try:
            self._cipher = Fernet(encryption_key.encode("ascii"))
        except (ValueError, UnicodeEncodeError) as exc:
            raise OAuthVaultError("OAuth encryption key must be a valid Fernet key") from exc
        if not 60 <= state_ttl_seconds <= 1800:
            raise OAuthVaultError("state_ttl_seconds must be between 60 and 1800")
        self.path = str(path)
        self.state_ttl_seconds = state_ttl_seconds

    @classmethod
    def generate_key(cls) -> str:
        """Return a one-time deployment secret; never call this to silently rotate a key."""
        return Fernet.generate_key().decode("ascii")

    def _connect(self) -> sqlite3.Connection:
        db = sqlite3.connect(self.path, timeout=5.0)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA busy_timeout=5000")
        return db

    def initialize(self) -> None:
        if self.path != ":memory:":
            Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS oauth_states (
                    state_hash TEXT PRIMARY KEY,
                    encrypted_code_verifier TEXT NOT NULL,
                    created_at INTEGER NOT NULL,
                    expires_at INTEGER NOT NULL,
                    consumed_at INTEGER
                );
                CREATE INDEX IF NOT EXISTS idx_oauth_state_expiry ON oauth_states(expires_at);
                CREATE TABLE IF NOT EXISTS oauth_tokens (
                    provider TEXT PRIMARY KEY,
                    encrypted_access_token TEXT NOT NULL,
                    encrypted_refresh_token TEXT,
                    expires_at INTEGER,
                    scopes_json TEXT NOT NULL,
                    updated_at INTEGER NOT NULL
                );
            """)
            db.commit()

    @staticmethod
    def _hash_state(state: str) -> str:
        return hashlib.sha256(state.encode("utf-8")).hexdigest()

    def begin_pkce(self) -> dict[str, str]:
        state = secrets.token_urlsafe(32)
        verifier = secrets.token_urlsafe(48)
        challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode("ascii")).digest()).decode("ascii").rstrip("=")
        now = int(time.time())
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            db.execute("DELETE FROM oauth_states WHERE expires_at < ? OR consumed_at IS NOT NULL", (now,))
            db.execute("""INSERT INTO oauth_states(state_hash, encrypted_code_verifier, created_at, expires_at)
                          VALUES (?, ?, ?, ?)""",
                       (self._hash_state(state), self._cipher.encrypt(verifier.encode()).decode(), now,
                        now + self.state_ttl_seconds))
            db.commit()
        return {"state": state, "code_challenge": challenge, "code_challenge_method": "S256"}

    def consume_pkce(self, state: str) -> str:
        if not isinstance(state, str) or len(state) < 32 or len(state) > 256:
            raise OAuthVaultError("Invalid or expired OAuth state")
        now = int(time.time())
        digest = self._hash_state(state)
        with closing(self._connect()) as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute("""SELECT encrypted_code_verifier, expires_at, consumed_at
                                FROM oauth_states WHERE state_hash=?""", (digest,)).fetchone()
            if row is None or row["consumed_at"] is not None or int(row["expires_at"]) < now:
                db.rollback()
                raise OAuthVaultError("Invalid or expired OAuth state")
            db.execute("UPDATE oauth_states SET consumed_at=? WHERE state_hash=? AND consumed_at IS NULL",
                       (now, digest))
            db.commit()
        try:
            return self._cipher.decrypt(row["encrypted_code_verifier"].encode()).decode("ascii")
        except (InvalidToken, UnicodeDecodeError) as exc:
            raise OAuthVaultError("Stored OAuth transaction is invalid") from exc

    def save_tokens(self, provider: str, *, access_token: str, refresh_token: str | None,
                    expires_in: int | None, scopes: list[str]) -> None:
        if not isinstance(provider, str) or not provider or len(provider) > 64:
            raise OAuthVaultError("Invalid provider")
        if not isinstance(access_token, str) or not access_token or len(access_token) > 16384:
            raise OAuthVaultError("Invalid access token")
        if refresh_token is not None and (not isinstance(refresh_token, str) or len(refresh_token) > 16384):
            raise OAuthVaultError("Invalid refresh token")
        if not isinstance(scopes, list) or len(scopes) > 64 or any(not isinstance(s, str) or len(s) > 512 for s in scopes):
            raise OAuthVaultError("Invalid OAuth scopes")
        if expires_in is not None and (isinstance(expires_in, bool) or not isinstance(expires_in, int) or not 1 <= expires_in <= 31_536_000):
            raise OAuthVaultError("Invalid expires_in")
        now = int(time.time())
        encrypted_access = self._cipher.encrypt(access_token.encode()).decode()
        encrypted_refresh = self._cipher.encrypt(refresh_token.encode()).decode() if refresh_token else None
        with closing(self._connect()) as db:
            db.execute("""INSERT INTO oauth_tokens(provider, encrypted_access_token, encrypted_refresh_token,
                          expires_at, scopes_json, updated_at) VALUES (?, ?, ?, ?, ?, ?)
                          ON CONFLICT(provider) DO UPDATE SET encrypted_access_token=excluded.encrypted_access_token,
                          encrypted_refresh_token=COALESCE(excluded.encrypted_refresh_token, oauth_tokens.encrypted_refresh_token),
                          expires_at=excluded.expires_at, scopes_json=excluded.scopes_json, updated_at=excluded.updated_at""",
                       (provider, encrypted_access, encrypted_refresh, now + expires_in if expires_in else None,
                        json.dumps(scopes, ensure_ascii=False), now))
            db.commit()

    def load_tokens(self, provider: str) -> dict[str, Any] | None:
        with closing(self._connect()) as db:
            row = db.execute("SELECT * FROM oauth_tokens WHERE provider=?", (provider,)).fetchone()
        if row is None:
            return None
        try:
            access = self._cipher.decrypt(row["encrypted_access_token"].encode()).decode()
            refresh = self._cipher.decrypt(row["encrypted_refresh_token"].encode()).decode() if row["encrypted_refresh_token"] else None
            scopes = json.loads(row["scopes_json"])
        except (InvalidToken, UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise OAuthVaultError("Stored OAuth credential cannot be decrypted") from exc
        return {"provider": provider, "access_token": access, "refresh_token": refresh,
                "expires_at": row["expires_at"], "scopes": scopes, "updated_at": row["updated_at"]}

    def delete_tokens(self, provider: str) -> None:
        with closing(self._connect()) as db:
            db.execute("DELETE FROM oauth_tokens WHERE provider=?", (provider,))
            db.commit()
