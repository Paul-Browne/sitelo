import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Violeta quase preto, arestas finíssimas e luz néon: botões em pílula escuros com um contorno que brilha, e títulos iluminados de cima.',
    activeHref: '/pt/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        'O ',
        code('superneon'),
        ' é violeta quase preto, com arestas finíssimas e uma luz que vem de dentro. Um botão sólido é uma pílula escura, iluminada ao longo das arestas interiores e rodeada por um gradiente que brilha para lá do seu contorno; os títulos grandes passam do claro ao lavanda, e tudo o que está escolhido ou ligado ganha um halo. O brilho é sempre só decoração, por isso cada etiqueta continua sobre uma cor plana que cumpre a WCAG AA. O modo escuro é o aspeto original; o modo claro mantém as pílulas escuras e o brilho e põe-nos sobre uma página lavanda pálida.',
      ),
      presetPreview('superneon'),

      h2('Como usar'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('O meu site'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Pinta a página com ',
        code('var(--su-sn-backdrop)'),
        ' para teres o fundo do preset com uma luz violeta a cair de cima, ou simplesmente com ',
        code('var(--su-bg)'),
        '. Os títulos usam a Geist se a página a carregar, e o tipo de letra do sistema se não — o preset não descarrega nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('As tuas próprias cores'),
      p(
        'O ',
        code('theme()'),
        ' continua a funcionar por cima, por isso um preset é um ponto de partida e não um fork. Este dá a cada paleta mais dois espaços, ',
        code('glow'),
        ' e ',
        code('glowEnd'),
        ': as duas pontas do gradiente com que se desenham o seu contorno e o seu halo. Nada se lê sobre um brilho, por isso podem ser tão vivos quanto quiseres.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
