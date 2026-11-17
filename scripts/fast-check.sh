#!/usr/bin/env bash
set -euo pipefail

# Dependency-free, local-first gate. Run from any directory inside the repository.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

node scripts/check-action-pinning.mjs
node --test tests/check-action-pinning.test.mjs
python -m unittest discover -s tests -p 'test_project_state_freshness.py' -v
node scripts/quality-agents.mjs integrity
node scripts/quality-agents.mjs security
node scripts/quality-agents.mjs context
node --check scripts/provider-smoke.mjs
node --check scripts/provider-smoke-all.mjs
node --check scripts/lightpanda-smoke.mjs
node --check tests/e2e/app.spec.mjs
bash -n scripts/diagnose_model_runtime.sh
git diff --check

printf '\nFAST CHECKS PASSED (no browser download, no network install, no API keys).\n'
