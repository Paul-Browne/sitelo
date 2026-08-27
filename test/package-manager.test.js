import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  detectFromLockfile,
  detectFromUserAgent,
  detectPackageManager,
  installCommand,
} from '../src/package-manager.js';

function makeTree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-pm-'));

  for (const relative of files) {
    const full = path.join(dir, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, '');
  }

  return dir;
}

test('detectFromUserAgent reads real agent strings', () => {
  // Captured from each manager on this machine.
  assert.equal(
    detectFromUserAgent('npm/11.6.2 node/v24.12.0 darwin arm64 workspaces/false'),
    'npm',
  );
  assert.equal(
    detectFromUserAgent('pnpm/10.29.2 npm/? node/v24.12.0 darwin arm64'),
    'pnpm',
  );
  assert.equal(
    detectFromUserAgent('yarn/4.18.0 npm/? node/v24.12.0 darwin arm64'),
    'yarn',
  );
  assert.equal(detectFromUserAgent('bun/1.1.0 npm/? node/v22.0.0'), 'bun');
});

test('detectFromUserAgent ignores anything it does not recognise', () => {
  // Yarn Classic sets no agent at all, which is why the lockfile
  // fallback has to exist.
  assert.equal(detectFromUserAgent(undefined), null);
  assert.equal(detectFromUserAgent(null), null);
  assert.equal(detectFromUserAgent(''), null);
  assert.equal(detectFromUserAgent('deno/1.0.0'), null);
  assert.equal(detectFromUserAgent('   '), null);
});

test('detectFromLockfile recognises each lockfile', (t) => {
  for (const [file, expected] of [
    ['package-lock.json', 'npm'],
    ['npm-shrinkwrap.json', 'npm'],
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['bun.lock', 'bun'],
    ['bun.lockb', 'bun'],
  ]) {
    const dir = makeTree([file]);
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    assert.equal(detectFromLockfile(dir), expected, `for ${file}`);
  }
});

test('detectFromLockfile walks up to a monorepo root', (t) => {
  const dir = makeTree(['pnpm-lock.yaml', 'packages/site/package.json']);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.equal(detectFromLockfile(path.join(dir, 'packages', 'site')), 'pnpm');
});

test('detectFromLockfile returns null when there is no lockfile', (t) => {
  const dir = makeTree(['package.json']);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  // A temp dir has no lockfile above it either.
  assert.equal(detectFromLockfile(dir), null);
});

test('the user agent wins over the lockfile', (t) => {
  // A pnpm project whose build is being run through npm.
  const dir = makeTree(['pnpm-lock.yaml']);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.equal(
    detectPackageManager({ cwd: dir, userAgent: 'npm/11.6.2 node/v24.12.0' }),
    'npm',
  );
  // Without an agent (Yarn Classic), the lockfile decides. `null` is
  // "no agent"; `undefined` would fall back to the real environment,
  // which `npm test` itself populates.
  assert.equal(detectPackageManager({ cwd: dir, userAgent: null }), 'pnpm');
});

test('detectPackageManager falls back to npm', (t) => {
  const dir = makeTree(['package.json']);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.equal(detectPackageManager({ cwd: dir, userAgent: null }), 'npm');
});

test('installCommand phrases the install for each manager', (t) => {
  const cases = [
    ['npm/11.6.2 node/v24', 'npm install -D sharp'],
    ['pnpm/10.29.2 npm/? node/v24', 'pnpm add -D sharp'],
    ['yarn/4.18.0 npm/? node/v24', 'yarn add -D sharp'],
    ['bun/1.1.0 npm/? node/v22', 'bun add -d sharp'],
  ];

  const dir = makeTree(['package.json']);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  for (const [userAgent, expected] of cases) {
    assert.equal(installCommand('sharp', { cwd: dir, userAgent }), expected);
  }
});

test('installCommand handles a Yarn Classic project (no agent, yarn.lock)', (t) => {
  const dir = makeTree(['yarn.lock']);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.equal(
    installCommand('pagefind', { cwd: dir, userAgent: null }),
    'yarn add -D pagefind',
  );
});
