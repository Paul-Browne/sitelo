import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Schede',
    description:
      'Tre forme: link, una pagina per scheda; pannelli che si scambiano sul posto; oppure pannelli guidati dall’URL.',
    activeHref: '/it/ui/tabs',
    children: [
      p(
        'Dai a ogni elemento un ',
        code('href'),
        ' e le schede sono link — una pagina per scheda, nessuno script, ',
        code('aria-current'),
        ' su quella attiva. Dai a ogni elemento un ',
        code('panel'),
        ' e diventano un gruppo di radio i cui pannelli si scambiano sul posto, sempre senza script.',
      ),
      p(
        'Su un sito statico la forma a link è di solito quella giusta: dà a ogni vista un URL, e sopravvive a JavaScript disattivato. Ricorri ai pannelli quando il contenuto è poco e il passaggio non dovrebbe costare una navigazione.',
      ),

      h2('Schede-link'),
      p(
        'Queste sono davvero dei link — cliccane uno e naviga. La sottolineatura arriva da ',
        code('active'),
        ' o ',
        code('value'),
        ' in fase di build, non dal clic, quindi ogni pagina segna la propria scheda. In una scheda-link niente reagisce all’URL da solo: per quello, passa ai pannelli qui sotto.',
      ),
      demo(`tabs({
  items: [
    { label: 'Breadcrumb', href: '/ui/breadcrumbs' },
    { label: 'Schede', href: '/ui/tabs', active: true },
    { label: 'Impaginazione', href: '/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Schede-pannello'),
      p(
        'La scheda è una ',
        code('<label>'),
        ' per una radio che il foglio di stile tiene fuori dalla vista, e il pannello che segue la radio selezionata è quello che il CSS mostra. In questa pagina non viene importato nulla: il passaggio, e i tasti freccia che si muovono fra le schede, sono cose che un gruppo di radio fa già.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Installa', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Usa', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Costruisci', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Schede collegabili per URL'),
      p(
        'Dai agli elementi con pannello anche un ',
        code('href'),
        ' a frammento e le radio lasciano il posto ai link: l’URL nomina la scheda, ',
        code(':target'),
        ' la individua, il pannello che la segue si mostra, e la scelta sopravvive a un ricaricamento, a un link condiviso e al pulsante Indietro. L’id sta sulla scheda e non sul pannello perché il browser porta in cima alla finestra ciò che l’URL nomina — nominare il pannello farebbe uscire dallo schermo proprio le schede su cui hai appena cliccato. In un documento solo un elemento può essere ',
        code(':target'),
        ', quindi questa forma è per un’unica serie di schede per pagina. Lo scorrimento in sé non si può annullare: seguire un frammento sposta la finestra per definizione. Tutto ciò che una pagina può fare è scegliere cosa viene portato in vista e dove si ferma, ed è a questo che servono l’id sulla scheda e il suo ',
        code('scroll-margin-block-start'),
        ' — impostalo con la prop ',
        code('scrollMargin'),
        ', e dai a un’intestazione appiccicata almeno la propria altezza.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Preparazione', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Questo pannello è #tab-setup — copia l’URL e torna.'))) },
    { id: 'deploy', label: 'Deploy', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'E questo è #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pillole'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Tutto', href: '#all', active: true },
      { label: 'Guide', href: '#guides' },
      { label: 'Esempi', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Colori'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Altro', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Altro', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Altro', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Molte schede'),
      p(
        'L’elenco delle schede scorre orizzontalmente invece di andare a capo, così la riga mantiene la sua forma su un telefono. Le schede-pannello vanno a capo invece — ogni pannello deve seguire la propria scheda, il che non lascia alcun elemento-riga da far scorrere.',
      ),
      demo(`tabs({
  items: [
    'Panoramica', 'Routing', 'Dati', 'Risorse', 'Immagini', 'Island', 'TypeScript', 'CLI', 'Deploy',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Disattivate'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Disponibile', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Questa funziona.'))) },
    { id: 'soon', label: 'In arrivo', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Accessibilità'),
      p(
        'La forma a pannelli è un vero gruppo di radio: le schede sono elementi ',
        code('<label>'),
        ' per radio che condividono un ',
        code('name'),
        ', così uno screen reader annuncia quale su quante è scelta, e i tasti freccia, Home e Fine funzionano senza che sia caricato nulla. La forma collegabile per URL è fatta invece di semplici link, e non porta alcun ',
        code('aria-current'),
        ' — verrebbe scritto una volta sola e sarebbe sbagliato dopo il primo clic. Non è deliberatamente un tablist ARIA: ',
        code('aria-selected'),
        ' si scrive una volta sola, sul server, e il CSS non può tenerlo vero mentre clicchi. Nemmeno la forma a link è un tablist: dei link che navigano sono link, e dare loro la semantica delle schede mentirebbe su ciò che fanno.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Stringhe, oppure oggetti { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id dell’elemento attivo. Ripiega su active, poi sul primo.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Come viene segnata la scheda attiva.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colore della scheda attiva.'],
        ['label', 'string', "'Tabs'", 'Nome accessibile del gruppo. Solo forma a pannelli.'],
        ['name', 'string', "id del primo elemento", 'Nome del gruppo di radio. Serve solo con due serie di schede-pannello sulla stessa pagina.'],
        ['href', 'string', '', 'Su un elemento: una pagina da collegare, oppure — insieme a panel — il frammento che lo nomina.'],
        ['scrollMargin', 'Space', "'lg'", 'Quanto sopra la scheda si ferma la finestra. Solo forma :target.'],
      ]),
    ],
  })
