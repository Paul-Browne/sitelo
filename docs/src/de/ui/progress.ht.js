import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'
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

      h2('Sie vom Browser aus bewegen'),
      p(
        'Ein Balken ist serverseitig gerendertes HTML: der Prozentwert ist eine Custom Property auf der Füllung und eine Zahl in ',
        code('aria-valuenow'),
        ', und nichts auf der Seite ändert von sich aus eines von beiden. Gib dem Balken eine ',
        code('id'),
        ', und ',
        code('setProgress'),
        ' bewegt beides zusammen — die Füllung, den angesagten Wert und den Prozentwert neben der Beschriftung.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'Das Maximum wird gemerkt, spätere Aufrufe sind also nur noch ein Wert. Oder erreiche das Modul so, wie es die Komponenten tun, und lass das Bundle ganz weg:',
      ),
      codeBlock('Irgendwo', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Fertig')`, 'javascript'),
      p(
        'Mit ',
        code('null'),
        ' — oder allem, was keine endliche Zahl ist — geht der Balken zurück in die unbestimmte Animation, sodass Arbeit, die keine Zahlen mehr liefert, kein Sonderfall sein muss. ',
        code('getProgress()'),
        ' liest den aktuellen Wert wieder aus, auf der eigenen Skala des Balkens.',
      ),

      h2('Probier es aus'),
      p('Diese Seite lädt das Runtime, die Buttons unten bewegen den Balken also wirklich.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Wird hochgeladen', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Zurücksetzen'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Fertig'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Unbekannt'),
  ),
)`, { align: 'stretch' }),
      p(
        'Ein unbeschrifteter Balken bewegt sich ebenfalls, bleibt aber ',
        code('aria-hidden'),
        ' — er wurde mit Absicht ohne Namen gerendert, und ihm jetzt einen Wert anzusagen würde eine namenlose progressbar in den Accessibility-Baum stellen.',
      ),

      h2('Spinner'),
      p(
        'Es gibt keine Spinner-Komponente — der Spinner ist ein Icon, und ',
        code('spin'),
        ' ist das, was es dreht. Wie jedes Icon wird es in ',
        code('em'),
        ' bemessen und passt so zu dem Text neben ihm, ohne eine Größe genannt zu bekommen.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('Der Spinner im Zusammenhang'),
      p(
        'Gib einem allein stehenden Spinner ein ',
        code('label'),
        ', damit er angesagt wird. Einer in einem Button braucht keines — der Button sagt schon, was er tut.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Lädt' }),
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
      p(code('setProgress()'), ' aus ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'Der Balken oder die id eines Balkens. Trägt kein Element diese id, wird sie als Selektor versucht.'],
        ['value', 'number | null', '', 'Wohin er soll. null gibt ihn zurück an die unbestimmte Animation.'],
        ['options.max', 'number', '100', 'Was als fertig zählt. Wird für die folgenden Aufrufe gemerkt.'],
      ]),
      p(
        'Der Spinner hat keine eigenen Props — er ist ',
        code("icon('spinner', { spin: true })"),
        ' und nimmt, was ',
        code('icon()'),
        ' nimmt.',
      ),
    ],
  })
