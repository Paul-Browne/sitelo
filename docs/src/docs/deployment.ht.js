import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const netlifySnippet = `[build]
  command = "npm run build"
  publish = "dist"`

const vercelSnippet = `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}`

const wranglerSnippet = `# Cloudflare Pages
name = "my-site"
compatibility_date = "2025-01-01"
pages_build_output_dir = "dist"`

const amplifySnippet = `# AWS Amplify Hosting
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

const ghPagesSnippet = `# GitHub Pages
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4`

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
      codeBlock('netlify.toml', netlifySnippet, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', vercelSnippet, 'javascript'),
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
      codeBlock('wrangler.toml', wranglerSnippet, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', amplifySnippet, 'bash'),
      p(
        'For plain S3 + CloudFront: ',
        code('npm run build'),
        ', then sync ',
        code('dist/'),
        ' to the bucket.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', ghPagesSnippet, 'bash'),
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
