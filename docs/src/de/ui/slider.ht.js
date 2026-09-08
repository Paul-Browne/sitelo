import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Slider',
    description:
      'Ein natives Range-Input, passend zu den übrigen Bedienelementen gestaltet.',
    activeHref: '/de/ui/slider',
    extraHead: uiHead(),
    children: [
      p(
        'Das ist ein echtes ',
        code('<input type="range">'),
        ' — Pfeiltasten, Pos1 und Ende sowie die richtige Ansage kommen alle vom Browser. Gestaltet sind nur Schiene und Griff.',
      ),

      h2('Einfacher Slider'),
      demo(`sliderField({ label: 'Qualität', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Bereich und Schrittweite'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Lautstärke', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Spalten', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Skalierung', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Den Wert zeigen'),
      p(
        code('showValue'),
        ' setzt neben die Schiene ein ',
        code('<output>'),
        ' mit dem Wert, mit dem die Seite gebaut wurde. Es mit dem Griff im Gleichschritt zu halten ist eine Zeile eigenes Skript — diese Bibliothek liefert dafür keines, und eine Zahl, die still veraltet, wäre schlimmer als gar keine Zahl.',
      ),
      demo(`sliderField({
  label: 'Bildqualität',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Höher heißt größer und langsamer im Build.',
})`, { align: 'stretch' }),
      codeBlock('src/main.js', `for (const range of document.querySelectorAll('.su-slider')) {
  const output = range.parentElement.querySelector('output')

  if (output) range.addEventListener('input', () => { output.value = range.value })
}`, 'javascript'),

      h2('Farben'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Deaktiviert'),
      demo(`sliderField({ label: 'Gesperrt', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Ohne Label'),
      p(
        'Ein nacktes ',
        code('slider()'),
        ' ist das Bedienelement für sich — gib ihm ein ',
        code('aria-label'),
        ', wenn kein sichtbares Label darauf zeigt.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Textgröße' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('In einem Formular'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Maximale Bildbreite', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Qualität', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Speichern'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['min', 'number | string', '0', 'Untere Grenze.'],
        ['max', 'number | string', '100', 'Obere Grenze.'],
        ['step', 'number | string', '', 'Schrittweite. Weglassen für den Browser-Standard 1.'],
        ['value', 'number | string', '', 'Startwert.'],
        ['showValue', 'boolean', 'false', 'Fügt ein <output> mit dem Wert aus der Build-Zeit hinzu.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Farbe des Griffs.'],
        ['name', 'string', '', 'Name des Formularfelds; die id wird daraus abgeleitet.'],
        ['disabled', 'boolean', 'false', 'Deaktiviert das Bedienelement.'],
      ]),
      p(
        code('sliderField()'),
        ' nimmt zusätzlich ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' und ',
        code('required'),
        ' — siehe ',
        code('textField()'),
        '.',
      ),
    ],
  })
