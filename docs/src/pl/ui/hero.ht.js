import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'Góra strony docelowej: nagłówek, zdanie i co z tym zrobić.',
    activeHref: '/pl/ui/hero',
    children: [
      p(
        'Hero to pierwsza rzecz na stronie marketingowej albo na stronie głównej dokumentacji. Renderuje ',
        code('<section>'),
        ' z ',
        code('<h1>'),
        ' w środku — więc jest nagłówkiem strony, a nie ozdobnym banerem, który akurat jest duży.',
      ),

      h2('Podstawowy hero'),
      demo(`hero({
  level: 2,
  title: 'Strony statyczne, bez frameworka',
  description: 'Pisz funkcje zwracające HTML. Dostajesz kompletną witrynę.',
},
  button({ size: 'lg' }, 'Zacznij'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Przeczytaj dokumentację'),
)`, { align: 'stretch' }),

      h2('Z nadtytułem'),
      p('Krótki wiersz nad tytułem — wersja, kategoria, ogłoszenie.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Teraz z biblioteką komponentów',
  description: 'Siedemdziesiąt komponentów, bez runtime’u, jeden opcjonalny skrypt.',
},
  button({ size: 'lg', href: '/ui' }, 'Przejrzyj komponenty'),
)`, { align: 'stretch' }),

      h2('Wyrównany do lewej'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Open source',
  title: 'Budowane na widoku',
  description: 'Licencja MIT i na tyle małe, że przeczytasz w jedno popołudnie.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Zobacz na GitHubie'),
)`, { align: 'stretch' }),

      h2('Z materiałem'),
      p(
        'Podanie ',
        code('media'),
        ' przełącza na dwie kolumny, gdy tylko jest na nie miejsce, i wraca do jednej na wąskim ekranie. Naturalnie łączy się z ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Zobacz to w działaniu',
  description: 'Każda strona jest statycznym HTML-em, zanim dotrze do przeglądarki.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Witaj świecie'),
      text({ variant: 'small', tone: 'muted' }, 'Wyrenderowane podczas buildu.'),
    ),
  ),
},
  button('Zacznij'),
)`, { align: 'stretch' }),

      h2('Wewnątrz kontenera'),
      p(
        'Hero nie ma własnego limitu szerokości — umieść go w ',
        code('container()'),
        ', żeby ustawił się w linii z resztą strony.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'W kontenerze',
    description: 'Kontener ustala szerokość; hero ustala rytm.',
  }),
)`, { align: 'stretch' }),

      h2('Poziom nagłówka'),
      p(
        'Tytuł jest domyślnie elementem ',
        code('<h1>'),
        ' strony, co jest właściwe dla strony docelowej. Hero użyty w środku strony nie jest jej nagłówkiem, więc obniż go przez ',
        code('level'),
        ' — robi tak każde demo na tej stronie, bo strona ma już własny h1.',
      ),

      h2('Sam tytuł'),
      p('Każda część jest opcjonalna i nic pustego się nie renderuje.'),
      demo(`hero({ level: 2, title: 'Dokumentacja' })`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['eyebrow', 'Child', '', 'Mały wiersz wersalikami nad tytułem.'],
        ['title', 'Child', '', 'Renderowany jako h1 strony.'],
        ['description', 'Child', '', 'Zdanie pod nim.'],
        ['media', 'Child', '', 'Obok tekstu na szerokim ekranie, nad nim na wąskim.'],
        ['align', "'center' | 'start'", "'center'", 'Wyrównanie tekstu, gdy nie ma materiału.'],
        ['level', 'number', '1', 'Poziom nagłówka tytułu. Obniż go dla hero w środku strony.'],
        ['as', 'string', "'section'", 'Element do wyrenderowania.'],
      ]),
      p('Dzieci stają się rzędem akcji pod opisem.'),
    ],
  })
