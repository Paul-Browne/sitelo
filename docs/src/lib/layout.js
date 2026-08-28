import {
  a,
  aside,
  body,
  details,
  div,
  footer,
  h1,
  head,
  header,
  html,
  img,
  li,
  link,
  main,
  meta,
  nav,
  p,
  script,
  span,
  summary,
  title,
  ul,
} from 'javascript-to-html'

import { createRequire } from 'node:module'

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_NAMES,
  LOCALE_SHORT,
  LOCALE_TAGS,
  OG_LOCALES,
  basePath,
  isTranslated,
  localePath,
  strings,
} from './i18n.js'
import { docNav, exampleNav } from './nav.js'

const require = createRequire(import.meta.url)
const viteVersion = require('vite/package.json').version
const siteloVersion = require('../../../package.json').version

const viteBolt = `<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 11-13h-8z"/></svg>`

const SITE_URL = 'https://sitelo.js.org'

function badge({ variant, href, label, name, value, icon, external = true }) {
  return a(
    {
      class: `badge ${variant}`,
      href,
      'aria-label': label,
      ...(external ? { rel: 'noopener', target: '_blank' } : {}),
    },
    span({ class: 'badge-name' }, icon ?? '', name),
    span({ class: 'badge-value' }, value),
  )
}

/**
 * EN / ES switcher pointing at the same page in the other locale.
 *
 * Rendered only for paths that exist in both locales — `/examples` is
 * English-only, so a switcher there would link to a missing page.
 */
function languageSwitch(activeHref, lang) {
  if (activeHref == null || !isTranslated(activeHref)) return ''

  const t = strings(lang)

  return nav(
    { class: 'lang-switch', 'aria-label': t.languageLabel },
    ...LOCALES.map((locale) => {
      const current = locale === lang
      return a(
        {
          href: localePath(activeHref, locale),
          hreflang: LOCALE_TAGS[locale],
          lang: LOCALE_TAGS[locale],
          'aria-label': LOCALE_NAMES[locale],
          // Spread rather than pass `undefined`: an `aria-current="undefined"`
          // is an invalid token, and browsers fall back to treating it as
          // "true" — which would mark every language as the current one.
          ...(current ? { class: 'is-active', 'aria-current': 'true' } : {}),
        },
        LOCALE_SHORT[locale],
      )
    }),
  )
}

function siteNav(activeHref = '/', lang = DEFAULT_LOCALE) {
  const t = strings(lang)
  const base = basePath(activeHref)

  const onDocs = base.startsWith('/docs')
  const onExamples = base.startsWith('/examples')
  const onAbout = base === '/about'

  const links = [
    a(
      { class: onDocs ? 'is-active' : undefined, href: localePath('/docs', lang) },
      t.navDocs,
    ),
    a(
      {
        class: onExamples ? 'is-active' : undefined,
        href: localePath('/examples', lang),
      },
      t.navExamples,
    ),
    a(
      {
        class: onAbout ? 'is-active' : undefined,
        href: localePath('/about', lang),
      },
      t.navAbout,
    ),
    a(
      {
        href: 'https://github.com/paul-browne/sitelo',
        rel: 'noopener',
      },
      'GitHub',
    ),
    a(
      {
        href: 'https://www.npmjs.com/package/sitelo',
        rel: 'noopener',
      },
      'npm',
    ),
  ]

  const switcher = languageSwitch(activeHref, lang)

  return nav(
    { class: 'nav' },
    a(
      { class: 'nav-brand', href: localePath('/', lang) },
      img({
        class: 'nav-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '120',
        height: '34',
      }),
    ),
    div({ class: 'nav-links' }, ...links, switcher),
    details(
      { class: 'nav-menu' },
      summary({ class: 'nav-menu-toggle', 'aria-label': t.openMenu }, t.menu),
      div({ class: 'nav-menu-panel' }, ...links, switcher),
    ),
  )
}

function siteFooter(lang = DEFAULT_LOCALE) {
  const t = strings(lang)

  return footer(
    { class: 'footer' },
    p(`© Paul Browne ${new Date().getFullYear()}`),
    p(
      { class: 'footer-meta' },
      badge({
        variant: 'badge-sitelo',
        href: 'https://github.com/paul-browne/sitelo',
        label: t.githubLabel(siteloVersion),
        name: 'sitelo',
        value: `v${siteloVersion}`,
      }),
      badge({
        variant: 'badge-license',
        href: '/license.txt',
        label: t.licenseLabel,
        name: 'license',
        value: 'MIT',
        external: false,
      }),
      badge({
        variant: 'badge-node',
        href: 'https://nodejs.org/docs/latest/api/',
        label: t.nodeLabel,
        name: 'node',
        value: '20.19+',
      }),
      badge({
        variant: 'badge-vite',
        href: 'https://vite.dev',
        label: t.viteLabel(viteVersion),
        name: 'vite',
        value: `v${viteVersion}`,
        icon: viteBolt,
      }),
    ),
  )
}

function sideNav({ label, items, activeHref }) {
  return aside(
    { class: 'docs-sidebar', 'aria-label': label },
    div({ id: 'docs-search' }),
    p({ class: 'docs-sidebar-label' }, label),
    nav(
      { class: 'docs-side-nav' },
      ...items.map((item) =>
        a(
          {
            href: item.href,
            class: item.href === activeHref ? 'is-active' : undefined,
          },
          item.label,
        ),
      ),
    ),
  )
}

/** `hreflang` alternates so search engines pair the two language versions. */
function alternateLinks(path) {
  if (path == null || !isTranslated(path)) return []

  return [
    ...LOCALES.map((locale) =>
      link({
        rel: 'alternate',
        hreflang: LOCALE_TAGS[locale],
        href: `${SITE_URL}${localePath(path, locale)}`,
      }),
    ),
    link({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_URL}${basePath(path)}`,
    }),
  ]
}

function pageShell({
  pageTitle,
  description,
  bodyClass = '',
  path,
  lang = DEFAULT_LOCALE,
  children,
}) {
  const t = strings(lang)
  const content = Array.isArray(children) ? children : [children]
  const pageDescription = description ?? t.defaultDescription
  const canonical = path != null ? `${SITE_URL}${path}` : undefined

  return html(
    { lang: LOCALE_TAGS[lang] },
    head(
      meta({ charset: 'utf-8' }),
      meta({
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      }),
      meta({
        name: 'description',
        content: pageDescription,
      }),
      title(pageTitle),
      link({ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }),
      link({ rel: 'apple-touch-icon', href: '/icon-192.png' }),
      link({ rel: 'manifest', href: '/manifest.webmanifest' }),
      meta({ name: 'theme-color', content: '#071410' }),
      canonical ? link({ rel: 'canonical', href: canonical }) : '',
      ...alternateLinks(path),
      meta({ property: 'og:title', content: pageTitle }),
      meta({ property: 'og:description', content: pageDescription }),
      meta({ property: 'og:type', content: 'website' }),
      meta({ property: 'og:locale', content: OG_LOCALES[lang] }),
      canonical ? meta({ property: 'og:url', content: canonical }) : '',
      meta({
        property: 'og:image',
        content: `${SITE_URL}/logo.png`,
      }),
      meta({ name: 'twitter:card', content: 'summary' }),
      link({ rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
      link({
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      }),
      link({
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@500;600;700&family=Source+Sans+3:wght@400;600&display=swap',
      }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      { class: bodyClass },
      div({ id: 'atmosphere', class: 'atmosphere', 'aria-hidden': 'true' }),
      ...content,
      script({ type: 'module', src: '/main.js' }),
    ),
  )
}

/** German spells out its umlauts when transliterating: ä → ae, ß → ss. */
const DE_TRANSLITERATIONS = [
  [/ä/g, 'ae'],
  [/ö/g, 'oe'],
  [/ü/g, 'ue'],
  [/ß/g, 'ss'],
]

/**
 * Locales whose headings are folded to unaccented ASCII.
 *
 * Deliberately excludes the non-Latin scripts: NFD decomposition would turn
 * Russian "й" into "и" and "ё" into "е", quietly changing the word.
 */
const FOLD_TO_ASCII = new Set(['en', 'es', 'fr', 'de'])

/**
 * Slugify a heading for use as an anchor id.
 *
 * Latin-script locales fold to ASCII, so a Spanish heading like "Optimización
 * de imágenes" slugs to `optimizacion-de-imagenes` rather than losing every
 * accented letter to a dash. German first spells its umlauts out, giving
 * `jsx-einschraenkungen` rather than `jsx-einschrankungen`.
 *
 * Russian and Chinese keep their own characters — HTML5 ids allow them, and
 * stripping to ASCII would leave every heading with an empty or colliding id.
 */
function slugify(text, lang) {
  let value = text.toLowerCase()

  if (lang === 'de') {
    for (const [pattern, replacement] of DE_TRANSLITERATIONS) {
      value = value.replace(pattern, replacement)
    }
  }

  if (FOLD_TO_ASCII.has(lang)) {
    value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  return value
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/** Add ids to <h2> headings and collect them for a table of contents. */
function withHeadingAnchors(content, lang) {
  const headings = []

  const transformed = content.map((chunk) =>
    String(chunk).replace(/<h2>(.*?)<\/h2>/g, (match, inner) => {
      const text = inner.replace(/<[^>]*>/g, '')
      const slug = slugify(text, lang)
      headings.push({ slug, text })
      return `<h2 id="${slug}">${inner}</h2>`
    }),
  )

  return { transformed, headings }
}

function tableOfContents(headings, lang) {
  if (headings.length < 3) return ''

  const t = strings(lang)

  return nav(
    { class: 'docs-toc', 'aria-label': t.tocLabel },
    p({ class: 'docs-toc-label' }, t.tocLabel),
    ul(...headings.map(({ slug, text }) => li(a({ href: `#${slug}` }, text)))),
  )
}

function pageNav(items, activeHref, lang) {
  const index = items.findIndex((item) => item.href === activeHref)
  if (index === -1) return ''

  const previous = index > 0 ? items[index - 1] : null
  const next = index < items.length - 1 ? items[index + 1] : null
  if (!previous && !next) return ''

  const t = strings(lang)

  const pageNavLink = (item, direction) =>
    a(
      { class: `docs-pagenav-link docs-pagenav-${direction}`, href: item.href },
      span(
        { class: 'docs-pagenav-direction' },
        direction === 'prev' ? t.previous : t.next,
      ),
      span({ class: 'docs-pagenav-label' }, item.label),
    )

  return nav(
    { class: 'docs-pagenav', 'aria-label': t.pagenavLabel },
    previous ? pageNavLink(previous, 'prev') : span(),
    next ? pageNavLink(next, 'next') : span(),
  )
}

function guideLayout({
  title: heading,
  description,
  activeHref,
  sidebarLabel,
  sidebarItems,
  titleSuffix,
  lang,
  children,
}) {
  const content = Array.isArray(children) ? children : [children]
  const { transformed, headings } = withHeadingAnchors(content, lang)

  return pageShell({
    pageTitle: `${heading} · ${titleSuffix}`,
    description,
    bodyClass: 'page-docs',
    path: activeHref,
    lang,
    children: [
      header(
        { class: 'topbar' },
        div({ class: 'topbar-inner' }, siteNav(activeHref, lang)),
      ),
      div(
        { class: 'docs-shell' },
        sideNav({
          label: sidebarLabel,
          items: sidebarItems,
          activeHref,
        }),
        main(
          { class: 'docs-main', 'data-pagefind-body': '' },
          h1(heading),
          tableOfContents(headings, lang),
          ...transformed,
          pageNav(sidebarItems, activeHref, lang),
        ),
      ),
      siteFooter(lang),
    ],
  })
}

/** Layouts bound to a locale. */
export function createLayouts(lang = DEFAULT_LOCALE) {
  const t = strings(lang)

  function landingLayout({ children, pageTitle, description }) {
    const content = Array.isArray(children) ? children : [children]
    const activeHref = localePath('/', lang)

    return pageShell({
      pageTitle,
      description,
      bodyClass: 'page-landing',
      path: activeHref,
      lang,
      children: [
        header(
          { class: 'topbar' },
          div({ class: 'topbar-inner' }, siteNav(activeHref, lang)),
        ),
        ...content,
        siteFooter(lang),
      ],
    })
  }

  function pageLayout({ title: heading, description, activeHref, children }) {
    const content = Array.isArray(children) ? children : [children]

    return pageShell({
      pageTitle: heading,
      description,
      bodyClass: 'page-content',
      path: activeHref,
      lang,
      children: [
        header(
          { class: 'topbar' },
          div({ class: 'topbar-inner' }, siteNav(activeHref, lang)),
        ),
        main({ class: 'content-main' }, h1(heading), ...content),
        siteFooter(lang),
      ],
    })
  }

  function docsLayout(args) {
    return guideLayout({
      ...args,
      lang,
      sidebarLabel: t.sidebarDocs,
      sidebarItems: docNav(lang),
      titleSuffix: t.titleSuffixDocs,
    })
  }

  function examplesLayout(args) {
    return guideLayout({
      ...args,
      lang,
      sidebarLabel: t.sidebarExamples,
      sidebarItems: exampleNav(lang),
      titleSuffix: t.titleSuffixExamples,
    })
  }

  return { landingLayout, pageLayout, docsLayout, examplesLayout }
}

const en = createLayouts(DEFAULT_LOCALE)

export const landingLayout = en.landingLayout
export const pageLayout = en.pageLayout
export const docsLayout = en.docsLayout
export const examplesLayout = en.examplesLayout
