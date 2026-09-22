import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/it.js'

export default () =>
  examplesLayout({
    title: 'Esempi',
    description: 'Ricette pratiche per sitelo — WordPress, API e altro ancora.',
    activeHref: '/it/examples',
    children: [
      p(
        'Ricette passo per passo per costruire siti veri con sitelo. Ogni esempio mostra la struttura del progetto, il caricamento dei dati e le pagine che scriveresti.',
      ),
      h2('Disponibili'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/it/examples/basic' }, 'Sito di base'),
          ' — progetto minimo più configurazioni di deploy statico per Netlify, Vercel, Cloudflare Pages e AWS Amplify.',
        ),
        li(
          a({ href: '/it/examples/todo' }, 'App todo'),
          ' — HTML statico con handler ',
          code("import('/js/todo.js')"),
          ' inline (aggiungi / spunta / elimina, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/it/examples/blog' }, 'Blog in Markdown'),
          ' — una cartella di file ',
          code('.md'),
          ' renderizzati in pagine statiche, con un feed RSS e zero JS lato client.',
        ),
        li(
          a({ href: '/it/examples/json' }, 'JSON locale'),
          ' — un catalogo costruito da file ',
          code('.json'),
          ' nel repository: una pagina per file, nessuna API e nessun database.',
        ),
        li(
          a({ href: '/it/examples/wordpress' }, 'WordPress'),
          ' — recupera gli articoli dalla REST API di WordPress con ',
          code('fetchWithCache'),
          ', elencali e genera pagine statiche per ciascuno.',
        ),
        li(
          a({ href: '/it/examples/islands' }, 'Island server'),
          ' — pagine statiche più un host Node che renderizza le island al momento della richiesta.',
        ),
      ),
      h2('In arrivo'),
      ul({ class: 'docs-list' }, li('CMS headless / Contentful')),
    ],
  })
