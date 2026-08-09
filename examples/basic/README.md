# Basic sitelo site

Minimal static project — useful as a deploy template for Netlify, Vercel, Cloudflare Pages, and AWS Amplify.

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
| S3 + CloudFront | — | `npm run build` then sync `dist/` to the bucket |

Copy these config files into any sitelo project — they only assume `npm run build` → `dist/`.

`AGENTS.md` in this folder is a starter rule file for AI coding tools — see [Build with AI](https://sitelo.js.org/docs/build-with-ai).

See [sitelo.js.org/examples/basic](https://sitelo.js.org/examples/basic).
