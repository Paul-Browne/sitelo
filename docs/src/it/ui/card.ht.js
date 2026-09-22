import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Scheda',
    description:
      'Una superficie per contenuti raggruppati, con intestazione, corpo, piè di pagina e media che sanno stare insieme.',
    activeHref: '/it/ui/card',
    children: [
      p(
        'Una scheda raggruppa contenuti affini su una superficie propria. Le parti — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — sono funzioni separate invece che props, così usi solo quelle che ti servono e le metti nell’ordine che il design richiede.',
      ),

      h2('Scheda di base'),
      demo(`card(
  cardHeader({ title: 'Routing basato sui file', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Le cartelle diventano percorsi. Le parentesi diventano parametri. Non c’è alcun router da configurare.')),
)`, { align: 'stretch' }),

      h2('Varianti'),
      p(
        'Outlined è la predefinita. Elevated scambia il bordo con un’ombra, e flat tinge la superficie invece di fare l’uno o l’altra.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Con un piè di pagina'),
      p(
        code('divided'),
        ' aggiunge il filetto sopra il piè di pagina. Il piè di pagina viene spinto in fondo, così schede messe in fila allineano le loro azioni anche quando il testo sopra ha lunghezze diverse.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Sito di base' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Un progetto minimo più le configurazioni di deploy.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Apri')),
  ),
  card(
    cardHeader({ title: 'Blog in Markdown' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Una cartella di file .md renderizzati in pagine statiche, con un feed RSS e nessun JavaScript lato client.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Apri')),
  ),
)`, { align: 'stretch' }),

      h2('Media'),
      p(
        code('cardMedia()'),
        ' riempie la parte alta della scheda a proporzioni fisse, così una fila di schede resta pari qualunque siano le misure delle immagini di partenza.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Predefinito 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Un’intera scheda come link'),
      p(
        'Dai alla scheda un ',
        code('href'),
        ' e tutta la superficie diventa un unico link, con il sollevamento al passaggio del mouse che lo accompagna. Non mettere pulsanti o altri link dentro una scheda in questa forma — il contenuto interattivo non può annidarsi dentro un link. Usa piuttosto un pulsante nel piè di pagina di una scheda normale.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/docs/routing' },
    cardHeader({ title: 'Routing', subtitle: 'Leggi la guida' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Rotte dinamiche, catch-all e gruppi di rotte.')),
  ),
  card({ href: '/docs/data' },
    cardHeader({ title: 'Caricamento dati', subtitle: 'Leggi la guida' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() gira in fase di build, con cache delle fetch.')),
  ),
)`, { align: 'stretch' }),

      h2('Spazio interno'),
      p(
        'Una sola prop imposta in un colpo lo spazio interno di ogni parte della scheda.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Contenuti liberi'),
      p(
        'Le parti sono una comodità, non un obbligo — una scheda accetta qualunque figlio, e ',
        code('cardHeader()'),
        ' accetta figli propri accanto al titolo, per un avatar o un pulsante-menu sulla destra.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Pubblicato 4 minuti fa' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Build superata'),
      chip({ color: 'neutral' }, '12 pagine'),
      chip({ color: 'neutral' }, '4,1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Come la superficie viene separata dalla pagina.'],
        ['href', 'string', '', 'Renderizza l’intera scheda come link.'],
        ['padding', 'Space', "'lg'", 'Spazio interno usato da ogni parte della scheda.'],
      ]),
      p('Le parti:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Titolo e sottotitolo, più eventuali figli accanto a essi.'],
        ['cardTitle', 'as', "'h3'", 'Il solo titolo, quando l’intestazione è costruita a mano.'],
        ['cardSubtitle', '', '', 'La riga attenuata sotto un titolo.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Un’immagine di copertina a proporzioni fisse.'],
        ['cardBody', '', '', 'La regione del contenuto principale.'],
        ['cardFooter', 'divided', 'false', 'Riga di azioni in fondo; divided aggiunge il filetto sopra.'],
      ], { headers: ['Parte', 'Props', 'Predefinito', 'Descrizione'] }),
    ],
  })
