# Lighthouse audits

```bash
npm install -D lighthouse
sitelo build
sitelo lighthouse
```

The command starts the same server `sitelo preview` uses, points headless
Chrome at every page in `dist/` (at the URL the site links, so clean URLs,
route groups and `base` all hold), and prints performance, accessibility,
best-practices and SEO scores. Unknown paths get the real `404.html` with a
404 status, as on a static host.

## Thresholds turn the report into a check

```js
// sitelo.config.js
export default {
  lighthouse: {
    exclude: ['404.html'],
    thresholds: { performance: 90, accessibility: 100, 'best-practices': 95, seo: 100 },
  },
}
```

A score below its threshold exits non-zero and is listed by page. Scores
use Lighthouse's 0–100 scale, and 0–1 fractions are accepted too.
`mode: 'warn'` logs instead of failing.

| Option | Default | Meaning |
| --- | --- | --- |
| `include` | `'**/*.html'` | Globs or RegExps of pages, relative to `dist/` |
| `exclude` | `[]` | Pages to skip. `'404.html'` is the usual one |
| `sample` | none | Audit this many random pages **per `include` pattern** |
| `categories` | all four | Any of `performance`, `accessibility`, `best-practices`, `seo` |
| `thresholds` | `{}` | Minimum score per category |
| `mode` | `'error'` | `'warn'` to log and continue |
| `formFactor` | `'mobile'` | `'desktop'`, or `['mobile', 'desktop']` for both, each with its own table |
| `runs` | `1` | Runs per page. The median is reported |
| `output` | `false` | `true` writes reports to `.sitelo/lighthouse/`, or pass a directory |
| `formats` | `['html']` | Report formats: `html`, `json`, `csv` |
| `headless` | `true` | `false` opens a visible Chrome |
| `chromeFlags` | `[]` | For example `['--no-sandbox']` in containers |
| `port` | none | The preview server port |
| `flags` | `{}` | Passed to Lighthouse as-is, with CLI flags in camelCase |
| `config` | none | A full Lighthouse config object |
| `onBuild` | `false` | Also audit at the end of `sitelo build` |

## In CI

- It needs a real Chrome. GitHub's `ubuntu-latest` has one. Otherwise set
  `CHROME_PATH`. Containers usually need `chromeFlags: ['--no-sandbox']`.
- Performance on a shared runner reads about 30–40 points lower than on a
  laptop, and `runs` does not fix that. Gate CI on `accessibility`,
  `best-practices` and `seo`, which depend only on the HTML. Treat
  `performance` as a trend, or set its threshold from numbers measured on
  the runner.
- Pages are audited one at a time. Budget a few seconds each, and use
  `sample` on large sites. Leave `sample` off for exhaustive runs, such as
  before a release.

Docs: https://sitelo.dev/docs/configuration.md (Lighthouse audits section)
