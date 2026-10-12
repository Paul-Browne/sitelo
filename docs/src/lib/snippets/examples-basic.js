/**
 * Code samples for the "Basic site" example.
 *
 * Host config files are copy-paste artefacts, so their keys and values are
 * never translated — only the page's own title and heading are.
 */
const T = {
  en: { exampleTitle: 'sitelo — basic example', hello: 'Hello from sitelo' },
  es: { exampleTitle: 'sitelo — ejemplo básico', hello: 'Hola desde sitelo' },
  fr: { exampleTitle: 'sitelo — exemple de base', hello: 'Bonjour depuis sitelo' },
  de: { exampleTitle: 'sitelo — Basis-Beispiel', hello: 'Hallo von sitelo' },
  ru: { exampleTitle: 'sitelo — базовый пример', hello: 'Привет от sitelo' },
  zh: { exampleTitle: 'sitelo —— 基础示例', hello: '你好，来自 sitelo' },
  pt: {
    exampleTitle: 'sitelo — exemplo básico',
    hello: 'Olá do sitelo',
  },
  it: {
    exampleTitle: 'sitelo — esempio di base',
    hello: 'Ciao da sitelo',
  },
  pl: {
    exampleTitle: 'sitelo — podstawowy przykład',
    hello: 'Cześć z sitelo',
  },
  tr: {
    exampleTitle: 'sitelo — temel örnek',
    hello: 'sitelo’dan merhaba',
  },
  id: {
    exampleTitle: 'sitelo — contoh dasar',
    hello: 'Halo dari sitelo',
  },

}

export function basicSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    structure: `my-site/
  sitelo.config.js
  netlify.toml           # Netlify
  vercel.json            # Vercel
  wrangler.toml          # Cloudflare Pages
  amplify.yml            # AWS Amplify
  render.yaml            # Render
  Caddyfile              # Railway, Fly.io
  Dockerfile             # Fly.io, Railway
  .dockerignore          # Fly.io, Railway
  fly.toml               # Fly.io
  package.json
  src/
    index.ht.js
    css/
      styles.css`,

    netlifyToml: `[build]
  command = "npm run build"
  publish = "dist"`,

    vercelJson: `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}`,

    wranglerToml: `name = "sitelo-basic"
compatibility_date = "2025-01-01"
pages_build_output_dir = "dist"`,

    amplifyYml: `version: 1
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
      - node_modules/**/*`,

    renderYaml: `services:
  - type: web
    name: sitelo-basic
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist`,

    caddyfile: `:{$PORT:80} {
  root * /app/dist
  encode zstd gzip
  try_files {path} {path}/index.html
  file_server
  handle_errors {
    rewrite * /{err.status_code}.html
    file_server
  }
}`,

    dockerfile: `FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /app/dist`,

    dockerignore: `node_modules
dist
.git`,

    flyToml: `app = "sitelo-basic"

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0`,

    pageTemplate: `export default () => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.exampleTitle}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>${t.hello}</h1>
    </body>
  </html>
\``,

    pageHt: `import { html, head, title, link, body, h1 } from 'javascript-to-html'

export default () =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.exampleTitle}'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
    ),
    body(h1('${t.hello}')),
  )`,

    pageJsx: `export default function Home() {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.exampleTitle}</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <h1>${t.hello}</h1>
      </body>
    </html>
  )
}`,

    build: `npm install
npm run build`,
  }
}
