import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Lista',
    description:
      'Filas de contenido con algo opcional a cada lado: la forma con la que se construyen la mayoría de pantallas de ajustes y de feeds.',
    activeHref: '/es/ui/list',
    extraHead: uiHead(),
    children: [
      p(
        'Una lista es una superficie con borde hecha de filas. Cada fila tiene un título, una descripción opcional y huecos al principio y al final para un avatar, un icono o un control.',
      ),

      h2('Lista básica'),
      demo(`list(
  listItem({ title: 'Rutas', description: 'src/about.ht.js pasa a ser /about' }),
  listItem({ title: 'Carga de datos', description: 'data() se ejecuta una vez, en la compilación' }),
  listItem({ title: 'Recursos', description: 'Solo se empaqueta lo que tu HTML referencia' }),
)`, { align: 'stretch' }),

      h2('Huecos inicial y final'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Subió 3 commits a main',
    end: chip({ size: 'sm', color: 'neutral' }, 'hace 2 h'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Abrió una pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'abierta'),
  }),
)`, { align: 'stretch' }),

      h2('Filas que enlazan'),
      p(
        'Una fila con ',
        code('href'),
        ' pone el ancla dentro del ',
        code('<li>'),
        ' y no alrededor, así que la lista sigue siendo una lista válida. No pongas además un botón en la fila: el contenido interactivo no puede anidarse dentro de un enlace.',
      ),
      demo(`list(
  listItem({ title: 'Primeros pasos', description: 'Instalación y primera página', href: '/es/docs' }),
  listItem({ title: 'Rutas', description: 'Basadas en archivos, con segmentos dinámicos', href: '/es/docs/routing' }),
  listItem({ title: 'Despliegue', description: 'Netlify, Vercel, Pages, Amplify', href: '/es/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Filas con controles'),
      p(
        'Cuando una fila lleva un interruptor o un botón, deja la fila sin enlazar y que sea el control la parte interactiva.',
      ),
      demo(`list(
  listItem({
    title: 'Búsqueda con Pagefind',
    description: 'Indexa todas las páginas al final de la compilación',
    end: toggle({ 'aria-label': 'Búsqueda con Pagefind', checked: true }),
  }),
  listItem({
    title: 'Optimización de imágenes',
    description: 'Redimensiona y convierte imágenes. Necesita sharp.',
    end: toggle({ 'aria-label': 'Optimización de imágenes', checked: true }),
  }),
  listItem({
    title: 'Islas de servidor',
    description: 'Renderiza las regiones marcadas al servir la petición',
    end: toggle({ 'aria-label': 'Islas de servidor' }),
  }),
)`, { align: 'stretch' }),

      h2('Sin adornos'),
      p(
        code('plain'),
        ' quita el borde y el fondo, para una lista que va dentro de una tarjeta o de una barra lateral que ya tiene su propia superficie.',
      ),
      demo(`card(
  cardHeader({ title: 'Compilaciones recientes' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · hace 4 minutos', end: chip({ size: 'sm', color: 'success', dot: true }, 'correcta') }),
      listItem({ title: 'dcfaaae', description: 'main · hace 2 horas', end: chip({ size: 'sm', color: 'success', dot: true }, 'correcta') }),
      listItem({ title: 'a46a461', description: 'main · ayer', end: chip({ size: 'sm', color: 'danger', dot: true }, 'fallida') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Filas libres'),
      p(
        'Sin ',
        code('title'),
        ' ni ',
        code('description'),
        ', una fila dibuja los hijos que le des — para una maquetación que la forma de dos líneas no cubre.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Fila a medida'),
        text({ variant: 'caption', tone: 'muted' }, 'Lo que quieras ahí dentro'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Acción'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Desde datos'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' páginas',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Quita el borde y el fondo.'],
        ['as', 'string', "'ul'", 'Elemento que se renderiza, por ejemplo ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'La línea principal de la fila.'],
        ['description', 'Child', '', 'Una segunda línea atenuada.'],
        ['start', 'Child', '', 'Hueco inicial: un avatar o un icono.'],
        ['end', 'Child', '', 'Hueco final: un chip, un control, una marca de tiempo.'],
        ['href', 'string', '', 'Convierte la fila en un enlace, con el ancla dentro del li.'],
        ['interactive', 'boolean', 'false', 'Resalte al pasar por encima sin convertirla en enlace.'],
      ]),
    ],
  })
