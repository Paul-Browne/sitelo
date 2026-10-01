import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Modale',
    description:
      'Un vero <dialog>, aperto in modo modale — il browser si occupa di sfondo, focus, Escape e clic fuori.',
    activeHref: '/it/ui/modal',
    children: [
      p(
        'Un modale è un ',
        code('<dialog>'),
        '. Qualunque pulsante con ',
        code('commandfor'),
        ' che punta all’',
        code('id'),
        ' del modale e ',
        code("command: 'show-modal'"),
        ' lo apre in modo modale: la pagina dietro diventa inerte, quindi focus e lettore di schermo restano dentro. Nessuno script da nessuna parte — sfondo, Escape e clic fuori sono tutti compito del browser.',
      ),
      p(
        'È per questo che ',
        code('id'),
        ' è obbligatorio e che il componente solleva un errore senza — l’id è tutto il collegamento.',
      ),

      h2('Modale di base'),
      p('Ogni modale di questa pagina si apre davvero — provalo.'),
      demo(`fragment(
  button({ commandfor: 'demo-basic', command: 'show-modal' }, 'Apri il modale'),
  modal({ id: 'demo-basic', title: 'Ricostruire il sito?' },
    'Esegue sitelo build e ripubblica dist/.',
  ),
)`),

      h2('Con un piè di pagina'),
      p(
        'Un pulsante di chiusura è un qualunque pulsante che punta allo stesso id con ',
        code("command: 'close'"),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', commandfor: 'demo-confirm', command: 'show-modal' }, 'Elimina la pagina…'),
  modal({
    id: 'demo-confirm',
    title: 'Eliminare questa pagina?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'demo-confirm',
        command: 'close',
      }, 'Annulla'),
      button({ color: 'danger' }, 'Elimina'),
    ),
  }, 'Non si può annullare. L’HTML generato viene rimosso alla prossima build.'),
)`),

      h2('Dimensioni'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-sm', command: 'show-modal' }, 'Piccolo'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-md', command: 'show-modal' }, 'Medio'),
    button({ variant: 'outline', color: 'neutral', commandfor: 'demo-lg', command: 'show-modal' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Piccolo' }, 'size: sm — circa 24rem.'),
  modal({ id: 'demo-md', title: 'Medio' }, 'Il predefinito — circa 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — circa 48rem.'),
)`),

      h2('Form dentro un modale'),
      demo(`fragment(
  button({ variant: 'soft', commandfor: 'demo-form', command: 'show-modal' }, 'Nuova pagina…'),
  modal({
    id: 'demo-form',
    title: 'Nuova pagina',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', commandfor: 'demo-form', command: 'close' }, 'Annulla'),
      button({ type: 'submit' }, 'Crea'),
    ),
  },
    stack({ gap: 'md' },
      textField({ label: 'Titolo', name: 'modal-title', placeholder: 'Informazioni' }),
      selectField({ label: 'Estensione', name: 'modal-ext', options: ['.ht.js', '.ht.ts', '.ht.jsx'] }),
    ),
  ),
)`),

      h2('Senza pulsante di chiusura'),
      p(
        code('closable: false'),
        ' toglie la × nell’angolo. Escape e il clic fuori lo chiudono comunque; con ',
        code("closedby: 'closerequest'"),
        ' lo chiude solo Escape.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-bare', command: 'show-modal' }, 'Nessun pulsante di chiusura'),
  modal({ id: 'demo-bare', title: 'Premi Escape', closable: false },
    'Oppure clicca in un punto qualsiasi fuori da questa finestra.',
  ),
)`),

      h2('Contenuto lungo'),
      p('Il corpo scorre; intestazione e piè di pagina restano fermi.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', commandfor: 'demo-long', command: 'show-modal' }, 'Modale lungo'),
  modal({
    id: 'demo-long',
    title: 'Note di rilascio',
    footer: button({ commandfor: 'demo-long', command: 'close' }, 'Chiudi'),
  },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Modifica ' + (index + 1) + ' — qualcosa è stato corretto.'),
      ),
    ),
  ),
)`),

      h2('Scorrimento dello sfondo'),
      p(
        'La pagina dietro un modale aperto non scorre. È l’unica cosa che una finestra di dialogo modale lascia a te, e qui è fatta in CSS — nessuno script, e niente da inizializzare. Passa ',
        code('lockScroll: false'),
        ' per lasciare che lo sfondo scorra come al solito.',
      ),

      h2('Supporto dei browser'),
      p(
        'Aprire una finestra di dialogo con il command di un pulsante funziona in tutti i browser attuali — Chrome 135, Firefox 144 e Safari 26.2 o successivi. In uno più vecchio, button() aggiunge un onclick che carica qualche centinaio di byte di /su/dialog.js per fare lo stesso — solo lì, e solo al primo clic. Safari non chiude ancora una finestra di dialogo al clic fuori (closedby), e lì se ne occupa lo stesso file.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obbligatorio. Ciò a cui punta il commandfor di un innesco.'],
        ['title', 'Child', '', 'Intestazione, e nome accessibile della finestra di dialogo.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Larghezza massima.'],
        ['footer', 'Child', '', 'Riga in fondo, su una fascia tinta a sé.'],
        ['closable', 'boolean', 'true', 'Mostra la × nell’intestazione.'],
        ['closeLabel', 'string', "'Close'", 'Nome accessibile di quel pulsante.'],
        ['lockScroll', 'boolean', 'true', 'Impedisce alla pagina dietro di scorrere mentre è aperto.'],
      ]),
      p(
        code('closeButton({ target })'),
        ' renderizza quella × da sola, per un’intestazione che costruisci tu.',
      ),
    ],
  })
