import type { Plugin } from 'vite';
import type { HtPagesPluginOptions } from 'vite-plugin-html-pages';

export * from 'vite-plugin-html-pages';

declare function sitelo(options?: HtPagesPluginOptions): Plugin;

export default sitelo;
