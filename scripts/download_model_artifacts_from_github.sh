#!/usr/bin/env bash
set -euo pipefail
umask 077

RUN_ID="${1:?Usage: $0 RUN_ID [DESTINATION]}"
DEST="${2:-/srv/alandi/models/imports/${RUN_ID}}"
REPO="DorpNay/skills-github-pages"

command -v gh >/dev/null 2>&1 || { echo "GitHub CLI (gh) is required" >&2; exit 127; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required" >&2; exit 127; }
gh auth status >/dev/null
mkdir -p "$DEST"
chmod 700 "$DEST"

echo "Downloading aLandi model artifacts from workflow run ${RUN_ID}..."
gh run download "$RUN_ID" --repo "$REPO" --dir "$DEST"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
python3 "$SCRIPT_DIR/verify_model_artifacts.py" --root "$DEST"

echo "Verified model artifacts are staged in: $DEST"
echo "The primary Qwen3.5 model is intentionally not part of this artifact run."
