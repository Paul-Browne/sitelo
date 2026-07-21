import type { HtPageInfo } from './types';
import { PLUGIN_NAME } from './constants';

export function invalidHtmlReturn(page: HtPageInfo, value: unknown): Error {
  const type =
    value === null
      ? 'null'
      : Array.isArray(value)
        ? 'array'
        : typeof value;

  return new Error(
    `[orivo] ${page.relativePath}: page render must return a string or a JSX/React renderable value, but received ${type}.`,
  );
}

export function missingDefaultExport(page: HtPageInfo): Error {
  return new Error(
    `[${PLUGIN_NAME}] Page "${page.relativePath}" does not export a default renderer`,
  );
}

export function pageError(page: HtPageInfo, cause: unknown): Error {
  const message = `[${PLUGIN_NAME}] Failed to render "${page.relativePath}" at route "${page.routePath}"`;

  if (cause instanceof Error) {
    const err = new Error(`${message}: ${cause.message}`);

    if (cause.stack) {
      err.stack = `${err.stack}\nCaused by:\n${cause.stack}`;
    }

    return err;
  }

  return new Error(`${message}: ${String(cause)}`);
}