/**
 * Code samples for the Assets & styling page.
 */
const T = {
  en: {
    pageReturnsHtml: 'page — returns HTML',
    linkedBundled: 'linked from HTML → bundled',
    importedBundled: 'imported by main.js → bundled too',
    dataOnly: 'only used in data() → never ships',
    copiedAsIs: 'copied as-is',
    mySite: 'My site',
    hello: 'Hello',
  },
  es: {
    pageReturnsHtml: 'página — devuelve HTML',
    linkedBundled: 'enlazado desde el HTML → empaquetado',
    importedBundled: 'importado por main.js → también empaquetado',
    dataOnly: 'solo se usa en data() → nunca se publica',
    copiedAsIs: 'copiado tal cual',
    mySite: 'Mi sitio',
    hello: 'Hola',
  },
}

export function assetsSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = lang === 'es' ? 'es' : 'en'

  return {
    layout: `my-site/
  src/
    index.ht.js          # ${t.pageReturnsHtml}
    css/
      styles.css         # ${t.linkedBundled}
    js/
      main.js            # ${t.linkedBundled}
      counter.ts         # ${t.importedBundled}
    lib/
      posts.js           # ${t.dataOnly}
  public/
    favicon.ico          # ${t.copiedAsIs}`,

    pageTemplate: `export default () => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.mySite}</title>
      <link rel="stylesheet" href="/css/styles.css">
      <script type="module" src="/js/main.js"></script>
    </head>
    <body>
      <h1>${t.hello}</h1>
      <button id="count">0</button>
    </body>
  </html>
\``,

    pageHt: `import { html, head, title, link, script, body, h1, button } from 'javascript-to-html'

export default () =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.mySite}'),
      link({ rel: 'stylesheet', href: '/css/styles.css' }),
      script({ type: 'module', src: '/js/main.js' }),
    ),
    body(
      h1('${t.hello}'),
      button({ id: 'count' }, '0'),
    ),
  )`,

    pageJsx: `export default function Home() {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.mySite}</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <script type="module" src="/js/main.js" />
      </head>
      <body>
        <h1>${t.hello}</h1>
        <button id="count">0</button>
      </body>
    </html>
  )
}`,

    js: `import { createCounter } from './counter.ts'

const button = document.querySelector('#count')
const next = createCounter()

button.addEventListener('click', () => {
  button.textContent = String(next())
})`,

    css: `@import './tokens.css';

body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 2rem;
}`,

    warn: `export default {
  missingAssets: 'warn',
}`,
  }
}
