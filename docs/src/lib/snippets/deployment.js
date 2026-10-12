/**
 * Deployment configs. Host config files are copy-paste artefacts, so only the
 * leading identifying comment is translated — keys and values never are.
 */
const T = {
  en: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  es: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Alojamiento en AWS Amplify',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  fr: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hébergement AWS Amplify',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  de: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  ru: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Хостинг AWS Amplify',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  zh: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify 托管',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  pt: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Alojamento AWS Amplify',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  it: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  pl: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  tr: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'AWS Amplify Hosting',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
  },
  id: {
    cloudflare: 'Cloudflare Pages',
    amplify: 'Hosting AWS Amplify',
    ghPages: 'GitHub Pages',
    railway: 'Railway',
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
  }
}
