import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Selector',
    description:
      'Un select nativo, estilizado a juego con el resto de los campos, con las opciones construidas a partir de datos.',
    activeHref: '/es/ui/select',
    children: [
      p(
        'Esto es un ',
        code('<select>'),
        ' de verdad con el desplegable propio del navegador, lo que significa que funciona sin JavaScript, se abre bien en un móvil y se navega con el teclado sin necesitar nada de esta biblioteca.',
      ),
      p(
        code('select()'),
        ' es el control pelado; ',
        code('selectField()'),
        ' lo envuelve en etiqueta, texto de ayuda y mensaje de error, igual que hace ',
        code('textField()'),
        '.',
      ),

      h2('Selector básico'),
      p(
        'Las opciones pueden ser cadenas simples, en cuyo caso el valor y la etiqueta coinciden.',
      ),
      demo(`selectField({
  label: 'Tema',
  name: 'theme',
  options: ['Claro', 'Oscuro', 'Sistema'],
})`, { align: 'stretch' }),

      h2('Valores y etiquetas'),
      p(
        'Pasa objetos cuando el valor que se envía difiere del texto que lee una persona. ',
        code('value'),
        ' marca la opción seleccionada.',
      ),
      demo(`selectField({
  label: 'Salida',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — el valor por defecto' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Marcador de posición'),
      p(
        'Un placeholder se dibuja como una primera opción deshabilitada, seleccionada cuando no hay ',
        code('value'),
        ', así el campo empieza vacío sin ser una elección válida.',
      ),
      demo(`selectField({
  label: 'Destino del despliegue',
  name: 'target',
  placeholder: 'Elige un hosting…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Grupos'),
      p(
        'Una entrada con su propio array ',
        code('options'),
        ' se convierte en un ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Extensión de página',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Tamaños'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Pequeño', name: 'sm', size: 'sm', options: ['Uno', 'Dos'] }),
  selectField({ label: 'Mediano', name: 'md', size: 'md', options: ['Uno', 'Dos'] }),
  selectField({ label: 'Grande', name: 'lg', size: 'lg', options: ['Uno', 'Dos'] }),
)`, { align: 'stretch' }),

      h2('Ayuda, error y deshabilitado'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Idioma',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'Se usa para el atributo lang del html.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Elige uno…',
    options: ['sitelo'],
    error: 'Elige un framework para continuar.',
  }),
  selectField({
    label: 'Plan',
    name: 'plan',
    options: ['Gratis'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('Desde datos'),
      p(
        'Las opciones no son más que un array, así que normalmente vienen de lo que ',
        code('data()'),
        ' ya cargó para la página.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Hola mundo' },
    { slug: 'static-first', title: 'Primero lo estático' },
    { slug: 'no-runtime', title: 'Sin runtime' },
  ]

  return selectField({
    label: 'Entrada destacada',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Cadenas, objetos { value, label, disabled }, o { label, options } para un grupo.'],
        ['value', 'string | number', '', 'Qué opción está seleccionada.'],
        ['placeholder', 'string', '', 'Primera opción deshabilitada, seleccionada cuando no hay valor.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Altura del control y tamaño del texto.'],
        ['name', 'string', '', 'Nombre del campo; el id se deriva de él.'],
        ['invalid', 'boolean', 'false', 'Pone aria-invalid. selectField lo hace por ti a partir de error.'],
        ['disabled', 'boolean', 'false', 'Deshabilita el control.'],
      ]),
      p(
        code('selectField()'),
        ' admite además ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' y ',
        code('fieldClass'),
        ' — mira ',
        code('textField()'),
        '. Los hijos se añaden después de las opciones generadas, así que puedes escribir a mano las que necesites.',
      ),
    ],
  })
