import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/pl.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('pl')

export default () =>
  examplesLayout({
    title: 'Podstawowa strona',
    description:
      'Minimalny projekt sitelo i konfiguracje statycznego wdrożenia dla Netlify, Vercela, Cloudflare Pages i AWS Amplify.',
    activeHref: '/pl/examples/basic',
    children: [
      p(
        'Najmniejsza witryna sitelo, która ma sens: jedna strona, jeden arkusz stylów i konfiguracje hostingów publikujące ',
        code('dist/'),
        '. Skopiuj te konfiguracje do dowolnego projektu sitelo — zakładają jedynie ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Uruchamialna kopia leży w repozytorium sitelo, pod ',
        code('examples/basic/'),
        '.',
      ),
      h2('Co dostajesz'),
      ul(
        { class: 'docs-list' },
        li('Jednostronicową witrynę statyczną zbudowaną przez sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' i ',
          code('amplify.yml'),
        ),
        li('Wdrożenie jednym kliknięciem / przez podpięcie repozytorium z katalogu przykładu'),
      ),
      h2('Układ projektu'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Build'),
      codeBlock('shell', s.build, 'bash'),
      h2('Wdrożenie'),
      p(
        'W monorepo sitelo ustaw katalog główny/bazowy platformy na ',
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
          'Wdróż na Vercelu',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Wdróż na Netlify',
        ),
        ' (gdy zapyta, ustaw katalog bazowy na ',
        code('examples/basic'),
        ').',
      ),
      h3('Cloudflare Pages'),
      p(
        'Panel: polecenie budowania ',
        code('npm run build'),
        ', katalog wyjściowy ',
        code('dist'),
        '. Albo ',
        code('npx wrangler pages deploy dist'),
        ' po lokalnym buildzie.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Podepnij repozytorium w Amplify Hosting. Dla czystego S3 + CloudFront zbuduj lokalnie i zsynchronizuj ',
        code('dist/'),
        ' z bucketem.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Pracujesz z Cursorem, Copilotem albo innym agentem? Skopiuj ',
        code('AGENTS.md'),
        ' z tego przykładu (albo zobacz ',
        a({ href: '/pl/docs/build-with-ai' }, 'Tworzenie z AI'),
        '), żeby narzędzia nie wymyślały wzorców React/Next.',
      ),
      p(
        a({ href: '/pl/docs' }, 'Pierwsze kroki'),
        ' · ',
        a({ href: '/pl/docs/build-with-ai' }, 'Tworzenie z AI'),
        ' · ',
        a({ href: '/pl/examples/todo' }, 'Aplikacja todo'),
        ' · ',
        a({ href: '/pl/examples/islands' }, 'Przykład wysp serwerowych'),
      ),
    ],
  })
