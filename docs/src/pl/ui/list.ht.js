import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Lista',
    description:
      'Wiersze treści z czymś opcjonalnym po obu stronach — kształt, z którego zbudowana jest większość ekranów ustawień i strumieni.',
    activeHref: '/pl/ui/list',
    children: [
      p(
        'Lista to obramowana powierzchnia z wierszami. Każdy wiersz ma tytuł, opcjonalny opis i miejsca na początku i na końcu na awatar, ikonę albo kontrolkę.',
      ),

      h2('Podstawowa lista'),
      demo(`list(
  listItem({ title: 'Routing', description: 'src/about.ht.js staje się /about' }),
  listItem({ title: 'Wczytywanie danych', description: 'data() działa raz, podczas buildu' }),
  listItem({ title: 'Zasoby', description: 'Do paczki trafia tylko to, do czego odwołuje się Twój HTML' }),
)`, { align: 'stretch' }),

      h2('Miejsca na początku i na końcu'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Wypchnęła 3 commity na main',
    end: chip({ size: 'sm', color: 'neutral' }, '2h'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Otworzyła pull request',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'otwarty'),
  }),
)`, { align: 'stretch' }),

      h2('Wiersze, które prowadzą dalej'),
      p(
        'Wiersz z ',
        code('href'),
        ' umieszcza kotwicę wewnątrz ',
        code('<li>'),
        ', a nie wokół niego, więc lista pozostaje poprawną listą. Nie wkładaj w taki wiersz także przycisku — treść interaktywna nie może zagnieżdżać się w odnośniku.',
      ),
      demo(`list(
  listItem({ title: 'Pierwsze kroki', description: 'Instalacja i pierwsza strona', href: '/docs' }),
  listItem({ title: 'Routing', description: 'Oparty na plikach, z segmentami dynamicznymi', href: '/docs/routing' }),
  listItem({ title: 'Wdrożenie', description: 'Netlify, Vercel, Pages, Amplify', href: '/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Wiersze z kontrolkami'),
      p(
        'Gdy wiersz zawiera przełącznik albo przycisk, zostaw sam wiersz bez odnośnika i pozwól, by to kontrolka była częścią interaktywną.',
      ),
      demo(`list(
  listItem({
    title: 'Wyszukiwanie Pagefind',
    description: 'Indeksuje każdą stronę na końcu buildu',
    end: toggle({ 'aria-label': 'Wyszukiwanie Pagefind', checked: true }),
  }),
  listItem({
    title: 'Optymalizacja obrazów',
    description: 'Skaluje i konwertuje obrazy. Wymaga sharpa.',
    end: toggle({ 'aria-label': 'Optymalizacja obrazów', checked: true }),
  }),
  listItem({
    title: 'Wyspy serwerowe',
    description: 'Renderuje oznaczone obszary w chwili żądania',
    end: toggle({ 'aria-label': 'Wyspy serwerowe' }),
  }),
)`, { align: 'stretch' }),

      h2('Prosta'),
      p(
        code('plain'),
        ' zdejmuje obramowanie i tło, dla listy siedzącej w karcie albo w panelu bocznym, który ma już własną powierzchnię.',
      ),
      demo(`card(
  cardHeader({ title: 'Ostatnie buildy' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · 4 minuty temu', end: chip({ size: 'sm', color: 'success', dot: true }, 'zaliczony') }),
      listItem({ title: 'dcfaaae', description: 'main · 2 godziny temu', end: chip({ size: 'sm', color: 'success', dot: true }, 'zaliczony') }),
      listItem({ title: 'a46a461', description: 'main · wczoraj', end: chip({ size: 'sm', color: 'danger', dot: true }, 'nieudany') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Dowolne wiersze'),
      p(
        'Bez ',
        code('title'),
        ' i ',
        code('description'),
        ' wiersz renderuje dowolne dzieci, które dostanie — na układ, którego kształt dwuwierszowy nie obejmuje.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Własny wiersz'),
        text({ variant: 'caption', tone: 'muted' }, 'W środku cokolwiek zechcesz'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Akcja'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Z danych'),
      demo(`return (() => {
  const locales = [
    { code: 'pl', name: 'Polski', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' stron',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Propsy'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Zdejmuje obramowanie i tło.'],
        ['as', 'string', "'ul'", 'Element do wyrenderowania, np. ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Główny wiersz.'],
        ['description', 'Child', '', 'Przygaszony drugi wiersz.'],
        ['start', 'Child', '', 'Miejsce z przodu — awatar albo ikona.'],
        ['end', 'Child', '', 'Miejsce z tyłu — żeton, kontrolka, godzina.'],
        ['href', 'string', '', 'Czyni wiersz odnośnikiem, z kotwicą wewnątrz li.'],
        ['interactive', 'boolean', 'false', 'Podświetlenie po najechaniu bez czynienia z niego odnośnika.'],
      ]),
    ],
  })
