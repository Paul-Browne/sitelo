import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Link',
    description:
      'Ein gestalteter Anker, mit den Sicherheitsattributen, die ein externer Link braucht.',
    activeHref: '/de/ui/link',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Link ist ein Anker mit der Unterstreichung und der Palette dieser Bibliothek. Er wird unter zwei Namen exportiert — ',
        code('link'),
        ' und ',
        code('textLink'),
        ' —, weil ',
        code('link'),
        ' auch das ',
        code('<link>'),
        '-Element von javascript-to-html ist und beides unter einem Namen zu importieren ein Syntaxfehler wäre. Nimm ',
        code('textLink'),
        ', oder importiere die Bibliothek als Namensraum.',
      ),

      h2('Einfacher Link'),
      demo(`text('Lies die ', link({ href: '/de/docs' }, 'Dokumentation'), ', um loszulegen.')`, {
        align: 'stretch',
      }),

      h2('Farben'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Dezent'),
      p(
        'Ein dezenter Link erbt die umgebende Farbe und zeigt seine Unterstreichung erst beim Überfahren — für Linklisten, in denen eine Unterstreichung pro Zeile nur Rauschen wäre.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/de/docs/routing', subtle: true }, 'Routing'),
  link({ href: '/de/docs/data', subtle: true }, 'Daten laden'),
  link({ href: '/de/docs/assets', subtle: true }, 'Assets und Styling'),
)`, { align: 'stretch' }),

      h2('Externe Links'),
      p(
        code('external'),
        ' ergänzt ',
        code('target="_blank"'),
        ' und das ',
        code('rel'),
        ', das dazugehören muss. Sage im Linktext, dass ein neuer Tab aufgeht, oder ergänze einen visuell versteckten Hinweis — ein neuer Tab ohne Warnung verwirrt.',
      ),
      demo(`text(
  'Die Bibliothek liegt auf ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (öffnet in einem neuen Tab)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('In einem Absatz'),
      demo(`text({ variant: 'lead' },
  'sitelo baut auf ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ' auf, rendert mit ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ' und schickt nichts an den Browser, solange du nicht darum bittest.',
)`, { align: 'stretch' }),

      h2('Wann stattdessen ein Button'),
      p(
        'Ein Link navigiert; ein Button führt eine Aktion aus. Wenn die Sache den Zustand auf der Seite ändert, statt die Leserin woandershin zu bringen, gehört dorthin ein ',
        code('button()'),
        ' — und wenn sie navigiert, aber wie ein Button aussehen soll, gib ',
        code('button()'),
        ' ein ',
        code('href'),
        ', das darunter einen Anker rendert.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/de/docs' }, 'Ein Link, der navigiert'),
  button({ href: '/de/docs', variant: 'outline' }, 'Ein Link, der wie ein Button aussieht'),
  button({ variant: 'link' }, 'Ein Button, der wie ein Link aussieht'),
)`),

      h2('Props'),
      propsTable([
        ['href', 'string', '', 'Wohin er führt.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Aus welcher Palette geschöpft wird.'],
        ['subtle', 'boolean', 'false', 'Erbt die umgebende Farbe; Unterstreichung nur beim Überfahren.'],
        ['external', 'boolean', 'false', 'Ergänzt target="_blank" und rel="noopener noreferrer".'],
      ]),
    ],
  })
