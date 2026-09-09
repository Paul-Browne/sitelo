import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'
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

      h2('Moverla desde el navegador'),
      p(
        'Una barra es HTML renderizado en el servidor: el porcentaje es una propiedad personalizada en el relleno y un número en ',
        code('aria-valuenow'),
        ', y nada en la página cambia ninguno de los dos por su cuenta. Dale a la barra un ',
        code('id'),
        ' y ',
        code('setProgress'),
        ' los mueve a la vez — el relleno, el valor anunciado y el porcentaje junto a la etiqueta.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'El máximo se recuerda, así que las llamadas siguientes son solo un valor. O alcanza el módulo igual que lo hacen los componentes, y sáltate el bundle por completo:',
      ),
      codeBlock('En cualquier parte', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Terminar')`, 'javascript'),
      p(
        'Pasar ',
        code('null'),
        ' — o cualquier cosa que no sea un número finito — devuelve la barra a la animación indeterminada, así que el trabajo que deja de dar números no necesita un caso aparte. ',
        code('getProgress()'),
        ' vuelve a leer el valor actual, en la escala propia de la barra.',
      ),

      h2('Pruébalo'),
      p('Esta página carga el runtime, así que los botones de abajo mueven la barra de verdad.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Subiendo', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Reiniciar'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Listo'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Desconocido'),
  ),
)`, { align: 'stretch' }),
      p(
        'Una barra sin etiqueta también se mueve, pero sigue siendo ',
        code('aria-hidden'),
        ' — se renderizó sin nombre a propósito, y anunciarle un valor ahora metería en el árbol de accesibilidad un progressbar sin nombre.',
      ),

      h2('Spinner'),
      p(
        'No hay un componente spinner — el spinner es un icono, y ',
        code('spin'),
        ' es lo que lo hace girar. Como cualquier icono se dimensiona en ',
        code('em'),
        ', así que encaja con el texto que tenga al lado sin que haya que decirle un tamaño.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('El spinner en contexto'),
      p(
        'Dale a un spinner suelto un ',
        code('label'),
        ' para que se anuncie. Uno dentro de un botón no lo necesita: el botón ya dice qué está haciendo.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Cargando' }),
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
      p(code('setProgress()'), ' de ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'La barra, o el id de una. Si ningún elemento tiene ese id, se prueba como selector.'],
        ['value', 'number | null', '', 'Adónde moverla. null la devuelve a la animación indeterminada.'],
        ['options.max', 'number', '100', 'Qué cuenta como completo. Se recuerda para las llamadas siguientes.'],
      ]),
      p(
        'El spinner no tiene props propias — es ',
        code("icon('spinner', { spin: true })"),
        ', y acepta lo que acepte ',
        code('icon()'),
        '.',
      ),
    ],
  })
