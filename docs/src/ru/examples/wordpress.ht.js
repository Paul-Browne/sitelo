import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/ru.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('ru')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Выкачайте целый сайт WordPress через REST API — тысячи записей, статически сгенерированных на sitelo.',
    activeHref: '/ru/examples/wordpress',
    children: [
      p(
        'Относитесь к WordPress как к headless-CMS и ',
        'выкачайте сайт целиком',
        ': пройдите постранично по ',
        code('/wp-json/wp/v2/posts'),
        ', создайте по HTML-файлу на каждый slug и кэшируйте ответы API между сборками.',
      ),
      h2('Что вы получаете'),
      ul(
        { class: 'docs-list' },
        li('Главную страницу со списком недавних записей'),
        li(code('/blog'), ' — полный архив всех записей'),
        li(
          code('/blog/[slug]'),
          ' — по одной статической HTML-странице на запись (работает и на тысячах записей)',
        ),
        li(
          code('fetchWithCache'),
          ', чтобы повторные сборки переиспользовали ответы WP вместо повторной загрузки всего',
        ),
      ),
      h2('Структура проекта'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Укажите свой сайт WordPress'),
      p(
        'В современном WordPress REST API включён по умолчанию. Проверьте это по адресу ',
        code('https://ваш-сайт.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Задайте ',
        code('WP_URL'),
        ' в окружении (или впишите его прямо в код, пока экспериментируете):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Общие помощники WordPress'),
      p(
        code('getAllPosts()'),
        ' читает ',
        code('X-WP-TotalPages'),
        ' и обходит все страницы (WordPress ограничивает ',
        code('per_page'),
        ' сотней). Пропускайте ',
        code('_embed'),
        ' при сборе slug — запрашивайте вложения только для отдельных записей.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Главная страница'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Индекс блога'),
      p(
        'Используйте ',
        code('getAllPosts()'),
        ', чтобы архив не обрывался на 50–100 элементах.',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Превратите все записи в статические страницы'),
      p(
        code('generateStaticParams'),
        ' должен вернуть ',
        'все',
        ' slug, которые вы хотите видеть в ',
        code('dist/'),
        '. Пройдите API постранично прямо здесь — не вызывайте ',
        code('getPosts({ perPage: 100 })'),
        ' один раз и на этом не останавливайтесь.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Сборка'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'Первая сборка один раз проходит через WordPress и наполняет кэш fetch. Последующие переиспользуют закэшированные ответы списков и деталей (',
        code("cache: 'auto'"),
        ' → файловая система в продакшне), пока не истечёт ',
        code('maxAge'),
        '. Поднимите ',
        code('renderConcurrency'),
        ' в ',
        code('sitelo.config.js'),
        ', если рендерите тысячи страниц записей.',
      ),
      h2('Заметки'),
      h3('HTML из WordPress'),
      p(
        code('title.rendered'),
        ' и ',
        code('content.rendered'),
        ' — это строки HTML из WP. Вставляйте их в шаблон как есть (как выше) или очищайте, если не доверяете CMS полностью.',
      ),
      h3('Закрытый контент'),
      p(
        'Публичные REST-маршруты отдают только опубликованные записи. Для черновиков или своей авторизации передайте заголовки во втором аргументе ',
        code('fetchWithCache'),
        ' (обычный init для ',
        code('fetch'),
        ') и используйте стабильный ',
        code('cacheKey'),
        '.',
      ),
      p(
        a({ href: '/ru/docs/data' }, 'Документация по загрузке данных'),
        ' · ',
        a({ href: '/ru/docs/routing' }, 'Документация по маршрутизации'),
      ),
    ],
  })
