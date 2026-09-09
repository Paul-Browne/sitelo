import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Deslizador',
    description:
      'Un input de rango nativo, estilizado a juego con el resto de los controles.',
    activeHref: '/es/ui/slider',
    extraHead: uiHead(),
    children: [
      p(
        'Esto es un ',
        code('<input type="range">'),
        ' de verdad: las flechas, Inicio y Fin, y el anuncio correcto vienen todos del navegador. Solo se estilizan el carril y el pulgar.',
      ),

      h2('Deslizador básico'),
      demo(`sliderField({ label: 'Calidad', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Rango y paso'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Volumen', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Columnas', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Escala', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Mostrar el valor'),
      p(
        code('showValue'),
        ' pone un ',
        code('<output>'),
        ' junto al carril con el valor con el que se compiló la página, y el input va a buscar su propio handler en el primer arrastre, así que el número sigue al pulgar. No hay nada que importar: un número que se quedara obsoleto en silencio sería peor que no tener número, así que este no se te deja a ti.',
      ),
      demo(`sliderField({
  label: 'Calidad de imagen',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Más alto pesa más y hace la compilación más lenta.',
})`, { align: 'stretch' }),

      h2('Colores'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Deshabilitado'),
      demo(`sliderField({ label: 'Bloqueado', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Sin etiqueta'),
      p(
        'Un ',
        code('slider()'),
        ' pelado es el control a secas: dale un ',
        code('aria-label'),
        ' cuando no haya una etiqueta visible que lo señale.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Tamaño del texto' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('En un formulario'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Ancho máximo de imagen', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Calidad', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Guardar'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['min', 'number | string', '0', 'Límite inferior.'],
        ['max', 'number | string', '100', 'Límite superior.'],
        ['step', 'number | string', '', 'Incremento. Omítelo para el valor por defecto del navegador, 1.'],
        ['value', 'number | string', '', 'Valor inicial.'],
        ['showValue', 'boolean', 'false', 'Añade un <output> con el valor de la compilación.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color del pulgar.'],
        ['name', 'string', '', 'Nombre del campo; el id se deriva de él.'],
        ['disabled', 'boolean', 'false', 'Deshabilita el control.'],
      ]),
      p(
        code('sliderField()'),
        ' admite además ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' y ',
        code('required'),
        ' — mira ',
        code('textField()'),
        '.',
      ),
    ],
  })
