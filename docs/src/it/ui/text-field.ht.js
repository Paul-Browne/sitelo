import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Campo di testo',
    description:
      'Input di testo a una o più righe, con etichetta, testo di aiuto, messaggio di errore e id già collegati fra loro.',
    activeHref: '/it/ui/text-field',
    children: [
      p(
        'Qui ci sono due livelli. ',
        code('input()'),
        ' e ',
        code('textarea()'),
        ' sono i controlli nudi; ',
        code('textField()'),
        ' e ',
        code('textareaField()'),
        ' ne avvolgono uno in un’etichetta, un testo di aiuto e un messaggio di errore, e li collegano con ',
        code('for'),
        ' e ',
        code('aria-describedby'),
        '. Ricorri ai secondi, a meno che tu non stia costruendo la disposizione da solo.',
      ),

      h2('Campo di base'),
      demo(`textField({ label: 'Nome', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Testo di aiuto'),
      p(
        'Il testo di aiuto è collegato con ',
        code('aria-describedby'),
        ', così uno screen reader lo legge come parte del campo invece che come testo sciolto dopo di esso.',
      ),
      demo(`textField({
  label: 'Email',
  name: 'email',
  type: 'email',
  help: 'La usiamo solo per segnalarti le build fallite.',
})`, { align: 'stretch' }),

      h2('Obbligatorio ed errore'),
      p(
        'Un ',
        code('error'),
        ' marca il campo come non valido, colora il bordo, imposta ',
        code('aria-invalid'),
        ' e punta ',
        code('aria-describedby'),
        ' al messaggio — una prop, tutte e quattro le cose.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Progetto', name: 'project', required: true, value: '' }),
  textField({
    label: 'Sito',
    name: 'site',
    error: 'Quello non è un URL.',
    value: 'sitelo punto dev',
  }),
)`, { align: 'stretch' }),

      h2('Dimensioni'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Piccolo', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Medio', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Grande', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Ornamenti'),
      p(
        'Un prefisso o un suffisso attaccato al controllo stesso, per unità di misura e pezzi fissi di un valore.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Sito', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Timeout della build', name: 'timeout', endAdornment: 'secondi', value: '30' }),
)`, { align: 'stretch' }),

      h2('Disattivato e in sola lettura'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Disattivato', name: 'disabled', value: 'Non modificabile', disabled: true }),
  textField({ label: 'Sola lettura', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Più righe'),
      p(
        code('textareaField()'),
        ' è lo stesso campo attorno a un ',
        code('<textarea>'),
        '. Il suo valore è contenuto dell’elemento invece che un attributo, cosa di cui il componente si occupa al posto tuo.',
      ),
      demo(`textareaField({
  label: 'Descrizione',
  name: 'description',
  rows: 4,
  help: 'Mostrata nei risultati di ricerca e nelle schede social.',
  value: 'Generazione di siti statici senza configurazione, mossa da Vite.',
})`, { align: 'stretch' }),

      h2('In un form'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Nome', name: 'contact-name', required: true }),
      textField({ label: 'Email', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Messaggio', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Annulla'),
    button({ type: 'submit' }, 'Invia'),
  ),
)`, { align: 'stretch' }),

      h2('Costruirlo da sé'),
      p(
        code('field()'),
        ' è il solo involucro — accetta come figli qualunque controllo, così puoi mettere due input su una riga, o un controllo che questa libreria non ha, sotto lo stesso trattamento di etichetta ed errore.',
      ),
      p(
        'Una sola etichetta non può dare il nome a due controlli, quindi qui ogni input ha bisogno di un proprio nome accessibile. È quello che fanno gli ',
        code('aria-label'),
        ': l’etichetta visibile dà il nome alla coppia, e ogni input dice quale estremità è.',
      ),
      demo(`field({ label: 'Intervallo di date', help: 'Entrambi gli estremi sono inclusi.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'Da' }),
    input({ type: 'date', name: 'to', 'aria-label': 'A' }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      h3('textField e textareaField'),
      propsTable([
        ['label', 'Child', '', 'L’etichetta del campo. Da essa si ricava anche l’id del controllo quando non c’è name.'],
        ['name', 'string', '', 'Nome del campo del form; da esso si ricava l’id.'],
        ['help', 'Child', '', 'Suggerimento sotto il controllo, collegato con aria-describedby.'],
        ['error', 'Child | false', '', 'Messaggio di errore. Imposta anche aria-invalid sul controllo.'],
        ['required', 'boolean', 'false', 'Marca l’etichetta e il controllo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Altezza del controllo e dimensione del testo.'],
        ['type', 'string', "'text'", 'Qualunque tipo di input. Solo textField.'],
        ['startAdornment', 'Child', '', 'Prefisso attaccato al controllo. Solo textField.'],
        ['endAdornment', 'Child', '', 'Suffisso attaccato al controllo. Solo textField.'],
        ['value', 'string | number', '', 'Valore iniziale.'],
        ['fieldClass', 'string', '', 'Classe per l’involucro invece che per il controllo.'],
      ]),
      p(
        'Gli id si ricavano da ',
        code('name'),
        ' — o da ',
        code('label'),
        ' quando non c’è name — invece che da un contatore, così la stessa pagina produce lo stesso HTML a ogni build. Passa ',
        code('id'),
        ' per scavalcarli.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'Il testo dell’etichetta.'],
        ['help', 'Child', '', 'Suggerimento sotto il controllo.'],
        ['error', 'Child | false', '', 'Messaggio di errore; aggiunge anche lo stato non valido all’involucro.'],
        ['required', 'boolean', 'false', 'Aggiunge il marcatore di obbligatorietà all’etichetta.'],
        ['for', 'string', '', 'Id del controllo a cui l’etichetta si riferisce.'],
      ]),
    ],
  })
