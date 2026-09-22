import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/pl.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('pl')

export default () =>
  docsLayout({
    title: 'Wdrożenie',
    description:
      'Wdróż witrynę sitelo na Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages albo dowolny hosting statyczny.',
    activeHref: '/pl/docs/deployment',
    children: [
      p(
        'Build sitelo to zwykłe pliki statyczne: ',
        code('sitelo build'),
        ' zapisuje HTML, CSS i JS do ',
        code('dist/'),
        '. Zadziała każdy hosting statyczny — poniższe konfiguracje zakładają jedynie ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Czyste URL-e to katalogi z ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), więc ładne adresy działają od razu, bez reguł przekierowań. ',
        code('404.html'),
        ' powstaje automatycznie — to konwencja, którą rozumieją i Netlify, i Cloudflare Pages, i GitHub Pages.',
      ),
      p(
        'Gotowe do skopiowania wersje wszystkich z nich znajdziesz w ',
        a({ href: '/pl/examples/basic' }, 'podstawowym przykładzie'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' w repozytorium).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Buildy z panelu: ustaw polecenie budowania ',
        code('npm run build'),
        ' i katalog wyjściowy ',
        code('dist'),
        '. Albo wdrażaj z CLI przez ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Dla czystego S3 + CloudFront: ',
        code('npm run build'),
        ', a potem zsynchronizuj ',
        code('dist/'),
        ' z bucketem.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Wdrażasz pod podścieżką (',
        code('user.github.io/repo'),
        ')? Buduj z ',
        code('--base /repo/'),
        '.',
      ),
      h2('Zanim opublikujesz'),
      ul(
        { class: 'docs-list' },
        li(
          'Ustaw ',
          code('site'),
          ' w ',
          code('sitelo.config.js'),
          ', żeby powstała ',
          code('sitemap.xml'),
          ' — zobacz ',
          a({ href: '/pl/docs/configuration' }, 'Konfigurację'),
        ),
        li(
          'Dodaj ',
          code('src/404.ht.js'),
          ' dla strony „nie znaleziono” w Twoim stylu (inaczej powstanie schludna domyślna)',
        ),
        li(
          code('sitelo preview'),
          ' serwuje build produkcyjny lokalnie do ostatniego sprawdzenia',
        ),
      ),
    ],
  })
