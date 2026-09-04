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
      h2('Локальные JSON-файлы'),
      p(
        'Нет API? Держите контент в репозитории в виде JSON и читайте его через ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Относительные пути разрешаются от корня проекта, поэтому ',
        code('data/posts'),
        ' означает одно и то же, откуда бы вы ни запускали CLI. ',
        code('readJson'),
        ' возвращает один разобранный файл; ',
        code('readJsonCollection'),
        ' возвращает массив записей, у каждой есть ',
        code('slug'),
        ' — из каталога ',
        code('.json'),
        '-файлов (по файлу на запись, slug из имени файла) или из одного файла с массивом записей либо объектом, ключи которого — слаги.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Параметры коллекции'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — имя поля или функция; по умолчанию имя файла, ключ объекта или собственный ',
          code('slug'),
          ' / ',
          code('id'),
          ' записи',
        ),
        li(
          code('sort'),
          ' — имя поля (',
          code("'date'"),
          ' по возрастанию, ',
          code("'-date'"),
          ' по убыванию) или функция сравнения',
        ),
        li(
          code('recursive'),
          ' — включать ',
          code('.json'),
          '-файлы из подкаталогов, slug берётся из пути',
        ),
        li(
          code('root'),
          ' — каталог, от которого разрешаются относительные пути',
        ),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Чтение запоминается по файлу, поэтому сборка из 500 страниц разбирает каждый файл один раз. Dev-сервер вместо этого сверяет mtime и перезагружает страницу, когда меняется прочитанный JSON-файл. Повторяющиеся слаги, отсутствующие файлы и некорректный JSON останавливают сборку — с указанием пути.',
      ),
    ],
  })
