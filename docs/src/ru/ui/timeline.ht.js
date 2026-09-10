import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'

export default () =>
  uiLayout({
    title: 'Таймлайн',
    description:
      'Записи по порядку вдоль линии — журнал изменений, история релизов, страница «о проекте».',
    activeHref: '/ru/ui/timeline',
    children: [
      p(
        'Таймлайн — это упорядоченный список с линией сбоку. Соберите его из ',
        code('items'),
        ' или из потомков ',
        code('timelineItem()'),
        ', когда записи слишком разнородны, чтобы приходить из массива.',
      ),

      h2('Простой таймлайн'),
      demo(`timeline({
  items: [
    { time: 'Март 2026', title: 'Библиотека компонентов', description: 'sitelo-ui выходит с девяноста компонентами.' },
    { time: 'Январь 2026', title: 'Серверные острова', description: 'Статические страницы с областями, которые рендерятся в момент запроса.' },
    { time: 'Октябрь 2025', title: 'Первый релиз', description: 'Файловая маршрутизация и команда сборки.' },
  ],
})`, { align: 'stretch' }),

      h2('Цветные маркеры'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Развёртывание удалось', description: 'Опубликовано 204 страницы.', color: 'success' },
    { time: '12:03', title: 'Lighthouse пройден', description: 'Все пороги достигнуты.', color: 'success' },
    { time: '12:01', title: 'Предупреждение проверки ссылок', description: 'Одна внешняя ссылка не ответила вовремя.', color: 'warning' },
    { time: '12:00', title: 'Сборка началась', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('С иконками'),
      demo(`timeline(
  timelineItem({
    time: 'Только что',
    title: 'Опубликовано',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: '2 минуты назад',
    title: 'Собирается',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Насыщенные записи'),
      p('Потомки записи размещаются под её описанием.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Секции страницы', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Поддержка', description: 'Подняты зависимости и починен проверяльщик ссылок.' }),
)`, { align: 'stretch' }),

      h2('Из данных'),
      p(
        'Обычная форма для статического сайта: файл журнала изменений, загруженный через ',
        code('data()'),
        ' и напрямую разложенный по записям.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Секции страницы' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Поддержка' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Серверные острова' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('Таймлайн или шаги?'),
      p(
        'Таймлайн фиксирует то, что произошло, — от нового к старому или наоборот — и текущей позиции у него нет. ',
        code('steps()'),
        ' показывает продвижение по процессу: один шаг в работе, остальные впереди или позади.',
      ),

      h2('Пропсы'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Объекты с пропсами timelineItem из таблицы ниже.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Когда это случилось — дата, версия, время.'],
        ['title', 'Child', '', 'Что случилось.'],
        ['description', 'Child', '', 'Подробность под этим.'],
        ['icon', 'Child', '', 'Разметка внутри маркера.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Цвет маркера.'],
      ]),
      p('Потомки записи рисуются под её описанием.'),
    ],
  })
