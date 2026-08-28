import { div, h2, p, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/ru.js'
import {
  paramsHt,
  paramsJsx,
  paramsTemplate,
  structure,
} from '../../lib/snippets/routing.js'

function row(feature, file, url) {
  return tr(td(feature), td(file), td(url))
}

export default () =>
  docsLayout({
    title: 'Маршрутизация',
    description:
      'Файловая маршрутизация, динамические сегменты и generateStaticParams.',
    activeHref: '/ru/docs/routing',
    children: [
      p(
        'Маршруты берутся напрямую из файловой системы внутри ',
        code('src/'),
        '.',
      ),
      codeBlock('project', structure, 'bash'),
      h2('Таблица маршрутов'),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table' },
          thead(tr(th('Возможность'), th('Файл'), th('URL'))),
          tbody(
            row('Статический', code('index.ht.js'), code('/')),
            row('Вложенный', code('blog/index.ht.js'), code('/blog')),
            row('Динамический', code('blog/[slug].ht.js'), code('/blog/my-post')),
            row(
              'Несколько параметров',
              code('blog/[year]/[slug].ht.js'),
              code('/blog/2026/my-post'),
            ),
            row(
              'Перехватывающий',
              code('docs/[...path].ht.js'),
              code('/docs/api/auth'),
            ),
            row(
              'Необязательный перехватывающий',
              code('docs/[...path]?.ht.js'),
              code('/docs и глубже'),
            ),
            row('Группы маршрутов', code('(admin)/users.ht.js'), code('/users')),
          ),
        ),
      ),
      p(
        'Побеждает более конкретный маршрут: статический важнее динамического, динамический важнее перехватывающего. Два файла, дающие один и тот же URL, — ошибка сборки.',
      ),
      h2('generateStaticParams'),
      p(
        'Динамические маршруты объявляют, какие страницы создавать при сборке. В ',
        code('sitelo'),
        ' (dev) динамические маршруты по-прежнему рендерятся по запросу, без перечисления каждого параметра.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: paramsTemplate,
        ht: paramsHt,
        jsx: paramsJsx,
      }),
      p(
        'Значениями могут быть строки, числа или логические значения — они приводятся к строке и кодируются для URL. Перехватывающие параметры принимают массивы (',
        code("{ path: ['a', 'b'] }"),
        ') или строки с косой чертой (',
        code("{ path: 'a/b' }"),
        ').',
      ),
      p(
        'Динамическая страница, не создавшая ни одного маршрута, выводит предупреждение, чтобы не исчезнуть с сайта незаметно.',
      ),
    ],
  })
