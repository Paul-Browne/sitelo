import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Separador',
    description:
      'Una línea entre secciones, con o sin etiqueta en el medio.',
    activeHref: '/es/ui/divider',
    children: [
      p(
        'Un separador separa grupos de contenido. Dibuja un elemento con ',
        code('role="separator"'),
        ' en vez de un ',
        code('<hr>'),
        ', porque la etiqueta va dentro y ',
        code('<hr>'),
        ' no admite hijos.',
      ),

      h2('Separador básico'),
      demo(`stack({ gap: 'none' },
  text({ tone: 'muted' }, 'Todo lo de arriba.'),
  divider(),
  text({ tone: 'muted' }, 'Todo lo de abajo.'),
)`, { align: 'stretch' }),

      h2('Con etiqueta'),
      p('Los hijos pasan a ser una etiqueta centrada en la línea.'),
      demo(`stack({ gap: 'none' },
  button({ variant: 'outline', color: 'neutral', block: true }, 'Continuar con GitHub'),
  divider('o'),
  button({ block: true }, 'Continuar con correo'),
)`, { align: 'stretch' }),

      h2('Espaciado'),
      p(
        code('spacing'),
        ' fija el margen de arriba y de abajo, desde la misma escala que usa todo lo demás.',
      ),
      demo(`stack({ gap: 'none' },
  text({ variant: 'small', tone: 'muted' }, 'Justo'),
  divider({ spacing: 'xs' }),
  text({ variant: 'small', tone: 'muted' }, 'Por defecto'),
  divider(),
  text({ variant: 'small', tone: 'muted' }, 'Holgado'),
  divider({ spacing: 'xl' }),
  text({ variant: 'small', tone: 'muted' }, 'Fin'),
)`, { align: 'stretch' }),

      h2('Vertical'),
      p(
        'Un separador vertical necesita un padre que le dé altura: una fila flex cuyos elementos se estiren, que es lo que hace ',
        code('stack()'),
        ' por defecto.',
      ),
      demo(`stack({ direction: 'row', gap: 'none', align: 'stretch' },
  text({ variant: 'small' }, '4,1 kB'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '12 páginas'),
  divider({ orientation: 'vertical' }),
  text({ variant: 'small' }, '0 islas'),
)`),

      h2('Props'),
      propsTable([
        ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Hacia dónde corre la línea.'],
        ['spacing', 'Space', "'md'", 'Margen a cada lado de la línea.'],
      ]),
    ],
  })
