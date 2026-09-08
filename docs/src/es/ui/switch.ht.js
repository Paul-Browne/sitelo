import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Interruptor',
    description:
      'Un conmutador de encendido y apagado para un ajuste que surte efecto al momento: por debajo, una casilla con role="switch".',
    activeHref: '/es/ui/switch',
    extraHead: uiHead(),
    children: [
      p(
        'Un interruptor es para un ajuste que se aplica en cuanto lo accionas. Una casilla es para una elección que confirmas después, con un botón de envío. Si tu control está en un formulario con un Guardar abajo, es una casilla.',
      ),
      p(
        'El componente se llama ',
        code('toggle()'),
        ' y no ',
        code('switch()'),
        ' por una razón aburrida pero inevitable: ',
        code('switch'),
        ' es una palabra reservada y no puede ser un nombre de importación. Por debajo es un ',
        code('<input type="checkbox">'),
        ' de verdad que lleva ',
        code('role="switch"'),
        '.',
      ),

      h2('Interruptor básico'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Sitio público', name: 'public' }),
  toggle({ label: 'Encendido', name: 'on', checked: true }),
)`),

      h2('Colores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Deshabilitado'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Apagado y bloqueado', disabled: true }),
  toggle({ label: 'Encendido y bloqueado', checked: true, disabled: true }),
)`),

      h2('Sin etiqueta'),
      p(
        'Un interruptor sin etiqueta visible sigue necesitando un nombre accesible. Pasa ',
        code('aria-label'),
        ': cae directo al input.',
      ),
      demo(`toggle({ 'aria-label': 'Activar la búsqueda con Pagefind', checked: true })`),

      h2('Una lista de ajustes'),
      p(
        'La forma habitual: la etiqueta a la izquierda, el interruptor a la derecha, una fila por ajuste.',
      ),
      demo(`return list(
  [
    ['Búsqueda con Pagefind', 'Indexa todas las páginas al final de la compilación.', true],
    ['Optimización de imágenes', 'Redimensiona y convierte imágenes al compilar. Necesita sharp.', true],
    ['Islas de servidor', 'Renderiza las regiones marcadas al servir la petición.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Texto junto al interruptor. Usa aria-label cuando no haya ninguno.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color del carril cuando está encendido.'],
        ['checked', 'boolean', 'false', 'Si empieza encendido.'],
        ['name', 'string', '', 'Nombre del campo en el formulario.'],
        ['disabled', 'boolean', 'false', 'Deshabilita el input y atenúa la fila.'],
      ]),
      p(
        'Todo lo demás cae al ',
        code('<input>'),
        ', que es donde corresponden ',
        code('onchange'),
        ' y ',
        code('aria-*'),
        '.',
      ),
    ],
  })
