/**
 * `enhance()` through a real build. Nothing here is special-cased by the
 * build: the page links one entry script, the entry's `import()` calls
 * are code-split by the normal asset pipeline, and each enhancement
 * becomes a chunk the browser fetches only when a wrapper asks for it.
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

import { createFixture } from './helpers/fixture.js';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');

test('enhancement modules are built as lazy chunks of the entry script', async () => {
  const fixtureDir = createFixture('enhance');
  const distDir = path.join(fixtureDir, 'dist');

  await execFileAsync(process.execPath, [cliPath, 'build'], { cwd: fixtureDir });

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  assert.match(
    indexHtml,
    /<div data-sitelo-enhance="counter" data-sitelo-props="\{&quot;start&quot;:5\}" data-sitelo-when="visible"><button type="button">Add one<\/button> <output>5<\/output><\/div>/,
    'the page carries the server-rendered markup in its wrapper',
  );
  assert.match(indexHtml, /<script type="module" src="\/enhance\.js">/);

  const entry = fs.readFileSync(path.join(distDir, 'enhance.js'), 'utf8');
  const files = fs.readdirSync(distDir);
  const chunkFor = (marker) =>
    files.find(
      (file) =>
        file.endsWith('.js') &&
        fs.readFileSync(path.join(distDir, file), 'utf8').includes(marker),
    );

  for (const marker of ['counter-module-body', 'clock-module-body']) {
    const chunk = chunkFor(marker);

    assert.ok(chunk, `some chunk holds ${marker}`);
    assert.notEqual(chunk, 'enhance.js', `${marker} is not bundled into the entry`);
    assert.ok(
      entry.includes(`import("./${chunk}")`),
      `the entry imports ${chunk} lazily`,
    );
  }

  assert.equal(
    fs.existsSync(path.join(distDir, 'client')),
    false,
    'the modules are chunks, not entries of their own',
  );
});
