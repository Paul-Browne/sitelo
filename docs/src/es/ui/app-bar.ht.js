import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Barra de aplicación',
    description:
      'La barra superior de un sitio: la marca a un lado, la navegación y las acciones al otro.',
    activeHref: '/es/ui/app-bar',
    children: [
      p(
        'Una barra de aplicación es un ',
        code('<header>'),
        ' con una fila dentro. Las piezas están separadas para que puedas ordenarlas: ',
        code('appBarNav()'),
        ' para los enlaces, ',
        code('appBarSpacer()'),
        ' para empujar lo que sigue al extremo, y ',
        code('appBarActions()'),
        ' para los botones del final.',
      ),

      h2('Barra básica'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Iniciar sesión'),
  ),
)`, { align: 'stretch' }),

      h2('Con navegación'),
      p(
        code('navLink()'),
        ' es el estilo de enlace para una barra; ',
        code('current'),
        ' marca la página activa con ',
        code('aria-current'),
        ' además de con color.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Documentación'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Ejemplos'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Empezar'),
  ),
)`, { align: 'stretch' }),

      h2('Una marca con logotipo'),
      p(
        'La marca admite cualquier marcado, y enlaza a ',
        code('/'),
        ' salvo que ',
        code('href'),
        ' diga otra cosa.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Fija y difuminada'),
      p(
        code('sticky'),
        ' fija la barra arriba del contenedor de scroll; ',
        code('blur'),
        ' la vuelve translúcida para que el contenido pase por debajo. Aquí se muestran ambas dentro de una caja con scroll, no en la página misma.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Desplázame — párrafo ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Fuera del camino al hacer scroll'),
      p(
        code("sticky: 'auto'"),
        ' mantiene la barra fija, pero la desliza fuera mientras la página baja y la devuelve en cuanto sube o llega arriba del todo. Sigue a la vista mientras el foco del teclado está dentro de ella o tiene un menú abierto.',
      ),
      p(
        'En Chromium es solo CSS, ',
        code('@container scroll-state(scrolled)'),
        ', y no se descarga nada. Los demás navegadores descargan un pequeño módulo al cargar la página, que vigila el scroll en su lugar. La barra sigue a la página; dentro de una caja con scroll propia, como esta, dale también a la caja ',
        code('container-type: scroll-state'),
        '.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; container-type: scroll-state; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: 'auto', blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'auto')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Baja y vuelve a subir — párrafo ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Con un panel lateral en pantallas pequeñas'),
      p(
        'El patrón habitual: enlaces en la barra en escritorio y un botón que abre un ',
        code('drawer()'),
        ' en el móvil. El panel es un ',
        code('<dialog>'),
        ' que el botón abre con un command, así que no necesita script.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Abrir la navegación',
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'app-bar-drawer', command: 'show-modal',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Navegación' },
    navLink({ href: '#docs' }, 'Documentación'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Ejemplos'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Contenido del enlace de marca al principio.'],
        ['href', 'string', "'/'", 'Adónde enlaza la marca.'],
        ['sticky', "boolean | 'auto'", 'false', "Fija la barra arriba al hacer scroll. 'auto' además la oculta al bajar."],
        ['blur', 'boolean', 'false', 'Fondo translúcido con desenfoque detrás.'],
        ['as', 'string', "'header'", 'Elemento que se renderiza.'],
      ]),
      p('Las piezas:'),
      propsTable([
        ['appBarNav', '', '', 'Un elemento nav que contiene los enlaces.'],
        ['appBarSpacer', '', '', 'Hueco flexible; todo lo que vaya después se va al extremo.'],
        ['appBarActions', '', '', 'Grupo de botones al final.'],
        ['navLink', 'href, current, color', '', 'Un enlace con estilo de barra; current marca la página activa.'],
      ], { headers: ['Pieza', 'Props', 'Por defecto', 'Descripción'] }),
    ],
  })
