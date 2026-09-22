import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Tipografia',
    description:
      'Una scala tipografica che sceglie da sé il proprio elemento, così la struttura del documento segue quella visiva.',
    activeHref: '/it/ui/typography',
    children: [
      p(
        code('text()'),
        ' renderizza un pezzo di testo in una delle dimensioni della libreria. La variante sceglie un elemento sensato — ',
        code("variant: 'h2'"),
        ' renderizza un vero ',
        code('<h2>'),
        ' — così le intestazioni finiscono nella struttura del documento senza che nessuno debba pensarci.',
      ),

      h2('Varianti'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Intestazione 1'),
  text({ variant: 'h2' }, 'Intestazione 2'),
  text({ variant: 'h3' }, 'Intestazione 3'),
  text({ variant: 'h4' }, 'Intestazione 4'),
  text({ variant: 'h5' }, 'Intestazione 5'),
  text({ variant: 'h6' }, 'Intestazione 6'),
  text({ variant: 'lead' }, 'Lead — un gradino sopra il testo corrente, per la frase sotto un titolo.'),
  text({ variant: 'body' }, 'Body — quello predefinito.'),
  text({ variant: 'small' }, 'Small — didascalie che sono ancora frasi.'),
  text({ variant: 'caption' }, 'Caption — le note in piccolo.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Intestazioni'),
      p(
        code('heading()'),
        ' prende un ',
        code('level'),
        ' della struttura e si dimensiona di conseguenza. ',
        code('size'),
        ' separa le due cose: un ',
        code('<h1>'),
        ' che sembra un h3 resta comunque un h1 per uno screen reader.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Un’intestazione di livello 2, dimensionata di conseguenza'),
  heading({ level: 2, size: 'h5' }, 'Un’intestazione di livello 2, dimensionata come un h5'),
)`, { align: 'stretch' }),

      h2('Tono'),
      p(
        'Tre pesi di enfasi, dal contrasto pieno fino al grigio leggibile più sommesso.',
      ),
      demo(`stack({ gap: 'xs' },
  text('Predefinito — il colore con cui è composto il testo corrente.'),
  text({ tone: 'muted' }, 'Attenuato — testo secondario, ancora comodamente leggibile.'),
  text({ tone: 'subtle' }, 'Discreto — etichette e metadati.'),
)`, { align: 'stretch' }),

      h2('Allineamento'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Inizio'),
  text({ align: 'center' }, 'Centro'),
  text({ align: 'end' }, 'Fine'),
)`, { align: 'stretch' }),

      h2('Troncare e limitare'),
      p(
        code('truncate'),
        ' taglia una singola riga con dei puntini di sospensione. ',
        code('lines'),
        ' limita invece a un numero di righe, che è ciò che di solito vuole il riassunto di una scheda.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Una sola riga che continua ben oltre la larghezza del suo contenitore e viene tagliata con dei puntini di sospensione invece di andare a capo.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Limitato a due righe. Questo paragrafo va avanti per un po’ così che ci sia davvero qualcosa da tagliare, e poi continua ancora un altro pezzo, oltre il punto in cui sarebbe iniziata la terza riga.'),
  )),
)`, { align: 'stretch' }),

      h2('Codice inline e tasti'),
      demo(`text(
  'Esegui ', code('sitelo build'), ' oppure premi ', kbd('⌘'), ' ', kbd('K'), ' per cercare.',
)`, { align: 'stretch' }),
      p(
        'I figli vengono renderizzati come HTML — è questo che fa funzionare l’annidamento ovunque in questa libreria, e ',
        code('code()'),
        ' non fa eccezione. Quindi un esempio che contiene tag ha bisogno della prop ',
        code('text'),
        ', che li sfugge:',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Ciao</em>' }), ' — text: mostrato come scritto'),
  text(code('<em>Ciao</em>'), ' — figli: interpretati come markup'),
)`, { align: 'stretch' }),
      p(
        'Servono entrambi. ',
        code('text'),
        ' è per un esempio di codice, dove un tag va letto invece che costruito. I figli sono per output già evidenziato sintatticamente, dove il markup ',
        code('è'),
        ' il punto — il risultato di Prism o Shiki ci entra direttamente.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Comporre'),
      p(
        'Text accetta figli, non solo una stringa — quindi link, codice ed enfasi si annidano al suo interno come farebbero in HTML.',
      ),
      demo(`text({ variant: 'lead' },
  'Le pagine sono funzioni che restituiscono ',
  code('HTML'),
  '. Vedi la guida su ',
  link({ href: '/docs/pages' }, 'come scrivere pagine'),
  '.',
)`, { align: 'stretch' }),

      h2('Cambiare l’elemento'),
      p(
        code('as'),
        ' scavalca l’elemento senza cambiare l’aspetto — per un’intestazione visiva che non deve comparire nella struttura, o per uno ',
        code('<span>'),
        ' dentro una riga di testo.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Sembra un’intestazione, è un div'),
  text({ variant: 'caption', as: 'p' }, 'Stile caption su un paragrafo'),
)`, { align: 'stretch' }),

      h2('Nascosto visivamente'),
      p(
        code('visuallyHidden()'),
        ' tiene il contenuto nell’albero di accessibilità ma fuori dallo schermo — l’etichetta di cui ha bisogno uno screen reader là dove chi vede la ricava dal contesto.',
      ),
      demo(`text(
  'Stato della build: ',
  chip({ color: 'success', dot: true }, 'superata'),
  visuallyHidden(' — l’ultima build è riuscita 4 minuti fa'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Dimensione, peso ed elemento predefinito.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Quanto contrasto porta il testo.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Allineamento del testo.'],
        ['truncate', 'boolean', 'false', 'Una riga, tagliata con i puntini di sospensione.'],
        ['lines', 'number', '', 'Limita a questo numero di righe.'],
        ['as', 'string', '', 'Scavalca l’elemento che la variante sceglierebbe.'],
      ]),
      p(
        code('heading()'),
        ' accetta ',
        code('level'),
        ' (1–6) e una ',
        code('size'),
        ' facoltativa; il resto è identico.',
      ),
    ],
  })
