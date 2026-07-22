#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import htmlPages from 'vite-plugin-html-pages';
import {
  build,
  createServer,
  loadConfigFromFile,
  preview,
} from 'vite';

const PLUGIN_NAME = 'vite-plugin-html-pages';
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

async function loadSiteloConfig(root) {
  const configFile = findSiteloConfigFile(root);
  if (!configFile) return { options: undefined, configFile: undefined };

  const mod = await import(pathToFileURL(configFile).href);
  const options = mod.default ?? mod;

  if (options && typeof options !== 'object') {
    throw new Error(
      `[sitelo] ${path.basename(configFile)} must export a configuration object`,
    );
  }

  return { options, configFile };
}

async function resolvePluginInjection({ root, configFile, command, mode, debug }) {
  const { options: siteloOptions, configFile: siteloConfigFile } =
    await loadSiteloConfig(root);

  const hasPluginInUserConfig = await userConfigHasHtmlPagesPlugin({
    root,
    configFile,
    command,
    mode,
  });

  if (siteloOptions && hasPluginInUserConfig) {
    const viteConfigLabel = configFile ?? 'vite.config.*';
    throw new Error(
      `[sitelo] Found both ${path.basename(siteloConfigFile)} and a Vite config (${viteConfigLabel}) that already registers ${PLUGIN_NAME}.\n` +
        'Remove the plugin from vite.config or move its options into one place.',
    );
  }

  if (hasPluginInUserConfig) {
    return { plugins: [] };
  }

  return {
    plugins: [
      htmlPages({
        ...(siteloOptions ?? {}),
        debug: debug || Boolean(siteloOptions?.debug),
      }),
    ],
  };
}

function buildInlineConfig(cli, command) {
  const mode = cli.mode ?? (command === 'build' ? 'production' : 'development');
  const inline = {
    root: cli.root,
    configFile: cli.config,
    mode,
    logLevel: cli.logLevel ?? (cli.debug ? 'info' : undefined),
    clearScreen: cli.clearScreen,
    base: cli.base,
    build: {
      outDir: cli.outDir,
      assetsDir: cli.assetsDir,
      emptyOutDir: cli.emptyOutDir,
    },
  };

  if (command === 'dev' || command === 'preview') {
    inline.server = {
      host: cli.host,
      port: cli.port,
      strictPort: cli.strictPort,
      open: cli.open,
    };
  }

  if (command === 'preview') {
    inline.preview = {
      host: cli.host,
      port: cli.port,
      strictPort: cli.strictPort,
      open: cli.open,
    };
  }

  return inline;
}

async function runDev(cli) {
  const mode = cli.mode ?? 'development';
  const { plugins } = await resolvePluginInjection({
    root: cli.root,
    configFile: cli.config,
    command: 'serve',
    mode,
    debug: cli.debug,
  });

  const server = await createServer({
    ...buildInlineConfig(cli, 'dev'),
    plugins,
  });

  await server.listen();
  server.printUrls();
}

async function runBuild(cli) {
  const mode = cli.mode ?? 'production';
  const { plugins } = await resolvePluginInjection({
    root: cli.root,
    configFile: cli.config,
    command: 'build',
    mode,
    debug: cli.debug,
  });

  await build({
    ...buildInlineConfig(cli, 'build'),
    plugins,
  });
}

async function runPreview(cli) {
  const mode = cli.mode ?? 'production';
  const { plugins } = await resolvePluginInjection({
    root: cli.root,
    configFile: cli.config,
    command: 'serve',
    mode,
    debug: cli.debug,
  });

  const previewServer = await preview({
    ...buildInlineConfig(cli, 'preview'),
    plugins,
  });

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
