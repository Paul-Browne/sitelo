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
}

declare function sitelo(options?: SiteloPluginOptions): Plugin[];

export default sitelo;
