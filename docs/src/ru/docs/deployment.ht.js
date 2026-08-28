import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/ru.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('ru')

export default () =>
  docsLayout({
    title: 'Развёртывание',
    description:
      'Разверните сайт на sitelo в Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages или на любом статическом хостинге.',
    activeHref: '/ru/docs/deployment',
    children: [
      p(
        'Сборка sitelo — это обычные статические файлы: ',
        code('sitelo build'),
        ' записывает HTML, CSS и JS в ',
        code('dist/'),
        '. Подойдёт любой статический хостинг — конфигурации ниже предполагают лишь ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Чистые URL — это каталоги с ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), так что красивые адреса работают сразу, без правил перенаправления. Файл ',
        code('404.html'),
        ' создаётся автоматически — это соглашение понимают и Netlify, и Cloudflare Pages, и GitHub Pages.',
      ),
      p(
        'Готовые к копированию версии всего этого лежат в ',
        a({ href: '/examples/basic' }, 'базовом примере'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' в репозитории; примеры — на английском).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Сборка из панели: команда сборки ',
        code('npm run build'),
        ', каталог вывода ',
        code('dist'),
        '. Либо разверните из CLI командой ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Для простой связки S3 + CloudFront: ',
        code('npm run build'),
        ', затем синхронизируйте ',
        code('dist/'),
        ' с бакетом.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Разворачиваете по подпути (',
        code('user.github.io/repo'),
        ')? Собирайте с ',
        code('--base /repo/'),
        '.',
      ),
      h2('Перед публикацией'),
      ul(
        { class: 'docs-list' },
        li(
          'Задайте ',
          code('site'),
          ' в ',
          code('sitelo.config.js'),
          ', чтобы создавался ',
          code('sitemap.xml'),
          ' — см. ',
          a({ href: '/ru/docs/configuration' }, 'Конфигурацию'),
        ),
        li(
          'Добавьте ',
          code('src/404.ht.js'),
          ' для собственной страницы «не найдено» (иначе создаётся аккуратная страница по умолчанию)',
        ),
        li(
          code('sitelo preview'),
          ' локально отдаёт продакшн-сборку для финальной проверки',
        ),
      ),
    ],
  })
