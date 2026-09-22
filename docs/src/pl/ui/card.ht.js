import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Karta',
    description:
      'Powierzchnia dla zgrupowanej treści, z nagłówkiem, treścią, stopką i materiałem, które wiedzą, jak razem siedzieć.',
    activeHref: '/pl/ui/card',
    children: [
      p(
        'Karta grupuje powiązaną treść na własnej powierzchni. Części — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — są osobnymi funkcjami, a nie propsami, więc używasz tylko tych, których potrzebujesz, i układasz je w kolejności, jakiej chce projekt.',
      ),

      h2('Podstawowa karta'),
      demo(`card(
  cardHeader({ title: 'Routing oparty na plikach', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Katalogi stają się ścieżkami. Nawiasy stają się parametrami. Nie ma routera do skonfigurowania.')),
)`, { align: 'stretch' }),

      h2('Warianty'),
      p(
        'Outlined jest domyślny. Elevated zamienia obramowanie na cień, a flat zamiast jednego i drugiego barwi powierzchnię.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Ze stopką'),
      p(
        code('divided'),
        ' dodaje włoskową linię nad stopką. Stopka jest spychana na dół, więc karty w rzędzie wyrównują swoje akcje, nawet gdy tekst nad nimi ma różną długość.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Podstawowa strona' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Minimalny projekt plus konfiguracje wdrożenia.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Otwórz')),
  ),
  card(
    cardHeader({ title: 'Blog w Markdownie' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Katalog plików .md renderowanych do statycznych stron, z kanałem RSS i bez żadnego JavaScriptu po stronie klienta.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Otwórz')),
  ),
)`, { align: 'stretch' }),

      h2('Materiał'),
      p(
        code('cardMedia()'),
        ' wypełnia górę karty w stałych proporcjach, więc rząd kart zostaje równy niezależnie od wymiarów zdjęć źródłowych.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Domyślne 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Cała karta jako odnośnik'),
      p(
        'Daj karcie ',
        code('href'),
        ', a cała powierzchnia staje się jednym odnośnikiem, z towarzyszącym uniesieniem po najechaniu. W tej postaci nie wkładaj do karty przycisków ani innych odnośników — treść interaktywna nie może zagnieżdżać się w odnośniku. Zamiast tego użyj przycisku w stopce zwykłej karty.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/docs/routing' },
    cardHeader({ title: 'Routing', subtitle: 'Przeczytaj przewodnik' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Trasy dynamiczne, catch-all i grupy tras.')),
  ),
  card({ href: '/docs/data' },
    cardHeader({ title: 'Wczytywanie danych', subtitle: 'Przeczytaj przewodnik' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() działa podczas buildu, z buforowaniem pobrań.')),
  ),
)`, { align: 'stretch' }),

      h2('Odstęp wewnętrzny'),
      p('Jeden props ustawia odstęp wewnętrzny dla każdej części karty naraz.'),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Dowolna zawartość'),
      p(
        'Części to udogodnienie, nie wymóg — karta przyjmuje dowolne dzieci, a ',
        code('cardHeader()'),
        ' przyjmuje własne dzieci obok tytułu, na awatar albo przycisk menu po prawej.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Wdrożył 4 minuty temu' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Build zaliczony'),
      chip({ color: 'neutral' }, '12 stron'),
      chip({ color: 'neutral' }, '4,1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Propsy'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Jak powierzchnia jest oddzielona od strony.'],
        ['href', 'string', '', 'Renderuje całą kartę jako odnośnik.'],
        ['padding', 'Space', "'lg'", 'Odstęp wewnętrzny używany przez każdą część karty.'],
      ]),
      p('Części:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Tytuł i podtytuł, plus dowolne dzieci obok nich.'],
        ['cardTitle', 'as', "'h3'", 'Sam tytuł, gdy nagłówek budujesz ręcznie.'],
        ['cardSubtitle', '', '', 'Przygaszony wiersz pod tytułem.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Obraz nagłówkowy w stałych proporcjach.'],
        ['cardBody', '', '', 'Główny obszar treści.'],
        ['cardFooter', 'divided', 'false', 'Dolny rząd akcji; divided dodaje nad nim włoskową linię.'],
      ], { headers: ['Część', 'Propsy', 'Domyślnie', 'Opis'] }),
    ],
  })
