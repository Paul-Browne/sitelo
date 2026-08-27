import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/es.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'Acerca de',
    description:
      'Por qué existe sitelo — de javascript-to-html a vite-plugin-html-pages y de ahí a un kit completo para sitios estáticos.',
    activeHref: '/es/about',
    children: [
      p(
        'sitelo no empezó como un framework. Empezó como el picor de querer escribir marcado de una forma que resultara natural en JavaScript — y siguió creciendo hasta cubrir todo el camino desde el archivo de la página hasta el sitio publicado.',
      ),
      h2('javascript-to-html'),
      p(
        'Primero llegó ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (también conocido como ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '): una forma sencilla e intuitiva de generar HTML en JavaScript, sin motores de plantillas complejos ni frameworks.',
      ),
      p(
        'Con lo omnipresentes que se habían vuelto los frameworks completos como React, encontrar una solución de plantillas sencilla que no viniera con todo el equipamiento incluido era sorprendentemente difícil. Al centrarse solo en transformar JavaScript en HTML —básicamente funciones que devuelven cadenas—, ht.js se mantiene ligero, fácil de usar, flexible y extensible.',
      ),
      p(
        'Esa superficie tan reducida hace que encaje en muchos sitios: directamente en el frontend (estilo SPA), en una compilación para crear sitios estáticos (SSG), o incluso para renderizado en servidor (SSR).',
      ),
      h2('Enseñarle a Vite a emitir HTML'),
      p(
        'Eso resolvía la escritura. El siguiente problema era la compilación: Vite trata los ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' como scripts, no como páginas. Hacía falta una convención donde ciertos módulos estuvieran ',
        em('pensados'),
        ' para convertirse en HTML.',
      ),
      p(
        'La idea era directa: los archivos llamados ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ' y compañía deberían procesarse a HTML en lugar de empaquetarse como JavaScript de cliente. Esa convención se convirtió en ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ': enrutado basado en archivos, carga de datos, recursos y generación estática sobre Vite.',
      ),
      h2('sitelo'),
      p(
        'sitelo envuelve Vite y ese plugin en una sola instalación y una sola CLI. Obtienes una experiencia de desarrollo integral y de primera: ',
        code('sitelo'),
        ' para un servidor en vivo, ',
        code('sitelo build'),
        ' para producción, valores por defecto sensatos y el modelo de páginas del plugin sin tener que montar tú la cadena de herramientas.',
      ),
      p(
        'La misma idea de arriba abajo: las páginas son módulos que devuelven HTML. sitelo es la capa que hace que esa idea se sienta terminada.',
      ),
      h2('Cómo se compara'),
      p(
        'Ya hay muchas buenas herramientas para publicar sitios estáticos. El nicho de sitelo es estrecho a propósito: funciones de JavaScript (o TypeScript) que devuelven HTML, con la experiencia de desarrollo de Vite, y con el mínimo framework posible.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Herramienta'), th('Modelo'), th('Úsala cuando'))),
          tbody(
            comparisonRow(
              'sitelo',
              'Funciones JS/TS → HTML sobre Vite',
              'Quieres HTML a partir de JavaScript con un flujo de trabajo real de Vite — sin necesidad de un framework de componentes',
            ),
            comparisonRow(
              'Astro',
              'Componentes + islas, compilador propio',
              'Sitios de contenido que quieren islas de componentes y un ecosistema más grande',
            ),
            comparisonRow(
              'Next.js',
              'Aplicación React completa (SSR / SSG / ISR)',
              'Estás construyendo una aplicación dentro del ecosistema de React',
            ),
            comparisonRow(
              'Hugo',
              'Plantillas de Go, compilaciones muy rápidas',
              'Sitios de contenido enormes y te sientes cómodo con las herramientas de Go',
            ),
            comparisonRow(
              'Eleventy',
              'Lenguajes de plantillas → HTML',
              'Quieres plantillas flexibles (Nunjucks, Liquid, …) sin un framework de SPA',
            ),
          ),
        ),
      ),
      p(
        'Si quieres componentes, hidratación y un framework — usa un framework. Si quieres archivos HTML a partir de funciones de JavaScript con la experiencia de Vite, sitelo es la herramienta más pequeña que hace el trabajo completo.',
      ),
      p(
        a({ href: '/es/docs' }, 'Leer la documentación'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
