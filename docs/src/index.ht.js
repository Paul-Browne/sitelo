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

const featureIcon = (paths) =>
  `<svg class="feature-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

const icons = {
  routing: featureIcon(
    '<path d="M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  ),
  code: featureIcon(
    '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  ),
  data: featureIcon(
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  ),
  pipeline: featureIcon(
    '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
  ),
  feather: featureIcon(
    '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
  ),
  terminal: featureIcon(
    '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  ),
  search: featureIcon(
    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  ),
  layers: featureIcon(
    '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  ),
  sparkles: featureIcon(
    '<path d="m12 3 1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6-4.6-1.9 4.6-1.9z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',
  ),
  deploy: featureIcon(
    '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.3"/>',
  ),
  gift: featureIcon(
    '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  ),
  image: featureIcon(
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  ),
}

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
