import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Plano',
    description:
      'Un dibujo técnico: líneas finas, esquinas rectas y marcas de registro, etiquetas en mayúsculas monoespaciadas, y tinta con un único azul de plano.',
    activeHref: '/es/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' es un dibujo técnico: líneas finas sobre una hoja casi negra, esquinas rectas y una marca de registro —una pequeña cruz— en cada esquina de una tarjeta, de un diálogo y de una fila de estadísticas. Todo lo que nombra o acciona algo —un botón, la etiqueta de un campo, una pestaña, una etiqueta, un encabezado de columna, un enlace de la barra— va en una fuente monoespaciada, en mayúsculas espaciadas, mientras que los títulos y el texto corrido siguen en una grotesca, compuesta apretada. Una línea continua es un borde y una discontinua divide lo que hay dentro, como un plano marca una arista oculta: las filas de una tabla, un separador, el tramo hasta un paso que aún no ha llegado. Se ciñe a pocos colores. El botón sólido, una casilla marcada, una barra llena y todo lo elegido son tinta, impresa en negativo; un único azul de plano marca el foco y la etiqueta sobre un título; éxito, aviso y peligro conservan los suyos para lo que dicen. Nada proyecta sombra. El modo oscuro es el aspecto original; el modo claro conserva cada línea y cada marca y lo imprime en tinta sobre papel blanco.',
      ),
      presetPreview('blueprint'),

      h2('Cómo usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Pinta la página con ',
        code('var(--su-bp-backdrop)'),
        ' para tener el fondo del preset con una cuadrícula tenue trazada encima, o con un simple ',
        code('var(--su-bg)'),
        '. El preset usa Geist o Inter, y Geist Mono, JetBrains Mono o IBM Plex Mono, si la página las carga y, si no, las fuentes del propio sistema; no descarga nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('Tus propios colores'),
      p(
        code('theme()'),
        ' sigue funcionando por encima, así que un preset es un punto de partida y no un fork. La paleta primaria es la tinta —el botón sólido, una casilla marcada, una barra llena, todo lo elegido—, así que ',
        code('primary'),
        ' lo recolorea todo de una vez. El resto son tokens propios del preset: ',
        code('--su-bp-accent'),
        ', el azul con que se dibujan el foco y la marca de un título; ',
        code('--su-bp-mark'),
        ', las marcas de registro, que ',
        code('transparent'),
        ' hace desaparecer; ',
        code('--su-bp-field'),
        ', la línea que rodea un campo; ',
        code('--su-bp-track'),
        ', el carril por el que corre una barra de progreso; ',
        code('--su-bp-grid'),
        ' y ',
        code('--su-bp-cell'),
        ', las líneas del fondo y el tamaño de sus cuadros; y ',
        code('--su-bp-tracking'),
        ', el espaciado entre las mayúsculas de una etiqueta. Aquí el azul pasa a un naranja de señalización, y las marcas con él.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
