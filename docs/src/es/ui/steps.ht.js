import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Pasos',
    description:
      'Un recorrido numerado, con los pasos que dejas atrás marcados como hechos.',
    activeHref: '/es/ui/steps',
    children: [
      p(
        code('current'),
        ' es el índice del paso en curso. Todo lo anterior está completo y recibe una marca; todo lo posterior está por llegar. El actual se marca con ',
        code('aria-current="step"'),
        ', así que además de colorearse se anuncia.',
      ),

      h2('Pasos básicos'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Instalar' },
    { title: 'Escribir una página' },
    { title: 'Compilar' },
    { title: 'Desplegar' },
  ],
})`, { align: 'stretch' }),

      h2('Con descripciones'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Instalar', description: 'npm install -D sitelo' },
    { title: 'Escribir una página', description: 'src/index.ht.js' },
    { title: 'Compilar', description: 'sitelo build' },
    { title: 'Desplegar', description: 'Publica dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Vertical'),
      p('Mejor cuando las descripciones pasan de unas pocas palabras.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Añade el paquete', description: 'sitelo trae su propio Vite, así que no hay nada más que instalar.' },
    { title: 'Escribe una función que devuelva HTML', description: 'Un archivo en src/ ya es un sitio entero.' },
    { title: 'Publica la salida', description: 'dist/ son archivos estáticos a secas: cualquier hosting los acepta.' },
  ],
})`, { align: 'stretch' }),

      h2('Nada hecho todavía'),
      demo(`steps({ current: 0, items: ['Instalar', 'Configurar', 'Desplegar'] })`, { align: 'stretch' }),

      h2('Todo hecho'),
      p(
        'Pon ',
        code('current'),
        ' más allá del último índice y todos los pasos se leen como completos.',
      ),
      demo(`steps({ current: 3, items: ['Instalar', 'Configurar', 'Desplegar'] })`, { align: 'stretch' }),

      h2('En el móvil'),
      p(
        'Una fila horizontal no tiene adónde ir en una pantalla estrecha, así que por debajo de 40rem se vuelve vertical por su cuenta, sin ninguna prop. Estrecha esta ventana para verlo.',
      ),

      h2('Ponerle etiqueta'),
      p(
        'La lista es un ',
        code('<ol>'),
        ', que ya lleva el orden. Añade ',
        code('label'),
        ' cuando la página tenga más de un conjunto de pasos y haya que distinguirlos.',
      ),
      demo(`steps({
  label: 'Progreso del despliegue',
  current: 1,
  items: ['Compilar', 'Subir', 'Invalidar la caché'],
})`, { align: 'stretch' }),

      h2('Avanzar el flujo'),
      p(
        'El estado son tres nombres de clase y un ',
        code('aria-current'),
        ', repartidos por todos los pasos. ',
        code('setStep()'),
        ' los mueve a la vez, así que un asistente que avanza en el navegador es una llamada y no un bucle.',
      ),
      p('Un índice más allá del último paso deja todos completos, que es como se ve un flujo terminado. O desde un atributo de evento, sin nada en el bundle:'),
      codeBlock('En cualquier parte', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Next')`, 'javascript'),
      p('O desde tu propio módulo, cuando ya haya uno en marcha:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadenas, u objetos { title, description }.'],
        ['current', 'number', '0', 'Índice del paso en curso.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Disposición. La horizontal pasa a vertical por debajo de 40rem.'],
        ['label', 'string', '', 'Nombre accesible de la lista.'],
      ]),
    ],
  })
