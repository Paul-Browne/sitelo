import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/ru.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Таблица',
    description:
      'Строки и колонки из данных — в контейнере с прокруткой, чтобы широкая таблица не ломала страницу.',
    activeHref: '/ru/ui/table',
    extraHead: uiHead(),
    children: [
      p(
        'Передайте ',
        code('columns'),
        ' и ',
        code('rows'),
        ' — и таблица соберётся сама, вместе с шапкой. Она обёрнута в контейнер с горизонтальной прокруткой, поэтому таблица, у которой колонок больше, чем помещается на телефоне, прокручивается сама, а не растягивает страницу. Экспортируется и как ',
        code('table'),
        ', и как ',
        code('dataTable'),
        '.',
      ),

      h2('Простая таблица'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Страница' },
    { key: 'size', header: 'Размер' },
    { key: 'time', header: 'Время рендера' },
  ],
  rows: [
    { page: '/', size: '4,1 кБ', time: '12 мс' },
    { page: '/docs', size: '12,7 кБ', time: '31 мс' },
    { page: '/examples', size: '9,4 кБ', time: '24 мс' },
  ],
})`, { align: 'stretch' }),

      h2('Выравнивание'),
      p('Числа читаются лучше, когда выровнены по концу своей колонки.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Страница' },
    { key: 'bytes', header: 'Байты', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4 112', gzip: '1 204' },
    { page: '/docs', bytes: '12 704', gzip: '3 910' },
    { page: '/examples', bytes: '9 388', gzip: '2 744' },
  ],
})`, { align: 'stretch' }),

      h2('Свои ячейки'),
      p(
        'Колонка с функцией ',
        code('render'),
        ' получает всю строку и возвращает то, что должно оказаться в ячейке: чип, ссылку, отформатированное число.',
      ),
      demo(`table({
  columns: [
    { header: 'Страница', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Размер', align: 'end' },
    { header: 'Статус', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ок' : 'ошибка') },
  ],
  rows: [
    { page: '/docs/routing', href: '/ru/docs/routing', size: '18,2 кБ', ok: true },
    { page: '/docs/data', href: '/ru/docs/data', size: '21,7 кБ', ok: true },
    { page: '/docs/islands', href: '/ru/docs/islands', size: '24,1 кБ', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Стили'),
      p(
        code('striped'),
        ' подкрашивает строки через одну, ',
        code('hover'),
        ' подсвечивает строку под курсором, а ',
        code('dense'),
        ' поджимает отступы для таблицы со множеством строк.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'с полосами',
    columns: [{ key: 'name', header: 'Имя' }, { key: 'value', header: 'Значение', align: 'end' }],
    rows: [{ name: 'страницы', value: '169' }, { name: 'ресурсы', value: '208' }, { name: 'всего', value: '9,5 МБ' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'с подсветкой и плотная',
    columns: [{ key: 'name', header: 'Имя' }, { key: 'value', header: 'Значение', align: 'end' }],
    rows: [{ name: 'страницы', value: '169' }, { name: 'ресурсы', value: '208' }, { name: 'всего', value: '9,5 МБ' }],
  }),
)`, { align: 'stretch' }),

      h2('Подпись таблицы'),
      p(
        'Подпись называет таблицу для тех, кто попал на неё без окружающего текста, — она стоит того всякий раз, когда таблица стоит не прямо под заголовком, который и так объясняет, что это.',
      ),
      demo(`table({
  caption: 'Результаты сборок, свежие сверху',
  columns: [
    { key: 'commit', header: 'Коммит' },
    { key: 'when', header: 'Когда' },
    { key: 'pages', header: 'Страниц', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: '4 минуты назад', pages: '169' },
    { commit: 'dcfaaae', when: '2 часа назад', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('Из данных'),
      p(
        'Строки — обычный массив, поэтому обычно это ровно то, что ',
        code('data()'),
        ' уже загрузил, без всякого переходника.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Привет, мир', date: '2026-01-14', reads: 1204 },
    { title: 'Статика прежде всего', date: '2026-02-02', reads: 890 },
    { title: 'Никакого рантайма', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Пост' },
      { key: 'date', header: 'Опубликован' },
      { header: 'Прочтений', align: 'end', render: (post) => post.reads.toLocaleString('ru') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Разметка своими руками'),
      p(
        'Опустите ',
        code('columns'),
        ', и таблица нарисует вместо этого своих потомков: таблицу с итоговой строкой или сгруппированными заголовками можно собрать вручную и всё равно получить оформление и контейнер с прокруткой.',
      ),

      h2('Пропсы'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } на колонку. Опустите, чтобы писать строки вручную.'],
        ['rows', 'object[]', '[]', 'По объекту на строку.'],
        ['caption', 'Child', '', 'Подпись над таблицей.'],
        ['striped', 'boolean', 'false', 'Подкрашивать строки через одну.'],
        ['hover', 'boolean', 'false', 'Подсвечивать строку под курсором.'],
        ['dense', 'boolean', 'false', 'Более плотные отступы в ячейках.'],
      ]),
    ],
  })
