import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Хлебные крошки',
    description:
      'Цепочка предков, заканчивающаяся страницей, на которой вы находитесь.',
    activeHref: '/ru/ui/breadcrumbs',
    extraHead: uiHead(),
    children: [
      p(
        'Хлебные крошки говорят, где расположена страница. Последний элемент — текущая страница: он рисуется обычным текстом и помечается ',
        code('aria-current="page"'),
        ', потому что ссылка на страницу, где вы уже находитесь, — это шум.',
      ),

      h2('Простые крошки'),
      demo(`breadcrumbs({
  items: [
    { label: 'Главная', href: '/' },
    { label: 'Документация', href: '/docs' },
    { label: 'Маршрутизация' },
  ],
})`, { align: 'stretch' }),

      h2('Разделитель'),
      p('Любая строка или разметка. В любом случае разделители скрыты от скринридеров.'),
      demo(`stack({ gap: 'md' },
  breadcrumbs({
    separator: '/',
    items: [{ label: 'Главная', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Хлебные крошки' }],
  }),
  breadcrumbs({
    separator: '›',
    items: [{ label: 'Главная', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Хлебные крошки' }],
  }),
  breadcrumbs({
    separator: '·',
    items: [{ label: 'Главная', href: '/' }, { label: 'UI', href: '/ui' }, { label: 'Хлебные крошки' }],
  }),
)`, { align: 'stretch' }),

      h2('Обычные строки'),
      p('Элемент без href — просто текст, где бы он ни стоял, а не только в конце.'),
      demo(`breadcrumbs({
  items: ['Главная', 'Архив', '2026', 'Март'],
})`, { align: 'stretch' }),

      h2('Из пути'),
      p(
        'На статическом сайте цепочку обычно выводят из маршрута, а не пишут руками.',
      ),
      demo(`return (() => {
  const path = '/docs/guides/routing'
  const segments = path.split('/').filter(Boolean)

  return breadcrumbs({
    items: [
      { label: 'Главная', href: '/' },
      ...segments.map((segment, index) => ({
        label: segment.replace(/-/g, ' '),
        href: index === segments.length - 1 ? undefined : '/' + segments.slice(0, index + 1).join('/'),
      })),
    ],
  })
})()`, { align: 'stretch' }),

      h2('Подпись для nav'),
      p(
        'Всё это — ',
        code('<nav>'),
        ' с доступным именем, чтобы скринридер мог к нему перейти. Меняйте имя через ',
        code('label'),
        ', когда на странице больше одного навигационного ориентира.',
      ),
      demo(`breadcrumbs({
  label: 'Хлебные крошки документации',
  items: [{ label: 'Документация', href: '/docs' }, { label: 'Компоненты' }],
})`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['items', 'Array', '[]', 'Строки или объекты { label, href }. Последний — текущая страница.'],
        ['separator', 'Child', "'/'", 'Рисуется между элементами, скрыт от скринридеров.'],
        ['label', 'string', "'Breadcrumb'", 'Доступное имя ориентира nav.'],
      ]),
    ],
  })
