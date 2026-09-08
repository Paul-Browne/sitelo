import { a, h2, p, strong } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Grupo de botões',
    description:
      'Botões que andam juntos, unidos num só controlo com contornos partilhados e pontas arredondadas.',
    activeHref: '/pt/ui/button-group',
    extraHead: uiHead(),
    children: [
      p(
        'Agrupam-se botões envolvendo-os em ',
        code('buttonGroup()'),
        '. Têm de ser filhos diretos: o grupo arredonda o primeiro e o último e encosta os restantes, por isso qualquer coisa pelo meio parte a costura.',
      ),

      h2('Grupo básico'),
      demo(`buttonGroup({ label: 'Grupo de botões básico' },
  button('Um'),
  button('Dois'),
  button('Três'),
)`),

      h2('Variantes'),
      p(
        'O grupo em si não carrega cor. Define ',
        code('variant'),
        ' e ',
        code('color'),
        ' nos botões, e mantém-nos iguais em todo o grupo — é isso que o faz ler-se como um só controlo.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  buttonGroup({ label: 'Solid' },
    button({ variant: 'solid' }, 'Um'),
    button({ variant: 'solid' }, 'Dois'),
    button({ variant: 'solid' }, 'Três'),
  ),
  buttonGroup({ label: 'Outline' },
    button({ variant: 'outline', color: 'neutral' }, 'Um'),
    button({ variant: 'outline', color: 'neutral' }, 'Dois'),
    button({ variant: 'outline', color: 'neutral' }, 'Três'),
  ),
  buttonGroup({ label: 'Soft' },
    button({ variant: 'soft' }, 'Um'),
    button({ variant: 'soft' }, 'Dois'),
    button({ variant: 'soft' }, 'Três'),
  ),
)`, { align: 'start' }),

      h2('Tamanhos e cores'),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  buttonGroup({ label: 'Pequeno' },
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Esquerda'),
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Centro'),
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Direita'),
  ),
  buttonGroup({ label: 'Grande' },
    button({ size: 'lg', variant: 'soft', color: 'danger' }, 'Cancelar'),
    button({ size: 'lg', variant: 'soft', color: 'danger' }, 'Descartar'),
  ),
)`, { align: 'start' }),

      h2('Ligações'),
      p(
        'Botões com um ',
        code('href'),
        ' agrupam-se exatamente da mesma maneira — para uma fila de coisas que levam cada uma a um sítio, nenhuma delas àquele onde já estás.',
      ),
      demo(`buttonGroup({ label: 'Partilhar' },
  button({ href: '#rss', variant: 'outline', color: 'neutral' }, 'RSS'),
  button({ href: '#json', variant: 'outline', color: 'neutral' }, 'JSON'),
  button({ href: '#sitemap', variant: 'outline', color: 'neutral' }, 'Sitemap'),
)`),

      h2('Grupo de botões ou grupo de alternância?'),
      p(
        'Um grupo de botões é um contentor: junta o que lá puseres e não guarda estado. Se um dos itens estiver ',
        strong('selecionado'),
        ' — um controlo segmentado, um filtro, a secção onde estás — isso é um ',
        a({ href: '/pt/ui/toggle-group' }, 'grupo de alternância'),
        ', que constrói os itens a partir de dados e marca o ativo por ti.',
      ),
      p(
        'A regra prática: se carregar num deixa os outros errados, é um grupo de alternância. Se cada um faz a sua própria coisa, é um grupo de botões.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ gap: 'xs' },
    text({ variant: 'caption', tone: 'muted' }, 'buttonGroup — três ações separadas'),
    buttonGroup({ label: 'Ações da linha' },
      button({ variant: 'outline', color: 'neutral' }, 'Editar'),
      button({ variant: 'outline', color: 'neutral' }, 'Duplicar'),
      button({ variant: 'outline', color: 'neutral' }, 'Eliminar'),
    ),
  ),
  stack({ gap: 'xs' },
    text({ variant: 'caption', tone: 'muted' }, 'toggleGroup — uma escolha entre três'),
    toggleGroup({
      label: 'Alinhamento do texto',
      value: 'Centro',
      items: ['Esquerda', 'Centro', 'Direita'],
    }),
  ),
)`, { align: 'start' }),

      h2('Com um botão de ícone'),
      demo(`buttonGroup({ label: 'Ações do editor' },
  button({ variant: 'outline', color: 'neutral' }, 'Guardar'),
  iconButton({
    label: 'Mais ações',
    variant: 'outline',
    color: 'neutral',
    icon: icon('more-horizontal'),
  }),
)`),

      h2('Props'),
      propsTable([
        ['label', 'string', '', 'Nome acessível do grupo; passa a aria-label no role="group".'],
      ]),
      p(
        'Tudo o resto cai no invólucro. Os botões lá dentro levam as suas próprias props — vê ',
        code('button()'),
        '.',
      ),
    ],
  })
