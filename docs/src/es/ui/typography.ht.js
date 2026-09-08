import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/es.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tipografía',
    description:
      'Una escala tipográfica que elige su propio elemento, para que el esquema del documento siga al visual.',
    activeHref: '/es/ui/typography',
    extraHead: uiHead(),
    children: [
      p(
        code('text()'),
        ' dibuja un fragmento de texto en uno de los tamaños de la biblioteca. La variante elige un elemento sensato — ',
        code("variant: 'h2'"),
        ' dibuja un ',
        code('<h2>'),
        ' de verdad —, así que los encabezados entran en el esquema del documento sin que nadie tenga que pensarlo.',
      ),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Encabezado 1'),
  text({ variant: 'h2' }, 'Encabezado 2'),
  text({ variant: 'h3' }, 'Encabezado 3'),
  text({ variant: 'h4' }, 'Encabezado 4'),
  text({ variant: 'h5' }, 'Encabezado 5'),
  text({ variant: 'h6' }, 'Encabezado 6'),
  text({ variant: 'lead' }, 'Lead — un paso por encima del texto de cuerpo, para la frase bajo un título.'),
  text({ variant: 'body' }, 'Body — el valor por defecto.'),
  text({ variant: 'small' }, 'Small — pies que siguen siendo frases.'),
  text({ variant: 'caption' }, 'Caption — la letra pequeña.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Encabezados'),
      p(
        code('heading()'),
        ' toma un ',
        code('level'),
        ' del esquema y se dimensiona en consecuencia. ',
        code('size'),
        ' desacopla ambas cosas: un ',
        code('<h1>'),
        ' que parece un h3 sigue siendo un h1 para un lector de pantalla.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Un encabezado de nivel 2, con su tamaño'),
  heading({ level: 2, size: 'h5' }, 'Un encabezado de nivel 2, con tamaño de h5'),
)`, { align: 'stretch' }),

      h2('Tono'),
      p('Tres pesos de énfasis, del contraste pleno al gris legible más discreto.'),
      demo(`stack({ gap: 'xs' },
  text('Por defecto — el color en el que se compone el cuerpo de texto.'),
  text({ tone: 'muted' }, 'Atenuado — texto secundario, aún cómodo de leer.'),
  text({ tone: 'subtle' }, 'Sutil — etiquetas y metadatos.'),
)`, { align: 'stretch' }),

      h2('Alineación'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Inicio'),
  text({ align: 'center' }, 'Centro'),
  text({ align: 'end' }, 'Final'),
)`, { align: 'stretch' }),

      h2('Truncar y limitar líneas'),
      p(
        code('truncate'),
        ' corta una sola línea con puntos suspensivos. ',
        code('lines'),
        ' limita a un número de líneas, que es lo que suele querer el resumen de una tarjeta.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Una sola línea que sigue mucho más allá del ancho de su contenedor y acaba cortada con puntos suspensivos en vez de envolver.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Limitado a dos líneas. Este párrafo se alarga un rato para que el recorte tenga algo que cortar, y luego sigue un poco más, más allá del punto donde habría empezado la tercera línea.'),
  )),
)`, { align: 'stretch' }),

      h2('Código en línea y teclas'),
      demo(`text(
  'Ejecuta ', code('sitelo build'), ' o pulsa ', kbd('⌘'), ' ', kbd('K'), ' para buscar.',
)`, { align: 'stretch' }),
      p(
        'Los hijos se dibujan como HTML — eso es lo que hace que anidar funcione en toda esta biblioteca, y ',
        code('code()'),
        ' no es una excepción. Así que una muestra con etiquetas necesita la prop ',
        code('text'),
        ', que las escapa:',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Hola</em>' }), ' — text: se ve tal cual se escribió'),
  text(code('<em>Hola</em>'), ' — hijos: se interpretan como marcado'),
)`, { align: 'stretch' }),
      p(
        'Ambas cosas son útiles. ',
        code('text'),
        ' es para una muestra de código, donde una etiqueta debe leerse y no construirse. Los hijos son para salida ya resaltada, donde el marcado ',
        code('es'),
        ' lo importante: un resultado de Prism o de Shiki entra directo.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Componer'),
      p(
        'Text admite hijos, no solo una cadena, así que enlaces, código y énfasis se anidan dentro igual que lo harían en HTML.',
      ),
      demo(`text({ variant: 'lead' },
  'Las páginas son funciones que devuelven ',
  code('HTML'),
  '. Mira la guía de ',
  link({ href: '/es/docs/pages' }, 'escribir páginas'),
  '.',
)`, { align: 'stretch' }),

      h2('Cambiar el elemento'),
      p(
        code('as'),
        ' sustituye el elemento sin cambiar el aspecto: para un encabezado visual que no debe aparecer en el esquema, o un ',
        code('<span>'),
        ' dentro de una línea de texto.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Parece un encabezado, es un div'),
  text({ variant: 'caption', as: 'p' }, 'Estilo de caption sobre un párrafo'),
)`, { align: 'stretch' }),

      h2('Oculto a la vista'),
      p(
        code('visuallyHidden()'),
        ' mantiene el contenido en el árbol de accesibilidad pero fuera de la pantalla: la etiqueta que necesita un lector de pantalla allí donde quien ve la obtiene del contexto.',
      ),
      demo(`text(
  'Estado de la compilación: ',
  chip({ color: 'success', dot: true }, 'correcta'),
  visuallyHidden(' — la última compilación fue bien hace 4 minutos'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Tamaño, peso y elemento por defecto.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Cuánto contraste lleva el texto.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Alineación del texto.'],
        ['truncate', 'boolean', 'false', 'Una línea, cortada con puntos suspensivos.'],
        ['lines', 'number', '', 'Limitar a este número de líneas.'],
        ['as', 'string', '', 'Sustituye el elemento que elegiría la variante.'],
      ]),
      p(
        code('heading()'),
        ' admite ',
        code('level'),
        ' (1–6) y un ',
        code('size'),
        ' opcional; todo lo demás es igual.',
      ),
    ],
  })
