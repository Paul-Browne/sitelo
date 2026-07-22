import { invalidHtmlReturn, pageError, missingDefaultExport } from './errors';
import { validateStaticJsxTree } from './react-static-validation';
import type {
  HtPageInfo,
  HtPageModule,
  HtPageRenderContext,
  HtPageRenderResult,
  HtStructuredPageModule,
} from './types';

export function isStructuredPageModule(value: unknown): value is HtStructuredPageModule {
  return (
    typeof value === 'object' &&
    value !== null &&
    'render' in value &&
    typeof (value as { render?: unknown }).render === 'function'
  );
}

function ensureDoctype(html: string): string {
  const trimmed = html.trimStart();

  if (/^<!doctype html>/i.test(trimmed)) {
    return html;
  }

  if (/^<html[\s>]/i.test(trimmed)) {
    return '<!DOCTYPE html>' + html;
  }

  return html;
}

async function isRenderableReactResult(value: unknown): Promise<boolean> {
  try {
    const react = await import('react');
    return (
      value == null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      Array.isArray(value) ||
      react.isValidElement(value)
    );
  } catch {
    return false;
  }
}

async function renderReactResult(value: unknown): Promise<string> {
  const { renderToStaticMarkup } = await import('react-dom/server');
  return renderToStaticMarkup(value as any);
}

async function resolveRenderResult(
  page: HtPageInfo,
  mod: HtPageModule,
  ctx: HtPageRenderContext,
): Promise<HtPageRenderResult> {
  const entry = mod.default;

  if (entry == null) {
    throw missingDefaultExport(page);
  }

  if (typeof entry === 'string') {
    return entry;
  }

  if (typeof entry === 'function') {
    return await entry(ctx);
  }

  if (isStructuredPageModule(entry)) {
    if (typeof entry.data === 'function') {
      ctx.data = await entry.data(ctx);
    }

    return await entry.render(ctx);
  }

  throw invalidHtmlReturn(page, entry);
}

async function ensureReactAvailable(page: HtPageInfo): Promise<void> {
  try {
    await import('react');
    await import('react-dom/server');
  } catch {
    throw new Error(
      `[sitelo] ${page.relativePath}: TSX/JSX page rendering requires "react" and "react-dom" to be installed in the consuming app.`,
    );
  }
}

export async function renderPage(
  page: HtPageInfo,
  mod: HtPageModule,
  dev = false,
): Promise<string> {
  const ctx: HtPageRenderContext = {
    page,
    params: page.params,
    dev,
  };

  try {
    if (typeof mod.data === 'function') {
      ctx.data = await mod.data(ctx);
    }

    const result = await resolveRenderResult(page, mod, ctx);

    // A missing `return` would otherwise sail through the React path and
    // silently emit an empty page.
    if (result == null) {
      throw invalidHtmlReturn(page, result);
    }

    if (typeof result === 'string') {
      return ensureDoctype(result);
    }
    
    await ensureReactAvailable(page);
    
    const looksReactRenderable = await isRenderableReactResult(result);

    if (!looksReactRenderable) {
      throw invalidHtmlReturn(page, result);
    }

    if (dev) {
      await validateStaticJsxTree(result, {
        page,
        onWarn(message) {
          console.warn(message);
        },
      });
    }

    const html = await renderReactResult(result);

    return ensureDoctype(html);
  } catch (error) {
    throw pageError(page, error);
  }
}