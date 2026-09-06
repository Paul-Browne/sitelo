/**
 * Serves the files that sitelo-ui's inline event handlers import.
 *
 * The components render `import('/su/tabs.js')` into their own event
 * attributes, and an attribute is a string — Vite never sees it, so
 * nothing in the bundler graph will put that file anywhere. This plugin
 * is the other half of the deal: it answers `/su/*.js` in dev, and on a
 * build copies across exactly the modules the generated HTML asks for.
 *
 * It is part of sitelo's default plugin, so a normal project gets this
 * without configuring anything.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { RUNTIME_MODULES, uiClientBase } from './handlers.js';

const RUNTIME_DIR = fileURLToPath(new URL('./runtime/', import.meta.url));

/** A base pointing at another origin is somebody else's to serve. */
function isExternal(base) {
  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(base);
}

/** Always a single leading and trailing slash, so joins are predictable. */
function normalize(base) {
  const withTrailing = base.endsWith('/') ? base : `${base}/`;

  return withTrailing.startsWith('/') ? withTrailing : `/${withTrailing}`;
}

/**
 * The value of every inline event attribute in a page.
 *
 * Scanning for the URL anywhere in the file was the obvious thing and
 * the wrong one: a documentation page that *shows* a handler in a code
 * sample would pull the module into its own build. An attribute is the
 * only place a handler can actually run from, and a code sample is
 * element content, so this cannot confuse the two.
 */
function eventAttributes(html) {
  return [...html.matchAll(/\son[a-z]+="([^"]*)"/g)].map(([, value]) => value);
}

/** Every `.html` file under `dir`, as absolute paths. */
function htmlFiles(dir) {
  const found = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) found.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html')) found.push(full);
  }

  return found;
}

/**
 * Where to serve from, resolved on every use rather than captured.
 *
 * `configureUiClient()` can move it from a page module, which runs long
 * after this plugin was constructed; reading it late is what keeps the
 * two halves pointing at the same place.
 */
function target() {
  const base = uiClientBase();

  return isExternal(base)
    ? { external: true, prefix: base }
    : { external: false, prefix: normalize(base) };
}

/**
 * @param {object} [options]
 * @param {string} [options.base] - where the runtime is served from.
 * @returns {import('vite').Plugin}
 */
export function uiRuntime({ base } = {}) {
  let outDir;

  return {
    name: 'sitelo:ui-runtime',

    config() {
      /*
       * Pages are loaded in their own module graph, so a module-level
       * variable set here would not be the one `handlers.js` reads when
       * a component renders. The environment is the channel both halves
       * share — the same one islands uses for its secret.
       */
      if (base != null) process.env.SITELO_UI_BASE = String(base);
    },

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { external, prefix } = target();
        const url = (req.url ?? '').split('?')[0];

        if (external || !url.startsWith(prefix)) return next();

        const name = url.slice(prefix.length).replace(/\.js$/, '');

        // Anything else under the prefix is the site's own business, and
        // the name check is what keeps this off the rest of the disk.
        if (!RUNTIME_MODULES.includes(name)) return next();

        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.end(fs.readFileSync(path.join(RUNTIME_DIR, `${name}.js`)));
      });
    },

    /*
     * After the HTML is on disk rather than during the bundle: what to
     * copy is decided by reading the pages, and the pages are written by
     * a plugin, not emitted from a module graph this one can inspect.
     */
    writeBundle() {
      const { external, prefix } = target();

      if (external || !outDir || !fs.existsSync(outDir)) return;

      const wanted = new Set();

      for (const file of htmlFiles(outDir)) {
        for (const value of eventAttributes(fs.readFileSync(file, 'utf8'))) {
          for (const name of RUNTIME_MODULES) {
            if (value.includes(`${prefix}${name}.js`)) wanted.add(name);
          }
        }
      }

      if (!wanted.size) return;

      const dir = path.join(outDir, prefix.slice(1));

      fs.mkdirSync(dir, { recursive: true });

      for (const name of wanted) {
        fs.copyFileSync(
          path.join(RUNTIME_DIR, `${name}.js`),
          path.join(dir, `${name}.js`),
        );
      }
    },
  };
}
