/**
 * Locale registry for the docs site.
 *
 * English lives at the root (`/docs/routing`), Spanish under `/es`
 * (`/es/docs/routing`). Page files mirror that: `src/docs/routing.ht.js`
 * and `src/es/docs/routing.ht.js`.
 */

export const DEFAULT_LOCALE = 'en'
export const LOCALES = ['en', 'es']

/** Display names for the language switcher, in each language's own words. */
export const LOCALE_NAMES = {
  en: 'English',
  es: 'Español',
}

/** BCP 47 tags for `<html lang>` and `hreflang`. */
export const LOCALE_TAGS = {
  en: 'en',
  es: 'es',
}

/**
 * Root-relative paths that exist in every locale.
 *
 * Keyed by the English path. The language switcher and the `hreflang`
 * alternates are emitted only for these — `/examples` is English-only, so
 * offering a Spanish URL for it would link to a 404.
 */
export const TRANSLATED_PATHS = new Set([
  '/',
  '/about',
  '/docs',
  '/docs/pages',
  '/docs/routing',
  '/docs/data',
  '/docs/islands',
  '/docs/assets',
  '/docs/images',
  '/docs/typescript',
  '/docs/configuration',
  '/docs/cli',
  '/docs/deployment',
  '/docs/build-with-ai',
])

/** Strip any locale prefix, returning the canonical English path. */
export function basePath(path) {
  if (path === '/es') return '/'
  if (path.startsWith('/es/')) return path.slice(3)
  return path
}

/** Render a path in `lang`. `localePath('/docs', 'es')` → `/es/docs`. */
export function localePath(path, lang) {
  const base = basePath(path)
  if (lang === DEFAULT_LOCALE) return base
  return base === '/' ? '/es' : `/es${base}`
}

/** Does this path have a counterpart in every locale? */
export function isTranslated(path) {
  return TRANSLATED_PATHS.has(basePath(path))
}

/**
 * Chrome strings — nav, sidebar, code-block controls, footer.
 *
 * Page prose is not here: it lives in the page files themselves, one set per
 * locale under `src/` and `src/es/`.
 */
const STRINGS = {
  en: {
    navDocs: 'Docs',
    navExamples: 'Examples',
    navAbout: 'About',
    openMenu: 'Open menu',
    menu: 'Menu',
    languageLabel: 'Language',
    sidebarDocs: 'Documentation',
    sidebarExamples: 'Examples',
    titleSuffixDocs: 'sitelo docs',
    titleSuffixExamples: 'sitelo examples',
    tocLabel: 'On this page',
    pagenavLabel: 'Adjacent pages',
    previous: '← Previous',
    next: 'Next →',
    copy: 'Copy',
    copyCode: 'Copy code',
    copied: 'Copied',
    copyFailed: 'Failed',
    markupStyle: 'Markup style',
    templateLiteral: 'Template literal',
    recommended: 'recommended',
    licenseLabel: 'MIT license',
    nodeLabel: 'Requires Node 20.19 or newer',
    githubLabel: (version) => `sitelo ${version} on GitHub`,
    viteLabel: (version) => `Powered by Vite ${version}`,
    defaultDescription:
      'sitelo — static site generation for Vite. Write functions that return HTML.',
  },
  es: {
    navDocs: 'Docs',
    navExamples: 'Ejemplos',
    navAbout: 'Acerca de',
    openMenu: 'Abrir menú',
    menu: 'Menú',
    languageLabel: 'Idioma',
    sidebarDocs: 'Documentación',
    sidebarExamples: 'Ejemplos',
    titleSuffixDocs: 'documentación de sitelo',
    titleSuffixExamples: 'ejemplos de sitelo',
    tocLabel: 'En esta página',
    pagenavLabel: 'Páginas adyacentes',
    previous: '← Anterior',
    next: 'Siguiente →',
    copy: 'Copiar',
    copyCode: 'Copiar código',
    copied: 'Copiado',
    copyFailed: 'Error',
    markupStyle: 'Estilo de marcado',
    templateLiteral: 'Plantilla literal',
    recommended: 'recomendado',
    licenseLabel: 'Licencia MIT',
    nodeLabel: 'Requiere Node 20.19 o superior',
    githubLabel: (version) => `sitelo ${version} en GitHub`,
    viteLabel: (version) => `Con tecnología de Vite ${version}`,
    defaultDescription:
      'sitelo — generación de sitios estáticos para Vite. Escribe funciones que devuelven HTML.',
  },
}

/** Chrome strings for `lang`, falling back to English. */
export function strings(lang) {
  return STRINGS[lang] ?? STRINGS[DEFAULT_LOCALE]
}
