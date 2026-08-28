import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/de.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('de')

export default () =>
  docsLayout({
    title: 'Deployment',
    description:
      'Eine sitelo-Website auf Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages oder jedem statischen Hoster ausliefern.',
    activeHref: '/de/docs/deployment',
    children: [
      p(
        'Ein sitelo-Build besteht aus schlichten statischen Dateien: ',
        code('sitelo build'),
        ' schreibt HTML, CSS und JS nach ',
        code('dist/'),
        '. Jeder statische Hoster funktioniert — die Konfigurationen unten setzen lediglich ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        ' voraus.',
      ),
      p(
        'Saubere URLs sind Verzeichnisse mit einer ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), deshalb funktionieren hübsche URLs sofort und ohne Weiterleitungsregeln. Eine ',
        code('404.html'),
        ' entsteht automatisch — genau die Konvention, die Netlify, Cloudflare Pages und GitHub Pages verstehen.',
      ),
      p(
        'Kopierfertige Fassungen von all dem stecken im ',
        a({ href: '/examples/basic' }, 'Basis-Beispiel'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' im Repository; die Beispiele sind auf Englisch).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Builds über das Dashboard: Build-Befehl ',
        code('npm run build'),
        ', Ausgabeverzeichnis ',
        code('dist'),
        '. Oder per CLI ausliefern mit ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Für schlichtes S3 + CloudFront: ',
        code('npm run build'),
        ', dann ',
        code('dist/'),
        ' mit dem Bucket synchronisieren.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Du lieferst unter einem Unterpfad aus (',
        code('user.github.io/repo'),
        ')? Dann baue mit ',
        code('--base /repo/'),
        '.',
      ),
      h2('Vor dem Ausliefern'),
      ul(
        { class: 'docs-list' },
        li(
          'Setze ',
          code('site'),
          ' in ',
          code('sitelo.config.js'),
          ', damit die ',
          code('sitemap.xml'),
          ' erzeugt wird — siehe ',
          a({ href: '/de/docs/configuration' }, 'Konfiguration'),
        ),
        li(
          'Lege eine ',
          code('src/404.ht.js'),
          ' an, um eine Fehlerseite im eigenen Look zu bekommen (sonst wird eine schlichte Standardseite erzeugt)',
        ),
        li(
          code('sitelo preview'),
          ' serviert den Produktions-Build lokal für eine letzte Kontrolle',
        ),
      ),
    ],
  })
