import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Panel lateral',
    description:
      'Un panel que entra desde el borde: la misma mecánica de popover que un modal, con otra forma.',
    activeHref: '/es/ui/drawer',
    extraHead: uiHead(),
    children: [
      p(
        'Un panel lateral ocupa toda la altura y se ancla a un lado. Igual que ',
        code('modal()'),
        ', es un ',
        code('popover'),
        ': un botón con el ',
        code('popovertarget'),
        ' correspondiente lo abre, y el navegador se encarga del fondo, del clic fuera y de Escape.',
      ),
      p(
        'Su trabajo más habitual en un sitio estático es el menú de navegación en el móvil.',
      ),

      h2('Panel básico'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Abrir panel'),
  drawer({ id: 'drawer-basic', title: 'Ajustes' },
    stack({ gap: 'md' },
      toggle({ label: 'Búsqueda con Pagefind', checked: true }),
      toggle({ label: 'Optimización de imágenes', checked: true }),
      toggle({ label: 'Islas de servidor' }),
    ),
  ),
)`),

      h2('Lados'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Desde el inicio'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Desde el final'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Inicio' },
    text({ variant: 'small', tone: 'muted' }, 'Anclado al borde inicial: la izquierda en un idioma de izquierda a derecha.'),
  ),
  drawer({ id: 'drawer-end', title: 'Final' },
    text({ variant: 'small', tone: 'muted' }, 'La opción por defecto: anclado al borde final.'),
  ),
)`),

      h2('Ancho'),
      p('Cualquier longitud CSS. Se limita al 90 % de la ventana, así que un panel ancho sigue cabiendo en un móvil.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Estrecho'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Ancho'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Estrecho' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Ancho' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Como menú de navegación'),
      p('El patrón que quiere la mayoría de los sitios: un botón de menú en la barra y los enlaces en un panel.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Abrir la navegación',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Navegación' },
    navLink({ href: '#docs', current: true }, 'Documentación'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Ejemplos'),
    navLink({ href: '#about' }, 'Acerca de'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Empezar'),
  ),
)`, { align: 'stretch' }),

      h2('Un panel de filtros'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filtros'),
  drawer({ id: 'drawer-filters', title: 'Filtros', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Tipo',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Guías' },
          { value: 'example', label: 'Ejemplos' },
          { value: 'all', label: 'Todo' },
        ],
      }),
      choiceGroup({
        legend: 'Etiquetas',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Cancelar'),
        button('Aplicar'),
      ),
    ),
  ),
)`),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obligatorio. Aquello a lo que apunta el popovertarget de un disparador.'],
        ['title', 'Child', '', 'Encabezado, y nombre accesible del diálogo.'],
        ['side', "'start' | 'end'", "'end'", 'A qué borde queda anclado.'],
        ['width', 'string', "'20rem'", 'Ancho del panel, limitado a 90vw.'],
        ['closable', 'boolean', 'true', 'Mostrar la × en la cabecera.'],
        ['closeLabel', 'string', "'Close'", 'Nombre accesible de ese botón.'],
      ]),
    ],
  })
