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

const installSnippet = `npm install -D sitelo`

const arrowIcon = `<svg class="btn-arrow" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const features = [
  ['File-based routing', 'src/about.ht.js → /about'],
  ['JSX & TSX', 'Write pages as .jsx / .tsx with the same routing and build'],
  ['Dynamic routes', '[slug], [...path], optional catch-alls'],
  ['Data loading', 'data() at build time, with fetch caching'],
  ['Asset pipeline', 'Referenced JS/TS/CSS is bundled; the rest stays server-only'],
  [
    'Zero JavaScript, by default',
    'Only the scripts you link are bundled — everything else stays off the page for a faster site',
  ],
  ['Dev server', 'Real renders on request — including dynamic routes'],
  ['Dev toolbar', 'Route, source file, params, and island count while you develop'],
  ['Server islands', 'Static pages with regions rendered on the server at request time'],
  ['AI-ready', 'llms.txt, project rules, and tips so agents write sitelo — not React'],
  ['One-click deploy', 'Netlify, Vercel, Cloudflare Pages, and AWS Amplify configs included'],
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
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          'The modern framework for ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'fast websites|blogs|portfolios|landing pages|content-driven sites|e-commerce sites',
              'aria-live': 'polite',
            },
            'fast websites',
          ),
        ),
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
      p(a({ class: 'btn btn-inline', href: '/docs' }, 'Read the docs', arrowIcon)),
    ),
    sectionBlock(
      'Examples',
      p(
        'Recipes for real setups — starting with a WordPress REST API site.',
      ),
      p(a({ class: 'btn btn-inline', href: '/examples' }, 'Browse examples', arrowIcon)),
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
