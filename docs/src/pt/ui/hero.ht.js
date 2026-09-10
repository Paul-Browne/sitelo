import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'O topo de uma página de entrada: um título, uma frase, e o que fazer a seguir.',
    activeHref: '/pt/ui/hero',
    children: [
      p(
        'Um hero é a primeira coisa numa página inicial de marketing ou de documentação. Desenha uma ',
        code('<section>'),
        ' com um ',
        code('<h1>'),
        ' lá dentro — por isso é o título da página, não um cartaz decorativo que por acaso é grande.',
      ),

      h2('Hero básico'),
      demo(`hero({
  level: 2,
  title: 'Sites estáticos, sem a framework',
  description: 'Escreve funções que devolvem HTML. Fica com um site completo.',
},
  button({ size: 'lg' }, 'Começar'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Ler a documentação'),
)`, { align: 'stretch' }),

      h2('Com antetítulo'),
      p('Uma linha curta por cima do título — uma versão, uma categoria, um anúncio.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Agora com biblioteca de componentes',
  description: 'Setenta componentes, nenhum runtime, um script opcional.',
},
  button({ size: 'lg', href: '/pt/ui' }, 'Percorrer os componentes'),
)`, { align: 'stretch' }),

      h2('Alinhado à esquerda'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Código aberto',
  title: 'Construído às claras',
  description: 'Licença MIT, e pequeno o suficiente para se ler numa tarde.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Ver no GitHub'),
)`, { align: 'stretch' }),

      h2('Com média'),
      p(
        'Passar ',
        code('media'),
        ' muda para duas colunas assim que houver espaço, e volta a empilhar numa só em ecrãs estreitos. Combina naturalmente com ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Vê a coisa a andar',
  description: 'Quando chega ao navegador, cada página já é HTML estático.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Olá mundo'),
      text({ variant: 'small', tone: 'muted' }, 'Renderizado na construção.'),
    ),
  ),
},
  button('Começar'),
)`, { align: 'stretch' }),

      h2('Dentro de um contentor'),
      p(
        'Um hero não tem limite de largura próprio — mete-o num ',
        code('container()'),
        ' para ficar alinhado com tudo o resto da página.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Contido',
    description: 'O contentor define a largura; o hero define o ritmo.',
  }),
)`, { align: 'stretch' }),

      h2('Nível de título'),
      p(
        'O título é por predefinição o ',
        code('<h1>'),
        ' da página, o que está certo numa página de entrada. Um hero a meio de uma página não é o título da página, por isso baixa-o com ',
        code('level'),
        ' — todas as demonstrações desta página o fazem, já que a página tem um h1 seu.',
      ),

      h2('Só um título'),
      p('Cada parte é opcional, e nada vazio é desenhado.'),
      demo(`hero({ level: 2, title: 'Documentação' })`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['eyebrow', 'Child', '', 'Linha pequena em maiúsculas por cima do título.'],
        ['title', 'Child', '', 'Desenhado como o h1 da página.'],
        ['description', 'Child', '', 'A frase por baixo.'],
        ['media', 'Child', '', 'Ao lado do texto num ecrã largo, por cima num estreito.'],
        ['align', "'center' | 'start'", "'center'", 'Alinhamento do texto quando não há média.'],
        ['level', 'number', '1', 'Nível de título. Baixa-o para um hero a meio de uma página.'],
        ['as', 'string', "'section'", 'Elemento a renderizar.'],
      ]),
      p('Os filhos passam a ser a fila de ações sob a descrição.'),
    ],
  })
