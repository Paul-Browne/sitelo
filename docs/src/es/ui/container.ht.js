import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Contenedor',
    description:
      'Una columna centrada y con ancho limitado: el envoltorio más externo de casi cualquier página.',
    activeHref: '/es/ui/container',
    extraHead: uiHead(),
    children: [
      p(
        'Un contenedor centra su contenido, limita el ancho para que las líneas de texto sigan siendo legibles y mantiene un margen para que nada toque el borde de la pantalla de un móvil. Suele ser lo primero dentro de ',
        code('body()'),
        '.',
      ),

      h2('Contenedor básico'),
      demo(`container(
  text({ variant: 'lead' }, 'Todo lo de dentro se queda centrado y deja de crecer al llegar al límite de tamaño.'),
)`, { align: 'stretch' }),

      h2('Tamaños'),
      p(
        'Cinco pasos, desde una única columna legible hasta ningún límite. ',
        code('sm'),
        ' ronda las 40rem, más o menos el ancho que pide la prosa.',
      ),
      demo(`stack({ gap: 'sm' },
  container({ size: 'sm', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'sm — 40rem'),
  ),
  container({ size: 'md', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'md — 56rem'),
  ),
  container({ size: 'lg', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
    text({ variant: 'small', align: 'center' }, 'lg — 72rem (por defecto)'),
  ),
)`, { align: 'stretch' }),

      h2('Un ancho a medida'),
      p(
        code('width'),
        ' admite cualquier longitud CSS y manda sobre ',
        code('size'),
        ', para esa página que necesita algo que la escala no tiene.',
      ),
      demo(`container({ width: '30rem', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small', align: 'center' }, 'width: 30rem'),
)`, { align: 'stretch' }),

      h2('Margen lateral'),
      p(
        'El margen lateral es el relleno que se mantiene entre el contenido y el borde de la ventana. Admite un token de espaciado, un número de unidades de espaciado o una longitud tal cual.',
      ),
      demo(`container({ size: 'sm', gutter: 'xl', style: 'background: var(--su-surface-2); padding-block: 0.75rem' },
  text({ variant: 'small' }, 'Un margen más ancho, para una página cuyo contenido no debería llegar al borde en una tableta.'),
)`, { align: 'stretch' }),

      h2('Como otro elemento'),
      p(
        code('as'),
        ' cambia la etiqueta sin cambiar nada más — útil cuando el contenedor es además el ',
        code('<main>'),
        ' de la página o una ',
        code('<section>'),
        '.',
      ),
      demo(`container({ as: 'main', size: 'md' },
  heading({ level: 2, size: 'h4' }, 'Un elemento main'),
  text({ tone: 'muted' }, 'La misma maquetación, el punto de referencia correcto.'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg' | 'xl' | 'full'", "'lg'", 'Qué límite de ancho se aplica.'],
        ['width', 'string', '', 'Un max-width tal cual, que manda sobre size.'],
        ['gutter', 'Space', "'md'", 'Relleno en línea que se mantiene contra el borde de la ventana.'],
        ['as', 'string', "'div'", 'Elemento que se renderiza, por ejemplo main o section.'],
      ]),
    ],
  })
