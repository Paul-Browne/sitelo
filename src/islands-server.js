import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isValidIslandName } from './islands.js';

export const DEFAULT_ISLANDS_ENDPOINT = '/_sitelo/islands';

/** Extensions native `import()` can load without a bundler. */
const NATIVE_ISLAND_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);

function pickRenderFunction(value) {
  if (typeof value === 'function') return value;

  if (value && typeof value === 'object') {
    // Module namespace: prefer an explicit `render`, else `default`.
    const candidate = value.render ?? value.default;

    if (typeof candidate === 'function') return candidate;

    // Structured default export: `export default { render() {} }`
    if (
      candidate &&
      typeof candidate === 'object' &&
      typeof candidate.render === 'function'
    ) {
      return candidate.render;
    }
  }

  return null;
}

/**
 * Render one island entry to an HTML fragment string.
 *
 * `entry` may be:
 * - a render function `({ name, props, request }) => string | Promise<string>`
 * - a module (namespace or object) with a `default` or `render` function
 * - a lazy loader `() => import('./islands/x.js')`
 * - a promise resolving to any of the above
 *
 * @param {unknown} entry
 * @param {{ name?: string, props?: Record<string, unknown>, request?: Request }} [context]
 * @returns {Promise<string>}
 */
export async function renderIsland(entry, context = {}) {
  let value = await entry;

  if (typeof value === 'function') {
    const result = await value(context);

    // A lazy loader (`() => import(...)`) returns a module, not HTML.
    if (typeof result === 'string') return result;

    const nested = pickRenderFunction(result);
    if (nested) {
      value = await nested(context);
    } else {
      value = result;
    }
  } else {
    const render = pickRenderFunction(value);
    if (!render) {
      throw new Error(
        `[sitelo] Island${context.name ? ` "${context.name}"` : ''} has no render function. Export a default function that returns an HTML string.`,
      );
    }
    value = await render(context);
  }

  if (typeof value !== 'string') {
    throw new Error(
      `[sitelo] Island${context.name ? ` "${context.name}"` : ''} must return an HTML string, got ${typeof value}.`,
    );
  }

  return value;
}

export function parseIslandProps(raw) {
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    throw new Error('[sitelo] Invalid island props: expected a JSON object.');
  }
}

/**
 * Build an islands map from every native-loadable module in a directory
 * (`*.js` / `*.mjs` / `*.cjs`). TypeScript islands stay supported in
 * `sitelo` (dev) via Vite; for preview and Node hosts, ship `.js` or
 * compile first.
 *
 * @param {string} islandsDir absolute path to `src/islands`
 * @returns {Record<string, () => Promise<unknown>>}
 */
export function createIslandsFromDirectory(islandsDir) {
  /** @type {Record<string, () => Promise<unknown>>} */
  const islands = {};

  if (!fs.existsSync(islandsDir)) return islands;

  for (const entry of fs.readdirSync(islandsDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (!NATIVE_ISLAND_EXTENSIONS.has(extension)) continue;

    const name = path.basename(entry.name, extension);
    if (!isValidIslandName(name) || islands[name]) continue;

    const fileUrl = pathToFileURL(path.join(islandsDir, entry.name)).href;
    islands[name] = () => import(fileUrl);
  }

  return islands;
}

/**
 * Create a fetch-style islands handler: `(request: Request) => Promise<Response | null>`.
 *
 * Returns `null` for requests outside the endpoint so you can compose it
 * with other routes. Works anywhere web `Request`/`Response` exist:
 * Node 18+, Cloudflare Workers, Deno, Vercel/Netlify functions.
 *
 * @param {object} options
 * @param {Record<string, unknown>} options.islands - name → island entry
 *   (render function, module, or lazy `() => import(...)` loader).
 * @param {string} [options.endpoint] - Base path, default `/_sitelo/islands`.
 * @param {string} [options.cacheControl] - Cache-Control header value for
 *   successful responses (default `no-store`).
 */
export function createIslandsHandler({
  islands,
  endpoint = DEFAULT_ISLANDS_ENDPOINT,
  cacheControl = 'no-store',
}) {
  if (!islands || typeof islands !== 'object') {
    throw new Error('[sitelo] createIslandsHandler requires an islands map.');
  }

  const base = endpoint.replace(/\/+$/, '');

  return async function handleIslandRequest(request) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith(`${base}/`)) return null;

    const name = decodeURIComponent(url.pathname.slice(base.length + 1));

    if (!isValidIslandName(name)) {
      return new Response('Invalid island name', { status: 400 });
    }

    const entry = islands[name];

    if (!entry) {
      return new Response(`Unknown island: ${name}`, { status: 404 });
    }

    let props;
    try {
      props = parseIslandProps(url.searchParams.get('props'));
    } catch {
      return new Response('Invalid island props', { status: 400 });
    }

    try {
      const html = await renderIsland(entry, { name, props, request });

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': cacheControl,
        },
      });
    } catch (error) {
      console.error(`[sitelo] island "${name}" render failed:`, error);
      return new Response('Island render failed', { status: 500 });
    }
  };
}

/**
 * Node/connect/express adapter around {@link createIslandsHandler}.
 *
 * Returns `(req, res, next?) => Promise<void>`. Calls `next()` (when
 * given) for requests outside the endpoint.
 */
export function createIslandsNodeHandler(options) {
  const handler = createIslandsHandler(options);

  return async function handleNodeRequest(req, res, next) {
    const host = req.headers.host ?? 'localhost';
    const protocol = req.socket?.encrypted ? 'https' : 'http';

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') headers.set(key, value);
      else if (Array.isArray(value)) headers.set(key, value.join(', '));
    }

    const request = new Request(`${protocol}://${host}${req.url}`, {
      method: req.method,
      headers,
    });

    const response = await handler(request);

    if (!response) {
      if (next) return next();
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.end(await response.text());
  };
}
