import { a, h2, p, strong } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Grupo de botones',
    description:
      'Botones que van juntos, unidos en un solo control con bordes compartidos y extremos redondeados.',
    activeHref: '/es/ui/button-group',
    extraHead: uiHead(),
    children: [
      p(
        'Los botones se agrupan envolviéndolos en ',
        code('buttonGroup()'),
        '. Tienen que ser hijos directos: el grupo redondea el primero y el último y junta el resto, así que cualquier cosa entre medias rompe la costura.',
      ),

      h2('Grupo básico'),
      demo(`buttonGroup({ label: 'Grupo de botones básico' },
  button('Uno'),
  button('Dos'),
  button('Tres'),
)`),

      h2('Variantes'),
      p(
        'El grupo en sí no lleva color. Pon ',
        code('variant'),
        ' y ',
        code('color'),
        ' en los botones, y mantenlos iguales en todo el grupo: eso es lo que hace que se lea como un solo control.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  buttonGroup({ label: 'Solid' },
    button({ variant: 'solid' }, 'Uno'),
    button({ variant: 'solid' }, 'Dos'),
    button({ variant: 'solid' }, 'Tres'),
  ),
  buttonGroup({ label: 'Outline' },
    button({ variant: 'outline', color: 'neutral' }, 'Uno'),
    button({ variant: 'outline', color: 'neutral' }, 'Dos'),
    button({ variant: 'outline', color: 'neutral' }, 'Tres'),
  ),
  buttonGroup({ label: 'Soft' },
    button({ variant: 'soft' }, 'Uno'),
    button({ variant: 'soft' }, 'Dos'),
    button({ variant: 'soft' }, 'Tres'),
  ),
)`, { align: 'start' }),

      h2('Tamaños y colores'),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  buttonGroup({ label: 'Pequeño' },
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Izquierda'),
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Centro'),
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Derecha'),
  ),
  buttonGroup({ label: 'Grande' },
    button({ size: 'lg', variant: 'soft', color: 'danger' }, 'Cancelar'),
    button({ size: 'lg', variant: 'soft', color: 'danger' }, 'Descartar'),
  ),
)`, { align: 'start' }),

      h2('Enlaces'),
      p(
        'Los botones con ',
        code('href'),
        ' se agrupan exactamente igual — para una fila de cosas que llevan cada una a un sitio, ninguna de ellas al que ya estás.',
      ),
      demo(`buttonGroup({ label: 'Compartir' },
  button({ href: '#rss', variant: 'outline', color: 'neutral' }, 'RSS'),
  button({ href: '#json', variant: 'outline', color: 'neutral' }, 'JSON'),
  button({ href: '#sitemap', variant: 'outline', color: 'neutral' }, 'Sitemap'),
)`),

      h2('¿Grupo de botones o grupo de alternancia?'),
      p(
        'Un grupo de botones es un contenedor: junta lo que le metas y no guarda estado. Si uno de los elementos está ',
        strong('seleccionado'),
        ' — un control segmentado, un filtro, la sección en la que estás — eso es un ',
        a({ href: '/es/ui/toggle-group' }, 'grupo de alternancia'),
        ', que construye los elementos a partir de datos y marca el activo por ti.',
      ),
      p(
        'La regla práctica: si pulsar uno deja mal a los demás, es un grupo de alternancia. Si cada uno hace lo suyo por separado, es un grupo de botones.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ gap: 'xs' },
    text({ variant: 'caption', tone: 'muted' }, 'buttonGroup — tres acciones separadas'),
    buttonGroup({ label: 'Acciones de fila' },
      button({ variant: 'outline', color: 'neutral' }, 'Editar'),
      button({ variant: 'outline', color: 'neutral' }, 'Duplicar'),
      button({ variant: 'outline', color: 'neutral' }, 'Eliminar'),
    ),
  ),
  stack({ gap: 'xs' },
    text({ variant: 'caption', tone: 'muted' }, 'toggleGroup — una opción de tres'),
    toggleGroup({
      label: 'Alineación del texto',
      value: 'Centro',
      items: ['Izquierda', 'Centro', 'Derecha'],
    }),
  ),
)`, { align: 'start' }),

      h2('Con un botón de icono'),
      demo(`buttonGroup({ label: 'Acciones del editor' },
  button({ variant: 'outline', color: 'neutral' }, 'Guardar'),
  iconButton({
    label: 'Más acciones',
    variant: 'outline',
    color: 'neutral',
    icon: icon('more-horizontal'),
  }),
)`),

      h2('Props'),
      propsTable([
        ['label', 'string', '', 'Nombre accesible del grupo; pasa a ser aria-label en role="group".'],
      ]),
      p(
        'Todo lo demás cae al envoltorio. Los botones de dentro llevan sus propias props — mira ',
        code('button()'),
        '.',
      ),
    ],
  })
