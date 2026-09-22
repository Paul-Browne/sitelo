import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Cursore',
    description: 'Un input range nativo, stilizzato per stare con gli altri controlli.',
    activeHref: '/it/ui/slider',
    children: [
      p(
        'Questo è un vero ',
        code('<input type="range">'),
        ' — i tasti freccia, Home e Fine, e l’annuncio corretto arrivano tutti dal browser. Sono stilizzati soltanto la barra e il cursore.',
      ),

      h2('Cursore di base'),
      demo(`sliderField({ label: 'Qualità', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Intervallo e passo'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Volume', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Colonne', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Scala', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Mostrare il valore'),
      p(
        code('showValue'),
        ' mette accanto alla barra un ',
        code('<output>'),
        ' che porta il valore con cui la pagina è stata costruita, e l’input si va a prendere il proprio handler al primo trascinamento, così il numero segue il cursore. Non c’è niente da importare: un valore che diventasse obsoleto in silenzio sarebbe peggio di nessun valore, quindi questo non è lasciato a te.',
      ),
      demo(`sliderField({
  label: 'Qualità delle immagini',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Più alta significa file più grandi e build più lente.',
})`, { align: 'stretch' }),

      h2('Impostarlo dal tuo codice'),
      p(
        'Un cursore è un controllo di form, quindi appartiene a chi legge — ma un valore predefinito, un pulsante di ripristino o un valore che arriva dalla rete devono comunque poterlo muovere. Dagli un ',
        code('id'),
        ' e ',
        code('setSlider'),
        ' lo fa, portandosi dietro l’',
        code('<output>'),
        '.',
      ),
      codeBlock('src/main.js', `import { setSlider } from 'sitelo/ui/client'

setSlider('volume', 50)`, 'javascript'),
      p(
        'Oppure raggiungi il modulo come lo raggiungono i componenti, e salta del tutto il bundle:',
      ),
      codeBlock('Ovunque', `button({ onclick: "import('/su/slider.js').then(m=>m.set('volume',50))" }, 'Metà')`, 'javascript'),
      p(
        'Il browser riporta il valore fra ',
        code('min'),
        ' e ',
        code('max'),
        ' e lo aggancia a ',
        code('step'),
        ', quindi quello che torna è dove il cursore è atterrato più che quello che gli è stato passato. Seguono ',
        code('input'),
        ' e ',
        code('change'),
        ', perché un’anteprima in ascolto del trascinamento non ha altro modo di accorgersi di uno spostamento che non ha causato lei. ',
        code('getSlider()'),
        ' rilegge il valore.',
      ),

      h2('Provalo'),
      p(
        'Questa pagina carica il runtime, quindi i pulsanti qui sotto muovono davvero il cursore.',
      ),
      demo(`stack({ gap: 'md' },
  slider({ id: 'demo-slider', value: 40, showValue: true, 'aria-label': 'Demo' }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',0))" }, 'Min'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',50))" }, 'Metà'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',100))" }, 'Max'),
  ),
)`, { align: 'stretch' }),

      h2('Colori'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Disattivato'),
      demo(`sliderField({ label: 'Bloccato', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Senza etichetta'),
      p(
        'Un ',
        code('slider()'),
        ' nudo è il solo controllo — dagli un ',
        code('aria-label'),
        ' quando non c’è un’etichetta visibile che lo indichi.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Dimensione del testo' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('In un form'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Larghezza massima delle immagini', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Qualità', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Salva'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['min', 'number | string', '0', 'Limite inferiore.'],
        ['max', 'number | string', '100', 'Limite superiore.'],
        ['step', 'number | string', '', 'Incremento. Omettilo per il predefinito del browser, che è 1.'],
        ['value', 'number | string', '', 'Valore iniziale.'],
        ['showValue', 'boolean', 'false', 'Aggiunge un <output> con il valore della build.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colore del cursore.'],
        ['name', 'string', '', 'Nome del campo del form; da esso si ricava l’id.'],
        ['disabled', 'boolean', 'false', 'Disattiva il controllo.'],
      ]),
      p(
        code('sliderField()'),
        ' accetta in più ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' e ',
        code('required'),
        ' — vedi ',
        code('textField()'),
        '.',
      ),
    ],
  })
