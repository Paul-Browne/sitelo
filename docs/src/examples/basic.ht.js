import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { examplesLayout } from '../lib/layout.js'

const structureSnippet = `my-site/
  sitelo.config.js
  netlify.toml           # Netlify
  vercel.json            # Vercel
  wrangler.toml          # Cloudflare Pages
  amplify.yml            # AWS Amplify
  package.json
  src/
    index.ht.js
    styles.css`

const netlifyTomlSnippet = `# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"`

const vercelJsonSnippet = `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}`

const wranglerTomlSnippet = `# wrangler.toml
name = "sitelo-basic"
compatibility_date = "2025-01-01"
pages_build_output_dir = "dist"`

const amplifyYmlSnippet = `# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*`

const pageTemplate = `// src/index.ht.js
export default () => \`
  <html lang="en">
    <head>
      <title>sitelo — basic example</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Hello from sitelo</h1>
    </body>
  </html>
\``

const pageHt = `// src/index.ht.js
import { html, head, title, link, body, h1 } from 'javascript-to-html'

export default () =>
  html({ lang: 'en' },
    head(
      title('sitelo — basic example'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(h1('Hello from sitelo')),
  )`

const pageJsx = `// src/index.ht.jsx
export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>sitelo — basic example</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>Hello from sitelo</h1>
      </body>
    </html>
  )
}`

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
      codeBlock('project', structureSnippet, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: pageTemplate,
        ht: pageHt,
        jsx: pageJsx,
      }),
      h2('Build'),
      codeBlock(
        'shell',
        `npm install
npm run build`,
        'bash',
      ),
      h2('Deploy'),
      p(
        'From the sitelo monorepo, set the platform’s root/base directory to ',
        code('examples/basic'),
        '.',
      ),
      h3('Netlify'),
      codeBlock('netlify.toml', netlifyTomlSnippet, 'toml'),
      h3('Vercel'),
      codeBlock('vercel.json', vercelJsonSnippet, 'json'),
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
      codeBlock('wrangler.toml', wranglerTomlSnippet, 'toml'),
      h3('AWS Amplify'),
      p(
        'Connect the repo in Amplify Hosting. For plain S3 + CloudFront, build locally and sync ',
        code('dist/'),
        ' to the bucket.',
      ),
      codeBlock('amplify.yml', amplifyYmlSnippet, 'yaml'),
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
        a({ href: '/examples/islands' }, 'Server islands example'),
      ),
    ],
  })
