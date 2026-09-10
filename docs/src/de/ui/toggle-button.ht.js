import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Toggle-Button',
    description:
      'Ein Button, der gedrückt bleibt — eine Einstellung als Button statt als Checkbox.',
    activeHref: '/de/ui/toggle-button',
    children: [
      p(
        'Ein Toggle-Button ist an oder aus und sagt das mit ',
        code('aria-pressed'),
        '. Fett in einem Texteditor, ein aktiver Filter, ein gerade sichtbares Panel.',
      ),
      p(
        'Es steckt kein verstecktes Input dahinter: ',
        code('aria-pressed'),
        ' ist der ganze Zustand, ein serverseitig gerenderter Toggle zeigt also eine Einstellung, und ',
        code('setPressed()'),
        ' ist das, was sie ändert. Greif zu ',
        code('checkbox()'),
        ', wenn es in ein Formular gehört, und zu ',
        code('toggle()'),
        ' — dem Schalter —, wenn es eine Einstellung in einer Liste ist.',
      ),

      h2('Einfacher Toggle'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Fett'),
  toggleButton('Kursiv'),
  toggleButton('Unterstrichen'),
)`),

      h2('Varianten'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline an'),
    toggleButton({ variant: 'outline' }, 'Outline aus'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost an'),
    toggleButton({ variant: 'ghost' }, 'Ghost aus'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft an'),
    toggleButton({ variant: 'soft' }, 'Soft aus'),
  ),
)`, { align: 'start' }),

      h2('Größen'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Klein'),
  toggleButton({ size: 'md', pressed: true }, 'Mittel'),
  toggleButton({ size: 'lg', pressed: true }, 'Groß'),
)`),

      h2('Mit Icons'),
      p(
        'Ein Toggle nur aus einem Icon braucht einen zugänglichen Namen — übergib ',
        code('aria-label'),
        ', das an den Button durchfällt.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Fett',
    title: 'Fett',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Kursiv',
    title: 'Kursiv',
    startIcon: icon('italic'),
  }),
)`),

      h2('Deaktiviert'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'An, gesperrt'),
  toggleButton({ disabled: true }, 'Aus, gesperrt'),
)`),

      h2('Ihn etwas tun lassen'),
      p(
        'Ein Aufruf kippt das Attribut; die Gestaltung folgt ihm. In einer ',
        code('toggleGroup()'),
        ' mit nur einer Wahl lässt er zugleich die Geschwister los.',
      ),
      codeBlock('Irgendwo', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Bold')`, 'javascript'),
      p('Oder aus deinem eigenen Modul, wenn ohnehin schon eines läuft:'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('Props'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Setzt aria-pressed. Danach ändert es setPressed().'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Wie der nicht gedrückte Button aussieht.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Dieselbe Skala wie bei button().'],
        ['disabled', 'boolean', 'false', 'Deaktiviert den Button.'],
      ]),
      p(
        'Alles Weitere fällt an ',
        code('button()'),
        ' durch — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' und der Rest. Für eine ganze Reihe davon siehe ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
