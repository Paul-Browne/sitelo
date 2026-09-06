import htmlPages from 'vite-plugin-html-pages';

import { uiRuntime } from './ui/plugin.js';

export * from 'vite-plugin-html-pages';

/**
 * Sitelo’s default plugin entry. Same as vite-plugin-html-pages, with
 * sitelo branding for generated types and log/error prefixes, plus the
 * server side of `sitelo/ui`: the small runtime modules its components
 * import from their own event attributes.
 *
 * @param {object} [options]
 * @param {{ base?: string }} [options.uiClient] - where to serve the
 *   sitelo-ui runtime from. Defaults to `/su/`; set it for a sub-path
 *   deploy, or to an absolute URL to host the files yourself.
 */
export default function sitelo(options = {}) {
  const { uiClient, ...pluginOptions } = options;

  return [
    htmlPages({
      ...pluginOptions,
      generatedTypesDir: options.generatedTypesDir ?? '.sitelo/types',
      displayName: options.displayName ?? 'sitelo',
    }),
    uiRuntime(uiClient),
  ];
}
