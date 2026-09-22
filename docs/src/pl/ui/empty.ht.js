import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Pusty stan',
    description: 'Jak wygląda lista, zanim cokolwiek się w niej znajdzie.',
    activeHref: '/pl/ui/empty',
    children: [
      p(
        'Puste miejsce czyta się jak błąd. Pusty stan mówi, które miejsce jest puste, dlaczego i co zrobić dalej — a przy tym najłatwiej o nim zapomnieć, bo podczas pracy dane są zawsze.',
      ),

      h2('Podstawowy pusty stan'),
      demo(`empty({
  title: 'Jeszcze żadnych wpisów',
  description: 'Dodaj plik Markdown do src/posts, a pojawi się tutaj.',
})`, { align: 'stretch' }),

      h2('Z ikoną'),
      p(
        'Ikona jest ozdobą — ma ',
        code('aria-hidden'),
        ', bo tytuł już mówi, co się dzieje.',
      ),
      demo(`empty({
  icon: icon('folder'),
  title: 'Nic tu nie ma',
  description: 'Ten katalog nie zawiera żadnych stron.',
})`, { align: 'stretch' }),

      h2('Z akcją'),
      p('Dzieci stają się rzędem akcji.'),
      demo(`empty({
  icon: icon('search'),
  title: 'Brak wyników dla „wyspy”',
  description: 'Sprawdź pisownię albo przejrzyj dokumentację.',
},
  button({ href: '/docs' }, 'Przeglądaj dokumentację'),
  button({ variant: 'outline', color: 'neutral' }, 'Wyczyść wyszukiwanie'),
)`, { align: 'stretch' }),

      h2('W karcie'),
      demo(`card(
  cardHeader({ title: 'Wdrożenia' }),
  cardBody(
    empty({
      title: 'Jeszcze żadnych wdrożeń',
      description: 'Wypchnij na main, a pierwszy build pojawi się tutaj.',
    }, button({ size: 'sm' }, 'Podepnij repozytorium')),
  ),
)`, { align: 'stretch' }),

      h2('Zamiast tabeli'),
      p(
        'Podmień tabelę na pusty stan, zamiast renderować nagłówek bez żadnych wierszy pod nim.',
      ),
      demo(`return (() => {
  const rows = []

  return card(
    cardHeader({ title: 'Historia buildów' }),
    rows.length
      ? table({ columns: [{ key: 'commit', header: 'Commit' }], rows })
      : cardBody(empty({
          title: 'Brak zapisanych buildów',
          description: 'Uruchomienia pojawią się tutaj, gdy witryna zostanie wdrożona choć raz.',
        })),
  )
})()`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['icon', 'Child', '', 'Ozdobny znak nad tytułem; ukryty przed czytnikami ekranu.'],
        ['title', 'Child', '', 'Co jest puste, w kilku słowach.'],
        ['description', 'Child', '', 'Dlaczego jest puste albo co z tym zrobić.'],
      ]),
      p('Dzieci renderują się jako rząd akcji pod opisem.'),
    ],
  })
