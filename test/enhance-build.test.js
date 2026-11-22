/**
 * `enhance()` through a real build. The page links one entry script, the
 * entry's `import()` calls are code-split by the normal asset pipeline,
 * and each enhancement becomes a chunk the browser fetches only when an
 * element asks for it. The build also checks that every name a page uses
 * is registered.
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

/** Build a fresh copy of the fixture after `setup` edits it; stdout and stderr together. */
async function build(setup = () => {}) {
  const fixtureDir = createFixture('enhance');
  setup(fixtureDir);

  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [cliPath, 'build'], {
      cwd: fixtureDir,
    });

    return { ok: true, output: stdout + stderr, distDir: path.join(fixtureDir, 'dist') };
  } catch (error) {
    return { ok: false, output: `${error.stdout}${error.stderr}`, distDir: path.join(fixtureDir, 'dist') };
  }
}

/** Swap `from` for `to` in a fixture file. */
function edit(fixtureDir, file, from, to) {
  const full = path.join(fixtureDir, file);
  const source = fs.readFileSync(full, 'utf8');

  assert.ok(source.includes(from), `${file} contains ${from}`);
  fs.writeFileSync(full, source.replace(from, to));
}

test('enhancement modules are built as lazy chunks of the entry script', async () => {
  const { ok, output, distDir } = await build();
  assert.ok(ok, output);

  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  assert.match(
    indexHtml,
    /<div data-sitelo-enhance="counter" data-sitelo-when="visible"><button type="button">Add one<\/button> <output>5<\/output><\/div>/,
    'the page carries the server-rendered markup in its wrapper',
  );
  assert.match(
    indexHtml,
    /<time data-sitelo-enhance="clock" data-sitelo-props="\{&quot;format&quot;:&quot;short&quot;\}">build time<\/time>/,
    'enhanceAttributes() puts the attributes on the page’s own element',
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

test('a page that names an unregistered enhancement fails the build', async () => {
  const { ok, output, distDir } = await build((dir) => {
    edit(dir, 'src/index.ht.js', `'counter',`, `'countr',`);
  });

  assert.equal(ok, false, 'the build fails');
  assert.match(
    output,
    /index\.html uses enhancement "countr", which no mountEnhancements\(\) call registers\. Did you mean "counter"\? Registered: clock, counter\./,
  );
  assert.doesNotMatch(output, /only-in-a-code-sample/, 'a code sample is not a use');
  assert.equal(fs.existsSync(path.join(distDir, 'index.html')), false, 'nothing is written');
});

test('missingAssets: warn turns the failure into a warning', async () => {
  const { ok, output } = await build((dir) => {
    edit(dir, 'src/index.ht.js', `'counter',`, `'countr',`);
    edit(dir, 'sitelo.config.js', `site:`, `missingAssets: 'warn',\n  site:`);
  });

  assert.ok(ok, output);
  assert.match(output, /index\.html uses enhancement "countr"/);
});

test('a map put together at runtime is not checked', async () => {
  const { ok, output } = await build((dir) => {
    edit(dir, 'src/index.ht.js', `'counter',`, `'countr',`);
    edit(
      dir,
      'src/enhance.ts',
      'mountEnhancements({',
      'const extra = {}\n\nmountEnhancements({\n  ...extra,',
    );
  });

  assert.ok(ok, output);
  assert.doesNotMatch(output, /countr/);
});
