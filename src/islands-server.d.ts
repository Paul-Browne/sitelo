export declare const DEFAULT_ISLANDS_ENDPOINT: string;

export interface IslandRenderContext<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Island name from the request path. */
  name?: string;
  /** Decoded props from the placeholder. */
  props?: TProps;
  /** Incoming request (web standard), when available. */
  request?: Request;
}

export type IslandRenderFunction<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> = (context: IslandRenderContext<TProps>) => string | Promise<string>;

export interface IslandModule {
  default?: IslandRenderFunction | { render: IslandRenderFunction };
  render?: IslandRenderFunction;
}

export type IslandEntry =
  | IslandRenderFunction
  | IslandModule
  | (() => Promise<IslandModule>)
  | Promise<IslandModule>;

/** Render one island entry to an HTML fragment string. */
export declare function renderIsland(
  entry: IslandEntry,
  context?: IslandRenderContext,
): Promise<string>;

/** Parse the `props` query parameter (JSON object) of an island request. */
export declare function parseIslandProps(
  raw: string | null | undefined,
): Record<string, unknown>;

export interface CreateIslandsHandlerOptions {
  /** name → island entry (render function, module, or lazy loader). */
  islands: Record<string, IslandEntry>;
  /** Base path, default `/_sitelo/islands`. */
  endpoint?: string;
  /** Cache-Control for successful responses. Default `no-store`. */
  cacheControl?: string;
  /**
   * Shared secret for props signing. Defaults to
   * `SITELO_ISLANDS_SECRET`.
   *
   * Island props travel in the query string and are client-supplied.
   * With a secret set, requests carrying props must present a matching
   * `sig` or get a 403, so callers cannot invent their own props. With
   * no secret, props are accepted as-is and island modules must
   * validate them.
   */
  secret?: string;
}

export declare function createIslandsFromDirectory(
  islandsDir: string,
): Record<string, () => Promise<IslandModule>>;

/**
 * Fetch-style handler: returns a Response for island requests, `null`
 * for anything outside the endpoint.
 */
export declare function createIslandsHandler(
  options: CreateIslandsHandlerOptions,
): (request: Request) => Promise<Response | null>;

/** Node/connect/express adapter around `createIslandsHandler`. */
export declare function createIslandsNodeHandler(
  options: CreateIslandsHandlerOptions,
): (
  req: import('node:http').IncomingMessage,
  res: import('node:http').ServerResponse,
  next?: (error?: unknown) => void,
) => Promise<void>;
