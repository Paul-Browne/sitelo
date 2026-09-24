import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Neobrutalismo',
    description:
      'Cor plana, linhas grossas de tinta e sombras duras: cada componente com contorno, e afundado na sua própria sombra ao ser premido.',
    activeHref: '/pt/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        'O ',
        code('neubrutalism'),
        ' é cor plana e tinta grossa: cada superfície tem contorno, e tudo o que se destaca da página projeta uma sombra dura, sem desfoque. Premir um controlo afunda-o na sua própria sombra, e um interruptor ligado fica lá. Os preenchimentos suaves são pastéis vivos com texto escuro por cima, os sólidos ficam escuros o suficiente para levar uma etiqueta branca, e no modo escuro a tinta passa a creme, porque uma sombra preta não se veria numa página escura.',
      ),
      presetPreview('neubrutalism'),

      h2('Como usar'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('O meu site'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Pinta também a página com ',
        code('var(--su-bg)'),
        ', e ela fica com o creme do preset, com as superfícies brancas a destacarem-se.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('As tuas próprias cores'),
      p(
        'O ',
        code('theme()'),
        ' continua a funcionar por cima, por isso um preset é um ponto de partida e não um fork. Este acrescenta dois tokens próprios: ',
        code('--su-nb-ink'),
        ', a cor com que se desenham todas as linhas e sombras, e ',
        code('--su-nb-lift'),
        ', a distância a que um controlo em relevo fica da página — e, portanto, quanto um clique o desloca.',
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
