import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Pannello laterale',
    description:
      'Un pannello che entra dal bordo — stessa meccanica popover di un modale, forma diversa.',
    activeHref: '/it/ui/drawer',
    children: [
      p(
        'Un pannello laterale è un pannello a tutta altezza ancorato a un lato. Come ',
        code('modal()'),
        ', è un ',
        code('popover'),
        ': un pulsante con un ',
        code('popovertarget'),
        ' corrispondente lo apre, e il browser si occupa dello sfondo, del clic fuori e di Escape.',
      ),
      p(
        'Su un sito statico il suo compito più comune è il menu di navigazione su un telefono.',
      ),

      h2('Pannello di base'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Apri il pannello'),
  drawer({ id: 'drawer-basic', title: 'Impostazioni' },
    stack({ gap: 'md' },
      toggle({ label: 'Ricerca Pagefind', checked: true }),
      toggle({ label: 'Ottimizzazione delle immagini', checked: true }),
      toggle({ label: 'Island server' }),
    ),
  ),
)`),

      h2('Lati'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Dall’inizio'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Dalla fine'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Inizio' },
    text({ variant: 'small', tone: 'muted' }, 'Ancorato al bordo iniziale — la sinistra in una lingua che si legge da sinistra a destra.'),
  ),
  drawer({ id: 'drawer-end', title: 'Fine' },
    text({ variant: 'small', tone: 'muted' }, 'Il predefinito: ancorato al bordo finale.'),
  ),
)`),

      h2('Larghezza'),
      p(
        'Qualunque lunghezza CSS. È limitata al 90% del viewport, così anche un pannello largo sta in un telefono.',
      ),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Stretto'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Largo'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Stretto' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Largo' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Come menu di navigazione'),
      p(
        'Lo schema che vuole la maggior parte dei siti: un pulsante-menu nella barra, i link in un pannello.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Apri la navigazione',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Navigazione' },
    navLink({ href: '#docs', current: true }, 'Documentazione'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Esempi'),
    navLink({ href: '#about' }, 'Informazioni'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Inizia'),
  ),
)`, { align: 'stretch' }),

      h2('Un pannello di filtri'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filtri'),
  drawer({ id: 'drawer-filters', title: 'Filtri', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Tipo',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Guide' },
          { value: 'example', label: 'Esempi' },
          { value: 'all', label: 'Tutto' },
        ],
      }),
      choiceGroup({
        legend: 'Tag',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Annulla'),
        button('Applica'),
      ),
    ),
  ),
)`),

      h2('Scorrimento dello sfondo'),
      p(
        'La pagina dietro un pannello aperto non scorre — lo stesso blocco fatto di solo CSS che usa ',
        code('modal()'),
        ', senza script e senza niente da inizializzare. Passa ',
        code('lockScroll: false'),
        ' per lasciare che lo sfondo scorra come al solito.',
      ),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Obbligatorio. Ciò a cui punta il popovertarget di un innesco.'],
        ['title', 'Child', '', 'Intestazione, e nome accessibile della finestra di dialogo.'],
        ['side', "'start' | 'end'", "'end'", 'A quale bordo è ancorato.'],
        ['width', 'string', "'20rem'", 'Larghezza del pannello, limitata a 90vw.'],
        ['closable', 'boolean', 'true', 'Mostra la × nell’intestazione.'],
        ['closeLabel', 'string', "'Close'", 'Nome accessibile di quel pulsante.'],
        ['lockScroll', 'boolean', 'true', 'Impedisce alla pagina dietro di scorrere mentre è aperto.'],
      ]),
    ],
  })
