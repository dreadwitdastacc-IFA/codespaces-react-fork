#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/commit-and-push.sh "commit message"
MSG=${1:-"chore: update workspace"}
# Optionally provide PAT_TOKEN to push non-interactively
if [ -n "${PAT_TOKEN:-}" ]; then
  # Replace origin URL with token-authenticated URL for the push only
  ORIG_URL=$(git remote get-url origin)
  AUTH_URL=${ORIG_URL/https:\/\//https:\/\/x-access-token:${PAT_TOKEN}@}
  git add -A
  git commit -m "$MSG" || true
  git push "$AUTH_URL" HEAD
else
  git add -A
  git commit -m "$MSG" || true
  git push
fi
