import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Collegamento',
    description:
      'Un’ancora con stile, con gli attributi di sicurezza di cui ha bisogno un link esterno.',
    activeHref: '/it/ui/link',
    children: [
      p(
        'Un collegamento è un’ancora con il trattamento della sottolineatura e la palette della libreria. È esportato con due nomi — ',
        code('link'),
        ' e ',
        code('textLink'),
        ' — perché ',
        code('link'),
        ' è anche l’elemento ',
        code('<link>'),
        ' di javascript-to-html, e importarli entrambi con lo stesso nome è un errore di sintassi. Usa ',
        code('textLink'),
        ', oppure importa la libreria come namespace.',
      ),

      h2('Collegamento di base'),
      demo(`text('Leggi la ', link({ href: '/docs' }, 'documentazione'), ' per iniziare.')`, {
        align: 'stretch',
      }),

      h2('Colori'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  link({ href: '#', color: 'primary' }, 'Primary'),
  link({ href: '#', color: 'neutral' }, 'Neutral'),
  link({ href: '#', color: 'success' }, 'Success'),
  link({ href: '#', color: 'warning' }, 'Warning'),
  link({ href: '#', color: 'danger' }, 'Danger'),
)`),

      h2('Discreto'),
      p(
        'Un collegamento discreto eredita il colore circostante e mostra la sottolineatura al passaggio del mouse — per elenchi di link in cui una sottolineatura su ogni riga sarebbe rumore.',
      ),
      demo(`stack({ gap: 'xs' },
  link({ href: '/docs/routing', subtle: true }, 'Routing'),
  link({ href: '/docs/data', subtle: true }, 'Caricamento dati'),
  link({ href: '/docs/assets', subtle: true }, 'Risorse e stili'),
)`, { align: 'stretch' }),

      h2('Link esterni'),
      p(
        code('external'),
        ' aggiunge ',
        code('target="_blank"'),
        ' e il ',
        code('rel'),
        ' che deve accompagnarlo. Di’ nel testo del link che apre una nuova scheda, oppure aggiungi una nota nascosta visivamente — una nuova scheda senza avviso disorienta.',
      ),
      demo(`text(
  'La libreria è su ',
  link({ href: 'https://www.npmjs.com/package/sitelo', external: true },
    'npm',
    visuallyHidden(' (si apre in una nuova scheda)'),
  ),
  '.',
)`, { align: 'stretch' }),

      h2('In un paragrafo'),
      demo(`text({ variant: 'lead' },
  'sitelo è costruito su ',
  link({ href: 'https://vite.dev', external: true }, 'Vite'),
  ', renderizza con ',
  link({ href: 'https://ht.js.org', external: true }, 'javascript-to-html'),
  ', e non spedisce nulla al browser se non glielo chiedi.',
)`, { align: 'stretch' }),

      h2('Quando usare invece un pulsante'),
      p(
        'Un link naviga; un pulsante compie un’azione. Se la cosa cambia stato nella pagina invece di portare chi legge da qualche parte, dev’essere un ',
        code('button()'),
        ' — e se naviga ma deve sembrare un pulsante, dai a ',
        code('button()'),
        ' un ',
        code('href'),
        ', che sotto renderizza un’ancora.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  link({ href: '/docs' }, 'Un link che naviga'),
  button({ href: '/docs', variant: 'outline' }, 'Un link che sembra un pulsante'),
  button({ variant: 'link' }, 'Un pulsante che sembra un link'),
)`),

      h2('Props'),
      propsTable([
        ['href', 'string', '', 'Dove porta.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Da quale palette attingere.'],
        ['subtle', 'boolean', 'false', 'Eredita il colore circostante; sottolineatura solo al passaggio del mouse.'],
        ['external', 'boolean', 'false', 'Aggiunge target="_blank" e rel="noopener noreferrer".'],
      ]),
    ],
  })
