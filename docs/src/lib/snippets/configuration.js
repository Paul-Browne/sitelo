/**
 * Code samples for the Configuration page.
 */
const T = {
  en: {
    myBlog: 'My Blog',
    latestPosts: 'Latest posts',
    viteOnly: 'Vite options only; sitelo still injects the plugin',
    registerPlugin: 'Register the plugin yourself',
    linkCheckModes: "'warn' (default), 'error', or an options object",
    failBuild: 'fail the build on a dead link',
    verifyFragments: 'also verify #fragment targets',
    hideToolbar: 'hide for everyone on this project',
    brokenLinks: 'broken internal links',
    escapesOutDir: 'escapes the output directory',
    noSuchPage: 'no such page',
    mySite: 'My site',
    home: 'Home',
    hello: 'Hello',
    onlyIndexed: 'Only this region is indexed.',
    indexAfterBuild:
      'Index only exists after `sitelo build` (synced to public/pagefind by default)',
    thenPreview: 'then: sitelo preview — or sitelo (dev) using public/pagefind',
  },
  es: {
    myBlog: 'Mi blog',
    latestPosts: 'Últimas entradas',
    viteOnly: 'Solo opciones de Vite; sitelo sigue inyectando el plugin',
    registerPlugin: 'Registra el plugin tú mismo',
    linkCheckModes: "'warn' (por defecto), 'error', o un objeto de opciones",
    failBuild: 'falla la compilación si hay un enlace roto',
    verifyFragments: 'verifica también los destinos #fragmento',
    hideToolbar: 'ocúltala para todo el mundo en este proyecto',
    brokenLinks: 'enlaces internos rotos',
    escapesOutDir: 'se sale del directorio de salida',
    noSuchPage: 'no existe esa página',
    mySite: 'Mi sitio',
    home: 'Inicio',
    hello: 'Hola',
    onlyIndexed: 'Solo se indexa esta región.',
    indexAfterBuild:
      'El índice solo existe tras `sitelo build` (se sincroniza a public/pagefind por defecto)',
    thenPreview:
      'luego: sitelo preview — o sitelo (dev) usando public/pagefind',
  },
}

export function configurationSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = lang === 'es' ? 'es' : 'en'

  return {
    config: `export default {
  site: 'https://example.com',
  rss: {
    site: 'https://example.com',
    title: '${t.myBlog}',
    description: '${t.latestPosts}',
    routePrefix: '/blog',
  },
  vite: {
    publicDir: 'static',
    build: {
      emptyOutDir: true,
      outDir: 'public',
    },
    server: {
      port: 8888,
    },
  },
}`,

    viteOnly: `// ${t.viteOnly}
export default {
  publicDir: 'static',
  server: { port: 8888 },
}`,

    vitePlugin: `// ${t.registerPlugin}
import htmlPages from 'sitelo'

export default {
  plugins: [htmlPages({
    site: 'https://example.com',
  })],
}`,

    rss: `export default {
  rss: {
    site: 'https://example.com',
    title: '${t.myBlog}',
    description: '${t.latestPosts}',
    routePrefix: '/blog',
  },
}`,

    devToolbarOff: `// sitelo.config.js
export default {
  devToolbar: false, // ${t.hideToolbar}
}`,

    linkCheck: `export default {
  linkCheck: true,   // ${t.linkCheckModes}
}`,

    linkCheckOptions: `export default {
  linkCheck: {
    mode: 'error',                    // ${t.failBuild}
    checkFragments: true,             // ${t.verifyFragments}
    exclude: ['/api/**', /^\\/legacy\\//],
  },
}`,

    linkCheckOutput: `[sitelo] 3 ${t.brokenLinks}

  index.html
    ../escape           -> ${t.escapesOutDir}
    /abuot              -> ${t.noSuchPage}
    /blog/missing-post  -> ${t.noSuchPage}`,

    pagefind: `export default {
  pagefind: true,
}`,

    installPagefind: `npm install -D pagefind`,

    pagefindPageTemplate: `export default () => \`
  <html lang="${htmlLang}">
    <head>
      <title>${t.mySite}</title>
      <link rel="stylesheet" href="/styles.css">
      <script type="module" src="/main.js"></script>
    </head>
    <body>
      <header>
        <a href="/">${t.home}</a>
        <div id="search"></div>
      </header>
      <main data-pagefind-body>
        <h1>${t.hello}</h1>
        <p>${t.onlyIndexed}</p>
      </main>
    </body>
  </html>
\``,

    pagefindPageHt: `import {
  html, head, title, link, script, body, header, a, div, main, h1, p,
} from 'javascript-to-html'

export default () =>
  html({ lang: '${htmlLang}' },
    head(
      title('${t.mySite}'),
      link({ rel: 'stylesheet', href: '/styles.css' }),
      script({ type: 'module', src: '/main.js' }),
    ),
    body(
      header(
        a({ href: '/' }, '${t.home}'),
        div({ id: 'search' }),
      ),
      main({ 'data-pagefind-body': '' },
        h1('${t.hello}'),
        p('${t.onlyIndexed}'),
      ),
    ),
  )`,

    pagefindPageJsx: `export default function Home() {
  return (
    <html lang="${htmlLang}">
      <head>
        <title>${t.mySite}</title>
        <link rel="stylesheet" href="/styles.css" />
        <script type="module" src="/main.js" />
      </head>
      <body>
        <header>
          <a href="/">${t.home}</a>
          <div id="search" />
        </header>
        <main data-pagefind-body="">
          <h1>${t.hello}</h1>
          <p>${t.onlyIndexed}</p>
        </main>
      </body>
    </html>
  )
}`,

    pagefindMain: `async function initSearch() {
  const mount = document.querySelector('#search')
  if (!mount) return

  // ${t.indexAfterBuild}
  try {
    const probe = await fetch('/pagefind/pagefind-ui.js', { method: 'HEAD' })
    if (!probe.ok) return
  } catch {
    return
  }

  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = '/pagefind/pagefind-ui.css'
  document.head.appendChild(style)

  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })

  new window.PagefindUI({
    element: '#search',
    showImages: false,
  })
}

initSearch()`,

    pagefindBuild: `sitelo build
# ${t.thenPreview}`,

    pagefindGitignore: `public/pagefind/`,
  }
}
