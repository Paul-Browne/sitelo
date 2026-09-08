import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Akkordeon',
    description:
      'Ausklappbare Abschnitte mit dem browsereigenen <details> — inklusive seines exklusiven Modus.',
    activeHref: '/de/ui/accordion',
    extraHead: uiHead(),
    children: [
      p(
        'Jeder Abschnitt ist ein ',
        code('<details>'),
        '. Öffnen, Schließen, Tastaturbedienung und die Suche auf der Seite kommen vom Browser, und das Akkordeon funktioniert auch ohne JavaScript — was bei einer FAQ, dem häufigsten Anwendungsfall, zählt.',
      ),

      h2('Einfaches Akkordeon'),
      demo(`accordion({
  items: [
    { title: 'Was ist sitelo?', content: 'Ein Static-Site-Generator auf Basis von Vite. Seiten sind Funktionen, die HTML zurückgeben.' },
    { title: 'Bringt es ein Runtime mit?', content: 'Nein. Nichts erreicht den Browser, solange du nicht selbst ein Skript einbindest.' },
    { title: 'Kann ich TypeScript nutzen?', content: 'Ja — .ht.ts und .ht.tsx sind Seitenendungen wie alle anderen.' },
  ],
})`, { align: 'stretch' }),

      h2('Standardmäßig offen'),
      demo(`accordion({
  items: [
    { title: 'Offen beim Aufruf', content: 'Dieser hat open: true.', open: true },
    { title: 'Geschlossen', content: 'Dieser nicht.' },
  ],
})`, { align: 'stretch' }),

      h2('Immer nur eines'),
      p(
        'Ein gemeinsamer ',
        code('name'),
        ' macht die Abschnitte gegenseitig exklusiv — einen zu öffnen schließt die anderen. Das ist das eigene Verhalten des Browsers für ',
        code('<details name>'),
        ', kein Skript.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Erster', content: 'Öffne einen anderen und dieser schließt sich.', open: true },
    { title: 'Zweiter', content: 'Dieser ebenfalls.' },
    { title: 'Dritter', content: 'Es ist immer nur einer offen.' },
  ],
})`, { align: 'stretch' }),

      h2('Reicher Inhalt'),
      p(
        'Baue die Abschnitte mit ',
        code('accordionItem()'),
        ', wenn der Inhalt mehr als ein Absatz ist.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Installieren', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Füge das Paket und seinen Markup-Begleiter hinzu:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Konfigurieren' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Optional. Vite-Optionen stehen unter dem Schlüssel vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Deployen' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Veröffentliche das Ausgabeverzeichnis bei einem beliebigen Static-Host.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Eine FAQ'),
      p(
        'Die Form, für die es diese Komponente gibt: Inhalt, der bereits im HTML steht, zum Überfliegen eingeklappt und für Suchmaschinen auffindbar, weil er die Seite nie verlassen hat.',
      ),
      demo(`return (() => {
  const faq = [
    ['Ist es wirklich zero-config?', 'Ein Projekt mit einer Datei in src/ und ohne Konfiguration baut. Alles Weitere ist optional.'],
    ['Wie funktionieren dynamische Routen?', 'Klammern in Dateinamen. generateStaticParams listet, was gebaut wird.'],
    ['Und die Suche?', 'Setze pagefind: true, und der Build indexiert jede Seite.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Strings oder { title, content, open }-Objekte.'],
        ['name', 'string', '', 'Ein gemeinsamer name macht die Abschnitte gegenseitig exklusiv.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Die Zusammenfassungszeile.'],
        ['open', 'boolean', 'false', 'Ob er ausgeklappt startet.'],
        ['name', 'string', '', 'Dieselbe Wirkung wie am Elternelement, wenn du die Einträge von Hand baust.'],
      ]),
    ],
  })
