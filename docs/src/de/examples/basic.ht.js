import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/de.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('de')

export default () =>
  examplesLayout({
    title: 'Basis-Website',
    description:
      'Ein minimales sitelo-Projekt und statische Deploy-Konfigurationen für Netlify, Vercel, Cloudflare Pages und AWS Amplify.',
    activeHref: '/de/examples/basic',
    children: [
      p(
        'Die kleinste brauchbare sitelo-Website: eine Seite, ein Stylesheet und Hoster-Konfigurationen, die ',
        code('dist/'),
        ' veröffentlichen. Kopiere die Konfigurationen in jedes sitelo-Projekt — sie setzen nur ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        ' voraus.',
      ),
      p(
        'Eine lauffähige Kopie liegt im sitelo-Repository unter ',
        code('examples/basic/'),
        '.',
      ),
      h2('Was du bekommst'),
      ul(
        { class: 'docs-list' },
        li('Eine einseitige statische Website, mit sitelo gebaut'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ' und ',
          code('amplify.yml'),
        ),
        li('Deploy per Klick oder durch Verbinden des Repos aus dem Beispielordner'),
      ),
      h2('Projektstruktur'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Build'),
      codeBlock('shell', s.build, 'bash'),
      h2('Deployment'),
      p(
        'Setze im sitelo-Monorepo das Root- bzw. Basisverzeichnis der Plattform auf ',
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
          'Auf Vercel deployen',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Auf Netlify deployen',
        ),
        ' (setze das Basisverzeichnis auf ',
        code('examples/basic'),
        ', wenn du gefragt wirst).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Dashboard: Build-Befehl ',
        code('npm run build'),
        ', Ausgabeverzeichnis ',
        code('dist'),
        '. Oder ',
        code('npx wrangler pages deploy dist'),
        ' nach einem lokalen Build.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Verbinde das Repository in Amplify Hosting. Für schlichtes S3 + CloudFront baust du lokal und synchronisierst ',
        code('dist/'),
        ' mit dem Bucket.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Du arbeitest mit Cursor, Copilot oder einem anderen Agenten? Kopiere die ',
        code('AGENTS.md'),
        ' aus diesem Beispiel (oder siehe ',
        a({ href: '/de/docs/build-with-ai' }, 'Mit KI entwickeln'),
        '), damit die Werkzeuge keine React-/Next-Muster erfinden.',
      ),
      p(
        a({ href: '/de/docs' }, 'Erste Schritte'),
        ' · ',
        a({ href: '/de/docs/build-with-ai' }, 'Mit KI entwickeln'),
        ' · ',
        a({ href: '/de/examples/todo' }, 'Todo-App'),
        ' · ',
        a({ href: '/de/examples/islands' }, 'Server-Islands-Beispiel'),
      ),
    ],
  })
