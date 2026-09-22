import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menu',
    description:
      'Un menu a tendina costruito su <details>, così si apre e si chiude senza alcuno script.',
    activeHref: '/it/ui/menu',
    children: [
      p(
        'Un menu è un ',
        code('<details>'),
        ' con un pannello stilizzato. È una scelta voluta rispetto all’API popover: un popover vive nel livello superiore e non si può posizionare rispetto al proprio innesco senza l’anchor positioning, che non è ancora ovunque. Un ',
        code('<details>'),
        ' si posiziona correttamente già oggi e non ha bisogno di caricare nulla.',
      ),
      p(
        'L’innesco è quel ',
        code('<summary>'),
        ', stilizzato come un pulsante — quindi passi l’etichetta e le props del pulsante a ',
        code('menu()'),
        ' invece di passare un ',
        code('button()'),
        ' già renderizzato. Un summary è già interattivo, e un pulsante al suo interno annida due controlli dove c’è una sola azione: markup non valido, e due fermate di tabulazione per una cosa sola.',
      ),
      p(
        'La chiusura al clic fuori e con Escape arrivano da un handler ',
        code('ontoggle'),
        ' che le importa la prima volta che un menu viene aperto — e solo allora. Se quel modulo non arriva mai, un menu si apre e si chiude comunque dal proprio summary.',
      ),

      h2('Menu di base'),
      demo(`menu({ trigger: 'Azioni' },
  menuItem({ href: '#edit' }, 'Modifica'),
  menuItem({ href: '#duplicate' }, 'Duplica'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Elimina'),
)`),

      h2('Allineamento'),
      p(
        'Un menu si apre dal bordo iniziale del proprio innesco. ',
        code("align: 'end'"),
        ' lo ribalta, che è ciò di cui ha bisogno un menu vicino al bordo destro di una barra.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Allineato all’inizio', variant: 'soft' },
    menuItem({ href: '#a' }, 'Primo'),
    menuItem({ href: '#b' }, 'Secondo'),
  ),
  menu({ trigger: 'Allineato alla fine', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Primo'),
    menuItem({ href: '#d' }, 'Secondo'),
  ),
)`, { align: 'stretch' }),

      h2('Inneschi a icona'),
      p(
        'Un’icona senza testo in ',
        code('trigger'),
        ' ha bisogno di una ',
        code('label'),
        ' — diventa il nome accessibile che l’icona non può fornire.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Altre azioni',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Rinomina'),
    menuItem({ href: '#move' }, 'Sposta'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Archivia'),
  ),
)`),

      h2('Elementi con icone'),
      demo(`menu({ trigger: 'File' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Nuova pagina'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Apri…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Costruisci il sito'),
)`),

      h2('Pulsanti invece di link'),
      p(
        'Un elemento senza ',
        code('href'),
        ' renderizza un ',
        code('<button>'),
        ' — per un’azione che avviene nella pagina invece di una navigazione.',
      ),
      demo(`menu({ trigger: 'Esporta', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Esportato come JSON.',{color:'success'}))" }, 'Come JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Esportato come CSV.',{color:'success'}))" }, 'Come CSV'),
)`),
      // La demo qui sopra fa comparire dei toast; questa è la regione in cui
      // atterrano. È a posizione fissa, quindi viene renderizzata qui ma
      // compare nell’angolo.
      preview('toasts()'),

      h2('In una barra applicazione'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Altro',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/docs' }, 'Documentazione'),
      menuItem({ href: '/examples' }, 'Esempi'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Accessibilità'),
      p(
        'Il pannello è un ',
        code('role="menu"'),
        ' i cui elementi sono ',
        code('role="menuitem"'),
        ', e il summary porta ',
        code('aria-haspopup'),
        '. Un ',
        code('<details>'),
        ' non è un widget menu nativo, quindi questa è un’approssimazione ragionevole più che una perfetta — per un semplice elenco di link, un ',
        code('nav'),
        ' dentro il details è altrettanto valido e promette meno.',
      ),

      h2('Props'),
      p(code('menu()'), ' — le props dell’innesco sono quelle del pulsante:'),
      propsTable([
        ['trigger', 'Child', '', 'Etichetta visibile. Passa del testo, non un button() già renderizzato.'],
        ['icon', 'Child', '', 'Markup prima dell’etichetta, o da solo per un innesco di sola icona.'],
        ['label', 'string', '', 'Nome accessibile. Obbligatorio quando c’è un’icona e nessun testo in trigger.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Stile dell’innesco.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Da quale palette attinge l’innesco.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Dimensione dell’innesco.'],
        ['align', "'start' | 'end'", "'start'", 'A quale bordo dell’innesco si allinea il pannello.'],
        ['triggerClass', 'string', '', 'Classi extra per l’innesco invece che per il details che lo avvolge.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Renderizza un’ancora; senza, un pulsante.'],
        ['icon', 'Child', '', 'Markup prima dell’etichetta.'],
        ['as', 'string', "'button'", 'Elemento da renderizzare quando non c’è href.'],
      ]),
      p(
        code('menuSeparator()'),
        ' non accetta props — è il filetto fra gruppi di elementi.',
      ),
    ],
  })
