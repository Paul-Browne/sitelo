import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'La parte alta di una landing page: un titolo, una frase e cosa farci.',
    activeHref: '/it/ui/hero',
    children: [
      p(
        'Un hero è la prima cosa su una home page di marketing o di documentazione. Renderizza una ',
        code('<section>'),
        ' con dentro un ',
        code('<h1>'),
        ' — quindi è il titolo della pagina, non un’insegna decorativa che per caso è grande.',
      ),

      h2('Hero di base'),
      demo(`hero({
  level: 2,
  title: 'Siti statici, senza il framework',
  description: 'Scrivi funzioni che restituiscono HTML. Ottieni un sito completo.',
},
  button({ size: 'lg' }, 'Inizia'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Leggi la documentazione'),
)`, { align: 'stretch' }),

      h2('Con un sopratitolo'),
      p(
        'Una riga breve sopra il titolo — una versione, una categoria, un annuncio.',
      ),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Ora con una libreria di componenti',
  description: 'Settanta componenti, nessun runtime, uno script facoltativo.',
},
  button({ size: 'lg', href: '/ui' }, 'Sfoglia i componenti'),
)`, { align: 'stretch' }),

      h2('Allineato a sinistra'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Open source',
  title: 'Costruito alla luce del sole',
  description: 'Licenza MIT, e abbastanza piccolo da leggerlo in un pomeriggio.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Guarda su GitHub'),
)`, { align: 'stretch' }),

      h2('Con un elemento multimediale'),
      p(
        'Passare ',
        code('media'),
        ' passa a due colonne non appena c’è spazio, e torna a una sola su uno schermo stretto. Si sposa naturalmente con ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Guardalo in funzione',
  description: 'Ogni pagina è HTML statico nel momento in cui raggiunge il browser.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Ciao mondo'),
      text({ variant: 'small', tone: 'muted' }, 'Renderizzato in fase di build.'),
    ),
  ),
},
  button('Inizia'),
)`, { align: 'stretch' }),

      h2('Dentro un contenitore'),
      p(
        'Un hero non ha un limite di larghezza proprio — mettilo in un ',
        code('container()'),
        ' così si allinea a tutto il resto della pagina.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Contenuto',
    description: 'Il contenitore stabilisce la larghezza; l’hero stabilisce il ritmo.',
  }),
)`, { align: 'stretch' }),

      h2('Livello del titolo'),
      p(
        'Il titolo è l’',
        code('<h1>'),
        ' della pagina per impostazione predefinita, cosa giusta per una landing page. Un hero usato a metà pagina non è il titolo della pagina, quindi abbassalo con ',
        code('level'),
        ' — lo fa ogni demo di questa pagina, visto che la pagina ha già un h1 suo.',
      ),

      h2('Solo un titolo'),
      p('Ogni parte è facoltativa, e niente di vuoto viene renderizzato.'),
      demo(`hero({ level: 2, title: 'Documentazione' })`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['eyebrow', 'Child', '', 'Riga piccola in maiuscoletto sopra il titolo.'],
        ['title', 'Child', '', 'Renderizzato come h1 della pagina.'],
        ['description', 'Child', '', 'La frase sotto di esso.'],
        ['media', 'Child', '', 'Accanto al testo su uno schermo largo, sopra su uno stretto.'],
        ['align', "'center' | 'start'", "'center'", 'Allineamento del testo quando non c’è media.'],
        ['level', 'number', '1', 'Livello di intestazione del titolo. Abbassalo per un hero a metà pagina.'],
        ['as', 'string', "'section'", 'Elemento da renderizzare.'],
      ]),
      p('I figli diventano la riga di azioni sotto la descrizione.'),
    ],
  })
