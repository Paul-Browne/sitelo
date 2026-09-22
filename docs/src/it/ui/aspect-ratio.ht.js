import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Proporzioni',
    description:
      'Tieni un riquadro a una forma fissa, così niente nella pagina si sposta quando il contenuto si carica.',
    activeHref: '/it/ui/aspect-ratio',
    children: [
      p(
        'L’altezza si conosce dalla larghezza prima che qualunque cosa si sia caricata, quindi un’immagine o un embed che arrivano tardi non spingono giù il resto della pagina. Il figlio riempie il riquadro e viene ritagliato invece che incorniciato da bande.',
      ),

      h2('Proporzioni di base'),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
  '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 2rem">',
)`, { align: 'stretch' }),

      h2('Proporzioni comuni'),
      demo(`grid({ min: '9rem' },
  ...['16 / 9', '4 / 3', '1 / 1', '3 / 4'].map((ratio) =>
    stack({ gap: 'xs' },
      aspectRatio({ ratio, style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
        '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
      text({ variant: 'caption', tone: 'muted', align: 'center' }, ratio),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Embed'),
      p(
        'Il motivo per cui questo componente esiste: un ',
        code('<iframe>'),
        ' non ha dimensioni intrinseche, quindi senza proporzioni collassa o ha bisogno di un’altezza fissata a mano.',
      ),
      demo(`aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  '<div style="display: grid; place-items: center; color: var(--su-text-subtle)">qui ci andrebbe un &lt;iframe&gt;</div>',
)`, { align: 'stretch' }),

      h2('In una scheda'),
      p(
        code('cardMedia()'),
        ' fa già questo per la parte alta di una scheda. Ricorri ad ',
        code('aspectRatio()'),
        ' quando il riquadro sta da qualche altra parte.',
      ),
      demo(`grid({ min: '12rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'cardMedia — incorporato')),
  ),
  card(
    cardBody(
      stack({ gap: 'sm' },
        aspectRatio({ ratio: '1 / 1', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          '<img src="/logo.svg" alt="" style="object-fit: contain; padding: 1rem">'),
        text({ variant: 'small' }, 'aspectRatio — ovunque altrove'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Ritaglio'),
      p(
        'Il figlio viene allungato per riempire e ritagliato con ',
        code('object-fit: cover'),
        '. Per qualcosa che non deve essere ritagliato — un logo, un diagramma — imposta ',
        code('object-fit: contain'),
        ' sul figlio, come fa ogni demo di questa pagina.',
      ),

      h2('Props'),
      propsTable([
        ['ratio', 'string', "'16 / 9'", 'Qualunque valore CSS di aspect-ratio.'],
        ['as', 'string', "'div'", 'Elemento da renderizzare.'],
      ]),
    ],
  })
