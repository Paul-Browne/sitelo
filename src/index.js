import htmlPages from 'vite-plugin-html-pages';

import { uiClientPrefix, uiRuntime } from './ui/plugin.js';

export * from 'vite-plugin-html-pages';

/** Whatever a caller passed for a list option, as a list. */
function toArray(value) {
  if (value == null) return [];

  return Array.isArray(value) ? value : [value];
}

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
  const { uiClient, externalAssets, ...pluginOptions } = options;

  /*
   * The runtime is served by the plugin below — in dev from middleware,
   * on a build by copying out of the package — so there is no file under
   * the pages directory for the page validator to find. Left to itself it
   * reports every component that imports one as a missing asset. Naming
   * the prefix here is the whole of the fix; a site's own
   * `externalAssets` still comes through untouched.
   */
  const runtimePrefix = uiClientPrefix(uiClient);

  return [
    htmlPages({
      ...pluginOptions,
      externalAssets: [
        ...toArray(externalAssets),
        ...(runtimePrefix ? [runtimePrefix] : []),
      ],
      generatedTypesDir: options.generatedTypesDir ?? '.sitelo/types',
      displayName: options.displayName ?? 'sitelo',
    }),
    uiRuntime(uiClient),
  ];
}
