import fs from 'node:fs/promises';
import path from 'node:path';

import type { HtPageInfo } from './types';
import { paramsTypeFromDefinitions } from './page-helper-generator';
import { normalizeFsPath, toPosix } from './path-utils';

function pageHelperModuleSource(page: HtPageInfo): string {
  const paramsType = paramsTypeFromDefinitions(page.paramDefinitions ?? []);

  return `export type PageParams = ${paramsType};

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
`;
}

function stripPageExtension(filePath: string): string {
  return filePath.replace(/\.(ht|html)\.(js|ts|jsx|tsx)$/i, '');
}

function getTypesFileName(page: HtPageInfo): string {
  if (!page.dynamic || page.paramDefinitions.length === 0) {
    return '$types.d.ts';
  }

  const parts = page.paramDefinitions.map((param) => {
    if (param.type === 'single') {
      return param.name;
    }

    if (param.type === 'catch-all') {
      return `${param.name}.all`;
    }

    return `${param.name}.opt`;
  });

  return `$types.${parts.join('.')}.d.ts`;
}

async function listFilesRecursive(dir: string): Promise<string[]> {
    let entries;
  
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
  
        if (entry.isDirectory()) {
          return listFilesRecursive(fullPath);
        }
  
        return [fullPath];
      }),
    );
  
    return files.flat();
  }
  
  async function removeEmptyDirectories(dir: string, stopAt: string): Promise<void> {
    const normalizedDir = normalizeFsPath(dir);
    const normalizedStopAt = normalizeFsPath(stopAt);
  
    if (normalizedDir === normalizedStopAt) {
      return;
    }
  
    let entries;
  
    try {
      entries = await fs.readdir(normalizedDir);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return;
      }
      throw error;
    }
  
    if (entries.length > 0) {
      return;
    }
  
    await fs.rmdir(normalizedDir);
    await removeEmptyDirectories(path.dirname(normalizedDir), normalizedStopAt);
  }

export function getGeneratedTypesRoot(root: string): string {
  return normalizeFsPath(path.join(root, '.orivo', 'types'));
}

export function getGeneratedHelperPath(args: {
  root: string;
  pagesDir: string;
  page: HtPageInfo;
}): string {
  const pagesRoot = normalizeFsPath(path.join(args.root, args.pagesDir));
  const relativeFromPagesDir = toPosix(
    path.relative(pagesRoot, args.page.absolutePath),
  );
  const withoutExt = stripPageExtension(relativeFromPagesDir);
  const outRoot = getGeneratedTypesRoot(args.root);
  const fileName = getTypesFileName(args.page);

  return normalizeFsPath(
    path.join(outRoot, path.dirname(withoutExt), fileName),
  );
}

async function removeStalePageTypeDeclarations(args: {
  root: string;
  expectedFiles: Set<string>;
}): Promise<void> {
  const outRoot = getGeneratedTypesRoot(args.root);
  const existingFiles = await listFilesRecursive(outRoot);

  const staleFiles = existingFiles.filter((file) => {
    if (!file.endsWith('.d.ts')) {
      return false;
    }

    return !args.expectedFiles.has(normalizeFsPath(file));
  });

  await Promise.all(
    staleFiles.map(async (file) => {
      await fs.unlink(file);
      await removeEmptyDirectories(path.dirname(file), outRoot);
    }),
  );
}

export async function writePageTypeDeclarations(args: {
  root: string;
  pagesDir: string;
  entries: HtPageInfo[];
}): Promise<void> {
  const outRoot = getGeneratedTypesRoot(args.root);

  await fs.mkdir(outRoot, { recursive: true });

  const outputs = args.entries.map((page) => ({
    page,
    outFile: getGeneratedHelperPath({
      root: args.root,
      pagesDir: args.pagesDir,
      page,
    }),
  }));

  const expectedFiles = new Set(
    outputs.map(({ outFile }) => normalizeFsPath(outFile)),
  );

  await Promise.all(
    outputs.map(async ({ page, outFile }) => {
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, pageHelperModuleSource(page), 'utf8');
    }),
  );

  await removeStalePageTypeDeclarations({
    root: args.root,
    expectedFiles,
  });
}