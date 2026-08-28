import { DEFAULT_LOCALE, localePath } from './i18n.js'

/**
 * Sidebar entries per locale. `href` is the English path; `docNav()` and
 * `exampleNav()` prefix it for the requested locale.
 */
const DOC_LABELS = {
  en: [
    { href: '/docs', label: 'Getting started' },
    { href: '/docs/pages', label: 'Writing pages' },
    { href: '/docs/routing', label: 'Routing' },
    { href: '/docs/data', label: 'Data loading' },
    { href: '/docs/islands', label: 'Server islands' },
    { href: '/docs/assets', label: 'Assets & styling' },
    { href: '/docs/images', label: 'Image optimization' },
    { href: '/docs/typescript', label: 'TypeScript' },
    { href: '/docs/configuration', label: 'Configuration' },
    { href: '/docs/cli', label: 'CLI' },
    { href: '/docs/deployment', label: 'Deployment' },
    { href: '/docs/build-with-ai', label: 'Build with AI' },
  ],
  es: [
    { href: '/docs', label: 'Primeros pasos' },
    { href: '/docs/pages', label: 'Escribir páginas' },
    { href: '/docs/routing', label: 'Rutas' },
    { href: '/docs/data', label: 'Carga de datos' },
    { href: '/docs/islands', label: 'Islas de servidor' },
    { href: '/docs/assets', label: 'Recursos y estilos' },
    { href: '/docs/images', label: 'Optimización de imágenes' },
    { href: '/docs/typescript', label: 'TypeScript' },
    { href: '/docs/configuration', label: 'Configuración' },
    { href: '/docs/cli', label: 'CLI' },
    { href: '/docs/deployment', label: 'Despliegue' },
    { href: '/docs/build-with-ai', label: 'Crear con IA' },
  ],
  fr: [
    { href: '/docs', label: 'Démarrage' },
    { href: '/docs/pages', label: 'Écrire des pages' },
    { href: '/docs/routing', label: 'Routage' },
    { href: '/docs/data', label: 'Chargement de données' },
    { href: '/docs/islands', label: 'Îlots serveur' },
    { href: '/docs/assets', label: 'Ressources et styles' },
    { href: '/docs/images', label: 'Optimisation des images' },
    { href: '/docs/typescript', label: 'TypeScript' },
    { href: '/docs/configuration', label: 'Configuration' },
    { href: '/docs/cli', label: 'CLI' },
    { href: '/docs/deployment', label: 'Déploiement' },
    { href: '/docs/build-with-ai', label: "Créer avec l'IA" },
  ],
  de: [
    { href: '/docs', label: 'Erste Schritte' },
    { href: '/docs/pages', label: 'Seiten schreiben' },
    { href: '/docs/routing', label: 'Routing' },
    { href: '/docs/data', label: 'Daten laden' },
    { href: '/docs/islands', label: 'Server-Islands' },
    { href: '/docs/assets', label: 'Assets und Styling' },
    { href: '/docs/images', label: 'Bildoptimierung' },
    { href: '/docs/typescript', label: 'TypeScript' },
    { href: '/docs/configuration', label: 'Konfiguration' },
    { href: '/docs/cli', label: 'CLI' },
    { href: '/docs/deployment', label: 'Deployment' },
    { href: '/docs/build-with-ai', label: 'Mit KI entwickeln' },
  ],
  ru: [
    { href: '/docs', label: 'Начало работы' },
    { href: '/docs/pages', label: 'Написание страниц' },
    { href: '/docs/routing', label: 'Маршрутизация' },
    { href: '/docs/data', label: 'Загрузка данных' },
    { href: '/docs/islands', label: 'Серверные острова' },
    { href: '/docs/assets', label: 'Ресурсы и стили' },
    { href: '/docs/images', label: 'Оптимизация изображений' },
    { href: '/docs/typescript', label: 'TypeScript' },
    { href: '/docs/configuration', label: 'Конфигурация' },
    { href: '/docs/cli', label: 'CLI' },
    { href: '/docs/deployment', label: 'Развёртывание' },
    { href: '/docs/build-with-ai', label: 'Разработка с ИИ' },
  ],
  zh: [
    { href: '/docs', label: '快速开始' },
    { href: '/docs/pages', label: '编写页面' },
    { href: '/docs/routing', label: '路由' },
    { href: '/docs/data', label: '数据加载' },
    { href: '/docs/islands', label: '服务端群岛' },
    { href: '/docs/assets', label: '资源与样式' },
    { href: '/docs/images', label: '图片优化' },
    { href: '/docs/typescript', label: 'TypeScript' },
    { href: '/docs/configuration', label: '配置' },
    { href: '/docs/cli', label: 'CLI' },
    { href: '/docs/deployment', label: '部署' },
    { href: '/docs/build-with-ai', label: '用 AI 开发' },
  ],
}

/**
 * Examples are English-only, so there is no `es` variant — Spanish pages link
 * to these same URLs.
 */
const EXAMPLE_LABELS = [
  { href: '/examples', label: 'Overview' },
  { href: '/examples/basic', label: 'Basic site' },
  { href: '/examples/todo', label: 'Todo app' },
  { href: '/examples/blog', label: 'Markdown blog' },
  { href: '/examples/wordpress', label: 'WordPress' },
  { href: '/examples/islands', label: 'Server islands' },
]

export function docNav(lang = DEFAULT_LOCALE) {
  const items = DOC_LABELS[lang] ?? DOC_LABELS[DEFAULT_LOCALE]
  return items.map(({ href, label }) => ({ href: localePath(href, lang), label }))
}

export function exampleNav() {
  return EXAMPLE_LABELS
}

export const DOC_NAV = docNav(DEFAULT_LOCALE)
export const EXAMPLE_NAV = exampleNav()
