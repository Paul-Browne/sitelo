import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Estadística',
    description:
      'Un número que merece una mirada, con lo que significa y hacia dónde se movió.',
    activeHref: '/es/ui/stat',
    children: [
      p(
        'Una estadística es una etiqueta, un valor y opcionalmente un cambio. ',
        code('statGroup()'),
        ' junta varias en una sola superficie con separadores entre ellas.',
      ),

      h2('Estadística básica'),
      demo(`statGroup(
  stat({ label: 'Páginas', value: '204' }),
  stat({ label: 'Tiempo de compilación', value: '1,1 s' }),
  stat({ label: 'JS en cliente', value: '3,3 kB' }),
)`, { align: 'stretch' }),

      h2('Con cambio'),
      p(
        'El cambio toma su color de ',
        code('color'),
        ': verde para un número que fue en la buena dirección, rojo para uno que no. No te apoyes solo en el color: conserva el signo o la palabra.',
      ),
      demo(`statGroup(
  stat({ label: 'Páginas', value: '204', change: '+8 esta semana', color: 'success' }),
  stat({ label: 'Tiempo de compilación', value: '1,1 s', change: '−0,3 s', color: 'success' }),
  stat({ label: 'Bundle', value: '9,9 kB', change: '+1,2 kB', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Con iconos'),
      demo(`statGroup(
  stat({
    label: 'Despliegues',
    value: '128',
    color: 'primary',
    icon: icon('zap'),
  }),
  stat({
    label: 'Colaboradores',
    value: '17',
    color: 'primary',
    icon: icon('user'),
  }),
)`, { align: 'stretch' }),

      h2('Texto de ayuda'),
      demo(`statGroup(
  stat({
    label: 'Lighthouse',
    value: '100',
    change: 'accesibilidad',
    color: 'success',
    help: 'Medido en cada página en inglés dentro de CI.',
  }),
  stat({
    label: 'Índice de Pagefind',
    value: '204',
    help: 'Se reconstruye al final de cada compilación.',
  }),
)`, { align: 'stretch' }),

      h2('Por su cuenta'),
      p('Una estadística suelta no necesita grupo: sencillamente no tiene superficie propia.'),
      demo(`card(
  cardBody(stat({ label: 'Páginas totales', value: '204', change: '+8', color: 'success' })),
)`, { align: 'stretch' }),

      h2('Columnas fijas'),
      p(
        'Las estadísticas se autoajustan por defecto. ',
        code('columns'),
        ' fija el número cuando los datos deben quedarse en una sola fila.',
      ),
      demo(`statGroup({ columns: 'repeat(2, 1fr)' },
  stat({ label: 'Correctas', value: '215', color: 'success' }),
  stat({ label: 'Fallidas', value: '0', color: 'success' }),
)`, { align: 'stretch' }),

      h2('Desde datos'),
      demo(`return (() => {
  const report = [
    { label: 'Páginas', value: 204 },
    { label: 'Recursos', value: 208 },
    { label: 'Total', value: '9,7 MB' },
  ]

  return statGroup(
    report.map((entry) => stat({ label: entry.label, value: String(entry.value) })),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Qué cuenta el número.'],
        ['value', 'Child', '', 'El número en sí, compuesto con cifras tabulares.'],
        ['change', 'Child', '', 'Una variación, coloreada por color.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Da color al cambio y al icono.'],
        ['icon', 'Child', '', 'Glifo decorativo sobre la etiqueta.'],
        ['help', 'Child', '', 'Una línea más discreta bajo todo lo demás.'],
      ]),
      p(code('statGroup()'), ' admite ', code('columns'), ': cualquier valor de ', code('grid-template-columns'), '.'),
    ],
  })
