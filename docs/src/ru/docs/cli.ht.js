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
    ],
  })
