import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Alerta',
    description:
      'Un mensaje sobre el estado de algo, con un icono y un rol de anuncio que siguen al color.',
    activeHref: '/es/ui/alert',
    children: [
      p(
        'Una alerta le cuenta al lector algo sobre la página o sobre una acción que acaba de hacer. El color elige a la vez el icono y el rol ARIA: ',
        code('danger'),
        ' y ',
        code('warning'),
        ' se anuncian como ',
        code('role="alert"'),
        '; todo lo más tranquilo es un ',
        code('role="status"'),
        ' cortés.',
      ),

      h2('Colores'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Atención' }, 'Hay una nueva versión de sitelo disponible.'),
  alert({ color: 'success', title: 'Desplegado' }, '169 páginas publicadas en 1,7 segundos.'),
  alert({ color: 'warning', title: 'Página lenta' }, 'Una página tardó más de 500 ms en renderizarse.'),
  alert({ color: 'danger', title: 'Compilación fallida' }, 'Dos enlaces internos apuntan a páginas que no existen.'),
  alert({ color: 'neutral', title: 'Nota' }, 'Las islas están desactivadas en este proyecto.'),
)`, { align: 'stretch' }),

      h2('Sin título'),
      p('Una alerta de una línea no necesita un encabezado sobre la frase.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Guardado.'),
  alert({ color: 'danger' }, 'Ese correo ya está en uso.'),
)`, { align: 'stretch' }),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'La opción por defecto: una superficie teñida.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Transparente, con un borde de color.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'El color pleno de la paleta, para algo que no se puede pasar por alto.'),
)`, { align: 'stretch' }),

      h2('Iconos'),
      p(
        'Cada color tiene un icono por defecto. Pasa tu propio marcado en ',
        code('icon'),
        ', o ',
        code('icon: false'),
        ' para ninguno.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Sin icono' }, 'Solo el texto.'),
  alert({
    color: 'primary',
    title: 'Un icono propio',
    icon: icon('star'),
  }, 'Vale cualquier SVG: los iconos son marcado, no una dependencia.'),
)`, { align: 'stretch' }),

      h2('Descartable'),
      p('El botón de cerrar lleva su propio manejador:'),
      codeBlock(
        'Marcado generado',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Así que la alerta de abajo se cierra de verdad sin que esta página importe nada. Si ese módulo no llega nunca, el botón se dibuja y no hace nada, y por eso una alerta no debería ser el único sitio donde aparece un mensaje.',
      ),
      demo(`alert({ color: 'primary', title: 'Descartable', dismissible: true },
  'Pulsa la × — el manejador se descarga solo en la primera pulsación.',
)`, { align: 'stretch' }),

      h2('Contenido enriquecido'),
      p('Las alertas admiten cualquier hijo, así que dentro puede vivir una acción o una lista.'),
      demo(`alert({ color: 'danger', title: 'Falló la comprobación de enlaces' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Dos enlaces apuntan a páginas que no se generaron:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'enlazado desde /docs' }),
      listItem({ title: '/blog/draft', description: 'enlazado desde /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Ver detalles'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Ignorar'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Elige la paleta, el icono por defecto y el rol ARIA.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Cuánto peso tiene la alerta.'],
        ['title', 'Child', '', 'Primera línea en negrita.'],
        ['icon', 'Child | false', '', 'Marcado de icono propio, o false para ninguno.'],
        ['dismissible', 'boolean', 'false', 'Añade un botón de cerrar que importa su propio manejador.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Nombre accesible de ese botón.'],
      ]),
    ],
  })
