/**
 * Code samples for the Data loading page.
 */
const T = {
  en: { standardFetchOptions: 'standard fetch options' },
  es: { standardFetchOptions: 'opciones estándar de fetch' },
  fr: {
    standardFetchOptions: 'options fetch standard',
  },
  de: {
    standardFetchOptions: 'übliche fetch-Optionen',
  },
  ru: {
    standardFetchOptions: 'обычные параметры fetch',
  },
  zh: {
    standardFetchOptions: '标准 fetch 选项',
  },
  pt: {
    standardFetchOptions: 'opções normais do fetch',
  },
}

export function dataSnippets(lang = 'en') {
  const t = T[lang] ?? T.en

  return {
    dataTemplate: `export async function data({ params, dev }) {
  const res = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
  return await res.json()
}

export default ({ data }) => \`
  <html><body>
    <h1>\${data.title}</h1>
    \${data.body}
  </body></html>
\``,

    dataHt: `import { html, body, h1 } from 'javascript-to-html'

export async function data({ params, dev }) {
  const res = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
  return await res.json()
}

export default ({ data }) =>
  html(
    body(
      h1(data.title),
      data.body,
    ),
  )`,

    dataJsx: `export async function data({ params, dev }) {
  const res = await fetch(\`https://api.example.com/posts/\${params.slug}\`)
  return await res.json()
}

export default function Post({ data }) {
  return (
    <html>
      <body>
        <h1>{data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.body }} />
      </body>
    </html>
  )
}`,

    jsonTree: `data/
├─ site.json
└─ posts/
   ├─ hello-world.json
   └─ why-static.json`,

    jsonCollection: `import { readJsonCollection } from 'sitelo/data'

const posts = () => readJsonCollection('data/posts', { sort: '-date' })

export async function generateStaticParams() {
  return (await posts()).map((post) => ({ slug: post.slug }))
}

export async function data({ params }) {
  return (await posts()).find((post) => post.slug === params.slug)
}

export default ({ data }) => \`
  <html><body>
    <h1>\${data.title}</h1>
    <time datetime="\${data.date}">\${data.date}</time>
    \${data.body}
  </body></html>
\``,

    jsonSources: `// data/posts/hello-world.json  ->  { slug: 'hello-world', ... }
await readJsonCollection('data/posts')

// data/posts.json: [{ "slug": "hello-world", ... }]
// data/posts.json: { "hello-world": { ... } }
await readJsonCollection('data/posts.json')

// data/site.json
await readJson('data/site.json')`,

    cache: `import { fetchWithCache } from 'sitelo'

export async function data({ params }) {
  const res = await fetchWithCache(
    \`https://api.example.com/posts/\${params.slug}\`,
    { /* ${t.standardFetchOptions} */ },
    { maxAge: 3600 }
  )
  return { post: await res.json() }
}`,
  }
}
