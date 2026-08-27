/**
 * Code samples for the CLI page — shell transcripts whose comments are
 * translated per locale.
 */
const T = {
  en: {
    sameAsDev: 'same as sitelo dev',
    devServer: 'development server',
    prodBuild: 'production build',
    previewBuild: 'preview the production build',
  },
  es: {
    sameAsDev: 'igual que sitelo dev',
    devServer: 'servidor de desarrollo',
    prodBuild: 'compilación de producción',
    previewBuild: 'previsualiza la compilación de producción',
  },
}

export function cliSnippets(lang = 'en') {
  const t = T[lang] ?? T.en

  return {
    commands: `sitelo              # ${t.sameAsDev}
sitelo dev          # ${t.devServer}
sitelo build        # ${t.prodBuild}
sitelo preview      # ${t.previewBuild}`,

    flags: `sitelo --port 8888
sitelo build --outDir public --emptyOutDir
sitelo --root docs`,
  }
}
