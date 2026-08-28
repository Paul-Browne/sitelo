import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/ru.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('ru')

export default () =>
  examplesLayout({
    title: 'Блог на Markdown',
    description:
      'Папка markdown-файлов → статический блог с RSS-лентой, собранный на sitelo и marked.',
    activeHref: '/ru/examples/blog',
    children: [
      p(
        'Каноничный случай для статического сайта: markdown-файлы в папке, по статической странице на запись, RSS-лента и ноль клиентского JavaScript. Полный исходник в ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('Что вы получаете'),
      ul(
        { class: 'docs-list' },
        li('Главную страницу со списком записей, новые первыми'),
        li(
          code('/blog/[slug]'),
          ' — по одной статической HTML-странице на markdown-файл, через ',
          code('generateStaticParams'),
        ),
        li(
          code('rss.xml'),
          ' — создаётся sitelo из конфигурации ',
          code('rss'),
        ),
        li(code('sitemap.xml'), ' — включается заданием ', code('site')),
        li('Ноль публикуемого JS — markdown разбирается в Node во время сборки'),
      ),
      h2('Структура проекта'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Пишите записи в markdown'),
      p(
        'Записи лежат в ',
        code('content/'),
        ' — вне ',
        code('src/'),
        ', поэтому sitelo никогда не считает их страницами или ресурсами. Frontmatter — это обычные строки ',
        code('ключ: значение'),
        ':',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Читайте и рендерите их в Node'),
      p(
        'Небольшой серверный модуль читает папку, разбирает frontmatter и рендерит markdown через ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Поскольку ничто в HTML не ссылается на этот модуль, он никогда не попадает в браузер.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Выведите записи на главной'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. По статической странице на запись'),
      p(
        code('generateStaticParams'),
        ' возвращает все slug во время сборки; ',
        code('data()'),
        ' загружает нужную запись для каждой страницы.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS бесплатно'),
      p(
        'С конфигурацией ',
        code('rss'),
        ' выше ',
        code('sitelo build'),
        ' выдаёт ',
        code('dist/rss.xml'),
        ' с элементом для каждой страницы внутри ',
        code('/blog'),
        ' — без единой строчки дополнительного кода.',
      ),
      p(
        a({ href: '/ru/docs/routing' }, 'Документация по маршрутизации'),
        ' · ',
        a({ href: '/ru/docs/data' }, 'Документация по загрузке данных'),
        ' · ',
        a({ href: '/ru/docs/configuration' }, 'Документация по конфигурации'),
      ),
    ],
  })
