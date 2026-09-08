import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Textfeld',
    description:
      'Ein- und mehrzeilige Texteingaben, mit Label, Hilfetext, Fehlermeldung und ids, die dir bereits verdrahtet werden.',
    activeHref: '/de/ui/text-field',
    extraHead: uiHead(),
    children: [
      p(
        'Hier gibt es zwei Schichten. ',
        code('input()'),
        ' und ',
        code('textarea()'),
        ' sind die nackten Steuerelemente; ',
        code('textField()'),
        ' und ',
        code('textareaField()'),
        ' wickeln eines in Label, Hilfetext und Fehlermeldung und verbinden sie über ',
        code('for'),
        ' und ',
        code('aria-describedby'),
        '. Greif zum Zweiten, außer du baust das Layout selbst.',
      ),

      h2('Einfaches Textfeld'),
      demo(`textField({ label: 'Name', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Hilfetext'),
      p(
        'Der Hilfetext ist über ',
        code('aria-describedby'),
        ' verknüpft, sodass ein Screenreader ihn als Teil des Feldes liest und nicht als losen Text dahinter.',
      ),
      demo(`textField({
  label: 'E-Mail',
  name: 'email',
  type: 'email',
  help: 'Wir nutzen sie nur, um fehlgeschlagene Builds zu melden.',
})`, { align: 'stretch' }),

      h2('Pflichtfeld und Fehler'),
      p(
        'Ein ',
        code('error'),
        ' markiert das Feld als ungültig, färbt den Rahmen, setzt ',
        code('aria-invalid'),
        ' und lässt ',
        code('aria-describedby'),
        ' auf die Meldung zeigen — eine Prop, alle vier Wirkungen.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Projekt', name: 'project', required: true, value: '' }),
  textField({
    label: 'Website',
    name: 'site',
    error: 'Das ist keine URL.',
    value: 'sitelo punkt dev',
  }),
)`, { align: 'stretch' }),

      h2('Größen'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Klein', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Mittel', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Groß', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Zierteile'),
      p(
        'Ein Präfix oder Suffix, direkt am Steuerelement, für Einheiten und feste Teile eines Werts.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Website', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Build-Zeitlimit', name: 'timeout', endAdornment: 'Sekunden', value: '30' }),
)`, { align: 'stretch' }),

      h2('Deaktiviert und schreibgeschützt'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Deaktiviert', name: 'disabled', value: 'Nicht bearbeitbar', disabled: true }),
  textField({ label: 'Schreibgeschützt', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Mehrzeilig'),
      p(
        code('textareaField()'),
        ' ist dasselbe Feld um ein ',
        code('<textarea>'),
        ' herum. Sein Wert ist Elementinhalt statt Attribut, worum sich die Komponente kümmert.',
      ),
      demo(`textareaField({
  label: 'Beschreibung',
  name: 'description',
  rows: 4,
  help: 'Erscheint in Suchergebnissen und Social Cards.',
  value: 'Statische Website-Generierung ohne Konfiguration, angetrieben von Vite.',
})`, { align: 'stretch' }),

      h2('In einem Formular'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Name', name: 'contact-name', required: true }),
      textField({ label: 'E-Mail', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Nachricht', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Abbrechen'),
    button({ type: 'submit' }, 'Senden'),
  ),
)`, { align: 'stretch' }),

      h2('Selbst bauen'),
      p(
        code('field()'),
        ' ist die Hülle für sich — sie nimmt jedes Steuerelement als Kind, du kannst also zwei Eingaben in eine Reihe setzen oder ein Steuerelement verwenden, das diese Bibliothek nicht hat, unter derselben Label- und Fehlerbehandlung.',
      ),
      p(
        'Ein Label kann nicht zwei Steuerelemente benennen, deshalb braucht hier jede Eingabe ihren eigenen zugänglichen Namen. Genau das tun die ',
        code('aria-label'),
        ': das sichtbare Label benennt das Paar, und jede Eingabe sagt, welches Ende sie ist.',
      ),
      demo(`field({ label: 'Zeitraum', help: 'Beide Enden zählen dazu.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'Von' }),
    input({ type: 'date', name: 'to', 'aria-label': 'Bis' }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      h3('textField und textareaField'),
      propsTable([
        ['label', 'Child', '', 'Die Feldbeschriftung. Leitet ohne name auch die id des Steuerelements ab.'],
        ['name', 'string', '', 'Name des Formularfelds; die id wird daraus abgeleitet.'],
        ['help', 'Child', '', 'Hinweis unter dem Steuerelement, per aria-describedby verknüpft.'],
        ['error', 'Child | false', '', 'Fehlermeldung. Setzt außerdem aria-invalid am Steuerelement.'],
        ['required', 'boolean', 'false', 'Markiert Label und Steuerelement.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Höhe des Steuerelements und Textgröße.'],
        ['type', 'string', "'text'", 'Jeder input-Typ. Nur bei textField.'],
        ['startAdornment', 'Child', '', 'Präfix am Steuerelement. Nur bei textField.'],
        ['endAdornment', 'Child', '', 'Suffix am Steuerelement. Nur bei textField.'],
        ['value', 'string | number', '', 'Startwert.'],
        ['fieldClass', 'string', '', 'Klasse für die Hülle statt für das Steuerelement.'],
      ]),
      p(
        'Die ids werden aus ',
        code('name'),
        ' abgeleitet — oder aus ',
        code('label'),
        ', wenn es keinen name gibt — und nicht aus einem Zähler, sodass dieselbe Seite bei jedem Build dasselbe HTML ergibt. Übergib ',
        code('id'),
        ', um das zu überschreiben.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'Der Text der Beschriftung.'],
        ['help', 'Child', '', 'Hinweis unter dem Steuerelement.'],
        ['error', 'Child | false', '', 'Fehlermeldung; fügt der Hülle außerdem den Ungültig-Zustand hinzu.'],
        ['required', 'boolean', 'false', 'Fügt dem Label die Pflichtmarkierung hinzu.'],
        ['for', 'string', '', 'id des beschrifteten Steuerelements.'],
      ]),
    ],
  })
