import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import * as esbuild from 'esbuild';
import fsSync from 'node:fs';

export interface StaticAssetFile {
  absolutePath: string;
  relativePathFromSrc: string;
  outputFileName: string;
  kind: 'copy' | 'process';
}

export interface CollectStaticAssetsArgs {
  root: string;
  pagesDir: string;
  pageExtensions: string[];
}

function normalizeSlashes(value: string): string {
  return value.replace(/\\/g, '/');
}

function hasAnySuffix(value: string, suffixes: string[]): boolean {
  return suffixes.some((suffix) => value.endsWith(suffix));
}

function shouldIgnoreFile(rel: string): boolean {
  return (
    rel.endsWith('.d.ts') ||
    rel.endsWith('.map') ||
    rel.endsWith('.tsbuildinfo') ||
    rel.startsWith('.') ||
    rel.includes('/.')
  );
}

function isProcessableAsset(rel: string): boolean {
  return (
    rel.endsWith('.js') ||
    rel.endsWith('.mjs') ||
    rel.endsWith('.ts') ||
    rel.endsWith('.css')
  );
}

function toOutputFileName(relativePathFromSrc: string): string {
  if (relativePathFromSrc.endsWith('.ts')) {
    return relativePathFromSrc.slice(0, -3) + '.js';
  }
  return relativePathFromSrc;
}

export async function collectStaticAssets(
  args: CollectStaticAssetsArgs,
): Promise<StaticAssetFile[]> {
  const { root, pagesDir, pageExtensions } = args;
  const srcDir = path.join(root, pagesDir);

  const entries = await fg('**/*', {
    cwd: srcDir,
    onlyFiles: true,
    dot: false,
    absolute: false,
  });

  const assets: StaticAssetFile[] = [];

  for (const entry of entries) {
    const rel = normalizeSlashes(entry);

    if (shouldIgnoreFile(rel)) continue;
    if (hasAnySuffix(rel, pageExtensions)) continue;

    const absolutePath = path.join(srcDir, rel);

    assets.push({
      absolutePath,
      relativePathFromSrc: rel,
      outputFileName: normalizeSlashes(toOutputFileName(rel)),
      kind: isProcessableAsset(rel) ? 'process' : 'copy',
    });
  }

  return assets;
}

export async function copyStaticAssetSource(
  asset: StaticAssetFile,
): Promise<Uint8Array> {
  return fs.readFile(asset.absolutePath);
}

export async function buildProcessedStaticAssets(args: {
    root: string;
    pagesDir: string;
    assets: StaticAssetFile[];
    minify?: boolean;
    sourcemap?: boolean;
  }): Promise<Map<string, string | Uint8Array>> {
    const { root, pagesDir, assets, minify = true, sourcemap = false } = args;
  
    const processable = assets.filter((a) => a.kind === 'process');
    const out = new Map<string, string | Uint8Array>();
  
    if (processable.length === 0) {
      return out;
    }
  
    const srcDir = path.join(root, pagesDir);
    const distDir = path.join(root, 'dist');
    const warnedMissingAssets = new Set<string>();
    const result = await esbuild.build({
      entryPoints: processable.map((a) => a.absolutePath),
      absWorkingDir: root,
      outbase: srcDir,
      outdir: distDir,
      bundle: true,
      splitting: true,
      treeShaking: true,
      minify,
      sourcemap,
      format: 'esm',
      target: 'esnext',
      platform: 'browser',
      write: false,
      entryNames: '[dir]/[name]',
      assetNames: '[dir]/[name]',
      loader: {
        '.css': 'css',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.svg': 'file',
        '.webp': 'file',
        '.woff': 'file',
        '.woff2': 'file',
        '.ttf': 'file',
        '.otf': 'file',
      },
      plugins: [
        {
          name: 'html-pages-root-url-resolver',
          setup(build) {
            build.onResolve({ filter: /^\// }, (resolveArgs) => {
              // Leave real filesystem absolute paths alone
              if (
                path.isAbsolute(resolveArgs.path) &&
                fsSync.existsSync(resolveArgs.path)
              ) {
                return { path: resolveArgs.path };
              }
      
              const cleanPath = resolveArgs.path.slice(1);
      
              const fromSrc = path.join(srcDir, cleanPath);
              if (fsSync.existsSync(fromSrc)) {
                return { path: fromSrc };
              }
      
              const fromPublic = path.join(root, 'public', cleanPath);
              if (fsSync.existsSync(fromPublic)) {
                return {
                  path: resolveArgs.path,
                  external: true,
                };
              }
      
              const isCssUrlToken = resolveArgs.kind === 'url-token';
      
              if (isCssUrlToken) {
                if (!warnedMissingAssets.has(resolveArgs.path)) {
                  warnedMissingAssets.add(resolveArgs.path);
                  console.warn(
                    `[orivo] ⚠️ Missing CSS asset: ${resolveArgs.path}\n` +
                    `  Looked in:\n` +
                    `  - ${fromSrc}\n` +
                    `  - ${fromPublic}`
                  );
                }
      
                // Keep the original root-relative URL in output CSS
                return {
                  path: resolveArgs.path,
                  external: true,
                };
              }
      
              // JS/CSS entry imports remain strict
              return {
                path: fromSrc,
              };
            });
          },
        },
      ],
    });
  
    for (const file of result.outputFiles) {
      const rel = normalizeSlashes(path.relative(distDir, file.path));
      out.set(rel, file.text ?? file.contents);
    }
  
    return out;
  }
