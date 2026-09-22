import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/it.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('it')

export default () =>
  docsLayout({
    title: 'Primi passi',
    description: 'Installa sitelo e costruisci il tuo primo sito statico.',
    activeHref: '/it/docs',
    children: [
      p(
        'sitelo è un generatore di siti statici senza configurazione, mosso da Vite. Installa un pacchetto, scrivi funzioni che restituiscono HTML ed esegui ',
        code('sitelo build'),
        '.',
      ),
      h2('Installazione'),
      codeBlock('shell', s.install, 'bash'),
      p(
        'Richiede Node 20.19+ (oppure 22.12+). Vite è incluso — non devi installarlo a parte.',
      ),
      h2('La tua prima pagina'),
      p(
        'Crea ',
        code('src/index.ht.js'),
        ' (oppure ',
        code('.ht.jsx'),
        '). ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ' è consigliato:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Esecuzione'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Questo produce ',
        code('dist/index.html'),
        ' (con ',
        code('<!DOCTYPE html>'),
        ' aggiunto per te) più una ',
        code('404.html'),
        ' predefinita.',
      ),
      h2('Prossimi passi'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/it/docs/pages' }, 'Scrivere pagine'),
          ' — template string, JSX, moduli strutturati',
        ),
        li(
          a({ href: '/it/docs/routing' }, 'Routing'),
          ' — rotte basate sui file e ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/it/docs/data' }, 'Caricamento dati'),
          ' — ',
          code('data()'),
          ' e ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/it/docs/assets' }, 'Risorse e stili'),
          ' — JS/CSS di frontend compilati da Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(
          a({ href: '/it/docs/configuration' }, 'Configurazione'),
          ' — ',
          code('sitelo.config.js'),
          ' e opzioni di Vite',
        ),
        li(
          a({ href: '/it/docs/build-with-ai' }, 'Creare con l’IA'),
          ' — ',
          code('llms.txt'),
          ', regole di progetto e consigli per gli agenti',
        ),
      ),
    ],
  })
