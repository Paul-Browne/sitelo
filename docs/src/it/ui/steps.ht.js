import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Passaggi',
    description: 'Un percorso numerato, con i passaggi alle tue spalle segnati come fatti.',
    activeHref: '/it/ui/steps',
    children: [
      p(
        code('current'),
        ' è l’indice del passaggio in corso. Tutto ciò che lo precede è completo e riceve una spunta; tutto ciò che segue è ancora da venire. Quello corrente è marcato ',
        code('aria-current="step"'),
        ', quindi viene annunciato oltre che colorato.',
      ),

      h2('Passaggi di base'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Installa' },
    { title: 'Scrivi una pagina' },
    { title: 'Build' },
    { title: 'Pubblica' },
  ],
})`, { align: 'stretch' }),

      h2('Con descrizioni'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Installa', description: 'npm install -D sitelo' },
    { title: 'Scrivi una pagina', description: 'src/index.ht.js' },
    { title: 'Build', description: 'sitelo build' },
    { title: 'Pubblica', description: 'Pubblica dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Verticale'),
      p('Meglio quando le descrizioni sono più lunghe di qualche parola.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Aggiungi il pacchetto', description: 'sitelo porta con sé il proprio Vite, quindi non c’è altro da installare.' },
    { title: 'Scrivi una funzione che restituisce HTML', description: 'Un file sotto src/ è un sito intero.' },
    { title: 'Pubblica l’output', description: 'dist/ è fatta di semplici file statici — qualunque host se li prende.' },
  ],
})`, { align: 'stretch' }),

      h2('Ancora niente di fatto'),
      demo(`steps({ current: 0, items: ['Installa', 'Configura', 'Pubblica'] })`, { align: 'stretch' }),

      h2('Tutto fatto'),
      p(
        'Imposta ',
        code('current'),
        ' oltre l’ultimo indice e ogni passaggio si legge come completo.',
      ),
      demo(`steps({ current: 3, items: ['Installa', 'Configura', 'Pubblica'] })`, { align: 'stretch' }),

      h2('Su un telefono'),
      p(
        'Una riga orizzontale non ha dove andare su uno schermo stretto, quindi sotto i 40rem diventa verticale da sola — nessuna prop necessaria. Restringi questa finestra per vederlo.',
      ),

      h2('Dargli un nome'),
      p(
        'L’elenco è un ',
        code('<ol>'),
        ', che porta già con sé l’ordine. Aggiungi ',
        code('label'),
        ' quando la pagina ha più di una serie di passaggi e vanno distinte.',
      ),
      demo(`steps({
  label: 'Avanzamento della pubblicazione',
  current: 1,
  items: ['Build', 'Caricamento', 'Invalidazione della cache'],
})`, { align: 'stretch' }),

      h2('Far avanzare il percorso'),
      p(
        'Lo stato è fatto di tre nomi di classe e un ',
        code('aria-current'),
        ', sparsi su ogni passaggio. ',
        code('setStep()'),
        ' li muove insieme, così una procedura guidata che avanza nel browser è una sola chiamata invece di un ciclo.',
      ),
      p(
        'Un indice oltre l’ultimo passaggio li lascia tutti completi, che è l’aspetto di un percorso finito. Oppure da un attributo di evento, senza nulla nel bundle:',
      ),
      codeBlock('Ovunque', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Avanti')`, 'javascript'),
      p('Oppure dal tuo modulo, quando ne hai già uno in esecuzione:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Stringhe, oppure oggetti { title, description }.'],
        ['current', 'number', '0', 'Indice del passaggio in corso.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Disposizione. L’orizzontale diventa verticale sotto i 40rem.'],
        ['label', 'string', '', 'Nome accessibile dell’elenco.'],
      ]),
    ],
  })
