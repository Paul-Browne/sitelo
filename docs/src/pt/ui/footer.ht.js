import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Rodapé',
    description:
      'O fundo de um site: colunas de ligações, e uma linha por baixo.',
    activeHref: '/pt/ui/footer',
    children: [
      p(
        'Um rodapé é uma grelha de colunas que se ajusta sozinha, mais uma linha final opcional que ocupa sempre toda a largura, sejam quantas forem as colunas.',
      ),
      p(
        'É exportado como ',
        code('footer'),
        ' e como ',
        code('siteFooter'),
        ', porque ',
        code('footer'),
        ' é também o elemento ',
        code('<footer>'),
        ' do javascript-to-html e importar ambos com um só nome é um erro de sintaxe.',
      ),

      h2('Rodapé básico'),
      demo(`footer(
  footerColumn({ title: 'Documentação' },
    '<a href="/pt/docs">Primeiros passos</a>',
    '<a href="/pt/docs/routing">Rotas</a>',
    '<a href="/pt/docs/data">Carregamento de dados</a>',
  ),
  footerColumn({ title: 'Componentes' },
    '<a href="/pt/ui">Visão geral</a>',
    '<a href="/pt/ui/button">Botão</a>',
    '<a href="/pt/ui/card">Cartão</a>',
  ),
  footerColumn({ title: 'Projeto' },
    '<a href="https://github.com/paul-browne/sitelo">GitHub</a>',
    '<a href="https://www.npmjs.com/package/sitelo">npm</a>',
  ),
)`, { align: 'stretch' }),

      h2('Com linha final'),
      p(
        code('footerBottom()'),
        ' atravessa todas as colunas, por isso continua a ser uma linha de largura total faça o que fizer a grelha por cima.',
      ),
      demo(`footer(
  footerColumn({ title: 'Documentação' }, '<a href="/pt/docs">Guia</a>', '<a href="/pt/ui">Componentes</a>'),
  footerColumn({ title: 'Exemplos' }, '<a href="/pt/examples">Todos os exemplos</a>'),
  footerBottom(
    text({ variant: 'caption' }, '© 2026 Paul Browne · MIT'),
    stack({ direction: 'row', gap: 'sm' },
      chip({ size: 'sm', color: 'neutral' }, 'v2.7'),
      chip({ size: 'sm', color: 'success', dot: true }, 'Construção a passar'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Uma coluna de marca'),
      p(
        'Uma coluna não tem de ser ligações. Tudo o que passes como filho do ',
        code('footer()'),
        ' em vez de uma coluna ocupa a sua própria célula na grelha.',
      ),
      demo(`footer(
  div(
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'sitelo'),
      text({ variant: 'small', tone: 'muted' }, 'Geração de sites estáticos sem configuração, com o Vite por baixo.'),
    ),
  ),
  footerColumn({ title: 'Documentação' }, '<a href="/pt/docs">Guia</a>', '<a href="/pt/ui">Componentes</a>'),
  footerColumn({ title: 'Projeto' }, '<a href="#">GitHub</a>', '<a href="#">npm</a>'),
)`, { align: 'stretch' }),

      h2('Colunas fixas'),
      p(
        'Por predefinição as colunas ajustam-se sozinhas. ',
        code('columns'),
        ' aceita qualquer valor de ',
        code('grid-template-columns'),
        ' quando queres uma forma específica — uma coluna de marca larga e duas colunas estreitas de ligações, por exemplo.',
      ),
      demo(`footer({ columns: '2fr 1fr 1fr' },
  div(text({ variant: 'small', tone: 'muted' }, 'Uma primeira coluna mais larga para a marca e uma frase sobre ela.')),
  footerColumn({ title: 'Documentação' }, '<a href="/pt/docs">Guia</a>'),
  footerColumn({ title: 'Mais' }, '<a href="/pt/examples">Exemplos</a>'),
)`, { align: 'stretch' }),

      h2('Só a linha final'),
      demo(`footer(
  footerBottom(text({ variant: 'caption' }, '© 2026 · Feito com sitelo')),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('footer()'), ':'),
      propsTable([
        ['columns', 'string', '', 'Um valor de grid-template-columns. Ajusta-se sozinho quando omitido.'],
        ['as', 'string', "'footer'", 'Elemento a renderizar.'],
      ]),
      propsTable([
        ['footerColumn', 'title', '', 'Uma coluna com título; os filhos passam a uma lista de ligações.'],
        ['footerBottom', '', '', 'Linha de largura total sob as colunas.'],
      ], { headers: ['Parte', 'Props', 'Predefinição', 'Descrição'] }),
    ],
  })
