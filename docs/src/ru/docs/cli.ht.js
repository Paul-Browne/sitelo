import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/ru.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('ru')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview и часто используемые флаги.',
    activeHref: '/ru/docs/cli',
    children: [
      p(
        'CLI ',
        code('sitelo'),
        ' оборачивает встроенный Vite и автоматически подключает плагин HTML-страниц.',
      ),
      h2('Команды'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' — настоящий SSR-рендеринг по запросу, включая динамические маршруты, плюс небольшая панель разработчика',
        ),
        li(
          code('build'),
          ' — статический HTML в ',
          code('dist/'),
          ' (или в вашем ',
          code('outDir'),
          ')',
        ),
        li(code('preview'), ' — локально отдаёт продакшн-сборку'),
        li(
          code('lighthouse'),
          ' — аудит продакшн-сборки (нужна peer-зависимость ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Отключить панель можно через ',
        code('devToolbar: false'),
        ' в ',
        code('sitelo.config.js'),
        ' — см. ',
        a({ href: '/ru/docs/configuration' }, 'Конфигурацию'),
        '.',
      ),
      h2('Полезные флаги'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('--port'),
          ' / ',
          code('--host'),
          ' / ',
          code('--open'),
          ' — сервер',
        ),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' — сборка',
        ),
        li(
          code('--root'),
          ' — корень проекта (удобно для сайта в ',
          code('docs/'),
          ')',
        ),
        li(code('--config'), ' — свой файл конфигурации Vite'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Всё, что переиспользуется между командами, лучше держать в параметрах Vite в ',
        code('sitelo.config.js'),
        ' под ключом ',
        code('vite'),
        '.',
      ),
      h2('Поиск неиспользуемого кода'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' находит файлы, экспорты и зависимости, которые ничем не используются. В проекте sitelo ему нужна одна подсказка: страницы и острова обнаруживаются в файловой системе, поэтому их никто не импортирует, и без подсказки knip сообщит, что весь сайт — неиспользуемые файлы.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' читает ваш ',
        code('sitelo.config.js'),
        ' и помечает страницы и острова как точки входа — так же, как их находит сборка: ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' и ',
        code('exclude'),
        ' учитываются целиком. То, что остаётся в отчёте, — код, до которого сайт действительно никогда не доходит.',
      ),
      p(
        'Одного он увидеть не может: клиентский скрипт, на который страница ссылается по URL, а не через импорт, например ',
        code('<script src="/js/app.js">'),
        '. Такие перечислите сами, а рядом передайте любые другие настройки knip — они попадут в результат. Завершающий ',
        code('!'),
        ' — это пометка knip для продакшн-кода, каковым и является скрипт, отправляемый в браузер.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
