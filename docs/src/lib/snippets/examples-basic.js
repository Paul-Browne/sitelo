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
  wrangler.jsonc         # Cloudflare Workers
  amplify.yml            # AWS Amplify
  cloudfront-function.js # AWS S3 + CloudFront
  firebase.json          # Firebase Hosting
  .gitlab-ci.yml         # GitLab Pages
  render.yaml            # Render
  .do/app.yaml           # DigitalOcean App Platform
  Caddyfile              # Railway, Fly.io, Heroku, Cloud Run
  Dockerfile             # Railway, Fly.io, Heroku, Cloud Run
  .dockerignore          # Railway, Fly.io, Heroku, Cloud Run
  fly.toml               # Fly.io
  heroku.yml             # Heroku
  nginx.conf             # Your own server
  package.json
  public/
    staticwebapp.config.json  # Azure Static Web Apps
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

    wranglerJsonc: `{
  "name": "sitelo-basic",
  "compatibility_date": "2026-10-01",
  "build": {
    "command": "npm run build"
  },
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "drop-trailing-slash"
  }
}`,

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

    cloudfrontFunction: `function handler(event) {
  var request = event.request
  var uri = request.uri

  if (uri.endsWith('/')) {
    request.uri += 'index.html'
  } else if (uri.slice(uri.lastIndexOf('/') + 1).indexOf('.') === -1) {
    request.uri += '/index.html'
  }

  return request
}`,

    s3Deploy: `npm run build
aws s3 sync dist/ s3://my-bucket --delete
aws cloudfront create-invalidation --distribution-id MY_DISTRIBUTION_ID --paths "/*"`,

    azureConfig: `{
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html"
    }
  }
}`,

    firebaseJson: `{
  "hosting": {
    "public": "dist",
    "predeploy": "npm run build",
    "trailingSlash": false
  }
}`,

    gitlabCi: `deploy-pages:
  image: node:24
  script:
    - npm ci
    - npm run build
  pages:
    publish: dist
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`,

    renderYaml: `services:
  - type: web
    name: sitelo-basic
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist`,

    doAppYaml: `name: sitelo-basic
static_sites:
  - name: site
    github:
      repo: your-name/your-site
      branch: main
      deploy_on_push: true
    build_command: npm run build
    output_dir: dist`,

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

    herokuYml: `build:
  docker:
    web: Dockerfile`,

    nginxConf: `server {
  listen 80;
  server_name example.com;
  root /var/www/my-site;

  location / {
    try_files $uri $uri/index.html =404;
  }

  error_page 404 /404.html;
}`,

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
