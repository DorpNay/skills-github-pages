#!/usr/bin/env node
/**
 * Require immutable full commit SHA references for every external GitHub Action
 * and reusable workflow in .github/workflows. Local actions and Docker actions
 * are handled separately because they do not use Git refs in this form.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const workflowDir = ".github/workflows";
const workflowFiles = readdirSync(workflowDir)
  .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
  .sort();
const useLine = /^\s*(?:-\s*)?uses:\s*([^\s#]+)(?:\s+#.*)?$/gm;
const immutableSha = /^[0-9a-f]{40}$/i;
const problems = [];

for (const file of workflowFiles) {
  const source = readFileSync(join(workflowDir, file), "utf8");
  for (const match of source.matchAll(useLine)) {
    const ref = match[1];
    if (ref.startsWith("./") || ref.startsWith("docker://")) continue;
    const at = ref.lastIndexOf("@");
    const revision = at >= 0 ? ref.slice(at + 1) : "";
    if (!immutableSha.test(revision)) {
      const line = source.slice(0, match.index).split("\n").length;
      problems.push(`${file}:${line}: ${ref}`);
    }
  }
}

if (problems.length) {
  console.error("External actions and reusable workflows must be pinned to a full 40-character commit SHA:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`Action pinning check passed: ${workflowFiles.length} workflow files inspected.`);
}
