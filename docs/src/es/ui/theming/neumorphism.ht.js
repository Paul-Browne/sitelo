import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/es.js'

export default () =>
  uiLayout({
    title: 'Neumorfismo',
    description:
      'Soft UI: cada componente en relieve sobre la página o hundido en ella, solo con luz y sombra.',
    activeHref: '/es/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' es soft UI: cada superficie es la propia página, y un control destaca solo por la luz y la sombra — en relieve sobre la página o hundido en ella. Conserva dos cosas a las que este estilo suele renunciar, un texto que cumple WCAG AA y el contorno de foco, y sigue al modo oscuro como todo lo demás. Eso sí, necesita que el fondo de la propia página sea ',
        code('var(--su-bg)'),
        ', porque el efecto depende de que ambos sean del mismo color.',
      ),
      presetPreview('neumorphism'),

      h2('Cómo usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mi sitio'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Tus propios colores'),
      p(
        code('theme()'),
        ' sigue funcionando por encima, así que un preset es un punto de partida y no un fork. Este añade una décima ranura a cada paleta, ',
        code('glow'),
        ' — el color en el que se funde el extremo de una barra de progreso o de un interruptor — para que un primario nuevo pueda traer el suyo.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
