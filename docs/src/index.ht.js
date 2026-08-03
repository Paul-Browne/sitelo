import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from './lib/layout.js'

const version = '2.0'
const installSnippet = `npm install -D sitelo`

const features = [
  ['File-based routing', 'src/about.ht.js → /about'],
  ['Dynamic routes', '[slug], [...path], optional catch-alls'],
  ['Data loading', 'data() at build time, with fetch caching'],
  ['Asset pipeline', 'Referenced JS/TS/CSS is bundled; the rest stays server-only'],
  ['Dev server', 'Real renders on request — including dynamic routes'],
  ['Extras', '404.html, sitemap.xml, and RSS when you ask'],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — The modern framework for fast websites',
    description:
      'sitelo turns a folder of pages into a fast static website. Live preview while you work, one command to ship — no heavy framework.',
    children: [
      headerHero(),
      mainSections(),
    ],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
      }),
      a(
        {
          class: 'hero-badge',
          href: 'https://www.npmjs.com/package/sitelo',
          rel: 'noopener',
        },
        span({ class: 'hero-badge-ver' }, `sitelo ${version}`),
        span({ class: 'hero-badge-cta' }, 'Available now →'),
      ),
      h1(
        { class: 'hero-headline' },
        'The modern framework for ',
        span(
          {
            class: 'hero-typed',
            'data-phrases': 'fast websites|blogs|portfolios|landing pages|content-driven sites|e-commerce sites',
            'aria-live': 'polite',
          },
          'fast websites',
        )
      ),
      p(
        { class: 'hero-lede' },
        'Zero configuration. Lightening fast builds. Deploy anywhere. — one install.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/docs' }, 'Get started'),
        div(
          { class: 'install' },
          code({ class: 'install-cmd' }, 'npm install -D sitelo'),
          button(
            {
              class: 'install-copy',
              type: 'button',
              'data-copy': installSnippet,
              'aria-label': 'Copy install command',
            },
            'Copy',
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      'What you get',
      ul(
        { class: 'feature-list' },
        ...features.map(([name, detail]) => li(h3(name), p(detail))),
      ),
    ),
    sectionBlock(
      'Documentation',
      p(
        'Guides for routing, data loading, TypeScript, configuration, and the CLI.',
      ),
      p(a({ class: 'btn btn-inline', href: '/docs' }, 'Read the docs →')),
    ),
    sectionBlock(
      'Examples',
      p(
        'Recipes for real setups — starting with a WordPress REST API site.',
      ),
      p(a({ class: 'btn btn-inline', href: '/examples' }, 'Browse examples →')),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div(
    { class: 'section' },
    h2(heading),
    ...children,
  )
}
