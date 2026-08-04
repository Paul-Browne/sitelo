export declare const DEFAULT_ISLANDS_ENDPOINT: string;

export interface MountIslandsOptions {
  /** Islands endpoint base path or URL. Default `/_sitelo/islands`. */
  endpoint?: string;
  /** Where to look for placeholders. Default `document`. */
  root?: ParentNode;
  /** Called per island that fails to load; fallback HTML is kept. */
  onError?: (error: unknown, element: Element) => void;
}

/**
 * Fetch and swap in every `[data-sitelo-island]` placeholder under
 * `root`. Resolves when all islands have settled.
 */
export declare function mountIslands(
  options?: MountIslandsOptions,
): Promise<void>;
