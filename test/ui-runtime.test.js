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

import { staleDialogTriggers, uiClientPrefix, uiRuntime } from '../src/ui/plugin.js';
import * as ui from '../src/ui/index.js';
import { configureUiClient, RUNTIME_MODULES } from '../src/ui/handlers.js';
import { styles, stylesheet, stylesUrl } from '../src/ui/styles.js';
import { grainStylesheet, grainStylesUrl } from '../src/ui-extras/index.js';
import { sheetNamed } from '../src/ui/sheet.js';
import { editableSheet } from './helpers/sheet.js';

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
 * Vite base
 * ------------------------------------------------------------------ */

/**
 * Resolve the plugin's config the way Vite does for a site under `base`,
 * and run `fn` while that base is published; the environment is put back
 * after, so the base cannot leak into a later test.
 */
function underBase(base, fn, { command = 'build', middlewareMode = false, ...options } = {}) {
  const before = { ui: process.env.SITELO_UI_BASE, site: process.env.SITELO_BASE };
  const root = mkdtempSync(path.join(tmpdir(), 'sitelo-ui-'));
  const outDir = path.join(root, 'dist');
  const warnings = [];
  const plugin = makePlugin(options);

  try {
    plugin.configResolved({
      root,
      base,
      command,
      build: { outDir },
      server: { middlewareMode },
      logger: { warn: (message) => warnings.push(message) },
    });

    return fn({ plugin, outDir, warnings, base });
  } finally {
    restoreEnv(before.ui);

    if (before.site === undefined) delete process.env.SITELO_BASE;
    else process.env.SITELO_BASE = before.site;
  }
}

/**
 * A page as html-pages (2.6 and later) writes it under `base`: Vite's
 * base joined onto a root-relative `<link href>` — as the dev server
 * does — or, for a relative base, the path back to the root from `page`.
 * Event attributes are not asset attributes, and are left as they are.
 */
function asBuilt(html, base, page = 'index.html') {
  const depth = page.split('/').length - 1;
  const prefix = base.startsWith('.') ? (depth ? '../'.repeat(depth) : './') : base;

  return html.replace(/(<link\b[^>]*\shref=")\/(?!\/)/g, `$1${prefix}`);
}

/**
 * Render the page the way a site would — after the config is resolved —
 * write it as html-pages would, and run the build half. What landed in
 * `outDir`, and the page as built.
 */
function buildPage(plugin, outDir, base, page = 'index.html') {
  const html = asBuilt(
    ui.styles() + ui.alert({ dismissible: true }, 'hi') + ui.themeToggle(),
    base,
    page,
  );

  mkdirSync(path.dirname(path.join(outDir, page)), { recursive: true });
  writeFileSync(path.join(outDir, page), html);
  plugin.writeBundle();

  const files = readdirSync(outDir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(outDir, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
    .sort();

  return { html, files, sheet: stylesUrl().split('/').pop() };
}

test('under a Vite base, the sheet is linked for the site root and the handlers under the base', () => {
  /*
   * A `<link href>` is an asset attribute, which Vite's dev server and
   * html-pages' build both join the base onto: the page writes it for
   * the root. Nothing rebases an event attribute, so a handler carries
   * the URL the browser asks for.
   */
  underBase('/repo/', () => {
    assert.match(ui.styles(), /href="\/su\/ui-[0-9a-f]+\.css"/);
    assert.ok(ui.alert({ dismissible: true }, 'hi').includes(`import('/repo/su/alert.js')`));
  });

  underBase('/repo/', () => {
    assert.match(ui.styles(), /href="\/su\/ui-[0-9a-f]+\.css"/, 'an explicit base that includes Vite’s too');
  }, { base: '/repo/su/' });
});

test('under a Vite base, the runtime is served beneath it and written to su/', () => {
  // `sitelo build --base /repo/` for a GitHub Pages project site: dist/
  // is served at /repo/, so /repo/su/ is dist/su/.
  underBase('/repo/', ({ plugin, outDir, base }) => {
    const { html, files, sheet } = buildPage(plugin, outDir, base);

    assert.ok(html.includes(`href="/repo/su/${sheet}"`), 'the sheet is linked under the base');
    assert.ok(html.includes(`import('/repo/su/alert.js')`), 'and the handlers import from under it');
    assert.ok(html.includes(`import('/repo/su/theme.js')`));
    assert.deepEqual(files, ['index.html', 'su/alert.js', `su/${sheet}`, 'su/theme.js'].sort());
  });
});

test('an explicit base that includes Vite’s is written without it', () => {
  // The URL is the browser's, base and all; the directory is where that
  // URL lands inside dist/, which is served at the base.
  underBase('/repo/', ({ plugin, outDir, warnings, base }) => {
    const { html, files, sheet } = buildPage(plugin, outDir, base);

    assert.ok(html.includes(`href="/repo/su/${sheet}"`));
    assert.ok(html.includes(`import('/repo/su/alert.js')`));
    assert.deepEqual(files, ['index.html', 'su/alert.js', `su/${sheet}`, 'su/theme.js'].sort());
    assert.deepEqual(warnings, []);
  }, { base: '/repo/su/' });

  underBase('/repo/', ({ plugin, outDir, base }) => {
    const { html, files, sheet } = buildPage(plugin, outDir, base);

    assert.ok(html.includes(`href="/repo/assets/su/${sheet}"`));
    assert.deepEqual(files, ['assets/su/alert.js', `assets/su/${sheet}`, 'assets/su/theme.js', 'index.html'].sort());
  }, { base: '/repo/assets/su/' });
});

test('an explicit base outside Vite’s is written at its whole path, and the build says so', () => {
  underBase('/repo/', ({ plugin, outDir, warnings, base }) => {
    const { html, files, sheet } = buildPage(plugin, outDir, base);

    assert.ok(html.includes(`import('/assets/su/alert.js')`), 'the handlers point where they were told');
    // The link gets the base like any other, which is where the copy is served.
    assert.ok(html.includes(`href="/repo/assets/su/${sheet}"`));
    assert.deepEqual(files, ['assets/su/alert.js', `assets/su/${sheet}`, 'assets/su/theme.js', 'index.html'].sort());
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /uiClient\.base \/assets\/su\/ is outside Vite's base \/repo\//);
    assert.match(warnings[0], /served at \/repo\/assets\/su\//);
  }, { base: '/assets/su/' });
});

test('a full-URL Vite base is the runtime’s too', () => {
  underBase('https://cdn.example/repo/', ({ plugin, outDir, base }) => {
    assert.match(ui.styles(), /href="\/su\/ui-[0-9a-f]+\.css"/, 'written for the root, as html-pages expects');

    const { html, files, sheet } = buildPage(plugin, outDir, base);

    assert.ok(html.includes(`href="https://cdn.example/repo/su/${sheet}"`));
    assert.ok(html.includes(`import('https://cdn.example/repo/su/alert.js')`));
    assert.deepEqual(files, ['index.html', 'su/alert.js', `su/${sheet}`, 'su/theme.js'].sort());
  });
});

test('a relative Vite base leaves the runtime at the root', () => {
  // An event attribute is written once for every page, so it has no path
  // of its own to a runtime that moves with the page.
  underBase('./', ({ plugin, outDir, base }) => {
    const { html, files, sheet } = buildPage(plugin, outDir, base);

    assert.ok(html.includes(`import('/su/alert.js')`));
    assert.ok(html.includes(`href="./su/${sheet}"`), 'html-pages writes the link from the page');
    assert.deepEqual(files, ['index.html', 'su/alert.js', `su/${sheet}`, 'su/theme.js'].sort());
  });
});

test('a relative Vite base still finds the sheet a nested page links', () => {
  underBase('./', ({ plugin, outDir, base }) => {
    const { html, files, sheet } = buildPage(plugin, outDir, base, 'blog/post/index.html');

    assert.ok(html.includes(`href="../../su/${sheet}"`));
    assert.ok(files.includes(`su/${sheet}`), 'the sheet is written where the link resolves');
  });
});

test('html-pages’ page loader does not move the base the build resolved', () => {
  /*
   * A build renders its pages through a second, middleware-mode server
   * made from vite.config, which runs this plugin too if vite.config
   * registers it — and resolves the base as a dev server would, if it
   * sees it at all.
   */
  underBase('/repo/', () => {
    const loader = makePlugin();

    loader.configResolved({ root: '.', base: '/', command: 'serve', build: { outDir: 'dist' }, server: { middlewareMode: true } });

    assert.ok(ui.alert({ dismissible: true }, 'x').includes(`import('/repo/su/alert.js')`));
  });
});

test('uiClientPrefix is from the site root, as html-pages matches externalAssets', () => {
  // html-pages takes Vite's base off a URL before matching it, so both
  // `/repo/su/ui-….css` and `import('/repo/su/alert.js')` arrive as /su/….
  underBase('/repo/', () => {
    assert.equal(uiClientPrefix(), '/su/');
    assert.equal(uiClientPrefix({ base: '/repo/su/' }), '/su/');
    assert.equal(uiClientPrefix({ base: '/assets/su/' }), '/assets/su/', 'outside the base, as written');
  });

  underBase('https://cdn.example/repo/', () => {
    assert.equal(uiClientPrefix(), '/su/', 'the build’s own origin');
    assert.equal(uiClientPrefix({ base: 'https://elsewhere.example/su/' }), null, 'a URL the validator never checks');
  });
});

test('a pruned sheet under a Vite base is renamed where the pages link it', () => {
  underBase('/repo/', ({ plugin, outDir, base }) => {
    const linked = stylesUrl().split('/').pop();

    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      path.join(outDir, 'index.html'),
      asBuilt(`${ui.styles()}<a class="su-btn">x</a>`, base),
    );
    plugin.writeBundle();

    const [written] = readdirSync(path.join(outDir, 'su'));
    const html = readFileSync(path.join(outDir, 'index.html'), 'utf8');

    assert.notEqual(written, linked, 'the hash follows the bytes');
    assert.ok(html.includes(`href="/repo/su/${written}"`), 'and the page follows the file');
    assert.doesNotMatch(readFileSync(path.join(outDir, 'su', written), 'utf8'), /\.su-card\{/);
  }, { prune: true });
});

test('a pruned sheet is renamed however the page reaches it', () => {
  underBase('./', ({ plugin, outDir, base }) => {
    const page = 'blog/post/index.html';

    mkdirSync(path.join(outDir, 'blog', 'post'), { recursive: true });
    writeFileSync(path.join(outDir, page), asBuilt(`${ui.styles()}<a class="su-btn">x</a>`, base, page));
    plugin.writeBundle();

    const [written] = readdirSync(path.join(outDir, 'su'));

    assert.ok(readFileSync(path.join(outDir, page), 'utf8').includes(`href="../../su/${written}"`));
  }, { prune: true });
});

test('under a Vite base, dev answers on the same prefix', () => {
  // The middleware runs before Vite takes the base off a request.
  underBase('/repo/', ({ plugin }) => {
    let middleware;

    plugin.configureServer({ middlewares: { use: (fn) => { middleware = fn; } } });

    const handled = (url) => {
      let passed = false;

      middleware({ url }, { setHeader: () => {}, end: () => {} }, () => { passed = true; });

      return !passed;
    };

    assert.ok(handled('/repo/su/alert.js'));
    assert.ok(handled(`/repo/su/${stylesUrl().split('/').pop()}`));
    assert.ok(!handled('/su/alert.js'), 'the root is not where the pages point');
  }, { command: 'serve' });
});

test('dev answers a prefix outside the base where both the handlers and the link ask', () => {
  underBase('/repo/', ({ plugin }) => {
    let middleware;

    plugin.configureServer({ middlewares: { use: (fn) => { middleware = fn; } } });

    const handled = (url) => {
      let passed = false;

      middleware({ url }, { setHeader: () => {}, end: () => {} }, () => { passed = true; });

      return !passed;
    };

    assert.ok(handled('/assets/su/alert.js'), 'the handlers, as written');
    assert.ok(handled(`/repo/assets/su/${stylesUrl().split('/').pop()}`), 'the link, with the base joined on');
  }, { command: 'serve', base: '/assets/su/' });
});

test('dev leaves the base Vite puts on the sheet alone, and still warns', () => {
  /*
   * Vite's dev server joins its base onto the sheet's root-relative
   * `href`, which is where the middleware answers: there is nothing to
   * take back.
   */
  underBase('/repo/', ({ plugin, warnings }) => {
    const sheet = stylesUrl().split('/').pop();
    const html =
      `<link rel="stylesheet" href="/repo/su/${sheet}">` +
      `<button popovertarget="confirm">Open</button>${ui.modal({ id: 'confirm' }, 'x')}`;
    const out = plugin.transformIndexHtml.handler(html, { path: '/' });

    assert.equal(out ?? html, html);
    assert.equal(warnings.length, 1, 'the stale trigger is still reported');
    assert.match(warnings[0], /popovertarget points at #confirm/);
  }, { command: 'serve' });
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
  for (const url of ['/su/site.css', '/su/ui-xyz.css', '/su/nested/ui.css', '/su/grain-xyz.css', '/su/../ui.css']) {
    assert.ok(request(url).passed, `${url} falls through to Vite`);
  }
});

test('an extra’s sheet is served and written on the same terms as ui.css', () => {
  // Each extra carries its own file — grain.css for grain() — and the
  // plugin knows it by the name in front of the hash.
  for (const name of ['grain.css', grainStylesUrl().split('/').pop(), 'grain-0000000000.css']) {
    const { headers, body, passed } = request(`/su/${name}`);

    assert.ok(!passed, `/su/${name} is handled`);
    assert.equal(headers['Content-Type'], 'text/css; charset=utf-8');
    assert.equal(body, grainStylesheet());
  }

  const core = stylesUrl().split('/').pop();
  const grain = grainStylesUrl().split('/').pop();
  const html = `<link rel="stylesheet" href="/su/${core}"><link rel="stylesheet" href="/su/${grain}">`;
  const { root, outDir } = siteWith(html);
  const plugin = uiRuntime();

  plugin.configResolved({ root, build: { outDir } });
  plugin.writeBundle();

  assert.deepEqual(readdirSync(path.join(outDir, 'su')).sort(), [grain, core].sort());
  assert.equal(readFileSync(path.join(outDir, 'su', core), 'utf8'), stylesheet());
  assert.equal(readFileSync(path.join(outDir, 'su', grain), 'utf8'), grainStylesheet(), 'each file gets its own bytes');
});

test('a preset’s sheet is served and written on the same terms as ui.css', () => {
  const neumorphism = sheetNamed('neumorphism');

  for (const name of ['neumorphism.css', neumorphism.stylesUrl().split('/').pop()]) {
    const { headers, body, passed } = request(`/su/${name}`);

    assert.ok(!passed, `/su/${name} is handled`);
    assert.equal(headers['Content-Type'], 'text/css; charset=utf-8');
    assert.equal(body, neumorphism.stylesheet());
  }

  const { root, outDir } = siteWith(styles({ preset: 'neumorphism' }));
  const plugin = uiRuntime();

  plugin.configResolved({ root, build: { outDir } });
  plugin.writeBundle();

  const preset = neumorphism.stylesUrl().split('/').pop();

  assert.deepEqual(readdirSync(path.join(outDir, 'su')).sort(), [preset, stylesUrl().split('/').pop()].sort());
  assert.equal(readFileSync(path.join(outDir, 'su', preset), 'utf8'), neumorphism.stylesheet());
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

test('the linked name changes with the sheet, so it can be cached forever', () => {
  // Against a private copy of the file: editing the tracked one raced
  // ui.test.js, which reads it. See test/helpers/sheet.js.
  const { sheet, original, edit } = editableSheet(
    'ui',
    new URL('../src/ui/ui.css', import.meta.url),
  );
  const before = sheet.stylesUrl();

  assert.match(before, /^\/su\/ui-[0-9a-f]{8}\.css$/);
  assert.equal(sheet.stylesUrl(), before, 'stable while the sheet is');

  edit(`${original}\n.su-canary{color:red}\n`);

  assert.notEqual(sheet.stylesUrl(), before, 'and moves when it changes');
});

/* ------------------------------------------------------------------ *
 * Pruning
 * ------------------------------------------------------------------ */

/**
 * Build a site of several files with pruning on, and hand back a reader
 * for what ended up on disk.
 */
function prunedSite(files, prune = true) {
  const root = mkdtempSync(path.join(tmpdir(), 'sitelo-ui-'));
  const outDir = path.join(root, 'dist');

  for (const [name, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(outDir, name)), { recursive: true });
    writeFileSync(path.join(outDir, name), content);
  }

  const plugin = uiRuntime({ prune });

  plugin.configResolved({ root, build: { outDir } });
  plugin.writeBundle();

  return {
    read: (name) => readFileSync(path.join(outDir, name), 'utf8'),
    list: (dir = 'su') => readdirSync(path.join(outDir, dir)).sort(),
  };
}

test('with prune on, a linked sheet holds only what the site uses, under a new name', () => {
  const linked = stylesUrl().split('/').pop();
  const site = prunedSite({
    'index.html': `<link rel="stylesheet" href="/su/${linked}"><a class="su-btn su-c-primary">x</a>`,
    'about/index.html': `<link rel="stylesheet" href="/su/${linked}"><div class="su-card">y</div>`,
  });
  const [written] = site.list();
  const css = site.read(`su/${written}`);

  assert.match(written, /^ui-[0-9a-f]{8}\.css$/);
  assert.notEqual(written, linked, 'the hash follows the bytes');

  // The union across pages: what one page uses is in the sheet they share.
  assert.match(css, /\.su-btn\{/);
  assert.match(css, /\.su-card\{/);
  assert.doesNotMatch(css, /\.su-modal/);
  assert.ok(css.length < stylesheet().length / 2);

  // And every page now points at the file that exists.
  for (const page of ['index.html', 'about/index.html']) {
    assert.ok(site.read(page).includes(`/su/${written}`), `${page} was rewritten`);
    assert.ok(!site.read(page).includes(linked), `${page} no longer names the old file`);
  }
});

test('a sheet linked without a hash keeps its name when pruned', () => {
  const site = prunedSite({
    'index.html': '<link rel="stylesheet" href="/su/ui.css"><a class="su-btn">x</a>',
  });

  assert.deepEqual(site.list(), ['ui.css']);
  assert.match(site.read('su/ui.css'), /\.su-btn\{/);
  assert.doesNotMatch(site.read('su/ui.css'), /\.su-card\{/);
});

test('prune off writes the whole sheet, as before', () => {
  const site = prunedSite({ 'index.html': '<link rel="stylesheet" href="/su/ui.css">' }, false);

  assert.equal(site.read('su/ui.css'), stylesheet());
});

test('an inlined sheet is pruned to its own page', () => {
  const site = prunedSite({
    'a.html': `${styles({ inline: true, nonce: 'n1' })}<a class="su-btn">x</a>`,
    'b.html': `${styles({ inline: true, minify: false })}<div class="su-card">y</div>`,
  });
  const a = site.read('a.html');
  const b = site.read('b.html');

  assert.match(a, /^<style data-sitelo-ui="" nonce="n1">/, 'the tag is kept as written');
  assert.match(a, /\.su-btn\{/);
  assert.doesNotMatch(a, /\.su-card\{/);

  // The readable sheet stays readable.
  assert.match(b, /\n\.su-card \{\n/);
  assert.doesNotMatch(b, /\.su-btn/);
  assert.ok(b.length < stylesheet({ minify: false }).length / 2);
});

test('a theme() block is not a sheet to prune', () => {
  const block = '<style data-sitelo-ui-theme="">:root{--su-primary: red}</style>';
  const site = prunedSite({ 'index.html': block });

  assert.equal(site.read('index.html'), block);
});

test('a class a script adds counts as used', () => {
  // The toast runtime builds its classes in a string, and `su-c-` cut
  // off at the template expression keeps the whole palette.
  const site = prunedSite({
    'index.html': '<link rel="stylesheet" href="/su/ui.css"><script type="module" src="/assets/main.js"></script>',
    'assets/main.js': 'node.className=`su-alert su-alert--soft su-c-${color}`',
  });
  const css = site.read('su/ui.css');

  assert.match(css, /\.su-alert\{/);
  assert.match(css, /\.su-c-danger\{/);
  assert.match(css, /\.su-c-success\{/);
});

test('a runtime module the page imports is scanned too', () => {
  // `steps.js` swaps `su-step--complete` and friends onto elements the
  // server rendered without them.
  const html =
    '<link rel="stylesheet" href="/su/ui.css">' +
    '<ol class="su-steps"><li class="su-step"><span class="su-step-marker"></span>' +
    `<button onclick="import('/su/steps.js').then(m=>m.set('f',1))">n</button></li></ol>`;
  const site = prunedSite({ 'index.html': html });
  const css = site.read('su/ui.css');

  assert.match(css, /\.su-step--complete/);
  assert.match(css, /\.su-step--current/);
});

test('keep names classes the build never sees', () => {
  const site = prunedSite(
    { 'index.html': '<link rel="stylesheet" href="/su/ui.css">' },
    { keep: ['su-card', 'su-btn*'] },
  );
  const css = site.read('su/ui.css');

  assert.match(css, /\.su-card\{/);
  assert.match(css, /\.su-btn--soft/);
  assert.doesNotMatch(css, /\.su-modal/);
});

test('a preset’s sheet is pruned on the same terms, tokens kept', () => {
  const site = prunedSite({
    'index.html': `${styles({ preset: 'neumorphism' })}<button class="su-btn su-btn--solid su-c-primary">b</button>`,
  });
  const written = site.list().find((name) => name.startsWith('neumorphism-'));
  const css = site.read(`su/${written}`);

  assert.match(written, /^neumorphism-[0-9a-f]{8}\.css$/);
  assert.match(css, /\.su-btn--solid\{/, 'what the page uses stays');
  assert.doesNotMatch(css, /\.su-slider/, 'what it does not goes');
  assert.match(css, /--su-neu-raised:/, 'and the tokens, which gate on no class, stay');
  assert.ok(site.read('index.html').includes(written), 'the page links the pruned file');
});

test('an extra’s sheet is pruned on the same terms', () => {
  const linked = grainStylesUrl().split('/').pop();
  const site = prunedSite({
    'index.html': `<link rel="stylesheet" href="/su/${linked}"><div class="su-grain">g</div>`,
  });
  const [written] = site.list();

  assert.match(written, /^grain-[0-9a-f]{8}\.css$/);
  assert.match(site.read(`su/${written}`), /\.su-grain\{/);
  assert.ok(site.read('index.html').includes(written));
});

/* ------------------------------------------------------------------ *
 * Modal and drawer triggers
 * ------------------------------------------------------------------ */

test('a button that opens a dialog brings dialog.js into the build', () => {
  const html = ui.button({ commandfor: 'confirm', command: 'show-modal' }, 'Open') + ui.modal({ id: 'confirm' }, 'x');

  assert.deepEqual(copiedFor(html), ['dialog.js']);
});

test('a popovertarget aimed at a modal() or drawer() is found; anything else is not', () => {
  const modal = ui.modal({ id: 'confirm' }, 'x');
  const drawer = ui.drawer({ id: 'nav' }, 'x');

  assert.deepEqual(
    staleDialogTriggers(`<button popovertarget="confirm">Open</button><button popovertarget="nav" popovertargetaction="hide">x</button>${modal}${drawer}`),
    ['confirm', 'nav'],
  );
  // A popover of the site's own is a fine target.
  assert.deepEqual(staleDialogTriggers('<button popovertarget="tip">?</button><div id="tip" popover>Hi</div>'), []);
  assert.deepEqual(
    staleDialogTriggers('<button popovertarget="mine">?</button><dialog id="mine" class="su-modal" popover>x</dialog>'),
    [],
  );
  // The new trigger, and the old one shown in a code sample, are not.
  assert.deepEqual(staleDialogTriggers(`${ui.button({ commandfor: 'confirm', command: 'show-modal' }, 'Open')}${modal}`), []);
  assert.deepEqual(staleDialogTriggers(`<code>&lt;button popovertarget="confirm"&gt;</code>${modal}`), []);
});

test('the build and the dev server warn about a trigger that stopped working', () => {
  const html = `<button popovertarget="confirm">Open</button>${ui.modal({ id: 'confirm' }, 'x')}`;
  const { root, outDir } = siteWith(html);
  const before = process.env.SITELO_UI_BASE;
  const warnings = [];
  const logger = { warn: (message) => warnings.push(message) };

  try {
    const build = makePlugin();
    build.configResolved({ root, build: { outDir }, command: 'build', logger });
    build.transformIndexHtml.handler(html, { path: '/nested/page' });
    assert.deepEqual(warnings, [], 'a build warns once, from the files it wrote');
    build.writeBundle();
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /^\[sitelo\] nested\/page\.html: popovertarget points at #confirm/);
    assert.match(warnings[0], /commandfor: 'confirm', command: 'show-modal'/);

    const dev = makePlugin();
    dev.configResolved({ root, build: { outDir }, command: 'serve', logger });
    dev.transformIndexHtml.handler(html, { path: '/nested/page' });
    dev.transformIndexHtml.handler(html, { path: '/nested/page' });
    assert.equal(warnings.length, 2, 'once per page, not once per reload');
  } finally {
    restoreEnv(before);
  }
});
