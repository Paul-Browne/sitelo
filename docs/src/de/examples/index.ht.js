import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, examplesLayout } from '../../lib/de.js'

export default () =>
  examplesLayout({
    title: 'Beispiele',
    description: 'Praktische sitelo-Rezepte — WordPress, APIs und mehr.',
    activeHref: '/de/examples',
    children: [
      p(
        'Schritt-für-Schritt-Rezepte für echte Websites mit sitelo. Jedes Beispiel zeigt die Projektstruktur, das Laden der Daten und die Seiten, die du schreiben würdest.',
      ),
      h2('Verfügbar'),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/de/examples/basic' }, 'Basis-Website'),
          ' — minimales Projekt plus statische Deploy-Konfigurationen für Netlify, Vercel, Cloudflare Pages und AWS Amplify.',
        ),
        li(
          a({ href: '/de/examples/todo' }, 'Todo-App'),
          ' — statisches HTML mit inline ',
          code("import('/js/todo.js')"),
          '-Handlern (hinzufügen / umschalten / löschen, ',
          code('localStorage'),
          ').',
        ),
        li(
          a({ href: '/de/examples/blog' }, 'Markdown-Blog'),
          ' — ein Ordner voller ',
          code('.md'),
          '-Dateien, zu statischen Seiten gerendert, mit RSS-Feed und ohne Client-JS.',
        ),
        li(
          a({ href: '/de/examples/wordpress' }, 'WordPress'),
          ' — hole Beiträge über die WordPress-REST-API mit ',
          code('fetchWithCache'),
          ', liste sie auf und erzeuge statische Beitragsseiten.',
        ),
        li(
          a({ href: '/de/examples/islands' }, 'Server-Islands'),
          ' — statische Seiten plus ein Node-Host, der Islands zur Anfragezeit rendert.',
        ),
      ),
      h2('Demnächst'),
      ul({ class: 'docs-list' }, li('Headless CMS / Contentful')),
    ],
  })
