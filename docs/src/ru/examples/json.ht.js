import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/ru.js'
import { jsonSnippets } from '../../lib/snippets/examples-json.js'

const s = jsonSnippets('ru')

export default () =>
  examplesLayout({
    title: 'Локальный JSON',
    description:
      'Каталог товаров, целиком собранный из JSON-файлов в репозитории — без API и без базы данных.',
    activeHref: '/ru/examples/json',
    children: [
      p(
        'Контент, который лежит в репозитории в виде JSON, превращается в статические страницы через ',
        code('sitelo/data'),
        '. Без API, без базы данных и без клиентского JavaScript. Полный исходник — в ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/json',
            rel: 'noopener',
          },
          'examples/json',
        ),
        '.',
      ),
      h2('Что получится'),
      ul(
        { class: 'docs-list' },
        li('Главная страница со всеми категориями и товарами'),
        li(
          code('/products/[slug]'),
          ' — по статической странице на каждый файл в ',
          code('data/products/'),
          '',
        ),
        li(
          code('/categories/[slug]'),
          ' — по странице на каждый ключ в ',
          code('data/categories.json'),
          '',
        ),
        li('Добавить JSON-файл — значит добавить страницу; никаких маршрутов регистрировать не нужно'),
        li('Ни байта JS в браузер — файлы читаются в Node во время сборки'),
      ),
      h2('Структура проекта'),
      codeBlock('project', s.structure, 'bash'),
      p(
        'Данные лежат вне ',
        code('src/'),
        ', поэтому sitelo никогда не считает их страницами или ресурсами.',
      ),
      h2('1. Положите контент в data/'),
      p(
        'По файлу на товар. Имя файла и есть slug, поэтому ',
        code('aeron-chair.json'),
        ' становится ',
        code('/products/aeron-chair'),
        ' — в самом файле об этом ничего писать не нужно:',
      ),
      codeBlock('data/products/aeron-chair.json', s.product, 'json'),
      p(
        'Категории, наоборот, живут в одном файле: объект, ключи которого — слаги; ',
        code('readJsonCollection'),
        ' читает его точно так же, как коллекцию.',
      ),
      codeBlock('data/categories.json', s.categories, 'json'),
      h2('2. Читайте в одном месте'),
      p(
        'Небольшой серверный модуль оборачивает чтение. В HTML на него нет ссылок, поэтому он никогда не попадает в браузер, — а поскольку ',
        code('sitelo/data'),
        ' запоминает результат по файлу, сколько бы страниц ни вызывало эти помощники, каждый JSON-файл разбирается за сборку один раз.',
      ),
      codeBlock('src/lib/catalogue.js', s.lib, 'javascript'),
      h2('3. Выведите всё на главной'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. По странице на JSON-файл'),
      p(
        code('generateStaticParams'),
        ' возвращает slug для каждого файла во время сборки, а ',
        code('data()'),
        ' подгружает для страницы нужную запись.',
      ),
      pageCodeTabs({
        file: 'src/products/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. Правьте и смотрите'),
      codeBlock('terminal', s.build, 'bash'),
      p(
        'В режиме ',
        code('sitelo'),
        ' изменение цены перезагружает открытую страницу — dev-сервер следит за теми JSON-файлами, которые страницы действительно читают. Повторяющиеся слаги, отсутствующие файлы и некорректный JSON останавливают сборку с указанием пути.',
      ),
      p(
        a({ href: '/ru/docs/data' }, 'Документация по загрузке данных'),
        ' · ',
        a({ href: '/ru/docs/routing' }, 'Документация по маршрутизации'),
        ' · ',
        a({ href: '/ru/docs/configuration' }, 'Документация по конфигурации'),
      ),
    ],
  })
