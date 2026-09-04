import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/ru.js'

export default () =>
  examplesLayout({
    title: 'Примеры',
    description: 'Практические рецепты sitelo — WordPress, API и не только.',
    activeHref: '/ru/examples',
    children: [
      p(
        'Пошаговые рецепты для настоящих сайтов на sitelo. В каждом примере показаны структура проекта, загрузка данных и страницы, которые вы бы написали.',
      ),
      h2('Доступные'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/ru/examples/basic' }, 'Базовый сайт'),
          ' — минимальный проект плюс конфигурации статического развёртывания для Netlify, Vercel, Cloudflare Pages и AWS Amplify.',
        ),
        li(
          a({ href: '/ru/examples/todo' }, 'Список задач'),
          ' — статический HTML со встроенными обработчиками ',
          code("import('/js/todo.js')"),
          ' (добавить / отметить / удалить, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/ru/examples/blog' }, 'Блог на Markdown'),
          ' — папка файлов ',
          code('.md'),
          ', отрендеренных в статические страницы, с RSS-лентой и без клиентского JS.',
        ),
        li(
          a({ href: '/ru/examples/json' }, 'Локальный JSON'),
          ' — каталог из ',
          code('.json'),
          '-файлов в репозитории: по странице на файл, без API и без базы данных.',
        ),
        li(
          a({ href: '/ru/examples/wordpress' }, 'WordPress'),
          ' — забирайте записи из REST API WordPress через ',
          code('fetchWithCache'),
          ', выводите их списком и генерируйте статические страницы записей.',
        ),
        li(
          a({ href: '/ru/examples/islands' }, 'Серверные острова'),
          ' — статические страницы плюс хост на Node, который рендерит острова в момент запроса.',
        ),
      ),
      h2('Скоро'),
      ul({ class: 'docs-list' }, li('Headless CMS / Contentful')),
    ],
  })
