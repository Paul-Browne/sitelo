/**
 * What the docs site writes for crawlers and answer engines: the JSON-LD in
 * every page head, the Markdown copies of the English pages, the sitemap and
 * the two `llms` files.
 *
 * None of it is visible on the page, so nothing but a test notices when it
 * goes wrong — a description that closes its own `<script>`, a 404 back in
 * the sitemap, a code tab that drops out of the Markdown. Lives in the
 * library's suite for the same reason `docs-locales.test.js` does: `npm test`
 * is what CI runs on every push.
 */
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { pageToMarkdown } from '../docs/plugins/html-to-markdown.js';
import { machineReadable } from '../docs/plugins/machine-readable.js';
import { pageDates } from '../docs/src/lib/last-modified.js';
import { structuredData } from '../docs/src/lib/seo.js';

const context = {
  pageUrl: 'https://sitelo.dev/docs/routing',
  siteUrl: 'https://sitelo.dev',
};

const toMarkdown = (main) =>
  pageToMarkdown(`<html><body>${main}</body></html>`, context);

test('markdown keeps prose, code and tables and drops the controls', () => {
  const markdown = toMarkdown(
    '<main class="docs-main" data-pagefind-body="">' +
      '<h1>Routing</h1>' +
      '<nav class="docs-toc"><ul><li><a href="#a">A</a></li></ul></nav>' +
      '<p>Routes come from <code>src/</code>, see <a href="/docs/data">data</a> and <a href="#table">the table</a>.</p>' +
      '<div class="ui-demo"><div class="ui-demo-preview" data-pagefind-ignore=""><h3>Demo card</h3></div>' +
      '<div class="code-glow"><pre class="code language-bash" data-label="project"><code class="language-bash">src/\n  <span class="token">index</span>.ht.js &lt;- home</code></pre>' +
      '<button class="code-copy" type="button">Copy</button></div></div>' +
      '<h2 id="table">Route table</h2>' +
      '<table><thead><tr><th>File</th><th>URL</th></tr></thead>' +
      '<tbody><tr><td><code>a|b.ht.js</code></td><td>/a</td></tr></tbody></table>' +
      '</main>',
  );

  assert.equal(
    markdown,
    [
      '# Routing',
      '',
      'Routes come from `src/`, see [data](https://sitelo.dev/docs/data) and [the table](https://sitelo.dev/docs/routing#table).',
      '',
      '`project`',
      '',
      '```bash',
      'src/',
      '  index.ht.js <- home',
      '```',
      '',
      '## Route table',
      '',
      '| File | URL |',
      '| --- | --- |',
      '| `a\\|b.ht.js` | /a |',
      '',
    ].join('\n'),
  );
});

test('markdown keeps every code tab, each named by its tab', () => {
  const markdown = toMarkdown(
    '<main><div class="code-tabs code-glow" data-code-tabs="">' +
      '<div class="code-tabs-nav" role="tablist">' +
      '<button role="tab" aria-controls="p-template">Template literal</button>' +
      '<button role="tab" aria-controls="p-ht">ht.js<span class="code-tabs-badge">recommended</span></button>' +
      '</div><div class="code-tabs-panels">' +
      '<div role="tabpanel" id="p-template" hidden=""><pre class="code language-javascript" data-label="src/a.ht.js"><code>one</code></pre></div>' +
      '<div role="tabpanel" id="p-ht"><pre class="code language-javascript" data-label="src/a.ht.js"><code>two</code></pre></div>' +
      '</div></div></main>',
  );

  assert.match(markdown, /`src\/a\.ht\.js — Template literal`\n\n```javascript\none\n```/);
  assert.match(markdown, /`src\/a\.ht\.js — ht\.js \(recommended\)`\n\n```javascript\ntwo\n```/);
  assert.doesNotMatch(markdown, /^Template literal$/m, 'the tab strip itself is a control');
});

test('markdown reads an attribute value with a ">" in it', () => {
  const markdown = toMarkdown(
    '<main><div title="the <details> element"><p>After</p></div></main>',
  );
  assert.equal(markdown, 'After\n');
});

test('markdown is undefined for a page with no <main>', () => {
  assert.equal(pageToMarkdown('<html><body><p>x</p></body></html>', context), undefined);
});

test('structured data parses, and cannot close its own script', () => {
  const tag = structuredData({
    kind: 'article',
    url: 'https://sitelo.dev/ui/accordion',
    lang: 'en',
    title: 'Accordion · sitelo UI',
    heading: 'Accordion',
    description: 'Built on the browser’s own <details></script>',
    crumbs: [
      { name: 'sitelo', url: 'https://sitelo.dev/' },
      { name: 'UI', url: 'https://sitelo.dev/ui' },
      { name: 'Accordion', url: 'https://sitelo.dev/ui/accordion' },
    ],
  });

  const json = /^<script type="application\/ld\+json">(.*)<\/script>$/s.exec(tag)?.[1];
  assert.ok(json, 'one script element, closed exactly once');
  assert.doesNotMatch(json, /</);

  const graph = JSON.parse(json)['@graph'];
  const page = graph.find((node) => node['@type'] === 'TechArticle');
  assert.equal(page.headline, 'Accordion');
  assert.equal(page.description, 'Built on the browser’s own <details></script>');

  const trail = graph.find((node) => node['@type'] === 'BreadcrumbList');
  assert.deepEqual(
    trail.itemListElement.map((item) => [item.position, item.name]),
    [[1, 'sitelo'], [2, 'UI'], [3, 'Accordion']],
  );
});

test('the home page has no breadcrumb trail', () => {
  const tag = structuredData({
    kind: 'home',
    url: 'https://sitelo.dev/',
    lang: 'en',
    title: 'sitelo',
    description: 'Static sites.',
    crumbs: [{ name: 'sitelo', url: 'https://sitelo.dev/' }],
  });
  const graph = JSON.parse(tag.replace(/^<script[^>]*>|<\/script>$/g, ''))['@graph'];

  assert.equal(graph.some((node) => node['@type'] === 'BreadcrumbList'), false);
  assert.equal(graph.find((node) => node['@type'] === 'WebPage').breadcrumb, undefined);
});

test('page dates are absent, or ordered', () => {
  assert.equal(pageDates('/no/such/page'), undefined);

  // CI checks out one commit, where there are deliberately no dates at all.
  const dates = pageDates('/docs/routing');
  if (dates) {
    assert.ok(Date.parse(dates.published) <= Date.parse(dates.modified));
  }
});

/** A rendered page, as far as the plugin reads one. */
function page({ route, noindex = false, markdown = false, description, main }) {
  const head = [
    `<meta name="description" content="${description}">`,
    noindex ? '<meta name="robots" content="noindex">' : '',
    noindex ? '' : `<link rel="canonical" href="https://sitelo.dev${route}">`,
    markdown ? `<link rel="alternate" type="text/markdown" href="${route}.md">` : '',
  ].join('');
  return { type: 'asset', source: `<html><head>${head}</head><body><main>${main}</main></body></html>` };
}

test('the build writes the sitemap, the markdown copies and both llms files', () => {
  const publicDir = mkdtempSync(path.join(os.tmpdir(), 'sitelo-docs-'));
  writeFileSync(path.join(publicDir, 'llms.txt'), '# sitelo\n\n> Static sites.\n');

  const bundle = {
    'docs/routing.html': page({
      route: '/docs/routing',
      markdown: true,
      description: 'File-based routing.',
      main: '<h1>Routing</h1><p>Routes.</p>',
    }),
    'docs.html': page({
      route: '/docs',
      markdown: true,
      description: 'Install &amp; go.',
      main: '<h1>Getting started</h1><p>Install.</p>',
    }),
    'de/docs/routing.html': page({
      route: '/de/docs/routing',
      description: 'Routing auf Deutsch.',
      main: '<h1>Routing</h1>',
    }),
    'de/404.html': page({
      route: '/de/404',
      noindex: true,
      description: 'Diese Seite existiert nicht.',
      main: '<h1>404</h1>',
    }),
    'sitemap.xml': { type: 'asset', source: 'the plugin’s own' },
  };

  const plugin = machineReadable();
  plugin.configResolved({ publicDir });

  const emitted = new Map();
  plugin.generateBundle.handler.call(
    { emitFile: ({ fileName, source }) => emitted.set(fileName, source) },
    {},
    bundle,
  );

  const sitemap = bundle['sitemap.xml'].source;
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc),
    [
      'https://sitelo.dev/de/docs/routing',
      'https://sitelo.dev/docs',
      'https://sitelo.dev/docs/routing',
    ],
    'indexable pages only, sorted',
  );

  assert.deepEqual(
    [...emitted.keys()].sort(),
    ['docs.md', 'docs/routing.md', 'llms-full.txt', 'llms.txt'],
    'a markdown copy for each page that advertises one, and no other',
  );
  assert.equal(
    emitted.get('docs.md'),
    '# Getting started\n\n> Install & go.\n\nInstall.\n',
  );

  const llms = emitted.get('llms.txt');
  assert.ok(llms.startsWith('# sitelo\n\n> Static sites.\n\n## Docs\n'));
  assert.ok(
    llms.indexOf('[Getting started](https://sitelo.dev/docs.md): Install & go.') <
      llms.indexOf('[Routing](https://sitelo.dev/docs/routing.md): File-based routing.'),
    'listed in sidebar order',
  );
  assert.match(llms, /## Optional\n\n- \[Everything in one file\]\(https:\/\/sitelo\.dev\/llms-full\.txt\)/);

  const full = emitted.get('llms-full.txt');
  assert.match(full, /URL: https:\/\/sitelo\.dev\/docs\n\n# Getting started/);
  assert.match(full, /URL: https:\/\/sitelo\.dev\/docs\/routing\n\n# Routing/);
});
