export declare const DEFAULT_ISLANDS_ENDPOINT: string;

export interface MountIslandsOptions {
  /** Islands endpoint base path or URL. Default `/_sitelo/islands`. */
  endpoint?: string;
  /** Where to look for placeholders. Default `document`. */
  root?: ParentNode;
  /** Called per island that fails to load; fallback HTML is kept. */
  onError?: (error: unknown, element: Element) => void;
  /** Per-island timeout in ms. Default `10000`; `0` disables it. */
  timeout?: number;
  /**
   * Default IntersectionObserver margin for `when: 'visible'` islands.
   * Default `'200px'`. A `rootMargin` on the island itself wins.
   */
  rootMargin?: string;
}

/**
 * Fetch and swap in every `[data-sitelo-island]` placeholder under
 * `root`.
 *
 * Resolves once the islands that load immediately have settled. Islands
 * marked `when: 'idle'` or `when: 'visible'` load later on their own
 * schedule and are deliberately not awaited.
 */
export declare function mountIslands(
  options?: MountIslandsOptions,
): Promise<void>;
