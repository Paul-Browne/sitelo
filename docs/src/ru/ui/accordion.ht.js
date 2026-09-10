import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Аккордеон',
    description:
      'Сворачиваемые секции на собственном <details> браузера — включая его эксклюзивный режим.',
    activeHref: '/ru/ui/accordion',
    children: [
      p(
        'Каждая секция — это ',
        code('<details>'),
        '. Открытие, закрытие, работа с клавиатуры и поиск по странице достаются от браузера, а сам аккордеон работает и с выключенным JavaScript — что важно для FAQ, самого частого его применения.',
      ),

      h2('Простой аккордеон'),
      demo(`accordion({
  items: [
    { title: 'Что такое sitelo?', content: 'Генератор статических сайтов на Vite. Страницы — это функции, возвращающие HTML.' },
    { title: 'Есть ли рантайм?', content: 'Нет. В браузер ничего не попадает, пока вы сами не подключите скрипт.' },
    { title: 'Можно ли использовать TypeScript?', content: 'Да — .ht.ts и .ht.tsx такие же расширения страниц, как и остальные.' },
  ],
})`, { align: 'stretch' }),

      h2('Открыт по умолчанию'),
      demo(`accordion({
  items: [
    { title: 'Открыт сразу', content: 'У этой секции open: true.', open: true },
    { title: 'Закрыт', content: 'А у этой нет.' },
  ],
})`, { align: 'stretch' }),

      h2('По одному'),
      p(
        'Общий ',
        code('name'),
        ' делает секции взаимоисключающими: открытие одной закрывает остальные. Это собственное поведение браузера для ',
        code('<details name>'),
        ', а не скрипт.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Первая', content: 'Откройте другую — и эта закроется.', open: true },
    { title: 'Вторая', content: 'И эта тоже.' },
    { title: 'Третья', content: 'Открыта всегда только одна.' },
  ],
})`, { align: 'stretch' }),

      h2('Расширенное содержимое'),
      p(
        'Собирайте секции через ',
        code('accordionItem()'),
        ', когда содержимого больше, чем один абзац.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Установка', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Добавьте пакет и его спутника для разметки:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Настройка' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Необязательно. Опции Vite живут под ключом vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Развёртывание' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Опубликуйте каталог сборки на любом статическом хостинге.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('FAQ'),
      p(
        'Форма, ради которой этот компонент и существует: содержимое, которое уже есть в HTML, свёрнуто для беглого просмотра и находится поисковиком, потому что оно никогда не покидало страницу.',
      ),
      demo(`return (() => {
  const faq = [
    ['Правда ли, что настройка не нужна?', 'Проект с одним файлом в src/ и без конфига собирается. Всё остальное — по желанию.'],
    ['Как работают динамические маршруты?', 'Скобки в именах файлов. generateStaticParams перечисляет, что собирать.'],
    ['А поиск?', 'Поставьте pagefind: true, и сборка проиндексирует каждую страницу.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Пропсы'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Строки или объекты { title, content, open }.'],
        ['name', 'string', '', 'Общий name делает секции взаимоисключающими.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Строка-заголовок.'],
        ['open', 'boolean', 'false', 'Открыта ли секция изначально.'],
        ['name', 'string', '', 'То же, что и на родителе, когда элементы собираются вручную.'],
      ]),
    ],
  })
