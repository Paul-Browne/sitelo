/**
 * Code samples for the Routing page.
 *
 * Shared verbatim by every locale — these snippets are pure code, with no
 * prose comments or display text to translate.
 */

export const structure = `src/
  index.ht.js              → /
  about.ht.js              → /about
  blog/
    index.ht.js            → /blog
    [slug].ht.js           → /blog/:slug
  docs/
    [...path]?.ht.js       → /docs, /docs/a, /docs/a/b, ...
  (admin)/
    users.ht.js            → /users
  404.ht.js                → dist/404.html`

export const paramsTemplate = `export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'my-first-post' },
  ]
}

export default ({ params }) => \`
  <html><body><h1>\${params.slug}</h1></body></html>
\``

export const paramsHt = `import { html, body, h1 } from 'javascript-to-html'

export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'my-first-post' },
  ]
}

export default ({ params }) =>
  html(
    body(h1(params.slug))
  )`

export const paramsJsx = `export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'my-first-post' },
  ]
}

export default function Post({ params }) {
  return (
    <html>
      <body>
        <h1>{params.slug}</h1>
      </body>
    </html>
  )
}`
