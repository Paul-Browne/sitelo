import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/ru.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('ru')

export default () =>
  examplesLayout({
    title: 'Базовый сайт',
    description:
      'Минимальный проект sitelo и конфигурации статического развёртывания для Netlify, Vercel, Cloudflare Pages и AWS Amplify.',
    activeHref: '/ru/examples/basic',
    children: [
      p(
        'Самый маленький полезный сайт на sitelo: одна страница, одна таблица стилей и конфигурации хостингов, публикующие ',
        code('dist/'),
        '. Скопируйте конфигурации в любой проект sitelo — они предполагают только ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Рабочая копия лежит в репозитории sitelo, в ',
        code('examples/basic/'),
        '.',
      ),
      h2('Что вы получаете'),
      ul(
        { class: 'docs-list' },
        li('Одностраничный статический сайт, собранный на sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' и ',
          code('amplify.yml'),
        ),
        li('Развёртывание в один клик или подключением репозитория из папки примера'),
      ),
      h2('Структура проекта'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Сборка'),
      codeBlock('shell', s.build, 'bash'),
      h2('Развёртывание'),
      p(
        'Из монорепозитория sitelo укажите корневой или базовый каталог платформы как ',
        code('examples/basic'),
        '.',
      ),
      h3('Netlify'),
      codeBlock('netlify.toml', s.netlifyToml, 'toml'),
      h3('Vercel'),
      codeBlock('vercel.json', s.vercelJson, 'json'),
      p(
        a(
          {
            href: 'https://vercel.com/new/clone?repository-url=https://github.com/paul-browne/sitelo&root-directory=examples/basic&project-name=sitelo-basic',
            rel: 'noopener',
          },
          'Развернуть на Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Развернуть на Netlify',
        ),
        ' (когда спросят, укажите базовый каталог ',
        code('examples/basic'),
        ').',
      ),
      h3('Cloudflare Pages'),
      p(
        'Панель: команда сборки ',
        code('npm run build'),
        ', каталог вывода ',
        code('dist'),
        '. Либо ',
        code('npx wrangler pages deploy dist'),
        ' после локальной сборки.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Подключите репозиторий в Amplify Hosting. Для простой связки S3 + CloudFront соберите локально и синхронизируйте ',
        code('dist/'),
        ' с бакетом.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Работаете с Cursor, Copilot или другим агентом? Скопируйте ',
        code('AGENTS.md'),
        ' из этого примера (или см. ',
        a({ href: '/ru/docs/build-with-ai' }, 'Разработку с ИИ'),
        '), чтобы инструменты не выдумывали паттерны React/Next.',
      ),
      p(
        a({ href: '/ru/docs' }, 'Начало работы'),
        ' · ',
        a({ href: '/ru/docs/build-with-ai' }, 'Разработка с ИИ'),
        ' · ',
        a({ href: '/ru/examples/todo' }, 'Список задач'),
        ' · ',
        a({ href: '/ru/examples/islands' }, 'Пример серверных островов'),
      ),
    ],
  })
