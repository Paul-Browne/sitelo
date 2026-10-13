import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/ru.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('ru')

export default () =>
  docsLayout({
    title: 'Ресурсы и стили',
    description:
      'Как sitelo собирает фронтенд-JavaScript и CSS через Vite — и не пускает серверный код в браузер.',
    activeHref: '/ru/docs/assets',
    children: [
      p(
        'sitelo построен на Vite, поэтому фронтенд-JavaScript и CSS собираются автоматически. Положите скрипты и стили в ',
        code('src/'),
        ' (например, ',
        code('src/js'),
        ' и ',
        code('src/css'),
        '), сошлитесь на них из HTML корневыми путями — и sitelo сделает остальное: TypeScript, импорты CSS, сборку и минификацию.',
      ),
      h2('Структура проекта'),
      p(
        'Страницы и ресурсы живут вместе в ',
        code('src/'),
        '. Папки вроде ',
        code('js/'),
        ' и ',
        code('css/'),
        ' — соглашение, а не требование: sitelo смотрит на то, что упоминает ваш HTML, а не на названия папок.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Подключение ресурсов из HTML'),
      p(
        'Ссылайтесь на файлы корневыми путями. Именно ',
        code('<script type="module">'),
        ' или ',
        code('<link rel="stylesheet">'),
        ' говорит sitelo включить этот файл в сборку:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Что собирает Vite'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — собираются как ES-модули, TypeScript срезается, импорты подставляются',
        ),
        li(
          code('.css'),
          ' — обрабатывается и минифицируется; ',
          code('@import'),
          ' и относительные ссылки ',
          code('url()'),
          ' разрешаются',
        ),
        li(
          'Всё, что импортируется из упомянутой точки входа (например, ',
          code('counter.ts'),
          ' выше), попадает в тот же бандл',
        ),
        li(
          'В ',
          code('sitelo'),
          ' (dev) те же URL проходят через конвейер преобразований Vite — отдельная сборка, чтобы попробовать TypeScript или CSS, не нужна',
        ),
      ),
      p(
        'Нужны PostCSS, Sass или другие плагины Vite? Добавьте их под ключом ',
        code('vite'),
        ' в ',
        a({ href: '/ru/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Ноль JS по умолчанию'),
      ul(
        { class: 'docs-list' },
        li(
          'Код без ссылок не попадает в вывод. Помощник, импортируемый только из ',
          code('data()'),
          ' или ',
          code('generateStaticParams'),
          ', остаётся за пределами ',
          code('dist/'),
          ' — серверные секреты не публикуются по случайности.',
        ),
        li(
          'Нет ',
          code('<script>'),
          ' на странице — значит, в сборке нет клиентского JavaScript. Большинству сайтов хватает статического HTML и CSS.',
        ),
        li(
          code('public/'),
          ' копируется как есть (фавиконки, robots.txt, статические картинки без хэша в имени).',
        ),
        li(
          'Остальные упомянутые файлы (изображения, шрифты, видео, …) копируются в ',
          code('dist/'),
          '.',
        ),
      ),
      h2('Проверка отсутствующих ресурсов'),
      p(
        code('<script src>'),
        ' или ',
        code('href'),
        ' таблицы стилей, указывающие на файл, которого нет ни в ',
        code('src/'),
        ', ни в ',
        code('public/'),
        ', прерывают сборку. Предпочитаете предупреждение?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
