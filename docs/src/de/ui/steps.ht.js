import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Schritte',
    description:
      'Ein nummerierter Ablauf, in dem die zurückgelegten Schritte als erledigt markiert sind.',
    activeHref: '/de/ui/steps',
    extraHead: uiHead(),
    children: [
      p(
        code('current'),
        ' ist der Index des Schritts, der gerade läuft. Alles davor ist abgeschlossen und bekommt ein Häkchen; alles danach steht noch aus. Der aktuelle trägt ',
        code('aria-current="step"'),
        ' und wird damit nicht nur eingefärbt, sondern auch angesagt.',
      ),

      h2('Einfache Schritte'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Installieren' },
    { title: 'Eine Seite schreiben' },
    { title: 'Bauen' },
    { title: 'Deployen' },
  ],
})`, { align: 'stretch' }),

      h2('Mit Beschreibungen'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Installieren', description: 'npm install -D sitelo' },
    { title: 'Eine Seite schreiben', description: 'src/index.ht.js' },
    { title: 'Bauen', description: 'sitelo build' },
    { title: 'Deployen', description: 'dist/ veröffentlichen' },
  ],
})`, { align: 'stretch' }),

      h2('Vertikal'),
      p('Besser, wenn die Beschreibungen länger als ein paar Wörter sind.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Das Paket hinzufügen', description: 'sitelo bringt sein eigenes Vite mit, es gibt also nichts weiter zu installieren.' },
    { title: 'Eine Funktion schreiben, die HTML zurückgibt', description: 'Eine Datei unter src/ ist bereits eine ganze Website.' },
    { title: 'Die Ausgabe veröffentlichen', description: 'dist/ sind schlichte statische Dateien — jeder Host nimmt sie.' },
  ],
})`, { align: 'stretch' }),

      h2('Noch nichts erledigt'),
      demo(`steps({ current: 0, items: ['Installieren', 'Konfigurieren', 'Deployen'] })`, { align: 'stretch' }),

      h2('Alles erledigt'),
      p(
        'Setze ',
        code('current'),
        ' hinter den letzten Index, und jeder Schritt liest sich als abgeschlossen.',
      ),
      demo(`steps({ current: 3, items: ['Installieren', 'Konfigurieren', 'Deployen'] })`, { align: 'stretch' }),

      h2('Am Telefon'),
      p(
        'Eine waagerechte Reihe hat auf schmalem Bildschirm keinen Platz, deshalb wird sie unterhalb von 40rem von selbst senkrecht — ohne Prop. Mach dieses Fenster schmaler, um es zu sehen.',
      ),

      h2('Sie beschriften'),
      p(
        'Die Liste ist ein ',
        code('<ol>'),
        ', das die Reihenfolge bereits trägt. Ergänze ',
        code('label'),
        ', wenn eine Seite mehr als eine Schrittfolge hat und sie auseinandergehalten werden müssen.',
      ),
      demo(`steps({
  label: 'Fortschritt des Deployments',
  current: 1,
  items: ['Bauen', 'Hochladen', 'Cache invalidieren'],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Strings oder { title, description }-Objekte.'],
        ['current', 'number', '0', 'Index des laufenden Schritts.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Anordnung. Waagerecht wird unter 40rem senkrecht.'],
        ['label', 'string', '', 'Zugänglicher Name der Liste.'],
      ]),
    ],
  })
