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
    clientScript: 'what the pages load with a <script src>',
    anythingElse: 'and anything else knip accepts',
  },
  es: {
    sameAsDev: 'igual que sitelo dev',
    devServer: 'servidor de desarrollo',
    prodBuild: 'compilación de producción',
    previewBuild: 'previsualiza la compilación de producción',
    auditBuild: 'audita la compilación de producción',
    clientScript: 'lo que las páginas cargan con un <script src>',
    anythingElse: 'y cualquier otra opción que knip acepte',
  },
  fr: {
    sameAsDev: 'identique à sitelo dev',
    devServer: 'serveur de développement',
    prodBuild: 'build de production',
    previewBuild: 'prévisualise le build de production',
    auditBuild: 'audite le build de production',
    clientScript: 'ce que les pages chargent via un <script src>',
    anythingElse: 'et toute autre option acceptée par knip',
  },
  de: {
    sameAsDev: 'wie sitelo dev',
    devServer: 'Entwicklungsserver',
    prodBuild: 'Produktions-Build',
    previewBuild: 'Produktions-Build ansehen',
    auditBuild: 'Produktions-Build auditieren',
    clientScript: 'was die Seiten per <script src> laden',
    anythingElse: 'und alles andere, was knip akzeptiert',
  },
  ru: {
    sameAsDev: 'то же, что sitelo dev',
    devServer: 'сервер разработки',
    prodBuild: 'продакшн-сборка',
    previewBuild: 'просмотр продакшн-сборки',
    auditBuild: 'аудит продакшн-сборки',
    clientScript: 'то, что страницы подключают через <script src>',
    anythingElse: 'и любые другие настройки knip',
  },
  zh: {
    sameAsDev: '等同于 sitelo dev',
    devServer: '开发服务器',
    prodBuild: '生产构建',
    previewBuild: '预览生产构建',
    auditBuild: '审计生产构建',
    clientScript: '页面通过 <script src> 加载的脚本',
    anythingElse: '以及 knip 接受的其他任何选项',
  },
  pt: {
    sameAsDev: 'o mesmo que sitelo dev',
    devServer: 'servidor de desenvolvimento',
    prodBuild: 'compilação de produção',
    previewBuild: 'pré-visualiza a compilação de produção',
    auditBuild: 'audita a compilação de produção',
    clientScript: 'o que as páginas carregam com um <script src>',
    anythingElse: 'e qualquer outra opção que o knip aceite',
  },
  it: {
    sameAsDev: 'come sitelo dev',
    devServer: 'server di sviluppo',
    prodBuild: 'build di produzione',
    previewBuild: 'anteprima della build di produzione',
    auditBuild: 'analizza la build di produzione',
    clientScript: 'ciò che le pagine caricano con uno <script src>',
    anythingElse: 'e qualunque altra cosa knip accetti',
  },
  pl: {
    sameAsDev: 'to samo co sitelo dev',
    devServer: 'serwer deweloperski',
    prodBuild: 'build produkcyjny',
    previewBuild: 'podgląd buildu produkcyjnego',
    auditBuild: 'audyt buildu produkcyjnego',
    clientScript: 'to, co strony ładują przez <script src>',
    anythingElse: 'i cokolwiek innego, co knip przyjmie',
  },
  tr: {
    sameAsDev: 'sitelo dev ile aynı',
    devServer: 'geliştirme sunucusu',
    prodBuild: 'üretim derlemesi',
    previewBuild: 'üretim derlemesini önizle',
    auditBuild: 'üretim derlemesini denetle',
    clientScript: 'sayfaların <script src> ile yüklediği şey',
    anythingElse: 've knip’in kabul ettiği her şey',
  },
  id: {
    sameAsDev: 'sama seperti sitelo dev',
    devServer: 'server pengembangan',
    prodBuild: 'build produksi',
    previewBuild: 'pratinjau build produksi',
    auditBuild: 'audit build produksi',
    clientScript: 'yang dimuat halaman lewat <script src>',
    anythingElse: 'dan apa pun lain yang diterima knip',
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

    knipInstall: 'npm install -D knip',

    knip: `import { knipConfig } from 'sitelo/knip'

export default knipConfig()`,

    knipRun: 'npx knip',

    knipEntry: `export default knipConfig({
  entry: ['src/js/app.js!'], // ${t.clientScript}
  ignore: ['legacy/**'], // ${t.anythingElse}
})`,
  }
}
