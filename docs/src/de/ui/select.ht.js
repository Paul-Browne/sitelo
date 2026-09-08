import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Select',
    description:
      'Ein natives Select, passend zu den übrigen Eingaben gestaltet, mit Optionen aus Daten.',
    activeHref: '/de/ui/select',
    extraHead: uiHead(),
    children: [
      p(
        'Das ist ein echtes ',
        code('<select>'),
        ' mit dem browsereigenen Dropdown — es funktioniert also ohne JavaScript, öffnet sich am Telefon korrekt und lässt sich per Tastatur bedienen, ohne dass diese Bibliothek etwas beisteuert.',
      ),
      p(
        code('select()'),
        ' ist das nackte Steuerelement; ',
        code('selectField()'),
        ' wickelt es in Label, Hilfetext und Fehlermeldung, genau wie ',
        code('textField()'),
        ' es tut.',
      ),

      h2('Einfaches Select'),
      p(
        'Optionen dürfen einfache Strings sein, dann sind Wert und Label dasselbe.',
      ),
      demo(`selectField({
  label: 'Theme',
  name: 'theme',
  options: ['Hell', 'Dunkel', 'System'],
})`, { align: 'stretch' }),

      h2('Werte und Labels'),
      p(
        'Übergib Objekte, wenn der abgeschickte Wert vom gelesenen Text abweicht. ',
        code('value'),
        ' markiert die ausgewählte Option.',
      ),
      demo(`selectField({
  label: 'Ausgabe',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — der Standard' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Platzhalter'),
      p(
        'Ein Platzhalter erscheint als deaktivierte erste Option, ausgewählt, solange ',
        code('value'),
        ' fehlt — das Feld startet also leer, ohne eine gültige Wahl zu sein.',
      ),
      demo(`selectField({
  label: 'Deploy-Ziel',
  name: 'target',
  placeholder: 'Host wählen…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Gruppen'),
      p(
        'Ein Eintrag mit eigenem ',
        code('options'),
        '-Array wird zu einer ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Seitenendung',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Größen'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Klein', name: 'sm', size: 'sm', options: ['Eins', 'Zwei'] }),
  selectField({ label: 'Mittel', name: 'md', size: 'md', options: ['Eins', 'Zwei'] }),
  selectField({ label: 'Groß', name: 'lg', size: 'lg', options: ['Eins', 'Zwei'] }),
)`, { align: 'stretch' }),

      h2('Hilfe, Fehler und deaktiviert'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Sprache',
    name: 'locale',
    options: ['en', 'es', 'fr'],
    help: 'Wird für das lang-Attribut des html verwendet.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Eines auswählen…',
    options: ['sitelo'],
    error: 'Wähle ein Framework, um fortzufahren.',
  }),
  selectField({
    label: 'Tarif',
    name: 'plan',
    options: ['Kostenlos'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('Aus Daten'),
      p(
        'Optionen sind nur ein Array, sie kommen also meist aus dem, was ',
        code('data()'),
        ' für die Seite ohnehin geladen hat.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Hallo Welt' },
    { slug: 'static-first', title: 'Statisch zuerst' },
    { slug: 'no-runtime', title: 'Kein Runtime' },
  ]

  return selectField({
    label: 'Hervorgehobener Beitrag',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Strings, { value, label, disabled }-Objekte, oder { label, options } für eine Gruppe.'],
        ['value', 'string | number', '', 'Welche Option ausgewählt ist.'],
        ['placeholder', 'string', '', 'Deaktivierte erste Option, ausgewählt, solange es keinen Wert gibt.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Höhe des Steuerelements und Textgröße.'],
        ['name', 'string', '', 'Name des Formularfelds; die id wird daraus abgeleitet.'],
        ['invalid', 'boolean', 'false', 'Setzt aria-invalid. selectField erledigt das anhand von error.'],
        ['disabled', 'boolean', 'false', 'Deaktiviert das Steuerelement.'],
      ]),
      p(
        code('selectField()'),
        ' nimmt zusätzlich ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' und ',
        code('fieldClass'),
        ' — siehe ',
        code('textField()'),
        '. Kinder werden nach den erzeugten Optionen angehängt, du kannst also beliebige von Hand schreiben.',
      ),
    ],
  })
