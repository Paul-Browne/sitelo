import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Uma consola de sistema: um só tipo de letra monoespaçado sobre preto, painéis de linha fina, etiquetas em maiúsculas a negrito e um acento ciano, com a seleção em vídeo inverso.',
    activeHref: '/pt/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        'O ',
        code('terminal'),
        ' é uma consola de sistema: um só tipo de letra monoespaçado sobre um fundo preto, painéis de linha fina com o cabeçalho separado por um traço, e cada etiqueta — um botão, a etiqueta de um campo, um separador, o cabeçalho de uma coluna — em maiúsculas, quase sempre a negrito. O ciano é o acento: os títulos grandes, os títulos de painel, o botão sólido e o foco. Uma seleção — uma linha de tabela sob o ponteiro, um segmento premido, um separador em pílula escolhido, o número da página atual, o item de menu sob o ponteiro — é impressa em vídeo inverso, escuro sobre ciano, como um terminal destaca uma linha. As paletas de sucesso, aviso e perigo são as suas cores de estado, verde, amarelo e vermelho, e um botão de contorno ou uma tag é desenhado na sua cor, linha e texto por igual. Nada é arredondado além de um botão de opção, e nada projeta sombra. O modo escuro é o aspeto original; o modo claro mantém cada linha, cada maiúscula e cada canto reto e imprime-os a preto sobre quase branco.',
      ),
      presetPreview('terminal'),

      h2('Como usar'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('O meu site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
      p(
        'Compõe também a página com ele — o fundo, a cor do texto e o tipo de letra — e os componentes assentam nela como acima. O preset usa a JetBrains Mono, a IBM Plex Mono ou a Source Code Pro quando a página carrega uma delas e, caso contrário, o tipo de letra monoespaçado do sistema; não descarrega nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('As tuas próprias cores'),
      p(
        code('theme()'),
        ' continua a funcionar por cima, por isso um preset é um ponto de partida e não um fork — aqui o acento passa a um âmbar de fósforo, também nas linhas com que é desenhado. Três tokens são do próprio preset: ',
        code('--su-tm-tracking'),
        ', o espaçamento entre as maiúsculas de uma etiqueta; ',
        code('--su-tm-track'),
        ', a calha por onde corre uma barra de progresso ou um cursor; e ',
        code('--su-tm-field'),
        ', a linha à volta de um campo, que no modo escuro é o mesmo cinzento ténue dos painéis — sobe-a se quiseres margens de campo mais marcadas.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
