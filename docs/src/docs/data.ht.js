import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const dataSnippet = `export async function data({ params, dev }) {
  const res = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
  return await res.json()
}

export default ({ data }) => \`
  <html><body>
    <h1>\${data.title}</h1>
    \${data.body}
  </body></html>
\``

const cacheSnippet = `import { fetchWithCache } from 'sitelo'

export async function data({ params }) {
  const res = await fetchWithCache(
    \`https://api.example.com/posts/\${params.slug}\`,
    { /* standard fetch options */ },
    { maxAge: 3600 }
  )
  return { post: await res.json() }
}`

export default () =>
  docsLayout({
    title: 'Data loading',
    description: 'Build-time data() and fetchWithCache for API-driven static sites.',
    activeHref: '/docs/data',
    children: [
      p(
        'Export a ',
        code('data()'),
        ' function and its result appears as ',
        code('ctx.data'),
        ' in your render function. It runs at build time, and per-request in the dev server.',
      ),
      codeBlock('src/blog/[slug].ht.js', dataSnippet, 'javascript'),
      h2('fetchWithCache'),
      p(
        'Building many pages against the same API? Import ',
        code('fetchWithCache'),
        ' from sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', cacheSnippet, 'javascript'),
      h3('Options'),
      ul(
        { class: 'docs-list' },
        li(code('maxAge'), ' — cache TTL in seconds (default ', code('3600'), ')'),
        li(code('cacheKey'), ' — custom key (default: hash of URL + method + headers + body)'),
        li(code('forceRefresh'), ' — bypass the cache'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Cache modes'),
      ul(
        { class: 'docs-list' },
        li(code('auto'), ' (default) — memory in dev, filesystem in production builds'),
        li(code('memory'), ' — in-process, cleared when the process exits'),
        li(code('fs'), ' — persisted under ', code('node_modules/.cache/')),
        li(code('none'), ' — always fetch'),
      ),
      p(
        'Only ',
        code('GET'),
        ' requests are cached by default (pass a ',
        code('cacheKey'),
        ' to cache other methods). Error responses are never cached.',
      ),
    ],
  })
