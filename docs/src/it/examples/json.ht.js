import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/it.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('it')

export default () =>
  examplesLayout({
    title: 'JSON locale',
    description:
      'Un catalogo prodotti costruito interamente da file JSON nel repository — nessuna API, nessun database.',
    activeHref: '/it/examples/json',
    children: [
      p(
        'Contenuti che vivono nel repository come JSON, trasformati in pagine statiche da ',
        code('sitelo/data'),
        '. Nessuna API, nessun database e nessun JavaScript lato client. Sorgente completa in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('Cosa ottieni'),
      ul(
        { class: 'docs-list' },
        li('Una home page che elenca ogni categoria e ogni prodotto'),
        li(
          code('/products/[slug]'),
          ' — una pagina statica per ogni file in ',
          code('data/products/'),
        ),
        li(
          code('/categories/[slug]'),
          ' — una pagina per ogni chiave in ',
          code('data/categories.json'),
        ),
        li('Aggiungere un file JSON aggiunge una pagina; nessuna rotta da registrare'),
        li(
          'Zero JS pubblicato — i file vengono letti in Node in fase di build',
        ),
      ),
      h2('Struttura del progetto'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'I dati stanno fuori da ',
        code('src/'),
        ', così sitelo non li tratta mai come pagine o risorse.',
      ),
      h2('1. Metti i contenuti in data/'),
      p(
        'Un file per prodotto. Il nome del file è lo slug, quindi ',
        code('aeron-chair.json'),
        ' diventa ',
        code('/products/aeron-chair'),
        ' — non serve che il file lo dichiari:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Le categorie sono invece un unico file: un oggetto indicizzato per slug, che ',
        code('readJsonCollection'),
        ' legge comunque come una collezione.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Leggili in un solo punto'),
      p(
        'Un piccolo modulo destinato solo al server racchiude le letture. Nulla nell’HTML lo referenzia, quindi non arriva mai al browser — e poiché ',
        code('sitelo/data'),
        ' memoizza per file, ogni pagina che chiama questi helper analizza comunque ciascun file JSON una sola volta per tutta la build.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Elenca tutto in home page'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Una pagina per file JSON'),
      p(
        code('generateStaticParams'),
        ' restituisce uno slug per file in fase di build; ',
        code('data()'),
        ' carica la voce corrispondente per ciascuna pagina.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Modifica e osserva'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'Sotto ',
        code('sitelo'),
        ', cambiare un prezzo ricarica la pagina aperta — il server di sviluppo sorveglia i file JSON che le pagine leggono davvero. Slug duplicati, file mancanti e JSON malformato fanno fallire la build, indicando il percorso colpevole.',
      ),
      p(
        a({ href: '/it/docs/data' }, 'Documentazione sul caricamento dati'),
        ' · ',
        a({ href: '/it/docs/routing' }, 'Documentazione sul routing'),
        ' · ',
        a({ href: '/it/docs/configuration' }, 'Documentazione sulla configurazione'),
      ),
    ],
  })
