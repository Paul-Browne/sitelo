/**
 * Deployment configs. Host config files are copy-paste artefacts, so only the
 * leading identifying comment is translated — keys and values never are.
 */
const T = {
  en: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  es: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'Alojamiento en AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  fr: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'Hébergement AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  de: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  ru: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'Хостинг AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  zh: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'AWS Amplify 托管',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  pt: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'Alojamento AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  it: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  pl: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  tr: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  id: {
    cloudflare: 'Cloudflare Workers',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },

}

export function deploymentSnippets(lang = 'en') {
  const t = T[lang] ?? T.en

  return {
    netlify: `[build]
  command = "npm run build"
  publish = "dist"`,

    vercel: `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}`,

    wrangler: `// ${t.cloudflare}
{
  "name": "my-site",
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

    amplify: `# ${t.amplify}
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
      - node_modules/**/*`,

    cloudfront: `function handler(event) {
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

    azure: `{
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html"
    }
  }
}`,

    firebase: `{
  "hosting": {
    "public": "dist",
    "predeploy": "npm run build",
    "trailingSlash": false
  }
}`,

    ghPages: `# ${t.ghPages}
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
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
      - uses: actions/deploy-pages@v5`,

    gitlab: `# ${t.gitlab}
deploy-pages:
  image: node:24
  script:
    - npm ci
    - npm run build
  pages:
    publish: dist
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`,

    render: `# ${t.render}
services:
  - type: web
    name: my-site
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist`,

    digitalocean: `# ${t.digitalocean}
name: my-site
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

    fly: `# ${t.fly}
app = "my-site"

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0`,

    caddyServer: `example.com {
  root * /var/www/my-site
  encode zstd gzip
  try_files {path} {path}/index.html
  file_server
  handle_errors {
    rewrite * /{err.status_code}.html
    file_server
  }
}`,

    nginx: `server {
  listen 80;
  server_name example.com;
  root /var/www/my-site;

  location / {
    try_files $uri $uri/index.html =404;
  }

  error_page 404 /404.html;
}`,

    heroku: `# ${t.heroku}
build:
  docker:
    web: Dockerfile`,
  }
}
