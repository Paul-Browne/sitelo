import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Avviso',
    description:
      'Un messaggio sullo stato di qualcosa, con un’icona e un ruolo di annuncio che seguono il colore.',
    activeHref: '/it/ui/alert',
    children: [
      p(
        'Un avviso dice a chi legge qualcosa sulla pagina o su un’azione che ha compiuto. Il colore sceglie insieme l’icona e il ruolo ARIA: ',
        code('danger'),
        ' e ',
        code('warning'),
        ' si annunciano come ',
        code('role="alert"'),
        ', tutto ciò che è più sommesso è un garbato ',
        code('role="status"'),
        '.',
      ),

      h2('Colori'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Attenzione' }, 'È disponibile una nuova versione di sitelo.'),
  alert({ color: 'success', title: 'Pubblicato' }, '169 pagine pubblicate in 1,7 secondi.'),
  alert({ color: 'warning', title: 'Pagina lenta' }, 'Una pagina ha impiegato più di 500 ms per essere renderizzata.'),
  alert({ color: 'danger', title: 'Build fallita' }, 'Due link interni puntano a pagine che non esistono.'),
  alert({ color: 'neutral', title: 'Nota' }, 'In questo progetto le island sono disattivate.'),
)`, { align: 'stretch' }),

      h2('Senza titolo'),
      p(
        'Un avviso di una riga non ha bisogno di un’intestazione sopra la frase.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Salvato.'),
  alert({ color: 'danger' }, 'Quell’indirizzo email è già in uso.'),
)`, { align: 'stretch' }),

      h2('Varianti'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'La predefinita — una superficie tinta.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Trasparente, con un bordo colorato.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'Il colore pieno della palette, per qualcosa che non deve sfuggire.'),
)`, { align: 'stretch' }),

      h2('Icone'),
      p(
        'Ogni colore ha un’icona predefinita. Passa il tuo markup come ',
        code('icon'),
        ', oppure ',
        code('icon: false'),
        ' per non averne alcuna.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Nessuna icona' }, 'Solo il testo.'),
  alert({
    color: 'primary',
    title: 'Un’icona personalizzata',
    icon: icon('star'),
  }, 'Va bene qualunque SVG — le icone sono markup, non una dipendenza.'),
)`, { align: 'stretch' }),

      h2('Richiudibile'),
      p('Il pulsante di chiusura porta con sé il proprio handler:'),
      codeBlock(
        'Markup renderizzato',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Quindi l’avviso qui sotto si chiude davvero senza che nulla sia stato importato in questa pagina. Se quel modulo non arriva mai, il pulsante viene renderizzato e non fa nulla, ed è per questo che un avviso non dovrebbe mai essere l’unico posto in cui un messaggio compare.',
      ),
      demo(`alert({ color: 'primary', title: 'Richiudibile', dismissible: true },
  'Clicca la × — l’handler si scarica da sé alla prima pressione.',
)`, { align: 'stretch' }),

      h2('Contenuto ricco'),
      p(
        'Gli avvisi accettano qualunque figlio, quindi un’azione o un elenco possono vivere al loro interno.',
      ),
      demo(`alert({ color: 'danger', title: 'Controllo dei link fallito' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Due link puntano a pagine che non sono state generate:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'collegato da /docs' }),
      listItem({ title: '/blog/draft', description: 'collegato da /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Mostra i dettagli'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Ignora'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Sceglie la palette, l’icona predefinita e il ruolo ARIA.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Quanto peso porta l’avviso.'],
        ['title', 'Child', '', 'Prima riga in grassetto.'],
        ['icon', 'Child | false', '', 'Markup di un’icona personalizzata, oppure false per nessuna.'],
        ['dismissible', 'boolean', 'false', 'Aggiunge un pulsante di chiusura che importa il proprio handler.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Nome accessibile di quel pulsante.'],
      ]),
    ],
  })
