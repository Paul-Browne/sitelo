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
    auditBuild: 'audit the production build',
  },
  es: {
    sameAsDev: 'igual que sitelo dev',
    devServer: 'servidor de desarrollo',
    prodBuild: 'compilación de producción',
    previewBuild: 'previsualiza la compilación de producción',
    auditBuild: 'audita la compilación de producción',
  },
  fr: {
    sameAsDev: 'identique à sitelo dev',
    devServer: 'serveur de développement',
    prodBuild: 'build de production',
    previewBuild: 'prévisualise le build de production',
    auditBuild: 'audite le build de production',
  },
  de: {
    sameAsDev: 'wie sitelo dev',
    devServer: 'Entwicklungsserver',
    prodBuild: 'Produktions-Build',
    previewBuild: 'Produktions-Build ansehen',
    auditBuild: 'Produktions-Build auditieren',
  },
  ru: {
    sameAsDev: 'то же, что sitelo dev',
    devServer: 'сервер разработки',
    prodBuild: 'продакшн-сборка',
    previewBuild: 'просмотр продакшн-сборки',
    auditBuild: 'аудит продакшн-сборки',
  },
  zh: {
    sameAsDev: '等同于 sitelo dev',
    devServer: '开发服务器',
    prodBuild: '生产构建',
    previewBuild: '预览生产构建',
    auditBuild: '审计生产构建',
  },
  pt: {
    sameAsDev: 'o mesmo que sitelo dev',
    devServer: 'servidor de desenvolvimento',
    prodBuild: 'compilação de produção',
    previewBuild: 'pré-visualiza a compilação de produção',
    auditBuild: 'audita a compilação de produção',
  },
}

export function cliSnippets(lang = 'en') {
  const t = T[lang] ?? T.en

  return {
    commands: `sitelo              # ${t.sameAsDev}
sitelo dev          # ${t.devServer}
sitelo build        # ${t.prodBuild}
sitelo preview      # ${t.previewBuild}
sitelo lighthouse   # ${t.auditBuild}`,

    flags: `sitelo --port 8888
sitelo build --outDir public --emptyOutDir
sitelo --root docs`,
  }
}
