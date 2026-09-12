import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/pt.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * Um cartão por página de componente, agrupados exatamente como a
 * referência de componentes. Cada `demo` é desenhada ao vivo no seu cartão.
 */
const GROUPS = [
  ['Disposição', [
    ['/pt/ui/container', 'Contentor', 'Uma coluna de página centrada e de largura limitada.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'centrado'))`],
    ['/pt/ui/stack', 'Pilha', 'Uma linha ou coluna flex com um token de espaçamento no intervalo.',
      `stack({ direction: 'row', gap: 'sm' }, chip('um'), chip('dois'), chip('três'))`],
    ['/pt/ui/grid', 'Grelha', 'Encaixa tantas colunas quantas couberem, sem media queries.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/pt/ui/divider', 'Divisória', 'Um traço entre secções, com ou sem etiqueta.',
      `div({ style: 'width: 100%' }, divider('ou'))`],
    ['/pt/ui/aspect-ratio', 'Proporção', 'Mantém uma caixa com forma fixa, para nada saltar ao carregar.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/pt/ui/grain', 'Grão', 'Estende um grão de película sobre qualquer coisa, para uma área lisa deixar de o ser.',
      `grain({ style: 'width: 100%; background: var(--su-surface-2); padding: 0.75rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'com grão'))`],
    ['/pt/ui/card', 'Cartão', 'Uma superfície para conteúdo agrupado, com cabeçalho, corpo e rodapé.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Um cartão')))`],
  ]],
  ['Tipografia', [
    ['/pt/ui/typography', 'Tipografia', 'Uma escala tipográfica que escolhe o seu próprio elemento.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Cabeçalho'), text({ variant: 'caption', tone: 'muted' }, 'Legenda'))`],
    ['/pt/ui/prose', 'Prosa', 'Estilizar HTML em bruto vindo de Markdown ou de um CMS.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Um cabeçalho</strong></p><p>E um parágrafo.</p>')`],
    ['/pt/ui/link', 'Ligação', 'Uma âncora estilizada, com os atributos que uma ligação externa precisa.',
      `text({ variant: 'small' }, 'Lê a ', link({ href: '/pt/docs' }, 'documentação'), '.')`],
    ['/pt/ui/icons', 'Ícones', '99 símbolos numa grelha, dimensionados e coloridos pelo texto à volta.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Entradas', [
    ['/pt/ui/button', 'Botão', 'Cinco variantes, cinco cores, três tamanhos.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Guardar'), button({ size: 'sm', variant: 'outline' }, 'Cancelar'))`],
    ['/pt/ui/button-group', 'Grupo de botões', 'Botões unidos num só controlo.',
      `buttonGroup({ label: 'Pré-visualização' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Um'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Dois'))`],
    ['/pt/ui/text-field', 'Campo de texto', 'Etiqueta, controlo, ajuda e erro, ligados entre si.',
      `textField({ label: 'Email', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/pt/ui/select', 'Seletor', 'Um select nativo, estilizado a condizer.',
      `selectField({ label: 'Tema', name: 'g-theme', size: 'sm', options: ['Claro', 'Escuro'], value: 'Escuro' })`],
    ['/pt/ui/checkbox', 'Caixa de seleção', 'Um input a sério, estilizado com CSS em vez de substituído.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'Feed RSS' }))`],
    ['/pt/ui/radio', 'Grupo de opções', 'Uma escolha entre várias, com rádios a partilhar um name.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['grátis', 'pro'] })`],
    ['/pt/ui/switch', 'Interruptor', 'Uma alternância para uma definição que faz efeito de imediato.',
      `stack({ gap: 'sm' }, toggle({ label: 'Público', checked: true }), toggle({ label: 'Rascunhos' }))`],
    ['/pt/ui/slider', 'Cursor', 'Um input range nativo, estilizado a condizer.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Pré-visualização' }))`],
    ['/pt/ui/toggle-button', 'Botão de alternância', 'Um botão que fica carregado.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Ligado'), toggleButton({ size: 'sm' }, 'Desligado'))`],
    ['/pt/ui/toggle-group', 'Grupo de alternância', 'Um controlo segmentado, em botões ou em ligações.',
      `toggleGroup({ size: 'sm', label: 'Pré-visualização', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Apresentação de dados', [
    ['/pt/ui/avatar', 'Avatar', 'Uma imagem quando existe, iniciais quando não.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/pt/ui/badge', 'Emblema', 'Uma contagem ou um ponto preso a um canto.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Entrada'))`],
    ['/pt/ui/chip', 'Chip', 'Uma tag, um estado, um filtro.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'passou'), chip({ color: 'neutral' }, 'estático'))`],
    ['/pt/ui/tooltip', 'Dica', 'Uma indicação ao passar o rato e ao receber foco, feita só em CSS.',
      `tooltip({ content: 'Sem script' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Passa por aqui'))`],
    ['/pt/ui/table', 'Tabela', 'Linhas e colunas a partir de dados, num contentor com deslocamento.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Página' }, { key: 's', header: 'Tamanho', align: 'end' }],
        rows: [{ p: '/', s: '4,1 kB' }, { p: '/docs', s: '12,7 kB' }] })`],
    ['/pt/ui/list', 'Lista', 'Linhas com algo de cada lado.',
      `list({ plain: true }, listItem({ title: 'Rotas', description: 'Baseadas em ficheiros' }))`],
    ['/pt/ui/figure', 'Figura', 'Uma imagem e a sua legenda, como uma só figura.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Uma legenda', style: 'width: 7rem' })`],
  ]],
  ['Feedback', [
    ['/pt/ui/alert', 'Alerta', 'Uma mensagem cujo ícone e papel ARIA seguem a cor.',
      `alert({ color: 'success' }, 'Publicado.')`],
    ['/pt/ui/empty', 'Estado vazio', 'O aspeto de uma lista antes de ter alguma coisa.',
      `empty({ title: 'Aqui não há nada', style: 'padding: 0' })`],
    ['/pt/ui/progress', 'Progresso', 'Uma barra para trabalho conhecido, um indicador para o resto.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/pt/ui/skeleton', 'Esqueleto', 'Um marcador com a forma do conteúdo que aí vem.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/pt/ui/toast', 'Toast', 'Uma mensagem passageira, acrescentada por script.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Guardado.'))`],
  ]],
  ['Navegação', [
    ['/pt/ui/breadcrumbs', 'Migalhas', 'O rasto de antepassados que termina nesta página.',
      `breadcrumbs({ items: [{ label: 'Documentação', href: '/pt/docs' }, { label: 'UI' }] })`],
    ['/pt/ui/pagination', 'Paginação', 'Páginas numeradas, com janela, como ligações a sério.',
      `pagination({ page: 2, count: 5, href: (page) => '/pt/ui#p' + page })`],
    ['/pt/ui/tabs', 'Separadores', 'Ligações, uma página por separador — ou painéis que trocam no lugar.',
      `tabs({ variant: 'pills', items: [{ label: 'Um', href: '/pt/ui#t1', active: true }, { label: 'Dois', href: '/pt/ui#t2' }] })`],
    ['/pt/ui/app-bar', 'Barra da aplicação', 'A marca de um lado, a navegação e as ações do outro.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/pt/ui/theme-toggle', 'Alternador de tema', 'Claro e escuro, sem o clarão à entrada.',
      `themeToggle()`],
  ]],
  ['Sobreposições', [
    ['/pt/ui/modal', 'Modal', 'Um diálogo sobre a API de popover — sem script em lado nenhum.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Abrir modal')`],
    ['/pt/ui/drawer', 'Painel lateral', 'Um painel a partir da berma, com a mesma mecânica de popover.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Abrir painel')`],
    ['/pt/ui/menu', 'Menu', 'Um menu pendente sobre details: abrir e fechar vêm de borla.',
      `chip({ color: 'neutral' }, 'Ações ▾')`],
    ['/pt/ui/accordion', 'Acordeão', 'Secções recolhíveis, incluindo o modo exclusivo.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Uma pergunta' }] }))`],
    ['/pt/ui/collapsible', 'Recolhível', 'Um único «ver mais», sem a moldura do acordeão.',
      `collapsible({ trigger: 'Ver mais' }, 'Escondido até ser pedido.')`],
  ]],
  ['Secções', [
    ['/pt/ui/hero', 'Hero', 'O topo de uma página de entrada: título, frase, ações.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Um título'), text({ variant: 'caption', tone: 'muted' }, 'E uma frase.'))`],
    ['/pt/ui/footer', 'Rodapé', 'Colunas de ligações, e uma linha por baixo.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Documentação'), text({ variant: 'caption', tone: 'muted' }, 'Guia · Componentes'))`],
    ['/pt/ui/stat', 'Estatística', 'Um número que vale a pena olhar, e o que significa.',
      `stat({ label: 'Páginas', value: '204', change: '+8', color: 'success' })`],
    ['/pt/ui/steps', 'Passos', 'Um percurso numerado, com o que está feito marcado como feito.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Instalar', 'Construir'] }))`],
    ['/pt/ui/timeline', 'Cronologia', 'Entradas por ordem, ao longo de uma linha.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Secções', color: 'primary' }] }))`],
    ['/pt/ui/mockup', 'Mockup', 'Uma captura num navegador, janela, telemóvel ou terminal.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Estilos', [
    ['/pt/ui/theming', 'Temas', 'Todas as cores, raios e tipos de letra, a partir de uma chamada.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Um cartão da galeria. A pré-visualização é inerte, o nome é uma ligação esticada. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Um div, não uma âncora: estas pré-visualizações têm botões e campos
     * a sério, e conteúdo interativo não pode ficar aninhado dentro de uma
     * ligação. Em vez disso é a âncora do nome que se estica por todo o
     * cartão, e o `inert` tira os controlos da demonstração da ordem de
     * tabulação e da árvore de acessibilidade.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — componentes para o sitelo',
    description:
      'Uma biblioteca de componentes para o sitelo: botões, cartões, formulários, tabelas e modais, como funções que devolvem HTML.',
    activeHref: '/pt/ui',
    children: [
      p(
        'O sitelo-ui é uma biblioteca de componentes para o sitelo. Cada componente é uma função que devolve uma cadeia de HTML, por isso encaixa diretamente na página que já estás a escrever — sem compilador, sem runtime, sem hidratação.',
      ),
      p(
        'Todos os exemplos desta secção são desenhados pela mesma construção que desenha a página à volta deles. O que vês é o que o código por baixo produziu, e segue os temas claro e escuro deste site porque o sitelo-ui lê o mesmo atributo ',
        code('data-theme'),
        ' que a documentação.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Configuração'),
      p(
        'Duas linhas: importa os componentes e põe ',
        code('styles()'),
        ' no head. A ',
        a({ href: '/pt/docs/ui' }, 'página de Componentes na documentação'),
        ' cobre a instalação, os temas, a convenção de chamada e o runtime opcional do cliente, e lista todas as exportações numa só tabela.',
      ),
      p(
        'O diretório ',
        code('examples/ui'),
        ' do repositório desenha o conjunto todo numa única página.',
      ),
    ],
  })
