import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Чип',
    description:
      'Компактная метка — тег, статус, фильтр, счётчик.',
    activeHref: '/ru/ui/chip',
    extraHead: uiHead(),
    children: [
      p(
        'Чипы — это маленькие кусочки метаданных: теги поста, статус сборки, категории страницы. По умолчанию они строчные, поэтому ряд из них просит ',
        code('stack'),
        ' с ',
        code('wrap'),
        '.',
      ),

      h2('Простой чип'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('статика'),
  chip('vite'),
  chip('без-рантайма'),
)`),

      h2('Цвета'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Варианты'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Размеры'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'маленький'),
  chip({ size: 'md' }, 'средний'),
  chip({ size: 'lg' }, 'большой'),
)`),

      h2('Точка состояния'),
      p(
        'Точка спереди превращает чип в статус. Один только цвет смысла не несёт, поэтому слово оставьте.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Сборка прошла'),
  chip({ color: 'warning', dot: true }, 'В очереди'),
  chip({ color: 'danger', dot: true }, 'Провалилась'),
  chip({ color: 'neutral', dot: true }, 'Пропущена'),
)`),

      h2('Ссылки'),
      p(
        'Дайте чипу ',
        code('href'),
        ' — и он нарисует ссылку: обычная форма для списка тегов, где каждый тег это страница.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/ru/docs/routing', color: 'primary' }, 'маршруты'),
  chip({ href: '/ru/docs/data', color: 'primary' }, 'данные'),
  chip({ href: '/ru/docs/islands', color: 'primary' }, 'острова'),
)`),

      h2('Как кнопка'),
      p(
        code('as'),
        ' меняет элемент — для фильтра, который переключается, а не ведёт на другую страницу.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Все'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Руководства'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Примеры'),
)`),

      h2('В таблице'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Страница' },
    { header: 'Статус', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ок' : 'ошибка') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Пропсы'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Из какой палитры брать цвета.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Насколько весомо выглядит чип.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Отступы и размер текста.'],
        ['href', 'string', '', 'Рендерит ссылку.'],
        ['dot', 'boolean', 'false', 'Добавляет точку состояния перед подписью.'],
        ['as', 'string', "'span'", 'Какой элемент рендерить, когда href нет.'],
      ]),
    ],
  })
