import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Tipografia',
    description:
      'Uma escala tipográfica que escolhe o seu próprio elemento, para o esquema do documento seguir o visual.',
    activeHref: '/pt/ui/typography',
    children: [
      p(
        code('text()'),
        ' desenha um pedaço de texto num dos tamanhos da biblioteca. A variante escolhe um elemento sensato — ',
        code("variant: 'h2'"),
        ' desenha um ',
        code('<h2>'),
        ' a sério — por isso os cabeçalhos entram no esquema do documento sem ninguém ter de pensar nisso.',
      ),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Cabeçalho 1'),
  text({ variant: 'h2' }, 'Cabeçalho 2'),
  text({ variant: 'h3' }, 'Cabeçalho 3'),
  text({ variant: 'h4' }, 'Cabeçalho 4'),
  text({ variant: 'h5' }, 'Cabeçalho 5'),
  text({ variant: 'h6' }, 'Cabeçalho 6'),
  text({ variant: 'lead' }, 'Lead — um degrau acima do corpo de texto, para a frase sob um título.'),
  text({ variant: 'body' }, 'Body — a predefinição.'),
  text({ variant: 'small' }, 'Small — legendas que ainda são frases.'),
  text({ variant: 'caption' }, 'Caption — as letras miudinhas.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Cabeçalhos'),
      p(
        code('heading()'),
        ' recebe um ',
        code('level'),
        ' de esquema e dimensiona-se em conformidade. O ',
        code('size'),
        ' separa os dois: um ',
        code('<h1>'),
        ' com ar de h3 continua a ser um h1 para um leitor de ecrã.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Um cabeçalho de nível 2, dimensionado a condizer'),
  heading({ level: 2, size: 'h5' }, 'Um cabeçalho de nível 2, dimensionado como um h5'),
)`, { align: 'stretch' }),

      h2('Tom'),
      p('Três graus de ênfase, do contraste cheio ao cinzento legível mais discreto.'),
      demo(`stack({ gap: 'xs' },
  text('Predefinição — a cor em que o corpo de texto é composto.'),
  text({ tone: 'muted' }, 'Esbatido — texto secundário, ainda confortável de ler.'),
  text({ tone: 'subtle' }, 'Discreto — etiquetas e metadados.'),
)`, { align: 'stretch' }),

      h2('Alinhamento'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Início'),
  text({ align: 'center' }, 'Centro'),
  text({ align: 'end' }, 'Fim'),
)`, { align: 'stretch' }),

      h2('Truncar e limitar linhas'),
      p(
        code('truncate'),
        ' corta uma única linha com reticências. O ',
        code('lines'),
        ' limita antes a um número de linhas, que é o que o resumo de um cartão costuma querer.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Uma única linha que continua muito para lá da largura do seu contentor e acaba cortada com reticências em vez de mudar de linha.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Limitado a duas linhas. Este parágrafo estende-se por um bocado para que o limite tenha mesmo algo que cortar, e depois continua mais um pouco, para lá do ponto onde a terceira linha teria começado.'),
  )),
)`, { align: 'stretch' }),

      h2('Código inline e teclas'),
      demo(`text(
  'Corre ', code('sitelo build'), ' ou carrega em ', kbd('⌘'), ' ', kbd('K'), ' para pesquisar.',
)`, { align: 'stretch' }),
      p(
        'Os filhos são renderizados como HTML — é isso que faz o aninhamento funcionar em toda a biblioteca, e o ',
        code('code()'),
        ' não é exceção. Por isso um exemplo com etiquetas precisa da prop ',
        code('text'),
        ', que as escapa:',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Olá</em>' }), ' — text: mostrado tal como escrito'),
  text(code('<em>Olá</em>'), ' — filhos: interpretados como marcação'),
)`, { align: 'stretch' }),
      p(
        'Ambos servem. O ',
        code('text'),
        ' é para um exemplo de código, onde uma etiqueta deve ser lida e não construída. Os filhos são para saída já com realce de sintaxe, onde a marcação ',
        code('é'),
        ' o objetivo — um resultado do Prism ou do Shiki entra diretamente.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Compor'),
      p(
        'O text aceita filhos, e não apenas uma cadeia — por isso ligações, código e ênfase aninham-se lá dentro tal como fariam em HTML.',
      ),
      demo(`text({ variant: 'lead' },
  'As páginas são funções que devolvem ',
  code('HTML'),
  '. Vê o guia de ',
  link({ href: '/pt/docs/pages' }, 'escrever páginas'),
  '.',
)`, { align: 'stretch' }),

      h2('Mudar o elemento'),
      p(
        'O ',
        code('as'),
        ' substitui o elemento sem mudar o aspeto — para um cabeçalho visual que não deve aparecer no esquema, ou um ',
        code('<span>'),
        ' no meio de uma linha de texto.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Parece um cabeçalho, é um div'),
  text({ variant: 'caption', as: 'p' }, 'Estilo de caption num parágrafo'),
)`, { align: 'stretch' }),

      h2('Escondido visualmente'),
      p(
        code('visuallyHidden()'),
        ' mantém o conteúdo na árvore de acessibilidade mas fora do ecrã — a etiqueta de que um leitor de ecrã precisa, ali onde os leitores que veem a tiram do contexto.',
      ),
      demo(`text(
  'Estado da construção: ',
  chip({ color: 'success', dot: true }, 'a passar'),
  visuallyHidden(' — a última construção teve sucesso há 4 minutos'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Tamanho, peso e elemento predefinido.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Quanto contraste o texto carrega.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Alinhamento do texto.'],
        ['truncate', 'boolean', 'false', 'Uma linha, cortada com reticências.'],
        ['lines', 'number', '', 'Limitar a este número de linhas.'],
        ['as', 'string', '', 'Substitui o elemento que a variante escolheria.'],
      ]),
      p(
        'O ',
        code('heading()'),
        ' recebe ',
        code('level'),
        ' (1–6) e um ',
        code('size'),
        ' opcional; tudo o resto é igual.',
      ),
    ],
  })
