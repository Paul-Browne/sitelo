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
