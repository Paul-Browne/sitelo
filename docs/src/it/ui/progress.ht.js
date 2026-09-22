import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Avanzamento',
    description:
      'Una barra per un lavoro di cui si conosce la fine, una rotella per uno di cui non si sa.',
    activeHref: '/it/ui/progress',
    children: [
      p(
        'Usa una barra determinata ogni volta che sai quanto manca — è l’unica che dica davvero qualcosa a chi legge. Ometti ',
        code('value'),
        ' e la barra si anima invece, il che dice “sto ancora lavorando” e niente di più.',
      ),

      h2('Determinata'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Indeterminata'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Una barra senza ',
        code('label'),
        ' è marcata ',
        code('aria-hidden'),
        ' — un ruolo progressbar senza nome accessibile non dice nulla a uno screen reader, quindi una barra senza etichetta è trattata come decorazione. Metti un’etichetta a tutto ciò che chi legge deve seguire.',
      ),

      h2('Etichette'),
      p(
        'Un’etichetta dice che cosa sta succedendo; ',
        code('showValue'),
        ' aggiunge la percentuale a destra.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Rendering delle pagine', showValue: true }),
  progress({ value: 30, max: 60, label: 'Ottimizzazione delle immagini', showValue: true }),
  progress({ label: 'In attesa del deploy' }),
)`, { align: 'stretch' }),

      h2('Colori e altezza'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Superato', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Degradato', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'In fallimento', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Una scala diversa da 100'),
      p(
        code('max'),
        ' ti lascia passare i numeri grezzi — pagine costruite su pagine totali — invece di dover calcolare prima una percentuale.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 di 169 pagine', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Muoverla dal browser'),
      p(
        'Una barra è HTML renderizzato dal server: la percentuale è una proprietà personalizzata sul riempimento e un numero in ',
        code('aria-valuenow'),
        ', e niente nella pagina cambia l’una o l’altro da solo. Dai alla barra un ',
        code('id'),
        ' e ',
        code('setProgress'),
        ' li muove insieme — il riempimento, il valore annunciato e la percentuale accanto all’etichetta.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'Il massimo viene ricordato, quindi le chiamate successive sono solo un valore. Oppure raggiungi il modulo come lo raggiungono i componenti, e salta del tutto il bundle:',
      ),
      codeBlock('Ovunque', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Finito')`, 'javascript'),
      p(
        'Passare ',
        code('null'),
        ' — o qualunque cosa non sia un numero finito — restituisce la barra all’animazione indeterminata, così un lavoro che smette di riportare numeri non ha bisogno di un caso speciale. ',
        code('getProgress()'),
        ' rilegge il valore corrente, sulla scala della barra stessa.',
      ),

      h2('Provalo'),
      p(
        'Questa pagina carica il runtime, quindi i pulsanti qui sotto muovono davvero la barra.',
      ),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Caricamento', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Azzera'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Fatto'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Ignoto'),
  ),
)`, { align: 'stretch' }),
      p(
        'Anche una barra senza etichetta viene mossa, ma resta ',
        code('aria-hidden'),
        ' — è stata renderizzata senza nome di proposito, e annunciarne ora un valore metterebbe nell’albero di accessibilità una progressbar senza nome.',
      ),

      h2('Rotella'),
      p(
        'Non esiste un componente rotella — la rotella è un’icona, e ',
        code('spin'),
        ' è ciò che la fa girare. Come ogni icona è dimensionata in ',
        code('em'),
        ', quindi si accorda al testo accanto a cui sta senza che le si dica una dimensione.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('La rotella in contesto'),
      p(
        'Dai a una rotella isolata una ',
        code('label'),
        ' così viene annunciata. Una dentro un pulsante non ne ha bisogno — il pulsante dice già cosa sta facendo.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Caricamento' }),
    text({ variant: 'small', tone: 'muted' }, 'Recupero dell’ultima build…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Pubblicazione'),
    button({ variant: 'outline', loading: true }, 'Controllo dei link'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — esportata anche come ', code('progressBar'), ':'),
      propsTable([
        ['value', 'number', '', 'A che punto è. Omettilo per l’animazione indeterminata.'],
        ['max', 'number', '100', 'Quale valore conta come completo.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colore del riempimento.'],
        ['label', 'Child', '', 'Testo sopra la barra; anche il suo nome accessibile.'],
        ['showValue', 'boolean', 'false', 'Mostra la percentuale accanto all’etichetta.'],
        ['height', 'Space', "'0.5rem'", 'Spessore della barra.'],
      ]),
      p(code('setProgress()'), ' da ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'La barra, o l’id di una. Se nessun elemento ha quell’id si prova come selettore.'],
        ['value', 'number | null', '', 'Dove spostarla. null la riporta all’animazione indeterminata.'],
        ['options.max', 'number', '100', 'Cosa conta come completo. Ricordato per le chiamate successive.'],
      ]),
      p(
        'La rotella non ha props proprie — è ',
        code("icon('spinner', { spin: true })"),
        ', e accetta quello che accetta ',
        code('icon()'),
        '.',
      ),
    ],
  })
