import { h2, p } from 'javascript-to-html'
import { code, docsLayout, pageCodeTabs } from '../../lib/ru.js'
import {
  typedHt,
  typedJsx,
  typedTemplate,
} from '../../lib/snippets/typescript.js'

export default () =>
  docsLayout({
    title: 'TypeScript',
    description:
      'Типизированные страницы и выводимые параметры маршрутов через помощники sitelo/page.',
    activeHref: '/ru/docs/typescript',
    children: [
      p(
        'Страницы могут быть ',
        code('.ht.ts'),
        ' / ',
        code('.ht.tsx'),
        ' безо всякой настройки.',
      ),
      h2('definePageModule'),
      p(
        'Помощники из ',
        code('sitelo/page'),
        ' дают полный вывод типов. Во время сборки импорт подменяется сгенерированным для каждого маршрута модулем, чьи ',
        code('PageParams'),
        ' берутся из имени файла: ',
        code('[slug]'),
        ' → ',
        code('{ slug: string }'),
        ', ',
        code('[...path]'),
        ' → ',
        code('{ path: string[] }'),
        ', ',
        code('[...path]?'),
        ' → ',
        code('{ path?: string[] }'),
        '.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.ts',
        template: typedTemplate,
        ht: typedHt,
        jsx: typedJsx,
      }),
      p(
        'Также экспортируются: ',
        code('definePage'),
        ', ',
        code('defineData'),
        ', ',
        code('defineStaticParams'),
        '.',
      ),
      h2('Сгенерированные типы'),
      p(
        'Объявления записываются в ',
        code('.sitelo/types/'),
        ' при каждом запуске сервера разработки или сборки. Добавьте эту папку в ',
        code('.gitignore'),
        '.',
      ),
    ],
  })
