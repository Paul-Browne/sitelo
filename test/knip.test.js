import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { knipConfig } from '../src/knip.js';
import { createFixture } from './helpers/fixture.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const knipBin = path.join(rootDir, 'node_modules', 'knip', 'bin', 'knip.js');

/** The eight page extensions, as the one pattern the config emits. */
const DEFAULT_PAGES =
  'src/**/*.{ht.js,html.js,ht.ts,html.ts,ht.jsx,html.jsx,ht.tsx,html.tsx}!';

function makeSite(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-knip-'));

  for (const [relative, content] of Object.entries(files)) {
    const full = path.join(dir, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }

  return dir;
}

/** Run `fn` with `dir` as the working directory, then put it back. */
async function within(dir, fn) {
  const previous = process.cwd();
  process.chdir(dir);

  try {
    return await fn();
  } finally {
    process.chdir(previous);
  }
}

test('knipConfig: a site with no config file gets the defaults', async () => {
  const dir = makeSite({ 'src/index.ht.js': '' });

  const config = await within(dir, () => knipConfig());

  assert.deepEqual(config, { entry: [DEFAULT_PAGES] });
});

test('knipConfig: islands are an entry only when the directory exists', async () => {
  const dir = makeSite({ 'src/index.ht.js': '', 'src/islands/clock.js': '' });

  const config = await within(dir, () => knipConfig());

  assert.deepEqual(config, {
    entry: [DEFAULT_PAGES, 'src/islands/*.{js,mjs,cjs,ts}!'],
  });
});

test('knipConfig: reads pagesDir, pageExtensions and exclude the way the build does', async () => {
  const dir = makeSite({
    'sitelo.config.js': `export default {
      pagesDir: 'site',
      pageExtensions: ['.ht.js', '.page.ts'],
      exclude: 'site/drafts/**',
      lighthouse: { include: ['*.html'], exclude: ['404.html'] },
    }`,
    'site/index.ht.js': '',
  });

  const config = await within(dir, () => knipConfig());

  assert.deepEqual(config, {
    entry: ['site/**/*.{ht.js,page.ts}!', '!site/drafts/**', 'sitelo.config.js'],
  });
});

test('knipConfig: include replaces the extension-derived pattern', async () => {
  const dir = makeSite({
    'sitelo.config.mjs': `export default { include: ['pages/**/*.ht.js', 'landing.ht.js'] }`,
  });

  const config = await within(dir, () => knipConfig());

  assert.deepEqual(config, {
    entry: ['pages/**/*.ht.js!', 'landing.ht.js!', 'sitelo.config.mjs'],
  });
});

test('knipConfig: a single custom extension needs no braces', async () => {
  const dir = makeSite({
    'sitelo.config.js': `export default { pageExtensions: ['.page.js'] }`,
  });

  const config = await within(dir, () => knipConfig());

  assert.equal(config.entry[0], 'src/**/*.page.js!');
});

test('knipConfig: extra entries and other knip options pass through', async () => {
  const dir = makeSite({ 'src/index.ht.js': '' });

  const config = await within(dir, () =>
    knipConfig({ entry: 'src/js/app.js!', ignore: ['legacy/**'] }),
  );

  assert.deepEqual(config, {
    entry: [DEFAULT_PAGES, 'src/js/app.js!'],
    ignore: ['legacy/**'],
  });
});

test('knipConfig: patterns are relative to where knip runs, not the site', async () => {
  const dir = makeSite({
    'site/sitelo.config.js': `export default { root: 'www', pagesDir: 'pages' }`,
    'site/www/pages/index.ht.js': '',
    'site/www/pages/islands/clock.js': '',
  });

  const config = await within(dir, () => knipConfig({ root: 'site' }));

  assert.deepEqual(config, {
    entry: [
      'site/www/pages/**/*.{ht.js,html.js,ht.ts,html.ts,ht.jsx,html.jsx,ht.tsx,html.tsx}!',
      'site/www/pages/islands/*.{js,mjs,cjs,ts}!',
      'site/sitelo.config.js',
    ],
  });
});

test('knipConfig: a config that is not an object is an error', async () => {
  const dir = makeSite({ 'sitelo.config.js': `export default 'nope'` });

  await assert.rejects(
    within(dir, () => knipConfig()),
    /sitelo\.config\.js must export a configuration object/,
  );
});

test('knip itself reports only the files nothing reaches', () => {
  const dir = createFixture('knip');

  // What `npm install` would leave behind: this package, under its name.
  fs.mkdirSync(path.join(dir, 'node_modules'));
  fs.symlinkSync(rootDir, path.join(dir, 'node_modules', 'sitelo'), 'dir');
  fs.writeFileSync(
    path.join(dir, 'knip.js'),
    "import { knipConfig } from 'sitelo/knip'\n\nexport default knipConfig()\n",
  );

  const result = spawnSync(
    process.execPath,
    [knipBin, '--no-progress', '--reporter', 'json'],
    { cwd: dir, encoding: 'utf8' },
  );

  assert.equal(result.status, 1, result.stderr);

  const report = JSON.parse(result.stdout);
  const unusedFiles = report.issues.flatMap((issue) => issue.files.map((file) => file.name)).sort();
  const otherIssues = report.issues.flatMap((issue) =>
    Object.entries(issue)
      .filter(([key, value]) => key !== 'file' && key !== 'files' && value.length > 0)
      .map(([key]) => `${issue.file}: ${key}`),
  );

  // The excluded draft and the module nothing imports; not a page, an
  // island, the config file, or the layout the pages share.
  assert.deepEqual(unusedFiles, ['site/drafts/pears.ht.js', 'site/lib/orphan.js']);
  assert.deepEqual(otherIssues, []);
});
