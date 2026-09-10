import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { uiClientPrefix, uiRuntime } from '../src/ui/plugin.js';
import { configureUiClient, RUNTIME_MODULES } from '../src/ui/handlers.js';
import { styles, stylesheet, stylesUrl } from '../src/ui/styles.js';

/** A throwaway outDir holding one page. */
function siteWith(html) {
  const root = mkdtempSync(path.join(tmpdir(), 'sitelo-ui-'));
  const outDir = path.join(root, 'dist');

  mkdirSync(path.join(outDir, 'nested'), { recursive: true });
  writeFileSync(path.join(outDir, 'nested', 'page.html'), html);

  return { root, outDir };
}

/**
 * Construct the plugin and run `config()`, the way Vite does — that hook
 * is what publishes a configured base to the environment the pages read.
 */
function makePlugin(options) {
  const plugin = uiRuntime(options);

  plugin.config();

  return plugin;
}

/** Restore the environment, so a configured base cannot leak into a later test. */
function restoreEnv(before) {
  if (before === undefined) delete process.env.SITELO_UI_BASE;
  else process.env.SITELO_UI_BASE = before;
}

/** Run the plugin's build half and list what it wrote under `base`. */
function copiedFor(html, options) {
  const { root, outDir } = siteWith(html);
  const before = process.env.SITELO_UI_BASE;
  const plugin = makePlugin(options);

  try {
    plugin.configResolved({ root, build: { outDir } });
    plugin.writeBundle();
  } finally {
    restoreEnv(before);
  }

  const dir = (options?.base ?? '/su/').replace(/^\/|\/$/g, '');

  return readdirSync(path.join(outDir, dir), { withFileTypes: true })
    .map((entry) => entry.name)
    .sort();
}

test('the build copies only the modules an event attribute names', () => {
  const html =
    '<button onclick="import(\'/su/alert.js\').then(m=>m.dismiss(this))">x</button>' +
    '<details ontoggle="import(\'/su/menu.js\').then(m=>m.toggled(this))"></details>';

  assert.deepEqual(copiedFor(html), ['alert.js', 'menu.js']);
});

test('a module shown in a code sample is not copied', () => {
  /*
   * The guard for a documentation page: showing a handler in prose must
   * not pull the module into that site's build. Only an attribute can
   * actually run one.
   */
  // Shaped like Prism's output, which is where this bit us.
  const html =
    '<pre class="code language-javascript"><code><span class="token string">' +
    '"import(\'/su/toast.js\').then(m=&gt;m.toast(\'Saved.\'))"</span></code></pre>';
  const { root, outDir } = siteWith(html);
  const plugin = uiRuntime();

  plugin.configResolved({ root, build: { outDir } });
  plugin.writeBundle();

  assert.ok(!readdirSync(outDir).includes('su'), 'nothing was copied');
});

test('a custom base changes both the URL matched and the directory written', () => {
  const html = '<button onclick="import(\'/assets/su/theme.js\').then(m=>m.toggle(this))">x</button>';

  assert.deepEqual(copiedFor(html, { base: '/assets/su/' }), ['theme.js']);
});

test('an absolute base is somebody else’s to serve', () => {
  const html = '<button onclick="import(\'https://cdn.example/su/theme.js\')">x</button>';
  const { root, outDir } = siteWith(html);
  const before = process.env.SITELO_UI_BASE;
  const plugin = makePlugin({ base: 'https://cdn.example/su/' });

  try {
    plugin.configResolved({ root, build: { outDir } });
    plugin.writeBundle();
  } finally {
    restoreEnv(before);
  }

  assert.deepEqual(readdirSync(outDir), ['nested']);
});

/* ------------------------------------------------------------------ *
 * Dev server
 * ------------------------------------------------------------------ */

/** Drive the middleware the plugin installs, and report what it did. */
function request(url, options) {
  const before = process.env.SITELO_UI_BASE;
  const plugin = makePlugin(options);
  let middleware;

  plugin.configureServer({ middlewares: { use: (fn) => { middleware = fn; } } });

  const headers = {};
  let body;
  let passed = false;

  try {
    middleware(
      { url },
      { setHeader: (k, v) => { headers[k] = v; }, end: (value) => { body = value; } },
      () => { passed = true; },
    );
  } finally {
    restoreEnv(before);
  }

  return { headers, body, passed };
}

test('dev serves every module the components can name', () => {
  for (const name of RUNTIME_MODULES) {
    const { headers, body, passed } = request(`/su/${name}.js`);

    assert.ok(!passed, `/su/${name}.js is handled`);
    assert.equal(headers['Content-Type'], 'text/javascript; charset=utf-8');
    assert.match(String(body), /export function/);
  }
});

test('dev passes everything else through', () => {
  // The name check is what keeps this middleware off the rest of the disk.
  for (const url of ['/su/nope.js', '/su/../internal.js', '/index.html', '/subs/a.js']) {
    assert.ok(request(url).passed, `${url} falls through to Vite`);
  }
});

test('a query string still resolves to the module', () => {
  // Vite appends `?t=…` on reload, and the browser would then 404.
  assert.ok(!request('/su/menu.js?t=123').passed);
});

test('an absolute base leaves the dev server alone', () => {
  assert.ok(request('/su/menu.js', { base: 'https://cdn.example/su/' }).passed);
});

test('the plugin follows configureUiClient(), not just its own option', () => {
  /*
   * A page module can move the base after the plugin was constructed. If
   * the plugin captured the old one, it would serve and copy to a path
   * nothing points at any more.
   */
  try {
    configureUiClient({ base: '/assets/su/' });

    const plugin = uiRuntime();
    let middleware;

    plugin.configureServer({ middlewares: { use: (fn) => { middleware = fn; } } });

    let handled = true;

    middleware(
      { url: '/assets/su/menu.js' },
      { setHeader: () => {}, end: () => {} },
      () => { handled = false; },
    );

    assert.ok(handled, 'the moved URL is served');
  } finally {
    configureUiClient({ base: null });
  }
});

test('uiClientPrefix names the prefix the page validator must skip', () => {
  const before = process.env.SITELO_UI_BASE;

  try {
    delete process.env.SITELO_UI_BASE;

    assert.equal(uiClientPrefix(), '/su/', 'the default base');
    assert.equal(uiClientPrefix({ base: '/su/' }), '/su/');

    // A sub-path deploy, however the caller punctuated it. The trailing
    // slash matters: it is what makes the exemption a directory prefix
    // rather than an exact URL.
    assert.equal(uiClientPrefix({ base: 'assets/su' }), '/assets/su/');
    assert.equal(uiClientPrefix({ base: '/app/su' }), '/app/su/');

    /*
     * A runtime on another origin never appears as a root-relative URL in
     * the page, so the validator would not look at it anyway — and naming
     * it would only add a prefix that can never match.
     */
    assert.equal(uiClientPrefix({ base: 'https://cdn.example.com/su/' }), null);
    assert.equal(uiClientPrefix({ base: '//cdn.example.com/su/' }), null);
  } finally {
    restoreEnv(before);
  }
});

test('uiClientPrefix reads a base published to the environment', () => {
  const before = process.env.SITELO_UI_BASE;

  try {
    // What `uiRuntime`'s own config() hook writes for the pages to read.
    process.env.SITELO_UI_BASE = '/env/su/';

    assert.equal(uiClientPrefix(), '/env/su/');
    assert.equal(
      uiClientPrefix({ base: '/explicit/su/' }),
      '/explicit/su/',
      'an explicit option still wins',
    );
  } finally {
    restoreEnv(before);
  }
});

test('the build copies what a module imports, which no attribute names', () => {
  // An event attribute can only name the module it calls into. A module
  // that shares code with its neighbours pulls the rest in itself, and
  // copying the named one alone would leave the browser asking for a
  // file that is not on disk.
  const html = `<button onclick="import('/su/badge.js').then(m=>m.set('x',1))">n</button>`;

  assert.deepEqual(copiedFor(html), ['badge.js', 'helpers.js']);
});

test('a shared dependency is copied once, however many modules want it', () => {
  const html = [
    `<button onclick="import('/su/badge.js').then(m=>m.set('x',1))">n</button>`,
    `<button onclick="import('/su/steps.js').then(m=>m.set('y',1))">n</button>`,
  ].join('');

  assert.deepEqual(copiedFor(html), ['badge.js', 'helpers.js', 'steps.js']);
});

test('a module that imports nothing still brings nothing along', () => {
  const html = `<button onclick="import('/su/alert.js').then(m=>m.dismiss(this))">x</button>`;

  assert.deepEqual(copiedFor(html), ['alert.js']);
});

/* ------------------------------------------------------------------ *
 * Stylesheet
 * ------------------------------------------------------------------ */

test('the build writes the sheet a page links, under the same base', () => {
  const name = stylesUrl().split('/').pop();

  assert.deepEqual(
    copiedFor(`<link rel="stylesheet" href="/su/${name}">`),
    [name],
  );
});

test('the sheet written is the one the link points at', () => {
  const { root, outDir } = siteWith(
    '<link rel="stylesheet" href="/su/ui.css">',
  );
  const plugin = uiRuntime();

  plugin.configResolved({ root, build: { outDir } });
  plugin.writeBundle();

  // Unhashed on purpose: writing the hashed name instead would leave the
  // page asking for a file that is not there.
  assert.equal(readFileSync(path.join(outDir, 'su', 'ui.css'), 'utf8'), stylesheet());
});

test('a link shown in a code sample does not write a sheet', () => {
  const html =
    '<pre class="code"><code>&lt;link rel="stylesheet" href="/su/ui.css"&gt;</code></pre>';
  const { root, outDir } = siteWith(html);
  const plugin = uiRuntime();

  plugin.configResolved({ root, build: { outDir } });
  plugin.writeBundle();

  assert.ok(!readdirSync(outDir).includes('su'), 'nothing was written');
});

test('a link to somebody else’s stylesheet is left alone', () => {
  const html = [
    '<link rel="stylesheet" href="https://fonts.example/inter.css">',
    '<link rel="stylesheet" href="/site.css">',
    '<link rel="preload" as="style" href="/su/ui.css">',
  ].join('');
  const { root, outDir } = siteWith(html);
  const plugin = uiRuntime();

  plugin.configResolved({ root, build: { outDir } });
  plugin.writeBundle();

  assert.ok(!readdirSync(outDir).includes('su'), 'nothing was written');
});

test('dev serves the sheet, hashed or not', () => {
  for (const name of ['ui.css', stylesUrl().split('/').pop(), 'ui-0000000000.css']) {
    const { headers, body, passed } = request(`/su/${name}`);

    assert.ok(!passed, `/su/${name} is handled`);
    assert.equal(headers['Content-Type'], 'text/css; charset=utf-8');
    assert.equal(body, stylesheet());
  }
});

test('dev passes a css name the link cannot have produced through', () => {
  for (const url of ['/su/site.css', '/su/ui-xyz.css', '/su/nested/ui.css']) {
    assert.ok(request(url).passed, `${url} falls through to Vite`);
  }
});

test('styles() points at the base the plugin serves', () => {
  const before = process.env.SITELO_UI_BASE;

  try {
    makePlugin({ base: '/assets/su/' });

    const name = stylesUrl().split('/').pop();

    assert.equal(
      styles(),
      `<link rel="stylesheet" href="/assets/su/${name}">`,
    );
    assert.deepEqual(
      copiedFor(`<link rel="stylesheet" href="/assets/su/${name}">`, {
        base: '/assets/su/',
      }),
      [name],
    );
  } finally {
    restoreEnv(before);
  }
});

test('stylesUrl() is the href styles() carries', () => {
  // A preload hint or a CSP built from one and a link built from the
  // other have to name the same file.
  assert.equal(styles(), `<link rel="stylesheet" href="${stylesUrl()}">`);

  for (const options of [
    { hash: false },
    { base: '/assets/su/' },
    { base: 'https://cdn.example/ui' },
    { base: 'https://cdn.example/ui/', hash: false },
  ]) {
    assert.equal(
      styles(options),
      `<link rel="stylesheet" href="${stylesUrl(options)}">`,
      JSON.stringify(options),
    );
  }

  assert.equal(stylesUrl({ base: '/assets/su' }), stylesUrl({ base: '/assets/su/' }));
  assert.equal(stylesUrl({ hash: false }), '/su/ui.css');
});

test('the linked name changes with the sheet, so it can be cached forever', async () => {
  const source = new URL('../src/ui/ui.css', import.meta.url);
  const original = readFileSync(source, 'utf8');
  const before = stylesUrl();

  assert.match(before, /^\/su\/ui-[0-9a-f]{8}\.css$/);
  assert.equal(stylesUrl(), before, 'stable while the sheet is');

  try {
    // A second apart, because the read is cached on the file's mtime.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    writeFileSync(source, `${original}\n.su-canary{color:red}\n`);

    assert.notEqual(stylesUrl(), before, 'and moves when it changes');
  } finally {
    writeFileSync(source, original);
  }
});
