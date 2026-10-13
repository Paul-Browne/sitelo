# Deployment

A sitelo build is plain static files in `dist/`, so any static host works.
Clean URLs are directories with `index.html`, which means pretty URLs need
no redirect rules, and `404.html` is always emitted. The configs below
assume `"build": "sitelo build"` in `package.json`.

Every config below, and more, is in `examples/basic` in the sitelo repo:
https://github.com/Paul-Browne/sitelo/tree/main/examples/basic

## Netlify (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## Vercel (`vercel.json`)

```json
{ "framework": null, "buildCommand": "npm run build", "outputDirectory": "dist" }
```

## Cloudflare Workers (`wrangler.jsonc`)

```jsonc
{
  "name": "my-site",
  "compatibility_date": "2026-10-01",
  "build": { "command": "npm run build" },
  "assets": { "directory": "./dist", "not_found_handling": "404-page", "html_handling": "drop-trailing-slash" }
}
```

Deploy with `npx wrangler deploy`. On Cloudflare Pages, use build command
`npm run build` and output `dist`.

## GitHub Pages

Build in a workflow and publish `dist/` with `actions/upload-pages-artifact`
and `actions/deploy-pages`. For a project site at `user.github.io/repo`,
build with `sitelo build --base /repo/` and make internal links carry
`/repo/`. Turn on `linkCheck` to catch links that do not.

## Others

- **AWS S3 + CloudFront**: keep the bucket private behind origin access
  control. Add a viewer-request function that maps `/about` to
  `/about/index.html`, and custom error responses that turn 403 and 404
  into `/404.html` with status 404.
- **Azure Static Web Apps**: app location `/`, output `dist`. Put a
  `staticwebapp.config.json` in `public/` so unknown URLs get `404.html`.
- **Firebase Hosting**: `public: "dist"`, `trailingSlash: false`, and a
  predeploy hook that builds.
- **Container hosts** (Railway, Fly.io, Heroku, Cloud Run): a Dockerfile
  that builds with Node, then serves `dist/` with Caddy (`try_files {path}
  {path}/index.html`, falling back to `404.html`).
- **Your own server**: `rsync -a --delete dist/ server:/var/www/site/` and
  serve it with Caddy or nginx (`try_files $uri $uri/index.html =404;
  error_page 404 /404.html;`).

## Server islands in production

The static host serves the pages, but `/_sitelo/islands/*` needs a function
or server. See [islands.md](islands.md).

## Before you ship

- Set `site` in `sitelo.config.js` so `sitemap.xml` is written.
- Add `src/404.ht.js` for a branded not-found page.
- Run `sitelo build`, then `sitelo preview`, and click through.
  `linkCheck: 'error'` and `sitelo lighthouse` catch the rest.

Docs: https://sitelo.dev/docs/deployment.md
