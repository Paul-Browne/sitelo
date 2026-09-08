import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Tabelle',
    description:
      'Zeilen und Spalten aus Daten, in einem Scroll-Container, der verhindert, dass eine breite Tabelle die Seite sprengt.',
    activeHref: '/de/ui/table',
    extraHead: uiHead(),
    children: [
      p(
        'Übergib ',
        code('columns'),
        ' und ',
        code('rows'),
        ', und die Tabelle baut sich selbst, Kopfzeile inklusive. Sie steckt in einem horizontalen Scroll-Container, sodass eine Tabelle mit mehr Spalten, als ein Telefon zeigen kann, für sich scrollt, statt die Seite zu dehnen. Exportiert als ',
        code('table'),
        ' und als ',
        code('dataTable'),
        '.',
      ),

      h2('Einfache Tabelle'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Seite' },
    { key: 'size', header: 'Größe' },
    { key: 'time', header: 'Renderzeit' },
  ],
  rows: [
    { page: '/', size: '4,1 kB', time: '12 ms' },
    { page: '/docs', size: '12,7 kB', time: '31 ms' },
    { page: '/examples', size: '9,4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Ausrichtung'),
      p('Zahlen lesen sich besser, wenn sie am Ende ihrer Spalte ausgerichtet sind.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Seite' },
    { key: 'bytes', header: 'Bytes', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4.112', gzip: '1.204' },
    { page: '/docs', bytes: '12.704', gzip: '3.910' },
    { page: '/examples', bytes: '9.388', gzip: '2.744' },
  ],
})`, { align: 'stretch' }),

      h2('Eigene Zellen'),
      p(
        'Eine Spalte mit einer ',
        code('render'),
        '-Funktion bekommt die ganze Zeile und gibt zurück, was in der Zelle stehen soll — einen Chip, einen Link, eine formatierte Zahl.',
      ),
      demo(`table({
  columns: [
    { header: 'Seite', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Größe', align: 'end' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'fehlgeschlagen') },
  ],
  rows: [
    { page: '/docs/routing', href: '/de/docs/routing', size: '18,2 kB', ok: true },
    { page: '/docs/data', href: '/de/docs/data', size: '21,7 kB', ok: true },
    { page: '/docs/islands', href: '/de/docs/islands', size: '24,1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Stile'),
      p(
        code('striped'),
        ' unterlegt jede zweite Zeile, ',
        code('hover'),
        ' hebt die Zeile unter dem Zeiger hervor, und ',
        code('dense'),
        ' zieht den Innenabstand für eine Tabelle mit vielen Zeilen enger.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'gestreift',
    columns: [{ key: 'name', header: 'Name' }, { key: 'value', header: 'Wert', align: 'end' }],
    rows: [{ name: 'Seiten', value: '169' }, { name: 'Assets', value: '208' }, { name: 'gesamt', value: '9,5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'Hover und dicht',
    columns: [{ key: 'name', header: 'Name' }, { key: 'value', header: 'Wert', align: 'end' }],
    rows: [{ name: 'Seiten', value: '169' }, { name: 'Assets', value: '208' }, { name: 'gesamt', value: '9,5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Beschriftung'),
      p(
        'Eine Beschriftung benennt die Tabelle für alle, die ohne den umgebenden Text bei ihr landen — lohnt sich immer dann, wenn die Tabelle nicht direkt unter einer Überschrift steht, die schon sagt, was sie ist.',
      ),
      demo(`table({
  caption: 'Build-Ausgabe, neueste zuerst',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'Wann' },
    { key: 'pages', header: 'Seiten', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: 'vor 4 Minuten', pages: '169' },
    { commit: 'dcfaaae', when: 'vor 2 Stunden', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('Aus Daten'),
      p(
        'Zeilen sind ein gewöhnliches Array, also meist genau das, was ',
        code('data()'),
        ' ohnehin geladen hat — ohne Adapter dazwischen.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Hallo Welt', date: '2026-01-14', reads: 1204 },
    { title: 'Statisch zuerst', date: '2026-02-02', reads: 890 },
    { title: 'Kein Runtime', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Beitrag' },
      { key: 'date', header: 'Veröffentlicht' },
      { header: 'Aufrufe', align: 'end', render: (post) => post.reads.toLocaleString('de') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Das Markup selbst schreiben'),
      p(
        'Lass ',
        code('columns'),
        ' weg, und die Tabelle rendert stattdessen ihre Kinder — eine Tabelle mit Fußzeile oder gruppierten Kopfzeilen lässt sich also von Hand bauen und bekommt trotzdem Gestaltung und Scroll-Container.',
      ),

      h2('Props'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } je Spalte. Weglassen, um die Zeilen von Hand zu schreiben.'],
        ['rows', 'object[]', '[]', 'Ein Objekt pro Zeile.'],
        ['caption', 'Child', '', 'Eine Beschriftung über der Tabelle.'],
        ['striped', 'boolean', 'false', 'Jede zweite Zeile unterlegen.'],
        ['hover', 'boolean', 'false', 'Die Zeile unter dem Zeiger hervorheben.'],
        ['dense', 'boolean', 'false', 'Engerer Zellabstand.'],
      ]),
    ],
  })
