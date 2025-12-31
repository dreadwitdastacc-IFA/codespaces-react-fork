Installer placeholders

This folder contains placeholder Windows native binaries required by the packaged Electron app.

Paths:
- resources/app/node_modules.asar.unpacked/node-pty/build/Release/
  - winpty.dll
  - winpty-agent.exe
  - conpty.node
  - conpty_console_list.node

Before building a Windows installer, replace these placeholder files with the actual artifacts produced by building `node-pty` on Windows (matching the Electron/N-API version).

Quick steps to produce real artifacts:
1. On Windows (matching target Electron ABI), run `npm install` and build native modules or use prebuilt binaries.
2. Copy the resulting files into this folder, preserving filenames.

Helper script is provided to copy files into place if you have them locally.
