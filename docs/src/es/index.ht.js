import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from '../lib/es.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('es')

const features = [
  [
    'routing',
    'Rutas',
    'src/about.ht.js → /about, además de [slug] y comodines',
    '/es/docs/routing',
  ],
  [
    'code',
    'JSX y TSX',
    'Escribe páginas como .jsx / .tsx con el mismo enrutado y la misma compilación',
    '/es/docs/pages#limitaciones-de-jsx',
  ],
  [
    'data',
    'Carga de datos',
    'data() en tiempo de compilación, con caché de fetch',
    '/es/docs/data',
  ],
  [
    'pipeline',
    'Pipeline de recursos',
    'El JS/TS/CSS referenciado se empaqueta; el resto se queda en el servidor',
    '/es/docs/assets',
  ],
  [
    'image',
    'Optimización de imágenes',
    'Redimensionado, formatos y srcset — actívalo con images: true (instala sharp)',
    '/es/docs/images',
  ],
  [
    'feather',
    'Cero JavaScript, por defecto',
    'Solo se empaquetan los scripts que enlazas — el resto se queda fuera de la página, para un sitio más rápido',
    '/es/docs/assets#cero-js-por-defecto',
  ],
  [
    'terminal',
    'Servidor de desarrollo + barra de herramientas',
    'Renderizado en vivo bajo demanda, más archivo, parámetros, número de islas y selector de viewport mientras desarrollas',
    '/es/docs/cli',
  ],
  [
    'search',
    'Búsqueda con Pagefind',
    'Búsqueda estática opcional — instala pagefind y sitelo build indexa en dist/pagefind/',
    '/es/docs/configuration#busqueda-con-pagefind',
  ],
  [
    'layers',
    'Islas de servidor',
    'Páginas estáticas con regiones renderizadas en el servidor en el momento de la petición',
    '/es/docs/islands',
  ],
  [
    'sparkles',
    'Preparado para IA',
    'llms.txt, reglas de proyecto y consejos para que los agentes escriban sitelo, no React',
    '/es/docs/build-with-ai',
  ],
  [
    'deploy',
    'Despliegue en un clic',
    'Incluye configuraciones para Netlify, Vercel, Cloudflare Pages y AWS Amplify',
    '/es/docs/deployment',
  ],
  [
    'gift',
    'Extras',
    '404.html, sitemap.xml y RSS cuando los pidas',
    '/es/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — El framework moderno para sitios web rápidos',
    description:
      'sitelo convierte una carpeta de páginas en un sitio web estático y rápido. Vista previa en vivo mientras trabajas, un solo comando para publicar — sin framework pesado.',
    children: [headerHero(), mainSections()],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
      }),
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          'El framework moderno para ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'sitios web rápidos|blogs|portfolios|landing pages|sitios de contenido|tiendas online',
              'aria-live': 'polite',
            },
            'sitios web rápidos',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Cero configuración. Compilaciones rapidísimas. Despliega donde quieras — con una sola instalación.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/es/docs' }, 'Empezar'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': 'Copiar comando de instalación',
              },
              'Copiar',
            ),
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      'Qué obtienes',
      ul(
        { class: 'feature-list' },
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
      ),
    ),
    sectionBlock(
      'Documentación',
      p(
        'Guías sobre rutas, carga de datos, TypeScript, configuración y la CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/es/docs' },
          'Leer la documentación',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Ejemplos',
      p(
        'Recetas para montajes reales — empezando por un sitio con la API REST de WordPress.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/es/examples' },
          'Ver los ejemplos',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
