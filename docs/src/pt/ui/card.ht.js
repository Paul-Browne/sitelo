import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Cartão',
    description:
      'Uma superfície para conteúdo agrupado, com cabeçalho, corpo, rodapé e média que sabem conviver.',
    activeHref: '/pt/ui/card',
    children: [
      p(
        'Um cartão agrupa conteúdo relacionado na sua própria superfície. As partes — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — são funções separadas em vez de props, por isso usas só as que precisas e pões na ordem que o desenho pedir.',
      ),

      h2('Cartão básico'),
      demo(`card(
  cardHeader({ title: 'Rotas por ficheiros', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'As pastas passam a caminhos. Os parênteses retos passam a parâmetros. Não há router para configurar.')),
)`, { align: 'stretch' }),

      h2('Variantes'),
      p(
        'Outlined é a predefinição. Elevated troca o contorno por uma sombra, e flat tinge a superfície em vez de qualquer um dos dois.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Com rodapé'),
      p(
        code('divided'),
        ' acrescenta o fio por cima do rodapé. O rodapé é empurrado para baixo, por isso cartões numa fila alinham as suas ações mesmo quando o texto acima tem comprimentos diferentes.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Site básico' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Um projeto mínimo mais configurações de publicação.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Abrir')),
  ),
  card(
    cardHeader({ title: 'Blogue em Markdown' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Uma pasta de ficheiros .md renderizados em páginas estáticas, com feed RSS e sem qualquer JavaScript no cliente.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Abrir')),
  ),
)`, { align: 'stretch' }),

      h2('Média'),
      p(
        code('cardMedia()'),
        ' preenche o topo do cartão numa proporção fixa, para que uma fila de cartões fique certa sejam quais forem as medidas das imagens de origem.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Predefinição 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Um cartão inteiro como ligação'),
      p(
        'Dá ao cartão um ',
        code('href'),
        ' e a superfície toda passa a ser uma ligação, com a subida ao passar o rato que a acompanha. Não ponhas botões nem outras ligações dentro de um cartão nesta forma — conteúdo interativo não pode ficar aninhado dentro de uma ligação. Usa antes um botão no rodapé de um cartão simples.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/pt/docs/routing' },
    cardHeader({ title: 'Rotas', subtitle: 'Ler o guia' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Rotas dinâmicas, apanha-tudo e grupos de rotas.')),
  ),
  card({ href: '/pt/docs/data' },
    cardHeader({ title: 'Carregamento de dados', subtitle: 'Ler o guia' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() corre na construção, com cache de fetch.')),
  ),
)`, { align: 'stretch' }),

      h2('Espaçamento interno'),
      p(
        'Uma prop define de uma vez o espaçamento de todas as partes do cartão.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Conteúdo livre'),
      p(
        'As partes são uma conveniência, não uma obrigação — um cartão aceita quaisquer filhos, e ',
        code('cardHeader()'),
        ' aceita filhos próprios ao lado do título, para um avatar ou um botão de menu à direita.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Publicado há 4 minutos' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Construção passou'),
      chip({ color: 'neutral' }, '12 páginas'),
      chip({ color: 'neutral' }, '4,1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Como a superfície se separa da página.'],
        ['href', 'string', '', 'Desenha o cartão inteiro como uma ligação.'],
        ['padding', 'Space', "'lg'", 'Espaçamento usado por todas as partes do cartão.'],
      ]),
      p('As partes:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Título e subtítulo, mais quaisquer filhos ao lado.'],
        ['cardTitle', 'as', "'h3'", 'O título sozinho, quando o cabeçalho é feito à mão.'],
        ['cardSubtitle', '', '', 'A linha esbatida sob um título.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Uma imagem de capa numa proporção fixa.'],
        ['cardBody', '', '', 'A região de conteúdo principal.'],
        ['cardFooter', 'divided', 'false', 'Fila de ações em baixo; divided acrescenta o fio por cima.'],
      ], { headers: ['Parte', 'Props', 'Predefinição', 'Descrição'] }),
    ],
  })
