import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toast',
    description:
      'Un messaggio passeggero nell’angolo, aggiunto da script in una regione che la pagina ha renderizzato.',
    activeHref: '/it/ui/toast',
    children: [
      p(
        'Un toast è l’unico componente qui che non può essere statico: compare in risposta a qualcosa che succede. La pagina renderizza una regione vuota con ',
        code('toasts()'),
        ', e ',
        code('toast()'),
        ' da ',
        code('sitelo/ui/client'),
        ' ci aggiunge dentro.',
      ),
      p(
        'La regione è una live region garbata, quindi ciò che vi viene aggiunto è annunciato senza rubare il focus.',
      ),

      h2('Come si imposta'),
      p(
        'Metti la regione in un punto qualsiasi del body — è a posizione fissa, quindi dove non importa:',
      ),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …la pagina…
  toasts(),
)`, 'javascript'),
      p(
        'Questa è l’unica parte del runtime che niente nella pagina fa scattare al posto tuo, quindi è l’unica parte che raggiungi tu — da un attributo di evento, senza nulla nel bundle:',
      ),
      codeBlock('Ovunque', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Salvato.',{color:'success'}))" }, 'Salva')`, 'javascript'),
      p('Oppure dal tuo modulo, quando ne hai già uno in esecuzione:'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

toast('Salvato.', { color: 'success' })`, 'javascript'),

      h2('Provalo'),
      p(
        'Questa pagina renderizza una regione ',
        code('toasts()'),
        ' e i pulsanti qui sotto si vanno a prendere il runtime da sé, quindi producono davvero dei toast — in basso a destra. Niente viene caricato finché non ne premi uno.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "import('/su/toast.js').then(m=>m.toast('Salvato.',{color:'success'}))",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "import('/su/toast.js').then(m=>m.toast('Due pagine non hanno la meta description.',{color:'warning'}))",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "import('/su/toast.js').then(m=>m.toast('La build è fallita. Controlla il report dei link.',{color:'danger'}))",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "import('/su/toast.js').then(m=>m.toast('Questo resta finché non lo chiudi.',{color:'neutral',duration:0}))",
  }, 'Finché non lo chiudi'),
)`),
      // La live region in cui i pulsanti di questa pagina aggiungono. È a
      // posizione fissa, quindi viene renderizzata qui ma compare
      // nell’angolo del viewport.
      preview('toasts()'),

      h2('Opzioni'),
      p(
        code('duration'),
        ' è quanto resta il toast, in millisecondi; ',
        code('0'),
        ' lo tiene su finché qualcuno non lo chiude. Ogni toast riceve un pulsante di chiusura, collegato allo stesso handler che usa un avviso.',
      ),
      codeBlock('Opzioni', `toast('Salvato.', { color: 'success' })
toast('Ancora al lavoro…', { color: 'neutral', duration: 0 })
toast('Pubblicato in 1,7s', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Cosa renderizza'),
      p(
        'Un toast è un ',
        code('alert()'),
        ' nella regione dei toast — stesso markup, stessi colori, stesso pulsante di chiusura. Niente di nuovo da imparare, e niente di extra da stilizzare.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Salvato.'),
  alert({ color: 'danger', dismissible: true }, 'La build è fallita. Controlla il report dei link.'),
)`, { align: 'stretch' }),

      h2('Quando usarne uno'),
      p(
        'Un toast serve a confermare qualcosa che chi legge ha appena fatto. È il posto sbagliato per qualunque cosa su cui debba agire o che debba leggere con attenzione — sparisce, è facile non vederlo, e su un sito statico la maggior parte dei messaggi sta nella pagina stessa come ',
        code('alert()'),
        '.',
      ),

      h2('Props'),
      p(
        code('toasts()'),
        ' non accetta props proprie. ',
        code('toast()'),
        ' da ',
        code('sitelo/ui/client'),
        ':',
      ),
      propsTable([
        ['message', 'string', '', 'Il testo. Impostato come textContent, quindi non viene mai interpretato come markup.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Quale palette usare.'],
        ['duration', 'number', '4000', 'Millisecondi prima che sparisca. 0 lo tiene su.'],
      ], { headers: ['Argomento', 'Tipo', 'Predefinito', 'Descrizione'] }),
      p(
        'Restituisce l’elemento che ha aggiunto, oppure ',
        code('null'),
        ' quando la pagina non ha una regione ',
        code('toasts()'),
        '.',
      ),
    ],
  })
