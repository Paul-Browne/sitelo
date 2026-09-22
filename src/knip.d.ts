/**
 * Options for {@link knipConfig}. Anything not listed here is a knip
 * option and is spread into the result as-is.
 */
export interface SiteloKnipOptions {
  /**
   * Where `sitelo.config.js` lives. Defaults to the current directory,
   * which is where knip runs from.
   */
  root?: string;
  /**
   * Extra entry files, on top of the pages, islands and config file.
   * Client scripts that pages reference by URL rather than import go
   * here; suffix one with `!` to mark it as production code, the way
   * knip does.
   */
  entry?: string | string[];
  [option: string]: unknown;
}

/**
 * A knip configuration that knows where sitelo's entry points are.
 *
 * Reads `sitelo.config.js` (if there is one) and turns `pagesDir`,
 * `pageExtensions`, `include` and `exclude` into knip `production` entry
 * patterns, the same way the build discovers pages.
 *
 * ```js
 * // knip.js
 * import { knipConfig } from 'sitelo/knip'
 *
 * export default knipConfig()
 * ```
 */
export function knipConfig(
  options?: SiteloKnipOptions,
): Promise<Record<string, unknown>>;
