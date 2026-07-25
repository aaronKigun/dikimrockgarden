const { spawn } = require('child_process');
const { exec } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const URL = `http://localhost:${PORT}`;
const nextBin = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'bin',
  'next'
);

function openBrowser(url) {
  const platform = process.platform;
  if (platform === 'win32') {
    exec(`cmd /c start "" "${url}"`);
  } else if (platform === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
}

function waitForServer(url, attempts = 80) {
  return new Promise((resolve, reject) => {
    let left = attempts;
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        // Ignore accidental stale answers; require a normal response after spawn
        if (res.statusCode && res.statusCode < 500) resolve();
        else {
          left -= 1;
          if (left <= 0) reject(new Error('Dev server did not become ready in time'));
          else setTimeout(tick, 400);
        }
      });
      req.on('error', () => {
        left -= 1;
        if (left <= 0) reject(new Error('Dev server did not become ready in time'));
        else setTimeout(tick, 400);
      });
    };
    // Give Next a moment to bind before first probe
    setTimeout(tick, 800);
  });
}

const next = spawn(
  process.execPath,
  [nextBin, 'dev', '-H', HOST, '-p', String(PORT)],
  {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: process.env,
  }
);

let opened = false;
waitForServer(URL)
  .then(() => {
    if (opened || next.exitCode !== null) return;
    opened = true;
    console.log(`\n> Opening external browser: ${URL}\n`);
    openBrowser(URL);
  })
  .catch((err) => {
    console.warn(err.message);
  });

next.on('exit', (code) => {
  process.exit(code ?? 0);
});
