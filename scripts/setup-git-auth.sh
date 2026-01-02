#!/usr/bin/env bash
set -euo pipefail
# Setup this repo to use the shipped Node credential helper.
# Usage: run from the repository or in Codespaces after pulling the repo.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HELPER="$REPO_ROOT/scripts/git-credential-node.js"

if [ ! -f "$HELPER" ]; then
  echo "Missing helper script: $HELPER"
  exit 1
fi

git config --global credential.helper "!node $HELPER"

cat <<EOF
Configured Git to use the project's credential helper:
  $HELPER

To provide credentials for interactive sessions, set environment variables:
  export GIT_AUTH_USERNAME=your-username
  export GIT_AUTH_PASSWORD=your-token-or-password

In Codespaces, add repository secrets or use the built-in GitHub authentication instead.
EOF
