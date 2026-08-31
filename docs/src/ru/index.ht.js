import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from '../lib/ru.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('ru')

const features = [
  [
    'routing',
    'Маршрутизация',
    'src/about.ht.js → /about, а также [slug] и перехватывающие маршруты',
    '/ru/docs/routing',
  ],
  [
    'code',
    'JSX и TSX',
    'Пишите страницы как .jsx / .tsx с той же маршрутизацией и сборкой',
    '/ru/docs/pages#ограничения-jsx',
  ],
  [
    'data',
    'Загрузка данных',
    'data() во время сборки, с кэшированием fetch',
    '/ru/docs/data',
  ],
  [
    'pipeline',
    'Конвейер ресурсов',
    'Упомянутый JS/TS/CSS собирается; остальное остаётся на сервере',
    '/ru/docs/assets',
  ],
  [
    'image',
    'Оптимизация изображений',
    'Масштабирование, форматы и srcset — включите через images: true (установите sharp)',
    '/ru/docs/images',
  ],
  [
    'feather',
    'Ноль JavaScript по умолчанию',
    'Собираются только те скрипты, которые вы подключили, — остальное не попадает на страницу, и сайт работает быстрее',
    '/ru/docs/assets#ноль-js-по-умолчанию',
  ],
  [
    'terminal',
    'Сервер разработки и панель',
    'Живой рендеринг по запросу, плюс файл, параметры, число островов и переключатель viewport во время работы',
    '/ru/docs/cli',
  ],
  [
    'search',
    'Поиск Pagefind',
    'Необязательный статический поиск — установите pagefind, и sitelo build проиндексирует в dist/pagefind/',
    '/ru/docs/configuration#поиск-pagefind',
  ],
  [
    'layers',
    'Серверные острова',
    'Статические страницы с областями, которые рендерятся на сервере в момент запроса',
    '/ru/docs/islands',
  ],
  [
    'sparkles',
    'Готово к ИИ',
    'llms.txt, правила проекта и советы, чтобы агенты писали sitelo, а не React',
    '/ru/docs/build-with-ai',
  ],
  [
    'deploy',
    'Развёртывание в один клик',
    'Конфигурации для Netlify, Vercel, Cloudflare Pages и AWS Amplify в комплекте',
    '/ru/docs/deployment',
  ],
  [
    'gift',
    'Дополнительно',
    '404.html, sitemap.xml и RSS — когда попросите',
    '/ru/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — Современный фреймворк для быстрых сайтов',
    description:
      'sitelo превращает папку со страницами в быстрый статический сайт. Живой предпросмотр во время работы, одна команда для публикации — без тяжёлого фреймворка.',
    children: [headerHero(), mainSections()],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
        // Above the fold and the hero's first paint, so it should not queue
        // behind the page's other subresources.
        fetchpriority: 'high',
      }),
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          'Современный фреймворк для ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'быстрых сайтов|блогов|портфолио|лендингов|контентных сайтов|интернет-магазинов',
              'aria-live': 'polite',
            },
            'быстрых сайтов',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Никакой настройки. Молниеносные сборки. Разворачивайте где угодно — одна установка.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/ru/docs' }, 'Начать'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': 'Копировать команду установки',
              },
              'Копировать',
            ),
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      'Что вы получаете',
      ul(
        { class: 'feature-list' },
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
      ),
    ),
    sectionBlock(
      'Документация',
      p(
        'Руководства по маршрутизации, загрузке данных, TypeScript, конфигурации и CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/ru/docs' },
          'Читать документацию',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Примеры',
      p(
        'Рецепты для реальных задач — начиная с сайта на REST API WordPress.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/ru/examples' },
          'Смотреть примеры',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
