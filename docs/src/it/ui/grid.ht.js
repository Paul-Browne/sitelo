import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Griglia',
    description:
      'Una griglia responsiva che sistema quante più colonne ci stanno — senza breakpoint e senza media query.',
    activeHref: '/it/ui/grid',
    children: [
      p(
        'Senza ',
        code('columns'),
        ', una griglia sistema automaticamente quante più tracce larghe almeno ',
        code('min'),
        ' lo spazio consente, e ciascuna si divide equamente ciò che avanza. È il comportamento che vuole un elenco di schede, e non ha bisogno di breakpoint: ridimensiona questa pagina e le demo qui sotto si riorganizzano da sole.',
      ),

      h2('Adattamento automatico'),
      p('Il comportamento predefinito. Le tracce sono larghe almeno 16rem.'),
      demo(`grid(
  ...['Routing', 'Caricamento dati', 'Risorse', 'Immagini', 'Island', 'Ricerca'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Larghezza delle tracce'),
      p(
        code('min'),
        ' imposta quanto stretta può diventare una traccia prima che la griglia scenda a meno colonne. Più piccola significa più colonne.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Un numero fisso di colonne'),
      p(
        'Passa un numero quando il conteggio non deve cambiare con il viewport. Ogni traccia riceve una quota uguale.',
      ),
      demo(`grid({ columns: 3 },
  ...['Uno', 'Due', 'Tre'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Un template personalizzato'),
      p(
        'Una stringa viene passata direttamente come ',
        code('grid-template-columns'),
        ', per una divisione barra laterale-contenuto o qualunque altra cosa la griglia CSS sappia esprimere.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Barra laterale'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Contenuto, che si prende il resto della riga.'))),
)`, { align: 'stretch' }),

      h2('Spaziatura e allineamento'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Corta'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Una scheda più alta, con due righe di testo dentro, per mostrare cosa fa align alle sue vicine più basse.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Corta'))),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['columns', 'number | string', '', 'Un numero fisso di tracce, oppure un valore grezzo di grid-template-columns. Omettila per l’adattamento automatico.'],
        ['min', 'string', "'16rem'", 'Larghezza minima della traccia nell’adattamento automatico.'],
        ['gap', 'Space', "'md'", 'Spazio fra tracce e righe.'],
        ['align', 'string', "'stretch'", 'Qualunque valore di align-items.'],
        ['as', 'string', "'div'", 'Elemento da renderizzare.'],
      ]),
      p(
        'Una traccia non diventa mai più larga della griglia stessa, nemmeno quando ',
        code('min'),
        ' è più grande dello spazio disponibile — così un minimo di 16rem non provoca una barra di scorrimento orizzontale su un telefono da 320px.',
      ),
    ],
  })
