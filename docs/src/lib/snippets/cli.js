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
  fr: {
    sameAsDev: 'identique à sitelo dev',
    devServer: 'serveur de développement',
    prodBuild: 'build de production',
    previewBuild: 'prévisualise le build de production',
  },
  de: {
    sameAsDev: 'wie sitelo dev',
    devServer: 'Entwicklungsserver',
    prodBuild: 'Produktions-Build',
    previewBuild: 'Produktions-Build ansehen',
  },
  ru: {
    sameAsDev: 'то же, что sitelo dev',
    devServer: 'сервер разработки',
    prodBuild: 'продакшн-сборка',
    previewBuild: 'просмотр продакшн-сборки',
  },
  zh: {
    sameAsDev: '等同于 sitelo dev',
    devServer: '开发服务器',
    prodBuild: '生产构建',
    previewBuild: '预览生产构建',
  },
  pt: {
    sameAsDev: 'o mesmo que sitelo dev',
    devServer: 'servidor de desenvolvimento',
    prodBuild: 'compilação de produção',
    previewBuild: 'pré-visualiza a compilação de produção',
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
