import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Pestañas',
    description:
      'Tres formas: enlaces, con una página por pestaña; paneles que se intercambian en el sitio; o paneles que gobierna la URL.',
    activeHref: '/es/ui/tabs',
    children: [
      p(
        'Dale a cada elemento un ',
        code('href'),
        ' y las pestañas serán enlaces: una página por pestaña, sin script, con ',
        code('aria-current'),
        ' en la activa. Dale a cada elemento un ',
        code('panel'),
        ' y pasarán a ser un grupo de radios cuyos paneles se intercambian en el sitio, y sigue sin haber script.',
      ),
      p(
        'En un sitio estático la forma de enlaces suele ser la correcta: le da una URL a cada vista y sobrevive a que JavaScript esté desactivado. Recurre a los paneles cuando el contenido sea pequeño y cambiar de vista no deba costar una navegación.',
      ),

      h2('Pestañas como enlaces'),
      p(
        'Son enlaces de verdad: al pulsar uno se navega. El subrayado sale de ',
        code('active'),
        ' o de ',
        code('value'),
        ' al construir, no del clic, así que cada página marca su propia pestaña. Una pestaña-enlace no reacciona por su cuenta a la URL: para eso, cambia en el sitio con los paneles de más abajo.',
      ),
      demo(`tabs({
  items: [
    { label: 'Migas de pan', href: '/es/ui/breadcrumbs' },
    { label: 'Pestañas', href: '/es/ui/tabs', active: true },
    { label: 'Paginación', href: '/es/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Pestañas con paneles'),
      p(
        'La pestaña es una ',
        code('<label>'),
        ' de un radio que la hoja de estilos mantiene fuera de la vista, y el panel que sigue al radio marcado es el que se muestra. Esta página no importa nada: cambiar de pestaña, y moverse entre ellas con las flechas, es lo que un grupo de radios ya hace.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Instalar', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Usar', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Compilar', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pestañas enlazables'),
      p(
        'Dale además a los elementos con panel un ',
        code('href'),
        ' con fragmento y los radios dejan paso a enlaces: la URL nombra la pestaña, ',
        code(':target'),
        ' la señala, se muestra el panel que va detrás, y la elección sobrevive a una recarga, a un enlace compartido y al botón de atrás. El id va en la pestaña y no en el panel porque el navegador lleva al borde superior lo que la URL nombre: ponerlo en el panel dejaría las pestañas fuera de la pantalla en la que acabas de pulsarlas. Solo un elemento del documento puede ser ',
        code(':target'),
        ', así que esta forma es para un único juego de pestañas por página. El desplazamiento en sí no se puede anular: seguir un fragmento es mover la ventana. Solo se puede elegir hacia qué se desplaza y dónde aterriza, y para eso están el id en la pestaña y su ',
        code('scroll-margin-block-start'),
        ', que se ajusta con la prop ',
        code('scrollMargin'),
        ': dale a una cabecera fija al menos su propia altura.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Preparar', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Este panel es #tab-setup: copia la URL y vuelve.'))) },
    { id: 'deploy', label: 'Desplegar', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Y este es #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Píldoras'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Todo', href: '#all', active: true },
      { label: 'Guías', href: '#guides' },
      { label: 'Ejemplos', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Colores'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Otra', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Otra', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Otra', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Muchas pestañas'),
      p('La lista de pestañas se desplaza en horizontal en vez de envolver, así que la fila mantiene su forma en el móvil. Las pestañas con panel sí envuelven: cada panel tiene que ir detrás de su pestaña, así que no queda ninguna fila que desplazar.'),
      demo(`tabs({
  items: [
    'Resumen', 'Rutas', 'Datos', 'Recursos', 'Imágenes', 'Islas', 'TypeScript', 'CLI', 'Despliegue',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Deshabilitada'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Disponible', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Esta sí funciona.'))) },
    { id: 'soon', label: 'Próximamente', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Accesibilidad'),
      p(
        'La forma con paneles es un grupo de radios de verdad: las pestañas son elementos ',
        code('<label>'),
        ' de radios que comparten ',
        code('name'),
        ', así que un lector de pantalla anuncia cuál de cuántas está elegida, y las flechas, Inicio y Fin funcionan sin cargar nada. La forma enlazable son enlaces normales y no lleva ',
        code('aria-current'),
        ': se escribiría una vez y quedaría mal tras el primer clic. A propósito no es un tablist ARIA: ',
        code('aria-selected'),
        ' se escribe una vez, en el servidor, y el CSS no puede mantenerlo cierto a medida que haces clic. La forma de enlaces tampoco es un tablist: los enlaces que navegan son enlaces, y darles semántica de pestaña sería mentir sobre lo que hacen.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadenas, u objetos { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id del elemento activo. Si no, recae en active, y luego en el primero.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Cómo se marca la pestaña activa.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color de la pestaña activa.'],
        ['label', 'string', "'Tabs'", 'Nombre accesible del grupo. Solo en la forma con paneles.'],
        ['name', 'string', 'id del primer elemento', 'Nombre del grupo de radios. Solo hace falta con dos juegos de pestañas con panel en una página.'],
        ['href', 'string', '', 'En un elemento: una página a la que enlazar o, junto a panel, el fragmento que lo nombra.'],
        ['scrollMargin', 'Space', "'md'", 'Cuánto espacio deja la ventana por encima de la pestaña. Solo en la forma :target.'],
      ]),
    ],
  })
