from __future__ import annotations

import hashlib
import secrets
import sqlite3
import time

import pytest
from cryptography.fernet import Fernet

from gateway.security.oauth_vault import OAuthVault, OAuthVaultError


def _new_vault(tmp_path, *, state_ttl_seconds: int = 600):
    path = tmp_path / "oauth.sqlite3"
    key = Fernet.generate_key().decode("ascii")
    vault = OAuthVault(path, key, state_ttl_seconds=state_ttl_seconds)
    vault.initialize()
    return vault, path, key


def test_pkce_state_is_bound_to_provider_and_single_use(tmp_path):
    vault, _, _ = _new_vault(tmp_path)
    transaction = vault.begin_pkce(provider="google_drive")

    with pytest.raises(OAuthVaultError, match="Invalid or expired"):
        vault.consume_pkce(transaction["state"], provider="github")

    verifier = vault.consume_pkce(transaction["state"], provider="google_drive")
    assert isinstance(verifier, str) and len(verifier) >= 43

    with pytest.raises(OAuthVaultError, match="Invalid or expired"):
        vault.consume_pkce(transaction["state"], provider="google_drive")


def test_legacy_providerless_state_table_migrates_without_losing_google_flow(tmp_path):
    path = tmp_path / "legacy.sqlite3"
    key = Fernet.generate_key().decode("ascii")
    cipher = Fernet(key.encode("ascii"))
    state = secrets.token_urlsafe(32)
    verifier = secrets.token_urlsafe(48)
    now = int(time.time())
    digest = hashlib.sha256(state.encode("utf-8")).hexdigest()

    with sqlite3.connect(path) as db:
        db.execute("""CREATE TABLE oauth_states (
            state_hash TEXT PRIMARY KEY,
            encrypted_code_verifier TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL,
            consumed_at INTEGER
        )""")
        db.execute(
            "INSERT INTO oauth_states(state_hash, encrypted_code_verifier, created_at, expires_at) VALUES (?, ?, ?, ?)",
            (digest, cipher.encrypt(verifier.encode("ascii")).decode("ascii"), now, now + 600),
        )

    vault = OAuthVault(path, key)
    vault.initialize()

    with sqlite3.connect(path) as db:
        columns = {row[1] for row in db.execute("PRAGMA table_info(oauth_states)")}
        migrated_provider = db.execute(
            "SELECT provider FROM oauth_states WHERE state_hash=?", (digest,)
        ).fetchone()[0]

    assert "provider" in columns
    assert migrated_provider == "google_drive"
    assert vault.consume_pkce(state, provider="google_drive") == verifier


def test_provider_tokens_are_encrypted_at_rest_and_can_be_deleted(tmp_path):
    vault, path, _ = _new_vault(tmp_path)
    access_token = "ghu_test_access_token_not_a_real_secret"
    refresh_token = "ghr_test_refresh_token_not_a_real_secret"

    vault.save_tokens(
        "github",
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=3600,
        scopes=["contents:read", "metadata:read"],
    )

    raw_db = path.read_bytes()
    assert access_token.encode() not in raw_db
    assert refresh_token.encode() not in raw_db
    stored = vault.load_tokens("github")
    assert stored is not None
    assert stored["access_token"] == access_token
    assert stored["refresh_token"] == refresh_token
    assert stored["scopes"] == ["contents:read", "metadata:read"]

    vault.delete_tokens("github")
    assert vault.load_tokens("github") is None


def test_invalid_provider_names_are_rejected(tmp_path):
    vault, _, _ = _new_vault(tmp_path)
    with pytest.raises(OAuthVaultError, match="Invalid provider"):
        vault.begin_pkce(provider="../github")
    with pytest.raises(OAuthVaultError, match="Invalid provider"):
        vault.load_tokens("GitHub")
