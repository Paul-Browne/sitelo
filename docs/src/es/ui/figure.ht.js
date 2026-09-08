import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Figura',
    description:
      'Una imagen y su pie, como una sola figura — con el espacio reservado antes de que llegue la imagen.',
    activeHref: '/es/ui/figure',
    extraHead: uiHead(),
    children: [
      p(
        'Un ',
        code('<figure>'),
        ' ata el pie a aquello que describe, cosa que un párrafo bajo una imagen no hace. Pasa ',
        code('src'),
        ' para el caso habitual, o hijos para cualquier otra cosa que merezca un pie.',
      ),

      h2('Figura básica'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'El logotipo de sitelo',
  caption: 'El logotipo, tal como aparece en la barra superior.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Con la proporción reservada'),
      p(
        code('ratio'),
        ' envuelve la imagen en un ',
        code('aspectRatio()'),
        ', así el pie nunca salta hacia abajo cuando la imagen carga.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Poner pie a otra cosa'),
      p('Sin ', code('src'), ', los hijos son el contenido de la figura.'),
      demo(`figure({ caption: 'Tabla 1 — salida de una compilación por defecto.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'Archivo' }, { key: 'size', header: 'Tamaño', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Código con pie'),
      p(
        'Fíjate en la prop ',
        code('text'),
        ' de ',
        code('code()'),
        ': en toda esta biblioteca los hijos se dibujan como HTML, así que una muestra con etiquetas necesita escaparse o el navegador la construye en vez de mostrarla.',
      ),
      demo(`figure({ caption: 'Una página de sitelo, entera.' },
  code({ text: 'export default () => "<h1>Hola</h1>"' }),
)`, { align: 'stretch' }),

      h2('Texto alternativo'),
      p(
        'El atributo ',
        code('alt'),
        ' siempre se escribe, vacío si no das nada: una imagen sin ',
        code('alt'),
        ' se anuncia por su nombre de archivo, que es peor que el silencio. El pie no es un sustituto: el pie lo lee todo el mundo, el alt describe la imagen a quien no puede verla.',
      ),
      p(
        'Cuando el pie ya dice todo lo que dice la imagen, ',
        code("alt: ''"),
        ' es la respuesta correcta.',
      ),

      h2('En prosa'),
      p(
        'Las figuras que salen de un renderizador de Markdown ya las estiliza ',
        code('prose()'),
        '. Este componente es para las figuras que construyes tú.',
      ),

      h2('Props'),
      propsTable([
        ['src', 'string', '', 'Origen de la imagen. Omítelo y usa hijos en su lugar.'],
        ['alt', 'string', "''", 'Texto alternativo. Siempre se escribe, aunque esté vacío.'],
        ['caption', 'Child', '', 'El figcaption.'],
        ['ratio', 'string', '', 'Reserva el espacio antes de que cargue la imagen.'],
      ]),
    ],
  })
