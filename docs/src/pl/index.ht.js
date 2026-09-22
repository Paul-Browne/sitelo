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
import { landingLayout } from '../lib/pl.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('pl')

const features = [
  [
    'routing',
    'Routing',
    'src/about.ht.js → /about, plus [slug] i catch-all',
    '/pl/docs/routing',
  ],
  [
    'code',
    'JSX i TSX',
    'Pisz strony jako .jsx / .tsx z tym samym routingiem i buildem',
    '/pl/docs/pages#ograniczenia-jsx',
  ],
  [
    'data',
    'Wczytywanie danych',
    'data() w czasie buildu, z cache’owaniem fetch',
    '/pl/docs/data',
  ],
  [
    'pipeline',
    'Potok zasobów',
    'Wskazane JS/TS/CSS trafia do paczki; reszta zostaje tylko na serwerze',
    '/pl/docs/assets',
  ],
  [
    'image',
    'Optymalizacja obrazów',
    'Skalowanie, formaty i srcset — włącz przez images: true (zainstaluj sharp)',
    '/pl/docs/images',
  ],
  [
    'components',
    'sitelo UI',
    'Przyciski, karty, formularze, tabele i okna modalne — funkcje zwracające HTML, bez runtime’u',
    '/pl/docs/ui',
  ],
  [
    'terminal',
    'Serwer deweloperski + pasek',
    'Render na żywo na żądanie, a do tego plik, parametry, liczba wysp i przełącznik viewportu podczas pracy',
    '/pl/docs/cli',
  ],
  [
    'search',
    'Wyszukiwanie Pagefind',
    'Opcjonalne wyszukiwanie statyczne — zainstaluj pagefind, a sitelo build zindeksuje do dist/pagefind/',
    '/pl/docs/configuration#wyszukiwanie-pagefind',
  ],
  [
    'layers',
    'Wyspy serwerowe',
    'Statyczne strony z obszarami renderowanymi na serwerze w chwili żądania',
    '/pl/docs/islands',
  ],
  [
    'sparkles',
    'Gotowe na AI',
    'llms.txt, reguły projektu i wskazówki, żeby agenci pisali sitelo — nie Reacta',
    '/pl/docs/build-with-ai',
  ],
  [
    'lighthouse',
    'Audyty Lighthouse',
    'Oceń prawdziwy build względem progów — uruchom sitelo lighthouse (zainstaluj lighthouse)',
    '/pl/docs/configuration#audyty-lighthouse',
  ],
  [
    'gift',
    'Dodatki',
    '404.html, sitemap.xml, RSS i gotowe konfiguracje wdrożenia, kiedy o nie poprosisz',
    '/pl/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — Nowoczesny framework do szybkich stron',
    description:
      'sitelo zamienia katalog stron w szybką statyczną witrynę. Podgląd na żywo podczas pracy, jedno polecenie do publikacji — bez ciężkiego frameworka.',
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
          'Nowoczesny framework do ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'szybkich stron|blogów|portfolio|landing page’y|serwisów treściowych|sklepów internetowych',
              'aria-live': 'polite',
            },
            'szybkich stron',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Zero konfiguracji. Błyskawiczne buildy. Wdrażaj gdziekolwiek — jedna instalacja.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/pl/docs' }, 'Zacznij'),
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
                'aria-label': 'Skopiuj polecenie instalacji',
              },
              'Kopiuj',
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
      'Co dostajesz',
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
      'Dokumentacja',
      p(
        'Przewodniki po routingu, wczytywaniu danych, TypeScripcie, konfiguracji i CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/pl/docs' },
          'Przeczytaj dokumentację',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Przykłady',
      p(
        'Przepisy na prawdziwe wdrożenia — zaczynając od witryny opartej na REST API WordPressa.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/pl/examples' },
          'Przeglądaj przykłady',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
