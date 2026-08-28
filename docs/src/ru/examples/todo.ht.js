import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/ru.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('ru')

export default () =>
  examplesLayout({
    title: 'Список задач',
    description:
      'Статический HTML со встроенными динамическими импортами — обработчики загружают /js/todo.js по требованию.',
    activeHref: '/ru/examples/todo',
    children: [
      p(
        'Классический интерактивный интерфейс без фронтенд-фреймворка. sitelo собирает оболочку страницы; атрибуты событий вызывают ',
        code("import('/js/todo.js').then(…)"),
        ', так что модуль загружается только когда нужен. Полный исходник в ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('Что вы получаете'),
      ul(
        { class: 'docs-list' },
        li(
          'Статический HTML с обработчиками ',
          code('onsubmit'),
          ' / ',
          code('onload'),
          ' (и на элементах списка)',
        ),
        li(
          code('src/js/todo.js'),
          ' — экспортирует ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ' и ',
          code('handleRemove'),
        ),
        li(
          'sitelo находит буквальные ',
          code("import('/…')"),
          ' в HTML и собирает файл в ',
          code('dist/'),
          ' (см. ',
          a({ href: '/ru/docs/assets' }, 'Ресурсы'),
          ')',
        ),
      ),
      h2('Структура проекта'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Встроенные импорты в странице'),
      p(
        'Никакого ',
        code('<script type="module" src>'),
        '. Обработчики — это HTML-атрибуты, которые динамически импортируют модуль и вызывают экспорт, передавая ',
        code('this'),
        ' (элемент). Так модули страниц остаются свободны от браузерных API (см. ',
        a({ href: '/ru/docs/pages#ограничения-jsx' }, 'ограничения JSX'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Экспортируемые обработчики'),
      p(
        'Модуль — обычный ES-файл в ',
        code('src/js/'),
        '. Элементы списка, созданные во время выполнения, используют тот же приём ',
        code("import('/js/todo.js').then(…)"),
        ' для ',
        code('onchange'),
        ' и ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Запуск'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Либо ',
        code('npm run build'),
        ' и разместите ',
        code('dist/'),
        ' где угодно, где отдают статические файлы.',
      ),
      p(
        a({ href: '/ru/docs/assets' }, 'Ресурсы и стили'),
        ' · ',
        a({ href: '/ru/docs/pages#ограничения-jsx' }, 'Ограничения JSX'),
        ' · ',
        a({ href: '/ru/examples/basic' }, 'Базовый сайт'),
      ),
    ],
  })
