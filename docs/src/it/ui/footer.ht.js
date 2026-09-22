import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Piè di pagina',
    description:
      'Il fondo di un sito: colonne di link, e una riga sotto di esse.',
    activeHref: '/it/ui/footer',
    children: [
      p(
        'Un piè di pagina è una griglia di colonne che si adattano automaticamente, più una riga finale facoltativa che occupa sempre tutta la larghezza, qualunque sia il numero di colonne.',
      ),
      p(
        'È esportato sia come ',
        code('footer'),
        ' sia come ',
        code('siteFooter'),
        ', perché ',
        code('footer'),
        ' è anche l’elemento ',
        code('<footer>'),
        ' di javascript-to-html e importarli entrambi con lo stesso nome è un errore di sintassi.',
      ),

      h2('Piè di pagina di base'),
      demo(`footer(
  footerColumn({ title: 'Documentazione' },
    '<a href="/docs">Primi passi</a>',
    '<a href="/docs/routing">Routing</a>',
    '<a href="/docs/data">Caricamento dati</a>',
  ),
  footerColumn({ title: 'Componenti' },
    '<a href="/ui">Panoramica</a>',
    '<a href="/ui/button">Pulsante</a>',
    '<a href="/ui/card">Scheda</a>',
  ),
  footerColumn({ title: 'Progetto' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Con una riga finale'),
      p(
        code('footerBottom()'),
        ' attraversa tutte le colonne, quindi resta una riga a piena larghezza qualunque cosa stia facendo la griglia sopra di essa.',
      ),
      demo(`footer(
  footerColumn({ title: 'Documentazione' }, '<a href="/docs">Guida</a>', '<a href="/ui">Componenti</a>'),
  footerColumn({ title: 'Esempi' }, '<a href="/examples">Tutti gli esempi</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Build superata'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Una colonna di marca'),
      p(
        'Una colonna non deve per forza essere fatta di link. Qualunque cosa passi come figlio di ',
        code('footer()'),
        ' invece che di una colonna sta nella griglia come cella a sé.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Generazione di siti statici senza configurazione, mossa da Vite.'),
    ),
  ),
  footerColumn({ title: 'Documentazione' }, '<a href="/docs">Guida</a>', '<a href="/ui">Componenti</a>'),
  footerColumn({ title: 'Progetto' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Colonne fisse'),
      p(
        'Per impostazione predefinita le colonne si adattano da sole. ',
        code('columns'),
        ' accetta qualunque valore di ',
        code('grid-template-columns'),
        ' quando vuoi una forma precisa — una colonna di marca larga e due colonne di link strette, per esempio.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Una prima colonna più larga per la marca e una frase che la descrive.')),
  footerColumn({ title: 'Documentazione' }, '<a href="/docs">Guida</a>'),
  footerColumn({ title: 'Altro' }, '<a href="/examples">Esempi</a>'),
)`, { align: 'stretch' }),

      h2('Solo la riga finale'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Costruito con sitelo')),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Un valore di grid-template-columns. Si adatta da sola se omessa.'],
        ['as', 'string', "'footer'", 'Elemento da renderizzare.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Una colonna con titolo; i figli diventano un elenco di link.'],
        ['footerBottom', '', '', 'Riga a piena larghezza sotto le colonne.'],
      ], { headers: ['Parte', 'Props', 'Predefinito', 'Descrizione'] }),
    ],
  })
