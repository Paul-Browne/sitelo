declare module 'orivo/page' {
    export type PageParams = Record<string, string | string[] | undefined>;
  
    export type PageContext = {
      params: PageParams;
      data?: unknown;
      dev: boolean;
    };
  
    export function definePage<T extends (ctx: PageContext) => any>(fn: T): T;
}