import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = resolve(root, 'scripts/audit-inline-js.mjs');
const fixture = resolve(root, 'tests/fixtures/inline-js-audit.html');
const malformedFixture = resolve(root, 'tests/fixtures/inline-js-audit-malformed.html');

function runAudit(input) {
  return spawnSync(process.execPath, [script, input, '--json'], {
    cwd: root,
    encoding: 'utf8',
    timeout: 10000
  });
}

test('report-only AST audit finds unreferenced functions but preserves dynamic consumers', () => {
  const result = runAudit(fixture);
  assert.equal(result.status, 0, result.stderr || result.stdout || result.error?.message);
  const report = JSON.parse(result.stdout);

  assert.equal(report.mode, 'report-only');
  assert.equal(report.deletionPerformed, false);
  assert.deepEqual(report.candidates.map(item => item.name), ['recursiveOnly', 'unusedCandidate']);
  assert.ok(report.candidates.every(item => item.confidence === 'low' && item.reason.length > 0));
  assert.equal(report.metrics.inlineScriptCount, 2);
  assert.equal(report.metrics.externalScriptCount, 1);
  assert.equal(report.metrics.nonJavaScriptScriptCount, 1);
  assert.equal(report.metrics.dataActionCount, 2);
  assert.ok(report.metrics.inlineJavaScriptBytes > 0);
  assert.ok(report.metrics.astNodeCount > 0);
});

test('malformed inline JavaScript is reported and never produces a deletion action', () => {
  const result = runAudit(malformedFixture);
  assert.equal(result.status, 1, result.stderr || result.stdout || result.error?.message);
  const report = JSON.parse(result.stdout);

  assert.equal(report.mode, 'report-only');
  assert.equal(report.deletionPerformed, false);
  assert.equal(report.parseErrors.length, 1);
  assert.match(report.parseErrors[0].message, /Unexpected token|Unterminated|Unexpected character/i);
});
