import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Pestañas',
    description:
      'Dos formas: enlaces, con una página por pestaña; o paneles que se intercambian en el sitio.',
    activeHref: '/es/ui/tabs',
    extraHead: uiHead(),
    children: [
      p(
        'Dale a cada elemento un ',
        code('href'),
        ' y las pestañas serán enlaces: una página por pestaña, sin script, con ',
        code('aria-current'),
        ' en la activa. Dale a cada elemento un ',
        code('panel'),
        ' y pasarán a ser un tablist de verdad cuyos paneles se intercambian en el sitio.',
      ),
      p(
        'En un sitio estático la forma de enlaces suele ser la correcta: le da una URL a cada vista y sobrevive a que JavaScript esté desactivado. Recurre a los paneles cuando el contenido sea pequeño y cambiar de vista no deba costar una navegación.',
      ),

      h2('Pestañas como enlaces'),
      p('Nada de script. La pestaña activa es la que tú marques.'),
      demo(`tabs({
  items: [
    { label: 'Resumen', href: '#overview', active: true },
    { label: 'Instalación', href: '#installation' },
    { label: 'API', href: '#api' },
  ],
})`, { align: 'stretch' }),

      h2('Pestañas con paneles'),
      p(
        'Cada pestaña importa su manejador en el primer clic — ',
        code("onclick=\"import('/su/tabs.js').then(m=>m.select(this))\""),
        ' —, así que estas cambian de verdad, flechas incluidas, sin que esta página importe nada. Hasta que llegue ese módulo, el panel que el servidor marcó como activo es sencillamente el que se ve.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Instalar', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Usar', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Compilar', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
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
      p('La lista de pestañas se desplaza en horizontal en vez de envolver, así que la fila mantiene su forma en el móvil.'),
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
        'La forma con paneles dibuja un ',
        code('role="tablist"'),
        ' en condiciones, con ',
        code('aria-selected'),
        ', ',
        code('aria-controls'),
        ' y ',
        code('tabindex'),
        ' rotatorio. El script añade el movimiento con flechas, Inicio y Fin. La forma de enlaces no es un tablist a propósito: los enlaces que navegan son enlaces, y darles semántica de pestaña sería mentir sobre lo que hacen.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadenas, u objetos { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id del elemento activo. Si no, recae en active, y luego en el primero.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Cómo se marca la pestaña activa.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color de la pestaña activa.'],
        ['label', 'string', "'Tabs'", 'Nombre accesible del tablist. Solo en la forma con paneles.'],
      ]),
    ],
  })
