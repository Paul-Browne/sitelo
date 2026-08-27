import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import { createFixture } from './helpers/fixture.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');
const fixtureDir = createFixture('basic');

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(url, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`dev server did not start at ${url}`);
}

test('sitelo dev serves islands at /_sitelo/islands/:name', async (t) => {
  const port = await getFreePort();

  const child = spawn(
    process.execPath,
    [cliPath, 'dev', '--port', String(port), '--strictPort', '--logLevel', 'error'],
    { cwd: fixtureDir, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
  );

  t.after(() => {
    child.kill('SIGTERM');
  });

  const base = `http://localhost:${port}`;
  await waitForServer(`${base}/`);

  const props = encodeURIComponent(JSON.stringify({ who: 'tester' }));
  const response = await fetch(`${base}/_sitelo/islands/greeting?props=${props}`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /text\/html/);
  assert.equal(
    await response.text(),
    '<p data-island-test>Hello tester from an island</p>',
  );

  const missing = await fetch(`${base}/_sitelo/islands/does-not-exist`);
  assert.equal(missing.status, 404);
});

test('sitelo preview serves islands at /_sitelo/islands/:name', async (t) => {
  const port = await getFreePort();
  const distDir = path.join(fixtureDir, 'dist');

  t.after(() => {
    try {
      fs.rmSync(distDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  const build = spawn(
    process.execPath,
    [cliPath, 'build', '--logLevel', 'error'],
    { cwd: fixtureDir, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
  );

  const buildCode = await new Promise((resolve) => {
    build.on('exit', resolve);
  });
  assert.equal(buildCode, 0, 'fixture build should succeed');

  const child = spawn(
    process.execPath,
    [
      cliPath,
      'preview',
      '--port',
      String(port),
      '--strictPort',
      '--logLevel',
      'error',
    ],
    { cwd: fixtureDir, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
  );

  t.after(() => {
    child.kill('SIGTERM');
  });

  const base = `http://localhost:${port}`;
  await waitForServer(`${base}/`);

  const props = encodeURIComponent(JSON.stringify({ who: 'preview' }));
  const response = await fetch(
    `${base}/_sitelo/islands/greeting?props=${props}`,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /text\/html/);
  assert.equal(
    await response.text(),
    '<p data-island-test>Hello preview from an island</p>',
  );
});
