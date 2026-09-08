import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Lista',
    description:
      'Linhas de conteúdo com algo opcional de cada lado — a forma com que a maioria dos ecrãs de definições e feeds é construída.',
    activeHref: '/pt/ui/list',
    extraHead: uiHead(),
    children: [
      p(
        'Uma lista é uma superfície com contorno feita de linhas. Cada linha tem um título, uma descrição opcional, e espaços no início e no fim para um avatar, um ícone ou um controlo.',
      ),

      h2('Lista básica'),
      demo(`list(
  listItem({ title: 'Rotas', description: 'src/about.ht.js passa a /about' }),
  listItem({ title: 'Carregamento de dados', description: 'data() corre uma vez, na construção' }),
  listItem({ title: 'Recursos', description: 'Só o que o teu HTML referencia é empacotado' }),
)`, { align: 'stretch' }),

      h2('Espaços inicial e final'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Enviou 3 commits para main',
    end: chip({ size: 'sm', color: 'neutral' }, 'há 2 h'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Abriu um pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'aberto'),
  }),
)`, { align: 'stretch' }),

      h2('Linhas que ligam'),
      p(
        'Uma linha com ',
        code('href'),
        ' põe a âncora dentro do ',
        code('<li>'),
        ' em vez de à volta dele, por isso a lista continua a ser uma lista válida. Não ponhas também um botão na linha — conteúdo interativo não pode ficar aninhado dentro de uma ligação.',
      ),
      demo(`list(
  listItem({ title: 'Primeiros passos', description: 'Instalar e fazer a primeira página', href: '/pt/docs' }),
  listItem({ title: 'Rotas', description: 'Baseadas em ficheiros, com segmentos dinâmicos', href: '/pt/docs/routing' }),
  listItem({ title: 'Publicação', description: 'Netlify, Vercel, Pages, Amplify', href: '/pt/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Linhas com controlos'),
      p(
        'Quando uma linha tem um interruptor ou um botão, deixa a linha sem ligação e deixa o controlo ser a parte interativa.',
      ),
      demo(`list(
  listItem({
    title: 'Pesquisa Pagefind',
    description: 'Indexa todas as páginas no fim da construção',
    end: toggle({ 'aria-label': 'Pesquisa Pagefind', checked: true }),
  }),
  listItem({
    title: 'Otimização de imagens',
    description: 'Redimensiona e converte imagens. Precisa do sharp.',
    end: toggle({ 'aria-label': 'Otimização de imagens', checked: true }),
  }),
  listItem({
    title: 'Ilhas de servidor',
    description: 'Renderiza as zonas marcadas no momento do pedido',
    end: toggle({ 'aria-label': 'Ilhas de servidor' }),
  }),
)`, { align: 'stretch' }),

      h2('Simples'),
      p(
        code('plain'),
        ' deixa cair o contorno e o fundo, para uma lista que assenta num cartão ou numa barra lateral que já tem superfície própria.',
      ),
      demo(`card(
  cardHeader({ title: 'Construções recentes' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · há 4 minutos', end: chip({ size: 'sm', color: 'success', dot: true }, 'passou') }),
      listItem({ title: 'dcfaaae', description: 'main · há 2 horas', end: chip({ size: 'sm', color: 'success', dot: true }, 'passou') }),
      listItem({ title: 'a46a461', description: 'main · ontem', end: chip({ size: 'sm', color: 'danger', dot: true }, 'falhou') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Linhas livres'),
      p(
        'Sem ',
        code('title'),
        ' nem ',
        code('description'),
        ', uma linha desenha os filhos que lhe deres — para uma disposição que a forma de duas linhas não cobre.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Linha à medida'),
        text({ variant: 'caption', tone: 'muted' }, 'Lá dentro o que quiseres'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Ação'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('A partir de dados'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' páginas',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Deixa cair o contorno e o fundo.'],
        ['as', 'string', "'ul'", 'Elemento a renderizar, por exemplo ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'A linha principal da entrada.'],
        ['description', 'Child', '', 'Uma segunda linha esbatida.'],
        ['start', 'Child', '', 'Espaço inicial — um avatar ou ícone.'],
        ['end', 'Child', '', 'Espaço final — um chip, um controlo, uma marca temporal.'],
        ['href', 'string', '', 'Faz da linha uma ligação, com a âncora dentro do li.'],
        ['interactive', 'boolean', 'false', 'Destaque ao passar o rato sem a tornar uma ligação.'],
      ]),
    ],
  })
