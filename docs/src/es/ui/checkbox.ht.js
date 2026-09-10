import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Casilla',
    description:
      'Una casilla y su etiqueta como un solo control: un input de verdad, estilizado con CSS en lugar de sustituido.',
    activeHref: '/es/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ' dibuja un ',
        code('<label>'),
        ' que envuelve un ',
        code('<input type="checkbox">'),
        ' de verdad y la caja que ves. El input queda oculto a la vista pero sigue ahí, así que recibe foco, se envía y toda la etiqueta es zona de clic — la marca se dibuja a partir del propio estado ',
        code(':checked'),
        ' del input, sin script de por medio.',
      ),

      h2('Casilla básica'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Enviarme novedades por correo', name: 'updates' }),
  checkbox({ label: 'Marcada', name: 'checked', checked: true }),
)`),

      h2('Colores'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Deshabilitado'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'No disponible', disabled: true }),
  checkbox({ label: 'Activada y bloqueada', checked: true, disabled: true }),
)`),

      h2('Etiquetas largas'),
      p(
        'La caja se mantiene alineada con la primera línea en vez de centrarse frente a un párrafo.',
      ),
      demo(`checkbox({
  label: 'Ejecutar una auditoría de Lighthouse tras cada compilación y fallar la compilación cuando una puntuación baje de su umbral.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Grupos'),
      p(
        code('choiceGroup()'),
        ' construye un conjunto de casillas a partir de datos, con leyenda y nombre compartidos. Pasa un array como ',
        code('value'),
        ' para marcar varias.',
      ),
      demo(`choiceGroup({
  legend: 'Generar',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Índice de Pagefind' },
  ],
  help: 'Cada uno se escribe en dist/ al final de la compilación.',
})`, { align: 'stretch' }),

      h2('En fila'),
      demo(`choiceGroup({
  legend: 'Categorías',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Con un field'),
      p(
        'Una casilla suelta rara vez necesita además una etiqueta encima. Cuando un grupo sí la necesita, ',
        code('field()'),
        ' le da el mismo tratamiento de etiqueta, ayuda y error que a un campo de texto.',
      ),
      demo(`field({ label: 'Condiciones', error: 'Tienes que aceptar las condiciones para continuar.' },
  checkbox({ label: 'Acepto las condiciones', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Texto junto a la caja. Omítelo para un control pelado.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color cuando está marcada.'],
        ['checked', 'boolean', 'false', 'Si empieza marcada.'],
        ['name', 'string', '', 'Nombre del campo en el formulario.'],
        ['value', 'string | number', '', 'Valor que se envía cuando está marcada.'],
        ['disabled', 'boolean', 'false', 'Deshabilita el input y atenúa la etiqueta.'],
      ]),
      p(
        'Todo lo demás aterriza en el ',
        code('<input>'),
        ', no en la etiqueta: así ',
        code('required'),
        ', ',
        code('onchange'),
        ' y ',
        code('data-*'),
        ' van donde esperarías. Usa ',
        code('class'),
        ' para dar estilo a la propia etiqueta.',
      ),
      p(
        'Para un conjunto construido a partir de datos, mira ',
        code('choiceGroup()'),
        ' en la página ',
        code('Grupo de radios'),
        ': admite las mismas opciones en ambos casos, cambiando con ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
