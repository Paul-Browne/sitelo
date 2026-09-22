import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Pila',
    description:
      'Una riga o una colonna flex con un token di spaziatura per il gap — la primitiva di layout con cui è costruita la maggior parte delle pagine.',
    activeHref: '/it/ui/stack',
    children: [
      p(
        'Stack mette spazio fra le cose. È un contenitore flex con un solo compito, ed è la risposta a quasi tutte le domande del tipo “come distanzio queste cose” — verticalmente per impostazione predefinita, orizzontalmente con ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'I gap arrivano dalla scala di spaziature, così il ritmo di una pagina resta coerente senza che nessuno scelga valori in pixel.',
      ),

      h2('Pila di base'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Primo')),
  card(cardBody('Secondo')),
  card(cardBody('Terzo')),
)`, { align: 'stretch' }),

      h2('Direzione'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Uno'),
  button({ variant: 'outline' }, 'Due'),
  button({ variant: 'outline' }, 'Tre'),
)`),

      h2('Gap'),
      p(
        'Il nome di un token (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), un numero di unità di spaziatura, oppure una lunghezza CSS grezza.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 unità'), chip('6 unità')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Allineamento'),
      p(
        code('align'),
        ' e ',
        code('justify'),
        ' accettano valori flexbox grezzi, quindi funziona tutto ciò che il CSS capisce.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('inizio'),
    chip('fine'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Centrato'),
    chip('e allineato'),
  ),
)`, { align: 'stretch' }),

      h2('A capo'),
      p(
        'Una riga di chip o di pulsanti che potrebbe non starci ha bisogno di ',
        code('wrap'),
        ' — senza, si schiacciano invece di andare alla riga successiva.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('Inline'),
      p(
        code('inline'),
        ' rende la pila un ',
        code('inline-flex'),
        ', così sta in una riga di testo invece di prendersi tutta la larghezza.',
      ),
      demo(`text(
  'Costruito con ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' e nient’altro.',
)`, { align: 'stretch' }),

      h2('Come un altro elemento'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/docs' }, 'Documentazione'),
  navLink({ href: '/ui', current: true }, 'UI'),
  navLink({ href: '/examples' }, 'Esempi'),
)`),

      h2('Props'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Asse principale.'],
        ['gap', 'Space', "'md'", 'Spazio fra i figli.'],
        ['align', 'string', "'stretch'", 'Qualunque valore di align-items.'],
        ['justify', 'string', "'flex-start'", 'Qualunque valore di justify-content.'],
        ['wrap', 'boolean | string', 'false', 'true significa andare a capo; una stringa viene passata come flex-wrap.'],
        ['inline', 'boolean', 'false', 'Renderizza come inline-flex.'],
        ['as', 'string', "'div'", 'Elemento da renderizzare, per esempio nav o ul.'],
      ]),
    ],
  })
