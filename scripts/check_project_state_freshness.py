#!/usr/bin/env python3
"""Fail closed when aLandi's documented checkpoint or GitHub queue is stale."""
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any, Iterable, Sequence
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

class RejectRedirectHandler(HTTPRedirectHandler):
    """Never follow GitHub API redirects; validate each pagination URL explicitly."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


GITHUB_API_OPENER = build_opener(RejectRedirectHandler)


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SNAPSHOT = ROOT / "docs/project-state-snapshot.json"
SHA_RE = re.compile(r"^[0-9a-f]{40}$")
# A state refresh must update the human- and machine-readable checkpoints together.
# The checker, its tests and workflow do not need artificial edits on every refresh.
REQUIRED_REFRESH_PATHS = {
    "ORIENTER.md",
    "project-reference/FILE_ORIENTER_RU.md",
    "docs/PROJECT_STATE.yaml",
    "docs/VOLLEY_LOG.md",
    "docs/project-state-snapshot.json",
}
DOC_PATHS = (
    "ORIENTER.md",
    "project-reference/FILE_ORIENTER_RU.md",
    "docs/PROJECT_STATE.yaml",
    "docs/VOLLEY_LOG.md",
)


def _positive_int_list(value: Any, label: str) -> list[int]:
    if not isinstance(value, list) or any(type(item) is not int or item < 1 for item in value):
        raise ValueError(f"checkpoint.{label} must be a list of positive integer IDs")
    if len(value) != len(set(value)):
        raise ValueError(f"checkpoint.{label} contains duplicate IDs")
    if value != sorted(value):
        raise ValueError(f"checkpoint.{label} must be sorted ascending")
    return value


def validate_snapshot(snapshot: Any, expected_repo: str | None = None) -> list[str]:
    """Return schema errors without performing network requests."""
    errors: list[str] = []
    if not isinstance(snapshot, dict):
        return ["snapshot must be a JSON object"]
    if snapshot.get("schema_version") != 1:
        errors.append("schema_version must equal 1")
    repo = snapshot.get("repository")
    if not isinstance(repo, str) or not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repo):
        errors.append("repository must use owner/name form")
    elif expected_repo and repo != expected_repo:
        errors.append(f"snapshot repository {repo!r} does not match {expected_repo!r}")
    checkpoint = snapshot.get("checkpoint")
    if not isinstance(checkpoint, dict):
        return errors + ["checkpoint must be a JSON object"]
    main_sha = checkpoint.get("main_sha")
    if not isinstance(main_sha, str) or not SHA_RE.fullmatch(main_sha):
        errors.append("checkpoint.main_sha must be a full 40-character lowercase commit SHA")
    functional_sha = checkpoint.get("last_functional_checkpoint_sha")
    if not isinstance(functional_sha, str) or not SHA_RE.fullmatch(functional_sha):
        errors.append("checkpoint.last_functional_checkpoint_sha must be a full commit SHA")
    interpretation = snapshot.get("interpretation", {})
    documentation_only = interpretation.get("last_main_commit_is_documentation_only", True)
    if isinstance(main_sha, str) and isinstance(functional_sha, str) and SHA_RE.fullmatch(main_sha) and SHA_RE.fullmatch(functional_sha):
        if main_sha == functional_sha and documentation_only:
            errors.append("documentation-only checkpoint must distinguish main SHA from last functional checkpoint")
    if not isinstance(checkpoint.get("main_commit_subject"), str) or not checkpoint["main_commit_subject"].strip():
        errors.append("checkpoint.main_commit_subject is required")
    if not isinstance(checkpoint.get("main_commit_date"), str) or not checkpoint["main_commit_date"].strip():
        errors.append("checkpoint.main_commit_date is required")
    try:
        _positive_int_list(checkpoint.get("open_pull_requests"), "open_pull_requests")
    except ValueError as exc:
        errors.append(str(exc))
    try:
        _positive_int_list(checkpoint.get("open_issues"), "open_issues")
    except ValueError as exc:
        errors.append(str(exc))
    return errors


def compare_queues(
    expected_prs: Sequence[int],
    expected_issues: Sequence[int],
    actual_prs: Iterable[int],
    actual_issues: Iterable[int],
    exclude_pr: int | None = None,
) -> list[str]:
    """Compare exact queue IDs; optionally exclude the PR being checked."""
    errors: list[str] = []
    expected_pr_set = set(expected_prs)
    actual_pr_set = set(actual_prs)
    if exclude_pr is not None:
        actual_pr_set.discard(exclude_pr)
    expected_issue_set = set(expected_issues)
    actual_issue_set = set(actual_issues)

    def report(kind: str, expected: set[int], actual: set[int]) -> None:
        missing = sorted(expected - actual)
        unexpected = sorted(actual - expected)
        if missing or unexpected:
            pieces = []
            if missing:
                pieces.append(f"missing from live GitHub: {missing}")
            if unexpected:
                pieces.append(f"new in live GitHub: {unexpected}")
            errors.append(f"open {kind} queue changed ({'; '.join(pieces)})")

    report("PR", expected_pr_set, actual_pr_set)
    report("issue", expected_issue_set, actual_issue_set)
    return errors


def check_main_checkpoint(snapshot: dict[str, Any], live_commit: dict[str, Any], mode: str) -> list[str]:
    """Require exact main on PRs; after merge allow only the snapshot-refresh commit itself."""
    expected = snapshot["checkpoint"]["main_sha"]
    actual = live_commit.get("sha")
    if actual == expected:
        return []
    if mode == "pull_request":
        return [f"main SHA drift: snapshot records {expected}, live main is {actual}; refresh against latest main"]

    parents = [p.get("sha") if isinstance(p, dict) else p for p in live_commit.get("parents", [])]
    changed = {
        item.get("filename") if isinstance(item, dict) else item
        for item in live_commit.get("files", [])
    }
    if parents and parents[0] == expected and REQUIRED_REFRESH_PATHS.issubset(changed):
        return []
    return [
        f"main SHA drift: snapshot records {expected}, live main is {actual}; "
        "only the direct state-refresh commit (with all required state files changed) is allowed after the checkpoint"
    ]


def validate_local_docs(root: Path, snapshot: dict[str, Any]) -> list[str]:
    """Ensure the four human-facing state records refer to this exact snapshot."""
    checkpoint = snapshot["checkpoint"]
    main_sha = checkpoint["main_sha"]
    prs = checkpoint["open_pull_requests"]
    issues = checkpoint["open_issues"]
    errors: list[str] = []
    contents: dict[str, str] = {}
    for relative in DOC_PATHS:
        path = root / relative
        try:
            contents[relative] = path.read_text(encoding="utf-8")
        except OSError as exc:
            errors.append(f"{relative}: cannot read ({type(exc).__name__})")
            continue
        if main_sha not in contents[relative]:
            errors.append(f"{relative}: missing checkpoint main SHA {main_sha}")

    state = contents.get("docs/PROJECT_STATE.yaml", "")
    if not re.search(rf'(?m)^\s+base_main:\s*["\']{re.escape(main_sha)}["\']\s*$', state):
        errors.append("docs/PROJECT_STATE.yaml: root_orienter.base_main does not match snapshot main SHA")
    if not re.search(rf'(?m)^\s+verified_main:\s*["\']{re.escape(main_sha)}["\']\s*$', state):
        errors.append("docs/PROJECT_STATE.yaml: current_checkpoint.verified_main does not match snapshot main SHA")
    for key, count in (
        ("open_prs_at_checkpoint", len(prs)),
        ("open_issues_at_checkpoint", len(issues)),
    ):
        if not re.search(rf"(?m)^\s+{key}:\s*{count}\s*$", state):
            errors.append(f"docs/PROJECT_STATE.yaml: {key} must equal snapshot count {count}")

    queue_marker = f"open PRs ({len(prs)}): {', '.join(f'#{number}' for number in prs)}"
    if queue_marker not in contents.get("project-reference/FILE_ORIENTER_RU.md", ""):
        errors.append("project-reference/FILE_ORIENTER_RU.md: exact open-PR snapshot marker is missing")
    issue_marker = f"open issues ({len(issues)}): {', '.join(f'#{number}' for number in issues)}"
    if issue_marker not in contents.get("project-reference/FILE_ORIENTER_RU.md", ""):
        errors.append("project-reference/FILE_ORIENTER_RU.md: exact open-issue snapshot marker is missing")
    if "V-2026-10-29-RESEARCH-APPLY-001" not in contents.get("docs/VOLLEY_LOG.md", ""):
        errors.append("docs/VOLLEY_LOG.md: missing latest report-application entry")
    orienter = contents.get("ORIENTER.md", "")
    if "**Current main SHA:**" not in orienter or "Open PR queue:" not in orienter:
        errors.append("ORIENTER.md: current checkpoint or queue marker is missing")
    return errors


def _next_link(link_header: str | None) -> str | None:
    if not link_header:
        return None
    for part in link_header.split(","):
        match = re.match(r'\s*<([^>]+)>;\s*rel="next"', part)
        if match:
            return match.group(1)
    return None


def validate_github_api_url(url: str) -> str:
    """Allow only bounded HTTPS GitHub REST repository URLs; reject file/custom schemes."""
    if not isinstance(url, str) or not url or len(url) > 2048:
        raise ValueError("GitHub API URL must be non-empty and bounded")
    try:
        parsed = urlsplit(url)
        port = parsed.port
    except ValueError as exc:
        raise ValueError("GitHub API URL is malformed") from exc
    if (parsed.scheme != "https" or parsed.hostname != "api.github.com"
            or parsed.username or parsed.password or port not in {None, 443}
            or not parsed.path.startswith("/repos/") or parsed.fragment
            or any(part in {".", ".."} for part in parsed.path.split("/"))):
        raise ValueError("GitHub API URL must target an HTTPS /repos/ endpoint on api.github.com")
    return url


def github_get_all(url: str, token: str | None) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    while url:
        url = validate_github_api_url(url)
        request = Request(
            url,
            headers={
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "aLandi-project-state-freshness-check",
                **({"Authorization": f"Bearer {token}"} if token else {}),
            },
        )
        # nosemgrep: python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected
        with GITHUB_API_OPENER.open(request, timeout=20) as response:  # nosec B310 -- URL is allowlisted to api.github.com HTTPS above
            validate_github_api_url(response.geturl())
            page = json.load(response)
            next_url = _next_link(response.headers.get("Link"))
        if not isinstance(page, list):
            raise ValueError(f"GitHub API did not return a list for {url}")
        results.extend(item for item in page if isinstance(item, dict))
        url = next_url or ""
    return results


def github_get_json(url: str, token: str | None) -> Any:
    url = validate_github_api_url(url)
    request = Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "aLandi-project-state-freshness-check",
            **({"Authorization": f"Bearer {token}"} if token else {}),
        },
    )
    # nosemgrep: python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected
    with urlopen(request, timeout=20) as response:  # nosec B310 -- URL is allowlisted to api.github.com HTTPS above
        validate_github_api_url(response.geturl())
        return json.load(response)


def check_live(snapshot: dict[str, Any], mode: str, exclude_pr: int | None, token: str | None) -> list[str]:
    repo = snapshot["repository"]
    api = f"https://api.github.com/repos/{repo}"
    try:
        live_commit = github_get_json(f"{api}/commits/main", token)
        prs_payload = github_get_all(f"{api}/pulls?state=open&per_page=100", token)
        issues_payload = github_get_all(f"{api}/issues?state=open&per_page=100", token)
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, OSError, ValueError) as exc:
        return [f"GitHub API verification failed closed: {type(exc).__name__}: {exc}"]

    errors = check_main_checkpoint(snapshot, live_commit, mode)
    actual_prs = [int(item["number"]) for item in prs_payload if isinstance(item.get("number"), int)]
    actual_issues = [
        int(item["number"])
        for item in issues_payload
        if "pull_request" not in item and isinstance(item.get("number"), int)
    ]
    checkpoint = snapshot["checkpoint"]
    errors.extend(compare_queues(
        checkpoint["open_pull_requests"], checkpoint["open_issues"],
        actual_prs, actual_issues, exclude_pr=exclude_pr if mode == "pull_request" else None,
    ))
    return errors


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--snapshot", type=Path, default=DEFAULT_SNAPSHOT)
    parser.add_argument("--repo", help="Expected GitHub owner/name; defaults to snapshot repository")
    parser.add_argument("--mode", required=True, choices=("pull_request", "main"))
    parser.add_argument("--exclude-pr", type=int, help="Exclude the currently checked PR from the live queue")
    args = parser.parse_args(argv)

    try:
        snapshot = json.loads(args.snapshot.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"PROJECT STATE FRESHNESS FAILED: cannot load snapshot ({type(exc).__name__}: {exc})")
        return 1

    errors = validate_snapshot(snapshot, expected_repo=args.repo or os.environ.get("GITHUB_REPOSITORY"))
    if not errors:
        errors.extend(validate_local_docs(ROOT, snapshot))
    if not errors:
        errors.extend(check_live(snapshot, args.mode, args.exclude_pr, os.environ.get("GITHUB_TOKEN")))

    if errors:
        print("PROJECT STATE FRESHNESS FAILED")
        for error in errors:
            print(f"- {error}")
        print("Refresh the snapshot, orienter, PROJECT_STATE.yaml and VOLLEY_LOG.md together; do not auto-rewrite state from CI.")
        return 1

    checkpoint = snapshot["checkpoint"]
    print(
        "PROJECT STATE FRESHNESS OK: "
        f"main checkpoint {checkpoint['main_sha'][:12]}, "
        f"{len(checkpoint['open_pull_requests'])} open PRs, "
        f"{len(checkpoint['open_issues'])} open issues; mode={args.mode}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
