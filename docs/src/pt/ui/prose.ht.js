import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Prosa',
    description:
      'Estilizar um bloco de HTML que não foste tu a escrever — saída de Markdown, um campo de CMS, a descrição de um RSS.',
    activeHref: '/pt/ui/prose',
    extraHead: uiHead(),
    children: [
      p(
        'Um renderizador de Markdown devolve etiquetas nuas: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — sem classes a que agarrar. O ',
        code('prose()'),
        ' envolve esse HTML e estiliza-o.',
      ),
      p(
        'É a única exceção deliberada desta biblioteca. Em todo o resto o estilo está confinado a classes ',
        code('su-'),
        ' precisamente para nunca tocar em marcação que não escolheste; aqui não há classes a que apontar, por isso as regras apanham etiquetas nuas — mas só dentro do invólucro.',
      ),

      h2('Prosa básica'),
      demo(`prose(
  '<h2>Primeiros passos</h2>' +
  '<p>Escreve uma função que devolva HTML. Corre <code>sitelo build</code>. Publica <code>dist/</code>.</p>' +
  '<ul><li>Rotas por ficheiros</li><li>Dados na construção</li><li>Sem runtime no cliente</li></ul>'
)`, { align: 'stretch' }),

      h2('Tudo o que estiliza'),
      demo(`prose(
  '<h3>Um cabeçalho</h3>' +
  '<p>Texto corrido com <a href="/pt/docs">uma ligação</a>, <strong>negrito</strong> e <code>código inline</code>.</p>' +
  '<blockquote><p>Uma citação destacada, à parte do texto à volta.</p></blockquote>' +
  '<ol><li>Primeiro</li><li>Segundo<ul><li>Aninhado</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Olá&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Opção</th><th>Predefinição</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Carrega em <kbd>⌘</kbd> <kbd>K</kbd> para pesquisar.</p>'
)`, { align: 'stretch' }),

      h2('Tamanhos'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Pequena</strong> — para o resumo de um cartão ou uma barra lateral.</p>'),
  prose('<p><strong>Média</strong> — a predefinição, para o corpo de um artigo.</p>'),
  prose({ size: 'lg' }, '<p><strong>Grande</strong> — para uma introdução curta e em destaque.</p>'),
)`, { align: 'stretch' }),

      h2('Com um blogue em Markdown'),
      p(
        'A forma que o exemplo do blogue quer: renderiza o Markdown na construção, envolve o resultado e publica-o.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'pt-PT' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // o marked devolve uma cadeia de HTML sem classe nenhuma
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Componentes dentro da prosa'),
      p(
        'Todas as regras de prosa excluem elementos com uma classe ',
        code('su-'),
        ', por isso um componente largado num bloco de prosa mantém o seu próprio estilo em vez de apanhar margens de artigo.',
      ),
      demo(`prose(
  '<p>Algum Markdown renderizado, e depois um componente:</p>',
  alert({ color: 'warning', title: 'Continua a ser um alerta normal' },
    'O bloco de prosa à volta não o reestiliza.'),
  '<p>E de volta à prosa.</p>',
)`, { align: 'stretch' }),

      h2('Uma palavra sobre confiança'),
      p(
        'O ',
        code('prose()'),
        ' desenha os seus filhos como HTML — é essa a ideia, e é assim que o ',
        code('javascript-to-html'),
        ' funciona em toda a parte. Se o HTML vier de um sítio que não controlas, sanitiza-o antes de chegar aqui. Um renderizador de Markdown com o HTML em bruto desligado costuma bastar.',
      ),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamanho base da letra; tudo o resto escala em em a partir dele.'],
        ['as', 'string', "'div'", 'Elemento a renderizar, por exemplo article.'],
      ]),
    ],
  })
