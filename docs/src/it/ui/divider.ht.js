import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Divisore',
    description:
      'Una linea fra sezioni, con o senza un’etichetta al centro.',
    activeHref: '/it/ui/divider',
    children: [
      p(
        'Un divisore separa gruppi di contenuto. Renderizza un elemento con ',
        code('role="separator"'),
        ' invece di un ',
        code('<hr>'),
        ', perché l’etichetta va al suo interno e ',
        code('<hr>'),
        ' non accetta figli.',
      ),

      h2('Divisore di base'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Tutto quello che sta sopra.'),
  divider(),
  text({ tone: 'muted' }, 'Tutto quello che sta sotto.'),
)`, { align: 'stretch' }),

      h2('Con un’etichetta'),
      p('I figli diventano un’etichetta centrata nella linea.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Continua con GitHub'),
  divider('oppure'),
  button({ block: true }, 'Continua con l’email'),
)`, { align: 'stretch' }),

      h2('Spaziatura'),
      p(
        code('spacing'),
        ' imposta il margine sopra e sotto, dalla stessa scala che usa tutto il resto.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Stretto'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Predefinito'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Ampio'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Fine'),
)`, { align: 'stretch' }),

      h2('Verticale'),
      p(
        'Un divisore verticale ha bisogno di un genitore che gli dia un’altezza — una riga flex i cui elementi si allungano, che è ciò che ',
        code('stack()'),
        ' fa per impostazione predefinita.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 pagine'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 island'),
)`),

      h2('Props'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'In che direzione corre la linea.'],
        ['spacing', 'Space', "'md'", 'Margine ai due lati della linea.'],
      ]),
    ],
  })
