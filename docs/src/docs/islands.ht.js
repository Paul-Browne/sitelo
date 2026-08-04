import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const islandModuleSnippet = `// src/islands/comments.js
export default async function comments({ props, request }) {
  const comments = await fetchComments(props.postId)
  return \`<ul>\${comments.map((c) => \`<li>\${c.text}</li>\`).join('')}</ul>\`
}`

const pageSnippet = `// src/blog/[slug].ht.js
import { island } from 'sitelo/islands'

export default ({ params }) => \`
  <html>
    <body>
      <article>…static content…</article>
      \${island('comments', { postId: params.slug }, '<p>Loading comments…</p>')}
      <script type="module" src="/islands.js"></script>
    </body>
  </html>
\``

const loaderSnippet = `// src/islands.js
import { mountIslands } from 'sitelo/islands/client'

mountIslands()`

const serverSnippet = `// e.g. a Node server, or a serverless/edge function
import { createIslandsHandler } from 'sitelo/islands/server'

const handleIslands = createIslandsHandler({
  islands: {
    comments: () => import('./src/islands/comments.js'),
  },
})

// Web Request → Response | null (null = not an island request)
export default { fetch: (request) => handleIslands(request) }`

export default () =>
  docsLayout({
    title: 'Server islands',
    description:
      'Keep pages static and render marked regions on the server at request time.',
    activeHref: '/docs/islands',
    children: [
      p(
        'Sometimes one region of an otherwise-static page needs fresh, per-request data — comments under a cached blog post, a stock badge on a product page. Server islands keep the page static and render just that region on a server when the page is viewed. Experimental: the API may change.',
      ),
      h2('1. Write the island'),
      p(
        'An island is a fragment module under ',
        code('src/islands/'),
        ' — a plain ',
        code('.js'),
        ' or ',
        code('.ts'),
        ' file (not ',
        code('.ht.js'),
        ', because islands are fragments, not pages). Same idea as everywhere else in sitelo: a function that returns HTML.',
      ),
      codeBlock('src/islands/comments.js', islandModuleSnippet, 'javascript'),
      p(
        'It receives ',
        code('{ name, props, request }'),
        ' and must return an HTML string. Island modules are server-only — unreferenced code under ',
        code('src/'),
        ' never ships to the browser.',
      ),
      h2('2. Place it in a page'),
      p(
        'Import ',
        code('island()'),
        ' from ',
        code('sitelo/islands'),
        '. The static build ships the fallback HTML; props are embedded in the placeholder, so keep them small and non-secret.',
      ),
      codeBlock('src/blog/[slug].ht.js', pageSnippet, 'javascript'),
      h2('3. Add the client loader'),
      p(
        'A tiny script fetches each rendered fragment and swaps it in. It goes through the normal asset pipeline, so a plain ',
        code('src/islands.js'),
        ' entry is all you need:',
      ),
      codeBlock('src/islands.js', loaderSnippet, 'javascript'),
      p(
        'In dev this already works — ',
        code('sitelo dev'),
        ' serves islands at ',
        code('/_sitelo/islands/<name>'),
        ' straight from ',
        code('src/islands/'),
        '.',
      ),
      h2('Production'),
      p(
        'Your static host keeps serving the pages. Mount a small handler wherever you run server code — Node, serverless, or an edge function — and it renders the same island modules. For a full walkthrough with a runnable Node host, see the ',
        a({ href: '/examples/islands' }, 'Server islands example'),
        '.',
      ),
      codeBlock('islands-function.js', serverSnippet, 'javascript'),
      p(
        'On plain Node http or express, use ',
        code('createIslandsNodeHandler(options)'),
        ' instead — same options, ',
        code('(req, res, next)'),
        ' signature. If the loader fetches from a different origin or path, pass ',
        code("mountIslands({ endpoint: 'https://api.example.com/islands' })"),
        ' and match it with the handler\u2019s ',
        code('endpoint'),
        ' option.',
      ),
      h2('Good to know'),
      ul(
        { class: 'docs-list' },
        li(
          'No island endpoint deployed? The fallback HTML simply stays — pages degrade gracefully.',
        ),
        li(
          'Requests are ',
          code('GET'),
          ' with props in the query string, so responses are cacheable — set the handler\u2019s ',
          code('cacheControl'),
          ' option if you want a CDN to hold fragments briefly.',
        ),
        li(
          'While loading, the placeholder carries ',
          code('data-sitelo-island-state="loading"'),
          ' (then ',
          code('loaded'),
          ' or ',
          code('error'),
          ') — handy for CSS.',
        ),
      ),
    ],
  })
