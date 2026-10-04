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
import { code, pageLayout } from '../lib/de.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'Über',
    description:
      'Warum es sitelo gibt — von javascript-to-html über vite-plugin-html-pages bis zum vollständigen Werkzeugkasten für statische Websites.',
    activeHref: '/de/about',
    children: [
      p(
        'sitelo begann nicht als Framework. Es begann mit dem Drang, Markup so zu schreiben, wie es sich in JavaScript natürlich anfühlt — und wuchs weiter, bis der ganze Weg von der Seitendatei bis zur ausgelieferten Website abgedeckt war.',
      ),
      h2('javascript-to-html'),
      p(
        'Zuerst kam ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (auch bekannt als ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '): eine einfache, intuitive Art, HTML in JavaScript zu erzeugen, ohne komplexe Template-Engines oder Frameworks.',
      ),
      p(
        'So allgegenwärtig, wie ausgewachsene Frameworks wie React geworden waren, war es erstaunlich schwer, eine schlichte Templating-Lösung zu finden, die nicht gleich alles mitbringt. Weil ht.js sich allein auf die Umwandlung von JavaScript in HTML beschränkt — im Grunde Funktionen, die Strings zurückgeben — bleibt es leichtgewichtig, einfach, flexibel und erweiterbar.',
      ),
      p(
        'Diese geringe Oberfläche passt an viele Stellen: direkt im Frontend (wie eine SPA), in einem Build zur Erzeugung statischer Websites (SSG) oder sogar für serverseitiges Rendering (SSR).',
      ),
      h2('Vite beibringen, HTML auszugeben'),
      p(
        'Damit war das Schreiben gelöst. Das nächste Problem war der Build: Vite behandelt ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' als Skripte, nicht als Seiten. Es brauchte eine Konvention, bei der bestimmte Module ',
        em('dafür gedacht'),
        ' sind, zu HTML zu werden.',
      ),
      p(
        'Die Idee war naheliegend: Dateien mit Namen wie ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ' und Verwandte sollten zu HTML verarbeitet werden statt als Client-JavaScript gebündelt. Aus dieser Konvention wurde ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' — dateibasiertes Routing, Datenladen, Assets und statische Generierung auf Vite.',
      ),
      h2('sitelo'),
      p(
        'sitelo verpackt Vite und dieses Plugin in eine Installation und eine CLI. Du bekommst eine runde, erstklassige Entwicklererfahrung: ',
        code('sitelo'),
        ' für einen Live-Server, ',
        code('sitelo build'),
        ' für die Produktion, sinnvolle Voreinstellungen und das Seitenmodell des Plugins, ohne die Toolchain selbst zusammenzusetzen.',
      ),
      p(
        'Dieselbe Idee von oben bis unten: Seiten sind Module, die HTML zurückgeben. sitelo ist die Schicht, die diese Idee fertig wirken lässt.',
      ),
      h2('Komponenten und Server-Islands'),
      p(
        'Funktionen, die HTML zurückgeben, lassen sich bis ganz nach oben zusammensetzen. ',
        a({ href: '/de/docs/ui' }, 'sitelo-ui'),
        ' ist eine Komponentenbibliothek nach genau diesem Prinzip — Buttons, Karten, Formulare, Tabellen, Modals und Seitenabschnitte, jede eine Funktion, die einen String zurückgibt. Kein Compiler, keine Runtime, keine Hydration: Was du baust, landet genau so in ',
        code('dist/'),
        '.',
      ),
      p(
        'Nicht jeder Bereich einer Seite kann aber statisch sein. ',
        a({ href: '/de/docs/islands' }, 'Server-Islands'),
        ' halten die Seite statisch und rendern nur die Teile, die frische Daten pro Anfrage brauchen — Kommentare unter einem gecachten Beitrag, eine Lagerbestandsanzeige auf einer Produktseite — beim Aufruf auf einem Server. Eine Island ist wieder eine Funktion, die HTML zurückgibt: Der Build liefert ihren Fallback aus, und ein winziger Loader tauscht das gerenderte Fragment ein.',
      ),
      p(
        'Am Modell ändert keines von beiden etwas. Es gibt weiterhin kein Client-Framework — nur HTML aus Funktionen, zur Build-Zeit oder zur Anfragezeit.',
      ),
      h2('Im Vergleich'),
      p(
        'Es gibt schon viele gute Werkzeuge, die statische Websites ausliefern. sitelos Nische ist bewusst eng: JavaScript- (oder TypeScript-)Funktionen, die HTML zurückgeben, mit Vites Entwicklererfahrung und so wenig Framework wie möglich.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Werkzeug'), th('Modell'), th('Greif zu, wenn'))),
          tbody(
            comparisonRow(
              'sitelo',
              'JS/TS-Funktionen → HTML auf Vite, plus Komponenten und Server-Islands',
              'du HTML aus JavaScript willst, mit einem echten Vite-Workflow — Komponenten und Bereiche pro Anfrage inklusive, ohne Client-Framework oder Hydration',
            ),
            comparisonRow(
              'Astro',
              'Framework-Komponenten + Client- und Server-Islands, eigener Compiler',
              'du React-, Vue- oder Svelte-Komponenten im Browser hydrieren willst, mit einem größeren Ökosystem',
            ),
            comparisonRow(
              'Next.js',
              'Vollständige React-App (SSR / SSG / ISR)',
              'du eine Anwendung im React-Ökosystem baust',
            ),
            comparisonRow(
              'Hugo',
              'Go-Templates, sehr schnelle Builds',
              'riesige Content-Websites und du dich in Gos Toolchain wohlfühlst',
            ),
            comparisonRow(
              'Eleventy',
              'Template-Sprachen → HTML',
              'du flexible Templates (Nunjucks, Liquid, …) ohne SPA-Framework willst',
            ),
          ),
        ),
      ),
      p(
        'Wenn du clientseitige Komponenten und Hydration willst — nimm ein Framework. Wenn du HTML aus JavaScript-Funktionen mit der Vite-Erfahrung willst — Komponenten und serverseitig gerenderte Bereiche inklusive —, ist sitelo das kleinste Werkzeug, das die ganze Aufgabe erledigt.',
      ),
      p(
        a({ href: '/de/docs' }, 'Dokumentation lesen'),
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
