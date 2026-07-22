import htmlPages from 'vite-plugin-html-pages';

export * from 'vite-plugin-html-pages';

/**
 * Sitelo’s default plugin entry. Same as vite-plugin-html-pages, but
 * generated helper types land in `.sitelo/types` unless overridden.
 */
export default function sitelo(options = {}) {
  return htmlPages({
    ...options,
    generatedTypesDir: options.generatedTypesDir ?? '.sitelo/types',
  });
}
