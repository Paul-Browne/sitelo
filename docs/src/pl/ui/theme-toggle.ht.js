import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Przełącznik motywu',
    description:
      'Przełącznik jasny/ciemny, ze skryptem wbudowanym w stronę, który nie pozwala zapisanemu wyborowi mignąć przy wejściu.',
    activeHref: '/pl/ui/theme-toggle',
    children: [
      p(
        'sitelo-ui samo rozstrzyga tryb ciemny na podstawie ',
        code('prefers-color-scheme'),
        ' — witryna, której odpowiada podążanie za systemem operacyjnym, nie potrzebuje z tej strony niczego. Przełącznik służy do tego, żeby czytający mógł to nadpisać.',
      ),
      p(
        'To jeden z pięciu komponentów, które potrzebują skryptu, bo wybór żyje w ',
        code('localStorage'),
        ', a odczytać go może tylko skrypt. Przycisk sam pobiera ten skrypt przy pierwszym naciśnięciu.',
      ),

      h2('Jak to ustawić'),
      p('Dwie rzeczy w head i przycisk tam, gdzie ma być:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // stosuje zapisany wybór przed pierwszym malowaniem
  styles(),
)

body(
  appBar({ brand: 'Moja strona' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Nie ma trzeciego pliku. ',
        code('themeScript()'),
        ' jest blokujący i wbudowany celowo — cokolwiek odroczonego maluje się jako pierwsze, a to dokładnie ten ciemny błysk, któremu ma zapobiegać — a samo przełączenie jedzie na przycisku:',
      ),
      codeBlock('Wyrenderowane znaczniki', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Używaj ich w parze. ',
        code('themeScript()'),
        ' jest też tym, co przy załadowaniu oznacza przycisk jako ',
        code('aria-pressed'),
        ': nic jeszcze nie zostało naciśnięte, więc sam przycisk nie może wiedzieć, jaki motyw się rozstrzygnął.',
      ),

      h2('Przełącznik'),
      p(
        'Ikona jest czystym CSS-em, czytanym wprost z atrybutu motywu — więc jest poprawna już przy pierwszym malowaniu, zanim wykona się jakikolwiek skrypt. Pokazuje, na co kliknięcie przełączy.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Te przyciski działają — ta strona ładuje runtime. Kliknięcie ustawia ',
        code('data-su-theme'),
        ' na ',
        code('<html>'),
        ', czyli własny atrybut sitelo-ui, więc zmieniają się tylko komponenty sitelo-ui na tej stronie. Reszta witryny idzie za własnym ',
        code('data-theme'),
        ', ustawianym przez przełącznik w górnym pasku. Na Twojej witrynie byłby tylko jeden z nich.',
      ),

      h2('W pasku aplikacji'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Dokumentacja')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Zacznij'),
  ),
)`, { align: 'stretch' }),

      h2('Jak rozstrzyga się motyw'),
      p(
        'Po kolei: wygrywa jawny ',
        code('data-theme'),
        ' albo ',
        code('data-su-theme'),
        ' na dowolnym przodku; w przeciwnym razie decyduje ',
        code('prefers-color-scheme'),
        '. Honorowane są obie nazwy atrybutów, żeby sitelo-ui mogło siedzieć wewnątrz witryny, która ma już własny przełącznik motywu — a dokładnie to robi ta dokumentacja.',
      ),

      h2('Sterowanie samodzielne'),
      p(
        'Runtime eksportuje te same funkcje, których używa przycisk, na własną kontrolkę albo trójstanowy wybór jasny / ciemny / systemowy.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — rozstrzygnięty, nie zapisany
toggleTheme()       // przełącz
setTheme('dark')    // przypnij
setTheme('system')  // zdejmij nadpisanie i znów idź za systemem`, 'javascript'),

      h2('Propsy'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Dostępna nazwa i podpowiedź.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Wariant przycisku.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Z której palety czerpać.'],
      ]),
      p(
        code('themeScript()'),
        ' przyjmuje opcjonalny ',
        code('nonce'),
        ', dla witryny z polityką bezpieczeństwa treści.',
      ),
    ],
  })
