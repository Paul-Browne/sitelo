/**
 * Serves the files that sitelo-ui's inline event handlers import.
 *
 * The components render `import('/su/menu.js')` into their own event
 * attributes, and an attribute is a string — Vite never sees it, so
 * nothing in the bundler graph will put that file anywhere. This plugin
 * is the other half of the deal: it answers `/su/*.js` in dev, and on a
 * build copies across exactly the modules the generated HTML asks for.
 *
 * The stylesheet `styles()` links is served from the same place and on
 * the same terms — a `<link>` is markup rather than an import, so it
 * needs the same treatment the runtime modules get. So is each sheet an
 * extra links — `grainStyles()` from `sitelo/ui-extras` — since those
 * are one file per component rather than part of `ui.css`.
 *
 * With `prune` on, the sheets are cut down first to the rules the pages
 * can match — see `prune.js`. That too is decided by reading the built
 * HTML, so it happens here and only here: dev serves the whole sheet.
 *
 * It is part of sitelo's default plugin, so a normal project gets this
 * without configuring anything.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_UI_CLIENT_BASE,
  RUNTIME_MODULES,
  uiClientBase,
} from './handlers.js';
import { classesIn, pruneCss } from './prune.js';
import { digestOf, sheetNamed } from './sheet.js';

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

/**
 * What `styles()` — or an extra's `grainStyles()` — can ask for: the
 * sheet's name, with or without its hash.
 *
 * The name is matched lazily, so `ui-fade.css` reads as the core sheet
 * at hash `fade` rather than a sheet called `ui-fade`; a name that is
 * not a sheet at all is caught by {@link sheetNamed} answering `null`.
 */
const CSS_NAME = /^([a-z][a-z0-9-]*?)(?:-[0-9a-f]+)?\.css$/;

/**
 * The sheet a file name asks for, or `null` if it is not one of ours.
 *
 * @param {string} file
 * @returns {ReturnType<typeof sheetNamed>}
 */
function sheetFor(file) {
  const match = CSS_NAME.exec(file);

  return match ? sheetNamed(match[1]) : null;
}

/**
 * The `href` of every stylesheet `<link>` in a page.
 *
 * Element by element rather than a scan for the URL, for the reason
 * {@link eventAttributes} gives: a page that *shows* the tag in a code
 * sample has it as escaped text, and only a real element can be one the
 * browser will go and fetch.
 */
function stylesheetHrefs(html) {
  const found = [];

  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel="?stylesheet"?/i.test(tag)) continue;

    const href = tag.match(/\shref="([^"]*)"/i);

    if (href) found.push(href[1]);
  }

  return found;
}

/**
 * The runtime modules `name` imports, and what those import in turn.
 *
 * An event attribute can only name the module it calls into; a module
 * that shares code with its neighbours pulls the rest in itself, and
 * copying the named one alone would leave the browser asking for a file
 * that is not there. Restricted to {@link RUNTIME_MODULES} for the same
 * reason the dev middleware is: a name is not a path.
 *
 * Anchored to the start of a line, so an `import` written out inside a
 * doc comment's example is not mistaken for one the module makes — the
 * same distinction {@link eventAttributes} draws between a handler and
 * a code sample that shows one.
 *
 * @param {Iterable<string>} named
 * @returns {Set<string>}
 */
function withImports(named) {
  const found = new Set();
  const pending = [...named];

  while (pending.length) {
    const name = pending.pop();

    if (found.has(name)) continue;

    found.add(name);

    const source = fs.readFileSync(
      path.join(RUNTIME_DIR, `${name}.js`),
      'utf8',
    );

    for (const [, dependency] of source.matchAll(
      /^(?:import|export)\s[^\n]*?from '\.\/([\w-]+)\.js'/gm,
    )) {
      if (RUNTIME_MODULES.includes(dependency)) pending.push(dependency);
    }
  }

  return found;
}

/**
 * Every file under `dir` with one of the extensions, as absolute paths.
 *
 * @param {string} dir
 * @param {string[]} extensions
 * @returns {string[]}
 */
function filesUnder(dir, extensions) {
  const found = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) found.push(...filesUnder(full, extensions));
    else if (extensions.some((ext) => entry.name.endsWith(ext))) found.push(full);
  }

  return found;
}

/**
 * A `<style>` that `styles({ inline: true })` — or an extra's — wrote,
 * by the marker each one carries: `data-sitelo-ui` for the core sheet,
 * `data-sitelo-ui-grain` for grain's. The name is checked against the
 * sheets that exist, so `theme()`'s `data-sitelo-ui-theme` is passed by.
 */
const INLINE_SHEET =
  /<style (data-sitelo-ui(?:-([a-z][a-z0-9-]*))?(?:="")?)((?:\s[^>]*)?)>([\s\S]*?)<\/style>/g;

/**
 * The ids on a page that a `popovertarget` points at and that are
 * `modal()` or `drawer()` dialogs — which `popovertarget` no longer opens.
 *
 * Both were popovers until they became `<dialog>` elements, so every
 * trigger written for them said `popovertarget`, and a trigger aimed at a
 * dialog that is not a popover does nothing at all: no error, just a
 * button that stopped working. This finds those, so the build can say so.
 * A `<dialog popover>` of the site's own is a real popover target and is
 * left alone. Element by element, for the reason {@link eventAttributes}
 * gives: a code sample showing the old trigger is escaped text.
 *
 * @param {string} html
 * @returns {string[]}
 */
export function staleDialogTriggers(html) {
  const dialogs = new Set();

  // Quote-aware, because a tag's own handlers can hold a `>`: the dialog's
  // is `…then(m=>m.dismiss(this,event))`.
  for (const [tag] of html.matchAll(/<dialog\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    if (/\spopover(?:[\s=>]|$)/i.test(tag)) continue;
    if (!/\sclass="[^"]*\bsu-(?:modal|drawer)\b/.test(tag)) continue;

    const id = tag.match(/\sid="([^"]*)"/);

    if (id) dialogs.add(id[1]);
  }

  if (!dialogs.size) return [];

  const stale = new Set();

  for (const [tag] of html.matchAll(/<[a-z][a-z0-9-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const id = tag.match(/\spopovertarget="([^"]*)"/)?.[1];

    if (id != null && dialogs.has(id)) stale.add(id);
  }

  return [...stale];
}

/**
 * The warning for one page's stale triggers.
 *
 * @param {string} page
 * @param {string[]} ids
 */
function staleTriggerMessage(page, ids) {
  const list = ids.map((id) => `#${id}`).join(', ');

  return (
    `[sitelo] ${page}: popovertarget points at ${list}, which modal() and drawer() render as a <dialog> now — ` +
    `popovertarget no longer opens it. Use commandfor="…" command="show-modal" to open it, and command="close" ` +
    `in place of popovertargetaction="hide": button({ commandfor: '${ids[0]}', command: 'show-modal' }).`
  );
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
 * The root-relative prefix the runtime answers on, or `null` when it
 * lives on another origin and is nobody here's to account for.
 *
 * Read from the static option rather than {@link uiClientBase}, because
 * the only caller runs while the plugin array is being built — before
 * `config()` has set the environment, and long before a page module
 * could have called `configureUiClient()`. A site that moves the base
 * that late is telling the components, not the bundler.
 *
 * @param {object} [options]
 * @param {string} [options.base]
 * @returns {string | null}
 */
export function uiClientPrefix({ base } = {}) {
  const resolved =
    base ?? process.env.SITELO_UI_BASE ?? DEFAULT_UI_CLIENT_BASE;

  return isExternal(resolved) ? null : normalize(resolved);
}

/**
 * @param {object} [options]
 * @param {string} [options.base] - where the runtime is served from.
 * @param {boolean | { keep?: string[] }} [options.prune] - cut each sheet
 *   the build writes down to the rules its pages can match; `keep` names
 *   classes to treat as present anyway, `su-foo*` for a prefix.
 * @returns {import('vite').Plugin}
 */
export function uiRuntime({ base, prune = false } = {}) {
  let outDir;
  /** @type {{ warn: (message: string) => void }} */
  let logger = { warn: (message) => console.warn(message) };
  let serving = false;
  /** Page and id pairs already warned about, so a reload does not repeat them. */
  const warned = new Set();
  const keep = typeof prune === 'object' && prune ? prune.keep ?? [] : [];

  /**
   * @param {string} page
   * @param {string} html
   */
  const warnAboutTriggers = (page, html) => {
    const ids = staleDialogTriggers(html).filter((id) => !warned.has(`${page}\0${id}`));

    if (!ids.length) return;

    for (const id of ids) warned.add(`${page}\0${id}`);
    logger.warn(staleTriggerMessage(page, ids));
  };

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
      if (config.logger) logger = config.logger;
      serving = config.command === 'serve';
    },

    /*
     * Dev's half of the warning `writeBundle` gives a build: a page is
     * rendered here on request, so this is where it can be read.
     */
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (serving) warnAboutTriggers(ctx?.path ?? '/', html);
      },
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { external, prefix } = target();
        const url = (req.url ?? '').split('?')[0];

        if (external || !url.startsWith(prefix)) return next();

        const file = url.slice(prefix.length);

        /*
         * Any hash, not only the current one: the sheet is read fresh
         * here, so a page still holding the name from before an edit is
         * served the CSS that edit produced rather than a 404.
         */
        const sheet = sheetFor(file);

        if (sheet) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(sheet.stylesheet());
          return;
        }

        const name = file.replace(/\.js$/, '');

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

      if (!outDir || !fs.existsSync(outDir)) return;

      const pages = filesUnder(outDir, ['.html']).map((file) => ({
        file,
        html: fs.readFileSync(file, 'utf8'),
      }));

      for (const { file, html } of pages) {
        warnAboutTriggers(path.relative(outDir, file).split(path.sep).join('/'), html);
      }

      if (external) return;

      const wanted = new Set();
      /** File name → the sheet whose bytes go under it. */
      const sheets = new Map();

      for (const { html } of pages) {
        for (const value of eventAttributes(html)) {
          for (const name of RUNTIME_MODULES) {
            if (value.includes(`${prefix}${name}.js`)) wanted.add(name);
          }
        }

        /*
         * The name the page asks for, not the one `stylesUrl()` would
         * hand back now: a site is free to link the sheet unhashed, and
         * writing anything other than what the markup points at would
         * leave the page asking for a file that is not there.
         */
        for (const href of stylesheetHrefs(html)) {
          if (!href.startsWith(prefix)) continue;

          const name = href.slice(prefix.length);
          const sheet = sheetFor(name);

          if (sheet) sheets.set(name, sheet);
        }
      }

      const dir = path.join(outDir, prefix.slice(1));

      if (wanted.size || sheets.size) fs.mkdirSync(dir, { recursive: true });

      for (const name of withImports(wanted)) {
        fs.copyFileSync(
          path.join(RUNTIME_DIR, `${name}.js`),
          path.join(dir, `${name}.js`),
        );
      }

      if (!prune) {
        for (const [name, sheet] of sheets) {
          fs.writeFileSync(path.join(dir, name), sheet.stylesheet());
        }

        return;
      }

      /*
       * Every class the site can put on a page. The scripts are read after
       * the runtime was copied, so the modules the pages import are among
       * them; a linked sheet is pruned against the whole site, since every
       * page shares it, and an inlined one against its own page.
       *
       * A page is scanned without any sheet it inlined: that is the one
       * place every class in the library is written out, and none of them
       * is on the page for being there.
       */
      const scripts = filesUnder(outDir, ['.js', '.mjs']).map((file) =>
        fs.readFileSync(file, 'utf8'),
      );
      const markup = ({ html }) => html.replace(INLINE_SHEET, '');
      const site = classesIn([...scripts, ...pages.map(markup)], keep);
      const scripted = classesIn(scripts, keep);
      const before = new Map(pages.map(({ file, html }) => [file, html]));

      for (const [name, sheet] of sheets) {
        const css = pruneCss(sheet.stylesheet(), site);
        /*
         * The hash names the bytes, and the bytes just changed: a site that
         * starts using one more component gets one more rule and a new
         * name, so a cache holding the old file `immutable` never serves
         * it for this one. A page that linked the plain name keeps it.
         */
        const written = /-[0-9a-f]+\.css$/.test(name)
          ? name.replace(/-[0-9a-f]+\.css$/, `-${digestOf(css)}.css`)
          : name;

        fs.writeFileSync(path.join(dir, written), css);

        if (written === name) continue;

        for (const page of pages) {
          page.html = page.html.replaceAll(`${prefix}${name}`, `${prefix}${written}`);
        }
      }

      for (const page of pages) {
        const own = classesIn([markup(page)]);
        const has = (className) => own(className) || scripted(className);

        page.html = page.html.replace(INLINE_SHEET, (whole, marker, name, attributes, css) => {
          const sheet = sheetNamed(name ?? 'ui');

          if (!sheet) return whole;

          // The readable sheet has line breaks; the minified one has none.
          const source = sheet.stylesheet({ minify: !css.includes('\n') });

          return `<style ${marker}${attributes}>${pruneCss(source, has)}</style>`;
        });
      }

      for (const { file, html } of pages) {
        if (html !== before.get(file)) fs.writeFileSync(file, html);
      }
    },
  };
}
