/**
 * Deployment configs. Host config files are copy-paste artefacts, so only the
 * leading identifying comment is translated — keys and values never are.
 */
const T = {
  en: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  es: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Alojamiento en AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  fr: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hébergement AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  de: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  ru: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Хостинг AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  zh: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify 托管',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  pt: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Alojamento AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  it: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  pl: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  tr: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
    fly: 'Fly.io',
    gitlab: 'GitLab Pages',
    digitalocean: 'DigitalOcean App Platform',
    heroku: 'Heroku',
  },
  id: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    render: 'Render',
    railway: 'Railway',
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

    wrangler: `# ${t.cloudflare}
name = "my-site"
compatibility_date = "2025-01-01"
pages_build_output_dir = "dist"`,

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4`,

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

    railway: `# ${t.railway}
:{$PORT:80} {
  root * /app/dist
  encode zstd gzip
  try_files {path} {path}/index.html
  file_server
  handle_errors {
    rewrite * /{err.status_code}.html
    file_server
  }
}`,

    dockerfile: `# ${t.fly}
FROM node:24-slim AS build
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

    heroku: `# ${t.heroku}
build:
  docker:
    web: Dockerfile`,
  }
}
