/** When the client loader fetches an island. */
export type IslandLoadingStrategy = 'load' | 'idle' | 'visible';

export interface IslandOptions {
  /**
   * When the client loads it. `load` (default) fetches immediately,
   * `idle` waits for an idle callback, `visible` waits until the
   * placeholder scrolls into view.
   */
  when?: IslandLoadingStrategy;
  /**
   * IntersectionObserver margin for `when: 'visible'`, e.g. `'400px'` to
   * start loading before it reaches the viewport.
   */
  rootMargin?: string;
}

/**
 * Emit a server-island placeholder for the static build. The client
 * loader (`sitelo/islands/client`) replaces it with server-rendered HTML
 * at runtime.
 */
export declare function island(
  name: string,
  props?: Record<string, unknown>,
  fallback?: string,
  options?: IslandOptions,
): string;

export declare function isValidIslandName(name: unknown): name is string;

/**
 * Set the secret used to sign island props. Defaults to the
 * `SITELO_ISLANDS_SECRET` environment variable. Server-side only — the
 * secret never reaches the browser.
 */
export declare function configureIslands(options?: {
  secret?: string | null;
}): void;

/** The active signing secret, or `undefined` when signing is off. */
export declare function getIslandsSecret(): string | undefined;

/** HMAC-SHA256 over the island name and its exact props JSON. */
export declare function signIslandProps(
  name: string,
  propsJson: string,
  secret: string,
): string;

/** Constant-time check of a signature produced by `signIslandProps`. */
export declare function verifyIslandProps(
  name: string,
  propsJson: string,
  signature: unknown,
  secret: string,
): boolean;
