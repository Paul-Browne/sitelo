import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Elenco',
    description:
      'Righe di contenuto con qualcosa di facoltativo ai due lati — la forma con cui è costruita la maggior parte delle schermate di impostazioni e dei feed.',
    activeHref: '/it/ui/list',
    children: [
      p(
        'Un elenco è una superficie bordata di righe. Ogni riga ha un titolo, una descrizione facoltativa e delle caselle all’inizio e alla fine per un avatar, un’icona o un controllo.',
      ),

      h2('Elenco di base'),
      demo(`list(
  listItem({ title: 'Routing', description: 'src/about.ht.js diventa /about' }),
  listItem({ title: 'Caricamento dati', description: 'data() gira una volta sola, in fase di build' }),
  listItem({ title: 'Risorse', description: 'Finisce nel bundle solo ciò che il tuo HTML referenzia' }),
)`, { align: 'stretch' }),

      h2('Caselle iniziali e finali'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Ha pubblicato 3 commit su main',
    end: chip({ size: 'sm', color: 'neutral' }, '2h'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Ha aperto una pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'aperta'),
  }),
)`, { align: 'stretch' }),

      h2('Righe che portano da qualche parte'),
      p(
        'Una riga con un ',
        code('href'),
        ' mette l’ancora dentro il ',
        code('<li>'),
        ' invece che attorno, così l’elenco resta un elenco valido. Non metterci anche un pulsante — il contenuto interattivo non può annidarsi dentro un link.',
      ),
      demo(`list(
  listItem({ title: 'Primi passi', description: 'Installazione e prima pagina', href: '/docs' }),
  listItem({ title: 'Routing', description: 'Basato sui file, con segmenti dinamici', href: '/docs/routing' }),
  listItem({ title: 'Deploy', description: 'Netlify, Vercel, Pages, Amplify', href: '/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Righe con controlli'),
      p(
        'Quando una riga contiene un interruttore o un pulsante, lascia la riga stessa senza link e fa’ che sia il controllo la parte interattiva.',
      ),
      demo(`list(
  listItem({
    title: 'Ricerca Pagefind',
    description: 'Indicizza ogni pagina alla fine della build',
    end: toggle({ 'aria-label': 'Ricerca Pagefind', checked: true }),
  }),
  listItem({
    title: 'Ottimizzazione delle immagini',
    description: 'Ridimensiona e converte le immagini. Richiede sharp.',
    end: toggle({ 'aria-label': 'Ottimizzazione delle immagini', checked: true }),
  }),
  listItem({
    title: 'Island server',
    description: 'Renderizza le regioni marcate al momento della richiesta',
    end: toggle({ 'aria-label': 'Island server' }),
  }),
)`, { align: 'stretch' }),

      h2('Semplice'),
      p(
        code('plain'),
        ' toglie il bordo e lo sfondo, per un elenco che sta dentro una scheda o una barra laterale che ha già una superficie propria.',
      ),
      demo(`card(
  cardHeader({ title: 'Build recenti' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · 4 minuti fa', end: chip({ size: 'sm', color: 'success', dot: true }, 'superata') }),
      listItem({ title: 'dcfaaae', description: 'main · 2 ore fa', end: chip({ size: 'sm', color: 'success', dot: true }, 'superata') }),
      listItem({ title: 'a46a461', description: 'main · ieri', end: chip({ size: 'sm', color: 'danger', dot: true }, 'fallita') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Righe libere'),
      p(
        'Senza ',
        code('title'),
        ' né ',
        code('description'),
        ', una riga renderizza qualunque figlio le venga dato — per una disposizione che la forma a due righe non copre.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Riga personalizzata'),
        text({ variant: 'caption', tone: 'muted' }, 'Dentro ci metti quello che vuoi'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Azione'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Dai dati'),
      demo(`return (() => {
  const locales = [
    { code: 'it', name: 'Italiano', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' pagine',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Toglie il bordo e lo sfondo.'],
        ['as', 'string', "'ul'", 'Elemento da renderizzare, per esempio ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'La riga principale.'],
        ['description', 'Child', '', 'Una seconda riga attenuata.'],
        ['start', 'Child', '', 'Casella iniziale — un avatar o un’icona.'],
        ['end', 'Child', '', 'Casella finale — un chip, un controllo, un orario.'],
        ['href', 'string', '', 'Rende la riga un link, con l’ancora dentro al li.'],
        ['interactive', 'boolean', 'false', 'Evidenziazione al passaggio del mouse senza farne un link.'],
      ]),
    ],
  })
