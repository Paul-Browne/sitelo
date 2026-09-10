import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'

export default () =>
  uiLayout({
    title: 'Painel lateral',
    description:
      'Um painel que entra pela berma — a mesma mecânica de popover de um modal, com outra forma.',
    activeHref: '/pt/ui/drawer',
    children: [
      p(
        'Um painel lateral ocupa toda a altura e está ancorado a um dos lados. Tal como o ',
        code('modal()'),
        ', é um ',
        code('popover'),
        ': um botão com o ',
        code('popovertarget'),
        ' correspondente abre-o, e o navegador trata do fundo, do clique fora e do Escape.',
      ),
      p(
        'Num site estático o seu trabalho mais comum é o menu de navegação no telemóvel.',
      ),

      h2('Painel básico'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Abrir painel'),
  drawer({ id: 'drawer-basic', title: 'Definições' },
    stack({ gap: 'md' },
      toggle({ label: 'Pesquisa Pagefind', checked: true }),
      toggle({ label: 'Otimização de imagens', checked: true }),
      toggle({ label: 'Ilhas de servidor' }),
    ),
  ),
)`),

      h2('Lados'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Do início'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Do fim'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Início' },
    text({ variant: 'small', tone: 'muted' }, 'Ancorado à berma inicial — a esquerda numa língua que se lê da esquerda para a direita.'),
  ),
  drawer({ id: 'drawer-end', title: 'Fim' },
    text({ variant: 'small', tone: 'muted' }, 'A predefinição: ancorado à berma final.'),
  ),
)`),

      h2('Largura'),
      p('Qualquer comprimento CSS. Fica limitada a 90 % da janela, por isso um painel largo ainda cabe num telemóvel.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Estreito'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Largo'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Estreito' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Largo' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Como menu de navegação'),
      p('O padrão que a maioria dos sites quer: um botão de menu na barra, as ligações num painel.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Abrir a navegação',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Navegação' },
    navLink({ href: '#docs', current: true }, 'Documentação'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Exemplos'),
    navLink({ href: '#about' }, 'Acerca'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Começar'),
  ),
)`, { align: 'stretch' }),

      h2('Um painel de filtros'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filtros'),
  drawer({ id: 'drawer-filters', title: 'Filtros', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Tipo',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Guias' },
          { value: 'example', label: 'Exemplos' },
          { value: 'all', label: 'Tudo' },
        ],
      }),
      choiceGroup({
        legend: 'Tags',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Cancelar'),
        button('Aplicar'),
      ),
    ),
  ),
)`),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obrigatório. Aquilo para onde aponta o popovertarget de um acionador.'],
        ['title', 'Child', '', 'Cabeçalho, e nome acessível do diálogo.'],
        ['side', "'start' | 'end'", "'end'", 'A que berma está ancorado.'],
        ['width', 'string', "'20rem'", 'Largura do painel, limitada a 90vw.'],
        ['closable', 'boolean', 'true', 'Mostrar o × no cabeçalho.'],
        ['closeLabel', 'string', "'Close'", 'Nome acessível desse botão.'],
      ]),
    ],
  })
