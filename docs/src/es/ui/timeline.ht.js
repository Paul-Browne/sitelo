import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Cronología',
    description:
      'Entradas en orden a lo largo de una línea: un registro de cambios, un historial de versiones, una página «acerca de».',
    activeHref: '/es/ui/timeline',
    children: [
      p(
        'Una cronología es una lista ordenada con una línea al costado. Constrúyela a partir de ',
        code('items'),
        ', o de hijos ',
        code('timelineItem()'),
        ' cuando las entradas no sean lo bastante uniformes como para venir de un array.',
      ),

      h2('Cronología básica'),
      demo(`timeline({
  items: [
    { time: 'Marzo de 2026', title: 'Biblioteca de componentes', description: 'sitelo-ui llega con noventa componentes.' },
    { time: 'Enero de 2026', title: 'Islas de servidor', description: 'Páginas estáticas con regiones renderizadas al servir la petición.' },
    { time: 'Octubre de 2025', title: 'Primera versión', description: 'Rutas basadas en archivos y un comando de compilación.' },
  ],
})`, { align: 'stretch' }),

      h2('Marcadores de color'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Despliegue correcto', description: '204 páginas publicadas.', color: 'success' },
    { time: '12:03', title: 'Lighthouse superado', description: 'Todos los umbrales cumplidos.', color: 'success' },
    { time: '12:01', title: 'Aviso en la comprobación de enlaces', description: 'Un enlace externo agotó el tiempo de espera.', color: 'warning' },
    { time: '12:00', title: 'Compilación iniciada', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Con iconos'),
      demo(`timeline(
  timelineItem({
    time: 'Justo ahora',
    title: 'Publicado',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: 'Hace 2 minutos',
    title: 'Compilando',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Entradas enriquecidas'),
      p('Los hijos de un ítem van bajo su descripción.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Secciones de página', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Mantenimiento', description: 'Subidas de dependencias y un arreglo en el comprobador de enlaces.' }),
)`, { align: 'stretch' }),

      h2('Desde datos'),
      p(
        'La forma habitual en un sitio estático: un archivo de registro de cambios cargado por ',
        code('data()'),
        ', mapeado directamente a ítems.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Secciones de página' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Mantenimiento' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Islas de servidor' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('¿Cronología o pasos?'),
      p(
        'Una cronología registra lo que pasó, de lo más nuevo o de lo más antiguo en adelante, y no tiene posición actual. ',
        code('steps()'),
        ' muestra el avance por un recorrido, con un paso en curso y el resto por delante o por detrás.',
      ),

      h2('Props'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Objetos con las props de timelineItem de abajo.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Cuándo ocurrió: una fecha, una versión, una hora.'],
        ['title', 'Child', '', 'Qué ocurrió.'],
        ['description', 'Child', '', 'El detalle que va debajo.'],
        ['icon', 'Child', '', 'Marcado dentro del marcador.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Color del marcador.'],
      ]),
      p('Los hijos de un ítem se dibujan bajo su descripción.'),
    ],
  })
