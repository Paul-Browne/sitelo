/**
 * Code samples for the Getting started page.
 */
const T = {
  en: {
    myWebsite: 'My website',
    helloWorld: 'Hello world',
    devServer: 'dev server',
    writeDist: 'write dist/',
    previewBuild: 'preview the build',
  },
  es: {
    myWebsite: 'Mi sitio web',
    helloWorld: 'Hola mundo',
    devServer: 'servidor de desarrollo',
    writeDist: 'escribe dist/',
    previewBuild: 'previsualiza la compilación',
  },
  fr: {
    myWebsite: 'Mon site web',
    helloWorld: 'Bonjour le monde',
    devServer: 'serveur de développement',
    writeDist: 'écrit dist/',
    previewBuild: 'prévisualise le build',
  },
  de: {
    myWebsite: 'Meine Website',
    helloWorld: 'Hallo Welt',
    devServer: 'Entwicklungsserver',
    writeDist: 'schreibt dist/',
    previewBuild: 'Build ansehen',
  },
}

export function gettingStartedSnippets(lang = 'en') {
  const t = T[lang] ?? T.en
  const htmlLang = T[lang] ? lang : 'en'

  return {
    install: `npm install -D sitelo`,

    pageTemplate: `export default () => \`
  <html lang="${htmlLang}">
    <head><title>${t.myWebsite}</title></head>
    <body><h1>${t.helloWorld}</h1></body>
  </html>
\``,

    pageHt: `import { html, head, title, body, h1 } from 'javascript-to-html'

export default () =>
  html({ lang: '${htmlLang}' },
    head(title('${t.myWebsite}')),
    body(h1('${t.helloWorld}'))
  )`,

    pageJsx: `export default function Home() {
  return (
    <html lang="${htmlLang}">
      <head><title>${t.myWebsite}</title></head>
      <body><h1>${t.helloWorld}</h1></body>
    </html>
  )
}`,

    run: `sitelo          # ${t.devServer}
sitelo build    # ${t.writeDist}
sitelo preview  # ${t.previewBuild}`,
  }
}
