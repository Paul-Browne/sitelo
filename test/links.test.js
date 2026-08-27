import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  candidatePaths,
  collectBrokenLinks,
  formatBrokenLinks,
  normalizeLinkCheckOptions,
  parseInternalLink,
  resolveLinkTarget,
  runLinkCheck,
} from '../src/links.js';

function makeOutDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitelo-links-'));

  for (const [relative, contents] of Object.entries(files)) {
    const full = path.join(dir, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, contents);
  }

  return dir;
}

function page(body) {
  return `<html lang="en"><head><title>t</title></head><body>${body}</body></html>`;
}

async function check(dir, options = {}, base = '/') {
  return collectBrokenLinks({
    root: dir,
    outDir: '.',
    base,
    options: normalizeLinkCheckOptions({ mode: 'warn', ...options }),
  });
}

test('normalizeLinkCheckOptions: shorthands and defaults', () => {
  assert.equal(normalizeLinkCheckOptions(undefined), null);
  assert.equal(normalizeLinkCheckOptions(false), null);

  assert.deepEqual(normalizeLinkCheckOptions(true), {
    mode: 'warn',
    exclude: [],
    checkFragments: false,
  });
  assert.equal(normalizeLinkCheckOptions('error').mode, 'error');
  assert.equal(normalizeLinkCheckOptions({ mode: 'error' }).mode, 'error');
  assert.equal(
    normalizeLinkCheckOptions({ checkFragments: true }).checkFragments,
    true,
  );
});

test('normalizeLinkCheckOptions: rejects invalid values', () => {
  assert.throws(() => normalizeLinkCheckOptions([]), /must be a boolean/);
  assert.throws(() => normalizeLinkCheckOptions('loud'), /must be 'warn' or 'error'/);
  assert.throws(
    () => normalizeLinkCheckOptions({ exclude: [42] }),
    /must be strings or regular expressions/,
  );
});

test('parseInternalLink skips anything not addressing this build', () => {
  for (const href of [
    'https://example.com/x',
    'http://example.com',
    '//cdn.example.com/x',
    'mailto:a@b.com',
    'tel:+123',
    'javascript:void(0)',
    'data:text/plain,hi',
    '',
    '   ',
  ]) {
    assert.equal(parseInternalLink(href), null, `expected ${href} to be skipped`);
  }
});

test('parseInternalLink splits path, query, and fragment', () => {
  assert.deepEqual(parseInternalLink('/about'), {
    pathname: '/about',
    fragment: '',
  });
  assert.deepEqual(parseInternalLink('/about?utm=x'), {
    pathname: '/about',
    fragment: '',
  });
  assert.deepEqual(parseInternalLink('/about#team'), {
    pathname: '/about',
    fragment: 'team',
  });
  assert.deepEqual(parseInternalLink('/a?b=1#c'), {
    pathname: '/a',
    fragment: 'c',
  });
  // Same-page fragment
  assert.deepEqual(parseInternalLink('#intro'), {
    pathname: '',
    fragment: 'intro',
  });
  // Percent-encoded fragments are decoded to match the id attribute
  assert.equal(parseInternalLink('#a%20b').fragment, 'a b');
});

test('resolveLinkTarget handles root-relative, relative, and base paths', () => {
  assert.equal(resolveLinkTarget('/about', 'index.html'), 'about');
  assert.equal(resolveLinkTarget('/', 'index.html'), '');
  assert.equal(resolveLinkTarget('/blog/', 'index.html'), 'blog/');

  // Relative to the page holding the link
  assert.equal(resolveLinkTarget('post', 'blog/index.html'), 'blog/post');
  assert.equal(resolveLinkTarget('./post', 'blog/index.html'), 'blog/post');
  assert.equal(resolveLinkTarget('../about', 'blog/index.html'), 'about');

  // Escaping the output root is not resolvable
  assert.equal(resolveLinkTarget('../secrets', 'index.html'), null);
  assert.equal(resolveLinkTarget('../../x', 'blog/index.html'), null);

  // A based site: links carry the base prefix
  assert.equal(resolveLinkTarget('/repo/about', 'index.html', '/repo/'), 'about');
  // ...and one that does not is pointing off the site altogether
  assert.equal(
    resolveLinkTarget('/about', 'index.html', '/repo/'),
    'outside-base',
  );
});

test('candidatePaths mirrors how a static host resolves a URL', () => {
  assert.deepEqual(candidatePaths(''), ['index.html']);
  // Trailing slash can only be a directory index
  assert.deepEqual(candidatePaths('blog/'), ['blog/index.html']);
  // Otherwise: exact file, clean-url index, or `.html`
  assert.deepEqual(candidatePaths('about'), [
    'about',
    'about/index.html',
    'about.html',
  ]);
});

test('collectBrokenLinks accepts every shape of valid link', async (t) => {
  const dir = makeOutDir({
    'index.html': page(`
      <h2 id="intro">Intro</h2>
      <a href="/about">clean url</a>
      <a href="/blog">dir index</a>
      <a href="/blog/">trailing slash</a>
      <a href="/">root</a>
      <a href="#intro">same page fragment</a>
      <a href="/about?utm=x">query string</a>
      <a href="/paper.pdf">a real file</a>
      <a href="https://example.com/nope">external</a>
      <a href="//cdn.example.com/x">protocol relative</a>
      <a href="mailto:a@b.com">mail</a>
    `),
    'about/index.html': page('<a href="/">home</a>'),
    'blog/index.html': page('<a href="../about">relative up</a>'),
    'paper.pdf': '%PDF-1.4',
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { broken } = await check(dir);

  assert.deepEqual(broken, []);
});

test('collectBrokenLinks reports typos and escapes', async (t) => {
  const dir = makeOutDir({
    'index.html': page(`
      <a href="/abuot">typo</a>
      <a href="/blog/missing">missing</a>
      <a href="../escape">escape</a>
      <a href="/about">fine</a>
    `),
    'about/index.html': page(''),
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { checked, broken } = await check(dir);

  assert.equal(checked, 4);
  assert.deepEqual(
    broken.map((entry) => [entry.href, entry.reason]),
    [
      ['../escape', 'escapes the output directory'],
      ['/abuot', 'no such page'],
      ['/blog/missing', 'no such page'],
    ],
  );
});

test('collectBrokenLinks checks fragments only when asked', async (t) => {
  const dir = makeOutDir({
    'index.html': page(`
      <h2 id="intro">Intro</h2>
      <a href="#intro">good</a>
      <a href="#nope">bad same-page</a>
      <a href="/about#team">good cross-page</a>
      <a href="/about#missing">bad cross-page</a>
    `),
    'about/index.html': page('<h2 id="team">Team</h2>'),
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const off = await check(dir);
  assert.deepEqual(off.broken, []);

  const on = await check(dir, { checkFragments: true });
  assert.deepEqual(
    on.broken.map((entry) => entry.href),
    ['#nope', '/about#missing'],
    'sorted by byte order, not locale collation',
  );
});

test('fragment checking accepts anchor name= targets', async (t) => {
  const dir = makeOutDir({
    'index.html': page('<a name="old-anchor"></a><a href="#old-anchor">x</a>'),
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { broken } = await check(dir, { checkFragments: true });
  assert.deepEqual(broken, []);
});

test('exclude accepts exact strings, globs, and regexes', async (t) => {
  const dir = makeOutDir({
    'index.html': page(`
      <a href="/abuot">typo</a>
      <a href="/blog/missing">missing</a>
      <a href="/draft/x">draft</a>
    `),
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const all = await check(dir);
  assert.equal(all.broken.length, 3);

  const excluded = await check(dir, {
    exclude: ['/abuot', '/blog/**', /^\/draft\//],
  });
  assert.deepEqual(excluded.broken, []);
  // Excluded links are not counted as checked either.
  assert.equal(excluded.checked, 0);
});

test('links are resolved against a based site', async (t) => {
  const dir = makeOutDir({
    'index.html': page('<a href="/repo/about">about</a><a href="/about">no base</a>'),
    'about/index.html': page(''),
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { broken } = await check(dir, {}, '/repo/');

  assert.deepEqual(
    broken.map((entry) => [entry.href, entry.reason]),
    [['/about', 'outside the site base (/repo/)']],
    'a root-relative link without the base leaves the site entirely',
  );
});

test('href entities are decoded before resolving', async (t) => {
  const dir = makeOutDir({
    'index.html': page('<a href="/search?a=1&amp;b=2">search</a>'),
    'search/index.html': page(''),
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const { broken } = await check(dir);
  assert.deepEqual(broken, []);
});

test('collectBrokenLinks returns null when there is no output', async (t) => {
  const dir = makeOutDir({ 'index.html': page('') });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  assert.equal(
    await collectBrokenLinks({
      root: dir,
      outDir: 'missing',
      options: normalizeLinkCheckOptions(true),
    }),
    null,
  );
});

test('formatBrokenLinks groups by page without a log prefix', () => {
  const output = formatBrokenLinks([
    { page: 'index.html', href: '/a', reason: 'no such page' },
    { page: 'index.html', href: '/bb', reason: 'no such page' },
    { page: 'blog/index.html', href: '/c', reason: 'no such fragment' },
  ]);

  assert.match(output, /^3 broken internal links/);
  // The CLI error handler and the warn path add the prefix themselves.
  assert.doesNotMatch(output, /\[sitelo\]/);
  assert.match(output, /index\.html/);
  assert.match(output, /blog\/index\.html/);
  assert.match(output, /\/a\s+-> no such page/);
});

test('runLinkCheck warns or throws according to mode', async (t) => {
  const dir = makeOutDir({ 'index.html': page('<a href="/nope">x</a>') });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const warnings = [];
  const warned = await runLinkCheck({
    root: dir,
    outDir: '.',
    options: normalizeLinkCheckOptions('warn'),
    log: () => {},
    warn: (message) => warnings.push(message),
  });

  assert.equal(warned.broken, 1);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /^\[sitelo\] 1 broken internal link$/m);

  await assert.rejects(
    runLinkCheck({
      root: dir,
      outDir: '.',
      options: normalizeLinkCheckOptions('error'),
      log: () => {},
      warn: () => {},
    }),
    /1 broken internal link/,
  );
});

test('runLinkCheck reports a clean pass', async (t) => {
  const dir = makeOutDir({
    'index.html': page('<a href="/about">about</a>'),
    'about/index.html': page(''),
  });
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

  const logs = [];
  const result = await runLinkCheck({
    root: dir,
    outDir: '.',
    options: normalizeLinkCheckOptions(true),
    log: (message) => logs.push(message),
  });

  assert.deepEqual(result, { checked: 1, broken: 0 });
  assert.match(logs[0], /checked 1 internal link - all good/);
});
