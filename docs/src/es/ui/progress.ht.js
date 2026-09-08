import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Progreso',
    description:
      'Una barra para el trabajo con final conocido, un spinner para el que no lo tiene.',
    activeHref: '/es/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        'Usa una barra determinada siempre que sepas cuánto queda: es la única que le dice algo al lector. Omite ',
        code('value'),
        ' y la barra se anima en su lugar, lo cual dice «sigo trabajando» y nada más.',
      ),

      h2('Determinada'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Indeterminada'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Una barra sin ',
        code('label'),
        ' se marca con ',
        code('aria-hidden'),
        ': un rol progressbar sin nombre accesible no le dice nada a un lector de pantalla, así que una barra sin etiqueta se trata como decoración. Etiqueta todo aquello que el lector deba seguir.',
      ),

      h2('Etiquetas'),
      p(
        'Una etiqueta nombra lo que está pasando; ',
        code('showValue'),
        ' añade el porcentaje a la derecha.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Renderizando páginas', showValue: true }),
  progress({ value: 30, max: 60, label: 'Optimizando imágenes', showValue: true }),
  progress({ label: 'Esperando al despliegue' }),
)`, { align: 'stretch' }),

      h2('Colores y altura'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Correcto', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Degradado', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Fallando', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Una escala distinta de 100'),
      p(
        code('max'),
        ' te deja pasar los números tal cual — páginas construidas sobre páginas totales — en vez de calcular antes un porcentaje.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 de 169 páginas', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Spinner'),
      p(
        'Un spinner se dimensiona en ',
        code('em'),
        ', así que encaja con el texto que tenga al lado sin que haya que decirle un tamaño.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  spinner({ size: 'sm' }),
  spinner(),
  spinner({ size: 'lg' }),
)`),

      h2('El spinner en contexto'),
      p(
        'Dale a un spinner suelto un ',
        code('label'),
        ' para que se anuncie. Uno dentro de un botón no lo necesita: el botón ya dice qué está haciendo.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    spinner({ label: 'Cargando' }),
    text({ variant: 'small', tone: 'muted' }, 'Obteniendo la última compilación…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Desplegando'),
    button({ variant: 'outline', loading: true }, 'Comprobando enlaces'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — también exportado como ', code('progressBar'), ':'),
      propsTable([
        ['value', 'number', '', 'Cuánto se lleva hecho. Omítelo para la animación indeterminada.'],
        ['max', 'number', '100', 'Qué valor cuenta como completo.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Color del relleno.'],
        ['label', 'Child', '', 'Texto sobre la barra; también su nombre accesible.'],
        ['showValue', 'boolean', 'false', 'Mostrar el porcentaje junto a la etiqueta.'],
        ['height', 'Space', "'0.5rem'", 'Grosor de la barra.'],
      ]),
      p(code('spinner()'), ':'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diámetro. El mediano se dimensiona en em, para encajar con el texto de al lado.'],
        ['label', 'string', '', 'Nombre accesible. Sin él, el spinner queda oculto a los lectores de pantalla.'],
      ]),
    ],
  })
