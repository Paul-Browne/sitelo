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
import { landingLayout } from '../lib/de.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('de')

const features = [
  [
    'routing',
    'Routing',
    'src/about.ht.js → /about, dazu [slug] und Catch-alls',
    '/de/docs/routing',
  ],
  [
    'code',
    'JSX und TSX',
    'Schreibe Seiten als .jsx / .tsx — gleiches Routing, gleicher Build',
    '/de/docs/pages#jsx-einschraenkungen',
  ],
  [
    'data',
    'Daten laden',
    'data() zur Build-Zeit, mit Caching für fetch',
    '/de/docs/data',
  ],
  [
    'pipeline',
    'Asset-Pipeline',
    'Referenziertes JS/TS/CSS wird gebündelt; der Rest bleibt serverseitig',
    '/de/docs/assets',
  ],
  [
    'image',
    'Bildoptimierung',
    'Skalieren, Formate und srcset — mit images: true aktivieren (sharp installieren)',
    '/de/docs/images',
  ],
  [
    'feather',
    'Null JavaScript, von Haus aus',
    'Nur die Skripte, die du verlinkst, werden gebündelt — alles andere bleibt von der Seite fern, für eine schnellere Website',
    '/de/docs/assets#null-js-von-haus-aus',
  ],
  [
    'terminal',
    'Entwicklungsserver + Toolbar',
    'Live-Rendering auf Anfrage, dazu Datei, Parameter, Anzahl der Islands und ein Viewport-Umschalter beim Entwickeln',
    '/de/docs/cli',
  ],
  [
    'search',
    'Pagefind-Suche',
    'Optionale statische Suche — pagefind installieren, dann indexiert sitelo build nach dist/pagefind/',
    '/de/docs/configuration#pagefind-suche',
  ],
  [
    'layers',
    'Server-Islands',
    'Statische Seiten mit Bereichen, die zur Anfragezeit auf dem Server gerendert werden',
    '/de/docs/islands',
  ],
  [
    'sparkles',
    'Bereit für KI',
    'llms.txt, Projektregeln und Tipps, damit Agenten sitelo schreiben — nicht React',
    '/de/docs/build-with-ai',
  ],
  [
    'lighthouse',
    'Lighthouse-Audits',
    'Den echten Build gegen Schwellenwerte prüfen — sitelo lighthouse (lighthouse installieren)',
    '/de/docs/configuration#lighthouse-audits',
  ],
  [
    'gift',
    'Extras',
    '404.html, sitemap.xml, RSS und Deploy-Konfigurationen, wenn du danach fragst',
    '/de/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — Das moderne Framework für schnelle Websites',
    description:
      'sitelo macht aus einem Ordner voller Seiten eine schnelle statische Website. Live-Vorschau beim Arbeiten, ein Befehl zum Ausliefern — ohne schweres Framework.',
    children: [headerHero(), mainSections()],
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
          'Das moderne Framework für ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'schnelle Websites|Blogs|Portfolios|Landingpages|Content-Websites|Onlineshops',
              'aria-live': 'polite',
            },
            'schnelle Websites',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Keine Konfiguration. Blitzschnelle Builds. Überall ausliefern — mit einer einzigen Installation.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/de/docs' }, 'Loslegen'),
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
                'aria-label': 'Installationsbefehl kopieren',
              },
              'Kopieren',
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
      'Was du bekommst',
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
      'Dokumentation',
      p(
        'Anleitungen zu Routing, Datenladen, TypeScript, Konfiguration und CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/de/docs' },
          'Dokumentation lesen',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Beispiele',
      p(
        'Rezepte für echte Setups — angefangen bei einer Website auf Basis der WordPress-REST-API.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/de/examples' },
          'Beispiele durchsehen',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
