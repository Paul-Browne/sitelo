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
import { code } from './lib/code.js'
import { pageLayout } from './lib/layout.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'About',
    description:
      'Why sitelo exists — from javascript-to-html to vite-plugin-html-pages to a full static-site toolkit.',
    activeHref: '/about',
    children: [
      p(
        'sitelo didn’t start as a framework. It started as an itch to write markup in a way that felt natural in JavaScript — and kept growing until the whole path from page file to shipped site was covered.',
      ),
      h2('javascript-to-html'),
      p(
        'First came ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (also known as ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '): a simple, intuitive way to generate HTML in JavaScript, without complex templating engines or frameworks.',
      ),
      p(
        'Given how ubiquitous full-featured frameworks like React had become, finding a simple templating solution that didn’t include the kitchen sink was surprisingly hard. By focusing only on transforming JavaScript to HTML — basically functions that return strings — ht.js stays lightweight, easy to use, flexible, and extensible.',
      ),
      p(
        'That small surface means it fits many places: directly in the frontend (SPA-style), in a build to create static sites (SSG), or even for server-side rendering (SSR).',
      ),
      h2('Teaching Vite to emit HTML'),
      p(
        'That solved authoring. The next problem was the build: Vite treats ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' as scripts, not as pages. I needed a convention where certain modules were ',
        em('meant'),
        ' to become HTML.',
      ),
      p(
        'The idea was straightforward: files named ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ', and friends should be processed into HTML instead of bundled as client JavaScript. That convention became ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' — file-based routing, data loading, assets, and static generation on top of Vite.',
      ),
      h2('sitelo'),
      p(
        'sitelo wraps Vite and that plugin into one install and one CLI. You get a holistic, top-notch developer experience: ',
        code('sitelo'),
        ' for a live server, ',
        code('sitelo build'),
        ' for production, sensible defaults, and the plugin’s page model without assembling the toolchain yourself.',
      ),
      p(
        'Same idea all the way down: pages are modules that return HTML. sitelo is the layer that makes that idea feel finished.',
      ),
      h2('How it compares'),
      p(
        'Plenty of good tools already ship static sites. sitelo’s niche is narrow on purpose: JavaScript (or TypeScript) functions that return HTML, with Vite’s dev experience, and as little framework as possible.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Tool'), th('Model'), th('Reach for it when'))),
          tbody(
            comparisonRow(
              'sitelo',
              'JS/TS functions → HTML on Vite',
              'You want HTML out of JavaScript with a real Vite workflow — no component framework required',
            ),
            comparisonRow(
              'Astro',
              'Components + islands, own compiler',
              'Content sites that want component islands and a bigger ecosystem',
            ),
            comparisonRow(
              'Next.js',
              'Full React app (SSR / SSG / ISR)',
              'You’re building an application in the React ecosystem',
            ),
            comparisonRow(
              'Hugo',
              'Go templates, very fast builds',
              'Huge content sites and you’re happy in Go’s toolchain',
            ),
            comparisonRow(
              'Eleventy',
              'Template languages → HTML',
              'You want flexible templates (Nunjucks, Liquid, …) without a SPA framework',
            ),
          ),
        ),
      ),
      p(
        'If you want components, hydration, and a framework — use a framework. If you want HTML files out of JavaScript functions with the Vite experience, sitelo is the smallest tool that does the whole job.',
      ),
      p(
        a({ href: '/docs' }, 'Read the docs'),
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
