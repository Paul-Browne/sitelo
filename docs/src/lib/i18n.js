/**
 * Locale registry for the docs site.
 *
 * English lives at the root (`/docs/routing`), every other locale under its
 * own prefix (`/es/docs/routing`, `/fr/...`, `/de/...`). Page files mirror
 * that: `src/docs/routing.ht.js` and `src/<locale>/docs/routing.ht.js`.
 */

export const DEFAULT_LOCALE = 'en'
export const LOCALES = ['en', 'es', 'fr', 'de', 'ru', 'zh', 'pt']

/** Locales served from a URL prefix — everything but the default. */
const PREFIXED = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)

/** Display names for the language switcher, in each language's own words. */
export const LOCALE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  zh: '简体中文',
  pt: 'Português',
}

/**
 * BCP 47 tags for `<html lang>` and `hreflang`.
 *
 * Not always the same as the URL prefix — Simplified Chinese is served from
 * `/zh` but tagged `zh-Hans`, which is what search engines and screen readers
 * want to see.
 */
export const LOCALE_TAGS = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  zh: 'zh-Hans',
  pt: 'pt-PT',
}

/**
 * Flags for the language switcher.
 *
 * Flags are countries, not languages, so several of these are a choice rather
 * than a fact — English and Spanish especially. They are decorative here: the
 * language name beside them carries the meaning, and the flag is hidden from
 * assistive tech.
 */
export const LOCALE_FLAGS = {
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ru: '🇷🇺',
  zh: '🇨🇳',
  pt: '🇵🇹',
}

/** Open Graph locale identifiers. */
export const OG_LOCALES = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  ru: 'ru_RU',
  zh: 'zh_CN',
  pt: 'pt_PT',
}

/**
 * Root-relative paths that exist in every locale.
 *
 * Keyed by the English path. The language switcher and the `hreflang`
 * alternates are emitted only for these, so a path that gains a locale must
 * be listed here or the switcher will not offer it.
 */
export const TRANSLATED_PATHS = new Set([
  '/',
  '/about',
  '/docs',
  '/docs/pages',
  '/docs/routing',
  '/docs/data',
  '/docs/islands',
  '/docs/ui',
  '/docs/assets',
  '/docs/images',
  '/docs/typescript',
  '/docs/configuration',
  '/docs/cli',
  '/docs/deployment',
  '/docs/build-with-ai',
  '/examples',
  '/examples/basic',
  '/examples/todo',
  '/examples/blog',
  '/examples/json',
  '/examples/wordpress',
  '/examples/islands',
])

/** Strip any locale prefix, returning the canonical English path. */
export function basePath(path) {
  for (const locale of PREFIXED) {
    if (path === `/${locale}`) return '/'
    if (path.startsWith(`/${locale}/`)) return path.slice(locale.length + 1)
  }
  return path
}

/** Which locale a path is served under. */
export function localeOf(path) {
  for (const locale of PREFIXED) {
    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) return locale
  }
  return DEFAULT_LOCALE
}

/** Render a path in `lang`. `localePath('/docs', 'fr')` → `/fr/docs`. */
export function localePath(path, lang) {
  const base = basePath(path)
  if (lang === DEFAULT_LOCALE) return base
  return base === '/' ? `/${lang}` : `/${lang}${base}`
}

/** Does this path have a counterpart in every locale? */
export function isTranslated(path) {
  return TRANSLATED_PATHS.has(basePath(path))
}

/**
 * Chrome strings — nav, sidebar, code-block controls, footer.
 *
 * Page prose is not here: it lives in the page files themselves, one set per
 * locale under `src/` and `src/<locale>/`.
 */
const STRINGS = {
  en: {
    navDocs: 'Docs',
    navExamples: 'Examples',
    navUi: 'UI',
    navAbout: 'About',
    openMenu: 'Open menu',
    menu: 'Menu',
    languageLabel: 'Language',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    sidebarDocs: 'Documentation',
    sidebarExamples: 'Examples',
    sidebarUi: 'Components',
    titleSuffixDocs: 'sitelo docs',
    titleSuffixExamples: 'sitelo examples',
    titleSuffixUi: 'sitelo UI',
    tocLabel: 'On this page',
    pagenavLabel: 'Adjacent pages',
    previous: '← Previous',
    next: 'Next →',
    copy: 'Copy',
    copyCode: 'Copy code',
    copied: 'Copied',
    copyFailed: 'Failed',
    markupStyle: 'Markup style',
    templateLiteral: 'Template literal',
    recommended: 'recommended',
    licenseLabel: 'MIT license',
    nodeLabel: 'Requires Node 20.19 or newer',
    githubLabel: (version) => `sitelo ${version} on GitHub`,
    viteLabel: (version) => `Powered by Vite ${version}`,
    cookieLabel: 'Cookie consent',
    cookieText:
      'This site uses Google Analytics cookies to count visits. Nothing is stored unless you accept.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
    defaultDescription:
      'sitelo — static site generation for Vite. Write functions that return HTML.',
  },
  es: {
    navDocs: 'Documentación',
    navExamples: 'Ejemplos',
    navUi: 'UI',
    navAbout: 'Acerca de',
    openMenu: 'Abrir menú',
    menu: 'Menú',
    languageLabel: 'Idioma',
    themeToLight: 'Cambiar al tema claro',
    themeToDark: 'Cambiar al tema oscuro',
    sidebarDocs: 'Documentación',
    sidebarExamples: 'Ejemplos',
    sidebarUi: 'Componentes',
    titleSuffixDocs: 'documentación de sitelo',
    titleSuffixExamples: 'ejemplos de sitelo',
    titleSuffixUi: 'sitelo UI',
    tocLabel: 'En esta página',
    pagenavLabel: 'Páginas adyacentes',
    previous: '← Anterior',
    next: 'Siguiente →',
    copy: 'Copiar',
    copyCode: 'Copiar código',
    copied: 'Copiado',
    copyFailed: 'Error',
    markupStyle: 'Estilo de marcado',
    templateLiteral: 'Plantilla literal',
    recommended: 'recomendado',
    licenseLabel: 'Licencia MIT',
    nodeLabel: 'Requiere Node 20.19 o superior',
    githubLabel: (version) => `sitelo ${version} en GitHub`,
    viteLabel: (version) => `Con tecnología de Vite ${version}`,
    cookieLabel: 'Consentimiento de cookies',
    cookieText:
      'Este sitio usa cookies de Google Analytics para contar visitas. No se guarda nada si no aceptas.',
    cookieAccept: 'Aceptar',
    cookieDecline: 'Rechazar',
    defaultDescription:
      'sitelo — generación de sitios estáticos para Vite. Escribe funciones que devuelven HTML.',
  },
  fr: {
    navDocs: 'Documentation',
    navExamples: 'Exemples',
    navUi: 'UI',
    navAbout: 'À propos',
    openMenu: 'Ouvrir le menu',
    menu: 'Menu',
    languageLabel: 'Langue',
    themeToLight: 'Passer au thème clair',
    themeToDark: 'Passer au thème sombre',
    sidebarDocs: 'Documentation',
    sidebarExamples: 'Exemples',
    sidebarUi: 'Composants',
    titleSuffixDocs: 'docs sitelo',
    titleSuffixExamples: 'exemples sitelo',
    titleSuffixUi: 'sitelo UI',
    tocLabel: 'Sur cette page',
    pagenavLabel: 'Pages adjacentes',
    previous: '← Précédent',
    next: 'Suivant →',
    copy: 'Copier',
    copyCode: 'Copier le code',
    copied: 'Copié',
    copyFailed: 'Échec',
    markupStyle: 'Style de balisage',
    templateLiteral: 'Littéral de gabarit',
    recommended: 'recommandé',
    licenseLabel: 'Licence MIT',
    nodeLabel: 'Nécessite Node 20.19 ou plus récent',
    githubLabel: (version) => `sitelo ${version} sur GitHub`,
    viteLabel: (version) => `Propulsé par Vite ${version}`,
    cookieLabel: 'Consentement aux cookies',
    cookieText:
      'Ce site utilise des cookies Google Analytics pour compter les visites. Rien n’est enregistré sans votre accord.',
    cookieAccept: 'Accepter',
    cookieDecline: 'Refuser',
    defaultDescription:
      'sitelo — génération de sites statiques pour Vite. Écrivez des fonctions qui renvoient du HTML.',
  },
  de: {
    navDocs: 'Dokumentation',
    navExamples: 'Beispiele',
    navUi: 'UI',
    navAbout: 'Über',
    openMenu: 'Menü öffnen',
    menu: 'Menü',
    languageLabel: 'Sprache',
    themeToLight: 'Zum hellen Design wechseln',
    themeToDark: 'Zum dunklen Design wechseln',
    sidebarDocs: 'Dokumentation',
    sidebarExamples: 'Beispiele',
    sidebarUi: 'Komponenten',
    titleSuffixDocs: 'sitelo-Doku',
    titleSuffixExamples: 'sitelo-Beispiele',
    titleSuffixUi: 'sitelo UI',
    tocLabel: 'Auf dieser Seite',
    pagenavLabel: 'Benachbarte Seiten',
    previous: '← Zurück',
    next: 'Weiter →',
    copy: 'Kopieren',
    copyCode: 'Code kopieren',
    copied: 'Kopiert',
    copyFailed: 'Fehler',
    markupStyle: 'Markup-Stil',
    templateLiteral: 'Template-Literal',
    recommended: 'empfohlen',
    licenseLabel: 'MIT-Lizenz',
    nodeLabel: 'Erfordert Node 20.19 oder neuer',
    githubLabel: (version) => `sitelo ${version} auf GitHub`,
    viteLabel: (version) => `Mit Vite ${version}`,
    cookieLabel: 'Cookie-Zustimmung',
    cookieText:
      'Diese Website nutzt Google-Analytics-Cookies, um Besuche zu zählen. Ohne deine Zustimmung wird nichts gespeichert.',
    cookieAccept: 'Akzeptieren',
    cookieDecline: 'Ablehnen',
    defaultDescription:
      'sitelo — statische Website-Generierung für Vite. Schreibe Funktionen, die HTML zurückgeben.',
  },
  ru: {
    navDocs: 'Документация',
    navExamples: 'Примеры',
    navUi: 'UI',
    navAbout: 'О проекте',
    openMenu: 'Открыть меню',
    menu: 'Меню',
    languageLabel: 'Язык',
    themeToLight: 'Переключить на светлую тему',
    themeToDark: 'Переключить на тёмную тему',
    sidebarDocs: 'Документация',
    sidebarExamples: 'Примеры',
    sidebarUi: 'Компоненты',
    titleSuffixDocs: 'документация sitelo',
    titleSuffixExamples: 'примеры sitelo',
    titleSuffixUi: 'sitelo UI',
    tocLabel: 'На этой странице',
    pagenavLabel: 'Соседние страницы',
    previous: '← Назад',
    next: 'Вперёд →',
    copy: 'Копировать',
    copyCode: 'Копировать код',
    copied: 'Скопировано',
    copyFailed: 'Ошибка',
    markupStyle: 'Стиль разметки',
    templateLiteral: 'Шаблонная строка',
    recommended: 'рекомендуется',
    licenseLabel: 'Лицензия MIT',
    nodeLabel: 'Требуется Node 20.19 или новее',
    githubLabel: (version) => `sitelo ${version} на GitHub`,
    viteLabel: (version) => `Работает на Vite ${version}`,
    cookieLabel: 'Согласие на cookie',
    cookieText:
      'Этот сайт использует cookie Google Analytics для подсчёта посещений. Без вашего согласия ничего не сохраняется.',
    cookieAccept: 'Принять',
    cookieDecline: 'Отклонить',
    defaultDescription:
      'sitelo — генерация статических сайтов для Vite. Пишите функции, которые возвращают HTML.',
  },
  zh: {
    navDocs: '文档',
    navExamples: '示例',
    navUi: 'UI',
    navAbout: '关于',
    openMenu: '打开菜单',
    menu: '菜单',
    languageLabel: '语言',
    themeToLight: '切换到浅色主题',
    themeToDark: '切换到深色主题',
    sidebarDocs: '文档',
    sidebarExamples: '示例',
    sidebarUi: '组件',
    titleSuffixDocs: 'sitelo 文档',
    titleSuffixExamples: 'sitelo 示例',
    titleSuffixUi: 'sitelo UI',
    tocLabel: '本页内容',
    pagenavLabel: '相邻页面',
    previous: '← 上一页',
    next: '下一页 →',
    copy: '复制',
    copyCode: '复制代码',
    copied: '已复制',
    copyFailed: '失败',
    markupStyle: '标记风格',
    templateLiteral: '模板字符串',
    recommended: '推荐',
    licenseLabel: 'MIT 许可证',
    nodeLabel: '需要 Node 20.19 或更高版本',
    githubLabel: (version) => `GitHub 上的 sitelo ${version}`,
    viteLabel: (version) => `由 Vite ${version} 驱动`,
    cookieLabel: 'Cookie 同意',
    cookieText:
      '本站使用 Google Analytics cookie 统计访问量。未经同意不会存储任何内容。',
    cookieAccept: '接受',
    cookieDecline: '拒绝',
    defaultDescription:
      'sitelo — 面向 Vite 的静态站点生成。编写返回 HTML 的函数。',
  },
  pt: {
    navDocs: 'Docs',
    navExamples: 'Exemplos',
    navUi: 'UI',
    navAbout: 'Acerca',
    openMenu: 'Abrir menu',
    menu: 'Menu',
    languageLabel: 'Idioma',
    themeToLight: 'Mudar para o tema claro',
    themeToDark: 'Mudar para o tema escuro',
    sidebarDocs: 'Documentação',
    sidebarExamples: 'Exemplos',
    sidebarUi: 'Componentes',
    titleSuffixDocs: 'documentação sitelo',
    titleSuffixExamples: 'exemplos sitelo',
    titleSuffixUi: 'sitelo UI',
    tocLabel: 'Nesta página',
    pagenavLabel: 'Páginas adjacentes',
    previous: '← Anterior',
    next: 'Seguinte →',
    copy: 'Copiar',
    copyCode: 'Copiar código',
    copied: 'Copiado',
    copyFailed: 'Erro',
    markupStyle: 'Estilo de marcação',
    templateLiteral: 'Literal de template',
    recommended: 'recomendado',
    licenseLabel: 'Licença MIT',
    nodeLabel: 'Requer Node 20.19 ou superior',
    githubLabel: (version) => `sitelo ${version} no GitHub`,
    viteLabel: (version) => `Com tecnologia Vite ${version}`,
    cookieLabel: 'Consentimento de cookies',
    cookieText:
      'Este site usa cookies do Google Analytics para contar visitas. Nada é guardado sem a tua autorização.',
    cookieAccept: 'Aceitar',
    cookieDecline: 'Recusar',
    defaultDescription:
      'sitelo — geração de sites estáticos para Vite. Escreve funções que devolvem HTML.',
  },
}

/** Chrome strings for `lang`, falling back to English. */
export function strings(lang) {
  return STRINGS[lang] ?? STRINGS[DEFAULT_LOCALE]
}
