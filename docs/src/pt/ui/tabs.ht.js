import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Separadores',
    description:
      'Duas formas: ligações, uma página por separador; ou painéis que se trocam no lugar.',
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
        ' e passam a ser uma tablist a sério, cujos painéis se trocam no lugar.',
      ),
      p(
        'Num site estático a forma em ligações costuma ser a certa: dá um URL a cada vista e sobrevive a ter o JavaScript desligado. Usa painéis quando o conteúdo for pequeno e trocar não deva custar uma navegação.',
      ),

      h2('Separadores em ligações'),
      p('Sem script nenhum. O separador ativo é aquele que marcares.'),
      demo(`tabs({
  items: [
    { label: 'Visão geral', href: '#overview', active: true },
    { label: 'Instalação', href: '#installation' },
    { label: 'API', href: '#api' },
  ],
})`, { align: 'stretch' }),

      h2('Separadores com painéis'),
      p(
        'Cada separador importa o seu handler no primeiro clique — ',
        code("onclick=\"import('/su/tabs.js').then(m=>m.select(this))\""),
        ' — por isso estes trocam mesmo, teclas de seta incluídas, sem esta página importar nada. Até esse módulo chegar, o painel que o servidor marcou como ativo é simplesmente o que aparece.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Instalar', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Usar', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Construir', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
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
      p('A lista desliza na horizontal em vez de mudar de linha, por isso a fila mantém a forma num telemóvel.'),
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
        'A forma com painéis desenha uma ',
        code('role="tablist"'),
        ' como deve ser, com ',
        code('aria-selected'),
        ', ',
        code('aria-controls'),
        ' e ',
        code('tabindex'),
        ' rotativo. O script acrescenta o movimento com as setas, o Home e o End. A forma em ligações não é uma tablist de propósito — ligações que navegam são ligações, e dar-lhes semântica de separador seria mentir sobre o que fazem.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadeias, ou objetos { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id do item ativo. Recai sobre active, e depois sobre o primeiro.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Como o separador ativo é marcado.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor do separador ativo.'],
        ['label', 'string', "'Tabs'", 'Nome acessível da tablist. Só na forma com painéis.'],
      ]),
    ],
  })
