import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { test } from 'node:test';

import { sitemapEntries, sitemapFiles } from '../src/sitemap.js';
import { createFixture } from './helpers/fixture.js';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin', 'sitelo.js');
const SITE = 'https://example.com';

/** A built page, as far as the sitemap reads one. */
const page = (file, head = '') => ({ file, html: `<html><head>${head}</head><body><main>x</main></body></html>` });

test('sitemapEntries: every page at the URL it is served at, sorted', () => {
  assert.deepEqual(
    sitemapEntries(
      [page('blog/hello/index.html'), page('about/index.html'), page('index.html'), page('docs/routing.html')],
      SITE,
    ),
    [
      { loc: 'https://example.com/' },
      { loc: 'https://example.com/about/' },
      { loc: 'https://example.com/blog/hello/' },
      { loc: 'https://example.com/docs/routing' },
    ],
  );
});

test('sitemapEntries: leaves out 404 pages and pages that say noindex', () => {
  assert.deepEqual(
    sitemapEntries(
      [
        page('index.html'),
        page('404.html'),
        page('de/404.html'),
        page('secret/index.html', '<meta content="noindex, nofollow" name="robots">'),
      ],
      SITE,
    ),
    [{ loc: 'https://example.com/' }],
  );
});

test('sitemapEntries: a canonical on the site wins, and pages naming one canonical are one entry', () => {
  assert.deepEqual(
    sitemapEntries(
      [
        page('docs/index.html', '<link rel="canonical" href="https://example.com/docs">'),
        // A copy of the post, canonicalized to it; the post's own date stands.
        page('amp/hello/index.html', '<link rel="canonical" href="https://example.com/blog/hello/"><meta property="article:modified_time" content="2020-01-01">'),
        page('blog/hello/index.html', '<meta property="article:modified_time" content="2026-10-01">'),
        // Another site's URL may not stand in this sitemap.
        page('syndicated/index.html', '<link rel="canonical" href="https://elsewhere.example/post">'),
      ],
      SITE,
    ),
    [
      { loc: 'https://example.com/blog/hello/', lastmod: '2026-10-01' },
      { loc: 'https://example.com/docs' },
      { loc: 'https://example.com/syndicated/' },
    ],
  );
});

test('sitemapEntries: lastmod from the page, most specific first, never a malformed date', () => {
  const ld = (node) => `<script type="application/ld+json">${JSON.stringify(node)}</script>`;
  const dated = (head) => sitemapEntries([page('post/index.html', head)], SITE)[0].lastmod;

  assert.equal(
    dated('<meta property="article:published_time" content="2026-01-01"><meta property="article:modified_time" content="2026-02-02T10:00:00+01:00">'),
    '2026-02-02T10:00:00+01:00',
  );
  assert.equal(dated('<meta property="article:published_time" content="2026-01-01">'), '2026-01-01');
  assert.equal(dated('<meta property="article:modified_time" content="last Tuesday">'), undefined);

  // JSON-LD: the node that is this page, not the site's or the software's.
  const graph = {
    '@graph': [
      { '@type': 'SoftwareApplication', dateModified: '2020-01-01' },
      { '@type': 'TechArticle', '@id': 'https://example.com/post/#webpage', dateModified: '2026-03-03' },
    ],
  };
  assert.equal(dated(ld(graph)), '2026-03-03');
  // The one page-typed node, when none names the page.
  assert.equal(dated(ld({ '@type': 'BlogPosting', datePublished: '2026-04-04' })), '2026-04-04');
  // Two candidates and nothing to choose between them: no date.
  assert.equal(dated(ld([{ '@type': 'Article', dateModified: '2026-05-05' }, { '@type': 'WebPage', dateModified: '2026-06-06' }])), undefined);
  assert.equal(dated('<script type="application/ld+json">{ not json</script>'), undefined);
});

test('sitemapFiles: one file, or an index over parts past the limit', () => {
  const entries = ['a', 'b', 'c'].map((name) => ({ loc: `${SITE}/${name}/` }));

  assert.deepEqual(sitemapFiles(entries, SITE, 3).map(({ fileName }) => fileName), ['sitemap.xml']);

  const files = sitemapFiles(entries, SITE, 2);
  assert.deepEqual(files.map(({ fileName }) => fileName), ['sitemap.xml', 'sitemap-1.xml', 'sitemap-2.xml']);
  assert.match(files[0].source, /<sitemapindex /);
  assert.match(files[0].source, /<sitemap><loc>https:\/\/example\.com\/sitemap-2\.xml<\/loc><\/sitemap>/);
  assert.equal((files[1].source.match(/<url>/g) ?? []).length, 2);
  assert.equal((files[2].source.match(/<url>/g) ?? []).length, 1);
});

test('sitemapFiles: escapes what XML needs escaped', () => {
  const [{ source }] = sitemapFiles([{ loc: `${SITE}/search/?q=a&b=<c>` }], SITE);
  assert.match(source, /<loc>https:\/\/example\.com\/search\/\?q=a&amp;b=&lt;c&gt;<\/loc>/);
});

async function build(t, setup = () => {}) {
  const dir = createFixture('llms');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  setup(dir);
  await execFileAsync(process.execPath, [cliPath, 'build', '--logLevel', 'error'], { cwd: dir, env: process.env });
  return (file) => fs.readFileSync(path.join(dir, 'dist', file), 'utf8');
}

test('a build writes the sitemap from the pages as built', async (t) => {
  const read = await build(t);

  assert.equal(
    read('sitemap.xml'),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <url><loc>https://example.com/</loc></url>',
      '  <url><loc>https://example.com/about/</loc></url>',
      '  <url><loc>https://example.com/blog/</loc></url>',
      '  <url><loc>https://example.com/blog/hello/</loc><lastmod>2026-10-01T09:30:00Z</lastmod></url>',
      '  <url><loc>https://example.com/blog/tables/</loc></url>',
      '</urlset>',
      '',
    ].join('\n'),
    'served URLs, sorted, dated where the page says, without the noindex page or the 404',
  );
});

test('a sitemap.xml in public/ ships instead, and robots.txt still names it', async (t) => {
  const own = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';
  const read = await build(t, (dir) => {
    fs.mkdirSync(path.join(dir, 'public'));
    fs.writeFileSync(path.join(dir, 'public', 'sitemap.xml'), own);
  });

  assert.equal(read('sitemap.xml'), own);
  assert.match(read('robots.txt'), /^Sitemap: https:\/\/example\.com\/sitemap\.xml$/m);
});
