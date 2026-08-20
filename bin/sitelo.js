#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import htmlPages from '../src/index.js';
import { renderIsland } from '../src/islands-server.js';
import { isValidIslandName } from '../src/islands.js';
import {
  createDevImagePipeline,
  normalizeImageOptions,
  runImages,
} from '../src/images.js';
import {
  normalizePagefindOptions,
  runPagefind,
} from '../src/pagefind.js';
import {
  build,
  createLogger,
  createServer,
  loadConfigFromFile,
  mergeConfig,
  preview,
} from 'vite';

const PLUGIN_NAME = 'vite-plugin-html-pages';
const LOG_PREFIX = '[sitelo]';
const ISLANDS_ENDPOINT = '/_sitelo/islands';
const ISLAND_FILE_EXTENSIONS = ['.js', '.mjs', '.ts'];
const SITELO_CONFIG_FILES = ['sitelo.config.js', 'sitelo.config.mjs'];
const VERSION = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../package.json'),
    'utf8',
  ),
).version;

const HELP = `Usage: sitelo [command] [options]

Commands:
  dev       Start the development server (default)
  build     Build for production
  preview   Preview the production build locally

Options:
  -c, --config <file>     Use a custom Vite config file
  --root <dir>            Project root (default: cwd)
  --base <path>           Public base path
  --mode <mode>           Set env mode
  --outDir <dir>          Output directory (default: dist)
  --assetsDir <dir>       Directory for nested assets (default: assets)
  --emptyOutDir           Force empty outDir on build
  --logLevel <level>      info | warn | error | silent
  --clearScreen           Allow/disable clear screen when logging
  --host [host]           Expose on network (use 0.0.0.0 for all interfaces)
  --port <port>           Port number
  --strictPort            Exit if port is already in use
  --open [path]           Open browser on startup
  --debug                 Show debug logs
  -h, --help              Display this message
  -v, --version           Display version
`;

function printHelp() {
  console.log(HELP.trim());
}

function parseArgs(argv) {
  const result = {
    command: 'dev',
    positional: [],
    config: undefined,
    root: process.cwd(),
    base: undefined,
    mode: undefined,
    outDir: undefined,
    assetsDir: undefined,
    emptyOutDir: undefined,
    logLevel: undefined,
    clearScreen: undefined,
    host: undefined,
    port: undefined,
    strictPort: false,
    open: undefined,
    debug: false,
    help: false,
    version: false,
  };

  const args = [...argv];

  if (args[0] && !args[0].startsWith('-')) {
    const maybeCommand = args.shift();
    if (['dev', 'build', 'preview', 'help', '--help', '-h'].includes(maybeCommand)) {
      if (maybeCommand === 'help' || maybeCommand === '--help' || maybeCommand === '-h') {
        result.help = true;
      } else {
        result.command = maybeCommand;
      }
    } else {
      result.positional.push(maybeCommand);
    }
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--') {
      result.positional.push(...args.slice(i + 1));
      break;
    }

    const next = () => {
      if (i + 1 >= args.length) {
        throw new Error(`Missing value for ${arg}`);
      }
      i += 1;
      return args[i];
    };

    switch (arg) {
      case '-h':
      case '--help':
        result.help = true;
        break;
      case '-v':
      case '--version':
        result.version = true;
        break;
      case '-c':
      case '--config':
        result.config = next();
        break;
      case '--root':
        result.root = path.resolve(next());
        break;
      case '--base':
        result.base = next();
        break;
      case '--mode':
        result.mode = next();
        break;
      case '--outDir':
        result.outDir = next();
        break;
      case '--assetsDir':
        result.assetsDir = next();
        break;
      case '--emptyOutDir':
        result.emptyOutDir = true;
        break;
      case '--logLevel':
        result.logLevel = next();
        break;
      case '--clearScreen':
        result.clearScreen = true;
        break;
      case '--host':
        result.host = args[i + 1] && !args[i + 1].startsWith('-') ? next() : true;
        break;
      case '--port':
        result.port = Number(next());
        break;
      case '--strictPort':
        result.strictPort = true;
        break;
      case '--open':
        result.open = args[i + 1] && !args[i + 1].startsWith('-') ? next() : true;
        break;
      case '--debug':
        result.debug = true;
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option: ${arg}`);
        }
        result.positional.push(arg);
        break;
    }
  }

  return result;
}

async function flattenPluginOptions(option) {
  const resolved = await option;

  if (!resolved) return [];

  if (Array.isArray(resolved)) {
    const nested = await Promise.all(
      resolved.map((entry) => flattenPluginOptions(entry)),
    );
    return nested.flat();
  }

  return [resolved];
}

async function userConfigHasHtmlPagesPlugin({
  root,
  configFile,
  command,
  mode,
}) {
  const loaded = await loadConfigFromFile(
    { command, mode },
    configFile,
    root,
  );

  if (!loaded) return false;

  const plugins = await flattenPluginOptions(loaded.config.plugins);
  return plugins.some((plugin) => plugin.name === PLUGIN_NAME);
}

function findSiteloConfigFile(root) {
  for (const fileName of SITELO_CONFIG_FILES) {
    const filePath = path.join(root, fileName);
    if (fs.existsSync(filePath)) return filePath;
  }

  return undefined;
}

function splitSiteloConfig(options) {
  if (!options) {
    return {
      pluginOptions: undefined,
      viteOptions: undefined,
      pagefind: undefined,
      images: undefined,
    };
  }

  const { vite, pagefind, images, ...pluginOptions } = options;

  if (vite != null && (typeof vite !== 'object' || Array.isArray(vite))) {
    throw new Error('[sitelo] sitelo.config.js "vite" must be an object');
  }

  return {
    pluginOptions:
      Object.keys(pluginOptions).length > 0 ? pluginOptions : undefined,
    viteOptions: vite ?? undefined,
    pagefind,
    images,
  };
}

async function loadSiteloConfig(root) {
  const configFile = findSiteloConfigFile(root);
  if (!configFile) {
    return {
      pluginOptions: undefined,
      viteOptions: undefined,
      pagefind: undefined,
      images: undefined,
      configFile: undefined,
    };
  }

  const mod = await import(pathToFileURL(configFile).href);
  const options = mod.default ?? mod;

  if (options && typeof options !== 'object') {
    throw new Error(
      `[sitelo] ${path.basename(configFile)} must export a configuration object`,
    );
  }

  const split = splitSiteloConfig(options);
  return { ...split, configFile };
}

async function resolveSiteloConfig({ root, configFile, command, mode, debug }) {
  const {
    pluginOptions,
    viteOptions,
    pagefind,
    images,
    configFile: siteloConfigFile,
  } = await loadSiteloConfig(root);

  const hasPluginInUserConfig = await userConfigHasHtmlPagesPlugin({
    root,
    configFile,
    command,
    mode,
  });

  if (pluginOptions && hasPluginInUserConfig) {
    const viteConfigLabel = configFile ?? 'vite.config.*';
    throw new Error(
      `[sitelo] Found both plugin options in ${path.basename(siteloConfigFile)} and a Vite config (${viteConfigLabel}) that already registers ${PLUGIN_NAME}.\n` +
        'Remove the plugin from vite.config or move its options into one place.',
    );
  }

  if (hasPluginInUserConfig) {
    return { plugins: [], viteOptions, pluginOptions, pagefind, images };
  }

  return {
    plugins: [
      htmlPages({
        ...(pluginOptions ?? {}),
        debug: debug || Boolean(pluginOptions?.debug),
      }),
    ],
    viteOptions,
    pluginOptions,
    pagefind,
    images,
  };
}

/**
 * Dev-only endpoint for server islands: renders src/<pagesDir>/islands/<name>.js
 * modules on request at /_sitelo/islands/<name>?props=<json>.
 *
 * Production deployments mount their own handler via `sitelo/islands/server`.
 */
function islandsDevPlugin({ root, pagesDir = 'src' }) {
  return {
    name: 'sitelo:islands-dev',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url ?? '';
        const markerIndex = rawUrl.indexOf(`${ISLANDS_ENDPOINT}/`);

        if (markerIndex === -1 || (req.method ?? 'GET') !== 'GET') {
          return next();
        }

        const [pathname, query = ''] = rawUrl.slice(markerIndex).split('?');
        const name = decodeURIComponent(
          pathname.slice(ISLANDS_ENDPOINT.length + 1),
        );

        if (!isValidIslandName(name)) {
          res.statusCode = 400;
          res.end('Invalid island name');
          return;
        }

        const islandsDir = path.join(root, pagesDir, 'islands');
        const extension = ISLAND_FILE_EXTENSIONS.find((ext) =>
          fs.existsSync(path.join(islandsDir, `${name}${ext}`)),
        );

        if (!extension) {
          res.statusCode = 404;
          res.end(`Unknown island: ${name} (expected ${pagesDir}/islands/${name}.js)`);
          return;
        }

        try {
          const runner = server.environments.ssr?.runner;
          if (!runner || typeof runner.import !== 'function') {
            throw new Error('Vite SSR environment is not runnable');
          }

          const mod = await runner.import(
            `/${pagesDir}/islands/${name}${extension}`,
          );

          const params = new URLSearchParams(query);
          let props = {};
          const rawProps = params.get('props');
          if (rawProps) {
            try {
              props = JSON.parse(rawProps);
            } catch {
              res.statusCode = 400;
              res.end('Invalid island props');
              return;
            }
          }

          const host = req.headers.host ?? 'localhost';
          const request = new Request(`http://${host}${rawUrl}`, {
            method: 'GET',
          });

          const html = await renderIsland(mod, { name, props, request });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(html);
        } catch (error) {
          server.config.logger.error(
            `${LOG_PREFIX} island "${name}" render failed: ${
              error instanceof Error ? error.stack ?? error.message : error
            }`,
          );
          res.statusCode = 500;
          res.end('Island render failed');
        }
      });
    },
  };
}

/**
 * Dev-only image optimization. Rewrites `<img>` tags in rendered pages the
 * same way `sitelo build` does, and serves the generated variants from the
 * shared cache so dev and production markup match.
 */
function imagesDevPlugin({ root, pagesDir = 'src', publicDir, base, options }) {
  const pipeline = createDevImagePipeline({
    root,
    pagesDir,
    publicDir,
    base,
    options,
  });

  return {
    name: 'sitelo:images-dev',

    configureServer(server) {
      server.middlewares.use(pipeline.middleware);
    },

    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        try {
          return await pipeline.transform(html);
        } catch (error) {
          console.warn(
            `${LOG_PREFIX} images disabled for this request: ${
              error instanceof Error ? error.message : error
            }`,
          );
          return html;
        }
      },
    },
  };
}

function resolvePublicDir(viteOptions) {
  return viteOptions?.publicDir === false
    ? false
    : (viteOptions?.publicDir ?? 'public');
}

function definedEntries(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
}

function buildInlineConfig(cli, command, viteFromSitelo = {}) {
  const mode = cli.mode ?? (command === 'build' ? 'production' : 'development');
  const logLevel = cli.logLevel ?? 'info';

  const cliLayer = {
    root: cli.root,
    configFile: cli.config,
    mode,
    logLevel,
    clearScreen: cli.clearScreen,
    customLogger: createLogger(logLevel, {
      prefix: LOG_PREFIX,
      allowClearScreen: cli.clearScreen !== false,
    }),
    ...definedEntries({
      base: cli.base,
    }),
    build: definedEntries({
      outDir: cli.outDir,
      assetsDir: cli.assetsDir,
      emptyOutDir: cli.emptyOutDir,
    }),
  };

  if (command === 'dev' || command === 'preview') {
    cliLayer.server = definedEntries({
      host: cli.host,
      port: cli.port,
      strictPort: cli.strictPort || undefined,
      open: cli.open,
    });
  }

  if (command === 'preview') {
    cliLayer.preview = definedEntries({
      host: cli.host,
      port: cli.port,
      strictPort: cli.strictPort || undefined,
      open: cli.open,
    });
  }

  // sitelo.config.js `vite` first; explicit CLI flags override.
  return mergeConfig(viteFromSitelo, cliLayer);
}

async function runDev(cli) {
  const mode = cli.mode ?? 'development';
  const { plugins, viteOptions, pluginOptions, images } =
    await resolveSiteloConfig({
      root: cli.root,
      configFile: cli.config,
      command: 'serve',
      mode,
      debug: cli.debug,
    });

  const imageOptions = normalizeImageOptions(images);

  const server = await createServer(
    mergeConfig(buildInlineConfig(cli, 'dev', viteOptions), {
      plugins: [
        islandsDevPlugin({
          root: cli.root,
          pagesDir: pluginOptions?.pagesDir,
        }),
        ...(imageOptions?.dev
          ? [
              imagesDevPlugin({
                root: cli.root,
                pagesDir: pluginOptions?.pagesDir,
                publicDir: resolvePublicDir(viteOptions),
                base: cli.base ?? viteOptions?.base,
                options: imageOptions,
              }),
            ]
          : []),
        ...plugins,
      ],
    }),
  );

  await server.listen();
  server.printUrls();
}

async function runBuild(cli) {
  const mode = cli.mode ?? 'production';
  const { plugins, viteOptions, pagefind, images } = await resolveSiteloConfig({
    root: cli.root,
    configFile: cli.config,
    command: 'build',
    mode,
    debug: cli.debug,
  });

  const inline = buildInlineConfig(cli, 'build', viteOptions);
  await build(mergeConfig(inline, { plugins }));

  const outDir =
    cli.outDir ?? viteOptions?.build?.outDir ?? inline.build?.outDir ?? 'dist';
  const publicDir = resolvePublicDir(viteOptions);

  // Images first: pagefind should index the final HTML.
  const imageOptions = normalizeImageOptions(images);
  if (imageOptions) {
    await runImages({
      root: cli.root,
      outDir,
      base: cli.base ?? viteOptions?.base ?? '/',
      options: imageOptions,
    });
  }

  const pagefindOptions = normalizePagefindOptions(pagefind);
  if (!pagefindOptions) return;

  await runPagefind({
    root: cli.root,
    outDir,
    publicDir,
    options: pagefindOptions,
  });
}

async function runPreview(cli) {
  const mode = cli.mode ?? 'production';
  const { plugins, viteOptions } = await resolveSiteloConfig({
    root: cli.root,
    configFile: cli.config,
    command: 'serve',
    mode,
    debug: cli.debug,
  });

  const previewServer = await preview(
    mergeConfig(buildInlineConfig(cli, 'preview', viteOptions), { plugins }),
  );

  previewServer.printUrls();
}

async function main() {
  let cli;

  try {
    cli = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`[sitelo] ${error.message}`);
    process.exit(1);
  }

  if (cli.help) {
    printHelp();
    return;
  }

  if (cli.version) {
    console.log(VERSION);
    return;
  }

  try {
    switch (cli.command) {
      case 'dev':
        await runDev(cli);
        break;
      case 'build':
        await runBuild(cli);
        break;
      case 'preview':
        await runPreview(cli);
        break;
      default:
        throw new Error(`Unknown command: ${cli.command}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[sitelo] ${message}`);
    if (cli.debug && error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
