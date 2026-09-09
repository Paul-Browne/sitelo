import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menú',
    description:
      'Un desplegable construido sobre <details>, así que se abre y se cierra sin nada de script.',
    activeHref: '/es/ui/menu',
    extraHead: uiHead(),
    children: [
      p(
        'Un menú es un ',
        code('<details>'),
        ' con un panel estilizado. Es una elección deliberada frente a la API de popover: un popover vive en la capa superior y no se puede colocar respecto de su disparador sin posicionamiento por anclaje, que todavía no está en todas partes. Un ',
        code('<details>'),
        ' se coloca bien hoy y no necesita que se cargue nada.',
      ),
      p(
        'El disparador es ese ',
        code('<summary>'),
        ' con estilo de botón, así que le pasas la etiqueta y las props de botón a ',
        code('menu()'),
        ' en vez de pasarle un ',
        code('button()'),
        ' ya dibujado. Un summary ya es interactivo, y un botón dentro anida dos controles donde solo hay una acción: marcado inválido, y dos paradas de tabulación para una sola cosa.',
      ),
      p(
        'Cerrar al hacer clic fuera y con Escape viene de un manejador ',
        code('ontoggle'),
        ' que los importa la primera vez que se abre un menú, y solo entonces. Si ese módulo no llega nunca, un menú sigue abriéndose y cerrándose desde su propio summary.',
      ),

      h2('Menú básico'),
      demo(`menu({ trigger: 'Acciones' },
  menuItem({ href: '#edit' }, 'Editar'),
  menuItem({ href: '#duplicate' }, 'Duplicar'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Eliminar'),
)`),

      h2('Alineación'),
      p(
        'Un menú se abre desde el borde inicial de su disparador. ',
        code("align: 'end'"),
        ' lo voltea, que es lo que necesita un menú cerca del borde derecho de una barra.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Alineado al inicio', variant: 'soft' },
    menuItem({ href: '#a' }, 'Primero'),
    menuItem({ href: '#b' }, 'Segundo'),
  ),
  menu({ trigger: 'Alineado al final', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Primero'),
    menuItem({ href: '#d' }, 'Segundo'),
  ),
)`, { align: 'stretch' }),

      h2('Disparadores de icono'),
      p(
        'Un icono sin texto de ',
        code('trigger'),
        ' necesita un ',
        code('label'),
        ': pasa a ser el nombre accesible que el icono no puede dar.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Más acciones',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Renombrar'),
    menuItem({ href: '#move' }, 'Mover'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Archivar'),
  ),
)`),

      h2('Elementos con iconos'),
      demo(`menu({ trigger: 'Archivo' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Página nueva'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Abrir…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Compilar el sitio'),
)`),

      h2('Botones en vez de enlaces'),
      p(
        'Un elemento sin ',
        code('href'),
        ' dibuja un ',
        code('<button>'),
        ', para una acción que ocurre en la página en vez de una navegación.',
      ),
      demo(`menu({ trigger: 'Exportar', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Exportado como JSON.',{color:'success'}))" }, 'Como JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Exportado como CSV.',{color:'success'}))" }, 'Como CSV'),
)`),
      // The demo above raises toasts; this is the region they land in.
      // Fixed-position, so it renders here but appears in the corner.
      preview('toasts()'),

      h2('En una barra de aplicación'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Más',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/es/docs' }, 'Documentación'),
      menuItem({ href: '/es/examples' }, 'Ejemplos'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Accesibilidad'),
      p(
        'El panel es un ',
        code('role="menu"'),
        ' cuyos elementos son ',
        code('role="menuitem"'),
        ', y el summary lleva ',
        code('aria-haspopup'),
        '. Un ',
        code('<details>'),
        ' no es un widget de menú nativo, así que esto es una aproximación razonable y no una perfecta: para una lista simple de enlaces, un ',
        code('nav'),
        ' dentro del details es igual de válido y promete menos.',
      ),

      h2('Props'),
      p(code('menu()'), ' — las props del disparador son las del botón:'),
      propsTable([
        ['trigger', 'Child', '', 'Etiqueta visible. Pasa texto, no un button() ya dibujado.'],
        ['icon', 'Child', '', 'Marcado antes de la etiqueta, o por su cuenta para un disparador de solo icono.'],
        ['label', 'string', '', 'Nombre accesible. Obligatorio cuando hay icono y no hay texto de trigger.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Estilo del disparador.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'De qué paleta bebe el disparador.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamaño del disparador.'],
        ['align', "'start' | 'end'", "'start'", 'Con qué borde del disparador se alinea el panel.'],
        ['triggerClass', 'string', '', 'Clases extra para el disparador, no para el details que lo envuelve.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Dibuja un ancla; sin él, un botón.'],
        ['icon', 'Child', '', 'Marcado antes de la etiqueta.'],
        ['as', 'string', "'button'", 'Elemento que se renderiza cuando no hay href.'],
      ]),
      p(code('menuSeparator()'), ' no admite props: es la línea fina entre grupos de elementos.'),
    ],
  })
