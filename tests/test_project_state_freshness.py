from __future__ import annotations

import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.request import Request

from scripts.check_project_state_freshness import (
    RejectRedirectHandler,
    REQUIRED_REFRESH_PATHS,
    check_main_checkpoint,
    compare_queues,
    validate_github_api_url,
    github_get_json,
    validate_handoff_policy,
    validate_control_plane_docs,
    validate_orchestrator_links,
    validate_snapshot,
)

MAIN_SHA = "a" * 40
FUNCTIONAL_SHA = "b" * 40


def snapshot():
    return {
        "schema_version": 1,
        "repository": "DorpNay/skills-github-pages",
        "captured_at": "2026-10-29",
        "checkpoint": {
            "main_sha": MAIN_SHA,
            "main_commit_subject": "docs: checkpoint",
            "main_commit_date": "2026-10-28T05:36:59Z",
            "last_functional_checkpoint_sha": FUNCTIONAL_SHA,
            "open_pull_requests": [78, 80],
            "open_issues": [88, 90],
        },
    }


class GithubApiUrlTests(unittest.TestCase):
    def test_github_api_redirects_are_never_followed(self):
        handler = RejectRedirectHandler()
        request = Request("https://api.github.com/repos/owner/repo/commits/main")
        redirected = handler.redirect_request(
            request, None, 302, "Found", {}, "https://attacker.example/collect"
        )
        self.assertIsNone(redirected)

    def test_accepts_only_github_rest_repository_urls(self):
        url = "https://api.github.com/repos/DorpNay/skills-github-pages/pulls?state=open&per_page=100"
        self.assertEqual(validate_github_api_url(url), url)

    def test_rejects_file_custom_http_and_untrusted_hosts(self):
        for url in (
            "file:///etc/passwd",
            "http://api.github.com/repos/owner/repo",
            "https://example.com/repos/owner/repo",
            "https://api.github.com.evil.example/repos/owner/repo",
            "https://user@api.github.com/repos/owner/repo",
            "https://api.github.com:444/repos/owner/repo",
            "https://api.github.com/admin",
            "https://api.github.com/repos/../admin",
        ):
            with self.subTest(url=url), self.assertRaises(ValueError):
                validate_github_api_url(url)

    def test_json_fetch_rejects_file_scheme_before_network_access(self):
        with self.assertRaises(ValueError):
            github_get_json("file:///etc/passwd", None)


class SnapshotSchemaTests(unittest.TestCase):
    def test_valid_snapshot(self):
        self.assertEqual(validate_snapshot(snapshot(), "DorpNay/skills-github-pages"), [])

    def test_rejects_duplicate_ids(self):
        value = snapshot()
        value["checkpoint"]["open_pull_requests"] = [78, 78, 80]
        errors = validate_snapshot(value)
        self.assertTrue(any("duplicate IDs" in error for error in errors))

    def test_rejects_unsorted_ids(self):
        value = snapshot()
        value["checkpoint"]["open_pull_requests"] = [80, 78]
        errors = validate_snapshot(value)
        self.assertTrue(any("sorted ascending" in error for error in errors))

    def test_rejects_wrong_repository(self):
        errors = validate_snapshot(snapshot(), "other/repo")
        self.assertTrue(any("does not match" in error for error in errors))

    def test_functional_main_may_equal_last_functional_checkpoint(self):
        value = snapshot()
        value["checkpoint"]["last_functional_checkpoint_sha"] = MAIN_SHA
        value["interpretation"] = {"last_main_commit_is_documentation_only": False}
        self.assertEqual(validate_snapshot(value, "DorpNay/skills-github-pages"), [])

    def test_documentation_only_main_must_distinguish_functional_checkpoint(self):
        value = snapshot()
        value["checkpoint"]["last_functional_checkpoint_sha"] = MAIN_SHA
        value["interpretation"] = {"last_main_commit_is_documentation_only": True}
        self.assertTrue(any("documentation-only checkpoint" in error for error in validate_snapshot(value)))


class QueueComparisonTests(unittest.TestCase):
    def test_exact_queue_passes_and_excludes_only_current_pr(self):
        errors = compare_queues([78, 80], [88, 90], [78, 80, 105], [88, 90], exclude_pr=105)
        self.assertEqual(errors, [])

    def test_unexpected_and_missing_items_are_explicit(self):
        errors = compare_queues([78, 80], [88], [80, 81], [89])
        self.assertTrue(any("open PR queue changed" in error and "missing from live GitHub: [78]" in error and "new in live GitHub: [81]" in error for error in errors))
        self.assertTrue(any("open issue queue changed" in error and "missing from live GitHub: [88]" in error and "new in live GitHub: [89]" in error for error in errors))

    def test_exclusion_does_not_mutate_expected_snapshot(self):
        expected = [78, 80]
        compare_queues(expected, [], [78, 80, 105], [], exclude_pr=105)
        self.assertEqual(expected, [78, 80])


class HandoffPolicyTests(unittest.TestCase):
    def test_owner_intent_drives_routing_without_a_default_pr(self):
        oledue = "The latest explicit owner request takes priority. Do not default to any PR. Match an open PR only when its scope matches."
        agents = "Read OLEDUE.md when the owner sends `oledue`."
        self.assertEqual(validate_handoff_policy(oledue, agents), [])

    def test_rejects_hard_coded_pr_131_fallback(self):
        oledue = "Otherwise default to Landing 2.0 in PR #131."
        agents = "Read OLEDUE.md when the owner sends `oledue`."
        errors = validate_handoff_policy(oledue, agents)
        self.assertTrue(any("hard-coded PR #131 fallback" in error for error in errors))

    def test_requires_owner_intent_and_agents_entrypoint(self):
        errors = validate_handoff_policy("Choose the default branch.", "No handoff trigger here.")
        self.assertTrue(any("latest explicit owner request" in error for error in errors))
        self.assertTrue(any("no-default-PR" in error for error in errors))
        self.assertTrue(any("AGENTS.md" in error for error in errors))








class OrchestratorLinkTests(unittest.TestCase):
    def test_all_local_links_must_resolve_inside_repository(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "docs").mkdir()
            (root / "docs" / "roadmap.md").write_text("# roadmap", encoding="utf-8")
            valid = "[roadmap](docs/roadmap.md) [external](https://example.com)"
            self.assertEqual(validate_orchestrator_links(root, valid), [])

            invalid = "[missing](docs/missing.md) [escape](../outside.md)"
            errors = validate_orchestrator_links(root, invalid)
            self.assertTrue(any("does not exist" in error for error in errors))
            self.assertTrue(any("escapes repository root" in error for error in errors))


class ControlPlaneContractTests(unittest.TestCase):
    def documents(self):
        oledue = (
            "Session Sync Capsule. Latest explicit owner request. Do not default to any PR. "
            "Stage-zero record before the first change. Owner approval gates."
        )
        agents = "Read OLEDUE.md when the owner sends `oledue`. Latest explicit owner request. Do not default to any PR."
        orienter = "Document roles. Open PR queue: #1. GitHub live state is authoritative."
        state = """  orientation_control_plane:
    responsibilities:
      owner_handoff: "OLEDUE.md"
      quick_navigation: "ORIENTER.md"
      structured_state: "docs/PROJECT_STATE.yaml"
      machine_checkpoint: "docs/project-state-snapshot.json"
      executor_contract: "AGENTS.md"
      strategy: "docs/IMPLEMENTATION_ROADMAP_RU.md"
      single_task_inventory: "docs/MASTER_TASK_REGISTRY_RU.md"
      append_only_stage_evidence: "docs/VOLLEY_LOG.md"
      live_repository_truth: "GitHub API"
last_volley: "V-TEST-001"
"""
        snapshot_value = {"last_volley": "V-TEST-001"}
        volley = "V-TEST-001"
        orchestrator = """# aLandi — PROJECT ORCHESTRATOR
INTEL.md
docs/OPEN_SOURCE_TRIAGE_RU.md
docs/TECHNIQUE_REGISTER_RU.md
docs/IMPLEMENTATION_ROADMAP_RU.md
docs/MASTER_TASK_REGISTRY_RU.md
ORCH-001 INTAKE-001
## 5. Task intake: record first
## 3.4 Artifact preservation policy
## 6. Cleanup and optimization
"""
        return oledue, agents, orienter, state, snapshot_value, volley, orchestrator

    def test_complete_control_plane_and_stage_record_pass(self):
        self.assertEqual(validate_control_plane_docs(*self.documents()), [])

    def test_missing_role_and_stale_volley_fail_closed(self):
        oledue, agents, orienter, state, snapshot_value, volley, orchestrator = self.documents()
        state = state.replace('      owner_handoff: "OLEDUE.md"\n', "")
        snapshot_value["last_volley"] = "V-STALE"
        errors = validate_control_plane_docs(oledue, agents, orienter, state, snapshot_value, volley, orchestrator)
        self.assertTrue(any("orientation_control_plane.owner_handoff" in error for error in errors))
        self.assertTrue(any("last_volley must match" in error for error in errors))

    def test_orchestrator_is_required_and_must_index_canonical_catalogs(self):
        oledue, agents, orienter, state, snapshot_value, volley, orchestrator = self.documents()
        orchestrator = orchestrator.replace("INTEL.md", "")
        errors = validate_control_plane_docs(oledue, agents, orienter, state, snapshot_value, volley, orchestrator)
        self.assertTrue(any("PROJECT_ORCHESTRATOR_RU.md" in error and "intel.md" in error for error in errors))


class MainCheckpointTests(unittest.TestCase):
    def test_pull_request_requires_exact_live_main_sha(self):
        value = snapshot()
        self.assertEqual(check_main_checkpoint(value, {"sha": MAIN_SHA, "parents": []}, "pull_request"), [])
        self.assertTrue(check_main_checkpoint(value, {"sha": "c" * 40}, "pull_request"))

    def test_main_accepts_the_direct_state_refresh_commit(self):
        value = snapshot()
        commit = {
            "sha": "c" * 40,
            "parents": [{"sha": MAIN_SHA}],
            "files": [{"filename": path} for path in REQUIRED_REFRESH_PATHS],
        }
        self.assertEqual(check_main_checkpoint(value, commit, "main"), [])

    def test_main_rejects_unrelated_or_incomplete_commit(self):
        value = snapshot()
        unrelated = {"sha": "c" * 40, "parents": [{"sha": MAIN_SHA}], "files": [{"filename": "index.md"}]}
        later = {"sha": "d" * 40, "parents": [{"sha": "c" * 40}], "files": [{"filename": path} for path in REQUIRED_REFRESH_PATHS]}
        self.assertTrue(check_main_checkpoint(value, unrelated, "main"))
        self.assertTrue(check_main_checkpoint(value, later, "main"))


if __name__ == "__main__":
    unittest.main()
