import {
  a,
  body,
  code,
  footer,
  h1,
  h2,
  h3,
  head,
  header,
  html,
  li,
  link,
  main,
  meta,
  nav,
  p,
  pre,
  section,
  span,
  title,
  ul,
} from 'javascript-to-html'

const features = [
  ['File-based routing', 'src/about.ht.js → /about'],
  ['Dynamic routes', '[slug], [...path], optional catch-alls'],
  ['Data loading', 'data() at build time, with fetchWithCache'],
  ['Asset pipeline', 'Referenced JS/TS/CSS is bundled; the rest stays server-only'],
  ['Dev server', 'Real renders on request — including dynamic routes'],
  ['Extras', '404.html, sitemap.xml, and RSS when you ask'],
]

const installSnippet = `npm install -D sitelo`

const pageSnippet = `// src/index.ht.js
import { html, head, title, body, h1 } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(title('My website')),
    body(h1('Hello world'))
  )`

const runSnippet = `sitelo          # dev server
sitelo build    # write dist/
sitelo preview  # preview the build`

const configSnippet = `// sitelo.config.js
export default {
  site: 'https://example.com',
}`

function codeBlock(label, source) {
  return pre(
    { class: 'code', 'data-label': label },
    code(source),
  )
}

export default () =>
  html(
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
          'sitelo — static site generation for Vite. Write functions that return HTML.',
      }),
      title('sitelo'),
      link({ rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
      link({
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: '',
      }),
      link({
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Libre+Franklin:wght@400;600&family=Syne:wght@600;700&display=swap',
      }),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(
      header(
        { class: 'hero' },
        nav(
          { class: 'nav' },
          a({ class: 'nav-brand', href: '/' }, 'sitelo'),
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
        ),
        p({ class: 'hero-brand' }, 'sitelo'),
        h1('Functions that return HTML. A static site comes out.'),
        p(
          { class: 'hero-lede' },
          'Zero-config SSG powered by Vite. Install sitelo — not Vite, not a plugin stack.',
        ),
        p(
          { class: 'hero-actions' },
          a({ class: 'btn', href: '#start' }, 'Get started'),
          a(
            {
              class: 'btn btn-ghost',
              href: 'https://github.com/paul-browne/sitelo',
              rel: 'noopener',
            },
            'Star on GitHub',
          ),
        ),
      ),
      main(
        section(
          { id: 'start', class: 'section' },
          h2('Get started'),
          p('One install. Pages live in ', code('src/'), '. No Vite config required.'),
          codeBlock('shell', installSnippet),
          codeBlock('src/index.ht.js', pageSnippet),
          codeBlock('shell', runSnippet),
        ),
        section(
          { class: 'section' },
          h2('What you get'),
          ul(
            { class: 'feature-list' },
            ...features.map(([name, detail]) =>
              li(h3(name), p(detail)),
            ),
          ),
        ),
        section(
          { class: 'section' },
          h2('Configuration'),
          p(
            'Optional. Put plugin options in ',
            code('sitelo.config.js'),
            ' — site URL, RSS, pagesDir, and the rest.',
          ),
          codeBlock('sitelo.config.js', configSnippet),
          p(
            'Prefer a Vite config? ',
            code('import htmlPages from "sitelo"'),
            ' and register it yourself, then use the normal Vite CLI.',
          ),
        ),
        section(
          { class: 'section section-note' },
          h2('This page'),
          p(
            'This documentation site is built with sitelo and ',
            a(
              {
                href: 'https://www.npmjs.com/package/javascript-to-html',
                rel: 'noopener',
              },
              'javascript-to-html',
            ),
            '. Source lives in ',
            code('docs/src'),
            ' of the sitelo repo.',
          ),
        ),
      ),
      footer(
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
      ),
    ),
  )
