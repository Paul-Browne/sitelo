import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'

const islandModuleSnippet = `export default async function comments({ props, request }) {
  const comments = await fetchComments(props.postId)
  return \`<ul>\${comments.map((c) => \`<li>\${c.text}</li>\`).join('')}</ul>\`
}`

const pageTemplate = `import { island } from 'sitelo/islands'

export default ({ params }) => \`
  <html>
    <body>
      <article>…static content…</article>
      \${island('comments', { postId: params.slug }, '<p>Loading comments…</p>')}
      <script type="module" src="/islands.js"></script>
    </body>
  </html>
\``

const strategySnippet = `// Load as soon as the page does — the default.
island('cart', { id }, '<p>…</p>')

// Wait for an idle callback.
island('recommendations', { id }, '<p>…</p>', { when: 'idle' })

// Wait until it scrolls into view.
island('comments', { postId }, '<p>Loading comments…</p>', {
  when: 'visible',
  rootMargin: '400px',   // start loading 400px early
})`

const mountOptionsSnippet = `mountIslands({
  timeout: 5000,        // per-island; 0 disables. Default 10000
  rootMargin: '300px',  // default for \`when: 'visible'\` islands
})`

const forgedSnippet = `GET /_sitelo/islands/profile?props={"userId":"someone-else"}`

const secretSnippet = `SITELO_ISLANDS_SECRET=$(openssl rand -hex 32) sitelo build`

const configureSnippet = `import { configureIslands } from 'sitelo/islands'

configureIslands({ secret: process.env.MY_SECRET })`

const pageHt = `import { html, body, article, script } from 'javascript-to-html'
import { island } from 'sitelo/islands'

export default ({ params }) =>
  html(
    body(
      article('…static content…'),
      island('comments', { postId: params.slug }, '<p>Loading comments…</p>'),
      script({ type: 'module', src: '/islands.js' }),
    ),
  )`

const pageJsx = `import { island } from 'sitelo/islands'

export default function Post({ params }) {
  return (
    <html>
      <body>
        <article>…static content…</article>
        {island('comments', { postId: params.slug }, '<p>Loading comments…</p>')}
        <script type="module" src="/islands.js" />
      </body>
    </html>
  )
}`

const loaderSnippet = `import { mountIslands } from 'sitelo/islands/client'

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
        'Sometimes one region of an otherwise-static page needs fresh, per-request data — comments under a cached blog post, a stock badge on a product page. Server islands keep the page static and render just that region on a server when the page is viewed.',
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
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: pageTemplate,
        ht: pageHt,
        jsx: pageJsx,
      }),
      h2('3. Add the client loader'),
      p(
        'A tiny script fetches each rendered fragment and swaps it in. It goes through the normal asset pipeline, so a plain ',
        code('src/islands.js'),
        ' entry is all you need:',
      ),
      codeBlock('src/islands.js', loaderSnippet, 'javascript'),
      p(
        'In ',
        code('sitelo'),
        ' (dev) and ',
        code('sitelo preview'),
        ' this already works — both serve islands at ',
        code('/_sitelo/islands/<name>'),
        ' from ',
        code('src/islands/'),
        '. Preview loads native ',
        code('.js'),
        ' / ',
        code('.mjs'),
        ' modules (same as a Node host); TypeScript islands are supported in dev via Vite.',
      ),
      h2('Production'),
      p(
        'Your static host keeps serving the pages. Mount a small handler wherever you run server code — Node, serverless, or an edge function — and it renders the same island modules. For a full walkthrough with a runnable Node host plus Netlify and Vercel stubs, see the ',
        a({ href: '/examples/islands' }, 'Server islands example'),
        '.',
      ),
      codeBlock('islands-function.js', serverSnippet, 'javascript'),
      p(
        'On plain Node http or express, use ',
        code('createIslandsNodeHandler(options)'),
        ' instead — same options, ',
        code('(req, res, next)'),
        ' signature. Auto-wire every ',
        code('.js'),
        ' / ',
        code('.mjs'),
        ' module under ',
        code('src/islands/'),
        ' with ',
        code('createIslandsFromDirectory'),
        '. If the loader fetches from a different origin or path, pass ',
        code("mountIslands({ endpoint: 'https://api.example.com/islands' })"),
        ' and match it with the handler\u2019s ',
        code('endpoint'),
        ' option.',
      ),
      h2('Stability checklist'),
      ul(
        { class: 'docs-list' },
        li(
          code('island()'),
          ' / ',
          code('mountIslands()'),
          ' / ',
          code('createIslandsHandler'),
          ' / ',
          code('createIslandsNodeHandler'),
          ' — public API, treated as stable',
        ),
        li(
          code('sitelo'),
          ' and ',
          code('sitelo preview'),
          ' both serve ',
          code('/_sitelo/islands'),
          ' from ',
          code('src/islands/'),
        ),
        li(
          code('createIslandsFromDirectory'),
          ' — same map for Node hosts and preview (native ',
          code('.js'),
          ' / ',
          code('.mjs'),
          ' / ',
          code('.cjs'),
          ')',
        ),
        li(
          'Host stubs in ',
          a({ href: '/examples/islands' }, 'examples/islands'),
          ': Node ',
          code('server.js'),
          ', Netlify function + rewrite, Vercel serverless + rewrite',
        ),
        li(
          'Props stay small and non-secret (GET query string) — intentional; fetch secrets inside the island on the server',
        ),
        li(
          'Props are client-supplied — validate them, or sign them with ',
          code('SITELO_ISLANDS_SECRET'),
        ),
      ),
      h2('Loading strategies'),
      p(
        'By default every island fetches as soon as the page loads, so a page with eight islands makes eight simultaneous requests during first paint. Pass ',
        code('when'),
        ' to defer the ones that are not immediately visible.',
      ),
      codeBlock('islands-when', strategySnippet, 'js'),
      ul(
        { class: 'docs-list' },
        li(code("'load'"), ' (default) — immediately, alongside every other island'),
        li(code("'idle'"), ' — on ', code('requestIdleCallback'), ' (falls back to a timeout)'),
        li(code("'visible'"), ' — when it scrolls into view, via IntersectionObserver'),
      ),
      p(
        code('rootMargin'),
        ' applies to ',
        code("'visible'"),
        ' only and defaults to ',
        code("'200px'"),
        '. Islands also time out rather than spinning forever:',
      ),
      codeBlock('islands-mount-options', mountOptionsSnippet, 'js'),
      p(
        code('mountIslands()'),
        ' resolves once the immediate islands have settled — deferred ones load later on their own and are deliberately not awaited. A failed or timed-out island keeps its fallback HTML.',
      ),
      h2('Props are untrusted input'),
      p(
        'Island props are client-supplied. They are embedded in the page, sent back on the request, and anyone can edit them first:',
      ),
      codeBlock('islands-forged', forgedSnippet, 'http'),
      p(
        'Treat the props your island receives exactly like a query parameter — validate them, and never use them to look up data the viewer is not already entitled to see.',
      ),
      p(
        'When props select privileged data, sign them. Set a secret and sitelo signs each placeholder at build time, rejecting anything else with a ',
        code('403'),
        ':',
      ),
      codeBlock('islands-secret', secretSnippet, 'bash'),
      p(
        'The same variable is read by ',
        code('sitelo'),
        ', ',
        code('sitelo preview'),
        ', and ',
        code('createIslandsHandler'),
        ', so dev, preview and production agree. Give your production host the same secret. Prefer to set it in code?',
      ),
      codeBlock('islands-configure', configureSnippet, 'js'),
      p(
        'Signatures are HMAC-SHA256 over the island name and its props, so a signature issued for one island cannot be replayed against another. Signing proves the props came from your build — it does not hide them, so they must still be non-secret. Without a secret, props are accepted as-is and validating them is entirely your island module\u2019s job.',
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
