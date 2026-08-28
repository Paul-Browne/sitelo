import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/ru.js'
import { gettingStartedSnippets } from '../../lib/snippets/getting-started.js'

const s = gettingStartedSnippets('ru')

export default () =>
  docsLayout({
    title: 'Начало работы',
    description: 'Установите sitelo и соберите свой первый статический сайт.',
    activeHref: '/ru/docs',
    children: [
      p(
        'sitelo — генератор статических сайтов без настройки, работающий на Vite. Установите один пакет, пишите функции, возвращающие HTML, и запустите ',
        code('sitelo build'),
        '.',
      ),
      h2('Установка'),
      codeBlock('shell', s.install, 'bash'),
      p(
        'Требуется Node 20.19+ (или 22.12+). Vite уже включён — отдельно устанавливать его не нужно.',
      ),
      h2('Первая страница'),
      p(
        'Создайте ',
        code('src/index.ht.js'),
        ' (или ',
        code('.ht.jsx'),
        '). Рекомендуем ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ':',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Запуск'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'В результате появится ',
        code('dist/index.html'),
        ' (с автоматически добавленным ',
        code('<!DOCTYPE html>'),
        ') и страница ',
        code('404.html'),
        ' по умолчанию.',
      ),
      h2('Что дальше'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/ru/docs/pages' }, 'Написание страниц'),
          ' — шаблонные строки, JSX, структурированные модули',
        ),
        li(
          a({ href: '/ru/docs/routing' }, 'Маршрутизация'),
          ' — файловые маршруты и ',
          code('generateStaticParams'),
        ),
        li(
          a({ href: '/ru/docs/data' }, 'Загрузка данных'),
          ' — ',
          code('data()'),
          ' и ',
          code('fetchWithCache'),
        ),
        li(
          a({ href: '/ru/docs/assets' }, 'Ресурсы и стили'),
          ' — фронтенд-JS/CSS, собираемые Vite (',
          code('src/js'),
          ', ',
          code('src/css'),
          ')',
        ),
        li(
          a({ href: '/ru/docs/configuration' }, 'Конфигурация'),
          ' — ',
          code('sitelo.config.js'),
          ' и параметры Vite',
        ),
        li(
          a({ href: '/ru/docs/build-with-ai' }, 'Разработка с ИИ'),
          ' — ',
          code('llms.txt'),
          ', правила проекта и советы для агентов',
        ),
      ),
    ],
  })
