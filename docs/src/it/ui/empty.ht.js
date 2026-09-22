import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Stato vuoto',
    description: 'Che aspetto ha un elenco prima che ci sia dentro qualcosa.',
    activeHref: '/it/ui/empty',
    children: [
      p(
        'Uno spazio bianco si legge come un bug. Uno stato vuoto dice quale spazio è vuoto, perché, e cosa fare dopo — ed è il caso che più facilmente si dimentica, perché durante lo sviluppo i dati ci sono sempre.',
      ),

      h2('Stato vuoto di base'),
      demo(`empty({
  title: 'Ancora nessun articolo',
  description: 'Aggiungi un file Markdown in src/posts e comparirà qui.',
})`, { align: 'stretch' }),

      h2('Con un’icona'),
      p(
        'L’icona è decorazione — è marcata ',
        code('aria-hidden'),
        ', perché il titolo dice già cosa sta succedendo.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Qui non c’è niente',
  description: 'Questa cartella non contiene pagine.',
})`, { align: 'stretch' }),

      h2('Con un’azione'),
      p('I figli diventano la riga delle azioni.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Nessun risultato per “island”',
  description: 'Controlla l’ortografia, oppure sfoglia la documentazione.',
},
  button({ href: '/docs' }, 'Sfoglia la documentazione'),
  button({ variant: 'outline', color: 'neutral' }, 'Cancella la ricerca'),
)`, { align: 'stretch' }),

      h2('In una scheda'),
      demo(`card(
  cardHeader({ title: 'Deploy' }),
  cardBody(
    empty({
      title: 'Ancora nessun deploy',
      description: 'Fai push su main e la prima build comparirà qui.',
    }, button({ size: 'sm' }, 'Collega un repository')),
  ),
)`, { align: 'stretch' }),

      h2('Al posto di una tabella'),
      p(
        'Scambia la tabella con uno stato vuoto, invece di renderizzare un’intestazione senza righe sotto.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Storico delle build' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'Nessuna build registrata',
          description: 'Le esecuzioni compaiono qui una volta che il sito è stato pubblicato almeno una volta.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['icon', 'Child', '', 'Glifo decorativo sopra il titolo; nascosto agli screen reader.'],
        ['title', 'Child', '', 'Che cosa è vuoto, in poche parole.'],
        ['description', 'Child', '', 'Perché è vuoto, o cosa farci.'],
      ]),
      p('I figli vengono renderizzati come riga di azioni sotto la descrizione.'),
    ],
  })
