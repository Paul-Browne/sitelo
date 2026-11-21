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
 * Wrap `html` in an element that `mountEnhancements()` from
 * `sitelo/enhance/client` will hand to the module registered as `name`,
 * with `props`. The markup is rendered on the server like the rest of
 * the page; the module adds behaviour to it in the browser.
 */
export declare function enhance(
  name: string,
  props?: Record<string, unknown>,
  html?: string,
  options?: EnhanceOptions,
): string;
