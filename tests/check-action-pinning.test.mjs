import test from "node:test";
import assert from "node:assert/strict";
import { findUnpinnedActionRefs } from "../scripts/check-action-pinning.mjs";

const sha = "0123456789abcdef0123456789abcdef01234567";

test("accepts pinned plain and quoted action references", () => {
  assert.deepEqual(findUnpinnedActionRefs([
    `- uses: actions/checkout@${sha} # pinned`,
    `- uses: "actions/setup-node@${sha}" # quoted`,
  ].join("\n"), "fixture.yml"), []);
});

test("rejects unpinned references in folded and literal YAML scalars", () => {
  const source = [
    "steps:",
    "  - uses: >-",
    "      actions/checkout@v4",
    "  - uses: |",
    "      actions/setup-node@main",
  ].join("\n");
  assert.deepEqual(findUnpinnedActionRefs(source, "fixture.yml"), [
    "fixture.yml:2: actions/checkout@v4",
    "fixture.yml:4: actions/setup-node@main",
  ]);
});

test("accepts pinned folded and literal scalars before sibling step keys", () => {
  const source = [
    "steps:",
    "  - uses: >-",
    `      actions/checkout@${sha}`,
    "    with:",
    "      fetch-depth: 0",
    "  - uses: |2-",
    `      actions/setup-node@${sha}`,
    "    with:",
    "      node-version: 24",
  ].join("\n");
  assert.deepEqual(findUnpinnedActionRefs(source, "fixture.yml"), []);
});

test("keeps local and Docker actions outside Git SHA pinning", () => {
  assert.deepEqual(findUnpinnedActionRefs([
    "- uses: ./actions/local",
    "- uses: docker://alpine:3.20",
  ].join("\n")), []);
});
