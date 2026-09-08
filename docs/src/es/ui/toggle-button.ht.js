import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Botón de alternancia',
    description:
      'Un botón que se queda pulsado: un ajuste mostrado como botón en vez de como casilla.',
    activeHref: '/es/ui/toggle-button',
    extraHead: uiHead(),
    children: [
      p(
        'Un botón de alternancia está encendido o apagado, y lo dice con ',
        code('aria-pressed'),
        '. La negrita en un editor de texto, un filtro aplicado, un panel que se está viendo.',
      ),
      p(
        'No hay input oculto ni script detrás: en una página estática un botón de alternancia ',
        code('muestra'),
        ' un estado en vez de cambiarlo. Añade tu propio listener, o recurre a ',
        code('checkbox()'),
        ' cuando pertenezca a un formulario y a ',
        code('toggle()'),
        ' — el interruptor — cuando sea un ajuste dentro de una lista.',
      ),

      h2('Alternancia básica'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Negrita'),
  toggleButton('Cursiva'),
  toggleButton('Subrayado'),
)`),

      h2('Variantes'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline encendido'),
    toggleButton({ variant: 'outline' }, 'Outline apagado'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost encendido'),
    toggleButton({ variant: 'ghost' }, 'Ghost apagado'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft encendido'),
    toggleButton({ variant: 'soft' }, 'Soft apagado'),
  ),
)`, { align: 'start' }),

      h2('Tamaños'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Pequeño'),
  toggleButton({ size: 'md', pressed: true }, 'Mediano'),
  toggleButton({ size: 'lg', pressed: true }, 'Grande'),
)`),

      h2('Con iconos'),
      p(
        'Una alternancia de solo icono necesita nombre accesible: pasa ',
        code('aria-label'),
        ', que cae hasta el botón.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Negrita',
    title: 'Negrita',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Cursiva',
    title: 'Cursiva',
    startIcon: icon('italic'),
  }),
)`),

      h2('Deshabilitado'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Encendido, bloqueado'),
  toggleButton({ disabled: true }, 'Apagado, bloqueado'),
)`),

      h2('Hacer que haga algo'),
      p(
        'Un solo listener cambia el atributo; el estilo lo sigue.',
      ),
      codeBlock('src/main.js', `for (const button of document.querySelectorAll('[aria-pressed]')) {
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-pressed') === 'true'
    button.setAttribute('aria-pressed', String(!on))
  })
}`, 'javascript'),

      h2('Props'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Pone aria-pressed. No hay script detrás.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Cómo se ve el botón sin pulsar.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'La misma escala que button().'],
        ['disabled', 'boolean', 'false', 'Deshabilita el botón.'],
      ]),
      p(
        'Todo lo demás cae a ',
        code('button()'),
        ': ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' y demás. Para un conjunto de ellos, mira ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
