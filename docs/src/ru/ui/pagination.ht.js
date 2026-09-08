import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Пагинация',
    description:
      'Пронумерованные страницы окном вокруг текущей — настоящими ссылками.',
    activeHref: '/ru/ui/pagination',
    extraHead: uiHead(),
    children: [
      p(
        code('href'),
        ' — это функция из номера страницы в URL, поэтому пагинация одинаково работает и для ',
        code('/blog/2'),
        ', и для ',
        code('/blog?page=2'),
        '. Так каждая страница становится настоящей ссылкой: её обходят поисковики, её можно открыть в новой вкладке, и она работает без JavaScript — как раз то, что нужно статическому сайту.',
      ),

      h2('Простая пагинация'),
      demo(`pagination({ page: 1, count: 5, href: (page) => '#page-' + page })`),

      h2('Окно'),
      p(
        'Первая и последняя страницы показываются всегда, плюс окно вокруг текущей, а там, где последовательность прыгает, появляется многоточие.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 12, href: (page) => '#a-' + page }),
  pagination({ page: 6, count: 12, href: (page) => '#b-' + page }),
  pagination({ page: 12, count: 12, href: (page) => '#c-' + page }),
)`, { align: 'start' }),

      h2('Соседи'),
      p(
        code('siblings'),
        ' — сколько страниц стоит по каждую сторону от текущей.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 6, count: 12, siblings: 0, href: (page) => '#d-' + page }),
  pagination({ page: 6, count: 12, siblings: 1, href: (page) => '#e-' + page }),
  pagination({ page: 6, count: 12, siblings: 3, href: (page) => '#f-' + page }),
)`, { align: 'start' }),

      h2('Края'),
      p(
        'На первой странице отключено «назад», на последней — «вперёд», так что элемент никогда не предлагает несуществующую страницу.',
      ),
      demo(`stack({ gap: 'md' },
  pagination({ page: 1, count: 3, href: (page) => '#g-' + page }),
  pagination({ page: 3, count: 3, href: (page) => '#h-' + page }),
  pagination({ page: 1, count: 1, href: (page) => '#i-' + page }),
)`, { align: 'start' }),

      h2('Цвета и подписи'),
      demo(`stack({ gap: 'md' },
  pagination({ page: 3, count: 6, color: 'neutral', href: (page) => '#j-' + page }),
  pagination({
    page: 3,
    count: 6,
    color: 'success',
    previousLabel: 'Новее',
    nextLabel: 'Старее',
    href: (page) => '#k-' + page,
  }),
)`, { align: 'start' }),

      h2('Без href'),
      p(
        'Без ',
        code('href'),
        ' номера рисуются кнопками с атрибутом ',
        code('data-su-page'),
        ' — для страницы, которая фильтрует на месте собственным скриптом. Когда есть возможность, выбирайте ссылки: они переживают выключенный JavaScript.',
      ),
      demo(`pagination({ page: 2, count: 4 })`),

      h2('В блоге'),
      p(
        'Обычная форма для статического сайта: ',
        code('generateStaticParams'),
        ' порождает по странице на срез, а ',
        code('href'),
        ' на них указывает.',
      ),
      demo(`return (() => {
  const posts = 47
  const perPage = 10
  const current = 3

  return stack({ gap: 'md', align: 'center' },
    text({ variant: 'small', tone: 'muted' },
      'Показаны ' + ((current - 1) * perPage + 1) + '–' + Math.min(current * perPage, posts) + ' из ' + posts,
    ),
    pagination({
      page: current,
      count: Math.ceil(posts / perPage),
      href: (page) => page === 1 ? '#blog' : '#blog-' + page,
    }),
  )
})()`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['page', 'number', '1', 'Текущая страница. Зажимается в допустимый диапазон.'],
        ['count', 'number', '1', 'Сколько всего страниц.'],
        ['href', '(page: number) => string', '', 'Из номера страницы в URL. Без него страницы рисуются кнопками.'],
        ['siblings', 'number', '1', 'Сколько страниц показывать по обе стороны от текущей.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Цвет текущей страницы.'],
        ['label', 'string', "'Pagination'", 'Доступное имя ориентира nav.'],
        ['previousLabel', 'Child', "'‹'", 'Содержимое кнопки «назад».'],
        ['nextLabel', 'Child', "'›'", 'Содержимое кнопки «вперёд».'],
      ]),
    ],
  })
