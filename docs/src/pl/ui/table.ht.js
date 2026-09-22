import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Tabela',
    description:
      'Wiersze i kolumny z danych, w przewijanym kontenerze, który nie pozwala szerokiej tabeli rozerwać strony.',
    activeHref: '/pl/ui/table',
    children: [
      p(
        'Podaj ',
        code('columns'),
        ' i ',
        code('rows'),
        ', a tabela zbuduje się sama, razem z nagłówkiem. Jest owinięta w kontener z poziomym przewijaniem, więc tabela z większą liczbą kolumn, niż zmieści telefon, przewija się sama, zamiast rozciągać stronę. Eksportowana i jako ',
        code('table'),
        ', i jako ',
        code('dataTable'),
        '.',
      ),

      h2('Podstawowa tabela'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Strona' },
    { key: 'size', header: 'Rozmiar' },
    { key: 'time', header: 'Czas renderu' },
  ],
  rows: [
    { page: '/', size: '4,1 kB', time: '12 ms' },
    { page: '/docs', size: '12,7 kB', time: '31 ms' },
    { page: '/examples', size: '9,4 kB', time: '24 ms' },
  ],
})`, { align: 'stretch' }),

      h2('Wyrównanie'),
      p('Liczby lepiej czyta się wyrównane do końca swojej kolumny.'),
      demo(`table({
  columns: [
    { key: 'page', header: 'Strona' },
    { key: 'bytes', header: 'Bajty', align: 'end' },
    { key: 'gzip', header: 'Gzip', align: 'end' },
  ],
  rows: [
    { page: '/', bytes: '4112', gzip: '1204' },
    { page: '/docs', bytes: '12 704', gzip: '3910' },
    { page: '/examples', bytes: '9388', gzip: '2744' },
  ],
})`, { align: 'stretch' }),

      h2('Własne komórki'),
      p(
        'Kolumna z funkcją ',
        code('render'),
        ' dostaje cały wiersz i zwraca to, co ma być w komórce — żeton, odnośnik, sformatowaną liczbę.',
      ),
      demo(`table({
  columns: [
    { header: 'Strona', render: (row) => link({ href: row.href }, row.page) },
    { key: 'size', header: 'Rozmiar', align: 'end' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'błąd') },
  ],
  rows: [
    { page: '/docs/routing', href: '/docs/routing', size: '18,2 kB', ok: true },
    { page: '/docs/data', href: '/docs/data', size: '21,7 kB', ok: true },
    { page: '/docs/islands', href: '/docs/islands', size: '24,1 kB', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Style'),
      p(
        code('striped'),
        ' barwi co drugi wiersz, ',
        code('hover'),
        ' podświetla wiersz pod wskaźnikiem, a ',
        code('dense'),
        ' ściska odstępy dla tabeli z wieloma wierszami.',
      ),
      demo(`stack({ gap: 'lg' },
  table({
    striped: true,
    caption: 'striped',
    columns: [{ key: 'name', header: 'Nazwa' }, { key: 'value', header: 'Wartość', align: 'end' }],
    rows: [{ name: 'strony', value: '169' }, { name: 'zasoby', value: '208' }, { name: 'razem', value: '9,5 MB' }],
  }),
  table({
    hover: true,
    dense: true,
    caption: 'hover i dense',
    columns: [{ key: 'name', header: 'Nazwa' }, { key: 'value', header: 'Wartość', align: 'end' }],
    rows: [{ name: 'strony', value: '169' }, { name: 'zasoby', value: '208' }, { name: 'razem', value: '9,5 MB' }],
  }),
)`, { align: 'stretch' }),

      h2('Podpis'),
      p(
        'Podpis nazywa tabelę dla kogoś, kto trafia na nią bez otaczającego tekstu — warto go dodać zawsze, gdy tabela nie stoi bezpośrednio pod nagłówkiem mówiącym już, czym jest.',
      ),
      demo(`table({
  caption: 'Wynik buildu, od najnowszego',
  columns: [
    { key: 'commit', header: 'Commit' },
    { key: 'when', header: 'Kiedy' },
    { key: 'pages', header: 'Strony', align: 'end' },
  ],
  rows: [
    { commit: '94a837a', when: '4 minuty temu', pages: '169' },
    { commit: 'dcfaaae', when: '2 godziny temu', pages: '161' },
  ],
})`, { align: 'stretch' }),

      h2('Z danych'),
      p(
        'Wiersze to zwykła tablica, więc zwykle są dokładnie tym, co ',
        code('data()'),
        ' już wczytało — bez żadnego adaptera po drodze.',
      ),
      demo(`return (() => {
  const posts = [
    { title: 'Witaj świecie', date: '2026-01-14', reads: 1204 },
    { title: 'Najpierw statyczne', date: '2026-02-02', reads: 890 },
    { title: 'Bez runtime’u', date: '2026-03-19', reads: 2317 },
  ]

  return table({
    hover: true,
    columns: [
      { key: 'title', header: 'Wpis' },
      { key: 'date', header: 'Opublikowano' },
      { header: 'Odsłony', align: 'end', render: (post) => post.reads.toLocaleString('pl') },
    ],
    rows: posts,
  })
})()`, { align: 'stretch' }),

      h2('Pisanie znaczników samodzielnie'),
      p(
        'Pomiń ',
        code('columns'),
        ', a tabela wyrenderuje zamiast tego swoje dzieci, więc tabelę z wierszem stopki albo pogrupowanymi nagłówkami można zbudować ręcznie i wciąż dostać style oraz przewijany kontener.',
      ),

      h2('Propsy'),
      propsTable([
        ['columns', 'TableColumn[]', '', '{ key, header, align, render } na kolumnę. Pomiń, żeby pisać wiersze ręcznie.'],
        ['rows', 'object[]', '[]', 'Jeden obiekt na wiersz.'],
        ['caption', 'Child', '', 'Podpis nad tabelą.'],
        ['striped', 'boolean', 'false', 'Barwi co drugi wiersz.'],
        ['hover', 'boolean', 'false', 'Podświetla wiersz pod wskaźnikiem.'],
        ['dense', 'boolean', 'false', 'Ciaśniejszy odstęp w komórkach.'],
      ]),
    ],
  })
