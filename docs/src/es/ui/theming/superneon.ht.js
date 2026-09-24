import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Violeta casi negro, bordes finísimos y luz de neón: botones píldora oscuros con un borde que brilla, y títulos iluminados desde arriba.',
    activeHref: '/es/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' es violeta casi negro con bordes finísimos y una luz que viene de dentro. Un botón sólido es una píldora oscura, iluminada por sus bordes interiores y rodeada por un degradado que brilla más allá de su contorno; los títulos grandes pasan de claro a lavanda, y todo lo que está elegido o activado se lleva un halo. El brillo es siempre decoración, así que cada etiqueta sigue sobre un color plano que cumple WCAG AA. El modo oscuro es el aspecto original; el modo claro conserva las píldoras oscuras y el brillo y los pone sobre una página lavanda pálida.',
      ),
      presetPreview('superneon'),

      h2('Cómo usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Pinta la página con ',
        code('var(--su-sn-backdrop)'),
        ' para tener el fondo del preset con una luz violeta cayendo desde arriba, o simplemente con ',
        code('var(--su-bg)'),
        '. Los títulos usan Geist si la página la carga, y la fuente del sistema si no: el preset no descarga nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Tus propios colores'),
      p(
        code('theme()'),
        ' sigue funcionando por encima, así que un preset es un punto de partida y no un fork. Este da a cada paleta dos huecos más, ',
        code('glow'),
        ' y ',
        code('glowEnd'),
        ': los dos extremos del degradado con el que se dibujan su borde y su halo. Nada se lee sobre un brillo, así que pueden ser tan vivos como quieras.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
