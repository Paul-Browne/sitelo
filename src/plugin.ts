import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { transform as esbuildTransform } from 'esbuild';
import pLimit from 'p-limit';
import type { Plugin, ViteDevServer } from 'vite';

import { writePageTypeDeclarations } from './typegen';
import { formatDevPageError } from './format-dev-error';

import {
  DEFAULT_PAGE_EXTENSIONS,
  PLUGIN_NAME,
  VIRTUAL_BUILD_ENTRY_ID,
  VIRTUAL_PAGE_HELPER_ID,
  RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX,
  VIRTUAL_JSX_RUNTIME_ID,
  VIRTUAL_JSX_DEV_RUNTIME_ID,
  RESOLVED_VIRTUAL_JSX_RUNTIME_ID,
  RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID,
  VIRTUAL_LOCAL_TYPES_PREFIX,
} from './constants';
import { discoverEntryPages } from './discover';
import { installDevServer } from './dev-server';
import {
  collectLocalAssetUrls,
  validateHtmlAssetReferences,
} from './html-asset-validator';
import {
  createPageModuleLoader,
  isLocalPageTypesImport,
} from './module-loader';
import { buildPageIndex } from './page-index';
import { generateTypedPageHelper } from './page-helper-generator';
import { renderPage } from './render-runtime';
import {
  buildProcessedStaticAssets,
  collectStaticAssets,
  copyStaticAssetSource,
  type StaticAssetFile,
} from './static-assets';
import type { HtPageInfo, HtPageModule, HtPagesPluginOptions } from './types';

let hasWarnedESM = false;

const pluginDir = path.dirname(fileURLToPath(import.meta.url));

function warnIfNotESM(root: string) {
  try {
    const pkgPath = path.join(root, 'package.json');

    if (!fs.existsSync(pkgPath)) return;

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    if (pkg.type !== 'module') {
      console.warn(
        `[${PLUGIN_NAME}] ⚠️ It is recommended to add "type": "module" to your package.json for optimal performance and to avoid Node ESM warnings.`,
      );
    }
  } catch {
    // silent — never break build
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

const DEFAULT_404_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>404 - Page Not Found</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        font-family: system-ui, sans-serif;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
      }
      main {
        max-width: 40rem;
        text-align: center;
      }
      h1 {
        font-size: 3rem;
        margin: 0 0 1rem;
      }
      p {
        margin: 0.5rem 0;
        line-height: 1.5;
      }
      a {
        color: inherit;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>Page not found.</p>
      <p><a href="/">Go back home</a></p>
    </main>
  </body>
</html>
`;

function isHtJsxFile(id: string): boolean {
  return (
    id.endsWith('.ht.jsx') ||
    id.endsWith('.html.jsx') ||
    id.endsWith('.ht.tsx') ||
    id.endsWith('.html.tsx')
  );
}

function isHtTsxFile(id: string): boolean {
  return id.endsWith('.ht.tsx') || id.endsWith('.html.tsx');
}

function isHtJsxImporter(importer: string | undefined): boolean {
  if (!importer) return false;

  const normalized = importer.split('?')[0].replace(/\\/g, '/');

  return isHtJsxFile(normalized);
}

type BuildPipeline = {
  entries: HtPageInfo[];
  modulesByEntry: Map<string, HtPageModule>;
  pages: HtPageInfo[];
  closeLoader: () => Promise<void>;
};

export function htPages(options: HtPagesPluginOptions = {}): Plugin {
  let root = process.cwd();
  let server: ViteDevServer | null = null;
  let devPages: HtPageInfo[] = [];
  let watcherAttached = false;
  let userConfigFile: string | undefined;
  let resolvedMode = 'production';
  let buildPipelinePromise: Promise<BuildPipeline> | null = null;

  const cleanUrls = options.cleanUrls ?? true;
  const pagesDir = options.pagesDir ?? 'src';
  const pageExtensions = options.pageExtensions?.length
    ? options.pageExtensions
    : DEFAULT_PAGE_EXTENSIONS;

  function logDebug(enabled: boolean | undefined, ...args: unknown[]) {
    if (!enabled) return;
    console.log(`[${PLUGIN_NAME}]`, ...args);
  }

  async function loadDevPages(): Promise<HtPageInfo[]> {
    const entries = await discoverEntryPages(root, options);
  
    // 🔥 generate types for editor
    await writePageTypeDeclarations({
      root,
      pagesDir,
      entries,
    });
  
    const modulesByEntry = new Map<string, HtPageModule>();

    logDebug(
      options.debug,
      'discovered entries',
      entries.map((e) => e.relativePath),
    );

    if (!server) return [];

    const loader = await createPageModuleLoader({
      mode: 'dev',
      root,
      server,
    });

    for (const entry of entries) {
      const mod = await loader.loadModule(entry.entryPath, entry.relativePath);
      modulesByEntry.set(entry.entryPath, mod);
    }

    devPages = await buildPageIndex({
      entries,
      modulesByEntry,
      cleanUrls,
    });

    logDebug(
      options.debug,
      'dev pages',
      devPages.map((p) => `${p.routePath} -> ${p.relativePath}`),
    );

    return devPages;
  }

  async function createBuildPipeline(): Promise<BuildPipeline> {
    const entries = await discoverEntryPages(root, options);

    // generate types for build (also ensures fresh output)
    await writePageTypeDeclarations({
      root,
      pagesDir,
      entries,
    });

    const loader = await createPageModuleLoader({
      mode: 'build',
      root,
      getPages: async () => entries,
      configFile: userConfigFile,
      configMode: resolvedMode,
    });

    try {
      const modulesByEntry = new Map<string, HtPageModule>();

      for (const entry of entries) {
        const mod = await loader.loadModule(
          entry.entryPath,
          entry.relativePath,
        );
        modulesByEntry.set(entry.entryPath, mod);
      }

      const pages = await buildPageIndex({
        entries,
        modulesByEntry,
        cleanUrls,
      });

      return { entries, modulesByEntry, pages, closeLoader: loader.close };
    } catch (error) {
      await loader.close();
      throw error;
    }
  }

  function getBuildPipeline(): Promise<BuildPipeline> {
    if (!buildPipelinePromise) {
      buildPipelinePromise = createBuildPipeline();
    }
    return buildPipelinePromise;
  }

  async function closeBuildPipeline(): Promise<void> {
    const pending = buildPipelinePromise;
    buildPipelinePromise = null;

    if (!pending) return;

    try {
      const pipeline = await pending;
      await pipeline.closeLoader();
    } catch {
      // Pipeline creation failed; its loader was already closed.
    }
  }

  return {
    name: PLUGIN_NAME,

    config(userConfig, env) {
      if (env.command !== 'build') return;

      const hasExplicitInput = userConfig.build?.rollupOptions?.input != null;
      if (hasExplicitInput) return;

      return {
        build: {
          rollupOptions: {
            input: VIRTUAL_BUILD_ENTRY_ID,
          },
        },
      };
    },

    resolveId(id, importer) {
      if (id === VIRTUAL_BUILD_ENTRY_ID) {
        return id;
      }

      if (id === VIRTUAL_PAGE_HELPER_ID && importer) {
        return `${RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX}${importer}`;
      }

      if (id === VIRTUAL_JSX_RUNTIME_ID) {
        return RESOLVED_VIRTUAL_JSX_RUNTIME_ID;
      }

      if (id === VIRTUAL_JSX_DEV_RUNTIME_ID) {
        return RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID;
      }

      if (isHtJsxImporter(importer)) {
        if (id === 'react/jsx-runtime') {
          return RESOLVED_VIRTUAL_JSX_RUNTIME_ID;
        }

        if (id === 'react/jsx-dev-runtime') {
          return RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID;
        }
      }

      if (importer && isLocalPageTypesImport(id)) {
        return `${VIRTUAL_LOCAL_TYPES_PREFIX}${importer}::${id}`;
      }      

      return null;
    },

    async load(id) {
      if (id === VIRTUAL_BUILD_ENTRY_ID) {
        return 'export default {};';
      }

      if (id === RESOLVED_VIRTUAL_JSX_RUNTIME_ID) {
        return `
export { Fragment, jsx, jsxs, jsxDEV } from ${JSON.stringify(
          pathToFileURL(path.join(pluginDir, 'jsx-runtime.js')).href,
        )};
`;
      }

      if (id === RESOLVED_VIRTUAL_JSX_DEV_RUNTIME_ID) {
        return `
export { Fragment, jsx, jsxs, jsxDEV } from ${JSON.stringify(
          pathToFileURL(path.join(pluginDir, 'jsx-dev-runtime.js')).href,
        )};
`;
      }

      if (id.startsWith(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX)) {
        const importer = id.slice(RESOLVED_VIRTUAL_PAGE_HELPER_PREFIX.length);

        // The helper only depends on paramDefinitions, which come from
        // static discovery — no page modules need to be evaluated here.
        const entries = await discoverEntryPages(root, options);

        const normalizedImporter = path.resolve(importer);

        const page = entries.find(
          (candidate) =>
            path.resolve(candidate.absolutePath) === normalizedImporter,
        );

        return generateTypedPageHelper(page);
      }

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

      return null;
    },

    async transform(code, id) {
      const normalizedId = id.split('?')[0].replace(/\\/g, '/');

      if (!isHtJsxFile(normalizedId)) {
        return null;
      }

      const result = await esbuildTransform(code, {
        loader: isHtTsxFile(normalizedId) ? 'tsx' : 'jsx',
        format: 'esm',
        jsx: 'automatic',
        jsxImportSource: 'sitelo',
        sourcemap: true,
        sourcefile: normalizedId,
        target: 'esnext',
      });

      return {
        code: result.code,
        map: result.map,
      };
    },

    configResolved(resolved) {
      root = options.root ? path.resolve(resolved.root, options.root) : resolved.root;
      userConfigFile = resolved.configFile ?? undefined;
      resolvedMode = resolved.mode;

      if (!hasWarnedESM) {
        warnIfNotESM(root);
        hasWarnedESM = true;
      }
    },

    async buildStart() {
      // Reset any pipeline left over from a previous build (watch mode).
      await closeBuildPipeline();

      const entries = await discoverEntryPages(root, options);

      for (const entry of entries) {
        this.addWatchFile(entry.entryPath);
      }

      const staticAssets = await collectStaticAssets({
        root,
        pagesDir,
        pageExtensions,
      });

      for (const asset of staticAssets) {
        this.addWatchFile(asset.absolutePath);
      }

      logDebug(
        options.debug,
        'static assets',
        staticAssets.map((asset) => ({
          kind: asset.kind,
          input: asset.relativePathFromSrc,
          output: asset.outputFileName,
        })),
      );
    },

    configureServer(_server) {
      server = _server;

      installDevServer({
        server,
        root,
        pagesDir,
        getPages: async () => {
          if (devPages.length > 0) return devPages;
          return loadDevPages();
        },
        getEntries: async () => discoverEntryPages(root, options),
      });

      if (!watcherAttached) {
        watcherAttached = true;

        const reloadAfterChange = async (file: string): Promise<void> => {
          logDebug(options.debug, 'file changed', file);

          try {
            await loadDevPages();

            server?.ws.send({
              type: 'full-reload',
              path: '*',
            });
          } catch (error) {          
            server?.config.logger.error(
              formatDevPageError({
                error,
                root,
                phase: 'reload',
                debug: options.debug,
              }),
            );
          
            // Do not rethrow.
          }
        };

        const pagesRoot = path.join(root, pagesDir);

        const reload = (file: string): void => {
          // Only react to files inside this project's pages directory;
          // a substring check like "/src/" would also match unrelated
          // paths such as node_modules/*/src/*.
          const relative = path.relative(pagesRoot, file);

          if (
            relative === '' ||
            relative.startsWith('..') ||
            path.isAbsolute(relative) ||
            relative.split(path.sep).includes('node_modules')
          ) {
            return;
          }

          void reloadAfterChange(file);
        };

        server.watcher.on('add', reload);
        server.watcher.on('change', reload);
        server.watcher.on('unlink', reload);
      }

      void loadDevPages().catch((error) => {
        server?.config.logger.error(
          formatDevPageError({
            error,
            root,
            phase: 'load',
            debug: options.debug,
          }),
        );
      }); 

    },

    async generateBundle(_, bundle) {
      try {
        const { modulesByEntry, pages } = await getBuildPipeline();

        logDebug(
          options.debug,
          'emitting pages',
          pages.map((p) => p.fileName),
        );

        const limit = pLimit(options.renderConcurrency ?? 8);
        const batchSize =
          options.renderBatchSize ??
          Math.max(options.renderConcurrency ?? 8, 32);

        // Render every page up front so asset emission can be limited to
        // files the generated HTML actually references.
        const renderedPages: Array<{ page: HtPageInfo; html: string }> = [];

        for (const batch of chunkArray(pages, batchSize)) {
          await Promise.all(
            batch.map((page) =>
              limit(async () => {
                const mod = modulesByEntry.get(page.entryPath);

                if (!mod) {
                  throw new Error(
                    `[${PLUGIN_NAME}] Missing module for page entry: ${page.entryPath}`,
                  );
                }

                const html = await renderPage(page, mod, false);

                validateHtmlAssetReferences({
                  root,
                  pagesDir,
                  html,
                  pluginName: PLUGIN_NAME,
                  pageLabel: page.relativePath,
                  missingAssets: options.missingAssets ?? 'error',
                });

                renderedPages.push({ page, html });
              }),
            ),
          );
        }

        const rendered404 = renderedPages.find(
          (rendered) => rendered.page.routePath === '/404',
        );
        const notFoundHtml = rendered404?.html ?? DEFAULT_404_HTML;

        logDebug(
          options.debug,
          rendered404
            ? 'generated 404.html from user page'
            : 'generated default 404.html',
        );

        // Only js/ts/css files that the rendered HTML references are
        // bundled and emitted, so server-only helpers under the pages dir
        // never leak into dist. Non-code assets (images, fonts, ...) are
        // always copied since they may be referenced from CSS.
        const referencedUrls = new Set<string>();

        for (const { html } of renderedPages) {
          for (const url of collectLocalAssetUrls(html)) {
            referencedUrls.add(url);
          }
        }

        for (const url of collectLocalAssetUrls(notFoundHtml)) {
          referencedUrls.add(url);
        }

        const staticAssets = await collectStaticAssets({
          root,
          pagesDir,
          pageExtensions,
        });

        const isReferenced = (asset: StaticAssetFile) =>
          referencedUrls.has(`/${asset.outputFileName}`) ||
          referencedUrls.has(`/${asset.relativePathFromSrc}`);

        const processableAssets: StaticAssetFile[] = [];
        const skippedAssets: StaticAssetFile[] = [];

        for (const asset of staticAssets) {
          if (asset.kind !== 'process') continue;

          if (isReferenced(asset)) {
            processableAssets.push(asset);
          } else {
            skippedAssets.push(asset);
          }
        }

        if (skippedAssets.length > 0) {
          logDebug(
            options.debug,
            'skipping unreferenced code assets',
            skippedAssets.map((asset) => asset.relativePathFromSrc),
          );
        }

        logDebug(
          options.debug,
          'emitting static assets',
          staticAssets
            .filter((asset) => asset.kind === 'copy' || isReferenced(asset))
            .map((asset) => ({
              kind: asset.kind,
              input: asset.relativePathFromSrc,
              output: asset.outputFileName,
            })),
        );

        const processedOutputs = await buildProcessedStaticAssets({
          root,
          pagesDir,
          assets: processableAssets,
          minify: true,
          sourcemap: false,
        });

        for (const [fileName, source] of processedOutputs) {
          this.emitFile({
            type: 'asset',
            fileName,
            source,
          });
        }

        for (const asset of staticAssets) {
          if (asset.kind !== 'copy') continue;

          const source = await copyStaticAssetSource(asset);

          this.emitFile({
            type: 'asset',
            fileName: asset.outputFileName,
            source,
          });
        }

        for (const { page, html } of renderedPages) {
          this.emitFile({
            type: 'asset',
            fileName: options.mapOutputPath?.(page) ?? page.fileName,
            source: html,
          });
        }

        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: notFoundHtml,
        });

        const sitemapBase = (options.site ?? '').replace(/\/+$/, '');

        const sitemapRoutes = [...new Set(pages.map((p) => p.routePath))].filter(
          (route) => !route.includes(':') && !route.includes('*'),
        );

        if (sitemapBase && sitemapRoutes.length > 0) {
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes
            .map(
              (route) =>
                `  <url><loc>${escapeXml(`${sitemapBase}${route}`)}</loc></url>`,
            )
            .join('\n')}\n</urlset>\n`;

          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: sitemap,
          });

          logDebug(options.debug, 'generated sitemap.xml');
        }

        const rss = options.rss;

        if (rss?.site) {
          const routePrefix = rss.routePrefix ?? '/blog';
          const rssSite = rss.site.replace(/\/+$/, '');

          const rssItems = pages
            .filter((page) => page.routePath.startsWith(routePrefix))
            .map((page) => {
              const url = escapeXml(`${rssSite}${page.routePath}`);

              return `  <item>\n    <title>${escapeXml(page.routePath)}</title>\n    <link>${url}</link>\n    <guid>${url}</guid>\n  </item>`;
            })
            .join('\n');

          const rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>${escapeXml(rss.title ?? PLUGIN_NAME)}</title>\n  <link>${escapeXml(rssSite)}</link>\n  <description>${escapeXml(rss.description ?? 'RSS feed')}</description>\n${rssItems}\n</channel>\n</rss>\n`;

          this.emitFile({
            type: 'asset',
            fileName: 'rss.xml',
            source: rssXml,
          });

          logDebug(options.debug, 'generated rss.xml');
        }

        for (const [fileName, output] of Object.entries(bundle)) {
          if (
            output.type === 'chunk' &&
            output.facadeModuleId === VIRTUAL_BUILD_ENTRY_ID
          ) {
            delete bundle[fileName];
          }
        }
      } finally {
        await closeBuildPipeline();
      }
    },

    async buildEnd(error) {
      // Ensure the nested loader server is closed when the build fails
      // before generateBundle runs; otherwise the process can hang.
      if (error) {
        await closeBuildPipeline();
      }
    },

    async closeBundle() {
      await closeBuildPipeline();
    },
  };
}

export default htPages;