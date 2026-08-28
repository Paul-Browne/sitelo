import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/ru.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('ru')

export default () =>
  docsLayout({
    title: 'Загрузка данных',
    description:
      'data() во время сборки и fetchWithCache для статических сайтов на данных API.',
    activeHref: '/ru/docs/data',
    children: [
      p(
        'Экспортируйте функцию ',
        code('data()'),
        ', и её результат появится как ',
        code('ctx.data'),
        ' в вашей функции рендеринга. Она выполняется во время сборки и на каждый запрос в сервере разработки.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Собираете много страниц с одного API? Импортируйте ',
        code('fetchWithCache'),
        ' из sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Параметры'),
      ul(
        { class: 'docs-list' },
        li(
          code('maxAge'),
          ' — время жизни кэша в секундах (по умолчанию ',
          code('3600'),
          ')',
        ),
        li(
          code('cacheKey'),
          ' — свой ключ (по умолчанию: хэш URL + метода + заголовков + тела)',
        ),
        li(code('forceRefresh'), ' — обойти кэш'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Режимы кэша'),
      ul(
        { class: 'docs-list' },
        li(
          code('auto'),
          ' (по умолчанию) — память при разработке, файловая система в продакшн-сборках',
        ),
        li(
          code('memory'),
          ' — в процессе, очищается при его завершении',
        ),
        li(code('fs'), ' — сохраняется в ', code('node_modules/.cache/')),
        li(code('none'), ' — всегда запрашивает заново'),
      ),
      p(
        'По умолчанию кэшируются только ',
        code('GET'),
        '-запросы (передайте ',
        code('cacheKey'),
        ', чтобы кэшировать другие методы). Ответы с ошибками не кэшируются никогда.',
      ),
    ],
  })
