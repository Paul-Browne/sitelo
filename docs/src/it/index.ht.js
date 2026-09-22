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
import { landingLayout } from '../lib/it.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('it')

const features = [
  [
    'routing',
    'Routing',
    'src/about.ht.js → /about, più [slug] e catch-all',
    '/it/docs/routing',
  ],
  [
    'code',
    'JSX e TSX',
    'Scrivi le pagine come .jsx / .tsx con lo stesso routing e la stessa build',
    '/it/docs/pages#limitazioni-di-jsx',
  ],
  [
    'data',
    'Caricamento dati',
    'data() in fase di build, con cache delle fetch',
    '/it/docs/data',
  ],
  [
    'pipeline',
    'Pipeline delle risorse',
    'JS/TS/CSS referenziati finiscono nel bundle; il resto resta solo lato server',
    '/it/docs/assets',
  ],
  [
    'image',
    'Ottimizzazione delle immagini',
    'Ridimensionamento, formati e srcset — attivali con images: true (installa sharp)',
    '/it/docs/images',
  ],
  [
    'components',
    'sitelo UI',
    'Pulsanti, schede, form, tabelle e modali — funzioni che restituiscono HTML, senza runtime',
    '/it/docs/ui',
  ],
  [
    'terminal',
    'Server di sviluppo + toolbar',
    'Render dal vivo su richiesta, più file, parametri, numero di island e un selettore di viewport mentre sviluppi',
    '/it/docs/cli',
  ],
  [
    'search',
    'Ricerca Pagefind',
    'Ricerca statica opzionale — installa pagefind, poi sitelo build indicizza in dist/pagefind/',
    '/it/docs/configuration#ricerca-con-pagefind',
  ],
  [
    'layers',
    'Island server',
    'Pagine statiche con regioni renderizzate sul server al momento della richiesta',
    '/it/docs/islands',
  ],
  [
    'sparkles',
    'Pronto per l’IA',
    'llms.txt, regole di progetto e consigli perché gli agenti scrivano sitelo — non React',
    '/it/docs/build-with-ai',
  ],
  [
    'lighthouse',
    'Audit Lighthouse',
    'Valuta la build reale rispetto a delle soglie — esegui sitelo lighthouse (installa lighthouse)',
    '/it/docs/configuration#audit-lighthouse',
  ],
  [
    'gift',
    'Extra',
    '404.html, sitemap.xml, RSS e configurazioni di deploy con un clic, se le chiedi',
    '/it/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — Il framework moderno per siti web veloci',
    description:
      'sitelo trasforma una cartella di pagine in un sito statico veloce. Anteprima dal vivo mentre lavori, un comando per pubblicare — senza framework pesanti.',
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
          'Il framework moderno per ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'siti web veloci|blog|portfolio|landing page|siti editoriali|siti e-commerce',
              'aria-live': 'polite',
            },
            'siti web veloci',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Zero configurazione. Build fulminee. Pubblica ovunque — con una sola installazione.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/it/docs' }, 'Inizia'),
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
                'aria-label': 'Copia il comando di installazione',
              },
              'Copia',
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
      'Cosa ottieni',
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
      'Documentazione',
      p(
        'Guide per il routing, il caricamento dei dati, TypeScript, la configurazione e la CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/it/docs' },
          'Leggi la documentazione',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Esempi',
      p(
        'Ricette per configurazioni reali — a partire da un sito basato sulla REST API di WordPress.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/it/examples' },
          'Sfoglia gli esempi',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
