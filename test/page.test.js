import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

// By package name, the way a site imports it: this goes through the
// `exports` map, so a typo there fails here rather than in a user's build.
import { definePageModule, escapeHtml } from 'sitelo/page';

import { createFixture } from './helpers/fixture.js';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');

test('escapeHtml: escapes every character that can start markup or end an attribute', () => {
  assert.equal(
    escapeHtml(`<a href="x" title='y'>Tom & Jerry</a>`),
    '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;Tom &amp; Jerry&lt;/a&gt;',
  );
});

test('escapeHtml: escapes an ampersand that is already part of an entity', () => {
  // The text `&lt;` must show as `&lt;`, not as `<`.
  assert.equal(escapeHtml('&lt;'), '&amp;lt;');
});

test('escapeHtml: leaves other text alone', () => {
  const text = 'Plain text, emoji 🎉, accents é, and a / slash';
  assert.equal(escapeHtml(text), text);
  assert.equal(escapeHtml(''), '');
});

test('escapeHtml: converts non-strings the way a template literal does', () => {
  assert.equal(escapeHtml(42), '42');
  assert.equal(escapeHtml(null), 'null');
  assert.equal(escapeHtml(undefined), 'undefined');
  assert.equal(escapeHtml({ toString: () => '<b>' }), '&lt;b&gt;');
});

test('sitelo/page still exports the page helpers beside escapeHtml', () => {
  const mod = { render: () => '' };
  assert.equal(definePageModule(mod), mod);
});

test('a page can import escapeHtml from sitelo/page in a build', async (t) => {
  // The plugin swaps its own page-helper import for a generated module
  // while it loads pages, so check the export survives a real build.
  const fixtureDir = createFixture('escape');
  t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));

  await execFileAsync(process.execPath, [cliPath, 'build'], {
    cwd: fixtureDir,
    env: process.env,
  });

  const html = fs.readFileSync(
    path.join(fixtureDir, 'dist', 'posts', 'hello', 'index.html'),
    'utf8',
  );

  assert.match(
    html,
    /<h1 title="Ada&#39;s &quot;first&quot; post">&lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; friends<\/h1>/,
  );
  assert.doesNotMatch(html, /<script>alert/);
});
