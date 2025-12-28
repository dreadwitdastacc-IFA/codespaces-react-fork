#!/usr/bin/env node
"use strict";
function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (d) => (data += d));
    process.stdin.on("end", () => resolve(data));
  });
}

(async function main() {
  const cmd = process.argv[2] || "get";
  const raw = await readStdin();
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const obj = {};
  for (const line of lines) {
    const idx = line.indexOf("=");
    if (idx > -1) obj[line.slice(0, idx)] = line.slice(idx + 1);
  }

  if (cmd === "get") {
    const username = process.env.GIT_AUTH_USERNAME || process.env.GITHUB_ACTOR || "";
    const password = process.env.GIT_AUTH_PASSWORD || process.env.GITHUB_TOKEN || process.env.PAT_TOKEN || "";
    if (username && password) {
      process.stdout.write(`username=${username}\npassword=${password}\n\n`);
      process.exit(0);
    }
    if (password) {
      process.stdout.write(`password=${password}\n\n`);
      process.exit(0);
    }
    process.exit(1);
  }

  // For store/erase just succeed (no-op)
  if (cmd === "store" || cmd === "erase") {
    process.exit(0);
  }

  process.exit(1);
})();
