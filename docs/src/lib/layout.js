import {
  a,
  aside,
  body,
  button,
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
  LOCALE_FLAGS,
  LOCALE_NAMES,
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

/** Background behind the browser chrome, mirroring `--paper` in each theme. */
const THEME_COLORS = {
  dark: '#071410',
  light: '#eef3f0',
}

/**
 * Resolves the theme before the first paint, so a visitor who chose light
 * never sees a dark flash on the way in.
 *
 * Inline and blocking on purpose — anything deferred paints first. It always
 * resolves to a concrete `light` or `dark`, which is why the stylesheet needs
 * only one `[data-theme]` block rather than a matching media query. With
 * JavaScript off nothing runs, no attribute is set, and the site stays dark.
 */
const themeBootScript = `(function(){var s;try{s=localStorage.getItem('sitelo-theme')}catch(e){}var t=s==='light'||s==='dark'?s:window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'${THEME_COLORS.light}':'${THEME_COLORS.dark}')})()`

const sunIcon = `<svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.2v2.2M12 19.6v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.2 12h2.2M19.6 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>`

const moonIcon = `<svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 13.1A8.6 8.6 0 1 1 10.9 3.2a6.9 6.9 0 0 0 9.9 9.9z"/></svg>`

/**
 * Theme toggle: an icon-only button in the desktop bar, an icon and a label
 * in the mobile menu, where every other row is labelled too.
 *
 * The server cannot know the visitor's theme, so the markup ships the label
 * for the dark default and `main.js` rewrites it once the theme is resolved.
 * The icon needs no such fix-up — CSS picks it straight off `data-theme`, so
 * it is already right on the first paint.
 */
function themeToggle(lang, variant = 'bar') {
  const t = strings(lang)
  const inList = variant === 'list'

  return button(
    {
      class: inList ? 'theme-toggle theme-toggle-row' : 'theme-toggle',
      type: 'button',
      'data-theme-toggle': '',
      ...(inList ? {} : { 'aria-label': t.themeToLight, title: t.themeToLight }),
    },
    sunIcon,
    moonIcon,
    inList ? span({ class: 'theme-toggle-label' }, t.themeToLight) : '',
  )
}

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

/** One row in the language switcher: flag + the language's own name. */
function languageOption(activeHref, locale, current) {
  return a(
    {
      class: current ? 'lang-option is-active' : 'lang-option',
      href: localePath(activeHref, locale),
      hreflang: LOCALE_TAGS[locale],
      lang: LOCALE_TAGS[locale],
      ...(current ? { 'aria-current': 'true' } : {}),
    },
    span({ class: 'lang-flag', 'aria-hidden': 'true' }, LOCALE_FLAGS[locale]),
    span({ class: 'lang-label' }, LOCALE_NAMES[locale]),
  )
}

/**
 * Language switcher, pointing at the same page in each locale.
 *
 * Rendered only for paths that exist in every locale, so a page without a
 * counterpart never offers a link to a missing translation.
 *
 * Two shapes: a `<details>` dropdown for the desktop bar, and a plain list for
 * inside the mobile menu — which is itself a `<details>`, and nesting one
 * dropdown in another to reach seven links is worse than just showing them.
 */
function languageSwitch(activeHref, lang, variant = 'dropdown') {
  if (activeHref == null || !isTranslated(activeHref)) return ''

  const t = strings(lang)
  const options = LOCALES.map((locale) =>
    languageOption(activeHref, locale, locale === lang),
  )

  if (variant === 'list') {
    return nav(
      { class: 'lang-list', 'aria-label': t.languageLabel },
      ...options,
    )
  }

  return details(
    { class: 'lang-switch' },
    summary(
      { class: 'lang-switch-toggle', 'aria-label': t.languageLabel },
      span({ class: 'lang-flag', 'aria-hidden': 'true' }, LOCALE_FLAGS[lang]),
      span({ class: 'lang-label' }, LOCALE_NAMES[lang]),
    ),
    nav(
      { class: 'lang-switch-panel', 'aria-label': t.languageLabel },
      ...options,
    ),
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
      {
        ...(onDocs ? { class: 'is-active' } : {}),
        href: localePath('/docs', lang),
      },
      t.navDocs,
    ),
    a(
      {
        ...(onExamples ? { class: 'is-active' } : {}),
        href: localePath('/examples', lang),
      },
      t.navExamples,
    ),
    a(
      {
        ...(onAbout ? { class: 'is-active' } : {}),
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
    div(
      { class: 'nav-links' },
      ...links,
      languageSwitch(activeHref, lang),
      themeToggle(lang),
    ),
    details(
      { class: 'nav-menu' },
      summary({ class: 'nav-menu-toggle', 'aria-label': t.openMenu }, t.menu),
      div(
        { class: 'nav-menu-panel' },
        ...links,
        themeToggle(lang, 'list'),
        languageSwitch(activeHref, lang, 'list'),
      ),
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
            ...(item.href === activeHref ? { class: 'is-active' } : {}),
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
      meta({ name: 'theme-color', content: THEME_COLORS.dark }),
      script(themeBootScript),
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
const FOLD_TO_ASCII = new Set(['en', 'es', 'fr', 'de', 'pt'])

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
