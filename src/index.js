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
 * Options are every vite-plugin-html-pages option plus sitelo's own,
 * taken from the shipped declaration so the two cannot drift:
 *
 * - `uiClient` — where to serve the sitelo-ui runtime from. Defaults to
 *   `su/` under Vite's `base`, so a sub-path deploy needs nothing; set
 *   it to serve from elsewhere on the site, or to an absolute URL to
 *   host the files yourself.
 * - `pruneCss` — write only the rules of the sitelo-ui stylesheet that
 *   the built pages can match, rather than the whole sheet. `keep` names
 *   classes to keep regardless — for markup that arrives at request
 *   time, say — with a trailing `*` for a prefix.
 *
 * @param {import('./index.js').SiteloPluginOptions} [options]
 */
export default function sitelo(options = {}) {
  const { uiClient, pruneCss, externalAssets, ...pluginOptions } = options;

  return [
    htmlPages({
      ...pluginOptions,
      /*
       * The runtime is served by the plugin below — in dev from
       * middleware, on a build by copying out of the package — so there
       * is no file under the pages directory for the page validator to
       * find. Left to itself it reports every component that imports one
       * as a missing asset. Naming the prefix here is the whole of the
       * fix; a site's own `externalAssets` still comes through untouched.
       *
       * A getter, because the prefix follows Vite's `base`, which is not
       * resolved yet while this array would be built; html-pages reads
       * the option for each page it checks, by which time it is.
       */
      get externalAssets() {
        const runtimePrefix = uiClientPrefix(uiClient);

        return [
          ...toArray(externalAssets),
          ...(runtimePrefix ? [runtimePrefix] : []),
        ];
      },
      generatedTypesDir: options.generatedTypesDir ?? '.sitelo/types',
      displayName: options.displayName ?? 'sitelo',
    }),
    uiRuntime({ ...uiClient, prune: pruneCss }),
  ];
}
