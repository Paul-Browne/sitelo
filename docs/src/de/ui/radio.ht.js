import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Radio-Gruppe',
    description:
      'Eine Wahl aus mehreren, als echte Radio-Inputs mit gemeinsamem name — mit Legende und Gruppenrolle.',
    activeHref: '/de/ui/radio',
    children: [
      p(
        'Radios sind dafür da, genau eine Option aus einer kleinen, sichtbaren Menge zu wählen. ',
        code('radio()'),
        ' rendert eines; ',
        code('choiceGroup()'),
        ' baut die ganze Menge aus einem Array und gibt ihr die Legende und das ',
        code('role="radiogroup"'),
        ', die daraus eine Gruppe statt eines Haufens Inputs machen.',
      ),
      p(
        'Sie teilen sich einen ',
        code('name'),
        ', also übernimmt der Browser die gegenseitige Ausschließlichkeit und die Navigation mit den Pfeiltasten. Hier wird kein Skript ausgeliefert.',
      ),

      h2('Einfache Radio-Gruppe'),
      demo(`choiceGroup({
  legend: 'Tarif',
  name: 'plan',
  value: 'pro',
  options: [
    { value: 'free', label: 'Kostenlos' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team' },
  ],
})`, { align: 'stretch' }),

      h2('In einer Reihe'),
      p(
        'Kurze Labels lesen sich besser auf einer Zeile. Lange sollten gestapelt bleiben, was der Standard ist.',
      ),
      demo(`choiceGroup({
  legend: 'Formfaktor',
  name: 'form-factor',
  direction: 'row',
  value: 'desktop',
  options: ['desktop', 'mobile'],
})`, { align: 'stretch' }),

      h2('Einfache Strings'),
      p(
        'Wenn Wert und Label dasselbe sind, übergib Strings.',
      ),
      demo(`choiceGroup({
  legend: 'Log-Level',
  name: 'log-level',
  direction: 'row',
  value: 'warn',
  options: ['info', 'warn', 'error', 'silent'],
})`, { align: 'stretch' }),

      h2('Deaktivierte Optionen'),
      demo(`choiceGroup({
  legend: 'Renderer',
  name: 'renderer',
  value: 'static',
  options: [
    { value: 'static', label: 'Statisch' },
    { value: 'islands', label: 'Server-Islands' },
    { value: 'ssr', label: 'Volles SSR', disabled: true },
  ],
  help: 'Volles SSR braucht einen Node-Host, den dieses Projekt nicht hat.',
})`, { align: 'stretch' }),

      h2('Eins nach dem anderen'),
      p(
        'Nimm ',
        code('radio()'),
        ' direkt, wenn die Optionen nicht gleichförmig genug sind, um aus einem Array zu kommen — etwa wenn jede ihre eigene Beschreibung trägt.',
      ),
      demo(`stack({ gap: 'md' },
  radio({ name: 'deploy', value: 'push', label: 'Bei jedem Push', checked: true }),
  radio({ name: 'deploy', value: 'tag', label: 'Nur bei getaggten Releases' }),
  radio({ name: 'deploy', value: 'manual', label: 'Von Hand' }),
)`, { align: 'stretch' }),

      h2('Farben'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  radio({ label: 'Primary', name: 'c1', checked: true, color: 'primary' }),
  radio({ label: 'Neutral', name: 'c2', checked: true, color: 'neutral' }),
  radio({ label: 'Success', name: 'c3', checked: true, color: 'success' }),
  radio({ label: 'Warning', name: 'c4', checked: true, color: 'warning' }),
  radio({ label: 'Danger', name: 'c5', checked: true, color: 'danger' }),
)`),

      h2('In einer Karte'),
      demo(`card(
  cardHeader({ title: 'Build-Einstellungen', subtitle: 'Gelten ab dem nächsten Deployment' }),
  cardBody(
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Saubere URLs',
        name: 'clean-urls',
        direction: 'row',
        value: 'on',
        options: [
          { value: 'on', label: 'An' },
          { value: 'off', label: 'Aus' },
        ],
      }),
      choiceGroup({
        legend: 'Bilder',
        name: 'images',
        value: 'optimise',
        options: [
          { value: 'optimise', label: 'Skalieren und konvertieren' },
          { value: 'copy', label: 'Unverändert kopieren' },
        ],
      }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Speichern'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('choiceGroup()'), ':'),
      propsTable([
        ['legend', 'Child', '', 'Beschriftung der ganzen Gruppe.'],
        ['name', 'string', '', 'Gemeinsamer Formularname — er macht die Radios exklusiv.'],
        ['options', 'Array', '[]', 'Strings oder { value, label, disabled }-Objekte.'],
        ['value', 'string | number | Array', '', 'Welche Option angehakt ist. Ein Array bei Checkboxen.'],
        ['type', "'radio' | 'checkbox'", "'radio'", 'Welches Steuerelement gebaut wird. Bestimmt auch die Gruppenrolle.'],
        ['direction', "'row' | 'column'", "'column'", 'Wie die Optionen angeordnet sind.'],
        ['help', 'Child', '', 'Hinweis unter der Gruppe.'],
      ]),
      p(code('radio()'), ' nimmt dieselben Props wie ', code('checkbox()'), ': ', code('label'), ', ', code('color'), ', ', code('checked'), ', ', code('name'), ', ', code('value'), ' und ', code('disabled'), '.'),
    ],
  })
