import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Checkbox',
    description:
      'Eine Checkbox und ihr Label als ein Steuerelement — ein echtes Input, per CSS gestaltet statt ersetzt.',
    activeHref: '/de/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ' rendert ein ',
        code('<label>'),
        ', das ein echtes ',
        code('<input type="checkbox">'),
        ' und das sichtbare Kästchen umschließt. Das Input ist visuell versteckt, aber weiterhin da: es ist fokussierbar, es wird abgeschickt, und das ganze Label ist Klickfläche — das Häkchen wird aus dem eigenen ',
        code(':checked'),
        '-Zustand des Inputs gezeichnet, ganz ohne Skript.',
      ),

      h2('Einfache Checkbox'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Updates per E-Mail schicken', name: 'updates' }),
  checkbox({ label: 'Angehakt', name: 'checked', checked: true }),
)`),

      h2('Farben'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Deaktiviert'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Nicht verfügbar', disabled: true }),
  checkbox({ label: 'An und gesperrt', checked: true, disabled: true }),
)`),

      h2('Lange Labels'),
      p(
        'Das Kästchen bleibt an der ersten Zeile ausgerichtet, statt sich mittig zu einem Absatz zu setzen.',
      ),
      demo(`checkbox({
  label: 'Nach jedem Build ein Lighthouse-Audit laufen lassen und den Build scheitern lassen, wenn ein Wert unter seine Schwelle fällt.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Gruppen'),
      p(
        code('choiceGroup()'),
        ' baut aus Daten eine Reihe von Checkboxen, mit gemeinsamer Legende und gemeinsamem name. Übergib ein Array als ',
        code('value'),
        ', um mehrere anzuhaken.',
      ),
      demo(`choiceGroup({
  legend: 'Erzeugen',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Pagefind-Index' },
  ],
  help: 'Jedes davon wird am Ende des Builds nach dist/ geschrieben.',
})`, { align: 'stretch' }),

      h2('In einer Reihe'),
      demo(`choiceGroup({
  legend: 'Kategorien',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Mit einem Field'),
      p(
        'Eine einzelne Checkbox braucht selten zusätzlich ein Label darüber. Wenn eine Gruppe es doch braucht, gibt ihr ',
        code('field()'),
        ' dieselbe Behandlung von Label, Hilfe und Fehler wie einem Textfeld.',
      ),
      demo(`field({ label: 'Bedingungen', error: 'Du musst die Bedingungen akzeptieren, um fortzufahren.' },
  checkbox({ label: 'Ich akzeptiere die Bedingungen', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Text neben dem Kästchen. Weglassen für ein nacktes Steuerelement.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Farbe im angehakten Zustand.'],
        ['checked', 'boolean', 'false', 'Ob sie angehakt startet.'],
        ['name', 'string', '', 'Name des Formularfelds.'],
        ['value', 'string | number', '', 'Wert, der im angehakten Zustand gesendet wird.'],
        ['disabled', 'boolean', 'false', 'Deaktiviert das Input und dämpft das Label.'],
      ]),
      p(
        'Alles Weitere landet auf dem ',
        code('<input>'),
        ', nicht auf dem Label — ',
        code('required'),
        ', ',
        code('onchange'),
        ' und ',
        code('data-*'),
        ' gehen also dorthin, wo man sie erwartet. Nutze ',
        code('class'),
        ', um das Label selbst zu gestalten.',
      ),
      p(
        'Für eine aus Daten gebaute Reihe siehe ',
        code('choiceGroup()'),
        ' auf der Seite ',
        code('Radio-Gruppe'),
        ' — es nimmt in beiden Fällen dieselben Optionen, umgeschaltet über ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
