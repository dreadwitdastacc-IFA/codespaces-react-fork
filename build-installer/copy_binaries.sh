#!/usr/bin/env bash
# Copy prebuilt Windows node-pty artifacts into the installer folder.
# Usage: ./copy_binaries.sh <path-to-windows-build-output>

set -euo pipefail
SRC=${1:-}
if [ -z "$SRC" ]; then
  echo "Usage: $0 <path-to-windows-build-output>"
  exit 2
fi
DST="$(pwd)/resources/app/node_modules.asar.unpacked/node-pty/build/Release"
mkdir -p "$DST"
cp -v "$SRC"/winpty.dll "$DST/" || true
cp -v "$SRC"/winpty-agent.exe "$DST/" || true
cp -v "$SRC"/conpty.node "$DST/" || true
cp -v "$SRC"/conpty_console_list.node "$DST/" || true

echo "Done. Verify the files in $DST"
