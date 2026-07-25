import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

process.env.API_PORT = process.env.API_PORT || '3001';
process.env.NODE_ENV = 'development';

const api = spawn(process.execPath, [path.join(root, 'server', 'index.js')], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

const vite = spawn(
  process.execPath,
  [
    path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
    '--host',
    '0.0.0.0',
    '--port',
    '3000',
    '--open',
  ],
  {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  }
);

function shutdown(code = 0) {
  api.kill();
  vite.kill();
  process.exit(code);
}

api.on('exit', (code) => {
  if (code && code !== 0) console.error('API exited', code);
  vite.kill();
  process.exit(code ?? 0);
});

vite.on('exit', (code) => {
  api.kill();
  process.exit(code ?? 0);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
