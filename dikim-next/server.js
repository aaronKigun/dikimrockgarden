const { spawn } = require("child_process");

const child = spawn("npx", ["next", "start"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("close", (code) => process.exit(code));
