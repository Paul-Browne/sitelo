import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Список',
    description:
      'Строки содержимого с необязательным элементом по краям — форма, из которой сделано большинство экранов настроек и лент.',
    activeHref: '/ru/ui/list',
    extraHead: uiHead(),
    children: [
      p(
        'Список — это обведённая поверхность из строк. У каждой строки есть заголовок, необязательное описание и слоты в начале и в конце — под аватар, иконку или элемент управления.',
      ),

      h2('Простой список'),
      demo(`list(
  listItem({ title: 'Маршрутизация', description: 'src/about.ht.js превращается в /about' }),
  listItem({ title: 'Загрузка данных', description: 'data() выполняется один раз, на сборке' }),
  listItem({ title: 'Ресурсы', description: 'В бандл попадает только то, на что ссылается ваш HTML' }),
)`, { align: 'stretch' }),

      h2('Слоты в начале и в конце'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Отправила 3 коммита в main',
    end: chip({ size: 'sm', color: 'neutral' }, '2 ч назад'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Открыла пул-реквест',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'открыт'),
  }),
)`, { align: 'stretch' }),

      h2('Строки-ссылки'),
      p(
        'Строка с ',
        code('href'),
        ' кладёт якорь внутрь ',
        code('<li>'),
        ', а не вокруг него, поэтому список остаётся корректным списком. Не ставьте в такую строку ещё и кнопку: интерактивное содержимое не может быть вложено в ссылку.',
      ),
      demo(`list(
  listItem({ title: 'Начало работы', description: 'Установка и первая страница', href: '/ru/docs' }),
  listItem({ title: 'Маршрутизация', description: 'Файловая, с динамическими сегментами', href: '/ru/docs/routing' }),
  listItem({ title: 'Развёртывание', description: 'Netlify, Vercel, Pages, Amplify', href: '/ru/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Строки с элементами управления'),
      p(
        'Когда в строке живёт тумблер или кнопка, оставьте саму строку без ссылки и пусть интерактивной частью будет элемент управления.',
      ),
      demo(`list(
  listItem({
    title: 'Поиск Pagefind',
    description: 'Индексирует каждую страницу в конце сборки',
    end: toggle({ 'aria-label': 'Поиск Pagefind', checked: true }),
  }),
  listItem({
    title: 'Оптимизация изображений',
    description: 'Меняет размер и формат картинок. Нужен sharp.',
    end: toggle({ 'aria-label': 'Оптимизация изображений', checked: true }),
  }),
  listItem({
    title: 'Серверные острова',
    description: 'Рендерит помеченные области в момент запроса',
    end: toggle({ 'aria-label': 'Серверные острова' }),
  }),
)`, { align: 'stretch' }),

      h2('Без оформления'),
      p(
        code('plain'),
        ' убирает рамку и фон — для списка, который лежит в карточке или боковой панели с собственной поверхностью.',
      ),
      demo(`card(
  cardHeader({ title: 'Последние сборки' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · 4 минуты назад', end: chip({ size: 'sm', color: 'success', dot: true }, 'прошла') }),
      listItem({ title: 'dcfaaae', description: 'main · 2 часа назад', end: chip({ size: 'sm', color: 'success', dot: true }, 'прошла') }),
      listItem({ title: 'a46a461', description: 'main · вчера', end: chip({ size: 'sm', color: 'danger', dot: true }, 'упала') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Произвольные строки'),
      p(
        'Без ',
        code('title'),
        ' и ',
        code('description'),
        ' строка рисует ровно тех потомков, которых ей дали, — для раскладки, которую двухстрочная форма не покрывает.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Своя строка'),
        text({ variant: 'caption', tone: 'muted' }, 'Внутри что угодно'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Действие'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Из данных'),
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
        description: locale.pages + ' страниц',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Пропсы'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Убрать рамку и фон.'],
        ['as', 'string', "'ul'", 'Какой элемент рендерить, например ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Основная строка ряда.'],
        ['description', 'Child', '', 'Приглушённая вторая строка.'],
        ['start', 'Child', '', 'Слот в начале — аватар или иконка.'],
        ['end', 'Child', '', 'Слот в конце — чип, элемент управления, отметка времени.'],
        ['href', 'string', '', 'Делает строку ссылкой, помещая якорь внутрь li.'],
        ['interactive', 'boolean', 'false', 'Подсветка при наведении без превращения в ссылку.'],
      ]),
    ],
  })
