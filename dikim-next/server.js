const { spawn } = require("child_process");

// Use 'node' directly to run the Next.js CLI instead of 'npx'
const child = spawn("node", ["node_modules/next/dist/bin/next", "start"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("close", (code) => process.exit(code));