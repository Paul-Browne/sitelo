import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Uma consola de sistema: uma só fonte monoespaçada sobre preto, painéis de linha fina, rótulos em maiúsculas a negrito e um acento ciano, com tudo o que está selecionado em vídeo inverso.',
    activeHref: '/pt/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        'O ',
        code('terminal'),
        ' é uma consola de sistema: uma só fonte monoespaçada sobre um fundo preto, painéis de linha fina com o cabeçalho separado por um traço, e cada rótulo — um botão, a legenda de um campo, um separador, o cabeçalho de uma coluna — em maiúsculas a negrito e espaçadas. O ciano é o acento: títulos, títulos de painel, o botão sólido, o foco e tudo o que está selecionado, que é impresso em vídeo inverso, escuro sobre ciano, como um terminal destaca uma linha. As outras paletas são as suas cores de estado, verde, amarelo e vermelho, e um botão de contorno ou uma etiqueta é desenhado na sua cor, linha e texto por igual. Nada é arredondado e nada projeta sombra. O modo escuro é o aspeto original; o modo claro mantém cada linha, cada maiúscula e cada canto reto e imprime-os a preto sobre quase branco.',
      ),
      presetPreview('terminal'),

      h2('Como usar'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('O meu site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
      p(
        'Compõe também a página com ele — o fundo, a cor do texto e a fonte — e os componentes assentam nela como acima. O preset usa a JetBrains Mono, a IBM Plex Mono ou a Source Code Pro quando a página carrega uma delas e, caso contrário, a fonte monoespaçada do sistema; não descarrega nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('As tuas próprias cores'),
      p(
        code('theme()'),
        ' continua a funcionar por cima, por isso um preset é um ponto de partida e não um fork — aqui o acento passa a um âmbar de fósforo. Dois tokens são do próprio preset: ',
        code('--su-tm-tracking'),
        ', o espaçamento de um rótulo em maiúsculas, e ',
        code('--su-tm-track'),
        ', a calha por onde corre uma barra de progresso ou um controlo deslizante.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
