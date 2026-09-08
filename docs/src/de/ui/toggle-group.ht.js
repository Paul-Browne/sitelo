import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toggle-Gruppe',
    description:
      'Ein segmentiertes Steuerelement: Toggle-Buttons zu einem verbunden, oder Links, bei denen jedes Segment eine eigene Seite ist.',
    activeHref: '/de/ui/toggle-group',
    extraHead: uiHead(),
    children: [
      p(
        'Eine Toggle-Gruppe ist eine Reihe von Optionen, die sich als ein einziges Steuerelement liest. Bau sie aus ',
        code('items'),
        ' und sag mit ',
        code('value'),
        ', welche an ist.',
      ),

      h2('Einfache Gruppe'),
      demo(`toggleGroup({
  label: 'Textausrichtung',
  value: 'center',
  items: [
    { value: 'left', label: 'Links' },
    { value: 'center', label: 'Mitte' },
    { value: 'right', label: 'Rechts' },
  ],
})`),

      h2('Einfache Strings'),
      demo(`toggleGroup({ label: 'Dichte', value: 'komfortabel', items: ['kompakt', 'komfortabel', 'großzügig'] })`),

      h2('Links'),
      p(
        'Das ist die Form, die eine statische Website meistens will: jedes Segment ist eine Seite. Einträge mit einem ',
        code('href'),
        ' werden als Anker gerendert, und der aktive bekommt ',
        code('aria-current="page"'),
        ' — nicht ',
        code('aria-pressed'),
        ', denn ein Link ist kein Button, den man eingedrückt hat.',
      ),
      demo(`toggleGroup({
  label: 'Bereich',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Doku', href: '/de/docs' },
    { value: 'ui', label: 'UI', href: '/de/ui' },
    { value: 'examples', label: 'Beispiele', href: '/de/examples' },
  ],
})`),

      h2('Mehr als eine an'),
      p(
        'Übergib ein Array als ',
        code('value'),
        '. Der Container bleibt in beiden Fällen eine schlichte ',
        code('group'),
        ' — eine ',
        code('radiogroup'),
        ' wäre falsch, denn das hier sind gedrückte Buttons und keine Radios.',
      ),
      demo(`toggleGroup({
  label: 'Formatierung',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Fett' },
    { value: 'italic', label: 'Kursiv' },
    { value: 'underline', label: 'Unterstrichen' },
  ],
})`),

      h2('Größen und Varianten'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Klein', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Mittel', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Groß', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Deaktivierte Einträge'),
      demo(`toggleGroup({
  label: 'Renderer',
  value: 'static',
  items: [
    { value: 'static', label: 'Statisch' },
    { value: 'islands', label: 'Islands' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('In einer Werkzeugleiste'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Ausrichtung', value: 'Links', size: 'sm', items: ['Links', 'Mitte', 'Rechts'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Stil', value: ['Fett'], size: 'sm', items: ['Fett', 'Kursiv'] }),
)`),

      h2('Wann etwas anderes passt'),
      p(
        'Wird die Wahl mit einem Formular abgeschickt, nimm ',
        code('choiceGroup()'),
        ' — echte Radios, kein Skript nötig. Ist jedes Segment eine Seite, nimm lieber die Link-Form von oben. Eine Toggle-Gruppe ist für eine Wahl, auf die die Seite selbst reagiert.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings oder { value, label, href, disabled }-Objekte.'],
        ['value', 'string | number | Array', '', 'Welcher Eintrag an ist. Ein Array, wenn es mehrere sein können.'],
        ['label', 'string', '', 'Zugänglicher Name der Gruppe.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Gilt für jeden Eintrag.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Wie ein ausgeschalteter Eintrag aussieht.'],
      ]),
    ],
  })
