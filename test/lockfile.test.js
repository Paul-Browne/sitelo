import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

/*
 * `npm ci` refuses a lockfile that references a package it does not
 * list, and in CI that refusal comes before any test runs — so a broken
 * lockfile never shows up as a failing test, only as a red install step
 * after the push. This asks npm the same question here, first.
 *
 * It has broken the same way three times — d4ff060, bd118de and 92281ec
 * — which is why `.githooks/pre-push` runs this file on its own: a
 * local install rewrote package-lock.json without @emnapi/core and
 * @emnapi/runtime. Those are what the wasm32 fallbacks of sharp and of
 * knip's oxc bindings depend on, and npm skips installing them on a Mac,
 * so a tree that never had them can talk npm into dropping them. Two of
 * the examples had lost them the same way. `npm install
 * --package-lock-only`, run beside the lockfile, writes them back.
 *
 * Against a copy of the files alone, so a checkout's node_modules — the
 * tree that leads npm astray — has no say in the answer. A dry run reads
 * the lockfile and fetches nothing.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Every npm lockfile in the repository, as a directory relative to the root. */
const projects = [
  '.',
  ...fs
    .readdirSync(path.join(ROOT, 'examples'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join('examples', entry.name))
    .filter((dir) => fs.existsSync(path.join(ROOT, dir, 'package-lock.json'))),
];

for (const project of projects) {
  test(`npm ci accepts ${path.join(project, 'package-lock.json')}`, (t) => {
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-lockfile-'));

    t.after(() => fs.rmSync(copy, { recursive: true, force: true }));

    /*
     * The examples depend on `sitelo` as `file:../..`, so each keeps its
     * place under a copy of the root's package.json: that is the link its
     * lockfile records.
     */
    fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(copy, 'package.json'));

    const dir = path.join(copy, project);

    fs.mkdirSync(dir, { recursive: true });

    for (const file of ['package.json', 'package-lock.json']) {
      fs.copyFileSync(path.join(ROOT, project, file), path.join(dir, file));
    }

    const result = spawnSync('npm', ['ci', '--dry-run', '--ignore-scripts', '--no-audit', '--no-fund'], {
      cwd: dir,
      encoding: 'utf8',
      timeout: 60_000,
    });

    assert.equal(
      result.status,
      0,
      `npm ci would refuse it — \`npm install --package-lock-only\` in ${project} rewrites it:\n` +
        (result.stderr || result.error?.message || ''),
    );
  });
}
