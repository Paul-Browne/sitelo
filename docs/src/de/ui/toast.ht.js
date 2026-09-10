import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toast',
    description:
      'Eine flüchtige Meldung in der Ecke, per Skript in einen Bereich eingefügt, den die Seite gerendert hat.',
    activeHref: '/de/ui/toast',
    children: [
      p(
        'Der Toast ist die eine Komponente hier, die nicht statisch sein kann: er erscheint, weil etwas passiert. Die Seite rendert mit ',
        code('toasts()'),
        ' einen leeren Bereich, und ',
        code('toast()'),
        ' aus ',
        code('sitelo/ui/client'),
        ' hängt darin etwas an.',
      ),
      p(
        'Der Bereich ist eine höfliche Live-Region, sodass alles Angehängte angesagt wird, ohne den Fokus zu stehlen.',
      ),

      h2('Einrichtung'),
      p('Setze den Bereich irgendwo in den Body — er ist fix positioniert, das Wo spielt also keine Rolle:'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …die Seite…
  toasts(),
)`, 'javascript'),
      p(
        'Das ist der eine Teil des Runtimes, den nichts auf der Seite für dich auslöst — also der eine Teil, den du selbst erreichst, aus einem Event-Attribut heraus und ohne irgendetwas zu bündeln:',
      ),
      codeBlock('Irgendwo', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Gespeichert.',{color:'success'}))" }, 'Speichern')`, 'javascript'),
      p('Oder aus deinem eigenen Modul, wenn ohnehin schon eines läuft:'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

toast('Gespeichert.', { color: 'success' })`, 'javascript'),

      h2('Probier es aus'),
      p(
        'Diese Seite rendert einen ',
        code('toasts()'),
        '-Bereich, und die Buttons unten holen sich das Runtime selbst — sie erzeugen also echte Toasts, unten rechts. Geladen wird nichts, bis du einen drückst.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "import('/su/toast.js').then(m=>m.toast('Gespeichert.',{color:'success'}))",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "import('/su/toast.js').then(m=>m.toast('Zwei Seiten haben keine Meta-Beschreibung.',{color:'warning'}))",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "import('/su/toast.js').then(m=>m.toast('Der Build ist fehlgeschlagen. Sieh in den Linkbericht.',{color:'danger'}))",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "import('/su/toast.js').then(m=>m.toast('Dieser bleibt, bis du ihn schließt.',{color:'neutral',duration:0}))",
  }, 'Bis zum Schließen'),
)`),
      // Die Live-Region, in die die Buttons dieser Seite anhängen. Sie ist
      // fix positioniert, wird also hier gerendert, erscheint aber in der
      // Ecke des Viewports.
      preview('toasts()'),

      h2('Optionen'),
      p(
        code('duration'),
        ' ist, wie lange der Toast bleibt, in Millisekunden; ',
        code('0'),
        ' lässt ihn stehen, bis jemand ihn schließt. Jeder Toast bekommt einen Schließen-Button, verdrahtet mit demselben Handler, den ein Hinweis nutzt.',
      ),
      codeBlock('Optionen', `toast('Gespeichert.', { color: 'success' })
toast('Arbeite noch…', { color: 'neutral', duration: 0 })
toast('In 1,7 s deployt', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Was er rendert'),
      p(
        'Ein Toast ist ein ',
        code('alert()'),
        ' im Toast-Bereich — gleiches Markup, gleiche Farben, gleicher Schließen-Button. Nichts Neues zu lernen und nichts zusätzlich zu gestalten.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Gespeichert.'),
  alert({ color: 'danger', dismissible: true }, 'Der Build ist fehlgeschlagen. Sieh in den Linkbericht.'),
)`, { align: 'stretch' }),

      h2('Wann man einen nimmt'),
      p(
        'Ein Toast bestätigt etwas, das die Leserin gerade getan hat. Für alles, worauf sie reagieren oder was sie sorgfältig lesen muss, ist er der falsche Ort — er verschwindet, man übersieht ihn leicht, und auf einer statischen Website gehören die meisten Meldungen als ',
        code('alert()'),
        ' in die Seite selbst.',
      ),

      h2('Props'),
      p(code('toasts()'), ' nimmt keine eigenen Props. ', code('toast()'), ' aus ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['message', 'string', '', 'Der Text. Wird als textContent gesetzt, also nie als Markup geparst.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Welche Palette genutzt wird.'],
        ['duration', 'number', '4000', 'Millisekunden bis zum Verschwinden. 0 lässt ihn stehen.'],
      ], { headers: ['Argument', 'Typ', 'Standard', 'Beschreibung'] }),
      p(
        'Er gibt das eingefügte Element zurück, oder ',
        code('null'),
        ', wenn die Seite keinen ',
        code('toasts()'),
        '-Bereich hat.',
      ),
    ],
  })
