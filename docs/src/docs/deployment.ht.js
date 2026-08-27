import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'
import { deploymentSnippets } from '../lib/snippets/deployment.js'

const s = deploymentSnippets('en')

export default () =>
  docsLayout({
    title: 'Deployment',
    description:
      'Deploy a sitelo site to Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages, or any static host.',
    activeHref: '/docs/deployment',
    children: [
      p(
        'A sitelo build is plain static files: ',
        code('sitelo build'),
        ' writes HTML, CSS, and JS to ',
        code('dist/'),
        '. Any static host works — the configs below only assume ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Clean URLs are directories with ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), so pretty URLs work out of the box with no redirect rules. A ',
        code('404.html'),
        ' is emitted automatically — the convention Netlify, Cloudflare Pages, and GitHub Pages all understand.',
      ),
      p(
        'Ready-to-copy versions of all of these ship in the ',
        a({ href: '/examples/basic' }, 'basic example'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' in the repo).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Dashboard builds: set build command ',
        code('npm run build'),
        ' and output directory ',
        code('dist'),
        '. Or deploy from the CLI with ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'For plain S3 + CloudFront: ',
        code('npm run build'),
        ', then sync ',
        code('dist/'),
        ' to the bucket.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Deploying under a subpath (',
        code('user.github.io/repo'),
        ')? Build with ',
        code('--base /repo/'),
        '.',
      ),
      h2('Before you ship'),
      ul(
        { class: 'docs-list' },
        li(
          'Set ',
          code('site'),
          ' in ',
          code('sitelo.config.js'),
          ' so ',
          code('sitemap.xml'),
          ' is generated — see ',
          a({ href: '/docs/configuration' }, 'Configuration'),
        ),
        li(
          'Add a ',
          code('src/404.ht.js'),
          ' for a branded not-found page (a clean default is emitted otherwise)',
        ),
        li(
          code('sitelo preview'),
          ' serves the production build locally for a final check',
        ),
      ),
    ],
  })
