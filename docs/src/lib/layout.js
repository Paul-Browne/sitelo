import {
  a,
  aside,
  body,
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
  title,
  ul,
} from 'javascript-to-html'

import { createRequire } from 'node:module'

import { DOC_NAV, EXAMPLE_NAV } from './nav.js'

const require = createRequire(import.meta.url)
const viteVersion = require('vite/package.json').version
const siteloVersion = require('../../../package.json').version

const viteBolt = `<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 11-13h-8z"/></svg>`

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

function siteNav(activeHref = '/') {
  const onDocs = activeHref.startsWith('/docs')
  const onExamples = activeHref.startsWith('/examples')
  const onAbout = activeHref === '/about'

  return nav(
    { class: 'nav' },
    a(
      { class: 'nav-brand', href: '/' },
      img({
        class: 'nav-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '120',
        height: '34',
      }),
    ),
    a({ class: onDocs ? 'is-active' : undefined, href: '/docs' }, 'Docs'),
    a(
      { class: onExamples ? 'is-active' : undefined, href: '/examples' },
      'Examples',
    ),
    a({ class: onAbout ? 'is-active' : undefined, href: '/about' }, 'About'),
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
  )
}

function siteFooter() {
  return footer(
    { class: 'footer' },
    p(`© Paul Browne ${new Date().getFullYear()}`),
    p(
      { class: 'footer-meta' },
      badge({
        variant: 'badge-sitelo',
        href: 'https://github.com/paul-browne/sitelo',
        label: `sitelo ${siteloVersion} on GitHub`,
        name: 'sitelo',
        value: `v${siteloVersion}`,
      }),
      badge({
        variant: 'badge-license',
        href: '/license.txt',
        label: 'MIT license',
        name: 'license',
        value: 'MIT',
        external: false,
      }),
      badge({
        variant: 'badge-node',
        href: 'https://nodejs.org/docs/latest/api/',
        label: 'Requires Node 18 or newer',
        name: 'node',
        value: '18+',
      }),
      badge({
        variant: 'badge-vite',
        href: 'https://vite.dev',
        label: `Powered by Vite ${viteVersion}`,
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

const SITE_URL = 'https://sitelo.js.org'

function pageShell({ pageTitle, description, bodyClass = '', path, children }) {
  const content = Array.isArray(children) ? children : [children]
  const pageDescription =
    description ??
    'sitelo — static site generation for Vite. Write functions that return HTML.'
  const canonical = path != null ? `${SITE_URL}${path}` : undefined

  return html(
    { lang: 'en' },
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
      link({ rel: 'apple-touch-icon', href: '/logo.png' }),
      canonical ? link({ rel: 'canonical', href: canonical }) : '',
      meta({ property: 'og:title', content: pageTitle }),
      meta({ property: 'og:description', content: pageDescription }),
      meta({ property: 'og:type', content: 'website' }),
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

/** Add ids to <h2> headings and collect them for a table of contents. */
function withHeadingAnchors(content) {
  const headings = []

  const transformed = content.map((chunk) =>
    String(chunk).replace(/<h2>(.*?)<\/h2>/g, (match, inner) => {
      const text = inner.replace(/<[^>]*>/g, '')
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      headings.push({ slug, text })
      return `<h2 id="${slug}">${inner}</h2>`
    }),
  )

  return { transformed, headings }
}

function tableOfContents(headings) {
  if (headings.length < 3) return ''

  return nav(
    { class: 'docs-toc', 'aria-label': 'On this page' },
    p({ class: 'docs-toc-label' }, 'On this page'),
    ul(
      ...headings.map(({ slug, text }) => li(a({ href: `#${slug}` }, text))),
    ),
  )
}

function pageNav(items, activeHref) {
  const index = items.findIndex((item) => item.href === activeHref)
  if (index === -1) return ''

  const previous = index > 0 ? items[index - 1] : null
  const next = index < items.length - 1 ? items[index + 1] : null
  if (!previous && !next) return ''

  const pageNavLink = (item, direction) =>
    a(
      { class: `docs-pagenav-link docs-pagenav-${direction}`, href: item.href },
      span(
        { class: 'docs-pagenav-direction' },
        direction === 'prev' ? '← Previous' : 'Next →',
      ),
      span({ class: 'docs-pagenav-label' }, item.label),
    )

  return nav(
    { class: 'docs-pagenav', 'aria-label': 'Adjacent pages' },
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
  children,
}) {
  const content = Array.isArray(children) ? children : [children]
  const { transformed, headings } = withHeadingAnchors(content)

  return pageShell({
    pageTitle: `${heading} · ${titleSuffix}`,
    description,
    bodyClass: 'page-docs',
    path: activeHref,
    children: [
      header(
        { class: 'topbar' },
        div({ class: 'topbar-inner' }, siteNav(activeHref)),
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
          tableOfContents(headings),
          ...transformed,
          pageNav(sidebarItems, activeHref),
        ),
      ),
      siteFooter(),
    ],
  })
}

export function landingLayout({ children, pageTitle, description }) {
  const content = Array.isArray(children) ? children : [children]

  return pageShell({
    pageTitle,
    description,
    bodyClass: 'page-landing',
    path: '/',
    children: [
      header(
        { class: 'topbar' },
        div({ class: 'topbar-inner' }, siteNav('/')),
      ),
      ...content,
      siteFooter(),
    ],
  })
}

export function pageLayout({
  title: heading,
  description,
  activeHref,
  children,
}) {
  const content = Array.isArray(children) ? children : [children]

  return pageShell({
    pageTitle: heading,
    description,
    bodyClass: 'page-content',
    path: activeHref,
    children: [
      header(
        { class: 'topbar' },
        div({ class: 'topbar-inner' }, siteNav(activeHref)),
      ),
      main({ class: 'content-main' }, h1(heading), ...content),
      siteFooter(),
    ],
  })
}

export function docsLayout(args) {
  return guideLayout({
    ...args,
    sidebarLabel: 'Documentation',
    sidebarItems: DOC_NAV,
    titleSuffix: 'sitelo docs',
  })
}

export function examplesLayout(args) {
  return guideLayout({
    ...args,
    sidebarLabel: 'Examples',
    sidebarItems: EXAMPLE_NAV,
    titleSuffix: 'sitelo examples',
  })
}
