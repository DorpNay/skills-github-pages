"""Read-only GitHub App connector for bounded Coder repository browsing."""
from __future__ import annotations

import asyncio
import base64
import binascii
import hashlib
import json
import logging
import re
import time
from datetime import datetime, timezone
from urllib.parse import quote, urlencode
from typing import Any

import httpx
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from fastapi import APIRouter, Header, HTTPException, Query, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("alandi.gateway.github_app")
API_BASE_URL = "https://api.github.com"
API_VERSION = "2026-03-10"
MAX_REPOSITORIES = 50
MAX_TREE_ENTRIES = 10_000
MAX_FILE_BYTES = 1_000_000
MAX_API_RESPONSE_BYTES = 5_000_000


class GitHubAppError(RuntimeError):
    def __init__(self, status_code: int, message: str) -> None:
        self.status_code = status_code
        self.message = message
        super().__init__(message)


def _b64url(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _audit(action: str, repository: str = "", path: str = "", outcome: str = "success") -> None:
    path_hash = hashlib.sha256(path.encode("utf-8")).hexdigest()[:16] if path else "-"
    logger.info(
        "connector_audit provider=github_app action=%s repository=%s path_sha256=%s outcome=%s",
        action, repository or "-", path_hash, outcome,
    )


class GitHubAppConnector:
    def __init__(self, settings: Any, client: httpx.AsyncClient) -> None:
        self._app_id = settings.github_app_id
        self._installation_id = settings.github_app_installation_id
        self._allowed = {name.casefold(): name for name in settings.github_app_allowed_repositories}
        if not self._allowed or len(self._allowed) > MAX_REPOSITORIES:
            raise ValueError("GitHub App repository allowlist is empty or too large")
        if len({name.split("/", 1)[0].casefold() for name in self._allowed.values()}) != 1:
            raise ValueError("GitHub App allowlist must belong to one GitHub account")
        self._client = client
        try:
            self._private_key = serialization.load_pem_private_key(
                settings.github_app_private_key.encode("utf-8"), password=None
            )
        except (TypeError, ValueError):
            raise ValueError("GITHUB_APP_PRIVATE_KEY is not a valid unencrypted PEM key") from None
        if not isinstance(self._private_key, rsa.RSAPrivateKey) or self._private_key.key_size < 2048:
            raise ValueError("GitHub App private key must be RSA with at least 2048 bits")
        self._token: str | None = None
        self._token_expires_at = 0.0
        self._token_lock = asyncio.Lock()
        self._request_semaphore = asyncio.Semaphore(2)

    def _app_jwt(self) -> str:
        now = int(time.time())
        header = _b64url(json.dumps({"alg": "RS256", "typ": "JWT"}, separators=(",", ":")).encode())
        payload = _b64url(json.dumps(
            {"iat": now - 60, "exp": now + 540, "iss": str(self._app_id)},
            separators=(",", ":"), sort_keys=True,
        ).encode())
        signing_input = f"{header}.{payload}".encode("ascii")
        signature = self._private_key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256())
        return f"{header}.{payload}.{_b64url(signature)}"

    async def _request_json(
        self, method: str, path: str, *, token: str | None = None,
        app_jwt: str | None = None, body: dict[str, Any] | None = None,
        max_bytes: int = MAX_API_RESPONSE_BYTES,
    ) -> Any:
        if not path.startswith("/") or path.startswith("//"):
            raise GitHubAppError(500, "Invalid internal GitHub API path")
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": API_VERSION,
            "User-Agent": "aLandi-read-only-github-app/1.0",
        }
        credential = token or app_jwt
        if credential:
            headers["Authorization"] = f"Bearer {credential}"
        kwargs: dict[str, Any] = {
            "headers": headers, "timeout": 10.0, "follow_redirects": False,
        }
        if body is not None:
            kwargs["json"] = body
        try:
            async with self._request_semaphore:
                response = await self._client.request(method, API_BASE_URL + path, **kwargs)
        except httpx.HTTPError:
            raise GitHubAppError(503, "GitHub API is temporarily unavailable") from None
        if len(response.content) > max_bytes:
            raise GitHubAppError(502, "GitHub API response exceeded the configured size limit")
        if response.status_code >= 400:
            raise GitHubAppError(response.status_code, "GitHub API rejected the read-only request")
        if 300 <= response.status_code < 400:
            raise GitHubAppError(502, "Unexpected GitHub API redirect")
        if not response.content:
            return {}
        try:
            payload = response.json()
        except ValueError:
            raise GitHubAppError(502, "GitHub API returned invalid JSON") from None
        if not isinstance(payload, (dict, list)):
            raise GitHubAppError(502, "GitHub API returned an unexpected response")
        return payload

    async def _get_token(self) -> str:
        async with self._token_lock:
            if self._token and self._token_expires_at - time.time() > 60:
                return self._token
            repositories = [name.split("/", 1)[1] for name in self._allowed.values()]
            payload = await self._request_json(
                "POST", f"/app/installations/{self._installation_id}/access_tokens",
                app_jwt=self._app_jwt(),
                body={"repositories": repositories, "permissions": {"contents": "read", "metadata": "read"}},
                max_bytes=64_000,
            )
            if not isinstance(payload, dict):
                raise GitHubAppError(502, "GitHub returned an invalid installation-token response")
            token = payload.get("token")
            if (
                not isinstance(token, str) or not 20 <= len(token) <= 4096
                or not token.isascii() or any(ord(char) < 33 or ord(char) > 126 for char in token)
            ):
                raise GitHubAppError(502, "GitHub did not return a valid installation token")
            permissions = payload.get("permissions")
            if (
                not isinstance(permissions, dict)
                or permissions.get("contents") != "read"
                or permissions.get("metadata", "read") != "read"
                or any(value != "read" for value in permissions.values())
                or set(permissions) - {"contents", "metadata"}
            ):
                raise GitHubAppError(403, "GitHub installation token does not have the required read-only permissions")
            try:
                expiry = datetime.fromisoformat(str(payload.get("expires_at")).replace("Z", "+00:00")).timestamp()
            except (TypeError, ValueError, OverflowError):
                raise GitHubAppError(502, "GitHub returned an invalid token expiry") from None
            now = time.time()
            if expiry <= now + 60 or expiry > now + 3660:
                raise GitHubAppError(502, "GitHub installation token expiry is outside the expected one-hour window")
            returned_repositories = payload.get("repositories")
            if isinstance(returned_repositories, list):
                allowed_names = set(self._allowed)
                if any(
                    not isinstance(item, dict) or not isinstance(item.get("full_name"), str)
                    or item["full_name"].casefold() not in allowed_names
                    for item in returned_repositories
                ):
                    raise GitHubAppError(403, "GitHub returned a repository outside the configured allowlist")
            self._token = token
            self._token_expires_at = expiry
            _audit("token_minted")
            return token

    async def _api_json(
        self, method: str, path: str, *, body: dict[str, Any] | None = None,
        max_bytes: int = MAX_API_RESPONSE_BYTES,
    ) -> Any:
        for attempt in range(2):
            token = await self._get_token()
            try:
                return await self._request_json(method, path, token=token, body=body, max_bytes=max_bytes)
            except GitHubAppError as exc:
                if exc.status_code == 401 and attempt == 0:
                    async with self._token_lock:
                        if self._token == token:
                            self._token = None
                            self._token_expires_at = 0.0
                    continue
                raise
        raise GitHubAppError(503, "GitHub API authentication failed")

    def _resolve_repository(self, owner: str, repository: str) -> tuple[str, str, str]:
        full_name = f"{owner}/{repository}"
        canonical = self._allowed.get(full_name.casefold())
        if canonical is None:
            _audit("repository_access_denied", full_name, outcome="denied")
            raise PermissionError("Repository is not in the configured GitHub App allowlist")
        canonical_owner, canonical_repository = canonical.split("/", 1)
        return canonical_owner, canonical_repository, canonical

    @staticmethod
    def _validate_ref(ref: str) -> str:
        if (
            not isinstance(ref, str) or not ref or len(ref) > 255
            or ref.startswith("/") or ref.endswith("/") or "//" in ref or ".." in ref
            or any(char in ref for char in "~^:?*[\\")
            or "@{" in ref or any(ord(char) < 32 for char in ref)
            or any(part in {"", ".", ".."} for part in ref.split("/"))
            or ref.endswith(".lock")
        ):
            raise ValueError("Git reference is invalid")
        return ref

    @staticmethod
    def _validate_path(path: str) -> str:
        if not isinstance(path, str) or len(path) > 1024 or path.startswith("/") or "\\" in path:
            raise ValueError("Repository path is invalid")
        if any(ord(char) < 32 for char in path):
            raise ValueError("Repository path is invalid")
        if path and any(part in {"", ".", ".."} for part in path.split("/")):
            raise ValueError("Repository path is invalid")
        return path

    async def list_repositories(self) -> list[dict[str, Any]]:
        payload = await self._api_json("GET", "/installation/repositories?per_page=100", max_bytes=1_000_000)
        if not isinstance(payload, dict) or not isinstance(payload.get("repositories"), list):
            raise GitHubAppError(502, "GitHub installation repository list is invalid")
        results = []
        for item in payload["repositories"]:
            if not isinstance(item, dict) or not isinstance(item.get("full_name"), str):
                continue
            canonical = self._allowed.get(item["full_name"].casefold())
            if canonical is None:
                continue
            results.append({
                "full_name": canonical, "private": bool(item.get("private", False)),
                "default_branch": item.get("default_branch") if isinstance(item.get("default_branch"), str) else "",
            })
        results.sort(key=lambda item: item["full_name"].casefold())
        _audit("list_repositories")
        return results

    async def status(self) -> dict[str, Any]:
        repositories = await self.list_repositories()
        return {
            "provider": "github_app", "configured": True, "connected": bool(repositories),
            "state": "connected" if repositories else "no_allowed_repositories",
            "permissions": ["contents:read", "metadata:read"], "repositories": repositories,
            "token_expires_at": datetime.fromtimestamp(self._token_expires_at, timezone.utc).isoformat(),
        }

    async def get_tree(self, owner: str, repository: str, ref: str) -> dict[str, Any]:
        owner_name, repository_name, canonical = self._resolve_repository(owner, repository)
        ref = self._validate_ref(ref)
        base = f"/repos/{quote(owner_name, safe='')}/{quote(repository_name, safe='')}"
        commit = await self._api_json("GET", f"{base}/commits/{quote(ref, safe='')}", max_bytes=1_000_000)
        if not isinstance(commit, dict):
            raise GitHubAppError(502, "GitHub commit response is invalid")
        tree_sha = commit.get("commit", {}).get("tree", {}).get("sha")
        if not isinstance(tree_sha, str) or not re.fullmatch(r"[0-9a-fA-F]{40}", tree_sha):
            raise GitHubAppError(502, "GitHub commit response did not contain a valid tree SHA")
        tree = await self._api_json("GET", f"{base}/git/trees/{tree_sha}?recursive=1")
        if not isinstance(tree, dict) or not isinstance(tree.get("tree"), list):
            raise GitHubAppError(502, "GitHub tree response is invalid")
        raw_entries = tree["tree"]
        entries = []
        for item in raw_entries[:MAX_TREE_ENTRIES]:
            if not isinstance(item, dict):
                continue
            path, item_type = item.get("path"), item.get("type")
            if not isinstance(path, str) or len(path) > 1024 or any(ord(char) < 32 for char in path):
                continue
            if item_type not in {"blob", "tree"}:
                continue
            entries.append({
                "path": path, "type": item_type,
                "size": item.get("size") if isinstance(item.get("size"), int) else None,
            })
        _audit("read_tree", canonical, ref)
        return {
            "repository": canonical, "ref": ref,
            "truncated": bool(tree.get("truncated")) or len(raw_entries) > MAX_TREE_ENTRIES,
            "entries": entries,
        }

    async def get_contents(self, owner: str, repository: str, path: str, ref: str | None) -> dict[str, Any]:
        owner_name, repository_name, canonical = self._resolve_repository(owner, repository)
        try:
            path = self._validate_path(path)
            if ref is not None:
                ref = self._validate_ref(ref)
        except ValueError:
            _audit("read_contents", canonical, path, "denied")
            raise
        endpoint = f"/repos/{quote(owner_name, safe='')}/{quote(repository_name, safe='')}/contents"
        if path:
            endpoint += "/" + quote(path, safe="/")
        if ref:
            endpoint += "?" + urlencode({"ref": ref})
        payload = await self._api_json("GET", endpoint, max_bytes=2_000_000)
        if isinstance(payload, list):
            entries = []
            for item in payload[:100]:
                if not isinstance(item, dict) or not isinstance(item.get("path"), str):
                    continue
                entries.append({
                    "name": item.get("name", ""), "path": item["path"],
                    "type": item.get("type", ""),
                    "size": item.get("size") if isinstance(item.get("size"), int) else None,
                })
            _audit("list_directory", canonical, path)
            return {"kind": "directory", "repository": canonical, "path": path, "entries": entries}
        if not isinstance(payload, dict) or payload.get("type") != "file":
            raise GitHubAppError(415, "Only repository directories and regular files are supported")
        size = payload.get("size")
        if not isinstance(size, int) or size < 0 or size > MAX_FILE_BYTES:
            raise GitHubAppError(413, "Repository file exceeds the one-megabyte read limit")
        if payload.get("encoding") != "base64" or not isinstance(payload.get("content"), str):
            raise GitHubAppError(415, "Repository file is not available as bounded base64 text")
        try:
            raw = base64.b64decode(re.sub(r"\s+", "", payload["content"]), validate=True)
        except (ValueError, binascii.Error):
            raise GitHubAppError(502, "GitHub returned invalid file content encoding") from None
        if len(raw) > MAX_FILE_BYTES:
            raise GitHubAppError(413, "Repository file exceeds the one-megabyte read limit")
        try:
            content = raw.decode("utf-8")
        except UnicodeDecodeError:
            raise GitHubAppError(415, "Only UTF-8 text files can be read by the Coder connector") from None
        _audit("read_file", canonical, path)
        return {
            "kind": "file", "repository": canonical, "path": payload.get("path", path),
            "size": len(raw), "encoding": "utf-8", "content": content,
        }

    async def revoke_token(self) -> bool:
        async with self._token_lock:
            token = self._token
            if not token:
                return False
            try:
                async with self._request_semaphore:
                    response = await self._client.request(
                        "DELETE", f"{API_BASE_URL}/installation/token",
                    headers={
                        "Accept": "application/vnd.github+json",
                        "X-GitHub-Api-Version": API_VERSION,
                        "Authorization": f"Bearer {token}",
                    },
                    timeout=10.0, follow_redirects=False,
                )
            except httpx.HTTPError:
                raise GitHubAppError(503, "GitHub token revocation is temporarily unavailable") from None
            self._token = None
            self._token_expires_at = 0.0
            if response.status_code not in {204, 401, 404}:
                raise GitHubAppError(response.status_code, "GitHub token revocation failed")
            _audit("revoke_token", outcome="success" if response.status_code == 204 else "already_expired")
            return response.status_code == 204


def _public_api_error(exc: GitHubAppError) -> HTTPException:
    if exc.status_code in {403, 404, 413, 415}:
        status = exc.status_code
    elif exc.status_code in {401, 429} or exc.status_code >= 500:
        status = 503
    else:
        status = 502
    detail = {
        403: "GitHub App lacks the required read-only repository permissions.",
        404: "GitHub installation or allowlisted repository was not found.",
        413: "Repository file exceeds the configured read limit.",
        415: "Only repository directories and UTF-8 text files can be read.",
        503: "GitHub API is temporarily unavailable.",
    }.get(status, "GitHub App request failed.")
    return HTTPException(status_code=status, detail=detail)


def build_github_app_router(config: Any, authorize: Any) -> APIRouter:
    router = APIRouter()

    def require_connector(request: Request) -> GitHubAppConnector:
        connector = getattr(request.app.state, "github_app_connector", None)
        if not config.github_app_enabled or connector is None:
            raise HTTPException(status_code=503, detail="GitHub App connector is not configured.")
        return connector

    @router.get("/v1/connectors/github/status")
    async def github_status(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        if not config.github_app_enabled:
            return JSONResponse({
                "provider": "github_app", "configured": False, "connected": False,
                "state": "not_configured", "permissions": [], "repositories": [],
            }, headers={"Cache-Control": "no-store"})
        connector = require_connector(request)
        try:
            payload = await connector.status()
        except GitHubAppError as exc:
            state = "permission_denied" if exc.status_code == 403 else "not_installed" if exc.status_code == 404 else "degraded"
            payload = {
                "provider": "github_app", "configured": True, "connected": False,
                "state": state, "permissions": ["contents:read", "metadata:read"], "repositories": [],
            }
        return JSONResponse(payload, headers={"Cache-Control": "no-store"})

    @router.get("/v1/connectors/github/repositories")
    async def github_repositories(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        connector = require_connector(request)
        try:
            repositories = await connector.list_repositories()
        except GitHubAppError as exc:
            raise _public_api_error(exc) from None
        return JSONResponse({"repositories": repositories}, headers={"Cache-Control": "no-store"})

    @router.get("/v1/connectors/github/repositories/{owner}/{repository}/tree")
    async def github_tree(
        owner: str, repository: str, request: Request,
        ref: str = Query(default="main", max_length=255),
        authorization: str | None = Header(default=None),
    ) -> JSONResponse:
        authorize(config, authorization)
        connector = require_connector(request)
        try:
            payload = await connector.get_tree(owner, repository, ref)
        except PermissionError:
            raise HTTPException(status_code=403, detail="Repository is not in the configured allowlist.") from None
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from None
        except GitHubAppError as exc:
            raise _public_api_error(exc) from None
        return JSONResponse(payload, headers={"Cache-Control": "no-store"})

    @router.get("/v1/connectors/github/repositories/{owner}/{repository}/contents")
    async def github_contents(
        owner: str, repository: str, request: Request,
        path: str = Query(default="", max_length=1024),
        ref: str | None = Query(default=None, max_length=255),
        authorization: str | None = Header(default=None),
    ) -> JSONResponse:
        authorize(config, authorization)
        connector = require_connector(request)
        try:
            payload = await connector.get_contents(owner, repository, path, ref)
        except PermissionError:
            raise HTTPException(status_code=403, detail="Repository is not in the configured allowlist.") from None
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from None
        except GitHubAppError as exc:
            raise _public_api_error(exc) from None
        return JSONResponse(payload, headers={"Cache-Control": "no-store"})

    @router.post("/v1/connectors/github/revoke-token")
    async def github_revoke_token(request: Request, authorization: str | None = Header(default=None)) -> JSONResponse:
        authorize(config, authorization)
        connector = require_connector(request)
        try:
            revoked = await connector.revoke_token()
        except GitHubAppError as exc:
            raise _public_api_error(exc) from None
        return JSONResponse({
            "token_revoked": revoked,
            "installation_uninstall_required": True,
            "note": "This revokes the current token only; uninstall the GitHub App on GitHub to fully disconnect.",
        }, headers={"Cache-Control": "no-store"})

    return router
