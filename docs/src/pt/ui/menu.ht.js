import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { preview, uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menu',
    description:
      'Um menu pendente construído sobre <details>, por isso abre e fecha sem script nenhum.',
    activeHref: '/pt/ui/menu',
    extraHead: uiHead(),
    children: [
      p(
        'Um menu é um ',
        code('<details>'),
        ' com um painel estilizado. É uma escolha deliberada em vez da API de popover: um popover vive na camada de topo e não pode ser posicionado em relação ao seu acionador sem posicionamento por âncora, que ainda não está em toda a parte. Um ',
        code('<details>'),
        ' posiciona-se bem já hoje e não precisa de nada carregado.',
      ),
      p(
        'O acionador é esse ',
        code('<summary>'),
        ', com ar de botão — por isso passas a etiqueta e as props de botão ao ',
        code('menu()'),
        ' em vez de passares um ',
        code('button()'),
        ' já desenhado. Um summary já é interativo, e um botão lá dentro aninha dois controlos onde existe uma só ação: marcação inválida, e duas paragens de tabulação para uma coisa.',
      ),
      p(
        'Fechar ao clicar fora e com Escape vem de um handler ',
        code('ontoggle'),
        ' que os importa na primeira vez que um menu é aberto — e só então. Se esse módulo nunca chegar, um menu continua a abrir e fechar pelo seu próprio summary.',
      ),

      h2('Menu básico'),
      demo(`menu({ trigger: 'Ações' },
  menuItem({ href: '#edit' }, 'Editar'),
  menuItem({ href: '#duplicate' }, 'Duplicar'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Eliminar'),
)`),

      h2('Alinhamento'),
      p(
        'Um menu abre a partir da berma inicial do seu acionador. ',
        code("align: 'end'"),
        ' inverte isso, que é o que um menu junto à berma direita de uma barra precisa.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Alinhado ao início', variant: 'soft' },
    menuItem({ href: '#a' }, 'Primeiro'),
    menuItem({ href: '#b' }, 'Segundo'),
  ),
  menu({ trigger: 'Alinhado ao fim', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Primeiro'),
    menuItem({ href: '#d' }, 'Segundo'),
  ),
)`, { align: 'stretch' }),

      h2('Acionadores de ícone'),
      p(
        'Um ícone sem texto de ',
        code('trigger'),
        ' precisa de um ',
        code('label'),
        ' — passa a ser o nome acessível que o ícone não consegue dar.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Mais ações',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Mudar o nome'),
    menuItem({ href: '#move' }, 'Mover'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Arquivar'),
  ),
)`),

      h2('Itens com ícones'),
      demo(`menu({ trigger: 'Ficheiro' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Página nova'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Abrir…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Construir o site'),
)`),

      h2('Botões em vez de ligações'),
      p(
        'Um item sem ',
        code('href'),
        ' desenha um ',
        code('<button>'),
        ' — para uma ação que acontece na página em vez de uma navegação.',
      ),
      demo(`menu({ trigger: 'Exportar', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Exportado como JSON.',{color:'success'}))" }, 'Como JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Exportado como CSV.',{color:'success'}))" }, 'Como CSV'),
)`),
      // The demo above raises toasts; this is the region they land in.
      // Fixed-position, so it renders here but appears in the corner.
      preview('toasts()'),

      h2('Numa barra da aplicação'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Mais',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/pt/docs' }, 'Documentação'),
      menuItem({ href: '/pt/examples' }, 'Exemplos'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Acessibilidade'),
      p(
        'O painel é um ',
        code('role="menu"'),
        ' cujos itens são ',
        code('role="menuitem"'),
        ', e o summary leva ',
        code('aria-haspopup'),
        '. Um ',
        code('<details>'),
        ' não é um widget de menu nativo, por isso isto é uma aproximação razoável e não uma perfeita — para uma lista simples de ligações, um ',
        code('nav'),
        ' dentro do details é igualmente válido e promete menos.',
      ),

      h2('Props'),
      p(code('menu()'), ' — as props do acionador são as do botão:'),
      propsTable([
        ['trigger', 'Child', '', 'Etiqueta visível. Passa texto, não um button() já desenhado.'],
        ['icon', 'Child', '', 'Marcação antes da etiqueta, ou sozinha para um acionador só de ícone.'],
        ['label', 'string', '', 'Nome acessível. Obrigatório quando há ícone e não há texto de trigger.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Estilo do acionador.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'De que paleta o acionador bebe.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamanho do acionador.'],
        ['align', "'start' | 'end'", "'start'", 'Com que berma do acionador o painel se alinha.'],
        ['triggerClass', 'string', '', 'Classes extra para o acionador em vez do details que o envolve.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Desenha uma âncora; sem ele, um botão.'],
        ['icon', 'Child', '', 'Marcação antes da etiqueta.'],
        ['as', 'string', "'button'", 'Elemento a renderizar quando não há href.'],
      ]),
      p(code('menuSeparator()'), ' não aceita props — é o fio entre grupos de itens.'),
    ],
  })
