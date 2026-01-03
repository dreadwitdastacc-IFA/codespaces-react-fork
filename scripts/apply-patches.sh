#!/usr/bin/env bash
set -euo pipefail
# Apply all patches in ./patches in order
for p in patches/*.patch; do
  echo "Applying $p"
  git apply --index "$p" || { echo "Failed to apply $p"; exit 1; }
done
echo "Patches applied. Commit changes as needed."
