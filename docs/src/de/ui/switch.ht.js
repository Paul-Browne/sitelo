import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Schalter',
    description:
      'Ein An/Aus-Schalter für eine Einstellung, die sofort greift — darunter eine Checkbox mit role="switch".',
    activeHref: '/de/ui/switch',
    children: [
      p(
        'Ein Schalter ist für eine Einstellung, die gilt, sobald man ihn umlegt. Eine Checkbox ist für eine Wahl, die man später bestätigt, mit einem Absenden-Button. Sitzt dein Bedienelement in einem Formular mit einem Speichern unten, ist es eine Checkbox.',
      ),
      p(
        'Die Komponente heißt ',
        code('toggle()'),
        ' und nicht ',
        code('switch()'),
        ', aus einem langweiligen, aber unvermeidbaren Grund: ',
        code('switch'),
        ' ist ein reserviertes Wort und kann daher kein Import-Name sein. Darunter steckt ein echtes ',
        code('<input type="checkbox">'),
        ' mit ',
        code('role="switch"'),
        '.',
      ),

      h2('Einfacher Schalter'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Öffentliche Website', name: 'public' }),
  toggle({ label: 'An', name: 'on', checked: true }),
)`),

      h2('Farben'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Deaktiviert'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Aus und gesperrt', disabled: true }),
  toggle({ label: 'An und gesperrt', checked: true, disabled: true }),
)`),

      h2('Ohne Label'),
      p(
        'Ein Schalter ohne sichtbares Label braucht trotzdem einen zugänglichen Namen. Übergib ',
        code('aria-label'),
        ' — es fällt an das Input durch.',
      ),
      demo(`toggle({ 'aria-label': 'Pagefind-Suche aktivieren', checked: true })`),

      h2('Eine Einstellungsliste'),
      p(
        'Die übliche Form: das Label links, der Schalter rechts, eine Zeile pro Einstellung.',
      ),
      demo(`return list(
  [
    ['Pagefind-Suche', 'Indexiert am Ende des Builds jede Seite.', true],
    ['Bildoptimierung', 'Skaliert und konvertiert Bilder zur Build-Zeit. Braucht sharp.', true],
    ['Server-Islands', 'Rendert markierte Bereiche zur Anfragezeit.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Text neben dem Schalter. Ohne ihn nimm aria-label.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Farbe der Schiene im eingeschalteten Zustand.'],
        ['checked', 'boolean', 'false', 'Ob er eingeschaltet startet.'],
        ['name', 'string', '', 'Name des Formularfelds.'],
        ['disabled', 'boolean', 'false', 'Deaktiviert das Input und dämpft die Zeile.'],
      ]),
      p(
        'Alles Weitere fällt an das ',
        code('<input>'),
        ' durch — dorthin gehören auch ',
        code('onchange'),
        ' und ',
        code('aria-*'),
        '.',
      ),
    ],
  })
