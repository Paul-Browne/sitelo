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
import { arrowIcon, icons } from './lib/landing-icons.js'
import { gettingStartedSnippets } from './lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('en')

const features = [
  [
    'routing',
    'Routing',
    'src/about.ht.js → /about, plus [slug] and catch-alls',
    '/docs/routing',
  ],
  [
    'code',
    'JSX & TSX',
    'Write pages as .jsx / .tsx with the same routing and build',
    '/docs/pages#jsx-limitations',
  ],
  ['data', 'Data loading', 'data() at build time, with fetch caching', '/docs/data'],
  [
    'pipeline',
    'Asset pipeline',
    'Referenced JS/TS/CSS is bundled; the rest stays server-only',
    '/docs/assets',
  ],
  [
    'image',
    'Image optimization',
    'Resize, formats, and srcset — opt in with images: true (install sharp)',
    '/docs/images',
  ],
  [
    'feather',
    'Zero JavaScript, by default',
    'Only the scripts you link are bundled — everything else stays off the page for a faster site',
    '/docs/assets#zero-js-by-default',
  ],
  [
    'terminal',
    'Dev server + toolbar',
    'Live renders on request, plus file, params, island count, and a viewport toggle while you develop',
    '/docs/cli',
  ],
  [
    'search',
    'Pagefind search',
    'Opt-in static search — install pagefind, then sitelo build indexes into dist/pagefind/',
    '/docs/configuration#pagefind-search',
  ],
  [
    'layers',
    'Server islands',
    'Static pages with regions rendered on the server at request time',
    '/docs/islands',
  ],
  [
    'sparkles',
    'AI-ready',
    'llms.txt, project rules, and tips so agents write sitelo — not React',
    '/docs/build-with-ai',
  ],
  [
    'deploy',
    'One-click deploy',
    'Netlify, Vercel, Cloudflare Pages, and AWS Amplify configs included',
    '/docs/deployment',
  ],
  ['gift', 'Extras', '404.html, sitemap.xml, and RSS when you ask', '/docs/configuration'],
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
        // Above the fold and the hero's first paint, so it should not queue
        // behind the page's other subresources.
        fetchpriority: 'high',
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
        'Zero configuration. Lightning-fast builds. Deploy anywhere — one install.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/docs' }, 'Get started'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': 'Copy install command',
              },
              'Copy',
            ),
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
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
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
