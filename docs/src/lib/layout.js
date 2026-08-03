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
  link,
  main,
  meta,
  nav,
  p,
  script,
  span,
  title,
} from 'javascript-to-html'

import { DOC_NAV, EXAMPLE_NAV } from './nav.js'

function siteNav(activeHref = '/') {
  const onDocs = activeHref.startsWith('/docs')
  const onExamples = activeHref.startsWith('/examples')

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
    p(
      'MIT · ',
      a(
        {
          href: 'https://github.com/paul-browne/sitelo',
          rel: 'noopener',
        },
        'paul-browne/sitelo',
      ),
    ),
    p(
      { class: 'footer-meta' },
      span('Node 18+'),
      ' · ',
      span('Vite bundled'),
    ),
  )
}

function sideNav({ label, items, activeHref }) {
  return aside(
    { class: 'docs-sidebar', 'aria-label': label },
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

function pageShell({ pageTitle, description, bodyClass = '', children }) {
  const content = Array.isArray(children) ? children : [children]

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
        content:
          description ??
          'sitelo — static site generation for Vite. Write functions that return HTML.',
      }),
      title(pageTitle),
      link({ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }),
      link({ rel: 'apple-touch-icon', href: '/logo.png' }),
      meta({
        property: 'og:image',
        content: 'https://sitelo.js.org/logo.png',
      }),
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

  return pageShell({
    pageTitle: `${heading} · ${titleSuffix}`,
    description,
    bodyClass: 'page-docs',
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
        main({ class: 'docs-main' }, h1(heading), ...content),
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
