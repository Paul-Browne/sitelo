import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pt.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Paginação',
    description:
      'Páginas numeradas, com uma janela à volta da atual, como ligações a sério.',
    activeHref: '/pt/ui/pagination',
    extraHead: uiHead(),
    children: [
      p(
        code('href'),
        ' é uma função do número da página para o URL, por isso a paginação serve tanto para ',
        code('/blog/2'),
        ' como para ',
        code('/blog?page=2'),
        '. Isso faz de cada página uma ligação a sério — rastreável, abrível num separador novo, e a funcionar sem JavaScript, que é o que um site estático quer.',
      ),

      h2('Paginação básica'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Janela'),
      p(
        'A primeira e a última página aparecem sempre, mais uma janela à volta da atual, com reticências onde a sequência dá um salto.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Vizinhas'),
      p(
        code('siblings'),
        ' é quantas páginas ficam de cada lado da atual.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Extremos'),
      p(
        'O anterior fica desativado na primeira página e o seguinte na última, por isso o controlo nunca oferece uma página que não existe.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Cores e etiquetas'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Mais recentes',
    nextLabel: 'Mais antigos',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Sem hrefs'),
      p(
        'Sem ',
        code('href'),
        ', os números são desenhados como botões com ',
        code('data-su-page'),
        ' — para uma página que filtra no lugar com um script seu. Prefere ligações sempre que puderes: sobrevivem a ter o JavaScript desligado.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('Num blogue'),
      p(
        'A forma habitual num site estático: ',
        code('generateStaticParams'),
        ' produz uma página por fatia, e ',
        code('href'),
        ' aponta para elas.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'A mostrar ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' de ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['page', 'number', '1', 'A página atual. Ajustada ao intervalo válido.'],
        ['count', 'number', '1', 'Quantas páginas existem.'],
        ['href', '(page: number) => string', '', 'Número da página para URL. Sem ele, as páginas são botões.'],
        ['siblings', 'number', '1', 'Páginas mostradas de cada lado da atual.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Cor da página atual.'],
        ['label', 'string', "'Pagination'", 'Nome acessível do marco nav.'],
        ['previousLabel', 'Child', "'‹'", 'Conteúdo do controlo anterior.'],
        ['nextLabel', 'Child', "'›'", 'Conteúdo do controlo seguinte.'],
      ]),
    ],
  })
