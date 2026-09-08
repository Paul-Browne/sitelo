import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Grelha',
    description:
      'Uma grelha adaptável que encaixa tantas colunas quantas couberem — sem pontos de rutura, sem media queries.',
    activeHref: '/pt/ui/grid',
    extraHead: uiHead(),
    children: [
      p(
        'Sem ',
        code('columns'),
        ', uma grelha encaixa tantas faixas de pelo menos ',
        code('min'),
        ' quantas o espaço permitir, e cada uma divide o resto por igual. É o comportamento que uma lista de cartões quer, e não precisa de pontos de rutura: redimensiona esta página e as demonstrações abaixo reorganizam-se sozinhas.',
      ),

      h2('Auto-ajuste'),
      p('A predefinição. As faixas têm pelo menos 16rem.'),
      demo(`grid(
  ...['Rotas', 'Carregamento de dados', 'Recursos', 'Imagens', 'Ilhas', 'Pesquisa'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Largura da faixa'),
      p(
        code('min'),
        ' define quão estreita uma faixa pode ficar antes de a grelha descer para menos colunas. Mais pequeno significa mais colunas.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Um número fixo de colunas'),
      p(
        'Passa um número quando a contagem não deve mudar com a janela. Cada faixa fica com uma parte igual.',
      ),
      demo(`grid({ columns: 3 },
  ...['Um', 'Dois', 'Três'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Um modelo à medida'),
      p(
        'Uma cadeia é passada tal e qual como ',
        code('grid-template-columns'),
        ', para uma divisão de barra lateral e conteúdo ou qualquer outra coisa que o CSS grid saiba exprimir.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Barra lateral'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'O conteúdo, que fica com o resto da linha.'))),
)`, { align: 'stretch' }),

      h2('Espaçamento e alinhamento'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Curto'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Um cartão mais alto, com duas linhas de texto, para mostrar o que o align faz aos vizinhos mais baixos.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Curto'))),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['columns', 'number | string', '', 'Uma contagem fixa de faixas, ou um valor grid-template-columns em bruto. Omite para auto-ajuste.'],
        ['min', 'string', "'16rem'", 'Largura mínima da faixa no auto-ajuste.'],
        ['gap', 'Space', "'md'", 'Espaço entre faixas e linhas.'],
        ['align', 'string', "'stretch'", 'Qualquer valor de align-items.'],
        ['as', 'string', "'div'", 'Elemento a renderizar.'],
      ]),
      p(
        'Uma faixa nunca fica mais larga do que a própria grelha, mesmo quando ',
        code('min'),
        ' é maior do que o espaço disponível — por isso um mínimo de 16rem não provoca uma barra de deslocamento horizontal num telemóvel de 320 px.',
      ),
    ],
  })
