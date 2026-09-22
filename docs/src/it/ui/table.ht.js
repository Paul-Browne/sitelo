import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Tabella',
    description:
      'Righe e colonne a partire dai dati, in un contenitore che scorre e impedisce a una tabella larga di rompere la pagina.',
    activeHref: '/it/ui/table',
    children: [
      p(
        'Passa ',
        code('columns'),
        ' e ',
        code('rows'),
        ' e la tabella si costruisce da sola, intestazione compresa. È avvolta in un contenitore a scorrimento orizzontale, così una tabella con più colonne di quante un telefono ne possa mostrare scorre per conto suo invece di allargare la pagina. È esportata sia come ',
        code('table'),
        ' sia come ',
        code('dataTable'),
        '.',
      ),

      h2('Tabella di base'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Pagina' },
    { key: 'size', header: 'Dimensione' },
    { key: 'time', header: 'Tempo di render' },
  ],
  rows: [
    { page: '/', size: '4,1 kB', time: '12 ms' },
    { page: '/docs', size: '12,7 kB', time: '31 ms' },
    { page: '/examples', size: '9,4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Allineamento'),
      p(
        'I numeri si leggono meglio allineati alla fine della loro colonna.',
      ),
      demo(`table({
  columns: [
    { key: 'page', header: 'Pagina' },
    { key: 'bytes', header: 'Byte', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4.112', gzip: '1.204' },
    { page: '/docs', bytes: '12.704', gzip: '3.910' },
    { page: '/examples', bytes: '9.388', gzip: '2.744' },
  ],
})`, { align: 'stretch' }),

      h2('Celle personalizzate'),
      p(
        'Una colonna con una funzione ',
        code('render'),
        ' riceve l’intera riga e restituisce quello che deve esserci nella cella — un chip, un link, un numero formattato.',
      ),
      demo(`table({
  columns: [
    { header: 'Pagina', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Dimensione', align: 'end' },
    { header: 'Stato', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'fallita') },
  ],
  rows: [
    { page: '/docs/routing', href: '/docs/routing', size: '18,2 kB', ok: true },
    { page: '/docs/data', href: '/docs/data', size: '21,7 kB', ok: true },
    { page: '/docs/islands', href: '/docs/islands', size: '24,1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Stili'),
      p(
        code('striped'),
        ' alterna la tinta delle righe, ',
        code('hover'),
        ' evidenzia la riga sotto il puntatore, e ',
        code('dense'),
        ' stringe lo spazio interno per una tabella con molte righe.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'striped',
    columns: [{ key: 'name', header: 'Nome' }, { key: 'value', header: 'Valore', align: 'end' }],
    rows: [{ name: 'pagine', value: '169' }, { name: 'risorse', value: '208' }, { name: 'totale', value: '9,5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'hover e dense',
    columns: [{ key: 'name', header: 'Nome' }, { key: 'value', header: 'Valore', align: 'end' }],
    rows: [{ name: 'pagine', value: '169' }, { name: 'risorse', value: '208' }, { name: 'totale', value: '9,5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Didascalia'),
      p(
        'Una didascalia dà un nome alla tabella per chi ci arriva senza il testo che la circonda — vale la pena aggiungerla ogni volta che la tabella non sta direttamente sotto un’intestazione che dice già che cos’è.',
      ),
      demo(`table({
  caption: 'Output della build, dal più recente',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'Quando' },
    { key: 'pages', header: 'Pagine', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: '4 minuti fa', pages: '169' },
    { commit: 'dcfaaae', when: '2 ore fa', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('Dai dati'),
      p(
        'Le righe sono un normale array, quindi di solito sono proprio quello che ',
        code('data()'),
        ' ha già caricato — senza alcun adattatore in mezzo.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Ciao mondo', date: '2026-01-14', reads: 1204 },
    { title: 'Prima lo statico', date: '2026-02-02', reads: 890 },
    { title: 'Nessun runtime', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Articolo' },
      { key: 'date', header: 'Pubblicato' },
      { header: 'Letture', align: 'end', render: (post) => post.reads.toLocaleString('it') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Scrivere il markup da sé'),
      p(
        'Ometti ',
        code('columns'),
        ' e la tabella renderizza invece i propri figli, così una tabella con una riga di piè di pagina o intestazioni raggruppate si può costruire a mano e avere comunque lo stile e il contenitore a scorrimento.',
      ),

      h2('Props'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } per ogni colonna. Omettile per scrivere le righe a mano.'],
        ['rows', 'object[]', '[]', 'Un oggetto per riga.'],
        ['caption', 'Child', '', 'Una didascalia sopra la tabella.'],
        ['striped', 'boolean', 'false', 'Alterna la tinta delle righe.'],
        ['hover', 'boolean', 'false', 'Evidenzia la riga sotto il puntatore.'],
        ['dense', 'boolean', 'false', 'Spazio interno più stretto nelle celle.'],
      ]),
    ],
  })
