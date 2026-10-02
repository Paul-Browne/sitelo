import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Uma só fonte monoespaçada sobre um fundo azul-marinho escuro, à maneira do Advent of Code: ações entre parênteses retos, ligações verdes e um brilho no que está aceso.',
    activeHref: '/pt/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        'O ',
        code('terminal'),
        ' é uma só fonte monoespaçada sobre um fundo azul-marinho escuro, composta como o Advent of Code: texto cinzento, ligações verdes que se iluminam ao passar o rato, branco para o que importa e um brilho da própria cor nas poucas coisas acesas. Uma ação é uma palavra entre parênteses retos, ',
        code('[Guardar]'),
        '; uma caixa de verificação é ',
        code('[ ]'),
        ' até passar a ',
        code('[X]'),
        ', e um título de segundo nível fica delimitado como ',
        code('--- Título ---'),
        '. Nada é arredondado e nada flutua sobre uma sombra suave: uma aresta é uma linha, e um cartão elevado tem linha dupla. O modo escuro é o aspeto original; o modo claro mantém a fonte, os parênteses retos e os cantos retos e imprime-os em azul-marinho sobre papel pálido, sem o brilho.',
      ),
      presetPreview('terminal'),

      h2('Como usar'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('O meu site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Compõe também a página com ele — o fundo, o cinzento e a fonte — e os componentes assentam nela como acima. O preset usa a Source Code Pro quando a página a carrega e, caso contrário, a fonte monoespaçada do sistema; não descarrega nada.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('As tuas próprias cores'),
      p(
        code('theme()'),
        ' continua a funcionar por cima, por isso um preset é um ponto de partida e não um fork. O brilho é desenhado na cor do texto onde está, por isso uma paleta que mudes brilha na nova cor — aqui o primário passa a âmbar, como um terminal mais antigo. O sucesso é o dourado de uma estrela, como a referência marca um puzzle resolvido; dá-lhe um verde da mesma forma, se preferires. Dois tokens são do próprio preset: ',
        code('--su-tm-bright'),
        ', o branco dos títulos e de tudo o que está escolhido, e ',
        code('--su-tm-glow'),
        ', a sombra que as coisas acesas usam, que é ',
        code('none'),
        ' no modo claro.',
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
