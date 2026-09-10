import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Separadores',
    description:
      'Três formas: ligações, uma página por separador; painéis que se trocam no lugar; ou painéis guiados pelo URL.',
    activeHref: '/pt/ui/tabs',
    extraHead: uiHead(),
    children: [
      p(
        'Dá a cada item um ',
        code('href'),
        ' e os separadores passam a ligações — uma página por separador, sem script, com ',
        code('aria-current'),
        ' no ativo. Dá a cada item um ',
        code('panel'),
        ' e passam a ser um grupo de rádios cujos painéis se trocam no lugar, e continua sem script.',
      ),
      p(
        'Num site estático a forma em ligações costuma ser a certa: dá um URL a cada vista e sobrevive a ter o JavaScript desligado. Usa painéis quando o conteúdo for pequeno e trocar não deva custar uma navegação.',
      ),

      h2('Separadores em ligações'),
      p(
        'São mesmo ligações: clicar navega. O sublinhado vem de ',
        code('active'),
        ' ou de ',
        code('value'),
        ' no build, não do clique, por isso cada página marca o seu próprio separador. Um separador em ligação não reage sozinho ao URL: para isso, troca no lugar com os painéis mais abaixo.',
      ),
      demo(`tabs({
  items: [
    { label: 'Migalhas', href: '/pt/ui/breadcrumbs' },
    { label: 'Separadores', href: '/pt/ui/tabs', active: true },
    { label: 'Paginação', href: '/pt/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Separadores com painéis'),
      p(
        'O separador é uma ',
        code('<label>'),
        ' de um rádio que a folha de estilos mantém fora de vista, e o painel que se segue ao rádio marcado é o que o CSS mostra. Esta página não importa nada: trocar, e andar entre os separadores com as setas, é o que um grupo de rádios já faz.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Instalar', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Usar', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Construir', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Separadores com ligação'),
      p(
        'Dá também aos itens com painel um ',
        code('href'),
        ' com fragmento e os rádios dão lugar a ligações: o URL nomeia o separador, o ',
        code(':target'),
        ' aponta-o, aparece o painel que vem a seguir, e a escolha sobrevive a um recarregamento, a uma ligação partilhada e ao botão de retroceder. O id fica no separador e não no painel porque o browser leva ao topo da janela aquilo que o URL nomeia — no painel, empurraria os separadores para fora do ecrã onde acabaste de clicar. Só um elemento por documento pode ser ',
        code(':target'),
        ', por isso esta forma é para um único conjunto de separadores por página. O deslize em si não se cancela: seguir um fragmento é mover a janela. Só se escolhe para onde vai e onde pousa — é para isso que servem o id no separador e o seu ',
        code('scroll-margin-block-start'),
        ', que se define com a prop ',
        code('scrollMargin'),
        ': dá a um cabeçalho fixo pelo menos a altura dele.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Preparar', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Este painel é o #tab-setup: copia o URL e ele volta.'))) },
    { id: 'deploy', label: 'Publicar', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'E este é o #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pastilhas'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Tudo', href: '#all', active: true },
      { label: 'Guias', href: '#guides' },
      { label: 'Exemplos', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Cores'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Outro', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Outro', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Outro', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Muitos separadores'),
      p('A lista desliza na horizontal em vez de mudar de linha, por isso a fila mantém a forma num telemóvel. Os separadores com painel mudam de linha: cada painel tem de vir a seguir ao seu separador, por isso não sobra fila nenhuma para deslizar.'),
      demo(`tabs({
  items: [
    'Visão geral', 'Rotas', 'Dados', 'Recursos', 'Imagens', 'Ilhas', 'TypeScript', 'CLI', 'Publicação',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Desativado'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Disponível', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Este funciona.'))) },
    { id: 'soon', label: 'Em breve', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Acessibilidade'),
      p(
        'A forma com painéis é um grupo de rádios a sério: os separadores são elementos ',
        code('<label>'),
        ' de rádios que partilham um ',
        code('name'),
        ', por isso um leitor de ecrã anuncia qual de quantos está escolhido, e as setas, o Home e o End funcionam sem carregar nada. A forma com ligação são ligações simples e não leva ',
        code('aria-current'),
        ' — seria escrito uma vez e ficaria errado ao primeiro clique. De propósito não é uma tablist ARIA — ',
        code('aria-selected'),
        ' é escrito uma vez, no servidor, e o CSS não o consegue manter verdadeiro à medida que clicas. A forma em ligações também não é uma tablist: ligações que navegam são ligações, e dar-lhes semântica de separador seria mentir sobre o que fazem.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadeias, ou objetos { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id do item ativo. Recai sobre active, e depois sobre o primeiro.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Como o separador ativo é marcado.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor do separador ativo.'],
        ['label', 'string', "'Tabs'", 'Nome acessível do grupo. Só na forma com painéis.'],
        ['name', 'string', 'id do primeiro item', 'Nome do grupo de rádios. Só é preciso com dois conjuntos de separadores com painel na mesma página.'],
        ['href', 'string', '', 'Num item: uma página para ligar ou, com panel, o fragmento que lhe dá nome.'],
        ['scrollMargin', 'Space', "'md'", 'Quanto espaço a janela deixa por cima do separador. Só na forma :target.'],
      ]),
    ],
  })
