/** When the browser imports an enhancement's module. */
export type EnhanceLoadingStrategy = 'load' | 'idle' | 'visible';

export interface EnhanceOptions {
  /**
   * When the module is imported. `load` (default) as soon as the page
   * loads, `idle` on an idle callback, `visible` when the wrapper scrolls
   * into view.
   */
  when?: EnhanceLoadingStrategy;
  /**
   * IntersectionObserver margin for `when: 'visible'`, e.g. `'400px'` to
   * start loading before it reaches the viewport.
   */
  rootMargin?: string;
}

/**
 * Wrap `html` in a `<div>` that `mountEnhancements()` from
 * `sitelo/enhance/client` will hand to the module registered as `name`,
 * with `props`. The markup is rendered on the server like the rest of
 * the page; the module adds behaviour to it in the browser.
 */
export declare function enhance(
  name: string,
  props?: Record<string, unknown> | null,
  html?: string,
  options?: EnhanceOptions,
): string;

/**
 * The `data-sitelo-*` attributes `enhance()` puts on its `<div>`, for an
 * element of your own. An object, for javascript-to-html and JSX; inside
 * a template literal it becomes the escaped attribute text.
 */
export interface EnhanceAttributes {
  readonly 'data-sitelo-enhance': string;
  readonly 'data-sitelo-props'?: string;
  readonly 'data-sitelo-when'?: 'idle' | 'visible';
  readonly 'data-sitelo-root-margin'?: string;
  /** The attributes as HTML text: `data-sitelo-enhance="…" …`. */
  toString(): string;
}

/**
 * Hand an element you write yourself to the module registered as
 * `name`, rather than a `<div>` around it:
 *
 * ```js
 * `<form action="/search" ${enhanceAttributes('search')}>…</form>`
 * form({ action: '/search' }, enhanceAttributes('search'), …)
 * <form action="/search" {...enhanceAttributes('search')}>…</form>
 * ```
 */
export declare function enhanceAttributes(
  name: string,
  props?: Record<string, unknown> | null,
  options?: EnhanceOptions,
): EnhanceAttributes;
