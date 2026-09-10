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
        ' mit dem Wert, mit dem die Seite gebaut wurde, und das Input holt sich beim ersten Ziehen seinen eigenen Handler, sodass die Zahl dem Griff folgt. Es gibt nichts zu importieren: eine Zahl, die still veraltet, wäre schlimmer als gar keine Zahl, also bleibt diese nicht dir überlassen.',
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

      h2('Von eigenem Code aus setzen'),
      p(
        'Ein Slider ist ein Formularelement, gehört also dem Leser — aber ein Preset, ein Zurücksetzen-Button oder ein Wert, der übers Netz kommt, muss ihn trotzdem bewegen können. Gib ihm eine ',
        code('id'),
        ', und ',
        code('setSlider'),
        ' tut genau das, samt ',
        code('<output>'),
        ' daneben.',
      ),
      codeBlock('src/main.js', `import { setSlider } from 'sitelo/ui/client'

setSlider('volume', 50)`, 'javascript'),
      p('Oder hol das Modul so, wie die Komponenten ihres holen, und lass das Bundle ganz weg:'),
      codeBlock('Überall', `button({ onclick: "import('/su/slider.js').then(m=>m.set('volume',50))" }, 'Hälfte')`, 'javascript'),
      p(
        'Der Browser begrenzt auf ',
        code('min'),
        ' und ',
        code('max'),
        ' und rastet auf ',
        code('step'),
        ' ein; zurück kommt deshalb, wo der Slider gelandet ist, nicht was er bekommen hat. ',
        code('input'),
        ' und ',
        code('change'),
        ' folgen, denn eine Vorschau, die auf das Ziehen hört, erfährt sonst nichts von einer Bewegung, die sie nicht ausgelöst hat. ',
        code('getSlider()'),
        ' liest den Wert zurück.',
      ),

      h2('Ausprobieren'),
      p('Diese Seite lädt die Runtime, die Buttons unten bewegen den Slider also wirklich.'),
      demo(`stack({ gap: 'md' },
  slider({ id: 'demo-slider', value: 40, showValue: true, 'aria-label': 'Demo' }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',0))" }, 'Min'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',50))" }, 'Hälfte'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',100))" }, 'Max'),
  ),
)`, { align: 'stretch' }),

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
