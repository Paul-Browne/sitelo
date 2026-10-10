import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Planta',
    description:
      'Um desenho técnico: linhas finas, cantos vivos e marcas de registo, etiquetas em maiúsculas monoespaçadas, e tinta com um único azul de planta.',
    activeHref: '/pt/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' é um desenho técnico: linhas finas sobre uma folha quase preta, cantos vivos e uma marca de registo — uma pequena cruz — em cada canto de um cartão, de um diálogo e de uma fila de estatísticas. Tudo o que nomeia ou aciona algo — um botão, a legenda de um campo, um separador, uma etiqueta, um cabeçalho de coluna, uma ligação na barra — é composto num tipo de letra monoespaçado, em maiúsculas espaçadas, enquanto os títulos e o texto corrido ficam numa grotesca, composta apertada. Uma linha contínua é uma aresta e uma tracejada divide o que está dentro, como uma planta marca uma aresta oculta: as linhas de uma tabela, um divisor, o troço até um passo que ainda está para vir. Fica-se por poucas cores. O botão sólido, uma caixa marcada, uma barra cheia e tudo o que é escolhido são tinta, impressa em negativo; um único azul de planta marca o foco e a etiqueta sobre um título; sucesso, aviso e perigo mantêm as suas para o que dizem. Nada projeta sombra. O modo escuro é o aspeto original; o modo claro mantém cada linha e cada marca e imprime-as a tinta sobre papel branco.',
      ),
      presetPreview('blueprint'),

      h2('Como usar'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('O meu site'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Pinta a página com ',
        code('var(--su-bp-backdrop)'),
        ' para teres o fundo do preset com uma grelha ténue traçada por cima, ou simplesmente com ',
        code('var(--su-bg)'),
        '. O preset usa a Geist ou a Inter, e a Geist Mono, a JetBrains Mono ou a IBM Plex Mono, quando a página as carrega e, caso contrário, os tipos de letra do sistema; não descarrega nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('As tuas próprias cores'),
      p(
        code('theme()'),
        ' continua a funcionar por cima, por isso um preset é um ponto de partida e não um fork. A paleta primária é a tinta — o botão sólido, uma caixa marcada, uma barra cheia, tudo o que é escolhido —, por isso ',
        code('primary'),
        ' muda a cor de tudo isso de uma vez. Os restantes tokens são do próprio preset: ',
        code('--su-bp-accent'),
        ', o azul que desenha o foco e marca um título; ',
        code('--su-bp-mark'),
        ', as marcas de registo, que ',
        code('transparent'),
        ' faz desaparecer; ',
        code('--su-bp-field'),
        ', a linha à volta de um campo; ',
        code('--su-bp-track'),
        ', a calha por onde corre uma barra de progresso; ',
        code('--su-bp-grid'),
        ' e ',
        code('--su-bp-cell'),
        ', as linhas do fundo e o tamanho dos seus quadrados; e ',
        code('--su-bp-tracking'),
        ', o espaçamento entre as maiúsculas de uma etiqueta. Aqui o azul passa a um laranja de sinalização, e as marcas com ele.',
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
