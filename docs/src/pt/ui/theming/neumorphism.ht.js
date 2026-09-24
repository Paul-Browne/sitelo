import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Neumorfismo',
    description:
      'Soft UI: cada componente em relevo sobre a página ou afundado nela, só com luz e sombra.',
    activeHref: '/pt/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        'O ',
        code('neumorphism'),
        ' é soft UI: cada superfície é a própria página, e um controlo destaca-se só pela luz e pela sombra — em relevo sobre a página, ou afundado nela. Mantém duas coisas de que este estilo costuma abdicar, texto que cumpre WCAG AA e o contorno de foco, e segue o modo escuro como tudo o resto. Precisa, no entanto, que o fundo da própria página seja ',
        code('var(--su-bg)'),
        ', porque o efeito assenta em ambos terem a mesma cor.',
      ),
      presetPreview('neumorphism'),

      h2('Como usar'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('O meu site'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('As tuas próprias cores'),
      p(
        'O ',
        code('theme()'),
        ' continua a funcionar por cima, por isso um preset é um ponto de partida e não um fork. Este acrescenta uma décima ranhura a cada paleta, ',
        code('glow'),
        ' — a cor em que a ponta de uma barra de progresso ou de um interruptor se desvanece — para que um novo primário possa trazer a sua.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
