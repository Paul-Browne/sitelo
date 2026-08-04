/**
 * Emit a server-island placeholder for the static build. The client
 * loader (`sitelo/islands/client`) replaces it with server-rendered HTML
 * at runtime.
 */
export declare function island(
  name: string,
  props?: Record<string, unknown>,
  fallback?: string,
): string;

export declare function isValidIslandName(name: unknown): name is string;
