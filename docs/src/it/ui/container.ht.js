import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Contenitore',
    description:
      'Una colonna centrata e limitata in larghezza — l’involucro più esterno della maggior parte delle pagine.',
    activeHref: '/it/ui/container',
    children: [
      p(
        'Un contenitore centra il proprio contenuto, limita la larghezza perché le righe di testo restino leggibili, e tiene un margine laterale così che niente tocchi il bordo dello schermo di un telefono. Di solito è la prima cosa dentro ',
        code('body()'),
        '.',
      ),

      h2('Contenitore di base'),
      demo(`container(
  text({ variant: 'lead' }, 'Tutto ciò che sta dentro resta centrato e smette di crescere al limite di dimensione.'),
)`, { align: 'stretch' }),

      h2('Dimensioni'),
      p(
        'Cinque gradini, da una singola colonna leggibile fino a nessun limite. ',
        code('sm'),
        ' è circa 40rem — più o meno la larghezza che la prosa desidera.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (predefinito)'),
  ),
)`, { align: 'stretch' }),

      h2('Una larghezza personalizzata'),
      p(
        code('width'),
        ' accetta qualunque lunghezza CSS e scavalca ',
        code('size'),
        ', per quell’unica pagina che ha bisogno di qualcosa che la scala non prevede.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Margine laterale'),
      p(
        'Il margine laterale è lo spazio tenuto fra il contenuto e il bordo del viewport. Accetta un token di spaziatura, un numero di unità di spaziatura, oppure una lunghezza grezza.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Un margine più ampio, per una pagina il cui contenuto non dovrebbe arrivare al bordo su un tablet.'),
)`, { align: 'stretch' }),

      h2('Come un altro elemento'),
      p(
        code('as'),
        ' cambia il tag senza cambiare nient’altro — utile quando il contenitore è anche il ',
        code('<main>'),
        ' della pagina o una ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Un elemento main'),
  text({ tone: 'muted' }, 'Stesso layout, punto di riferimento corretto.'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Quale limite di larghezza applicare.'],
        ['width', 'string', '', 'Una max-width grezza, che scavalca size.'],
        ['gutter', 'Space', "'md'", 'Spazio interno tenuto contro il bordo del viewport.'],
        ['as', 'string', "'div'", 'Elemento da renderizzare, per esempio main o section.'],
      ]),
    ],
  })
