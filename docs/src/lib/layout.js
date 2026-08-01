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
  link,
  main,
  meta,
  nav,
  p,
  script,
  span,
  title,
} from 'javascript-to-html'

import { DOC_NAV } from './nav.js'

function siteNav(activeHref) {
  return nav(
    { class: 'nav' },
    a({ class: 'nav-brand', href: '/' }, 'sitelo'),
    a(
      {
        class: activeHref?.startsWith('/docs') ? 'is-active' : undefined,
        href: '/docs',
      },
      'Docs',
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

function docsSidebar(activeHref) {
  return aside(
    { class: 'docs-sidebar', 'aria-label': 'Documentation' },
    p({ class: 'docs-sidebar-label' }, 'Documentation'),
    nav(
      { class: 'docs-side-nav' },
      ...DOC_NAV.map((item) =>
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
      div({ class: 'atmosphere', 'aria-hidden': 'true' }),
      ...content,
      script({ type: 'module', src: '/main.js' }),
    ),
  )
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

export function docsLayout({
  title: heading,
  description,
  activeHref,
  children,
}) {
  const content = Array.isArray(children) ? children : [children]

  return pageShell({
    pageTitle: `${heading} · sitelo docs`,
    description,
    bodyClass: 'page-docs',
    children: [
      header(
        { class: 'topbar' },
        div({ class: 'topbar-inner' }, siteNav(activeHref)),
      ),
      div(
        { class: 'docs-shell' },
        docsSidebar(activeHref),
        main({ class: 'docs-main' }, h1(heading), ...content),
      ),
      siteFooter(),
    ],
  })
}
