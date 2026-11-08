#!/usr/bin/env node
/**
 * Require immutable full commit SHA references for every external GitHub Action
 * and reusable workflow in .github/workflows. Local and Docker actions are
 * handled separately because they do not use Git refs in this form.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const workflowDir = ".github/workflows";
const useLine = /^([ \t]*)(?:-\s*)?uses:\s*(.*)$/gm;
const immutableSha = /^[0-9a-f]{40}$/i;

/**
 * Return diagnostics for external action references that are not pinned to a
 * full commit SHA. Handles quoted values and YAML folded/literal block scalars.
 */
export function findUnpinnedActionRefs(source, filename = "<workflow>") {
  const problems = [];
  for (const match of source.matchAll(useLine)) {
    const indentation = match[1].length;
    const line = source.slice(0, match.index).split("\n").length;
    let ref = match[2].trim();

    if (/^[>|][+-]?$/.test(ref)) {
      const afterKey = match.index + match[0].length;
      const blockLines = [];
      for (const blockLine of source.slice(afterKey).split("\n")) {
        if (!blockLine.trim()) continue;
        const blockIndent = blockLine.match(/^[ \t]*/)[0].length;
        if (blockIndent <= indentation) break;
        blockLines.push(blockLine.trim());
      }
      ref = blockLines.join(" ").trim();
    } else {
      ref = ref.replace(/\s+#.*$/, "").trim();
      if (/^(['"]).*\1$/.test(ref)) ref = ref.slice(1, -1);
    }

    if (!ref || ref.startsWith("./") || ref.startsWith("docker://")) continue;
    const at = ref.lastIndexOf("@");
    const revision = at >= 0 ? ref.slice(at + 1) : "";
    if (!immutableSha.test(revision)) problems.push(filename + ":" + line + ": " + ref);
  }
  return problems;
}

function run() {
  const workflowFiles = readdirSync(workflowDir)
    .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
    .sort();
  const problems = [];
  for (const file of workflowFiles) {
    const source = readFileSync(join(workflowDir, file), "utf8");
    problems.push(...findUnpinnedActionRefs(source, file));
  }

  if (problems.length) {
    console.error("External actions and reusable workflows must be pinned to a full 40-character commit SHA:");
    for (const problem of problems) console.error("  - " + problem);
    process.exitCode = 1;
  } else {
    console.log("Action pinning check passed: " + workflowFiles.length + " workflow files inspected.");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) run();
