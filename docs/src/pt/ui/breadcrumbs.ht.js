import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Migalhas',
    description:
      'O rasto de antepassados que termina na página onde estás.',
    activeHref: '/pt/ui/breadcrumbs',
    extraHead: uiHead(),
    children: [
      p(
        'As migalhas dizem onde uma página assenta. O último item é a página atual: é desenhado como texto simples e marcado com ',
        code('aria-current="page"'),
        ', porque uma ligação para a página onde já estás é ruído.',
      ),

      h2('Migalhas básicas'),
      demo(`breadcrumbs({
  items: [
    { label: 'Início', href: '/' },
    { label: 'Documentação', href: '/docs' },
    { label: 'Rotas' },
  ],
})`, { align: 'stretch' }),

      h2('Separador'),
      p('Qualquer cadeia ou marcação. Em qualquer dos casos os separadores ficam escondidos dos leitores de ecrã.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Início', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Migalhas' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Início', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Migalhas' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Início', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Migalhas' }],
  }),
)`, { align: 'stretch' }),

      h2('Cadeias simples'),
      p('Um item sem href é apenas texto, apareça onde aparecer — não só no fim.'),
      demo(`breadcrumbs({
  items: ['Início', 'Arquivo', '2026', 'Março'],
})`, { align: 'stretch' }),

      h2('A partir de um caminho'),
      p(
        'Num site estático o rasto costuma ser derivado da rota, e não escrito à mão.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Início', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Dar nome ao nav'),
      p(
        'O conjunto todo é um ',
        code('<nav>'),
        ' com nome acessível, para um leitor de ecrã poder saltar até lá. Muda o nome com ',
        code('label'),
        ' quando uma página tiver mais do que um marco de navegação.',
      ),
      demo(`breadcrumbs({
  label: 'Migalhas da documentação',
  items: [{ label: 'Documentação', href: '/docs' }, { label: 'Componentes' }],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Cadeias, ou objetos { label, href }. O último é a página atual.'],
        ['separator', 'Child', "'/'", 'Desenhado entre os itens, escondido dos leitores de ecrã.'],
        ['label', 'string', "'Breadcrumb'", 'Nome acessível do marco nav.'],
      ]),
    ],
  })
