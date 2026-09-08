import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Fortschritt',
    description:
      'Ein Balken für Arbeit mit bekanntem Ende, ein Spinner für Arbeit ohne eines.',
    activeHref: '/de/ui/progress',
    extraHead: uiHead(),
    children: [
      p(
        'Nimm einen bestimmten Balken, wann immer du weißt, wie viel noch fehlt — nur er sagt der Leserin überhaupt etwas. Lass ',
        code('value'),
        ' weg, und der Balken animiert stattdessen, was „arbeitet noch“ heißt und sonst nichts.',
      ),

      h2('Bestimmt'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Unbestimmt'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Ein Balken ohne ',
        code('label'),
        ' bekommt ',
        code('aria-hidden'),
        ' — eine progressbar-Rolle ohne zugänglichen Namen sagt einem Screenreader nichts, ein unbeschrifteter Balken gilt also als Dekoration. Beschrifte alles, dem eine Leserin folgen soll.',
      ),

      h2('Beschriftungen'),
      p(
        'Ein Label benennt, was passiert; ',
        code('showValue'),
        ' ergänzt rechts den Prozentwert.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Seiten werden gerendert', showValue: true }),
  progress({ value: 30, max: 60, label: 'Bilder werden optimiert', showValue: true }),
  progress({ label: 'Warte auf das Deployment' }),
)`, { align: 'stretch' }),

      h2('Farben und Höhe'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Bestanden', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Eingeschränkt', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Fehlerhaft', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Eine andere Skala als 100'),
      p(
        code('max'),
        ' lässt dich die rohen Zahlen übergeben — gebaute Seiten von Seiten insgesamt — statt vorher einen Prozentwert auszurechnen.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 von 169 Seiten', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Spinner'),
      p(
        'Ein Spinner wird in ',
        code('em'),
        ' bemessen und passt so zu dem Text neben ihm, ohne eine Größe genannt zu bekommen.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  spinner({ size: 'sm' }),
  spinner(),
  spinner({ size: 'lg' }),
)`),

      h2('Der Spinner im Zusammenhang'),
      p(
        'Gib einem allein stehenden Spinner ein ',
        code('label'),
        ', damit er angesagt wird. Einer in einem Button braucht keines — der Button sagt schon, was er tut.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    spinner({ label: 'Lädt' }),
    text({ variant: 'small', tone: 'muted' }, 'Hole den letzten Build…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Deployt'),
    button({ variant: 'outline', loading: true }, 'Prüfe Links'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — auch als ', code('progressBar'), ' exportiert:'),
      propsTable([
        ['value', 'number', '', 'Wie weit es ist. Weglassen für die unbestimmte Animation.'],
        ['max', 'number', '100', 'Welcher Wert als fertig zählt.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Füllfarbe.'],
        ['label', 'Child', '', 'Text über dem Balken; zugleich sein zugänglicher Name.'],
        ['showValue', 'boolean', 'false', 'Den Prozentwert neben dem Label zeigen.'],
        ['height', 'Space', "'0.5rem'", 'Dicke des Balkens.'],
      ]),
      p(code('spinner()'), ':'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Durchmesser. Mittel wird in em bemessen, passend zum Text daneben.'],
        ['label', 'string', '', 'Zugänglicher Name. Ohne ihn bleibt der Spinner vor Screenreadern verborgen.'],
      ]),
    ],
  })
