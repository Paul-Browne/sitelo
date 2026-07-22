import htmlPages from 'vite-plugin-html-pages';

export * from 'vite-plugin-html-pages';

/**
 * Sitelo’s default plugin entry. Same as vite-plugin-html-pages, with
 * sitelo branding for generated types and log/error prefixes.
 */
export default function sitelo(options = {}) {
  return htmlPages({
    ...options,
    generatedTypesDir: options.generatedTypesDir ?? '.sitelo/types',
    displayName: options.displayName ?? 'sitelo',
  });
}
