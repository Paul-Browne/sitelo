import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/es.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * Una tarjeta por página de componente, agrupadas exactamente igual que la
 * referencia de componentes. Cada `demo` se renderiza en vivo dentro de su
 * tarjeta.
 */
const GROUPS = [
  ['Maquetación', [
    ['/es/ui/container', 'Contenedor', 'Una columna de página centrada y con ancho limitado.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'centrado'))`],
    ['/es/ui/stack', 'Pila', 'Una fila o columna flex con un token de espaciado como hueco.',
      `stack({ direction: 'row', gap: 'sm' }, chip('uno'), chip('dos'), chip('tres'))`],
    ['/es/ui/grid', 'Cuadrícula', 'Mete tantas columnas como quepan, sin media queries.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/es/ui/divider', 'Separador', 'Una línea entre secciones, con o sin etiqueta.',
      `div({ style: 'width: 100%' }, divider('o'))`],
    ['/es/ui/aspect-ratio', 'Relación de aspecto', 'Mantén una caja con forma fija, para que nada salte al cargar.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/es/ui/grain', 'Grano', 'Extiende un grano de película sobre cualquier cosa, para que una superficie plana no lo sea.',
      `grain({ style: 'width: 100%; background: var(--su-surface-2); padding: 0.75rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'con grano'))`],
    ['/es/ui/card', 'Tarjeta', 'Una superficie para contenido agrupado, con cabecera, cuerpo y pie.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Una tarjeta')))`],
  ]],
  ['Tipografía', [
    ['/es/ui/typography', 'Tipografía', 'Una escala tipográfica que elige su propio elemento.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Encabezado'), text({ variant: 'caption', tone: 'muted' }, 'Pie'))`],
    ['/es/ui/prose', 'Prosa', 'Da estilo a HTML crudo de Markdown o de un CMS.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Un encabezado</strong></p><p>Y un párrafo.</p>')`],
    ['/es/ui/link', 'Enlace', 'Un ancla con estilo, con los atributos que necesita un enlace externo.',
      `text({ variant: 'small' }, 'Lee la ', link({ href: '/es/docs' }, 'documentación'), '.')`],
    ['/es/ui/icons', 'Iconos', '99 glifos sobre una retícula, dimensionados y coloreados por el texto de alrededor.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Entradas', [
    ['/es/ui/button', 'Botón', 'Cinco variantes, cinco colores, tres tamaños.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Guardar'), button({ size: 'sm', variant: 'outline' }, 'Cancelar'))`],
    ['/es/ui/button-group', 'Grupo de botones', 'Botones unidos en un solo control.',
      `buttonGroup({ label: 'Vista previa' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Uno'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Dos'))`],
    ['/es/ui/text-field', 'Campo de texto', 'Etiqueta, control, ayuda y error, conectados entre sí.',
      `textField({ label: 'Correo', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/es/ui/select', 'Selector', 'Un select nativo, estilizado a juego.',
      `selectField({ label: 'Tema', name: 'g-theme', size: 'sm', options: ['Claro', 'Oscuro'], value: 'Oscuro' })`],
    ['/es/ui/checkbox', 'Casilla', 'Un input de verdad, estilizado con CSS en vez de sustituido.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'Feed RSS' }))`],
    ['/es/ui/radio', 'Grupo de radios', 'Una opción entre varias, con radios que comparten nombre.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['gratis', 'pro'] })`],
    ['/es/ui/switch', 'Interruptor', 'Un conmutador para un ajuste que se aplica al momento.',
      `stack({ gap: 'sm' }, toggle({ label: 'Público', checked: true }), toggle({ label: 'Borradores' }))`],
    ['/es/ui/slider', 'Deslizador', 'Un input de rango nativo, estilizado a juego.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Vista previa' }))`],
    ['/es/ui/toggle-button', 'Botón de alternancia', 'Un botón que se queda pulsado.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Sí'), toggleButton({ size: 'sm' }, 'No'))`],
    ['/es/ui/toggle-group', 'Grupo de alternancia', 'Un control segmentado, con botones o con enlaces.',
      `toggleGroup({ size: 'sm', label: 'Vista previa', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Visualización de datos', [
    ['/es/ui/avatar', 'Avatar', 'Una imagen cuando la hay, iniciales cuando no.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/es/ui/badge', 'Insignia', 'Un recuento o un punto prendido en una esquina.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Bandeja'))`],
    ['/es/ui/chip', 'Chip', 'Un tag, un estado, un filtro.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'correcto'), chip({ color: 'neutral' }, 'estático'))`],
    ['/es/ui/tooltip', 'Tooltip', 'Una pista al pasar por encima y al recibir foco, dibujada solo con CSS.',
      `tooltip({ content: 'Sin script' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Pasa por aquí'))`],
    ['/es/ui/table', 'Tabla', 'Filas y columnas a partir de datos, en un contenedor con scroll.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Página' }, { key: 's', header: 'Tamaño', align: 'end' }],
        rows: [{ p: '/', s: '4,1 kB' }, { p: '/docs', s: '12,7 kB' }] })`],
    ['/es/ui/list', 'Lista', 'Filas con algo a cada lado.',
      `list({ plain: true }, listItem({ title: 'Rutas', description: 'Basadas en archivos' }))`],
    ['/es/ui/figure', 'Figura', 'Una imagen y su pie, como una sola figura.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Un pie', style: 'width: 7rem' })`],
  ]],
  ['Feedback', [
    ['/es/ui/alert', 'Alerta', 'Un mensaje cuyo icono y rol ARIA siguen a su color.',
      `alert({ color: 'success' }, 'Desplegado.')`],
    ['/es/ui/empty', 'Estado vacío', 'El aspecto de una lista antes de tener nada dentro.',
      `empty({ title: 'Aquí no hay nada', style: 'padding: 0' })`],
    ['/es/ui/progress', 'Progreso', 'Una barra para el trabajo conocido, un spinner para el resto.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/es/ui/skeleton', 'Esqueleto', 'Un marcador con la forma del contenido que viene.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/es/ui/toast', 'Toast', 'Un mensaje pasajero, añadido desde script.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Guardado.'))`],
  ]],
  ['Navegación', [
    ['/es/ui/breadcrumbs', 'Migas de pan', 'El rastro de ancestros que termina en esta página.',
      `breadcrumbs({ items: [{ label: 'Documentación', href: '/es/docs' }, { label: 'UI' }] })`],
    ['/es/ui/pagination', 'Paginación', 'Páginas numeradas, con ventana, como enlaces de verdad.',
      `pagination({ page: 2, count: 5, href: (page) => '/es/ui#p' + page })`],
    ['/es/ui/tabs', 'Pestañas', 'Enlaces, una página por pestaña — o paneles que cambian en el sitio.',
      `tabs({ variant: 'pills', items: [{ label: 'Una', href: '/es/ui#t1', active: true }, { label: 'Dos', href: '/es/ui#t2' }] })`],
    ['/es/ui/app-bar', 'Barra de aplicación', 'La marca a un lado, la navegación y las acciones al otro.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/es/ui/theme-toggle', 'Cambio de tema', 'Claro y oscuro, sin destello al entrar.',
      `themeToggle()`],
  ]],
  ['Superposiciones', [
    ['/es/ui/modal', 'Modal', 'Un diálogo sobre la API de popover, sin script por ningún lado.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Abrir modal')`],
    ['/es/ui/drawer', 'Panel lateral', 'Un panel desde el borde, con la misma mecánica de popover.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Abrir panel')`],
    ['/es/ui/menu', 'Menú', 'Un desplegable sobre details: abrir y cerrar salen gratis.',
      `chip({ color: 'neutral' }, 'Acciones ▾')`],
    ['/es/ui/accordion', 'Acordeón', 'Secciones plegables, incluido el modo exclusivo.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Una pregunta' }] }))`],
    ['/es/ui/collapsible', 'Plegable', 'Un único «ver más», sin la decoración del acordeón.',
      `collapsible({ trigger: 'Ver más' }, 'Escondido hasta que lo pidas.')`],
  ]],
  ['Secciones', [
    ['/es/ui/hero', 'Hero', 'Lo alto de una página de aterrizaje: titular, frase, acciones.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Un titular'), text({ variant: 'caption', tone: 'muted' }, 'Y una frase.'))`],
    ['/es/ui/footer', 'Pie de página', 'Columnas de enlaces, y una línea debajo.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Documentación'), text({ variant: 'caption', tone: 'muted' }, 'Guía · Componentes'))`],
    ['/es/ui/stat', 'Estadística', 'Un número que merece una mirada, y lo que significa.',
      `stat({ label: 'Páginas', value: '204', change: '+8', color: 'success' })`],
    ['/es/ui/steps', 'Pasos', 'Un recorrido numerado, con lo hecho marcado como hecho.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Instalar', 'Compilar'] }))`],
    ['/es/ui/timeline', 'Cronología', 'Entradas en orden, a lo largo de una línea.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Secciones', color: 'primary' }] }))`],
    ['/es/ui/mockup', 'Mockup', 'Una captura en un navegador, una ventana, un teléfono o una terminal.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Estilos', [
    ['/es/ui/theming', 'Temas', 'Cada color, radio y tipografía, desde una sola llamada.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Una tarjeta de la galería. La vista previa es inerte y el nombre es un enlace estirado. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Un div, no un ancla: estas vistas previas contienen botones e inputs
     * de verdad, y el contenido interactivo no puede anidarse dentro de un
     * enlace. En su lugar el ancla del nombre se estira sobre toda la
     * tarjeta, e `inert` saca los controles de la demo del orden de
     * tabulación y del árbol de accesibilidad.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — componentes para sitelo',
    description:
      'Una biblioteca de componentes para sitelo: botones, tarjetas, formularios, tablas y modales, como funciones que devuelven HTML.',
    activeHref: '/es/ui',
    children: [
      p(
        'sitelo-ui es una biblioteca de componentes para sitelo. Cada componente es una función que devuelve una cadena de HTML, así que se anida directamente en la página que ya estás escribiendo: sin compilador, sin runtime, sin hidratación.',
      ),
      p(
        'Todos los ejemplos de esta sección los renderiza la misma compilación que renderiza la página que los rodea. Lo que ves es lo que produjo el código de debajo, y sigue los temas claro y oscuro de este sitio porque sitelo-ui lee el mismo atributo ',
        code('data-theme'),
        ' que la documentación.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Puesta en marcha'),
      p(
        'Dos líneas: importa los componentes y pon ',
        code('styles()'),
        ' en el head. La ',
        a({ href: '/es/docs/ui' }, 'página de componentes de la documentación'),
        ' cubre la instalación, los temas, la convención de llamada y el runtime opcional de cliente, y lista todas las exportaciones en una sola tabla.',
      ),
      p(
        'El directorio ',
        code('examples/ui'),
        ' del repositorio renderiza el conjunto entero en una sola página.',
      ),
    ],
  })
