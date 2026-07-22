export type PageParams = { "slug": string };

export type StaticParams = PageParams[];

export type DataContext = {
  params: PageParams;
  dev: boolean;
};

export type RenderContext<TData = unknown> = {
  params: PageParams;
  data: TData;
  dev: boolean;
};

export type PageContext<TData = unknown> = {
  params: PageParams;
  data?: TData;
  dev: boolean;
};

export type RenderResult = unknown;

export type PageModule<TData = unknown> = {
  generateStaticParams?: () => StaticParams | Promise<StaticParams>;
  data?: (ctx: DataContext) => TData | Promise<TData>;
  render: (ctx: RenderContext<TData>) => RenderResult | Promise<RenderResult>;
};

export declare function definePage<
  T extends (ctx: PageContext) => RenderResult | Promise<RenderResult>
>(fn: T): T;

export declare function defineData<
  T extends (ctx: DataContext) => unknown | Promise<unknown>
>(fn: T): T;

export declare function defineStaticParams<
  T extends () => StaticParams | Promise<StaticParams>
>(fn: T): T;

export declare function definePageModule<TData>(
  mod: PageModule<TData>
): PageModule<TData>;
