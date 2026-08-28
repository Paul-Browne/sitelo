import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'
import { basicSnippets } from '../lib/snippets/examples-basic.js'

const s = basicSnippets('en')

export default () =>
  examplesLayout({
    title: 'Basic site',
    description:
      'A minimal sitelo project and static deploy configs for Netlify, Vercel, Cloudflare Pages, and AWS Amplify.',
    activeHref: '/examples/basic',
    children: [
      p(
        'The smallest useful sitelo site: one page, one stylesheet, and host configs that publish ',
        code('dist/'),
        '. Copy the configs into any sitelo project — they only assume ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'A runnable copy lives in the sitelo repo under ',
        code('examples/basic/'),
        '.',
      ),
      h2('What you get'),
      ul(
        { class: 'docs-list' },
        li('A one-page static site built with sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ', and ',
          code('amplify.yml'),
        ),
        li('One-click / connect-repo deploy from the example folder'),
      ),
      h2('Project layout'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Build'),
      codeBlock('shell', s.build, 'bash'),
      h2('Deploy'),
      p(
        'From the sitelo monorepo, set the platform’s root/base directory to ',
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
          'Deploy to Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Deploy to Netlify',
        ),
        ' (set base directory to ',
        code('examples/basic'),
        ' when prompted).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Dashboard: build command ',
        code('npm run build'),
        ', output directory ',
        code('dist'),
        '. Or ',
        code('npx wrangler pages deploy dist'),
        ' after a local build.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Connect the repo in Amplify Hosting. For plain S3 + CloudFront, build locally and sync ',
        code('dist/'),
        ' to the bucket.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Working with Cursor, Copilot, or another agent? Copy ',
        code('AGENTS.md'),
        ' from this example (or see ',
        a({ href: '/docs/build-with-ai' }, 'Build with AI'),
        ') so tools don’t invent React/Next patterns.',
      ),
      p(
        a({ href: '/docs' }, 'Getting started'),
        ' · ',
        a({ href: '/docs/build-with-ai' }, 'Build with AI'),
        ' · ',
        a({ href: '/examples/todo' }, 'Todo app'),
        ' · ',
        a({ href: '/examples/islands' }, 'Server islands example'),
      ),
    ],
  })
