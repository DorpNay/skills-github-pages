from __future__ import annotations

import unittest

from scripts.check_project_state_freshness import (
    REQUIRED_REFRESH_PATHS,
    check_main_checkpoint,
    compare_queues,
    validate_github_api_url,
    github_get_json,
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
