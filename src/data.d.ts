/**
 * How long a read is memoized. `auto` (default) keeps the memo for a
 * production build and revalidates against mtime everywhere else, so the
 * dev server picks up an edit.
 */
export type JsonCacheMode = 'auto' | 'memory' | 'none';

export interface JsonDataOptions {
  /** Directory relative paths resolve from. Defaults to the project root. */
  root?: string;
  cache?: JsonCacheMode;
}

/** An entry read from a JSON collection. */
export interface JsonEntry {
  slug: string;
  [key: string]: unknown;
}

export interface JsonCollectionOptions<TEntry = JsonEntry>
  extends JsonDataOptions {
  /**
   * Where each entry's slug comes from: a field name, or a function of the
   * entry. Defaults to the filename for a directory of files, the key for
   * an object of entries, and `slug` (then `id`) for an array.
   */
  slug?: string | ((entry: TEntry, index: number) => unknown);
  /**
   * A compare function, or a field name — `'date'` ascending, `'-date'`
   * descending. Entries missing the field sort last either way.
   */
  sort?: string | ((a: TEntry, b: TEntry) => number);
  /** Read `.json` files in subdirectories too, slugged by their path. */
  recursive?: boolean;
}

/**
 * Directory relative data paths resolve from: the project root the CLI is
 * running against, falling back to the working directory.
 */
export declare function dataRoot(): string;

/**
 * Absolute path for a data source — a path relative to the project root, an
 * absolute path, or a `file:` URL.
 */
export declare function resolveDataPath(
  source: string | URL,
  options?: { root?: string },
): string;

/** Parsed contents of one local JSON file. */
export declare function readJson<TData = unknown>(
  source: string | URL,
  options?: JsonDataOptions,
): Promise<TData>;

/**
 * A collection of entries from local JSON: a directory of `.json` files
 * (one per entry, slug from the filename), or a single `.json` file holding
 * an array of entries or an object keyed by slug.
 *
 * The array is fresh on every call, so sorting it is safe; entry objects
 * are shared between callers, so copy one before mutating it.
 */
export declare function readJsonCollection<TEntry = JsonEntry>(
  source: string | URL,
  options?: JsonCollectionOptions<TEntry>,
): Promise<TEntry[]>;

/** Drop every memoized read. The dev server calls this on a file change. */
export declare function clearDataCache(): void;

/**
 * Watch which paths the site reads, so the dev server can reload the
 * browser when one of them changes.
 *
 * @returns unsubscribe
 */
export declare function onDataRead(
  listener: (path: string) => void,
): () => void;
