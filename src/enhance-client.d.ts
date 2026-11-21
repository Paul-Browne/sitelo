/**
 * What an enhancement module exports as its default: called once per
 * `enhance()` wrapper on the page, with the wrapper and the props it was
 * rendered with.
 *
 * ```ts
 * import type { Enhancer } from 'sitelo/enhance/client'
 *
 * const counter: Enhancer<{ start: number }> = (element, { start }) => { … }
 * export default counter
 * ```
 */
export type Enhancer<Props = Record<string, unknown>> = (
  element: HTMLElement,
  props: Props,
) => void | Promise<void>;

/**
 * Loads one enhancement, usually `() => import('./client/name.js')`. It
 * may also resolve to the function itself.
 */
export type EnhancementLoader = () =>
  | { default: Enhancer<any> }
  | Enhancer<any>
  | Promise<{ default: Enhancer<any> } | Enhancer<any>>;

export interface MountEnhancementsOptions {
  /** Where to look for wrappers. Default `document`. */
  root?: ParentNode;
  /**
   * Called for each enhancement that fails to load or throws. The element
   * is left as the server rendered it, marked
   * `data-sitelo-enhance-state="error"`.
   */
  onError?: (error: unknown, element: Element) => void;
  /**
   * Default IntersectionObserver margin for `when: 'visible'`. Default
   * `'200px'`. A `rootMargin` on the enhancement itself wins.
   */
  rootMargin?: string;
}

/**
 * Run the registered module for every `[data-sitelo-enhance]` wrapper
 * under `root`, and for those inside server islands as each island
 * loads.
 *
 * Resolves once the enhancements that run straight away are done.
 * Those marked `when: 'idle'` or `when: 'visible'` run later on their
 * own schedule and are deliberately not awaited.
 */
export declare function mountEnhancements(
  modules: Record<string, EnhancementLoader>,
  options?: MountEnhancementsOptions,
): Promise<void>;
