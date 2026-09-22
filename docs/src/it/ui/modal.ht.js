import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Modale',
    description:
      'Una finestra di dialogo costruita sull’API popover — il browser si occupa di apertura, sfondo, clic fuori ed Escape.',
    activeHref: '/it/ui/modal',
    children: [
      p(
        'Un modale è un elemento ',
        code('popover'),
        '. Qualunque pulsante il cui ',
        code('popovertarget'),
        ' combacia con l’',
        code('id'),
        ' del modale lo apre — nessuno script da nessuna parte, sfondo, chiusura leggera, Escape e gestione del focus compresi, di cui è il browser a farsi carico.',
      ),
      p(
        'È per questo che ',
        code('id'),
        ' è obbligatorio e che il componente solleva un errore senza — l’id è tutto il collegamento.',
      ),

      h2('Modale di base'),
      p('Ogni modale di questa pagina si apre davvero — provalo.'),
      demo(`fragment(
  button({ popovertarget: 'demo-basic' }, 'Apri il modale'),
  modal({ id: 'demo-basic', title: 'Ricostruire il sito?' },
    'Esegue sitelo build e ripubblica dist/.',
  ),
)`),

      h2('Con un piè di pagina'),
      p(
        'Un pulsante di chiusura è un qualunque pulsante che punta allo stesso id con ',
        code('popovertargetaction="hide"'),
        '.',
      ),
      demo(`fragment(
  button({ color: 'danger', popovertarget: 'demo-confirm' }, 'Elimina la pagina…'),
  modal({
    id: 'demo-confirm',
    title: 'Eliminare questa pagina?',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'demo-confirm',
        popovertargetaction: 'hide',
      }, 'Annulla'),
      button({ color: 'danger' }, 'Elimina'),
    ),
  }, 'Non si può annullare. L’HTML generato viene rimosso alla prossima build.'),
)`),

      h2('Dimensioni'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-sm' }, 'Piccolo'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-md' }, 'Medio'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-lg' }, 'Grande'),
  ),
  modal({ id: 'demo-sm', size: 'sm', title: 'Piccolo' }, 'size: sm — circa 24rem.'),
  modal({ id: 'demo-md', title: 'Medio' }, 'Il predefinito — circa 32rem.'),
  modal({ id: 'demo-lg', size: 'lg', title: 'Grande' }, 'size: lg — circa 48rem.'),
)`),

      h2('Form dentro un modale'),
      demo(`fragment(
  button({ variant: 'soft', popovertarget: 'demo-form' }, 'Nuova pagina…'),
  modal({
    id: 'demo-form',
    title: 'Nuova pagina',
    footer: stack({ direction: 'row', gap: 'sm' },
      button({ variant: 'ghost', color: 'neutral', popovertarget: 'demo-form', popovertargetaction: 'hide' }, 'Annulla'),
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
        ' toglie la × nell’angolo. Escape e il clic fuori lo chiudono comunque — un popover non si può rendere davvero bloccante, e di solito è il comportamento giusto.',
      ),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-bare' }, 'Nessun pulsante di chiusura'),
  modal({ id: 'demo-bare', title: 'Premi Escape', closable: false },
    'Oppure clicca in un punto qualsiasi fuori da questa finestra.',
  ),
)`),

      h2('Contenuto lungo'),
      p('Il corpo scorre; intestazione e piè di pagina restano fermi.'),
      demo(`fragment(
  button({ variant: 'outline', color: 'neutral', popovertarget: 'demo-long' }, 'Modale lungo'),
  modal({
    id: 'demo-long',
    title: 'Note di rilascio',
    footer: button({ popovertarget: 'demo-long', popovertargetaction: 'hide' }, 'Chiudi'),
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
        'La pagina dietro un modale aperto non scorre. È l’unica cosa che l’API popover lascia a te, e qui è fatta in CSS — nessuno script, e niente da inizializzare. Passa ',
        code('lockScroll: false'),
        ' per lasciare che lo sfondo scorra come al solito.',
      ),

      h2('Supporto dei browser'),
      p(
        'L’API popover è disponibile in tutti i browser attuali. In uno troppo vecchio per conoscerla, il modale viene renderizzato in linea nella pagina invece che sopra di essa — visibile e usabile, solo non sovrapposto. Non sparisce nulla.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obbligatorio. Ciò a cui punta il popovertarget di un innesco.'],
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
