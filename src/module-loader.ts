import path from 'node:path';
import {
  createServer,
  isRunnableDevEnvironment,
  loadConfigFromFile,
  type InlineConfig,
  type Plugin,
  type PluginOption,
  type UserConfig,
  type ViteDevServer,
} from 'vite';

import {
  PLUGIN_NAME,
  VIRTUAL_PAGE_HELPER_ID,
  RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX,
  VIRTUAL_LOCAL_TYPES_PREFIX,
} from './constants';
import { generateTypedPageHelper } from './page-helper-generator';
import { isStructuredPageModule } from './render-runtime';
import type { HtPageInfo, HtPageModule } from './types';

export type PageModuleLoader = (
  entryPath: string,
  relativePath: string,
) => Promise<HtPageModule>;

export interface PageModuleLoaderHandle {
  loadModule: PageModuleLoader;
  close: () => Promise<void>;
}

async function importPageModule(
  server: ViteDevServer,
  url: string,
): Promise<HtPageModule> {
  const environment = server.environments.ssr;

  if (!isRunnableDevEnvironment(environment)) {
    throw new Error(
      '[sitelo] The Vite SSR environment is not runnable. ' +
        'A RunnableDevEnvironment is required to evaluate page modules.',
    );
  }

  const mod = await environment.runner.import(url);

  return normalizeLoadedPageModule(mod);
}

export function isLocalPageTypesImport(id: string): boolean {
  return /^\.\/\$types(?:\.[A-Za-z0-9_.-]+)?$/.test(id);
}

function normalizeLoadedPageModule(mod: unknown): HtPageModule {
  const pageModule = (mod ?? {}) as HtPageModule;

  if (isStructuredPageModule(pageModule.default)) {
    const structured = pageModule.default;

    return {
      default: structured.render,
      data: structured.data,
      generateStaticParams: structured.generateStaticParams,
      dynamic: structured.dynamic,
      prerender: structured.prerender,
    };
  }

  return pageModule;
}

async function flattenPluginOptions(option: PluginOption): Promise<Plugin[]> {
  const resolved = await option;

  if (!resolved) return [];

  if (Array.isArray(resolved)) {
    const nested = await Promise.all(
      resolved.map((entry) => flattenPluginOptions(entry)),
    );
    return nested.flat();
  }

  return [resolved as Plugin];
}

async function loadUserConfig(args: {
  root: string;
  configFile: string | undefined;
  mode: string;
}): Promise<{ userConfig: UserConfig; userPlugins: Plugin[] }> {
  if (!args.configFile) {
    return { userConfig: {}, userPlugins: [] };
  }

  const loaded = await loadConfigFromFile(
    { command: 'serve', mode: args.mode },
    args.configFile,
    args.root,
  );

  if (!loaded) {
    return { userConfig: {}, userPlugins: [] };
  }

  const plugins = await flattenPluginOptions(loaded.config.plugins);

  return {
    userConfig: loaded.config,
    // Filter ourselves out so evaluating page modules does not
    // recursively spawn more build loaders.
    userPlugins: plugins.filter((plugin) => plugin.name !== PLUGIN_NAME),
  };
}

function createPageHelperPlugin(
  getPages: () => Promise<HtPageInfo[]>,
): Plugin {
  return {
    name: `${PLUGIN_NAME}:page-helper`,

    resolveId(id, importer) {
      if (id === VIRTUAL_PAGE_HELPER_ID && importer) {
        return `${RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX}${importer}`;
      }

      if (importer && isLocalPageTypesImport(id)) {
        return `${VIRTUAL_LOCAL_TYPES_PREFIX}${importer}::${id}`;
      }

      return null;
    },

    async load(id) {
      if (id.startsWith(VIRTUAL_LOCAL_TYPES_PREFIX)) {
        return `
export {
  definePage,
  defineData,
  defineStaticParams,
  definePageModule
} from 'sitelo/page';
`;
      }

      if (!id.startsWith(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX)) {
        return null;
      }

      const importer = id.slice(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX.length);

      const pages = await getPages();
      const normalizedImporter = path.resolve(importer);

      const page = pages.find(
        (candidate) =>
          path.resolve(candidate.absolutePath) === normalizedImporter,
      );

      return generateTypedPageHelper(page);
    },
  };
}

export async function createPageModuleLoader(args: {
  mode: 'dev' | 'build';
  root: string;
  server?: ViteDevServer | null;
  getPages?: () => Promise<HtPageInfo[]>;
  configFile?: string;
  configMode?: string;
}): Promise<PageModuleLoaderHandle> {
  const { mode, root, server, getPages } = args;

  if (mode === 'dev') {
    if (!server) {
      throw new Error('[sitelo] dev server not available');
    }

    return {
      loadModule: async (_entryPath, relativePath) =>
        importPageModule(server, `/${relativePath}`),
      close: async () => {},
    };
  }

  if (!getPages) {
    throw new Error(
      '[sitelo] getPages is required in build mode',
    );
  }

  const configMode = args.configMode ?? 'production';

  // Load the user's Vite config so page modules are evaluated with the
  // same aliases, defines, and plugins as in dev.
  const { userConfig, userPlugins } = await loadUserConfig({
    root,
    configFile: args.configFile,
    mode: configMode,
  });

  const config: InlineConfig = {
    ...userConfig,
    root,
    mode: configMode,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    esbuild:
      userConfig.esbuild === false
        ? false
        : {
            ...userConfig.esbuild,
            jsx: 'automatic',
            jsxImportSource: PLUGIN_NAME,
          },
    server: {
      ...userConfig.server,
      middlewareMode: true,
      watch: null,
    },
    plugins: [...userPlugins, createPageHelperPlugin(getPages)],
  };

  const buildServer = await createServer(config);

  return {
    loadModule: async (entryPath) => {
      const relativePath =
        '/' + path.relative(root, entryPath).replace(/\\/g, '/');

      return importPageModule(buildServer, relativePath);
    },
    close: async () => {
      await buildServer.close();
    },
  };
}
