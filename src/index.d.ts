import type { Plugin } from 'vite';
import type { HtPagesPluginOptions } from 'vite-plugin-html-pages';

export * from 'vite-plugin-html-pages';

export interface SiteloPluginOptions extends HtPagesPluginOptions {
  /** Where to serve the `sitelo/ui` runtime from. */
  uiClient?: {
    /**
     * Base URL the components' inline imports point at, and the
     * directory they are copied into on a build. Defaults to `/su/`.
     * An absolute URL turns the copying off — the files are yours to
     * host.
     */
    base?: string;
  };
  /**
   * Cut the `sitelo/ui` stylesheet down to what the build uses.
   *
   * On a build, each sheet the pages link or inline is written with
   * only the rules whose `su-` classes appear in the output — the
   * pages, and the scripts beside them. A linked sheet is pruned
   * against the whole site and renamed for its new contents; an
   * inlined one is pruned per page. Dev serves the whole sheet.
   *
   * `keep` names classes to treat as present anyway — for markup the
   * build never sees, such as a server island's — with a trailing `*`
   * for a prefix: `['su-card', 'su-btn*']`.
   */
  pruneCss?: boolean | { keep?: string[] };
}

declare function sitelo(options?: SiteloPluginOptions): Plugin[];

export default sitelo;
