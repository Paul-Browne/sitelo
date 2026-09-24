import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Neobrutalismo',
    description:
      'Color plano, líneas gruesas de tinta y sombras duras: cada componente con contorno, y hundido en su propia sombra al pulsarlo.',
    activeHref: '/es/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' es color plano y tinta gruesa: cada superficie tiene contorno, y todo lo que se separa de la página proyecta una sombra dura, sin desenfoque. Al pulsar un control, se hunde en su propia sombra, y un interruptor activado se queda ahí. Los rellenos suaves son pasteles vivos con texto oscuro encima, los sólidos son lo bastante oscuros para llevar una etiqueta blanca, y en modo oscuro la tinta se vuelve crema, porque una sombra negra no se vería sobre una página oscura.',
      ),
      presetPreview('neubrutalism'),

      h2('Cómo usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Pinta también la página con ',
        code('var(--su-bg)'),
        ', y tomará el crema del preset, con las superficies blancas destacando sobre él.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Tus propios colores'),
      p(
        code('theme()'),
        ' sigue funcionando por encima, así que un preset es un punto de partida y no un fork. Este añade dos tokens propios: ',
        code('--su-nb-ink'),
        ', el color con el que se dibujan todas las líneas y sombras, y ',
        code('--su-nb-lift'),
        ', cuánto se separa de la página un control en relieve y, por tanto, cuánto lo mueve una pulsación.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neubrutalism' }),
  theme({
    primary: { base: '#c2185b', hover: '#a8144e', active: '#8e1042', soft: '#ffb3d0', softFg: '#5c0a2a' },
    '--su-nb-lift': '6px',
  }),
)`, 'javascript'),
    ],
  })
