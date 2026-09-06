import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { uiRuntime } from '../src/ui/plugin.js';
import { configureUiClient, RUNTIME_MODULES } from '../src/ui/handlers.js';

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
  assert.ok(!request('/su/tabs.js?t=123').passed);
});

test('an absolute base leaves the dev server alone', () => {
  assert.ok(request('/su/tabs.js', { base: 'https://cdn.example/su/' }).passed);
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
      { url: '/assets/su/tabs.js' },
      { setHeader: () => {}, end: () => {} },
      () => { handled = false; },
    );

    assert.ok(handled, 'the moved URL is served');
  } finally {
    configureUiClient({ base: null });
  }
});
