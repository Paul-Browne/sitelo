# Basic sitelo site

Minimal static project — useful as a deploy template for Netlify, Vercel, Cloudflare Pages, AWS Amplify, Render, Railway, and Fly.io.

## Run

```bash
npm install
npm run build
npm run dev   # optional: live preview
```

## Deploy

From the sitelo monorepo, set the platform root/base to `examples/basic`.

| Host | Config | Notes |
|------|--------|--------|
| [Vercel](https://vercel.com/new/clone?repository-url=https://github.com/paul-browne/sitelo&root-directory=examples/basic&project-name=sitelo-basic) | `vercel.json` | Deploy button sets root directory |
| [Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo) | `netlify.toml` | Set base directory to `examples/basic` when prompted |
| Cloudflare Pages | `wrangler.toml` | Build `npm run build`, output `dist` — or `npx wrangler pages deploy dist` |
| AWS Amplify | `amplify.yml` | Connect repo; set app root to `examples/basic` |
| Render | `render.yaml` | New Blueprint — or a static site with build `npm install && npm run build`, publish `dist` |
| Railway | `Dockerfile` + `Caddyfile` | Builds the `Dockerfile` with nothing to set. Without one, add the service variable `RAILPACK_SPA_OUTPUT_DIR=dist` and Railpack serves through the `Caddyfile` |
| Fly.io | `fly.toml` + `Dockerfile` + `Caddyfile` | `fly launch`, then `fly deploy` |
| S3 + CloudFront | — | `npm run build` then sync `dist/` to the bucket |

Copy these config files into any sitelo project — they only assume `npm run build` → `dist/`.

Render, Railway, and Fly.io only see the folder they deploy, so the `file:../..` link to sitelo won't resolve there — deploy a copy of this folder that installs `sitelo` from npm.

`AGENTS.md` in this folder is a starter rule file for AI coding tools — see [Build with AI](https://sitelo.dev/docs/build-with-ai).

See [sitelo.dev/examples/basic](https://sitelo.dev/examples/basic).
