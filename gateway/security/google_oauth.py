"""Google OAuth Authorization Code + PKCE routes for a single-user private gateway.

Routes are registered but refuse to run unless OAUTH_ENABLED and all server-side credentials
are configured. Tokens are never returned from this module's API responses.
"""
from __future__ import annotations

import logging
from typing import Any
from urllib.parse import urlencode, urlsplit

import httpx
from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse

logger = logging.getLogger("alandi.gateway.oauth")
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke"
GOOGLE_SCOPES = ("https://www.googleapis.com/auth/drive.file",)


def _allowed_scopes(value: object, fallback: list[str] | None = None) -> list[str]:
    if value is None:
        scopes = list(fallback or GOOGLE_SCOPES)
    elif isinstance(value, str):
        scopes = value.split()
    else:
        raise ValueError("invalid OAuth scope response")
    if not scopes or len(scopes) > 16 or not set(scopes).issubset(set(GOOGLE_SCOPES)):
        raise ValueError("Google granted scopes outside the configured minimum")
    return scopes


def _vault(request: Request) -> Any:
    config = request.app.state.settings
    vault = getattr(request.app.state, "oauth_vault", None)
    if not getattr(config, "oauth_enabled", False) or vault is None:
        raise HTTPException(503, "Google OAuth is disabled or not configured")
    return vault


def _result_redirect(config: Any, state: str) -> RedirectResponse:
    base = config.oauth_success_redirect
    # Settings validation forbids query/fragment in this fixed allowlisted base URL.
    destination = f"{base}{'&' if '?' in base else '?'}drive={state}"
    return RedirectResponse(destination, status_code=303, headers={
        "Cache-Control": "no-store", "Pragma": "no-cache", "Referrer-Policy": "no-referrer"
    })


def _oauth_client_config(config: Any) -> None:
    values = (config.google_oauth_client_id, config.google_oauth_client_secret,
              config.google_oauth_redirect_uri, config.oauth_encryption_key)
    if not all(isinstance(value, str) and value.strip() for value in values):
        raise HTTPException(503, "Google OAuth server configuration is incomplete")
    redirect = urlsplit(config.google_oauth_redirect_uri)
    if redirect.scheme != "https" or not redirect.hostname or redirect.username or redirect.password or redirect.query or redirect.fragment:
        raise HTTPException(503, "Google OAuth redirect URI must be a fixed HTTPS URL without query or fragment")
    success = urlsplit(config.oauth_success_redirect)
    if success.scheme != "https" or not success.hostname or success.username or success.password or success.query or success.fragment:
        raise HTTPException(503, "OAuth success redirect must be a fixed HTTPS URL without query or fragment")
    if f"{success.scheme}://{success.netloc}" not in config.cors_origins:
        raise HTTPException(503, "OAuth success redirect origin is not allowlisted")


def build_google_oauth_router(config: Any, authorize) -> APIRouter:
    router = APIRouter()

    @router.post("/oauth/google/initiate")
    async def initiate(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        _vault(request)
        _oauth_client_config(config)
        transaction = request.app.state.oauth_vault.begin_pkce()
        params = {
            "client_id": config.google_oauth_client_id,
            "redirect_uri": config.google_oauth_redirect_uri,
            "response_type": "code",
            "scope": " ".join(GOOGLE_SCOPES),
            "access_type": "offline",
            "include_granted_scopes": "true",
            "state": transaction["state"],
            "code_challenge": transaction["code_challenge"],
            "code_challenge_method": "S256",
        }
        return JSONResponse({"status": "ok", "auth_url": GOOGLE_AUTH_URL + "?" + urlencode(params),
                             "scopes": list(GOOGLE_SCOPES)},
                            headers={"Cache-Control": "no-store"})

    @router.get("/oauth/google/callback", include_in_schema=False)
    async def callback(request: Request, code: str | None = None,
                       state: str | None = None, error: str | None = None) -> RedirectResponse:
        vault = _vault(request)
        _oauth_client_config(config)
        if not state:
            return _result_redirect(config, "error")
        try:
            verifier = vault.consume_pkce(state)
        except ValueError:
            return _result_redirect(config, "error")
        # Consume state even when the user declines consent; the transaction must not be replayable.
        if error or not code or len(code) > 4096:
            return _result_redirect(config, "error")
        client: httpx.AsyncClient = request.app.state.client
        try:
            response = await client.post(GOOGLE_TOKEN_URL, data={
                "client_id": config.google_oauth_client_id,
                "client_secret": config.google_oauth_client_secret,
                "code": code,
                "code_verifier": verifier,
                "grant_type": "authorization_code",
                "redirect_uri": config.google_oauth_redirect_uri,
            }, headers={"Accept": "application/json"}, timeout=10.0)
            response.raise_for_status()
            tokens = response.json()
            if not isinstance(tokens, dict) or not isinstance(tokens.get("access_token"), str):
                raise ValueError("invalid OAuth token response")
            expires_in = tokens.get("expires_in")
            if expires_in is not None and (isinstance(expires_in, bool) or not isinstance(expires_in, int)):
                raise ValueError("invalid OAuth token expiry")
            scopes = _allowed_scopes(tokens.get("scope"))
            vault.save_tokens("google_drive", access_token=tokens["access_token"],
                              refresh_token=tokens.get("refresh_token"), expires_in=expires_in,
                              scopes=scopes)
        except (httpx.HTTPError, ValueError, TypeError):
            # A token carrying broader-than-requested scope must never be stored. If the
            # provider did issue one, make a best-effort revoke without logging its value.
            try:
                if "tokens" in locals() and isinstance(tokens, dict):
                    revoke_token = tokens.get("refresh_token") or tokens.get("access_token")
                    if isinstance(revoke_token, str) and revoke_token:
                        await client.post(GOOGLE_REVOKE_URL, data={"token": revoke_token}, timeout=5.0)
            except httpx.HTTPError:
                logger.warning("Could not revoke rejected Google OAuth grant; no credentials were stored")
            logger.warning("Google OAuth code exchange failed or returned unapproved scopes; token response omitted")
            return _result_redirect(config, "error")
        return _result_redirect(config, "connected")

    @router.get("/oauth/google/status")
    async def status(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        vault = _vault(request)
        tokens = vault.load_tokens("google_drive")
        return JSONResponse({
            "connected": tokens is not None,
            "scopes": tokens["scopes"] if tokens else [],
            "expires_at": tokens["expires_at"] if tokens else None,
            "has_refresh_token": bool(tokens and tokens["refresh_token"]),
        }, headers={"Cache-Control": "no-store"})

    @router.post("/oauth/google/refresh")
    async def refresh(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        vault = _vault(request)
        _oauth_client_config(config)
        tokens = vault.load_tokens("google_drive")
        if not tokens or not tokens.get("refresh_token"):
            raise HTTPException(409, "No stored Google refresh token; reconnect the account")
        client: httpx.AsyncClient = request.app.state.client
        try:
            response = await client.post(GOOGLE_TOKEN_URL, data={
                "client_id": config.google_oauth_client_id,
                "client_secret": config.google_oauth_client_secret,
                "grant_type": "refresh_token",
                "refresh_token": tokens["refresh_token"],
            }, headers={"Accept": "application/json"}, timeout=10.0)
            response.raise_for_status()
            renewed = response.json()
            if not isinstance(renewed, dict) or not isinstance(renewed.get("access_token"), str):
                raise ValueError("invalid OAuth refresh response")
            expires_in = renewed.get("expires_in")
            if expires_in is not None and (isinstance(expires_in, bool) or not isinstance(expires_in, int)):
                raise ValueError("invalid OAuth token expiry")
            scopes = _allowed_scopes(renewed.get("scope"), fallback=tokens["scopes"])
            vault.save_tokens("google_drive", access_token=renewed["access_token"],
                              refresh_token=renewed.get("refresh_token"), expires_in=expires_in,
                              scopes=scopes)
        except (httpx.HTTPError, ValueError, TypeError):
            logger.warning("Google OAuth refresh failed or returned unapproved scopes; response body omitted")
            raise HTTPException(502, "Google token refresh failed or returned unapproved scopes; reconnect if needed") from None
        latest = vault.load_tokens("google_drive")
        return JSONResponse({"status": "refreshed", "expires_at": latest["expires_at"],
                             "has_refresh_token": bool(latest and latest.get("refresh_token"))},
                            headers={"Cache-Control": "no-store"})

    @router.post("/oauth/google/revoke")
    async def revoke(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        vault = _vault(request)
        tokens = vault.load_tokens("google_drive")
        if not tokens:
            return JSONResponse({"status": "not_connected"}, headers={"Cache-Control": "no-store"})
        token = tokens.get("refresh_token") or tokens["access_token"]
        client: httpx.AsyncClient = request.app.state.client
        try:
            response = await client.post(GOOGLE_REVOKE_URL, data={"token": token}, timeout=5.0)
            response.raise_for_status()
        except httpx.HTTPError:
            logger.warning("Google OAuth revocation failed; local credentials retained for retry")
            raise HTTPException(502, "Google revocation failed; local credentials were retained") from None
        vault.delete_tokens("google_drive")
        return JSONResponse({"status": "revoked"}, headers={"Cache-Control": "no-store"})

    return router
